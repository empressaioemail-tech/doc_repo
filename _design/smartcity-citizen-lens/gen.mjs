/**
 * SmartCity OS — Citizen lens.
 *
 *   node dump-source-state.mjs --repo <clone>   refresh the product facts
 *   node gen.mjs                                rewrite every artboard and canvas.json
 *   node check.mjs                              the adversarial read, as a file
 *   node violate.mjs                            verify check.mjs by violating the real boards
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS LENS IS, AND WHY ITS DESIGN IS MOSTLY ABOUT ONE WORD
 *
 * The Citizen lens is the only surface a resident ever sees, and it is the only
 * shipped lens with a MEASURED ZERO behind it: `0 of 11` entries in the
 * product's own DOMAIN_REGISTRY carry `lensId: citizen` (source-state.json,
 * registry.citizenCount). Every other lens's regions are registry entries, each
 * with a `gatedBy` vendor, so each can be empty WITH A BASIS. This one's four
 * panels are hand-written markup, so there is nothing for a grant to attach to.
 * The server agrees: of the three `/api/lenses/...` route literals in
 * src/server.mjs, zero name citizen.
 *
 * The second fact is that the shipped surface is already, on ONE of its four
 * panels, exactly right. The address lookup is DISABLED with its basis printed
 * under it rather than hidden, and src/ui.test.mjs:343 pins that copy. That is
 * the discipline. The design's whole job is to extend it to the other three
 * panels rather than to regress it.
 *
 * The third fact is the one that decides the design. The four panels are not
 * four flavours of the same absence. They are four DIFFERENT distances from
 * data, and the shipped chrome renders three of them as reassurance prose with
 * no state word at all:
 *
 *   no-region      there is no place to attach a source  (the registry has no
 *                  citizen domain, so a grant would have nothing to fill)
 *   no-capability  the product does not do this on ANY city (`payments: false`
 *                  on all four lead lenses; the shipped basis scopes it to
 *                  "this city", which is a different sentence)
 *   no-source      the product does this; this city has not connected it
 *   no-identity    the lens cannot establish WHICH RESIDENT is asking. It is
 *                  public-free and holds no account, so no per-resident count
 *                  is measurable by any grant, on any city, ever.
 *
 * and a fifth state the design exists to keep separate from all four:
 *
 *   measured zero  a reading was taken and the count is 0. That is a
 *                  measurement. "Not read" is not. Collapsing them is the
 *                  defect class this program hunts, and this lens is where the
 *                  temptation is strongest because there is so little data.
 *
 * THE SHIPPED PANEL THE DESIGN CHANGES, and it changes one word. "Your requests"
 * carries `<span class="pill p-quiet">None on file</span>`. Two things are
 * wrong with it and both are mechanical, not stylistic. FIRST, it is outside the
 * product's own badge vocabulary — badgeWords in source-state.json is Empty /
 * Not built / Not read / Preview / Not connected, and check.mjs proves the rule
 * can fire by finding "None on file" outside that set on the SHIPPED side.
 * SECOND, "None on file" is a ZERO about a subject the lens has never
 * established: it is a claim that this resident has no requests, on a surface
 * that by design does not know who is reading. The honest word is "Not read",
 * and the honest sentence is why.
 *
 * THE TWELVE-TILE GRID. src/shell-homes.mjs:146 records the history —
 * "Citizen lens. The twelve-tile grid was dropped." — and this design does not
 * re-propose it. A tile is a measured figure, and there is no measurement on
 * this lens to put in one. check.mjs refuses both a `data-tile` attribute and a
 * `class="metrics"` strip on any Citizen board, by name.
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* ------------------------------------------------------------- primitives */

/** The product's badge vocabulary, from source-state.json. Never add a word here. */
const BADGE = {
  'Empty': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not built': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not read': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Preview': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};
for (const w of Object.keys(BADGE)) {
  if (!S.badgeWords.includes(w)) throw new Error('badge "' + w + '" is not in the product vocabulary; gen.mjs refuses to invent one');
}
if (S.badgeWords.some((w) => !(w in BADGE))) throw new Error('gen.mjs is missing a product badge word; a divergence test, not a careful edit');

/** The design's closed mechanism set. One word per distance from data. */
const MECHANISMS = {
  'no-region': {
    label: 'No region registered',
    tone: '--sc-crit',
    gloss: 'the surface is not in the product\'s registry, so there is nothing a grant could attach to and no number here is a claim about a place',
  },
  'no-capability': {
    label: 'Not a capability',
    tone: '--sc-crit',
    gloss: 'the product does not do this on any city, so a city-scoped basis would be the wrong sentence',
  },
  'no-source': {
    label: 'No source connected',
    tone: '--sc-warn',
    gloss: 'the product does this and a source exists; this city has not connected it, and this sentence varies by city',
  },
  'no-identity': {
    label: 'No subject to measure',
    tone: '--sc-restricted',
    gloss: 'the lens is public and holds no account, so no per-resident count is measurable by any grant on any city',
  },
};
for (const k of Object.keys(MECHANISMS)) {
  if (/[^a-z-]/.test(k)) throw new Error('mechanism id "' + k + '" is outside the closed set shape');
}

const esc = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t];
  return '<span data-badge style="flex:none; font:500 12px/16px var(--sc-font-data); color:' + c + '; background:' + w +
    '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

/**
 * The mechanism chip is deliberately NOT a badge. It is not a state word and must
 * never be read as one: check.mjs refuses a mechanism word inside data-state.
 */
