---
id: 2026-08-09_76j_billing_surface_audit
title: 76j billing-surface audit — Stripe ladder, E2E trace, copy sweep, anonymous claim
date: 2026-08-09
status: audit (planner lane; operator checkout click still owed)
owner: nick
related: [76j_smartsite_launch_readiness_program, 76_empressa_wedge_90d_operating_plan, 90_runbooks/pe_paywall_e2e_operator, _inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL, 90_operations/OPS-14_texas_flush_game_plan]
---

# 76j billing-surface audit

Planner lane per CANON-PREAMBLE v0f465c77. Repos traced: `legacy-design-tools` (cortex-api billing seams), `hauska-map` (PE unlock UX). Live probes 2026-08-09 evening against serving `cortex-api-00494-gok` and PE `property-explorer-xi.vercel.app` bundle `index-C1Sc6_H7.js`.

**Verdict:** Code path for checkout → webhook → entitlement is shipped and unit-tested. **Stripe catalog, PE pricing copy, and operator E2E are not aligned to the settled ladder or Smart Site branding.** Anonymous claim is **built and routed live**; operator smoke on session-state survival is still owed. **Do not flip to real-money mode until the punch list at the bottom is closed.**

---

## J1 — Settled ladder in Stripe test mode (Smart Site branding)

### Ruling of record

`90_operations/OPS-14_texas_flush_game_plan.md` (operator decision 2026-08-09):

| Tier | Price |
|---|---|
| Free | $0, 5 briefs/mo |
| Home | $20/mo |
| Pro | $40/mo |
| Team | $75/seat/mo |

Entity display **Legacy Group ATX LLC** stays (operating company; correct).

### Current state (misaligned on three axes)

| Surface | What it shows | Problem |
|---|---|---|
| Stripe sandbox (operator session 2026-08-09) | **"Hauska Pro — Unlimited Property Briefs…"** at **$29/mo** | Wrong brand (Hauska = substrate-only) + wrong price |
| Stripe setup script on `main` | `scripts/_stripe-setup-pro-price.mjs` creates product **"Hauska Pro"**, `unit_amount: 2900` | Canon violation baked into operator helper |
| Historical Secret Manager value | `STRIPE_PRO_PRICE_ID` = `price_1Tjg4SFjAepSMTX7pJ5GLYBf` ($29/mo, 2026-06-18 close) | Still the likely bound price on cortex |
| PE customer copy (`pricing.ts`) | Pro **$99/mo** (reg. **$149/mo**); per-property **$15** | Matches 2026-07-29 PE paywall spec, **not** the 2026-08-09 settled ladder |
| Code checkout path | Single subscription SKU via `STRIPE_PRO_PRICE_ID` only | No Home ($20) or Team ($75/seat) price env vars or checkout tiers |

### Required Stripe test-mode actions (operator or planner with Dashboard access)

1. **Archive or retire** the `$29 "Hauska Pro"` product/price from active checkout (do not delete historical subscriptions if any test subs exist).
2. **Create Smart Site products** (test mode, Legacy Group ATX LLC entity unchanged):

   | Product name (customer-facing) | Price | Stripe `metadata` suggestion |
   |---|---|---|
   | Smart Site Home | $20/mo recurring | `smartsite_tier=home` |
   | Smart Site Pro | $40/mo recurring | `smartsite_tier=pro` |
   | Smart Site Team | $75/seat/mo recurring | `smartsite_tier=team` |

3. **Per-property unlock** ($15 one-time): keep as a separate one-time Price if the per-property on-ramp survives the ladder ruling (not named in the $0/$20/$40/$75 table — **operator call** whether it stays). Env: `STRIPE_PE_UNLOCK_PRICE_ID`.
4. **Update Secret Manager** on `cortex-api` (`legacy-design-tools-prod`):
   - `STRIPE_PRO_PRICE_ID` → new **Smart Site Pro $40/mo** test price id
   - Add `STRIPE_HOME_PRICE_ID`, `STRIPE_TEAM_PRICE_ID` when checkout routes exist
   - Set `STRIPE_PE_UNLOCK_PRICE_ID` if $15 unlock stays
