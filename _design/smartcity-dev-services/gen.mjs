import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NEXT': ['var(--sc-info)', 'var(--sc-info-wash)'],
  // Copied from the shipped mark, web/index.html: <span class="pill p-warn">Demo records</span>.
  'DEMO RECORDS': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t] || BADGE['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
};

const LENSES = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'EMPTY'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (lenses, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', lenses.map((l) => navRow(l[0], l[1], l[0] === 'Development services'))) + '\n' +
  navGroup('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:320px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' · Development services</span>\n      </div>\n    </header>';

// ---------- TIER 1: attention row (filtered entry points) ----------
const tile = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-1); min-width:0; box-shadow:var(--sc-e1);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</div>\n' +
(m.read
  ? '            <div style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(' + (m.alert ? '--sc-crit' : '--sc-ink') + ');">' + m.v + '</div>'
  : '            <div style="font:620 15px/30px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>') + '\n' +
'            <div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(' + (m.read ? '--sc-accent' : '--sc-ink-3') + ');">\n' +
'              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.to + '</span>' + (m.read ? ARROW : '') + '\n            </div>\n          </div>';

// ---------- TIER 2: tab strip with inline counts ----------
const tabs = (items, active) =>
'        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:6px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    (t.c ? '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + t.c + '</span>' : '') +
    (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n        </div>';

// ---------- TIER 3: compact tab metric strip (secondary) ----------
const strip = (items) =>
'        <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0; border:1px solid var(--sc-line-faint); border-radius:var(--sc-r); background:var(--sc-surface-2); padding:var(--sc-1) 0;">\n' +
items.map((s, i) =>
'          <div style="display:flex; align-items:baseline; gap:7px; padding:6px var(--sc-4); ' + (i ? 'border-left:1px solid var(--sc-line-faint);' : '') + '">' +
  '<span style="font:400 17px/22px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (s.tone || '--sc-ink') + ');">' + s.v + '</span>' +
  '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + s.k + '</span></div>').join('\n') + '\n        </div>';

// ---------- view modes + filter bar ----------
const viewModes = (modes, active) =>
  '<div style="display:flex; gap:2px; padding:2px; background:var(--sc-surface-2); border:1px solid var(--sc-line); border-radius:var(--sc-r-control);">' +
  modes.map((m) => '<span style="font:500 12px/16px var(--sc-font-ui); padding:3px 10px; border-radius:3px; color:var(' + (m === active ? '--sc-ink' : '--sc-ink-3') + '); background:' + (m === active ? 'var(--sc-surface)' : 'transparent') + ';">' + m + '</span>').join('') +
  '</div>';

const filterBar = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap; padding:var(--sc-2) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <div style="flex:1; min-width:200px; height:28px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); display:flex; align-items:center; padding:0 var(--sc-3); font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-3);">' + o.search + '</div>\n' +
o.filters.map((f) =>
'            <div style="height:28px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface); display:flex; align-items:center; gap:6px; padding:0 10px; font:400 13px/18px var(--sc-font-ui); color:var(' + (f.on ? '--sc-ink' : '--sc-ink-2') + ');">' + f.t + '<span style="color:var(--sc-ink-3); display:flex;">' + CHEV + '</span></div>').join('\n') + '\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.count + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Reset</span>\n' +
'          </div>';

// ---------- load strip (ONE shared pattern: inspector / manager / officer) ----------
const loadStrip = (o) =>
'          <div style="border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2); padding:var(--sc-2) var(--sc-3);">\n' +
'              <span style="color:var(--sc-ink-3); display:flex;">' + CHEV + '</span>\n' +
'              <span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + o.title + '</span>\n' +
'              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n            </div>\n' +
(o.people
  ? '            <div style="display:flex; gap:var(--sc-2); padding:0 var(--sc-3) var(--sc-3); flex-wrap:wrap;">\n' +
    o.people.map((p) =>
      '              <div style="display:flex; flex-direction:column; gap:3px; min-width:120px; padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface-2);">' +
      '<span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + p.n + '</span>' +
      '<div style="display:flex; align-items:center; gap:6px;"><span style="font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-2);">' + p.c + '</span>' +
      '<div style="flex:1; height:3px; border-radius:2px; background:var(--sc-line);"><div style="width:' + p.pct + '%; height:3px; border-radius:2px; background:var(' + (p.tone || '--sc-accent') + ');"></div></div></div></div>').join('\n') +
    '\n            </div>\n'
  : '') +
(o.basis
  ? '            <div style="padding:0 var(--sc-3) var(--sc-3);"><span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:96ch;">' + o.basis + '</span></div>\n'
  : '') +
'          </div>';

// ---------- table ----------
const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:9px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  if (c && c.chip) return '              <span style="justify-self:start; font:500 12px/16px var(--sc-font-ui); color:' + c.c + '; background:' + c.w + '; border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + c.t + '</span>';
  const mono = i === 0 || (c && c.mono);
  const txt = (c && c.t !== undefined) ? c.t : c;
  return '              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-2') + ');">' + txt + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

const pager = (t) =>
'          <div style="display:flex; align-items:center; padding:var(--sc-2) var(--sc-4); border-top:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">Previous</span>\n' +
'            <div style="flex:1; text-align:center; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + t + '</div>\n' +
'            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Next</span>\n          </div>';

