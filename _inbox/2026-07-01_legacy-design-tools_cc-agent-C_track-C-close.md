---
title: Track C close — tile and shell migration
date: 2026-07-01
agent: cc-agent-C
track: C
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 211
followup_pr: 213
merge_commit: 9542c5b14ef5efbddb69619a762c2f0c92c44b2f
followup_merge_commit: c3c27253a8b46cea71cbad67b41ae6868e0d7a44
deployed_revision: cortex-api-00267-zol
---

# Track C close — tile and shell migration

Status COMPLETE. All three phases shipped, each gated by a build sub-agent and an independent adversarial review sub-agent, all three reviewer verdicts PASS. Merged to main, deployed via the canary sequence, production healthy at 100% traffic. Track E is unblocked (with one important caveat on the registry-fetch surface, see below).

## Deployed revision

cortex-api-00267-zol serves 100 percent of production traffic (canary tag). Prior live revision cortex-api-00265-nub is the rollback target. Service URL https://cortex-api-tds7av26va-uc.a.run.app. The deployed image is merge commit c3c27253a8b46cea71cbad67b41ae6868e0d7a44 (contains Track C, Track D document-viewer, and the Docker build fix).

## PR and merge status

PR #211 (Track C core) squash-merged to main as 9542c5b. Follow-up PR #213 (Docker build fix, see below) squash-merged as c3c2725. Track D (PR #212, document-viewer) merged between the two; the trees are coherent and do not conflict. Final main tip c3c2725 typechecks clean, app test suite 9 files / 86 tests pass, all four SPAs build clean from a no-dist state.

## Per-phase reviewer verdicts

Phase 1 (shell to @hauska/tile-shell): PASS. Dependency inversion verified clean, zero package-to-app edges, all six providers plus components moved, --h-* tokens applied with no leftover hardcoded hex.

Phase 2 (typed @hauska/cortex-client, api-server imports types): PASS. Reviewer ran an independent negative test (injected a bogus field into an EngagementDetail-typed literal, got TS2353, reverted to green) proving the wire contract genuinely binds at the server boundary and is not structural any.

Phase 3 (tiles to @hauska/cortex-tiles): PASS on all three mandatory confirmations. 12 tiles moved with error boundaries and useCortexClient; 46/46 registry entries carry all four capability fields; zero package-to-app dependency. The reviewer also caught the build agent mischaracterizing a CI test blocker as pre-existing when it was introduced by the branch (fixed, see below).

## What moved

Into @hauska/tile-shell: CortexShell, GridCanvas, SpaceBar, TileWrapper, TilePicker, TileStatusBanner, PlannedTile, layouts, and the Engagement/Spatial/Code providers. The shell was refactored so the app-resident TILE_REGISTRY, presets, admin-functions fetch, and saved-spaces helpers are injected via props (dependency inversion) — the package has zero knowledge of the app.

Into @hauska/cortex-client: response types (QueueRow, EngagementDetail, ReportResult, LetterDraft/LetterDocument, Sheet, ResponseTask, Finding, IntakeParseResult, ComplianceRunResult, TileDefWire) plus typed client methods.

Into @hauska/cortex-tiles: 12 tiles — IntakeTile, IntakeQueueTile, MapTile, TopographyTile, DrainageTile, HydrologyTile, SubsurfaceTile, PropertyBriefTile, HazardProfileTile, EncumbranceTile, SheetExtractionTile, ResponseTasksTile — each wrapped in TileErrorBoundary and converted from raw BFF fetch to useCortexClient(). Plus TileErrorBoundary and a shared ReportTileShell.

Stayed app-side (justified, out-of-scope to package): compliance-run and letter. Both deeply couple to @workspace/api-client-react generated hooks, app components (FindingCard, JurisdictionBar), and app libs (reviewApi, commentLetter, planReviewBffQueries). Packaging them would drag the entire review-page contract into the package interface for two tiles. Both are still error-boundary-wrapped (importing the boundary from @hauska/cortex-tiles) and both carry full capability fields in the registry. document-viewer (Track D) is also app-side by Track D's design, error-boundary-wrapped, full capability fields.

