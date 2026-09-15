import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/* SmartCity Development services -- Flood study.
   Tokens copied from the frozen sc-kit, never invented.

   Drawn against the engine: hauska-map/apps/property-explorer
   api/_lib/pe-flood-drainage-core.ts, src/workbench/tools/FloodTool.tsx,
   src/workbench/tools/flood-viz.ts. Authority split from
   _decisions/2026-09-14_flood_determination_authority.md.

   WHAT THE SOURCE SUPPORTS, and therefore what is asserted here:
     - rainfallDepthInches, a bare DEPTH in (0, 60]. No storm duration exists in the
       contract and no depth-to-return-period mapping exists anywhere in the source,
       so neither is named on any artboard.
     - study returns parcelRing, catchment(+bbox), drainage zones, ponding, flow lines,
       flow exits, a gradient note, a briefing, and an optional artifact.
     - zone "grade" is ORDINAL position in the served feature list, not a measured
       concentration, so no artboard states a concentration value.
     - three distinct empties: honestEmpty (engine reason, rendered verbatim),
       zero-ponding (a result), and no geometry (a capability gap).
     - failure classes: engine_timeout, engine_unreachable, engine_gate_config,
       401 auth, 402 payment, 422 honest refusal.
   No figure on any artboard is measured. */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ALERT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>';
const SHIELD = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>';
const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const SPIN = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>';
const NOCITE = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></svg>';

const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'FIXTURE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'MODELED': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'REGULATORY': ['var(--sc-ink-2)', 'var(--sc-quiet-wash)'],
  'NOT A DETERMINATION': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'PROVISIONAL FOR CITATION': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'RUNNING': ['var(--sc-info)', 'var(--sc-info-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t] || BADGE['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
};

/* Nav badges are a property of the PACK, not a constant: a pack with nothing granted
   cannot show four lenses reading LIVE RECORDS. */
const LENSES_LIVE = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'EMPTY'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];
const LENSES_UNGRANTED = LENSES_LIVE.map(([n]) => [n, n === 'Parks' ? 'NOT BUILT' : 'NOT READ']);

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
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Development services</span>\n      </div>\n    </header>';

const DS_TABS = (active) => {
  const T = [['Pipeline', '304'], ['Inspections', '2078'], ['Work orders', '159'], ['Code enforcement', '1505'], ['Licenses', '72'], ['Plan review', ''], ['Flood study', '']];
  return '        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
    T.map(([n, c]) => {
      const on = n === active;
      return '          <div style="display:flex; align-items:center; gap:6px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
        '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + n + '</span>' +
        (c ? '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + c + '</span>' : '') + '</div>';
    }).join('\n') + '\n        </div>';
};

/* ---------- THE DEPTH CONTROL. Depth only: the contract has no duration and no
     return period, so neither is named. Multi-select on the compare artboard. ---------- */
const depthControl = (o) =>
'        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-3) var(--sc-4); display:flex; align-items:center; gap:var(--sc-5);">\n' +
'          <div style="flex:none; display:flex; flex-direction:column; gap:1px;">\n' +
'            <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">Rainfall depth</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + (o.mode || 'the depth the model runs at') + '</span>\n          </div>\n' +
'          <div style="display:flex; gap:2px; padding:2px; background:var(--sc-surface-2); border:1px solid var(--sc-line); border-radius:var(--sc-r-control);">\n' +
o.presets.map((p) =>
'            <span style="display:flex; align-items:center; padding:5px 15px; border-radius:3px; background:' + (p.on ? 'var(--sc-surface)' : 'transparent') + '; box-shadow:' + (p.on ? 'var(--sc-e1)' : 'none') + ';">' +
'<span style="font:' + (p.on ? '600' : '400') + ' 14px/19px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (p.on ? '--sc-ink' : '--sc-ink-2') + ');">' + p.v + '</span></span>').join('\n') + '\n          </div>\n' +
'          <div style="flex:1; min-width:0; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.basis + '</div>\n' +
(o.right || '') + '\n        </section>';

const DEPTHS = (on) => [2, 4, 7, 10].map((d) => ({ v: d + '&Prime;', on: on.includes(d) }));

/* ---------- THE STRUCTURAL MOVE: two determinations, kept apart ---------- */
const determination = (d) =>
'            <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-4); border:1px solid var(--sc-line); border-left:3px solid var(' + d.tone + '); border-radius:var(--sc-r); background:var(--sc-surface);">\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
'                <span style="color:var(' + d.tone + '); display:grid; place-items:center;">' + d.icon + '</span>\n' +
'                <span style="flex:1; min-width:120px; font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + d.k + '</span>' + d.tags.map(badge).join('') + '\n              </div>\n' +
'              <div style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.018em; color:var(--sc-ink);">' + d.v + '</div>\n' +
'              <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + d.sub + '</div>\n' +
(d.action || '') +
'              <div style="margin-top:auto; padding-top:var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-top:1px solid var(--sc-line-faint);">' + d.basis + '</div>\n            </div>';

/* a control that is REFUSED, with the reason on it -- not a sentence in a footnote */
const refusedAction = (label, reason) =>
'              <div style="display:flex; flex-direction:column; gap:5px; padding-top:var(--sc-1);">\n' +
'                <span style="align-self:flex-start; display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 var(--sc-3); border-radius:var(--sc-r-control); border:1px dashed var(--sc-line-strong); background:var(--sc-surface-2); color:var(--sc-ink-3); font:500 13px/18px var(--sc-font-ui);">' + NOCITE + '<span>' + label + '</span></span>\n' +
'                <span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-warn);">' + reason + '</span>\n              </div>';

const cell = (c) => {
  if (c && typeof c === 'object') {
    if (c.chip) return '<span style="justify-self:start; font:500 12px/16px var(--sc-font-data); letter-spacing:.04em; color:var(' + c.tone + '); background:var(' + c.wash + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + c.chip + '</span>';
    if (c.bar) return '<span style="display:flex; align-items:center; gap:var(--sc-2); min-width:0;"><span style="flex:1; height:6px; border-radius:var(--sc-r-full); background:var(--sc-surface-3); overflow:hidden;"><span style="display:block; width:' + c.pct + '%; height:100%; background:var(' + c.tone + ');"></span></span><span style="flex:none; font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-2); width:52px; text-align:right;">' + c.bar + '</span></span>';
    return '<span style="font:400 13px/18px var(' + (c.mono ? '--sc-font-data' : '--sc-font-ui') + '); font-variant-numeric:tabular-nums; color:var(' + (c.tone || '--sc-ink') + '); ' + (c.right ? 'text-align:right;' : '') + ' overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + c.t + '</span>';
  }
  return '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + c + '</span>';
};

const table = (o) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3); ' + (h.right ? 'text-align:right;' : '') + '">' + (h.t || h) + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:0 var(--sc-4); align-items:center; min-height:var(--sc-row); padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
r.map((c) => '              ' + cell(c)).join('\n') + '\n            </div>').join('\n');

