import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/* SmartCity People and access (OPS-17 G-143).
   Tokens copied from the frozen sc-kit, never invented.
   Every role, status, refusal code and latency on these boards is read from source-state.json, which
   dump-source-state.mjs captures from smartcity-dashboards at a named ref. check.mjs refuses a board
   that shows a value the product does not have. No person on these boards is real: every account is a
   fixture identity on a reserved .invalid domain, because an access roster is the one surface where a
   plausible invented name would read as a real employee's access. */
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* Which nav item is active on a board; set per board before shell() renders it. */
let ACTIVE = 'People and access';

/* ---------- frozen-kit helpers, lifted byte for byte from smartcity-finance-filings/gen.mjs ---------- */
const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

const CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const ALERT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>';

const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'FIXTURE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'UNLABELLED': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'UNVERIFIED': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'TENANT PRIVATE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};

const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t] || BADGE['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
};

const LENSES = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'LIVE RECORDS'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (lenses, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', lenses.map((l) => navRow(l[0], l[1], l[0] === ACTIVE))) + '\n' +
  navGroup('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']].map((r) => navRow(r[0], r[1], r[0] === ACTIVE))) + '\n' +
  navGroup('City', [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'PREVIEW']].map((r) => navRow(r[0], r[1], r[0] === ACTIVE))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal, role) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; ' + role + '</span>\n      </div>\n    </header>';

const measure = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:2px; min-width:0;">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</span>' + (m.tag ? badge(m.tag) : '') + '</div>\n' +
(m.read
  ? '            <div style="font:400 25px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.014em; color:var(' + (m.tone || '--sc-ink') + ');">' + m.v + '</div>'
  : '            <div style="font:620 16px/32px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>') + '\n' +
'            <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + m.field + '</div>\n' +
'            <div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + m.src + '</div>\n          </div>';

const tabs = (items, active) =>
'        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:6px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    (t.c ? '<span data-tab="' + t.n + '" data-count="' + t.c + '" style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (t.tone || '--sc-ink-3') + ');">' + t.c + '</span>' : '') + '</div>';
}).join('\n') + '\n        </div>';

const cell = (c) => {
  if (c && typeof c === 'object') {
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
'        <section' + (o.data || '') + ' style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;' + (o.grow ? ' flex:1; min-height:0;' : '') + '">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
'            <div style="flex:1;"></div>\n' + (o.right || '') + '\n          </div>\n' + o.body + '\n        </section>';

const emptyRegion = (o) =>
'            <div style="flex:1; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:var(--sc-2); padding:var(--sc-7) var(--sc-6); max-width:80ch;">\n' +
'              <div style="display:flex; align-items:center; gap:6px; font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + (o.lock ? LOCK : '') + '<span>' + o.k + '</span></div>\n' +
'              <div style="font:620 17px/24px var(--sc-font-ui); letter-spacing:-.01em; color:var(--sc-ink-2);">' + o.h + '</div>\n' +
'              <p style="margin:0; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>\n' +
'              <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.b + '</div>\n            </div>';

const railBlock = (title, rows) =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3);">' + title + '</div>\n' +
rows.join('\n') + '\n          </div>';

const sourceRow = (s) =>
'            <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface);">\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="flex:1; font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + s.n + '</span><span style="width:7px; height:7px; border-radius:var(--sc-r-full); background:var(' + (s.tone || '--sc-ok') + ');"></span></div>\n' +
'              <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + s.d + '</div>\n            </div>';

const gapRow = (g) =>
'            <div style="display:flex; flex-direction:column; gap:2px; padding:var(--sc-2) 0 var(--sc-2) var(--sc-3); border-left:2px solid var(--sc-line);">\n' +
'              <span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + g.n + '</span>\n' +
'              <span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + g.d + '</span>\n            </div>';

const shell = (o) =>
  '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
  '<div class="{{themeClass}}" style="width:1600px; height:' + (o.h || 1040) + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
  topbar(o.city, o.seal, o.role) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.lenses || LENSES, o.foot) + '\n' +
  '    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; gap:var(--sc-5); min-height:0;">\n' +
  '      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
  '        <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
  '          <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / ' + (o.section || 'City') + ' / ' + o.crumb + '</div>\n' +
  '          <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + o.pageBadges.map(badge).join('') + '</div>\n' +
  '          <p style="margin:0; max-width:86ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.sub + '</p>\n        </div>\n' +
  o.body + '\n      </div>\n' +
  (o.rail ? '      <aside style="width:286px; flex:none; display:flex; flex-direction:column; gap:var(--sc-5); overflow:hidden;">\n' + o.rail + '\n      </aside>\n' : '') +
  '    </main>\n  </div>\n</div>\n</x-dc>\n' +
  '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"}}\'>\n' +
  'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';

