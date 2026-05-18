---
id: 2026-05-18_cc-agent-3_substrate_v1_1C_2C
title: Dispatch — cc-agent-3 substrate v1 (Streams 1C + 2C; data layer and telemetry)
date: 2026-05-18
agent: cc-agent-3
repo: hauska-engine + hauska-mcp-server
kind: dispatch
related: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_018_atom_contract_substrate_layer, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-3 dispatch (Streams 1C + 2C)

You are cc-agent-3, owning the data-layer-and-telemetry slice. Storage plus index plus identity plus retrieval API in `hauska-engine`; logging plus observability plus dashboards in `hauska-mcp-server`. Your slice is the most cross-track-coupled: Stream 1C publishes the retrieval API contract (Sync 3) that Stream 2A wires against.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions. Operational ones for your slice: Postgres index per ADR-010 plus GCS raw payloads (logging); Cloud Run hosting; Route A backend coupling (Stream 2A wraps your retrieval API directly).
4. [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md) — fleet doubling rationale and your stream-pair allocation.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Focus on §Stream 1C and §Stream 2C; §Sync points (you publish Sync 3, retrieval API contract); §Repo layout.
6. [`80_adrs/adr_010_atom_graph_traversal.md`](../80_adrs/adr_010_atom_graph_traversal.md) — IPFS storage plus Postgres index substrate that your storage module implements.
7. [`80_adrs/adr_011_atom_identity_across_versions.md`](../80_adrs/adr_011_atom_identity_across_versions.md) — DID plus IPNS identity that your identity module implements.
8. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — atom contract is Hauska commercial substrate peer to the Hauska SDK; your storage depends on `@hauska/atom-contract` directly.
9. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — §B.4 retrieval index plus eval harness for context on the queries your API serves.

## Scope

### Track 1 — Stream 1C in `hauska-engine`

Storage module (`packages/storage/`):

- Postgres index schema per ADR-010: `atoms (atom_did, cid, atom_type, jurisdiction_tenant, section_number, subsection_path, source_adapter, fetched_at, ...)`.
- Cross-reference edge table (`atom_links` with `from_cid`, `to_cid`, `link_type` per ADR-010 taxonomy).
- IPFS pinning adapter (or chosen content-addressed store; revisit ADR-010 if Pinata, web3.storage, or self-hosted).
- Write path: atom to IPFS pin to Postgres index row to emit event.
- Read path: query to Postgres to IPFS fetch when content needed.
- Hot cache layer (Redis or in-process per ADR-010 deferred decision); start in-process, promote to Redis under load.

Identity module (`packages/identity/`):

- DID resolver per ADR-011.
- IPNS read surface (atom DID to latest CID lookup).
- IPNS write surface (publish new CID for existing DID).
- Key custody hooks (deferred per ADR-011; module exists to localize choice).

Vector embedding pipeline:

- Embedding model choice (recommend voyage-3-large for retrieval quality).
- Embed atom bodies on write.
- Vector index in Postgres (pgvector) or separate; decide as you go.
- Hybrid retrieval combining structural (cross-reference graph) plus vector (fuzzy similarity) per ADR-010 Alt 1.

Retrieval API service (`services/retrieval-api/`):

- HTTP endpoints consumed by cc-agent-1's Stream 2A: `GET /search?q=&jurisdiction=&limit=`; `GET /atoms/:did?includeComposition=true`; `GET /jurisdictions/:id?queryType=...`; `GET /jurisdictions/:id/permits?projectType=` (the renamed `search_permit_atoms` target); `GET /jurisdictions` (list of loaded jurisdictions with quality status).
- Auth: internal API key between MCP server and retrieval API.
- Response shapes match atom contract per ADR-001.
- Latency contract: P99 at most 500ms for index queries; P99 at most 2s when IPFS fetch needed.
- Health endpoint plus readiness probe.
- Cloud Run deployment.

### Track 2 — Stream 2C in `hauska-mcp-server`

Structured logger per Phase 0:

- Default: Postgres index per ADR-010 plus GCS raw payloads.
- Log shape: `{ts, request_id, method, params, ip, key_hash, tier, response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`.
- Per-request: log on entry plus log on response.
- Per-tool-call: log inside tool handler with tool-specific fields.

Cloud Logging integration:

- Structured JSON to stdout/stderr.
- Log-based metric: error rate, P99 latency.
- Alerts: error rate over X percent, P99 over Y ms.

Dashboards (BigQuery plus Looker Studio or chosen tool):

- Calls per day by tool, jurisdiction, tier.
- Top jurisdictions queried.
- Top tools called.
- Error rate.
- Latency histograms.
- New free-tier IPs (potential commercial-use candidates).
- High-volume free-tier IPs (commercial-use detection; surface for BD outreach).
- Per-key usage (paid tier).

Training-data export query: anonymized request/response export; per-tool call sequences; ready for fine-tuning or eval ingest.

Cost monitoring: per-tier cost attribution (compute plus storage); free-tier cost vs paid-tier revenue dashboard.

Health check endpoint enhancements: latency stats, last-successful-call timestamp, dependency health.

## Sync points

You publish:

- **Sync 3 — Retrieval API contract stable.** Your `services/retrieval-api/` HTTP endpoint contract is what cc-agent-1's Stream 2A wires against. Once your contract is locked plus first health pass, signal in your session summary. cc-agent-1 swaps from mocked client to real on signal.

You wait on:

- **Sync 1 — Bump 1 atom contract published.** Planner-coordinated. Storage write and read shapes pin to `@hauska/atom-contract` v1.0.0 once published.
- **cc-agent-2's atom registrations** in `hauska-engine` `packages/atoms/`. Storage write path consumes the atom types Stream 1B registers; index schema fields trace to atom fields.
- **cc-agent-1's Stream 2A live calls.** Your logger captures Stream 2A traffic; before 2A wires through, logging is empty in production but the pipeline itself is ready.

## Coordination

Bump 1 atom contract coordination is planner-owned. Your storage module consumes the published `@hauska/atom-contract`; the dependency graph stays clean per [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) (atom contract is peer to Hauska SDK; storage depends on contract directly, not transitively through the SDK). Cross-stream questions: file in doc_repo session summaries; planner runs adjudication.

## Out of scope

- Adapter framework and pipeline runner (Stream 1A / cc-agent-1).
- Atom contract registration itself (Stream 1B / cc-agent-2).
- Eval harness and batch ingest (Stream 1D / cc-agent-4).
- MCP tool surface and backend wiring (Stream 2A / cc-agent-1).
- Auth, rate limiting, Stripe (Stream 2B / cc-agent-2).
- Deploy, docs, launch (Stream 2D / cc-agent-4).

## Done criteria

Stream 1C exit per 51: retrieval API endpoints serve Bastrop atoms against the dev corpus; P99 latency contract met; health green; first 2A integration test passes.
Stream 2C exit per 51: logs flow to chosen destination; dashboard visible to Nick plus planner; one week of internal testing traffic captured and queryable.

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-3.md` in doc_repo plus commits to `hauska-engine` and `hauska-mcp-server`.
