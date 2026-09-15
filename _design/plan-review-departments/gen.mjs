import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/* Plan Review -- parallel department review, on the reasoner path.

   Continues _design/plan-review-reasoner. Same product, same finding numbering,
   same citations. This folder adds the one thing the category sells hardest and
   the reasoner design pinned: more than one department reviewing at once.

   READ FROM SOURCE, not assumed:
     P:\plan-review src/actors.mjs -- personas are orgId/userId with roles
       reviewer, observer, applicant, staff. THERE IS NO DEPARTMENT MODEL AT ALL,
       no routing, no discipline. Confirmed by grep across src/ and web/.
     _decisions/2026-09-14_staff_identity_and_department_rbac.md --
       the roster is THE NINE LENSES, not Bastrop's ~25 budget departments, so the
       seven department roles are Development services, Finance, Public works,
       Parks, Police, Fire and EMS, Fleet. Overview is a roll-up, Citizen is public.
     ...and that same ruling gates PLAN REVIEW to Development services and
       city-manager. This design cannot be built under that gate. The amendment it
       asks for is on the canvas, using the ruling's own Overview logic: a
       department sees only its own lane, which is what makes it a roll-up rather
       than a leak.

   Citations are the three that exist. 14-02-003 and 14-02-008 are the only UDC
   sections in CODE_BOOKS; IBC2018P6.quotable is false, so IBC text is cited and
   never reproduced.

   No figure on any artboard is measured. */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const SPLIT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3v12a3 3 0 0 0 3 3h6"/><path d="m14 14 4 4-4 4"/><path d="M18 3h-4"/></svg>';
const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const CLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

