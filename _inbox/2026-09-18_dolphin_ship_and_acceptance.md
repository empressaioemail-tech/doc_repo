---
id: 2026-09-18_dolphin_ship_and_acceptance
title: dolphin-app ship performed and accepted - D-13's production step, and the two feeds it exposed
status: evidence
owner: integration (SmartCity planning seat)
last_updated: 2026-09-18
related: [_inbox/2026-09-18_dolphin_ship_preflight, _inbox/2026-09-18_planner_four_row_regrade, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_operations/OPS-25_cloud_infrastructure_and_cost_program]
---

# The ship, performed and then graded on the surface

Snapshot: `doc_repo` `main` at the commit carrying this file. Instruments:
`scripts/govtech/dolphin-ship.mjs` (state changing, writes the app spec and forces the build) and
`scripts/govtech/dolphin-ship-acceptance.mjs` (read only, grades the deployed surface). Both
`node --use-system-ca`. Neither prints a secret value.

The operator authorised the ship in session on 2026-09-18 (*"can you just take care of all this
here"*), which is A-149's ruling executed rather than escalated. A-149 assigned the ship to the
`d14-d13-v1-reach` lane as its last step with a named fallback: if the lane had finished, the ship is
planner-owned with the identical precondition and read-back. The lane holds no claim and has filed no
close in this worktree, so this was performed as the fallback rather than left unrun.

## What was written, and what was deliberately not

| | |
|---|---|
| App | `dolphin-app` `95691c40-27ca-4afb-b9b4-a37e079c5e69`, `app.smartcityos.io` |
| Spec change | one env entry: `SMARTCITY_V1_PLATFORM_BASE = https://walrus-app-kzog6.ondigitalocean.app`, `GENERAL`, `scope: RUN_AND_BUILD_TIME` |
| Value derived by | set difference against `d12-main-uat`'s own spec, not typed |
| Deployment before | `ded9afcb`, ACTIVE since 00:27:49Z, `cause: "domain app.smartcityos.io ready"`, serving `3d3ec62a` |
| Deployment after | `e98f127c-aa0b-4550-9908-1044c616641d`, ACTIVE, `cause: "app spec updated"`, serving `7487d7c0` |
| Read back | `services[0].source_commit_hash = 7487d7c0a55deeefc286c4a1047545757b802c5b` = `smartcity-dashboards` `origin/main`, byte for byte |
| Untouched | the branch (`main` already, so no repoint), the domain (`app.smartcityos.io` still PRIMARY), `walrus-app`, the GCP copy, and every secret |

The write was gated on an enumerated diff of both spec trees, not a spot check: the PUT was permitted
only if it changed nothing outside `services[0].envs` and every pre-existing entry round-tripped byte
for byte. All ten `EV[1:...]` secret values were echoed back exactly as the GET returned them, per
DigitalOcean's app-spec reference, so no plaintext was ever read, constructed, or transmitted.

## Two instrument defects this found, both in the instruments rather than the data

These are recorded because each one produced a confident wrong answer, and the second is the exact
shape the enforcement doctrine warns about.

**1. The PUT response names the PREVIOUS deployment.** `PUT /v2/apps/{id}` returns an `app` object
whose `active_deployment` is still the old one; the new deployment appears only in
`GET /v2/apps/{id}/deployments`. Reading `source_commit_hash` from the PUT response polled the
superseded deployment, saw its old commit, and reported a **failed ship while the real one was
building**. The instrument now finds the new deployment by set difference, the same technique it uses
for the env delta, and refuses if the write produced no new deployment at all.

**2. A convenient result that was true by construction.** The first version of the PII clause joined
served rows to vendor rows on `recordId` through a `Map`. It reported 88 subjects matching "neither"
the vendor's `type` nor its `title`, which reads as a data defect. It was an artifact of the join:
`recordId` is **not unique** on either side, 181 rows over 52 distinct work-order numbers, because one
work order carries several line items, so a `Map` collapses the duplicates and matches each row against
whichever row it happened to keep. The check is now on the MULTISET of `(recordId, subject)` against
the vendor's `(workOrderNumber, type)`, which is both correct under duplicates and still two
independently derived sides. **A per-row join on a key whose uniqueness was never measured is not a
check.** The complementary trap was the first, loose version of the same clause, which asked only
whether each subject appeared anywhere in the vendor's global type SET; it scored 181 of 181 and was
nearly reported. Set membership is weaker than the multiset agreement and would have passed on a
column that had been shuffled between rows.

## The acceptance, graded on the deployed surface

`GET https://app.smartcityos.io/api/city-domains?cityKey=bastrop_tx` with the lane-verification tenant
key. Eleven registered domains, eight carrying records:

| domain | gatedBy | status | records |
|---|---|---|---|
| permits-pipeline | mygov | ok | 294 |
| work-orders | mygov | ok | 181 |
| fleet-vehicles | samsara | ok | 75 |
| patrol-vehicles | spireon | ok | 27 |
| cip-projects | powerbi | ok | 14 |
| inspections | mygov | ok | 2041 |
| code-violations | mygov | ok | 1509 |
| business-licenses | mygov | ok | 73 |
| police-cameras | verkada | no-fixture-source | 0, stated: not granted on bastrop_tx |
| **fire-apparatus** | **firstdue** | **unavailable** | **0, basis `platform HTTP 504`** |
| **call-analytics** | **goto** | **unavailable** | **0, basis `platform HTTP 504`** |

Every domain that carries no records states a basis, so no zero is bare. That is the property that
matters more than the count: a fabricated zero enters a ratio without announcing itself.

**The three D-13 clauses, graded:**

1. **The finance route no longer answers `unknown lens`.** Before the ship,
   `/api/lenses/finance/sources?cityKey=template-city` answered `404 {"error":"unknown lens"}` on
   production. It now answers 200 with `finance / refusals / capture / captureIntro / captureCaveat`,
   both keyed for `bastrop_tx` and keyless.
2. **The feeds read through the new base.** Eight platform routes compared as PAYLOAD, not framing,
   against the GCP host production read before the ship: `mygov` permits, work-orders, inspections,
   code-violations and business-licenses, plus `powerbi/cip-projects`, `samsara/vehicles` and
   `spireon/vehicles`. All eight are byte-identical on both hosts, at 204,425 / 116,241 / 651,247 /
   1,260,954 / 34,714 / 13,893 / 29,342 / 15,445 bytes respectively. Three further routes
   (`opengov/budgets`, `opengov/chart-of-accounts`, `finance/permit-revenue/summary`) exist ONLY on
   the new host, where the GCP copy returns the SPA HTML shell: the ship makes them reachable from the
   dashboards for the first time.
3. **The work-order Subject column carries no resident free text.** Served bytes against the vendor
   payload: the multiset of `(recordId, subject)` is IDENTICAL to the vendor's `(workOrderNumber,
   type)`; the 7 distinct served subjects are exactly the vendor's 7 declared types; zero subjects are
   a vendor `title` without being a type; zero carry a phone-number shape; and no served row carries a
   `title` field at all. `DEBORAH MOORE, PH#737-762-6252` sat in exactly that column before G-154.

