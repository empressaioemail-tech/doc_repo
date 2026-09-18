/**
 * Adversarial read of the SmartCity map dock artboards against the product's own sources.
 *
 *   node dump-source-facts.mjs && node check.mjs
 *
 * Non-zero exit on a violation. Exit 2 means the instrument REFUSED to report a verdict,
 * which is not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested perfectly and
 * matched nothing on any board, because the canvas rendered display forms and the check
 * looked for the product's codes. It reported success and checked nothing. So:
 *
 *   1. EVERY PREDICATE REPORTS A COUNT of the inputs it matched, and the run refuses a
 *      verdict when a predicate that must have inputs has none.
 *   2. WHERE A RULE'S LEGITIMATE ANSWER IS "nothing found" it is paired with a count of
 *      what it SCANNED. "No invented category" must not be satisfiable by looking at
 *      nothing, so the category scan reports how many headers it read.
 *   3. NOTHING IS COMPARED AGAINST ITSELF. One side of every predicate is an artboard and
 *      the other is source-facts.json: the product's own catalog module imported, and its
 *      own nav module read through the design-completion-gate's extractors, both at a
 *      named commit. The boards TYPE their intent; the product DERIVES its output; this
 *      file is the third party that compares them.
 *   4. WHERE THE PRODUCT DOES NOT SETTLE A QUESTION, THIS FILE DOES NOT PRETEND IT DOES.
 *      The product's own first-paint test compares its nav vocabularies as SETS
 *      (`JSON.stringify([...a].sort())`), so nav ORDER is not load-bearing in the product.
 *      A board that renders the shipped rows in a different order is therefore reported as
 *      a NOTE and not failed -- an instrument that invents rules is as useless as one that
 *      checks nothing.
 *
 * DEFECTS FOUND ON THESE BOARDS, NAMED IN THE OUTPUT AND NOT FIXED:
 *
 *   LICENCES. Main and Expand render the Development services tabs with "Licences". The
 *   product's TAB_LABELS ships "Licenses". Both boards, both states.
 *
 *   THE PANEL SHOWS A NUMBER ITS OWN ROWS CANNOT ACCOUNT FOR. Full renders 3 of the
 *   product's 7 layer categories and 0 of the 4 active layers, while its own header says
 *   "4 active". The header number is TRUE about the product -- panelCountFaults passes --
 *   so this is not a violation of the catalog; a static artboard truncating a scrollable
 *   panel is a legitimate rendering choice. It is reported as PARTIAL: counted and named
 *   in the artifact, neither failed nor passed in silence, because a viewer reading the
 *   board alone cannot reconcile "4 active" with the rows in front of them.
 *
 * WHAT IS NOT CHECKED. Whether a permit row's SUBJECT text is a faithful rendering of the
 * live MyGov record. That is a judgement about data this file does not hold.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-facts.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-facts.json is missing or unparsable. It is the product output this file checks');
  console.error('the artboards against, and there is no second source without it. Re-dump it with');
  console.error('dump-source-facts.mjs rather than letting the check pass silently.');
  process.exit(2);
}

function refuse(msg) {
  console.error('REFUSING A VERDICT: ' + msg + '.');
  console.error('A facts file this file cannot trust is a facts file it must not check against. Re-dump it.');
  process.exit(2);
}

/* ------------------------------------------------------- the product sets */

const LAYERS = S.layerCount;
const CATEGORIES = S.categories;
const DECLARED_CATEGORIES = S.categoriesDeclared;
const ACTIVE = S.defaultVisibleCount;
const ACTIVE_KEYS = new Set(S.defaultVisibleKeys);
const LENS_LABELS = S.nav.lenses.map((l) => l.label);
const WORK_LABELS = S.nav.work.map((w) => w.label);
const TAB_LABELS = S.nav.dsTabs.map((t) => t.label);
const NAV_VOCAB = LENS_LABELS.concat(WORK_LABELS);
const BADGES = new Set(['LIVE RECORDS', 'EMPTY', 'PREVIEW', 'NOT BUILT', 'NOT READ', 'NEXT']);
const EXCLUDED = ['Permits', 'Violations', 'Heatmap', 'Overlays'];

