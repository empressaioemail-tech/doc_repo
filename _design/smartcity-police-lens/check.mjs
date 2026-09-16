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
 * predicate whose legitimate answer is "no matches" is paired with a companion
 * count of the things it SCANNED, which must be non-zero, so "found no plate"
 * can never be satisfied by finding no text.
 *
 * WHAT IS BEING COMPARED. Not the canvas against itself. Every predicate takes
 * one input from the artboard and one from `source-state.json`, which is the
 * product's own composer output at smartcity-dashboards origin/main f776b4bf.
 * One party acting alone cannot satisfy both sides.
 *
 * TWO NARROWNESSES IN THE EARLIER LENS CHECKS ARE CLOSED HERE, and both are
 * stated because a rule nobody can read is a rule that gets widened again.
 *
 *   VENDOR NAMES IN PROSE. Public works, Parks and Fire and EMS verify the
 *   structured provenance foot against the registry and never look at the prose,
 *   so a basis sentence could name a vendor the foot contradicts. This file lifts
 *   every source-state string out of the board text FIRST, then requires every
 *   catalogued vendor display name remaining in the prose to be one of this
 *   lens's own two gates. Quotation stays legal; an unquoted vendor does not.
 *
 *   BIG FIGURES AT A NON-KIT WEIGHT. The Parks rule is scoped to `font:[45]00`
 *   at 20px or more, so a figure at any other weight walks through it. This one
 *   matches ANY three-digit weight at 20px or more in either font, and then goes
 *   further: every big figure's TEXT must be a number the composer produced. A
 *   figure nobody computed cannot reach this canvas at any weight.
 *
 * AND THE STRONGEST RULE ON THIS LENS. No plate string and no persons-of-interest
 * content anywhere. The lens also has to be able to SAY that it refuses them, so
 * gen.mjs marks every legitimate mention with data-refusal and this file lifts
 * the marked text out before scanning. The term list comes from the product's own
 * record shape; the markers come from the canvas. Neither satisfies the other.
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
  console.error('Re-dump it with dump-source-state.mjs rather than letting the check pass silently.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

const LENS = 'police';

/** Every (domainId, gatedBy) pair the product registers on THIS lens. */
const PAIRS = new Set(
  S.vocab.registry.filter((d) => d.lensId === LENS).map((d) => d.id + ':' + d.gatedBy),
);
if (PAIRS.size === 0) {
  console.error('the registry in source-state.json yielded no domains for ' + LENS + '. Either the');
  console.error('field names moved or the dump is wrong; either way this file cannot check anything.');
  process.exit(2);
}
/** Every catalogued adapter kind. A gate outside this is invented. */
const KINDS = new Set(S.vocab.adapterKinds.map((k) => k.id));
/** Vendor DISPLAY names, which is the form prose uses. */
const VENDOR_NAMES = S.vocab.adapterKinds.map((k) => k.displayName).filter((n) => n.length > 3);
/** The two this lens is allowed to name unquoted. */
const LENS_VENDORS = new Set(
  S.vocab.registry.filter((d) => d.lensId === LENS)
    .map((d) => S.vocab.adapterKinds.find((k) => k.id === d.gatedBy).displayName),
);

/** The nav and pill words the product ships. An artboard may not invent a state word. */
const BADGE_WORDS = new Set([
  'Empty', 'Not built', 'Not read', 'Preview', 'Demo records',
  'Not connected', 'Unread', 'Partial', 'Mounted', 'Restricted',
  'No source', 'No records',
]);
/** The five the product itself resolves to. If it ships one this set lacks, stop. */
for (const w of Object.values(S.shipped.lensBadgeMap)) {
  if (!BADGE_WORDS.has(w)) {
    console.error('the product ships the lens badge "' + w + '" and this check has no entry for it.');
    process.exit(2);
  }
}

/** The composer's own status values, plus the live path's one extra. */
const STATUSES = new Set([...S.states.DOMAIN_STATUSES, S.states.fifthState, S.states.liveStatus]);

/** Occupancy is a band. These are the only four, in the domain's declared order. */
const BANDS = S.axis.OCCUPANCY_BANDS;
const BAND_SET = new Set(BANDS);
const REPORTING = new Set(S.templates.reportingStatuses);
const DEV_STATUS = new Set(S.axis.DEVICE_STATUS_VALUES.map((s) => s.id));

/**
 * Every number the composer produced, as strings. A big figure on this canvas
 * must be one of these. Built from record counts, metric counts, band counts,
 * site counts, shape field counts and registry/grant sizes — all of them
 * measurements, none of them typed here.
 */
const FIGURES = new Set();
const addFigure = (n) => { if (Number.isFinite(n)) FIGURES.add(String(n)); };
for (const region of [S.demo.cameras, S.demo.patrol, S.staging.cameras, S.staging.patrol, S.proving.patrol, S.unconnected.cameras, S.unconnected.patrol]) {
  addFigure(region.recordCount);
  for (const m of region.extras?.metrics || []) addFigure(m.count);
  for (const s of region.extras?.sites || []) addFigure(s.cameraCount);
  for (const b of region.extras?.occupancy?.bands || []) addFigure(b.count);
  addFigure(region.extras?.occupancy?.measured);
}
addFigure(S.vocab.registry.filter((d) => d.lensId === LENS).length);
addFigure(S.vocab.adapterKinds.length);
addFigure(S.grants.bastropGrantedAdapters.length);
addFigure(S.grants.templateCityFixtureGrants.length);
addFigure(S.axis.SITE_COUNT);
addFigure(S.axis.OPERATOR_COUNT);
addFigure(S.shipped.operatorRefInVendorLive);
addFigure(S.shipped.assertRecordShapeInVendorLive);
addFigure(S.shipped.assertRecordShapeInFixtureSeam);
addFigure(S.shipped.verkadaOccurrencesInVendorLive);
for (const shape of Object.values(S.shapes)) addFigure(shape.fields.filter((f) => f.required === false).length);
/** The matrix cells and the operator roster: counts derived off the records. */
for (const st of S.axis.DEVICE_STATUS_VALUES) {
  for (const b of BANDS) addFigure(S.demo.cameras.records.filter((r) => r.status === st.id && r.occupancyBand === b).length);
}
for (const ref of new Set(S.proving.patrol.records.map((r) => r.operatorRef))) {
  addFigure(S.proving.patrol.records.filter((r) => r.operatorRef === ref).length);
}
/** The lens-count denominator, measured off the registry rather than typed. */
addFigure(new Set(S.vocab.registry.map((d) => d.lensId)).size);
/** The live-mapper count for this lens, derived from the two wiring booleans. */
addFigure([S.shipped.patrolIsLiveWired, S.shipped.camerasAreLiveWired].filter(Boolean).length);

/**
 * The money rule, copied from src/fixture-seam.mjs FORBIDDEN_CONTENT at
 * f776b4bf. Copied rather than re-written, because a re-written gate is a second
 * implementation of one rule. Note it refuses the standalone word `cent`, which
 * is why "percent" is the only spelling this folder uses.
 */
const MONEY = /[$¢£¥€]|\b(usd|dollars?|cents?|euros?)\b|\b\d[\d,]*(\.\d+)?\s*(hundred|thousand|million|billion|trillion)\b|\bpaid\b|\bfees? collected\b/i;

/** A person, in the shapes a capture produces. A business is deliberately not matched. */
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/**
 * THE SURVEILLANCE TERMS, taken from the product's own record shape rather than
 * from a list written here, plus the operational vocabulary a plate-reader or
 * watchlist surface would carry. Any of these outside a marked refusal fails.
 */
const REFUSED_FIELDS = S.shapes.verkada.fields.filter((f) => f.required === false).map((f) => f.name);
const SURVEILLANCE_TERMS = [
  ...REFUSED_FIELDS,
  'plate read', 'plate reads', 'licence plate', 'license plate', 'number plate',
  'person of interest', 'persons of interest', 'watchlist', 'watch list',
  'facial recognition', 'face match', 'alpr', 'bolo',
];
if (REFUSED_FIELDS.length < 2) {
  console.error('the verkada record shape declares fewer than two refused fields; the term list this');
  console.error('check derives from it would be too thin to mean anything. Re-dump before trusting it.');
  process.exit(2);
}

/**
 * A PLATE-SHAPED TOKEN, and its exclusion set is part of the contract.
 *
 * Uppercase alphanumerics, 5 to 8 characters ignoring one separator, carrying at
 * least two letters AND at least three digits. That admits every common plate
 * form (ABC1234, ABC-1234, 7XYZ123, 1ABC234) and excludes this product's own
 * identifiers, each of which is a DECLARED FORMAT in source-state and is
 * excluded by matching that format rather than by being listed here.
 *
 * It also excludes, by construction rather than by list: SITE-01 and OPR-01 (two
 * digits), G-139 (one letter), lowercase hashes such as f776b4bf, and any token
 * carrying a colon such as a parcel id.
 */
const DECLARED_FORMATS = Object.values(S.axis.formats).map((src) => {
  const m = String(src).match(/^\/(.*)\/([a-z]*)$/);
  return new RegExp(m[1], m[2]);
});
/**
 * THE FIRST SHAPE OF THIS RULE WAS BLINDED BY ITS OWN EXCLUSION SET, and the
 * violation run is what found it. It scanned for a candidate token that could
 * span separators, then excluded the whole candidate if any run inside it was a
 * declared composer format. A plate sitting next to a record id therefore joined
 * into one candidate, the record id excluded it, and "FIX-CAM-1007 7XYZ123"
 * passed. An exclusion whose scope is wider than its claim is a defect, and this
 * one made the strongest rule on the lens unable to fire.
 *
 * The shape now: REMOVE the composer's own identifiers from the text first, as
 * exact strings taken from the records rather than as patterns, and then match
 * plate forms against what is left. A plate beside anything is still found,
 * because the no-separator form matches it on its own.
 */
const IDENTIFIERS = new Set();
for (const region of [S.demo.cameras, S.demo.patrol, S.staging.cameras, S.staging.patrol, S.proving.patrol]) {
  for (const r of region.records || []) {
    for (const v of [r.recordId, r.siteRef, r.operatorRef]) if (typeof v === 'string') IDENTIFIERS.add(v);
  }
  for (const s of region.extras?.sites || []) IDENTIFIERS.add(s.siteRef);
}
if (IDENTIFIERS.size < 20) {
  console.error('fewer than 20 composer identifiers were found in source-state; the plate rule strips');
  console.error('them before scanning and would report noise. Re-dump before trusting a verdict.');
  process.exit(2);
}
const ID_LIST = [...IDENTIFIERS].sort((a, b) => b.length - a.length);
const stripIdentifiers = (t) => ID_LIST.reduce((acc, id) => acc.split(id).join(' '), t);

/** The forms a licence plate takes. Each is matched independently. */
const PLATE_FORMS = [
  /\b[A-Z0-9]{5,8}\b/g,
  /\b[A-Z0-9]{2,6}-[A-Z0-9]{2,6}\b/g,
  /\b[A-Z]{2,4} \d{3,4}\b/g,
  /\b\d{1,3} [A-Z]{3,4}\b/g,
];
const isPlateShaped = (tok) => {
  const bare = tok.replace(/[- ]/g, '');
  if (bare.length < 5 || bare.length > 8) return false;
  if (!/^[A-Z0-9]+$/.test(bare)) return false;
  const letters = (bare.match(/[A-Z]/g) || []).length;
  const digits = (bare.match(/\d/g) || []).length;
  if (letters < 2 || digits < 3) return false;
  return !DECLARED_FORMATS.some((re) => re.test(tok));
};
const plateCandidates = (t) => {
  const out = [];
  for (const re of PLATE_FORMS) out.push(...(t.match(re) || []));
  return out;
};

/**
 * Sentences that must appear on the canvas EXACTLY as the product wrote them.
 * A board that paraphrases a basis has stopped quoting the product and started
 * asserting on its own account, which is the whole failure mode here.
 */
/**
 * The two sentence TEMPLATES, compared in the form the boards can legally draw.
 * The product writes them as template literals, so a character-for-character
 * quotation would put a dollar sign on a lens that prints no money. gen.mjs
 * rewrites the slots to angle brackets and this applies the same transform to
 * the source string, so the comparison stays two-sided.
 */
const slotShape = (t) => t.replace(/\$\{([^}]*)\}/g, '<$1>');
const SHAPES = [S.templates.grantedEmpty, S.templates.notRegistered].map(slotShape);

