---
decision_id: 2026-08-20_flood_stamp_229_licenses_ssw17_convention
date: 2026-08-20
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-19_ss-w17_close.json
  - _inbox/2026-08-20_b7_stamp_dry_run.md
---

## Decision

The flood corpus apply is licensed against SS-W17's adjudicated baseline (229 of 5,750 Bastrop not-contained), not against ground truth about which txgio_parcel feature a duplicate prop_id names. First-write-wins on the ring store is the convention that makes the stamper consistent with that baseline. If the convention is later found wrong, every stamped county moves together and the 229 harness will not have flagged it.

## Context

When prop_id 10584 maps to five feature_index rows, "which feature is that parcel" is a real question. Ordering (lowest feature_index wins) is an internal-consistency tie-break, not a second derivation. Aligning loadTxgioParcelRingStore to first-write-wins so it agrees with selectPlannableParcels first-key-wins, then reproducing 229, proves consistency with SS-W17. It does not prove the chosen feature is the parcel.

The 2026-08-20 dry-run missed 229 (271 not-contained) because the store last-write-wins paired the first-key centroid with a later feature's ring. Same-object PIP on the live B5 centroid still yielded 229. The extra 42 were the convention disagreement, not a centroid change.

## Structural commitment check

Confidence is earned, not asserted: the 229 figure is an adjudicated baseline with a named population (first 6,000 DISTINCT ON feature_index, 138 unusable, 112 duplicate, 5,750 plannable). It is not a claim that first-key-wins is the cadastral identity of a multi-feature account.

## Reasoning

A meaning-shaped check needs two independently derived inputs. Feature A versus feature B for the same prop_id is one store, ordered two ways. Reproducing 229 after first-write-wins holds the stamper to the population SS-W17 measured. That is the right apply gate for this programme. Recording the inheritance is what keeps a later reader from treating 229 as ground truth.

## Reversal criteria

Reverse the apply license if an independent derivation names which feature_index is the parcel (CAD account, legal description, or a store constraint that forbids duplicate prop_id), and that derivation disagrees with lowest-feature_index-wins. Then every already-stamped county is in the same wrong convention and must move together.

## Dependencies

Depends on B5 (null MultiPolygon centroid) and B6 (store-gated containment). The 229 gate is 229 not-contained plus one B5 MultiPolygon absence (prop_id 126418) on that 5,750. Population identity (contained + not-contained + unmeasurable + skipped-unusable + skipped-duplicate = parcelsRead) is a separate fail-closed assertion and does not license apply.

## Counterparties

Internal. Operator licenses apply. Planner owns the stamper.
