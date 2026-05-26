---
id: 41d_softplan_connector
title: SoftPlan Connector
status: active
last_updated: 2026-05-25
applies_to: softplan-connector
related: [41_host_connectors_program, 41c_sketchup_connector, 41_revit_connector, 41e_host_connectors_hub, 41h_softplan_connector_sprint, 43_cortex_qa_backlog, _decisions/2026-05-23_partnership_first_scoping]
---

# SoftPlan Connector

Windows integration for SoftPlan 2026+ that delivers **mandatory full 3D** and plan-set sheets into Cortex. No public SoftPlan add-in SDK ([softplan GitHub org](https://github.com/orgs/softplan/repositories) is utilities only — forks, not product APIs). v1 is **export profile + bridge**, not in-process plugin.

Binary recon source: `P:\SoftPlan2026Trial` (2026 install). Sprint: [`41h_softplan_connector_sprint.md`](41h_softplan_connector_sprint.md).

## Premortem

| Item | Result |
|------|--------|
| Sell reasoning, not data | **Yellow (load-bearing).** FBX/SKP→glTF is derived geometry. Must ship `modelProvenance` and surface fidelity in Cortex 3D tab. Findings must not imply native BIM if only mesh path. |
| Partnership-first | **Green** for Cortex baseline data. |
| Cost per jurisdiction | **Green** at county level. **Yellow operational** on Cloud Run conversion COGS — enforce max file MB and worker timeout. |
| Dual interface | **Yellow** — MCP model ingest in platform sprint. |
| Hauska spine | **Green** — QA-21 distribution channel (~7k SoftPlan/ArchiCAD community per [`18_stakeholder_graph.md`](18_stakeholder_graph.md)). |
| Focus queue | **Operator priority** — treat as imperative; displaces other WS-F unless named. |
| Quality gate | **Red without provenance** — **green only** with conversion metadata + quality gate (see sprint H.2). |

**Verdict: yellow — proceed with FBX-first glTF ingest + provenance; optional IFC branch behind gate.**

## Best UX (no partnership required)

| Phase | Architect experience |
|-------|---------------------|
| **v1** | SoftPlan: **File → Export for Cortex** (documented macro steps: plan-set PDF + FBX from SoftView). Bridge tray icon: **Watching… / Uploaded / Open in Cortex**. |
| **v1.1** | Optional UI Automation to drive reView batch PDF (FlaUI), still no SDK. |
| **v2** | SoftPlan menu item via vendor partnership (not gating v1). |

Cortex app experience after upload: **same** as Revit (engagement, briefing, findings, **3D tab with mesh**). Badge when mesh-only: *"SoftPlan model (converted FBX, medium fidelity)."*

## Why bridge (not add-in)

| Fact | Implication |
|------|-------------|
| No add-in API in install or public repos | Cannot register ribbon in-process without reverse engineering `spcore.dll` |
| `reView.dll` exposes `PDF_BATCH_EXPORT_INFO` | Plan-set PDF is automatable in v1.1; v1 manual |
| `libfbxsdk.dll`, Lumion **FBX** export | **Primary 3D interchange** |
| `ExportSKP2025.dll` etc. | **Secondary 3D** (community BIM handoff) |
| No IFC in install strings | Do not plan IFC-first from SoftPlan |

## File formats (integration contract)

| Extension | Role |
|-----------|------|
| `.spp` | Project root — identity |
| `.spv` | reView plan set — PDF batch source |
| `.spd` | Drawing — vector DWG export prerequisite |
| `.pag` | Plan set page |

## Architecture

```
legacy-softplan-bridge/
  src/Hauska.SoftPlan.Shared/     HTTP clients, settings, manifest schema
  src/Hauska.SoftPlan.Bridge/     Tray app, FileSystemWatcher, uploader
  docs/EXPORT_RUNBOOK.md            Operator + architect steps
```

**Export drop zone (default):** `%USERPROFILE%\Documents\SoftPlan Projects\_cortex_exports\<jobId>\`

**manifest.json** (bridge writes before upload):

```json
{
  "hostTool": "softplan",
  "hostVersion": "2026",
  "projectName": "",
  "hostDocumentId": "sha256:...",
  "hostDocumentPath": "",
  "exports": [
    { "kind": "plan-set-pdf", "path": "plan-set.pdf" },
    { "kind": "model-fbx", "path": "model/model.fbx" },
    { "kind": "sheet-dwg", "name": "A1.1", "path": "sheets/A1.1.dwg" }
  ]
}
```

## Send Snapshot pipeline

1. Match (generalized host identity).
2. Snapshot create with manifest attachment.
3. Upload PDFs to `/sheets`.
4. Upload **FBX** (or SKP) to **`POST /api/snapshots/{id}/model`**.
5. Optional DWG sheets to `/sheets` or new `/dwg` if distinct from PDF pipeline.

## 3D path (mandatory)

**Primary:** SoftView → export **FBX** (visible floors) → `ingestSnapshotModel` → glTF bundle + coarse elements for BIM tab.

**Secondary:** SKP export → same ingest or SKP→IFC branch **only if** quality gate passes (min mesh count, bbox, non-degenerate).

**Do not** rely on SKP→IFC as sole path (premortem failure mode: fake IFC semantics).

## Export runbook essentials (v1)

Architect must:

1. Fill **Client / Project Information** (address for jurisdiction).
2. Build plan set in reView; batch export PDF to job folder.
3. Export **FBX** from SoftView for 3D.
4. For vector DWG elevations: save each elevation as **drawing** (`.spd`), then export DWG (forum-confirmed requirement — [export planset to DWG](https://softplan.com/forum/index.php?/topic/6513-export-planset-to-dwg/)).

Bridge uploads when `manifest.json` + required files stable.

## Wire contract

Match + snapshot + sheets + **model** (new). Reuse `x-snapshot-secret`.

## Cross-references

- Program: [`41_host_connectors_program.md`](41_host_connectors_program.md)
- SketchUp (different product, not required middleman): [`41c_sketchup_connector.md`](41c_sketchup_connector.md)
- QA-21: [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md)