const VERBATIM = [
  S.demo.cameras.basis,
  S.demo.cameras.countingRule,
  S.demo.cameras.extras.occupancy.countingRule,
  S.demo.cameras.extras.sites[0].countingRule,
  S.demo.cameras.extras.excludedFamilies,
  S.demo.cameras.extras.inventoryBasis,
  S.demo.cameras.records[0].identityBasis,
  S.demo.patrol.basis,
  S.staging.cameras.basis,
  S.staging.patrol.basis,
  S.staging.cameras.countingRule,
  S.axis.OPERATOR_BASIS,
  S.notRegistered.shippedBasis,
  S.shipped.lede,
  S.shipped.sitesCaption,
  S.shipped.vendorLiveSpireonClause,
];

/* ------------------------------------------------------------- extractors */

const BODY_RE = /<main data-lens-body="police"[\s\S]*?<\/main>/;
const PAIR_RE = /([a-z][a-z0-9-]*) &middot; gatedBy ([a-z][a-z0-9]*)/g;
const GATE_RE = /gatedBy ([a-z][a-z0-9]*)/g;
const BADGE_RE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([^<]*)<\/span>/g;
const CELL_RE = /font:400 13px\/18px var\(--sc-font-(?:data|ui)\); color:var\(--sc-ink(?:-2|-3)?\);">([^<]*)<\/span>/g;
const CAM_RE = /FIX-CAM-\d{4}/g;
const PV_RE = /FIX-PV-\d{4}/g;
const STATE_RE = /(?:^|[^a-z-])(ok|granted-empty|ungranted|no-fixture-source|not-registered|unavailable)(?![a-z-])/g;
const REFUSAL_RE = /<span data-refusal="1"[^>]*>([^<]*)<\/span>/g;
const FIGURE_RE = /data-figure="([^"]*)"/g;
const OCC_RE = /data-occupancy="([^"]*)"/g;
const BAND_RE = /data-band="([^"]*)"/g;
const MATRIX_RE = /data-cell="([a-z-]+):([^"]*)"/g;
/** ANY three-digit weight at 20px or more, in either font. The Parks rule was [45]00 in one. */
const BIG_FIGURE_RE = /font:\d{3} (?:2[0-9]|[3-9][0-9])px\/\d+px var\(--sc-font-(?:data|ui)\)[^>]*>([^<]*)</g;

