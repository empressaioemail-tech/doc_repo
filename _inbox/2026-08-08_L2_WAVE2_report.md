---
id: 2026-08-08_L2_WAVE2_report
title: L2 Wave 2 Texas parcel acquisition results
date: 2026-08-08
status: complete
owner: wave2-sub-planner
---

# L2 Wave 2 results

Wave 2 COMPLETE. Attempted 50, landed 50, failed 0, not started 0. Total rows among landed counties: 748871. Wall clock: 654s.

Baseline distinct county_fips: 29. Final distinct: 79. Wave2 SQL row total: 748871. Expected distinct if all 50 land: 79.

## Repo / environment

- Worktree: `P:/legacy-design-tools-wave0`
- HEAD: `fb6a42b22d7855b08d6d5de228f41eba298e2629`
- TLS: `NODE_OPTIONS=--use-system-ca`
- Concurrency: batches of 8 (PK-disjoint on txgio_parcel)
- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (SELECT + authorized ingest only; no test runner).

### Verbatim git status

```
## main...origin/main
?? .tmp_wave0_tls/
```

## Per-county

### 48357 Ochiltree

- Pass: true; Halted: false
- Dry: loaded_before=no features=6521 delete=0 insert=9398 (4876ms)
- Apply1: features=6521 delete=0 insert=9398 (31012ms)
- Apply2 (idempotent): features=6521 delete=9398 insert=9398 (16646ms)
- Rows after: 9398; store delta bytes: 137379840; wall: 59.3s
- Geometry: outside_texas=0; seam_factor=1.4412; multipolygon_pct=1.96; bbox={"min_west_lng":-101.0858,"max_east_lng":-100.546,"min_south_lat":36.0565,"max_north_lat":36.5}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=9398; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48357.json`

### 48495 Winkler

- Pass: true; Halted: false
- Dry: loaded_before=no features=7234 delete=0 insert=12598 (5113ms)
- Apply1: features=7234 delete=0 insert=12598 (38286ms)
- Apply2 (idempotent): features=7234 delete=12598 insert=12598 (22245ms)
- Rows after: 12598; store delta bytes: 162529280; wall: 70.5s
- Geometry: outside_texas=0; seam_factor=1.7415; multipolygon_pct=6.99; bbox={"min_west_lng":-103.3275,"max_east_lng":-102.7985,"min_south_lat":31.6513,"max_north_lat":32.087}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=12598; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48495.json`

### 48069 Castro

- Pass: true; Halted: false
- Dry: loaded_before=no features=6466 delete=0 insert=9937 (4933ms)
- Apply1: features=6466 delete=0 insert=9937 (32170ms)
- Apply2 (idempotent): features=6466 delete=9937 insert=9937 (18896ms)
- Rows after: 9937; store delta bytes: 148283392; wall: 61.7s
- Geometry: outside_texas=0; seam_factor=1.5368; multipolygon_pct=0.09; bbox={"min_west_lng":-102.5258,"max_east_lng":-101.9981,"min_south_lat":34.3131,"max_north_lat":34.7489}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=9937; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48069.json`

### 48111 Dallam

- Pass: true; Halted: false
- Dry: loaded_before=no features=6271 delete=0 insert=10988 (5096ms)
- Apply1: features=6271 delete=0 insert=10988 (33988ms)
- Apply2 (idempotent): features=6271 delete=10988 insert=10988 (18773ms)
- Rows after: 10988; store delta bytes: 151560192; wall: 63.1s
- Geometry: outside_texas=0; seam_factor=1.7522; multipolygon_pct=3.35; bbox={"min_west_lng":-103.0426,"max_east_lng":-102.1529,"min_south_lat":36.0507,"max_north_lat":36.5015}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10988; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48111.json`

### 48295 Lipscomb

