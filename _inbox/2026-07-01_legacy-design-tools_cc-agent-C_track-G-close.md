---
title: Track G close — print/export deliverable PDF
date: 2026-07-01
agent: cc-agent-C
track: G
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 218
merge_commit: 44d1ef0d
---

# Track G close — print/export deliverable PDF

Status COMPLETE. The Track D export STUB is replaced with the full `assembleDeliverable` pipeline. The export route builds a four-section annotated deliverable PDF via pdf-lib, uploads it to GCS, and returns a 24h presigned URL. Phase 2 UX polish shipped in the same PR: browser download (not a new tab), a SpaceBar Export action, and a Print View preset. Deployed to cortex-api via the canary sequence and serving 100% of production traffic with health 200. This is the final track of the Shared Surface sprint.

## Deliverable sections implemented

New lib `artifacts/api-server/src/lib/assembleDeliverable.ts` (storage- and DB-free; source PDF bytes injected via `fetchSourcePdfBytes`, rows passed as narrow local interfaces, so it is unit-testable). Four sections in order:

1. Title page (US Letter 612x792) — dark header brand bar, REVIEW DELIVERABLE heading, the EXACT verbatim brand string `Powered by Hauska Engine — hauska.dev` (em dash U+2014, exact casing; placed twice — header sub-line and footer), engagement metadata (Case/Name, Address, Jurisdiction, Applicant, Export Date, all null-guarded), and a fail/pass finding-count summary line.
2. Annotated plan pages — every page of every loadable source PDF copied in order into a flat page array (`PDFDocument.load(bytes,{ignoreEncryption:true})` + `copyPages`; non-PDF/corrupt docs skipped, never crash). Each annotation carrying a `location2d` is drawn as a numbered red-circle callout plus a red bbox outline on the CORRECT page via `copiedPages[location2d.page - 1]` (page is 1-indexed against source pages; title page does not consume a slot). Normalized 0-1 bbox converted to pdf-lib bottom-left coords with the y-axis flipped. Out-of-range pages clamped; every draw guarded.
3. Findings summary — one row per finding: callout number in brackets (matched to the annotation by `findingId`), a code-section label (first `kind:'code-section'` citation atomId, else category), severity, a color-coded FAIL/PASS marker, and word-wrapped body text. Real multi-page overflow (new page when y drops below the bottom margin).
4. Review letter — the in-memory letter draft (`planReviewLetterDrafts.get(engagementId)`), word-wrapped across as many pages as needed. Rendered ONLY when a non-empty draft exists.