if (!Number.isInteger(LAYERS) || LAYERS <= 0) refuse('layerCount did not resolve to a positive integer');
if (!Array.isArray(CATEGORIES) || !CATEGORIES.length) refuse('the facts file carries no categories');
const summed = CATEGORIES.reduce((a, c) => a + c.layerCount, 0);
if (summed !== LAYERS) refuse('the category layer counts sum to ' + summed + ' and layerCount says ' + LAYERS);
if (CATEGORIES.some((c) => !Array.isArray(c.layerNames) || c.layerNames.length !== c.layerCount)) {
  refuse('a category carries a different number of layer names than layers');
}
if (!CATEGORIES.every((c) => c.id && c.name)) refuse('a category resolved with no id or name');
if (DECLARED_CATEGORIES < CATEGORIES.length) refuse('the product declares fewer categories than it carries');
if (!(ACTIVE > 0 && ACTIVE <= LAYERS)) refuse('defaultVisibleCount is not inside (0, layerCount]');
if (!LENS_LABELS.length || !WORK_LABELS.length || !TAB_LABELS.length) refuse('the nav facts did not resolve');
if (!S._source || !S._source.commit) refuse('the facts file does not name the commit it was read from');
if (CATEGORIES.some((c) => EXCLUDED.some((x) => c.layerNames.includes(x)))) {
  refuse('the catalog carries a layer this design says the product excludes');
}

const catByName = new Map(CATEGORIES.map((c) => [c.name.trim().toLowerCase(), c]));
const layerNameOwner = new Map();
for (const c of CATEGORIES) for (const n of c.layerNames) layerNameOwner.set(n.trim().toLowerCase(), c);

/* ------------------------------------------------------------- extractors
   Each one matches a SHAPE the boards actually use, read off the boards. A looser shape
   would sweep up unrelated text and inflate the counts that prove the check ran. */

const plainText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&middot;/g, ' ')
    .replace(/&Prime;/g, '"')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ');
const one = (re, s) => {
  const m = s.match(re);
  return m ? m[1] : null;
};

const NAV_BLOCK_RE = /<nav[^>]*>([\s\S]*?)<\/nav>/;
const NAV_ROW_RE = /<div style="display:flex; align-items:center; gap:var\(--sc-2\); min-height:27px;/g;
const NAV_LABEL_RE = /style="flex:1; min-width:0; font:(?:400|600) 13px\/19px var\(--sc-font-ui\);[^"]*">([^<]+)<\/span>/;
const BADGE_RE = /<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.06em;[^"]*">([^<]*)<\/span>/;

/** The nav rows, as [label, badge] in DOCUMENT order. Order is the point: a listing that
    silently reordered would make an order rule unenforceable. */
function navRows(html) {
  const nav = one(NAV_BLOCK_RE, html);
  if (nav === null) return null;
  const starts = [];
  NAV_ROW_RE.lastIndex = 0;
  let m;
  while ((m = NAV_ROW_RE.exec(nav)) !== null) starts.push(m.index);
  const out = [];
  for (let i = 0; i < starts.length; i += 1) {
    const chunk = nav.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : starts[i] + 600);
    const label = one(NAV_LABEL_RE, chunk);
    if (label === null) continue;
    const b = chunk.match(BADGE_RE);
    out.push({ label, badge: b ? b[1] : null });
  }
  return out.length ? out : null;
}

/* The Development services tabs render two ways: a horizontal strip on the wide board and a
   vertical list at rail width. Same vocabulary, same rule. */
const TAB_SHAPES = [
  { shape: 'strip', re: /<span style="font:(?:400|620) 13px\/19px var\(--sc-font-ui\); color:var\(--sc-ink(?:-2)?\); padding:var\(--sc-2\) 0 9px; box-shadow:[^"]*; white-space:nowrap;">([^<]+)<\/span>/g },
  { shape: 'rail list', re: /<div style="font:(?:400|620) 13px\/19px var\(--sc-font-ui\); color:var\(--sc-ink(?:-3)?\); padding:4px var\(--sc-2\); border-radius:var\(--sc-r-control\); background:[^"]*;">([^<]+)<\/div>/g },
];
function tabNav(html) {
  for (const { shape, re } of TAB_SHAPES) {
    const labels = [...html.matchAll(re)].map((m) => m[1]);
    if (labels.length >= 3) return { shape, labels };
  }
  return null;
}

const ASIDE_RE = /<aside[^>]*>([\s\S]*?)<\/aside>/g;
const CAT_HEADER_RE = /text-transform:uppercase; color:var\(--sc-ink-2\);[^"]*">([^<]+)<\/span><span style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\);">(\d+)\/(\d+)<\/span>/g;
const LAYER_ROW_RE = /<div style="display:flex; align-items:center; gap:7px; padding:4px var\(--sc-3\) 4px 26px;"><span style="width:11px; height:11px;[^"]*"><\/span><span style="font:400 13px\/18px var\(--sc-font-ui\); color:var\(--sc-ink-2\);[^"]*">([^<]+)<\/span><\/div>/g;

/** The layers index, if this board carries one. */
function layersPanel(html) {
  const panel = [...html.matchAll(ASIDE_RE)].map((m) => m[0]).find((a) => a.includes('>Map layers</span>'));
  if (!panel) return null;
  const total = one(/Search (\d+) layers/, panel);
  const active = one(/>(\d+) active</, panel);
  const headers = [...panel.matchAll(CAT_HEADER_RE)].map((m) => ({ label: m[1], active: Number(m[2]), total: Number(m[3]) }));
  const names = [...panel.matchAll(LAYER_ROW_RE)].map((m) => m[1]);
  return {
    total: total === null ? null : Number(total),
    active: active === null ? null : Number(active),
    headers,
    names,
    text: plainText(panel),
  };
}

const FACT_ROW_SPLIT = '<div style="display:flex; flex-direction:column; gap:1px; padding:6px var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">';
const REFUSED_VALUE_RE = /color:var\(--sc-warn\);">Refused<\/span>/;

/** The property-detail fact rows, wherever they render. Every board carries them. */
function factRows(html) {
  return html
    .split(FACT_ROW_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 900);
      const key = one(/text-transform:uppercase; color:var\(--sc-ink-3\);">([^<]+)<\/span>/, head);
      if (key === null) return null;
      return { key, refused: REFUSED_VALUE_RE.test(head), text: plainText(head) };
    })
    .filter((r) => r !== null);
}