- Pass: true; Halted: false
- Dry: loaded_before=no features=11030 delete=0 insert=13939 (5168ms)
- Apply1: features=11030 delete=0 insert=13939 (18257ms)
- Apply2 (idempotent): features=11030 delete=13939 insert=13939 (17835ms)
- Rows after: 13939; store delta bytes: 98893824; wall: 48.7s
- Geometry: outside_texas=0; seam_factor=1.2637; multipolygon_pct=0.02; bbox={"min_west_lng":-100.5467,"max_east_lng":-100.0004,"min_south_lat":36.0553,"max_north_lat":36.4999}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=13939; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48295.json`

### 48437 Swisher

- Pass: true; Halted: false
- Dry: loaded_before=no features=6657 delete=0 insert=9867 (4696ms)
- Apply1: features=6657 delete=0 insert=9867 (32084ms)
- Apply2 (idempotent): features=6657 delete=9867 insert=9867 (17540ms)
- Rows after: 9867; store delta bytes: 145006592; wall: 60.6s
- Geometry: outside_texas=0; seam_factor=1.4822; multipolygon_pct=1.95; bbox={"min_west_lng":-101.9981,"max_east_lng":-101.4709,"min_south_lat":34.3124,"max_north_lat":34.749}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=9867; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48437.json`

### 48501 Yoakum

- Pass: true; Halted: false
- Dry: loaded_before=no features=7291 delete=0 insert=11470 (5076ms)
- Apply1: features=7291 delete=0 insert=11470 (38511ms)
- Apply2 (idempotent): features=7291 delete=11470 insert=11470 (21330ms)
- Rows after: 11470; store delta bytes: 162529280; wall: 69.9s
- Geometry: outside_texas=0; seam_factor=1.5732; multipolygon_pct=5.69; bbox={"min_west_lng":-103.0643,"max_east_lng":-102.594,"min_south_lat":32.9585,"max_north_lat":33.3884}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=11470; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48501.json`

### 48079 Cochran

- Pass: true; Halted: false
- Dry: loaded_before=no features=5735 delete=0 insert=9369 (5085ms)
- Apply1: features=5735 delete=0 insert=9369 (34234ms)
- Apply2 (idempotent): features=5735 delete=9369 insert=9369 (17741ms)
- Rows after: 9369; store delta bytes: 150470656; wall: 62.3s
- Geometry: outside_texas=0; seam_factor=1.6337; multipolygon_pct=5.41; bbox={"min_west_lng":-103.0564,"max_east_lng":-102.5937,"min_south_lat":33.3872,"max_north_lat":33.8255}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=9369; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48079.json`

### 48047 Brooks

- Pass: true; Halted: false
- Dry: loaded_before=no features=5739 delete=0 insert=8330 (4351ms)
- Apply1: features=5739 delete=0 insert=8330 (36953ms)
- Apply2 (idempotent): features=5739 delete=8330 insert=8330 (26592ms)
- Rows after: 8330; store delta bytes: 185155584; wall: 72.9s
- Geometry: outside_texas=0; seam_factor=1.4515; multipolygon_pct=2.46; bbox={"min_west_lng":-98.5366,"max_east_lng":-97.9854,"min_south_lat":26.7809,"max_north_lat":27.2652}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=8330; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48047.json`

### 48169 Garza

- Pass: true; Halted: false
- Dry: loaded_before=no features=6583 delete=0 insert=10455 (4051ms)
- Apply1: features=6583 delete=0 insert=10455 (27181ms)
- Apply2 (idempotent): features=6583 delete=10455 insert=10455 (23511ms)
- Rows after: 10455; store delta bytes: 164667392; wall: 60.3s
- Geometry: outside_texas=0; seam_factor=1.5882; multipolygon_pct=2.57; bbox={"min_west_lng":-101.6304,"max_east_lng":-101.0239,"min_south_lat":32.961,"max_north_lat":33.4034}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10455; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48169.json`

### 48023 Baylor

- Pass: true; Halted: false
- Dry: loaded_before=no features=6349 delete=0 insert=10268 (4092ms)
- Apply1: features=6349 delete=0 insert=10268 (30862ms)
- Apply2 (idempotent): features=6349 delete=10268 insert=10268 (26695ms)
- Rows after: 10268; store delta bytes: 181321728; wall: 66.7s
- Geometry: outside_texas=0; seam_factor=1.6173; multipolygon_pct=4.77; bbox={"min_west_lng":-99.4755,"max_east_lng":-98.9532,"min_south_lat":33.3974,"max_north_lat":33.8343}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10268; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48023.json`

### 48435 Sutton

- Pass: true; Halted: false
- Dry: loaded_before=no features=5905 delete=0 insert=10745 (3985ms)
- Apply1: features=5905 delete=0 insert=10745 (23400ms)
- Apply2 (idempotent): features=5905 delete=10745 insert=10745 (17734ms)
- Rows after: 10745; store delta bytes: 139001856; wall: 51.9s
- Geometry: outside_texas=0; seam_factor=1.8196; multipolygon_pct=5.15; bbox={"min_west_lng":-100.961,"max_east_lng":-100.1162,"min_south_lat":30.2874,"max_north_lat":30.7104}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10745; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48435.json`

