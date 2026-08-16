---
decision_id: 2026-08-16_g60_does_not_wait_on_l26
date: 2026-08-16
owner: nick
status: active
related_canonical: [_inbox/2026-08-16_icc_demo_program_WDLL, 90_operations/OPS-17_govtech_stack_plan_of_record, _inbox/2026-08-16_icc_demo_planner_pickup, _decisions/2026-08-16_icc_demo_is_the_joint_done_line]
---

# Decision

G-60 does not wait for L26 to release the atoms bulk-writer slot. Store-side ICC UPDATE (G-30 existing rows, G-17 actor stamp, F4 engine ingest) is a named residual, not a demo gate. Slot-free work continues: MCP read-path withhold of ICC for anonymous callers, walk, honest close. No second `--apply`. No G-58b DROP.

## Context

L26 holds `--apply` for Texas flood/metro drain and will stay live. G-60 WDLL items 7, 18, and 19 were written as if a bounded ICC UPDATE could run as soon as the slot was quiet. Operator 2026-08-16: L26 will not be quiet for a while; work around it. Engine PR #346 already removed the ingest hardcode on main (`ebe6d63`). Existing ICC atoms remain `public-free` in the store until a later UPDATE. The leak to close now is the read path, not a competing writer.

## Structural commitment check

- Sell reasoning, not data: aligned. Anon still must not receive ICC bodies. Withhold on the gate until the store stamp matches.
- Tenant sovereignty: aligned. ICC stays platform-internal at the product gate even while store rows lag.
- Dual interface: aligned. One Hauska MCP server. No second writer. Codex reviewer path unchanged.
- Cost per jurisdiction: not in scope. Texas ingest stays L26's.

## Reasoning

A second atoms `--apply` or a concurrent ICC UPDATE against `hauska_mcp` while L26 is in metro drain is the same class of contention the one-bulk-writer-slot law exists to kill. The demo already serves F1-F7, letter, files share, activity portal, and finished MCP on plan-review Cloud Run. Waiting on L26 would park that surface behind an unrelated Texas ingest. The remaining customer-facing defect is anonymous `get_atom` / `list_jurisdictions` seeing ICC while store `accessPolicy` is still `public-free`. That is a gate filter, not a store mutation. F4 pending DIDs stay honest (`pending:plan-review:<id>`) until ingest can run. E6 hauska-map compose is also slot-free but is not required to walk; item 11 stays partial if the walk records the envelope overlay.

## Reversal criteria

Reverse (wait for L26 quiet before any further G-60 close) if a live anon probe shows ICC bodies cannot be withheld without a store UPDATE, and that probe is accepted in writing. Resume the bounded ICC UPDATE the moment L26 releases the slot; do not treat this decision as permission to skip the UPDATE forever. Do not interpret this as permission to start a second `--apply` or to DROP G-58b.

## Dependencies

Depends on engine #346 merged (ingest hardcode gone). Depends on G-60 serving `plan-review-00006-duj` and MCP `hauska-mcp-server-00072-puy`. OPS-17 A-028. WDLL A-008. Store UPDATE remains G-30 / G-17 instrument for the row, not this demo close.

## Counterparties

Internal: operator, G-60 planner, L26 drain custodian. Not ICC as a customer yet. Not Texas ingest.
