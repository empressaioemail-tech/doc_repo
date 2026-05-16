---
name: decision-log
description: "Capture a strategic decision as a structured record with reasoning, owner, date, and reversal criteria. Use this skill whenever the operator says 'decided', 'committing to', 'going with', 'final call', 'log this decision', or when a conversation reaches a clear directional commitment that should enter company intelligence. This skill is the bridge between conversational discussion and durable company memory; without it, decisions stay in chat history and do not compound."
---

# Decision Log

Captures a decision as a structured record.

## When this triggers

When a strategic, architectural, commercial, or operational decision is reached in conversation. Even small directional commitments warrant a record if they will affect future work or be referenced later. Also triggers when a decision is being made but rests on unverified claims; in that case the record is filed as provisional pending verification, not as active.

## What this produces

A single-decision markdown record:

```
---
decision_id: YYYY-MM-DD_short_slug
date: YYYY-MM-DD
owner: [operator | Nick | Valerie | etc.]
status: provisional | active | reversed | superseded
verification_pending: [list of items to verify before status flips to active, only present when status is provisional]
related_canonical: [list of doc_repo files this touches]
---

## Decision

[One sentence statement of what was decided.]

## Context

[Two to four sentences on what prompted this decision, what alternatives were considered, why this path was chosen.]

## Structural commitment check

[One line each for relevant commitments. Note if the decision triggered a yellow or red on premortem-check.]

## Reasoning

[Three to six sentences on the substantive case for the decision. The reasoning chain should be specific enough that a future agent can audit it.]

## Reversal criteria

[Conditions under which this decision should be revisited. Examples: "if ECI atomization sprint reveals atom contract issues", "if Mox declines design partner reframing within 30 days", "if cost per jurisdiction exceeds target after three counties."]

## Dependencies

[Other decisions or workstreams this depends on, and other decisions or workstreams that depend on this one.]

## Counterparties

[If a commercial or partnership decision, name the counterparties. If internal, name the stakeholders affected.]
```

## Status semantics

- **provisional:** decision direction is set but rests on factual claims that have not been verified yet. The verification_pending field names what needs to be confirmed. Provisional decisions can be referenced in planning but should not be acted on operationally.
- **active:** decision is final and stands. Verification has cleared if there was any.
- **reversed:** the decision was made and later rolled back. The record is preserved with a pointer to the newer decision_id that reversed it.
- **superseded:** the decision was made and later replaced by a more specific or evolved decision. The record is preserved with a pointer to the newer decision_id.

## Provisional to active

When a provisional decision's verification items clear (the canonical doc is read verbatim with `Read`, the counterparty confirms, the search verifies), edit the record: status flips from provisional to active, verification_pending field is removed, and a one-line note is added under Context recording what was verified and when.

If verification reveals the decision direction was wrong, the record is edited to status reversed and a new decision_id is created with the corrected direction.

## Filing

Decision records file at `_decisions/<decision_id>.md` at the repo root, sibling to `_sessions/`. Commit alongside the session summary that produced the decision.

Decision records also feed into the candidate decision-record atom type queued for ECI atomization per `60_eci_atomization.md`. Once ECI atomization ships, decision records become atom-compliant by definition.

## Conventions

- Reversal criteria are not optional. Every decision has conditions under which it would be revisited. If you cannot name them, the decision is not actually decided.
- Status starts as active when no verification is pending, or provisional when source-required has flagged unverified claims that bear on the decision. If a later decision reverses or supersedes, edit the prior record to status reversed or superseded with a pointer to the newer decision_id.
- Reasoning specificity matters. "Because it is faster" is not auditable. "Because `51_substrate_v1_sprint.md` line N specifies one MCP server with many tools for v1, with per-atom split deferred unless listing visibility becomes a growth lever" is auditable.

## What this skill does not do

Does not make decisions. Captures them once made.

Does not enforce decisions. Other skills (premortem-check, catalog-thesis-check) reference prior decisions when running their checks.

Does not file automatically. The operator confirms before filing.

## Example invocation

Operator: "OK, going with the catalog reframing for Mox."

Skill response: Produces decision record with decision_id 2026-05-15_mox_catalog_reframing, owner operator, status active (no verification pending; reframing is a strategic call not a factual claim), related canonical references to `_sessions/2026-05-15_mox_prep.md` and the Mox prospect docs at repo root, full reasoning chain pulled from the conversation, reversal criteria "Mox declines the reframing within 14 days of next CEO conversation or asks to revert to original custom build framing."

Second example. Operator: "Going with the unified actor-record design for ADR-015."

Source-required has flagged that the design rests on a paraphrase of ADR-007 read in a prior session, not re-verified this session.

Skill response: Produces decision record with status provisional, verification_pending listing the ADR-007 stakeholder scopes section to re-read with Read. Reversal criteria includes "if ADR-007 verification reveals stakeholder scopes are modeled as roles not as person atoms, the subsumes framing breaks and the design needs adjustment." Decision is filed but not promoted to active until verification clears.

End of skill.