const emptyState = (k, h, p, b) =>
'          <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-8) var(--sc-6); max-width:64ch;">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">' + k + '</div>\n' +
'            <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + h + '</h2>\n' +
(p ? '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + p + '</p>\n' : '') +
'            <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + b + '</div>\n          </div>';

// ---------- the fixture mark, copied from the shipped panel head ----------
const demoMark =
'            <span style="flex:none; font:500 12px/16px var(--sc-font-ui); color:var(--sc-warn); background:var(--sc-warn-wash); border-radius:var(--sc-r-control); padding:1px 6px;">Demo records</span>\n' +
'            <span style="flex:none; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><b style="font-weight:600; color:var(--sc-ink-2);">Generated fixture</b> <span style="color:var(--sc-line-strong);">|</span> MyGov output contract</span>\n';

/* ---------- THE SECOND AXIS: three shapes, because the data is three shapes

Every operational tab on this lens carries a queue and a second dimension beside
it, and the three second dimensions are not the same kind of thing. The domain
source says so in its own words, and the rendering follows the data rather than
flattening all three into one component:

  inspections      a PAIRED axis      the result is defined for every record and
                                      meaningful for a subset, so four peer
                                      classes, one of which is "not inspected"
  code enforcement an ORDERED axis    an escalation ladder, where rung 3 is
                                      further along than rung 2, so rungs
  licences         a CONTINUOUS axis  expiry is an integer every record carries
                                      and the bands are derived from it, so
                                      bands with their boundaries printed

A template that drew all three as tiles would be asserting they are the same
shape. They are not, and the difference is the thing a member of staff reads. */

const axisPanel = (o, body) =>
'        <section style="flex:none; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n          </div>\n' +
body + '\n' +
'          <div style="padding:0 var(--sc-4) var(--sc-3);"><span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:110ch;">' + o.basis + '</span></div>\n' +
'        </section>';

/** PAIRED: four peer classes, none of them derived by subtracting the others. */
const axisTiles = (o) => axisPanel(o,
'          <div style="display:grid; grid-template-columns:repeat(' + o.items.length + ', minmax(0,1fr)); padding:var(--sc-3) 0;">\n' +
o.items.map((it, i) =>
'            <div style="display:flex; flex-direction:column; gap:2px; padding:0 var(--sc-4); ' + (i ? 'border-left:1px solid var(--sc-line-faint);' : '') + '">' +
  '<span style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + it.tone + ');">' + it.v + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + it.k + '</span>' +
  (it.note ? '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + it.note + '</span>' : '') +
'</div>').join('\n') + '\n          </div>');

/** ORDERED: the rung number is data on the record, not the row's position. */
const axisLadder = (o) => axisPanel(o,
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0;">\n' +
o.rungs.map((r) =>
'            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:6px var(--sc-4);">' +
  '<span style="flex:none; width:21px; height:21px; border-radius:var(--sc-r-full); border:1px solid var(--sc-line); display:inline-grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + r.step + '</span>' +
  '<span style="flex:none; width:168px; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + r.k + '</span>' +
  '<span style="flex:none; width:36px; text-align:right; font:400 15px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + r.tone + ');">' + r.v + '</span>' +
  '<span style="flex:1; height:6px; border-radius:2px; background:var(--sc-line-faint); overflow:hidden;"><span style="display:block; width:' + r.pct + '%; height:6px; background:var(' + r.tone + ');"></span></span>' +
'</div>').join('\n') + '\n          </div>');

/** CONTINUOUS: the band boundary is printed, because a band nobody can check
 *  is a label rather than a measurement. */
const axisBands = (o) => axisPanel(o,
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0;">\n' +
o.bands.map((b) =>
'            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:6px var(--sc-4);">' +
  '<span style="flex:none; width:150px; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + b.k + '</span>' +
  '<span style="flex:none; width:130px; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + b.range + '</span>' +
  '<span style="flex:none; width:36px; text-align:right; font:400 15px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + b.tone + ');">' + b.v + '</span>' +
  '<span style="flex:1; height:6px; border-radius:2px; background:var(--sc-line-faint); overflow:hidden;"><span style="display:block; width:' + b.pct + '%; height:6px; background:var(' + b.tone + ');"></span></span>' +
'</div>').join('\n') + '\n          </div>');

/**
 * The tab strip, in the shipped order.
 *
 * Verified against smartcity-dashboards origin/main `web/index.html` on
 * 2026-09-15: DS_TABS and TAB_LABELS both carry SEVEN tabs and neither carries
 * `place`. This strip carried an eighth, Place, until that read. It never
 * existed in the product: the map became a persistent dock rail instead
 * (_design/smartcity-map-dock, approved and dispatched G-128) and
 * _design/smartcity-place-tab is kept as the record of the option not taken.
 * A design shown to a city for approval may not carry a tab we ruled against.
 *
 * `Licenses` is the shipped tab label. The product's own body copy says
 * "licence" and "Licence roll" on the same tab, which is a product-line naming
 * inconsistency rather than something a design folder settles; the strip
 * matches what ships and the inconsistency is raised separately.
 */
