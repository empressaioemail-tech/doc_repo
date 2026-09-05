---
id: OPS-19b_ctx_pipeline_wrapup_sprint
title: CTX data pipeline wrap-up sprint — durable wave/lane roadmap
status: active
last_updated: 2026-09-04
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-19_factory_plan_of_record
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-09-04_ctx_pipeline_wrapup_scope_audit
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _decisions/2026-09-01_parcel_record_is_the_gate_to_everything
  - _decisions/2026-09-02_step7_consumer_c_then_b
purpose: Companion sprint plan to OPS-19, F-01. Sequels the 2026-09-04 adversarially-
  reviewed scope audit into an execution-ready wave/lane roadmap with lane-planner
  dispatches. Supersedes the individual item list in the scope audit as the plan of
  record for this sprint; the audit stays as the evidentiary record of how each item
  was found and verified.
---

# CTX Data Pipeline Wrap-Up Sprint

## What this sprint is, and is not

This closes the ACQUIRE-GIS wave 1 / PARCEL wave 2 / serve-cutover effort under
`F-01`. It is scoped by an adversarially-reviewed audit (`_inbox/2026-09-04_ctx_pipeline_wrapup_scope_audit.md`
— 19 agents, 4 full-repo branch/PR sweeps, 7 thematic deep-dives, adversarial batch
review), then refined in conversation with the operator into the lanes below.

**Explicitly not this sprint:** atomizing the rest of CTX (the atom-backfill card
named in ADR-031 is real and tracked but deliberately held — atomization is the
*next* order of business after this data work ships, operator ruling 2026-09-04),
and a dedicated onboarding-runbook rewrite (not tasked separately — the lanes
re-proving the B-SLATE pattern carry that precedent forward in their own dispatch
language rather than as a standalone deliverable).

**Governing order** (`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`,
operator: *"this is the most imperative thing in the whole build"*): build tables →
ingest existing data → finish in-flight audits → acquisition → adversarial review of
the program → **fix review findings (this sprint)** → only then, production/Wave R.
Wave 2 below is explicitly step 7 and stays blocked on this sprint substantially
closing, reinforced by the operator 2026-09-04.

## Wave 1 — no dependency on any other item in this sprint