const DET = {
  Pass: ['--sc-ok', '--sc-ok-wash'], Fail: ['--sc-crit', '--sc-crit-wash'],
  Uncertain: ['--sc-restricted', '--sc-restricted-wash'], Unchecked: ['--sc-ink-3', '--sc-quiet-wash'],
};
const det = (d) => {
  const [c, w] = DET[d];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.05em; color:var(' + c + '); background:var(' + w + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + d + '</span>';
};

/* DEPARTMENT is a SECOND CHANNEL: a dot and a name, never the badge. Determination
   is the badge. One element never carries both, or a red dot beside a Fail reads
   as one fact when it is two. */
const DEPTS = {
  'Development services': '--sc-accent',
  'Fire and EMS': '--sc-crit',
  'Public works': '--sc-info',
  'Parks': '--sc-ok',
  'Unrouted': '--sc-ink-3',
};
const dept = (n) =>
  '<span style="display:inline-flex; align-items:center; gap:5px; flex:none;"><span style="width:8px; height:8px; border-radius:var(--sc-r-full); background:var(' + DEPTS[n] + ');"></span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2);">' + n + '</span></span>';

const topbar = (who) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-5); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Plan Review</span>\n' +
'      <span style="width:1px; height:18px; background:var(--sc-line);"></span>\n' +
'      <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">Bastrop, TX</span>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-restricted); background:var(--sc-restricted-wash); border:1px solid var(--sc-restricted); border-radius:var(--sc-r-control); padding:0 6px;">FIXTURE</span>\n' +
'      <nav style="display:flex; gap:var(--sc-5); margin-left:var(--sc-5);">\n' +
['Queue', 'Library', 'Code', 'Applicant'].map((n) =>
'        <span style="font:' + (n === 'Queue' ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (n === 'Queue' ? '--sc-ink' : '--sc-ink-2') + '); padding:2px 0; box-shadow:' + (n === 'Queue' ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' + n + '</span>').join('\n') + '\n      </nav>\n' +
'      <div style="flex:1;"></div>\n' +
'      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + who + '</span>\n    </header>';

const spine = (active) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
['Intake', 'Applicability', 'Findings', 'Letter'].map((s, i) => {
  const on = s === active, done = ['Intake', 'Applicability', 'Findings', 'Letter'].indexOf(active) > i;
  return '          <span style="display:inline-flex; align-items:center; gap:6px; height:28px; padding:0 var(--sc-3); border-radius:var(--sc-r-full); border:1px solid var(' + (on ? '--sc-accent' : '--sc-line') + '); background:var(' + (on ? '--sc-accent-wash' : '--sc-surface') + '); font:' + (on ? '600' : '400') + ' 13px/18px var(--sc-font-ui); color:var(' + (on ? '--sc-accent-hi' : done ? '--sc-ink-2' : '--sc-ink-3') + ');">' +
  (done ? '<span style="color:var(--sc-ok); display:grid; place-items:center;">' + CHECK + '</span>' : '') + s + '</span>' +
  (i < 3 ? '<span style="color:var(--sc-line-strong); display:grid; place-items:center;">' + ARROW + '</span>' : '');
}).join('\n') + '\n        </div>';

const panel = (o) =>
'        <section style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;' + (o.grow ? ' flex:1; min-height:0;' : '') + (o.w ? ' width:' + o.w + '; flex:none;' : '') + '">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
'            <div style="flex:1;"></div>\n' + (o.right || '') + '\n          </div>\n' + o.body + '\n        </section>';

const basis = (t, w) =>
'            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); ' + (w ? 'max-width:' + w + ';' : '') + '">' + t + '</div>';

const btn = (t, kind) => {
  const s = kind === 'primary' ? 'background:var(--sc-accent); color:var(--sc-on-accent); border:1px solid var(--sc-accent);'
    : kind === 'quiet' ? 'background:var(--sc-surface-2); color:var(--sc-ink-3); border:1px dashed var(--sc-line-strong);'
    : 'background:var(--sc-surface); color:var(--sc-ink); border:1px solid var(--sc-line-strong);';
  return '<span style="display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); font:500 13px/18px var(--sc-font-ui); ' + s + '">' + t + '</span>';
};
const ghost = (t) => '<span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent);">' + t + '</span>';

const shell = (o) =>
  '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
  '<div class="{{themeClass}}" style="width:1600px; height:' + o.h + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
  topbar(o.who) + '\n' +
  '    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
  '        <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
  '          <div style="display:flex; align-items:center; gap:var(--sc-3); flex-wrap:wrap;">\n' +
  '            <h1 style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.02em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>\n' +
  '            <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">' + o.meta + '</span>\n' +
  '            <div style="flex:1;"></div>' + (o.hdrRight || '') + '\n          </div>\n' +
  (o.spine ? spine(o.spine) + '\n' : '') + '        </div>\n' + o.body + '\n    </main>\n  </div>\n</x-dc>\n' +
  '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"light"}}\'>\n' +
  'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "light") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';

const C3 = 'City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)';
const C8 = 'City of Bastrop Building Block B3 Section 14-02-008 (bastrop_tx-bdc-2026-adopted)';
const CIBC = '2018 International Building Code Section 705.5 (IBC-2018)';

/* =======================  1. ROUTING  ======================= */
const routeRow = (r) =>
'            <div style="display:grid; grid-template-columns:200px 92px 116px minmax(0,1fr); gap:0 var(--sc-4); align-items:center; min-height:56px; padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              ' + dept(r.d) + '\n' +
'              <span style="font:400 19px/24px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (r.n === '0' ? '--sc-ink-3' : '--sc-ink') + '); text-align:right;">' + r.n + '</span>\n' +
'              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + r.cited + '</span>\n' +
'              <span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + r.why + '</span>\n            </div>';

const routing = shell({
  h: 1200, who: 'M. Leavis &middot; Development services', spine: 'Applicability',
  h1: 'Who has to look at this', meta: 'PR-2026-0418 &middot; 908 PINE ST &middot; 12 rules in scope &middot; cycle 1',
  hdrRight: ghost('Edit the declared map'),
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-accent); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5);">\n' +
    '          <div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:3px;">We do not route. We say what is in each department\u2019s scope, and what we already checked for it.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:112ch;">Which departments a submittal goes to is the city\u2019s decision and its workflow system\u2019s job. What a finding belongs to is decided by the section it cites, through a map the city declares once. A section with no declared owner produces an <strong>unrouted</strong> finding, and so does a section two departments both claim. Neither is guessed.</div>\n        </section>\n' +
    panel({
      title: 'In scope for this submittal', sub: '4 of the 7 department roles',
      body:
        '            <div style="display:grid; grid-template-columns:200px 92px 116px minmax(0,1fr); gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
        ['Department', { t: 'Rules', r: 1 }, 'With a section', 'What that means for them'].map((h) =>
        '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3); ' + (h.r ? 'text-align:right;' : '') + '">' + (h.t || h) + '</span>').join('\n') + '\n            </div>\n' +
        [
          { d: 'Development services', n: '8', cited: '4 of 8', why: 'The district requirements and the use table are in our corpus. Four rules are cited and one has a live check.' },
          { d: 'Fire and EMS', n: '2', cited: '1 of 2', why: 'One section is cited and not quotable. One is not in our corpus at all.' },
          { d: 'Public works', n: '2', cited: '0 of 2', why: 'Nothing in our corpus reaches this department yet. We add nothing to their review today, and say so rather than implying coverage.' },
          { d: 'Parks', n: '0', cited: '&mdash;', why: 'Routed by the city for a park dedication sign-off. No rule of theirs is in our corpus, so we produce no findings for them at all.' },
        ].map(routeRow).join('\n') +
        basis('Police, Fleet and Finance are the other three department roles and are not in scope for this project type. They are named here so the absence is a decision rather than an oversight.', '122ch'),
    }) + '\n' +
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    panel({
      grow: true, title: 'The declared map', sub: 'section to department, authored once by the city',
      body:
        '            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [
          ['14-02-003', 'District requirements (SF-1)', 'Development services'],
          ['14-02-008', 'Permitted use table', 'Development services'],
          ['IBC ch. 7', 'Fire-resistance rated construction', 'Fire and EMS'],
        ].map(([s, t, d]) =>
        '              <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><span style="flex:none; width:82px; font:600 13px/19px var(--sc-font-data); color:var(--sc-ink);">' + s + '</span><span style="flex:1; min-width:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + t + '</span>' + dept(d) + '</div>').join('\n') +
        '\n            </div>' +
        basis('Applied consistently and auditable, because it is declared rather than inferred per submittal. A section absent from this map does not default to Development services.'),
    }) + '\n' +
    panel({
      grow: true, title: 'Unrouted', sub: '1 finding &middot; two reasons, both refusals to guess',
      body:
        '            <div style="display:flex; flex-direction:column; gap:var(--sc-3); padding:var(--sc-4);">\n' +
        '              <div style="display:flex; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control);">\n' +
        '                <span style="flex:none; color:var(--sc-restricted); display:grid; place-items:center; padding-top:2px;">' + SPLIT + '</span>\n' +
        '                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;"><span style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink);">Finding 6 &middot; Driveway width</span><span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Development services and Public works both claim it, with different requirements. Two claimants, so no owner.</span></div>\n              </div>\n' +
        '              <div style="display:flex; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface-2);">\n' +
        '                <span style="flex:none; color:var(--sc-ink-3); display:grid; place-items:center; padding-top:2px;">' + LOCK + '</span>\n' +
        '                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;"><span style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">The other reason: no claimant</span><span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-3);">A finding whose section is absent from the declared map is unrouted too. Zero owners and two owners are different problems and the surface never collapses them.</span></div>\n              </div>\n            </div>',
    }) + '\n        </div>',
});

