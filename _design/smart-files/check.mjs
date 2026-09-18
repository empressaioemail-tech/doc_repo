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

/**
 * MATCHED-INPUT ACCOUNTING. A vocabulary check that matches nothing anywhere
 * "passes" every artboard while proving nothing: if no board renders a
 * not-indexed reason, the reason predicate is satisfied vacuously and the
 * verdict is worth nothing. So every predicate counts what it actually looked
 * at, the counts are printed, and a predicate that matched zero inputs makes
 * the run REFUSE a verdict (exit 2) instead of reporting a clean one.
 */
function scan(html) {
  return {
    kinds: [...html.matchAll(KIND_SHAPE)].length,
    reasons: [...html.matchAll(REASON_SHAPE)].length,
    scopes: [...html.matchAll(SCOPE_SHAPE)].length,
    keys: renderedKeys(html).length,
  };
}

function evaluate(files) {
  const matched = { files: files.length, kinds: 0, reasons: 0, scopes: 0, keys: 0 };
  const failures = [];
  for (const { file, html, planted: plantedHere } of files) {
    const m = scan(html);
    matched.kinds += m.kinds;
    matched.reasons += m.reasons;
    matched.scopes += m.scopes;
    matched.keys += m.keys;
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
    failures.push({ file, problems, planted: Boolean(plantedHere) });
  }
  return { matched, failures, bad: failures.filter((f) => f.problems.length).length };
}

const listArtboards = () =>
  fs.readdirSync(here)
    .filter((f) => f.endsWith('.dc.html'))
    .sort()
    .map((file) => ({ file, html: fs.readFileSync(new URL(`./${file}`, import.meta.url), 'utf8') }));

/* ------------------------------------------------- planted violations, run ---
 * `node check.mjs`            -> verdict on the real artboards.
 * `node check.mjs --plant X`  -> injects one planted violation into the FIRST
 *                                artboard and requires the check to CATCH it.
 * Exit 0 from a plant means the planted violation was caught; exit 1 means the
 * instrument let an invented vocabulary through, which is the failure mode the
 * whole file exists to prevent. A plant is a claim about the checker, not about
 * the design, so it never touches an artboard on disk. */

const plantArg = process.argv.indexOf('--plant');
if (plantArg !== -1) {
  const plant = process.argv[plantArg + 1];
  // Each plant is a mutation of the FIRST artboard in memory. `append` covers
  // an invented category (a fifth source kind, a fourth reason, an undeclared
  // scope type). The key plant cannot be an append -- adding a key cell leaves
  // the list complete -- so it deletes four of the five declared keys, which is
  // the violation keyListOk exists to catch.
  const plantFile = () => {
    const real = listArtboards();
    if (!real.length) { console.error('no artboards to plant into.'); process.exit(2); }
    return real;
  };
  const plants = {
    kind: {
      describe: 'vendor-upload',
      mutate: (html) => `${html}\ncaptured by vendor-upload\n`,
    },
    reason: {
      describe: 'no-text-found',
      mutate: (html) => `${html}\nreason no-text-found today\n`,
    },
    scope: {
      describe: 'parcel',
      mutate: (html) => `${html}\nparcel / bastrop_tx\n`,
    },
    key: {
      describe: `a provenance key list missing ${PKEYS.slice(1).join(', ')}`,
      mutate: (html) => {
        let seen = 0;
        return html.replace(CELL, (match) => {
          const isKey = PKEYS.some((k) => match.includes(`>${k}</span>`));
          if (!isKey) return match;
          seen += 1;
          return seen === 1 ? match : '';
        });
      },
    },
  };
  const entry = plants[plant];
  if (!entry) {
    console.error(`unknown plant "${plant}". Use one of: ${Object.keys(plants).join(', ')}`);
    process.exit(2);
  }
  const real = plantFile();
  const planted = real.map((a, i) =>
    i === 0 ? { ...a, html: entry.mutate(a.html), planted: true } : a,
  );
  const { bad, failures } = evaluate(planted);
  const caughtOn = failures.find((f) => f.planted && f.problems.length);
  if (caughtOn) {
    console.log(`PLANT "${plant}" CAUGHT in ${caughtOn.file}: ${caughtOn.problems.join('; ')}`);
    console.log(`planted run: ${bad} of ${planted.length} artboards failed, as required.`);
    process.exit(0);
  }
  console.error(`PLANT "${plant}" NOT CAUGHT. The checker accepted ${entry.describe} into an artboard.`);
  process.exit(1);
}

/* --------------------------------------------------------------- the verdict */

const files = listArtboards();
if (!files.length) { console.error('no artboards. Run `node gen.mjs` first.'); process.exit(2); }

const { matched, failures, bad } = evaluate(files);

const zero = Object.entries(matched).filter(([k, n]) => k !== 'files' && n === 0).map(([k]) => k);
console.log(
  `matched inputs: files=${matched.files} kind-shaped=${matched.kinds} reason-shaped=${matched.reasons} ` +
    `scope-shaped=${matched.scopes} provenance-key-cells=${matched.keys}`,
);
if (zero.length) {
  console.error(`\nREFUSING A VERDICT: no input matched ${zero.join(', ')}. That predicate passed`);
  console.error('vacuously, so a clean report would mean nothing. Fix the artboards or the pattern.');
  process.exit(2);
}

for (const f of failures) {
  if (!f.problems.length) { console.log(`ok   ${f.file}`); continue; }
  console.error(`FAIL ${f.file}`);
  for (const p of f.problems) console.error(`     ${p}`);
}

if (bad) { console.error(`\n${bad} of ${files.length} artboards failed.`); process.exit(1); }
console.log(`\n${files.length} artboards pass. Vocabularies agree with smart-files ${F._source.commit}.`);
