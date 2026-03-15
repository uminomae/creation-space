#!/usr/bin/env node

/**
 * Generate pjdhiro domains.json from creation-space index.json.
 * cs#27: domains.json 自動生成
 */

import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_INDEX_JSON = resolve(ROOT, 'transform', 'domains', 'publish', 'domains', 'index.json');
const DEFAULT_PUBLISH_REPO = resolve(ROOT, '..', 'pjdhiro');

function printHelp() {
  console.log('Generate domains.json from index.json (cs#27)');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/generate-domains-json.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --index-json <path>    Source index.json (default: transform/domains/publish/domains/index.json)');
  console.log('  --publish-repo <path>  Publish repo root (default: ../pjdhiro)');
  console.log('  --output <path>        Output path (default: <publish-repo>/assets/creation/manifests/domains.json)');
  console.log('  --dry-run              Print to stdout instead of writing');
  console.log('  --check                Compare with existing file and report differences');
  console.log('  --help, -h             Show this help');
}

function parseArgs(argv) {
  const options = {
    indexJson: DEFAULT_INDEX_JSON,
    publishRepo: DEFAULT_PUBLISH_REPO,
    output: '',
    dryRun: false,
    check: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--index-json') {
      options.indexJson = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--publish-repo') {
      options.publishRepo = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--output') {
      options.output = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--check') {
      options.check = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  options.indexJson = resolvePath(options.indexJson);
  options.publishRepo = resolvePath(options.publishRepo);
  options.output = options.output
    ? resolvePath(options.output)
    : resolve(options.publishRepo, 'assets', 'creation', 'manifests', 'domains.json');

  return { help: false, options };
}

function resolvePath(pathValue) {
  return isAbsolute(pathValue) ? pathValue : resolve(ROOT, pathValue);
}

// --- Taxonomy ---

function buildTaxonomyMap(progressTaxonomy) {
  const map = new Map();
  for (const entry of progressTaxonomy) {
    map.set(entry.id, {
      description_ja: entry.description_ja,
      description_en: entry.description_en,
    });
  }
  return map;
}

// --- generator_model ---

function buildGeneratorModel(progressModel) {
  if (!Array.isArray(progressModel) || progressModel.length === 0) return 'unknown';
  if (progressModel.length === 1 && progressModel[0] === 'unknown') return 'unknown';

  return progressModel.map((model) => {
    if (model === 'unknown') return 'unknown';
    if (model.startsWith('codex')) return `codex:${model}`;
    if (model.startsWith('claude')) return `claude:${model}`;
    if (model.startsWith('gpt')) return `gpt:${model}`;
    return model;
  }).join('+');
}

// --- File existence ---

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

/**
 * Find the actual slug used in pjdhiro filenames for a given domain ID.
 * First tries the slug from index.json; if not found, scans the directory.
 */
async function resolveSlug(domainId, indexSlug, publishBase) {
  const jaMdDir = resolve(publishBase, 'domains', 'ja', 'md');
  const expectedFile = `domain-${domainId}-${indexSlug}.md`;
  const expectedPath = resolve(jaMdDir, expectedFile);

  if (await fileExists(expectedPath)) {
    return indexSlug;
  }

  // Fallback: scan directory for domain-{id}-*.md
  try {
    const files = await readdir(jaMdDir);
    const prefix = `domain-${domainId}-`;
    const match = files.find((f) => f.startsWith(prefix) && f.endsWith('.md'));
    if (match) {
      return match.slice(prefix.length, -3); // extract slug
    }
  } catch {
    // directory doesn't exist
  }

  return indexSlug; // use index slug even if no file found
}

async function checkDomainFiles(domainId, slug, publishBase) {
  const base = resolve(publishBase, 'assets', 'creation');
  const prefix = `domain-${domainId}-${slug}`;

  const paths = {
    ja: {
      md: `domains/ja/md/${prefix}.md`,
      pdf: `domains/ja/pdf/${prefix}.pdf`,
    },
    en: {
      md: `domains/en/md/${prefix}.md`,
      pdf: `domains/en/pdf/${prefix}.pdf`,
    },
  };

  const exists = {
    jaMd: await fileExists(resolve(base, paths.ja.md)),
    jaPdf: await fileExists(resolve(base, paths.ja.pdf)),
    enMd: await fileExists(resolve(base, paths.en.md)),
    enPdf: await fileExists(resolve(base, paths.en.pdf)),
  };

  // status: published if JA md+pdf both exist, draft if md only, planned otherwise
  let status;
  if (exists.jaMd && exists.jaPdf) {
    status = 'published';
  } else if (exists.jaMd) {
    status = 'draft';
  } else {
    status = 'planned';
  }

  return { paths, exists, status };
}

// --- Main generation ---

async function generate(options) {
  const raw = await readFile(options.indexJson, 'utf8');
  const index = JSON.parse(raw);

  if (!Array.isArray(index.progress_taxonomy)) {
    throw new Error('index.json missing progress_taxonomy array');
  }
  if (!Array.isArray(index.reports)) {
    throw new Error('index.json missing reports array');
  }

  const taxonomy = buildTaxonomyMap(index.progress_taxonomy);
  const publishBase = resolve(options.publishRepo, 'assets', 'creation');
  const warnings = [];

  const reports = [];
  for (const entry of index.reports) {
    const slug = await resolveSlug(entry.id, entry.slug, publishBase);
    if (slug !== entry.slug) {
      warnings.push(`${entry.id}: slug fallback "${entry.slug}" → "${slug}"`);
    }

    const fileCheck = await checkDomainFiles(entry.id, slug, options.publishRepo);
    const taxEntry = taxonomy.get(entry.progress_level);
    if (!taxEntry) {
      warnings.push(`${entry.id}: unknown progress_level "${entry.progress_level}"`);
    }

    const report = {
      id: entry.id,
      name_ja: entry.name_ja,
      slug,
      status: fileCheck.status,
      progress_level: entry.progress_level,
    };

    // md/pdf paths (only include if files exist)
    if (fileCheck.exists.jaMd || fileCheck.exists.enMd) {
      report.md = {};
      if (fileCheck.exists.jaMd) report.md.ja = fileCheck.paths.ja.md;
      if (fileCheck.exists.enMd) report.md.en = fileCheck.paths.en.md;
    }
    if (fileCheck.exists.jaPdf || fileCheck.exists.enPdf) {
      report.pdf = {};
      if (fileCheck.exists.jaPdf) report.pdf.ja = fileCheck.paths.ja.pdf;
      if (fileCheck.exists.enPdf) report.pdf.en = fileCheck.paths.en.pdf;
    }

    report.label_description_ja = taxEntry?.description_ja ?? '';
    report.label_description_en = taxEntry?.description_en ?? '';
    report.generator_model = buildGeneratorModel(entry.progress_model);

    reports.push(report);
  }

  const output = {
    version: '3.0',
    generated_at: new Date().toISOString(),
    namespace: 'domains',
    reports,
  };

  return { output, warnings };
}

async function runCheck(options, generated) {
  let existing;
  try {
    const raw = await readFile(options.output, 'utf8');
    existing = JSON.parse(raw);
  } catch {
    console.log('No existing file to compare.');
    return 1;
  }

  const diffs = [];

  // Compare report count
  if (existing.reports?.length !== generated.reports.length) {
    diffs.push(`Report count: ${existing.reports?.length ?? 0} → ${generated.reports.length}`);
  }

  // Compare each report
  const existingMap = new Map((existing.reports || []).map((r) => [r.id, r]));
  for (const gen of generated.reports) {
    const ex = existingMap.get(gen.id);
    if (!ex) {
      diffs.push(`${gen.id}: NEW (not in existing)`);
      continue;
    }

    const fields = ['slug', 'status', 'progress_level', 'label_description_ja', 'label_description_en', 'generator_model'];
    for (const field of fields) {
      if (JSON.stringify(ex[field]) !== JSON.stringify(gen[field])) {
        diffs.push(`${gen.id}.${field}: "${ex[field]}" → "${gen[field]}"`);
      }
    }

    // Compare md/pdf paths
    for (const format of ['md', 'pdf']) {
      for (const lang of ['ja', 'en']) {
        const exPath = ex[format]?.[lang] ?? '';
        const genPath = gen[format]?.[lang] ?? '';
        if (exPath !== genPath) {
          diffs.push(`${gen.id}.${format}.${lang}: "${exPath}" → "${genPath}"`);
        }
      }
    }
  }

  if (diffs.length === 0) {
    console.log('No differences found.');
    return 0;
  }

  console.log(`Found ${diffs.length} difference(s):`);
  for (const diff of diffs) {
    console.log(`  - ${diff}`);
  }
  return 1;
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  console.log('generate-domains-json (cs#27)');
  console.log(`  index-json: ${options.indexJson}`);
  console.log(`  publish-repo: ${options.publishRepo}`);
  console.log(`  output: ${options.output}`);

  const { output, warnings } = await generate(options);

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  ⚠ ${w}`);
    }
  }

  console.log(`\nGenerated ${output.reports.length} domains`);

  const json = JSON.stringify(output, null, 2) + '\n';

  if (options.check) {
    const exitCode = await runCheck(options, output);
    process.exitCode = exitCode;
    return;
  }

  if (options.dryRun) {
    console.log('\n--- dry-run output ---');
    process.stdout.write(json);
    return;
  }

  await writeFile(options.output, json, 'utf8');
  console.log(`Written to ${options.output}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