const TABS = (counts) => [
  { n: 'Pipeline', c: counts.pipeline }, { n: 'Inspections', c: counts.insp },
  { n: 'Work orders', c: counts.wo }, { n: 'Code enforcement', c: counts.ce },
  { n: 'Licenses', c: counts.lic },
  { n: 'Plan review', c: '', b: 'NEXT' }, { n: 'Flood study', c: '' },
];

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(LENSES, o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Development services</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Development services</h1>' + badge(o.pageBadge) + '</div>\n' +
'        <p style="margin:0; max-width:74ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Planning, permits, inspections and code enforcement. Nothing here is a count until a source reads.</p>\n      </div>\n' +
'        <div style="display:grid; grid-template-columns:repeat(6, minmax(0,1fr)); gap:var(--sc-3);">\n' + o.att.map(tile).join('\n') + '\n        </div>\n' +
tabs(TABS(o.counts), o.activeTab) + '\n' +
(o.strip ? strip(o.strip) + '\n' : '') +
'        <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.panelTitle + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.panelSub + '</span>\n' +
(o.demoMark ? demoMark : '') +
'            <div style="flex:1;"></div>\n' + (o.modes ? '            ' + viewModes(o.modes, o.mode) + '\n' : '') +
(o.exportBtn ? '            <span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); padding:0 var(--sc-2);">Export</span>\n' : '') +
'          </div>\n' +
(o.load ? loadStrip(o.load) + '\n' : '') +
(o.rows
  ? filterBar(o.filter) + '\n' + table({ cols: o.cols, head: o.head, rows: o.rows }) + '\n' + pager(o.pageText) +
    (o.tableBasis ? '\n          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:110ch;">' + o.tableBasis + '</span></div>' : '')
  : emptyState(o.emptyK, o.emptyH, o.emptyP, o.emptyB)) + '\n' +
'        </section>\n' + (o.axis ? o.axis + '\n' : '') + '    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const chip = (t, c, w) => ({ chip: true, t, c, w });
const OK = ['var(--sc-ok)', 'var(--sc-ok-wash)'];
const WARN = ['var(--sc-warn)', 'var(--sc-warn-wash)'];
const CRIT = ['var(--sc-crit)', 'var(--sc-crit-wash)'];
const INFO = ['var(--sc-info)', 'var(--sc-info-wash)'];
const QUIET = ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'];

const ATT_LIVE = [
  { k: 'WO active', v: '59', read: true, to: 'Work orders · Active' },
  { k: 'WO overdue', v: '41', read: true, alert: true, to: 'Work orders · Overdue' },
  { k: 'WO due today', v: '2', read: true, to: 'Work orders · Due today' },
  { k: 'Active projects', v: '709', read: true, to: 'Pipeline · Active' },
  { k: 'Expiring', v: '18', read: true, to: 'Pipeline · Expiring' },
  { k: 'Active reviews', v: '586', read: true, to: 'Plan review · Active' },
];
const COUNTS = { pipeline: '12,683', insp: '949', wo: '16,723', ce: '1,502', lic: '72' };
const FOOT = '7 of 10 sources granted<br>4 of 10 reading records<br>bastrop_tx';

const pipeline = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'LIVE RECORDS', foot: FOOT,
  att: ATT_LIVE, counts: COUNTS, activeTab: 'Pipeline',
  strip: [
    { v: '12,683', k: 'all' }, { v: '709', k: 'active' }, { v: '33', k: 'requested', tone: '--sc-ok' },
    { v: '9', k: 'expired' }, { v: '18', k: 'expiring', tone: '--sc-warn' }, { v: '3', k: 'pending docs' }, { v: '17', k: 'on hold' },
  ],
  panelTitle: 'Permits in flight', panelSub: 'mygov · read live for this request',
  modes: ['List', 'Map'], mode: 'List', exportBtn: true,
  filter: { search: 'Search permit, address, applicant, type', filters: [{ t: 'Active', on: true }, { t: 'All types' }, { t: 'All departments' }], count: '709 results' },
  cols: '112px 168px minmax(0,1.4fr) minmax(0,1fr) 108px 96px',
  head: ['Permit #', 'Type', 'Address', 'Applicant', 'Status', 'Submitted'],
  rows: [
    ['26-000318', 'New Commercial Shell', '1401 CHESTNUT ST', 'Cima General Contracting', chip('In review', ...INFO), { t: '09/02/26', mono: true }],
    ['26-000317', 'Residential Addition', '908 PINE ST', { t: 'APP-01', mono: true }, chip('Info required', ...WARN), { t: '09/02/26', mono: true }],
    ['26-000314', 'Monument Permit (Sign)', '302 MAIN ST', 'Bastrop Signs LLC', chip('Approved', ...OK), { t: '08/29/26', mono: true }],
    ['26-000309', 'Electric Attachment', '1109 PECAN ST', 'Bluebonnet Electric', chip('In review', ...INFO), { t: '08/28/26', mono: true }],
    ['26-000301', 'Plumbing Attachment', '77 FARM ST', { t: 'APP-02', mono: true }, chip('Expiring', ...WARN), { t: '08/21/26', mono: true }],
    ['26-000298', 'Special Event Permit', '1311 MAIN ST', 'Bastrop Chamber', chip('Approved', ...OK), { t: '08/19/26', mono: true }],
    ['26-000294', 'New Residential', '204 HILL ST', 'Hill Country Homes', chip('On hold', ...QUIET), { t: '08/14/26', mono: true }],
    ['26-000290', 'Mechanical Attachment', '1922 CRISTOBAL ST', 'Lone Star HVAC', chip('Approved', ...OK), { t: '08/12/26', mono: true }],
    ['26-000287', 'Fence Permit', '11 DEPOT ST', { t: 'APP-03', mono: true }, chip('Approved', ...OK), { t: '08/11/26', mono: true }],
  ],
  pageText: 'Page 1 of 79 · 709 total',
  /**
   * The applicant column names businesses and holds individuals off.
   *
   * A business on a permit is a commercial entity and a matter of public
   * record; naming one names no person. An individual applicant is a resident,
   * and this canvas is published -- two of the three held off here are the same
   * people the folder README quotes from the v1 capture as PII the design must
   * not render, at their own addresses. The live surface renders whatever the
   * granted feed carries, behind the gate that column still needs.
   */
  tableBasis: 'Basis: business applicants are named because a business on a permit is a public commercial record. Individual applicants are opaque on a published canvas; the live surface renders the granted feed, behind the gate this column still needs.',
});

