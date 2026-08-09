---
title: Parcel-Node Writer Sweep — Rail 1 County-by-County Run
date: 2026-08-08
status: halted-on-mismatch
author: data-run-executor (Claude Code, hauska-engine)
---

# Parcel-Node Writer Sweep — Rail 1 County-by-County Run

Operator-authorized 2026-08-08. Executed directly against `packages/engine-core/scripts/write-parcel-node-county.mjs` (engine main `f8961ab`, later confirmed unchanged at `a15f7b7` head at session start) using the direct Neon host for the atoms store (`ep-lucky-truth-apodo8hr.c-7...`, not the `-pooler` host) and the direct Neon host for the LDT/txgio store. No merges, no deploys, no TxGIO acquisition run or touched. No lock or VACUUM issued against `txgio_parcel`.

## Outcome in one line

45 of 46 attempted counties landed clean (dry predicted exactly what apply wrote, write-then-verify passed on every atom, orphan-verdict OK). The 46th, Wilbarger (48487), failed mid-apply on a dropped database connection (`ECONNRESET`) after writing 8,380 of a planned 11,143 atoms — a genuine dry/apply mismatch. Per the halt directive, the run stopped there; Wilbarger was not re-run or patched.

## Store-truth sizing (step 1 of the brief)

`--list-counties` against `txgio_parcel` at execution time (Geometry Law rule 8, no hardcoded roster):

- **159 counties** have `txgio_parcel` rows.
- **7,963,305** distinct features (post-seam-factor de-dup) across those counties; **9,226,564** raw tile rows.
- Before this run, **1 county** (Kenedy, 48261) had `parcel-node` atoms in the atoms store — 529 atoms, matching the previously-proven run.
- Every other loaded county was a genuine first-write.

## The run

Counties were processed smallest-first by distinct-feature count (`sorted_counties.tsv`, generated from the store-truth roster, excluding Kenedy). For every county: dry-run first, compare `atomsBuilt` to the apply's `atomsWritten`/`verified`, and require `orphanVerdict.ok === true`. A wrapper script (`run_county.sh`) automated this dry-then-apply-then-compare sequence and exits non-zero on any mismatch; it did not retry or continue past a failure.

### Counties landed clean (45)

All 45 below: dry `atomsBuilt` == apply `atomsWritten` == `verified`, zero `verifyFailures`, `orphanVerdict.ok: true` (first-write counties, so `orphans: 0` was itself the correct prediction — nothing to retire on a first write).

| FIPS | County | Atoms Written | Resolved | Absent | Wall (ms) |
|---|---|---|---|---|---|
| 48393 | Roberts | 2,574 | 2 | 2,572 | 18,279 |
| 48173 | Glasscock | 2,910 | 2,466 | 444 | 18,776 |
| 48033 | Borden | 3,288 | 2,487 | 801 | 19,885 |
| 48359 | Oldham | 4,162 | 2 | 4,160 | 22,722 |
| 48311 | McMullen | 3,803 | 3,098 | 705 | 23,562 |
| 48417 | Shackelford | 5,420 | 4,407 | 1,013 | 39,040 |
| 48443 | Terrell | 5,527 | 4,563 | 964 | 38,799 |
| 48205 | Hartley | 5,564 | 4,905 | 659 | 44,699 |
| 48079 | Cochran | 5,280 | 4,714 | 566 | 35,918 |
| 48047 | Brooks | 5,630 | 5,037 | 593 | 35,972 |
| 48435 | Sutton | 5,803 | 5,049 | 754 | 31,019 |
| 48017 | Bailey | 5,897 | 5,710 | 187 | 30,249 |
| 48111 | Dallam | 6,154 | 5,715 | 439 | 33,024 |
| 48023 | Baylor | 6,287 | 5,399 | 888 | 35,546 |
| 48275 | Knox | 6,322 | 5,140 | 1,182 | 45,138 |
| 48119 | Delta | 6,399 | 5,880 | 519 | 41,076 |
| 48069 | Castro | 6,339 | 6,126 | 213 | 41,439 |
| 48357 | Ochiltree | 6,501 | 6,340 | 161 | 53,356 |
| 48413 | Schleicher | 4,868 | 4,685 | 183 | 37,990 |
| 48169 | Garza | 5,699 | 5,050 | 649 | 38,956 |
| 48369 | Parmer | 6,481 | 6,041 | 440 | 37,611 |
| 48437 | Swisher | 6,406 | 6,221 | 185 | 35,788 |
| 48425 | Somervell | 6,695 | 6,497 | 198 | 48,309 |
| 48495 | Winkler | 7,171 | 6,313 | 858 | 58,174 |
| 48501 | Yoakum | 7,246 | 6,492 | 754 | 55,073 |
| 48095 | Concho | 7,629 | 7,057 | 572 | 64,699 |
| 48081 | Coke | 7,201 | 6,057 | 1,144 | 50,583 |
| 48385 | Real | 8,142 | 7,153 | 989 | 50,093 |
| 48335 | Mitchell | 7,669 | 7,530 | 139 | 45,564 |
| 48333 | Mills | 8,753 | 7,615 | 1,138 | 55,051 |
| 48319 | Mason | 8,650 | 7,321 | 1,329 | 52,121 |
| 48445 | Terry | 8,946 | 8,819 | 127 | 53,016 |
| 48345 | Motley | 9,354 | 4,100 | 5,254 | 53,943 |
| 48267 | Kimble | 9,357 | 8,028 | 1,329 | 62,282 |
| 48009 | Archer | 9,200 | 8,439 | 761 | 74,196 |
| 48507 | Zavala | 9,535 | 8,559 | 976 | 70,688 |
| 48137 | Edwards | 9,369 | 8,787 | 582 | 78,870 |
| 48313 | Madison | 10,041 | 9,765 | 276 | 60,713 |
| 48175 | Goliad | 9,874 | 8,157 | 1,717 | 61,764 |
| 48283 | LaSalle | 9,845 | 7,254 | 2,591 | 80,191 |
| 48003 | Andrews | 10,497 | 10,074 | 423 | 64,877 |
| 48117 | Deaf Smith | 10,604 | 10,323 | 281 | 86,494 |
| 48271 | Kinney | 10,593 | 9,959 | 634 | 86,259 |
| 48295 | Lipscomb | 7,415 | 3,255 | 4,160 | 53,380 |
| 48063 | Camp | 11,463 | 10,845 | 618 | 360,606 |

