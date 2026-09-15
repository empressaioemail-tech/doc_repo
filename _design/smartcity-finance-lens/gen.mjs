import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/**
 * The v2 Finance lens.
 *
 * Designed against two sources read directly, never from memory:
 *
 *   capture-figures.json   the v1 live Finance tab, 25 pages, supplied by the
 *                          operator 2026-09-15. Every figure cited by page.
 *   smartcity-dashboards   origin/main f776b4bf, web/index.html:892-938, the
 *                          v2 lens as it ships: a well built refusal with a
 *                          four-source register and no metric strip.
 *
 * OPERATOR RULING, 2026-09-15, and it is the brief. Removing v1's fabrications
 * is NOT the product. It is the gap analysis that tells us what to fill in.
 * So this design carries the lens at its FULL SHAPE, with every cell either
 * measured or countably unaccounted, and names what has to land to fill each
 * one. A missing column is invisible; an unaccounted cell is countable.
 */
const FIG = JSON.parse(fs.readFileSync(new URL('./capture-figures.json', import.meta.url), 'utf8'));

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/**
 * FOUR STATES, and they are not interchangeable. Absent, zero and unmeasured
 * are three different things and this lens is where collapsing them does the
 * most damage, because a fabricated zero enters an average without announcing
 * that it was invented.
 */