const bodyOf = (html) => {
  const m = html.match(BODY_RE);
  return m ? m[0] : null;
};
/** Text only, so a CSS colour or a var() name can never satisfy a content rule. */
const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&middot;/g, ' ')
  .replace(/&rsquo;/g, "'")
  .replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/&mdash;/g, '-')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');

const pairs = (h) => [...h.matchAll(PAIR_RE)].map((m) => m[1] + ':' + m[2]);
const gates = (h) => [...h.matchAll(GATE_RE)].map((m) => m[1]);
const badges = (h) => [...h.matchAll(BADGE_RE)].map((m) => m[1]);
const cells = (h) => [...h.matchAll(CELL_RE)].map((m) => m[1].trim());
const people = (h) => cells(h).filter((c) => PERSON.test(c));
const camIds = (h) => h.match(CAM_RE) || [];
const pvIds = (h) => h.match(PV_RE) || [];
const states = (h) => [...h.matchAll(STATE_RE)].map((m) => m[1]);
const refusalText = (h) => [...h.matchAll(REFUSAL_RE)].map((m) => m[1]);
const figures = (h) => [...h.matchAll(FIGURE_RE)].map((m) => m[1]);
const occupancies = (h) => [...h.matchAll(OCC_RE)].map((m) => m[1]);
const bandsOf = (h) => [...h.matchAll(BAND_RE)].map((m) => m[1]);
const matrixCells = (h) => [...h.matchAll(MATRIX_RE)].map((m) => [m[1], m[2]]);
const bigFigures = (h) => [...h.matchAll(BIG_FIGURE_RE)].map((m) => m[1].trim()).filter((t) => t !== '');

