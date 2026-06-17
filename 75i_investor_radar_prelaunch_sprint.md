---
id: 75i_investor_radar_prelaunch_sprint
title: Investor Deal Radar — pre-launch sprint (consumer skeleton to Cotality-wired, market-ready)
status: active
last_updated: 2026-06-17
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 75h_investor_deal_radar_launch_readiness, 61_property_intelligence_master_plan, 08_tiered_access_model, 77b_cotality_integration_strategy, _research/2026-06-06_cotality_api_surface_catalog, _decisions/2026-06-17_investor_radar_scope_cuts]
---

# Investor Deal Radar — pre-launch sprint

> **Governing spec for the build.** Operator handoff 2026-06-17. Take the radar from consumer skeleton to fully wired on real Cotality data and market-ready. Per-repo routing: `legacy-design-tools` to cc-agent-C, `hauska-engine` to cc-agent-E; coordinate the gate-front seam across both. Required reading before executing: [`61`](61_property_intelligence_master_plan.md) (wave board), [`75g`](75g_investor_deal_radar.md) (product), [`08`](08_tiered_access_model.md) (tiers), [`77b`](77b_cotality_integration_strategy.md) + the [Cotality surface catalog](_research/2026-06-06_cotality_api_surface_catalog.md).

## Scope decisions (this handoff)

- **Lead engine / inverted property feed is CUT.** Do not build it. Cotality permits / propensity / owner-occupancy are wired as **underwriting depth on the property the user is viewing** (context that sharpens the verdict), not as a feed. Decision: [`_decisions/2026-06-17_investor_radar_scope_cuts.md`](_decisions/2026-06-17_investor_radar_scope_cuts.md).
- **Provider freeze.** Wire and ship everything we already have on contract (Cotality) before any new provider is considered. No new provider in this sprint.
- **Owned-identity export** is a thin optional stretch (export of profile + provenance ledger), not a blocker; no new provider.
- **Tiers:** Free (radar, L1) / Pro (cited brief + profile + comps/rent) / Max (subsurface + insurability + minerals), as accessPolicy + package entitlement, with a metered depth allowance to protect Cotality COGS.

## Execution (dependency-ordered, no time estimates)

| # | Work | Repo / owner |
|---|---|---|
| 1 | **Purge Regrid everywhere** — adapter registry, `brokerageSiteContext.ts`, any active doc presenting Regrid as a live source (deploy runbook `REGRID_API_KEY` step, `75b` coverage, capability-matrix "no raw Regrid geometry" line). Cotality is the sole parcel/property spine. Mockup already fixed; "(Regrid dropped)" documentation notes may remain. Historical session/_inbox records are not rewritten. | C + planner |
| 2 | **Confirm Wave 1 seam seal before pouring data** — sealed `EngineEnvelope`, `effectiveConfidence` wired to the read path, confidence-kind labeled `calibrated\|asserted\|deterministic`. No hardcoded `1.0` shown to a paying user. Until calibration is live, confidence reads **asserted-with-provenance**, never a bare earned number (commitment #2). | E (seam) + C (consume) |
| 3 | **Wire full Cotality investor depth onto the extension `/brief` path** (61 Wave 3 subset), each on the sealed envelope: parcel polygon (point to polygon, fixes centroid); Property V2 owner/sale/tax/AVM/comparables/transaction history; rent AVM + rental trends; liens/mortgage/tax assessment (**verify Texas MUD/PID special-district assessments and surface if present** — a cash-flow killer; do not assume); building permits + propensity-to-sell + owner-occupancy as underwriting depth (not a feed); RiskMeter modeled flood depth at return periods + floodway + perils (fire/wind/hail/quake) + replacement cost + foundation type (FEMA stays free baseline, Cotality flood depth is the paid forward layer, no double-billing); SSURGO soils (shrink-swell/expansive clay) + geology + karst/sinkhole (Austin edge). | C (+ E for engine seam) |
| 4 | **Foreground reasoning, not raw fields** — code/plan-review depth on "rehab reality" and "can I add a unit / build" (what a gut triggers, cited to the adopted code set); precedence/adjudication where available (how the jurisdiction applies it). If precedence is still a prod no-op per the 61 audit, **flag it as the gap**. | C + E |
| 5 | **"Pencils at $X" output** — run the user's buy-box math (cap-rate floor, rehab $/sf, spread tolerance) over our cited AVM/rent/insurance/rehab data to return a basis where the deal pencils for THEM. Frame as their math on our cited inputs, never our opinion of value (TX non-disclosure / not-an-appraisal). | C |
| 6 | **Investor verdict reframe** (deal / worth a look / dead) + buy-box tuning + per-user profile + the never-resetting running dialogue, all keyed to a canonical Cotality parcel id. | C + extension-agent |
| 7 | **Universal parcel-key capture (backend)** — address resolves to a canonical Cotality parcel id that is the join key for verdict, dialogue, and profile; support select-to-analyze, auto-detect, manual paste; site adapters are optional enrichment only. Build the capture-and-key primitive generically (the same one Mox needs at portfolio scale). | C + extension-agent |
| 8 | **Signup + sign-in path** (today sign-in only; the hosted page is bare). | C + extension-agent |
| 9 | **Tier enforcement at the gate** — Free/Pro/Max as accessPolicy + package entitlement, with a metered depth allowance to protect Cotality COGS. | C (+ M if gate-side) |

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

Real QA begins when tasks 2, 3, 5, 6, 7, 8 are in (seam sealed, Cotality depth live on the brief path, pencils-at-$X, verdict reframe, capture-key, signup). Task 1 (Regrid purge) and 9 (tiers) run alongside; G2/G3/G4 gate paying customers.

## Per-agent dispatches

- cc-agent-C (legacy-design-tools): [`_dispatches/2026-06-17_cc-agent-C_investor_radar_cotality_depth.md`](_dispatches/2026-06-17_cc-agent-C_investor_radar_cotality_depth.md)
- cc-agent-E (hauska-engine): [`_dispatches/2026-06-17_cc-agent-E_seam_seal_engine_envelope.md`](_dispatches/2026-06-17_cc-agent-E_seam_seal_engine_envelope.md)
- extension-agent (hauska-brief-extension): [`_dispatches/2026-06-17_extension-agent_investor_radar_capture_signup.md`](_dispatches/2026-06-17_extension-agent_investor_radar_capture_signup.md)