const STATE = {
  MEASURED: ['var(--sc-ok)', 'var(--sc-ok-wash)', 'Read from a source, carrying that source and the date it was read.'],
  UNACCOUNTED: ['var(--sc-ink-3)', 'var(--sc-quiet-wash)', 'The cell exists and nothing has been acquired for it. Legitimate at rest, fatal at publish.'],
  REFUSED: ['var(--sc-warn)', 'var(--sc-warn-wash)', 'A derived figure whose input is unaccounted. Not a zero, not a blank.'],
  CONFLICT: ['var(--sc-crit)', 'var(--sc-crit-wash)', 'Two independently derived readings disagree. The disagreement is the output.'],
  PARTIAL: ['var(--sc-restricted)', 'var(--sc-restricted-wash)', 'Some of the record reads and the rest does not, and the split is named.'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = STATE[t] || STATE.UNACCOUNTED;
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const LENSES = [
  ['Overview', ''], ['Development services', ''], ['Finance', ''],
  ['Citizen', ''], ['Public works', ''], ['Parks', ''],
  ['Police', ''], ['Fire and EMS', ''], ['Fleet', ''],
];

const navRow = (n, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span></div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', LENSES.map((l) => navRow(l[0], l[0] === 'Finance'))) + '\n' +
  navGroup('Work', ['Plan review', 'Files', 'Records search'].map((r) => navRow(r, false))) + '\n' +
  navGroup('City', ['Assets', 'Connections', 'People and access'].map((r) => navRow(r, false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = () =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Bastrop, TX</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX &middot; Finance</span>\n      </div>\n    </header>';

const panel = (o) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
(o.sub ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' : '') +
'            <div style="flex:1;"></div>\n' + (o.badge ? '            ' + badge(o.badge) + '\n' : '') +
(o.right ? '            ' + o.right + '\n' : '') +
'          </div>\n' + o.body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:118ch;">' + o.basis + '</span></div>\n' : '') +
'        </section>';

/** The four-cell shape strip. The whole argument of the lens in one row. */
const shapeStrip = (cells) =>
'        <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:var(--sc-3);">\n' +
cells.map((c) => {
  const [col] = STATE[c.state];
  return '          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:6px; min-width:0; box-shadow:var(--sc-e1); border-top:2px solid ' + col + ';">' +
    '<div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="flex:1; min-width:0; font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + c.k + '</span>' + badge(c.state) + '</div>' +
    '<div style="font:' + (c.big ? '400 22px/28px var(--sc-font-data)' : '620 15px/28px var(--sc-font-ui)') + '; color:var(' + (c.big ? '--sc-ink' : '--sc-ink-3') + ');">' + c.v + '</div>' +
    '<div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + c.sub + '</div></div>';
}).join('\n') + '\n        </div>';

const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h, i) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); ' + (i ? 'text-align:right;' : '') + ' overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:8px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  const cell = (c && typeof c === 'object') ? c : { t: c };
  const tone = cell.tone || (i === 0 ? '--sc-ink' : '--sc-ink-2');
  const mono = i > 0 || cell.mono;
  return '              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; ' + (i ? 'text-align:right;' : '') + ' font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; font-variant-numeric:tabular-nums; color:var(' + tone + ');">' + cell.t + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

/** A figure the lens declines to print, with the reason in place of the number. */
const refusal = (o) =>
'          <div style="display:flex; align-items:flex-start; gap:var(--sc-4); padding:var(--sc-4);">\n' +
'            <div style="flex:none; width:210px; display:flex; flex-direction:column; gap:var(--sc-1);">' +
'<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + o.k + '</div>' +
'<div style="font:620 17px/24px var(--sc-font-ui); letter-spacing:-.008em; color:var(' + (o.tone || '--sc-warn') + ');">' + o.v + '</div></div>\n' +
'            <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-1);">' +
'<div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:96ch;">' + o.why + '</div>' +
(o.detail ? '<div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); margin-top:2px; max-width:112ch;">' + o.detail + '</div>' : '') +
'</div>\n          </div>';

/** What v1 draws, shown as the thing being replaced. Never our own output. */
const v1Box = (o) =>
'          <div style="margin:var(--sc-3) var(--sc-4) var(--sc-4); border:1px dashed var(--sc-crit); border-radius:var(--sc-r); background:var(--sc-crit-wash); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-crit);">What v1 prints here</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.cite + '</span></div>\n' +
'            <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink); max-width:104ch;">' + o.what + '</div>\n' +
(o.verbatim ? '            <div style="font:400 13px/19px var(--sc-font-data); color:var(--sc-ink-2); border-left:2px solid var(--sc-crit); padding-left:var(--sc-3); max-width:108ch;">' + o.verbatim + '</div>\n' : '') +
'          </div>';

/** The acquisition ledger row: state, what it unlocks, what must land, who acts. */
const gapRow = (g) =>
'            <div style="display:grid; grid-template-columns:186px 112px minmax(0,1.15fr) minmax(0,1.25fr) 150px; gap:var(--sc-4); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:start;">\n' +
'              <div style="display:flex; flex-direction:column; gap:2px;"><span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + g.n + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + g.sub + '</span></div>\n' +
'              <div>' + badge(g.state) + '</div>\n' +
'              <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + g.unlocks + '</span>\n' +
'              <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + g.lands + '</span>\n' +
'              <span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">' + g.who + '</span>\n            </div>';

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar() + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX / Finance' + (o.crumb ? ' / ' + o.crumb : '') + '</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + badge(o.pageBadge) + '</div>\n' +
'        <p style="margin:0; max-width:104ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
o.body + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"dark"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "dark") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

const FOOT_TODAY = '1 of 4 finance sources reading<br>3 unaccounted, 0 fabricated<br>bastrop_tx';
const UNACC = { t: 'Unaccounted', tone: '--sc-ink-3' };
const REF = { t: 'Refused', tone: '--sc-warn' };

/* ========================================================== 1. the lens today */

const main = artboard({
  h1: 'Finance', pageBadge: 'PARTIAL', foot: FOOT_TODAY,
  lede: 'One of the four sources this lens requires is reading. The other three are unaccounted, which is a countable state and not a zero. Every cell this lens will ever hold exists on this page already, because a field that appears only once something writes it is a field no gap analysis can find.',
  body:
    shapeStrip([
      { k: 'Adopted budget', state: 'MEASURED', big: true, v: FIG.adoptedBudget.expenses.total, sub: FIG.adoptedBudget.fundCount + ' funds &middot; ' + FIG.adoptedBudget.departmentCount + ' departments &middot; OpenGov ERP' },
      { k: 'Fund ledger', state: 'UNACCOUNTED', v: 'Nothing acquired', sub: 'Actuals against appropriation, by period' },
      { k: 'Permit fee revenue', state: 'CONFLICT', v: 'Two readings disagree', sub: 'Fees assessed and collected, joined to the case' },
      { k: 'Department spend', state: 'UNACCOUNTED', v: 'Nothing acquired', sub: 'Purchase and payroll detail by department' },
    ]) + '\n' +
    '        <div style="display:grid; grid-template-columns:minmax(0,1.32fr) minmax(0,1fr); gap:var(--sc-4); flex:1; min-height:0;">\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Appropriation by fund', badge: 'MEASURED', sub: FIG.connectedSource.budgetSelected,
      body: table({
        cols: 'minmax(0,1fr) 120px 128px',
        head: ['Fund', 'Appropriation', 'Actuals'],
        rows: FIG.funds.rows.slice(0, 8).map((f) => [f.name, f.amount, UNACC]),
      }),
      basis: 'Basis: ' + FIG.connectedSource.headerVerbatim + '. Fifteen funds are appropriated and eight are drawn here. The actuals column exists on every row and holds nothing, because the fund ledger has not been acquired. It is not $0 and it is not blank.',
    }) + '\n' +
    panel({
      title: 'What does not reconcile yet', badge: 'CONFLICT',
      body: refusal({
        k: 'Fund total', v: 'Refused', tone: '--sc-crit',
        why: 'The fifteen appropriated funds sum to materially more than the stated total budget, so the lens declines to print a fund total until the two agree or the counting rule is declared.',
        detail: 'Read from the capture: fund rows sum to roughly $128M against a stated total budget of ' + FIG.adoptedBudget.expenses.total + '. A sum that is close to double its own total is a counting-rule question, not a rounding one. v1 prints both figures on adjacent screens and never compares them.',
      }),
      basis: 'Basis: two figures derived from the same connected source that do not agree. Printing either alone would be choosing which one to believe without saying so.',
    }) + '\n' +
    '          </div>\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'What this lens reads', sub: 'source register',
      body: '          <div style="display:flex; flex-direction:column;">\n' +
        FIG.v2Skeleton.requiredSources.map((s, i) => {
          const st = ['MEASURED', 'UNACCOUNTED', 'CONFLICT', 'UNACCOUNTED'][i];
          return '            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:10px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
            '<span style="flex:none; width:3px; height:26px; border-radius:2px; background:' + STATE[st][0] + ';"></span>' +
            '<span style="flex:1; min-width:0; display:flex; flex-direction:column;"><b style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + s.name + '</b>' +
            '<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + s.sub + '</span></span>' + badge(st) + '</div>';
        }).join('\n') + '\n          </div>',
      basis: 'The shipped lens carries this register already and counts 0 of 4. Bastrop reads one, so the count is 1 of 4 and the register is the thing that makes the other three countable.',
    }) + '\n' +
    panel({
      grow: true,
      title: 'Why there is no metric strip', sub: 'and why that is the point',
      body: '          <div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
        '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">The shipped lens says it in one line and it is the right line:</p>\n' +
        '            <div style="font:400 15px/22px var(--sc-font-ui); color:var(--sc-ink); border-left:2px solid var(--sc-accent); padding-left:var(--sc-4);">' + FIG.v2Skeleton.ledeVerbatim + '</div>\n' +
        '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">A header of four confident numbers is what v1 does, and three of its four are not measurements. The strip above is four <i>states</i>, not four figures, so the page is readable at a glance without any of it being a claim about money.</p>\n          </div>',
    }) + '\n' +
    '          </div>\n        </div>',
});

