---
id: 2026-08-08_L2_WAVE3_ADVERSARIAL_REVIEW
title: Adversarial review — L2 Wave 3 Texas parcel acquisition
date: 2026-08-08
status: complete
owner: adversarial-reviewer
mode: refute-not-bless
---

# L2 Wave 3 — adversarial review

**Verdict: PARTIAL** — nine of ten claims survive SQL and/or artifact inspection (two with conditions); claim 10 is KILLED for lack of the cited apply1 evidence. Reviewer performed SELECT-only probes against TxGIO deployment Neon via the direct (non-pooler) host `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb`, and SELECT-only against atoms DB `hauska_mcp` on the same Neon project via `substrate.url`. No ingest, merge, deploy, or atoms write.

## Method

- Membership / results / progress / retirement / 81 county JSON artifacts under `_inbox/2026-08-08_L2_WAVE3_*`
- First-attempt `orchestrator.log` and resume `orchestrator_resume.log`
- Per-landed county: `dry_predicts_apply`, dry vs apply1 `features`/`delete`/`insert`, `idempotent_row_count_held`, SQL `COUNT(*)` vs artifact `after.rows`
- Host fingerprint checked (no `-pooler`) before queries
- Inbox-wide grep for `read-only transaction` / `cannot execute DELETE` / `pooler` in Wave 3 artifacts

## Claim table

| # | Claim | Finding | Evidence |
|---|---|---|---|
| 1 | Store has **159** distinct `county_fips` and **9,226,564** rows in `txgio_parcel` | **SURVIVES** | Direct Neon: `SELECT COUNT(DISTINCT county_fips), COUNT(*) FROM txgio_parcel;` → `159\|9226564` |
| 2 | Membership 117; **80 landed** (incl. Presidio 48377 from aborted first attempt); **1 failed** (Wood 48499); **36 not started** after halt | **SURVIVES** (with papered summary gap) | Membership `wave3_count=117` / `wave3_sorted_by_bytes` len 117. County artifacts: **80** `pass:true` + **1** `pass:false` (48499). Membership minus artifacts = **36** FIPS. Presidio artifact `pass:true`, rows 39553; `membership_resume.already_landed={"48377":39553}`; first `orchestrator.log` shows Presidio `PASS=true` then batch halt. **Counter-evidence in planner's own summary:** `results.json` / `report.md` say `counties_landed: 79` and `landed_fips` **excludes** 48377 (resume-scoped). Aggregate SQL math still holds: prior 79 ∪ 80 landed = 159. |
| 3 | Wood 48499 has **zero** rows; fail = fail-closed WGS84 guard; southLat≈13.92 | **SURVIVES** | SQL: zero-row set includes `48499` (`unnest(...'48499'...) EXCEPT SELECT county_fips` returned `48499`). Dry log FATAL: `TxgioProjectionError: county 48499 feature 43504: bbox [..., 13.919695862000026, ...] falls outside the plausible Texas WGS84 envelope [-107.5, 25, -93, 37]` with `southLat: 13.919695862000026`. Artifact SHP header `ymin: 13.9197`. |
| 4 | Bosque 48035, Donley 48129, five metros (48201,48157,48339,48141,48039) have **zero** Wave-3 writes | **CONDITION** | SQL: none of `{48035,48129,48201,48157,48339,48141,48039}` appear in `txgio_parcel` (EXCEPT list returns all seven). Bosque + five metros are in membership partition (`bosque_solo` / `solo_last`) and marked `wave_halted_upstream` / not started — zero writes expected. **Donley 48129 is NOT in Wave 3 membership** (`DONLEY_IN_WAVE3 False`) and not in prior-79 either; citing it as a Wave-3 non-write is vacuously true and scope-misleading. |
| 5 | For EVERY landed Wave 3 county: dry predicts apply (features/delete/insert dry==apply1) | **SURVIVES** | All 80 landed county JSONs: `dry_predicts_apply: true` and `dry.{features,delete,insert} == apply1.{features,delete,insert}` — **0 mismatches**. Spot-check also: SQL `COUNT(*)` == artifact `after.rows` == `rows_written` for all 80 — **0 mismatches**. |
| 6 | Idempotency checked per landed county (`idempotent_row_count_held` true), not sampled | **SURVIVES** | All 80 landed artifacts: `idempotent_row_count_held: true` and `rows_unchanged_after_idempotent: true` — full set, not sample. |
| 7 | Nothing outside membership written; prior baseline before any Wave3 was 79 counties | **SURVIVES** | `baseline.json` / membership `store_distinct_fips` len **79**. Live set equality: `live == prior ∪ landed` (**True**); `UNEXPECTED_FIPS []`; `PRIOR_EQ_LIVE_NOT_WAVE3 True`. Live: 159 distinct. Resume baseline of 80 is **post-Presidio**, not pre-Wave3. |
| 8 | No county silently skipped inside the attempted set before halt; not_started only after halt | **SURVIVES** | Resume batch order: batches 1–9 all PASS; batch 10 runs all 8 in parallel — Wood FAIL dry-run, seven siblings PASS; batches 11–14 + bosque + metros = NO_ARTIFACT / `wave_halted_upstream`. `NONPASS_BEFORE_FIRST_FAIL []`. `attempted_fips` (80) == `landed_fips` (79 resume) ∪ `{48499}`. |
| 9 | Kenedy 48261 retirement path: legacy `48261:_feature-0` retired; vintage-scoped successor active | **SURVIVES** (wording condition) | Retirement artifact: `orphansRetired: 1`, orphan sample `48261:_feature-0`. Atoms DB `hauska_mcp` SELECT: `48261:_feature-0\|retired\|stratmap25-landparcels_48261_kenedy_202503\|t`; status dist `active\|528` / `retired\|1`. Successors are **prop_id** entity ids (e.g. `48261:85313`) carrying `body.sourceVintage=stratmap25-landparcels_48261_kenedy_202503` — vintage lives on the body field, not the entity_id string. |
| 10 | First batch failure was Neon pooler read-only (`cannot execute DELETE in a read-only transaction`); resume used direct endpoint — confirm via apply1 logs | **KILLED** | Inbox-wide grep of all `2026-08-08_L2_WAVE3*` artifacts: **zero** hits for `read-only transaction` / `cannot execute DELETE` / `pooler`. Surviving `*_apply1.log` files (including first-batch counties such as 48387) are **successful resume** runs (insert summaries, exit 0) — first-attempt stderr was overwritten. First `orchestrator.log` only records `*** WAVE HALTED at <fips>: apply1 exit 1 ***` with no Postgres error text. Report.md likewise never names pooler/read-only. **Cannot confirm** pooler as root cause, nor that resume's `DATABASE_URL` was the direct endpoint, from the cited apply1 logs. |

