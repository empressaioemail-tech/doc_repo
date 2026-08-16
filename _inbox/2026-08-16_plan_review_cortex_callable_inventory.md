---
id: 2026-08-16_plan_review_cortex_callable_inventory
title: Live cortex-api plan-review callables to elevate into plan-review
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_plan_review_extract_and_remount, 48_cortex_reporting_plan_review_spec, artifacts/api-server/src/routes/planReviewBff.ts]
---

# Cortex plan-review callables (elevate, do not rewrite)

Source this session: `P:\legacy-design-tools\artifacts\api-server\src\routes\planReviewBff.ts` mounted at `/api/plan-review` from `artifacts/api-server/src/routes/index.ts`. Client contract: `P:\legacy-design-tools\packages\cortex-client\src\client.ts`. Tile registry: `packages/cortex-client/src/tileCapabilities.ts`. MCP Codex gate: `P:\hauska-mcp-server\src\tools.ts` + `src/legacy-client.ts`. Read-only. Dirty LDT was not cleaned or stashed.

Calibration is listed and left. Do not rebuild scoring on G-60.

## Mount after extract

| Surface | Today | After |
|---|---|---|
| `plan-review` Cloud Run | not live | owns the implementation |
| cortex-api `/api/plan-review/*` | in-process BFF | remount proxy to Cloud Run |
| `plan-review-app` Vercel | not live | talks to Cloud Run (like smart-files-app) |
| MCP `codex_*` | `legacy-client` to cortex | retarget Cloud Run (WDLL 17). Cortex proxy is the compatibility path |
| CC / PE / cortex-tiles | cortex `/api/plan-review` | keep the URL; remount carries them |

Do not 404 the cortex path the way G-58 404'd `/api/smart-files`. Those clients already exist.

## HTTP BFF (copy/adapt into plan-review)

Paths are relative to `/api/plan-review`.

| Method | Path | Spec 48 / G-60 | Elevate |
|---|---|---|---|
| POST | `/intake` | F2 | Yes. Strip Cotality. Parcel-node / public-record only. `resolvePlace` is the dead dependency. |
| POST | `/engagements` | F2 | Yes |
| GET | `/queue` | F1 | Yes |
| GET | `/reviewer/engagements` | F1 | Yes |
| GET | `/engagements/:id` | F2 | Yes |
| POST | `/engagements/:id/submissions` | F2/F3 | Yes |
| GET | `/engagements/:id/submissions` | F2 | Yes |
| GET | `/submissions/:id/findings` | F3/F5 | Yes. Keep wire shape. Calibration of those findings is later. |
| GET | `/submissions/:id/findings/status` | F3 | Yes |
| POST | `/engagements/:id/compliance-run` | F3/F4 | Yes. Findings + precedence. Precedence production gate is already degraded; do not fake it live. |
| GET | `/engagements/:id/sheets` | files room | Elevate route. Bytes move to Smart Files, not cortex `sheets` table, for new ICC rooms. |
| POST | `/engagements/:id/sheets/extract` | files | Same |
| GET | `/engagements/:id/letter` | letter | Yes. Today in-memory `planReviewLetterDrafts`. Persist on plan-review Neon (`plan_review_letters`). |
| POST | `/engagements/:id/letter/generate` | letter | Yes |
| POST | `/engagements/:id/export` | letter/PDF | Elevate. GCS signed URL stays a deliverable, not cortex-prod identity. |
| POST | `/engagements/:id/reports/:type/run` | E6-adjacent / reporting compose | Elevate so cortex-tiles keep working. Types include hydrology, topography, hazard, brief, drainage. |
| GET | `/engagements/:id/reports/:type` | same | Yes |
| GET | `/engagements/:id/documents` | files | **Smart Files list.** Do not copy cortex attachedDocuments. |
| POST | `/engagements/:id/documents` (bytesBase64) | files | **Smart Files upload.** GCS upload-url is 410. |
| POST | `/engagements/:id/documents/upload-url` | files | **410 gone.** Cortex GCS. |
| GET | `/engagements/:id/dataroom-atoms` | files | **Smart Files file-shaped atoms** (entityId, accessPolicy, placements). Not `dataroom_document_atoms`. |
| GET | `/engagements/:id/sheets` | files | Alias of the Smart Files folder list. |
| GET | `/engagements/:id/response-tasks` | extra, live | Elevate. Not a G-60 grade item. |
| GET/POST/DELETE | `/engagements/:id/annotations` | extra, live | Elevate. Not a G-60 grade item. |
| POST | `/engagements/:id/annotations/generate` | extra | Elevate 202 job. |
| GET | `/engagements/:id/annotations/generate/:jobId` | extra | Yes |
| POST | `/engagements/:id/dwg-convert` | named 501 | Keep the honest 501. Do not implement LibreOffice. |
| POST | `/geocode` | F2 | Elevate with Cotality strip. Fail closed if it still calls CoreLogic. |
| GET | `/admin/functions` | registry | Elevate. Served from live tile/function list. |
| GET | `/admin/tile-registry` | registry | Elevate verbatim `TILE_CAPABILITIES`. |
| GET/PUT/DELETE | `/spaces` and `/spaces/by-name/:name` | shell | Elevate so remount does not break the reviewer QA shell. Not a G-60 grade item. |
| POST | `/spaces/by-name/:name/share` | shell | same |
| GET | `/spaces/shared/:token` | shell | same |

