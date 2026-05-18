---
id: 2026-05-18_cc-agent-2_substrate_v1_1B_2B
title: Dispatch — cc-agent-2 substrate v1 (Streams 1B + 2B; schema and access control)
date: 2026-05-18
agent: cc-agent-2
repo: hauska-engine + hauska-mcp-server
kind: dispatch
related: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 27_engine_evolution_plan, 26_atom_upgrade_guide, 25_atom_architecture_reference, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_012_atom_export_format, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-2 dispatch (Streams 1B + 2B)

You are cc-agent-2, owning the schema-and-access-control slice. Structural extraction plus atom registration in `hauska-engine`; auth plus rate limiting plus Stripe scaffold in `hauska-mcp-server`.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions. Operational ones for your slice: manual key issuance at v1 (auto at Phase 8); four-tier rate-limit shape (Free, Developer Pro, Team, Embedder License) per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md); Stripe Connect as v1 fiat rail per [`14_pricing_framework.md`](../14_pricing_framework.md) close-the-loop pass.
4. [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md) — fleet doubling rationale and your stream-pair allocation.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Focus on §Stream 1B and §Stream 2B; §Bump 1 atom contract coordination is load-bearing for your Track 1 work; §Sync points; §Repo layout.
6. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — §B.2 structural extraction and §B.3 atomization are your Track 1 reference.
7. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — four-layer atom contract (identity, context interface, composition, history) every atom you register honors.
8. [`80_adrs/adr_010_atom_graph_traversal.md`](../80_adrs/adr_010_atom_graph_traversal.md) — typed link taxonomy (`derives-from`, `cross-reference`, etc.).
9. [`80_adrs/adr_011_atom_identity_across_versions.md`](../80_adrs/adr_011_atom_identity_across_versions.md) — DID plus IPNS identity for atom versioning.
10. [`80_adrs/adr_012_atom_export_format.md`](../80_adrs/adr_012_atom_export_format.md) — five render modes (inline, compact, card, expanded, focus); focus mode is polish-grade.
11. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) — §Stream B Bump 1 names the atom types you register.
12. [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) — consumer coordination pattern for the Bump 1 minor version bump (legacy-design-tools, smartcity-os, legacy-revit-sensor consumer paths).
13. [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — atom architecture reference; existing 19 domain atoms inform schema patterns.

## Scope

### Track 1 — Stream 1B in `hauska-engine`

Structural extraction in `packages/corpus/src/extraction/`:

- Structural tree types: `chapter`, `article`, `division`, `section`, `subsection`, `definition`, `cross-reference`, `amendment`, `note`.
- Municode-HTML structural extractor consuming cc-agent-1's adapter output.
- Cross-reference resolver: text "see § 5.04(b)" to typed link per ADR-010.
- Definition extraction (defined terms inside sections plus glossary sections).
- Amendment metadata extraction (date, authority, affected sections).
- Extraction quality fixture: at least 95% accuracy on a 50-section ground-truth sample per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.2 exit.

Atom registration in `packages/atoms/`:

- Six Bump 1 atom types: `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus`.
- Plus adjudication-context atoms per [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Compounding-context atoms: `adjudication-record`, `per-reviewer-pattern`, `comparable-project-precedent`. These ship in Bump 1 but are NOT exposed via MCP server (Layer 2 paid; stay inside Codex 1b per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §What's deliberately absent from v1).
- Schema plus Zod validation per atom.
- Render-mode stubs per ADR-001 five modes; focus mode polish-grade per ADR-012.

Atomization step (structural tree to atoms):

- Section node to `code-section` atom with full provenance (source adapter, fetched-at, content hash, CID per ADR-010, DID per ADR-011).
- Definition node to `code-definition` atom.
- Cross-reference node to `code-cross-reference` link atom.
- Amendment node to `code-amendment` atom with chain link to affected section per ADR-011.
- Edition aggregation to `code-edition` atom.
- Jurisdiction-level rollup to `jurisdiction-corpus` atom.

Atomization output validation: spot-check 100 sections per jurisdiction (match source text plus hierarchy plus cross-references) per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.3 exit.

### Track 2 — Stream 2B in `hauska-mcp-server`

Build:

- Rate limiter: replace in-memory bucket with Redis (Upstash for serverless compatibility); per-IP bucket for free tier; per-key bucket for paid tiers; four tier bands enforced (Free, Developer Pro, Team, Embedder); RPM config in env vars per tier.
- API key model: Postgres schema (`api_keys` with `key_id`, `key_hash`, `tier`, `owner_email`, `owner_name`, `created_at`, `last_used_at`, `status`, `notes`); cryptographic random key generation with prefix tagging per tier (`hk_free_*`, `hk_pro_*`, `hk_team_*`, `hk_emb_*`); SHA-256 key hashing; never log raw keys.
- Admin endpoints (bootstrap-key protected): `POST /admin/keys` (mint), `GET /admin/keys` (list), `PATCH /admin/keys/:id` (tier change, revoke, notes), `DELETE /admin/keys/:id` (revoke).
- Stripe scaffold (Scenario B in-scope per Phase 0 close): Stripe products plus prices catalog; customer signup to Stripe checkout to webhook to key mint; subscription state sync (`active`, `past_due`, `canceled` to `key.status`); upgrade and downgrade flow.
- Self-serve signup: public signup endpoint; email verification; auto-key issuance on payment.
- Per-tier rate-limit conformance tests.

## Sync points

You publish:

- **Bump 1 atom registration ready** in `hauska-engine` `packages/atoms/`. Planner coordinates the cross-repo bump rollout. Once your `packages/atoms/` lands, signal in your session summary so planner can prepare PRs across legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-mcp-server.

You wait on:

- **Sync 1 — Bump 1 atom contract published.** Planner-coordinated. Once `@hauska/atom-contract` v1.0.0 publishes from legacy-design-tools, your registry pins update accordingly. Before that, work against the workspace-private `@workspace/empressa-atom` shape at `legacy-design-tools/lib/empressa-atom/` (path-pin or matching shape).
- **Sync 2 — Adapter contract stable.** cc-agent-1 publishes from Stream 1A. Until then, structural extractor takes mocked adapter output; swap to real on signal.

## Coordination

Bump 1 atom contract coordination is planner-owned. Your role: ship the new atom types in `hauska-engine` `packages/atoms/`. Planner runs the cross-repo PRs across the five consumer repos atomically merged per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1. Stripe scaffold per Phase 0 closure is Scenario B in-scope (revenue model resolved 2026-05-16); Phase 8 self-serve paid tier infrastructure is part of your slice.

## Out of scope

- Adapter framework and pipeline runner (Stream 1A / cc-agent-1).
- Storage, IPFS pinning, Postgres index, retrieval API (Stream 1C / cc-agent-3).
- Eval harness and batch ingest (Stream 1D / cc-agent-4).
- MCP backend wiring and tool surface (Stream 2A / cc-agent-1).
- Logging and dashboards (Stream 2C / cc-agent-3).
- Deploy, docs, launch (Stream 2D / cc-agent-4).

## Done criteria

Stream 1B exit per 51: structural tree extractor passes 95% accuracy on first test city; six new atom types registered with schema and Zod; 100-section spot-check validates atomization output.
Stream 2B exit per 51: four tier bands enforced; key issuance documented in a 90_runbooks runbook; self-serve signup works end-to-end against a staging deploy.

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-2.md` in doc_repo plus commits to `hauska-engine` and `hauska-mcp-server`.
