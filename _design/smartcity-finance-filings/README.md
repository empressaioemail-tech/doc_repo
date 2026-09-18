# SmartCity Finance lens — Localgov filings

**Artifact:** https://claude.ai/artifact/Vo3LW9rEKzPsLtMo7QzQRw **STALE: published 2026-09-15, before G-138.** It still shows the rate check scoring taxpayers and an Exceptions count of 12, and so does the local `smartcity-finance-filings.html` export beside these boards. The boards are the source; republish from them.
**Decision:** AMEND, ruled 2026-09-15, `_decisions/2026-09-15_design_ratification_pass.md`
**Scope:** `_inbox/2026-09-15_localgov_filings_integration_scope.md`
**Plan rows:** OPS-17, allocate at dispatch (scope card 4 is the Finance lens)
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. **G-138
DONE 2026-09-18 by the badge path:** both citations are badged UNVERIFIED at every use, the rate check
is HELD rather than scored, and `node check.mjs` enforces it. Buildable once G-137's credentials land.
Not dispatched.

Five artboards: reconciled, exceptions, lodging economy, unlabelled, empty.

## G-138, what changed and why a badge was not enough

The AMEND asked for both citations to be sourced or badged. They are badged, at **every** use, and the
number of uses was the first finding: the rate appeared in three places, not one (the Exceptions
citation, every scored row's `Expected` column, and the Lodging board's tax-due line), and `fund 108` in
seven. A fix that badged the one line the AMEND quoted would have left two uses unmarked.

**The badge alone would have been cosmetic, so the rate check is held.** The worklist's rate check is
built as a meaning-shaped check: the implied rate from the filing against the ordinance rate, two
independent sources. With the second input unsourced it does not fail safe. It turns a guessed number
into a confident accusation against Bastrop's taxpayers, and its own design makes the accusation look
well founded. So while the rate is unverified the region renders as held and scores nothing, using the
same suspension vocabulary the Unlabelled board already uses for the fund. Holding it also honours the
scope card, which forbids computing any rate over the monetary fields until the Azavar Q2 answer is
filed; this board had been computing one.

**Two derived figures would have kept the accusation alive, and both are fixed.** The Exceptions tab
counted 12, which is 3 rate findings plus 4 outstanding plus 5 late, in red on four boards. It is now
derived from the same flag that holds the check, so it reads 9 and the two cannot disagree. The fourth
board, Unlabelled, built its tabs inline with a hardcoded `'12'` and was missed by the first pass; a hand
count caught it. And Lodging's `Tax due on that base, $1,282,946` is exactly the taxable base times
7.00%, a figure manufactured from the unsourced rate and toned green as if confirmed; it is now neutral
and its basis line says the rate is not sourced.

**To promote a citation:** set `verified: true` in `gen.mjs`'s `CITES` AND record a traceable source (a
URL at the authority, the date read, the quoted text) in `check.mjs`'s `REGISTRY`. Either alone fails the
check. Promoting the ordinance rate brings the scored table back unchanged.

## The instrument

`node check.mjs`: 23 self-tests both directions, then the real boards. It carries its own registry of
citation values and finds every occurrence in the rendered text itself, rather than asking the
generator where its tags are, so a use the generator forgot to tag is found by a party that is not the
generator. Rules C1 and C3 are meaning-shaped in that sense; C2, C4, C5 and C6 compare two outputs of the
same generator and are internal consistency, which is what catches a dropped badge or a stale count. It
reports a count for every rule and refuses a verdict when a rule that must find something found nothing.

`node violate.mjs`: 13 plants on the real boards, each one required to change the file, each caught with
its named rule, and each followed by a clean pass. It includes the hardcoded 12. **Falsifier, registered
before it ran:** the check must not pass the original, unpatched boards. It refuses them, exit 2.

## The amendment as ruled 2026-09-15, kept for the record

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
    node check.mjs      # G-138: every citation tagged and badged, nothing scored against an unsourced rate
    node violate.mjs    # 13 plants on the real boards, each caught, each followed by a clean pass
