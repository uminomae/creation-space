#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_LOCAL_FILE = resolve(ROOT, 'assets', 'articles', 'articles.json');
const DEFAULT_API_URL = 'https://uminomae.github.io/pjdhiro/api/creation-articles.json';
const DEFAULT_REPO = 'uminomae/creation-space';
const DEFAULT_ISSUE = 19;

function printHelp() {
  console.log('Creation Articles EN Semi-Auto Routine');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/articles-en-semi-auto.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --mode <check|sync|routine>   Default: check');
  console.log('  --notify-issue                Post summary comment to GitHub Issue');
  console.log('  --issue <number>              Issue number for notification (default: 19)');
  console.log('  --repo <owner/repo>           GitHub repo (default: uminomae/creation-space)');
  console.log('  --api-url <url>               Remote API URL');
  console.log('  --local-file <path>           Local articles JSON path');
  console.log('  --timeout <ms>                Fetch timeout in ms (default: 12000)');
  console.log('  --help, -h                    Show this help');
  console.log('');
  console.log('Modes:');
  console.log('  check   : Compare API vs local and print pending EN translation queue');
  console.log('  sync    : check + update local file with new/updated API items');
  console.log('  routine : sync + issue notification (auto-enables --notify-issue)');
}

function parseArgs(argv) {
  const options = {
    mode: 'check',
    notifyIssue: false,
    issue: DEFAULT_ISSUE,
    repo: DEFAULT_REPO,
    apiUrl: DEFAULT_API_URL,
    localFile: DEFAULT_LOCAL_FILE,
    timeoutMs: 12000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--mode') {
      options.mode = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--notify-issue') {
      options.notifyIssue = true;
      continue;
    }
    if (arg === '--issue') {
      options.issue = Number.parseInt(argv[i + 1], 10);
      i += 1;
      continue;
    }
    if (arg === '--repo') {
      options.repo = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--api-url') {
      options.apiUrl = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--local-file') {
      options.localFile = String(argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (arg === '--timeout') {
      options.timeoutMs = Number.parseInt(argv[i + 1], 10);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['check', 'sync', 'routine'].includes(options.mode)) {
    throw new Error(`Unsupported --mode: ${options.mode}`);
  }
  if (!Number.isFinite(options.issue) || options.issue <= 0) {
    throw new Error('--issue must be a positive integer');
  }
  if (!options.repo || !options.repo.includes('/')) {
    throw new Error('--repo must be owner/repo');
  }
  if (!options.apiUrl) {
    throw new Error('--api-url is required');
  }
  if (!options.localFile) {
    throw new Error('--local-file is required');
  }
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error('--timeout must be a positive integer');
  }
  if (options.mode === 'routine') {
    options.notifyIssue = true;
  }
  if (!isAbsolute(options.localFile)) {
    options.localFile = resolve(ROOT, options.localFile);
  }

  return { help: false, options };
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeUrl(value) {
  if (!hasText(value)) return '';
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : '';
}

function getId(item, index) {
  const url = normalizeUrl(item.url);
  if (url) return url;
  if (hasText(item.title_ja)) return item.title_ja.trim();
  if (hasText(item.title)) return item.title.trim();
  return `article[${index}]`;
}

function normalizeRemoteItem(remote, existing = null) {
  return {
    type: remote.type || existing?.type || 'post',
    title: remote.title || existing?.title || '',
    title_ja: remote.title_ja || remote.title || existing?.title_ja || existing?.title || '',
    title_en: remote.title_en || existing?.title_en || '',
    url: remote.url || existing?.url || '',
    date: remote.date || existing?.date || '',
    excerpt: remote.excerpt || existing?.excerpt || '',
    excerpt_ja: remote.excerpt_ja || remote.excerpt || existing?.excerpt_ja || existing?.excerpt || '',
    excerpt_en: remote.excerpt_en || existing?.excerpt_en || '',
    tags: toArray(remote.tags ?? existing?.tags),
    categories: toArray(remote.categories ?? existing?.categories),
    teaser: remote.teaser ?? existing?.teaser ?? '',
  };
}

async function readJsonArray(filePath) {
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array JSON: ${filePath}`);
  }
  return parsed;
}

async function fetchRemoteArticles(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const parsed = await res.json();
    if (!Array.isArray(parsed)) {
      throw new Error('Remote API response is not an array');
    }
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

function buildMergedArticles(localArticles, remoteArticles) {
  const localByUrl = new Map();
  localArticles.forEach((item) => {
    const key = normalizeUrl(item.url);
    if (key) localByUrl.set(key, item);
  });

  const mergedByUrl = new Map();
  const newEntries = [];
  const updatedEntries = [];

  remoteArticles.forEach((remote, index) => {
    const key = normalizeUrl(remote.url);
    if (!key) return;

    const existing = localByUrl.get(key) || null;
    const next = normalizeRemoteItem(remote, existing);
    mergedByUrl.set(key, next);

    if (!existing) {
      newEntries.push({ id: getId(next, index), url: key, title: next.title_ja || next.title });
      return;
    }
    if (JSON.stringify(existing) !== JSON.stringify(next)) {
      updatedEntries.push({ id: getId(next, index), url: key, title: next.title_ja || next.title });
    }
  });

  // Keep local-only records as history/fallback.
  localArticles.forEach((local) => {
    const key = normalizeUrl(local.url);
    if (!key || mergedByUrl.has(key)) return;
    mergedByUrl.set(key, local);
  });

  const merged = Array.from(mergedByUrl.values()).sort((a, b) => {
    const tA = Date.parse(a.date || '');
    const tB = Date.parse(b.date || '');
    const safeA = Number.isFinite(tA) ? tA : 0;
    const safeB = Number.isFinite(tB) ? tB : 0;
    return safeB - safeA;
  });

  return { merged, newEntries, updatedEntries };
}

function collectPendingEnglish(articles) {
  const pending = [];
  articles.forEach((item, index) => {
    const missingTitleEn = !hasText(item.title_en);
    const missingExcerptEn = !hasText(item.excerpt_en);
    if (!missingTitleEn && !missingExcerptEn) return;
    pending.push({
      id: getId(item, index),
      title: item.title_ja || item.title || '(untitled)',
      missingTitleEn,
      missingExcerptEn,
      url: normalizeUrl(item.url),
    });
  });
  return pending;
}

function formatPendingLine(item) {
  const missing = [];
  if (item.missingTitleEn) missing.push('title_en');
  if (item.missingExcerptEn) missing.push('excerpt_en');
  return `- ${item.title} [missing: ${missing.join(', ')}] ${item.url}`.trim();
}

async function postIssueComment({ repo, issue, mode, newEntries, updatedEntries, pending }) {
  const lines = [];
  lines.push('📝 Creation Articles EN semi-auto routine');
  lines.push(`- Mode: ${mode}`);
  lines.push(`- New from API: ${newEntries.length}`);
  lines.push(`- Updated from API: ${updatedEntries.length}`);
  lines.push(`- Pending EN translation: ${pending.length}`);
  if (newEntries.length > 0) {
    lines.push('- New entries:');
    newEntries.slice(0, 10).forEach((entry) => lines.push(`  - ${entry.title || entry.url}`));
  }
  if (pending.length > 0) {
    lines.push('- Pending EN queue:');
    pending.slice(0, 10).forEach((item) => lines.push(`  - ${item.title}`));
  }
  if (pending.length > 10) {
    lines.push(`- ...and ${pending.length - 10} more pending item(s).`);
  }

  const body = lines.join('\n');
  await execFileAsync(
    'gh',
    ['issue', 'comment', String(issue), '--repo', repo, '--body', body],
    { cwd: ROOT, maxBuffer: 1024 * 1024 }
  );
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  const localArticles = await readJsonArray(options.localFile);
  let remoteArticles = null;
  let remoteError = null;

  try {
    remoteArticles = await fetchRemoteArticles(options.apiUrl, options.timeoutMs);
  } catch (error) {
    remoteError = error;
  }

  const sourceArticles = Array.isArray(remoteArticles) ? remoteArticles : localArticles;
  const { merged, newEntries, updatedEntries } = Array.isArray(remoteArticles)
    ? buildMergedArticles(localArticles, sourceArticles)
    : { merged: localArticles, newEntries: [], updatedEntries: [] };
  const pending = collectPendingEnglish(merged);
  const changed = JSON.stringify(localArticles) !== JSON.stringify(merged);

  console.log(`[articles:semi-auto] mode=${options.mode}`);
  console.log(`[articles:semi-auto] local=${localArticles.length}, remote=${remoteArticles ? remoteArticles.length : 'n/a'}`);
  if (remoteError) {
    console.warn(`[articles:semi-auto] remote fetch skipped: ${remoteError.message}`);
  }
  console.log(`[articles:semi-auto] new=${newEntries.length}, updated=${updatedEntries.length}, pending_en=${pending.length}`);

  pending.slice(0, 20).forEach((item) => {
    console.log(formatPendingLine(item));
  });
  if (pending.length > 20) {
    console.log(`... and ${pending.length - 20} more pending item(s).`);
  }

  if (options.mode !== 'check' && changed) {
    await writeFile(options.localFile, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    console.log(`[articles:semi-auto] wrote updates: ${options.localFile}`);
  } else if (options.mode !== 'check') {
    console.log('[articles:semi-auto] no local file changes.');
  }

  const shouldNotifyIssue = options.notifyIssue
    && (newEntries.length > 0 || updatedEntries.length > 0);

  if (shouldNotifyIssue) {
    try {
      await postIssueComment({
        repo: options.repo,
        issue: options.issue,
        mode: options.mode,
        newEntries,
        updatedEntries,
        pending,
      });
      console.log(`[articles:semi-auto] issue comment posted: ${options.repo}#${options.issue}`);
    } catch (error) {
      console.warn(`[articles:semi-auto] issue comment skipped: ${error.message}`);
    }
  } else if (options.notifyIssue) {
    console.log('[articles:semi-auto] issue comment skipped: no API changes detected.');
  }
}

main().catch((error) => {
  console.error(`[articles:semi-auto] ${error.message}`);
  process.exit(1);
});
