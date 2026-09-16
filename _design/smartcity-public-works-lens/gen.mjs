/**
 * SmartCity OS — Public works lens.
 *
 *   node gen.mjs      rewrites every artboard and canvas.json
 *   node check.mjs    the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * Every row, count, basis sentence and counting rule on these boards comes from
 * `source-state.json`, which is the OUTPUT of the product's own composers run
 * against smartcity-dashboards origin/main f776b4bf — not a transcription of
 * them. Re-dump it rather than editing it, and re-run this file after.
 *
 * WHAT THIS LENS IS, from the product rather than from memory. src/domains.mjs
 * registers exactly two domains under lensId "public-works":
 *
 *   cip-projects     region "Capital projects"   gatedBy powerbi
 *   call-analytics   region "Call analytics"     gatedBy goto
 *
 * They are two regions of DIFFERENT UNITS. A capital project is one row per
 * project. A call record is one bucket per queue per relative day, and the
 * domain says so in its own words: "this domain is the one whose RECORD IS NOT
 * AN EVENT". Drawing them as two instances of one component would assert they
 * are the same shape.
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* ------------------------------------------------------------ primitives */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/**
 * The badge vocabulary is CLOSED and copied from the product. Extracted from
 * web/index.html at f776b4bf: nav badges are Empty / Not built / Not read /
 * Preview, and panel pills add Demo records / Not connected / Mounted /
 * Partial / Unread. Nothing here invents a state word.
 */
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

/**
 * The nav. Badges for the six lenses this design does not draw are the SHIPPED
 * values, copied from web/index.html at f776b4bf; badges for Public works,
 * Parks and Fire and EMS are the state the board being drawn is actually in.
 * Mixing a computed badge with a shipped one on the same strip would be two
 * different claims wearing one style, so the foot of the nav says which is
 * which on every board.
 */
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