/* ================================================= 2. where v1 fabricates */

const departments = artboard({
  h1: 'Departments', crumb: 'Departments', pageBadge: 'UNACCOUNTED', foot: FOOT_TODAY,
  lede: 'Appropriation is read and actuals are not, so burn rate and variance are refused rather than computed. This is the single region where v1 does the most damage, and the damage is not subtle.',
  body:
    '        <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:var(--sc-3);">\n' +
    [
      { k: 'Appropriations read', v: String(FIG.adoptedBudget.departmentCount), sub: 'of ' + FIG.adoptedBudget.departmentCount + ' departments', tone: '--sc-ok' },
      { k: 'Actuals acquired', v: '0', sub: 'of ' + FIG.adoptedBudget.departmentCount + ' departments', tone: '--sc-ink-3' },
      { k: 'Burn rate computed', v: '0', sub: 'refused for ' + FIG.adoptedBudget.departmentCount + ' of ' + FIG.adoptedBudget.departmentCount, tone: '--sc-warn' },
      { k: 'Figures invented', v: '0', sub: 'the number that matters', tone: '--sc-ok' },
    ].map((m) =>
      '          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:2px; box-shadow:var(--sc-e1);">' +
      '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</div>' +
      '<div style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + m.tone + ');">' + m.v + '</div>' +
      '<div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + m.sub + '</div></div>').join('\n') + '\n        </div>\n' +
    panel({
      grow: true,
      title: 'Appropriation against actuals', badge: 'UNACCOUNTED', sub: FIG.connectedSource.budgetSelected,
      body: table({
        cols: 'minmax(0,1fr) 116px 124px 112px 96px',
        head: ['Department', 'Appropriation', 'Actuals', 'Variance', 'Burn'],
        rows: FIG.departmentAnalyzer.rows.map((r) => [r.department, r.budget, UNACC, REF, REF]),
      }) +
      v1Box({
        cite: 'capture pages 11 and 12',
        what: 'The same ten rows, with Actual Spent identical to Budget on every one and burn rate 100% across the board. Actual Spent is the Budget column copied. The product knows, and says so on this one sub-tab, then consumes the figures as measured everywhere else:',
        verbatim: FIG.departmentAnalyzer.insightVerbatim + '<br><br>And then, derived from that fabricated equality: &ldquo;' + FIG.departmentAnalyzer.alarmVerbatim + '&rdquo;',
      }),
      basis: 'Basis: appropriations counted from the connected budget source, one row per department. Actuals are unaccounted on every row, so variance and burn have no input and are refused. A refusal is a countable state; a 100% that was never measured is not.',
    }),
});