/* =======================  2. ONE DEPARTMENT  ======================= */
const fireBoard = shell({
  h: 1180, who: 'R. Garner &middot; Fire and EMS', spine: 'Findings',
  h1: 'Fire and EMS', meta: 'PR-2026-0418 &middot; your scope &middot; 2 rules &middot; not the whole submittal',
  hdrRight: btn('Sign off for Fire and EMS', 'primary'),
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-crit); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5);">\n' +
    '          <div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:3px;">Two rules are yours. We evaluated neither, and here is exactly why.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:112ch;">A department sees its own lane, not the whole application. That is the same rule that makes the Overview lens a roll-up rather than a leak, applied here.</div>\n        </section>\n' +
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    panel({
      grow: true, title: 'Your findings', sub: '2 &middot; both need you',
      body:
        '            <div style="display:flex; flex-direction:column;">\n' +
        [
          { n: '2', t: 'Fire separation distance', d: 'Uncertain', cite: CIBC,
            body: 'You recorded on 12 Sep that two adopted authorities conflict for the west wall. The product cites the section and does not reproduce its text; the licence it holds does not permit quoting it. It has not picked between the two and will not.',
            act: 'Record which authority governs' },
          { n: '13', t: 'Fire apparatus access', d: 'Unchecked', cite: null,
            body: 'This rule is in your scope and the section is not in our corpus, so we have nothing to say about it. It is not a pass. It is yours to check by hand.',
            act: 'Add a finding' },
        ].map((f) =>
        '              <div style="display:flex; gap:var(--sc-3); padding:var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
        '                <span style="flex:none; width:24px; height:24px; border-radius:var(--sc-r-full); display:grid; place-items:center; font:600 12px var(--sc-font-data); color:var(--sc-surface); background:var(--sc-crit);">' + f.n + '</span>\n' +
        '                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">\n' +
        '                  <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;"><span style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + f.t + '</span>' + det(f.d) + dept('Fire and EMS') + '</div>\n' +
        '                  <div style="font:400 12px/17px var(--sc-font-data); color:var(' + (f.cite ? '--sc-ink-2' : '--sc-ink-3') + ');">' + (f.cite || 'No citation. The section is not in our corpus, so none can be built.') + '</div>\n' +
        '                  <div style="font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:86ch;">' + f.body + '</div>\n' +
        '                  <div style="padding-top:var(--sc-1);">' + btn(f.act) + '</div>\n                </div>\n              </div>').join('\n') +
        '\n            </div>' +
        basis('Findings 1, 3, 4, 5 and 6 belong to other departments and are not shown. A city-manager and Development services see the whole submittal; Fire sees Fire.'),
    }) + '\n' +
    panel({
      grow: true, w: '520px', title: 'Your coverage', sub: '0 of 2 evaluated',
      body:
        '            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [
          ['not-entitled', '1', 'Cited, and its text cannot be reproduced to you or to the applicant.', '--sc-restricted'],
          ['unchecked', '1', 'Never ingested. A statement about our corpus, not about the code.', '--sc-ink-3'],
        ].map(([k, n, s, t]) =>
        '              <div style="display:grid; grid-template-columns:132px 44px minmax(0,1fr); gap:0 var(--sc-3); align-items:start; padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><span style="font:600 13px/19px var(--sc-font-data); color:var(' + t + ');">' + k + '</span><span style="font:400 19px/22px var(--sc-font-data); color:var(--sc-ink); text-align:right;">' + n + '</span><span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + s + '</span></div>').join('\n') +
        '\n            </div>\n' +
        '            <div style="padding:var(--sc-4); border-top:1px solid var(--sc-line-faint); display:flex; flex-direction:column; gap:3px;">\n' +
        '              <span style="font:620 14px/20px var(--sc-font-ui); color:var(--sc-ink);">Coverage is per department, because a gap is not shared.</span>\n' +
        '              <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">Development services has four cited rules on this submittal. That tells you nothing about yours. A single coverage number across the whole application would let their corpus hide your gap.</span>\n            </div>' +
        basis('Signing off says you reviewed your lane. It does not say the product checked it.'),
    }) + '\n        </div>',
});

