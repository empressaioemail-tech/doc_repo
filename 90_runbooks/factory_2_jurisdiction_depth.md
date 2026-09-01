---
id: factory_2_jurisdiction_depth
title: Factory 2 — County / Jurisdiction Depth Runbook (zoning, setbacks, code)
date: 2026-08-11
status: active (supersedes factory_onboarding_runbook for Factory 2 depth work; provenance and wave corrections carried forward from that doc)
owner: nick
related: [90_runbooks/factory_1_statewide_fabric, 90_runbooks/factory_1_5_acquisition_staging, 90_runbooks/factory_onboarding_runbook, 90_operations/OPS-8_blocker_free_onboarding_model, 90_operations/OPS-9_scale_ops_specs_pack, 90_operations/onboarding_defect_class_backlog, 90_operations/OPS-2_county_onboarding_runbook, 90_operations/OPS-5_cert_standard, 90_operations/OPS-7_coverage_and_honesty_doctrine, 90_operations/OPS-4_rewarm_protocol, 90_runbooks/product_surface_smoke_suite, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, _inbox/2026-08-05_T3_ingest_spec_footprints_easements, _inbox/2026-08-11_CONNECTOR_factory_seam_inventory, _dispatches/2026-08-04_elgin_pipeline_planner_handoff]
supersedes_provenance: 90_runbooks/factory_onboarding_runbook.md
---

# Factory 2 — County / Jurisdiction Depth Runbook

**Cross-links (read before Factory 2 work):**

- [Factory 1 — Statewide Fabric](factory_1_statewide_fabric.md): jurisdiction-free layers (parcel geometry, roads, flood, footprints, boundaries, terrain). Produces `txgio_parcel` and the parcel-node producer CLI.
- [Factory 1.5 — Acquisition / Staging](factory_1_5_acquisition_staging.md): find, fetch, parse, normalize, and persist source payloads with provenance into `txgio_parcel`, `txgio_address`, `cad_property`. Factory 2 cannot warm a county whose geometry never landed.

**CANON-PREAMBLE:** Cotality extinguished; deploys planner-owned; no privileged data; CTX/national HELD; code-done != customer-done.

Purpose: what a fresh planner agent needs to onboard a Texas jurisdiction end to end for **depth** (zoning, setbacks, code text, depth warm, cert) — the two pipeline lanes, the fallback and trap procedures paid for in blood this week, the ledger contract, the Warden, and the regression gate that must hold after any shared-code change. Every command below is copied verbatim from a real run record; where a record does not state a fact precisely enough to give as an instruction, this doc says OPEN and names the question rather than guessing.

This doc consolidates and **supersedes** `90_runbooks/factory_onboarding_runbook.md` for Factory 2 work. That runbook remains the provenance record for wave-1 corrections and Elgin/Bastrop pipeline history. Read `_dispatches/2026-08-04_elgin_pipeline_planner_handoff.md` OPERATING DISCIPLINE section in full before running anything — items 1 through 9 there (recon-then-review, executor boilerplate, merge gating, flake discipline, STOP-on-false-premise, verification-is-yours, record-keeping) apply to every step below and are not re-derived here except where a step needs the exact wording.

## Three-factory model (where Factory 2 sits)

| Factory | Tier | What it produces | Slot posture |
|---|---|---|---|
| **Factory 1** | Statewide fabric | Uniform layers: parcel geometry store, roads, flood, footprints, boundaries, terrain. One source blankets a state. | Fabric writes; parcel-node producer drains F1 output into atoms |
| **Factory 1.5** | Acquisition / staging | Find/fetch/parse/normalize source payloads with vintage provenance into `txgio_parcel`, `txgio_address`, `cad_property`. | Network-bound, infinitely parallel, **slot-free** |
| **Factory 2** | County / jurisdiction depth | Zoning stamps, setback tables, code corpus, zoning-fact bake, depth warm, cert. Per-jurisdiction; the moat. | Heavy-scan slot for bulk geometry writes; one bulk-writer per atoms DB |

**Prerequisites for any Factory 2 warm:** Factory 1.5 must have staged geometry for the county (`txgio_parcel` rows exist), and Factory 1 must have emitted **parcel-node atoms** for that county (`write-parcel-node-county.mjs` or sweep). **Seam:** `warm-preflight-gate.ts` (invariant S3) runs inside the unified warm runner and intersects recipe eligibility (zoning-fact exists) with parcel-node eligibility (live, resolved, account-keyed anchor). Do not warm until both legs are present.

## 0. Prerequisites — read before touching anything

1. **Upstream factories:** [Factory 1](factory_1_statewide_fabric.md) parcel-node step complete for target county FIPS; [Factory 1.5](factory_1_5_acquisition_staging.md) geometry staged in `txgio_parcel`. Verify with store truth (section below), not sweep logs.
2. `90_operations/OPS-8_blocker_free_onboarding_model.md` — the pre-flight gate model (8 checks, run-what-passes, dual ledger).
3. `90_operations/onboarding_defect_class_backlog.md` — current class register; check whether the defect you are about to hit already has a CLEARED fix.
4. `90_operations/OPS-2_county_onboarding_runbook.md`, `OPS-5_cert_standard.md`, `OPS-7_coverage_and_honesty_doctrine.md`, `OPS-4_rewarm_protocol.md` — the mechanical line, the cert law, the honesty doctrine, the rewarm mechanism this pipeline sits on top of.
5. `00_current_state.md` top two entries, and the most recent `_sessions/` files for the jurisdiction you are about to touch.
6. Credentials (per the handoff dispatch, item 8): engine/atoms DB via `gcloud secrets versions access latest --secret=DATABASE_URL` (and `CORTEX_DATABASE_URL`) `--project hauska-prod-497015`; ldt/txgio DB via `--secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod`; retrieval-api key by reading `RETRIEVAL_API_KEY` from the `hauska-retrieval-api` Cloud Run service env (project `hauska-prod-497015`), base URL `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`. Warden env contract (learned 2026-08-04, `_sessions/2026-08-04_ops9_wave_execution_claude_code.md`): `DATABASE_URL` = atoms Neon; `TXGIO_DATABASE_URL` = the ldt deployment Neon (`txgio_parcel`); retrieval pair for serve-path.

## STORE-TRUTH PRINCIPLE (permanence, T1 WS1 2026-08-06)

**Any cohort operation sizes from the authoritative store at execution time, never from a process's account of its own work.**

Warm apply logs, promote counters, and dry-run summaries are process memory — useful for parity checks at a pinned engineSha, but not roster authority. The atoms store (and txgio where geometry lives) is truth for: who is promoted, who needs re-persist, who carries stale boundary primitives, heavy-scan slot sizing, **and whether parcel-node anchors exist for the county**.

Same failure species as the cert-vs-serve promote-persist gap: trusting process memory over store truth produces cert-pass / serve-fail drift and under-sized re-warm cohorts. Before every cohort re-persist, re-query the store immediately before dry-run and apply; record **both counts** in the artifact pair.

