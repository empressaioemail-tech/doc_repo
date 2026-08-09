---
id: 2026-08-08_L2_WAVE3_report
title: L2 Wave 3 Texas parcel acquisition results
date: 2026-08-08
status: halted
owner: wave3-execution-planner
---

# L2 Wave 3 results

Wave 3 HALTED. Attempted 80, landed 79, failed 1, not started 36. Total rows among landed counties: 2814411. Wall clock: 3618s.
Halt reason: dry-run exit 1

Baseline distinct: 80. Final distinct: 159. Wave3 SQL row total: 2814411. Bosque rows: 0. Donley rows: 0.

## Repo / environment

- Worktree: `P:/legacy-design-tools-wave0`
- HEAD: `de4fc8b906730f3a036b2c9494b22c1acfb03916`
- TLS: `NODE_OPTIONS=--use-system-ca + library browser UA`
- Concurrency: batches of 8; Bosque + five metros individual
- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (authorized Wave 3 ingest; no test runner; atoms Neon untouched during this wave).

### Verbatim git status

```
## main...origin/main
?? .tmp_wave0_tls/
```

## Per-county

### 48387 Red River (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=13728 delete=0 insert=19955 (6755ms)
- Apply1: features=13728 delete=0 insert=19955 (53077ms)
- Apply2 (idempotent): features=13728 delete=19955 insert=19955 (47873ms)
- Rows after: 19955; store delta bytes: 208478208; wall: 113.7s
- Geometry: outside_texas=0; seam_factor=1.4536; multipolygon_pct=3.6; bbox={"min_west_lng":-95.3141,"max_east_lng":-94.7323,"min_south_lat":33.3176,"max_north_lat":33.9614}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19955; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48387.json`

### 48267 Kimble (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=9556 delete=0 insert=15246 (7183ms)
- Apply1: features=9556 delete=0 insert=15246 (43656ms)
- Apply2 (idempotent): features=9556 delete=15246 insert=15246 (28404ms)
- Rows after: 15246; store delta bytes: 125263872; wall: 86.1s
- Geometry: outside_texas=0; seam_factor=1.5954; multipolygon_pct=6.86; bbox={"min_west_lng":-100.117,"max_east_lng":-99.302,"min_south_lat":30.2867,"max_north_lat":30.7113}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=15246; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48267.json`

### 48165 Gaines (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16576 delete=0 insert=22371 (7529ms)
- Apply1: features=16576 delete=0 insert=22371 (53115ms)
- Apply2 (idempotent): features=16576 delete=22371 insert=22371 (61221ms)
- Rows after: 22371; store delta bytes: 235544576; wall: 127.5s
- Geometry: outside_texas=0; seam_factor=1.3496; multipolygon_pct=1.76; bbox={"min_west_lng":-103.065,"max_east_lng":-102.2029,"min_south_lat":32.5222,"max_north_lat":32.9643}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=22371; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48165.json`

### 48297 Live Oak (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16839 delete=0 insert=23352 (8569ms)
- Apply1: features=16839 delete=0 insert=23352 (58628ms)
- Apply2 (idempotent): features=16839 delete=23352 insert=23352 (42774ms)
- Rows after: 23352; store delta bytes: 215949312; wall: 116.2s
- Geometry: outside_texas=0; seam_factor=1.3868; multipolygon_pct=1.46; bbox={"min_west_lng":-98.3377,"max_east_lng":-97.8089,"min_south_lat":28.0344,"max_north_lat":28.7865}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=23352; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48297.json`

### 48137 Edwards (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=9948 delete=0 insert=19388 (5762ms)
- Apply1: features=9948 delete=0 insert=19388 (58067ms)
- Apply2 (idempotent): features=9948 delete=19388 insert=19388 (54909ms)
- Rows after: 19388; store delta bytes: 232062976; wall: 124.3s
- Geometry: outside_texas=0; seam_factor=1.9489; multipolygon_pct=4.19; bbox={"min_west_lng":-100.7004,"max_east_lng":-99.7539,"min_south_lat":29.6212,"max_north_lat":30.2931}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19388; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48137.json`

### 48219 Hockley (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=17242 delete=0 insert=23763 (8832ms)
- Apply1: features=17242 delete=0 insert=23763 (62838ms)
- Apply2 (idempotent): features=17242 delete=23763 insert=23763 (38957ms)
- Rows after: 23763; store delta bytes: 217251840; wall: 116.7s
- Geometry: outside_texas=0; seam_factor=1.3782; multipolygon_pct=1.84; bbox={"min_west_lng":-102.6167,"max_east_lng":-102.076,"min_south_lat":33.3843,"max_north_lat":33.8264}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=23763; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48219.json`

### 48489 Willacy (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=13989 delete=0 insert=17207 (9859ms)
- Apply1: features=13989 delete=0 insert=17207 (75810ms)
- Apply2 (idempotent): features=13989 delete=17207 insert=17207 (37825ms)
- Rows after: 17207; store delta bytes: 235773952; wall: 129s
- Geometry: outside_texas=0; seam_factor=1.23; multipolygon_pct=2.21; bbox={"min_west_lng":-98.0043,"max_east_lng":-97.2184,"min_south_lat":26.2994,"max_north_lat":26.6118}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=17207; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48489.json`

### 48281 Lampasas (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16541 delete=0 insert=21841 (9311ms)
- Apply1: features=16541 delete=0 insert=21841 (71399ms)
- Apply2 (idempotent): features=16541 delete=21841 insert=21841 (40791ms)
- Rows after: 21841; store delta bytes: 235544576; wall: 127.5s
- Geometry: outside_texas=0; seam_factor=1.3204; multipolygon_pct=1.25; bbox={"min_west_lng":-98.5696,"max_east_lng":-97.8996,"min_south_lat":31.0294,"max_north_lat":31.4637}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=21841; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48281.json`

