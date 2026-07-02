---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-D-document-viewer
title: Track D — build @hauska/document-viewer and DocumentViewerTile
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
track: D
depends_on: Track B close report in _inbox
unblocks: Track F (AI annotation pipeline needs the viewer and annotation DB table)
---

# Track D — @hauska/document-viewer

Build the document viewer package and integrate it as a tile in the cortex workspace. This is the plan review surface — reviewers see the plan while running compliance checks. Track D runs in parallel with Track C.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` before starting.

## Success definition

A reviewer selects an engagement from the queue, the DocumentViewerTile loads the plan PDF with page navigation, zoom, and pan. The annotation layer is present and ready (no AI annotations yet — that is Track F). User markup tools (pen, shape, text, stamp) work and save to the DB. The DWG viewer renders an IFC/DWG file when one is attached. Export produces a downloadable annotated PDF (blank annotations for now; Track F populates them). `@hauska/document-viewer` builds as a standalone package.

## Phase 1 — PDF viewer

Spawn one build sub-agent, one adversarial review sub-agent. No deploy yet.

### 1A — PDFViewer component

`packages/document-viewer/src/PDFViewer.tsx`

Use `pdfjs-dist`. PDF.js must run its worker in a separate script — configure the worker source:

```tsx
import * as pdfjsLib from 'pdfjs-dist'
import { useEffect, useRef, useState } from 'react'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

type Props = {
  url: string                          // presigned GCS URL or blob URL
  page?: number                        // controlled page number (1-indexed)
  onPageCount?: (n: number) => void
  annotations?: Annotation[]           // overlay on current page
  onAnnotationAdd?: (a: Omit<Annotation, 'id' | 'createdAt'>) => void
  markupTool?: MarkupTool | null       // active user tool
}

export function PDFViewer({ url, page = 1, onPageCount, annotations, onAnnotationAdd, markupTool }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null)

  useEffect(() => {
    pdfjsLib.getDocument(url).promise.then(doc => {
      setPdf(doc)
      onPageCount?.(doc.numPages)
    })
  }, [url])

  useEffect(() => {
    if (!pdf || !canvasRef.current) return
    pdf.getPage(page).then(pdfPage => {
      const viewport = pdfPage.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      pdfPage.render({ canvasContext: canvas.getContext('2d')!, viewport })
    })
  }, [pdf, page])

  return (
    <div style={{ position: 'relative', overflow: 'auto', flex: 1 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <AnnotationLayer
        annotations={(annotations ?? []).filter(a => a.location2d?.page === page)}
        canvasRef={canvasRef}
        onAdd={onAnnotationAdd}
        activeTool={markupTool}
      />
    </div>
  )
}
```

### 1B — page navigation and zoom controls

`packages/document-viewer/src/PageControls.tsx`

```tsx
export function PageControls({ page, pageCount, onPage, scale, onScale }: PageControlsProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--h-space-sm)', alignItems: 'center', padding: 'var(--h-space-sm)' }}>
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>←</button>
      <span style={{ color: 'var(--h-text-muted)', fontSize: 'var(--h-text-sm)' }}>
        {page} / {pageCount}
      </span>
      <button onClick={() => onPage(Math.min(pageCount, page + 1))} disabled={page >= pageCount}>→</button>
      <button onClick={() => onScale(scale - 0.25)}>−</button>
      <span>{Math.round(scale * 100)}%</span>
      <button onClick={() => onScale(scale + 0.25)}>+</button>
    </div>
  )
}
```

### 1C — submission version picker

`packages/document-viewer/src/VersionPicker.tsx`

```tsx
// Renders the submission chain as tabs: "Submission 1", "Submission 2 (current)"
export function VersionPicker({ submissions, activeId, onSelect }: VersionPickerProps) { ... }
```

---

## Phase 2 — annotation layer and markup tools

Spawn one build sub-agent, one adversarial review sub-agent.

### 2A — AnnotationLayer

`packages/document-viewer/src/AnnotationLayer.tsx`

SVG overlay positioned absolutely over the PDF canvas. Renders existing annotations as callout bubbles. Handles user markup gestures when a tool is active.

```tsx
export function AnnotationLayer({ annotations, canvasRef, onAdd, activeTool }: AnnotationLayerProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Size SVG to match canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !svgRef.current) return
    svgRef.current.style.width = `${canvas.width}px`
    svgRef.current.style.height = `${canvas.height}px`
  })

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeTool || !onAdd) return
    const rect = svgRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    // begin drawing gesture — store start point, track mousemove, finalize on mouseup
    // on completion, call onAdd with the bbox
  }

  return (
    <svg
      ref={svgRef}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: activeTool ? 'all' : 'none' }}
      onMouseDown={handleMouseDown}
    >
      {annotations.map(a => a.location2d && (
        <AnnotationCallout key={a.id} annotation={a} />
      ))}
    </svg>
  )
}
```

`AnnotationCallout` renders a numbered bubble + label at the bbox position. Clicking the callout emits a `findingId` selection event via the EngagementProvider (bidirectional: click callout → highlight finding card in ComplianceRunTile).

### 2B — markup tools

`packages/document-viewer/src/MarkupTools.tsx`

```tsx
export type MarkupTool = 'pen' | 'shape' | 'text' | 'stamp'