const workOrders = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'LIVE RECORDS', foot: FOOT,
  att: ATT_LIVE, counts: COUNTS, activeTab: 'Work orders',
  strip: [
    { v: '53', k: 'active' }, { v: '0', k: 'requested' }, { v: '72', k: 'suspended', tone: '--sc-warn' },
    { v: '69', k: 'on hold' }, { v: '27,874', k: 'archived' },
  ],
  panelTitle: 'Work orders', panelSub: 'mygov · read live for this request',
  modes: ['List', 'Map', 'Performance'], mode: 'List', exportBtn: true,
  /**
   * The managers are opaque here, and that is a change made 2026-09-15.
   *
   * This strip previously named five people. Those five strings appear nowhere
   * in doc_repo outside this file and nowhere in smartcity-dashboards at
   * origin/main, so they were either invented or transcribed from the v1
   * capture PDF the folder README cites, which is not in this repo. Either
   * reading is disqualifying for a canvas that goes to a city: invented staff
   * on a workload ranking is fabrication, and REAL staff on a workload ranking,
   * one of them flagged over capacity, is not ours to publish to their employer.
   *
   * The product already made this call for the same dimension. From
   * src/domains/inspections.mjs: "The inspector load table is then still
   * buildable, which is the point: the dimension survives, the person does not."
   */
  load: {
    title: 'Manager load', sub: '17 managers · 44 active',
    basis: 'Basis: a granted feed carries its own manager names and the live surface renders them. This canvas is published, so it holds the person off and keeps the dimension.',
    people: [
      { n: 'MGR-01', c: '14 active', pct: 100, tone: '--sc-crit' },
      { n: 'MGR-02', c: '11 active', pct: 79 },
      { n: 'MGR-03', c: '8 active', pct: 57 },
      { n: 'MGR-04', c: '6 active', pct: 43 },
      { n: 'MGR-05', c: '5 active', pct: 36 },
    ],
  },
  filter: { search: 'Search WO #, address, type', filters: [{ t: 'Open (53)', on: true }, { t: '2026' }, { t: 'All types' }, { t: 'All departments' }], count: '133 results' },
  cols: '112px 176px minmax(0,1.3fr) 150px 108px 100px',
  head: ['WO #', 'Type', 'Address', 'Department', 'Status', 'Opened'],
  rows: [
    ['24-002855', 'Diverse / Miscellaneous', '913 EL HARDING LOOP LN', 'Water / Wastewater', chip('Active', ...OK), { t: '09/08/26', mono: true }],
    ['24-002841', 'No Water', '119 PASQUALE DR', 'Water / Wastewater', chip('Active', ...OK), { t: '09/08/26', mono: true }],
    ['24-002888', 'Sewer Line Repair / Replace', '1209 FM 969', 'Water / Wastewater', chip('Active', ...OK), { t: '09/07/26', mono: true }],
    ['24-002877', 'Sewer Backup', '1922 CRISTOBAL ST E', 'Water / Wastewater', chip('Active', ...OK), { t: '09/07/26', mono: true }],
    ['24-002878', 'Connect', '1723 COOPER CT', 'Water / Wastewater', chip('Active', ...OK), { t: '09/06/26', mono: true }],
    ['24-002871', 'Meter Repair', '203 MOSSBERG LN', 'Water / Wastewater', chip('Active', ...OK), { t: '09/05/26', mono: true }],
    ['24-002866', 'Water Outage', '125 CALM WATER LOOP', 'Water / Wastewater', chip('Suspended', ...WARN), { t: '09/04/26', mono: true }],
    ['24-002859', 'Water Quality Issues', '021 HWY 71 W', 'Water / Wastewater', chip('Active', ...OK), { t: '09/03/26', mono: true }],
    ['24-002854', 'ROW Tree Trimming', '1109 PECAN ST', 'Streets & Drainage', chip('On hold', ...QUIET), { t: '09/02/26', mono: true }],
  ],
  pageText: 'Page 1 of 3 · 133 total',
});

const empty = artboard({
  theme: 'dark', city: 'This city', seal: 'EC', pageBadge: 'NOT READ',
  foot: '0 of 10 sources granted<br>this pack generates no records',
  att: [
    { k: 'WO active', read: false, to: 'No operations source' },
    { k: 'WO overdue', read: false, to: 'No operations source' },
    { k: 'WO due today', read: false, to: 'No operations source' },
    { k: 'Active projects', read: false, to: 'No permit source' },
    { k: 'Expiring', read: false, to: 'No permit source' },
    { k: 'Active reviews', read: false, to: 'Review mount is preview' },
  ],
  counts: { pipeline: '', insp: '', wo: '', ce: '', lic: '' }, activeTab: 'Pipeline',
  strip: null,
  panelTitle: 'Permits in flight', panelSub: 'no source connected',
  modes: null, exportBtn: false,
  emptyK: 'Not read',
  emptyH: 'No cases are in flight on this pack.',
  emptyP: 'A permit source fills this tab, the three work-order tiles above it, and the inspections and code-enforcement boards beside it. One grant lights all of them.',
  emptyB: 'Basis: no permit adapter granted on this pack.',
});

