/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs
 *   node violate.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS INSTRUMENT IS FOR
 *
 * The Citizen lens is the shipped surface with the least data behind it, which
 * makes it the one where ABSENT, ZERO and UNMEASURED are most tempting to render
 * as the same thing. The shipped page already does the hard part right on one of
 * its four panels — the lookup is disabled with its basis printed under it — and
 * the design's job was to extend that discipline rather than regress it. An
 * instrument for that design has to be able to say NO to four specific drifts:
 *
 *   1. A region that prints a state word nobody defined. The product's own
 *      vocabulary is Empty / Not built / Not read / Preview / Not connected, and
 *      the SHIPPED page carries "None on file", which is outside it. That is the
 *      proof the rule can fire: the instrument finds the violation on the
 *      product's side of the comparison, not on the design's.
 *   2. A region that prints no basis. A state word with no basis is a claim.
 *   3. A figure that carries a measurement without the rule that produced it, or
 *      an unmeasured region that carries a number anyway.
 *   4. Two regions collapsed onto one distance, or four panels redrawn as a
 *      metric strip. The twelve-tile grid was dropped once already
 *      (src/shell-homes.mjs:146) and both `data-tile` and `class="metrics"` are
 *      refused by name.
 *
 * TWO-SIDED, AND NEITHER SIDE CAN BE SATISFIED BY A SENTINEL.
 *
 *   Main.dc.html      the un-fed lens: every REGION figure is unmeasured, there
 *                     is no region-scoped measurement anywhere, and all four
 *                     distances appear exactly once
 *   Filled.dc.html    a fixture-badged fed lens: at least one region figure that
 *                     IS measured, including at least one measured ZERO, beside
 *                     at least one region that is still unread
 *   Distances.dc.html five distance cards, and the board carries the one
 *                     measured zero the product actually supports
 *
 * SCOPE IS STRUCTURAL. Every read is scoped to the content inside
 * `<main data-lens-body="citizen">`, so the nav's own "Not built" and "Not read"
 * badges — which are the shipped values and belong there — neither satisfy nor
 * violate a rule about the Citizen page. A whole-document scan would pass on the
 * wrong evidence, which is its own way of checking nothing. Removing the marker
 * makes the check REFUSE that board rather than fall back to the whole document.
 *
 * EVERY PREDICATE REPORTS A COUNT and this file aborts if one matched zero. A
 * predicate whose legitimate answer is "nothing forbidden is present" carries a
 * companion count of what it SCANNED.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

export const RULES = [
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13',
];

/** Which board is which side of the rule. A board in none of these is a design change. */
export const MUST_BE_CLEAN = new Set(['Main.dc.html']);
export const MUST_BE_FIXTURE = new Set(['Filled.dc.html']);
export const MUST_CARRY_DISTANCES = new Set(['Distances.dc.html']);

/** The design's closed mechanism set. Mirrors gen.mjs; the two are kept equal by self-test. */
export const MECHANISMS = ['no-region', 'no-capability', 'no-source', 'no-identity'];

/** The shipped badge vocabulary the boards may use, restated for the synthetic self-tests. */
export const BADGE_WORDS = ['Empty', 'Not built', 'Not read', 'Preview', 'Not connected'];

/**
 * A person-shaped cell. Two shapes, because two shapes have reached a canvas in
 * this program: an initialised name and a plain Firstname Lastname. A lens id
 * and a hyphenated fixture identifier must NOT match, and both are asserted.
 */
export const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z][a-z]+(?:-[A-Z][a-z]+)? [A-Z][a-z]+(?:-[A-Z][a-z]+)?$/;

/* ------------------------------------------------------------- extractors */

const BODY_RE = /<main data-lens-body="citizen"([^>]*)>([\s\S]*?)<\/main>/;
const REGION_RE = /<div data-region="([a-z0-9-]+)" data-state="([^"]*)" data-mechanism="([a-z-]+)"[^>]*>([\s\S]*?)<\/div><!--\/region-->/g;
const DISTANCE_RE = /<div data-distance="([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/div><!--\/distance-->/g;
const BASIS_RE = /<span data-basis[^>]*>([\s\S]*?)<\/span>/g;
const FIGURE_RE = /<span data-figure data-measured="(0|1)" data-scope="([a-z]+)"([^>]*)>([^<]*)<\/span>/g;
const BADGE_RE = /<span data-badge[^>]*>([^<]*)<\/span>/g;
const MECH_CHIP_RE = /<span data-mechanism-chip="([a-z-]+)"/g;
const CELL_RE = /<span data-cell[^>]*>([^<]*)<\/span>/g;
const FIXTURE_ROW_RE = /data-fixture-row="1"/g;
const CONTROL_RE = /data-control="([a-z-]+)"/g;
const ATTR_RE = (attrs, name) => {
  const m = attrs.match(new RegExp('data-' + name + '="([^"]*)"'));
  return m ? m[1] : null;
};

/** The scope marker. Returns the board's checked region, or null when it cannot be scoped. */
export const bodyOf = (html) => {
  const n = (html.match(/data-lens-body="citizen"/g) || []).length;
  if (n !== 1) return null;
  const m = html.match(BODY_RE);
  return m ? m[2] : null;
};
export const bodyAttrs = (html) => {
  const m = html.match(BODY_RE);
  return m ? m[1] : '';
};

/** Page text, with style and script removed so a token declaration is never read as content. */
export const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const norm = (t) => String(t).replace(/\s+/g, ' ').trim();

