import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

const CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const PLUS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const MINUS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const EXPAND = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NEXT': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'UNAVAILABLE': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
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
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' + rows.join('\n') + '\n        </div>';
const nav = (foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', LENSES.map((l) => navRow(l[0], l[1], l[0] === 'Development services'))) + '\n' +
  navGroup('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:320px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n    </header>';

const TABS = [
  { n: 'Pipeline', c: '12,683' }, { n: 'Place', c: '' }, { n: 'Inspections', c: '949' },
  { n: 'Work orders', c: '16,723' }, { n: 'Code enforcement', c: '1,502' }, { n: 'Licences', c: '72' },
  { n: 'Plan review', c: '', b: 'NEXT' }, { n: 'Flood study', c: '', b: 'NEXT' },
];
const tabs = (active) =>
'        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
TABS.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:6px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    (t.c ? '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + t.c + '</span>' : '') + (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n        </div>';

// ---- the map ----
const mapPanel = (o) =>
'          <div style="flex:1; min-width:0; position:relative; background:var(--sc-map-ground, #E7EBEE); border-right:1px solid var(--sc-line); overflow:hidden;">\n' +
'            <div style="position:absolute; inset:0; background-image:linear-gradient(var(--sc-line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--sc-line-faint) 1px, transparent 1px); background-size:58px 58px; opacity:.55;"></div>\n' +
(o.parcels || '') +
'            <div style="position:absolute; left:var(--sc-3); top:var(--sc-3); display:flex; flex-direction:column; gap:2px;">\n' +
'              <div style="width:26px; height:26px; display:grid; place-items:center; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control) var(--sc-r-control) 0 0; color:var(--sc-ink-2);">' + PLUS + '</div>\n' +
'              <div style="width:26px; height:26px; display:grid; place-items:center; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:0 0 var(--sc-r-control) var(--sc-r-control); color:var(--sc-ink-2);">' + MINUS + '</div>\n            </div>\n' +
'            <div style="position:absolute; right:var(--sc-3); top:var(--sc-3); display:flex; align-items:center; gap:6px; height:26px; padding:0 10px; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); font:500 13px/18px var(--sc-font-ui); color:var(--sc-ink);">Layers <span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-full); padding:0 6px;">' + o.layerCount + '</span><span style="color:var(--sc-ink-3); display:flex;">' + CHEV + '</span></div>\n' +
'            <div style="position:absolute; right:var(--sc-3); bottom:var(--sc-3); display:flex; gap:6px;">\n' +
'              <div style="display:flex; align-items:center; gap:5px; height:24px; padding:0 9px; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2);">Legend</div>\n' +
'              <div style="width:24px; height:24px; display:grid; place-items:center; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); color:var(--sc-ink-2);">' + EXPAND + '</div>\n            </div>\n' +
'            <div style="position:absolute; left:var(--sc-3); bottom:var(--sc-3); font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); padding:2px 7px;">' + o.attrib + '</div>\n' +
'          </div>';

const parcelShapes = (sel) => {
  const P = [
    [8, 14, 15, 11, '--sc-restricted'], [25, 12, 13, 13, '--sc-info'], [40, 16, 11, 10, '--sc-ok'],
    [54, 11, 14, 14, '--sc-restricted'], [72, 15, 12, 11, '--sc-info'],
    [6, 30, 12, 12, '--sc-info'], [21, 33, 10, 9, '--sc-ok'], [34, 29, 13, 13, '--sc-restricted'],
    [62, 32, 15, 12, '--sc-warn'], [80, 30, 11, 13, '--sc-info'],
    [10, 50, 14, 12, '--sc-ok'], [27, 52, 11, 10, '--sc-restricted'], [55, 49, 12, 13, '--sc-info'],
    [70, 53, 13, 11, '--sc-restricted'], [86, 50, 9, 12, '--sc-warn'],
    [14, 70, 13, 12, '--sc-info'], [31, 72, 12, 11, '--sc-restricted'], [48, 68, 14, 13, '--sc-ok'],
    [66, 71, 11, 11, '--sc-info'], [82, 69, 12, 12, '--sc-restricted'],
  ];
  return P.map(([x, y, w, h, c], i) => {
    const on = sel && i === 7;
    return '            <div style="position:absolute; left:' + x + '%; top:' + y + '%; width:' + w + '%; height:' + h + '%; background:var(' + c + '); opacity:' + (on ? '.55' : '.30') + '; border:' + (on ? '2px solid var(--sc-accent)' : '1px solid var(' + c + ')') + '; border-radius:2px;"></div>';
  }).join('\n') +
  (sel ? '\n            <div style="position:absolute; left:39.5%; top:33%; width:14px; height:14px; border-radius:50%; background:var(--sc-accent); border:2px solid var(--sc-surface); box-shadow:var(--sc-e2);"></div>' : '');
};

// ---- dossier ----
const fact = (f) =>
'              <div style="display:flex; flex-direction:column; gap:2px; padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'                <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + f.k + '</span>\n' +
(f.refused
  ? '                <span style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-warn);">Refused</span>\n'
  : '                <span style="font:400 15px/21px ' + (f.mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(--sc-ink);">' + f.v + '</span>\n') +
'                <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:9px; margin-top:2px;">' + f.src + '</span>\n              </div>';

const sectionHead = (t) =>
'              <div style="padding:var(--sc-2) var(--sc-4); background:var(--sc-surface-2); border-top:1px solid var(--sc-line-faint); border-bottom:1px solid var(--sc-line-faint); font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3);">' + t + '</div>';

const recRow = (r) =>
'              <div style="display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:var(--sc-2); align-items:center; padding:8px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'                <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); white-space:nowrap;">' + r.id + '</span>\n' +
'                <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + r.t + '</span>\n' +
'                <span style="font:500 12px/16px var(--sc-font-ui); color:' + r.c + '; background:' + r.w + '; border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + r.s + '</span>\n              </div>';

const OK = ['var(--sc-ok)', 'var(--sc-ok-wash)'];
const WARN = ['var(--sc-warn)', 'var(--sc-warn-wash)'];
const INFO = ['var(--sc-info)', 'var(--sc-info-wash)'];
const CRIT = ['var(--sc-crit)', 'var(--sc-crit-wash)'];

function artboard(o) {
  const rail =
'          <aside style="width:400px; flex:none; background:var(--sc-surface); display:flex; flex-direction:column; overflow:hidden;">\n' +
(o.selected
  ? '            <div style="padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line);">\n' +
    '              <div style="font:650 18px/24px var(--sc-font-ui); letter-spacing:-.015em; color:var(--sc-ink);">' + o.addr + '</div>\n' +
    '              <div style="display:flex; align-items:center; gap:var(--sc-2); margin-top:3px;"><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pid + '</span>' + badge('LIVE RECORDS') + '</div>\n            </div>\n' +
    '            <div style="flex:1; min-height:0; overflow:hidden;">\n' + o.facts.map(fact).join('\n') + '\n' +
    sectionHead(o.recTitle) + '\n' + o.records.map(recRow).join('\n') + '\n' +
    '              <div style="padding:var(--sc-2) var(--sc-4); font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">' + o.recMore + '</div>\n            </div>\n'
  : '            <div style="flex:1; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:var(--sc-3); padding:var(--sc-8) var(--sc-6);">\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.emptyK + '</div>\n' +
    '              <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + o.emptyH + '</h2>\n' +
    '              <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.emptyP + '</p>\n' +
    '              <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.emptyB + '</div>\n            </div>\n') +
'          </aside>';

  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Development services / Place</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Development services</h1>' + badge(o.pageBadge) + '</div>\n      </div>\n' +
tabs('Place') + '\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);">\n' +
'          <div style="flex:1; max-width:520px; height:30px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); display:flex; align-items:center; padding:0 var(--sc-3); font:400 13px/18px var(--sc-font-ui); color:var(' + (o.selected ? '--sc-ink' : '--sc-ink-3') + ');">' + o.searchText + '</div>\n' +
'          <div style="height:30px; padding:0 var(--sc-5); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); display:flex; align-items:center; font:500 13px/18px var(--sc-font-ui);">Search</div>\n' +
'          <div style="flex:1;"></div>\n          <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.mapBasis + '</span>\n        </div>\n' +
'        <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex;">\n' +
mapPanel({ parcels: parcelShapes(o.selected), layerCount: o.layerCount, attrib: o.attrib }) + '\n' + rail + '\n' +
'        </section>\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const FOOT = '7 of 10 sources granted<br>4 of 10 reading records<br>bastrop_tx';

const selected = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'LIVE RECORDS', foot: FOOT,
  selected: true, layerCount: '52', attrib: 'Leaflet · Tiles © Esri',
  searchText: '908 PINE ST, BASTROP, TX 78602',
  mapBasis: 'property-intel · read live for this request',
  addr: '908 PINE ST', pid: '48021:34137',
  facts: [
    { k: 'Owner', v: 'Withheld — Studio or Team only', src: 'owner-fact · gated', mono: false },
    { k: 'Zoning district', v: 'SF-1 · Single Family Residential', src: "PlaceTypeDesc, city's own value · Bastrop GIS layer 23" },
    { k: 'Land use', v: 'A1 · Single-family residential', src: 'cad-roll · stratmap25 drop, 2025' },
    { k: 'Flood zone', v: 'X · outside the 0.2% annual chance', src: "FEMA's own zone code · NFHL_48_20260101" },
    { k: 'Setbacks', v: 'Front 30 · Side 10 · Corner 20 · Rear 30', src: 'district-setback-table · layer 83, most current' },
    { k: 'Buildable area', refused: true, src: 'Refused by ruling R-2 — the envelope draws, the figure does not, until an envelope atom backs it' },
    { k: 'Water / sewer', v: 'City of Bastrop · CCN 20466', src: 'utility-service-fact · 2026-09-03' },
  ],
  recTitle: 'On this parcel · 6',
  records: [
    { id: '26-000317', t: 'Residential Addition', s: 'Info required', c: WARN[0], w: WARN[1] },
    { id: '26-000290', t: 'Mechanical Attachment', s: 'Approved', c: OK[0], w: OK[1] },
    { id: 'IN-000776', t: 'Mechanical inspection', s: 'Complete', c: OK[0], w: OK[1] },
    { id: 'IN-000635', t: 'New residential review', s: 'Active', c: INFO[0], w: INFO[1] },
    { id: '26-000131', t: 'Tall weeds and grass', s: 'In review', c: CRIT[0], w: CRIT[1] },
    { id: '24-002854', t: 'ROW tree trimming', s: 'On hold', c: 'var(--sc-ink-3)', w: 'var(--sc-quiet-wash)' },
  ],
  recMore: 'Open all 6 in Pipeline',
});

const unselected = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'LIVE RECORDS', foot: FOOT,
  selected: false, layerCount: '52', attrib: 'Leaflet · Tiles © Esri',
  searchText: 'Search an address or parcel', mapBasis: 'property-intel · ready',
  emptyK: 'Nothing selected',
  emptyH: 'Parcel resolves from the map, not a typed form.',
  emptyP: 'Click any parcel to read its zoning, land use, flood zone, setbacks and utilities, with the permits, inspections and cases recorded against it.',
  emptyB: 'Basis: 52 GIS layers available on this pack.',
});

const otherCity = artboard({
  theme: 'dark', city: 'Elgin, TX', seal: 'EL', pageBadge: 'NOT READ',
  foot: '1 of 10 sources granted<br>1 of 10 reading records<br>elgin_tx',
  selected: false, layerCount: '0', attrib: 'No basemap grant',
  searchText: 'Search an address or parcel', mapBasis: 'property-intel · unavailable',
  emptyK: 'Unavailable',
  emptyH: 'Place is not available on this pack.',
  emptyP: 'The upstream parcel, zoning and flood queries are bound to one city’s GIS services. This pack has no parcel source of its own, and this product will not serve another city’s data under this city’s name.',
  emptyB: 'Basis: composePropertyIntelSummary refuses any cityKey but bastrop_tx. Second-city support is a build, not a grant.',
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), selected);
fs.writeFileSync(new URL('./Unselected.dc.html', import.meta.url), unselected);
fs.writeFileSync(new URL('./OtherCity.dc.html', import.meta.url), otherCity);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Parcel selected' },
    { file: 'Unselected.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Nothing selected' },
    { file: 'OtherCity.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'Any other city — refuses' },
  ],
  annotations: [
    { id: 'parity', x: 0, y: -250, w: 660, text: 'PARITY WITH v1, deliberately.\nMap left, dossier right, records under the dossier in the same rail - the shape staff already use. The read path already exists (G-117): address in, geocoded parcel + zoning + flood + real permits/inspections/code-cases out.' },
    { id: 'source', x: 740, y: -250, w: 660, text: 'EVERY VALUE CARRIES ITS SOURCE.\nZoning is the city’s own PlaceTypeDesc string, flood is FEMA’s own zone code, permit status is MyGov’s own value. None of it is remapped onto an invented taxonomy, so each one states where it came from and when.' },
    { id: 'refused', x: 1720, y: -250, w: 660, text: 'BUILDABLE AREA IS REFUSED, NOT MISSING.\nOperator ruling R-2: the envelope draws, the figure is withheld until an envelope atom backs it. The row stays visible and says Refused with its basis - deleting it would read as a gap and invite someone to "fix" a decision.' },
    { id: 'city2', x: 2460, y: -250, w: 660, text: 'THE REFUSAL IS A FEATURE.\ncomposePropertyIntelSummary refuses any cityKey but bastrop_tx, because the upstream queries are bound to Bastrop’s ArcGIS. Drawn here so the constraint is visible: this tab does NOT port to city two as written.' },
    { id: 'pii', x: 3440, y: -250, w: 620, text: 'Record rows carry id, subject and status - never the free-text description, which is where citizen names and phone numbers live. Same rule as the Work orders table.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main.dc.html, Unselected.dc.html, OtherCity.dc.html, canvas.json');
