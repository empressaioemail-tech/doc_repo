---
id: 2026-08-30_ctx_w3_rail_inventory_WDLL
title: WDLL — CTX W3 rail inventory (build vs apply vs honest absence)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: hauska-factory, hauska-engine, legacy-design-tools, hauska-map
plan_row: F-06, F-10, F-11, F-18, P-09, P-11, P-17, P-85
depends_on: _decisions/2026-08-30_ctx_complete_or_absent.md, _inbox/2026-08-30_ctx_parallel_waves.md, OPS-19 A-028, ADR-029, _inbox/2026-08-05_T3_easement_source_recon.md
operator_go: 2026-08-30 (complete dataset or honest absence; RRC surfaces this pass)
snapshot: integration P:/doc_repo; tables named from OPS-13 (2026-08-09 live) and T3 recon (2026-08-05); atom counts from 2026-08-30 Rainmaker recon
owner: integration cuts per-rail cards after this inventory; property produces diffs; planner executes Factory jobs
---

# CTX W3: what exists, what to build, what is absence

Date: 2026-08-30  Status: approved

Complete is a finished dataset or a named honest absence. Wave R does not start until each rail below is one of those two on the six FIPS. This card is the inventory. Collect-then-atomize is `_inbox/2026-08-30_ctx_w3_collect_WDLL.md`: Factory L2 first, then L3 writers. Each rail that is not already a closed apply gets its own follow-on card citing the item number here.

## Done looks like

On the six, every rail in the table has either atoms or a coverage-absence row that PE names. RRC wells that sit in `tx_rrc_well` for those FIPS appear as `well-fact` on the brief. A parcel with no well is `absent-verified` with scope "RRC inventory, this parcel." PDD still has no invented feet. No laptop `--apply`.

## Three classes (do not collapse)

**Apply.** Table and writer exist. Atoms are zero or stale. Factory job, digest-pinned.

**Build.** No table or the engine cannot read a registry table. Schema plus ingest, then apply.

**Absence.** Four-point probe already said no public source. One county-coverage or city-coverage row. Never millions of sentinels (ADR-029). Never a fabricated table.

## Missing tables to build

These are the only new stores. Everything else is apply.

1. **F-11 setback authoring, registry-loaded.** Land the four existing `SETBACK_TABLES` artifacts (Austin, Kyle, Georgetown, Round Rock already cited; plus Bastrop / Elgin / Lockhart). Then probe the other cities of **72** territory-touching places. Unincorporated is `not-applicable` (**357,269** parcels), not a table. In-city with no table landed is `unmeasured` (**465,568**), not `not-applicable`. Do not apply 0005 as drafted (it seeds four of those as absence). Do not invent PDD / overlay scalars.

2. **Public easement GIS landing (four known layers).** P-85 Phase A queries them live and created zero landing tables. For a complete GIS dataset, Factory L2 landing is owed: City of Bastrop `Easements_/43` (148), Round Rock easements, Cedar Park easements, McLennan CAD layers 9 and 10 (44,197 lines / 16,578 text). County Bastrop, Caldwell, Hays, Williamson stay honest-absence at county scope (T3 recon 2026-08-05). Clerk-index documents stay on P-85 jobs, not this landing.

3. **Serve-visible rail-absence row.** ADR-029 county-coverage absence is specified. `county_manifest` cells exist. PE does not read them for "no footprint source for this county." Build a serve path (manifest cell or a small `rail_absence` table) so a zero atom count cannot be read as unmeasured. One row per (FIPS or cityKey, rail).

Do not build: a PDD setback table, a county easement layer where the recon found none, a well table (it exists), a footprint landing (it exists as `tx_building_footprint`).

## Apply list (table exists, atoms do not)

| Rail | Landing / source table | Writer | CTX atom state | Honest absence |
|---|---|---|---|---|
| RRC wells | `neondb.tx_rrc_well` | `well-fact` on engine main | Caldwell 53,841 already. Apply is **five** counties. Every FIPS has wells (zero-FIPS branch dead). PE never reads the landing (P-50). | Parcel with no intersecting well. Pine empty is success if RRC has none. |
| Footprint | `neondb.tx_building_footprint` | `building-footprint` on engine main | Caldwell 35,269 already. Apply is **five** counties. | Per-parcel miss when join overlap fails. Not county-absence. |
| Flood | `neondb.tx_fema_nfhl_flood_zone` | F-18 shape conversion | **981,620 `flood-hazard-fact` on all six.** Not a coverage owe. 48021 has 4 selectors. | Null-zone parcels named. Do not run F-18 while it defaults county to 48021. |
| CAD leftover | `cad_property` / snapshots | Conformant + W1 | Six-county leftover **534,700** CAD with no conformant snapshot (not the 18,100 CTX-cohort figure). Bastrop 15,542 `no-row` confirmed. | After W1, remainder stays `no-row` with basis |
| Zoning stamps | City GIS / ordinance | F-11 + bake | McLennan **48,441 stamped**. Home: this rail, not collect Band C. | Unincorporated `not-applicable`. `stamp-missing` inside a city |
| Roads | OSM / county streets / COVER | P-17 | Home: parked this pass (F-10 / P-17). | Thin unincorporated network |
| Edges | Parcel ring + setback-rule | depth-warm | **City fact.** ~154,841 owed. Bastrop 3,732 parcels (99.65% in-city). Five other counties 0 until a city table. Hays / McLennan / Williamson owe zero now. | Unincorporated `not-applicable` (357,269); in-city-no-table `unmeasured` (465,568). PDD / `no-setback-row`. |
| Envelope | Derived from setback-rule | Bake compute | Follows setbacks. McLennan 65,814 envelopes over 0 rules: quarantine before Wave R. | PDD declined. Unincorporated `not-applicable`. |

