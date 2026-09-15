# MISSION — G-122 INCIDENT: live Bastrop v1 regression

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## This is a live customer incident

The City of Bastrop reported a problem with their production dashboard on the morning of
2026-09-14. Staff work in this system daily. It is a real customer, not a demo.

**This dispatch was compiled that morning and never executed.** As of recompile: no commits on
`smartcity-os` since 2026-09-14, no close artifact anywhere on disk, and the service still serves
`smartcity-api-00138-law` tag `g117-full-layers-v2` — the same revision identified as the problem
shape. Nothing has been done. **The city has been waiting all day.** Treat this as the oldest
open item in the program, not a fresh one.

**Diagnose before you fix.** Do not push a change until you can state the symptom, reproduce it,
and name the mechanism. A confident wrong fix on a customer's live system is worse than an hour
of reading.

## Authorisation, stated explicitly

`smartcity-os` is under ABSOLUTE NO-TOUCH in `_catalog/repo_intents.md`. The operator authorised
engagement **for this incident specifically** on 2026-09-14. That authorisation covers
diagnosing and repairing this regression. It does NOT reopen the repo for feature work, and it
does not lift the no-touch. Anything you find that is not this incident gets reported, not fixed.

## Snapshot first

Repo: `/p/smartcity-os` (GitHub `empressaioemail-tech/smartcity-os`). Fetch and confirm you are
current before reading. As of 2026-09-14 local HEAD equalled `origin/main` at `332a16c`.
Declare repository, branch and commit SHA in your first output line. Work on your own branch in
your own worktree.

Live service, read 2026-09-14 from the traffic JSON **by field name**:

```
project    smartcity-os-prod
service    smartcity-api   (region us-central1)
url        https://smartcity-api-7dyaiy7wha-uc.a.run.app
serving    smartcity-api-00138-law @ 100%, tag g117-full-layers-v2
generation 139
```

## What changed, and why that matters

