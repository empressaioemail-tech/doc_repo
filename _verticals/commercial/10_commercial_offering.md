---
id: verticals_commercial_10_offering
title: Commercial offering — definition and build order
status: active
last_updated: 2026-07-07
applies_to: empressa
owner: nick
related: [_decisions/2026-07-07_cre_data_no_moodys_observation_stack, 77_place_graph_strategy, 75_hauska_brokerage_workflow_plan, 75c_property_brief_data_backlog, 08_tiered_access_model, 80_adrs/adr_022_deal_twin, _decisions/2026-06-17_brief_national_baseline_websearch_coverage]
---

# Commercial offering — definition and build order

> **Posture.** The commercial market has no purchasable source of truth (Texas non-disclosure; incumbent numbers are modeled). Our offering is the honest inversion: cited public-record facts, user-session listing observation, licensed trend data, and clearly labeled estimates with provenance and confidence. We sell the reasoning and the honesty, not someone else's guesses. Governing decision: [`2026-07-07_cre_data_no_moodys_observation_stack`](../../_decisions/2026-07-07_cre_data_no_moodys_observation_stack.md).

## Who it serves

Investor-operators and boutique brokers in secondary and tertiary Texas markets first — exactly where incumbent coverage is weakest and where our wedge users already live. Segments in priority order: industrial/flex, retail, land-to-development. Office deprioritized by ruling. The buyer-side question the offering answers: "what is actually known about this commercial property, what is estimated, and how confident should I be."

## The offering (product surfaces)

1. **Property Brief, commercial mode.** The same cited brief flow with a commercial-vs-residential mode pulled forward in the UI (operator directive 2026-07-07). Commercial mode serves: parcel and improvement facts from CAD/tax records (cited, public record); flood, encumbrance, and jurisdictional layers from the existing spine (identical machinery to residential); observed listing state where the user's own session has seen the property (listed/delisted/price history as procedure-execution capture per ADR-022); trend context from licensed Cotality data; and labeled estimates (projected NOI bands, cap-rate context) that always render as asserted, provenance-carrying claims, never bare numbers.
2. **Extension connectors for commercial listing surfaces.** The site-adapter pattern the residential wedge proved, applied to commercial listing sites through the user's own authenticated session. LoopNet first (public surface, per the decision), Crexi second, then peers (Ten-X and marketplace surfaces as demand shows). CoStar excluded (membership-gated, litigious; observation rides the user's own session or does not happen). Each adapter: parse the listing the user is viewing, capture observation atoms with timestamps, feed the brief and the deal twin.
3. **Deep-dive / deal-twin surface.** Commercial deals accumulate: user-pinned observations, private uploads (rent rolls, surveys — tenant-private, never pooled), and the cited public stack, composing into a deal workspace. This is ADR-022's capture model at the commercial grain.
4. **MCP tools (retrofit tracked).** Commercial capability lands as MCP tools as it matures (`resolve_place` already exists; commercial dossier fields ride `place_dossier`). MCP-first applies to net-new commercial tools; the extension surfaces are retrofit-tracked per `28_mcp_first_product_design.md`.

## The data stack (settled)

| Layer | Source | Posture |
|-------|--------|---------|
| Parcel/improvement facts | CAD/tax records via the uniform public-record process | Closest-to-truth; cited |
| Listing observation | LoopNet (then Crexi+) through the user's own extension session | Timestamped observation atoms; delist/sold transitions feed trend inference |
| Trends | Cotality licensed data | Licensed; labeled |
| Estimates | Our reasoning layer over the above | Always labeled asserted, with provenance, confidence, timestamp (commitment #1) |
| National fallback | Websearch fallback with unverified disclosure | The 2026-06-17 brief-coverage precedent applied to commercial |

Not in the stack, by decision: purchased CRE model data (Moody's CRE and econ both declined), contacts/skip-tracing, marketing/listing-blast, bulk crawling on borrowed logins (rejected red), pooling of user-private uploads (tenant sovereignty).

## Tier posture

Layer 1 free: cited public-record facts and layer presence (what is knowable). Layer 2 paid: composed commercial reasoning (dossier depth, trend-adjusted estimates, deal-twin composition), metered per the tier model. Consistent with `08_tiered_access_model.md`; commercial does not get its own tier scheme.

## Build order (dependencies named, no timeframes)

1. **Commercial-vs-residential mode in the Property Brief UI** — pulled forward per operator directive. First expression: the mode toggle on the brief landing page (in build 2026-07-07) rendering CAD-grounded facts plus the honest commercial posture; extension UI mode follows.
2. **LoopNet extension adapter** — first connector (queued Lane-A-adjacent per the decision; user-session observation, ADR-022 lineage, labeled estimates). Exit: a LoopNet listing the user views produces observation atoms and a cited commercial brief.
3. **Commercial fields in the dossier path** — CAD improvement facts (building SF, year built, land use codes) surfaced in `place_dossier` and the brief commercial mode with citations.
4. **Crexi adapter** — second connector on the proven adapter shape.
5. **Deal-twin commercial composition** — pinning observations + private uploads to a commercial deal workspace (gated on the ADR-022 phased build and the T2 tenant-private write primitive for uploads).
6. **Trend/estimate layer** — Cotality trend integration into labeled commercial estimates (gated on production Cotality keys, operator-held).

## Open questions (tracked, not blocking)

Herbert's practice review of the commercial brief composition (what a broker checks first — the O&G 85a pattern applied here). Whether observed-listing trend inference reaches usefulness before adapter coverage widens (honesty rule: thin observation base renders as thin, never extrapolated silently). Crexi ToS posture check before adapter #2 is dispatched.
