---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
type: session
---

# Lane E — Sync 5 Tier 2 central-Texas, Phase 2 session (NB + Killeen
shipped; 4 decision-relevant findings)

Companion to the Phase 1 discovery filing
(`2026-05-22_hauska-engine_cc-agent-E_sync5-tier2-central-tx-discovery.md`).

## Shipped this session

- **hauska-engine PR #28** — Sync 5 Tier 2: New Braunfels Development
  Regulations ingest (Path C / Municode). 190 atoms across Chapters 38
  (Community Development), 98 (Planning), 106 (Signs), 118 (Subdivision
  Platting), 144 (Zoning). Eval 1.0 / 1.0 / 1.0 across 30 curated
  queries. `platform-internal`.
- **hauska-engine PR #29** — Sync 5 Tier 2: Killeen Development
  Regulations ingest (Path C / Municode). 637 atoms across Chapters 21
  (Planning and Development), 26 (Subdivisions and Other Property
  Developments), 31 (Zoning), 33 (Impact Fees). Eval 1.0 / 1.0 / 1.0
  across 30 curated queries. `platform-internal`.

Both reuse the Tier 1 single-product chapter-filter Path C wiring
unchanged — the Round Rock / Elgin / Leander pattern scales to Tier 2
without code change.

## Phase 1 discovery doc — corrections needed (please read with the
original)

The discovery doc filed earlier this session claimed all 16 single-
product Municode central-TX cities are Path C accessible. Per-city
top-level-TOC verification (which the discovery doc had not done) now
shows two false positives:

- **San Marcos** (clientId 11581) — the Code of Ordinances exposes
  `Subpart B - LAND DEVELOPMENT CODE` as a TOC node with
  `HasChildren=False`; `getCodesContent` returns one Doc of 358 chars
  (an empty placeholder). `Subpart A - General Ordinances` carries the
  non-development chapters (animals, businesses, taxation, etc.) but
  has **no zoning, subdivision, or development chapters**. The
  substantive LDC ("Code SMTX") is hosted off-Municode. Not Path C.
- **Temple** (clientId 11692) — the Code of Ordinances top-level TOC
  has `Unified Development Code` with `HasChildren=False`, plus
  `Chapter 33 - Subdivisions - Repealed` and `Zoning Ordinance -
  Repealed`. The UDC has replaced the in-Municode zoning/subdivision
  chapters and is published off-Municode. Not Path C. (Also: the
  latest Municode job for Temple is `320724`, much older than the
  470k–490k range seen on every other live city probed — Temple's
  Municode product is effectively frozen.)

Both belong with Pflugerville / Cedar Park in the partnership /
investigate-Path-PDF bucket, not the Path C ingest queue.

Two more single-product cities flagged for a closer probe before
ingest:

- **Belton** (1242) — no clearly-named zoning or subdivision chapter
  surfaced in the one-level-deep heading scan; dev content may live in
  Chapter 17 PLANNING AND DEVELOPMENT or an unsurfaced appendix.
- **Creedmoor** (20713) — `Jobs/latest` returned HTTP 400; tiny city
  (pop ~300); a low-priority probe.

