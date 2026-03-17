#!/usr/bin/env node

import { copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_BUILD_REPO = resolve(ROOT, '..', 'pjdhiro');
const DEFAULT_PUBLISH_REPO = resolve(ROOT, '..', 'pjdhiro');

function printHelp() {
  console.log('Creation domain EN markdown sync');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/domains-en-md-sync.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --mode <check|sync>        Default: check');
  console.log('  --build-repo <path>        Source repo root (default: ../pjdhiro)');
  console.log('  --publish-repo <path>      Publish repo root (default: ../pjdhiro)');
  console.log('  --manifest <path>          Override manifest path');
  console.log('  --dry-run                  Print sync actions without writing files');
  console.log('  --help, -h                 Show this help');
  console.log('');
  console.log('Behavior:');
  console.log('  - Reads EN domain markdown paths from pjdhiro/assets/creation/manifests/domains.json');
  console.log('  - Verifies build and publish copies for domains/en/md/*.md');
  console.log('  - In sync mode, copies missing or changed files from build repo's build/creation/');
}

function parseArgs(argv) {
  const options = {
    mode: 'check',
    buildRepo: DEFAULT_BUILD_REPO,
    publishRepo: DEFAULT_PUBLISH_REPO,
    manifest: '',
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--mode') {
      options.mode = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--build-repo') {
      options.buildRepo = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--publish-repo') {
      options.publishRepo = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--manifest') {
      options.manifest = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['check', 'sync'].includes(options.mode)) {
    throw new Error(`Unsupported --mode: ${options.mode}`);
  }

  options.buildRepo = resolvePath(options.buildRepo);
  options.publishRepo = resolvePath(options.publishRepo);
  options.manifest = options.manifest
    ? resolvePath(options.manifest)
    : resolve(options.publishRepo, 'assets', 'creation', 'manifests', 'domains.json');

  return { help: false, options };
}

function resolvePath(pathValue) {
  return isAbsolute(pathValue) ? pathValue : resolve(ROOT, pathValue);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeRelPath(pathValue) {
  return String(pathValue || '').trim().replace(/\\/g, '/');
}

function isExpectedDomainEnMdPath(pathValue) {
  return /^domains\/en\/md\/.+\.md$/i.test(normalizeRelPath(pathValue));
}

async function readJson(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function collectExpectedPaths(payload) {
  const reports = Array.isArray(payload?.reports) ? payload.reports : [];
  const entries = [];
  const seen = new Set();

  reports.forEach((report, index) => {
    const id = hasText(report?.id) ? report.id.trim() : `report[${index}]`;
    const candidates = [];

    if (hasText(report?.md?.en)) {
      candidates.push(report.md.en);
    }
    if (hasText(report?.paths?.en_md)) {
      candidates.push(report.paths.en_md);
    }

    candidates.forEach((candidate) => {
      const relPath = normalizeRelPath(candidate);
      if (!isExpectedDomainEnMdPath(relPath)) return;
      if (seen.has(relPath)) return;
      seen.add(relPath);
      entries.push({ id, relPath });
    });
  });

  return entries.sort((a, b) => a.relPath.localeCompare(b.relPath, 'en'));
}

async function walkFiles(baseDir, currentDir = baseDir) {
  let dirEntries = [];
  try {
    dirEntries = await readdir(currentDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of dirEntries) {
    const absolutePath = resolve(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(baseDir, absolutePath));
      continue;
    }
    if (entry.isFile()) {
      files.push(normalizeRelPath(relative(baseDir, absolutePath)));
    }
  }
  return files;
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return false;
    }
    return false;
  }
}

async function filesMatch(sourcePath, publishPath) {
  const [sourceRaw, publishRaw] = await Promise.all([
    readFile(sourcePath),
    readFile(publishPath),
  ]);
  return sourceRaw.equals(publishRaw);
}

async function analyze(options) {
  const payload = await readJson(options.manifest);
  const expected = collectExpectedPaths(payload);
  const buildBase = resolve(options.buildRepo, 'build', 'creation');
  const publishBase = resolve(options.publishRepo, 'assets', 'creation');
  const publishFiles = await walkFiles(resolve(publishBase, 'domains', 'en', 'md'));
  const expectedSet = new Set(expected.map((entry) => entry.relPath));

  const missingSource = [];
  const missingPublish = [];
  const outdatedPublish = [];

  for (const entry of expected) {
    const sourcePath = resolve(buildBase, entry.relPath);
    const publishPath = resolve(publishBase, entry.relPath);
    const [sourceExists, publishExists] = await Promise.all([
      fileExists(sourcePath),
      fileExists(publishPath),
    ]);

    if (!sourceExists) {
      missingSource.push(entry);
      continue;
    }
    if (!publishExists) {
      missingPublish.push(entry);
      continue;
    }
    if (!await filesMatch(sourcePath, publishPath)) {
      outdatedPublish.push(entry);
    }
  }

  const extraPublish = publishFiles
    .map((relPath) => `domains/en/md/${relPath}`)
    .filter((relPath) => !expectedSet.has(relPath))
    .sort((a, b) => a.localeCompare(b, 'en'));

  return {
    buildBase,
    publishBase,
    expected,
    extraPublish,
    missingSource,
    missingPublish,
    outdatedPublish,
  };
}

function printEntries(label, entries) {
  if (!entries.length) return;
  console.log(label);
  entries.forEach((entry) => {
    if (typeof entry === 'string') {
      console.log(`  - ${entry}`);
      return;
    }
    console.log(`  - ${entry.id}: ${entry.relPath}`);
  });
}

async function syncPublishFiles(result, options) {
  const actions = [...result.missingPublish, ...result.outdatedPublish];
  if (!actions.length) {
    console.log('No publish updates are required.');
    return 0;
  }

  let synced = 0;
  for (const entry of actions) {
    const sourcePath = resolve(result.buildBase, entry.relPath);
    const publishPath = resolve(result.publishBase, entry.relPath);
    const actionLabel = result.missingPublish.includes(entry) ? 'copy' : 'update';

    if (options.dryRun) {
      console.log(`[dry-run] ${actionLabel} ${entry.relPath}`);
      synced += 1;
      continue;
    }

    await mkdir(dirname(publishPath), { recursive: true });
    await copyFile(sourcePath, publishPath);
    console.log(`${actionLabel} ${entry.relPath}`);
    synced += 1;
  }

  return synced;
}

function hasBlockingIssues(result) {
  return result.missingSource.length > 0
    || result.missingPublish.length > 0
    || result.outdatedPublish.length > 0;
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  const initial = await analyze(options);

  console.log('Creation domain EN markdown audit');
  console.log(`- Manifest: ${options.manifest}`);
  console.log(`- Build base: ${initial.buildBase}`);
  console.log(`- Publish base: ${initial.publishBase}`);
  console.log(`- Expected manifest entries: ${initial.expected.length}`);
  console.log(`- Missing in build: ${initial.missingSource.length}`);
  console.log(`- Missing in publish: ${initial.missingPublish.length}`);
  console.log(`- Changed in publish: ${initial.outdatedPublish.length}`);
  console.log(`- Extra publish files: ${initial.extraPublish.length}`);

  printEntries('Missing in build:', initial.missingSource);
  printEntries('Missing in publish:', initial.missingPublish);
  printEntries('Changed in publish:', initial.outdatedPublish);
  printEntries('Extra publish files:', initial.extraPublish);

  if (options.mode === 'sync') {
    const synced = await syncPublishFiles(initial, options);
    console.log(`Sync actions: ${synced}`);

    const afterSync = options.dryRun ? initial : await analyze(options);
    if (!options.dryRun) {
      console.log('Post-sync status');
      console.log(`- Missing in build: ${afterSync.missingSource.length}`);
      console.log(`- Missing in publish: ${afterSync.missingPublish.length}`);
      console.log(`- Changed in publish: ${afterSync.outdatedPublish.length}`);
      console.log(`- Extra publish files: ${afterSync.extraPublish.length}`);
      printEntries('Extra publish files:', afterSync.extraPublish);
      if (hasBlockingIssues(afterSync)) {
        process.exitCode = 1;
      }
      return;
    }
  }

  if (hasBlockingIssues(initial)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
