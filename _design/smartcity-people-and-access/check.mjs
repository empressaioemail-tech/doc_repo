/**
 * G-143. People and access, an adversarial read as a file rather than a habit.
 *
 *   node dump-source-state.mjs && node gen.mjs && node check.mjs     (reads ./canvas.json's boards)
 *   node check.mjs --dir <path>                                       (another copy; violate.mjs uses this)
 *   node check.mjs --self-test-only
 *
 * Exit 0 PASS. Exit 1 a violation. Exit 2 the instrument REFUSED a verdict, which is not a pass.
 *
 * WHAT IS COMPARED. Every rule takes one input from a board and one from source-state.json, which
 * dump-source-state.mjs reads out of smartcity-dashboards at a named ref with `git show`. The boards are
 * written by gen.mjs and the snapshot by a different program reading the product, so one party acting
 * alone cannot satisfy both sides. The row asks for exactly this: "every role and permission name on the
 * canvas present in the product's own vocabulary and no invented ones."
 *
 * THE FOUR THINGS THIS SURFACE MUST NOT DO, and each is a rule because each is the easy mistake:
 *
 *   Show a limit that is not enforced. A department role gates nothing in the product today. An access
 *   review that says a Fleet account can open only Fleet is a false assurance to a government customer.
 *
 *   Show an access log that does not exist. Nothing records a staff member opening a record. A table of
 *   who-looked rows, however empty, would read as "nobody looked", which is a different and false answer.
 *
 *   Put a real-sounding person on an access roster. On this one surface an invented plausible name reads
 *   as a real employee holding real access, so every person is a fixture on a reserved .invalid domain.
 *
 *   Tell a person the wrong reason. The product refuses a never-provisioned person with "this account has
 *   been disabled", which is false for them. The board must show that as wrong while it is true.
 *
 * NON-VACUITY. Every rule reports what it matched. A rule that must find something and found nothing makes
 * this file refuse a verdict, because a check that matched nothing checked nothing.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
/* Valueless attributes (`<span data-shown>`) are attributes too. The first version only matched name="value",
   so the refusal text was never found, read as empty, and a self-test that expected a refusal passed for the
   wrong reason: it got one because the text was always empty, not because the words were wrong. */
const attrsOf = (s) => { const a = {}; for (const m of s.matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g)) a[m[1]] = m[2] ?? ''; return a; };

/** Walk a board into elements carrying data-* attributes (with their text) and all visible text. */
export function walk(html) {
  const stack = []; const elements = []; let all = '';
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g;
  for (const m of html.matchAll(re)) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) { const t = m[1].toLowerCase(); for (let i = stack.length - 1; i >= 0; i--) if (stack[i].tag === t) { stack.splice(i); break; } continue; }
    if (m[2]) {
      const tag = m[2].toLowerCase(); const el = { tag, attrs: attrsOf(m[3] || ''), text: '', parents: stack.map((e) => e.attrs) };
      if (Object.keys(el.attrs).some((k) => k.startsWith('data-'))) elements.push(el);
      if (!m[4] && !VOID.has(tag)) stack.push(el);
      continue;
    }
    const t = (m[5] || '').replace(/&[a-z]+;|&#\d+;/g, (e) => ({ '&ldquo;': '"', '&rdquo;': '"', '&hellip;': '...', '&middot;': '.', '&#39;': "'", '&nbsp;': ' ', '&amp;': '&' }[e] ?? ' '));
    if (!t.trim()) continue;
    all += t + ' ';
    for (const el of stack) el.text += t;
  }
  return { elements, all };
}

const ACTION_OP = { provision: 'provisionStaffAccount', 'change-role': 'upsertStaffAccount', disable: 'disableStaffAccount', enable: 'enableStaffAccount' };
const FIXTURE_NAME = /^Fixture staff \d{2}$/;
const FIXTURE_EMAIL = /^[a-z0-9.+-]+@example\.invalid$/;