### 48369 Parmer

- Pass: true; Halted: false
- Dry: loaded_before=no features=6606 delete=0 insert=10111 (4287ms)
- Apply1: features=6606 delete=0 insert=10111 (29660ms)
- Apply2 (idempotent): features=6606 delete=10111 insert=10111 (25617ms)
- Rows after: 10111; store delta bytes: 177512448; wall: 64.4s
- Geometry: outside_texas=0; seam_factor=1.5306; multipolygon_pct=1.86; bbox={"min_west_lng":-103.0438,"max_east_lng":-102.5251,"min_south_lat":34.3095,"max_north_lat":34.7479}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10111; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48369.json`

### 48335 Mitchell

- Pass: true; Halted: false
- Dry: loaded_before=no features=8743 delete=0 insert=14066 (4253ms)
- Apply1: features=8743 delete=0 insert=14066 (27032ms)
- Apply2 (idempotent): features=8743 delete=14066 insert=14066 (22813ms)
- Rows after: 14066; store delta bytes: 162897920; wall: 59.4s
- Geometry: outside_texas=0; seam_factor=1.6088; multipolygon_pct=0.87; bbox={"min_west_lng":-101.1837,"max_east_lng":-100.6602,"min_south_lat":32.0854,"max_north_lat":32.5285}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=14066; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48335.json`

### 48445 Terry

- Pass: true; Halted: false
- Dry: loaded_before=no features=9113 delete=0 insert=12506 (4802ms)
- Apply1: features=9113 delete=0 insert=12506 (22525ms)
- Apply2 (idempotent): features=9113 delete=12506 insert=12506 (20032ms)
- Rows after: 12506; store delta bytes: 145940480; wall: 53.5s
- Geometry: outside_texas=0; seam_factor=1.3723; multipolygon_pct=0.02; bbox={"min_west_lng":-102.5953,"max_east_lng":-102.0754,"min_south_lat":32.9587,"max_north_lat":33.3888}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=12506; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48445.json`

### 48081 Coke

- Pass: true; Halted: false
- Dry: loaded_before=no features=8271 delete=0 insert=13628 (5292ms)
- Apply1: features=8271 delete=0 insert=13628 (34199ms)
- Apply2 (idempotent): features=8271 delete=13628 insert=13628 (21219ms)
- Rows after: 13628; store delta bytes: 180346880; wall: 65.6s
- Geometry: outside_texas=0; seam_factor=1.6477; multipolygon_pct=0.83; bbox={"min_west_lng":-100.8253,"max_east_lng":-100.234,"min_south_lat":31.6928,"max_north_lat":32.0858}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=13628; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48081.json`

### 48275 Knox

- Pass: true; Halted: false
- Dry: loaded_before=no features=6408 delete=0 insert=10151 (4193ms)
- Apply1: features=6408 delete=0 insert=10151 (30385ms)
- Apply2 (idempotent): features=6408 delete=10151 insert=10151 (25792ms)
- Rows after: 10151; store delta bytes: 184172544; wall: 66s
- Geometry: outside_texas=0; seam_factor=1.5841; multipolygon_pct=3.06; bbox={"min_west_lng":-99.9964,"max_east_lng":-99.4724,"min_south_lat":33.3959,"max_north_lat":33.836}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=10151; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48275.json`

### 48095 Concho

- Pass: true; Halted: false
- Dry: loaded_before=no features=8034 delete=0 insert=12624 (4133ms)
- Apply1: features=8034 delete=0 insert=12624 (34501ms)
- Apply2 (idempotent): features=8034 delete=12624 insert=12624 (33358ms)
- Rows after: 12624; store delta bytes: 215703552; wall: 77.1s
- Geometry: outside_texas=0; seam_factor=1.5713; multipolygon_pct=1.29; bbox={"min_west_lng":-100.1154,"max_east_lng":-99.6012,"min_south_lat":31.087,"max_north_lat":31.5806}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=12624; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48095.json`

