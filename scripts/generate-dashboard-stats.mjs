#!/usr/bin/env node

/**
 * Generate dashboard-stats.json from creation-space SoT.
 *
 * dashboard.html の「全体地図」件数（原典 manifest 内訳・精読ノート数・領域数）が
 * 手集計のままドリフトしていた問題への対処。cs リポジトリから算出可能な数値を
 * 決定的に生成し、dashboard.html が fetch して表示する。
 *
 * 算出対象（cs SoT 由来のみ）:
 *   - manifest access_status 内訳（raw-confirmed / url-verified / blocked-access / citation-only）
 *   - 精読ノート数（knowledge/source-notes/**\/D{NN}-S{##}_*.md）
 *   - cs Web 領域数（index.json reports[]）
 *
 * 算出対象外（cross-repo / 編集判断のため dashboard.html に手集計で残す）:
 *   - pd wiki 解説ページ数（外部リポジトリ）
 *   - pd 補完進捗 13/71（pd wiki との cross-check 由来）
 *   - DONE / STUCK リスト（編集判断）
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const MANIFEST = resolve(ROOT, 'knowledge', 'raw', 'manifest.md');
const SOURCE_NOTES_DIR = resolve(ROOT, 'knowledge', 'source-notes');
const INDEX_JSON = resolve(ROOT, 'transform', 'domains', 'publish', 'domains', 'index.json');
const DEFAULT_OUTPUT = resolve(ROOT, 'assets', 'dashboard-stats.json');

function printHelp() {
  console.log('Generate assets/dashboard-stats.json from cs SoT');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/generate-dashboard-stats.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output <path>  Output path (default: assets/dashboard-stats.json)');
  console.log('  --dry-run        Print to stdout instead of writing');
  console.log('  --check          Compare with existing file; exit 1 on difference');
  console.log('  --help, -h       Show this help');
}

function parseArgs(argv) {
  const options = { output: DEFAULT_OUTPUT, dryRun: false, check: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--output') { options.output = String(argv[i + 1] || '').trim(); i += 1; continue; }
    if (arg === '--dry-run') { options.dryRun = true; continue; }
    if (arg === '--check') { options.check = true; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return { help: false, options };
}

async function countManifestStatuses() {
  const text = await readFile(MANIFEST, 'utf8');
  const counts = { 'raw-confirmed': 0, 'url-verified': 0, 'blocked-access': 0, 'citation-only': 0 };
  // manifest 行の access_status 列はバッククォート囲みの status トークン
  const re = /\|\s*`(raw-confirmed|url-verified|blocked-access|citation-only)`/g;
  let m;
  while ((m = re.exec(text)) !== null) counts[m[1]] += 1;
  return counts;
}

async function countSourceNotes(dir) {
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      total += await countSourceNotes(p);
    } else if (e.isFile() && /^D\d+-S\d+_.*\.md$/.test(e.name)) {
      total += 1;
    }
  }
  return total;
}

async function countDomains() {
  const data = JSON.parse(await readFile(INDEX_JSON, 'utf8'));
  return Array.isArray(data.reports) ? data.reports.length : 0;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function buildStats() {
  const status = await countManifestStatuses();
  const sourceNotes = await countSourceNotes(SOURCE_NOTES_DIR);
  const domains = await countDomains();

  const raw = status['raw-confirmed'];
  const url = status['url-verified'];
  const blocked = status['blocked-access'];
  const cite = status['citation-only'];

  return {
    generated: todayISO(),
    source: 'scripts/generate-dashboard-stats.mjs',
    manifest: {
      raw_confirmed: raw,
      url_verified: url,
      blocked_access: blocked,
      citation_only: cite,
      total: raw + url + blocked + cite,
      readable: raw + url,
      unread: blocked + cite,
    },
    source_notes: sourceNotes,
    cs_domains: domains,
  };
}

// generated（日付）は毎回変わるため、--check では実数フィールドのみ比較する
function stripVolatile(stats) {
  const { generated, ...rest } = stats;
  return rest;
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) { printHelp(); return; }

  const stats = await buildStats();
  const json = `${JSON.stringify(stats, null, 2)}\n`;

  if (options.dryRun) { process.stdout.write(json); return; }

  if (options.check) {
    let existing = null;
    try { existing = JSON.parse(await readFile(options.output, 'utf8')); }
    catch { console.error('FAIL: existing dashboard-stats.json not found or invalid'); process.exit(1); }
    const a = JSON.stringify(stripVolatile(stats));
    const b = JSON.stringify(stripVolatile(existing));
    if (a !== b) {
      console.error('FAIL: dashboard-stats.json is stale. Re-run without --check.');
      console.error('  computed:', a);
      console.error('  on-disk :', b);
      process.exit(1);
    }
    console.log('OK: dashboard-stats.json is up to date.');
    return;
  }

  await writeFile(options.output, json, 'utf8');
  console.log(`Wrote ${options.output}`);
  console.log(`  manifest: readable ${stats.manifest.readable} / total ${stats.manifest.total} (raw ${stats.manifest.raw_confirmed} + url ${stats.manifest.url_verified}); unread ${stats.manifest.unread}`);
  console.log(`  source-notes: ${stats.source_notes} / cs domains: ${stats.cs_domains}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