## Papered-over gaps

1. **Resume-scoped undercount.** `results.json` / `report.md` headline "landed 79" omits Presidio, which the planner's 80-count explicitly includes via `already_landed`. Anyone reading only the report will understate landed counties by one.
2. **Baseline double bookkeeping.** `baseline.json` = 79 / 6,372,600 (pre-any-Wave3). `results.json` `baseline_distinct_county_fips: 80` / `baseline_rows: 6412153` is the **resume** baseline after Presidio landed. Easy to conflate.
3. **First-attempt failure forensics destroyed.** Apply1 logs for the seven first-attempt failures were replaced by successful resume apply1 logs. The specific Postgres error string required by claim 10 is not recoverable from the Wave 3 inbox.
4. **Donley in the zero-write list.** Donley was never Wave 3 membership; bundling it with halted Bosque/metros dresses an out-of-scope absence as an in-wave control.
5. **Claim 10 narrative without artifact.** Plausible (Neon pooler is known in this fleet; first batch did fail apply1 while Presidio committed), but unverified — adversarial standard rejects it.
6. **`results.results` marks 36 not-started as `pass:false` + `halt_reason: wave_halted_upstream`.** Not silent skips, but a reader of `pass` counts without `not_started_fips` will see 37 fails instead of 1 fail + 36 not started.

## Verbatim SQL / log lines (selection)

```
159|9226564
```

```
48377|39553
```

Zero-row FIPS among watched set (EXCEPT against live counties):

```
48339
48201
48035
48039
48141
48499
48129
48157
```

Atoms:

```
48261:_feature-0|retired|stratmap25-landparcels_48261_kenedy_202503|t
active|528
retired|1
```

Wood dry FATAL (truncated to error):

```
[txgio-ingest] FATAL: TxgioProjectionError: county 48499 feature 43504: bbox [-96.11974769799997, 13.919695862000026, -96.11837544999997, 13.923654807000048] falls outside the plausible Texas WGS84 envelope [-107.5, 25, -93, 37] — coordinates are not WGS84 degrees (projected meters? swapped axes?). Refusing to ingest.
```

First-attempt halt (no pooler text):

```
*** WAVE HALTED at 48387: apply1 exit 1 ***
```

## Verbatim verdict paragraph (paste-ready)

Wave 3 adversarial review is PARTIAL: store truth 159 distinct / 9,226,564 rows is live on direct Neon; membership 117 with 80 landed county artifacts (including Presidio from the aborted first attempt), Wood 48499 failed fail-closed on WGS84 southLat≈13.92 with zero rows, and 36 members never started after the Wood halt; dry==apply1 and idempotent_row_count_held hold for all 80 landed counties; live FIPS equals prior-79 ∪ landed-80 with no unexpected counties; Kenedy retirement is live (legacy `48261:_feature-0` retired, 528 active prop_id successors); but the claim that first-batch failure was Neon pooler read-only (`cannot execute DELETE in a read-only transaction`) is KILLED — no Wave 3 apply1 log or report retains that error string (first-attempt logs were overwritten), and Donley’s “zero Wave-3 writes” control is CONDITIONED because Donley was never in Wave 3 membership.
