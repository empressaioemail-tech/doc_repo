# P-85 Records Request

## GROUND-TRUTH (2026-08-27T12:50Z)

- **P-85 items 6–7 DEPLOYED prod:**
  - Migration **0086** applied (GHA run `33068906374`, 2026-08-27T11:47Z)
  - **cortex-api** `00591-mih` @100% canary tag, image `ced0f7c1` (#483 merged); deploy runs `33068750917` canary + `33068971783` shift; healthz 200
  - **records-request-worker** rev `00003-zhm`, image **p85-v3**; env `RECORDS_REQUEST_VISION_URL` → cortex internal vision-read route; `SERVICE_API_KEY` secret mounted
  - LDT **#485** open (worker Bearer auth on vision callback — image p85-v3 built from branch commit `5a306262` before merge)

## GROUND-TRUTH (2026-08-27T12:35Z)

- **LDT #483 MERGED** to main (squash) — items 6–7 scaffold:
  - Migration `0086_p85_records_request_artifacts.sql` + Drizzle schema
  - Post-search capture-first acquisition; purchase wall → `awaiting-purchase-approval` when projected cost > $50
  - Vision read: `recordsRequestArtifactVision.ts`, internal route `POST .../records-request/vision-read`, worker `triggerVisionReads()` on acquired captures
  - CI green (Test ~10m42s) after schema fixture blank-line + table-order fixes
- **LDT #482** + **hauska-map #228** merged earlier this session.
- **Not deployed** — planner queue: migration 0086, cortex-api, worker `p85-v3`, env `RECORDS_REQUEST_VISION_URL` on worker → cortex internal vision route.

## GROUND-TRUTH (2026-08-27T12:05Z)

- **LDT #482 MERGED** to main @ `c68d9357` (all CI green including 10m40s Test job).
- **hauska-map #228 MERGED** earlier this session.
- Branch `feat/p85-pe-records-bridge` reset to main + **item 6 scaffold** pushed:
  - Migration `0086_p85_records_request_artifacts.sql`
  - Post-search acquisition: capture-first, purchase threshold → `awaiting-purchase-approval`
  - **Not deployed** — planner must run migration 0086 + worker `p85-v3` + cortex searchTerms path.

## GROUND-TRUTH (2026-08-27T11:50Z)

- **hauska-map #228 MERGED** — devRole studio grant + honest Records Request status (rebased on main, CI green).
- **LDT #482 updated** (not merged): lockfile fix + Williamson default `williamson-publicsearch` + Tyler/publicsearch index-search recipes (item 5 partial).
- Worker now supports `needs-human` terminal status; cortex enqueues `searchTerms` from TxGIO at job create.
- **Next:** merge #482 when CI green → planner deploy worker image → operator-run reachability on Travis/Hays/Caldwell → Tyler login proof on prod.

## GROUND-TRUTH (2026-08-27T01:50Z)

- **dev_role granted prod** for `empressaioemail@gmail.com` and `dev@smartcityos.io` (was false — solo/paid tier blocked terrain + Studio rows).
- PE deploy **smartsite.cloud** `dpl_68wKekUURW8GL8oKY3GbChRkpYMC` — devRole clears all generatable report gates; REC live status copy.
- PRs: LDT **#482**, hauska-map **#228**.

## GROUND-TRUTH (2026-08-27T01:40Z)

- **records-request-worker** Cloud Run live: `https://records-request-worker-1062716564162.us-central1.run.app` revision `records-request-worker-00002-nzx`, image `p85-v2` (Playwright pinned 1.59.1).
- **cortex-api** env `RECORDS_REQUEST_WORKER_URL=.../run` set (revision update 2026-08-27); also baked in `cloud-run-deploy.yml` (uncommitted on `feat/p85-pe-records-bridge`).
- Recipe registry: all **5 CAPCOG + McLennan** portals registered (`p85Portals.ts` + reachability scaffold). Default county→portal map live in worker image.
- Drain: 3 queued jobs reset + rerun — **2× Bastrop (48021) complete** (bastrop-aumentum scaffold); **1× Williamson (48491) failed** `portal-unreachable` HTTP 403 on TylerHost disclaimer (bot block; try `williamson-publicsearch` next).
- New enqueues from cortex now fire-and-forget to worker (no longer no-op).

## GROUND-TRUTH (2026-08-27T00:52Z)

- Migration **0084_p85_records_request.sql** applied prod (run `33027876179`, 2026-08-27T00:46:05Z).
- Cortex **cortex-api-00586-dip** @100% tag canary, image `5ac814f8` (deploy-canary `33027953411` + shift `33028106417`). healthz 200.
- Portal rulings: 7 rows `automated_search=permitted` applied prod via `apply-operator-portal-rulings.mjs`.
- PE smartsite.cloud **dpl_EDSnVJNcBgobJ3uJdawGMTjougu5** aliased prod, bundle `index-EqJEab1m.js` (includes Records Request UI).
- Live probe: `GET /api/property-explorer/v1/records-request` → 401 `authentication_required` (expected without session).

## GROUND-TRUTH (2026-08-27T00:10Z)

- [Tyler worker scaffold](e02fd521-9202-4208-86eb-2602fba23a0f) committed on LDT #480 @ `6b13a79a` (worker) + CI fixes @ `064ee4fb`.
- hauska-map #225 MERGED @ `65a69174` — REC row UI + spine-deep wire to `/property-explorer/v1/records-request`.
- LDT #480 OPEN on `feat/p85-pe-records-bridge`: PE bridge + worker + catalog/typecheck fixes; Test job in flight.
- Worker: `artifacts/records-request-worker/`; `RECORDS_REQUEST_WORKER_URL` no-op when unset.
- Williamson TylerHost stub recipe only; other P-85 counties fail `portal-unresolved`.

## GROUND-TRUTH (2026-08-26T21:50Z)

- Scope amended: Records Request (all recorded docs), live GIS (no ingestion), browser agent + portal recipes.
- LDT branch `feat/p85-records-request` from `seat/property` @ 9f85f487 (NOT pricing worktree).
- Dropped: parcel_easement_gis_hits, easement_research_jobs, Factory easement landing.
- Salvaged: clerk portal terms + gate; added liveEasementGisQuery.ts + records_request_jobs.
- Substrate request: `_inbox/2026-08-26_substrate_request_p85_adr020_instrument_type_extension.md`
- CP1 amended with interruption recovery: `_inbox/2026-08-26_p85-easements_cp1.json`
- Pricing ladder dirty work stashed: `stash@{0}` on former feat/p85-easements branch name

## OPEN

- Merge LDT **#485** (worker vision Bearer auth — p85-v3 image already deployed with fix from local build)
- Operator prod proof on **48021:34161** (search terms, captures sha256, artifact rows, vision metadata)
- Operator-run reachability proofs: Travis, Hays, Caldwell (recipes registered)
- Tyler login + live search proof on Williamson (publicsearch) + Hays after worker deploy
- WDLL items **8–10** classify / geometry / verdicts — not started
- Email provider (item 11)
- Stripe Studio price ids (item 13)

## CANON

- Status canvas: `_inbox/2026-08-27_p85_records_request_status_canvas.md`
- Handoff: `_inbox/2026-08-27_p85_records_request_handoff.md`

## DEAD-END

- Factory GIS landing on P-85 card — superseded by live query amendment
