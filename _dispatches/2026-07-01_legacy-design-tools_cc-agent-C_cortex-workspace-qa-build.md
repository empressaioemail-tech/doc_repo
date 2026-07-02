---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_cortex-workspace-qa-build
title: Cortex workspace — QA build-out to functional baseline
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
---

# Cortex workspace — QA build-out to functional baseline

You are the orchestrating agent. Spawn sub-agents per wave. Every PR gets an adversarial review sub-agent before merge. Every wave deploys before the next starts. You create, review, merge, and deploy. File a close report when done.

## Success definition

Nick can sit down, open `localhost:19592/codex-reviewer-qa/`, create a new intake from uploaded documents, run every live function from the tile workspace, and see real results or honest degraded banners. Custom spaces can be saved and deleted. Grid lays out correctly regardless of tile count. Map tile loads the real map. Letter tile is fully functional.

## Repo layout you need

```
artifacts/codex-reviewer-qa/          # Vite frontend (the tile workspace)
  src/tile-shell/
    CortexShell.tsx                   # Shell root
    tiles.tsx                         # TILE_REGISTRY
    layouts.ts                        # LAYOUTS map
    components/GridCanvas.tsx         # CSS grid + ResizeHandle
    components/TileWrapper.tsx        # Tile chrome
  src/tiles/                          # Individual tile components
  src/lib/devSession.ts               # Sets audience="internal" cookie
  .env.local                          # VITE_HAUSKA_MAP_URL (local dev)

artifacts/api-server/src/routes/
  planReviewBff.ts                    # All BFF routes at /api/plan-review/*
artifacts/api-server/src/lib/
  engagementOwnership.ts              # loadReviewerBffEngagement() + loadEngagementForSession()
```

## Deploy sequence (memorize this — you run it after every wave)

```powershell
# 1 — build is automatic on push to main. Wait for build-and-push to complete.
# 2 — canary (no traffic)
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=deploy-canary
# 3 — migrations
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=run-migrations
# 4 — smoke (get canary tag from deploy-canary output)
curl.exe -sI https://<canary-tag>---cortex-api-tds7av26va-uc.a.run.app/api/healthz
# Expected: HTTP/2 200
# 5 — shift traffic
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=shift-traffic
# 6 — verify
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/healthz
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/queue
```

Current live revision: `cortex-api-00254-tad`. Rollback target if a wave breaks prod: `--to-revisions cortex-api-00254-tad=100`.

## Wave 0 — prerequisite

Check `gh pr list --repo empressaioemail-tech/legacy-design-tools`. There is an in-flight PR bundling three fixes: map tile iframe URL (`VITE_HAUSKA_MAP_URL` fallback), confidence NaN% display guard, and save-space localStorage wiring. If that PR is not yet merged, merge it now. Then run the deploy sequence. Verify the canary URL returns 200 before shifting traffic. Do not start Wave 1 until this deploy is live.

If the PR is already merged and deployed, skip straight to Wave 1.

## Wave 1 — Grid, drag, and workspace delete (frontend only)

Spawn one build sub-agent, then one adversarial review sub-agent. Merge on adversarial green. No separate deploy — accumulate into Wave 2 deploy.

### 1A — Grid layout fix

File: `artifacts/codex-reviewer-qa/src/tile-shell/components/GridCanvas.tsx`

Problem: when a preset has 4 tiles, they stack at the top of the grid instead of distributing across the available space.

Fix: the CSS grid should fill the container height. Ensure the grid wrapper has `height: 100%` (or `flex: 1` if inside a flex column) and `align-content: stretch` so rows expand to fill rather than collapse to content height. Also ensure `grid-template-rows` is derived from the layout definition and fills the container, not auto-sizing to content.

Also fix the `/` separator handling: `layouts.ts` uses `/` as a row separator in the LAYOUTS shorthand. `GridCanvas.tsx` must strip the `/` when setting `gridTemplateAreas` (CSS does not accept `/` in `grid-template-areas`; it uses quoted rows only). Verify this conversion is correct for all LAYOUTS entries.

### 1B — Resize handle positioning fix

File: `artifacts/codex-reviewer-qa/src/tile-shell/components/GridCanvas.tsx`

Problem: `ResizeHandle` is positioned at `50%` in the grid container, not at the actual cell boundary.

Fix: calculate handle position from the current `colFr` and `rowFr` values at render time. For a 2-column layout with `colFr = [3, 2]`, the vertical resize handle sits at `colFr[0] / (colFr[0] + colFr[1]) * 100%` = `60%`. Apply this as a `left` or `top` CSS value on the handle element. Update on every `colFr`/`rowFr` state change.

