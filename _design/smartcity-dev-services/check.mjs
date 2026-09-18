/**
 * Adversarial read, as a file rather than a habit.
 *
 * `node check.mjs` after `node gen.mjs`. Non-zero exit on any violation.
 *
 * `node check.mjs --dir <path>` reads ANOTHER COPY of the surface instead of the
 * artboards in this folder: the built product's own markup, as
 * scripts/export-dev-services-lens.mjs writes it (a file, or a directory of
 * them). fixture-rows.json is read from THIS folder either way, because it is
 * the record the canvas rows are checked against and a copy of the surface must
 * not be able to bring its own. Added by G-154, mirroring the `--dir` G-156
 * added to the finance-lens check, so that this ratified instrument can be
 * pointed at what the product actually renders.
 *
 * WHY THIS EXISTS. Four defects reached this folder and survived a review
 * pass. None was catchable by re-reading the canvas; each was found only by
 * comparing the canvas against a second, independently derived source:
 *
    16| *   1. The tab strip carried EIGHT tabs including Place. The product has seven
 *      and never had Place; the map became a dock rail instead. A city would
 *      have approved a tab we ruled against building.
 *   2. The Manager load strip named five people who appear in no source in
 *      either repository. Invented staff on a workload ranking is fabrication;
 *      real staff on one is not ours to publish to their employer.
 *   3. The licence rows were in the wrong ORDER. Within a status band the sort
 *      is by expiry offset, a seeded random draw, not by record id. Ids, refs,
 *      statuses, rungs and types were all correct, which is exactly why this
    25| *      one would never have been noticed by looking at the canvas.
 *   4. Three residents were named on the Pipeline artboard, initialised and
 *      placed beside their addresses.
 *
 * Each check self-tests in BOTH directions before it runs against the
 * artboards, because a check observed only passing has not been observed
 * working. The self-tests are the first thing that runs and they abort the file.
 */
import fs from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Verified against smartcity-dashboards origin/main f776b4bf, web/index.html,
 * on 2026-09-15: DS_TABS and TAB_LABELS agree on these seven, in this order.
 * Re-read the product before changing this list; do not edit it to make a
 * canvas pass.
 *
 * G-154 re-read it at the shipped surface for this lane, origin/main fd8562c2,
 * and it is unchanged: src/staff-review.mjs still carries these seven and
 * web/index.html's tab strip still draws these seven in this order.
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

/**
 * The same mapping for the BUILT surface, which puts all five regions in one
 * document and distinguishes them by container id instead of by file name.
 * Derived from the region ids src/ds-render.test.mjs derives from the registry,
 * not hand-guessed.
 */
const FIXTURE_REGIONS = {
  'ds-insp-rows': 'inspections',
  'ds-ce-rows': 'code',
  'ds-lic-rows': 'licences',
};

const TAB = /padding:var\(--sc-2\) 0 10px[^>]*><span[^>]*>([^<]*)<\/span>/g;
const LOAD = /font:600 13px\/18px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]*)<\/span>/g;
const RECORD = /FIX-(?:IN|CE|BL)-\d{4}/g;
const CELL = /font:400 13px\/18px var\(--sc-font-(?:ui|data)\); color:var\(--sc-ink(?:-2)?\);">([^<]*)<\/span>/g;

/**
 * THE BUILT FORM. The product does not render the artboards' inline style
 * strings: web/index.html draws the tab strip as `<a data-tab="...">`, the load
 * strip's heading as static markup and its cells as `<span class="who">`, and
 * web/app.js writes table cells with textContent. A check that read only the
 * artboard's form against a built file would find no tabs, no load cells and no
 * cells at all, and would pass on all four rules at once. Both forms are read,
 * and the artboard's own form is untouched by these lines.
 */
const TABS_BUILT = /data-tab="([a-z-]+)"[^>]*>([^<]*)</g;
const LOADHEAD_BUILT = /class="loadstrip-head" id="ds-[a-z]+-load-head"[^>]*>\s*<span class="t">([^<]*)</g;
const LOAD_BUILT = /<span class="who">([^<]*)</g;
const CELL_BUILT = /(?:<td[^>]*>([^<]*)<\/td>)|(?:<span class="t-data">([^<]*)<\/span>)/g;
const ROWID_BUILT = /<td class="id">([^<]*)<\/td>/g;

