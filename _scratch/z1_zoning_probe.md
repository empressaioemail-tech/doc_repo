# Z1 zoning probe sweep — scratch

## GROUND-TRUTH
- 2026-08-12T16:45Z: staged before = elgin-tx 3209 + smithville-tx 91
- 2026-08-12 close: probed 466 / found 104 / absent 362 / staged cities 103 / rows 318832
- Close: `_inbox/2026-08-12_Z1_zoning_probe_sweep_close.json`
- CP1 PASS_WITH_CONSTRAINTS; CP2 PASS_WITH_FINDINGS
- houston-tx SEARCHED-AND-ABSENT (0 rows); missing city_key = 0; empty tier = 0

## LESSON
- NO_SEED_UNPROBED_DEEP is the same defect as zoning_gis NULL — never accept it at close; reopen until SEARCHED-AND-ABSENT or URL
- Normalize id priority: FID/OBJECTID_1 before OBJECTID (Galveston class); null-geom skip — still needs eng main promote
- Roster seed URLs can be stale 404s (Dallas/Plano) — rediscover live OpenData endpoints

## OPEN
- Stage san-antonio-tx (~766k) size-bounded follow-on
- Promote normalize.ts patch to hauska-engine main
- Re-probe Dallas major misses (Frisco, Denton, Allen, …) if alternate hosts appear

## DEAD-END
- Temple City CA AGOL layer as Temple TX zoning — rejected false positive