5. **Redeploy cortex-api** (planner-owned): tag → smoke → shift.
6. **Replace** `scripts/_stripe-setup-pro-price.mjs` with a ladder-aware setup script (Smart Site names, $20/$40/$75 amounts, prints all price ids).

### Code follow-on (separate dispatch; not done in this audit)

- `hauska-map/apps/property-explorer/src/lib/pricing.ts` — rewrite Pro copy to **$40/mo** (drop $99/$149 anchor unless operator re-ratifies).
- `pePaywallStripe.ts` — customer `description` still says "Property Explorer user"; Stripe Checkout product name comes from the **Price's Product**, not this string.
- **Home / Team checkout** — not implemented; only `pro_sub` path exists today. Scope as W4 billing-ladder expansion, not silent scope creep in this lane.

**J1 grade:** **NOT MET** — settled ladder is not live in Stripe test mode; Hauska/$29 still on record.

---

## J2 — Checkout → webhook → entitlement → paid serving (E2E trace)

Operator must complete the human Stripe Checkout click (100%-off promo). Below is the **mechanical trace** with evidence per hop.

### Hop 0 — Anonymous baseline (live)

```http
GET https://cortex-api-tds7av26va-uc.a.run.app/api/property-explorer/v1/entitlement
→ 200 {"authenticated":false,"tier":"free","tenantId":"default","userId":null,"devRole":false,"entitlementSource":null}
```

### Hop 1 — Signed-in user starts Pro checkout

**Route:** `POST /api/property-explorer/v1/billing/checkout` (requires session cookie)

**Client:** `hauska-map/apps/property-explorer/src/lib/billingClient.ts` → deep proxy with `credentials: "include"`.

**Server:** `propertyExplorer.ts` → `createPeSubscriptionCheckoutSession()` in `pePaywallStripe.ts`:
- `allow_promotion_codes: "true"` (promo UI enabled)
- `metadata[pe_user_id]`, `metadata[checkout_kind]=pro_sub`
- Price from `STRIPE_PRO_PRICE_ID`

**Live probe (unsigned):**

```http
POST /api/property-explorer/v1/billing/checkout
Body: {"successUrl":".../?checkout=success","cancelUrl":".../?checkout=cancel"}
→ 401 (authentication_required)
```

Expected — route exists and is auth-gated, not 404.

**Operator evidence owed:** signed-in POST → `200` with `mode:"live"`, `checkoutUrl` starting `https://checkout.stripe.com/…`.

### Hop 2 — Stripe Checkout UI (operator)

- Apply 100%-off promotion code at Stripe UI (`allow_promotion_codes` confirmed in code).
- Entity: Legacy Group ATX LLC (unchanged).
- **Product line must read Smart Site Pro $40/mo after J1** (today reads Hauska Pro $29 until catalog fixed).

### Hop 3 — Webhook → entitlement write

**Route:** `POST /api/brokerage/v1/billing/stripe/webhook` (Stripe signing secret)

**Handler:** `brokerageStripe.ts` routes on `metadata.checkout_kind`:
- `pro_sub` + `metadata.pe_user_id` → `setPeAccessTierFromStripe({ tier: "paid" })`
- Discount detected → `entitlementSource: "stripe_promo"`; else `"stripe_sub"`
- `property_unlock` → `createPePropertyUnlock({ source: "stripe" })`
- Optional `metadata.install_id` → `claimInstallHistoryForUser`

**Unit-test evidence (CI, not live):** `pe-paywall-stripe.test.ts`:
- Promo discount → `entitlementSource=stripe_promo`
- No discount → `stripe_sub`
- Property unlock → `pe_property_unlocks.source=stripe`

**Operator evidence owed:** Stripe Dashboard → Webhooks → `checkout.session.completed` delivery log (200 from cortex); or cortex structured log line with `handled: true`, `eventType: pe_subscription` / tier write.

