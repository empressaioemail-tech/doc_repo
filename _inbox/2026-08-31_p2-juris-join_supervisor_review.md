---
id: 2026-08-31_p2-juris-join_supervisor_review
title: Supervisor grade — P2-JURIS join rewrite
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: P2-JURIS-JOIN
plan_row: F-01
agent: 8c113b02-dd85-4eff-8cbe-db62173b2dfb
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p2-juris-join seat/property-ctx-p2-juris-join HEAD a7a804220ad046ac3c70e286d61c83595bb3afe3; rewrite uncommitted
---

# Supervisor grade — P2-JURIS join rewrite

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran `node --test test/p2-juris-sql.test.mjs` in that tree: 7 pass / 0 fail. Did not connect a store. Did not run live 05. Did not commit.

## Verdict

File-side rewrite accepted. Live 05 is still the gate. Do not commit before that EXPLAIN. TOTALS stays UNMEASURED.

| Item | Grade | Evidence |
|---|---|---|
| Same unlimited join on 01 and 05 | MET | ON clause is `county_fips` equality, geom not null, four bbox inequalities, `ST_Intersects`. 05 has no LIMIT. 01 DO block stays. No `1/0`. No LATERAL. Timeouts 180s / 30s. |
| Hash Join can enter the method set | MET as write-path | Hash Join needs equality in `hashclauses`. The poison quals had none. `p.county_fips = c.county_fips` is that equality. `parcels_six` stays MATERIALIZED. |
| Named poison shape unrepresentable | MET as file-side | `cities_ok AS NOT MATERIALIZED` is a bind. EXPLAIN cannot emit `CTE Scan on cities_ok`. Classifier conjunct three is then false. |
| Both-arm tests | MET | Poison fixture rejected. HASH_CTE fixture accepted. Empty plan refuses. RO guard both arms. Supervisor re-ran: 7 / 0. |
| Live 05 | NOT THIS CARD | HASH_CTE is invented text. It proves the classifier, not the store. |

## Findings that stay open

County equality can miss a ring that leaves its `county_fips` and hits a city that does not intersect that county. The 2026-08-30 measure was all-cities bbox plus intersects. A miss names the join. Do not adopt a new split.

`isMillionRowCteNestedLoop` still accepts Nested Loop of `CTE Scan on parcels_six` against an inlined city scan. That is a finding, not a pass. The close already says so.

## leave_behind

- Live 05 EXPLAIN, planner-run, through `assert-explain-plan.mjs`.
- Timed 01 after 05. Reconcile 357269 / 624141 / 981410.
- Uncommitted four files on this tree. Commit after live 05, by pathspec.
