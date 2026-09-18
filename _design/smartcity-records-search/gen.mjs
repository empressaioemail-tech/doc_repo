/**
 * SmartCity OS — Records search.  G-147.
 *
 *   node dump-source-state.mjs   re-read the product at the named refs
 *   node gen.mjs                 rewrite every artboard and canvas.json
 *   node check.mjs               the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * RECORDS SEARCH IS THE ONLY WORK SURFACE THAT IS NEITHER A MOUNT NOR A REGION.
 *
 * The other five work surfaces are one or the other. Files and Plan review are
 * iframe MOUNTS of separate products (MOUNT_WORK_IDS = [files, review]) and say
 * so. Connections is a register over the product's own build state. Assets and
 * People are regions with their own subject.
 *
 * Records search owns nothing. It answers one query across two legs it does not
 * own — the cases in DOMAIN_REGISTRY's eleven regions, and the documents in the
 * Smart Files corpus — and both of those live behind a boundary it must cross
 * rather than a table it can read. So its hard problem is not layout. It is that
 * "I found nothing" and "I did not look" and "I was not allowed to look" are
 * three different sentences, and a finder that renders them the same way is
 * lying with a zero.
 *
 * What the design therefore fixes, and what check.mjs enforces:
 *
 *   COVERAGE BEFORE RESULTS. Every result set is preceded by a coverage panel
 *   with one row per leg. The corpus leg carries the product's own counts —
 *   inScope, searched, notSearched and a count per reason — and its counting
 *   rule verbatim from emptyCoverage(). A finder that shows results without the
 *   denominator it searched is reporting a numerator nobody can weigh.
 *
 *   A LEG THAT DID NOT ANSWER IS NAMED AS A LEG THAT DID NOT ANSWER. One of the
 *   eleven regions has its gating adapter withheld on the pack this is drawn on
 *   (Verkada, police cameras). It is drawn under "not asked", with the region
 *   and the vendor, and NOT as a region with zero results.
 *
 *   A REFUSAL IS NOT AN EMPTY RESULT. Documents are read through
 *   searchDocuments(scopeType, scopeId, q), which is scope-bound, and a read
 *   outside scope carries the product's own code read_outside_scope. The board
 *   draws that refusal with its code and never as "no documents".
 *
 *   NOT SEARCHABLE IS A FIRST-CLASS OUTCOME, WITH ITS REASON. Three reasons are
 *   closed in the product, plus reason-not-recorded for a row that predates the
 *   column. reason-not-recorded is a STATE and never a REASON — the product's
 *   own CHECK constraint refuses it as a stored value — and check.mjs refuses to
 *   let the two lists merge.
 *
 *   THE FINDER INVENTS NO WORD. Outcomes come from DOMAIN_STATUSES plus the
 *   refusal code plus the two counts in the product's own counting rule.
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* --------------------------------------------------- the reads, named once */

if (S.nav.recordsLabel !== 'Records search') {
  throw new Error(`the nav label moved to "${S.nav.recordsLabel}"; this design is out of date, re-derive it`);
}
if (S.legs.length !== 2) {
  throw new Error(`${S.legs.length} legs declared; this design draws exactly two, and a third is a design change`);
}
if (S.nav.recordsIsMount) {
  throw new Error('records is now a mount; this design draws it as a first-party finder and is out of date');
}

const LABEL = S.nav.recordsLabel;
const LEGS = S.legs;
const DOC = S.documents;
const STUB = S.stub;
const REGIONS = S.domains.registry;
const GRANTED = new Set(S.domains.pack.grantedKinds);
const OUTCOMES = S.derived.outcomeVocabulary;
const ASKED = REGIONS.filter((r) => GRANTED.has(r.gatedBy));
const NOT_ASKED = REGIONS.filter((r) => !GRANTED.has(r.gatedBy));
const REASONS = DOC.notIndexedReasons;
const STATES = DOC.searchIndexStates;

/** The two counts the cases leg reports, measured off the registry and the pack. */
const CASES = {
  registered: REGIONS.length,
  asked: ASKED.length,
  notAsked: NOT_ASKED.length,
  byLens: [...new Set(REGIONS.map((r) => r.lensId))].length,
};

/**
 * The documents leg's counts. ILLUSTRATIVE, and said so on the board: the
 * corpus lives in a live tenant and this design cannot call searchCoverage at a
 * ref, so the figures are a shape rather than a measurement. What IS enforced is
 * the arithmetic — searched plus the reasons equals in-scope, and not-searched
 * equals in-scope minus searched — because the failure this guards against is a
 * coverage panel whose numbers do not reconcile, which reads as precision.
 */
