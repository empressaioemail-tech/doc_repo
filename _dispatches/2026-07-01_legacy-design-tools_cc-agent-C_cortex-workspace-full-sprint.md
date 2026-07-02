---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_cortex-workspace-full-sprint
title: Cortex workspace — full report tile sprint to functional baseline
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
supersedes: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_cortex-workspace-qa-build
---

# Cortex workspace — full report tile sprint to functional baseline

**Supersedes** the earlier QA build dispatch. This is the complete version.

You are the orchestrating agent. Spawn sub-agents per phase. Every PR gets an adversarial review sub-agent before merge. Phases deploy in order — do not start the next phase until the prior deploy is verified live. You create, review, merge, and deploy end to end. File a close report when done.

## Success definition

Nick opens `localhost:19592/codex-reviewer-qa/`, switches to any preset, and every tile marked `live` or `partial` in the spec shows real data or an honest degraded banner with a named reason. Grid fills the container and distributes tiles correctly. Map tile loads the real hauska-map iframe — not OSM, not a blank image. Letter drafts from findings. All Property Intel and Design Accelerator tiles have full UI and fire real BFF calls. Custom spaces can be saved and deleted.

## Key files

```
artifacts/codex-reviewer-qa/
  src/tile-shell/
    CortexShell.tsx
    tiles.tsx                          # TILE_REGISTRY — add/update entries here
    layouts.ts                         # LAYOUTS map
    components/GridCanvas.tsx          # CSS grid + ResizeHandle
    components/SpaceBar.tsx            # Preset pills + save/delete
  src/tiles/                           # Individual tile components
  src/lib/devSession.ts                # Sets audience="internal" cookie
  .env.local                           # VITE_HAUSKA_MAP_URL

artifacts/api-server/src/routes/
  planReviewBff.ts                     # All BFF routes at /api/plan-review/*
artifacts/api-server/src/lib/
  engagementOwnership.ts               # loadReviewerBffEngagement()
```

## Deploy sequence (run after every phase that touches the backend)

```powershell
# Build triggers automatically on push to main — wait for it.
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=deploy-canary
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=run-migrations
# Get canary tag from deploy-canary output, then:
curl.exe -sI https://<canary-tag>---cortex-api-tds7av26va-uc.a.run.app/api/healthz
# Expected: HTTP/2 200 {"status":"ok"}
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=shift-traffic
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/healthz
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/queue
```

Current live revision: `cortex-api-00254-tad`. Rollback: add `-f action=rollback -f rollback_revision=cortex-api-00254-tad`.

---

## Phase 0 — Audit and revert (no new features; fix regressions first)

Spawn one audit sub-agent. Read every file touched by any recent agent work before proceeding. Do not skip this step — a prior agent made changes that need to be verified or reverted.

### 0A — Map tile revert

**The problem.** A prior agent changed the Map tile to fall back to an OpenStreetMap embed when `VITE_HAUSKA_MAP_URL` is not set. This is wrong. The Map tile must embed the hauska-map command center via iframe. OSM is not a substitute — it has none of the layer registry, parcel drill-through, floating window FSM, or reasoning layer paints that hauska-map provides.

**The fix.** Find the map tile component (likely `artifacts/codex-reviewer-qa/src/tiles/map/MapTile.tsx` or inside `Site Analysis/map.tsx` based on what the prior agent touched). Restore it to a pure iframe:

```tsx
const src = import.meta.env.VITE_HAUSKA_MAP_URL ?? "https://map.hauska.io/command-center"

return (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    {!import.meta.env.VITE_HAUSKA_MAP_URL && (
      <div style={{ padding: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
        Set VITE_HAUSKA_MAP_URL in .env.local to use the local hauska-map.
      </div>
    )}
    <iframe
      src={src}
      style={{ flex: 1, border: "none", width: "100%" }}
      title="Hauska Map"
    />
  </div>
)
```

No OSM. No MapLibre direct. No reimplementation. The floating window behavior, layer registry, and parcel drill-through live in hauska-map — they are not rebuilt here.

When an engagement is selected, send a postMessage to the iframe:
```ts
iframeRef.current?.contentWindow?.postMessage({ type: "SET_PARCEL", apn: engagement.apn }, "*")
```

### 0B — Intake tile audit

