#!/usr/bin/env node
/**
 * Self-tests for design-completion-gate.mjs. Offline, both directions.
 *
 * The gate's normal state is FAILING, so the important tests here are the ones
 * that make it PASS. A refusal that can never go green is not a gate, it is a
 * wall, and nobody would be able to tell the difference from the failing side.
 */

import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import {
  evaluate,
  parseIndex,
  extractIdArray,
  extractSpreadArray,
  isDirectRun,
} from './design-completion-gate.mjs';

let pass = 0;
const t = (name, fn) => {
  fn();
  pass += 1;
  console.log(`  ok  ${name}`);
};

console.log('design-completion-gate self-tests');

/* --------------------------------------------------------- nav extraction */

const NAV_SRC = [
  'export const FILES_WORK = "files";',
  'export const REVIEW_WORK = "review";',
  'export const CITY_MANAGER_LENS = "city-manager";',
  'export const WORK_IDS = [',
  '  FILES_WORK,',
  '  REVIEW_WORK,',
  '];',
  'export const LEAD_LENS_IDS = [',
  '  CITY_MANAGER_LENS,',
  '];',
  'export const ROSTER_LENS_IDS = ["parks"];',
  'export const ALL_LENS_IDS = [...LEAD_LENS_IDS, ...ROSTER_LENS_IDS];',
].join('\n');

t('resolves a const-reference array from product source', () => {
  assert.deepEqual(extractIdArray(NAV_SRC, 'WORK_IDS'), ['files', 'review']);
});

t('resolves a spread array', () => {
  assert.deepEqual(extractSpreadArray(NAV_SRC, 'ALL_LENS_IDS'), ['city-manager', 'parks']);
});

t('OPPOSITE: a renamed constant returns null, so the gate aborts rather than reporting full coverage', () => {
  assert.equal(extractIdArray(NAV_SRC, 'NOT_A_CONST'), null);
  assert.equal(extractSpreadArray(NAV_SRC, 'NOT_A_CONST'), null);
});

t('OPPOSITE: an unresolved reference returns null rather than a SHORTENED list', () => {
  const broken = 'export const WORK_IDS = [\n  FILES_WORK,\n  MISSING_CONST,\n];';
  assert.equal(extractIdArray(broken, 'WORK_IDS'), null);
});

/* ------------------------------------------------------------ index parse */

t('parses folder and status from an INDEX.md line', () => {
  const idx = parseIndex('- [Thing](my-folder/) — words. RATIFIED 2026-01-01, dispatched G-1.\n');
  assert.deepEqual(idx, [{ folder: 'my-folder', status: 'RATIFIED', line: idx[0].line }]);
});

t('"IN REVIEW" is not shadowed by a shorter status word', () => {
  const idx = parseIndex('- [Thing](f/) — IN REVIEW 2026-09-14.\n');
  assert.equal(idx[0].status, 'IN REVIEW');
});

t('OPPOSITE: a non-list line yields nothing', () => {
  assert.deepEqual(parseIndex('# Heading\n\nSome prose about (parentheses).\n'), []);
});

/* ------------------------------------------------------------- the verdict */

const COVERAGE_OK = {
  _instrumentRequiredWhenStatusIn: ['RATIFIED', 'IN REVIEW'],
  lenses: { 'city-manager': { folder: 'a' }, parks: { folder: 'b' } },
  work: { files: { folder: 'c' }, review: { excluded: 'ruled out', ruledOn: '2026-09-15' } },
};
const BASE = {
  navLenses: ['city-manager', 'parks'],
  navWork: ['files', 'review'],
  folders: [
    { name: 'a', hasCheck: true },
    { name: 'b', hasCheck: true },
    { name: 'c', hasCheck: true },
  ],
  index: [
    { folder: 'a', status: 'RATIFIED' },
    { folder: 'b', status: 'RATIFIED' },
    { folder: 'c', status: 'RATIFIED' },
  ],
  coverage: COVERAGE_OK,
};

t('FINISHED on a complete fixture — the gate CAN go green', () => {
  const r = evaluate(BASE);
  assert.equal(r.verdict, 'FINISHED', JSON.stringify(r.findings));
  assert.equal(r.findings.length, 0);
  assert.equal(r.counts.designed, 3);
  assert.equal(r.counts.excluded, 1);
});

t('R3 fires: a RATIFIED design with no check.mjs', () => {
  const r = evaluate({ ...BASE, folders: [{ name: 'a', hasCheck: false }, { name: 'b', hasCheck: true }, { name: 'c', hasCheck: true }] });
  assert.equal(r.verdict, 'UNFINISHED');
  assert.equal(r.findings.filter((f) => f.rule === 'R3').length, 1);
});