/* ---------------- badges this surface adds to the frozen set ---------------- */
BADGE['READ ONLY'] = ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'];
BADGE['ADMIN'] = ['var(--sc-restricted)', 'var(--sc-restricted-wash)'];
BADGE['NOT RECORDED'] = ['var(--sc-warn)', 'var(--sc-warn-wash)'];
BADGE['NOT ENFORCED'] = ['var(--sc-warn)', 'var(--sc-warn-wash)'];
BADGE['PROPOSED'] = ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'];
BADGE['WRONG'] = ['var(--sc-crit)', 'var(--sc-crit-wash)'];
BADGE['active'] = ['var(--sc-ok)', 'var(--sc-ok-wash)'];
BADGE['disabled'] = ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'];

/* ---------------- a board refuses to render when its premise has moved ---------------- */
const premise = (ok, why) => { if (!ok) throw new Error('source moved, redraw before rendering: ' + why); };
premise(!S.accessLogWritePath, 'an access log now exists, so Who looked must be drawn against it');
premise(S.peopleAndAccessIsGetOnly, 'the People and access route now writes; the city-manager board may no longer be read-only');
premise(S.planReviewAndSmartFilesHaveNoLocalRevocation, 'plan-review and smart-files may now revoke locally; the offboarding latencies are stale');
premise(S.PEOPLE_AND_ACCESS_READERS.join() === 'admin,city-manager', 'the roles that may read this page changed: ' + S.PEOPLE_AND_ACCESS_READERS.join());

/* ---------------- vocabulary, all of it from source ---------------- */
const ROLE_LABEL = {
  'development-services': 'Development services', finance: 'Finance', 'public-works': 'Public works', parks: 'Parks',
  police: 'Police', 'fire-ems': 'Fire and EMS', fleet: 'Fleet', 'city-manager': 'City manager', admin: 'SmartCity admin',
};
premise(Object.keys(ROLE_LABEL).sort().join() === [...S.TIER_ROLES].sort().join(),
  'ROLE_LABEL does not cover exactly the product roles ' + S.TIER_ROLES.join());

const OP = {
  provision: ['provisionStaffAccount', 'Set up an account'],
  'change-role': ['upsertStaffAccount', 'Change a role'],
  disable: ['disableStaffAccount', 'End access'],
  enable: ['enableStaffAccount', 'Restore access'],
};
for (const [, [fn]] of Object.entries(OP)) premise(S.OPERATIONS.includes(fn), 'operation ' + fn + ' is no longer in source');

/* The fixture roster. Every person is synthetic and on a reserved .invalid domain: on an access roster a
   plausible invented name reads as a real employee holding real access. Roles and statuses are checked
   against the product vocabulary here and again in check.mjs. */
