---
decision_id: 2026-05-19_sync_4_5_and_cortex_sprint
date: 2026-05-19
owner: nick
status: active
related_canonical: [51_substrate_v1_sprint, 42_design_accelerator_program_plan, 48_codex_program_plan, 40_design_accelerator, 41_advanced_capture_features, 50_hauska_mcp_server, 28_mcp_first_product_design, 11_roadmap, 60a_eci_atomization_sprint, 00_current_state, CLAUDE.md, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer, _decisions/2026-05-18_substrate_v1_phase_0_close, _decisions/2026-05-18_substrate_v1_dispatch_reallocation]
---

## Decision

Launch a combined multi-track sprint covering four workstreams that converge on a single end state: legacy-design-tools running on Cloud Run with a fresh Neon prod instance, all Cortex/Codex L1-L6 surfaces shipped with co-designed MCP tool counterparts, substrate v1 closed at four Bastrop-network jurisdictions instead of twenty (Sync 4.5), and rendering / image-to-BIM / image-to-CAD descoped to a standalone queued doc.

The four workstreams:

1. **Substrate Sync 4.5.** Close substrate v1 at four jurisdictions: Bastrop UDC (via new B3 publisher adapter against bastrop.gov; partnership-confirmed; public-tier) plus Bastrop County re-ingest via Municode (partnership-pending; internal-tier) plus Smithville via Municode (partnership-pending; internal-tier) plus Elgin via Municode (partnership-pending; internal-tier). The "connected cities within one county" narrative threads the four into a coherent Bastrop-network partnership story. Sync 5 (the remaining 16+ TX cities) deferred to public-launch-sequenced demand.

2. **Cortex/Codex L1-L6 surfaces with MCP co-design per surface.** Ship all six surfaces named in `42_design_accelerator_program_plan.md` QA readiness milestone (L1 response-task, L2 sheet-content-extraction + attached-document, L3 deliverable-letter, L4 detail-callout-spec, L5 product-spec-reference, L6 deliverable-letter render). Each surface ships UI in legacy-design-tools plus MCP tool counterpart in hauska-mcp-server, co-designed for consumer-signature alignment. Plus existing-product MCP tool surfaces for Codex (finding-generation, override-write, briefing-fetch, snapshot-ingest) and Cortex (IFC ingest, BIM-model query, snapshot register, briefing emit). This is stronger than the minimum policy in `28_mcp_first_product_design.md` (which requires retrofit as a tracked roadmap item, not concurrent co-design).

3. **Replit decouple + Neon swap.** legacy-design-tools production moves from Replit autoscale at `prompt-agent-accelerator.replit.app` to Cloud Run; current Neon prod instance is swapped to a fresh prod-grade Neon instance per operator's specs. Cutover is a separate operator-led action sequenced after all of Lanes A, B, C.1, C.3, C.4 close.

4. **Rendering / image-to-BIM / image-to-CAD descope.** Three advanced capture lanes pulled from the active sprint into a new `41_advanced_capture_features.md` doc with `status: queued` and an explicit activation gate (five conditions must clear).

## Context

The operator's framing across the 2026-05-19 session: "right now I have a lot of testing to do and have no need for 20 jurisdictions my test projects are in grand county and bastrop. Cortex / codex I would prefer to have all the other queued surfaces shipped before qa as well as those were part of my last qa cycle. then I want to see MCP wired into codex and cortex respectively so i can test everything through my workflows. From there I will have another host of fixes and enhancements to do. We should probably have the rendering portions and the image to bim and image to cad features as a stand alone after we get these base capabilities stable."

This decision converts that intent into a structured sprint plan. The original 20-jurisdiction Sync 5 target was the public-launch unblocker, not the internal-QA unblocker; sequencing substrate-side work behind the operator's actual test surface (Grand County done, Bastrop next) is the right move. Cortex/Codex L1-L6 was already scoped per `42` and `48` Phase 2; this sprint folds in MCP co-design because the operator's next QA cycle is expected to flow through MCP-driven agent workflows. The Replit decouple + Neon swap regains direct ownership of the database and removes the operator from Replit's autoscale assumptions; pre-mortem accepts that a known-deferred IFC import bug rides into this sprint on the bet that a clean Cloud Run + fresh Neon environment surfaces the real root cause.

## Structural commitment check

Pre-mortem run via `premortem-check` skill 2026-05-19. Cleared **GREEN** after operator resolution of two load-bearing yellows:

