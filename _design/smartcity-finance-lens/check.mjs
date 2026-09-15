/**
 * Adversarial read, as a file.
 *
 * `node check.mjs` after `node gen.mjs`. Non-zero exit on any violation.
 *
 * THE CHECK THAT MATTERS HERE is money traceability. This lens draws figures
 * about a real city budget, and the defect class that has already reached two
 * canvases in this folder set is a number that looks right, carries a citation
 * to an authority, and traces to nothing. A tax rate attributed to a city
 * ordinance and a code section cited six times inside an issued letter both got
 * through a review pass because they were plausible.
 *
 * So: every money token rendered on an artboard must either appear in
 * capture-figures.json, which is the record of what was read from the operator
 * capture, or sit on an artboard that declares itself ILLUSTRATIVE in its own
 * basis line. Those are two independently derived inputs and the check asks
 * whether they agree. No sentinel satisfies it.
 *
 * Each check self-tests in BOTH directions before it reads an artboard.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

/** Artboards permitted to carry invented figures, because they say so on the page. */
const ILLUSTRATIVE = new Set(['Connected.dc.html']);

/** The declared state vocabulary. An artboard may not invent a sixth. */
const STATES = ['MEASURED', 'UNACCOUNTED', 'REFUSED', 'CONFLICT', 'PARTIAL'];

const MONEY = /\$[0-9][0-9,.]*\s?[MKB]?/g;
const BADGE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([A-Z]+)<\/span>/g;
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;
const CELL = /font:400 13px\/18px var\(--sc-font-(?:ui|data)\); font-variant-numeric:tabular-nums; color:var\(--sc-ink(?:-2|-3)?\);">([^<]*)<\/span>/g;

const money = (html) => [...new Set(html.match(MONEY) || [])].map((s) => s.trim());
const badges = (html) => [...new Set([...html.matchAll(BADGE)].map((m) => m[1]))];
const cells = (html) => [...html.matchAll(CELL)].map((m) => m[1].trim());
const people = (html) => cells(html).filter((c) => PERSON.test(c));

const traceable = (token, blob) => blob.includes(token);
const statesOk = (html) => badges(html).every((b) => STATES.includes(b));

/* ------------------------------------------------------------- self-tests */

const FAKE_BLOB = 'total is $69.6M across 15 funds and $424.0M charged';
const badgeCell = (s) => `border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">${s}</span>`;
const dataCell = (t) => `font:400 13px/18px var(--sc-font-ui); font-variant-numeric:tabular-nums; color:var(--sc-ink);">${t}</span>`;

const selfTests = [
  ['money: extractor finds a plain figure', money('cost $69.6M here').includes('$69.6M')],
  ['money: extractor finds a comma figure', money('is $244,119,103.40 total').includes('$244,119,103.40')],
  ['money: extractor is not vacuous', money('no figures at all').length === 0],
  ['money: ACCEPTS a figure present in the record', traceable('$69.6M', FAKE_BLOB) === true],
  ['money: REFUSES a figure absent from the record', traceable('$99.9M', FAKE_BLOB) === false],
  ['states: accepts the declared vocabulary', statesOk(STATES.map(badgeCell).join('')) === true],
  ['states: REFUSES an invented state', statesOk(badgeCell('ESTIMATED')) === false],
  ['states: extractor is not vacuous', badges(STATES.map(badgeCell).join('')).length === STATES.length],
  ['people: REFUSES an initialised name in a cell', people(dataCell('D. Moore')).length === 1],
  ['people: ALLOWS a department', people(dataCell('Streets & Drainage')).length === 0],
  ['people: ALLOWS a figure', people(dataCell('$14.2M')).length === 0],
];

let failed = 0;
for (const [label, passed] of selfTests) {
  if (!passed) { console.error(`SELF-TEST FAILED: ${label}`); failed += 1; }
}
if (failed) {
  console.error(`\n${failed} self-test(s) failed. The instrument is broken, so it reports no`);
  console.error('verdict on the artboards rather than a verdict worth nothing.');
  process.exit(2);
}
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);

/* ----------------------------------------------------------- the artboards */

let blob;
try {
  blob = fs.readFileSync(new URL('./capture-figures.json', import.meta.url), 'utf8');
} catch {
  console.error('capture-figures.json is missing or unreadable. It is the record of what was');
  console.error('read from the operator capture, and the money check cannot run without it.');
  process.exit(2);
}

const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
if (!files.length) { console.error('no artboards. Run `node gen.mjs` first.'); process.exit(2); }

let bad = 0;
for (const file of files) {
  const html = fs.readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
  const problems = [];

  const declared = html.includes('ILLUSTRATIVE');
  if (ILLUSTRATIVE.has(file) && !declared) {
    problems.push('is listed as illustrative but the page never says so');
  }
  if (!ILLUSTRATIVE.has(file)) {
    const untraced = money(html).filter((t) => !traceable(t, blob));
    if (untraced.length) problems.push(`money not traceable to the capture record: ${untraced.join(', ')}`);
  }

  if (!statesOk(html)) {
    problems.push(`undeclared state badge: ${badges(html).filter((b) => !STATES.includes(b)).join(', ')}`);
  }
  const named = people(html);
  if (named.length) problems.push(`table cells name people: ${[...new Set(named)].join(', ')}`);

  if (problems.length) {
    bad += 1;
    console.error(`FAIL ${file}`);
    for (const p of problems) console.error(`     ${p}`);
  } else {
    const n = money(html).length;
    console.log(`ok   ${file}${ILLUSTRATIVE.has(file) ? `  (${n} figures, declared illustrative)` : `  (${n} figures, all traceable)`}`);
  }
}

if (bad) { console.error(`\n${bad} of ${files.length} artboards failed.`); process.exit(1); }
console.log(`\n${files.length} artboards pass.`);
