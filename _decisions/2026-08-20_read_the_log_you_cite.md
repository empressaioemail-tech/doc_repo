---
decision_id: 2026-08-20_read_the_log_you_cite
date: 2026-08-20
owner: operator
status: active
related_canonical: [61_enforcement_doctrine.md, ENFORCEMENT.md, _inbox/2026-08-20_systems_branch_guard_adjudication.md]
---

## Decision

Before relying on a log to answer a question, read what it records rather than what a log of that kind ought to record.

## Context

The operator asked the systems seat to count CLOSE_OVERRIDE rows before scoping the dirty-tree gate, on the grounds that the log was the only place two populations were distinguishable: gate fired on my own unfinished work, versus gate fired on someone else's. The log records neither the seat nor the dirty file. Every reason string is the constant `CLOSE_OVERRIDE=1 on git push` written by the hook, not a justification supplied by the caller. Sixteen rows, eleven in one day. The distinction the question needed was never in the artifact.

## Structural commitment check

Not a product or pricing move. It is a doctrine corollary on evidence. Same error class as ordering a deletion from a summary of a note, and as telling a seat to check a function on the strength of its name.

## Reasoning

A required justification that nobody varies is a ceremony rather than a record. The field fills with one string, so the log records that overrides happened while recording nothing that distinguishes them. Eleven in one day is enough to say the hatch is not being used sparingly. Counting first was still right. The count is worth more than the distinction that was wanted from it.

## Reversal criteria

Reverse only if a later log format independently records seat and stranded path, and a question that needs that distinction is asked of that later format after it has been read.

## Dependencies

Filed into `61_enforcement_doctrine.md` revision 5 and `ENFORCEMENT.md`. Hook scope fix 2026-08-20 does not depend on this decision; this decision made scoping legal by accepting that the measurement cost was already paid.

## Counterparties

Internal. Systems seat owns the hook. Every seat that uses CLOSE_OVERRIDE is a consumer of the hatch rate.