### 48229 Hudspeth (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23954 delete=0 insert=38359 (7790ms)
- Apply1: features=23954 delete=0 insert=38359 (55866ms)
- Apply2 (idempotent): features=23954 delete=38359 insert=38359 (57795ms)
- Rows after: 38359; store delta bytes: 356638720; wall: 128s
- Geometry: outside_texas=0; seam_factor=1.6014; multipolygon_pct=0.98; bbox={"min_west_lng":-105.9981,"max_east_lng":-104.9073,"min_south_lat":30.6294,"max_north_lat":32.0026}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=38359; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48229.json`

### 48395 Robertson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16935 delete=0 insert=24016 (6352ms)
- Apply1: features=16935 delete=0 insert=24016 (66399ms)
- Apply2 (idempotent): features=16935 delete=24016 insert=24016 (42285ms)
- Rows after: 24016; store delta bytes: 341590016; wall: 121.5s
- Geometry: outside_texas=0; seam_factor=1.4181; multipolygon_pct=0.86; bbox={"min_west_lng":-96.83,"max_east_lng":-96.2289,"min_south_lat":30.6947,"max_north_lat":31.3514}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=24016; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48395.json`

### 48159 Franklin (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16540 delete=0 insert=19275 (6186ms)
- Apply1: features=16540 delete=0 insert=19275 (32722ms)
- Apply2 (idempotent): features=16540 delete=19275 insert=19275 (29989ms)
- Rows after: 19275; store delta bytes: 199483392; wall: 76s
- Geometry: outside_texas=0; seam_factor=1.1654; multipolygon_pct=1.16; bbox={"min_west_lng":-95.3097,"max_east_lng":-95.1236,"min_south_lat":32.9613,"max_north_lat":33.3894}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=19275; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48159.json`

### 48503 Young (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16353 delete=0 insert=22197 (6455ms)
- Apply1: features=16353 delete=0 insert=22197 (62301ms)
- Apply2 (idempotent): features=16353 delete=22197 insert=22197 (48961ms)
- Rows after: 22197; store delta bytes: 348553216; wall: 124.1s
- Geometry: outside_texas=0; seam_factor=1.3574; multipolygon_pct=2.85; bbox={"min_west_lng":-98.9541,"max_east_lng":-98.4204,"min_south_lat":32.9524,"max_north_lat":33.3975}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=22197; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48503.json`

### 48273 Kleberg (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=14909 delete=0 insert=17918 (5867ms)
- Apply1: features=14909 delete=0 insert=17918 (74904ms)
- Apply2 (idempotent): features=14909 delete=17918 insert=17918 (51091ms)
- Rows after: 17918; store delta bytes: 370245632; wall: 137.3s
- Geometry: outside_texas=0; seam_factor=1.2018; multipolygon_pct=1.61; bbox={"min_west_lng":-98.0598,"max_east_lng":-97.223,"min_south_lat":27.209,"max_north_lat":27.6359}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=17918; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48273.json`

### 48227 Howard (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=20654 delete=0 insert=25491 (7081ms)
- Apply1: features=20654 delete=0 insert=25491 (38188ms)
- Apply2 (idempotent): features=20654 delete=25491 insert=25491 (56991ms)
- Rows after: 25491; store delta bytes: 302637056; wall: 110.7s
- Geometry: outside_texas=0; seam_factor=1.2342; multipolygon_pct=1.52; bbox={"min_west_lng":-101.695,"max_east_lng":-101.1745,"min_south_lat":32.0871,"max_north_lat":32.5252}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=25491; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48227.json`

### 48193 Hamilton (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=14253 delete=0 insert=20720 (6012ms)
- Apply1: features=14253 delete=0 insert=20720 (62587ms)
- Apply2 (idempotent): features=14253 delete=20720 insert=20720 (51639ms)
- Rows after: 20720; store delta bytes: 353861632; wall: 126.3s
- Geometry: outside_texas=0; seam_factor=1.4537; multipolygon_pct=1.2; bbox={"min_west_lng":-98.4636,"max_east_lng":-97.7662,"min_south_lat":31.4164,"max_north_lat":32.018}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=20720; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48193.json`

### 48239 Jackson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=18453 delete=0 insert=26041 (6621ms)
- Apply1: features=18453 delete=0 insert=26041 (69568ms)
- Apply2 (idempotent): features=18453 delete=26041 insert=26041 (51958ms)
- Rows after: 26041; store delta bytes: 368402432; wall: 134.7s
- Geometry: outside_texas=0; seam_factor=1.4112; multipolygon_pct=5.6; bbox={"min_west_lng":-96.9386,"max_east_lng":-96.3087,"min_south_lat":28.6744,"max_north_lat":29.2635}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=26041; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48239.json`

### 48119 Delta (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=6461 delete=0 insert=8472 (4911ms)
- Apply1: features=6461 delete=0 insert=8472 (59395ms)
- Apply2 (idempotent): features=6461 delete=8472 insert=8472 (61523ms)
- Rows after: 8472; store delta bytes: 391159808; wall: 131.8s
- Geometry: outside_texas=0; seam_factor=1.3113; multipolygon_pct=2.69; bbox={"min_west_lng":-95.8635,"max_east_lng":-95.3065,"min_south_lat":33.2183,"max_north_lat":33.4954}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=8472; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48119.json`

### 48287 Lee (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=16090 delete=0 insert=22661 (6085ms)
- Apply1: features=16090 delete=0 insert=22661 (66189ms)
- Apply2 (idempotent): features=16090 delete=22661 insert=22661 (56635ms)
- Rows after: 22661; store delta bytes: 402087936; wall: 135.7s
- Geometry: outside_texas=0; seam_factor=1.4084; multipolygon_pct=2.42; bbox={"min_west_lng":-97.3345,"max_east_lng":-96.6406,"min_south_lat":30.032,"max_north_lat":30.5571}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=22661; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48287.json`

### 48315 Marion (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=19841 delete=0 insert=23932 (6553ms)
- Apply1: features=19841 delete=0 insert=23932 (54763ms)
- Apply2 (idempotent): features=19841 delete=23932 insert=23932 (62103ms)
- Rows after: 23932; store delta bytes: 383827968; wall: 129.8s
- Geometry: outside_texas=0; seam_factor=1.2062; multipolygon_pct=4.24; bbox={"min_west_lng":-94.7024,"max_east_lng":-94.0429,"min_south_lat":32.693,"max_north_lat":32.8828}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=23932; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48315.json`

### 48403 Sabine (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23352 delete=0 insert=27345 (6909ms)
- Apply1: features=23352 delete=0 insert=27345 (60179ms)
- Apply2 (idempotent): features=23352 delete=27345 insert=27345 (67117ms)
- Rows after: 27345; store delta bytes: 413605888; wall: 141.3s
- Geometry: outside_texas=0; seam_factor=1.171; multipolygon_pct=0.76; bbox={"min_west_lng":-94.075,"max_east_lng":-93.6083,"min_south_lat":31.135,"max_north_lat":31.6169}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=27345; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48403.json`

