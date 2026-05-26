---
id: 2026-05-26_host_connectors_program_approved_planner_digest
title: APPROVED — Host connectors program (ArchiCAD, SketchUp, SoftPlan, Hub) — planner digest
date: 2026-05-26
agent: cursor-planner (doc_repo)
repo: doc_repo
status: approved-by-operator — canonical docs written; rollup + dispatches pending planner
related:
  - 41_host_connectors_program
  - 41b_archicad_connector
  - 41c_sketchup_connector
  - 41d_softplan_connector
  - 41e_host_connectors_hub
  - 41f_archicad_connector_sprint
  - 41g_sketchup_connector_sprint
  - 41h_softplan_connector_sprint
  - 41i_host_connectors_hub_sprint
  - 41_revit_connector
  - 43_cortex_qa_backlog
  - 18_stakeholder_graph
  - _decisions/2026-05-23_partnership_first_scoping
  - QA-21
---

# APPROVED — Host connectors program — planner digest

**Operator decision (2026-05-26):** Approve the four-plan host connector program. **Full 3D from start is mandatory** on every host. No official vendor partnerships required for v1. Log to `_inbox/` for main planning agent digestion; operator will build this week after planner rollup.

**Not done in this drop:** `00_current_state.md` regeneration, git commit, dispatches, ADR-020 file, repo creation. Planner owns those on sweep.

---

## Canonical docs filed (read these first)

| Slot | Path | Role |
|------|------|------|
| Program | [`41_host_connectors_program.md`](../41_host_connectors_program.md) | Umbrella, cross-host premortem, shared spine, repo list |
| ArchiCAD | [`41b_archicad_connector.md`](../41b_archicad_connector.md) | Product home — C++ add-on, native IFC |
| SketchUp | [`41c_sketchup_connector.md`](../41c_sketchup_connector.md) | Product home — Ruby extension, IFC then mesh |
| SoftPlan | [`41d_softplan_connector.md`](../41d_softplan_connector.md) | Product home — bridge, FBX-first 3D |
| Hub | [`41e_host_connectors_hub.md`](../41e_host_connectors_hub.md) | Settings → Integrations marketplace UX |
| Sprint AC | [`41f_archicad_connector_sprint.md`](../41f_archicad_connector_sprint.md) | Phases A–E |
| Sprint SU | [`41g_sketchup_connector_sprint.md`](../41g_sketchup_connector_sprint.md) | Phases A–E |
| Sprint SP | [`41h_softplan_connector_sprint.md`](../41h_softplan_connector_sprint.md) | Phases A–G + premortem gates P1–P3 |
| Sprint Hub+P0 | [`41i_host_connectors_hub_sprint.md`](../41i_host_connectors_hub_sprint.md) | Platform P0 + Integrations UI |

---

## Operator intent (constraints)

1. **Imperative:** SoftPlan integration is not optional — distribution channel (~7k SoftPlan/ArchiCAD community per [`18_stakeholder_graph.md`](../18_stakeholder_graph.md)).
2. **Full 3D day one** on ArchiCAD, SketchUp, SoftPlan — same Cortex 3D/BIM tab goal as Revit (element count + visible geometry).
3. **UX over mechanism** — in-app add-on, extension, or bridge acceptable; no wait on SoftPlan/Graphisoft/Trimble partnerships.
4. **Connectors hub** in Cortex app — marketplace-style **Settings → Integrations** (download, install, test connection).
5. **No timelines** in sprint docs — work phases only (already honored in filed docs).

---

## Program premortem (planner rollup)

| Commitment | Program |
|------------|---------|
| Sell reasoning, not data | **Yellow** until `modelProvenance` + 3D fidelity badge ship on all non-IFC ingests |
| Partnership-first | **Green** (product connectors; scoping per 2026-05-23 decision) |
| Cost per jurisdiction | **Green** (conversion = product COGS; cap file size / worker timeout) |
| Dual interface | **Yellow** — MCP `cortex_model_ingest` + existing register tools in platform sprint |
| Hauska spine | **Green** |
| Focus queue | **Operator override** — build week approved; planner must name what yields (40h WS-I, QA-27, etc.) |
| Quality gate | **Red→Green** only with provenance on mesh paths |

**Per-host premortem verdicts:**

| Host | Verdict | 3D path |
|------|---------|---------|
| ArchiCAD | **Green** | Native IFC → existing `/api/snapshots/{id}/ifc` |
| SketchUp | **Yellow OK** | IFC if Pro; else FBX/Collada → `/model` ingest |
| SoftPlan | **Yellow OK** | FBX primary → `ingestSnapshotModel`; SKP→IFC only behind quality gate |
| Hub | **Green** | N/A (distribution) |
| Revit | Already shipped | IFC (unchanged) |

**Rejected approach:** SoftPlan SKP→IFC-only as sole path (fake IFC semantics). **Chosen:** FBX-first glTF ingest + optional IFC branch when gate passes.

