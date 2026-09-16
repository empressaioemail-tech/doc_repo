/**
 * SmartCity OS — Police lens.
 *
 *   node dump-source-state.mjs --repo <checkout>   re-reads the product
 *   node gen.mjs                                   rewrites every artboard and canvas.json
 *   node check.mjs                                 the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * Every row, count, basis sentence and counting rule comes from `source-state.json`,
 * which is the OUTPUT of the product's own composers at smartcity-dashboards
 * origin/main f776b4bf. Re-dump rather than editing it, then re-run this.
 *
 * ---------------------------------------------------------------------------
 * THE DESIGN PROBLEM, AND IT IS DERIVED RATHER THAN ASSERTED.
 *
 * src/domains.mjs registers two domains under lensId "police": patrol-vehicles
 * gated by spireon, and police-cameras gated by verkada. Police is the ONLY
 * registered lens whose two regions disagree about their source — and it
 * disagrees in OPPOSITE DIRECTIONS on the two shipped packs:
 *
 *   template-city   verkada granted, spireon deliberately withheld
 *   bastrop_tx      spireon granted as a live feed, verkada not granted at all
 *
 * SPLIT_LENSES below computes that from the registry and the two grant lists, so
 * the claim breaks if the product changes rather than quietly going stale.
 *
 * The consequence is the whole design: the demo's emptiest region is the city's
 * most connected one, and the demo's fullest region is the one the city cannot
 * have. Three distances from data, which are different KINDS of thing and not
 * degrees of one thing, and a lens that renders them alike destroys exactly the
 * distinction the product was built to preserve.
 *
 *   ONE   the vendor works and the grant is deliberately withheld (spireon)
 *   TWO   the vendor has no credential anywhere and no live mapper (verkada)
 *   THREE a class of record is refused on purpose and is not missing
 *         (plateReads, personsOfInterest — declared required:false WITH a basis)
 *
 * Three boards, because three arguments. Public works took four and Fire and EMS
 * took two after cutting a third that would have repeated a sentence. There is no
 * Empty board here for the same reason: on empty-city both regions return the
 * IDENTICAL no-grant sentence, which says strictly less than the Bastrop board,
 * where one status produces two different sentences.
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
  'No source': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'No records': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'Preview': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'Demo records': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Unread': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Partial': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'Restricted': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};
/**
 * The five LENS_BADGE words are the product's own and the design may not add a
 * sixth. Asserted here rather than trusted: a word the product stopped shipping
 * must break this file, not survive in it.
 */
for (const word of Object.values(S.shipped.lensBadgeMap)) {
  if (!BADGE[word]) throw new Error('the product ships a lens badge this design has no token for: ' + word);
}

const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const basisLine = (t, max) =>
  '<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:' + (max || 120) + 'ch;">' + t + '</span>';

/**
 * A DECLARED REFUSAL MENTION.
 *
 * The strongest rule on this lens is that no plate string and no persons-of-
 * interest content reaches the canvas. But the lens also has to be able to SAY
 * that it refuses them, and a check that cannot tell the refusal from the thing
 * refused would either forbid the sentence or permit the content.
 *
 * So every legitimate mention is marked in the markup. check.mjs lifts the
 * marked text out, then scans everything that is left: a surveillance term or a
 * plate-shaped token anywhere outside a marked refusal fails. The term list the
 * check scans for comes from the product's own record shape, so neither half of
 * the comparison can satisfy the other on its own.
 */
const refusal = (t, style) =>
  '<span data-refusal="1"' + (style ? ' style="' + style + '"' : '') + '>' + t + '</span>';