### 48153 Floyd

- Pass: true; Halted: false
- Dry: loaded_before=no features=13217 delete=0 insert=17253 (5324ms)
- Apply1: features=13217 delete=0 insert=17253 (32460ms)
- Apply2 (idempotent): features=13217 delete=17253 insert=17253 (22127ms)
- Rows after: 17253; store delta bytes: 182935552; wall: 65.8s
- Geometry: outside_texas=0; seam_factor=1.3054; multipolygon_pct=0.71; bbox={"min_west_lng":-101.5651,"max_east_lng":-101.0412,"min_south_lat":33.8305,"max_north_lat":34.3126}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=17253; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48153.json`

### 48371 Pecos

- Pass: true; Halted: false
- Dry: loaded_before=no features=14720 delete=0 insert=31569 (5524ms)
- Apply1: features=14720 delete=0 insert=31569 (65431ms)
- Apply2 (idempotent): features=14720 delete=31569 insert=31569 (38530ms)
- Rows after: 31569; store delta bytes: 240779264; wall: 114.5s
- Geometry: outside_texas=0; seam_factor=2.1446; multipolygon_pct=0.29; bbox={"min_west_lng":-103.5829,"max_east_lng":-101.771,"min_south_lat":30.0591,"max_north_lat":31.37}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=31569; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48371.json`

### 48443 Terrell

- Pass: true; Halted: false
- Dry: loaded_before=no features=5562 delete=0 insert=12446 (4005ms)
- Apply1: features=5562 delete=0 insert=12446 (27135ms)
- Apply2 (idempotent): features=5562 delete=12446 insert=12446 (26494ms)
- Rows after: 12446; store delta bytes: 176332800; wall: 63.5s
- Geometry: outside_texas=0; seam_factor=2.2377; multipolygon_pct=10.36; bbox={"min_west_lng":-102.567,"max_east_lng":-101.6463,"min_south_lat":29.7789,"max_north_lat":30.6583}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=12446; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48443.json`

### 48003 Andrews

- Pass: true; Halted: false
- Dry: loaded_before=no features=10522 delete=0 insert=15867 (4901ms)
- Apply1: features=10522 delete=0 insert=15867 (35296ms)
- Apply2 (idempotent): features=10522 delete=15867 insert=15867 (36392ms)
- Rows after: 15867; store delta bytes: 220921856; wall: 81.7s
- Geometry: outside_texas=0; seam_factor=1.508; multipolygon_pct=3.51; bbox={"min_west_lng":-103.0648,"max_east_lng":-102.2015,"min_south_lat":32.0858,"max_north_lat":32.5283}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=15867; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48003.json`

### 48319 Mason

- Pass: true; Halted: false
- Dry: loaded_before=no features=9096 delete=0 insert=14081 (4531ms)
- Apply1: features=9096 delete=0 insert=14081 (42633ms)
- Apply2 (idempotent): features=9096 delete=14081 insert=14081 (24122ms)
- Rows after: 14081; store delta bytes: 215465984; wall: 76.7s
- Geometry: outside_texas=0; seam_factor=1.548; multipolygon_pct=6.78; bbox={"min_west_lng":-99.4847,"max_east_lng":-98.963,"min_south_lat":30.498,"max_north_lat":30.941}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=14081; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48319.json`

### 48385 Real

- Pass: true; Halted: false
- Dry: loaded_before=no features=8272 delete=0 insert=11918 (4340ms)
- Apply1: features=8272 delete=0 insert=11918 (28591ms)
- Apply2 (idempotent): features=8272 delete=11918 insert=11918 (34424ms)
- Rows after: 11918; store delta bytes: 205193216; wall: 73.2s
- Geometry: outside_texas=0; seam_factor=1.4408; multipolygon_pct=3.52; bbox={"min_west_lng":-100.0643,"max_east_lng":-99.6025,"min_south_lat":29.6237,"max_north_lat":30.0824}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=11918; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48385.json`

### 48333 Mills

