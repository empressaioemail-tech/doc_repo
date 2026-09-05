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
| 4 | B3-GEOMGAP statewide undivided-interest sweep (5 non-Bastrop counties) — **4 of 6 program counties done, 2 blocked on a data-shape question, not contention.** Hays (28,614) and Travis (67,912) are real, live-measured gaps. Williamson and McLennan both return a VACUOUS 0 — not a confirmed zero gap: Williamson's R-prefix accounts are uniformly `land_value IS NULL`, McLennan's are uniformly `land_acres IS NULL`, so the sweep's `land_acres>0 AND land_value>0` predicate can never fire for either county under the current CAD-ingest shape. Needs an Engine-lane/CAD-ingest decision on where those fields actually live for these two counties before either has a trustworthy number — not resolved tonight, not a query fix. | hauska-factory | Partially done — 2 counties open |
| 5 | ~~Queue-claim mechanism: no server-side check tying a Cloud Run execution's identity to a live claim~~ — **DONE 2026-09-05.** Ruled: Postgres-native locking (claims table + transactional claim-and-verify), not a new lock service. Confirmed 100% hauska-factory's own (doc_repo's `scripts/queue/` is an unrelated, already-complete lane-dispatch mechanism). PR #90 merged (`a88fe3c2`), wired into `parcel-record-fill.mjs`'s per-county `--apply` loop, 9+4 new tests, full suite 958/0/2 clean. Migration 0011 initially reported applied but wasn't (stale `factory-publish-migrate` image, built 2 days before the PR merged) — rebuilt via `cloudbuild.publish.yaml`, re-ran, and live-verified the real `claims` table schema exists (entity_type/county_fips PK, execution identity, run_id FK, TTL). Only `parcel-record-fill.mjs` is wired; the other lease call sites (`conformant.mjs`, `f10-cad-loop.mjs`, `p2-juris.mjs`, `restamp-access.mjs`) are a named, deliberate follow-on, not silently decided. | doc_repo (`scripts/queue/`, confirmed unrelated) + hauska-factory (consumer) | Closed |
| 6 | ~~parcel_record store has no reporting-safe read path~~ — **DONE 2026-09-04.** Ruled: Neon read replica, not a narrow materialized view (operator, agreeing with the planner's lean: the gap has been hit by 6+ different cards in different query shapes, a general fix beats another point-fix). The earlier `password authentication failed` was a red herring from testing the wrong endpoint (the primary's own connection string, re-copied, not the replica's) — the operator located the real Read Replica compute (`ep-crimson-lake-aummgosl`, distinct from the primary `ep-round-base-au0jofwp`) directly in the Neon console. Live-verified by the integration seat: authenticates, rejects writes (`ERROR: cannot execute CREATE TABLE in a read-only transaction`), same row count as the primary (63,791,325). Minted as GCP secret `FACTORY_DATABASE_URL_REPLICA` in `hauska-prod-497015`. **Correction, same night:** the Factory lane found the secret's first version used a `-pooler` host, which `hauska-factory`'s own `refusePoolerHost()` hard-refuses — rotated to the direct host, verified against the actual codebase check. Also confirmed: this replica covers only the Factory store, not `PRODUCTION_NEONDB_URL`/cortex-prod (item 4's own contention is untouched by it), and its compute is small enough to hit real recovery-conflict cancellations under load — documented in `90_runbooks/seat_loop.md`. Does not relieve write contention, only read contention. | infra (Neon) | Closed |
| 7 | ~~SIGTERM guard redeploy sweep~~ — **DONE 2026-09-04.** All 12 named job resources on the fixed image (`sha256:0754e8bd...`, spot-checked 3/12 by the integration seat via `gcloud run jobs describe --format=json`, exact match). Non-`factory-snapshot` distinct env/secrets/resource-limit profiles confirmed untouched. | hauska-factory (GCP deploy only) | Closed |
| 8 | Card H residue live recount (232,770 unstamped / Travis 119,389 no-row / Hays / Williamson — last measured 2026-08-30, instrument repaired 2026-08-31, never re-run `--live` since) | doc_repo script against factory store | Yes — integration seat runs this directly, no lane dispatch needed |
| 9 | overlayDistricts/maxImperviousCoverPct writers never emit a `not-applicable` cell state — **overlayDistricts DONE 2026-09-05 (real, gate-verdict confirmed); maxImperviousCoverPct still has a real gap, previously mischaracterized as none.** PR #87 merged with zero live effect at first (caught by the Factory lane); integration seat found both jobs running stale images, rebuilt, ran the real `--apply` for all 6 counties (overlayDistricts) and Travis (maxImperviousCoverPct). Data-only fix then found to also lack gate-verdict coverage (`SLATE_1_RAIL_KEYS` excluded both) — permanent fix landed via PR #91 (`SLATE_1B_RAIL_KEYS`, hauska-factory, live-verified: `isEarnedCell`/`excludedDeclaredAhead` mechanism gets real test coverage for the first time), plus the deploy that carries it was itself found stale a third time and rebuilt. **Live `parcel_gate_verdict` rows, read directly:** overlayDistricts is `pass, 0 unaccounted` for all 6 counties — genuinely done, reaching real customers. maxImperviousCoverPct: the other 5 counties correctly read `excluded` (falsifier-proven, not a false refuse) — but **Travis itself reads `refuse, 244669 unaccounted`.** Earlier tonight's "845,157 unaccounted is just the other 5 counties, not a gap" was wrong — a large real chunk of that number is inside Travis, the one county this rail is supposed to cover, almost certainly the writer's own tracked-but-unresolved `unresolvedZones`/`anomalies` cases (1+ watershed hit unresolved crosswalk, 2+ hit spatial anomaly) that the code deliberately never converts to a terminal state. Needs real investigation, not a wave-off. | hauska-factory | overlayDistricts closed; maxImperviousCoverPct (Travis) open — real 244,669-cell gap |
| 10 | owner rail: dedicated reconciliation (parcel_record CAD pipeline vs atom `owner-fact-writer.ts`, two independently-derived sources), S6-COLLISION-style card — **merged (PR #88), live-run for Bastrop only, verification weaker than the headline number suggests.** 61,624 real accounts checked, 0 disagreements — but Factory's own owner cell is written FROM `cad_property`'s latest tax-year row, and this check re-reads the same table at the same year, so near-tautological agreement is the expected result absent a re-ingest. The one genuinely independent comparison — the atoms-side check via `SUBSTRATE_DATABASE_URL`, also the only path that can surface a real owner-withheld semantic mismatch — never ran (credential unavailable to the session). Not done until that half actually runs. | hauska-factory + hauska-engine | Not done — atoms-side check never exercised |
| 11 | ~~`factory-publish-gate-sched` has no Cloud Scheduler trigger~~ — **DONE 2026-09-04.** `factory-publish-gate-sched-hourly` created and `ENABLED`, `0 * * * *`. Integration seat independently decoded the live request body: `publish-gate-sched --county=48021 --county=48055 --county=48209 --county=48309 --county=48453 --county=48491 --apply` — all 6 counties, exact match to claim. | hauska-factory / GCP infra | Closed |
| 12-13 | ~~LDT PR #445, #446~~ — **DONE.** Both merged to main independently of #440/#554 (no real conflict once actually diffed — the original "after 14-15 land" sequencing was superseded). | legacy-design-tools | Closed |
| 14 | ~~LDT PR #440 (zoning-denominator/R-09 cluster)~~ — **DONE 2026-09-04.** Merged (`bb7547f2`). Composed Ruling 4's displayState split with R-09's `isPartial` preservation after empirically proving the naive version regressed R-09's own tests; fixed a real registry-completeness gap found along the way (`_inbox/2026-09-04_ldt-ctx-wrapup_close.json`). | legacy-design-tools | Closed |
| 15 | ~~LDT PR #554 (landUse projection)~~ — **RULED 2026-09-05, not landing as-is.** Earned-absence contract decided: keep main's sibling `provenance.landUseAbsence` field + `assertLandUseAbsenceEarned` guard (actually enforced, fail-closed) over #554's embedded `AbsentVerifiedLeaf` shape (its own legality check, `landUseBakeLegal`, has zero production call sites — test-only, confirmed by grep). Neither shape has a live consumer today, so this was a green-field choice, not an orphan risk. #554's real contribution — correct `land-use-fact`/`cad_property` source precedence over `claim.propertyUseCode` — gets re-ported onto main's absence shape. Full reasoning: `_decisions/2026-09-05_landuse_earned_absence_contract.md`. This clears the item-15 half of Wave R's prerequisite; item 20 (4 counties still open) is the other half. | legacy-design-tools | Ruled — re-port work not yet started |
| 16 | ~~hauska-map: `utilityServiceFact` never reads the `electric` slot the backend now serves (LDT PR #608, merged 2026-09-04)~~ — **DONE 2026-09-04.** Fixed, deployed, live-verified against production (`_inbox/2026-09-04_hauska-map_property-seat_utilityservice-electric-slot_close.json`; PR #351, `b559566c`, `dpl_6r3iFrDyULQHBCMPrdzUowE9MAqt`). Independently re-verified by the integration seat via a direct live probe on `smartsite.cloud`. | hauska-map | Closed |
| 17 | ~~hauska-engine `feat/permits-field`~~ — **RESOLVED by operator ruling 2026-09-04: stay with what's live (the companion-shape rail on main); the branch stays parked, revisit only if genuinely needed later.** No dispatch. | hauska-engine | Closed |
| 20 | **landUse parcel_record cutover — new, operator-prioritized 2026-09-04**: "a lot of the function of the platform rides on this data field." Fixes the 2026-08-30 present-presented-as-absent defect (`_inbox/2026-08-30_ctx_remainder_deep_review.md` §3.1/§3.2 — the conformant bake reports landUse absent when three independent sources confirm it exists, and the walk's own self-test asserts an all-null payload *passes*) as a consequence of migrating the rail, not a patch to code being retired anyway. First step: measure whether parcel_record's landUse rail is already filled (it may be, given the broad Phase 1/2 fill program) or needs acquisition first — do not assume either way. **Status: 2 of 6 counties confirmed (Bastrop, Caldwell, 0 unaccounted). Blocked on the other 4** — six independently-shaped live attempts (primary and both a pooler-broken and pooler-fixed replica) all hit real Postgres statement timeouts; `EXPLAIN` confirms the query is already optimally planned (four per-county bitmap index scans, ~869K rows). Integration seat resized the replica (0.25↔2 CU to 2↔8) and enabled `hot_standby_feedback` — same query still timed out, ruling out compute size as the fix too. This looks like genuine Neon storage-layer I/O latency on a large scan; needs to run as a real Cloud Run job with a proper timeout budget, not an interactive query. Do not report this rail as serve-cutover-ready to the LDT lane. | hauska-factory (fill/verify half) + legacy-design-tools (serve-cutover half) | Blocked — 4 counties open |

### Wave 1 lane conflicts (sequence, don't blind-parallelize)

- **legacy-design-tools rail-scoring family (12-14):** superseded by actual events — #445/#446 (12-13) had no real conflict and landed first; #440 (14) landed after composing Ruling 4 with R-09; #554 (15) did not land this sprint (see item 15/19).
- **Item 1's CI guard vs items 2, 12-14:** resolved — item 1's `PR base is main` check (PR #609) landed and was made required before the others merged, after a same-night sequencing bug (required before merged) briefly blocked every open PR in the repo; see the session record for the incident.
- **hauska-factory writer family (4, 9, 10, 20-factory-half):** different files, no direct edit conflict, genuinely parallelizable within the repo.
- **Read/write contention on the single Neon `parcel_record` primary, until item 6 lands:** items 4, 8, 9-verify, 10, 11, and 20-factory-half's measurement step will contend if run concurrently and may time out (throughput, not correctness) — stagger the heavy-read items.
- **Item 20's two halves are sequenced, not parallel:** LDT's serve-cutover half cannot meaningfully start until the Factory half confirms the rail is filled and gate-verified.

## Wave 2 — blocked

| # | Item | Depends on |
|---|---|---|
| 19 | Wave R execution (the *old* conformant-bake pipeline's remaining work — landUse projection, situs recovery, tax-year selection, ADR-029 rail-absence row, fail-closed upsert for ~58,461 inherited centroids) | Wave 1 substantially closing (operator's own governing order, reinforced 2026-09-04); its own unconfirmed prerequisite chain (W0b review, determinism gate, S1-S12 checks, six staging bakes); the unrouted 2026-08-30 adversarial review (`_inbox/2026-08-30_ctx_remainder_deep_review.md`) whose blocking findings are addressed indirectly by item 20 above rather than by patching the old pipeline directly; and the operator's 2026-09-05 hold on starting Wave R planning until item 20 (4 counties still open) and the item-15 earned-absence contract question both close — the latter is now RULED (`_decisions/2026-09-05_landuse_earned_absence_contract.md`: keep main's contract, re-port #554's source precedence onto it), so item 20 is the sole remaining Wave-R gate. |

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
- 2026-09-05, items 5 and 9 closed for real, item 4/10 honestly downgraded, item
  20 stays blocked with a sharper diagnosis. Factory lane's own live-verification
  caught PR #90 (item 5) and PR #87 (item 9) both merged with zero live effect;
  integration seat found the underlying Cloud Run jobs were running stale images
  (2-3 days old, predating the merges), rebuilt via `cloudbuild.publish.yaml`/
  `cloudbuild.parcel-acquire-gis.yaml`/`cloudbuild.parcel-wave2.yaml`, re-ran
  migration 0011 and the real `--apply` for both item-9 rails across all 6
  counties, and live-verified the actual production cell counts changed (0
  unaccounted remaining for overlayDistricts). Item 4 (Williamson/McLennan vacuous
  zeros) and item 10 (Bastrop-only, near-tautological verification) recorded as
  real but partial, not clean closes. Item 20 remains blocked on 4 of 6 counties
  after ruling out both query design and replica compute size (resized twice,
  `hot_standby_feedback` enabled, same timeout persists) — looks like genuine
  storage-layer I/O latency needing a real job execution, not an interactive
  query. Also obtained direct Neon API access this session (an existing,
  previously-unused `NEON_API_KEY` secret) for endpoint inspection and resizing
  going forward.
- 2026-09-05, item 9 reopened — data fix was real, serve fix was not. Follow-up
  research (prompted by the operator's "did this actually reach what we're
  serving" question) found `factory-publish-gate-sched`'s `SLATE_1_RAIL_KEYS`
  hard-codes 5 rails that exclude both overlayDistricts and maxImperviousCoverPct,
  and the hourly scheduler passes no `--rail` override — so no gate verdict was
  ever computed for either, and `parcelRecordAllowlist.ts`'s own rule kept real
  traffic on `legacy` regardless of the corrected store data. One-time manual
  catch-up gate run executed; permanent gate-slate fix dispatched to the Factory
  lane, not yet landed. **Lesson for any future rail cutover (item 10, item 20's
  landUse): verify the gate-verdict slate actually covers the rail, not just that
  the underlying cell data is correct** — neither `owner` nor `landUseCode` is in
  the current 5-rail default either, so this same gap is latent for both.

## Wave 3 — ledger serving audit follow-through (2026-09-05)

Scope is `_inbox/2026-09-05_ledger_serving_audit.md` in full. Operator ruling: fix
items 1/2/3/5 now, get everything else genuinely serving prod; item 4 (promoting
the 7 frozen-manual-verdict rails into a real recurring gate slate) is its own
**separate, later "gate eval wave"** — explicitly NOT in this wave's scope, so it
does not get pulled in early while the operator runs QA and market-readiness work
on the rest of the app in parallel.

| # | Item | Repo | Lane |
|---|---|---|---|
| 1 | zoningDistrict/setbackFrontFt (P-106) gate-verdict status is unresolved — the allowlist's own comment says no verdict exists; the prior "live-verified twice" record only proves deploy-crash-safety, not real value resolution. Determine live status via `parcel_gate_verdict`, then if missing, add both to the gate-evaluated slate the same careful way PR #91 did (check per-county scope safety first), then verify a real authenticated request returns the correct value. | hauska-factory (gate-slate fix) + legacy-design-tools (live-authenticated verification, credentials this session lacked) | Factory fixes, LDT verifies |
| 2 | maxImperviousCoverPct: Travis itself reads `refuse`, 244,669 unaccounted — not the other-counties non-issue reported earlier. Investigate the writer's own tracked `unresolvedZones`/`anomalies` cases and get them to a real terminal state. | hauska-factory | Factory |
| 3 | Four data-layer "unaccounted forever" bugs: `agValuation` (4/6 counties, no not-applicable path for out-of-scope counties), `schoolDistrict` (0-hit/2+-hit anomalies logged in-memory only, never persisted), `zoningDistrict` (49 cities with no staged layer at all — write an honest `refused`/"no layer yet" state, do not wait on acquiring the data), and the shared CAD-ingest gap in `ingest-existing.js` (`if (!cad) continue`, affects ~15 fields including `landUseCode` — fold into item 20's own landUse work rather than treat separately). | hauska-factory | Factory |
| 4 | **DEFERRED — separate "gate eval wave," not this sprint.** Promote the 7 rails serving via a frozen one-time manual gate verdict (`marketValue`, `assessedValue`, `landValue`, `improvementValue`, `livingAreaSqft`, `yearBuilt`, `utilityService`) into a real recurring slate, or explicitly rule a one-time verdict acceptable for them and document why. | hauska-factory | Deferred |
| 5 | `factory-bexar-edges` has no checked-in Cloud Build pipeline at all (same gap as 12 other jobs from the 2026-09-02 reaper-phantoms sweep) — currently also missing the connectFactory timeout fix (2026-09-02 incident) with no safe way to redeploy. Write and check in a real deploy pipeline for it, matching the existing pattern (`cloudbuild.conformant.yaml` et al.), then redeploy. | hauska-factory | Factory |

Report back via `_inbox/` close docs, same as every other lane tonight. Cross-session
messaging has been unreliable at points this session — do not rely on it as the only
report path.

**Close-out (2026-09-05):** items 1 (zoningDistrict half), 2, 3 (agValuation/
schoolDistrict/zoningDistrict), and 5 (pipeline checked in) all merged and
independently verified (PRs #92-#95, 1000/0/2 full suite). Two genuine, correctly-
flagged-rather-than-forced open items surfaced:

- **setbackFrontFt has no real writer anywhere in this repo.** The `writer-allowlist.mjs`
  "f11-setback" entry is scaffolding for a job that was never built on this branch.
  Only the unincorporated not-applicable case exists. Needs a real F-11 writer before
  this rail's own half of item 1/P-106 can close at all — separate scoping decision,
  not a Wave 3 task.
- **The CAD-ingest gap (`ingest-existing.js`'s `if (!cad) continue`) needs an explicit
  ruling, not a code fix, before anyone touches it.** Two real blockers: (1) the file
  is compiled/vendored from hauska-engine (`ENGINE_PIN.json`, "do not edit these .js
  files by hand") — the real fix belongs in hauska-engine's TypeScript source plus a
  re-vendor; (2) this file has a deliberately-tested invariant asserting the OPPOSITE
  of the wanted fix ("a join miss must never reach absent-verified," with its own
  falsifier test) — reversing it is a real design call. Factory's own analysis of
  `CAD_ROWS_SQL` (`DISTINCT ON prop_id ORDER BY tax_year DESC`, scoped to the exact
  propIds in the page, across all observed tax years) supports the reversal being
  correct — a genuine join miss there means no `cad_property` row exists for that
  county+propId in any tax year ever ingested, which is a confirmed absence, not an
  unprocessed case. Directly blocks a clean landUseCode answer for item 20. Ruling
  needed from operator/Engine lane, not implemented pending that.
- `factory-bexar-edges`'s new pipeline is checked in but the actual `gcloud builds
  submit` was deliberately left for the integration seat (a real production deploy);
  triggered same session this close-out was processed.