const SHIPPED_NAV = [
  ['Overview', 'Empty'], ['Development services', 'Empty'], ['Finance', 'Empty'],
  ['Citizen', 'Preview'], ['Public works', 'Not read'], ['Parks', 'Not built'],
  ['Police', 'Not read'], ['Fire and EMS', 'Not read'], ['Fleet', 'Not read'],
];
if (SHIPPED_NAV.find((r) => r[0] === 'Police')[1] !== S.shipped.navBadge) {
  throw new Error('the shipped Police nav badge is ' + S.shipped.navBadge + ', not what this file draws');
}

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (policeBadge, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', SHIPPED_NAV.map(([n, b]) => navRow(n, n === 'Police' ? policeBadge : b, n === 'Police'))) + '\n' +
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
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:284px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search units, sites, records</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Police</span>\n      </div>\n    </header>';

/**
 * A tile. `unread` is a different thing from a zero and renders as a WORD, which
 * is the shipped behaviour: web/index.html ships every Police tile as "Not read"
 * with the note "No patrol source", and app.js only ever writes a figure over it
 * when the region carried records. A zero there would be a claim about a fleet
 * nobody has read.
 */
const tile = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:10px var(--sc-4) 9px; display:flex; flex-direction:column; gap:1px; min-width:0; box-shadow:var(--sc-e1);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.k + '</div>\n' +
(m.unread
  ? '            <div style="font:620 15px/28px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">' + (m.word || 'Not read') + '</div>'
  : '            <div data-figure="' + m.v + '" style="font:400 24px/28px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(' + (m.tone || '--sc-ink') + ');">' + m.v + '</div>') + '\n' +
'            <div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(' + (m.unread ? '--sc-ink-3' : '--sc-accent') + ');">\n' +
'              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.n + '</span>' + (m.unread ? '' : ARROW) + '\n            </div>\n          </div>';

const tiles = (items) =>
'        <div style="display:grid; grid-template-columns:repeat(' + items.length + ', minmax(0,1fr)); gap:var(--sc-3);">\n' + items.map(tile).join('\n') + '\n        </div>';

/**
 * The region strip. Two regions of different units — a device inventory and a
 * vehicle roster — so they SWITCH rather than stack. The product stacks both in
 * one colstack, and at 1040px that puts the patrol roster, which is the whole
 * reason this lens is interesting, below the fold. This is a PROPOSED CHANGE and
 * the README says so; the pattern is the one DS_TABS already uses for seven tabs.
 */
const regionStrip = (items, active, note) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:7px; padding:6px 0 8px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + t.c + '</span>' +
    (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n' +
'          <div style="flex:1;"></div>\n' +
'          <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); padding-bottom:8px;">' + note + '</span>\n' +
'        </div>';

const panelHead = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:38px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
(o.demo
  ? '            ' + badge('Demo records') + '\n            <span style="flex:none; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><b style="font-weight:600; color:var(--sc-ink-2);">Generated fixture</b> <span style="color:var(--sc-line-strong);">|</span> ' + o.contract + '</span>\n'
  : (o.chip ? '            ' + badge(o.chip) + '\n' : '')) +
'            <div style="flex:1;"></div>\n' +
(o.right ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); text-align:right;">' + o.right + '</span>\n' : '') +
'          </div>';

const panel = (o, body) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
panelHead(o) + '\n' + body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">' + basisLine(o.basis, o.basisWidth) + '</div>\n' : '') +
'        </section>';

const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:6px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:' + (o.tighter ? '2px' : (o.tight ? '3px' : '6px')) + ' var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  if (c && c.chip) return '              <span style="justify-self:start; font:500 12px/16px var(--sc-font-ui); color:' + c.c + '; background:' + c.w + '; border-radius:var(--sc-r-full); padding:1px 8px; white-space:nowrap;">' + c.t + '</span>';
  const mono = i === 0 || (c && c.mono);
  const txt = (c && c.t !== undefined) ? c.t : c;
  const attr = (c && c.attr) ? ' ' + c.attr : '';
  return '              <span' + attr + ' style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-2') + ');">' + txt + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

/**
 * THE BLOCKED REGION, reused verbatim from _design/smartcity-public-works-lens.
 * It states FOUR things and never fewer: the state, the basis verbatim, what
 * KIND of thing would move it, and when that was last read. "Not read" alone is
 * the sentence that made every blocked region on this product look alike, and a
 * second component for the same idea would be the CTRL-1 shape this program has
 * paid for twice.
 */
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
 * The site margin, as a strip rather than a table.
 *
 * Placement is a property of the SITE, not of the device: the domain derives the
 * sites once, "so a site's placement is stable across every camera mounted on
 * it. Drawing the placement per record would let one site render under three
 * different names". The shipped device table repeats it on all eighteen rows
 * anyway. Here it appears once per site, which is where the domain put it, and
 * the device table gets the width back.
 */
const siteStrip = (sites, total) =>
'          <div style="display:flex; align-items:stretch; gap:var(--sc-2); padding:var(--sc-2) var(--sc-4) var(--sc-2); border-top:1px solid var(--sc-line-faint);">\n' +
'            <span style="flex:none; align-self:center; font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">Sites</span>\n' +
sites.map((s) =>
'            <div style="flex:1; min-width:0; border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface-2); padding:3px 7px; display:flex; flex-direction:column;">' +
'<span style="font:400 10px/14px var(--sc-font-data); color:var(--sc-ink-3);">' + s.siteRef + '</span>' +
'<span style="display:flex; align-items:baseline; gap:5px; min-width:0;"><span style="flex:1; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + s.placement + '</span>' +
'<span data-figure="' + s.cameraCount + '" style="flex:none; font:400 13px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + s.cameraCount + '</span></span>' +
'</div>').join('\n') + '\n' +
'            <span style="flex:none; align-self:center; font:400 11px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + total + ' placed</span>\n' +
'          </div>';

/** A plain labelled list, for the jobs that are not regions. */
const jobList = (items) =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
items.map((j, i) =>
'            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:5px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="flex:1; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + j[0] + '</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + j[1] + '</span></div>').join('\n') + '\n          </div>';

/**
 * THE PROVENANCE FOOT. Every board names, in the product's own codes, which
 * regions it draws: domain id, the vendor kind that gates it, the record type,
 * and the pack. A staff lens is platform-internal, and a member of staff looking
 * at a page that will not fill needs to know whose feed is missing. The shipped
 * panel chip says "Camera output contract" / "Telemetry output contract" and
 * names no vendor; vendors are named on Connections. Naming them here is a
 * PROPOSED CHANGE and the README says so.
 *
 * It also gives check.mjs real inputs to compare against the registry. A canvas
 * that renders only display forms gives a check nothing to check.
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
topbar(o.city, o.seal, o.env) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.policeBadge, o.foot) + '\n' +
'    <main data-lens-body="police" style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-4) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Police</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Police</h1>' + badge(o.pageBadge) + '<div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
'        <p style="margin:0; max-width:104ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
(o.tiles ? tiles(o.tiles) + '\n' : '') +
regionStrip(o.regions, o.activeRegion, o.regionNote) + '\n' +
o.body + '\n' +
provFoot(o.prov, o.pack) + '\n' +
'    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'dark') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'dark') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ========================================================== the data reads */

const cam = S.demo.cameras;
const patrolDemo = S.demo.patrol;
const patrolProving = S.proving.patrol;
const DEV = S.axis.DEVICE_STATUS_VALUES;
const VEH = S.axis.VEHICLE_STATUS_VALUES;
const BANDS = S.axis.OCCUPANCY_BANDS;
const REPORTING = S.templates.reportingStatuses;

/** Read off the registry rather than typed, so a rename in the product breaks the board. */
const LENS = 'police';
const PROV = S.vocab.registry
  .filter((d) => d.lensId === LENS)
  .map((d) => ({ domainId: d.id, kind: d.gatedBy, recordType: d.recordType, region: d.region }));
if (PROV.length !== 2) throw new Error('police now has ' + PROV.length + ' registered regions; re-derive this design');

const kindLabel = (id) => {
  const k = S.vocab.adapterKinds.find((x) => x.id === id);
  if (!k) throw new Error('uncatalogued kind ' + id);
  return k.displayName;
};

/**
 * THE SPINE, DERIVED. A lens is "split" on a pack when its regions do not all
 * share one answer to "is my gating kind granted here". Police is the only one,
 * on both shipped packs, and in opposite directions. Computed, so it fails loudly
 * if the product grants spireon on the demo or wires verkada on Bastrop.
 */
const lensesByIdRegions = {};
for (const d of S.vocab.registry) (lensesByIdRegions[d.lensId] = lensesByIdRegions[d.lensId] || []).push(d.gatedBy);
const splitOn = (grantList) => Object.entries(lensesByIdRegions)
  .filter(([, kinds]) => new Set(kinds.map((k) => grantList.includes(k))).size > 1)
  .map(([id]) => id);
const SPLIT_DEMO = splitOn(S.grants.templateCityFixtureGrants);
const SPLIT_BASTROP = splitOn(S.grants.bastropGrantedAdapters);
if (SPLIT_DEMO.join() !== LENS || SPLIT_BASTROP.join() !== LENS) {
  throw new Error('the split-lens claim no longer holds: demo=[' + SPLIT_DEMO + '] bastrop=[' + SPLIT_BASTROP + ']');
}
const SPLIT_SENTENCE = 'the only lens of ' + Object.keys(lensesByIdRegions).length +
  ' whose regions disagree about their source, and it disagrees in opposite directions on the two shipped packs';

/**
 * An absence's counting rule is its basis with a prefix, so printing both is
 * printing one sentence twice. Asserted rather than assumed, because the boards
 * say so on the page and a change in the seam must break this file.
 */
for (const absence of [S.demo.patrol, S.staging.cameras, S.staging.patrol, S.unconnected.patrol]) {
  if (absence.countingRule !== 'no records: ' + absence.basis) {
    throw new Error('an absence counting rule is no longer its basis with a prefix: ' + absence.domainId + ' on ' + absence.cityKey);
  }
}

const chip = (t, c, w) => ({ chip: true, t, c, w });
const DEV_CHIP = {
  offline: ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'signal-loss': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'firmware-due': ['var(--sc-info)', 'var(--sc-info-wash)'],
  online: ['var(--sc-ok)', 'var(--sc-ok-wash)'],
};
const VEH_CHIP = {
  'out-of-service': ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'inspection-due': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'in-shop': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'in-service': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
};
const DEV_TONE = {
  offline: '--sc-crit', 'signal-loss': '--sc-warn', 'firmware-due': '--sc-info', online: '--sc-ok',
};
const devLabel = (id) => DEV.find((s) => s.id === id).label;
const vehLabel = (id) => VEH.find((s) => s.id === id).label;
const devCount = (id) => cam.extras.metrics.find((m) => m.id === id).count;
const bandCount = (band) => cam.extras.occupancy.bands.find((b) => b.band === band).count;

/* --------------------------------------------- THE OCCUPANCY MATRIX

Status against occupancy band, and it is a matrix with FORBIDDEN CELLS rather
than a grid with holes.

src/domains/police-cameras.mjs declares REPORTING_STATUSES = [firmware-due,
online] under the comment "a status that is not reporting has no occupancy to
band". So a camera that is offline or losing signal CANNOT carry a band, and a
camera that is reporting CANNOT carry "occupancy not measured". Of sixteen cells,
eight cannot occur by rule and render hatched.

That is the point of drawing it: "occupancy not measured" is a CONSEQUENCE of
status, not a leftover. Three cameras carry it and three cameras are not
reporting, and those two numbers are derived by different routes and are never
shown agreeing anywhere in the product. Here they are, agreeing, in the margins. */

const matrixCell = (statusId, band) => {
  const reporting = REPORTING.includes(statusId);
  const measured = band !== BANDS[0];
  if (reporting !== measured) return { forbidden: true };
  return { n: cam.records.filter((r) => r.status === statusId && r.occupancyBand === band).length };
};

const MATRIX = DEV.map((s) => ({
  statusId: s.id, label: s.label, tone: DEV_TONE[s.id],
  cells: BANDS.map((b) => ({ band: b, ...matrixCell(s.id, b) })),
  margin: devCount(s.id),
}));
const FORBIDDEN_COUNT = MATRIX.reduce((n, r) => n + r.cells.filter((c) => c.forbidden).length, 0);
const OCCUPIED_COUNT = MATRIX.reduce((n, r) => n + r.cells.filter((c) => !c.forbidden).length, 0);
const MEASURED_ZEROS = MATRIX.reduce((n, r) => n + r.cells.filter((c) => !c.forbidden && c.n === 0).length, 0);
/** Both margins and the corner, each derived by a different route. */
const ROW_SUM = MATRIX.reduce((n, r) => n + r.margin, 0);
const COL_SUM = BANDS.reduce((n, b) => n + bandCount(b), 0);
const CELL_SUM = MATRIX.reduce((n, r) => n + r.cells.reduce((m, c) => m + (c.forbidden ? 0 : c.n), 0), 0);
if (ROW_SUM !== cam.recordCount || COL_SUM !== cam.recordCount || CELL_SUM !== cam.recordCount) {
  throw new Error('the matrix margins do not reconcile: rows ' + ROW_SUM + ', columns ' + COL_SUM + ', cells ' + CELL_SUM + ', records ' + cam.recordCount);
}
const NOT_REPORTING = DEV.filter((s) => !REPORTING.includes(s.id)).reduce((n, s) => n + devCount(s.id), 0);
if (NOT_REPORTING !== bandCount(BANDS[0])) {
  throw new Error('not-reporting cameras (' + NOT_REPORTING + ') and not-measured cameras (' + bandCount(BANDS[0]) + ') disagree');
}

const matrix = () =>
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">\n' +
'            <div style="display:grid; grid-template-columns:112px repeat(' + BANDS.length + ', minmax(0,1fr)) 74px; gap:2px;">\n' +
'              <span style="font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3); padding:0 0 4px; align-self:end;">Status</span>\n' +
BANDS.map((b) =>
'              <span style="font:500 11px/14px var(--sc-font-data); letter-spacing:.02em; color:var(--sc-ink-3); padding:0 2px 4px; text-align:center; align-self:end;">' + b + '</span>').join('\n') + '\n' +
'              <span style="font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3); padding:0 0 4px; text-align:right; align-self:end;">Status</span>\n' +
MATRIX.map((row) =>
'              <span style="font:400 12px/28px var(--sc-font-ui); color:var(' + row.tone + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + row.label + '</span>\n' +
row.cells.map((c) => c.forbidden
  ? '              <span style="height:28px; display:grid; place-items:center; border-radius:3px; background:repeating-linear-gradient(135deg, var(--sc-line-faint) 0 5px, transparent 5px 10px); border:1px solid var(--sc-line-faint); font:400 11px/15px var(--sc-font-data); color:var(--sc-ink-3);">&mdash;</span>'
  : '              <span data-cell="' + row.statusId + ':' + c.band + '" style="height:28px; display:grid; place-items:center; border-radius:3px; background:var(--sc-surface-2); border:1px solid var(--sc-line-faint); font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (c.n ? '--sc-ink' : '--sc-ink-3') + ');">' + c.n + '</span>').join('\n') + '\n' +
'              <span style="height:28px; display:grid; place-items:center; justify-content:end; font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-2);">' + row.margin + '</span>').join('\n') + '\n' +
'              <span style="font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3); padding-top:5px;">Band</span>\n' +
BANDS.map((b) =>
'              <span style="padding-top:5px; text-align:center; font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-2);">' + bandCount(b) + '</span>').join('\n') + '\n' +
'              <span style="padding-top:5px; text-align:right; font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + CELL_SUM + '</span>\n' +
'            </div>\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-4); padding-top:var(--sc-3); font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">\n' +
'              <span style="display:flex; align-items:center; gap:6px;"><span style="width:14px; height:12px; border-radius:2px; background:var(--sc-surface-2); border:1px solid var(--sc-line-faint);"></span>can occur, counted</span>\n' +
'              <span style="display:flex; align-items:center; gap:6px;"><span style="width:14px; height:12px; border-radius:2px; background:repeating-linear-gradient(135deg, var(--sc-line-faint) 0 5px, transparent 5px 10px); border:1px solid var(--sc-line-faint);"></span>cannot occur by rule</span>\n' +
'            </div>\n          </div>';

/**
 * THE RECONCILIATION, DRAWN.
 *
 * Two numbers that must agree and that nothing in the product shows agreeing:
 * the cameras whose status means they cannot report, counted off the status
 * tiles, and the cameras carrying the not-measured band, counted off the band
 * summary. Different routes, one answer. Two numbers that should agree and do
 * not is a free finding; two that should and are never compared is a finding
 * nobody will ever get.
 */
const reconcile = () =>
'          <div style="margin:0 var(--sc-4) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r); background:var(--sc-surface-2); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'            <span style="font:500 11px/15px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">Two routes, one answer</span>\n' +
[
  ['Cannot report', DEV.filter((s) => !REPORTING.includes(s.id)).map((s) => s.label.toLowerCase() + ' ' + devCount(s.id)).join(' + '), NOT_REPORTING, 'counted off the status tiles'],
  ['Not measured', 'the band, counted off the records', bandCount(BANDS[0]), 'counted off the band summary'],
].map((r) =>
'            <div style="display:grid; grid-template-columns:118px minmax(0,1fr) 40px; gap:var(--sc-3); align-items:baseline;">' +
'<span style="font:500 12px/18px var(--sc-font-data); letter-spacing:.04em; color:var(--sc-ink-3);">' + r[0] + '</span>' +
'<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r[1] + '</span>' +
'<span data-figure="' + r[2] + '" style="text-align:right; font:400 17px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + r[2] + '</span></div>').join('\n') + '\n' +
'            <div style="border-top:1px solid var(--sc-line-faint); padding-top:var(--sc-2); font:400 12px/17px var(--sc-font-ui); color:var(--sc-ok);">The two agree, and the product compares them nowhere. A not-measured band is a consequence of status, never a leftover.</div>\n' +
'          </div>';

/* ------------------------------------------------ THE DECLINED CLASSES

A different KIND of absence from every state the seam has a word for.

ungranted, granted-empty, no-fixture-source and not-registered are all statements
about a SOURCE. These three are statements about a source that exists, works, and
is declined: the live vendor exposes a plate-read family and a persons-of-interest
family, and src/adapters.mjs declares both as required:false WITH a basis rather
than leaving them missing. The product's own comment says why that is the stronger
control: "a guard catches the attempt and a contract prevents it".

The product has no vocabulary for this state. It is drawn here as its own class,
with the contract's own words, and the README raises the vocabulary gap. */

const REFUSED = S.shapes.verkada.fields.filter((f) => f.required === false);
if (REFUSED.length !== 3) throw new Error('the verkada shape now declares ' + REFUSED.length + ' refused fields; re-derive');
const SPIREON_REFUSED = S.shapes.spireon.fields.filter((f) => f.required === false);
const SAMSARA_REFUSED = S.shapes.samsara.fields.filter((f) => f.required === false);

const refusedList = () =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
REFUSED.map((f, i) =>
'            <div style="display:flex; flex-direction:column; gap:3px; padding:8px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2);">' + refusal(f.name, 'font:400 13px/18px var(--sc-font-data); color:var(--sc-restricted);') +
'<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">declared required:false, with a basis</span>' +
'<div style="flex:1;"></div>' + badge('Restricted') + '</div>\n' +
'              ' + refusal(f.basis, 'font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);') + '\n' +
'            </div>').join('\n') + '\n          </div>';

/**
 * A QUOTED TEMPLATE, WITH ITS SLOTS REWRITTEN, AND THE REASON IS A REAL ONE.
 *
 * The product writes these sentences as template literals, so their placeholders
 * carry a dollar sign. The product's OWN money gate (FORBIDDEN_CONTENT in
 * src/fixture-seam.mjs) refuses a currency symbol anywhere, so quoting the
 * template character for character would put a money token on a lens that prints
 * none. The gate is right and the quotation is right, and they cannot both be
 * satisfied literally.
 *
 * So the slots are rewritten to angle brackets and the board says so. The
 * alternative, widening the money rule to admit "${", is admitting a known bad
 * value to make a check pass, which is the move this programme keeps paying for.
 * check.mjs applies the same transform to the source string and compares, so the
 * rewritten form is still derived from the product rather than typed here.
 */
const slots = (t) => t.replace(/\$\{([^}]*)\}/g, '&lt;$1&gt;');

/* ------------------------------------------------- THE THREE SENTENCES

The module says it in its own words: ungranted, granted-empty and "not built" are
three sentences and collapsing any pair is the defect ruling 1 closes. This lens
is where the product proves it can tell them apart, so the board says all three
at once, side by side, in the product's own strings.

The middle one is quoted as a TEMPLATE with its placeholders visible, and that is
deliberate. granted-empty is unreachable for both Police domains through the seam:
CAMERA_FIXTURE_PLAN and PATROL_FIXTURE_PLAN each return a fixed non-empty set, so
composeDomain can never take the zero-record branch. Filling in a sentence the
product cannot currently produce would be putting words in its mouth. */

const SENTENCES = [
  {
    state: 'ungranted', tone: '--sc-warn', wash: '--sc-warn-wash',
    where: 'composed on template-city, now',
    text: patrolDemo.basis,
    verbatim: true,
  },
  {
    state: 'granted-empty', tone: '--sc-info', wash: '--sc-info-wash',
    where: 'UNREACHABLE on any generated pack; the template, quoted',
    text: S.templates.grantedEmpty,
    verbatim: false,
  },
  {
    state: 'not-registered', tone: '--sc-crit', wash: '--sc-crit-wash',
    where: 'the only surviving meaning of Not built',
    text: S.templates.notRegistered,
    verbatim: false,
  },
];

const sentenceRows = () =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
SENTENCES.map((s, i) =>
'            <div style="display:flex; flex-direction:column; gap:3px; padding:7px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); color:var(' + s.tone + '); background:var(' + s.wash + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + s.state + '</span>' +
'<span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + s.where + '</span></div>\n' +
'              <span style="font:400 13px/18px ' + (s.verbatim ? 'var(--sc-font-ui)' : 'var(--sc-font-data)') + '; color:var(' + (s.verbatim ? '--sc-ink' : '--sc-ink-2') + ');">' + (s.verbatim ? s.text : slots(s.text)) + '</span>\n' +
'            </div>').join('\n') + '\n          </div>';

/**
 * ONE NAMESPACE, TWO LENSES, AND NOTHING SAYS WHETHER IT IS ONE PERSON.
 *
 * Verified at source rather than taken from the parallel lane's close:
 * src/domains/fleet-vehicles.mjs and src/domains/patrol-vehicles.mjs each declare
 * OPERATOR_REF_FORMAT as /^OPR-\d{2}$/ and the IDENTICAL OPERATOR_BASIS string,
 * neither importing the other. Fleet mints OPR-01 to OPR-04 and Police mints
 * OPR-01 to OPR-03, on the same pack.
 *
 * So a member of staff reading Fleet and then Police sees OPR-01 twice and the
 * product says nothing about whether it is one person. That is the cost of two
 * lenses answering the shared constraint the same way, which is still the right
 * answer: a second vocabulary would be worse. It needs a ruling, not a redraw,
 * and the README raises it.
 */
const SHARED_OPERATOR_NAMESPACE = true;

/* ------------------------------------------- THE OPERATOR DIMENSION

The shared constraint, answered the way Fleet answers it and with no second
vocabulary: the operator is a person, the person is not named, and the dimension
still works because the record carries an opaque reference under a declared
format and states in its OWN basis why the name is absent.

It cannot be drawn from the shipped demo, because the region is ungranted there
and drawing rows nobody composed would be fabrication. So it is composed the way
the product's own test composes it: grant spireon on a throwaway pack, change
nothing else, and the region fills. That is how src/domains.test.mjs proves the
region is REACHABLE rather than assumed reachable, which is also the thing that
makes "ungranted" mean anything at all. */

const OPERATORS = [...new Set(patrolProving.records.map((r) => r.operatorRef))].sort();
const operatorRows = OPERATORS.map((ref) => {
  const mine = patrolProving.records.filter((r) => r.operatorRef === ref);
  return {
    ref, total: mine.length,
    bands: VEH.map((s) => ({ id: s.id, label: s.label, n: mine.filter((r) => r.status === s.id).length })),
  };
});
const OPERATOR_SUM = operatorRows.reduce((n, o) => n + o.total, 0);
if (OPERATOR_SUM !== patrolProving.recordCount) {
  throw new Error('operator rows sum to ' + OPERATOR_SUM + ', roster is ' + patrolProving.recordCount);
}
if (OPERATORS.length !== S.axis.OPERATOR_COUNT) {
  throw new Error('OPERATOR_COUNT is ' + S.axis.OPERATOR_COUNT + ' and the composer produced ' + OPERATORS.length);
}

const operatorBars = () =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-3) var(--sc-4) var(--sc-3);">\n' +
operatorRows.map((o) =>
'            <div style="display:flex; align-items:center; gap:var(--sc-3);">\n' +
'              <span style="width:58px; flex:none; font:400 13px/18px var(--sc-font-data); color:var(--sc-ink);">' + o.ref + '</span>\n' +
'              <div style="flex:1; display:flex; height:16px; border-radius:3px; overflow:hidden; background:var(--sc-line-faint);">' +
o.bands.map((b) => b.n
  ? '<span style="width:' + ((b.n / o.total) * 100).toFixed(1) + '%; background:var(' + { 'out-of-service': '--sc-crit', 'inspection-due': '--sc-warn', 'in-shop': '--sc-info', 'in-service': '--sc-ok' }[b.id] + ');"></span>'
  : '').join('') + '</div>\n' +
'              <span style="width:92px; flex:none; text-align:right; font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + o.total + ' of ' + OPERATOR_SUM + ' units</span>\n' +
'            </div>').join('\n') + '\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-4); padding-top:2px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3); flex-wrap:wrap;">' +
VEH.map((s) => '<span style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:2px; background:var(' + { 'out-of-service': '--sc-crit', 'inspection-due': '--sc-warn', 'in-shop': '--sc-info', 'in-service': '--sc-ok' }[s.id] + ');"></span>' + s.label + '</span>').join('') +
'</div>\n          </div>';

