---
id: 41e_host_connectors_hub
title: Host Connectors hub — in-app marketplace and setup
status: active
last_updated: 2026-05-25
applies_to: design-accelerator
related: [41_host_connectors_program, 41_revit_connector, 41b_archicad_connector, 41c_sketchup_connector, 41d_softplan_connector, 41i_host_connectors_hub_sprint, 40_design_accelerator]
---

# Host Connectors hub

In-app surface where firms **discover, download, install, and verify** Cortex host connectors. Replaces ad-hoc email links and README hunting. Lives under **Settings → Integrations** (name operator-tunable in sprint).

Sprint outline: [`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md) (includes shared **platform P0** work).

## Premortem

| Item | Result |
|------|--------|
| Sell reasoning, not data | **Green** — hub is distribution + setup, not a data product. |
| Partnership-first | **Green**. |
| Cost per jurisdiction | **Green**. |
| Dual interface | **Green** — catalog JSON is agent-readable; future `cortex_list_connectors` MCP tool optional in sprint. |
| Hauska spine | **Green** — increases Cortex attach rate across hosts. |
| Focus queue | **Operational** — hub can ship after P0 API with Revit-only card, then expand cards as hosts land. |
| Quality gate | **Green** for hub copy; connector **status** must not claim "connected" without successful ping. |

**Verdict: green.**

## UX specification

### Entry points

| Location | Behavior |
|----------|----------|
| **Settings → Integrations** | Primary catalog grid |
| **First-run banner** (optional) | "Connect your design tool" → Integrations |
| **Engagement empty state** | "No snapshots yet" → link to Integrations + host-specific hint |

### Connector card (one per host)

| Field | Source |
|-------|--------|
| Name + logo | Static assets in `design-tools` |
| Supported versions | Catalog API (e.g. Revit 2024–2026, AC 28–29, SU 2022–2025, SP 2024–2026) |
| **Download** | Link to GitHub release / signed installer / RBZ |
| **Install guide** | Expandable steps (markdown rendered) |
| **Configure** | Shows path to `settings.json`; link to paste secret |
| **Connection status** | `unknown` / `configured` / `verified` / `error` |

### Connection verification

**"Test connection"** button:

1. Reads firm snapshot secret from workspace settings (never display full secret).
2. `POST /api/connectors/ping` with secret → 200 means Cortex API reachable and secret valid.
3. Optional **host detected** heuristic (best effort): registry / default install paths for Revit, ArchiCAD, SketchUp, SoftPlan — shows "Installed" vs "Not detected" without claiming live link.

Does **not** require the host app to be running for v1.

### Download artifacts (per host)

| Host | Artifact | Install target |
|------|----------|----------------|
| Revit | `.msi` or zip + MSBuild instructions | `%APPDATA%\Autodesk\Revit\Addins\{year}\` |
| ArchiCAD | `.apx` per version | ArchiCAD Add-Ons folder |
| SketchUp | `.rbz` | Extension Manager |
| SoftPlan | `Hauska.SoftPlan.Bridge.Setup.exe` | Tray app + export folder |

Version matrix on card; outdated connector shows upgrade CTA when catalog `minCortexApi` bumps.

## Catalog API

**`GET /api/connectors/catalog`** (authenticated architect session or public read with version header — decide in sprint)

```json
{
  "connectors": [
    {
      "id": "revit",
      "name": "Revit Connector",
      "status": "ga",
      "supportedHostVersions": ["2024", "2026"],
      "downloadUrl": "https://github.com/.../releases/...",
      "docsUrl": "https://docs.../revit",
      "installSteps": ["...", "..."],
      "detectPaths": {
        "win": ["%APPDATA%\\Autodesk\\Revit\\Addins"]
      }
    }
  ]
}
```

Static v1 acceptable (JSON in repo, served by api-server). v2: CMS or GitHub release webhook updates catalog.

**`POST /api/connectors/ping`** — validates `x-snapshot-secret` without creating snapshot.

## Settings integration

| Setting | Scope |
|---------|--------|
| Snapshot secret | Firm/workspace (existing or new) |
| Default Cortex API URL | Workspace |
| Per-host "last successful upload" | Optional telemetry for status badge |

Workspace **Access** tab (QA-51) and Integrations share secret — single source of truth.

## MCP (retrofit line)

| Tool | Purpose |
|------|---------|
| `cortex_list_connectors` | Return catalog for agent setup assistants |
| Existing `cortex_snapshot_register` / ingest | Unchanged |

## Acceptance criteria (hub)

- Architect opens Integrations, sees four host cards (Revit GA, others beta badge as shipped).
- Download links resolve to real release artifacts.
- Test connection returns clear success/failure without exposing secret.
- Install guide matches actual connector repo README.
- Mobile/narrow layout: cards stack; no broken download on tablet.

## Cross-references

- Program: [`41_host_connectors_program.md`](41_host_connectors_program.md)
- Platform sprint: [`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md)
