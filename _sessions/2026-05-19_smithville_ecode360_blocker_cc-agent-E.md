---
id: 2026-05-19_smithville_ecode360_blocker_cc-agent-E
title: Session — Smithville eCode360 re-deferral with structural-blocker finding
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: recon
rolled_up: false
rolled_up_into: []
related:
  - _sessions/2026-05-19_sync_4_5_close_cc-agent-E
  - _decisions/2026-05-19_sync_4_5_and_cortex_sprint
  - 51_substrate_v1_sprint
  - CLAUDE.md
---

## TL;DR

Picked up the deferred Smithville eCode360 thread (Phase D of the 2026-05-19 Sync 4.5 dispatch). Live recon surfaced that the deferral is **structural**, not just engineering-scope: eCode360 actively blocks programmatic access and Smithville's city website does not host the code outside eCode360. The earlier deferral framing ("current eCode360 adapter is stub; ~1 session build-out") under-described the obstacle. No code changes this session — re-deferring with the upgraded finding so planning can route correctly.

## What was learned

Three load-bearing facts:

1. **eCode360 returns HTTP 403** to programmatic requests on both default ingest user-agent (`HauskaEngineIngest/0.1`) and a full Mozilla/Chrome browser user-agent. CloudFlare or similar bot-protection layer is active. The 403 fires on the Smithville landing URL (`ecode360.com/SM6484`) before any selectors / TOC walk can run.

2. **`ecode360.com/robots.txt` explicitly disallows** `/documents/`, `/search`, `/archives/`, `/admin/`, `/attachments/`, `/dashboards/`, and `/user/` for the catch-all user-agent. Bing, Yahoo Slurp, Semrush, Apple's crawler, and others are fully blocked. Only Swiftbot has a narrow allow for specific paths. Building a scraping adapter would violate the published policy regardless of whether bot-protection blocked the request.

3. **eCode360 has a documented partner API** — General Code's eCode360 API. Existing partners include GovPilot, Municity, MuniCollab; the API "allows partner communities to seamlessly integrate content into their own systems and platforms." This is the right substrate-access path per CLAUDE.md Commitment #2 (partnership-first sourcing). It requires General Code partnership negotiation; engineering can't get there alone.

Additional probe: **Smithville's city website does not host the full code as an alternate PDF.** The Planning & Zoning page (`ci.smithville.tx.us/236/Planning-and-Zoning`) links only application forms, the zoning map, and a solar-zoning clarification memo. The older `easyedit.ci.smithville.tx.us/.../Smithville_Zoning_Ordinance_v9_10_16_18_FINAL.pdf` URL surfaced in search returns HTML (404 / no longer hosted). The Bastrop County workaround pattern (city-hosted PDF substituting for the Municode source) does not apply here.

## What is now ruled out

- **Direct scraping of eCode360.** ToS / robots.txt / 403 all converge on "don't". Even if technical circumvention worked, it would violate partnership-first commitment and Hauska's narrative as a structural licensor partner, not a scraper.

- **Building a scraping adapter as ~1-session engineering work.** Wrong frame. The prior deferral note in `_sessions/2026-05-19_sync_4_5_close_cc-agent-E.md` characterized the work as ~1 session, same shape as the MunicodeHtmlAdapter port. That estimate assumed open programmatic access; it doesn't apply when the source platform actively blocks programmatic access.

## What is now in scope (for planning)

Two viable paths, both bizops-led:

1. **General Code partnership** (preferred). Engage General Code via their partnership program (`generalcode.com/general-codes-partnership-program/`). Outcome: eCode360 API access opens substrate access to *every* eCode360-hosted jurisdiction at once — Smithville plus dozens more across the Sync-5 deferred 16+ TX cities list. Higher up-front bizops cost, much higher leverage. Should be added to `73_partnerships.md` and/or `72_hauska_inc_operations.md`.

2. **Smithville-provided alternate source**. Sylvia or another Smithville contact provides the substantive code as a PDF, Word doc, or text file outside eCode360. Engineering ingests via the existing `RawPdfAdapter` (or extends with a manual-curation adapter if format requires). Faster for Smithville specifically; doesn't open the platform door.

Both routes require operator + counterparty engagement. Neither is in cc-agent-E's lane.

## What's still open for cc-agent-E

The session-summary's follow-on queue from the prior session stands as written, with one update:

- **Smithville eCode360 adapter** → **Smithville source-access bizops** (re-routed; no longer presented as ready-to-execute engineering work)
- Elgin Chapter 48 budget bump (~30 min refinement)
- Bastrop B3 successor watch (no action today)
- Cost-capture instrumentation validation (no action today)
- Lane A.2 — L-surface atom shapes per `_dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes.md` (the original Sync 4.5 dispatch's named next-up hand-off)

Operator decision in-session 2026-05-19: re-defer with the richer finding; free cc-agent-E to pick up Lane A.2 or Elgin Ch 48 next.

## Suggested canonical doc updates

[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points — Smithville-deferred note should be upgraded from "eCode360 adapter required" to "eCode360 partnership-or-alternate-source required; not ready-to-execute engineering work".

[`73_partnerships.md`](../73_partnerships.md) (or `72_hauska_inc_operations.md` if cleaner) — add **General Code (eCode360 platform partnership)** as a partnership target. Driver: opens substrate access to every eCode360-hosted jurisdiction (Smithville + many others). Pattern fits Commitment #2 partnership-first sourcing.

[`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) §Sprint amendments — Amendment 4 noting the Smithville re-deferral with the upgraded structural-blocker context. Reversal-criteria framing doesn't change (Sync 4.5 stays at 3 of 4); the upgraded note just makes the gate-condition explicit so future sessions don't re-attempt scraping.

## Commit batch

None — no code changes this session. Engine repo state at HEAD matches PR #6 squash-merge (`3c256b5`). doc_repo carries this session summary.
