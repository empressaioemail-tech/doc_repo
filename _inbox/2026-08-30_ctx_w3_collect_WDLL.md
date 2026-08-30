---
id: 2026-08-30_ctx_w3_collect_WDLL
title: WDLL — CTX W3 collect then atomize (Factory L2 then L3)
date: 2026-08-30
last_updated: 2026-08-30
status: amended
applies_to: hauska-factory, hauska-engine, legacy-design-tools
plan_row: F-01, F-09, F-11, F-18, P-09, P-11, P-85
depends_on: _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md, _inbox/2026-08-30_ctx_parallel_waves.md, _decisions/2026-08-30_ctx_complete_or_absent.md, 90_runbooks/factory_1_5_acquisition_staging.md, _blueprint/20_pipeline.md, OPS-19 A-028
operator_go: refused as written; execute on _inbox/2026-08-30_ctx_execute_waves_WDLL.md
snapshot: review refuse; amendments A1-A12; 0005 not applied; landing-import not re-run
owner: integration cuts; property produces diffs; planner executes Factory jobs
---

# CTX W3: collect in parallel, then atomize

Date: 2026-08-30  Status: amended (spine kept; schedule moved)

Yes, the Factory. Collection is L2 landing. Atomization is L3 writers. Those are different jobs. The schedule is `_inbox/2026-08-30_ctx_execute_waves_WDLL.md` (P0 to P8). Do not execute the Band C / Band 1 lanes in this file. Do not apply 0005. Do not re-run `landing-import`.

## Done looks like

Every owed rail on the six has a Factory landing row-set (or a named coverage-absence row) with a two-count and a vintage. Writers then emit atoms from that landing only. PE still reads atoms (P-50 / P-51). A zero atom count after a named empty landing is complete. A zero atom count with no landing count is unmeasured. No laptop write. Wave R still waits on atomize-or-absence, not on this card alone.

## Two layers (do not collapse)

| Layer | Job | Writes | Parallelism | This card |
|---|---|---|---|---|
| L2 Collect | `factory-landing-import` for tables that already exist in `neondb`; new Factory GIS fetch jobs for setback and easement | Factory `landing_*` (and `neondb` only when the source table does not exist yet) | Slot-free across tables and counties. Same-table writes stay one at a time. `txgio_parcel` still 1-2. | Items 1 to 7 |
| L3 Atomize | Existing engine writers as Factory jobs: `well-fact`, `building-footprint`, F-18 flood, F-11 setback-rule, easement atoms | `hauska_mcp.atoms` | One writer per `(store, entity_type, county_fips)`. One heavy-scan per database. | Gated by collect-complete. Owned by execute-waves P4. |

Factory 1.5 (`lib/cad-ingest`) already landed statewide fabric. Do not re-fetch TxGIO, NFHL, or CAD from a laptop. `factory-landing-import` copies those `neondb` tables into Factory L2 with two counts. City GIS that was never landed (setbacks, four easement layers) is a new Factory fetch job, not a cad-ingest CLI, not a P-85 live query.

## What is already collected

Count, then atomize. Do not re-download.

| Rail | Source table (neondb) | Factory L2 copy | Atom family | Collect work |
|---|---|---|---|---|
| RRC wells | `tx_rrc_well` | `landing_tx_rrc_well` | `well-fact` | Per-FIPS count of `neondb`. Caldwell already 53,841. Apply is five counties. Zero-FIPS branch is dead. |
| Footprint | `tx_building_footprint` | `landing_tx_building_footprint` | `building-footprint` | Per-FIPS count. Geom-sparse is named, not re-fetched. Heavy scan after RRC releases. |
| Flood | `tx_fema_nfhl_flood_zone` | `landing_tx_fema_nfhl_flood_zone` | F-18 selector + derivation | Already 981,620 atoms on all six. Shape conversion only. Do not run F-18 until it refuses a missing county. |
| CAD leftover | `cad_property` / `landing_cad_property` | already the landing | conformant + W1 | Recount leftover. Not a GIS fetch. |

`factory-landing-import` already names those nine copy specs. C-count already ran 2026-08-26/27 with nine clean `import_ledger` two-counts. Writers read `neondb`, not the Factory L2 copy. Do not re-run the import. Collect-complete for those rails is a per-FIPS count of the table the writer reads.

## What must be fetched (new L2)

Schema is on Factory `seat/property-ctx-walk-alias-schema` (`migrations/0005`, parsers, no ingest). **Do not apply 0005 as drafted.** It seeds Austin / Kyle / Georgetown / Round Rock as absence over real tables. Split per amendments A1. Execute waves P2 / P4 own the landing.

| Rail | Landing | Source | Collect-complete |
|---|---|---|---|
| F-11 setbacks | `landing_setback_registry` + `landing_setback_record` | Per-city: Bastrop layer 23, Elgin warmed cohort, Lockhart ordinance; Austin / Kyle / Georgetown / Round Rock / Waco are absence rows unless a four-point probe finds a dimensional layer | Registry row per incorporated city. Sourced cities have records. Absence cities have the basis string, never invented feet. PDD CHECK still refuses. |
| Easement GIS | `landing_easement_gis` | Four layers (Bastrop city 148, Round Rock, Cedar Park, McLennan 9/10). County 48021 / 48055 / 48209 / 48491 stay absence. | Four-point probe (metadata, fields, `returnCountOnly`, one sample) before fetch. Landing count vs T3 probe count, or the difference named. Feature rows on the four county-absent FIPS refuse. |
| Rail-absence serve | manifest cell or `rail_absence` | Not a GIS fetch | One row per (FIPS or cityKey, rail) that has no source. PE names it. Zero atoms is not unmeasured. |