### 48043 Brewster (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=20287 delete=0 insert=35619 (9085ms)
- Apply1: features=20287 delete=0 insert=35619 (501743ms)
- Apply2 (idempotent): features=20287 delete=35619 insert=35619 (444460ms)
- Rows after: 35619; store delta bytes: 1576198144; wall: 961.6s
- Geometry: outside_texas=0; seam_factor=1.7558; multipolygon_pct=3.97; bbox={"min_west_lng":-103.8007,"max_east_lng":-102.3226,"min_south_lat":28.9716,"max_north_lat":30.6657}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=35619; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48043.json`

### 48093 Comanche (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=17580 delete=0 insert=24454 (6902ms)
- Apply1: features=17580 delete=0 insert=24454 (67187ms)
- Apply2 (idempotent): features=17580 delete=24454 insert=24454 (58366ms)
- Rows after: 24454; store delta bytes: 409616384; wall: 138.7s
- Geometry: outside_texas=0; seam_factor=1.391; multipolygon_pct=1.39; bbox={"min_west_lng":-98.9244,"max_east_lng":-98.1566,"min_south_lat":31.684,"max_north_lat":32.3873}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=24454; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48093.json`

### 48419 Shelby (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=21378 delete=0 insert=28928 (6793ms)
- Apply1: features=21378 delete=0 insert=28928 (72837ms)
- Apply2 (idempotent): features=21378 delete=28928 insert=28928 (63659ms)
- Rows after: 28928; store delta bytes: 430391296; wall: 152.3s
- Geometry: outside_texas=0; seam_factor=1.3532; multipolygon_pct=0.97; bbox={"min_west_lng":-94.5114,"max_east_lng":-93.7945,"min_south_lat":31.5694,"max_north_lat":31.9827}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=28928; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48419.json`

### 48285 Lavaca (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=19767 delete=0 insert=27671 (6767ms)
- Apply1: features=19767 delete=0 insert=27671 (57245ms)
- Apply2 (idempotent): features=19767 delete=27671 insert=27671 (74389ms)
- Rows after: 27671; store delta bytes: 424632320; wall: 144.5s
- Geometry: outside_texas=0; seam_factor=1.3999; multipolygon_pct=0.41; bbox={"min_west_lng":-97.2401,"max_east_lng":-96.5604,"min_south_lat":29.0627,"max_north_lat":29.6327}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=27671; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48285.json`

### 48253 Jones (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=27732 delete=0 insert=34011 (10616ms)
- Apply1: features=27732 delete=0 insert=34011 (85535ms)
- Apply2 (idempotent): features=27732 delete=34011 insert=34011 (75620ms)
- Rows after: 34011; store delta bytes: 64659456; wall: 177.9s
- Geometry: outside_texas=0; seam_factor=1.2264; multipolygon_pct=0.85; bbox={"min_west_lng":-100.153,"max_east_lng":-99.6085,"min_south_lat":32.5149,"max_north_lat":32.9602}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=34011; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48253.json`

### 48323 Maverick (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=26048 delete=0 insert=31977 (7440ms)
- Apply1: features=26048 delete=0 insert=31977 (82216ms)
- Apply2 (idempotent): features=26048 delete=31977 insert=31977 (58447ms)
- Rows after: 31977; store delta bytes: 62947328; wall: 156.5s
- Geometry: outside_texas=0; seam_factor=1.2276; multipolygon_pct=0.72; bbox={"min_west_lng":-100.6676,"max_east_lng":-100.1114,"min_south_lat":28.1968,"max_north_lat":29.0863}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=31977; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48323.json`

### 48293 Limestone (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=21727 delete=0 insert=29793 (6700ms)
- Apply1: features=21727 delete=0 insert=29793 (75165ms)
- Apply2 (idempotent): features=21727 delete=29793 insert=29793 (74762ms)
- Rows after: 29793; store delta bytes: 63791104; wall: 164.6s
- Geometry: outside_texas=0; seam_factor=1.3712; multipolygon_pct=2.21; bbox={"min_west_lng":-96.9322,"max_east_lng":-96.2402,"min_south_lat":31.2219,"max_north_lat":31.8149}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29793; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48293.json`

### 48145 Falls (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=18581 delete=0 insert=25261 (7874ms)
- Apply1: features=18581 delete=0 insert=25261 (67892ms)
- Apply2 (idempotent): features=18581 delete=25261 insert=25261 (46812ms)
- Rows after: 25261; store delta bytes: 59637760; wall: 130.4s
- Geometry: outside_texas=0; seam_factor=1.3595; multipolygon_pct=2.55; bbox={"min_west_lng":-97.2781,"max_east_lng":-96.5969,"min_south_lat":30.9862,"max_north_lat":31.5223}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=25261; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48145.json`

### 48025 Bee (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23864 delete=0 insert=30586 (7125ms)
- Apply1: features=23864 delete=0 insert=30586 (76317ms)
- Apply2 (idempotent): features=23864 delete=30586 insert=30586 (60857ms)
- Rows after: 30586; store delta bytes: 62513152; wall: 152.5s
- Geometry: outside_texas=0; seam_factor=1.2817; multipolygon_pct=0.18; bbox={"min_west_lng":-98.0896,"max_east_lng":-97.3608,"min_south_lat":28.115,"max_north_lat":28.7201}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=30586; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48025.json`

### 48249 Jim Wells (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=27944 delete=0 insert=34716 (8479ms)
- Apply1: features=27944 delete=0 insert=34716 (81111ms)
- Apply2 (idempotent): features=27944 delete=34716 insert=34716 (67279ms)
- Rows after: 34716; store delta bytes: 63791104; wall: 164.8s
- Geometry: outside_texas=0; seam_factor=1.2423; multipolygon_pct=0.91; bbox={"min_west_lng":-98.2385,"max_east_lng":-97.7891,"min_south_lat":27.2611,"max_north_lat":28.059}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=34716; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48249.json`

