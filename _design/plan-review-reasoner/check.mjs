/**
 * Adversarial read of the reasoner artboards against the product's own composer.
 *
 *   node dump-source-state.mjs --repo <plan-review checkout> && node gen.mjs && node check.mjs
 *
 * Non-zero exit on any violation. Exit 2 means the instrument REFUSED to report a
 * verdict, which is not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested
 * perfectly and matched nothing on any artboard, because the canvas rendered
 * display forms and the check looked for the product's codes. It reported success
 * and checked nothing. So three things are structural here:
 *
 *   1. EVERY PREDICATE REPORTS A COUNT of the inputs it matched, and the run
 *      aborts if a predicate that must have inputs has none.
 *   2. WHERE A RULE'S LEGITIMATE ANSWER IS "NOTHING FOUND" -- "no invented
 *      section identifier", "no paraphrase of an unquotable code" -- it is paired
 *      with a count of what it SCANNED, which must be non-zero. "Found no
 *      invented identifier" must never be satisfiable by looking at nothing.
 *   3. NOTHING IS COMPARED AGAINST ITSELF. One side of every predicate comes from
 *      an artboard and the other from `source-state.json`, which is the product's
 *      own composeReasoner() output at a named commit. One party acting alone
 *      cannot satisfy both sides. The boards TYPE their intent -- the design's
 *      13-finding scope is a design premise, declared in dump-source-state.mjs --
 *      the product DERIVES its output over that scope, and this file is the third
 *      party that compares them. That is why the draft's "Unchecked 9 / Pass 1"
 *      could not have shipped through here: the composer cannot produce a Pass for
 *      permitted use, and the number was typed in three places and checked by eye
 *      in none.
 *
 * THREE NARROWNESSES ARE STATED IN THE RULES THEMSELVES, because an exclusion set
 * is part of a rule's contract and a rule nobody can read is a rule that gets
 * widened again:
 *
 *   THE PARAPHRASE RULE IS NARROWER THAN "NOTHING ABOUT THE CODE". It fires on a
 *   SENTENCE that carries both a requirement modal and the section number or the
 *   full book title, inside a finding that cites a quotable:false book. "No action
 *   is required from you on this item." is a sentence with a modal and no
 *   identifier, and it is not a paraphrase; "IBC 705.5 requires a two-hour
 *   rating." is both. A paraphrase naming neither the section nor the book passes
 *   this rule, and that gap is declared rather than hidden.
 *
 *   THE IDENTIFIER RULE SPLITS ITS INPUTS. A citation is a legal place for a
 *   section number, so citations are lifted out before the bare-identifier scan.
 *   That leaves two disjoint counts -- identifiers inside citations, identifiers
 *   outside them -- and BOTH are non-vacuity inputs, which is what makes "no
 *   invented identifier" mean something. `14-02-005` in prose is caught by the
 *   second; a citation naming a section the manifest does not hold is caught by
 *   the first.
 *
 *   BADGES ARE ATTRIBUTED BY THE NEXT ROW MARKER. The boards carry no per-finding
 *   closing marker, so a badge belongs to the finding whose attributes precede it.
 *   Badges appear in no other element, and that is itself checked: the number of
 *   badges must equal the number of finding rows on every board declared to carry
 *   a badge, so a badge outside a row fails as a count mismatch.
 *
 * WHAT IS NOT CHECKED. Whether a sentence's MEANING is fair to the code, and
 * whether the reviewer named in the override is the right reviewer. Both are
 * judgements this file cannot hold and does not pretend to.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-state.json is missing or unparsable. It is the product composer output this');
  console.error('file checks the canvas against, and there is no second source without it. Re-dump it');
  console.error('with dump-source-state.mjs rather than letting the check pass silently.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

const registryKeys = new Set(S.source.adjudicators.map((a) => a.key));
const adjudicatedSections = new Set(S.source.adjudicatedSectionIds);
const BADGE_LIVE = S.source.badges.live;
const BADGE_NONE = S.source.badges.none;
const ABSENCE_KINDS = new Set(S.source.absenceKinds);
const DETERMINATIONS = new Set(S.source.determinations);
const UDC_SECTIONS = new Set(S.source.udcSectionIds);
const BOOK_TITLES = S.source.bookTitles;
const EDITION_IDS = new Set(S.source.editionIds);
const UNQUOTABLE = new Set(S.source.unquotableBooks);

if (S.source.registrySize !== registryKeys.size) {
  console.error('source.adjudicators disagrees with source.registrySize. A registry this file cannot');
  console.error('count is a registry it cannot check a badge against. Re-dump.');
  process.exit(2);
}
if (UDC_SECTIONS.size === 0) {
  console.error('the UDC manifest yielded no section ids, so the identifier rule would have nothing to');
  console.error('exclude and would flag every dash-shaped token. Re-dump before trusting a verdict.');
  process.exit(2);
}

/** The product's composed output over the design's declared 13-finding scope. */
const SCOPE = S.scope.composer;
const SCOPE_BY_RULE = new Map(SCOPE.findings.map((f) => [f.ruleLabel, f]));
if (SCOPE_BY_RULE.size !== S.scope.findings.length) {
  console.error('two scope findings share a rule label, so a board row cannot be joined to one of them.');
  console.error('Fix dump-source-state.mjs rather than letting the join pick the first.');
  process.exit(2);
}
if (SCOPE.notice?.ties !== true) {
  console.error('the product did not report a tying correction notice over the design scope. Every count');
  console.error('on the letter is checked against it, so there is nothing to check against.');
  process.exit(2);
}
const PRODUCT_UNQUOTABLE_CITED = SCOPE.findings.filter((f) => f.bookId && UNQUOTABLE.has(f.bookId) && f.citation).length;

/* ------------------------------------------------------------- extractors */