export function MarkupToolbar({ active, onSelect }: { active: MarkupTool | null; onSelect: (t: MarkupTool | null) => void }) {
  const tools: { id: MarkupTool; label: string; icon: string }[] = [
    { id: 'pen', label: 'Pen', icon: '✏' },
    { id: 'shape', label: 'Shape', icon: '◯' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'stamp', label: 'Stamp', icon: '✓' },
  ]
  return (
    <div style={{ display: 'flex', gap: 'var(--h-space-xs)' }}>
      {tools.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(active === t.id ? null : t.id)}
          style={{ background: active === t.id ? 'var(--h-accent)' : 'var(--h-surface-2)' }}
          title={t.label}
        >{t.icon}</button>
      ))}
    </div>
  )
}
```

### 2C — BFF routes for annotations

Add to `artifacts/api-server/src/routes/planReviewBff.ts`:

```
GET  /api/plan-review/engagements/:id/annotations
  Returns: { annotations: Annotation[] }
  Auth: reviewer bypass

POST /api/plan-review/engagements/:id/annotations
  Body: Omit<Annotation, 'id' | 'createdAt'>
  Creates one annotation record
  Returns: { annotation: Annotation }
  Auth: reviewer bypass

DELETE /api/plan-review/engagements/:id/annotations/:annotationId
  Auth: reviewer bypass
```

### 2D — DB migration for annotations

New migration file: `artifacts/api-server/drizzle/migrations/<next-number>_engagement_annotations.sql`

```sql
CREATE TABLE engagement_annotations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  author      TEXT NOT NULL,
  kind        TEXT NOT NULL,
  finding_id  UUID REFERENCES findings(id) ON DELETE SET NULL,
  confidence  JSONB,
  location2d  JSONB,
  location3d  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_annotations_engagement ON engagement_annotations(engagement_id);
```

---

## Phase 3 — APS/DWG viewer

Spawn one build sub-agent, one adversarial review sub-agent.

`packages/document-viewer/src/DWGViewer.tsx`

Use the Autodesk APS Viewer SDK. APS credentials exist in the project (check `APS_CLIENT_ID`, `APS_CLIENT_SECRET` env vars — provisioned for the Mox demo).

**Important:** The APS viewer has its own auth flow (2-legged OAuth for internal tools). The component needs an `urnOrUrl` prop (the APS model URN after upload) and calls a BFF endpoint to get a viewer token:

```
GET /api/plan-review/engagements/:id/aps-viewer-token
  Returns: { accessToken: string, expiresIn: number }
  Server-side: POST to Autodesk auth with client_credentials
  Auth: reviewer bypass
```

```tsx
export function DWGViewer({ urn, onReady }: { urn: string; onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // load APS viewer script if not already present
    // initialize Autodesk.Viewing.GuiViewer3D
    // call viewer.loadDocumentNode(urn)
  }, [urn])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
```

**AUTH-001 note:** If APS returns 403 on all scopes, the Autodesk account may not be entitled to APS API access on the current tier. Test with the existing APS creds before building the full integration. If it fails, fall back to server-side DWG→PDF conversion (use `LibreOffice --headless --convert-to pdf` in the Cloud Run worker) and display in PDFViewer.

---

## Phase 4 — DocumentViewerTile + preset registration + export

Spawn one build sub-agent, one adversarial review sub-agent. Deploy after this phase.

### 4A — DocumentViewerTile

`packages/cortex-tiles/src/document-viewer/DocumentViewerTile.tsx`

```tsx
import { PDFViewer, DWGViewer, MarkupToolbar, VersionPicker } from '@hauska/document-viewer'
import { useCortexClient } from '../CortexProvider'
import { useEngagement } from '@hauska/tile-shell'
import { TileErrorBoundary } from '../TileErrorBoundary'

