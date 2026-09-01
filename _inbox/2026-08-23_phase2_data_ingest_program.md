---
id: 2026-08-23_phase2_data_ingest_program
title: Phase 2 — data ingest and Texas flush (locked until Phase 1 QA)
date: 2026-08-23
last_updated: 2026-08-24
status: active
owner: nick
operator_gate: Phase 1 closed 2026-08-23 — _inbox/2026-08-23_phase1_program_close.json + operator QA on smartsite.cloud
related:
  - canvases/phase1-master-program.canvas.tsx
  - canvases/parcel-public-facts-deficit.canvas.tsx
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-22_atom_full_surface_gap_backlog.json
  - 90_operations/OPS-14_texas_flush_game_plan.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_runbooks/factory_onboarding_runbook.md
  - _inbox/2026-08-22_p17_roads_park_pickup.md
---

# Phase 2 — data ingest and Texas flush

**Gate:** Phase 2 **ACTIVE** as of 2026-08-23. Phase 1 closed per `_inbox/2026-08-23_phase1_program_close.json`. Operator QA passed gold `48021:34137`.

**Companion artifacts:**

| Artifact | Role |
| --- | --- |
| `canvases/phase1-master-program.canvas.tsx` | Phase 1 lanes, exit criteria, Phase 2 preview tab |
| `canvases/parcel-public-facts-deficit.canvas.tsx` | 66-row deficit register (field-level) |
| `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` | Write-path execution instrument (A-026) |
| `_inbox/2026-08-22_parcel_public_facts_gap_matrix.md` | 38-category statewide gap matrix |
| `90_operations/OPS-14_texas_flush_game_plan.md` | Texas flush W1–W5 workstreams |

---

## Phase 2 program tiers

| Tier | Name | Phase 2 scope |
| --- | --- | --- |
| 4 | Data backfill | Deficit register, CAMA, COVER, L16 drain, harvest |
| 5 | Texas flush launch | OPS-14 W1–W5, 254×14 honest grid, factories |

Tiers 0–3 (structure, surface wiring, instrument conformance, measurement-only) are **Phase 1**.

---

## Workstream C — setback serve (current data serving correctly)

**Active 2026-08-23** under “get our current data serving correctly.”

