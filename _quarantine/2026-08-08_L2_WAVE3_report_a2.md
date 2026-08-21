---
id: 2026-08-08_L2_WAVE3_report
title: L2 Wave 3 Texas parcel acquisition results
date: 2026-08-08
status: halted
owner: wave3-execution-planner
---

# L2 Wave 3 results

Wave 3 HALTED. Attempted 24, landed 22, failed 2, not started 12. Total rows among landed counties: 1583661. Wall clock: 1818s.
Halt reason: dry-run exit 1

Baseline distinct: 159. Final distinct: 181. Wave3 SQL row total: 1583661. Bosque rows: 0. Donley rows: 0.

## Repo / environment

- Worktree: `P:/legacy-design-tools-wave0`
- HEAD: `de4fc8b906730f3a036b2c9494b22c1acfb03916`
- TLS: `NODE_OPTIONS=--use-system-ca + library browser UA`
- Concurrency: batches of 8; Bosque + five metros individual
- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (authorized Wave 3 ingest; no test runner; atoms Neon untouched during this wave).

### Verbatim git status

```
## main...origin/main
?? .tmp_nfhl_48.zip
?? .tmp_wave0_tls/
?? lib/db/scripts/.tmp_after_migrate_check.mjs
?? lib/db/scripts/.tmp_before_check.mjs
```

## Per-county

### 48493 Wilson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=28827 delete=0 insert=37604 (9457ms)
- Apply1: features=28827 delete=0 insert=37604 (193705ms)
- Apply2 (idempotent): features=28827 delete=37604 insert=37604 (159566ms)
- Rows after: 37604; store delta bytes: 634740736; wall: 369.6s
- Geometry: outside_texas=0; seam_factor=1.3045; multipolygon_pct=0.73; bbox={"min_west_lng":-98.407,"max_east_lng":-97.7285,"min_south_lat":28.8825,"max_north_lat":29.4423}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=37604; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48493.json`

### 48203 Harrison (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=50995 delete=0 insert=60341 (14840ms)
- Apply1: features=50995 delete=0 insert=60341 (166436ms)
- Apply2 (idempotent): features=50995 delete=60341 insert=60341 (151043ms)
- Rows after: 60341; store delta bytes: 518848512; wall: 341.3s
- Geometry: outside_texas=0; seam_factor=1.1833; multipolygon_pct=1.67; bbox={"min_west_lng":-94.7086,"max_east_lng":-94.0428,"min_south_lat":32.3265,"max_north_lat":32.7923}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=60341; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48203.json`

### 48299 Llano (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=38879 delete=0 insert=45860 (12746ms)
- Apply1: features=38879 delete=0 insert=45860 (131123ms)
- Apply2 (idempotent): features=38879 delete=45860 insert=45860 (160162ms)
- Rows after: 45860; store delta bytes: 464158720; wall: 315.3s
- Geometry: outside_texas=0; seam_factor=1.1796; multipolygon_pct=0.83; bbox={"min_west_lng":-98.9669,"max_east_lng":-98.3481,"min_south_lat":30.4858,"max_north_lat":30.9297}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=45860; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48299.json`

### 48451 Tom Green (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=58686 delete=0 insert=68571 (16087ms)
- Apply1: features=58686 delete=0 insert=68571 (156513ms)
- Apply2 (idempotent): features=58686 delete=68571 insert=68571 (149136ms)
- Rows after: 68571; store delta bytes: 501399552; wall: 332.1s
- Geometry: outside_texas=0; seam_factor=1.1684; multipolygon_pct=0.66; bbox={"min_west_lng":-101.269,"max_east_lng":-100.1112,"min_south_lat":31.0863,"max_north_lat":31.7055}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=68571; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48451.json`

