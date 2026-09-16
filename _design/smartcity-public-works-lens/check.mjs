/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested
 * perfectly and matched nothing on any artboard, because the canvas rendered
 * display forms and the check looked for the product's codes. It reported
 * success and checked nothing. So every predicate here reports a COUNT of the
 * inputs it matched and this file aborts if any of them matched zero. A
 * predicate whose legitimate answer is "no matches" (nothing forbidden is
 * present) is paired with a companion count of the things it SCANNED, which
 * must be non-zero, so "found no money" can never be satisfied by finding no
 * text.
 *
 * WHAT IS BEING COMPARED. Not the canvas against itself. Every predicate takes
 * one input from the artboard and one from `source-state.json`, which is the
 * product's own composer output at smartcity-dashboards origin/main f776b4bf.
 * One party acting alone cannot satisfy both sides.
 *
 * Each check self-tests in BOTH directions before any artboard is read, and the
 * self-tests abort the file rather than degrade it.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-state.json is missing or unparsable. It is the product composer output');
  console.error('this file checks the canvas against, and there is no second source without it.');
  console.error('Re-dump it from smartcity-dashboards rather than letting the check pass silently.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

/** Every (domainId, gatedBy) pair the product registers on THIS lens. */
const LENS = 'public-works';
const PAIRS = new Set(
  S.vocab.registry.filter((d) => d.lensId === LENS).map((d) => d.id + ':' + d.gatedBy),
);
if (PAIRS.size === 0) {
  console.error('the registry in source-state.json yielded no domains for ' + LENS + '. Either the');
  console.error('field names moved or the dump is wrong; either way this file cannot check anything.');
  process.exit(2);
}
/** Every catalogued adapter kind, via the registry. A gate outside this is invented. */
const KINDS = new Set(S.vocab.registry.map((d) => d.gatedBy));

/** The nav and pill words the product ships. An artboard may not invent a state word. */
const BADGE_WORDS = new Set([
  'Empty', 'Not built', 'Not read', 'Preview', 'Demo records',
  'Not connected', 'Unread', 'Partial', 'Mounted', 'Restricted',
]);

/** The composer's own status values, plus the live path's one extra. */
const STATUSES = new Set([...S.states.DOMAIN_STATUSES, S.states.fifthState, 'unavailable']);

/**
 * Sentences that must appear on the canvas EXACTLY as the composer wrote them.
 * A board that paraphrases a basis has stopped quoting the product and started
 * asserting on its own account, which is the whole failure mode here.
 */
const VERBATIM = [
  S.demo.cip.basis,
  S.demo.cip.countingRule,
  S.demo.cip.extras.budgetBasis,
  S.demo.calls.extras.totals.countingRule,
  S.demo.calls.extras.excludedFamilies,
  S.demo.calls.records[0].identityBasis,
  S.unconnected.cip.basis,
  S.staging.cip.basis,
];

/**
 * The money rule, copied from src/fixture-seam.mjs FORBIDDEN_CONTENT at
 * f776b4bf. This lens prints no money at all: a capital improvement register is
 * a budget document everywhere else and this one refuses, in the domain's own
 * words. Copied rather than re-written, because a re-written gate is a second
 * implementation of one rule.
 */
const MONEY = /[$¢£¥€]|\b(usd|dollars?|cents?|euros?)\b|\b\d[\d,]*(\.\d+)?\s*(hundred|thousand|million|billion|trillion)\b|\bpaid\b|\bfees? collected\b/i;

/** A person, in the shapes the v1 capture produces. A business is deliberately not matched. */
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/* ------------------------------------------------------------- extractors */

const PAIR_RE = /([a-z][a-z0-9-]*) &middot; gatedBy ([a-z][a-z0-9]*)/g;
const BADGE_RE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([^<]*)<\/span>/g;
const CELL_RE = /font:400 13px\/18px var\(--sc-font-(?:data|ui)\); color:var\(--sc-ink(?:-2)?\);">([^<]*)<\/span>/g;
const CIP_RE = /FIX-CIP-\d{4}/g;
const CV_RE = /FIX-CV-\d{4}/g;
const QUEUE_RE = /QUE-\d{2}/g;
const STATUS_RE = /status: ([a-z-]+)/g;
const NUM_RE = /\d[\d,]*/g;

const pairs = (html) => [...html.matchAll(PAIR_RE)].map((m) => m[1] + ':' + m[2]);
const gates = (html) => [...html.matchAll(PAIR_RE)].map((m) => m[2]);
const badges = (html) => [...html.matchAll(BADGE_RE)].map((m) => m[1]);
const cells = (html) => [...html.matchAll(CELL_RE)].map((m) => m[1].trim());
const people = (html) => cells(html).filter((c) => PERSON.test(c));
const cipIds = (html) => html.match(CIP_RE) || [];
const cvIds = (html) => html.match(CV_RE) || [];
const queueRefs = (html) => html.match(QUEUE_RE) || [];
const statuses = (html) => [...html.matchAll(STATUS_RE)].map((m) => m[1]);
/** Numbers as a READER sees them. Run over raw markup this counted CSS pixel values. */
const numbers = (html) => textOf(html).match(NUM_RE) || [];

/** Text only, so a CSS colour or a var() name can never satisfy a content rule. */
const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ');

const pairsOk = (html) => pairs(html).every((p) => PAIRS.has(p));
const gatesOk = (html) => gates(html).every((k) => KINDS.has(k));
const badgesOk = (html) => badges(html).every((b) => BADGE_WORDS.has(b));
const statusesOk = (html) => statuses(html).every((s) => STATUSES.has(s));
const moneyOk = (html) => !MONEY.test(textOf(html));
const prefixOk = (found, expected) => found.every((id, i) => id === expected[i]);

/* ------------------------------------------------------------- self-tests */

const pairCell = (d, k) => '<span>' + d + ' &middot; gatedBy ' + k + '</span>';
const badgeCell = (t) => 'border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
const cell = (t) => '<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';

const GOOD_PAIRS = pairCell('cip-projects', 'powerbi') + pairCell('call-analytics', 'goto');
const WRONG_GATE = pairCell('cip-projects', 'opengov');
const INVENTED_DOMAIN = pairCell('parks-facilities', 'powerbi');
const INVENTED_KIND = pairCell('cip-projects', 'sparkline');

const selfTests = [
  ['pairs: accepts the two the product registers on this lens', pairsOk(GOOD_PAIRS) === true],
  ['pairs: REFUSES a registered domain under the wrong gate', pairsOk(WRONG_GATE) === false],
  ['pairs: REFUSES a domain that is not on this lens', pairsOk(INVENTED_DOMAIN) === false],
  ['pairs: REFUSES an uncatalogued vendor kind', gatesOk(INVENTED_KIND) === false],
  ['pairs: accepts a catalogued kind', gatesOk(GOOD_PAIRS) === true],
  ['pairs: not vacuous - the extractor found two', pairs(GOOD_PAIRS).length === 2],
  ['badges: accepts the shipped vocabulary', badgesOk(badgeCell('Demo records')) === true],
  ['badges: REFUSES an invented state word', badgesOk(badgeCell('Syncing')) === false],
  ['badges: not vacuous - the extractor found one', badges(badgeCell('Empty')).length === 1],
  ['statuses: accepts a composer status', statusesOk('status: no-fixture-source') === true],
  ['statuses: REFUSES an invented status', statusesOk('status: stale') === false],
  ['statuses: not vacuous - the extractor found one', statuses('status: ungranted').length === 1],
  ['money: REFUSES a currency symbol', moneyOk('<span>$4,200</span>') === false],
  ['money: REFUSES a spelled magnitude', moneyOk('<span>1.4 million</span>') === false],
  ['money: REFUSES a bare currency word', moneyOk('<span>two hundred dollars</span>') === false],
  ['money: ALLOWS a plain count', moneyOk('<span>2,365 buckets</span>') === true],
  ['money: ALLOWS a colour token that contains a dollarless hash', moneyOk('<span style="color:#0B6A7B">ok</span>') === true],
  ['money: not vacuous - the scanner sees numbers', numbers('<span>2,365 and 16</span>').length === 2],
  ['people: REFUSES an initialised resident', PERSON.test('D. Moore') === true],
  ['people: REFUSES a capture-style full name', PERSON.test('DEBORAH MOORE') === true],
  ['people: ALLOWS a business', PERSON.test('Cima General Contracting') === false],
  ['people: ALLOWS a place label', PERSON.test('Fixture Ridge Block 4, Lot 22') === false],
  ['people: ALLOWS a queue label', PERSON.test('Permit desk line') === false],
  ['people: finds one in a rendered cell', people(cell('D. Moore')).length === 1],
  ['people: finds none in a place cell', people(cell('Sample Bend Block 2, Lot 29')).length === 0],
  ['rows: accepts the composer order as a prefix', prefixOk(['FIX-CIP-1026', 'FIX-CIP-1013'], ['FIX-CIP-1026', 'FIX-CIP-1013', 'FIX-CIP-1065']) === true],
  ['rows: REFUSES two rows swapped', prefixOk(['FIX-CIP-1013', 'FIX-CIP-1026'], ['FIX-CIP-1026', 'FIX-CIP-1013']) === false],
  ['rows: REFUSES an invented id', prefixOk(['FIX-CIP-9999'], ['FIX-CIP-1026']) === false],
  ['rows: not vacuous - the extractor found two', cipIds('FIX-CIP-1026 FIX-CIP-1013').length === 2],
  ['queues: extractor finds a composer ref', queueRefs('QUE-01 QUE-05').length === 2],
  ['queues: extractor finds none in prose', queueRefs('the main city line').length === 0],
  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
  ['text: the body still is', textOf('<style>x</style><p>ok</p>').includes('ok') === true],
  ['verbatim: the composer sentences are non-empty strings', VERBATIM.every((v) => typeof v === 'string' && v.length > 20)],
  ['verbatim: a paraphrase does not match', textOf('<p>generated from the PowerBI adapter</p>').includes(S.demo.cip.basis) === false],
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
if (files.length === 0) {
  console.error('no artboards found. Run `node gen.mjs` first.');
  process.exit(2);
}

const expectedCip = S.demo.cip.records.map((r) => r.recordId);
const expectedCv = S.demo.calls.records.map((r) => r.recordId);
const expectedQueues = new Set(S.demo.calls.records.map((r) => r.queueRef));

let bad = 0;
const totals = { pairs: 0, badges: 0, cells: 0, numbers: 0, cipIds: 0, queueRefs: 0, statuses: 0 };
const seenVerbatim = new Map(VERBATIM.map((v) => [v, 0]));

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const text = textOf(html);
  const problems = [];

  const p = pairs(html);
  const b = badges(html);
  const c = cells(html);
  const n = numbers(html);
  const st = statuses(html);
  const cip = cipIds(html);
  const cv = cvIds(html);
  const qr = queueRefs(html);
  totals.pairs += p.length; totals.badges += b.length; totals.cells += c.length;
  totals.numbers += n.length; totals.cipIds += cip.length; totals.queueRefs += qr.length;
  totals.statuses += st.length;

  /* Per-board non-vacuity. A board that matched nothing has not been checked. */
  if (p.length === 0) problems.push('NO domain/gate pair rendered: this board was not checked for an invented region');
  if (b.length === 0) problems.push('NO badge rendered: this board was not checked for an invented state word');
  if (n.length === 0) problems.push('NO numeric token: the money scan had nothing to scan');

  if (!pairsOk(html)) problems.push('domain/gate pairs not in the registry for ' + LENS + ': ' + p.filter((x) => !PAIRS.has(x)).join(', '));
  if (!gatesOk(html)) problems.push('uncatalogued vendor kind: ' + gates(html).filter((k) => !KINDS.has(k)).join(', '));
  if (!badgesOk(html)) problems.push('invented state word: ' + b.filter((x) => !BADGE_WORDS.has(x)).join(', '));
  if (!statusesOk(html)) problems.push('invented composer status: ' + st.filter((x) => !STATUSES.has(x)).join(', '));
  if (!moneyOk(html)) problems.push('a money token reached this lens, which prints none');
  const named = people(html);
  if (named.length) problems.push('table cells name people: ' + [...new Set(named)].join(', '));
  if (cip.length && !prefixOk(cip, expectedCip)) {
    problems.push('capital-project ids are [' + cip.join(', ') + ']');
    problems.push('the composer says [' + expectedCip.slice(0, cip.length).join(', ') + ']');
  }
  if (cv.length && !cv.every((id) => expectedCv.includes(id))) {
    problems.push('call ids not produced by the composer: ' + cv.filter((id) => !expectedCv.includes(id)).join(', '));
  }
  const badQueues = [...new Set(qr)].filter((r) => !expectedQueues.has(r));
  if (badQueues.length) problems.push('queue refs the composer never produced: ' + badQueues.join(', '));
  for (const v of VERBATIM) if (text.includes(v)) seenVerbatim.set(v, seenVerbatim.get(v) + 1);

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + p.length + ' pairs, ' + b.length + ' badges, ' + c.length +
      ' cells, ' + n.length + ' numbers, ' + cip.length + ' cip ids, ' + qr.length + ' queue refs)');
  }
}

/* The verbatim check is a property of the SET of boards, not of any one board. */
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
