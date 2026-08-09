---
id: 2026-08-09_L2_W3R2_RESUME_REPORT
title: Wave 3 resume (second) — 15 counties landed, Harris short-loaded by a multi-shapefile defect
date: 2026-08-09
status: open
owner: wave3-resume2-planner
related: [_inbox/2026-08-08_L2_WAVE3_PLACEHOLDER_DEFECT_FAMILY, _inbox/2026-08-08_L2_WAVE3_RESUME_REPORT, _inbox/2026-08-08_L2_WAVE3_membership]
evidence: P:/tmp/w3r2_logs, _inbox/2026-08-09_L2_W3R2_*_declined_*.json
---

# Wave 3 resume 2 — the blocker cleared, and a bigger one surfaced underneath it

Wave 3 had halted three times on a StratMap placeholder defect. ldt PR #402 (`5287ee32`) fixed it, and this resume ran the remaining membership to completion. Every one of the 15 remaining counties landed. The placeholder family is closed. In its place the adversarial review found a defect the entire program has been blind to, because no count-based check can see it: **Harris County loaded about one third of itself and reported success.**

## Store truth at execution time

The resume set was derived from the store, not from a prior artifact. Baseline was 181 counties / 10,810,225 rows; membership is 117; the difference was 15 counties.

Final store: **196 counties / 14,442,123 rows**, adding 3,631,898 rows. The arithmetic closes exactly:

```
BASELINE_DISTINCT=181 BASELINE_ROWS=10810225
RESUME_COUNTIES=15    RESUME_ROWS_SUM=3631898
EXPECTED_TOTAL=14442123 ACTUAL_TOTAL=14442123 DELTA=0
BASELINE_COUNTIES_DRIFTED=0
UNEXPECTED_COUNTIES=[]
OUT_OF_BOUNDS=0
```

All 181 baseline counties are intact at their exact prior row counts, nothing landed outside the membership set, and zero rows in the entire store fall outside the Texas envelope.

## Per-county result

Every county's dry run predicted its apply exactly, on both features loaded and rows inserted.

| county | FIPS | features | rows | declined | result |
|---|---|---:|---:|---:|---|
| Wood | 48499 | 44,575 | 52,174 | 1 | landed |
| Henderson | 48213 | 106,706 | 117,321 | 1,778 | landed |
| Liberty | 48291 | 162,273 | 181,072 | 1,905 | landed |
| Jefferson | 48245 | 122,202 | 132,304 | 0 | landed |
| Smith | 48423 | 140,245 | 154,982 | 0 | landed |
| Galveston | 48167 | 188,695 | 201,935 | 1 | landed |
| Nueces | 48355 | 157,198 | 168,759 | 0 | landed |
| Cameron | 48061 | 185,062 | 199,560 | 7 | landed |
| Hidalgo | 48215 | 328,322 | 353,060 | 11 | landed |
| Bosque | 48035 | 19,975 | 27,224 | 0 | landed, solo |
| Brazoria | 48039 | 275,131 | 304,675 | 0 | landed, solo |
| El Paso | 48141 | 407,126 | 429,135 | 4 | landed, solo |
| Montgomery | 48339 | 320,915 | 344,268 | 0 | landed, solo |
| Fort Bend | 48157 | 375,097 | 400,481 | 3 | landed, solo |
| Harris | 48201 | 536,512 | 564,948 | 0 | **SHORT-LOADED, see below** |

The three former blockers landed on the numbers PR #402 predicted: Wood 44,575 load / 1 decline, Henderson 106,706 / 1,778, Liberty 162,273 / 1,905. Ordering held: the five metros ran solo in bytes-ascending order with Harris last, and Bosque ran alone.

## The declination fix works, and it named 3,707 previously silent absences

Every declined feature across all 15 counties carries identity. Roster length equals the reported count in all 37 roster files, with zero identity-less entries.

Wood's single decline, verbatim:

```
DECLINED feature 43504 prop_id=0 geo_id=- objectid=30421 reason=out-of-envelope-null-placeholder
  :: bbox [-96.11974769799997, 13.919695862000026, -96.11837544999997, 13.923654807000048]
     outside Texas; no Prop_ID and no GEO_ID
```