| # | Item | Repo | Ready? |
|---|---|---|---|
| 1 | ~~legacy-design-tools PR #601 orphaned merge record — dangling branches + base≠main CI guard~~ — **DONE.** Dangling branch deleted, `PR base is main` required CI check merged via PR #609. | legacy-design-tools | Closed |
| 2 | ~~valueHistory rail: serve-side cutover (adapter + allowlist), B-SLATE1 template~~ — **DONE 2026-09-04.** PR #611 merged (`0269f335`), confirmed on `main`. | legacy-design-tools | Closed |
| 3 | ~~exemptionCodes/landUseSource/acreageMethod stampText type-gap~~ — **DONE 2026-09-04.** Widened `stampText`/`isCadNullText` per the ruling; PR #381 merged (`43a5c09`, no deploy step in this library-only repo, merge was terminal); live-probed against 500 real Caldwell County parcels, 0 unaccounted across all three fields post-fix. Independently re-verified by the integration seat. | hauska-engine (`ingest-existing.ts`) | Closed |
| 4 | B3-GEOMGAP statewide undivided-interest sweep (5 non-Bastrop counties) | hauska-factory | Yes |
| 5 | Queue-claim mechanism: no server-side check tying a Cloud Run execution's identity to a live claim — **ruled: Postgres-native locking (claims table + transactional claim-and-verify), not a new lock service** (operator 2026-09-04, agreeing with the planner's lean) | doc_repo (`scripts/queue/`) + hauska-factory (consumer) | Yes — confirm exact file location first, see lane brief |
| 6 | ~~parcel_record store has no reporting-safe read path~~ — **DONE 2026-09-04.** Ruled: Neon read replica, not a narrow materialized view (operator, agreeing with the planner's lean: the gap has been hit by 6+ different cards in different query shapes, a general fix beats another point-fix). The earlier `password authentication failed` was a red herring from testing the wrong endpoint (the primary's own connection string, re-copied, not the replica's) — the operator located the real Read Replica compute (`ep-crimson-lake-aummgosl`, distinct from the primary `ep-round-base-au0jofwp`) directly in the Neon console. Live-verified by the integration seat: authenticates, rejects writes (`ERROR: cannot execute CREATE TABLE in a read-only transaction`), same row count as the primary (63,791,325). Minted as GCP secret `FACTORY_DATABASE_URL_REPLICA` in `hauska-prod-497015`, documented in `90_runbooks/seat_loop.md`, self-provision round-trip confirmed. Does not relieve write contention, only read contention. | infra (Neon) | Closed |
| 7 | ~~SIGTERM guard redeploy sweep~~ — **DONE 2026-09-04.** All 12 named job resources on the fixed image (`sha256:0754e8bd...`, spot-checked 3/12 by the integration seat via `gcloud run jobs describe --format=json`, exact match). Non-`factory-snapshot` distinct env/secrets/resource-limit profiles confirmed untouched. | hauska-factory (GCP deploy only) | Closed |
| 8 | Card H residue live recount (232,770 unstamped / Travis 119,389 no-row / Hays / Williamson — last measured 2026-08-30, instrument repaired 2026-08-31, never re-run `--live` since) | doc_repo script against factory store | Yes — integration seat runs this directly, no lane dispatch needed |
| 9 | overlayDistricts/maxImperviousCoverPct writers never emit a `not-applicable` cell state — gate can structurally never read "pass" for either rail | hauska-factory | Yes |
| 10 | owner rail: dedicated reconciliation (parcel_record CAD pipeline vs atom `owner-fact-writer.ts`, two independently-derived sources), S6-COLLISION-style card | hauska-factory + hauska-engine | Yes |
| 11 | ~~`factory-publish-gate-sched` has no Cloud Scheduler trigger~~ — **DONE 2026-09-04.** `factory-publish-gate-sched-hourly` created and `ENABLED`, `0 * * * *`. Integration seat independently decoded the live request body: `publish-gate-sched --county=48021 --county=48055 --county=48209 --county=48309 --county=48453 --county=48491 --apply` — all 6 counties, exact match to claim. | hauska-factory / GCP infra | Closed |
| 12-13 | ~~LDT PR #445, #446~~ — **DONE.** Both merged to main independently of #440/#554 (no real conflict once actually diffed — the original "after 14-15 land" sequencing was superseded). | legacy-design-tools | Closed |
| 14 | ~~LDT PR #440 (zoning-denominator/R-09 cluster)~~ — **DONE 2026-09-04.** Merged (`bb7547f2`). Composed Ruling 4's displayState split with R-09's `isPartial` preservation after empirically proving the naive version regressed R-09's own tests; fixed a real registry-completeness gap found along the way (`_inbox/2026-09-04_ldt-ctx-wrapup_close.json`). | legacy-design-tools | Closed |
| 15 | LDT PR #554 (landUse projection) — **NOT landing this sprint.** Genuinely diverges from main's `7f522893`, not a duplicate: source-precedence is settled (`land-use-fact.landUseCode`/`cad_property.property_use_code` per the 2026-08-30 W0b ruling in `_inbox/2026-08-30_ctx_w0b_landuse_source.json`; `claim.propertyUseCode`, which #554 correctly avoids and 7f522893 uses, is that ruling's own named-rejected alternative), but the two use structurally incompatible "earned absence" contracts (main: sibling `provenance.landUseAbsence` field + `assertLandUseAbsenceEarned` guard; #554: absence embedded in the `baseFacts.landUse` value slot) — main's guard would misclassify #554's shape as a bad payload rather than a verified absence. Both are inert until Wave R runs, so nothing is lost by not forcing this. Named as a Wave R (item 19) prerequisite below. | legacy-design-tools | Wave R prerequisite, not this sprint |
| 16 | ~~hauska-map: `utilityServiceFact` never reads the `electric` slot the backend now serves (LDT PR #608, merged 2026-09-04)~~ — **DONE 2026-09-04.** Fixed, deployed, live-verified against production (`_inbox/2026-09-04_hauska-map_property-seat_utilityservice-electric-slot_close.json`; PR #351, `b559566c`, `dpl_6r3iFrDyULQHBCMPrdzUowE9MAqt`). Independently re-verified by the integration seat via a direct live probe on `smartsite.cloud`. | hauska-map | Closed |
| 17 | ~~hauska-engine `feat/permits-field`~~ — **RESOLVED by operator ruling 2026-09-04: stay with what's live (the companion-shape rail on main); the branch stays parked, revisit only if genuinely needed later.** No dispatch. | hauska-engine | Closed |
| 20 | **landUse parcel_record cutover — new, operator-prioritized 2026-09-04**: "a lot of the function of the platform rides on this data field." Fixes the 2026-08-30 present-presented-as-absent defect (`_inbox/2026-08-30_ctx_remainder_deep_review.md` §3.1/§3.2 — the conformant bake reports landUse absent when three independent sources confirm it exists, and the walk's own self-test asserts an all-null payload *passes*) as a consequence of migrating the rail, not a patch to code being retired anyway. First step: measure whether parcel_record's landUse rail is already filled (it may be, given the broad Phase 1/2 fill program) or needs acquisition first — do not assume either way. | hauska-factory (fill/verify half) + legacy-design-tools (serve-cutover half) | Yes — Factory half first, LDT half follows |

### Wave 1 lane conflicts (sequence, don't blind-parallelize)

- **legacy-design-tools rail-scoring family (12-14):** superseded by actual events — #445/#446 (12-13) had no real conflict and landed first; #440 (14) landed after composing Ruling 4 with R-09; #554 (15) did not land this sprint (see item 15/19).
- **Item 1's CI guard vs items 2, 12-14:** resolved — item 1's `PR base is main` check (PR #609) landed and was made required before the others merged, after a same-night sequencing bug (required before merged) briefly blocked every open PR in the repo; see the session record for the incident.
- **hauska-factory writer family (4, 9, 10, 20-factory-half):** different files, no direct edit conflict, genuinely parallelizable within the repo.
- **Read/write contention on the single Neon `parcel_record` primary, until item 6 lands:** items 4, 8, 9-verify, 10, 11, and 20-factory-half's measurement step will contend if run concurrently and may time out (throughput, not correctness) — stagger the heavy-read items.
- **Item 20's two halves are sequenced, not parallel:** LDT's serve-cutover half cannot meaningfully start until the Factory half confirms the rail is filled and gate-verified.

## Wave 2 — blocked

| # | Item | Depends on |
|---|---|---|
| 19 | Wave R execution (the *old* conformant-bake pipeline's remaining work — landUse projection, situs recovery, tax-year selection, ADR-029 rail-absence row, fail-closed upsert for ~58,461 inherited centroids) | Wave 1 substantially closing (operator's own governing order, reinforced 2026-09-04); its own unconfirmed prerequisite chain (W0b review, determinism gate, S1-S12 checks, six staging bakes); the unrouted 2026-08-30 adversarial review (`_inbox/2026-08-30_ctx_remainder_deep_review.md`) whose blocking findings are addressed indirectly by item 20 above rather than by patching the old pipeline directly; and, added 2026-09-04, a real architecture decision on which "earned absence" contract wins for landUse — sibling `provenance.landUseAbsence` field + `assertLandUseAbsenceEarned` guard (main's `7f522893`) vs. absence embedded in the `baseFacts.landUse` value slot (LDT PR #554) — plus a check for existing consumers of the guard/sibling-field shape before wiring up either. See item 15 above. |

No action this sprint. Revisit once Wave 1 closes.

## Lane-planner assignment

Four lane-planner dispatches, each spawning sub-agents for its own cluster and reporting back to the integration seat directly — not one dispatch per item.

| Lane | Repo | Covers | Worktree |
|---|---|---|---|
| LDT | legacy-design-tools | 1, 2, 12, 13, 14, 15, 20 (serve half) | `P:/tmp/ctx-wrapup-ldt` |
| Factory | hauska-factory | 4, 5 (consumer half), 6, 7, 9, 10, 11, 20 (fill half) | `P:/tmp/ctx-wrapup-factory` |
| Engine | hauska-engine | 3, 10 (owner-fact-writer half) | `P:/tmp/ctx-wrapup-engine` |
| Map | hauska-map | 16 | `P:/tmp/ctx-wrapup-map` |

Item 8 (Card H recount) runs directly from the integration seat, no lane dispatch.
Item 5's doc_repo-touching half (if the queue scripts turn out to live in doc_repo
proper, not vendored into hauska-factory) routes back to the integration seat rather
than a lane committing to doc_repo directly.

## Revision history

- 2026-09-04, initial. Scoped by a 19-agent adversarial audit, refined in conversation
  (three fix-shape rulings, item 17 resolved, item 20 added, atom-backfill and runbook
  held out of this sprint), organized into four lane-planner dispatches.
- 2026-09-04, item 16 closed. Map lane shipped, deployed, and live-verified the
  `utilityServiceFact` electric-slot fix (PR #351, `b559566c`); integration seat
  independently re-confirmed against the live production endpoint before marking done.
- 2026-09-04, item 3 closed. Engine lane merged PR #381 (`43a5c09`) and live-probed
  500 real Caldwell parcels post-fix (0 unaccounted across all three fields);
  integration seat independently re-confirmed the merge and the no-deploy-step claim.
- 2026-09-04, items 1, 2, 12-13, 14 closed; item 15 (#554) ruled NOT landing this
  sprint, moved to a named Wave R (item 19) prerequisite. LDT lane merged PR #609
  (item 1), #611 (item 2, `0269f335`), #445/#446 (12-13), and #440 (14, `bb7547f2`)
  after composing Ruling 4's displayState split with R-09's `isPartial`
  preservation and fixing a real registry-completeness gap found along the way.
  #554 was found to use an "earned absence" contract genuinely incompatible with
  main's `7f522893` guard, not just a differing design — left unmerged rather than
  forced. Separately: two sessions were found working the same shared LDT worktree
  concurrently for several hours (a real workspace-hygiene incident, not just a
  messaging glitch); resolved by stopping the duplicate, aborting its unpushed,
  unresolved merge, and confirming the survivor's state against live GitHub before
  continuing. Full detail in `_inbox/2026-09-04_ldt-ctx-wrapup_close.json` and its
  addendum.
- 2026-09-04, items 7 and 11 closed. Factory lane redeployed all 12 SIGTERM-guard job
  resources and wired the hourly Cloud Scheduler trigger; integration seat
  independently verified both via live `gcloud` JSON output. Item 6 (read replica)
  moved to blocked: endpoint exists but fails auth, Neon-side, escalated to the
  operator. Separately, a contained credential-exposure incident on
  `PRODUCTION_NEONDB_URL` was disclosed by the Factory lane during this work —
  see `_decisions/2026-09-04_production_neondb_credential_exposure.md`.
- 2026-09-04, item 6 closed. The operator found the real Neon Read Replica compute
  directly in the console (the earlier auth failure was from testing the primary's
  own connection string by mistake, not the replica's). Live-verified by the
  integration seat (rejects writes, same row count as primary) and minted as GCP
  secret `FACTORY_DATABASE_URL_REPLICA`, documented in `90_runbooks/seat_loop.md`.