/**
 * A person, in the shapes this capture produces: "D. Moore",
 * "R. Garner-Lozoya", "DEBORAH MOORE". A business is not matched, which is the
 * distinction that matters -- a business on a permit is a public commercial
 * record and naming one names no person.
 *
 * G-154, and this predicate's limit is now MEASURED rather than assumed: the
 * capture's own PII string, "DEBORAH MOORE, PH#737-762-6252", is NOT matched by
 * it, because the phone number and the comma defeat every shape in the
 * alternation. src/dev-services-naming.test.mjs asserts that in the product. So
 * this rule still refuses what it can see, and the product does not rely on it:
 * the live mappers refuse the whole field. See the ORDER AND NAMING rules below.
 */
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;

/**
 * G-154. THE EXCLUSION SET, AND IT IS PART OF THIS RULE'S CONTRACT.
 *
 * The all-caps alternation in PERSON exists to catch "DEBORAH MOORE", and it
 * matches ANY two all-caps tokens. Live bastrop_tx permits carry a situs that is
 * nothing but the state and country suffix - "TX USA", no street and no city -
 * and on 2026-09-18 the rule reported `table cells name people [TX USA]` on the
 * live surface. Four rows whose address is a bare sentinel, and not one person
 * named anywhere in the document. This is the same bare-situs class P-214 and X9
 * already record in this program.
 *
 * A cell that is ENTIRELY US state abbreviations and/or "USA" is a situs
 * sentinel, not a name. The exclusion is deliberately narrow - it names the
 * vocabulary rather than relaxing the name shapes, so "DEBORAH MOORE" and
 * "DANA MOORE" still match and this cannot quietly become the hole a real name
 * walks through. Both directions are asserted below.
 */
const US_STATE = new Set(
  (
    'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT ' +
    'NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC PR'
  ).split(' '),
);
const TWO_CAPS = /^[A-Z]{2,}(?:\s+[A-Z]{2,})+$/;
function isSitusSentinel(cell) {
  const t = String(cell).trim();
  if (!TWO_CAPS.test(t)) return false;
  return t.split(/\s+/).every((w) => w === 'USA' || US_STATE.has(w));
}

/**
 * The relative expiry phrasing the Licenses artboard draws and
 * src/domains/business-licenses.mjs generates. The ORDER rule below is the one
 * rule that reads a rendered VALUE rather than a structure, because the order is
 * a property of the values: "within a status band the sort is by expiry offset".
 */
const EXPIRY_LABEL = /^(expires today|expires in (\d+) days?|expired (\d+) days? ago)$/;

const tabLabels = (html) => [...html.matchAll(TAB)].map((m) => m[1]);
const tabLabelsBuilt = (html) => [...html.matchAll(TABS_BUILT)].map((m) => m[2]);
const loadCells = (html) => [...html.matchAll(LOAD)].map((m) => m[1]);
const loadHeadsBuilt = (html) => [...html.matchAll(LOADHEAD_BUILT)].map((m) => m[1]);
const loadCellsBuilt = (html) => [...html.matchAll(LOAD_BUILT)].map((m) => m[1]);
const recordIds = (html) => html.match(RECORD) || [];
const tableCells = (html) => [...html.matchAll(CELL)].map((m) => m[1]);
const tableCellsBuilt = (html) =>
  [...html.matchAll(CELL_BUILT)].map((m) => (m[1] ?? m[2] ?? '').trim()).filter((c) => c !== '');
const peopleInCells = (html) => tableCells(html).filter((c) => PERSON.test(c.trim()) && !isSitusSentinel(c));
const peopleInCellsBuilt = (html) =>
  tableCellsBuilt(html).filter((c) => PERSON.test(c.trim()) && !isSitusSentinel(c));

const tabsOk = (html) => {
  const found = tabLabels(html);
  return found.length === SHIPPED_TABS.length && found.every((t, i) => t === SHIPPED_TABS[i]);
};
const tabsOkBuilt = (html) => {
  const found = tabLabelsBuilt(html);
  return found.length === SHIPPED_TABS.length && found.every((t, i) => t === SHIPPED_TABS[i]);
};
const namesOk = (html) =>
  loadCells(html).every((c) => LOAD_TITLES.includes(c) || REF.test(c));
/** A built file's headings and cells are two different readers; both must hold. */
const namesOkBuilt = (html) =>
  loadHeadsBuilt(html).every((h) => LOAD_TITLES.includes(h)) &&
  loadCellsBuilt(html).every((c) => REF.test(c));
/** The rendered ids must be the fixture's own ids, in the fixture's own order. */
const rowsOk = (html, expected) => {
  const found = recordIds(html);
  return found.length === expected.length && found.every((id, i) => id === expected[i]);
};
/** The ids inside one region's queue, in the order the product rendered them. */
const regionIds = (html, containerId) => {
  const start = html.indexOf(`id="${containerId}"`);
  if (start < 0) return null;
  const end = html.indexOf('</tbody>', start);
  const slice = html.slice(start, end < 0 ? undefined : end);
  return [...slice.matchAll(ROWID_BUILT)].map((m) => m[1]);
};
/** The same slice, read for the expiry values the order rule needs. */
const regionCells = (html, containerId) => {
  const start = html.indexOf(`id="${containerId}"`);
  if (start < 0) return null;
  const end = html.indexOf('</tbody>', start);
  return tableCellsBuilt(html.slice(start, end < 0 ? undefined : end));
};