const mechChip = (id) => {
  const m = MECHANISMS[id];
  if (!m) throw new Error('unknown mechanism ' + id);
  return '<span data-mechanism-chip="' + id + '" style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.04em; ' +
    'color:var(' + m.tone + '); background:var(--sc-surface-2); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); ' +
    'padding:1px 6px; white-space:nowrap;">' + m.label + '</span>';
};

const basisLine = (t, max) =>
  '<span data-basis style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); ' +
  'padding-left:var(--sc-3); display:inline-block; max-width:' + (max || 118) + 'ch;">' + esc(t) + '</span>';

/**
 * A figure. `measured` is the whole point: a measured figure MUST carry a
 * counting rule, and an unmeasured one must not carry a count at all.
 * `scope` is "region" or "product" — a product-scoped figure (the registry
 * census) is a fact about the PRODUCT and is allowed on a board whose regions
 * can report nothing.
 */
const figure = (o) => {
  const style = 'font:600 ' + (o.big ? '24px/30px' : '15px/20px') + ' var(--sc-font-data); color:var(' + (o.tone || '--sc-ink') + ');';
  if (o.measured) {
    return '<span data-figure data-measured="1" data-scope="' + o.scope + '" data-count="' + o.count +
      '" data-counting-rule="' + esc(o.rule) + '"' + (o.big ? ' data-figure-lead="1"' : '') +
      ' style="' + style + '">' + o.count + '</span>';
  }
  return '<span data-figure data-measured="0" data-scope="' + o.scope + '" style="' + style + '">Not read</span>';
};

const cell = (t, tone) =>
  '<span data-cell style="font:400 13px/18px var(--sc-font-ui); color:var(' + (tone || '--sc-ink-2') + ');">' + esc(t) + '</span>';

const kitCell = (t) =>
  '<span data-cell data-mono style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink);">' + esc(t) + '</span>';

/* --------------------------------------------------------------- chrome */

/**
 * The shipped nav at this ref. The badge words are the ones src/ui.test.mjs
 * pins for the nav (ui.test.mjs:393-413) and check.mjs re-checks the only one
 * that belongs to this design against source-state.json rather than trusting
 * this table. The `Citizen` row is the selected one.
 */
const NAV_BADGES = [
  ['Overview', 'Empty'], ['Development services', 'Empty'], ['Finance', 'Not read'],
  ['Citizen', 'Preview'], ['Public works', 'Not read'], ['Police', 'Not read'],
  ['Fire and EMS', 'Not read'], ['Fleet', 'Not read'],
];
const NAV_WORK = [['Plan review', 'Preview'], ['Files', 'Preview'], ['Records search', 'Not built']];
const NAV_CITY = [['Assets', 'Empty'], ['Connections', ''], ['People and access', 'Not built']];

const navRow = (n, b, on, lensId) =>
  '          <div' + (lensId ? ' data-lens="' + lensId + '"' : '') +
  ' style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); ' +
  'background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') +
  '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; ' +
  'padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', NAV_BADGES.map(([n, b]) => navRow(n, b, n === 'Citizen', n === 'Citizen' ? 'citizen' : null))) + '\n' +
  navGroup('Work', NAV_WORK.map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', NAV_CITY.map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); ' +
  'color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

/**
 * The top bar. The Citizen lens is a scoped-LIGHT surface in the product
 * (.cz-scroll.sc-light), and `data-light-scope="1"` records that on the board so
 * check.mjs can hold the boards to the shipped mechanism rather than to a theme
 * somebody chose. The fixture badge is emitted only when the board is a fixture.
 */
const topbar = (city, env, fixture) =>
  '    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); ' +
  'background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
  '      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; ' +
  'font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>\n' +
  '      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
  '      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); ' +
  'border-radius:var(--sc-r-control); padding:1px 6px;">' + env + '</span>\n' +
  (fixture
    ? '      <span data-fixture-badge style="font:600 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-warn); ' +
      'background:var(--sc-warn-wash); border-radius:var(--sc-r-control); padding:1px 6px;">DEMO FIXTURE</span>\n'
    : '') +
  '      <div style="flex:1;"></div>\n' +
  '      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
  '        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Citizen</span>\n' +
  '        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">Public lens, no account required</span>\n' +
  '      </div>\n    </header>';

const panelHead = (o) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); ' +
  'border-bottom:1px solid var(--sc-line-faint);">\n' +
  '            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink); white-space:nowrap;">' + o.title + '</span>\n' +
  (o.badgeWord ? '            ' + badge(o.badgeWord) + '\n' : '') +
  (o.mechanism ? '            ' + mechChip(o.mechanism) + '\n' : '') +
  '            <div style="flex:1;"></div>\n' +
  (o.right ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.right + '</span>\n' : '') +
  '          </div>';

const metaRow = (pairs) =>
  '            <div style="display:flex; flex-wrap:wrap; gap:var(--sc-2) var(--sc-4); padding:var(--sc-2) 0 0;">\n' +
  pairs.map(([k, v]) => '              <span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">' +
    '<span style="color:var(--sc-ink-2);">' + k + '</span> ' + v + '</span>').join('\n') + '\n            </div>';

/**
 * A region. The closing marker is explicit (`<!--/region-->`) rather than an
 * inferred tag boundary, because check.mjs slices these and a slice that guesses
 * its own end is a slice that reads the wrong evidence.
 */
const region = (o, body) =>
  '        <div data-region="' + o.id + '" data-state="' + o.state + '" data-mechanism="' + o.mechanism + '" style="flex:none; border:1px solid var(--sc-line); ' +
  'border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
  panelHead({ title: o.title, badgeWord: o.state, mechanism: o.mechanism, right: o.right }) + '\n' +
  '          <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
  body + '\n          </div>\n' +
  '          <div style="padding:0 var(--sc-4) var(--sc-3);">' + basisLine(o.basis) + '</div>\n' +
  '        </div><!--/region-->';

