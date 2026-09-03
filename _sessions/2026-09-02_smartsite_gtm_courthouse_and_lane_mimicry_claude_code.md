---
date: 2026-09-02
topic: Smart Site CRM/Stripe/GHL exploration, dashboard-mode ideation (parked v2), courthouse records audit and P-113 dispatch, first live use of the hand-carried lane-planner mechanism
agent: claude_code (planner)
plan_row: P-113 ADDED (OPS-16 A-077)
related: [90_operations/OPS-16_texas_market_plan_of_record, _catalog/seat_register.json, _decisions/2026-09-02_smartsite_dashboard_mode_parked_v2, _smartsite_gtm/09_crm_courthouse_agent_roadmap]
---

# Session: CRM/Stripe/GHL chat that became a courthouse dispatch and a roadmap

## Summary

Opened as an exploratory "let's chat about CRM, Stripe, GHL on Smart Site" conversation and
covered a lot of ground before landing on one concrete piece of execution. Worked through,
roughly in order: current state of the Stripe live-activation checklist (P-97) and the
GoHighLevel buildout (P-99); a demo/beta QA access mechanism for the Stripe cutover; a GHL
"how much more can we build" exploration that forked by motion (subscriber-marketing-only vs.
affiliate/partner vs. Solutions/municipal); a positioning thread from a conversation with Tammy
(distribution hire, ex-insurance) that reframed as evidence for a horizontal accuracy bar
rather than an insurance vertical; a courthouse-records interface idea that went through three
shapes (right-rail panel, full-screen viewer, then a whole-layout "dashboard mode" with the map
docked) before the operator parked the entire dashboard-mode line for v2 as too much work right
now; a real audit of the current courthouse/records-request capability against live code; and,
at the end, the first actual use (rather than description) of the hand-carried lane-planner
dispatch mechanism, opening two lanes under the existing property seat.

## What's durable now

**P-113 opened** (OPS-16 A-077): courthouse records reliability hardening plus agent exposure.
Audited against live `origin/main` (legacy-design-tools `416861e6`, hauska-mcp-server
`40e48d48`), not the stale local checkouts. Findings: `records-request-worker` already drives
real Playwright sessions against county clerk portals, one recipe per vendor platform
(Aumentum/Tyler/GovOS), four counties live (Bastrop, Travis, Williamson, Hays), two scaffold
only (Caldwell, McLennan). A named reliability defect is open: 21 of 36 issued jobs carry a
silently wrong search term (`_inbox/2026-08-31_p85_block_job_audit.md`), held pending an
operator portal-access ruling. Vision-read and instrument classification already run on every
purchased document, but zero MCP tool anywhere exposes it to an agent (verified: zero hits in
`hauska-mcp-server`, one unrelated hit in `smartsite-mcp`). Two worktrees registered under the
existing `property` seat (`legacy-design-tools-p113-reliability`,
`legacy-design-tools-p113-mcp`), two dispatches compiled and hand-carried
(`_dispatches/2026-09-03_p113-reliability_dispatch.md`,
`_dispatches/2026-09-03_p113-mcp_dispatch.md`). This is the first time this session actually
ran the compile-and-hand-carry mechanism the operator described, rather than being told about
it.

**Dashboard mode parked for v2**, decision record filed
(`_decisions/2026-09-02_smartsite_dashboard_mode_parked_v2.md`). A working HTML shell was built
and published as a Claude Artifact against the real Stone token contract before the operator
called it out as more work than warranted right now; it stays as reference for when v2 opens.

**A permit-record schema already exists** (`lib/db/drizzle/0055_permit_record.sql`), surfaced
incidentally while auditing the courthouse worker, unverified whether populated or wired to
anything. Not scoped into P-113. Worth its own look given the Tammy conversation's building-
permit thread.

**Stripe demo/beta access is not new work.** `_inbox/2026-08-10_smartsite_humanless_gtm_handoff.md`
already records external testers running real checkout with live Stripe promo codes rather
than a bypass, shipped 2026-08-05. For the ~1 week of heavy QA the operator wants around the
live cutover, this is a live-mode promo code (P-97 checklist item 9), not a new mechanism.

## What's still open, carried into the roadmap

Which GHL motion to build out next (subscriber marketing, affiliate/partner CRM depth, or
Solutions/municipal) — operator has not chosen. An affiliate-program info tab on Settings,
scoped in conversation but not carded; "docs on it" is ambiguous between in-product help copy
and a canonical doc, unresolved. The map-imagery-currency item from the Tammy conversation
(capture-date surfacing, a horizontal accuracy improvement per the operator's own framing, not
an insurance feature) is named but has no plan row yet. The "totality" / Cotality confirmation
from earlier in the conversation was never explicitly answered by the operator; flagged again
in the roadmap rather than assumed either way. Full tracking table:
`_smartsite_gtm/09_crm_courthouse_agent_roadmap.md`.

## The lane-planner mechanism, first real use

The operator walked through the mechanism verbally (seat registry, `seat-worktree-gate` hook,
`scripts/dispatch.mjs` compiling canon preamble + agent contract + dev process + fleet memory +
plan-row into one pasteable block, hand-carried into a fresh window, verified and committed by
the planner, never by the executor session). This session then actually used it: registered two
worktrees under the existing `property` seat (both repos this work touches were already
property's, so this was two new entries under an existing seat, not a new-seat setup), ran
`scripts/dispatch.mjs` twice, hand-wrote both mission sections (the compiler leaves a
placeholder), created both git worktrees, and handed both compiled blocks to the operator to
paste. Open at session close: the operator reported the two new windows as idle after pasting;
diagnosis not yet complete, exact session identity of the two new windows not yet confirmed
against `ListAgents`' three recently-started peer sessions.

## leave_behind

    leave_behind:
      - item: confirm which of the three recently-started doc-repo-* peer sessions are the
              two P-113 lanes, and why they read as idle after the dispatch was pasted
        owner: operator (session identity) + planner (once identified)
        plan_row: P-113
      - item: GHL motion decision (which of the three to build out next)
        owner: operator
        plan_row: unassigned
      - item: map-imagery-currency item, needs a plan row before it is scoped work
        owner: unassigned
        plan_row: unassigned
      - item: affiliate Settings tab, "docs on it" meaning unresolved
        owner: operator
        plan_row: unassigned
      - item: permitRecord schema population/wiring, unverified
        owner: unassigned
        plan_row: unassigned