/** The text with every declared refusal mention lifted out of it. */
const unrefusedText = (h) => {
  let t = textOf(h);
  for (const r of refusalText(h)) t = t.split(textOf(r)).join(' ');
  return t;
};
/** The text with every source-state string lifted out of it. */
const unquotedText = (h) => {
  let t = textOf(h);
  for (const v of ALL_SOURCE_STRINGS) if (v && t.includes(v)) t = t.split(v).join(' ');
  return t;
};

/** Every string source-state carries, so quotation can be told from assertion. */
const ALL_SOURCE_STRINGS = [];
(function collect(v) {
  if (typeof v === 'string') { if (v.length > 12) ALL_SOURCE_STRINGS.push(v); return; }
  if (Array.isArray(v)) { v.forEach(collect); return; }
  if (v && typeof v === 'object') Object.values(v).forEach(collect);
})(S);
ALL_SOURCE_STRINGS.sort((a, b) => b.length - a.length);

const pairsOk = (h) => pairs(h).every((p) => PAIRS.has(p));
const gatesOk = (h) => gates(h).every((k) => KINDS.has(k));
const badgesOk = (h) => badges(h).every((b) => BADGE_WORDS.has(b));
const statesOk = (h) => states(h).every((s) => STATUSES.has(s));
const moneyOk = (h) => !MONEY.test(textOf(h));
const twinOk = (h) => !/\btwins?\b/i.test(textOf(h));
const prefixOk = (found, expected) => found.every((id, i) => id === expected[i]);
const surveillanceHits = (h) => {
  const t = unrefusedText(h).toLowerCase();
  return SURVEILLANCE_TERMS.filter((term) => t.includes(term.toLowerCase()));
};
/**
 * ABSOLUTE, and deliberately not scoped to the unrefused text. A surveillance
 * TERM may appear inside a declared refusal, because the lens has to be able to
 * say what it refuses. A plate STRING may not appear anywhere at all, including
 * inside a sentence explaining that plates are refused: there is no legitimate
 * reason for one to be on this canvas and an example is not a reason.
 */
const plateHits = (h) => plateCandidates(stripIdentifiers(textOf(h))).filter(isPlateShaped);
/** The companion count, so "found no plate" cannot be satisfied by finding no token. */
const plateScanned = (h) => plateCandidates(stripIdentifiers(textOf(h))).length;
const proseVendors = (h) => {
  const t = unquotedText(h);
  return VENDOR_NAMES.filter((n) => new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(t));
};
const proseVendorsOk = (h) => proseVendors(h).every((n) => LENS_VENDORS.has(n));
const occupanciesOk = (h) => occupancies(h).every((b) => BAND_SET.has(b));
const bandsDeclaredOk = (h) => bandsOf(h).every((b) => BAND_SET.has(b));
const bigFiguresOk = (h) => bigFigures(h).every((t) => !/^\d[\d,]*$/.test(t) || FIGURES.has(t.replace(/,/g, '')));
const figuresOk = (h) => figures(h).every((t) => FIGURES.has(t));
/** A cell that cannot occur by rule must not be drawn as a count. */
const matrixOk = (h) => matrixCells(h).every(([st, band]) =>
  DEV_STATUS.has(st) && BAND_SET.has(band) && (REPORTING.has(st) === (band !== BANDS[0])));

