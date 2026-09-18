---
id: 2026-09-18_dolphin_ship_preflight
title: dolphin-app ship preflight (OPS-17 A-149) - the exact spec change, and the key parity it needed
status: evidence
owner: integration (SmartCity planning seat)
last_updated: 2026-09-18
related: [_inbox/2026-09-15_roadmap_reconciliation, _inbox/2026-09-18_planner_four_row_regrade, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_operations/OPS-25_cloud_infrastructure_and_cost_program]
---

# The ship, measured instead of remembered

Snapshot: `doc_repo` `main` at `28d30947` (the instrument landed in the commit that carries this file).
Instrument: `node --use-system-ca scripts/govtech/dolphin-ship-preflight.mjs`, read-only against the
DigitalOcean API, the two repos' remote heads, and the live surfaces. It never prints a secret value.

OPS-17 A-149 records the operator's ruling that `main` ships to `dolphin-app`, carried in one deploy
with the configured platform base. A-148 and the `d14-d13-v1-reach` dispatch both left the ship
gated on that amendment existing; it exists. What did NOT exist until this read is a measurement of
what the deploy actually has to change.

## What the ship is, in three parts

1. **One environment variable.** A set difference between the two dashboards apps, not a
   recollection: `d12-main-uat` carries `SMARTCITY_V1_PLATFORM_BASE` and `dolphin-app` does not, and
   no other key differs in either direction. The value is
   `https://walrus-app-kzog6.ondigitalocean.app`, declared `GENERAL` with `scope:
   RUN_AND_BUILD_TIME`, exactly as UAT carries it. At `7487d7c0` an unset base is a refusal with a
   named basis, so the variable and the code have to land in the same deploy.
2. **One deploy of `main`.** No repoint is needed and none should be made: `dolphin-app` already
   builds from branch `main`; what it is behind on is the deploy, not the branch. Production serves
   `3d3ec62a` from deployment `ded9afcb`, created 2026-09-18T00:27:49Z with
   `cause: "domain app.smartcityos.io ready"`, and dashboards `origin/main` is `7487d7c0`.
3. **Nothing else.** `deploy_on_push` is unset on all three apps, which is the posture D-12's scope
   item 4 chose deliberately (a merge deploys nothing and shipping stays an act). The domain
   `app.smartcityos.io` is already attached as PRIMARY and resolves by CNAME to
   `dolphin-app-y4ixf.ondigitalocean.app`, so no DNS change is in scope and this program's rule 12
   is not engaged. Nothing else in the spec differs from the UAT twin.

## The thing that would have broken it, and how it was cleared

The dashboards present `PLATFORM_INTERNAL_API_KEY` to the v1 platform, and after this ship they
present it to `walrus-app` instead of the GCP copy. DigitalOcean returns secret env values encrypted
as `EV[1:...]`, and the same plaintext encrypts differently per app, so the three ciphertexts on
these three apps prove nothing in either direction. That was the open risk: a mismatch 401s every v1
feed on production the moment the deploy finishes.

The gate is an exact string compare with a 503 when unset (`smartcity-os`
`server/routes/mygov.ts:363`, read at `main`), so parity is provable by presentation:

| Host | canonical key | one-character mutation | keyless |
|---|---|---|---|
| `walrus-app` (`smartcityos.io`) | **200**, real payload | 401 `platform_internal_required` | 401 |
| GCP `smartcity-api` | **200**, real payload | 401 `platform_internal_required` | n/a |

Both hosts accept the same canonical secret (`smartcity-os-prod` `platform-internal-api-key`) and
both reject a mutation of it, so a 200 here is not merely "some request was answered". The GCP copy
is the host production reads today, so the value `dolphin-app` stores is the value `walrus-app`
accepts. **No secret needs to be re-supplied, and none should be:** the app spec's ten existing
secrets round-trip as their `EV[1:...]` strings on an update, per DigitalOcean's own app-spec
reference, so the plaintext never leaves Secret Manager.

## The post-deploy read-back, which is the acceptance

- `services[0].source_commit_hash` on `dolphin-app` equals `7487d7c0a55deeefc286c4a1047545757b802c5b`.
  A DigitalOcean deploy once reported `build=SUCCESS deploy=SUCCESS` while running a commit from
  before the change (D-12 finding 1), so this is read back and compared byte for byte, and the
  deploy is created with `force_build` so the image is built rather than reused.
