---
id: 2026-09-03_planner_handoff_next_session
title: Handoff — restart the CRM/Stripe/GHL/courthouse thread after workspace reorg
date: 2026-09-03
status: active
applies_to: smart_site
owner: nick
purpose: Self-contained restart point for a fresh planner session picking up exactly where
  2026-09-02/03 left off. Read this before re-deriving anything from the roadmap or the
  session summaries; it should save a full re-read.
related:
  - _smartsite_gtm/09_crm_courthouse_agent_roadmap.md
  - _sessions/2026-09-02_smartsite_gtm_courthouse_and_lane_mimicry_claude_code.md
  - _sessions/2026-09-03_p113_dispatch_mechanics_and_workspace_handoff_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Restart point

Read `_smartsite_gtm/09_crm_courthouse_agent_roadmap.md` first. It is the row-per-item,
instrument-graded tracker for everything below; this doc is just the "what's mid-flight right
now" layer on top of it.

## First thing to do on restart

The Monitor and dynamic `/loop` that were watching the P-113 checkpoints belonged to the prior
session and did not carry over. Before anything else:

1. Check whether the two P-113 lanes actually produced anything while this thread was closed:
   ```
   ls _inbox/2026-09-03_p113-reliability_*.json _inbox/2026-09-03_p113-mcp_*.json
   ```
   and separately check both worktrees directly rather than trust any close artifact's own
   claims:
   ```
   cd P:/tmp/ldt-p113-reliability && git log --oneline -5 && git status --short
   cd P:/tmp/ldt-p113-mcp && git log --oneline -5 && git status --short
   ```
2. If either worktree is still byte-identical to `origin/main 416861e6` with zero commits, the
   hand-carry still has not actually happened. Ask the operator whether the two windows are now
   open at the correct paths (see "The rooting problem" below) before re-issuing anything.
3. If work has landed, read and verify the CP1/CP2/close artifacts against the actual repo
   state before reporting anything as done, per this operation's standing rule that a close
   artifact's claims are not self-verifying.
4. Re-arm a Monitor on the same six paths if the lanes are still in flight, and re-enter a
   dynamic `/loop` if the operator wants the same "keep pushing until the roadmap closes"
   posture from the prior session (they asked for this explicitly on 2026-09-02).

## The rooting problem, so it isn't rediscovered

A new Claude Code chat TAB inside an already-open VSCode window inherits that window's
workspace root. It does NOT get its own worktree even if a different worktree path is named in
the pasted dispatch. Two prior attempts to hand-carry the P-113 dispatches failed exactly this
way: both new tabs declared `seat: integration, worktree: doc_repo, branch: main` and correctly
refused to proceed, which read as "idle" from the outside but was the contract working as
designed. The fix is a genuinely new OS-level window:
```
code -n "P:/tmp/ldt-p113-reliability"
code -n "P:/tmp/ldt-p113-mcp"
```
then confirm the window's own file explorer shows that folder as root before pasting anything.
The two dispatch files already carry the full compiled block; do not recompile them unless
their content needs to change:
- `_dispatches/2026-09-03_p113-reliability_dispatch.md`
- `_dispatches/2026-09-03_p113-mcp_dispatch.md`

## P-113, the plan row itself

OPS-16 A-077. Courthouse-records reliability hardening (widen the block-term parser to
letter-only blocks, push Caldwell and McLennan from scaffold to live, re-run 21 held jobs only
after a fresh operator confirmation that the 2026-08-26/Measurement X3 portal-access ruling
still stands) plus agent exposure (a new MCP tool in `artifacts/smartsite-mcp` surfacing the
already-built vision-read/classify output, which today reaches zero agents). Both worktrees
registered under the existing `property` seat in `_catalog/seat_register.json`. Full reasoning
and the audit evidence are in OPS-16's A-077 row; do not re-audit the courthouse system from
scratch, that work is done and cited there.

## Standing operating decision from this thread

The doc_repo planner declined to spawn subagents directly into product repos in place of the
hand-carry mechanism, on the reasoning that product coding is explicitly out of scope for this
seat and the hand-carry step is the deliberate human touchpoint before product code changes.
This stands unless the operator explicitly overrules it in a fresh conversation; do not revisit
it as an open question by default.

## Four items only the operator can resolve

None of these are scoped to a plan row yet. Ask them again if the roadmap still shows them
open when you read it:

1. Which GHL motion to build out next: subscriber marketing/lifecycle (locked to this per the
   humanless ruling), affiliate/partner CRM depth (already has a live GHL pipeline, P-99), or
   Solutions/municipal (separate sub-account, full sales machinery allowed).
2. What "docs on it" meant for the proposed affiliate-program Settings tab: in-product help
   copy, or a canonical doc.
3. Whether the map-imagery-currency item (surfacing aerial capture date, a horizontal accuracy
   improvement, not an insurance feature) gets its own plan row.
4. Whether "totality" in the original Tammy conversation meant Cotality. If yes, building
   permit/roof-age data cannot come from that source (Cotality is extinguished per standing
   ruling) and any pitch material assuming it needs correcting before it goes further.

## Also parked, not forgotten

Smart Site "dashboard mode" (map-docked layout, courthouse/document viewer pane) is parked for
v2 per `_decisions/2026-09-02_smartsite_dashboard_mode_parked_v2.md`. A working shell exists as
a Claude Artifact (`https://claude.ai/code/artifact/cf74eaac-4792-46d1-ba88-efe9370fe682`),
built against the real Stone token contract. Do not resume this line without a named plan row,
per that decision's reversal criteria. Separately, the shell's Courthouse tab cannot literally
be an iframe: Bastrop and Travis clerk portals both send `X-Frame-Options: SAMEORIGIN`; this is
recorded so nobody re-discovers it by trying.

A `permitRecord` schema already exists in the database (`lib/db/drizzle/0055_permit_record.sql`
in `legacy-design-tools`), surfaced incidentally during the courthouse audit, unverified whether
populated or wired to anything. Not scoped into P-113. Worth a short read given item 4 above.
