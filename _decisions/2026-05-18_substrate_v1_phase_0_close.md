---
decision_id: 2026-05-18_substrate_v1_phase_0_close
date: 2026-05-18
owner: nick
status: active
related_canonical: [51_substrate_v1_sprint, 50_hauska_mcp_server, 49_code_ingestion_pipeline, 72_hauska_inc_operations, 00_current_state, CLAUDE.md, _decisions/2026-05-16_hauska_mcp_server_scenario_b]
---

## Decision

Close Phase 0 of [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) by ratifying all sixteen items. Twelve items adopt the inline-recommended defaults in 51 and 50. Three items are new binary calls landed this session: substrate v1 ingest budget funded from Hauska Inc. equity; `hauska.dev` registration deferred to Nick as a pre-launch action item with `mcp.hauska.dev` as the v1 MCP subdomain; the 25-city TX-first ingest list approved as listed in 51 Stream 1D with the Tier-3 M9 slot kept "Nick to name" deferred to batch-time. One item (revenue model) had been resolved 2026-05-16 prior to this session.

## Context

Phase 0 of the substrate v1 sprint listed sixteen consolidated decisions blocking stream-level dispatch across the `hauska-engine` and `hauska-mcp-server` repos. One item (revenue model) had been resolved 2026-05-16 as Scenario B per the per-product MCP tier model session and the companion decision record at [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](2026-05-16_hauska_mcp_server_scenario_b.md). The remaining fifteen items split into twelve ratification-shape items with defaults inline in 50 and 51 and three substantive open items (cost budget source; `hauska.dev` domain status; TX-first 25-city list confirmation including the M9 placeholder). Per the operator's session redirect earlier this turn, ECI atomization kickoff was deferred behind 51 so that M2-C extraction publishes `@hauska/atom-contract` before ECI Phase 3 needs it. This decision closes Phase 0 to unblock stream-level dispatch.

## Structural commitment check

Premortem clear across all four structural commitments. Most load-bearing: commitment #3 (cost per jurisdiction onboarded under $200 compute plus 1 hour human review, hard kill at three counties). The cost-budget-source decision directly addresses this commitment. Funding from Hauska Inc. equity carries the same 3-county hard-kill checkpoint already specified at [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) Stream 1D, so the funding source does not introduce slack against the hard-kill rule. Catalog-thesis check aligned: every ratified item respects brand placement (Cloud Run hosting, `mcp.hauska.dev` Hauska-namespaced subdomain), tier model (Layer 1 free at MCP server, Layer 2 paid inside Codex 1b), and MCP-first design.

## Reasoning

The twelve ratification items adopt defaults already operator-recommended in 50 and 51 with reasoning chains traceable to canonical docs read this session. Tool surface trim (`get_permit_requirements` rename to `search_permit_atoms`, drop parcel path) preserves Layer 1 honest-retrieval framing per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 2 and defers parcel atoms to Bump 2 per [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) Stream B and [`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md) open question #1. Quality bar (90% top-3 / 100% section-num / 95% cross-ref) is the 49-spec default per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.4. OCR (Claude vision primary, Tesseract fallback) and pipeline orchestration (Postgres job table + Cloud Run jobs) sharpen 49 §Open decisions which were left explicitly open; both picks are simplest-viable v1 defaults reversible if v1 evidence forces a change.

The three binary-call items reflect operator-direct knowledge or structural alignment. Cost budget from Hauska Inc. equity: cleanest source matching the corporate-substrate posture; avoids entangling ingest pace with deals still closing (Sylvia $1M proposal at [`74_commercial_agreements.md`](../74_commercial_agreements.md)) or with personal-finance routing. Domain status: `hauska.dev` not yet registered; Nick to register before Phase 5 deploy or Phase 7 launch; tracked as a pre-launch action item at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Domains section. TX-first list: the 10 Bastrop-network plus 10 TX metros plus 5 Tier-3 cities at [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D approved as listed; M9 Tier-3 slot stays "Nick to name" deferred to batch-time when better information is available.

## Reversal criteria

Phase 0 closure as a whole is reversible only by per-item revisit. Per-item reversal triggers. (a) Revenue model Scenario B to Scenario C if a PropTech embedder warm conversation surfaces inbound. (b) Backend coupling Route A to Route B if `hauska-engine` retrieval-api proves structurally unsound and `legacy-design-tools/artifacts/api-server` wrapping becomes the only viable path. (c) Quality bar 90/100/95 to recalibrated thresholds after first 10 jurisdictions' empirical data. (d) OCR Claude vision to Tesseract or Document AI if vision OCR quality on raw PDFs falls below acceptable on the first P2 jurisdiction. (e) Pipeline orchestration Postgres-plus-Cloud-Run to Temporal or Dagster or Airflow if v1 scale exposes coordination overhead. (f) Cost budget source from Hauska Inc. equity to Sylvia $1M proposal flow once that proposal closes. (g) TX-first list edits if any of the 25 cities turns out non-viable on adapter contact or partnership-routing.

## Dependencies

Depends on the prior decision at [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](2026-05-16_hauska_mcp_server_scenario_b.md) (revenue model = Scenario B), which is what makes Phase 8 self-serve paid tier in-scope and BD ownership N/A for v1. Unblocks stream-level dispatch across Tracks 1A through 1D (Code Ingestion Pipeline: adapters, extraction-and-atomization, storage-and-retrieval, eval-and-batch) and Tracks 2A through 2D (MCP Server: backend coupling and tools, auth and rate limit and Stripe, logging, deploy and docs and launch). Cross-repo sync points unchanged from 51: Bump 1 atom-contract coordination, retrieval-API contract stability, first-jurisdiction quality-bar pass, 20-jurisdiction launch gate, Texas IP attorney memo gate for non-Bastrop ingestion.

## Counterparties

Internal: Nick (operator, all three binary calls today). Affected: cc-agents 1 through 8 receiving Track 1A through 1D and 2A through 2D dispatches in the next session (assignments pending in [`00_current_state.md`](../00_current_state.md) agent-fleet section).

External: pre-launch dependencies. Texas IP attorney memo delivery and Tech E&O insurance routing per [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) carry forward as gates for non-Bastrop ingestion (Bastrop and Grand County remain unblocked) and paid Layer 2 surface launch respectively; neither is changed by this Phase 0 closure.