const PERMIT_HEAD_RE = /<div style="display:grid;[^"]*padding:6px var\(--sc-4\); background:var\(--sc-surface-2\); border-bottom:1px solid var\(--sc-line\);.*?">([\s\S]*?)<\/div>/;
const PERMIT_COL_RE = /text-transform:uppercase; color:var\(--sc-ink-3\);">([^<]+)<\/span>/g;

/** The permit strip's column headers, if this board carries one. */
function permitHeaders(html) {
  const head = html.match(PERMIT_HEAD_RE);
  if (!head) return null;
  const labels = [...head[1].matchAll(PERMIT_COL_RE)].map((m) => m[1]);
  return labels.length ? labels : null;
}

const LAYER_BUTTON_RE = /Layers <span style="[^"]*">(\d+)<\/span>/;
const TOPBAR_CITY_RE = /font:620 15px\/22px var\(--sc-font-ui\);[^"]*">([^<]+)<\/span>/;

/* ------------------------------------------------------------- predicates
   Each returns something countable, so the run can tell "clean" from "unread". */

/** Every rendered nav row must be one the product ships, and none twice. */
const navVocabFaults = (rows) => {
  const out = [];
  for (const r of rows) {
    if (!NAV_VOCAB.includes(r.label)) out.push('the sidebar carries "' + r.label + '", which is neither a shipped lens nor a shipped work item');
  }
  for (const l of NAV_VOCAB) {
    const n = rows.filter((r) => r.label === l).length;
    if (n > 1) out.push('"' + l + '" is rendered ' + n + ' times');
  }
  return out;
};
/** Counted, not failed: the product compares its nav vocabularies as sets. */
const navOrderNotes = (rows, product, group) => {
  const rendered = rows.map((r) => r.label).filter((l) => product.includes(l));
  const want = product.filter((l) => rendered.includes(l));
  return rendered.join(' > ') === want.join(' > ') ? [] : [group + ' rows render ' + rendered.join(' > ') + ' and the product declares ' + product.join(' > ') + '; the product sorts before comparing, so this is a note, not a violation'];
};
/** A badge must come from the product's own vocabulary. */
const navBadgeFaults = (rows) => rows.filter((r) => r.badge !== null && !BADGES.has(r.badge)).map((r) => r.label + ' carries the badge "' + r.badge + '", which is not one of ' + [...BADGES].join('/'));
/** The DS tabs must be the product's tabs -- same count, same names, no invention, no loss. */
const tabFaults = (nav) => {
  const out = [];
  for (const l of nav.labels) if (!TAB_LABELS.includes(l)) out.push('the tab nav renders "' + l + '", which is not a product tab');
  for (const t of TAB_LABELS) if (!nav.labels.includes(t)) out.push('the tab nav drops "' + t + '"');
  if (nav.labels.length !== TAB_LABELS.length) out.push('the tab nav renders ' + nav.labels.length + ' tabs and the product ships ' + TAB_LABELS.length);
  return out;
};
const tabOrderNotes = (nav) => {
  const rendered = nav.labels.filter((l) => TAB_LABELS.includes(l));
  const want = TAB_LABELS.filter((l) => rendered.includes(l));
  return rendered.join(' > ') === want.join(' > ') ? [] : ['the tab nav renders ' + rendered.join(' > ') + ' and the product declares ' + TAB_LABELS.join(' > ') + '; sorted comparison, so this is a note, not a violation'];
};
/** The panel exists in FULL ONLY -- the rule on the design's own canvas. */
const panelPlacementFaults = (b) =>
  b.isFull
    ? b.panel ? [] : ['Full carries no layers panel, and Full is the only state with room for it']
    : b.panel ? [b.file + ' carries the layers panel, and the rule is that it exists in FULL ONLY'] : [];
/** Dock and Expand get the button instead, carrying the active count. */
const buttonPlacementFaults = (b) =>
  b.isFull
    ? b.buttonCount === null ? [] : ['Full carries a Layers button at ' + b.buttonCount + '; the button is what Dock and Expand get INSTEAD of the panel']
    : b.buttonCount === null ? [b.file + ' carries neither the panel nor a Layers button, so the rule has no affordance at rail width'] : [];
/** The button's count is the product's default-visible count. */
const buttonCountFaults = (b) =>
  b.buttonCount !== null && b.buttonCount !== ACTIVE
    ? [b.file + ': the Layers button says ' + b.buttonCount + ' active and the product defaults ' + ACTIVE + ' layers on']
    : [];
/** The panel states the product's layer total and active count. */
const panelCountFaults = (panel) => {
  const out = [];
  if (panel.total !== LAYERS) out.push('the panel searches ' + panel.total + ' layers and the product carries ' + LAYERS);
  if (panel.active !== ACTIVE) out.push('the panel says ' + panel.active + ' active and the product defaults ' + ACTIVE + ' layers on');
  return out;
};
/** Every rendered category header names a product category and counts its real layers. */
const categoryHeaderFaults = (panel) => {
  const out = [];
  for (const h of panel.headers) {
    const c = catByName.get(h.label.trim().toLowerCase());
    if (!c) {
      out.push('the panel groups by "' + h.label + '", which is not one of the product\'s categories ' + CATEGORIES.map((x) => x.name).join(' / '));
      continue;
    }
    if (h.total !== c.layerCount) out.push('"' + h.label + '" counts ' + h.total + ' layers and the product carries ' + c.layerCount);
    if (h.active > h.total) out.push('"' + h.label + '" claims more active layers than it has rows');
    const onByKey = c.layerKeys.filter((k) => ACTIVE_KEYS.has(k)).length;
    if (h.active !== onByKey) out.push('"' + h.label + '" says ' + h.active + ' active and the product defaults ' + onByKey + ' of its layers on');
  }
  return out;
};
/** Every layer row must be a real product layer, and never one the product excludes. */
const layerRowFaults = (panel) => {
  const out = [];
  for (const n of panel.names) {
    const key = n.trim().toLowerCase();
    if (!layerNameOwner.has(key)) {
      const near = [...layerNameOwner.keys()].filter((k) => k.includes(key) || key.includes(k));
      out.push('the panel renders the layer "' + n + '", which is not a layer name in the catalog' + (near.length ? ' (nearest: ' + near[0] + ')' : ''));
    }
  }
  return out;
};
/** Names the product excludes must not appear in the panel at all. */
const excludedFaults = (panel) => {
  const m = panel.text.match(new RegExp('\\b(' + EXCLUDED.join('|') + ')\\b', 'gi'));
  return m ? [...new Set(m)].map((w) => 'the panel says "' + w + '" and the product composes that route outside the layer catalog') : [];
};
/** Buildable area stays visible and says REFUSED with its basis, in every state. */
const refusedFaults = (rows) => {
  if (rows.length === 0) return ['no Buildable area row in the property detail, and the ruling is that it stays visible in every state'];
  const ok = rows.filter((r) => r.refused && /R-2/.test(r.text));
  if (ok.length !== 1) return ['the Buildable area row (' + rows.length + ' of them) is not a REFUSED value carrying ruling R-2'];
  return [];
};
/** Record rows carry an id, a subject and a status, and never the free-text description. */
const permitHeaderFaults = (labels) => {
  const out = [];
  for (const want of ['Id', 'Type', 'Subject', 'Department', 'Status']) {
    if (!labels.includes(want)) out.push('the permit row has no "' + want + '" column');
  }
  for (const bad of ['Description', 'Notes', 'Comment', 'Narrative']) {
    if (labels.includes(bad)) out.push('the permit row carries a "' + bad + '" column; the design says rows carry id, subject and status and never the free-text description');
  }
  return out;
};
/** The map reads Bastrop only; every board declares the pack it is a picture of. */
const packFaults = (city) => (city === 'Bastrop, TX' ? [] : ['the top bar names "' + city + '" and the property read path refuses every cityKey but bastrop_tx']);

/* ------------------------------------------------------------- self-tests */

const HEAD = '<!doctype html><html><head><style>.x{color:#fff}</style></head><body><x-dc>';
const navRow = (l, b) =>
  '<div style="display:flex; align-items:center; gap:var(--sc-2); min-height:27px; padding:2px var(--sc-3); border-radius:var(--sc-r-control); background:transparent; box-shadow:none;">' +
  '<span style="flex:1; min-width:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + l + '</span>' +
  (b ? '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ok); background:var(--sc-ok-wash); border-radius:var(--sc-r-control); padding:1px 5px;">' + b + '</span>' : '') +
  '</div>';
const navFixture = (rows) => HEAD + '<nav>' + rows.map(([l, b]) => navRow(l, b)).join('') + '</nav>';
const tabStrip = (labels) => HEAD + labels.map((l) =>
  '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); padding:var(--sc-2) 0 9px; box-shadow:none; white-space:nowrap;">' + l + '</span>').join('');
const tabList = (labels) => HEAD + labels.map((l) =>
  '<div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-3); padding:4px var(--sc-2); border-radius:var(--sc-r-control); background:transparent;">' + l + '</div>').join('');
const layerRow = (n) =>
  '<div style="display:flex; align-items:center; gap:7px; padding:4px var(--sc-3) 4px 26px;"><span style="width:11px; height:11px; border:1px solid var(--sc-line-strong); border-radius:2px;"></span>' +
  '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span></div>';
const catHeader = (label, a, t) =>
  '<div style="display:flex; align-items:center; gap:6px; padding:5px var(--sc-3); background:var(--sc-surface-2);"><span style="color:var(--sc-ink-3); display:flex;"></span>' +
  '<span style="flex:1; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + label + '</span>' +
  '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + a + '/' + t + '</span></div>';
const panelFixture = (o) =>
  '<aside style="width:250px; flex:none; display:flex; flex-direction:column;">' +
  '<div><span style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-ink);">Map layers</span><span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-accent);">' + (o.active === undefined ? ACTIVE : o.active) + ' active</span></div>' +
  '<div style="height:26px;">Search ' + (o.total === undefined ? LAYERS : o.total) + ' layers</div>' +
  (o.headers || []).map(([l, a, t]) => catHeader(l, a, t)).join('') +
  (o.names || []).map(layerRow).join('') +
  '</aside>';
const factRow = (o) =>
  FACT_ROW_SPLIT +
  '<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.k + '</span>' +
  (o.refused ? '<span style="font:620 13px/19px var(--sc-font-ui); color:var(--sc-warn);">Refused</span>' : '<span style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + o.v + '</span>') +
  '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:8px;">' + o.src + '</span></div>';
const permitHeader = (labels) =>
  '<div style="display:grid; grid-template-columns:104px; gap:var(--sc-3); padding:6px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line); align-items:center;">' +
  labels.map((h) => '<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('') + '</div>';

const cleanNavRows = LENS_LABELS.map((l, i) => [l, i === 1 ? 'LIVE RECORDS' : null]).concat(WORK_LABELS.slice(0, 3).map((l) => [l, 'PREVIEW']));
const baseHeaders = [['Public safety / emergency', 0, 14], ['Water supply infrastructure', 0, 4], ['Infrastructure / utilities', 0, 10]];

const tests = [
  ['nav: accepts the shipped rows', navVocabFaults(navRows(navFixture(cleanNavRows))).length === 0],
  ['nav: the extractor reads them in document order', navRows(navFixture(cleanNavRows)).map((r) => r.label).join('|') === cleanNavRows.map((r) => r[0]).join('|')],
  ['nav: REFUSES an invented row', navVocabFaults(navRows(navFixture(cleanNavRows.concat([['Place', null]])))).length === 1],
  ['nav: REFUSES a duplicated row', navVocabFaults(navRows(navFixture(cleanNavRows.concat([cleanNavRows[0]])))).length === 1],
  ['nav: the badge extractor found the badges', navRows(navFixture(cleanNavRows)).filter((r) => r.badge !== null).length === cleanNavRows.filter((r) => r[1]).length],
  ['nav: accepts the product badge vocabulary', navBadgeFaults(navRows(navFixture(cleanNavRows))).length === 0],
  ['nav: REFUSES an invented badge', navBadgeFaults(navRows(navFixture([[cleanNavRows[0][0], 'LIVE']]))).length === 1],
  ['nav: a board with no nav is not read as clean', navRows('<main></main>') === null],
  ['nav order: a swapped pair is a NOTE, not a finding', navOrderNotes(navRows(navFixture([[WORK_LABELS[1], null], [WORK_LABELS[0], null]])), WORK_LABELS, 'Work').length === 1],
  ['tabs: accepts the product strip', tabFaults(tabNav(tabStrip(TAB_LABELS))).length === 0],
  ['tabs: accepts the product rail list', tabFaults(tabNav(tabList(TAB_LABELS))).length === 0],
  ['tabs: REFUSES the misspelling the boards ship', tabFaults(tabNav(tabStrip(TAB_LABELS.map((t) => (t === 'Licenses' ? 'Licences' : t))))).some((f) => f.includes('"Licences"'))],
  ['tabs: REFUSES a dropped tab', tabFaults(tabNav(tabStrip(TAB_LABELS.slice(0, 6)))).some((f) => f.includes('drops "Flood study"'))],
  ['tabs: REFUSES an invented tab', tabFaults(tabNav(tabList(TAB_LABELS.concat(['Place'])))).some((f) => f.includes('"Place"'))],
  ['tabs: a board with no tab nav is null, and the run counts that separately', tabNav(HEAD) === null],
  ['placement: accepts a panel on Full', panelPlacementFaults({ file: 'Full.dc.html', isFull: true, panel: {} }).length === 0],
  ['placement: REFUSES a panel on Dock', panelPlacementFaults({ file: 'Main.dc.html', isFull: false, panel: {} }).length === 1],
  ['placement: REFUSES a Full with no panel', panelPlacementFaults({ file: 'Full.dc.html', isFull: true, panel: null }).length === 1],
  ['placement: accepts no button on Full', buttonPlacementFaults({ file: 'Full.dc.html', isFull: true, buttonCount: null }).length === 0],
  ['placement: REFUSES a button on Full', buttonPlacementFaults({ file: 'Full.dc.html', isFull: true, buttonCount: ACTIVE }).length === 1],
  ['placement: REFUSES a rail board with no affordance', buttonPlacementFaults({ file: 'Main.dc.html', isFull: false, buttonCount: null }).length === 1],
  ['button: accepts the product active count', buttonCountFaults({ file: 'M', buttonCount: ACTIVE }).length === 0],
  ['button: REFUSES a drifted count', buttonCountFaults({ file: 'M', buttonCount: ACTIVE + 1 }).length === 1],
  ['panel: accepts the product total and active', panelCountFaults(layersPanel(panelFixture({ headers: baseHeaders, names: ['Fire stations'] }))).length === 0],
  ['panel: REFUSES a drifted total', panelCountFaults(layersPanel(panelFixture({ total: LAYERS + 1, headers: baseHeaders }))).length === 1],
  ['panel: REFUSES a drifted active', panelCountFaults(layersPanel(panelFixture({ active: ACTIVE + 1, headers: baseHeaders }))).length === 1],
  ['category: accepts real names and counts', categoryHeaderFaults(layersPanel(panelFixture({ headers: baseHeaders }))).length === 0],
  ['category: REFUSES an invented category', categoryHeaderFaults(layersPanel(panelFixture({ headers: baseHeaders.concat([['Stormwater overlays', 0, 3]]) }))).length === 1],
  ['category: REFUSES a drifted denominator', categoryHeaderFaults(layersPanel(panelFixture({ headers: [['Public safety / emergency', 0, 13]] }))).length === 1],
  ['category: not vacuous -- the extractor found the headers', layersPanel(panelFixture({ headers: baseHeaders })).headers.length === 3],
  ['layer: accepts a real layer name in display case', layerRowFaults(layersPanel(panelFixture({ names: ['Fire stations', 'FEMA flood zones (SFHA)'] }))).length === 0],
  ['layer: REFUSES an invented layer', layerRowFaults(layersPanel(panelFixture({ names: ['Parcels One Click Alpha'] }))).length === 1],
  ['layer: REFUSES a real name with a drifted word', layerRowFaults(layersPanel(panelFixture({ names: ['Fire station'] }))).length === 1],
  ['excluded: REFUSES a rendered Permits name', excludedFaults(layersPanel(panelFixture({ names: ['Permits'], headers: baseHeaders }))).length === 1],
  ['excluded: accepts the product names', excludedFaults(layersPanel(panelFixture({ names: ['Wastewater Lines'] }))).length === 0],
  ['excluded: the scan really looked for four names', EXCLUDED.length === 4],
  ['refused: accepts a REFUSED Buildable area with R-2', refusedFaults(factRows(factRow({ k: 'Buildable area', refused: true, src: 'Refused by ruling R-2' }))).length === 0],
  ['refused: REFUSES a Buildable area with a value', refusedFaults(factRows(factRow({ k: 'Buildable area', v: '0.41 ac', src: 'PlaceTypeDesc' }))).length === 1],
  ['refused: REFUSES a REFUSED row with no R-2 basis', refusedFaults(factRows(factRow({ k: 'Buildable area', refused: true, src: 'not available' }))).length === 1],
  ['refused: REFUSES a dropped row', refusedFaults(factRows(factRow({ k: 'Flood zone', v: 'X', src: 'NFHL' }))).length === 1],
  ['permit: accepts the shipped column set', permitHeaderFaults(permitHeaders(permitHeader(['Id', 'Type', 'Subject', 'Department', 'Status', 'Date']))).length === 0],
  ['permit: REFUSES a Description column', permitHeaderFaults(permitHeaders(permitHeader(['Id', 'Type', 'Subject', 'Department', 'Status', 'Description']))).length === 1],
  ['permit: REFUSES a missing Subject column', permitHeaderFaults(permitHeaders(permitHeader(['Id', 'Type', 'Department', 'Status', 'Date']))).length === 1],
  ['permit: a board with no permit strip is null, counted separately', permitHeaders(HEAD) === null],
  ['pack: accepts the Bastrop pack', packFaults('Bastrop, TX').length === 0],
  ['pack: REFUSES another pack on a bastrop-only read path', packFaults('Elgin, TX').length === 1],
  ['text: a style block is never read as content', plainText('<style>.x{color:#fff}</style><p>ok</p>').includes('color') === false],
];

let selfFailed = 0;
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
console.log('self-tests: ' + tests.length + '/' + tests.length + ' passed, both directions on every rule that has two');

/* ------------------------------------------------------------ the artboards */

const BOARDS = [
  { file: 'Main.dc.html', name: 'Dock', isFull: false },
  { file: 'Expand.dc.html', name: 'Expand', isFull: false },
  { file: 'Full.dc.html', name: 'Full', isFull: true },
];

const totals = {
  boardsRead: 0, boardsWithNav: 0, navRows: 0, navBadges: 0, tabNavs: 0, tabLabels: 0,
  layerButtons: 0, panels: 0, panelHeaders: 0, layerRows: 0, buildableRows: 0, refusedRows: 0, permitStrips: 0, visibleChars: 0,
};
const REQUIRED = ['boardsRead', 'boardsWithNav', 'navRows', 'navBadges', 'tabNavs', 'tabLabels', 'layerButtons', 'panels', 'panelHeaders', 'layerRows', 'buildableRows', 'refusedRows'];
const notes = [];
const problems = [];
const fail = (m) => problems.push(m);
const DECLARED = new Set(BOARDS.map((b) => b.file));

for (const b of BOARDS) {
  const p = new URL('./' + b.file, here);
  if (!fs.existsSync(p)) {
    fail(b.file + ': declared as an artboard and does not exist, so nothing was checked on it');
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const rows = navRows(html);
  const tabs = tabNav(html);
  const panel = layersPanel(html);
  const button = html.match(LAYER_BUTTON_RE);
  const buttonCount = button ? Number(button[1]) : null;
  const buildable = factRows(html).filter((r) => r.key === 'Buildable area');
  const permit = permitHeaders(html);
  const city = one(TOPBAR_CITY_RE, html);
  const visible = plainText(html);

  totals.boardsRead += 1;
  totals.visibleChars += visible.length;

  if (rows === null) {
    fail(b.file + ': no nav block, so the lens and work rows were not checked at all');
  } else {
    totals.boardsWithNav += 1;
    totals.navRows += rows.length;
    totals.navBadges += rows.filter((r) => r.badge !== null).length;
    for (const f of navVocabFaults(rows)) fail(b.file + ': ' + f);
    for (const f of navBadgeFaults(rows)) fail(b.file + ': ' + f);
    notes.push(...navOrderNotes(rows, LENS_LABELS, 'Lens').map((n) => b.file + ': ' + n));
    notes.push(...navOrderNotes(rows, WORK_LABELS, 'Work').map((n) => b.file + ': ' + n));
  }

  if (tabs === null) {
    notes.push(b.file + ': no Development services tab nav on this board (' + b.name + ')');
  } else {
    totals.tabNavs += 1;
    totals.tabLabels += tabs.labels.length;
    for (const f of tabFaults(tabs)) fail(b.file + ': ' + f);
    notes.push(...tabOrderNotes(tabs).map((n) => b.file + ': ' + n));
  }

  if (buttonCount !== null) totals.layerButtons += 1;
  if (panel) totals.panels += 1;
  totals.buildableRows += buildable.length;
  totals.refusedRows += buildable.filter((r) => r.refused).length;
  if (permit) totals.permitStrips += 1;

  for (const f of panelPlacementFaults({ file: b.file, isFull: b.isFull, panel })) fail(b.file + ': ' + f);
  for (const f of buttonPlacementFaults({ file: b.file, isFull: b.isFull, buttonCount })) fail(b.file + ': ' + f);
  for (const f of buttonCountFaults({ file: b.file, buttonCount })) fail(b.file + ': ' + f);
  for (const f of refusedFaults(buildable)) fail(b.file + ': ' + f);
  for (const f of packFaults(city)) fail(b.file + ': ' + f);

  if (panel) {
    totals.panelHeaders += panel.headers.length;
    totals.layerRows += panel.names.length;
    for (const f of panelCountFaults(panel)) fail(b.file + ': ' + f);
    for (const f of categoryHeaderFaults(panel)) fail(b.file + ': ' + f);
    for (const f of layerRowFaults(panel)) fail(b.file + ': ' + f);
    for (const f of excludedFaults(panel)) fail(b.file + ': ' + f);

    /* The reconciliation this instrument exists to print rather than hide. A truncated
       panel is a legitimate rendering choice; a truncated panel whose own header number
       its rows cannot account for is the defect. */
    const renderedIds = new Set(panel.headers.map((h) => (catByName.get(h.label.trim().toLowerCase()) || {}).id).filter(Boolean));
    const missing = CATEGORIES.filter((c) => !renderedIds.has(c.id)).map((c) => c.name);
    const shownActive = panel.headers.reduce((a, h) => a + h.active, 0);
    if (renderedIds.size < CATEGORIES.length) {
      notes.push(b.file + ': the panel renders ' + renderedIds.size + ' of ' + DECLARED_CATEGORIES + ' declared categories and its headers account for ' +
        shownActive + ' of the ' + ACTIVE + ' active layers, while the panel header says ' + panel.active + ' active; not rendered: ' + missing.join(', '));
    }
  }

  if (permit) for (const f of permitHeaderFaults(permit)) fail(b.file + ': ' + f);
  if (visible.length < 800) fail(b.file + ': under 800 characters of visible text on the board, so it was barely rendered');

  console.log('read ' + b.file.padEnd(15) + ' ' + (rows ? rows.length : 0) + ' nav rows, ' +
    (tabs ? tabs.labels.length + ' tab labels (' + tabs.shape + ')' : 'no tab nav') + ', ' +
    (buttonCount === null ? 'no Layers button' : 'Layers button at ' + buttonCount) + ', ' +
    (panel ? panel.headers.length + ' category headers / ' + panel.names.length + ' layer rows' : 'no layers panel') + ', ' +
    buildable.length + ' buildable rows' + (permit ? ', ' + permit.length + ' permit columns' : ''));
}

/* The design's own declarations about the product, checked against the product. The README
   and the canvas annotation both state the layer total and the category count; a declaration
   nobody re-reads is how a design and its source drift apart. */
const README = fs.readFileSync(new URL('./README.md', import.meta.url), 'utf8');
const CANVAS = JSON.parse(fs.readFileSync(new URL('./canvas.json', import.meta.url), 'utf8'));
const annotationText = (CANVAS.annotations || []).map((a) => a.text).join('\n');
const LAYER_TOTAL_RE = /(?:Fifty-two|52)\s+layers/i;
let declaredHits = 0;
for (const [where, text] of [['README', README], ['canvas annotation', annotationText]]) {
  if (LAYER_TOTAL_RE.test(text)) {
    declaredHits += 1;
    if (LAYERS !== 52) notes.push(where + ' states 52 layers and the product at ' + S._source.commit.slice(0, 8) + ' carries ' + LAYERS);
  } else {
    notes.push(where + ' no longer states the layer total, so that number is no longer under review');
  }
}
if (declaredHits === 0) fail('neither the README nor the canvas annotation states the layer total, so the design makes no number that can be compared with the product');
const sevenHit = /seven categories/i.test(annotationText) || /seven categories/i.test(README);
if (!sevenHit) notes.push('neither the README nor the canvas annotation states the category count any more');
else if (DECLARED_CATEGORIES !== 7) notes.push('the design says seven categories and the product at ' + S._source.commit.slice(0, 8) + ' declares ' + DECLARED_CATEGORIES);

const onDisk = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html'));
for (const f of onDisk) if (!DECLARED.has(f)) fail(f + ': an artboard on disk that this instrument does not declare, so it was never checked');
if (!onDisk.length) fail('no artboards on disk at all');

console.log('');
console.log('matched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));

fs.writeFileSync(
  new URL('./instrument-report.json', import.meta.url),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      lane: 'g148-design-instruments',
      design: 'smartcity-map-dock',
      source: S._source,
      productFacts: { layerCount: LAYERS, categoriesPresent: CATEGORIES.length, categoriesDeclared: DECLARED_CATEGORIES, defaultVisibleCount: ACTIVE, navLenses: LENS_LABELS.length, navWork: WORK_LABELS.length, dsTabs: TAB_LABELS.length },
      matchedInputs: totals,
      notes,
      findings: problems,
    },
    null,
    2,
  ) + '\n',
);

for (const n of notes) console.log('NOTE ' + n);
if (notes.length) console.log('');

if (problems.length) {
  for (const p of problems) console.error('FAIL ' + p);
  console.error('\n' + problems.length + ' violation(s).');
  process.exit(1);
}
const vacuous = REQUIRED.filter((k) => totals[k] === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard -- ' + vacuous.join(', ') + '.');
  console.error('A predicate with no inputs has not passed, it has not run.');
  process.exit(2);
}
console.log('PASS ' + totals.boardsRead + ' artboards, ' + totals.navRows + ' nav rows, ' + totals.tabLabels + ' tab labels, ' +
  totals.panelHeaders + ' category headers and ' + totals.refusedRows + ' refused rows read, against ' + S._source.ref + ' ' +
  S._source.commit.slice(0, 12) + ' (design record: instrument-report.json)');
