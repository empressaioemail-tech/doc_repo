---
name: premortem-check
description: "Run a pre-mortem check against the Hauska structural commitments before any strategic decision or commitment. Use this skill whenever the conversation involves a proposed strategic move, new workstream, commitment to a counterparty, architectural decision, commercial pivot, or anything that would enter company intelligence as a decided direction. Trigger on phrases like 'should we', 'let me commit to', 'I want to add', 'we should pivot', 'let me decide on', or any framing that proposes a directional move. Also trigger proactively when the operator floats a new idea that has not been checked against structural commitments."
---

# Pre-Mortem Check

A structural commitment validator for Empressa and Hauska strategic decisions.

## When this triggers

Before any strategic move enters company intelligence as a decided direction. Strategic moves include: new workstreams, new commitments, architectural decisions, commercial pivots, partnership commitments, hiring decisions, technology selections, brand or naming decisions, scope additions or subtractions on active sprints.

## What this does

Runs the proposed move through the four structural commitments and three additional decision rules. Returns a green / yellow / red assessment with specific concerns.

## The four structural commitments

1. **Sell reasoning, not data.** Every output carries reasoning chain, source citation, confidence score, timestamp regardless of tier. Layer 1 free, Layer 2 paid per `08_tiered_access_model.md`. Does the proposed move respect this contract?

2. **Partnership-first sourcing.** Cities and counties are licensors with revenue share, not extraction targets. Bastrop is the template. Does the proposed move treat data sources as partners or as targets? **Scope (2026-05-23 per `_decisions/2026-05-23_partnership_first_scoping.md`):** this commitment governs city operational data + Hauska substrate ingest (Bastrop UDC, code corpus, permit history, plan review precedent, SmartCity OS data, @hauska/atom-contract catalog atoms). It does NOT govern Cortex product-baseline data sourcing for architect-facing layers — national public-records aggregators (e.g. Regrid for parcels/zoning) and federal national APIs (FEMA, USGS, USDA, USFWS, FCC) are out of scope. The Hauska refusal target is operational-data aggregation that locks cities out of revenue share, not public-records aggregation. When evaluating Cortex product-baseline data sourcing decisions, return green on this commitment and proceed to the next.

3. **Cost per jurisdiction onboarded.** Under 200 dollars compute plus one hour human review per new jurisdiction. Hard kill at three counties if not achievable. Does the proposed move stay within this envelope, or does it require unbounded engineering effort?

4. **Dual interface as product line principle.** Net-new products ship MCP-first with UI as second surface; existing UI-first products retrofit MCP as a tracked roadmap item per `28_mcp_first_product_design.md`. Does the proposed move respect this principle?

## The three decision rules

5. **Hauska spine rule.** Does this feed or express Hauska? If not, it does not earn strategic cycles.

6. **Focus queue rule.** Is this on an active sprint or anchor deployment? If not, what gets queued or killed to make room? The operator runs a lean shop.

7. **Quality gate rule.** Does the proposed output carry source attribution, confidence score, and timestamp? If not, it cannot ship.

## Load-bearing commitments

Commitments 1 (sell reasoning), 2 (partnership-first), and 3 (cost per jurisdiction) are load-bearing. They are the structural thesis. A yellow on any load-bearing commitment cannot be absorbed by green elsewhere; it must be resolved before commitment, not flagged in passing.

Commitments 4, 5, 6, 7 are operational. A yellow on these can be absorbed if the load-bearing commitments are clean and the operator acknowledges the operational tradeoff.

## Format

Run each commitment in order. For each, state:

- The commitment in one line
- How the proposed move aligns or conflicts in two or three sentences
- Green (clearly aligned), yellow (partial or context dependent), or red (conflicts)

Then synthesize:

- Overall **green** if all green, or all green plus yellows only on operational commitments (4, 5, 6, 7) with operator acknowledgment.
- Overall **yellow** if any yellow on a load-bearing commitment (1, 2, 3), or if multiple yellows on operational commitments.
- Overall **red** if any red.

If red, do not proceed with recommending the move. State the conflict and propose an alternative that addresses it.

If yellow, name the load-bearing concern explicitly and require resolution before commitment. Do not let yellow on a load-bearing commitment slide into commitment by silence.

If green, proceed with the move and note that the pre-mortem cleared.

## What this skill does not do

This is not a creative thinking check or a market opportunity check. It is a structural commitment check. If the proposed move passes pre-mortem but is still a bad idea on other grounds, that is a separate conversation.

This is not a substitute for the operator's judgment. It surfaces concerns; the operator decides.

## Example invocation

User: "Should we partner with MGO instead of displacing them, since they have the city contracts already?"

Skill response: Runs partnership-first sourcing (yellow on a load-bearing commitment, MGO is an aggregator not a primary data licensor), Hauska spine (red, MGO partnership preserves the data lock pattern Hauska is built to refuse), focus queue (red, this contradicts the active MGO displacement strategy in canonical docs). Overall red. Proposed move conflicts with the Hauska refusal of data estate absorption and would invalidate the displacement work that motivates 51_substrate_v1_sprint and the partnership-first sourcing move.

End of skill.