Example (T1 WS1): Bastrop apply reported 2,015 promoted; Elgin re-warm reported 91/91 parity; store query found **~4,003** promoted envelopes needing boundary-edge re-persist. Checkpoint: `_inbox/2026-08-06_T1_cohort_repersist_roster_checkpoint.md`.

**Parcel-node store-truth probe (run before any depth warm):**

```sql
-- On DATABASE_URL (atoms / hauska_mcp):
SELECT count(*) AS parcel_nodes,
       count(DISTINCT body->>'countyFips') AS counties_with_nodes
FROM atoms
WHERE entity_type = 'parcel-node';

-- Per target county:
SELECT count(*) AS parcel_nodes_in_county
FROM atoms
WHERE entity_type = 'parcel-node'
  AND body->>'countyFips' = '<fips>';
```

```sql
-- On TXGIO_DATABASE_URL (txgio_parcel):
SELECT count(DISTINCT county_fips) AS counties_with_geometry
FROM txgio_parcel;
```

If geometry exists but parcel-node count for the county is zero, stop and run Factory 1 producer (`write-parcel-node-county.mjs`) before Factory 2 warm. Missing geometry is a Factory 1.5 backlog item, not a warm-path bug.

## 1. THE PIPELINE

Two lanes. A jurisdiction is either an UNZONED COUNTY (breadth bake already exists or is cheap; the win is honest-absence at scale) or a ZONED CITY (needs source wiring, a stamp, and a ratified setback table before anything can warm). Determine which lane before starting — the county lane has no table-ratification gate, the city lane does.

### 1A. UNZONED COUNTY LANE

Proven once, end to end, on Bastrop County (unincorporated), fips 48021, 2026-08-03 (`_sessions/2026-08-03_county_onboarded_claude_code.md`, `90_operations/onboarding_defect_class_backlog.md` "COUNTY ONBOARDED" entry).