The prior agent changed the upload flow from browser PUT to GCS presigned URL to server-side multipart (`POST /api/engagements/:id/attached-documents`). Read the current state of `IntakeTile.tsx` and `planReviewBff.ts`. If the create-engagement + document upload flow works end to end (create engagement → upload file → engagement appears in queue), keep it. If it is broken or incomplete, fix it. Do not rewrite it from scratch unless it is fundamentally broken.

### 0C — Wave 1 in-flight PR

Check `gh pr list --repo empressaioemail-tech/legacy-design-tools`. There should be an open PR fixing: map tile iframe URL, confidence NaN% display, save-space localStorage. If it exists, do an adversarial review and merge it now as part of Phase 0. If it was already merged, skip.

### 0D — Deploy Phase 0

After all reverts and merges, run the deploy sequence. Verify the queue still returns rows. This is your baseline.

---

## Phase 1 — Grid, drag, and workspace delete (frontend only)

Spawn one build sub-agent, one adversarial review sub-agent. Merge on green. **No deploy needed** — accumulate into Phase 2 deploy since there are no backend changes.

### 1A — Grid layout

File: `artifacts/codex-reviewer-qa/src/tile-shell/components/GridCanvas.tsx`

Tiles stack at the top of the grid instead of distributing across available height.

Fix: the grid wrapper must have `height: 100%` (or `flex: 1` inside a flex column parent) and `align-content: stretch`. Rows must expand to fill the container, not collapse to content height. Verify `grid-template-rows` is derived from the layout and the container fills the viewport minus the SpaceBar height.

Also verify the `"/"` separator handling in LAYOUTS. The LAYOUTS strings use `"/"` as a row separator shorthand. `GridCanvas` must strip this when setting `gridTemplateAreas` — CSS `grid-template-areas` uses only quoted row strings, not `/`. If the conversion is wrong the entire grid breaks silently.

### 1B — Resize handle

File: same — `GridCanvas.tsx`

Problem: `ResizeHandle` is positioned at `50%` in the grid container, not at the actual cell boundary.

Fix: compute handle position from the live `colFr`/`rowFr` state:
```ts
const handleLeft = `${(colFr[0] / (colFr[0] + colFr[1])) * 100}%`
```
Apply as `left` CSS on the vertical handle element. Update on every state change.

Drag fix: on `mousemove`, compute ratio from mouse position relative to the grid container bounding rect:
```ts
const ratio = (e.clientX - containerRect.left) / containerRect.width
setColFr([ratio * totalFr, (1 - ratio) * totalFr])
```
This eliminates the glitch where the handle jumps to 50% on drag start.

### 1C — Delete workspace

File: SpaceBar component

Add an `×` icon button to each saved custom space chip. Built-in preset chips do not get the delete button. On click: remove the entry from `localStorage` key `cortex-workspace-spaces` and re-render. No confirmation prompt.

### Adversarial review — Phase 1

Confirm:
- 4-tile preset fills the full grid height, no stacking at top
- Resize handle sits at the colFr boundary before any drag
- Drag updates grid cleanly with no jump
- Delete appears only on custom saved spaces, not built-in presets
- No regression on tile open/close/fullscreen

---

## Phase 2 — L3 route fix + Letter tile (backend + frontend)

Spawn two parallel build sub-agents (letter tile and L3 fix). One adversarial review sub-agent over both diffs. Merge both PRs. Deploy.

### 2A — L3 route scoping

File: `artifacts/api-server/src/lib/engagementOwnership.ts` and any L3 engagement routes.

Problem: Compliance Run and Site Analysis tiles fetch sub-resources via routes that still apply `engagementOwnerWhere`. Internal sessions (audience = "internal") get empty results.

Fix: in the ownership predicate or the middleware that applies it, check `req.session.audience`. If `audience === "internal"`, return a no-op predicate (no owner filter). Apply to all engagement sub-routes (`/api/engagements/:id/*`) not already on the reviewer BFF path.

Verify: after this fix, clicking a queue row must populate Compliance Run's submission dropdown with real submissions.

### 2B — Letter tile

Check `planReviewBff.ts` first. Routes `GET /api/plan-review/engagements/:id/letter` and `POST /api/plan-review/engagements/:id/letter/generate` may already exist. If stubs or missing, implement:

