---
id: 2026-08-08_L2_WAVE1_report
title: L2 Wave 1 Texas parcel acquisition results
date: 2026-08-08
status: complete
owner: wave1-sub-planner
---

# L2 Wave 1 results

Wave 1 COMPLETE. Attempted 10, landed 10, failed 0. Total rows among Wave1 counties: 87832. Wall clock: 323s. Store now 29 distinct county_fips; relation size 6428565504 bytes.

Independent SQL post-verify confirmed every row count, seam factor, Texas-bounds check (all 0 outside), and StratMap SHP header bbox match to four edges at 4 decimal places. Source matrix has no Census bbox fields; verification used StratMap SHP main-file headers (same discipline as the Kenedy proof).

## Repo / environment

- Worktree: `P:/legacy-design-tools-wave0`
- HEAD: `fb6a42b22d7855b08d6d5de228f41eba298e2629` (PR #399 merge)
- TLS: `NODE_OPTIONS=--use-system-ca`
- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (SELECT + authorized ingest only; no test runner; atoms Neon untouched).

### Verbatim git status

```
## main...origin/main
?? .tmp_wave0_tls/
```

## Per-county

### 48261 Kenedy

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=yes features=538 delete=2400 insert=2400 (2550ms)
- Apply1: features=538 delete=2400 insert=2400 (9900ms)
- Apply2: features=538 delete=2400 insert=2400 (12959ms)
- Rows: 2400; seam_factor: 4.461; multipolygon_pct: 0.19; store_delta_bytes: 12918784; wall: 29.8s
- Geometry: outside_texas=0; bbox={"min_west_lng":-97.9862,"max_east_lng":-97.4225,"min_south_lat":26.5979,"max_north_lat":27.2833}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48261.json`

### 48173 Glasscock

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=2988 delete=0 insert=7934 (3824ms)
- Apply1: features=2988 delete=0 insert=7934 (11322ms)
- Apply2: features=2988 delete=7934 insert=7934 (11453ms)
- Rows: 7934; seam_factor: 2.6553; multipolygon_pct: 0.77; store_delta_bytes: 12607488; wall: 30.1s
- Geometry: outside_texas=0; bbox={"min_west_lng":-101.7861,"max_east_lng":-101.2642,"min_south_lat":31.6466,"max_north_lat":32.0875}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48173.json`

### 48033 Borden

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=3752 delete=0 insert=8588 (2861ms)
- Apply1: features=3752 delete=0 insert=8588 (12191ms)
- Apply2: features=3752 delete=8588 insert=8588 (12167ms)
- Rows: 8588; seam_factor: 2.2889; multipolygon_pct: 0.32; store_delta_bytes: 12935168; wall: 30.5s
- Geometry: outside_texas=0; bbox={"min_west_lng":-101.6915,"max_east_lng":-101.1731,"min_south_lat":32.5238,"max_north_lat":32.9636}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48033.json`

### 48359 Oldham

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=4162 delete=0 insert=9823 (2893ms)
- Apply1: features=4162 delete=0 insert=9823 (14110ms)
- Apply2: features=4162 delete=9823 insert=9823 (14076ms)
- Rows: 9823; seam_factor: 2.3602; multipolygon_pct: 4.18; store_delta_bytes: 19365888; wall: 34.3s
- Geometry: outside_texas=0; bbox={"min_west_lng":-103.0425,"max_east_lng":-102.1629,"min_south_lat":35.1831,"max_north_lat":35.6276}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48359.json`

### 48393 Roberts

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=2574 delete=0 insert=6194 (2730ms)
- Apply1: features=2574 delete=0 insert=6194 (11123ms)
- Apply2: features=2574 delete=6194 insert=6194 (11551ms)
- Rows: 6194; seam_factor: 2.4064; multipolygon_pct: 15.66; store_delta_bytes: 16203776; wall: 28.6s
- Geometry: outside_texas=0; bbox={"min_west_lng":-101.0861,"max_east_lng":-100.5397,"min_south_lat":35.6192,"max_north_lat":36.058}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48393.json`

### 48345 Motley

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=9374 delete=0 insert=14380 (3481ms)
- Apply1: features=9374 delete=0 insert=14380 (10944ms)
- Apply2: features=9374 delete=14380 insert=14380 (10993ms)
- Rows: 14380; seam_factor: 1.534; multipolygon_pct: 3.48; store_delta_bytes: 22315008; wall: 28.7s
- Geometry: outside_texas=0; bbox={"min_west_lng":-101.0418,"max_east_lng":-100.5173,"min_south_lat":33.8336,"max_north_lat":34.3142}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48345.json`

### 48311 McMullen

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=4188 delete=0 insert=8327 (2814ms)
- Apply1: features=4188 delete=0 insert=8327 (13698ms)
- Apply2: features=4188 delete=8327 insert=8327 (13889ms)
- Rows: 8327; seam_factor: 1.9883; multipolygon_pct: 7.62; store_delta_bytes: 21004288; wall: 33.8s
- Geometry: outside_texas=0; bbox={"min_west_lng":-98.8065,"max_east_lng":-98.3342,"min_south_lat":28.0569,"max_north_lat":28.6518}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48311.json`

### 48413 Schleicher

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=6559 delete=0 insert=11120 (3646ms)
- Apply1: features=6559 delete=0 insert=11120 (15496ms)
- Apply2: features=6559 delete=11120 insert=11120 (15249ms)
- Rows: 11120; seam_factor: 1.6954; multipolygon_pct: 1.01; store_delta_bytes: 18841600; wall: 37.7s
- Geometry: outside_texas=0; bbox={"min_west_lng":-100.9606,"max_east_lng":-100.1094,"min_south_lat":30.706,"max_north_lat":31.0885}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48413.json`

### 48205 Hartley

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=5645 delete=0 insert=9892 (3223ms)
- Apply1: features=5645 delete=0 insert=9892 (14143ms)
- Apply2: features=5645 delete=9892 insert=9892 (14739ms)
- Rows: 9892; seam_factor: 1.7523; multipolygon_pct: 7.42; store_delta_bytes: 18382848; wall: 35.4s
- Geometry: outside_texas=0; bbox={"min_west_lng":-103.0417,"max_east_lng":-102.1622,"min_south_lat":35.6215,"max_north_lat":36.0582}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48205.json`

### 48017 Bailey

- Pass: true; dry_predicts_apply: true; idempotent held: true
- Dry: loaded_before=no features=6044 delete=0 insert=9174 (3093ms)
- Apply1: features=6044 delete=0 insert=9174 (13367ms)
- Apply2: features=6044 delete=9174 insert=9174 (13520ms)
- Rows: 9174; seam_factor: 1.5179; multipolygon_pct: 1.77; store_delta_bytes: 15966208; wall: 33.5s
- Geometry: outside_texas=0; bbox={"min_west_lng":-103.048,"max_east_lng":-102.518,"min_south_lat":33.7962,"max_north_lat":34.3187}
- Bbox verify: matched=true via StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)
- Artifact: `_inbox/2026-08-08_L2_WAVE1_48017.json`

## Rural seam factor vs Kenedy 4.46

Rural seam is elevated vs metro 1.07 across Wave1 (mean 2.266) but does NOT uniformly hold at Kenedy 4.46. Range 1.5179-4.461. Statewide storage projections must use a mix, not a single rural multiplier.

Values: Kenedy=4.461, Glasscock=2.6553, Borden=2.2889, Oldham=2.3602, Roberts=2.4064, Motley=1.534, McMullen=1.9883, Schleicher=1.6954, Hartley=1.7523, Bailey=1.5179.
Mean=2.266, min=1.5179, max=4.461. Counties >=2.0: 5; near-metro <2.0: 5 (Motley, McMullen, Schleicher, Hartley, Bailey).

## Cost

cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API

## Findings

- FINDING W1-OK: all 10 Wave1 counties dry-predicted apply exactly; idempotent re-apply held row counts; zero rows outside Texas bounds; SHP header bbox matched store to 4dp.
- FINDING W1-SEAM: Rural seam is elevated vs metro 1.07 across Wave1 (mean 2.266) but does NOT uniformly hold at Kenedy 4.46. Range 1.5179-4.461. Statewide storage projections must use a mix, not a single rural multiplier.
- FINDING W1-BBOX-MATRIX: `_inbox/2026-08-08_SWEEP_county_source_matrix.json` has no Census extent fields; verification used StratMap SHP headers.
- FINDING W1-FETCH-UA: bare curl/node fetch without browser UA got HTTP 403 from geographic.texas.gov; cad-ingest browser UA succeeds.
- FINDING W1-COST: cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API
- FINDING W1-CONTROL: Kenedy 48261 loaded_before=yes; dry delete=insert=2400; apply held 2400; seam 4.4610.

Wave 2 was not started.