### 48089 Colorado (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=22756 delete=0 insert=30159 (7899ms)
- Apply1: features=22756 delete=0 insert=30159 (87862ms)
- Apply2 (idempotent): features=22756 delete=30159 insert=30159 (65544ms)
- Rows after: 30159; store delta bytes: 64028672; wall: 168.5s
- Geometry: outside_texas=0; seam_factor=1.3253; multipolygon_pct=2.79; bbox={"min_west_lng":-96.8766,"max_east_lng":-96.1756,"min_south_lat":29.2478,"max_north_lat":29.9615}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=30159; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48089.json`

### 48051 Burleson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=27282 delete=0 insert=34931 (7458ms)
- Apply1: features=27282 delete=0 insert=34931 (99981ms)
- Apply2 (idempotent): features=27282 delete=34931 insert=34931 (65448ms)
- Rows after: 34931; store delta bytes: 64716800; wall: 179.5s
- Geometry: outside_texas=0; seam_factor=1.2804; multipolygon_pct=1.16; bbox={"min_west_lng":-96.9638,"max_east_lng":-96.2712,"min_south_lat":30.2952,"max_north_lat":30.7304}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=34931; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48051.json`

### 48185 Grimes (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=27711 delete=0 insert=34953 (9066ms)
- Apply1: features=27711 delete=0 insert=34953 (82132ms)
- Apply2 (idempotent): features=27711 delete=34953 insert=34953 (69774ms)
- Rows after: 34953; store delta bytes: 278659072; wall: 167.7s
- Geometry: outside_texas=0; seam_factor=1.2613; multipolygon_pct=1.28; bbox={"min_west_lng":-96.1881,"max_east_lng":-95.8009,"min_south_lat":30.2286,"max_north_lat":30.8634}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=34953; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48185.json`

### 48189 Hale (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=19108 delete=0 insert=23944 (7991ms)
- Apply1: features=19108 delete=0 insert=23944 (48422ms)
- Apply2 (idempotent): features=19108 delete=23944 insert=23944 (84057ms)
- Rows after: 23944; store delta bytes: 220536832; wall: 149.1s
- Geometry: outside_texas=0; seam_factor=1.2531; multipolygon_pct=1.15; bbox={"min_west_lng":-102.0899,"max_east_lng":-101.5632,"min_south_lat":33.8245,"max_north_lat":34.3131}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=23944; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48189.json`

### 48007 Aransas (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=26690 delete=0 insert=29377 (8793ms)
- Apply1: features=26690 delete=0 insert=29377 (112913ms)
- Apply2 (idempotent): features=26690 delete=29377 insert=29377 (62873ms)
- Rows after: 29377; store delta bytes: 319373312; wall: 190.9s
- Geometry: outside_texas=0; seam_factor=1.1007; multipolygon_pct=2.61; bbox={"min_west_lng":-97.2595,"max_east_lng":-96.7932,"min_south_lat":27.8351,"max_north_lat":28.3213}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29377; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48007.json`

### 48463 Uvalde (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=21722 delete=0 insert=29953 (8196ms)
- Apply1: features=21722 delete=0 insert=29953 (112379ms)
- Apply2 (idempotent): features=21722 delete=29953 insert=29953 (54893ms)
- Rows after: 29953; store delta bytes: 309297152; wall: 182.8s
- Geometry: outside_texas=0; seam_factor=1.3789; multipolygon_pct=2.07; bbox={"min_west_lng":-100.113,"max_east_lng":-99.4111,"min_south_lat":29.0861,"max_north_lat":29.6449}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29953; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48463.json`

### 48449 Tom Green (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=20833 delete=0 insert=25009 (8026ms)
- Apply1: features=20833 delete=0 insert=25009 (84395ms)
- Apply2 (idempotent): features=20833 delete=25009 insert=25009 (76466ms)
- Rows after: 25009; store delta bytes: 295608320; wall: 175.1s
- Geometry: outside_texas=0; seam_factor=1.2005; multipolygon_pct=3.07; bbox={"min_west_lng":-95.1264,"max_east_lng":-94.8116,"min_south_lat":32.9809,"max_north_lat":33.3989}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=25009; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48449.json`

### 48015 Austin (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=22581 delete=0 insert=29911 (7521ms)
- Apply1: features=22581 delete=0 insert=29911 (109181ms)
- Apply2 (idempotent): features=22581 delete=29911 insert=29911 (45195ms)
- Rows after: 29911; store delta bytes: 286654464; wall: 170.9s
- Geometry: outside_texas=0; seam_factor=1.3246; multipolygon_pct=0.25; bbox={"min_west_lng":-96.6222,"max_east_lng":-96.0054,"min_south_lat":29.5996,"max_north_lat":30.0969}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29911; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48015.json`

### 48477 Washington (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23475 delete=0 insert=29942 (7993ms)
- Apply1: features=23475 delete=0 insert=29942 (60792ms)
- Apply2 (idempotent): features=23475 delete=29942 insert=29942 (54920ms)
- Rows after: 29942; store delta bytes: 176209920; wall: 133.7s
- Geometry: outside_texas=0; seam_factor=1.2755; multipolygon_pct=0.49; bbox={"min_west_lng":-96.7946,"max_east_lng":-96.082,"min_south_lat":30.0139,"max_north_lat":30.4001}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29942; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48477.json`

### 48481 Wharton (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=31888 delete=0 insert=41331 (10611ms)
- Apply1: features=31888 delete=0 insert=41331 (123720ms)
- Apply2 (idempotent): features=31888 delete=41331 insert=41331 (64988ms)
- Rows after: 41331; store delta bytes: 329138176; wall: 205.6s
- Geometry: outside_texas=0; seam_factor=1.2961; multipolygon_pct=0.69; bbox={"min_west_lng":-96.6381,"max_east_lng":-95.842,"min_south_lat":28.9633,"max_north_lat":29.6338}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=41331; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48481.json`