/* ============================================================= board 1 */

/**
 * Five columns, not the shipped six: Placement leaves the device table and
 * appears once per site on the strip. Stated in the basis and in the README,
 * because dropping a shipped column is a proposed change and not a redraw.
 */
const CAM_HEAD = S.shipped.cameraTableHeaders.filter((h) => h !== 'Placement');
if (CAM_HEAD.length !== S.shipped.cameraTableHeaders.length - 1) {
  throw new Error('the shipped camera table no longer carries a Placement column');
}
const CAM_ROWS = cam.records.map((r) => [
  r.recordId,
  r.deviceLabel,
  chip(devLabel(r.status), ...DEV_CHIP[r.status]),
  { t: r.siteRef, mono: true },
  { t: r.occupancyBand, attr: 'data-occupancy="' + r.occupancyBand + '"' },
]);

const SITE_SUM = cam.extras.sites.reduce((n, s) => n + s.cameraCount, 0);
if (SITE_SUM !== cam.recordCount) throw new Error('site margin sums to ' + SITE_SUM + ', roster is ' + cam.recordCount);

const FOOT_DEMO = 'template-city &middot; demo pack<br>2 registered regions, 1 sourced<br>badges outside this lens are the shipped values at f776b4bf';
const FOOT_PATROL = 'template-city &middot; demo pack<br>patrol roster: built, no source<br>proving panel composed on probe-city';
const FOOT_BASTROP = 'bastrop_tx &middot; staging pack<br>spireon granted live, verkada not granted<br>badges outside this lens are the shipped values at f776b4bf';