- The `web/` blob comparison and the host discrimination from outside, both repeated from D-12.
- Each of the five platform feeds returns records through `walrus-app` for `bastrop_tx`, compared as
  payload rather than framing.
- The Dev services work-order Subject cell no longer renders the vendor's free-text title, which is
  where residents write names and phone numbers. That is the one respect in which production is
  currently WORSE than `main`, and it is why this ship is worth doing before staff are told to move.

## What this does not establish

- No lane close, CP1 or CP2 exists for `d14-d13-v1-reach` in this worktree, and neither it nor
  `g161-never-default-a-city` holds a lane claim. A-149 assigns the ship to that lane as its last
  step and names the fallback: if the lane has finished, the ship is planner-owned with the identical
  precondition and read-back. Which of those two applies turns on whether that agent is still
  running, which is not readable from here.
- The preflight proves the config and the credential. It does not prove the dashboards build from
  `main` on DigitalOcean, which is the deploy's own risk and is why `force_build` and the read-back
  are in the sequence.
- `health=NONE` on all three apps is recorded because the instrument surfaces it, not because this
  ship changes it. No health check is being added and none is being removed.

## The verbatim run

```
# dolphin ship preflight | read 2026-09-18T17:22:37.717Z
# doc_repo 28d30947

## smartcity-dashboards origin/main = 7487d7c0a55deeefc286c4a1047545757b802c5b

## smartcity-os origin/main = 1f0262f15f8d1898a6c32826ec2e45407518e29e

## prod (dolphin-app)
   deploy_on_push=null  (null/undefined = DISABLED, so a merge deploys nothing)
   domains=app.smartcityos.io:PRIMARY
   active_deployment=ded9afcb-b23a-467d-ac81-e581aedf15be cause="domain app.smartcityos.io ready" created=2026-09-18T00:27:49Z
   services smartcity-dashboards: empressaioemail-tech/smartcity-dashboards@main count=2 health=NONE running=3d3ec62a

## uat (d12-main-uat)
   deploy_on_push=null  (null/undefined = DISABLED, so a merge deploys nothing)
   domains=-
   active_deployment=605515ef-69e7-41a7-bac3-33a79ee45387 cause="manual" created=2026-09-18T16:03:09Z
   services smartcity-dashboards: empressaioemail-tech/smartcity-dashboards@main count=1 health=NONE running=7487d7c0

## v1 (walrus-app)
   deploy_on_push=null  (null/undefined = DISABLED, so a merge deploys nothing)
   domains=smartcityos.io:PRIMARY, www.smartcityos.io:ALIAS
   active_deployment=e243db0a-b5ed-4f4c-bb8c-74261ab97b2d cause="manual" created=2026-09-18T15:37:27Z
   services smartcity-os: empressaioemail-tech/smartcity-os@main count=1 health=NONE running=1f0262f1

## env delta, d12-main-uat -> dolphin-app
   on UAT, MISSING on production: SMARTCITY_V1_PLATFORM_BASE
   on production, not on UAT:     (none)
selftest PASS: the ship's env delta is exactly SMARTCITY_V1_PLATFORM_BASE
   the value to mirror (GENERAL, no type field): https://walrus-app-kzog6.ondigitalocean.app
selftest PASS: the mirrored base is an https URL

## platform-internal-api-key parity (len=64; the value is never printed)
   walrus-app         /api/platform/mygov/permits  canonical=200  mutated=401  keyless=401
   gcp smartcity-api  /api/platform/mygov/permits  canonical=200  mutated=401
selftest PASS: the canonical key is accepted by BOTH walrus-app and the GCP host production reads today
selftest PASS: a one-character mutation is rejected by both, so a 200 is not just any request

## production serves 3d3ec62a and answers 200 at https://app.smartcityos.io/
selftest PASS: the production dashboards surface answers a request
selftest PASS: production is NOT already on dashboards main (if it is, the ship has happened and this reading is stale)
selftest PASS: a nonexistent app id does not return 200, so a 200 means the app exists

PASS every preflight check agrees. The ship is one environment variable and one deploy.
```
