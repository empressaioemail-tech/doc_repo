# Elgin STEP 2 — Engine zoning-fact bake + Option A wiring

Date: 2026-08-04
Engine PR: https://github.com/empressaioemail-tech/hauska-engine/pull/226
Merge SHA: 5ad77556d0613ab277633dcfd204ce3761f2136d
CI: run 30909850089 conclusion=success (headSha matched 4fbc88f before merge)

## Planner ruling
Option A (proper fix), not mint-then-backfill: per-parcel descriptor key from city hint + elgin-tx setback alias. Needed because without setback resolve, envelopes would not emit and cascade declines would persist.

## Code (Option A)
- SETBACK_TABLES alias elgin-tx → same object as elgin-development-code
- descriptorForCounty: cityNorm elgin_tx → key elgin_tx (else county map)
- WDLL 3.8 CI catch: hyphenated elgin-tx in JSDoc tripped \bTX\b; fixed to underscore in comment only

## Dry-run == Apply (explainable match)
{"event":"breadth-county-bake.done","ledgerPath":"P:\\tmp\\elgin-step2-apply\\hauska-engine\\packages\\engine-core\\src\\property-reasoning\\fixtures\\breadth-ledgers\\48021.json","status":"completed","totals":{"parcelsSeen":62257,"parcelsEmitted":62257,"atomsWritten":69781,"zoningPresent":9535,"zoningAbsence":52722,"setbackPresent":3762,"envelopePresent":3762,"emitErrors":0},"honestAbsenceRate":{"zoning":0.8468445315386222,"note":"zoningAbsence / parcelsSeen ΓÇö spike monitor vs baseline window"},"bakedPct":{"ofTier1Denominator":1,"zoningPresentOfSeen":0.15315546846137784,"setbackOfSeen":0.06042693994249643,"envelopeOfSeen":0.06042693994249643},"compute":{"units":70093,"wallMs":229685,"approxUsdNote":"wall=229685ms units=70093; approx $0.1421 (0.25 CU ├ù $0.16/hr + $0.000002/atom write heuristic)","costGateUsd":200,"flaggedOverCost":false,"approxUsd":0.1421},"spikeFlags":[]}

## Live verify (planner SQL)
- Elgin zoning-facts with elgin_tx code refs: 3762
- Elgin setback-rules: 3762
- Elgin stale cascade (unzoned-no-district-basis on district Elgin parcels): 0
- Cascade declines remaining county-wide: 52726 (= 56488 - 3762)
- Bastrop gold 28286/33512/34785 still SF-1/GC/GC with bastrop_tx-bdc refs

## REASON-OVERSTATES
Elgin slice CLEARED by supersede. Smithville remainder still queued for neutral re-word.

## Verdict
STEP 2 PASS. Proceed to STEP 3 re-gate.
