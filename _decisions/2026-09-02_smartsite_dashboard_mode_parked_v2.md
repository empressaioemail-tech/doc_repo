---
decision_id: 2026-09-02_smartsite_dashboard_mode_parked_v2
date: 2026-09-02
owner: operator
status: active
related_canonical:
  - _sessions/2026-09-02_smartsite_gtm_courthouse_and_lane_mimicry_claude_code
  - _smartsite_gtm/09_crm_courthouse_agent_roadmap
---

# Decision

The Smart Site "dashboard mode" concept (a one-click toggle that locks the whole layout from
map-first into a two-pane workspace, map docked small, a records/document viewer taking the
freed space) is PARKED. It is a v2 product feature, not current work. A shell was built and is
kept as reference; nothing further is scheduled against it.

## Context

The idea developed over several turns: a courthouse-records display need led to a right-rail
panel proposal, then a full-screen document-viewer proposal, then a whole-layout dashboard-mode
proposal with the map docked. The operator asked for a visual shell before wiring anything up.
An HTML shell was built against the real production Stone token contract (not invented colors)
and published as a Claude Artifact, with a working mode toggle, tab switching, and a
draggable/collapsible divider. The operator then called it: "we are going to drop the dashboard
endeavor for now... it will be too much work to get even the shell right let alone the whole
dash as well. that will be a v2 product feature."

Separately, and load-bearing for why the courthouse work did NOT stall alongside it: the
literal "iframe to courthouse" mechanism this dashboard idea depended on for its Courthouse tab
was checked and found blocked. Bastrop and Travis's clerk portals both send
`X-Frame-Options: SAMEORIGIN`; Williamson's GovOS host sets an httpOnly session cookie that
would not survive cross-origin framing either. The shell's Courthouse tab was built as a
styled index list instead, matching what a real mechanism would need to serve, but the
mechanism itself (server-side fetch and re-serve, most likely) is a separate open question from
the layout question. This did not cause the parking decision — the operator parked the whole
line on effort grounds independent of this finding — but it means dashboard mode v2, whenever
it resumes, inherits an already-known access-mechanism problem on its most novel pane rather
than starting clean.

## Structural commitment check

- Sell reasoning, not data: not affected; no product surface shipped.
- Tenant sovereignty: not affected.
- Dual interface: the shell as built is human-UI only; no agent-facing equivalent was designed
  or promised. If v2 resumes, the dual-interface commitment applies to whatever replaces this,
  not to the parked shell itself.

## Reasoning

The operator's own words carry the reasoning: the cost of getting even the visual shell right,
let alone the full docked-map dashboard experience, is more than the current thread warrants
against everything else in flight (P-97 Stripe cutover, P-99/GHL, P-113 courthouse). Parking
now, before any wiring work started, is cheap; the shell exists as a design reference so
resuming later does not start from zero.

## Reversal criteria

Reverse (resume the line) when the operator names it as a wave in a roadmap or plan row with
its own P-xx. Reverse if the courthouse work under P-113 reaches a point where a real UI
surface for purchased documents is needed and a right-rail panel or full-screen viewer proves
insufficient — at that point re-evaluate whether dashboard mode's docked-map layout is the
right answer or whether a simpler surface suffices, rather than assuming the original design
carries over unchanged. Do not resume by silently building toward it inside another card;
resuming needs its own named row.

## Dependencies

None active. The Artifact (`https://claude.ai/code/artifact/cf74eaac-4792-46d1-ba88-efe9370fe682`)
is the design reference if this reopens. The X-Frame-Options finding above is a dependency for
whichever future work eventually builds the Courthouse tab's real data mechanism, dashboard
mode or otherwise.

## Counterparties

Internal. Operator called the parking; no counterparty outside the portfolio is affected.
