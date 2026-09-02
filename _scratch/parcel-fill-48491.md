# parcel-fill-48491 scratch

## GROUND-TRUTH
- 2026-09-01T18:44:26Z claim GRANTED property / P:/tmp/hauska-factory-parcel-fill / feat/parcel-record-fill. Later lane. 48021 claimed first at 18:43:26Z. 48055 at 18:44:07Z. Store token attached to this claim despite the dead-token ruling; did not rebuild it.
- 2026-09-01T18:48Z gcloud run jobs list us-east4: no factory-parcel-record-fill. Secrets present (PRODUCTION_NEONDB_URL 141 chars, FACTORY_DATABASE_URL 117 chars).
- 2026-09-01T18:49:52Z PRODUCTION_NEONDB_URL / neondb: landing 48491 method=ring in-city 174827 + unincorporated 107743 = 282570 (landingAll also 282570). cad_property 602050 rows / market_present 590644 / improvement_zero 68483 / living_gt0 245591 (0.4079). PRIVATE ROAD is unincorporated ring landing; CAD row exists, has_market false.
- 2026-09-01T18:49:56Z FACTORY_DATABASE_URL / neondb: 48491 parcel_record 40 / cells 2080 (52 each) / value 276 / unaccounted 1444 / na 360 / absent-verified 0.
- 2026-09-01T18:52Z first lane is dirtying the shared factory tree (ENGINE_PIN, rail-keys, job, Dockerfile). This lane does not write that tree.

## LESSON
- Fill denominator for 48491 is landing 282570, not cad_property 602050. Dispatch 590644 is market_present, a CAD shape, not the row target.
- Queue still serialises hauska-factory on claim even though the cards say the token is dead.

## DEAD-END
- Do not execute origin b4fdcfb `--county=48491 --apply`. It still calls selectSampleForCounty (~50) and would lie that the county filled.
- Do not laptop --apply. Sample already admitted that deviation; a county fill from a laptop is a card violation.

## GROUND-TRUTH
- 2026-09-01T18:56:45Z image build c4858fb0 SUCCESS digest sha256:7a1d11bab1d968d97c2d8469983370c9fa83dddf6b0bc6a7cd9862aee9c2e616. Job env ENGINE_SHA=22e71e1 FACTORY_CLOUD=1.
- 2026-09-01T18:59:29Z execution factory-parcel-record-fill-dtcs6 args read back on the execution: parcel-record-fill --county=48491 --apply --twice.

## GROUND-TRUTH
- 2026-09-01T19:09:38Z dtcs6 close line landing=282570 pages=1413 records=282570 cells=18367050 drift=zero-drift. Execution succeededCount=1 in 10m8.28s.
- 2026-09-01T19:11:31Z FACTORY neondb: 282570 records / 65 cells each / NA 18x107743 / naOnInCity 0 / absent-verified 0.
- 2026-09-01T19:15:07Z CAD improvement $0 join landing n=0.

## OPEN
- Gap-ledger owns the Williamson CAD $0 / living-area populations that sit outside landing keys.
