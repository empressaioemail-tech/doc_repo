---
decision_id: 2026-07-07_cre_data_no_moodys_observation_stack
date: 2026-07-07
owner: Nick
status: active
related_canonical: [77_place_graph_strategy, 75_hauska_brokerage_workflow_plan, 75c_property_brief_data_backlog, 08_tiered_access_model, _decisions/2026-06-17_brief_national_baseline_websearch_coverage, 80_adrs/adr_022_deal_twin, _verticals/oil_gas/85b_title_artifact_exemplars]
---

## Decision

Decline the Moody's CRE data contract; the commercial real estate angle in the spine runs on the public-record plus user-session observation stack (CAD/tax records, LoopNet observation through the user's own browser session, Cotality trends), with every commercial estimate shipped as a labeled, provenance-carrying assertion rather than a purchased model number.

## Context

Two calls on 2026-07-07 settled this. First, the Moody's CRE demo (Nick + Valerie Thompson, "Comercial Real Estate" Otter transcript): property-level catalog of ~8.7M commercial parcels plus market-level analytics, API but no MCP yet, ballpark $50k–$250k/yr annual contract, tenant rosters non-redistributable via API. The rep was candid that non-rounded asking rents and cap rates are modeled ("emphasis on estimated"), coverage is weakest exactly where our wedge is (tertiary markets, boutique firms), and Texas non-disclosure means sale values are inference, not record. Second, the follow-up (Nick + Val + Herbert, commercial broker, "Commercial Real Estate Data Strategy" transcript): Herbert confirmed from practice that comps in a non-disclosure state are unobtainable even for brokers, that deed-of-trust back-calculation carries an irreducible 20–30%+ down-payment unknown, and that CAD records are the closest available source of truth for surface facts. Nick's close: "that settles it on the Moody's data, because we can get a cheaper guess with AI" — with the guess labeled as such.

## What was decided

1. **No Moody's CRE contract.** The cost buys someone else's modeled guesses we cannot calibrate, cannot redistribute in the parts that matter (tenants), and cannot serve over MCP.
2. **The commercial data stack is:** CAD/tax-record acquisition per the uniform public-record process (closest-to-truth for parcel and improvement facts); LoopNet listing observation *through the user's own session* via the browser extension (timestamp capture of listings; delist/sold transitions feed trend inference, same site-adapter pattern as the residential wedge and ADR-022's user-session capture); Cotality trend data where licensed. All derived values (market trend, projected cap rate, occupancy-adjusted NOI) ship as asserted estimates with provenance, confidence, and timestamp — the Brief websearch-fallback precedent (2026-06-17 decision) applied to commercial.
3. **Extension targets LoopNet first, not CoStar.** LoopNet is the public surface; CoStar is membership-gated and alerts on login sharing.
4. **User-private uploads stay user-private.** A user's survey (or rent roll, or lease) attaches to that user's own property record only; it never enters the shared corpus as truth, because it cannot be verified and pooling it would break tenant sovereignty (ADR-005/017). Nick stated this unprompted on the call; it is the sovereignty commitment at the individual-investor grain.
5. **Explicitly rejected: bulk-crawling LoopNet/CoStar on Herbert's (or any borrowed) broker logins.** Premortem red: relationship-gated access violates the no-special-access rule (the acquisition path must work in a no-relationship market), it is a ToS violation against a famously litigious counterparty (CoStar v. CREXi), and the data could carry no citable provenance. Observation rides the user's own session or does not happen.
6. **Not building:** a contacts/skip-tracing layer; the marketing/listing-blast side (CDX-style). We are the informational reasoning layer over the aerial-to-subsurface stack, per the spine rule.
7. **Deprioritized:** office as an asset class ("I wouldn't waste any time on office" — Herbert). Industrial/flex, retail, land-to-development are the segments that matter for the wedge.
8. ~~**Still open, separately:** the Moody's *econ* "data buffet" (historical + 30-year forecast series, ~1,900 US indicators, has an MCP). This is closer to raw statistical-agency data than modeled property guesses and would feed the research/charting channel. Quote and data dictionary pending from the rep; it gets its own premortem if pursued. Do not let the pending Moody's email reopen the CRE side.~~ **AMENDED 2026-07-07 (evening, operator): the econ buffet is DECLINED as well ("moodys econ out the window").** The Moody's relationship closes on both sides; nothing pending. When the rep's quote email arrives it gets a close-out reply, nothing more. Operator redirect for the commercial effort: pull commercial-vs-residential forward in the Property Brief UI, build connectors for the commercial listing surfaces (LoopNet first, then Crexi and peers, always through the user's own session per items 2, 3, and 5), and flesh out the commercial offering definition.

## Structural commitment check

Premortem run 2026-07-07, overall green with one carve-out. Sell-reasoning: green — declining to resell a vendor's guesses is the commitment restated. Confidence-earned: green — purchased model numbers are unearned confidence we could never calibrate; our own estimates ship as asserted baseline with provenance. Cost-per-jurisdiction: green — CAD acquisition fits the proven envelope; the contract would not have. MCP-first: operational yellow — extension-first is a retrofit surface; commercial capability must land as MCP tools as it matures (tracked). Sovereignty/quality: green on the decision; red on the borrowed-login crawl, which is rejected in item 5 above.

## Reasoning

The commercial data market has no source of truth to buy: Texas non-disclosure plus broker incentives ("I need to keep my investor") mean even the incumbent aggregators model the numbers that matter. Paying $50k–$250k/yr imports unearned confidence at exactly the layer where our differentiation is honest provenance. The assets we already hold — uniform public-record ingestion, Cotality licensing, a browser extension that legitimately observes what its user views, and a reasoning layer that labels its estimates — reproduce the useful fraction of the vendor's product at marginal cost, with provenance we can defend. The one thing money can't fix (ground truth in a non-disclosure state) stays equally missing either way; honesty about that is a feature of our output and a liability in theirs.

## Reversal criteria

Revisit if: (a) Moody's (or a competitor) ships CRE over MCP with per-call pricing and observation-level provenance (actual vs modeled flagged per field) at a cost matched to our downstream economics; (b) commercial users at launch demonstrably churn on labeled-estimate answers where a purchased data layer would retain them; (c) the Texas MLS non-disclosure posture changes materially (e.g., Herbert's contemplated class action or regulatory shift makes sold data public record); (d) LoopNet's public surface closes such that user-session observation no longer yields usable signal.

## Dependencies

Depends on: the extension site-adapter roadmap (Radar; LoopNet becomes the first commercial adapter), Cotality production keys (operator-held), the place-graph G6 commercial-graph gate (`77_place_graph_strategy.md`), ADR-022 deal-twin capture pattern. Feeds: commercial persona in the place graph, TX CRG operator wedge (`77a`), the launch claim that we offer commercial users something real on day one.

## Counterparties

Moody's (rep to send econ-buffet questions/quote — the CRE thread closes, reply should say so when the email arrives). Herbert (broker input; his logins are NOT to be used for crawling — settled). Valerie Thompson (present, concurring on data-quality grounds).
