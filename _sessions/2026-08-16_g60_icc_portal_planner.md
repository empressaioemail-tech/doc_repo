---
date: 2026-08-16
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: G-60 ICC observer portal (A-032)

## What was done

Same manner as A-031. Plan review owns the ICC portal UI. Activity table is the demo store. Command Center is not the portal. Planner did not seed rows.

Decision `_decisions/2026-08-16_plan_review_owns_icc_portal.md`. OPS-17 A-032. WDLL A-011. Observer gate lands on `/icc/activity`. Portal shows actor, entitled books, fixture rate, source split, and a table with timestamp/source/book/section/engagement/rate/amount/tier.

Plan-review origin `a864f48` serving `plan-review-00012-pen` @100% tag `g60g`. UI `dpl_8KedsRJVn1UaJ32izvoY8oJQboa2`. Live GET activity host=plan-review n=27 amount=0.27 (plan-review-ui 24, mcp:codex_override_write 2, mcp:codex_finding_generation 1). Unauthed `/icc/activity` and `/icc` 401. Observer BFF 200 same n. No INSERT this wave.

## What was learned (changes to ground truth)

A meter pane of ids is not the ICC portal. The walk-close n=7 is stale; later reviewer and MCP calls accrued to 27 without planner seeding. Hauska inbound meter on existing ICC atoms still waits G-30.

## What's still open

WDLL 7/13/18/19. Token-room after reviewer share. ICC store UPDATE. F4 pending DID. L26 holds `--apply`. G-58b DROP.

## Suggested canonical doc updates

Already applied: `_STATE.md`, OPS-17 A-032, WDLL item 21, pickup, scratch, `00_current_state.md`.
