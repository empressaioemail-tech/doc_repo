---
title: QA P1 T2+T3 close — shared active-parcel context + tile finishing
date: 2026-07-02
agent: cc-agent (lead, autonomous)
track: P1 T2+T3 (Cortex Workspace QA build)
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 220
merge_commit: 65359585a47c9dd17c8e5e39931ccf32edee37b6
deployed_revision: cortex-api-00279-boj
service_url: https://cortex-api-tds7av26va-uc.a.run.app
---

# QA P1 T2+T3 close — shared active-parcel context + tile finishing

Status COMPLETE. The workspace now has ONE shared active-parcel authority read by every address-scoped tile, three unified setters that all write to it (intake-queue row-click, top-bar address search, map-click), a map-click property summary, real renders for Property Brief and Hazard, four newly built shell tiles, wired Topography/Drainage results with an overlay-to-map seam, and honest tile status labels. Gated by a build sub-agent and an adversarial review sub-agent per phase; the one HIGH defect the reviewer found was fixed and regression-tested. Merged (PR #220, squash `6535958`), deployed via the canary sequence, production healthy at 100 percent on `cortex-api-00279-boj`, new BFF route verified live.

## Phase A — the shared active-parcel context (foundational)

Extended the existing `EngagementProvider` (packages/tile-shell/src/providers/EngagementProvider.tsx) into the single active-parcel authority rather than adding a parallel provider that could drift. It now exposes `activeParcel {engagementId, apn, jurisdiction, address, lat, lng}`, a `setActiveParcel(partial)` setter, and a `useActiveParcel()` hook (both exported from the package). Every address-scoped tile reads this — no tile holds its own apn/lat/lng/jurisdiction (verified by grep in review).

Precedence rule (the load-bearing bit): a coordinate-bearing selection (address search or map-click that lands a lat/lng) SUPERSEDES a loaded engagement's parcel identity in the derived `activeParcel`, while preserving `engagementId` so engagement-scoped tiles (compliance, letter, findings) still resolve. A coordinate-less override defers to the engagement. Selecting a new engagement clears any prior override.

The three setters, all routed through the shared context:

1. Intake-queue row-click — already routed through `setEngagement` (unchanged; it now feeds the same authority).
2. Top-bar address search — new `AddressSearchBox` component in the shell top bar (SpaceBar). It calls an app-supplied `onGeocode` (so the package stays BFF-client-free) which hits a NEW BFF route `POST /plan-review/geocode` (wraps the engine `resolvePlace`; same `requireServiceTokenOrSession` auth as every other plan-review route, so the workspace reaches it on its cookie session — the brokerage `/place/resolve` route is gated by a different auth). On a hit it writes the geocoded parcel to the shared context via `setActiveParcel`. Added a typed `client.geocode()` method + `GeocodeResult` type to `@hauska/cortex-client`.
3. Map-click — `FloatingMap.onParcelSelect` (already present in `@hauska/map-renderer@0.1.0`) wired to `setActiveParcel`. On a parcel selection the map tile surfaces a compact `PropertyBriefTile` (card mode) as the property summary — reusing the tile, not a separate module.

Design note on address-search-with-no-engagement: a bare address search scopes the parcel (apn/lat/lng/jurisdiction) WITHOUT auto-creating an engagement — a read gesture should not write. Address-scoped tiles keyed on apn/jurisdiction (setbacks, map, compact brief) react immediately; engagement-scoped report runs still select/create an engagement via intake. Named here as the honest seam.

## Phase B — tile finishing (before / after)

Property Brief (packages/.../PropertyBriefTile.tsx). Before: raw collapsible JSON via ReportTileShell, no address input. After: an active-parcel-driven input line (answers "how do I put in an address" — the top-bar search sets it, the tile shows what's active), narrative sections A-G rendered, sources/provenance list, render modes full/card/inline/raw (card is the map summary; raw is a headless children-fn escape hatch). Tolerant of a degraded / coverage-noted result and renders whatever the endpoint returns including a partial body on an error status — does not assume the 500 persists (the engine track is moving briefing to 200-with-fallback).

Hazard Profile (packages/.../HazardProfileTile.tsx). Before: raw collapsible JSON dump. After: a real render — FEMA flood-zone chip (defensive read across adapter field names), per-layer cards with provider / snapshotDate / sourceKind, and a confidence display colored by kind (calibrated/asserted/deterministic) when the payload carries a confidence object. Raw kept behind a "view raw" toggle.

Four built shell tiles (were "shell registered; full tile UI pending"):
- Findings Library — `getSubmissions` + `getSubmissionFindings`; submissions list, click loads findings, each opaque finding rendered as a card with per-finding raw toggle.
- Local Setbacks — `GET /api/local/setbacks/:jurisdictionKey` keyed on `activeParcel.jurisdiction` (auto-fetch on change); a real districts table (front/rear/side/corner/height/coverage/impervious) with per-row citation links; honest 404 message.
- Document Parsing — `GET /api/engagements/:id/attached-documents`; per-document card with title, type badge, parsed/not-parsed indicator, parsed body in a collapsible.
- Product Spec Reference — `GET /api/engagements/:id/product-spec-references`; card per reference with product/manufacturer, ESR number linking iccEsUrl, status badge, last-verified provenance.
All four call their endpoint via `useCortexClient()`, wrap in `TileErrorBoundary`, use only `--h-*` tokens, and are registered in the app COMPONENTS map so they no longer render the stub.

Topography + Drainage. Track C had already wired the Run buttons to the engine endpoints and the SpatialProvider overlay push (the dispatch's "Run buttons do nothing" reflected the pre-Track-C state). Added the missing visible output: a success summary line (N contours / N flow lines + "pushed to Map overlay stack") and honest not-run/error handling. Kept the overlay `kind` aligned with the map's layerKey mapping.

## Status-label corrections (honest status)

Ten registry entries were marked `status:'live'` but render only a workspace stub ("shell registered; full tile UI pending") — a dishonest live banner. Downgraded to `partial` with the reason "Backend live via other surfaces; workspace tile UI not built (stub)": calibration, place-dossier, detail-callouts, bim-query, ifc-ingest, engagement-match, renders, collateral-export, letter-render, letter-send. The four newly built tiles legitimately keep `live`. Change is data-only in `packages/cortex-client/src/tileCapabilities.ts`; capability fields (requires/produces/modes/mcpTools) intact on all 46 entries; the `tileRegistry.test.ts` drift guard passes (6/6), so Track E's `compose_workspace` contract is unaffected.

## Overlays seam left for @hauska/map-renderer 0.1.1

MapTile maps the SpatialProvider overlay stack (`{id,kind,label,geojson,opacity}`) onto the map-renderer `OverlaySpec[]` (`{layerKey,geojson,visible,paint}`) via `toMapOverlays` and passes it to `FloatingMap.overlays`. In 0.1.0 that prop is reserved and unwired (no `setOverlays` on the renderer), so overlays do not draw yet — unchanged from the prior iframe. When 0.1.1 ships `setOverlays`, bumping `@hauska/map-renderer` in packages/cortex-tiles is the only change needed: the prop is already passed and the mapping is already correct (Topography pushes `layerKey:'topography-contours'`, Drainage `'hydrology-flow'`/`'drainage-zones'`). ONE LINE for the orchestrator.

## Per-phase reviewer verdicts

- Build sub-agent (four shell tiles): typechecks green, endpoints wired, registered.
- Adversarial review sub-agent: PASS-WITH-NITS across all 8 mandatory checks. Confirmed: single shared authority (no tile holds its own apn), address-search AND map-click both set it and address-scoped tiles react, map-click shows a compact property summary, Hazard renders (not raw JSON), the four shell tiles render real UIs, status labels honest (0 stub-with-live remaining), overlays seam present, nothing broken (full build/test matrix green).
- One HIGH defect found and FIXED: address search silently kept the loaded engagement's parcel (the memo let the engagement win over a bare override). Fixed by the coordinate-bearing-override precedence rule; added 5 provider precedence tests (`activeParcel.test.tsx`) covering all three setters. Re-verified green.

## Verification (verbatim)

- typecheck:libs `tsc --build` EXIT 0; app typecheck EXIT 0; api-server typecheck EXIT 0.
- api-server esbuild build EXIT 0, `dist/index.mjs` produced; esbuild conditions still `["workspace"]` only (pg intact — the narrow-conditions gotcha respected).
- app vite build EXIT 0 (181 modules, up from 154 baseline; only the pre-existing >500kB chunk advisory).
- app test suite 91/91 pass (86 prior + 5 new provider tests); tile-registry drift guard 6/6.
- CI on PR #220: Typecheck pass (1m53s), Test pass (6m50s, incl. DB-backed integration + schema fixture-drift).

Live canary + prod smokes (curl `--ssl-no-revoke` from the Windows TLS-proxy shell):

```
CANARY /api/healthz                -> {"status":"ok"} HTTP 200
CANARY /codex-reviewer-qa/         -> HTTP 200
CANARY /api/plan-review/geocode    -> {"placeKey":"coord:29.54630:-95.10373", ... "city":"Houston","confidence":"high"} HTTP 200  (NEW route live)
CANARY geocode empty-body guard    -> {"error":"address_or_latlng_required"} HTTP 400
CANARY /api/plan-review/admin/tile-registry -> HTTP 200
CANARY /api/plan-review/admin/functions     -> 200, 6 entries, status-only (unchanged)

PROD  /api/healthz                 -> {"status":"ok"} HTTP 200
PROD  /api/plan-review/geocode     -> geocoded correctly, HTTP 200
PROD  /codex-reviewer-qa/          -> HTTP 200
PROD  /api/plan-review/admin/tile-registry -> HTTP 200
```

## Deploy

Canary sequence on merge SHA `6535958` (image built by the push-triggered build-and-push, run 28592702699):

- deploy-canary (run 28592978229) -> revision `cortex-api-00279-boj` created at 0%, tag `canary`, Ready. SUCCESS.
- run-migrations (run 28593183885) -> `48 migration file(s), 48 already tracked as applied, pending: (none — DB is at the head)`. This PR added NO migration (the geocode route is stateless; the status change is data-only), so live Neon is unchanged and at head.
- canary smoke (independent probes above) -> all green.
- shift-traffic (run 28593338659) -> 100% to canary; workflow's own prod `/api/healthz` smoke HTTP 200. SUCCESS.

`gcloud run services describe cortex-api` confirms `cortex-api-00279-boj` serves 100% of production traffic. Prior/rollback revision: `cortex-api-00277-gun`.

## PR + merge

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/220
- Merge: squash-merged to main, merge commit `65359585`, branch `qa-p1-t2t3/workspace-context-and-tiles` deleted. origin/main confirmed to contain the merge (tip `6535958`). Two commits: the Phase A+B feature, then the reviewer-defect fix + tests.

## Known gaps / notes

- Address search scopes a bare parcel (no auto-created engagement); engagement-scoped report runs still require an engagement selected via intake. Named as the honest seam, not a defect.
- Overlays do not draw on the map until `@hauska/map-renderer@0.1.1` ships `setOverlays` (seam wired; one dep bump).
- Findings Library, Document Parsing, and Product Spec render defensively against opaque `unknown` wire payloads (no typed finding/document/spec wire exists); they read documented fields and fall back per-item — no invented typed shape.

## Rollback

Roll traffic back to `cortex-api-00277-gun` via the `rollback` workflow_dispatch (`action=rollback`, `rollback_revision=cortex-api-00277-gun`). No DB migration to unwind.

## For the orchestrator — one line

Overlays light up on the map with a single change once `@hauska/map-renderer@0.1.1` publishes `setOverlays`: bump the `@hauska/map-renderer` dependency in `packages/cortex-tiles` (the `overlays` prop and the `toMapOverlays` mapping in MapTile are already in place).
