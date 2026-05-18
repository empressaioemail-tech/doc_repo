---
id: 2026-05-18_cc-agent-E_hauska_engine
title: Dispatch — cc-agent-E hauska-engine (Streams 1A through 1D; ingestion pipeline)
date: 2026-05-18
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 27_engine_evolution_plan, 11a_bastrop_live_roadmap, 72_hauska_inc_operations, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_018_atom_contract_substrate_layer, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-E dispatch (hauska-engine; Streams 1A through 1D)

You are cc-agent-E, owning the `empressaioemail-tech/hauska-engine` repo end-to-end for substrate v1. All four Track 1 streams: 1A adapters and pipeline runner; 1B structural extraction, atomization, and engine-side atom-instance registry; 1C storage, identity, and retrieval API; 1D eval, curated queries, batch ingest, coverage dashboard. The within-track sync points (Sync 2 from 1A; Sync 3 from 1C; Sync 4 and Sync 5 from 1D) live entirely inside your work, so you self-coordinate them.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity. Structural commitment #3 (cost per jurisdiction under $200 compute plus 1 hour human review; hard kill at three counties) is load-bearing for your Stream 1D batch ingest work.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions. Operational ones for your slice: Cloud Run hosting; Postgres job table plus Cloud Run jobs orchestration; Claude vision plus Tesseract OCR; 90/100/95 quality bar with recalibrate-after-10; LLM-generate plus human-review-first-20 curated query authoring; human-review-gate-first-20 pre-publish; TX-first 25-city list approved (M9 Tier-3 deferred to batch-time); cost budget from Hauska Inc. equity; tool surface trim (rename and parcel-path drop affect retrieval API endpoint naming).
4. [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md) — per-repo allocation rationale.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Read in full. §Stream 1A, §Stream 1B, §Stream 1C, §Stream 1D for your scope; §Sync points; §Repo layout; §Bump 1 atom contract coordination (load-bearing dependency on cc-agent-AC).
6. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — pipeline design. §B.1 adapter framework, §B.2 structural extraction, §B.3 atomization, §B.4 retrieval index plus eval, §B.6 coverage dashboard.
7. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — four-layer atom contract every atom you register honors.
8. [`80_adrs/adr_010_atom_graph_traversal.md`](../80_adrs/adr_010_atom_graph_traversal.md) — Postgres index plus IPFS storage substrate that your storage module implements.
9. [`80_adrs/adr_011_atom_identity_across_versions.md`](../80_adrs/adr_011_atom_identity_across_versions.md) — DID plus IPNS identity that your identity module implements.
10. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — atom contract is Hauska commercial substrate; your registrations consume `@hauska/atom-contract` directly.
11. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) — §Stream B Bump 1 atom types you consume for atom-instance generation.
12. [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) — Sprint A.1 corpus load coordinates with your Stream 1D B.6 Bastrop validation pass.
13. [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) — Capital allocation section (your batch ingest budget); Domains section; IP attorney memo section (Sync 6 dependency for non-Bastrop ingestion).

## Scope

All four Track 1 streams in `hauska-engine`. Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Repo layout the package shape is `packages/corpus` (1A adapters plus 1B extraction and atomization plus 1D eval), `packages/storage` (1C IPFS plus Postgres index), `packages/identity` (1C DID plus IPNS), `packages/atoms` (engine-side atom-instance registry; consumes `@hauska/atom-contract` types), `packages/retrieval` (1C query layer), `services/pipeline-runner` (1A Cloud Run job orchestrator), `services/retrieval-api` (1C HTTP service consumed by hauska-mcp-server), `tools/ingest-cli` (1A operator CLI).

