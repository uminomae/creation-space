#!/usr/bin/env node

/**
 * Generate crawler-visible static links to every report page (cs#264).
 *
 * トップの報告カードは JS 描画のため、JS を実行しないクローラー（GPTBot・ClaudeBot 等）からは
 * 本文ページへ辿れない。pjdhiro の manifest から全報告ページの素の <a href> を生成し、
 * 次の3か所を書き換える:
 *
 *   1. index.html  — <noscript> 内の static-nav マーカー間（JS 有効時の見た目は変わらない）
 *   2. llms.txt    — static-nav マーカー間（Markdown のリンク一覧）
 *   3. sitemap.xml — 全体を再生成（noindex のページは載せない）
 *
 * 本文ページは pjdhiro の Jekyll が `assets/creation/{path}.md` → `{path}/` で配信している。
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_PUBLISH_REPO = resolve(ROOT, '..', 'pjdhiro');

const SITE_URL = 'https://uminomae.github.io/creation-space/';
const CREATION_PAGES_URL = 'https://uminomae.github.io/pjdhiro/assets/creation/';

// cs 側の静的ページを置くディレクトリ。新しい静的ページ（例: #263 対応表）を足したらここへ追加する
const LOCAL_PAGE_DIRS = ['reader'];
// sitemap に載せるテキスト資源（HTML 以外）
const SITEMAP_TEXT_FILES = ['llms.txt', 'llms-full.txt'];

const MARKER_START = 'static-nav:start';
const MARKER_END = 'static-nav:end';

function printHelp() {
  console.log('Generate static links to all report pages (cs#264)');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/generate-static-nav.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --publish-repo <path>  Publish repo root (default: ../pjdhiro)');
  console.log('  --check                Report whether outputs are up to date (exit 1 if not)');
  console.log('  --help, -h             Show this help');
}

function parseArgs(argv) {
  const options = { publishRepo: DEFAULT_PUBLISH_REPO, check: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, options };
    if (arg === '--publish-repo') {
      options.publishRepo = resolve(String(argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (arg === '--check') {
      options.check = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  return { help: false, options };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeMarkdownLabel(value) {
  return String(value).replace(/([[\]])/g, '\\$1');
}

function stripInlineMarkdown(value) {
  return String(value)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+---\s+/g, ' — ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Jekyll と同じく、front matter の title → 最初の H1 の順で題名を採る */
