# Phase C corrected path — session ground-truth (2026-08-03)

## Factory changes (OPERATE/EXTEND, not fork)

- **GENERALIZED** `packages/engine-core/scripts/block13-cert-grade.mjs` — `--roster-from=block13|query|file`, per-parcel layer-23 answer key in query mode, R33 `streetNamesMatchForFacesAnswer`, honest-decline = pass.
- **RETIRED** `bastrop-district-cert-grade.mjs` — stub exits 2, points to block13-cert-grade.
- **WARM BATCH** `depth-warm-bastrop-batch.mjs` — `--dominant-district-cohort` (R26); `--layer23-city-cohort` deprecated → dominant-district.
- **ROSTER** `bastrop-dominant-district-roster.mjs` — setback-rule.districtCode + honest-decline, minus Block-13 quarantine.

## Block-13 regression (MUST stay 7/7)

```
score.pass=7 fail=0 total=7 blockPass=true certRestore="7/7 — CERT-RESTORE ELIGIBLE"
Log: _scratch/phase-c-block13-regression.log
```

## SF-1 corrected sweep (dominant-district roster + proven harness)

```
rosterSize: 1919 (was 2466 layer-23 field roster)
score.pass: 1892
score.fail: 27
score.honestDecline: 530
score.staleResidue: 24
score.label: "1892/1919"
blockPass: false
Log: _scratch/phase-c-corrected-sf1-cert.log
```

### 27 fails breakdown

**24 stale-residue** — promoted envelope but recipeVersion != 1.0.0 (need `--force-overwrite` re-warm on SF-1 dominant cohort):
48021:31100, 36611, 51569, 51697, 51698, 51699, 51702, 51769, 51771, 51773, 51802, 51803, 51805, 51806, 51811, 81858, 84968, 84975, 85035, 8741972, 8741973, 8741974, 90638, 90641

**3 genuine gate fails** (two-blind-measure candidates):
- 48021:28855 — setbacks engineVerifyPass=false + engineOrientPass=false (inset OK)
- 48021:30857 — setbacks engineVerifyPass=false + engineOrientPass=false (inset OK)
- 48021:53859 — facesAnswer=false (answerFrontStreet="LOT BEHIND 2208 PECAN", resolved Water Street)

## Prior 28 SF-1 fails — artifact vs real

| Category | Count | Detail |
|---|---|---|
| Cohort artifact (NOT in SF-1 dominant roster) | 18 | Removed from wrong block; grade in GC/MU/RR blocks |
| Was district-fail, now PASS in SF-1 sweep | 5 | 59805, 84944, 84981, 85046, 87958 |
| Still FAIL in SF-1 (genuine) | 2 | 28855, 30857 |
| Not in prior 28 / new | 1 | 53859 (orientation) |

Prior 28 IDs NOT in SF-1 dominant roster (18): 34457, 32882, 36129, 47763, 34785, 34097, 36249, 48028, 31604, 32252, 48030, 32216, 48021, 48016, 47890, 34155, 8729065, 8729066

## OPEN (before SF-1 blockPass + GC block)

1. Re-warm SF-1 dominant cohort with `--force-overwrite` to clear 24 stale-residue.
2. Two-blind-measure 28855, 30857, 53859 — if confirmed data findings → honest-decline or fix.
3. Grade 18 removed parcels in their dominant-district blocks (GC/MU/RR cert sweeps).
4. Merge generalized harness + warm cohort changes to engine main (currently local only).