function DocumentViewerTileInner({ mode = 'full' }: { mode?: 'full' | 'raw' }) {
  const { engagementId, submissions, annotations } = useEngagement()
  const client = useCortexClient()
  const [page, setPage] = useState(1)
  const [activeTool, setActiveTool] = useState<MarkupTool | null>(null)
  const [activeSubmission, setActiveSubmission] = useState(submissions?.[0]?.id)

  if (!engagementId) return <div style={{ color: 'var(--h-text-muted)' }}>Select a case first.</div>
  if (!submissions?.length) return <div style={{ color: 'var(--h-text-muted)' }}>No documents uploaded.</div>

  const submission = submissions.find(s => s.id === activeSubmission)
  const pageAnnotations = annotations?.filter(a => a.location2d?.submissionId === activeSubmission) ?? []

  const handleAnnotationAdd = async (a: Omit<Annotation, 'id' | 'createdAt'>) => {
    await client.fetch(`/plan-review/engagements/${engagementId}/annotations`, {
      method: 'POST', body: JSON.stringify(a),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <VersionPicker submissions={submissions} activeId={activeSubmission} onSelect={setActiveSubmission} />
      <div style={{ display: 'flex', gap: 'var(--h-space-sm)', padding: 'var(--h-space-xs)' }}>
        <MarkupToolbar active={activeTool} onSelect={setActiveTool} />
        <ExportButton engagementId={engagementId} />
      </div>
      <PDFViewer
        url={submission.documentUrl}
        page={page}
        annotations={pageAnnotations}
        onAnnotationAdd={handleAnnotationAdd}
        markupTool={activeTool}
      />
      <PageControls page={page} pageCount={submission.pageCount} onPage={setPage} />
    </div>
  )
}

export function DocumentViewerTile(props: ...) {
  return <TileErrorBoundary label="Document Viewer"><DocumentViewerTileInner {...props} /></TileErrorBoundary>
}
```

### 4B — export button

```tsx
function ExportButton({ engagementId }: { engagementId: string }) {
  const client = useCortexClient()
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    const { url } = await client.fetch<{ url: string }>(
      `/plan-review/engagements/${engagementId}/export`,
      { method: 'POST' }
    )
    window.open(url, '_blank')
    setLoading(false)
  }

  return <button onClick={handleExport} disabled={loading}>{loading ? 'Exporting…' : 'Export PDF'}</button>
}
```

### 4C — BFF export route

`POST /api/plan-review/engagements/:id/export`
- Fetch plan document pages via GCS (presigned read URLs)
- Render annotation SVG to PNG via sharp or canvas (server-side)
- Compose PDF: title page + annotated plan pages + letter draft (if present)
- Upload to GCS temp path, return presigned read URL (1hr expiry)
- Auth: reviewer bypass

For PDF assembly use `pdf-lib` (browser-compatible, zero-dependency PDF assembler).

### 4D — register in TILE_REGISTRY

```ts
{
  id: 'document-viewer',
  label: 'Document Viewer',
  category: 'Compliance',
  status: 'live',
  requires: { engagementId: true, uploadedDocuments: true },
  produces: { annotations: true },
  modes: ['full'],
  mcpTools: [],
  el: () => <DocumentViewerTile />,
}
```

Add to Plan Review preset: `tileIds: ["intake-queue", "document-viewer", "compliance-run", "letter"]` with layout `"4"`.
Add to Design Accelerator preset.

### Adversarial review — Phase 4

Confirm:
- PDF renders on page 1 when engagement with uploaded docs is selected
- Page navigation works
- Annotations from DB appear as callout bubbles on correct pages
- User can draw a shape annotation and it saves to DB
- Export button produces a downloadable PDF (may be mostly blank pages if no annotations — that is correct)
- DWG viewer renders OR shows a named error (AUTH-001 or "DWG viewing requires APS credentials")
- No existing tiles regressed

---

## Deploy

After Phase 4 merges, run the full deploy sequence including migrations (the annotations table migration is new).

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-D-close.md`:

```markdown
---
title: Track D close — @hauska/document-viewer
date: 2026-07-01
agent: cc-agent-C
track: D
---

## Deployed revision
<revision>

## What shipped
- PDFViewer: yes/no
- AnnotationLayer: yes/no
- MarkupTools: yes/no
- DWGViewer: working / AUTH-001 fallback / deferred
- DocumentViewerTile in Plan Review preset: yes/no
- Export route: yes/no
- Annotations migration applied: yes/no

## Annotation DB table
<migration number>

## Unblocks
Track F (AI annotation pipeline) can begin

## Known gaps
<anything deferred>

## Rollback
<prior revision>
```