### 48143 Erath (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=24656 delete=0 insert=33464 (7818ms)
- Apply1: features=24656 delete=0 insert=33464 (82548ms)
- Apply2 (idempotent): features=24656 delete=33464 insert=33464 (97819ms)
- Rows after: 33464; store delta bytes: 410861568; wall: 195.2s
- Geometry: outside_texas=0; seam_factor=1.3572; multipolygon_pct=0.79; bbox={"min_west_lng":-98.5563,"max_east_lng":-97.8308,"min_south_lat":31.9127,"max_north_lat":32.5471}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=33464; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48143.json`

### 48057 Calhoun (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=22678 delete=0 insert=26648 (7346ms)
- Apply1: features=22678 delete=0 insert=26648 (105715ms)
- Apply2 (idempotent): features=22678 delete=26648 insert=26648 (94618ms)
- Rows after: 26648; store delta bytes: 437551104; wall: 216.8s
- Geometry: outside_texas=0; seam_factor=1.1751; multipolygon_pct=3.63; bbox={"min_west_lng":-96.9299,"max_east_lng":-96.3229,"min_south_lat":28.0665,"max_north_lat":28.7312}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=26648; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48057.json`

### 48049 Brown (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=31411 delete=0 insert=37836 (9188ms)
- Apply1: features=31411 delete=0 insert=37836 (84161ms)
- Apply2 (idempotent): features=31411 delete=37836 insert=37836 (100408ms)
- Rows after: 37836; store delta bytes: 420798464; wall: 202.6s
- Geometry: outside_texas=0; seam_factor=1.2045; multipolygon_pct=0.24; bbox={"min_west_lng":-99.4365,"max_east_lng":-98.6654,"min_south_lat":31.4483,"max_north_lat":32.0972}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=37836; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48049.json`

### 48149 Fayette (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23882 delete=0 insert=32881 (9868ms)
- Apply1: features=23882 delete=0 insert=32881 (86166ms)
- Apply2 (idempotent): features=23882 delete=32881 insert=32881 (89882ms)
- Rows after: 32881; store delta bytes: 407347200; wall: 193.6s
- Geometry: outside_texas=0; seam_factor=1.3768; multipolygon_pct=1.09; bbox={"min_west_lng":-97.3179,"max_east_lng":-96.5699,"min_south_lat":29.6281,"max_north_lat":30.1644}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=32881; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48149.json`

### 48455 Trinity (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=25952 delete=0 insert=30656 (8472ms)
- Apply1: features=25952 delete=0 insert=30656 (84916ms)
- Apply2 (idempotent): features=25952 delete=30656 insert=30656 (91920ms)
- Rows after: 30656; store delta bytes: 405864448; wall: 193s
- Geometry: outside_texas=0; seam_factor=1.1813; multipolygon_pct=2.36; bbox={"min_west_lng":-95.4348,"max_east_lng":-94.8431,"min_south_lat":30.8387,"max_north_lat":31.3869}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=30656; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48455.json`

### 48457 Tyler (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=33043 delete=0 insert=39328 (10197ms)
- Apply1: features=33043 delete=0 insert=39328 (125468ms)
- Apply2 (idempotent): features=33043 delete=39328 insert=39328 (92037ms)
- Rows after: 39328; store delta bytes: 444989440; wall: 234.8s
- Geometry: outside_texas=0; seam_factor=1.1902; multipolygon_pct=0.85; bbox={"min_west_lng":-94.6582,"max_east_lng":-94.0509,"min_south_lat":30.5258,"max_north_lat":31.0642}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=39328; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48457.json`

### 48351 Newton (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=23278 delete=0 insert=30576 (7324ms)
- Apply1: features=23278 delete=0 insert=30576 (400643ms)
- Apply2 (idempotent): features=23278 delete=30576 insert=30576 (225851ms)
- Rows after: 30576; store delta bytes: 528662528; wall: 639.9s
- Geometry: outside_texas=0; seam_factor=1.3135; multipolygon_pct=0; bbox={"min_west_lng":-93.9108,"max_east_lng":-93.5075,"min_south_lat":30.2423,"max_north_lat":31.1893}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=30576; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48351.json`

### 48331 Milam (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=20992 delete=0 insert=29023 (9140ms)
- Apply1: features=20992 delete=0 insert=29023 (143736ms)
- Apply2 (idempotent): features=20992 delete=29023 insert=29023 (97902ms)
- Rows after: 29023; store delta bytes: 457695232; wall: 259.2s
- Geometry: outside_texas=0; seam_factor=1.3826; multipolygon_pct=2.63; bbox={"min_west_lng":-97.3156,"max_east_lng":-96.6101,"min_south_lat":30.4571,"max_north_lat":31.111}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=29023; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48331.json`

### 48147 Fannin (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=29043 delete=0 insert=36525 (10474ms)
- Apply1: features=29043 delete=0 insert=36525 (95412ms)
- Apply2 (idempotent): features=29043 delete=36525 insert=36525 (107641ms)
- Rows after: 36525; store delta bytes: 67387392; wall: 222.8s
- Geometry: outside_texas=0; seam_factor=1.2576; multipolygon_pct=1.8; bbox={"min_west_lng":-96.3861,"max_east_lng":-95.8453,"min_south_lat":33.3398,"max_north_lat":33.8871}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=36525; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48147.json`

### 48363 Palo Pinto (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=38698 delete=0 insert=47238 (9751ms)
- Apply1: features=38698 delete=0 insert=47238 (131911ms)
- Apply2 (idempotent): features=38698 delete=47238 insert=47238 (123068ms)
- Rows after: 47238; store delta bytes: 120438784; wall: 271.7s
- Geometry: outside_texas=0; seam_factor=1.2207; multipolygon_pct=2.45; bbox={"min_west_lng":-98.6266,"max_east_lng":-98.0391,"min_south_lat":32.487,"max_north_lat":33.0338}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=47238; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48363.json`

### 48199 Hardin (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=41635 delete=0 insert=48689 (10688ms)
- Apply1: features=41635 delete=0 insert=48689 (126682ms)
- Apply2 (idempotent): features=41635 delete=48689 insert=48689 (112538ms)
- Rows after: 48689; store delta bytes: 106831872; wall: 257.5s
- Geometry: outside_texas=0; seam_factor=1.1694; multipolygon_pct=0.67; bbox={"min_west_lng":-94.7341,"max_east_lng":-94.071,"min_south_lat":30.0969,"max_north_lat":30.5285}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=48689; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48199.json`

### 48223 Hopkins (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=25149 delete=0 insert=31593 (7160ms)
- Apply1: features=25149 delete=0 insert=31593 (100439ms)
- Apply2 (idempotent): features=25149 delete=31593 insert=31593 (125427ms)
- Rows after: 31593; store delta bytes: 79306752; wall: 240.3s
- Geometry: outside_texas=0; seam_factor=1.2562; multipolygon_pct=0.44; bbox={"min_west_lng":-95.8663,"max_east_lng":-95.3005,"min_south_lat":32.9555,"max_north_lat":33.3781}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=31593; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48223.json`

