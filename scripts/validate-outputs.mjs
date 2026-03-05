#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const allowMissingPdf = args.has('--allow-missing-pdf');
const verbose = args.has('--verbose');

const MIN_PDF_SIZE_BYTES = 10 * 1024;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
const HTML_MIX_RE = /<\s*(?:!doctype|html|head|body|script|style|meta|link|iframe|object|embed)\b/i;
const PDF_ERROR_SNIPPET_RE = /(?:<!doctype html|<html|<head|<body|jekyll|page not found|404\s*not\s*found|there isn't a github pages site here)/i;

const counts = {
  checkedMd: 0,
  checkedPdf: 0,
  checkedPaths: 0,
  missingPdf: 0,
};

const failures = [];
const warnings = [];
const passes = [];

function toRel(relPath) {
  return relPath.replace(/^[./]+/, '');
}

function toAbs(relPath) {
  return path.join(repoRoot, toRel(relPath));
}

function pushPass(message) {
  passes.push(message);
}

function pushFailure(message) {
  failures.push(message);
}

function pushWarning(message) {
  warnings.push(message);
}

function walkFiles(rootAbs, extension) {
  if (!fs.existsSync(rootAbs)) return [];
  const out = [];
  const stack = [rootAbs];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        out.push(path.relative(repoRoot, abs));
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

function parseFrontmatter(markdown) {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) return null;

  const meta = {};
  const frontMatterLines = match[1].split(/\r?\n/);
  for (const line of frontMatterLines) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1].trim();
    const rawValue = kv[2].trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '').trim();
    meta[key] = value;
  }

  return {
    meta,
    body: match[2],
  };
}

function checkMarkdown(relPath) {
  const absPath = toAbs(relPath);
  counts.checkedMd += 1;

  if (!fs.existsSync(absPath)) {
    pushFailure(`[md] missing file: ${toRel(relPath)}`);
    return;
  }

  const raw = fs.readFileSync(absPath, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    pushFailure(`[md] missing front matter: ${toRel(relPath)}`);
    return;
  }

  for (const key of ['title', 'audience', 'lang']) {
    if (!parsed.meta[key]) {
      pushFailure(`[md] missing required front matter key (${key}): ${toRel(relPath)}`);
    }
  }

  if (!parsed.body || !parsed.body.trim()) {
    pushFailure(`[md] empty markdown body: ${toRel(relPath)}`);
  }

  if (HTML_MIX_RE.test(parsed.body)) {
    pushFailure(`[md] HTML-looking content detected in body: ${toRel(relPath)}`);
  }

  if (!failures.some((msg) => msg.includes(`: ${toRel(relPath)}`))) {
    pushPass(`[md] ok: ${toRel(relPath)}`);
  }
}

function checkPdf(relPath, options = {}) {
  const required = options.required !== false;
  const absPath = toAbs(relPath);
  counts.checkedPdf += 1;

  if (!fs.existsSync(absPath)) {
    counts.missingPdf += 1;
    if (required) {
      pushFailure(`[pdf] missing file: ${toRel(relPath)}`);
    } else {
      pushWarning(`[pdf] missing file (allowed): ${toRel(relPath)}`);
    }
    return;
  }

  const stat = fs.statSync(absPath);
  if (!stat.isFile()) {
    pushFailure(`[pdf] not a regular file: ${toRel(relPath)}`);
    return;
  }

  if (stat.size <= MIN_PDF_SIZE_BYTES) {
    pushFailure(`[pdf] file too small (<=10KB): ${toRel(relPath)} (${stat.size} bytes)`);
    return;
  }

  const bytes = fs.readFileSync(absPath);
  if (bytes.length < 5 || bytes.subarray(0, 5).toString('utf8') !== '%PDF-') {
    pushFailure(`[pdf] invalid PDF header: ${toRel(relPath)}`);
    return;
  }

  const sample = bytes.subarray(0, Math.min(bytes.length, 4096)).toString('utf8');
  if (PDF_ERROR_SNIPPET_RE.test(sample)) {
    pushFailure(`[pdf] looks like HTML/Jekyll error content: ${toRel(relPath)}`);
    return;
  }

  pushPass(`[pdf] ok: ${toRel(relPath)}`);
}

function checkPathExists(relPath) {
  const normalized = toRel(relPath);
  const absPath = toAbs(normalized);
  counts.checkedPaths += 1;

  if (!fs.existsSync(absPath)) {
    pushFailure(`[paths] reports.js path target missing: ${normalized}`);
    return false;
  }

  pushPass(`[paths] exists: ${normalized}`);
  return true;
}