/**
 * A row list. A cell is either a plain string (text, escaped for you) or an
 * element already built by `cell`/`kitCell` — those are passed through, because
 * escaping markup twice is how a board ends up showing its own source.
 */
const rowList = (items, cols) =>
  '            <div style="display:flex; flex-direction:column; border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); overflow:hidden;">\n' +
  items.map((r, i) =>
    '              <div' + (r.attrs || '') + ' style="display:grid; grid-template-columns:' + cols + '; gap:var(--sc-3); padding:6px var(--sc-3); ' +
    'align-items:baseline;' + (i ? ' border-top:1px solid var(--sc-line-faint);' : '') + '">' +
    r.cells.map((c) => (typeof c === 'string' && c[0] !== '<' ? cell(c) : c)).join('') + '</div>').join('\n') + '\n            </div>';

/** The page shell. `data-lens-body="citizen"` is the scope marker check.mjs requires. */
function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
    '<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
    topbar(o.city, o.env, o.fixture) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.foot) + '\n' +
    '    <main data-lens-body="citizen"' + (o.fixture ? ' data-fixture="1"' : '') + ' data-light-scope="1" ' +
    'style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4); background:var(--sc-canvas);">\n' +
    o.body + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
    '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'light') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
    'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'light') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const pageHead = (o) =>
  '      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
  '        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Citizen</div>\n' +
  '        <div style="display:flex; align-items:center; gap:var(--sc-2);">' +
  '<h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' +
  badge(o.pageBadge) + '<div style="flex:1;"></div>' +
  '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
  '        <p style="margin:0; max-width:104ch; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>';

/* =========================================================== the data reads */

const FOOT = 'bastrop_tx &middot; staging pack<br>' +
  S.registry.citizenCount + ' of ' + S.registry.total + ' registered domains on this lens<br>' +
  'badges outside this lens are the shipped values at ' + S.snapshot.commit.slice(0, 8);

const CITY = 'Bastrop, TX';
const PACK_NAME = 'Bastrop';

/** The four shipped panel bodies, quoted. gen.mjs throws if the product moved one. */
const SHIPPED = S.shipped;
for (const [k, v] of Object.entries({
  lookupBasis: SHIPPED.lookupBasis,
  requestsCopy: SHIPPED.requestsCopy,
  paymentsCopy: SHIPPED.paymentsCopy,
  paymentsBasis: SHIPPED.paymentsBasis,
  meetingsCopy: SHIPPED.meetingsCopy,
  meetingsProvenance: SHIPPED.meetingsProvenance,
})) {
  if (typeof v !== 'string' || v.length < 8) throw new Error('shipped.' + k + ' is missing from source-state.json; re-dump before generating');
}

/** The design's central derived fact, restated so it cannot drift from the dump. */
if (S.registry.citizenCount !== 0) {
  throw new Error('the Citizen lens now has ' + S.registry.citizenCount + ' registered domains; this design reads as a surface with no region to fill and is out of date, not merely stale');
}
if (S.routes.citizenComposerRoutes !== 0) {
  throw new Error('the server now carries a citizen composer route; the "no route composes this lens" claim on the board is false, re-derive');
}
if (S.lens.accessPolicy !== 'public-free' || S.lens.skuName !== null || S.lens.payments !== false) {
  throw new Error('the citizen lens record moved; accessPolicy/skuName/payments are the three fields this design quotes');
}

/** The shipped pill the design changes, and the proof that it is outside the vocabulary. */
const SHIPPED_QUIET_PILLS = SHIPPED.panelQuietPills;
const OUTSIDE_VOCAB = SHIPPED_QUIET_PILLS.filter((p) => !S.badgeWords.includes(p));
if (OUTSIDE_VOCAB.length !== 1 || OUTSIDE_VOCAB[0] !== 'None on file') {
  throw new Error('the shipped quiet pills are ' + JSON.stringify(SHIPPED_QUIET_PILLS) + '; this design was written against exactly one pill outside the vocabulary, "None on file"');
}

/* ---------------------------------------------------------------- board 1 */

