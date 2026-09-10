---
id: 2026-09-10_ctx_provenance_is_a_label_and_three_holds
title: Provenance is a label, not an absence; P-124 restated so it can fail (Hays and Caldwell hold attribution CORRECTED 2026-09-10)
date: 2026-09-10
status: active, AMENDED 2026-09-10 for misattribution
owner: nick
decided_by: NONE of A1-A4 were operator rulings; A1 and A4 adopted by the planner 2026-09-10, A2 and A3 reclassified as defects. See the amendment block.
plan_rows: [P-124]
supersedes: the declared non-account absence state recommended by CTX-SENTINEL
related:
  - _inbox/2026-09-10_ctx_third_party_review.md
  - _inbox/2026-09-10_ctx-sentinel_close.json
  - _inbox/2026-09-10_ctx-hays-gate_close.json
  - _inbox/2026-09-09_ctx-retire_close.json
---

# Four rulings, 2026-09-10
## AMENDMENT 2026-09-10: A2 and A3 were never operator rulings

The operator read this record and rejected its central attribution: ``I had no holds on Hays
or Caldwell.`` That is correct and this record was wrong.

A2 and A3 were **recommendations made by the third-party review** in section 8 of
`_inbox/2026-09-10_ctx_third_party_review.md`, written as Stage A rulings for the operator to
make. The outgoing integration seat filed them as rulings already made and stamped the whole
record `decided_by: nick (operator)`. The operator made no such holds. The misattribution is
the same failure shape that seat documented in itself all day: a conclusion of its own,
written into a durable artifact as though it came from somewhere with more authority.

**What survives, because it was measured rather than ruled.** The technical content of A2 and
A3 is real and is not in question:

- Hays: the publish job refuses today with `CADROLL_RENULLED`. The expectation query carries
  no tax-year scope while the bake reads only the declared vintage. That is a defect with a
  known fix, not a hold.
- Caldwell: the staging walk failed on 2026-09-09 with one parcel, `48055:1`, returning HTTP
  422, on an image whose pin already carried both merged situs fixes. That is a defect with a
  known fix, not a hold.

**What changes.** Neither county is parked. Both are defects on the critical path to the same
destination as the other four, and both are scheduled in the execution plan rather than held
behind a decision nobody owes. The word ``held`` is withdrawn from this program.

**A1 and A4 were also never operator rulings.** Asked directly, the operator answered that he
is not familiar with either and told the planner to make the call. So all four items in this
record were the third-party review's recommendations, and the whole record was misattributed,
not just the two holds.

**The planner adopts A1 and A4 on its own authority, and they are now planner decisions.**

A1 is adopted because it is the honest reading of a measured customer surface rather than a
preference. A paying customer is served a StratMap-redistributed dollar under a label that
says the county appraisal district assessed it. That is a false statement about provenance,
and the alternative on the table would have deleted usable values across the whole of
McLennan. Labelling is the smaller and more truthful change. The reversal criterion stands as
written.

A4 is adopted because the prior finish line could not fail, and a target that cannot fail
cannot be met. It only ever narrowed a claim. Nothing is dropped by it; Z8, envelopes,
footprints, boundary edges and road-node apply stay on the row with owners.

Both are reversible by the operator at any time. Neither is load-bearing on anything that has
already shipped.

**The Travis caveat recorded under A1 as an operator addition is now measured, and it was
the right worry.** Travis 2025 market values sit about ten times below its 2026 roll across
373,359 paired parcels, median ratio 9.97. The same StratMap-to-CAD comparison returns 0.939
in Caldwell and 1.000 in Hays. So the StratMap tier is sound in general and Travis's own 2025
drop is the broken artifact. The gap does not reach McLennan or Bastrop served values, and it
does not reach Travis's served headline value either, because Travis serves its 2026 roll.
It reaches the prior-year row in value history only. Full measurement in the execution plan.

The instrument note that belongs with that number: the first attempt to measure it divided
two `bigint` columns and got integer division, which returned clean ratios of exactly 9 and
exactly 10 and looked like a decimal-shift bug. The cast to numeric changed the answer. The
reading above is the corrected one.

---


Taken on the third-party teardown review, which was commissioned specifically to break the
integration seat's thesis and did. Three of the seat's six theses did not survive.

## A1. Provenance is a label, not an absence

**Decision.** Every served dollar carries the roll tier and the source vintage it came from,
and `valueBasis` is derived from the tier rather than asserted by a constant. The declared
non-account absence state recommended by CTX-SENTINEL is **rejected**.

