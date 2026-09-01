---
id: 2026-08-28_p85_records_documenturl_pe_handoff
title: P-85 Card 3 PE handoff — point PdfViewer at documentUrl
date: 2026-08-28
status: closed-merged
plan_row: P-85
from: integration lane on P-85 extract-fail-closed
to: P:/seat-worktrees/property/hauska-map-records branch seat/property-records
---

# P-85 Card 3 PE handoff

Closed 2026-08-28: hauska-map PR 285 merged as `f334ca89` from clean worktree `P:/seat-worktrees/property/hauska-map-p85-documenturl`. The dirty `hauska-map-records` worktree was not written.

Do not build this in the LDT checkout. The Smart Site half belongs to the registered records worktree `P:/seat-worktrees/property/hauska-map-records` on `seat/property-records`.

## What LDT now exposes

The parcel GET `GET /api/property-explorer/v1/records-request?parcelNodeId=` job wire carries:

- `artifacts[]` with `{ artifactId, recordingRef, documentUrl, acquisitionMethod }`
- `scopeSearched.indexHits[].documentUrl` stamped onto the hit whose `recordingRef` matches an artifact that already has a capture (`metadata.capturePngBase64`) or a `storagePath`

`documentUrl` is null when the artifact has no persisted image. That is honest absence, not a missing field to invent.

The bytes are served at the same path as `documentUrl`:

`GET /api/property-explorer/v1/records-request/artifacts/:artifactId/document`

Auth is the same PE session as the records GET. Wrong user is 403. Missing capture is 404.

## What PE must do

`apps/property-explorer` already has `PdfViewer` (`href` required; no href renders nothing). Records rows today have no `documentUrl` on `RecordsInstrumentRow` and `RecordsRequestSection` never opens the viewer.

1. Carry `documentUrl` from `WireIndexHit` / job `artifacts` through `instrumentsFromIndexHits` and `instrumentsFromClassifiedScope` onto `RecordsInstrumentRow`.
2. Prefix the cortex deep proxy the same way the records client prefixes every other spine-deep call. A bare `/api/property-explorer/...` path will 404 on the Vercel host.
3. Open `PdfViewer` from the instrument row when `documentUrl` is a non-empty string. When it is null, keep the current row with no viewer. Do not fabricate a href.
4. Capture images are PNG. `PdfViewer` is the existing viewer; if it only embeds PDF, add an image path or a sibling viewer. Do not drop a raw unauthenticated GCS URL on the page.

## What PE must not do

- Do not change the Card 2 null parties copy. `partiesLine` already renders "Parties not extracted yet" when `parties` is null.
- Do not classify document types in the client. An unresolved type is a refused artifact, not a deed.
- Do not write this onto `fix/pe-pricing-a2` or any hauska-map worktree except `hauska-map-records`.

## Verify

A completed job whose artifact has `capturePngBase64` returns a non-null `documentUrl` on the matching index hit. Opening that row shows the captured instrument page. A job with index hits and no artifacts shows the honest "image not acquired yet" note and no viewer.
