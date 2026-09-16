/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * EVERY PREDICATE REPORTS A COUNT OF WHAT IT MATCHED, and this file aborts if
 * any of them matched zero. A check shipped on 2026-09-15 that self-tested
 * perfectly and matched nothing on any artboard, because the canvas rendered
 * display forms and the check looked for the product's codes; it reported
 * success and checked nothing. A predicate whose legitimate answer is "nothing
 * forbidden is present" is paired with a count of what it SCANNED, so "found no
 * crew name" can never be satisfied by finding no text.
 *
 * WHAT IS BEING COMPARED. One input from the artboard and one from
 * `source-state.json`, the product's own composer output at smartcity-dashboards
 * origin/main f776b4bf. One party acting alone cannot satisfy both sides.
 *
 * THE RULE THIS LENS EXISTS TO HOLD. The domain names no person, and says so on
 * the record rather than leaving the field quietly missing. A readiness screen
 * is exactly the surface where a crew list would feel natural and be wrong: a
 * roster of real firefighters is not a fixture, and an invented one is
 * fabrication on a page a city reads.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-state.json is missing or unparsable. It is the product composer output');
  console.error('this file checks the canvas against, and there is no second source without it.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

const LENS = 'fire-ems';
const PAIRS = new Set(
  S.vocab.registry.filter((d) => d.lensId === LENS).map((d) => d.id + ':' + d.gatedBy),
);
if (PAIRS.size === 0) {
  console.error('the registry in source-state.json yielded no domains for ' + LENS + '. Either the');
  console.error('field names moved or the dump is wrong; either way this file cannot check anything.');
  process.exit(2);
}
const KINDS = new Set(S.vocab.registry.map((d) => d.gatedBy));

const BADGE_WORDS = new Set([
  'Empty', 'Not built', 'Not read', 'Preview', 'Demo records',
  'Not connected', 'Unread', 'Partial', 'Mounted', 'Restricted',
]);
const STATUSES = new Set([...S.states.DOMAIN_STATUSES, S.states.fifthState, 'unavailable']);

/** The four readiness bands, from the product. A fifth band on a board is invented. */
const BAND_LABELS = new Set(S.axis.VEHICLE_STATUS_VALUES.map((b) => b.label));
const BAND_IDS = new Set(S.axis.VEHICLE_STATUS_VALUES.map((b) => b.id));

const VERBATIM = [
  S.demo.fire.basis,
  S.demo.fire.countingRule,
  S.demo.fire.records[0].crewBasis,
  S.demo.fire.extras.readyCountingRule,
  S.staging.fire.basis,
];

const MONEY = /[$¢£¥€]|\b(usd|dollars?|cents?|euros?)\b|\b\d[\d,]*(\.\d+)?\s*(hundred|thousand|million|billion|trillion)\b|\bpaid\b|\bfees? collected\b/i;
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/* ------------------------------------------------------------- extractors */

const PAIR_RE = /([a-z][a-z0-9-]*) &middot; gatedBy ([a-z][a-z0-9]*)/g;
const BADGE_RE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([^<]*)<\/span>/g;
const CELL_RE = /font:400 13px\/18px var\(--sc-font-(?:data|ui)\); color:var\(--sc-ink(?:-2)?\);">([^<]*)<\/span>/g;
const CHIP_RE = /border-radius:var\(--sc-r-full\); padding:2px 8px; white-space:nowrap;">([^<]*)<\/span>/g;
const FA_RE = /FIX-FA-\d{4}/g;
const STN_RE = /STN-\d{2}/g;
const STATUS_RE = /status: ([a-z-]+)/g;
const NUM_RE = /\d[\d,]*/g;

const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ');

const pairs = (html) => [...html.matchAll(PAIR_RE)].map((m) => m[1] + ':' + m[2]);
const gates = (html) => [...html.matchAll(PAIR_RE)].map((m) => m[2]);
const badges = (html) => [...html.matchAll(BADGE_RE)].map((m) => m[1]);
const cells = (html) => [...html.matchAll(CELL_RE)].map((m) => m[1].trim());
const chips = (html) => [...html.matchAll(CHIP_RE)].map((m) => m[1].trim());
const people = (html) => cells(html).filter((c) => PERSON.test(c));
const faIds = (html) => html.match(FA_RE) || [];
const stnRefs = (html) => html.match(STN_RE) || [];
const statuses = (html) => [...html.matchAll(STATUS_RE)].map((m) => m[1]);
const numbers = (html) => textOf(html).match(NUM_RE) || [];

const pairsOk = (html) => pairs(html).every((p) => PAIRS.has(p));
const gatesOk = (html) => gates(html).every((k) => KINDS.has(k));
const badgesOk = (html) => badges(html).every((b) => BADGE_WORDS.has(b));
const statusesOk = (html) => statuses(html).every((s) => STATUSES.has(s));
const moneyOk = (html) => !MONEY.test(textOf(html));
/** A status chip on this lens is one of the product's four bands and nothing else. */
const bandsOk = (html) => chips(html).every((c) => BAND_LABELS.has(c));
const exactOk = (found, expected) =>
  found.length === expected.length && found.every((id, i) => id === expected[i]);

/* ------------------------------------------------------------- self-tests */

const pairCell = (d, k) => '<span>' + d + ' &middot; gatedBy ' + k + '</span>';
const badgeCell = (t) => 'border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
const chipCell = (t) => 'border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + t + '</span>';
const cell = (t) => '<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';

const ORDER = S.demo.fire.records.map((r) => r.recordId);

const selfTests = [
  ['pairs: accepts the one the product registers on this lens', pairsOk(pairCell('fire-apparatus', 'firstdue')) === true],
  ['pairs: REFUSES the right domain under the wrong gate', pairsOk(pairCell('fire-apparatus', 'samsara')) === false],
  ['pairs: REFUSES a domain from another lens', pairsOk(pairCell('cip-projects', 'powerbi')) === false],
  ['pairs: REFUSES an uncatalogued vendor kind', gatesOk(pairCell('fire-apparatus', 'firehouse')) === false],
  ['pairs: not vacuous - the extractor found one', pairs(pairCell('fire-apparatus', 'firstdue')).length === 1],
  ['bands: accepts the four the product declares', bandsOk([...BAND_LABELS].map(chipCell).join('')) === true],
  ['bands: REFUSES an invented fifth band', bandsOk(chipCell('Reserve')) === false],
  ['bands: REFUSES a vendor status passed through unmapped', bandsOk(chipCell('available')) === false],
  ['bands: not vacuous - the extractor found four', chips([...BAND_LABELS].map(chipCell).join('')).length === 4],
  ['bands: the product declares four ids', BAND_IDS.size === 4],
  ['badges: accepts the shipped vocabulary', badgesOk(badgeCell('Not connected')) === true],
  ['badges: REFUSES an invented state word', badgesOk(badgeCell('Syncing')) === false],
  ['badges: not vacuous - the extractor found one', badges(badgeCell('Empty')).length === 1],
  ['statuses: accepts a composer status', statusesOk('status: unavailable') === true],
  ['statuses: REFUSES an invented status', statusesOk('status: degraded') === false],
  ['people: REFUSES an initialised name', PERSON.test('J. Halloran') === true],
  ['people: REFUSES a capture-style full name', PERSON.test('DEBORAH MOORE') === true],
  ['people: ALLOWS a unit label', PERSON.test('Brush truck unit 40') === false],
  ['people: ALLOWS a station label', PERSON.test('Specimen Yard station 01') === false],
  ['people: ALLOWS an opaque station ref', PERSON.test('STN-02') === false],
  ['people: finds one in a rendered cell', people(cell('J. Halloran')).length === 1],
  ['people: finds none in a unit cell', people(cell('Engine unit 34')).length === 0],
  ['roster: accepts the composer order in full', exactOk(ORDER, ORDER) === true],
  ['roster: REFUSES a partial roster', exactOk(ORDER.slice(0, 11), ORDER) === false],
  ['roster: REFUSES two units swapped', exactOk([ORDER[1], ORDER[0], ...ORDER.slice(2)], ORDER) === false],
  ['roster: not vacuous - the extractor found two', faIds('FIX-FA-1011 FIX-FA-1022').length === 2],
  ['stations: extractor finds a composer ref', stnRefs('STN-01 STN-03').length === 2],
  ['stations: extractor finds none in prose', stnRefs('the station roster').length === 0],
  ['money: REFUSES a currency symbol', moneyOk('<p>$4,200</p>') === false],
  ['money: ALLOWS a plain count', moneyOk('<p>12 apparatus</p>') === true],
  ['money: not vacuous - the scanner sees numbers', numbers('<p>12 and 3</p>').length === 2],
  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
  ['text: the body still is', textOf('<style>x</style><p>ok</p>').includes('ok') === true],
  ['verbatim: the composer sentences are non-empty', VERBATIM.every((v) => typeof v === 'string' && v.length > 20)],
];

let failed = 0;
for (const [label, passed] of selfTests) {
  if (!passed) { console.error('SELF-TEST FAILED: ' + label); failed += 1; }
}
if (failed) {
  console.error('\n' + failed + ' self-test(s) failed. The instrument is broken, so its verdict on the');
  console.error('artboards would be worthless and it does not report one.');
  process.exit(2);
}
console.log('self-tests: ' + selfTests.length + '/' + selfTests.length + ' passed, both directions');

/* ----------------------------------------------------------- the artboards */

const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
if (files.length === 0) { console.error('no artboards found. Run `node gen.mjs` first.'); process.exit(2); }

const expectedStn = new Set(S.demo.fire.extras.stations.map((s) => s.stationRef));

let bad = 0;
const totals = { pairs: 0, badges: 0, chips: 0, cells: 0, numbers: 0, faIds: 0, stnRefs: 0 };
const seenVerbatim = new Map(VERBATIM.map((v) => [v, 0]));

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const text = textOf(html);
  const problems = [];

  const p = pairs(html), b = badges(html), ch = chips(html), c = cells(html);
  const n = numbers(html), fa = faIds(html), stn = stnRefs(html);
  totals.pairs += p.length; totals.badges += b.length; totals.chips += ch.length;
  totals.cells += c.length; totals.numbers += n.length; totals.faIds += fa.length; totals.stnRefs += stn.length;

  if (p.length === 0) problems.push('NO domain/gate pair rendered: this board was not checked for an invented region');
  if (b.length === 0) problems.push('NO badge rendered: this board was not checked for an invented state word');
  if (n.length === 0) problems.push('NO numeric token: the money scan had nothing to scan');
  if (c.length === 0) problems.push('NO table cell: the person scan had nothing to scan');

  if (!pairsOk(html)) problems.push('domain/gate pairs not in the registry for ' + LENS + ': ' + p.filter((x) => !PAIRS.has(x)).join(', '));
  if (!gatesOk(html)) problems.push('uncatalogued vendor kind: ' + gates(html).filter((k) => !KINDS.has(k)).join(', '));
  if (!badgesOk(html)) problems.push('invented state word: ' + b.filter((x) => !BADGE_WORDS.has(x)).join(', '));
  if (!statusesOk(html)) problems.push('invented composer status: ' + statuses(html).filter((x) => !STATUSES.has(x)).join(', '));
  if (!bandsOk(html)) problems.push('readiness band the product does not declare: ' + ch.filter((x) => !BAND_LABELS.has(x)).join(', '));
  if (!moneyOk(html)) problems.push('a money token reached a generated-record surface');
  const named = people(html);
  if (named.length) problems.push('table cells name people: ' + [...new Set(named)].join(', '));
  /** The roster is all or nothing: a readiness screen showing part of a roster is worse than none. */
  if (fa.length && !exactOk(fa, S.demo.fire.records.map((r) => r.recordId))) {
    problems.push('apparatus ids are [' + fa.join(', ') + ']');
    problems.push('the composer says [' + S.demo.fire.records.map((r) => r.recordId).join(', ') + ']');
  }
  const badStn = [...new Set(stn)].filter((r) => !expectedStn.has(r));
  if (badStn.length) problems.push('station refs the composer never produced: ' + badStn.join(', '));
  for (const v of VERBATIM) if (text.includes(v)) seenVerbatim.set(v, seenVerbatim.get(v) + 1);

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + p.length + ' pairs, ' + b.length + ' badges, ' + ch.length +
      ' band chips, ' + c.length + ' cells, ' + n.length + ' numbers, ' + fa.length + ' unit ids, ' + stn.length + ' station refs)');
  }
}

const missing = [...seenVerbatim.entries()].filter(([, n]) => n === 0).map(([v]) => v);
if (missing.length) {
  bad += 1;
  console.error('FAIL composer sentences that no artboard quotes verbatim:');
  for (const m of missing) console.error('     ' + JSON.stringify(m.slice(0, 96) + '...'));
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', ') +
  ', verbatim=' + [...seenVerbatim.values()].reduce((a, x) => a + x, 0) + ' of ' + VERBATIM.length + ' sentences');

const vacuous = Object.entries(totals).filter(([, v]) => v === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard: ' +
    vacuous.map(([k]) => k).join(', ') + '. A check with no inputs is worse than no check.');
  process.exit(2);
}

if (bad) { console.error('\n' + bad + ' failure(s).'); process.exit(1); }
console.log(files.length + ' artboards pass.');