**Why.** Measured on the production connector at paid depth on 2026-09-10, a paying customer
opening a McLennan parcel is served present market, land and improvement dollars labelled
`source: cad_property` and `valueBasis: county-assessed`, byte-identical in label to a
Caldwell value that came from the appraisal district's own export. The StratMap origin
appears only on structural and owner facts, never on the value. The mechanism is two string
constants stamped by `bakedDollar`; the tier is loaded from `source_vintage` and dropped at
one seam.

"Zero CAD signal" was the wrong frame. It is a three-null-field allowlist applied to rows
whose land, improvement and market values the StratMap adapter deliberately fills. The
readiness gate's own REAL predicate classifies the same rows as real accounts. An absence
state would convert values a customer can legitimately use, if labelled, into nothing, and
would do it across the whole of McLennan and four in five Bastrop parcels.

**Operator addition, not in the review.** Labelling is necessary and may not be sufficient.
Travis serves a systematic tenfold gap between its 2025 StratMap-derived row and its 2026
CAD row on four of five parcels read, both present with the same label. An honestly labelled
figure that is wrong by an order of magnitude is still wrong. That gap is a **separate
blocker** on serving StratMap-tier dollars and is not closed by A1.

**Reversal criteria.** If a labelled StratMap-tier value is found to mislead customers in
practice despite the label, or if the tenfold gap proves to affect the StratMap side
systematically, revisit whether those dollars should be served at all rather than whether
they should be labelled.

## A2. Hays: cadRoll vintage scope (RECLASSIFIED: a defect, not a hold)

**Reclassified.** Hays publishes when this is fixed, like any other defect. Original text follows.

**Decision.** Hays does not publish tonight. `CADROLL_EXPECTATION_SQL` is scoped to the
declared vintage **together with** a truthful state for rows that were never on a CAD roll,
and the dollar rails inherit the same join hold that owner and land use already carry in
Hays. Neither half ships without the other.

**Why.** The expectation query has no tax-year scope, so it matches a dollar in any historic
row while the bake reads only the declared vintage; 100 percent of the 38,197 misses are
prop_ids with a 2025-only dollar and no 2026 row. Scoping alone would clear the gate by
relabelling 37,813 rows as having left the roll. Those rows were never on one, so that is a
false claim that passes every existing check. That is the exact fabrication `ENFORCEMENT.md` exists
to prevent.

Separately, `48209:40138` resolves as a San Marcos address and draws a Buda parcel's label
and acreage. Its own payload holds owner and land use back with "TxGIO prop_id does not join
the CAD account" while serving the four money rails joined on that same id. The hold is
applied to two rails and not to the four that carry money.

**Falsifier.** If a Hays parcel still serves a value-history row whose land plus improvement
exceeds market by more than a rounding margin after the change, the join hold did not reach
the money.

## A3. Caldwell: retired-situs contract (RECLASSIFIED: a defect, not a hold)

**Reclassified.** Caldwell publishes when this is fixed, like any other defect. Original text follows.

**Decision.** Caldwell does not publish until retired payloads bake
`facets.base.situsAddress` null (or the serve guard exempts an earned retirement), and the
walk's jurisdiction cohort excludes bucket identifiers by a named class.

**Why.** `48055:1` is a retired account and a bucket identifier: 203 distinct
`txgio_parcel` features share `prop_id` `'1'`. Last night's staging re-bake ran on a pin
carrying both merged fixes and it still returned 422. So the fixes shipped do not reach it
and no further query is needed to justify the hold.

**Falsifier.** After the next bake, a live read of `48055:1` on the facets route returns 422
or 500.

## A4. P-124 is restated so tonight's target can fail

**Decision.** The target is **Z7 tier-1 conformant serving on production for the counties
that clear, provenance-honest, content-walked, census-clean and customer-probed.** Z8,
envelopes, footprints, boundary edges and road-node apply stay in the row as later waves
with named owners, not claimed.

**Why.** The prior finish line was not gradeable, because it could not fail, so it could not be
met. A smaller stated target that can fail is worth more than a larger one that cannot.

**Falsifier.** Any county declared done whose production walk verdict was not read, or whose
census was not run, or on which no customer probe was made.

## What these four rulings do not do

They do not resolve the Travis tenfold gap. It is now measured and owned; see the amendment.

They do not make the walk a sufficient instrument. The third-party review established that
the walk grades a sample of roughly 180 parcels, short-circuits on a non-ok response, and
grows its required-leaf list by hand one leaf per lane, with the walk-versus-bake divergence
test skipping in CI. Serial discovery of one new defect class per pass is guaranteed by that
construction. The census instrument (CTX-B3) is the correction; these rulings assume it
lands.

They do not address the plural search surface, which refuses for all six counties because
its index has no writer anywhere. Cross-parcel questions are zero today independent of
anything P-124 does.