### Hop 4 — PE return URL + client refresh

**Return:** `https://property-explorer-xi.vercel.app/?checkout=success`

**Bundle evidence:** strings `checkout=success` and `Confirming your purchase` present in `index-C1Sc6_H7.js` (post-checkout entitlement poll).

### Hop 5 — Entitlement read → paid serving

**Route:** `GET /api/property-explorer/v1/entitlement` (authed)

**Expected after promo:**

```json
{
  "authenticated": true,
  "tier": "paid",
  "devRole": false,
  "entitlementSource": "stripe_promo"
}
```

**Serving path:** PE `usePropertyEntitlement` / BFF gates read `tier === "paid"` → brief, chat, flood, site-plan unlock; terrain remains Pro-only per product rules.

**Deep-route gate:** `requirePePaidDeep` / `isPePropertyEntitled` in `peEntitlement.ts` — server-side 402 if still free.

**Operator evidence owed:** authed GET snippet + one paid bubble run (e.g. flood refresh returns 200 not 402).

### Hop 6 — dev_role grant smoke (designated tester)

**Route:**

```http
POST /api/property-explorer/v1/internal/dev-role
Authorization: Bearer $SERVICE_API_KEY
{"userId":"<PE_USER_ID>","devRole":true}
```

**Live probe (no key):** → **401** (route exists, not 404).

**Expected after grant:** entitlement `tier:"paid"`, `entitlementSource:"dev"`; revoke with `"devRole":false` closes gates on next refresh.

**Operator evidence owed:** grant → PE hard-refresh → paid bubbles → revoke → locked again. Full curl in `90_runbooks/pe_paywall_e2e_operator.md` Action 2.

**J2 grade:** **PARTIAL** — mechanical path verified in code + anonymous live probes; **promo checkout → paid serving not live-evidenced** (operator click owed).

---

## J3 — Billing copy sweep (Smart Site rebrand)

### Customer-facing surfaces

| Location | Finding | Action |
|---|---|---|
| PE `<title>` | **Smart Site — Explore your property** | OK |
| PE unlock UX (`pricing.ts` / bundle) | **Go Pro — $99/mo (reg. $149/mo)**; **Unlock this property — $15** | **Fix** — align to settled ladder ($40 Pro; confirm $15 unlock fate) |
| PE bundle | **Hauska** appears only in `X-Hauska-Install-Id` header string | OK (technical header; not customer copy) |
| PE bundle | **Property Brief** in internal tool registry label (`property-brief` chip) | **Flag** — consider "Smart Site Brief" or "Brief" for customer paths |
| Stripe Checkout product | **Hauska Pro — Unlimited Property Briefs…** (operator-observed) | **Fix in J1** |
| Stripe setup script | Product name **Hauska Pro**, nickname **Hauska Pro monthly (test)** | **Fix in repo** |
| Stripe Customer Portal | Not audited (Dashboard setting) | Sweep portal headline + receipt email template for Hauska/Brief strings |
| `pePaywallStripe.ts` | Stripe Customer `description`: "Property Explorer user …" | Low visibility; rename to "Smart Site user …" in follow-on |
| Extension / brokerage checkout (`brokerageStripe.ts`) | Legacy **Pro $29 / Max $65** tier enum for install-scoped extension path | Out of PE lane but still Hauska-branded Stripe products if keys shared — confirm extension uses separate products or disable in test |

### Not customer-facing (no action for launch gate)

- `X-Hauska-Install-Id` header name (internal contract)
- CC function matrix labels referencing "Property Brief" as historical name

**J3 grade:** **FAIL on billing checkout surfaces** — Stripe product and PE Pro price copy both lag Smart Site + settled ladder.

---

## J4 — Anonymous-claim flow

### Status: **IMPLEMENTED (code + routes live). Not a build lane.**

