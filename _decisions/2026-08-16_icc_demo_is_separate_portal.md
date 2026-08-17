---
decision_id: 2026-08-16_icc_demo_is_separate_portal
date: 2026-08-16
owner: nick
status: active
related_canonical: [_decisions/2026-08-16_icc_demo_is_the_joint_done_line, _decisions/2026-08-16_plan_review_owns_icc_portal, 75n_icc_code_connect_catalog, _decisions/2026-08-15_icc_first_sdk_customer, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

ICC-demo is a separate portal on a separate domain. It is the access path for people who pay to use licensed intellectual property. Plan review cites that IP. It is not the portal. Command Center is not the portal.

## Context

Operator 2026-08-16: ICC Demo is a path for all of our people who are paying for their intellectual property to access. It is a separate portal and should be a separate domain in and of itself. A-032 had put `/icc/activity` on plan-review-app as an observer tab. That is reversed. `_decisions/2026-08-16_icc_demo_is_the_joint_done_line.md` already named this reversal: reverse `/icc/activity` on plan-review-app only if a separate ICC portal host is created. This is that host.

## Structural commitment check

- Sell reasoning, not data: aligned. Portal shows entitled IP, usage, and accrual. No verbatim ICC body (75n).
- Tenant sovereignty: aligned. Gated. Unauthed ICC content 401. PoC is not customer-facing until G-50 SaaS (75n).
- Dual interface: aligned. This portal is the human door. MCP `icc_activity_list` stays the agent door on the one Hauska MCP server.
- Brand: aligned. Empressa product surface. Catalog and meter remain Hauska. Codex plan review remains the citing product. ICC is the first IP source, not the only future source on this door.
- Catalog thesis: aligned. Not a catalog-level v1 web UI. Not a second MCP. Not a second ledger. Activity still reads the plan-review activity table until the Hauska inbound meter is live (A-028).

## Reasoning

People who pay to access licensed IP need a door that is not the reviewer's engagement UI. Plan review is one citing surface. Property Explorer is another citing surface later. The portal is where access, entitlement, and payment proof live for those people. ICC is the first licensor on that door (`did:hauska:actor:org:icc`, 75n). Gluing that door onto plan-review-app makes ICC a reviewer persona. A separate domain makes the product true.

Custom DNS: operator named the product **ICC-demo**. Vercel alias https://icc-demo.vercel.app points at `icc-portal-app`. Apex or `hauska.dev` names stay held. Do not steal `mcp.hauska.dev`. Do not use plan-review-app or smart-files-app or cmdcenter.

## Reversal criteria

Reverse only if the operator names plan-review-app or Command Center as the ICC Demo host. Do not reverse to a path on plan-review to save a Vercel project. Do not copy activity onto a second database to look more isolated.

## Dependencies

Reverses A-032 / `_decisions/2026-08-16_plan_review_owns_icc_portal.md`. Amends the joint done line format item that placed `/icc/activity` on the plan-review host. Does not reverse A-031 (files UI). Does not reverse A-028. G-50 signed SaaS and public-paid stay OPEN. Circle stays out. Planner does not seed activity rows.

## Counterparties

ICC (first IP source; Ed Cilurso per 2026-07-04 play). Paying IP-access users. Internal: operator, G-60 planner. Not: plan-review reviewers, SmartCity MyGov, Command Center.
