---
id: 2026-05-21_hauska_commercialization_sprint
title: Decision — Hauska commercialization sprint (two-wave, maximum-autonomy)
date: 2026-05-21
status: active
related: [16_commercialization_roadmap, 50_hauska_mcp_server, 51_substrate_v1_sprint, 14_pricing_framework, 72_hauska_inc_operations, 73_partnerships, 80_adrs/adr_019_layered_code_substrate, _dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d, _dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5]
owner: nick
---

# Decision — Hauska commercialization sprint

## Status

**Active, launched 2026-05-21.** Executes the seven-step queue in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md). Pre-mortem cleared yellow-resolved (see below). Two dispatches filed; both run with maximum-autonomy authority per the model below.

## Context

The combined Cortex/Codex sprint cutover is complete (2026-05-20): cortex-api on Cloud Run, Replit data dependency severed, MCP-driven QA gate empirically proven. The Cortex QA backlog is worked to completion bar one tail item. The Hauska MCP Server is feature-complete on the tool side (35 product-gated + 5 public catalog tools) but runs locally only. ADR-019 ratified the layered code substrate, which makes corpus expansion cheap. cc-agent-M and cc-agent-E have idle capacity.

The operator's objective: plan and implement the Hauska commercialization layer, planner-coordinated, with agents running as long and autonomously as possible.

## Decision

Run a two-wave, one-agent-per-repo commercialization sprint.

**Wave 1 (decision-independent, starts immediately).** Lane M: cc-agent-M ships Streams 2C and 2D, deploying the Hauska MCP Server publicly at `mcp.hauska.dev` with the free Layer 1 catalog tier. Lane E: cc-agent-E deploys the hauska-engine retrieval API, builds the ADR-019 layered-substrate pipeline, ingests the Layer 1 model-code base, and runs Sync 5 corpus expansion. The two lanes are different repos and fully parallel-safe.

**Wave 2 (decision-gated, follows).** Stripe plus self-serve paid Layer 2 signup; atom-contract licensing-metadata bump if the payment substrate needs it; GTM execution. Gated on pricing-tier numbers, GTM channel plan, and Hauska Inc. corporate readiness. Wave 2 dispatches are drafted once those land.

**Free-tier-first holds.** The free Layer 1 catalog launches in Wave 1. Paid Layer 2 follows in Wave 2. The technical launch (deploy, custom domain, docs site) completes autonomously in Wave 1; the outward-facing GTM announcement is operator-gated and aligns naturally with Lane E Phase E1 landing so the public-free catalog leads with the model-code base.

## ICP, pricing, and GTM ratifications

**ICP (decision A) ratified: agent builders.** Individual developers and small teams building construction-tech, permitting, real-estate-diligence, or civic agents who need jurisdiction-grounded code and zoning answers. Doc 16's options 1 and 2 (Anthropic-ecosystem and Cursor-ecosystem builders) are the same buyer through different channels and are merged. The enterprise reseller (option 3) is the deferred secondary: it carries the contract value but is BD-led and gated on corporate readiness that does not yet exist. The v1 launch generates the usage data and inbound that make the reseller conversation real later.

**Pricing shape (decision B) ratified; numbers pending.** Free Layer 1 with a usage cap and required attribution, plus two self-serve paid Layer 2 tiers (a builder tier and a scale tier). Exact price points and call quotas land in a dedicated working session against comparable-substrate references, written into [`14_pricing_framework.md`](../14_pricing_framework.md) before Wave 2.

**GTM shape (decision C) ratified; channel plan pending.** Developer-community distribution: Anthropic MCP directory, `awesome-mcp-servers`, launch blog at `hauska.dev`, Show HN, MCP and Claude developer communities. The channel sequence, dates, and owner-per-channel land in a one-page launch plan before the GTM publication moment. cc-agent-M drafts the launch artifacts under Lane M; the operator publishes.

## Maximum-autonomy model

Both Wave 1 dispatches run with the following authority. This makes deliberate exceptions to the standing "Nick holds the merge and deploy buttons" rule, by operator instruction, to maximize uninterrupted agent runtime.

Granted to the agents:

- Run the entire lane scope without returning for instruction. The dispatch is the full queue.
- Self-merge: when CI is green and the item's dispatch criteria are met, merge your own PR and proceed. Do not wait for an operator merge.
- Self-deploy: deploy to your repo's own Cloud Run service autonomously; verify post-deploy.
- Decide-and-document: design and mechanism choices within the dispatch scope are yours. Document each in a session summary; do not escalate mechanism choices.
- File a session summary per natural break-point so the operator can audit asynchronously, but do not block between summaries.

Hard stops (operator-only, never autonomous):

- Publishing any outward-facing GTM artifact (HN post, ProductHunt, social, blog announcement). Draft them; do not publish.
- Anything involving payment, Stripe, or the paid Layer 2 tier. That is Wave 2.
- ADR-019 decision 6: hosting verbatim model-code text. The sprint runs on the interim deep-link footing only.

Pause-and-flag (stop, file an Open Question session summary, wait):

- A genuine structural fork the dispatch did not anticipate.
- A conflict with a structural commitment.
- Eval below the quality bar, or cost exceeding the per-jurisdiction commitment.
- A security concern.

Structural constraints that always hold (not exceptions-eligible):

- Quality gate: every atom and output carries source attribution, confidence score, timestamp.
- Path A tagging: non-partnered jurisdictions are tagged `platform-internal`, never `public-free`. Partnership-flip is the only path to public.
- Interim deep-link footing: never host verbatim model-code text.
- Honest claims: launch-artifact drafts claim only what is true.

## Pre-mortem result

Yellow, resolved. Six of seven structural commitments cleared green; ADR-019 actively improves cost-per-jurisdiction. One yellow on partnership-first sourcing (load-bearing): Sync 5 corpus expansion under commercialization pressure creates an incentive to expose non-partnered jurisdictions publicly. Resolution, folded into the Lane E dispatch as a hard constraint: every non-partnered jurisdiction stays `platform-internal` per Path A, and the launch corpus narrative honestly distinguishes partnered and public jurisdictions from platform-internal ones. With that clause the sprint clears green.

## Lanes

**Lane M** — [`_dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md`](../_dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md). Supersedes the 2026-05-19 Stream 2C/2D launch-prep dispatch.

**Lane E** — [`_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5.md`](../_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5.md). Three phases: E0 deploy the retrieval API; E1 ADR-019 pipeline plus Layer 1 model-code base ingest; E2 Sync 5.

**Parallel operator tracks (not cc-agent lanes).** ICC and NFPA model-code licensor pitch, scaffolded in [`73_partnerships.md`](../73_partnerships.md), decoupled from the substrate per ADR-019; a Nick and bizops call. Pricing-numbers working session and GTM channel-plan working session, both feeding Wave 2.

## Reversal criteria

Revisit the two-wave structure if Wave 1 surfaces that the free-tier launch cannot meaningfully proceed without a paid-tier decision (it should not; the free tier is decision-independent by construction).

Revisit the maximum-autonomy model if self-merge produces a material regression that a human merge gate would have caught; tighten to batched operator merge in that case.

Revisit the agent-builder ICP if Wave 1 launch inbound is dominated by enterprise-reseller interest rather than individual builders; promote the reseller ICP and add a Wave 2 BD lane.

## References

- [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) — the seven-step queue this sprint executes.
- [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — the layered substrate Lane E builds.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — the storefront repo Lane M ships.
- [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — Streams 2C, 2D scope source.
- [`14_pricing_framework.md`](../14_pricing_framework.md) — pricing decisions B and the take-rate framework.
- [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) — corporate readiness gating Wave 2.
