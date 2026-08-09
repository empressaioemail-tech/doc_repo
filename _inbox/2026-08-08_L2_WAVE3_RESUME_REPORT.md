---
id: 2026-08-08_L2_WAVE3_RESUME_REPORT
title: L2 Wave 3 resume — 22 landed, halted on a characterized source defect family
date: 2026-08-08
status: halted
owner: wave3-resume-planner
related:
  - _inbox/2026-08-08_L2_WAVE3_MASTER_REPORT
  - _inbox/2026-08-08_L2_WAVE3_WOOD_48499_RULING
  - _inbox/2026-08-08_L2_WAVE3_PLACEHOLDER_DEFECT_FAMILY
  - _inbox/2026-08-08_L2_WAVE3_BOSQUE_48035_INSPECTION
  - _inbox/2026-08-08_L2_WAVE3_RESUME_ADVERSARIAL_REVIEW
---

# L2 Wave 3 resume

Both known halt causes were cleared before a single row was written. The resume then landed **22 counties and 1,583,661 rows in 30.3 minutes with zero gate failures**, and halted a second time on **two new counties exhibiting the same defect as Wood**. That halt is the wave's most valuable output: it converted a one-off bad county into a characterized, named source defect family with a concrete engineering recommendation.

Wave 3 remains **HALTED**, not complete. Twelve members were never started, including Bosque and all five metros.

## Both prior halts cleared before writing

**HALT 1 — pooler read-only. CLEARED and proven, not assumed.** The stored TxGIO connection string at `P:\tmp\txgio_db_url.txt` is in fact the pooler host `ep-lucky-truth-apodo8hr-pooler...`, the exact string that killed seven counties on the first attempt. The direct host lives at `P:\tmp\dburl.txt`. Before any ingest, the direct endpoint was proven writable:

```
=== 1. transaction_read_only (must be off) ===
off
=== 2. LIVE WRITE PROOF: create/insert/delete/drop a scratch table ===
CREATE TABLE
INSERT 0 1
DELETE 1
DROP TABLE
WRITE_OK
psql exit=0
```

The `DELETE` is the operative line — that is the statement that returned `25006 / PreventCommandIfReadOnly` on the pooler. Twenty-two counties subsequently committed, which is the durable proof.

**HALT 2 — Wood 48499. RULED PARK.** Full reasoning in `_inbox/2026-08-08_L2_WAVE3_WOOD_48499_RULING.md`, and materially updated by what came later (below). The envelope guard was **not** disabled, loosened, or worked around. Verified at report time:

```
$ cd /p/legacy-design-tools-wave0 && git status --porcelain lib/cad-ingest
$ git diff -- lib/cad-ingest
(both empty — guard unmodified)
```

## Store-truth sizing (Geometry Law rule 8)

Sized from the store at execution time, not from a prior artifact. Live `SELECT` returned 159 distinct `county_fips` / 9,226,564 rows, intersected against the 117-member Wave 3 list:

| Partition | Count |
|---|---:|
| Wave 3 membership | 117 |
| Already loaded (store truth) | 80 |
| **Remaining** | **37** |
| Parked (Wood 48499) | 1 |
| **Resume set attempted** | **36** |

The resume set was 30 concurrent-batch counties, then Bosque solo, then five metros individually with Harris last. This independently reproduced the prior report's 80/37 split from live SQL rather than trusting it.

## Result

| Metric | Value |
|---|---:|
| Resume set | 36 |
| **Landed** | **22** |
| Failed (fail-closed, zero rows) | **2** |
| Never started after halt | **12** |
| Parked by ruling | 1 (Wood) |
| **Rows added** | **1,583,661** |
| Wall clock | **1,818 s (30.3 min)** |
| Store before | 159 distinct / 9,226,564 rows |
| **Store after** | **181 distinct / 10,810,225 rows** |
| Seam factor (landed) | mean 1.1546, min 1.0698, max 1.3045 |

Independent SELECT-only re-verification (`2026-08-08_L2_WAVE3_verify_a2.json`, a separate script from the orchestrator):

```
"all_dry_predicted_apply": true,
"all_idempotent_held": true,
"all_sql_matches_claim": true,
"total_rows_outside_texas": 0
```

Containment held exactly — nothing outside membership was written:

```
live: 181  prior: 159  landed: 22
UNEXPECTED FIPS: []
prior+landed == live: true
```

And every excluded county holds zero rows:

```
48499|0   (Wood, parked)
48213|0   (Henderson, fail-closed)
48291|0   (Liberty, fail-closed)
48129|0   (Donley, not a member)
```

