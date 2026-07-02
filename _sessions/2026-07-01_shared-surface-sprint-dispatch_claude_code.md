---
id: sessions/2026-07-01_shared-surface-sprint-dispatch
title: Shared Surface Sprint dispatch — 2026-07-01
date: 2026-07-01
status: closed
participants: [nick, claude-code-planner]
related: [_architecture_homes/shared_surface_principle, _dispatches/2026-07-01_shared-surface-sprint-handoff-guide]
---

# Session summary — 2026-07-01

## What happened

Nick opened a QA session on the cortex tile workspace at `localhost:19592/codex-reviewer-qa/`. Two cc-agent-C sprint rounds ran earlier in the day, landing: tile drag/layout fixes, L3 route scoping, BFF reviewer bypass, letter tile, property intel tiles (brief/hazard/encumbrances), sheet extraction, response tasks. Close reports in `_inbox/`.

Mid-session, observing that the map tile was broken because a prior agent had replaced the hauska-map iframe with an OpenStreetMap embed, and that the floating map component is supposed to be portable across surfaces, Nick made an architectural pivot: stop band-aid fixes, extract everything reusable as npm packages so fixes propagate everywhere. Decision: no more iframes, no more DNS fallbacks, no more surface-specific reimplementations.

## Decisions made

All settled this session, no rework:

1. **Shared Surface Principle ratified.** Any UI component appearing in more than one product surface ships as a versioned npm package. Auth is injected, never assumed. Consumers own bundling. Canonical doc: `_architecture_homes/shared_surface_principle.md`.

2. **Six-package architecture.** `@hauska/design-tokens`, `@hauska/tile-shell`, `@hauska/map-renderer`, `@hauska/document-viewer`, `@hauska/cortex-client`, `@hauska/cortex-tiles`. One-master-MCP confirmed (`mcp.hauska.dev`, `51_substrate_v1_sprint.md`).

3. **OffscreenCanvas + Web Worker for MapLibre.** Not a workaround — this is the correct CSP-safe MapLibre integration for extension and iframe contexts. Track A implements it.

4. **Auth injection pattern: Option A.** `createCortexClient({ baseUrl, getToken })` factory. `CortexProvider` context wraps all tiles. No assumed auth.

5. **Design tokens: full system now.** `--h-*` CSS custom properties prefixed, built in Track B.

6. **`@hauska/cortex-client` is a separate no-React package.** Can be consumed by server-side code and non-React clients.

7. **`compose_workspace` MCP tool.** Reads tile registry from cortex-api, selects tiles by intent + capability advertisement, returns `WorkspaceComposition`. Track E.

8. **Capability advertisement on TileDef.** `requires`, `produces`, `modes`, `mcpTools` fields make the tile registry machine-readable.

9. **Render modes: `full | card | inline | raw`.** Raw is headless escape hatch for non-standard layouts.

10. **`@hauska/document-viewer` package.** PDF viewer (pdfjs-dist), DWG viewer (APS), annotation layer, markup tools. Track D.

11. **Annotation data model: unified 2D and 3D.** Single `engagement_annotations` table with `location2d` and `location3d` JSONB columns. 2D: `submissionId`, `page`, `bbox`. 3D: `globalId`, `elementId`, `face`.

12. **AI annotation pipeline: vision-to-coordinate.** `pdftoppm` rasterizes PDF pages; claude-haiku-4-5 locates code section elements; annotations stored as `kind:'asserted'` confidence. Track F.

13. **Version history fits atom/node/edge model.** Submissions as procedure-execution atoms (ADR-013) linked by "superseded-by" edges. No separate version table needed.

14. **Print/export deliverable PDF.** `pdf-lib` server-side assembly: title page, annotated plan pages with numbered red callouts, findings summary, letter. Track G.

15. **Collaborative annotation deferred.** One annotation flow tight first.

16. **SmartCity redesign deferred.** Separate sprint; do not bundle here.

17. **IFC/BIM 3D annotation display: yes now, 3D rendering later.** Display `location3d` in DWG viewer; AI 3D coordinate generation is a separate workstream.

18. **Hauska name swap is deferred but designed for.** Package names and imports are the only coupling; a global find-and-replace handles it when the name decision lands.

19. **QA paused.** No more QA until all seven tracks close.

## Artifacts produced

- `_architecture_homes/shared_surface_principle.md` — authoritative architecture doc
- `_dispatches/2026-07-01_hauska-map_map-agent_track-A-map-renderer.md`
- `_dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-B-package-scaffold.md`
- `_dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-C-tile-migration.md`
- `_dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-D-document-viewer.md`
- `_dispatches/2026-07-01_hauska-mcp-server_cc-agent-M_track-E-compose-workspace.md`
- `_dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-F-ai-annotation.md`
- `_dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-G-print-export.md`
- `_dispatches/2026-07-01_shared-surface-sprint-handoff-guide.md`
- `_projects/cortex_workspace_qa/04_next_waves.md` — updated (QA paused note added)
- `00_current_state.md` — updated (Shared Surface Sprint entry added)

## What is not done

- ADR for shared surface package architecture (should be ADR-023; scaffold owed)
- Decision records for each of the 19 decisions above (deferred to next session; all are captured in `shared_surface_principle.md` as the authoritative doc)
- `map.hauska.io` DNS CNAME (operator action, after Track A closes)
- Track A-G execution (agents, not this session)

## Watch list items

- **Cotality demo quota expires ~2026-07-06.** Still the #1 Radar launch blocker. Not touched this session.
- **M1 calibration gate.** Two cc-agent dispatches (E then C) were owed from the prior session to ingest edition bundles and re-run M1. Not touched this session.
- **architecture-homes/05_scrub_tracker.md doc-cleanup.** Still owed.

## Open ADR

ADR-023: Shared Surface Package Architecture. Scope: the six-package families, naming convention (`@hauska/*`), auth injection pattern, render modes, capability advertisement schema, OffscreenCanvas worker as the CSP solution. File after track B is complete and the scaffold is verified. Can reuse `shared_surface_principle.md` as the ADR body.