Fourteen PRs (#39 through #52) landed on this repo building a **platform-internal seam for
`smartcity-dashboards`** (the v2 product). v1 production is now serving a revision tagged for
v2's benefit. The operator's own words: the v2 import "broke the version one dashboard."

```
332a16c  Fix wastewater layer: accept polygon geometry, not just lines (#52)
c6cd8be  widen platform layers bridge to full 52-layer GIS parity (#51)
3022f72  platform-internal GIS overlay-layer route (#50)
2776b12  platform-internal address-to-parcel/zoning/flood/permits route (#49)
a00138b  NSpire maintenance records, 7-day alert log, patrol-vehicles route (#48)
d377fbd  platform-internal work-orders route returns clean columns (#47)
72021b7  DVIR, safety events, mileage/fuel flags on samsara route (#45)
29eada2  platform-internal reads for fleet, patrol, fire apparatus, CIP (#42)
1ff70d2  platform-internal reads for work-orders, inspections, licences (#41)
d2d3648  exempt /platform from the session-auth gate (#40)
68fe8cc  platform-internal read-only permits endpoint (G-116) (#39)
0e5c41e  manager-load uses work_order_managers roster, DEFAULT_TENANT_ID 1 to 2
```

## THE CONSTRAINT THAT DECIDES YOUR FIX

`smartcity-dashboards` (v2) reads **this service** server-to-server:

```
/api/platform/mygov/*                    -> v2's permit, work-order and licence data
/api/platform/property-intel/summary     -> v2's native property map, per-parcel
/api/platform/property-intel/layers      -> v2's 52 GIS overlay layers
```

**Reverting the seam repairs v1 by breaking v2.** That is not an acceptable fix. Whatever you
change must leave every one of those routes working, and you must prove it live after the fix,
not assume it.

## Hypotheses to TEST, ranked — not to assume

State which one you are testing, what result would falsify it, and then test it. The documented
recurring error in this operation is stopping at the first plausible explanation.

**1. `d2d3648` (#40) exempted `/platform` from the session-auth gate.** 2026-09-03, inside the
seam. A change to auth middleware in a live multi-tenant app is the single likeliest way to break
a whole dashboard. Read the actual middleware ordering and the exemption's match rule. Ask: can
the exemption match more than `/platform`? A prefix match, a missing anchor, or a reordered
`use()` would let unauthenticated requests through, or break session resolution for normal routes.

**2. `332a16c` (#52) wastewater layer geometry.** 2026-09-04, the most recent seam commit and the
narrowest. Accepting polygon geometry where only lines were accepted can break a renderer that
assumed lines.

**3. Anything else in #39–#52.** Twelve other commits landed in the seam. If neither of the above
explains the symptom, work the rest rather than forcing the evidence into these two.

**DEMOTED, and the planner got this wrong first time round.** `0e5c41e` (DEFAULT_TENANT_ID 1→2)
was originally ranked as a peer of the two above. It is dated **2026-04-05** — five months before
the seam and unrelated to it. It does not explain a regression the city noticed this week, and
treating it as a peer would waste your time. It is still worth knowing the value moved, because
G-131 records that `property-intel/summary` uses a bare numeric tenant literal that has already
been bumped once by an unrelated commit — but that is a structural finding for another row, not
this incident.

## What has been learned since this dispatch was written

G-126 closed today and read this repo's platform handlers read-only. Its findings are directly
relevant and you should not re-derive them:

**`PLATFORM_INTERNAL_API_KEY` binds to no tenant at all.** It is one shared bearer secret gating
all 12 platform routes uniformly.

**Tenant resolution splits three ways behind it.** Five routes do a robust name-based lookup;
`property-intel/summary` uses a bare numeric literal; five vendor routes have no tenant concept
whatsoever.

That is recorded as **G-131** and is NOT yours. Do not fix it here. But if your regression turns
out to live in that area, say so — the two rows would then be one.

## Method

**Get the symptom first.** Ask the operator what Bastrop actually reported if it is not already
in your dispatch: a blank page, a specific screen, missing data, a slow load, an error. A
diagnosis without a symptom is a guess. If you cannot get the symptom, say so and characterise
the system's health broadly instead of picking a hypothesis at random.

**Read the authoritative record, never a proxy.** The revision that served a request is on that
request's own log line, not in `latestReadyRevisionName`. The image a revision runs is its
digest, not the tag that was requested. Whether a table exists is in the catalog, not in the
shape of somebody else's query.

**Never read multi-field CLI output through a positional formatter.** `--format="value(a,b,c)"`
aligns by semicolons and a blank field shifts every column after it. Use JSON and read fields
by name.

**Check whether the symptom predates the deploy.** Compare the reported onset against when
`00138-law` began serving. A regression that predates the deploy has a different cause.

**Verify by violation.** Before reporting the fix as working, reproduce the symptom on the old
behaviour and confirm it does not reproduce on the new. A check observed only passing has not
been observed working.

**Every verification command must be exit-bounded** (`timeout 120 ...`). Never run a command
that waits for input or does not terminate.

## Deploy

Deploys are planner-owned here, which means YOU deploy and you fix your own failed deploys;
never escalate a deploy to the operator. Tag a canary, deploy with `--no-traffic`, smoke it,
then shift traffic, and verify the shift by reading the traffic JSON by field name.

Before shifting traffic, smoke ALL THREE v2-facing routes above plus the v1 symptom.

## Report, do not fix, anything that is not this incident

You will likely find more. The fourteen PRs cite three decision records that **do not exist** in
doc_repo (`2026-09-03_smartcity_os_platform_read_authorization.md`,
`2026-09-03_bastrop_tx_dashboards_pack_ratified.md`, and a 2026-09-04 Leaflet-island override),
and none of that work carries a plan row. That is a real governance gap and it is not yours to
close. Name what you find in your close.

## Close

Write your close to `_inbox/2026-09-14_g122_v1_regression_close.json`.

State: the symptom as reported, the mechanism you believe explains it, **a second mechanism that
would produce the same observation and why you rejected it**, what you changed, the deployed
revision and digest, the violation test in both directions, and live proof that all three
v2-facing platform routes still answer. If you could not determine the cause, say that plainly
rather than shipping a change that might be unrelated.
