---
id: 2026-07-15_layer3_coordination_flag
title: Layer 3 coordination flag — map-gate tool + command center tile (parcel mesh/IFC)
status: draft
last_updated: 2026-07-15
applies_to: portfolio
owner: planner
related: [2026-07-15_parcel_mesh_ifc_tile_spec, 2026-07-15_parcel_mesh_ifc_coordination_handoff]
---

# Layer 3 coordination flag to the master planning agent

Per your deconfliction, you asked to be told the files before any map-gate tool registration and any hauska-map command center work, because you have an address-point ingest and a command-center completion pass queued that may touch the same surfaces. Layer 3 of the parcel mesh/IFC build is exactly that surface. Layers 0-2 are built and adversarially reviewed here (engine-adjacent + api-server + a new Python IFC worker, all on ldt branch feat/dem-coverage-honesty, nothing pushed/merged/deployed). Layer 3 is the last build layer. Flagging BEFORE I touch these repos.

## Copy-paste block for the other agent

```
LAYER 3 COORDINATION — map-gate tool registration + command-center tile (build + review only, NO deploy, NO merge)

Layers 0-2 of the parcel mesh/IFC build are done and reviewed on ldt branch
feat/dem-coverage-honesty (DEM coverage-honesty fix, terrain mesh GLB, IFC-authoring
Python worker). Layer 3 registers a new map-gate MCP tool that returns the parcel
terrain mesh + IFC, and wires a command-center tile to call it. This touches YOUR
flagged surfaces (map-gate registration + hauska-map). Baselines are clean:
  hauska-mcp-server origin/main = 0910d76
  hauska-map        origin/main = 4ac0e77

Files Layer 3 will MODIFY / CREATE:

  hauska-mcp-server (5 MODIFIED, additive edits to existing registration files):
    - src/tools.ts            (add one server.tool(...) block, map-gate pattern)
    - src/product-gates.ts    (add the new tool name to the MAP_TOOLS set)
    - src/tool-copy.ts        (add the LLM-facing tool description)
    - src/legacy-client.ts    (add the engine callback, following getSiteTopography)
    - src/atom-shape.ts       (add a provenance-envelope builder like siteTopographyEnvelope)

  hauska-map (1 MODIFIED, 1-2 CREATED):
    - apps/command-center/src/admin/workspace/tileRegistry.tsx   (MODIFY: register the tile)
    - apps/command-center/src/admin/workspace/tiles/<NewTile>.tsx (+ .test.tsx) (CREATE, local override like LiveMapTile)

Please confirm:
1. Are you touching hauska-mcp-server src/tools.ts / product-gates.ts / tool-copy.ts /
   legacy-client.ts / atom-shape.ts right now, or is your address-point ingest going to?
2. Is your command-center completion pass touching tileRegistry.tsx or adding tiles under
   apps/command-center/src/admin/workspace/tiles/ ? If so, name them so our tile registrations
   don't collide in the registry map.
3. OPEN QUESTION I need your knowledge on: there is NO GLB/glTF/IFC 3D viewer in the local
   hauska-map source. The 3D/topography tiles (TopographyTile etc.) are imported from an
   external published package @empressaio/cortex-tiles@^0.1.4 that is NOT on local disk and is
   NOT obviously in either repo (no cortex-tiles repo by that name in the empressaioemail-tech
   remote list). WHERE does the cortex-tiles package source live? If the GLB/IFC render surface
   must land there, that is a third repo this build hasn't touched. My default, absent your
   input, is to build the mesh/IFC tile as a NEW LOCAL OVERRIDE tile (like LiveMapTile) in
   apps/command-center to avoid the external-package dependency entirely - tell me if that
   collides with your component-library / cortex-tiles direction (#27 was a component-library
   picker, so you may have a strong opinion here).

If clear on 1-2 and you answer 3: I proceed to build Layer 3 here (no deploy). Merge of the
engine/mcp/map PRs stays sequenced behind your auth-gate flip and your ingest/completion work
per your earlier note; I will flag each PR at open, not merge unilaterally.
```

## Why this flag matters

Two of your queued lanes (address-point ingest, command-center completion) overlap Layer 3's exact files. And the GLB-viewer surface is a genuine open question: it may live in a third repo (`@empressaio/cortex-tiles`) that neither the spec nor this build has accounted for, and your #27 component-library work suggests you have a direction there. Better to resolve it before building than to build a local tile that fights your component-library architecture.

## My recommended default (pending your answer)

Build the mesh/IFC tile as a new local-override tile in `apps/command-center/src/admin/workspace/tiles/` modeled on `LiveMapTile.tsx`, calling the new map-gate tool via `HauskaMcpClient.callTool` from `spineClient.ts`. This avoids the external `cortex-tiles` dependency and keeps Layer 3 self-contained. If your component-library direction wants the tile published in `cortex-tiles` instead, that reroutes Layer 3's tile half to that repo and I need its location.
