---
id: 75i_investor_radar_prelaunch_sprint
title: Investor Deal Radar — pre-launch sprint (consumer skeleton to Cotality-wired, market-ready)
status: active
last_updated: 2026-06-17
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 75h_investor_deal_radar_launch_readiness, 61_property_intelligence_master_plan, 61a_central_tx_coverage_program, 08_tiered_access_model, 77b_cotality_integration_strategy, 24_adaptive_ui, _research/2026-06-06_cotality_api_surface_catalog, _decisions/2026-06-17_investor_radar_scope_cuts, _decisions/2026-06-17_map_extraction_shared_capability, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint]
---

# Investor Deal Radar — pre-launch sprint

> **Governing spec for the build.** Operator handoff 2026-06-17. Take the radar from consumer skeleton to fully wired on real Cotality data and market-ready. Per-repo routing: `legacy-design-tools` to cc-agent-C, `hauska-engine` to cc-agent-E; coordinate the gate-front seam across both. Required reading before executing: [`61`](61_property_intelligence_master_plan.md) (wave board), [`75g`](75g_investor_deal_radar.md) (product), [`08`](08_tiered_access_model.md) (tiers), [`77b`](77b_cotality_integration_strategy.md) + the [Cotality surface catalog](_research/2026-06-06_cotality_api_surface_catalog.md).

## Scope decisions (this handoff)