const PEOPLE = [
  ['01', 'development-services', 'active', '09/16/26'],
  ['02', 'development-services', 'active', '09/16/26'],
  ['03', 'finance', 'active', '09/16/26'],
  ['04', 'public-works', 'active', '09/16/26'],
  ['05', 'police', 'active', '09/16/26'],
  ['06', 'fire-ems', 'active', '09/16/26'],
  ['07', 'fleet', 'disabled', '09/16/26', '09/17/26'],
  ['08', 'city-manager', 'active', '09/16/26'],
].map(([n, role, status, prov, ended]) => {
  premise(S.TIER_ROLES.includes(role), 'fixture role not in product vocabulary: ' + role);
  premise(S.STATUSES.includes(status), 'fixture status not in product vocabulary: ' + status);
  return { id: 'fixture-' + n, name: 'Fixture staff ' + n, email: 'staff' + n + '@example.invalid', role, status, prov, ended };
});
const CAN_SIGN_IN = PEOPLE.filter((p) => p.status === 'active');
const ENDED = PEOPLE.filter((p) => p.status === 'disabled');
const NOBODY = S.DEPARTMENT_ROLES.filter((r) => !CAN_SIGN_IN.some((p) => p.role === r));
const MINUTES = Math.round(S.staffTokenMaxAgeSecondsDefault / 60);
const FOOT = 'Staff identity &middot; WorkOS<br>' + (S.workosNeverCalledLive ? 'not yet called live' : 'live');

/* ---------------- small renderers ---------------- */
const txt = (t, tone, mono, right) =>
  '<span style="font:400 13px/18px var(' + (mono ? '--sc-font-data' : '--sc-font-ui') + '); color:var(' + (tone || '--sc-ink') + ');' + (right ? ' text-align:right;' : '') + ' overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + t + '</span>';
const roleChip = (r) =>
  '<span style="display:inline-flex; align-items:center; gap:6px; min-width:0;"><span data-role="' + r + '" style="flex:none; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2); background:var(--sc-surface-3); border-radius:var(--sc-r-control); padding:1px 6px;">' + r + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + ROLE_LABEL[r] + '</span></span>';
const person = (p) =>
  '<span data-name="' + p.name + '" data-email="' + p.email + '" style="display:flex; flex-direction:column; min-width:0;">' + txt(p.name) +
  '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + p.email + '</span></span>';
/* What a role can open is stated as ENFORCED, never as ruled: an access review that shows a limit which is
   not enforced is a false assurance, and worse than showing nothing. */
const canOpen = () => (S.departmentAccessEnforced
  ? '<span data-enforced="true">' + txt('its own lens', '--sc-ink-2') + '</span>'
  : '<span data-enforced="false">' + txt('Every lens', '--sc-warn') + '</span>');
const headRow = (cols, labels) =>
  '            <div style="display:grid; grid-template-columns:' + cols + '; gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
  labels.map((h) => '              <span style="display:flex; align-items:center; gap:6px; font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3);' + (h.right ? ' justify-content:flex-end;' : '') + '">' + (typeof h === 'string' ? h : (h.t || '')) + (h.b ? badge(h.b) : '') + '</span>').join('\n') + '\n            </div>';
const rosterRow = (p, cols, cells) =>
  '            <div data-person="' + p.id + '" data-status="' + p.status + '" style="display:grid; grid-template-columns:' + cols + '; gap:0 var(--sc-4); align-items:center; min-height:52px; padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
  cells.map((c) => '              ' + c).join('\n') + '\n            </div>';
