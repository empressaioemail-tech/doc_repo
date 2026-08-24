---
title: Setback geometry unification — map = export derive
status: closed
last_updated: 2026-08-24
program: get-current-data-serving-correctly
parent: _inbox/2026-08-23_phase2_data_ingest_program.md (Workstream C)
---

# WDLL — setback geometry unification (map = export)

**Operator approved 2026-08-23.** Option C — one derive path for card wedge, map overlay, and site-plan export.

## Operator ruling (2026-08-23)

Bastrop is not special. Every municipality uses the same four-layer shape (zoning bind → authoritative setbacks → geometry derive → single serve). Draw from the **most recent authoritative source** for that municipality — ranked by authority tier, then effective date. No Bastrop-only layer-23 preference; codified ordinance (e.g. BDC Ord. 2026-06) outranks stale GIS per-parcel cards when it is the authoritative source.

## Observable end state

Every parcel inspect that shows setback scalars on the card draws the **same** inset polygon on the map that site-plan PDF export would use for that parcel, or draws **nothing** with an honest decline (never a bow-tie, never a uniform client inset, never stale depth-warm geo that disagrees with boundary-edge labeling).

## Acceptance items

1. **Single geometry authority.** Map wedge geometry is produced only by cortex `labelEdges` + `deriveBuildableEnvelope`. Depth-warm promoted atom geojson is **not** served on facets for map draw (scalars may still come from atom-chain).

2. **GIS-stamped parcels derive.** `POST /api/brokerage/v1/place/buildable-envelope` runs the derive path for all stamped parcels. `atom_path_pending` with empty geojson is retired.

3. **Authoritative source resolver (all cities).** `resolveAuthoritativeSetbacks` picks codified ordinance vs GIS per-parcel vs atom-chain by tier then `effectiveDate`. Same module for every municipality.

4. **Navigation address threads.** When CAD situs is unusable (`, TX`), PE passes search/navigation address into buildable-envelope POST.

5. **Client inset retired.** `insetParcelBySetbacks` not used for product wedge when asymmetric setbacks exist.

6. **Gold parity.** `48021:34137` map wedge matches export per-edge setbacks within GIS tolerance (BDC scalars when ordinance is authoritative).

7. **Regression probes.** `48021:34137`, `48021:34073`, `48453:280239` per close criteria.

## Execution order

| Step | Repo | Status |
| --- | --- | --- |
| 1 | legacy-design-tools | **CLOSED** — [#467](https://github.com/empressaioemail-tech/legacy-design-tools/pull/467) `8c6d304f`, cortex `00560-rih` |
| 2 | hauska-map PE | **CLOSED** — [#196](https://github.com/empressaioemail-tech/hauska-map/pull/196) `f3e390ab`, smartsite.cloud |
| 3 | hauska-map PE | **CLOSED** — client inset retired |
| 4 | hauska-engine | optional — geometry-only site-plan endpoint |

Close artifact: `_inbox/2026-08-23_setback_geometry_unification_close.json` (2026-08-24 live probes, all three regression parcels PASS).

## Out of scope (SB08–SB11)

254-county factory, road-node ingest, serve dashboard.