/* =====================================================================
   THE THREE TABS THAT SHIP IN THE NAV AND HAD NEVER BEEN DESIGNED

   Inspections, Code enforcement and Licenses sit in DS_TABS on deployed main
   and carry full scaffolds in web/index.html -- metric bars, filter bars,
   honest-empty states with basis lines, tables with real column sets. They had
   no design record. These three artboards are a v2 pass over a shipped surface,
   not an invention, and the cutover WDLL names Development Services staff as
   the first cohort, so these are the screens the first cohort opens daily.

   THEY RENDER THE DEMO PACK, DELIBERATELY. Pipeline and Work orders above show
   a granted MyGov read. These three show what the same lens looks like before a
   source is granted, which is what Bastrop staff will see on day one. It is
   also the only mode in which every value on the screen is checkable against
   the domain source rather than asserted, and it is the honest answer to "is
   this real data": the fixture place vocabulary is Template Commons, Fixture
   Ridge, Example Crossing, Sample Bend, Placeholder Heights and Specimen Yard.
   The demo data says it is demo data, on the screen, in the data itself.
   ===================================================================== */

/**
 * EVERY ROW AND EVERY COUNT BELOW IS THE PRODUCT'S OWN OUTPUT.
 *
 * fixture-rows.json is written by RUNNING the five domain generators from
 * smartcity-dashboards origin/main f776b4bf against cityKey bastrop_tx at
 * seed 0 -- not by transcribing them. That distinction earned itself: the rows
 * WERE hand-written first, and checking them against the real generators found
 * the licence rows in the wrong order, because within a status band the sort is
 * by expiry offset (a seeded random draw) rather than by record id. Ids, refs,
 * statuses, rungs and types were all correct, which is precisely why the wrong
 * part would never have been caught by re-reading the canvas.
 *
 * Do not hand-edit fixture-rows.json. Re-dump it if the fixture plans change.
 */
const FIX = JSON.parse(fs.readFileSync(new URL('./fixture-rows.json', import.meta.url), 'utf8'));

const RESULT = {
  failed: ['Failed', CRIT], corrections: ['Corrections required', WARN],
  passed: ['Passed', OK], 'not-inspected': ['Not inspected', QUIET],
};
const CODE_STATUS = {
  'past-compliance': ['Past compliance date', CRIT],
  'awaiting-reinspection': ['Awaiting reinspection', WARN],
  'notice-issued': ['Notice issued', INFO],
  'closed-compliant': ['Closed compliant', OK],
};
const LIC_STATUS = {
  expired: ['Expired', CRIT], expiring: ['Expiring', WARN],
  'renewal-submitted': ['Renewal submitted', INFO], active: ['Active', OK],
};
const TONE = {
  'past-due': '--sc-crit', unscheduled: '--sc-warn', scheduled: '--sc-ink', completed: '--sc-ok',
  'past-compliance': '--sc-crit', 'awaiting-reinspection': '--sc-warn',
  'notice-issued': '--sc-ink', 'closed-compliant': '--sc-ok',
  expired: '--sc-crit', expiring: '--sc-warn', 'renewal-submitted': '--sc-ink', active: '--sc-ok',
};
const mono = (t) => ({ t, mono: true });
/** Bars are relative to the largest class, so the tallest is always full. */
const pct = (n, max) => (max > 0 ? Math.round((n / max) * 100) : 0);
const pages = (total) => Math.ceil(total / 9);

/**
 * The attention row on a generated pack. THREE of the six tiles measure and
 * three decline with a reason, because the fixture carries no dimension to
 * measure them against. Inventing a zero for the other three would be three
 * false claims in the most prominent row on the page, and a zero enters an
 * average without announcing that it was invented.
 */
const ATT_FIXTURE = [
  { k: 'WO active', v: String(FIX.attention.woActive), read: true, to: 'Work orders · Active' },
  { k: 'WO overdue', v: String(FIX.attention.woPastSla), read: true, alert: true, to: 'Work orders · Past SLA' },
  { k: 'WO due today', read: false, to: 'No due-date dimension is generated' },
  { k: 'Active projects', v: String(FIX.attention.pipelineActive), read: true, to: 'Pipeline · Active' },
  { k: 'Expiring', read: false, to: 'No expiring class is generated' },
  { k: 'Active reviews', read: false, to: 'Review mount is preview' },
];

const COUNTS_FIXTURE = {
  pipeline: String(FIX.attention.pipelineTotal),
  insp: String(FIX.inspections.total),
  wo: String(FIX.attention.woTotal),
  ce: String(FIX.code.total),
  lic: String(FIX.licences.total),
};
const FOOT_FIXTURE = '0 of 10 sources granted<br>records are generated, not read<br>bastrop_tx';

/* ------------------------------------------------------------- inspections */

/**
 * EVERY ROW ON PAGE ONE READS "NOT INSPECTED", AND THAT IS CORRECT.
 *
 * The queue sorts by severity, so page one is the unresolved work -- past due,
 * then unscheduled, then scheduled -- and none of it has been inspected yet. A
 * column of identical values looks like a defect and is the opposite of one:
 * "Not inspected" is a declared result value carrying a basis, not an empty
 * cell. The four-class distribution is in the Result panel below the table.
 *
 * Three rows read "Not scheduled" in the Scheduled column. An unscheduled
 * inspection has no day and none is invented; a zero there would render as
 * "today", which is a claim.
 */
const insPassed = FIX.inspections.result.passed;
const insCompleted = FIX.inspections.status.completed;
const insResultMax = Math.max(...Object.values(FIX.inspections.result));

