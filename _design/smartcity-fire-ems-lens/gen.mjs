/**
 * SmartCity OS — Fire and EMS lens.
 *
 *   node gen.mjs      rewrites every artboard and canvas.json
 *   node check.mjs    the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * Every row, count and basis sentence comes from `source-state.json`, which is
 * the OUTPUT of the product’s own composer run against smartcity-dashboards
 * origin/main f776b4bf. Re-dump it rather than editing it, then re-run this.
 *
 * ONE REGION, AND ITS SECOND AXIS IS A PARTITION. src/domains.mjs registers a
 * single domain under lensId "fire-ems": fire-apparatus, region "Apparatus and
 * stations", gatedBy firstdue. The domain and the shipped lede both state the
 * design brief in one sentence:
 *
 *   "a city with every out-of-service truck in one station is a different fact
 *    from a city with one in each, and a rollup cannot say which"
 *
 * That sentence forbids a single stacked bar. The same four-band measure has to
 * be repeated per station, side by side, so the reader compares parts rather
 * than reading a whole. Small multiples, because the data is a partition.
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* ------------------------------------------------------------ primitives */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/** Closed, and copied from web/index.html at f776b4bf. Nothing here invents a state word. */
const BADGE = {
  'Empty': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not built': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not read': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Preview': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'Demo records': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Unread': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Partial': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const basisLine = (t, max) =>
  '<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:' + (max || 120) + 'ch;">' + t + '</span>';

const SHIPPED_NAV = [
  ['Overview', 'Empty'], ['Development services', 'Empty'], ['Finance', 'Empty'],
  ['Citizen', 'Preview'], ['Public works', 'Not read'], ['Parks', 'Not built'],
  ['Police', 'Not read'], ['Fire and EMS', 'Not read'], ['Fleet', 'Not read'],
];

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (feBadge, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', SHIPPED_NAV.map(([n, b]) => navRow(n, n === 'Fire and EMS' ? feBadge : b, n === 'Fire and EMS'))) + '\n' +
  navGroup('Work', [['Plan review', 'Preview'], ['Files', 'Preview'], ['Records search', 'Not built']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'Empty'], ['Connections', ''], ['People and access', 'Not built']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal, env) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">' + env + '</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search units, stations, records</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Fire and EMS</span>\n      </div>\n    </header>';

const tile = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-1); min-width:0; box-shadow:var(--sc-e1);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.k + '</div>\n' +
(m.unread
  ? '            <div style="font:620 15px/30px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">' + (m.word || 'Not read') + '</div>'
  : '            <div style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(' + (m.tone || '--sc-ink') + ');">' + m.v + '</div>') + '\n' +
'            <div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(' + (m.unread ? '--sc-ink-3' : '--sc-accent') + ');">\n' +
'              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.n + '</span>' + (m.unread ? '' : ARROW) + '\n            </div>\n          </div>';

const tiles = (items) =>
'        <div style="display:grid; grid-template-columns:repeat(' + items.length + ', minmax(0,1fr)); gap:var(--sc-3);">\n' + items.map(tile).join('\n') + '\n        </div>';

/**
 * The region strip carries ONE item on this lens, and that is the point. Public
 * works carries two. A strip that hid itself when it had one entry would make
 * "this lens has one region" indistinguishable from "this lens has regions we
 * are not showing you", so it is drawn at one and says how many there are.
 */
const regionStrip = (items, active, note) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:7px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + t.c + '</span>' +
    (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n' +
'          <div style="flex:1;"></div>\n' +
'          <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); padding-bottom:10px;">' + note + '</span>\n' +
'        </div>';

const panelHead = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
(o.demo
  ? '            ' + badge('Demo records') + '\n            <span style="flex:none; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><b style="font-weight:600; color:var(--sc-ink-2);">Generated fixture</b> <span style="color:var(--sc-line-strong);">|</span> ' + o.contract + '</span>\n'
  : (o.chip ? '            ' + badge(o.chip) + '\n' : '')) +
'            <div style="flex:1;"></div>\n' +
(o.right ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.right + '</span>\n' : '') +
'          </div>';

const panel = (o, body) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
panelHead(o) + '\n' + body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">' + basisLine(o.basis, o.basisWidth) + '</div>\n' : '') +
'        </section>';

const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:6px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  if (c && c.chip) return '              <span style="justify-self:start; font:500 12px/16px var(--sc-font-ui); color:' + c.c + '; background:' + c.w + '; border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + c.t + '</span>';
  const mono = i === 0 || (c && c.mono);
  const txt = (c && c.t !== undefined) ? c.t : c;
  return '              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-2') + ');">' + txt + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

const stateBlock = (o) =>
'          <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-6) var(--sc-6); max-width:76ch;">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.k + '</div>\n' +
'            <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + o.h + '</h2>\n' +
(o.p ? '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>\n' : '') +
'            ' + basisLine(o.b, 96) + '\n          </div>';

/* ------------------- THE SECOND AXIS: small multiples, because it is a partition

One card per station, the SAME four bands in the SAME order at the SAME scale in
each. Reading across a row of identical cards is the only way to see that one
station is carrying the whole shortfall; a single stacked bar with a total of
twelve is the rollup the domain says cannot answer the question.

Every station card names an opaque station reference and never a person. The
domain’s own crewBasis says a granted feed is where an assigned crew would come
from and a roster of real firefighters is not a fixture. */

const BAND_TONE = {
  'out-of-service': '--sc-crit', 'inspection-due': '--sc-warn',
  'in-shop': '--sc-info', 'in-service': '--sc-ok',
};

const stationCards = (o) =>
'          <div style="display:grid; grid-template-columns:repeat(' + o.stations.length + ', minmax(0,1fr)); gap:var(--sc-3); padding:var(--sc-3) var(--sc-4) var(--sc-2);">\n' +
o.stations.map((st) =>
'            <div style="border:1px solid var(--sc-line-faint); border-radius:var(--sc-r); background:var(--sc-surface-2); padding:var(--sc-3); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'              <div style="display:flex; flex-direction:column; gap:1px;"><span style="font:400 11px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + st.ref + '</span><span style="font:600 13px/17px var(--sc-font-ui); color:var(--sc-ink);">' + st.label + '</span></div>\n' +
'              <div style="display:flex; align-items:baseline; gap:6px;"><span style="font:400 22px/26px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ok);">' + st.ready + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">in service of ' + st.total + '</span></div>\n' +
'              <div style="display:flex; height:8px; border-radius:2px; overflow:hidden; background:var(--sc-line-faint);">' +
  st.bands.map((b) => b.v ? '<span style="width:' + ((b.v / st.total) * 100).toFixed(1) + '%; background:var(' + b.tone + ');"></span>' : '').join('') +
'</div>\n' +
'              <div style="display:flex; flex-direction:column; gap:2px;">' +
  st.bands.map((b) =>
    '<div style="display:flex; align-items:center; gap:6px;"><span style="width:7px; height:7px; border-radius:2px; flex:none; background:var(' + b.tone + ');"></span>' +
    '<span style="flex:1; font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + b.label + '</span>' +
    '<span style="font:400 12px/17px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (b.v ? '--sc-ink' : '--sc-ink-3') + ');">' + b.v + '</span></div>').join('') +
'</div>\n            </div>').join('\n') + '\n          </div>';

const blocked = (o) =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-3); padding:var(--sc-4);">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
'              <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.region + '</span>\n' +
'              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.domainId + ' &middot; gatedBy ' + o.kind + '</span>\n' +
'              <div style="flex:1;"></div>\n' +
'              <span style="font:500 12px/16px var(--sc-font-data); color:var(' + o.tone + '); background:var(' + o.wash + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + o.state + '</span>\n            </div>\n' +
'            <div style="display:grid; grid-template-columns:116px minmax(0,1fr); gap:var(--sc-2) var(--sc-3); align-items:start;">\n' +
o.facts.map((f) =>
'              <span style="font:500 12px/18px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">' + f[0] + '</span>\n' +
'              <span style="font:400 13px/18px ' + (f[2] ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (f[2] ? '--sc-ink' : '--sc-ink-2') + ');">' + f[1] + '</span>').join('\n') + '\n' +
'            </div>\n' +
'            ' + basisLine(o.basis, 112) + '\n          </div>';


/**
 * THE PROVENANCE FOOT, and it is not decoration.
 *
 * Every board names, in the product's own codes, which region it draws: the
 * domain id, the vendor kind that gates it, the record type and the pack. A
 * staff lens is platform-internal, and a member of staff looking at a page that
 * will not fill needs to know whose feed is missing. The shipped panel chip says
 * "Apparatus output contract" and names no vendor; vendors are named on
 * Connections. Naming it here is a PROPOSED CHANGE and the README says so.
 *
 * It also gives check.mjs real inputs to compare against the registry. A canvas
 * that renders only display forms gives a check nothing to check, which is how a
 * check shipped on 2026-09-15 that matched nothing and reported success.
 */
const provFoot = (items, pack) =>
'      <div style="flex:none; display:flex; align-items:center; gap:var(--sc-5); flex-wrap:wrap; padding-top:var(--sc-1); border-top:1px solid var(--sc-line-faint);">\n' +
items.map((i) =>
'        <span style="font:400 11px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + i.domainId + ' &middot; gatedBy ' + i.kind + ' &middot; ' + i.recordType + '</span>').join('\n') + '\n' +
'        <div style="flex:1;"></div>\n' +
'        <span style="font:400 11px/16px var(--sc-font-data); color:var(--sc-ink-3);">pack ' + pack + ' &middot; read at smartcity-dashboards f776b4bf</span>\n' +
'      </div>';

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal, o.env) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.feBadge, o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Fire and EMS</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Fire and EMS</h1>' + badge(o.pageBadge) + '<div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
'        <p style="margin:0; max-width:96ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
(o.tiles ? tiles(o.tiles) + '\n' : '') +
regionStrip(o.regions, o.activeRegion, o.regionNote) + '\n' +
o.body + '\n' +
provFoot(o.prov, o.pack) + '\n' +
'    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'dark') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'dark') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ========================================================== the data reads */

const fire = S.demo.fire;
const BANDS = S.axis.VEHICLE_STATUS_VALUES;
const bandLabel = (id) => BANDS.find((b) => b.id === id).label;

const chip = (t, c, w) => ({ chip: true, t, c, w });
const CHIP = {
  'out-of-service': ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'inspection-due': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'in-shop': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'in-service': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
};

/** Every one of the twelve, in the composer’s own order. No pager: twelve IS the roster. */
const rosterRows = fire.records.map((r) => [
  r.recordId, r.unitLabel, r.apparatusType,
  chip(bandLabel(r.status), ...CHIP[r.status]),
  { t: r.stationRef, mono: true }, r.stationLabel,
]);

const stations = fire.extras.stations.map((st) => ({
  ref: st.stationRef, label: st.stationLabel,
  ready: st.readyCount, total: st.apparatusCount,
  bands: BANDS.map((b) => ({
    label: b.label, tone: BAND_TONE[b.id],
    v: fire.records.filter((r) => r.stationRef === st.stationRef && r.status === b.id).length,
  })),
}));

/** Two numbers that must agree: the per-station counts and the roster total. */
const stationSum = stations.reduce((n, s) => n + s.total, 0);
const readySum = stations.reduce((n, s) => n + s.ready, 0);
const inServiceTile = fire.extras.metrics.find((m) => m.id === 'in-service').count;

/** Read off the registry rather than typed, so a rename in the product breaks the board. */
const PROV = S.vocab.registry
  .filter((d) => d.lensId === 'fire-ems')
  .map((d) => ({ domainId: d.id, kind: d.gatedBy, recordType: d.recordType }));
if (PROV.length !== 1) throw new Error('fire-ems now has ' + PROV.length + ' registered regions; re-derive this design');

const FOOT_DEMO = 'template-city &middot; demo pack<br>1 registered region on this lens<br>badges outside this lens are the shipped values at f776b4bf';
const FOOT_LIVE = 'bastrop_tx &middot; staging pack<br>firstdue granted, declining<br>badges outside this lens are the shipped values at f776b4bf';

/** The four jobs the product names as not-built on this lens, copied from web/index.html. */
const NOT_BUILT_JOBS = ['Occupancies', 'Volunteer response', 'County dispatch', 'Flood and weather'];

/* ---------------------------------------------------------------- board 1 */

const main = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  feBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city',
  pageRule: fire.countingRule,
  lede: 'Apparatus readiness, counted per station rather than city wide. A city with every out of service truck in one station is a different fact from a city with one in each, and a rollup cannot say which.',
  tiles: [
    ...BANDS.map((b) => ({
      k: b.label, v: fire.extras.metrics.find((m) => m.id === b.id).count,
      tone: BAND_TONE[b.id], n: 'of ' + fire.recordCount + ' apparatus',
    })),
    { k: 'Stations', v: stations.length, n: 'each counted separately' },
    { k: 'Crew', unread: true, word: 'Not carried', n: 'a roster of people is not a fixture' },
  ],
  regions: [{ n: 'Apparatus and stations', c: fire.recordCount + ' apparatus', b: 'Demo records' }],
  activeRegion: 'Apparatus and stations',
  regionNote: '1 registered region on this lens. Public works carries 2. Parks carries 0.',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column;">\n' +
panel({
  grow: true, title: 'Apparatus', sub: 'fire-apparatus &middot; one row per unit',
  demo: true, contract: 'Apparatus output contract',
  basis: 'Sorted by severity, then by record id. Every unit is on the page, ' + fire.recordCount + ' of ' + fire.recordCount + ', with no pager: a partial roster on a readiness screen is worse than no roster, and a real roster of two hundred needs a pager and a station filter rather than this. Basis: ' + fire.basis + '. Counting rule: ' + fire.countingRule + '.',
  basisWidth: 122,
}, table({
  cols: '100px minmax(0,0.95fr) 100px 112px 60px minmax(0,1.35fr)',
  head: ['Record', 'Unit', 'Type', 'Status', 'Stn', 'Station'],
  rows: rosterRows,
})) + '\n' +
'          </div>\n' +
'          <div style="width:520px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  title: 'Readiness, per station', sub: 'the second axis', right: 'same bands, same order, same scale',
  basis: 'The three cards sum to ' + stationSum + ' apparatus and ' + readySum + ' in service, the same ' + inServiceTile + ' the tile row reports by a different route: two numbers that should agree, shown agreeing. Readiness: ' + fire.extras.readyCountingRule + '.',
  basisWidth: 78,
}, stationCards({ stations })) + '\n' +
panel({
  title: 'Nobody is named', sub: 'and the dimension still works',
  basis: 'Basis: ' + fire.records[0].crewBasis + '.',
  basisWidth: 78,
}, '') + '\n' +
panel({
  title: 'Flood and drainage', sub: 'modelled, not the regulatory zone', chip: 'Preview',
  right: 'Mounts in Full &middot; _design/smartcity-flood-study',
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><span style="display:inline-flex; align-items:center; gap:6px; font:500 13px/18px var(--sc-font-ui); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-control); padding:5px 12px;">Open on the map' + ARROW + '</span></div>') + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 2 */

const blockedBoard = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  feBadge: 'Not read', pageBadge: 'Not read', foot: FOOT_LIVE,
  prov: PROV, pack: 'bastrop_tx',
  pageRule: 'Built, granted, wired, and declined at the vendor',
  lede: 'This region is built, the grant is in place and the live path is wired. What is missing is a scope on a credential held at the vendor, which is not an engineering task and cannot be fixed by anyone reading this screen. The page says so, and says who can.',
  tiles: BANDS.map((b) => ({ k: b.label, unread: true, word: 'Not read', n: 'the vendor has not answered' }))
    .concat([
      { k: 'Stations', unread: true, word: 'Not read', n: 'the vendor has not answered' },
      { k: 'Crew', unread: true, word: 'Not carried', n: 'and the live path is silent on it' },
    ]),
  regions: [{ n: 'Apparatus and stations', c: 'declined', b: 'Not connected' }],
  activeRegion: 'Apparatus and stations',
  regionNote: '1 registered region on this lens. Public works carries 2. Parks carries 0.',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
panel({
  title: 'Apparatus and stations', sub: 'fire-apparatus &middot; gatedBy firstdue', chip: 'Not connected',
  basis: 'Basis: the fixture seam answers ' + JSON.stringify(S.staging.fire.basis) + ' on this pack, and the server branches to the live composer instead (REAL_LIVE_DOMAINS, src/server.mjs), which returns status unavailable carrying whatever the vendor route said. No live read was performed by this design and no credential was used.',
  basisWidth: 116,
}, blocked({
  region: 'A credential without the scope', domainId: 'fire-apparatus', kind: 'firstdue',
  state: 'unavailable', tone: '--sc-warn', wash: '--sc-warn-wash',
  facts: [
    ['Obstacle kind', 'AN ENTITLEMENT. The account is connected; the API credential does not carry the apparatus and assets scope.'],
    ['Basis', 'A 403 from the vendor route, recorded in the src/vendor-live.mjs module header. The exact live basis string is UNREAD by this design.', true],
    ['Who moves it', 'The vendor, on request from the city’s fire administrator. No person is named on this page.'],
    ['Last read', '2026-09-03, recorded. Not re-read on 2026-09-15.', true],
    ['Records', 'Unread. A count belongs to a live read, never to a canvas.', true],
  ],
  basis: 'A region that cannot show data states four things and never fewer: its state, its basis verbatim, what KIND of thing would move it, and when that was last read. "Not read" on its own is the sentence that made every blocked region on this product look alike.',
})) + '\n' +
panel({
  title: 'When it reads, these tiles are not these tiles', sub: 'a build rule, stated before the build', chip: 'Partial',
  basis: 'Basis: src/vendor-live.mjs header, mapRealFireApparatusRecord, and realStatusCounts.',
  basisWidth: 116,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Out of service, Inspection due, In shop and In service are this product’s own vocabulary, invented for the generated pack. A live apparatus feed has its own status values and they are not these four. The metric row therefore has to be built to take its bands FROM the payload, not from a constant, or the first real read will quietly sort real trucks into invented buckets.</p>\n' +
'            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Two more things do not survive the cutover. The generated record carries a crewBasis saying no person is named; the live mapper carries no crew field and no basis for its absence, so the refusal silently disappears. And the live recordId falls back to <span style="font-family:var(--sc-font-data);">unknown-apparatus</span>, a sentinel that collides across rows.</p>\n' +
'          </div>') + '\n' +
'          </div>\n' +
'          <div style="width:452px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
panel({
  title: 'Not built on this lens', sub: 'four jobs, named rather than hidden', chip: 'Not built',
  basis: 'Basis: none of the four is a registered region, so the surface does not exist. A registered region with no source says something else, and the panel above is saying it. Copied from the shipped lens at f776b4bf; flood layers are records or map overlays when they arrive, never a separate product.',
  basisWidth: 62,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
NOT_BUILT_JOBS.map((j, i) =>
'            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:8px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="flex:1; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + j + '</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">not a region</span></div>').join('\n') + '\n          </div>') + '\n' +
panel({
  title: 'Three obstacles, three kinds', sub: 'across the three lenses drawn in this lane',
  basis: 'Basis: src/vendor-live.mjs module header, live-verified 2026-09-03 and recorded there; src/domains.mjs for the vendorless finding. Each is a claim about its stated date. Re-run the instrument before quoting it.',
  basisWidth: 62,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
[
  ['Public works &middot; calls', 'A consent nobody has given', '--sc-warn'],
  ['Fire and EMS &middot; apparatus', 'An entitlement the credential lacks', '--sc-warn'],
  ['Parks', 'A source that does not exist', '--sc-crit'],
].map((r, i) =>
'            <div style="display:grid; grid-template-columns:200px minmax(0,1fr); gap:var(--sc-3); padding:8px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[0] + '</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(' + r[2] + ');">' + r[1] + '</span></div>').join('\n') + '\n          </div>') + '\n' +
'          </div>\n        </div>',
});

/* --------------------------------------------------------------- emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Blocked.dc.html', import.meta.url), blockedBoard);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Apparatus — readiness counted per station' },
    { file: 'Blocked.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'The live pack — an entitlement, not a bug' },
  ],
  annotations: [
    { id: 'partition', x: 0, y: -300, w: 720, text: 'THE SECOND AXIS IS A PARTITION, SO IT IS DRAWN AS SMALL MULTIPLES.\nThe domain states its own brief: "a city with every out-of-service truck in one station is a different fact from a city with one in each, and a rollup cannot say which".\nThat sentence forbids a single stacked bar. One card per station, the same four bands in the same order at the same scale, so the reader compares parts instead of reading a whole.\nThe three cards sum to the same in-service figure the tile row reports by a different route. Two numbers that should agree, shown agreeing.' },
    { id: 'roster', x: 780, y: -300, w: 660, text: 'TWELVE OF TWELVE, AND NO PAGER.\nThe whole roster is on the page. A readiness screen showing the first ten of twelve units is worse than no roster: the two a station is missing are exactly the two somebody is looking for.\nThis is a property of the fixture size and not a rule for every pack. A real roster of two hundred needs a pager and a station filter, and the design note says so rather than pretending the small case generalises.' },
    { id: 'nobody', x: 1500, y: -300, w: 640, text: 'NOBODY IS NAMED, AND THE DIMENSION SURVIVES.\nThe generated record carries crewBasis: "a granted feed is where an assigned crew would come from and a roster of real firefighters is not a fixture".\nSame discipline the Development services lens applies to inspector load. The station is an opaque reference, the place vocabulary announces itself as invented, and the readiness table still answers the question it exists to answer.' },
    { id: 'entitlement', x: 1720, y: -300, w: 720, text: 'AN ENTITLEMENT, NOT A BUG, AND THE PAGE SAYS WHICH.\nThe region is built, the grant is in place and REAL_LIVE_DOMAINS wires the live path. A reading recorded 2026-09-03 in src/vendor-live.mjs has the vendor returning a 403 because the API credential lacks the apparatus and assets scope.\nNobody reading this screen can fix that, and a page that said only "not read" would send an engineer looking for a defect that is not there.\nSo the blocked card names the KIND of obstacle and who can move it, by role. Public works has a consent. Parks has no vendor at all. Three lenses, three kinds.' },
    { id: 'cutover', x: 2500, y: -300, w: 700, text: 'WHEN IT READS, THESE TILES ARE NOT THESE TILES.\nOut of service / Inspection due / In shop / In service is this product’s own invented vocabulary. src/vendor-live.mjs keeps real vendor status AS-IS and never force-maps it, so the metric row has to take its bands from the payload rather than from a constant, or the first real read sorts real trucks into invented buckets.\nTwo more things do not survive: the crew refusal is on the generated record and not on the live one, and the live recordId falls back to the literal "unknown-apparatus", a sentinel that collides across rows.\nStated before the build, so the build inherits them measured.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Blocked + canvas.json');
console.log('  apparatus: ' + fire.recordCount + ' records, all rendered');
console.log('  stations: ' + stations.length + ', summing to ' + stationSum + ' apparatus and ' + readySum + ' in service (tile says ' + inServiceTile + ')');
