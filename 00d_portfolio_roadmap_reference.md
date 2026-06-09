---
id: 00d_portfolio_roadmap_reference
title: Portfolio roadmap reference — the honed planned-work view
status: active
last_updated: 2026-06-09
applies_to: portfolio
related: [00_current_state, 00c_portfolio_master_map, 03_structural_constitution_and_drift_guard, 04_roadmap_alignment_audit, 16_commercialization_roadmap, 76c_operator_master_next_steps, 11_roadmap]
owner: nick
---

# Portfolio roadmap reference

> **Purpose.** The single honed view of what is planned across every product, MCP, and infra component, ranked by the strategic priority frame and checked against the constitution. This is the orientation roadmap. It links out rather than restating.
>
> **How it relates to the other orientation docs.** [`00c_portfolio_master_map.md`](00c_portfolio_master_map.md) is the verified topology (what runs where). [`00_current_state.md`](00_current_state.md) is the rolling fires-and-sprints snapshot. [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md) is the commercial-spine detail. [`76c_operator_master_next_steps.md`](76c_operator_master_next_steps.md) is the tactical operator queue. This doc sits above all four as the planned-work frame. [`11_roadmap.md`](11_roadmap.md) is the legacy operational checklist, superseded as of 2026-06-06 and preserved for reconciliation.
>
> **The standard it checks against.** The constitution and drift guard (`03_*`, filing pending) and the roadmap alignment audit (`04_*`, filing pending). Every item below traces to a root: calibration or sovereignty.

## 1. Strategic priority frame

The ranked 90-day frame from the roadmap audit. Rank by impact and accelerate; the building is mostly done, so this is shipping and capturing, not building from zero.

| # | Move | Type | Root | Owner | Status |
|---|---|---|---|---|---|
| 1 | **Wire arrow two** — capture reviewer edits + finding accuracy into atom confidence | Build (the one load-bearing build) | Calibration | Nick | **Spec'd in [`04a`](04a_arrow_two_calibration_capture.md); Phase 0 recon dispatched to cc-agent-C 2026-06-06** |
| 2 | Ship Cortex + Brief extension to beta in parallel | Ship | Calibration | Operator + Valerie | In flight, operator-gated |
| 3 | Keep the Bastrop municipal funnel running as long money | Run / maintain | Both | Operator + Nick (capture wiring) | Continuous |
| 4 | Naming pass on the theology — write the two-root thesis into the doc set | Documentation | Both | Operator | Filing pending |
| 5 | Design the city data sharing cooperative with counsel | Design / legal | Both | Operator + counsel | Long horizon, start study |
| 6 | Hold adjacency freezes (trading/issuance/PE/IBKR); build spine clean | Freeze + sequenced build | Protective + spine | Operator | Engine extraction **unfrozen** 2026-06-06 |
| 7 | Keep any rev-share rail quiet (invisible plumbing) | Framing rule | Both | Valerie + operator | Continuous discipline; note: partnership-first / city revenue-share retired 2026-06-09, so this now governs only the surviving content-licensing (ICC/NFPA) and SDK source-actor rail, whose retention is a separate decision |

The one thing not to miss: item 1 is ranked first and is the only genuinely load-bearing build, but it is not on any active sprint. Until reviewer adjudications (the finding-engine accept/edit/reject events that already emit `decision-event` atoms) feed back into atom confidence, every shipped surface only withdraws from the flywheel and never deposits, and confidence stays asserted rather than earned (invariant I3). This is the gap between the strategic frame and the tactical queue.

## 2. Portfolio roadmap reference table

Status verified against [`00c_portfolio_master_map.md`](00c_portfolio_master_map.md) (2026-06-01 cross-repo recon). "Planned next" is the single next move, not the backlog.

| Component | Layer | Today | Planned next | Docs |
|---|---|---|---|---|
| hauska-engine (retrieval API) | Hauska spine | Live, read-only, ~35 TX jurisdictions | Demand-pull Sync 5 ingest; factor-out **unfrozen 2026-06-06**, sequenced behind M-Stabilize 2C | [`27`](27_engine_evolution_plan.md), [`adr_008`](80_adrs/adr_008_engine_factor_out.md) |
| hauska-mcp-server | Hauska spine | Live, the gate, 46 tools | `mcp.hauska.dev` mapping; `LEGACY_BACKEND_API_KEY` rotation | [`50`](50_hauska_mcp_server.md), [`44`](44_mcp_cortex_architecture_map.md) |
| @hauska/atom-contract | Hauska spine | Published npm v1.3.0 | CI publish action (manual today) | [`adr_018`](80_adrs/adr_018_atom_contract_substrate_layer.md), [`01a`](01a_atom_conventions.md) |
| Hauska SDK (payment/VDA/ledger) | Hauska commerce | Published v0.1.0, consumed by nothing | Stays invisible plumbing; first integration gated on first paid surface (item 7) | [`14`](14_pricing_framework.md) |
| Cortex (cortex-api) | Empressa product | Live, briefing + finding engines | QA backlog WS-G; "4in rain" needs 40d 2D.2/2D.3 | [`43`](43_cortex_qa_backlog.md), [`40d`](40d_cortex_site_context_sprint.md) |
| Codex (plan review) | Empressa product | Functional-ready | Codex 1b live at Bastrop, gated on M-Stabilize | [`48`](48_codex_program_plan.md) |
| Property Brief / Brief extension | Empressa product (the wedge) | v0.6.5 sideload, calls cortex-api direct | Merge PR #1, clean QA; wire Cotality (parcel/zoning) + ICC (code); Chrome Web Store | [`75`](75_hauska_brokerage_workflow_plan.md), [`76c`](76c_operator_master_next_steps.md), [`75c`](75c_property_brief_data_backlog.md) |
| SmartCity OS | Empressa product | Live, 15 integrations, island | 31a Bastrop maintenance; M-Stabilize on operator DB hold | [`31a`](31a_bastrop_maintenance_sprint.md), [`30a`](30a_smartcity_stabilization_sprint.md) |
| Revit Connector | Empressa product (bridge) | Compiled add-in, IFC v0.2 | As-needed | [`40d`](40d_cortex_site_context_sprint.md) |
| Commercial spine (M-HauskaCommercial) | Hauska commerce | Step 1 live | Wave 2 gated on Nick decisions B (pricing) + C (GTM) + Circle rail | [`16`](16_commercialization_roadmap.md), [`14`](14_pricing_framework.md) |
| GTM + self-healing loops | Infra (designed) | Diagrams only | Roadmap, not a build sprint yet | [`76`](76_empressa_wedge_90d_operating_plan.md), [`76a`](76a_operator_autonomous_loops.md) |