const notice = (o) =>
  '        <section data-notice="' + o.id + '" style="border:1px solid var(--sc-line); border-left:3px solid var(' + o.tone + '); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5); display:flex; gap:var(--sc-4); align-items:flex-start;">\n' +
  '          <span style="flex:none; color:var(' + o.tone + '); padding-top:3px;">' + ALERT + '</span>\n' +
  '          <div style="display:flex; flex-direction:column; gap:var(--sc-1); max-width:100ch;"><div style="font:620 16px/22px var(--sc-font-ui); letter-spacing:-.01em; color:var(--sc-ink);">' + o.h + '</div>' +
  '<p style="margin:0; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>' +
  (o.b ? '<div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.b + '</div>' : '') + '</div>\n        </section>';
const action = (id, label, primary) => {
  premise(OP[id], 'unknown action ' + id);
  return primary
    ? '<span data-action="' + id + '" style="display:inline-flex; align-items:center; height:32px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent, #fff); font:600 13px/18px var(--sc-font-ui);">' + label + '</span>'
    : '<span data-action="' + id + '" style="font:500 13px/18px var(--sc-font-ui); color:var(--sc-accent);">' + label + '</span>';
};
const field = (k, v, mono) =>
  '<div style="display:flex; flex-direction:column; gap:4px; min-width:0;"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3);">' + k + '</span>' +
  '<span style="display:flex; align-items:center; height:32px; padding:0 var(--sc-3); border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); font:400 13px/18px var(' + (mono ? '--sc-font-data' : '--sc-font-ui') + '); color:var(--sc-ink-2); overflow:hidden; white-space:nowrap;">' + v + '</span></div>';

/* =======================  1. ACCESS — the city manager's read-only review  ======================= */
ACTIVE = 'People and access';
const COLS_CM = 'minmax(0,1.5fr) minmax(0,1.5fr) minmax(0,1fr) 92px';
const COLS_END = 'minmax(0,1.5fr) minmax(0,1.5fr) minmax(0,1fr) 92px';
const access = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'City manager', section: 'City', crumb: 'People and access',
  h: 1420, h1: 'People and access', pageBadges: ['FIXTURE', 'READ ONLY'], foot: FOOT,
  sub: 'Everyone who can sign in to your city&#39;s data. SmartCity sets up every account and makes every change, so this page is for seeing, not managing. To add someone, change a role or end someone&#39;s access, ask SmartCity.',
  body:
    (S.departmentAccessEnforced ? '' : notice({
      id: 'not-enforced', tone: '--sc-warn',
      h: 'Each account has a role, and today the role does not limit what the person can open.',
      p: 'Every account on this page can open every lens, including code enforcement cases and work orders that carry residents&#39; names and phone numbers. Department access is being built. Until it ships, this page tells you who can sign in, not what each person is limited to.',
      b: 'Basis: no lens or data route checks a role. The only role check in the product guards this page. Read at smartcity-dashboards ' + S.commit.slice(0, 8) + '.',
    }) + '\n') +
    panel({
      title: 'Can sign in', sub: CAN_SIGN_IN.length + ' accounts',
      body: headRow(COLS_CM, ['Person', 'Role', { t: 'Can open', b: S.departmentAccessEnforced ? '' : 'NOT ENFORCED' }, { t: 'Since', right: true }]) + '\n' +
        CAN_SIGN_IN.map((p) => rosterRow(p, COLS_CM, [person(p), roleChip(p.role), canOpen(), txt(p.prov, '--sc-ink-2', true, true)])).join('\n'),
    }) + '\n' +
    panel({
      title: 'Access ended', sub: ENDED.length + ' account' + (ENDED.length === 1 ? '' : 's'),
      body: headRow(COLS_END, ['Person', 'Role', 'Can open', { t: 'Ended', right: true }]) + '\n' +
        ENDED.map((p) => rosterRow(p, COLS_END, [person(p), roleChip(p.role), txt('Nothing', '--sc-ink-3'), txt(p.ended, '--sc-ink-2', true, true)])).join('\n'),
    }) + '\n' +
    panel({
      data: ' data-region="administrators" data-listed="false"',
      title: 'SmartCity staff who can reach this city', sub: 'not on this list',
      body: emptyRegion({
        lock: true, k: 'Not shown here',
        h: 'SmartCity administrators can open every city, and this list does not show them.',
        p: 'This list is drawn from accounts that belong to your city. SmartCity administrators belong to no one city, so they never appear on it, even though they can open everything above. A page meant to show who can reach your data should name them.',
        b: 'Basis: the list is scoped to the city on the signed-in account, and the administrator role reads every city. This is a gap in the product, recorded against G-143. It is not a choice this page makes.',
      }),
    }),
  rail:
    railBlock('Nobody in these roles', NOBODY.map((r) => gapRow({
      n: roleChip(r),
      d: ENDED.some((p) => p.role === r) ? 'The only account in this role was ended. Nobody can sign in for it now.' : 'No account has been set up in this role.',
    }))) + '\n' +
    railBlock('To change anything', [gapRow({ n: 'Ask SmartCity', d: 'Adding someone, changing a role and ending access are all done by SmartCity. Nothing on this page changes an account.' })]) + '\n' +
    railBlock('This page cannot answer', [gapRow({ n: 'Who opened a record', d: 'Nothing records a staff member opening a record. See Who looked.' })]),
});