### 48361 Orange (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=50337 delete=0 insert=56128 (14628ms)
- Apply1: features=50337 delete=0 insert=56128 (152702ms)
- Apply2 (idempotent): features=50337 delete=56128 insert=56128 (136423ms)
- Rows after: 56128; store delta bytes: 461266944; wall: 314.2s
- Geometry: outside_texas=0; seam_factor=1.115; multipolygon_pct=0.56; bbox={"min_west_lng":-94.1179,"max_east_lng":-93.6895,"min_south_lat":29.9666,"max_north_lat":30.2442}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=56128; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48361.json`

### 48349 Navarro (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=46167 delete=0 insert=57926 (14312ms)
- Apply1: features=46167 delete=0 insert=57926 (409670ms)
- Apply2 (idempotent): features=46167 delete=57926 insert=57926 (231587ms)
- Rows after: 57926; store delta bytes: 804732928; wall: 665.8s
- Geometry: outside_texas=0; seam_factor=1.2547; multipolygon_pct=0.52; bbox={"min_west_lng":-96.8963,"max_east_lng":-96.051,"min_south_lat":31.7966,"max_north_lat":32.3289}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=57926; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48349.json`

### 48053 Burnet (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=50138 delete=0 insert=59785 (14666ms)
- Apply1: features=50138 delete=0 insert=59785 (173364ms)
- Apply2 (idempotent): features=50138 delete=59785 insert=59785 (149326ms)
- Rows after: 59785; store delta bytes: 524894208; wall: 345.8s
- Geometry: outside_texas=0; seam_factor=1.1924; multipolygon_pct=1.54; bbox={"min_west_lng":-98.4594,"max_east_lng":-97.8275,"min_south_lat":30.4262,"max_north_lat":31.0349}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=59785; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48053.json`

### 48221 Hood (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=51275 delete=0 insert=57169 (17203ms)
- Apply1: features=51275 delete=0 insert=57169 (173848ms)
- Apply2 (idempotent): features=51275 delete=57169 insert=57169 (137761ms)
- Rows after: 57169; store delta bytes: 516407296; wall: 339.4s
- Geometry: outside_texas=0; seam_factor=1.1149; multipolygon_pct=0.38; bbox={"min_west_lng":-98.0789,"max_east_lng":-97.6064,"min_south_lat":32.2344,"max_north_lat":32.5655}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=57169; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48221.json`

### 48471 Walker (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=35582 delete=0 insert=42463 (12669ms)
- Apply1: features=35582 delete=0 insert=42463 (194090ms)
- Apply2 (idempotent): features=35582 delete=42463 insert=42463 (190429ms)
- Rows after: 42463; store delta bytes: 1103749120; wall: 407.9s
- Geometry: outside_texas=0; seam_factor=1.1934; multipolygon_pct=1.28; bbox={"min_west_lng":-95.8628,"max_east_lng":-95.3281,"min_south_lat":30.5043,"max_north_lat":31.0581}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=42463; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48471.json`

### 48485 Wichita (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=58742 delete=0 insert=65490 (18055ms)
- Apply1: features=58742 delete=0 insert=65490 (223150ms)
- Apply2 (idempotent): features=58742 delete=65490 insert=65490 (176842ms)
- Rows after: 65490; store delta bytes: 1160314880; wall: 428.8s
- Geometry: outside_texas=0; seam_factor=1.1149; multipolygon_pct=0.51; bbox={"min_west_lng":-98.9532,"max_east_lng":-98.422,"min_south_lat":33.834,"max_north_lat":34.2019}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=65490; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48485.json`

### 48329 Midland (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=75645 delete=0 insert=83887 (21304ms)
- Apply1: features=75645 delete=0 insert=83887 (217272ms)
- Apply2 (idempotent): features=75645 delete=83887 insert=83887 (164719ms)
- Rows after: 83887; store delta bytes: 1129160704; wall: 414.9s
- Geometry: outside_texas=0; seam_factor=1.109; multipolygon_pct=0.11; bbox={"min_west_lng":-102.2876,"max_east_lng":-101.7714,"min_south_lat":31.6513,"max_north_lat":32.1294}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=83887; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48329.json`

### 48373 Polk (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=60178 delete=0 insert=69616 (16876ms)
- Apply1: features=60178 delete=0 insert=69616 (193669ms)
- Apply2 (idempotent): features=60178 delete=69616 insert=69616 (183748ms)
- Rows after: 69616; store delta bytes: 1097654272; wall: 405.8s
- Geometry: outside_texas=0; seam_factor=1.1568; multipolygon_pct=1.16; bbox={"min_west_lng":-95.2069,"max_east_lng":-94.5389,"min_south_lat":30.479,"max_north_lat":31.1693}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=69616; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48373.json`

