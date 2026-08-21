# OPS-17 Smart Files L1 completion (2026-08-15)

## OPEN

- A3 wave: identity PR (Composer 2.5 executor) then planner merge + apply 0078/0079/0080 + G-14 close.
- Do not apply until identity PR is merged.
- L26 / L16B hold the atoms slot. Smart Files DDL is cortex-prod, slot-free, but do not start a second neondb parcel reader.
- Dirty LDT checkout `feat/s1-instrument-hardening` (~55 files): do not clean/stash.

## LESSON

- Merged-is-not-applied: CI drizzle-kit push != migration execution. Apply is workflow_dispatch run-migrations.
- A-014 "CI never executes .sql" was false as stated; F-A2-CP1-1: executions exist, gated off the merge path.
- City-FIPS entityId cannot be the module key. Apply-first would have hardened the wrong key on empty tables that are still cheap to change.

## DEAD-END

- Closing G-14 on a merged PR. Frozen WDLL item 2 requires live schema read.
- Promoting to atom-contract while the key is still FIPS (A-013 criterion fired at G-34 close; promoting now would freeze the wrong shape).
- Sequencing G-30 / lanes B-C-D ahead of Smart Files L1 (operator 2026-08-15: push Smart Files L1 to completion).

## GROUND-TRUTH

- 2026-08-15: LDT PR #430 G-14 MERGED `7bb79248`; PR #431 G-34 MERGED `34c01e04`; 0078 and 0079 unapplied on deployment (lane claim; verify before apply).
- 2026-08-15: operator go to complete Smart Files Lane 1; A-014 HOLD lifted for planner-owned apply AFTER identity lands.