/** The rules, pure, so the self-tests run the same code as the real boards. */
export function evaluate(boards, S) {
  const F = []; const T = { boards: 0, roles: 0, statuses: 0, refusals: 0, persons: 0, actions: 0, latencies: 0, enforcedCells: 0, auditRegions: 0, adminRegions: 0 };
  const push = (rule, board, detail) => F.push({ rule, board, detail });
  let wrongCards = 0;

  for (const b of boards) {
    T.boards++;
    const { elements, all } = walk(b.html);
    const has = (k, v) => elements.filter((e) => e.attrs[k] !== undefined && (v === undefined || e.attrs[k] === v));

    // P1 — no role the product does not have.
    for (const e of has('data-role')) { T.roles++; if (!S.TIER_ROLES.includes(e.attrs['data-role'])) push('P1', b.name, `role "${e.attrs['data-role']}" is not in the product's roles`); }
    // P2 — no status the product does not have.
    for (const k of ['data-status', 'data-status-shown']) for (const e of has(k)) { T.statuses++; if (!S.STATUSES.includes(e.attrs[k])) push('P2', b.name, `status "${e.attrs[k]}" is not in the product's statuses`); }

    // P3 — refusals use the product's codes and the product's words.
    for (const e of has('data-refusal')) {
      T.refusals++;
      const code = e.attrs['data-refusal'];
      const proposed = e.attrs['data-refusal-proposed'] === 'true';
      if (e.attrs['data-wrong'] === 'true') wrongCards++;
      if (proposed) {
        if (S.REFUSALS.includes(code)) push('P3', b.name, `"${code}" is marked proposed but the product already emits it; the proposal is stale`);
        continue;
      }
      if (!S.REFUSALS.includes(code)) { push('P3', b.name, `refusal "${code}" is not emitted by the product and is not marked proposed`); continue; }
      const shownEl = elements.find((x) => x.attrs['data-shown'] !== undefined && x.parents.includes(e.attrs));
      const shown = (shownEl ? shownEl.text : '').replace(/^\s*"|"\s*$/g, '').trim();
      const want = S.REFUSAL_MESSAGES[code];
      if (want && !shown.startsWith(want)) push('P3', b.name, `"${code}" shows "${shown.slice(0, 50)}"; the product says "${want}"`);
    }

    // P4 — no access log is shown while none exists.
    for (const e of has('data-region', 'audit')) {
      T.auditRegions++;
      if (!S.accessLogWritePath && e.attrs['data-recorded'] !== 'false') push('P4', b.name, 'the record-access region does not declare itself unrecorded, and nothing records reads');
    }
    if (!S.accessLogWritePath) {
      for (const e of elements) if (e.attrs['data-recorded'] === 'true') push('P4', b.name, 'a region claims reads are recorded; nothing in the product records them');
      for (const e of has('data-person')) if (e.parents.some((p) => p['data-region'] === 'audit')) push('P4', b.name, `a person row sits inside the record-access region: ${e.attrs['data-person']}`);
    }

    // P5 — no limit is shown that is not enforced.
    for (const e of has('data-enforced')) {
      T.enforcedCells++;
      if (!S.departmentAccessEnforced && e.attrs['data-enforced'] !== 'false') push('P5', b.name, 'a cell presents a role as enforced; no lens route checks a role');
      if (!S.departmentAccessEnforced && !/Every lens/.test(e.text)) push('P5', b.name, `a can-open cell says "${e.text.trim()}" while every account can open every lens`);
    }

    // P6 — the city manager's boards change nothing. P7 — every action is a real operation.
    for (const e of has('data-action')) {
      T.actions++;
      if (b.audience === 'city-manager' && S.peopleAndAccessIsGetOnly) push('P6', b.name, `an action "${e.attrs['data-action']}" on a read-only city-manager board`);
      const op = ACTION_OP[e.attrs['data-action']];
      if (!op || !S.OPERATIONS.includes(op)) push('P7', b.name, `action "${e.attrs['data-action']}" maps to no operation in source`);
    }

    // P8 — the latencies are the product's.
    for (const e of has('data-latency')) {
      T.latencies++;
      if (e.attrs['data-latency'] === 'max-age') {
        if (Number(e.attrs['data-latency-seconds']) !== S.staffTokenMaxAgeSecondsDefault) push('P8', b.name, `max-age ${e.attrs['data-latency-seconds']}s; the product caps at ${S.staffTokenMaxAgeSecondsDefault}s`);
        const mins = Math.round(S.staffTokenMaxAgeSecondsDefault / 60);
        if (!new RegExp('Up to ' + mins + ' minutes').test(e.text)) push('P8', b.name, `a max-age row does not say "Up to ${mins} minutes": "${e.text.trim().slice(0, 60)}"`);
      }
      if (e.attrs['data-latency'] === 'not-ended' && !S.providerSessionNotEnded) push('P8', b.name, 'a row says the provider session is not ended, and the product now ends it');
    }
    if (b.audience === 'admin' && has('data-region', 'offboarding').length && S.providerSessionNotEnded && !has('data-latency', 'not-ended').length) {
      push('P8', b.name, 'the provider session is not ended by the product, and the offboarding board does not say so');
    }

    // P9 — nobody real.
    for (const e of has('data-name')) {
      T.persons++;
      if (!FIXTURE_NAME.test(e.attrs['data-name'])) push('P9', b.name, `"${e.attrs['data-name']}" is not a fixture name; on an access roster that reads as a real employee`);
      if (e.attrs['data-email'] !== undefined && !FIXTURE_EMAIL.test(e.attrs['data-email'])) push('P9', b.name, `"${e.attrs['data-email']}" is not on the reserved .invalid domain`);
    }

    // P10 — the city manager's review says administrators are missing from it.
    for (const e of has('data-region', 'administrators')) T.adminRegions++;
    if (b.audience === 'city-manager' && has('data-person').length && S.cityManagerScopedToOwnTenant) {
      const r = has('data-region', 'administrators');
      if (!r.length || r.some((e) => e.attrs['data-listed'] !== 'false')) push('P10', b.name, 'a city-scoped roster does not say that SmartCity administrators, who reach every city, are not on it');
    }
    if (b.audience === 'city-manager' && has('data-person').length && !S.departmentAccessEnforced && !has('data-notice', 'not-enforced').length) {
      push('P5', b.name, 'a roster the city manager reads carries no notice that roles are not enforced');
    }

    // P11 — no field the product does not return.
    if (!S.ACCOUNT_FIELDS.includes('disabledBy') && /\b(disabled|ended) by\b/i.test(all)) push('P11', b.name, 'shows who ended an account; the product does not return that field');
  }

  // P12 — the wrong-reason refusal is shown exactly while it is true.
  if (S.notProvisionedCollapsesToRevoked && T.refusals > 0 && wrongCards === 0) push('P12', '(all)', 'the product tells a never-provisioned person their account was disabled, and no board shows that as wrong');
  if (!S.notProvisionedCollapsesToRevoked && wrongCards > 0) push('P12', '(all)', 'a board still shows the collapsed refusal as wrong after the product fixed it');

  return { findings: F, totals: T };
}

