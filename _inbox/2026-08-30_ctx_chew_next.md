---
id: 2026-08-30_ctx_chew_next
title: CTX chew next — five compiled dispatches
date: 2026-08-30
last_updated: 2026-08-31
status: planning
depends_on: _inbox/2026-08-30_ctx_consolidated_execution_plan.md, _decisions/2026-08-30_unincorporated_is_the_disposition.md
operator_go: dispatches compiled at ae89dc3; five lanes; separate trees; do not start Wave R
snapshot: integration P:/doc_repo @ f3fd572; four parallel lanes cut; P4 F-18 / join F-01 / bake-0005b F-08 / p1-leftover P-92; do not Wave R
---

# Chew next

Operating schedule: `_inbox/2026-08-30_ctx_consolidated_execution_plan.md`.
Ruling: `_decisions/2026-08-30_unincorporated_is_the_disposition.md`.
This page is the carry order only.

Five compiled dispatches. Same-repo pairs use **separate registered worktrees**. Same checkout is a hard no.

| Dispatch | Row | Repo | Tree | Starts |
|---|---|---|---|---|
| `_dispatches/2026-08-30_p1-factory_dispatch.md` | F-08 | hauska-factory | Factory tree A | now |
| `_dispatches/2026-08-30_gate8_dispatch.md` | F-08 | hauska-factory | Factory tree B | now (steps 1–2). County-scoped job form waits on P1-FACTORY. |
| `_dispatches/2026-08-30_p2-juris_dispatch.md` | F-01 | hauska-factory | Factory tree C or planner read | Read half now. Write half after P2 job template. |
| `_dispatches/2026-08-30_p1-ldt_dispatch.md` | P-92 | legacy-design-tools | LDT tree A | now |
| `_dispatches/2026-08-30_p2b-serve_dispatch.md` | P-92 | legacy-design-tools | LDT tree B | now. Do not use the PE wiring card. |

## Two things called alias. Do not drop 0005b.

`landing_cad_txgio_alias` is a parcel identity binding (CAD `prop_id` ↔ TxGIO natural key, `ownersAgree`, `cad-roll-address-join`). It gates Wave R. 0005b creates it on bake `neondb`. Ships in P1-FACTORY.

`breadth_*` → `place_fips` is jurisdiction name-normalisation. P2-JURIS demoted it. Containment is the jurisdiction source.

## Lane status (2026-08-30 evening)

| Lane | Status | Next |
|---|---|---|
| P2-JURIS | MERGED #42 at `a7a8042` (2026-08-31T02:18:06Z). CASE gone. DO kept. 05 unlimited. TOTALS UNMEASURED. | Lane shows a plan that is not Nested Loop of the two CTE scans before another timed 01. Do not raise the timeout. Do not adopt a split. |
| P1-FACTORY | MERGED #38. 0005a CHECK proven q7rd2. | 0005b needs a bake-migrate job. Never the migrate job. Never a laptop. |
| Gate 8 | MERGED #39 at `27592e48`. Instrument on main. county-cost still unstaged. | P4 keys `dayOne` (confirmed in `scripts/gate8/run.mjs`). County job waits on a deployed refuse image. |
| P1-LDT | Not empty after #558. Worktree dirty vs `13ec82d4` on DrawEdge files. Grade `_inbox/2026-08-30_p1-ldt_supervisor_review.md`. | Do not merge or close. Reconcile leftover vs main before any cherry. |
| P2b-serve | MERGED #558 at `13ec82d4` (2026-08-31T00:37:19Z). Typecheck+Test green. | On main. |
| P2-JOB | MERGED #40 at `dfe1e247` (merge-resolved onto #38 then updated through #39/#41). Persist not executed. | Persist waits on measured TOTALS, then Cloud Run on live `03`. Do not apply from a laptop. |
| MAP-MARKER-PE | Deployed `dpl_7N1GtdZYBCg8WiTWYjtkYCuvpFVA`. Live `dataset.hauskaBuild=bb02f3b503bdcc463a31eb3286429de2c8757ae1`. | Marker accepted. Customer-done is still a live brief on gold, not this stamp alone. |
| ALIAS-PERSIST | Local commit `a892fab` on `seat/property-ctx-p1-factory`. Grade `_inbox/2026-08-30_alias-persist-job_supervisor_review.md`. | Live INSERT after 0005b on bake `neondb`. Do not `--apply` from walk-alias. |
| F-11 | Engine #366 MERGED. LDT #560 serving on `cortex-api-00672-ceq`. C7 re-read `_inbox/2026-08-31_f11_ldt_c7_reread.md`. | C7 still `descriptor-fixture`. C3/C4 unchanged. P4 setback HOLD. Do not treat this as a C7 close. |
| MIGRATE | 0005a CHECK proven on `q7rd2`. Template restored to `migrate` / `sha256:4bd728c5`. | 0005b needs a bake-migrate job (does not exist). Never this migrate job. Never a laptop. |

## Gates

- Gate 8 step 2 instrument exists and has been seen to fail on the served body. That unlocks **P4**. Do not wait for C3/C4/C7 to go green. Do not read `production.verdict` (C1/C2/C5 refuse without a browser). Bundle marker is applied on the map clone (`5804025`), not deployed.
- Gate 8 step 3 (browser / CDP walk) unlocks **P7** (Wave R), not P4. Envelope wire→DOM is that class.
- P2-JURIS #42 merged `a7a8042`. TOTALS UNMEASURED. A live 05 must not be Nested Loop of parcels_six x cities_ok before another timed 01. Persist after a measured reconcile. Do not raise the timeout.

## Do not

Use `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md` (stale in three ways). Share a checkout between two F-08 or two P-92 lanes. Wire Gate 8 as a per-county job before P1-FACTORY refuse lands. Drop 0005b. Laptop `psql` for the containment persist. Assert Gate 8 against the store instead of the served body. Apply 0005 as drafted. Wave R. A CDP `place_fips`. Raise the 180s timeout to pass containment. Revoke `neondb_owner`. Adopt a TOTALS split before a passing unlimited plan.