`cortex-client` also types `patchFinding` (`PATCH .../findings/:findingId` accept/override/flag). That method is the F4 override. Elevate it even if the BFF file split hides the handler; MCP `codex_override_write` is the same action.

## MCP Codex tools (already callable)

| Tool | Gate | Elevate by |
|---|---|---|
| `codex_finding_generation` | product_codex | Retarget at plan-review compliance-run / findings |
| `codex_findings_fetch` | product_codex | Retarget at findings GET |
| `codex_override_write` | product_codex | Retarget at F4 override |
| `codex_briefing_fetch` | product_codex | Retarget at briefing / atom-chain |
| `codex_snapshot_ingest` | product_codex | Retarget at snapshot/sheets ingest |

Do not delete reporting `cortex_*` tools. Do not add a second MCP server.

## Tile registry (do not rebuild planned tiles)

`GET /admin/tile-registry` returns `TILE_CAPABILITIES`. Statuses this session:

Live enough to keep: `intake`, `intake-queue`, `compliance-run`, `document-viewer`, `findings-library`, `map`, `letter`, plus site-analysis report tiles that already have `/reports/:type` runners (`topography`, `hydrology`, `drainage`, `hazard`, `property-brief`, `sheet-extraction`, `response-tasks`, `dataroom`).

Leave as-is, do not rebuild on G-60: `calibration` (partial, stub UI; operator: another topic), `precedence` (degraded, production gate off), `icc-ingest` (partial), `dwg-convert` path (named 501), and the long tail marked planned (`avm`, `rent-comps`, `pro-forma`, `deal-score`, `motivated-seller`, `rehab-opportunity`, `letter-send`, `renders`, `bim-query`, `ifc-ingest`, and siblings). Remount the registry so the shell still sees the honest statuses.

## Do not copy

| Thing | Why |
|---|---|
| Cotality / CoreLogic in `resolvePlace` or F2 | Extinguished. Strip. |
| cortex-prod DSN, `fancy-fire` hosts | Isolation. Plan-review Neon only. |
| LDT git subtree / dirty `feat/s1-instrument-hardening` | Standing. Copy/adapt in `P:\plan-review`. |
| Calibration compute rewrite | Operator: later. |
| LibreOffice DWG | Named 501 stands. |
| Smart Files unmount 404 applied to `/api/plan-review` | Would break live callers. Remount instead. |
