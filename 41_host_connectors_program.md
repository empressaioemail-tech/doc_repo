---
id: 41_host_connectors_program
title: Host connectors program — Revit, ArchiCAD, SketchUp, SoftPlan
status: active
last_updated: 2026-05-25
applies_to: design-accelerator
related: [41_revit_connector, 41b_archicad_connector, 41c_sketchup_connector, 41d_softplan_connector, 41e_host_connectors_hub, 40_design_accelerator, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 43_cortex_qa_backlog]
---

# Host connectors program

Cortex reaches architects where they model. Revit is live ([`41_revit_connector.md`](41_revit_connector.md)). This program adds **ArchiCAD**, **SketchUp**, and **SoftPlan**, plus an in-app **Connectors hub** so firms discover, download, and verify host integrations without hunting email links.

Each host has a product-home doc and a sprint outline. **No timelines** in sprint docs — only work phases and done bars.

## Program premortem (cross-cutting)

| Commitment | Assessment |
|------------|------------|
| Sell reasoning, not data | **Yellow unless enforced platform-wide.** Converted or exported geometry is derived data. Every host ingest must write `modelProvenance` (host, export format, conversion pipeline, fidelity tier) on snapshot and `bim-model` atoms. Findings that use geometry must cite provenance and confidence. |
| Partnership-first | **Green** for product connectors. City substrate ingest unchanged. |
| Cost per jurisdiction | **Green** at county level. Per-snapshot conversion (FBX/SKP→glTF) is product COGS — cap via worker timeouts and file-size limits. |
| Dual interface | **Yellow operational.** Each connector sprint includes MCP tool parity for register + model/sheet ingest per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md). |
| Hauska spine | **Green** — connectors feed Cortex → substrate code + atom graph. |
| Focus queue | **Operator call.** Four sprints plus shared platform work competes with 40h pre-deploy unless something is explicitly queued. Recommended build order: **Platform P0 → SoftPlan (distribution) → SketchUp → ArchiCAD → Hub polish**, or **Platform P0 → Hub (discoverability) → parallel host sprints** if multiple agents. |
| Quality gate | **Green only with provenance fields** — same yellow as commitment 1. |

**Overall program: yellow.** Proceed with provenance schema and platform sprint as hard gates before marketing "full BIM parity."

## Shared Cortex spine (all hosts)

Every connector implements the same **logical pipeline**:

```
Identify project → Match engagement → Create snapshot → Upload 2D sheets → Upload 3D model
```

| Step | api-server route | Auth |
|------|------------------|------|
| Match | `POST /api/engagements/match` | `x-snapshot-secret` |
| Snapshot | `POST /api/snapshots` | `x-snapshot-secret` |
| Sheets | `POST /api/snapshots/{id}/sheets` | `x-snapshot-secret` |
| IFC (native) | `POST /api/snapshots/{id}/ifc` | `x-snapshot-secret` |
| Model (FBX/SKP) | `POST /api/snapshots/{id}/model` | `x-snapshot-secret` (new) |

**Platform sprint (prerequisite for all hosts):** [`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md) Phase P0 — host identity on match, `ingestSnapshotModel`, provenance schema, MCP tools.

## Host comparison

| Host | Integration form | Primary 3D interchange | In-host UX target |
|------|------------------|------------------------|-------------------|
| Revit | C# add-in (shipped) | IFC | Ribbon **Send Snapshot** |
| ArchiCAD | C++ add-on | IFC (native API export) | Menu **Extensions → Cortex → Send Snapshot** |
| SketchUp | Ruby extension (`.rbz`) | SKP / FBX from active model | **Extensions → Cortex → Send Snapshot** |
| SoftPlan | Windows bridge + export profile | FBX primary, SKP fallback | **Export for Cortex** folder drop (bridge); in-app button is v2 |

## Repos (proposed)

| Repo | Stack | Host |
|------|-------|------|
| `legacy-revit-sensor` | C# | Revit (exists) |
| `legacy-archicad-sensor` | C++ / CMake | ArchiCAD |
| `legacy-sketchup-extension` | Ruby | SketchUp |
| `legacy-softplan-bridge` | C# .NET 8 | SoftPlan |
| `legacy-design-tools` | TS | api-server + Connectors hub UI |

## Canonical docs and sprints

| Doc | Type |
|-----|------|
| [`41b_archicad_connector.md`](41b_archicad_connector.md) | Product home |
| [`41c_sketchup_connector.md`](41c_sketchup_connector.md) | Product home |
| [`41d_softplan_connector.md`](41d_softplan_connector.md) | Product home |
| [`41e_host_connectors_hub.md`](41e_host_connectors_hub.md) | In-app marketplace / settings |
| [`41f_archicad_connector_sprint.md`](41f_archicad_connector_sprint.md) | Sprint outline |
| [`41g_sketchup_connector_sprint.md`](41g_sketchup_connector_sprint.md) | Sprint outline |
| [`41h_softplan_connector_sprint.md`](41h_softplan_connector_sprint.md) | Sprint outline |
| [`41i_host_connectors_hub_sprint.md`](41i_host_connectors_hub_sprint.md) | Hub + platform sprint |

## Queued ADR

**ADR-020 (queued):** Host connector identity, `ingestSnapshotModel` contract, `modelProvenance` on atoms, Connectors catalog API. Draft at hub sprint close.

## Cross-references

- QA-21 origin: [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md)
- Distribution: [`18_stakeholder_graph.md`](18_stakeholder_graph.md) SoftPlan / ArchiCAD community
- Partnership-first scoping: [`_decisions/2026-05-23_partnership_first_scoping.md`](_decisions/2026-05-23_partnership_first_scoping.md)