const DOCS = {
  scopeType: 'tenant',
  inScope: 28,
  searched: 25,
  byReason: { 'content-type-not-indexable': 0, 'no-text-layer': 2, 'extraction-failed': 1, 'reason-not-recorded': 0 },
};
DOCS.notSearched = DOCS.inScope - DOCS.searched;
const reasonSum = Object.values(DOCS.byReason).reduce((a, b) => a + b, 0);
if (reasonSum !== DOCS.notSearched) {
  throw new Error(
    `the illustrative coverage does not reconcile: reasons sum to ${reasonSum}, notSearched is ${DOCS.notSearched}. ` +
      `A coverage panel that does not add up is worse than none.`,
  );
}

const REF = `${S.snapshot.dashboards.ref} ${S.snapshot.dashboards.commit.slice(0, 8)}`;
const REF_FILES = `${S.snapshot.files.ref} ${S.snapshot.files.commit.slice(0, 8)}`;

/* ------------------------------------------------------------ primitives */

/**
 * Badge words are a CLOSED SET and it is the product's: the six register
 * dispositions plus the five words the shipped nav prints. The map is total with
 * a quiet fallback rather than a lookup that throws, because a seventh
 * disposition appearing in the product must show up as a check failure with a
 * readable message, not as a generator crash that looks like a design problem.
 */
const BADGE_TONE = {
  Mounted: ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  Empty: ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not built': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  Island: ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  Killed: ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not read': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  Preview: ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};
const BADGE_WORDS = [...new Set([...S.register.DISPOSITIONS, 'Not read', 'Preview'])];
const esc = (t) => String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/**
 * A badge carries data-badge="<word>" as well as printing it, so check.mjs reads
 * the word off an attribute instead of guessing which span is a state chip and
 * which is a value. The check also requires the attribute and the rendered text
 * to be the same string, so a badge cannot declare one word and print another.
 */
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE_TONE[t] || ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'];
  return `<span data-badge="${esc(t)}" style="flex:none; font:500 12px/16px var(--sc-font-data); color:${c}; background:${w}; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">${esc(t)}</span>`;
};
const chip = (t, tone) =>
  `<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:var(${tone}); background:var(--sc-surface-3); border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">${esc(t)}</span>`;
const mono = (t, tone = '--sc-ink') =>
  `<span style="font:400 13px/18px var(--sc-font-data); color:var(${tone});">${esc(t)}</span>`;
const basisLine = (t, max) =>
  `<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:${max || 120}ch;">${t}</span>`;

/**
 * The nav's badge values are TODAY'S SHIPPED VALUES, so they are wrapped in
 * data-nav="shipped". check.mjs allows the words "Not built" only inside a
 * shipped-nav region or inside the panel that quotes the shipped stub, because
 * on this surface those words are a quote of the product's current state and
 * never this design's own verdict about the page it draws.
 */
const SHIPPED_NAV = [
  ['Overview', 'Empty'], ['Development services', 'Empty'], ['Finance', 'Empty'],
  ['Citizen', 'Preview'], ['Public works', 'Not read'], ['Parks', 'Not built'],
  ['Police', 'Not read'], ['Fire and EMS', 'Not read'], ['Fleet', 'Not read'],
];
const navRow = (n, b, on) =>
  `          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:${on ? 'var(--sc-accent-wash)' : 'transparent'}; box-shadow:${on ? 'inset 2px 0 0 var(--sc-accent)' : 'none'};">` +
  `<span style="flex:1; min-width:0; font:${on ? 600 : 400} 14px/20px var(--sc-font-ui); color:var(${on ? '--sc-ink' : '--sc-ink-2'}); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(n)}</span>${badge(b)}</div>`;

const navGroup = (label, items) =>
  `        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n` +
  `          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">${label}</div>\n` +
  items.join('\n') + `\n        </div>`;

const nav = (foot) =>
  `      <nav data-nav="shipped" style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n` +
  navGroup('Lenses', SHIPPED_NAV.map(([n, b]) => navRow(n, b, false))) + '\n' +
  navGroup('Work', [
    ['Plan review', 'Preview'], ['Files', 'Preview'], [LABEL, 'Not built'],
  ].map(([n, b]) => navRow(n, b, n === LABEL))) + '\n' +
  navGroup('City', [['Assets', 'Empty'], ['Connections', ''], ['People and access', 'Not built']].map(([n, b]) => navRow(n, b, false))) + '\n' +
  `        <div style="flex:1;"></div>\n` +
  `        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">${foot}</div>\n      </nav>`;

const topbar = (o) =>
`    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n` +
`      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>\n` +
`      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Bastrop, TX</div>\n` +
`      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n` +
`      <div style="flex:1;"></div>\n` +
/**
 * THE TOP-BAR BOX IS THE PRODUCT'S, VERBATIM, INCLUDING ITS THREE NOUNS.
 * placeholder="Search records, parcels, cases" is a real string at the ref and
 * only two of the three nouns are legs of this finder. The board quotes it
 * unchanged and carries data-acceptance="parcels-not-a-leg" rather than quietly
 * dropping a word from the chrome.
 */