/**
 * THE REFUSED COLUMNS, READ BY HEADER RATHER THAN BY CELL SHAPE (G-154).
 *
 * WHY SHAPE IS NOT ENOUGH HERE, and this is measured rather than supposed. The
 * people rule above reads the SHAPE of a cell, and it missed a planted
 * "Dana Whitfield" while catching the capture's own "DEBORAH MOORE". The reason
 * is the same trade-off the design already ratified and the self-tests already
 * assert: a Title Case two-word name and a two-word business are one shape, and
 * `people: ALLOWS a one-word business` requires "Bluebonnet Electric" to pass.
 * Widening the shape to catch the name was tried and rejects the design's own
 * artboards, flagging eight cells that are permit types and utility names
 * ("Residential Addition", "Bluebonnet Electric", "No Water"). A shape rule
 * cannot settle this, which is exactly why src/record-identity.mjs refuses the
 * field instead of classifying it.
 *
 * WHAT IS CHECKABLE is narrower and stronger: these are the columns whose source
 * field is refused at the mapper, so a cell in one may hold an opaque reference
 * or nothing at all and may never hold free text. That holds for a name of any
 * shape, length or language, and for the phone-number-bearing strings that
 * defeat the shape rule. The headers below are the ones the product renders, and
 * the reference vocabulary is src/record-identity.mjs's own REF_PREFIX, APP
 * included because the load strip's REF draws no permit dimension.
 *
 * KEYING ON THE HEADER is also what keeps the rule honest: if a surface stops
 * drawing one of these columns the rule has no input, and the run REFUSES A
 * VERDICT instead of passing on a reader that saw nothing.
 */
const PERSON_COLUMNS = ['Applicant', 'Inspector', 'Officer', 'Subject'];
const COLUMN_REF = /^(APP|HLD|OFF|INS|MGR)-\d{2,}$/;

/** Every queue table on a built surface: its body id, its headers, its rows' cells. */
const queueTablesBuilt = (html) => {
  const tables = [];
  for (const t of html.matchAll(/<table class="dt">([\s\S]*?)<tbody id="([^"]+)">([\s\S]*?)<\/tbody>/g)) {
    const heads = [...t[1].matchAll(/<th scope="col">([^<]*)<\/th>/g)].map((m) => m[1].trim());
    const rows = [...t[3].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
      [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1].replace(/<[^>]*>/g, '').trim()),
    );
    tables.push({ bodyId: t[2], heads, rows });
  }
  return tables;
};

/** Which of the refused columns this surface actually draws. */
const refusedColumnsDrawn = (html) => {
  const drawn = new Set();
  for (const table of queueTablesBuilt(html)) {
    for (const name of PERSON_COLUMNS) if (table.heads.includes(name)) drawn.add(name);
  }
  return PERSON_COLUMNS.filter((n) => drawn.has(n));
};

/**
 * Every cell in a refused column that holds something which is neither empty nor
 * a reference, reported as `Column="value"` so a failure names the defect.
 */
const freeTextInRefusedColumns = (html) => {
  const found = [];
  for (const table of queueTablesBuilt(html)) {
    for (const name of PERSON_COLUMNS) {
      const at = table.heads.indexOf(name);
      if (at < 0) continue;
      for (const cells of table.rows) {
        const value = cells[at];
        if (value === undefined || value === '' || COLUMN_REF.test(value)) continue;
        found.push(`${name}="${value}"`);
      }
    }
  }
  return found;
};

/** How many cells the refused-column rule actually read, so it cannot pass on none. */
const refusedColumnCells = (html) => {
  let n = 0;
  for (const table of queueTablesBuilt(html)) {
    for (const name of PERSON_COLUMNS) {
      if (table.heads.includes(name)) n += table.rows.length;
    }
  }
  return n;
};

/**
 * The offset a rendered expiry label states, or null when the cell is not a
 * label at all. Null is what makes the ORDER rule refuse a surface that renders
 * a bare calendar date where the artboard draws a relative phrase.
 */
function expiryOffsetOf(label) {
  const m = EXPIRY_LABEL.exec(String(label).trim());
  if (!m) return null;
  if (m[1] === 'expires today') return 0;
  return m[2] ? Number(m[2]) : -Number(m[3]);
}

