---
id: 2026-05-21_e2_sync5_tier1_round_rock_cc-agent-E
title: Session — Lane E Phase E2 break-point (Sync 5 Tier 1 underway, Round Rock shipped)
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
related: [_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5, 51_substrate_v1_sprint, 2026-05-21_e1_layer1_icc_source_blocker_cc-agent-E]
---

# Lane E Phase E2 — Sync 5 Tier 1 underway

## Status

E2 break-point. The Sync 5 Tier 1 ladder is started. Round Rock is
ingested, eval-passing, and merged. The Hutto-shaped per-city pattern
is proven and repeatable. Discovery for the rest of Tier 1 is done.
One source-quality finding surfaced on Leander.

## Round Rock — shipped (Tier 1 city 1 of 6)

`hauska-engine` PR #20, merged. Path C live ingest of the City of Round
Rock Part III "Zoning and Development Code" from the Municode JSON API
(clientId 4150). 302 `code-section` atoms across Part III chapters 1
(introductory), 2 (zoning districts and use regulations), 4
(subdivision design and construction), 6 (streets and thoroughfares),
8 (compatibility, landscaping, trees, signs, building regulations).

Eval 1.0 / 1.0 / 1.0 against the B.4 quality bar — 27 reviewer-realistic
curated queries spanning the five chapters. Tagged `platform-internal`
per Path A (Round Rock is non-partnered). Cost: Path C is local fetch
plus atomization, no LLM/OCR/embed spend, well within the $200 plus
one-hour-review envelope.

Round Rock is wired into `build-corpus-snapshot`, so a snapshot refresh
surfaces it in the deployed retrieval-api catalog.

## Tier 1 discovery

The six Tier 1 cities were probed against the Municode JSON client:

| City | Source | Status |
|---|---|---|
| Round Rock | Municode, clientId 4150 | shipped |
| Leander | Municode, clientId 2988 | source-quality finding, below |
| Taylor | Municode, clientId 4591 | ready — Ch 21 Planning and Development + Appendix C Subdivision |
| Georgetown | Municode, clientId 12078 | Title 17 UDC is `children=false` on the TOC — hosted separately, needs a Path PDF investigation like Hutto |
| Pflugerville | not on Municode | needs eCode360 / city-site discovery |
| Cedar Park | not on Municode | needs eCode360 / city-site discovery |

## Source-quality finding — Leander mixed numbering

Leander ingested but the corpus is not clean. Leander's Municode Code of
Ordinances embeds its substantive development regulations as ordinance
exhibits: Chapter 10 "Subdivision Regulation" carries an "Exhibit A,
Subdivision Ordinance" whose articles I to V number sections with bare
sequential integers (`1.` through `77.`), and Chapter 14 "Zoning"
carries the zoning districts bare-numbered `9.` through `19.` alongside
a decimal-numbered chapter framework (`14.01.010`, `14.03.001`).

The atomizer builds a section's `entityId` as
`<tenant>/<editionSlug>/<slugify(sectionNumber)>` with no chapter or
article prefix. A subdivision-exhibit `9.` and a zoning `9.` therefore
collide on one `entityId`, and the storage write keeps only one. The
ingest reported 83 sections but the unique-atom count is lower, and the
collisions silently drop content. Ingesting Leander at a degraded
corpus would pass a carefully-authored eval while not being an honest
1.0 ingest, so Leander was not shipped.

The fix is a scoped atomization or structural-extraction enhancement:
prefix a bare-numbered section's `entityId` with its containing chapter
or article so embedded-ordinance sections are unique. This is
comparable in scope to the Hutto `decimal-numbered` B.2 convention
work, and it is a one-time capability investment — many Texas cities
embed their subdivision and zoning ordinances as exhibits the same way,
so the fix amortizes across the ladder. It is a decide-on-contact
mechanism task for the next E2 session, not a structural fork. The WIP
Leander branch was discarded; the city re-ingests cleanly once the
disambiguation lands.

## Pattern (repeatable for the ladder)

Per Municode city: discover clientId via `getClientByName`; add a
`path-c-ingest-<city>` / `path-c-eval-<city>` CLI pair and a
`<city>-curated-queries.ts` (config plus ~25 section-number-anchored
queries spanning the development chapters); run the ingest with
`--show-sections`; author curated queries against the real section
list; eval; add the city to `build-corpus-snapshot`; one PR, self-merge
on green CI plus eval 1.0 / 1.0 / 1.0. Path A `platform-internal`
tagging is mandatory and was applied.

## Next

- Taylor — clean Municode Path C, ready to ship the Round Rock way.
- The bare-numbered-section disambiguation fix, then Leander re-ingest.
- Georgetown UDC — Path PDF investigation (TOC `children=false`).
- Pflugerville, Cedar Park — eCode360 / city-site discovery; if
  eCode360-blocked, defer to the General Code partnership track like
  Smithville and the Hutto general code.
- A `build-corpus-snapshot` refresh plus retrieval-api redeploy, batched
  once several Tier 1 cities have landed, to surface them in the live
  catalog.
- Then the Tier 2 ladder.
