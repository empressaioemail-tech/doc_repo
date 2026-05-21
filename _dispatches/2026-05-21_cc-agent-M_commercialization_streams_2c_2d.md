---
id: 2026-05-21_cc-agent-M_commercialization_streams_2c_2d
title: Dispatch — cc-agent-M Streams 2C + 2D (Hauska MCP Server public launch)
date: 2026-05-21
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
supersedes: 2026-05-19_cc-agent-M_stream_2c_2d_launch_prep
related: [2026-05-21_hauska_commercialization_sprint, 16_commercialization_roadmap, 51_substrate_v1_sprint, 50_hauska_mcp_server, 29_mcp_surface_tier_model, 72_hauska_inc_operations, CLAUDE.md]
---

# Lane M — cc-agent-M dispatch (Streams 2C + 2D, Hauska MCP Server public launch)

You are cc-agent-M owning the `hauska-mcp-server` repo. This dispatch is Lane M of the Hauska commercialization sprint per [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](../_decisions/2026-05-21_hauska_commercialization_sprint.md). It takes the Hauska MCP Server from feature-complete-but-local to publicly deployed at `mcp.hauska.dev` with the free Layer 1 catalog tier, full observability, a docs site, and verified cross-client behavior.

This dispatch supersedes `_dispatches/2026-05-19_cc-agent-M_stream_2c_2d_launch_prep.md`. The scope is the same two streams; the framing is updated for post-cutover reality and for the maximum-autonomy model.

## Run posture — read this first

You run with maximum-autonomy authority per the sprint decision record. Concretely:

- Run this entire dispatch end to end without returning for instruction. The dispatch is your full queue.
- **Self-merge.** When CI is green and a unit of work meets its dispatch criteria, merge your own PR and proceed. Do not wait for an operator merge.
- **Self-deploy.** Deploy to the `hauska-mcp-server` Cloud Run service autonomously. Verify every deploy.
- **Decide and document.** Design and mechanism choices inside this dispatch's scope are yours. Pick the option, document it in a session summary, move on. Do not escalate mechanism choices.
- File a session summary per stream and per natural break-point so the operator can audit asynchronously. Do not block between summaries.

**Hard stops — never do these autonomously:**

- Do not publish any outward-facing GTM artifact (HackerNews post, ProductHunt, social posts, blog announcement). You draft them; the operator publishes.
- Do not wire Stripe, billing, or the paid Layer 2 tier. That is Wave 2.

**Pause and flag** (stop, file an Open Question session summary, wait) only for: a genuine structural fork this dispatch did not anticipate; a conflict with a structural commitment; a security concern.

**Always holds:** the quality gate (every response carries source attribution, confidence, timestamp); honest claims in all docs and draft artifacts (claim only what is true).

## Why this exists

The commercialization layer is the Hauska MCP Server, publicly addressable, serving the jurisdiction catalog to agent builders. The server's tool surface is done (35 product-gated tools plus 5 public catalog tools) and the cutover proved the MCP gate works end to end. What is missing is the deployed, observable, documented public storefront. This dispatch closes that gap to the point where the service is live at `mcp.hauska.dev` and an external agent can call the free catalog tier.

The ICP is the agent builder: an individual developer or small team building construction-tech, permitting, real-estate, or civic agents who need jurisdiction-grounded code and zoning answers. The docs site and the launch-artifact drafts speak to that buyer. The public story is the **catalog** (the public Layer 1 jurisdiction and building-code tools); the 35 product-gated Cortex and Codex tools stay product-key-gated and are not part of the public marketing.