- Pass: true; Halted: false
- Dry: loaded_before=no features=9025 delete=0 insert=13455 (4668ms)
- Apply1: features=9025 delete=0 insert=13455 (31327ms)
- Apply2 (idempotent): features=9025 delete=13455 insert=13455 (23363ms)
- Rows after: 13455; store delta bytes: 171876352; wall: 66.1s
- Geometry: outside_texas=0; seam_factor=1.4909; multipolygon_pct=1.82; bbox={"min_west_lng":-98.9936,"max_east_lng":-98.2665,"min_south_lat":31.2309,"max_north_lat":31.7232}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=13455; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48333.json`

### 48117 Deaf Smith

- Pass: true; Halted: false
- Dry: loaded_before=no features=10901 delete=0 insert=16176 (5268ms)
- Apply1: features=10901 delete=0 insert=16176 (36168ms)
- Apply2 (idempotent): features=10901 delete=16176 insert=16176 (27781ms)
- Rows after: 16176; store delta bytes: 202932224; wall: 75.9s
- Geometry: outside_texas=0; seam_factor=1.4839; multipolygon_pct=1.47; bbox={"min_west_lng":-103.0431,"max_east_lng":-102.1665,"min_south_lat":34.746,"max_north_lat":35.1869}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=16176; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48117.json`

### 48507 Zavala

- Pass: true; Halted: false
- Dry: loaded_before=no features=9744 delete=0 insert=15010 (4616ms)
- Apply1: features=9744 delete=0 insert=15010 (40037ms)
- Apply2 (idempotent): features=9744 delete=15010 insert=15010 (41519ms)
- Rows after: 15010; store delta bytes: 241541120; wall: 91.1s
- Geometry: outside_texas=0; seam_factor=1.5404; multipolygon_pct=1.71; bbox={"min_west_lng":-100.114,"max_east_lng":-99.4083,"min_south_lat":28.6405,"max_north_lat":29.0913}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=15010; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48507.json`

### 48341 Moore

- Pass: true; Halted: false
- Dry: loaded_before=no features=12256 delete=0 insert=15888 (5518ms)
- Apply1: features=12256 delete=0 insert=15888 (45933ms)
- Apply2 (idempotent): features=12256 delete=15888 insert=15888 (30719ms)
- Rows after: 15888; store delta bytes: 238182400; wall: 88.4s
- Geometry: outside_texas=0; seam_factor=1.2963; multipolygon_pct=1.69; bbox={"min_west_lng":-102.1647,"max_east_lng":-101.6224,"min_south_lat":35.6186,"max_north_lat":36.0557}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=15888; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48341.json`

### 48487 Wilbarger

- Pass: true; Halted: false
- Dry: loaded_before=no features=11894 delete=0 insert=17593 (5608ms)
- Apply1: features=11894 delete=0 insert=17593 (45875ms)
- Apply2 (idempotent): features=11894 delete=17593 insert=17593 (29267ms)
- Rows after: 17593; store delta bytes: 234897408; wall: 86.6s
- Geometry: outside_texas=0; seam_factor=1.4791; multipolygon_pct=0.38; bbox={"min_west_lng":-99.489,"max_east_lng":-98.9523,"min_south_lat":33.8339,"max_north_lat":34.4587}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=17593; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48487.json`

### 48379 Rains

- Pass: true; Halted: false
- Dry: loaded_before=no features=12301 delete=0 insert=14622 (5157ms)
- Apply1: features=12301 delete=0 insert=14622 (33891ms)
- Apply2 (idempotent): features=12301 delete=14622 insert=14622 (36534ms)
- Rows after: 14622; store delta bytes: 220430336; wall: 81.8s
- Geometry: outside_texas=0; seam_factor=1.1887; multipolygon_pct=0.41; bbox={"min_west_lng":-95.9698,"max_east_lng":-95.6352,"min_south_lat":32.7114,"max_north_lat":32.9826}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=14622; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48379.json`

### 48271 Kinney

- Pass: true; Halted: false
- Dry: loaded_before=no features=11010 delete=0 insert=16794 (4939ms)
- Apply1: features=11010 delete=0 insert=16794 (46026ms)
- Apply2 (idempotent): features=11010 delete=16794 insert=16794 (28798ms)
- Rows after: 16794; store delta bytes: 231342080; wall: 84.9s
- Geometry: outside_texas=0; seam_factor=1.5253; multipolygon_pct=2.98; bbox={"min_west_lng":-100.7968,"max_east_lng":-100.1091,"min_south_lat":29.0839,"max_north_lat":29.6321}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=16794; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48271.json`

### 48059 Callahan

- Pass: true; Halted: false
- Dry: loaded_before=no features=12064 delete=0 insert=16262 (5781ms)
- Apply1: features=12064 delete=0 insert=16262 (38162ms)
- Apply2 (idempotent): features=12064 delete=16262 insert=16262 (42093ms)
- Rows after: 16262; store delta bytes: 241541120; wall: 91.1s
- Geometry: outside_texas=0; seam_factor=1.348; multipolygon_pct=1.97; bbox={"min_west_lng":-99.6314,"max_east_lng":-99.1144,"min_south_lat":32.0795,"max_north_lat":32.5151}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=16262; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48059.json`