/**
 * THE ROLL, READ ROW BY ROW, BECAUSE THE DESIGN'S ORDER IS BAND-MAJOR (G-154).
 *
 * The roll's order is the product's own compareLicenseRoll - src/domains/
 * business-licenses.mjs, exported precisely so the fixture generator and the live
 * compose cannot drift: status severity FIRST, then the expiry offset within that
 * band, then the record id. Reading the rendered expiry labels alone, which is
 * what this rule did until 2026-09-18, therefore cannot decide the rule it claims
 * to decide. It FAILED the live bastrop_tx surface for being correct: a revoked
 * licence carrying a July-2021 expiry sits after the active band BY DESIGN, so its
 * offset is legitimately lower than the block before it, and a rule demanding
 * globally non-decreasing offsets reports that as a break.
 *
 * Measured on the live surface, the rendered roll is expired (18 rows, offsets
 * -1866..-1262) then active (5, undated) then revoked (1, -1511) then completed
 * (26, undated) - which is compareLicenseRoll's order exactly.
 *
 * Read as rows the rule is STRONGER than before, not weaker: the bands must
 * appear in the design's severity order AND the offsets must be non-decreasing
 * within a band. The old form checked only the second half and only by accident.
 */
/**
 * The band ranks are the PRODUCT'S OWN severity vocabulary, read from
 * src/adapters.mjs LICENSE_STATUS_VALUES and src/domains/business-licenses.mjs
 * severityRank - not a list invented here:
 *
 *   expired -> crit, expiring -> warn, renewal-submitted -> info, active -> ok,
 *   and EVERYTHING ELSE -> quiet.
 *
 * THE LAST CLAUSE IS THE ONE THAT MATTERS AND THE ONE I GOT WRONG FIRST. On the
 * live feed most licences carry a vendor status the vocabulary does not name -
 * "revoked", "completed" - and severityRank maps every one of them to the SAME
 * rank, quiet. Giving each unknown status its own successive rank made the rule
 * report a break wherever two of them interleaved, which on bastrop_tx is most
 * of the roll. Unknown is one rank, shared, and last.
 */
const LICENCE_SEVERITY = ['expired', 'expiring', 'renewal-submitted', 'active'];
const QUIET_RANK = LICENCE_SEVERITY.length;
const bandRank = (band) => {
  const at = LICENCE_SEVERITY.indexOf(String(band ?? '').trim().toLowerCase());
  return at < 0 ? QUIET_RANK : at;
};
const BARE_DATE = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;

/** Each rendered licence row as { band, label, offset, bare }, or null with no queue. */
const licenceRollBuilt = (html) => {
  const table = queueTablesBuilt(html).find((t) => t.bodyId === 'ds-lic-rows');
  if (!table) return null;
  const text = table.rows.map((cells) => cells.map((c) => String(c).trim()));
  /**
   * The expiry column is found by CONTENT, not by header name, because the two
   * packs name it differently. The Issued column also holds bare dates on the
   * live feed, so a bare-date check that scanned every cell would fire on the
   * wrong column.
   */
  const dated = text.findIndex((cells) => cells.some((c) => EXPIRY_LABEL.test(c)));
  return text.map((cells) => {
    const label = cells.find((c) => EXPIRY_LABEL.test(c)) || null;
    const band = cells.find((c) => bandRank(c) < QUIET_RANK) || null;
    const bare = dated >= 0 && BARE_DATE.test(cells[dated] || '') ? cells[dated] : null;
    return { band, label, bare, offset: label ? expiryOffsetOf(label) : null };
  });
};

/**
 * Band-major, then non-decreasing offsets within a band. Refuses a roll that
 * carries no dated row rather than passing it, and refuses a bare calendar date
 * standing where the design draws a relative phrase.
 */
function orderOk(roll) {
  if (!Array.isArray(roll) || roll.length === 0) return false;
  if (roll.some((r) => r.bare)) return false;
  if (!roll.some((r) => r.offset !== null)) return false;
  let prevRank = -1;
  let prevOffset = null;
  for (const row of roll) {
    const rank = bandRank(row.band);
    if (rank < prevRank) return false;
    if (rank !== prevRank) prevOffset = null;
    if (row.offset !== null) {
      if (prevOffset !== null && row.offset < prevOffset) return false;
      prevOffset = row.offset;
    }
    prevRank = rank;
  }
  return true;
}

/** The label form, kept for the self-tests that assert the offset reader itself. */
function orderOkLabels(labels) {
  return orderOk(labels.map((l) => ({ band: null, label: l, bare: null, offset: expiryOffsetOf(l) })));
}

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

