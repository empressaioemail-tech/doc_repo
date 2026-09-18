import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const PLUG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/></svg>';
const PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

// nav badge vocabulary lifted from the live page
const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'EMPTY':        ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW':      ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ':     ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT':    ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t] || BADGE['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
};

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">\n' +
  '            <span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '\n' +
  '          </div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const navBlock = (lenses, footLines) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', lenses.map((l) => navRow(l[0], l[1], l[0] === 'Overview'))) + '\n' +
  navGroup('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + footLines + '</div>\n' +
  '      </nav>';

const topbar = (city, seal) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; gap:var(--sc-2); height:28px; padding:0 var(--sc-3); width:340px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; gap:0; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' · Overview</span>\n' +
'      </div>\n' +
'    </header>';

const tile = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-1); min-width:0; box-shadow:var(--sc-e1);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</div>\n' +
(m.read
  ? '            <div style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(--sc-ink);">' + m.v + '</div>'
  : '            <div style="font:620 15px/32px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>') + '\n' +
'            <div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(' + (m.read ? '--sc-accent' : '--sc-ink-3') + ');">\n' +
'              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.to + '</span>' + (m.read ? ARROW : '') + '\n' +
'            </div>\n          </div>';

const lane = (d) => {
  const rail = d.state === 'live' ? 'var(--sc-ok)' : d.state === 'partial' ? 'var(--sc-warn)' : 'var(--sc-line)';
  const facts = d.facts.length
    ? '              <div style="display:flex; flex-wrap:wrap; gap:var(--sc-1) var(--sc-5);">\n' +
      d.facts.map((f) =>
        '                <div style="display:flex; flex-direction:column; gap:0; min-width:0;">\n' +
        '                  <span style="font:400 17px/23px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + f.v + '</span>\n' +
        '                  <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + f.k + '</span>\n                </div>').join('\n') +
      '\n              </div>\n'
    : '';
  return '          <div style="display:grid; grid-template-columns:3px minmax(0,1fr); gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); min-width:0;">\n' +
    '            <div style="background:' + rail + '; border-radius:var(--sc-r-full);"></div>\n' +
    '            <div style="min-width:0; display:flex; flex-direction:column; gap:6px;">\n' +
    '              <div style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + d.name + '</div>\n' + facts +
    '              <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + d.basis + '</div>\n' +
    '            </div>\n          </div>';
};

const head = (t, sub, right) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:42px; padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); flex-wrap:wrap;">\n' +
'          <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + t + '</div>\n' +
(sub ? '          <div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + sub + '</div>\n' : '') +
'          <div style="flex:1;"></div>' + (right || '') + '\n        </div>';

const rowSrc = (s) => {
  const map = { read: ['var(--sc-ok)', 'var(--sc-ok-wash)', 'Read'], none: ['var(--sc-line)', 'var(--sc-quiet-wash)', 'Not connected'], island: ['var(--sc-warn)', 'var(--sc-warn-wash)', 'On the island'] };
  const [c, w, lbl] = map[s.state];
  const lc = s.state === 'read' ? 'var(--sc-ok)' : s.state === 'island' ? 'var(--sc-warn)' : 'var(--sc-ink-3)';
  return '          <div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
    '            <div style="align-self:stretch; background:' + c + '; border-radius:var(--sc-r-full);"></div>\n' +
    '            <div style="display:flex; flex-direction:column; gap:1px; min-width:0;">\n' +
    '              <b style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + s.n + '</b>\n' +
    '              <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + s.sub + '</span>\n            </div>\n' +
    '            <span style="font:500 12px/16px var(--sc-font-ui); color:' + lc + '; background:' + w + '; border-radius:var(--sc-r-full); padding:2px 8px;">' + lbl + '</span>\n          </div>';
};

// RIGHT RAIL — map kept, "Sources" replaced by "On the map"
const rail = (o) =>
'      <aside style="width:var(--sc-rail, 380px); flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-width:0;">\n' +
'        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
head('The city', '', '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Expand</span>') + '\n' +
'          <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2); display:flex; gap:var(--sc-2);">\n' +
'            <div style="flex:1; height:28px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); display:flex; align-items:center; padding:0 var(--sc-3); font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-3);">Street address</div>\n' +
'            <div style="height:28px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); display:flex; align-items:center; font:500 13px/18px var(--sc-font-ui);">Search</div>\n          </div>\n' +
'          <div style="margin:0 var(--sc-4) var(--sc-4); height:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-map-ground, #E7EBEE); position:relative; overflow:hidden;">\n' +
'            <div style="position:absolute; inset:0; background-image:linear-gradient(var(--sc-line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--sc-line-faint) 1px, transparent 1px); background-size:44px 44px; opacity:.7;"></div>\n' +
'            <div style="position:absolute; left:var(--sc-3); top:var(--sc-3); display:flex; gap:var(--sc-1); font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><span style="background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); padding:2px 7px;">Layers</span><span style="background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); padding:2px 7px;">Zoning</span></div>\n' +
'            <div style="position:absolute; left:50%; top:52%; transform:translate(-50%,-50%); width:120px; height:86px; border:2px solid var(--sc-accent); background:var(--sc-accent-wash); border-radius:3px;"></div>\n' +
'            <div style="position:absolute; right:var(--sc-3); bottom:var(--sc-3); font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); padding:2px 7px;">' + o.mapNote + '</div>\n' +
'          </div>\n        </section>\n' +
'        <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
head('On the map', o.onMapSub, '') + '\n' +
(o.onMap.length
  ? '          <div>\n' + o.onMap.map((r) =>
      '            <div style="display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
      '              <span style="color:var(--sc-ink-3); display:flex;">' + PIN + '</span>\n' +
      '              <div style="display:flex; flex-direction:column; gap:1px; min-width:0;">\n' +
      '                <b style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r.t + '</b>\n' +
      '                <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r.a + '</span>\n              </div>\n' +
      '              <span style="font:500 12px/16px var(--sc-font-ui); color:' + r.c + '; background:' + r.w + '; border-radius:var(--sc-r-full); padding:2px 8px; flex:none;">' + r.s + '</span>\n            </div>').join('\n') + '\n          </div>'
  : '          <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-6) var(--sc-5);">\n' +
    '            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">Nothing located</div>\n' +
    '            <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">No located records on this pack.</h2>\n' +
    '            <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.onMapBasis + '</div>\n          </div>') + '\n' +
'        </section>\n      </aside>';

function artboard(o) {
  const connections =
    '        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    head('Connections', o.srcSub, '<span style="display:inline-flex; align-items:center; gap:5px; font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); background:var(--sc-accent-wash); border-radius:var(--sc-r-full); padding:2px 8px;">' + PLUG + ' ' + o.srcTitle + '</span>') + '\n' +
    (o.leadNote ? '        <div style="padding:var(--sc-4) var(--sc-4) var(--sc-2);"><p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:68ch;">' + o.leadNote + '</p></div>\n' : '') +
    '        <div>\n' + o.sources.map(rowSrc).join('\n') + '\n        </div>\n        </section>';

  const decisions =
    '        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    head('What needs you today', '', '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Decision queue</span>') + '\n' +
    (o.decisions.length
      ? '        <div>\n' + o.decisions.map((d) =>
          '          <div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:11px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
          '            <div style="align-self:stretch; background:' + d.c + '; border-radius:var(--sc-r-full);"></div>\n' +
          '            <div style="display:flex; flex-direction:column; gap:1px; min-width:0;">\n' +
          '              <b style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + d.t + '</b>\n' +
          '              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + d.b + '</span>\n            </div>\n' +
          '            <span style="display:inline-flex; align-items:center; gap:5px; font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent);">' + d.a + ARROW + '</span>\n          </div>').join('\n') + '\n        </div>'
      : '        <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-7) var(--sc-5); max-width:64ch;">\n' +
        '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">No live operations</div>\n' +
        '          <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + o.decEmptyH + '</h2>\n' +
        '          <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.decEmptyP + '</p>\n' +
        '          <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.decEmptyB + '</div>\n        </div>') + '\n        </section>';

  const departments =
    '        <section style="display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
    '          <div style="display:flex; align-items:baseline; gap:var(--sc-2);">\n' +
    '            <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">Across departments</h2>\n' +
    '            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + o.laneNote + '</span>\n          </div>\n' +
    '          <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--sc-3);">\n' + o.lanes.map(lane).join('\n') + '\n          </div>\n        </section>';

  const meetings =
    '        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
    head('Public meetings', o.meetings.length ? o.meetings.length + ' upcoming' : '', o.meetings.length ? '<span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-ok); background:var(--sc-ok-wash); border-radius:var(--sc-r-full); padding:2px 8px;">City clerk calendar · read</span>' : '') + '\n' +
    (o.meetings.length
      ? '        <div>\n' + o.meetings.map((m) =>
          '          <div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
          '            <div style="align-self:stretch; background:var(--sc-line); border-radius:var(--sc-r-full);"></div>\n' +
          '            <div style="display:flex; flex-direction:column; gap:1px; min-width:0;">\n' +
          '              <b style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + m.t + '</b>\n' +
          '              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + m.d + '</span>\n            </div>\n' +
          '            <span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); background:var(--sc-accent-wash); border-radius:var(--sc-r-full); padding:2px 8px;">Agenda</span>\n          </div>').join('\n') + '\n        </div>'
      : '        <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-6) var(--sc-5);">\n' +
        '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">Not read</div>\n' +
        '          <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">No meeting packet has been read.</h2>\n' +
        '          <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.meetingEmpty + '</div>\n        </div>') + '\n        </section>';

  const stack = o.connectionsFirst
    ? [connections, decisions, departments, meetings]
    : [decisions, departments, meetings, connections];

  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1000px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal) + '\n' +
'  <div style="flex:1; display:flex; min-height:0;">\n' + navBlock(o.lenses, o.footLines) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; gap:var(--sc-5);">\n' +
'      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'        <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'          <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Overview</div>\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2);">\n' +
'            <h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Overview</h1>' + badge(o.pageBadge) + '\n          </div>\n' +
'          <p style="margin:0; max-width:72ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Where am I, what needs me, and what is missing. Nothing on this page is a count until a source reads.</p>\n' +
'        </div>\n' +
'        <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:var(--sc-3);">\n' + o.att.map(tile).join('\n') + '\n        </div>\n' +
stack.join('\n') + '\n' +
'      </div>\n' + rail(o) + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"},"$preview":{"width":1600,"height":1000}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const LIVE_LENSES = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'EMPTY'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];
const EMPTY_LENSES = [
  ['Overview', 'EMPTY'], ['Development services', 'NOT READ'], ['Finance', 'NOT READ'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'NOT READ'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'NOT READ'],
];

const populated = artboard({
  theme: 'dark', city: 'Bastrop, TX', seal: 'BT', pageBadge: 'LIVE RECORDS',
  lenses: LIVE_LENSES,
  footLines: '7 of 10 sources granted<br>4 of 10 reading records<br>bastrop_tx',
  att: [
    { k: 'Needs a decision', v: '6', read: true, to: 'Decision queue' },
    { k: 'Overdue reviews', v: '3', read: true, to: 'Plan review · Overdue' },
    { k: 'Permits in flight', v: '586', read: true, to: 'Development services · Active' },
    { k: 'Meetings this week', v: '2', read: true, to: 'Public meetings' },
  ],
  decisions: [
    { t: 'Plan review overdue past 10 days', b: 'plan-review · 3 cases · oldest 14 days', a: 'Review', c: 'var(--sc-crit)' },
    { t: 'Permits expiring inside 30 days', b: 'mygov · 18 permits', a: 'Open', c: 'var(--sc-warn)' },
    { t: 'Work orders past due', b: 'mygov · 67 open past due date', a: 'Open', c: 'var(--sc-warn)' },
  ],
  decEmptyH: '', decEmptyP: '', decEmptyB: '',
  laneNote: '3 of 6 reading',
  lanes: [
    { name: 'Development services', state: 'live', facts: [{ v: '586', k: 'permits' }, { v: '709', k: 'projects' }, { v: '73', k: 'open WOs' }], basis: 'mygov · read live for this request' },
    { name: 'Police', state: 'live', facts: [{ v: '12', k: 'units' }], basis: 'spireon · read live for this request' },
    { name: 'Fleet', state: 'live', facts: [{ v: '336', k: 'assets' }, { v: '232', k: 'drivers' }], basis: 'samsara · read live for this request' },
    { name: 'Finance', state: 'none', facts: [], basis: 'opengov granted, no records read' },
    { name: 'Fire and EMS', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Public works', state: 'none', facts: [], basis: 'no source connected' },
  ],
  meetings: [
    { t: 'Zoning Board of Adjustments', d: 'Sep 10 · 6:00 PM' },
    { t: 'Public Library Board', d: 'Sep 14 · 6:00 PM' },
    { t: 'Special City Council Meeting', d: 'Sep 15 · 6:00 PM' },
    { t: 'Regular City Council Meeting', d: 'Sep 22 · 6:30 PM' },
  ],
  meetingEmpty: '',
  srcTitle: '7 of 10', srcSub: 'what this city reads',
  sources: [
    { n: 'MyGov', sub: 'permits, work orders, inspections', state: 'read' },
    { n: 'Samsara', sub: 'fleet telematics', state: 'read' },
    { n: 'City clerk calendar', sub: 'agendas and meeting packets', state: 'read' },
    { n: 'OpenGov', sub: 'granted, no records read yet', state: 'none' },
    { n: 'PermitFlow', sub: 'staff still work here', state: 'island' },
  ],
  connectionsFirst: false, leadNote: '',
  mapNote: 'Bastrop city limits',
  onMapSub: '9 located this week',
  onMapBasis: '',
  onMap: [
    { t: 'New commercial shell', a: '1401 CHESTNUT ST', s: 'Permit', c: 'var(--sc-info)', w: 'var(--sc-info-wash)' },
    { t: 'Residential addition', a: '908 PINE ST', s: 'Review', c: 'var(--sc-warn)', w: 'var(--sc-warn-wash)' },
    { t: 'ROW tree trimming', a: '1109 PECAN ST', s: 'Work order', c: 'var(--sc-quiet)', w: 'var(--sc-quiet-wash)' },
    { t: 'Sign permit', a: '302 MAIN ST', s: 'Permit', c: 'var(--sc-info)', w: 'var(--sc-info-wash)' },
    { t: 'Code case, tall grass', a: '77 FARM ST', s: 'Enforcement', c: 'var(--sc-crit)', w: 'var(--sc-crit-wash)' },
  ],
});

const sparse = artboard({
  theme: 'dark', city: 'Elgin, TX', seal: 'EL', pageBadge: 'NOT READ',
  lenses: [['Overview', 'NOT READ'], ['Development services', 'LIVE RECORDS'], ['Finance', 'NOT READ'], ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'], ['Police', 'NOT READ'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'NOT READ']],
  footLines: '1 of 10 sources granted<br>1 of 10 reading records<br>elgin_tx',
  att: [
    { k: 'Needs a decision', v: '', read: false, to: 'No operations source' },
    { k: 'Overdue reviews', v: '', read: false, to: 'Review mount is preview' },
    { k: 'Permits in flight', v: '148', read: true, to: 'Development services · Active' },
    { k: 'Meetings this week', v: '', read: false, to: 'No clerk source' },
  ],
  decisions: [], decEmptyH: 'No decisions are waiting on elgin_tx.',
  decEmptyP: 'This queue lists items needing a call across connected departments. One department reads here, so there is little to cross.',
  decEmptyB: 'Basis: 1 of 10 adapter kinds granted on cityKey elgin_tx.',
  laneNote: '1 of 6 reading',
  lanes: [
    { name: 'Development services', state: 'partial', facts: [{ v: '148', k: 'permits' }], basis: 'mygov · permits granted, work orders not granted' },
    { name: 'Finance', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Police', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Fire and EMS', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Fleet', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Public works', state: 'none', facts: [], basis: 'no source connected' },
  ],
  meetings: [], meetingEmpty: 'no clerk calendar grant on elgin_tx',
  srcTitle: '1 of 10', srcSub: 'connect a source to fill a lens',
  sources: [
    { n: 'MyGov', sub: 'permits granted · work orders not granted', state: 'read' },
    { n: 'City clerk calendar', sub: 'would fill Public meetings', state: 'none' },
    { n: 'OpenGov', sub: 'would fill Finance', state: 'none' },
    { n: 'Samsara', sub: 'would fill Fleet', state: 'none' },
  ],
  connectionsFirst: false,
  leadNote: 'This city reads one source, so the queue comes first and Connections sits last. Every quiet panel here names the source that would fill it.',
  mapNote: 'Elgin city limits', onMapSub: '2 located this week', onMapBasis: '',
  onMap: [
    { t: 'Residential remodel', a: '204 N MAIN ST', s: 'Permit', c: 'var(--sc-info)', w: 'var(--sc-info-wash)' },
    { t: 'Fence permit', a: '11 DEPOT ST', s: 'Permit', c: 'var(--sc-info)', w: 'var(--sc-info-wash)' },
  ],
});

const empty = artboard({
  theme: 'dark', city: 'This city', seal: 'EC', pageBadge: 'EMPTY',
  lenses: EMPTY_LENSES,
  footLines: '0 of 10 sources granted<br>this pack generates no records',
  att: [
    { k: 'Needs a decision', v: '', read: false, to: 'No operations source' },
    { k: 'Overdue reviews', v: '', read: false, to: 'Review mount is preview' },
    { k: 'Permits in flight', v: '', read: false, to: 'No permit source' },
    { k: 'Meetings this week', v: '', read: false, to: 'No clerk source' },
  ],
  decisions: [], decEmptyH: 'No decisions are waiting on this pack.',
  decEmptyP: 'This queue would list items that need a call across connected departments. No operations feed is granted, so there is nothing to resolve here.',
  decEmptyB: 'Basis: no operations grant on this pack.',
  laneNote: 'none reading',
  lanes: [
    { name: 'Development services', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Finance', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Police', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Fire and EMS', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Fleet', state: 'none', facts: [], basis: 'no source connected' },
    { name: 'Public works', state: 'none', facts: [], basis: 'no source connected' },
  ],
  meetings: [], meetingEmpty: 'no clerk calendar grant on this pack',
  srcTitle: '0 of 10', srcSub: 'nothing is connected yet',
  sources: [
    { n: 'MyGov', sub: 'permits, work orders, inspections', state: 'none' },
    { n: 'City clerk calendar', sub: 'agendas and meeting packets', state: 'none' },
    { n: 'OpenGov', sub: 'budget, accounts, line items', state: 'none' },
    { n: 'Esri / ArcGIS', sub: 'parcels and overlays', state: 'none' },
    { n: 'Samsara', sub: 'fleet telematics', state: 'none' },
  ],
  connectionsFirst: true,
  leadNote: 'This page is quiet because no source has been read. Connecting a source fills the lens it feeds. Nothing here shows a zero until a city has claimed one.',
  mapNote: 'No boundary on file', onMapSub: '',
  onMapBasis: 'Basis: no located records on this pack. The map draws the city boundary when one is on file.',
  onMap: [],
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), populated);
fs.writeFileSync(new URL('./Sparse.dc.html', import.meta.url), sparse);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), empty);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1000, title: 'Populated — Bastrop' },
    { file: 'Sparse.dc.html', x: 1720, y: 0, w: 1600, h: 1000, title: 'Sparse — newly onboarded' },
    { file: 'Empty.dc.html', x: 3440, y: 0, w: 1600, h: 1000, title: 'Empty — empty pack' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -230, w: 600, text: 'Overview lens, three data states.\nLayout, hierarchy and density only. Palette and type ramp are the frozen sc-kit and do not change.\nDrawn against the live Bastrop page, not the August map.' },
    { id: 'move', x: 680, y: -230, w: 700, text: 'Structural move: Connections DEMOTES to the bottom when the city reads sources and PROMOTES to the top when it does not.\nZero reads as "here is what to connect next" rather than as a broken page.' },
    { id: 'rail', x: 1720, y: -230, w: 700, text: 'Right rail keeps the map and the address lookup. The old Sources panel is replaced by ON THE MAP - located records you can click, instead of the atom-type list that leaked engine vocabulary to a city manager.' },
    { id: 'tiles', x: 2460, y: -230, w: 560, text: 'Tiles are filtered entry points. Each names the lens and filter it opens.\nAn unread tile says "Not read", never 0.' },
    { id: 'mappin', x: 3440, y: -230, w: 640, text: 'PINNED, not designed here: the Overview map itself. It renders broken on the live page and needs its own pass after Development services.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('regenerated 3 artboards + canvas.json');
