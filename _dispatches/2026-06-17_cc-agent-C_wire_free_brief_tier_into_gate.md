---
id: 2026-06-17_cc-agent-C_wire_free_brief_tier_into_gate
title: cc-agent-C — wire the free-brief entitlement into the brief gate (first N briefs free, no wallet top-up)
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
priority: HIGH — launch blocker; a fresh install currently cannot run a single brief without a $5 top-up
related: [08_tiered_access_model, 75i_investor_radar_prelaunch_sprint, 2026-06-17_cc-agent-C_commercialization_activate_free_brief_first]
---

# cc-agent-C — wire the free-brief tier into the brief gate

Live QA on a Bastrop Zillow listing: the panel shows "Wallet balance is zero. Top up in $5 increments to run new briefs" and **blocks the first brief**. A new install must get free briefs before any gate.

## Root cause (verified)

The entitlement layer is BUILT but NOT wired into the gate:
- `artifacts/api-server/src/lib/brokerageEntitlement.ts` already has `getEntitlementSnapshot(installId)`, `brokerageFreeBriefsCap()` (default 3), `freeBriefsUsed`/`freeBriefsRemaining`, and Pro-subscription state.
- But `artifacts/api-server/src/routes/brokerageBrief.ts:341-353` (and the async path `:809-815`) gates on `assertExtensionPublicBriefAllowed` (429 rate limit) then `assertComputeAllowed(installId)` — the legacy **wallet debit**, which returns `insufficient_balance` at balance 0. It never consults `freeBriefsRemaining`.

## Fix

1. In the brief gate at `brokerageBrief.ts:341-353` and `:809-815`, **before** `assertComputeAllowed`:
   - Load `getEntitlementSnapshot(installId)`.
   - If `proActive` → allow, no debit (Pro is unlimited).
   - Else if `freeBriefsRemaining > 0` → **allow the brief and increment `freeBriefsUsed`** (atomic; ledger a `free_brief` event), do NOT debit the wallet.
   - Only when the free cap is exhausted AND not Pro → fall through to the gate. The "pay" path is the Pro subscription (Stripe, the commercialization connector), NOT the legacy $5 wallet top-up. Until the subscription connector lands, the exhausted-cap response should carry an `upgrade_required` signal the extension renders as an upgrade CTA — not an `insufficient_balance` wallet top-up.
2. **Include the entitlement snapshot in the brief response** (and/or a `GET /api/brokerage/v1/entitlement` the panel can read on load) so the extension can show "N free briefs remaining" instead of a wallet balance. Fields: `freeBriefsRemaining`, `freeBriefsCap`, `proActive`.
3. Keep the no-lockout rule: an exhausted cap blocks new Pro compute only; never removes read access to already-saved briefs/profile.
4. `BROKERAGE_FREE_BRIEFS_CAP` defaults to 3 — confirm that's the launch number with the operator (flagged); it's env-overridable without a deploy.

This pairs with the extension CTA fix ([`extension-agent zillow + free-briefs`](2026-06-17_extension-agent_zillow_address_and_free_briefs_cta.md)).

## Deploy

cortex-api canary sequence (deploy-canary -> SKIP run-migrations unless the ledger needs a new column/migration -> smoke -> shift-traffic). Smoke: a brand-new `X-Hauska-Install-Id` runs a brief at wallet balance 0 and gets **200** (free brief), `freeBriefsRemaining` decrements, and the 4th brief (cap 3) returns the `upgrade_required` signal, not `insufficient_balance`.

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_free_brief_gate_close.md` — the gate change, verbatim live smoke of a fresh install running briefs 1-3 free at balance 0 and brief 4 hitting the upgrade signal, the entitlement-snapshot shape exposed to the extension, and the chosen cap.
