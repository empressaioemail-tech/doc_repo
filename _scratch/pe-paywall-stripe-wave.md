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
- Stripe Checkout cannot mix billing intervals in one subscription: annual base + monthly seats is impossible in one session. Annual Team is therefore capped at the 10 included seats (400 above), never silently split or billed monthly.
- The pre-ladder defect shape: every subscription checkout resolved one env (`STRIPE_PRO_PRICE_ID`, $29) regardless of tier presented. Fix shape: per-tier+interval env resolution that returns null and refuses 503 when unset.
- The unlock writer's insert-or-ignore took a repurchase's $15 and granted nothing once a row existed; upsert-renew is the correct semantic when rows can expire.

## GROUND-TRUTH (2026-08-24 ladder rebuild SHIPPED)

- Cortex `main` @ `1fd6233d` (PR #470, squash) serving 100% on Cloud Run revision `cortex-api-00569-maw` (project `legacy-design-tools-prod`), read by field name from service JSON 2026-08-24 ~13:15 UTC.
- Migration 0083 applied via run-migrations dispatch (log: "ok 0083_pe_pricing_ladder_tiers.sql applied"); additive ADD COLUMN IF NOT EXISTS on `pe_user_entitlements.subscription_tier` + `pe_property_unlocks.expires_at`.
- All 8 price-ID secrets mounted on the serving revision (solo/studio/team + seat + unlock + 3 annual), verified from revision describe JSON.
- Sandbox Stripe catalog: monthly $49/$129/$299+$25-seat, unlock $15/30d, annual $490/$1,290/$2,990 — created + read back by API; old $29/$65/$99 prices archived.
- Live-mode Stripe key: DOES NOT EXIST yet; operator does live activation at end of QA list (decision 2026-08-24). No grandfathering needed (testers only).
- Regression probe post-deploy: 1006 Jefferson (48021:34073) buildable-envelope status=ok, empty=false, SF-1 setbacks — P-60b fix intact on new revision. Simsbrook by-address returns no-parcel (known Travis address-lookup ingest gap; not a regression — node-id path unaffected).

## GROUND-TRUTH (2026-08-24 ~13:40 UTC — PE pricing popup SHIPPED)

- hauska-map **#202** merged `8c8d268`, Vercel production Ready (`property-explorer-h5x2s0zcg`). One SignUpCard-styled PricingModal; dock locked panels are value line + View pricing only; UnlockFlow/PaywallGate retired. Checkout body carries `tier` (solo/studio/team) + optional seats. Cortex #470 already serving that contract.

## GROUND-TRUTH (2026-08-24T15:24Z) — A2 PricingModal code-done, not deployed

hauska-map branch `fix/pe-pricing-a2` uncommitted (+743 / −233). Comparison table, annual default, Free caption, Unlock footer. Planner read the diff. WDLL `_inbox/2026-08-24_lane2_pricing_a2_WDLL.md` graded code-done.

## OPEN (2026-08-24)

- **A1 deploy gate:** cortex already accepts `interval: year` and has annual price IDs. PE `startPeCheckout` does not send it. Do not alias smartsite.cloud until the body carries interval, or Nick accepts monthly charge behind annual display.
- tighten cortex `tier` to required; `startPeCheckoutInstallScoped` dead seam.
- Annual Team >10 seats: refused 400 by design.

## OPEN (2026-08-24) historical

- PE #202 shipped the rejected stack. A2 replaces it on `fix/pe-pricing-a2`.
- Annual Team >10 seats: refused 400 by design. If a real buyer needs it, operator ratifies an annual seat price or we build a paired monthly seats-only subscription.
