# parcel-fill-48309 scratch

## GROUND-TRUTH
- 2026-09-01T19:13:50Z factory-parcel-record-fill Ready image sha256:7a1d11bab1d968d97c2d8469983370c9fa83dddf6b0bc6a7cd9862aee9c2e616 ENGINE_SHA=22e71e1c18ec6bcefe590b97d36093ae3849a4fc.
- 2026-09-01T19:14:16Z landing 48309 = 114254 (81832 in-city + 32422 unincorporated). CAD ∩ landing assessed_null=114254 living_null=114254 improvement_zero=0. Store leftover 40 at 52 cells.
- 2026-09-01T19:18:55Z factory-parcel-record-fill-mxjh7 succeeded 4m14.25s args parcel-record-fill --county=48309 --apply --twice run 987603f9-e134-4519-bf53-6d084ea0d9e1. Close line landing=114254 records=114254 cells=7426510 drift=zero-drift.
- 2026-09-01T19:20:13Z store 48309: 114254 rows at 65 cells; NA 18x32422; naOnInCity 0; absent-verified 0; assessed+living unaccounted 114254; leftover 0.

## LESSON
- McLennan sample leftovers were landing keys, so upsert removed the 52-rail leftover class. Bastrop leftovers were non-landing keys and survived.
- CAD ∩ landing for assessed/living is the verify target, not the dispatch 113360 dollar-field headline.

## DEAD-END
- Laptop county --apply.
- Joining landing_parcel_jurisdiction on the Factory client.

## OPEN
- Do not rebuild the job or the store token.
- 2026-09-01T19:22:05Z RELEASED parcel-fill-48309 as close. This loop then found nothing claimable.
- 2026-09-01T19:27:45Z 48209-r2 closed by another property lane. 48453 still held (store token until 20:45:25Z). parcel-gap-ledger waits on 48453. Stopped rather than steal.
