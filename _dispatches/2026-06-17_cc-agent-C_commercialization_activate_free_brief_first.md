---
id: 2026-06-17_cc-agent-C_commercialization_activate_free_brief_first
title: cc-agent-C — activate the commercialization layer (free-brief tier FIRST; Stripe + Pipedrive connectors, creds deferred)
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
activates: 2026-06-16_cc-agent-C_commercialization_pipedrive_paywall_gtm
related: [75g_investor_deal_radar, 08_tiered_access_model, _decisions/2026-06-16_investor_radar_name_and_pricing]
---

# cc-agent-C — activate commercialization (free-brief first)

The 2026-06-16 commercialization dispatch (paywall + Pipedrive + GTM) is **GO**, with a reordering: do the free-brief tier first because it unblocks live QA, and build the billing/CRM connectors behind credential stubs so the operator can wire secrets after his QA pass (he is holding the Stripe + Pipedrive creds until then; do not block on them).

Run this **after** kicking the corridor batch (the batch is a long-running script; start it, then build connectors while it runs — do not let either starve the other).

## Order

### 1. Free-brief tier (NO creds, ship first — unblocks operator QA)

The wallet gate currently blocks the FIRST brief. Per [`08`](../08_tiered_access_model.md) / the pricing decision, free tier grants a capped number of full briefs before any gate. On the metering `brokerageWallet`:
- Grant N free full briefs per install/session (pick N from the pricing decision; if unset, default 3 and flag it for operator confirm) before requiring entitlement.
- The radar verdict pass stays free always; only Pro-only depth (full Cotality underwriting, lead feed) gates after the free cap.
- No-lockout: an exhausted free cap blocks new Pro compute only; it never removes read access to already-saved briefs/profile.
- The extension renders the cap state + upgrade CTA (coordinate the contract with extension-agent; do not break v0.6.12).

This must be QA-able against live prod the moment it deploys — the operator is actively QA-ing the free flow.

### 2. Stripe consumer-subscription connector (behind the stubbed interface, creds deferred)

Billing rail for the **consumer subscription** is Stripe (distinct from the settled Circle/USDC *substrate* rail, which is agent-operator settlement — different surface, no conflict). Build against the stubbed subscription-state interface from the 2026-06-16 dispatch so the gate does not change when the rail lands:
- Stripe Checkout (recurring) + customer/subscription mapping to the entitlement store; webhook handler for `subscription_active` / `churned` driving entitlement.
- Read `STRIPE_*` from Secret Manager; the connector must run keyless in a simulated mode (so it builds/tests without creds) and flip to live when the secrets are present. Do NOT hardcode keys; do NOT block deploy on missing secrets.
- Report exactly which `STRIPE_*` secret names the deploy expects so the operator can wire them in one pass and I can verify live.

### 3. Pipedrive CRM sync (connector built, token deferred)

Build the connector from the 2026-06-16 dispatch (person on sign-up, deal on Pro-gated hit/trial, lead on qualified triage). Reads `PIPEDRIVE_API_TOKEN` (Empressa Solutions LLC, `empressasolutionsllc.pipedrive.com/api/v1`). Same keyless-simulated-then-live pattern. **Sovereignty boundary holds:** only GTM/CRM identity + funnel + qualified-prospect signal flows to the operator's Pipedrive; tenant-private research/profile/adjudications never sync.

### 4. GTM funnel events (Task 3 of the 2026-06-16 dispatch)

Extend the observation layer with the investor-funnel event types and wire `/gtm/triage` qualified prospects into the Pipedrive lead push. No creds needed for the event capture itself.

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_commercialization_close.md` — the free-brief cap (and the chosen N), the entitlement schema, the exact `STRIPE_*` and `PIPEDRIVE_*` secret names the deploy expects, the Pipedrive object mapping, the live GTM event types, and verbatim test output (keyless-simulated is fine for the rails; the free-brief tier must show a live-prod brief returning under the free cap).
