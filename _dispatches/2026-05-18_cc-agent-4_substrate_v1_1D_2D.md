---
id: 2026-05-18_cc-agent-4_substrate_v1_1D_2D
title: Dispatch — cc-agent-4 substrate v1 (Streams 1D + 2D; quality and production posture)
date: 2026-05-18
agent: cc-agent-4
repo: hauska-engine + hauska-mcp-server
kind: dispatch
related: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 11a_bastrop_live_roadmap, 72_hauska_inc_operations, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/cutover_env_var_bind_procedure, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-4 dispatch (Streams 1D + 2D)

You are cc-agent-4, owning the quality-and-production-posture slice. Eval harness plus curated queries plus batch ingest plus coverage dashboard in `hauska-engine`; deploy plus docs plus cross-client testing plus launch in `hauska-mcp-server`. Your slice owns the 3-county hard-kill checkpoint (load-bearing structural commitment #3) and the public launch posture.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity. Structural commitment #3 (cost per jurisdiction under $200 compute plus 1 hour human review; hard kill at three counties) is load-bearing for your slice.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions. Operational ones for your slice: 90/100/95 quality bar with recalibrate-after-10; LLM-generate plus human-review-first-20 curated query authoring; human-review-gate-first-20 pre-publish; TX-first 25-city list approved (M9 Tier-3 deferred to batch-time); cost budget from Hauska Inc. equity; Cloud Run hosting; `mcp.hauska.dev` launch domain (`hauska.dev` registered same day).
4. [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md) — fleet doubling rationale and your stream-pair allocation.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — sprint plan. Focus on §Stream 1D (eval, curated queries, batch ingest, coverage dashboard, cost-per-jurisdiction tracking) and §Stream 2D (containerization, deploy, docs, cross-client testing, launch); §Sync points (you publish 4 and 5; you wait on 6 from Nick); §What's deliberately deferred.
6. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — §B.4 eval harness and §B.6 coverage dashboard for your Track 1 reference.
7. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — §Phase 5 deploy, §Phase 6 docs, §Phase 7 launch for your Track 2 reference.
8. [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) — Sprint A.1 corpus load coordinates with your Stream 1D B.6 Bastrop validation pass.
9. [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) — Capital allocation section (your batch ingest budget funded from Hauska Inc. equity); Domains section (`hauska.dev` registered; `mcp.hauska.dev` is your launch subdomain); IP attorney memo section (Sync 6 dependency for non-Bastrop ingestion).
10. [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) — canonical Cloud Run deploy path you follow.
11. [`90_runbooks/cutover_env_var_bind_procedure.md`](../90_runbooks/cutover_env_var_bind_procedure.md) — env-var bind procedure (every env reference traced, no silent drops).

## Scope

### Track 1 — Stream 1D in `hauska-engine`

Eval harness skeleton (`packages/corpus/src/eval/`):

- Curated query schema: `(jurisdiction, query_text, expected_atom_did, query_type)`.
- Retrieval test runner: query to retrieval API to check top-3 contains expected atom; report pass/fail per query plus aggregate.
- Coverage test runner: sample N atoms; check each retrievable by section number per [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.4 100% target.
- Cross-reference test runner: sample N `code-cross-reference` atoms; check each `to_cid` resolves to a real atom per 49 §B.4 95% target.
- Quality bar enforcement: `evaluate(jurisdiction) returns {passed: bool, scores: {...}, failures: [...]}`.
- CLI integration: `ingest-cli eval bastrop-tx`.

Curated query authoring:

- LLM-generate first-pass queries from each jurisdiction's TOC (Claude prompt plus `jurisdiction-corpus` atom).
- Human review tooling (CLI to walk query list, mark accept/edit/reject; persist to Postgres `curated_queries` table).
- Bastrop UDC queries: human-reviewed by Sylvia or Jaime (reviewer-zero); gold-standard set.
- Grand County IRC queries: same.
- First TX batch queries: LLM plus light human review.

Version tracking (`packages/corpus/src/version-tracking/`):

- Drift detection: re-fetch source per jurisdiction on schedule; diff structural extraction; flag changes.
- Amendment ingestion path: new ordinance to `code-amendment` atom plus new CID on affected `code-section` per ADR-011 chain.
- Edition tracking: `code-edition` atom version on amendments.
- Operator review surface for flagged drift (manual triage before atom updates).

Coverage dashboard (B.6 ops surface):

- Loaded jurisdictions list (jurisdiction, edition, last refresh, quality status, atom count, drift status).
- Per-jurisdiction quality detail (top-3 score, section-num score, cross-ref score).
- Failed eval history (which queries failed, against which sections, suggested fixes).
- Surface for hauska-mcp-server `list_jurisdictions` tool (only loaded plus quality-passing jurisdictions appear).

Cost-per-jurisdiction tracking (load-bearing):

- Per-jurisdiction compute cost capture (LLM tokens, OCR spend, embedding compute, infrastructure attributable).
- Per-jurisdiction human-review-hours capture (operator CLI records review-start and review-finish per jurisdiction).
- Dashboard line: cost-per-jurisdiction vs target of $200 compute plus 1 hr human review.
- Flag-and-review pipeline: jurisdictions exceeding target surface for engineering review (not silently absorbed).
- **Hard-kill checkpoint at 3 counties**: if the metric is not achievable after first three counties (proof set in early batch ingest), halt catalog expansion and surface to Nick for thesis review per catalog roadmap Move 3.

B.6 Bastrop validation pass:

- Run full pipeline against Bastrop UDC.
- Diff atom output against A.1 one-off load.
- Investigate any quality deltas; iterate on adapters and extraction until parity or improvement.
- Same for Grand County IRC.

First TX batch ingest (Tier 1 plus Tier 2 plus Tier 3 from 51 §Stream 1D starter list; M9 Tier-3 slot to be named at batch-time):

- Tier 1 (Bastrop-network): Round Rock, Pflugerville, Cedar Park, Leander, Hutto, Elgin, Smithville, Manor, Taylor, Georgetown.
- Tier 2 (major TX metros): Austin, San Antonio, Fort Worth, El Paso, Plano, Arlington, Irving, Garland, Lubbock, Laredo.
- Tier 3 (open pipeline targets): Jarrell, M9 candidate (Nick to name at batch-time), Frisco, McKinney, Killeen.

**Tier 1 plus Tier 2 plus Tier 3 ingest gated on Sync 6 (Texas IP attorney opinion memo, Nick action).** Bastrop plus Grand County stay unblocked (one-off load plus B.6 validation pass).

eCode360 batch (post-Stream 1A eCode360 adapter): Houston, Dallas, others identified as eCode360-resident.

Per-jurisdiction quality gate: ingest job marks jurisdiction "loaded" only when eval harness passes quality bar.

### Track 2 — Stream 2D in `hauska-mcp-server`

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

You publish:

- **Sync 4 — First jurisdiction passes eval.** Pre-launch gate. At least Bastrop UDC passes the quality bar. Signal in your session summary; cross-track 2D launch sequence unblocks.
- **Sync 5 — Quality-gated 20-jurisdiction corpus.** Public launch unblocked once 20 TX jurisdictions pass eval. Planner co-owns the public launch announcement.

You wait on:

- **Sync 1 — Bump 1 atom contract published.** Planner-coordinated. Eval harness runs against the published atoms once Bump 1 lands.
- **Sync 2 — Adapter contract stable.** cc-agent-1 publishes from Stream 1A. Until then, eval writes against mocked adapter output and curated query authoring proceeds against documented TOCs.
- **Sync 3 — Retrieval API contract stable.** cc-agent-3 publishes from Stream 1C. Eval harness queries through Stream 1C retrieval API; until then, eval runs against direct index reads.
- **Sync 6 — Texas IP attorney opinion memo delivered.** Nick action, external. Tier 1 plus Tier 2 plus Tier 3 batch ingest gated on this; Bastrop plus Grand County stay unblocked. Track at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) IP attorney memo section.

## Coordination

The 3-county hard-kill checkpoint is the structural-commitment-#3 enforcement mechanism. If first three counties exceed $200 plus 1 hr per jurisdiction, halt and surface to Nick before continuing Tier 1 plus Tier 2 plus Tier 3 ingest. Cost-per-jurisdiction tracking is your slice's most load-bearing telemetry; coordinate dashboard with cc-agent-3's Stream 2C dashboards (cost-per-tier vs cost-per-jurisdiction are sibling views). Public launch posture per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Phase 7 is planner-co-owned; final go/no-go is Nick's call.

## Out of scope

- Adapter framework and pipeline runner (Stream 1A / cc-agent-1).
- Atom contract registration (Stream 1B / cc-agent-2).
- Storage, IPFS, Postgres index, retrieval API (Stream 1C / cc-agent-3).
- MCP tool surface and backend wiring (Stream 2A / cc-agent-1).
- Auth, rate limiting, Stripe (Stream 2B / cc-agent-2).
- Logging and observability (Stream 2C / cc-agent-3).

## Done criteria

Stream 1D exit per 51: Bastrop and Grand County pass quality bar; cost-per-jurisdiction tracking live; first TX batch ingest (Tier 1) under way; coverage dashboard usable; 3-county hard-kill checkpoint enforced.
Stream 2D exit per 51: production endpoint serving; MCP directory submission live; awesome-mcp PR merged; launch posts published; first external (non-Hauska) MCP call captured in production logs. **Sprint exit = your Stream 2D exit.**

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-4.md` in doc_repo plus commits to `hauska-engine` and `hauska-mcp-server`. Coordinate launch-event session summaries with planner.
