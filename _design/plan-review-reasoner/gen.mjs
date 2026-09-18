import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/* Plan Review -- the reasoner path.

   Operator ruling 2026-09-15: a COMPANION product, not a plan review SYSTEM.
   No markup, no batch stamping, no measurement tools, no document workflow.

   CORRECTED 2026-09-15 after an adversarial pass. The first draft's thesis was
   FALSE: it claimed no proposed dimension exists, so Pass and Fail were
   unreachable. They are reachable today. web/app.js:462 carries a live field
   "Proposed front setback (ft), if known"; it posts proposedSetbackFrontFt,
   store.mjs persists proposed_setback_front_ft, and mcp.mjs:308 feeds it to
   adjudicateMinimumSetback. adjudication.mjs:19 says so outright.

   THE REAL THESIS. The one proposed value that exists is a number a human typed
   into an intake form. No source, no sheet, no location -- the bottom rung of the
   provenance ladder. The viewer does not unlock the determination. It upgrades the
   INPUT from "someone asserted" to "the drawing says, and here".

   Everything below is read from P:\plan-review source:
     adjudication.mjs -- Pass | Fail | Unchecked. Uncertain is RESERVED (O-6) for a
       genuine conflict between two authorities; missing data is Unchecked.
     code-lookup.mjs  -- ABSENCE_KINDS x4. CODE_BOOKS["BASTROP-UDC"].title is
       "City of Bastrop Building Block B3"; its ONLY sections are 14-02-003 and
       14-02-008 (dashes, not dots). IBC2018P6.quotable === false.
     mcp.mjs          -- 14-02-003 is "District requirements (SF-1)"; 14-02-008 is
       "Permitted use table" and is adjudicated:null, therefore Unchecked, not Pass.
       A whole-chain fetch failure is a DISTINCT row that must not collapse into a
       per-section absence.
     citation.mjs     -- render is "{title} Section {sectionNumber} ({editionId})";
       a section with no CODE_BOOKS entry yields an absence carrying NO citation.

   No figure on any artboard is measured. */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const SPLIT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3v12a3 3 0 0 0 3 3h6"/><path d="m14 14 4 4-4 4"/><path d="M18 3h-4"/></svg>';
const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const EYE = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';

const DET = {
  Pass:      ['--sc-ok', '--sc-ok-wash'],
  Fail:      ['--sc-crit', '--sc-crit-wash'],
  Uncertain: ['--sc-restricted', '--sc-restricted-wash'],
  Unchecked: ['--sc-ink-3', '--sc-quiet-wash'],
};
const det = (d) => {
  const [c, w] = DET[d];
  return '<span data-determination="' + d + '" style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.05em; color:var(' + c + '); background:var(' + w + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + d + '</span>';
};
/* THE MARKERS CARRY AN ATTRIBUTE AS WELL AS THEIR TEXT, so check.mjs reads the
   badge a board claims rather than pattern-matching a colour or a position. A
   badge is a claim about source; the claim should be extractable. */
const tag = (t, c, w, attr) => '<span ' + (attr ? attr + '="' + t + '" ' : '') + 'style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(' + c + '); background:var(' + w + '); border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
const T_LIVE = () => tag('LIVE CHECK', '--sc-ok', '--sc-ok-wash', 'data-badge');
const T_PROP = () => tag('NO ADJUDICATOR', '--sc-warn', '--sc-warn-wash', 'data-badge');
const T_REV = () => tag('REVIEWER', '--sc-ink-3', '--sc-quiet-wash', 'data-marker');
const T_OWED = () => tag('CITATION OWED', '--sc-crit', '--sc-crit-wash', 'data-marker');