/* =======================  2. WHO LOOKED — the trust surface, not recorded  ======================= */
const whoLooked = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'City manager', section: 'City', crumb: 'People and access / Who looked',
  h: 980, h1: 'Who looked', pageBadges: ['NOT RECORDED'], foot: FOOT,
  sub: 'Which staff member opened a resident&#39;s record, and when. For a city this is the question most likely to arrive from a resident, and it is the one this product cannot answer yet.',
  body:
    panel({
      grow: true, data: ' data-region="audit" data-recorded="false"',
      title: 'Record access', sub: 'not recorded',
      body: emptyRegion({
        lock: true, k: 'Not recorded',
        h: 'Nobody opening a record is written down, so this page cannot tell you who looked.',
        p: 'When a staff member opens a code case, a work order or a permit, nothing records that they did. This is not a list that happens to be empty. There is nothing to list, and waiting will not fill it: a record of each read has to exist first.',
        b: 'What would fill it: a line written at the moment of every read by a signed-in person, naming who, which record, which lens and when. Nothing else on this page would need to change. Basis: no record of reads exists anywhere in smartcity-dashboards at ' + S.commit.slice(0, 8) + ', searched across ' + S.accessLogFilesScanned + ' source files.',
      }),
    }),
  rail:
    railBlock('Why this page exists anyway', [gapRow({ n: 'It is a trust surface', d: 'A city gets asked who saw a resident&#39;s data. Saying plainly that it cannot be answered yet is honest. A blank table would read as nobody looked, which is a different answer, and a false one.' })]) + '\n' +
    railBlock('A different question', [gapRow({ n: 'Who can sign in', d: 'That one is answered today, on People and access. Who could have looked and who did look are not the same thing.' })]),
});

/* =======================  3. ADMIN — SmartCity's view, every account  ======================= */
const COLS_AD = 'minmax(0,1.4fr) minmax(0,1.4fr) 96px 92px minmax(0,1.3fr)';
const statusTag = (p) => '<span data-status-shown="' + p.status + '" style="display:flex;">' + badge(p.status) + '</span>';
const rowActions = (p) => '<span style="display:flex; gap:var(--sc-3); justify-content:flex-end;">' +
  (p.status === 'active' ? action('change-role', 'Change role') + action('disable', 'End access') : action('enable', 'Restore access')) + '</span>';
