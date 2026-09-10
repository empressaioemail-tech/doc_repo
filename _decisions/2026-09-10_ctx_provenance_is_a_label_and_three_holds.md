---
id: 2026-09-10_ctx_provenance_is_a_label_and_three_holds
title: Provenance is a label, not an absence; Hays and Caldwell held; P-124 restated so it can fail
date: 2026-09-10
status: active
owner: nick
decided_by: nick (operator), 2026-09-10
plan_rows: [P-124]
supersedes: the declared non-account absence state recommended by CTX-SENTINEL
related:
  - _inbox/2026-09-10_ctx_third_party_review.md
  - _inbox/2026-09-10_ctx-sentinel_close.json
  - _inbox/2026-09-10_ctx-hays-gate_close.json
  - _inbox/2026-09-09_ctx-retire_close.json
---

# Four rulings, 2026-09-10

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
state would convert values a customer can legitimately use, if labelled, into nothing — and
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

## A2. Hays is held

**Decision.** Hays does not publish tonight. `CADROLL_EXPECTATION_SQL` is scoped to the
declared vintage **together with** a truthful state for rows that were never on a CAD roll,
and the dollar rails inherit the same join hold that owner and land use already carry in
Hays. Neither half ships without the other.

**Why.** The expectation query has no tax-year scope, so it matches a dollar in any historic
row while the bake reads only the declared vintage; 100 percent of the 38,197 misses are
prop_ids with a 2025-only dollar and no 2026 row. Scoping alone would clear the gate by
relabelling 37,813 rows as having left the roll. Those rows were never on one, so that is a
false claim that passes every existing check — the exact fabrication `ENFORCEMENT.md` exists
to prevent.

Separately, `48209:40138` resolves as a San Marcos address and draws a Buda parcel's label
and acreage. Its own payload holds owner and land use back with "TxGIO prop_id does not join
the CAD account" while serving the four money rails joined on that same id. The hold is
applied to two rails and not to the four that carry money.

**Falsifier.** If a Hays parcel still serves a value-history row whose land plus improvement
exceeds market by more than a rounding margin after the change, the join hold did not reach
the money.

## A3. Caldwell is held

**Decision.** Caldwell does not publish until retired payloads bake
`facets.base.situsAddress` null (or the serve guard exempts an earned retirement), and the
walk's jurisdiction cohort excludes bucket identifiers by a named class.

**Why.** `48055:1` is a retired account and a bucket identifier — 203 distinct
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

**Why.** The prior finish line was not gradeable — it could not fail, so it could not be
met. A smaller stated target that can fail is worth more than a larger one that cannot.

**Falsifier.** Any county declared done whose production walk verdict was not read, or whose
census was not run, or on which no customer probe was made.

## What these four rulings do not do

They do not resolve the Travis tenfold gap, which is unowned.

They do not make the walk a sufficient instrument. The third-party review established that
the walk grades a sample of roughly 180 parcels, short-circuits on a non-ok response, and
grows its required-leaf list by hand one leaf per lane, with the walk-versus-bake divergence
test skipping in CI. Serial discovery of one new defect class per pass is guaranteed by that
construction. The census instrument (CTX-B3) is the correction; these rulings assume it
lands.

They do not address the plural search surface, which refuses for all six counties because
its index has no writer anywhere. Cross-parcel questions are zero today independent of
anything P-124 does.
