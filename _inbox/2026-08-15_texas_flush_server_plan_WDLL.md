---
id: 2026-08-15_texas_flush_server_plan_WDLL
title: WDLL — Texas flush server-side plan and flood drain
status: approved
last_updated: 2026-08-17
operator_scope: full remaining Texas atom ingest (flood + pipelines + wells + footprint + roads + CAD tail)
applies_to: portfolio
related:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_operations/OPS-13_store_topology.md
  - _dispatches/2026-08-15_l25_dispatch.md
  - _sessions/2026-08-15_drain_program_and_control_plane_claude_code.md
---

# WDLL: Texas flush server-side plan and flood drain

Date: 2026-08-15  Status: approved
Operator approval: 2026-08-15 (in-session go; parity threshold 0.5% near/far flips on 48001 or re-drain the 19)
PLAN-ROWS: P-07, P-08, then P-12 (pilot), then P-11 / P-09 / P-17 as separate templates
Repos: hauska-engine (writers + plan SQL), doc_repo (this card + compiled dispatch)
Adversarial review: this session (planner, no sub-agents)

## Done looks like

The remaining Texas-flush rails can speak for every county with either a stored atom or a verified honest absence. Flood's 82 banked plans are in the atoms store and scored. Pipeline planning no longer pulls county geometry into Node or re-sorts the county on every page; Brazoria 48039 plans in minutes on the same predicate the 19 landed counties used, or the 19 are re-drained after a named parity gate. Supervision bounds work by row counts and server-side timeouts, not file touches. Road-node and well-fact are not forced onto the special-district SQL template. The launch gate can be graded from a fresh ledger snapshot after the flood drain, not from a 24-hour-old materialize.

## Acceptance items

1. Harris 48201 flood plan NDJSON exists at `P:/tmp/plan_farm_20260813/flood_metros/48201.plan.ndjson` with mode `plan-only`, no `_outside` bucket, and a digest. | check: file exists; `planDigest.byZone` has no `_outside`; records match `wouldWriteTotal` | grade: [ ] | depends: quiet neondb window (no parcel-page writers)

2. Banked flood plans drained via `--from-plan --apply --batch=5000` for every county that has a `*.plan.ndjson` (measured 78 remainder + 5 metros = 9,479,281 planned atoms). Harris included only after item 1. | check: each county `verified == atomsWritten` and `verifyFailures == 0`; store count by `left(entity_id,5)` matches the plan `wouldWriteTotal` | grade: [ ] | depends: atoms writer lease; does not require quiet neondb

3. Mid-county verify throw is resume-safe. A killed or thrown flood county re-run from the same NDJSON upserts already-written rows and finishes the tail. | check: one county stopped after N batches, re-run reaches full `wouldWriteTotal` with zero verifyFailures and no duplicate `atom_did` | grade: [ ] | depends: item 2 path

4. Pipeline plan SQL is the special-district shape (TEMP+GiST above 50k parcels, keyset below), emits parcelKey + outcome + scalars, no geometry on the wire. Parcel page query `DISTINCT ON (feature_index) ... geometry ORDER BY feature_index` is gone from the apply path. | check: `EXPLAIN` of the new plan has no per-page Unique+Sort of the whole county; writer no longer builds a `parcels[]` of GeoJSON | grade: [ ] | depends: engine PR; no `--apply` until item 5

5. Predicate parity on a landed county (48001 or 48037): JS `planCountyRrcPipeline` vs PostGIS `geography` `ST_DWithin` at `RRC_PIPELINE_DEFAULT_BUFFER_METERS`. Disagreement rate named. If near/far flips exceed the operator-set threshold, the 19 landed counties are re-drained; they are not left mixed. | check: side-by-side plan on the same parcel keys; count presentNear / presentOutside / absent deltas | grade: [ ] | depends: item 4; no Brazoria apply before this

6. Brazoria 48039 pipeline plan completes with phase timers (`loadMs`, `planSqlMs`, `wallMs`) and does not sit in `pg_stat_activity` as a single unbounded sort. | check: plan-only artifact; `wallMs` bounded; `pg_stat_activity` sample during the run shows the named SQL, not idle-in-transaction | grade: [ ] | depends: item 5 pass or explicit re-drain ruling

