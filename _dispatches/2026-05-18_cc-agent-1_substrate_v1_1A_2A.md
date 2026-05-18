---
id: 2026-05-18_cc-agent-1_substrate_v1_1A_2A
title: Dispatch — cc-agent-1 substrate v1 (Streams 1A + 2A; input boundaries)
date: 2026-05-18
agent: cc-agent-1
repo: hauska-engine + hauska-mcp-server
kind: dispatch
status: superseded
superseded_by: [_dispatches/2026-05-18_cc-agent-E_hauska_engine, _dispatches/2026-05-18_cc-agent-M_hauska_mcp_server]
related: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close, _decisions/2026-05-18_substrate_v1_dispatch_reallocation]
---

> **Superseded 2026-05-18.** Cross-repo doubling axis was incompatible with Cursor one-terminal-per-repo. Stream 1A work moved to [`_dispatches/2026-05-18_cc-agent-E_hauska_engine.md`](2026-05-18_cc-agent-E_hauska_engine.md); Stream 2A to [`_dispatches/2026-05-18_cc-agent-M_hauska_mcp_server.md`](2026-05-18_cc-agent-M_hauska_mcp_server.md). See [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md).

# Substrate v1 — cc-agent-1 dispatch (Streams 1A + 2A)

You are cc-agent-1, owning the input-boundaries slice of the substrate v1 sprint. Adapter framework plus pipeline runner in the new `hauska-engine` repo; MCP backend coupling plus tool surface in the existing `hauska-mcp-server` repo.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot. Note the substrate v1 sprint dispatch entry in §4 (Agent fleet assignments).
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions you operate under. Operational ones for your slice: Cloud Run hosting; `mcp.hauska.dev` launch domain (`hauska.dev` registered same day); tool surface trim (drop `query_jurisdiction` parcel path; rename `get_permit_requirements` to `search_permit_atoms`); Route A backend coupling.
4. [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md) — fleet doubling rationale and your stream-pair allocation.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Read in full. Focus on §Stream 1A and §Stream 2A for your scope; §Sync points across tracks for coordination; §Repo layout for `hauska-engine` plus `hauska-mcp-server` package structure.
6. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — pipeline design. §B.1 input adapter framework is your Track 1 reference.
7. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — MCP product framing. §Phase 1 backend coupling and §Phase 2 tool surface refinement are your Track 2 reference.

## Scope

### Track 1 — Stream 1A in `hauska-engine` (new repo: `empressaioemail-tech/hauska-engine`)

You bootstrap the repo. Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Repo layout the package shape is `packages/corpus/src/adapters/` plus `services/pipeline-runner/` plus `tools/ingest-cli/`. Build:

- Adapter interface (`packages/corpus/src/adapters/types.ts`) with `discover()`, `fetch(reference)`, `metadata(reference)`, `normalize(raw)`.
- Adapter contract test fixtures so every adapter implementation passes the same conformance suite.
- Municode HTML adapter (P1, most TX cities are on Municode).
- eCode360 adapter (P1, broad coverage).
- Raw PDF adapter stub (P2-P3 priority; defer full implementation past first batch per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.1).
- Pipeline runner service: Postgres job table; Cloud Run jobs orchestration per Phase 0; retry policy; dead-letter handling; state machine (queued, fetching, extracted, atomized, indexed, eval-running, loaded, failed).
- Operator CLI (`tools/ingest-cli/`) to enqueue jobs, list status, view failures.

First-city test: pick one non-Bastrop TX city; run end-to-end Municode ingest.

### Track 2 — Stream 2A in `hauska-mcp-server` (existing repo: `empressaioemail-tech/hauska-mcp-server`)

Repo exists with five tools scaffolded per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) repo-placement section (bootstrap commit `d00586b`). Your work:

- Wire `hauska-client.ts` to the `hauska-engine` retrieval API (Route A per Phase 0). Consumes cc-agent-3's Stream 1C published contract; see Sync points below.
- Tool surface trim per Phase 0: drop `query_jurisdiction` `parcel_id` and `address` parameters (parcel atoms are Bump 2, out of v1 scope); rename `get_permit_requirements` to `search_permit_atoms`; update Zod schemas, descriptions, handler call.
- Atom-shape response formatting: atom DID, CID, source, content hash visible in every response.
- Attribution metadata in every free-tier response ("Powered by Hauska Engine — hauska.dev").
- Tool integration tests against live `hauska-engine` retrieval API.
- Local end-to-end test: local hauska-engine plus local MCP server plus MCP Inspector.

Until Sync 3 lands, use a mocked retrieval client identical in shape to cc-agent-3's published contract.

## Sync points

You publish:

- **Sync 2 — Adapter contract stable.** Once your `packages/corpus/src/adapters/types.ts` interface is locked plus first-city conformance pass, signal in your session summary. cc-agent-2 (Stream 1B) and cc-agent-4 (Stream 1D) wait on this.

You wait on:

- **Sync 1 — Bump 1 atom contract published.** Planner-coordinated (this Claude Code session). Affects Stream 2A response shapes once `@hauska/atom-contract` v1.0.0 ships from legacy-design-tools. Before then, work against the workspace-private `@workspace/empressa-atom` shape at `legacy-design-tools/lib/empressa-atom/`.
- **Sync 3 — Retrieval API contract stable.** cc-agent-3 publishes this from Stream 1C. Until then, Stream 2A mocks the retrieval client identical in shape; swap to real wiring on signal.

## Coordination

Bump 1 atom contract coordination is planner-owned. When `@hauska/atom-contract` v1.0.0 publishes, your `package.json` dependency updates accordingly. Cross-stream questions: file in doc_repo via your session summaries; planner runs cross-track adjudication.

## Out of scope

- Atom registration (Stream 1B / cc-agent-2 owns).
- Storage and retrieval API itself (Stream 1C / cc-agent-3 owns the read and write substrate plus the API contract you consume).
- Eval harness and batch ingest (Stream 1D / cc-agent-4 owns quality gating).
- Auth, rate limiting, Stripe (Stream 2B / cc-agent-2 owns the MCP access layer).
- Logging and observability (Stream 2C / cc-agent-3 owns the telemetry).
- Deploy and launch (Stream 2D / cc-agent-4 owns production posture).

## Done criteria

Stream 1A exit per 51: first adapter (Municode) running end-to-end against one test jurisdiction.
Stream 2A exit per 51: all five tools return real data against the dev corpus; MCP Inspector pass; Claude Desktop pass.

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-1.md` in doc_repo plus commits to `hauska-engine` and `hauska-mcp-server` as appropriate.