const inspections = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'DEMO RECORDS', foot: FOOT_FIXTURE,
  att: ATT_FIXTURE, counts: COUNTS_FIXTURE, activeTab: 'Inspections',
  strip: [
    { v: String(FIX.inspections.status['past-due']), k: 'past due', tone: TONE['past-due'] },
    { v: String(FIX.inspections.status.unscheduled), k: 'unscheduled', tone: TONE.unscheduled },
    { v: String(FIX.inspections.status.scheduled), k: 'scheduled' },
    { v: String(insCompleted), k: 'completed', tone: TONE.completed },
    // The denominator travels with the ratio. A bare percentage over a
    // denominator nobody can see is the cheapest lie on any dashboard.
    { v: Math.round((insPassed / insCompleted) * 100) + '%', k: 'pass rate · ' + insPassed + ' of ' + insCompleted + ' inspected' },
    // The shipped metric bar has a slot the fixture cannot fill. It says so
    // rather than showing a zero: absent, zero and unmeasured are three states.
    { v: 'Not measured', k: 'avg days to complete', tone: '--sc-ink-3' },
  ],
  panelTitle: 'Inspections', panelSub: 'generated fixture · nothing was read', demoMark: true,
  modes: null, exportBtn: false,
  load: {
    title: 'Inspector load', sub: FIX.inspections.load.length + ' inspectors · ' + FIX.inspections.load.reduce((a, l) => a + l.open, 0) + ' open',
    basis: 'Basis: a generated record names no person; the inspector is an opaque reference and a granted feed is where a name would come from.',
    people: FIX.inspections.load.map((l) => ({
      n: l.ref, c: l.open + ' open · ' + l.total + ' total',
      pct: pct(l.open, Math.max(...FIX.inspections.load.map((x) => x.open))),
    })),
  },
  filter: {
    search: 'Search inspection #, type, place',
    filters: [{ t: 'All statuses' }, { t: 'All types' }, { t: 'Sort: default', on: true }],
    count: FIX.inspections.total + ' results',
  },
  cols: '124px 200px minmax(0,1.2fr) 82px 150px 120px',
  head: ['Inspection #', 'Type', 'Place', 'Inspector', 'Result', 'Scheduled'],
  rows: FIX.inspections.rows.map((r) => [
    r.id, r.type, r.place, mono(r.inspector), chip(RESULT[r.result][0], ...RESULT[r.result][1]), mono(r.when),
  ]),
  pageText: 'Page 1 of ' + pages(FIX.inspections.total) + ' · ' + FIX.inspections.total + ' total · sorted by severity',
  axis: axisTiles({
    title: 'Result', sub: 'A paired axis · four measured classes',
    items: Object.entries(RESULT).map(([id, [label, tone]]) => ({
      v: String(FIX.inspections.result[id]), k: label, tone: tone[0],
      note: id === 'not-inspected' ? 'a positive determination, not a blank' : '',
    })),
    basis: 'Basis: inspections whose result equals this class, over the generated mygov inspection records on this pack, one row per record. Not inspected is measured like the other three and never derived by subtracting them, because a record matching no declared result would otherwise be absorbed into it and read as normal.',
  }),
});

/* -------------------------------------------------------- code enforcement */

/**
 * STATUS IS THE BADGE AND THE RUNG IS A SECOND CHANNEL. One element never
 * carries both, which is the same rule the lens applies to department. The rung
 * renders as "3 of 4 · Final notice" because an escalation ladder is ordered:
 * rung 3 is further along than rung 2, and the number is data on the record
 * rather than the row's position in a list.
 *
 * NO FIGURE OF MONEY APPEARS ANYWHERE ON THIS TAB, and the basis says so. A
 * city's ladder ends in an assessed figure; no ledger has been read, so none is
 * printed. This is the highest-PII surface on the lens -- a complaint names a
 * neighbour -- and the complainant is not a field on the record at all.
 */
const ceRungMax = Math.max(...FIX.code.escalation.map((r) => r.count));
const ceRungs = FIX.code.escalation.length;

const codeEnforcement = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'DEMO RECORDS', foot: FOOT_FIXTURE,
  att: ATT_FIXTURE, counts: COUNTS_FIXTURE, activeTab: 'Code enforcement',
  strip: [
    ...Object.entries(CODE_STATUS).map(([id, [label]]) => ({
      v: String(FIX.code.status[id]), k: label.toLowerCase(), tone: TONE[id],
    })),
    { v: String(FIX.code.total), k: 'total' },
  ],
  panelTitle: 'Cases', panelSub: 'generated fixture · nothing was read', demoMark: true,
  modes: null, exportBtn: false,
  load: {
    title: 'Officer load', sub: FIX.code.load.length + ' officers · ' + FIX.code.load.reduce((a, l) => a + l.open, 0) + ' open',
    basis: 'Basis: a generated record names no person; the officer is an opaque reference and a granted feed is where a name would come from.',
    people: FIX.code.load.map((l) => ({
      n: l.ref, c: l.open + ' open · ' + l.total + ' total',
      pct: pct(l.open, Math.max(...FIX.code.load.map((x) => x.open))),
    })),
  },
  filter: {
    search: 'Search case #, type, place',
    filters: [{ t: 'All statuses' }, { t: 'All types' }, { t: 'All officers' }],
    count: FIX.code.total + ' results',
  },
  cols: '112px 178px minmax(0,1fr) 154px 176px 74px 116px',
  head: ['Case #', 'Type', 'Place', 'Status', 'Step', 'Officer', 'Compliance due'],
  rows: FIX.code.rows.map((r) => [
    r.id, r.type, r.place,
    chip(CODE_STATUS[r.status][0], ...CODE_STATUS[r.status][1]),
    r.step + ' of ' + ceRungs + ' · ' + FIX.code.escalation.find((x) => x.step === r.step).label,
    mono(r.officer), mono(r.due),
  ]),
  pageText: 'Page 1 of ' + pages(FIX.code.total) + ' · ' + FIX.code.total + ' total · sorted by severity, then rung',
  axis: axisLadder({
    title: 'Escalation', sub: 'An ordered axis · the rung is contract, not array position',
    rungs: FIX.code.escalation.map((r) => ({
      step: String(r.step), k: r.label, v: String(r.count),
      tone: ['--sc-ink-3', '--sc-info', '--sc-warn', '--sc-crit'][r.step - 1],
      pct: pct(r.count, ceRungMax),
    })),
    basis: 'Basis: cases whose escalation equals this rung, over the generated mygov code-violation records on this pack, one row per record. No rung names money: a city escalation ladder ends in an assessed figure and no ledger has been read, so none is printed anywhere on this tab.',
  }),
});

