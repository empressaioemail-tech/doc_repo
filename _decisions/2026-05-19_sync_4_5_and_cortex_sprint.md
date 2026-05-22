---
decision_id: 2026-05-19_sync_4_5_and_cortex_sprint
date: 2026-05-19
owner: nick
status: active
related_canonical: [51_substrate_v1_sprint, 42_design_accelerator_program_plan, 48_codex_program_plan, 40_design_accelerator, 40b_advanced_capture_features, 50_hauska_mcp_server, 28_mcp_first_product_design, 11_roadmap, 60a_eci_atomization_sprint, 00_current_state, CLAUDE.md, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer, _decisions/2026-05-18_substrate_v1_phase_0_close, _decisions/2026-05-18_substrate_v1_dispatch_reallocation]
---

## Decision

Launch a combined multi-track sprint covering four workstreams that converge on a single end state: legacy-design-tools running on Cloud Run with a fresh Neon prod instance, all Cortex/Codex L1-L6 surfaces shipped with co-designed MCP tool counterparts, substrate v1 closed at four Bastrop-network jurisdictions instead of twenty (Sync 4.5), and rendering / image-to-BIM / image-to-CAD descoped to a standalone queued doc.

The four workstreams:

1. **Substrate Sync 4.5.** Close substrate v1 at four jurisdictions: Bastrop UDC (via new B3 publisher adapter against bastrop.gov; partnership-confirmed; public-tier) plus Bastrop County re-ingest via Municode (partnership-pending; internal-tier) plus Smithville via Municode (partnership-pending; internal-tier) plus Elgin via Municode (partnership-pending; internal-tier). The "connected cities within one county" narrative threads the four into a coherent Bastrop-network partnership story. Sync 5 (the remaining 16+ TX cities) deferred to public-launch-sequenced demand.

2. **Cortex/Codex L1-L6 surfaces with MCP co-design per surface.** Ship all six surfaces named in `42_design_accelerator_program_plan.md` QA readiness milestone (L1 response-task, L2 sheet-content-extraction + attached-document, L3 deliverable-letter, L4 detail-callout-spec, L5 product-spec-reference, L6 deliverable-letter render). Each surface ships UI in legacy-design-tools plus MCP tool counterpart in hauska-mcp-server, co-designed for consumer-signature alignment. Plus existing-product MCP tool surfaces for Codex (finding-generation, override-write, briefing-fetch, snapshot-ingest) and Cortex (IFC ingest, BIM-model query, snapshot register, briefing emit). This is stronger than the minimum policy in `28_mcp_first_product_design.md` (which requires retrofit as a tracked roadmap item, not concurrent co-design).

3. **Replit decouple + Neon swap.** legacy-design-tools production moves from Replit autoscale at `prompt-agent-accelerator.replit.app` to Cloud Run; current Neon prod instance is swapped to a fresh prod-grade Neon instance per operator's specs. Cutover is a separate operator-led action sequenced after all of Lanes A, B, C.1, C.3, C.4 close.

4. **Rendering / image-to-BIM / image-to-CAD descope.** Three advanced capture lanes pulled from the active sprint into a new `40b_advanced_capture_features.md` doc with `status: queued` and an explicit activation gate (five conditions must clear).

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

The descope of rendering + image-to-BIM + image-to-CAD to `40b_advanced_capture_features.md` follows the same logic in reverse: those three lanes do not share infrastructure with the L1-L6 + MCP + cutover work, would saturate agent fleet capacity if pulled into this sprint, and are not required for the next QA cycle. Pulling them into a queued standalone doc with an explicit activation gate preserves the architectural intent in the doc set without bleeding into sprint scope.

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
- Rendering (mnml.ai integration depth), image-to-BIM, image-to-CAD — descoped to [`40b_advanced_capture_features.md`](../40b_advanced_capture_features.md) with explicit activation gate.
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

Operator parallel actions (post-amendment 2026-05-19):

- **Decision 0.19 — withdrawn from sprint-tracked actions.** Operator does not want Sylvia outreach surfaced as a sprint-tracked dependency. Path A still applies structurally: Smithville, Elgin, Bastrop County ingest tags as internal-tier per the visibility partition on `jurisdiction-corpus`. Whether and when partnership closes for those three is parallel bizops on operator pace; not a sprint gate.
- **Decision 0.20 — operator-confirmed 2026-05-19** via AskUserQuestion follow-up after planner-resolution amendment. Specs landed in Lane C.2 dispatch Read first step 6: same GCP project as smartcity-os production, service name `cortex-api`, `us-central1` region; new Neon prod instance **separate** from hauska-engine substrate stack, closest Neon region to us-central1, **Neon Scale tier** (24/7 compute + autoscaling + branching + PITR — the branching plus PITR are the real safety nets for the cutover and ongoing schema migrations); production domain keeps `prompt-agent-accelerator.replit.app` DNS short-term (CNAME swap to Cloud Run at cutover) with Cortex-branded subdomain as queued follow-on (Nick names exact domain).