**Total atoms written across the 45 clean counties: 322,563.**

### County that halted the run (1)

**48487, Wilbarger.** Dry run predicted 11,143 atoms (10,044 resolved, 1,099 absent — 158 geometry-incomplete, 941 parcel-key-unresolved; 531 multi-feature accounts folding 751 extra features). The apply began, progressed cleanly through 8,000 of 11,143 (write-then-verify passing at every 500-row checkpoint up to that point), then failed:

```
Error: read ECONNRESET
    at TLSWrap.onStreamRead (node:internal/stream_base_commons:216:20)
    at cachedError (.../postgres@3.4.9/src/query.js:170:23)
    at new Query (.../postgres@3.4.9/src/query.js:36:24)
    at PgStorage.sql (.../packages/storage/src/pg-storage.ts:318:25)
```

The process exited 1 before the orphan-retirement/no-active-orphan post-condition ever ran, because it never reached that stage.

**Live store state for 48487, confirmed by direct SQL query against the atoms store (not the script's self-report):**

```
SELECT coalesce(body->>'status','active') as status, count(*)::int as n
FROM atoms WHERE entity_type='parcel-node' AND body->>'countyFips'='48487' GROUP BY 1;
→ [{"status":"active","n":8380}]
```

8,380 active atoms sit in the store against a planned 11,143 — a partial write, all still `active`, none retired, no verify failure recorded (the failure was a mid-stream connection drop between batches, not a write-then-verify rejection). This is the mismatch the brief said to treat as the finding rather than repair. **The run halted here. Wilbarger was not re-run, not patched, not re-applied.**

Root cause is a dropped TLS connection to the direct (non-pooled) Neon host mid-batch-loop, not a data or plan defect — the same class of transient network failure that a pooler is often used to paper over, which is part of why the direct host is required for writes but also why long single-connection loops over `postgres` on a direct host are more exposed to a mid-run drop than a pooled, retry-friendly path would be. This is a repair candidate (retry/backoff around the batch loop, or resuming a partial apply from its last verified batch) but implementing that repair was out of scope for this halt-on-mismatch run.

## Manifest check (step 7 of the brief)

`GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`, checked before the run and after every 10 counties (5 checkpoints: baseline, 10, 20, 30, 40, plus a final check at halt):

| Checkpoint | `onboardedCount` | `satisfiedCells` | `texasCompletenessPct` |
|---|---|---|---|
| Baseline (pre-run) | 1 / 254 | 1 / 3048 | 0.0395176197... |
| After 10 counties | 1 / 254 | 1 / 3048 | 0.0395176197... (unchanged) |
| After 20 counties | 1 / 254 | 1 / 3048 | 0.0395176197... (unchanged) |
| After 30 counties | 1 / 254 | 1 / 3048 | 0.0395176197... (unchanged) |
| After 40 counties | 1 / 254 | 1 / 3048 | 0.0395176197... (unchanged) |
| Final (halt point) | 1 / 254 | 1 / 3048 | 0.0395176197... (unchanged) |

**The manifest number did not move at all across the entire run.** This is a finding, not a null result to wave away.

### Finding: the manifest's `geometry` rail is not wired to `parcel-node` atom presence

I checked `manifestCells` directly (the ledger's per-county, per-rail array) rather than trusting the top-line summary. Every county has a `geometry` rail cell with `displayState`. For **Kenedy (48261) — the one county proven to already hold verified parcel-node atoms in the store before this run started (529 of them, independently confirmed by direct SQL)** — the `geometry` rail cell reads:

```json
{"countyFips":"48261","railKey":"geometry","displayState":"no-writer","hasWriter":false,"atomFamilyState":"present", ...}
```

`hasWriter: false` and `displayState: "no-writer"` for a county that has had a working parcel-node writer and verified atoms in the store for some time. Every one of the 45 newly-written counties reads identically — `no-writer`, `hasWriter: false` — despite atoms verified present and write-then-verified in the atoms store by this run. None of the manifest's 12 rail keys (`geometry`, `cad`, `zoning`, `roads`, `flood`, `envelope`, `landuse`, `footprint`, `easement`, `owner`, `rrc`, `mud`) shows a state that tracks with parcel-node atom presence for any of the 46 counties this run touched.

This means: **the manifest's stagnant number across this entire run is not evidence the writes failed or didn't count** — independent SQL against the atoms store confirms 331,472 parcel-node atoms across 47 counties are live and durable. It is evidence that the county-ledger service's `geometry` rail reader is not (yet, or not currently) wired to read the `parcel-node` atom family at all, for any county, including the one the writer was originally proven against. Fixing that wiring is outside this run's mandate (I write atoms; I do not touch the ledger/manifest service, and the brief's own text frames PR #287 and the manifest number as blocked by this seam, not as something this run's atom-writing alone closes). Flagging precisely so nobody re-derives "the writer doesn't work" from a manifest number that was never reading this rail correctly for even the one already-proven county.

## Independent store verification (not self-reported)

All figures below came from direct `SELECT` queries against the atoms store via the direct Neon host, run separately from the writer script's own summaries:

- Before this run: 1 county (Kenedy), 529 atoms.
- After 10 counties: (not independently re-queried at that checkpoint; captured at 30 and 40 instead).
- After 30 counties: 31 counties, 178,349 atoms.
- After 40 counties: 41 counties, 272,520 atoms.
- **Final (at halt): 47 counties, 331,472 atoms.** Reconciles exactly: 529 (Kenedy) + 322,563 (45 clean counties) + 8,380 (Wilbarger partial) = 331,472.

## Known-canon items, not rediscovered here

- Bell 48027 (694-parcel north-of-Census-line CAD-jurisdiction reality) was not touched this run — it was not reached in the smallest-first ordering (Bell has 167,412 features, far down the queue).
- Wood 48499 (corrupt feature at ~13.92 latitude) was not touched this run — not reached.
- The 16-of-19 counties with no geometry ring were not addressed here; this run's scope was the `parcel-node` writer against `txgio_parcel`, a different rail.

## What is NOT done

113 of the 158 remaining first-write counties (after excluding Kenedy) were never attempted: everything from the 47th-smallest county onward in the sorted queue was not reached. The full sorted-but-unattempted list is `sorted_counties.tsv`, rows 47–158 (Wilbarger, row 46, is the partial; rows 1–45 are the clean landings above).

The largest counties — Harris (not in the 159-county roster returned; check separately), Tarrant (757,161 features), Dallas (694,160), Travis (828,773), Bexar (709,541), Collin (387,737), Denton (353,631) — were never approached; the smallest-first ordering means they sit at the far end of the queue and this halt happened at roughly county 46 of 159.

## Recommended next step (not executed — outside this run's mandate)

1. Decide the correct repair for Wilbarger before resuming: either (a) make the writer resilient to a mid-batch `ECONNRESET` by resuming from the last verified batch rather than restarting the whole county, or (b) accept a from-scratch re-run of just 48487 once connection stability is addressed, given the upsert is idempotent per the script's own header (`atom_did` derived from `parcelNodeId`, so a clean re-run over the same source would not duplicate the 8,380 already-active rows). Re-running Wilbarger is a repair decision for the operator, not something this halt should do unilaterally.
2. Separately: the county-ledger `geometry` rail wiring gap (Kenedy showing `no-writer` despite a proven, verified writer) is worth its own ticket — the manifest number this whole program is trying to move will not move no matter how many counties get atoms until that reader is fixed.

## Artifacts

Per-county dry and apply JSON (46 counties x 2 = 92 files, plus 46 `.log` files) at `P:\tmp\parcel_node_sweep\`. Store-truth roster at `P:\tmp\parcel_node_sweep\roster_clean.json` (159 counties). Sorted attempt queue at `P:\tmp\parcel_node_sweep\sorted_counties.tsv`. Manifest snapshots at each checkpoint (`manifest_baseline.json`, `manifest_checkpoint_10.json`, `_20.json`, `_30.json`, `_40.json`, `manifest_final.json`).