Two classes appear, and the split matters. `out-of-envelope-null-placeholder` is the family PR #402 targeted: 1 in Wood, 2 each in Henderson and Liberty, and **4 in El Paso**, a county not previously known to carry it. Without the fix El Paso would have been a fourth halt. The much larger `empty-geometry` class — 1,776 in Henderson, 1,903 in Liberty — is the 148-skip family from the prior wave, now named rather than counted. Liberty's 1,903 geometry-less features carry real `objectId` and `propId` values; those records were dropped silently for the program's entire history and are now answerable.

Hidalgo's 11 declines briefly looked like a breach of the 10-absolute placeholder ceiling. They are not: all 11 are `empty-geometry`, governed by the separate 5 percent end-of-stream ceiling. The placeholder ceiling was never approached.

The envelope guard was not touched. Verified three ways: `git status --porcelain lib/cad-ingest` empty, `git diff -- lib/cad-ingest` empty, and the `geo.ts` blob hash identical to `origin/main` (`280a77de6087df442390f1249d4e82b77431ad89`).

## DEFECT — Harris 48201 loaded roughly a third of the county and reported success

The TxGIO archive for Harris ships **two** shapefiles. The ingest extracted both and loaded only the first:

```
extracting shp/stratmap25-landparcels_48201_harris_east_202508.shp (103262876 bytes)
extracting shp/stratmap25-landparcels_48201_harris_west_202508.shp (213768804 bytes)
vintage=stratmap25-landparcels_48201_harris_east_202508
```

Root cause, `lib/cad-ingest/src/txgio/cli.ts:149`:

```js
const shpFile = files.find((f) => /\.shp$/i.test(f));
```

`find` returns the first match. `harris_west` — at 213 MB, larger than the 103 MB east half — was downloaded, extracted, and discarded without a word.

The store shows a hard artificial wall where a county boundary should be:

```
HARRIS_BBOX={"w":"-95.4364","e":"-94.9076","s":"29.5086","n":"30.1670","cnt":564948}
PARCELS_WEST_OF_-95.44=0
STACKED_AT_WALL=810
```

Harris County truly extends to about -95.96. There are zero parcels west of the wall and 810 piled against it. By shapefile bytes the west half is roughly 2.07 times the east, implying on the order of 1.1 million missing parcels, about 67 percent of the county.

What makes this the important finding is that **no count-based check can detect it**. Dry, apply, apply2, and SQL all agree at 564,948 because all four read the same truncated input. Worse, the membership file's `parcel_count_est` for Harris is 536,512 — exactly the east-only feature count — so the original sizing probe carried the same bug and the estimate cannot be used as an independent check. Idempotency, dry-apply parity, and envelope conformance all pass on a two-thirds-empty county.

Harris is **not customer-done** despite an `OK` status. Per the halt rule, no code was patched and no re-run was attempted; the defect is recorded for a reviewed fix.

Among the 15 resume counties Harris is the only multi-shapefile archive; the other 14 extracted exactly one `.shp`. **The 181 baseline counties were never checked for this and must be swept** — any multi-shapefile county among them is silently truncated the same way.

## DEFECT — 8-way concurrency deadlocks on the shared index

Six of the nine batch counties, plus Bosque, failed their first apply with Postgres `40P01`:

```
code: '40P01'  severity: 'ERROR'  routine: 'DeadLockReport'
detail: 'Process 24102 waits for ShareLock on transaction 11757554; blocked by process 24317.
         Process 24317 waits for ShareLock on transaction 11757553; blocked by process 24102.'
where: 'while inserting index tuple (568006,11) in relation "txgio_parcel"'
```

The counties are PK-disjoint on `county_fips`, which is why 8-way concurrency looked safe, but they contend on a **shared index** on `txgio_parcel`. Disjointness at the key level does not imply disjointness at the index level.

`replaceCountyParcels` wraps delete and load in one transaction, so every failure rolled back cleanly — zero torn counties, confirmed by exact row counts and zero duplicate PK triples. The real cost was procedural: the apply2 pass was consumed as the load pass, erasing the idempotency check. A separate `_idem` lane restored genuine idempotency proof for six of the seven. **Bosque 48035 has no idempotency verification** and is owed one.

Once execution was genuinely serialized (Brazoria onward), every county ran with zero errors. Concurrency for this ingest should be 1 to 2, not 8.

## DEFECT — status files are written without truncation, masking failure

```
$ cat -A w3r2_logs/48213.status
48213 OK$
LY1_FAILED exit=1$
```