const topbar = (o) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-5); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Plan Review</span>\n' +
'      <span style="width:1px; height:18px; background:var(--sc-line);"></span>\n' +
'      <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">Bastrop, TX</span>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-restricted); background:var(--sc-restricted-wash); border:1px solid var(--sc-restricted); border-radius:var(--sc-r-control); padding:0 6px;">FIXTURE</span>\n' +
'      <nav style="display:flex; gap:var(--sc-5); margin-left:var(--sc-5);">\n' +
['Queue', 'Library', 'Code', 'Applicant'].map((n) =>
'        <span style="font:' + (n === o.navOn ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (n === o.navOn ? '--sc-ink' : '--sc-ink-2') + '); padding:2px 0; box-shadow:' + (n === o.navOn ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' + n + '</span>').join('\n') + '\n      </nav>\n' +
'      <div style="flex:1;"></div>\n' +
'      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">M. Leavis &middot; Building</span>\n    </header>';

const spine = (active) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
['Intake', 'Applicability', 'Findings', 'Letter'].map((s, i) => {
  const on = s === active;
  const done = ['Intake', 'Applicability', 'Findings', 'Letter'].indexOf(active) > i;
  return '          <span style="display:inline-flex; align-items:center; gap:6px; height:28px; padding:0 var(--sc-3); border-radius:var(--sc-r-full); border:1px solid var(' + (on ? '--sc-accent' : '--sc-line') + '); background:var(' + (on ? '--sc-accent-wash' : '--sc-surface') + '); font:' + (on ? '600' : '400') + ' 13px/18px var(--sc-font-ui); color:var(' + (on ? '--sc-accent-hi' : done ? '--sc-ink-2' : '--sc-ink-3') + ');">' +
  (done ? '<span style="color:var(--sc-ok); display:grid; place-items:center;">' + CHECK + '</span>' : '') + s + '</span>' +
  (i < 3 ? '<span style="color:var(--sc-line-strong); display:grid; place-items:center;">' + ARROW + '</span>' : '');
}).join('\n') + '\n' +
'          <div style="flex:1;"></div>\n' +
['Documents', 'History', 'Library'].map((r) =>
'          <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r + '</span>').join('\n') + '\n        </div>';

/* ---------- THE SHEET.
   ONE scale throughout: 4.8 px per foot, which is exactly 1" = 20' at 96dpi, so
   the title block is literally true. Lot 80' x 90'. Street is SOUTH, so the FRONT
   setback is the south gap -- the first draft put front on the north side away
   from the street, and drew four gaps at four different scales.
   Pins are offset from the dimension text they annotate rather than drawn over it. */
const PXF = 4.8;
const L = { x: 258, y: 70, w: Math.round(80 * PXF), h: Math.round(90 * PXF) };   // 384 x 432
const B = { x: 258 + Math.round(6 * PXF), y: 70 + Math.round(20 * PXF) };        // west 6', rear 20'
B.w = L.w - Math.round(6 * PXF) - Math.round(14 * PXF);                          // east 14'
B.h = L.h - Math.round(20 * PXF) - Math.round(22 * PXF);                         // front 22'

const pin = (x, y, n, tone) =>
  '<g transform="translate(' + x + ' ' + y + ')">' +
  '<circle r="12" fill="var(' + tone + ')" stroke="var(--sc-surface)" stroke-width="2"/>' +
  '<text x="0" y="4.5" text-anchor="middle" style="font:600 13px var(--sc-font-data); fill:var(--sc-surface);">' + n + '</text></g>';

const dimText = (x, y, big, small, tone) =>
  '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:500 12px var(--sc-font-data); fill:var(' + tone + ');">' + big + '</text>' +
  '<text x="' + x + '" y="' + (y + 15) + '" text-anchor="middle" style="font:500 11px var(--sc-font-data); fill:var(--sc-ink-3);">' + small + '</text>';

const SHEET = (o) => {
  const pins = o.pins === undefined ? ['1', '2', '3', '4'] : o.pins;
  return '<svg viewBox="0 0 900 640" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Site plan A-101, one scale, with pinned findings" style="display:block;">' +
  '<rect width="900" height="640" fill="var(--sc-surface)"/>' +
  '<rect x="' + L.x + '" y="' + L.y + '" width="' + L.w + '" height="' + L.h + '" fill="none" stroke="var(--sc-ink)" stroke-width="2"/>' +
  /* street, SOUTH */
  '<rect x="190" y="520" width="520" height="52" fill="var(--sc-surface-3)"/>' +
  '<text x="450" y="552" text-anchor="middle" style="font:500 13px var(--sc-font-data); fill:var(--sc-ink-3); letter-spacing:.12em;">PINE STREET</text>' +
  /* building */
  '<rect x="' + B.x + '" y="' + B.y + '" width="' + B.w + '" height="' + B.h + '" fill="var(--sc-accent)" fill-opacity=".1" stroke="var(--sc-accent)" stroke-width="2"/>' +
  '<text x="' + (B.x + B.w / 2) + '" y="' + (B.y + B.h / 2 - 4) + '" text-anchor="middle" style="font:500 14px var(--sc-font-ui); fill:var(--sc-accent-hi);">PROPOSED RESIDENCE</text>' +
  '<text x="' + (B.x + B.w / 2) + '" y="' + (B.y + B.h / 2 + 16) + '" text-anchor="middle" style="font:400 12px var(--sc-font-data); fill:var(--sc-ink-3);">60&rsquo;&thinsp;&times;&thinsp;48&rsquo; &middot; 2,880 SF</text>' +
  /* dimension leaders */
  '<path d="M' + (B.x + B.w / 2) + ' ' + (B.y + B.h) + ' L' + (B.x + B.w / 2) + ' ' + (L.y + L.h) + '" stroke="var(--sc-crit)" stroke-width="1.2" stroke-dasharray="4 3"/>' +
  '<path d="M' + (B.x + B.w / 2) + ' ' + L.y + ' L' + (B.x + B.w / 2) + ' ' + B.y + '" stroke="var(--sc-ink-3)" stroke-width="1.2" stroke-dasharray="4 3"/>' +
  '<path d="M' + L.x + ' ' + (B.y + 60) + ' L' + B.x + ' ' + (B.y + 60) + '" stroke="var(--sc-ink-3)" stroke-width="1.2" stroke-dasharray="4 3"/>' +
  '<path d="M' + (B.x + B.w) + ' ' + (B.y + 60) + ' L' + (L.x + L.w) + ' ' + (B.y + 60) + '" stroke="var(--sc-ink-3)" stroke-width="1.2" stroke-dasharray="4 3"/>' +
  /* labels, offset from where pins land */
  dimText(B.x + B.w / 2 + 96, L.y + L.h - 50, '22&rsquo;-0&Prime;', 'FRONT', '--sc-crit') +
  dimText(B.x + B.w / 2 + 96, L.y + 40, '20&rsquo;-0&Prime;', 'REAR', '--sc-ink-2') +
  dimText(L.x - 34, B.y + 64, '6&rsquo;-0&Prime;', 'SIDE W', '--sc-ink-2') +
  dimText(L.x + L.w + 36, B.y + 64, '14&rsquo;-0&Prime;', 'SIDE E', '--sc-ink-2') +
  /* north arrow */
  '<g transform="translate(796 120)"><path d="M0 -26 L9 12 L0 4 L-9 12 Z" fill="var(--sc-ink-2)"/><text x="0" y="30" text-anchor="middle" style="font:600 12px var(--sc-font-data); fill:var(--sc-ink-2);">N</text></g>' +
  /* title block */
  '<rect x="0" y="592" width="900" height="48" fill="var(--sc-surface-2)" stroke="var(--sc-line-faint)"/>' +
  '<text x="20" y="622" style="font:600 14px var(--sc-font-data); fill:var(--sc-ink);">A-101</text>' +
  '<text x="88" y="622" style="font:400 13px var(--sc-font-ui); fill:var(--sc-ink-2);">SITE PLAN &middot; 908 PINE ST &middot; 1&Prime; = 20&rsquo; &middot; lot 80&rsquo;&thinsp;&times;&thinsp;90&rsquo;</text>' +
  '<text x="880" y="622" text-anchor="end" style="font:400 12px var(--sc-font-data); fill:var(--sc-ink-3);">sheet 1 of 6 &middot; ' + (o.cycle || 'cycle 1') + '</text>' +
  (pins.includes('1') ? pin(B.x + B.w / 2, L.y + L.h - 50, '1', '--sc-crit') : '') +
  (pins.includes('3') ? pin(L.x - 34, B.y + 130, '3', '--sc-ink-3') : '') +
  (pins.includes('4') ? pin(B.x + B.w / 2, L.y + 40, '4', '--sc-ink-3') : '') +
  (pins.includes('2') ? pin(B.x, B.y + B.h - 44, '2', '--sc-restricted') : '') +
  '</svg>';
};

const fRow = (f) =>
'            <div data-finding="' + (f.pin || 'none') + '" data-rule="' + f.t + '" data-book="' + (f.book || '') + '" data-section="' + (f.section || '') + '" data-determination="' + f.d + '" data-author="' + (f.author || 'machine') + '" data-citation="' + (f.cite || '') + '" data-live="' + (f.live ? '1' : '0') + '" style="display:flex; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); ' + (f.on ? 'background:var(--sc-accent-wash); box-shadow:inset 2px 0 0 var(--sc-accent);' : '') + '">\n' +
'              <span style="flex:none; width:22px; height:22px; border-radius:var(--sc-r-full); display:grid; place-items:center; font:600 12px var(--sc-font-data); color:var(--sc-surface); background:var(' + f.tone + ');">' + (f.pin || '&middot;') + '</span>\n' +
'              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">\n' +
'                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + f.t + '</span>' + det(f.d) +
  /* ONE badge on every finding, machine or reviewer, because it is a claim about
     whether an adjudicator exists for the rule -- not about who determined it.
     A reviewer's Uncertain did not come from an adjudicator either, and leaving
     the badge off those rows is how the draft's "every other rule is badged"
     became untrue on the one board that had to say it. */
  tag(f.live ? 'LIVE CHECK' : 'NO ADJUDICATOR', f.live ? '--sc-ok' : '--sc-warn', f.live ? '--sc-ok-wash' : '--sc-warn-wash', 'data-badge') +
  (f.author === 'reviewer' ? T_REV() : '') + (f.cite ? '' : T_OWED()) + '</div>\n' +
'                <div style="font:400 12px/17px var(--sc-font-data); color:var(' + (f.cite ? '--sc-ink-2' : '--sc-ink-3') + ');">' + (f.cite || 'No citation. The section is not in our corpus, so none can be built.') + '</div>\n' +
'                <div style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + f.d2 + '</div>\n              </div>\n            </div>';

const panel = (o) =>
'        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;' + (o.grow ? ' flex:1; min-height:0;' : '') + '">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
'            <div style="flex:1;"></div>\n' + (o.right || '') + '\n          </div>\n' + o.body + '\n        </section>';

const basis = (t, w) =>
'            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); ' + (w ? 'max-width:' + w + ';' : '') + '">' + t + '</div>';

const link = (l) =>
'              <div ' + (l.attr || '') + ' style="display:flex; gap:var(--sc-3); padding:var(--sc-3) 0; ' + (l.last ? '' : 'border-bottom:1px solid var(--sc-line-faint);') + '">\n' +
'                <div style="flex:none; width:104px; font:500 12px/17px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3); padding-top:1px;">' + l.k + '</div>\n' +
'                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
'                  <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + l.v + '</div>\n' +
(l.meta ? '                  <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-2);">' + l.meta + '</div>\n' : '') +
(l.flag ? '                  <div style="font:400 12px/17px var(--sc-font-ui); color:var(' + l.flagTone + ');">' + l.flag + '</div>\n' : '') +
'                </div>\n' + (l.act ? '                <div style="flex:none;">' + l.act + '</div>\n' : '') + '              </div>';

const btn = (t, kind) => {
  const s = kind === 'primary' ? 'background:var(--sc-accent); color:var(--sc-on-accent); border:1px solid var(--sc-accent);'
    : kind === 'danger' ? 'background:var(--sc-surface); color:var(--sc-crit); border:1px solid var(--sc-crit);'
    : 'background:var(--sc-surface); color:var(--sc-ink); border:1px solid var(--sc-line-strong);';
  return '<span style="display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); font:500 13px/18px var(--sc-font-ui); ' + s + '">' + t + '</span>';
};
const ghost = (t) => '<span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent);">' + t + '</span>';

const shell = (o) =>
  '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
  '<div class="{{themeClass}}" style="width:1600px; height:' + o.h + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
  topbar({ navOn: o.navOn || 'Queue' }) + '\n' +
  '    <main data-board="' + o.board + '" style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
  '        <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
  '          <div style="display:flex; align-items:center; gap:var(--sc-3); flex-wrap:wrap;">\n' +
  '            <h1 style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.02em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>\n' +
  '            <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">' + o.meta + '</span>\n' +
  '            <div style="flex:1;"></div>' + (o.hdrRight || '') + '\n          </div>\n' +
  (o.spine ? spine(o.spine) + '\n' : '') + '        </div>\n' +
  o.body + '\n    </main>\n  </div>\n</x-dc>\n' +
  '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"light"}}\'>\n' +
  'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "light") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';

/* Citations: exactly what renderCitationText() produces, from real CODE_BOOKS
   titles and the only two UDC sections that exist. Dashes, not dots. */
const CITE_003 = 'City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)';
const CITE_008 = 'City of Bastrop Building Block B3 Section 14-02-008 (bastrop_tx-bdc-2026-adopted)';
const CITE_IBC = '2018 International Building Code Section 705.5 (IBC-2018)';

/* ONE numbering, used identically on every artboard. Pin numbers are the finding
   numbers; a finding with no place on a sheet has no pin and says so.

   `live` is whether an adjudicator EXISTS for the rule, which is the badge; it
   is NOT whether this finding passed. `author` is who determined it. The two are
   independent and the draft conflated them. */
const F = [
  { pin: '1', t: 'Front setback', d: 'Fail', tone: '--sc-crit', live: true, author: 'machine',
    book: 'BASTROP-UDC', section: '14-02-003', cite: CITE_003,
    d2: 'Proposed 22\u2032-0\u2033 is below the 25\u2032-0\u2033 minimum for SF-1.', on: true },
  { pin: '2', t: 'Fire separation distance', d: 'Uncertain', tone: '--sc-restricted', live: false, author: 'reviewer',
    book: 'IBC2018P6', section: '705.5', cite: CITE_IBC,
    d2: 'M. Leavis recorded a conflict between two adopted authorities for the west wall, 12 Sep.' },
  { pin: '3', t: 'Side setback, west', d: 'Unchecked', tone: '--sc-ink-3', live: false, author: 'machine',
    book: '', section: '', cite: null,
    d2: 'Only the front setback has an adjudicator. This rule is drawn, not built.' },
  { pin: '4', t: 'Rear setback', d: 'Unchecked', tone: '--sc-ink-3', live: false, author: 'machine',
    book: '', section: '', cite: null,
    d2: 'Only the front setback has an adjudicator. This rule is drawn, not built.' },
  { pin: null, t: 'Permitted use', d: 'Unchecked', tone: '--sc-ink-3', live: false, author: 'machine',
    book: 'BASTROP-UDC', section: '14-02-008', cite: CITE_008,
    d2: 'Permitted use is not a numeric comparison, so there is nothing to adjudicate against. Cited, not evaluated. No place on a sheet.' },
  { pin: null, t: 'Driveway width', d: 'Fail', tone: '--sc-crit', live: false, author: 'reviewer',
    book: '', section: '', cite: null,
    d2: 'Added by M. Leavis from C-101. Cannot enter the letter until a section is supplied.' },
];

/* THE DESIGN'S OWN COUNTS, DECLARED ONCE.
   Three surfaces print these numbers -- the console's filter chips, Coverage's
   two axes, and the letter's correction notice -- and a draft of this board had
   them disagree with each other: the chips read "Unchecked 9 ... Pass 1" while
   Coverage said 10 not evaluated and the letter said 10 not evaluated too. The
   Pass was the permitted-use row that the corrections section says was drawn
   where source sets adjudicated:null, and it survived in a filter chip after it
   was removed from the finding list. Numbers typed at three surfaces agreed only
   because somebody had checked them by eye.

   `check.mjs` compares every one of these to the PRODUCT's own composeReasoner()
   output over the same 13-finding scope (source-state.json), so a design number
   and a product number that disagree is a failure and not a difference of
   opinion. `Pass: 0` is here rather than absent on purpose: an adjudicator for
   permitted use does not exist, so a Pass is not a number this product can
   produce, and typing the zero is what makes that visible. */
const COUNTS = {
  findings: 13,
  determinations: { Fail: 2, Uncertain: 1, Unchecked: 10, Pass: 0 },
  corpus: { 'absent-verified': 2, 'not-entitled': 1, 'source-unavailable': 1, unchecked: 5 },
  reasoning: 1,
  notice: { corrections: 1, escalations: 1, notEvaluated: 10, heldBack: 1 },
};
const CORPUS_TOTAL = Object.values(COUNTS.corpus).reduce((a, b) => a + b, 0);
const NOTICE_TOTAL = Object.values(COUNTS.notice).reduce((a, b) => a + b, 0);
const DRAWN = F.length;

/* =======================  1. CONSOLE  ======================= */
const consoleBoard = shell({
  board: 'console', h: 1240, navOn: 'Queue', spine: 'Findings', h1: 'PR-2026-0418',
  meta: '908 PINE ST &middot; single-family &middot; cycle 1 &middot; edition declared',
  hdrRight: ghost('Open in Dashboards'),
  body:
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    '          <div style="flex:1; min-width:0; display:flex; flex-direction:column; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); overflow:hidden;">\n' +
    '            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
    ['A-101', 'A-102', 'A-201', 'S-101', 'C-101', 'E-101'].map((s, i) =>
    '              <span style="font:' + (i === 0 ? '600' : '400') + ' 13px/18px var(--sc-font-data); color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-3') + '); padding:3px 0; box-shadow:' + (i === 0 ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' + s + '</span>').join('\n') + '\n' +
    '              <div style="flex:1;"></div>\n' +
    '              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">6 sheets &middot; cycle 1</span>\n            </div>\n' +
    '            <div style="flex:1; min-height:0; background:var(--sc-surface-2);">' + SHEET({}) + '</div>\n' +
    '            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); border-top:1px solid var(--sc-line-faint);">\n' +
    '              ' + btn('Capture a dimension', 'primary') + '\n' +
    '              <span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">The front setback currently comes from a number typed on the intake form. Capturing it from the sheet gives it a source and a place.</span>\n            </div>\n          </div>\n' +
    '          <aside style="width:504px; flex:none; display:flex; flex-direction:column; min-height:0;">\n' +
    panel({
      grow: true, title: 'Findings', sub: '13 &middot; 12 rules in scope plus 1 added by a reviewer',
      right: ghost('Add a finding'),
      body:
        '            <div style="display:flex; gap:var(--sc-1); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); flex-wrap:wrap;">' +
        ['All ' + COUNTS.findings].concat(Object.entries(COUNTS.determinations).map(([d, n]) => d + ' ' + n)).map((f, i) =>
        '<span data-chip="' + f + '" style="font:500 12px/16px var(--sc-font-ui); padding:3px 9px; border-radius:var(--sc-r-full); color:var(' + (i === 0 ? '--sc-ink' : '--sc-ink-2') + '); background:var(' + (i === 0 ? '--sc-surface-3' : '--sc-surface-2') + ');">' + f + '</span>').join('') +
        '</div>\n' +
        '            <div style="flex:1; min-height:0; overflow:hidden;">\n' + F.map(fRow).join('\n') + '\n' +
        '              <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">Showing ' + DRAWN + ' of ' + COUNTS.findings + '. The other ' + (COUNTS.findings - DRAWN) + ' are Unchecked with no place on a sheet; they are on Coverage.</div>\n            </div>' +
        basis('One numbering, used on every screen and in the letter. A reviewer-authored finding sits in the same list as a machine one and is distinguished only by author.'),
    }) + '\n          </aside>\n        </div>',
});

/* =======================  2. REASONING  ======================= */
/* THE PROVENANCE LADDER, declared here with the product's own rung names.
   `check.mjs` compares these against PROVENANCE_RUNGS in the product and
   against `PROVENANCE_UPGRADE.built`, so the day G-107 lands and the top rung
   becomes real, this board fails until the claim is withdrawn. That is the
   point: a board asserting "not built" is a claim with an expiry date. */
const RUNG = 'form-assertion';
const RUNG_NEXT = 'captured-reading';

const reasoning = shell({
  board: 'reasoning', h: 1200, navOn: 'Queue', spine: 'Findings', h1: 'Finding 1 \u2014 Front setback',
  meta: 'PR-2026-0418 &middot; the one rule with a live adjudicator &middot; pinned to A-101',
  hdrRight: det('Fail'),
  body:
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    '          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'How this was reached', sub: 'three links, each one breakable',
      body:
        '            <div style="padding:var(--sc-1) var(--sc-4) var(--sc-3);">\n' +
        [
          { k: 'Rule', v: 'Minimum front setback in SF-1 is 25\u2032-0\u2033.',
            meta: CITE_003 + ' &middot; District requirements (SF-1) &middot; edition declared at intake, not derived from the jurisdiction',
            act: ghost('Read section') },
          { k: 'Input', v: 'Proposed front setback 22\u2032-0\u2033.',
            meta: 'Typed into the intake form on 11 Sep. No sheet, no location, no source.',
            attr: 'data-provenance="' + RUNG + '" data-provenance-next="' + RUNG_NEXT + '" data-provenance-next-built="0"',
            flag: 'Lowest provenance on the ladder. It is an assertion by whoever filled the form, and nothing ties it to the drawing. Capturing the same value from the dimension string on A-101 would move it to the top rung.',
            flagTone: '--sc-warn', act: ghost('Capture from sheet') },
          { k: 'Comparison', v: '22\u2032-0\u2033 is less than 25\u2032-0\u2033, so the rule is not met.',
            meta: 'A numeric comparison, stated so a reviewer can check it by hand.', last: true },
        ].map(link).join('\n') + '\n            </div>\n' +
        '            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
        '              ' + btn('Accept into the letter', 'primary') + '\n              ' + btn('Edit the comment') + '\n              ' + btn('Dismiss', 'danger') + '\n' +
        '              <div style="flex:1;"></div>\n' +
        '              <span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Dismissing asks which link broke.</span>\n            </div>',
    }) + '\n' +
    panel({
      grow: true, title: 'If you dismiss this', sub: 'the reason is the product, not a formality',
      body:
        '            <div style="padding:var(--sc-4);">\n              <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
        [
          ['The rule does not apply here', 'applicability &mdash; wrong district, use or edition'],
          ['The rule is right, the input is wrong', 'input &mdash; the typed value does not match the drawing'],
          ['Both are right, the conclusion is not', 'adjudication &mdash; an exception or variance the comparison does not know'],
          ['Correct, but I am not citing it', 'judgement &mdash; kept, and not sent to the applicant'],
        ].map(([a, b]) =>
        '                <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control);"><span style="flex:none; width:16px; height:16px; border-radius:var(--sc-r-full); border:1px solid var(--sc-line-strong);"></span><span style="flex:none; font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink);">' + a + '</span><span style="flex:1; font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-3);">' + b + '</span></div>').join('\n') +
        '\n              </div>\n            </div>' +
        basis('Four reasons because a finding fails in four different places and only one of them means the finding was wrong. A dismissal that names WHICH LINK BROKE is how the reasoning earns its confidence instead of asserting it. A free-text box would tell us nothing. Today the second reason would be the common one, because the input is a typed number.', '114ch'),
    }) + '\n          </div>\n' +
    '          <aside style="width:520px; flex:none; display:flex; flex-direction:column; min-height:0;">\n' +
    panel({
      grow: true, title: 'A-101', sub: 'pinned at the front setback',
      right: '<span style="display:inline-flex; align-items:center; gap:5px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + EYE + '<span>only this finding</span></span>',
      body: '            <div style="flex:1; min-height:0; background:var(--sc-surface-2);">' + SHEET({ pins: ['1'] }) + '</div>',
    }) + '\n          </aside>\n        </div>',
});

/* =======================  3. COVERAGE  ======================= */
const covRow = (r) =>
'            <div data-absence-kind="' + r.k + '" data-absence-count="' + r.n + '" style="display:grid; grid-template-columns:156px 62px minmax(0,1fr); gap:0 var(--sc-4); align-items:start; padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              <span style="font:600 13px/19px var(--sc-font-data); color:var(' + r.tone + ');">' + r.k + '</span>\n' +
'              <span style="font:400 20px/24px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink); text-align:right;">' + r.n + '</span>\n' +
'              <div style="display:flex; flex-direction:column; gap:2px;"><span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink);">' + r.what + '</span><span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + r.says + '</span></div>\n            </div>';

const coverage = shell({
  board: 'coverage', h: 1200, navOn: 'Queue', spine: 'Findings', h1: 'What was checked, and what was not',
  meta: 'PR-2026-0418 &middot; 12 rules in scope for SF-1 and this use',
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-accent); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5);">\n' +
    '          <div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:3px;">' + COUNTS.notice.corrections + ' of 12 rules was actually evaluated. ' + COUNTS.notice.escalations + ' was escalated. ' + (CORPUS_TOTAL + COUNTS.reasoning) + ' were not evaluated.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:110ch;">One evaluated rule is not a failure of honesty, it is the honest number: exactly one adjudicator is built. The ten are broken out below on two axes that must never be added together, and both appear in the applicant\u2019s letter.</div>\n        </section>\n' +
    panel({
      title: 'Our corpus could not supply the rule', sub: CORPUS_TOTAL + ' &middot; four kinds, from the service\u2019s own absence taxonomy',
      body:
        [
          { k: 'absent-verified', tone: '--sc-ok', n: String(COUNTS.corpus['absent-verified']), what: 'Read the adopted edition and confirmed the section is not in it.',
            says: 'The strong claim. There is no such requirement in this jurisdiction, and we looked. Safe to stop worrying about.' },
          { k: 'not-entitled', tone: '--sc-restricted', n: String(COUNTS.corpus['not-entitled']), what: 'Behind a licence this product does not hold.',
            says: 'The section is cited and its text is not reproduced. We will not paraphrase a code we are not licensed to quote.' },
          { k: 'source-unavailable', tone: '--sc-warn', n: String(COUNTS.corpus['source-unavailable']), what: 'Ingested, but the body could not be retrieved on this run.',
            says: 'A transient fault on our side, not a statement about the code. Re-running may resolve it.' },
          { k: 'unchecked', tone: '--sc-ink-3', n: String(COUNTS.corpus.unchecked), what: 'Never ingested into our corpus.',
            says: 'A statement about what we hold, not about the code book. The requirement may well apply. A human must check it.' },
        ].map(covRow).join('\n') +
        basis('These four are the reason a reviewer can trust the one. `unchecked` is a claim about OUR CORPUS; `absent-verified` is a claim about the CODE. Collapsing them would let a gap in our ingest read as a clean bill of health.', '120ch'),
    }) + '\n' +
    '        <div style="display:flex; gap:var(--sc-4);">\n' +
    panel({
      title: 'A different axis', sub: COUNTS.reasoning + ' &middot; nothing to do with the corpus',
      body:
        '            <div style="padding:var(--sc-4) var(--sc-5); display:flex; flex-direction:column; gap:3px;">\n' +
        '              <div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">No adjudicator is built for this rule.</div>\n' +
        '              <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Permitted use is cited and readable. It is not a numeric comparison, so there is nothing to adjudicate a proposal against. The corpus is fine; the reasoning does not exist yet.</div>\n' +
        '              <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">Counted apart from the nine above on purpose. A corpus gap and a reasoning gap are different problems with different owners.</div>\n            </div>',
    }) + '\n' +
    panel({
      title: 'And one the taxonomy cannot describe', sub: 'the whole chain, not a section',
      body:
        '            <div data-whole-chain="1" data-whole-chain-collapses="to-one-row" style="padding:var(--sc-4) var(--sc-5); display:flex; flex-direction:column; gap:3px;">\n' +
        '              <div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">If the corpus itself is unreachable, that is one row, not twelve.</div>\n' +
        '              <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A whole-chain fetch failure must not be rendered as twelve per-section absences. Twelve identical failures read as twelve findings about the code; they are one finding about us.</div>\n' +
        '              <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">Required by the service already, and not shown on this page in the first draft.</div>\n            </div>',
    }) + '\n        </div>\n' +
    panel({
      grow: true, title: 'Uncertain is not on this page', sub: 'and this is why',
      body:
        '            <div style="display:flex; align-items:flex-start; gap:var(--sc-4); padding:var(--sc-4) var(--sc-5);">\n' +
        '              <span style="flex:none; color:var(--sc-restricted); display:grid; place-items:center; padding-top:2px;">' + SPLIT + '</span>\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
        '                <div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">Uncertain means two authorities disagree, not that we are unsure.</div>\n' +
        '                <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:116ch;">No code path emits Uncertain. It is a reviewer override and it requires a written reason recorded with a name and a time, which is why finding 2 is attributed to M. Leavis. The reviewer names the conflict; the product does not characterise the codes, and never picks one.</div>\n' +
        '                <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">Reserved by the transaction contract, rule O-6. Missing data is Unchecked and lives on this page.</div>\n              </div>\n            </div>',
    }),
});

/* =======================  4. LETTER  ======================= */
const lRow = (r) =>
'                <div style="display:flex; gap:var(--sc-4); padding:var(--sc-4) 0; border-bottom:1px solid var(--sc-line-faint);">\n' +
'                  <span style="flex:none; width:26px; font:600 14px/20px var(--sc-font-data); color:var(--sc-ink-2);">' + r.n + '</span>\n' +
'                  <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">\n' +
'                    <div style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + r.t + '</div>\n' +
'                    <div style="font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:92ch;">' + r.body + '</div>\n' +
'                    <div style="display:flex; gap:var(--sc-4); flex-wrap:wrap; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);"><span>' + r.cite + '</span><span>Sheet ' + r.sheet + '</span><span>' + r.who + '</span></div>\n                  </div>\n                </div>';

const WORDS = ['zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen'];
const word = (n) => WORDS[n] || String(n);

const letter = shell({
  board: 'letter', h: 1280, navOn: 'Queue', spine: 'Letter', h1: 'Correction notice',
  meta: 'PR-2026-0418 &middot; cycle 1 &middot; draft, not issued',
  hdrRight: btn('Issue to applicant', 'primary'),
  body:
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    '          <div style="flex:1; min-width:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); overflow:hidden; display:flex; flex-direction:column;">\n' +
    '            <div style="flex:1; min-height:0; padding:var(--sc-7) var(--sc-9); overflow:hidden;">\n' +
    '              <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding-bottom:var(--sc-4); border-bottom:2px solid var(--sc-ink);">\n' +
    '                <span style="font:650 22px/28px var(--sc-font-ui); letter-spacing:-.018em; color:var(--sc-ink);">Correction notice</span>\n' +
    '                <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">PR-2026-0418 &middot; cycle 1 &middot; 908 PINE ST</span>\n              </div>\n' +
    '              <p style="margin:var(--sc-4) 0 var(--sc-5); max-width:94ch; font:400 14px/22px var(--sc-font-ui); color:var(--sc-ink-2);">' + word(COUNTS.notice.corrections) + ' item must be corrected before this application can be approved. ' + word(COUNTS.notice.escalations) + ' further item is escalated to a reviewer and is not a correction. ' + word(COUNTS.notice.notEvaluated) + ' rules in scope could not be evaluated and are listed at the end; none of them is an approval.</p>\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin-bottom:var(--sc-1);">Corrections required &mdash; ' + COUNTS.notice.corrections + '</div>\n' +
    lRow({ n: '1.', t: 'Front setback', cite: CITE_003, sheet: 'A-101', who: 'Automated check, accepted by M. Leavis',
      body: 'The proposed front setback of 22\u2032-0\u2033 is less than the 25\u2032-0\u2033 minimum for the SF-1 district. Revise the site plan or apply for a variance. The proposed figure was taken from your application form; if the drawing shows a different dimension, tell us and we will re-check against the sheet.' }) + '\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Escalated, not a correction &mdash; ' + COUNTS.notice.escalations + '</div>\n' +
    lRow({ n: '2.', t: 'Fire separation distance', cite: CITE_IBC, sheet: 'A-101', who: 'M. Leavis, Building &middot; reviewer override, 12 Sep',
      body: 'A reviewer has recorded that two adopted authorities conflict for the west wall. That conflict is being resolved inside the city and is not a defect in your drawing. No action is required from you on this item. <span data-refusal="1" style="color:var(--sc-ink-2);">The text of the cited section is not reproduced here; this product is not licensed to quote it.</span>' }) + '\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Not evaluated &mdash; ' + COUNTS.notice.notEvaluated + '</div>\n' +
    '              <p style="margin:0; max-width:94ch; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Five sections are not in our corpus, two were read and confirmed not to apply in this jurisdiction, one is behind a licence we do not hold, one could not be retrieved on this run, and one has no automated check built. Each is named with its reason in the attached list. <strong>None of this is an approval.</strong></p>\n            </div>\n' +
    '            <div style="flex:none; padding:var(--sc-3) var(--sc-9); border-top:1px solid var(--sc-line-faint); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Items marked as an automated check were produced by a comparison against the adopted editions named above, and reviewed by the named reviewer before issue.</div>\n          </div>\n' +
    '          <aside style="width:430px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'What goes in', sub: COUNTS.findings + ' findings &middot; ' + (COUNTS.notice.corrections + COUNTS.notice.escalations) + ' printed individually',
      body:
        '            <div data-notice-total="' + NOTICE_TOTAL + '" style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [
          [COUNTS.notice.corrections + ' accepted', 'printed as a correction', '--sc-crit', 'corrections'],
          [COUNTS.notice.escalations + ' escalated', 'own heading, no action asked of the applicant', '--sc-restricted', 'escalations'],
          [COUNTS.notice.notEvaluated + ' not evaluated', 'summarised by reason, full list attached', '--sc-ink-3', 'notEvaluated'],
          [COUNTS.notice.heldBack + ' held back', 'reviewer finding with no citation yet', '--sc-warn', 'heldBack'],
        ].map(([a, b, t, k]) =>
        '              <div data-notice="' + k + '" data-count="' + COUNTS.notice[k] + '" style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><span style="flex:none; font:600 13px/19px var(--sc-font-data); color:var(' + t + '); width:114px;">' + a + '</span><span style="flex:1; font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + b + '</span></div>').join('\n') +
        '\n            </div>' + basis(Object.values(COUNTS.notice).slice(0, 4).join(' + ') + ' = ' + NOTICE_TOTAL + '.'),
    }) + '\n' +
    panel({
      title: 'Held back', sub: 'finding 6 &middot; driveway width',
      body:
        '            <div style="display:flex; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-4);">\n' +
        '              <span style="flex:none; color:var(--sc-warn); display:grid; place-items:center; padding-top:2px;">' + LOCK + '</span>\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
        '                <div style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink);">No citation, so it cannot be issued.</div>\n' +
        '                <div style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">A citation cannot be built without an edition, a book and a section. The reviewer is confident and the finding may well be right; it does not go to an applicant on confidence alone.</div>\n              </div>\n            </div>',
    }) + '\n' +
    panel({
      grow: true, title: 'Resubmittal manifest', sub: 'machine-readable, attached',
      body:
        '            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/19px var(--sc-font-data); color:var(--sc-ink-2); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line-faint);">' +
        ['{', '&nbsp;&nbsp;"engagement": "PR-2026-0418",', '&nbsp;&nbsp;"cycle": 1,', '&nbsp;&nbsp;"corrections": [', '&nbsp;&nbsp;&nbsp;&nbsp;{ "finding": 1, "sheet": "A-101",', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"bookId": "BASTROP-UDC",', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sectionNumber": "14-02-003",', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"editionId": "bastrop_tx-bdc-2026-adopted" }', '&nbsp;&nbsp;]', '}'].join('<br>') + '</div>' +
        basis('The same structured fields the service stores, not a rendered string. Finding numbers match the console and the letter.'),
    }) + '\n          </aside>\n        </div>',
});

