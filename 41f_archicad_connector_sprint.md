---
id: 41f_archicad_connector_sprint
title: ArchiCAD Connector — sprint outline
status: active
last_updated: 2026-05-25
applies_to: archicad-connector
related: [41b_archicad_connector, 41_host_connectors_program, 41i_host_connectors_hub_sprint, 41e_host_connectors_hub]
---

# ArchiCAD Connector — sprint outline

Product home: [`41b_archicad_connector.md`](41b_archicad_connector.md).

**Prerequisite:** Platform P0 from [`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md) (host match + provenance).

**Repo:** `empressaioemail-tech/legacy-archicad-sensor` (create).

**Agent:** Dedicated clone + cc-agent; C++ / CMake; Grok Build for implementation, Claude only for DevKit linkage blockers.

---

## Done definition (sprint exit)

- AC29 (and one prior version) add-on installs on Windows and macOS smoke machine.
- **Send Snapshot** produces engagement match + snapshot + PDF sheets + **IFC** on Musgrave-equivalent test project.
- Cortex 3D tab shows non-zero elements and visible geometry (same bar as Revit IFC QA-32/33).
- Connectors hub card links to release artifact and install doc.
- MCP: `cortex_snapshot_register` + `cortex_ifc_ingest` round-trip documented in dispatch.

---

## Phase A — Scaffold and identity

| ID | Work |
|----|------|
| A.1 | Create repo; CMake; ArchiCAD 29 DevKit pin; folder layout per product home |
| A.2 | Shared HTTP + JSON (match, snapshot, multipart upload clients) — port patterns from `legacy-revit-sensor` Shared |
| A.3 | Settings read/write `%APPDATA%\Hauska\DesignTools\settings.json` + macOS path |
| A.4 | Menu registration: **Extensions → Hauska Cortex → Configure / Send Snapshot** |
| A.5 | Identity extractor: project name, path, stable GUID from API |
| A.6 | `POST /api/engagements/match` with `hostTool: "archicad"` integration test against local cortex-api |

---

## Phase B — 2D sheets

| ID | Work |
|----|------|
| B.1 | Enumerate publisher layouts / sheet list for snapshot payload |
| B.2 | Export PDF per layout via `APIDo_SaveID` + `API_SavePars_Pdf` |
| B.3 | Multipart upload to `/api/snapshots/{id}/sheets` |
| B.4 | Error handling: translator missing, export cancelled — user-visible dialog + log file |

---

## Phase C — 3D IFC (mandatory)

| ID | Work |
|----|------|
| C.1 | IFC export via `API_SavePars_Ifc` (translator id, element set, bounding box flag per API docs) |
| C.2 | Upload to `/api/snapshots/{id}/ifc` |
| C.3 | Smoke: verify `materializable_elements` count > 0 on test engagement |
| C.4 | Attach `modelProvenance` on api-server ifc ingest for `hostTool archicad` + translator metadata (api-server small PR if not in P0) |

---

## Phase D — Distribution and hub

| ID | Work |
|----|------|
| D.1 | Build `.apx` per target AC version; README install steps Win/Mac |
| D.2 | GitHub release workflow (manual smoke gate) |
| D.3 | Connectors catalog entry: download URL, version matrix, detect paths |
| D.4 | Code signing / notarization checklist (can be operator task; document blockers) |

---

## Phase E — MCP and tests

| ID | Work |
|----|------|
| E.1 | Confirm hauska-mcp-server tools work with archicad-originated snapshot ids |
| E.2 | Manual test script in repo `TESTING.md` |
| E.3 | Optional: compile-only CI job on push (no ArchicAD headless runner) |

---

## Out of scope (this sprint)

- Write-back / detail placement into ArchiCAD (DA-10 class).
- B1–B5 bidirectional taxonomy.
- In-process Cortex panels (browser only).
- Official Graphisoft marketplace listing (bizops parallel).

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| DevKit version skew | Pin SDK to AC29; second target AC28 only after A complete |
| macOS notarization delay | Ship Win first; macOS beta badge in hub |
| IFC translator variance | Document required translator in install guide; snapshot provenance records translator id |

---

## Acceptance tests (operator)

1. Configure secret in add-on → Test connection in Cortex Integrations green.
2. Send Snapshot on test `.pla` project with address populated.
3. Cortex: briefing runs, 3D tab populated, findings generated.
