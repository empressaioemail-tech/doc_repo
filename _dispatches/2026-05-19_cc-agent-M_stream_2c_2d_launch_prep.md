---
id: 2026-05-19_cc-agent-M_stream_2c_2d_launch_prep
title: Dispatch — cc-agent-M hauska-mcp-server (Streams 2C and 2D, public launch prep)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: superseded
superseded_by: 2026-05-21_cc-agent-M_commercialization_streams_2c_2d
related: [16_commercialization_roadmap, 51_substrate_v1_sprint, 50_hauska_mcp_server, 72_hauska_inc_operations, 14_pricing_framework, 29_mcp_surface_tier_model, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, CLAUDE.md]
---

> **Superseded 2026-05-21** by [`2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md`](2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md). The Streams 2C/2D scope carries forward into the live commercialization-sprint dispatch, refreshed for post-cutover reality and the maximum-autonomy run posture. Retained for history.

# Stream 2C + Stream 2D launch prep — cc-agent-M dispatch

You are cc-agent-M owning the `hauska-mcp-server` repo. This dispatch covers Stream 2C (logging, observability, dashboards, cost monitoring) and Stream 2D (containerization, Cloud Run deployment, docs site, cross-client testing, launch artifacts, public launch coordination). Scope is the public-launch posture of the Hauska MCP Server at `mcp.hauska.dev` on top of the substrate that Sync 4.5 closed and that your own Lane B work made addressable.

This is step 1 of the commercialization queue at [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md). Steps 2 (pricing tier numbers), 3 (Stream 2B Stripe and self-serve paid signup), and 5 (GTM motion) follow this work. Three items in this dispatch's scope cannot complete without Nick decisions; those are flagged explicitly under §Items pending Nick decisions and should be stubbed in code with a clear placeholder rather than blocked.

## Why this exists

The substrate v1 sprint shipped the catalog substrate. The combined Cortex/Codex sprint shipped the L-surface and product-tool surfaces you yourself built across Lane B Groups 1, 2, 3, and 5. The corpus is at 698 atoms across 5 jurisdictions; the MCP tool surface spans the 5 v1 catalog tools, 4 Codex product tools, 4 Cortex product tools, and the full L1 through L6 surface set from your prior Group 3 PRs; the atom contract is at v1.1.0; the engine retrieval API is real and wired.

