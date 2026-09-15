/**
 * Adversarial read, as a file rather than a habit.
 *
 * `node check.mjs` after `node gen.mjs`. Non-zero exit on any violation.
 *
 * WHY THIS EXISTS. Three defects reached this folder and survived a review
 * pass. None was catchable by re-reading the canvas; each was found only by
 * comparing the canvas against a second, independently derived source:
 *
 *   1. The tab strip carried EIGHT tabs including Place. The product has seven
 *      and never had Place; the map became a dock rail instead. A city would
 *      have approved a tab we ruled against building.
 *   2. The Manager load strip named five people who appear in no source in
 *      either repository. Invented staff on a workload ranking is fabrication;
 *      real staff on one is not ours to publish to their employer.
 *   3. The licence rows were in the wrong ORDER. Within a status band the sort
 *      is by expiry offset, a seeded random draw, not by record id. Ids, refs,
 *      statuses, rungs and types were all correct, which is exactly why this
 *      one would never have been noticed by looking at the canvas.
 *
 * Each check self-tests in BOTH directions before it runs against the
 * artboards, because a check observed only passing has not been observed
 * working. The self-tests are the first thing that runs and they abort the file.
 */
import fs from 'node:fs';

/**
 * Verified against smartcity-dashboards origin/main f776b4bf, web/index.html,
 * on 2026-09-15: DS_TABS and TAB_LABELS agree on these seven, in this order.
 * Re-read the product before changing this list; do not edit it to make a
 * canvas pass.
 */
const SHIPPED_TABS = [
  'Pipeline', 'Inspections', 'Work orders', 'Code enforcement',
  'Licenses', 'Plan review', 'Flood study',
];

/** Load-strip headings. Anything else in that slot must be an opaque ref. */
const LOAD_TITLES = ['Inspector load', 'Manager load', 'Officer load', 'No load dimension'];
const REF = /^(INS|OFF|MGR|HLD)-\d{2}$/;

/** Which artboard draws which domain's rows, for the fixture-order check. */
const FIXTURE_ARTBOARDS = {
  'Inspections.dc.html': 'inspections',
  'CodeEnforcement.dc.html': 'code',
  'Licences.dc.html': 'licences',
};

const TAB = /padding:var\(--sc-2\) 0 10px[^>]*><span[^>]*>([^<]*)<\/span>/g;
const LOAD = /font:600 13px\/18px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]*)<\/span>/g;
const RECORD = /FIX-(?:IN|CE|BL)-\d{4}/g;
const CELL = /font:400 13px\/18px var\(--sc-font-(?:ui|data)\); color:var\(--sc-ink(?:-2)?\);">([^<]*)<\/span>/g;

/**
 * A person, in the shapes this capture produces: "D. Moore",
 * "R. Garner-Lozoya", "DEBORAH MOORE". A business is not matched, which is the
 * distinction that matters -- a business on a permit is a public commercial
 * record and naming one names no person.
 */
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

const tabLabels = (html) => [...html.matchAll(TAB)].map((m) => m[1]);
const loadCells = (html) => [...html.matchAll(LOAD)].map((m) => m[1]);
const recordIds = (html) => html.match(RECORD) || [];
const tableCells = (html) => [...html.matchAll(CELL)].map((m) => m[1]);
const peopleInCells = (html) => tableCells(html).filter((c) => PERSON.test(c.trim()));

const tabsOk = (html) => {
  const found = tabLabels(html);
  return found.length === SHIPPED_TABS.length && found.every((t, i) => t === SHIPPED_TABS[i]);
};
const namesOk = (html) =>
  loadCells(html).every((c) => LOAD_TITLES.includes(c) || REF.test(c));
/** The rendered ids must be the fixture's own ids, in the fixture's own order. */
const rowsOk = (html, expected) => {
  const found = recordIds(html);
  return found.length === expected.length && found.every((id, i) => id === expected[i]);
};

/* ------------------------------------------------------------- self-tests */

const tabCell = (n) => `padding:var(--sc-2) 0 10px; box-shadow:none;"><span style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">${n}</span>`;
const loadCell = (n) => `<span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">${n}</span>`;
const cell = (n) => `<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">${n}</span>`;

const GOOD_TABS = SHIPPED_TABS.map(tabCell).join('');
const WITH_PLACE = [SHIPPED_TABS[0], 'Place', ...SHIPPED_TABS.slice(1)].map(tabCell).join('');
const GOOD_NAMES = [loadCell('Inspector load'), loadCell('INS-01')].join('');
const BAD_NAMES = [loadCell('Manager load'), loadCell('R. McBain')].join('');
const ORDERED = 'FIX-BL-1006 FIX-BL-1012 FIX-BL-1036';
const SWAPPED = 'FIX-BL-1006 FIX-BL-1036 FIX-BL-1012';
const ORDER_EXPECT = ['FIX-BL-1006', 'FIX-BL-1012', 'FIX-BL-1036'];

