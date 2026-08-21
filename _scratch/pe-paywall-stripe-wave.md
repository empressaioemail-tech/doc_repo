# PE paywall stripe wave — scratch (Tier 2)

## GROUND-TRUTH (2026-08-05 recon)

- PE app: `P:\hauska-map\apps\property-explorer` (NOT in legacy-design-tools monorepo root).
- Cortex: `P:\legacy-design-tools\artifacts\api-server`.
- R1 paywall shell MERGED 2026-07-29 (#363 cortex, #110 PE). LIVE-PAYMENTS wave was explicit follow-on.
- Core bug: Stripe webhook → `brokerage_wallets` (install); PE gates read `pe_user_entitlements` (user). Disconnected.
- Dev bypass: env allowlists `PE_DEV_PAID_EMAILS` / `PE_DEV_PAID_SUBJECTS`, not login-hardcoded in PE client — but still requires deploy to change.
- $15 unlock stub honest in `billingClient.ts` L80-104.
- No promo codes on Stripe checkout session creation.
- Anonymous orphan trap: localStorage workbench + install-id history not claimed on PE OIDC sign-in.

## OPEN

- WA2 PR open: https://github.com/empressaioemail-tech/hauska-map/pull/152 (branch `feat/pe-paywall-checkout-claim`, not merged/deployed). 971/971 PE tests pass. Cites WDLL items 3, 5, 6, 7.
- WA1 PR status not yet verified by this agent (WA2 executor) — check `legacy-design-tools` `feat/pe-paywall-stripe-entitlement` before merge sequencing.
- Planner: merge WA1 first, migration 0064 apply, cortex canary deploy, then WA2, PE vercel deploy, live promo test.
- WA2's assumed API contract (needs WA1 confirmation before merge): `POST api/property-explorer/v1/entitlement/checkout` (deep proxy, session cookie, body `{parcelNodeId, successUrl, cancelUrl}` -> `{checkoutUrl, sessionId?}`), `POST api/property-explorer/v1/claim-session` (deep proxy + `X-Hauska-Install-Id`, body `{installId}`), `POST api/property-explorer/v1/claim-local-state` (deep proxy, body `{savedProperties: [], workbenchToolState?}`). All three feature-detect 404/403 so WA2 is safe to merge/deploy before or after WA1.
- WA2 assumes `GET /entitlement` optionally carries top-level `devRole: boolean` + `entitlementSource: string | null` (user-level, not nested under `property`).

## LESSON

- Install-scoped brokerage entitlement and user-scoped PE entitlement must reconcile at webhook + session-exchange, not at UI.
