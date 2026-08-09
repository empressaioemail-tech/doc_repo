---
id: 2026-08-08_L2_WAVE3_MASTER_REPORT
title: L2 Wave 3 master report — retirement proof, partial acquisition, Wood halt
date: 2026-08-08
status: halted
owner: wave3-execution-planner
related: [_inbox/2026-08-08_L2_wave_plan, _inbox/2026-08-08_L2_WAVES_0_2_MASTER_REPORT, _inbox/2026-08-08_L2_WAVE3_ADVERSARIAL_REVIEW]
memory_graded: deferred
---

# L2 Wave 3 master report

Wave 3 is **HALTED**, not complete. Retirement-path proof on Kenedy against the real atoms store **PASSED**. TxGIO acquisition landed **80 of 117** degree-vintage members, then fail-closed on Wood County 48499 (corrupt feature latitude ≈13.92). Bosque and the five metros were never started. Adversarial review verdict: **PARTIAL**.

## Retirement-path proof (gate — PASS)

Engine: `82728c3` (`fix(parcel-node): close C1/C3 FATAL gaps` / PR #285). County: Kenedy **48261** (already loaded geometry; already had 528 active `parcel-node` atoms from PR #284).

| Step | Result |
|---|---|
| Dry full | Predicted 528 writes, **1 synthetic orphan** (`48261:_feature-0`), 1 newId, 527 account-continuity survivors |
| Apply full | `atomsWritten=528`, `verified=528`, `orphansRetired=1`, `orphanVerdict.ok=true`, wall 9555 ms |
| Post-SQL | `48261:_feature-0` → **retired**; `48261:_feature-stratmap25-landparcels-48261-kenedy-202503-0` → **active** (different DID — no false continuity) |

Artifacts: `_inbox/2026-08-08_L2_WAVE3_retirement_dry_full.json`, `_inbox/2026-08-08_L2_WAVE3_retirement_apply.json`, `_inbox/2026-08-08_L2_WAVE3_retirement_gate.json`.

**Residual risk closed for CLI wiring on a real store.** C3.7 ring-binding stamp remains unfixed — do not re-acquire a warmed county for jurisdiction promotion under that gap.

## Wave membership (computed, not guessed)

Source: `_inbox/2026-08-08_SWEEP_county_source_matrix.json` ∩ store DISTINCT `county_fips`. Degree-vintage, live HTTP, exclude Donley 48129, exclude already-loaded.

| Partition | Count |
|---|---:|
| Concurrent batch | 111 |
| Bosque solo | 1 (`48035`) |
| Metro solo last | 5 (Brazoria → El Paso → Montgomery → Fort Bend → **Harris last**) |
| **Wave 3 total** | **117** |

Baseline before any Wave 3 write: **79** distinct / **6,372,600** rows.

## Attempted / landed / failed

| Metric | Value |
|---|---:|
| Attempted (started a worker) | 81 |
| Landed (pass=true artifacts) | **80** |
| Failed | **1** (Wood `48499`) |
| Not started after halt | **36** (batches 11–14 + Bosque + 5 metros) |
| Wave 3 rows in store among membership | **2,853,964** |
| Store after halt | **159** distinct / **9,226,564** rows / relation **12,455,026,688** bytes |

Resume wall clock (direct-primary run): **3618 s** (~60.3 min) for the 79 newly landed in that run. Presidio (`48377`, 39,553 rows) landed earlier in the aborted pooler attempt (~145 s into first attempt).

Dry predicted apply on every landed county. Idempotent re-apply held row count on every landed county. Zero rows outside Texas bounds on landed set. Wood never written.

### Failed county — Wood 48499 (FINDING, not workaround)

```
[txgio-ingest] FATAL: TxgioProjectionError: county 48499 feature 43504:
bbox [..., 13.919695862000026, ...] falls outside the plausible Texas WGS84
envelope [-107.5, 25, -93, 37]
```

SHP header `ymin` matches (13.9197). Fail-closed guard correct. Wave halted; Wood not skipped.

### Not started (36)

Remaining concurrent-batch members after Wood, plus Bosque 48035, Brazoria 48039, El Paso 48141, Montgomery 48339, Fort Bend 48157, Harris 48201. All zero rows in store.

## First-attempt halt — Neon pooler read-only (FINDING)

First launch used `DEPLOYMENT_DATABASE_URL` host `…-pooler…`. Presidio applied; seven peers failed on DELETE with Postgres `25006` / `cannot execute DELETE in a read-only transaction`. Resume switched to direct primary `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech` and batch concurrency resumed cleanly through batch 9.

**Forensic note:** resume overwrote the first-attempt `*_apply1.log` files. Inbox alone cannot prove the pooler string after overwrite. Planner session capture preserved at `_inbox/2026-08-08_L2_WAVE3_first_attempt_pooler_RO_forensic.md`. Adversarial review **KILLED** claim 10 against inbox-only evidence — fair under that standard; the forensic file is the residual record.

## Seam factors (80 landed)

Mean **1.2966**, min **1.0996**, max **2.1454** (Presidio). Consistent with Wave 2 mid-rural mix; no Kenedy-class 4.46 outlier in this landed set.

## Cost

Not obtainable — no per-county Neon/GCP meter queried without inventing a billing API.

## Defects / findings (stated, not worked around)

1. **W3-WOOD-48499:** StratMap archive contains at least one feature with south latitude ≈13.92; SHP header polluted; ingest fail-closed. Source defect; needs publisher fix or explicit withhold / carve decision before any resume past Wood.
2. **W3-POOLER-RO:** Neon pooler URL is unsafe for concurrent county DELETE+INSERT waves; direct primary required. First-attempt logs were destroyed by resume overwrite — FINDING W3-FORENSICS: do not reuse the same county log filename across attempts without archiving.
3. **W3-RESULTS-UNDERCCOUNT:** Resume `results.json` headlines landed=79 (omits Presidio). Aggregate truth is 80 landed county artifacts.
4. **TXGIO_COUNTIES drift** still open (hand map ≪ store).
5. **Table bloat / vacuum** still open; this wave ran idempotent apply2 on every landed county.
6. **C3.7 ring-binding** still unfixed.
7. **Cost metering** still open.
8. **Donley 48129** still not a wave member (404). **Bosque** still owed a solo attended run when Wave 3 resumes.

## Adversarial reviewer verdict (verbatim)

> Wave 3 adversarial review is PARTIAL: store truth 159 distinct / 9,226,564 rows is live on direct Neon; membership 117 with 80 landed county artifacts (including Presidio from the aborted first attempt), Wood 48499 failed fail-closed on WGS84 southLat≈13.92 with zero rows, and 36 members never started after the Wood halt; dry==apply1 and idempotent_row_count_held hold for all 80 landed counties; live FIPS equals prior-79 ∪ landed-80 with no unexpected counties; Kenedy retirement is live (legacy `48261:_feature-0` retired, 528 active prop_id successors); but the claim that first-batch failure was Neon pooler read-only (`cannot execute DELETE in a read-only transaction`) is KILLED — no Wave 3 apply1 log or report retains that error string (first-attempt logs were overwritten), and Donley’s “zero Wave-3 writes” control is CONDITIONED because Donley was never in Wave 3 membership.

Full review: `_inbox/2026-08-08_L2_WAVE3_ADVERSARIAL_REVIEW.md`.

Planner addendum on claim 9 wording: live SQL also shows the vintage-scoped synthetic successor `48261:_feature-stratmap25-landparcels-48261-kenedy-202503-0` **active** alongside the retired legacy bare key — not only prop_id survivors.

## What a resume needs (operator decision — not auto-started)

1. Source decision on Wood 48499 (withhold / fix / alternate).
2. Membership = remaining 36 + Wood if repaired; exclude the 80 already landed.
3. `DATABASE_URL` = **direct primary only** (never `-pooler` for this wave).
4. Archive prior attempt logs under a distinct prefix before re-running any FIPS.
5. Keep Bosque and five metros solo; Harris last.
6. Do not touch atoms Neon on the acquisition wave.

## Verbatim git status

### `P:\legacy-design-tools-wave0` (execution tree)

```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_wave0_tls/
	lib/db/scripts/.tmp_before_check.mjs

nothing added to commit but untracked files present (use "git add" to track)
```

HEAD: `de4fc8b906730f3a036b2c9494b22c1acfb03916` (includes `fb6a42b2` and later #398/#400).

### `P:\hauska-engine` (retirement proof ran at `82728c3`)

Retirement apply used commit `82728c3`. Subsequent shell observation found the primary checkout later on `feat/depth-warm-unified-runner` @ `a15f7b7` — another lane moved the tree; Wave 3 acquisition did not depend on that checkout.

### `P:\doc_repo`

Wave 3 artifacts untracked under `_inbox/2026-08-08_L2_WAVE3_*` (orchestrator, membership, per-county JSON/logs, retirement proofs, adversarial review, this master report). No commit requested.

## Agent accounting

| Agent | Role | Result |
|---|---|---|
| Wave 3 membership computer | store ∩ matrix | 117 members written |
| Wave 3 execution (planner-owned) | retire proof + ingest | Retirement PASS; 80 landed; halt at Wood |
| Adversarial reviewer | refute | **PARTIAL** (1 claim killed on forensics) |

Wave 4 (202505 reprojection) remains HELD.
