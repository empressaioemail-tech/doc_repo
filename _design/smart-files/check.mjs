/**
 * Adversarial read, as a file.
 *
 * `node check.mjs` after `node gen.mjs`. Non-zero exit on any violation.
 *
 * THE CHECK THAT MATTERS HERE is closed vocabularies. This product declares
 * exactly four scope types, four provenance source kinds, three not-indexed
 * reasons and five required provenance keys, all of them in code rather than in
 * prose. A canvas that shows a fifth source kind or a fourth reason has
 * invented a product capability, and that is the defect this folder set has
 * already shipped twice in other forms: a code section that did not exist, and
 * a tax rate attributed to an ordinance nobody had read.
 *
 * source-facts.json is the second, independently derived input. The artboards
 * are the first. The check asks whether they agree. No sentinel satisfies it.
 *
 * Every check self-tests in BOTH directions before reading an artboard.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);
let F;
try {
  F = JSON.parse(fs.readFileSync(new URL('./source-facts.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-facts.json is missing or unparsable. It is the record of the closed');
  console.error('vocabularies read out of the smart-files repo, and no check can run without it.');
  process.exit(2);
}

const SCOPES = F.scopeTypes.all;
const KINDS = F.provenanceSourceKinds.values;
const REASONS = F.searchIndexReasons.values;
const PKEYS = F.provenanceRequiredKeys.values;

/** Anything shaped like a source kind must BE one. Catches an invented category. */
const KIND_SHAPE = /\b[a-z]+-(?:upload|write)\b/g;
/** Anything shaped like a not-indexed reason must BE one. */
const REASON_SHAPE = /\b(?:content-type|no-text|extraction)-[a-z-]+\b/g;
/** `scopetype / id`, as the canvas renders a scope. */
const SCOPE_SHAPE = /\b([a-z]+)\s\/\s[a-z0-9_]+\b/g;
const CELL = /font:400 (?:12|13)px\/(?:18|19)px var\(--sc-font-data\); color:var\(--sc-ink-3\);">([^<]*)<\/span>/g;

const strays = (html, re, allowed) =>
  [...new Set(html.match(re) || [])].filter((t) => !allowed.includes(t));
const strayScopes = (html) =>
  [...new Set([...html.matchAll(SCOPE_SHAPE)].map((m) => m[1]))].filter((s) => !SCOPES.includes(s));
/** The rendered provenance key list must equal the declared list exactly. */
const renderedKeys = (html) => [...html.matchAll(CELL)].map((m) => m[1]).filter((t) => PKEYS.includes(t));
const keyListOk = (html) => {
  const found = new Set(renderedKeys(html));
  if (found.size === 0) return true;
  return PKEYS.every((k) => found.has(k));
};

/* ------------------------------------------------------------- self-tests */

const keyCell = (t) => `font:400 12px/18px var(--sc-font-data); color:var(--sc-ink-3);">${t}</span>`;
const ALL_KEYS = PKEYS.map(keyCell).join('');
const FOUR_KEYS = PKEYS.slice(0, 4).map(keyCell).join('');

const selfTests = [
  ['kinds: ACCEPTS a declared source kind', strays('captured by applicant-upload here', KIND_SHAPE, KINDS).length === 0],
  ['kinds: REFUSES an invented source kind', strays('captured by vendor-upload here', KIND_SHAPE, KINDS).length === 1],
  ['kinds: extractor is not vacuous', ('a staff-upload b'.match(KIND_SHAPE) || []).length === 1],
  ['reasons: ACCEPTS a declared reason', strays('reason no-text-layer today', REASON_SHAPE, REASONS).length === 0],
  ['reasons: REFUSES an invented reason', strays('reason no-text-found today', REASON_SHAPE, REASONS).length === 1],
  ['reasons: extractor is not vacuous', ('x content-type-not-indexable y'.match(REASON_SHAPE) || []).length === 1],
  ['scopes: ACCEPTS a declared scope type', strayScopes('tenant / bastrop_tx').length === 0],
  ['scopes: REFUSES an invented scope type', strayScopes('parcel / bastrop_tx').length === 1],
  ['keys: ACCEPTS the full declared list', keyListOk(ALL_KEYS) === true],
  ['keys: REFUSES a list missing one key', keyListOk(FOUR_KEYS) === false],
  ['keys: ignores an artboard that lists none', keyListOk('nothing here') === true],
  ['keys: extractor is not vacuous', renderedKeys(ALL_KEYS).length === PKEYS.length],
];

let failed = 0;
for (const [label, passed] of selfTests) {
  if (!passed) { console.error(`SELF-TEST FAILED: ${label}`); failed += 1; }
}
if (failed) {
  console.error(`\n${failed} self-test(s) failed. The instrument is broken, so it reports no`);
  console.error('verdict rather than one worth nothing.');
  process.exit(2);
}
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);

/* ----------------------------------------------------------- the artboards */

const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
if (!files.length) { console.error('no artboards. Run `node gen.mjs` first.'); process.exit(2); }

let bad = 0;
for (const file of files) {
  const html = fs.readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
  const problems = [];

  const k = strays(html, KIND_SHAPE, KINDS);
  if (k.length) problems.push(`source kind not declared in the product: ${k.join(', ')}`);
  const r = strays(html, REASON_SHAPE, REASONS);
  if (r.length) problems.push(`not-indexed reason not declared in the product: ${r.join(', ')}`);
  const s = strayScopes(html);
  if (s.length) problems.push(`scope type not declared in the product: ${s.join(', ')}`);
  if (!keyListOk(html)) {
    problems.push(`provenance key list is incomplete: ${[...new Set(renderedKeys(html))].join(', ')}`);
  }

  if (problems.length) {
    bad += 1;
    console.error(`FAIL ${file}`);
    for (const p of problems) console.error(`     ${p}`);
  } else {
    console.log(`ok   ${file}`);
  }
}

if (bad) { console.error(`\n${bad} of ${files.length} artboards failed.`); process.exit(1); }
console.log(`\n${files.length} artboards pass. Vocabularies agree with smart-files ${F._source.commit}.`);
