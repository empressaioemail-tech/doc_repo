/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * EVERY PREDICATE REPORTS A COUNT OF WHAT IT MATCHED, and this file aborts if
 * any of them matched zero across every artboard. A check shipped in this lane's
 * first wave that self-tested perfectly and matched nothing, because the canvas
 * rendered display forms and the check looked for the product's codes; it
 * reported success and checked nothing. A predicate whose legitimate answer is
 * "nothing forbidden is present" is paired with a count of what it SCANNED, so
 * "found no driver name" can never be satisfied by finding no text.
 *
 * WHAT IS BEING COMPARED. One input from the artboard and one from
 * `source-state.json`, the product's own composer, live mapper and record-shape
 * guard output at smartcity-dashboards origin/main f776b4bf. One party acting
 * alone cannot satisfy both sides.
 *
 * THE TWO RULES THIS LENS EXISTS TO HOLD.
 *
 * A DRIVER IS A PERSON. A granted Samsara feed carries driver names; a generated
 * record must not, so the roster groups on an opaque operator reference under a
 * declared format. This file refuses a person-shaped name in any cell and refuses
 * any operator reference that does not match the declared format, which is the
 * check that catches a driver name arriving in the column where the reference
 * belongs.
 *
 * A VEHICLE IS NOT AN ASSET. The Assets surface is excluded from design by ruling
 * because fleet telemetry is the standing example of the thing that looks like it
 * should fill an inventory and must not, so a Fleet lens that read as an
 * inventory would undercut that ruling from the side.
 *
 * TWO NARROWNESSES IN THE EXISTING CHECKS ARE CLOSED HERE, AND THE CLOSURES ARE
 * STATED BECAUSE A WIDENED RULE NOBODY CAN READ GETS WIDENED AGAIN.
 *
 * 1. VENDOR NAMES IN PROSE. The precedents verify the structured provenance foot
 *    against the registry and never read prose, so a basis sentence could name a
 *    vendor the foot contradicts. Here every vendor named anywhere on a board
 *    must be one the PRODUCT's own live-verification record names for this wave,
 *    and an uncatalogued fleet vendor is refused by name.
 * 2. THE INVENTORY VOCABULARY RULE IS SCOPED BY POSITION, NOT BY WORD. A blanket
 *    refusal of inventory words would refuse the product's own basis sentence,
 *    which says this is NOT a city-owned inventory node. So the needle list has
 *    its exclusion set COMPUTED from the verbatim source sentences and printed,
 *    and the structural half applies to assertive positions only: a column
 *    header or a tile key may not say "asset", while a panel title and a basis
 *    sentence may, because that is where a negation legitimately lives.
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

const LENS = 'fleet';
const OWN = S.vocab.registry.filter((d) => d.lensId === LENS);
if (OWN.length === 0) {
  console.error('the registry in source-state.json yielded no domains for ' + LENS + '. Either the');
  console.error('field names moved or the dump is wrong; either way this file cannot check anything.');
  process.exit(2);
}
const PAIRS = new Set(OWN.map((d) => d.id + ':' + d.gatedBy));
const REGIONS = new Set(OWN.map((d) => d.region));
const RECORD_TYPES = new Set(OWN.map((d) => d.recordType));
const KINDS = new Set(S.vocab.adapterKinds.map((k) => k.id));

const BADGE_WORDS = new Set(S.states.shippedBadgeWords);
const STATUSES = new Set([...S.states.DOMAIN_STATUSES, S.states.fifthState, S.states.liveState]);
const BAND_LABELS = new Set(S.axis.VEHICLE_STATUS_VALUES.map((b) => b.label));
const BAND_IDS = new Set(S.axis.VEHICLE_STATUS_VALUES.map((b) => b.id));
const ODOMETER_BANDS = new Set(S.axis.ODOMETER_BANDS);

/** The composer's roster, in the composer's order, and its operator coverage. */
const ROSTER = S.demo.records.map((r) => r.recordId);
const OPERATORS = S.demo.extras.operators.map((o) => [o.operatorRef, String(o.vehicleCount)]);
const OPERATOR_REFS = new Set(OPERATORS.map((o) => o[0]));