const BOARD_RE = /<main data-board="([a-z]+)"[\s\S]*?<\/main>/;
const ROW_SPLIT = '<div data-finding="';
/**
 * A citation is counted only in the product's own form: `<a title we hold>
 * Section <n> (<an edition we hold>)`. The title is a LITERAL rather than a
 * `[A-Z]...` class, because a class matches from the first capital letter on the
 * board and swallows everything up to the first " Section " -- which is how the
 * first pass here read a whole board header as a book title.
 */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KNOWN_CITE_RE = new RegExp(
  '(' + BOOK_TITLES.map(escapeRe).join('|') + ') Section ([\\w.\\-]+) \\(([\\w.\\-]+)\\)',
  'g',
);
/**
 * The same shape with a title nobody holds, so an invented book can be caught in
 * the act of being cited. Bounded to five capitalized words, which is what keeps
 * it off a board's running text: a real title stops at " Section ", and a
 * sentence does not.
 */
const CITE_SHAPED_RE = /((?:[A-Z][a-z]+ ){1,4}[A-Z][a-z]+) Section ([\w.\-]+) \(([\w.\-]+)\)/g;
const CITE_RE = KNOWN_CITE_RE;
const BARE_DASH_RE = /\b(\d{2}-\d{2}-\d{3})\b/g;
/**
 * Two shapes, because the product has two: a UDC section is written
 * 14-02-003 and a model-code section 705.5. A dot-separated UDC section
 * (14.02.005) is the same identifier written illegally and is caught by the
 * first alternative.
 */
const BARE_DOTTED_RE = /\b(\d{2}\.\d{2}\.\d{3}|\d{3,4}\.\d{1,2}(?:\.\d{1,2})?)\b/g;
const TITLE_SHAPED_RE = /\b(?:[A-Z][a-z]+(?:\s+|$))+Code\b/g;
const MODAL_RE = /\b(?:shall(?:\s+not)?|must(?:\s+not)?|is\s+required|are\s+required|requires|minimum|maximum)\b/i;
const REFUSAL_RE = /<span data-refusal="1"[^>]*>([^<]*)<\/span>/g;
const NOTICE_RE = /data-notice="([a-zA-Z]+)" data-count="(\d+)"/g;
const NOTICE_TOTAL_RE = /data-notice-total="(\d+)"/;
const ABSENCE_RE = /data-absence-kind="([a-z-]+)" data-absence-count="(\d+)"/g;
const CHIP_RE = /data-chip="([^"]*)"/g;
const PROV_RE = /data-provenance="([^"]*)" data-provenance-next="([^"]*)" data-provenance-next-built="([^"]*)"/;
const MARKER_RES = {
  finding: /data-finding="/g,
  badge: /data-badge="/g,
  chip: /data-chip="/g,
  notice: /data-notice="/g,
  absence: /data-absence-kind="/g,
  provenance: /data-provenance="/g,
  wholeChain: /data-whole-chain="/g,
  refusal: /data-refusal="/g,
};

/**
 * WHICH BOARD CARRIES WHICH MARKER, declared rather than discovered.
 *
 * A board that grows a marker it is not declared to carry fails, and a new
 * artboard fails until it is declared here. The point is that a surface nobody
 * wrote an expectation for is a surface nobody checked, and the draft's coverage
 * claim failed exactly there: the console said nine corpus gaps while the axis was
 * ten, and no one had written down what the console was supposed to carry.
 */
const DECLARED = {
  console: { finding: 'rows', badge: 'one-per-row', chip: 'present', citation: 'present' },
  reasoning: { provenance: 'one', citation: 'present' },
  coverage: { absence: 'present', wholeChain: 'one' },
  letter: { notice: 'present', citation: 'present', refusal: 'present' },
  cycle: { finding: 'rows', badge: 'one-per-row', citation: 'present' },
};

const boards = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html')).sort();
if (boards.length === 0) {
  console.error('no artboards found. Run `node gen.mjs` first.');
  process.exit(2);
}

/** Hidden text only. A CSS colour or a var() name must never satisfy a content rule. */
function plainText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&middot;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ');
}
/** The board's own scope, so board chrome (nav, topbar) is never read as content. */
const bodyOf = (html) => {
  const m = html.match(BOARD_RE);
  return m ? { id: m[1], html: m[0] } : null;
};
const withoutCitations = (text) => text.replace(CITE_RE, ' ');

/**
 * Finding rows, split on the row marker. `raw` is the chunk from this row to the
 * next, which is what the refusal and paraphrase rules read.
 */
function findingRows(scoped) {
  return scoped
    .split(ROW_SPLIT)
    .slice(1)
    .map((c) => {
      /* The chunk starts where the row marker was SPLIT OUT, so the opening tag is
         put back before anything is read as text. Without this the row's own
         attributes are not inside a tag as far as plainText is concerned, and a
         citation carried in `data-citation` leaks into the visible text -- which
         is what made a modal in the body look like it shared a sentence with the
         section number. */
      const full = ROW_SPLIT + c;
      const head = full.slice(0, 420);
      const a = (n) => {
        const m = head.match(new RegExp(n + '="([^"]*)"'));
        return m ? m[1] : null;
      };
      return {
        rule: a('data-rule'),
        book: a('data-book'),
        section: a('data-section'),
        determination: a('data-determination'),
        author: a('data-author'),
        citation: a('data-citation'),
        badges: [...c.matchAll(/data-badge="([^"]*)"/g)].map((m) => m[1]),
        raw: full,
        text: plainText(full),
      };
    })
    .filter((r) => r.rule !== null);
}

/* ------------------------------------------------------------- predicates
   Each returns something countable, so the run can tell "clean" from "unread". */