The instrument's own ability to fail was checked in the same run: a bogus tenant key is refused (401),
an unknown city does not resolve (404), and a bogus platform bearer is refused (401).

## The finding: two feeds the ship repointed now fail differently, and one is worse

This is the only respect in which the ship changed a behaviour for the worse, and it is a `smartcity-os`
defect that the ship exposed rather than caused.

`fire-apparatus` (firstdue) and `call-analytics` (goto) are `unavailable` on **both** hosts, so the
ship did not break a working feed. What changed is the reason a consumer is given:

| | new host (`walrus-app`) | old host (GCP `smartcity-api`) |
|---|---|---|
| firstdue | `504`, Cloudflare HTML, ~0.9s, no reason | `503` JSON `permission_required`: *"Apparatus data exists in FirstDue but current API credentials do not have access (contact dashboards@firstarriving.com to request apparatus/assets API scope)"* |
| goto | `504`, Cloudflare HTML, ~1.2s, no reason | `503` JSON `goto_not_authorized`, `needsAuth: true` |

So the dashboards state `basis: "platform HTTP 504"` where they used to state an actionable vendor
permission message naming the address to contact. Both fail closed, and `fetchLiveJson` handles the
case correctly (a non-JSON body leaves `body` null and the basis falls through to `platform HTTP 504`,
never a fabricated value), so this is a loss of diagnosis rather than a correctness defect.

**Where it is:** inside the handler, not at the auth path. Proven by violation: on `walrus-app` a
one-character-mutated bearer still returns the gate's `401 platform_internal_required` on both routes,
while the canonical bearer returns `504`. The gate runs, the handler is reached, and the failure is in
the vendor call or its error path. `mygov/permits` and `powerbi/cip-projects` on the same host return
200 with the canonical key and 401 with the mutation, so the host is healthy generally.

**Not fixed here.** It belongs to the `smartcity-os` (property) seat, not to this ship, and this
program's rule is that a lane does not fix another seat's surface. It is carded as a finding for a new
row: make `walrus-app`'s firstdue and goto platform routes return the structured, actionable 503 the
GCP copy returned instead of an opaque edge 504.

## What this does not establish

- No lane close, CP1 or CP2 exists for `d14-d13-v1-reach` in this worktree, and the lane holds no
  claim. This ship and this acceptance are planner acts. The lane's own scope 5 (a bake window in
  which GCP `smartcity-api` logs zero platform requests) is **not** graded here, and it is the last
  thing standing between D-13 and a full close.
