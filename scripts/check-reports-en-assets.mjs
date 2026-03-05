#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const enforceEnglishPdf = process.argv.includes('--require-en-pdf');

const issue62Dir = path.join(repoRoot, 'assets', 'reports', 'issue62');
const creationRootDir = path.join(repoRoot, 'assets', 'creation');
const domainsIndexPath = path.join(issue62Dir, 'domains', 'index.json');

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function checkItem(label, relPath, out, options = {}) {
  const required = options.required !== false;
  const ok = exists(relPath);
  out.push({ label, relPath, ok, required });
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

checkItem('status markdown', path.join('assets', 'creation', 'survey', 'en', 'md', 'commentary-status.md'), checks);
checkItem(
  'status pdf',
  path.join('assets', 'creation', 'survey', 'en', 'pdf', 'commentary-status.pdf'),
  checks,
  { required: enforceEnglishPdf },
);

const modelGuideBaseNames = [
  'general',
  'designer',
  'academic',
];

for (const baseName of modelGuideBaseNames) {
  checkItem(
    `model guide markdown (${baseName})`,
    path.join('assets', 'creation', 'guides', 'en', 'md', `creation-${baseName}.md`),
    checks,
  );
  checkItem(
    `model guide pdf (${baseName})`,
    path.join('assets', 'creation', 'guides', 'en', 'pdf', `creation-${baseName}.pdf`),
    checks,
    { required: enforceEnglishPdf },
  );
}

const domainsIndex = loadDomainsIndex();
const reports = Array.isArray(domainsIndex?.reports) ? domainsIndex.reports : [];

for (const report of reports) {
  if (report?.status !== 'published') continue;
  const idLower = typeof report.id === 'string' ? report.id.trim().toLowerCase() : '';
  const slug = typeof report.slug === 'string' ? report.slug.trim() : '';
  if (!idLower || !slug) continue;
  const baseName = `commentary-domain-${idLower}-${slug}-academic`;

  checkItem(
    `domain markdown (${report.id || 'unknown'})`,
    path.join('assets', 'creation', 'domains', 'en', 'md', `${baseName}.md`),
    checks,
  );
  checkItem(
    `domain pdf (${report.id || 'unknown'})`,
    path.join('assets', 'creation', 'domains', 'en', 'pdf', `${baseName}.pdf`),
    checks,
    { required: enforceEnglishPdf },
  );
}

const requiredMissing = checks.filter((entry) => entry.required && !entry.ok);
const optionalMissing = checks.filter((entry) => !entry.required && !entry.ok);
const present = checks.filter((entry) => entry.ok).length;

console.log(`[check-reports-en-assets] root: ${repoRoot}`);
console.log(`[check-reports-en-assets] issue62 dir: ${issue62Dir}`);
console.log(`[check-reports-en-assets] creation dir: ${creationRootDir}`);
console.log(`[check-reports-en-assets] require EN pdf: ${enforceEnglishPdf}`);
console.log(
  `[check-reports-en-assets] present: ${present}, required-missing: ${requiredMissing.length}, optional-missing: ${optionalMissing.length}, total: ${checks.length}`,
);

for (const entry of checks) {
  let status = 'OK   ';
  if (!entry.ok) {
    status = entry.required ? 'MISS ' : 'WARN ';
  }
  console.log(`${status} ${entry.label}: ${entry.relPath}`);
}

if (requiredMissing.length > 0) {
  process.exit(1);
}
