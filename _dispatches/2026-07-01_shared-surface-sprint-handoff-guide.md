---
id: dispatches/2026-07-01_shared-surface-sprint-handoff-guide
title: Shared Surface Sprint — handoff guide (all copy-paste prompts)
status: active
dispatched: 2026-07-01
---

# Shared Surface Sprint — handoff guide

Seven tracks. Five agents. This guide has every copy-paste prompt in execution order.

Read the architecture doc first — it is the single authoritative reference all agents will cite:
`P:\doc_repo\_architecture_homes\shared_surface_principle.md`

---

## Execution sequence

```
Wave 1 (parallel):
  Track A — map-agent         → hauska-map repo
  Track B — cc-agent-C        → legacy-design-tools repo

Wave 2 (parallel, both wait for Track B close):
  Track C — cc-agent-C        → legacy-design-tools repo
  Track D — cc-agent-C        → legacy-design-tools repo

Wave 3 (sequential):
  Track E — cc-agent-M        → hauska-mcp-server repo  (waits for Track C close)
  Track F — cc-agent-C        → legacy-design-tools repo (waits for Track D close)

Wave 4:
  Track G — cc-agent-C        → legacy-design-tools repo (waits for Track F close)
```

Tracks C and D both go to cc-agent-C but do not conflict (C touches tile-shell and tile components; D touches document-viewer). They can run in two separate cc-agent-C windows simultaneously, or sequentially in one — your call.

When each track closes, the agent files a close report to `P:\doc_repo\_inbox\`. Check there before starting the next dependent track.

---

## Wave 1A — map-agent (hauska-map repo)

Send to the agent working in `empressaioemail-tech/hauska-map`:

---

```
Read this dispatch in full before starting anything:
P:\doc_repo\_dispatches\2026-07-01_hauska-map_map-agent_track-A-map-renderer.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track A of the Shared Surface Sprint. Your job is to extract the @hauska/map-renderer package from the hauska-map Vite app. The goal: any React app can `import { FloatingMap } from '@hauska/map-renderer'` without running a separate map server or using an iframe.

Three phases:
1. Scaffold pnpm workspace + package structure, push the pending commit first
2. Implement OffscreenCanvas + Web Worker for CSP-safe MapLibre (this is the real fix, not a workaround)
3. Build and verify the package, convert command-center to import from the package

Spawn sub-agents per phase. One build sub-agent, one adversarial review sub-agent each phase. Merge on green after each phase.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_hauska-map_map-agent_track-A-close.md

Do not proceed to any other work after this. This track is self-contained.
```

---

## Wave 1B — cc-agent-C (legacy-design-tools repo, Track B)

Send to cc-agent-C working in `empressaioemail-tech/legacy-design-tools`:

---

```
Read this dispatch in full before starting anything:
P:\doc_repo\_dispatches\2026-07-01_legacy-design-tools_cc-agent-C_track-B-package-scaffold.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track B of the Shared Surface Sprint. Your job is infrastructure only — no tile code moves yet. Set up the pnpm workspace and scaffold five packages in legacy-design-tools:

@hauska/design-tokens — CSS custom properties tokens.css
@hauska/tile-shell    — TileDef types, CortexShell, providers (scaffold only)
@hauska/cortex-client — createCortexClient factory, CortexApiError (implement now)
@hauska/cortex-tiles  — CortexProvider, useCortexClient (implement now), tile components (scaffold only)
@hauska/document-viewer — Annotation types (scaffold only)

The dispatch has exact package.json, tsconfig, tsup.config.ts, and source file content for every file. Use it verbatim.

Spawn one build sub-agent and one adversarial review sub-agent. The adversarial reviewer must confirm: pnpm install resolves, pnpm -r build passes, no circular deps, codex-reviewer-qa still starts.

PR, merge, verify CI green.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-B-close.md

Do not start Track C or D until you have filed the close report and this Track B PR is merged.
```

---

## Wave 2A — cc-agent-C (Track C, waits for Track B)

Do not send this until the Track B close report is in `_inbox/` and confirmed merged.

---

```
Track B is done. Read the Track B close report at:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-B-close.md

Now read the Track C dispatch in full:
P:\doc_repo\_dispatches\2026-07-01_legacy-design-tools_cc-agent-C_track-C-tile-migration.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track C of the Shared Surface Sprint. Three phases:

Phase 1: Move CortexShell, GridCanvas, SpaceBar, TileWrapper, providers from codex-reviewer-qa/src/tile-shell/ into packages/tile-shell/src/. Replace hardcoded colors with --h-* CSS tokens.

Phase 2: Extract BFF response types into @hauska/cortex-client/src/types.ts. Add typed methods to CortexClient. Update api-server to import response types from the package.

Phase 3: Move all tile components from codex-reviewer-qa/src/tiles/ into packages/cortex-tiles/src/. Add TileErrorBoundary to every tile. Convert tiles from raw fetch to useCortexClient(). Update TILE_REGISTRY with full capability fields (requires, produces, modes, mcpTools). Update codex-reviewer-qa to be a thin consumer app importing from packages.