`      <div data-topbar-search="records" data-acceptance="parcels-not-a-leg" style="display:flex; align-items:center; gap:var(--sc-2); height:28px; padding:0 var(--sc-3); width:340px; border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); background:var(--sc-surface); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">` +
`<span>&#9906;</span><span style="flex:1;">${esc(STUB.topbarPlaceholder)}</span>` +
(o.focusedButton ? `<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-control); padding:1px 6px;">Find</span>` : `<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${esc(STUB.topbarAriaLabel)}</span>`) +
`</div>\n` +
`      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n` +
`        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n` +
`        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX &middot; ${esc(LABEL)}</span>\n      </div>\n    </header>`;

const panelHead = (o) =>
`          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n` +
`            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink); white-space:nowrap;">${esc(o.title)}</span>\n` +
`            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${o.sub}</span>\n` +
(o.chip ? `            ${badge(o.chip)}\n` : '') +
`            <div style="flex:1;"></div>\n` +
(o.right ? `            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${o.right}</span>\n` : '') +
`          </div>`;

const panel = (o, body) =>
`        <section${o.attrs || ''} style="${o.grow ? 'flex:1; min-height:0;' : 'flex:none;'} border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n` +
panelHead(o) + '\n' + body + '\n' +
(o.basis ? `          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">${basisLine(o.basis, o.basisWidth)}</div>\n` : '') +
`        </section>`;

const rows = (items, cols) =>
`          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n` +
items.map((r, i) =>
`            <div${r.attrs || ''} style="display:grid; grid-template-columns:${cols}; gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline; ${i ? 'border-top:1px solid var(--sc-line-faint);' : ''}">` +
r.cells.map((c, j) => `<span style="min-width:0; font:400 13px/18px ${c && c.mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)'}; color:var(${(c && c.tone) || (j === 0 ? '--sc-ink' : '--sc-ink-2')});">${c && c.t !== undefined ? c.t : c}</span>`).join('') +
`</div>`).join('\n') + `\n          </div>`;

/* -------------------------------------------------- the two leg components

Every row of both components carries data-leg, so "which leg did this come
from" is readable by check.mjs rather than inferred from a colour. A result
whose leg cannot be read back is a result nobody can audit.
*/

/**
 * The cases coverage row set. data-region is a registry id, data-gated-by is a
 * catalogued adapter kind and data-outcome is a DOMAIN_STATUSES word: all three
 * are closed vocabularies read out of the product, so an invented region, vendor
 * or state fails the check rather than rendering.
 */
const casesCoverage = () =>
`          <div data-coverage data-coverage-leg="cases" data-regions-registered="${CASES.registered}" data-regions-asked="${CASES.asked}" data-regions-not-asked="${CASES.notAsked}" style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-1);">\n` +
REGIONS.map((r, i) => {
  const granted = GRANTED.has(r.gatedBy);
  return `            <div data-leg="cases" data-region="${r.domainId}" data-gated-by="${r.gatedBy}" data-outcome="${granted ? 'searched' : 'not-searched'}" style="display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) 104px; gap:var(--sc-3); padding:5px var(--sc-4); align-items:baseline; ${i ? 'border-top:1px solid var(--sc-line-faint);' : ''}">` +
    `<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">${esc(r.region)}</span>` +
    `${mono(r.gatedBy, granted ? '--sc-ink-2' : '--sc-crit')}` +
    `<span style="font:400 12px/17px var(--sc-font-data); color:var(${granted ? '--sc-ok' : '--sc-crit'});">${granted ? 'asked' : 'not asked'}</span>` +
  `</div>`;
}).join('\n') + `\n          </div>`;

/**
 * The documents coverage row set. The product's own four reason keys are all
 * present, including the two that are zero, because a coverage panel that omits
 * a reason cannot be told apart from one where the reason never occurred. The
 * counting rule is quoted verbatim from emptyCoverage().
 */
