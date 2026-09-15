---
decision_id: 2026-09-15_design_ratification_pass
date: 2026-09-15
owner: nick
status: active
related_canonical:
  [
    _design/INDEX.md,
    _design/smartcity-flood-study/README.md,
    _design/plan-review-reasoner/README.md,
    _design/smartcity-finance-filings/README.md,
    _inbox/2026-09-15_design_pass_HANDOFF.md,
    _inbox/2026-09-15_localgov_filings_integration_scope.md,
    _decisions/2026-09-14_flood_determination_authority.md,
  ]
---

## Decision

Of the three drafts awaiting a call, **flood-study and plan-review-reasoner are RATIFIED** and
**smartcity-finance-filings is AMEND**: it may not be ratified until two citations printed on
its artboards are either sourced or badged unverified on the page.

## Context

`_inbox/2026-09-15_design_pass_HANDOFF.md` put three drafts in front of the operator and named
the ratifying call as the cheapest thing blocking the Bastrop review artefact. The operator
ruled all three in one sitting on 2026-09-15 and agreed the planner's recommendation on each.

The relevant prior is that the one design checked against source earlier the same day, the
Development services lens, carried four defects including three residents named beside their
addresses. The base rate for an unchecked design in this folder is not low, so each draft was
read against source before a recommendation was offered rather than after.

## Structural commitment check

**Sell reasoning, not data.** Engaged and satisfied on two of three. Both ratified designs carry
a basis line on every region and draw absence as a positive determination. Finance-filings fails
this at exactly one point, which is what the amendment fixes: a figure carrying a citation to an
authority that cannot be traced is an asserted number wearing the costume of a sourced one.

**Confidence is earned.** Engaged on flood-study. G-130 makes the flood rail authoritative for
serving and provisional for citation, and the design enforces that as a refused affordance on
the page rather than as a sentence in a record.

**Cost per jurisdiction.** Not engaged.

**Dual interface.** Not engaged. These are UI surfaces on an existing UI-first product.

**Tenant sovereignty.** Not engaged at the design level.

Adversarial review was run in place of the retired premortem-check, per the 2026-07-13 operator
ruling. It produced the finance-filings finding below.

## Reasoning

**flood-study ratified.** Its folder README records an adversarial pass and the corrections it
forced: storm duration and return-period presets that exist nowhere in the engine contract,
which carries a bare `rainfallDepthInches` in (0, 60]; outputs invented wholesale, including a
structure footprint the study has no layer for and a zone "concentration" that is an ordinal
position in a feature list; the G-130 citation restriction placed on the drainage study, which
G-130 does not govern, while the regulatory zone card carried no restriction at all. It draws
against `pe-flood-drainage-core.ts` and `FloodTool.tsx` rather than a screenshot, and it answers
the four inch question the city asked.

**plan-review-reasoner ratified.** Its README records a pass that caught the worst class
available: a central thesis asserted as fact, attributed to the code, which the code contradicted
in the same comment block being quoted. Also a book title that does not exist, section
`14-02-005` cited six times including inside an issued letter, and a paraphrase of a code on the
same canvas as a panel promising never to paraphrase a code the product is not licensed to
quote. The corrected thesis is narrower and survives: the one proposed dimension that exists is
a number a human typed on a form, so the viewer upgrades an input from an assertion to a reading
rather than unlocking a determination.

**finance-filings amended, not ratified.** It is the only one of the three whose record shows no
adversarial pass, and a check found two figures printed with citations to external authorities
that are traceable to nothing:

`Ordinance rate 7.00%`, attributed on the artboard to "Bastrop code of ordinances", appears
nowhere in this repository. It is load bearing rather than decorative: the exceptions worklist
divides tax due by taxable revenue and scores three of Bastrop's filings as "Rate does not match
ordinance" against it. If the rate is wrong the product hands the city a worklist accusing its
own taxpayers of filing at the wrong rate, citing a rate we invented, attributed to their own
law. Texas caps municipal hotel occupancy tax at seven percent, so 7.00% is plausible, and that
is precisely the property that let `14-02-005` survive six citations.

`Fund 108`, attributed to "City ledger, OpenGov", is asserted in the design and in its own scope
card and nowhere else. Two of our own documents is one derivation, not two.

## Reversal criteria

Revisit **flood-study** if the engine contract changes shape, specifically if
`rainfallDepthInches` gains a duration or return-period companion, or if G-130's provisional
citation posture is lifted by a ground-truth sample, since the design's refused-citation
affordance would then be enforcing a restriction that no longer applies.

Revisit **plan-review-reasoner** if a second adjudicator ships, because the design badges every
rule other than the front setback `NO ADJUDICATOR` and that badge becomes a false negative the
moment it is wrong. Also revisit if the companion framing is reversed and plan review becomes a
document workflow product, which would make the reasoner the wrong argument rather than a
partial one.

Promote **finance-filings** to ratified when both citations are sourced at Bastrop's published
ordinance and adopted budget, or when both are badged unverified on the page in the way the
fixture badge already works. Reverse it instead of amending if Q1 to Azavar returns no tax-type
discriminator and no taxpayer identifier, because the design would then be a reconciliation
instrument with nothing to reconcile against and no way to name what it is reconciling.

## Dependencies

Depends on `_decisions/2026-09-14_flood_determination_authority.md` (G-130), which flood-study
enforces on the page.

The Bastrop review artefact depends on this decision. It compiles ratified designs, so the two
ratifications unblock it and finance-filings is out of it until amended.

Open and not settled here: plan review now has **three** designs, the console, the reasoner and
departments. Ratifying the reasoner does not settle which of the three a city is shown. That
call is owed before the approval package is compiled, not during it.

Also open: whether the Finance tab belongs in the Bastrop package at all. The first cohort is
Development Services staff and Finance is not in their daily path.

## Counterparties

Internal: Nick (operator, ruled all three). Bastrop is the audience for every artefact these
designs feed, which is the reason the finance-filings citations are a ruling rather than a note.
Sylvia Carrillo is the stakeholder for the Finance lens specifically, and the open scoping
question above is hers.
