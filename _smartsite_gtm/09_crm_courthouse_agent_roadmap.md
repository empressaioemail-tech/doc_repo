---
id: crm_courthouse_agent_roadmap
title: CRM, Stripe, GHL, courthouse and agent-exposure roadmap — 2026-09-02 thread
status: active
last_updated: 2026-09-02
applies_to: smart_site
owner: nick
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _sessions/2026-09-02_smartsite_gtm_courthouse_and_lane_mimicry_claude_code
  - _decisions/2026-09-02_smartsite_dashboard_mode_parked_v2
  - _smartsite_gtm/06_consolidated_roadmap
purpose: A benchmarkable row-per-item tracker for everything that came out of the 2026-09-02
  CRM/Stripe/GHL/courthouse conversation. Each row names a pass/fail instrument, the way
  90_operations/OPS-16 does portfolio-wide, so status is checked against evidence rather than
  narrated. This is a thread-scoped companion to 06_consolidated_roadmap, not a replacement —
  where a row graduates to a real OPS-16 plan row (P-113 already has), this doc points at it
  rather than duplicating its detail.
---

# CRM, Stripe, GHL, courthouse and agent-exposure roadmap

Rule inherited from OPS-16: work that cannot name a row ID here, or point at the OPS-16 row it
graduated to, is not scoped. Status is re-graded by instrument, not by narration.

| ID | Item | Status | Plan-row | Pass/fail instrument | Next action |
|---|---|---|---|---|---|
| R1 | Stripe live-activation cutover | BLOCKED on A-062 | P-97 | The 20-item checklist in `_inbox/2026-08-31_p97_stripe_live_activation_checklist.md`, specifically item 17 (bad signature returns 400) and item 18 (one real purchase per SKU) | Close A-062 (PE billing portal), then run Phase 0 through 3 in order |
| R2 | Demo/beta QA access for the cutover (~1 week, heavy use) | MECHANISM EXISTS, not yet exercised for this window | P-97 (checklist item 9) | A live-mode 100%-off promo code created, redeemed by a real tester account through the real checkout path, entitlement confirmed via `/entitlement`, not a bypass flag | Create the live promo code as part of P-97 step 9; scope its expiry to the QA window |
| R3 | Which GHL motion to build out next | DECIDED — affiliate/partner CRM depth | P-99 | An operator decision naming one of: subscriber marketing/lifecycle (locked to this per the humanless ruling), affiliate/partner CRM depth (P-99, already has a live pipeline), or Solutions/municipal (separate sub-account, full machinery allowed) | Not yet carded: define the specific affiliate/partner CRM depth buildout against P-99's live pipeline and card it |
| R4 | Affiliate program info tab on Settings | DECIDED — in-product explainer | none | A plan row exists and a build closes it against a stated acceptance test | Resolved 2026-09-03: an in-product explainer of the affiliate program, living in the Settings panel (not a separate canonical doc). Not yet carded — needs a P-xx row and acceptance test |
| R5 | Courthouse records: reliability hardening (block-parser widen, Caldwell/McLennan live) | DISPATCHED, NOT YET CONFIRMED RUNNING | P-113 | `_inbox/2026-09-03_p113-reliability_cp1.json`, `_cp2.json`, `_close.json` | Verify both worktrees show real commits (see R8); read CP1 when it lands |
| R6 | Courthouse records: agent exposure via MCP | DISPATCHED, NOT YET CONFIRMED RUNNING | P-113 | `_inbox/2026-09-03_p113-mcp_cp1.json`, `_cp2.json`, `_close.json` | Verify the worktree shows real commits (see R8); read CP1 when it lands |
| R7 | Map-imagery-currency (capture-date surfacing), the horizontal accuracy item from the Tammy conversation | NAMED, not scoped | none | No instrument yet — this row is not real work until it has a plan row | Decide whether this becomes its own P-xx or folds into an existing map-quality row; the operator's own framing is that this benefits every report, not one persona, so it should not be scoped as an insurance feature |
| R8 | The two P-113 lane-planner windows | Verified 2026-09-03 directly against both worktrees (not a close artifact): both still byte-identical to `origin/main 416861e6`, zero commits, clean status — the hand-carry had not happened. Operator confirmed the windows were not yet open. `code -n "P:/tmp/ldt-p113-reliability"` and `code -n "P:/tmp/ldt-p113-mcp"` run this session to launch genuinely new OS windows. Awaiting operator to confirm each window's file explorer shows the correct root, then paste the compiled dispatch | P-113 | `git log`/`git status` directly on both worktrees, not a self-reported close artifact | Operator: confirm both new windows rooted correctly, then paste `_dispatches/2026-09-03_p113-reliability_dispatch.md` into the reliability window and `_dispatches/2026-09-03_p113-mcp_dispatch.md` into the mcp window |
| R9 | Dashboard mode | PARKED for v2 | none | N/A while parked | None now; reversal criteria in `_decisions/2026-09-02_smartsite_dashboard_mode_parked_v2.md` |
| R10 | `permitRecord` schema (`0055_permit_record.sql`) population and wiring | UNVERIFIED, surfaced incidentally | none | A query against the live table plus a trace of any writer that populates it | Not scoped into P-113; worth its own short read given the Tammy building-permit thread |
| R11 | "Totality" = Cotality confirmation | CONFIRMED YES 2026-09-03, plus new fact: operator states Cotality "came back around" and a few specific pieces of missing data will be sourced from them. This is NARROWER than the reversal criteria in `_decisions/2026-07-13_cotality_swap_public_record_migration.md` (which requires Cotality returning with production keys + entitlements to flip provider priority) — scope, credential, and contract status are still unspecified. The standing "Cotality extinguished — re-route, never rotate its credential" directive (`.cursor/rules/read-state-first.mdc`, `_STATE.md`, MEMORY.md) stays in force until this is firmed up | none | An explicit operator yes/no, then a scoped statement of what changed | Addendum filed 2026-09-03 on the 2026-07-13 decision recording this. Operator: name which specific data pieces, whether a new credential/contract exists, and whether the "never rotate its credential" instruction changes, before this reaches pitch material or code |

## Reading this table

Rows with a plan-row are real work with a machine-checkable close; rows without one are not
scoped yet regardless of how much conversation they consumed. R7, R11 and R4 are the three
most likely to quietly vanish if nobody re-reads this table — none of them has an instrument
yet, which is the same shape OPS-16's own "no dispatch without a row" rule exists to prevent.
