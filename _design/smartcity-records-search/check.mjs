/**
 * Adversarial read, as a file rather than a habit.
 *
 *   node dump-source-state.mjs && node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report
 * a verdict, which is not the same as a pass and never renders as one.
 *
 * THE CHECK THIS FOLDER EXISTS FOR. Records search owns no records. It reads
 * eleven registered regions and one corpus, and it can read neither completely:
 * one region has its gating adapter withheld on the pack this is drawn on, and
 * the corpus is scope-bound, partly unsearchable, and partly refused. So the
 * failure mode is not an ugly page. It is a page that prints "2 results" and
 * means "2 results in the ten regions we asked and the twenty-five documents we
 * could search", without saying so — a numerator with no denominator, on the one
 * surface where a city is most likely to believe it.
 *
 * Three sentences must stay apart, and every one of them is a rule below:
 *
 *   "no matches"        a search that ran and found nothing
 *   "not asked"         a region whose vendor is not granted on this pack
 *   "not permitted"     a scope the reader does not hold — read_outside_scope
 *   "not searchable"    a document with no text layer, or an extractor that threw
 *
 * THE SCOPE IS STRUCTURAL. Every read is scoped to the content inside
 * data-lens-body="records", so the nav's own shipped "Not built" badge on this
 * very nav item neither satisfies nor violates a rule about the page behind it.
 * A whole-document scan would pass on the wrong evidence.
 *
 * EVERY VOCABULARY IS READ OUT OF source-state.json, which is dumped from the
 * product at a named ref. Nothing here is a list this file typed out, so a
 * product rename fails the check rather than being silently absorbed.
 *
 * EVERY PREDICATE REPORTS A COUNT, and this file REFUSES a verdict if one of
 * them matched nothing. A predicate whose legitimate answer is "nothing
 * forbidden is present" carries a companion count of what it SCANNED.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-state.json is missing or unparsable. It is the product state this file checks');
  console.error('the boards against, and there is no second source without it. Run `node dump-source-state.mjs`.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

const LEG_IDS = S.legs.map((l) => l.id);
const REGION_IDS = S.domains.registry.map((d) => d.domainId);
const KIND_IDS = S.domains.adapterKindIds;
const SCOPE_TYPES = S.documents.scopeTypes;
const STATES = S.documents.searchIndexStates;
const REASONS = S.documents.notIndexedReasons;
const COVERAGE_KEYS = S.documents.coverageReasonKeys;
const OUTCOMES = S.derived.outcomeVocabulary;
const REFUSAL_CODE = S.documents.readRefusalCode;
const BADGE_WORDS = [...new Set([...S.register.DISPOSITIONS, 'Not read', 'Preview'])];
const COVERAGE_RULE = S.documents.coverageCountingRule;
const STUB = S.stub;

/**
 * The words this design may not say about its own page. "Not built" has exactly
 * one surviving meaning in this product — absent from DOMAIN_REGISTRY — and it
 * belongs to the surface that is absent. Records search is absent from the
 * registry for the opposite reason (it generates no records, so it has nothing
 * to register), so the phrase may appear on these boards ONLY where a shipped
 * value is being quoted. Not in this design's own voice.
 */
const QUOTED_ONLY = 'Not built';

/** A scope this design's own acceptance items are, tracked so a plant can fail them. */
const ACCEPTANCE_IDS = ['parcels-not-a-leg', 'corpus-is-a-mount', 'scope-resolution'];

const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/* ------------------------------------------------------------- extractors */

const BODY_RE = /data-lens-body="records"[\s\S]*?<\/main>/;
const DOC_COV_RE = /<div data-coverage data-coverage-leg="documents"([^>]*)>/g;
const CASES_COV_RE = /<div data-coverage data-coverage-leg="cases"([^>]*)>/g;
const DEFECT_RE = /<section[^>]*data-defect="silent-coverage"[\s\S]*?<\/section>/;
/**
 * A badge is read by its own attribute, never by guessing which span is a state
 * chip and which is a value. Both halves are returned so the check can require
 * that a badge declaring one word and printing another is refused.
 */
