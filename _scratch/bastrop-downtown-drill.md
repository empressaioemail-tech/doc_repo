# Bastrop downtown drill scratch

## GROUND-TRUTH (2026-07-30T12:35Z planner)

- Merge chain #185/#186/#187 DONE; hotfix #188 merged (numeric layer 23 fields).
- Substrate DATABASE_URL = hauska-prod secret `DATABASE_URL`; TXGIO = `CORTEX_DATABASE_URL`.
- Windows: `NODE_OPTIONS=--use-system-ca` required for Node fetch to AGOL/BCAD.

## STEP4 warm v2 (2026-07-30)

- 32/36 promoted verify-pass; 4 verify-fail: 34065, 34785, 34881, 39282 (null inset / geometry — not F1–F4 anchors).
- All evidence anchors promoted: 34081, 34841, 34089, 34073, 105054.
- 34081 zoning restamped P-5 → GC before warm.

## LESSON

Live layer 23 returns `FrontSetback_` as **esriFieldTypeDouble**, not string — adapter pickString must coerce numbers. Stale boundary-primitive edges carried ordinance-chart 30ft insets; `--force-repromote` must skip primitive read.

## OPEN

- Area-sweep **FAIL** 24/36 (2026-07-30 live PE + L23). Results: `_scratch/bastrop-downtown-area-sweep-results.json`; audit: `_inbox/2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit.md`.
- Blockers: PE `side_interior_ft`/`side_corner_ft` card split (8 SF-1 corner lots incl F4 105054); stale PE on 34065/34881; declined envelope 34785/39282; GC rear 34769.
- Operator city-screen cross-check on evidence anchors owed.