## Sprint amendments

**Amendment 1 (2026-05-19): site context tab / ingestion broken.** Added to Lane C.1 as sub-task C.1.6 per [`_dispatches/2026-05-19_cc-agent-C_quick_wins_and_schema.md`](../_dispatches/2026-05-19_cc-agent-C_quick_wins_and_schema.md). Operator-reported issue. cc-agent-C diagnosis pivoted the framing: 3D tab not actually broken (empty-state placeholder renders correctly for engagements with no briefing sources); real bug was `/me/notifications` 401-spam every 5s from an unconditional poll in AppShell.tsx. Fix shipped as PR #34 (CI green, operator merge). Diagnosis at `_research/2026-05-19_site_context_diagnosis.md`. The mis-framing carries a process lesson — three of six C.1 sub-tasks had stale dispatch premises (C.1.2 already merged, C.1.3 already fixed, C.1.6 mis-framed). Future dispatches should verify against current main state before scoping.

**Amendment 2 (2026-05-19): Decision 0.19 dropped as sprint-tracked action; Decision 0.20 operator-confirmed.** Per operator at sprint amendment + AskUserQuestion 2026-05-19. Path A still locked structurally per pre-mortem. Decision 0.20 specs operator-confirmed.

**Amendment 3 (2026-05-19): Sync 4.5 closes at 3 of 4 jurisdictions; Smithville structurally deferred.** Per cc-agent-E sessions at [`_sessions/2026-05-19_sync_4_5_close_cc-agent-E.md`](../_sessions/2026-05-19_sync_4_5_close_cc-agent-E.md) and [`_sessions/2026-05-19_smithville_ecode360_blocker_cc-agent-E.md`](../_sessions/2026-05-19_smithville_ecode360_blocker_cc-agent-E.md). Two dispatch-assumption breaks surfaced during live ingest: (a) Bastrop County is NOT on Municode — Subdivision Regulations live as PDF on bastropcounty.gov; handled cleanly by the new `RawPdfAdapter` shipped with PR #5. (b) Smithville is NOT on Municode — code lives on eCode360 (`ecode360.com/SM6484`). Initial cc-agent-E read flagged the eCode360 adapter as a stub completable in ~1 session; deeper recon upgraded the finding to a **structural blocker**: HTTP 403 on the source for both ingest and browser user-agents (bot protection); robots.txt disallows `/documents/`, `/search`; no city-hosted alternate PDF on smithville.tx.us. Substantive access requires General Code's eCode360 partner API. Per Commitment #2 (partnership-first sourcing), this is a partnership conversation, not a cc-agent-buildable adapter. Routed to bizops; General Code added to [`73_partnerships.md`](../73_partnerships.md) as a publisher-aggregator partnership target. **Sync 4.5 fires at 3-of-4** (Bastrop UDC public-free + Bastrop County + Elgin platform-internal). Hard-kill cost checkpoint still cleanly cleared (4 onboarding events including Grand County, ~$0 compute + ~3.5 hr human review).

**Amendment 4 (2026-05-19): Decision 0.20 production-domain spec corrected.** Original planner-resolved framing was "CNAME-swap `prompt-agent-accelerator.replit.app` to Cloud Run at cutover." cc-agent-C surfaced that this is technically impossible: `*.replit.app` is Replit-owned DNS and cannot be repointed by Empressa. Operator amended: **stand up `cortex.empressa.io`** pointed at Cloud Run BEFORE cutover; old `prompt-agent-accelerator.replit.app` URL accepted as dying at cutover (any external links sitting on the old URL break at cutover; acceptable given customer-zero scope today is internal Empressa use). Lane C.2 scope updated: Cortex subdomain setup pulled from "long-term follow-on" into C.2 scope; C.2.5 cutover runbook gains a pre-cutover checklist line (subdomain live + TLS valid + DNS resolves to Cloud Run service before traffic shift). Operator confirmed empressa.io domain ownership 2026-05-19. Captured in [`_dispatches/2026-05-19_cc-agent-C_replit_decouple.md`](../_dispatches/2026-05-19_cc-agent-C_replit_decouple.md) Read first step 6.