/** The declared format, parsed out of the product's own regex literal. */
const OPR_FORMAT = new RegExp(S.axis.formats.OPERATOR_REF_FORMAT.replace(/^\/|\/$/g, ''));
const VEHICLE_ID_FORMAT = new RegExp(S.axis.formats.VEHICLE_ID_FORMAT.replace(/^\/|\/$/g, ''));

/**
 * THE OPERATOR-REFERENCE CANDIDATE EXTRACTOR, THE SAMPLE THE SELF-TESTS USE, AND
 * WHY THE EXTRACTOR IS WIDER THAN THE FORMAT RATHER THAN EQUAL TO IT.
 *
 * The extractor was `/\bOPR-[A-Za-z0-9]+/g`, written by hand beside a format read
 * from the dump: two implementations of one rule, drifting on exactly the change
 * they exist to police. It drifted. Operator references are namespaced by domain
 * now (Fleet mints `FL-OPR-nn`), and in `FL-OPR-01` that pattern still matched,
 * because `-` is not a word character so `\b` sits happily BEFORE the `OPR`. The
 * extractor returned the truncated `OPR-01`, the truncation failed the declared
 * format, and the failure would have read as a defective BOARD rather than as a
 * bug in this file - an instrument reporting its own defect as the design's.
 *
 * The naive repair is to make the extractor exactly as strict as the format, and
 * it is worse than the bug: a predicate that refuses references outside the
 * declared format must be able to SEE one, and an extractor as strict as the
 * format finds nothing to refuse, so `every` returns true over an empty list and
 * the rule passes on precisely the board it was written to stop - a bare `OPR-01`
 * after the ruling made bare forms invalid. Both edges are watched by self-tests.
 *
 * So the candidate is a whole hyphen-and-alphanumeric TOKEN carrying the stem the
 * format declares: the maximal run around the stem, never a prefix of it, and
 * never case-folded. It captures `FL-OPR-01` whole, it still SEES a bare `OPR-01`
 * so the format can refuse it, and it sees a reference under an undeclared prefix
 * so that is refused too. The stem is read out of the declared body rather than
 * typed, and the sample values are minted from the same body, so a fixture cannot
 * be left behind in an old namespace either.
 */
const formatBody = (src) => {
  const m = String(src).match(/^\/(.*)\/[a-z]*$/);
  if (!m) throw new Error('a declared format in source-state.json is not a regex literal: ' + src);
  return m[1].replace(/^\^/, '').replace(/\$$/, '');
};
/** The stem the ruling keeps constant across namespaces: `OPR-`. */
const stemFrom = (body) => body.replace(/^[A-Z]{2}-/, '').replace(/\\d\{(\d+)\}$/, '');
const sampleFrom = (body) => body.replace(/\\d\{(\d+)\}/g, (_, n) => '3'.repeat(Number(n)));
const candidateReFor = (body) => {
  const stem = stemFrom(body).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /**
   * The tail is `+`, not `*`: the stem on its own is how a board DESCRIBES the
   * format in prose ("declared format: OPR- followed by exactly two digits"),
   * and prose that names the format is not a reference to be refused. A lone stem
   * has no value in it, so it is not a candidate.
   */
  return new RegExp('[A-Za-z0-9-]*' + stem + '[A-Za-z0-9-]+', 'g');
};

const OPR_BODY = formatBody(S.axis.formats.OPERATOR_REF_FORMAT);
const OPR_RE = candidateReFor(OPR_BODY);
const OPR_SAMPLE = sampleFrom(OPR_BODY);
/** The namespaced form the ruling declares, so the trap is tested against it. */
const OPR_NAMESPACED = /^FL-OPR-\d{2}$/;

/**
 * The vendors a board may name, and it is the PRODUCT that decides, not this
 * file: the gate this lens is registered under, plus every vendor the live
 * verification record names as answering or declining.
 */
const NAMEABLE_VENDORS = new Set([
  ...OWN.map((d) => d.gatedBy),
  ...S.live.vendorsAnswering,
  ...S.live.vendorsDeclining.map((v) => v.kind),
]);
const VENDOR_DISPLAY = new Map(S.vocab.adapterKinds.map((k) => [k.displayName.toLowerCase(), k.id]));
for (const k of S.vocab.adapterKinds) VENDOR_DISPLAY.set(k.id, k.id);