Also fix drag tracking: the drag handler should update `colFr`/`rowFr` based on mouse position relative to the grid container, not relative to the handle's starting position. On `mousemove`, compute `const ratio = (e.clientX - containerRect.left) / containerRect.width` and set `colFr = [ratio * totalFr, (1 - ratio) * totalFr]` (normalized to the original total). This eliminates the glitch.

### 1C — Delete workspace

File: `artifacts/codex-reviewer-qa/src/tile-shell/components/SpaceBar.tsx` (or wherever saved spaces are rendered in the SpaceBar)

Add a small delete button (×) to each saved custom space chip (not the built-in presets). On click, remove the entry from `localStorage` key `cortex-workspace-spaces` and re-render the SpaceBar. No confirmation prompt needed.

### Adversarial review — Wave 1

Spawn a separate review sub-agent. Give it the diff. It must confirm:
- Grid fills container height and tiles do not stack at top in a 4-tile layout
- Resize handle position matches colFr ratio before any dragging occurs
- Dragging updates the grid without visual jump or glitch
- Delete button appears only on saved custom spaces, not built-in presets
- No regressions to existing tile open/close/fullscreen behavior

If review finds a defect, fix it before merge. Merge only on green.

## Wave 2 — Plan intake tile + L3 route fix (frontend + backend)

This wave has frontend and backend work. Spawn two parallel build sub-agents (intake tile and L3 fix), then one adversarial review sub-agent over both diffs together. Merge both PRs. Then run the full deploy sequence.

### 2A — Intake tile

This is the most significant piece. Nick has no way to create a new engagement or upload documents inside the workspace. Every report and review function needs an engagement with uploaded plan documents to test against.

**Frontend** — new tile at `artifacts/codex-reviewer-qa/src/tiles/intake/IntakeTile.tsx`:

The tile has two modes: empty state (no engagement selected) shows a create-new form; engaged state (engagement selected from queue) shows the existing engagement's uploads with an option to add more documents.

Create-new form fields: Project name (text), Address (text), Jurisdiction (text, free-form for now). A multi-file upload input accepting `.pdf`, `.png`, `.jpg`, `.jpeg`, `.dwg`, `.dxf`. A "Create and upload" button.

On submit:
1. POST to `POST /api/plan-review/engagements` (new BFF route, see 2B) with `{ name, address, jurisdiction }`. Receive `{ engagementId }`.
2. For each file, POST to `POST /api/plan-review/engagements/:id/documents/upload-url` (new BFF route, see 2B) with `{ filename, contentType }`. Receive a presigned URL.
3. PUT each file to its presigned URL directly from the browser.
4. After all uploads complete, signal the EngagementProvider to refresh the queue and select the new engagement.

Show a progress indicator per file during upload. Show errors inline. Do not navigate away.

Register the tile in `TILE_REGISTRY` in `tiles.tsx`:
```typescript
{
  id: "intake",
  label: "Intake & Upload",
  category: "Compliance",
  engine: "engagement",
  el: () => <IntakeTile />,
  status: "live"
}
```

Add `"intake"` to the `plan-review` preset's `tileIds` in place of or alongside `"intake-queue"`. The intake tile should coexist with the queue — both show in Plan Review.

**Backend** — two new BFF routes in `artifacts/api-server/src/routes/planReviewBff.ts`:

```
POST /api/plan-review/engagements
  Body: { name: string, address: string, jurisdiction: string }
  Creates a new engagement record in the DB (use the existing engagements table schema)
  Returns: { engagementId: string }
  Auth: reviewer bypass (no owner filter; set owner to the dev reviewer userId for internal sessions)

POST /api/plan-review/engagements/:id/documents/upload-url
  Body: { filename: string, contentType: string }
  Generates a GCS presigned PUT URL for the document
  Returns: { uploadUrl: string, gcsPath: string }
  Auth: reviewer bypass
  GCS bucket: same bucket used by the existing plan document upload flow (check existing presign logic in the codebase)
```

After upload, the document should be retrievable via the existing submission/document fetch routes.

### 2B — L3 route fix

File: `artifacts/api-server/src/lib/engagementOwnership.ts` and the L3 engagement routes (any `GET /api/engagements/:id/*` routes not already on the reviewer BFF path).

Problem: Compliance Run and other tiles fetch sub-resources (findings list, submission detail) via `@workspace/api-client-react` routes that still apply `engagementOwnerWhere`. Anonymous/internal sessions get empty results.

