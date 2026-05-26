---
id: 41g_sketchup_connector_sprint
title: SketchUp Connector — sprint outline
status: active
last_updated: 2026-05-25
applies_to: sketchup-connector
related: [41c_sketchup_connector, 41_host_connectors_program, 41i_host_connectors_hub_sprint, 41e_host_connectors_hub]
---

# SketchUp Connector — sprint outline

Product home: [`41c_sketchup_connector.md`](41c_sketchup_connector.md).

**Prerequisite:** Platform P0 ([`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md)) including `POST /api/snapshots/{id}/model`.

**Repo:** `empressaioemail-tech/legacy-sketchup-extension` (create).

---

## Done definition

- RBZ installs on SketchUp 2022+ Win/Mac.
- **Send Snapshot** uploads scene PNGs (sheets) + **3D** via IFC **or** FBX/Collada on `model` endpoint.
- Cortex 3D tab shows geometry; provenance displays correct fidelity tier.
- Hub card + install doc published.

---

## Phase A — Extension scaffold

| ID | Work |
|----|------|
| A.1 | Extension loader, menu: **Extensions → Hauska Cortex → Configure / Send Snapshot** |
| A.2 | Settings persistence (cross-platform Hauska settings path) |
| A.3 | HTTP clients (Ruby): match, snapshot, multipart sheets, ifc, model |
| A.4 | Identity: `model.path`, `model.title`, `hostTool: "sketchup"` |
| A.5 | Configure dialog (HtmlDialog): API URL, secret, save |

---

## Phase B — 2D sheets

| ID | Work |
|----|------|
| B.1 | Iterate scenes / standard views; export PNG per scene to temp dir |
| B.2 | Build sheet manifest in snapshot payload (name, scene guid) |
| B.3 | Upload PNGs to `/sheets` |
| B.4 | Handle empty model / unsaved model — block with save prompt |

---

## Phase C — 3D (mandatory, dual path)

| ID | Work |
|----|------|
| C.1 | **Path A:** Detect IFC export capability; export temp IFC; upload `/ifc`; provenance `bim-ifc` |
| C.2 | **Path B:** Export FBX or DAE; upload `/model`; provenance `concept-mesh` |
| C.3 | Auto-select: try IFC first; on failure or empty, fall back to FBX with user notice |
| C.4 | Smoke: 3D tab non-empty on test residence model |
| C.5 | Cortex UI copy for mesh-only tier (coordinate with hub sprint UI strings) |

---

## Phase D — Package and hub

| ID | Work |
|----|------|
| D.1 | RBZ build script; version in `extension.json` |
| D.2 | GitHub release |
| D.3 | Connectors catalog card; SketchUp Extension Warehouse submission prep (optional doc) |
| D.4 | `TESTING.md` manual matrix (Win/Mac × SU versions) |

---

## Phase E — MCP

| ID | Work |
|----|------|
| E.1 | `cortex_snapshot_register` + `cortex_ifc_ingest` / new `cortex_model_ingest` verification |
| E.2 | Document MCP message size limit for large FBX (base64 path) |

---

## Out of scope

- SketchUp Layout deep integration (unless trivial scene export covers).
- Live sync / webhook on model save.
- Trimble Connect partnership.

---

## Premortem watch (sprint-internal)

- **Yellow:** mesh-only compliance claims — UI must show fidelity tier.
- **Yellow:** SketchUp Make vs Pro IFC — detect SKU and adjust path in C.1.

---

## Acceptance tests

1. Unsaved model → prompted to save.
2. Send Snapshot → Cortex engagement has sheets + 3D.
3. Integrations: Test connection + host detected (SketchUp install path).