/* =======================  3. THE BOARD  ======================= */
const boardRow = (r) =>
'            <div style="display:grid; grid-template-columns:200px 132px 92px minmax(0,1fr) 108px; gap:0 var(--sc-4); align-items:center; min-height:58px; padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'              ' + dept(r.d) + '\n' +
'              <span style="justify-self:start; font:500 12px/16px var(--sc-font-data); letter-spacing:.04em; color:var(' + r.tone + '); background:var(' + r.wash + '); border-radius:var(--sc-r-control); padding:2px 8px;">' + r.state + '</span>\n' +
'              <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2); text-align:right;">' + r.findings + '</span>\n' +
'              <span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-3);">' + r.note + '</span>\n' +
'              <span style="font:400 13px/18px var(--sc-font-data); color:var(' + (r.waitTone || '--sc-ink-2') + '); text-align:right;">' + r.wait + '</span>\n            </div>';

const board = shell({
  h: 1140, who: 'S. Carrillo &middot; City manager', spine: 'Findings',
  h1: 'Where this application is waiting', meta: 'PR-2026-0418 &middot; cycle 1 opened 11 Sep &middot; 4 days',
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-warn); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5); display:flex; align-items:center; gap:var(--sc-6);">\n' +
    '          <span style="flex:none; color:var(--sc-warn); display:grid; place-items:center;">' + CLOCK + '</span>\n' +
    '          <div style="flex:1; min-width:0;"><div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:2px;">The cycle cannot close. Two departments have not opened it.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:110ch;">This page is about the application, not the people. It says where the work is sitting and for how long, and it does not rank staff, count individual throughput, or name who has not opened something.</div></div>\n' +
    '          <div style="flex:none; display:flex; gap:var(--sc-5); padding-left:var(--sc-5); border-left:1px solid var(--sc-line-faint);">' +
    [['1', 'complete', '--sc-ok'], ['1', 'in review', '--sc-info'], ['2', 'not started', '--sc-warn']].map(([n, k, t]) =>
    '<div style="display:flex; flex-direction:column; align-items:flex-end;"><span style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + t + ');">' + n + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + k + '</span></div>').join('') +
    '</div>\n        </section>\n' +
    panel({
      grow: true, title: 'By department', sub: '4 in scope &middot; all four must clear before the letter issues',
      body:
        '            <div style="display:grid; grid-template-columns:200px 132px 92px minmax(0,1fr) 108px; gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
        ['Department', 'State', { t: 'Findings', r: 1 }, 'What the state means', { t: 'Waiting', r: 1 }].map((h) =>
        '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3); ' + (h.r ? 'text-align:right;' : '') + '">' + (h.t || h) + '</span>').join('\n') + '\n            </div>\n' +
        [
          { d: 'Development services', state: 'Complete', tone: '--sc-ok', wash: '--sc-ok-wash', findings: '8', wait: '&mdash;',
            note: 'Reviewed and signed off. One correction accepted into the letter.' },
          { d: 'Fire and EMS', state: 'In review', tone: '--sc-info', wash: '--sc-info-wash', findings: '2', wait: '2d',
            note: 'Opened 13 Sep. One conflict recorded and owed a determination.' },
          { d: 'Public works', state: 'Not started', tone: '--sc-warn', wash: '--sc-warn-wash', findings: '2', wait: '4d', waitTone: '--sc-warn',
            note: 'Not opened. This is NOT the same as reviewed with nothing to say.' },
          { d: 'Parks', state: 'Not started', tone: '--sc-warn', wash: '--sc-warn-wash', findings: '0', wait: '4d', waitTone: '--sc-warn',
            note: 'Not opened, and we produce no findings for them. Their sign-off is still required.' },
        ].map(boardRow).join('\n') +
        basis('THREE STATES THAT LOOK ALIKE AND ARE NOT. A department that has not opened the submittal, a department that reviewed it and found nothing, and a department we produce no findings for are three different facts. Parks is the third and the second at once, which is why its row carries both. Collapsing any of them into a green tick is how a cycle closes on a review nobody did.', '128ch'),
    }),
});