### 48013 Atascosa (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=36791 delete=0 insert=47280 (9061ms)
- Apply1: features=36791 delete=0 insert=47280 (124947ms)
- Apply2 (idempotent): features=36791 delete=47280 insert=47280 (103509ms)
- Rows after: 47280; store delta bytes: 90365952; wall: 246.7s
- Geometry: outside_texas=0; seam_factor=1.2851; multipolygon_pct=2.45; bbox={"min_west_lng":-98.8339,"max_east_lng":-98.0988,"min_south_lat":28.6127,"max_north_lat":29.2509}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=47280; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48013.json`

### 48099 Coryell (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=31711 delete=0 insert=38743 (8558ms)
- Apply1: features=31711 delete=0 insert=38743 (98741ms)
- Apply2 (idempotent): features=31711 delete=38743 insert=38743 (137454ms)
- Rows after: 38743; store delta bytes: 101457920; wall: 252.7s
- Geometry: outside_texas=0; seam_factor=1.2218; multipolygon_pct=1.18; bbox={"min_west_lng":-98.1794,"max_east_lng":-97.419,"min_south_lat":31.0694,"max_north_lat":31.711}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=38743; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48099.json`

### 48427 Starr (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=38571 delete=0 insert=46513 (11799ms)
- Apply1: features=38571 delete=0 insert=46513 (103901ms)
- Apply2 (idempotent): features=38571 delete=46513 insert=46513 (89951ms)
- Rows after: 46513; store delta bytes: 66797568; wall: 214s
- Geometry: outside_texas=0; seam_factor=1.2059; multipolygon_pct=0.48; bbox={"min_west_lng":-99.1715,"max_east_lng":-98.3208,"min_south_lat":26.2357,"max_north_lat":26.7856}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=46513; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48427.json`

### 48375 Potter (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=53490 delete=0 insert=58815 (12475ms)
- Apply1: features=53490 delete=0 insert=58815 (130781ms)
- Apply2 (idempotent): features=53490 delete=58815 insert=58815 (124618ms)
- Rows after: 58815; store delta bytes: 122060800; wall: 275s
- Geometry: outside_texas=0; seam_factor=1.0996; multipolygon_pct=0.46; bbox={"min_west_lng":-102.1675,"max_east_lng":-101.6226,"min_south_lat":35.1831,"max_north_lat":35.6203}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=58815; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48375.json`

### 48459 Upshur (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=30293 delete=0 insert=37052 (35296ms)
- Apply1: features=30293 delete=0 insert=37052 (98148ms)
- Apply2 (idempotent): features=30293 delete=37052 insert=37052 (100695ms)
- Rows after: 37052; store delta bytes: 583041024; wall: 242.1s
- Geometry: outside_texas=0; seam_factor=1.2231; multipolygon_pct=3.38; bbox={"min_west_lng":-95.1534,"max_east_lng":-94.6784,"min_south_lat":32.5165,"max_north_lat":32.9073}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=37052; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48459.json`

### 48097 Cooke (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=33170 delete=0 insert=40630 (38140ms)
- Apply1: features=33170 delete=0 insert=40630 (119568ms)
- Apply2 (idempotent): features=33170 delete=40630 insert=40630 (83037ms)
- Rows after: 40630; store delta bytes: 605151232; wall: 249.2s
- Geometry: outside_texas=0; seam_factor=1.2249; multipolygon_pct=1.32; bbox={"min_west_lng":-97.4869,"max_east_lng":-96.9428,"min_south_lat":33.4164,"max_north_lat":33.948}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=40630; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48097.json`

### 48325 Medina (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=44330 delete=0 insert=54362 (69305ms)
- Apply1: features=44330 delete=0 insert=54362 (134571ms)
- Apply2 (idempotent): features=44330 delete=54362 insert=54362 (90025ms)
- Rows after: 54362; store delta bytes: 710868992; wall: 301.7s
- Geometry: outside_texas=0; seam_factor=1.2263; multipolygon_pct=0.28; bbox={"min_west_lng":-99.4206,"max_east_lng":-98.7981,"min_south_lat":29.0682,"max_north_lat":29.6909}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=54362; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48325.json`

### 48067 Cass (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=34816 delete=0 insert=43140 (39461ms)
- Apply1: features=34816 delete=0 insert=43140 (122023ms)
- Apply2 (idempotent): features=34816 delete=43140 insert=43140 (95970ms)
- Rows after: 43140; store delta bytes: 650960896; wall: 264.9s
- Geometry: outside_texas=0; seam_factor=1.2391; multipolygon_pct=3.57; bbox={"min_west_lng":-94.6563,"max_east_lng":-94.0429,"min_south_lat":32.8792,"max_north_lat":33.3119}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=43140; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48067.json`

### 48241 Jasper (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=37136 delete=0 insert=44641 (69278ms)
- Apply1: features=37136 delete=0 insert=44641 (131855ms)
- Apply2 (idempotent): features=37136 delete=44641 insert=44641 (83373ms)
- Rows after: 44641; store delta bytes: 704618496; wall: 292.4s
- Geometry: outside_texas=0; seam_factor=1.2021; multipolygon_pct=1.22; bbox={"min_west_lng":-94.4601,"max_east_lng":-93.8659,"min_south_lat":30.2416,"max_north_lat":31.1583}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=44641; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48241.json`

### 48465 Val Verde (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=31635 delete=0 insert=43815 (53427ms)
- Apply1: features=31635 delete=0 insert=43815 (131279ms)
- Apply2 (idempotent): features=31635 delete=43815 insert=43815 (93062ms)
- Rows after: 43815; store delta bytes: 693518336; wall: 285.4s
- Geometry: outside_texas=0; seam_factor=1.385; multipolygon_pct=1.72; bbox={"min_west_lng":-101.7641,"max_east_lng":-100.6945,"min_south_lat":29.2378,"max_north_lat":30.2885}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=43815; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48465.json`

