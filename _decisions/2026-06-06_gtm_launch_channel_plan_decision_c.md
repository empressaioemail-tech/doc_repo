---
decision_id: 2026-06-06_gtm_launch_channel_plan_decision_c
date: 2026-06-06
owner: Nick
status: active
related_canonical: [16_commercialization_roadmap, 76b_gtm_engine_polish_sprint, 50_hauska_mcp_server, 00d_portfolio_roadmap_reference]
related_artifact: 90_runbooks/gtm_launch_channel_plan_v1.yaml
---

## Decision

Decision C (GTM channels, sequence, owner per channel for the Hauska MCP public launch) is ratified. Developer-community distribution to the agent-builder ICP, free-tier-first, in three waves:

1. **At `mcp.hauska.dev` launch:** list in MCP directories (Anthropic MCP registry, mcp.so, Smithery, Glama) — owner cc-agent-M with planner coordination; ship docs site + a "build a permit-research agent in 10 lines" quickstart against the free Layer 1 tier — owner planner drafts, operator approves. Free Layer 1 is the acquisition engine.
2. **Launch week:** developer-community posts in the Claude/Anthropic MCP community and the Cursor community — **owner: Nick personally** (founder voice).
3. **Ongoing:** one build-with-Hauska content post per jurisdiction or capability milestone — owner planner drafts, operator posts. ICC and Cotality integrations become secondary amplifiers once cited.

Full plan artifact: `90_runbooks/gtm_launch_channel_plan_v1.yaml`.

## Context

`16_commercialization_roadmap.md` step 5 and the 2026-05-21 sprint decision settled the shape (developer-community distribution) but deferred the channel list, sequence, and owners, gating Wave 2. Ratified in the 2026-06-06 working session.

## Structural commitment check

Pre-mortem run 2026-06-06, green across all checks. Free Layer 1 as acquisition preserves the tier model (commitment 1); MCP-directory-first distribution serves the dual-interface principle (commitment 4); it is distribution not sourcing, so partnership-first (commitment 2) is not implicated; on the Hauska spine and on the active commercialization sprint.

## Reasoning

The agent-builder ICP lives in MCP directories and the Claude/Cursor developer communities, so distribution meets them there rather than via enterprise sales. Free-tier-first holds the sequencing rule from `16` (ship free signup and distribution before paid signup, so pricing follows demand signal rather than preceding it). Founder-voice community posts convert better than agent-posted content at this stage; the operator owns them deliberately.

## Reversal criteria

Revisit if MCP-directory listings produce no inbound signal within the first launch window, if the Claude vs Cursor community split shows one channel dominating (concentrate there), or if Decision A shifts toward the reseller ICP (which would require a partnership/BD channel instead of community distribution).

## Dependencies

Gates on `16` step 1 (mcp.hauska.dev live). Closes `16` step 5 and produces the launch-plan artifact that step 1 cc-agent dispatches reference. Pairs with Decision B (pricing) to unblock step 3 paid signup.

## Counterparties

Internal launch plan. External touchpoints: MCP directory maintainers, the Anthropic MCP and Cursor developer communities.
