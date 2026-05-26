---
id: 41b_archicad_connector
title: ArchiCAD Connector
status: active
last_updated: 2026-05-25
applies_to: archicad-connector
related: [41_host_connectors_program, 41_revit_connector, 41e_host_connectors_hub, 40_design_accelerator, 41f_archicad_connector_sprint, 28_mcp_first_product_design]
---

# ArchiCAD Connector

Native Graphisoft ArchiCAD add-on that posts project snapshots to Cortex. Same product contract as the Revit Connector: **thin host pipe**, all intelligence in `api-server`.

Sprint outline: [`41f_archicad_connector_sprint.md`](41f_archicad_connector_sprint.md).

## Premortem

| Item | Result |
|------|--------|
| Sell reasoning, not data | **Green** if export is **native IFC** from ArchiCAD translators. Provenance records `translatorIdentifier` and `ifcVersion`. Yellow only if we fall back to mesh-only ingest. |
| Partnership-first | **Green** — product connector. |
| Cost per jurisdiction | **Green** — no new county ingest. |
| Dual interface | **Yellow** — MCP `cortex_snapshot_register` + `cortex_ifc_ingest` must ship with add-on v1. |
| Hauska spine | **Green**. |
| Focus queue | **Operational** — C++ add-on + AC29 DevKit is the heaviest host sprint; needs isolated agent clone. |
| Quality gate | **Green** with IFC translator metadata on ingest. |

**Verdict: green** — best technical fit of the three new hosts (real IFC, real API).

## Best UX (no partnership required)

| Surface | Behavior |
|---------|----------|
| In ArchiCAD | **Extensions → Hauska Cortex → Send Snapshot** (single command). Optional **Configure** for API URL + snapshot secret. |
| After send | Browser opens Cortex engagement URL (optional v1.1). |
| In Cortex | Identical to Revit: briefing, site context, findings, **3D tab** from IFC ingest. |

No Cortex panels inside ArchiCAD beyond menu + progress dialog. Matches Revit thin-host rule.

## Why native add-on (not bridge)

Graphisoft publishes a [C++ API](https://archicadapi.graphisoft.com/) with documented IFC export via `ACAPI_Automate(APIDo_SaveID, …, API_SavePars_Ifc)`. Same integration class as Revit: in-process export, no manual export folder.

**Platform support:** Windows and macOS (both required for architect ICP). One CMake solution, per-AC-version targets (27/28/29+), same source via linked compile units as Revit’s 2024/2026 pattern.

## Architecture

```
legacy-archicad-sensor/
  CMakeLists.txt
  src/Shared/           JSON, HTTP, settings (C++ or small static lib)
  src/Archicad29/       AC29 DevKit bindings (authoritative)
  src/Archicad28/       Linked sources, older SDK
  AddOn/                RegisterInterface, menu commands
```

**Settings:** `%APPDATA%\Hauska\DesignTools\settings.json` (shared path with Revit — one secret per machine).

**Distribution:** `.apx` add-on per ArchiCAD version; Connectors hub hosts download links + install steps ([`41e_host_connectors_hub.md`](41e_host_connectors_hub.md)).

## Send Snapshot pipeline

1. **Identity** — `hostTool: "archicad"`, project path, Archicad project GUID / unique id, project name (from API).
2. **Match** — `POST /api/engagements/match`.
3. **Snapshot** — sheet list metadata (layouts in current publisher set or user selection).
4. **Sheets** — PDF per layout via `API_SavePars_Pdf` (or plot export equivalent).
5. **IFC** — `API_SavePars_Ifc` with selected translator; upload to `POST /api/snapshots/{id}/ifc`.

**3D:** Mandatory full 3D via **native IFC** — reuses existing `ingestSnapshotIfc` and BIM tab (no SKP conversion).

## Wire contract

Identical paths to Revit ([`41_revit_connector.md`](41_revit_connector.md)). Match body generalizes to:

```json
{
  "hostTool": "archicad",
  "projectName": "...",
  "hostDocumentId": "<archicad-project-guid>",
  "hostDocumentPath": "..."
}
```

Backward compatible: accept legacy `revitCentralGuid` field as alias for `hostDocumentId` when `hostTool` absent.

## Operational gaps (plan to close in sprint)

| Gap | Sprint phase |
|-----|----------------|
| Code signing / notarization (macOS) | A.5 |
| CI without AC GUI | A.4 — compile-only + manual smoke |
| Version matrix AC 27–29 | A.1 |
| IFC translator selection UX | A.3 |

## Strategic frames

- **Stay thin** — no compliance logic in C++; only extract + HTTP.
- **IFC is the 3D contract** — do not ship ArchiCAD v1 on mesh-only path unless IFC export fails in smoke tests.
- **Official partnership** — opportunistic; does not block v1 add-on.

## Cross-references

- Program: [`41_host_connectors_program.md`](41_host_connectors_program.md)
- Revit reference implementation: [`41_revit_connector.md`](41_revit_connector.md)
- SaaS app: [`40_design_accelerator.md`](40_design_accelerator.md)
