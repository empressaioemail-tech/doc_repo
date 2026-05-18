---
id: 2026-05-18_cortex_ui_inventory_cc-agent-UI
title: Cortex UI inventory — read-only recon (cc-agent-UI 2026-05-18)
status: complete
last_updated: 2026-05-18
applies_to: cortex
related: [40_design_accelerator, 42_design_accelerator_program_plan, 10_ground_truth, 40a_customer_zero_observations_arena_roja_2026_05_06, 47_codex_plan_review, 27_engine_evolution_plan]
agent: cc-agent-UI
kind: session
---

# Cortex UI inventory — read-only recon

Read-only recon of every UI-bearing surface in `legacy-design-tools` (all four artifacts: `design-tools`, `plan-review`, `qa`, `mockup-sandbox`). Pinned to local HEAD `3c9097f` (branch `docs/empressa-atom-rename-hauska-atom-contract`). No code changed. No commits in `legacy-design-tools`.

## Executive summary

Inventoried **50+ surfaces** across four UI artifacts plus the api-server route surface they consume. Counts by classification:

- **works:** ~33 surfaces — Engagement list/detail, Site/Site-Context tabs, Findings UI, Reviewer Inbox, Compliance Engine console, mnml.ai render gallery, Three.js BIM viewport, Communicate composer, Decide modal, every QA dashboard screen.
- **partial:** ~10 surfaces — Findings list/mutations (still mock-backed despite real server routes), Communicate composer (no email dispatch), 3DEP display (text-only, no contour viz), file-attach in chat (sheet-only, no screenshot paste), feature flags (server-side only, no client scaffold), auth (gateway-assumed, no SPA affordance).
- **stub:** ~5 surfaces — Saved Findings page, five "Coming Soon" admin routes in plan-review (`/firms`, `/projects`, `/integrations`, `/reviewers`, `/settings`), Style Probe (intentional), settings.ts + reviewers.ts server routes (Task #121).
- **dead-code:** 1 — `design-tools/src/pages/not-found.tsx` defined but never imported; unmatched routes silently redirect to `/`.
- **missing:** ~12 surfaces — Cesium scene (no package), client-side web-ifc viewer (no package; server-only parse), architect IFC/sheet upload UI, comment intake/parsing on architect side (retired in Task #479), L1 response-task / persistent checklist, L2 sheet-content-compare workflow, L3 DOCX export, L4 APS Design Automation, L5 live ICC-ES verification, mockup-sandbox spikes (empty `src/components/mockups/`), reclassify endpoint UI consumer, atom-browser in QA.

**Top 5 biggest gaps:**
1. **Cesium / client-side web-ifc are nowhere in the repo.** Docs (40/40a) imply both; design-tools ships Leaflet 2D + Three.js GLB viewer instead. If the "3D stack is broken" framing assumed Cesium, the reality is that Cesium has never been wired.
2. **L1 retired, not just unimplemented.** Architect-side `/response` was actively removed (Task #479 stamped in `EngagementDetail.tsx:3809-3812`). No persistable task/checklist surface for comment-→ response conversion exists or is in progress.
3. **L2 / L3 / L4 / L5 all unimplemented.** Sheet-content compare, DOCX export, APS Revit content push, live ICC-ES verification — none of these have any UI anchor in any artifact.
4. **Plan-review's findings list/mutations bridge through `lib/findingsMock.ts`** despite a full server route surface in `routes/findings.ts` (8 endpoints). Largest UI/engine integration debt in the repo.
5. **Reclassify endpoint shipped server-side** (`routes/submissions.ts:421-632`) but **has zero frontend callers**. Triage strip displays project-type and disciplines but isn't editable.

**Top 5 quickest wins:**
1. Wire `not-found.tsx` into the wouter `<Switch>` (5 minutes).
2. Add a top-level React `ErrorBoundary` around `<App />` in design-tools (~30 min).
3. Update doc 40 to reflect "Leaflet + Three.js + GLB" rather than implied Cesium + web-ifc (doc-only change).
4. Swap `useListSubmissionFindings` etc. in `plan-review/src/lib/findingsApi.ts` from mock-bridge to generated Orval client (single-file change; behavior already validated by API tests).
5. Add a "Reclassify" affordance on the triage strip — server-side endpoint is ready, classification chips already render in `ReviewerQueueTriageStrip.tsx:80-106`.

## Repo state recon

- **HEAD.** `3c9097f` ("docs(empressa-atom): rename M2-C extraction target to @hauska/atom-contract per doc_repo ADR-018"), branch `docs/empressa-atom-rename-hauska-atom-contract`. Main HEAD is `99a6a02` per `10_ground_truth.md`; the rename branch is one commit ahead and contains the registry pointer update only.
- **Working tree (per `git status`).** 12 modified tracked files (test fixtures + `routes/findings.ts`), three untracked: `.claude/` (5 worktrees + docker-build.log), `.cursor/` (74-byte settings), `RECON_2026-05-18_codex.md` (1090-line untracked sister recon by Codex on the same branch).
- **`routes/findings.ts` diff is line-endings-only (LF→CRLF), no semantic change** (confirmed by api-server route survey agent).
- **Workspace shape.** pnpm monorepo. 5 artifacts (`api-server`, `design-tools`, `plan-review`, `qa`, `mockup-sandbox`) + 23 `lib/*` packages. TypeScript-only. typecheck baseline: 0 errors.
- **WIP branches relevant to UI / 3D.** `track-c-viewer-ifc` (worktree at `.claude/worktrees/track-c-viewer-ifc/`, HEAD `be70319` "feat(track-c): IFC viewer + PL-01 layout/copy fix" — but extends Three.js GLB viewer, not web-ifc); `track-b-ifc-ingest` (server-side IFC parse); `sprint/V1-4-renders` (render output storage); `sprint/V1-3-glb-auth` (GLB serving auth). All four look in-flight.
- **Issue/state files discovered.** `TESTING.md` (307 lines — test strategy + per-instance DI guidance), `TESTS_DEFERRED.md` (~80 lines — known deferred coverage), `DESIGN.md` (long-form Track B server-IFC spec), `AGENTS.md` (11.6 KB). No `BUGS.md`, `KNOWN_ISSUES.md`, `STATE.md`, or `QA_NOTES.md` anywhere. **The `RECON_2026-05-18_codex.md` untracked file is a sister read-only repo recon from the Codex agent — content overlaps this recon on repo shape but does not duplicate UI inventory.**
- **In-code TODO/FIXME/HACK count in UI paths.** Zero in `artifacts/{design-tools,plan-review,qa,mockup-sandbox}/src/`. Five exist in `lib/empressa-atom/` and `lib/adapters/src/registry.ts` (all M2-C extraction markers or PL-04 adapter gating). Code hygiene is clean on this metric.
- **External deps grep across UI artifacts.** No `cesium`, `@cesium/engine`, `web-ifc`, `web-ifc-three`, `forge-apis`, `@anthropic-ai/sdk` packages in any of the four UI artifact `package.json` files. UI artifacts talk only to api-server; Anthropic/mnml.ai/Nominatim/web-ifc all live server-side.
- **Atom registry.** 19 atoms registered at `artifacts/api-server/src/atoms/registry.ts:162-230` matching the canonical list in `27_engine_evolution_plan.md`. **No divergence from docs.**

## Surface-by-surface inventory

### 1. App shell, routing, navigation between artifacts

**Intended.** Sidebar nav (Projects/Inbox/Code Library/Style Probe/Settings/Dev); cross-artifact navigation between `/`, `/plan-review/`, `/qa/`, `/mockup/`.
**Current state.** partial
**Evidence.** `artifacts/design-tools/src/App.tsx:17-69` (wouter `<Switch>` with 9 routes + redirect), `artifacts/design-tools/src/components/AppShell.tsx:27-161`, `artifacts/plan-review/src/App.tsx:36-103` (independent wouter app, base-aware via `BASE_URL`), `artifacts/qa/src/App.tsx:114`, `artifacts/mockup-sandbox/src/App.tsx:131-144` (no router, single-page renderer).
**External deps.** none
**Atoms consumed.** engagement (in design-tools list)
**Gap.** Each artifact is an independent SPA on its own base path; cross-artifact links go through full-page navigation. No "switch to architect view" or "switch to reviewer view" affordance in either header. Mount path discrepancy on mockup-sandbox: vite config says `/__mockup`, dispatch + docs say `/mockup/`.

### 2. Authentication / session handling

**Intended.** Identify user for per-user features (architect PDF header, profile edit); audience gating for reviewer-only routes; permission claims (`users:manage`, `reviewers:manage`, `settings:manage`).
**Current state.** partial
**Evidence.** Design-tools: `pages/Settings.tsx:67-99` (`useGetSession`/`useGetUser` is the only consumer of session state in the SPA shell); `DevAtomsProbe.tsx:18-21` stashes a plaintext `devSnapshotSecret` in localStorage. Plan-review: `App.tsx:57-89` wraps reviewer routes in `RequireAudience`/`RequirePermission`. Server: `routes/session.ts` returns `{audience, requestor, permissions, tenantId}` from `req.session`.
**External deps.** none (gateway-assumed)
**Atoms consumed.** none
**Gap.** No SPA login screen, no logout button, no session-expiry handling. Header shows brand only — no "logged in as X" affordance. Production hardening will need explicit affordances; reverse proxy is doing all the work today.

### 3. Error boundaries, loading states, empty states, 404s

**Intended.** Catch render-time exceptions; per-route loading + empty + 404 states.
**Current state.** partial / dead-code
**Evidence.** Per-component loading spinners exist (`EngagementDetail.tsx:4954-4960`, `Notifications.tsx:53-58`, `Health.tsx:11`); per-page empty states exist throughout (`SheetGrid.tsx:66`, `EngagementList.tsx:230-234`, `ReviewerQueueList.tsx:208-298`, `FindingsTab.tsx:381-436`, `FindingsRunsPanel.tsx:178-184`, `ComplianceEngine.tsx:707-728`). **No `ErrorBoundary` anywhere in `artifacts/design-tools/src` or `artifacts/plan-review/src`** (Grep returned zero matches). `design-tools/src/pages/not-found.tsx:1-22` exists but is **dead code** — `App.tsx:64-66` uses `<Redirect to="/" />` for unmatched routes. Plan-review unmatched routes hit `ComingSoon` (`App.tsx:99-100`).
**External deps.** none
**Atoms consumed.** none
**Gap.** A render exception in any panel takes the whole SPA down silently. 404s in design-tools silently redirect. Two five-minute fixes (boundary + router catch-all) would unblock both.

### 4. Global state management

**Intended.** Server cache + per-engagement UI state + sidebar collapse state.
**Current state.** works
**Evidence.** Design-tools: TanStack Query (`App.tsx:15`); Zustand store in `store/engagements.ts:1-289` (chat messages, snapshot focus, attached sheets, SSE streaming state); `useSidebarState` re-exported from `@workspace/portal-ui` (`EngagementDetail.tsx:4855-4856`). Plan-review: TanStack Query via `@workspace/api-client-react`; URL state for tab / submission / finding / annotation deep-links (`EngagementDetail.tsx:175-236`, `lib/findingUrl.ts`).
**External deps.** none
**Atoms consumed.** none
**Gap.** Chat history is in-memory only — banner copy at `ClaudeChat.tsx:231`: "Chat history is session-only — refreshing the page clears it." Not strictly L1 (that's task state, not chat persistence) but adjacent.

### 5. Project / engagement list view

**Intended.** Grid of engagement cards with status pill, no-adapters pill, in-pilot filter, 5s poll.
**Current state.** works
**Evidence.** `design-tools/src/pages/EngagementList.tsx:125-303`; `refetchInterval: 5000` at line 129; empty state at 230-234; in-pilot filter at 213, tally at 198-204.
**External deps.** none
**Atoms consumed.** engagement
**Gap.** None operationally.

### 6. Project selection / switching

**Intended.** Click an engagement card to switch context.
**Current state.** works
**Evidence.** `EngagementList.tsx` rows link to `/engagements/:id`; deep-link state survives reload via URL query params on the detail page (`EngagementDetail.tsx:267-276` mirrors tab state to `?tab=`).
**External deps.** none
**Atoms consumed.** engagement
**Gap.** None.

### 7. New engagement creation flow

**Intended.** Architect creates a new engagement from the web UI.
**Current state.** missing
**Evidence.** No "+ New engagement" button anywhere in `EngagementList.tsx`. Empty-state copy at `pages/EngagementList.tsx:230-234` explicitly directs the user out of the web app: "Send a snapshot from Revit to create one." Engagements are created exclusively by the Revit add-in via `POST /api/snapshots` (which routes through `POST /api/engagements/match` first per A04.7).
**External deps.** Revit add-in (out-of-band)
**Atoms consumed.** N/A
**Gap.** No web fallback path. Acceptable today since architect-zero is Empressa with Revit; becomes an external-pilot friction point at Phase 5 of the program plan.

### 8. Snapshot ingestion view (architect-side display of Revit-pushed data)

**Intended.** Show snapshot timeline + raw payload + BIM viewport for what the Revit add-in pushed.
**Current state.** works
**Evidence.** `design-tools/src/pages/EngagementDetail.tsx:5066-5225` (Snapshots tab). Snapshot rows at 5101-5135; raw JSON viewer 5149-5183 (debug-grade UX); BIM viewport `BimModelViewport` at 5186-5223.
**External deps.** Three.js (via viewport)
**Atoms consumed.** snapshot, bim-model, materializable-element
**Gap.** Raw-JSON dump as the primary "what's in this snapshot" affordance is debug-grade; no structured per-entity readout. Works enough for ops debug.

### 9. Parcel briefing display

**Intended.** Architect reads structured `parcel-briefing` atom fields plus narrative text.
**Current state.** works
**Evidence.** `design-tools/src/pages/EngagementDetail.tsx:1828-3160` (SiteContextTab — 1,300+ lines). Citation chips inline-rendered via `splitOnCodeAtomTokens` and briefing-source token regex (consistent with plan-review's `CodeAtomPill.tsx:15-115`). Click-citation-→-highlight-row works at `:2311-2326`.
**External deps.** none (server-side generation; UI consumes)
**Atoms consumed.** parcel-briefing
**Gap.** None operationally.

### 10. 3DEP elevation import status / visualization

**Intended.** USGS 3DEP elevation data ingested and visualized in the SiteContextTab.
**Current state.** partial
**Evidence.** `EngagementDetail.tsx:1011-1019` (TIER_DESCRIPTIONS mentions USGS NED); elevation data lands in the briefing-source payload as text/chips, not as a dedicated visualization. The Three.js terrain mesh in `SiteContextViewer` is fed by GLBs converted from DXF uploads (via `lib/converterClient`), not by native USGS rasters.
**External deps.** USGS / FEMA / EPA federal adapters (server-side via `lib/adapters`)
**Atoms consumed.** briefing-source, parcel-briefing
**Gap.** No dedicated elevation visualization (contour overlay, hillshade, color ramp). Elevation reaches the architect only as briefing narrative + numeric chips.

### 11. Zoning / land-use display

**Intended.** Per-jurisdiction zoning code, allowed uses, overlay districts.
**Current state.** works
**Evidence.** `lib/portal-ui/src/components/ParcelZoningCard.tsx:1-120` mounted in `SiteTab` (`EngagementDetail.tsx:612-741`); overlay chips extracted at `ParcelZoningCard.tsx:114-209` (FEMA Zone A/AE/X, Bastrop floodplain, Edwards Aquifer recharge zone). Zoning code/lot info in KvGrid (`EngagementDetail.tsx:583-610`).
**External deps.** state/local adapters server-side
**Atoms consumed.** parcel-briefing
**Gap.** None.

### 12. Hazards display

**Intended.** FEMA flood zones, fire hazards, environmental hazards as briefing chips.
**Current state.** works
**Evidence.** Same `ParcelZoningCard.tsx:114-209` overlay extraction surfaces FEMA Zone chips. Bastrop floodplain and Edwards Aquifer recharge zone surfaced as named overlays. Federal adapter coverage includes FEMA flood + EPA EJScreen (server-side in `lib/adapters`).
**External deps.** federal adapters
**Atoms consumed.** parcel-briefing
**Gap.** None.

### 13. CesiumJS scene: initialization, terrain tile loading, basemap, camera controls

**Intended.** Per doc 40 (External services), CesiumJS for "geospatial visualization, neighboring-context display."
**Current state.** missing
**Evidence.** `Grep -r "cesium"` across `artifacts/design-tools/src` and `lib/portal-ui/src` returns **zero matches**. `artifacts/design-tools/package.json:14-110` has no `cesium` or `@cesium/engine` dependency. Design-tools spatial stack is Leaflet 2D (`react-leaflet@5.0.0`, `leaflet@1.9.4`) for `SiteMap` and Three.js (`three@~0.128.0`) for `SiteContextViewer` / `BimModelViewport`. (inference) Either Cesium was never wired or it was removed at some point pre-current-history; no Cesium-removal commit visible in recent log.
**External deps.** would be Cesium ion (not wired)
**Atoms consumed.** N/A
**Gap.** Either build it or update doc 40 to remove the Cesium claim and document the Three.js-orbit reality.

### 14. Adjacent parcels rendering on the Cesium scene

**Intended.** Per W2 wave plan, show neighboring parcels in 3D context.
**Current state.** missing (via Cesium); partial (via Three.js viewer)
**Evidence.** Three.js `SiteContextViewer` (`lib/portal-ui/src/components/SiteContextViewer.tsx`) consumes converted-DXF GLBs and renders adjacent-parcel meshes in an orbit-camera scene at `EngagementDetail.tsx:2962-2979`. There's a 3D sub-tab toggle on the Site Context tab (`:2864-2925`). No Cesium globe / no terrain tile streaming.
**External deps.** Three.js + GLTFLoader
**Atoms consumed.** neighboring-context (implied via SiteContextViewer overlays)
**Gap.** "Adjacent parcels" works as Three.js GLB rendering of converted geometry; the doc-implied globe view does not exist.

### 15. Neighboring-context atom consumption and display

**Intended.** Surface `neighboring-context` atom data on the SiteContextTab.
**Current state.** partial
**Evidence.** SiteContextTab consumes briefing-source rows (per-layer fetch status, kind, generated-at) at `EngagementDetail.tsx:1132+`; neighboring-context is the result of the briefing pass over those sources. There is no explicit "neighboring-context" panel/card — the data is fused into the briefing narrative and the SiteContextViewer 3D scene.
**External deps.** none
**Atoms consumed.** neighboring-context (implicit), briefing-source
**Gap.** No first-class UI for the `neighboring-context` atom; consumers see it only via the briefing narrative text and the 3D scene's overlay geometry.

### 16. Performance / responsiveness of the scene

**Intended.** N/A — the scene per doc 40 is Cesium; Cesium isn't wired.
**Current state.** N/A — Cesium not wired
**Evidence.** See surface #13. The Three.js scenes that *are* wired (BimModelViewport, SiteContextViewer) use `OrbitControls` and standard GLTFLoader (`BimModelViewport.tsx:2-4`); no measurable performance issues reported in the 5,172-line `EngagementDetail.tsx` (no FPS counters, no profile traces, no perf-related comments).
**External deps.** N/A
**Atoms consumed.** N/A
**Gap.** Bench performance only after deciding whether to build the Cesium surface or commit to Three.js as the canonical 3D stack.

### 17. web-ifc viewer initialization and wasm loading

**Intended.** Browser-side IFC parsing via `web-ifc` WASM, with model viewer. The current HEAD context (commit `99a6a02` "fix(api-server): resolve web-ifc wasm dir via entry point") implies recent web-ifc work.
**Current state.** missing (client) / works (server)
**Evidence.** No `web-ifc` package in `artifacts/design-tools/package.json` or `artifacts/plan-review/package.json`. The 99a6a02 fix is **server-side** in `artifacts/api-server` — `DESIGN.md:387-470` documents the server-side `web-ifc-api-node.js` path. Design-tools consumes **GLBs** emitted by the server, not IFCs directly: `EngagementDetail.tsx:4793-4814` uses `getGetMaterializableElementGlbUrl` and `getGetBriefingSourceGlbUrl`. The `track-c-viewer-ifc` worktree (`be70319` "feat(track-c): IFC viewer + PL-01 layout/copy fix") changes only `BimModelViewport.tsx` (GLB viewer) and engagement page — it does **not** add a client-side `web-ifc` consumer. (inference) The "IFC viewer" in track-C is really "GLB viewer for IFC-derived elements."
**External deps.** web-ifc lives in api-server only
**Atoms consumed.** bim-model, materializable-element (consumed as GLB streams)
**Gap.** Architect cannot parse an IFC in the browser. If a true client-side IFC viewer is intended (e.g., to render Revit's IFC export without server-side conversion), this is greenfield.

### 18. IFC file upload UI (frontend side of `POST /api/snapshots/:id/ifc`)

**Intended.** Architect web fallback for IFC upload.
**Current state.** missing
**Evidence.** No `<input type="file" accept=".ifc">` anywhere in `artifacts/design-tools/src` or `artifacts/plan-review/src`. The server route `POST /api/snapshots/:id/ifc` (`artifacts/api-server/src/routes/snapshots.ts:989`) is consumed exclusively by the Revit add-in via `x-snapshot-secret`. Architects who don't have Revit installed cannot push an IFC.
**External deps.** Revit add-in (out-of-band)
**Atoms consumed.** N/A
**Gap.** No web fallback.

### 19. IFC model display / camera / navigation

**Intended.** Architect navigates the parsed BIM model in-browser.
**Current state.** works (Three.js GLB; not raw IFC)
**Evidence.** `lib/portal-ui/src/components/BimModelViewport.tsx:1-150` header (continues to ~1,772 total lines). Uses `THREE`, `OrbitControls`, `GLTFLoader` (`:2-4`). Two geometry sources: inline polygon-ring extrusion, and `briefingSourceId` GLBs (`:16-32`). Click-select + camera fit + gesture legend (`:683-770` localStorage-graduated tutorial). Test contract via `data-*` attributes (`:40-87`).
**External deps.** Three.js + GLTFLoader
**Atoms consumed.** materializable-element, briefing-source (GLB endpoint), bim-model
**Gap.** Works for the consolidated-GLB flow. If raw-IFC display (per-class hide/show, IFC schema browsing) is intended, that's a different surface.

### 20. `bim-model` atom consumption

**Intended.** Per-engagement BIM model row read by architect surfaces.
**Current state.** works
**Evidence.** Server: `GET /engagements/:id/bim-model` (`routes/bimModels.ts`) synthesizes a wire from IFC ingest when no `bim_models` row exists. Client: `EngagementDetail.tsx:5186-5223` mounts viewport; `Push to Revit` action at `:3184-3358` writes via `POST /engagements/:id/bim-model`. Refresh state at `useGetBimModelRefresh`.
**External deps.** none
**Atoms consumed.** bim-model
**Gap.** None operationally.

### 21. Sheet upload UI (frontend side of `POST /api/snapshots/:id/sheets`)

**Intended.** Architect web fallback for sheet PDF/PNG upload.
**Current state.** missing
**Evidence.** `SheetGrid.tsx:66` empty state explicitly directs out-of-band: "No sheets uploaded yet. Send a snapshot from Revit." No `<input type="file">` for sheets anywhere in `artifacts/design-tools/src` or `artifacts/plan-review/src`. Server route is multipart-Busboy and consumed only by the Revit add-in.
**External deps.** Revit add-in (out-of-band)
**Atoms consumed.** N/A
**Gap.** Same shape as IFC upload — Revit-only ingestion.

### 22. Sheet preview / display

**Intended.** Browse sheet PNGs with click-to-zoom and "Ask Claude about this sheet" affordance.
**Current state.** works (PNG raster; no PDF/vector path)
**Evidence.** `design-tools/src/components/SheetGrid.tsx:15-…`, `SheetViewer.tsx:1-100` (zoom/pan modal via `react-zoom-pan-pinch`); raster URL `/api/sheets/:id/full.png` (`SheetViewer.tsx:54`). Plan-review reviewer-side: `pages/Sheets.tsx:1-120` and Sheets tab in `SubmissionDetailModal.tsx`.
**External deps.** none
**Atoms consumed.** sheet
**Gap.** Sheets are raster-only — no PDF page picker, no vector overlay, no annotation drawing. Coordinate-based annotation (if planned) is forced into pixel space.

### 23. mnml.ai render integration UI (request, status, display)

**Intended.** Kickoff dialog for still/elevation-set/video; gallery of in-flight + completed renders.
**Current state.** works
**Evidence.** `RenderKickoffDialog.tsx:1-100` (3 kinds, camera + duration fields); `RenderGallery.tsx:1-100+` polls list at 8s and per-card detail at 3s. Server-side: `routes/renders.ts` (6 endpoints) with mnml.ai integration via `@workspace/mnml-client`, GCS mirror of mnml's ephemeral CDN URLs.
**External deps.** mnml.ai (server-side); GCS for durable mirror
**Atoms consumed.** viewpoint-render, render-output
**Gap.** Architect-side `openPreviewInNewTab` defaults `false` (`RenderGallery.tsx:35-42`); reviewer-side gets a native-resolution link. Could be UX miss.

### 24. `viewpoint-render` atom rendering

**Intended.** Surface the per-viewpoint render result in the gallery.
**Current state.** works
**Evidence.** RenderKickoff fires `useKickoffRender` → server creates `viewpoint-render` atom row; `RenderCard` displays output with status pill + thumbnail. Gallery in `EngagementDetail.tsx:3723-3775`.
**External deps.** none (consumes server-mirrored bytes via `/api/render-outputs/:id/file`)
**Atoms consumed.** viewpoint-render
**Gap.** None.

### 25. `render-output` atom display

**Intended.** Surface the rendered image/video output associated with a viewpoint-render.
**Current state.** works
**Evidence.** `RenderCard` consumes `render-output` rows under each `viewpoint-render`; file streamed from `/api/render-outputs/:id/file` (`routes/renders.ts`).
**External deps.** none
**Atoms consumed.** render-output
**Gap.** None.

### 26. Massing model handling

**Intended.** Display the lightweight massing model the architect captures from Revit and the server enriches for rendering.
**Current state.** partial
**Evidence.** Massing geometry travels as part of the bim-model / materializable-element GLB stream. There is no dedicated "massing model" surface — it's rendered inline in `BimModelViewport` and used by the mnml.ai kickoff capture (`bimViewportCapture` in `routes/renders.ts`).
**External deps.** Three.js capture client-side; mnml.ai server-side
**Atoms consumed.** bim-model, materializable-element
**Gap.** No explicit "massing model preview" — it's implicit in the BIM viewport. Acceptable.

### 27. Comments panel

**Intended.** Per W3 wave + 40a L1: architect-side comment thread for reviewer-architect dialog.
**Current state.** partial
**Evidence.** Reviewer-architect dialog exists as `reviewer-annotation` atom plus `submission-comments` flat thread. Plan-review `EngagementDetail.tsx:582-606` mounts `ReviewerAnnotationPanel`; design-tools renders annotation affordance via `RequestRefreshAffordance` / `ReviewerRequestsStrip.tsx`. `routes/submissionComments.ts` exposes `GET/POST /submissions/:submissionId/comments` (cross-audience flat thread). No persistent "task list per comment" surface on the architect side.
**External deps.** none
**Atoms consumed.** reviewer-annotation, communication-event (via thread)
**Gap.** Architect-side panel exists for reading annotations; converting an annotation into a tracked action item is not a surface that exists (see #30).

### 28. Comment intake / parsing

**Intended.** Architect pastes a SCA-style plan-review comment letter and gets it parsed into structured findings/tasks. The customer-zero workflow (40a L2) wanted this.
**Current state.** missing
**Evidence.** `Grep "comment.*intake|comment.*parse"` in `artifacts/design-tools/src` returns only test-fixture matches. The reviewer-side `Communicate composer` (`plan-review/src/components/communicate/CommunicateComposer.tsx`) generates a deterministic-skeleton + Anthropic-polish outbound letter, but there is no inbound parsing surface for the architect side. The legacy `/response` route was retired in Task #479 (`EngagementDetail.tsx:3809-3812, 3924`).
**External deps.** none
**Atoms consumed.** N/A (no surface)
**Gap.** Architects cannot upload a PDF comment letter and have it parsed; not a UI surface in this repo.

### 29. Two-way comment flow

**Intended.** Architect → reviewer → architect dialog with versioned state.
**Current state.** partial
**Evidence.** Reviewer-side write paths exist: `routes/reviewerAnnotations.ts` (create/edit/promote), `routes/submissionComments.ts` (cross-audience flat thread). Plan-review UI exposes both. Architect-side write paths: the architect can dismiss `reviewer-request` rows (`routes/reviewerRequests.ts` `POST /:id/dismiss`) and override a finding via `routes/findings.ts` `POST /findings/:id/override`. There is no architect-side "reply to this annotation" affordance.
**External deps.** none
**Atoms consumed.** reviewer-annotation, communication-event, reviewer-request, finding
**Gap.** No symmetric architect-→ reviewer reply UI. Only the comments thread is bidirectional; annotations and requests are not.

### 30. Persistent task / checklist state (L1 fix surface)

**Intended.** Per 40a L1 + program plan DA-6: `response-task` atom + UI in design-tools with persistent checklist state, task transitions, link to findings.
**Current state.** missing
**Evidence.** No `response-task` atom in the registry (`registry.ts:162-230` lists 19; `response-task` is in the planned set per `27_engine_evolution_plan.md` DA-side atoms but unregistered). No checklist UI in `artifacts/design-tools/src`. The architect's only "I'll do this next revision" action is the single-button override `address with next revision` in `FindingsTab.tsx:683-734`. Legacy `/response` retired in Task #479.
**External deps.** none
**Atoms consumed.** N/A
**Gap.** L1 fix has not started. Requires atom registration (cc-agent-AC scope per the in-flight dispatch reallocation) plus UI design. Blocked on Bump 1 of contract version per `27_engine_evolution_plan.md`.

### 31. Findings list display (`/plan-review/`)

**Intended.** Auto-generated AI findings grouped by severity, with filters and per-row author tag.
**Current state.** partial
**Evidence.** UI works at `plan-review/src/components/findings/FindingsTab.tsx:97-298` (grouped by severity at 116-123; filter chips at 191-237). **The data path is mock-backed:** `findingsApi.ts:11-66, 145-160` bridges through `lib/findingsMock.ts` rather than the generated Orval client. Only `useCreateSubmissionFinding` is wired to the real API.
**External deps.** Anthropic (server-side, via the finding-engine — `routes/findings.ts:991`)
**Atoms consumed.** finding (shape only; mock-bridged)
**Gap.** Largest UI/engine integration debt in the repo. Server endpoints (8 in `routes/findings.ts`) are live and tested; FE hooks still point at the mock store. Single-file swap in `lib/findingsApi.ts` would close it.

### 32. Per-finding detail view

**Intended.** Side-panel with body, citations, references, history, provenance, accept/reject/override buttons.
**Current state.** works (UI; same mock-bridge caveat for the data hook)
**Evidence.** `FindingDrillIn.tsx:30-455`. Opens via row click in `FindingsTab.tsx:285-296`. URL deep-link `?finding=<id>` (`EngagementDetail.tsx:354-390`, `lib/findingUrl.ts`).
**External deps.** none directly
**Atoms consumed.** finding
**Gap.** "Show in 3D viewer" affordance present (`FindingDrillIn.tsx:291-317`) but jumps to a modal-internal BIM tab. Works.

### 33. Code citation rendering

**Intended.** Inline `[[CODE:atomId]]` and `{{atom|briefing-source|id|label}}` tokens render as pills with code-library links.
**Current state.** works
**Evidence.** `plan-review/src/components/findings/CodeAtomPill.tsx:15-115` (delegates code pills to `splitOnCodeAtomTokens` from `@workspace/portal-ui`); briefing-source token regex at lines 8-9. Renders on rows and drill-in (`FindingsTab.tsx:662-682`, `FindingDrillIn.tsx:241-264`).
**External deps.** none
**Atoms consumed.** code-section (forward-ref child of finding; outside the 19 domain atoms — registered separately per `27_engine_evolution_plan.md` code-pipeline atoms section)
**Gap.** Citation pill links to `BASE_URL/code` (Code Library page) but the code-section atom isn't yet a registered atom type per the registry; pill works as a label, link target may 404 for atoms not yet in the Code Library import.

### 34. Compliance pass UI

**Intended.** Per-submission "Generate findings" / "Regenerate findings" CTA with run history, pending pill, live polling.
**Current state.** works (mock-backed but full UX present)
**Evidence.** `plan-review/src/components/findings/FindingsRunsPanel.tsx:32-193`. State pills pending/completed/failed at 15-22. Auto-failure callout at `FindingsTab.tsx:319-379`. Cross-submission re-run console at `ComplianceEngine.tsx:572-582` with single-flight gating (`:496-502`) and 409 mapping (`describeRerunError`).
**External deps.** Anthropic (server-side via `routes/findings.ts:991`)
**Atoms consumed.** finding
**Gap.** Same mock-bridge caveat as #31 — live polling cadence and run pills drive off the mock store.

### 35. Reviewer-annotation display

**Intended.** Per Wave 2 Sprint C — annotation panel per target type with deep-link `#annotation=<id>`.
**Current state.** works
**Evidence.** `plan-review/src/pages/EngagementDetail.tsx:154-236` (deep-link parser); `ReviewerAnnotationPanel` mount at 582-606; per-row affordance at 918.
**External deps.** none
**Atoms consumed.** reviewer-annotation
**Gap.** Affordance only on the submission row; other target types appear via deep-link only.

### 36. Compare-against-comments workflow (L2 surface)

**Intended.** Per 40a L2 + program plan DA-4: diff a new submission's sheets against the prior comment letter.
**Current state.** missing
**Evidence.** Grep `compare|sheet.compare|content.compare` in `artifacts/plan-review/src` returns only `comment-letter` package usage (`CommunicateComposer.tsx`) and modal Sheets-tab references. No diff UI in `SheetsTab.tsx` / `pages/Sheets.tsx` / `comment-letter` consumers. Server-side `sheet-content-extraction` atom is also unregistered (planned in `27_engine_evolution_plan.md`).
**External deps.** none
**Atoms consumed.** none (would be: sheet, communication-event, planned sheet-content-extraction)
**Gap.** L2 has not started. Requires `sheet-content-extraction` atom registration (Bump 1 per `27_engine_evolution_plan.md`) plus a diff/overlay UI.

### 37. Response letter generation / preview UI

**Intended.** Per 40a L3 + L6: structured multi-section response letter assembly with citations.
**Current state.** partial (reviewer-side only)
**Evidence.** Reviewer side: `plan-review/src/components/communicate/CommunicateComposer.tsx:1-100+` calls server-side `draftSubmissionCommunication` (deterministic skeleton + Anthropic polish via `routes/communications.ts`) and persists via `useCreateSubmissionCommunication`. Architect side: no comparable surface — the legacy `/response` was retired in Task #479. PLR-11 PDF download links inline on Communicate/Decide pills (`SubmissionDetailModal.tsx:566-585, 713-729`).
**External deps.** Anthropic (server-side polish), `@workspace/plan-review-pdf` for render
**Atoms consumed.** communication-event
**Gap.** Architect-side response letter is missing entirely (this is the customer-zero workflow the 40a session ran into). L3 + L6 unaddressed for architect.

### 38. DOCX / PDF export controls

**Intended.** Per 40a L3: native DOCX/PDF generation pipeline.
**Current state.** partial (PDF only; no DOCX anywhere)
**Evidence.** PDF: briefing export at `routes/parcelBriefings.ts` `GET /engagements/:id/briefing/export.pdf` (uses `users.architect_pdf_header`); comment-letter PDF at `routes/communications.ts`; stamped plan-set PDF at `routes/decisions.ts` for approval verdicts. **DOCX:** zero matches across the repo (Grep `DOCX|docx` returns no production code paths). `Settings.tsx:11-16` imports `@workspace/briefing-pdf-tokens` for header tokens only.
**External deps.** PDF renderer libraries (server-side)
**Atoms consumed.** parcel-briefing, communication-event, decision-event
**Gap.** No DOCX path. Architect cannot export anything they could open in Word.

### 39. Deliverable assembly surface

**Intended.** Per 40a L6 + program plan DA-5: `deliverable-letter` atom + decoupled multi-section assembly that never truncates.
**Current state.** partial
**Evidence.** The deterministic-skeleton + Anthropic-polish approach in `routes/communications.ts` is the only assembly surface that exists, and it lives on the reviewer side. `deliverable-letter` is unregistered (planned per `27_engine_evolution_plan.md`).
**External deps.** Anthropic (polish); PDF renderer
**Atoms consumed.** communication-event (today); planned deliverable-letter
**Gap.** No general-purpose deliverable assembly; locked to one comment-letter shape.

### 40. QA artifact — screens

**Intended.** Internal QA / data-inspection surface mounted at `/qa/`.
**Current state.** works
**Evidence.** Five routed screens — `pages/SuitesPage.tsx:52-244` (test-suite trigger + SSE log stream), `pages/AutopilotPage.tsx:57-141` (findings report + webhook notifications), `pages/TriagePage.tsx:120-304` (Kanban triage with markdown bundle export), `pages/HistoryPage.tsx:22-201` (run history), `pages/ChecklistsPage.tsx:32-326` (manual smoke checklists). All wired to `/api/qa/*` (`routes/qa.ts` — 19 endpoints). Auto-open run trigger in `AutopilotBanner.tsx:81-94`.
**External deps.** Outbound webhook URLs (Slack/Teams) for notifications
**Atoms consumed.** none
**Gap.** "Finding" in QA dashboard ≠ `finding` catalog atom — name collision worth flagging if QA ever inspects compliance findings.

### 41. QA — data inspection / atom-browser

**Intended.** Operator-facing atom inspector for the 19 catalog atoms.
**Current state.** missing in QA
**Evidence.** No `@workspace/empressa-atom` or any of the 19 atom names referenced in `artifacts/qa/src` (Grep returned zero matches). The closest existing browsers are in `design-tools`: `pages/DevAtoms.tsx` (code-atom inspector) and `pages/DevAtomsProbe.tsx` (retrieval probe). Server-side `GET /atoms/catalog` + `GET /atoms/:slug/:id/{summary,history}` exist (`routes/atoms.ts`) but no UI consumer.
**External deps.** none
**Atoms consumed.** N/A
**Gap.** If atom-inspection is wanted in QA, it's greenfield — server side ready, UI not built.

### 42. Mockup-sandbox artifact — spike work

**Intended.** Design exploration / spike work mounted at `/__mockup` (vite config) — dispatch says `/mockup/`; not the same path.
**Current state.** dead-code (infrastructure)
**Evidence.** Renderer works (`artifacts/mockup-sandbox/src/App.tsx:7-20, 22-88`); auto-discovery plugin works (`mockupPreviewPlugin.ts:42-69`). Generated module is the empty stub: `src/.generated/mockup-components.ts:3-5` (`export const modules: ModuleMap = {};`). `src/components/mockups/` directory does not exist in the working tree.
**External deps.** chokidar, fast-glob (build-time only)
**Atoms consumed.** none
**Gap.** Whole spike surface is **empty**. No spikes to inventory; no obvious orphans to promote. The version bump to `package.json:3` `2.0.0` suggests a recent reset.

### 43. Anthropic API wiring

**Intended.** Briefing generation, finding generation, comment-letter polish, sheet OCR, chat.
**Current state.** wired (server-side, via api-server)
**Evidence.** `routes/chat.ts` (streaming `claude-sonnet-4-6` via SSE), `routes/communications.ts` (comment-letter polish), `routes/sheets.ts:765` (post-response sheet content extraction via vision OCR), and indirectly via `@workspace/finding-engine` (`routes/findings.ts:991`) and `@workspace/briefing-engine` (`routes/parcelBriefings.ts`). No `@anthropic-ai/sdk` in any UI artifact `package.json`.
**External deps.** Anthropic API
**Atoms consumed.** N/A (route-level)
**Gap.** Five distinct touchpoints in api-server; UI never calls Anthropic directly. Cost attribution lives server-side.

### 44. APS (Autodesk Platform Services) — Model Derivative + AEC Data Model + Design Automation API

**Intended.** Per doc 40 (External services): "Revit cloud operations, IFC translation, sheet PDFs. Paid tier active. Model Derivative + AEC Data Model APIs load-bearing. Design Automation API elevated to near-term priority (enables Claude-as-designer via MCP)."
**Current state.** missing
**Evidence.** Grep `"forge|aps-design-automation|APS_|autodesk"` returns **zero** matches in `artifacts/api-server/src/routes/` and zero in `artifacts/design-tools/src` and `artifacts/plan-review/src`. No `forge-apis` or `@autodesk/forge-sdk` in any `package.json`. "Push to Revit" affordance (`EngagementDetail.tsx:3184-3358`) coordinates with the **Revit add-in via api-server endpoint `POST /engagements/:id/bim-model`**, not with APS.
**External deps.** none wired
**Atoms consumed.** N/A
**Gap.** L4 (Revit content push via APS Design Automation) has not started. Doc 40 claim of "paid tier active" diverges from code reality — flag as a doc-update item.

### 45. CesiumJS asset / token configuration

**Intended.** Per doc 40: client-side Cesium with ion token.
**Current state.** missing
**Evidence.** No `CESIUM_ION_TOKEN`, `VITE_CESIUM_*`, or `Ion.defaultAccessToken` references anywhere in the repo (Grep). No `cesium` package. No ion-token storage in any server route.
**External deps.** would be Cesium ion (not wired)
**Atoms consumed.** N/A
**Gap.** Cesium has not been wired at any layer.

### 46. mnml.ai credentials / endpoint configuration

**Intended.** API key for mnml.ai render kickoff + polling.
**Current state.** wired (server-side)
**Evidence.** `routes/renders.ts` uses `@workspace/mnml-client.getMnmlClient`, `estimateRenderCost`, `bimViewportCapture`. RENDERS_PROD_ENABLED env gate (production-only). Admin sweep cron secured by `x-renders-admin-secret` header (`routes/renders.ts` admin sweep).
**External deps.** mnml.ai
**Atoms consumed.** viewpoint-render, render-output (consumed by UI from server)
**Gap.** None.

### 47. Neon connection from frontend (or backend-only)

**Intended.** Postgres + pgvector data store.
**Current state.** backend-only (correct)
**Evidence.** UI artifacts have no Postgres / Neon client imports. All UI data comes via api-server HTTP routes. `drizzle.config.ts` points at `lib/db/src/schema/index.ts` (per `10_ground_truth.md`).
**External deps.** N/A from UI
**Atoms consumed.** N/A
**Gap.** None.

### 48. Feature flags or env-gated UI

**Intended.** Toggle preview features via env or runtime flag.
**Current state.** partial (server-side only)
**Evidence.** Server-side env gates: `RENDERS_PROD_ENABLED` (renders.ts), `BIM_MODEL_SHARED_SECRET` (bimModels.ts), `x-renders-admin-secret` (renders.ts admin sweep). Client-side: `vite.config.ts:9-28` reads `PORT` and `BASE_PATH`; `RenderGallery.tsx:74-90` handles `renders_preview_disabled` 503 from API. **No `import.meta.env.VITE_*` feature flags or client-side flag scaffold** found in any UI artifact (Grep). Replit-only plugins gated by `REPL_ID` env (`vite.config.ts:40-48`).
**External deps.** none
**Atoms consumed.** none
**Gap.** No client-side flag scaffold. If 40a / Phase 5 (external pilots) calls for per-firm or per-tenant feature toggles, none of the infrastructure exists.

### 49. A/B paths or branch-pinned surfaces

**Intended.** N/A — no A/B per doc 40 / 42.
**Current state.** N/A — not implemented, no code anchor
**Evidence.** No A/B routing code (Grep `experiment|variant|treatment|control`). Four in-flight branches (`track-c-viewer-ifc`, `track-b-ifc-ingest`, `sprint/V1-4-renders`, `sprint/V1-3-glb-auth`) are sprint branches, not user-facing A/B paths.
**External deps.** N/A
**Atoms consumed.** N/A
**Gap.** Not in scope.

### 50. Recent QA test notes / known-issues files

**Intended.** Surface any prior QA notes or known-issues files Nick has accumulated.
**Current state.** works (multiple files exist; none are "known issues" exactly)
**Evidence.** `TESTING.md` (307 lines — test strategy, fixtures, baseline counts: 182 tests across 23 files), `TESTS_DEFERRED.md` (~80 lines — intentional Part-1 gaps: lib/codes orchestrator/queue, api-server routes, frontend tests), `DESIGN.md` (long-form Track B server-IFC spec), `AGENTS.md` (11.6 KB), `RECON_2026-05-18_codex.md` (1090-line untracked sister recon by Codex agent on same branch). Zero TODO/FIXME/HACK/BROKEN comments in `artifacts/{design-tools,plan-review,qa,mockup-sandbox}/src/` (Grep). Five M2-C / PL-04 markers in `lib/empressa-atom/` and `lib/adapters/`.
**External deps.** none
**Atoms consumed.** N/A
**Gap.** Code hygiene is clean; "known issues" effectively live in this recon document and Nick's head.

## Cross-cutting findings

1. **The 3D / spatial stack in `legacy-design-tools` is Leaflet 2D + Three.js GLB, NOT Cesium + client-side web-ifc.** Doc 40 lists Cesium as a load-bearing external service; no Cesium package or import exists in any artifact. web-ifc lives server-side only — the browser consumes pre-converted GLBs. If "the 3D stack is broken" assumed Cesium, the reality is that Cesium has never been wired. (inference: scope decision, not deletion — no Cesium-removal commit in recent log.)

2. **L1 was actively retired, not just unimplemented.** Task #479 stamped the removal of `/response` (`EngagementDetail.tsx:3809-3812, 3924`). Architect-side response is now a single override button. Reconciliation needed between program-plan DA-6 ("response-task atom + UI") and the deliberate retirement.

3. **L2, L3, L4, L5 are all unstarted at the UI layer.** Sheet-content compare (L2), DOCX export (L3), APS Design Automation (L4), live ICC-ES verification (L5) have no UI anchor in any artifact. L3 has a PDF-only partial via briefing + comment-letter PDFs. L6 has a partial via the deterministic-skeleton + Anthropic-polish path on the reviewer side.

4. **Plan-review's findings list is mock-bridged.** Despite full server route surface in `routes/findings.ts` (8 endpoints, tests passing), `plan-review/src/lib/findingsApi.ts:11-66, 145-160` bridges through `lib/findingsMock.ts`. Only `useCreateSubmissionFinding` is real. This is the single largest UI/engine integration gap.

5. **Reclassify endpoint UI is missing.** Server-side `POST /submissions/:id/reclassify` is live in `routes/submissions.ts:421-632`. Plan-review's triage strip displays project-type and disciplines (`ReviewerQueueTriageStrip.tsx:80-106`) but isn't editable. Zero callers in `artifacts/plan-review/src`.

6. **No global ErrorBoundary, dead 404 page, gateway-assumed auth.** A render exception in any panel takes down the SPA. 404s silently redirect to `/`. The "Coming Soon" stubs on plan-review handle their case; design-tools handles nothing. Three small fixes.

7. **`EngagementDetail.tsx` is 5,172 lines with 8 inline tab implementations.** SiteContextTab is 1,300 lines, FindingsTab ~460, SubmissionsTab ~310. This file is the central architect cockpit; its maintainability is a known refactor target (the `simplify` skill would flag it).

8. **Sheet/IFC ingestion is one-way from Revit.** No architect-side fallback for either. The empty-state copy in `SheetGrid.tsx:66` and the BIM-model empty state both direct the user out of the web UI. Becomes a Phase-5 external-pilot blocker.

9. **Polling-heavy; no WebSocket / SSE except chat + finding lifecycle + QA run logs.** Five-second polls in `EngagementList.tsx:129`, `AppShell.tsx:33+39`, `EngagementDetail.tsx:4844`; 2s briefing-status polls; 3s render polls. Live presence (PLR-9) does use SSE in `SubmissionDetailModal.tsx:185-188`, and finding lifecycle has SSE at `routes/submissionEvents.ts`. Anything else is polling.

10. **Mockup-sandbox is an empty scaffold with a path-name mismatch.** Renderer + watcher + discovery plugin all work; `src/components/mockups/` does not exist in tree. Vite mounts at `/__mockup`, prompt says `/mockup/` — divergence.

## Recommended dispatch shape

Four candidate fix dispatches, one line each.

- **cc-agent-UI-1: Shell hygiene** — ErrorBoundary + wire `not-found.tsx` + auth affordance in AppShell header. **XS**. Parallel-safe vs AC/E/M (no atom contract, no engine, no MCP).
- **cc-agent-UI-2: Findings mock-to-real swap** — replace `lib/findingsMock.ts` bridge with generated Orval client across plan-review FindingsTab + FindingDrillIn + FindingsRunsPanel + Compliance Engine. **S**. Parallel-safe vs AC/E/M; touches one file (`plan-review/src/lib/findingsApi.ts`) plus test fixtures.
- **cc-agent-UI-3: Doc reconciliation pass** — update doc 40 to reflect Three.js + Leaflet reality vs Cesium aspiration; update doc 40 to drop "APS paid tier active" claim; record Task #479 retirement in 40a. **XS** (doc_repo only). Parallel-safe by definition.
- **cc-agent-UI-4: Reclassify affordance + EngagementDetail.tsx split** — surface server-ready reclassify in plan-review triage strip; extract the 8 inline tabs in `EngagementDetail.tsx` into per-tab files. **M**. Parallel-safe vs AC/E/M (no atom changes; pure UI refactor).

L1 / L2 / L3 / L4 / L5 fix dispatches are **not recommended yet** — all gate on Bump 1 atom registrations (sheet-content-extraction, attached-document, response-task, deliverable-letter, detail-callout-spec, product-spec-reference) which is cc-agent-AC scope per the 2026-05-18 dispatch reallocation. Defer until atom contract publishes.

## Open questions for Nick

1. **Was Cesium ever shipped in design-tools, or has it always been Leaflet + Three.js?** Recent git log shows no Cesium-removal commit. If the answer is "always Three.js", doc 40 needs a rewrite. If Cesium is still intended as the W2 surface, it's net-new work.

2. **Is the `track-c-viewer-ifc` worktree the "browser IFC viewer Nick mentioned was broken"?** The worktree extends Three.js `BimModelViewport` (GLB), not browser web-ifc. (inference) If Nick expects a true client-side IFC parse, that's greenfield. If "IFC viewer" means "GLB viewer for IFC-derived elements", track-C is on the right path.

3. **Where does the L1 response-task surface live — design-tools or plan-review?** Architect-side write paths were retired in Task #479. Possibilities: (a) L1 closes via plan-review's existing reviewer-annotation/comment thread and the architect-side override button; (b) L1 is greenfield in design-tools and needs design from scratch. Both are valid; pick before scoping.

4. **Is the `Saved Findings` page (plan-review `/findings`, currently a stub) meant to be the same atom-feed as the Compliance Engine, or a curated "best of" reviewer-saved library separate from `Canned Findings`?**

5. **AIBadge default — `aiGenerated ?? true` (`FindingsTab.tsx:535`).** Is BE expected to backfill legacy rows or will the default-true-for-unknown stand permanently?

6. **`CommunicateComposer` recipient list persists but does not dispatch email.** Is the dispatcher tracked elsewhere or still TBD? Docstring says "no outbound-mail pipeline yet" (`CommunicateComposer.tsx:21-23`).

7. **Mount path discrepancy on mockup-sandbox.** Vite says `/__mockup`, dispatch + docs say `/mockup/`. Is this a pending rename?

8. **Should `pages/not-found.tsx` be wired in or removed?** Currently dead code.

9. **Is doc 40's "APS paid tier active" claim accurate?** No APS imports in any route file or UI artifact. If APS is truly paid for, it's unspent capacity; if not, the doc claim should update.

10. **Should the architect side gain an IFC/sheet upload fallback?** Today both ingestions are Revit-add-in-only. Acceptable for customer-zero (Empressa has Revit); becomes a Phase-5 friction point.

---

End of recon. No code changed in `legacy-design-tools`. Awaiting Nick's commit plan for the doc_repo `_sessions/` single-file add per `P:\doc_repo\CLAUDE.md` session protocol.
