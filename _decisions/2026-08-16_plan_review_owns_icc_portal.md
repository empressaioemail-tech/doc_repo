---
decision_id: 2026-08-16_plan_review_owns_icc_portal
date: 2026-08-16
owner: nick
status: reversed
superseded_by: 2026-08-16_icc_demo_is_separate_portal
related_canonical: [_decisions/2026-08-16_plan_review_owns_files_ui, _inbox/2026-08-16_icc_demo_program_WDLL, 90_operations/OPS-17_govtech_stack_plan_of_record, _inbox/2026-08-16_blueprint_icc_compliance]
---

# Decision

Plan review owns the ICC activity portal UI. The plan-review activity table is the backend store for this demo. Command Center is not the portal. Planner must not seed activity rows.

## Context

Operator 2026-08-16: capture the files-UI state, then do the ICC portal in the same manner. Same manner means the function lives on plan review, plan review has its own UI, the backing store is not the product surface, and the planner does not write seed data. A-031 already did that for files. This is the observer half.

**Reversed 2026-08-16.** Operator: ICC Demo is a path for all people paying for intellectual-property access. It is a separate portal and a separate domain. Gluing `/icc/activity` onto plan-review-app was the same class of miss as sending the applicant to smart-files-app. Successor `_decisions/2026-08-16_icc_demo_is_separate_portal.md`.

## Structural commitment check

- Sell reasoning, not data: aligned. Portal shows citation activity, not ICC body.
- Tenant sovereignty: aligned. Gated observer persona. Unauthed ICC remains 401.
- Dual interface: aligned. `/icc/activity` is the human door. MCP `icc_activity_list` is the agent door against the same table.
- Brand: aligned. Codex plan review is the Empressa product. ICC watches it here. Hauska MCP stays one server.
- Catalog thesis: aligned. Do not send ICC to Command Center. Do not stand up a second ledger or a second MCP.

## Reasoning

A one-line dump of activity ids is a meter pane, not a portal. ICC needs actor, entitled books, fixture rate, source split (plan-review UI vs MCP), book, section, engagement, amount, and purge selectors on this host. The Hauska inbound meter on existing ICC atoms still waits a quiet L26 slot (A-028). Until that UPDATE, this table is the honest demo store. Seeding extra rows from the planner would fake accrual the walk did not earn.

## Reversal criteria

Reverse only if the operator names Command Center as the ICC portal, or if a live inbound ledger on hauska_mcp becomes the store and this table is retired by a named amendment. Do not copy activity onto cortex-prod to look more official.

Fired 2026-08-16: operator named a separate ICC Demo portal and domain, not a plan-review route.

## Dependencies

Does not reverse A-028 (no store UPDATE while L26 holds the slot). Does not reverse A-031. OPS-17 A-032. G-60 WDLL A-011. G-50 SaaS and public-paid stay out.

## Counterparties

Internal: operator, G-60 planner. Product UI: plan-review. Agent door: Hauska MCP `icc_activity_list`. Not Command Center. Not smart-files-app.
