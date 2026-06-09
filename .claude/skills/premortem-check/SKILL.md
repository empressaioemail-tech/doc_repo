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

2. **Confidence is earned, not asserted.** Every output that carries a confidence signal must be calibratable against outcome, and the system must be built to tighten that calibration with use (arrow two, `04a_arrow_two_calibration_capture.md`; invariant I3). Does the proposed move preserve or strengthen the earning loop, and does it avoid presenting a bare or unearned confidence number as earned? At launch calibration is sparse, so confidence falls back to an asserted baseline carrying provenance and verification; green requires that the move keeps that honest fallback and the live earning loop, not that numbers are already calibrated. (Replaced partnership-first sourcing here 2026-06-09 per `_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`. Partnership-first is retired; do NOT re-raise it. The sovereignty root survives as tenant data sovereignty: a tenant's private data/adjudications never pool into a shared or public number, `tenant-private` accessPolicy ADR-005/017 — check that under commitment 7's quality/sovereignty gate, not as a sourcing ethic.)

3. **Cost per jurisdiction onboarded.** Under 200 dollars compute plus one hour human review per new jurisdiction. Hard kill at three counties if not achievable. Does the proposed move stay within this envelope, or does it require unbounded engineering effort?

4. **Dual interface as product line principle.** Net-new products ship MCP-first with UI as second surface; existing UI-first products retrofit MCP as a tracked roadmap item per `28_mcp_first_product_design.md`. Does the proposed move respect this principle?

## The three decision rules

5. **Hauska spine rule.** Does this feed or express Hauska? If not, it does not earn strategic cycles.

6. **Focus queue rule.** Is this on an active sprint or anchor deployment? If not, what gets queued or killed to make room? The operator runs a lean shop.

7. **Quality gate rule.** Does the proposed output carry source attribution, confidence score, and timestamp? If not, it cannot ship.

## Load-bearing commitments

Commitments 1 (sell reasoning), 2 (confidence is earned, not asserted), and 3 (cost per jurisdiction) are load-bearing. They are the structural thesis. A yellow on any load-bearing commitment cannot be absorbed by green elsewhere; it must be resolved before commitment, not flagged in passing.

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

User: "Should we let one partner city's reviewer adjudications feed the public confidence number, since they have the richest review signal?"

Skill response: Runs confidence-is-earned (green on the surface, more signal tightens calibration) but routes to the tenant-sovereignty gate under quality (red, pooling a tenant's private adjudications into a shared or public number violates I5 tenant data sovereignty and the enterprise customer-trust floor), Hauska spine (yellow, the calibration is spine substrate but the pooling breaks the sovereignty root). Overall red. Public-code calibration may draw only on anonymous and public-tier signal; a tenant's private adjudications stay in a `tenant-private` overlay that never pools (ADR-005/017). The fix is the sovereignty split, not the pooling. (Note: partnership-first sourcing and the MGO-displacement framing were retired 2026-06-09; do not raise them.)

End of skill.
