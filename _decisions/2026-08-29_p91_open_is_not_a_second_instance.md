---
decision_id: 2026-08-29_p91_open_is_not_a_second_instance
date: 2026-08-29
owner: integration (this seat), pending operator go on item 13
status: superseded
superseded_by: _decisions/2026-08-29_p91_open_stays_a_turn.md
supersession_note: Operator ruled 2026-08-29 (deep-dive conversation) that every opened parcel must land in Claude's context, which selects this record's own reversal clause 2 ("keep Open as a turn and stop lying on the board") over the in-place cut. Item 13 is unchanged. O1-O3 are folded into the p555 Connect grade (build plan section 8) rather than gating the build; the operator's "build to deploy" go supersedes the ship hold here. Mechanism and reasoning sections stand.
verification_pending:
  - O1 boot strip caps= on live p554
  - O2 gold Open: board dead at 12s and parcel in a new panel, or board becomes the parcel (withdraws this)
  - O3 miss Open: new panel is F5 empty copy, or no panel mounts
related_canonical:
  - _inbox/2026-08-29_p91_mcp_app_deep_dive.md
  - _inbox/2026-08-29_p91_mcp_app_deep_dive_handoff.md
  - _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
  - _inbox/2026-08-29_p91_companion_ux_walk.md
---

## Decision

Do not ship p555 until O1, O2, and O3 on serving p554 are recorded. The working mechanism is one MCP App instance per tool call; `ui/message` replies are acks; a later `get_smart_site` mounts a second instance. F6 step 2 as written (miss sentence on the clicking board after Send) cannot be met on that host. If O1 names `serverTools`, the intended cut is in-place Open via an app-initiated `get_smart_site`, which amends WDLL item 13. That cut waits on the three observations and an operator go.

## Context

This seat called F6 step 2 host-starved and told the operator to wait on Anthropic. The operator rejected that. A second seat read the write path, the spec, and two independent harnesses (`_inbox/2026-08-29_p91_iframe_instrument.mjs`, `_inbox/2026-08-29_p91_iframe_harness.mts`) and named a third mechanism: we graded the wrong instance. Gold already painted in a `get_smart_site` iframe (scratch 2026-08-29T04:05Z). Four URI punches changed miss JSON, not which instance receives it.

## Structural commitment check

Sell reasoning, not data: the board must show miss, upgrade, and dead as different sentences.
I1: an app-initiated `get_smart_site` is the same tool the conversation calls.
I5 and I6 unchanged. No 14th tool.

## Reasoning

`NOT_ON_FILE` is written only inside `accept()` and only when that instance holds `openWait`. A fresh instance never ran `sendOpen`, so a miss payload there can only paint F5 empty. The clicking board arms a 12s timer, gets `{}` back, and paints dead-Open on gold and miss alike. That pair was never scored because gold grades looked at the second panel.

## Reversal criteria

O2: the original board becomes the parcel. Withdraw this record.
O1: `caps=` has no `serverTools`. Then in-place Open is unavailable; re-specify F6 to the second-instance sentence or keep Open as a turn and stop lying on the board.
A documented host consent prompt on every app-initiated call that makes in-place Open worse than Send.

## Dependencies

Item 13 amendment and p555 wait on O1-O3 plus operator go. Cortex leftover hunks are a separate write; do not commit them until the fail-open existence check is fixed. `ask_the_map` not_ready and Free-tier Open are operator calls, not this record.

## Counterparties

Internal. Operator. Claude host behavior is an input, not a ticket we file.