| Step | Mechanism | Live/code evidence |
|---|---|---|
| Install history claim | `POST /api/property-explorer/v1/claim-session` + `X-Hauska-Install-Id` | **401** without session (live); route registered in `propertyExplorer.ts` |
| Local workbench state | `POST /api/property-explorer/v1/claim-local-state` | **401** without session (live); merges workbench tool state |
| PE trigger | `claimAnonymousStateOnSignIn()` on `?signed_in=1` in `App.tsx` via `claimClient.ts` | Bundle contains `claim-session`, `claim-local-state` |
| Entitlement refresh | `invalidatePropertyEntitlement()` after claim | Prevents orphan gate state |
| Saved properties | `savedProperties: []` sent intentionally — PE saves require auth already | Honest; no fabricated queue |

**Session-state question:** Does anonymous browsing state (map position, workbench tool state, GTM install history) survive sign-in?

- **Designed:** yes — claim sequence runs once after OIDC return; workbench state uploaded from `pe:workbench:tool-state:v1` localStorage.
- **Not live-verified this session** — requires operator incognito → touch workbench → sign in → confirm state (Action 4 in `90_runbooks/pe_paywall_e2e_operator.md`).

**If claim were missing:** it is not — **SCOPE: operator smoke only; no build.**

**J4 grade:** **MET (code)** / **operator smoke owed**.

---

## Punch list before real-money mode

| # | Item | Owner | Blocks |
|---|---|---|---|
| 1 | Create Smart Site Home/Pro/Team test prices ($20/$40/$75); retire Hauska Pro $29 | Operator + planner (Stripe Dashboard + secrets) | External checkout |
| 2 | Update `STRIPE_PRO_PRICE_ID` (+ unlock price if kept); redeploy cortex-api | Planner deploy | Live checkout amount/name |
| 3 | Rewrite `pricing.ts` (+ `UnlockFlow` comments) to settled ladder copy | Product repo dispatch | Customer truth |
| 4 | Replace `_stripe-setup-pro-price.mjs` with ladder script | Product repo dispatch | Repeatability |
| 5 | Operator promo E2E (100%-off) through paid bubbles — paste hop evidence | Operator | WDLL items 1, 2, 8 |
| 6 | Operator dev_role grant/revoke on tester account | Operator | WDLL item 4 live proof |
| 7 | Operator anonymous-claim smoke (incognito → sign-in) | Operator | WDLL item 6 live proof |
| 8 | Stripe Customer Portal + receipt email branding sweep | Operator (Dashboard) | J3 receipt/portal |
| 9 | Confirm Stripe webhook endpoint points at cortex prod URL with correct signing secret for target mode | Planner | Webhook hop |
| 10 | **Scope decision:** Home/Team checkout routes + free-tier "5 briefs/mo" vs current "3 chat/property" — ladder implementation gap | Operator product call | Full ladder parity |
| 11 | Adversarial checkpoint before enabling live Stripe keys (test → live key swap + live price ids) | Planner | Real-money flip |

---

## Recommended next dispatch (if operator greenlights code lane)

Single PR pair, WDLL-amendment reason: "align PE + Stripe helper to OPS-14 settled ladder and Smart Site branding":

1. **ldt:** `_stripe-setup-smartsite-ladder.mjs` + retire Hauska script; optional env var names documented in deploy workflow comment.
2. **map:** `pricing.ts` → Pro $40/mo; add Home/Team labels as display-only until checkout tiers exist, or hide until routed.

Stripe Dashboard + secret binding + operator E2E remain operator/planner manual steps per `90_runbooks/pe_paywall_e2e_operator.md`.

---

## WDLL re-grade (76j Workstream A residual)

| Item | Grade | Evidence |
|---|---|---|
| J1 settled ladder test mode | **not met** | Hauska $29 on record; PE shows $99/$149 |
| J2 E2E promo path | **partial** | Code + tests + anon probes; operator checkout owed |
| J3 copy sweep | **fail** | Stripe + PE Pro copy |
| J4 anonymous claim | **met (code)** | Routes 401-not-404; claimClient shipped; operator smoke owed |