/* =======================  4. CONFLICT  ======================= */
const claim = (c) =>
'            <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-4); border:1px solid var(--sc-line); border-left:3px solid var(' + DEPTS[c.d] + '); border-radius:var(--sc-r); background:var(--sc-surface);">\n' +
'              ' + dept(c.d) + '\n' +
'              <div style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.018em; color:var(--sc-ink);">' + c.v + '</div>\n' +
'              <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + c.sub + '</div>\n' +
'              <div style="margin-top:auto; padding-top:var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-top:1px solid var(--sc-line-faint);">' + c.basis + '</div>\n            </div>';

const conflict = shell({
  h: 1140, who: 'S. Carrillo &middot; City manager', spine: 'Findings',
  h1: 'Finding 6 \u2014 Driveway width', meta: 'PR-2026-0418 &middot; two departments, two requirements',
  hdrRight: det('Uncertain'),
  body:
    '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-restricted); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5); display:flex; align-items:flex-start; gap:var(--sc-4);">\n' +
    '          <span style="flex:none; color:var(--sc-restricted); display:grid; place-items:center; padding-top:2px;">' + SPLIT + '</span>\n' +
    '          <div style="flex:1; min-width:0;"><div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink); margin-bottom:2px;">Two departments are two authorities, and the rule is the one we already have.</div>\n' +
    '          <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); max-width:112ch;">Uncertain is reserved for a genuine conflict between two authorities. It was written for two code editions disagreeing. A department disagreeing with another department is the same shape and gets the same treatment: name both, pick neither, escalate to someone who can decide.</div></div>\n        </section>\n' +
    '        <div style="display:flex; gap:var(--sc-4); align-items:stretch;">\n' +
    claim({ d: 'Development services', v: '10\u2032-0\u2033 minimum', sub: 'Single-family drive, from the district requirements.',
      basis: 'M. Leavis, 12 Sep &middot; ' + C3 }) + '\n' +
    claim({ d: 'Public works', v: '12\u2032-0\u2033 minimum', sub: 'Drive approach in the right of way, from the department\u2019s own standard.',
      basis: 'D. Moore, 14 Sep &middot; no section in our corpus, so no citation can be built' }) + '\n        </div>\n' +
    panel({
      grow: true, title: 'What the product does, and does not do', sub: 'the asymmetry is the point',
      body:
        '            <div style="display:flex; padding:var(--sc-1) 0;">\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; padding:var(--sc-3) var(--sc-5); border-right:1px solid var(--sc-line-faint);">\n' +
        '                <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ok); margin-bottom:var(--sc-2);">Does</span>\n' +
        ['Shows both requirements with equal weight and neither greyed.',
         'Names the department, the person and the date on each.',
         'Holds the item out of the applicant\u2019s letter while it is open.',
         'Notes that one claim carries a citation and one does not, without treating that as the deciding fact.',
         'Escalates to the city manager, who is the role that sees across departments.'].map((t) =>
        '                <span style="font:400 13px/22px var(--sc-font-ui); color:var(--sc-ink-2);">&middot;&nbsp;&nbsp;' + t + '</span>').join('\n') + '\n              </div>\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; padding:var(--sc-3) var(--sc-5);">\n' +
        '                <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-crit); margin-bottom:var(--sc-2);">Does not</span>\n' +
        ['Pick the stricter requirement. Stricter is not a synonym for correct.',
         'Prefer the claim that has a citation. Our corpus is not an authority on which department governs.',
         'Prefer the department that reviewed first, or the one with a live check.',
         'Send the applicant both numbers and let them work it out.',
         'Close the cycle while it is open.'].map((t) =>
        '                <span style="font:400 13px/22px var(--sc-font-ui); color:var(--sc-ink-2);">&middot;&nbsp;&nbsp;' + t + '</span>').join('\n') + '\n              </div>\n            </div>\n' +
        '            <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-3) var(--sc-5); border-top:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
        '              ' + btn('Record which department governs', 'primary') + '\n              ' + btn('Ask both to confer') + '\n' +
        '              <div style="flex:1;"></div>\n              <span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Recording a determination asks for a reason and keeps it against both claims.</span>\n            </div>' +
        basis('Taking the stricter number would be the obvious shortcut and it is wrong twice: it decides a jurisdictional question on a numeric heuristic, and it teaches every department that claiming a higher number wins. The product has no standing to resolve which department governs the right of way.', '128ch'),
    }),
});