/** The built form of the same four, in the product's own markup. */
const builtTabs = (labels) =>
  labels.map((l) => `<a role="tab" aria-selected="false" data-tab="${l.toLowerCase().replace(/ /g, '-')}" href="/?lens=development-services&amp;tab=x">${l}</a>`).join('');
const builtRegion = (containerId, rows) =>
  `<table><tbody id="${containerId}">${rows
    .map((r) => `<tr><td class="id">${r.id}</td><td class="subj">${r.subj || 'x'}</td><td>Fixture Ridge Block 4, Lot 25</td><td class="t-data">${r.extra || ''}</td></tr>`)
    .join('')}</tbody></table>`;
/** A queue table in the product's own form: `th scope="col"` heads, then rows of tds. */
const builtQueue = (containerId, heads, rows) =>
  `<table class="dt"><thead><tr>${heads
    .map((h) => `<th scope="col">${h}</th>`)
    .join('')}</tr></thead><tbody id="${containerId}">${rows
    .map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table>`;
const builtLoad = (head, refs) =>
  `<div class="loadstrip-head" id="ds-insp-load-head"><span class="t">${head}</span></div><div class="loadstrip-body" id="ds-insp-load">${refs
    .map((r) => `<div class="loadcard"><span class="who">${r}</span></div>`)
    .join('')}</div>`;

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
  /**
   * G-154. The limit of the shape rule, asserted rather than assumed: the
   * capture's own PII string defeats it. This is why the product refuses the
   * field instead of testing it, and why a green people-rule on a surface is not
   * on its own evidence that no resident is named.
   */
  ['people: the shape rule MISSES the capture string, which is why the product refuses the field', PERSON.test('DEBORAH MOORE, PH#737-762-6252') === false],
  /**
   * G-154, found on LIVE bastrop_tx data. A bare situs sentinel is not a person,
   * and an all-caps name still is. Without the first, the rule reports a person
   * on every row whose address is "TX USA"; without the second, the exclusion
   * would be a hole rather than a fix.
   */
  ['people: a bare situs sentinel of state codes is NOT a name (live bastrop_tx carries "TX USA")', isSitusSentinel('TX USA') === true && peopleInCellsBuilt('<td>TX USA</td>').length === 0],
  ['people: a single state code is not treated as a sentinel phrase', isSitusSentinel('TX') === false],
  ['people: the sentinel exclusion did NOT widen into a hole - an all-caps name is still refused', peopleInCellsBuilt('<td>DEBORAH MOORE</td>').length === 1],
  ['people: a name ENDING in a state code is still a name, not a sentinel', isSitusSentinel('DANA MOORE') === false && peopleInCellsBuilt('<td>DANA MOORE</td>').length === 1],
  ['people: an all-caps business is not mistaken for a sentinel', isSitusSentinel('LONE STAR HVAC') === false],
  /**
   * G-154. The built surface's own markup, in both directions, and the vacuity
   * rules. Without these the bridge could be pointed at a built file and quietly
   * check nothing: no tabs read, no load cells read, no cells read, exit 0.
   */
  ['built: accepts the shipped seven in the product’s tab form', tabsOkBuilt(builtTabs(SHIPPED_TABS)) === true],
  ['built: REFUSES an eighth tab in the product’s tab form', tabsOkBuilt(builtTabs([SHIPPED_TABS[0], 'Place', ...SHIPPED_TABS.slice(1)])) === false],
  ['built: REFUSES a short strip in the product’s tab form', tabsOkBuilt(builtTabs(SHIPPED_TABS.slice(0, 5))) === false],
  ['built: the tab extractor reads seven from the product’s form', tabLabelsBuilt(builtTabs(SHIPPED_TABS)).length === 7],
  ['built: accepts a heading with opaque refs', namesOkBuilt(builtLoad('Inspector load', ['INS-01', 'INS-02'])) === true],
  ['built: REFUSES a person in the load strip', namesOkBuilt(builtLoad('Manager load', ['R. McBain'])) === false],
  ['built: REFUSES a heading the lens does not have', namesOkBuilt(builtLoad('Officer workload', ['OFF-01'])) === false],
  ['built: the load extractor is not vacuous', loadCellsBuilt(builtLoad('Inspector load', ['INS-01'])).length === 1 && loadHeadsBuilt(builtLoad('Inspector load', ['INS-01'])).length === 1],
  ['built: the cell extractor reads a plain td and a t-data span', tableCellsBuilt('<td class="id">23-000005</td><td><span class="t-data">expires today</span></td>').length === 2],
  ['built: the cell extractor is not vacuous', tableCellsBuilt('<p>nothing here</p>').length === 0],
  ['built: REFUSES a person in a built cell', peopleInCellsBuilt('<td class="subj">R. Garner-Lozoya</td>').length === 1],
  ['built: ALLOWS a reference in a built cell', peopleInCellsBuilt('<td class="t-data">APP-01</td>').length === 0],
  /**
   * G-154, the refused-column rule, both directions. The shape rule and this one
   * are asserted against the SAME planted name, because the whole reason this
   * rule exists is that the other one cannot see it.
   */
  ['columns: the shape rule MISSES a Title Case name, which is why this rule exists', peopleInCellsBuilt(builtQueue('ds-pipeline-rows', ['Applicant'], [['Dana Whitfield']])).length === 0],
  ['columns: REFUSES that same name in the Applicant column', freeTextInRefusedColumns(builtQueue('ds-pipeline-rows', ['Applicant'], [['Dana Whitfield']])).length === 1],
  ['columns: REFUSES a name in any refused column', freeTextInRefusedColumns(builtQueue('ds-insp-rows', ['Inspector'], [['Marcus Delacroix-Whitfield']])).length === 1],
  ['columns: REFUSES the capture string the shape rule cannot see', freeTextInRefusedColumns(builtQueue('ds-pipeline-rows', ['Applicant'], [['DEBORAH MOORE, PH#737-762-6252']])).length === 1],
  ['columns: ALLOWS an empty cell, which is a stated refusal', freeTextInRefusedColumns(builtQueue('ds-pipeline-rows', ['Applicant'], [['']])).length === 0],
  ['columns: ALLOWS an opaque reference', freeTextInRefusedColumns(builtQueue('ds-insp-rows', ['Inspector'], [['INS-01']])).length === 0],
  ['columns: ALLOWS a reference past two digits', freeTextInRefusedColumns(builtQueue('ds-pipeline-rows', ['Applicant'], [['APP-101']])).length === 0],
  ['columns: reads only the refused columns, not their neighbours', freeTextInRefusedColumns(builtQueue('ds-pipeline-rows', ['Type'], [['Bluebonnet Electric']])).length === 0],
  ['columns: not vacuous - it reports the columns the surface draws', refusedColumnsDrawn(builtQueue('ds-pipeline-rows', ['Permit #', 'Applicant'], [['x']])).join(',') === 'Applicant'],
  ['columns: not vacuous - it read one cell', refusedColumnCells(builtQueue('ds-pipeline-rows', ['Applicant'], [['']])) === 1],
  ['columns: a column the surface does not draw yields no drawn columns', refusedColumnsDrawn(builtQueue('ds-pipeline-rows', ['Permit #'], [['x']])).length === 0],
  ['columns: not vacuous - the queue reader found the table and its row', queueTablesBuilt(builtQueue('ds-pipeline-rows', ['Applicant'], [['x']]))[0].rows.length === 1],
  ['columns: the queue reader ignores a table that is not a queue', queueTablesBuilt('<table><tbody id="ds-other-rows"><tr><td>x</td></tr></tbody></table>').length === 0],
  ['built: the region reader scopes to one queue', regionIds(builtRegion('ds-lic-rows', [{ id: 'FIX-BL-1006' }]), 'ds-lic-rows').length === 1],
  ['built: the region reader refuses a container that is not there', regionIds(builtRegion('ds-lic-rows', []), 'ds-other-rows') === null],
  ['order: accepts the roll in expiry order within one band', orderOkLabels(['expired 34 days ago', 'expires in 7 days', 'expires in 45 days']) === true],
  ['order: REFUSES two rows swapped inside a band', orderOkLabels(['expires in 7 days', 'expired 34 days ago']) === false],
  ['order: REFUSES a bare calendar date where a relative phrase belongs', orderOk([{ band: 'expired', label: null, bare: '2027-03-01', offset: null }, { band: 'expired', label: 'expired 34 days ago', bare: null, offset: -34 }]) === false],
  ['order: REFUSES an empty roll rather than passing it', orderOk([]) === false],
  ['order: REFUSES a roll carrying no dated row', orderOk([{ band: 'active', label: null, bare: null, offset: null }]) === false],
  /**
   * G-154, found on LIVE bastrop_tx. The roll is BAND-MAJOR: severity first, then
   * the offset. A revoked licence legitimately carries a lower offset than the
   * active block before it, so the band-blind rule this replaces failed a correct
   * live surface. Both directions, so the band awareness cannot become a hole.
   */
  ['order: ACCEPTS the live bastrop_tx shape - bands in severity order, offsets only decreasing within a band', orderOk([
    { band: 'Expired', label: 'expired 1866 days ago', bare: null, offset: -1866 },
    { band: 'Expired', label: 'expired 1262 days ago', bare: null, offset: -1262 },
    { band: 'Active', label: null, bare: null, offset: null },
    { band: 'revoked', label: 'expired 1511 days ago', bare: null, offset: -1511 },
    { band: 'completed', label: null, bare: null, offset: null },
  ]) === true],
  ['order: REFUSES a band that moves backwards in severity', orderOk([
    { band: 'revoked', label: 'expired 1511 days ago', bare: null, offset: -1511 },
    { band: 'expired', label: 'expired 1866 days ago', bare: null, offset: -1866 },
  ]) === false],
  ['order: REFUSES an offset that decreases INSIDE one band', orderOk([
    { band: 'expired', label: 'expired 1866 days ago', bare: null, offset: -1866 },
    { band: 'expired', label: 'expired 1262 days ago', bare: null, offset: -1262 },
    { band: 'expired', label: 'expired 1511 days ago', bare: null, offset: -1511 },
  ]) === false],
  ['order: is not vacuous - it reads three offsets', ['expired 34 days ago', 'expires today', 'expires in 1 day'].map(expiryOffsetOf).join(',') === '-34,0,1'],
  ['order: not vacuous - the roll reader scopes to the licence queue body', (() => {
    const h = '<table class="dt"><thead><tr><th scope="col">Licence</th></tr></thead><tbody id="ds-lic-rows"><tr><td>expired 3 days ago</td></tr></tbody></table>';
    return licenceRollBuilt(h)?.length === 1 && licenceRollBuilt(h)?.[0]?.offset === -3;
  })()],
  ['order: the roll reader refuses a surface with no licence queue', licenceRollBuilt('<table class="dt"><thead><tr><th scope="col">x</th></tr></thead><tbody id="ds-other-rows"><tr><td>y</td></tr></tbody></table>') === null],
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

