---
date: 2026-09-04
owner: nick
status: research-complete, scope-deferred except item 7
related_canonical: [90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-09-04_systems_linking_is_the_thesis, _decisions/2026-09-04_compass_rework_starts_parallel_to_plan_review]
---

# Smart Files: real search + cross-system linking — scoping

## Why this exists

Following A-126's finding that Smart Files has no real search today, and the operator's reprioritization (A-127, "the most important work we can do is make these systems function together"), this is the grounding pass before any of that gets built. Research only — nothing built.

## Part 1: real content search

**Current state**: `smart-files`'s entire `package.json` dependency list is one line — `"pg": "^8.23.0"`. No PDF parsing, no search infra, no extensions beyond `pgcrypto` (for UUID generation). This is a genuinely minimal, dependency-light codebase today.

**What it would take**:
1. **Extraction**: net-new dependency, `pdf-parse` (thin wrapper over pdf.js's text layer) is the realistic default for a Node backend this size. Gates cleanly on the already-tracked `content_type` column (`smart_file_versions.content_type`). Does **not** handle scanned/image PDFs — that needs OCR (`tesseract.js` or similar), a materially bigger, separate lift not implied by anything currently in scope.
2. **Indexing**: Postgres `tsvector` + GIN index is the right-sized answer — Postgres is already the only store, current real volume is tiny (5 documents for `bastrop_tx`), nothing justifies a heavier search engine or vector store yet.
3. **Query endpoint**: `GET /api/smart-files/search?q=...&scope=...`, following the exact existing route convention (resolve scope → `requireReadScope` gate BEFORE touching data → query → return metadata only, never raw bytes — matching how the blob route is already separately gated).
4. **Real effort signal, not sugar-coated**: this is not a small route addition. It needs either (a) a synchronous extract-on-upload step inside the existing upload transaction — smaller lift, fits this repo's current dependency-light synchronous style, but stalls the upload response while a PDF is parsed — or (b) an async worker/queue, which is genuinely new infrastructure this repo doesn't have at all today (no job runner in `package.json`). This is a real design choice to make explicitly, not default into.

## Part 2: cross-system linking

**The schema already exists and is unused for its real purpose.** `smart_file_placements` allows seven target types (folder/parcel/project/asset/permit/meeting/instrument) — but exactly one code path writes to it (`uploadFileToFolder`, three call sites), and **all three hard-code `target_type: 'folder'`**. Nothing anywhere in this codebase has ever written a `permit`/`meeting`/`parcel`/`project`/`asset`/`instrument` placement. The mechanism for "this document belongs to that permit" exists in the database and has never been used.

**The 5 real `bastrop_tx` records** (from the municode meeting scraper) land as generic folder placements in one shared "Public meetings" folder — not linked to the specific meeting each one is actually about, despite the scraper already knowing the real meeting's title/date/city at write time. They're also JSON metadata, not PDFs, so Part 1's search work wouldn't reach this content anyway without a separate ingestion change.

**Dashboards reads nothing from Smart Files beyond a plain iframe embed** (zero data crosses that boundary) and the municode calendar's own folder read/write. The real permit feed (`mygov-permits.mjs`) — 312 real Bastrop permits, live today — has zero reference to Smart Files anywhere. No page in Dashboards shows "here are the documents attached to this record," for any domain.

## The smallest real, honest next step (not a redesign)

The municode write path (`writeMeetingRecords`) already knows the real meeting's identity (title, date, city) at the moment it uploads. `store.mjs` already has three working copies of the placement-insert pattern to draw from. The smallest real, verifiable-end-to-end step: parameterize one of those inserts to write `target_type: 'meeting'` + a meeting-derived `target_id` instead of the hardcoded `folder`, from the already-real, already-running municode write path. The read side (`GET /api/smart-files/files/:id/placements`) already exists and is untouched — this would make it return something real for the first time, immediately checkable, with no new subsystem.

This is explicitly NOT the whole cross-linking vision (permits, work orders, and every other domain eventually placing documents against their own real records) — it's the one true, small, already-reachable proof that the mechanism works end to end, using code and data that already exist.

## Status

Scoping complete for both parts. Part 1 (real search) is a real, multi-piece build with a genuine infrastructure decision (sync vs. async extraction) still open — not started. Part 2's smallest step is small enough to be a real candidate for immediate work, separate from the larger search question.
