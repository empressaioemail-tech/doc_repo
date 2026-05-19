---
id: 2026-05-19_substrate_v1_wind_down_claude_code
title: Session — substrate v1 sprint wind-down (Syncs 1-4 fired; full Grand County coverage; Session B queued for fresh planner)
date: 2026-05-19
agent: claude_code
applies_to: portfolio
related: [51_substrate_v1_sprint, 27_engine_evolution_plan, 26_atom_upgrade_guide, 80_adrs/adr_018_atom_contract_substrate_layer, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _sessions/2026-05-19_post_sync_1_doc_sweep_claude_code, _sessions/2026-05-19_grand_county_path_b_sync_4_cc-agent-E, _sessions/2026-05-19_grand_county_landuse_cc-agent-E, _sessions/2026-05-19_stream_2a_wiring_cc-agent-M, _sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC]
---

# Substrate v1 sprint wind-down

## Purpose

Today produced a substantial batch of substrate v1 sprint work across three cc-agents plus the substrate-v1 planner. Operator is winding the session down and opening a fresh planner for the next round of work. This summary synthesizes today's deliveries, captures the current state of every sync point, names the explicit Session B hand-off for Bastrop UDC, and points the fresh planner at the relevant artifacts.

Read this first if you are picking up the substrate v1 sprint planner role for the first time.

## State as of 2026-05-19 wind-down

### Sync points

| # | Sync point | Status | Reference |
|---|---|---|---|
| 1 | Bump 1 atom contract published | **DONE** | `@hauska/atom-contract@1.0.0` on npm; v1.0.0 tag pushed; cc-agent-AC bootstrap commit `824e68e` plus post-publish chore `bc8c6d8` |
| 2 | Adapter contract stable | **DONE** | `packages/corpus/src/adapters/types.ts` plus conformance suite per cc-agent-E foundation `5049961` |
| 3 | Retrieval API contract stable | **DONE** | `services/retrieval-api/src/server.ts` plus 10-test contract suite per cc-agent-E foundation `5049961`; consumed by cc-agent-M Stream 2A wiring per PR #1 squash-merge |
| 4 | First jurisdiction passes eval | **DONE** | Grand County partial (IRC R301 + IWUIC; 75 atoms) passed 0.9 / 1.0 / 1.0 quality bar per cc-agent-E PR #3 commit `cbe4852` |
| 5 | Quality-gated 20-jurisdiction corpus | Open | Grand County fully covered at 290 atoms (IRC R301 14 + IWUIC 61 + LAND_USE 215) per cc-agent-E PR #4 `96acce6`; Bastrop UDC pending Session B; 18 other TX cities sequenced after |

Sync 6 (Texas IP attorney memo) dropped from `51` §Sync points table 2026-05-19 per operator deprioritization; the memo work continues as parallel bizops in `72_hauska_inc_operations.md` and is not a substrate-v1 ingestion gate. See [`memory/skip-tx-ip-attorney-as-gate.md`](../../memory/skip-tx-ip-attorney-as-gate.md) for the durable rule.

### Cc-agent state

cc-agent-AC (`hauska-atom-contract`). Steady-state post-publish. Two commits on origin/main: `824e68e` (bootstrap + framework port + npm publish + v1.0.0 tag) and `bc8c6d8` (chore: clean-script trim plus npm-hauska helpers). 52/52 tests; build clean. Future minor/patch driven by framework changes only (new render modes, ContextSummary fields).

cc-agent-E (`hauska-engine`, all Track 1). Four PRs squash-merged: PR #1 (atom-contract-pin shim flip post Sync 1), PR #2 (Path B migration tool), PR #3 (Grand County partial Sync 4), PR #4 (Grand County LAND_USE toward Sync 5). Full Grand County coverage at 290 atoms across IRC R301, IWUIC, and LAND_USE. Three substrate-quality improvements shipped from the live runs: synthesize-xrefs in-corpus-only per clean ADR-010 reading; exact-string section-number lookup in StoragePort; section-number anchor boost (+0.25) with `#partN` ingest-artifact strip. Path C Bastrop UDC walked live against Municode and surfaced the structural finding that Bastrop UDC lives outside Municode (BASTROP BUILDING BLOCK / B3 CODE on bastrop.gov).