### 48265 Kerr (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=36913 delete=0 insert=45503 (39983ms)
- Apply1: features=36913 delete=0 insert=45503 (130218ms)
- Apply2 (idempotent): features=36913 delete=45503 insert=45503 (89090ms)
- Rows after: 45503; store delta bytes: 658046976; wall: 267.8s
- Geometry: outside_texas=0; seam_factor=1.2327; multipolygon_pct=0.36; bbox={"min_west_lng":-99.7576,"max_east_lng":-98.9171,"min_south_lat":29.7821,"max_north_lat":30.2905}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=45503; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48265.json`

### 48019 Bandera (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=33261 delete=0 insert=40447 (37267ms)
- Apply1: features=33261 delete=0 insert=40447 (94025ms)
- Apply2 (idempotent): features=33261 delete=40447 insert=40447 (109262ms)
- Rows after: 40447; store delta bytes: 606380032; wall: 249.5s
- Geometry: outside_texas=0; seam_factor=1.216; multipolygon_pct=0.97; bbox={"min_west_lng":-99.6034,"max_east_lng":-98.7792,"min_south_lat":29.5542,"max_north_lat":29.9077}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=40447; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48019.json`

### 48321 Matagorda (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=37211 delete=0 insert=44706 (12497ms)
- Apply1: features=37211 delete=0 insert=44706 (184573ms)
- Apply2 (idempotent): features=37211 delete=44706 insert=44706 (126996ms)
- Rows after: 44706; store delta bytes: 760561664; wall: 331.2s
- Geometry: outside_texas=0; seam_factor=1.2014; multipolygon_pct=2.77; bbox={"min_west_lng":-96.3772,"max_east_lng":-95.5042,"min_south_lat":28.3944,"max_north_lat":29.2294}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=44706; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48321.json`

### 48277 Lamar (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=36246 delete=0 insert=43847 (10579ms)
- Apply1: features=36246 delete=0 insert=43847 (111480ms)
- Apply2 (idempotent): features=36246 delete=43847 insert=43847 (103349ms)
- Rows after: 43847; store delta bytes: 643661824; wall: 233.7s
- Geometry: outside_texas=0; seam_factor=1.2097; multipolygon_pct=1.43; bbox={"min_west_lng":-95.8581,"max_east_lng":-95.307,"min_south_lat":33.3778,"max_north_lat":33.9416}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=43847; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48277.json`

### 48001 Anderson (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=43894 delete=0 insert=53993 (11912ms)
- Apply1: features=43894 delete=0 insert=53993 (122601ms)
- Apply2 (idempotent): features=43894 delete=53993 insert=53993 (122491ms)
- Rows after: 53993; store delta bytes: 722419712; wall: 265.3s
- Geometry: outside_texas=0; seam_factor=1.2301; multipolygon_pct=0.39; bbox={"min_west_lng":-96.0642,"max_east_lng":-95.2589,"min_south_lat":31.504,"max_north_lat":32.0834}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=53993; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48001.json`

### 48217 Hill (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=39355 delete=0 insert=49707 (11188ms)
- Apply1: features=39355 delete=0 insert=49707 (138898ms)
- Apply2 (idempotent): features=39355 delete=49707 insert=49707 (112802ms)
- Rows after: 49707; store delta bytes: 737329152; wall: 272.9s
- Geometry: outside_texas=0; seam_factor=1.263; multipolygon_pct=1.58; bbox={"min_west_lng":-97.4971,"max_east_lng":-96.7187,"min_south_lat":31.7087,"max_north_lat":32.2655}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=49707; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48217.json`

### 48407 San Jacinto (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=36346 delete=0 insert=42193 (10427ms)
- Apply1: features=36346 delete=0 insert=42193 (120769ms)
- Apply2 (idempotent): features=36346 delete=42193 insert=42193 (105822ms)
- Rows after: 42193; store delta bytes: 672538624; wall: 244.5s
- Geometry: outside_texas=0; seam_factor=1.1609; multipolygon_pct=2.41; bbox={"min_west_lng":-95.3593,"max_east_lng":-94.8306,"min_south_lat":30.3195,"max_north_lat":30.8895}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=42193; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48407.json`

### 48467 Van Zandt (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=43963 delete=0 insert=53884 (11841ms)
- Apply1: features=43963 delete=0 insert=53884 (125763ms)
- Apply2 (idempotent): features=43963 delete=53884 insert=53884 (109333ms)
- Rows after: 53884; store delta bytes: 702775296; wall: 256.4s
- Geometry: outside_texas=0; seam_factor=1.2257; multipolygon_pct=1.64; bbox={"min_west_lng":-96.0927,"max_east_lng":-95.4492,"min_south_lat":32.3473,"max_north_lat":32.8404}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=53884; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48467.json`

### 48409 San Patricio (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=51385 delete=0 insert=58671 (16599ms)
- Apply1: features=51385 delete=0 insert=58671 (142765ms)
- Apply2 (idempotent): features=51385 delete=58671 insert=58671 (112099ms)
- Rows after: 58671; store delta bytes: 743628800; wall: 279s
- Geometry: outside_texas=0; seam_factor=1.1418; multipolygon_pct=0.32; bbox={"min_west_lng":-97.9041,"max_east_lng":-97.136,"min_south_lat":27.8176,"max_north_lat":28.1794}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=58671; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48409.json`

### 48497 Wise (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=48705 delete=0 insert=58626 (14376ms)
- Apply1: features=48705 delete=0 insert=58626 (136490ms)
- Apply2 (idempotent): features=48705 delete=58626 insert=58626 (111062ms)
- Rows after: 58626; store delta bytes: 736239616; wall: 271.9s
- Geometry: outside_texas=0; seam_factor=1.2037; multipolygon_pct=0.2; bbox={"min_west_lng":-97.928,"max_east_lng":-97.3588,"min_south_lat":32.9771,"max_north_lat":33.4522}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=58626; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48497.json`

