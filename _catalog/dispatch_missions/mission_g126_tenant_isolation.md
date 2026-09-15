# MISSION — G-126: tenant isolation, the prerequisite to staff logins

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Why this row exists and what it is not

Real Bastrop staff credentials are about to be issued. The operator's own G-115 item-5 ruling
accepted the current persona-list access model **"scoped to a small named set of invited Bastrop
staff… revisited before any wider rollout."** Issuing logins is the wider rollout, so that
condition has fired.

**This row is NOT RBAC.** RBAC by department is G-127 and comes after. This row fixes three
specific verified defects where one tenant's data can reach another tenant, or where the
scoping that appears to hold is coincidental rather than enforced.

Two repos are in scope. Take them in this order — the first is the one that blocks logins.

---

## Defect 1 — `plan-review`: the list route has no tenant gate

Repo: `/p/plan-review`, GitHub `empressaioemail-tech/plan-review`. Local checkout was **16
commits behind** `origin/main` (`1af5ac5`) on 2026-09-14. Fetch first.

`GET /queue` returned **all 25 engagements across all three tenants** to an unauthenticated
caller with no persona asserted. Cross-tenant refusal IS implemented and IS correct — verified
live in both directions, read and write — but it covers only the `/engagements/:id/*` subtree,
and only when a persona is asserted. The list route was never gated.

**Do not widen the by-id gate into something clever.** The by-id refusal works; find why the
list route does not pass through the same check and make it, so there is one enforcement point
rather than two that can drift.

Before you fix it, **enumerate every route that returns a collection** — queue, findings,
library, code, activity, any admin or export path. The defect is "list routes were not
considered", so assume there is more than one. Report the full enumeration whether or not each
one turned out to be vulnerable.

---

## Defect 2 — `smartcity-dashboards`: the cityKey is stamped, not verified

Repo: `/p/smartcity-dashboards`. Local checkout was **43 commits behind** `origin/main`
(`86487fa`). Fetch first.

`mapRealPermitRecord(row, cityKey, ...)` **stamps** `pack.cityKey` onto every row returned by
the upstream platform call. The outbound call carries **no tenant parameter at all**.

Today that is correct only because the upstream (`smartcity-os`) is single-tenant Bastrop. The
moment a second tenant exists behind that key, this product labels another city's permits
`bastrop_tx` and **nothing fails** — no exception, no log line, no test.

The fixture path already has the right control: `domains.test.mjs` asserts a throw when a record's
city disagrees with the pack. The real path has no equivalent. **Build the paired control**: the
record's own tenant identity is compared against the pack, and a disagreement refuses rather than
relabels.

If the upstream response carries no tenant field to compare against, that is the finding —
report it and say what would have to change upstream, rather than inventing a field or widening
the check to admit the value.

---

## Defect 3 — `smartcity-os`: is the platform key actually bound to tenant 2?

Repo: `/p/smartcity-os`. **This repo is under ABSOLUTE NO-TOUCH** in `_catalog/repo_intents.md`.
The operator authorised engagement narrowly, for incident G-122 and for this question. That
authorisation covers **reading** the platform-route handlers and, if the binding is absent,
**reporting it**. It does not cover feature work, and it does not lift the no-touch.

The question: is `PLATFORM_INTERNAL_API_KEY` bound server-side to `tenant_id=2`, or does the
route serve whatever tenant the caller names — or whatever the default tenant happens to be?

Read `server/routes/property-intelligence.ts`, the `/api/platform/*` registrations, and
`d2d3648` (#40, which exempted `/platform` from the session-auth gate). Note `0e5c41e` flipped
`DEFAULT_TENANT_ID` from 1 to 2 — a default that changes meaning is exactly how this kind of
binding turns out to be accidental.

**State the answer plainly either way.** "The key is bound at line N" and "the key is not bound;
scoping holds only because the upstream has one tenant" are both complete answers. The second is
more valuable and must not be softened.

G-122 is working this same repo on the v1 regression. **Coordinate: do not both change the
auth middleware.** If your finding requires a change there, hand it to G-122 rather than making
it yourself.

---

## Method

Verify by violation, in both directions. A check observed only passing has not been observed
working. For each defect: reproduce the leak, apply the fix, confirm the leak is refused, and
confirm the legitimate case still succeeds. Report both halves.

Pre-register the falsifier before each check. State what result would prove the fix wrong. If no
result would, it is not a check.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism you believe explains an observation, then a second mechanism that would
produce the same observation and why you rejected it.

Read the authoritative record, never a proxy. The revision that served a request is on that
request's log line, not in `latestReadyRevisionName`. Read Cloud Run traffic from JSON **by
field name**, never a positional `value()` formatter.

Never print secret VALUES. Env var names only.

Every verification command exit-bounded (`timeout 120 ...`).

## Out of scope

RBAC by department (G-127). Any change to the persona model itself. The v1 regression (G-122).
Anything in `smartcity-os` beyond reading the platform handlers.

## Close

Deploys are planner-owned: you deploy, and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by JSON field name.

Write your close to `_inbox/2026-09-14_g126_tenant_isolation_close.json`. For each of the three
defects state: the violation test in both directions, what you changed, and the deployed
revision and digest. Include the full enumeration of collection-returning routes from defect 1,
and the plain answer to defect 3 whether or not you liked it.