const OBLIGATIONS = [
  S.workosNeverCalledLive && ['Nothing on this page has run against a real sign-in provider.', 'The provider calls are written to its documented interface and have never been made against a real organization. Build now, verify later, by operator direction.'],
  S.mfaEnabledByHand && ['Two-step sign-in is switched on by hand.', 'It has to be turned on in the provider&#39;s dashboard for each organization. Nothing in the product checks that it was.'],
  !S.departmentAccessEnforced && ['A role limits nothing yet.', 'Only this page checks a role. Every account can open every lens until department access ships.'],
  S.providerSessionNotEnded && ['Ending access does not end the provider session.', 'The account is ended here. The person&#39;s session at the sign-in provider is not, and that call is not built.'],
].filter(Boolean);
const admin = shell({
  theme: 'light', city: 'SmartCity', seal: 'SC', role: 'SmartCity admin', section: 'City', crumb: 'People and access',
  h: 1300, h1: 'People and access', pageBadges: ['FIXTURE', 'ADMIN'], foot: FOOT,
  sub: 'Every staff account in every city. SmartCity sets up every account, assigns every role and ends every account. Cities do nothing, and self-registration is off.',
  body:
    '        <div style="display:flex; align-items:center; gap:var(--sc-3);">' + field('City', 'bastrop_tx', true) + '</div>\n' +
    panel({
      title: 'Accounts', sub: 'City of Bastrop &middot; ' + PEOPLE.length + ' accounts',
      body: headRow(COLS_AD, ['Person', 'Role', 'Status', { t: 'Since', right: true }, { t: '', right: true }]) + '\n' +
        PEOPLE.map((p) => rosterRow(p, COLS_AD, [person(p), roleChip(p.role), statusTag(p), txt(p.prov, '--sc-ink-2', true, true), rowActions(p)])).join('\n'),
    }) + '\n' +
    panel({
      title: 'Set up an account', sub: 'SmartCity creates it and hands over the credentials',
      body:
        '            <div style="display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) auto; gap:var(--sc-3); align-items:end; padding:var(--sc-4);">\n' +
        '              ' + field('Email', 'staff09@example.invalid', true) + '\n' +
        '              ' + field('Name', 'Fixture staff 09') + '\n' +
        '              ' + field('Role', '<span data-role="parks">parks</span>&nbsp;&#9662;', true) + '\n' +
        '              ' + field('City', 'bastrop_tx', true) + '\n' +
        '              ' + action('provision', 'Set up account', true) + '\n' +
        '            </div>\n' +
        '            <div style="padding:0 var(--sc-4) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Role is one of ' + S.TIER_ROLES.length + ': ' + S.TIER_ROLES.map((r) => '<span data-role="' + r + '">' + r + '</span>').join(', ') + '.</div>',
    }) + '\n' +
    panel({
      data: ' data-region="obligations"',
      title: 'Not yet true', sub: OBLIGATIONS.length + ' things this page cannot promise',
      body: '            <div style="display:flex; flex-direction:column;">\n' + OBLIGATIONS.map(([h, d]) =>
        '              <div data-obligation style="display:flex; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><span style="flex:none; color:var(--sc-warn); padding-top:2px;">' + ALERT + '</span>' +
        '<div style="display:flex; flex-direction:column; gap:1px;"><span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + h + '</span><span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);">' + d + '</span></div></div>').join('\n') + '\n            </div>',
    }),
  rail:
    railBlock('What SmartCity can do', Object.entries(OP).map(([, [fn, label]]) => gapRow({ n: label, d: 'Source: ' + fn + '.' }))) + '\n' +
    railBlock('The city sees', [gapRow({ n: 'This list, read only', d: 'The city manager reads her own city&#39;s accounts on People and access. She cannot change anything, and she does not see SmartCity administrators.' })]),
});