### 48429 Stephens

- Pass: true; Halted: false
- Dry: loaded_before=no features=12647 delete=0 insert=18440 (5032ms)
- Apply1: features=12647 delete=0 insert=18440 (49126ms)
- Apply2 (idempotent): features=12647 delete=18440 insert=18440 (43209ms)
- Rows after: 18440; store delta bytes: 245964800; wall: 102.5s
- Geometry: outside_texas=0; seam_factor=1.4581; multipolygon_pct=1.97; bbox={"min_west_lng":-99.136,"max_east_lng":-98.5221,"min_south_lat":32.444,"max_north_lat":32.9876}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=18440; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48429.json`

### 48417 Shackelford

- Pass: true; Halted: false
- Dry: loaded_before=no features=5542 delete=0 insert=9052 (4171ms)
- Apply1: features=5542 delete=0 insert=9052 (49510ms)
- Apply2 (idempotent): features=5542 delete=9052 insert=9052 (39942ms)
- Rows after: 9052; store delta bytes: 239599616; wall: 99.4s
- Geometry: outside_texas=0; seam_factor=1.6333; multipolygon_pct=6.62; bbox={"min_west_lng":-99.6123,"max_east_lng":-99.0958,"min_south_lat":32.5147,"max_north_lat":32.9572}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=9052; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48417.json`

### 48283 La Salle

- Pass: true; Halted: false
- Dry: loaded_before=no features=10341 delete=0 insert=19363 (4472ms)
- Apply1: features=10341 delete=0 insert=19363 (55813ms)
- Apply2 (idempotent): features=10341 delete=19363 insert=19363 (35254ms)
- Rows after: 19363; store delta bytes: 243146752; wall: 101s
- Geometry: outside_texas=0; seam_factor=1.8724; multipolygon_pct=6.99; bbox={"min_west_lng":-99.408,"max_east_lng":-98.7972,"min_south_lat":28.0303,"max_north_lat":28.6474}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19363; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48283.json`

### 48425 Somervell

- Pass: true; Halted: false
- Dry: loaded_before=no features=6823 delete=0 insert=8589 (4317ms)
- Apply1: features=6823 delete=0 insert=8589 (21799ms)
- Apply2 (idempotent): features=6823 delete=8589 insert=8589 (34029ms)
- Rows after: 8589; store delta bytes: 148963328; wall: 66.9s
- Geometry: outside_texas=0; seam_factor=1.2588; multipolygon_pct=0.76; bbox={"min_west_lng":-97.9456,"max_east_lng":-97.6135,"min_south_lat":32.0873,"max_north_lat":32.3226}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=8589; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48425.json`

### 48313 Madison

- Pass: true; Halted: false
- Dry: loaded_before=no features=10307 delete=0 insert=14101 (4926ms)
- Apply1: features=10307 delete=0 insert=14101 (45135ms)
- Apply2 (idempotent): features=10307 delete=14101 insert=14101 (24783ms)
- Rows after: 14101; store delta bytes: 186449920; wall: 81.6s
- Geometry: outside_texas=0; seam_factor=1.3681; multipolygon_pct=1.82; bbox={"min_west_lng":-96.241,"max_east_lng":-95.6122,"min_south_lat":30.8263,"max_north_lat":31.0942}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=14101; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48313.json`

### 48505 Zapata

- Pass: true; Halted: false
- Dry: loaded_before=no features=12623 delete=0 insert=18460 (5011ms)
- Apply1: features=12623 delete=0 insert=18460 (40779ms)
- Apply2 (idempotent): features=12623 delete=18460 insert=18460 (35615ms)
- Rows after: 18460; store delta bytes: 205815808; wall: 87.8s
- Geometry: outside_texas=0; seam_factor=1.4624; multipolygon_pct=2.02; bbox={"min_west_lng":-99.4538,"max_east_lng":-98.9542,"min_south_lat":26.5771,"max_north_lat":27.3191}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=18460; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48505.json`