What is missing is the publicly addressable storefront. Without containerized deployment to Cloud Run at a custom domain, a docs site, cross-client testing, and launch artifacts, the substrate cannot start producing the inbound signal that decisions A (ICP) and C (GTM channels) in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) need to resolve. This dispatch closes that gap to the point where the operator can flip the public DNS.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) — parent roadmap for this dispatch; Section §1 details step-1 close criteria.
3. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2C (lines 573 through 613) and §Stream 2D (lines 615 through 681) — primary scope source for this dispatch.
4. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — server repo overview and existing tool catalog.
5. [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) §Domains and §Regulatory posture — domain status (`hauska.dev` registered 2026-05-18; `mcp.hauska.dev` is the v1 launch subdomain) and pre-revenue compliance state.
6. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — within-vs-cross-tenant tier model that docs-site copy must align to.
7. [`14_pricing_framework.md`](../14_pricing_framework.md) §Substrate state and §Take rate philosophy — pricing copy for the docs site reads from here; tier numbers themselves are an open Nick decision (see §Items pending Nick decisions).
8. Your prior Stream 2A wiring session at [`_sessions/2026-05-19_stream_2a_wiring_cc-agent-M.md`](../_sessions/2026-05-19_stream_2a_wiring_cc-agent-M.md) and Lane B Group 4 close-out — pattern reference for production-readiness work.
9. Cutover runbook pattern at [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](../90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Cloud Run + custom-domain + canary-then-shift pattern for §Stream 2D deploy work; six-probe verification pattern transfers.

## Scope

Two streams in parallel. Stream 2C deliverables can ship independently of Stream 2D and are simpler dependency-wise; Stream 2D containerization can start in parallel; both converge on the public launch coordination checklist.

### Stream 2C — Logging, observability, dashboards, cost monitoring

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 573 through 613. Major items:

Structured logger with the canonical log shape `{ts, request_id, method, params, ip, key_hash, tier, response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`. Default destination is Postgres index per ADR-010 plus GCS raw payloads; alternative is BigQuery plus GCS if Postgres pressure is a concern. The Phase 0 decision is Postgres per the sprint Phase 0 close; revisit only if logger load profiling at staging surfaces concern.

Cloud Logging integration: structured JSON to stdout and stderr, log-based metrics for error rate and P99 latency, alerts on error rate above threshold and P99 above threshold. Thresholds: propose 1 percent error and 1500 ms P99 as v1 defaults; raise or lower per real traffic post-launch.

Dashboards in BigQuery + Looker Studio (or pick lightest tool; document choice in your session summary): calls per day by tool, jurisdiction, and tier; top jurisdictions queried; top tools called; error rate; latency histograms; new free-tier IPs (commercial-use candidate signal); high-volume free-tier IPs (commercial-use detection); per-key usage for paid tier when Stream 2B lands.

Training-data export query: anonymized request and response export, per-tool call sequences, ready for fine-tuning or eval ingest. v1 shape is a documented query; productionization (scheduled export, packaging) is post-launch work.

Cost monitoring: per-tier cost attribution covering compute plus storage; free-tier-cost vs paid-tier-revenue dashboard (the paid side surfaces zero until Stream 2B lands; build the dashboard now so it lights up the moment paid traffic arrives).

Health check endpoint enhancements: latency stats, last-successful-call timestamp, dependency health (engine retrieval API, Postgres, Upstash).

### Stream 2D — Deploy, docs, cross-client testing, launch prep

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 615 through 681. Major items:

Containerization. `Dockerfile` with Node 20 base and multi-stage build, `.dockerignore`, local build-plus-run verification. Mirror the legacy-design-tools Dockerfile pattern from Lane C.2 PR #39 (cc-agent-C) where applicable; reduces drift in the per-repo Cloud Run posture.

Cloud Run deployment. `cloudbuild-mcp.yaml` mirroring the SmartCity OS pattern. Service spec with autoscale, min-instances 1, region us-central1 default. Secret Manager bindings for `BACKEND_URL`, `BACKEND_KEY`, `REDIS_URL`, `DATABASE_URL`, `STRIPE_KEYS` (stub for Stream 2B), `ADMIN_BOOTSTRAP_KEY`. Apply the cutover env-var bind procedure at [`90_runbooks/cutover_env_var_bind_procedure.md`](../90_runbooks/cutover_env_var_bind_procedure.md) so every env reference is traced and there are no silent drops; this is the procedure that closed the 2026-05-11 SmartCity OS Fire 2 silent-drop class.

Custom domain at `mcp.hauska.dev` per [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Domains section (`hauska.dev` registered 2026-05-18). TLS managed cert, Cloud Armor or WAF config per the same pattern as SmartCity OS production.

Docs site. Static site (Astro, Next.js, or Docusaurus; pick lightest; document choice in your session summary) at `docs.hauska.dev` or `mcp.hauska.dev/docs`. Schema reference auto-generated from your Zod schemas. Example queries page. Free vs paid tier definitions reading from [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). Tier-pricing page stubbed pending Nick decision B (see below). ToS plus commercial-use boundary page. Privacy policy with training-data capture disclosure per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 644. Attribution requirements page per the "Powered by Hauska Engine — hauska.dev" attribution from [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 515. Quickstart pages for Claude Desktop config, Claude Code config, custom SDK agent.

Cross-client testing. MCP Inspector pass against staging. Claude Desktop pass against staging. Claude Code pass against staging. Cursor pass against staging. Custom Anthropic SDK example agent published as a public repo or gist. Multi-step agent demo: search → get atom → cross-reference traversal. This is more than your prior Lane B Group 4 cross-client matrix because it now includes the deployed Cloud Run surface, the custom domain, and the docs-site quickstart flows in a single end-to-end exercise.

Launch preparation. Anthropic MCP directory submission package. `awesome-mcp-servers` GitHub PR draft. Launch blog post draft at `hauska.dev/blog/mcp-v1`. HackerNews launch post draft plus Show HN tag. ProductHunt launch package. Social posts (LinkedIn, X) drafted. PropTech-press outreach list (publications, journalists). The narrative for each of these depends on decisions A and C (see below); produce them as drafts with the narrative-dependent passages stubbed, ready for Nick to fill in after the open decisions land.

Public launch coordination. Final flip to public DNS (operator action; do not flip yourself). MCP directory submission live. `awesome-mcp` PR merged. Launch posts published per the channel and date plan from decision C. First external (non-Hauska) MCP call captured in logs as the sprint-exit signal per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 681.

## Items pending Nick decisions

Three categories of work in this dispatch read from Nick decisions that are not yet made. Stub each with a clear placeholder; do not block the rest of the work.

**Tier pricing page (pricing numbers).** Decision B in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md). Build the page layout. Stub the numbers with a placeholder block reading "Pricing tiers in finalization; contact for early-access pricing." Plumb the per-tier copy through a single config file so a one-line edit lands the real numbers once decision B closes.

**Launch artifact narrative passages (ICP framing and GTM channels).** Decisions A and C in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md). Draft each launch artifact with structural sections present (what is Hauska, how to use it, code examples, links) and narrative passages (who is this for, what should you do next, where else can you find us) stubbed with placeholder text plus inline comments naming what input is needed.

**Stripe scaffold (Stream 2B work).** Out of this dispatch's scope; Stream 2B fires under step 3 of [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md). Stub the `STRIPE_KEYS` secret binding name in Cloud Run config but do not wire any Stripe code. Free-tier signup ships first per the free-tier-first sequencing rule in the roadmap.

## Test plan

Per Stream 2C:

1. Logger emits canonical log shape on every request and every tool-call entry; verify against a sample request trace in staging.
2. Log-based metric and alert fire correctly when synthetic error rate spikes above threshold in staging.
3. Each dashboard panel returns non-empty data when staging traffic is replayed; visual inspection.
4. Training-data export query runs and returns expected schema.
5. Cost-monitoring dashboard surfaces compute-plus-storage attribution; paid-tier-revenue panel returns empty (correct pre-Stream-2B).
6. Health check endpoint returns dependency-health structure for engine, Postgres, and Upstash.

Per Stream 2D:

7. Local Docker build runs and serves a tool-call round-trip via MCP Inspector.
8. Cloud Run deployment via `cloudbuild-mcp.yaml` succeeds; service spec matches the autoscale-min-1 declaration.
9. Custom domain at `mcp.hauska.dev` serves over TLS; cert is managed and auto-renewing.
10. Docs site renders at `docs.hauska.dev` or `mcp.hauska.dev/docs`; auto-generated schema reference reflects current Zod state.
11. Cross-client matrix: MCP Inspector, Claude Desktop, Claude Code, Cursor each complete a multi-step `search → get atom → cross-reference traversal` flow against the deployed staging surface.
12. Example agent repo or gist is public and self-contained.

Six-probe verification pattern from the legacy-design-tools cutover runbook transfers to the staging-to-production traffic shift at Stream 2D public launch coordination time.

## Dependencies

Gates this dispatch:

- Lane B Group 4 close (currently in flight per the Group 4 addendum dispatched 2026-05-19 in [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](2026-05-19_cc-agent-M_mcp_tool_surfaces.md) §Group 4 addendum). Do not start this dispatch until Group 4 fires its cross-client verification session summary; the cross-client baseline from Group 4 is the foundation Stream 2D cross-client testing builds on.

Parallel-safe with:

- Legacy-design-tools cutover (operator-led; Lane C.6). Shares no infrastructure with `hauska-mcp-server`; the two production surfaces are independent.
- Lane A.2 follow-on work at cc-agent-E (no current dispatch). No shared surface.
- ECI atomization P1 dispatch (no current dispatch). No shared surface.

Not parallel-safe with:

- Stream 2B Stripe wire-up. Per the free-tier-first rule, Stream 2B sequences after this dispatch closes and after decision B lands. Do not pre-wire.

## Hand-off

Per stream, fire a session summary at `_sessions/<date>_stream_2c_<topic>_cc-agent-M.md` or `_sessions/<date>_stream_2d_<topic>_cc-agent-M.md` as Streams 2C and 2D progress. The dispatch closes with a final hand-off session summary at `_sessions/<date>_streams_2c_2d_launch_prep_close_cc-agent-M.md` summarizing both streams and naming what remains for the operator-led public DNS flip.

The first external MCP call captured in logs is the sprint-exit signal per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 681. That signal is what step 1 of [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) closes against.

Hand-off targets:

- Stream 2C deliverables to Nick plus planner ops review per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 613.
- Stream 2D production endpoint to Nick for the public DNS flip per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) line 681.
- Launch artifact drafts to Nick for ICP-and-GTM-narrative fill-in (post decision A and decision C).

If during implementation a scope item proves out-of-shape (a dashboard tool choice that does not fit Hauska's stack profile, a docs-site framework that adds disproportionate complexity, a Cloud Run config surprise), surface the proposed adjustment in your session summary and let the planner ratify before locking. Production-readiness work is contract-grade for the operator.