const SOURCED_RULE = '1 of 2 regions sourced; ' + S.shipped.sourcedRuleTemplate;

const REGIONS_DEMO = [
  { n: 'Camera inventory', c: cam.recordCount + ' devices', b: 'Demo records' },
  { n: 'Patrol roster', c: 'no source', b: 'No source' },
];
const REGION_NOTE = '2 registered regions on this lens, ' + SPLIT_SENTENCE.replace('the only lens of 5', 'and this is the only lens of 5');

const main = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  policeBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city', pageRule: SOURCED_RULE,
  lede: 'Devices, and the sites they group under. Every device is on the page and the site reference is opaque: a camera is placed at a site, never at an address. Occupancy is a band rather than a head count, and the next board is about why.',
  tiles: [
    ...DEV.map((s) => ({ k: s.label, v: devCount(s.id), tone: DEV_TONE[s.id], n: 'of ' + cam.recordCount + ' devices' })),
    { k: 'Sites', v: cam.extras.sites.length, n: 'opaque refs, never an address' },
    { k: 'Inventory nodes', unread: true, word: 'Zero', n: 'telemetry is not an asset' },
  ],
  regions: REGIONS_DEMO, activeRegion: 'Camera inventory', regionNote: REGION_NOTE,
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-3);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column;">\n' +
panel({
  grow: true, title: 'Camera inventory', sub: 'police-cameras &middot; one row per device',
  demo: true, contract: 'Camera output contract',
  right: 'severity, then record id',
  basis: cam.recordCount + ' of ' + cam.recordCount + ' on the page, no pager. Basis: ' + cam.basis + '. Counting rule: ' + cam.countingRule + '.',
  basisWidth: 104,
}, table({
  tight: true,
  cols: '108px minmax(0,1fr) 112px 66px 160px',
  head: ['Record', ...CAM_HEAD],
  rows: CAM_ROWS,
})) + '\n' +
'          </div>\n' +
'          <div style="width:452px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  grow: true, title: 'Sites', sub: 'never an address', right: SITE_SUM + ' of ' + cam.recordCount + ' placed',
  basis: S.shipped.sitesCaption + '. Placement is not a device column on this design: the domain derives a site once so its placement is stable across every camera mounted on it, and the shipped table repeats it on all ' + cam.recordCount + ' device rows. Counting rule: ' + cam.extras.sites[0].countingRule + '.',
  basisWidth: 58,
}, table({ cols: '74px minmax(0,1fr) 68px', head: S.shipped.siteTableHeaders, rows: cam.extras.sites.map((s) => [{ t: s.siteRef, mono: true }, s.placement, { t: String(s.cameraCount), mono: true, attr: 'data-figure="' + s.cameraCount + '"' }]) })) + '\n' +
panel({
  title: 'A camera is not an inventory node', sub: 'and G-24 stays at zero', chip: 'Restricted',
  basis: 'Basis: ' + cam.extras.inventoryBasis + '.',
  basisWidth: 58,
},
'          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">\n' +
'            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Vendor device telemetry is the standing example of the thing that looks like it should fill an inventory and must not. ' + cam.recordCount + ' devices are on this page and the city asset inventory is unchanged by all ' + cam.recordCount + ' of them.</p>\n' +
'          </div>') + '\n' +
'          </div>\n        </div>',
});

