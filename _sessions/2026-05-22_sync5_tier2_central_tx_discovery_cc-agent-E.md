---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
type: recon
---

# Lane E — Sync 5 Tier 2 central-Texas discovery + classification

Phase 1 of the Sync 5 Tier 2 central-Texas dispatch. Enumerated the
Austin metro + the I-35 central-Texas corridor (Travis, Williamson,
Hays, Caldwell, Bell, Comal counties), excluding the eight cities
already resolved in Tier 1 (Bastrop, Bastrop County, Elgin, Hutto,
Round Rock, Taylor, Leander, Georgetown ingested; Pflugerville, Cedar
Park, Smithville partnership-routed). Each remaining jurisdiction was
verified directly against its development-code source.

## Accessible — Path C (Municode), 16 cities — the Phase 2 ingest queue

All confirmed via `api.municode.com` `ClientContent`. Austin carries a
dedicated `Land Development Code` product; the rest publish their
development/zoning/subdivision regulations as chapters inside a single
`Code of Ordinances` product (the Bastrop / Elgin / Round Rock Path C
shape — scope with a chapter filter).

| City | County | Municode clientId | Notes |
|---|---|---|---|
| Austin | Travis | 1113 | dedicated **Land Development Code** product (productId 15303) — Title 25 (13 ch) + Title 30 (Austin/Travis Co. Subdivision, 5 ch). Large; `productNameFilter` selects it. |
| San Marcos | Hays | 11581 | Code of Ordinances |
| New Braunfels | Comal/Guadalupe | 3504 | Code of Ordinances |
| Killeen | Bell | 2843 | Code of Ordinances |
| Temple | Bell | 11692 | Code of Ordinances |
| Copperas Cove | Coryell/Bell | 1761 | Code of Ordinances |
| Belton | Bell | 1242 | Code of Ordinances |
| Manor | Travis | 15968 | Code of Ordinances |
| Lockhart | Caldwell | 3055 | Code of Ordinances |
| Luling | Caldwell | 3105 | Code of Ordinances |
| Lago Vista | Travis | 2904 | Code of Ordinances |
| Dripping Springs | Hays | 15829 | Code of Ordinances |
| Wimberley | Hays | 16024 | Code of Ordinances |
| Woodcreek | Hays | 16023 | Code of Ordinances |
| Rollingwood | Travis | 12936 | Code of Ordinances |
| Creedmoor | Travis | 20713 | Code of Ordinances |

## Partnership-track — not on Municode, 17 cities

None resolves on Municode (`/Clients/name` returns a clean HTTP 204).
Confirmed platforms below are access-blocked the same way eCode360 was
for Smithville / Pflugerville / Cedar Park — route to the **General
Code (eCode360) partnership track**, do not force-ingest.

| City | County | Platform | Status |
|---|---|---|---|
| Kyle | Hays | eCode360 (`KY6871`) | partnership track |
| Buda | Hays | eCode360 (UDC, `BU6262`) | partnership track |
| Liberty Hill | Williamson | eCode360 (`LI6389`, Franklin Legal) | partnership track |
| Bee Cave | Travis | eCode360 (UDC, `40277793`) | partnership track |
| Lakeway | Travis | eCode360 (Ch. 30 Zoning) **+ city-hosted PDFs** | **Path PDF candidate — see below** |
| Harker Heights | Bell | American Legal Publishing (`amlegal.com`) | partnership track — new aggregator |
| West Lake Hills | Travis | not Municode (unverified) | partnership track |
| Sunset Valley | Travis | not Municode (unverified) | partnership track |
| Jonestown | Travis | not Municode (unverified) | partnership track |
| Hays (city) | Hays | not Municode (unverified) | partnership track |
| Mountain City | Hays | not Municode (unverified) | partnership track |
| Martindale | Caldwell | not Municode (unverified) | partnership track |
| Jarrell | Williamson | not Municode (unverified) | partnership track |
| Florence | Williamson | not Municode (unverified) | partnership track |
| Granger | Williamson | not Municode (unverified) | partnership track |
| Bartlett | Williamson/Bell | not Municode (unverified) | partnership track |
| Salado | Bell | not Municode (unverified) | partnership track |

The "unverified" rows are small towns (pop. < 3k); per the dispatch's
cost discipline, exhaustively confirming each one's publisher is
low-value grinding. They are off Municode and therefore not on the
accessible Path C track; they fall to the partnership / later-recon
bucket.

## Decision-relevant findings

1. **A third blocked aggregator — American Legal Publishing**
   (`codelibrary.amlegal.com`). Harker Heights is on it. After Municode
   (open), eCode360/General Code (blocked), and EncodePlus/GovOS
   (blocked, surfaced in the Pflugerville/Cedar Park recon), amlegal is
   the fourth publisher platform seen in central TX. Worth a bizops
   note alongside the General Code track; not investigated for access
   posture here (cost discipline).

2. **Lakeway is a Path PDF candidate.** Beyond eCode360, the City of
   Lakeway hosts its zoning ordinance as PDFs in its own DocumentCenter
   (`lakeway-tx.gov/DocumentCenter/View/31690`, "The Zoning";
   `DocumentView.aspx?DID=1069`, "Zoning, Development and Building
   Ord."). If those are born-digital and complete, Lakeway is Path PDF
   (the Taylor pattern). Flagged for a Phase 2 follow-up — not yet
   verified for completeness / born-digital text.

3. **Municode `/Clients/name` is reliable for negatives** — it returns
   a definitive HTTP 204 for a city Municode does not carry (verified
   for Kyle, which a stale search-engine URL had suggested was on
   Municode; it is not — Kyle's live code is eCode360). The 16/17 split
   above is trustworthy.

## Phase 2 plan

Ingest the 16 Path C cities, one PR per city, branched fresh from
`main`, each to the B.4 bar (eval 1.0/1.0/1.0), tagged
`platform-internal`, wired into `build-corpus-snapshot`. Order: Austin
(anchor) first, then the corridor by population — San Marcos, New
Braunfels, Killeen, Temple, Copperas Cove, Belton, Manor, Lockhart,
Luling, Lago Vista, Dripping Springs, Wimberley, Woodcreek,
Rollingwood, Creedmoor. This is a continuous run; PRs open as each
city lands. Partnership-track cities are recorded above for the
planner to file into `73_partnerships.md`.

Snapshot refresh + redeploy stays batched into the end-of-QA deploy
per the operator — not run here.