Clerk-index documents stay on P-85 jobs. CCN and pipeline stay utility-adjacent, not parcel easement.

## Collect-complete gate (every rail, before any writer)

A rail may atomize only when a file in `_inbox/` names all five:

1. **Source.** Table name or probed URL. Four-point probe for any new GIS layer. Guessed MapServer paths (Round Rock / Cedar Park) confirmed live or replaced.
2. **Scope.** Six FIPS, or named cityKey list. Not 254.
3. **Two-count.** Source count and landing count, each with a timestamp. Disagree fails. 0=0 is vacuous unless the coverage-absence row is also written.
4. **Vintage.** Source vintage or layer edit date. `unknown` is allowed only when the existing `landing-import` unknown-provenance path records `unknown_fields`.
5. **Run record.** Factory run id. Laptop `--apply` is not a run.

Mechanism: Factory job writes `import_ledger` (existing) or a sibling ledger row for GIS fetch. A human spreadsheet is not the gate.

## Parallel collect lanes (retired as schedule)

Do not start these lanes from this file. Order is `_inbox/2026-08-30_ctx_execute_waves_WDLL.md`. C-count is already done. C-setback is P4 land-four-artifacts, not 0005. C-ease is P3 absence + P4 probe. C-abs is P3.

## Then atomize (execute-waves P4, not this card's jobs)

After P2 writers exist and P3 names not-applicable:

1. RRC `well-fact` on five counties. Caldwell already 53,841. Zero-FIPS branch is dead.
2. Flood shape conversion after F-18 refuses a missing county.
3. Footprint on five after the RRC heavy scan releases. Caldwell already 35,269.
4. Setback-rule after the four artifacts land. Edges after that (~154,841). Envelope only where a table exists.
5. Easement atoms after probe. Four counties get named absence, not a writer.

PE never SELECTs `tx_rrc_well` or the easement landing. P-50 / P-51 stand.

## Acceptance items

1. **Factory is the collector.** This card names L2 collect and L3 atomize as different jobs. No laptop cad-ingest. No live ArcGIS at apply. | check: no collect lane writes `atoms`; no apply lane fetches REST | grade: [ ]

2. **Already-landed counts filed.** Per-FIPS counts for wells, footprint, flood, CAD leftover, with host and time. Factory L2 two-count or a named "import unread, re-ran" line. | check: `_inbox/2026-08-30_ctx_w3_collect_counts.json` | grade: [ ]

3. **0005 not applied as drafted.** Split per A1. Schema-only if anything. | check: Austin / Kyle / Georgetown / Round Rock are not `kind='absence'` | grade: [superseded: execute-waves forbids 0005 as drafted]

4. **Setback landing complete.** Every incorporated city on the six is sourced records or an absence row. PDD feet still refuse. | check: registry count equals city roster; one SETBACK_PDD_FEET_REFUSED fixture still fails | grade: [ ]

5. **Easement landing complete.** Four layer counts vs T3 (148 / 1254 / 8400 / 44197 / 16578) or the difference named. Four county-absence rows present. Feature insert on 48021 county scope refuses. | check: landing counts plus refuse test | grade: [ ]

6. **Rail-absence rows exist** for every rail that has no source on a FIPS. | check: Caldwell rural brief can name county-absence once Abs is deployed | grade: [ ]

7. **Collect-complete artifact.** Five-field record per rail, readable by the job image (not a doc_repo `_inbox/` file). | check: P4 job refuses without it | grade: [moved to execute-waves item 6]

8. **Atomize not claimed here.** Execute-waves P4 owns well-fact / footprint / flood / setback / easement apply. This card does not write those atoms. | check: `well-fact` count on Bastrop is unchanged by this card | grade: [ ]

## Amendments

1. 2026-08-30: Review refused as written. Spine kept. Schedule is execute waves P0–P8. 0005 not applied. `landing-import` not re-run. Writers read `neondb`; L2 copy has zero readers. C-count already done. Wells/footprint are five counties. Flood is shape conversion. Cities are 72. Setbacks are a landing job of four existing artifacts, not a probe. See `_inbox/2026-08-30_ctx_w3_collect_amendments.md` A1–A12.

## Finish card (graded at close)

(ungraded)

leave_behind:
- item: execute waves P0–P8
  owner: planner
  plan_row: F-06
  card: _inbox/2026-08-30_ctx_execute_waves_WDLL.md
- item: P-85 clerk-index documents
  owner: property
  plan_row: P-85

## Do not

- Collect from a laptop or with `lib/cad-ingest` against production.
- Live-query ArcGIS inside an atom writer (P-85 Phase A shape).
- Copy `tx_rrc_well` or easement landing into `place_layer_snapshots`.
- SELECT landing tables from PE.
- Treat a Factory L2 copy as atoms.
- Treat a zero atom count as collected.
- Invent PDD feet or a county easement layer the T3 recon did not find.
- Fetch Harris PBF, scllr, F-09, or F-10 254.
- Start Band 1 apply from this card. Use execute waves P4.
- Start Wave R from this card.
- Apply 0005 as drafted (destroys four real setback tables).
- Re-run landing-import (immutability triggers make a second run unrecoverable).
- Two writers on one landing table.
- Confirm Round Rock / Cedar Park URLs by hoping. Probe first.
---