const panel = (o) =>
'        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;' + (o.grow ? ' flex:1; min-height:0;' : '') + '">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
'            <div style="flex:1;"></div>\n' + (o.right || '') + '\n          </div>\n' + o.body + '\n        </section>';

const stateBlock = (o) =>
'            <div style="display:flex; align-items:flex-start; gap:var(--sc-4); padding:var(--sc-4) var(--sc-5); ' + (o.divider ? 'border-bottom:1px solid var(--sc-line-faint);' : '') + '">\n' +
'              <span style="flex:none; color:var(' + o.tone + '); display:grid; place-items:center; padding-top:2px;">' + o.icon + '</span>\n' +
'              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
'                <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.k + '</span></div>\n' +
'                <div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">' + o.h + '</div>\n' +
'                <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:104ch;">' + o.p + '</div>\n' +
'                <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.b + '</div>\n              </div>\n            </div>';

/* ---------- the drainage model.
     Ponding is sized to the stated share of the parcel ring (shoelace area 8,128 px2),
     so the picture and the number cannot disagree. Exits are DIAMONDS with a bearing,
     which is what the engine supplies and what the source draws. ---------- */
const RING_AREA = 8128;
const pondRadii = (share) => {
  const target = RING_AREA * share;          // px2 of ponding to draw
  const rx = Math.round(Math.sqrt((target / Math.PI) * 1.65));
  const ry = Math.round((target / Math.PI) / rx);
  return { rx, ry };
};

const exitMark = (x, y, deg) =>
  '<g transform="translate(' + x + ' ' + y + ') rotate(' + deg + ')">' +
  '<rect x="-5.5" y="-5.5" width="11" height="11" fill="var(--sc-surface)" stroke="var(--sc-crit)" stroke-width="2.2" transform="rotate(45)"/>' +
  '<path d="M8 0 L17 0 M13 -4 L17 0 L13 4" fill="none" stroke="var(--sc-crit)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>';

