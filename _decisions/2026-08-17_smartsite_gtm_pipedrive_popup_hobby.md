---
decision_id: 2026-08-17_smartsite_gtm_pipedrive_popup_hobby
date: 2026-08-17
owner: operator
status: active
related_canonical:
  - _decisions/2026-08-17_qa_launch_current_map.md
  - 76j_smartsite_launch_readiness_program.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - 90_operations/QA_polish_register.md
  - _decisions/2026-08-17_g63_feed_adapter_contract.md
---

# Decision

Smart Site checkout feeds Pipedrive with a `smartsite` tag and a user-tier tag. Self-serve pricing is a popup in the same shape as the landing signup modal, not a full pricing page. Vercel Hobby stays. Stripe checkout is mechanically live; remaining work is polish, amounts vs the locked ladder, and this Pipedrive plus popup work.

## Context

Operator walked the live checkout 2026-08-17 and confirmed the path works. Planner had recommended Stripe plus an affiliate platform with no CRM for the humanless motion. Operator overruled: Pipedrive is the CRM, tagged by product and tier. G-63 still refuses Pipedrive as a city feed. Those are different uses. Hobby remains, so PE stays at 11 of 12 serverless functions.

## Structural commitment check

- Sell reasoning, not data: unchanged. Checkout does not sell data dumps.
- Confidence earned, not asserted: CRM tags must come from Stripe webhook entitlement, not from the client asserting a tier.
- Cost per jurisdiction: unchanged.
- Dual interface: popup is a PE UX; MCP is not the billing surface.

## Reasoning

A subscriber in Pipedrive with `smartsite` plus `solo` / `studio` / `team` / `free` lets Solutions and municipal work see who is already a Smart Site user without putting CRM on a city dashboard. The writer of that fact is the Stripe webhook, same as the trading-cockpit rule that the client cannot self-upgrade. A full pricing page is extra surface on Hobby and fights the lander pattern already in use. Amounts on live Stripe prices are still 2900/6500/9900 against the locked 4900/12900/29900; that rebuild stays 76j, not a silent catalog edit during polish.

## Reversal criteria

Reverse Pipedrive if the webhook cannot write tags without a client-side CRM key, or if a Pipedrive person becomes a Dashboards city feed. Reverse the popup if Team seat management cannot fit the modal and a dedicated page is required. Reverse Hobby if a twelfth BFF is required for checkout or Pipedrive proxy and Pro is then cheaper than a function merge.

## Dependencies

Depends on: live Stripe webhook already minting entitlement; Pipedrive API credentials in Secret Manager, not in the PE bundle. Blocks: treating G4 as "no CRM". Does not block: map QA on the current deploy. Does not unblock: Harris PBF restart.

## Counterparties

Internal: Nick. Pipedrive is the Smart Site subscriber CRM. Affiliate platform (Rewardful class) is still the unpaid-acquisition tool, not a substitute for this tag.
