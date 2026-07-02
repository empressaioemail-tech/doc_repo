---
title: Track F close — AI annotation pipeline
date: 2026-07-01
agent: cc-agent-C
track: F
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 217
---

# Track F close — AI annotation pipeline

Status COMPLETE. All three phases shipped in one PR (#217). AI vision annotations generate from failing compliance findings, persist into the live `engagement_annotations` table as `author='ai'` rows, overlay on the PDF viewer, and drive bidirectional callout to finding-card navigation. Both hard requirements (idempotency, asserted confidence) are enforced in code and covered by tests that read the result back from a real Postgres. No DB migration was needed — the pipeline reuses Track D's `engagement_annotations` table.

## Phases shipped

Phase 1 — vision-to-coordinate pipeline. `artifacts/api-server/src/lib/annotationPipeline.ts` (`rasterizePdfPage` via poppler `pdftoppm`, `getPdfPageCount` via pdf-lib, `extractAnnotationCoordinates` via `claude-haiku-4-5-20251001`). Async job routes in `planReviewBff.ts`: `POST /api/plan-review/engagements/:id/annotations/generate` (202 `{jobId}`) and `GET .../annotations/generate/:jobId` (`{status, progress, total, error?}`). Failing findings are selected by JOIN findings to submissions on the engagement (severity `blocker`/`concern`, status not rejected/overridden) — `findings` has no `engagementId` and no `determination` column, so the dispatch's illustrative query was corrected. GCS bytes fetched via the existing `planReviewObjectStorage.getObjectEntityBytes`.

Phase 2 — bidirectional navigation. `AnnotationSelectionProvider` and `DocumentViewerNavigationProvider` added to `@hauska/tile-shell` and wired innermost around `CortexShellInner` (so every tile is inside them). Callout click highlights the finding card; finding-card click jumps the viewer to the annotation page (viewer publishes a finding→page map; ComplianceRunTile emits `requestPage`). "Generate AI Annotations" button with bounded progress polling.

Phase 3 — 3D annotation display (DISPLAY-ONLY, creds-gated). `DWGViewer` highlights `location3d` annotations by IFC globalId via APS `search`/`select`/`isolate`. No AI 3D coordinate generation in this track. Fully behind the named `aps_not_configured` fallback.

## pdftoppm in Dockerfile

Already present. `poppler-utils` is in the Cloud Run **runtime** stage of the root `Dockerfile` (line 131, inside `FROM ... AS runtime`), added by Track D. No Dockerfile change needed for Track F.

## Idempotency — mechanism + evidence

Four layers, so a second run (or a concurrent double-click) never duplicates:
1. Per-`(engagementId, submissionId)` single-flight guard (`inFlightAnnotationJobs` map): a concurrent POST returns the in-flight jobId instead of launching a second pass.
2. Pre-run skip-set: existing `engagement_annotations` for the engagement are read, filtered to `author === 'ai'` AND `location2d.submissionId === submissionId`, and their `findingId`s excluded from the work list.
3. Per-insert re-check (`aiAnnotationExists(engagementId, findingId, submissionId)`) immediately before each insert.
4. In-run first-match-wins `placed` Set (a finding can match on multiple pages; only the first insert lands).

All filters key on `findings.id` (the FK), scoped to `author === 'ai'` so human redlines in the same table never collide.

Evidence: `planReviewBff.test.ts` runs generate twice for the same submission and asserts exactly 1 AI annotation after both runs. Verbatim runner log across both passes: `placed: 1, total: 1`. Adversarial reviewer traced all four layers and returned PASS on idempotency.

## Confidence kind:'asserted' — evidence

`const AI_ANNOTATION_CONFIDENCE = { value: 0.75, kind: "asserted" } as const;` is the only confidence written on an AI annotation (`confidence: AI_ANNOTATION_CONFIDENCE` at the sole insert). Repo grep: `calibrated` appears only in doc comments (as the negated case), never as a value. Test reads `confidence.kind === 'asserted'` and `value === 0.75` back through the list API from the DB. Reviewer PASS.

## Adversarial review verdicts

- Phase 1: PASS on both hard invariants. Three low-severity defects flagged; two fixed (added the single-flight guard against concurrent duplicate; added job-map TTL pruning) and a focused `extractAnnotationCoordinates` unit test added (Defect 3, the pipeline helpers had no coverage).
- Phase 2: initial FAIL — one HIGH defect: the `AnnotationLayer` SVG carried `pointer-events: none` while no markup tool was active, and that inherited onto the callout `<g>`, so callouts were unclickable in the normal viewing state (the headline feature was dead). Fixed by setting `pointerEvents: 'all'` on clickable callout groups. All other items (page jump, button visibility, polling termination, no-infinite-loop, event-bus stability, propagation guards, build) PASS. Re-verified: document-viewer build + app typecheck green.

## No infinite loop / polling

Generation is button-`onClick`-only; no effect triggers it. The polling effect depends solely on `[jobId]`, clears its interval on `done`/`error`/cleanup, and calls the annotation refetch exactly once via a ref (kept out of deps). After refetch, `hasAiAnnotations` becomes true and the button disappears — the only coupling. Reviewer confirmed no loop is possible.

## AI annotations land in engagement_annotations

YES. AI annotations are rows in the existing `engagement_annotations` table with `author='ai'`, `kind='finding'`, `findingId` = the failing finding's uuid, `confidence={value:0.75,kind:'asserted'}`, and `location2d={submissionId,page,bbox,label}`. Human redlines share the table, distinguished by `author`. This is exactly the shape Track G consumes for the deliverable PDF.

## APS / 3D status — creds-gated / deferred

Display-only and behind the named `aps_not_configured` fallback (Track D established no APS credentials exist in the repo/env, and LibreOffice is not in the image). The `DWGViewer` 3D-highlight path (`annotations3d` prop → `search`/`select`/`isolate`) is wired and compiles, but cannot be runtime-verified without APS creds. Not overclaimed. No AI 3D coordinate generation in this track (that needs IFC parsing — a separate workstream).

## Verification

- `pnpm run typecheck:libs`, api-server typecheck + build (`dist/index.mjs`, Done), app typecheck + vite build (built, only the pre-existing >500kB chunk advisory), `@hauska/tile-shell` build, `@hauska/document-viewer` build — all green.
- Tests against a local PG18 + pgvector: `planReviewBff.test.ts` (8, incl. idempotency + asserted-confidence) + `annotationPipeline.test.ts` (7) = 15/15 pass.
- No DB migration added. Test harness fix: `attached_documents` added to `TRUNCATE_TABLES`.

## Deployed revision

`cortex-api-00273-kid` (canary tag, shifted to 100%), built from the merge commit `0542f581bc023101d8f900e90005103adb84ee00` image. Service `cortex-api`, project smartcity-os (us-central1), URL https://cortex-api-tds7av26va-uc.a.run.app. Prior/rollback revision: `cortex-api-00271-hex`.

Canary sequence executed as four separate operator dispatches: deploy-canary (run 28570761226) -> run-migrations (run 28570870990) -> canary smoke -> shift-traffic (run 28570930396). run-migrations reported `48 migration file(s), 48 already tracked as applied, pending: (none - DB is at the head)` -- Track F added no migration (reuses the existing `engagement_annotations` table), so the live Neon is unchanged and at head.

## Deploy health

- Canary smoke before shift (independent probe of the canary tag URL): `GET https://canary---cortex-api-tds7av26va-uc.a.run.app/api/healthz -> HTTP 200`, body `{"status":"ok"}`.
- Post-shift production smoke (CI shift-traffic job): `GET https://cortex-api-tds7av26va-uc.a.run.app/api/healthz -> HTTP 200`.
- Independent post-deploy probes confirming the new routes are live on the deployed revision:
  - `GET .../api/healthz -> HTTP 200`
  - `GET .../annotations/generate/nonexistent-job -> {"error":"job_not_found"}` HTTP 404 (route mounted and executing the job-lookup, not a missing-route 404).
  - `GET .../annotations -> {"annotations":[]}` HTTP 200 (existing route, no regression).

## PR + merge

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/217
- Merge: squash-merged to main, merge commit `0542f581`, branch `track-f/ai-annotation` deleted. CI green (Typecheck 1m57s, Test 6m57s incl. DB-backed integration + schema fixture-drift check). origin/main confirmed to contain the merge (tip `0542f581`).

## Unblocks

Track G (deliverable PDF export) — AI annotations are populated in `engagement_annotations` (`author='ai'`, `location2d.bbox`, `findingId`, `label`), ready to assemble into the annotated plan set.

## Known limitations

- Coordinate accuracy is whatever claude-haiku-4-5 returns for the page raster; confidence is fixed at an asserted 0.75 (never calibrated — by commitment).
- Page-detection is exhaustive (every page x every unplaced finding) — acceptable for typical plan sets; a page heuristic is a future optimization. Per-page findings run in parallel for throughput.
- Submissions and attached_documents still have no FK link (Track D limitation), so the viewer shows the engagement's latest signed-url PDF; annotation `location2d.submissionId` is stamped from the tile's active submission.
- Phase 3 (3D) is display-only and unverifiable without APS creds.

## Vision model cost estimate

claude-haiku-4-5 vision, ~1 image + short prompt per (page x unplaced finding). A 30-page plan with 10 failing findings is up to ~300 calls in the worst case (first-match-wins reduces this as findings get placed). At Haiku pricing this is on the order of a few cents to low tens of cents per full generation run; idempotency means re-runs are near-free (skip-set short-circuits).

## Rollback

Revert the merge commit on main. For the running service, `rollback` action on the deploy workflow to the prior revision (Track D's live revision was `cortex-api-00267-zol`; the deploy job log names the exact prior revision at shift time). No migration to unwind.
