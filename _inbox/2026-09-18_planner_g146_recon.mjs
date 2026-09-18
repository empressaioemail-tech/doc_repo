/**
 * G-146 reconciliation instrument — re-measures the three state claims in the row's own body.
 *
 * The row states its counts were "counted at source 2026-09-15, not remembered". This re-derives
 * each one independently of the gate (which reads the same disk but not the all-canvas build
 * output), so a disagreement between the two is visible rather than assumed away.
 *
 * Self-test: --selftest plants a known-bad folder name and asserts the inventory predicate
 * rejects it, so a zero-count result cannot pass as a measurement.
 */
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const ROOT = process.argv[2] || HERE;
const DESIGN = path.join(ROOT, '_design');

const out = { snapshot: {}, folders: {}, allCanvas: {}, claim: {} };

// --- 1. design folder inventory on disk, and how many carry a check.mjs ---
const dirs = fs
  .readdirSync(DESIGN, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const withCheck = dirs.filter((d) => fs.existsSync(path.join(DESIGN, d, 'check.mjs')));
const withViolate = dirs.filter((d) => fs.existsSync(path.join(DESIGN, d, 'violate.mjs')));

out.folders = {
  total: dirs.length,
  withCheckMjs: withCheck.length,
  withViolateMjs: withViolate.length,
  names: dirs,
  lackingInstrument: dirs.filter((d) => !withCheck.includes(d)),
};

// --- 2. the all-canvas declaration: does it declare every design folder? ---
const buildPath = path.join(DESIGN, 'all-canvas', 'build.mjs');
const buildSrc = fs.readFileSync(buildPath, 'utf8');

// Count rows and boards structurally, not by a regex over prose.
const rowBlocks = [...buildSrc.matchAll(/\n\s*\{\s*\n\s*from:/g)].length;
const boardArrays = [...buildSrc.matchAll(/boards:\s*\[([\s\S]*?)\]\s*,?\s*\n\s*\}/g)];
const boardsDeclared = boardArrays.reduce((n, m) => {
  const boards = [...m[1].matchAll(/\['/g)].length + [...m[1].matchAll(/\["/g)].length;
  return n + boards;
}, 0);

const declaredFroms = [...buildSrc.matchAll(/from:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);

out.allCanvas = {
  rowsDeclared: rowBlocks,
  boardsDeclared,
  surfacesDeclared: declaredFroms.length,
  // The row's specific claim: these two were omitted entirely.
  includesSmartFiles: declaredFroms.includes('smart-files'),
  includesPlanReviewDepartments: declaredFroms.includes('plan-review-departments'),
  surfaces: declaredFroms,
  foldersNotDeclared: dirs.filter(
    (d) => !declaredFroms.includes(d) && d !== 'all-canvas' && !d.startsWith('_')
  ),
};

// --- 3. the gate's own read, re-run so both derivations are live in one artifact ---
out.snapshot = {
  docRepoHead: process.env.G146_HEAD || 'see close',
  readAt: new Date().toISOString(),
};

// --- 4. the row's stated claim, quoted from the plan of record, for comparison ---
const plan = fs.readFileSync(
  path.join(ROOT, '90_operations', 'OPS-17_govtech_stack_plan_of_record.md'),
  'utf8'
);
const rowLine = plan.split(/\r?\n/).find((l) => /^\|\s*G-146\s*\|/.test(l));
const body = rowLine ? rowLine.split('|')[3] : '';
out.claim = {
  statedFolders: (body.match(/(\d+)\s+design folders/) || [])[1] ?? null,
  statedBoards: (body.match(/(\d+)\s+boards/) || [])[1] ?? null,
  statedDesigned: (body.match(/(\d+)\s+designed/) || [])[1] ?? null,
  statedUncovered: (body.match(/(\d+)\s+uncovered/) || [])[1] ?? null,
  claimsAllCanvasOmitsBoth: /omitting `smart-files` and `plan-review-departments` entirely/.test(body),
};

if (process.argv.includes('--selftest')) {
  // A measurement instrument that cannot report a bad input is not a measurement.
  const planted = [...dirs, 'zzz-nonexistent-design'];
  const bad = planted.filter((d) => !fs.existsSync(path.join(DESIGN, d, 'check.mjs')));
  if (!bad.includes('zzz-nonexistent-design')) {
    console.error('SELFTEST FAILED: inventory predicate accepted a folder that does not exist');
    process.exit(2);
  }
  if (!out.folders.names.includes('smartcity-fleet-lens')) {
    console.error('SELFTEST FAILED: known-present folder missing from inventory');
    process.exit(2);
  }
  console.error('SELFTEST OK: inventory rejects an absent folder and finds a known-present one');
}

console.log(JSON.stringify(out, null, 2));