**Amendment 5 (2026-05-19): Worktree-per-agent rule codified.** Per recurring shared-working-tree incidents flagged by cc-agent-M and cc-agent-E independently during the Lane B / Lane A.2 race. Operator confirmed codification path via AskUserQuestion. New runbook at [`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md) — one clone per cc-agent; cross-repo work uses `git worktree add` from a separate clone; recon-time refusal when entering a working tree owned by another agent. Dispatch boilerplate clause added for all future cc-agent dispatches.

**Amendment 6 (2026-05-19): L-surface backend location clarified — legacy-design-tools is the runtime home.** Per cc-agent-M's correction during Group 3 L1+L2 work. Planner's earlier answer to cc-agent-M's Group 3 prep-research open question ("backend location for L1-L6 atoms") was framed as "hauska-engine packages/atoms/ per option β" — this was the **shape/contract** location, not the **runtime persistence** location. The hauska-engine retrieval-api is read-only with no persistence. **Correct mapping:**
- Atom **shape/contract** lives in `hauska-engine/packages/atoms/` (option β; what cc-agent-E ships).
- Atom **persistence/runtime** lives in `legacy-design-tools` Postgres (for Cortex/Codex product atoms).
- MCP **tools** call legacy-design-tools endpoints via cc-agent-M's `legacy-client.ts`.
- The legacy endpoints for L1-L6 atoms **do not exist yet** — cc-agent-M defined them in `legacy-client.ts` (mocked-fetch tested) plus published a canonical contract doc at [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md). **cc-agent-C builds the matching endpoints as part of Lane C.4** alongside the UI surfaces.

Lane C.4 dispatch scope expanded: per-surface work is now endpoints + UI, not just UI. The dispatch frontmatter and Read first sections add the contract doc as canonical reference.

L-surface atoms also get real `did:hauska:` DIDs via a new `lSurfaceProvenance` helper, unlike Groups 1+2's synthetic `legacy:` identifiers. Cleaner contract for downstream consumption.

**Planner discipline lesson:** when a cc-agent asks an open question about a system they're closer to than the planner, the planner's answer should weight the agent's proximity higher than canonical docs that aren't speaking to the exact question. This is the second such correction in the sprint (first was Decision 0.20 ④ Replit DNS impossibility caught by cc-agent-C). Capture: planner answers to cc-agent open questions should explicitly invite "if this answer doesn't match the system as you see it, correct me before acting."

**Amendment 7 (2026-05-19): L-surface atom shape consumption — Path A (mirror schemas into consumer repos).** Per cc-agent-C's first-contact recon on Lane C.4: `@hauska-engine/atoms@0.6.0` is `private: true` and unpublished — `legacy-design-tools` cannot `pnpm add` it. Three paths considered: (A) mirror the 7 L-atom Zod schemas verbatim into a local module per consumer repo with header-pinned engine version + contract-conformance test against the endpoint contract doc; (B) flip `private: false` and publish `@hauska-engine/atoms` to npm or GitHub Packages; (C) `file:` or git path dependency to a local hauska-engine clone. **Path A locked.** Rationale: ADR-018 commits to publishing `@hauska/atom-contract` (framework) as the cross-repo substrate seam, NOT per-catalog atom packages — engine atoms are downstream of the framework, not peer-to-it. Per Amendment 6, the endpoint contract IS the canonical cross-repo seam (JSON over HTTP), not Zod imports. cc-agent-M's `legacy-client.ts` is already a mirror of the engine schemas; Path A keeps both consumers (mcp + legacy) symmetric and bounded by the same contract doc. Path B requires a Hauska Inc. publishing decision mid-sprint with cc-agent-E wound down — out of scope and would atomize the substrate-layer story ADR-018 settled. Path C breaks standalone CI (Cloud Run can't depend on a workstation clone). **Convention**: mirror file header reads `// Mirrored from @hauska-engine/atoms@<version> (SHA <commit>). Source of truth is hauska-engine/packages/atoms/src/instances.ts. Re-mirror on engine atoms version bump; surface any contract drift to the planner before changing schemas locally.` Mirror module location follows existing per-repo conventions (e.g., `legacy-design-tools/lib/atoms-l-surface/` matches `lib/db/`, `lib/finding-engine/` pattern). Contract-conformance test parses representative JSON examples from the endpoint contract doc against the local Zod schemas — any shape drift surfaces in CI. **This convention extends to all future catalog-atom consumers** (Codex side, Parcel Intelligence atoms when 46 sequences in, ECI atomization sprint when P1 fires) until ADR-018 layering changes.

**Amendment 8 (2026-05-20): Lane C.4 contract extensions ratified as in-scope.** Per cc-agent-C's PR #51 body (the consolidated Lane C.4 L2-L6 PR, merged 2026-05-20 10:25Z) and the operator's ratification call this session. Three contract extensions surfaced during cc-agent-C's implementation:

1. **L3/L6 read + download endpoints added beyond the original contract.** `GET /api/engagements/:engagementId/deliverable-letters` (list), `GET /api/deliverable-letters/:letterId` (fetch by id), `GET /api/deliverable-letter-renders/:renderId/file` (byte-serve download). UIs needed them; the original contract was write-path-only at L3/L6. Ratified as in-scope: symmetric capability IS dual-interface coherence per the sprint thesis. cc-agent-M follow-on dispatch grows `legacy-client.ts` + adds three matching MCP tools (`cortex_deliverable_letter_list`, `cortex_deliverable_letter_fetch`, `cortex_deliverable_letter_render_download`) before Group 4 e2e fires.
2. **BaseAtomInstance field convention codified.** Every L-atom instance carries `sourceAdapter` / `sourceUrl` / `contentHash` / `fetchedAt` provenance fields, centralized in `legacy-design-tools/lib/lSurfaceAtom.ts`. L5 `sourceUrl` carries the ICC-ES report URL per the engine atom docstring. cc-agent-M's `legacy-schemas.ts` (PR #12) and the cross-mirror diff should pick these up on the next mirror pass.
3. **Event-casing resolved to dot form; L1 transitions + L4 events filled.** Event names use `<atom-type>.<verb>` dot form (e.g., `response-task.opened`, `deliverable-letter.sent`). L1 gains a canonical transition table (open → in-progress → done | cancelled; transitions back from `done` or `cancelled` are forbidden — server returns `409 response_task_transition_forbidden`). L4 gains two new events the contract was silent on: `detail-callout-spec.revised` (when a `rejected-by-user` spec is edited and pushed again) and `detail-callout-spec.aps-ref-attached` (when the APS Design Automation work-item ref lands on the atom).

**Acknowledged but not ratified as contract changes** (PR #51 body items 2, 4, 5, 6): dual-auth fail-closed in prod pending legacy-design-tools task #29 (SPA session-path audience tightening); L2a structured-annotation extractor is stub + L2b attached-document has no producer (engine-side post-sprint follow-on, tracked in `27_engine_evolution_plan.md` Stream B); L5 ICC-ES URL/scrape is best-effort (`ICC_ES_REPORT_URL_TEMPLATE` env var; status parser returns `null` rather than guessing); L6 DOCX is minimal OOXML (QA-cycle polish). These are v1 limitations, not contract drift.

**Operational consequence.** Cutover runbook gains two pre-cutover env-var requirements: `SERVICE_API_KEY` on Cloud Run (must equal MCP server's `LEGACY_BACKEND_API_KEY` or the bearer path fails) and `ICC_ES_REPORT_URL_TEMPLATE` (operator-tunable per PR #51 note 5). Captured in `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` Stage 0.

Updated endpoint contract doc carries the three new endpoints + the convention extensions: [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Amendment 9 (2026-05-22): Sync 5 un-deferred.** The Out-of-scope deferral of "Sync 5 remaining 16+ TX cities ... to public-launch-sequenced demand" is superseded. Per the operator's 2026-05-22 call and [`2026-05-22_sync5_texas_ingest_undeferred.md`](2026-05-22_sync5_texas_ingest_undeferred.md), cc-agent-E runs the Texas ingest ladder continuously toward statewide coverage; Tier 2 central-Texas is dispatched. The capacity-protection rationale for the deferral lapsed once the substrate-v1 plus Cortex/Codex plus cutover crunch closed; access-blocked platforms still route to the General Code partnership track per Commitment 2.

## Counterparties

Internal: Nick (operator, all four pre-mortem resolutions plus decisions 0.19 + 0.20 + sprint-wide go-ahead). Affected agents: cc-agent-AC (Lane Foundation), cc-agent-E (Lane A.1 + A.2), cc-agent-M (Lane B), cc-agent-C (Lane C.1-4 sequenced), planner (this Claude Code session in doc_repo, sprint coordination).

External: Sylvia Carrillo (partnership outreach for Smithville, Elgin, Bastrop County per Decision 0.19). No other external counterparty engagement in this sprint scope.