const BADGE_RE = /data-badge="([^"]*)"[^>]*>([^<]*)<\/span>/g;
const badgePairs = (body) => [...body.matchAll(BADGE_RE)].map((m) => [m[1], m[2]]);
const badges = (body) => badgePairs(body).map(([, rendered]) => rendered);
const CELL_RE = /min-width:0; font:400 13px\/18px var\(--sc-font-(?:ui|data)\); color:var\(--sc-ink(?:-2|-3)?\);">([^<]*)<\/span>/g;

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

const attrVals = (body, name) => [...body.matchAll(new RegExp(`data-${name}="([^"]*)"`, 'g'))].map((m) => m[1]);
const resultRows = (body) => body.split(/<div /).slice(1).filter((c) => /^data-result="true"/.test(c));
const coverageBlocks = (body) => {
  const cases = [...body.matchAll(CASES_COV_RE)].map((m) => ({ leg: 'cases', attrs: m[1] }));
  const docs = [...body.matchAll(DOC_COV_RE)].map((m) => ({ leg: 'documents', attrs: m[1] }));
  return [...cases, ...docs];
};
const defectOf = (html) => (html.match(DEFECT_RE) || [null])[0];
const cells = (body) => [...body.matchAll(CELL_RE)].map((m) => m[1].trim());
const people = (body) => cells(body).filter((c) => PERSON.test(c));

/** Everything a board says in its own voice, with the quoted shipped values removed. */
const unquoted = (body) => body
  .replace(/<nav data-nav="shipped"[\s\S]*?<\/nav>/g, ' ')
  .replace(/<section[^>]*data-stub="today"[\s\S]*?<\/section>/g, ' ')
  .replace(/<section[^>]*data-register="shell-homes"[\s\S]*?<\/section>/g, ' ');

const countOf = (text, needle) => text.split(needle).length - 1;
/**
 * How many occurrences of the quoted word the strip ACCOUNTED FOR. This is the
 * companion count the quoting rule needs: without it, a board that simply never
 * says the word would satisfy the rule while proving nothing about the strip.
 */
const strippedCount = (body) => countOf(body, QUOTED_ONLY) - countOf(unquoted(body), QUOTED_ONLY);

const num = (attrs, name) => {
  const m = attrs.match(new RegExp(`data-${name}="(-?\\d+)"`));
  return m ? Number(m[1]) : null;
};

/**
 * The coverage arithmetic, on the attributes rather than on the rendered text.
 * Two independent numbers: searched is stated and the reasons are stated, and
 * they have to agree with in-scope. A panel whose numbers do not reconcile reads
 * as precision, which is worse than reading as a shape.
 */
function coverageReconciles(attrs) {
  const inScope = num(attrs, 'in-scope');
  const searched = num(attrs, 'searched');
  const notSearched = num(attrs, 'not-searched');
  if (inScope === null || searched === null || notSearched === null) return { ok: false, why: 'a count is missing' };
  const perReason = COVERAGE_KEYS.map((k) => num(attrs, `reason-${k}`));
  if (perReason.some((v) => v === null)) {
    return { ok: false, why: 'a reason key is missing; a coverage panel cannot omit a reason and still be read' };
  }
  const sum = perReason.reduce((a, b) => a + b, 0);
  if (searched + sum !== inScope) {
    return { ok: false, why: `searched ${searched} + reasons ${sum} = ${searched + sum}, in scope ${inScope}` };
  }
  if (notSearched !== inScope - searched) {
    return { ok: false, why: `not-searched ${notSearched} is not in scope ${inScope} minus searched ${searched}` };
  }
  return { ok: true, why: '' };
}

/* ------------------------------------------------------------- self-tests */