Fix: in the engagement ownership middleware (or wherever `engagementOwnerWhere` is applied), check `req.session.audience`. If `audience === "internal"`, skip the owner filter entirely and return a no-op predicate. This is the same reviewer-posture principle already applied to BFF routes. Apply it to all L3 routes in the engagement namespace.

Verify: after this fix, clicking a queue row should populate the Compliance Run tile's submission dropdown with real submissions from that engagement.

### Adversarial review — Wave 2

One review sub-agent over both diffs. Must confirm:
- Create engagement form posts and receives an engagementId
- File upload presign flow reaches GCS (inspect the route, verify it uses the correct bucket and SA)
- New engagement appears in the queue after creation
- L3 engagement sub-routes return data for an internal session (no empty arrays where real data exists)
- Intake tile renders in Plan Review preset alongside the queue
- No regression on the reviewer BFF routes from Wave 0

Merge on green. Then run the full deploy sequence. Verify queue still returns rows post-deploy.

## Wave 3 — Letter tile

Spawn one build sub-agent, then one adversarial review sub-agent. Merge on green. Run full deploy sequence.

**BFF routes** — check `planReviewBff.ts` first. The routes `GET /api/plan-review/engagements/:id/letter` and `POST /api/plan-review/engagements/:id/letter/generate` may already exist. If they exist, inspect them. If they are stubs or missing, implement:

```
GET  /api/plan-review/engagements/:id/letter
  Returns: { draft: string | null, generatedAt: string | null }
  Auth: reviewer bypass

POST /api/plan-review/engagements/:id/letter/generate
  Triggers letter generation from accepted findings on the latest submission
  Returns: { draft: string }
  Auth: reviewer bypass
  Logic: fetch accepted findings for the engagement's latest submission, compose a comment letter using the LLM path already in the codebase (check for existing letter generation in cortex-api; if none, use the briefing LLM path as a template)
```

**Frontend** — tile at `artifacts/codex-reviewer-qa/src/tiles/letter/LetterTile.tsx`:

- Empty state (no engagement): "Select a case from Intake & Queue to draft a letter."
- Engagement selected, no draft: "N findings ready" (count of accepted findings). "Draft comment letter" button.
- Draft present: editable `<textarea>` with the draft text, pre-populated. "Regenerate" button. "Copy" button (copies to clipboard). "Download .txt" button (triggers browser download).
- While generating: spinner inside the tile, button disabled.

Register in `TILE_REGISTRY`. It is already in the `plan-review` preset `tileIds`.

**Adversarial review — Wave 3**

Confirm:
- Letter generates from real accepted findings (not placeholder text)
- Draft is editable in the textarea
- Copy and download both work
- Regenerate replaces the draft (does not append)
- Empty and loading states render correctly

Merge on green. Deploy. Verify `GET /api/plan-review/engagements/:id/letter` on the live endpoint returns a valid response shape.

## Final verification

After Wave 3 deploys, run this checklist against the live prod URL (`https://cortex-api-tds7av26va-uc.a.run.app`):

```
[ ] /api/healthz → 200 {"status":"ok"}
[ ] /api/plan-review/queue → array of engagements
[ ] /api/plan-review/engagements/<id> → engagement object (use a real id from the queue)
[ ] /api/plan-review/engagements/<id>/letter → { draft, generatedAt }
```

Also verify locally at `localhost:19592/codex-reviewer-qa/`:
```
[ ] Grid fills container height in all presets (no stacking at top)
[ ] Resize handles sit at actual cell boundary
[ ] Drag updates grid without glitch
[ ] Map tile loads (falls back to https://map.hauska.io/command-center if local map not running)
[ ] Confidence values show as percentage or "—" (no NaN%)
[ ] Save space → name prompt → chip appears in SpaceBar
[ ] Delete (×) on saved chip → removed from SpaceBar and localStorage
[ ] Intake tile: fill form + upload a PDF → engagement appears in queue
[ ] Select new engagement → Compliance Run, Topography, Drainage receive context
[ ] Letter tile: draft generates, textarea is editable, copy works
```

## Final report

When all three waves are deployed and the verification checklist above is complete, write a close report at:

```
P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_cortex-workspace-qa-build-close.md
```

Format:

```markdown
---
title: Cortex workspace QA build close — cc-agent-C
date: 2026-07-01
agent: cc-agent-C
status: complete
---

## Deployed revision
<revision name>

## What shipped
<one line per wave>

## Verification results
<paste the checklist with actual outcomes>

## Remaining issues / deferred
<anything that did not make it in or needs a follow-up>

## Rollback handle
<prior revision name>
```

Do not summarize reasoning. Paste raw outputs for health checks and queue verification.