/* ====================================================== board 2, declined */

/**
 * WHAT THE PRODUCT REFUSES TO SAY, on one board, because it is one argument.
 *
 * The verkada record shape declares THREE fields required:false with a basis, and
 * all three are the same move: the live vendor offers something and the product
 * declines to carry it. Two are surveillance records about identifiable people.
 * The third is a counted occupancy, and refusing it is what MAKES the band
 * vocabulary — which is why the matrix belongs on this board and not beside the
 * register. The matrix is the refusal drawn: "occupancy not measured" is a
 * consequence of status, not a leftover.
 *
 * This is a different KIND of absence from every state the seam has a word for.
 * ungranted, granted-empty, no-fixture-source and not-registered are statements
 * about a SOURCE. These are statements about a source that exists, works, and is
 * refused. The product has no vocabulary for that and the README raises it.
 */
const BAND_TONE = { [BANDS[0]]: '--sc-ink-3', light: '--sc-ok', moderate: '--sc-info', busy: '--sc-warn' };

const declined = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  policeBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city', pageRule: SOURCED_RULE,
  lede: 'The live camera vendor exposes ' + refusal('plate reads, persons of interest') + ' and a counted occupancy. The record contract declares all three as fields a generated record never carries, each with a basis, and the product&rsquo;s own comment says why that is the stronger control: a guard catches the attempt and a contract prevents it.',
  tiles: [
    ...BANDS.map((b) => ({ k: b === BANDS[0] ? 'Not measured' : b, v: bandCount(b), tone: BAND_TONE[b], n: 'of ' + cam.extras.occupancy.measured + ' devices' })),
    { k: 'Head count', unread: true, word: 'Never', n: 'a band, by contract' },
    { k: 'Declined classes', v: REFUSED.length, tone: '--sc-restricted', n: 'named, not merely absent' },
  ],
  regions: REGIONS_DEMO, activeRegion: 'Camera inventory', regionNote: REGION_NOTE,
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-3);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
panel({
  grow: true, title: 'Reporting against occupancy', sub: 'the refusal, drawn',
  right: FORBIDDEN_COUNT + ' of ' + (FORBIDDEN_COUNT + OCCUPIED_COUNT) + ' cells cannot occur by rule',
  basis: 'Only ' + REPORTING.join(' and ') + ' report, so an unreporting camera cannot carry a band and a reporting one cannot carry the not-measured band: ' + FORBIDDEN_COUNT + ' cells cannot occur and are hatched rather than drawn as a zero. ' + NOT_REPORTING + ' cameras are not reporting and ' + bandCount(BANDS[0]) + ' carry the not-measured band &mdash; two numbers derived by different routes, which nothing in the product shows agreeing. Both margins reach ' + CELL_SUM + '. Of the ' + OCCUPIED_COUNT + ' cells that can occur, ' + MEASURED_ZEROS + ' is a measured zero on this pack. Counting rule: ' + cam.extras.occupancy.countingRule + '.',
  basisWidth: 100,
}, matrix() + '\n' + reconcile()) + '\n' +
'          </div>\n' +
'          <div style="width:560px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  grow: true, title: 'Declined, not missing', sub: 'a source that exists, works, and is refused', chip: 'Restricted',
  basis: 'Basis: ' + refusal(cam.extras.excludedFamilies) + '.',
  basisWidth: 74,
}, refusedList()) + '\n' +
panel({
  title: 'Four bands, and the first one is deliberate', sub: 'declared in this order',
  right: cam.extras.occupancy.measured + ' devices, one band each',
  basis: 'Basis: ' + refusal(cam.records[0].identityBasis) + '.',
  basisWidth: 74,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
BANDS.map((b, i) =>
'            <div style="display:grid; grid-template-columns:22px minmax(0,1fr) 46px; gap:var(--sc-3); align-items:center; padding:6px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
'<span style="font:400 11px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + i + '</span>' +
'<span data-band="' + b + '" style="font:400 13px/18px var(--sc-font-ui); color:var(' + BAND_TONE[b] + ');">' + b + (i === 0 ? ' &mdash; the honest absence, first on purpose' : '') + '</span>' +
'<span data-figure="' + bandCount(b) + '" style="text-align:right; font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-2);">' + bandCount(b) + '</span></div>').join('\n') + '\n          </div>') + '\n' +
'          </div>\n        </div>',
});

