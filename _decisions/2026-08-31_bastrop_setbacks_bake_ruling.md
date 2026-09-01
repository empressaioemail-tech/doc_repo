---
decision_id: 2026-08-31_bastrop_setbacks_bake_ruling
date: 2026-08-31
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _inbox/2026-08-30_ctx_road_to_prod_accurate.md
  - _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md
  - _decisions/2026-08-31_alias_seed_four_rulings.md
  - 90_operations/OPS-19_factory_plan_of_record.md
---

## Decision

Three answers on the setback rail, which was `declined-in-bake` with
`atom_path_pending` and unruled for Bastrop city. This unblocks the highest-value
data conversion on the CTX board.

**1. Bastrop city's setback source is AUTHORITATIVE. Bake it.** The decline was
"not ruled", not "source rejected". The four existing artifacts land.

**2. An in-city parcel with no landed setback table serves `unmeasured`, never
`not-applicable`.** A setback can exist there and has not been sourced. Calling
that structural is an unearned absence, which is the defect P3 exists to prevent.
This governs roughly 465,568 parcels, so the wrong choice here is the single
largest fabrication available on this board.

`not-applicable` remains correct for unincorporated parcels only, because counties
do not zone unincorporated land.

**3. PDD and the corner-lot disagreement KEEP DECLINING, and the decline is
surfaced to the user as unresolved.** Do not bake either into the first pass. The
gold card 25/5/25 against a 30/10/30 derive is unreconciled, and PDD has no rule
table. **The user-facing string must say the question is unresolved, not that the
answer is absent.** Those are different claims and only one of them is true.

## Why the third answer is not just deferral

A silent decline and a declared-unresolved decline look identical in the store and
opposite to a customer. "We have no setback for this parcel" is a claim about the
world. "This parcel's setback is unresolved between two sources" is a claim about
us. Only the second is true for PDD and corner lots today, and the first is the
kind of confident-and-incomplete answer this program exists to prevent.

## Reversal criteria

Reverse 1 if a Bastrop artifact is shown to be a scrape of an unreconciled PDF
rather than the city's own dimensional record.

Reverse 2 only by evidence that a named in-city population structurally cannot hold
a setback. Volume is not evidence.

Reverse 3 per-class when a rule table covers the district: PDD becomes bakeable
when a PDD rule table exists, and corner lots when 25/5/25 versus 30/10/30 is
reconciled against the source authority rather than against current output.

```
leave_behind:
  - item: corner-lot 25/5/25 vs 30/10/30 reconciliation against source authority
    owner: property seat
    plan_row: F-11
  - item: PDD setback rule table (do not build per A-028; ruling only)
    owner: unassigned
    plan_row: F-11
```