const docsCoverage = () =>
`          <div data-coverage data-coverage-leg="documents" data-scope-type="${DOCS.scopeType}" data-in-scope="${DOCS.inScope}" data-searched="${DOCS.searched}" data-not-searched="${DOCS.notSearched}"` +
Object.entries(DOCS.byReason).map(([k, v]) => ` data-reason-${k}="${v}"`).join('') +
` data-fixture="true" style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-1);">\n` +
Object.entries(DOCS.byReason).map(([k, v], i) => {
  const isState = k === 'reason-not-recorded';
  return `            <div data-leg="documents" data-search-state="${k === 'reason-not-recorded' ? 'reason-not-recorded' : k}" data-search-reason="${k === 'reason-not-recorded' ? 'none' : k}" data-outcome="${v ? 'not-searched' : 'searched'}" style="display:grid; grid-template-columns:minmax(0,1.3fr) 72px minmax(0,1.6fr); gap:var(--sc-3); padding:5px var(--sc-4); align-items:baseline; ${i ? 'border-top:1px solid var(--sc-line-faint);' : ''}">` +
    `${mono(k, v ? '--sc-warn' : '--sc-ink-3')}` +
    `<span style="font:400 13px/18px var(--sc-font-data); color:var(${v ? '--sc-ink' : '--sc-ink-3'}); text-align:right;">${v} of ${DOCS.inScope}</span>` +
    `<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">${esc(basisFor(k, isState))}</span>` +
  `</div>`;
}).join('\n') +
`            <div data-coverage-total="documents" data-search-state="indexed" data-search-reason="none" data-outcome="searched" style="display:grid; grid-template-columns:minmax(0,1.3fr) 72px minmax(0,1.6fr); gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline; border-top:1px solid var(--sc-line-faint);">` +
`${mono('indexed')}<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink); text-align:right;">${DOCS.searched} of ${DOCS.inScope}</span>` +
`<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-2);">${esc(DOC.searchIndexBases[0])}</span></div>\n` +
`            <div data-coverage-rule="documents" style="padding:4px var(--sc-4) 6px;">${basisLine(esc(DOC.coverageCountingRule), 150)}</div>\n` +
`          </div>`;

/** The product's own sentence for a reason, matched by the reason it belongs to. */
function basisFor(reason, isState) {
  if (isState) return DOC.searchIndexBases[2];
  if (reason === 'content-type-not-indexable') {
    return `only ${DOC.indexableContentTypes.join(', ')} is indexed; anything else is counted here rather than silently skipped`;
  }
  if (reason === 'no-text-layer') return 'the file is a scanned page with no text under it';
  return 'the extractor threw, and the throw is recorded rather than the document being called empty';
}

/** One document result. Says its leg, its scope and its own searchability. */
const docResult = (o) =>
`            <div data-result="true" data-leg="documents" data-scope-type="${o.scope}" data-scope-id="${o.scopeId}" data-search-state="${o.state}" data-search-reason="${o.reason || 'none'}" style="display:grid; grid-template-columns:minmax(0,2fr) minmax(0,1fr) 116px; gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline;">` +
`<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">${esc(o.title)}</span>` +
`${mono(o.scope)}${o.state === 'indexed' ? chip(o.state, '--sc-ok') : chip(o.state, '--sc-warn')}</div>`;

/** One case result. Says its leg and the region it came from. */
const caseResult = (o) =>
`            <div data-result="true" data-leg="cases" data-region="${o.region}" data-gated-by="${o.kind}" data-outcome="searched" style="display:grid; grid-template-columns:minmax(0,2fr) minmax(0,1fr) 116px; gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline;">` +
`<span style="min-width:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">${esc(o.summary)}</span>` +
`${mono(o.label)}${mono(o.id, '--sc-ink-2')}</div>`;

/**
 * A scope the reader does not hold. It carries the product's own refusal code
 * and it must NOT carry a zero: rendering read_outside_scope as "0 documents"
 * is the defect this whole folder exists to name.
 */
const refusedScope = (o) =>
`            <div data-result="true" data-leg="documents" data-refusal="${o.code}" data-scope-type="${o.scope}" data-scope-id="${o.scopeId}" style="display:grid; grid-template-columns:minmax(0,2fr) minmax(0,1fr) 116px; gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline; border-top:1px solid var(--sc-line-faint);">` +
`<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-crit);">${esc(o.title)}</span>` +
`${mono(o.scope)}${chip(o.code, '--sc-crit')}</div>`;

/* -------------------------------------------------------------- artboard */

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
`<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n` +
topbar(o) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.foot) + '\n' +
`    <main data-lens-body="records" style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n` +
`      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n` +
`        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX / ${esc(LABEL)}</div>\n` +
`        <div style="display:flex; align-items:baseline; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">${esc(LABEL)}</h1><div style="flex:1;"></div>` +
`<span data-design-state="drawn-not-built" style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Design, not built. Drawn against smartcity-dashboards ${REF} and smart-files ${REF_FILES}.</span></div>\n` +
`        <p style="margin:0; max-width:104ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">${o.lede}</p>\n      </div>\n` +
o.body + '\n' +
`    </main>\n  </div>\n</div>\n</x-dc>\n` +
`<script data-dc-script data-props='{"theme":{"editor":"enum","options":["light","dark"],"default":"${o.theme || 'dark'}"},"$preview":{"width":1600,"height":1040}}'>\n` +
`class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "${o.theme || 'dark'}") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n`;
}

const FOOT = `bastrop_tx &middot; staging pack<br>${CASES.registered} registered regions, ${CASES.asked} with their vendor granted<br>nav badges are the shipped values at ${REF}`;

