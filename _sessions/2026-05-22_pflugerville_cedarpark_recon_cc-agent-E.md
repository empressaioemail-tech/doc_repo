---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
type: recon
---

# Lane E E2 — Sync 5 Tier 1 close: Pflugerville + Cedar Park routed to partnership track

## Status — Sync 5 Tier 1 COMPLETE, 6 of 6

The last two Tier 1 cities are resolved. Neither is ingestable on a
sourcing path that respects published access policy; both are routed to
the **General Code (eCode360) partnership track**, the Smithville
pattern. No code change, no PR — this recon drop is the deliverable.

| # | City | Source | Outcome |
|---|---|---|---|
| 1 | Round Rock | Municode Path C | shipped (PR #20) |
| 2 | Taylor | Path PDF (city-hosted LDC) | shipped (PR #21) |
| 3 | Leander | Municode Path C | shipped (PR #23) |
| 4 | Georgetown | Municode Path C (separate UDC product) | shipped (PR #27) |
| 5 | Pflugerville | eCode360 + EncodePlus, both access-blocked | **partnership track** |
| 6 | Cedar Park | eCode360 + EncodePlus, both access-blocked | **partnership track** |

Tier 1 is the Bastrop-network ladder from the 2026-05-21 ADR-019 / Sync
5 dispatch. Four cities ingested to the B.4 bar (eval 1.0/1.0/1.0,
`platform-internal`); two routed to partnership. Sync 5 Tier 1 done.

## Verification — per the dispatch's "verify directly, do not trust the
discovery" instruction

The Tier 1 discovery flagged both as "not on Municode." The discovery's
TOC-heading scans have misfired in both directions before (Taylor false
positive, Georgetown false negative), so each city was re-verified
against every sourcing path directly.

**Pflugerville (Unified Development Code):**
- *Municode* — NOT present. `GET api.municode.com/Clients/name?clientName=pflugerville&stateAbbr=TX`
  returns empty. Endpoint confirmed working: the same call returns the
  correct clientIds for Georgetown (12078), Round Rock (4150), Leander
  (2988). True negative.
- *City-hosted born-digital PDF* — NONE. The city UDC page
  (`pflugervilletx.gov/295/Unified-Development-Code`) and Planning
  Department page route the public to the EncodePlus viewer; no UDC PDF
  in the city DocumentCenter. The adopting ordinance language itself
  says the UDC "may be viewed at online.encodeplus.com/regs/pflugerville/."
- *eCode360* — present (`ecode360.com/PF6442`, Chapter 157 UDC). Live
  check 2026-05-22: HTTP **403 Forbidden**. Consistent with the
  2026-05-19 Smithville eCode360 recon.
- *EncodePlus* — present (`online.encodeplus.com/regs/pflugerville/`).
  EncodePlus `robots.txt` carries `User-agent: * / Disallow: /regs/` —
  all code content sits under `/regs/`. The viewer page returns HTTP 200
  but robots.txt disallows automated access; ingest violates published
  policy (the same bar the Smithville recon set).

**Cedar Park (Zoning and Sign Ordinances / Code of Ordinances):**
- *Municode* — NOT present. `/Clients/name?clientName=cedar park` empty.
  True negative.
- *City-hosted born-digital PDF* — NONE. The city "Find & View" page
  (`cedarparktexas.gov/680/Find-View`) links only external platforms:
  eCode360 (`CE6271`), the cpatlas zoning-map viewer, and ICC. Only the
  Comprehensive Plan is city-hosted — not the zoning/development code.
- *eCode360* — present (`ecode360.com/CE6271`; zoning districts
  `38611683`). Live check 2026-05-22: HTTP **403 Forbidden**.
- *EncodePlus* — present (`online.encodeplus.com/regs/cedarpark-tx/`).
  Live check: HTTP **403**, and `robots.txt Disallow: /regs/`.

## Decision-relevant finding — EncodePlus is a SECOND access-blocked
aggregator

`73_partnerships.md` currently names one publisher-aggregator track:
**General Code (eCode360)**. This recon surfaces a second:
**EncodePlus** (`online.encodeplus.com`, now operating under GovOS).
Both Pflugerville and Cedar Park are *dual-published* on eCode360 and
EncodePlus, and EncodePlus's `robots.txt` disallows `/regs/` for all
user-agents — the same "direct ingest violates published policy"
posture as eCode360.

This does not change the routing: because both cities are also on
eCode360, the existing **General Code (eCode360)** partnership unblocks
both — no separate EncodePlus partnership is required to clear Tier 1.
But EncodePlus is a distinct publisher covering TX cities and is worth
logging for bizops as a second aggregator-partnership candidate, sized
behind General Code.

## Suggested doc updates (for the planner — not made here per HR-11)

- `73_partnerships.md`, **General Code (eCode360)** row: add Pflugerville
  and Cedar Park to the affected-jurisdiction list (alongside
  Smithville). Both are confirmed eCode360-blocked Tier 1 cities.
- `73_partnerships.md`: consider a new **EncodePlus / GovOS** row — a
  second publisher-aggregator, `robots.txt`-blocked, lower priority than
  General Code.
- `00_current_state.md`: Sync 5 Tier 1 complete, 6 of 6 (4 ingested, 2
  partnership-routed).

## Still open (unchanged by this recon)

- **`build-corpus-snapshot` refresh + retrieval-api redeploy** — owed
  for the four merged-but-undeployed Sync 5 cities (Round Rock, Taylor,
  Leander, Georgetown). Per the operator's instruction this is batched
  into the end-of-QA deploy; not run here.
- **ICC Layer 1 corpus ingest** — gated on the operator's ICC Code
  Connect credentials; a separate post-credentials dispatch. The
  prebuild is complete (adapter PR #24 merged; extractor PR #25 + eval
  rubric PR #26 open for review).
- Tier 2 metros (Austin, San Antonio, Fort Worth, …) are the next
  ingest ladder per the ADR-019 / Sync 5 dispatch.

## Durable record

No code change, so no PR — this `_inbox/` recon drop is the courier
copy per HR-11. The verification commands are reproducible:
`api.municode.com/Clients/name`, the two `robots.txt` files, and the
live HTTP status checks against eCode360 / EncodePlus.