/* ============================================================= board 2 */

const PROVING_ROWS = patrolProving.records.map((r) => [
  r.recordId, r.unitLabel, chip(vehLabel(r.status), ...VEH_CHIP[r.status]), { t: r.operatorRef, mono: true },
]);

const patrolBoard = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  policeBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_PATROL,
  prov: PROV, pack: 'template-city &middot; proving panel on probe-city', pageRule: SOURCED_RULE,
  lede: S.shipped.lede,
  tiles: [
    ...VEH.map((s) => ({ k: s.label, unread: true, word: 'Not read', n: 'No patrol source' })),
    { k: 'Operators', unread: true, word: 'Not read', n: 'No patrol source' },
    { k: 'Person named', unread: true, word: 'Never', n: 'an opaque reference, by contract' },
  ],
  regions: REGIONS_DEMO, activeRegion: 'Patrol roster', regionNote: REGION_NOTE,
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-3);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
panel({
  title: 'Patrol roster', sub: 'patrol-vehicles &middot; gatedBy spireon', chip: 'No source',
  right: 'the product&rsquo;s ungranted exemplar',
}, blocked({
  region: 'Built, and this city has no source for it', domainId: 'patrol-vehicles', kind: 'spireon',
  state: patrolDemo.status, tone: '--sc-warn', wash: '--sc-warn-wash',
  facts: [
    ['Obstacle kind', 'A GRANT DELIBERATELY WITHHELD. Catalogued, shape declared, generator working, region registered, and kept off this pack&rsquo;s demonstration axis on purpose.'],
    ['Basis', patrolDemo.basis, true],
    ['Who moves it', 'On a real city, a grant on the pack. On this pack, nobody: reversing it would delete the state that proves ruling 1.'],
    ['Last read', kindLabel('spireon') + ' was last read ' + S.shipped.vendorLiveVerifiedDate + ' and recorded in the live module. Not re-read on 2026-09-15.', true],
  ],
  basis: 'Four things and never fewer, reused from the Public works lens. The counting rule for an absence is the basis with &ldquo;no records:&rdquo; in front of it, so it is not printed twice.',
})) + '\n' +
panel({
  title: 'What this region renders when a source is granted',
  sub: patrolProving.recordCount + ' units &middot; ' + OPERATORS.length + ' operator refs',
  chip: 'Demo records', right: 'proven reachable, never assumed &middot; probe-city, never shipped',
  basis: 'Basis: the product&rsquo;s own test grants spireon on a throwaway pack and nothing else changes.',
  basisWidth: 132,
}, table({
  tight: true, tighter: true, cols: '106px minmax(0,1.2fr) 116px 74px',
  head: ['Record', 'Unit', 'Status', 'Operator'], rows: PROVING_ROWS,
})) + '\n' +
'          </div>\n' +
'          <div style="width:540px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  grow: true, title: 'Three sentences, not one empty', sub: 'the distinction this lens exists to prove',
  right: 'slots in angle brackets, not the source notation',
  basis: S.notRegistered.shippedBasis + '',
  basisWidth: 76,
}, sentenceRows() + '\n' + jobList(S.notRegistered.shippedJobs.map((j) => [j, 'named, not hidden']))) + '\n' +
panel({
  title: 'Nobody is named', sub: 'and the dimension still works',
  right: 'OPR- and two digits; Fleet mints it too',
  basis: 'Basis: ' + S.axis.OPERATOR_BASIS + '. No second vocabulary was invented for this idea.',
  basisWidth: 76,
}, operatorBars()) + '\n' +
'          </div>\n        </div>',
});