function checkReportsJsPathPolicy() {
  const reportsJsPath = toAbs('src/reports.js');
  if (!fs.existsSync(reportsJsPath)) {
    pushFailure('[paths] src/reports.js not found');
    return;
  }

  const reportsJs = fs.readFileSync(reportsJsPath, 'utf8');

  const requiredSnippets = [
    'mdUrl: `${LOCAL_CREATION_SURVEY_ROOT}/en/md/survey-status.md`',
    'pdfUrl: `${LOCAL_CREATION_SURVEY_ROOT}/en/pdf/survey-status.pdf`',
    'mdUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/md/creation-general.md`',
    'pdfUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/pdf/creation-general.pdf`',
    'mdUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/md/creation-designer.md`',
    'pdfUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/pdf/creation-designer.pdf`',
    'mdUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/md/creation-academic.md`',
    'pdfUrl: `${LOCAL_CREATION_GUIDES_ROOT}/ja/pdf/creation-academic.pdf`',
    'const baseName = `domain-${idLower}-${slug}-academic`;',
  ];

  const forbiddenSnippets = [
    'commentary-status',
    'commentary-domain-',
    'LOCAL_MODEL_GUIDES_ROOT',
  ];

  for (const snippet of requiredSnippets) {
    if (!reportsJs.includes(snippet)) {
      pushFailure(`[paths] reports.js missing required snippet: ${snippet}`);
    }
  }

  for (const snippet of forbiddenSnippets) {
    if (reportsJs.includes(snippet)) {
      pushFailure(`[paths] reports.js still contains legacy snippet: ${snippet}`);
    }
  }

  if (!failures.some((msg) => msg.startsWith('[paths] reports.js'))) {
    pushPass('[paths] reports.js path policy: ok');
  }
}

function buildExpectedReportsJsPaths() {
  const expected = new Set([
    'assets/reports/issue62/issue62-status-ja.md',
    'assets/reports/issue62/creation-issue62-status-ja.pdf',
    'assets/creation/survey/en/md/survey-status.md',
    'assets/creation/survey/en/pdf/survey-status.pdf',
    'assets/creation/guides/ja/md/creation-general.md',
    'assets/creation/guides/ja/pdf/creation-general.pdf',
    'assets/creation/guides/ja/md/creation-designer.md',
    'assets/creation/guides/ja/pdf/creation-designer.pdf',
    'assets/creation/guides/ja/md/creation-academic.md',
    'assets/creation/guides/ja/pdf/creation-academic.pdf',
    'assets/creation/guides/en/md/creation-general.md',
    'assets/creation/guides/en/pdf/creation-general.pdf',
    'assets/creation/guides/en/md/creation-designer.md',
    'assets/creation/guides/en/pdf/creation-designer.pdf',
    'assets/creation/guides/en/md/creation-academic.md',
    'assets/creation/guides/en/pdf/creation-academic.pdf',
  ]);

  const domainsIndexPath = toAbs('assets/reports/issue62/domains/index.json');
  if (!fs.existsSync(domainsIndexPath)) {
    pushFailure('[paths] missing domains index: assets/reports/issue62/domains/index.json');
    return expected;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(domainsIndexPath, 'utf8'));
  } catch (error) {
    pushFailure(`[paths] failed to parse domains index JSON: ${error instanceof Error ? error.message : String(error)}`);
    return expected;
  }

  const reports = Array.isArray(parsed?.reports) ? parsed.reports : [];
  for (const report of reports) {
    if (report?.status !== 'published') continue;
    const idLower = typeof report?.id === 'string' ? report.id.trim().toLowerCase() : '';
    const slug = typeof report?.slug === 'string' ? report.slug.trim() : '';
    if (!idLower || !slug) continue;

    const baseName = `domain-${idLower}-${slug}-academic`;
    for (const lang of ['ja', 'en']) {
      expected.add(`assets/creation/domains/${lang}/md/${baseName}.md`);
      expected.add(`assets/creation/domains/${lang}/pdf/${baseName}.pdf`);
    }
  }

  return expected;
}

function run() {
  const creationMarkdownFiles = walkFiles(toAbs('assets/creation'), '.md');
  const creationPdfFiles = walkFiles(toAbs('assets/creation'), '.pdf');

  for (const relPath of creationMarkdownFiles) {
    checkMarkdown(relPath);
  }

  for (const relPath of creationPdfFiles) {
    checkPdf(relPath, { required: true });
  }

  checkReportsJsPathPolicy();

  const expectedReportsPaths = [...buildExpectedReportsJsPaths()].sort((a, b) => a.localeCompare(b));
  for (const relPath of expectedReportsPaths) {
    const exists = checkPathExists(relPath);
    if (!exists) continue;

    if (relPath.endsWith('.md')) {
      checkMarkdown(relPath);
    }

    if (relPath.endsWith('.pdf')) {
      checkPdf(relPath, {
        required: !allowMissingPdf,
      });
    }
  }

  console.log(`[validate-outputs] root: ${repoRoot}`);
  console.log(`[validate-outputs] allow missing pdf: ${allowMissingPdf}`);
  console.log(
    `[validate-outputs] checked: md=${counts.checkedMd}, pdf=${counts.checkedPdf}, reports-paths=${counts.checkedPaths}, missing-pdf=${counts.missingPdf}`,
  );

  if (verbose) {
    for (const line of passes) {
      console.log(line);
    }
  }

  for (const line of warnings) {
    console.warn(line);
  }

  for (const line of failures) {
    console.error(line);
  }

  if (failures.length > 0) {
    console.error(`[validate-outputs] FAIL: failures=${failures.length}, warnings=${warnings.length}`);
    process.exit(1);
  }

  console.log(`[validate-outputs] PASS: warnings=${warnings.length}`);
}

run();
