---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-G-print-export
title: Track G — print/export deliverable PDF
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
track: G
depends_on: Track F close report in _inbox (AI annotations must be populated)
unblocks: nothing — final track in the sprint
---

# Track G — print/export deliverable PDF

Build a complete annotated deliverable PDF that assembles: title page, annotated plan pages, compliance findings summary, and the approval/correction letter. The export is the output artifact a reviewer hands to an applicant.

Track D added a stub export route and button (`POST /api/plan-review/engagements/:id/export`). This track implements the full pipeline.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` and the Track F close report before starting. Do not start until Track F confirms AI annotations are in the DB.

## Success definition

User clicks "Export PDF" in the DocumentViewerTile. Within 15 seconds, a browser download begins. The downloaded PDF contains: (1) a title page with engagement metadata and the Empressa/Hauska logo block, (2) each plan page with annotation callouts rendered as numbered red circles with labels, (3) a findings table page listing all findings by code section with determination and confidence, (4) the approval/correction letter draft. The PDF is self-contained and printable at full resolution.

---

## Phase 1 — server-side PDF assembly

Spawn one build sub-agent, one adversarial review sub-agent.

### 1A — implement the export route

Replace the Track D stub in `artifacts/api-server/src/routes/planReviewBff.ts`:

```typescript
// POST /api/plan-review/engagements/:id/export
router.post('/engagements/:id/export', reviewerBypass, async (req, res) => {
  const { id: engagementId } = req.params

  const [engagement, findings, annotations, letter] = await Promise.all([
    db.query.engagements.findFirst({ where: (e, { eq }) => eq(e.id, engagementId) }),
    db.query.findings.findMany({ where: (f, { eq }) => eq(f.engagementId, engagementId) }),
    db.query.engagementAnnotations.findMany({ where: (a, { eq }) => eq(a.engagementId, engagementId) }),
    getLetterDraft(engagementId),
  ])

  if (!engagement) return res.status(404).json({ error: 'Engagement not found' })

  const pdfBytes = await assembleDeliverable({ engagement, findings, annotations, letter })

  // Upload to GCS temp path with 24h expiry
  const exportPath = `exports/${engagementId}/${Date.now()}/deliverable.pdf`
  await uploadToGcs(exportPath, pdfBytes, 'application/pdf')
  const url = await getPresignedReadUrl(exportPath, 60 * 60 * 24) // 24hr

  return res.json({ url })
})
```

### 1B — deliverable assembly with pdf-lib

```typescript
// artifacts/api-server/src/lib/assembleDeliverable.ts

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type AssembleInput = {
  engagement: Engagement
  findings: Finding[]
  annotations: Annotation[]
  letter: LetterDraft
}