const wrap = (inner) => '<nav data-nav="shipped"><span>Not built</span></nav><main data-lens-body="records">' + inner + '</main>';
const badgeCell = (t) => 'data-badge="' + t + '" style="x">' + t + '</span>';
const cell = (t) => '<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + t + '</span>';
const result = (o) => '<div data-result="true" data-leg="' + (o.leg || 'cases') + '"' +
  (o.region ? ' data-region="' + o.region + '"' : '') +
  (o.kind ? ' data-gated-by="' + o.kind + '"' : '') +
  (o.state ? ' data-search-state="' + o.state + '"' : '') +
  (o.reason ? ' data-search-reason="' + o.reason + '"' : '') +
  (o.scope ? ' data-scope-type="' + o.scope + '"' : '') +
  '>' + (o.text || 'a row') + '</div>';
const cov = (o) =>
  '<div data-coverage data-coverage-leg="documents" data-scope-type="tenant" data-in-scope="' + (o.inScope ?? 10) +
  '" data-searched="' + (o.searched ?? 9) + '" data-not-searched="' + (o.notSearched ?? 1) + '"' +
  COVERAGE_KEYS.map((k) => ` data-reason-${k}="${k === 'no-text-layer' ? (o.noText ?? 1) : 0}"`).join('') + '>' +
  COVERAGE_RULE + '</div>';
const GOOD = wrap(cov({}) + result({ region: 'permits-pipeline', kind: 'mygov' }) + cell('ok'));
/** A coverage open tag on its own, for the arithmetic tests. */
const covTag = (o) =>
  '<div data-coverage data-coverage-leg="documents" data-scope-type="tenant" data-in-scope="' + (o.inScope ?? 10) +
  '" data-searched="' + (o.searched ?? 10) + '" data-not-searched="' + (o.notSearched ?? 0) + '"' +
  COVERAGE_KEYS.filter((k) => !(o.drop || []).includes(k))
    .map((k) => ` data-reason-${k}="${o.reasons && k in o.reasons ? o.reasons[k] : 0}"`).join('') + '>';

