---
id: 2026-06-16_cc-agent-C_commercialization_pipedrive_paywall_gtm
title: cc-agent-C — commercialization layer (paywall, Pipedrive CRM sync, GTM engine over the top)
date: 2026-06-16
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75g_investor_deal_radar, 75h_investor_deal_radar_launch_readiness, 76f_investor_deal_radar_gtm, _decisions/2026-06-16_investor_radar_name_and_pricing, 08_tiered_access_model]
blocked_on: paywall entitlement depends on the Wave 2 profile/auth; Pipedrive needs the operator's Pipedrive API token; GTM events extend the existing observation layer (ready now).
---

# cc-agent-C — commercialization layer

You are **cc-agent-C**. This wires the money and the funnel on top of the investor deal radar: the paywall, the Pipedrive CRM sync, and the GTM engine running over everything. Product: [`75g`](../75g_investor_deal_radar.md), launch shape: [`75h`](../75h_investor_deal_radar_launch_readiness.md).

## Model (HR-12)

Default **Grok Build 0.1**.

## Task 1 — paywall (free vs Pro, flat monthly)

Tier model per [`_decisions/2026-06-16_investor_radar_name_and_pricing.md`](../_decisions/2026-06-16_investor_radar_name_and_pricing.md): free = the radar pass + a capped number of full briefs; Pro = unlimited briefs + the full Cotality underwriting depth + the profile depth + the lead feed. Pro is a **flat monthly subscription**.

- Entitlement on the per-user session (`req.session.requestor.id`) and/or install id. Reuse `brokerage_wallets` as the entitlement store, but the charge is a recurring subscription, not per-compute metering.
- Enforce at the brokerage routes: gate the Pro-only response fields (the Cotality depth, the lead feed) and the brief cap behind entitlement. Free tier still returns the radar verdict.
- **No-lockout rule:** zero/expired entitlement blocks new Pro compute only; it never removes read access to a user's existing saved properties or profile (avoid the auth-orphan trap).
- Billing rail is an open decision (Circle vs a subscription processor for consumer recurring cards); stub the subscription-state interface so the rail can be wired without touching the gate. The extension renders the paywall + upgrade CTA (hand-off to extension-agent).

## Task 2 — Pipedrive CRM sync (the operator's GTM/sales pipeline)

Link the funnel into the operator's Pipedrive. A backend connector (Pipedrive API token from the operator, stored as a secret) that pushes, on the relevant GTM events:

- a **person** on sign-up (email + install id + acquisition source),
- a **deal** when a free user hits a Pro-gated action or starts a trial (the upgrade pipeline), with stage transitions on convert/churn,
- a **lead** for qualified prospects surfaced by the GTM triage.

**Sovereignty boundary (hard).** Only the GTM/CRM layer flows to the operator's Pipedrive: identity, acquisition, funnel stage, and qualified-prospect signal. A user's private property research, buy-box profile, and adjudications are tenant-private and do NOT sync to the operator's CRM. Per-customer Pipedrive (a franchise/operator tenant syncing their own leads to their own CRM) is the later generalization, not this task.

## Task 3 — GTM engine over the top

Extend the existing observation layer (`gtm_events`, `recordGtmEvent`, `/gtm/digest`, `/gtm/triage`) into the investor funnel engine per [`76f`](../76f_investor_deal_radar_gtm.md):

- New event types: `radar_autorun`, `deal_kept`, `deal_passed`, `session_return`, `lead_feed_open`, `lead_clicked`, `paywall_hit`, `upgrade_started`, `subscription_active`, `churned`.
- Extend `/gtm/digest` into a weekly investor-funnel readout (install to first radar to keep/reject to return to upgrade), and wire `/gtm/triage` to flag qualified prospects, which feed the Pipedrive lead push in Task 2.
- This is the engine over the top: the funnel is instrumented end to end and the qualified signal lands in the CRM automatically.

## Do NOT

- Sync any tenant-private profile or research into the operator's CRM (Task 2 boundary).
- Remove read access on entitlement expiry (Task 1 no-lockout).

## Report back

`P:/doc_repo/_inbox/2026-06-16_legacy-design-tools_cc-agent-C_commercialization_pipedrive_paywall_gtm_close.md`. Include the entitlement schema, the Pipedrive object mapping, the new event types live, and verbatim test output.