/** A badge is a claim about source. LIVE CHECK only where the registry has one. */
const liveBadgesWrong = (rows) => rows.filter((r) => r.badges.includes(BADGE_LIVE) && !adjudicatedSections.has(r.section));
/** Every other badge must be NO ADJUDICATOR, and only where there is none. */
const noneBadgesWrong = (rows) => rows.filter((r) => r.badges.includes(BADGE_NONE) && adjudicatedSections.has(r.section));
/** A row's badge must equal the product's badge for that rule. */
const badgeMismatch = (rows) =>
  rows
    .filter((r) => SCOPE_BY_RULE.has(r.rule))
    .filter((r) => r.badges[0] !== SCOPE_BY_RULE.get(r.rule).badge)
    .map((r) => r.rule + ': board says ' + r.badges[0] + ', product says ' + SCOPE_BY_RULE.get(r.rule).badge);
/**
 * `adjudicated: null` renders Unchecked, never Pass. Scoped to MACHINE rows: a
 * named reviewer may record what the contract allows, and the two are told apart
 * by data-author rather than by the determination, because both can be Fail.
 */
const machineUnadjudicatedWrong = (rows) =>
  rows.filter((r) => r.author === 'machine' && !adjudicatedSections.has(r.section) && (r.determination === 'Pass' || r.determination === 'Fail'));
/** Uncertain is not machine-derived, and it names its reviewer. */
const uncertainWrong = (rows) =>
  rows.filter((r) => r.determination === 'Uncertain' && (r.author !== 'reviewer' || !/m\. leavis/i.test(r.text)));
/** A row's author must agree with the product's determinationSource class. */
const authorMismatch = (rows) =>
  rows
    .filter((r) => SCOPE_BY_RULE.has(r.rule))
    .filter((r) => (SCOPE_BY_RULE.get(r.rule).determinationSource === 'reviewer') !== (r.author === 'reviewer'))
    .map((r) => r.rule);
const knownSection = (c) => (c.section.match(/^\d{2}-\d{2}-\d{3}$/) ? UDC_SECTIONS.has(c.section) : /^\d+(?:\.\d+)*$/.test(c.section));
/** A counted citation must name a section and an edition the product actually holds. */
const badCitations = (cites) => cites.filter((c) => !EDITION_IDS.has(c.edition) || !knownSection(c));
/** A citation that names a book nobody holds. */
const inventedCiteTitles = (text) =>
  [...text.matchAll(CITE_SHAPED_RE)].map((m) => m[1].trim()).filter((t) => !BOOK_TITLES.some((bt) => bt.includes(t)));
/**
 * No invented section identifier, in a citation or in prose.
 *
 * The known set is the union of the manifest's sections and every section id the
 * product's own composed output points at. That union is what keeps this rule
 * from calling the model-code section `705.5` invented: the product holds no
 * section list for IBC2018P6, but the reasoner does cite that section, so saying
 * its number in prose is not a claim the source cannot back. `14-02-005` is in
 * neither set, which is the whole point of the rule.
 */
const KNOWN_SECTIONS = new Set([
  ...UDC_SECTIONS,
  ...S.source.books.flatMap((b) => b.sections),
  ...SCOPE.findings.map((f) => f.sectionId).filter(Boolean),
]);
const bareIdentifiers = (scoped) => {
  const t = withoutCitations(plainText(scoped));
  return [...(t.match(BARE_DASH_RE) || []), ...(t.match(BARE_DOTTED_RE) || [])];
};
const unknownBareIdentifiers = (bare) => bare.filter((id) => !KNOWN_SECTIONS.has(id));
/** A phrase shaped "<Something> Code" must be part of a title the product holds. */
const titleShaped = (scoped) => [...plainText(scoped).matchAll(TITLE_SHAPED_RE)].map((m) => m[0]);
const inventedTitles = (titles) => titles.filter((t) => !BOOK_TITLES.some((bt) => bt.includes(t)));
/**
 * No paraphrasing a code where quotable === false. Narrower than "nothing about
 * the code": the modal AND the identifier must land in the SAME sentence.
 */
const paraphrases = (rows) =>
  rows
    .filter((r) => r.book && UNQUOTABLE.has(r.book))
    .flatMap((r) => {
      const t = plainText(r.raw.replace(REFUSAL_RE, ' '));
      return t
        .split(/(?<=[.;:])\s+/)
        .filter((s) => MODAL_RE.test(s) && (s.includes(r.section) || BOOK_TITLES.some((bt) => s.includes(bt))))
        .map((s) => r.rule + ': "' + s.trim().slice(0, 96) + '"');
    });
/** The letter must refuse as many times as the product has unquotable cited findings. */
const refusalCountOk = (productCount, letterCount) => productCount === letterCount;
/** A notice count must equal the product's, and a category it does not have is invented. */
const noticeMismatch = (notas) => notas.filter(([k, n]) => SCOPE.notice[k] !== n).map(([k]) => k);
/** An absence count must equal the product's count on the same axis. */
const absenceMismatch = (absences) => absences.filter(([k, n]) => SCOPE.coverage.axis1Corpus[k] !== n).map(([k]) => k);
/** A filter chip must name a real determination and carry its real count. */
const chipMismatch = (chips) =>
  chips
    .map((chip) => {
      const m = chip.match(/^(Pass|Fail|Uncertain|Unchecked) (\d+)$/);
      if (!m) return chip === 'All ' + SCOPE.findings.length ? null : chip;
      const product = SCOPE.findings.filter((f) => f.determination === m[1]).length;
      return Number(m[2]) === product ? null : chip;
    })
    .filter((x) => x !== null);
/** The provenance claim must equal the product's, and a board with no claim fails. */
const provenanceMismatch = (prov) => {
  if (prov === null) return ['no provenance marker'];
  const out = [];
  if (prov[1] !== S.source.provenance.current) out.push('rung ' + prov[1]);
  if ((prov[3] === '1') !== S.source.provenance.nextBuilt) out.push('next built ' + prov[3]);
  return out;
};

/* ------------------------------------------------------------- self-tests */

const chunkOf = (o) =>
  '<div data-finding="' + (o.pin || '1') + '" data-rule="' + o.rule + '" data-book="' + (o.book || '') +
  '" data-section="' + (o.section || '') + '" data-determination="' + o.determination + '" data-author="' +
  (o.author || 'machine') + '" data-citation="' + (o.citation || '') + '" data-live="' + (o.live ? '1' : '0') + '"' +
  (o.badge ? ' data-badge="' + o.badge + '"' : '') + '>' + (o.text || '') + '</div>';
