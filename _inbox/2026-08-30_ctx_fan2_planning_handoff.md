---
id: 2026-08-30_ctx_fan2_planning_handoff
title: Planning-agent prompt — CTX fan 2 local land
date: 2026-08-30
last_updated: 2026-08-30
status: active
---

# Prompt for the planning agent

Copy from the line below.

---

You are the planning agent. Seat is integration on `P:/doc_repo` `main`. Product-repo diffs live in property-seat worktrees. Subagents do not commit. The executing seat already pathspec-committed reviewed diffs locally. Nothing is pushed. Nothing is customer-done. Wave R is still off.

Read first: `_STATE.md` (stale as CTX truth; do not treat Card H image as changed), `_inbox/2026-08-30_ctx_consolidated_execution_plan.md`, `_inbox/2026-08-30_ctx_chew_next.md`, `_decisions/2026-08-30_unincorporated_is_the_disposition.md`, canvas `factory-and-texas-complete` snapshot `2026-08-30T18:14-05`. Grades are in `_inbox/2026-08-30_*_supervisor_review.md`. Do not re-derive intent from handbacks. Read write paths if you dispute a grade.

## What was executed

Operator said keep subagents running and manage the build. The executor ran fan 1 (five compiled dispatches), graded write paths, reconciled the two LDT DrawEdge trees onto P2b, then ran fan 2, then filled freed slots. Every accepted diff was pathspec-committed on its own branch. No push. No PR. No deploy. No migrate. No Cloud Run job. No Wave R.

Fan 1 compiled at `ae89dc3`. Trees cut from Factory `origin/main` `7f41f52` and LDT `origin/main` `28969a36`. Map clone from `origin/main` `a275a45`.

## Local commits (not pushed)

| Lane | Repo | Branch | Tree | Commit | Grade |
|---|---|---|---|---|---|
| P1-FACTORY stack | hauska-factory | `seat/property-ctx-p1-factory` | `P:/seat-worktrees/property/hauska-factory-p1-controls` | `53f8b36` walk/refuse/0005 split; `57e8b66` helper INSERT; `a892fab` job `--apply` | `_inbox/2026-08-30_p1-factory_supervisor_review.md`, `_inbox/2026-08-30_alias-persist-wire_supervisor_review.md`, `_inbox/2026-08-30_alias-persist-job_supervisor_review.md` |
| Gate 8 | hauska-factory | `seat/property-ctx-gate8` | `P:/seat-worktrees/property/hauska-factory-gate8` | `f95313a` | `_inbox/2026-08-30_gate8_supervisor_review.md` |
| P2-JURIS | hauska-factory | `seat/property-ctx-p2-juris` | `P:/seat-worktrees/property/hauska-factory-p2-juris` | `a99112f` | `_inbox/2026-08-30_p2-juris_supervisor_review.md`, `_inbox/2026-08-30_p2-juris-session_supervisor_review.md` |
| P2-JOB | hauska-factory | `seat/property-ctx-p2-job` | `P:/seat-worktrees/property/hauska-factory-p2-job` | `989010d` | `_inbox/2026-08-30_p2-job_supervisor_review.md` |
| P2b-serve | legacy-design-tools | `seat/property-ctx-p2b-serve` | `P:/seat-worktrees/property/legacy-design-tools-p2b-serve` | `c70560aa` | `_inbox/2026-08-30_p2b-serve_supervisor_review.md`, `_inbox/2026-08-30_ldt_drawedge_reconcile.md` |
| Map marker + PE | hauska-map | `seat/property-ctx-map-marker` | `P:/seat-worktrees/property/hauska-map-ctx-marker` (standalone clone) | `5804025` | `_inbox/2026-08-30_map-marker-pe_supervisor_review.md` |

P1-LDT on `seat/property-ctx-p1-ldt` is graded and must not merge first. Retired + no-id-unknown were folded into P2b. Cherry tests only if a second PR is needed.

Gate 8 `close-county` / `0006` / `county-cost` were left unstaged. Do not sweep them into the instrument commit.

## What each land actually is

P1-FACTORY: walk four-state can fail. `factory-conformant` requires `--county` (no 48021 default). Collect-complete is `SELECT FROM import_ledger` before `startRun`. `0005a` is Factory schema, no absence seeds, CHECK `kind <> 'absence' OR probed_at IS NOT NULL`. `0005b` lives under `migrations/bake/` so Factory migrate cannot see it.

alias-persist: `applyAliasLandingRows` issues `INSERT INTO landing_cad_txgio_alias` via `client.query`. Missing table is `ALIAS_TABLE_MISSING` with no INSERT. `--apply` calls that helper. Planner `wroteLanding` stays 0 until the query. Laptop needs `FACTORY_ALIAS_PERSIST_GO=1` and a run row. The walk-alias tree (`hauska-factory-ctx-publish`) still prefers `insertLanding`. Do not `--apply` from that tree.

