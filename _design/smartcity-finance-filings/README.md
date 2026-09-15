# SmartCity Finance lens — Localgov filings

**Artifact:** https://claude.ai/artifact/Vo3LW9rEKzPsLtMo7QzQRw
**Decision:** AMEND, ruled 2026-09-15, `_decisions/2026-09-15_design_ratification_pass.md`
**Scope:** `_inbox/2026-09-15_localgov_filings_integration_scope.md`
**Plan rows:** OPS-17, allocate at dispatch (scope card 4 is the Finance lens)
**Status:** AMEND. NOT ratified and may not be until the two citations below are sourced or
badged. Not dispatched.

Five artboards: reconciled, exceptions, lodging economy, unlabelled, empty.

## The amendment owed before this can be ratified

Two figures are printed with citations to external authorities and neither is traceable to any
source in this repository. This was the only one of the four drafts whose record showed no
adversarial pass against source, and this is what the pass found.

**`Ordinance rate 7.00%`, attributed on the artboard to "Bastrop code of ordinances".** It is
load bearing, not decorative: the exceptions worklist divides tax due by taxable revenue and
scores three of Bastrop's filings as "Rate does not match ordinance" against it. If the rate is
wrong, the product hands the city a worklist accusing its own taxpayers of filing at the wrong
rate, citing a rate we invented, attributed to their own law. Texas caps municipal hotel
occupancy tax at seven percent, so 7.00% is plausible, and that is exactly the property that let
a nonexistent code section survive six citations on another canvas the same week.

**`Fund 108`, attributed to "City ledger, OpenGov".** Asserted in this design and in its own
scope card, and nowhere else. Two of our own documents is one derivation, not two.

Either source both at Bastrop's published ordinance and adopted budget, or badge both unverified
on the page in the way the `FIXTURE` badge already works. Until then this design is not ratified
and does not enter a customer-facing artefact.

## No figure here is measured

The Localgov endpoint has never been called. No credential exists in any environment we
control, verified 2026-09-15 across both GCP projects and every local env file. Every number
on every artboard is fixture, and the `FIXTURE` badge stays on the page until a real read
replaces it. The fixture rows do satisfy the vendor's own reconciling identity
(`TaxDue - CollectionAllowance + Penalties + Interest = TotalAmountDue`) so the layout is
exercised against arithmetic that holds.

## The moves

- **The headline is an agreement, not an amount.** The page opens with whether two
  independently derived sources agree and by how much, both named. The amount is subordinate
  to its own trustworthiness. This is the one thing we can build that a spreadsheet cannot,
  because nobody else holds both Localgov and the city ledger.
- **Three amounts, never one number.** Filed (`TotalAmountDue`), Received (`AmountPaid`,
  excludes processing fees), Booked (fund 108). Each measure names its field and its system.
- **The exception worklist is where it earns its keep.** Implied rate is tax due over taxable
  revenue compared against the ordinance rate, which is a second independently derived source
  rather than another field from the same payload. Lateness is inferred from an absent
  timely-filing allowance beside a present penalty; the feed carries no late flag.
- **The gap is drawn, not omitted.** Who has not filed gets a region with a basis line saying
  the feed keys filings and not filers, so the gap is countable rather than invisible.
- **Unlabelled is a real state, not an error state.** The endpoint returns no tax-type field,
  so that artboard renders the figures, runs the checks, declines to name the tax, and
  suspends the reconciliation.

## Pinned, deliberately not designed here

Restricted-use expenditure accounting. Texas municipal hotel occupancy tax revenue is
restricted in how it may be spent, and a spend-side view is the obvious companion to this
collect-side one. It is not drawn because the statutory category list has not been verified
at source in this session, and inventing one would put an unearned claim on a government
customer's screen.

Per-taxpayer and delinquency views. Blocked on whether a taxpayer identifier is available at
all, which is question 4 in the scope.

## Regenerate

    node gen.mjs        # rewrites the five .dc.html artboards + canvas.json