const board = (rows, extra) => '<main data-board="console">' + rows.join('') + (extra || '') + '</main>';
const rowsOf = (rows) => findingRows(board(rows));

const CITE_003 = 'City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)';
const CITE_008 = 'City of Bastrop Building Block B3 Section 14-02-008 (bastrop_tx-bdc-2026-adopted)';
const CITE_IBC = '2018 International Building Code Section 705.5 (IBC-2018)';
const CITE_FAKE = 'Bastrop Development Code Section 14-02-003 (bastrop_tx-bdc-2026-adopted)';
const CITE_UNKNOWN = 'City of Bastrop Building Block B3 Section 14-02-005 (bastrop_tx-bdc-2026-adopted)';

const front = (o) => chunkOf({ rule: 'Front setback', section: '14-02-003', book: 'BASTROP-UDC', determination: 'Fail', citation: CITE_003, live: true, badge: BADGE_LIVE, ...o });
const use = (o) => chunkOf({ rule: 'Permitted use', section: '14-02-008', book: 'BASTROP-UDC', determination: 'Unchecked', citation: CITE_008, badge: BADGE_NONE, ...o });
const sep = (o) => chunkOf({ rule: 'Fire separation distance', section: '705.5', book: 'IBC2018P6', citation: CITE_IBC, ...o });

