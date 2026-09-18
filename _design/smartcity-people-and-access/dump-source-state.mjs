/**
 * Capture the product's own People and access vocabulary from source, at a named ref, into
 * source-state.json. check.mjs compares every board against THIS file, so the boards cannot invent a
 * role, a status, a refusal or a latency the product does not have: the design is one party and the
 * product source is the other.
 *
 *   node dump-source-state.mjs [--repo <path to a smartcity-dashboards clone>] [--ref origin/main]
 *
 * Reads with `git show <ref>:<file>`, never the working tree, so a dirty checkout on some lane's
 * branch cannot leak into the snapshot. Refuses (exit 2) if any value it needs is not found, because a
 * snapshot with a hole in it would let the check pass vacuously on that field.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const REPO = arg('--repo', 'P:/seat-worktrees/govtech/smartcity-dashboards');
const REF = arg('--ref', 'origin/main');
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8' });
const show = (f) => git('show', `${REF}:${f}`);
const die = (m) => { console.error('REFUSING TO WRITE A SNAPSHOT: ' + m); process.exit(2); };

const commit = git('rev-parse', REF).trim();
const identity = show('src/staff-identity.mjs');
const directory = show('src/staff-directory.mjs');
const server = show('src/server.mjs');

const arr = (src, name) => {
  const m = src.match(new RegExp('export const ' + name + ' = \\[([^\\]]*)\\]'));
  if (!m) die(`${name} not found`);
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
};
const DEPARTMENT_ROLES = arr(identity, 'DEPARTMENT_ROLES');
const tierLine = identity.match(/export const TIER_ROLES = \[\.\.\.DEPARTMENT_ROLES, ([^\]]*)\]/);
if (!tierLine) die('TIER_ROLES not found');
const TIER_ROLES = [...DEPARTMENT_ROLES, ...[...tierLine[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])];

const statusM = directory.match(/CHECK \(status IN \(([^)]*)\)\)/);
if (!statusM) die('status CHECK constraint not found');
const STATUSES = [...statusM[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);

const disabledByM = directory.match(/disabledBy = "([^"]+)"/);
if (!disabledByM) die('disableStaffAccount default disabledBy not found');

// Refusal codes the identity module and the People and access route actually emit.
// `\s*` matters: several calls are written `refuse(\n  "code", ...)`, and a pattern requiring `refuse("`
// with nothing between missed three of them (token_too_old, unknown_issuer, unsupported_algorithm).
const refusals = new Set([...identity.matchAll(/refuse\(\s*"([a-z_]+)"/g)].map((x) => x[1]));
const route = server.slice(server.indexOf('/api/people-and-access'), server.indexOf('/api/feedback'));
if (!route || route.length < 50) die('the /api/people-and-access route was not found');
for (const m of route.matchAll(/error: "([a-z_]+)"/g)) refusals.add(m[1]);
const REFUSALS = [...refusals].sort();
if (REFUSALS.length < 5) die('fewer than five refusal codes found; the pattern is wrong, not the product');

const allowedM = route.match(/caller\.role !== "([^"]+)" && caller\.role !== "([^"]+)"/);
if (!allowedM) die('the roles allowed to read People and access were not found');
const PEOPLE_AND_ACCESS_READERS = [allowedM[1], allowedM[2]].sort();
// The city manager's list is scoped to her own city; the administrator reads any city. So a city-scoped
// list cannot show administrators, who hold access to every city.
const SCOPE_RULE = /scopeTenant = caller\.role === "admin" \? requestedTenant \|\| null : caller\.tenant/;
// Negative control. This exact pattern was once written through a shell string, lost its backslashes, and
// became an alternation with an empty branch (`||`), which matches every input and would report the rule
// present in any file. It must NOT match a route that lacks the rule.
if (SCOPE_RULE.test('const scopeTenant = requestedTenant; // no role split here')) die('the scope-rule pattern matches a route without the rule; it is vacuous');
const cityManagerScopedToOwnTenant = SCOPE_RULE.test(route);
if (!cityManagerScopedToOwnTenant) die('the People and access scope rule was not found');
// Every method that handles the route, in either order of the two conditions. A negative-only test would
// report read-only whenever it failed to find a writer, including when it simply failed to parse one.
const PA_METHODS = [
  ...[...server.matchAll(/req\.method === "(\w+)" && url\.pathname === "\/api\/people-and-access"/g)].map((m) => m[1]),
  ...[...server.matchAll(/url\.pathname === "\/api\/people-and-access" && req\.method === "(\w+)"/g)].map((m) => m[1]),
];
if (!PA_METHODS.includes('GET')) die('the GET handler for /api/people-and-access was not found, so read-only cannot be judged');
const isGetOnly = PA_METHODS.every((m) => m === 'GET');

const fieldsM = route.match(/accounts\.map\(\(a\) => \(\{([\s\S]*?)\}\)\)/);
if (!fieldsM) die('the account fields the route returns were not found');
const ACCOUNT_FIELDS = [...fieldsM[1].matchAll(/(\w+): a\.\w+/g)].map((x) => x[1]);

const ageM = identity.match(/STAFF_TOKEN_MAX_AGE_SECONDS \?\? "(\d+)"/);
if (!ageM) die('STAFF_TOKEN_MAX_AGE_SECONDS default not found');
const noLocalRevocation = /plan-review and smart-files have no local revocation store/.test(identity);

// The collapse: both "not provisioned here" and "disabled" return true from isStaffAccountRevoked,
// and staff-identity refuses every true with the one "revoked" message.
const collapse = /if \(!record\) return true;/.test(directory);
const revokedMsgM = identity.match(/refuse\("revoked", "([^"]+)"\)/);
if (!revokedMsgM) die('the revoked refusal message was not found');

// Is department access ENFORCED anywhere? Count role checks in server.mjs OUTSIDE the People and
// access route. Zero means a role is recorded on the identity and gates nothing but this one page.
const outsideRoute = server.slice(0, server.indexOf('/api/people-and-access')) + server.slice(server.indexOf('/api/feedback'));
const ROLE_CHECK = /caller\.role\s*[!=]==/g;
// Positive control, because this regex once lost its backslashes through shell quoting and compiled to
// something that matched nothing, which would report "no role checks" for any input. The People and
// access route is KNOWN to contain role checks, so the same regex must find them there, or it is broken.
const insideRouteChecks = (route.match(ROLE_CHECK) || []).length;
if (insideRouteChecks < 1) die(`the role-check pattern found ${insideRouteChecks} checks inside the People and access route, which is known to have them; the pattern is broken`);
const lensRoleChecks = (outsideRoute.match(ROLE_CHECK) || []).length;

// The words a refused person is actually shown, keyed by code. A template literal keeps only its static
// prefix, because the rest is filled at runtime; check.mjs compares a board's text against these.
const REFUSAL_MESSAGES = {};
for (const m of identity.matchAll(/refuse\(\s*"([a-z_]+)",\s*"([^"]+)"\s*\)/g)) REFUSAL_MESSAGES[m[1]] ??= m[2];
for (const m of identity.matchAll(/refuse\(\s*"([a-z_]+)",\s*`([^`$]+)/g)) REFUSAL_MESSAGES[m[1]] ??= m[2].trim();
for (const m of route.matchAll(/error: "([a-z_]+)",\s*message: "([^"]+)"/g)) REFUSAL_MESSAGES[m[1]] ??= m[2];
for (const code of ['revoked', 'not_admin_or_city_manager', 'no_tenant_claim', 'revocation_check_failed', 'expired_token']) {
  if (!REFUSAL_MESSAGES[code]) die(`no message found for refusal ${code}`);
}
// Two extractions over the same source must agree on the set of codes. When they did not, the code list
// was short by three and nothing noticed; now the disagreement refuses the snapshot.
const codesOnly = Object.keys(REFUSAL_MESSAGES).filter((c) => !REFUSALS.includes(c));
if (codesOnly.length) die(`codes with a message but missing from the refusal list: ${codesOnly.join(', ')}`);

// Two admissions the provisioning client makes about itself, which the admin board must not hide.
const adminClient = show('src/staff-admin-client.mjs');
const workosNeverCalledLive = /has been called against a real WorkOS organization/.test(adminClient) && /BUILD NOW, VERIFY LATER/.test(adminClient);
const mfaEnabledByHand = /MUST be enabled by hand in the WorkOS dashboard/.test(adminClient);
// Ending an account locally does not end the person's session at the provider; the directory says so.
const providerSessionNotEnded = /provider-side "actually invalidate the session/.test(directory);
if (!/export async function provisionStaffAccount/.test(adminClient)) die('provisionStaffAccount not found');
const OPERATIONS = ['provisionStaffAccount', 'upsertStaffAccount', 'disableStaffAccount', 'enableStaffAccount'].filter((fn) =>
  new RegExp('export async function ' + fn + '\\b').test(adminClient + directory));

// Is there ANY write path that records a staff read of a record? Searched across all of src/.
const files = git('ls-tree', '-r', '--name-only', REF, 'src/').split('\n').filter((f) => f.endsWith('.mjs') && !f.includes('.test.'));
const accessLogHits = [];
for (const f of files) {
  const s = show(f);
  if (/(access_log|accessLog|audit_log|auditLog|recordRead|logRead|read_log|who_viewed)/.test(s)) accessLogHits.push(f);
}

const state = {
  _note: 'Captured from source by dump-source-state.mjs. Do not edit by hand; re-run the dump.',
  repo: 'smartcity-dashboards', ref: REF, commit, capturedAt: new Date().toISOString(),
  DEPARTMENT_ROLES, TIER_ROLES, STATUSES,
  disabledByDefault: disabledByM[1],
  REFUSALS,
  PEOPLE_AND_ACCESS_READERS,
  peopleAndAccessIsGetOnly: isGetOnly,
  cityManagerScopedToOwnTenant,
  ACCOUNT_FIELDS,
  staffTokenMaxAgeSecondsDefault: Number(ageM[1]),
  planReviewAndSmartFilesHaveNoLocalRevocation: noLocalRevocation,
  notProvisionedCollapsesToRevoked: collapse,
  revokedMessage: revokedMsgM[1],
  departmentAccessEnforced: lensRoleChecks > 0,
  roleChecksOutsidePeopleAndAccess: lensRoleChecks,
  roleChecksInsidePeopleAndAccessControl: insideRouteChecks,
  REFUSAL_MESSAGES,
  workosNeverCalledLive,
  mfaEnabledByHand,
  providerSessionNotEnded,
  OPERATIONS,
  accessLogWritePath: accessLogHits.length > 0,
  accessLogFilesScanned: files.length,
  accessLogHits,
};
writeFileSync(new URL('./source-state.json', import.meta.url), JSON.stringify(state, null, 2) + '\n');
console.log(`snapshot of ${REPO} @ ${REF} ${commit.slice(0, 8)}: ${TIER_ROLES.length} roles, ${STATUSES.length} statuses, ${REFUSALS.length} refusals, ${ACCOUNT_FIELDS.length} account fields, access-log write path ${state.accessLogWritePath} across ${files.length} files`);