/* =======================  5. CYCLE 2  ======================= */
const c2Row = (r) =>
'            <div data-finding="' + r.n + '" data-rule="' + r.t + '" data-book="' + (r.book || '') + '" data-section="' + (r.section || '') + '" data-determination="' + r.d + '" data-was="' + r.was + '" data-author="' + r.author + '" data-citation="' + (r.c || '') + '" data-live="' + (r.live ? '1' : '0') + '" style="display:grid; grid-template-columns:30px minmax(0,1.4fr) 128px 232px minmax(0,1.2fr); gap:0 var(--sc-4); align-items:center; min-height:56px; padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              <span style="width:22px; height:22px; border-radius:var(--sc-r-full); display:grid; place-items:center; font:600 12px var(--sc-font-data); color:var(--sc-surface); background:var(' + r.tone + ');">' + r.n + '</span>\n' +
'              <div style="display:flex; flex-direction:column; gap:1px; min-width:0;"><span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + r.t + '</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + r.cite + '</span></div>\n' +
'              <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">' + r.was + '</span>\n' +
/* One cell holds the determination and the badge together, because the badge is a
   claim about the same rule and splitting them across cells invites reading one
   without the other. A carried-forward reviewer finding names its reviewer here
   too: an Uncertain that appears on a surface without a name is an Uncertain that
   arrived from nowhere, and this board is the one that says what carried over. */