const tests = [
  ['badge: accepts LIVE CHECK on the one adjudicated rule', liveBadgesWrong(rowsOf([front()])).length === 0],
  ['badge: REFUSES LIVE CHECK where no adjudicator exists', liveBadgesWrong(rowsOf([use({ badge: BADGE_LIVE })])).length === 1],
  ['badge: accepts NO ADJUDICATOR where there is none', noneBadgesWrong(rowsOf([use()])).length === 0],
  ['badge: REFUSES NO ADJUDICATOR on the adjudicated rule', noneBadgesWrong(rowsOf([front({ badge: BADGE_NONE })])).length === 1],
  ['badge: the extractor found a badge at all', rowsOf([front()])[0].badges.length === 1],
  ['badge: a badge never leaks from the previous row', rowsOf([front(), use({ badge: undefined })])[1].badges.length === 0],
  ['badge: a badge agrees with the product', badgeMismatch(rowsOf([front(), use()])).length === 0],
  ['badge: REFUSES a badge the product contradicts', badgeMismatch(rowsOf([use({ badge: BADGE_LIVE })])).length === 1],
  ['pass: REFUSES a machine Pass with no adjudicator', machineUnadjudicatedWrong(rowsOf([use({ determination: 'Pass' })])).length === 1],
  ['pass: REFUSES a machine Fail with no adjudicator', machineUnadjudicatedWrong(rowsOf([use({ determination: 'Fail' })])).length === 1],
  ['pass: accepts Unchecked on the same rule', machineUnadjudicatedWrong(rowsOf([use()])).length === 0],
  ['pass: accepts Fail on the adjudicated rule', machineUnadjudicatedWrong(rowsOf([front()])).length === 0],
  ['pass: a reviewer may record Fail with no adjudicator', machineUnadjudicatedWrong(rowsOf([use({ determination: 'Fail', author: 'reviewer' })])).length === 0],
  ['pass: not vacuous - a machine row was inspected', rowsOf([use({ determination: 'Pass' })]).filter((r) => r.author === 'machine').length === 1],
  ['uncertain: REFUSES a machine-derived Uncertain', uncertainWrong(rowsOf([sep({ determination: 'Uncertain' })])).length === 1],
  ['uncertain: accepts a named reviewer\u2019s', uncertainWrong(rowsOf([sep({ determination: 'Uncertain', author: 'reviewer', text: 'M. Leavis recorded a conflict.' })])).length === 0],
  ['uncertain: REFUSES a reviewer who is not named', uncertainWrong(rowsOf([sep({ determination: 'Uncertain', author: 'reviewer', text: 'A conflict was recorded.' })])).length === 1],
  ['uncertain: not vacuous - an Uncertain row was inspected', rowsOf([sep({ determination: 'Uncertain', author: 'reviewer', text: 'M. Leavis recorded a conflict.' })]).filter((r) => r.determination === 'Uncertain').length === 1],
  ['uncertain: accepts the reviewer named in a chip', uncertainWrong(rowsOf([sep({ determination: 'Uncertain', author: 'reviewer', text: 'M. LEAVIS &middot; carried' })])).length === 0],
  ['author: agrees with the product', authorMismatch(rowsOf([front(), sep({ determination: 'Uncertain', author: 'reviewer', text: 'M. Leavis recorded a conflict.' })])).length === 0],
  ['author: REFUSES a reviewer row the product calls machine', authorMismatch(rowsOf([front({ author: 'reviewer' })])).length === 1],
  ['citation: the product\u2019s own strings parse', badCitations([{ title: 'City of Bastrop Building Block B3', section: '14-02-003', edition: 'bastrop_tx-bdc-2026-adopted' }, { title: '2018 International Building Code', section: '705.5', edition: 'IBC-2018' }]).length === 0],
  ['citation: REFUSES a section the manifest does not hold', badCitations([{ title: 'City of Bastrop Building Block B3', section: '14-02-005', edition: 'bastrop_tx-bdc-2026-adopted' }]).length === 1],
  ['citation: REFUSES an edition the product does not hold', badCitations([{ title: 'City of Bastrop Building Block B3', section: '14-02-003', edition: 'bastrop_tx-bdc-2027-draft' }]).length === 1],
  ['citation: the extractor finds the product\u2019s own string', [...plainText(board([use({ text: CITE_003 })])).matchAll(CITE_RE)].length === 1],
  ['citation: a citation carried only in an attribute is not read as rendered text', [...plainText(board([front()])).matchAll(CITE_RE)].length === 0],
  ['citation: REFUSES a citation naming a book nobody holds', inventedCiteTitles('Bastrop Development Code Section 14-02-003 (bastrop_tx-bdc-2026-adopted)').length === 1],
  ['citation: ACCEPTS a partial real title', inventedCiteTitles('International Building Code Section 705.5 (IBC-2018)').length === 0],
  ['citation: does not mistake a board heading for a book title', inventedCiteTitles('Intake Applicability Findings Letter Documents City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)').length === 0],
  ['citation: not vacuous - a citation-shaped phrase was scanned', [...'International Building Code Section 705.5 (IBC-2018)'.matchAll(CITE_SHAPED_RE)].length === 1],
  ['identifier: REFUSES 14-02-005 in prose', unknownBareIdentifiers(bareIdentifiers(board([use({ text: 'See 14-02-005.' })]))).length === 1],
  ['identifier: ACCEPTS a dash identifier the manifest holds', unknownBareIdentifiers(bareIdentifiers(board([use({ text: 'See 14-02-003.' })]))).length === 0],
  ['identifier: REFUSES a dot-separated UDC section', unknownBareIdentifiers(bareIdentifiers(board([use({ text: 'See 14.02.005.' })]))).length === 1],
  ['identifier: accepts a model-code section the product itself cites', unknownBareIdentifiers(bareIdentifiers(board([sep({ determination: 'Unchecked', text: 'The conflict is at 705.5.' })]))).length === 0],
  ['identifier: does not count the identifier inside a citation', bareIdentifiers(board([use({ text: CITE_003 })])).length === 0],
  ['identifier: not vacuous - a planted identifier is seen', bareIdentifiers(board([use({ text: 'See 14-02-005.' })])).length >= 1],
  ['identifier: the prose side has a companion count on a clean board', bareIdentifiers(board([front()])).length === 0 && [...plainText(board([use({ text: CITE_003 })])).matchAll(CITE_RE)].length === 1],
  ['title: REFUSES an invented book title', inventedTitles(titleShaped(board([use({ text: 'Bastrop Development Code' })]))).length === 1],
  ['title: ACCEPTS a title the product holds', inventedTitles(titleShaped(board([use({ text: '2018 International Building Code' })]))).length === 0],
  ['title: not vacuous - a title-shaped phrase was found', titleShaped(board([use({ text: '2018 International Building Code' })])).length === 1],
  ['paraphrase: REFUSES a requirement sentence naming the section', paraphrases(rowsOf([sep({ determination: 'Unchecked', text: 'IBC 705.5 requires a two-hour rating.' })])).length === 1],
  ['paraphrase: REFUSES one naming the book', paraphrases(rowsOf([sep({ determination: 'Unchecked', text: 'The 2018 International Building Code requires a two-hour rating.' })])).length === 1],
  ['paraphrase: ACCEPTS the reviewer\u2019s own conflict sentence', paraphrases(rowsOf([sep({ determination: 'Uncertain', author: 'reviewer', text: 'M. Leavis recorded a conflict for the west wall.' })])).length === 0],
  ['paraphrase: ACCEPTS a modal that names neither', paraphrases(rowsOf([sep({ determination: 'Unchecked', text: 'No action is required from you on this item.' })])).length === 0],
  ['paraphrase: does not fire on a quotable book', paraphrases(rowsOf([front({ text: 'The minimum front setback is 25\u2032-0\u2033.' })])).length === 0],
  ['paraphrase: not vacuous - an unquotable row was inspected', rowsOf([sep({ determination: 'Unchecked' })]).filter((r) => UNQUOTABLE.has(r.book)).length === 1],
  ['paraphrase: a row\u2019s own attributes are not read as its body', paraphrases(rowsOf([sep({ determination: 'Unchecked' })])).length === 0],
  ['paraphrase: the citation in the body is not a paraphrase', paraphrases(rowsOf([sep({ determination: 'Unchecked', text: CITE_IBC })])).length === 0],
  ['refusal: equal counts pass', refusalCountOk(1, 1) === true],
  ['refusal: REFUSES a missing refusal', refusalCountOk(1, 0) === false],
  ['refusal: REFUSES a refusal nobody owed', refusalCountOk(0, 1) === false],
  ['notice: the product\u2019s own notice ties', SCOPE.notice.corrections + SCOPE.notice.escalations + SCOPE.notice.notEvaluated + SCOPE.notice.heldBack === SCOPE.notice.total],
  ['notice: matches the product', noticeMismatch([['corrections', SCOPE.notice.corrections], ['heldBack', SCOPE.notice.heldBack]]).length === 0],
  ['notice: REFUSES a count the product contradicts', noticeMismatch([['corrections', SCOPE.notice.corrections + 1]]).length === 1],
  ['notice: REFUSES a category the product does not have', noticeMismatch([['rejections', 0]]).length === 1],
  ['absence: matches the product', absenceMismatch([['unchecked', SCOPE.coverage.axis1Corpus.unchecked]]).length === 0],
  ['absence: REFUSES a count the product contradicts', absenceMismatch([['unchecked', SCOPE.coverage.axis1Corpus.unchecked + 1]]).length === 1],
  ['absence: REFUSES an axis the product does not have', absenceMismatch([['missing', 1]]).length === 1],
  ['chip: matches the product', chipMismatch(['Fail ' + SCOPE.findings.filter((f) => f.determination === 'Fail').length]).length === 0],
  ['chip: accepts the All chip', chipMismatch(['All ' + SCOPE.findings.length]).length === 0],
  ['chip: REFUSES the draft\u2019s "Pass 1"', chipMismatch(['Pass 1']).length === 1],
  ['chip: REFUSES a count that drifted', chipMismatch(['Unchecked ' + (SCOPE.findings.filter((f) => f.determination === 'Unchecked').length + 1)]).length === 1],
  ['chip: REFUSES a chip naming nothing real', chipMismatch(['Pears 2']).length === 1],
  ['provenance: accepts the product\u2019s rung and the unbuilt top', provenanceMismatch(PROV_RE.exec('<x data-provenance="' + S.source.provenance.current + '" data-provenance-next="' + S.source.provenance.next + '" data-provenance-next-built="0">')).length === 0],
  ['provenance: REFUSES a rung the product is not on', provenanceMismatch(PROV_RE.exec('<x data-provenance="captured-reading" data-provenance-next="' + S.source.provenance.next + '" data-provenance-next-built="0">')).length === 1],
  ['provenance: REFUSES a board claiming the top rung is built', provenanceMismatch(PROV_RE.exec('<x data-provenance="' + S.source.provenance.current + '" data-provenance-next="' + S.source.provenance.next + '" data-provenance-next-built="1">')).length === 1],
  ['provenance: a missing marker is a failure, not a pass', provenanceMismatch(null).length === 1],
  ['provenance: the rungs are ordered', S.source.provenance.rungs.join('>') === 'no-input>form-assertion>captured-reading'],
  ['boards: the marker scopes the read', bodyOf('<main data-board="console">x</main>') !== null],
  ['boards: a document without the marker is not read', bodyOf('<main>x</main>') === null],
  ['text: a style block is not read as content', plainText('<style>.sc-dark{color:#fff}</style><p>ok</p>').includes('color') === false],
  ['text: an entity is not read as a word', plainText('<p>13 &middot; 14</p>').includes('middot') === false],
];