export async function assembleDeliverable({ engagement, findings, annotations, letter }: AssembleInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold)

  // Page 1: Title page
  addTitlePage(doc, engagement, helvetica, helveticaBold)

  // Pages 2..N: Annotated plan pages
  // Fetch source PDF from GCS
  const sourcePdfBytes = await fetchDocumentBuffer(engagement.id, engagement.primarySubmissionId)
  const sourcePdf = await PDFDocument.load(sourcePdfBytes)
  const pageCount = sourcePdf.getPageCount()

  for (let i = 0; i < pageCount; i++) {
    const [copiedPage] = await doc.copyPages(sourcePdf, [i])
    doc.addPage(copiedPage)
    const page = doc.getPage(doc.getPageCount() - 1)

    // Find annotations for this page (1-indexed)
    const pageAnnotations = annotations.filter(a => a.location2d?.page === i + 1)
    renderAnnotationCallouts(page, pageAnnotations, helveticaBold)
  }

  // Findings summary page
  addFindingsSummaryPage(doc, findings, annotations, helvetica, helveticaBold)

  // Letter page
  if (letter.draft) {
    addLetterPage(doc, engagement, letter, helvetica, helveticaBold)
  }

  return doc.save()
}
```

### 1C — title page

```typescript
function addTitlePage(doc: PDFDocument, engagement: Engagement, font: PDFFont, bold: PDFFont) {
  const page = doc.addPage([612, 792]) // US Letter
  const { height } = page.getSize()

  // Header bar
  page.drawRectangle({ x: 0, y: height - 80, width: 612, height: 80, color: rgb(0.31, 0.56, 0.97) })

  page.drawText('REVIEW DELIVERABLE', {
    x: 40, y: height - 50, size: 22, font: bold, color: rgb(1, 1, 1),
  })
  page.drawText('Powered by Hauska Engine — hauska.dev', {
    x: 40, y: height - 68, size: 9, font, color: rgb(0.9, 0.9, 1),
  })

  // Engagement metadata
  const fields = [
    ['Case', engagement.name],
    ['Address', engagement.address],
    ['Jurisdiction', engagement.jurisdiction],
    ['Applicant', engagement.applicantName],
    ['Export Date', new Date().toLocaleDateString()],
  ]

  fields.forEach(([label, value], i) => {
    const y = height - 140 - i * 28
    page.drawText(`${label}:`, { x: 40, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(value ?? '', { x: 160, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
  })

  // Findings summary stats
  const failCount = 0 // filled from findings array via parameter
  const passCount = 0
  // (pass the counts through; abbreviated here for readability)
}
```

### 1D — annotation callout rendering

```typescript
function renderAnnotationCallouts(page: PDFPage, annotations: Annotation[], bold: PDFFont) {
  const { width, height } = page.getSize()

  annotations.forEach((annotation, idx) => {
    if (!annotation.location2d) return
    const [x1, y1, x2, y2] = annotation.location2d.bbox

    // bbox is normalized 0-1 — convert to page coordinates
    const px = x1 * width
    const py = (1 - y2) * height  // PDF y-axis is bottom-up
    const pw = (x2 - x1) * width
    const ph = (y2 - y1) * height

    // Red rectangle outline
    page.drawRectangle({
      x: px, y: py, width: pw, height: ph,
      borderColor: rgb(0.9, 0.2, 0.18), borderWidth: 2,
      opacity: 0,
    })

    // Numbered circle
    const circleX = px + pw
    const circleY = py + ph
    const radius = 10
    page.drawCircle({ x: circleX, y: circleY, size: radius, color: rgb(0.9, 0.2, 0.18) })
    page.drawText(String(idx + 1), {
      x: circleX - (idx < 9 ? 4 : 7), y: circleY - 4,
      size: 9, font: bold, color: rgb(1, 1, 1),
    })
  })
}
```

### 1E — findings summary page

```typescript
function addFindingsSummaryPage(doc: PDFDocument, findings: Finding[], annotations: Annotation[], font: PDFFont, bold: PDFFont) {
  const page = doc.addPage([612, 792])
  const { height } = page.getSize()

  page.drawText('FINDINGS SUMMARY', { x: 40, y: height - 50, size: 16, font: bold, color: rgb(0.1, 0.1, 0.1) })

  let y = height - 80
  findings.forEach((finding, i) => {
    if (y < 60) {
      // add new page if content overflows
      const newPage = doc.addPage([612, 792])
      // (simplified — full implementation handles multi-page findings tables)
      y = newPage.getSize().height - 40
    }

    const annotationNum = annotations.findIndex(a => a.findingId === finding.findingId) + 1
    const determinationColor = finding.determination === 'fail' ? rgb(0.9, 0.2, 0.18) : rgb(0.24, 0.81, 0.56)

    page.drawText(finding.determination === 'fail' ? '✗' : '✓', { x: 40, y, size: 10, font: bold, color: determinationColor })
    page.drawText(`[${annotationNum > 0 ? annotationNum : '—'}] ${finding.codeSection}`, { x: 58, y, size: 9, font: bold, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(finding.description, { x: 58, y: y - 13, size: 8, font, color: rgb(0.3, 0.3, 0.3), maxWidth: 480 })
    y -= 36
  })
}
```

### 1F — letter page

```typescript
function addLetterPage(doc: PDFDocument, engagement: Engagement, letter: LetterDraft, font: PDFFont, bold: PDFFont) {
  const page = doc.addPage([612, 792])
  const { height } = page.getSize()

  page.drawText('REVIEW LETTER', { x: 40, y: height - 50, size: 14, font: bold, color: rgb(0.1, 0.1, 0.1) })

  // Render letter text with word wrap
  const lines = wrapText(letter.draft!, 90)  // ~90 chars per line for Letter width
  lines.forEach((line, i) => {
    page.drawText(line, { x: 40, y: height - 80 - i * 16, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
  })
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if ((current + word).length > maxChars) {
      lines.push(current.trimEnd())
      current = word + ' '
    } else {
      current += word + ' '
    }
  }
  if (current.trimEnd()) lines.push(current.trimEnd())
  return lines
}
```

### Adversarial review — Phase 1

Confirm:
- Export route returns a URL within 15s for a 10-page plan with 10 findings
- Title page renders without errors
- Annotation callouts appear on the correct pages (spot-check: annotation on page 3 appears on page 3 of export)
- Numbered circles match the annotation order in the findings summary
- Findings summary renders for both 'fail' and 'pass' findings
- Letter page renders if letter draft is present, absent if no draft
- GCS presigned URL is valid and downloadable
- `pdf-lib` does not throw on large source PDFs (test with a 30-page plan)

---

## Phase 2 — export UX polish

Spawn one build sub-agent.

### 2A — download vs new tab

In `ExportButton` (added in Track D), change `window.open(url, '_blank')` to a programmatic download:

```tsx
const handleExport = async () => {
  setLoading(true)
  try {
    const { url } = await client.fetch<{ url: string }>(
      `/plan-review/engagements/${engagementId}/export`,
      { method: 'POST' }
    )
    // Trigger browser download with a meaningful filename
    const a = document.createElement('a')
    a.href = url
    a.download = `review-${engagementId.slice(0, 8)}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    setLoading(false)
  }
}
```

### 2B — export from SpaceBar

Add an Export shortcut to the `SpaceBar` in `@hauska/tile-shell`. The SpaceBar is the workspace action bar — add an Export icon that calls the same route:

```tsx
// In CortexShell or SpaceBar, when an engagementId is selected:
<button title="Export deliverable PDF" onClick={() => triggerExport(engagementId)}>
  ↓ Export
</button>
```

This gives a single export trigger without needing the DocumentViewerTile to be in the current layout.

### 2C — print preset

Add a `print` preset to the workspace (optional layout for printing — just the letter tile and findings, no map):

```ts
{
  id: 'print',
  label: 'Print View',
  tileIds: ['compliance-run', 'letter'],
  layoutId: '2h',
}
```

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-G-close.md`:

```markdown
---
title: Track G close — print/export deliverable PDF
date: 2026-07-01
agent: cc-agent-C
track: G
---

## Deployed revision
<revision>

## Export tested
- Title page renders: yes/no
- Annotated plan pages: yes/no (annotations appeared on correct pages: yes/no)
- Findings summary: yes/no
- Letter page: yes/no
- Download triggered (not new tab): yes/no

## Performance
- Export time for 10-page plan: <N>s

## GCS presigned URL
- Valid and downloadable: yes/no
- Expiry: 24h

## SpaceBar export button
- Added: yes/no

## Known gaps
<e.g. multi-page findings tables not implemented, page overflow handling>

## Sprint complete
All seven tracks (A-G) closed. Shared Surface sprint is done.
```
