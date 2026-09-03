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
| R3 | Which GHL motion to build out next | OPEN — operator has not chosen | none | An operator decision naming one of: subscriber marketing/lifecycle (locked to this per the humanless ruling), affiliate/partner CRM depth (P-99, already has a live pipeline), or Solutions/municipal (separate sub-account, full machinery allowed) | Ask/decide; card the chosen motion once named |
| R4 | Affiliate program info tab on Settings | SCOPED, not carded | none | A plan row exists and a build closes it against a stated acceptance test | Resolve whether "docs on it" means in-product help copy or a canonical doc, then card |
| R5 | Courthouse records: reliability hardening (block-parser widen, Caldwell/McLennan live) | DISPATCHED | P-113 | `_inbox/2026-09-03_p113-reliability_cp1.json`, `_cp2.json`, `_close.json` | Confirm the lane is actually running (see R8); read CP1 when it lands |
| R6 | Courthouse records: agent exposure via MCP | DISPATCHED | P-113 | `_inbox/2026-09-03_p113-mcp_cp1.json`, `_cp2.json`, `_close.json` | Confirm the lane is actually running (see R8); read CP1 when it lands |
| R7 | Map-imagery-currency (capture-date surfacing), the horizontal accuracy item from the Tammy conversation | NAMED, not scoped | none | No instrument yet — this row is not real work until it has a plan row | Decide whether this becomes its own P-xx or folds into an existing map-quality row; the operator's own framing is that this benefits every report, not one persona, so it should not be scoped as an insurance feature |
| R8 | The two P-113 lane-planner windows | REPORTED IDLE by operator immediately after dispatch, unconfirmed which peer sessions they are | P-113 | `ListAgents` identifying the two sessions by name, then a status check | Operator to confirm the two session names/labels; planner to check `_inbox/` for any CP1 artifact regardless of reported idle state |
| R9 | Dashboard mode | PARKED for v2 | none | N/A while parked | None now; reversal criteria in `_decisions/2026-09-02_smartsite_dashboard_mode_parked_v2.md` |
| R10 | `permitRecord` schema (`0055_permit_record.sql`) population and wiring | UNVERIFIED, surfaced incidentally | none | A query against the live table plus a trace of any writer that populates it | Not scoped into P-113; worth its own short read given the Tammy building-permit thread |
| R11 | "Totality" = Cotality confirmation | UNANSWERED by operator across two turns | none | An explicit operator yes/no | Ask directly before this assumption reaches any pitch material naming a permit/roof data source |

## Reading this table

Rows with a plan-row are real work with a machine-checkable close; rows without one are not
scoped yet regardless of how much conversation they consumed. R7, R11 and R4 are the three
most likely to quietly vanish if nobody re-reads this table — none of them has an instrument
yet, which is the same shape OPS-16's own "no dispatch without a row" rule exists to prevent.