'              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">' + det(r.d) +
  tag(r.live ? 'LIVE CHECK' : 'NO ADJUDICATOR', r.live ? '--sc-ok' : '--sc-warn', r.live ? '--sc-ok-wash' : '--sc-warn-wash', 'data-badge') +
  (r.author === 'reviewer' ? tag('M. LEAVIS', '--sc-restricted', '--sc-restricted-wash', 'data-reviewer') : '') + '</div>\n' +
'              <span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-3);">' + r.note + '</span>\n            </div>';

const cycle = shell({
  board: 'cycle', h: 1160, navOn: 'Queue', spine: 'Findings', h1: 'Cycle 2',
  meta: 'PR-2026-0418 &middot; resubmitted 14 Sep &middot; 2 sheets changed of 6',
  hdrRight: ghost('Compare A-101 against cycle 1'),
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-info); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5); display:flex; align-items:center; gap:var(--sc-6);">\n' +
    '          <div style="flex:1; min-width:0;"><div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:2px;">The one correction was resolved. Nothing else moved, and most of it could not.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:104ch;">A-101 and C-101 were resubmitted. Sheets that did not change are not re-reviewed and their findings carry forward untouched rather than being re-derived.</div></div>\n' +
    '          <div style="flex:none; display:flex; gap:var(--sc-5); padding-left:var(--sc-5); border-left:1px solid var(--sc-line-faint);">' +
    [['1', 'resolved', '--sc-ok'], ['3', 'carried forward', '--sc-ink-3'], ['1', 'basis changed', '--sc-warn']].map(([n, k, t]) =>
    '<div style="display:flex; flex-direction:column; align-items:flex-end;"><span style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + t + ');">' + n + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + k + '</span></div>').join('') +
    '</div>\n        </section>\n' +
    panel({
      grow: true, title: 'Cycle 1 findings against cycle 2', sub: '5 shown &middot; nothing is re-derived on an unchanged sheet',
      body:
        '            <div style="display:grid; grid-template-columns:30px minmax(0,1.4fr) 128px 232px minmax(0,1.2fr); gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
        ['', 'Finding', 'Cycle 1', 'Cycle 2', 'What changed'].map((h) =>
        '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('\n') + '\n            </div>\n' +
        [
          { n: '1', tone: '--sc-ok', t: 'Front setback', cite: CITE_003, c: CITE_003, book: 'BASTROP-UDC', section: '14-02-003', live: true, d: 'Pass', was: 'Fail 22\u2032-0\u2033', author: 'machine', note: 'A-101 revised to 25\u2032-0\u2033, and this time the value was captured from the sheet rather than typed on a form.' },
          { n: '2', tone: '--sc-restricted', t: 'Fire separation distance', cite: CITE_IBC, c: CITE_IBC, book: 'IBC2018P6', section: '705.5', live: false, d: 'Uncertain', was: 'Uncertain', author: 'reviewer', note: 'Carried. The conflict is between two authorities and no resubmittal can resolve it.' },
          { n: '3', tone: '--sc-ink-3', t: 'Side setback, west', cite: 'No citation', c: null, book: '', section: '', live: false, d: 'Unchecked', was: 'Unchecked', author: 'machine', note: 'Carried. Still no adjudicator and still no section in our corpus.' },
          { n: '5', tone: '--sc-warn', t: 'Permitted use', cite: CITE_008, c: CITE_008, book: 'BASTROP-UDC', section: '14-02-008', live: false, d: 'Unchecked', was: 'Unchecked', author: 'machine', note: 'BASIS CHANGED. The applicant supplied the use on the revised sheet, and it is still Unchecked \u2014 because what is missing is our adjudicator, not their data.' },
          { n: '6', tone: '--sc-crit', t: 'Driveway width', cite: 'Citation owed', c: null, book: '', section: '', live: false, d: 'Fail', was: 'Fail, held', author: 'reviewer', note: 'Carried, still held back. C-101 changed; the finding still has no section, so it still cannot be issued.' },
        ].map(c2Row).join('\n') +
        basis('Finding 5 is the case that justifies the two axes on Coverage. A value arrived from the applicant and the determination did not move, because the gap was never theirs. A product that treated "not evaluated" as one bucket would have told them to resubmit something that would not have helped.', '130ch'),
    }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), consoleBoard);