const main = artboard({
  city: CITY, env: 'STAGING', theme: 'light',
  h1: 'Near you', pageBadge: SHIPPED.statePill,
  pageRule: S.registry.citizenCount + ' of ' + S.registry.total + ' registered domains on this lens, and 4 of 4 regions with a printed basis',
  lede: 'See what is happening around an address in ' + PACK_NAME + '. Nothing here requires an account. This is a public lens, not a separate product. ' +
    'Each of the four regions below states which distance it is from data, and prints the basis for saying so.',
  foot: FOOT,
  body:
    pageHead({
      city: CITY, h1: 'Near you', pageBadge: SHIPPED.statePill,
      pageRule: S.registry.citizenCount + ' of ' + S.registry.total + ' registered domains on this lens, and 4 of 4 regions with a printed basis',
      lede: 'See what is happening around an address in ' + PACK_NAME + '. Nothing here requires an account. This is a public lens, not a separate product. ' +
        'Each of the four regions below states which distance it is from data, and prints the basis for saying so.',
    }) + '\n' +
    '      <div style="display:flex; gap:var(--sc-4); min-height:0;">\n' +
    '        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +

    /* region 1 — the exemplar, and the one the product already gets right */
    region({
      id: 'lookup', title: SHIPPED.panelTitles[0], state: 'Not built', mechanism: 'no-region',
      right: 'the product already does this one right',
      basis: SHIPPED.lookupBasis,
    },
    '            <div style="display:flex; gap:var(--sc-3); align-items:center; flex-wrap:wrap;">\n' +
    '              <span style="display:inline-flex; height:44px; min-width:260px; align-items:center; padding:0 var(--sc-3); border:1px solid var(--sc-line); ' +
    'border-radius:var(--sc-r-control); background:var(--sc-surface-3); color:var(--sc-ink-3); font:400 15px/22px var(--sc-font-ui);" ' +
    'data-control="address-input" data-disabled="1">Enter an address</span>\n' +
    '              <span style="display:inline-flex; height:44px; align-items:center; padding:0 var(--sc-5); border:1px solid var(--sc-line); ' +
    'border-radius:var(--sc-r-control); background:var(--sc-surface-3); color:var(--sc-ink-3); font:500 15px/22px var(--sc-font-ui);" ' +
    'data-control="lookup-button" data-disabled="1">Look up</span>\n' +
    figure({ measured: false, scope: 'region' }) + '\n' +
    '            </div>\n' +
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.lookupBasis) + '</p>') + '\n' +

    /* region 2 — the one word the design changes */
    region({
      id: 'requests', title: SHIPPED.panelTitles[1], state: 'Not read', mechanism: 'no-identity',
      right: 'was "' + OUTSIDE_VOCAB[0] + '"',
      basis: 'Basis: this lens is ' + S.lens.accessPolicy + ' and holds no account, so it cannot establish which resident is asking. A count of "your" requests is not unmeasured because a source is missing; it is unmeasurable until a lookup identifies a subject. The shipped pill read "' + OUTSIDE_VOCAB[0] + '", which is a zero about a subject the lens never established and is outside the product\'s own badge vocabulary (' + S.badgeWords.join(' / ') + ').',
    },
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.requestsCopy) + '</p>\n' +
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">Until an address is resolved, this region cannot know whether there is a case to show you, so it reports that it has not read rather than that it found none.</p>\n' +
    '            <div style="display:flex; gap:var(--sc-3); align-items:center;">' + figure({ measured: false, scope: 'region' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">no subject established, so no count is drawn</span></div>') + '\n' +

    /* region 3 — a PRODUCT absence the shipped basis scopes to a city */
    region({
      id: 'payments', title: SHIPPED.panelTitles[2], state: 'Not connected', mechanism: 'no-capability',
      right: 'the product\'s absence, not this city\'s',
      basis: 'Basis: ' + SHIPPED.paymentsBasis.replace(/^Basis:\s*/, '') + ' And the scope is the product, not the city: payments is false on all ' + S.leadLensIds.length + ' lead lenses in src/lenses.mjs, so no city can connect a processor to this panel. Counter address and hours are a different thing — a city fact this pack has not supplied — and the panel names both, which is why the design leaves the copy untouched and states the scope underneath it.',
    },
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.paymentsCopy) + '</p>\n' +
    '            <div style="display:flex; gap:var(--sc-3); align-items:center;">' + figure({ measured: false, scope: 'region' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">no processor exists to connect</span></div>') + '\n' +

    /* region 4 — a product capability with a real source and no path to this lens */
    region({
      id: 'meetings', title: SHIPPED.panelTitles[3], state: 'Not connected', mechanism: 'no-source',
      right: 'source: ' + SHIPPED.meetingsProvenance,
      basis: 'Basis: the source is named on the panel — ' + SHIPPED.meetingsProvenance + ' — and the shipped copy states a CONDITION ("when a clerk grant has written them to files") without stating whether the condition is met. The design\'s change is that this region must say which condition it is in. It does not say today, and the register row that governs it declares a state with no pack attached, so the two cannot be reconciled here.',
    },
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.meetingsCopy) + '</p>\n' +
    '            <div style="display:flex; gap:var(--sc-3); align-items:center;">' + figure({ measured: false, scope: 'region' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">condition stated, condition not reported</span></div>') + '\n' +

    '        </div>\n' +
    '        <div style="width:430px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +

    /* the lens at a glance */
    '          <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'The lens at a glance', sub: '' }) + '\n' +
    '            <div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
    '              <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:var(--sc-2) var(--sc-3); align-items:baseline;">\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Registered domains on this lens</span>' +
    figure({ measured: true, scope: 'product', count: S.registry.citizenCount, tone: '--sc-crit', big: true, rule: S.registry.countingRule }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Route literals naming this lens</span>' +
    figure({ measured: true, scope: 'product', count: S.routes.citizenComposerRoutes, tone: '--sc-crit', big: true, rule: S.routes.countingRule }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Regions on the shipped surface</span>' +
    figure({ measured: true, scope: 'product', count: S.shipped.panelTitles.length, big: true, rule: 'one increment per <span class="t"> panel head inside <section id="lens-citizen">, read from web/index.html at this ref' }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Regions with a printed basis, shipped</span>' +
    figure({ measured: true, scope: 'product', count: 1, tone: '--sc-warn', big: true, rule: 'one increment per region carrying a <span class="basis"> or an id-named basis paragraph; shipped value is 1 of 4 (the lookup), read from web/index.html at this ref' }) + '\n' +
    '              </div>\n' +
    '              <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Two of these four are measurements of the PRODUCT and they are the reason this lens is a different design problem from every other one: it is not a surface whose sources are late. It is a surface with nowhere to put one.</p>\n' +
    '            </div>\n' +
    '          </section>\n' +

    '          <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'What this lens is', sub: 'from the product\'s own catalogue' }) + '\n' +
    '            <div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
    metaRow([
      ['audience', esc(S.lens.audience)],
      ['access', esc(S.lens.accessPolicy)],
      ['sku', S.lens.skuName === null ? 'none — the capability is the lens, not a product' : esc(S.lens.skuName)],
      ['payments', String(S.lens.payments)],
      ['staff role', S.roles.citizenIsAStaffRole ? 'yes' : 'none — nobody at a city is the citizen department'],
    ]) + '\n' +
    '              <div style="display:flex; flex-wrap:wrap; gap:var(--sc-2); padding-top:var(--sc-1);">' +
    kitCell('lenses.mjs: id ' + S.lens.id + ', audience ' + S.lens.audience + ', accessPolicy ' + S.lens.accessPolicy) + '</div>\n' +
    '            </div>\n          </section>\n' +

    '          <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'The four distances', sub: 'not four flavours of one absence' }) + '\n' +
    '            <div style="padding:var(--sc-3) var(--sc-4) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
    Object.entries(MECHANISMS).map(([id, m]) =>
      '              <div style="display:grid; grid-template-columns:132px minmax(0,1fr); gap:var(--sc-3); align-items:start;">' +
      '<span style="font:500 12px/18px var(--sc-font-data); color:var(' + m.tone + ');">' + id + '</span>' +
      '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + m.gloss + '</span></div>').join('\n') + '\n' +
    '              <p style="margin:var(--sc-2) 0 0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">The shipped chrome renders three of these four as prose with no state word at all, and renders the fourth with a zero. The design\'s only structural rule is that a region prints a state word, a distance and a basis, or it prints none of the three.</p>\n' +
    '            </div>\n          </section>\n' +

    '        </div>\n      </div>',
});

/* ---------------------------------------------------------------- board 2 */

/** A distance card. Its own closing marker, for the same reason the regions have one. */
const distance = (o) =>
  '          <div data-distance="' + o.id + '" style="flex:1; min-width:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); ' +
  'background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
  '            <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2); border-bottom:1px solid var(--sc-line-faint); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
  '              <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:' +
  o.tone + ';">' + o.kicker + '</span>' + (o.badgeWord ? badge(o.badgeWord) : '') + '<div style="flex:1;"></div>' + (o.right || '') + '</div>\n' +
  '              <h3 style="margin:0; font:620 16px/22px var(--sc-font-ui); color:var(--sc-ink);">' + o.head + '</h3>\n' +
  '            </div>\n' +
  '            <div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2); flex:1;">\n' +
  o.body + '\n            </div>\n' +
  '            <div style="padding:0 var(--sc-4) var(--sc-3);">' + basisLine(o.basis, 52) + '</div>\n' +
  '          </div><!--/distance-->';

const distances = artboard({
  city: CITY, env: 'STAGING', theme: 'light',
  h1: 'The distances this lens keeps apart', pageBadge: '',
  pageRule: 'five cards, and only one of them carries a figure',
  lede: 'This is the board the design exists for. The Citizen lens has the least data behind it of any shipped surface, which makes it the surface where absent, zero and unmeasured are most tempting to render as the same thing. They are not the same thing, they do not ask the same person to do the same work, and the figure that appears on this board appears exactly once.',
  foot: FOOT,
  body:
    pageHead({
      city: CITY, h1: 'The distances this lens keeps apart', pageBadge: '',
      pageRule: 'five cards, and only one of them carries a figure',
      lede: 'This is the board the design exists for. The Citizen lens has the least data behind it of any shipped surface, which makes it the surface where absent, zero and unmeasured are most tempting to render as the same thing. They are not the same thing, they do not ask the same person to do the same work, and the figure that appears on this board appears exactly once.',
    }) + '\n' +
    '      <div style="display:flex; gap:var(--sc-3); align-items:stretch;">\n' +

    distance({
      id: 'no-region', kicker: 'NOT A REGION', tone: 'var(--sc-crit)', badgeWord: 'Not built',
      head: 'There is nowhere to put a source.', right: kitCell('0 of ' + S.registry.total),
      body: '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">No entry in the product\'s registry carries this lens, so a grant would have nothing to attach to. The lookup names the consequence exactly: a parcel identifier is never required, and an address is answered from public record once a source is connected.</p>\n' +
        '            <div style="display:flex; align-items:baseline; gap:var(--sc-2);">' + kitCell('registry entries with lensId citizen:') + figure({ measured: true, scope: 'product', count: S.registry.citizenCount, tone: '--sc-crit', rule: S.registry.countingRule }) + '</div>',
      basis: 'Basis: ' + S.registry.total + ' entries in DOMAIN_REGISTRY at ' + S.snapshot.commit.slice(0, 8) + ', of which ' + S.registry.citizenCount + ' carry lensId citizen. ' + S.registry.countingRule + '.',
    }) +

    distance({
      id: 'no-capability', kicker: 'NOT A CAPABILITY', tone: 'var(--sc-crit)', badgeWord: 'Not connected',
      head: 'The product does not do this anywhere.', right: kitCell('payments ' + String(S.lens.payments)),
      body: '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Payments is false on all ' + S.leadLensIds.length + ' lead lenses, so this is not a city that has not connected a processor — it is a product with no payment capability to connect. The shipped basis says "no payment processor connected for this city", which is the city-scoped sentence for a product-scoped absence.</p>\n' +
        '            <div style="display:flex; align-items:baseline; gap:var(--sc-2);">' + kitCell('lead lenses reporting payments true:') + figure({ measured: true, scope: 'product', count: S.leadLensIds.filter(() => S.lens.payments === true).length, tone: '--sc-crit', rule: 'one increment per lead lens in src/lenses.mjs whose payments field is true; the field is read from the module rather than from prose' }) + '</div>',
      basis: 'Basis: src/lenses.mjs, LEAD_LENSES; listLenses() projects payments as ' + String(S.lens.payments) + ' for every lead lens at this ref.',
    }) +

    distance({
      id: 'no-source', kicker: 'A SOURCE EXISTS', tone: 'var(--sc-warn)', badgeWord: 'Not connected',
      head: 'This city has not connected it.', right: kitCell(SHIPPED.meetingsProvenance),
      body: '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">The product does this and the source is nameable. The shipped panel prints the condition it is in — "when a clerk grant has written them to files" — and does not say whether it is met. This is the one distance on this board that a GRANT changes, and the one whose sentence is allowed to vary by city.</p>\n' +
        '            <div style="display:flex; align-items:baseline; gap:var(--sc-2);">' + kitCell('reading taken for this region:') + figure({ measured: false, scope: 'region' }) + '</div>',
      basis: 'Basis: the condition is quoted from web/index.html at this ref. Whether it is met for any pack is UNESTABLISHED here, and the design states it as unestablished rather than printing a pack name against it.',
    }) +

    distance({
      id: 'no-identity', kicker: 'NO SUBJECT', tone: 'var(--sc-restricted)', badgeWord: 'Not read',
      head: 'No grant can measure this one.', right: kitCell(S.lens.accessPolicy),
      body: '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">"Your requests" is a count of one resident\'s cases on a lens that holds no account and does not know who is reading. The shipped pill said "None on file", which is a zero about a subject that was never established. This is the only distance on this board that no source and no pack can move.</p>\n' +
        '            <div style="display:flex; align-items:baseline; gap:var(--sc-2);">' + kitCell('per-resident counts measurable:') + figure({ measured: false, scope: 'region' }) + '</div>',
      basis: 'Basis: accessPolicy is ' + S.lens.accessPolicy + ' and skuName is ' + String(S.lens.skuName) + ' in src/lenses.mjs, so no account, session or identifier reaches this lens. It is a statement about the design, not about a backlog.',
    }) +

    distance({
      id: 'measured-zero', kicker: 'A MEASUREMENT', tone: 'var(--sc-ok)', badgeWord: 'Empty',
      head: 'A reading was taken. It says zero.', right: kitCell('this is the only figure here'),
      body: '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Zero is not the same object as "not read", and this board has exactly one of each so that the difference is visible rather than described. A measured zero carries the rule that produced it; an unmeasured region carries the word and no number at all.</p>\n' +
        '            <div style="display:flex; align-items:baseline; gap:var(--sc-2);">' + kitCell('registry entries carrying this lens:') + figure({ measured: true, scope: 'product', count: S.registry.citizenCount, tone: '--sc-ok', rule: S.registry.countingRule }) + '</div>',
      basis: 'Basis: ' + S.registry.countingRule + '. This same zero appears as "Not read" on four regions of the Main board, and the two renderings are deliberately not interchangeable.',
    }) +

    '      </div>\n' +
    '      <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'Two states this lens cannot reach, named so nobody reaches for them', sub: '' }) + '\n' +
    '        <div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
    '          <div style="display:grid; grid-template-columns:132px minmax(0,1fr); gap:var(--sc-3); align-items:start;">' +
    '<span style="font:500 12px/18px var(--sc-font-data); color:var(--sc-ink-3);">ungranted</span>' +
    '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A registered region whose vendor this city has not granted. The product renders it today on Police and Fleet. It needs a registered region to exist first, and this lens has none, so the state cannot occur here.</span></div>\n' +
    '          <div style="display:grid; grid-template-columns:132px minmax(0,1fr); gap:var(--sc-3); align-items:start;">' +
    '<span style="font:500 12px/18px var(--sc-font-data); color:var(--sc-ink-3);">granted-empty</span>' +
    '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A granted generator that returned zero records. Also needs a registered region. Also cannot occur here.</span></div>\n' +
    '          <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Naming them is the point: a design that drew either one would be drawing a state the registry makes unreachable, and would read as a promise that a grant is all this lens is waiting for.</p>\n' +
    '        </div>\n      </section>',
});

/* ---------------------------------------------------------------- board 3 */

/**
 * The contract board, FIXTURE-BADGED. It draws what each region must carry in
 * order to be allowed to print a figure, and every row on it is a fixture that
 * says so. It is not a roadmap: the two regions the product cannot feed stay
 * unfed on this board too, because a fixture cannot manufacture a payment
 * processor or an identity.
 */
const filled = artboard({
  city: CITY, env: 'STAGING', theme: 'light', fixture: true,
  h1: 'What a fed region owes the reader', pageBadge: '',
  pageRule: '2 of 4 regions carry a fixture figure, and each names the rule that produced it',
  lede: 'The board is a fixture. Every row below is generated, badged DEMO FIXTURE and is not a city record. What it shows is the contract a region signs before it is allowed to print a number: a state word from the product\'s own vocabulary, one of the four distances, a basis, and — if it prints a figure at all — the rule that produced it.',
  foot: FOOT + '<br>fixture board: generated rows, not city records',
  body:
    pageHead({
      city: CITY, h1: 'What a fed region owes the reader', pageBadge: '',
      pageRule: '2 of 4 regions carry a fixture figure, and each names the rule that produced it',
      lede: 'The board is a fixture. Every row below is generated, badged DEMO FIXTURE and is not a city record. What it shows is the contract a region signs before it is allowed to print a number: a state word from the product\'s own vocabulary, one of the four distances, a basis, and — if it prints a figure at all — the rule that produced it.',
    }) + '\n' +
    '      <div style="display:flex; gap:var(--sc-4); min-height:0;">\n' +
    '        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +

    region({
      id: 'lookup', title: 'Look up an address', state: 'Preview', mechanism: 'no-region',
      right: 'a fixture figure, with its rule',
      basis: 'Basis: 1 fixture address matched of 1 supplied, from the generated fixture set at this ref. Counting rule: one increment per supplied address that resolves to a parcel key in the fixture set; an address that does not resolve is counted and reported separately, never dropped. No region is registered for this lens, so this is a fixture number and the state word says so.',
    },
    '            <div style="display:flex; gap:var(--sc-3); align-items:baseline;">' + kitCell('addresses resolved') +
    figure({ measured: true, scope: 'region', count: 1, rule: 'one increment per supplied address that resolves to a parcel key in the fixture set' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">of 1 supplied, fixture</span></div>\n' +
    rowList([
      { attrs: ' data-fixture-row="1"', cells: [kitCell('FIX-ADDR-0001'), cell('Generated fixture address, not a city record'), kitCell('resolved')] },
    ], 'minmax(0,1fr) minmax(0,1.6fr) 90px')) + '\n' +

    region({
      id: 'meetings', title: 'Public meetings', state: 'Preview', mechanism: 'no-source',
      right: 'a measured zero, with its rule',
      basis: 'Basis: 0 meeting records in the generated fixture set at this ref, with no clerk calendar connected for this city. Counting rule: one increment per fixture meeting record this pack carries; zero here is a reading the fixture took, not a region that was skipped. A region nobody read prints "Not read" and no figure at all, which is what the two regions below do.',
    },
    '            <div style="display:flex; gap:var(--sc-3); align-items:baseline;">' + kitCell('meeting records written') +
    figure({ measured: true, scope: 'region', count: 0, tone: '--sc-ok', rule: 'one increment per meeting record the fixture set carries for this pack; zero is a reading that was taken' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">measured, not assumed</span></div>\n' +
    rowList([
      { attrs: ' data-fixture-row="1"', cells: [kitCell('FIX-MTG-0001'), cell('No agenda is invented, so this fixture row carries the absence itself'), kitCell('none')] },
    ], 'minmax(0,1fr) minmax(0,1.6fr) 90px')) + '\n' +

    region({
      id: 'requests', title: 'Your requests', state: 'Not read', mechanism: 'no-identity',
      right: 'a fixture cannot manufacture this',
      basis: 'Basis: unchanged from the un-fed board, and that is the finding. A fixture can supply addresses and meetings; it cannot supply an identity, because this lens holds no account by design. The region stays unread on a board where two other regions carry figures, which is exactly the distinction the design is for.',
    },
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.requestsCopy) + '</p>\n' +
    '            <div style="display:flex; gap:var(--sc-3); align-items:center;">' + figure({ measured: false, scope: 'region' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">a fixture is not an identity</span></div>') + '\n' +

    region({
      id: 'payments', title: 'Pay permit fees', state: 'Not connected', mechanism: 'no-capability',
      right: 'a fixture cannot manufacture this either',
      basis: 'Basis: unchanged from the un-fed board. payments is false on every lead lens, so no fixture and no grant turns this panel into a capability. It is drawn here rather than omitted because a contract board that quietly dropped the regions a fixture cannot fill would flatter the design.',
    },
    '            <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(SHIPPED.paymentsCopy) + '</p>\n' +
    '            <div style="display:flex; gap:var(--sc-3); align-items:center;">' + figure({ measured: false, scope: 'region' }) +
    '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">no processor exists to connect</span></div>') + '\n' +

    '        </div>\n' +
    '        <div style="width:430px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
    '          <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'The contract, in one place', sub: '' }) + '\n' +
    '            <div style="padding:var(--sc-3) var(--sc-4) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
    '              <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:var(--sc-2) var(--sc-3); align-items:baseline;">\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Regions on this board</span>' + figure({ measured: true, scope: 'product', count: 4, rule: 'one increment per data-region block on this board, counted by check.mjs' }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Regions carrying a figure</span>' + figure({ measured: true, scope: 'product', count: 2, rule: 'one increment per region whose figure carries data-measured="1"' }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Regions carrying a measured zero</span>' + figure({ measured: true, scope: 'product', count: 1, rule: 'one increment per region whose figure carries data-measured="1" and data-count="0"' }) + '\n' +
    '                <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Figures without a counting rule</span>' + figure({ measured: true, scope: 'product', count: 0, tone: '--sc-ok', rule: 'one increment per data-figure element carrying data-measured="1" with an empty or absent data-counting-rule; the instrument refuses this board if the count is anything but the number it can support' }) + '\n' +
    '              </div>\n' +
    '              <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">The board is a fixture and it says so in three places: the DEMO FIXTURE badge in the top bar, the footer, and the row marker. A fixture that is not badged is the defect this board exists to prevent, and check.mjs refuses a board carrying fixture rows without the badge.</p>\n' +
    '            </div>\n          </section>\n' +
    '          <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    panelHead({ title: 'What this board may not show', sub: '' }) + '\n' +
    '            <div style="padding:var(--sc-3) var(--sc-4) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
    '              <div style="display:grid; grid-template-columns:24px minmax(0,1fr); gap:var(--sc-2); align-items:start;">' +
    '<span style="font:400 13px/19px var(--sc-font-data); color:var(--sc-crit);">x</span>' +
    '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A resident. Nobody is named on any board here, and a fixture row names a generated identifier instead.</span></div>\n' +
    '              <div style="display:grid; grid-template-columns:24px minmax(0,1fr); gap:var(--sc-2); align-items:start;">' +
    '<span style="font:400 13px/19px var(--sc-font-data); color:var(--sc-crit);">x</span>' +
    '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A metric strip. The twelve-tile grid was dropped once already; a tile is a measured figure and there is no measurement on this lens to put in one.</span></div>\n' +
    '              <div style="display:grid; grid-template-columns:24px minmax(0,1fr); gap:var(--sc-2); align-items:start;">' +
    '<span style="font:400 13px/19px var(--sc-font-data); color:var(--sc-crit);">x</span>' +
    '<span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A figure with no counting rule, including the number on this page. The instrument counts them and refuses the board when the count is not the number it can support.</span></div>\n' +
    '            </div>\n          </section>\n' +
    '        </div>\n      </div>',
});

/* ------------------------------------------------------------------ emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Distances.dc.html', import.meta.url), distances);
fs.writeFileSync(new URL('./Filled.dc.html', import.meta.url), filled);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  snapshot: { product: S.snapshot.repo, ref: S.snapshot.ref, commit: S.snapshot.commit },
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Citizen — the lens with no region to fill' },
    { file: 'Distances.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'The distances this lens keeps apart' },
    { file: 'Filled.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'What a fed region owes the reader (DEMO FIXTURE)' },
  ],
  annotations: [
    { id: 'measured-zero', x: 0, y: -320, w: 700, text: 'THE ONLY NUMBER THIS LENS HAS IS A ZERO, AND IT IS A MEASUREMENT.\n0 of 11 entries in the product\'s own DOMAIN_REGISTRY carry lensId citizen. That is a reading taken from the module, with a counting rule, and it is the reason this lens is a different design problem from every other one: it is not a surface whose sources are late, it is a surface with nowhere to put one.\nThe same zero appears as "Not read" on four regions of Main, and the two renderings are deliberately not interchangeable. A zero is a measurement. "Not read" is the absence of one.' },
    { id: 'one-word', x: 780, y: -320, w: 760, text: 'THE DESIGN CHANGES ONE WORD, AND IT CHANGES IT BECAUSE THE PRODUCT SAYS SO.\n"Your requests" ships with <span class="pill p-quiet">None on file</span>. Two mechanical objections, neither stylistic. FIRST, "None on file" is outside the product\'s own badge vocabulary — Empty / Not built / Not read / Preview / Not connected — and check.mjs proves the rule can fire by finding it outside that set on the SHIPPED side rather than on the design side. SECOND, it is a zero about a subject the lens has never established: it says this resident has no requests, on a surface that by design does not know who is reading.\nThe honest word is "Not read" and the honest sentence is why.' },
    { id: 'distances', x: 1620, y: -320, w: 760, text: 'FOUR PANELS, FOUR DIFFERENT DISTANCES, AND THE CHROME RENDERS THREE OF THEM AS PROSE.\nno-region: there is nowhere to attach a source. no-capability: the product does not do this on any city, so a city-scoped basis is the wrong sentence. no-source: the product does this, this city has not connected it, and the sentence varies by city. no-identity: no grant can measure it, on any city, ever.\nThe shipped surface renders the second, third and fourth with no state word at all, and the first with a zero. The design\'s only structural rule is that a region prints a state word, a distance and a basis, or it prints none of the three.' },
    { id: 'contract', x: 2460, y: -320, w: 760, text: 'A REGION SIGNS A CONTRACT BEFORE IT MAY PRINT A NUMBER.\nThe fixture board draws the contract: a state word from the product\'s vocabulary, one of the four distances, a basis, and — if it prints a figure — the counting rule that produced it. The instrument counts figures that carry a measurement without a counting rule and refuses the board when that count is not zero.\nTwo of the four regions stay UNREAD on the fixture board on purpose. A fixture can supply addresses and meetings; it cannot supply an identity or a payment processor, and a contract board that quietly dropped the regions a fixture cannot fill would flatter the design.' },
    { id: 'tiles', x: 3300, y: -320, w: 700, text: 'THE TWELVE-TILE GRID WAS DROPPED ONCE ALREADY AND IS NOT RE-PROPOSED.\nsrc/shell-homes.mjs:146 records it: { job: "Citizen service requests", home: "Citizen lens. The twelve-tile grid was dropped.", disposition: "Mounted" }. A tile is a measured figure, and there is no measurement on this lens to put in one — which is a stronger reason not to draw it than the fact that it was dropped.\ncheck.mjs refuses a data-tile attribute and a class="metrics" strip on any Citizen board, by name, and a planted tile is one of the violations it is verified against.' },
    { id: 'fixture', x: 2460, y: 1080, w: 760, text: 'A FIXTURE THAT IS NOT BADGED IS THE DEFECT.\nThe third board carries generated rows, and it says so in three places: a DEMO FIXTURE badge in the top bar, the footer, and a data-fixture-row marker on every row. check.mjs refuses a board that carries fixture rows without the badge, and refuses a board that carries the badge without fixture rows, so neither half can be satisfied by a sentinel.\nNo resident is named anywhere on any board. A fixture row names a generated identifier instead.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Distances, Filled + canvas.json');
console.log('  registry: ' + S.registry.citizenCount + ' of ' + S.registry.total + ' domains on citizen; routes naming citizen: ' + S.routes.citizenComposerRoutes);
console.log('  shipped quiet pills: ' + JSON.stringify(SHIPPED_QUIET_PILLS) + '; outside the vocabulary: ' + JSON.stringify(OUTSIDE_VOCAB));
console.log('  panels: ' + SHIPPED.panelTitles.join(' | '));
