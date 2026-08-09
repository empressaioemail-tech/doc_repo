---
id: 2026-08-08_DOCSET_coverage_corrections
title: Doc-set coverage-claim corrections — code exists vs data loaded vs served to product
date: 2026-08-08
status: complete (executor pass; operator/planner to review and commit)
owner: nick
related: [_inbox/2026-08-08_STATEWIDE_layer_inventory, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_FABRIC_parcel_counts.json, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, 90_operations/OPS-1_texas_source_registry, 90_operations/OPS-5_cert_standard, 90_operations/OPS-2_county_onboarding_runbook, 75m_map_data_visual_benchmark, 61a_central_tx_coverage_program]
---

# Doc-set coverage-claim corrections

Executor pass, operator-authorized 2026-08-08. Task: find and correct docs that conflate CODE EXISTS, DATA LOADED, and SERVED TO PRODUCT as if they were one state. Corrections made in place, old claims preserved and marked, per repo convention (edit in place, bump `last_updated`, retire via status flip never delete).

## Files corrected (5)

### 1. `90_operations/OPS-1_texas_source_registry.md`

The most load-bearing file in this pass — the registry other docs cite as the source of truth for Texas coverage.

- Added a DOCTRINE NOTE at the top of the doc (applies to the whole file): coverage figures here are source-availability/registry-probe state, not store counts; cite the live store, not this registry, for loaded/served claims.
- Old claim: `"COVERAGE: 253/254 counties covered."` (Rail C / StratMap parcels). Replaced with a correction block: this is source-availability (StratMap publishes a zip), not data loaded. Live `txgio_parcel` holds **19 of 254 counties**, 235 absent including Harris. True distinct parcels across those 19: **4,617,181** (row counts overstate ~16.6 percent due to tile-seam duplication).
- Old claim: `"ADDRESS POINTS — statewide ~11.7M... Already ingested (txgio_address). USE for situs."` Replaced with: 11.7M is the source's paginated-REST total, not loaded. Live `txgio_address` holds **6 of 254 counties, 1,688,950 rows** (14 percent of the claimed total). "Already ingested" was a blanket misread.
- Old claim: `"CITY LIMITS — ... SOLVES the R17 'what is the city' problem"` (implying a real, usable layer). Annotated: no adapter, ingest script, or table exists; zero rows anywhere; confirmed by the engine's own code comment at `cascade-unzoned-envelope-decline.ts:62` ("no city_limits / incorporated_place / TIGER source anywhere").
- Old claim (T6 section): `"Counties: 254/254 in roster; 253/254 CAD probed."` and the four-point-probe verified/partial/absent counts, presented without qualification. Annotated: these are endpoint-reachability probe results; live `cad_property` holds **15 rows total statewide** — bulk CAD attribute acquisition has not started.
- Old claim: `"DISCREPANCY TO VERIFY AT INGEST: agent summary cited Bastrop 74,729 features; matrix JSON says 63,357."` Resolved and corrected: live count is 74,729 (matches agent summary); the matrix figure is wrong/stale, do not cite it.
- Frontmatter: added `last_updated: 2026-08-08`, appended `_inbox/2026-08-08_STATEWIDE_layer_inventory` and the county-shape decision to `related`, status line flagged as corrected.

### 2. `90_operations/OPS-5_cert_standard.md`

- Old claim (line ~34, R28 gate): `"recompute boundary primitive when stored normals disagree with the working BCAD ring"` — names BCAD as the working/truth ring.
- Corrected: added a note before the WARM-TIME GEOMETRY GATES section stating this is superseded by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273 Serve-Consistency): txgio is THE truth frame; BCAD is demoted to divergence-reporting only (`PARCEL-RING-SOURCE-DIVERGENCE`), never a silent substitute. Flagged that the Geometry Law record itself names the cert lane's BCAD grading frame as an unreconciled open item. The R28 line text itself was left largely intact but annotated inline rather than rewritten, since rewriting the operational gate description risks misstating exactly what the mechanical check does — the doctrine correction is the load-bearing fix here.
- Frontmatter: `last_updated` bumped to 2026-08-08, Geometry Law decision added to `related`.

### 3. `90_operations/OPS-2_county_onboarding_runbook.md`

- Old claim (STAGE 4 INSET, line ~33): `"BCAD rings trusted, no scrub (A5); recompute primitive on ring-swap..."`
- Corrected: same treatment as OPS-5 — correction block citing the Geometry Law, txgio as truth frame, BCAD demoted to divergence reporting. The stage description line itself was edited from "BCAD rings trusted" to "Working ring is txgio (not BCAD; see correction above), no scrub (A5)" so a reader skimming only the stage line still gets the corrected frame, not just the annotation above it.
- Frontmatter: `last_updated: 2026-08-08` added, status line flagged, Geometry Law decision added to `related`.

### 4. `75m_map_data_visual_benchmark.md`