const regions = (body) => [...body.matchAll(REGION_RE)].map((m) => ({
  id: m[1], state: m[2], mechanism: m[3], inner: m[4],
}));
const distances = (body) => [...body.matchAll(DISTANCE_RE)].map((m) => ({ id: m[1], inner: m[2] }));
const bases = (frag) => [...frag.matchAll(BASIS_RE)].map((m) => norm(textOf(m[1])));
const badges = (body) => [...body.matchAll(BADGE_RE)].map((m) => m[1].trim());
const figures = (body) => [...body.matchAll(FIGURE_RE)].map((m) => ({
  measured: m[1] === '1',
  scope: m[2],
  count: ATTR_RE(m[3], 'count'),
  rule: ATTR_RE(m[3], 'counting-rule'),
  text: m[4].trim(),
}));
const mechChips = (body) => [...body.matchAll(MECH_CHIP_RE)].map((m) => m[1]);
const cells = (body) => [...body.matchAll(CELL_RE)].map((m) => m[1].trim());
const fixtureRows = (body) => (body.match(FIXTURE_ROW_RE) || []).length;
const controls = (body) => [...body.matchAll(CONTROL_RE)].map((m) => m[1]);

/* ------------------------------------------------------------------- io */

export function loadSource() {
  try {
    return JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
  } catch (e) {
    console.error('source-state.json is missing or unparsable (' + e.message + ').');
    console.error('It is the product state this canvas is checked against, and there is no second source');
    console.error('without it. Run: node dump-source-state.mjs --repo <smartcity-dashboards clone>');
    process.exit(2);
  }
}