```
GET  /api/plan-review/engagements/:id/letter
  Returns: { draft: string | null, generatedAt: string | null }
  Auth: reviewer bypass (loadReviewerBffEngagement)

POST /api/plan-review/engagements/:id/letter/generate
  Triggers letter generation from accepted findings on the latest submission.
  Returns: { draft: string }
  Auth: reviewer bypass
  Logic: fetch accepted findings → compose via existing LLM path (check for any existing letter/deliverable generation in cortex-api; if none, use the briefing LLM path as a template with a letter-composition system prompt)
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/letter/LetterTile.tsx`:
- No engagement: "Select a case first."
- Engagement, no draft: count of accepted findings + "Draft comment letter" button.
- Draft present: editable textarea with draft, "Regenerate" button, "Copy" button, "Download .txt" button.
- While generating: spinner, button disabled.

Register in TILE_REGISTRY. It is already in the Plan Review preset.

### Adversarial review — Phase 2

Confirm:
- Internal session gets real submissions in Compliance Run after L3 fix
- Letter generates from actual accepted findings, not placeholder text
- Copy and download work
- Regenerate replaces the draft
- Empty and loading states render correctly

Deploy. Verify queue and letter route on live endpoint.

---

## Phase 3 — Property Intel preset (Property Brief, Hazard Profile, Encumbrance Report)

These three tiles are listed as `live` in the spec but currently show as stubs. The backend capabilities exist — the tiles just need UI and BFF wiring.

**Audit first.** Before building any tile, spawn an audit sub-agent to read `planReviewBff.ts` and the broader api-server routes for property brief, hazard, and encumbrance endpoints. Also check what engine-api routes exist for these. Report what exists so the build sub-agent knows what to wire vs what to create.

Then spawn one build sub-agent for all three tiles, one adversarial review sub-agent. Deploy.

### 3A — Property Brief tile

BFF route (create if missing):
```
POST /api/plan-review/engagements/:id/reports/property-brief/run
  Calls the existing property brief engine (same endpoint the investor radar uses)
  Stores result against the engagement
  Returns: { jobId } or inline result

GET  /api/plan-review/engagements/:id/reports/property-brief
  Returns: stored brief result or null
  Auth: reviewer bypass
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/property-intel/PropertyBriefTile.tsx`:
- Reads `engagementId` from the engagement engine context.
- "Run property brief" button → POST → poll or stream result.
- Display: cited cards for site-context, parcel, code summary, hazard flags, market comps. Collapsible JSON inspector. Confidence badge per section.
- Status: `live`.

### 3B — Hazard Profile tile

BFF route:
```
POST /api/plan-review/engagements/:id/reports/hazard/run
GET  /api/plan-review/engagements/:id/reports/hazard
  Returns FEMA flood zone, fire/wind/hail/quake perils, insurance estimate
  Auth: reviewer bypass
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/property-intel/HazardProfileTile.tsx`:
- "Run hazard profile" button.
- Display: hazard flags as a table (peril, level, source, confidence). FEMA flood zone label. Insurance estimate if available.
- Status: `live`.
- If Cotality quota is exhausted (429), show degraded banner "Hazard data quota exhausted — demo keys expire ~2026-07-06."

### 3C — Encumbrance Report tile

BFF route:
```
POST /api/plan-review/engagements/:id/reports/encumbrances/run
GET  /api/plan-review/engagements/:id/reports/encumbrances
  Returns: liens, deed restrictions, CC&Rs, special district membership
  Source: Cotality encumbrance atoms + existing encumbrance engine
  Auth: reviewer bypass
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/property-intel/EncumbranceTile.tsx`:
- "Run encumbrance report" button.
- Display: list of encumbrances, each with type, description, source citation, confidence.
- Status: `live`.

### Adversarial review — Phase 3

Confirm:
- All three tiles read `engagementId` from context (not hardcoded)
- BFF routes use reviewer bypass (no owner filter)
- Results display with source citations, not bare text
- If the underlying engine call fails, the tile shows a named error (e.g. "Engine unreachable" or "Cotality quota exhausted"), not a silent empty state
- Tile status badges are correct in TILE_REGISTRY

Deploy. Verify all three BFF GET routes return valid shapes on live endpoint.

---

## Phase 4 — Design Accelerator preset (Sheet Extraction, Response Tasks)

Same pattern as Phase 3. Audit first, then build.

