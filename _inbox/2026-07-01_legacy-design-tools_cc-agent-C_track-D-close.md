---
title: Track D close — @hauska/document-viewer
date: 2026-07-01
agent: cc-agent-C
track: D
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 212
merge_commit: 8394d54
---

# Track D close — @hauska/document-viewer

Status COMPLETE. The document viewer package shipped, the DocumentViewerTile is registered in the cortex workspace, migration 0048 is applied to the live Neon, and the deployed revision is serving 100% of production traffic with health 200. Track F (AI annotation pipeline) is unblocked: the `engagement_annotations` table is live.

## Deployed revision

`cortex-api-00267-zol` (tagged `canary`, then shifted to 100%), built from main tip `c3c2725`. Prior/rollback revision: `cortex-api-00265-nub`. Service `cortex-api`, project smartcity-os (us-central1), URL https://cortex-api-tds7av26va-uc.a.run.app.

## What shipped

- PDFViewer: yes (pdfjs-dist, worker via import.meta.url, stale-render cancellation)
- PageControls: yes (page nav + zoom clamp 0.5-4x)
- VersionPicker: yes (submission-chain tabs)
- AnnotationLayer: yes (SVG overlay, normalized bbox draw gestures -> onAdd, clickable callouts)
- MarkupTools / MarkupToolbar: yes (pen/shape/text/stamp)
- DWGViewer: AUTH-001 fallback (see APS outcome below)
- BFF annotation routes (GET/POST/DELETE /engagements/:id/annotations): yes
- BFF GET /engagements/:id/documents (signed viewable GCS urls): yes
- BFF POST /engagements/:id/export (pdf-lib annotated PDF -> presigned url): yes
- BFF GET /engagements/:id/aps-viewer-token + POST /engagements/:id/dwg-convert: yes (named 501 fallbacks)
- DocumentViewerTile in Plan Review preset: yes (also added to Design Accelerator; additive, no existing tiles dropped)
- Export route: yes (always returns a downloadable url, cover-only if no loadable PDFs)
- Annotations migration applied: yes (see below)