/* =======================  4. OFFBOARDING — what ends, where, how fast  ======================= */
const WHERE = [
  { id: 'dashboards', product: 'SmartCity dashboards', when: 'On the next request', lat: 'next-request', basis: 'Every request checks whether the account is still active.' },
  { id: 'plan-review', product: 'Plan review', when: 'Up to ' + MINUTES + ' minutes', lat: 'max-age', secs: S.staffTokenMaxAgeSecondsDefault, basis: 'It keeps no record of ended accounts. A sign-in already issued lasts until it ages out.' },
  { id: 'smart-files', product: 'Smart Files', when: 'Up to ' + MINUTES + ' minutes', lat: 'max-age', secs: S.staffTokenMaxAgeSecondsDefault, basis: 'The same as Plan review.' },
  S.providerSessionNotEnded && { id: 'provider', product: 'The sign-in provider', when: 'Not ended', lat: 'not-ended', basis: 'Ending the person&#39;s session at the provider is not built.' },
].filter(Boolean);
const subject = ENDED[0];
const offboarding = shell({
  theme: 'light', city: 'SmartCity', seal: 'SC', role: 'SmartCity admin', section: 'City', crumb: 'People and access / End access',
  h: 1160, h1: 'End access: ' + subject.name, pageBadges: ['FIXTURE', 'ADMIN'], foot: FOOT,
  sub: 'What ends, where, and how fast, when SmartCity ends one account. The products do not all stop at the same moment, and this page says which.',
  body:
    panel({
      data: ' data-region="offboarding"',
      title: 'Where access ends', sub: WHERE.length + ' places',
      body: headRow('minmax(0,1fr) minmax(0,.9fr) minmax(0,2fr)', ['Where', 'When access ends', 'Why']) + '\n' + WHERE.map((w) =>
        '            <div data-where="' + w.id + '" data-latency="' + w.lat + '"' + (w.secs ? ' data-latency-seconds="' + w.secs + '"' : '') + ' style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,.9fr) minmax(0,2fr); gap:0 var(--sc-4); align-items:center; min-height:52px; padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
        '              ' + txt(w.product) + '\n' +
        '              ' + '<span data-when style="font:600 13px/18px var(--sc-font-data); color:var(' + (w.lat === 'next-request' ? '--sc-ok' : w.lat === 'not-ended' ? '--sc-crit' : '--sc-warn') + ');">' + w.when + '</span>\n' +
        '              ' + '<span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);">' + w.basis + '</span>\n            </div>').join('\n'),
    }) + '\n' +
    panel({
      data: ' data-region="offboarding-process" data-owner="none"',
      title: 'Who asks, and how fast', sub: 'no owner',
      body: emptyRegion({
        lock: false, k: 'No owner, no turnaround',
        h: 'The city has to tell SmartCity when someone leaves, and nothing yet says who hears it or how fast SmartCity acts.',
        p: 'The single sign-on option that was ruled out would have ended access everywhere the moment a city switched off one account, without anyone telling us. The ruling that stands makes ending access a process instead: the city tells SmartCity, and SmartCity ends it. That trade was made knowingly. It needs a named owner and a stated turnaround, or the gap is found after a staff member has already left.',
        b: 'Basis: the 2026-09-14 staff identity ruling names this as the real cost of the decision. No owner and no turnaround are recorded anywhere.',
      }),
    }) + '\n' +
    '        <div style="display:flex; align-items:center; gap:var(--sc-4); justify-content:flex-end;"><span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + subject.email + ' &middot; ' + ROLE_LABEL[subject.role] + '</span>' + action('disable', 'End access', true) + '</div>',
});