const nav = (pwBadge, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', SHIPPED_NAV.map(([n, b]) => navRow(n, n === 'Public works' ? pwBadge : b, n === 'Public works'))) + '\n' +
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
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, projects, queues</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Public works</span>\n      </div>\n    </header>';

/* ---------------------------------------------------------- tier 1 tiles */

/** A read tile carries a figure AND its denominator. A ratio never travels alone. */
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

/* ------------------------------------------- tier 2: the two peer regions

The product stacks both regions on one page. THIS IS A PROPOSED CHANGE and the
README says so: a sixteen-row register stacked above a twenty-five bucket matrix
puts the second region below the fold at 1040px, and the staff who live in call
handling never reach their own page. Peer regions switch, the way DS_TABS
already switches seven tabs, so the lens shape stays one shape across the
product. Each region carries its OWN state chip, because two regions on one lens
can be in two different states and a single page-level chip would flatten them. */

const regionStrip = (items, active) =>
'        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:7px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + t.c + '</span>' +
    (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n        </div>';

/* -------------------------------------------------------------- the panel */

const panelHead = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink); white-space:nowrap;">' + o.title + '</span>\n' +
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
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:8px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
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

const stateBlock = (o) =>
'          <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-6) var(--sc-6); max-width:76ch;">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.k + '</div>\n' +
'            <h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + o.h + '</h2>\n' +
(o.p ? '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>\n' : '') +
'            ' + basisLine(o.b, 96) + '\n          </div>';

/* ------------------------ THE SECOND AXIS, ONE: a matrix with forbidden cells

src/domains/cip-projects.mjs: "PHASE AND STATUS ARE TWO QUESTIONS. Phase is
where the project sits in its own lifecycle; status is whether it is in trouble.
A register that folds them shows neither, so both travel and STATUS_PHASES keeps
them coherent: a complete project is in closeout and a stalled one is not."

STATUS_PHASES is therefore a declaration of which cells CANNOT OCCUR. That makes
this grid the one place in the design set where four states are visible at once:

    a count            n projects sit here
    a measured zero    this cell can occur and none does
    cannot occur       the product's own rule forbids it, drawn hatched
    unmeasured         would be a cell with no reading at all; none here

Collapsing "cannot occur" into "zero" would put eight invented zeros into a
grid of twenty cells and read as a register with holes in it. */

const TONE = { stalled: '--sc-crit', 'at-risk': '--sc-warn', 'in-progress': '--sc-info', complete: '--sc-ok' };

const matrix = (o) => {
  const cell = (c) => {
    if (c.forbidden) {
      return '<div style="display:grid; place-items:center; height:31px; border-left:1px solid var(--sc-line-faint); background:repeating-linear-gradient(135deg, var(--sc-surface-3) 0 4px, transparent 4px 8px);"><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">&mdash;</span></div>';
    }
    if (c.v === 0) {
      return '<div style="display:grid; place-items:center; height:31px; border-left:1px solid var(--sc-line-faint);"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">0</span></div>';
    }
    return '<div style="display:grid; place-items:center; height:31px; border-left:1px solid var(--sc-line-faint); background:var(' + c.wash + ');"><span style="font:400 15px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + c.tone + ');">' + c.v + '</span></div>';
  };
  const cols = '112px repeat(' + o.statuses.length + ', minmax(0,1fr)) 46px';
  return '          <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2);">\n' +
'            <div style="display:grid; grid-template-columns:' + cols + '; align-items:end;">\n' +
'              <span style="font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3); padding-bottom:6px;">Phase \\ status</span>\n' +
o.statuses.map((s) => '              <span style="text-align:center; font:500 11px/14px var(--sc-font-data); color:var(' + s.tone + '); padding:0 2px 6px;">' + s.label + '</span>').join('\n') + '\n' +
'              <span style="text-align:center; font:500 11px/14px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); padding-bottom:6px;">ALL</span>\n' +
o.rows.map((r) =>
'              <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); border-top:1px solid var(--sc-line-faint); height:31px; display:flex; align-items:center;">' + r.label + '</span>\n' +
r.cells.map((c) => '              <div style="border-top:1px solid var(--sc-line-faint);">' + cell(c) + '</div>').join('\n') + '\n' +
'              <div style="border-top:1px solid var(--sc-line-faint); display:grid; place-items:center; height:31px; border-left:1px solid var(--sc-line);"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + r.total + '</span></div>').join('\n') + '\n' +
'              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); border-top:1px solid var(--sc-line); height:32px; display:flex; align-items:center;">ALL</span>\n' +
o.colTotals.map((t) => '              <div style="border-top:1px solid var(--sc-line); display:grid; place-items:center; height:32px; border-left:1px solid var(--sc-line-faint);"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + t + '</span></div>').join('\n') + '\n' +
'              <div style="border-top:1px solid var(--sc-line); display:grid; place-items:center; height:32px; border-left:1px solid var(--sc-line);"><span style="font:500 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + o.grand + '</span></div>\n' +
'            </div>\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-4); padding-top:var(--sc-3); flex-wrap:wrap;">\n' +
'              <span style="display:flex; align-items:center; gap:6px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);"><span style="width:16px; height:12px; border:1px solid var(--sc-line); background:var(--sc-info-wash); display:inline-block;"></span>a count</span>\n' +
'              <span style="display:flex; align-items:center; gap:6px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);"><span style="width:16px; height:12px; border:1px solid var(--sc-line); display:inline-block; text-align:center; font:400 9px/11px var(--sc-font-data);">0</span>a measured zero</span>\n' +
'              <span style="display:flex; align-items:center; gap:6px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);"><span style="width:16px; height:12px; border:1px solid var(--sc-line); background:repeating-linear-gradient(135deg, var(--sc-surface-3) 0 4px, transparent 4px 8px); display:inline-block;"></span>cannot occur by rule</span>\n' +
'            </div>\n          </div>';
};

/* -------------------- THE SECOND AXIS, TWO: one matrix read two ways

src/domains/call-analytics.mjs emits one record per QUEUE per RELATIVE DAY. The
product renders two tables, "By queue" and "By relative day". They are not two
datasets: they are the two MARGINS of the same twenty-five buckets, and they
reconcile to the same total. Drawing them as two unrelated tables hides the one
property worth showing, which is that they agree. */

const heat = (o) => {
  const cols = '170px repeat(' + o.days.length + ', minmax(0,1fr)) 70px';
  const cell = (v) => {
    const pct = Math.round((v / o.max) * 100);
    const alpha = 0.10 + (pct / 100) * 0.42;
    return '<div style="display:grid; place-items:center; height:34px; border-left:1px solid var(--sc-line-faint); background:rgba(43,95,199,' + alpha.toFixed(2) + ');"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + v + '</span></div>';
  };
  return '          <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2);">\n' +
'            <div style="display:grid; grid-template-columns:' + cols + '; align-items:center;">\n' +
'              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); padding-bottom:6px;">Queue \\ day</span>\n' +
o.days.map((d) => '              <span style="text-align:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-3); padding-bottom:6px;">' + d + '</span>').join('\n') + '\n' +
'              <span style="text-align:center; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); padding-bottom:6px;">QUEUE</span>\n' +
o.rows.map((r) =>
'              <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink); border-top:1px solid var(--sc-line-faint); height:34px; display:flex; align-items:center; gap:6px;"><span style="font:400 11px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + r.ref + '</span>' + r.label + '</span>\n' +
r.cells.map(cell).map((c) => '              <div style="border-top:1px solid var(--sc-line-faint);">' + c + '</div>').join('\n') + '\n' +
'              <div style="border-top:1px solid var(--sc-line-faint); display:grid; place-items:center; height:31px; border-left:1px solid var(--sc-line);"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + r.total + '</span></div>').join('\n') + '\n' +
'              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); border-top:1px solid var(--sc-line); height:32px; display:flex; align-items:center;">DAY</span>\n' +
o.dayTotals.map((t) => '              <div style="border-top:1px solid var(--sc-line); display:grid; place-items:center; height:32px; border-left:1px solid var(--sc-line-faint);"><span style="font:400 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + t + '</span></div>').join('\n') + '\n' +
'              <div style="border-top:1px solid var(--sc-line); display:grid; place-items:center; height:32px; border-left:1px solid var(--sc-line);"><span style="font:500 14px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + o.grand + '</span></div>\n' +
'            </div>\n          </div>';
};

/* ------------------------------------------------------ the blocked card

The component this whole lane produced. A region that cannot show data states
FOUR things and never fewer: what state it is in, the basis VERBATIM from
whatever produced it, what KIND of thing would move it, and when that was last
read and by what. "Not read" on its own is the sentence that has been costing
this product a year of ambiguity. */

const blocked = (o) =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-3); padding:var(--sc-4) var(--sc-4) var(--sc-4);">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
'              <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.region + '</span>\n' +
'              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.domainId + ' &middot; gatedBy ' + o.kind + '</span>\n' +
'              <div style="flex:1;"></div>\n' +
'              <span style="font:500 12px/16px var(--sc-font-data); color:var(' + o.tone + '); background:var(' + o.wash + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + o.state + '</span>\n            </div>\n' +
'            <div style="display:grid; grid-template-columns:104px minmax(0,1fr); gap:var(--sc-2) var(--sc-3); align-items:start;">\n' +
o.facts.map((f) =>
'              <span style="font:500 12px/18px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">' + f[0] + '</span>\n' +
'              <span style="font:400 13px/18px ' + (f[2] ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (f[2] ? '--sc-ink' : '--sc-ink-2') + ');">' + f[1] + '</span>').join('\n') + '\n' +
'            </div>\n' +
'            ' + basisLine(o.basis, 112) + '\n          </div>';

/* --------------------------------------------------------- the five states */

const STATE_ROWS = [
  ['ok', 'the region read and carries records', 'var(--sc-ok)'],
  ['granted-empty', 'a source is granted and returned nothing', 'var(--sc-info)'],
  ['ungranted', 'the region is BUILT and this city has no source for it', 'var(--sc-warn)'],
  ['no-fixture-source', 'this pack generates nothing; what is granted is a live feed the fixture seam does not read', 'var(--sc-ink-3)'],
  ['not-registered', 'THE SURFACE DOES NOT EXIST. No entry in DOMAIN_STATUSES, deliberately', 'var(--sc-crit)'],
];

const stateLegend = () =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
STATE_ROWS.map((r, i) =>
'            <div style="display:grid; grid-template-columns:150px minmax(0,1fr); gap:var(--sc-3); padding:7px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
  '<span style="font:400 13px/18px var(--sc-font-data); color:' + r[2] + ';">' + r[0] + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[1] + '</span></div>').join('\n') + '\n          </div>';

/* ------------------------------------------------------------- the shell */

/**
 * THE PROVENANCE FOOT, and it is not decoration.
 *
 * Every board names, in the product's own codes, which regions it is drawing:
 * the domain id, the vendor kind that gates it, the record type and the pack.
 * Two reasons, and the second is the stronger one.
 *
 * A staff lens is platform-internal, and a member of staff looking at a page
 * that will not fill needs to know whose feed is missing. The shipped panel chip
 * says "Reporting output contract" and names no vendor; vendors are named on
 * Connections. Naming them here is a PROPOSED CHANGE and the README says so.
 *
 * And it gives check.mjs real inputs. A canvas that renders only display forms
 * gives a check nothing to compare against the registry, which is exactly how a
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
topbar(o.city, o.seal, o.env) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.pwBadge, o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Public works</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Public works</h1>' + badge(o.pageBadge) + '<div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
'        <p style="margin:0; max-width:96ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
(o.tiles ? tiles(o.tiles) + '\n' : '') +
regionStrip(o.regions, o.activeRegion) + '\n' +
o.body + '\n' +
provFoot(o.prov, o.pack) + '\n' +
'    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'dark') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'dark') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ========================================================== the data reads */

const cip = S.demo.cip;
const calls = S.demo.calls;
const { PROJECT_PHASE_VALUES, PROJECT_STATUS_VALUES, STATUS_PHASES } = S.axis;

const chip = (t, c, w) => ({ chip: true, t, c, w });
const CHIP = {
  stalled: ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'at-risk': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'in-progress': ['var(--sc-info)', 'var(--sc-info-wash)'],
  complete: ['var(--sc-ok)', 'var(--sc-ok-wash)'],
};
const statusLabel = (id) => PROJECT_STATUS_VALUES.find((s) => s.id === id).label;

/** The rows on the board ARE the composer's rows, in the composer's order. */
const PAGE = 10;
const cipRows = cip.records.slice(0, PAGE).map((r) => [
  r.recordId, r.subject, r.phase, r.place.label, r.scheduleLabel,
  chip(statusLabel(r.status), ...CHIP[r.status]),
]);

/**
 * The matrix, counted off the same records rather than off the extras.
 *
 * PHASE IS THE ROW AND STATUS IS THE COLUMN, which is not arbitrary: the phase
 * names are the long ones and a row label has room, while a column header at
 * this width does not. The first draft had it the other way round and
 * "construction" ran into "closeout" on the rendered board. Rendering found it;
 * re-reading the generator would not have.
 */
const matrixStatuses = PROJECT_STATUS_VALUES.map((s) => ({ label: s.label, tone: TONE[s.id] }));
const matrixRows = PROJECT_PHASE_VALUES.map((p) => ({
  label: p,
  cells: PROJECT_STATUS_VALUES.map((s) => ({
    forbidden: !STATUS_PHASES[s.id].includes(p),
    v: cip.records.filter((r) => r.status === s.id && r.phase === p).length,
    tone: TONE[s.id],
    wash: TONE[s.id] + '-wash',
  })),
  total: cip.records.filter((r) => r.phase === p).length,
}));
const phaseTotals = PROJECT_STATUS_VALUES.map((s) => cip.records.filter((r) => r.status === s.id).length);
const forbiddenCount = matrixRows.reduce((n, r) => n + r.cells.filter((c) => c.forbidden).length, 0);
const zeroCount = matrixRows.reduce((n, r) => n + r.cells.filter((c) => !c.forbidden && c.v === 0).length, 0);
const filledCount = matrixRows.reduce((n, r) => n + r.cells.filter((c) => !c.forbidden && c.v > 0).length, 0);


/** Read off the registry rather than typed, so a rename in the product breaks the board. */
const PROV = S.vocab.registry
  .filter((d) => d.lensId === 'public-works')
  .map((d) => ({ domainId: d.id, kind: d.gatedBy, recordType: d.recordType }));
if (PROV.length !== 2) throw new Error('public-works now has ' + PROV.length + ' registered regions; re-derive this design');

const FOOT_DEMO = 'template-city &middot; demo pack<br>10 of 11 registered domains read<br>badges outside this lens are the shipped values at f776b4bf';
const FOOT_LIVE = 'bastrop_tx &middot; staging pack<br>2 regions, both granted and wired<br>badges outside this lens are the shipped values at f776b4bf';
const FOOT_EMPTY = 'empty-city &middot; generates nothing<br>0 adapters granted<br>badges outside this lens are the shipped values at f776b4bf';

const REGIONS_DEMO = [
  { n: 'Capital projects', c: cip.recordCount + ' projects', b: 'Demo records' },
  { n: 'Call analytics', c: calls.recordCount + ' buckets', b: 'Demo records' },
];

/* ---------------------------------------------------------------- board 1 */

const main = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  pwBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city',
  pageRule: cip.countingRule,
  lede: 'Capital projects and call handling. Two regions, two units: a project is one row, a call figure is one bucket per queue per relative day. Each region states its own source and its own counting rule, and this lens prints no figure of money at all.',
  tiles: [
    ...PROJECT_STATUS_VALUES.map((s) => ({
      k: s.label, v: cip.extras.metrics.find((m) => m.id === s.id).count,
      tone: TONE[s.id], n: 'of ' + cip.recordCount + ' projects',
    })),
    { k: 'Behind schedule', v: cip.extras.schedule.behind, tone: '--sc-crit', n: 'of ' + cip.extras.schedule.measured + ', measured' },
    { k: 'On or ahead', v: cip.extras.schedule.onOrAhead, tone: '--sc-ok', n: 'of ' + cip.extras.schedule.measured + ', measured' },
  ],
  regions: REGIONS_DEMO, activeRegion: 'Capital projects',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column;">\n' +
panel({
  grow: true, title: 'Capital projects', sub: 'cip-projects &middot; one row per project',
  demo: true, contract: 'Reporting output contract',
  basis: 'Sorted by severity, then by schedule. Basis: ' + cip.basis + '. Counting rule: ' + cip.countingRule + '. The shipped table declares a COMPLETION column; a generated record has no completion field, so the column is absent here rather than blank, because a blank cell in a percent column reads as zero percent complete.',
  basisWidth: 118,
},
  table({
    cols: '104px minmax(0,1.25fr) 88px minmax(0,1.7fr) 118px 98px',
    head: ['Project', 'Subject', 'Phase', 'Place', 'Schedule', 'Status'],
    rows: cipRows,
  }) + '\n' + pager(PAGE + ' of ' + cip.recordCount + ' projects')) + '\n' +
'          </div>\n' +
'          <div style="width:500px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
panel({
  title: 'Phase against status', sub: 'the second axis',
  basis: forbiddenCount + ' cells cannot occur, ' + zeroCount + ' are a measured zero, ' + filledCount + ' carry a count. STATUS_PHASES declares which phases each status may sit in.',
  basisWidth: 70,
}, matrix({ statuses: matrixStatuses, rows: matrixRows, colTotals: phaseTotals, grand: cip.recordCount })) + '\n' +
panel({
  title: 'No money on this lens', sub: 'and that is the design',
  basis: 'Basis: ' + cip.extras.budgetBasis + '.',
  basisWidth: 70,
}, '') + '\n' +
panel({
  title: 'Flood and drainage', sub: 'modelled, not the regulatory zone', chip: 'Preview',
  right: 'Mounts in Full &middot; _design/smartcity-flood-study',
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><span style="display:inline-flex; align-items:center; gap:6px; font:500 13px/18px var(--sc-font-ui); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-control); padding:5px 12px;">Open on the map' + ARROW + '</span></div>') + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 2 */

const queueRows = calls.extras.queues.map((q) => ({
  ref: q.queueRef, label: q.queueLabel, total: q.callsOffered,
  cells: calls.records.filter((r) => r.queueRef === q.queueRef)
    .sort((a, b) => a.dayOffset - b.dayOffset).map((r) => r.callsOffered),
}));
const maxCell = Math.max(...calls.records.map((r) => r.callsOffered));
const zeroAbandon = calls.records.filter((r) => r.callsAbandoned === 0);

const callsBoard = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  pwBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city',
  pageRule: calls.countingRule,
  lede: 'The record here is not an event. One bucket per queue per relative day, so the two tables the product renders are the two margins of one grid, and the only property worth showing is that they agree.',
  tiles: [
    { k: 'Offered', v: calls.extras.totals.callsOffered, n: 'over ' + calls.extras.totals.measured + ' buckets' },
    { k: 'Answered', v: calls.extras.totals.callsAnswered, tone: '--sc-ok', n: 'drawn independently' },
    { k: 'Abandoned', v: calls.extras.totals.callsAbandoned, tone: '--sc-warn', n: 'drawn independently' },
    { k: 'Buckets', v: calls.extras.totals.measured, n: '5 queues &times; 5 relative days' },
    { k: 'Answer rate', unread: true, word: 'Refused', n: 'never without both figures' },
    { k: 'Individual calls', unread: true, word: 'Excluded', n: 'excluded, with a basis' },
  ],
  regions: REGIONS_DEMO, activeRegion: 'Call analytics',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
panel({
  title: 'Offered', sub: 'call-analytics &middot; one bucket per queue per relative day',
  demo: true, contract: 'Phone output contract', right: 'Row margin = queue. Column margin = day.',
  basis: 'Counting rule: ' + calls.extras.totals.countingRule + '. Both margins sum to ' + calls.extras.totals.callsOffered + '; the product renders them as two separate tables, and two tables that must agree and are never shown agreeing is a reconciliation nobody performs. No calendar date is printed anywhere: ' + calls.records[0].provenance.readAtBasis + '.',
  basisWidth: 130,
}, heat({
  days: calls.extras.daily.map((d) => d.dayLabel),
  rows: queueRows,
  dayTotals: calls.extras.daily.map((d) => d.callsOffered),
  grand: calls.extras.totals.callsOffered,
  max: maxCell,
})) + '\n' +
panel({
  title: 'A queue is a function', sub: 'never a desk, and this grid names nobody',
  basis: 'Basis: ' + calls.records[0].identityBasis + '.',
  basisWidth: 130,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3); display:flex; gap:var(--sc-6); flex-wrap:wrap;">\n' +
calls.extras.queues.map((q) =>
'            <span style="display:flex; align-items:baseline; gap:7px; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);"><span style="font-family:var(--sc-font-data); font-size:11px; color:var(--sc-ink-3);">' + q.queueRef + '</span>' + q.queueLabel + '</span>').join('\n') + '\n          </div>') + '\n' +
'          </div>\n' +
'          <div style="width:500px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  title: 'Excluded, not absent', sub: 'three families', chip: 'Unread',
  basis: calls.extras.excludedFamilies + '.',
  basisWidth: 82,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-2);">\n' +
[['recording', 'the audio of a call'], ['callerRef', 'who placed it'], ['extensionOwner', 'which person answers a line']].map((r, i) =>
'            <div style="display:grid; grid-template-columns:132px minmax(0,1fr); gap:var(--sc-3); padding:7px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-crit);">' + r[0] + '</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[1] + '</span></div>').join('\n') + '\n          </div>') + '\n' +
panel({
  title: 'A zero here is a reading', sub: 'not an empty cell',
  basis: zeroAbandon.length + ' of ' + calls.extras.totals.measured + ' buckets carry an abandoned count of exactly zero (' + zeroAbandon.map((r) => r.queueRef + ' ' + r.dayLabel).join(', ') + '): measured, and nothing abandoned. An unmeasured bucket carries no reading at all, and neither renders as the other.',
  basisWidth: 82,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Answered and abandoned are each drawn from the sequence and offered is their sum, so neither is the remainder of the other and a disagreement would be a finding rather than an impossibility.</p></div>') + '\n' +
panel({
  title: 'What live can supply', sub: 'read before building', chip: 'Partial',
  basis: 'composeRealCallAnalytics maps ONE aggregate record, all queues, today. Shipping this grid without saying so promises staff a breakdown the vendor does not expose.',
  basisWidth: 82,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">The live record also carries an answer rate straight from the vendor, which the generated record deliberately refuses. One product, two paths, opposite rules.</p></div>') + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 3 */

const blockedBoard = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  pwBadge: 'Not read', pageBadge: 'Not read', foot: FOOT_LIVE,
  prov: PROV, pack: 'bastrop_tx',
  pageRule: 'Two regions, two different obstacles',
  lede: 'Both regions on this lens are built, granted and wired to a live feed. One vendor answers and one declines, and the reason each is where it is is not the same kind of reason. A page that said only "not read" would have made them look identical.',
  regions: [
    { n: 'Capital projects', c: 'granted', b: 'Unread' },
    { n: 'Call analytics', c: 'declined', b: 'Not connected' },
  ],
  activeRegion: 'Capital projects',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
panel({
  title: 'Capital projects', sub: 'cip-projects &middot; gatedBy powerbi', chip: 'Unread',
  basis: 'Basis: the fixture seam answers ' + JSON.stringify(S.staging.cip.basis) + ' on this pack, and the server branches to the live composer instead (REAL_LIVE_DOMAINS, src/server.mjs). No live read was performed by this design and no credential was used, so the count is UNREAD rather than a number.',
  basisWidth: 116,
}, blocked({
  region: 'A vendor that answers', domainId: 'cip-projects', kind: 'powerbi',
  state: 'Reading, recorded', tone: '--sc-ok', wash: '--sc-ok-wash',
  facts: [
    ['Obstacle', 'None recorded. This is the one region on the lens with a vendor that returns data.'],
    ['Records', 'Unread by this design. A count belongs to a live read, not to a canvas.', true],
    ['Last read', '2026-09-03, recorded in the src/vendor-live.mjs module header. Not re-read on 2026-09-15.', true],
    ['If it reads', 'The register above fills with real projects. The recordId becomes the project NAME (mapRealCipProjectRecord), so the Project and Subject columns collapse into one and the table needs a different first column.'],
  ],
  basis: 'Design rule: a board may render a recorded reading, badged with its date and its source file. It may not render a recorded reading as a current one.',
})) + '\n' +
panel({
  title: 'Call analytics', sub: 'call-analytics &middot; gatedBy goto', chip: 'Not connected',
  basis: 'Basis: composeRealCallAnalytics returns status unavailable carrying the vendor route’s own error, asserted as goto_not_authorized with needsAuth true in src/vendor-live.test.mjs. The module header records the reason: the consent flow has never been completed by a human.',
  basisWidth: 116,
}, blocked({
  region: 'A vendor that declines', domainId: 'call-analytics', kind: 'goto',
  state: 'unavailable', tone: '--sc-warn', wash: '--sc-warn-wash',
  facts: [
    ['Basis', 'goto_not_authorized &middot; needsAuth true', true],
    ['Obstacle kind', 'A CONSENT. Not an engineering task, not a build, not a bug.'],
    ['Who moves it', 'The city’s phone-system administrator, by role. No person is named on this page.'],
    ['Last read', '2026-09-03, recorded in the src/vendor-live.mjs module header. Not re-read on 2026-09-15.', true],
  ],
  basis: 'The four facts are the component: a region that cannot show data states its state, its basis verbatim, what KIND of thing would move it, and when that was last read. "Not read" alone is the sentence this product has been paying for.',
})) + '\n' +
'          </div>\n' +
'          <div style="width:500px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
panel({
  title: 'Three obstacles', sub: 'three kinds, across this lane',
  basis: 'Basis: src/vendor-live.mjs module header, live-verified 2026-09-03 and recorded there; src/domains.mjs for the vendorless finding. Each is a claim about its stated date. Re-run the instrument before quoting.',
  basisWidth: 62,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
[
  ['Public works &middot; calls', 'A consent nobody has given', '--sc-warn'],
  ['Fire and EMS &middot; apparatus', 'An entitlement the credential lacks', '--sc-warn'],
  ['Parks', 'A source that does not exist', '--sc-crit'],
].map((r, i) =>
'            <div style="display:grid; grid-template-columns:200px minmax(0,1fr); gap:var(--sc-3); padding:8px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[0] + '</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(' + r[2] + ');">' + r[1] + '</span></div>').join('\n') + '\n          </div>') + '\n' +
panel({
  title: 'Naming the vendor', sub: 'a change, flagged',
  basis: 'The shipped panel chip says "Reporting output contract" and "Phone output contract" and names no vendor; vendors are named on Connections. These cards name them, because a member of staff looking at their own empty page needs to know whose credential is missing. Raised in the folder README, not settled here.',
  basisWidth: 62,
}, '') + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 4 */

const emptyBoard = artboard({
  city: 'Empty city', seal: 'EC', env: 'DEMO', theme: 'dark',
  pwBadge: 'Empty', pageBadge: 'Empty', foot: FOOT_EMPTY,
  prov: PROV, pack: 'empty-city',
  pageRule: 'Both regions built. Neither has a source.',
  lede: 'A city that has granted nothing. Both regions of this lens exist and are built, and the sentence each one prints says exactly that, because the alternative sentence belongs to Parks.',
  regions: [
    { n: 'Capital projects', c: '0 records', b: 'Empty' },
    { n: 'Call analytics', c: '0 records', b: 'Empty' },
  ],
  activeRegion: 'Capital projects',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
panel({
  title: 'Capital projects', sub: 'cip-projects &middot; gatedBy powerbi', chip: 'Empty',
  basis: 'Basis, verbatim from the composer: ' + S.unconnected.cip.basis + '. Counting rule: ' + S.unconnected.cip.countingRule + '.',
  basisWidth: 116,
}, stateBlock({
  k: 'Region built, no source',
  h: 'The capital projects register has not been read for this city.',
  p: 'The region exists. What is absent is a source, and the sentence says which. A city reading this knows it needs a grant, not a build.',
  b: 'status: ' + S.unconnected.cip.status + ' &middot; granted: ' + S.unconnected.cip.granted + ' &middot; generated: ' + S.unconnected.cip.generated,
})) + '\n' +
panel({
  title: 'Call analytics', sub: 'call-analytics &middot; gatedBy goto', chip: 'Empty',
  basis: 'Basis, verbatim from the composer: ' + S.unconnected.calls.basis + '.',
  basisWidth: 116,
}, stateBlock({
  k: 'Region built, no source',
  h: 'Call handling has not been read for this city.',
  p: 'Same state, same sentence, a different region. Two regions in one state is a coincidence of this pack, not a property of the lens, so each one still prints its own basis.',
  b: 'status: ' + S.unconnected.calls.status + ' &middot; granted: ' + S.unconnected.calls.granted + ' &middot; generated: ' + S.unconnected.calls.generated,
})) + '\n' +
'          </div>\n' +
'          <div style="width:500px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
panel({
  title: 'The five states', sub: 'four in code, one with no entry',
  basis: 'Basis: DOMAIN_STATUSES in src/fixture-seam.mjs carries the first four. The fifth has no entry there on purpose, quoted from that file: ' + JSON.stringify(S.states.fifthStateBasis) + '.',
  basisWidth: 62,
}, stateLegend()) + '\n' +
panel({
  title: 'Where Parks sits', sub: 'the line this lens is one side of',
  basis: 'Basis: composeDomainById(pack, "parks-facilities") returns ' + JSON.stringify('not-registered') + ' on every pack. The Parks lens is designed at _design/smartcity-parks-lens and the two sentences are drawn side by side there.',
  basisWidth: 62,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Every panel on this board says the region is BUILT. Parks may not borrow one word of it. A city that reads "has not been read" on Parks would be waiting for a grant that no vendor exists to give.</p></div>') + '\n' +
'          </div>\n        </div>',
});

/* --------------------------------------------------------------- emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Calls.dc.html', import.meta.url), callsBoard);
fs.writeFileSync(new URL('./Blocked.dc.html', import.meta.url), blockedBoard);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), emptyBoard);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Capital projects — a matrix with forbidden cells' },
    { file: 'Calls.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Call analytics — one grid, two margins' },
    { file: 'Blocked.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'The live pack — one vendor answers, one declines' },
    { file: 'Empty.dc.html', x: 5160, y: 0, w: 1600, h: 1040, title: 'An unconnected city — built, and no source' },
  ],
  annotations: [
    { id: 'two-units', x: 0, y: -300, w: 700, text: 'TWO REGIONS OF DIFFERENT UNITS, AND THAT IS THE LENS.\nsrc/domains.mjs registers exactly two domains under lensId public-works: cip-projects (Capital projects, gatedBy powerbi) and call-analytics (Call analytics, gatedBy goto).\nA capital project is one row per project. A call figure is one bucket per queue per relative day, and the domain says so in its own words: "this domain is the one whose RECORD IS NOT AN EVENT".\nThe product stacks both on one page. They switch here instead, reusing the DS tab pattern, because a 16-row register above a 25-bucket grid puts the second region below the fold and the staff who live in call handling never reach their own page. PROPOSED CHANGE, stated in the README.' },
    { id: 'matrix', x: 760, y: -300, w: 700, text: 'FOUR STATES IN ONE GRID.\nSTATUS_PHASES in src/domains/cip-projects.mjs declares which phases each status may sit in: a complete project is in closeout and nothing else, a stalled one is anywhere except closeout.\nSo eight of the twenty cells CANNOT OCCUR BY RULE, four are a measured zero, and eight carry a count. Drawing the eight forbidden cells as zeros would put eight invented readings into a grid and make the register look like it has holes in it.\nAbsent, zero and unmeasured are three different states. This grid needs a fourth.' },
    { id: 'money', x: 1520, y: -300, w: 640, text: 'NO FIGURE OF MONEY APPEARS ON THIS LENS AT ALL.\nA capital improvement register is a budget document everywhere else. This one carries no budget, no spend, no percent of budget and no encumbrance, and the domain states the refusal rather than leaving an omission:\n"a money number beside a city name is a claim about that city\u0027s finances".\nsrc/adapters.mjs declares budget on the reporting shape as a field a generated record never carries. check.mjs refuses a money token on any board in this folder.' },
    { id: 'margins', x: 2220, y: -300, w: 700, text: 'THE TWO TABLES ARE TWO MARGINS OF ONE GRID.\nThe product renders "By queue" and "By relative day" as separate tables. They are not two datasets: they are the row margin and the column margin of the same 25 buckets, and both sum to 2,365.\nTwo numbers that should agree and are never shown agreeing is a reconciliation nobody performs. Drawn once, with both margins and the corner total, the agreement is the visible property.\nOne bucket carries an abandoned count of exactly ZERO. That is a reading, not an empty cell.' },
    { id: 'cutover', x: 2980, y: -300, w: 680, text: 'THE GRID DOES NOT SURVIVE THE CUTOVER, AND THE BOARD SAYS SO.\ncomposeRealCallAnalytics in src/vendor-live.mjs maps ONE aggregate record: all queues, today. The 5x5 grid is a property of the generated pack.\nA design that shipped the grid silently would promise staff a per-queue breakdown the live vendor does not expose.\nThe live record also carries answerRate straight from the vendor, which the generated record deliberately refuses ("a ratio without its denominator beside it"). One product, two paths, opposite rules. Raised in the README.' },
    { id: 'obstacle', x: 3440, y: -300, w: 720, text: 'THE OBSTACLE IS NAMED, AND SO IS ITS KIND.\nBoth regions are built, granted and wired to a live feed through REAL_LIVE_DOMAINS. One vendor answers and one declines, and the reasons are not the same kind of reason: a recorded 2026-09-03 reading has Power BI returning data and GoTo returning goto_not_authorized because a human has never completed the consent flow.\nSo the blocked card states four things and never fewer: the state, the basis VERBATIM, what KIND of thing would move it, and when it was last read.\nAcross this lane: a consent, an entitlement, and a source that does not exist. Three lenses, three obstacles, three kinds.' },
    { id: 'recorded', x: 4220, y: -300, w: 640, text: 'A RECORDED READING IS NOT A CURRENT ONE.\nNo live probe was run for this design and no credential was used. The 2026-09-03 states are badged RECORDED with their date and their source file, and the record count renders UNREAD rather than as a number.\nA canvas that printed a count would be asserting a live read it never performed. Unmeasured is its own state, including when the thing unmeasured is our own claim.' },
    { id: 'built', x: 5160, y: -300, w: 700, text: 'EVERY PANEL HERE SAYS THE REGION IS BUILT.\nOn an unconnected city both regions print the composer\u0027s own sentence, verbatim: "empty-city generates no records and no adapter is granted on it".\nThat sentence is the one Parks may not borrow. It tells a city it needs a GRANT. Parks needs a vendor to exist first, and a city waiting for a grant that nobody can give is the exact confusion ruling 1 was written to end.\nThe five-state legend is the bridge: four states live in DOMAIN_STATUSES, and the fifth has no entry there on purpose.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Calls, Blocked, Empty + canvas.json');
console.log('  capital projects: ' + cip.recordCount + ' records, ' + PAGE + ' rendered');
console.log('  matrix: ' + filledCount + ' counts, ' + zeroCount + ' measured zeros, ' + forbiddenCount + ' cannot-occur, grand ' + cip.recordCount);
console.log('  calls: ' + calls.recordCount + ' buckets, both margins sum to ' + calls.extras.totals.callsOffered);