/* ========================================= 3. the reconciliation that refuses */

const permitRevenue = artboard({
  h1: 'Permit fee revenue', crumb: 'Permit fee revenue', pageBadge: 'CONFLICT', foot: FOOT_TODAY,
  lede: 'Fees are recorded on permit cases, so this column exists. Two independently derived readings of it disagree, and the disagreement is the output. It is not a revenue figure until a ledger confirms collection.',
  body:
    '        <div style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.25fr); gap:var(--sc-3);">\n' +
    [
      { k: 'Charged', v: FIG.permitRevenue.overview.totalFeesCharged, sub: 'assessed on permit cases &middot; ' + FIG.permitRevenue.overview.totalFeesChargedLabel, tone: '--sc-ink' },
      { k: 'Collected', v: FIG.permitRevenue.overview.totalCollected, sub: 'recorded against those cases', tone: '--sc-ink' },
      { k: 'Collection rate', v: 'Refused', sub: 'collected exceeds charged, which is not a reachable state', tone: '--sc-crit' },
    ].map((m) =>
      '          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:2px; box-shadow:var(--sc-e1);">' +
      '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</div>' +
      '<div style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + m.tone + ');">' + m.v + '</div>' +
      '<div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + m.sub + '</div></div>').join('\n') + '\n        </div>\n' +
    '        <div style="display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); gap:var(--sc-4); flex:1; min-height:0;">\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      grow: true,
      title: 'Where the disagreement sits', badge: 'CONFLICT',
      body: table({
        cols: 'minmax(0,1fr) 128px 128px 92px',
        head: ['Department', 'Charged', 'Collected', 'Permits'],
        rows: FIG.permitRevenue.earlierPageRows.map((r) => [
          r.department,
          r.charged,
          { t: r.collected, tone: r.department === 'Unassigned' ? '--sc-crit' : '--sc-ink-2' },
          String(r.permits),
        ]),
      }),
      basis: 'Basis: one partition carries the whole surplus. Unassigned is read as collecting $450.9M against $170.9M charged, roughly $280M of unattributed collection, and it is the second largest line. A partition named Unassigned holding the defect is the signal, not a coincidence.',
    }) + '\n          </div>\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Three refusals, three reasons', badge: 'REFUSED',
      body:
        refusal({ k: 'Collection rate', v: 'Refused', tone: '--sc-crit', why: 'Collected exceeds charged. The ratio is arithmetically computable and semantically impossible, so it is not printed.', detail: 'v1 prints ' + FIG.permitRevenue.overview.collectionRate + ' in green with a success mark, capture page 23.' }) +
        '          <div style="height:1px; background:var(--sc-line-faint); margin:0 var(--sc-4);"></div>\n' +
        refusal({ k: 'Permit count', v: 'Refused', tone: '--sc-warn', why: 'Three different totals exist for the same population and none is declared canonical.', detail: 'Header reads 1,877. Department rows sum to 3,138 on one capture page and 4,052 on another, and Building Department is 1,055 permits on one and 1,970 on the other.' }) +
        '          <div style="height:1px; background:var(--sc-line-faint); margin:0 var(--sc-4);"></div>\n' +
        refusal({ k: 'Revenue', v: 'Not a revenue figure', tone: '--sc-ink-3', why: 'A fee recorded on a case is an assessment. It becomes revenue when a ledger confirms collection, and no ledger has been acquired.', detail: 'This is why the register marks permit fee revenue Partial rather than showing it as revenue. The shipped lens already says so.' }),
      basis: 'Basis: each refusal names the input it lacks. None of the three is rendered as a zero, because a zero would enter an average without announcing that it was invented.',
    }) + '\n          </div>\n        </div>',
});