The remaining 11 single-product cities + Austin (separate LDC product)
are verified Path C with named dev chapters. The Phase 2 ingest queue
is therefore **12 cities, not 16**:

  **Austin** (anchor, LDC product), **Killeen** ✓ done (#29),
  **New Braunfels** ✓ done (#28), **Copperas Cove**, **Manor**,
  **Lockhart**, **Luling**, **Lago Vista**, **Dripping Springs**,
  **Wimberley**, **Woodcreek**, **Rollingwood**.

## Decision-relevant finding — Tier 2 cross-reference graph is empty

Both Tier 2 cities so far emit ~zero in-corpus cross-references:

- New Braunfels: 0 resolved / 566 sniffed.
- Killeen: 1 resolved / 1080 sniffed.

Tier 1 cities for contrast: Round Rock 281, Georgetown 156, Leander
similar.

**Root cause:** the Tier 1 cities had a self-contained dev code (Round
Rock's "Part III - Zoning and Development Code" is one top-level Part;
Georgetown's UDC is a separate Municode product). Cross-refs within
the dev code resolved in-corpus.

The Tier 2 single-product cities (NB, Killeen) publish dev content as
**individual chapters inside a broader Code of Ordinances**. The
chapter filter scopes ingest to a few dev chapters and excludes the
rest — but the dev chapters cross-reference **out** to the excluded
chapters (Buildings, Floods, Drainage, Construction Regulations,
Impact Fees-adjacent, etc.). Those refs sniff as unresolved and are
dropped, per ADR-010 (code-cross-reference is in-corpus only).

**Impact:** the B.4 bar is met by construction (`crossRefScore` returns
1.0 when the in-corpus xref set is empty), so the eval passes. But the
link graph for these cities is empty — downstream composition /
traversal features get nothing.

**Follow-up options for the planner / a future dispatch:**

1. Broaden the chapter filter on each Tier 2 single-product city to
   include dev-adjacent chapters (Buildings, Floods, Drainage). Pulls
   in non-zoning building/flood regulations — closer to a true UDC
   scope; bigger ingest.
2. Generalize the `synthesize-xrefs.ts` sniffer to keep external-
   chapter pointers as **external-citation** atoms (a new atom shape)
   rather than dropping them — like the body-text external citations
   ADR-010 mentions for IRC / IBC. Per-city scope stays narrow; the
   link graph carries the "see Chapter 14" pointers as typed external
   citations.

Recorded here so the planner has the choice; this is corpus-quality
work, not a Tier 2 blocker.

## Decision-relevant finding — fourth blocked aggregator: American
Legal Publishing

Harker Heights' code is published on `codelibrary.amlegal.com` —
**American Legal Publishing**. After Municode (open), eCode360 /
General Code (blocked, partnership-tracked), and EncodePlus / GovOS
(blocked, surfaced in the Pflugerville/Cedar Park recon), amlegal is
the fourth publisher platform seen in central TX. Access posture not
fully verified here per cost discipline; flagged for `73_partnerships.md`
as a separate aggregator-partnership candidate.

## Decision-relevant finding — Municode `/Clients/name` is reliable for
negatives

The endpoint returns a definitive HTTP 204 for cities Municode does
not carry. My earlier "flaky" reading was a `$null`-counting bug in
the discovery probe. The 16 found / 17 not-found split in the
discovery doc is trustworthy. Verified across Kyle (false-positive
search-engine link — actually not on Municode) and the four ingested
Path C cities (#28, #29, plus the eight remaining queue).

## Phase 2 status — Tier 2 ingest queue

| # | City | Source | Status |
|---|---|---|---|
| 1 | Austin | Municode (separate LDC product) | **anchor, pending** |
| 2 | Killeen | Municode COO chapter-filter | ✓ PR #29 |
| 3 | New Braunfels | Municode COO chapter-filter | ✓ PR #28 |
| 4 | Copperas Cove | Municode COO chapter-filter | pending |
| 5 | Manor | Municode COO chapter-filter (exhibit pattern) | pending |
| 6 | Lockhart | Municode COO chapter-filter | pending |
| 7 | Luling | Municode COO chapter-filter (zoning in Appendix B) | pending |
| 8 | Lago Vista | Municode COO chapter-filter (exhibit pattern) | pending |
| 9 | Dripping Springs | Municode COO chapter-filter (exhibit pattern) | pending |
| 10 | Wimberley | Municode COO chapter-filter | pending |
| 11 | Woodcreek | Municode COO chapter-filter | pending |
| 12 | Rollingwood | Municode COO chapter-filter (Part II LDC) | pending |
| — | Belton | Municode COO (needs closer probe) | flagged |
| — | Creedmoor | Municode COO (probe errored, low pop) | flagged |
| — | San Marcos | LDC off-Municode | partnership / Path PDF investigation |
| — | Temple | UDC off-Municode | partnership / Path PDF investigation |

Plus the 17 non-Municode cities from the Phase 1 doc on the partnership
track (eCode360 / EncodePlus / amlegal).

## Suggested doc updates (for the planner — not made here per HR-11)

- `73_partnerships.md`: add **American Legal Publishing** as a fourth
  publisher-aggregator row (Harker Heights as the first noted
  jurisdiction).
- `73_partnerships.md`, **General Code (eCode360)** row: add
  Kyle, Buda, Liberty Hill, Lakeway, Bee Cave to the affected list
  (Phase 1 doc gives details).
- `00_current_state.md`: Sync 5 Tier 2 in progress — 2 of 12 accessible
  Path C cities ingested + Austin pending; San Marcos / Temple
  reclassified out of accessible bucket.

## Still open

- **Austin LDC ingest** (anchor, productNameFilter on `Land Development
  Code`, Title 25 + Title 30, 18 chapters total — the biggest single
  ingest in the corridor). Pending; next session.
- The 9 remaining smaller / medium corridor Path C cities.
- The two Tier 2 corpus-quality follow-ups (xref scope or
  external-citation atom).
- **`build-corpus-snapshot` refresh + retrieval-api redeploy** — owed
  for **six** merged-but-undeployed Sync 5 cities (Round Rock, Taylor,
  Leander, Georgetown, plus New Braunfels and Killeen once PR #28/#29
  merge). Per the operator the corpus refresh is batched into the
  end-of-QA deploy; not run here.
- ICC Layer 1 corpus ingest stays gated on Code Connect credentials.

## Durable in-repo record

PR #28 + PR #29 plus this drop. The verification commands are
reproducible against `api.municode.com/ClientContent/{id}` and
`/codesToc/children` for the per-city dev-chapter check.