### Per-county (all 22 landed)

Every row below is live SQL, and `bbox` is the store bbox matching the source SHP header to 4dp.

| FIPS | County | Rows | Seam | Bbox | Wall (s) |
|---|---|---:|---:|---|---:|
| 48493 | Wilson | 37,604 | 1.3045 | true | 369.6 |
| 48203 | Harrison | 60,341 | 1.1833 | true | 341.3 |
| 48299 | Llano | 45,860 | 1.1796 | true | 315.3 |
| 48451 | Tom Green | 68,571 | 1.1684 | true | 332.1 |
| 48361 | Orange | 56,128 | 1.1150 | true | 314.2 |
| 48349 | Navarro | 57,926 | 1.2547 | true | 665.8 |
| 48053 | Burnet | 59,785 | 1.1924 | true | 345.8 |
| 48221 | Hood | 57,169 | 1.1149 | true | 339.4 |
| 48471 | Walker | 42,463 | 1.1934 | true | 407.9 |
| 48485 | Wichita | 65,490 | 1.1149 | true | 428.8 |
| 48329 | Midland | 83,887 | 1.1090 | true | 414.9 |
| 48373 | Polk | 69,616 | 1.1568 | true | 405.8 |
| 48005 | Angelina | 70,445 | 1.1607 | true | 628.8 |
| 48135 | Ector | 83,202 | 1.0963 | true | 395.5 |
| 48041 | Brazos | 82,874 | 1.1099 | true | 424.4 |
| 48231 | Hunt | 79,774 | 1.1441 | true | 423.7 |
| 48183 | Gregg | 83,706 | 1.0757 | true | 322.0 |
| 48441 | Taylor | 79,469 | 1.1257 | true | 345.7 |
| 48171 | Gillespie | 40,372 | 1.2479 | true | 328.6 |
| 48181 | Grayson | 100,911 | 1.1294 | true | 367.1 |
| 48479 | Webb | 113,524 | 1.1550 | true | 437.0 |
| 48303 | Lubbock | 144,544 | 1.0698 | true | 504.8 |

### Failed — fail-closed, zero rows, named

```
[txgio-ingest] FATAL: TxgioProjectionError: county 48213 feature 1316: bbox
[-96.41313877899995, 13.926112111000066, -96.41300350399996, 13.929660243000058]
falls outside the plausible Texas WGS84 envelope [-107.5, 25, -93, 37]
```

```
[txgio-ingest] FATAL: TxgioProjectionError: county 48291 feature 2020: bbox
[-96.99157147699998, 40.88115681700003, -96.98720080199996, 40.886075266000034]
falls outside the plausible Texas WGS84 envelope [-107.5, 25, -93, 37]
```

### Never started (12)

48245 Jefferson, 48423 Smith, 48167 Galveston, 48355 Nueces, 48061 Cameron, 48215 Hidalgo, 48035 Bosque, 48039 Brazoria, 48141 El Paso, 48339 Montgomery, 48157 Fort Bend, 48201 Harris.

All hold zero rows. **Bosque and the five metros never ran** — the halt landed in batch 3 of 4, before the solo phases. Their ordering discipline (Bosque alone, metros individually, Harris last) was configured and asserted by the orchestrator but was never exercised, and is not claimed as demonstrated.

## The headline finding: a defect family, not a bad county

Full detail in `_inbox/2026-08-08_L2_WAVE3_PLACEHOLDER_DEFECT_FAMILY.md`. Measuring all three failing sources:

| County | Records | Out-of-envelope | Bad latitudes |
|---|---:|---:|---|
| Wood 48499 | 44,576 | 1 | 13.92 |
| Henderson 48213 | 108,484 | 2 | 13.93, 13.92 |
| Liberty 48291 | 164,178 | 2 | 40.88, 40.88 |

**All five defective records are null placeholders** — `Prop_ID` empty or `"0"`, empty owner, empty GEO_ID, zero market value — while every other record sits correctly inside its county with a valid geographic `.prj`.

This reframes the Wood ruling, which reasoned from a sample of one and concluded the cost of waiting was small. At three counties in 36 attempted, with 317,238 real parcels withheld in Henderson and Liberty alone, parking is no longer a cheap deferral; it is the wave's rate limiter. The park decisions stand as executed, but the recommendation for the next step changed, and that change is recorded rather than buried.