let selfFailed = 0;
if (process.env.G150_DEBUG) {
  const dbg = rowsOf([sep({ determination: 'Unchecked', text: 'No action is required from you on this item.' })]);
  console.log('DEBUG rows', JSON.stringify(dbg.map((r) => ({ book: r.book, section: r.section, rule: r.rule }))));
  console.log('DEBUG text', JSON.stringify(dbg.map((r) => plainText(r.raw.replace(REFUSAL_RE, ' ')))));
  console.log('DEBUG hits', JSON.stringify(paraphrases(dbg)));
}
for (const [label, passed] of tests) {
  if (!passed) {
    console.error('SELF-TEST FAILED: ' + label);
    selfFailed += 1;
  }
}
if (selfFailed) {
  console.error('\n' + selfFailed + ' of ' + tests.length + ' self-tests failed. The instrument is broken, so its');
  console.error('verdict on the artboards would be worthless and it does not report one.');
  process.exit(2);
}
console.log('self-tests: ' + tests.length + '/' + tests.length + ' passed, both directions where both exist');

/* ------------------------------------------------------------ the artboards */

const totals = {
  boardsRead: 0, findingRows: 0, badges: 0, liveBadges: 0, noneBadges: 0, machineRows: 0,
  adjudicatedRows: 0, uncertainRows: 0, reviewerRows: 0, citations: 0, bareIdentifiers: 0,
  titleShaped: 0, unquotableRows: 0, refusals: 0, noticeRows: 0, absenceRows: 0, chips: 0,
  provenanceLinks: 0, wholeChainPanels: 0, visibleChars: 0,
};
const undeclared = new Set(Object.keys(DECLARED));
const problems = [];
const fail = (m) => problems.push(m);
/* GATE 3 asks for the identifier extraction as a FILE with its matched-input count,
   not a reading by eye. Every identifier and every code title the built surface
   renders goes in here with the board it came from, what kind of mention it is,
   and whether source holds it. */
const extraction = [];