/* =======================  5. REFUSALS — what a person is told  ======================= */
const refusalCard = (o) => {
  if (!o.proposed) premise(S.REFUSALS.includes(o.code), 'refusal ' + o.code + ' is not emitted by the product');
  const shown = o.shown ?? (S.REFUSAL_MESSAGES[o.code] + (o.cont ? ' ' + o.cont : ''));
  return '          <div data-refusal="' + o.code + '"' + (o.proposed ? ' data-refusal-proposed="true"' : '') + (o.wrong ? ' data-wrong="true"' : '') +
    ' style="display:grid; grid-template-columns:230px minmax(0,1.3fr) minmax(0,1fr); gap:var(--sc-4); align-items:start; padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
    '            <div style="display:flex; flex-direction:column; gap:4px;"><span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + o.who + '</span>' +
    '<span style="display:flex; gap:6px; align-items:center;"><span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2); background:var(--sc-surface-3); border-radius:var(--sc-r-control); padding:1px 6px;">' + o.code + '</span>' +
    (o.proposed ? badge('PROPOSED') : '') + (o.wrong ? badge('WRONG') : '') + '</span></div>\n' +
    '            <span data-shown style="font:400 13px/19px var(--sc-font-data); color:var(' + (o.wrong ? '--sc-crit' : '--sc-ink') + ');">&ldquo;' + shown + '&rdquo;</span>\n' +
    '            <span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.basis + '</span>\n          </div>';
};
const REFUSAL_CARDS = [
  { who: 'Someone whose access was ended', code: 'revoked', basis: 'Right for this person. Their account existed and SmartCity ended it.' },
  S.notProvisionedCollapsesToRevoked && { who: 'Someone SmartCity never set up', code: 'revoked', wrong: true, basis: 'The same words, and false for this person: nothing was ended, because nothing was set up. The product can tell these two apart and reports them as one.' },
  S.notProvisionedCollapsesToRevoked && { who: 'What they should be told', code: 'not_provisioned', proposed: true, shown: 'this account has not been set up by SmartCity.', basis: 'Proposed. The product does not emit this today.' },
  { who: 'A department account opening People and access', code: 'not_admin_or_city_manager', basis: 'Only the city manager and SmartCity may read the list of accounts.' },
  { who: 'A city manager account with no city on it', code: 'no_tenant_claim', basis: 'Without a city there is no list to show, so it refuses rather than showing every city.' },
  { who: 'Anyone, while the account list cannot be read', code: 'revocation_check_failed', cont: '&hellip;', basis: 'It refuses rather than letting the person in. That is the right way for this to fail.' },
  { who: 'Anyone whose sign-in has aged out', code: 'token_too_old', cont: '&hellip;', basis: 'A sign-in is capped at ' + MINUTES + ' minutes by default, which is what bounds access in Plan review and Smart Files after an account is ended.' },
].filter(Boolean);
const refusals = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'Development services', section: 'City', crumb: 'People and access / Refusals',
  h: 1120, h1: 'When access is refused', pageBadges: ['FIXTURE'], foot: FOOT,
  sub: 'What a person is told when the product will not let them in, in the product&#39;s own words. A refusal names its reason. It is never a blank page, and it is never the wrong reason.',
  body: panel({
    data: ' data-region="refusals"',
    title: 'Refusals', sub: REFUSAL_CARDS.length + ' shown of ' + S.REFUSALS.length + ' the product can emit',
    body: headRow('230px minmax(0,1.3fr) minmax(0,1fr)', ['Who', 'What they are told', 'Why']) + '\n' + REFUSAL_CARDS.map(refusalCard).join('\n'),
  }),
});

/* =======================  write  ======================= */
const BOARDS = [
  ['Access.dc.html', access, 'city-manager', 1420, 'City manager: who can sign in'],
  ['WhoLooked.dc.html', whoLooked, 'city-manager', 980, 'Who looked: not recorded'],
  ['Admin.dc.html', admin, 'admin', 1300, 'SmartCity admin: every account'],
  ['Offboarding.dc.html', offboarding, 'admin', 1160, 'Ending access: where, and how fast'],
  ['Refusals.dc.html', refusals, 'staff', 1120, 'When access is refused'],
];
for (const [file, html] of BOARDS) fs.writeFileSync(new URL('./' + file, import.meta.url), html);
fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  title: 'SmartCity People and access', source: { repo: S.repo, ref: S.ref, commit: S.commit },
  artboards: BOARDS.map(([file, , audience, h, title], i) => ({ file, audience, title, x: (i % 3) * 1720, y: Math.floor(i / 3) * 1440, w: 1600, h })),
}, null, 2) + '\n');
console.log('wrote ' + BOARDS.map((b) => b[0].replace('.dc.html', '')).join(', ') + ' .dc.html + canvas.json, against ' + S.repo + ' ' + S.commit.slice(0, 8));
