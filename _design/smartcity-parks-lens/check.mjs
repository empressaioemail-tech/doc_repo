/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * THE CHECK THIS FOLDER EXISTS FOR. Parks is the one lens in the product that
 * does not exist, and the failure mode is not an ugly page: it is a page that
 * renders beautifully in the BUILT-surface language and tells a city to wait for
 * a grant that no vendor exists to give. src/domains.mjs draws that line in its
 * own comment and calls it "the only surviving meaning of the words not built".
 *
 * So the rule is two-sided and neither side can be satisfied by a sentinel:
 *
 *   Main.dc.html        the built-surface vocabulary must be ABSENT
 *   Difference.dc.html  it must be PRESENT, attributed to the other lens
 *
 * A design that drifted into "Not read" or "has not been read for this pack" on
 * Parks would fail the first half while still rendering perfectly, which is
 * exactly the class of defect a re-read of the canvas does not catch.
 *
 * THE SCOPE IS STRUCTURAL. Every read is scoped to the content inside
 * data-lens-body="parks", so the nav's own "Not read" badges on Police, Fire and
 * EMS and Fleet, which are correct and belong there, neither satisfy nor violate
 * a rule about the Parks page. A whole-document scan would pass on the wrong
 * evidence, which is its own way of checking nothing.
 *
 * EVERY PREDICATE REPORTS A COUNT and this file aborts if one matched zero. A
 * predicate whose legitimate answer is "nothing forbidden is present" carries a
 * companion count of what it SCANNED.
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

/** The composer sentence for an unregistered domain. Identical on every pack. */
const NOT_REGISTERED = S.notRegistered.onStaging.basis;
const NOT_REGISTERED_STATUS = S.notRegistered.onStaging.status;

/**
 * THE BUILT-SURFACE VOCABULARY. Every one of these is a sentence, a status or a
 * word that a BUILT region prints when it has no source. Half are lifted
 * straight out of the composer output, so they cannot drift away from the
 * product without this file noticing; the rest are the shipped UI strings from
 * web/index.html at f776b4bf.
 */
const BUILT_VOCAB = [
  S.builtButUnfed.callsOnUnconnected.basis,
  S.builtButUnfed.patrolOnDemo.basis,
  'no-fixture-source',
  'ungranted',
  'granted-empty',
  'is not granted on',
  'no adapter is granted on it',
  'has not been read',
  'Region unread',
  'Not read',
];

/** The subset Difference MUST carry. A contrast board carrying one term is not a contrast. */
const REQUIRED_ON_CONTRAST = [
  S.builtButUnfed.callsOnUnconnected.basis,
  'no-fixture-source',
  'ungranted',
  'has not been read',
];

const BADGE_WORDS = new Set([
  'Empty', 'Not built', 'Not read', 'Preview', 'Not connected',
]);

/** Regions per roster lens, off the registry. The canvas must not disagree with it. */
const REGISTRY_COUNT = new Map(
  S.vocab.ROSTER_LENS_IDS.map((id) => [id, S.vocab.registry.filter((d) => d.lensId === id).length]),
);

const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/* ------------------------------------------------------------- extractors */

const BODY_RE = /data-lens-body="parks"[\s\S]*?<\/main>/;
const GATE_RE = /gatedBy ([a-z][a-z0-9]*)/g;
const ROSTER_RE = /data-roster-region="([a-z-]+):(\d+)"/g;
const BADGE_RE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([^<]*)<\/span>/g;
const CELL_RE = /font:400 13px\/1[89]px var\(--sc-font-(?:data|ui)\); color:var\(--sc-ink(?:-2|-3)?\);">([^<]*)<\/span>/g;
/** A metric figure: 20px or larger in the data font. Parks displays no figure at all. */
const BIG_FIGURE_RE = /font:[45]00 (?:2[0-9]|[3-9][0-9])px\/\d+px var\(--sc-font-data\)/g;
const FONT_RE = /font:[0-9]{3} \d+px\/\d+px var\(--sc-font-(?:ui|data)\)/g;

/** Scope. Returns null rather than the whole document when the marker is missing. */
const bodyOf = (html) => {
  const m = html.match(BODY_RE);
  return m ? m[0] : null;
};
const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ');

const gates = (body) => body.match(GATE_RE) || [];
const rosterPairs = (body) => [...body.matchAll(ROSTER_RE)].map((m) => [m[1], Number(m[2])]);
const badges = (body) => [...body.matchAll(BADGE_RE)].map((m) => m[1]);
const cells = (body) => [...body.matchAll(CELL_RE)].map((m) => m[1].trim());
const people = (body) => cells(body).filter((c) => PERSON.test(c));
const bigFigures = (body) => body.match(BIG_FIGURE_RE) || [];
const fonts = (body) => body.match(FONT_RE) || [];
const builtTermsIn = (body) => BUILT_VOCAB.filter((t) => textOf(body).includes(t));

