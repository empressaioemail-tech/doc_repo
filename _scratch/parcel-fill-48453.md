# parcel-fill-48453 scratch

## GROUND-TRUTH
- 2026-09-01T19:15:45Z landing 48453 method=ring 277003 in-city + 103914 unincorporated = 380917
- CAD latest ∩ landing: imp_zero 47403, living_gt0 0
- 2026-09-01T19:31:00Z factory-parcel-record-fill-qwxvp succeeded 14m18.61s args parcel-record-fill --county=48453 --apply --twice run 162b0c99-a9bf-484b-b4a5-b169927d8967
- 2026-09-01T19:33:33Z store 380917 rows / 24759605 cells / 65 each / NA 18x103914 / absent-verified 0 / improvement $0 47403 / livingArea unaccounted 380917

## LESSON
- Travis containment is 380917, not CAD dollar headline 494364.
- living_gt0 ∩ landing is 0. Unaccounted on livingAreaSqft is the correct fill.

## DEAD-END
- Using 494364 as the row target.
- Laptop county --apply.

## OPEN
- Do not rebuild the job or the store token.
- Queue still attaches the store token on claim even though the card says it is dead.
