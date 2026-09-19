import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const LINK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

// determination vocabulary, lifted from web/styles.css
const MX = {
  Fail:      { rail: 'var(--sc-crit)',  bg: 'var(--sc-crit-wash)',  ink: 'var(--sc-ink)',   pc: 'var(--sc-crit)',  pw: 'var(--sc-crit-wash)' },
  Uncertain: { rail: 'var(--sc-warn)',  bg: 'var(--sc-warn-wash)',  ink: 'var(--sc-ink)',   pc: 'var(--sc-warn)',  pw: 'var(--sc-warn-wash)' },
  Unchecked: { rail: 'var(--sc-quiet)', bg: 'HATCH',                ink: 'var(--sc-ink-2)', pc: 'var(--sc-quiet)', pw: 'var(--sc-quiet-wash)' },
  Pass:      { rail: 'transparent',     bg: 'transparent',          ink: 'var(--sc-ink-3)', pc: 'var(--sc-quiet)', pw: 'var(--sc-quiet-wash)' },
};
const HATCH = 'repeating-linear-gradient(-45deg, var(--sc-quiet-wash), var(--sc-quiet-wash) 6px, var(--sc-surface) 6px, var(--sc-surface) 12px)';

const pill = (t, c, w) =>
  '<span style="flex:none; align-self:flex-start; font:500 12px/16px var(--sc-font-ui); color:' + c + '; background:' + w + '; border:1px solid ' + c + '; border-radius:var(--sc-r-full); padding:1px 9px;">' + t + '</span>';

const chip = (t, on) =>
  '<span style="font:500 12px/16px var(--sc-font-ui); padding:3px 10px; border-radius:var(--sc-r-full); border:1px solid var(' + (on ? '--sc-accent' : '--sc-line') + '); color:var(' + (on ? '--sc-accent' : '--sc-ink-2') + '); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + ';">' + t + '</span>';