for (const file of boards) {
  const html = fs.readFileSync(new URL('./' + file, import.meta.url), 'utf8');
  const scope = bodyOf(html);
  if (scope === null) {
    fail(file + ': no <main data-board="..."> marker, so this board was not checked at all');
    continue;
  }
  const id = scope.id;
  const declared = DECLARED[id];
  if (!declared) {
    fail(file + ': board "' + id + '" is not declared in DECLARED, so nothing knows what it must carry');
    continue;
  }
  undeclared.delete(id);
  totals.boardsRead += 1;

  const scoped = scope.html;
  const rows = findingRows(scoped);
  const badges = rows.flatMap((r) => r.badges);
  const cites = [...plainText(scoped).matchAll(CITE_RE)].map((m) => ({ title: m[1].trim(), section: m[2], edition: m[3] }));
  const bare = bareIdentifiers(scoped);
  const titles = titleShaped(scoped);
  const notas = [...scoped.matchAll(NOTICE_RE)].map((m) => [m[1], Number(m[2])]);
  const absences = [...scoped.matchAll(ABSENCE_RE)].map((m) => [m[1], Number(m[2])]);
  const chipList = [...scoped.matchAll(CHIP_RE)].map((m) => m[1]);
  const refusals = [...scoped.matchAll(REFUSAL_RE)].map((m) => m[1]);
  const prov = PROV_RE.exec(scoped);
  const whole = /data-whole-chain="/.test(scoped);
  const unquotableRows = rows.filter((r) => r.book && UNQUOTABLE.has(r.book));
  const visible = plainText(scoped);

  const found = {
    finding: rows.length, badge: badges.length, chip: chipList.length, notice: notas.length,
    absence: absences.length, provenance: prov ? 1 : 0, wholeChain: whole ? 1 : 0, refusal: refusals.length,
  };
  for (const [marker, count] of Object.entries(found)) {
    if (count > 0 && !(marker in declared)) fail(file + ': carries ' + marker + ' markers the board is not declared to carry');
    if (count === 0 && marker in declared) fail(file + ': is declared to carry ' + marker + ' markers and carries none');
  }
  if (declared.finding === 'rows' && rows.length === 0) fail(file + ': draws no finding row, so nothing was checked on it');
  if (declared.badge === 'one-per-row' && badges.length !== rows.length) {
    fail(file + ': ' + rows.length + ' finding rows against ' + badges.length + ' badges -- a badge outside a row or a row without one');
  }
  if (visible.length < 1200) fail(file + ': under 1200 characters of visible text on the board');
  for (const r of rows) if (!DETERMINATIONS.has(r.determination)) fail(file + ': an invented determination "' + r.determination + '" on ' + r.rule);
  /* The badge, provenance and author rules read claims about SOURCE, so they run
     only on boards declared to make those claims. A board that draws a
     determination without a badge is not making a badge claim, and inventing one
     for it would be the check reading its own assumptions back. */
  if ('badge' in declared) {
    for (const r of liveBadgesWrong(rows)) fail(file + ': LIVE CHECK on ' + r.rule + ', and no adjudicator is registered for it');
    for (const r of noneBadgesWrong(rows)) fail(file + ': NO ADJUDICATOR on ' + r.rule + ', and an adjudicator IS registered for it');
    for (const m of badgeMismatch(rows)) fail(file + ': ' + m);
  }
  for (const r of machineUnadjudicatedWrong(rows)) fail(file + ': a machine ' + r.determination + ' on ' + r.rule + ', which has no adjudicator');
  for (const r of uncertainWrong(rows)) fail(file + ': an Uncertain on ' + r.rule + ' that is not a named reviewer\u2019s');
  for (const r of authorMismatch(rows)) fail(file + ': the author of ' + r.rule + ' disagrees with the product');
  for (const c of badCitations(cites)) fail(file + ': the citation "' + c.title + ' Section ' + c.section + ' (' + c.edition + ')" names a section or edition source does not hold');
  for (const t of inventedCiteTitles(visible)) fail(file + ': a citation naming a book nobody holds: "' + t + ' Section ..."');
  for (const id2 of unknownBareIdentifiers(bare)) fail(file + ': SECTION IDENTIFIER outside a citation that source does not hold: ' + id2);
  for (const t of inventedTitles(titles)) fail(file + ': a book title in the shape "<Something> Code" that source does not hold: ' + t);

  for (const c of cites) {
    extraction.push({ board: file, kind: 'citation', value: c.title + ' Section ' + c.section + ' (' + c.edition + ')',
      title: c.title, section: c.section, edition: c.edition,
      known: EDITION_IDS.has(c.edition) && knownSection(c) });
  }
  for (const id2 of bare) extraction.push({ board: file, kind: 'bare-identifier', value: id2, known: KNOWN_SECTIONS.has(id2) });
  for (const t of titles) extraction.push({ board: file, kind: 'title-shaped', value: t, known: BOOK_TITLES.some((bt) => bt.includes(t)) });
  for (const m of visible.matchAll(CITE_SHAPED_RE)) {
    const t = m[1].trim();
    extraction.push({ board: file, kind: 'citation-shaped-title', value: t, known: BOOK_TITLES.some((bt) => bt.includes(t)) });
  }
  for (const p of paraphrases(rows)) fail(file + ': PARAPHRASE of a quotable:false code -- ' + p);
  for (const [k] of absences) if (!ABSENCE_KINDS.has(k)) fail(file + ': an invented absence kind "' + k + '"');
  for (const k of absenceMismatch(absences)) fail(file + ': the ' + k + ' absence count disagrees with the product');
  if (notas.length) {
    if (notas.reduce((a, [, n]) => a + n, 0) !== Number((scoped.match(NOTICE_TOTAL_RE) || [null, -1])[1])) {
      fail(file + ': the correction notice does not tie -- counts sum to ' + notas.reduce((a, [, n]) => a + n, 0) + ', stated total ' + (scoped.match(NOTICE_TOTAL_RE) || [null, '?'])[1]);
    }
    for (const k of noticeMismatch(notas)) fail(file + ': the ' + k + ' notice count disagrees with the product');
  }
  if (declared.refusal === 'present' && !refusalCountOk(PRODUCT_UNQUOTABLE_CITED, refusals.length)) {
    fail(file + ': ' + refusals.length + ' refusal(s) for ' + PRODUCT_UNQUOTABLE_CITED + ' finding(s) citing a quotable:false book');
  }
  for (const chip of chipMismatch(chipList)) fail(file + ': the filter chip "' + chip + '" disagrees with the product');
  if (declared.provenance === 'one' && !prov) fail(file + ': states no provenance rung, and the ladder is the product');
  if ('provenance' in declared) for (const p of provenanceMismatch(prov)) fail(file + ': ' + p);
  if (whole && S.live.unreachable.coverage.wholeChain.detected !== true) {
    fail(file + ': claims a whole-chain failure collapses to one row, and the product does not collapse it');
  }

  totals.findingRows += rows.length;
  totals.badges += badges.length;
  totals.liveBadges += badges.filter((b) => b === BADGE_LIVE).length;
  totals.noneBadges += badges.filter((b) => b === BADGE_NONE).length;
  totals.machineRows += rows.filter((r) => r.author === 'machine').length;
  totals.adjudicatedRows += rows.filter((r) => adjudicatedSections.has(r.section)).length;
  totals.uncertainRows += rows.filter((r) => r.determination === 'Uncertain').length;
  totals.reviewerRows += rows.filter((r) => r.author === 'reviewer').length;
  totals.citations += cites.length;
  totals.bareIdentifiers += bare.length;
  totals.titleShaped += titles.length;
  totals.unquotableRows += unquotableRows.length;
  totals.refusals += refusals.length;
  totals.noticeRows += notas.length;
  totals.absenceRows += absences.length;
  totals.chips += chipList.length;
  totals.provenanceLinks += prov ? 1 : 0;
  totals.wholeChainPanels += whole ? 1 : 0;
  totals.visibleChars += visible.length;

  console.log('ok   ' + file + '  ' + rows.length + ' rows, ' + badges.length + ' badges, ' + cites.length +
    ' citations, ' + bare.length + ' bare identifiers, ' + titles.length + ' title-shaped, ' + absences.length +
    ' absences, ' + notas.length + ' notice rows, ' + refusals.length + ' refusals, ' + chipList.length + ' chips');
}