const badgesOk = (body) => badges(body).every((b) => BADGE_WORDS.has(b));
const rosterOk = (body) => rosterPairs(body).every(([id, n]) => REGISTRY_COUNT.get(id) === n);

/* ------------------------------------------------------------- self-tests */

const wrap = (inner) => '<nav><span>Not read</span></nav><main data-lens-body="parks">' + inner + '</main>';
const badgeCell = (t) => 'border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
const cell = (t) => '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';
const tileFigure = '<div style="font:400 24px/30px var(--sc-font-data); color:var(--sc-ink);">0</div>';

const CLEAN = wrap('<p>Parks is named, and it is not built. ' + NOT_REGISTERED + '</p>' + cell('ok'));
const DRIFTED = wrap('<p>The parks register has not been read for this pack.</p>' + cell('ok'));
const WITH_TILE = wrap('<p>' + NOT_REGISTERED + '</p>' + tileFigure + cell('ok'));
const WITH_GATE = wrap('<p>parks-facilities &middot; gatedBy parks</p>' + cell('ok'));

const selfTests = [
  ['scope: the body is found by its marker', bodyOf(CLEAN) !== null],
  ['scope: a document without the marker yields null, never the whole page', bodyOf('<main>x</main>') === null],
  ['scope: the nav outside the body is EXCLUDED', builtTermsIn(bodyOf(CLEAN)).length === 0],
  ['scope: and the nav really does carry the term', textOf(CLEAN).includes('Not read') === true],
  ['built: a clean Parks body carries none of the built vocabulary', builtTermsIn(bodyOf(CLEAN)).length === 0],
  ['built: REFUSES a drifted Parks body', builtTermsIn(bodyOf(DRIFTED)).length > 0],
  ['built: the vocabulary itself is non-empty', BUILT_VOCAB.length >= 8],
  ['built: every term is a real string', BUILT_VOCAB.every((t) => typeof t === 'string' && t.length > 3)],
  ['built: the contrast subset is a subset', REQUIRED_ON_CONTRAST.every((t) => BUILT_VOCAB.includes(t))],
  ['gate: a clean Parks body declares no gate', gates(bodyOf(CLEAN)).length === 0],
  ['gate: REFUSES a gate on Parks', gates(bodyOf(WITH_GATE)).length === 1],
  ['tile: a clean Parks body shows no metric figure', bigFigures(bodyOf(CLEAN)).length === 0],
  ['tile: REFUSES a metric figure', bigFigures(bodyOf(WITH_TILE)).length === 1],
  ['tile: not vacuous - the font scanner sees declarations', fonts(bodyOf(CLEAN)).length > 0],
  ['basis: the composer sentence is present', textOf(bodyOf(CLEAN)).includes(NOT_REGISTERED) === true],
  ['basis: a paraphrase does not satisfy it', textOf(bodyOf(wrap('<p>parks is not registered</p>'))).includes(NOT_REGISTERED) === false],
  ['basis: the composer sentence names no city', /template-city|empty-city|bastrop/i.test(NOT_REGISTERED) === false],
  ['basis: and it is identical on all three packs',
    S.notRegistered.onDemo.basis === NOT_REGISTERED && S.notRegistered.onUnconnected.basis === NOT_REGISTERED],
  ['badges: accepts the shipped vocabulary', badgesOk(wrap(badgeCell('Not built'))) === true],
  ['badges: REFUSES an invented state word', badgesOk(wrap(badgeCell('Coming soon'))) === false],
  ['badges: not vacuous - the extractor found one', badges(wrap(badgeCell('Not built'))).length === 1],
  ['roster: accepts the registry counts', rosterOk('<div data-roster-region="parks:0"></div>') === true],
  ['roster: REFUSES a count the registry does not agree with', rosterOk('<div data-roster-region="parks:1"></div>') === false],
  ['roster: REFUSES a wrong count on another lens', rosterOk('<div data-roster-region="fire-ems:3"></div>') === false],
  ['roster: not vacuous - the extractor found one', rosterPairs('<div data-roster-region="fleet:1"></div>').length === 1],
  ['roster: the registry really says parks is zero', REGISTRY_COUNT.get('parks') === 0],
  ['roster: and really says public-works is two', REGISTRY_COUNT.get('public-works') === 2],
  ['people: REFUSES an initialised name', PERSON.test('S. Carrillo') === true],
  ['people: ALLOWS a lens id', PERSON.test('fire-ems') === false],
  ['people: finds one in a rendered cell', people(cell('S. Carrillo')).length === 1],
  ['people: finds none in a plain cell', people(cell('no region, no vendor')).length === 0],
  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
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

/** Which board is which side of the rule. A board in neither set is a design change. */
const MUST_BE_CLEAN = new Set(['Main.dc.html']);
const MUST_CONTRAST = new Set(['Difference.dc.html']);

let bad = 0;
const totals = { bodies: 0, badges: 0, cells: 0, fonts: 0, roster: 0, builtOnContrast: 0 };

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const body = bodyOf(html);
  const problems = [];

  if (!body) {
    console.error('FAIL ' + file);
    console.error('     no data-lens-body="parks" marker: this board cannot be scoped, so it is not checked');
    bad += 1;
    continue;
  }
  totals.bodies += 1;

  const b = badges(body), c = cells(body), f = fonts(body), rp = rosterPairs(body);
  totals.badges += b.length; totals.cells += c.length; totals.fonts += f.length; totals.roster += rp.length;

  if (b.length === 0) problems.push('NO badge in the Parks body: this board was not checked for an invented state word');
  if (f.length === 0) problems.push('NO font declaration in the Parks body: the metric-figure scan had nothing to scan');
  if (c.length === 0) problems.push('NO cell in the Parks body: the person scan had nothing to scan');

  const found = builtTermsIn(body);
  if (MUST_BE_CLEAN.has(file)) {
    if (found.length) {
      problems.push('THE PARKS PAGE IS SPEAKING AS A BUILT SURFACE. Terms present: ' +
        found.map((t) => JSON.stringify(t.length > 46 ? t.slice(0, 46) + '...' : t)).join(', '));
      problems.push('Each of those says the surface EXISTS and is unfed. Parks does not exist.');
    }
  } else if (MUST_CONTRAST.has(file)) {
    totals.builtOnContrast += found.length;
    const absent = REQUIRED_ON_CONTRAST.filter((t) => !found.includes(t));
    if (absent.length) {
      problems.push('the contrast board does not carry the built-surface sentences it exists to contrast: ' +
        absent.map((t) => JSON.stringify(t.length > 46 ? t.slice(0, 46) + '...' : t)).join(', '));
    }
  } else {
    problems.push('this board is in neither MUST_BE_CLEAN nor MUST_CONTRAST, so the rule that makes');
    problems.push('this folder worth having was never applied to it. Classify it or delete it.');
  }

  if (!textOf(body).includes(NOT_REGISTERED)) {
    problems.push('the composer sentence is not on the page verbatim: ' + JSON.stringify(NOT_REGISTERED));
  }
  const g = gates(body);
  if (g.length) problems.push('Parks declares a vendor gate (' + [...new Set(g)].join(', ') + '); it has none, and there is no vendorless path through the seam');
  const bf = bigFigures(body);
  if (bf.length) problems.push(bf.length + ' metric figure(s) on a surface with nothing to measure: a tile reading a number, or reading "Not read", is the built-surface shape');
  if (!badgesOk(body)) problems.push('invented state word: ' + b.filter((x) => !BADGE_WORDS.has(x)).join(', '));
  if (!rosterOk(body)) {
    problems.push('roster counts disagree with the registry: ' +
      rosterPairs(body).filter(([id, n]) => REGISTRY_COUNT.get(id) !== n)
        .map(([id, n]) => id + ' shows ' + n + ', registry says ' + REGISTRY_COUNT.get(id)).join('; '));
  }
  const named = people(body);
  if (named.length) problems.push('cells name people: ' + [...new Set(named)].join(', '));

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + b.length + ' badges, ' + c.length + ' cells, ' + f.length +
      ' fonts, ' + rp.length + ' roster rows, ' + found.length + ' built-surface terms' +
      (MUST_BE_CLEAN.has(file) ? ', and none is correct' : ', as required') + ')');
  }
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));

/**
 * The two-sided rule is only meaningful if BOTH sides had inputs. A folder with
 * no contrast board would otherwise pass on the clean board alone, which is the
 * check reporting success while testing one half of its own premise.
 */
const vacuous = Object.entries(totals).filter(([, v]) => v === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing: ' + vacuous.map(([k]) => k).join(', ') +
    '. A check with no inputs is worse than no check, and builtOnContrast at zero means the' +
    ' two-sided rule was only ever tested on one side.');
  process.exit(2);
}

if (bad) { console.error('\n' + bad + ' failure(s).'); process.exit(1); }
console.log(files.length + ' artboards pass.');