### 48005 Angelina (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=60693 delete=0 insert=70445 (18430ms)
- Apply1: features=60693 delete=0 insert=70445 (436919ms)
- Apply2 (idempotent): features=60693 delete=70445 insert=70445 (163140ms)
- Rows after: 70445; store delta bytes: 1218535424; wall: 628.8s
- Geometry: outside_texas=0; seam_factor=1.1607; multipolygon_pct=0; bbox={"min_west_lng":-95.0053,"max_east_lng":-94.128,"min_south_lat":31.0261,"max_north_lat":31.5272}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=70445; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48005.json`

### 48135 Ector (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=75891 delete=0 insert=83202 (21906ms)
- Apply1: features=75891 delete=0 insert=83202 (197098ms)
- Apply2 (idempotent): features=75891 delete=83202 insert=83202 (163422ms)
- Rows after: 83202; store delta bytes: 1065762816; wall: 395.5s
- Geometry: outside_texas=0; seam_factor=1.0963; multipolygon_pct=0.12; bbox={"min_west_lng":-102.7979,"max_east_lng":-102.2867,"min_south_lat":31.6508,"max_north_lat":32.0875}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=83202; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48135.json`

### 48041 Brazos (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=74666 delete=0 insert=82874 (20505ms)
- Apply1: features=74666 delete=0 insert=82874 (218310ms)
- Apply2 (idempotent): features=74666 delete=82874 insert=82874 (177012ms)
- Rows after: 82874; store delta bytes: 1153286144; wall: 424.4s
- Geometry: outside_texas=0; seam_factor=1.1099; multipolygon_pct=0.67; bbox={"min_west_lng":-96.601,"max_east_lng":-96.0802,"min_south_lat":30.3315,"max_north_lat":30.9736}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=82874; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48041.json`

### 48231 Hunt (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=69728 delete=0 insert=79774 (19962ms)
- Apply1: features=69728 delete=0 insert=79774 (233677ms)
- Apply2 (idempotent): features=69728 delete=79774 insert=79774 (159034ms)
- Rows after: 79774; store delta bytes: 1151803392; wall: 423.7s
- Geometry: outside_texas=0; seam_factor=1.1441; multipolygon_pct=0.24; bbox={"min_west_lng":-96.2982,"max_east_lng":-95.8584,"min_south_lat":32.8367,"max_north_lat":33.4098}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=79774; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48231.json`

### 48183 Gregg (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=77816 delete=0 insert=83706 (20118ms)
- Apply1: features=77816 delete=0 insert=83706 (142095ms)
- Apply2 (idempotent): features=77816 delete=83706 insert=83706 (147672ms)
- Rows after: 83706; store delta bytes: 114982912; wall: 322s
- Geometry: outside_texas=0; seam_factor=1.0757; multipolygon_pct=0.05; bbox={"min_west_lng":-94.9895,"max_east_lng":-94.5793,"min_south_lat":32.3617,"max_north_lat":32.6658}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=83706; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48183.json`

### 48441 Taylor (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=70598 delete=0 insert=79469 (19726ms)
- Apply1: features=70598 delete=0 insert=79469 (142101ms)
- Apply2 (idempotent): features=70598 delete=79469 insert=79469 (172081ms)
- Rows after: 79469; store delta bytes: 117645312; wall: 345.7s
- Geometry: outside_texas=0; seam_factor=1.1257; multipolygon_pct=0.01; bbox={"min_west_lng":-100.1519,"max_east_lng":-99.623,"min_south_lat":32.0806,"max_north_lat":32.6244}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=79469; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48441.json`