The success line partially overwrote the earlier `48213 APPLY1_FAILED exit=1`, leaving an orphan tail. Seven status files are corrupted this way. A reader using `head -1` or `grep OK` sees a clean success and would miss the entire deadlock family — those failures are only discoverable in the raw logs. This is the same class of honesty gap as the bare skip counter: a failure that does not survive into the artifact.

## Adversarial review — verdict PARTIAL

The reviewer re-derived the resume set from the membership file and its own SQL, re-parsed dry-versus-apply from raw logs rather than artifacts, opened all 37 declined rosters, derived the Texas bounds from `geo.ts` rather than trusting the prompt's approximations, and verified the guard three independent ways. It killed one claim, conditioned three, and found the Harris defect that the planner's own checks passed clean. Verbatim verdict:

> **VERDICT: PARTIAL — one material data defect (Harris ~67% short-loaded), plus two process defects; all guard, envelope, arithmetic and baseline-integrity claims survive**
>
> All 15 resume counties landed, every landed row count matches its dry prediction exactly, all 181 baseline counties are intact at their exact prior row counts, store arithmetic reconciles with zero drift (10,810,225 + 3,631,898 = 14,442,123), zero rows violate the Texas envelope, zero duplicate PK triples, and the envelope guard is provably byte-identical to origin/main. However, **Harris 48201 is short-loaded by roughly two thirds**: the TxGIO archive ships two shapefiles (`harris_east` and `harris_west`), the ingest extracted both but `cli.ts:149` uses `files.find(/\.shp$/i)` and loaded only `harris_east`, leaving a hard artificial western wall at lon -95.4364 with 21,300 parcels stacked against it while true Harris extends to about -95.96. Harris is therefore NOT customer-done despite an `OK` status. Separately, six of nine batch counties plus Bosque died on Postgres deadlocks (40P01) from running 8-concurrent writes against one table, which meant their apply2 pass was consumed as the load pass, so **seven counties have no genuine idempotency re-run at all**; and the runner's status writer does not truncate, leaving corrupted files that read `48061 OK` followed by an orphan `LY1_FAILED exit=1`, so a naive reader sees only "OK".

Three claims the reviewer attacked and cleared are worth recording, because each looked like a defect and was not. The 1.64 percent and 1.16 percent decline rates on Henderson and Liberty are governed by the 5 percent geometry-absence ceiling, not the 0.1 percent placeholder ceiling. An apparent 14-versus-15 resume-set mismatch was the reviewer's own read timing, with Wood committing between two queries. And three counties exceeding the prompt's stated Texas bounds (Dallam at 36.5015, Ochiltree at 36.5000, El Paso at -106.646) are genuine Panhandle and far-west geography inside the real guard bounds; the prompt's approximations were too tight and would have falsely condemned them.

## Findings

**W3R2-HARRIS-TRUNCATION (new, material, open).** Multi-shapefile TxGIO archives silently load only the first `.shp`. Harris 48201 is about 67 percent short. Invisible to every count-based check. Fix is a reviewed change to `discoverShapefile` to load and concatenate all shapefiles in the archive, plus a re-ingest of Harris and a sweep of the 181 baseline counties for other multi-shapefile archives.

**W3R2-DEADLOCK (new, process, open).** 8-way concurrency deadlocks on the shared `txgio_parcel` index despite county-disjoint keys. Serialize to 1 to 2 concurrent. No data corruption occurred; the single-transaction design held.

**W3R2-STATUS-TRUNCATION (new, process, open).** Status files written without truncation leave failure tails that read as success.

**W3R2-BOSQUE-IDEM (open).** Bosque 48035 landed at its predicted 19,975 features / 27,224 rows but never got a clean idempotency re-run.

**W3-PLACEHOLDER-FAMILY (CLOSED).** PR #402's identity-gated declination path resolved it. Confirmed in four counties, El Paso being new. 3,707 declines across the wave, all carrying identity, zero bare counters.

**W3-COST (open, unchanged).** No per-county billing meter was queried and none was invented.

## Authority boundaries observed

Ingest only. No merge, no deploy, no atoms-store write. Only `txgio_parcel` was written, on the direct Neon host, with writability proven by a CREATE/INSERT/DELETE/DROP cycle before any run. No VACUUM, no global or locking operations. The pooler URL was never used; every script asserted against `-pooler.` before connecting. No code was patched to work around a failure, and the Harris mismatch was halted on rather than re-run.