const MODEL_SVG = (o) => {
  const p = o.share ? pondRadii(o.share) : null;
  return '<svg viewBox="0 0 520 400" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Modeled catchment, drainage zones, ponding and flow" style="display:block;">' +
  '<rect width="520" height="400" fill="var(--sc-surface-2)"/>' +
  /* FEMA reference layer -- the source draws it on this same picture, muted */
  (o.fema !== false ? '<path d="M8 300 C120 268, 210 300, 300 344 L360 400 L8 400 Z" fill="var(--sc-ink-3)" fill-opacity=".1" stroke="var(--sc-ink-3)" stroke-width="1.2" stroke-opacity=".45"/>' : '') +
  /* drainage zones, ordinal grade low -> high */
  '<path d="M60 40 L300 26 L430 96 L470 240 L360 356 L150 372 L44 250 Z" fill="var(--sc-accent)" fill-opacity=".06"/>' +
  '<path d="M120 110 L320 96 L392 190 L330 300 L170 312 L106 216 Z" fill="var(--sc-accent)" fill-opacity=".12"/>' +
  '<path d="M182 168 L300 158 L330 226 L268 280 L196 268 L166 216 Z" fill="var(--sc-accent)" fill-opacity=".2"/>' +
  /* catchment boundary */
  '<path d="M60 40 L300 26 L430 96 L470 240 L360 356 L150 372 L44 250 Z" fill="none" stroke="var(--sc-ink-3)" stroke-width="1.6" stroke-dasharray="7 5"/>' +
  /* EXACTLY three flow paths, matching the stated count */
  '<path d="M96 70 C160 140, 200 190, 244 228 C268 282, 300 318, 338 342" fill="none" stroke="var(--sc-info)" stroke-width="2.2"/>' +
  '<path d="M330 54 C312 130, 282 176, 246 222" fill="none" stroke="var(--sc-info)" stroke-width="1.8" opacity=".85"/>' +
  '<path d="M420 128 C372 168, 310 202, 252 226" fill="none" stroke="var(--sc-info)" stroke-width="1.8" opacity=".85"/>' +
  /* modeled ponding, area-true to the stated share */
  (p ? '<ellipse cx="247" cy="220" rx="' + p.rx + '" ry="' + p.ry + '" fill="var(--sc-info)" fill-opacity=".42" stroke="var(--sc-info)" stroke-width="1.4"/>' : '') +
  /* parcel ring */
  '<path d="M196 178 L292 170 L300 254 L204 262 Z" fill="none" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
  /* exits, with bearing */
  exitMark(338, 342, 38) +
  (o.exits > 1 ? exitMark(196, 300, 208) : '') +
  '</svg>';
};

/* legend: the nine source entries, in source order, with the source's own wording.
   Ponding is CONDITIONAL, exactly as FloodTool renders it -- a legend entry with
   nothing on the map reads as a broken render. Two columns, wrapping: four columns
   in a 400px rail ellipsized six of nine labels and made the three graded bands
   indistinguishable. */
const legend = (hasPonding) =>
'            <div style="display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:var(--sc-2) var(--sc-4); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint);">\n' +
[
  ['border:2px solid var(--sc-ink); background:transparent;', 'Parcel'],
  ['background:var(--sc-ink-3); opacity:.28; border:1px solid var(--sc-ink-3);', 'FEMA flood zone (reference)'],
  ['background:var(--sc-accent); opacity:.14;', 'Zone &mdash; low concentration'],
  ['background:var(--sc-accent); opacity:.3;', 'Zone &mdash; medium concentration'],
  ['background:var(--sc-accent); opacity:.5;', 'Zone &mdash; high concentration'],
].concat(hasPonding ? [['background:var(--sc-info); opacity:.45; border:1px solid var(--sc-info);', 'Ponding &mdash; standing water']] : []).concat([
  ['border-top:2px dashed var(--sc-ink-3); height:2px; border-radius:0;', 'Catchment boundary'],
  ['background:var(--sc-info); height:2px;', 'Flow path'],
  ['background:var(--sc-crit); width:9px; height:9px; transform:rotate(45deg);', 'Exit point'],
]).map(([sw, label]) =>
'              <div style="display:flex; align-items:flex-start; gap:7px; min-width:0;"><span style="flex:none; width:14px; height:10px; margin-top:3px; border-radius:2px; ' + sw + '"></span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2); overflow-wrap:break-word;">' + label + '</span></div>').join('\n') +
'\n            </div>';

const rail = (o) =>
'      <aside style="width:400px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); overflow:hidden;">\n' +
'        <div style="flex:none; display:flex; align-items:center; gap:var(--sc-2);">\n' +
'          <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3);">Drainage model</span>\n' +
'          <div style="flex:1;"></div>\n' +
'          <div style="display:flex; gap:2px; padding:2px; background:var(--sc-surface-2); border:1px solid var(--sc-line); border-radius:var(--sc-r-control);">' +
['Dock', 'Expand', 'Full'].map((m) => '<span style="font:500 12px/16px var(--sc-font-ui); padding:2px 9px; border-radius:3px; color:var(' + (m === o.dock ? '--sc-ink' : '--sc-ink-3') + '); background:' + (m === o.dock ? 'var(--sc-surface)' : 'transparent') + ';">' + m + '</span>').join('') +
'</div>\n        </div>\n' +
'        <div style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
'          <div style="flex:1; min-height:0; position:relative;">' + o.model + '</div>\n' + legend(o.hasPonding !== false) + '\n' +
'          <div style="padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">' + o.basis + '</div>\n' +
'        </div>\n      </aside>';