if (undeclared.size) fail('declared boards never appeared as artboards: ' + [...undeclared].join(', '));

/* GATE 2. A badge is a claim about source. If a second adjudicator in the registry
   does not change it, the badge is a hardcoded list and every badge above is
   unsupported. This is checked against the product's own fixture run, not a story
   about it. */
const gate2 = S.wrongWay.secondAdjudicator;
if (gate2.defaultBadgeFor008 === gate2.withSecondAdjudicatorBadgeFor008) {
  fail('GATE 2: adding an adjudicator for ' + gate2.key + ' did not change the badge, so the badge is not derived from the registry');
}
if (gate2.withSecondRegistrySize !== gate2.defaultRegistrySize + 1) {
  fail('GATE 2: the registry did not grow by one (' + gate2.defaultRegistrySize + ' -> ' + gate2.withSecondRegistrySize + ')');
}
if (gate2.defaultBadgeFor008 !== BADGE_NONE || gate2.withSecondAdjudicatorBadgeFor008 !== BADGE_LIVE) {
  fail('GATE 2: the badge went ' + gate2.defaultBadgeFor008 + ' -> ' + gate2.withSecondAdjudicatorBadgeFor008 + ', and the wrong-way read expects NO ADJUDICATOR -> LIVE CHECK');
}
/* GATE 2's other half: the wrong way through the contract must have thrown, and it
   must have thrown for the stated reason rather than because something unrelated
   broke. */
const EXPECTED_THROWS = {
  noAdjudicatorCannotPass: 'no_adjudicator_cannot_pass_or_fail',
  machineUncertain: 'uncertain_not_machine_derived',
  paraphraseOfUnquotableCode: 'paraphrase_of_unquotable_code',
  absenceRequired: 'absence_required',
};
for (const [key, code] of Object.entries(EXPECTED_THROWS)) {
  const w = S.wrongWay[key];
  if (!w || w.threw !== true) fail('GATE 2: the product accepted ' + key + ', which the design forbids');
  else if (w.code !== code) fail('GATE 2: ' + key + ' threw "' + w.code + '" and the contract names "' + code + '"');
}
/* GATE 3's other half: the whole-chain collapse must be real, or the coverage
   board's claim about it is unsupported. */
if (S.live.unreachable.coverage.wholeChain.detected !== true || S.live.unreachable.coverage.wholeChain.collapsesTo !== 1) {
  fail('GATE 3: the product did not collapse a whole-chain failure of ' +
    S.live.unreachable.coverage.wholeChain.affectedRows + ' rows to one, so the coverage board\u2019s claim is unsupported');
}
if (!(S.live.unreachable.rowCountBeforeCollapse > S.live.unreachable.coverage.wholeChain.collapsesTo)) {
  fail('GATE 3: the collapse reports ' + S.live.unreachable.coverage.wholeChain.collapsesTo + ' of ' + S.live.unreachable.rowCountBeforeCollapse + ' rows, which is not a collapse');
}

console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));

const unknown = extraction.filter((e) => !e.known);
const byKind = extraction.reduce((a, e) => ((a[e.kind] = (a[e.kind] || 0) + 1), a), {});
/*
 * A run that changes nothing must not rewrite canon. The design gate and the
 * exits instrument both run check.mjs, so an unconditional write made a plain
 * measurement churn a tracked file (OPS-17 A-159). Compare the report with its
 * generatedAt removed and rewrite only when the measured body actually changed;
 * violate.mjs still finds the file it needs, because a real change writes one.
 */
function writeReportIfChanged(url, serialized) {
  let prev = null;
  try { prev = fs.readFileSync(url, 'utf8'); } catch { prev = null; }
  const strip = (text) => {
    try {
      const o = JSON.parse(text);
      if (!o || typeof o !== 'object' || Array.isArray(o)) return text;
      delete o.generatedAt;
      return JSON.stringify(o);
    } catch { return text; }
  };
  if (prev !== null && strip(prev) === strip(serialized)) {
    console.log('report body unchanged; ' + String(url).split('/').pop() + ' left as written');
    return;
  }
  fs.writeFileSync(url, serialized);
}

writeReportIfChanged(
  new URL('./identifier-extraction.json', import.meta.url),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      commit: S.commit,
      ref: S.ref,
      boards: boards,
      matchedInputs: byKind,
      totals: { extracted: extraction.length, unknown: unknown.length, ...totals },
      unknown,
      extraction,
    },
    null,
    2,
  ) + '\n',
);
console.log('identifier extraction: ' + extraction.length + ' entries (' +
  Object.entries(byKind).map(([k, v]) => k + '=' + v).join(', ') + '), ' + unknown.length +
  ' absent from source -> identifier-extraction.json');

const MUST_HAVE_INPUTS = ['boardsRead', 'findingRows', 'badges', 'liveBadges', 'noneBadges', 'machineRows',
  'reviewerRows', 'citations', 'bareIdentifiers', 'titleShaped', 'unquotableRows', 'refusals', 'noticeRows',
  'absenceRows', 'chips', 'provenanceLinks', 'wholeChainPanels'];
const vacuous = MUST_HAVE_INPUTS.filter((k) => totals[k] === 0);

/* Order matters. A violation is reported first because it is specific and
   actionable, and a run with violations already fails closed. The refusal is the
   last resort: it exists so a CLEAN run that read nothing cannot report PASS. */
if (problems.length) {
  console.error('');
  for (const p of problems) console.error('FAIL ' + p);
  console.error('\n' + problems.length + ' violation(s).');
  process.exit(1);
}
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard -- ' +
    vacuous.join(', ') + '. A predicate with no inputs has not passed, it has not run.');
  process.exit(2);
}
console.log('PASS ' + boards.length + ' artboards, ' + totals.findingRows + ' finding rows and ' + totals.citations +
  ' citations read, every claim traced to commit ' + S.commit.slice(0, 12) + '.');
