---
id: 2026-07-15_parcel_mesh_ifc_coordination_handoff
title: Coordination handoff — parcel mesh/IFC tile build (deconflict before start)
status: draft
last_updated: 2026-07-15
applies_to: portfolio
owner: planner
related: [2026-07-15_parcel_mesh_ifc_tile_spec]
---

# Coordination handoff to the master planning agent

Relay this to the master planning agent before the parcel mesh/IFC tile build starts. Purpose: deconflict repo/file ownership so two in-flight efforts do not collide. Nothing in this build deploys; deconfliction is about shared-clone commit safety and lane overlap, not about deployment.

## Copy-paste block for the other agent

```
COORDINATION REQUEST — parcel mesh/IFC tile build (build + adversarial review only, NO deploy)

A build is being scoped in doc_repo: an Empressa command center tile that takes a
parcel (ID or address) from the spine and returns a georeferenced 3D terrain mesh
plus an IFC model, coverage-honest and provenance-stamped. Spec:
_inbox/2026-07-15_parcel_mesh_ifc_tile_spec_DRAFT.md.

Before I touch code I need to deconflict with your in-flight work. This build will
READ/MODIFY these files (build + review only, no deploy):

  hauska-engine:
    - packages/adapters/src/topography/usgs3dep.ts   (coverage-honesty: capture actual resolution)
    - packages/adapters/src/federal/usgs-ned.ts       (coverage-honesty: carry EPQS rasterId)
    - net-new mesh + IFC authoring (likely a Python worker path alongside pysheds)

  legacy-design-tools:
    - lib/site-context/src/server/usgs3dep.ts          (DUPLICATE of the engine copy — same fix)
    - lib/adapters/src/federal/usgs-ned.ts             (DUPLICATE — same fix)
    - artifacts/api-server/src/lib/siteTopographyIngest.ts       (nodata->minElevation fix)
    - artifacts/api-server/src/lib/siteTopographyMaterializer.ts (project nodataCount to read model)

  hauska-mcp-server:
    - map-gate tool registration for the new parcel->mesh/IFC capability

  Empressa command center (hauska-map):
    - new tile component

Please confirm:
1. Are you currently touching hauska-engine or legacy-design-tools? Specifically the
   topography/federal adapters or the api-server site-context lib?
2. Is the engine auth-gate enforce lane (ENGINE_API_GATE_TOKEN sequence) active right
   now? This build must not collide with an auth-gate change on the engine.
3. Any map-gate / hauska-mcp-server tool registration work in flight?
4. Any hauska-map command center work in flight?

If any overlap: tell me the files/lanes and I sequence around you. If clear on all
four: I proceed to the planning pass. Either way, NOTHING here deploys until you and
the operator gate it separately.
```

## Why this coordination is load-bearing

- The DEM adapters (`usgs3dep.ts`, `usgs-ned.ts`) are byte-for-byte duplicated across `hauska-engine` and `legacy-design-tools`. Both repos were updated 2026-07-15. A coverage-honesty fix has to touch both copies. If the other agent is editing either, we collide on the exact same files.
- The engine auth-gate enforce lane is the current next-executable engineering lane and it modifies engine deploy config. This build touches engine adapter code. They must not interleave uncommitted in the shared clone.
- Shared-clone commit hazard is live in this environment: agents commit into the same `P:\` clones. Deconfliction plus commit-promptly plus explicit-path staging is how we avoid clobbering each other.

## What I need back before starting

A yes/no on each of the four questions above, plus the specifics of any overlap. On a clear result I take the spec into a planner / subagent / adversarial-review build here, no deploy.
