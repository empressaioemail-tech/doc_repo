---
decision_id: 2026-09-15_plan_review_reasoner_is_the_shown_design
date: 2026-09-15
owner: nick
status: active
related_canonical:
  [
    _design/plan-review-reasoner/README.md,
    _design/plan-review/README.md,
    _design/plan-review-departments/README.md,
    _design/INDEX.md,
    _decisions/2026-09-15_design_ratification_pass.md,
    _decisions/2026-09-15_plan_review_role_gate_deferred.md,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
  ]
---

## Decision

**The reasoner design is the plan review design a city is shown.** `_design/plan-review-reasoner/`
is the canonical plan review design. `_design/plan-review/`, the original console set, becomes
SUPERSEDED and is kept as the record of the option not taken.
`_design/plan-review-departments/` is unaffected by this call: it remains a draft that may be
shown and cannot be built, per the role gate deferral.

This closes an item that had been owed since the design ratification pass and resolves a
disagreement between two current documents.

## Context

Three plan review designs existed in three folders, all reachable, with no ruling on which one a
city sees. The design thread handoff listed "which of the three plan review designs a city is
shown" as owed by the operator, and the approval package was blocked on it.

The design completion gate surfaced a second, quieter consequence of leaving it open.
`_design/INDEX.md` records `plan-review` as IN REVIEW while
`_inbox/2026-09-15_design_addendum.md` records it as superseded by the reasoner set. Two
current documents disagreed about the status of a design that is in front of a customer, and
neither was wrong in a way a reader could detect, because nothing had ruled.

## Structural commitment check

**Sell reasoning, not data.** This is the commitment the decision turns on. The reasoner design
is built around provenance over reachability, one live adjudicator named as such, absence shown
on two axes, and the correction notice treated as the product. That is the commitment rendered
as a surface rather than asserted in copy.

**Confidence is earned.** Engaged and served. The reasoner path is where adjudication becomes
evidence, so the design that makes the reasoning visible is the one that makes the earning loop
legible to the customer buying it.

**Cost per jurisdiction.** Not engaged. All three designs describe the same surface.

**Dual interface.** Engaged and unchanged. Plan review retrofits MCP as a roadmap item either
way.

## Reasoning

Three arguments point the same way, which is why this is a short record.

It is the only one of the three that is RATIFIED. The console set is IN REVIEW and the
departments set is DRAFT. Showing a customer the least settled of three options is a choice
nobody would defend if stated plainly.

It matches the standing ruling that **plan review is a companion, not a system**. The console set
reads as a system: a queue, a console, an embed, a workflow spine. The reasoner set reads as a
companion that explains its reasoning and declines where it cannot. Showing the console design
would describe a product we have ruled we are not building, and the gap between the two would
surface at the worst possible moment, which is after a city said yes.

It is the design that survives the role gate deferral intact. Departmental parallel review cannot
be built as currently ruled. A design centred on routing work between departments has a
dependency the reasoner design does not.

## What this does not decide

It does not ratify the departments design, which is a separate call and still owed.

It does not retire the console design's artefacts. The folder stays, the boards stay, and the
README records why the option was not taken, the same treatment `smartcity-place-tab` received
when the map dock superseded it. A design we can no longer explain the alternative to is a design
we will re-litigate.

## Reversal criteria

Reverse if any one of these becomes true:

1. A city in the pipeline requires plan review to be the system of record for submittals rather
   than a companion to one, which would reverse the parent ruling and this one together.
2. The reasoner design fails its own adversarial read against source once one exists. It is
   RATIFIED today with **no `check.mjs`**, which is exactly the gap G-148 names, so this ruling
   rests on a design that has not been checked by instrument. That is a known weakness of this
   record and is stated rather than left to be discovered.
3. Bastrop reviews the reasoner canvas and asks for the console framing.

## Dependencies

`_design/INDEX.md` is updated by this record and the disagreement with the addendum is resolved in
the reasoner's favour.

The Bastrop approval package depends on this and is unblocked by it.

G-146 (finish the design work) carries this as one of its resolution items. G-148 carries the
missing instrument named in reversal criterion 2.

## Counterparties

Internal: Nick (operator, ruled). Bastrop is the counterparty who sees the result, and Sylvia
Carrillo approves the design before build under the standing ruling.