- The payload comparison proves the two hosts agree **now**. It does not prove the GCP copy is safe to
  delete, which is scope 5's job and needs a bake with a lens actually opened.
- `health=NONE` on all three apps is observed and unchanged. No health check was added or removed.
- The `verkada` domain is `no-fixture-source` by design (`bastrop_tx` grants no Verkada adapter). It is
  not a defect and is recorded so the next reader does not card it.

## The verbatim acceptance run

```
# dolphin ship acceptance | 2026-09-18T18:11:49.349Z

## production serves
   deployment=e98f127c-aa0b-4550-9908-1044c616641d phase=ACTIVE cause="app spec updated"
   source_commit_hash=7487d7c0a55deeefc286c4a1047545757b802c5b
   dashboards origin/main=7487d7c0a55deeefc286c4a1047545757b802c5b
   SMARTCITY_V1_PLATFORM_BASE=https://walrus-app-kzog6.ondigitalocean.app
PASS: the running commit IS dashboards origin/main, byte for byte
PASS: the platform base is the v1 platform, not a host being retired
PASS: app.smartcityos.io is still the PRIMARY domain

## finance route
   template-city keyless: 200 ["finance","refusals","capture","captureIntro","captureCaveat"]
   bastrop_tx keyed:      200 ["finance","refusals","capture","captureIntro","captureCaveat"]
PASS: the finance route no longer answers `unknown lens` (the D-13 clause)
PASS: the finance route serves bastrop_tx with the tenant key

## bastrop_tx domains: 8/11 carry records
   permits-pipeline     gatedBy=mygov     status=ok                records=294
   work-orders          gatedBy=mygov     status=ok                records=181
   fleet-vehicles       gatedBy=samsara   status=ok                records=75
   patrol-vehicles      gatedBy=spireon   status=ok                records=27
   police-cameras       gatedBy=verkada   status=no-fixture-source records=0      basis=bastrop_tx generates no records, and Ver...
   fire-apparatus       gatedBy=firstdue  status=unavailable       records=0      basis=platform HTTP 504
   cip-projects         gatedBy=powerbi   status=ok                records=14
   call-analytics       gatedBy=goto      status=unavailable       records=0      basis=platform HTTP 504
   inspections          gatedBy=mygov     status=ok                records=2041
   code-violations      gatedBy=mygov     status=ok                records=1509
   business-licenses    gatedBy=mygov     status=ok                records=73
PASS: the domain registry still reports 11 registered domains
PASS: every domain without records states a basis rather than reporting bare zero

## work-order subject: the dashboards' served bytes vs the vendor payload
   served rows=181 over 52 distinct work-order numbers (one order, several line items)
   vendor rows=181 over 52 distinct work-order numbers
   multiset (recordId|subject) vs (workOrderNumber|type): IDENTICAL
   distinct served subjects: ["general","roads","utilities","facilities","parks","traffic","drainage"]
   distinct vendor types:    ["general","roads","utilities","facilities","parks","traffic","drainage"]
   subjects outside the vendor's type vocabulary: 0
   subjects that are a vendor free-text title and not a type (leakage): 0
   subjects carrying a phone-number shape: 0
   served rows carrying a 'title' field: 0
PASS: served row count equals the vendor row count (181)
PASS: the served (id, subject) multiset IS the vendor's (workOrderNumber, type) multiset, row for row
PASS: every served subject is drawn from the vendor's own declared type vocabulary
PASS: NO served subject is the vendor's free-text title, where residents write names and phone numbers
PASS: no served subject carries a phone-number shape
PASS: no served row carries a `title` field at all

## platform route payload parity, v1 platform vs the host production read before the ship
   same   /api/platform/mygov/permits  v1=200/204425B  gcp=200/204425B
   same   /api/platform/mygov/work-orders  v1=200/116241B  gcp=200/116241B
   same   /api/platform/mygov/inspections  v1=200/651247B  gcp=200/651247B
   same   /api/platform/mygov/code-violations  v1=200/1260954B  gcp=200/1260954B
   same   /api/platform/mygov/business-licenses  v1=200/34714B  gcp=200/34714B
   same   /api/platform/powerbi/cip-projects  v1=200/13893B  gcp=200/13893B
   same   /api/platform/samsara/vehicles  v1=200/29342B  gcp=200/29342B
   same   /api/platform/spireon/vehicles  v1=200/15445B  gcp=200/15445B
PASS: every platform route the dashboards already read returns an identical payload on both hosts

## instrument can fail
   bogus tenant key: 401   unknown city: 404   bogus platform bearer: 401
PASS: a bogus tenant key is refused (so the keyed 200s mean the key worked)
PASS: an unknown city does not resolve
PASS: a bogus platform bearer is refused (so the payload parity is not just 'any request')

ACCEPTED. Every clause reads clean on the deployed surface.
```