### 48171 Gillespie (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=32351 delete=0 insert=40372 (11713ms)
- Apply1: features=32351 delete=0 insert=40372 (106510ms)
- Apply2 (idempotent): features=32351 delete=40372 insert=40372 (199822ms)
- Rows after: 40372; store delta bytes: 115638272; wall: 328.6s
- Geometry: outside_texas=0; seam_factor=1.2479; multipolygon_pct=0.84; bbox={"min_west_lng":-99.304,"max_east_lng":-98.5874,"min_south_lat":30.1344,"max_north_lat":30.4998}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=40372; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48171.json`

### 48181 Grayson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=89348 delete=0 insert=100911 (20301ms)
- Apply1: features=89348 delete=0 insert=100911 (183837ms)
- Apply2 (idempotent): features=89348 delete=100911 insert=100911 (151123ms)
- Rows after: 100911; store delta bytes: 119734272; wall: 367.1s
- Geometry: outside_texas=0; seam_factor=1.1294; multipolygon_pct=0.93; bbox={"min_west_lng":-96.9488,"max_east_lng":-96.3776,"min_south_lat":33.3966,"max_north_lat":33.9596}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=100911; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48181.json`

### 48213 Henderson (batch)

- Pass: false; Halted: true (dry-run exit 1)
- Dry: loaded_before=null features=null delete=null insert=null (9073ms)
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48213.json`

### 48479 Webb (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=98291 delete=0 insert=113524 (23466ms)
- Apply1: features=98291 delete=0 insert=113524 (227436ms)
- Apply2 (idempotent): features=98291 delete=113524 insert=113524 (172396ms)
- Rows after: 113524; store delta bytes: 158400512; wall: 437s
- Geometry: outside_texas=0; seam_factor=1.155; multipolygon_pct=0.55; bbox={"min_west_lng":-100.2116,"max_east_lng":-98.7974,"min_south_lat":27.26,"max_north_lat":28.212}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=113524; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48479.json`

### 48303 Lubbock (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=135112 delete=0 insert=144544 (31042ms)
- Apply1: features=135112 delete=0 insert=144544 (255650ms)
- Apply2 (idempotent): features=135112 delete=144544 insert=144544 (204018ms)
- Rows after: 144544; store delta bytes: 183386112; wall: 504.8s
- Geometry: outside_texas=0; seam_factor=1.0698; multipolygon_pct=0.7; bbox={"min_west_lng":-102.0858,"max_east_lng":-101.5568,"min_south_lat":33.3889,"max_north_lat":33.8305}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=144544; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48303.json`

### 48291 Liberty (batch)

- Pass: false; Halted: true (dry-run exit 1)
- Dry: loaded_before=null features=null delete=null insert=null (9887ms)
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48291.json`

### 48245 Jefferson (batch)

Not started after upstream halt: wave_halted_upstream

### 48423 Smith (batch)

Not started after upstream halt: wave_halted_upstream

### 48167 Galveston (batch)

Not started after upstream halt: wave_halted_upstream

### 48355 Nueces (batch)

Not started after upstream halt: wave_halted_upstream

### 48061 Cameron (batch)

Not started after upstream halt: wave_halted_upstream

### 48215 Hidalgo (batch)

Not started after upstream halt: wave_halted_upstream

### 48035 Bosque (solo_bosque)

Not started after upstream halt: wave_halted_upstream

### 48039 Brazoria (solo_metro)

Not started after upstream halt: wave_halted_upstream

### 48141 El Paso (solo_metro)

Not started after upstream halt: wave_halted_upstream

### 48339 Montgomery (solo_metro)

Not started after upstream halt: wave_halted_upstream

### 48157 Fort Bend (solo_metro)

Not started after upstream halt: wave_halted_upstream

### 48201 Harris (solo_metro)

Not started after upstream halt: wave_halted_upstream

## Seam summary

Wave3 landed seams mean=1.1546, min=1.0698, max=1.3045.

## Cost

cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API

## Findings / defects

- FINDING W3-HALT: wave stopped — dry-run exit 1
- FINDING W3-COST: cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API
