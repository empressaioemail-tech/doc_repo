# MISSION - OPS-21 H1: Hays identity reconciliation (P-145)

## What you are building
Hays is the identity-damaged county. **This must land before Hays receives any Phase 1 or
Phase 2 cell fill**, because filling cells on a broken key writes wrong values faster.

## STANDING FACTS - every one is a recorded finding, do not re-derive
- **30.5 percent of parcel ids gone and 19.5 percent drifted** across the 2026-09-03 StratMap
  reload. Worst of the six by a wide margin; Bastrop was zero across 400 samples. Healthy
  aggregates mask it because new parcels backfill the count.
- **The StratMap graft, 2026-08-25.** Someone needed Hays coverage, the CAD export was short,
  so they padded `cad_property` with 116,421 StratMap geometry rows and **overwrote
  `source_file` in place.** Invisible for five weeks; it then cost two lanes, a false alarm
  about an appraisal district, and very nearly a `recordRetirement` written onto 38,060
  parcels that were never accounts.
- **The cadRoll gate is not vintage-scoped**, so 37,813 rows can only clear by claiming they
  left a roll they were never on. CTX-B2 found that trap and refused to walk into it. Do not
  clear it that way.
- **Dollars are joined on a `prop_id` whose own payload says it does not join the CAD
  account.** One San Marcos parcel serves a Buda parcel's label and acreage.
- 5 of 11 Hays cities carry a zoning endpoint.

## What the lane must produce
The Hays `place_key` set measured as a real id-set intersection against the `cad_property`
account set, and **a declared disposition for every non-intersecting row** - not a
relabelling. Distinguish at minimum: never an account; was an account and left the roll; is
an account under a different key; unknown. The fourth is legitimate and must stay countable.

Precedent worth reading before concluding: the readiness gate once refused Williamson at 46.9
and Caldwell at 51.4 percent for a defect that did not exist. `parcel_record`'s intended
population is `landing_parcel_jurisdiction`, not the account roll, and measured as real id-set
intersections the two matched EXACTLY in all six counties. Measure before concluding.

## Completion predicate
Every non-intersecting Hays row carries a declared disposition; count of rows with no
disposition equals 0. Proven by violation against a control county.

## Out of scope
Filling any Hays cell. Re-running the StratMap load. Repairing `source_file` history.