const shell = (o) =>
  '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
  '<div class="{{themeClass}}" style="width:1600px; height:' + (o.h || 1040) + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
  topbar(o.city, o.seal) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.lenses || LENSES_LIVE, o.foot) + '\n' +
  '    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; gap:var(--sc-5); min-height:0;">\n' +
  '      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
  '        <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
  '          <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Development services / ' + o.crumb + '</div>\n' +
  '          <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + o.pageBadges.map(badge).join('') + '</div>\n' +
  '          <p style="margin:0; max-width:88ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.sub + '</p>\n        </div>\n' +
  o.body + '\n      </div>\n' + (o.rail || '') + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
  '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"}}\'>\n' +
  'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';

const OK = '--sc-ok', CRIT = '--sc-crit', WARN = '--sc-warn', INFO = '--sc-info', Q = '--sc-ink-3';
const M = (t, tone) => ({ t, mono: true, tone });
const R = (t, tone) => ({ t, mono: true, right: true, tone });
const chip = (t, tone, wash) => ({ chip: t, tone, wash });
const FOOT = '7 of 10 sources granted<br>parcel-record flood rail &middot; live';

/* =======================  1. MAIN — the screening list  ======================= */
const screenRows = [
  ['B-26-0418', '908 PINE ST', M('48021:34137'), chip('X', Q, '--sc-quiet-wash'), { bar: '0.41 ac', pct: 86, tone: CRIT }, R('1'), M('11 Sep')],
  ['B-26-0402', '1922 CRISTOBAL ST E', M('48021:31880'), chip('X', Q, '--sc-quiet-wash'), { bar: '0.28 ac', pct: 62, tone: CRIT }, R('2'), M('11 Sep')],
  ['B-26-0391', '119 PASQUALE DR', M('48021:29455'), chip('AE', INFO, '--sc-info-wash'), { bar: '0.22 ac', pct: 48, tone: WARN }, R('1'), M('10 Sep')],
  ['B-26-0377', '1209 FM 969', M('48021:41002'), chip('X', Q, '--sc-quiet-wash'), { bar: '0.14 ac', pct: 31, tone: WARN }, R('2'), M('10 Sep')],
  ['B-26-0362', '705 MAIN ST', M('48021:30114'), chip('X', Q, '--sc-quiet-wash'), { bar: '0.06 ac', pct: 14, tone: Q }, R('1'), M('09 Sep')],
  ['B-26-0344', '1723 COOPER CT', M('48021:33207'), chip('AE', INFO, '--sc-info-wash'), { t: 'none modeled', mono: true, tone: Q }, R('0'), M('09 Sep')],
  ['B-26-0339', '203 MOSSBERG LN', M('48021:35521'), chip('X', Q, '--sc-quiet-wash'), { t: 'none modeled', mono: true, tone: Q }, R('0'), M('08 Sep')],
];

