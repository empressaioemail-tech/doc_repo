# Phase C resume progress (2026-08-03)

## STEP 1 — MERGE ✅
- PR #211 merged to hauska-engine main (`b861cc4`)
- CI: typecheck + test **pass**
- Block-13 from merged scripts: **7/7 blockPass=true** certRestore="7/7 — CERT-RESTORE ELIGIBLE"
- Zombie ledger: bastrop-district-cert-grade → RETIRED-STUB

## STEP 2 — SF-1 RE-WARM 🔄 IN FLIGHT
```
--dominant-district-cohort --district-prefix=SF-1 --force-overwrite --promote --upsert-ledger
Log: _scratch/phase-c-sf1-rewarm-r35.log
```

## STEP 3 — GENUINE FAILS

### 48021:53859 — R35 ✅ implemented on main
- `isNoDeterminableFrontageSitus` + disclosed orientation decline = cert PASS
- Tests: r35-no-frontage-orientation.test.ts (3/3)

### 48021:28855 + 48021:30857 — TWO-BLIND (A16/A17)
Log: `_scratch/phase-c-two-blind-28855-30857.log`

| Parcel | R32 (measurer B) | facesAnswer | setback/orient (measurer A) | Verdict |
|---|---|---|---|---|
| 48021:28855 | PASS | PASS (Laurel) | PASS when candidate present | R32+orientation OK on stored envelope |
| 48021:30857 | PASS | PASS (Carter) | PASS when candidate present | same |

**Finding:** Both promoted recipe 1.0.0; R32 remeasure on stored inset **passes**; facesAnswer **passes**. Recomputed `computeWarmCandidateFromBoundary` returns **empty** (inset ring null) in blind script — cert harness may be failing on **setback/orientation engine verify when warmCandidate recompute diverges from stored promote**. NOT a layer-23 data disagreement. **STOP for review** after re-sweep if still failing — likely cert should use stored envelope path when recompute empty but promote exists.

28855 note: layer-23 shows MU sliver (splitZoneMinorZones) — dominant SF-1; R26 cohort correct.

## STEP 4 — RE-SWEEP SF-1 ✅ CLEAN

```
1919/1919 pass-or-decline | fail: 0 | honestDecline: 551 | staleResidue: 0
blockPass: true
Log: _scratch/phase-c-sf1-resweep-final.log
```

SF-1 block mechanical gate **PASSED**. GC → MU → RR → PI → IND blocks unblocked.

## STEP 5 — 18 removed parcels
Grade in GC/MU/RR/IND blocks (STEP 6); flat file was 3/18 pass.

## GC block bootstrap + re-warm ✅ (2026-08-03 ~14:31 UTC)

Roster before: **23** → after: **253** (`setback-rule-districtCode+honest-decline`).

| Step | promoted | processed |
|---|---|---|
| Bootstrap (no `--dominant-district-cohort`) | 245 | 583 |
| Re-warm (`--dominant-district-cohort --upsert-ledger`) | 247 | 253 |

Cert: **253/253** | fail: 0 | honestDecline: 6 | staleResidue: 0 | **blockPass: true**

Sample: `48021:103281` (201 CHILDERS DR STE)

Logs: `_scratch/phase-c-gc-bootstrap-warm.log`, `phase-c-gc-rewarm.log`, `phase-c-gc-cert-final.log`