## Read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](../_decisions/2026-05-21_hauska_commercialization_sprint.md) — the sprint, the autonomy model, the ICP.
3. [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) — step 1 close criteria.
4. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2C (lines 573 to 613) and §Stream 2D (lines 615 to 681) — primary scope source.
5. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — server overview, tool catalog, business-model framing.
6. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — tier model the docs-site copy aligns to.
7. [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) §Domains — `hauska.dev` registered 2026-05-18; `mcp.hauska.dev` is the v1 launch subdomain.
8. [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](../90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Cloud Run, custom-domain, canary-then-shift, six-probe verification pattern; transfers directly.
9. Your prior sessions: Stream 2A wiring, the Group 3 L-surface work, the Amendment 8 follow-on, and the 2026-05-19 cross-client session — pattern reference.

## Cross-lane dependency

The 5 public catalog tools call the `hauska-engine` retrieval API. That API is being deployed to Cloud Run by cc-agent-E as Lane E Phase E0. The 35 product-gated Cortex and Codex tools call `cortex-api`, which is already deployed and live from the cutover.

You can build and test everything in this dispatch against a local or staging engine. The final production wiring of the public catalog tools points at cc-agent-E's deployed retrieval API. Coordinate the endpoint URL with cc-agent-E. Do not block your Stream 2C and 2D work on E0; wire production catalog last.

## Scope

### Stream 2C — Logging, observability, dashboards, cost monitoring

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 573 to 613.

Structured logger with the canonical log shape `{ts, request_id, method, params, ip, key_hash, tier, response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`. Destination is Postgres index plus GCS raw payloads per the Phase 0 decision. Log on request entry and on response; log inside each tool handler with tool-specific fields.

Cloud Logging integration: structured JSON to stdout and stderr; log-based metrics for error rate and P99 latency; alerts on error rate above 1 percent and P99 above 1500 ms (v1 defaults, your call to adjust against real traffic).

Dashboards (BigQuery plus Looker Studio, or lightest tool; document your choice): calls per day by tool, jurisdiction, tier; top jurisdictions; top tools; error rate; latency histograms; new and high-volume free-tier IPs (commercial-use signal for later BD); per-key usage for the paid tier (the panel returns empty pre-Wave-2; build it now).

Training-data export query: anonymized request and response export, per-tool call sequences, ready for fine-tuning or eval ingest. v1 is a documented query.

Cost monitoring: per-tier compute-plus-storage attribution; a free-tier-cost vs paid-tier-revenue dashboard (paid side empty pre-Wave-2).

Health-check endpoint enhancements: latency stats, last-successful-call timestamp, dependency health (engine retrieval API, `cortex-api`, Postgres, Upstash).

### Stream 2D — Deploy, docs, cross-client testing, launch-artifact drafts

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 615 to 681.

**Containerization.** `Dockerfile`, Node 20 base, multi-stage build, `.dockerignore`, local build-and-run verification. Mirror the legacy-design-tools Dockerfile pattern where it applies.

**Cloud Run deployment.** `cloudbuild-mcp.yaml` mirroring the SmartCity OS and cortex-api pattern. Service spec: autoscale, min-instances 1, region `us-central1`. Secret Manager bindings for `BACKEND_URL` (engine retrieval API), `BACKEND_KEY`, `REDIS_URL`, `DATABASE_URL`, `CORTEX_API_URL`, `ADMIN_BOOTSTRAP_KEY`. Stub a `STRIPE_KEYS` binding name only; do not wire it. Apply the cutover env-var bind procedure so every env reference is traced with no silent drops.

**Custom domain.** Map `mcp.hauska.dev` to the Cloud Run service. TLS managed cert. Cloud Armor or WAF config per the smartcity-os pattern. The service being technically live at `mcp.hauska.dev` is fine and expected; it is undiscovered until the operator runs GTM, so mapping the domain is not the launch announcement.

**Docs site.** Static site (Astro, Next.js, or Docusaurus; pick lightest, document the choice) at `docs.hauska.dev` or `mcp.hauska.dev/docs`. Schema reference auto-generated from your Zod schemas. Example queries. Free vs paid tier definitions reading from [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). A tier-pricing page with the layout built and the numbers stubbed behind a single config file (placeholder copy: "Pricing in finalization; contact for early access"); a one-line edit lands the real numbers in Wave 2. ToS and commercial-use boundary. Privacy policy with training-data capture disclosure. Attribution-requirements page. Quickstarts for Claude Desktop, Claude Code, Cursor, and a custom SDK agent. The docs speak to the agent-builder ICP and lead with the catalog use case (jurisdiction codes, building codes, zoning).

**Cross-client testing.** MCP Inspector, Claude Desktop, Claude Code, and Cursor each complete a multi-step `search to get-atom to cross-reference traversal` flow against the deployed service. This folds in and formally closes the Group 4 cross-client verification (de-risked already by the cutover smoke matrix; this is the formal pass against the deployed surface). Publish a self-contained example agent as a public repo or gist.

**Launch-artifact drafts.** Anthropic MCP directory submission package; `awesome-mcp-servers` PR draft; launch blog draft at `hauska.dev/blog`; HackerNews and Show HN draft; ProductHunt package; social post drafts; PropTech-press list. Draft all of these. The ICP-framing and channel-sequence passages depend on the GTM working session; stub those passages with placeholder text and an inline note naming the input needed. Do not publish anything.

## Free-tier shape

Confirm in your first session summary how free Layer 1 access works today (anonymous with IP rate limiting, or free self-serve key). Self-serve auto-issuance is Phase 8 and Wave 2; for Wave 1 ship the free tier as it is already built. The docs site documents whatever the real free-tier path is.

## Test plan

Per Stream 2C: logger emits the canonical shape on every request and tool-call; log-based metric and alert fire on a synthetic error spike; each dashboard panel returns data on replayed staging traffic; the training-data export query returns the expected schema; the health endpoint returns dependency health.

Per Stream 2D: local Docker build serves a tool round-trip via MCP Inspector; Cloud Run deploy via `cloudbuild-mcp.yaml` succeeds and matches the service spec; `mcp.hauska.dev` serves over managed TLS; the docs site renders with a current auto-generated schema reference; the cross-client matrix passes the multi-step flow against the deployed service; the example agent repo is public and self-contained.

The six-probe verification pattern from the cutover runbook transfers to the staging-to-production traffic shift.

## Close criteria

Lane M closes when: the Hauska MCP Server is deployed to Cloud Run at `mcp.hauska.dev` over managed TLS; Stream 2C observability is live with dashboards returning real data; the docs site is live; the cross-client matrix passes against the deployed surface; the public catalog tools are wired to cc-agent-E's deployed retrieval API (Lane E Phase E0); and all launch artifacts are drafted (publication pending, operator and Wave 2). File a final hand-off session summary naming exactly what remains for the operator-led GTM publication.

## Hand-off

Session summaries land at `_sessions/<date>_<topic>_cc-agent-M.md` per stream and per break-point. The final hand-off summary names the deployed endpoints, the dashboard URLs, the docs-site URL, the launch-artifact draft locations, and the operator actions remaining for GTM. If any scope item proves out of shape (a tool choice that does not fit the stack, a Cloud Run config surprise), pick the better option, document it, and proceed; flag only a genuine structural fork.