- **Lead engine / inverted property feed is CUT.** Do not build it. Cotality permits / propensity / owner-occupancy are wired as **underwriting depth on the property the user is viewing** (context that sharpens the verdict), not as a feed. Decision: [`_decisions/2026-06-17_investor_radar_scope_cuts.md`](_decisions/2026-06-17_investor_radar_scope_cuts.md).
- **Provider freeze.** Wire and ship everything we already have on contract (Cotality) before any new provider is considered. No new provider in this sprint.
- **Owned-identity export** is a thin optional stretch (export of profile + provenance ledger), not a blocker; no new provider.
- **Tiers:** Free (radar, L1) / Pro (cited brief + profile + comps/rent) / Max (subsurface + insurability + minerals + **the site map**), as accessPolicy + package entitlement, with a metered depth allowance to protect Cotality COGS.
- **Opportunity Zones IN v1.** National free Layer-1 flag (in/out, which tract, which round) + L2 reasoning (what it means for hold and capital-gains timeline) in the Parcel package. Federal/national, coverage-complete by default, independent of the seam, builds in parallel. Tract list is **swappable/versioned** for the OZ 1.0 to 2.0 transition (designations open July 2026, effective Jan 2027); label which round a verdict reflects.
- **The map IN v1, EXTRACTED, Max-tier.** The Cortex site-layer map added as a Max feature, extracted into a shared cross-app capability (not forked): layer-data assembly lifted from cortex-api BFF to a gate-fronted spine capability, render component into a shared publishable package consumed by Cortex, the extension, SmartCity, Mox. **Binding spec (commitment #1):** the Max value is cited reasoning rendered spatially (verdicts/findings/floodway-vs-buildable/OZ reasoning pinned to locations), free federal geometry as the canvas, never sold as raw-geometry display. Layers ride the sealed envelope (vintage + confidence shown); the shared capability enforces tenant/product entitlement at the gate. Decision: [`_decisions/2026-06-17_map_extraction_shared_capability.md`](_decisions/2026-06-17_map_extraction_shared_capability.md). Depends on Wave 3 polygon + flood geometry.

## Execution (dependency-ordered, no time estimates)

| # | Work | Repo / owner |
|---|---|---|
| 1 | **Purge Regrid everywhere** — adapter registry, `brokerageSiteContext.ts`, any active doc presenting Regrid as a live source (deploy runbook `REGRID_API_KEY` step, `75b` coverage, capability-matrix "no raw Regrid geometry" line). Cotality is the sole parcel/property spine. Mockup already fixed; "(Regrid dropped)" documentation notes may remain. Historical session/_inbox records are not rewritten. | C + planner |
| 2 | **Seam seal — DONE and live** (Track 1, hauska-engine #72 emit + legacy-design-tools #183 consume; uniform `EngineEnvelope` with `confidence{value,kind}`, `dataVintage`, `coverage{degraded}`, `source`; verified on San Marcos, serving `cortex-api-00180-row`). The Cotality pour (task 3) consumes the live envelope now; no longer a blocker. Remaining radar-side: the extension renders confidence as **asserted-with-provenance**, never bare (commitment #2). | DONE (E+C); extension renders |
| 3 | **Wire full Cotality investor depth onto the extension `/brief` path** (61 Wave 3 subset), each on the sealed envelope: parcel polygon (point to polygon, fixes centroid); Property V2 owner/sale/tax/AVM/comparables/transaction history; rent AVM + rental trends; liens/mortgage/tax assessment (**verify Texas MUD/PID special-district assessments and surface if present** — a cash-flow killer; do not assume); building permits + propensity-to-sell + owner-occupancy as underwriting depth (not a feed); RiskMeter modeled flood depth at return periods + floodway + perils (fire/wind/hail/quake) + replacement cost + foundation type (FEMA stays free baseline, Cotality flood depth is the paid forward layer, no double-billing); SSURGO soils (shrink-swell/expansive clay) + geology + karst/sinkhole (Austin edge). | C (+ E for engine seam) |
| 4 | **Foreground reasoning, not raw fields** — code/plan-review depth on "rehab reality" and "can I add a unit / build" (what a gut triggers, cited to the adopted code set); precedence/adjudication where available (how the jurisdiction applies it). If precedence is still a prod no-op per the 61 audit, **flag it as the gap**. | C + E |
| 5 | **"Pencils at $X" output** — run the user's buy-box math (cap-rate floor, rehab $/sf, spread tolerance) over our cited AVM/rent/insurance/rehab data to return a basis where the deal pencils for THEM. Frame as their math on our cited inputs, never our opinion of value (TX non-disclosure / not-an-appraisal). | C |
| 6 | **Investor verdict reframe** (deal / worth a look / dead) + buy-box tuning + per-user profile + the never-resetting running dialogue, all keyed to a canonical Cotality parcel id. | C + extension-agent |
| 7 | **Universal parcel-key capture (backend)** — address resolves to a canonical Cotality parcel id that is the join key for verdict, dialogue, and profile; support select-to-analyze, auto-detect, manual paste; site adapters are optional enrichment only. Build the capture-and-key primitive generically (the same one Mox needs at portfolio scale). | C + extension-agent |
| 8 | **Signup + sign-in path** (today sign-in only; the hosted page is bare). | C + extension-agent |
| 9 | **Tier enforcement at the gate** — Free/Pro/Max as accessPolicy + package entitlement, with a metered depth allowance to protect Cotality COGS. | C (+ M if gate-side) |
| 10 | **Opportunity Zones** — national free Layer-1 flag (in/out, tract, round) + L2 reasoning, Parcel package, versioned/swappable tract list (OZ 1.0 -> 2.0); surface an OZ line in the verdict's "what it can become" set. Independent of the seam; parallel. | C |
| 11 | **Site map (Max), extracted** — lift the layer-data assembly to a gate-fronted spine capability (E + M), build the shared render component (rough now, Chris polishes later), consume in the extension's Max workspace. Cited reasoning rendered spatially, not raw geometry; layers carry vintage + confidence; gate enforces tenant/product entitlement. Sequenced after Wave 3 geometry. | E + M (capability) + C/extension (consume) |

## Cross-workstream coordination (planner-held)

This sprint does not run alone. Three dependencies the planner holds:

- **cc-agent-E is the serial bottleneck** (single owner of hauska-engine). Seam seal is DONE (#72/#183 live), so the order is now: (1) driver-quality fix (gates the radar's cited code reasoning AND the [`61a`](61a_central_tx_coverage_program.md) coverage program), (2) layer-capability extraction for task 11. This ordering sets the date.
- **Coverage gates the radar's reasoning quality.** Task 4 (cited rehab / can-I-build) is only trustworthy where code is warmed and verified. Today that is Austin on the wrong edition with 0% verified. So [`61a`](61a_central_tx_coverage_program.md)'s driver-quality fix + Austin 2024 uplift are the same dependency as task 4's trustworthiness. The two workstreams converge on Austin.
- **Design feeds the extension reskin.** The positioning + brand work (claude design) is the design contract for task 6's reskin; hold the surface reskin until the tokens are stable, or scope the first pass structure-only, to avoid reskinning twice.

## Gates

- **G1 prod brokerage key** — the `/brief` 503; durable `cloud-run-deploy.yml --set-secrets` fix (hotfix already live on `cortex-api-00182-mer`; durable fix in task 1 of the cc-agent-C backend dispatch).
- **G2 Cotality consumer-display license — now LAUNCH-BLOCKING.** The paid depth displays Cotality-derived numbers; push it in parallel from now. Route to bizops.
- **G3 Texas legal framing / disclaimers** — informational estimate, never "value" or "appraisal."
- **G4 Web Store readiness** — the activeTab/contextMenus permission model from task 7 helps here (universal capture needs no broad host permissions).

## Constraints

- Tenant-private profile never pools into shared calibration (only anonymous/public-tier signal does).
- Paste verbatim command output when reporting git/deploy/live state; never summarize.
- Check `git log -3` before any commit in the shared `doc_repo` clone.

## Real-QA gate

Core-radar QA begins when tasks 2, 3, 5, 6, 7, 8 are in (seam sealed, Cotality depth live on the brief path, pencils-at-$X, verdict reframe, capture-key, signup). Tasks 1 (Regrid purge), 9 (tiers), and 10 (OZ) run alongside. Task 11 (the Max site map) is the last v1 surface, sequenced after Wave 3 geometry and QA'd when it lands; it does not block core-radar QA. G2/G3/G4 gate paying customers (G2 now also covers the map's Cotality-derived geometry).

## Per-agent dispatches

- cc-agent-C (legacy-design-tools): [`_dispatches/2026-06-17_cc-agent-C_investor_radar_cotality_depth.md`](_dispatches/2026-06-17_cc-agent-C_investor_radar_cotality_depth.md)
- cc-agent-E (hauska-engine): [`_dispatches/2026-06-17_cc-agent-E_seam_seal_engine_envelope.md`](_dispatches/2026-06-17_cc-agent-E_seam_seal_engine_envelope.md)
- extension-agent (hauska-brief-extension): [`_dispatches/2026-06-17_extension-agent_investor_radar_capture_signup.md`](_dispatches/2026-06-17_extension-agent_investor_radar_capture_signup.md)