### 48381 Randall (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=64824 delete=0 insert=71455 (36406ms)
- Apply1: features=64824 delete=0 insert=71455 (190963ms)
- Apply2 (idempotent): features=64824 delete=71455 insert=71455 (153389ms)
- Rows after: 71455; store delta bytes: 82927616; wall: 389s
- Geometry: outside_texas=0; seam_factor=1.1023; multipolygon_pct=0.28; bbox={"min_west_lng":-102.1676,"max_east_lng":-101.623,"min_south_lat":34.7474,"max_north_lat":35.1834}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=71455; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48381.json`

### 48259 Kendall (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=29986 delete=0 insert=36240 (16176ms)
- Apply1: features=29986 delete=0 insert=36240 (143476ms)
- Apply2 (idempotent): features=29986 delete=36240 insert=36240 (120226ms)
- Rows after: 36240; store delta bytes: 75702272; wall: 291.2s
- Geometry: outside_texas=0; seam_factor=1.2086; multipolygon_pct=1.26; bbox={"min_west_lng":-98.921,"max_east_lng":-98.414,"min_south_lat":29.7165,"max_north_lat":30.139}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=36240; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48259.json`

### 48473 Waller (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=48136 delete=0 insert=53784 (25200ms)
- Apply1: features=48136 delete=0 insert=53784 (160958ms)
- Apply2 (idempotent): features=48136 delete=53784 insert=53784 (131672ms)
- Rows after: 53784; store delta bytes: 79552512; wall: 327.6s
- Geometry: outside_texas=0; seam_factor=1.1173; multipolygon_pct=0.41; bbox={"min_west_lng":-96.1917,"max_east_lng":-95.8024,"min_south_lat":29.7279,"max_north_lat":30.2455}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=53784; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48473.json`

### 48499 Wood (batch)

- Pass: false; Halted: true (dry-run exit 1)
- Dry: loaded_before=null features=null delete=null insert=null (28302ms)
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48499.json`

### 48469 Victoria (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=45104 delete=0 insert=54388 (22549ms)
- Apply1: features=45104 delete=0 insert=54388 (158989ms)
- Apply2 (idempotent): features=45104 delete=54388 insert=54388 (152715ms)
- Rows after: 54388; store delta bytes: 81084416; wall: 343.2s
- Geometry: outside_texas=0; seam_factor=1.2058; multipolygon_pct=1.59; bbox={"min_west_lng":-97.3053,"max_east_lng":-96.6561,"min_south_lat":28.4858,"max_north_lat":29.1039}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=54388; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48469.json`

### 48037 Bowie (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=53212 delete=0 insert=61413 (26345ms)
- Apply1: features=53212 delete=0 insert=61413 (161177ms)
- Apply2 (idempotent): features=53212 delete=61413 insert=61413 (145728ms)
- Rows after: 61413; store delta bytes: 81010688; wall: 342.3s
- Geometry: outside_texas=0; seam_factor=1.1541; multipolygon_pct=1.09; bbox={"min_west_lng":-94.7479,"max_east_lng":-94.0429,"min_south_lat":33.237,"max_north_lat":33.7041}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=61413; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48037.json`

### 48073 Cherokee (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=46761 delete=0 insert=56543 (26948ms)
- Apply1: features=46761 delete=0 insert=56543 (155322ms)
- Apply2 (idempotent): features=46761 delete=56543 insert=56543 (170345ms)
- Rows after: 56543; store delta bytes: 81960960; wall: 359.4s
- Geometry: outside_texas=0; seam_factor=1.2092; multipolygon_pct=1.98; bbox={"min_west_lng":-95.4622,"max_east_lng":-94.8659,"min_south_lat":31.4259,"max_north_lat":32.1379}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=56543; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48073.json`

### 48347 Nacogdoches (batch)

- Pass: true; Halted: false
- Dry: loaded_before=no features=48003 delete=0 insert=57487 (25470ms)
- Apply1: features=48003 delete=0 insert=57487 (167220ms)
- Apply2 (idempotent): features=48003 delete=57487 insert=57487 (144005ms)
- Rows after: 57487; store delta bytes: 81248256; wall: 345.6s
- Geometry: outside_texas=0; seam_factor=1.1976; multipolygon_pct=0.44; bbox={"min_west_lng":-94.9782,"max_east_lng":-94.301,"min_south_lat":31.2229,"max_north_lat":31.8518}
- Bbox verify: matched=true; store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)
- SQL independent verify: rows=57487; matches_apply_insert=true
- Artifact: `_inbox/2026-08-08_L2_WAVE3_48347.json`

### 48493 Wilson (batch)

Not started after upstream halt: wave_halted_upstream

### 48203 Harrison (batch)

Not started after upstream halt: wave_halted_upstream

### 48299 Llano (batch)

Not started after upstream halt: wave_halted_upstream

### 48451 Tom Green (batch)

Not started after upstream halt: wave_halted_upstream

### 48361 Orange (batch)

Not started after upstream halt: wave_halted_upstream

### 48349 Navarro (batch)

Not started after upstream halt: wave_halted_upstream

### 48053 Burnet (batch)

Not started after upstream halt: wave_halted_upstream

### 48221 Hood (batch)

Not started after upstream halt: wave_halted_upstream

### 48471 Walker (batch)

Not started after upstream halt: wave_halted_upstream

### 48485 Wichita (batch)

Not started after upstream halt: wave_halted_upstream

### 48329 Midland (batch)

Not started after upstream halt: wave_halted_upstream

### 48373 Polk (batch)

Not started after upstream halt: wave_halted_upstream

### 48005 Angelina (batch)

Not started after upstream halt: wave_halted_upstream

### 48135 Ector (batch)

Not started after upstream halt: wave_halted_upstream

### 48041 Brazos (batch)

Not started after upstream halt: wave_halted_upstream

### 48231 Hunt (batch)

Not started after upstream halt: wave_halted_upstream

### 48183 Gregg (batch)

Not started after upstream halt: wave_halted_upstream

### 48441 Taylor (batch)

Not started after upstream halt: wave_halted_upstream

### 48171 Gillespie (batch)

Not started after upstream halt: wave_halted_upstream

### 48181 Grayson (batch)

Not started after upstream halt: wave_halted_upstream

### 48213 Henderson (batch)

Not started after upstream halt: wave_halted_upstream

### 48479 Webb (batch)

Not started after upstream halt: wave_halted_upstream

### 48303 Lubbock (batch)

Not started after upstream halt: wave_halted_upstream

### 48291 Liberty (batch)

Not started after upstream halt: wave_halted_upstream

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

Wave3 landed seams mean=1.2859, min=1.0996, max=1.9489.

## Cost

cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API

## Findings / defects

- FINDING W3-HALT: wave stopped — dry-run exit 1
- FINDING W3-COST: cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API
