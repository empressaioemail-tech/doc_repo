---
id: 2026-08-29_ctx_h_land_process
title: CTX card H land process (wave 2)
date: 2026-08-29
last_updated: 2026-08-30
status: closed
plan_row: F-05, F-06, F-08
depends_on: _inbox/2026-08-29_ctx_quality_WDLL.md, _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md, OPS-19 A-021
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
---

# CTX card H land process

This is the procedure for the one publish wave after LDT #548 (`889b1556`) and factory pin #36 (`7f41f523`). The canvas Land view is the live board. This file is the durable copy so the process does not live only in chat.

Image of record: `factory-bastrop-publish` generation 18, digest `us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/hauska-factory@sha256:7bef3ce7211f35635afbac0fb987dbf79de3ec2959d1fb1a999581f5505d26d4`. `_LDT_SHA` 889b1556. Do not execute on any other digest.

Wave closed 2026-08-30T09:39Z. Six of six production walked. The Land view residue table is the leftover data list. Do not start a second bake of the six.

## What landed means

A user on smartsite.cloud who opens 275 Cibolo Creek Dr, Kyle and 1804 Davis St, Taylor sees land-use from an owner-gated situs join (`source: cad-roll-address-join`, `parcelJoin.state: joined-situs`) or an honest `gate-blocked`. 6102 Laird Dr still shows `stamp-missing` for Austin. 4707 Shoalwood still shows `unmeasured` / `no-row`. Hays and Williamson still refuse a `prop_id` join. Each of the six has one walked production publish on this image. Nothing else in Texas starts.

Old-bake recovery on those two FIPS was about 86 to 89 percent owner-agree. A large residue of empty stamps on Hays and Williamson is success.

## Sequence (do not skip)

1. Concurrent staging is allowed. The six staging executions already running are the only staging writes for this wave. Do not start a second staging bake for a county that is still running.
2. Score each staging finish from the execution close line and a live staging gold probe. Do not wait on a Factory SQL. Under bake load the store times out.
3. Required close-line fields: `publishRunId`, `walkVerdict`, `tier1Summary.written`, `tier1Summary.conformantCadRows`. Production needs `walkVerdict pass`.
4. Promote one county at a time, as it passes. Order: Bastrop, Caldwell, McLennan, then Travis, then Hays, then Williamson. Hays and Williamson last so a seed leak is cheapest to stop.
5. Production form (PowerShell, single quoted comma form only):

```
gcloud run jobs execute factory-bastrop-publish --project=hauska-prod-497015 --region=us-east4 --args='bastrop-publish,--target=production,--county=<fips>,--gold=<fips>:<prop_id>,--skip-pmtiles' --update-env-vars=OPERATOR_PUBLISH_GO=1 --update-env-vars=PRODUCTION_SITE_URL=https://smartsite.cloud

PowerShell turns a comma inside one --update-env-vars into a single value. p7rz9 set OPERATOR_PUBLISH_GO to `1 PRODUCTION_SITE_URL=https://smartsite.cloud` and exited TARGET_ENV_MISSING in 15s. Two flags. Read both names on the execution before walking away.
```

6. After the production close line says pass, probe the gold and one neighbour on `https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/node/<fips>%3A<prop_id>/facets`. Then the next county.
7. Customer-done for `stamp-missing` / `unmeasured` words is a PE probe after the hauska-map #310 Vercel deploy. Do not grade those labels from a merged PR.

## County board (start of wave)

| County | FIPS | Gold | Staging execution | Staging | Production |
|---|---|---|---|---|---|
| Bastrop | 48021 | 48021:34137 | 9zhz6 | pass 14160883 written 61695 / 77799 | vzfnd pass e2c5c6d7 written 61695 / 77799; gold BASTROP SF-1 joined |
| Caldwell | 48055 | 48055:20478 | plnvw | pass bd957716 written 73159 / 48649 | jptqt pass cd961998 written 73159 / 48649; gold LOCKHART RMD joined |
| McLennan | 48309 | 48309:176914 | hrv8w | pass 8984ce9a written 113090 / 114255 | kkdm4 pass 70a92b2a written 113090 / 114255; gold WACO stamp-missing joined |
| Travis | 48453 | 48453:493738 | 9kspw | pass f16d018f written 873766 / 500307; Shoalwood unmeasured / no-row | hhxg2 pass bb77fa65 written 873766 / 500307; Shoalwood unmeasured / no-row |
| Hays | 48209 | 48209:135570 | zp2kw | pass 198b728c; gold joined-situs KYLE R-1 | x2rw7 pass 003cdc7c written 304332 / 173050; Kyle joined-situs R-1 cad-roll-address-join |
| Williamson | 48491 | 48491:76149 | 8d5td | pass a2a40de5 written 602050 / 602050; Taylor gold gate-blocked (situs refused) | 8ghwj pass 4a4efa03 written 602050 / 602050; Taylor gold gate-blocked |

## Honest signals (do not "fix")

| Signal | Treat as | Do not |
|---|---|---|
| Kyle / Taylor gold `joined-situs` | Pass | Lift the seed |
| Kyle / Taylor gold `gate-blocked` | Pass if basis names situs and owner refuse | Force a `prop_id` join |
| Either gold `parcelJoin.state: joined` | Stop the wave. Seed leaked | Continue |
| Williamson / Hays still mostly unstamped | Expected residue | Restart the bake or open P-80 |
| Travis 493738 `unmeasured` / `no-row` | Pass | Invent a `geo_id` join |
| Laird still `stamp-missing` | Pass | Treat as a miss |
| `written` != `conformantCadRows` | Two tax years, last body wins | Re-bake to match counts |
| First gold HTTP 504 | Cold revision. Probe twice | Fail the county |
| `SWEEP_TOO_SMALL` | Walk rule, not bake | Execute production |
| Staging walk fails BP-VALUE-01 on unincorporated / no query point | Staging cortex-api stale | Paper it over with production |
| Local gcloud client dies | Not a job abort | Submit a second bake |
| Failed staging walk | Name it. Do not publish | Promote |
| TARGET_ENV_MISSING in ~15s | PowerShell comma collapsed the two env vars. Staging sibling still valid. Re-run that county only with two --update-env-vars flags. | Re-bake staging. Start the other five. |

## Stop the wave

Stop if a Hays or Williamson gold comes back `parcelJoin.state: joined`. Stop if production runs without `OPERATOR_PUBLISH_GO` and `PRODUCTION_SITE_URL`. Stop if the job image is not `sha256:7bef3ce7211f35635afbac0fb987dbf79de3ec2959d1fb1a999581f5505d26d4`. Re-run only the county that died. Do not bake the six twice.

## Out of this wave

F-09, F-10 254, F-11, P-85, PE setbacks, F-08 R1 envelope routing, P-80 Travis geo_id, seed lift, scllr restart.