**External recon:** [github.com/orgs/softplan/repositories](https://github.com/orgs/softplan/repositories) — five utility forks only; **no** product SDK. `P:\SoftPlan2026Trial` binary recon: `.spp`/`.spv`/`.spd`, `reView.dll` batch PDF, `libfbxsdk`/FBX, no IFC strings in install.

---

## Shared api-server contract (platform P0 — blocks SoftPlan + SketchUp mesh)

| Item | Detail |
|------|--------|
| Match | `hostTool`, `hostDocumentId`, `hostDocumentPath`; Revit field aliases backward compatible |
| New route | `POST /api/snapshots/{id}/model` (fbx, skp multipart, `x-snapshot-secret`) |
| Worker | `ingestSnapshotModel` — FBX→glTF, bundle row, mesh-derived `materializable_elements` |
| Provenance | `modelProvenance` on snapshot / bim-model — host, format, pipeline, `fidelityTier` |
| UI | 3D tab badge when not native IFC |
| MCP | `cortex_model_ingest`; ping + catalog |
| Hub API | `GET /api/connectors/catalog`, `POST /api/connectors/ping` |
| ADR | **ADR-020 queued** — draft at hub sprint close |

---

## Integration form + UX (best per host)

| Host | Repo (create) | In-host UX | Cortex after upload |
|------|---------------|------------|---------------------|
| Revit | `legacy-revit-sensor` (exists) | Ribbon Send Snapshot | Full (baseline) |
| ArchiCAD | `legacy-archicad-sensor` | Extensions → Send Snapshot | Full IFC parity |
| SketchUp | `legacy-sketchup-extension` | Extensions → Send Snapshot | Full IFC or mesh tier |
| SoftPlan | `legacy-softplan-bridge` | Export folder + tray watcher | Full mesh; PDF+code |

**SoftPlan v1 runbook (mandatory exports):** plan-set PDF from reView (`.spv`); **FBX** from SoftView; DWG only after save-as-drawing (`.spd`) per forum behavior.

---

## Approved build order (work sequencing — no dates)

1. **`41i` Phase P0** + **H1–H2** (`legacy-design-tools`) — model ingest, match generalization, Integrations page, catalog JSON  
2. **`41h` SoftPlan** (`legacy-softplan-bridge`) — operator priority / QA-21  
3. **`41g` SketchUp** (`legacy-sketchup-extension`)  
4. **`41f` ArchiCAD** (`legacy-archicad-sensor`) — highest engineering, best long-term BIM  
5. **Hub release alignment** — point catalog download URLs at real GitHub releases per host  

Revit: hub card + ping only until optional connector release bump.

---

## QA-21 disposition

| Before | After approval |
|--------|----------------|
| Routed to strategic session only ([`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md)) | **Unblocked for execution** via program + sprints above |

Planner: update QA-21 row to reference `41_host_connectors_program` and build order; split WS-F into track **Host-Connectors** or equivalent.

---

## Planner action checklist (rollup session)

- [ ] Regenerate or patch [`00_current_state.md`](../00_current_state.md) — Host Connectors program active; build week; P0 gate  
- [ ] Patch [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — QA-21 status + link to program  
- [ ] Patch [`11_roadmap.md`](../11_roadmap.md) or [`40_design_accelerator.md`](../40_design_accelerator.md) — cross-ref 41b–41i  
- [ ] Patch [`00_README.md`](../00_README.md) + [`21_ai_first_dev_flow.md`](../21_ai_first_dev_flow.md) — three new repo paths when created  
- [ ] Patch [`41_revit_connector.md`](../41_revit_connector.md) — related links to hub + program  
- [ ] Draft [`80_adrs/adr_020_host_connectors.md`](../80_adrs/adr_020_host_connectors.md) when P0 spec stable (can scaffold at dispatch)  
- [ ] Write dispatches (paste-ready):
  - `cc-agent-C` → `41i` P0 + hub UI (`legacy-design-tools`)
  - `cc-agent-C` or new agent → `41h` SoftPlan bridge + runbook smoke on `P:\SoftPlan2026Trial`
  - Separate agents/clones for `41g`, `41f` when P0 merged  
- [ ] **Focus queue entry:** name what slips (e.g. 40h residual, QA-27 Phase 3) if host program is primary this week  
- [ ] Commit batch when operator says go — message e.g. `docs(connectors): host program ArchiCAD SketchUp SoftPlan hub approved`

---

## Dispatches not written (planner or operator)

No `_dispatches/2026-05-26_cc-agent-*_host_connectors*.md` files yet. Planner should generate from sprint phase tables using [`_dispatches/_template.md`](../_dispatches/_template.md) + Atoms block per HR-12.

**P0 spike first assignee:** cc-agent-C on `legacy-design-tools` — FBX converter proof using operator SoftPlan trial export before merging `ingestSnapshotModel`.

---

## Research context (this conversation)

- Revit pattern: [`41_revit_connector.md`](../41_revit_connector.md) — four endpoints, `x-snapshot-secret`, A→B→C→D  
- MCP: `cortex_snapshot_register`, `cortex_ifc_ingest` exist; model ingest new  
- Partnership scoping: [`_decisions/2026-05-23_partnership_first_scoping.md`](../_decisions/2026-05-23_partnership_first_scoping.md) — national baseline OK for connector ICP  

---

## Files on disk (uncommitted until planner commit)

All under `p:\doc_repo\`:

```
41_host_connectors_program.md
41b_archicad_connector.md
41c_sketchup_connector.md
41d_softplan_connector.md
41e_host_connectors_hub.md
41f_archicad_connector_sprint.md
41g_sketchup_connector_sprint.md
41h_softplan_connector_sprint.md
41i_host_connectors_hub_sprint.md
_inbox/2026-05-26_host_connectors_program_approved_planner_digest.md  (this file)
```

---

## One-paragraph summary for 00_current_state

Operator approved a four-host Cortex connector program: **ArchiCAD** (C++ add-on, native IFC), **SketchUp** (Ruby extension, IFC or mesh ingest), **SoftPlan** (Windows bridge, FBX-first mandatory 3D), plus **Settings → Integrations** hub for downloads and connection test. Shared **platform P0** in `legacy-design-tools` generalizes engagement match, adds `POST /api/snapshots/{id}/model` and `modelProvenance`. Build order: P0+hub → SoftPlan → SketchUp → ArchiCAD. QA-21 unblocked. ADR-020 queued. Canonical docs at `41_host_connectors_program` + `41b`–`41i`.