/** Needle shaped, and the needles are named. A fleet vendor the catalogue does not carry. */
const UNCATALOGUED_VENDORS = [
  'geotab', 'verizon connect', 'fleetio', 'zonar', 'lytx', 'motive', 'keeptruckin',
  'azuga', 'nextraq', 'teletrac', 'fleet complete', 'gps insight', 'webfleet', 'netradyne',
];

/**
 * The inventory needles, and the EXCLUSION SET IS COMPUTED rather than chosen.
 * A needle that occurs inside one of the product's own verbatim sentences is
 * dropped, because refusing the product's own words would make this file refuse
 * the very sentence that states the rule. The drops are printed: an instrument's
 * exclusion set is part of its contract.
 */
const INVENTORY_CANDIDATES = [
  'asset id', 'asset tag', 'asset number', 'asset register', 'asset class',
  'fixed asset', 'capital asset', 'asset lifecycle', 'depreciation', 'depreciated',
  'book value', 'useful life', 'replacement cost', 'salvage value', 'acquisition cost',
  'inventory node', 'tier 1 node', 'inventory count',
];

const MONEY = /[$¢£¥€]|\b(usd|dollars?|cents?|euros?)\b|\b\d[\d,]*(\.\d+)?\s*(hundred|thousand|million|billion|trillion)\b|\bpaid\b|\bfees? collected\b/i;
const TWIN = /\bdigital twin\b|\btwin\b/i;
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$|^(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+$/;

const VERBATIM = [
  S.demo.basis,
  S.demo.countingRule,
  S.axis.bases.OPERATOR_BASIS,
  S.axis.bases.DRIVER_COUNTING_RULE,
  S.axis.bases.NOT_AN_ASSET_BASIS,
  S.staging.basis,
  S.shipped.defaultSentences.operatorBasis,
  S.shipped.defaultSentences.inventory,
  S.live.liveExtrasBasis,
  ...S.live.guard.faults.map((f) => f.fault),
];

/* ------------------------------------------------------------- extractors */

const PAIR_RE = /([a-z][a-z0-9-]*) &middot; gatedBy ([a-z][a-z0-9]*)/g;
const FOOT_RE = /([a-z][a-z0-9-]*) &middot; gatedBy ([a-z][a-z0-9]*) &middot; ([a-z][a-z0-9-]*)/g;
const BADGE_RE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([^<]*)<\/span>/g;
const CHIP_RE = /border-radius:var\(--sc-r-full\); padding:2px 8px; white-space:nowrap;">([^<]*)<\/span>/g;
const CELL_RE = /font:400 13px\/18px var\(--sc-font-(?:data|ui)\); color:var\(--sc-[a-z0-9-]+\);">([^<]*)</g;
/** Assertive labels: column headers, matrix headers, tile keys and fact labels. */
const LABEL_RE = /letter-spacing:\.0[68]em; text-transform:uppercase; color:var\(--sc-ink-3\);[^"]*">([^<]*)</g;
const REGION_RE = /<span style="font:(?:620|400) 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink(?:-2)?\);">([^<]*)</g;
const FL_RE = /\bFIX-FL-[A-Za-z0-9]+/g;
const NUM_RE = /\d[\d,]*/g;

const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&middot;/g, '.')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

const pairs = (h) => [...h.matchAll(PAIR_RE)].map((m) => m[1] + ':' + m[2]);
const gates = (h) => [...h.matchAll(PAIR_RE)].map((m) => m[2]);
const recordTypes = (h) => [...h.matchAll(FOOT_RE)].map((m) => m[3]);
const badges = (h) => [...h.matchAll(BADGE_RE)].map((m) => m[1].trim());
const chips = (h) => [...h.matchAll(CHIP_RE)].map((m) => m[1].trim());
const cells = (h) => [...h.matchAll(CELL_RE)].map((m) => m[1].trim());
const labels = (h) => [...h.matchAll(LABEL_RE)].map((m) => m[1].trim());
const regionLabels = (h) => [...h.matchAll(REGION_RE)].map((m) => m[1].trim());
const oprRefs = (h) => h.match(OPR_RE) || [];
const flIds = (h) => h.match(FL_RE) || [];
const numbers = (h) => textOf(h).match(NUM_RE) || [];
const people = (h) => cells(h).filter((c) => PERSON.test(c));

const pairsOk = (h) => pairs(h).every((p) => PAIRS.has(p));
const gatesOk = (h) => gates(h).every((k) => KINDS.has(k));
const typesOk = (h) => recordTypes(h).every((t) => RECORD_TYPES.has(t));
const regionsOk = (h) => regionLabels(h).every((r) => REGIONS.has(r));
const badgesOk = (h) => badges(h).every((b) => BADGE_WORDS.has(b));
const bandsOk = (h) => chips(h).every((c) => BAND_LABELS.has(c));
const oprOk = (h) => oprRefs(h).every((r) => OPR_FORMAT.test(r));
const vehicleIdsOk = (h) => flIds(h).every((r) => VEHICLE_ID_FORMAT.test(r));
const moneyOk = (h) => !MONEY.test(textOf(h));
const twinOk = (h) => !TWIN.test(textOf(h));
/** A column header or a tile key may not assert an asset. A panel title may deny one. */
const labelsOk = (h) => labels(h).every((l) => !/\basset/i.test(l));
const exactOk = (found, expected) =>
  found.length === expected.length && found.every((v, i) => v === expected[i]);

/**
 * The residual: the board's text with every verbatim source sentence removed.
 * An inventory needle surviving that removal was written by this design rather
 * than quoted from the product, which is exactly the claim the rule is about.
 */
function residualOf(html) {
  let t = textOf(html);
  for (const v of VERBATIM) t = t.split(v).join(' ');
  return t;
}

/* --- the computed exclusion set, printed because it is part of the contract */
const EXCLUDED = INVENTORY_CANDIDATES.filter((n) =>
  VERBATIM.some((v) => v.toLowerCase().includes(n)) ||
  S.vocab.adapterKinds.some((k) => k.notes.toLowerCase().includes(n)));
const INVENTORY_NEEDLES = INVENTORY_CANDIDATES.filter((n) => !EXCLUDED.includes(n));
const inventoryHits = (h) => INVENTORY_NEEDLES.filter((n) => residualOf(h).toLowerCase().includes(n));

/* --- vendors named anywhere, compared against what the product names */
function vendorsNamed(html) {
  const t = ' ' + textOf(html).toLowerCase() + ' ';
  const found = new Set();
  for (const [needle, id] of VENDOR_DISPLAY) {
    if (new RegExp('(^|[^a-z])' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)').test(t)) found.add(id);
  }
  return [...found];
}
const vendorsOk = (h) => vendorsNamed(h).every((v) => NAMEABLE_VENDORS.has(v));
const uncataloguedHits = (h) => {
  const t = textOf(h).toLowerCase();
  return UNCATALOGUED_VENDORS.filter((v) => t.includes(v));
};

/** The Operators table, found structurally: a reference followed by a bare count. */
function operatorCoverage(html) {
  const c = cells(html);
  const out = [];
  for (let i = 0; i < c.length - 1; i += 1) {
    if (OPR_FORMAT.test(c[i]) && /^\d+$/.test(c[i + 1])) out.push([c[i], c[i + 1]]);
  }
  return out;
}

/* ------------------------------------------------------------- self-tests */

const pairCell = (d, k) => '<span>' + d + ' &middot; gatedBy ' + k + '</span>';
const footCell = (d, k, t) => '<span>' + d + ' &middot; gatedBy ' + k + ' &middot; ' + t + '</span>';
const badgeCell = (t) => 'border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
const chipCell = (t) => 'border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + t + '</span>';
const cell = (t) => '<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';
const labelCell = (t) => '<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden;">' + t + '</span>';
const regionCell = (t) => '<span style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + t + '</span>';
const opTable = (rows) => rows.map(([r, n]) => cell(r) + cell(n)).join('');

const selfTests = [
  ['pairs: accepts the one the product registers on this lens', pairsOk(pairCell('fleet-vehicles', 'samsara')) === true],
  ['pairs: REFUSES the right domain under the wrong gate', pairsOk(pairCell('fleet-vehicles', 'spireon')) === false],
  ['pairs: REFUSES a domain from another lens', pairsOk(pairCell('patrol-vehicles', 'spireon')) === false],
  ['pairs: REFUSES an uncatalogued vendor kind', gatesOk(pairCell('fleet-vehicles', 'geotab')) === false],
  ['pairs: not vacuous - the extractor found one', pairs(pairCell('fleet-vehicles', 'samsara')).length === 1],
  ['types: accepts the declared record type', typesOk(footCell('fleet-vehicles', 'samsara', 'fleet-vehicle')) === true],
  ['types: REFUSES a record type from another lens', typesOk(footCell('fleet-vehicles', 'samsara', 'patrol-vehicle')) === false],
  ['types: REFUSES an invented record type', typesOk(footCell('fleet-vehicles', 'samsara', 'city-asset')) === false],
  ['types: not vacuous - the extractor found one', recordTypes(footCell('fleet-vehicles', 'samsara', 'fleet-vehicle')).length === 1],
  ['regions: accepts the registered region name', regionsOk(regionCell([...REGIONS][0])) === true],
  ['regions: REFUSES a region name the product does not carry', regionsOk(regionCell('Asset inventory')) === false],
  ['regions: REFUSES another lens region', regionsOk(regionCell('Apparatus and stations')) === false],
  ['regions: not vacuous - the extractor found one', regionLabels(regionCell('Vehicle roster')).length === 1],
  ['bands: accepts the four the product declares', bandsOk([...BAND_LABELS].map(chipCell).join('')) === true],
  ['bands: REFUSES an invented fifth band', bandsOk(chipCell('Reserve')) === false],
  ['bands: REFUSES a raw vendor status passed through unmapped', bandsOk(chipCell('Off')) === false],
  ['bands: not vacuous - the extractor found four', chips([...BAND_LABELS].map(chipCell).join('')).length === 4],
  ['bands: the product declares four ids', BAND_IDS.size === 4],
  ['badges: accepts the shipped vocabulary', badgesOk(badgeCell('Demo records')) === true],
  ['badges: REFUSES an invented state word', badgesOk(badgeCell('Syncing')) === false],
  ['badges: REFUSES a plausible near miss', badgesOk(badgeCell('Connected')) === false],
  ['badges: not vacuous - the extractor found one', badges(badgeCell('Empty')).length === 1],
  ['operator: accepts the declared format', oprOk(cell(OPR_SAMPLE)) === true],
  ['operator: the sample used by these self-tests is minted from the declared format', OPR_FORMAT.test(OPR_SAMPLE) === true],
  ['operator: the extractor finds the sample the declared format accepts', oprRefs(OPR_SAMPLE).join() === OPR_SAMPLE],
  ['operator: REFUSES a reference outside the declared format', oprOk(cell(OPR_SAMPLE.replace(/\d{2}$/, '3'))) === false],
  ['operator: REFUSES a reference that has become a name', oprOk(cell('OPR-Dwayne')) === false],
  /**
   * THE TRAP, WATCHED BOTH WAYS, plus the edge the naive repair would have opened.
   * The first line asserts that the old hand-written extractor really did truncate
   * a namespaced reference - the defect is a property of that pattern, not a story.
   * The second asserts the derived extractor returns it whole. The third asserts
   * the extractor still SEES a bare reference, because a bare `OPR-01` is exactly
   * what the format must refuse and an extractor as strict as the format would
   * pass over it silently. The fourth does the same for an undeclared prefix.
   */
  ['operator: the OLD hand-written extractor truncated the namespaced form (the defect is real)',
    ('FL-OPR-01'.match(/\bOPR-[A-Za-z0-9]+/g) || [])[0] === 'OPR-01'],
  ['operator: the derived extractor returns the namespaced form whole',
    ('FL-OPR-01'.match(candidateReFor(formatBody(OPR_NAMESPACED))) || []).join() === 'FL-OPR-01'],
  ['operator: the derived extractor still SEES a bare reference, so the format can refuse it',
    ('OPR-01'.match(candidateReFor(formatBody(OPR_NAMESPACED))) || []).join() === 'OPR-01'],
  ['operator: a reference under an undeclared prefix is seen and refused, not missed',
    ('FLEET-OPR-01'.match(candidateReFor(formatBody(OPR_NAMESPACED))) || []).join() === 'FLEET-OPR-01'],
  ['operator: against the NAMESPACED format a bare reference is refused, so the widening cannot weaken it',
    OPR_NAMESPACED.test('OPR-01') === false && ('OPR-01'.match(candidateReFor(formatBody(OPR_NAMESPACED))) || []).length === 1],
  ['operator: not vacuous - the extractor found two', oprRefs(OPR_SAMPLE + ' and ' + OPR_SAMPLE).length === 2],
  ['operator: finds none in prose about operators', oprRefs('the operator dimension').length === 0],
  ['operator: prose that NAMES the format is not a candidate, so describing the rule stays legal',
    oprRefs('declared format: OPR- followed by exactly two digits').length === 0],
  ['coverage: accepts the composer pairs', exactOk(operatorCoverage(opTable(OPERATORS)).map(String), OPERATORS.map(String))],
  ['coverage: REFUSES a changed count', !exactOk(operatorCoverage(opTable(OPERATORS.map(([r, n], i) => [r, i === 0 ? '9' : n]))).map(String), OPERATORS.map(String))],
  ['coverage: REFUSES a dropped operator', !exactOk(operatorCoverage(opTable(OPERATORS.slice(1))).map(String), OPERATORS.map(String))],
  ['people: REFUSES an initialised name', PERSON.test('J. Halloran') === true],
  ['people: REFUSES a capture-style full name', PERSON.test('DEBORAH MOORE') === true],
  ['people: REFUSES a titled name', PERSON.test('Mr Whitfield') === true],
  ['people: ALLOWS a unit label', PERSON.test('Street sweeper unit 16') === false],
  ['people: ALLOWS an odometer band', PERSON.test('60k to 120k miles') === false],
  ['people: ALLOWS an opaque operator reference', PERSON.test(OPR_SAMPLE) === false],
  ['people: finds a driver name in a rendered cell', people(cell('R. Alvarado')).length === 1],
  ['people: finds none in a vehicle cell', people(cell('Bucket truck unit 15')).length === 0],
  ['roster: accepts the composer order in full', exactOk(ROSTER, ROSTER) === true],
  ['roster: REFUSES a partial roster', exactOk(ROSTER.slice(0, 13), ROSTER) === false],
  ['roster: REFUSES two vehicles swapped', exactOk([ROSTER[1], ROSTER[0], ...ROSTER.slice(2)], ROSTER) === false],
  ['roster: REFUSES an id outside the declared format', vehicleIdsOk(cell('FIX-FL-99')) === false],
  ['roster: not vacuous - the extractor found two', flIds('FIX-FL-1005 FIX-FL-1010').length === 2],
  ['labels: ALLOW the shipped column headers', labelsOk(S.shipped.rosterHead.map(labelCell).join('')) === true],
  ['labels: REFUSE an inventory column header', labelsOk(labelCell('Asset tag')) === false],
  ['labels: REFUSE an inventory tile key', labelsOk(labelCell('Asset id')) === false],
  ['labels: not vacuous - the extractor found the shipped eight', labels(S.shipped.rosterHead.map(labelCell).join('')).length === S.shipped.rosterHead.length],
  ['inventory: the exclusion set is computed, not empty', EXCLUDED.length > 0],
  ['inventory: needles survive the exclusion', INVENTORY_NEEDLES.length > 0],
  ['inventory: ALLOWS the product own basis sentence', inventoryHits('<p>' + S.axis.bases.NOT_AN_ASSET_BASIS + '</p>').length === 0],
  ['inventory: REFUSES a needle this design wrote', inventoryHits('<p>each row carries an asset tag</p>').length === 1],
  ['inventory: REFUSES depreciation anywhere', inventoryHits('<p>straight line depreciation applies</p>').length === 1],
  ['vendors: ALLOWS the gate this lens is registered under', vendorsOk('<p>Samsara is granted on this pack</p>') === true],
  ['vendors: ALLOWS a vendor the live record names', vendorsOk('<p>spireon and powerbi return real data</p>') === true],
  ['vendors: REFUSES a catalogued vendor this wave does not name', vendorsOk('<p>the Esri layer fills this table</p>') === false],
  ['vendors: REFUSES an uncatalogued fleet vendor', uncataloguedHits('<p>pulled from Geotab</p>').length === 1],
  ['vendors: not vacuous - the extractor found one', vendorsNamed('<p>Samsara</p>').length === 1],
  ['vendors: does not fire on a substring', vendorsNamed('<p>gotong esriform</p>').length === 0],
  ['money: REFUSES a currency symbol', moneyOk('<p>$4,200</p>') === false],
  ['money: REFUSES the standalone word the product gate refuses', moneyOk('<p>ninety per cent</p>') === false],
  ['money: ALLOWS an odometer band', moneyOk('<p>' + [...ODOMETER_BANDS][0] + '</p>') === true],
  ['money: ALLOWS a plain count', moneyOk('<p>14 vehicles</p>') === true],
  ['money: not vacuous - the scanner sees numbers', numbers('<p>14 and 4</p>').length === 2],
  ['twin: REFUSES the word this product never uses externally', twinOk('<p>the digital twin of the city</p>') === false],
  ['twin: ALLOWS ordinary copy', twinOk('<p>the record, the asset, current state</p>') === true],
  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
  ['text: the body still is', textOf('<style>x</style><p>ok</p>').includes('ok') === true],
  ['residual: a verbatim sentence is removed from the residual', residualOf('<p>' + S.axis.bases.NOT_AN_ASSET_BASIS + '</p>').trim() === ''],
  ['residual: text this design wrote survives', residualOf('<p>written here</p>').includes('written here') === true],
  ['verbatim: the composer sentences are non-empty', VERBATIM.every((v) => typeof v === 'string' && v.length > 20)],
  ['verbatim: there are more than five of them', VERBATIM.length > 5],
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
console.log('inventory needles: ' + INVENTORY_NEEDLES.length + ' live, ' + EXCLUDED.length +
  ' excluded because the product says them itself [' + EXCLUDED.join(', ') + ']');
console.log('nameable vendors, from the product: ' + [...NAMEABLE_VENDORS].join(', '));

/* ----------------------------------------------------------- the artboards */

const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
if (files.length === 0) { console.error('no artboards found. Run `node gen.mjs` first.'); process.exit(2); }

let bad = 0;
const totals = {
  pairs: 0, recordTypes: 0, regions: 0, badges: 0, chips: 0, cells: 0,
  labels: 0, numbers: 0, vehicleIds: 0, operatorRefs: 0, vendors: 0,
};
const seenVerbatim = new Map(VERBATIM.map((v) => [v, 0]));

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const text = textOf(html);
  const problems = [];

  const p = pairs(html), rt = recordTypes(html), rg = regionLabels(html);
  const b = badges(html), ch = chips(html), c = cells(html), lb = labels(html);
  const n = numbers(html), fl = flIds(html), op = oprRefs(html), vn = vendorsNamed(html);
  totals.pairs += p.length; totals.recordTypes += rt.length; totals.regions += rg.length;
  totals.badges += b.length; totals.chips += ch.length; totals.cells += c.length;
  totals.labels += lb.length; totals.numbers += n.length; totals.vehicleIds += fl.length;
  totals.operatorRefs += op.length; totals.vendors += vn.length;

  if (p.length === 0) problems.push('NO domain/gate pair rendered: this board was not checked for an invented region');
  if (b.length === 0) problems.push('NO badge rendered: this board was not checked for an invented state word');
  if (c.length === 0) problems.push('NO cell rendered: the person scan had nothing to scan');
  if (lb.length === 0) problems.push('NO assertive label rendered: the inventory-header scan had nothing to scan');
  if (n.length === 0) problems.push('NO numeric token: the money scan had nothing to scan');

  if (!pairsOk(html)) problems.push('domain/gate pairs not registered for ' + LENS + ': ' + p.filter((x) => !PAIRS.has(x)).join(', '));
  if (!gatesOk(html)) problems.push('uncatalogued vendor kind: ' + gates(html).filter((k) => !KINDS.has(k)).join(', '));
  if (!typesOk(html)) problems.push('record type the registry does not carry here: ' + rt.filter((x) => !RECORD_TYPES.has(x)).join(', '));
  if (!regionsOk(html)) problems.push('region name the product does not carry: ' + rg.filter((x) => !REGIONS.has(x)).join(', '));
  if (!badgesOk(html)) problems.push('invented state word: ' + b.filter((x) => !BADGE_WORDS.has(x)).join(', '));
  if (!bandsOk(html)) problems.push('status band the product does not declare: ' + ch.filter((x) => !BAND_LABELS.has(x)).join(', '));
  if (!oprOk(html)) problems.push('operator reference outside the declared format ' + S.axis.formats.OPERATOR_REF_FORMAT + ': ' + op.filter((r) => !OPR_FORMAT.test(r)).join(', '));
  if (!vehicleIdsOk(html)) problems.push('vehicle id outside the declared format: ' + fl.filter((r) => !VEHICLE_ID_FORMAT.test(r)).join(', '));
  if (!moneyOk(html)) problems.push('a money token reached a generated-record surface');
  if (!twinOk(html)) problems.push('the word this product never uses externally reached a board');
  if (!labelsOk(html)) problems.push('a column header or tile key asserts an asset: ' + lb.filter((l) => /\basset/i.test(l)).join(', '));

  const inv = inventoryHits(html);
  if (inv.length) problems.push('inventory vocabulary this design wrote, outside any quoted source sentence: ' + inv.join(', '));
  const unc = uncataloguedHits(html);
  if (unc.length) problems.push('an uncatalogued fleet vendor is named: ' + unc.join(', '));
  if (!vendorsOk(html)) problems.push('a vendor the product does not name for this wave: ' + vn.filter((v) => !NAMEABLE_VENDORS.has(v)).join(', '));

  const named = people(html);
  if (named.length) problems.push('cells name people: ' + [...new Set(named)].join(', '));

  /** The roster is all or nothing: a partial roster on a readiness screen is worse than none. */
  if (fl.length && !exactOk(fl, ROSTER)) {
    problems.push('vehicle ids are [' + fl.join(', ') + ']');
    problems.push('the composer says [' + ROSTER.join(', ') + ']');
  }
  const badOpr = [...new Set(op)].filter((r) => !OPERATOR_REFS.has(r));
  if (badOpr.length) problems.push('operator references the composer never produced: ' + badOpr.join(', '));
  const cov = operatorCoverage(html);
  if (cov.length && !exactOk(cov.map(String), OPERATORS.map(String))) {
    problems.push('operator coverage is [' + cov.map((r) => r.join('=')).join(', ') + ']');
    problems.push('the composer says [' + OPERATORS.map((r) => r.join('=')).join(', ') + ']');
  }

  for (const v of VERBATIM) if (text.includes(v)) seenVerbatim.set(v, seenVerbatim.get(v) + 1);

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + p.length + ' pairs, ' + rg.length + ' regions, ' + b.length +
      ' badges, ' + ch.length + ' band chips, ' + c.length + ' cells, ' + lb.length + ' labels, ' +
      n.length + ' numbers, ' + fl.length + ' vehicle ids, ' + op.length + ' operator refs, ' +
      vn.length + ' vendors)');
  }
}

const missing = [...seenVerbatim.entries()].filter(([, n]) => n === 0).map(([v]) => v);
if (missing.length) {
  bad += 1;
  console.error('FAIL source sentences that no artboard quotes verbatim:');
  for (const m of missing) console.error('     ' + JSON.stringify(m.slice(0, 96) + '...'));
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', ') +
  ', verbatim=' + [...seenVerbatim.values()].filter((v) => v > 0).length + ' of ' + seenVerbatim.size +
  ' distinct source sentences (' + VERBATIM.length + ' required, ' + (VERBATIM.length - seenVerbatim.size) + ' of them identical to another)');

const vacuous = Object.entries(totals).filter(([, v]) => v === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard: ' +
    vacuous.map(([k]) => k).join(', ') + '. A check with no inputs is worse than no check.');
  process.exit(2);
}

if (bad) { console.error('\n' + bad + ' failure(s).'); process.exit(1); }
console.log(files.length + ' artboards pass.');