/* ============================================================== board 1: at rest */

const main = artboard({
  theme: 'dark', focusedButton: true, foot: FOOT,
  lede:
    `${LABEL} owns no records of its own. It answers one query across two legs it does not own — the cases in the ` +
    `regions the department lenses already read, and the documents in the Smart Files corpus — and it states what ` +
    `each leg could cover before it states a single result. Coverage is not a footnote on this surface. It is the ` +
    `first thing on it.`,
  body:
`        <div data-coverage-panel="at-rest" style="flex:none; display:flex; gap:var(--sc-4);">
` + panel({
    title: 'What this search can reach', sub: 'stated before the query, not after it',
    chip: null, right: `${CASES.asked} of ${CASES.registered} regions, 1 corpus`,
    attrs: ' data-leg-panel="cases"',
    basis: `Basis: the region list is DOMAIN_REGISTRY read at ${REF}; whether a region is asked is decided by the pack's own fixtureGrants, not by this board. A region whose gating adapter is withheld is drawn as not asked, with its vendor, and never as a region holding zero records.`,
    basisWidth: 150,
  }, casesCoverage()) + '\n' + panel({
    title: 'The corpus, and what is not in it', sub: 'counted by reason',
    right: `scope ${DOCS.scopeType}`,
    attrs: ' data-leg-panel="documents"',
    basis: `Counting rule, verbatim from the product: ${DOC.coverageCountingRule}`,
    basisWidth: 150,
  }, docsCoverage()) + '\n        </div>\n' +
panel({
  title: 'The two legs, declared', sub: 'and the one noun that is not a leg',
  basis: `A leg is a surface the finder reads, not a source it invents. Cases is DOMAIN_REGISTRY. Documents is the corpus behind the Files mount, reached through ${DOC.searchEntryPoint}, which takes a scope and never reads the whole system.`,
  basisWidth: 150,
}, rows([
  { cells: [mono(LEGS[0].id), { t: esc(LEGS[0].label) }, { t: LEGS[0].reads }, { t: LEGS[0].anchor, mono: true }] },
  { cells: [mono(LEGS[1].id), { t: esc(LEGS[1].label) }, { t: LEGS[1].reads }, { t: esc(LEGS[1].predicate), mono: true }] },
  { attrs: ' data-acceptance="parcels-not-a-leg"', cells: [mono('parcels', '--sc-crit'), { t: 'not a leg', tone: '--sc-crit' }, { t: esc(S.notALeg.why) }, { t: 'open acceptance item', mono: true, tone: '--sc-crit' }] },
], '92px 120px minmax(0,1.5fr) minmax(0,1.7fr)')) + '\n' +
panel({
  title: 'What ships today', sub: 'quoted, so this design cannot drift away from it',
  attrs: ' data-stub="today"',
  basis: `Quoted verbatim from web/index.html at ${REF}, section id="${STUB.sectionId}". The pill, the heading, the body and the basis are the product's own strings; check.mjs refuses a paraphrase.`,
  basisWidth: 150,
}, rows([
  { cells: [{ t: `pill`, mono: true }, { t: badge(STUB.pill) }, { t: `section id="${STUB.sectionId}" is what the product scopes the page with`, mono: true, tone: '--sc-ink-3' }] },
  { cells: [{ t: 'heading', mono: true }, { t: esc(STUB.pageHeading) }, { t: `top-bar box: id="${STUB.topbarInputId}", disabled=${STUB.topbarDisabled}, badge "${STUB.topbarBadge}"`, mono: true, tone: '--sc-ink-3' }] },
  { cells: [{ t: 'basis', mono: true }, { t: esc(STUB.pageBasis) }, { t: `placeholder "${STUB.topbarPlaceholder}"`, mono: true, tone: '--sc-ink-3' }] },
], '92px minmax(0,2.2fr) minmax(0,1.6fr)')) + '\n' + panel({
  title: 'The register rows this surface is answerable to', sub: 'both of them, with their dispositions',
  attrs: ' data-register="shell-homes"',
  basis: `${S.register.countingRule}. The disposition vocabulary is closed at ${S.register.DISPOSITIONS.length}: ${S.register.DISPOSITIONS.join(', ')}.`,
  basisWidth: 150,
}, rows(S.register.rows.map((r) => ({
  cells: [mono(r.table), { t: esc(r.job) }, { t: esc(r.home) }, { t: badge(r.disposition) }],
})), '104px minmax(0,1.3fr) minmax(0,1.3fr) 116px')),
});

/* ========================================================== board 2: a query with results */