const selfTests = [
  ['tabs: accepts the shipped seven', tabsOk(GOOD_TABS) === true],
  ['tabs: REFUSES an eighth tab (Place)', tabsOk(WITH_PLACE) === false],
  ['tabs: REFUSES a short strip', tabsOk(SHIPPED_TABS.slice(0, 5).map(tabCell).join('')) === false],
  ['tabs: not vacuous - the extractor found seven', tabLabels(GOOD_TABS).length === 7],
  ['names: accepts a title and an opaque ref', namesOk(GOOD_NAMES) === true],
  ['names: REFUSES a person name', namesOk(BAD_NAMES) === false],
  ['names: not vacuous - the extractor found two cells', loadCells(BAD_NAMES).length === 2],
  ['rows: accepts the fixture order', rowsOk(ORDERED, ORDER_EXPECT) === true],
  ['rows: REFUSES two rows swapped', rowsOk(SWAPPED, ORDER_EXPECT) === false],
  ['rows: REFUSES a dropped row', rowsOk('FIX-BL-1006 FIX-BL-1012', ORDER_EXPECT) === false],
  ['rows: REFUSES an invented id', rowsOk('FIX-BL-1006 FIX-BL-1012 FIX-BL-9999', ORDER_EXPECT) === false],
  ['rows: not vacuous - the extractor found three ids', recordIds(ORDERED).length === 3],
  ['people: REFUSES an initialised resident', PERSON.test('D. Moore') === true],
  ['people: REFUSES a hyphenated surname', PERSON.test('R. Garner-Lozoya') === true],
  ['people: REFUSES a capture-style full name', PERSON.test('DEBORAH MOORE') === true],
  ['people: ALLOWS a business', PERSON.test('Cima General Contracting') === false],
  ['people: ALLOWS a one-word business', PERSON.test('Bluebonnet Electric') === false],
  ['people: ALLOWS an opaque ref', PERSON.test('APP-01') === false],
  ['people: ALLOWS a place label', PERSON.test('Fixture Ridge Block 4, Lot 22') === false],
  ['people: finds one in a rendered cell', peopleInCells(cell('D. Moore')).length === 1],
  ['people: finds none in a business cell', peopleInCells(cell('Lone Star HVAC')).length === 0],
];

let failed = 0;
for (const [label, passed] of selfTests) {
  if (!passed) {
    console.error(`SELF-TEST FAILED: ${label}`);
    failed += 1;
  }
}
if (failed) {
  console.error(`\n${failed} self-test(s) failed. The instrument is broken; its verdict on the`);
  console.error('artboards would be worthless, so it does not report one.');
  process.exit(2);
}
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);

/* ----------------------------------------------------------- the artboards */

const here = new URL('.', import.meta.url);
const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html'));
if (files.length === 0) {
  console.error('no artboards found. Run `node gen.mjs` first.');
  process.exit(2);
}

let fixture = null;
try {
  fixture = JSON.parse(fs.readFileSync(new URL('./fixture-rows.json', import.meta.url), 'utf8'));
} catch {
  console.error('fixture-rows.json is missing or unparsable. It holds the product generators');
  console.error('own output, and the row check cannot run without it; re-dump it rather than');
  console.error('letting the check pass silently.');
  process.exit(2);
}

let bad = 0;
for (const file of files.sort()) {
  const html = fs.readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
  const problems = [];
  if (!tabsOk(html)) problems.push(`tab strip is [${tabLabels(html).join(', ')}]`);
  if (!namesOk(html)) {
    const named = loadCells(html).filter((c) => !LOAD_TITLES.includes(c) && !REF.test(c));
    problems.push(`load strip names [${named.join(', ')}]`);
  }
  const people = peopleInCells(html);
  if (people.length) problems.push(`table cells name people [${[...new Set(people)].join(', ')}]`);
  const domain = FIXTURE_ARTBOARDS[file];
  if (domain) {
    const expected = fixture[domain].rows.map((r) => r.id);
    if (!rowsOk(html, expected)) {
      problems.push(`rows are [${recordIds(html).join(', ')}]`);
      problems.push(`fixture says [${expected.join(', ')}]`);
    }
  } else if (recordIds(html).length) {
    problems.push(`draws fixture record ids but is not mapped to a domain in FIXTURE_ARTBOARDS`);
  }
  if (problems.length) {
    bad += 1;
    console.error(`FAIL ${file}`);
    for (const p of problems) console.error(`     ${p}`);
  } else {
    console.log(`ok   ${file}${domain ? ` (${recordIds(html).length} rows match the fixture)` : ''}`);
  }
}

if (bad) {
  console.error(`\n${bad} of ${files.length} artboards failed.`);
  process.exit(1);
}
console.log(`\n${files.length} artboards pass.`);