const selfTests = [
  ['scope: the body is found by its marker', bodyOf(GOOD) !== null],
  ['scope: a document without the marker yields null, never the whole page', bodyOf('<main>x</main>') === null],
  ['scope: the nav outside the body is EXCLUDED', bodyOf(GOOD).includes('data-nav') === false],
  ['scope: and the nav really does carry the quoted word', textOf(GOOD).includes(QUOTED_ONLY) === true],

  ['legs: the declared set is exactly the two the design draws', LEG_IDS.length === 2 && LEG_IDS.join() === 'cases,documents'],
  ['legs: a row with a declared leg is accepted', attrVals(result({ leg: 'cases', region: 'permits-pipeline' }), 'leg').every((v) => LEG_IDS.includes(v))],
  ['legs: REFUSES a third leg', LEG_IDS.includes('parcels') === false],
  ['legs: every row in the clean fixture carries one', resultRows(bodyOf(GOOD)).every((r) => /data-leg="/.test(r))],
  ['legs: and the extractor found the row', resultRows(bodyOf(GOOD)).length === 1],

  ['regions: accepts a registry id', REGION_IDS.includes('permits-pipeline') === true],
  ['regions: REFUSES an invented region', REGION_IDS.includes('parks-facilities') === false],
  ['regions: the registry is the full eleven', REGION_IDS.length === 11],
  ['regions: the extractor reads one off a row', attrVals(result({ region: 'permits-pipeline' }), 'region').length === 1],

  ['kinds: accepts a catalogued vendor', KIND_IDS.includes('mygov') === true],
  ['kinds: REFUSES an uncatalogued vendor', KIND_IDS.includes('prophecy') === false],
  ['kinds: ten are catalogued', KIND_IDS.length === 10],

  ['states: accepts a product state', STATES.includes('no-text-layer') === true],
  ['states: REFUSES an invented state', STATES.includes('pending-index') === false],
  ['states: five, and three of them are the reasons', STATES.length === REASONS.length + 2],

  ['reasons: accepts a stored reason', REASONS.includes('extraction-failed') === true],
  ['reasons: REFUSES reason-not-recorded as a REASON', REASONS.includes('reason-not-recorded') === false],
  ['reasons: but it IS a coverage key, because it is a countable state', COVERAGE_KEYS.includes('reason-not-recorded') === true],
  ['reasons: REFUSES a reason the product never stores', REASONS.includes('unsupported-format') === false],

  ['scopes: accepts a product scope type', SCOPE_TYPES.includes('tenant') === true],
  ['scopes: REFUSES an invented scope type', SCOPE_TYPES.includes('department') === false],
  ['scopes: four are closed', SCOPE_TYPES.length === 4],

  ['outcomes: accepts a composer status word', OUTCOMES.includes('no-fixture-source') === true],
  ['outcomes: accepts the read refusal code', OUTCOMES.includes(REFUSAL_CODE) === true],
  ['outcomes: REFUSES an invented outcome', OUTCOMES.includes('partial') === false],
  ['outcomes: the vocabulary is derived, seven words', OUTCOMES.length === 7],

  ['coverage: accepts a panel that reconciles', coverageReconciles(covTag({})).ok === true],
  ['coverage: REFUSES a panel whose reasons do not add up', coverageReconciles(covTag({ inScope: 10, searched: 9, notSearched: 1, reasons: { 'no-text-layer': 2 } })).ok === false],
  ['coverage: REFUSES a panel missing a reason key', coverageReconciles(covTag({ drop: ['extraction-failed'] })).ok === false],
  ['coverage: REFUSES a not-searched that is not the remainder', coverageReconciles(covTag({ notSearched: 2 })).ok === false],
  ['coverage: REFUSES a panel with no counts at all', coverageReconciles('data-coverage-leg="documents"').ok === false],
  ['coverage: accepts a panel where every reason is zero', coverageReconciles(covTag({ inScope: 4, searched: 4, notSearched: 0 })).ok === true],
  ['coverage: not vacuous - the clean panel really is accepted', coverageReconciles(covTag({})).ok === true],

  ['quoting: a body with no quoted region has every word in its own voice', unquoted(bodyOf(wrap('<p>x</p>'))).includes(QUOTED_ONLY) === false],
  ['quoting: the shipped nav is stripped when it is inside the body', unquoted(wrap('<nav data-nav="shipped">Not built</nav><main data-lens-body="records"><p>x</p></main>')).includes(QUOTED_ONLY) === false],
  ['quoting: and the word was really there to strip', wrap('<nav data-nav="shipped">Not built</nav><main data-lens-body="records"><p>x</p></main>').includes(QUOTED_ONLY) === true],
  ['quoting: REFUSES the word in the design own voice', unquoted(bodyOf(wrap('<p>this surface is Not built</p>'))).includes(QUOTED_ONLY) === true],
  ['quoting: the stub panel is stripped', unquoted(bodyOf(wrap('<section data-stub="today">Not built</section><p>x</p>'))).includes(QUOTED_ONLY) === false],
  ['quoting: the register panel is stripped', unquoted(bodyOf(wrap('<section data-register="shell-homes">Not built</section><p>x</p>'))).includes(QUOTED_ONLY) === false],
  ['quoting: the strip accounts for both occurrences', strippedCount('<section data-stub="today">Not built</section><section data-register="shell-homes">Not built</section>') === 2],
  ['quoting: and accounts for none when the design speaks for itself', strippedCount('<p>Not built</p>') === 0],
  ['quoting: a stripped region and an unstripped line are told apart', strippedCount('<section data-stub="today">Not built</section><p>Not built</p>') === 1],

  ['people: REFUSES an initialised name', PERSON.test('S. Carrillo') === true],
  ['people: ALLOWS a region id', PERSON.test('permits-pipeline') === false],
  ['people: finds one in a rendered cell', people(cell('S. Carrillo')).length === 1],
  ['people: finds none in a plain cell', people(cell('2102 Pine St')).length === 0],

  ['defect: a results panel with no coverage is found by its marker', defectOf('<section data-defect="silent-coverage">' + result({ region: 'permits-pipeline' }) + '</section>') !== null],
  ['defect: and a board without one yields null', defectOf('<section>x</section>') === null],

  ['text: the style block is not read as content', textOf('<style>--sc-accent:#0B6A7B;</style><p>ok</p>').includes('accent') === false],
  ['stub: the quoted strings are the product own', STUB.pageHeading.length > 20 && STUB.topbarPlaceholder.includes('parcels') === true],
  ['counting: the coverage rule is the product own sentence', COVERAGE_RULE.includes('reason-not-recorded when none was recorded') === true],
  ['acceptance: the declared ids are the three this design owes', ACCEPTANCE_IDS.length === 3],
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

/**
 * Which board is which side of the rule. A board in neither set is a design
 * change, and the rule that makes this folder worth having was never applied to
 * it, so it is refused rather than passed.
 */
const MUST_CARRY_COVERAGE = new Set(['Main.dc.html', 'Results.dc.html']);
const MUST_CARRY_DEFECT = new Set(['Gaps.dc.html']);
const MUST_CARRY_ACCEPTANCE = new Set(['Main.dc.html', 'Gaps.dc.html']);

let bad = 0;
const totals = {
  bodies: 0, results: 0, coverageBlocks: 0, recovered: 0, badges: 0, cells: 0,
  states: 0, reasons: 0, regions: 0, kinds: 0, legs: 0, scopes: 0, outcomes: 0,
  defects: 0, refusals: 0, acceptance: 0, coverageRules: 0, quotedStripped: 0,
};

for (const file of files) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const body = bodyOf(html);
  const problems = [];

  if (!body) {
    console.error('FAIL ' + file);
    console.error('     no data-lens-body="records" marker: this board cannot be scoped, so it is not checked');
    bad += 1;
    continue;
  }
  totals.bodies += 1;

  const rows = resultRows(body);
  const covBlocks = coverageBlocks(body);
  const defect = defectOf(html);
  const b = badges(body), c = cells(body);
  const badgeMismatch = badgePairs(body).filter(([declared, rendered]) => declared !== rendered);
  if (badgeMismatch.length) {
    problems.push('a badge declares one word and prints another: ' + badgeMismatch.map(([d, r]) => `"${d}" vs "${r}"`).join(', '));
  }
  totals.results += rows.length;
  totals.coverageBlocks += covBlocks.length;
  totals.badges += b.length;
  totals.cells += c.length;

  /* ---- the vocabularies, each with a scanned count so none can pass vacuously */

  const checkVocab = (name, values, allowed, extra) => {
    totals[name] += values.length;
    const badVals = [...new Set(values.filter((v) => !allowed.includes(v)))];
    if (badVals.length) {
      problems.push(`invented ${name}: ${badVals.join(', ')} — not in the product set read from source-state.json`);
    }
    if (extra) extra(values);
  };

  checkVocab('states', attrVals(body, 'search-state'), STATES);
  checkVocab('scopes', attrVals(body, 'scope-type'), SCOPE_TYPES);
  checkVocab('regions', attrVals(body, 'region'), REGION_IDS);
  checkVocab('kinds', attrVals(body, 'gated-by'), KIND_IDS);
  checkVocab('legs', attrVals(body, 'leg'), LEG_IDS);
  checkVocab('outcomes', attrVals(body, 'outcome'), OUTCOMES);

  /**
   * REASONS ARE NOT STATES AND THE TWO LISTS MUST NOT MERGE. A reason is one of
   * the three the product stores, or `none` where the row is a state row and has
   * no reason to give. `reason-not-recorded` is never a reason: the product's own
   * CHECK constraint refuses it as a stored value, and a design that let it in
   * would be claiming to know why a row was not indexed.
   */
  const reasonVals = attrVals(body, 'search-reason');
  totals.reasons += reasonVals.length;
  const badReasons = [...new Set(reasonVals.filter((v) => v !== 'none' && !REASONS.includes(v)))];
  if (badReasons.length) {
    problems.push(`invented search reason: ${badReasons.join(', ')} — the product stores ${REASONS.join(', ')}, and nothing else`);
  }

  /* ---- coverage arithmetic, per block, on the attributes */

  for (const blk of covBlocks) {
    if (blk.leg !== 'documents') continue;
    const r = coverageReconciles(blk.attrs);
    if (!r.ok) problems.push(`the coverage panel does not reconcile: ${r.why}`);
    if (!/data-fixture="true"/.test(blk.attrs)) {
      problems.push('the corpus coverage panel is not badged data-fixture: these counts are a shape, and a shape presented as a measurement is the defect');
    }
    totals.recovered += 1;
  }

/**
 * ONE COUNTING-RULE ELEMENT PER CORPUS COVERAGE PANEL, VERBATIM. The corpus
 * counts are only readable beside the product's own sentence for what they
 * count, so the sentence is required inside a dedicated element, once per panel.
 * An earlier version of this check counted the sentence anywhere in the body —
 * which the panel's own basis line satisfied, so stripping the structured
 * element passed. The plants file caught that, which is why it exists.
 */
const RULE_EL_RE = /<div data-coverage-rule="documents"[^>]*>([\s\S]*?)<\/div>/g;
const ruleEls = [...body.matchAll(RULE_EL_RE)].map((m) => m[1]);
totals.coverageRules += ruleEls.length;
const docsBlocks = covBlocks.filter((x) => x.leg === 'documents').length;
if (ruleEls.length !== docsBlocks) {
  problems.push(`the corpus coverage panel is not paired with a counting-rule element (${ruleEls.length} rule element(s) for ${docsBlocks} panel(s))`);
}
if (ruleEls.some((inner) => !inner.includes(COVERAGE_RULE))) {
  problems.push("a coverage panel's rule element does not carry the product's counting rule verbatim");
}

  /* ---- coverage before results, and the counter-example that proves it */

  const firstResult = body.indexOf('data-result="true"');
  const firstCoverage = body.indexOf('data-coverage data-coverage-leg=');
  if (MUST_CARRY_COVERAGE.has(file)) {
    /**
     * TWO SIDES, AND BOTH ARE LOAD BEARING. Main is the at-rest board: coverage
     * with NO results, which is the rule stated in its strongest form. Results
     * is the queried board: coverage AND results, which is where the ordering
     * can actually be broken. A folder whose only board had results would never
     * show that coverage can come first.
     */
    if (covBlocks.length === 0) problems.push('NO coverage panel: results without coverage is the defect this folder was opened to name');
    if (firstResult >= 0 && firstCoverage >= 0 && firstCoverage > firstResult) {
      problems.push('the coverage panel comes AFTER the first result: coverage before results is the rule, and a panel below the fold is a footnote');
    }
    if (file === 'Main.dc.html' && rows.length !== 0) {
      problems.push(`${rows.length} result rows on the at-rest board: it exists to show that coverage is stated before a query, not after one`);
    }
    if (file !== 'Main.dc.html' && rows.length === 0) {
      problems.push('NO result rows on a board that exists to show results: the leg and origin scan had nothing to scan');
    }
  } else if (MUST_CARRY_DEFECT.has(file)) {
    if (!defect) {
      problems.push('no data-defect="silent-coverage" region: without the counter-example the coverage rule is only ever tested on boards that already obey it');
    } else {
      totals.defects += 1;
      const inner = defect;
      const innerRows = resultRows(inner).length;
      const innerCov = (inner.match(/data-coverage data-coverage-leg=/g) || []).length;
      if (innerRows === 0) problems.push('the defect region carries no result rows, so it does not demonstrate the defect');
      if (innerCov !== 0) problems.push('the defect region carries a coverage panel, so it is not the defect');
    }
    if (covBlocks.length > 0) {
      problems.push('this board carries a coverage panel; it exists to draw the shape WITHOUT one, and a clean panel here would let the defect rule never fire');
    }
  } else {
    problems.push('this board is in neither MUST_CARRY_COVERAGE nor MUST_CARRY_DEFECT, so the rule that makes');
    problems.push('this folder worth having was never applied to it. Classify it or delete it.');
  }

  /* ---- every result says where it came from */

  for (const r of rows) {
    if (!/data-leg="/.test(r)) problems.push('a result row carries no data-leg: a result whose leg cannot be read back is a result nobody can audit');
    const hasOrigin = /data-region="/.test(r) || /data-scope-type="/.test(r);
    if (!hasOrigin) problems.push('a result row names neither a region nor a scope: it is a bare string presented as a finding');
    if (/data-refusal="/.test(r)) {
      totals.refusals += 1;
      const code = (r.match(/data-refusal="([^"]*)"/) || [])[1];
      if (code !== REFUSAL_CODE) problems.push(`a refusal carries code "${code}"; the product's is ${REFUSAL_CODE}`);
      if (/\b0\s+(documents|results|matches)\b/i.test(textOf(r))) {
        problems.push('a refusal is rendered with a zero count: a refused scope is not an empty one, and "0 documents" is a false statement about the city');
      }
    }
  }

  /* ---- the words this design may only quote */

  const un = unquoted(body);
  if (un.includes(QUOTED_ONLY)) {
    problems.push(`the design says "${QUOTED_ONLY}" in its own voice: on this surface those words belong to the shipped values being quoted, never to the page this design draws`);
  }
  const stripped = strippedCount(body);
  totals.quotedStripped += stripped;
  if (countOf(body, QUOTED_ONLY) !== stripped) {
    problems.push('the quoted-value strip does not account for every occurrence of the quoted word');
  }

  if (!badgesOk(b)) problems.push('invented badge word: ' + b.filter((x) => !BADGE_WORDS.includes(x)).join(', '));
  const named = people(body);
  if (named.length) problems.push('cells name people: ' + [...new Set(named)].join(', '));

  const acc = attrVals(body, 'acceptance');
  totals.acceptance += acc.length;
  if (MUST_CARRY_ACCEPTANCE.has(file)) {
    const missing = ACCEPTANCE_IDS.filter((id) => file === 'Gaps.dc.html' ? !acc.includes(id) : id === 'parcels-not-a-leg' && !acc.includes(id));
    if (missing.length) problems.push('acceptance item(s) not named on this board: ' + missing.join(', '));
  }

  const designState = attrVals(body, 'design-state');
  if (designState.length !== 1 || designState[0] !== 'drawn-not-built') {
    problems.push('no data-design-state="drawn-not-built" line: a board that does not say it is a design reads as a shipped surface');
  }
  if (!body.includes(S.snapshot.dashboards.commit.slice(0, 8))) {
    problems.push('the board does not name the ref it was drawn against, so a stale board cannot be told from a current one');
  }

  if (problems.length) {
    bad += 1;
    console.error('FAIL ' + file);
    for (const q of problems) console.error('     ' + q);
  } else {
    console.log('ok   ' + file + '  (' + rows.length + ' results, ' + covBlocks.length + ' coverage panels, ' +
      b.length + ' badges, ' + c.length + ' cells, ' + acc.length + ' acceptance markers)');
  }
}

function badgesOk(list) {
  return list.every((x) => BADGE_WORDS.includes(x));
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));

/**
 * A check with no inputs is worse than no check. This is where the two-sided
 * rules are held to having had BOTH sides: the defect region counts only if it
 * was actually found and actually wrong, and refusals and acceptance markers
 * count only if the boards really carry them.
 */
const vacuous = [
  ['bodies', totals.bodies], ['results', totals.results], ['coverageBlocks', totals.coverageBlocks],
  ['recovered', totals.recovered], ['badges', totals.badges], ['cells', totals.cells],
  ['states', totals.states], ['reasons', totals.reasons], ['regions', totals.regions],
  ['kinds', totals.kinds], ['legs', totals.legs], ['scopes', totals.scopes], ['outcomes', totals.outcomes],
  ['defects', totals.defects], ['refusals', totals.refusals], ['acceptance', totals.acceptance],
  ['coverageRules', totals.coverageRules], ['quotedStripped', totals.quotedStripped],
].filter(([, v]) => v === 0);

if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing: ' + vacuous.map(([k]) => k).join(', ') +
    '. A predicate with no inputs cannot fail, so a green result would be a result about nothing.');
  process.exit(2);
}

if (bad) { console.error('\n' + bad + ' failure(s).'); process.exit(1); }
console.log(files.length + ' artboards pass.');