| PR | Repo | Scope | Status |
| --- | --- | --- | --- |
| [#194](https://github.com/empressaioemail-tech/hauska-map/pull/194) | hauska-map | Map wedge = export: serve depth-warm geojson with layer-23 scalars | **merged** + PE sync deployed |
| [#195](https://github.com/empressaioemail-tech/hauska-map/pull/195) | hauska-map | Travis table-backed setback PE port | **merged** + PE sync deployed |
| [#466](https://github.com/empressaioemail-tech/legacy-design-tools/pull/466) | legacy-design-tools | Bastrop BDC router + `bastrop-development-code.json` | **merged** — cortex deploy pending |
| [#360](https://github.com/empressaioemail-tech/hauska-engine/pull/360) | hauska-engine | Travis warm-verify-decline → codified table fallback | **merged** — retrieval deploy pending |

**Live verified 2026-08-23:** gold `48021:34137` geojson + scalars; Travis `48453:280239` codified scalars on card.

Long-term statewide setback factory (254 counties, road-node ingest, serve dashboard): **parcel-public-facts-deficit canvas** section `setback-program` rows SB08–SB11 — not blocking this wave.

---

**Source:** `_inbox/2026-08-22_parcel_public_facts_gap_matrix.md`, deficit canvas.

### P0 backfill (launch footprint + statewide spine)

1. **Dallas / Tarrant CAMA bulk** — living area, year built (metros 0% today on StratMap tier). Q5 bulk_primary. Blocks structural facts on gold-adjacent metros.
2. **Deed date** — `DEED_DATE` on 148/176 REST counties; top harvest gap; lands on cad-parcel-roll / tenure fact.
3. **Plat identity** — MAP_ID, BLOCK, TRACT, ABS_SUBDV on 142–151 counties; harvest Q3 Class A.
4. **Structured situs** — SITUS_NUM, street components on 143–157 counties; address-to-parcel Q4.
5. **GEO_ID on roll** — 158 counties; join key to StratMap.
6. **Owner mailing structured** — ADDR_* on 147–148 counties; owner-fact body enrichment (identified tier).
7. **School district / HOOD_CD / next appraisal** — cad-parcel-roll extension rows.

### Denominator reminder

- **254** = Texas counties (planning horizon)
- **196** = StratMap geometry loaded (`parcel-node` atoms)
- **15** = `cad_property` roll loaded today (launch footprint only)
- **176** = CAD REST field inventory captured

Do not quote "15 counties" as statewide CAD coverage.

---

## Workstream B — COVER and roads (resume from park)

**Park pickup:** `_inbox/2026-08-22_p17_roads_park_pickup.md`

| Item | Status at park | Phase 2 action |
| --- | --- | --- |
| Roads COVER apply | 98/254 landed; Harris extract killed | Resume `--apply` slot after Phase 1 QA; six unblockers in OPS-14 W2 |
| L16 drain chain | Pipelines, footprint, flood tail; Tarrant/Dallas | Drain queue READY_FOR_L16_TAIL per L21 close |
| P-17 roads remainder | Foreground was SERVE | Atoms `--apply`; serialize with bulk-writer slot |

**Standing:** A-017 Harris PBF stays NO. One bulk writer per database (`_STATE.md` slot rule).

---

## Workstream C — Wave C writers and IDENT

| Plan row | Thread | Phase 2 action |
| --- | --- | --- |
| **P-55** | IDENT / Wave C identity writers | Integer grammar, sentinels out of keys, externalKeys; new writes |
| **P-56** | Geometry 48135 denom + score | City-batch runner; geometry denom excludes 3791 retired |
| **F3 depth warm** | Envelope warm apply | Unified city-batch runner; Elgin proof city; Bastrop depth-warm re-derive vs promote |

**Blocks:** P-68 lineage edges wait on substrate NodeId (Lane G). P-55 is explicitly Phase 2 in Phase 1 canvas.

---

## Workstream D — OPS-14 Texas flush (W1–W5)

From `90_operations/OPS-14_texas_flush_game_plan.md`:

### W1 — Writers program

- **RUN** statewide: cad-parcel-roll, land-use-fact, flood-hazard-fact (engine #291 merged; execution unexercised)
- **BUILD** missing writers: roads/frontage, footprints, easements, owner, RRC, MUD
- Every writer: full write + read + serve probe + honest-absence path + independent instrument (INV-5)
- **accessPolicy at mint** before first statewide write (INV-20 / ADR-017)

### W2 — Fabric completion

- L2 remaining counties (coastal-extent, Donley)
- Roads statewide (six unblockers + synthetic-id collision resolution)
- RRC and MUD statewide acquisitions (verified source-registry rows)
- Topo statewide decision; SSURGO source hunt

### W3 — Integrity and cert re-earn

- Cert-frame reconciliation; county-extent instrument as per-vintage gate
- OPS-11 enforcement table (PARTIAL + UNENFORCED set)

### W4 — Launch readiness

- Tracked in `76j_smartsite_launch_readiness_program.md` (not duplicated here)

### W5 — Depth factories

| Factory | Store | Feeds rails |
| --- | --- | --- |
| **F1** CAD rolls | `cad_property` (neondb) | CAD attributes, owner, land use |
| **F2** Code/zoning corpus | corpus + zoning stamps | zoning, envelope downstream |
| **F3** Depth warm | `hauska_mcp.atoms` | buildable-envelope |

F1 and F2 parallel; F3 consumes both. Joint = atom-contract + OPS-13 propagation legs only.

---

## Workstream E — SERVE threads that become ingest (not Phase 1)

These appear on the Phase 1 canvas under SERVE/COVER/IDENT but are **Phase 2** because they write new atoms or apply COVER:

| Thread | Rows | Why Phase 2 |
| --- | --- | --- |
| HARVEST / CAMA | Deficit P0 | Bulk load new store rows |
| COVER | P-17, L16 | `--apply` mutates atoms store |
| IDENT | P-55 | Wave C writers |
| DEPTH WARM | F3, P-56 | City-batch apply |
| FACTORY / W1 | OPS-14 W1 | Statewide writer RUN |

Phase 1 SERVE (P-48–P-54) = **read path only** on existing atoms; live regression sweep is Phase 1 Lane E.

---

## Workstream F — instrument program items deferred to Phase 2

| Row | Track | Why deferred |
| --- | --- | --- |
| **P-67** flood leg | T1.4 demote | Writer reclassify + county re-apply (~50M rows metadata); hydro seat |
| **P-68** | T1.6 lineage | Blocked on substrate NodeId |
| Partial **P-72** close | T2.20 accessPolicy | Generator + CI from substrate; property import can start, close waits |

P-66, P-69, P-70, P-71 remain **Phase 1** (type decisions, no bulk row migration).

---

## Phase 2 execution order (stack, not calendar)

**Superseded 2026-08-24.** Ingest and bind sequencing is `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` (OPS-16 A-026, P-73 through P-80). This section no longer orders CAMA, harvest, or COVER.

Write-path summary (full table in the game plan):

0. P-73 field map (A3). No store write.
1. P-74 situs bind · P-75 who-serves read · P-76 city-limits PIP. No atoms slot.
2. P-77 Travis measure + honest miss.
3. P-78 CAMA-vs-StratMap authority + leftover `landuse.ts` fields.
4. P-25 Dallas/Tarrant CAMA after 0+3. Travis CAMA after P-77. Atom apply is separate and slotted.
5. P-79 REST harvest writer (not a CAMA rider).
6. Heavy last: P-80 Travis join fix, P-09 footprint drain (10.67M, not L20 zoning), remaining-metro parsers, COVER (A-022 parked), P-55.

A-017 and A-022 stand. Typed absence is not a Phase 2 exit for every canvas P0.

---

## Phase 2 exit criteria (draft — operator ratifies at Phase 2 open)

1. Launch-footprint counties: CAD roll + CAMA structural fields on `cad_property` path honest
2. Roads COVER: measured progress toward OPS-14 gate (no invented percent)
3. L16 drain: Tarrant/Dallas tail applied or honestly parked with close artifact
4. W1 RUN: three existing writers exercised statewide with serve probes
5. Deficit register P0 rows: each has store row + atom + inspect path or typed absence
6. 254×14 County Manifest: no invented satisfied-present without scorer + apply
7. Operator go for Texas flush launch gate per `_decisions/2026-08-09_texas_flush_launch_gate.md`

---

## Amendments

- 2026-08-23: Filed at operator request to capture Phase 2 scope outside canvas-only preview. Phase 1 master canvas links here from Phase 2 tab.
- 2026-08-24: Execution order superseded by write-path game plan. P0 backfill list above is historical; do not dispatch from it. A-026 opened P-73..P-80.
