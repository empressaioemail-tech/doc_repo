# parcel-fill-48055-r2 scratch

## GROUND-TRUTH
- 2026-09-01T19:10:06Z landing 48055 method=ring 10627 in-city + 14361 unincorporated = 24988
- 2026-09-01T19:10:06Z CAD latest $0 = 24552; CAD latest $0 ∩ landing = 5630
- 2026-09-01T19:12:17Z factory-parcel-record-fill-f82qb succeeded 1m22.33s args parcel-record-fill --county=48055 --apply --twice run e0d45c25-0e91-4eca-9045-abf0a8bd1f5c
- 2026-09-01T19:14:00Z store 24988 rows / 1624220 cells / 65 each / NA 18x14361 / absent-verified 0 / improvement $0 5630

## LESSON
- Card $0 headline 24552 is CAD latest, not containment. Store target is the landing join (5630).
- Compiled dispatch close path can name a burned artifact. Write the card close_artifact (r2).

## DEAD-END
- Using 24552 as the store $0 equality check. Would fail a correct fill.
- Laptop county --apply. Card violation.

## OPEN
- Later fill cards: join CAD latest $0 to landing first. Do not rebuild the image or the store token.
