---
id: 41i_host_connectors_hub_sprint
title: Host Connectors hub and platform — sprint outline
status: active
last_updated: 2026-05-25
applies_to: design-accelerator
related: [41e_host_connectors_hub, 41_host_connectors_program, 41f_archicad_connector_sprint, 41g_sketchup_connector_sprint, 41h_softplan_connector_sprint, 41_revit_connector]
---

# Host Connectors hub and platform — sprint outline

Product home (hub UX): [`41e_host_connectors_hub.md`](41e_host_connectors_hub.md).

This sprint ships **shared api-server + design-tools UI** required by ArchiCAD, SketchUp, and SoftPlan. Run **before or in parallel with** host-specific sprints. Revit benefits from generalized match but does not require re-release for P0.

**Repo:** `legacy-design-tools` (cc-agent-C primary).

---

## Done definition

- **Settings → Integrations** page live with connector cards (Revit GA; others beta as released).
- `GET /api/connectors/catalog` + `POST /api/connectors/ping`.
- Host-generalized `POST /api/engagements/match`.
- `POST /api/snapshots/{id}/model` + `ingestSnapshotModel` worker producing glTF bundle.
- `modelProvenance` persisted and shown in Cortex 3D tab.
- MCP tools documented for register + model ingest.
- ADR-020 draft filed at sprint close.

---

## Phase P0 — Platform (blocking for SoftPlan + SketchUp mesh path)

| ID | Work |
|----|------|
| P0.1 | **Match generalization:** `hostTool`, `hostDocumentId`, `hostDocumentPath`; Revit alias fields backward compatible |
| P0.2 | **DB / types:** snapshot columns or `propertySet` for `sourceHost`, `exportManifest`, `modelProvenance` |
| P0.3 | **Route:** `POST /api/snapshots/{id}/model` — multipart fbx, skp; size limit; `x-snapshot-secret` |
| P0.4 | **`ingestSnapshotModel`:** worker isolation (mirror IFC worker pattern); FBX→glTF; bundle row; mesh-derived `materializable_elements` with `source_kind` e.g. `as-built-model-fbx` |
| P0.5 | **Quality gate:** reject empty mesh; return structured error to bridge/extension |
| P0.6 | **BIM GET:** `bimModels` route returns model bundle for new source kinds (engagement-scoped supersession rules aligned with QA-35) |
| P0.7 | **3D UI:** provenance badge + fidelity tier copy in `BimModelTab` / viewport |
| P0.8 | **Tests:** api-server integration test with fixture FBX; design-tools unit test for provenance chip |
| P0.9 | **MCP:** `cortex_model_ingest` in hauska-mcp-server; extend `legacy-client` multipart helper |
| P0.10 | **Optional IFC branch:** if model is SKP and gate passes, invoke existing ifc ingest — behind feature flag |

**Spike (first):** Pick converter (Blender headless Docker vs assimp-native); prove on sample SoftPlan FBX from operator trial.

---

## Phase H1 — Connectors hub UI

| ID | Work |
|----|------|
| H1.1 | Settings nav item **Integrations** |
| H1.2 | `IntegrationsPage.tsx`: fetch catalog, render card grid |
| H1.3 | Card components: download CTA, expand install steps, version chips |
| H1.4 | **Test connection** → `POST /api/connectors/ping`; status badge |
| H1.5 | Host detect heuristic (optional): check paths from catalog `detectPaths` — client-side only |
| H1.6 | Link to `settings.json` location + workspace secret management (coordinate QA-51 Access tab) |
| H1.7 | Empty states: engagement snapshots tab links here |

---

## Phase H2 — Catalog content

| ID | Work |
|----|------|
| H2.1 | `artifacts/api-server/src/data/connectors-catalog.json` (or `lib/connectors/catalog.ts`) |
| H2.2 | Entries: revit, archicad, sketchup, softplan with placeholder URLs until host sprint releases |
| H2.3 | `GET /api/connectors/catalog` — returns JSON; version field for cache bust |
| H2.4 | Per-connector `installSteps` markdown strings |
| H2.5 | Beta vs GA badge rules in UI |

---

## Phase H3 — Revit catalog alignment

| ID | Work |
|----|------|
| H3.1 | Point Revit card at existing `legacy-revit-sensor` release |
| H3.2 | Update [`41_revit_connector.md`](41_revit_connector.md) related links to hub (rollup optional) |
| H3.3 | Ensure Revit Configure uses same ping endpoint |

---

## Phase H4 — Documentation and ADR

| ID | Work |
|----|------|
| H4.1 | Draft `80_adrs/adr_020_host_connectors.md` — identity, model ingest, provenance |
| H4.2 | Update [`41_host_connectors_program.md`](41_host_connectors_program.md) status if needed |
| H4.3 | Dispatch template note: host connector PRs must update catalog version on release |

---

## Out of scope

- Connector code in this sprint (except catalog metadata).
- SketchUp RBZ / ArchiCAD apx / SoftPlan bridge binaries.
- Extension Warehouse / Graphisoft marketplace submissions.
- Paid connector marketplace / billing.

---

## Premortem (platform)

| Item | Result |
|------|--------|
| Sell reasoning, not data | **Green only if P0.7 ships** — otherwise yellow program-wide. |
| Mesh ingest COGS | **Operational** — document env limits `MODEL_INGEST_MAX_MB`, worker timeout. |
| Focus queue | Hub P0 is **enabling work** for three hosts; smallest slice that unblocks SoftPlan is P0.3–P0.7. |

---

## Suggested execution order for operator build week

1. **P0 spike + P0.3–P0.7** (api-server model path + 3D UI provenance)
2. **H1 + H2** (Integrations page + catalog)
3. **SoftPlan sprint** (imperative distribution) — [`41h_softplan_connector_sprint.md`](41h_softplan_connector_sprint.md)
4. **SketchUp sprint** — [`41g_sketchup_connector_sprint.md`](41g_sketchup_connector_sprint.md)
5. **ArchiCAD sprint** — [`41f_archicad_connector_sprint.md`](41f_archicad_connector_sprint.md)

Revit users get hub discoverability immediately after H1–H2.

---

## Acceptance tests

1. Integrations page loads four cards; Revit download works.
2. Ping succeeds with valid secret; fails clearly with invalid.
3. POST test FBX to `/model` on dev engagement → 3D tab renders with provenance badge.
4. Match with `hostTool: "softplan"` creates distinct engagement binding vs Revit on same project name.