/* ------------------------------------------------------------- self-tests */

const wrap = (inner) => '<nav><span>Not read</span></nav><main data-lens-body="police">' + inner + '</main>';
const pairCell = (d, k) => '<span>' + d + ' &middot; gatedBy ' + k + '</span>';
const badgeCell = (t) => 'border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
const cell = (t) => '<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';
const bigCell = (weight, size, t) => '<div style="font:' + weight + ' ' + size + 'px/30px var(--sc-font-data); color:var(--sc-ink);">' + t + '</div>';
const refusalCell = (t) => '<span data-refusal="1" style="x">' + t + '</span>';

const GOOD_PAIRS = pairCell('police-cameras', 'verkada') + pairCell('patrol-vehicles', 'spireon');
const WRONG_GATE = pairCell('police-cameras', 'spireon');
const OFF_LENS = pairCell('fleet-vehicles', 'samsara');
const INVENTED_KIND = pairCell('police-cameras', 'axon');
const PLATE_IN_CELL = wrap(cell('7XYZ123'));
const PLATE_IN_REFUSAL = wrap(refusalCell('a plate read such as 7XYZ123 is never carried'));
const TERM_LOOSE = wrap('<p>the watchlist for this site</p>');
const TERM_MARKED = wrap(refusalCell('no person of interest is carried'));
const REAL_REFUSED_TERM = REFUSED_FIELDS[0];