/* =======================  5. CONSOLIDATED LETTER  ======================= */
const lRow = (r) =>
'                <div style="display:flex; gap:var(--sc-4); padding:var(--sc-4) 0; border-bottom:1px solid var(--sc-line-faint);">\n' +
'                  <span style="flex:none; width:26px; font:600 14px/20px var(--sc-font-data); color:var(--sc-ink-2);">' + r.n + '</span>\n' +
'                  <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">\n' +
'                    <div style="display:flex; align-items:center; gap:var(--sc-3); flex-wrap:wrap;"><span style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + r.t + '</span>' + dept(r.d) + '</div>\n' +
'                    <div style="font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:92ch;">' + r.body + '</div>\n' +
'                    <div style="display:flex; gap:var(--sc-4); flex-wrap:wrap; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);"><span>' + r.cite + '</span><span>' + r.who + '</span></div>\n                  </div>\n                </div>';

const letter = shell({
  h: 1240, who: 'M. Leavis &middot; Development services', spine: 'Letter',
  h1: 'Correction notice', meta: 'PR-2026-0418 &middot; cycle 1 &middot; cannot issue yet',
  hdrRight: btn('Issue to applicant', 'quiet'),
  body:
    '        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
    '          <div style="flex:1; min-width:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); overflow:hidden; display:flex; flex-direction:column;">\n' +
    '            <div style="flex:1; min-height:0; padding:var(--sc-7) var(--sc-9); overflow:hidden;">\n' +
    '              <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding-bottom:var(--sc-4); border-bottom:2px solid var(--sc-ink);">\n' +
    '                <span style="font:650 22px/28px var(--sc-font-ui); letter-spacing:-.018em; color:var(--sc-ink);">Correction notice</span>\n' +
    '                <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">PR-2026-0418 &middot; cycle 1 &middot; 908 PINE ST</span>\n              </div>\n' +
    '              <p style="margin:var(--sc-4) 0 var(--sc-5); max-width:94ch; font:400 14px/22px var(--sc-font-ui); color:var(--sc-ink-2);">One notice covers every department that reviewed this application. Each item names the department it came from as well as the code section, so you have one list to work from rather than four.</p>\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin-bottom:var(--sc-1);">Corrections required &mdash; 1</div>\n' +
    lRow({ n: '1.', t: 'Front setback', d: 'Development services', cite: C3, who: 'Automated check, accepted by M. Leavis &middot; Sheet A-101',
      body: 'The proposed front setback of 22\u2032-0\u2033 is less than the 25\u2032-0\u2033 minimum for the SF-1 district. Revise the site plan or apply for a variance.' }) + '\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Escalated inside the city, no action from you &mdash; 2</div>\n' +
    lRow({ n: '2.', t: 'Fire separation distance', d: 'Fire and EMS', cite: CIBC, who: 'R. Garner &middot; reviewer override, 12 Sep',
      body: 'Two adopted authorities conflict for the west wall. That is being resolved inside the city. The text of the cited section is not reproduced here; this product is not licensed to quote it.' }) + '\n' +
    lRow({ n: '6.', t: 'Driveway width', d: 'Unrouted', cite: 'No citation on one of the two claims', who: 'Two departments, owed a determination',
      body: 'Development services and Public works have recorded different minimum widths for the drive. You will receive one number, not two, once the city has determined which governs.' }) + '\n' +
    '              <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Not evaluated, by department &mdash; 10</div>\n' +
    '              <p style="margin:0; max-width:94ch; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Development services 6, Fire and EMS 2, Public works 2. Each is named with its reason in the attached list. Public works has no rule of theirs in our corpus at all, so nothing in this notice reflects an automated check of their requirements. <strong>None of this is an approval.</strong></p>\n            </div>\n' +
    '            <div style="flex:none; padding:var(--sc-3) var(--sc-9); border-top:1px solid var(--sc-line-faint); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Items marked as an automated check were produced against the adopted editions named above and reviewed by the named reviewer before issue.</div>\n          </div>\n' +
    '          <aside style="width:440px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Cannot issue yet', sub: 'two departments have not cleared',
      body:
        '            <div style="display:flex; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-4);">\n' +
        '              <span style="flex:none; color:var(--sc-warn); display:grid; place-items:center; padding-top:2px;">' + LOCK + '</span>\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
        '                <div style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink);">Public works and Parks have not opened it.</div>\n' +
        '                <div style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Issuing now would send an applicant a list that two departments have not contributed to, and a cycle 2 that arrives against an incomplete cycle 1. The draft is readable; the button is not live.</div>\n              </div>\n            </div>',
    }) + '\n' +
    panel({
      grow: true, title: 'Per department', sub: '13 findings across 4 departments',
      body:
        '            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [['Development services', '8', '1 correction, 1 pass, 6 not evaluated'],
         ['Fire and EMS', '2', '1 escalated, 1 not evaluated'],
         ['Public works', '2', '2 not evaluated, neither cited'],
         ['Parks', '0', 'no findings from us; sign-off still required'],
         ['Unrouted', '1', 'finding 6, two claimants']].map(([d, n, s]) =>
        '              <div style="display:grid; grid-template-columns:minmax(0,1fr) 34px; gap:0 var(--sc-2); align-items:baseline; padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><div style="display:flex; flex-direction:column; gap:1px; min-width:0;">' + dept(d) + '<span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + s + '</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">' + n + '</span></div>').join('\n') +
        '\n            </div>' + basis('8 + 2 + 2 + 0 + 1 = 13.'),
    }) + '\n          </aside>\n        </div>',
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), routing);
fs.writeFileSync(new URL('./Department.dc.html', import.meta.url), fireBoard);
fs.writeFileSync(new URL('./Board.dc.html', import.meta.url), board);
fs.writeFileSync(new URL('./Conflict.dc.html', import.meta.url), conflict);
fs.writeFileSync(new URL('./Letter.dc.html', import.meta.url), letter);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1200, title: 'Routing — scope, not dispatch' },
    { file: 'Department.dc.html', x: 1720, y: 0, w: 1600, h: 1180, title: 'One department — Fire sees Fire' },
    { file: 'Board.dc.html', x: 3440, y: 0, w: 1600, h: 1140, title: 'Where the application is waiting' },
    { file: 'Conflict.dc.html', x: 0, y: 1400, w: 1600, h: 1140, title: 'Two departments, two authorities' },
    { file: 'Letter.dc.html', x: 1720, y: 1400, w: 1600, h: 1240, title: 'One notice, four departments' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -350, w: 660, text: 'PLAN REVIEW — PARALLEL DEPARTMENT REVIEW.\nContinues _design/plan-review-reasoner: same product, same finding numbers, same three real citations.\nParallel review is the category\'s hardest-sold feature and the reasoner design pinned it. This is the argument.\nSOURCE: P:\\plan-review has NO department model at all — personas are orgId/userId with roles reviewer/observer/applicant/staff. Confirmed by grep across src/ and web/.\nFIXTURE throughout.' },
    { id: 'amend', x: 720, y: -350, w: 700, text: 'THIS DESIGN NEEDS A RULING AMENDED, AND SAYS SO RATHER THAN ROUTING AROUND IT.\n_decisions/2026-09-14_staff_identity_and_department_rbac.md gates PLAN REVIEW to Development services and city-manager. Parallel review requires Fire, Public works and Parks to reach it. As ruled, this cannot be built.\nProposed amendment, using that ruling\'s OWN logic: a department reaches plan review only through its own scope — its findings, its coverage, its sign-off. That is exactly what the ruling says makes Overview "a roll-up rather than a leak".\nThe roster stays the nine lenses. No new department is invented.' },
    { id: 'scope', x: 1720, y: -350, w: 680, text: 'WE DO NOT ROUTE. WE SCOPE.\nWhich departments get a submittal is the city\'s decision and its workflow system\'s job — we said we are a companion and this is where that has teeth.\nWhat a finding BELONGS to is decided by the section it cites, through a map the city declares once. Declared, so it is auditable and consistent; not inferred per submittal.\nA section absent from the map does NOT default to Development services. It produces an unrouted finding.' },
    { id: 'unrouted', x: 2460, y: -350, w: 640, text: 'UNROUTED HAS TWO CAUSES AND THEY ARE NOT THE SAME.\nZERO departments claim the section, or TWO do. Both are refusals to guess, and the surface never collapses them into one grey state.\nThis is the same shape as the absence taxonomy on the reasoner canvas: the reason for an absence is the product, not the absence itself.' },
    { id: 'coverage', x: 3440, y: -350, w: 660, text: 'COVERAGE IS PER DEPARTMENT, BECAUSE A GAP IS NOT SHARED.\nDevelopment services has four cited rules here. Public works has ZERO — nothing in our corpus reaches them, and the product says that to their face rather than implying coverage.\nOne coverage number across the application would let a strong department\'s corpus hide a weak one\'s gap. That is the single most dangerous number this product could print.' },
    { id: 'board', x: 0, y: 1170, w: 700, text: 'THE BOARD IS ABOUT THE APPLICATION, NEVER THE PEOPLE.\nIt shows where work is sitting and for how long. It does not rank staff, count individual throughput, or name who has not opened something. Handing a government customer a productivity leaderboard is a different product with a different politics, and we are not shipping it by accident.\nTHREE STATES THAT LOOK ALIKE: not opened / reviewed and found nothing / we produce nothing for them. Parks is the last two at once. Collapsing any of them is how a cycle closes on a review nobody did.' },
    { id: 'conflict', x: 740, y: 1170, w: 700, text: 'TWO DEPARTMENTS ARE TWO AUTHORITIES — the rule already exists.\nUncertain was reserved for two code editions disagreeing. A department disagreeing with a department is the same shape: name both, pick neither, escalate to the role that sees across lanes.\nTHE REFUSALS ARE THE DESIGN. Not the stricter number — stricter is not a synonym for correct, and it teaches every department that claiming higher wins. Not the claim that has a citation — our corpus is not an authority on which department governs the right of way. Not both numbers to the applicant.' },
    { id: 'letter', x: 1720, y: 1170, w: 700, text: 'ONE NOTICE, FOUR DEPARTMENTS, AND IT WILL NOT ISSUE.\nThe applicant gets one list, each item carrying its department beside its citation. Escalations print under a heading that says no action is required from them.\n"Not evaluated" is broken out BY DEPARTMENT, and it states plainly that Public works has no rule in our corpus, so nothing in the notice reflects an automated check of their requirements.\nThe Issue button is not live while two departments have not opened the submittal. 8 + 2 + 2 + 0 + 1 = 13.' },
    { id: 'owed', x: 2460, y: 1170, w: 660, text: 'WHAT DOES NOT EXIST.\n• No department model, no routing, no sign-off, no cycle, no declared section-to-department map. All of it is proposed here.\n• The ruling amendment above is a precondition, not a detail.\n• Department colour is a SECOND CHANNEL (a dot) and determination stays the badge. One element never carries both.\n• Still pinned from the reasoner canvas: the viewer, the dimension capture, and every adjudicator except the front setback.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Department, Board, Conflict, Letter .dc.html + canvas.json');
