---
date: 2026-08-05
title: WA2 — Property Explorer checkout UX, post-checkout refresh, anonymous claim client
repo: hauska-map
branch: feat/pe-paywall-checkout-claim
wdll: _inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL.md
items: [3, 5, 6, 7]
---

# Dispatch WA2 — Property Explorer frontend paywall finish

**AUTHORIZATION:** Nick (operator) greenlit 2026-08-05 (76j Workstream A order-1). **Do the work in YOUR OWN context — do NOT spawn nested subagents.**

## Standing decisions

- Deploys planner-owned. Vercel: `vercel link --project property-explorer-xi` from `apps/property-explorer`; verify live alias + bundle marker (exit code untrustworthy).
- Do NOT touch flood overlay, parcel tiles, site-plan export logic outside paywall/entitlement.
- Claim: `apps/property-explorer` only (+ tests). Root directory = `apps/property-explorer`.

## Ground truth

- Paywall shell live: `usePropertyEntitlement`, `PaywallGate`, `UnlockFlow`, `billingClient.ts`.
- Pro checkout: `startPeCheckout()` → install-id brokerage route (works for Stripe redirect).
- $15 unlock: **stub** — returns "coming" unless `VITE_PE_DEV_UNLOCK=1` hits dev-unlock route.
- No handler for `/?checkout=success`. Entitlement cache not refreshed post-payment.
- Auth callback (`api/auth.ts`): sets session cookie, redirects `/?signed_in=1` — **no install claim, no local state upload**.
- Anonymous data in localStorage: `pe:workbench:tool-state:v1`, chat sessions (`chat-sessions.ts`), search recents; saved properties server-side only when authed.

## Build spec (WDLL items 3, 5, 6, 7)

### Wire real property unlock checkout (item 3)

- Replace stub path in `billingClient.startPropertyUnlock`: POST authenticated checkout route (coordinate with WA1 — use deep proxy + credentials for user-scoped checkout; feature-detect WA1 route).
- `UnlockFlow.tsx`: on success redirect, handle unlock vs pro paths.

### Single entitlement source (item 5)

- `entitlementClient.ts`: map server `devRole` / `entitlementSource` if present; `isEntitled` true when `tier === paid` OR `propertyUnlocked` OR `devRole`.
- Remove production dependence on `VITE_PE_DEV_UNLOCK` (keep test seam only).
- Audit paid bubbles: Brief, Chat, Reports, terrain BFF — all use `usePropertyEntitlement` or server BFF entitlement read; remove any stray hardcoded operator checks.

### Anonymous claim client (item 6)

- On auth callback success path OR `App.tsx` on `signed_in=1`:
  1. POST claim with `X-Hauska-Install-Id` from `installId.ts` to cortex claim endpoint (via deep proxy).
  2. Read localStorage workbench tool state + any client-side saved-property queue; POST `claim-local-state`.
  3. Invalidate all entitlement cache.
- Do NOT bundle unrelated auth fixes.

### Post-checkout refresh (item 7)

- `App.tsx` (or dedicated hook): detect `checkout=success` query param.
- Clear entitlement cache; poll `GET /entitlement` (and active property if in URL) until `tier === paid` or property unlocked, max ~30s with honest loading UI.
- Strip query param after reconcile.

### Tests

- Update `property-unlock.test.ts`, `unlock-flow.test.tsx`, `entitlement-client.test.ts`.
- Add test for checkout success param → invalidate + refresh.

## PR discipline

- Rebase on `origin/main`. Depends on WA1 API shapes — feature-detect missing routes gracefully until WA1 merges.
- Cite WDLL items 3, 5, 6, 7. CI green; planner merges.

## Out of scope

- cortex-api backend (WA1). DFW tiles. Flood overlay.