const selfTests = [
  ['pairs: accepts the two the product registers on this lens', pairsOk(GOOD_PAIRS) === true],
  ['pairs: REFUSES a registered domain under the wrong gate', pairsOk(WRONG_GATE) === false],
  ['pairs: REFUSES a domain that is not on this lens', pairsOk(OFF_LENS) === false],
  ['pairs: not vacuous - the extractor found two', pairs(GOOD_PAIRS).length === 2],
  ['gates: accepts a catalogued kind', gatesOk(GOOD_PAIRS) === true],
  ['gates: REFUSES an uncatalogued vendor kind', gatesOk(INVENTED_KIND) === false],
  ['gates: not vacuous - the extractor found two', gates(GOOD_PAIRS).length === 2],
  ['badges: accepts the shipped vocabulary', badgesOk(badgeCell('Demo records')) === true],
  ['badges: accepts the two this lens adds from LENS_BADGE', badgesOk(badgeCell('No source') + badgeCell('No records')) === true],
  ['badges: REFUSES an invented state word', badgesOk(badgeCell('Syncing')) === false],
  ['badges: not vacuous - the extractor found one', badges(badgeCell('Empty')).length === 1],
  ['states: accepts a composer status', statesOk('status ungranted here') === true],
  ['states: accepts the live path status', statesOk('reads unavailable today') === true],
  ['states: REFUSES an invented status', statesOk('status stale') === false || states('status stale').length === 0],
  ['states: not vacuous - the extractor found one', states('it is no-fixture-source on this pack').length === 1],
  ['money: REFUSES a currency symbol', moneyOk('<span>$4,200</span>') === false],
  ['money: REFUSES a spelled magnitude', moneyOk('<span>1.4 million</span>') === false],
  ['money: REFUSES British "per cent"', moneyOk('<span>92 per cent</span>') === false],
  ['money: ALLOWS "percent"', moneyOk('<span>92 percent</span>') === true],
  ['money: ALLOWS a plain count', moneyOk('<span>18 devices</span>') === true],
  ['twin: REFUSES the word', twinOk('<p>the digital twin</p>') === false],
  ['twin: ALLOWS the record', twinOk('<p>the record, the asset, current state</p>') === true],
  ['people: REFUSES an initialised resident', PERSON.test('D. Moore') === true],
  ['people: REFUSES a capture-style full name', PERSON.test('DEBORAH MOORE') === true],
  ['people: ALLOWS a place label', PERSON.test('Placeholder Heights') === false],
  ['people: ALLOWS a unit label', PERSON.test('Mobile trailer camera 11') === false],
  ['people: finds one in a rendered cell', people(cell('D. Moore')).length === 1],
  ['people: finds none in a device cell', people(cell('Dome camera 16')).length === 0],
  ['plate: REFUSES a plate in a table cell', plateHits(PLATE_IN_CELL).length === 1],
  ['plate: REFUSES a plate even inside a marked refusal', plateHits(PLATE_IN_REFUSAL).length === 1],
  ['plate: ALLOWS a composer record id', isPlateShaped('FIX-CAM-1007') === false],
  ['plate: ALLOWS a composer site ref', isPlateShaped('SITE-01') === false],
  ['plate: ALLOWS a composer operator ref', isPlateShaped('OPR-01') === false],
  ['plate: ALLOWS a plan row id', isPlateShaped('G-139') === false],
  ['plate: ALLOWS a programme id', isPlateShaped('OPS-17') === false],
  ['plate: ALLOWS a lowercase commit sha', isPlateShaped('f776b4bf') === false],
  ['plate: recognises four real plate forms',
    ['ABC1234', 'ABC-1234', '7XYZ123', '1ABC234'].every(isPlateShaped)],
  /* The two below are the defects the 2026-09-15 violation run found. They are
     self-tests now because a fix nobody can watch fail is not a fix. */
  ['plate: a plate BESIDE a composer record id is still found (the blinded-exclusion defect)',
    plateHits(wrap(cell('FIX-CAM-1007')) + wrap(cell('7XYZ123'))).length === 1],
  ['plate: a plate in the SAME cell as a record id is still found',
    plateHits(wrap(cell('FIX-CAM-1007 7XYZ123'))).length === 1],
  ['plate: stripping identifiers does not invent one out of a record id',
    plateHits(wrap(cell('FIX-CAM-1007 SITE-01 OPR-01'))).length === 0],
  ['plate: the scanner is not vacuous on text that has candidates',
    plateScanned(wrap(cell('OPS-17 ABC1234'))) >= 2],
  ['badges: the NAV is inside the scope, not only the lens body (the second defect)',
    badgesOk('<nav>' + badgeCell('Syncing') + '</nav>' + wrap('<p>x</p>')) === false],
  ['badges: a clean nav still passes',
    badgesOk('<nav>' + badgeCell('Not read') + '</nav>' + wrap('<p>x</p>')) === true],
  ['surveillance: REFUSES an unmarked term', surveillanceHits(TERM_LOOSE).includes('watchlist')],
  ['surveillance: ALLOWS a marked refusal', surveillanceHits(TERM_MARKED).length === 0],
  ['surveillance: the term list is derived from the record shape', SURVEILLANCE_TERMS.includes(REAL_REFUSED_TERM)],
  ['surveillance: REFUSES the shape field name unmarked', surveillanceHits(wrap('<p>' + REAL_REFUSED_TERM + '</p>')).length > 0],
  ['surveillance: not vacuous - the scanner sees text', unrefusedText(TERM_LOOSE).length > 10],
  ['vendors: ALLOWS this lens’s own gate in prose',
    proseVendorsOk(wrap('<p>Verkada is not granted here</p>')) === true],
  ['vendors: REFUSES another lens’s vendor unquoted',
    proseVendorsOk(wrap('<p>FirstDue declines the call</p>')) === false],
  ['vendors: ALLOWS another vendor inside a source-state quotation',
    proseVendorsOk(wrap('<p>' + S.shipped.vendorLiveSpireonClause + '</p>')) === true],
  ['vendors: not vacuous - the extractor finds one', proseVendors(wrap('<p>Verkada</p>')).length === 1],
  ['figures: ALLOWS a composer count at kit weight', bigFiguresOk(bigCell(400, 24, String(S.demo.cameras.recordCount))) === true],
  ['figures: REFUSES an invented count at kit weight', bigFiguresOk(bigCell(400, 24, '9814')) === false],
  ['figures: REFUSES an invented count at a NON-kit weight (the Parks gap)', bigFiguresOk(bigCell(370, 24, '9814')) === false],
  ['figures: REFUSES an invented count at a non-kit weight in the UI font',
    bigFiguresOk('<div style="font:370 26px/30px var(--sc-font-ui); color:var(--sc-ink);">9814</div>') === false],
  ['figures: ALLOWS a word in a big slot, which is how an unread tile renders', bigFiguresOk(bigCell(620, 22, 'Not read')) === true],
  ['figures: ignores a figure below 20px', bigFigures('<div style="font:400 13px/18px var(--sc-font-data);">9814</div>').length === 0],
  ['figures: not vacuous - the extractor found one', bigFigures(bigCell(400, 24, '18')).length === 1],
  ['figures: data-figure accepts a composer count', figuresOk('<span data-figure="' + S.demo.cameras.recordCount + '">x</span>') === true],
  ['figures: data-figure REFUSES an invented count', figuresOk('<span data-figure="9814">x</span>') === false],
  ['occupancy: accepts a declared band', occupanciesOk('<span data-occupancy="' + BANDS[0] + '">x</span>') === true],
  ['occupancy: REFUSES a head count in the band slot', occupanciesOk('<span data-occupancy="41">x</span>') === false],
  ['occupancy: REFUSES an invented band', occupanciesOk('<span data-occupancy="crowded">x</span>') === false],
  ['occupancy: not vacuous - the extractor found one', occupancies('<span data-occupancy="light">x</span>').length === 1],
  ['bands: accepts the declared order entry', bandsDeclaredOk('<span data-band="busy">x</span>') === true],
  ['bands: REFUSES an invented band', bandsDeclaredOk('<span data-band="packed">x</span>') === false],
  ['matrix: accepts a cell that can occur', matrixOk('<span data-cell="online:light">1</span>') === true],
  ['matrix: REFUSES a reporting status carrying the not-measured band',
    matrixOk('<span data-cell="online:' + BANDS[0] + '">0</span>') === false],
  ['matrix: REFUSES an unreporting status carrying a measured band',
    matrixOk('<span data-cell="offline:busy">0</span>') === false],
  ['matrix: REFUSES an invented status', matrixOk('<span data-cell="degraded:light">1</span>') === false],
  ['matrix: not vacuous - the extractor found one', matrixCells('<span data-cell="online:busy">4</span>').length === 1],
  ['rows: accepts the composer order as a prefix',
    prefixOk(['FIX-CAM-1007', 'FIX-CAM-1014'], ['FIX-CAM-1007', 'FIX-CAM-1014', 'FIX-CAM-1021']) === true],
  ['rows: REFUSES two rows swapped', prefixOk(['FIX-CAM-1014', 'FIX-CAM-1007'], ['FIX-CAM-1007', 'FIX-CAM-1014']) === false],
  ['rows: REFUSES an invented id', prefixOk(['FIX-CAM-9999'], ['FIX-CAM-1007']) === false],
  ['rows: not vacuous - the extractor found two', camIds('FIX-CAM-1007 FIX-CAM-1014').length === 2],
  ['rows: the patrol extractor finds a composer id', pvIds('FIX-PV-1009').length === 1],
  ['probe: the probe domain id is a real string', typeof S.notRegistered.probeId === 'string' && S.notRegistered.probeId.length > 6],
  ['body: the lens marker scopes the read', bodyOf(wrap('<p>ok</p>')) !== null],
  ['body: a document without the marker returns null rather than the whole file', bodyOf('<main>ok</main>') === null],
  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
  ['text: the body still is', textOf('<style>x</style><p>ok</p>').includes('ok') === true],
  ['verbatim: the composer sentences are non-empty strings', VERBATIM.every((v) => typeof v === 'string' && v.length > 18)],
  ['verbatim: a paraphrase does not match', textOf('<p>generated from the Verkada adapter</p>').includes(S.demo.cameras.basis) === false],
  ['verbatim: the two staging sentences differ', S.staging.cameras.basis !== S.staging.patrol.basis],
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

const expectedCam = S.demo.cameras.records.map((r) => r.recordId);
const expectedPv = S.proving.patrol.records.map((r) => r.recordId);
const PACK_KEYS = new Set(['template-city', 'empty-city', 'fixture-city', 'bastrop_tx', 'probe-city']);

let bad = 0;
const totals = {
  pairs: 0, gates: 0, badges: 0, cells: 0, states: 0, camIds: 0, pvIds: 0,
  refusals: 0, figures: 0, bigFigures: 0, occupancies: 0, bands: 0, matrixCells: 0,
  vendorMentions: 0, plateScanTokens: 0, packRefs: 0,
};
const seenVerbatim = new Map(VERBATIM.map((v) => [v, 0]));
const seenShapes = new Map(SHAPES.map((v) => [v, 0]));

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const body = bodyOf(html);
  const problems = [];
  if (body === null) {
    console.error('FAIL ' + file + '\n     no <main data-lens-body="police"> marker: this board was not checked at all');
    bad += 1;
    continue;
  }
  const text = textOf(html);

  const p = pairs(body), g = gates(body), b = badges(html), c = cells(body);
  const st = states(body), cam = camIds(body), pv = pvIds(body);
  const ref = refusalText(body), fig = figures(body), big = bigFigures(body);
  const occ = occupancies(body), bnd = bandsOf(body), mx = matrixCells(body);
  const vendors = proseVendors(html);
  const packRefs = [...PACK_KEYS].filter((k) => text.includes(k));

  totals.pairs += p.length; totals.gates += g.length; totals.badges += b.length;
  totals.cells += c.length; totals.states += st.length; totals.camIds += cam.length;
  totals.pvIds += pv.length; totals.refusals += ref.length; totals.figures += fig.length;
  totals.bigFigures += big.length; totals.occupancies += occ.length; totals.bands += bnd.length;
  totals.matrixCells += mx.length; totals.vendorMentions += vendors.length;
  totals.plateScanTokens += plateScanned(html); totals.packRefs += packRefs.length;

  /* Per-board non-vacuity. A board that matched nothing has not been checked. */
  if (p.length === 0) problems.push('NO domain/gate pair rendered: this board was not checked for an invented region');
  if (b.length === 0) problems.push('NO badge rendered: this board was not checked for an invented state word');
  if (c.length === 0) problems.push('NO table cell rendered: the person scan had nothing to scan');
  if (unrefusedText(html).length < 400) problems.push('the unrefused text is under 400 characters: the surveillance scan had nothing to scan');
  if (textOf(html).length < 3000) problems.push('under 3000 characters of text: the plate scan had almost nothing to scan');
  if (packRefs.length === 0) problems.push('NO pack key named: this board does not say which pack it drew');

  if (!pairsOk(body)) problems.push('domain/gate pairs not in the registry for ' + LENS + ': ' + p.filter((x) => !PAIRS.has(x)).join(', '));
  if (!gatesOk(body)) problems.push('uncatalogued vendor kind: ' + g.filter((k) => !KINDS.has(k)).join(', '));
  if (!badgesOk(html)) problems.push('invented state word: ' + b.filter((x) => !BADGE_WORDS.has(x)).join(', '));
  if (!statesOk(body)) problems.push('invented composer status: ' + st.filter((x) => !STATUSES.has(x)).join(', '));
  if (!moneyOk(html)) problems.push('a money token reached this lens, which prints none');
  if (!twinOk(html)) problems.push('the word "twin" reached a canvas a city sees');
  const named = people(body);
  if (named.length) problems.push('table cells name people: ' + [...new Set(named)].join(', '));

  const surv = surveillanceHits(html);
  if (surv.length) problems.push('SURVEILLANCE TERM outside a declared refusal: ' + [...new Set(surv)].join(', '));
  const plates = plateHits(html);
  if (plates.length) problems.push('PLATE-SHAPED TOKEN on the canvas: ' + [...new Set(plates)].join(', '));

  if (!proseVendorsOk(html)) {
    problems.push('vendor named in prose that this lens does not gate: ' +
      vendors.filter((n) => !LENS_VENDORS.has(n)).join(', '));
  }
  if (!figuresOk(body)) problems.push('a figure the composer never produced: ' + fig.filter((t) => !FIGURES.has(t)).join(', '));
  if (!bigFiguresOk(body)) {
    problems.push('a big figure the composer never produced: ' +
      big.filter((t) => /^\d[\d,]*$/.test(t) && !FIGURES.has(t.replace(/,/g, ''))).join(', '));
  }
  if (!occupanciesOk(body)) problems.push('an occupancy that is not a declared band: ' + occ.filter((x) => !BAND_SET.has(x)).join(', '));
  if (!bandsDeclaredOk(body)) problems.push('an invented band: ' + bnd.filter((x) => !BAND_SET.has(x)).join(', '));
  if (!matrixOk(body)) {
    problems.push('a matrix cell that cannot occur by rule is drawn as a count: ' +
      mx.filter(([s2, b2]) => !(DEV_STATUS.has(s2) && BAND_SET.has(b2) && (REPORTING.has(s2) === (b2 !== BANDS[0]))))
        .map((x) => x.join(':')).join(', '));
  }
  if (text.includes(S.notRegistered.probeId)) {
    problems.push('the probe domain id reached the canvas: ' + S.notRegistered.probeId);
  }
  if (cam.length && !prefixOk(cam, expectedCam)) {
    problems.push('camera ids are [' + cam.slice(0, 4).join(', ') + '...]');
    problems.push('the composer says [' + expectedCam.slice(0, 4).join(', ') + '...]');
  }
  if (pv.length && !prefixOk(pv, expectedPv)) {
    problems.push('patrol ids are [' + pv.slice(0, 4).join(', ') + '...]');
    problems.push('the composer says [' + expectedPv.slice(0, 4).join(', ') + '...]');
  }
  for (const v of VERBATIM) if (text.includes(v)) seenVerbatim.set(v, seenVerbatim.get(v) + 1);
  for (const v of SHAPES) if (text.includes(v)) seenShapes.set(v, seenShapes.get(v) + 1);

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + p.length + ' pairs, ' + b.length + ' badges, ' + c.length +
      ' cells, ' + ref.length + ' refusals, ' + big.length + ' big figures, ' + mx.length + ' matrix cells, ' +
      cam.length + ' cam ids, ' + pv.length + ' pv ids)');
  }
}