/* ======================= self-tests, both directions ======================= */
const S0 = {
  TIER_ROLES: ['finance', 'fleet', 'city-manager', 'admin'], STATUSES: ['active', 'disabled'],
  REFUSALS: ['revoked', 'no_tenant_claim'], REFUSAL_MESSAGES: { revoked: 'this account has been disabled.', no_tenant_claim: 'no tenant' },
  OPERATIONS: ['provisionStaffAccount', 'disableStaffAccount', 'enableStaffAccount', 'upsertStaffAccount'],
  accessLogWritePath: false, departmentAccessEnforced: false, peopleAndAccessIsGetOnly: true, cityManagerScopedToOwnTenant: true,
  staffTokenMaxAgeSecondsDefault: 900, providerSessionNotEnded: true, notProvisionedCollapsesToRevoked: true,
  ACCOUNT_FIELDS: ['sub', 'role', 'status', 'disabledAt'],
};
const ok = (rules, html, aud = 'staff', S = S0) => evaluate([{ name: 'T', audience: aud, html }], S).findings.map((f) => f.rule);
const P = (n = '01', role = 'finance', st = 'active') => `<div data-person="fixture-${n}" data-status="${st}"><span data-name="Fixture staff ${n}" data-email="staff${n}@example.invalid">Fixture staff ${n}</span><span data-role="${role}">${role}</span><span data-enforced="false">Every lens</span></div>`;
const CM_OK = `<section data-notice="not-enforced"></section>${P()}<section data-region="administrators" data-listed="false"></section>`;
const card = (code, shown, extra = '') => `<div data-refusal="${code}"${extra}><span data-shown>&ldquo;${shown}&rdquo;</span></div>`;
const S1 = { ...S0, notProvisionedCollapsesToRevoked: false };

