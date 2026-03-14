#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_EVIDENCE_DIR = resolve(ROOT, 'evidence');
const DEFAULT_TEMPLATE = resolve(ROOT, '..', 'pjdhiro', 'assets', 'creation', 'manifests', 'domains.json');

const PROGRESS_LEVELS = new Set([
  'not_surveyed',
  'claude_screened',
  'claude_gpt_reviewed',
  'api_deepdive',
  'codex_parallel_deepdive',
  'human_reviewed',
]);

const PROGRESS_LABELS = {
  not_surveyed: {
    ja: 'Claude・GPTによる調査未実施',
    en: 'No AI-assisted survey conducted yet',
  },
  claude_screened: {
    ja: 'Claudeとの対話（1セッション）で候補理論を抽出した',
    en: 'Candidate theories extracted via single-session Claude dialogue',
  },
  claude_gpt_reviewed: {
    ja: 'Claude抽出後、ChatGPTによる独立レビューと突き合わせを実施した',
    en: 'Claude screening followed by independent ChatGPT review cross-check',
  },
  api_deepdive: {
    ja: 'Claude Code Agentによる逐次多ラウンド深掘り探索を実施した',
    en: 'Multi-round sequential deep exploration via Claude Code Agent',
  },
  codex_parallel_deepdive: {
    ja: 'Codex CLIマルチエージェント（並列）による深掘り探索を実施した',
    en: 'Parallel multi-agent deep exploration via Codex CLI (gpt-5.4 xhigh)',
  },
  human_reviewed: {
    ja: 'Claude＋GPT照合に加え、著者による最終確認を実施した',
    en: 'Claude + GPT review plus author final confirmation',
  },
};

function printHelp() {
  console.log('Generate domains.json from evidence files');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/gen-domains-json.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output <path>     Write JSON to a file (default: stdout)');
  console.log('  --dry-run           Compare generated JSON against existing manifest and print differences only');
  console.log('  --template <path>   Existing domains.json used as template and dry-run baseline');
  console.log('  --help, -h          Show this help');
}

function parseArgs(argv) {
  const options = {
    output: '',
    dryRun: false,
    template: DEFAULT_TEMPLATE,
    evidenceDir: DEFAULT_EVIDENCE_DIR,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--output') {
      options.output = resolve(ROOT, String(argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (arg === '--template') {
      options.template = resolve(ROOT, String(argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { help: false, options };
}

function extractFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split('\n')) {
    const parsed = line.match(/^([A-Za-z0-9_]+):\s*(.+)\s*$/);
    if (!parsed) continue;
    const key = parsed[1];
    let value = parsed[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function inferProgressLevel(frontMatter, body, size) {
  const explicit = typeof frontMatter.progress_level === 'string' ? frontMatter.progress_level.trim() : '';
  if (PROGRESS_LEVELS.has(explicit)) {
    if (explicit === 'human_reviewed') {
      return explicit;
    }
    return explicit;
  }

  if (size < 500 || Number(frontMatter.entry_count || '0') === 0) {
    return 'not_surveyed';
  }

  if (/\[ai:deepdive-codex:[^\]]+\]/.test(body)) {
    return 'codex_parallel_deepdive';
  }

  if (/\[ai:deepdive-claude:[^\]]+\]/.test(body)) {
    return 'api_deepdive';
  }

  if (/deepdive済/.test(frontMatter.status || '') && /\[ai:Codex:[^\]]+\]/.test(body)) {
    return 'codex_parallel_deepdive';
  }

  if (/deepdive済/.test(frontMatter.status || '') && /\[ai:Claude:[^\]]+\]/.test(body)) {
    return 'api_deepdive';
  }

  if (/GPTレビュー突き合わせ済み/.test(frontMatter.status || '')) {
    return 'claude_gpt_reviewed';
  }

  if (/\[gpt:reviewed\]/.test(body)) {
    return 'claude_gpt_reviewed';
  }

  const judgmentCount = countMatches(body, /^#### \[判断\]/gm);
  const reviewedCount = countMatches(body, /GPTレビュー済み|GPTレビュー突き合わせ済み/g);
  if (reviewedCount > 0 && reviewedCount * 2 >= Math.max(judgmentCount, 1)) {
    return 'claude_gpt_reviewed';
  }

  return 'claude_screened';
}

async function loadEvidenceProgress(evidenceDir) {
  const progressById = new Map();
  const files = await readdir(evidenceDir);
  const fileById = new Map();

  for (const file of files) {
    const match = file.match(/^evidence-(D\d{2})-.*\.md$/);
    if (!match) continue;
    fileById.set(match[1], resolve(evidenceDir, file));
  }

  for (let domainNumber = 1; domainNumber <= 30; domainNumber += 1) {
    const domainId = `D${String(domainNumber).padStart(2, '0')}`;
    const resolved = fileById.get(domainId);
    if (!resolved) {
      progressById.set(domainId, 'not_surveyed');
      continue;
    }

    const body = await readFile(resolved, 'utf8');
    const info = await stat(resolved);
    const frontMatter = extractFrontMatter(body);
    progressById.set(domainId, inferProgressLevel(frontMatter, body, info.size));
  }

  return progressById;
}

function buildOutput(template, progressById) {
  const reports = template.reports.map((report) => {
    const progressLevel = progressById.get(report.id) || 'not_surveyed';
    const labels = PROGRESS_LABELS[progressLevel];
    return {
      ...report,
      progress_level: progressLevel,
      label_description_ja: labels.ja,
      label_description_en: labels.en,
    };
  });

  return {
    version: template.version || '3.0',
    generated_at: new Date().toISOString(),
    namespace: template.namespace || 'domains',
    reports,
  };
}

function buildDiff(existing, generated) {
  const diffs = [];

  const existingReports = Array.isArray(existing.reports) ? existing.reports : [];
  const generatedReports = Array.isArray(generated.reports) ? generated.reports : [];

  if (existingReports.length !== generatedReports.length) {
    diffs.push(`report_count: ${existingReports.length} -> ${generatedReports.length}`);
  }

  const existingMap = new Map(existingReports.map((report) => [report.id, report]));
  for (const report of generatedReports) {
    const current = existingMap.get(report.id);
    if (!current) {
      diffs.push(`${report.id}: missing from existing manifest`);
      continue;
    }

    for (const field of ['progress_level', 'label_description_ja', 'label_description_en']) {
      if ((current[field] || '') !== (report[field] || '')) {
        diffs.push(`${report.id}.${field}: "${current[field] || ''}" -> "${report[field] || ''}"`);
      }
    }
  }

  return diffs;
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  const template = JSON.parse(await readFile(options.template, 'utf8'));
  const progressById = await loadEvidenceProgress(options.evidenceDir);
  const output = buildOutput(template, progressById);
  const json = JSON.stringify(output, null, 2) + '\n';

  if (options.dryRun) {
    const diffs = buildDiff(template, output);
    if (diffs.length === 0) {
      console.log('No differences found.');
      return;
    }
    for (const diff of diffs) {
      console.log(diff);
    }
    return;
  }

  if (options.output) {
    await writeFile(options.output, json, 'utf8');
    console.log(options.output);
    return;
  }

  process.stdout.write(json);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
