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

const TABS = (counts) => [
  { n: 'Pipeline', c: counts.pipeline }, { n: 'Place', c: '' }, { n: 'Inspections', c: counts.insp },
  { n: 'Work orders', c: counts.wo }, { n: 'Code enforcement', c: counts.ce }, { n: 'Licences', c: counts.lic },
  { n: 'Plan review', c: '', b: 'NEXT' }, { n: 'Flood study', c: '', b: 'NEXT' },
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
'            <div style="flex:1;"></div>\n' + (o.modes ? '            ' + viewModes(o.modes, o.mode) + '\n' : '') +
(o.exportBtn ? '            <span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); padding:0 var(--sc-2);">Export</span>\n' : '') +
'          </div>\n' +
(o.load ? loadStrip(o.load) + '\n' : '') +
(o.rows ? filterBar(o.filter) + '\n' + table({ cols: o.cols, head: o.head, rows: o.rows }) + '\n' + pager(o.pageText) : emptyState(o.emptyK, o.emptyH, o.emptyP, o.emptyB)) + '\n' +
'        </section>\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
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
    ['26-000317', 'Residential Addition', '908 PINE ST', 'D. Moore', chip('Info required', ...WARN), { t: '09/02/26', mono: true }],
    ['26-000314', 'Monument Permit (Sign)', '302 MAIN ST', 'Bastrop Signs LLC', chip('Approved', ...OK), { t: '08/29/26', mono: true }],
    ['26-000309', 'Electric Attachment', '1109 PECAN ST', 'Bluebonnet Electric', chip('In review', ...INFO), { t: '08/28/26', mono: true }],
    ['26-000301', 'Plumbing Attachment', '77 FARM ST', 'R. Garner', chip('Expiring', ...WARN), { t: '08/21/26', mono: true }],
    ['26-000298', 'Special Event Permit', '1311 MAIN ST', 'Bastrop Chamber', chip('Approved', ...OK), { t: '08/19/26', mono: true }],
    ['26-000294', 'New Residential', '204 HILL ST', 'Hill Country Homes', chip('On hold', ...QUIET), { t: '08/14/26', mono: true }],
    ['26-000290', 'Mechanical Attachment', '1922 CRISTOBAL ST', 'Lone Star HVAC', chip('Approved', ...OK), { t: '08/12/26', mono: true }],
    ['26-000287', 'Fence Permit', '11 DEPOT ST', 'M. Leavis', chip('Approved', ...OK), { t: '08/11/26', mono: true }],
  ],
  pageText: 'Page 1 of 79 · 709 total',
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
  load: {
    title: 'Manager load', sub: '17 managers · 44 active',
    people: [
      { n: 'R. McBain', c: '14 active', pct: 100, tone: '--sc-crit' },
      { n: 'A. Jordan', c: '11 active', pct: 79 },
      { n: 'C. Kennedy', c: '8 active', pct: 57 },
      { n: 'W. Mannon', c: '6 active', pct: 43 },
      { n: 'G. Recoil', c: '5 active', pct: 36 },
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

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), pipeline);
fs.writeFileSync(new URL('./WorkOrders.dc.html', import.meta.url), workOrders);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), empty);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Pipeline — default tab' },
    { file: 'WorkOrders.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Work orders — load + pagination' },
    { file: 'Empty.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'Empty pack' },
  ],
  annotations: [
    { id: 'tiers', x: 0, y: -250, w: 640, text: 'THREE TIERS, not two walls of numbers.\nv1 stacks 6 lens tiles + 5 tab metrics = 11 numbers before any content.\n1. Attention row - filtered entry points, primary.\n2. Tab strip - carries its own count inline (v1 already does this at the pill level).\n3. Tab metric strip - compact, secondary, no cards.' },
    { id: 'table', x: 720, y: -250, w: 660, text: 'ONE TABLE TREATMENT for every operational list.\nv1 uses a real table on Code enforcement (the most scannable view in the app) and stacked rich rows everywhere else (walls of text). The table wins and every tab inherits it.' },
    { id: 'pii', x: 1720, y: -250, w: 720, text: 'PII: the free-text description is NOT a list column.\nv1 work-order descriptions carry citizen names and personal phone numbers ("DEBORAH MOORE, PH#737-762-6252"). Structured columns - type, address, department - are more scannable AND stop rendering PII into a scannable list.\nThis is a design decision, NOT a control. The field still needs a real gate.' },
    { id: 'load', x: 2500, y: -250, w: 640, text: 'ONE LOAD PATTERN, not three panels.\nInspector load, Manager load and Officer load are the same shape: work distributed across people. One collapsible strip, same component, on every tab with assignable work.\nService performance becomes a VIEW MODE (List / Map / Performance), not a stray button.' },
    { id: 'pr', x: 3440, y: -250, w: 620, text: 'Plan review is a TAB here and a separate scope.\nOperator ruling 2026-09-14. It is named in the strip so staff can find it, and its design is the next session - not folded into this one.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main.dc.html, WorkOrders.dc.html, Empty.dc.html, canvas.json');
