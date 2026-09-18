import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

const CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const PLUS = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const MINUS = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const LAYERS = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 17 9 5 9-5"/><path d="m3 12 9 5 9-5"/></svg>';

const B = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'], 'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'], 'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'], 'NEXT': ['var(--sc-info)', 'var(--sc-info-wash)'],
};
const badge = (t) => { if (!t) return ''; const [c, w] = B[t] || B['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>'; };

const LENSES = [['Overview','LIVE RECORDS'],['Development services','LIVE RECORDS'],['Finance','EMPTY'],['Citizen','PREVIEW'],['Public works','LIVE RECORDS'],['Parks','NOT BUILT'],['Police','LIVE RECORDS'],['Fire and EMS','NOT READ'],['Fleet','LIVE RECORDS']];
const navRow = (n, b, on) =>
  '        <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:27px; padding:2px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 13px/19px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';
const navGroup = (l, rows) => '      <div style="display:flex; flex-direction:column; gap:1px; padding:6px 0;">\n' +
  '        <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:6px var(--sc-3) 2px;">' + l + '</div>\n' + rows.join('\n') + '\n      </div>';
const nav = () => '    <nav style="width:216px; flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2); overflow:hidden;">\n' +
  navGroup('Lenses', LENSES.map((l) => navRow(l[0], l[1], l[0] === 'Development services'))) + '\n' +
  navGroup('Work', [['Plan review','PREVIEW'],['Files','PREVIEW'],['Records search','NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n    </nav>';

const topbar = () =>
'  <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'    <div style="width:22px; height:22px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>\n' +
'    <span style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">Bastrop, TX</span>\n' +
'    <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:0 6px;">STAGING</span>\n' +
'    <div style="flex:1;"></div>\n  </header>';

const TABS = ['Pipeline','Inspections','Work orders','Code enforcement','Licenses','Plan review','Flood study'];
const tabs = () => '      <div style="display:flex; gap:var(--sc-4); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1); flex:none;">\n' +
TABS.map((t, i) => '        <span style="font:' + (i === 0 ? '620' : '400') + ' 13px/19px var(--sc-font-ui); color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-2') + '); padding:var(--sc-2) 0 9px; box-shadow:' + (i === 0 ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + '; white-space:nowrap;">' + t + '</span>').join('\n') + '\n      </div>';

// ---------------- map canvas ----------------
const parcels = (h) => {
  const P = [[8,14,15,11,'--sc-restricted'],[25,12,13,13,'--sc-info'],[40,16,11,10,'--sc-ok'],[54,11,14,14,'--sc-restricted'],[72,15,12,11,'--sc-info'],
    [6,32,12,12,'--sc-info'],[21,35,10,9,'--sc-ok'],[34,30,13,13,'--sc-restricted'],[62,34,15,12,'--sc-warn'],[80,32,11,13,'--sc-info'],
    [10,54,14,12,'--sc-ok'],[27,56,11,10,'--sc-restricted'],[55,53,12,13,'--sc-info'],[70,57,13,11,'--sc-restricted'],[86,54,9,12,'--sc-warn'],
    [14,75,13,12,'--sc-info'],[31,77,12,11,'--sc-restricted'],[48,73,14,13,'--sc-ok'],[66,76,11,11,'--sc-info'],[82,74,12,12,'--sc-restricted']];
  const keep = h > 260 ? P : P.slice(0, 12);
  return keep.map(([x,y,w,hh,c],i) => {
    const on = i === 7;
    return '        <div style="position:absolute; left:' + x + '%; top:' + y + '%; width:' + w + '%; height:' + hh + '%; background:var(' + c + '); opacity:' + (on ? '.55' : '.28') + '; border:' + (on ? '2px solid var(--sc-accent)' : '1px solid var(' + c + ')') + '; border-radius:2px;"></div>';
  }).join('\n') + '\n        <div style="position:absolute; left:39.5%; top:34%; width:13px; height:13px; border-radius:50%; background:var(--sc-accent); border:2px solid var(--sc-surface); box-shadow:var(--sc-e2);"></div>';
};

const dockControl = (active) =>
'        <div style="position:absolute; right:var(--sc-2); top:var(--sc-2); display:flex; gap:2px; padding:2px; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control);">' +
['Dock','Expand','Full'].map((m) => '<span style="font:500 12px/16px var(--sc-font-ui); padding:2px 8px; border-radius:3px; color:var(' + (m === active ? '--sc-on-accent' : '--sc-ink-3') + '); background:' + (m === active ? 'var(--sc-accent)' : 'transparent') + ';">' + m + '</span>').join('') + '</div>';

const mapCanvas = (o) =>
'      <div style="position:relative; ' + o.box + ' background:var(--sc-map-ground, #E7EBEE); overflow:hidden; ' + (o.border || '') + '">\n' +
'        <div style="position:absolute; inset:0; background-image:linear-gradient(var(--sc-line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--sc-line-faint) 1px, transparent 1px); background-size:54px 54px; opacity:.5;"></div>\n' +
parcels(o.h) + '\n' +
'        <div style="position:absolute; left:var(--sc-2); top:var(--sc-2); display:flex; flex-direction:column; gap:2px;">' +
'<span style="width:24px; height:24px; display:grid; place-items:center; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control) var(--sc-r-control) 0 0; color:var(--sc-ink-2);">' + PLUS + '</span>' +
'<span style="width:24px; height:24px; display:grid; place-items:center; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:0 0 var(--sc-r-control) var(--sc-r-control); color:var(--sc-ink-2);">' + MINUS + '</span></div>\n' +
dockControl(o.dock) + '\n' +
(o.layersButton
  ? '        <div style="position:absolute; left:var(--sc-2); bottom:var(--sc-2); display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 9px; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); font:500 12px/16px var(--sc-font-ui); color:var(--sc-ink);">' + LAYERS + ' Layers <span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-full); padding:0 5px;">4</span></div>\n'
  : '') +
'      </div>';

// ---------------- the two components ----------------
const panelHead = (t, right) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:34px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint); flex:none;">' +
'<span style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + t + '</span><div style="flex:1;"></div>' + (right || '') + '</div>';

const factRow = (f) =>
'            <div style="display:flex; flex-direction:column; gap:1px; padding:6px var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">' +
'<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + f.k + '</span>' +
(f.refused
  ? '<span style="font:620 13px/19px var(--sc-font-ui); color:var(--sc-warn);">Refused</span>'
  : '<span style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + f.v + '</span>') +
'<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:8px; margin-top:2px;">' + f.src + '</span></div>';

const FACTS = [
  { k: 'Zoning district', v: 'SF-1 · Single Family', src: "PlaceTypeDesc · city GIS layer 23" },
  { k: 'Flood zone', v: 'X · outside 0.2% chance', src: "FEMA zone code · NFHL_48_20260101" },
  { k: 'Setbacks', v: 'F 30 · S 10 · C 20 · R 30', src: 'district-setback-table · layer 83' },
  { k: 'Buildable area', refused: true, src: 'Refused by ruling R-2' },
  { k: 'Water / sewer', v: 'City of Bastrop · CCN 20466', src: 'utility-service-fact · 2026-09-03' },
];

const propertyPanel = (o) =>
'        <section style="' + o.box + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; display:flex; flex-direction:column; min-width:0;">\n' +
'          <div style="padding:var(--sc-2) var(--sc-3); border-bottom:1px solid var(--sc-line); flex:none;">' +
'<div style="font:650 16px/22px var(--sc-font-ui); letter-spacing:-.012em; color:var(--sc-ink);">908 PINE ST</div>' +
'<div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">48021:34137 · one click</div></div>\n' +
'          <div style="flex:1; min-height:0; overflow:hidden;">\n' + FACTS.slice(0, o.n).map(factRow).join('\n') + '\n          </div>\n        </section>';

const REC = [
  { id: '26-000317', t: 'Residential Addition', s: 'Info required', c: 'var(--sc-warn)', w: 'var(--sc-warn-wash)' },
  { id: '26-000290', t: 'Mechanical Attachment', s: 'Approved', c: 'var(--sc-ok)', w: 'var(--sc-ok-wash)' },
  { id: 'IN-000776', t: 'Mechanical inspection', s: 'Complete', c: 'var(--sc-ok)', w: 'var(--sc-ok-wash)' },
  { id: '26-000131', t: 'Tall weeds and grass', s: 'In review', c: 'var(--sc-crit)', w: 'var(--sc-crit-wash)' },
  { id: '24-002854', t: 'ROW tree trimming', s: 'On hold', c: 'var(--sc-ink-3)', w: 'var(--sc-quiet-wash)' },
  { id: 'IN-000635', t: 'New residential review', s: 'Active', c: 'var(--sc-info)', w: 'var(--sc-info-wash)' },
];
const recRow = (r) =>
'            <div style="display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:var(--sc-2); align-items:center; padding:7px var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">' +
'<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); white-space:nowrap;">' + r.id + '</span>' +
'<span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + r.t + '</span>' +
'<span style="font:500 12px/16px var(--sc-font-ui); color:' + r.c + '; background:' + r.w + '; border-radius:var(--sc-r-full); padding:1px 7px; white-space:nowrap;">' + r.s + '</span></div>';

const recordsPanel = (o) =>
'        <section style="' + o.box + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; display:flex; flex-direction:column; min-width:0;">\n' +
panelHead('On this parcel', '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">6 records</span>') + '\n' +
'          <div style="flex:1; min-height:0; overflow:hidden;">\n' + REC.slice(0, o.n).map(recRow).join('\n') + '\n          </div>\n        </section>';

// full-width permit row for FULL view
const permitStrip = () =>
'        <section style="flex:none; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden;">\n' +
panelHead('On this parcel', '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">6 records · mygov, read live</span>') + '\n' +
'          <div style="display:grid; grid-template-columns:104px 190px minmax(0,1fr) 130px 112px 82px; gap:var(--sc-3); padding:6px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">' +
['Id','Type','Subject','Department','Status','Date'].map((h) => '<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('') + '</div>\n' +
[['26-000317','Residential Addition','Rear addition, 480 sq ft','Development services','Info required','var(--sc-warn)','var(--sc-warn-wash)','09/02/26'],
 ['26-000290','Mechanical Attachment','HVAC replacement','Development services','Approved','var(--sc-ok)','var(--sc-ok-wash)','08/12/26'],
 ['IN-000776','Inspection','Mechanical, residential','Development services','Complete','var(--sc-ok)','var(--sc-ok-wash)','08/14/26'],
 ['26-000131','Code case','Tall weeds and grass','Code enforcement','In review','var(--sc-crit)','var(--sc-crit-wash)','09/05/26'],
 ['24-002854','Work order','ROW tree trimming','Streets & Drainage','On hold','var(--sc-ink-3)','var(--sc-quiet-wash)','09/02/26']]
 .map((r) => '          <div style="display:grid; grid-template-columns:104px 190px minmax(0,1fr) 130px 112px 82px; gap:var(--sc-3); padding:8px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">' +
   '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-accent);">' + r[0] + '</span>' +
   '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r[1] + '</span>' +
   '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r[2] + '</span>' +
   '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r[3] + '</span>' +
   '<span style="justify-self:start; font:500 12px/16px var(--sc-font-ui); color:' + r[5] + '; background:' + r[6] + '; border-radius:var(--sc-r-full); padding:1px 8px;">' + r[4] + '</span>' +
   '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + r[7] + '</span></div>').join('\n') + '\n        </section>';

// layers sidebar — FULL ONLY
const CATS = [
  { n: 'Public safety / emergency', c: '0/14', items: ['Fire stations','Critical facilities','Emergency service districts','FEMA flood zones (SFHA)','Fire districts','Low water crossings','Live stream gauges'] },
  { n: 'Water supply infrastructure', c: '0/4', items: ['Fire hydrants','System valves','Water wells','Storage tanks'] },
  { n: 'Infrastructure / utilities', c: '0/10', items: ['Water mains','Wastewater lines','Storm drainage','CIP projects','Street lights'] },
];
const layersSidebar = () =>
'        <aside style="width:250px; flex:none; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; display:flex; flex-direction:column;">\n' +
panelHead('Map layers', '<span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-accent);">4 active</span>') + '\n' +
'          <div style="padding:var(--sc-2) var(--sc-3); border-bottom:1px solid var(--sc-line-faint); flex:none;"><div style="height:26px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); display:flex; align-items:center; padding:0 var(--sc-2); font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">Search 52 layers</div></div>\n' +
'          <div style="flex:1; min-height:0; overflow:hidden;">\n' +
CATS.map((cat) =>
'            <div>\n' +
'              <div style="display:flex; align-items:center; gap:6px; padding:5px var(--sc-3); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line-faint);">' +
'<span style="color:var(--sc-ink-3); display:flex;">' + CHEV + '</span>' +
'<span style="flex:1; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + cat.n + '</span>' +
'<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + cat.c + '</span></div>\n' +
cat.items.map((i) => '              <div style="display:flex; align-items:center; gap:7px; padding:4px var(--sc-3) 4px 26px;">' +
'<span style="width:11px; height:11px; border:1px solid var(--sc-line-strong); border-radius:2px;"></span>' +
'<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + i + '</span></div>').join('\n') + '\n            </div>').join('\n') + '\n          </div>\n        </aside>';

function page(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:' + o.w + 'px; height:' + o.h + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar() + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav() + '\n' +
'    <main style="flex:1; min-width:0; display:flex; gap:var(--sc-4); padding:var(--sc-4) var(--sc-5); overflow:hidden;">\n' + o.body + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"dark"},"$preview":{"width":' + o.w + ',"height":' + o.h + '}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "dark") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const midColumn = (label) =>
'      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3); overflow:hidden;">\n' +
'        <div><div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX / Development services</div>' +
'<h1 style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.02em; margin:2px 0 0; color:var(--sc-ink);">Development services</h1></div>\n' +
tabs() + '\n' +
'        <div style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); display:flex; align-items:center; justify-content:center;">' +
'<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">' + label + '</span></div>\n      </div>';

// ============ 1. DOCK — everything stacked in the rail ============
const dock = page({ w: 1500, h: 940, body:
  midColumn('Pipeline table — 709 active') + '\n' +
'      <aside style="width:360px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
mapCanvas({ box: 'height:300px; flex:none; border-radius:var(--sc-r);', border: 'border:1px solid var(--sc-line);', h: 300, dock: 'Dock', layersButton: true }) + '\n' +
propertyPanel({ box: 'flex:none;', n: 4 }) + '\n' +
recordsPanel({ box: 'flex:1; min-height:0;', n: 4 }) + '\n      </aside>' });

// ============ 2. EXPAND — map on top, two components below side by side (2/3 · 1/3) ============
const expand = page({ w: 1500, h: 940, body:
'      <div style="width:250px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); overflow:hidden; opacity:.55;">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Development services</div>\n' + tabsVertical() + '\n      </div>\n' +
'      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
mapCanvas({ box: 'flex:1; min-height:0; border-radius:var(--sc-r);', border: 'border:1px solid var(--sc-line);', h: 420, dock: 'Expand', layersButton: true }) + '\n' +
'        <div style="flex:none; height:320px; display:grid; grid-template-columns:2fr 1fr; gap:var(--sc-3);">\n' +
recordsPanel({ box: '', n: 6 }) + '\n' + propertyPanel({ box: '', n: 5 }) + '\n        </div>\n      </div>' });

function tabsVertical() {
  return TABS.map((t, i) => '        <div style="font:' + (i === 0 ? '620' : '400') + ' 13px/19px var(--sc-font-ui); color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-3') + '); padding:4px var(--sc-2); border-radius:var(--sc-r-control); background:' + (i === 0 ? 'var(--sc-surface-2)' : 'transparent') + ';">' + t + '</div>').join('\n');
}

// ============ 3. FULL — permit row below map, property details right, layers sidebar ============
const full = page({ w: 1500, h: 940, body:
'      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
mapCanvas({ box: 'flex:1; min-height:0; border-radius:var(--sc-r);', border: 'border:1px solid var(--sc-line);', h: 430, dock: 'Full', layersButton: false }) + '\n' +
permitStrip() + '\n      </div>\n' +
propertyPanel({ box: 'width:320px; flex:none;', n: 5 }) + '\n' + layersSidebar() });

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), dock);
fs.writeFileSync(new URL('./Expand.dc.html', import.meta.url), expand);
fs.writeFileSync(new URL('./Full.dc.html', import.meta.url), full);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1500, h: 940, title: '1 · Dock — stacked in the rail' },
    { file: 'Expand.dc.html', x: 1620, y: 0, w: 1500, h: 940, title: '2 · Expand — map over 2/3 · 1/3' },
    { file: 'Full.dc.html', x: 3240, y: 0, w: 1500, h: 940, title: '3 · Full — permit row + details + layers' },
  ],
  annotations: [
    { id: 'rule', x: 0, y: -240, w: 700, text: 'THE RULE THAT FIXES THE LAYERS PANEL: the panel exists in FULL ONLY.\nFifty-two layers in a fixed panel cannot work at rail width - today it crushes the map at every size and is an unreadable sliver when docked. Docked and Expand get a Layers BUTTON with the active count; only Full has the room to group 52 layers by their seven categories.' },
    { id: 'dock', x: 760, y: -240, w: 620, text: '1 · DOCK. Map on top, then the two components stacked beneath it in the rail - the Overview pattern. Development services tabs sit between the left sidebar and this rail. The map is CONTEXT while you work the tabs, not a destination, so Place stops being a tab.' },
    { id: 'expand', x: 1620, y: -240, w: 660, text: '2 · EXPAND. Map takes the top. The two components go below it SIDE BY SIDE at roughly two-thirds / one-third: records get the width because they are a list, property details get the narrow column because they are a stack of short facts.' },
    { id: 'full', x: 3240, y: -240, w: 680, text: '3 · FULL. A full-width permit ROW under the map - the same table treatment as every other operational list, so it reads as records rather than as a panel. Right column is the one-click property detail. Layers sidebar appears here and only here.' },
    { id: 'refused', x: 4000, y: -240, w: 560, text: 'Buildable area stays visible and says REFUSED with its basis in every state, per ruling R-2. It is not dropped to save space - a missing row reads as a gap and invites someone to fix a decision.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main.dc.html, Expand.dc.html, Full.dc.html, canvas.json');