- **Commitment 2 (partnership-first sourcing).** Initial yellow on Smithville, Elgin, Bastrop County (no named partnership status). Resolved as **Path A**: Sylvia leads outreach in parallel; ingest tags the three as internal-tier via a visibility partition on the `jurisdiction-corpus` atom (or via ADR-017 `accessPolicy: 'platform-internal'`, whichever shape is cleaner at the contract level). Public catalog (Hauska MCP Server `list_jurisdictions` to unauthenticated callers) does not surface partnership-pending jurisdictions. Bastrop UDC stays partnership-confirmed and surfaces publicly.

- **Commitment 3 (cost per jurisdiction).** Yellow on "three counties" vs "three jurisdictions" semantics in the hard-kill checkpoint. Resolved by tightening `51_substrate_v1_sprint.md` language to "three jurisdictions" — confirms the loose-reading intent (proof of cost model at multiple onboarding events, not literal county count). Grand County (done) + 4 Sync 4.5 jurisdictions = 5 onboarding events, well past the threshold. Bastrop County publisher source confirmed Municode (no new adapter beyond B3 for Bastrop UDC) per operator: "Bastrop was already ingested into the replit version, it's municode we can redo it to make sure its tight."

Commitment 1 (sell reasoning), Commitment 4 (dual interface), Hauska spine rule, focus queue rule (with explicit named queues — Sync 5 deferred, rendering descoped, ECI P1 stays queued, SmartCity OS WS-1/3/4 remainder stays queued), and quality gate rule all clear GREEN without resolution work.

Operator acknowledged sprint size without timeframe estimates per the saved feedback memory: tasks are stacked in execution order with dependencies named; no day/week/agent-session conversions.

## Reasoning

The single combined sprint shape is preferred over four sequential sprints for three reasons.

First, the work is genuinely parallel across three repos. Lane Foundation (hauska-atom-contract minor bump) fires once and is brief. Lane A (hauska-engine substrate + L-surface atom shapes), Lane B (hauska-mcp-server tool surfaces), and Lane C (legacy-design-tools infrastructure + UI surfaces) run in parallel with two cross-lane synchronization points (Sync A = v1.1.0 publish; Sync B = atom-shape lock per surface, fires six times). One Cursor terminal per repo per the operator's preferred shape. Merge coordination is intra-repo within each lane, not cross-repo, which limits the merge-coordination blast radius that bit the substrate v1 Bump 1 rollout.

Second, the cutover (legacy-design-tools Replit → Cloud Run + Neon swap) is a natural sprint terminator. The operator wants to QA against the new infrastructure; that QA cycle is the post-sprint event. Putting the cutover inside this sprint rather than treating it as a separate later sprint lets the operator finish all dependency-laden work first and then flip the switch cleanly.

Third, MCP co-design with L-surface UI is materially cheaper than UI-first-then-retrofit-later. Per the 2026-05-19 session conversation, the cost is roughly 20% extra per surface for co-design; the savings is one full retrofit pass per surface later. Sequencing this sprint with co-design avoids paying that retrofit cost.

The descope of rendering + image-to-BIM + image-to-CAD to `41_advanced_capture_features.md` follows the same logic in reverse: those three lanes do not share infrastructure with the L1-L6 + MCP + cutover work, would saturate agent fleet capacity if pulled into this sprint, and are not required for the next QA cycle. Pulling them into a queued standalone doc with an explicit activation gate preserves the architectural intent in the doc set without bleeding into sprint scope.

## Sprint execution shape

Three lanes plus Lane Foundation, one Cursor terminal per repo, stacked dispatches per the master plan written into this session's planning artifacts and saved to `C:\Users\cente\.claude\plans\abundant-scribbling-kitten.md`. Cross-lane synchronization at Sync A (v1.1.0 publish, fires once) and Sync B per surface (six surfaces, fires six times). Cutover is Stage 9 operator-led; gates on all other lanes closed.

Dispatch files capturing each lane's scope:

- Lane Foundation: [`_dispatches/2026-05-19_cc-agent-AC_atom_contract_visibility_field.md`](../_dispatches/2026-05-19_cc-agent-AC_atom_contract_visibility_field.md)
- Lane A.1: [`_dispatches/2026-05-19_cc-agent-E_sync_4_5_jurisdictions.md`](../_dispatches/2026-05-19_cc-agent-E_sync_4_5_jurisdictions.md)
- Lane A.2: [`_dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes.md`](../_dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes.md)
- Lane B: [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](../_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md)
- Lane C.1: [`_dispatches/2026-05-19_cc-agent-C_quick_wins_and_schema.md`](../_dispatches/2026-05-19_cc-agent-C_quick_wins_and_schema.md)
- Lane C.2: [`_dispatches/2026-05-19_cc-agent-C_replit_decouple.md`](../_dispatches/2026-05-19_cc-agent-C_replit_decouple.md)
- Lane C.3: [`_dispatches/2026-05-19_cc-agent-C_ui_4_and_engagement_detail_split.md`](../_dispatches/2026-05-19_cc-agent-C_ui_4_and_engagement_detail_split.md)
- Lane C.4: [`_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md`](../_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md)