Spawn one build sub-agent and one adversarial review sub-agent per phase. Deploy after Phase 3 using the canary sequence in the dispatch.

The adversarial reviewer must confirm after Phase 3: codex-reviewer-qa/src/tiles/ is empty, all tiles have error boundaries, all TileDef have capability fields populated.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-C-close.md
```

---

## Wave 2B — cc-agent-C (Track D, waits for Track B)

Can run in parallel with Track C in a second agent window, or sequentially after C — your call. Both depend only on Track B.

---

```
Track B is done. Read the Track B close report at:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-B-close.md

Now read the Track D dispatch in full:
P:\doc_repo\_dispatches\2026-07-01_legacy-design-tools_cc-agent-C_track-D-document-viewer.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track D of the Shared Surface Sprint. Four phases:

Phase 1: PDFViewer component using pdfjs-dist + OffscreenCanvas worker config, PageControls, VersionPicker.

Phase 2: AnnotationLayer (SVG overlay on PDF canvas), MarkupToolbar (pen/shape/text/stamp), BFF annotation routes (GET/POST/DELETE), DB migration for engagement_annotations table.

Phase 3: DWGViewer using Autodesk APS Viewer SDK. Read the AUTH-001 caveat in the dispatch carefully — if APS credentials return 403, fall back to server-side LibreOffice DWG→PDF conversion.

Phase 4: DocumentViewerTile that wraps PDFViewer + DWGViewer + MarkupToolbar + VersionPicker + ExportButton. Register in TILE_REGISTRY. Add to Plan Review and Design Accelerator presets.

Deploy after Phase 4 — include the annotations DB migration in the deployment sequence (run-migrations step).

Spawn one build sub-agent and one adversarial review sub-agent per phase.

The adversarial reviewer must confirm: PDF renders page 1 on engagement with uploaded docs, user markup saves to DB, export route returns a downloadable URL.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-D-close.md
```

---

## Wave 3A — cc-agent-M (Track E, waits for Track C)

cc-agent-M has no access to P:\doc_repo. Paste the full dispatch content below directly into the M window.

Do not send until the Track C close report is in `_inbox/` confirming capability fields are on TileDef.

---

```
You are executing Track E of the Shared Surface Sprint for the empressaioemail-tech/hauska-mcp-server repo.

CONTEXT: We are building a shared component architecture across the Hauska product surface. The cortex workspace uses a tile shell with typed TileDef objects. Each TileDef now has capability advertisement fields: requires, produces, modes, mcpTools. The compose_workspace MCP tool uses these to select and arrange tiles in response to natural language intent.

YOUR TASK: Add the compose_workspace tool to the Hauska MCP server, under the 'reporting' product gate.

---

TOOL SPECIFICATION:

Name: compose_workspace
Gate: reporting (requires X-Hauska-Key with reporting product)

Input schema:
{
  intent: string,             // natural language — what the user wants to see
  engagementId?: string,      // optional — scopes tile selection
  availableTileIds?: string[], // optional override subset
  maxTiles?: number,           // default 4
}

Output schema (WorkspaceComposition):
{
  tiles: string[],     // ordered tile IDs
  layoutId: string,    // "1"|"2h"|"2v"|"3l"|"3r"|"4"|"6"
  engagementId?: string,
  why: string,
}

---

IMPLEMENTATION:

The tool fetches the tile registry from cortex-api at:
GET https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/admin/functions

This returns an array of TileDef objects with id, label, category, status, requires, produces, modes, mcpTools fields.

Filter to live/partial tiles only.
If engagementId provided, fetch engagement context and filter tiles whose requires are satisfied.
Select tiles by keyword matching intent against label, category, and mcpTools.
Always include the 'map' tile if spatial keywords present (map, location, parcel, zone, flood, site).
Pick layoutId from: count 1→"1", 2→"2h", 3→"3l", 4→"4", 5+→"6".
Return WorkspaceComposition.

Add env vars CORTEX_API_URL and CORTEX_INTERNAL_KEY to the deployment config.

---

IMPLEMENTATION FILE:

Create src/tools/compose_workspace.ts with the full implementation. Register it in the tool registry under the reporting product gate, following the existing pattern for how other reporting-gated tools are registered.

---

PHASES:

Phase 1: Implement the tool + register it. One build sub-agent, one adversarial review sub-agent.

Adversarial review confirms:
- Tool is under the reporting gate (not public)
- Input schema is valid MCP tool schema
- Output is WorkspaceComposition shape
- Tile registry fetch is at invocation time, not startup
- Tool degrades gracefully if cortex-api is unreachable (named error, not crash)
- pickLayout returns a valid key for counts 1-6

Phase 2: Verify end to end via MCP inspector. Test input:
{ "intent": "show me compliance and hazard for a plan review", "engagementId": "cc2e0a30-412a-46b8-b680-38ebfbed5d4a" }
Expected: tiles includes compliance-run and hazard-profile, layoutId is a valid string, why is non-empty.

Also test without engagementId.

PR, merge, deploy.

---

CLOSE REPORT:

File your close report to:
P:\doc_repo\_inbox\2026-07-01_hauska-mcp-server_cc-agent-M_track-E-close.md

(Note: you do not have direct write access to P:\doc_repo. Mirror this to the doc_repo inbox by pasting the content to the operator who will file it, OR if you can reach the path, write it directly. If neither, paste the close report content in your final message.)

Close report format:
---
title: Track E close — compose_workspace MCP tool
date: 2026-07-01
agent: cc-agent-M
track: E
---
Tool registered under gate: <reporting>
End-to-end test result: <paste MCP inspector output>
Tile registry fetch working?: <yes/no — cortex-api /admin/functions reachable>
Env vars needed: CORTEX_API_URL: <value> / CORTEX_INTERNAL_KEY: <needed yes/no>
Known limitations: <e.g. keyword scoring is a fast path>
Rollback: <prior MCP server commit>
```

---

## Wave 3B — cc-agent-C (Track F, waits for Track D)

Do not send until the Track D close report is in `_inbox/` confirming the engagement_annotations table is live and the PDFViewer is deployed.

---

```
Track D is done. Read the Track D close report at:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-D-close.md

Now read the Track F dispatch in full:
P:\doc_repo\_dispatches\2026-07-01_legacy-design-tools_cc-agent-C_track-F-ai-annotation.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track F of the Shared Surface Sprint. Three phases:

Phase 1: Vision-to-coordinate pipeline. Add pdftoppm to the Cloud Run Dockerfile. Implement rasterizePdfPage, extractAnnotationCoordinates (uses claude-haiku-4-5-20251001 via Anthropic SDK), and the async annotation generation job route (POST /annotations/generate + GET /annotations/generate/:jobId). Critical: annotations must be idempotent (don't duplicate if job runs twice). Confidence must be kind:'asserted' (not 'calibrated').

Phase 2: Bidirectional navigation. Add AnnotationSelectionProvider and DocumentViewerNavigationProvider to @hauska/tile-shell. Wire: callout click → finding highlight in ComplianceRunTile; finding card click → page jump in DocumentViewerTile. Add "Generate AI Annotations" button with progress polling.

Phase 3: Display location3d annotations in the DWGViewer using APS viewer selectivelyShowNodes. This is display only — no AI coordinate generation for 3D in this track.

Spawn one build sub-agent and one adversarial review sub-agent per phase. Deploy after Phase 2 (Phase 3 can be bundled with Phase 2 deploy or deferred).

The adversarial reviewer must confirm: clicking a callout highlights the finding card; clicking a finding card with an annotation jumps to the page; the Generate button only shows when no AI annotations exist yet; no infinite loop on annotation refetch.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-F-close.md
```

---

## Wave 4 — cc-agent-C (Track G, waits for Track F)

Do not send until the Track F close report is in `_inbox/` confirming AI annotations are in the DB.

---

```
Track F is done. Read the Track F close report at:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-F-close.md

Now read the Track G dispatch in full:
P:\doc_repo\_dispatches\2026-07-01_legacy-design-tools_cc-agent-C_track-G-print-export.md

Also read: P:\doc_repo\_architecture_homes\shared_surface_principle.md

You are executing Track G of the Shared Surface Sprint — the final track. This is the deliverable export: assemble a complete annotated PDF ready to hand to an applicant.

Phase 1: Implement the full assembleDeliverable function using pdf-lib. Four sections in the output PDF: title page (with "Powered by Hauska Engine — hauska.dev" footer), annotated plan pages (annotation callouts as numbered red circles on correct pages), findings summary page, letter page. Upload to GCS, return presigned 24h URL from the export route. Replace the Track D stub with this full implementation.

Phase 2: UX polish — trigger a browser download (not new tab), add export shortcut to SpaceBar, add print preset to workspace.

Spawn one build sub-agent and one adversarial review sub-agent for Phase 1.

The adversarial reviewer must confirm: export completes within 15s for a 10-page plan; annotation callouts appear on the correct pages; GCS URL is valid and downloadable; letter renders if present.

PR, merge, deploy.

When done, file your close report to:
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-G-close.md

This is the last track. Note in your close report: "All seven tracks (A-G) closed. Shared Surface sprint is done."
```

---

## What to do with Track E close report if cc-agent-M can't write to _inbox/

Have cc-agent-M paste the close report content in its final reply. Then paste that content into a new file at:
`P:\doc_repo\_inbox\2026-07-01_hauska-mcp-server_cc-agent-M_track-E-close.md`

cc-agent-M cannot read `_dispatches/` either — the Wave 3A prompt above is self-contained for exactly that reason.

---

## DNS action (operator — not agent)

After Track A closes, set up `map.hauska.io` as a DNS CNAME pointing to the hauska-map Cloud Run service URL. This unblocks the cortex workspace map tile in production without any env var override.

Check the current Cloud Run URL:
```bash
gcloud run services describe hauska-map --project hauska-prod-497015 --region us-central1 --format 'value(status.url)'
```

Create the CNAME in your DNS provider:
```
map.hauska.io → <Cloud Run URL without https://>
```