const main = shell({
  theme: 'light', city: 'Bastrop, TX', seal: 'BT', crumb: 'Flood study',
  h1: 'Flood &amp; drainage screening', pageBadges: ['FIXTURE'], foot: FOOT, h: 1200,
  sub: 'Which permits in flight sit on parcels that model badly when it rains. Screening, not determination: the regulatory zone is a separate answer and is shown beside the model, never blended into it.',
  body:
    depthControl({
      presets: DEPTHS([4]),
      basis: 'Engine accepts any depth in (0, 60]. Presets are shortcuts. A depth is a depth: the model takes no storm duration, and naming these by return period would need a local rainfall atlas nobody has cited yet.',
      right: '          <span style="flex:none; display:inline-flex; align-items:center; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); font:500 13px/18px var(--sc-font-ui);">Re-run 7 parcels</span>',
    }) + '\n' +
    '        <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:var(--sc-3);">\n' +
    [
      { k: 'Permits screened', v: '112', d: 'of 304 in flight', tone: '--sc-ink' },
      { k: 'Model ponding', v: '31', d: 'at 4&Prime; rainfall', tone: CRIT },
      { k: 'Ponding, outside the FEMA zone', v: '24', d: 'the case the zone does not catch', tone: WARN },
      { k: 'Not yet screened', v: '192', d: 'no study run on this parcel', tone: Q },
    ].map((x) =>
      '          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:1px;">\n' +
      '            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + x.k + '</div>\n' +
      '            <div style="font:400 25px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.014em; color:var(' + x.tone + ');">' + x.v + '</div>\n' +
      '            <div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + x.d + '</div>\n          </div>').join('\n') + '\n        </div>\n' +
    DS_TABS('Flood study') + '\n' +
    panel({
      grow: true, title: 'Screened permits', sub: '112 screened &middot; 31 model ponding &middot; ranked by modeled ponded area',
      right: '<span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); padding:0 var(--sc-2);">Export list</span>',
      body: table({
        cols: '116px minmax(0,1.5fr) 132px 68px minmax(0,1.25fr) 62px 84px',
        head: ['Permit', 'Address', 'Parcel', 'Zone', { t: 'Modeled ponding at 4&Prime;' }, { t: 'Exits', right: true }, 'Study run'],
        rows: screenRows,
      }) +
      '\n            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); max-width:124ch;">Zone is the regulatory FEMA determination. Modeled ponding is the drainage study. A parcel can read X and still model ponding, which is the row this screen exists to surface; it is not a contradiction and must never be shown as one. A parcel that models nothing is a result and stays in the list.</div>',
    }),
});

/* =======================  2. PARCEL — the study  ======================= */
const parcel = shell({
  theme: 'light', city: 'Bastrop, TX', seal: 'BT', crumb: 'Flood study / 908 PINE ST',
  h1: '908 PINE ST', pageBadges: ['FIXTURE'], foot: FOOT, h: 1240,
  sub: 'Parcel 48021:34137 &middot; permit B-26-0418 &middot; drainage modeled at 4 inches of rainfall.',
  body:
    '        <div style="display:flex; gap:var(--sc-3); align-items:stretch;">\n' +
    determination({
      k: 'Regulatory flood zone', v: 'Zone X', tags: ['REGULATORY', 'PROVISIONAL FOR CITATION'], tone: '--sc-ink-2', icon: SHIELD,
      sub: 'Outside the Special Flood Hazard Area, from the authoritative flood rail.',
      action: refusedAction('Cite in review letter', 'Refused: provisional for citation, and not to be relied on to skip an engineer, until the ground-truth sample runs against this rail’s own output (G-130).'),
      basis: 'Parcel-record flood rail &middot; NFHL_48_20260101 &middot; read 12 Sep. Authoritative for serving.',
    }) + '\n' +
    determination({
      k: 'Modeled drainage', v: '0.41 ac ponding', tags: ['NOT A DETERMINATION'], tone: INFO, icon: ALERT,
      sub: 'Ponding modeled across 34 percent of the parcel at this depth, draining to one exit at the south-east corner.',
      action: '              <div style="padding-top:var(--sc-1);"><span style="display:inline-flex; align-items:center; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); border:1px solid var(--sc-line-strong); background:var(--sc-surface); color:var(--sc-ink); font:500 13px/18px var(--sc-font-ui);">Download study (PDF)</span></div>\n',
      basis: 'Drainage engine &middot; DEM-derived catchment and hydrology &middot; run 11 Sep at 4&Prime;. Not a flood determination and not governed by G-130.',
    }) + '\n        </div>\n' +
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-warn); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-3) var(--sc-4); display:flex; align-items:flex-start; gap:var(--sc-3);">\n' +
    '          <span style="flex:none; color:var(--sc-warn); display:grid; place-items:center; padding-top:1px;">' + ALERT + '</span>\n' +
    '          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">\n' +
    '            <div style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-ink);">This parcel is outside the FEMA zone and still models ponding.</div>\n' +
    '            <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:104ch;">Those are answers to two different questions and they do not contradict each other. The zone is a regulatory line; the study is what the ground does with the water. Use the zone for the determination, noting it cannot yet be cited in the letter, and the study for the conversation with the applicant.</div>\n          </div>\n        </section>\n' +
    DS_TABS('Flood study') + '\n' +
    panel({
      grow: true, title: 'What the model found', sub: 'catchment 18.6 ac &middot; 3 flow paths &middot; 1 exit',
      body:
        '            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [
          { k: 'Upstream catchment', v: '18.6 ac', d: 'the area draining toward this parcel' },
          { k: 'Ponded area at 4&Prime;', v: '0.41 ac', d: '34% of the parcel', tone: CRIT },
          { k: 'Flow paths crossing the parcel', v: '3', d: 'two from the north, one from the east' },
          { k: 'Exit points', v: '1', d: 'south-east corner, toward the right of way', tone: WARN },
        ].map((x) =>
          '              <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
          '                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:1px;"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + x.k + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + x.d + '</span></div>\n' +
          '                <span style="font:400 17px/22px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (x.tone || '--sc-ink') + ');">' + x.v + '</span>\n              </div>').join('\n') +
        '\n            </div>\n' +
        '            <div style="padding:var(--sc-4); border-top:1px solid var(--sc-line-faint); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
        '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">Briefing</span>\n' +
        '              <p style="margin:0; max-width:96ch; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Runoff from 18.6 acres to the north and east concentrates along the rear third of the parcel before leaving at the south-east corner. At four inches the model ponds across roughly a third of the lot, shallowest at the street frontage. The engine produced this from terrain, not from a drainage complaint history, so it says nothing about whether this has actually flooded.</p>\n' +
        '              <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">Briefing text is the engine&rsquo;s own and is rendered verbatim. The drainage zones are ordered bands, not measured concentrations, so no band is reported as a value.</div>\n            </div>',
    }),
  rail: rail({
    dock: 'Dock', hasPonding: true, model: MODEL_SVG({ share: 0.34, exits: 1 }),
    basis: 'Modeled study, not the regulatory FEMA zone. The FEMA layer is drawn as muted reference on the same picture so the two are visibly separate. Nothing here is a survey.',
  }),
});

