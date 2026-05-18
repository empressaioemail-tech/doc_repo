---
id: 2026-05-18_cc-agent-M_hauska_mcp_server
title: Dispatch — cc-agent-M hauska-mcp-server (Streams 2A through 2D; MCP server)
date: 2026-05-18
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [51_substrate_v1_sprint, 50_hauska_mcp_server, 29_mcp_surface_tier_model, 14_pricing_framework, 80_adrs/adr_018_atom_contract_substrate_layer, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/cutover_env_var_bind_procedure, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-M dispatch (hauska-mcp-server; Streams 2A through 2D)

You are cc-agent-M, owning the `empressaioemail-tech/hauska-mcp-server` repo end-to-end for substrate v1. All four Track 2 streams: 2A backend coupling plus tool surface; 2B auth plus rate limit plus Stripe scaffold; 2C logging plus observability plus dashboards; 2D deploy plus docs plus cross-client testing plus launch. Until Sync 3 lands (cc-agent-E publishes retrieval API contract), proceed against mocked or staged backends per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points; swap to real wiring on Sync 3 signal.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions. Operational ones for your slice: Cloud Run hosting; `mcp.hauska.dev` launch domain (`hauska.dev` registered 2026-05-18); tool surface trim (drop `query_jurisdiction` parcel path; rename `get_permit_requirements` to `search_permit_atoms`); Route A backend coupling; manual key issuance at v1 with Phase 8 auto; Postgres plus GCS logging.
4. [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md) — per-repo allocation rationale.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Read in full. §Stream 2A, §Stream 2B, §Stream 2C, §Stream 2D for your scope; §Sync points; §Repo layout.
6. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — MCP product framing. §Phase 1 backend coupling, §Phase 2 tool surface refinement, §Phase 3 auth plus rate limit, §Phase 4 logging plus observability, §Phase 5 deploy, §Phase 6 docs, §Phase 7 launch, §Phase 8 self-serve paid tier.
7. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — four-tier rate-limit shape (Free, Developer Pro, Team, Embedder License).
8. [`14_pricing_framework.md`](../14_pricing_framework.md) — Stripe Connect as v1 fiat rail per close-the-loop pass 2026-05-18; take-rate 1.5 to 2.5 percent v1 range.
9. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — atom contract is Hauska commercial substrate; your response shapes pin to `@hauska/atom-contract` directly.
10. [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) — canonical Cloud Run deploy path you follow for Stream 2D.
11. [`90_runbooks/cutover_env_var_bind_procedure.md`](../90_runbooks/cutover_env_var_bind_procedure.md) — env-var bind procedure (every env reference traced; no silent drops; follow the SmartCity OS cutover lessons).

## Scope

Repo exists at `empressaioemail-tech/hauska-mcp-server` (bootstrap commit `d00586b` 2026-05-18) with five tools scaffolded per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) repo-placement section. Streamable HTTP transport plus auth and logging stubs in place; no backend connection yet.