**Audit first.** Spawn an audit sub-agent. Read `planReviewBff.ts` and api-server for sheet extraction and response tasks endpoints. These are listed as `live` in the spec. Find where they live in the backend.

Then spawn one build sub-agent, one adversarial review sub-agent. Deploy.

### 4A — Sheet Extraction tile

BFF route (check if it already exists under `/api/engagements/:id/sheets` or similar):
```
GET  /api/plan-review/engagements/:id/sheets
  Returns: list of extracted sheets { sheetId, label, pageNumber, thumbnailUrl? }
  Auth: reviewer bypass

POST /api/plan-review/engagements/:id/sheets/extract
  Triggers extraction on the latest uploaded document
  Auth: reviewer bypass
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/design-accelerator/SheetExtractionTile.tsx`:
- "Extract sheets" button if no sheets yet.
- When sheets exist: list of sheet cards (label, page number, thumbnail if available). Each card is selectable. Selected sheet ID is shared via the engagement engine so other tiles can reference it.
- Status: `live`.

### 4B — Response Tasks tile

BFF route:
```
GET  /api/plan-review/engagements/:id/response-tasks
  Returns: list of action items generated from compliance run findings
  { taskId, description, codeSection, assignee?, status }
  Auth: reviewer bypass
```

Tile at `artifacts/codex-reviewer-qa/src/tiles/design-accelerator/ResponseTasksTile.tsx`:
- If no tasks: "Run compliance review first to generate response tasks."
- Tasks list: each task shows description, code section citation, status (open/in-progress/resolved). Status is togglable.
- Status: `live`.

### Adversarial review — Phase 4

Confirm:
- Sheet extraction tile shows actual extracted sheets, not mock data
- Response tasks derive from real compliance findings on the selected engagement
- Both tiles handle "no data yet" state with actionable messages
- No owner-filter regression on the new BFF routes

Deploy. Final live endpoint verification:
```powershell
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/queue
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/engagements/<real-id>/sheets
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/engagements/<real-id>/response-tasks
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/engagements/<real-id>/letter
```

---

## Final close checklist

Before filing the report, verify locally at `localhost:19592/codex-reviewer-qa/`:

**Shell:**
- [ ] Grid fills container height in all presets — no stacking at top
- [ ] Resize handle sits at actual cell boundary before drag
- [ ] Drag updates grid with no glitch
- [ ] Confidence values show as % or "—" (no NaN%)
- [ ] Save space → name prompt → chip in SpaceBar
- [ ] Delete (×) on saved chip → removed from SpaceBar and localStorage

**Plan Review preset:**
- [ ] Queue shows all engagements (31+)
- [ ] Click row → Compliance Run loads with real submissions
- [ ] Map tile loads hauska-map iframe (not OSM, not blank)
- [ ] Intake tile: create new engagement with PDF upload → appears in queue
- [ ] Letter tile: drafts from accepted findings, textarea editable, copy works

**Site Analysis preset:**
- [ ] Topography: "Run topography" triggers and returns result (or honest error)
- [ ] Drainage: same
- [ ] Hydrology: degraded banner "pysheds not installed in Cloud Run worker" — expected, do not fix
- [ ] Stormwater/Detention: "Planned" stub — expected

**Property Intel preset:**
- [ ] Property Brief: runs and returns cited result or named error
- [ ] Hazard Profile: runs and returns hazard flags or named Cotality quota error
- [ ] Encumbrance Report: runs and returns encumbrance list or named error
- [ ] Map tile: same iframe behavior as Plan Review

**Design Accelerator preset:**
- [ ] Sheet Extraction: extracts sheets from an engagement with uploaded docs
- [ ] Response Tasks: shows tasks derived from compliance findings
- [ ] Map tile: same

---

## Final report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_cortex-workspace-full-sprint-close.md`:

```markdown
---
title: Cortex workspace full sprint close — cc-agent-C
date: 2026-07-01
agent: cc-agent-C
status: complete
---

## Deployed revision
<revision name>

## What shipped (by phase)
<one line per phase>

## Verification results
<paste the checklist above with actual outcomes — pass/fail per item>

## Tiles deferred or degraded
<anything not reached, with reason>

## Rollback handle
<prior revision>
```

Do not summarize reasoning. Paste raw curl outputs for health and route checks.