/* =======================  3. DEPTH — what changes with rainfall  ======================= */
const depthPane = (o) =>
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); overflow:hidden;">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              <span style="font:650 20px/26px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.016em; color:var(--sc-ink);">' + o.depth + '</span>\n' +
'              <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">of rainfall</span>\n' +
'              <div style="flex:1;"></div>' + badge('MODELED') + '\n            </div>\n' +
'            <div style="height:268px; border-bottom:1px solid var(--sc-line-faint);">' + o.model + '</div>\n' +
'            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
o.rows.map((r) =>
'              <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'                <span style="flex:1; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r.k + '</span>\n' +
'                <span style="font:400 16px/22px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (r.tone || '--sc-ink') + ');">' + r.v + '</span>\n              </div>').join('\n') + '\n            </div>\n          </div>';

const depth = shell({
  theme: 'light', city: 'Bastrop, TX', seal: 'BT', crumb: 'Flood study / 908 PINE ST / Compare',
  h1: 'What changes at four inches', pageBadges: ['FIXTURE'], foot: FOOT, h: 1140,
  sub: 'The same parcel at two rainfall depths. This is the question a city actually asks, and the reason depth is a control rather than a constant buried in the engine.',
  body:
    depthControl({
      presets: DEPTHS([4, 10]), mode: 'two selected &middot; comparing',
      basis: 'Each pane is its own engine run against the same terrain and the same parcel. Nothing is interpolated between them, and the depth is the only input that differs.',
      right: '          <span style="flex:none; display:inline-flex; align-items:center; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); border:1px solid var(--sc-line-strong); background:var(--sc-surface); color:var(--sc-ink); font:500 13px/18px var(--sc-font-ui);">Change comparison</span>',
    }) + '\n' +
    DS_TABS('Flood study') + '\n' +
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    depthPane({
      depth: '4&Prime;', model: MODEL_SVG({ share: 0.34, exits: 1 }),
      rows: [
        { k: 'Ponded area', v: '0.41 ac', tone: CRIT },
        { k: 'Share of the parcel', v: '34%' },
        { k: 'Flow paths', v: '3' },
        { k: 'Exit points', v: '1' },
      ],
    }) + '\n' +
    depthPane({
      depth: '10&Prime;', model: MODEL_SVG({ share: 0.73, exits: 2 }),
      rows: [
        { k: 'Ponded area', v: '0.88 ac', tone: CRIT },
        { k: 'Share of the parcel', v: '73%', tone: CRIT },
        { k: 'Flow paths', v: '3' },
        { k: 'Exit points', v: '2', tone: WARN },
      ],
    }) + '\n        </div>\n' +
    '        <div style="flex:none; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); max-width:134ch;">Neither pane is a determination, and the regulatory zone reads Zone X at both depths because the zone does not move with the rainfall. The comparison is a conversation with an applicant, not a finding against them.</div>',
});