## Map-tile path taken

MapboxGL FALLBACK path — @hauska/map-renderer is NOT published (npm view returned 404). The existing MapTile is an iframe embed of the external hauska-map surface that reads engagement lat/lng/apn plus SpatialProvider overlays and postMessages them in; this already satisfies "center on the engagement parcel, render overlays from SpatialProvider," so it was preserved rather than rewritten to raw MapboxGL (no mapbox dependency added). It is structured behind a single clean swap seam: packages/cortex-tiles/src/map/MapTile.tsx contains a local MapSurface component marked `// SWAP SEAM: replace <MapSurface/> with <FloatingMap/> from @hauska/map-renderer when published` with a props contract (apn/jurisdiction/lat/lng/overlays). FOLLOW-UP FOR ORCHESTRATOR: when @hauska/map-renderer publishes, one seam swap in MapTile.tsx completes the map integration; the map TileDef capability fields are already correct.

## Tile registry — capability fields complete?

YES. All 46 TileDef entries (45 Track C + 1 document-viewer from Track D) carry requires, produces, modes, and mcpTools. Verified by structural per-entry parse: 46 entries, 46 requires, 46 produces, 46 modes, 46 mcpTools, 0 missing. 16 entries carry an honest empty mcpTools [] (planned/unbacked or client-only tiles), not a fabricated tool name.

### Full TileDef capability registry (this is what Track E's compose_workspace reads)

