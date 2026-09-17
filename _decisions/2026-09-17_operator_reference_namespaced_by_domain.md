---
decision_id: 2026-09-17_operator_reference_namespaced_by_domain
date: 2026-09-17
owner: nick
status: active
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
    _design/smartcity-fleet-lens/README.md,
    _design/smartcity-police-lens/README.md,
    _decisions/2026-09-17_design_ratification_all_approved.md,
  ]
---

## Decision

**Operator references are namespaced by domain.** Fleet mints `FL-OPR-nn`, Police mints `PV-OPR-nn`.
`OPR-01` on its own stops being a valid operator reference anywhere.

Operator ruling 2026-09-17, in session, on the planner's recommendation. This clears the blocker
A-139 recorded and OPS-17 has carried as owed since; it was the second of two things gating G-153.

## Context

Read at `smartcity-dashboards` `origin/main` `f776b4bf`, in two modules with no import between them:

    src/domains/fleet-vehicles.mjs:58   OPERATOR_COUNT = 4
    src/domains/fleet-vehicles.mjs:59   OPERATOR_REF_FORMAT = /^OPR-\d{2}$/
    src/domains/patrol-vehicles.mjs:49  OPERATOR_REF_FORMAT = /^OPR-\d{2}$/
    src/domains/patrol-vehicles.mjs:50  OPERATOR_COUNT = 3

Both `OPERATOR_BASIS` strings are byte-identical: *"a generated record names no person; the operator
is an opaque reference and a granted feed is where a name would come from."*

So Fleet mints `OPR-01` through `OPR-04` and Police mints `OPR-01` through `OPR-03`, from two
independent counters over two different populations. `OPR-01` existed in both and nothing declared
whether that was one human or two.

## Reasoning

**The reference is a pseudonym for a real person, not a label.** Both designs refuse to render driver
and officer names, and the basis says a granted feed is where a name would come from. Samsara answers
live for Fleet and Spireon answers live for Bastrop on Police. A shared pseudonym across two lenses
therefore links one person's fleet activity to their patrol activity, which is precisely the
re-identification that pseudonymising them is meant to prevent. This is a privacy property, not a
naming preference.

**Namespacing matches what the code already does.** Two independent counters over two populations of
different sizes were already two namespaces. The ruling declares the structure that exists rather
than imposing a new one.

**It makes the wrong answer unrepresentable rather than documented.** `ENFORCEMENT.md` prefers a type
the compiler enforces over a check that can be missing, and prefers a refusal over a detector. With
distinct formats a cross-domain collision cannot be expressed, so there is no trigger to be absent
and no call site to be missed. The rejected third option, keeping one format and adding a basis line
forbidding cross-lens joins, is a documentation control, and this operation's record on prose
controls is that they do not bind.

**It does not foreclose the larger claim.** If the city later wants to answer who this operator is
across departments, that needs a person registry, which does not exist. WorkOS (G-132, G-134) is
staff LOGIN identity, a different population: field operators are not necessarily system users.
Namespacing is the honest stopgap and leaves that decision open.

## Structural commitment check

**Sell reasoning, not data.** Engaged and satisfied. The operator basis is already a reasoning line
carried on the record rather than an asserted identifier, and namespacing keeps it truthful.

**Confidence is earned.** Not engaged.

**Cost per jurisdiction.** Not engaged.

**Dual interface.** Not engaged.

**Tenant sovereignty.** Engaged at the person level rather than the tenant level. A pseudonym that
silently joins two departments' records about one employee is the same failure shape as pooling a
tenant's private adjudications into a shared asset.

Adversarial review was run in place of the retired premortem-check.

## Timing, which is the part that will be lost if it is not written down

**Nothing is leaking today, and that is why this had to be ruled now rather than later.**
`operatorRef` occurs ZERO times in `src/vendor-live.mjs`, so live vendor records carry no operator
reference at all; `OPR-nn` exists only in generated fixture records. That absence is itself a defect
(a field declared `required: true` on the Spireon shape and never set) and is carded as G-153's third
defect. Whatever fixes it will mint operator references on the live path.

The ruling has to be in hand before that code is written. Once a live feed is minting references,
changing the scheme is a migration rather than a constant.

## Consequences, and one trap

**The product changes first, then the designs follow, and that ordering is correct here.** The Fleet
design's instrument derives the format from source rather than asserting it
(`_design/smartcity-fleet-lens/check.mjs:91` reads `S.axis.formats.OPERATOR_REF_FORMAT` out of
`source-state.json`), so the check tracks the product automatically once source-state is recaptured.
The design's argument is unchanged; only a source-derived literal moves. This is the one case where a
design correctly follows the code.

**The trap.** `_design/smartcity-fleet-lens/check.mjs:154` hardcodes
`const OPR_RE = /\bOPR-[A-Za-z0-9]+/g` to extract candidate references from the artboard HTML. In
`FL-OPR-01` the character before `OPR` is a hyphen, so `\b` still matches and the regex extracts the
truncated fragment `OPR-01`, which then fails the new format test. The check will break in a way that
reads as a design defect and is actually an extraction bug. Both checks also carry hardcoded
self-test fixtures using the bare form (`check.mjs:271` in Fleet, `:436` and `:449` in Police).

Artboards carrying the literal: `smartcity-fleet-lens/Main.dc.html` (20 occurrences) and
`smartcity-police-lens/Patrol.dc.html` (14), regenerated through each folder's `gen.mjs`.

## Reversal criteria

Reverse to a single shared namespace only alongside a person registry that can actually answer
whether two references are one human, and only with an explicit ruling that linking an employee's
activity across departments is intended. Absent that registry, a shared format is an assertion the
product cannot support.

Revisit the specific prefixes, though not the principle, if a third domain mints operator references,
because `FL-` and `PV-` are readable only while the set is small.

Do not reverse this on the grounds that the two lenses look inconsistent on a cross-department view.
Looking different is the point.

## Dependencies

Unblocks OPS-17 G-153 on this axis. G-153 remains gated on D-12 for its deploy path.

The change lands in the same unit of work as G-153's third defect (`operatorRef` absent on the live
path), because that is the code that will mint the references.

## Counterparties

Internal: Nick (operator, ruled). The affected humans are Bastrop field personnel, who are not
parties to this conversation and are the reason it is a privacy decision rather than a schema one.