### 48279 Lamb

- Pass: true; Halted: false
- Dry: loaded_before=no features=13871 delete=0 insert=18795 (5272ms)
- Apply1: features=13871 delete=0 insert=18795 (61754ms)
- Apply2 (idempotent): features=13871 delete=18795 insert=18795 (34583ms)
- Rows after: 18795; store delta bytes: 250191872; wall: 106.6s
- Geometry: outside_texas=0; seam_factor=1.355; multipolygon_pct=0.82; bbox={"min_west_lng":-102.7013,"max_east_lng":-101.9877,"min_south_lat":33.8247,"max_north_lat":34.4053}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=18795; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48279.json`

### 48399 Runnels

- Pass: true; Halted: false
- Dry: loaded_before=no features=15008 delete=0 insert=21762 (5439ms)
- Apply1: features=15008 delete=0 insert=21762 (59494ms)
- Apply2 (idempotent): features=15008 delete=21762 insert=21762 (35374ms)
- Rows after: 21762; store delta bytes: 249741312; wall: 105.5s
- Geometry: outside_texas=0; seam_factor=1.45; multipolygon_pct=2.23; bbox={"min_west_lng":-100.2356,"max_east_lng":-99.7132,"min_south_lat":31.5767,"max_north_lat":32.0849}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=21762; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48399.json`

### 48175 Goliad

- Pass: true; Halted: false
- Dry: loaded_before=no features=10314 delete=0 insert=15303 (5126ms)
- Apply1: features=10314 delete=0 insert=15303 (46218ms)
- Apply2 (idempotent): features=10314 delete=15303 insert=15303 (47575ms)
- Rows after: 15303; store delta bytes: 93175808; wall: 104.7s
- Geometry: outside_texas=0; seam_factor=1.4837; multipolygon_pct=3.05; bbox={"min_west_lng":-97.7785,"max_east_lng":-97.1536,"min_south_lat":28.3887,"max_north_lat":28.9255}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=15303; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48175.json`

### 48009 Archer

- Pass: true; Halted: false
- Dry: loaded_before=no features=9653 delete=0 insert=14015 (4483ms)
- Apply1: features=9653 delete=0 insert=14015 (39991ms)
- Apply2 (idempotent): features=9653 delete=14015 insert=14015 (56574ms)
- Rows after: 14015; store delta bytes: 93757440; wall: 106.4s
- Geometry: outside_texas=0; seam_factor=1.4519; multipolygon_pct=2.64; bbox={"min_west_lng":-98.9537,"max_east_lng":-98.3912,"min_south_lat":33.3947,"max_north_lat":33.8366}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=14015; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48009.json`

### 48127 Dimmit

- Pass: true; Halted: false
- Dry: loaded_before=no features=15542 delete=0 insert=20939 (7634ms)
- Apply1: features=15542 delete=0 insert=20939 (47335ms)
- Apply2 (idempotent): features=15542 delete=20939 insert=20939 (46157ms)
- Rows after: 20939; store delta bytes: 93773824; wall: 106.9s
- Geometry: outside_texas=0; seam_factor=1.3473; multipolygon_pct=3.55; bbox={"min_west_lng":-100.1144,"max_east_lng":-99.3943,"min_south_lat":28.1979,"max_north_lat":28.6482}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=20939; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48127.json`

### 48415 Scurry

- Pass: true; Halted: false
- Dry: loaded_before=no features=13849 delete=0 insert=18580 (5152ms)
- Apply1: features=13849 delete=0 insert=18580 (47346ms)
- Apply2 (idempotent): features=13849 delete=18580 insert=18580 (41763ms)
- Rows after: 18580; store delta bytes: 89866240; wall: 101s
- Geometry: outside_texas=0; seam_factor=1.3416; multipolygon_pct=3.1; bbox={"min_west_lng":-101.1819,"max_east_lng":-100.594,"min_south_lat":32.4799,"max_north_lat":33.1056}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=18580; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48415.json`

### 48179 Gray

