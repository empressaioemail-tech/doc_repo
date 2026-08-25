---
id: 2026-08-24_p77_travis_join_measure
title: P-77 Travis identity-join measure — how to run
status: active
date: 2026-08-24
plan_row: P-77
wdll_item: 3
instrument: scripts/p77-travis-join-measure.mjs
---

# P-77 Travis join measure

SQL-only instrument for Lane 3 WDLL item 3. A-027 held the serve / honest-miss half. This card measures hit / miss / vintage-gap / unmeasured on named map nodes at declared vintage `2026/cad-export`. Registry `prop_id_bad_rate` 0.51 is the size of the later fix, not this grade.

Join key: `cad_property (county_fips, normalizeCadPropId(prop_id))` at tax year 2026. Map node `48453:280238` is the StratMap `prop_id`. There is no `geo_id` join.

## Run

From `P:/doc_repo`:

```
node scripts/p77-travis-join-measure.mjs --self-test
```

Fixtures only. Exit 0 when every direction passes, including the not-vacuous case. Writes `_inbox/2026-08-24_p77_travis_join_measure.json` with live marked UNMEASURED.

```
node scripts/p77-travis-join-measure.mjs --live
```

Runs `--self-test` first. Then EXISTS against the named IDs only, using `DEPLOYMENT_DATABASE_URL` or `CORTEX_DATABASE_URL`, else the same gcloud secret path as `scripts/gate-grade.mjs`. Missing URL or a query error exits 2 with UNMEASURED. It does not fabricate a zero miss. It does not scan Travis county-wide.

`psql -c` does not interpolate `:'var'`. First live run (2026-08-25T02:07:22Z) failed that way and correctly stayed UNMEASURED. The SQL now interpolates digit-only literals after the scan guard. A `:'var'` shape is refused. Error text redacts `postgres://` URLs.

A third EXISTS flags `leading_zero_orphan` (store `prop_id` equals the node after TRIM LEADING 0, but is not identical). That does not change HIT/MISS.

## Live grade (2026-08-25T02:08:37Z)

Store: gcloud `legacy-design-tools-prod/DEPLOYMENT_DATABASE_URL:latest`. Session `BEGIN TRANSACTION READ ONLY`. N=11 at `2026/cad-export`.

| rollup | n |
| --- | ---: |
| hit | 10 |
| miss | 1 |
| vintage-gap | 0 |
| unmeasured | 0 |

Miss is exactly `48453:280238`. Hit class `280239` / `280210` / `280211` all HIT. Neighbor `280230` HIT. `leading_zero_orphan` is false on every named id, including the miss.

Two mechanisms for 280238 miss: (1) no `cad_property` row at this key, (2) a zero-padded store key the exact-id join misses. (2) is rejected by the orphan flag. This node is a gap. Travis CAMA on CAD account will not bind it. P-80 is gap-fill or a different key, not TRIM.

`prop_id_bad_rate` 0.51 is still not this grade.

## What it grades

Named block (diagnosis walk, 10 nodes): miss class `48453:280238`; hit class `48453:280239` plus `48453:280210` and `48453:280211`.

Travis sample N=11: those ten plus listed neighbor `48453:280230`. IDs not listed in the diagnosis or that same-neighborhood audit are not invented.

Per node: HIT if a `cad_property` row exists at tax year 2026; VINTAGE-GAP if a row exists only at another year; MISS if no row; UNMEASURED if the store was not queried. The WDLL three-bucket rollup folds vintage-gap into miss.
