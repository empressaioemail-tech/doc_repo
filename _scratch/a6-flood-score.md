# A6 flood-score scratch (Tier 2)

## GROUND-TRUTH 2026-08-21T17:56Z
- LDT worktree P:/seat-worktrees/property/legacy-design-tools seat/property 44d6fa89eb322726235c9b58603c947f4c4bd13e
- 48001 flood coverage row absent (row_48001_n=0). missing_n=77 flood_coverage_n=177 manifest=254
- Prefix-range COUNT EXPLAIN: Index Only Scan atoms_entity_composite_unique
- P-02 apply.log watch-armed only; no live txgio_parcel queries

## LESSON
Stock countyFloodScoreCli.ts --county= still GROUP BYs all flood-hazard-fact via readAtomCountsByCounty. Do not invoke it 76 times. Prefix-range COUNT is the indexed instrument.

## GROUND-TRUTH 2026-08-21T18:02Z
- 76/76 wrote. missing_n=1 Donley 48129. flood_coverage_n=253.
- New rows: 48 satisfied-present / 28 not-yet.
- 48001 before none; after 72.16 not-yet.
- Harris 48201 1523640/1523641 -> 100.00 satisfied-present (dispatch allowed not-yet; observed present).
- Ector 48135 flood 3791/75891 5.00 not-yet. Geometry row untouched (B2, 2026-08-12).
- Bastrop 48021 last_verified_at still 2026-08-12T10:51:14.215Z (did not --all).

## OPEN
Planner ledger recompute. Stock CLI still GROUP BYs; tmp runner is the indexed path.
