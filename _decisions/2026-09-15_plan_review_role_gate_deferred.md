---
decision_id: 2026-09-15_plan_review_role_gate_deferred
date: 2026-09-15
owner: nick
status: active
related_canonical:
  [
    _decisions/2026-09-14_staff_identity_and_department_rbac.md,
    _design/plan-review-departments/README.md,
    _inbox/2026-09-15_design_pass_HANDOFF.md,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
  ]
---

## Decision

The plan-review role gate is **NOT amended now, and the amendment is owed before launch**. It is
a deferral with a named trigger, not a kill. `_design/plan-review-departments/` is no longer
waiting on an answer: it stays a draft that may be shown and is not built. Ratifying that design
is a separate call and has not been made.

## Context

`_decisions/2026-09-14_staff_identity_and_department_rbac.md` Ruling 2 gates Plan review to
Development services and city-manager. Parallel department review requires Fire and EMS, Public
works and Parks to reach that surface, so as ruled the departments design cannot be built. The
handoff called the amendment a precondition.

The planner recommended deferring on the grounds that the Bastrop first cohort is Development
Services staff, who are already inside the gate, and that amending an identity ruling to unblock
a design nobody in the pilot will open spends a ruling to buy nothing this quarter.

The operator accepted the deferral and narrowed it in the same breath, which is the substance of
this record: **Fire and EMS and Public works may very well be in Bastrop's scope**, and the gate
must not become the reason the city gets less from us than it could.

## Structural commitment check

**Sell reasoning, not data.** Engaged through the refusal shape. A staff member denied a record
learns a record exists and that they are not entitled, never a silent empty list. Deferring the
amendment does not weaken that, because the denial path is unchanged.

**Cost per jurisdiction.** Engaged lightly and in favour of the deferral. The nine-lens roster is
the same in every city, so nothing here creates per-city role vocabulary work.

**Dual interface.** Engaged and owed. When the amendment lands, the role claim has to reach the
MCP surface too, or the door around the UI is open. Named for the amendment, not for now.

**Tenant sovereignty.** Engaged. This is the within-a-city layer above G-126 cross-tenant
isolation. Deferring leaves the stricter posture in place, so the deferral is the safe direction.

## Reasoning

The gate as ruled is more restrictive than the product needs and less restrictive than it looks,
and both halves argue for handling it deliberately rather than quickly.

Deferring is correct now because the pilot cohort is inside the gate already. Showing Bastrop the
departments canvas requires no ruling to move, and a canvas is what Bastrop is approving. Nothing
about the approval package is blocked.

Deferring is only correct for a bounded period because the operator's own read is that Fire and
Public works are plausible Bastrop scope. A submittal that needs a fire review and cannot get one
because of an identity ruling is the gate deciding the product's scope, which is backwards.

The amendment, when written, uses the parent ruling's own logic: a department reaches plan review
only through its own scope, its findings, its coverage, its sign-off, never the whole submittal.
That is verbatim what the parent ruling says makes Overview "a roll-up rather than a leak". The
roster stays the nine lenses and no department is invented.

**The known defect in that phrasing is recorded here so the amendment does not inherit it.** As
written it is a sentence, not a control. "Only through its own scope" passes review and enforces
nothing until it names what the scope object is and what happens when a department reaches
outside it. A Fire reviewer has to see the sheets their findings cite and almost certainly the
address, so the amendment must state what is actually withheld rather than implying a protection
it does not provide. Writing it without that is how an artifact that exists, is correct, and
enforces nothing gets into the fleet.

## Reversal criteria

Amend the gate when any one of these is true, whichever comes first:

1. **Before launch, unconditionally.** Launch may not proceed with the gate unamended.
2. Bastrop names Fire and EMS, Public works or Parks as in scope for plan review.
3. A second city enters the pipeline with a parallel-review requirement.

Reverse this deferral immediately, rather than waiting for the trigger, if a Bastrop submittal is
found blocked by the gate in practice.

**This deferral currently has no mechanism.** Its only trigger is that somebody remembers before
launch, and by the three question gate that is not a control. It needs a plan row on OPS-17 that
fails a launch gate while open. Naming the weakness here rather than letting the record read as
though the deferral is enforced.

## Dependencies

Depends on `_decisions/2026-09-14_staff_identity_and_department_rbac.md`, which this amends when
the trigger fires. That ruling in turn sequences G-132 (staff authentication) ahead of G-127
(department RBAC), and both remain gated on a person being identifiable at all, so the amendment
cannot be built before G-132 regardless of when it is ruled.

`_design/plan-review-departments/` depends on this. It is unblocked as a thing to show and stays
unbuilt. Its own ratify, amend or kill call is still owed.

The Bastrop review artefact does not depend on this. Showing the design needs no ruling.

## Counterparties

Internal: Nick (operator, ruled the deferral and set the trigger). Bastrop is the counterparty
whose scope decides when the trigger fires, and Sylvia Carrillo is the city-manager role that
already sees across departments under the parent ruling.
