Plan row **P-60** (OPS-16 A-023). WDLL: `_inbox/2026-08-22_atom_full_surface_WDLL.md` items 8–9. Depends on P-59 close (met/partial).

## Occupancy

- Code: `P:/seat-worktrees/property/hauska-map` branch off `origin/main`
- Close: `P:/doc_repo/_inbox/` only (planner commits)

## Mission

Audit SmartSite map layer registry for spatial atom families and produce CP1 flip plan.

### Families (item 8)

rrc-pipeline-fact, well-fact, building-footprint, rail-corridor-fact, special-district-fact (mud-pid policy: type subcategorization, not second build), flood-hazard-fact, buildable-envelope.

### Per family deliverable

```json
{
  "family": "rrc-pipeline-fact",
  "registryKey": "texas-rrc",
  "live": false,
  "atomFetchPath": "file:line or NONE",
  "currentSource": "GIS bake | atom | none",
  "flipReady": true,
  "blocker": null,
  "goldParcelProbe": "48021:34137"
}
```

### Required reads

- `packages/map-renderer/src/layer-registry.js` (or current path on main)
- PE browse map layer wiring
- `_inbox/2026-08-22_atom_full_surface_gap_backlog.json` mapLayersInspectOnlyNoAtomFetch section
- P-58 close for baseline

### Item 9

For each family with `live:true` or proposed flip, document paired inspect path and falsifier for "map shows GIS when inspect says atom-miss".

## Out of scope

- Implementing flips (CP2 wave)
- Deploy
- Scorer work (P-59 done)

## Return

CP1: `_inbox/2026-08-23_p60-map-layers_cp1.json` with ranked flip order + per-family rows. No live probes required in CP1.
