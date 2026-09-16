---
decision_id: 2026-09-15_police_and_fleet_lenses_in_scope
date: 2026-09-15
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-09-15_roadmap_reconciliation.md,
    _inbox/2026-09-15_design_addendum.md,
    _design/surface_coverage.json,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
  ]
---

## Decision

**Police and Fleet are in scope for design.** All five undesigned department lenses are now
carded work under G-145 rather than four plus a scope question. Nothing in the nine-lens roster
is left as a surface we have decided not to draw.

They are designed at the same honesty standard as everything else, which for a lens with a thin
or absent source means a surface that states what it does not have rather than one that is
withheld.

## Context

Police and Fleet were recorded as "not in the pilot" and were excluded on that basis. The Jaime
call changed the premise underneath that exclusion: v1 is being retired rather than run
alongside, stated to the customer directly. Both lenses exist in v1 today.

Once v1 goes away, a lens that was never designed does not stay at its current level of service.
It disappears. The exclusion was written when v1 was the fallback, and it did not survive v1
ceasing to be one.

The design completion gate made the shape of the gap measurable rather than arguable: against the
shipped nav, five of fifteen surfaces are designed and two are excluded by ruling, leaving eight
uncovered. Police and Fleet were two of the eight, and they were the only two whose status was a
question rather than a queue position.

## Structural commitment check

**Sell reasoning, not data.** Engaged and decisive. A lens that shows a department nothing and
explains why is a reasoning surface. A lens that is simply absent teaches the customer that the
product has holes it will not name.

**Cost per jurisdiction.** Engaged and cheap. The nine-lens roster is identical in every city, so
designing these two is a one-time cost amortised across every city that follows, not a Bastrop
customisation.

**Confidence is earned.** Engaged indirectly. Fleet and Police both carry vendor-gated domains
whose grants do not exist yet, so the surfaces will spend their early life declaring absence.
That is the calibratable posture, not a weakness.

**Tenant sovereignty.** Engaged and worth naming. Police is the lens most likely to carry records
about identifiable people. `src/domains/police-cameras.mjs` already declares plate reads and
persons-of-interest as deliberately not generated, with a stated basis rather than a silent gap.
Any Police design inherits that refusal and does not reopen it.

## Reasoning

The cost of designing them is low and the cost of not designing them is a regression the customer
experiences at cutover.

Both already have registered domains, so neither is a blank surface: Fleet has
`FLEET_VEHICLES_DOMAIN` gated by `samsara`, Police has `PATROL_VEHICLES_DOMAIN` gated by
`spireon` and `POLICE_CAMERAS_DOMAIN` gated by `verkada`. The product knows how to generate all
three. What is missing is grants, which is a statement about sources with a basis attached, not
a statement that the surface does not exist. That distinction already has a design treatment.

`patrol-vehicles` is additionally the product's deliberate ungranted exemplar on
`template-city`, kept ungranted so the ungranted state stays reachable and testable rather than
becoming unreachable code. The Police lens is therefore the surface where the ungranted state is
most visible by design, which makes designing it useful beyond Police.

The recommendation put to the operator was to design them at the honest-absence level rather than
richly, and the ruling accepts that framing. Rich design waits for a department to ask.

## What this does not decide

It does not put Police or Fleet in the Bastrop first cohort. Scope for design and scope for the
pilot are different questions, and the first cohort remains Development Services.

It does not authorise obtaining the Verkada, Spireon or Samsara grants. G-139 covers the Verkada
credential as vendor onboarding.

## Reversal criteria

Reverse, and return these two lenses to excluded, if either becomes true:

1. v1 retirement is cancelled or deferred indefinitely, which removes the premise this decision
   rests on entirely.
2. Bastrop confirms neither department will have a seat and no second city in the pipeline has
   one, in which case these become speculative surfaces and the focus queue rule applies.

## Dependencies

G-145 carries all five lenses. Public works, Parks and Fire and EMS are dispatched as lane
`g145a-department-lenses`; Police and Fleet follow as a separate lane, which this decision
unblocks.

`_design/surface_coverage.json` records both as uncovered with plan row G-145 and needs no change
from this ruling, because they were never declared excluded there. That is the correct prior
state: an exclusion needs a dated ruling, and Police and Fleet only ever had a note.

## Counterparties

Internal: Nick (operator, ruled). Bastrop decides which departments get seats, which is a separate
owed item with Sylvia Carrillo. Jaime named engineering and fire as likely flood-study users,
which is what reopened the department question.