## RRC this pass (do whatever it takes)

The data is in `tx_rrc_well`. The surface is `well-fact`. The gap is apply, not a new table.

1. Factory job, **five** FIPS (skip Caldwell). Existing well-fact writer, run row first, no laptop. Writer job must exist (allowlist); today `atoms-writer-job.mjs` is CAD-only.
2. Per-FIPS count of `neondb.tx_rrc_well` (the table the writer reads). C-count / `import_ledger` already ran 2026-08-26/27. Do not re-run `landing-import`. No FIPS is zero.
3. After apply, PE brief on a known-well parcel and on Pine. Known-well shows the atom. Pine stays absent-verified if RRC has no well there.
4. Never copy `tx_rrc_well` into the facet snapshot as a shortcut. P-50 forbids it. The atom is the surface.

## Acceptance items

1. **Inventory stands.** This file names every rail as apply, build, or absence. | check: no rail in the operator list is missing from the three classes | grade: [met 2026-08-30]

2. **Setback landing built or absence filed.** Land the four existing `SETBACK_TABLES` artifacts first. Then probe the other cities of 72 territory-touching places. Unincorporated is `not-applicable`, not a table. | check: registry row count equals 72; Austin/Kyle/Georgetown/Round Rock are sourced, not absence | grade: [ ]

3. **Easement GIS landing built or absence filed.** Item "missing tables" 2. Four layers landed, four counties county-absent. | check: landing counts vs T3 probe counts | grade: [ ]

4. **Rail-absence serve path.** Item "missing tables" 3. PE names county-absence for a rail with no source. | check: live brief on a Caldwell rural footprint/easement | grade: [ ]

5. **RRC surfaced.** Apply on five counties. Caldwell already 53,841. Live brief shows a well where RRC has one. | check: store count plus two live briefs | grade: [ ]

6. **Footprint applied.** Five counties. Caldwell already 35,269. Per-parcel miss is absence with overlap basis. | check: Bastrop atom count > 0; Pine/Rainmaker each present or absent-verified | grade: [ ]

7. **Flood shape conversion.** Coverage already on all six. F-18 refuses a missing county. | check: selector + derivation counts; no silent 48021 default | grade: [ ]

8. **Edges / envelope after city setback tables.** Warm only in-city where a table exists (~154,841). Unincorporated is `not-applicable`. S5 names `no-setback-row` for the 3,747. Quarantine McLennan envelopes-over-zero. | check: SF-1 gold has envelope; Rainmaker names no-setback-row; Caldwell rural is not-applicable | grade: [ ]

9. **W1 leftover CAD.** Same as parent W1. Remainder after recovery is named `no-row`. | check: post-W1 recount | grade: [ ]

10. **Verify then Wave R.** Staging walk with S5 and well/footprint probes. Production publish once. | check: parent item 9 | grade: [ ]

## Amendments

1. 2026-08-30: Collect program filed. Factory L2 (count existing landings, fetch setback and easement GIS) is a separate band from L3 apply. Reason: operator asked for parallel collection that can be atomized; live GIS at apply is the P-85 defect.

2. 2026-08-30: Measured owe. Wells/footprint five counties. Flood shape conversion. Edges city-scoped ~154,841. 72 cities. 0005 not applied. Schedule is execute waves P0–P8. Reason: review + amendments A1–A12.

## Do not

- Build a PDD setback table.
- SELECT wells from `tx_rrc_well` onto the PE brief.
- Laptop `--apply`.
- Treat a zero atom count as measured complete.
- Start Wave R before items 2 to 8 are apply-or-absence.
- Apply 0005 as drafted or re-run landing-import.
- Owe county-wide setbacks or edges.
- Restart Harris PBF or `scllr`.
- Conflate CCN / pipeline with parcel easement.
---