## Out of scope

Explicitly named per the focus queue rule:

- Sync 5 remaining 16+ TX cities (Round Rock, Pflugerville, Cedar Park, Leander, Hutto, Taylor, Georgetown, Austin, San Antonio, Fort Worth, El Paso, Plano, Arlington, Irving, Garland, Lubbock, Laredo, Jarrell, Frisco, McKinney, Killeen, M9-TBD) — deferred to public-launch-sequenced demand.
- Rendering (mnml.ai integration depth), image-to-BIM, image-to-CAD — descoped to [`41_advanced_capture_features.md`](../41_advanced_capture_features.md) with explicit activation gate.
- ECI atomization Phase 1 (registry scaffold) plus Phase 2 (backfill) — stays queued during this sprint; cc-agent allocation deferred per [`60a_eci_atomization_sprint.md`](../60a_eci_atomization_sprint.md).
- SmartCity OS WS-1 (migration spine) plus WS-3 (security sweep remainder) plus WS-4 (schema / multi-tenancy) — stays queued behind this sprint per [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md).
- IFC import bug (the deferred-bug carry-over): explicitly accepted into sprint scope as a deferred verification. Stage 9 retry against post-cutover Cloud Run + new Neon is the verification gate. If still broken post-cutover, dedicated debug session post-sprint; do not block QA cycle on it without explicit operator authorization.
- Mox prospect work, TX IP attorney memo, Tech E&O insurance routing — parallel bizops; not sprint-gated per [[skip-tx-ip-attorney-as-gate]] and `72_hauska_inc_operations.md`.

## Reversal criteria

Sprint pause + scope re-cut triggered by any of:

(a) **Cost-per-jurisdiction failure.** Any of the four Sync 4.5 jurisdictions exceeds the $200 compute + 1 hr human review target. Surface for engineering review per `51` Stream 1D; do not silently absorb.

(b) **Cutover data-loss risk.** Lane C.2 dry-run surfaces a Neon migration diff that includes drops, transformations, or referential-integrity gaps that cannot be cleanly bounded. Pause sprint at cutover gate; operator decides whether to proceed with mitigation, postpone cutover to a later sprint, or revisit the Neon swap shape.

(c) **L-surface scope drift exceeding agent throughput.** If any L# surface's atom shape or UI consumer signature drifts substantially during implementation (e.g., L3 deliverable-letter atom needs major restructure mid-flight), pause that surface; operator decides whether to descope that L# from this sprint, accept the drift, or rework the dispatch.

Per-criterion reversal does not require sprint-wide reversal — partial scope cuts are acceptable to keep progress on the other tracks.

## Dependencies

This decision depends on the prior decisions at [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](2026-05-18_substrate_v1_phase_0_close.md) (substrate v1 Phase 0 closed; Streams 1A-1D and 2A-2D unblocked), [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](2026-05-18_substrate_v1_dispatch_reallocation.md) (per-repo single-agent ownership; cc-agent-AC, cc-agent-E, cc-agent-M roles confirmed), and ADR-018 (atom contract substrate layer; option β for catalog atoms in engine atom-registry).

Operator actions required in parallel to sprint launch:

- **Decision 0.19** — Ping Sylvia: partnership outreach for Smithville, Elgin, Bastrop County. Internal-tier ingest proceeds in parallel; partnership close flips visibility from `internal` to `public` per Path A.
- **Decision 0.20** — Cloud Run target project specs (region, project name, service naming); new Neon prod instance specs (region, plan tier, co-tenanted with hauska-engine stack vs separate); production domain decision (keep `prompt-agent-accelerator` until later vs new domain at cutover).

## Counterparties

Internal: Nick (operator, all four pre-mortem resolutions plus decisions 0.19 + 0.20 + sprint-wide go-ahead). Affected agents: cc-agent-AC (Lane Foundation), cc-agent-E (Lane A.1 + A.2), cc-agent-M (Lane B), cc-agent-C (Lane C.1-4 sequenced), planner (this Claude Code session in doc_repo, sprint coordination).

External: Sylvia Carrillo (partnership outreach for Smithville, Elgin, Bastrop County per Decision 0.19). No other external counterparty engagement in this sprint scope.