/**
 * G-154. WHICH SURFACE IS READ. Default: the six artboards in this folder. With
 * `--dir <path>`: another copy of the surface - a file, or a directory of
 * .dc.html files - which is how this instrument is pointed at what the product
 * renders. fixture-rows.json is NOT read from there: it is the record the canvas
 * rows are checked against, and a surface must not arrive with its own.
 */
const di = process.argv.indexOf('--dir');
let target = null;
if (di >= 0) {
  const value = process.argv[di + 1];
  if (!value || value.startsWith('--')) {
    console.error('\nREFUSING A VERDICT: --dir needs a path.');
    process.exit(2);
  }
  if (!fs.existsSync(value)) {
    console.error(`\nREFUSING A VERDICT: ${value} does not exist, so there is no surface to read.`);
    process.exit(2);
  }
  target = value;
}

const built = Boolean(target);
const sourceDir = target || fileURLToPath(here);
const files = (target && fs.statSync(target).isFile()
  ? [target]
  : fs.readdirSync(sourceDir).filter((f) => f.endsWith('.dc.html')).sort().map((f) => join(sourceDir, f))
);
if (!files.length) {
  console.error(`no artboards in ${sourceDir}. Run \`node gen.mjs\` first.`);
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
/** What the rules actually READ, so a pass cannot be a pass on nothing. */
const matched = { tabs: 0, loadCells: 0, cells: 0, rows: 0, licences: 0, refusedCells: 0 };
const unexercised = new Set();
const empty = [];

for (const reader of files) {
  const file = reader.split(/[\\/]/).pop();
  const html = fs.readFileSync(reader, 'utf8');
  const problems = [];

  if (built) {
    /* ------------------------------------------------------- built surface */

    const tabs = tabLabelsBuilt(html);
    matched.tabs += tabs.length;
    if (!tabsOkBuilt(html)) problems.push(`tab strip is [${tabs.join(', ')}]`);

    const heads = loadHeadsBuilt(html);
    const who = loadCellsBuilt(html);
    matched.loadCells += who.length;
    if (!namesOkBuilt(html)) {
      const strays = [...who.filter((c) => !REF.test(c)), ...heads.filter((h) => !LOAD_TITLES.includes(h))];
      problems.push(`load strip names [${strays.join(', ')}]`);
    }

    const cells = tableCellsBuilt(html);
    matched.cells += cells.length;
    if (cells.length === 0) {
      unexercised.add('naming');
    } else {
      const named = peopleInCellsBuilt(html);
      if (named.length) problems.push(`table cells name people [${[...new Set(named)].join(', ')}]`);
    }

    /**
     * THE REFUSED-COLUMN RULE. The shape reader above is kept as a second net -
     * it catches the all-caps and initialled names in one pass - but it cannot
     * see the shape a live feed is likeliest to carry, so the columns whose
     * source field is refused at the mapper are read by header instead. All four
     * are present on every built export of this lens; if one disappears the rule
     * has lost its input and says so rather than passing.
     */
    const drawn = refusedColumnsDrawn(html);
    matched.refusedCells += refusedColumnCells(html);
    if (drawn.length !== PERSON_COLUMNS.length) {
      unexercised.add('refused columns');
    } else {
      const stray = freeTextInRefusedColumns(html);
      if (stray.length) {
        problems.push(`a refused column carries free text [${[...new Set(stray)].join(', ')}]`);
      }
    }

    /**
     * THE ORDER RULE. Scoped to the Licenses queue, and it reads the rendered
     * expiry labels rather than the fixture ids, because these two surfaces are
     * read on different packs and the ids legitimately differ: fixture-rows.json
     * is the bastrop_tx generator at seed 0, and the export carries whichever
     * pack it was told to export. The ORDER is the property that must hold on
     * both, and it is the property four of the seven defects were about.
     *
     * A region that is not on the surface does not silently satisfy this: the
     * licences queue is present on every built export of this lens.
     */
    const roll = licenceRollBuilt(html);
    if (roll === null) {
      problems.push('the Licenses queue (#ds-lic-rows) is not on this surface, so its order was not read');
    } else {
      const dated = roll.filter((r) => r.offset !== null);
      matched.licences += dated.length;
      if (dated.length === 0) {
        unexercised.add('roll order');
      } else if (!orderOk(roll)) {
        problems.push(
          `licence rows are out of the design's order [${roll
            .map((r) => `${r.band ?? 'no band'}: ${r.label ?? r.bare ?? 'undated'}`)
            .join(', ')}]`,
        );
      }
    }
  } else {
    /* ---------------------------------------------------------- artboards */

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
  }

  if (problems.length) {
    bad += 1;
    console.error(`FAIL ${file}`);
    for (const p of problems) console.error(`     ${p}`);
    continue;
  }

  if (built) {
    const who = loadCellsBuilt(html);
    const rows = Object.keys(FIXTURE_REGIONS).reduce(
      (sum, id) => sum + (regionIds(html, id) || []).length,
      0,
    );
    matched.rows += rows;
    /**
     * NOT AN OK LINE ON A SURFACE THAT CARRIES NOTHING. A built file whose
     * regions rendered no rows has been read but not checked, and the vacuity
     * refusal below exits 2 on it. Printing "ok ... all clear" first would put a
     * quotable pass on screen immediately before the refusal, and a line that
     * says ok is what gets screenshotted.
     */
    if (rows === 0) {
      empty.push(file);
    } else {
      console.log(`ok   ${file}  (${rows} rows, ${who.length} load cells, in the product's own markup)`);
    }
  } else {
    const domain = FIXTURE_ARTBOARDS[file];
    console.log(`ok   ${file}${domain ? ` (${recordIds(html).length} rows match the fixture)` : ''}`);
  }
}

/**
 * THE VACUITY REFUSAL. A surface that matched nothing is not a pass. Pointed at
 * a built export whose feed could not be read from this machine - which is what
 * a bastrop_tx export honestly is without a platform credential - this
 * instrument has no row, no cell and no load ranking to check, and says so at
 * exit 2 rather than reporting a clean bill of health it did not earn.
 */
if (built && !bad && matched.rows === 0) {
  console.error(`\nREFUSING A VERDICT: 0 rendered rows matched across the surface that was read${empty.length ? ` (${empty.join(', ')})` : ''}.`);
  console.error('A check that found no rows has not checked a lens. Export a pack whose domains');
  console.error('compose records, or read the surface where the records are reachable.');
  process.exit(2);
}
if (built && unexercised.size) {
  /**
   * A rule with no input on a surface that DID carry rows is reported rather
   * than hidden: "the naming rule passed" and "the naming rule had nothing to
   * read" are different claims, and only one of them is worth anything.
   */
  console.error(`\nREFUSING A VERDICT: the ${[...unexercised].join(' and ')} rule(s) had no input on a surface that carried rows.`);
  process.exit(2);
}

if (bad) {
  console.error(`\n${bad} of ${files.length} ${built ? 'built file(s)' : 'artboards'} failed.`);
  process.exit(1);
}
if (built) {
  console.log(
    `\n${files.length} built file(s) pass. matched input: ${matched.tabs} tab label(s), ` +
      `${matched.loadCells} load-strip cell(s), ${matched.cells} table cell(s), ` +
      `${matched.refusedCells} refused-column cell(s), ${matched.rows} row(s), ` +
      `${matched.licences} dated licence row(s).`,
  );
} else {
  console.log(`\n${files.length} artboards pass.`);
}