Route (`POST /api/plan-review/engagements/:id/export`, `requireServiceTokenOrSession`): loads submission ids for the engagement, then findings via `inArray(findings.submissionId, submissionIds)` (findings carry no engagementId), plus attached documents and `location2d`-bearing annotations, plus the in-memory letter. Builds an `/objects/`-guarded `fetchSourcePdfBytes` closure over `getObjectEntityBytes`, calls `assembleDeliverable`, uploads via `uploadObjectEntityFromBuffer`, presigns via `signObjectEntityGetUrl(path, 60*60*24)` (24h, changed from the stub's 3600), returns `{url}`.

Determination rule (documented in code): a finding is FAIL-style (red) when severity is `blocker` or `concern` AND status is not `accepted`/`rejected`; `advisory` severity or a reviewer disposition renders PASS-style (green).

## Export tested (the four acceptance checks)

Verified by a build sub-agent plus an independent adversarial review sub-agent (verdict PASS). Because live GCS and a live browser are not exercisable in-environment, the reviewer ran real runtime tests against the assembler code (synthetic PDFs built in-memory with pdf-lib) and code-traced the storage leg. Evidence:

- Title page renders: yes. Brand string byte-verified as U+2014 (em dash), exact casing; the 10-page runtime test exercised the title page without throwing (StandardFonts.Helvetica / WinAnsi encodes U+2014).
- Annotated plan pages: yes. Callouts appeared on the CORRECT pages: yes — verified at runtime by spying pdf-lib `drawCircle`/`save` to recover which page object each callout was drawn on: source page 3 -> output index 3, source page 7 -> output index 7 (title-offset correctly applied, distinct page objects). Not merely an array-subscript assertion.
- Findings summary: yes. Multi-page overflow proven (60 long-text findings -> 12 pages, no crash, no hang). Renders for both FAIL and PASS.
- Letter page: yes if present, absent if not. Page-count delta: withLetter=5, noLetter=4, whitespace-only draft=4 (the `draft.trim().length > 0` guard suppresses an empty letter page).
- Download triggered (not new tab): yes. `DocumentViewerTile` export and the SpaceBar export both create an `<a download>` element and click it.

Edge cases confirmed no-crash at runtime: zero documents, zero findings, zero annotations, garbage/non-PDF byte buffer, and an annotation whose page exceeds the copied-page count (clamped/skipped).

## Performance

- Export time for a 10-page plan (10 findings + 10 annotations + letter): 23ms measured. Well under the 15s bound.
- 30-page plan: 39ms, no throw.

## GCS presigned URL

- Valid and downloadable: VERIFIED-BY-CODE-TRACE. Live GCS is not reachable in-env, so the round-trip was not exercised end-to-end. Code trace confirms the assembled bytes are uploaded via `uploadObjectEntityFromBuffer` and the returned `{url}` is a presign of that object path.
- Expiry: 24h (`60*60*24` seconds), confirmed at the call site (overrides the helper's 600s default; not the list-route's 3600).

## SpaceBar export button

- Added: yes. Threaded from the app through `@hauska/tile-shell` via a new optional `onExportEngagement(engagementId)` prop on `CortexShell` -> `CortexShellInner` -> `SpaceBar`. The package stays app-lib-free (no BFF-client import); the app (`AppCortexShell`) supplies the actual `exportEngagementPdf` call plus the browser download. The button renders only when an engagement is selected and the callback is provided; it shows an in-flight "Exporting…" state.

## Print View preset

- Added: yes. `{ id: "print", label: "Print View", tiles: ["compliance-run", "letter"], layoutId: "2h" }` in the app presets — findings + letter, no map.

## Build / verification

- api-server: `tsc -p tsconfig.json --noEmit` exit 0; `node ./build.mjs` (esbuild) -> `dist/index.mjs` Done, exit 0; `vitest run assembleDeliverable.test.ts` 13/13 pass. esbuild conditions untouched (`["workspace"]`).
- `@hauska/tile-shell`: tsup build success (CJS 38.69KB, ESM 34.87KB, DTS ok).
- app (`@workspace/codex-reviewer-qa`): typecheck exit 0; vite build 154 modules transformed, built in 1.28s (only the pre-existing >500kB chunk advisory, same as Track F).
- PR CI: Typecheck pass (1m56s), Test pass (7m11s, incl. DB-backed integration + schema fixture-drift).

## PR + merge

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/218
- Merge: squash-merged to main, merge commit `44d1ef0d`, branch `track-g/print-export` deleted. origin/main confirmed to contain the merge (tip `44d1ef0d`). Based cleanly on the Track F tip `0542f581` (origin/main did not advance during the track — no rebase needed).

## Deployed revision + health

- Revision: `cortex-api-00275-hij` (canary tag, then shifted to 100%), built from merge SHA `44d1ef0daa5b042d7b672081952843774e361d5d`. Service `cortex-api`, project smartcity-os (us-central1), URL https://cortex-api-tds7av26va-uc.a.run.app. Prior/rollback revision: `cortex-api-00273-kid` (Track F).
- Canary sequence executed as four separate operator dispatches: deploy-canary (run 28572629474) -> run-migrations (run 28572750223) -> canary smoke -> shift-traffic (run 28572859783).
- run-migrations: `48 migration file(s), 48 already tracked as applied, pending: (none)` — Track G added NO migration (reuses the existing tables), live Neon unchanged and at head.
- Canary smoke BEFORE shift: `GET https://canary---cortex-api-tds7av26va-uc.a.run.app/api/healthz -> HTTP 200 {"status":"ok"}`.
- Post-shift production smoke (CI shift-traffic job): `GET https://cortex-api-tds7av26va-uc.a.run.app/api/healthz -> HTTP 200`. Independent post-shift probe: `healthz -> HTTP 200 {"status":"ok"}`.
- Traffic: `100% cortex-api-00275-hij` confirmed in the shift-traffic job output.

## Known gaps / notes

- Anonymous cross-route probe: an unauthenticated POST to `/export` (and GET `/annotations`, GET `/documents`, POST `/letter/generate`) returns HTTP 500 with an empty body for a non-existent engagement id, rather than the expected 404 `engagement_not_found`. This is NOT a Track G regression — the identical 500 appears on the already-shipped Track D/F routes (`annotations`, `documents`), so it is a pre-existing session/anonymous-owner behavior of the plan-review BFF for that probe shape, not introduced here. The route is mounted and executing (it returns a response, not a route-missing 404). Load-bearing export verification came from the reviewer's runtime tests against the assembler plus green CI, not from this probe.
- Submissions and attached_documents still have no FK link (Track D/F limitation), so the annotated plan pages copy every attached PDF in `createdAt` order and `location2d.page` indexes against that combined page sequence; per-submission document selection is a follow-up when the submission<->document link lands.
- Richer callout styling (leader lines, label text next to the circle) is a possible follow-up; v1 draws a numbered red circle + bbox outline, with the label carried in the findings summary row.

## Sprint complete

All seven tracks (A-G) closed. Shared Surface sprint is done.
