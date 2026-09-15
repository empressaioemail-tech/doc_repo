#!/usr/bin/env node
/**
 * Self-tests for bastrop-zoning-layer-vintage.mjs. Offline, both directions.
 *
 * "Both directions" means every test below has a partner that forces the
 * opposite verdict on nearly the same input. A check observed only passing
 * has not been observed working.
 */

import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { extractReadUrl, judge, isDirectRun } from './bastrop-zoning-layer-vintage.mjs';

let pass = 0;
const t = (name, fn) => {
  fn();
  pass += 1;
  console.log(`  ok  ${name}`);
};

const D = (s) => Date.parse(s);
const OLD = 'https://x/PlaceTypesCharacterDistricts/FeatureServer/1';
const NEW = 'https://x/Zoning_Place_Type/FeatureServer/0';

console.log('bastrop-zoning-layer-vintage self-tests');

/* ---------------------------------------------------------- extraction */

t('extracts the constant from real source shape', () => {
  const src = `const FOO = "a";\nconst BASTROP_ZONING_URL = "${OLD}";\nconst BAR = "b";\n`;
  assert.equal(extractReadUrl(src), OLD);
});

t('extracts through CRLF line endings', () => {
  const src = `const BASTROP_ZONING_URL = "${OLD}";\r\n`;
  assert.equal(extractReadUrl(src), OLD);
});

t('OPPOSITE: a renamed constant returns null rather than a wrong URL', () => {
  const src = `const BASTROP_PLACETYPE_URL = "${OLD}";\n`;
  assert.equal(extractReadUrl(src), null);
});

t('OPPOSITE: empty source returns null', () => {
  assert.equal(extractReadUrl(''), null);
  assert.equal(extractReadUrl(undefined), null);
});

/* -------------------------------------------------------------- verdict */

t('STALE when a newer layer exists', () => {
  const v = judge(OLD, [
    { url: OLD, name: 'Zoning Place Types', lastEditDate: D('2023-04-28'), count: 565 },
    { url: NEW, name: 'Place Type', lastEditDate: D('2025-06-02'), count: 574 },
  ]);
  assert.equal(v.verdict, 'STALE');
  assert.equal(v.newer.length, 1);
  assert.equal(v.inputs, 2);
});

t('OPPOSITE: OK when the layer we read is the newest', () => {
  const v = judge(NEW, [
    { url: OLD, name: 'Zoning Place Types', lastEditDate: D('2023-04-28'), count: 565 },
    { url: NEW, name: 'Place Type', lastEditDate: D('2025-06-02'), count: 574 },
  ]);
  assert.equal(v.verdict, 'OK');
  assert.equal(v.newer.length, 0);
});

t('OK is not vacuous: it required a real comparison, inputs > 1', () => {
  const v = judge(NEW, [
    { url: OLD, name: 'a', lastEditDate: D('2023-04-28'), count: 1 },
    { url: NEW, name: 'b', lastEditDate: D('2025-06-02'), count: 1 },
  ]);
  assert.equal(v.verdict, 'OK');
  assert.ok(v.inputs > 1, 'an OK reached with fewer than two layers proves nothing');
});

t('equal dates are OK, not STALE (strictly newer is the test)', () => {
  const v = judge(OLD, [
    { url: OLD, name: 'a', lastEditDate: D('2025-01-01'), count: 1 },
    { url: NEW, name: 'b', lastEditDate: D('2025-01-01'), count: 1 },
  ]);
  assert.equal(v.verdict, 'OK');
});

/* ---------------------------------------------- abort, not a false pass */

t('ABORT on zero inputs — never a pass', () => {
  const v = judge(OLD, []);
  assert.equal(v.verdict, 'ABORT');
  assert.equal(v.inputs, 0);
});

t('ABORT when the read URL could not be extracted', () => {
  const v = judge(null, [{ url: NEW, name: 'b', lastEditDate: D('2025-06-02'), count: 1 }]);
  assert.equal(v.verdict, 'ABORT');
});

t('ABORT when the read URL is not among the candidates (stale candidate list)', () => {
  const v = judge('https://x/Something_Else/FeatureServer/0', [
    { url: NEW, name: 'b', lastEditDate: D('2025-06-02'), count: 1 },
  ]);
  assert.equal(v.verdict, 'ABORT');
});

t('ABORT when OUR layer is unmeasured — unmeasured is not old', () => {
  const v = judge(OLD, [
    { url: OLD, name: 'a', lastEditDate: null, count: 1 },
    { url: NEW, name: 'b', lastEditDate: D('2025-06-02'), count: 1 },
  ]);
  assert.equal(v.verdict, 'ABORT');
  assert.match(v.reason, /unmeasured/);
});

t('an unmeasured CANDIDATE can never prove staleness', () => {
  const v = judge(OLD, [
    { url: OLD, name: 'a', lastEditDate: D('2023-04-28'), count: 1 },
    { url: NEW, name: 'b', lastEditDate: null, count: 1 },
  ]);
  assert.equal(v.verdict, 'OK', 'a null date must not be read as newer');
});

t('a zero count is not an absent count', () => {
  const withZero = judge(OLD, [
    { url: OLD, name: 'a', lastEditDate: D('2023-04-28'), count: 0 },
    { url: NEW, name: 'b', lastEditDate: D('2025-06-02'), count: 0 },
  ]);
  assert.equal(withZero.verdict, 'STALE', 'counts do not affect the vintage verdict');
});

/* ------------------------------------------------- the entry point itself */

t('isDirectRun fires for this platform\'s own argv shape', () => {
  const me = process.argv[1];
  assert.ok(me, 'argv[1] must exist when run as a script');
  assert.equal(isDirectRun(me, pathToFileURL(me).href), true);
});

t('OPPOSITE: isDirectRun is false when imported by another module', () => {
  assert.equal(isDirectRun('P:/doc_repo/scripts/govtech/other.mjs', import.meta.url), false);
  assert.equal(isDirectRun(undefined, import.meta.url), false);
});

t('REGRESSION: the naive file:// form is what broke, and is not what we use', () => {
  const win = 'P:\\doc_repo\\scripts\\govtech\\x.mjs';
  const naive = `file://${win.replace(/\\/g, '/')}`;
  const real = pathToFileURL(win).href;
  assert.notEqual(naive, real, 'if these ever match, this test is no longer guarding anything');
  assert.equal(isDirectRun(win, real), true);
  assert.equal(isDirectRun(win, naive), false);
});

console.log(`\n${pass}/${pass} self-tests passed, both directions.`);