const results = artboard({
  theme: 'dark', focusedButton: true, foot: FOOT,
  lede:
    'One query, two legs, and the coverage panel still at the top. Nothing on this page is a number without a ' +
    'denominator, and the results below are shaped so that the three ways a search can come back short are told ' +
    'apart: a region that was not asked, a scope that was refused, and a document that cannot be searched.',
  body:
`        <div data-results="query" style="flex:1; min-height:0; display:flex; flex-direction:column; gap:var(--sc-4);">
` + panel({
    title: 'Coverage for this query', sub: 'before the results, always',
    right: `${CASES.asked}/${CASES.registered} + ${DOCS.searched}/${DOCS.inScope}`,
    attrs: ' data-coverage-panel="query"',
    basis: `The cases figures are measured from the registry and the pack's grants. The corpus figures are ILLUSTRATIVE and badged so: the corpus lives in a live tenant and this design cannot call searchCoverage at a ref. The arithmetic is enforced — searched plus every reason equals in scope, and not-searched equals in scope minus searched — because a coverage panel whose numbers do not reconcile reads as precision.`,
    basisWidth: 160,
  }, casesCoverage() + docsCoverage()) + '\n' +
panel({
    title: 'Results', sub: 'every row says which leg it came from',
    right: `2 legs, ${ASKED.length} regions asked`,
    basis: `A result carries its leg and its origin so it can be audited: a case names its region and the vendor that gated it, a document names its scope and its own search state. No row on this surface is a bare string.`,
    basisWidth: 160,
  },
`          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-1);">\n` +
`            <div style="padding:2px var(--sc-4) 4px; font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">leg: ${esc(LEGS[0].label)}</div>\n` +
[
  { region: 'permits-pipeline', kind: 'mygov', summary: 'Building permit, 2102 Pine St', label: 'Pipeline', id: 'PMT-24-0117' },
  { region: 'work-orders', kind: 'mygov', summary: 'Water main repair, Chestnut St', label: 'Work orders', id: 'WO-24-0431' },
  { region: 'inspections', kind: 'mygov', summary: 'Foundation inspection, 908 Pine St', label: 'Inspections', id: 'INS-24-0288' },
].map(caseResult).join('\n') + '\n' +
`            <div style="padding:8px var(--sc-4) 4px; font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); border-top:1px solid var(--sc-line-faint);">leg: ${esc(LEGS[1].label)}</div>\n` +
[
  { title: 'Contract with Bastrop ISD, 2024', scope: 'tenant', scopeId: 'bastrop_tx', state: 'indexed' },
  { title: 'Site plan set, 2102 Pine St', scope: 'site', scopeId: 'site-2102-pine', state: 'indexed' },
].map(docResult).join('\n') + '\n' +
refusedScope({
    title: 'Inspection photographs, applicant upload folder',
    scope: 'instrument',
    scopeId: 'instrument-4471',
    code: DOC.readRefusalCode,
  }) + '\n' +
`          </div>`) + '\n' +
panel({
    title: 'What was not searched, and why', sub: 'three sentences a zero cannot say',
    basis: `Not-searchable is an outcome with a reason, not a failure: the product records the reason on the version row when it is uploaded and counts each not-searched row once under it. reason-not-recorded is counted and never inferred — the row predates the column, and guessing from content_type is exactly what the product refuses to do.`,
    basisWidth: 160,
  }, rows([
  { attrs: ' data-leg="documents" data-search-state="no-text-layer" data-search-reason="no-text-layer" data-outcome="not-searched"', cells: [mono('no-text-layer'), { t: '2 documents' }, { t: 'scanned pages with no text under them; they are excluded and counted, not silently skipped' }] },
  { attrs: ' data-leg="documents" data-search-state="extraction-failed" data-search-reason="extraction-failed" data-outcome="not-searched"', cells: [mono('extraction-failed'), { t: '1 document' }, { t: 'the extractor threw; the throw is on the row rather than the document being called empty' }] },
  { attrs: ' data-leg="documents" data-search-state="reason-not-recorded" data-search-reason="none" data-outcome="not-searched"', cells: [mono('reason-not-recorded'), { t: '0 documents' }, { t: 'the row predates the reason column; the reason is not recorded and is not inferred' }] },
  { attrs: ` data-leg="cases" data-region="${NOT_ASKED[0].domainId}" data-gated-by="${NOT_ASKED[0].gatedBy}" data-outcome="not-searched"`, cells: [mono(NOT_ASKED[0].domainId, '--sc-crit'), { t: 'not asked' }, { t: `${NOT_ASKED[0].gatedBy} is not granted on this pack, so this region was not searched at all — the answer is not "no matches"` }] },
], '220px 116px minmax(0,1fr)')),
});

/* ============================================================ board 3: the gaps */