- Pass: true; Halted: false
- Dry: loaded_before=no features=16251 delete=0 insert=19868 (5658ms)
- Apply1: features=16251 delete=0 insert=19868 (46859ms)
- Apply2 (idempotent): features=16251 delete=19868 insert=19868 (32659ms)
- Rows after: 19868; store delta bytes: 83730432; wall: 91.8s
- Geometry: outside_texas=0; seam_factor=1.2226; multipolygon_pct=0.52; bbox={"min_west_lng":-101.0862,"max_east_lng":-100.5384,"min_south_lat":35.1793,"max_north_lat":35.6206}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19868; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48179.json`

### 48083 Coleman

- Pass: true; Halted: false
- Dry: loaded_before=no features=12839 delete=0 insert=19005 (5233ms)
- Apply1: features=12839 delete=0 insert=19005 (48030ms)
- Apply2 (idempotent): features=12839 delete=19005 insert=19005 (49592ms)
- Rows after: 19005; store delta bytes: 94109696; wall: 108.4s
- Geometry: outside_texas=0; seam_factor=1.4803; multipolygon_pct=4.25; bbox={"min_west_lng":-99.7221,"max_east_lng":-99.196,"min_south_lat":31.4099,"max_north_lat":32.0821}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19005; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48083.json`

### 48389 Reeves

- Pass: true; Halted: false
- Dry: loaded_before=no features=14975 delete=0 insert=27385 (5511ms)
- Apply1: features=14975 delete=0 insert=27385 (72209ms)
- Apply2 (idempotent): features=14975 delete=27385 insert=27385 (40810ms)
- Rows after: 27385; store delta bytes: 95764480; wall: 123.9s
- Geometry: outside_texas=0; seam_factor=1.8287; multipolygon_pct=9.94; bbox={"min_west_lng":-104.1018,"max_east_lng":-103.0207,"min_south_lat":30.7682,"max_north_lat":32.0003}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=27385; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48389.json`

### 48131 Duval

- Pass: true; Halted: false
- Dry: loaded_before=no features=14772 delete=0 insert=22568 (5634ms)
- Apply1: features=14772 delete=0 insert=22568 (58608ms)
- Apply2 (idempotent): features=14772 delete=22568 insert=22568 (42888ms)
- Rows after: 22568; store delta bytes: 94666752; wall: 112.6s
- Geometry: outside_texas=0; seam_factor=1.5278; multipolygon_pct=1.88; bbox={"min_west_lng":-98.8049,"max_east_lng":-98.2239,"min_south_lat":27.2625,"max_north_lat":28.0578}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=22568; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48131.json`

### 48031 Blanco

- Pass: true; Halted: false
- Dry: loaded_before=no features=14269 delete=0 insert=19334 (4410ms)
- Apply1: features=14269 delete=0 insert=19334 (26260ms)
- Apply2 (idempotent): features=14269 delete=19334 insert=19334 (25335ms)
- Rows after: 19334; store delta bytes: 8159232; wall: 60.9s
- Geometry: outside_texas=0; seam_factor=1.355; multipolygon_pct=0.55; bbox={"min_west_lng":-98.6248,"max_east_lng":-98.1245,"min_south_lat":29.9337,"max_north_lat":30.5024}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19334; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48031.json`

### 48063 Camp

- Pass: true; Halted: false
- Dry: loaded_before=no features=11652 delete=0 insert=13928 (4057ms)
- Apply1: features=11652 delete=0 insert=13928 (20162ms)
- Apply2 (idempotent): features=11652 delete=13928 insert=13928 (20396ms)
- Rows after: 13928; store delta bytes: 7692288; wall: 49.6s
- Geometry: outside_texas=0; seam_factor=1.1953; multipolygon_pct=2.36; bbox={"min_west_lng":-95.1545,"max_east_lng":-94.7198,"min_south_lat":32.8894,"max_north_lat":33.0774}
- Bbox verify (StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)): matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=13928; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE2_48063.json`

## Seam summary

Kenedy reference seam 4.46 (metro blend 1.07). Wave2 landed seams mean=1.5169, min=1.1887, max=2.2377. Elevated rural (>=2): 2; near-metro (<2): 48.

## Cost

cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API

## Findings / defects

- FINDING W2-SEAM: Wave2 landed seam mean 1.5169 (range 1.1887-2.2377); elevated_rural_ge_2=2/50.
- FINDING W2-COST: cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API