Gate 8: assertions read `https://smartsite.cloud/api/spine/property-atoms/<node>/facets`, not the store. Selftest known-violations fail. Production gold `48021:34137` still fails dayOne C3/C4/C7 (landUseFact present A1 / `baseFacts.landUse` null; envelope ok 9350 / no `summary.buildableAreaPct`; setback provenance `road-class-setback-table`). P4 keys `dayOne` C3/C4/C7, not `production.verdict` (C1/C2/C5 refuse without a browser). County-scoped job waits on a deployed refuse image.

P2-JURIS: zone-major, floor `1e-8`, no LATERAL. Session is CTE-only (`a99112f`) so a short-lived RO URI can run. Empty `tx_city_boundary` raises. Live TOTALS are UNMEASURED. Reconcile target stays 357,269 / 624,141 / 981,410. A material miss means the join is wrong. Do not adopt a new split. Persist is not executed.

P2-JOB: writer allowlist names `containment-persist`, `f11-setback`, `easement-no-live-rest`. CAD-only map refuses. Laptop `--apply` is `LAPTOP_WRITE_FROZEN` before any connection. `executeContainmentPersist` is `PERSIST_NOT_THIS_CARD`. `PERSIST_SPEC` in that tree is a file fixture, not a live `03` query. `requireCollectComplete` is copied and not wired into this job (CAD rail; do not silently hang it on jurisdiction).

P2b-serve: `present` with a neighbour id requires `reciprocity: "pass"`. No neighbour id is `unknown` (`no neighbour of record`). Retired dropped in interpret and assemble. `sourceVintage` both arms. `yearBuiltFromBake` gone. 77 tests pass.

Map: bundle marker define + `dataset.hauskaBuild`. UNSTAMPED throws locally. Coverage says this parcel. Land use is not Zone. Label-less A1 does not mint `A1 — A1`. Year 2021 with no source is hidden. Source patches were not git-applyable; hand apply matches stated intent. `main.tsx` still writes UNSTAMPED to the dataset and does not throw. Not deployed.

## Still UNMEASURED or not done

Live P2-JURIS TOTALS. Live 0005a CHECK (`INSERT kind=absence probed_at NULL` must refuse). Live 0005b apply on bake `neondb` only. Live alias-persist INSERT after that apply. Gate 8 production dayOne still red. Map not on Vercel. No serving sha on `dataset.hauskaBuild`. Customer-done is a live brief plus that stamp. Factory #37 and LDT #554 are still PRs, not a publish image. PE `#310` is not customer-done.

## Standing do-nots

Apply 0005 as drafted (seeds Austin/Kyle/Georgetown/Round Rock as absence over real setback tables). Re-run `landing-import`. Run F-18 while it defaults county to 48021. Wave R. Laptop persist / laptop `--apply` of containment. Mint a write Neon URI to dodge the old RO+TEMP hole. Give a CDP a `place_fips`. Treat `breadth_*` as jurisdiction. `not-applicable` on the 465,568. Adopt a new containment total. Use `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md`. Merge `seat/property-ctx-p1-ldt` first. SELECT `tx_rrc_well` in PE. Lift the seed. Restart scllr / F-09 / F-10 254 / Harris PBF. Two F-08 or two P-92 writers in one checkout.

Two things called alias: `landing_cad_txgio_alias` is CAD `prop_id` ↔ TxGIO identity (0005b, Wave R). `breadth_*` → `place_fips` is name-normalisation and is demoted. Do not drop 0005b.

## What I need from you

A next-steps ruling with order and owners. Decide, do not re-litigate the grades unless a write path is wrong.

Name:

1. Push / PR order for the six product branches (or hold).
2. Whether to run P2-JURIS `00`+`01` on a short-lived RO URI now (expect NOTICE durable CREATE TABLE refused, then TOTALS vs 357,269 / 624,141 / 981,410).
3. Whether to apply 0005a to Factory and 0005b to bake `neondb` only, with the live CHECK prove.
4. Whether to deploy hauska-map `5804025` (customer-done after a live brief plus `dataset.hauskaBuild` = serving sha).
5. Whether P4 starts on Gate 8 `dayOne` now that the instrument exists, even while C3/C4/C7 are red.
6. What stays parked (Wave R, seed, scllr, F-09, F-10 254).

Return a short board: go / hold / refuse for each, one reason each, and the next compiled dispatch rows if any. Do not start Wave R. Do not apply drafted 0005.