The DocumentViewerTile is app-resident in codex-reviewer-qa (Track C's "Option-3 app-resident tile" pattern), consuming `@hauska/document-viewer` plus the app's engagement context and BFF client. `@hauska/document-viewer` builds as a standalone package.

## APS outcome — AUTH-001 fallback (LibreOffice path deferred)

No APS credentials exist anywhere in the repo (no APS_CLIENT_ID / APS_CLIENT_SECRET / autodesk / forge references in code or workflows). Per the AUTH-001 caveat (a fresh APS app 403s on account-entitlement, not an app/secret bug), APS was not chased. DWGViewer renders a named "3D / DWG viewing requires APS credentials (not configured)" fallback. The `aps-viewer-token` route is wired to POST Autodesk auth v2 (Basic auth + client_credentials + urlencoded body) and returns a named 501 `aps_not_configured` when the env vars are absent, so it lights up the moment creds are provisioned; a 403 there would be flagged in a code comment as account-entitlement, not app.

The specified LibreOffice DWG->PDF fallback (`soffice --headless --convert-to pdf`) is deferred, not built: soffice is not in the Cloud Run runtime image (the image has poppler-utils/pdftoppm, not LibreOffice) and DWG import needs the LibreOffice DWG filter. The `dwg-convert` route returns a named 501 `dwg_conversion_unavailable` with a code comment marking the wiring point. Adding LibreOffice (~1GB) to the image was judged out of proportion for a track the dispatch said must not block; flagged here for a later image decision.

## Annotation DB table

Migration `0048_engagement_annotations.sql`. Engagement-scoped unified 2D/3D annotation model: `engagement_annotations (id, engagement_id FK->engagements ON DELETE CASCADE, author, kind, finding_id FK->findings ON DELETE SET NULL, confidence jsonb, location2d jsonb, location3d jsonb, created_at)` + `idx_annotations_engagement`. Drizzle schema `engagementAnnotations.ts` + barrel export; `schema.sql.template`, the schema.integration test list, and `TRUNCATE_TABLES` all updated. Distinct from the pre-existing submission-scoped `reviewer_annotations` (not touched).

Applied to live Neon: YES. Verbatim from the run-migrations job (run 28565289782, action=run-migrations):

```
migrate-prod: connected to ***ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb
migrate-prod: 48 migration file(s) in lib/db/drizzle/
migrate-prod: 47 migration(s) already tracked as applied

migrate-prod: pending migrations:
  0048_engagement_annotations.sql
...
  0048_engagement_annotations.sql  (2026-07-02T04:25:21.256Z)

migrate-prod: done.
```

0048 was the sole pending migration; it applied and is now tracked. Job concluded success.

## Deploy health

`GET https://cortex-api-tds7av26va-uc.a.run.app/api/healthz -> HTTP 200` (CI shift-traffic smoke probe, run 28565405036, and an independent probe). New routes confirmed live on the deployed revision by independent probe against production: `GET .../annotations -> 200` (route resolves, empty list); `GET .../documents` and `.../aps-viewer-token -> 404 engagement_not_found` for a non-existent test engagement (the engagement-existence guard firing, i.e. the route is mounted and executing, not missing).

Note on the deploy path: the canary sequence (deploy-canary -> run-migrations -> smoke -> shift-traffic) for the `c3c2725` image — which contains BOTH Track C's package migration/docker fix (#211, #213) AND Track D (#212) — was executed and completed while Track D's close was being finalized. The image built from Track D's own merge commit (8394d54) failed to build because Track C's package migration required a vite `resolve.conditions: ["workspace"]` fix that landed just after in #213; the `c3c2725` image (with that fix) built and deployed cleanly and carries all Track D code.

## Verification discipline

Each of the four phases went through a build sub-agent + an independent adversarial review sub-agent. The Phase 2 reviewer stood up a real Postgres 18 and caught a genuine CI-breaker (the `idx_annotations_engagement` block was in the wrong pg_dump sort position in `schema.sql.template`); it was fixed and re-confirmed with a real `check-fixture-drift.sh` round-trip (exit 0, zero diff). The final reviewer confirmed the three mandatory acceptance checks by complete end-to-end code trace + green builds:
- PDF renders page 1 on an engagement with uploaded docs: VERIFIED-BY-CODE-TRACE (documents route signs the blob ref -> tile passes signed url to PDFViewer at page 1 -> pdfjs renders).
- User markup saves to the DB: VERIFIED-BY-CODE-TRACE (AnnotationLayer gesture -> onAdd -> POST -> db.insert(engagementAnnotations)); the table is now live in prod and the GET route returns 200.
- Export route returns a downloadable url: VERIFIED-BY-CODE-TRACE (always builds a cover page, uploads bytes via uploadObjectEntityFromBuffer, returns signed { url }).
Live browser render / real DB insert / real GCS upload were not exercisable in-environment; not overclaimed.

## Concurrent-sibling handling (Track C)

Track C (#211) merged to main first and migrated the tile bodies + shell into `@hauska/*` packages, rewrote `tiles.tsx`, and moved `useEngagement`/`TileStatusBanner` into `@hauska/tile-shell`. Track D was rebased onto that: the `tiles.tsx` conflict was resolved by taking Track C's expanded TileDef registry and adding the document-viewer entry in the new multi-line shape (requires: engagementId+uploadedDocuments, produces: annotations); the tile's imports were repointed to `@hauska/tile-shell`. Independently, both tracks converged on the same `workspace` export condition solution — Track D added it to `@hauska/document-viewer`, which Track C's #213 vite fix (`resolve.conditions: ["workspace"]`) then covered for free. Post-rebase full typecheck, all package builds, and the app vite build were green from a clean no-dist state before the force-push; PR merged with all three CI checks (Typecheck, Test, Rubric) green.

## PR + merge status

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/212
- Merge: squash-merged to main, merge commit `8394d54`, branch `track-d/document-viewer` deleted. CI green (Typecheck, Test incl DB-backed integration + fixture drift, Rubric unit tests). Main verified to contain the merge and all Track D content.

## Unblocks

Track F (AI annotation pipeline) can begin — `@hauska/document-viewer` viewer + annotation layer and the live `engagement_annotations` table are the two dependencies, both shipped.

## Known gaps

- APS/DWG 3D viewing is a named fallback until APS credentials + account entitlement are provisioned; the LibreOffice DWG->PDF server path is deferred pending an image decision (soffice not in the Cloud Run image).
- Submissions and attached_documents have no FK link in the current schema, so the VersionPicker is a visual submission chain and the viewer shows the engagement's latest signed-url document rather than a per-submission document. Marked in a code comment; a submission->document link is a small follow-up.
- Export renders annotation rectangles onto matched pages and always emits a cover page; richer annotation rendering (callout labels, styling) is a follow-up (Track F populates AI annotations).

## Rollback

Revert merge commit `8394d54` on main. For the running service, roll traffic back to prior revision `cortex-api-00265-nub` via the deploy workflow's `rollback` action. Migration 0048 is additive (new table + index, no data change to existing tables) and safe to leave in place on rollback.