/* ----------------------------------------------------------------- licences */

/**
 * THE ONE TAB WITH NO LOAD DIMENSION, AND IT SAYS SO. A licence is held by a
 * business; it is not assigned to a member of staff. The other three operational
 * tabs share one load component and this one omitting it is a property of the
 * data rather than a gap in the design, so the absence is stated where the strip
 * would have been instead of the tab quietly looking different.
 *
 * The holder is opaque for the same reason the inspector is. A licensee is a
 * real commercial entity, and inventing plausible business names would put
 * fabricated companies on a surface a city reads -- "a fixture that has to be
 * explained is a fixture that will be believed", from the domain source.
 */
const BAND_RANGE = {
  expired: 'up to -1 day', 'within-30': '0 to 30',
  'within-90': '31 to 90', 'beyond-90': '91 and beyond',
};
const BAND_TONE = { expired: '--sc-crit', 'within-30': '--sc-warn', 'within-90': '--sc-info', 'beyond-90': '--sc-ok' };
const blBandMax = Math.max(...FIX.licences.bands.map((b) => b.count));

const licences = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'DEMO RECORDS', foot: FOOT_FIXTURE,
  att: ATT_FIXTURE, counts: COUNTS_FIXTURE, activeTab: 'Licenses',
  strip: [
    { v: String(FIX.licences.total), k: 'all' },
    ...Object.entries(LIC_STATUS).map(([id, [label]]) => ({
      v: String(FIX.licences.status[id]), k: label.toLowerCase(), tone: TONE[id],
    })),
    { v: String(FIX.licences.categories), k: 'categories' },
  ],
  panelTitle: 'Licence roll', panelSub: 'generated fixture · nothing was read', demoMark: true,
  modes: null, exportBtn: false,
  load: {
    title: 'No load dimension',
    sub: 'a licence is held by a business, not assigned to staff',
    basis: 'Basis: the roll carries no assignee, so no load strip is drawn. Inspections, Work orders and Code enforcement share one load component; this tab omitting it is a property of the record, not an inconsistency.',
  },
  filter: {
    search: 'Search licence #, category, place',
    filters: [{ t: 'All statuses' }, { t: 'All categories' }],
    count: FIX.licences.total + ' results',
  },
  cols: '116px 78px 228px minmax(0,1fr) 148px 148px',
  head: ['Licence #', 'Holder', 'Category', 'Place', 'Expires', 'Status'],
  rows: FIX.licences.rows.map((r) => [
    r.id, mono(r.holder), r.category, r.place, mono(r.expires),
    chip(LIC_STATUS[r.status][0], ...LIC_STATUS[r.status][1]),
  ]),
  pageText: 'Page 1 of ' + pages(FIX.licences.total) + ' · ' + FIX.licences.total + ' total · sorted by severity, then expiry',
  axis: axisBands({
    title: 'Expiry', sub: 'A continuous axis · bands derived from an integer every record carries',
    bands: FIX.licences.bands.map((b) => ({
      k: b.label, range: BAND_RANGE[b.id], v: String(b.count),
      tone: BAND_TONE[b.id], pct: pct(b.count, blBandMax),
    })),
    basis: 'Basis: licences whose expiry offset falls in this band, over the generated mygov business-license records on this pack, one row per record; bands are inclusive and do not overlap, so a record outside every band is a reconciliation failure rather than a silent remainder. No renewal charge is presented: no ledger has been read.',
  }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), pipeline);
fs.writeFileSync(new URL('./Inspections.dc.html', import.meta.url), inspections);
fs.writeFileSync(new URL('./WorkOrders.dc.html', import.meta.url), workOrders);
fs.writeFileSync(new URL('./CodeEnforcement.dc.html', import.meta.url), codeEnforcement);
fs.writeFileSync(new URL('./Licences.dc.html', import.meta.url), licences);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), empty);