- Old claim (multiple locations): TX Comptroller MUD/PID and Texas RRC marked `LIVE on map (2026-06-19)`, plus prose stating "adapters confirmed working" and "now LIVE on the map path."
- Corrected: added a top-of-doc correction note explaining Cotality was extinguished 2026-07-13 (per standing decision: live code hitting Cotality is a wrong-routing defect) and that the 2026-06-19 verification of MUD/PID and RRC ran through that now-dead map/extension stack, not re-verified since. Marked every table row and prose mention of MUD/PID and Texas RRC as SUPERSEDED rather than guessing at a new status (their current live/dead state was not re-queried in this pass — that is a separate follow-up). Left Edwards Aquifer and Groundwater/NWIS as LIVE but flagged "not Cotality-routed per their adapter chains, but not re-verified in this pass" since I could not confirm their routing independence without re-running a live smoke test, which is out of scope for a doc-correction pass.
- Frontmatter: status and `last_updated` updated to reflect the partial-supersession.

### 5. `61a_central_tx_coverage_program.md`

Second most load-bearing file in this pass — this doc's framing directly informed the wrong 2026-08-08 rulings the operator is correcting.

- Old claim: `"The national layers (FEMA NFHL, USGS soils and geology, EPA, Cotality parcel and property, Opportunity Zones) are coverage-complete by default and are not where the gaps live."`
- Old claim: `"Every parcel in Central Texas (and the US) already gets the full national-layer brief regardless of local-code coverage: ... That is the bulk of an investor verdict and it fires on every parcel today, warmed jurisdiction or not."`
- Old claim: `"Map (spatial) coverage rides Cotality national parcels now (not per-county GIS)."`
- Corrected: added a top-of-doc correction block distinguishing "live-queryable at request time" (true — these are live federal/state APIs and Cotality was a live vendor API) from "statewide-held data" (false — FEMA/SSURGO have zero cached rows anywhere per the 2026-08-08 inventory; Cotality is extinguished). Edited "coverage-complete by default" to "live-queryable everywhere by default" inline with a parenthetical pointing to the correction block. Edited the "already gets... fires on every parcel" paragraph to say "fires live... at request time" and "nothing here is a persisted statewide layer." Marked the Cotality map-spine line as SUPERSEDED (extinguished 2026-07-13).
- Frontmatter: status and `last_updated` updated.

## Doctrine line added

Everywhere corrected above, the same doctrine sentence was used, matching the style already established in `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md`: **code exists, data loaded, and served to product are three different states; any coverage claim must name which of the three it means and cite the store, not a registry file.**

## Ambiguous cases reviewed and NOT changed

- **`80_adrs/adr_027_first_party_land_records_acquisition.md`**, line ~38: `"StratMap address points ARE open paginated REST (11.7M features statewide)."` This is a source-capability claim (the REST endpoint exists and serves up to 11.7M features on request), in a decision record about acquisition MECHANISM, not a claim that the data has been acquired or loaded — the surrounding sentence is explicitly about which acquisition path to use. Read in context it does not assert possession. Left unchanged; flagging here in case a future reader lifts the "11.7M statewide" fragment out of context.

- **`90_operations/T6_texas_roster_recon_track.md`**, line ~40: `"Roster covers 254/254 counties... wave plan sums to statewide parcel coverage with costs."` This describes the ACCEPTANCE CRITERION for the roster/registry artifact itself (a probe-and-plan document), not a claim that parcels are loaded. The roster is explicitly a registry of what to acquire and its cost, not the acquired data. Read in context this is accurate to what T6 actually is. Left unchanged.

- **`90_operations/PHASE_C_HANDOFF_bastrop_warm.md`**, line ~35: carries the identical "BCAD rings trusted, NO scrub (A5)" language found in OPS-2 and OPS-5. This is a THIRD instance of the same superseded frame, not named in the task's two-item scope (which named only OPS-5 line ~34 and OPS-2 line ~33). Not corrected in this pass — flagging explicitly so it is not lost. Recommend the same correction block be applied here in a follow-up, since it is the same defect class and was caught in the same grep sweep that found the two in-scope instances.

- **`61a_central_tx_coverage_program.md`** coverage-status tracker table (public-free Bastrop/Cedar Hill/Grand-County-Moab row, and the Layer-3 jurisdiction counts elsewhere in the doc): these describe code-corpus/jurisdiction-onboarding state (a different data type than the parcel/address/federal-layer claims corrected above) and were not re-verified against a live store in this pass. Left as-is; they were not part of the false-ruling chain this task was tracing and re-verifying them was out of scope.

## Method note

Searched `90_operations/`, `90_runbooks/`, `80_adrs/`, `_catalog/`, root numeric-prefix docs, `_STATE.md`, `00_current_state.md`, and `CLAUDE.md` (the last two are rolling/policy docs, not claim-bearing in the same way, and were checked but not edited — `00_current_state.md` regenerates at session close per protocol and any stale figures there will be superseded by the next regeneration, not hand-patched here). Grep patterns covered "253/254", "11.7M", "statewide...complete/ingested/loaded/covered", "Already ingested", "BCAD...trust/no scrub/ring", and "coverage-complete". `_catalog/texas_roster_v1.json` itself is a probe-registry artifact (not prose) and was not edited; its companion prose docs (OPS-1, T6) were corrected where they mischaracterized it as loaded data. `_inbox/2026-08-08_*` evidence artifacts and the mockup HTML were left untouched per constraints.
