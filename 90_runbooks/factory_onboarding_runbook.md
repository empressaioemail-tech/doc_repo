---
id: factory_onboarding_runbook
title: Factory Onboarding Runbook (pipeline, fallbacks, ledger, Warden, regression protection)
date: 2026-08-04
status: active (executor-drafted 2026-08-04, planner-reviewed and promoted same day with the corrections section below; the draft remains in _inbox as provenance)
owner: nick
related: [90_operations/OPS-8_blocker_free_onboarding_model, 90_operations/OPS-9_scale_ops_specs_pack, 90_operations/onboarding_defect_class_backlog, 90_operations/OPS-2_county_onboarding_runbook, 90_operations/OPS-5_cert_standard, 90_operations/OPS-7_coverage_and_honesty_doctrine, 90_operations/OPS-4_rewarm_protocol, _dispatches/2026-08-04_elgin_pipeline_planner_handoff, _sessions/2026-08-03_county_onboarded_claude_code, _sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code, _sessions/2026-08-04_elgin_pipeline_continuation_claude_code, _sessions/2026-08-04_ops9_wave_execution_claude_code]
---

# Factory Onboarding Runbook

Purpose: what a fresh planner agent needs to onboard a Texas jurisdiction end to end — the two pipeline lanes, the fallback and trap procedures paid for in blood this week, the ledger contract, the Warden, and the regression gate that must hold after any shared-code change. Every command below is copied verbatim from a real run record; where a record does not state a fact precisely enough to give as an instruction, this doc says OPEN and names the question rather than guessing.

This draft consolidates and does not contradict `_dispatches/2026-08-04_elgin_pipeline_planner_handoff.md` (the seed). Read that dispatch's OPERATING DISCIPLINE section in full before running anything — items 1 through 9 there (recon-then-review, executor boilerplate, merge gating, flake discipline, STOP-on-false-premise, verification-is-yours, record-keeping) apply to every step below and are not re-derived here except where a step needs the exact wording.

## 0. Prerequisites — read before touching anything

1. `90_operations/OPS-8_blocker_free_onboarding_model.md` — the pre-flight gate model (8 checks, run-what-passes, dual ledger).
2. `90_operations/onboarding_defect_class_backlog.md` — current class register; check whether the defect you are about to hit already has a CLEARED fix.
3. `90_operations/OPS-2_county_onboarding_runbook.md`, `OPS-5_cert_standard.md`, `OPS-7_coverage_and_honesty_doctrine.md`, `OPS-4_rewarm_protocol.md` — the mechanical line, the cert law, the honesty doctrine, the rewarm mechanism this pipeline sits on top of.
4. `00_current_state.md` top two entries, and the most recent `_sessions/` files for the jurisdiction you are about to touch.
5. Credentials (per the handoff dispatch, item 8): engine/atoms DB via `gcloud secrets versions access latest --secret=DATABASE_URL` (and `CORTEX_DATABASE_URL`) `--project hauska-prod-497015`; ldt/txgio DB via `--secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod`; retrieval-api key by reading `RETRIEVAL_API_KEY` from the `hauska-retrieval-api` Cloud Run service env (project `hauska-prod-497015`), base URL `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`. Warden env contract (learned 2026-08-04, `_sessions/2026-08-04_ops9_wave_execution_claude_code.md`): `DATABASE_URL` = atoms Neon; `TXGIO_DATABASE_URL` = the ldt deployment Neon (`txgio_parcel`); retrieval pair for serve-path.

## 1. THE PIPELINE

Two lanes. A jurisdiction is either an UNZONED COUNTY (breadth bake already exists or is cheap; the win is honest-absence at scale) or a ZONED CITY (needs source wiring, a stamp, and a ratified setback table before anything can warm). Determine which lane before starting — the county lane has no table-ratification gate, the city lane does.

### 1A. UNZONED COUNTY LANE

Proven once, end to end, on Bastrop County (unincorporated), fips 48021, 2026-08-03 (`_sessions/2026-08-03_county_onboarded_claude_code.md`, `90_operations/onboarding_defect_class_backlog.md` "COUNTY ONBOARDED" entry).