/* =======================  4. RUNNING — the model takes real time  ======================= */
const running = shell({
  theme: 'light', city: 'Bastrop, TX', seal: 'BT', crumb: 'Flood study',
  h1: 'Flood &amp; drainage screening', pageBadges: ['FIXTURE', 'RUNNING'], foot: FOOT,
  sub: 'Re-running 7 parcels at 4 inches. Every failure class the engine can return is a named row state, never a blank.',
  body:
    depthControl({
      presets: DEPTHS([4]),
      basis: 'A study is a DEM fetch plus a hydrology model, not a lookup: roughly 15 to 45 seconds per parcel. The surface says so rather than showing a spinner that gives up at the client budget.',
      right: '          <span style="flex:none; display:inline-flex; align-items:center; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); border:1px solid var(--sc-line-strong); background:var(--sc-surface); color:var(--sc-ink-2); font:500 13px/18px var(--sc-font-ui);">Cancel run</span>',
    }) + '\n' +
    DS_TABS('Flood study') + '\n' +
    panel({
      grow: true, title: 'Run in progress', sub: '3 of 7 complete',
      right: '<span style="display:inline-flex; align-items:center; gap:6px; font:400 12px/16px var(--sc-font-data); color:var(--sc-info);">' + SPIN + '<span>modeling</span></span>',
      body:
        '            <div style="padding:var(--sc-4) var(--sc-4) var(--sc-2);">\n' +
        '              <div style="height:6px; border-radius:var(--sc-r-full); background:var(--sc-surface-3); overflow:hidden;"><div style="width:43%; height:100%; background:var(--sc-info);"></div></div>\n            </div>\n' +
        table({
          cols: '116px minmax(0,1.4fr) 128px minmax(0,1fr) minmax(0,1.15fr)',
          head: ['Permit', 'Address', 'Parcel', 'State', { t: 'Result', right: true }],
          rows: [
            ['B-26-0418', '908 PINE ST', M('48021:34137'), chip('Complete', OK, '--sc-ok-wash'), R('0.41 ac ponding', CRIT)],
            ['B-26-0402', '1922 CRISTOBAL ST E', M('48021:31880'), chip('Complete', OK, '--sc-ok-wash'), R('0.28 ac ponding', CRIT)],
            ['B-26-0391', '119 PASQUALE DR', M('48021:29455'), chip('Complete', OK, '--sc-ok-wash'), R('0.22 ac ponding', WARN)],
            ['B-26-0377', '1209 FM 969', M('48021:41002'), chip('Modeling', INFO, '--sc-info-wash'), R('38s elapsed', Q)],
            ['B-26-0362', '705 MAIN ST', M('48021:30114'), chip('Queued', Q, '--sc-quiet-wash'), R('&mdash;', Q)],
            ['B-26-0344', '1723 COOPER CT', M('48021:33207'), chip('Engine timeout', WARN, '--sc-warn-wash'), R('retry', WARN)],
            ['B-26-0339', '203 MOSSBERG LN', M('48021:35521'), chip('Engine unreachable', WARN, '--sc-warn-wash'), R('retry', WARN)],
          ],
        }) +
        '\n            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); max-width:130ch;">Timeout and unreachable are the engine&rsquo;s two retryable classes and each keeps its own name; a gate-config failure, a sign-in and a locked property are refusals, not retries, and get their own states. A parcel that did not answer is never recorded as a parcel that does not pond.</div>',
    }),
});