The guard's own documented premise — "a projection error is a WHOLE-COUNTY property, not a per-feature data defect" — is now measurably false for the 202503 vintage. The recommended fix is a reviewed, merged, tested per-feature declination path that may decline **only** identity-less out-of-envelope records, counts and names every declination in the artifact, and keeps throwing for whole-county projection errors and for any out-of-envelope record carrying a real `Prop_ID`. That was deliberately not built during the wave: patching the sole guard protecting the store, mid-run, without review, is how a fail-closed guarantee decays into a convenience.

## Bosque 48035 — inspected without being ingested

Bosque never ran, but its anomaly was inspected anyway by read-only source probe, since the inspection was owed regardless (`_inbox/2026-08-08_L2_WAVE3_BOSQUE_48035_INSPECTION.md`).

The 104 MB / 19,975 parcel outlier (5,219 bytes/parcel, **10.69x** the 488.4 median across 117 members, versus 2.85x for the next-densest county) is explained by geometry vertex density: 7,751,827 vertices, **median 9 vertices per parcel against a mean of 388.1**, p95 1,578, max 46,353. A minority of survey-precision boundaries carries the file size. Geometry is clean — 0 out-of-envelope records, 1.16 rings/parcel (not the multipolygon-truncation failure mode), bbox correctly inside Bosque County. Expect an above-mean seam factor when it does run; that will be the predicted outcome, not a red flag.

## Defects and findings

1. **W3-PLACEHOLDER-FAMILY (new, open).** Null-placeholder features with junk coordinates in StratMap 202503; confirmed in 48499, 48213, 48291. Expect more in the unattempted remainder.
2. **W3-GUARD-COVERAGE (open, upgraded).** No reviewed path to decline bounded, attribute-identifiable defective features. Now the rate limiter.
3. **W3-FORENSICS (closed for this attempt).** The first attempt destroyed its own failure evidence by reusing log filenames. Fixed here: 241 prior logs archived to `_inbox/wave3_attempt1_archive/` before the run, and this attempt writes distinct `_a2_` prefixes. No evidence was overwritten.
4. **W3-BOSQUE-DENSITY (closed).** Explained above; no defect.
5. **W3-COST (open).** Cost per county not obtainable — no Neon or GCP per-county billing meter was queried, and none was invented.
6. **TXGIO_COUNTIES drift**, **table bloat / vacuum**, **C3.7 ring-binding** all remain open from the prior wave; untouched here.
7. **Donley 48129** remains a 404 at source and not a member.

## Authority boundaries observed

Ingest only. No merge, no deploy, no atoms-store write. Only `txgio_parcel` on the TxGIO store was written; the atoms DB was never opened for writing, so the concurrently-running parcel-node writer sweep was unaffected. No VACUUM, no global operations, no test suite pointed at a deployment Postgres. Counties are PK-disjoint on `county_fips`, so the 8-way concurrency never contended.

## Adversarial review — verdict PARTIAL

Full review: `_inbox/2026-08-08_L2_WAVE3_RESUME_ADVERSARIAL_REVIEW.md`. The reviewer re-derived the resume set itself, re-parsed dry-versus-apply from the raw logs rather than trusting the artifacts, checked idempotency per county from raw apply2 logs, and verified the guard unmodified two ways. It killed one claim and conditioned two, and it caught three real defects in the planner's own artifacts. Verbatim verdict:

> The Wave 3 resume adversarial review is PARTIAL: the mechanical claims survive unusually well and the framing claims do not. Independent SELECT-only probing on the direct non-pooler Neon endpoint confirms baseline 159 distinct / 9,226,564 rows captured before any resume write, a resume set I re-derived myself as exactly membership-117 minus store-159 (37 = 36 runnable plus parked Wood, byte-identical to the planner's file), and a final store of 181 distinct / 10,810,225 rows with 1,583,661 added; all 22 landed counties pass individually with zero mismatches on SQL-versus-artifact row counts, on dry-equals-apply1 re-parsed from the raw logs rather than trusted from the artifacts, and on per-county idempotency read from raw apply2 logs, with zero rows outside Texas degree bounds store-wide and per county, no unexpected FIPS, the prior 159 fully intact, and the envelope guard verified unmodified by empty `git status --porcelain lib/cad-ingest` and empty `git diff -- lib/cad-ingest` at HEAD de4fc8b. Claim 9 is KILLED as stated because the wave halted a second time in batch 3 on Henderson 48213 and Liberty 48291 and the five metros plus Bosque never ran at all — all six verified at zero rows, correctly not-started rather than silently skipped — and claim 10 is corrected rather than killed, since Bosque was never ingested but its inspection is genuinely sound (7,751,827 vertices at 16 bytes is 99.1 percent of the 125 MB SHP, and every cited ratio reproduces), though it miscalibrates its own pass bar by citing a Wave 3 mean seam of 1.30 when the measured mean across the 22 landed counties is 1.1546. The Wood park is CONDITIONED: the absence is genuinely named and findable and the guard was never weakened, but the ruling's cost argument that "the cost of waiting is small" is now stale at three counties, roughly 317,238 withheld parcels, and a 12.5 percent halt rate on counties actually attempted, so parking has become an unsolved blocker rather than a ruling and the identity-gated per-feature declination path must be treated as the next blocking engineering item. Finally, the placeholder-family doc's central thesis survives on evidence stronger than it cites — the SHP header bboxes independently recorded in the artifacts are polluted at ymin 13.9244 for 48213 and ymax 40.8861 for 48291, corroborating the junk-coordinate clusters through a second instrument — but its five-record DBF attribute table, the very premise the recommended declination path would be built on, has no probe artifact anywhere on disk and cannot be corroborated by the dry logs (which name only the first offending feature per county, leaving 48213 index 12770 and 48291 index 2027 entirely unevidenced), and the doc misnames FIPS 48213 as Kaufman when it is Henderson (Kaufman is 48257, not in this wave), so that scan must be re-run and written to an artifact before any engineering is built against it.

### Corrections applied after review

Every defect the reviewer raised was verified against source and fixed, not argued with.

1. **48213 is Henderson, not Kaufman.** Confirmed against the membership file: 48213 is Henderson; Kaufman is 48257 and is not a Wave 3 member. Corrected throughout.
2. **The DBF attribute table had no evidence artifact.** The reviewer was right that the dry logs could never corroborate it, since the guard throws on the first offending feature and leaves the second unevidenced in both counties. The probe was re-run and written to `_inbox/2026-08-08_L2_WAVE3_placeholder_defect_probe.json`, which records every offending record's index, bbox edges, and full DBF attributes across all three counties, and independently confirms `all_offenders_are_null_placeholders: true` for each. The thesis held on re-measurement.
3. **Bosque's seam bar was miscalibrated** at a remembered 1.30 against a measured 1.1546. Corrected, and the prediction sharpened: Bosque should land *above* 1.30, and a value near the 1.15 mean would be the actual warning sign.
4. **Dangling frontmatter references** to a non-existent report file, corrected to the real artifacts.
5. **"No per-feature exclusion path exists" was wrong.** A skip path exists and fired 148 times across 9 of the 22 landed counties, recorded only as a bare count. This is now documented in the defect-family doc as the cautionary example that reshapes the recommendation: the task is not to add a declination path but to make every declination, including those 148, carry record identity.

Claim 9 is accepted as killed. Bosque and the five metros never ran, and this report states that plainly rather than claiming the ordering discipline was demonstrated. The Wood park is accepted as conditioned: it stands as executed for this wave, but it is now an unsolved blocker rather than a settled ruling, and the report's recommendation section treats it that way.

## Verbatim git status

### `P:\legacy-design-tools-wave0` (execution tree)

```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_nfhl_48.zip
	.tmp_wave0_tls/
	lib/db/scripts/.tmp_after_migrate_check.mjs
	lib/db/scripts/.tmp_before_check.mjs

nothing added to commit but untracked files present (use "git add" to track)
```

HEAD: `de4fc8b906730f3a036b2c9494b22c1acfb03916`. No tracked file modified — the guard and all ingest code are untouched.

### `P:\doc_repo`

HEAD: `ca031ef9b4f1dd6966c1fd846c42e9ce177273de`. Wave 3 resume artifacts are untracked additions under `_inbox/2026-08-08_L2_WAVE3_*`. No commit requested or made.

## What a resume needs

1. **Blocking.** W3-PLACEHOLDER-FAMILY must be resolved before another resume is worth launching: build the reviewed, identity-gated per-feature declination path, or obtain a publisher fix. At a 12.5 percent halt rate on counties actually attempted (3 of 24 that got as far as a dry-run), a further resume without this will simply halt again, and the five metros at the back of the queue will keep never running. Fold in the 148 unnamed skips while that work is open.
2. Membership = the 12 never-started, plus 48213 / 48291 / 48499 if the defect is addressed.
3. `DATABASE_URL` = direct primary only. `P:\tmp\txgio_db_url.txt` is the pooler and must not be used for writes; consider renaming it to make the trap impossible to fall into twice.
4. Keep archiving logs under a distinct prefix per attempt.
5. Bosque and the five metros still owed solo attended runs, Harris last.
