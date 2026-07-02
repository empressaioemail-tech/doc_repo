---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-F-ai-annotation
title: Track F — AI annotation pipeline
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
track: F
depends_on: Track D close report in _inbox (annotations DB table must exist, PDFViewer must be deployed)
unblocks: Track G (export needs populated annotations)
---

# Track F — AI annotation pipeline

Build the AI annotation pipeline: generate spatial annotations from compliance findings automatically, overlay them on the plan PDF viewer, and wire bidirectional navigation (click annotation callout → scroll to finding card; click finding card → jump to page + highlight annotation).

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` and the Track D close report before starting. Do not start until Track D confirms the `engagement_annotations` table is live.

## Success definition

After a compliance run completes on an engagement with an uploaded PDF, the user can click "Generate AI Annotations" and see numbered annotation callouts appear on the PDF pages at the coordinates of each failing code section. Clicking a callout highlights the corresponding finding in ComplianceRunTile. Clicking a finding card in ComplianceRunTile jumps to the page and flashes the annotation. The annotations persist across sessions (stored in DB).

---

## Phase 1 — vision-to-coordinate pipeline

Spawn one build sub-agent, one adversarial review sub-agent.

### 1A — page rasterization

The API server needs to rasterize individual PDF pages to images for the vision model. Use `pdftoppm` (available via `poppler-utils` — add to the Cloud Run Dockerfile if not present):

```dockerfile
# artifacts/api-server/Dockerfile — add if not present
RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*
```

BFF route for rasterization:

```
POST /api/plan-review/engagements/:id/annotations/rasterize
  Body: { submissionId: string, pages: number[] }
  Returns: { pages: Array<{ page: number; imageBase64: string }> }
  Auth: reviewer bypass
```

Server-side implementation:

```typescript
// src/routes/annotationPipeline.ts

import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'

const execAsync = promisify(exec)

export async function rasterizePdfPage(pdfBuffer: Buffer, page: number): Promise<string> {
  const tmpIn = path.join(tmpdir(), `plan-${Date.now()}.pdf`)
  const tmpOut = path.join(tmpdir(), `plan-${Date.now()}-page`)
  try {
    writeFileSync(tmpIn, pdfBuffer)
    // pdftoppm -r 150 -f <page> -l <page> -png <input> <output-prefix>
    await execAsync(`pdftoppm -r 150 -f ${page} -l ${page} -png ${tmpIn} ${tmpOut}`)
    const imagePath = `${tmpOut}-${String(page).padStart(6, '0')}.png`
    const imageBuffer = readFileSync(imagePath)
    unlinkSync(imagePath)
    return imageBuffer.toString('base64')
  } finally {
    try { unlinkSync(tmpIn) } catch {}
  }
}
```

Fetch the PDF from GCS using the engagement's document URL (internal fetch with service account, not a presigned URL).

### 1B — vision model coordinate extraction

```typescript
// src/routes/annotationPipeline.ts

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function extractAnnotationCoordinates(
  imageBase64: string,
  finding: { findingId: string; codeSection: string; description: string }
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  // Image is 0-1 normalized coordinates — ask the model to identify the location
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: imageBase64 },
        },
        {
          type: 'text',
          text: `This is a construction plan page. Locate the element related to "${finding.codeSection}: ${finding.description}".
          
Return a JSON object with the bounding box in normalized coordinates (0.0 to 1.0):
{ "x": <left>, "y": <top>, "width": <width>, "height": <height> }

If you cannot locate a specific element on this page, return { "notFound": true }.
Return only valid JSON, no other text.`,
        },
      ],
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const parsed = JSON.parse(text.trim())
    if (parsed.notFound) return null
    return parsed
  } catch {
    return null
  }
}
```

### 1C — annotation generation route

```
POST /api/plan-review/engagements/:id/annotations/generate
  Body: { submissionId: string }
  Async — queues generation, returns immediately
  Returns: { jobId: string }

