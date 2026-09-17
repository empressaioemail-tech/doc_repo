---
decision_id: 2026-09-17_design_ratification_all_approved
date: 2026-09-17
owner: nick
status: active
related_canonical:
  [
    _design/INDEX.md,
    _design/SMARTCITY_PACKAGE.md,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
    90_operations/OPS-25_cloud_infrastructure_and_cost_program.md,
    _decisions/2026-09-15_design_ratification_pass.md,
    _decisions/2026-09-15_plan_review_reasoner_is_the_shown_design.md,
    _decisions/2026-09-15_plan_review_role_gate_deferred.md,
    _inbox/2026-09-17_HANDOFF_smartcity_combined.md,
  ]
---

## Decision

**Every SmartCity design is approved.** Operator, in session 2026-09-17: *"i have looked at all
the designs and they are all approved."* This closes the ratify, amend or kill pass that had been
owed since 2026-09-15 and that gated the Bastrop approval package and every build row behind it.

Eleven designs move to RATIFIED: `smartcity-dev-services` (was IN REVIEW), `smart-files`,
`smartcity-finance-lens`, `smartcity-finance-filings` (was AMEND), `smartcity-public-works-lens`,
`smartcity-fire-ems-lens`, `smartcity-parks-lens`, `smartcity-police-lens`,
`smartcity-fleet-lens`, `smartcity-applicant-precheck` and `plan-review-departments`. They join
`smartcity-overview-lens`, `smartcity-map-dock`, `smartcity-flood-study` and
`plan-review-reasoner`, already ratified or approved.

**Three of the eleven are approved as designs and are still not buildable**, and the distinction
is the load bearing part of this record. A design approval is a judgement about the design. It
does not resolve a defect in the design's source material, a deferred amendment, or a deferred
ruling, and none of those three were put to the operator in this pass.

## The three carve-outs

**`smartcity-finance-filings` is approved and G-138 still blocks its build.** Its AMEND state was
never a review preference. Two figures are printed on its artboards with citations to external
authorities that trace to nothing: `Ordinance rate 7.00%`, attributed to "Bastrop code of
ordinances", and `Fund 108`, attributed to the city ledger. The rate is load bearing rather than
decorative, because the exceptions worklist divides tax due by taxable revenue and scores three of
Bastrop's own filings as rate mismatches against it. Shipping it would hand the city a worklist
accusing its taxpayers of filing at the wrong rate, citing a rate we invented and attributed to
their own law. Approval does not make the citation true. The promotion criteria in
`_decisions/2026-09-15_design_ratification_pass.md` stand unchanged: source both at Bastrop's
published ordinance and adopted budget, or badge both unverified on the page.

**`plan-review-departments` is approved and cannot be built.** Its own README already said so. The
role-gate amendment is DEFERRED with a trigger per
`_decisions/2026-09-15_plan_review_role_gate_deferred.md`, and G-144 is the mechanism. Departments
other than Development services cannot reach the plan review surface until it lands. The design
may be shown to a city; the build waits.

**`smartcity-applicant-precheck` is approved and has no service.** The operator deferred the
blending ruling in the same session, so which service runs the check is open: the deterministic
adjudicator in `plan-review`, the AI finding engine in `legacy-design-tools`, a split across both,
or a new service. No build row can name a repo until that is ruled, so none is carded here.

## Context

The pass had been owed since 2026-09-15 and was named by both 2026-09-17 handoffs as the single
gate on everything that was not already ratified. Two designs, the flood study and the reasoner
path, were ratified on 2026-09-15 and had sat unbuilt with no plan row.

The operator ruled in the same session that all SmartCity surfaces move to DigitalOcean before any
design build work begins, which is carded as OPS-25 D-12 and reorders the queue: no design build
row reaches a customer until that cutover lands.

## Structural commitment check

**Sell reasoning, not data.** Engaged. The approved set is strong on this and was built to it: the
Parks lens is drawn as a surface that does not exist rather than as an empty one, the Public works
matrix renders eight of twenty cells as cannot-occur beside four measured zeros, and the Police
lens draws a deliberately withheld grant as distinct from an unonboarded vendor. The one failure
is `smartcity-finance-filings`, which is why it carries a carve-out rather than a clean approval.