/** Laid out in the shipped tab order, so the canvas reads as the lens does. */
fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Pipeline — default tab' },
    { file: 'Inspections.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Inspections — paired second axis' },
    { file: 'WorkOrders.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'Work orders — load + pagination' },
    { file: 'CodeEnforcement.dc.html', x: 5160, y: 0, w: 1600, h: 1040, title: 'Code enforcement — ordered second axis' },
    { file: 'Licences.dc.html', x: 6880, y: 0, w: 1600, h: 1040, title: 'Licenses — continuous second axis' },
    { file: 'Empty.dc.html', x: 8600, y: 0, w: 1600, h: 1040, title: 'Empty pack' },
  ],
  annotations: [
    { id: 'tiers', x: 0, y: -280, w: 640, text: 'THREE TIERS, not two walls of numbers.\nv1 stacks 6 lens tiles + 5 tab metrics = 11 numbers before any content.\n1. Attention row - filtered entry points, primary.\n2. Tab strip - carries its own count inline (v1 already does this at the pill level).\n3. Tab metric strip - compact, secondary, no cards.' },
    { id: 'place-removed', x: 700, y: -280, w: 660, text: 'THE PLACE TAB IS GONE, 2026-09-15.\nThis strip carried eight tabs including Place. The product has seven and never had Place: verified against DS_TABS and TAB_LABELS in web/index.html at origin/main.\nThe map became a persistent dock rail instead (smartcity-map-dock, approved, dispatched G-128) and _design/smartcity-place-tab is the option not taken.\nA design going to a city for approval may not show a tab we ruled against building.' },
    { id: 'axis', x: 1720, y: -280, w: 740, text: 'THE SECOND AXIS TAKES ITS SHAPE FROM THE DATA.\nEvery operational tab carries a queue plus a second dimension, and the three second dimensions are not the same kind of thing:\n  Inspections - PAIRED. Result is defined for every record, meaningful for a subset. Four peer classes.\n  Code enforcement - ORDERED. An escalation ladder; rung 3 is further along than rung 2. Rungs.\n  Licences - CONTINUOUS. Expiry is an integer on every record; bands are derived from it. Bands with printed boundaries.\nDrawing all three as tiles would assert they are the same shape. They are not, and the difference is what staff read.' },
    { id: 'notinspected', x: 2520, y: -280, w: 700, text: 'EVERY ROW ON PAGE ONE READS "NOT INSPECTED". That is correct, not a defect.\nThe queue sorts by severity, so page one is the unresolved work and none of it has been inspected yet. "Not inspected" is a declared result value carrying a basis, never an empty cell, and it is MEASURED rather than derived by subtracting the other three - a record matching no declared result would otherwise be absorbed into it and read as normal.\nThree rows read "Not scheduled". An unscheduled inspection has no day and none is invented; a zero would render as "today", which is a claim.' },
    { id: 'people', x: 3440, y: -280, w: 700, text: 'NOBODY IS NAMED ON A PUBLISHED WORKLOAD RANKING.\nThis strip named five people until 2026-09-15. Those strings appear nowhere in doc_repo outside gen.mjs and nowhere in smartcity-dashboards, so they were invented or transcribed from a capture not in this repo. Invented staff on a performance rank is fabrication; real staff on one is not ours to publish to their employer.\nThe product had already ruled it: "the dimension survives, the person does not" (src/domains/inspections.mjs). Opaque refs, and the load table is still buildable.' },
    { id: 'table', x: 4240, y: -280, w: 640, text: 'ONE TABLE TREATMENT for every operational list.\nv1 uses a real table on Code enforcement (the most scannable view in the app) and stacked rich rows everywhere else (walls of text). The table wins and every tab inherits it.' },
    { id: 'badge', x: 5160, y: -280, w: 700, text: 'STATUS IS THE BADGE; THE RUNG IS A SECOND CHANNEL.\nOne element never carries both, the same rule the lens applies to department. The rung renders as "3 of 4 - Final notice" because the number is data on the record, not the row\u0027s position in a list: a rung inserted later must not silently renumber the ones above it.\nNO FIGURE OF MONEY APPEARS ANYWHERE ON THIS TAB and the basis says so. A city ladder ends in an assessed figure; no ledger has been read.' },
    { id: 'pii', x: 5960, y: -280, w: 720, text: 'PII: the free-text description is NOT a list column.\nv1 work-order descriptions carry citizen names and personal phone numbers ("DEBORAH MOORE, PH#737-762-6252"). Structured columns - type, place, department - are more scannable AND stop rendering PII into a scannable list.\nCode enforcement is the highest-PII surface here: a complaint names a neighbour. The complainant is not a field on the record at all.\nThis is a design decision, NOT a control. The fields still need a real gate.' },
    { id: 'noload', x: 6880, y: -280, w: 680, text: 'THE ONE TAB WITH NO LOAD DIMENSION, AND IT SAYS SO.\nA licence is held by a business; it is not assigned to a member of staff. The other three operational tabs share one load component, and this tab omitting it is a property of the record rather than a gap - so the absence is stated where the strip would have been, instead of the tab quietly looking different.\nThe holder is opaque for the reason the inspector is: inventing plausible business names would put fabricated companies on a surface a city reads.' },
    { id: 'demo', x: 7640, y: -280, w: 700, text: 'THESE THREE RENDER THE DEMO PACK, DELIBERATELY.\nPipeline and Work orders show a granted MyGov read. These three show the same lens BEFORE a source is granted, which is what Bastrop staff see on day one.\nIt is also the only mode where every value is checkable against the domain source. And it is the honest answer to "is any of this real": the fixture place vocabulary is Template Commons, Fixture Ridge, Example Crossing, Sample Bend, Placeholder Heights, Specimen Yard.\nThe demo data announces itself as demo data, in the data.' },
    { id: 'load', x: 8600, y: -280, w: 640, text: 'ONE LOAD PATTERN, not three panels.\nInspector load, Manager load and Officer load are the same shape: work distributed across people. One collapsible strip, same component, on every tab with assignable work.\nService performance becomes a VIEW MODE (List / Map / Performance), not a stray button.' },
    { id: 'pr', x: 9360, y: -280, w: 620, text: 'Plan review is a TAB here and a separate scope.\nOperator ruling 2026-09-14. It is named in the strip so staff can find it, and it is designed in its own three folders - plan-review, plan-review-reasoner, plan-review-departments.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Inspections, WorkOrders, CodeEnforcement, Licences, Empty + canvas.json');
