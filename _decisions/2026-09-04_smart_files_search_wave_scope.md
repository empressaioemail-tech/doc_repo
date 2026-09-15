---
decision_id: 2026-09-04_smart_files_search_wave_scope
date: 2026-09-04
owner: nick
status: active
related_canonical: [_inbox/2026-09-04_smart_files_search_and_linking_scoping, _decisions/2026-09-04_systems_linking_is_the_thesis]
---

# Decision

Smart Files gets real search built as a proper wave, not a quick fix, per the operator's own instruction: "we need the real path laid out and executed against as a wave." Scope for this wave, decided here so the dispatch is grounded rather than open-ended:

1. **Real content search**: PDF text extraction (`pdf-parse`, gated on `content_type = 'application/pdf'`), Postgres `tsvector` + GIN indexing, a real `GET /api/smart-files/search` endpoint following the existing `requireReadScope` gate convention. Extraction runs **synchronously on upload** — the smaller, real, working choice given current volume (5 real documents for `bastrop_tx` today) and this repo's existing dependency-light, synchronous style; no job-queue infrastructure exists today and inventing one now would be over-building for the actual, current load. Documented explicitly as a revisit point if/when volume grows enough that upload latency becomes a real problem — not decided permanently here.
2. **Fix the one real, already-available linkable content**: the municode meeting upload path hardcodes `target_type: 'folder'` on every write; parameterize it to write `target_type: 'meeting'` with the real meeting's own identity, using the placement-insert pattern that already exists in three other places in the same file.

## What's explicitly OUT of this wave, and why

**Cross-linking real permit/work-order/inspection documents is not buildable right now — checked, not assumed.** `smartcity-os`'s real `mygov_permits` table (the live source for 312 real Bastrop permits) has no document/attachment/file field of any kind — confirmed directly against the schema (`shared/schema.ts`). There is no upstream document content for any domain besides the municode meeting scraper today. Building placement-writing for permits/work-orders/etc. now would mean inventing content to link, which this whole program has repeatedly refused to do. This is a real, separate, future initiative (does MyGov itself expose permit application documents via an API this repo doesn't call yet? — unanswered, out of scope here) — named honestly rather than silently dropped.

## Reasoning

This keeps the wave real and finishable: two genuinely buildable pieces (search infrastructure; the one real linkage that has real data to link), instead of a wave that half-builds toward domains with no content to actually exercise it. Matches this program's own standing discipline — measure before building, never fabricate content to make a feature look more complete than the data supports.

## Dependencies

Depends on: the scoping in `_inbox/2026-09-04_smart_files_search_and_linking_scoping.md`.
Feeds: Compass's Smart Files context-awareness priority (once real search exists, Compass has something real to query).
Does not reopen: permit/work-order document linking, which stays explicitly out of scope until real upstream document content exists somewhere to link.