/* The verbatim check is a property of the SET of boards, not of any one board. */
const missing = [...seenVerbatim.entries()].filter(([, n]) => n === 0).map(([v]) => v);
if (missing.length) {
  bad += 1;
  console.error('FAIL composer sentences that no artboard quotes verbatim:');
  for (const m of missing) console.error('     ' + JSON.stringify(m.slice(0, 96) + '...'));
}
const missingShapes = [...seenShapes.entries()].filter(([, n]) => n === 0).map(([v]) => v);
if (missingShapes.length) {
  bad += 1;
  console.error('FAIL sentence templates no artboard draws in slot form:');
  for (const m of missingShapes) console.error('     ' + JSON.stringify(m.slice(0, 96) + '...'));
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', ') +
  ', verbatim=' + [...seenVerbatim.values()].filter((n) => n > 0).length + ' of ' + VERBATIM.length + ' sentences' +
  ', templates=' + [...seenShapes.values()].filter((n) => n > 0).length + ' of ' + SHAPES.length);

const vacuous = Object.entries(totals).filter(([, v]) => v === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard: ' +
    vacuous.map(([k]) => k).join(', ') + '. A check with no inputs is worse than no check.');
  process.exit(2);
}

if (bad) { console.error('\n' + bad + ' failure(s).'); process.exit(1); }
console.log(files.length + ' artboards pass.');