const selfTests = [
  ['PASS  a correct city-manager roster is clean', ok(0, CM_OK, 'city-manager').length === 0],
  ['P1    an invented role is REFUSED', ok(0, P('01', 'finance-director')).includes('P1')],
  ['P2    an invented status is REFUSED', ok(0, P('01', 'finance', 'suspended')).includes('P2')],
  ['P3    a refusal code the product never emits is REFUSED', ok(0, card('account_locked', 'x'), 'staff', S1).includes('P3')],
  ['P3    a refusal in the WRONG words is REFUSED', ok(0, card('revoked', 'your access was paused.'), 'staff', S1).includes('P3')],
  ['P3    a refusal in the product words is clean', ok(0, card('revoked', 'this account has been disabled.'), 'staff', S1).length === 0],
  ['P3    a proposed code the product already emits is REFUSED as stale', ok(0, card('revoked', 'x', ' data-refusal-proposed="true"'), 'staff', S1).includes('P3')],
  ['P4    an audit region that does not declare itself unrecorded is REFUSED', ok(0, '<section data-region="audit" data-recorded="true"></section>').includes('P4')],
  ['P4    a person row inside the audit region is REFUSED', ok(0, `<section data-region="audit" data-recorded="false">${P()}</section>`).includes('P4')],
  ['P4    an unrecorded audit region is clean', ok(0, '<section data-region="audit" data-recorded="false"><p>Not recorded</p></section>').length === 0],
  ['P5    a can-open cell claiming a limit is REFUSED', ok(0, P().replace('data-enforced="false">Every lens', 'data-enforced="false">Fleet only')).includes('P5')],
  ['P5    a cell claiming enforcement is REFUSED', ok(0, P().replace('data-enforced="false"', 'data-enforced="true"')).includes('P5')],
  ['P5    a city-manager roster with no not-enforced notice is REFUSED', ok(0, CM_OK.replace('data-notice="not-enforced"', 'data-notice="x"'), 'city-manager').includes('P5')],
  ['P6    an action on a city-manager board is REFUSED', ok(0, CM_OK + '<span data-action="disable">End</span>', 'city-manager').includes('P6')],
  ['P6    the same action on an admin board is clean', ok(0, '<span data-action="disable">End</span>', 'admin').length === 0],
  ['P7    an action with no operation in source is REFUSED', ok(0, '<span data-action="merge-accounts">x</span>', 'admin').includes('P7')],
  ['P8    a max-age that is not the product cap is REFUSED', ok(0, '<div data-latency="max-age" data-latency-seconds="3600">Up to 60 minutes</div>', 'admin').includes('P8')],
  ['P8    the right seconds with the wrong words is REFUSED', ok(0, '<div data-latency="max-age" data-latency-seconds="900">Within an hour</div>', 'admin').includes('P8')],
  ['P8    an offboarding board silent on the provider session is REFUSED', ok(0, '<section data-region="offboarding"><div data-latency="next-request">next</div></section>', 'admin').includes('P8')],
  ['P9    a plausible real name is REFUSED', ok(0, P().replace(/Fixture staff 01/g, 'Maria Gonzalez')).includes('P9')],
  ['P9    a real-looking email domain is REFUSED', ok(0, P().replace('staff01@example.invalid', 'mgonzalez@cityofbastrop.org')).includes('P9')],
  ['P10   a city roster that hides the administrator gap is REFUSED', ok(0, CM_OK.replace('data-listed="false"', 'data-listed="true"'), 'city-manager').includes('P10')],
  ['P11   showing who ended an account is REFUSED', ok(0, '<p>Ended 09/17 by smartcity-admin; disabled by Jo</p>').includes('P11')],
  ['P12   hiding the wrong-reason refusal while it is true is REFUSED', ok(0, card('revoked', 'this account has been disabled.')).includes('P12')],
  ['P12   showing it is clean', ok(0, card('revoked', 'this account has been disabled.') + card('revoked', 'this account has been disabled.', ' data-wrong="true"')).length === 0],
  ['VACUITY  a board with nothing on it matches nothing', Object.values(evaluate([{ name: 'E', audience: 'staff', html: '<p>x</p>' }], S0).totals).slice(1).every((v) => v === 0)],
];
let failed = 0;
for (const [label, pass] of selfTests) if (!pass) { console.error('SELF-TEST FAILED: ' + label); failed++; }
if (failed) { console.error(`\nREFUSING A VERDICT: ${failed} self-test(s) failed, so this instrument cannot be trusted.`); process.exit(2); }
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);
if (process.argv.includes('--self-test-only')) process.exit(0);