function extractMarkdownTitle(text) {
  const frontMatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatter) {
    const titleLine = frontMatter[1].match(/^title:\s*(.+)$/m);
    if (titleLine) return stripInlineMarkdown(titleLine[1].replace(/^["']|["']$/g, ''));
  }
  const heading = text.match(/^#\s+(.+)$/m);
  return heading ? stripInlineMarkdown(heading[1]) : '';
}

function pageUrlForMarkdown(relPath) {
  return `${CREATION_PAGES_URL}${relPath.replace(/\.md$/, '/')}`;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

/**
 * pjdhiro に実在する Markdown だけをリンクにする（manifest にあっても未配置ならリンク切れになるため）。
 * 最初の見出しが「1. …」のような節見出しなら文書の題名ではないので fallbackTitle を使う
 */
async function makeReportLink(publishRepo, relPath, warnings, fallbackTitle = '') {
  if (!relPath) return null;
  const absPath = join(publishRepo, 'assets', 'creation', relPath);
  if (!existsSync(absPath)) {
    warnings.push(`missing in publish repo: assets/creation/${relPath}`);
    return null;
  }
  let title = extractMarkdownTitle(await readFile(absPath, 'utf8'));
  if (!title || /^\d+(\.\d+)*\.?\s/.test(title)) {
    warnings.push(`no document title (first heading: "${title}"): assets/creation/${relPath}`);
    title = fallbackTitle || title;
  }
  return { url: pageUrlForMarkdown(relPath), title: title || relPath };
}

async function collectReportGroups(publishRepo, warnings) {
  const manifestDir = join(publishRepo, 'assets', 'creation', 'manifests');
  const [domains, guides, synthesis, phase8, survey] = await Promise.all([
    readJson(join(manifestDir, 'domains.json')),
    readJson(join(manifestDir, 'guides.json')),
    readJson(join(manifestDir, 'synthesis.json')),
    readJson(join(manifestDir, 'phase8-themes.json')),
    readJson(join(manifestDir, 'survey.json')),
  ]);
  const link = (relPath, fallbackTitle) => makeReportLink(publishRepo, relPath, warnings, fallbackTitle);

  const guideItems = [];
  for (const guide of guides.guides || []) {
    guideItems.push({
      ja: await link(guide.md?.ja, `創造の5段階モデルの解説（${guide.title_ja}）`),
      en: await link(guide.md?.en, `Guide to the Five-Stage Model of Creation (${guide.title_en})`),
    });
  }

  const domainItems = [];
  for (const report of domains.reports || []) {
    const ja = await link(report.md?.ja);
    const en = await link(report.md?.en);
    if (ja) ja.title = `${report.id} ${ja.title}`;
    if (en) en.title = `${report.id} ${en.title}`;
    domainItems.push({ ja, en });
  }

  const synthesisItems = [];
  for (const report of synthesis.reports || []) {
    synthesisItems.push({ ja: await link(report.md?.ja), en: await link(report.md?.en) });
  }

  const themeItems = [];
  for (const theme of phase8.themes || []) {
    themeItems.push({ ja: await link(theme.md?.ja), en: await link(theme.md?.en) });
    themeItems.push({ ja: await link(theme.presentation_md?.ja), en: await link(theme.presentation_md?.en) });
  }
  themeItems.push({
    ja: await link(phase8.conclusion_presentation_md?.ja),
    en: await link(phase8.conclusion_presentation_md?.en),
  });

  // 5テーマの検証報告は manifest を持たない（src/reports/theme-verification.js が直接参照）。統合レポートを最後に置く
  const verificationDir = join(publishRepo, 'assets', 'creation', 'phase8-themes', 'ja', 'verification');
  const verificationFiles = (await readdir(verificationDir))
    .filter((name) => name.endsWith('.md'))
    .sort((a, b) => Number(a.includes('integration')) - Number(b.includes('integration')) || a.localeCompare(b));
  const verificationItems = [];
  for (const name of verificationFiles) {
    verificationItems.push({ ja: await link(`phase8-themes/ja/verification/${name}`), en: null });
  }

  const surveyItems = [];
  const surveyMd = (survey.files || []).filter((file) => file.format === 'md');
  for (const file of surveyMd.filter((entry) => entry.lang === 'ja')) {
    const enPath = file.path.replace('/ja/', '/en/');
    const hasEn = surveyMd.some((entry) => entry.path === enPath);
    surveyItems.push({ ja: await link(file.path), en: hasEn ? await link(enPath) : null });
  }

  return [
    { headingJa: '創造の5段階モデルの解説', headingEn: 'Guides to the Five-Stage Model', items: guideItems },
    { headingJa: '30領域調査報告', headingEn: '30 Domain Reports', items: domainItems },
    { headingJa: '30領域横断分析', headingEn: 'Cross-Domain Synthesis', items: synthesisItems },
    { headingJa: '領域横断テーマ（5テーマ）', headingEn: 'Cross-Domain Themes', items: themeItems },
    { headingJa: '5テーマの検証', headingEn: 'Theme Verification', items: verificationItems },
    { headingJa: '調査の状況', headingEn: 'Survey Status', items: surveyItems },
  ].map((group) => ({ ...group, items: group.items.filter((item) => item.ja || item.en) }));
}

async function collectLocalPages() {
  const pages = [];
  for (const dir of LOCAL_PAGE_DIRS) {
    const absDir = join(ROOT, dir);
    if (!existsSync(absDir)) continue;
    const names = (await readdir(absDir)).filter((name) => name.endsWith('.html')).sort();
    for (const name of names) {
      const relPath = `${dir}/${name}`;
      const html = await readFile(join(ROOT, relPath), 'utf8');
      const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || relPath;
      const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
      pages.push({ relPath, title: title.replace(/\s*\|\s*creation-space\s*$/, '').trim(), noindex });
    }
  }
  return pages;
}

function renderHtmlNav(groups, localPages, indent) {
  const pad = (level) => indent + '  '.repeat(level);
  const lines = [];
  lines.push(`${pad(0)}<!-- ${MARKER_START} — scripts/generate-static-nav.mjs が生成（cs#264）。手で編集しない -->`);
  lines.push(`${pad(0)}<nav aria-label="調査報告の一覧">`);
  lines.push(`${pad(1)}<h2>調査報告の一覧</h2>`);
  for (const group of groups) {
    lines.push(`${pad(1)}<h3>${escapeHtml(group.headingJa)}</h3>`);
    lines.push(`${pad(1)}<ul>`);
    for (const item of group.items) {
      const parts = [];
      if (item.ja) parts.push(`<a href="${escapeHtml(item.ja.url)}">${escapeHtml(item.ja.title)}</a>`);
      if (item.en) {
        const enLink = `<a href="${escapeHtml(item.en.url)}" hreflang="en" lang="en">${escapeHtml(item.en.title)}</a>`;
        parts.push(item.ja ? `（English: ${enLink}）` : enLink);
      }
      lines.push(`${pad(2)}<li>${parts.join('')}</li>`);
    }
    lines.push(`${pad(1)}</ul>`);
  }
  if (localPages.length) {
    lines.push(`${pad(1)}<h3>テーマ解説（READER）</h3>`);
    lines.push(`${pad(1)}<ul>`);
    for (const page of localPages) {
      lines.push(`${pad(2)}<li><a href="./${escapeHtml(page.relPath)}">${escapeHtml(page.title)}</a></li>`);
    }
    lines.push(`${pad(1)}</ul>`);
  }
  lines.push(`${pad(0)}</nav>`);
  lines.push(`${pad(0)}<!-- ${MARKER_END} -->`);
  return lines.join('\n');
}

function renderMarkdownNav(groups, localPages) {
  const lines = [];
  lines.push(`<!-- ${MARKER_START} — generated by scripts/generate-static-nav.mjs (cs#264); do not edit by hand -->`);
  for (const group of groups) {
    lines.push('');
    lines.push(`### ${group.headingEn}（${group.headingJa}）`);
    lines.push('');
    for (const item of group.items) {
      const parts = [];
      if (item.ja) parts.push(`[${escapeMarkdownLabel(item.ja.title)}](${item.ja.url})`);
      if (item.en) parts.push(`[${escapeMarkdownLabel(item.en.title)}](${item.en.url})`);
      lines.push(`- ${parts.join(' · ')}`);
    }
  }
  // llms.txt には sitemap と同じく、索引対象（noindex でない）の cs 静的ページだけを載せる
  const indexable = localPages.filter((page) => !page.noindex);
  if (indexable.length) {
    lines.push('');
    lines.push('### Theme Readers（テーマ解説）');
    lines.push('');
    for (const page of indexable) lines.push(`- [${escapeMarkdownLabel(page.title)}](${SITE_URL}${page.relPath})`);
  }
  lines.push('');
  lines.push(`<!-- ${MARKER_END} -->`);
  return lines.join('\n');
}

function replaceBetweenMarkers(text, replacement, fileLabel) {
  const pattern = new RegExp(`[ \\t]*<!-- ${MARKER_START}[^\\n]*-->[\\s\\S]*?<!-- ${MARKER_END} -->`);
  if (!pattern.test(text)) throw new Error(`${fileLabel}: static-nav markers not found`);
  return text.replace(pattern, replacement);
}

function markerIndent(text, fileLabel) {
  const match = text.match(new RegExp(`^([ \\t]*)<!-- ${MARKER_START}`, 'm'));
  if (!match) throw new Error(`${fileLabel}: static-nav markers not found`);
  return match[1];
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

/** 最終更新日 = 未コミットの変更があれば今日、なければ最後のコミット日 */
function lastModified(relPath, pendingChanges) {
  const today = new Date().toISOString().slice(0, 10);
  if (pendingChanges.has(relPath)) return today;
  try {
    if (git(['status', '--porcelain', '--', relPath])) return today;
    return git(['log', '-1', '--format=%cs', '--', relPath]) || today;
  } catch {
    return today;
  }
}

function renderSitemap(localPages, pendingChanges) {
  const entries = [{ loc: SITE_URL, file: 'index.html', priority: '1.0' }];
  for (const page of localPages) {
    if (!page.noindex) entries.push({ loc: `${SITE_URL}${page.relPath}`, file: page.relPath, priority: '0.8' });
  }
  for (const file of SITEMAP_TEXT_FILES) {
    if (existsSync(join(ROOT, file))) entries.push({ loc: `${SITE_URL}${file}`, file, priority: '0.5' });
  }
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeHtml(entry.loc)}</loc>`);
    lines.push(`    <lastmod>${lastModified(entry.file, pendingChanges)}</lastmod>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const { help, options } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }
  if (!existsSync(join(options.publishRepo, 'assets', 'creation', 'manifests'))) {
    throw new Error(`publish repo not found: ${options.publishRepo} (use --publish-repo)`);
  }

  const warnings = [];
  const groups = await collectReportGroups(options.publishRepo, warnings);
  const localPages = await collectLocalPages();

  const indexPath = join(ROOT, 'index.html');
  const llmsPath = join(ROOT, 'llms.txt');
  const sitemapPath = join(ROOT, 'sitemap.xml');
  const [indexText, llmsText, sitemapText] = await Promise.all([
    readFile(indexPath, 'utf8'),
    readFile(llmsPath, 'utf8'),
    readFile(sitemapPath, 'utf8'),
  ]);

  const nextIndex = replaceBetweenMarkers(
    indexText,
    renderHtmlNav(groups, localPages, markerIndent(indexText, 'index.html')),
    'index.html',
  );
  const nextLlms = replaceBetweenMarkers(llmsText, renderMarkdownNav(groups, localPages), 'llms.txt');
  // index.html / llms.txt をこの実行で書き換える場合、sitemap の lastmod は今日にする
  const pendingChanges = new Set();
  if (nextIndex !== indexText) pendingChanges.add('index.html');
  if (nextLlms !== llmsText) pendingChanges.add('llms.txt');
  const nextSitemap = renderSitemap(localPages, pendingChanges);

  const outputs = [
    { label: 'index.html', path: indexPath, before: indexText, after: nextIndex },
    { label: 'llms.txt', path: llmsPath, before: llmsText, after: nextLlms },
    { label: 'sitemap.xml', path: sitemapPath, before: sitemapText, after: nextSitemap },
  ];

  const linkCount = groups.reduce((sum, group) => sum + group.items.reduce((n, item) => n + Number(Boolean(item.ja)) + Number(Boolean(item.en)), 0), 0);
  console.log(`Report links: ${linkCount} (${groups.map((group) => `${group.headingEn}: ${group.items.length}`).join(', ')})`);
  console.log(`Local pages: ${localPages.map((page) => `${page.relPath}${page.noindex ? ' [noindex: not in sitemap/llms.txt]' : ''}`).join(', ') || 'none'}`);
  for (const warning of warnings) console.warn(`WARN: ${warning}`);

  const stale = outputs.filter((output) => output.before !== output.after);
  if (options.check) {
    if (stale.length) {
      console.log(`Out of date: ${stale.map((output) => output.label).join(', ')}`);
      process.exitCode = 1;
    } else {
      console.log('Up to date: index.html, llms.txt, sitemap.xml');
    }
    return;
  }
  for (const output of stale) await writeFile(output.path, output.after);
  console.log(stale.length ? `Updated: ${stale.map((output) => output.label).join(', ')}` : 'No changes');
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
