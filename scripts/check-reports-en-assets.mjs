#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const issue62Dir = path.join(repoRoot, 'assets', 'reports', 'issue62');
const modelGuidesDir = path.join(repoRoot, 'assets', 'reports', 'model-guides');
const domainsIndexPath = path.join(issue62Dir, 'domains', 'index.json');

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function withEnglishAssetSuffix(assetPath) {
  if (typeof assetPath !== 'string' || !assetPath.trim()) return '';
  const trimmed = assetPath.trim();

  if (/-en(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
    return trimmed;
  }
  if (/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
    return trimmed.replace(/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i, '-en');
  }
  if (/\.[a-z0-9]+(?:[?#].*)?$/i.test(trimmed)) {
    return trimmed.replace(/(\.[a-z0-9]+(?:[?#].*)?)$/i, '-en$1');
  }
  return `${trimmed}-en`;
}

function checkItem(label, relPath, out) {
  const ok = exists(relPath);
  out.push({ label, relPath, ok });
}

function loadDomainsIndex() {
  try {
    const raw = fs.readFileSync(domainsIndexPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[check-reports-en-assets] failed to read ${domainsIndexPath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}

const checks = [];

checkItem('status markdown', path.join('assets', 'reports', 'issue62', 'issue62-status-en.md'), checks);
checkItem('status pdf', path.join('assets', 'reports', 'issue62', 'creation-issue62-status-en.pdf'), checks);

const modelGuideBaseFiles = [
  'kesson-general-draft.md',
  'kesson-designer-draft.md',
  'kesson-academic-draft.md',
];

for (const baseFile of modelGuideBaseFiles) {
  const enFile = withEnglishAssetSuffix(baseFile);
  checkItem(`model guide markdown (${baseFile})`, path.join('assets', 'reports', 'model-guides', enFile), checks);
  const basePdf = baseFile.replace('-draft.md', '.pdf');
  const enPdf = withEnglishAssetSuffix(basePdf);
  checkItem(`model guide pdf (${basePdf})`, path.join('assets', 'reports', 'model-guides', enPdf), checks);
}

const domainsIndex = loadDomainsIndex();
const reports = Array.isArray(domainsIndex?.reports) ? domainsIndex.reports : [];

for (const report of reports) {
  if (report?.status !== 'published') continue;
  if (typeof report.md === 'string' && report.md.trim()) {
    const normalizedMd = report.md.replace(/^\.\//, '');
    const enMd = withEnglishAssetSuffix(normalizedMd);
    checkItem(`domain markdown (${report.id || 'unknown'})`, path.join('assets', 'reports', 'issue62', enMd), checks);
  }
  if (typeof report.pdf === 'string' && report.pdf.trim()) {
    const normalizedPdf = report.pdf.replace(/^\.\//, '');
    const enPdf = withEnglishAssetSuffix(normalizedPdf);
    checkItem(`domain pdf (${report.id || 'unknown'})`, path.join('assets', 'reports', 'issue62', enPdf), checks);
  }
}

const missing = checks.filter((entry) => !entry.ok);
const present = checks.length - missing.length;

console.log(`[check-reports-en-assets] root: ${repoRoot}`);
console.log(`[check-reports-en-assets] issue62 dir: ${issue62Dir}`);
console.log(`[check-reports-en-assets] model guides dir: ${modelGuidesDir}`);
console.log(`[check-reports-en-assets] present: ${present}, missing: ${missing.length}, total: ${checks.length}`);

for (const entry of checks) {
  const status = entry.ok ? 'OK   ' : 'MISS ';
  console.log(`${status} ${entry.label}: ${entry.relPath}`);
}

if (missing.length > 0) {
  process.exit(1);
}
