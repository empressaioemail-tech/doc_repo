# parcel-fill-48021 scratch

## GROUND-TRUTH
- 2026-09-01T18:48:03Z factory PR #57 MERGED mergeSha 648366df4da0f3cec3fb9ec54d225456ba470841
- 2026-09-01T18:55Z origin/feat/parcel-record-fill bb66db4ea0edaacc1344417903e7dbd6e1df0697
- 2026-09-01T19:05:45Z factory PR #58 MERGED mergeSha 9b0aff4d3acae718d37e97f9b8e6e4554e74bcc5 CI test+gate8 SUCCESS
- 2026-09-01T18:56:39Z factory-parcel-record-fill Ready. image sha256:7a1d11bab1d968d97c2d8469983370c9fa83dddf6b0bc6a7cd9862aee9c2e616 ENGINE_SHA=22e71e1c18ec6bcefe590b97d36093ae3849a4fc
- 2026-09-01T18:59:43Z execution factory-parcel-record-fill-bmd6f succeeded. args parcel-record-fill --county=48021 --apply --twice. run 5cc8f823-77bd-4563-b711-6bf4f8526977. landing=62256 records=62256 cells=4046640 drift=zero-drift
- 2026-09-01T19:02:30Z Factory neondb: 62256 rows at 65 cells + leftovers 48021:0 and 48021:10005 at 52 cells. NA 18 rails x 50264. naOnInCity 0. absent-verified 0. landing-matched improvement $0 = 0

## LESSON
- Proven sample job at b4fdcfb had no county-wide path. --county still called selectSampleForCounty. STEP 0 had to write factory files despite the card note.
- CAD headline counts are not containment. 77799 / 6158 $0 / 8712 living sit on cad_property. Join latest-year CAD to landing before using any of them as a store target.
- Upsert-only fill leaves leftover sample rows that are not in landing. Naive COUNT(*) then fails by the leftover count.

## DEAD-END
- Do not execute the b4fdcfb image for a county fill. It would write ~50 parcels and assert sample floors.
- Laptop county --apply. Card violation.

## OPEN
- Leftover orphans 48021:0 and 48021:10005. Do not COUNT(*) them into the absolute target. Delete needs operator.
- Later fill cards re-verify image digest sha256:7a1d11ba… and ENGINE_SHA 22e71e1. Do not rebuild the job or the store token.