**Step C1 — Recon (read-only).** Before running anything: confirm whether the zoning honest-absence layer already exists for this cohort (Bastrop County's was minted 2026-07-24 via the breadth-bake ledger, PR #104, independent of this pipeline). Confirm terrain/flood are already live as per-parcel serve-time rails (city-agnostic, nothing to batch — true for Bastrop County, verify per new county). Confirm whether the AGOL cohort loader can address this county's registry row: as of 2026-08-03/04 `loadJurisdictionRegistryRow` is FIPS-keyed and returns only the active row (documented in `registry-cohort.test.ts`) — a genuinely new county row cannot ride the cohort loader path until the rowId-keyed loader lands (OPS-9 S4 item, still open per `_sessions/2026-08-04_ops9_wave_execution_claude_code.md` queue). If it cannot, the cascade must ride the Tier-1 snapshot path instead, as Bastrop County did.

**Step C2 — Contract-shape STOP check.** The atom contract gives `setback-rule` REQUIRED numeric dimensions with no true absence shape. NEVER mint a `setback-rule` "decline" by fabricating front/side/rear numbers. The ruled pattern (planner ruling, 2026-08-03): mint ONLY `buildable-envelope` declines using the R27 persisted warm-verify-decline precedent, with the code `unzoned-no-district-basis`. The chain reads: zoning-fact (named absence) → setback slot legitimately empty → envelope (named decline). An executor that stops here rather than inventing a decline shape is behaving correctly (STOP-on-false-premise, dispatch item 6) — make this ruling yourself if a fresh county needs it, do not improvise a new absence shape without a planner ruling.

**Step C3 — Breadth/absence cascade.** The engine's cascade builder runs off honest-decline-promote, `--cascade-absence-only` bake mode with keyset pagination and query-level city exclusion (Bastrop County shipped this in engine PR #222, `gradeUnzonedParcel` + `--grade-mode=unzoned` cert branch). Dry-run first; the dry-run count must be exactly explainable and must match the apply count (Bastrop: dry-run predicted 56,488; apply scanned 62,260, cascaded 56,488, zero errors, ~17 minutes). OPEN: the exact CLI invocation (script name + flags) for `--cascade-absence-only` was not captured verbatim in any session record read for this draft — the session narrates the mode name and behavior but not the literal command line the way Elgin's steps 1/2/4 were captured. A fresh planner must locate the actual script (grep the engine repo for `cascade-absence-only`) and verbatim-capture the invocation into the run artifact before running it against prod.

**Step C4 — Live post-verification.** Confirm via SQL: total envelopes = untouched city-cohort count + new unzoned-decline count. Bastrop: 62,220 total = 5,732 city cohort (untouched) + 56,488 unzoned declines carrying the honest reason string.

**Step C5 — Gate.** Run the pre-flight gate (same tool as the city lane, see step Z-GATE below) — this is what "earns the right to run" per OPS-8. An unzoned county's `zoningSourceReachableOrUnzoned` check is expected to PASS via the unzoned-regime branch ("unzoned regime — zoning/setback honest-absence is the expected pass state") — this is a PASS, not a decline; treat it as the doctrine working, never as a gap.

**Step C6 — Cert (unzoned mode).** `--grade-mode=unzoned` cert branch (per PR #222). Bastrop County: 20/20 PASS, every sampled parcel a genuine honest-decline with a resolving cadastral ring, `blockPass: true` (`_inbox/2026-08-03_county_cert_20of20.json`). KNOWN TOOLING ARTIFACT (record, do not treat as a real fail): the cert script's internal preflight lacks the HTTP probe wiring the standalone gate CLI has, so the cert artifact may carry a spurious `scopeAnnotation` claiming Rail A "not runnable" even when the authoritative full-gate artifact shows Rail A PASS. This is queued as a nit ("wire probes into the cert-path preflight") under OPS-9 S4 — check whether it has landed before assuming it still fires.

**Step C7 — Seed the ledger.** POST the gate result and cert result to the ledger (see section 3). Bastrop County's seeding is documented as done in the OPS-9 wave close: "fresh gate runs POSTed for all three rows (8/8 each)... county + Elgin 8/8 gates with honest cert absence."

### 1B. ZONED CITY LANE

Proven once, end to end, on Elgin, fips 48021, across three sessions 2026-08-03/04 (`_sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code.md`, `_sessions/2026-08-04_elgin_pipeline_continuation_claude_code.md`, `_dispatches/2026-08-04_elgin_pipeline_planner_handoff.md`).

**Step Z1 — Source recon (read-only, both repos + live probes).** Do not assume a city's parcels are addressable via whatever cohort layer the last city used. Elgin's recon found Bastrop's AGOL layer 23 carries ZERO Elgin parcels; the real source was a different FeatureServer entirely (Elgin_Zoning, BasCoGIS org, Bastrop-side layer 0 = 3,220 polygons; a structurally incompatible Travis-side layer 1 = 500 parcels, named follow-on, out of scope for the first pass). Verify the parcel layer, the zoning field names, and the domain-code mapping (Elgin: `Zone_Code`, A-to-R-4 via `districtValueByPrefix`) against the live service, not against another city's registry row as a template.

**Step Z2 — Registry row + zoning-stamp config.** Author the registry row: the real Rail C layer, the jurisdiction descriptor slug (`elgin_tx`), the per-district code-section map (a deliberate structural difference from a shared permitted-use table if the source structures it that way), `railPerParcel` wired to the live FeatureServer layer. Landed for Elgin in engine PR #224. This is the registry-authoring step per OPS-1/OPS-2 Stage 0 — adversarial review, then freeze.

**Step Z3 — Setback table draft.** Build the DRAFT setback table with, on every scalar, per-field provenance carrying the atom DID and a verbatim quote; every conditional cell marked `not_specified: true` with the rule text; registration to `SETBACK_TABLES` COMMENTED OUT behind a `TODO(<city>-review)` marker so the draft cannot serve unratified. Elgin: 8 districts, `elgin-development-code.json`.

**Step Z4 — PLANNER row-verification.** Cross-check every scalar against an independent extraction plus live corpus atom pulls (Elgin: R-1 front 25, R-2 side 5 verified verbatim against the corpus). Mechanically verify every cited DID resolves in the live corpus snapshot — this step caught a real bug on Elgin (entityIds use SLASH separators, not Bastrop-BDC's DASH format; verify the separator convention per edition, never assume the last city's format). Also independently check the ldt-side wiring for regressions: Elgin's ZONING_LAYERS entry (ldt PR #379) exposed a real regression in `zoningProvenance`'s sole-wired-layer fallback the moment a county gained a second zoned layer — this is a class of bug that only appears at the SECOND city in a county, watch for it explicitly when onboarding a county's second city.

**Step Z5 — OPERATOR RATIFICATION gate.** The un-commenting of the `SETBACK_TABLES` registration IS the ratification act. Evidence package = the table's per-field provenance plus the row-verification record from Z4. This is a hard escalation point — per the handoff dispatch, "a setback/dimensional VALUE change to a ratified table" is one of the three things a planner must escalate to the operator for, never decide unilaterally.

**Step Z6 — Stamp dry-run then run (ldt side).** Dry-run first; verify the count and the full set of expected codes appear (Elgin: dry-run matched 3,798 parcels across all 8 codes, confirming the domain map fires including the rarer R-4). Then run for real and verify in the DB (Elgin: 4,047 rows = 3,798 parcels, multi-geometry rows explaining the ~7% row/parcel ratio — cross-checked against Bastrop city's own 6,218/5,772 ratio as "benign" precedent, not a new bug). Confirm the existing city's stamp in the same table is untouched.

**Step Z7 — Tier-1 re-bake (ldt side).** RECON FIRST: does the Tier-1 bake CLI scope to only the new city, or does it always run county-wide? For Elgin, no Elgin-only flag existed; the CLI only supports `--county=<fips>`. Verbatim command (from `_inbox/2026-08-04_elgin_step1_tier1_rebake.md`):

```
pnpm --filter @workspace/api-server node-facet-bake-tier1 -- --county=48021
```

Run once dry (the CLI's own dry-run mode — check the script for the flag; the artifact shows dry-run and "WRITE" mode summaries both printed by the same tool) and once for real. HARD CONSTRAINT: the already-certified city's snapshot data must be provably safe — either idempotent-identical or untouched. The planner ruling that made a county-wide re-bake safe for Bastrop city was that `shouldPromote` is monotonic (an equal-score timestamp refresh is allowed, never a downgrade); Bastrop city's Tier-1 zoning count was verified UNCHANGED after the run (5,773 before and after). Verify this same invariant explicitly for any future re-bake — do not assume monotonicity holds without checking the promote logic.

Expected output shape: a summary block reporting parcels seen, bakeable nodes, promoted (new) vs promoted (upgrade) vs kept-prior counts, and per-facet coverage percentages (land-use, acreage, zoning, envelope). Post-verify by direct count of the new city's Tier-1 zoning facets against its stamped-parcel count, explaining any gap (Elgin: 3,798 stamped → 3,762 Tier-1 facets, gap fully explained by multi-geometry prop_id collisions plus a `prop_id='0'` collision already held by another district — recorded, not hand-waved).

Verification probe: SQL count of `<city>_tier1_zoning_facet` before/after, plus explicit confirmation the existing certified city's count is unchanged.

ABORT/FALLBACK: if the promote logic is NOT provably monotonic-safe for the existing city, do not run county-wide — escalate to the operator for a scoping decision before writing.

**Step Z8 — Engine zoning-fact bake.** RECON FIRST for two known blocker classes before baking:
1. A hardcoded county-to-descriptor map (Elgin's case: `COUNTY_FIPS_TO_DISTRICT_MAP_KEY` forced `bastrop_tx` code refs for the whole FIPS, which would have silently mismatched Elgin's `elgin_tx` corpus).
2. A setback-table key mismatch (Elgin's case: `getSetbackTableForZoning("elgin-tx")` missed because the table was registered under `elgin-development-code`).

Two fix strategies exist: Option A (proper fix — resolve the descriptor/table key per-parcel from the city hint, not from the county-wide map) or mint-then-backfill (use the established backfill idiom, e.g. `scripts/backfill-bastrop-zoning-fact-code-refs.mjs` as the template, with an `elgin_tx`-keyed variant). Elgin used Option A (planner ruling, `_sessions/2026-08-04_elgin_pipeline_continuation_claude_code.md`): landed as engine PR #226. State the choice and the reason in the run record either way — this is exactly the kind of judgment call that must be logged (STOP-on-false-premise discipline), not defaulted silently.

Verify BEFORE baking that the #222 cascade code path (which now also emits envelope declines in normal mode) will not double-write or mislabel the newly-districted city's parcels — the old `unzoned-no-district-basis` cascade envelopes on the new city's parcels MUST be superseded by the district path, not duplicated. This also clears the REASON-OVERSTATES defect class for that city's slice; verify the supersede actually happened with a live SQL count of stale cascade entries on the new city's district parcels (expect 0).

Bake command shape (Bastrop County precedent, county-wide normal mode; confirm the exact flag set against the engine repo's current script before running — do not assume flags are identical for every jurisdiction): `bake-property-atom-county.mjs` normal mode for the target FIPS. Elgin's actual dry-run/apply produced this exact JSON event shape (from `_inbox/2026-08-04_elgin_step2_zoning_fact_bake.md`):

```
{"event":"breadth-county-bake.done","ledgerPath":"...","status":"completed",
 "totals":{"parcelsSeen":62257,"parcelsEmitted":62257,"atomsWritten":69781,
   "zoningPresent":9535,"zoningAbsence":52722,"setbackPresent":3762,
   "envelopePresent":3762,"emitErrors":0},
 "honestAbsenceRate":{"zoning":0.8468...,"note":"..."},
 "bakedPct":{...},
 "compute":{"units":70093,"wallMs":229685,"approxUsd":0.1421,
   "costGateUsd":200,"flaggedOverCost":false},
 "spikeFlags":[]}
```

Dry-run and apply must produce IDENTICAL totals (explainable match, not just "close"). Live SQL verification after apply: new-city zoning-facts with correct code refs (Elgin: 3,762), stale cascade count on the new city's district parcels (expect 0), remaining county-wide cascade declines (= prior total minus the new city's cleared count; Elgin: 52,726 = 56,488 − 3,762), and spot-check the OTHER already-certified jurisdiction's gold parcels are untouched (Elgin run verified Bastrop gold parcels 28286/33512/34785 still served their original district and refs).

ABORT/FALLBACK: if `emitErrors > 0` or the dry-run/apply totals do not match exactly, do not apply — the mismatch needs explaining before any prod write (dry-run-must-predict-apply discipline, MEMORY.md).

**Step Z9 — Re-gate.** See section "THE GATE" below (shared machinery with the county lane). Run `onboard-preflight` for the target FIPS. Expect the new city's three former declines (`railASourceReachable`, `zoningSourceReachableOrUnzoned`, `parcelLayerWired`) to flip to PASS. File the JSON artifact in `_inbox/`, update the defect-class backlog (clear `ADAPTER-NEEDED` and `PARCEL-LAYER-UNWIRED` for that row if green).

**Step Z10 — Depth warm + cert.**

RECON FIRST: does this city need its own warm script? Per-jurisdiction warm scripts are currently hand-authored (`depth-warm-bastrop-batch.mjs`, `depth-warm-caldwell-batch.mjs` precedent; `depth-warm-elgin-batch.mjs` for Elgin, engine PR #227). OPERATE-NOT-REBUILD: reuse `warmThenVerify`, `promoteHonestVerifyDecline`, `cert-grade-core.ts` — do not build parallel machinery. This hand-authored-per-city state is a named gap (OPS-9 S4: "Registry-driven warm... fold the per-city warm scripts into a single registry-parameterized runner"), not yet closed as of this draft.

City bbox for road-node loading: derive from the city-limits geometry or OSM live extent, record provenance — never invent coordinates. Elgin: `ELGIN_CITY_BBOX` derived from the AGOL `Elgin_Zoning` extent.

Verbatim warm command (from `_inbox/2026-08-04_elgin_warm_promote.log`):

```
tsx scripts/depth-warm-elgin-batch.mjs "--city-cohort" "--promote" "--limit=10000"
```

(Note: this is the per-city script's own CLI surface — a different jurisdiction's script may expose the same flags under a different filename; do not assume the filename generalizes, only the flag shape as of this proof.)

FALLBACK — no-road-adjacency spike: Elgin's first warm pilot returned 49/50 `no-road-adjacency` declines. Diagnosis before assuming a bug: check whether the city's OSM road data actually exists in the loaded road-node set, and whether local streets are tagged in a way the warm path treats as "undefined" (Elgin's streets were almost entirely `county-roadway-undefined`, filtered from the warm pool by design; nearest convertible road was ~600m away). FIX: OSM ingest for the city's bbox (Elgin: engine PR #228, prod ingest of 2,356 ways) BEFORE re-attempting the warm, not a warm-path code change.

Full-cohort warm outcome shape (Elgin, city-cohort, 3,762 processed): promoted 1,886 / verifyFail 1,564 / no-road-adjacency 57 / no-setback-row 255, cost under gate. Every non-promoted parcel must land in a NAMED decline bucket — zero bare "pending."

**REQUIRED regression check before cert:** re-run the existing certified city/block's cert (see section 5, Bastrop block-13 7/7) immediately after any warm run that touches shared code paths. Elgin's warm path shared code with Bastrop's; the re-run confirmed Bastrop block-13 STILL 7/7 (`_inbox/2026-08-04_bastrop_block13_post_elgin_warm_path.json`).

Cert command shape (per the handoff dispatch step 4, and confirmed by the actual roster-from-file run captured in `_inbox/2026-08-04_elgin_cert_stratified.json`): `block13-cert-grade.mjs` default grade mode, `--roster-from=file` pointing at a roster text file (e.g. `_inbox/2026-08-04_elgin_cert_roster_stratified.txt`), plus `--preflight-row-id "<RowName>"` so scopeAnnotations attribute correctly. Elgin's descriptor-answer-key cert on a promoted sample came back 2/10 — NOT CERT-RESTORE yet — with three named residual defect classes, not a blanket failure:
- frontOrientation token mismatch (OSM road-name abbreviations vs CAD situs abbreviations: Avenue/AVE, SH/State Highway, FM/Farm-to-Market — a normalization gap, not a data error).
- served rear 0 vs descriptor 10 on some rows (a `not_specified`/emit-path bug).
- occasional per-edge role/index mismatch.

These are queued as the `ELGIN-CERT-RESIDUAL` defect class (see section 3 class register) — they do NOT block seeding the ledger with the honest partial state; they DO block calling Elgin's cert "CERT-RESTORE ELIGIBLE" until fixed and re-run.

**Step Z11 — Close.** Session record, `00_current_state.md` top entry, all run artifacts copied to `_inbox/`, defect-class backlog updated (including REASON-OVERSTATES status after the Z8 supersede verification), commit and push doc_repo.

### THE GATE (shared machinery, both lanes)

Verbatim command (per the handoff dispatch step 3, confirmed against the `_inbox/2026-08-03_preflight_48021_full_gate.json` and `_inbox/2026-08-04_preflight_48021_elgin_regate.json` artifact shapes):

```
scripts/onboard-preflight.mjs --fips=48021
```

with `DATABASE_URL` + `CORTEX_DATABASE_URL` + `RETRIEVAL_API_URL`/`RETRIEVAL_API_KEY` env set so the serve-path probe wires (per `_sessions/2026-08-04_elgin_pipeline_continuation_claude_code.md` STEP 3 description; the handoff dispatch's own step 3 line names `DATABASE_URL` + `RETRIEVAL_API_URL/KEY` — treat `CORTEX_DATABASE_URL` as also required per the later session's more complete statement).

The gate runs, per registry row, the 8 OPS-8 checks and returns PASS or a named DECLINE with a `defectClass` per failing check:

| id | name | what a DECLINE means |
|---|---|---|
| `railASourceReachable` | Rail A source + adapter reachable | `defectClass: ADAPTER-NEEDED` |
| `zoningSourceReachableOrUnzoned` | Zoning source reachable / unzoned-flagged | `defectClass: ADAPTER-NEEDED` (unless row is flagged unzoned, which PASSes) |
| `parcelLayerWired` | Rail C parcel layer wired in registry row | `defectClass: PARCEL-LAYER-UNWIRED` |
| `supersededCohortMeasured` | Superseded cohort measured | `defectClass: SUPERSEDED-GT3PCT` if over threshold |
| `geometryParitySample` | Geometry R28/R33 warm==cert parity on 5-parcel sample | `defectClass: GEOMETRY-DIVERGE` if diverges (caveat: sample-parity bounds risk, does not prove the cohort) |
| `servePathHealth` | Serve-path health (retrieval auth + atom-chain + ledger write) | `defectClass: SERVE-PATH-UNHEALTHY` |
| `costGate` | Cost on sample cohort < $200 | `defectClass: COST-GATE` |
| `mixedVintageResidueScan` | Mixed-vintage / stale-residue scan | `defectClass: MIXED-VINTAGE` |

Output JSON shape: `{"report":{"fips":"...","rows":[{"rowId":"...","checks":[...],"railPlan":{"runs":[...],"declines":[...]}}]},"ledgerEvents":[...]}`. Each declined check appears both inline under its row and as a flat entry in the top-level `ledgerEvents` array with `ts`, `fips`, `rowId`, `railOrCheck`, `declineReason`, `defectClass` — this `ledgerEvents` array is what feeds the dual defect ledger (section 3).

File the raw JSON artifact into `_inbox/` (naming convention observed: `_inbox/<date>_preflight_<fips>_<label>.json`, e.g. `2026-08-03_preflight_48021_full_gate.json`, `2026-08-04_preflight_48021_elgin_regate.json`).

ABORT/FALLBACK: the gate declining a rail is NOT a blocker — per OPS-8's central inversion, a clean up-front decline is the opposite of a blocker. Run every rail that PASSED; do not stall waiting for a declined rail to be fixed inline. File the decline and move on.

## 2. FALLBACKS & TRAPS

### CI conclusion-string gating
Gate every merge on the CI conclusion STRING, never an exit code: `gh run view --json conclusion --jq .conclusion` into a variable, merge only inside an explicit equality test against `"success"`, and confirm the run's `headSha` equals the PR head (a `gh` command can exit 0 even when conclusion is `"failure"` — this exact hole caused a bad merge + revert cycle on 2026-08-03, per the handoff dispatch item 4).

### Flake triage protocol
Engine has a known order-dependent PDF-suite flake, issue #221 (`decodeAllContentStreams` / `inflateSync`, a different test file each occurrence: render/dossier/flood-drainage/overflow-pagination). **#221 was KILLED AT ROOT 2026-08-04** (engine PR #233, `_sessions/2026-08-04_ops9_wave_execution_claude_code.md`): root cause was NOT concurrency — the test decode helper truncated PDF stream slices by regex-scanning for `endstream` instead of reading `/Length`, content-dependent at roughly 0.5% per stream, plus a second latent scan bug. A 400-iteration probe went from 2/400 broken to 0/400 after the fix; the issue is closed. Treat any recurrence of a PDF-suite red as a REAL failure going forward, not the known flake — the old "known flake, rerun once" exemption for this specific issue no longer applies now that the root cause is fixed.

ldt has portal-ui socket-hang flakes (still open as a flake class). Protocol for any red, PDF-suite or otherwise: PULL THE LOG and identify the exact failing test BEFORE concluding anything. An untouched-file plus a known-flake signature (for still-open flake classes) earns one rerun (`gh run rerun --failed`) and a fresh judgment; the same test failing twice in a touched area is real. A red that reproduces locally but not in CI may be the CRLF class (Windows `autocrlf` breaks literal-newline regexes in tests) — check line endings before diagnosing further.

### Image-race guard
A workflow's `image_tag=latest` (or any "most recent" tag resolution) races the push-build for the merge SHA. Wait for the merge SHA's build to complete before running deploy workflows that consume it; pin the SHA/digest explicitly rather than trusting a floating tag. The OPS-9 wave close notes "both image-race deploys corrected with build-wait guards" — this bit twice in one session even with the discipline named, treat it as a standing hazard on every deploy, not a one-time fix.

### Merged-not-applied migrations
A merged migration is not necessarily applied to the deployment database. This class hit directly in the OPS-9 wave (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`: "the migration-not-applied 500" — migration 0065 was hand-applied after a deploy raced ahead of it). Verify the LIVE schema (name the migration number, query for its effect) before dispatching any data-run that depends on a new migration having landed; if a deploy raced the migration, hand-apply the migration directly (idempotent migrations only) rather than assuming the deploy pipeline handled it.

### Key-desync class (--source deploys and Vercel-held keys)
A `gcloud run deploy --source` redeploy can re-mint the Bearer key downstream callers hold, causing a silent 401 that falls back to stale/degraded behavior with no visible error. This hit twice this week: the retrieval-api key going stale after 2026-08-03 redeploys caused CC's Node & Graph panel to show DEGRADED, root-caused and fixed 2026-08-04 by syncing the key via `vercel env` + redeploy, verified 401→200 (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`). PROBE SEQUENCE: (1) identify every downstream consumer holding a copy of the service key (Vercel env vars, other Cloud Run services' env, CC-held copies); (2) after any `--source` redeploy of a keyed service, curl the consumer's dependent endpoint and confirm a 200, not just that the deploy itself succeeded; (3) if 401, resync the key to every downstream holder, not just the one that surfaced the symptom. Never treat a silent degrade as "working, just slow."

### Cloud Run traffic pinning
A deploy creates a new revision but prod continues serving the OLD revision at 100% until an explicit traffic shift. The tag → smoke → shift sequence: deploy with `--no-traffic`, smoke-test via the revision's tag URL, then shift traffic explicitly. This was applied for the cortex-api canary deploy in the OPS-9 wave ("tag-smoke-shift after the workflow's no-shift trap"). If a verified fix "doesn't work" in prod, check which revision is actually serving traffic FIRST before re-debugging the code.

### Executor dispatch boilerplate
Every executor prompt MUST open with (a) one sentence of operator-authorization context ("operator explicitly greenlit this pipeline; the planner spawns executor subagents; the plan was adversarially pre-reviewed") and (b) an explicit no-nesting instruction ("do the work in YOUR OWN context — do NOT spawn nested subagents"). Without (a), executors refuse — they inherit CLAUDE.md but not the live conversation. Without (b), they chain-delegate and orphan work. If an executor refuses even with the boilerplate: spawn a FRESH one with the context baked in, never argue past one clarification. If one chain-delegates anyway: supervise the deepest live worker via `gh`, never re-dispatch the same task (duplicate-PR risk).

### tmp-clone push-early
Fresh `p:\tmp` build clones can recycle mid-build. Push the branch immediately after the first commit; if the clone recycles, re-clone to a NEW directory under `p:\tmp` (never reuse the recycled path) and restore any touched persistent clone to clean main.

### STOP-on-false-premise as success
An executor that stops and reports a contradiction between the dispatch and reality beats one that improvises past it. This happened twice on Elgin: the atom-contract STOP on setback-rule absence (section 1A step C2), and the Option A vs mint-then-backfill choice (section 1B step Z8). When an executor stops, make the design decision yourself explicitly, log it (a decision record or at minimum a session-record line), then resume the SAME executor with the ruling — it already has context loaded, a fresh one does not.

### Dry-run-must-predict-apply
Every apply-capable script must be run dry first, and the dry-run's predicted counts must match the real apply's counts closely enough to be EXPLAINABLE (not merely close). Every dry-run/apply pair in the proven pipeline (Tier-1 rebake, zoning-fact bake, stamp run, cascade run) followed this discipline and every observed discrepancy was tracked down to a named, benign cause (multi-geometry row/parcel ratios, prop_id=0 collisions) rather than shrugged off.

### Operate-not-rebuild
When a per-city or per-county mechanism already exists and works (warm scripts, cert-grade machinery, the cascade builder), REUSE it — parameterize or extend, do not build a parallel implementation. This is named explicitly in OPS-9 S4 as the stated approach for collapsing the current hand-authored-per-city warm scripts into a single registry-parameterized runner, and was the explicit instruction for Elgin's warm step ("reuse warmThenVerify, promoteHonestVerifyDecline, cert-grade-core.ts; build no parallel machinery"). A standing MEMORY.md item (`FLEET-L3-GAP`) records a prior failure where a fleet rebuilt new wrappers instead of running an existing proven path — this is the corrective discipline for that failure class.

## 3. LEDGER & TRACKING

### What POSTs, and when

Three kinds of runs write to the ledger, per the OPS-8 dual-ledger model and the OPS-9 S1 implementation (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`):

1. **Preflight-and-report** — every gate run (section "THE GATE" above) posts its per-row, per-check verdicts, including declines with `defectClass`.
2. **Cert-grade-and-report --with-quarantine** — every cert run posts its pass/fail verdict per parcel, the roster used, and any quarantined parcels (Bastrop's known quarantine: the 7 Block-13 parcels) as explicit data rather than a hardcoded exclusion list. The OPS-9 S1 acceptance criterion explicitly named surfacing "the block-13 quarantine set (today hardcoded in the cert script)" as data.
3. **Warden-sweep** — every Warden run (section 4) posts its findings as ledger events, same event shape, never a fix.

### The sourceKind contract

OPEN: no source document read for this draft states a literal field or enum named `sourceKind` — this term does not appear verbatim in OPS-8, OPS-9, the defect backlog, or any of the four session records. The nearest documented concept is `defectClass` (the class-grouping key used throughout the dual ledger) and `checkId`/`railOrCheck` (which check produced the event). A fresh planner should treat "sourceKind" as either (a) a synonym the dispatching operator used loosely for `defectClass`, or (b) a real field that exists in code but was not surfaced in any doc_repo artifact read for this draft — verify against the live `onboarding_ledger_event` schema (see below) before assuming either.

### Where it renders

CC (Command Center) County Ledger v2, Vercel project `cmdcenter` (NOT `command-center`/jade — see MEMORY.md `cc-deploy-cmdcenter-blush-not-command-center-jade`). Per OPS-9 S1, the row model is REGISTRY ROWS (not counties): each jurisdiction row nests under a county header with name + fips; columns are gate verdict (8 checks, PASS/decline chips with named reasons), cert (label, date, scopeAnnotations count), per-rail coverage with a correct percent-math denominator, open defect classes, focused-fix parcel count (expandable), and source vintages/staleness flags. As of the OPS-9 wave close this shipped and was verified live: "cmdcenter LIVE with the v2 County Ledger (bundle index-DE1wozNI, honest 'no gate run recorded' replacing the misleading UNCERTED default)."

### Backing store

Per the OPS-9 wave session's "Ledger store ruling": ONE reading surface, the cortex Neon database. `onboarding_ledger_event` is a superset schema carrying preflight, cert, quarantine, and Warden events together. `jurisdiction_registry_row_mirror` holds the roster (mirrors the engine's registry rows). `county_gate_cert_state` holds the gate/cert summary state per row. The Warden writes through the SAME ingest endpoint as preflight/cert — there is no separate engine-side findings table.

### The rule

Every run's raw artifact lands in `_inbox/` AND the ledger POST happens in the same close — the file is the durable/auditable record, the POST is what makes it visible in CC. Neither substitutes for the other. Naming convention observed across every artifact read for this draft: `_inbox/<YYYY-MM-DD>_<jurisdiction-or-topic>_<step-or-type>.{json,md,log,txt}`.

### Ingest endpoint / env pair

OPEN: no source document read for this draft names a literal env var pair for the ledger ingest endpoint (the task prompt calls it "LEDGER_INGEST pair" but that literal string does not appear in OPS-8, OPS-9, the defect backlog, or the four session records). What IS documented: the ingest is an HTTP endpoint on cortex-api (the OPS-9 wave session references "the pinned ingest contract" and "the ingest route" landing via engine PR #230 report-wrapper scripts and ldt PR #381's "ingest route + three tables"). A fresh planner must locate the actual env var names in the report-wrapper script source (engine PR #230) before running a POST — do not guess a name.

## 4. THE WARDEN

Per OPS-9 S5 (spec) and its 2026-08-04 execution (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`).

### When it runs

Event-triggered: after a jurisdiction's cert lands. Scheduled: a rolling re-sweep of already-onboarded jurisdictions. (The scheduler/cron wiring itself was not confirmed as shipped in any record read for this draft — the shipped artifact is the sweep module and its first accepted run; treat the periodic-trigger half as OPEN unless verified against live code.)

### Env contract

`DATABASE_URL` = atoms Neon. `TXGIO_DATABASE_URL` = the ldt deployment Neon (holds `txgio_parcel`). Retrieval pair (same as the gate's serve-path probe) for serve-path checks. This contract was LEARNED during the first live sweep (engine PR #232 fixed a txgio connection wiring bug found by that first sweep) and is now documented into the CLI per the session record.

### Checks (as shipped, v1 — four of the checks named in the OPS-9 S5 spec)

Confirmed live and run against Bastrop in the first accepted sweep (`_inbox/2026-08-04_warden_sweep_bastrop_accepted.json`): `neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`. The OPS-9 S5 spec additionally named `edition drift` and `provenance integrity` as intended checks — these were NOT observed as distinct `checkId` values in the one sweep artifact read for this draft (only the four above appear in `checksRun`). OPEN: whether edition-drift and provenance-integrity checks have shipped since, or remain queued, needs a live-code check before a fresh planner assumes six checks run.

`neighborConsistency` finding shape (from the accepted sweep artifact): `defectClass: MIXED-VINTAGE-NEIGHBOR`, `evidence: {parcel: {parcelNodeId, district}, districtedFraction, thresholdFraction: 0.75, neighbors: [...]}`, `severity: "flag"`. A parcel flags when its own district is null/stale AND a high fraction (over the 0.75 threshold) of its geographic neighbors carry a current district — this is the "P-5 next to fixed SF-1" class made mechanical. `crossStoreConsistency` and `certFreshness` both returned `severity: "info"` with `defectClass: MEASURE-EMPTY-COHORT` in this run because no `--cert-artifact` was supplied (a grade-only run, not a diff-against-prior-verdict run) — supply `--cert-artifact` on future runs to get the real diff behavior these two checks are meant to provide.

Bastrop's first accepted sweep: 50 unique flagged parcels, all `neighborConsistency`, breaking down as 27 on repealed legacy-P codes (including the six P-5 watch parcels already known from the code-refs backfill) and roughly 23 patchy-absence parcels inside the districted cohort. Zero false flags on legitimate district boundaries. Serve-path clean after a calibration fix (engine PR #234: the serve-path comparator had been matching wrong wire field names, so served envelopes could never be observed present until fixed).

### Files-never-fixes (critical constraint)

The Warden FILES, it never fixes. Findings write to the focused-fix ledger / defect-class backlog as events with evidence; fixes go through the normal gated pipeline (recon-then-review, executor dispatch, planner merge). No auto-remediation, ever. This is enforced structurally — engine PR #229 shipped with "a structural import-guard test" specifically to keep the Warden from acquiring write/fix capability by accident in a future change.

### How findings route

Same event stream as preflight/cert (`onboarding_ledger_event`, same schema, same ingest endpoint) — the CC surfaces Warden status per jurisdiction (last sweep timestamp, findings open count). A finding becomes a defect-class backlog row exactly like a preflight decline does; class-fix-and-rewarm closes it the same way.

## 5. REGRESSION PROTECTION

### Bastrop block-13 7/7 — the standing acceptance gate

Any change to shared warm/cert code MUST be followed by a re-run of the Bastrop block-13 cert, and it must still return 7/7 CERT-RESTORE ELIGIBLE. This is not optional and not scoped to "changes that look related" — Elgin's pipeline shared code paths with Bastrop's (warm machinery, cert-grade-core) and the discipline was applied literally: after Elgin's full warm run, Bastrop block-13 was re-run and confirmed still 7/7 (`_inbox/2026-08-04_bastrop_block13_post_elgin_warm_path.json`, roster size 7, `blockPass: true`, `certRestore: "7/7 — CERT-RESTORE ELIGIBLE"`). It was checked again after the Bastrop city code-refs backfill (`_inbox/2026-08-03_cert_post_refs_backfill_7of7.log`) and again after the cert-script refactor (`_inbox/2026-08-03_block13_cert_post_refactor.log`). Treat "re-run block-13, confirm 7/7" as a mandatory step appended to every shared-code-touching pipeline stage, not a periodic nice-to-have.

Verbatim roster/measurer identity captured in the artifact, useful for confirming a re-run used the correct proven configuration: `rosterFrom: "block13"`, `rosterSource: "BLOCK13 constant"`, `measurer: "R32 index-matched inward-normal (measurePerEdgeInsetForRings)"`, `orientationGate: "fresh labelEdgesFromRoads front-edge road-name token-match (R33 normalization)"`, `roadNodesLoaded: 13987`.

### Drift-pin tests

OPS-4's rewarm protocol names `recipe_version` as the mechanism that makes "which jurisdictions need rewarming" computable, and the county-code-refs backfill (engine #223) shipped with "a drift-pin test tying the script's table to the TS map" — a test that fails if the hardcoded backfill table and the live TypeScript district map diverge. Apply the same pattern (a test pinning a script's assumed data shape to the live source of truth) to any future hand-authored backfill or per-city script, since this class of silent-mismatch bug (the `descriptorForCounty` key-mismatch that would have silently no-opped a whole re-bake) has already bitten once.

### Cert-freshness sweeps

Per OPS-5, a jurisdiction's cert is STALE when its recipe-version is behind the current one — rewarm and re-cert are needed. The Warden's `certFreshness` check (section 4) is the automated form of this, but as noted above it needs `--cert-artifact` supplied to do the real diff-against-prior-verdict comparison; without it, it only reports that it has nothing to compare against. A fresh planner should supply the most recent cert artifact explicitly on every Warden invocation intended to catch drift, not rely on the check firing usefully by default.

## OPEN ITEMS SUMMARY (see inline OPEN markers above for full context)

1. The exact CLI invocation (script filename and flags) for the county lane's `--cascade-absence-only` breadth cascade was never captured verbatim in any session record read — only the mode name and behavior. Locate and verbatim-capture before next county run.
2. The `sourceKind` field/contract named in the task prompt does not appear under that name in any source document; the closest documented concept is `defectClass`. Verify against live `onboarding_ledger_event` schema before treating "sourceKind" as a real field.
3. The literal env var pair for the ledger ingest endpoint ("LEDGER_INGEST" per the task prompt) is not named in any source document. Locate in engine PR #230's report-wrapper script source before running a POST.
4. Whether the Warden's periodic/scheduled trigger (cron or routine) has actually shipped, versus only the event-triggered post-cert sweep, is unconfirmed — only one sweep run (Bastrop, cert-triggered) was found in the record.
5. Whether the Warden's `edition drift` and `provenance integrity` checks (named in the OPS-9 S5 spec) have shipped is unconfirmed — the one sweep artifact read shows only four `checkId` values (`neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`).
6. The handoff dispatch's gate-env line names `DATABASE_URL` + `RETRIEVAL_API_URL/KEY`; the continuation session's STEP 3 line adds `CORTEX_DATABASE_URL`. This draft treats the union as required; verify against the live `onboard-preflight.mjs` script's actual env reads.
7. The rowId-keyed cohort loader (needed for a genuinely new, non-active registry row to ride the AGOL cohort path directly rather than via the Tier-1-snapshot workaround) is named as queued/open in every session record touching it; confirm its ship status before assuming a brand-new county/city in a NEW county (not sharing Bastrop's 48021 FIPS) can onboard via this exact pipeline without that loader.
8. The registry-driven single warm runner (OPS-9 S4 item, collapsing per-city hand-authored warm scripts) was not confirmed shipped; this draft's Step Z10 documents the CURRENT hand-authored-per-city state as the operative procedure.
9. The precise boundary of what "cert-path preflight probe wiring" fix (queued nit, section 1A step C6) covers, and whether it has landed, was not confirmed — the scopeAnnotation artifact on cert runs may or may not still show the spurious Rail-A-not-runnable claim.
10. Cost-gate numbers cited throughout (e.g. $14.10-14.13 sample-cohort cost, per-jurisdiction extrapolations) are sample-based estimates per the gate's own methodology, not full-cohort measured costs; treat them as directionally reliable, not exact, for a jurisdiction of substantially different parcel-count.

## PLANNER CORRECTIONS TO THE DRAFT'S OPEN ITEMS (authoritative, 2026-08-04)

The draft flagged ten OPEN items it could not settle from the records. Planner answers, from this session's live runs:

1. County cascade invocation (verbatim, planner-run 2026-08-03): `PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms Neon> pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- --county=<fips> --cascade-absence-only [--dry-run]`. Dry-run FIRST; the dry-run count must exactly predict the apply.
2. `sourceKind` is real: it lives in the ingest wire contract (ldt route onboardingLedgerIngest.ts, values `preflight` | `cert-grade` | `block13-quarantine` | `warden-sweep`; `user-flag` arrives with OPS-10), not in the OPS docs the draft searched.
3. Ledger ingest env pair: `LEDGER_INGEST_URL` (the cortex-api base URL) + `LEDGER_INGEST_KEY` (the `SERVICE_API_KEY` secret in legacy-design-tools-prod). Absent env, the report wrappers print-only, byte-identical.
4. Warden scheduling: the scheduled/periodic trigger did NOT ship — v1 is planner-run (post-cert + periodic by hand). Standing deferred item.
5. Warden checks: v1 deliberately ships 4 of 6 (neighborConsistency, servePathTruth, crossStoreConsistency, certFreshness); edition-drift and provenance-integrity are deferred by ruling, not omissions.
6. Gate env set (union, correct): `DATABASE_URL` (atoms) always; `TXGIO_DATABASE_URL` = legacy-design-tools-prod `DEPLOYMENT_DATABASE_URL` secret (txgio_parcel lives there, NOT in the hauska-prod CORTEX_DATABASE_URL Neon); `RETRIEVAL_API_URL`/`RETRIEVAL_API_KEY` for serve-path probes; `CORTEX_DATABASE_URL` only for cert grading paths that read per-parcel setback records.
7. rowId-keyed cohort loader: SHIPPED 2026-08-04 (engine #236, `loadRegistryDistrictCohortByRow`). The county/Elgin registry status flip to active remains BLOCKED until onboard-preflight.mjs and warden-sweep.mjs sample helpers migrate off the fips-keyed resolver (documented at RegistryRowStatus in jurisdiction-registry.ts).
8. Registry-driven single warm runner: NOT shipped; per-city warm scripts (bastrop/caldwell/elgin) remain the operative pattern. Queued in OPS-9 S4.
9. Cert-path preflight probe wiring: FIXED 2026-08-04 (engine #236) — the cert-path preflight now wires the same live probes as the standalone gate CLI, env-gated identically. Cert-summary row attribution also fixed same PR (`--row-id` / `--preflight-row-id` precedence; the space-separated form previously fell into a no-op parse and clobbered the city cert row in the ledger — hand-corrected same day).
10. Cost figures are gate-methodology ESTIMATES (named constants, estimate-flagged in output) — directional for differently-sized jurisdictions, never quote as measured.

