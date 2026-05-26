---
id: 41h_softplan_connector_sprint
title: SoftPlan Connector — sprint outline
status: active
last_updated: 2026-05-25
applies_to: softplan-connector
related: [41d_softplan_connector, 41_host_connectors_program, 41i_host_connectors_hub_sprint, 41e_host_connectors_hub, 43_cortex_qa_backlog]
---

# SoftPlan Connector — sprint outline

Product home: [`41d_softplan_connector.md`](41d_softplan_connector.md).

**Prerequisite:** Platform P0 — **`ingestSnapshotModel`** (FBX/SKP→glTF), host match, provenance ([`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md)).

**Repo:** `empressaioemail-tech/legacy-softplan-bridge` (create).

**Operator asset:** Trial/install at `P:\SoftPlan2026Trial` for format smoke tests.

---

## Done definition

- Bridge installs; watches export folder; completes match → snapshot → PDF sheets + **FBX model** upload.
- Cortex 3D tab: **visible glTF mesh** + element badge > 0 (mesh-derived elements acceptable with `concept-mesh` or `softplan-fbx` tier).
- `modelProvenance` on snapshot and bim-model atoms.
- Export runbook validated on one real `.spp` project.
- Hub card + installer linked.
- QA-21 acceptance: SoftPlan path no longer "strategy only."

---

## Phase A — Bridge scaffold

| ID | Work |
|----|------|
| A.1 | Create `legacy-softplan-bridge` .NET 8 solution; tray app; FileSystemWatcher |
| A.2 | Shared HTTP clients (copy from `legacy-revit-sensor` Shared) |
| A.3 | `manifest.json` schema + validator (required: plan-set-pdf, model-fbx) |
| A.4 | Settings UI: API URL, secret, watch path, open export folder |
| A.5 | Upload pipeline: stable file detection (debounce), ordered POSTs |
| A.6 | Logging: `%APPDATA%\Hauska\DesignTools\softplan-bridge.log` |

---

## Phase B — Export runbook and operator tooling

| ID | Work |
|----|------|
| B.1 | `docs/EXPORT_RUNBOOK.md`: `.spp` address, `.spv` PDF batch, SoftView FBX, `.spd` DWG prerequisites |
| B.2 | Create `_cortex_exports` template folder with `manifest.template.json` |
| B.3 | Optional: PowerShell helper `New-CortexExportJob` (creates job dir + manifest stub) |
| B.4 | Smoke matrix on `P:\SoftPlan2026Trial`: export FBX + PDF from sample project; record file sizes |

---

## Phase C — api-server model ingest (with platform sprint)

| ID | Work |
|----|------|
| C.1 | `POST /api/snapshots/{id}/model` multipart (fbx, skp) |
| C.2 | `ingestSnapshotModel.ts` worker: FBX→glTF (assimp or Blender container — pick one in spike S.1) |
| C.3 | Write `materializable_elements` + bundle row mirroring IFC bundle shape |
| C.4 | `modelProvenance`: hostTool, sourceFormat, conversionPipeline, fidelityTier |
| C.5 | Quality gate: fail ingest with actionable error if mesh empty; partial success forbidden for 3D mandatory |
| C.6 | Optional gated branch: SKP→IFC only when gate passes → call existing `ingestSnapshotIfc` |

**Spike S.1 (first work in sprint):** Run FBX from SoftPlan through chosen converter locally; confirm glTF loads in existing `BimModelViewport`.

---

## Phase D — 2D and DWG

| ID | Work |
|----|------|
| D.1 | Upload plan-set PDFs to `/sheets` |
| D.2 | Optional: DWG upload route or tag DWG as sheet type for compliance on vector sheets |
| D.3 | Briefing + findings smoke on PDF-only layers (3D independent) |

---

## Phase E — Hub and distribution

| ID | Work |
|----|------|
| E.1 | Bridge installer (WiX or single-file publish) |
| E.2 | Connectors catalog: SoftPlan card, runbook link, bridge download |
| E.3 | Tray: "Open in Cortex" after successful upload (deep link engagement) |

---

## Phase F — MCP and hardening

| ID | Work |
|----|------|
| F.1 | `cortex_model_ingest` MCP tool wrapping `/model` |
| F.2 | Max upload size + timeout env vars on cortex-api |
| F.3 | Rate limit: one ingest per snapshot per minute |

---

## Phase G — Automation follow-on (optional same sprint if A–F green)

| ID | Work |
|----|------|
| G.1 | FlaUI spike: trigger reView batch PDF export (Windows only) |
| G.2 | Do not merge G.1 unless reliability > 90% on operator machine |

---

## Out of scope

- Reverse-engineering `.spp` binary.
- In-process SoftPlan plugin without vendor SDK.
- Official SoftPlan partnership (parallel bizops).
- Forcing SoftPlan users through SketchUp.

---

## Premortem gates (do not skip)

| Gate | Blocker if failed |
|------|-------------------|
| P1 | FBX from SoftPlan produces valid mesh in converter spike |
| P2 | `modelProvenance` in DB and visible in Cortex 3D UI |
| P3 | Findings do not claim native BIM on mesh-only tier |

---

## Acceptance tests

1. Runbook followed manually → bridge uploads → Cortex 3D populated.
2. Missing FBX in job folder → bridge error, no partial snapshot marked complete.
3. Integrations ping + SoftPlan install detect (Program Files / trial path).