/* =======================  5. THE THREE EMPTIES  ======================= */
const empty = shell({
  theme: 'dark', city: 'This city', seal: 'TC', crumb: 'Flood study',
  h1: 'Flood &amp; drainage screening', pageBadges: ['NOT READ'], h: 1240,
  lenses: LENSES_UNGRANTED,
  foot: '0 of 10 sources granted<br>this pack reads no records',
  sub: 'Three states that look alike and are not. Collapsing any two of them is the mistake this artboard exists to prevent.',
  body:
    DS_TABS('Flood study') + '\n' +
    panel({
      grow: true, title: 'Nothing to model', sub: 'a capability gap',
      body: stateBlock({
        tone: Q, icon: LOCK, k: 'No parcel geometry', divider: false,
        h: 'The model has nothing to run against.',
        p: 'A drainage study starts from the parcel ring and the terrain around it. This pack has no parcel source, so there is no geometry to model. The regulatory zone is a separate matter and is not blocked by this: outside the parcel-record counties it is still served from the atom store, which is what keeps a county outside the program from having no answer at all.',
        b: 'Basis: no parcel source granted on this pack. One parcel grant fills the screening list, the per-parcel study and the map together.',
      }),
    }) + '\n' +
    panel({
      title: 'The engine answered, and declined', sub: 'a refusal the engine authors',
      body: stateBlock({
        tone: WARN, icon: ALERT, k: 'Honest empty',
        h: 'The study ran and produced no model.',
        p: 'Flat terrain, a hole in the elevation data, or a parcel the hydrology cannot resolve. The engine states the reason and the surface renders that reason <em>verbatim</em> rather than writing its own: the engine knows why it declined and the UI does not. Nothing is drawn but the parcel ring.',
        b: 'Basis: study.honestEmpty carries the reason. Never paraphrased, never replaced with a generic message.',
      }),
    }) + '\n' +
    panel({
      title: 'The engine answered, and found nothing', sub: 'a result, not an absence',
      body: stateBlock({
        tone: OK, icon: SHIELD, k: 'No ponding',
        h: 'No modeled ponding on this parcel at the design storm.',
        p: 'The drainage zones and flow paths are still drawn, because they are the result. The ponding entry drops out of the legend when there is no ponding on the map, since a legend key with nothing behind it reads as a broken render. This state never reads as zero and never reads as a failure.',
        b: 'Basis: engine returned a study with no ponding geometry. Distinct from a study that never ran, from one that declined, and from a run that timed out.',
      }),
    }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Parcel.dc.html', import.meta.url), parcel);
fs.writeFileSync(new URL('./Depth.dc.html', import.meta.url), depth);
fs.writeFileSync(new URL('./Running.dc.html', import.meta.url), running);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), empty);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1200, title: 'Screening — the list' },
    { file: 'Parcel.dc.html', x: 1720, y: 0, w: 1600, h: 1240, title: 'One parcel — the study' },
    { file: 'Depth.dc.html', x: 3440, y: 0, w: 1600, h: 1140, title: 'Depth — the four-inch question' },
    { file: 'Running.dc.html', x: 0, y: 1420, w: 1600, h: 1040, title: 'Running — every failure class is named' },
    { file: 'Empty.dc.html', x: 1720, y: 1420, w: 1600, h: 1240, title: 'Three empties that are not alike' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -330, w: 640, text: 'Development services, Flood study tab.\nDrawn against the engine: study fields, legend wording and order, the (0,60] depth bound and the failure classes all come from hauska-map/apps/property-explorer.\nPalette and type ramp are the frozen sc-kit, copied byte-identical.\nNO FIGURE IS MEASURED. Fixture throughout.' },
    { id: 'move1', x: 700, y: -330, w: 700, text: 'STRUCTURAL MOVE 1: the tab becomes a SCREEN, not a viewer.\nToday it is a paragraph and a dead button that studies one parcel. It lives beside Pipeline, Inspections and Work orders, so the question it should answer is "which of the 304 permits in flight sit on parcels that pond" — not "show me this parcel".\nA parcel that models nothing stays in the list. It is a result.' },
    { id: 'move2', x: 1720, y: -330, w: 700, text: 'STRUCTURAL MOVE 2: two determinations, never blended.\nSeparate cards, separate authority, separate vintage. The model is badged NOT A DETERMINATION and says on its own face that G-130 does not govern it.\nThe FEMA layer is drawn on the SAME picture as muted reference, which is what the engine already does — separating the two answers is not the same as hiding one of them.' },
    { id: 'cite', x: 2460, y: -330, w: 660, text: 'THE RULING IS A CONTROL, NOT A SENTENCE.\nG-130 makes the rail authoritative for SERVING and provisional for CITATION until a ground-truth sample runs against its own output, and bars relying on it to skip an engineer.\nSo "Cite in review letter" is a REFUSED affordance on the regulatory card, carrying that reason — not a footnote under the drainage study, which the ruling does not govern at all. An earlier draft put it in exactly that wrong place.' },
    { id: 'depthn', x: 3440, y: -330, w: 660, text: 'MOVE 3: depth is a control, and it governs the LENS.\nrainfallDepthInches is a bare DEPTH in (0,60]. There is no storm duration in the contract and no depth-to-return-period table anywhere in the source, so no artboard names a duration or a recurrence interval — an earlier draft invented both.\nChanging the depth re-ranks the whole screening list, which is what turns a per-parcel tool into an instrument.' },
    { id: 'runn', x: 0, y: 1190, w: 660, text: 'EVERY FAILURE CLASS IS A NAMED STATE.\nThe engine returns two retryable classes — timeout and unreachable — plus a gate-config failure, a sign-in, a locked property and an honest 422 refusal. They are different events and the list never collapses them.\nA parcel that did not answer is never written down as a parcel that does not pond.' },
    { id: 'emptyn', x: 1720, y: 1190, w: 680, text: 'THREE EMPTIES, ONE ARTBOARD, ON PURPOSE.\n1. No parcel geometry — a capability gap. The regulatory zone is NOT blocked by it: outside the parcel-record counties the atom store still serves an answer.\n2. honestEmpty — the engine ran and declined, and its reason renders VERBATIM. The engine knows why; the UI does not.\n3. No ponding — a result, with zones and flow paths still drawn, and the ponding key dropped from the legend.\nDark here only to show both themes hold.' },
    { id: 'owed', x: 2460, y: 1190, w: 700, text: 'WHAT THIS DESIGN NEEDS BUILT — it is ahead of the code, deliberately.\n• rainfallDepthInches is an optional BFF field with NO UI: the shipped tool never sends it, and nothing caches on it. The depth control is the first thing to wire.\n• There is no job, queue, cancel or cross-navigation persistence. Today a run is one component-local fetch on a 55s client budget. The Running artboard proposes that machinery.\n• Entitlement (401 sign-in, 402 locked property) is the dominant gate on this report in Property Explorer and is NOT drawn on any artboard here. Pinned, needs its own pass.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Parcel, Depth, Running, Empty .dc.html + canvas.json');