/* ======================= the real boards ======================= */
const here = dirname(fileURLToPath(import.meta.url));
const di = process.argv.indexOf('--dir');
const dir = di >= 0 ? process.argv[di + 1] : here;
const need = (f) => { if (!existsSync(join(dir, f))) { console.error(`\nREFUSING A VERDICT: no ${f} in ${dir}.`); process.exit(2); } };
need('canvas.json'); need('source-state.json');

let canvas, S;
try { canvas = JSON.parse(readFileSync(join(dir, 'canvas.json'), 'utf8')); S = JSON.parse(readFileSync(join(dir, 'source-state.json'), 'utf8')); }
catch (e) { console.error('\nREFUSING A VERDICT: unparsable input: ' + e.message); process.exit(2); }
if (!canvas.artboards?.length) { console.error('\nREFUSING A VERDICT: canvas.json declares no boards.'); process.exit(2); }
if (!S.commit || !S.TIER_ROLES?.length) { console.error('\nREFUSING A VERDICT: source-state.json is not a snapshot.'); process.exit(2); }
if (canvas.source?.commit && canvas.source.commit !== S.commit) {
  console.error(`\nREFUSING A VERDICT: the boards were drawn against ${canvas.source.commit.slice(0, 8)} and the snapshot is ${S.commit.slice(0, 8)}. Regenerate with node gen.mjs.`);
  process.exit(2);
}

const onDisk = readdirSync(dir).filter((f) => f.endsWith('.dc.html'));
const declared = canvas.artboards.map((a) => a.file);
const boards = canvas.artboards.filter((a) => onDisk.includes(a.file)).map((a) => ({ name: a.file, audience: a.audience, html: readFileSync(join(dir, a.file), 'utf8') }));
const { findings, totals } = evaluate(boards, S);
for (const f of onDisk.filter((f) => !declared.includes(f))) findings.push({ rule: 'P0', board: f, detail: 'a board on disk that canvas.json does not declare is refused' });
for (const f of declared.filter((f) => !onDisk.includes(f))) findings.push({ rule: 'P0', board: f, detail: 'canvas.json declares a board that is not on disk' });

console.log(`source: ${S.repo} ${S.ref} ${S.commit.slice(0, 8)}`);
console.log('matched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));
const vacuous = Object.entries(totals).filter(([k, v]) => k !== 'boards' && v === 0).map(([k]) => k);
if (vacuous.length) { console.error('\nREFUSING A VERDICT: these predicates matched nothing on any board: ' + vacuous.join(', ') + '.'); process.exit(2); }
if (findings.length) { for (const f of findings) console.error(`${f.rule}  ${f.board}  ${f.detail}`); console.error(`\n${findings.length} violation(s).`); process.exit(1); }
console.log(`\nPASS ${boards.length} boards against ${S.commit.slice(0, 8)}. ${totals.roles} role names and ${totals.statuses} statuses, every one the product's; ${totals.refusals} refusals in the product's words; no limit shown that is not enforced; no access log shown while none exists; ${totals.persons} people, every one a fixture.`);
