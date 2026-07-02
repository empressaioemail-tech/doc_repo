---
id: sessions/2026-07-02_shared_surface_sprint_execution
title: Session — Shared Surface Sprint executed end to end (autonomous multi-agent)
status: complete
date: 2026-07-02
agent: claude_code (doc_repo planner, master orchestrator)
related: [_architecture_homes/shared_surface_principle, 80_adrs/adr_024_shared_surface_package_architecture, _dispatches/2026-07-01_shared-surface-sprint-handoff-guide, _inbox/2026-07-01_shared-surface-sprint_STATUS]
---

# Shared Surface Sprint executed end to end

The seven-track Shared Surface Sprint was run to completion autonomously. The operator authorized full autonomy (build, adversarial review, merge to main, deploy to production) and walked away. The planner acted as the master orchestrator, collapsing the courier model (hand-carry prompts into separate Cursor windows, coordinate through _inbox/) into direct execution: it spawned one lead agent per track, each of which spawned its own build and adversarial-review sub-agents per phase, merged its own PR on a green adversarial verdict plus green CI, and deployed. The planner owned wave sequencing, cross-repo coordination, every doc_repo commit, and the final verification pass.

## What shipped

All seven tracks plus one bridge track closed and are live in production.

Track A (hauska-map, PR #2): @hauska/map-renderer@0.1.0, a React+TS package extracted from the vanilla E6 map. Render proven in headless Chrome (live WebGL2, all fixture layers, no CSP or worker exceptions).

Track B (legacy-design-tools, PR #210): pnpm workspace plus five @hauska packages (design-tokens, tile-shell, cortex-client, cortex-tiles, document-viewer), no dependency cycles.

Track C (legacy-design-tools, PR #211 and #213): tile and shell migration into the packages. All 46 TileDef entries carry the four capability fields; every tile is error-boundary-wrapped.

Track D (legacy-design-tools, PR #212): @hauska/document-viewer plus DocumentViewerTile (PDF, DWG, annotation). Migration 0048_engagement_annotations applied to the live production database.

C-bridge (legacy-design-tools, PR #214 and #216): new HTTP route GET /api/plan-review/admin/tile-registry serving all 46 capability-bearing entries, plus a React-free TILE_CAPABILITIES source of truth in @hauska/cortex-client with a drift test. Added mid-sprint to resolve a blocker (see below).

Track E (hauska-mcp-server, PR #34): the compose_workspace MCP tool under the cortex product gate, reading the live capability registry at invocation time and returning a WorkspaceComposition.

Track F (legacy-design-tools, PR #217): the AI vision-to-coordinate annotation pipeline (claude-haiku-4-5-20251001), idempotent generation and confidence kind:'asserted', both confirmed by database-backed tests.

Track G (legacy-design-tools, PR #218): the full assembleDeliverable export (pdf-lib): title page, annotated plan pages with numbered callouts, findings summary, letter page, uploaded to GCS with a 24h presigned URL.

Serving in production: cortex-api-00275-hij at 100% (legacy-design-tools, cumulative of B, C, D, C-bridge, F, G), hauska-mcp-server-00008-mcr at 100% (E). ADR-024 (Shared Surface Package Architecture) filed to formalize the architecture and record the map-model decision.

## Decisions and course corrections made during the run

Map model. The sprint docs contradicted each other: shared_surface_principle specified the map as an importable package while the cortex tile build dispatch had the MapTile render hauska-map as an iframe and said "do not create a custom map component," and the hauska-map repo as built is vanilla JavaScript with no React component to extract. The operator chose the full React package model. The DNS action (map.hauska.io CNAME) is therefore retired: a package needs no running map server.

OffscreenCanvas worker. The Track A dispatch proposed running MapLibre headless in a Web Worker via OffscreenCanvas. The agent spiked it first and found MapLibre v5 has no OffscreenCanvas option, so it fell back to a main-thread canvas rather than shipping non-functional worker code.

Capability registry exposure (C-bridge). Track C left the 46-entry TILE_REGISTRY app-side by design, but Track E needs those capability fields and the endpoint the dispatch named (/admin/functions) is a status-only route. Rather than have Track E read a stale snapshot, a bridge track added an HTTP route serving the live registry, keeping compose_workspace reading the contract at invocation time.

MCP product gate. The Track E dispatch said the tool should be under a "reporting" gate, but the live product enum is public/codex/cortex and cortex-api is the reporting function package (ADR-008), so a "reporting" enum value would be unreachable. The tool is gated under cortex.

## Adversarial review caught real defects before merge

The adversarial gate was not ceremonial. It caught and forced fixes for: a dangling import that broke the map package's consumer build (Track A); a pg-to-ESM boot crash from over-broad esbuild conditions that failed the canary startup probe at 0% traffic and never reached production (C-bridge PR #215, reverted by #216); an SVG pointer-events:none that made the headline callout-to-highlight interaction dead (Track F); and a relevance-scorer bug where stop-word noise buried the hazard tile below the tile cutoff (Track E). Every production deploy used the canary sequence with a smoke check before traffic shift.

## Residual follow-up (non-blocking)

@hauska/map-renderer is not published to npm (no npm credential exists in this environment or in CI). The workspace map tile therefore runs on the existing Mapbox/iframe fallback behind a single swap seam in MapTile.tsx. Publishing the package (operator provides an npm credential, or sets an NPM_TOKEN Actions secret) plus a one-line import swap completes the map integration. This replaces the retired DNS action and does not block anything: the map works either way.

Minor: an unauthenticated POST to /export returns HTTP 500 rather than 401/404 for a bogus engagement id, matching pre-existing behavior on the /annotations and /documents routes. Not a sprint regression; a small robustness cleanup for the plan-review BFF anonymous path.

## Addendum (same day) — map-renderer residual closed

The publish + swap + deploy residual above is CLOSED. Close report: [`_inbox/2026-07-02_legacy-design-tools_map-renderer-publish-swap-deploy_close.md`](../_inbox/2026-07-02_legacy-design-tools_map-renderer-publish-swap-deploy_close.md).

- **npm:** `@hauska/map-renderer@0.1.0` published (hauska-sdk account).
- **Consumer:** legacy-design-tools PR #219 merged (`f69f8c4`); `MapTile` renders `FloatingMap` from the package.
- **Prod:** `cortex-api-00277-gun` at 100% (canary sequence on merge SHA; healthz smoke passed).

Investigation during swap prep found the iframe path was inert: `map.hauska.io` never read engagement query params and had no `message` listener, so overlay postMessages were no-ops. The package swap is a net improvement (parcel `flyTo` works for the first time). **Remaining open:** wire `overlays` prop in map-renderer 0.1.1 (`setOverlays` on `createMapRenderer`); set `NPM_TOKEN` on hauska-map for CI publish.

## Verification

All three repo main tips are at the correct merge commits; all ten sprint PRs are MERGED; cortex-api serves 00275-hij at 100% (Ready) and hauska-mcp-server serves 00008-mcr at 100% (Ready), confirmed via gcloud; all eight close reports are filed in _inbox/. Live endpoint curls were not runnable from the planner shell (no HTTPS egress), so endpoint health rests on each deploy workflow's own prod smoke check plus the C-bridge agent's independent registry curl.