GET /api/plan-review/engagements/:id/annotations/generate/:jobId
  Returns: { status: 'pending' | 'running' | 'done' | 'error'; progress?: number; error?: string }
```

Server-side generation job (runs in-process as a promise; store job state in a simple in-memory Map with a DB flush on completion):

```typescript
export async function runAnnotationGeneration(engagementId: string, submissionId: string): Promise<void> {
  // 1. Fetch findings for this engagement (only 'fail' determinations)
  const findings = await db.query.findings.findMany({
    where: (f, { eq, and }) => and(eq(f.engagementId, engagementId), eq(f.determination, 'fail'))
  })

  // 2. Fetch PDF buffer from GCS
  const pdfBuffer = await fetchDocumentBuffer(engagementId, submissionId)

  // 3. Group findings by likely page (heuristic: process all pages 1-N, try each finding)
  // For efficiency, process all findings on each page in one pass
  const pageCount = await getPdfPageCount(pdfBuffer)

  for (let page = 1; page <= pageCount; page++) {
    const imageBase64 = await rasterizePdfPage(pdfBuffer, page)

    for (const finding of findings) {
      // Skip if this finding already has a 2d annotation on this submission
      const existing = await db.query.engagementAnnotations.findFirst({
        where: (a, { eq, and }) => and(
          eq(a.findingId, finding.findingId),
          eq(a.engagementId, engagementId),
        )
      })
      if (existing) continue

      const bbox = await extractAnnotationCoordinates(imageBase64, finding)
      if (!bbox) continue

      // Store annotation
      await db.insert(engagementAnnotations).values({
        engagementId,
        author: 'ai',
        kind: 'finding',
        findingId: finding.findingId,
        confidence: { value: 0.75, kind: 'asserted' },
        location2d: {
          submissionId,
          page,
          bbox: [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height],
          label: finding.codeSection,
        },
      })
    }
  }
}
```

**Rate limiting note:** We are using claude-haiku-4-5 (fastest, cheapest). Still, for a 30-page plan with 10 findings, this is up to 300 vision calls. Batch efficiently: rasterize one page, run all findings against it in parallel, move to next page.

### Adversarial review — Phase 1

Confirm:
- `pdftoppm` is available in the Cloud Run container (add to Dockerfile if not present)
- PDF buffer fetch from GCS uses service-account auth (not a presigned URL that might expire mid-job)
- Vision model returns valid JSON or `notFound` — the parser handles all cases without crashing
- Annotations are not duplicated if the job runs twice (idempotency check on findingId + submissionId)
- Job state is stored and readable for the progress endpoint
- No finding annotations are generated for 'pass' determinations
- Confidence is marked `kind: 'asserted'` (not 'calibrated' — the spatial coordinate is AI-located, not verified)

---

## Phase 2 — bidirectional navigation

Spawn one build sub-agent, one adversarial review sub-agent.

### 2A — AnnotationLayer callout click → finding highlight

In `packages/document-viewer/src/AnnotationLayer.tsx`, when user clicks an `AnnotationCallout`, emit a selection event:

```tsx
// in AnnotationLayer.tsx
import { useAnnotationSelection } from '@hauska/tile-shell'

// In the callout click handler:
const { selectAnnotation } = useAnnotationSelection()
// onClick: selectAnnotation(annotation.findingId)
```

Add `AnnotationSelectionProvider` and `useAnnotationSelection` to `@hauska/tile-shell`:

```tsx
// packages/tile-shell/src/providers/AnnotationSelectionProvider.tsx
import { createContext, useContext, useState } from 'react'

type AnnotationSelectionCtx = {
  selectedFindingId: string | null
  selectAnnotation: (findingId: string | null) => void
}

const Ctx = createContext<AnnotationSelectionCtx>({ selectedFindingId: null, selectAnnotation: () => {} })

