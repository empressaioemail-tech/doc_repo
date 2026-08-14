---
date: 2026-08-05
title: WA1 — cortex-api paywall finish (Stripe → PE entitlement, dev role, claim)
repo: legacy-design-tools
branch: feat/pe-paywall-stripe-entitlement
wdll: _inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL.md
items: [1, 2, 3, 4, 6]
---

# Dispatch WA1 — cortex-api entitlement + Stripe backend

**AUTHORIZATION:** Nick (operator) greenlit 2026-08-05 (76j Workstream A order-1). **Do the work in YOUR OWN context — do NOT spawn nested subagents.**

## Standing decisions (paste)

- Deploys are planner-owned — you build + PR; planner merges/deploys/verifies live.
- Cotality extinguished; no privileged data paths.
- Code-done != customer-done — planner live-probes after deploy.
- Touch ONLY `artifacts/api-server`, `lib/db` migrations/schemas for PE entitlement. No zoning/setback/engine lanes.

## Ground truth (recon 2026-08-05)

- R1 gates live: `peEntitlement.ts`, migration 0063 (`pe_property_unlocks`, `pe_chat_message_counts`).
- Dev bypass today: `PE_DEV_PAID_EMAILS` / `PE_DEV_PAID_SUBJECTS` env allowlists in `hasPeDevPaidBypass` — **replace with DB dev role**.
- Stripe subscription checkout exists (`brokerageStripe.ts`, `propertyExplorerBilling.ts`) but webhook only updates **`brokerage_wallets`** (install-scoped). PE reads **`pe_user_entitlements.access_tier`** — stays `free` after checkout. **This is the core bug.**
- No promo codes on checkout sessions. No $15 one-time checkout. No webhook → `createPePropertyUnlock`.
- `claimInstallHistoryForUser` exists for extension; PE OIDC `session-exchange` does NOT call it.
- Tests: `pe-property-entitlement.test.ts`, `pe-entitlement-gate.test.ts`, `brokerageBilling.test.ts`.

## Build spec (WDLL items 1–4, 6)

### Migration 0064

Add to `pe_user_entitlements`:
- `dev_role boolean NOT NULL DEFAULT false`
- Optional: `entitlement_source text` (`stripe_sub`, `stripe_promo`, `stripe_unlock`, `dev`, null for free)

Run drizzle migration + schema update in `lib/db/src/schema/peUserEntitlements.ts`.

### Dev role (item 4)

- Replace `hasPeDevPaidBypass` to check `dev_role` on user row (remove env allowlist OR keep env as deprecated fallback behind feature flag — prefer clean removal with migration note).
- Internal route (service key): `POST /api/property-explorer/v1/internal/dev-role` body `{ userId, devRole: boolean }` for operator grant/revoke without deploy.
- Entitlement GET: include `devRole: boolean` and when entitled via dev, `entitlementSource: "dev"`.

### Unify Stripe → PE user entitlement (items 1, 2)

- PE checkout must carry **userId**: extend `propertyExplorerBilling.ts` to accept authenticated PE session (deep proxy passes cookie) OR new route under `propertyExplorer.ts` that requires `requirePeAuthenticated`.
- Pass `metadata[pe_user_id]`, `metadata[parcel_node_id]` (optional), `metadata[checkout_kind]` (`pro_sub` | `property_unlock`) on Stripe session.
- `createSubscriptionCheckoutSession`: add `allow_promotion_codes: true` (Stripe API param).
- Add `createPropertyUnlockCheckoutSession` for $15 one-time (`mode: payment`, price from env `STRIPE_PE_UNLOCK_PRICE_ID` or reuse pro price pattern).
- Webhook `checkout.session.completed`:
  - If `metadata.checkout_kind === property_unlock` → `createPePropertyUnlock({ ownerUserId, parcelNodeId, source: "stripe" })`
  - If subscription + `pe_user_id` → set `pe_user_entitlements.access_tier = paid`, set `entitlement_source` from discount/promo detection (`stripe_promo` vs `stripe_sub`)
  - Also claim install: `claimInstallHistoryForUser(installId, pe_user_id)` when both present
- Link PE user to Stripe customer (new column on `pe_user_entitlements` or reuse wallet row keyed by claimed install).

### Anonymous claim (item 6)

- Extend `POST /api/auth/session-exchange` (or add `POST /api/property-explorer/v1/claim-session`) to accept optional `installId` header/body and call `claimInstallHistoryForUser`.
- Add `POST /api/property-explorer/v1/claim-local-state` (authenticated): body `{ savedProperties: [{ parcelNodeId, label?, snapshot? }], workbenchToolState?: object }` — upsert into `pe_saved_properties` (merge, don't delete server rows).

### Tests

- Extend `pe-property-entitlement.test.ts` for dev_role DB path.
- Webhook test: checkout.session.completed with pe_user_id → tier paid.
- Property unlock webhook → unlock row.
- Claim route: install history attaches on session exchange with installId.

## PR discipline

- Rebase on `origin/main` before PR.
- Cite WDLL items 1, 2, 3, 4, 6 in PR body.
- CI green on conclusion string only — do not merge; planner merges.
- No cortex deploy from executor.

## Out of scope

- PE frontend (WA2). Rate limiting. Unrelated health routes.