export function loadBoards() {
  const files = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
  return Object.fromEntries(files.map((f) => [f, fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8')]));
}

/**
 * The boards and the snapshot must name the SAME product commit. A board set that
 * cannot say which ref it was drawn against can drift one commit at a time and
 * still pass every rule, because every rule compares it against a snapshot that
 * moved with it. Two independent files, one commit: disagreeing means the boards
 * are drawing a product state the snapshot does not describe, so the instrument
 * refuses rather than grading a comparison between two different products.
 */
export function checkCommitTie(S) {
  const rel = './canvas.json';
  if (!fs.existsSync(new URL(rel, import.meta.url))) {
    return [rel + ' is missing, so the boards and the snapshot cannot be shown to name the same product commit'];
  }
  let c;
  try {
    c = JSON.parse(fs.readFileSync(new URL(rel, import.meta.url), 'utf8'));
  } catch (e) {
    return [rel + ' is not parsable (' + e.message + ')'];
  }
  const mine = c?.snapshot?.commit;
  if (!mine) return [rel + ' names no product commit; run `node gen.mjs`, which writes it from source-state.json'];
  if (mine !== S?.snapshot?.commit) {
    return ['canvas.json was generated against ' + mine + ' and source-state.json holds ' + String(S?.snapshot?.commit) + ': regenerate the boards, or re-dump the snapshot, before this instrument grades anything'];
  }
  return [];
}

/* ------------------------------------------------- the product's premises */

/**
 * The facts the design RESTS ON. If one moves, the boards are not merely stale,
 * they are wrong, and the instrument refuses rather than reporting a verdict
 * derived from a premise that no longer holds.
 */
export function checkProductFacts(S) {
  const problems = [];
  const ok = (cond, detail) => { if (!cond) problems.push(detail); };

  ok(S?.registry?.citizenCount === 0,
    'the Citizen lens now has ' + S?.registry?.citizenCount + ' registered domains in DOMAIN_REGISTRY; this design reads as a surface with nowhere to attach a source, so it must be re-derived rather than re-checked');
  ok(typeof S?.registry?.total === 'number' && S.registry.total > 0,
    'the registry total is not a positive number; the census the boards quote is not a measurement');
  ok(S?.routes?.citizenComposerRoutes === 0,
    'the server now carries ' + S?.routes?.citizenComposerRoutes + ' composer route(s) naming citizen; the "no route composes this lens" claim on the board is false');
  ok(Array.isArray(S?.routes?.lensRouteLiterals) && S.routes.lensRouteLiterals.length > 0,
    'no lens route literals were parsed; the route count would be a zero computed from nothing');
  ok(S?.lens?.accessPolicy === 'public-free', 'the Citizen lens is no longer public-free; the no-identity distance is premised on it');
  ok(S?.lens?.skuName === null, 'the Citizen lens now carries a skuName; the "the capability is the lens, not a product" line is false');
  ok(S?.lens?.payments === false, 'the Citizen lens now reports payments true; the no-capability distance is false');
  ok(S?.roles?.citizenIsAStaffRole === false, 'citizen is now in DEPARTMENT_ROLES; a public lens is being modelled as a staff department');

  const words = S?.badgeWords ?? [];
  ok(Array.isArray(words) && words.length >= 5, 'the badge vocabulary did not come through source-state.json');
  const pills = S?.shipped?.panelQuietPills ?? [];
  const outside = pills.filter((p) => !words.includes(p));
  ok(outside.length === 1 && outside[0] === 'None on file',
    'the shipped quiet pills are ' + JSON.stringify(pills) + '; this design was written against exactly one pill outside the vocabulary, "None on file". If the product fixed it, the design must say so rather than keep claiming it');
  ok(!words.includes('None on file'),
    'the pill "None on file" is now inside the product\'s badge vocabulary; the design\'s central finding — that the shipped Citizen page prints a word nobody defined — is false, so the boards must be re-derived rather than re-checked');

  ok(Array.isArray(S?.pinned?.requiredOnPage) && S.pinned.requiredOnPage.length >= 4,
    'the strings src/ui.test.mjs pins on the shipped page did not come through source-state.json');
  ok(Array.isArray(S?.pinned?.forbiddenByTests) && S.pinned.forbiddenByTests.length >= 4,
    'the strings src/ui.test.mjs forbids did not come through source-state.json');
  ok(Array.isArray(S?.pinned?.productForbiddenStrings) && S.pinned.productForbiddenStrings.includes('CitizenConnect'),
    'CitizenConnect is no longer on the product\'s forbidden-string list; the retired-name rule would be a rule about nothing');
  ok(typeof S?.shipped?.lookupBasis === 'string' && S.shipped.lookupBasis.length > 60,
    'the shipped lookup basis did not come through source-state.json');
  ok(S?.nav?.navBadge === 'Preview', 'the Citizen nav badge is no longer Preview; the badge tie on the boards would compare against nothing');
  ok(Array.isArray(S?.shipped?.panelTitles) && S.shipped.panelTitles.length === 4,
    'the shipped Citizen section no longer carries four panel heads');
  ok(Array.isArray(S?.shipped?.disabledControls) && S.shipped.disabledControls.length === 2,
    'the shipped Citizen section no longer disables exactly two controls; the exemplar the design copies has moved');
  ok(typeof S?.states?.probeId === 'string' && S.states.probeId.length > 0,
    'the unregistered probe id did not come through source-state.json; the check refuses it by name');

  return problems;
}

/* ----------------------------------------------------------- the verdict */

export function checkBoards(boards, S) {
  const findings = [];
  const bad = (rule, board, detail) => findings.push({ rule, board, detail });

  const words = new Set(S?.badgeWords ?? BADGE_WORDS);
  const requiredOnPage = S?.pinned?.requiredOnPage ?? [];
  const forbiddenByTests = S?.pinned?.forbiddenByTests ?? [];
  const forbiddenProduct = S?.pinned?.productForbiddenStrings ?? [];
  const probeId = S?.states?.probeId ?? 'probe-unregistered-surface';
  const mustCarry = {
    lookupBasis: S?.shipped?.lookupBasis,
    requestsCopy: S?.shipped?.requestsCopy,
    paymentsCopy: S?.shipped?.paymentsCopy,
    paymentsBasis: S?.shipped?.paymentsBasis,
    meetingsCopy: S?.shipped?.meetingsCopy,
  };
  const navBadge = S?.nav?.navBadge;

  const totals = {
    bodies: 0, regions: 0, distances: 0, bases: 0, badges: 0, mechanismChips: 0,
    cells: 0, figures: 0, measuredFigures: 0, unmeasuredFigures: 0, measuredZeros: 0,
    fixtureRows: 0, controls: 0, verbatimSentences: 0,
  };

  for (const [file, html] of Object.entries(boards)) {
    const body = bodyOf(html);

    // R1 — scope.
    if (!body) {
      bad('R1', file, 'no single data-lens-body="citizen" marker: this board cannot be scoped, so it is not checked and no verdict is reported for it');
      continue;
    }
    totals.bodies += 1;

    const isFixture = ATTR_RE(bodyAttrs(html), 'fixture') === '1';
    const rg = regions(body);
    const ds = distances(body);
    const bs = bases(body);
    const bd = badges(body);
    const mc = mechChips(body);
    const cl = cells(body);
    const fg = figures(body);
    const fr = fixtureRows(body);
    const ct = controls(body);

    totals.regions += rg.length;
    totals.distances += ds.length;
    totals.bases += bs.length;
    totals.badges += bd.length;
    totals.mechanismChips += mc.length;
    totals.cells += cl.length;
    totals.figures += fg.length;
    totals.fixtureRows += fr;
    totals.controls += ct.length;
    totals.measuredFigures += fg.filter((f) => f.measured).length;
    totals.unmeasuredFigures += fg.filter((f) => !f.measured).length;
    totals.measuredZeros += fg.filter((f) => f.measured && f.count === '0').length;

    // A board whose predicates had nothing to read is not checked, it is unread.
    // R13 is separate from the rule it would have disabled, because "this board
    // gave that rule no input" and "this board broke that rule" are different
    // statements and filing one as the other is how a hole hides in a pass.
    if (rg.length === 0 && ds.length === 0) {
      bad('R1', file, 'the scoped body carries no data-region and no data-distance block: there is nothing on this board for the instrument to read');
      continue;
    }
    if (bs.length === 0) bad('R13', file, 'no data-basis on the board: R4 (a basis under every state) had nothing to read');
    if (fg.length === 0) bad('R13', file, 'no data-figure on the board: R5 (the measured/unmeasured boundary) had nothing to read');
    if (cl.length === 0) bad('R13', file, 'no data-cell on the board: R8 (the name scan) had nothing to scan');

    // R2 — the state vocabulary, and the nav badge tie.
    for (const r of rg) {
      if (!words.has(r.state)) {
        bad('R2', file, 'region ' + r.id + ' prints state "' + r.state + '", which is outside the product\'s badge vocabulary (' + [...words].join(' / ') + ')');
      }
    }
    for (const b of bd) {
      if (!words.has(b)) bad('R2', file, 'badge "' + b + '" is outside the product\'s badge vocabulary');
    }
    if (navBadge) {
      // The nav is chrome, OUTSIDE the scoped body, so this one read is
      // document-wide by design: it compares a shipped chrome value, not page copy.
      const navRow = body === null ? null : html.match(/data-lens="citizen"[\s\S]{0,600}?data-badge[^>]*>([^<]*)</);
      if (!navRow) bad('R12', file, 'the board carries no Citizen nav row with a badge, so the shipped badge tie cannot be read');
      else if (navRow[1].trim() !== navBadge) {
        bad('R12', file, 'the Citizen nav badge reads "' + navRow[1].trim() + '" and the product ships "' + navBadge + '" at this ref');
      }
    }

    // R3 — the mechanism set, and the distances kept apart.
    for (const r of rg) {
      if (!MECHANISMS.includes(r.mechanism)) bad('R3', file, 'region ' + r.id + ' carries mechanism "' + r.mechanism + '", which is outside the closed set ' + MECHANISMS.join(' / '));
      if (r.state === r.mechanism) bad('R3', file, 'region ' + r.id + ' uses its mechanism word as its state word');
    }
    for (const id of mc) {
      if (!MECHANISMS.includes(id)) bad('R3', file, 'mechanism chip "' + id + '" is outside the closed set');
    }
    for (const [i, r] of rg.entries()) {
      for (const other of rg.slice(i + 1)) {
        if (r.mechanism === other.mechanism) {
          bad('R3', file, 'regions ' + r.id + ' and ' + other.id + ' are collapsed onto one distance ("' + r.mechanism + '"); the design exists to keep these apart');
        }
      }
    }
    if (MUST_BE_CLEAN.has(file)) {
      const got = rg.map((r) => r.mechanism).sort();
      const want = [...MECHANISMS].sort();
      if (JSON.stringify(got) !== JSON.stringify(want)) {
        bad('R3', file, 'the un-fed board must carry all four distances exactly once; it carries ' + JSON.stringify(got));
      }
    }

    // R4 — a basis under every state.
    for (const r of rg) {
      const inner = bases(r.inner);
      if (inner.length === 0) bad('R4', file, 'region ' + r.id + ' prints a state word with no basis under it');
      else if (inner.some((t) => t.length < 40)) bad('R4', file, 'region ' + r.id + ' carries a basis shorter than 40 characters, which is a label rather than a basis');
    }
    for (const d of ds) {
      const inner = bases(d.inner);
      if (inner.length === 0) bad('R4', file, 'distance card ' + d.id + ' carries no basis');
      else if (inner.some((t) => t.length < 40)) bad('R4', file, 'distance card ' + d.id + ' carries a basis shorter than 40 characters');
    }

    // R5 — the measured/unmeasured boundary. This is the rule the lens is for.
    for (const f of fg) {
      if (f.measured) {
        if (!/^\d+$/.test(f.count ?? '')) bad('R5', file, 'a measured figure carries no numeric data-count (got ' + JSON.stringify(f.count) + '); a measurement without a number is not a measurement');
        if (!f.rule || f.rule.trim().length < 20) bad('R5', file, 'a measured figure (count ' + JSON.stringify(f.count) + ') carries no counting rule; a number without its rule is the defect class this program hunts');
        if (f.scope !== 'region' && f.scope !== 'product') bad('R5', file, 'figure scope "' + f.scope + '" is outside {region, product}');
      } else {
        if (f.count !== null) bad('R5', file, 'an UNMEASURED figure carries data-count="' + f.count + '": an unread region must not carry a number, not even zero');
        if (!words.has(f.text)) bad('R5', file, 'an unmeasured figure reads "' + f.text + '", which is not a word from the product\'s vocabulary; "Not read" is the shipped word and it must not be replaced with a number');
      }
    }

    // R6 — the twelve-tile grid, refused by name. The marker is the attribute
    // itself: `data-figure-lead` (a large figure) is not a tile and is allowed.
    if (/\sdata-tile="/.test(body)) bad('R6', file, 'the board carries a data-tile: the twelve-tile grid was dropped once already (src/shell-homes.mjs:146) and a tile on this lens would read a number nobody measured');
    if (/class="metrics"/.test(body)) bad('R6', file, 'the board carries a metric strip (class="metrics"); the Citizen lens has no measurement to put in one and the product\'s own suite enumerates those strips lens by lens');

    // R7 — the shipped sentences, verbatim.
    /**
     * The pins belong to the board that RENDERS the shipped surface. The
     * distances board is a map of distances, not a rendering, and requiring it to
     * carry the lookup sentence would be requiring copy it does not display. The
     * fixture board renders two shipped panels unchanged, so it must carry those
     * two sentences and is not asked for the two its fixture states replace.
     */
    const text = textOf(body);
    if (MUST_BE_CLEAN.has(file)) {
      for (const s of requiredOnPage) {
        if (!text.includes(norm(s))) bad('R7', file, 'the pinned shipped string is missing verbatim: ' + JSON.stringify(s) + ' (src/ui.test.mjs requires it on this surface)');
        else totals.verbatimSentences += 1;
      }
      for (const [k, v] of Object.entries(mustCarry)) {
        if (typeof v !== 'string') continue;
        if (!text.includes(norm(v))) bad('R7', file, 'the shipped ' + k + ' is not carried verbatim; the design may not soften what the product already says: ' + JSON.stringify(norm(v).slice(0, 70)));
        else totals.verbatimSentences += 1;
      }
      if (!text.includes('Nothing here requires an account.')) {
        bad('R7', file, 'the shipped lede sentence "Nothing here requires an account." is missing; a public lens that stops saying so is the regression this design must not make');
      } else totals.verbatimSentences += 1;
    }
    if (MUST_BE_FIXTURE.has(file)) {
      for (const k of ['requestsCopy', 'paymentsCopy']) {
        const v = S?.shipped?.[k];
        if (typeof v !== 'string') continue;
        if (!text.includes(norm(v))) bad('R7', file, 'the fixture board renders the shipped ' + k + ' panel and does not carry its sentence verbatim: ' + JSON.stringify(norm(v).slice(0, 60)));
        else totals.verbatimSentences += 1;
      }
    }

    // R8 — forbidden strings, names and money.
    /**
     * A forbidden WORD is forbidden as a word; a forbidden TOKEN containing a
     * symbol or hyphen is forbidden as a substring. Without this distinction
     * "Compose" would fire on the word "composes" and the rule would be noise
     * that gets disabled rather than fixed. Both directions are self-tested.
     */
    const forbiddenHit = (t, s) => {
      const q = String(s).toLowerCase();
      if (/^[a-z][a-z ]*$/.test(q)) return new RegExp('\\b' + q.replace(/ /g, '\\s+') + '\\b').test(t);
      return t.includes(q);
    };
    const lower = text.toLowerCase();
    for (const s of [...forbiddenProduct, ...forbiddenByTests]) {
      if (forbiddenHit(lower, s)) {
        bad('R8', file, 'the board carries "' + s + '", which the product\'s own source or test suite forbids');
      }
    }
    if (lower.includes(probeId.toLowerCase())) {
      bad('R8', file, 'the board renders the unregistered probe id "' + probeId + '"; that id exists so the fifth state can be measured, and rendering it puts words in the product\'s mouth about a surface it does not have');
    }
    const named = cl.filter((c) => PERSON.test(c));
    if (named.length) bad('R8', file, 'cells name people: ' + [...new Set(named)].join(', '));
    const money = text.match(/\$\s?\d/g) || [];
    if (money.length) bad('R8', file, money.length + ' money figure(s) on a lens that carries no money: ' + JSON.stringify(money.join(' ')));

    // R9 — fixture badged as fixture, both directions.
    /**
     * The badge lives in the top bar, which is chrome OUTSIDE the scoped body, so
     * this is a document-wide read by design: a badge is exactly the kind of thing
     * that belongs in chrome. The "not a city record" sentence stays body-scoped,
     * because it is the rows that have to say it.
     */
    const docBadge = /data-fixture-badge/.test(html);
    const docText = textOf(html);
    if (isFixture || MUST_BE_FIXTURE.has(file)) {
      if (fr === 0) bad('R9', file, 'classified as a fixture board but carries no data-fixture-row: the fixture half of the rule had nothing to check');
      if (!docBadge) bad('R9', file, 'a fixture board with no DEMO FIXTURE marker anywhere in the document; an unbadged fixture is the defect this rule exists for');
      if (!docText.includes('DEMO FIXTURE')) bad('R9', file, 'a fixture board that does not carry the words DEMO FIXTURE in its text');
      if (!/not a city record|not city records/i.test(text)) bad('R9', file, 'a fixture board whose scoped body never says its rows are not city records');
    } else {
      if (isFixture) bad('R9', file, 'the board marks itself data-fixture="1" but is not classified as a fixture board');
      if (docBadge) bad('R9', file, 'a board that is not a fixture carries a DEMO FIXTURE marker; the two directions must not be satisfiable by one sentinel');
      if (fr > 0) bad('R9', file, 'the board carries fixture rows without marking itself a fixture');
    }

    // R10 — the classification. A board in none of the sets is a design change nobody ruled on.
    if (!MUST_BE_CLEAN.has(file) && !MUST_BE_FIXTURE.has(file) && !MUST_CARRY_DISTANCES.has(file)) {
      bad('R10', file, 'this board is in none of MUST_BE_CLEAN, MUST_BE_FIXTURE or MUST_CARRY_DISTANCES, so the rule that makes this folder worth having was never applied to it. Classify it or delete it.');
    }
    if (MUST_CARRY_DISTANCES.has(file)) {
      const ids = ds.map((d) => d.id);
      const want = MECHANISMS.slice(0, 4);
      for (const w of want) {
        if (!ids.includes(w)) bad('R10', file, 'the distances board is missing the "' + w + '" card');
      }
      if (ds.length !== 5) bad('R10', file, 'the distances board carries ' + ds.length + ' cards; the design draws five (four distances plus the measured zero) and a sixth would need a ruling');
      if (!ids.includes('measured-zero')) bad('R10', file, 'the distances board does not carry the measured-zero card, which is the card the two-sided rule rests on');
    }

    // R11 — the two-sided rule. Neither half can be satisfied by a sentinel.
    const regionMeasured = fg.filter((f) => f.measured && f.scope === 'region');
    if (MUST_BE_CLEAN.has(file)) {
      if (regionMeasured.length) {
        bad('R11', file, 'the un-fed lens carries ' + regionMeasured.length + ' REGION-scoped measurement(s); no region on this lens has a source, so any region figure here is invented. Product-scoped facts are the only measurements this board may carry.');
      }
      if (fg.filter((f) => !f.measured).length === 0) bad('R11', file, 'the un-fed lens carries no unmeasured figure, so the "this region cannot report" half of the design is not drawn');
    }
    if (MUST_BE_FIXTURE.has(file)) {
      if (regionMeasured.length === 0) bad('R11', file, 'the fixture board carries no region-scoped measurement, so the measured half of the rule is only ever tested on the board that has none');
      if (!regionMeasured.some((f) => f.count === '0')) bad('R11', file, 'the fixture board carries no measured ZERO; without one, "zero" and "not read" are indistinguishable on the only board that could tell them apart');
      if (fg.filter((f) => !f.measured).length === 0) bad('R11', file, 'the fixture board carries no unmeasured figure; a fixture that can fill every region is flattering the design and contradicts the two regions no fixture can fill');
    }
  }

  return { findings, counts: totals };
}

/* ------------------------------------------------------------- self-tests */

/**
 * Both directions, on synthetic markup built from the SAME shapes the boards
 * use. A check observed only passing has not been observed working.
 */
export function selfTests(S) {
  const t = [];
  const add = (name, passed) => t.push([name, passed]);

  const board = (inner, attrs = '') => '<html><body><nav><span>Not read</span><span data-badge>Not built</span></nav>' +
    '<main data-lens-body="citizen"' + attrs + '>' + inner + '</main></body></html>';
  const region = (o) => '<div data-region="' + o.id + '" data-state="' + o.state + '" data-mechanism="' + o.mechanism + '">' +
    '<span data-basis>' + o.basis + '</span></div><!--/region-->';
  const distance = (id, basis) => '<div data-distance="' + id + '"><span data-basis>' + basis + '</span></div><!--/distance-->';
  const cellSpan = (x) => '<span data-cell>' + x + '</span>';
  const figM = (count, rule, scope = 'region') => '<span data-figure data-measured="1" data-scope="' + scope + '" data-count="' + count + '" data-counting-rule="' + rule + '">' + count + '</span>';
  const figU = () => '<span data-figure data-measured="0" data-scope="region">Not read</span>';
  const LONG = 'Basis: a sentence long enough to be a basis rather than a label, naming where it was read.';
  const withNav = (inner) => '<span data-lens="citizen"></span><span data-badge>Preview</span>' + inner;

  const fourDistances = MECHANISMS.map((m, i) => region({ id: 'r' + i, state: 'Not built', mechanism: m, basis: LONG })).join('');
  const cleanMain = board(withNav(fourDistances + figU()));
  const collapsed = board(withNav(MECHANISMS.map((m) => region({ id: 'x', state: 'Not built', mechanism: m, basis: LONG })).slice(0, 3)
    .concat(region({ id: 'dup', state: 'Not built', mechanism: MECHANISMS[0], basis: LONG })).join('') + figU()));
  /** The un-fed board with every sentence the product already ships, verbatim. */
  const shippedText = [
    ...(S.pinned.requiredOnPage ?? []),
    S.shipped.lookupBasis, S.shipped.requestsCopy, S.shipped.paymentsCopy,
    S.shipped.paymentsBasis, S.shipped.meetingsCopy,
    'Nothing here requires an account.',
  ].join(' ');
  const richMain = board(withNav(fourDistances + figU() + '<p>' + shippedText + '</p>'));
  const fixtureFilled = board(withNav(
    '<span data-fixture-badge>DEMO FIXTURE</span><p>Every row is generated, not a city record.</p>' +
    region({ id: 'a', state: 'Preview', mechanism: 'no-region', basis: LONG }) + figM('1', 'one increment per resolved address in the fixture set') +
    region({ id: 'b', state: 'Preview', mechanism: 'no-identity', basis: LONG }) + figM('0', 'one increment per record written; zero is a reading that was taken') +
    figU() + '<p>' + S.shipped.requestsCopy + ' ' + S.shipped.paymentsCopy + '</p>' +
    '<div data-fixture-row="1"></div>'
  ), ' data-fixture="1"');
  const badgedFilled = fixtureFilled;

  const fires = (rule, boardName, html) => checkBoards({ [boardName]: html }, S).findings.some((f) => f.rule === rule);

  // scope
  add('scope: the body is found by its marker', bodyOf(cleanMain) !== null);
  add('scope: a document without the marker yields null, never the whole page', bodyOf('<main>x</main>') === null);
  add('scope: TWO markers also yield null, because the board is ambiguous', bodyOf(board('') + board('')) === null);
  add('scope: the nav outside the body is EXCLUDED', regions(bodyOf(cleanMain)).length === 4 && (cleanMain.match(/Not read<\/span>/) !== null));
  add('scope: a board with no marker REFUSES as R1 rather than passing', fires('R1', 'Main.dc.html', '<main>x</main>'));

  // states
  add('states: accepts the shipped vocabulary', fires('R2', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);
  add('states: REFUSES a word outside it, which is the shipped page\'s own defect', fires('R2', 'Main.dc.html', board(region({ id: 'a', state: 'None on file', mechanism: 'no-source', basis: LONG }) + figU())));
  add('states: the shipped side of that comparison really does violate it', (S.shipped.panelQuietPills.filter((p) => !S.badgeWords.includes(p))).length === 1);
  add('states: the vocabulary came through and is non-empty', Array.isArray(S.badgeWords) && S.badgeWords.length >= 5);
  add('states: a badge outside the vocabulary is refused too', fires('R2', 'Main.dc.html', board('<span data-badge>Coming soon</span>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('nav: the shipped badge tie fires when the board disagrees', (() => {
    const html = board('<span data-lens="citizen"></span><span data-badge>Not built</span>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU());
    const r = checkBoards({ 'Main.dc.html': html }, S);
    return r.findings.some((f) => f.rule === 'R12');
  })());

  // mechanism
  add('mechanism: accepts a closed id', fires('R3', 'Main.dc.html', cleanMain) === false);
  add('mechanism: REFUSES an invented distance', fires('R3', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-thing', basis: LONG }) + figU())));
  add('mechanism: REFUSES a collapse of two regions onto one distance', fires('R3', 'Main.dc.html', collapsed));
  add('mechanism: the four-distance rule fires when a distance is missing', fires('R3', 'Main.dc.html', board(MECHANISMS.slice(0, 3).map((m, i) => region({ id: 'r' + i, state: 'Not built', mechanism: m, basis: LONG })).join('') + figU())));
  add('mechanism: the closed set and the boards agree on its size', MECHANISMS.length === 4);

  // basis
  add('basis: accepts a real basis', fires('R4', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);
  add('basis: REFUSES a region with no basis at all', fires('R4', 'Main.dc.html', board('<div data-region="a" data-state="Not built" data-mechanism="no-source"></div><!--/region-->' + figU())));
  add('basis: REFUSES a label masquerading as a basis', fires('R4', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: 'not read' }) + figU())));
  add('basis: the extractor is not vacuous', bases(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG })).length === 1);

  // figure
  add('figure: accepts a measured figure with its rule', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figM('0', 'one increment per entry in the registry array'))) === false);
  add('figure: REFUSES a measurement with no counting rule', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figM('0', ''))));
  add('figure: REFUSES a measurement with no number', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + '<span data-figure data-measured="1" data-scope="region">some</span>')));
  add('figure: REFUSES an unmeasured figure carrying a count', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + '<span data-figure data-measured="0" data-scope="region" data-count="0">Not read</span>')));
  add('figure: REFUSES an unmeasured figure reading a number', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + '<span data-figure data-measured="0" data-scope="region">0</span>')));
  add('figure: accepts the shipped word for an unmeasured region', fires('R5', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);
  add('figure: measures are counted, not inferred', figures(figM('3', 'rule long enough to pass the length gate') + figU()).length === 2);

  // tile
  add('tile: accepts a board with no tile', fires('R6', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);
  add('tile: REFUSES a data-tile, the dropped twelve-tile grid', fires('R6', 'Main.dc.html', board('<div data-tile="1"></div>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('tile: REFUSES a metric strip', fires('R6', 'Main.dc.html', board('<div class="metrics"></div>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('tile: ALLOWS a lead-sized figure, which is not a tile', fires('R6', 'Main.dc.html', board('<span data-figure-lead="1"></span>' + cellSpan('x') + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);

  // verbatim
  add('verbatim: accepts a board carrying the shipped lookup basis', fires('R7', 'Main.dc.html', richMain) === false);
  add('verbatim: REFUSES a paraphrase of it', fires('R7', 'Main.dc.html', board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + '<p>Lookup returns nothing yet.</p>' + figU())));

  // forbidden
  add('forbidden: REFUSES the retired product name', fires('R8', 'Main.dc.html', board('<p>CitizenConnect</p>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('forbidden: REFUSES a money figure', fires('R8', 'Main.dc.html', board('<p>Total $0</p>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('forbidden: REFUSES a person in a cell', fires('R8', 'Main.dc.html', board(cellSpan('S. Carrillo') + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('forbidden: ALLOWS a fixture identifier shaped like an id', PERSON.test('FIX-ADDR-0001') === false && PERSON.test('no region, no vendor') === false);
  add('forbidden: ALLOWS a lens id', PERSON.test('fire-ems') === false);
  add('forbidden: REFUSES the unregistered probe id', fires('R8', 'Main.dc.html', board('<p>' + S.states.probeId + '</p>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('forbidden: the style block is not read as content', textOf('<style>--sc-accent:#AF2A22;</style><p>ok</p>').includes('accent') === false);
  add('forbidden: a forbidden WORD refuses the word itself', fires('R8', 'Main.dc.html', board(cellSpan('Compose') + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('forbidden: and ALLOWS a longer word it is a prefix of', fires('R8', 'Main.dc.html', board(cellSpan('Route literals naming this lens') + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())) === false);
  add('forbidden: a forbidden TOKEN is refused as a substring', fires('R8', 'Main.dc.html', board(cellSpan('the compose-form is gone') + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));
  add('vacuity: a board with no cell reports R13, NOT a violated R8', (() => {
    const html = board(region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU());
    const f = checkBoards({ 'Main.dc.html': html }, S).findings.map((x) => x.rule);
    return f.includes('R13') && !f.includes('R8');
  })());

  // fixture, both directions
  add('fixture: accepts a badged fixture board carrying fixture rows', fires('R9', 'Filled.dc.html', fixtureFilled) === false);
  add('fixture: REFUSES fixture rows without the badge', fires('R9', 'Filled.dc.html', board(withNav(region({ id: 'a', state: 'Empty', mechanism: 'no-source', basis: LONG }) + figM('1', 'one increment per resolved address in the fixture set') + '<div data-fixture-row="1"></div>'), ' data-fixture="1"')));
  add('fixture: REFUSES a fixture board with no fixture rows', fires('R9', 'Filled.dc.html', board(withNav(region({ id: 'a', state: 'Empty', mechanism: 'no-source', basis: LONG }) + figM('1', 'one increment per resolved address in the fixture set')), ' data-fixture="1" data-fixture-badge="1"')));
  add('fixture: REFUSES the badge on a board that is not a fixture', fires('R9', 'Main.dc.html', board('<span data-fixture-badge></span>' + region({ id: 'a', state: 'Not built', mechanism: 'no-source', basis: LONG }) + figU())));

  // two-sided
  add('two-sided: accepts the un-fed board with no region measurement', fires('R11', 'Main.dc.html', cleanMain) === false);
  add('two-sided: REFUSES a region measurement on the un-fed board', fires('R11', 'Main.dc.html', board(MECHANISMS.map((m, i) => region({ id: 'r' + i, state: 'Not built', mechanism: m, basis: LONG })).join('') + figM('1', 'a rule long enough to pass the length gate'))));
  add('two-sided: accepts the fixture board carrying a measured zero beside an unread region', fires('R11', 'Filled.dc.html', badgedFilled) === false);
  add('two-sided: REFUSES a fixture board with no measurement at all', fires('R11', 'Filled.dc.html', board(withNav(region({ id: 'a', state: 'Empty', mechanism: 'no-source', basis: LONG }) + figU() + '<div data-fixture-row="1"></div>', ), ' data-fixture="1" data-fixture-badge="1"')));
  add('two-sided: REFUSES a fixture board with no measured zero', fires('R11', 'Filled.dc.html', board(withNav(region({ id: 'a', state: 'Empty', mechanism: 'no-source', basis: LONG }) + figM('1', 'a rule long enough to pass the length gate') + figU() + '<div data-fixture-row="1"></div>'), ' data-fixture="1" data-fixture-badge="1"')));

  // classification
  add('classification: REFUSES a board in none of the three sets', fires('R10', 'Extra.dc.html', cleanMain));

  return t;
}

/* ------------------------------------------------------------------- main */

export function isDirectRun(argv1, importMetaUrl) {
  if (!argv1 || !importMetaUrl) return false;
  return new URL('file://' + String(argv1).replace(/\\/g, '/').replace(/^\//, '/')).href === importMetaUrl
    || String(argv1).replace(/\\/g, '/').endsWith(new URL(importMetaUrl).pathname.replace(/^\//, ''));
}

function main() {
  const S = loadSource();

  const st = selfTests(S);
  const failed = st.filter(([, ok]) => !ok);
  for (const [name, ok] of st) if (!ok) console.error('SELF-TEST FAILED: ' + name);
  if (failed.length) {
    console.error('\n' + failed.length + ' of ' + st.length + ' self-test(s) failed. The instrument is broken, so its');
    console.error('verdict on the artboards would be worthless and it does not report one.');
    process.exit(2);
  }
  console.log('self-tests: ' + st.length + '/' + st.length + ' passed, both directions');

  const premise = checkProductFacts(S);
  if (premise.length) {
    console.error('\nREFUSING A VERDICT. The product facts this design rests on have moved:');
    for (const p of premise) console.error('  - ' + p);
    console.error('\nThe boards are not stale, they are wrong. Re-dump and re-derive.');
    process.exit(2);
  }
  console.log('premise: ' + S.registry.citizenCount + ' of ' + S.registry.total + ' registered domains on citizen, ' +
    S.routes.citizenComposerRoutes + ' routes naming it, pill outside the vocabulary: ' + JSON.stringify(S.shipped.panelQuietPills.filter((p) => !S.badgeWords.includes(p))));

  const boards = loadBoards();
  if (Object.keys(boards).length === 0) {
    console.error('no artboards found. Run `node gen.mjs` first.');
    process.exit(2);
  }

  const tie = checkCommitTie(S);
  if (tie.length) {
    console.error('\nREFUSING A VERDICT. The boards and the snapshot do not name the same product commit:');
    for (const p of tie) console.error('  - ' + p);
    process.exit(2);
  }
  console.log('commit tie: boards and snapshot both name ' + String(S.snapshot.commit).slice(0, 8) + ' (' + S.snapshot.ref + ')');

  const { findings, counts } = checkBoards(boards, S);

  if (findings.length) {
    const byRule = {};
    for (const f of findings) (byRule[f.rule] ||= []).push(f);
    for (const rule of RULES) {
      if (!byRule[rule]) continue;
      console.error('FAIL ' + rule + ' (' + byRule[rule].length + ')');
      for (const f of byRule[rule]) console.error('     ' + f.board + ': ' + f.detail);
    }
  } else {
    for (const [file, html] of Object.entries(boards)) {
      const body = bodyOf(html);
      const rg = regions(body), ds = distances(body), fg = figures(body), cl = cells(body);
      console.log('ok   ' + file.padEnd(18) + rg.length + ' regions, ' + ds.length + ' distances, ' + cl.length +
        ' cells, ' + fg.length + ' figures (' + fg.filter((f) => f.measured).length + ' measured, ' +
        fg.filter((f) => f.measured && f.count === '0').length + ' measured zeros), ' + bases(body).length + ' bases');
    }
  }

  console.log('\nmatched inputs: ' + Object.entries(counts).map(([k, v]) => k + '=' + v).join(', '));

  /**
   * The rule is only meaningful if every side of it had inputs. A folder with no
   * fixture board, or a fixture board with no measured zero, would otherwise pass
   * on the boards that happened to exercise one half.
   */
  const vacuous = Object.entries(counts).filter(([, v]) => v === 0).map(([k]) => k);
  if (vacuous.length) {
    console.error('\nREFUSING A VERDICT: these predicates matched nothing: ' + vacuous.join(', ') +
      '. A check with no inputs is worse than no check, and every one of these is a side of a two-sided rule.');
    process.exit(2);
  }

  if (findings.length) {
    console.error('\n' + findings.length + ' finding(s).');
    process.exit(1);
  }
  console.log(Object.keys(boards).length + ' artboards pass, ' + RULES.length + ' rules, every one with a non-zero matched-input count.');
  process.exit(0);
}

if (process.argv[1] && /check\.mjs$/.test(process.argv[1]) && !process.argv.includes('--no-main')) main();