export function AnnotationSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null)
  return (
    <Ctx.Provider value={{ selectedFindingId, selectAnnotation: setSelectedFindingId }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAnnotationSelection() { return useContext(Ctx) }
```

Add `AnnotationSelectionProvider` to the root provider tree in `CortexShell` (or in the `CortexProvider` — wrap both).

### 2B — Finding card highlight when annotation selected

In `ComplianceRunTile`, read `selectedFindingId` from context and apply a highlight style to the matching finding card:

```tsx
const { selectedFindingId } = useAnnotationSelection()
// in the finding row render:
style={{ background: finding.findingId === selectedFindingId ? 'var(--h-accent)22' : undefined }}
```

### 2C — Finding card click → jump to annotation page

In `ComplianceRunTile`, when user clicks a finding card that has at least one annotation, emit a page-jump event via a new `DocumentViewerNavigationProvider`:

```tsx
// packages/tile-shell/src/providers/DocumentViewerNavigationProvider.tsx
type NavigationCtx = {
  requestPage: (page: number, findingId?: string) => void
  onRequestPage: (cb: (page: number, findingId?: string) => void) => () => void
}
```

`DocumentViewerTile` subscribes to `requestPage` events and calls `setPage(page)`.
`ComplianceRunTile` emits `requestPage(annotation.location2d.page, finding.findingId)` on finding click.

This is a one-way message bus (finding → viewer), which is correct — the viewer does not control the tile registry.

### 2D — Generate Annotations button

In `DocumentViewerTile`, add a "Generate AI Annotations" button (visible only when engagement has uploaded docs and completed findings but zero AI annotations):

```tsx
const hasAiAnnotations = annotations?.some(a => a.author === 'ai') ?? false
const hasFindings = /* from engagement context */ true

{!hasAiAnnotations && hasFindings && (
  <button onClick={handleGenerateAnnotations}>Generate AI Annotations</button>
)}
```

`handleGenerateAnnotations` calls:
1. `POST /api/plan-review/engagements/:id/annotations/generate`
2. Polls `GET /api/plan-review/engagements/:id/annotations/generate/:jobId` every 3s
3. On completion, refetches annotations from the tile

Show a progress bar during generation (`progress / total` from the job status endpoint).

### Adversarial review — Phase 2

Confirm:
- Clicking an annotation callout highlights the finding card in ComplianceRunTile (cross-tile event works)
- Clicking a finding card with an annotation jumps to the correct page and flashes the callout
- The Generate button only appears when no AI annotations exist yet
- Progress polling stops when job reaches 'done' or 'error'
- No infinite loop: annotation refetch after generation does not trigger re-generation

---

## Phase 3 — IFC/3D annotation display

Spawn one build sub-agent.

This phase is additive: display `location3d` annotations in the DWG viewer when present.

```typescript
// If an annotation has location3d but no location2d, and the DWGViewer is active:
// Use Autodesk Viewer's selectivelyShowNodes to highlight the element by globalId
viewer.search(annotation.location3d.globalId, (dbIds) => {
  viewer.select(dbIds)
  viewer.isolate(dbIds)  // optional — isolate the element to make it visible
})
```

No AI generation of 3D coordinates in this track — that requires IFC parsing which is a separate workstream. The 3D annotation fields are stored as `location3d` in DB already (from Track D migration). This phase only adds display, not creation.

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-F-close.md`:

```markdown
---
title: Track F close — AI annotation pipeline
date: 2026-07-01
agent: cc-agent-C
track: F
---

## Deployed revision
<revision>

## Phase 1 — vision pipeline
- pdftoppm in Dockerfile: yes/no
- Vision model extraction working: yes/no + sample output
- Generation job route: yes/no
- Annotations in DB after test run: yes (count) / no

## Phase 2 — bidirectional nav
- Annotation click → finding highlight: yes/no
- Finding click → page jump: yes/no
- Generate button with progress: yes/no

## Phase 3 — 3D annotation display
- location3d rendering in DWGViewer: yes/no / deferred

## Vision model cost estimate
<approx $ per 30-page plan with 10 findings>

## Unblocks
Track G (export) — annotation data is populated

## Known limitations
<e.g. coordinate accuracy, page detection heuristic, etc.>

## Rollback
<prior revision>
```
