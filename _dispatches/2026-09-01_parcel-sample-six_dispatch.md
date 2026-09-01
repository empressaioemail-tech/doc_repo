CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: F-01 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# PARCEL-SAMPLE-SIX dispatch

# Mission — parcel-record fill job, proven on a six-county sample

## Why

Operator ruling `_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`, step 2:
ingest what we already hold. The operator corrected the prior planner explicitly: fill A
HANDFUL OF PARCELS IN EACH of the six counties first, NOT one county end to end. The
variance is between counties and is already measured; a six-county sample exercises every
shape at once. This card builds the fill job and proves it on that sample. The full-county
fill cards depend on this close.

## What to build

A `parcel-record-fill` job in `hauska-factory` (the job harness, run rows and termination
records exist — use them) that, for a named set of parcels:

1. **Instantiates** each parcel's full 52-rail record via the engine module
   (`packages/engine-core/src/parcel-record/` at engine main >= `bfa9642`).
   `buildParcelRecordCells` / `instantiateParcelRecord` is the SOLE constructor — do not
   build cells any other way. Incorporation comes from the containment results already in
   the Factory store (the parcel-jurisdiction landing from migration `0005c`; enumerate the
   catalog to find the authoritative table, do not guess). `not-applicable` is stamped ONLY
   for parcels containment says are unincorporated, via the module's own rail list; program
   guard `texasCtxProgramConfig` (370,289).
2. **CAD-ingests** from `cad_property` on the cortex-prod store (`PRODUCTION_NEONDB_URL`;
   verify by catalog WHICH database on that host holds `cad_property` — `neondb` vs
   `hauska_mcp` — before reading). `ingestCadOntoRecords` semantics are the law. Writes are
   idempotent upserts keyed `(place_key, rail_key)`; a re-run may not change state.

The engine module is the semantic authority. If the job needs an engine-side change, make
it in the registered engine clone as its own PR; do NOT fork the semantics into the job.

## The sample

Deterministic (fixed ordering by `prop_id`, no randomness), ~50 parcels per county, and it
must include per county: >=10 in-city, >=10 unincorporated, plus these targeted shapes:

| county | must include |
|---|---|
| 48021 Bastrop | gold `48021:34137`; >=5 parcels where roll atoms claim livingArea but `cad_property` has none — PROVE the fill does NOT copy the invented atom value |
| 48055 Caldwell | >=5 of the 24,552 real `$0` improvements — `$0` must land as `value: 0`, never absent |
| 48209 Hays | ordinary strata (roll atoms hollow — irrelevant because you never read them) |
| 48309 McLennan | >=5 parcels with assessed and livingArea NULL at source |
| 48453 Travis | >=5 parcels with livingArea NULL at source (0 of 500,307 have it) |
| 48491 Williamson | >=5 parcels present in `place_layer_snapshots` but absent from roll atoms — prove the fill keys off `cad_property`, not snapshots, not atoms |

## What to report (not decide)

- The rail-by-rail mapping the module actually produced for NULL-at-CAD-source: which
  state it assigns (`absent-verified` with a CAD-null basis vs `unaccounted`). Report the
  mapping as a table. If you believe the mapping is wrong, say so in the close — do NOT
  patch semantics in the job.
- Per county x rail x state counts for the sample, before and after CAD ingest, verbatim.
- Idempotency proof: run the sample twice; paste the zero-drift diff.
- Live publish-gate check: `poisonCell` one sample parcel → gate refuses; then clean up
  and note the exclusion.

## Landmines

- READ `cad_property`. NEVER roll atoms for CAD fields: Hays/Travis/Williamson bodies are
  hollow (29/3/7 claim keys) and Bastrop atoms INVENT coverage CAD lacks (livingArea
  40,602 vs 8,712). `#575` already shipped this exact defect once.
- The snapshot table is not a projection of the atom table (Williamson 602,050 vs 319,487).
- Atoms live in database `hauska_mcp`, not `neondb`. `jurisdiction_tenant` is NOT a FIPS
  scope — scope atoms by half-open `entity_id` ranges (only relevant if you touch atoms at
  all, which CAD fill does not).
- Never convert `unaccounted` to `absent-verified` to clear a gate.
- Store reads time out under writer load; verify from execution status and the execution
  log close line, not OFFSET pagination.
- Chunk everything; the prior unchunked prove run was killed at 5.5 minutes.
- Never echo a secret. Do not rebuild the store token.

## Close

`_inbox/2026-09-01_parcel-sample-six_close.json`: `whatContradictedTheCard` mandatory —
your seats have repeatedly been right where the planner's card was wrong; contradictions
are the yield of this card. `leave_behind` + scratch block. Commit and push your branches
before closing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_parcel-sample-six_cp1.json
  CP2: _inbox/2026-09-01_parcel-sample-six_cp2.json
  CLOSE: _inbox/2026-09-01_parcel-sample-six_close.json