t('OPPOSITE: a DRAFT with no check.mjs does NOT fire R3', () => {
  const r = evaluate({
    ...BASE,
    folders: [{ name: 'a', hasCheck: false }, { name: 'b', hasCheck: true }, { name: 'c', hasCheck: true }],
    index: [{ folder: 'a', status: 'DRAFT' }, { folder: 'b', status: 'RATIFIED' }, { folder: 'c', status: 'RATIFIED' }],
  });
  assert.equal(r.findings.filter((f) => f.rule === 'R3').length, 0);
  assert.equal(r.verdict, 'FINISHED');
});

t('R4 fires: a nav surface with no design and no exclusion', () => {
  const r = evaluate({
    ...BASE,
    coverage: { ...COVERAGE_OK, lenses: { 'city-manager': { folder: 'a' }, parks: { folder: null, planRow: 'G-145' } } },
  });
  const r4 = r.findings.filter((f) => f.rule === 'R4');
  assert.equal(r4.length, 1);
  assert.match(r4[0].detail, /G-145/);
});

t('R4 fires: an exclusion with no ruling date is an opinion, not a ruling', () => {
  const r = evaluate({
    ...BASE,
    coverage: { ...COVERAGE_OK, work: { files: { folder: 'c' }, review: { excluded: 'because' } } },
  });
  assert.equal(r.findings.filter((f) => f.rule === 'R4').length, 1);
});

t('R4 fires in the OTHER direction: a declaration naming a surface the product does not ship', () => {
  const r = evaluate({
    ...BASE,
    coverage: { ...COVERAGE_OK, lenses: { ...COVERAGE_OK.lenses, ghost: { folder: 'a' } } },
  });
  assert.ok(r.findings.some((f) => f.surface === 'lens:ghost'));
});

t('R1 fires: a folder on disk that INDEX.md does not list', () => {
  const r = evaluate({ ...BASE, folders: [...BASE.folders, { name: 'orphan', hasCheck: false }] });
  assert.equal(r.findings.filter((f) => f.rule === 'R1').length, 1);
});

t('R2 fires: an INDEX.md entry with no folder on disk', () => {
  const r = evaluate({ ...BASE, index: [...BASE.index, { folder: 'ghost-folder', status: 'DRAFT' }] });
  assert.equal(r.findings.filter((f) => f.rule === 'R2').length, 1);
});

t('OPPOSITE: a DERIVED view listed in INDEX.md does not fire R2 — this was a real instrument bug', () => {
  const r = evaluate({
    ...BASE,
    index: [...BASE.index, { folder: 'all-canvas', status: null }],
    derivedFolders: ['all-canvas'],
  });
  assert.equal(r.findings.filter((f) => f.rule === 'R2').length, 0);
  assert.equal(r.verdict, 'FINISHED');
});

t('a derived view is still not a licence to skip R2 for a folder that truly is missing', () => {
  const r = evaluate({
    ...BASE,
    index: [...BASE.index, { folder: 'ghost-folder', status: 'DRAFT' }],
    derivedFolders: ['all-canvas'],
  });
  assert.equal(r.findings.filter((f) => f.rule === 'R2').length, 1);
});

/* --------------------------------------------- abort, never a silent pass */

t('ABORT when the nav lens list did not resolve — never FINISHED', () => {
  const r = evaluate({ ...BASE, navLenses: null });
  assert.equal(r.verdict, 'ABORT');
});

t('ABORT on an empty nav work list', () => {
  assert.equal(evaluate({ ...BASE, navWork: [] }).verdict, 'ABORT');
});

t('ABORT on zero design folders', () => {
  assert.equal(evaluate({ ...BASE, folders: [] }).verdict, 'ABORT');
});

t('ABORT on an empty INDEX.md', () => {
  assert.equal(evaluate({ ...BASE, index: [] }).verdict, 'ABORT');
});

t('NOT VACUOUS: the passing fixture exercised every rule\'s input', () => {
  const r = evaluate(BASE);
  assert.ok(r.counts.navSurfaces > 0 && r.counts.folders > 0, 'a FINISHED verdict on zero inputs would be worthless');
  assert.equal(r.counts.navSurfaces, r.counts.designed + r.counts.excluded);
});

/* ------------------------------------------------- the entry point itself */

t('isDirectRun fires for this platform\'s own argv shape', () => {
  const me = process.argv[1];
  assert.equal(isDirectRun(me, pathToFileURL(me).href), true);
});

t('OPPOSITE: the naive file:// form does not match on Windows', () => {
  const win = 'P:\\doc_repo\\scripts\\govtech\\x.mjs';
  assert.equal(isDirectRun(win, `file://${win.replace(/\\/g, '/')}`), false);
  assert.equal(isDirectRun(win, pathToFileURL(win).href), true);
});

console.log(`\n${pass}/${pass} self-tests passed, both directions.`);