fs.writeFileSync(new URL('./Reasoning.dc.html', import.meta.url), reasoning);
fs.writeFileSync(new URL('./Coverage.dc.html', import.meta.url), coverage);
fs.writeFileSync(new URL('./Letter.dc.html', import.meta.url), letter);
fs.writeFileSync(new URL('./Cycle.dc.html', import.meta.url), cycle);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1240, title: 'Console — sheet, pins, findings' },
    { file: 'Reasoning.dc.html', x: 1720, y: 0, w: 1600, h: 1200, title: 'Finding 1 — how it was reached' },
    { file: 'Coverage.dc.html', x: 3440, y: 0, w: 1600, h: 1200, title: 'What was not checked, on two axes' },
    { file: 'Letter.dc.html', x: 0, y: 1440, w: 1600, h: 1280, title: 'The correction notice — the product' },
    { file: 'Cycle.dc.html', x: 1720, y: 1440, w: 1600, h: 1160, title: 'Cycle 2 — resolved, carried, basis changed' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -360, w: 660, text: 'PLAN REVIEW — THE REASONER PATH.\nOperator ruling 2026-09-15: a COMPANION product, not a plan review system. No markup, no batch stamping, no measurement tools, no document workflow.\nDrawn against P:\\plan-review source. Citations use the real CODE_BOOKS title and the only two UDC sections that exist, rendered exactly as renderCitationText() does.\nFIXTURE throughout.' },
    { id: 'thesis', x: 720, y: -360, w: 720, text: 'THE THESIS — CORRECTED. The first draft claimed no proposed dimension exists and the viewer unlocks Pass/Fail. THAT WAS FALSE and the code said so plainly.\nA live intake field "Proposed front setback (ft), if known" posts a value, the store persists it, and the adjudicator uses it. Pass and Fail are reachable TODAY.\nWhat the viewer changes is PROVENANCE, not reachability: the only proposed value in the system is a number someone typed on a form, with no source and no place. "Capture a dimension" moves it from an assertion to a reading.' },
    { id: 'honest', x: 1720, y: -360, w: 680, text: 'ONE RULE HAS AN ADJUDICATOR. THE SCREEN SAYS SO.\nadjudicateMinimumSetback is called exactly once, for the FRONT setback. So finding 1 carries LIVE CHECK, and side and rear setback carry NO ADJUDICATOR — drawn, not built.\nPermitted use is Unchecked, not Pass: source sets adjudicated:null because a use table is not a numeric comparison. An earlier draft showed five adjudications that do not exist.' },
    { id: 'nocite', x: 2460, y: -360, w: 660, text: 'A FINDING WITH NO SECTION SHOWS NO CITATION.\nThe UDC book holds exactly two sections, 14-02-003 and 14-02-008. A section outside it returns a typed absence that deliberately carries NO citation field, so those rows print "No citation" rather than a plausible-looking reference.\nAnd finding 6 is BLOCKED FROM THE LETTER for the same reason: buildCitation throws without an edition, a book and a section. A reviewer\'s confidence is not a citation.' },
    { id: 'absence', x: 3440, y: -360, w: 680, text: 'TWO AXES, NEVER ADDED TOGETHER.\nAxis 1, our corpus: absent-verified (read the edition, confirmed not in it — THE STRONG CLAIM), not-entitled, source-unavailable, unchecked.\nAxis 2, our reasoning: the section is fine and readable, and no adjudicator exists.\nA corpus gap and a reasoning gap have different owners and different fixes. Plus a third row the taxonomy cannot describe: a whole-chain failure is ONE finding about us, never twelve about the code.' },
    { id: 'quote', x: 0, y: 1210, w: 700, text: 'WE DO NOT PARAPHRASE A CODE WE CANNOT QUOTE.\nCODE_BOOKS.IBC2018P6.quotable is false. An earlier draft stated what that book requires three times, on the same canvas as a panel promising we would never do that.\nThe reviewer names the conflict, the letter says the text is not reproduced and why, and the product never characterises the codes or picks between them.' },
    { id: 'letter', x: 720, y: 1210, w: 700, text: 'THE LETTER IS THE PRODUCT, AND ITS COUNTS MUST TIE.\n1 correction + 1 escalation + 10 not evaluated + 1 held back = 13 findings. An escalation is printed under its own heading and explicitly asks nothing of the applicant, because counting it as a correction would tell them to fix a disagreement inside the city.\nOne finding numbering across the console, the letter and the manifest.' },
    { id: 'cyclen', x: 1720, y: 1210, w: 700, text: 'CYCLE 2 — AND THE CASE THAT JUSTIFIES THE TWO AXES.\nFinding 5: the applicant supplied the use on the revised sheet and the determination DID NOT MOVE, because what was missing was our adjudicator, not their data.\nA product with one "not evaluated" bucket would have asked them to resubmit something that could not have helped. That is the cost of collapsing the axes, in one row.' },
    { id: 'owed', x: 2460, y: 1210, w: 700, text: 'WHAT DOES NOT EXIST — this design is ahead of the code on purpose.\n• No viewer, no sheet index, no pin model, no dimension capture, no cycle, no department routing.\n• ONE adjudicator (front setback). Every other rule is drawn and badged NO ADJUDICATOR.\n• The provenance ladder is proposed here, not in source.\n• The 12-rule scope is a design premise.\nPARALLEL DEPARTMENT REVIEW is the category\'s core value and is NOT designed here. Pinned, and the next argument to have.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Reasoning, Coverage, Letter, Cycle .dc.html + canvas.json');