7. Phase timers exist on pipeline, well, and footprint writers (flood already has them). A county `.done` without `planMs` / `writeMs` / `verifyMs` is a test failure. | check: unit or CLI smoke writes all four fields | grade: [ ] | depends: item 4 PR

8. Server-side `statement_timeout` and `lock_timeout` are set on neondb plan connections (not `0`). A synthetic long statement is proven to die. Windows process-tree kill is not the gating indicator. | check: a `pg_sleep` over the timeout is aborted; the flood writer `statement_timeout: "0"` is not copied | grade: [ ] | depends: item 4

9. Well-fact is planned as well-times-parcel grain (not one row per parcel). Road-node stays PBF-extract. Footprint stays staged `ST_Intersects` + overlap ratio. None of the three are a copy-paste of the special-district module. | check: each rail's PR cites its own predicate and grain; no shared "port SD" claim without a grain note | grade: [ ] | depends: item 6 closed for pipelines first

10. L25 as written is not seated. A new dispatch is compiled from this WDLL (`node scripts/dispatch.mjs`) naming the acceptance items above. | check: no `_inbox/2026-08-15_l25_cp1.json`; new dispatch file carries PLAN-ROW + WDLL item numbers | grade: [ ] | depends: operator approval of this card

11. After flood drain, ledger materialize `--apply` runs and `node scripts/gate-grade.mjs` is graded against a snapshot younger than `MAX_AGE_MS` (30 min). DC-3 movement is measured, not narrated. | check: `computedAt` age < 30 min; flood cells flip on the live GET | grade: [ ] | depends: item 2

## Amendments

1. 2026-08-15 operator: L26 close is the full remaining Texas atom ingest, not flood-only. After items 1-3, run items 4-9 (pipelines after the 0.5% parity gate, then wells / footprint / roads on their own grain) and CAD re-applies 48439 / 48113 / 48135, then item 11. Reason: operator ruled the data ingest must complete, not one rail.

2. 2026-08-15 operator: do not sit on TEMP-class pipeline counties this pass. Skip any county with `DISTINCT feature_index >= 50000` (the TEMP+GiST path) and any county that exceeds a 12-minute wall. Come back after deploy. Reason: 48005 Angelina burned ~2h (53 min fail + 58 min retry) on GeoJSON TEMP load; repeating that on the other 51 metros would stall go-to-market.

3. 2026-08-16 operator: after footprints and roads, circle back to pipeline unfinished work before CAD / materialize. Drive metro apply and the deferred keyset (52 metros plus this-pass keyset timeouts) to stored atoms or typed absence. Plan of record: durable GiST, pipeline-major LATERAL, `ST_Expand` bbox, short segments for long lines, 10-pipe proof with a `durable-batch` log, then bank the plan. The 12-minute wall may be raised once that log exists. Do not sit on a 200-pipe Angelina statement without it. Reason: geom is backfilled; the remaining gate is the join, and go-to-market requires the deferred counties, not a permanent skip.

4. 2026-08-17 operator: exclude Harris 48201 from the serial statewide-PBF roads drain. Do not raise-and-restart `extract_highways.py` against `texas-latest.osm.pbf` for Harris. Remaining counties continue. Harris roads land from a prepared-geometry or county-clipped extract plus `--skip-extract --ndjson` apply. Honest absence is not allowed for Harris roads. Reason: three full-PBF Harris extracts wrote 0 atoms; Dallas landed 321,958 in 9.8 min on the same file; the cost is the Python ring test, not the PBF.

5. 2026-08-17 operator: QA and launch on the current map. Remaining statewide PBF roads and CAMA structural loads are post-launch backfill. Do not restart the Harris extract or the 153-county PBF drain as a launch blocker. Dallas CAD identity/value atoms already exist from A1; the DCAD zip is a later CAMA harvest. Reason: drain JSON is not customer-done; marketing and checkout can proceed on the live inspect card.

## Finish card (graded at close)

(empty until close)
