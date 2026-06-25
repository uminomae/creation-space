#!/usr/bin/env node
// cs#252 監査スクリプト: citation-only/blocked-access 行の pd wiki / cs source-note / evidence 参照を集計
// read-only。出力は監査表（markdown）。
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const csRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pdWikiSources = join(csRoot, '..', 'project-design', 'wiki', 'sources');
const manifestPath = join(csRoot, 'knowledge', 'raw', 'manifest.md');

const manifest = readFileSync(manifestPath, 'utf8');

// pd wiki ファイル一覧。frontmatter の manifest_id で source_id へ権威的に索引する
// （著者姓+年の推測は同姓の到達可能原典を誤検出するため不可）
const pdFiles = existsSync(pdWikiSources) ? readdirSync(pdWikiSources).filter(f => f.endsWith('.md')) : [];
const pdById = {}; // source_id -> [filename]
for (const f of pdFiles) {
  const t = readFileSync(join(pdWikiSources, f), 'utf8');
  const m = t.match(/manifest_id:\s*"?(D\d+-S\d+[a-z]?)"?/);
  if (m) (pdById[m[1]] = pdById[m[1]] || []).push(f);
}

// evidence ライブ論拠ファイル群（investigations 含む）
function collectFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collectFiles(p, acc);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}
const evidenceFiles = collectFiles(join(csRoot, 'evidence'));
const evidenceText = new Map(evidenceFiles.map(f => [f, readFileSync(f, 'utf8')]));

const rows = [];
for (const line of manifest.split('\n')) {
  const m = line.match(/^\|\s*(D\d+-S\d+[a-z]?)\s*\|\s*(D\d+)\s*\|\s*`(citation-only|blocked-access)`\s*\|\s*(.*?)\s*\|/);
  if (!m) continue;
  const [, sid, domain, status, title] = m;
  const dnn = domain; // D01 形式

  // pd wiki: frontmatter manifest_id == source_id で権威照合
  const pdMatches = pdById[sid] || [];
  const pdHit = pdMatches.length > 0;

  // cs source-note: knowledge/source-notes/D{NN}/D{NN}-S{##}_*.md
  const noteDir = join(csRoot, 'knowledge', 'source-notes', dnn);
  let noteHit = false;
  if (existsSync(noteDir)) {
    noteHit = readdirSync(noteDir).some(f => f.startsWith(`${sid}_`) || f.startsWith(`${sid}.`));
  }

  // evidence ライブ参照: source_id を grep（自己列挙の manifest は対象外）
  const evRefs = [];
  for (const [f, txt] of evidenceText) {
    if (txt.includes(sid)) evRefs.push(f.replace(csRoot + '/', ''));
  }

  rows.push({ sid, domain, status, title: title.slice(0, 70), pdMatches, pdHit, noteHit, evRefs });
}

// 出力
console.log(`# cs#252 監査表 (${rows.length} 行: citation-only/blocked-access)\n`);
console.log(`pd wiki sources: ${pdFiles.length} files | evidence files scanned: ${evidenceFiles.length}\n`);
console.log('| source_id | dom | status | pd_wiki | cs_note | evidence参照 | pd_wiki_file |');
console.log('|---|---|---|---|---|---|---|');
for (const r of rows) {
  console.log(`| ${r.sid} | ${r.domain} | ${r.status} | ${r.pdHit ? '✅' + (r.pdMatches.length > 1 ? r.pdMatches.length : '') : '—'} | ${r.noteHit ? '✅' : '—'} | ${r.evRefs.length ? r.evRefs.length + '件' : '—'} | ${r.pdMatches.join(', ') || ''} |`);
}

// サマリ
const pdToDelete = rows.filter(r => r.pdHit);
const noteToDelete = rows.filter(r => r.noteHit);
const liveEvidence = rows.filter(r => r.evRefs.some(f => !f.includes('manifest')));
console.log(`\n## サマリ`);
console.log(`- pd wiki ページ残存（削除候補）: **${pdToDelete.length}本** → ${pdToDelete.map(r => r.sid).join(', ')}`);
console.log(`- cs source-note 残存（削除候補）: **${noteToDelete.length}本** → ${noteToDelete.map(r => r.sid).join(', ') || 'なし（クリーン）'}`);
console.log(`- evidence ライブ参照あり（要精査）: **${liveEvidence.length}本** → ${liveEvidence.map(r => `${r.sid}(${r.evRefs.length})`).join(', ') || 'なし'}`);
