---
id: 41c_sketchup_connector
title: SketchUp Connector
status: active
last_updated: 2026-05-25
applies_to: sketchup-connector
related: [41_host_connectors_program, 41_revit_connector, 41d_softplan_connector, 41e_host_connectors_hub, 41g_sketchup_connector_sprint, 40_design_accelerator]
---

# SketchUp Connector

Trimble SketchUp extension (Ruby) that sends the **active model** to Cortex. Large residential and concept-market share; SoftPlan and others export SKP for downstream BIM — owning SketchUp removes a hop in that chain.

Sprint outline: [`41g_sketchup_connector_sprint.md`](41g_sketchup_connector_sprint.md).

## Premortem

| Item | Result |
|------|--------|
| Sell reasoning, not data | **Yellow.** SketchUp geometry is loose compared to BIM IFC. Provenance must state `fidelityTier: "concept-mesh"` when not exporting IFC. If SketchUp Pro IFC export is available in target versions, prefer IFC path → green. |
| Partnership-first | **Green**. |
| Cost per jurisdiction | **Green**. |
| Dual interface | **Yellow** — MCP ingest tools in sprint. |
| Hauska spine | **Green**. |
| Focus queue | **Operational** — Ruby extension is smaller than ArchiCAD; good second host after platform P0. |
| Quality gate | **Yellow** — require provenance; cap finding claims that need parametric BIM when only mesh uploaded. |

**Verdict: yellow, acceptable** — ship with explicit fidelity tier and IFC-first when available.

## Best UX (no partnership required)

| Surface | Behavior |
|---------|----------|
| In SketchUp | **Extensions → Hauska Cortex → Send Snapshot** |
| Configure | HTML dialog or Ruby inputbox: Cortex URL, snapshot secret |
| Progress | Status bar + modal progress (export + upload) |
| Cortex | Same engagement / 3D / findings as Revit |

**Optional v1.1:** Toolbar icon; open engagement in default browser on success.

## Why Ruby extension (not bridge)

SketchUp’s supported integration surface is the **Extension Warehouse / RBZ** model ([Ruby API](https://ruby.sketchup.com/)). The active model is already in memory — no watch folder, no forgotten export step.

**Platform:** SketchUp 2021–2025 (define minimum in sprint A.1 after API audit). Windows and macOS from one codebase.

## Architecture

```
legacy-sketchup-extension/
  hauska_cortex/
    hauska_cortex.rb          loader
    main.rb                   command registration
    snapshot_pipeline.rb      identity, match, snapshot, export, upload
    http_clients.rb           match, snapshot, sheets, ifc, model
    configure_dialog.html     optional WebDialog/HtmlDialog
  package.rb                  RBZ manifest
```

**Settings:** `%APPDATA%\Hauska\DesignTools\settings.json` on Windows; `~/Library/Application Support/Hauska/DesignTools/` on macOS (document both in hub).

**Distribution:** Signed RBZ (Trimble extension signing when available); unsigned sideload instructions in Connectors hub for dev/pilot.

## Send Snapshot pipeline

1. **Identity** — `hostTool: "sketchup"`, `model.path`, `model.title`, persistent model id if available.
2. **Match** — same as Revit.
3. **Snapshot** — scene/page list (scrapbooks, layers metadata as JSON in snapshot payload).
4. **2D sheets** — export PNG or PDF per scene / plan view (Ruby `view.write_image` or layout export if Layout-linked — v1: **scenes as PNG** sheets).
5. **3D (mandatory)** — dual path, quality-gated:
   - **Path A (preferred):** Export **IFC** if `model.export` IFC supported on installed SKU → `POST .../ifc`.
   - **Path B:** Export **FBX** or **Collada** from active model → `POST .../model` → `ingestSnapshotModel` → glTF bundle (same viewer as SoftPlan path).

## 3D fidelity rules

| Export | `modelProvenance.fidelityTier` | BIM tab |
|--------|-------------------------------|---------|
| IFC from SketchUp | `bim-ifc` | Full element list (subject to ingest quality) |
| FBX/Collada only | `concept-mesh` | glTF viewer + element count from mesh segmentation; compliance copy notes limits |

Do not claim Revit-equivalent parametric compliance on mesh-only path.

## Wire contract

Same four endpoints as Revit; adds **`POST /api/snapshots/{id}/model`** when Path B used (platform sprint).

## Relationship to SoftPlan

SoftPlan users often export SKP. **SketchUp connector** serves architects who **live in SketchUp**. SoftPlan bridge may still produce SKP files; those can be opened in SketchUp and re-sent, but the primary SoftPlan 3D path remains **FBX from SoftPlan** ([`41d_softplan_connector.md`](41d_softplan_connector.md)) — do not force SoftPlan → SketchUp → Cortex for v1.

## Cross-references

- Program: [`41_host_connectors_program.md`](41_host_connectors_program.md)
- SoftPlan (SKP export source, different product): [`41d_softplan_connector.md`](41d_softplan_connector.md)
- Hub: [`41e_host_connectors_hub.md`](41e_host_connectors_hub.md)