const topbar = (o) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-5); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Plan Review</span>\n' +
'      <span style="width:1px; height:18px; background:var(--sc-line);"></span>\n' +
'      <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">' + o.city + '</span>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(' + o.envC + '); background:var(' + o.envW + '); border:1px solid var(' + o.envC + '); border-radius:var(--sc-r-control); padding:0 6px;">' + o.env + '</span>\n' +
'      <nav style="display:flex; gap:var(--sc-5); margin-left:var(--sc-5);">\n' +
['Queue', 'Library', 'Code', 'Applicant'].map((n) =>
'        <span style="font:' + (n === o.navOn ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (n === o.navOn ? '--sc-ink' : '--sc-ink-2') + '); padding:2px 0; box-shadow:' + (n === o.navOn ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' + n + '</span>').join('\n') + '\n      </nav>\n' +
'      <div style="flex:1;"></div>\n' +
'      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.who + '</span>\n    </header>';

// ---- queue metric buttons (filters, same entry-point pattern as the lenses) ----
const qMetric = (m) =>
'          <div style="border:1px solid var(' + (m.on ? '--sc-accent' : '--sc-line') + '); border-radius:var(--sc-r); background:var(' + (m.on ? '--sc-accent-wash' : '--sc-surface') + '); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:2px; min-width:0;">\n' +
(m.tracked
  ? '            <span style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + m.n + '</span>\n'
  : '            <span style="font:620 15px/30px var(--sc-font-ui); color:var(--sc-ink-3);">Not tracked</span>\n') +
'            <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + m.l + '</span>\n' +
(m.basis ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:8px; margin-top:3px;">' + m.basis + '</span>\n' : '') +
'          </div>';

const qRow = (r) =>
'            <div style="display:grid; grid-template-columns:3px 108px minmax(0,1fr) 150px 132px 118px 78px; gap:var(--sc-3); align-items:center; padding:9px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              <span style="align-self:stretch; background:' + r.rail + '; border-radius:var(--sc-r-full);"></span>\n' +
'              <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-accent);">' + r.id + '</span>\n' +
'              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + r.place + '</span>\n' +
'              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r.type + '</span>\n' +
'              ' + (r.edition ? '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r.edition + '</span>' : pill('No edition', 'var(--sc-warn)', 'var(--sc-warn-wash)')) + '\n' +
'              <span style="display:flex; gap:5px; align-items:center;">' + r.findings + '</span>\n' +
'              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); text-align:right;">' + r.age + '</span>\n            </div>';

const count = (n, c, w) => n
  ? '<span style="font:500 12px/16px var(--sc-font-data); color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px;">' + n + '</span>'
  : '';

// ---- matrix row ----
const mxRow = (r) => {
  const d = MX[r.det];
  const bg = d.bg === 'HATCH' ? HATCH : d.bg;
  return '              <div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:start; padding:10px var(--sc-3); background:' + bg + '; border-bottom:1px solid var(--sc-line-faint);">\n' +
    '                <span style="align-self:stretch; background:' + d.rail + '; border-radius:var(--sc-r-full);"></span>\n' +
    '                <div style="min-width:0; display:flex; flex-direction:column; gap:4px;">\n' +
    '                  <span style="display:inline-flex; flex-direction:column; gap:2px; align-self:flex-start; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); padding:3px 8px; background:var(--sc-surface);">' +
    '<span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + r.corpus + '</span>' +
    '<span style="font:500 13px/17px var(--sc-font-data); color:var(--sc-ink);">' + r.sec + '</span></span>\n' +
    '                  <span style="font:600 14px/20px var(--sc-font-ui); color:' + d.ink + ';">' + r.heading + '</span>\n' +
    (r.licensed
      ? '                  <span style="display:inline-flex; align-items:center; gap:6px; align-self:flex-start; font:400 12px/16px var(--sc-font-data); color:var(--sc-restricted); background:var(--sc-restricted-wash); border-radius:var(--sc-r-control); padding:2px 8px;">' + LOCK + ' Body withheld — licensed corpus, cited not quoted</span>\n'
      : (r.analysis ? '                  <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:78ch;">' + r.analysis + '</span>\n' : '')) +
    '                  <span style="display:flex; align-items:center; gap:var(--sc-3); font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">\n' +
    '                    <span>' + r.cite + '</span><span>' + r.conf + '</span>' +
    (r.deep ? '<span style="display:inline-flex; align-items:center; gap:4px; color:var(--sc-accent);">' + LINK + ' ICC</span>' : '') + '\n                  </span>\n                </div>\n' +
    '                ' + pill(r.det, d.pc, d.pw) + '\n              </div>';
};

const mxGroup = (g) =>
'            <section>\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2); padding:var(--sc-2) var(--sc-3); background:var(--sc-surface-2); border-top:1px solid var(--sc-line-faint); border-bottom:1px solid var(--sc-line-faint);">\n' +
'                <span style="font:650 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + g.title + '</span>\n' +
'                <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + g.sub + '</span>\n              </div>\n' +
g.rows.map(mxRow).join('\n') + '\n            </section>';

// ---- the workflow spine ----
const spine = (steps, refs, active) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-4); flex-wrap:wrap; border-bottom:1px solid var(--sc-line); padding-bottom:10px;">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-1);">\n' +
steps.map((s, i) => {
  const on = s.n === active;
  const doneC = s.done ? 'var(--sc-ok)' : on ? 'var(--sc-accent)' : 'var(--sc-line-strong)';
  return '            ' + (i ? '<span style="width:18px; height:1px; background:var(--sc-line);"></span>' : '') +
    '<span style="display:inline-flex; align-items:center; gap:7px; padding:4px 11px; border-radius:var(--sc-r-full); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + ';">' +
    '<span style="width:7px; height:7px; border-radius:50%; background:' + doneC + ';"></span>' +
    '<span style="font:' + (on ? '620' : '400') + ' 13px/18px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + s.n + '</span></span>';
}).join('\n') + '\n          </div>\n' +
'          <span style="width:1px; height:18px; background:var(--sc-line);"></span>\n' +
'          <div style="display:flex; gap:var(--sc-1);">\n' +
refs.map((r) =>
'            <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); padding:4px 10px; border-radius:var(--sc-r-control); background:var(--sc-surface-2); border:1px solid var(--sc-line-faint);">' + r + '</span>').join('\n') + '\n          </div>\n        </div>';

function page(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:' + o.w + 'px; height:' + o.h + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
(o.embedded ? o.embedBar : topbar(o)) + '\n' +
'  <main style="flex:1; min-height:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' + o.body + '\n  </main>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"dark"},"$preview":{"width":' + o.w + ',"height":' + o.h + '}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "dark") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

// ============================== QUEUE ==============================
const queueBody =
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Work / Plan review</span>\n' +
'        <div style="display:flex; align-items:baseline; gap:var(--sc-3);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Queue</h1>' +
'        <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">25 engagements · bastrop_tx</span></div>\n' +
'      </div>\n' +
'      <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:var(--sc-3);">\n' +
[
  { n: '9', l: 'Submitted', tracked: true, on: false },
  { n: '11', l: 'In review', tracked: true, on: true },
  { n: '', l: 'Past deadline', tracked: false, basis: 'no deadline field on engagement' },
  { n: '5', l: 'Approved with conditions', tracked: true, on: false },
].map(qMetric).join('\n') + '\n      </div>\n' +
'      <div style="display:flex; align-items:center; gap:var(--sc-2);">\n' +
'        <span style="display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); font:500 13px/18px var(--sc-font-ui);">Start a review</span>\n' +
'        <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">Project type plus place. No upload required to start.</span>\n' +
'        <div style="flex:1;"></div>\n      </div>\n' +
'      <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
'        <div style="display:grid; grid-template-columns:3px 108px minmax(0,1fr) 150px 132px 118px 78px; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
['', 'Id', 'Place', 'Type', 'Edition', 'Open findings', 'Age'].map((h) =>
'          <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('\n') + '\n        </div>\n' +
'        <div>\n' +
[
  { id: 'eng-0291', place: '908 PINE ST', type: 'residential-addition', edition: 'bastrop_tx-bdc-2026', age: '4d',
    rail: 'var(--sc-crit)', findings: count('2', 'var(--sc-crit)', 'var(--sc-crit-wash)') + count('1', 'var(--sc-warn)', 'var(--sc-warn-wash)') + count('6', 'var(--sc-quiet)', 'var(--sc-quiet-wash)') },
  { id: 'eng-0288', place: '1401 CHESTNUT ST', type: 'new-commercial-shell', edition: 'IBC-2018', age: '6d',
    rail: 'var(--sc-crit)', findings: count('1', 'var(--sc-crit)', 'var(--sc-crit-wash)') + count('3', 'var(--sc-warn)', 'var(--sc-warn-wash)') + count('11', 'var(--sc-quiet)', 'var(--sc-quiet-wash)') },
  { id: 'eng-0286', place: '204 HILL ST', type: 'new-single-family', edition: '', age: '8d',
    rail: 'var(--sc-warn)', findings: '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">blocked</span>' },
  { id: 'eng-0283', place: '11 DEPOT ST', type: 'fence', edition: 'bastrop_tx-bdc-2026', age: '9d',
    rail: 'var(--sc-warn)', findings: count('2', 'var(--sc-warn)', 'var(--sc-warn-wash)') + count('4', 'var(--sc-quiet)', 'var(--sc-quiet-wash)') },
  { id: 'eng-0279', place: '1922 CRISTOBAL ST', type: 'mechanical-attachment', edition: 'IBC-2018', age: '12d',
    rail: 'var(--sc-ok)', findings: '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">none open</span>' },
  { id: 'eng-0274', place: '302 MAIN ST', type: 'sign', edition: 'bastrop_tx-bdc-2026', age: '15d',
    rail: 'var(--sc-ok)', findings: '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">none open</span>' },
].map(qRow).join('\n') + '\n        </div>\n' +
'        <div style="margin-top:auto; display:flex; align-items:center; padding:var(--sc-2) var(--sc-4); border-top:1px solid var(--sc-line-faint);">\n' +
'          <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">Previous</span>\n' +
'          <span style="flex:1; text-align:center; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Page 1 of 2 · 11 in review</span>\n' +
'          <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Next</span>\n        </div>\n      </section>';

// ============================== REVIEW CONSOLE ==============================
const reviewBody = (embedded) =>
(embedded ? '' :
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Work / Plan review / eng-0291</span>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-3); flex-wrap:wrap;">\n' +
'          <h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">908 PINE ST</h1>\n' +
'          ' + pill('In review', 'var(--sc-info)', 'var(--sc-info-wash)') + '\n' +
'          <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-3);">48021:34137 · residential-addition</span>\n        </div>\n' +
'      </div>\n') +
'      <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap; padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-ok); background:var(--sc-ok-wash); border-radius:var(--sc-r);">\n' +
'        <span style="font:500 13px/18px var(--sc-font-ui); color:var(--sc-ink);">Edition declared</span>\n' +
'        <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">bastrop_tx-bdc-2026-adopted</span>\n' +
'        <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">Declared, not derived from jurisdiction. The matrix cites “no edition declared” until this is set.</span>\n' +
'        <div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Change</span>\n      </div>\n' +
spine(
  [{ n: 'Intake', done: true }, { n: 'Applicability', done: false }, { n: 'Findings', done: false }, { n: 'Letter', done: false }],
  ['Documents', 'Place', 'History'], 'Applicability') + '\n' +
'      <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
'        ' + chip('Unresolved only', true) + '\n        ' + chip('All', false) + '\n' +
'        <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">9 shown · 14 passing rows hidden</span>\n' +
'        <div style="flex:1;"></div>\n' +
'        <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Traced to source &middot; full code text not reproduced</span>\n      </div>\n' +
'      <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1);">\n' +
[
  { title: 'City of Bastrop Building Block B3 (2026 adopted)', sub: '2 fail · 1 uncertain', rows: [
    { corpus: 'BASTROP-UDC', sec: '14-02-003', heading: 'Dimensional standards, SF-1', det: 'Fail',
      analysis: 'Proposed front setback 22 ft is less than the 30 ft required for SF-1 on the most current schedule. Layer 83 supersedes layer 23; the two city schedules disagree.',
      cite: 'Bastrop 2026 code &sect;&nbsp;14.02.003', conf: 'confidence: high' },
    { corpus: 'BASTROP-UDC', sec: '14-02-008', heading: 'Permitted use, residential districts', det: 'Uncertain',
      analysis: 'Use is permitted. Whether the addition triggers the Old Town overlay standards could not be resolved from the submitted scope.',
      cite: 'Bastrop 2026 code &sect;&nbsp;14.02.008', conf: 'confidence: medium' },
    { corpus: 'BASTROP-UDC', sec: '14-02-005', heading: 'Lot coverage and impervious cover', det: 'Unchecked',
      analysis: 'Not wired on this manifest. The section exists in the store and is not in this edition manifest.',
      cite: 'Bastrop 2026 code &sect;&nbsp;14.02.005', conf: 'confidence: not earned' },
  ]},
  { title: '2018 International Building Code', sub: '1 fail · 5 unchecked', rows: [
    { corpus: 'IBC-2018', sec: '1001.1', heading: 'General', det: 'Fail', licensed: true, deep: true,
      cite: 'IBC 2018 &sect;&nbsp;1001.1', conf: 'confidence: high' },
    { corpus: 'IBC-2018', sec: '1207.2', heading: 'Sound transmission, air-borne', det: 'Unchecked', licensed: true, deep: true,
      cite: 'IBC 2018 &sect;&nbsp;1207.2', conf: 'confidence: not earned' },
  ]},
].map(mxGroup).join('\n') + '\n      </section>';

const embedBar =
'    <div style="height:34px; flex:none; display:flex; align-items:center; gap:var(--sc-2); padding:0 var(--sc-5); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">Plan review</span>\n' +
'      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">eng-0291 · 908 PINE ST</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <span style="display:inline-flex; align-items:center; gap:5px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);">Open full product ' + ARROW + '</span>\n    </div>';

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), page({
  w: 1600, h: 1000, city: 'bastrop_tx', env: 'LIVE', envC: '--sc-ok', envW: '--sc-ok-wash',
  navOn: 'Queue', who: 'j.stinson · reviewer', body: queueBody,
}));
fs.writeFileSync(new URL('./Review.dc.html', import.meta.url), page({
  w: 1600, h: 1000, city: 'bastrop_tx', env: 'LIVE', envC: '--sc-ok', envW: '--sc-ok-wash',
  navOn: 'Queue', who: 'j.stinson · reviewer', body: reviewBody(false),
}));
fs.writeFileSync(new URL('./Embedded.dc.html', import.meta.url), page({
  w: 1180, h: 900, embedded: true, embedBar, body: reviewBody(true),
}));

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1000, title: 'Queue' },
    { file: 'Review.dc.html', x: 1720, y: 0, w: 1600, h: 1000, title: 'Review console — Applicability' },
    { file: 'Embedded.dc.html', x: 3440, y: 0, w: 1180, h: 900, title: 'Embedded in Dashboards (?embed=1)' },
  ],
  annotations: [
    { id: 'spine', x: 1720, y: -250, w: 700, text: 'THE BIG MOVE: seven peer tabs become a WORKFLOW SPINE plus REFERENCE PANES.\nIntake → Applicability → Findings → Letter is a linear review. Documents, Place and History are material you consult at any point. Rendering all seven as equals hid the fact that this product has an order.' },
    { id: 'edition', x: 2460, y: -250, w: 640, text: 'EDITION IS PROMOTED OUT OF A TAB.\nThe matrix cites "no edition declared" until it is set, so it blocks the whole review. It was a select box inside Intake. It is now a banner on every pane, and the queue carries an "Edition" column so a blocked review is visible before you open it.' },
    { id: 'hatch', x: 0, y: -250, w: 660, text: 'The determination vocabulary is KEPT, not redesigned. Fail reads crit, Uncertain reads warn, Pass recedes to ink-3, and Unchecked is a DIAGONAL HATCH - already in styles.css and the best thing in the product. A hatch says "this is an absence, not a result" in a way no colour does.' },
    { id: 'licensed', x: 3440, y: -250, w: 660, text: 'LICENSED BODY IS A STATED REFUSAL, NOT A BLANK.\nICC corpora are cited, never quoted - app.js already drops analysis for licensed rows. Drawn as an explicit withheld marker so it reads as a licence boundary rather than a missing field somebody should go fill.' },
    { id: 'queue', x: 740, y: -250, w: 620, text: 'QUEUE CARRIES WHAT A REVIEWER TRIAGES ON.\nToday: Id, Place, Stage, Type. Added: Edition (blocked or not), Open findings (fail / uncertain / unchecked counts) and Age. "Past deadline" stops rendering a hardcoded 0 and says Not tracked with its basis.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main.dc.html, Review.dc.html, Embedded.dc.html, canvas.json');