### Stream 2A — Backend coupling plus tool surface

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2A and [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 1-2:

- Wire `hauska-client.ts` to the `hauska-engine` retrieval API (Route A per Phase 0). Consumes cc-agent-E's Stream 1C published contract; see Sync points below.
- Tool surface trim per Phase 0: drop `query_jurisdiction` `parcel_id` and `address` parameters (parcel atoms are Bump 2, out of v1 scope); rename `get_permit_requirements` to `search_permit_atoms`; update Zod schemas, descriptions, handler call.
- Atom-shape response formatting: atom DID, CID, source, content hash visible in every response.
- Attribution metadata in every free-tier response ("Powered by Hauska Engine — hauska.dev").
- Tool integration tests against live `hauska-engine` retrieval API (post Sync 3).
- Local end-to-end test: local hauska-engine plus local MCP server plus MCP Inspector.

Until Sync 3 lands, use a mocked retrieval client identical in shape to cc-agent-E's published contract.

### Stream 2B — Auth plus rate limit plus Stripe scaffold

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2B and [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 3 plus §Phase 8:

- Rate limiter: replace in-memory bucket with Redis (Upstash for serverless compatibility); per-IP bucket for free tier; per-key bucket for paid tiers; four tier bands enforced (Free, Developer Pro, Team, Embedder per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md)); RPM config in env vars per tier.
- API key model: Postgres schema (`api_keys` with `key_id`, `key_hash`, `tier`, `owner_email`, `owner_name`, `created_at`, `last_used_at`, `status`, `notes`); cryptographic random key generation with prefix tagging per tier (`hk_free_*`, `hk_pro_*`, `hk_team_*`, `hk_emb_*`); SHA-256 key hashing; never log raw keys.
- Admin endpoints (bootstrap-key protected): `POST /admin/keys` (mint), `GET /admin/keys` (list), `PATCH /admin/keys/:id` (tier change, revoke, notes), `DELETE /admin/keys/:id` (revoke).
- Stripe scaffold (Scenario B in-scope per Phase 0 close; Stripe Connect rail per Phase 0 close-the-loop pass): Stripe products plus prices catalog; customer signup → Stripe checkout → webhook → key mint; subscription state sync (`active`, `past_due`, `canceled` → `key.status`); upgrade and downgrade flow.
- Self-serve signup: public signup endpoint; email verification; auto-key issuance on payment (Phase 8 self-serve infrastructure).
- Per-tier rate-limit conformance tests.

### Stream 2C — Logging plus observability plus dashboards

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2C and [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 4:

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

### Stream 2D — Deploy plus docs plus cross-client testing plus launch

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2D and [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 5-7:

Containerization:

- `Dockerfile` (Node 20 base, multi-stage build).
- `.dockerignore`.
- Local build plus run verification.

Cloud Run deployment:

- `cloudbuild-mcp.yaml` mirroring SmartCity OS pattern.
- Cloud Run service spec (autoscale, min-instances=1, region us-central1 default).
- Secret Manager bindings: `BACKEND_URL`, `BACKEND_KEY`, `REDIS_URL`, `DATABASE_URL`, `STRIPE_KEYS`, `ADMIN_BOOTSTRAP_KEY`.
- Cutover env-var bind procedure per [`90_runbooks/cutover_env_var_bind_procedure.md`](../90_runbooks/cutover_env_var_bind_procedure.md) (every env reference traced; no silent drops; follow the SmartCity OS cutover lessons).
- Custom domain `mcp.hauska.dev` (`hauska.dev` registered 2026-05-18 per [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Domains section).
- TLS managed cert.
- Cloud Armor or WAF config.

Docs site:

- Static site (Astro, Next.js, or Docusaurus; pick lightest).
- Subdomain `mcp.hauska.dev/docs` or `docs.hauska.dev`.
- Schema reference auto-generated from Zod schemas.
- Example queries page.
- Free vs paid tier definitions.
- ToS plus commercial-use boundary page.
- Privacy policy (training-data capture disclosure).
- Attribution requirements page.
- Quickstart: Claude Desktop config.
- Quickstart: Claude Code config.
- Quickstart: custom SDK agent.

Cross-client testing:

- MCP Inspector pass against staging.
- Claude Desktop pass against staging.
- Claude Code pass against staging.
- Cursor pass against staging.
- Custom Anthropic SDK example agent: public repo or gist.
- Multi-step agent demo (search to get atom to cross-reference traversal).

Launch preparation:

- Anthropic MCP directory submission package.
- `awesome-mcp-servers` GitHub PR draft.
- Launch blog post draft (`hauska.dev/blog/mcp-v1`).
- HackerNews launch post draft plus Show HN tag.
- ProductHunt launch package.
- Social posts (LinkedIn, X) drafted.
- PropTech-press outreach list (publications, journalists).

Public launch coordination:

- Final flip to public DNS.
- MCP directory submission live.
- awesome-mcp PR merged.
- Launch posts published.
- First external (non-Hauska) MCP call captured in logs.

## Sync points

You publish: none (within-track sync points 2 through 5 are cc-agent-E's; you are the consumer side).

You wait on:

- **Sync 1 — Bump 1 atom contract published.** cc-agent-AC publishes `@hauska/atom-contract@1.0.0` to npm. Until then, work against the workspace-private `@workspace/empressa-atom` shape at `legacy-design-tools/lib/empressa-atom/` (path-pin or matching shape). Response-shape pins update on signal.
- **Sync 3 — Retrieval API contract stable.** cc-agent-E publishes from Stream 1C. Until then, Stream 2A uses a mocked retrieval client identical in shape; swap to real wiring on signal.
- **Sync 4 — First jurisdiction passes eval.** cc-agent-E publishes from Stream 1D. Stream 2D pre-launch sequence unblocks on signal.
- **Sync 5 — Quality-gated 20-jurisdiction corpus.** cc-agent-E publishes from Stream 1D. Public launch unblocked; planner co-owns the announcement.

## Coordination

Planner-owned Bump 1 cross-repo PR rollout includes a PR against `hauska-mcp-server` pinning the `@hauska/atom-contract@1.0.0` dependency in your response-shape code; coordinate with planner on the PR content (planner files the PR; you confirm pin shape matches your handler usage). Sync 4 plus Sync 5 launch coordination: planner co-owns public launch posture per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 7; final go/no-go is Nick's call.

Within-Track-2 sequencing: 2A, 2B, 2C, 2D all proceed against mocked or staged backends per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points until Sync 3 lands. Real wiring follows the moment Sync 3 lands. Stream 2D launch sequence gates on Sync 4 and Sync 5. Sequence the streams as their dependencies and your context budget allow.

## Out of scope

- Atom contract package itself (cc-agent-AC owns).
- Pipeline, extraction, atomization, storage, retrieval API, eval (cc-agent-E owns all of Track 1).
- Cross-repo Bump 1 pin-update PRs (planner owns).

## Done criteria

- Stream 2A: all five tools (post-rename) return real data against the dev corpus; MCP Inspector pass; Claude Desktop pass.
- Stream 2B: four tier bands enforced; key issuance documented in a 90_runbooks runbook; self-serve signup works end-to-end against a staging deploy.
- Stream 2C: logs flow to chosen destination; dashboard visible to Nick plus planner; one week of internal testing traffic captured and queryable.
- Stream 2D: production endpoint serving on `mcp.hauska.dev`; MCP directory submission live; awesome-mcp PR merged; launch posts published; first external (non-Hauska) MCP call captured in production logs. **Sprint exit = your Stream 2D exit.**

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-M.md` in doc_repo plus commits to `hauska-mcp-server`. Coordinate launch-event session summaries with planner.