/* ======================================== 4. what it looks like when filled */

const connected = artboard({
  h1: 'Finance', crumb: 'once the fund ledger lands', pageBadge: 'MEASURED', foot: '4 of 4 finance sources reading<br>0 unaccounted<br>bastrop_tx',
  lede: 'NOT TODAY. This is the same lens with the fund ledger and department spend acquired, drawn so the acquisition work has a target. Every figure carries the source that produced it and the date it was read, and the cells that were unaccounted on the first artboard are the cells that fill.',
  body:
    shapeStrip([
      { k: 'Adopted budget', state: 'MEASURED', big: true, v: FIG.adoptedBudget.expenses.total, sub: 'appropriated &middot; OpenGov ERP &middot; read today' },
      { k: 'Fund ledger', state: 'MEASURED', big: true, v: '$51.2M', sub: 'posted through period 11 &middot; read today' },
      { k: 'Permit fee revenue', state: 'MEASURED', big: true, v: '$1.84M', sub: 'collected, confirmed against the ledger' },
      { k: 'Department spend', state: 'MEASURED', big: true, v: '$48.9M', sub: 'purchase and payroll detail' },
    ]) + '\n' +
    panel({
      grow: true,
      title: 'Appropriation against actuals', badge: 'MEASURED', sub: 'period 11 of 12 &middot; both sources read today',
      body: table({
        cols: 'minmax(0,1fr) 116px 116px 112px 96px 132px',
        head: ['Department', 'Appropriation', 'Actuals', 'Variance', 'Burn', 'Against elapsed'],
        rows: [
          ['Non-Departmental', '$14.2M', '$11.9M', { t: '$2.3M', tone: '--sc-ok' }, '84%', { t: '8 pts under', tone: '--sc-ok' }],
          ['Electric Utility', '$10.2M', '$9.8M', { t: '$0.4M', tone: '--sc-ok' }, '96%', { t: '4 pts over', tone: '--sc-warn' }],
          ['W&WW Administration', '$9.1M', '$8.1M', { t: '$1.0M', tone: '--sc-ok' }, '89%', { t: '3 pts under', tone: '--sc-ok' }],
          ['Library', '$6.5M', '$6.4M', { t: '$0.1M', tone: '--sc-warn' }, '98%', { t: '6 pts over', tone: '--sc-warn' }],
          ['Main Street', '$4.6M', '$3.7M', { t: '$0.9M', tone: '--sc-ok' }, '80%', { t: '12 pts under', tone: '--sc-ok' }],
          ['Streets & Drainage', '$3.3M', '$3.4M', { t: '-$0.1M', tone: '--sc-crit' }, '103%', { t: '11 pts over', tone: '--sc-crit' }],
          ['Finance', '$2.8M', '$2.5M', { t: '$0.3M', tone: '--sc-ok' }, '89%', { t: '3 pts under', tone: '--sc-ok' }],
          ['Police Department', '$2.3M', '$2.2M', { t: '$0.1M', tone: '--sc-ok' }, '95%', { t: '3 pts over', tone: '--sc-warn' }],
          ['Information Technology', '$2.1M', '$1.6M', { t: '$0.5M', tone: '--sc-ok' }, '76%', { t: '16 pts under', tone: '--sc-ok' }],
          ['Development Services', '$2.0M', '$1.9M', { t: '$0.1M', tone: '--sc-ok' }, '95%', { t: '3 pts over', tone: '--sc-warn' }],
        ],
      }),
      basis: 'ILLUSTRATIVE. The appropriation column is read from the capture; the actuals, variance and burn are drawn to show the shape of a filled row and are not a reading of anything. Burn varies because real burn varies. Every row identical at 100% is the tell that nothing was measured, which is exactly what the capture shows.',
    }),
});

/* ============================================ 5. what has to land, and who acts */

