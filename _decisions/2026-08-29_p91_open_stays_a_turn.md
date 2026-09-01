---
decision_id: 2026-08-29_p91_open_stays_a_turn
date: 2026-08-29
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
  - _inbox/2026-08-29_p91_mcp_app_deep_dive.md
  - _inbox/2026-08-29_p91_build_plan_p555_p542.md
  - _decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

## Decision

Opening a parcel from the Smart Site MCP App board stays a conversation turn. The click drafts a `ui/message`, the user presses Send, Claude calls `get_smart_site`, and the result is in Claude's context because Claude ran it. The panel that the host mounts under that tool row is the honest surface for parcel, miss, and refuse; it paints from the result alone. The board above acknowledges the click ("Sent to chat. Press Send to open.") and says "Open did not reach me" only when no acknowledgement arrives. Screen rows carry rail states from first paint so the board is a screen, not a placeholder. WDLL item 13 is unchanged. WDLL item 16 F6 step 2 is re-specified to the panel under the tool row.

## Context

The deep dive established, from the spec, Anthropic's host documentation, and two independent harnesses, that Claude mounts one app instance per tool call and that the `ui/message` reply is an acknowledgement only. Four URI punches (p551 to p554) changed what a miss looked like and never changed which instance it reached. The deep dive's first recommendation was an app-initiated `tools/call` from the board (Open in place, no Send). The operator rejected that on one criterion: every opened parcel must land in Claude's context, so "can I build a duplex on the one I just opened" answers from context. The widget-to-model channel (`ui/update-model-context`) is reported dropped on both Claude surfaces, so in-place Open would leave Claude blind.

Alternatives rejected: app-initiated Open plus `ui/update-model-context` (channel unreliable today); app-initiated Open plus a second `ui/message` so Claude also runs the tool (double call, double panel); waiting on Anthropic to route later results into an earlier instance (not in the spec; the reference host binds exactly one result per instance).

## Structural commitment check

Sell reasoning, not data: the parcel Claude holds carries citations and dispositions; the panel is a picture of that same result (I1).
Confidence is earned: the miss sentence now names its state (absent versus unbaked) instead of asserting an absence the 404 never checked.
Cost per jurisdiction: no new ingest; rails at first paint reuse the stub assembler the saved list already uses.
Dual interface: MCP-first; the panel renders what the tool returns and nothing the conversation could not call.

## Reasoning

The host's model is one printout per tool call. Designing against it produced four blind ships. Designing with it means the thread reads as a board followed by a trail of parcels, each in Claude's context, which is how Claude's own apps behave. What is given up is Open in place with a Back control, which is chrome. What is kept is the property the operator named as the point of the product.

## Reversal criteria

Claude's `ui/update-model-context` is observed delivering widget context on both web and desktop (a "Reading widget context" step in the turn), at which point in-place Open plus a context push can be carded. Or Anthropic documents a host path that routes a later tool result into an existing instance.

## Dependencies

Build plan `_inbox/2026-08-29_p91_build_plan_p555_p542.md` (p555 iframe and server, p542 cortex). Free-tier gate on MCP (deep dive decision 2) stays open and is not changed by this cut.

## Counterparties

Internal. Operator. No stakeholder message.