/* ============================================================= board 3 */

const stagingCam = S.staging.cameras;
const stagingPatrol = S.staging.patrol;
if (stagingCam.basis === stagingPatrol.basis) {
  throw new Error('the two staging sentences are identical; the Bastrop board has no argument');
}

/** Which of the six shipped patrol columns the generated record cannot fill. */
const LIVE_ONLY_COLUMNS = ['NSpire', 'Maintenance', 'Recent Alerts'];
const SHIPPED_PATROL_COLS = S.shipped.patrolTableHeaders;
for (const c of LIVE_ONLY_COLUMNS) {
  if (!SHIPPED_PATROL_COLS.includes(c)) throw new Error('the shipped patrol table no longer carries the column ' + c);
}

const bastrop = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  policeBadge: 'Empty', pageBadge: 'Empty', foot: FOOT_BASTROP,
  prov: PROV, pack: 'bastrop_tx',
  pageRule: '0 of 2 regions sourced; ' + S.shipped.sourcedRuleTemplate,
  lede: 'Both regions read the same status on this pack and they say two different things, which is the point. One is granted as a live feed the fixture seam does not read. The other is not granted anywhere, has no live mapper, and no credential for it exists in any project. Those are different obstacles and only one of them is an engineering task.',
  tiles: [
    { k: 'Regions built', v: PROV.length, n: 'both registered' },
    { k: 'Regions sourced', unread: true, word: 'None', n: 'through this seam' },
    { k: 'Live grants', v: S.grants.bastropGrantedAdapters.length, n: 'of ' + S.vocab.adapterKinds.length + ' catalogued kinds' },
    { k: 'Gates granted', v: PROV.filter((p) => S.grants.bastropGrantedAdapters.includes(p.kind)).length, tone: '--sc-warn', n: 'of ' + PROV.length + ' on this lens' },
    { k: 'Live mappers', v: 1, tone: '--sc-warn', n: 'of ' + PROV.length + ' regions' },
    { k: 'Person named', unread: true, word: 'Never', n: 'on either path, by contract' },
  ],
  regions: [
    { n: 'Camera inventory', c: 'not granted', b: 'Not connected' },
    { n: 'Patrol roster', c: 'granted, live', b: 'Not read' },
  ],
  activeRegion: 'Camera inventory',
  regionNote: '2 registered regions on this lens, and on this pack they are the reverse of the demo',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-3);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