const acquisition = artboard({
  h1: 'What has to land', crumb: 'acquisition', pageBadge: 'UNACCOUNTED', foot: FOOT_TODAY,
  lede: 'Removing the fabrications is the gap analysis, not the product. This is the gap, as a surface rather than a note: four sources, what each unlocks, what has to be acquired, and who has to act. An unaccounted cell with no named acquisition path is indistinguishable from a field nobody thought of.',
  body:
    panel({
      grow: true,
      title: 'The four required sources', sub: 'one row per source, no bundling',
      body: '          <div style="display:flex; flex-direction:column;">\n' +
        '            <div style="display:grid; grid-template-columns:186px 112px minmax(0,1.15fr) minmax(0,1.25fr) 150px; gap:var(--sc-4); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">' +
        ['Source', 'State', 'What it unlocks', 'What has to land', 'Who acts'].map((h) => '<span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('') + '</div>\n' +
        [
          {
            n: 'Adopted budget', sub: 'OpenGov ERP API', state: 'MEASURED',
            unlocks: 'Appropriation by fund and by department. The only column on this lens that is real today.',
            lands: 'Landed. Open question is the counting rule: the fund rows sum to roughly double the stated total and nothing declares which figure governs.',
            who: 'Us, to declare the rule',
          },
          {
            n: 'Fund ledger', sub: 'actuals by period', state: 'UNACCOUNTED',
            unlocks: 'Variance, burn rate, budget pace, and every department alarm. Four regions that are refused today fill from this one source.',
            lands: 'A posted-actuals feed. v1 states it does not have one: actual expenditure data is not available from BMP or Transparency sources.',
            who: 'City finance director',
          },
          {
            n: 'Permit fee revenue', sub: 'MyGov, joined to the case', state: 'CONFLICT',
            unlocks: 'Collection rate, outstanding balance, revenue joined to the cases that produced it.',
            lands: 'Not a new feed. A reconciliation: the Unassigned partition carries roughly $280M of unattributed collection and three permit totals disagree. Fix the join before trusting the column.',
            who: 'Us, then MyGov',
          },
          {
            n: 'Department spend', sub: 'purchase and payroll detail', state: 'UNACCOUNTED',
            unlocks: 'Cost drivers, category splits, spend over time. Everything below the department line.',
            lands: 'Purchase-order and payroll extracts. Distinct from the fund ledger: the ledger gives the total, this gives what it was spent on.',
            who: 'City finance director',
          },
        ].map(gapRow).join('\n') + '\n          </div>\n' +
        v1Box({
          cite: 'capture pages 13 to 22',
          what: 'The cost of not doing this is on the capture. The Scenario Modeler runs three-year projections with conservative, expected and optimistic ranges and stamps them HIGH CONFIDENCE, with a 3/3 connected badge beside it. Its expense baseline is the budget column copied. A confidence badge on a simulation whose baseline was never measured is the most expensive shape in the product, because it is the screen a city manager takes into a council meeting.',
        }),
      basis: 'Basis: four sources, one row each, counted from the register the shipped lens already carries. Two of the four are a request to the city and one is our own reconciliation, so three of the four rows have a named owner who is not us.',
    }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Departments.dc.html', import.meta.url), departments);
fs.writeFileSync(new URL('./PermitRevenue.dc.html', import.meta.url), permitRevenue);
fs.writeFileSync(new URL('./Connected.dc.html', import.meta.url), connected);
fs.writeFileSync(new URL('./Acquisition.dc.html', import.meta.url), acquisition);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Finance today — the full shape' },
    { file: 'Departments.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Departments — refused, not fabricated' },
    { file: 'PermitRevenue.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'Permit fee revenue — the conflict is the output' },
    { file: 'Acquisition.dc.html', x: 5160, y: 0, w: 1600, h: 1040, title: 'What has to land, and who acts' },
    { file: 'Connected.dc.html', x: 6880, y: 0, w: 1600, h: 1040, title: 'Once the fund ledger lands — the target' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -300, w: 700, text: 'THE BRIEF, AND IT IS AN OPERATOR CORRECTION.\nRemoving the v1 fabrications is NOT the product. It is the gap analysis that tells us what to fill in to get to v2.\nSo this lens is drawn at its FULL SHAPE: every cell it will ever hold exists on the page from the start, each one either measured or countably unaccounted, and every unaccounted cell has a named acquisition path.\nA missing column is invisible. An unaccounted cell is countable. That is the whole reason the empty states are drawn rather than omitted.' },
    { id: 'states', x: 760, y: -300, w: 660, text: 'FOUR STATES, AND THEY ARE NOT INTERCHANGEABLE.\nMEASURED - read from a source, carrying that source and the date.\nUNACCOUNTED - the cell exists, nothing acquired. Legitimate at rest, fatal at publish.\nREFUSED - a derived figure whose input is unaccounted. Not a zero.\nCONFLICT - two independently derived readings disagree, and the disagreement is the output.\nv1 has one state: a number. That is the defect, expressed once.' },
    { id: 'copied', x: 1720, y: -300, w: 700, text: 'ACTUAL SPENT IS THE BUDGET COLUMN COPIED.\nCapture pages 11-12: ten departments, ten identical Budget and Actual Spent pairs, 100% burn on every single one.\nThe product states it in a caution banner on that one sub-tab and then consumes the figures as measured everywhere else - including an alarm derived from the fabricated equality: "Non-Departmental is approaching budget cap at 100% - only $0 remaining."\nHere: appropriation is read, actuals are unaccounted, and variance and burn are REFUSED. Four numbers become one honest absence.' },
    { id: 'pace', x: 2480, y: -300, w: 640, text: 'AND THE ARTEFACT NOBODY WOULD CATCH.\nThe capture reports "Budget pace: 94% spent at 94% of fiscal year (+0% vs expected)."\nSpent equals budget by construction, and elapsed drives the expectation, so the two track each other NECESSARILY and the variance is always zero. It is not a result, it is an identity.\nA figure that cannot come out any other way is not a measurement, and it reads as the most reassuring number on the page.' },
    { id: 'rate', x: 3440, y: -300, w: 700, text: 'A COLLECTION RATE OF 157% IS NOT A REACHABLE STATE.\nCollected cannot exceed charged. v1 prints it in green with a success mark (capture page 23).\nThe surplus traces to ONE partition: Unassigned, read as collecting $450.9M against $170.9M charged - roughly $280M unattributed, and the second largest line in the breakdown.\nThe magnitudes are impossible for this city anyway: $664.7M collected against a $69.6M total operating budget, and $231,000 per permit on Building Department alone.' },
    { id: 'counts', x: 4200, y: -300, w: 640, text: 'THE PERMIT COUNTS DO NOT TIE, AND THE TWO PAGES DISAGREE.\nHeader: 1,877 permits. Department rows sum to 3,138 on one capture page and 4,052 on another. Building Department is 1,055 permits on one and 1,970 on the other, with different totals to match.\nThree populations, one label. The lens refuses the count rather than picking the one that looks right.' },
    { id: 'gap', x: 5160, y: -300, w: 700, text: 'THE GAP AS A SURFACE, NOT A FOOTNOTE.\nFour sources, what each unlocks, what has to be acquired, who acts. Three of the four rows have an owner who is not us, which is the point of naming them.\nONE source - the fund ledger - fills four regions that are refused today. It is the highest-leverage acquisition on the lens and it is a request to the city finance director, not a build.\nAn unaccounted cell with no named acquisition path is indistinguishable from a field nobody thought of.' },
    { id: 'confidence', x: 5920, y: -300, w: 680, text: 'THE MOST EXPENSIVE SHAPE IN v1.\nThe Scenario Modeler (capture pages 13-22) runs three-year projections with conservative / expected / optimistic ranges and stamps them HIGH CONFIDENCE, beside a 3/3 connected badge.\nIts expense baseline is the budget column copied.\nThis is the screen a city manager takes into a council meeting. Confidence asserted about a simulation whose baseline was never measured is worse than no simulation, because it is actionable.' },
    { id: 'target', x: 6880, y: -300, w: 700, text: 'THE TARGET, AND IT IS LABELLED NOT TODAY.\nThe same lens with the fund ledger and department spend acquired. The cells that were unaccounted on the first artboard are exactly the cells that fill.\nThe appropriation column is read from the capture. Actuals, variance and burn are ILLUSTRATIVE and the basis line says so.\nNote that burn VARIES here - 76% to 103%. Real burn varies. Every row identical at 100% is the tell, and it is what the capture shows.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Departments, PermitRevenue, Connected, Acquisition + canvas.json');