**Confidence is earned.** Engaged on the flood study through G-130 and on the reasoner path
through its `NO ADJUDICATOR` badging, both already ratified and unchanged here.

**Cost per jurisdiction.** Not engaged at the design level.

**Dual interface.** Not engaged. These are UI surfaces on an existing UI-first product.

**Tenant sovereignty.** Not engaged at the design level.

Adversarial review was run in place of the retired premortem-check, per the 2026-07-13 operator
ruling. It produced the three carve-outs above and the instrument consequence below.

## The instrument consequence, measured rather than predicted

Blanket approval moves every remaining DRAFT past DRAFT, and the design completion gate's R3 rule
counts designs past DRAFT carrying no adversarial read as a file. A DRAFT is legitimately exempt;
a RATIFIED design is not.

This was checked before the flip rather than assumed, and the result is better than feared. Nine of
the eleven newly approved designs already carry a `check.mjs`: `smart-files`,
`smartcity-applicant-precheck` (which also carries `violate.mjs`), `smartcity-dev-services`,
`smartcity-finance-lens`, `smartcity-fire-ems-lens`, `smartcity-fleet-lens`,
`smartcity-parks-lens`, `smartcity-police-lens` (also `violate.mjs`) and
`smartcity-public-works-lens`. Only `smartcity-finance-filings` and `plan-review-departments` lack
one, and both are carve-outs that cannot be built regardless.

So approval adds two R3 findings rather than eleven. Measured after the flip, not predicted:
**R3 moves from 4 to 6, R4 is unchanged at 3, and the gate verdict is UNFINISHED with 9
findings.** The two added are exactly `smartcity-finance-filings` and `plan-review-departments`.

**The first measurement was wrong, and the way it was wrong is worth keeping.** Flipping the
eleven folder READMEs to RATIFIED moved the gate not at all. R3 stayed at 4. The convenient
reading was that approval is free. The real mechanism is that the gate's `parseIndex` reads
status from `_design/INDEX.md` and never opens a folder README, so the edit was invisible to the
instrument that was supposed to score it. The alternative explanation, that blanket approval
genuinely adds no findings, was rejected by reading the gate's source rather than by re-reading
its output, which is the only thing that could have separated the two. `INDEX.md` was then
corrected and the post-state verified by importing the gate's own parser rather than by trusting
the string edit.

This is the `ENFORCEMENT.md` shape where a control is correct and enforces nothing: the READMEs
are what a human reads and `INDEX.md` is what the instrument reads, and nothing keeps them
honest with each other. Both were updated here. A gate rule that compares the two is worth
building and is not carded.

The standing treatment, ruled by the operator in this session, is that each build row delivers its
own design's `check.mjs` as an in-scope acceptance item, self-testing in both directions and
verified by violation against a real artboard. G-148 stays HELD for the designs with no build row.

## Reversal criteria

Reverse an individual approval, not the pass, if a design is found to assert something its source
contradicts. The base rate here is not low and is the reason every folder carries an instrument:
the Development services lens carried four defects including three residents named beside their
addresses, and the reasoner path's first draft asserted a central thesis the quoted code
contradicted in the same comment block.

Reverse `plan-review-departments` outright rather than waiting on G-144 if the role gate is ruled
permanent, because parallel departmental review is then not a deferred build but a killed one.

Revisit the whole pass if the DigitalOcean cutover changes what the shipped nav is, since every
design in this set is drawn against `smartcity-dashboards` `origin/main` `f776b4bf` and the gate
measures coverage against that nav at a named ref.

## Dependencies

Gated by OPS-25 D-12 for delivery. Every approved design targeting `smartcity-dashboards` reaches a
customer only after the dashboards DigitalOcean cutover, per the operator's 2026-09-17 ruling that
SmartCity moves to DigitalOcean before build work begins.

`smartcity-applicant-precheck` depends on the deferred blending ruling.
`smartcity-finance-filings` depends on G-138. `plan-review-departments` depends on G-144.

## Counterparties

Internal: Nick (operator, approved the full set). Bastrop is the audience for every artefact these
designs feed, which is why the finance-filings carve-out survives a blanket approval rather than
being folded into it. Sylvia Carrillo is the stakeholder for the flood study and the Finance lens.
