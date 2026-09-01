---
decision_id: 2026-08-31_smartsite_connector_is_a_door_not_a_tier
date: 2026-08-31
owner: operator
status: active
related_canonical:
  - _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector
  - _smartsite_masters/01_smart_site_positioning
  - _smartsite_gtm/03_ladder_recut_proposal
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - 28_mcp_first_product_design
  - 29_mcp_surface_tier_model
---

# Decision

The Smart Site MCP connector is a door, not a tier. It stays available at every rung including Free, and it mirrors the workbench's entitlement gates rather than carrying gates of its own. Its commercial job is acquisition and retention, never differentiation. No capability is moved onto or off the connector in order to make a rung more attractive.

Where a capability should be gated, it is gated at the tier and both surfaces inherit it. One gate, two doors.

## Context

A ladder re-cut was under discussion because Studio has almost no case for the largest audience segment. One candidate move was to make the connector's `run_report` Studio-only, turning Studio into "the tier your AI can use." A code read of `artifacts/smartsite-mcp/src/tools.ts` on legacy-design-tools `origin/main` `394424f2` established the live state: exactly two gate points exist across the whole MCP surface, `run_report` requiring paid at any rung and the three `STUDIO_EXPORT_KINDS` requiring studio or team. Eleven of thirteen tools require only an authenticated account, so a free account can connect Claude and use lookup, screens, and saves.

The planner proposed the Studio move and then withdrew it against the positioning master.

## Structural commitment check

- Dual interface: this is the ruling that keeps commitment 4 honest. An agent surface that charges for the door is not the same product through a second interface, it is a second product.
- Sell reasoning, not data: unchanged. The connector carries the same citations, verdicts, and confidence as the workbench.
- Confidence earned: unchanged. The connector does not mint a second score.
- Brand: unchanged. Smart Site is Empressa; the connector is the product server, not `hauska-mcp-server`.

## Reasoning

`_smartsite_masters/01_smart_site_positioning.md` lists "Two doors, one truth" among the four things only we can say: a person opens the app, an AI agent calls the same system directly, same facts, same citations, same confidence, either door. Pricing the door itself falsifies that claim. What may be gated is what sits behind the door, and that is already how the code is built, so the current design is correct and the proposed change would have broken it to solve a problem the connector was not causing.

The problem the move was aimed at is real but is a tier defect, not a connector defect. The screening board is ungated in the workbench as well as in the connector. Fixing it at the tier makes both surfaces correct at once and is the meaning-shaped fix; patching it only on the agent side would leave the same hole open in the app.

Three commercial jobs justify keeping the door free. It is the strongest top-of-funnel surface available, because a free user connecting Claude gets the free-browse motion relocated into a tool they already work in daily, which beats requiring a site visit. It is churn defense for paid accounts, and the locked model says the business lives or dies on churn. And it is what makes the honesty claim legible, because an agent consuming cited records and declining where data is absent demonstrates the whole thesis in one screen recording.

Taking `run_report` back from Solo would also be a withdrawal of a shipped capability, at the exact moment P-88's directory listing needs the simplest possible connector story.

## What is NOT decided here

Agent access at programmatic volume remains a legitimate future paid product. The locked GTM doc already names API and agent access as "architecture-true today, not commercially live," a natural top-tier or add-on. That is priced by volume and by buyer, not by rung, and it is a different job from a subscriber's personal assistant making a few dozen calls a day.

The two agent channels stay separate and must not converge. The Smart Site connector is a subscriber's assistant, priced inside the subscription. The Hauska MCP catalog is the product sold to agent operators, priced per call, on the substrate brand. The 2026-08-26 decision already forbids a later agent collapsing P-87 back onto `hauska-mcp-server`; this record names the reverse drift as equally forbidden.

## Unmeasured

Whether a free connector session costs meaningful compute was not measured. If `find_parcel` and `get_smart_site` are cheap reads off baked snapshots the free door is costless; if they are expensive per call, free-tier connector access becomes a unit-cost question rather than a pricing-strategy one. Nothing here asserts either way, and the ruling should be re-examined if that number comes back high.

## Reversal criteria

Reverse if a measured unit cost shows free connector sessions are materially expensive, in which case the door gets a rate limit rather than a tier, because a limit preserves "two doors, one truth" and a tier does not. Reverse if the positioning master retires the two-doors claim. Do not reverse to make a rung more attractive; that is the argument this record exists to refuse.

## Dependencies

Depends on nothing. Unblocks the ladder re-cut proposal, which can now be ruled without the connector as a variable. Does not unblock per-call metering, Circle payout, or P-88 directory listings.

## Counterparties

Internal. Property seat owns the Smart Site MCP and inherits any tier gate rather than authoring a parallel one.
