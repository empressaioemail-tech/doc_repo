---
id: 2026-08-24_parcel_facts_write_path_claude_code
title: Session close — parcel public-facts write-path wrap
date: 2026-08-24
agent: planner
repo: docs
session_type: planning
memory_graded: [M-001:HELPED, standing-decisions-travel:HELPED, dispatches-are-compiled-not-authored:HELPED]
rolled_up: false
rolled_up_into:
snapshot: doc_repo main @ 54d791d (instruments already pushed); this close adds session + handoff
plan_row: P-73
---

## What was done

Adversarial review of the parcel public-facts deficit canvas against three disagreeing sequences (Phase 2 stack, feasibility §6, canvas roadmap-fit). Code-read corrections flipped the stack: two StratMap paths, L20 zoning ≠ footprints, city limits ≠ ETJ, REST harvest writer absent, `upsertCadProperties` last-wins, Travis join is `prop_id` only, living area live vs situs baked.

Filed the write-path program (game plan, WDLL, P-73 field map, A-026/A-027, decision). Operator go A-027 is P-75 / P-76 only. CAMA and footprint held.

Five wrap-time instruments were spawned, then adversarially reviewed and hardened. Shipped on `54d791d`:

- Live Neon counts 2026-08-25T01:58:19Z: `tx_city_boundary` 1222/1222 geo_id; staging 10196. Exact match to L22/ss-w15.
- Caldwell 48055 StratMap: YEAR_BUILT is C(60), 65.62% non-blank, 34.14% comma lists. GIS_AREA_U 100% Acres on that county only.
- P-78 merge spec + F1–F8. F8 first-valid-YYYY. Selftest must keep passing.
- P-77 measure live 2026-08-25T02:08:37Z: 10 hit / 1 miss / 0 vintage-gap / 0 unmeasured. Miss `48453:280238` `leading_zero_orphan=false`. First live fail: `psql -c` does not interpolate `:'var'`.
- Hop diagram: structural live vs situs baked vs Wave 1 unwired.

Handoff for the next planner: `_inbox/2026-08-24_write_path_planner_handoff.md`.

No product PRs. No `--apply`. No CAMA zip. Integration checkout; property `_state` not written (seat-worktree-gate). Thesis parity: none (no atom / access / capture / tile write).

## What was learned (changes to ground truth)

A `cad_property` write is not an inspect-title write. Cortex live-reads CAD for structural living area only. Title, land-use chip, and acreage are baked from `txgio_parcel` via `place_layer_snapshots`. PE never queries `cad_property`. Year built is on the structural wire and is not rendered.

`YEAR_BUILT` is a character list. `Number()` drops a third of Caldwell. First valid YYYY in [1800, 2027]; skip junk (`209`).

`GIS_AREA` is not safely acres without `GIS_AREA_U`. One county being Acres does not prove the unit.

`48453:280238` is a gap, not a padded key. Travis CAMA will not bind it. P-80 is gap-fill or a different key.

`psql -c` does not interpolate `:'var'`. A self-test that only builds the SQL string will not catch that. Staying UNMEASURED on the first live fail was the instrument working.

Live Wave 1 store counts matching L22/ss-w15 exactly means an unchanged store is possible. The timestamp is the new fact. Empty-index lie remains a code-path risk on origin/main (`unincorporated` on empty), not an empty table (1222 rows live).

0076 is on `origin/main` (PR #427). Pin Wave 1 LDT to `244567a5`. Property-seat LDT and A2 PE trees are the wrong snapshot.

## What's still open

P-75 and P-76 customer-done: isolated trees exist (`P:/tmp/ldt-lane3-wave1`, `P:/tmp/ldt-lane3-p76`), CP1s filed, readers uncommitted, cortex + PE deploys owed. A-027 go still stands.

P-74 situs: isolated hauska-map from `origin/main`, not A2. Named, not this go.

P-77 honest-miss serve half: held (A-027). Measure is done.

P-78 product rewrite: spec exists; cad-ingest SET not started. Do not start P-25 until last-wins fails F1/F3 in product.

P-25 / P-79 / P-80 / P-09 / COVER: held. A-017 and A-022 stand.

P-25 close contract (store % + live living-area probe + named atom-apply leave_behind) still unwritten.

Property seat STATE pickup owed (this close ran on integration).

## Suggested canonical doc updates

None beyond this close's WDLL grades and game-plan leave_behind. Do not promote the `psql -c` LESSON into MEMORY.md; the P-77 `:'var'` refuse is the guard.

## WDLL start-vs-finish (program card, this wrap)

| item | grade | evidence |
| --- | --- | --- |
| 1 P-73 map | met | `_inbox/2026-08-24_p73_ingest_bound_field_map.md` on `54d791d` |
| 2 OPS-16 rows | met | A-026 / A-027 on `54d791d`; P-74 compiles, P-81 refuses (verified prior) |
| 3 P-74 situs | dropped | A-027 named, not this go |
| 4 P-75 who-serves | partial | WDLL + CP1; not live gold |
| 5 P-76 city limits | partial | WDLL + CP1; live table 1222; not live gold |
| 6 P-77 measure | met | live JSON 2026-08-25T02:08:37Z 10/1/0/0 |
| 7 P-77 honest miss | dropped | A-027 held serve half |
| 8 P-78 authority in cad-ingest | partial | spec + F1–F8; product SET not started |
| 9 P-78 leftover StratMap | dropped | spec only; `landuse.ts` still hard-nulls |
| 10 P-25 Dallas/Tarrant | dropped | held |
| 11 no silent scope | met | no CAMA / harvest / footprint / P-80 this session |
| 12 close hygiene | met | this file; leave_behind updated; thesis parity none |

## leave_behind

```
leave_behind:
  - item: P-75 / P-76 customer-done (cortex + PE). Handoff _inbox/2026-08-24_write_path_planner_handoff.md
    owner: planner
    plan_row: P-75
  - item: A2 PE tree still holds property hauska-map; P-74 needs isolated origin/main tree
    owner: property
    plan_row: P-74
  - item: P-78 product rewrite; spec exists; do not start P-25 until SET is in cad-ingest
    owner: planner
    plan_row: P-78
  - item: P-77 honest-miss serve half held
    owner: planner
    plan_row: P-77
  - item: property _state pickup (this close ran on integration)
    owner: property
    plan_row: P-73
```

## Lessons for planner gate (do not self-promote)

- `psql -c` does not interpolate `:'var'`. Guard already in `scripts/p77-travis-join-measure.mjs`.
- First-valid-YYYY on StratMap YEAR_BUILT. Guard already F8.