- intake [live] requires={engagementId:false} produces={} modes=[full,card,raw] mcpTools=[create_engagement,upload_document,parse_intake]
- intake-queue [live] requires={} produces={} modes=[full,card,raw] mcpTools=[get_queue]
- compliance-run [live] requires={engagementId,uploadedDocuments} produces={findings,spatialOverlays} modes=[full,card,raw] mcpTools=[run_compliance_pass,get_compliance_findings]
- document-viewer [live] requires={engagementId,uploadedDocuments} produces={annotations} modes=[full] mcpTools=[]  (Track D)
- findings-library [live] requires={engagementId} produces={findings} modes=[full,card,raw] mcpTools=[get_compliance_findings]
- calibration [live] requires={engagementId,completedFindings} produces={} modes=[full,card,raw] mcpTools=[get_calibration_report]
- precedence [degraded] requires={jurisdiction} produces={} modes=[full,raw] mcpTools=[get_precedence]
- icc-ingest [partial] requires={jurisdiction} produces={} modes=[full,raw] mcpTools=[]
- ahj-precedent [planned] requires={jurisdiction} produces={} modes=[full] mcpTools=[]
- code-broadcast [planned] requires={jurisdiction} produces={} modes=[full] mcpTools=[]
- topography [live] requires={engagementId} produces={spatialOverlays} modes=[full,card,raw] mcpTools=[get_topography]
- drainage [live] requires={engagementId} produces={spatialOverlays} modes=[full,card,raw] mcpTools=[get_drainage]
- hydrology [degraded] requires={engagementId} produces={spatialOverlays} modes=[full,card,raw] mcpTools=[get_hydrology]
- subsurface [partial] requires={engagementId} produces={spatialOverlays} modes=[full,card,raw] mcpTools=[get_subsurface]
- stormwater [planned] requires={engagementId} produces={spatialOverlays} modes=[full] mcpTools=[]
- cut-fill [planned] requires={engagementId} produces={spatialOverlays} modes=[full] mcpTools=[]
- solar [planned] requires={engagementId} produces={spatialOverlays} modes=[full] mcpTools=[]
- viewshed [planned] requires={engagementId} produces={spatialOverlays} modes=[full] mcpTools=[]
- map [live] requires={} produces={spatialOverlays} modes=[full,raw] mcpTools=[]
- property-brief [live] requires={engagementId,apn} produces={} modes=[full,card,inline,raw] mcpTools=[get_property_brief]
- hazard [live] requires={engagementId,apn} produces={spatialOverlays} modes=[full,card,inline,raw] mcpTools=[get_hazard_profile]
- place-dossier [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[get_place_dossier]
- encumbrances [live] requires={engagementId,apn} produces={} modes=[full,card,raw] mcpTools=[get_encumbrances]
- setbacks [live] requires={apn,jurisdiction} produces={} modes=[full,card,inline,raw] mcpTools=[get_setbacks]
- climate-risk [planned] requires={apn} produces={} modes=[full] mcpTools=[]
- insurance-estimate [planned] requires={apn} produces={} modes=[full] mcpTools=[]
- jurisdiction-rank [planned] requires={jurisdiction} produces={} modes=[full] mcpTools=[]
- sheet-extraction [live] requires={engagementId,uploadedDocuments} produces={} modes=[full,card,raw] mcpTools=[extract_sheets,get_sheets]
- doc-parsing [live] requires={engagementId,uploadedDocuments} produces={} modes=[full,card,raw] mcpTools=[parse_document]
- product-spec [live] requires={} produces={} modes=[full,card,raw] mcpTools=[get_product_spec]
- detail-callouts [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[get_detail_callouts]
- response-tasks [live] requires={engagementId,completedFindings} produces={} modes=[full,card,raw] mcpTools=[get_response_tasks]
- bim-query [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[query_bim_model]
- ifc-ingest [live] requires={engagementId,uploadedDocuments} produces={} modes=[full,card,raw] mcpTools=[ingest_ifc]
- engagement-match [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[match_engagement]
- renders [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[generate_render]
- collateral-export [live] requires={engagementId} produces={} modes=[full,card,raw] mcpTools=[export_collateral]
- letter [live] requires={engagementId,completedFindings} produces={letter} modes=[full,card,raw] mcpTools=[generate_letter]
- letter-render [live] requires={engagementId,completedFindings} produces={letter} modes=[full,card,raw] mcpTools=[render_letter]
- letter-send [live] requires={engagementId,completedFindings} produces={letter} modes=[full,card,raw] mcpTools=[send_letter]
- avm [partial] requires={apn} produces={} modes=[full,card,raw] mcpTools=[get_avm]
- rent-comps [partial] requires={apn} produces={} modes=[full,card,raw] mcpTools=[get_rent_comps]
- pro-forma [planned] requires={apn} produces={} modes=[full] mcpTools=[]
- deal-score [planned] requires={apn} produces={} modes=[full] mcpTools=[]
- motivated-seller [planned] requires={apn} produces={spatialOverlays} modes=[full] mcpTools=[]
- rehab-opportunity [planned] requires={apn} produces={} modes=[full] mcpTools=[]

## CRITICAL for Track E — where the capability registry actually lives

The dispatch told Track E to fetch capability fields at GET https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/admin/functions. IMPORTANT: that endpoint does NOT serve capability fields. It is a pre-existing hardcoded status-only route returning 6 entries with just {id,label,category,status,degradedReason} — no requires/produces/modes/mcpTools. The full 46-entry capability registry lives in the client-side app source at artifacts/codex-reviewer-qa/src/tile-shell/tiles.tsx (TILE_REGISTRY / ALL_TILES), bundled into the browser SPA. The dispatch explicitly directed Track C to KEEP TILE_REGISTRY app-side ("it's app-specific") and did not scope a server route to expose it, so this is not a Track C miss — but Track E's fetch assumption will not return the fields. Two resolution options for the orchestrator: (a) add a Track-E-owned server route (e.g. GET /admin/tile-registry) that serializes the full TILE_REGISTRY with capability fields; or (b) have compose_workspace read the registry from a shared package export rather than over HTTP. Verbatim table above is the authoritative registry Track E needs today.

## Error boundaries

All tiles wrapped: YES. Every one of the 12 package tiles wraps its inner component in TileErrorBoundary (a real React class boundary with getDerivedStateFromError + retry). The two app-resident tiles (compliance-run, letter) and Track D's document-viewer are also wrapped.

## CortexClient typed methods

getQueue, getEngagement, runReport, getReport, getLetter, generateLetter, patchFinding, getSheets, extractSheets, getResponseTasks, createEngagement, parseIntake, runCompliancePass, fetchAdminFunctions, plus (added in Phase 3) requestDocumentUploadUrl, completeDocumentUpload, createSubmission, getSubmissions, getSubmissionFindings, getSubmissionFindingsStatus. The raw fetch<T> and config remain (backward compatible). doFetch omits the Authorization header when the token is empty and sends credentials:'include' so the cookie-session plan-review BFF authenticates (a present-but-non-service Bearer would 401 on requireServiceTokenOrSession).

## api-server imports from cortex-client?

YES. artifacts/api-server/src/routes/planReviewBff.ts imports type { QueueRow, EngagementDetail, LetterDraft, TileDefWire } from '@hauska/cortex-client' and binds them at the queue, engagement, letter, letter-generate, and admin-functions response sites. Contract enforcement proven by the reviewer's negative test.

## codex-reviewer-qa tiles dir empty?

Empty of migrated tiles. Remaining: Compliance/compliance-run.tsx and Deliverable/letter.tsx (justified undecouplable, both error-boundary-wrapped), plus Compliance/document-viewer.tsx (Track D), stubFactory.tsx, and stubFactory.test.tsx (the app registry's stub factory, not a tile).

## Two defects found and fixed during merge/deploy (not in the original phase plan)

1. CI typecheck portability. The Track B package scaffold pointed each @hauska/* exports map only at dist/, so a clean CI checkout (no prebuild) could not resolve the packages — first PR #211 CI run failed Typecheck with TS2307. Fixed by adding a "workspace" export condition pointing at ./src/index.ts on tile-shell/cortex-client/cortex-tiles (mirrors the repo's existing @workspace/* packages and tsconfig.base customConditions:["workspace"]). TS resolves to source; dist stays for published consumers. This was part of PR #211.

2. Docker image build. The Dockerfile builds the SPAs with no prebuilt package dist, and vite's Rollup resolver does not honor the "workspace" TS condition, so the push-triggered build-and-push for #211 (and Track D #212) failed to resolve @hauska/cortex-tiles. Fixed in follow-up PR #213 by adding resolve.conditions:["workspace"] to artifacts/codex-reviewer-qa/vite.config.ts. Verified against a clean no-dist build of all four SPAs. Track D's own image build had failed for the same reason; the fix repaired the deploy for the combined tree.

Also: fixed a vitest resolution failure (the app test suite could not resolve react through the built @hauska dist) by aliasing @hauska/* to source plus react dedupe in the app's vitest.config.ts.

## Deploy health

Canary sequence executed in order: deploy-canary (image c3c2725, revision cortex-api-00267-zol at 0%) → run-migrations (applied Track D's 0048_engagement_annotations; 48 files, 47 previously applied, 1 applied this run; DB at head) → smoke (canary /api/healthz HTTP 200, /admin/functions HTTP 200) → shift-traffic (100% to canary; workflow's own prod /api/healthz smoke passed). Independent post-shift verification: prod /api/healthz 200, prod /api/plan-review/admin/functions 200, codex-reviewer-qa SPA serves HTTP 200 with the migrated bundle.

## Unblocks

Track E (compose_workspace) can begin — the tile registry is stable and every entry carries capability fields (verbatim table above). See the CRITICAL note: the fields are in the app-side TILE_REGISTRY source, not on the /admin/functions HTTP endpoint the dispatch named; Track E needs a registry-exposure route or a shared-package read.

## Rollback

Roll traffic back to prior revision cortex-api-00265-nub via the rollback workflow_dispatch (action=rollback, rollback_revision=cortex-api-00265-nub). Note the DB migration 0048_engagement_annotations is additive (new table) and does not require a rollback for reverting the app revision.