panel({
  title: 'Camera inventory', sub: 'police-cameras &middot; gatedBy verkada', chip: 'Not connected',
}, blocked({
  region: 'A vendor nobody has onboarded', domainId: 'police-cameras', kind: 'verkada',
  state: stagingCam.status, tone: '--sc-crit', wash: '--sc-crit-wash',
  facts: [
    ['Obstacle kind', 'VENDOR ONBOARDING, not a defect. Catalogued and shape declared, and no further: not granted here, no live mapper, and OPS-17 G-139 records no secret in any of the three projects.'],
    ['Basis', stagingCam.basis, true],
    ['Who moves it', 'A commercial step at the city and the vendor, then a grant, then a mapper. Three things, in that order, none on this screen.'],
    ['Last read', 'Never. ' + kindLabel('verkada') + ' occurs ' + S.shipped.verkadaOccurrencesInVendorLive + ' times in the live module and this region is absent from the live routing table.', true],
  ],
  basis: 'The same four facts, on a different KIND of obstacle. A consent, an entitlement and an un-onboarded vendor are three different asks. Counting rule: ' + stagingCam.countingRule + '.',
})) + '\n' +
panel({
  title: 'Patrol roster', sub: 'patrol-vehicles &middot; gatedBy spireon', chip: 'Not read',
  right: 'the live path is wired and this seam is not it',
}, blocked({
  region: 'Granted, wired, and read somewhere else', domainId: 'patrol-vehicles', kind: 'spireon',
  state: stagingPatrol.status, tone: '--sc-info', wash: '--sc-info-wash',
  facts: [
    ['Obstacle kind', 'NOT AN OBSTACLE. The grant is real, the mapper exists, the routing table sends this region to it. What the seam returns is a statement about the seam, not about the city.'],
    ['Basis', stagingPatrol.basis, true],
    ['Who moves it', 'Nobody. This is the one region on this lens with a source today.'],
    ['Last read', S.shipped.vendorLiveSpireonClause + ' Recorded with that date; not re-read on 2026-09-15. No live read was performed by this design and no credential was used.', true],
  ],
  basis: 'The inversion: on the demo pack this is the empty region and cameras are full. Here it is the reverse. Rendering the two alike would destroy the distinction the product was built to preserve.',
})) + '\n' +
'          </div>\n' +
'          <div style="width:548px; flex:none; display:flex; flex-direction:column; gap:var(--sc-3); min-height:0;">\n' +
panel({
  title: 'Two sentences, one status', sub: 'why one word is not one answer',
  basis: 'Derived from the pack&rsquo;s own grants, never asserted.',
  basisWidth: 84,
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
[[ 'police-cameras', stagingCam.basis, '--sc-crit'], ['patrol-vehicles', stagingPatrol.basis, '--sc-info']].map((r, i) =>
'            <div style="display:flex; flex-direction:column; gap:3px; padding:9px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="font:400 12px/16px var(--sc-font-data); color:var(' + r[2] + ');">' + r[0] + '</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[1] + '</span></div>').join('\n') + '\n          </div>') + '\n' +
panel({
  title: 'What the live path carries, and what it drops', sub: 'a build rule, stated before the build', chip: 'Partial',
  basis: 'Each figure counted at f776b4bf, not read out of a comment.',
  basisWidth: 84,
},
'          <div style="display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-2) var(--sc-4) var(--sc-3);">\n' +
'            <p style="margin:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);"><span style="font-family:var(--sc-font-data);">operatorRef</span> is declared required on the record shape. It occurs ' + S.shipped.operatorRefInVendorLive + ' times in the live module, which runs the shape guard ' + S.shipped.assertRecordShapeInVendorLive + ' times against the seam&rsquo;s ' + S.shipped.assertRecordShapeInFixtureSeam + '. The grouping dimension does not survive the cutover and nothing fails when it goes.</p>\n' +
'            <p style="margin:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">That shape declares no field it will never carry: the camera shape declares ' + REFUSED.length + ', the fleet shape ' + SAMSARA_REFUSED.length + ', this one ' + SPIREON_REFUSED.length + '.</p>\n' +
'            <p style="margin:0; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + LIVE_ONLY_COLUMNS.length + ' of the ' + SHIPPED_PATROL_COLS.length + ' shipped columns (' + LIVE_ONLY_COLUMNS.join(', ') + ') exist only on the live record; on a granted demo pack they render blank, and a blank alert cell reads as none.</p>\n' +
'          </div>') + '\n' +
panel({
  title: 'Three distances, three kinds', sub: 'on one lens, which is why this lens is the proof',
  right: 'each a claim about its stated date',
},
'          <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0 var(--sc-2);">\n' +
[
  ['Patrol roster &middot; demo', 'A grant deliberately withheld', '--sc-warn'],
  ['Camera inventory &middot; staging', 'A vendor nobody has onboarded', '--sc-crit'],
  [refusal('Plate reads, persons of interest'), 'A class refused on purpose', '--sc-restricted'],
].map((r, i) =>
'            <div style="display:grid; grid-template-columns:214px minmax(0,1fr); gap:var(--sc-3); padding:8px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r[0] + '</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(' + r[2] + ');">' + r[1] + '</span></div>').join('\n') + '\n          </div>') + '\n' +
'          </div>\n        </div>',
});

/* --------------------------------------------------------------- emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Declined.dc.html', import.meta.url), declined);
fs.writeFileSync(new URL('./Patrol.dc.html', import.meta.url), patrolBoard);
fs.writeFileSync(new URL('./Bastrop.dc.html', import.meta.url), bastrop);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Camera inventory — every device, and the sites they group under' },
    { file: 'Declined.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Declined, not missing — a band, and three refused classes' },
    { file: 'Patrol.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'Patrol roster — built, and this city has no source for it' },
    { file: 'Bastrop.dc.html', x: 5160, y: 0, w: 1600, h: 1040, title: 'The staging pack — one status, two sentences' },
  ],
  annotations: [
    { id: 'roster', x: 0, y: -330, w: 700, text: 'EVERY DEVICE, AND PLACEMENT WHERE THE DOMAIN PUT IT.\nEighteen of eighteen on the page with no pager. The site reference is opaque and the placement vocabulary announces itself as invented, so the register answers "where is this camera" without ever carrying an address.\nPlacement leaves the device table, and that is a proposed change. The domain derives the sites once, in its own words, so a site\'s placement is stable across every camera mounted on it; drawing the placement per record would let one site render under three different names. The shipped table then repeats it on all eighteen device rows. Here it appears five times, once per site, which is how many facts there actually are.\nAnd the count that is deliberately absent: a camera is not a city inventory node, so all eighteen of these leave the asset inventory at zero.' },
    { id: 'occupancy', x: 1720, y: -330, w: 720, text: 'OCCUPANCY IS A BAND AND SOMETIMES NOTHING, AND THE NOTHING IS CAUSED.\nThe domain declares that only firmware-due and online report, so an unreporting camera cannot carry a band and a reporting one cannot carry "occupancy not measured". Eight of the sixteen cells cannot occur by rule and render hatched: absent, zero and unmeasured are three states and this grid needs a fourth.\nThe payoff is the margin. Three cameras are not reporting and three carry the not-measured band, two numbers derived by different routes, which the product never shows agreeing. Here they agree, and both margins reach eighteen.' },
    { id: 'declined', x: 2500, y: -330, w: 660, text: 'DECLINED IS NOT ABSENT, AND THE PRODUCT HAS NO WORD FOR IT.\nungranted, granted-empty, no-fixture-source and not-registered are all statements about a SOURCE. plateReads, personsOfInterest and occupancyCount are statements about a source that exists, works, and is refused: the live vendor exposes all three and the record contract declares each required:false with a basis.\nThe module says why that is the stronger control: "the seam\'s content guard would have rejected a plate string anyway, and that is the weaker of the two controls. The stronger one is that the contract names the exclusion, because a guard catches the attempt and a contract prevents it."\nThe matrix sits on this board and not beside the register because refusing occupancyCount is what MAKES the band vocabulary. One argument, one board.' },
    { id: 'three', x: 3440, y: -330, w: 700, text: 'THREE SENTENCES, ON ONE PAGE, IN THE PRODUCT\'S OWN STRINGS.\nThe patrol module says it plainly: "ungranted" is a different sentence from "Police is not built", and a different sentence again from "Spireon is granted here and returned nothing". Collapsing the last two is the defect ruling 1 closes, and this is the lens where the product proves it can tell them apart.\nThe middle one is quoted as a TEMPLATE with its placeholders showing, deliberately. granted-empty is UNREACHABLE for both Police domains through the seam: both fixture plans return a fixed non-empty set, so composeDomain can never take the zero-record branch. It is reachable only through the live read. Filling in a sentence the product cannot currently produce would be putting words in its mouth.' },
    { id: 'operator', x: 4200, y: -330, w: 680, text: 'NOBODY IS NAMED, AND THE DIMENSION STILL WORKS.\nThe same answer Fleet gives, with no second vocabulary invented for it: an opaque operator reference under a declared format, and the record states in its own basis why the name is absent, because a granted feed is where a name would come from.\nIt cannot be drawn from the shipped demo, because the region is ungranted there and drawing rows nobody composed would be fabrication. So it is composed the way the product\'s own test composes it: grant spireon on a throwaway pack, change nothing else, and the region fills.\nThat panel is the load-bearing half of the ungranted claim. If the generator were a stub, ungranted and not-built would be indistinguishable one layer down, which is how the original misreading survived three handoffs.' },
    { id: 'inversion', x: 5160, y: -330, w: 720, text: 'ONE STATUS, TWO SENTENCES, AND THE DEMO RUNS BACKWARDS.\nBoth regions read no-fixture-source on the staging pack and the seam derives two different sentences from the pack\'s own grants: Spireon is granted as a live feed this seam does not read; Verkada is not granted at all.\nPolice is the only lens of five whose regions disagree about their source, and it disagrees in OPPOSITE DIRECTIONS on the two shipped packs. The demo\'s emptiest region is the city\'s most connected one. That is computed in gen.mjs from the registry and the two grant lists, so it breaks if the product changes rather than going quietly stale.' },
    { id: 'cutover', x: 5940, y: -330, w: 700, text: 'THE GROUPING DIMENSION DOES NOT SURVIVE THE CUTOVER, AND NOTHING FAILS WHEN IT GOES.\noperatorRef is declared required:true on the spireon record shape. It occurs ZERO times in the live module, and the live path runs the shape guard zero times against the seam\'s two. A required field is simply absent on the real record and no control notices.\nThe same shape declares no field it will never carry, while the camera shape declares three and the fleet shape declares one. So the refusal that keeps a person out of the patrol roster lives only on the generated record, which the live mapper does not produce.\nAnd three of the six columns the shipped table declares exist only on the live record. Stated before the build, so the build inherits them measured.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Declined, Patrol, Bastrop + canvas.json');
console.log('  cameras: ' + cam.recordCount + ' records, all rendered; ' + cam.extras.sites.length + ' sites summing to ' + SITE_SUM);
console.log('  matrix: ' + FORBIDDEN_COUNT + ' forbidden + ' + OCCUPIED_COUNT + ' occupiable cells; margins ' + ROW_SUM + '/' + COL_SUM + '/' + CELL_SUM + '; measured zeros ' + MEASURED_ZEROS);
console.log('  not reporting ' + NOT_REPORTING + ' = not measured ' + bandCount(BANDS[0]));
console.log('  patrol on template-city: ' + patrolDemo.status + '; proving on probe-city: ' + patrolProving.recordCount + ' units over ' + OPERATORS.length + ' operator refs');
console.log('  split lenses: demo=[' + SPLIT_DEMO + '] bastrop=[' + SPLIT_BASTROP + ']');