**Step C1 — Recon (read-only).** Before running anything: confirm whether the zoning honest-absence layer already exists for this cohort (Bastrop County's was minted 2026-07-24 via the breadth-bake ledger, PR #104, independent of this pipeline). Confirm terrain/flood are already live as per-parcel serve-time rails (city-agnostic, nothing to batch — true for Bastrop County, verify per new county). Confirm whether the AGOL cohort loader can address this county's registry row: as of 2026-08-03/04 `loadJurisdictionRegistryRow` is FIPS-keyed and returns only the active row (documented in `registry-cohort.test.ts`) — a genuinely new county row cannot ride the cohort loader path until the rowId-keyed loader lands (OPS-9 S4 item, **SHIPPED** 2026-08-04 engine #236 `loadRegistryDistrictCohortByRow`). Confirm **parcel-node atoms** exist for the county (Factory 1 prerequisite; section 0 store-truth probe).

**Step C2 — Contract-shape STOP check.** The atom contract gives `setback-rule` REQUIRED numeric dimensions with no true absence shape. NEVER mint a `setback-rule` "decline" by fabricating front/side/rear numbers. The ruled pattern (planner ruling, 2026-08-03): mint ONLY `buildable-envelope` declines using the R27 persisted warm-verify-decline precedent, with the code `unzoned-no-district-basis`. The chain reads: zoning-fact (named absence) → setback slot legitimately empty → envelope (named decline). An executor that stops here rather than inventing a decline shape is behaving correctly (STOP-on-false-premise, dispatch item 6) — make this ruling yourself if a fresh county needs it, do not improvise a new absence shape without a planner ruling.

**Step C3 — Breadth/absence cascade.** The engine's cascade builder runs off honest-decline-promote, `--cascade-absence-only` bake mode with keyset pagination and query-level city exclusion (Bastrop County shipped this in engine PR #222, `gradeUnzonedParcel` + `--grade-mode=unzoned` cert branch). Dry-run first; the dry-run count must be exactly explainable and must match the apply count (Bastrop: dry-run predicted 56,488; apply scanned 62,260, cascaded 56,488, zero errors, ~17 minutes). Verbatim invocation (planner-run 2026-08-03): `PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms Neon> pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- --county=<fips> --cascade-absence-only [--dry-run]`. Dry-run FIRST; the dry-run count must exactly predict the apply.

**Step C4 — Live post-verification.** Confirm via SQL: total envelopes = untouched city-cohort count + new unzoned-decline count. Bastrop: 62,220 total = 5,732 city cohort (untouched) + 56,488 unzoned declines carrying the honest reason string.

**Step C5 — Gate.** Run the pre-flight gate (same tool as the city lane, see step Z-GATE below) — this is what "earns the right to run" per OPS-8. An unzoned county's `zoningSourceReachableOrUnzoned` check is expected to PASS via the unzoned-regime branch ("unzoned regime — zoning/setback honest-absence is the expected pass state") — this is a PASS, not a decline; treat it as the doctrine working, never as a gap.

**Step C6 — Cert (unzoned mode).** `--grade-mode=unzoned` cert branch (per PR #222). Bastrop County: 20/20 PASS, every sampled parcel a genuine honest-decline with a resolving cadastral ring, `blockPass: true` (`_inbox/2026-08-03_county_cert_20of20.json`). KNOWN TOOLING ARTIFACT (record, do not treat as a real fail): the cert script's internal preflight lacked the HTTP probe wiring the standalone gate CLI has, so the cert artifact may carry a spurious `scopeAnnotation` claiming Rail A "not runnable" even when the authoritative full-gate artifact shows Rail A PASS. **FIXED 2026-08-04** (engine #236) — cert-path preflight now wires the same live probes as the standalone gate CLI.

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

**Step Z-PN — Parcel-node prerequisite (Factory 1 seam, BEFORE depth warm).**

This step closes the Factory 1 → Factory 2 handoff. Depth warm MUST NOT run until parcel-node anchors exist for every parcel in the warm cohort.

1. **Store-truth verify** (section 0 probes): target county has `txgio_parcel` rows AND non-zero `parcel-node` atoms with matching `countyFips`.
2. **If missing:** run Factory 1 producer (see [Factory 1 runbook](factory_1_statewide_fabric.md)):

```
PARCEL_NODE_PATH=1 TXGIO_DATABASE_URL=<ldt deployment Neon> DATABASE_URL=<atoms Neon> \
  pnpm --filter @hauska-engine/engine-core run write-parcel-node-county -- \
    --county=<fips> [--apply] [--batch=5000] [--limit=0] [--out=path.json]
```

3. **Seam consumer:** `warm-preflight-gate.ts` enforces **invariant S3** — warm set = INTERSECTION(recipe eligibility, parcel-node eligibility). Six named decline codes; `assertWarmGateApplied` fail-closes if any parcel reaches compute without a verdict. The gate fires **inside** the unified warm runner only (`depth-warm-city-batch.mjs`); it is not a separate CLI invocation.
4. **Preflight event:** batch JSON MUST emit `depth-warm.parcel-node-preflight` with `recipeCohort`, `anchorsFound`, `warmEligible`, `declinesByCode`. File in apply artifact; `warmEligible` must reconcile arithmetically with downstream verify counts.

ABORT: if anchors are missing for a material fraction of the zoning-fact cohort, stop and drain Factory 1 — do not bypass with legacy per-city warm scripts (they do not call the gate).

**Step Z10 — Depth warm + cert (GATED unified runner only).**

**SHIPPED 2026-08-09 (engine #287):** registry-driven unified warm runner `depth-warm-city-batch.mjs`. Per-city scripts (`depth-warm-bastrop-batch.mjs`, `depth-warm-elgin-batch.mjs`, `depth-warm-caldwell-batch.mjs`) are **RETIRED stubs** — they exit 2 if invoked. Do not document or run them.

OPERATE-NOT-REBUILD: the unified runner reuses `warmThenVerify`, `promoteHonestVerifyDecline`, `cert-grade-core.ts`, and **`gateWarmCohort`** from `warm-preflight-gate.ts`. Do not build parallel machinery. **`bastrop-district-cert-grade.mjs` is a retired fork** beside the proven `block13-cert-grade.mjs` — never revive it; cert always goes through `block13-cert-grade.mjs` / `cert-grade-and-report`.

**Registry row ids (proven cohorts):**

| City | Registry row id (`--row-id=`) | County FIPS |
|---|---|---|
| Bastrop (city) | `Bastrop` | 48021 |
| Elgin | `Elgin` | 48021 |
| Lockhart (Caldwell city) | `Lockhart` | 48055 |

**City re-warm discipline (T1 catch-up permanence, Bastrop proving run 2026-08-05):** every city-cohort re-warm that fixes stored envelope geometry MUST use `--force-overwrite` so R28 (ring recompute) and R30 (fresh road relabel + situs fallback) run at warm time — not only at export time. Dry-run first. Record wall time and batch size for incremental-rewarm planning. Area-sweep cert the lead exhibit block plus two contiguous blocks (full roster, never sample). block13 7/7 before and after.

**Dry/apply parity (write-then-verify era, 2026-08-08 amendment):** depth-warm dry-run **cannot** read back stored bytes, so dry `verifyPass` counts compute + mechanical verify only. Apply `promoted` counts writes that **survived read-back** (`promoteDepthWarmToStorage` write-then-verify + ground-truth gate). Extended parity equation:

```
dryRun.verifyPass == apply.promoted + apply.computePassNotPersisted + apply.skippedIdempotent
```

where `computePassNotPersisted` = parcels that passed mechanical verify on dry but did not appear in `apply.promoted` (read-back refused, pre-write ground-truth refused, or compute outcome changed on apply leg). Batch JSON **SHOULD** emit `computePassNotPersisted`, `writeThenVerifyRefused`, `promoteGateRefused`, and `skippedIdempotent` explicitly (today only `promoted`, `verifyPass`, `verifyFail`, `honestDeclines`, `declines.other`). Headline exact-match gate is **`dryRun.verifyPass == apply.promoted + apply.computePassNotPersisted`** with skipped/idempotent named and zero unless documented. Plain-geometry post-verify MUST use the saga closing method (envelope-edge midpoint → nearest txgio parcel edge, **single shared parcel projection frame** via `projectRing` + `projectRingInFrame`) — never block13 R32 cert-grade as a substitute.

**Verbatim GATED warm command (all zoned cities — substitute `--row-id`):**

```
PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms> TXGIO_DATABASE_URL=<neondb> NODE_OPTIONS=--use-system-ca \
  pnpm --filter @hauska-engine/engine-core run depth-warm-city-batch -- \
    --row-id=<RegistryRowId> --city-cohort --force-overwrite --promote --limit=10000 [--dry-run]
```

Examples:

```
# Bastrop city cohort
... --row-id=Bastrop --city-cohort --force-overwrite --promote --limit=10000 --dry-run

# Elgin city cohort
... --row-id=Elgin --city-cohort --force-overwrite --promote --limit=10000 --dry-run

# Lockhart (Caldwell city)
... --row-id=Lockhart --city-cohort --force-overwrite --promote --limit=10000 --dry-run
```

Optional: `[--upsert-ledger]` on apply leg when ledger POST is wired. Record full 40-char `engineSha` in dry and apply artifact pairs (identical-engine-SHA rule).

FALLBACK — no-road-adjacency spike: Elgin's first warm pilot returned 49/50 `no-road-adjacency` declines. Diagnosis before assuming a bug: check whether the city's OSM road data actually exists in the loaded road-node set, and whether local streets are tagged in a way the warm path treats as "undefined" (Elgin's streets were almost entirely `county-roadway-undefined`, filtered from the warm pool by design; nearest convertible road was ~600m away). FIX: OSM ingest for the city's bbox (Elgin: engine PR #228, prod ingest of 2,356 ways) BEFORE re-attempting the warm, not a warm-path code change.

Full-cohort warm outcome shape (Elgin, city-cohort, 3,762 processed): promoted 1,886 / verifyFail 1,564 / no-road-adjacency 57 / no-setback-row 255, cost under gate. Every non-promoted parcel must land in a NAMED decline bucket — zero bare "pending."

**REQUIRED regression check before cert:** re-run the existing certified city/block's cert (see section 5, Bastrop block-13 7/7) immediately after any warm run that touches shared code paths. Elgin's warm path shared code with Bastrop's; the re-run confirmed Bastrop block-13 STILL 7/7 (`_inbox/2026-08-04_bastrop_block13_post_elgin_warm_path.json`).

Cert command shape (per the handoff dispatch step 4, and confirmed by the actual roster-from-file run captured in `_inbox/2026-08-04_elgin_cert_stratified.json`): `block13-cert-grade.mjs` default grade mode, `--roster-from=file` pointing at a roster text file (e.g. `_inbox/2026-08-04_elgin_cert_roster_stratified.txt`), plus `--preflight-row-id "<RowName>"` so scopeAnnotations attribute correctly. Elgin's descriptor-answer-key cert on a promoted sample came back 2/10 — NOT CERT-RESTORE yet — with three named residual defect classes, not a blanket failure:
- frontOrientation token mismatch (OSM road-name abbreviations vs CAD situs abbreviations: Avenue/AVE, SH/State Highway, FM/Farm-to-Market — a normalization gap, not a data error).
- served rear 0 vs descriptor 10 on some rows (a `not_specified`/emit-path bug).
- occasional per-edge role/index mismatch.

These are queued as the `ELGIN-CERT-RESIDUAL` defect class (see section 3 class register) — they do NOT block seeding the ledger with the honest partial state; they DO block calling Elgin's cert "CERT-RESTORE ELIGIBLE" until fixed and re-run.

**Step Z11 — Close.** Session record, `00_current_state.md` top entry, all run artifacts copied to `_inbox/`, defect-class backlog updated (including REASON-OVERSTATES status after the Z8 supersede verification), commit and push doc_repo.

### 1C. FOOTPRINT + EASEMENT RAILS (both lanes, permanent)

Added 2026-08-05 (T3 Workstream 4). Every jurisdiction — unzoned county (1A) or zoned city (1B) — carries these two site-layer rails by default. Contract shapes: `building-footprint` and `utility-easement` per `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md`. Full ingest spec: `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`. Evidence: `_inbox/2026-08-05_T3_footprint_source_recon.md`, `_inbox/2026-08-05_T3_easement_source_recon.md`.

**Permanence rule:** future counties inherit this section without a separate dispatch. No Texas-wide re-comb after Phase 2 backfill. Registry row MUST freeze footprint + easement fields before any site-layer apply.

**Registry row fields (freeze-time, adversarial review):**

| Field | Purpose |
|---|---|
| `footprintSourceUrl` | REST layer, bulk download, or ML dataset pointer |
| `footprintSourceTier` | `cad-authoritative` \| `city-gis-authoritative` \| `ml-derived` \| `absent` |
| `footprintAdapterKind` | Adapter routing key (see ingest spec section 3.1) |
| `easementSourceUrl` | FeatureServer URL or null when absent |
| `easementSourceTier` | `plat-gis-authoritative` \| `county-gis` \| `record-extracted` \| `absent` |
| `easementAdapterKind` | Adapter routing key (see ingest spec section 3.2) |

Optional but recommended when probe finds them: `footprintLayerId`, `footprintJoinField`, `footprintMlPartition`, `easementLayerIds`, `easementScope`, `easementCorridorDefaultWidthFt`, `footprintProvenanceScope`, `easementProvenanceScope`, `utilityAdjacentUrls`, `siteLayerRecipeVersion`. Full schema proposal in ingest spec section 9.

**Step FE1 — Source recon + four-point probe (read-only).** Before freezing the row: run the four-point live probe per rail per `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md` section 2 — (1) layer list, (2) fields + casing, (3) roster-parcel query, (4) feature count. File probe JSON to `_inbox/<date>_footprint_easement_probe_<fips>.json`. Routing precedence for footprints: CAD REST > bulk export > city GIS > Microsoft Global ML > honest-absence. For easements: CAD/county easement REST > municipal easement (city-scoped row only) > honest-absence. **Never** mint `utility-easement` atoms from utility-adjacent layers (pipelines, CCN, MUD) — record those URLs in `utilityAdjacentUrls` only.

**Current cohort default (2026-08-05 recon):** 0/11 onboarded counties have CAD-authoritative footprint REST; default `footprintAdapterKind: ml-global-building-footprints`, `footprintSourceTier: ml-derived`. Easements: McLennan (48309) = `cad-easement-rest`; City of Bastrop municipal easements = separate city row with `easementScope: municipal-etj`; all other breadth counties = `easementAdapterKind: honest-absence` at county level.

**Step FE2 — Freeze registry row.** Author + adversarially review the footprint/easement fields on the jurisdiction registry row (OPS-1 schema + ingest spec section 9). Fail-closed: if ML fallback is required, `footprintSourceTier: ml-derived` MUST be declared explicitly — never silent fill. Municipal easements MUST NOT ride a county row as county coverage. Merge engine registry row; record `siteLayerRecipeVersion` and `footprintEasementFrozenAt`.

**Step FE3 — Dry-run ingest.** Reserve the **heavy-scan slot** through the master planner before prod apply when the footprint adapter reads bulk ML geometry or large easement linework (see ingest spec section 8; T1 owns the slot; light honest-absence-only sentinel ingests are exempt). Run site-layer ingest dry-run:

```
pnpm --filter @hauska-engine/engine-core run ingest-site-layers \
  -- --county=<fips> [--row-id=<registryRowId>] --rails=footprint,easement --dry-run
```

OPEN: exact script name until adapter lands — grep engine for `site-layer` or T3 dispatch branch; the dry-run JSON event shape in the ingest spec is the acceptance contract. Dry-run totals MUST be explainable (footprints joined, absent sentinels, orphan rejects, easement intersects).

**Step FE4 — Apply (slot reserved).** Apply only when dry-run/apply counts will match exactly and `emitErrors = 0`. Same command without `--dry-run`. ABORT if cost gate flags over $200 sample estimate without planner ruling. File `_inbox/<date>_site_layer_ingest_<fips>_apply.json`.

**Step FE5 — Regression gate.** BEFORE cert: re-run Bastrop block-13 7/7 if shared adapter code was touched (section 5). After apply: block-13 again + product-surface smoke when serve path touched.

**Step FE6 — Warden check.** Post-cert Warden sweep with cert artifact supplied:

```
pnpm run warden-sweep -- --fips=<fips> --cert-artifact=_inbox/<cert>.json
```

Warden files, never fixes. Site-layer-specific Warden checks are queued; v1 uses the four shipped checks plus manual review of `sourceVintage` on cert artifact.

**Step FE7 — Cert check (site-layer extensions).** Every cert roster parcel MUST have `building-footprint` present OR `sourceTier: absent` sentinel; same for `utility-easement`. ML footprints MUST carry honest tier chips (never presented as CAD). Bastrop pilot: cert Jones/Higgins block with footprint + envelope on one sheet (pairs with T1 re-warm). File cert JSON; POST ledger (`LEDGER_INGEST_URL` + `LEDGER_INGEST_KEY`, `sourceKind` per ingest wrapper).

**Placement in pipeline:** FE1–FE2 run during registry authoring (OPS-2 Stage 0, parallel to Steps C1/Z1–Z2). FE3–FE4 run after Rail C parcel spine is live and row is frozen — typically after Step C3 (county) or Z8 (city zoning-fact bake), before or alongside Step Z-PN / Z10 depth warm. FE5–FE7 close with the jurisdiction's cert cycle (Steps C6–C7 or Z10–Z11).

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

**Identical engine SHA (binding, T1 catch-up permanence 2026-08-05):** a dry-run and its paired apply MUST execute on the **identical engine git SHA**. Record `engineSha` (full 40-char commit) in both artifact JSON summaries. If any merge lands between dry-run and apply (edge-labeling, cert-grade, warm-path gates), the pair is **VOID** — re-run both legs pinned to the apply SHA before any prod write. T1 WS1 observed a 389 promoted-count delta when #256/#258 landed between dry-run (~90dea02) and apply (#260 `6f940d2`); treat as code drift until a pinned pair reproduces.

### Operate-not-rebuild
When a per-city or per-county mechanism already exists and works (cert-grade machinery, the cascade builder, the **unified** warm runner), REUSE it — parameterize or extend, do not build a parallel implementation. OPS-9 S4's registry-parameterized warm runner **SHIPPED** as `depth-warm-city-batch.mjs` (engine #287, 2026-08-09); the per-city scripts it replaced are retired stubs. **`bastrop-district-cert-grade.mjs` is the canonical anti-pattern:** a prior fleet forked it beside proven `block13-cert-grade.mjs` and debugged its own machinery through three STOP cycles — never repeat that. A standing MEMORY.md item (`FLEET-L3-GAP`) records a prior failure where a fleet rebuilt new wrappers instead of running an existing proven path — this is the corrective discipline for that failure class.

### Ungated warm path (CRITICAL — do not bypass invariant S3)
Invoking `depth-warm-bastrop-batch.mjs`, `depth-warm-elgin-batch.mjs`, or `depth-warm-caldwell-batch.mjs` bypasses `gateWarmCohort` entirely. Those scripts are retired (exit 2). The **only** supported warm path is `depth-warm-city-batch.mjs` with `--row-id=<RegistryRowId>`, which calls `warm-preflight-gate.ts` before compute.

## 3. LEDGER & TRACKING

### What POSTs, and when

Three kinds of runs write to the ledger, per the OPS-8 dual-ledger model and the OPS-9 S1 implementation (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`):

1. **Preflight-and-report** — every gate run (section "THE GATE" above) posts its per-row, per-check verdicts, including declines with `defectClass`.
2. **Cert-grade-and-report --with-quarantine** — every cert run posts its pass/fail verdict per parcel, the roster used, and any quarantined parcels (Bastrop's known quarantine: the 7 Block-13 parcels) as explicit data rather than a hardcoded exclusion list. The OPS-9 S1 acceptance criterion explicitly named surfacing "the block-13 quarantine set (today hardcoded in the cert script)" as data.
3. **Warden-sweep** — every Warden run (section 4) posts its findings as ledger events, same event shape, never a fix.

### The sourceKind contract

`sourceKind` lives in the ingest wire contract (ldt route `onboardingLedgerIngest.ts`, values `preflight` | `cert-grade` | `block13-quarantine` | `warden-sweep`; `user-flag` arrives with OPS-10). Nearest documented grouping key in OPS docs: `defectClass`.

### Where it renders

CC (Command Center) County Ledger v2, Vercel project `cmdcenter` (NOT `command-center`/jade — see MEMORY.md `cc-deploy-cmdcenter-blush-not-command-center-jade`). Per OPS-9 S1, the row model is REGISTRY ROWS (not counties): each jurisdiction row nests under a county header with name + fips; columns are gate verdict (8 checks, PASS/decline chips with named reasons), cert (label, date, scopeAnnotations count), per-rail coverage with a correct percent-math denominator, open defect classes, focused-fix parcel count (expandable), and source vintages/staleness flags. As of the OPS-9 wave close this shipped and was verified live: "cmdcenter LIVE with the v2 County Ledger (bundle index-DE1wozNI, honest 'no gate run recorded' replacing the misleading UNCERTED default)."

### Backing store

Per the OPS-9 wave session's "Ledger store ruling": ONE reading surface, the cortex Neon database. `onboarding_ledger_event` is a superset schema carrying preflight, cert, quarantine, and Warden events together. `jurisdiction_registry_row_mirror` holds the roster (mirrors the engine's registry rows). `county_gate_cert_state` holds the gate/cert summary state per row. The Warden writes through the SAME ingest endpoint as preflight/cert — there is no separate engine-side findings table.

### The rule

Every run's raw artifact lands in `_inbox/` AND the ledger POST happens in the same close — the file is the durable/auditable record, the POST is what makes it visible in CC. Neither substitutes for the other. Naming convention observed across every artifact read for this draft: `_inbox/<YYYY-MM-DD>_<jurisdiction-or-topic>_<step-or-type>.{json,md,log,txt}`.

### Ingest endpoint / env pair

`LEDGER_INGEST_URL` (cortex-api base URL) + `LEDGER_INGEST_KEY` (`SERVICE_API_KEY` secret in legacy-design-tools-prod). Absent env, the report wrappers print-only, byte-identical. Concrete values: `LEDGER_INGEST_URL` = `gcloud run services describe cortex-api --project legacy-design-tools-prod --region us-central1 --format 'value(status.url)'`; `LEDGER_INGEST_KEY` = `gcloud secrets versions access latest --secret SERVICE_API_KEY --project legacy-design-tools-prod` (trim trailing newline).

## 4. THE WARDEN

Per OPS-9 S5 (spec) and its 2026-08-04 execution (`_sessions/2026-08-04_ops9_wave_execution_claude_code.md`).

### When it runs

Event-triggered: after a jurisdiction's cert lands. Scheduled: a rolling re-sweep of already-onboarded jurisdictions. (The scheduler/cron wiring itself was not confirmed as shipped in any record read for this draft — the shipped artifact is the sweep module and its first accepted run; treat the periodic-trigger half as OPEN unless verified against live code.)

### Env contract

`DATABASE_URL` = atoms Neon. `TXGIO_DATABASE_URL` = the ldt deployment Neon (holds `txgio_parcel`). Retrieval pair (same as the gate's serve-path probe) for serve-path checks. This contract was LEARNED during the first live sweep (engine PR #232 fixed a txgio connection wiring bug found by that first sweep) and is now documented into the CLI per the session record.

### Checks (as shipped, v1.1 + v1.2 envelope-sanity — T1 catch-up 2026-08-05)

Confirmed live: `neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`, **`envelopeSanity`** (v1.2, engine #256), **`serveTruthEdgeLabels`** (v1.3, T1 WS1 — ships with promote Option A fix).

**v1.3 `serveTruthEdgeLabels`** (read-only, files-never-fixes): for each sampled promoted parcel, compare cert-path fresh `labelEdgesFromRoads` roles at each edgeIndex vs export-served roles after `prepareBoundaryEdgesForExport`. Flag when cert front edgeIndex != served front edgeIndex or any cert-graded edgeIndex role mismatches. defectClass: `CERT-VS-SERVE-EDGE-MISMATCH`. **Required for WS1 close** on operator twelve (12/12) and post-cert sweeps on zoned cities. Dispatch: `_dispatches/2026-08-06_T1_warden_v13_serve_truth.md`.

**v1.2 `envelopeSanity`** (read-only, files-never-fixes): for each sampled parcel with a promoted buildable-envelope, assert (1) envelope vertices inside txgio parcel ring, (2) envelope area / parcel area within district regime bounds (SF-1 default 0.30–0.95; sliver <0.05 or full-lot ≥0.995 flagged), (3) each envelope edge parallel to a lot edge within 12°. defectClass: `ENVELOPE-SHAPE-ANOMALY`. Honest warm-verify declines produce no flag. **Always include in post-cert sweeps** for zoned cities; supply `--cert-artifact` for certFreshness diff.

The OPS-9 S5 spec additionally named `edition drift` and `provenance integrity` as intended checks — these remain deferred (not omissions).

`neighborConsistency` finding shape (from the accepted sweep artifact): `defectClass: MIXED-VINTAGE-NEIGHBOR`, `evidence: {parcel: {parcelNodeId, district}, districtedFraction, thresholdFraction: 0.75, neighbors: [...]}`, `severity: "flag"`. A parcel flags when its own district is null/stale AND a high fraction (over the 0.75 threshold) of its geographic neighbors carry a current district — this is the "P-5 next to fixed SF-1" class made mechanical. `crossStoreConsistency` and `certFreshness` both returned `severity: "info"` with `defectClass: MEASURE-EMPTY-COHORT` in this run because no `--cert-artifact` was supplied (a grade-only run, not a diff-against-prior-verdict run) — supply `--cert-artifact` on future runs to get the real diff behavior these two checks are meant to provide.

Bastrop's first accepted sweep: 50 unique flagged parcels, all `neighborConsistency`, breaking down as 27 on repealed legacy-P codes (including the six P-5 watch parcels already known from the code-refs backfill) and roughly 23 patchy-absence parcels inside the districted cohort. Zero false flags on legitimate district boundaries. Serve-path clean after a calibration fix (engine PR #234: the serve-path comparator had been matching wrong wire field names, so served envelopes could never be observed present until fixed).

### Files-never-fixes (critical constraint)

The Warden FILES, it never fixes. Findings write to the focused-fix ledger / defect-class backlog as events with evidence; fixes go through the normal gated pipeline (recon-then-review, executor dispatch, planner merge). No auto-remediation, ever. This is enforced structurally — engine PR #229 shipped with "a structural import-guard test" specifically to keep the Warden from acquiring write/fix capability by accident in a future change.

### How findings route

Same event stream as preflight/cert (`onboarding_ledger_event`, same schema, same ingest endpoint) — the CC surfaces Warden status per jurisdiction (last sweep timestamp, findings open count). A finding becomes a defect-class backlog row exactly like a preflight decline does; class-fix-and-rewarm closes it the same way.

## 5. REGRESSION PROTECTION

### Bastrop block-13 7/7 — the standing acceptance gate

Any change to shared warm/cert code MUST be followed by a re-run of the Bastrop block-13 cert, and it must still return 7/7 CERT-RESTORE ELIGIBLE. This is not optional and not scoped to "changes that look related" — Elgin's pipeline shared code paths with Bastrop's (warm machinery, cert-grade-core) and the discipline was applied literally: after Elgin's full warm run, Bastrop block-13 was re-run and confirmed still 7/7 (`_inbox/2026-08-04_bastrop_block13_post_elgin_warm_path.json`, roster size 7, `blockPass: true`, `certRestore: "7/7 — CERT-RESTORE ELIGIBLE"`). It was checked again after the Bastrop city code-refs backfill (`_inbox/2026-08-03_cert_post_refs_backfill_7of7.log`) and again after the cert-script refactor (`_inbox/2026-08-03_block13_cert_post_refactor.log`). Treat "re-run block-13, confirm 7/7" as a mandatory step appended to every shared-code-touching pipeline stage, not a periodic nice-to-have.

After shared warm/cert or PE/engine/retrieval serve-path changes, also run the product-surface smoke suite (`90_runbooks/product_surface_smoke_suite.md`, script `scripts/product-surface-smoke.mjs`): live GET probes for PE/engine/retrieval health, card-vs-sheet setback consistency on three Bastrop parcels, envelope sanity, and `/search`. Block-13 proves the cert instrument; the smoke suite proves the customer surface still serves coherent setbacks and envelopes.

Verbatim roster/measurer identity captured in the artifact, useful for confirming a re-run used the correct proven configuration: `rosterFrom: "block13"`, `rosterSource: "BLOCK13 constant"`, `measurer: "R32 index-matched inward-normal (measurePerEdgeInsetForRings)"`, `orientationGate: "fresh labelEdgesFromRoads front-edge road-name token-match (R33 normalization)"`, `roadNodesLoaded: 13987`.

### Drift-pin tests

OPS-4's rewarm protocol names `recipe_version` as the mechanism that makes "which jurisdictions need rewarming" computable, and the county-code-refs backfill (engine #223) shipped with "a drift-pin test tying the script's table to the TS map" — a test that fails if the hardcoded backfill table and the live TypeScript district map diverge. Apply the same pattern (a test pinning a script's assumed data shape to the live source of truth) to any future hand-authored backfill or per-city script, since this class of silent-mismatch bug (the `descriptorForCounty` key-mismatch that would have silently no-opped a whole re-bake) has already bitten once.

### Cert-freshness sweeps

Per OPS-5, a jurisdiction's cert is STALE when its recipe-version is behind the current one — rewarm and re-cert are needed. The Warden's `certFreshness` check (section 4) is the automated form of this, but as noted above it needs `--cert-artifact` supplied to do the real diff-against-prior-verdict comparison; without it, it only reports that it has nothing to compare against. A fresh planner should supply the most recent cert artifact explicitly on every Warden invocation intended to catch drift, not rely on the check firing usefully by default.

## OPEN ITEMS SUMMARY (see inline OPEN markers above for full context)

1. Mega-county cascade sharding procedure is documented (section CASCADE KEYSPACE SHARDING); verify engine flags against live script before first sharded apply on a new mega-county.
2. `sourceKind` — **SETTLED:** real field in ingest wire contract (see section 3).
3. Ledger ingest env pair — **SETTLED:** `LEDGER_INGEST_URL` + `LEDGER_INGEST_KEY` (see section 3).
4. Whether the Warden's periodic/scheduled trigger (cron or routine) has actually shipped, versus only the event-triggered post-cert sweep, is unconfirmed — only one sweep run (Bastrop, cert-triggered) was found in the record.
5. Whether the Warden's `edition drift` and `provenance integrity` checks (named in the OPS-9 S5 spec) have shipped is unconfirmed — v1 deliberately ships 4 of 6; edition-drift and provenance-integrity deferred by ruling.
6. Gate env set (union, correct): `DATABASE_URL` (atoms) always; `TXGIO_DATABASE_URL` = legacy-design-tools-prod `DEPLOYMENT_DATABASE_URL` secret; `RETRIEVAL_API_URL`/`RETRIEVAL_API_KEY` for serve-path probes; `CORTEX_DATABASE_URL` for cert grading paths that read per-parcel setback records. Authoritative store topology: `90_operations/OPS-13_store_topology.md`.
7. rowId-keyed cohort loader: **SHIPPED** 2026-08-04 (engine #236, `loadRegistryDistrictCohortByRow`). County/Elgin registry status flip to active remains BLOCKED until onboard-preflight.mjs and warden-sweep.mjs sample helpers migrate off the fips-keyed resolver.
8. Registry-driven single warm runner: **SHIPPED** 2026-08-09 (engine #287, `depth-warm-city-batch.mjs`). Per-city warm scripts (`depth-warm-bastrop-batch.mjs`, `depth-warm-elgin-batch.mjs`, `depth-warm-caldwell-batch.mjs`) are retired stubs exiting 2. Step Z10 documents the gated unified runner only.
9. Cert-path preflight probe wiring: **FIXED** 2026-08-04 (engine #236).
10. Cost figures are gate-methodology ESTIMATES — directional for differently-sized jurisdictions, never quote as measured.

## PLANNER CORRECTIONS (authoritative, carried forward from factory_onboarding_runbook)

The superseded runbook flagged ten OPEN items. Planner answers from live runs (updated 2026-08-11 for Factory 2 retier):

1. County cascade invocation (verbatim): `PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms Neon> pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- --county=<fips> --cascade-absence-only [--dry-run]`. Dry-run FIRST; the dry-run count must exactly predict the apply.
2. `sourceKind` is real: ingest wire contract values `preflight` | `cert-grade` | `block13-quarantine` | `warden-sweep`.
3. Ledger ingest env pair: `LEDGER_INGEST_URL` + `LEDGER_INGEST_KEY`.
4. Warden scheduling: the scheduled/periodic trigger did NOT ship — v1 is planner-run (post-cert + periodic by hand). Standing deferred item.
5. Warden checks: v1 deliberately ships 4 of 6 core checks plus v1.2/v1.3 envelope extensions; edition-drift and provenance-integrity are deferred by ruling, not omissions.
6. **CORRECTION 2026-08-09:** `CORTEX_DATABASE_URL` (project hauska-prod-497015) and `DEPLOYMENT_DATABASE_URL` (project legacy-design-tools-prod) are BYTE-IDENTICAL (md5 verified). Both resolve to database `neondb`; `txgio_parcel` lives in BOTH names. The ONLY real store split is `DATABASE_URL` = database `hauska_mcp` (atoms). Authoritative detail: `90_operations/OPS-13_store_topology.md`.
7. rowId-keyed cohort loader: SHIPPED 2026-08-04 (engine #236).
8. Registry-driven single warm runner: **SHIPPED** 2026-08-09 (engine #287). Unified runner `depth-warm-city-batch.mjs` is the only gated warm path; legacy per-city scripts retired.
9. Cert-path preflight probe wiring: FIXED 2026-08-04 (engine #236).
10. Cost figures are gate-methodology ESTIMATES — directional, never quote as measured.

## WAVE-1 ADDENDUM (authoritative corrections from the first two-county fan, 2026-08-04)

Learned running Guadalupe (48187, certified 20/20 first pass) and Caldwell (48055, certified 20/20 after two stacked defect fixes). These amend the cert-lane procedure above.

1. **`--preflight-row-id` drives URL threading; `--row-id` is attribution only.** The unzoned cert grader resolves `cadastralQueryUrl` from the registry row named by `--preflight-row-id`. Invoking with only `--row-id` produces `cadastral-query-url-not-configured` on every parcel (0/20) for any non-48021 county. Verbatim working invocation: `pnpm run cert-grade-and-report -- --grade-mode=unzoned --roster-from=file --roster-file=<roster.txt> "--preflight-row-id=<rowId>"` with `DATABASE_URL` + `LEDGER_INGEST_URL`/`LEDGER_INGEST_KEY` set.
2. **Roster construction rules.** (a) Filter the roster to parcels carrying `warmVerifyDeclineCode = 'unzoned-no-district-basis'` ONLY — in-city `no-district-on-record` parcels legitimately fail the unzoned grader and are not cert-eligible on this lane. (b) Every roster parcel must resolve in the LIVE cadastral service before the run: the cohort is StratMap-sourced and can contain parcels absent from the live CAD layer (Caldwell had 3 of 20 — CAD-COHORT-VINTAGE-DRIFT in the defect backlog). Replace unresolvable parcels deterministically (next in cohort order, CAD-probe-gated) and FILE the replaced parcels in the backlog; never silently swap.
3. **Never freeze a registry row's cadastral URL without a live probe.** Caldwell's authored row pointed at FeatureServer/0, which is that service's "Municipal Utility Districts" layer; Parcels was layer 1. Probe the service root for layer names, probe the layer's fields, and run one roster-parcel query, BEFORE the row merges. Engine #245 carries the verified Caldwell URL; #246 made ring-fetch prop_id field-casing case-insensitive (Caldwell echoes `Prop_ID`), so field casing is no longer a per-county hazard.
4. **Ledger env values, concretely:** `LEDGER_INGEST_URL` = the cortex-api Cloud Run URL; `LEDGER_INGEST_KEY` = `SERVICE_API_KEY` secret (trim trailing newline). Atoms `DATABASE_URL` = secret `DATABASE_URL` in `hauska-prod-497015`.
5. **Warden sweeps must pass `--cert-artifact`** (the cert JSON the wrapper wrote) or certFreshness/diff no-op as MEASURE-EMPTY-COHORT noise.
6. **Warden on mixed-city counties (v1 caveat):** the v1 sweep samples the whole-county cohort and compares against unzoned-cascade expectations; on a county with city district stamps (Guadalupe/Seguin+Cibolo) it emits false `cascade-missing` GEOMETRY-DIVERGE and `zoningFactPresent` SERVE-PATH findings on city-stamped parcels. Triage such findings against the city-aware skip set before treating them as data defects (WARDEN-MIXED-CITY-BLIND-SPOT in the backlog; Warden v1.1 fixes the comparator).
7. **Preflight wrapper is fips-keyed:** `preflight-and-report.mjs` takes `--fips=<fips>` (NOT `--row-id`) and runs every registry row on that fips.

## CASCADE KEYSPACE SHARDING (T5, 2026-08-05)

Mega-counties and any county whose solo cascade scan exceeds the heavy-scan slot budget run ONLY via keyspace sharding. **Bexar (48029, ~700k) MUST use sharding for its first production cascade run** — never a solo apply.

### Flags

Verbatim invocation (substrate-only; no `CORTEX_DATABASE_URL`):

```
PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms Neon> \
  pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- \
    --county=<fips> --cascade-absence-only [--dry-run] [--batch=500] \
    [--parcel-min=<fips>:<suffix>] [--parcel-max=<fips>:<suffix>] \
    [--cascade-ids-out=<path.json>]
```

| Flag | Purpose |
|---|---|
| `--parcel-min` | Lower bound (inclusive) on `body->>'parcelNodeId'`, lexicographic |
| `--parcel-max` | Upper bound (inclusive) on `body->>'parcelNodeId'`, lexicographic |
| `--batch` | Write/page batch size; **default 500** for county-scale runs (pageSize cap 500) |
| `--cascade-ids-out` | Optional; writes sorted JSON array of parcel IDs that would be cascaded (dry-run proof) |

Summary JSON on `--cascade-absence-only.done` includes `shardId` (derived from min/max, `"full"` when unbounded), plus `parcelMin`/`parcelMax` when set.

### Sharding procedure

1. **Dry-run solo first** (no bounds) to get baseline `scanned` / `cascaded` counts and optional `--cascade-ids-out` set.
2. **Compute N shard ranges** by splitting the county `parcelNodeId` keyspace. **Use live SQL `ntile` min/max per quartile** — never fixed zero-padded numeric suffix ranges (Bell 2026-08-05: prop_ids like `48027:5` sort lexicographically *after* `48027:249999999`, so fixed bounds leave gaps). McLennan 48309 proof query:

```sql
WITH ids AS (
  SELECT DISTINCT body->>'parcelNodeId' AS pid
  FROM atoms
  WHERE entity_type = 'zoning-fact'
    AND jurisdiction_tenant LIKE 'breadth_<fips>_%'
    AND body->>'parcelNodeId' IS NOT NULL
),
ranked AS (
  SELECT pid, ntile(4) OVER (ORDER BY pid) AS quartile FROM ids
)
SELECT quartile, min(pid) AS parcel_min, max(pid) AS parcel_max, count(*)::int AS n
FROM ranked GROUP BY quartile ORDER BY quartile;
```

3. **Run N shard dry-runs** in parallel (one terminal/process per shard) with matching `--parcel-min` / `--parcel-max` and distinct `--cascade-ids-out` paths.
4. **Prove union-equals-solo:** the union of shard `cascadedParcelIds` must equal the solo set; shard `scanned` sums must equal solo `scanned`. File verbatim diff proof to `_inbox/<date>_<county>_sharding_diff_proof.json` before any sharded apply.
5. **Sharded apply:** same bounds, no `--dry-run`, one shard per heavy-scan reservation slot if serial; parallel only when slot capacity allows.

### Batch guidance

Default `--batch=500` (raised from 200 per measured county-scale pace). Do not exceed 500 — `pageSize` is capped at `Math.min(args.batch, 500)`.

### Bexar rule

Bexar (48029) first production cascade: **sharded dry-run → review diff proof → sharded apply → cert**. Solo full-county cascade apply is forbidden.

**Proof record (McLennan 48309, 2026-08-05):** `_inbox/2026-08-05_mclennan_sharding_diff_proof.json` — union-equals-solo PASS (scanned 114,255 solo = sum of 4 shards; cascade already complete so cascaded=0 validates partition only). Shipped: engine PR #259.

## GRADABLE ACCEPTANCE (Factory 2 depth)

Each item is pass/fail via the named instrument only. Narration fails the item.

**F2-1. Geometry staged (Factory 1.5).** **Pass:** `SELECT count(*) FROM txgio_parcel WHERE county_fips='<fips>'` on `TXGIO_DATABASE_URL` returns `> 0`. **Fail:** zero rows. **Instrument:** one-shot psql.

**F2-2. Parcel-node anchors (Factory 1).** **Pass:** `SELECT count(*) FROM atoms WHERE entity_type='parcel-node' AND body->>'countyFips'='<fips>'` on atoms Neon returns `> 0` before depth warm. **Fail:** zero parcel-node rows for target county. **Instrument:** one-shot psql.

**F2-3. Gated warm runner only.** **Pass:** `node packages/engine-core/scripts/depth-warm-bastrop-batch.mjs` exits 2 with RETIRED message; production warm uses `depth-warm-city-batch.mjs --row-id=<RegistryRowId>`. **Fail:** per-city batch script exits 0 or warm run without `--row-id`. **Instrument:** CLI exit code + batch JSON `engineSha`.

**F2-4. Warm preflight gate applied.** **Pass:** apply artifact JSON includes event `depth-warm.parcel-node-preflight` with `warmEligible + sum(declinesByCode) === recipeCohort`. **Fail:** event absent or arithmetic mismatch. **Instrument:** parse apply `--out` JSON.

**F2-5. Dry/apply verify parity (write-then-verify era).** **Pass:** `dryRun.verifyPass === apply.promoted + apply.computePassNotPersisted` (document skipped/idempotent fields if non-zero). **Fail:** unexplained delta. **Instrument:** dry vs apply artifact pair numeric compare.

**F2-6. Identical engine SHA dry/apply pair.** **Pass:** `engineSha` field in dry and apply artifacts matches (40-char). **Fail:** mismatch without void-and-re-run. **Instrument:** JSON field equality.

**F2-7. Onboard preflight gate.** **Pass:** `node scripts/onboard-preflight.mjs --fips=<fips>` with required env exits 0 and writes `_inbox/<date>_preflight_<fips>_*.json` with 8 checks per row. **Fail:** missing artifact or check count ≠ 8. **Instrument:** CLI + JSON parse.

**F2-8. Block-13 regression after shared-code touch.** **Pass:** latest Bastrop block-13 artifact shows `blockPass: true` and `certRestore` contains `7/7`. **Fail:** blockPass false after warm/cert code merge. **Instrument:** `_inbox/*bastrop*block13*.json` parse.

**F2-9. SETBACK_TABLES ratification before serve.** **Pass:** zoned-city apply artifact includes non-null `ratificationRecordPath` pointing to `_sessions/` or `_decisions/` entry dated on or before the engine commit that uncomments `SETBACK_TABLES` for that city; path file exists on disk. **Fail:** table registered without cited ratification path. **Instrument:** artifact field + `Test-Path` on cited path.

**F2-10. Ledger POST paired with inbox artifact.** **Pass:** gate or cert run produces both `_inbox/*.json` file and successful ledger ingest (HTTP 2xx from cortex-api ingest route, or wrapper log `ledgerPosted: true`). **Fail:** file-only or POST-only. **Instrument:** artifact + curl/log.

**F2-11. Warden cert-artifact supplied.** **Pass:** `pnpm run warden-sweep -- --fips=<fips> --cert-artifact=_inbox/<cert>.json` exit 0; no `MEASURE-EMPTY-COHORT` on certFreshness when cert path valid. **Fail:** warden run without `--cert-artifact` on post-cert sweep. **Instrument:** warden JSON output `checks[].defectClass`.

**F2-12. Store-truth cohort sizing.** **Pass:** warm/cascade dry-run roster count matches immediate pre-run SQL count on atoms store (not prior session log). **Fail:** dry roster sourced from stale promote counter only. **Instrument:** SQL count pasted in dry artifact `rosterSize` field.

**F2-13. CI conclusion string on engine merges.** **Pass:** `gh run list -R empressaioemail-tech/hauska-engine --branch <pr-branch> --limit 1 --json conclusion -q '.[0].conclusion'` equals `"success"`. **Fail:** `"failure"` or missing run. **Instrument:** gh one-shot (not `gh pr checks` pass label).

`gradable: true` for proven Texas cohorts (Bastrop/Elgin/Lockhart/Guadalupe/Caldwell paths). `gradable: false` for net-new jurisdictions until registry row + source probes freeze.

## Smithville eCode360 (F2 corpus, W5 E1, 2026-08-09)

**Adapter home:** `hauska-engine` `packages/corpus/src/adapters/ecode360/` on `origin/main` (`41cfdb4`, commits `122798f` / `0d2fc2e` / `67ffe31`). Stale branch `feat/ecode360-scraper-header-first` superseded (185 commits behind, zero unique delta) — delete local copy; do not push.

**Scrape posture:** robots gate first; civil UA `Mozilla/5.0 (compatible; PublicLawTextFetcher/1.0)`; rate ≤0.5 rps; fail loud on 403/challenge. Chrome UA spoof forbidden. Proof artifacts: `P:/tmp/tx_scraper_proofs/smithville/` (155 parent pages, `normalized.json` 12,793 blocks, fidelity harness 836/836 TOC sections). Ingest artifact (post parent-dedup): `P:/tmp/smithville-normalized-2026-08-04.json` (4,366 blocks → 836 code-section atoms).

**Ingest path:** Path eCode360 File — set `SMITHVILLE_NORMALIZED_PATH` to the deduped normalized JSON, then `build-corpus-snapshot` Smithville unit or `runPathEcode360FileIngest` directly. Target eval: **1.0/1.0/1.0** (15 curated queries). Do not ingest from the raw 12,793-block proof file without re-normalizing through the merged adapter (duplicate parent-page markers inflate section entityIds).

**Zoning stamp:** **not configured** — registry `zoning_gis: null` (city Maps page carries PDF only; no public FeatureServer row). `zoning-stamp --city=smithville-tx` fails `unknown city`. Corpus/zoning-fact onboarding can proceed; parcel district stamp is a separate registry/GIS follow-on (Donley-pattern honest absent until a public layer is probed).