cc-agent-M (`hauska-mcp-server`, all Track 2). One PR squash-merged: PR #1 covers Stream 2B foundations (auth + Postgres `api_keys` + Upstash dual-window rate limit + admin endpoints) plus Stream 2A wiring (hauska-client.ts against real Sync 3 retrieval API + tool surface trim + atom-shape response formatting + attribution metadata). 38/38 tests green; tsc clean. Two cross-repo workspace-hygiene incidents captured: the MCP SDK stateless-transport bug from the 2B scaffold (caught and fixed in 2A); the cross-repo engine fix `d55d51d` that pushed alongside cc-agent-E's then-unpushed `4256bf2` from a shared working tree (no remediation needed; pattern now locked as flag-through-repo-owner). Streams 2C (structured logger upgrade) and 2D (Cloud Run scaffold + docs site + cross-client testing + launch prep) queued. Stream 2B Stripe scaffold plus self-serve signup deferred per Phase 8.

### Substrate-v1 planner state

This Claude Code session (substrate v1 planner in doc_repo). Today's commits:
- Post-Sync-1 doc-sweep ([`_sessions/2026-05-19_post_sync_1_doc_sweep_claude_code.md`](2026-05-19_post_sync_1_doc_sweep_claude_code.md)): applied option β framing across [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 (renamed to engine atom-registry coordination), [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Contract version bump (reframed to engine atom-registry version bump), [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) §4 scope note, [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) §Known follow-on bullet; Sync 6 scrub across `51` §Sync points table plus [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) IP attorney memo section plus cc-agent-E dispatch.
- CLAUDE.md em-dash rule clarified ([commit `b13ad6b`](../CLAUDE.md)): body prose stays em-dash-free; titles, commit subjects, verbatim brand strings, and direct quotes are exempt. Cc-agent-AC, -M, and -E all independently flagged the original rule's collision with their work.
- This wind-down sweep ([`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points table marked 1-4 done; [`CLAUDE.md`](../CLAUDE.md) "What is settled" substrate v1 paragraph rewritten to reflect Syncs 1-4 done plus all Bump 1 PRs merged; [`00_current_state.md`](../00_current_state.md) §4 fleet, §5 sessions, §6 watch entries all refreshed).

### Cortex/engine recon planner state (planning agent B)

Parallel planner stream running Cortex / legacy-design-tools work; coordinates with substrate v1 planner via cross-planner sync messages. Today's deliveries:
- DA-BIM-Symmetry (legacy-design-tools PRs #28 + #29 merged): IFC ingest produces `bim-model` atom symmetrically with Push-to-Revit. Viewport verification surfaced Neon prod missing `snapshot_ifc_files` table; supervised drizzle-kit push applied Track B IFC schema 2026-05-19.
- UI-2 findings mock-to-real swap (cc-agent-UI-2; PR pending push): 732-line `findingsMock.ts` deleted; every hook delegates to the generated Orval client; 170/170 plan-review tests pass; zero UI changes.
- Eval harness scaffold (cc-agent-EVAL, legacy-design-tools commit `5f5b84c`): `@workspace/eval` package; rubric scorers + 21 unit tests; finding/briefing/retrieval runners; instrumented Anthropic wrapper. Schema regression flagged at [`00_current_state.md`](../00_current_state.md) §6 (eval tables wired into `lib/db/src/schema/index.ts` on the branch but absent from main per local inspection; ULID column-type regression at `reviewer_requests.triggered_action_event_id` from PR #29 commit 2 also surfaced). Worth a `gh pr view 26` + `gh pr view 29` to confirm merge state.
- Read-only recons landed earlier (cc-agent-UI 50 surfaces, cc-agent-PR 59 stages); side-intel routed to cc-agent-E for forward-looking hauska-engine scope decisions.

Bim-model symmetry fix stays in Cortex track and does not enter the substrate v1 Bump 1 cross-PR rollout per the 2026-05-19 cross-planner sync. Disambiguation: "Bump 1 window" (post-publish Cortex unlock window) vs "Bump 1 cross-PR rollout" (substrate v1 planner-owned consumer pin updates) are now distinct framings per [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Bump 1 window behavior fixes.

## Hand-off for the fresh planner

### Explicit next dispatch — Session B (Bastrop UDC B3 publisher adapter)

cc-agent-E's session A.5 summary at [`_sessions/2026-05-19_grand_county_landuse_cc-agent-E.md`](2026-05-19_grand_county_landuse_cc-agent-E.md) names Session B explicitly. Recap:

Bastrop's UDC (locally "BASTROP BUILDING BLOCK" or "B3 CODE") lives on bastrop.gov, not Municode. Chapter 14 in Municode contains only three adoption-pointer sections saying "code adopted by reference; see city's website." cc-agent-E walked Municode live to surface this. Path C Municode adapter cannot resolve Bastrop UDC content; a new B3 publisher adapter against bastrop.gov is required.

Foundation in place: `MunicodeJsonClient` pattern plus `MunicodeHtmlAdapter` JSON-mode shape from PR #2; the `path-c-ingest` orchestrator with five CLI subcommands; UDC curated query scaffold from Session B's recon. Estimated ~1 session of work to build the adapter, ingest Bastrop UDC, atomize, eval, and signal toward Sync 5.

Operator note from the 2026-05-19 wind-down: Session B will be allocated to a different agent than cc-agent-E if the fresh planner agrees. cc-agent-E could also continue; allocation is the fresh planner's call.

The substrate-v1 planner drafted the Session B dispatch shape in conversation with the operator but did not file it. The fresh planner should draft the formal dispatch prompt referencing the foundation in PR #2 plus the recon findings at [`_sessions/2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md`](2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md) (Path C live walk) plus cc-agent-E's session A.5 framing of Session B scope.

### Outstanding queue for substrate v1

1. **Session B — Bastrop UDC B3 publisher adapter**. Above. Critical-path for Sync 5.
2. **18 other TX cities batch ingest**. Tier 1 (Bastrop network: Round Rock, Pflugerville, Cedar Park, Leander, Hutto, Elgin, Smithville, Manor, Taylor, Georgetown); Tier 2 (major TX metros: Austin, San Antonio, Fort Worth, El Paso, Plano, Arlington, Irving, Garland, Lubbock, Laredo); Tier 3 (open pipeline: Jarrell, Frisco, McKinney, Killeen, plus M9 to be named at batch-time). Per `51` §Stream 1D. Each city uses Municode adapter (Path A) or eCode360 adapter (Path A) or B3-style publisher adapter (Path C) depending on source shape; legacy Neon Path B only relevant where the city has prior legacy atoms.
3. **Postgres-backed StoragePort**. Independent Stream 1C prerequisite for production write; not gating Sync 4 / Sync 5 fire signals (those fire from in-memory storage), but required for the production launch endpoint. Drizzle schema declared; in-memory implementation backs tests plus dev mode currently.
4. **IPFS pinning provider**. `IpfsPort` abstraction in place per ADR-010; v1 default candidate is Pinata; not selected yet.
5. **OCR for raw-PDF adapter**. Claude vision primary plus Tesseract fallback per Phase 0; integration lands when the first raw-PDF jurisdiction is named.
6. **Vector embeddings pipeline**. voyage-3-large recommended; `atom_embeddings` table declared; embed-on-write hook pending.
7. **LLM generation hook for curated queries**. `LlmQueryGenerator` signature provider-agnostic; Claude binding wires at the CLI layer next session.
8. **Coverage dashboard UI**. Data already aggregated via `StoragePort.listJurisdictionStatus` plus the cost-tracking port; UI surface (embedded in hauska-mcp-server ops endpoint or a small Astro page) is the next step.
9. **Reviewer-zero ratification of Grand County query set** (20 queries currently `status: draft`). Operator-action (Nick or a Grand County contact). Not gating Sync 5 fire; long-term query-quality refinement.
10. **legacy-design-tools api-server import migration from `@workspace/empressa-atom` to `@hauska/atom-contract`**. One named can-kick from the 2026-05-19 doc-sweep; dedicated cc-agent session within 1-2 weeks; workspace-private path stays valid through the transition per cc-agent-AC's hand-off snippet.
11. **legacy-revit-sensor recon** (~10 minutes). Determines whether the repo currently imports `@workspace/empressa-atom`; fold migration into a sibling PR if yes, or defer if no.

### Cross-track queue (Cortex/engine recon planner stream)

Not in substrate v1 scope, but worth a fresh planner's awareness:

- Bastrop dashboard viewport verification post Neon Track B schema fix; Revit IFC retry expected to land in design-tools UI.
- TS6305 build-order failure in `.github/workflows/eval.yml` rubric typecheck; 3-line workflow fix queued for next legacy-design-tools touch.
- materializable-element delete-and-reinsert on IFC re-ingest; ADR-001 follow-on.
- Schema/index.ts regression (eval tables missing from main; ULID column type unreverted); dedicated dispatch queued.
- UI-2 PR open + push pending.

### Active out-of-scope queue

- ECI atomization sprint Phase 1 (registry scaffold) plus Phase 2 (backfill) now unblocked (cc-agent-AC publish landed; engine `packages/atoms/` shipped); cc-agent allocation for ECI P1 dispatch is a separate session decision. Sprint plan at [`60a_eci_atomization_sprint.md`](../60a_eci_atomization_sprint.md). Nick to create `empressaioemail-tech/empressa-atom-internal` repo when ready.
- Mox CEO meeting timing (gates Mox pilot reframing urgency; tracked in [`71_pipeline.md`](../71_pipeline.md)).

## Decision records produced today

- [`_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md`](../_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md) — BeWith iCal outage fix path selection (separate from substrate v1; tracked for fresh planner awareness).

No substrate-v1-specific decision records added today (option β resolution was filed at cc-agent-AC's bootstrap session 2026-05-18; today's work executed against that resolution).

## What fresh planner should read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions; "What is settled" section reflects substrate v1 Syncs 1-4 done as of 2026-05-19 wind-down.
2. This session summary.
3. [`00_current_state.md`](../00_current_state.md) — §4 fleet plus §6 watch list refreshed today.
4. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — §Sync points table marks 1-4 done; §Bump 1 engine atom-registry coordination is the option β framing.
5. cc-agent-E's session A.5 at [`_sessions/2026-05-19_grand_county_landuse_cc-agent-E.md`](2026-05-19_grand_county_landuse_cc-agent-E.md) — names Session B scope explicitly.
6. cc-agent-E's Path C recon at [`_sessions/2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md`](2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md) — surfaces the Bastrop B3 finding.

After those, the fresh planner can draft the Session B dispatch and begin the sequencing toward Sync 5.

## Commit batch this session

Single commit folding the wind-down sweep:

- [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points table marked 1-4 done with commit refs.
- [`CLAUDE.md`](../CLAUDE.md) "What is settled" substrate v1 paragraph rewritten plus ECI atomization paragraph updated.
- [`00_current_state.md`](../00_current_state.md) last_updated bump; §4 fleet refreshed; §5 prepended with three 2026-05-19 entries (this wind-down, LAND_USE, Sync 4); §6 strategic-agent count bumped to 13 plus three substrate v1 status entries rewritten plus Hauska MCP Server v1 entry refreshed.
- This session summary.

Pushed to origin/main when the operator confirms.