const gaps = artboard({
  theme: 'dark', focusedButton: false, foot: FOOT,
  lede:
    'What this design will not pretend, and the one defect it exists to prevent. The panel below is drawn as the ' +
    'failure: a result list with no coverage above it, which is the shape a finder takes when it is written as a ' +
    'text box and a loop.',
  body:
panel({
    title: 'The defect: results with no coverage',
    sub: 'wrong, and drawn wrong on purpose',
    right: 'data-defect',
    attrs: ' data-defect="silent-coverage"',
    basis: `This region is the counter-example check.mjs requires: results present, no coverage block. Without it the rule "every result set is preceded by its coverage" would only ever be tested on boards that already obey it, which is a check reporting success while testing one half of its own premise.`,
    basisWidth: 160,
  },
`          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n` +
[
  { title: 'Site plan set, 2102 Pine St', scope: 'site', scopeId: 'site-2102-pine', state: 'indexed' },
  { region: 'permits-pipeline', kind: 'mygov', summary: 'Building permit, 2102 Pine St', label: 'Pipeline', id: 'PMT-24-0117' },
].map((o) => (o.region ? caseResult(o) : docResult(o))).join('\n') +
`\n            <div style="display:grid; grid-template-columns:minmax(0,1fr); gap:var(--sc-2); padding:10px var(--sc-4); border-top:1px solid var(--sc-line-faint);">` +
`<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-crit);">2 results. Eleven regions and one corpus, and this page cannot say which of them were read. Every figure it shows is a numerator with no denominator.</span></div>\n` +
`          </div>`) + '\n' +
`        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n` +
panel({
    title: 'Three ways to come back short', sub: 'and only one of them is "no matches"',
    basis: `Every word in the left column of these rows is the product's: the four composer statuses, the read refusal code, and the two counts named in emptyCoverage()'s own counting rule. The outcome vocabulary is closed at ${OUTCOMES.length} and derived in dump-source-state.mjs, so a sixth word cannot be added by editing a board.`,
    basisWidth: 150,
  }, rows([
  { attrs: ' data-outcome-vocab="read_outside_scope"', cells: [mono(DOC.readRefusalCode, '--sc-crit'), { t: 'the reader does not hold this scope' }, { t: 'renders as a refusal with its code, never as an empty list. The product refuses the read and says why; a finder that folds that into "no documents" has told the reader the documents do not exist' }] },
  { attrs: ` data-outcome-vocab="${NOT_ASKED[0].domainId}"`, cells: [mono(NOT_ASKED[0].domainId, '--sc-crit'), { t: 'the region has no granted vendor' }, { t: 'renders under "not asked" with the vendor named. The composer calls this ' + NOT_ASKED[0].status + ', and the basis on the region says the vendor is not granted, which is a statement about the source rather than about the city' }] },
  { attrs: ' data-outcome-vocab="no-text-layer"', cells: [mono('no-text-layer', '--sc-warn'), { t: 'the document cannot be searched' }, { t: 'renders as "not searched, and here is why", counted under its reason. Not-searchable is an outcome the product can name, so the finder is not entitled to render it as nothing found' }] },
], '220px minmax(0,1fr) minmax(0,2.4fr)')) + '\n' + panel({
    title: 'What is not settled', sub: 'named, so nobody reaches for it quietly',
    basis: 'Each of these is a real product string or a real absence, and none of them is this design’s to change from a board. They are listed as acceptance items rather than fixed here.',
    basisWidth: 150,
  }, rows([
  { attrs: ' data-acceptance="parcels-not-a-leg"', cells: [mono('parcels', '--sc-crit'), { t: `the chrome names three nouns and the finder has two legs: "${STUB.topbarPlaceholder}"` }, { t: 'a parcel is a place, not a record. Either the box is wired to the place lookup as well, or the word comes out of the placeholder in the same commit that enables the box. Silently dropping a noun from the chrome is the one option that is not available' }] },
  { attrs: ' data-acceptance="corpus-is-a-mount"', cells: [mono('origin', '--sc-warn'), { t: `the corpus sits behind a mount (${S.nav.smartFilesOrigin})` }, { t: 'the documents leg therefore crosses an origin rather than calling a function. What that endpoint is, and whether it may be called from this page at all, is a build decision owed before this surface ships — the design draws the outcome, not the transport' }] },
  { attrs: ' data-acceptance="scope-resolution"', cells: [mono('scope', '--sc-warn'), { t: `scope types are closed at ${DOC.scopeTypes.length}: ${DOC.scopeTypes.join(', ')}` }, { t: 'a staff reader’s scope is resolved from the session, not chosen on this page. Which scope a city staff search reads, and what it does when it holds more than one, is owed before launch' }] },
], '220px minmax(0,1.4fr) minmax(0,2.2fr)')) + '\n        </div>',
});

/* --------------------------------------------------------------- the writes */

