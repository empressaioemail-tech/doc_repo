---
id: 2026-08-25_review_caldwell_rebake
title: Adversarial review — P-78 Caldwell leftover rebake
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: origin/main c714d25 (close fix); apply 85928e5
---

# Review: Caldwell 48055 leftover rebake

Apply is real. 48055 only. Pin still `ready:false`. Do not roll it back. Do not flip L17. The close over-claims Path A and inspect enrichment.

## Accept

- Announce filed. Isolated LDT `46e1a5a1`. Log is `--county=48055` only. No fallback flag.
- 26155 read, 24989 parsed, 1166 in-file dupes, 24989 upserted. Matches dry-run row count minus dups.
- After @ 2025: n 24989, year_built 16937, land_acres 24989. Prop_id `0` keys = 1, named not success.
- year 16937 vs dry-run 17163 is the 1166-dupe collapse, not a parser miss.
- Scope locks held. No second apply.

## Reject or hold

### 1. Announced Path A. Store is an insert of tax_year 2025.

Before JSON: 0 rows at 2025. Close delta note says insert path. Path A is same-PK in-place. This is Path B (new year). Amend the announce and close. Do not call it a merge onto existing Caldwell CAMA keys.

### 2. Leftover is not on the inspect read set.

Registry `tx-48055` is already `current_tax_year=2026` / `current_tier=cad-export`. Structural inspect binds declared vintage. Year/acres landed on 2025 StratMap rows. A 2026 CAD click will not see this leftover. Do not flip L17 to 2025 to make the demo work.

### 3. Before/after never counted other tax years.

WDLL item 3 allowed StratMap-year only. That hid whether 2026 (or 2024) Caldwell rows already existed. File one COUNT grouped by `tax_year` for `county_fips='48055'`: n, year_built non-null, land_acres non-null. No `SELECT *`. No UPDATE.

### 4. `source_vintage` is unstructured.

CLI stamps DBF basename unless `bulk_primary && --allow-stratmap-fallback`. After `vintageTop` is `stratmap25-landparcels_48055_caldwell_20…`, not `tier:stratmap-roll;`. Not CAMA, so P-78 CASE still treats it as non-CAMA. Next leftover county should stamp the structured prefix. Do not rewrite these 24989 rows this card.

## Do not

DELETE the 2025 rows. Replay onto 2026. Flip L17. Atoms `--apply`. Rematerialize. Second county. Dallas/Tarrant. P-80 / P-79 / P-09 / COVER.

## Grades vs WDLL

| Item | Their grade | This review |
| --- | --- | --- |
| 2–4, 6–8 | met | met |
| 3 | met | met on the 2025 query; incomplete as a county census |
| 5 | met | met as 2025 leftover land; not met as Path A merge or inspect enrichment |

## leave_behind for this agent (docs + one COUNT)

File `_inbox/2026-08-25_p78_caldwell_48055_tax_year_census.json`. Amend close + announce to Path B insert @ 2025, L17 stays 2026. Then stop again.
