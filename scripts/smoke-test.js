#!/usr/bin/env node

/**
 * Smoke test for domains.json and frontend data integrity (cs#107).
 *
 * Usage: node scripts/smoke-test.js [path-to-domains.json]
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = resolve(SCRIPT_DIR, '..', '..', 'pjdhiro', 'assets', 'creation', 'manifests', 'domains.json');

const REQUIRED_TOP_KEYS = ['version', 'generated_at', 'namespace', 'progress_taxonomy', 'reports'];
const REQUIRED_REPORT_KEYS = ['id', 'name_ja', 'slug', 'status', 'progress_level'];

function resolveHookScriptPath(command = '') {
  const tokens = String(command).trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return '';
  if (['bash', 'sh', 'zsh'].includes(tokens[0]) && tokens[1]) {
    return tokens[1];
  }
  return tokens[0];
}

async function main() {
  const filePath = process.argv[2] || DEFAULT_PATH;
  console.log(`smoke-test (cs#107)`);
  console.log(`  file: ${filePath}\n`);

  const raw = await readFile(filePath, 'utf8');
  const data = JSON.parse(raw);

  let passed = 0;
  let failed = 0;

  function assert(label, condition, detail = '') {
    if (condition) {
      console.log(`  PASS: ${label}`);
      passed++;
    } else {
      console.log(`  FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // Top-level keys
  for (const key of REQUIRED_TOP_KEYS) {
    assert(`top-level key "${key}" exists`, key in data);
  }

  // Reports array
  const reports = data.reports || [];
  assert('reports is non-empty array', Array.isArray(reports) && reports.length > 0, `got ${reports.length}`);
  assert('reports count >= 30', reports.length >= 30, `got ${reports.length}`);

  // Progress taxonomy
  const taxonomy = data.progress_taxonomy || [];
  assert('progress_taxonomy is non-empty array', Array.isArray(taxonomy) && taxonomy.length > 0);
  assert('progress_taxonomy has id/label_ja/label_en', taxonomy.every(t => t.id && t.label_ja && t.label_en));

  // Each report required fields
  const missingFields = [];
  for (const report of reports) {
    for (const key of REQUIRED_REPORT_KEYS) {
      if (typeof report[key] !== 'string' || !report[key].trim()) {
        missingFields.push(`${report.id || '?'}.${key}`);
      }
    }
  }
  assert('all reports have required fields', missingFields.length === 0, missingFields.join(', '));

  // Generated field (cs#108)
  const withGenerated = reports.filter(r => typeof r.generated === 'string' && r.generated.trim());
  assert('all reports have "generated" date', withGenerated.length === reports.length,
    `${withGenerated.length}/${reports.length}`);

  // No "unknown" in generator_model for published+deepdive reports
  const suspectUnknown = reports.filter(r =>
    r.status === 'published' &&
    r.progress_level?.includes('deepdive') &&
    r.generator_model === 'unknown'
  );
  assert('deepdive+published reports have known generator_model', suspectUnknown.length === 0,
    suspectUnknown.map(r => r.id).join(', '));

  // Valid progress_level values
  const taxonomyIds = new Set(taxonomy.map(t => t.id));
  const unknownLevels = reports.filter(r => !taxonomyIds.has(r.progress_level));
  assert('all progress_level values exist in taxonomy', unknownLevels.length === 0,
    unknownLevels.map(r => `${r.id}=${r.progress_level}`).join(', '));


  // Hooks infrastructure (cs#110)
  const hooksDir = resolve(SCRIPT_DIR, '..', '.claude', 'hooks');
  const hooksJsonPath = resolve(SCRIPT_DIR, '..', '.claude', 'hooks.json');

  const { existsSync, statSync } = await import('node:fs');

  assert('hooks.json exists', existsSync(hooksJsonPath));
  assert('_common exists', existsSync(resolve(hooksDir, '_common')));
  assert('progress-level-guard.sh exists', existsSync(resolve(hooksDir, 'progress-level-guard.sh')));
  assert('domains-json-sync-guard.sh exists', existsSync(resolve(hooksDir, 'domains-json-sync-guard.sh')));

  // Verify hooks.json references valid scripts
  if (existsSync(hooksJsonPath)) {
    const hooksJson = JSON.parse(await readFile(hooksJsonPath, 'utf8'));
    const commands = new Set();
    for (const eventHooks of Object.values(hooksJson.hooks || {})) {
      for (const group of eventHooks) {
        for (const hook of group.hooks || []) {
          if (hook.command) commands.add(hook.command);
        }
      }
    }
    const repoRoot = resolve(SCRIPT_DIR, '..');
    const missingHooks = [...commands].filter((cmd) => {
      const scriptPath = resolveHookScriptPath(cmd);
      return !scriptPath || !existsSync(resolve(repoRoot, scriptPath));
    });
    assert('all hooks.json commands reference existing files', missingHooks.length === 0,
      missingHooks.join(', '));
  }


  // quality_level fields (cs#111)
  const VALID_QUALITY_LEVELS = ['not_generated', 'generated', 'self_tested', 'independent_reviewed', 'pjdhiro_reviewed'];

  const missingQuality = reports.filter(r => typeof r.quality_level !== 'string' || !r.quality_level.trim());
  assert('all reports have quality_level', missingQuality.length === 0,
    missingQuality.map(r => r.id).join(', '));

  const invalidQuality = reports.filter(r => r.quality_level && !VALID_QUALITY_LEVELS.includes(r.quality_level));
  assert('all quality_level values are valid', invalidQuality.length === 0,
    invalidQuality.map(r => `${r.id}=${r.quality_level}`).join(', '));

  // quality_level + review_engine consistency
  const reviewedNoEngine = reports.filter(r =>
    r.quality_level === 'independent_reviewed' &&
    (typeof r.review_engine !== 'string' || !r.review_engine.trim())
  );
  assert('independent_reviewed reports have review_engine', reviewedNoEngine.length === 0,
    reviewedNoEngine.map(r => r.id).join(', '));

  const reviewedNoResult = reports.filter(r =>
    r.quality_level === 'independent_reviewed' &&
    (typeof r.review_result !== 'string' || !r.review_result.trim())
  );
  assert('independent_reviewed reports have review_result', reviewedNoResult.length === 0,
    reviewedNoResult.map(r => r.id).join(', '));

  // quality-level-guard.sh hook exists (cs#111)
  assert('quality-level-guard.sh exists', existsSync(resolve(hooksDir, 'quality-level-guard.sh')));

  // Summary
  console.log(`\n  ${passed} passed, ${failed} failed`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