const boards = [
  {
    file: 'Main.dc.html',
    x: 0,
    y: 0,
    w: 1600,
    h: 1040,
    title: 'Records search — at rest, with coverage before any query',
    html: main,
  },
  {
    file: 'Results.dc.html',
    x: 1720,
    y: 0,
    w: 1600,
    h: 1040,
    title: 'One query, two legs, and the three ways it comes back short',
    html: results,
  },
  {
    file: 'Gaps.dc.html',
    x: 3440,
    y: 0,
    w: 1600,
    h: 1040,
    title: 'The defect, the closed outcome vocabulary, and what is not settled',
    html: gaps,
  },
];

for (const b of boards) {
  fs.writeFileSync(new URL('./' + b.file, import.meta.url), b.html);
}

const canvas = {
  artboards: boards.map(({ file, x, y, w, h, title }) => ({ file, x, y, w, h, title })),
  annotations: [
    {
      id: 'coverage',
      x: 0,
      y: -320,
      w: 780,
      text:
        'COVERAGE BEFORE RESULTS, AND IT IS THE WHOLE SURFACE.\n' +
        'This finder owns no records. It reads eleven registered regions and one corpus, and it can read neither completely: one region has its vendor withheld on the pack this is drawn on, and the corpus is scope-bound and partly unsearchable.\n' +
        'So a result count on this page is never printed alone. The coverage panel goes first, with one row per leg, and the corpus leg carries the product\'s own counts plus the counting rule verbatim from emptyCoverage(). "We found 2" and "we searched 10 of 11 regions and 25 of 28 documents" are different sentences, and only the second one is true.',
    },
    {
      id: 'zero',
      x: 840,
      y: -320,
      w: 800,
      text:
        'A ZERO IS THE MOST DANGEROUS THING THIS PAGE CAN PRINT.\n' +
        'There are three ways this search comes back short and only one of them is "no matches". A region whose gating adapter is not granted was not asked. A scope the reader does not hold is refused with the product\'s own code, read_outside_scope. A document with no text layer under it cannot be searched, and the product records why.\n' +
        'Rendering any of those as an empty list tells the reader the records do not exist. That is a false statement about the city, made in the one place a city is most likely to believe it.',
    },
    {
      id: 'closed',
      x: 1700,
      y: -320,
      w: 820,
      text:
        'EVERY WORD ON THIS SURFACE IS ALREADY THE PRODUCT\'S.\n' +
        'Outcomes are the four composer statuses plus the read refusal code plus the two counts named in the product\'s own counting rule — seven words, derived in dump-source-state.mjs rather than declared here.\n' +
        'Document states are the product\'s five, and its reasons are its three. reason-not-recorded is a STATE and never a REASON: the product\'s own CHECK constraint refuses it as a stored value, and check.mjs refuses to let the two lists merge.\n' +
        'A finder that can invent an outcome word can invent "we searched everything", which is the one sentence this surface must not be able to say when it has not.',
    },
    {
      id: 'notbuilt',
      x: 2580,
      y: -320,
      w: 780,
      text:
        'THIS SURFACE IS NOT "NOT BUILT", AND THE DESIGN SAYS SO CAREFULLY.\n' +
        'src/domains.mjs closed that phrase at one meaning: absent from DOMAIN_REGISTRY. Records search is absent from the registry for a reason that is not the same as Parks — it generates no records of its own, so it has nothing to register rather than no vendor to gate it.\n' +
        'That is why the boards quote the shipped stub verbatim inside data-stub="today" and allow the words "Not built" nowhere else but the shipped nav. The stub is a quote of what a city sees today. It is not this design\'s verdict on the page it draws.',
    },
    {
      id: 'register',
      x: 3440,
      y: -320,
      w: 800,
      text:
        'TWO REGISTER ROWS, AND NEITHER IS THIS SURFACE\'S SUBJECT.\n' +
        'The register says "Prophecy document search → Work Records search (Not built)" and "City document table → Files (Island)". The first is a retired product\'s function, not a design brief; the second is a table of documents that already has a home on the Files mount.\n' +
        'So this surface is not the city document table moved sideways. It is the finder that resolves across the two homes a document-adjacent record can be in, and the acceptance items board names the three things owed before it can ship: the third noun in the chrome, the origin the corpus sits behind, and which scope a staff reader\'s search reads.',
    },
  ],
  launch: { view: 'canvas' },
};

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify(canvas, null, 2) + '\n');

console.log(`wrote ${boards.length} artboards and canvas.json`);
console.log(`  scope:    data-lens-body="records"  (product anchor: section id="${STUB.sectionId}")`);
console.log(`  legs:     ${LEGS.map((l) => l.id).join(', ')}   not a leg: ${S.notALeg.id}`);
console.log(`  cases:    ${CASES.asked} of ${CASES.registered} regions asked, ${NOT_ASKED.length} withheld (${NOT_ASKED.map((r) => r.gatedBy).join(', ')})`);
console.log(`  corpus:   ${DOCS.searched} of ${DOCS.inScope} searched, illustration, arithmetic reconciled to ${DOCS.notSearched}`);