### Stream 1A — Adapters plus pipeline runner

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1A and [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.1:

- Bootstrap `hauska-engine` repo (Nick creates the empty repo first); CI (GitHub Actions: lint, typecheck, unit tests).
- Adapter interface (`packages/corpus/src/adapters/types.ts`) with `discover()`, `fetch(reference)`, `metadata(reference)`, `normalize(raw)`.
- Adapter contract test fixtures so every adapter implementation passes the same conformance suite.
- Municode HTML adapter (P1; most TX cities are on Municode); HTTP client with respectful crawl rate; HTML DOM walker to adapter intermediate format; metadata extraction; discovery of TX Municode jurisdictions; end-to-end test on one non-Bastrop TX city.
- eCode360 adapter (P1; broad coverage).
- Raw PDF adapter stub (P2-P3; defer full implementation past first batch per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.1).
- Pipeline runner service (`services/pipeline-runner/`): Postgres job table; Cloud Run jobs orchestration per Phase 0; retry policy plus dead-letter handling; state machine (queued → fetching → extracted → atomized → indexed → eval-running → loaded / failed).
- Operator CLI (`tools/ingest-cli/`) to enqueue jobs, list status, view failures.

### Stream 1B — Structural extraction plus atomization plus engine-side atom-instance registry

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1B and [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.2-B.3:

Structural extraction in `packages/corpus/src/extraction/`:

- Structural tree types: chapter, article, division, section, subsection, definition, cross-reference, amendment, note.
- Municode-HTML structural extractor consuming Stream 1A adapter output.
- Cross-reference resolver: text "see § 5.04(b)" to typed link per ADR-010.
- Definition extraction (defined terms inside sections plus glossary sections).
- Amendment metadata extraction (date, authority, affected sections).
- Extraction quality fixture: at least 95% accuracy on a 50-section ground-truth sample per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.2.

Engine-side atom-instance registry in `packages/atoms/` (consumes `@hauska/atom-contract` types):

- Consumes the published `@hauska/atom-contract@1.0.0` from cc-agent-AC (post Sync 1).
- Engine-side registry binds the contract's atom-type definitions to runtime atom instances per jurisdiction ingest. The contract package owns the type definitions; this engine-side package owns runtime instance generation, jurisdiction-scoped collection, and pipeline-stage handoff.
- Atom-instance index per atom type with provenance fields (source adapter, fetched-at, content hash, CID, DID).
- If cc-agent-AC's first session surfaces a different line between contract-package content and engine-package content than the surface reading of [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1, adjust your `packages/atoms/` scope accordingly.

Atomization step (structural tree → atom instances):

- Section node → `code-section` atom with full provenance (source adapter, fetched-at, content hash, CID per ADR-010, DID per ADR-011).
- Definition node → `code-definition` atom.
- Cross-reference node → `code-cross-reference` link atom.
- Amendment node → `code-amendment` atom with chain link to affected section per ADR-011.
- Edition aggregation → `code-edition` atom referencing all sections at adoption.
- Jurisdiction-level rollup → `jurisdiction-corpus` atom.
- Atomization output validation: spot-check 100 sections per jurisdiction (match source text plus hierarchy plus cross-references) per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.3.

Pre-Sync-1 work: until cc-agent-AC publishes `@hauska/atom-contract@1.0.0`, register against workspace-private `@workspace/empressa-atom` at `legacy-design-tools/lib/empressa-atom/` (path-pin or matching shape). Swap to npm dependency on Sync 1 signal.

### Stream 1C — Storage plus index plus identity plus retrieval API

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1C and ADR-010 plus ADR-011:

Storage module (`packages/storage/`):

- Postgres index schema per ADR-010: `atoms (atom_did, cid, atom_type, jurisdiction_tenant, section_number, subsection_path, source_adapter, fetched_at, ...)`.
- Cross-reference edge table (`atom_links` with `from_cid`, `to_cid`, `link_type` per ADR-010 taxonomy).
- IPFS pinning adapter (or chosen content-addressed store; revisit ADR-010 if Pinata, web3.storage, or self-hosted).
- Write path: atom → IPFS pin → Postgres index row → emit event.
- Read path: query → Postgres → IPFS fetch when content needed.
- Hot cache layer (Redis or in-process per ADR-010 deferred decision); start in-process, promote to Redis under load.

Identity module (`packages/identity/`):

- DID resolver per ADR-011.
- IPNS read surface (atom DID → latest CID lookup).
- IPNS write surface (publish new CID for existing DID).
- Key custody hooks (deferred per ADR-011; module exists to localize the choice).

Vector embedding pipeline:

- Embedding model choice (recommend voyage-3-large for retrieval quality).
- Embed atom bodies on write.
- Vector index in Postgres (pgvector) or separate; decide as you go.
- Hybrid retrieval combining structural (cross-reference graph) plus vector (fuzzy similarity) per ADR-010 Alt 1.

Retrieval API service (`services/retrieval-api/`):

- HTTP endpoints consumed by cc-agent-M's Stream 2A: `GET /search?q=&jurisdiction=&limit=`; `GET /atoms/:did?includeComposition=true`; `GET /jurisdictions/:id?queryType=...`; `GET /jurisdictions/:id/permits?projectType=` (the renamed `search_permit_atoms` target); `GET /jurisdictions` (list of loaded jurisdictions with quality status).
- Auth: internal API key between hauska-mcp-server and retrieval API.
- Response shapes match atom contract per ADR-001.
- Latency contract: P99 at most 500ms for index queries; P99 at most 2s when IPFS fetch needed.
- Health endpoint plus readiness probe.
- Cloud Run deployment.

### Stream 1D — Eval plus curated queries plus batch ingest plus coverage dashboard

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D and [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.4 plus B.6:

Eval harness skeleton (`packages/corpus/src/eval/`):

- Curated query schema: `(jurisdiction, query_text, expected_atom_did, query_type)`.
- Retrieval test runner: query → retrieval API; check top-3 contains expected atom; report pass/fail plus aggregate.
- Coverage test runner: sample N atoms; check each retrievable by section number per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.4 100% target.
- Cross-reference test runner: sample N `code-cross-reference` atoms; check each `to_cid` resolves to a real atom per 49 §B.4 95% target.
- Quality bar enforcement: `evaluate(jurisdiction) → {passed: bool, scores: {...}, failures: [...]}`.
- CLI integration: `ingest-cli eval bastrop-tx`.

Curated query authoring (LLM-generate plus human-review-first-20 per Phase 0):

- LLM-generate first-pass queries from each jurisdiction's TOC (Claude prompt plus `jurisdiction-corpus` atom).
- Human review tooling (CLI to walk query list; mark accept/edit/reject; persist to Postgres `curated_queries` table).
- Bastrop UDC: human-reviewed by Sylvia or Jaime (reviewer-zero); gold-standard set.
- Grand County IRC: human-reviewed.
- First TX batch queries: LLM plus light human review.

Version tracking (`packages/corpus/src/version-tracking/`):

- Drift detection per jurisdiction on schedule.
- Amendment ingestion path: new ordinance → `code-amendment` atom plus new CID on affected `code-section` per ADR-011 chain.
- Edition tracking via `code-edition` atom.
- Operator review surface for flagged drift.

Coverage dashboard (B.6):

- Loaded jurisdictions list (jurisdiction, edition, last refresh, quality status, atom count, drift status).
- Per-jurisdiction quality detail (top-3 score, section-num score, cross-ref score).
- Failed eval history.
- Surface for hauska-mcp-server `list_jurisdictions` tool (only loaded plus quality-passing jurisdictions appear).

Cost-per-jurisdiction tracking (load-bearing for structural commitment #3):

- Per-jurisdiction compute cost capture (LLM tokens, OCR spend, embedding compute, infrastructure attributable).
- Per-jurisdiction human-review-hours capture (operator CLI records review-start and review-finish).
- Dashboard line: cost-per-jurisdiction vs target $200 compute plus 1 hr human review.
- Flag-and-review pipeline for jurisdictions exceeding target.
- **Hard-kill checkpoint at 3 counties**: if the metric is not achievable after first three counties, halt catalog expansion and surface to Nick.

B.6 Bastrop validation pass: full pipeline against Bastrop UDC; diff against A.1 one-off load; iterate to parity or improvement. Same for Grand County IRC.

First TX batch ingest (Tier 1 plus Tier 2 plus Tier 3 from [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D; M9 Tier-3 slot to be named at batch-time):

- Tier 1 (Bastrop-network): Round Rock, Pflugerville, Cedar Park, Leander, Hutto, Elgin, Smithville, Manor, Taylor, Georgetown.
- Tier 2 (major TX metros): Austin, San Antonio, Fort Worth, El Paso, Plano, Arlington, Irving, Garland, Lubbock, Laredo.
- Tier 3 (open pipeline targets): Jarrell, M9 candidate (Nick to name at batch-time), Frisco, McKinney, Killeen.
- **Tier 1 plus Tier 2 plus Tier 3 gated on Sync 6 (Texas IP attorney opinion memo, Nick action).** Bastrop plus Grand County stay unblocked.

eCode360 batch (post-1A eCode360 adapter): Houston, Dallas, others identified as eCode360-resident.

Per-jurisdiction quality gate: ingest job marks jurisdiction "loaded" only when eval harness passes the quality bar.

## Sync points

You publish:

- **Sync 2 — Adapter contract stable.** Once `packages/corpus/src/adapters/types.ts` interface is locked plus first-city conformance pass, signal in your session summary. Internal to your work; the signal still matters for downstream within-stream dependencies (1B structural extractor wires hard against 1A output once Sync 2 lands).
- **Sync 3 — Retrieval API contract stable.** Once `services/retrieval-api/` HTTP endpoint contract is locked plus first health pass, signal in your session summary. cc-agent-M swaps from mocked retrieval client to real wiring on signal.
- **Sync 4 — First jurisdiction passes eval.** Pre-launch gate. At least Bastrop UDC passes the quality bar. Signal in your session summary; cc-agent-M's Stream 2D launch sequence unblocks.
- **Sync 5 — Quality-gated 20-jurisdiction corpus.** Public launch unblocked once 20 TX jurisdictions pass eval. Planner co-owns the public launch announcement.

You wait on:

- **Sync 1 — Bump 1 atom contract published.** cc-agent-AC publishes `@hauska/atom-contract@1.0.0` to npm. Until then, register atoms against workspace-private `@workspace/empressa-atom` at `legacy-design-tools/lib/empressa-atom/`; swap to npm dependency on signal.
- **Sync 6 — Texas IP attorney opinion memo delivered.** Nick action, external. Tier 1 plus Tier 2 plus Tier 3 batch ingest gated on this; Bastrop plus Grand County stay unblocked. Track at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) IP attorney memo section.

## Coordination

Within-track sync points (2, 3, 4, 5) are internal to your work; you self-coordinate. Planner-owned Bump 1 cross-repo PR rollout includes a PR against `hauska-engine` pinning the `@hauska/atom-contract@1.0.0` dependency in your `packages/atoms/` engine-side registry consumer code; coordinate with planner on the PR content (planner files the PR; you confirm pin shape matches your engine-side consumer expectations). Sync 4 and Sync 5 launch-gate signaling: planner co-owns public launch posture per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 7.

3-county hard-kill checkpoint is structural-commitment-#3 enforcement. If the first three counties exceed $200 plus 1 hr per jurisdiction, halt and surface to Nick before continuing Tier 1 plus Tier 2 plus Tier 3 ingest.

Within-track sequencing: 1A → 1B (via Sync 2) → 1C (storage consumes 1B atom shapes; retrieval API consumes 1C storage and identity) → 1D (eval queries through 1C retrieval API). Parallelism: 1A adapter framework scaffolding plus 1C storage tech selection plus 1D eval harness scaffolding can start concurrently. Hard dependencies are Sync 2 (1A → 1B), 1B → 1C storage write path, 1C retrieval API → 1D eval queries. Sequence as the dependencies allow.

## Out of scope

- Atom contract package itself (cc-agent-AC owns).
- MCP server (cc-agent-M owns).
- Cross-repo Bump 1 pin-update PRs (planner owns).

## Done criteria

- Stream 1A: first adapter (Municode) running end-to-end against one test jurisdiction.
- Stream 1B: structural tree extractor passes 95% accuracy on first test city; engine-side `packages/atoms/` registry consumes published `@hauska/atom-contract`; 100-section spot-check validates atomization output.
- Stream 1C: retrieval API endpoints serve Bastrop atoms against the dev corpus; P99 latency contract met; health green; first integration test from cc-agent-M passes.
- Stream 1D: Bastrop and Grand County pass quality bar; cost-per-jurisdiction tracking live; first TX batch ingest (Tier 1) under way; coverage dashboard usable; 3-county hard-kill checkpoint enforced.

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-E.md` in doc_repo plus commits to `hauska-engine`. Signal each within-track sync point in the session summary that achieves it.
