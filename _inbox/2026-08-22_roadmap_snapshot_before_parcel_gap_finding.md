---
id: 2026-08-22_roadmap_snapshot_before_parcel_gap_finding
title: Roadmap snapshot — state immediately before parcel public-facts gap finding (2026-08-22)
date: 2026-08-22
status: frozen snapshot
owner: planner
purpose: Durable record of plan-of-record and execution stack BEFORE the statewide CAD/acquisition gap was crystallized as a first-class program layer.
related:
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-22_atom_full_surface_WDLL.md
  - _inbox/2026-08-22_serve_ident_qa_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _decisions/2026-08-17_qa_launch_current_map.md
---

# Roadmap snapshot — before parcel gap finding

**Frozen at:** 2026-08-22 morning (before afternoon gap analysis session).
**Purpose:** Preserve what we thought we were doing when the work was framed as "wire all atoms to map + inspect + CC," before the acquisition-tier and CAD-consistency gaps were elevated to P0.

## Active programs (in flight)

### 1. SERVE near-term (CLOSED 2026-08-22)

- WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md`
- P-48..P-54: cortex/PE `*Fact` wiring on gold `48021:34137` (908 PINE)
- Owner (P-54): identified-session only; anonymous refusal graded **met** on live probe
- **Implicit assumption:** gold parity proves the pattern; extend to more counties later

### 2. Full atom surface (Phase 1 CLOSED; Phases 2–5 queued)

- WDLL: `_inbox/2026-08-22_atom_full_surface_WDLL.md` (OPS-16 A-023, P-57..P-62)
- **Phase 1 done:** P-57 live probe + P-58 code audit + gap backlog JSON
- **Queued execution stack:**
  - **P-59** — A-020 scorer specs (roads, footprint, easement, rrc-wells, rrc-pipelines, rail-corridor, mud)
  - **P-60** — SmartSite map layers read atoms
  - **P-61** — inspect remainder (land-use atom citation, P-52 rail scout)
  - **P-62** — CC manifest parity after scorer apply + recompute
- **Operator stamp:** CC ≠ inspect; wiring inspect does not green manifest cells
- **Parked:** COVER roads, P-52 rail until scout GO

### 3. Contract surface + store truth (verification CLOSED 2026-08-22)

- Card: `_inbox/2026-08-22_contract_surface_store_truth_investigation.md`
- ADR-030 proposed; threads A/B/C/D graded
- Fix backlog open (gate version 1.9 vs 1.22, easement dormant, forward consequence roadmap, two-store tenant)

### 4. Factory / acquisition (background, not surfaced as blocker)

- **Geometry:** 196/254 counties in `txgio_parcel`; ~11.6M `parcel-node` atoms (2026-08-11 sweep)
- **CAD roll:** `cad_property` **15 counties / ~4.6M rows** (launch footprint)
- **P-25 / Q5:** CAMA bulk routing + parsers (L9 Tarrant pilot proved 98% sqft on sample; full loads not run)
- **Q3 harvest:** Class A CAD fields inventoried, not ingested
- **Q4:** address-to-parcel normalization over `txgio_parcel.situs_address`
- **A-017 ruling:** QA and launch on current map; Dallas sqft/year and roads 254/254 **not launch blockers**

## What we believed the bottleneck was

1. **Surface wiring** — SERVE got facts onto inspect for gold; random counties looked broken because bake holes + empty atom-chains, not because SERVE failed.
2. **Scorers before CC** — six A-020 rails stuck at 254/254 `not-yet` until P-59.
3. **Map layers dormant** — inspect cites atoms; map still uses GIS substitutes for several families.
4. **Post-launch backfill** — CAMA metros, statewide roads PBF, harvest fields explicitly **deferred** per A-017.

## What we had NOT yet framed as P0

- **Structural field gap** — ~3.3M metro parcels at 0% `living_area_sqft` / `year_built` because StratMap tier loaded instead of CAMA bulk despite `bulk_primary: true` on Dallas/Tarrant registry rows.
- **CAD consistency** — three parallel truths (`txgio_parcel`, `cad_property`, atoms) with StratMap parse discarding fields, bake presenting shoelace acreage as if it were CAD roll, tier stamps not on manifest cells.
- **Denominator error** — treating 15-county `cad_property` as "CAD coverage" when 253 counties were probed and 176 have full REST field inventories sitting unread in `_inbox/t6_cad_probe_*.json`.

## Plan rows that existed but were "post-launch"

| Row | Title | Status at freeze |
| --- | --- | --- |
| P-25 | CAD depth / CAMA parsers / bulk_primary | In OPS-16; L9 routing merged; full loads not applied |
| P-27 | Address-to-parcel resolver | Scoped; depends on situs + geo_id |
| Factory Q3 | Class A harvest fields | Inventoried 2026-08-10; not wired |
| Factory Q5 | CAMA bulk routing | Parser exists; metros not loaded |

## Desired end state (unchanged — still valid)

From `_inbox/2026-08-22_atom_full_surface_WDLL.md`:

> Every property-spine family that has atoms in the store is honestly reachable on SmartSite and honestly represented on Command Center.

**Addition after finding:** "has atoms in the store" presupposes **correct acquisition tier and statewide CAD roll consistency**. Without structural fields and tier honesty, surface wiring produces honest `atom-miss` on empty store — which is correct behavior but not customer-done.

## Reversal criteria for this snapshot

Superseded when operator approves an amended program card that names **CAD data plane** (structural + consistency) as explicit Phase 1.5 or parallel track to P-59..P-62, with plan rows and WDLL items.