## 3. Milestone ladder

| Milestone | Means | Gate |
|---|---|---|
| M-Stabilize | SmartCity OS on Empressa Neon, fires closed | **On operator DB hold** — unblocks the rest |
| M-PropIntel | "4 inches of rain" + parcel intel in SmartCity | M-Stabilize + Cortex 40d 2D.2/2D.3 built |
| M-CortexQA | Cortex functional end-to-end, QA-ready | Partial exit; pending mcp-mode config |
| M-CodexQA | Codex 1b functional end-to-end, QA-ready | Functional-ready |
| Codex 1b live at Bastrop | Real submittals through the city surface | Gated on M-Stabilize |
| M-HauskaCommercial | Commercial substrate live, first paid Layer 2 call | Nick decisions B/C + Circle rail |

## 4. Critical paths and open gates

Three things gate the most. M-Stabilize releasing the operator DB hold unblocks Codex 1b at Bastrop, M-PropIntel, and the engine factor-out (the latter is then held anyway per item 6). First revenue gates on Nick's pricing (Decision B) and GTM-channel (Decision C) calls plus the Circle fiat-rail build. The Layer 1 model-code base across the catalog gates on ICC API access (one ICC deal clears it). The calibration-capture build (item 1) gates nothing mechanically but gates whether any of the shipped surfaces actually compound.

Launch of the extension and Cortex/Codex now gates on wiring Cotality (parcel/zoning, selected over Regrid 2026-06-06) and ICC (model code); both are in eval/POC as of 2026-06-06, and both apps are built to the integration boundary so wiring is the only remaining launch step.

Decisions owed by the operator: pricing Decision B, GTM-channel Decision C, ICC POC sign (~$1k), and returning the Cotality eval onboarding (legal/billing info + use-case paragraph) to start the MCP eval. (Engine-extraction freeze resolved 2026-06-06: unfrozen, see [`_decisions/2026-06-06_engine_extraction_unfrozen.md`](_decisions/2026-06-06_engine_extraction_unfrozen.md).)

## 5. Frozen and parked (with reason)

Per item 6 (amended 2026-06-06), frozen for the 90 days: the trading, issuance, PE curriculum, and IBKR adjacencies, firewalled entirely. **Engine extraction (ADR-008) is no longer frozen** (see [`_decisions/2026-06-06_engine_extraction_unfrozen.md`](_decisions/2026-06-06_engine_extraction_unfrozen.md)); it is sequenced behind M-Stabilize Phase 2C, not deferred behind a first paid call. Parked under concentration discipline (queued, not killed): the place-graph (`77`), formation/talent-graph (`78`/`78a`/`78b`), and competitive-execution (`79`/`79a`) expansion tracks; ECI atomization (behind the commercial spine); the Hauska SDK external developer motion (post first-paid-call); Starlink/IoT (warm only); Jarrell/M9 (P3); 3D site assembly (2D-first). Nothing here gets build cycles until the wedge ships and hits its day-14/45/75 gates.

## 6. What checks this roadmap

Before anything enters as a decided direction, run premortem-check (scores against the structural commitments) and catalog-thesis-check (brand, naming, tier, architecture). After a move clears, record it with decision-log including reversal criteria. On a cadence, run project-refresh and update the roadmap audit (`04_*`), not the constitution (`03_*`). An item that serves no root, only withdraws, or fails a load-bearing test does not enter without a recorded override.

## Revision history

- **2026-06-06 (origin):** Created as the honed planned-work roadmap reference. Synthesizes the 00c topology, the 16 commercial spine, the 76c operator queue, and the strategic priority frame from the roadmap alignment audit. Surfaces the arrow-two calibration-capture gap as the top unaddressed strategic item. 11_roadmap superseded and preserved for reconciliation.
