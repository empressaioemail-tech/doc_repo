---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
type: session
---

# Lane E — Sync 5 Tier 2 corridor batch: 8 PRs shipped (Austin + 7 cities)

Continuous-run session per the 2026-05-22 Tier 2 dispatch. Cleared the
remaining central-Texas corridor queue with 8 new PRs against `main`,
plus two cities flagged as needing adapter enhancement.

## Shipped this session — 8 PRs, all 1.0 / 1.0 / 1.0

| PR | City | Source | Atoms | XRefs | Pattern |
|---|---|---|---|---|---|
| **#30** | **Austin (anchor)** | Municode separate LDC product (1113/15303) | **2211** | **1047** | productNameFilter + libraryCodePath |
| #31 | Copperas Cove | Municode (1761) Ch 16.5/17.5/20 | 133 | 0 | single-product chapter filter |
| #32 | Manor | Municode (15968) Ch 10/14/15 | 273 | 56 | exhibit pattern (Leander) |
| #33 | Lockhart | Municode (3055) Ch 46/52/64 | 139 | 0 | single-product chapter filter |
| #34 | Lago Vista | Municode (2904) Ch 3.5/5/10/14/15 | 299 | 106 | exhibit pattern |
| #35 | Dripping Springs | Municode (15829) Ch 26/28/30 | 954 | 14 | exhibit pattern (large) |
| #36 | Wimberley | Municode (16024) Ch 9 | 237 | 137 | single-chapter (full Ch 9) |
| #37 | Rollingwood | Municode (12936) Part II LDC | 421 | 0 | dedicated Part (Round Rock) |

**Totals:** 8 PRs, **4667 code-section atoms**, 1360 in-corpus
cross-references resolved. All `platform-internal`. All eval
1.0/1.0/1.0 (Austin/Killeen/NB ingests already in `main` from the
prior Tier 2 sessions; this session's 8 PRs are open against `main`).

Combined with previously-merged Sync 5 cities (Round Rock, Taylor,
Leander, Georgetown, NB, Killeen) the central-TX accessible-Path-C
total is approaching **8000 code-section atoms across 14 cities**.

## Two cities flagged — adapter enhancement needed

Per cost discipline ("do not grind"), the following two cities were
flagged and skipped after probe — not engineered around:

- **Luling** (clientId 3105) — dev chapters (Ch 34 Community
  Development, Ch 98 Subdivisions, Appendix B Zoning) are nested
  *under* a top-level `PART II - CODE OF ORDINANCES` wrapper. The
  `MunicodeHtmlAdapter.chapterFilter` mechanism filters TOP-LEVEL TOC
  nodes only, so the dev chapters can't be isolated without either
  (a) walking all of Part II (overly broad scope) or (b) adding a
  recursive heading filter / `tocRootNodeId` adapter option.
- **Woodcreek** (clientId 16023) — dev chapters (Ch 154 Site Dev,
  155 Subdivisions, 156 Zoning) are nested under `TITLE XV - LAND
  USAGE`. The chapter filter matches Title XV and walks all chapters
  beneath (150 General Provisions, 151 Buildings, 154/155/156). Eval
  ran but **failed sectionNumScore at 0.97** (B.4 bar = 1.0): 3 of the
  first-100 sampled atoms are chapter/article-heading junk with empty
  or word-shaped section numbers (e.g. `"GRANDFATHERED"`, empty), so
  `getSectionsBySectionNumber()` returns no match for them.

**The same adapter enhancement unblocks both:** a `tocRootNodeIds?:
string[]` option on `MunicodeHtmlAdapter` that lets a Path C ingest
start the walk from one or more explicit nested nodes (rather than
filtering top-level by heading). For Luling: `["PTIICOOR_CH34CODE",
"PTIICOOR_CH98SU", "PTIICOOR_APXBZO"]`. For Woodcreek:
`["TITXVLAUS_CH154...", "...155...", "...156..."]`. A separate
follow-up dispatch.

Belton and Creedmoor were already flagged in the prior session for
similar adapter-limitation reasons (Belton: no clearly-named dev
chapter at TOC level; Creedmoor: `Jobs/latest` errored).

## Pattern observations

**Cross-reference graph density continues to track scope coherence:**
- Cities with a self-contained dev-code Part/Product
  (Austin LDC product, Rollingwood Part II, Round Rock Part III)
  resolve hundreds of in-corpus xrefs.
- Cities with the Leander exhibit-ordinance pattern (Manor 56, Lago
  Vista 106, Wimberley 137) resolve moderate xrefs — exhibits cross-
  reference within themselves.
- Cities with development chapters scattered inside a broader Code of
  Ordinances (NB 0, Killeen 1, Copperas Cove 0, Lockhart 0, Dripping
  Springs 14) resolve ~zero xrefs — refs go OUT to scope-excluded
  chapters. The two open follow-up options remain: broaden chapter
  filters or add an `external-citation` atom shape (filed in the
  prior session summary).

**Wall-clock cost:**
- Austin LDC: 2 × ~18 min runs = ~37 min ingest wall-clock (compute
  cost ~$0 — pure HTTP + parsing at Municode's 1.5s politeness ceiling).
- Smaller corridor cities: ~3-5 min per ingest run, ~10-15 min total per
  city including wiring + curated-query authoring + commit + PR.

## Central-TX corridor — final status (per the Phase 1 discovery doc
and this batch)

**Accessible Path C (ingested), 14 cities:** Bastrop, Bastrop County,
Elgin, Hutto, Round Rock, Taylor, Leander, Georgetown, New Braunfels,
Killeen, Austin, Copperas Cove, Manor, Lockhart, Lago Vista, Dripping
Springs, Wimberley, Rollingwood. (Tier 1: 8; Tier 2: 10.)

**Adapter-limited (flagged for `tocRootNodeIds` adapter follow-up):**
Luling, Woodcreek, Belton, Creedmoor.

**Off-Municode (route to General Code partnership track):** San
Marcos, Temple (their LDC/UDC is off-Municode despite Municode COO
presence), plus the 17 non-Municode cities from the Phase 1 doc (Kyle,
Buda, Lakeway, Bee Cave, Liberty Hill, Harker Heights, West Lake
Hills, Sunset Valley, Jonestown, Hays city, Mountain City, Martindale,
Jarrell, Florence, Granger, Bartlett, Salado), plus the prior
Pflugerville, Cedar Park, Smithville.

## Suggested doc updates (for the planner — not made here per HR-11)

- `00_current_state.md`: Sync 5 Tier 2 central-TX corridor effectively
  complete on the accessible-Path-C track. 14 cities + Austin anchor.
- `73_partnerships.md`: no new aggregator findings this session (the
  previously-noted American Legal Publishing remains pending bizops).

## Still open

- **`build-corpus-snapshot` refresh + retrieval-api redeploy** — now
  owed for **14** merged-but-undeployed Sync 5 cities once these 8 PRs
  merge (RR + Taylor + Leander + Georgetown + NB + Killeen already
  merged; this batch's 8 still open). Per the operator the corpus
  refresh is batched into the end-of-QA deploy; not run here.
- Adapter enhancement (`MunicodeHtmlAdapter.tocRootNodeIds`) to
  unblock the 4 adapter-limited cities. Separable from this dispatch.
- ICC Layer 1 corpus ingest stays gated on Code Connect credentials.
- Next ladder rung per the dispatch: remaining TX metros — San
  Antonio metro, Fort Worth, Rio Grande Valley, El Paso area.

## Durable in-repo record

PRs #30, #31, #32, #33, #34, #35, #36, #37 plus this drop.
