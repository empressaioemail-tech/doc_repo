# Max checkout + dual-tier upgrade — ship report

**Date:** 2026-06-18  
**Backend:** `POST /billing/checkout { tier: "pro"|"max", successUrl, cancelUrl }` — live ($29 Pro / $65 Max)

## Live now

| Surface | Pro ($29) | Max ($65) |
|---|---|---|
| Intel panel entitlement strip | **Live** | **Live** |
| Deep Research topbar wallet | **Live** | **Live** |
| Deep Research sidebar (`Your plan` rail) | **Live** | **Live** |
| Map gate CTA | — | **Live** → `startMaxCheckout()` |
| Options → Plan | **Live** | **Live** |
| Paywall / compact upgrade actions | **Live** (both buttons) | **Live** |

### Entitlement refresh
- `normalizeEntitlement` reads `maxActive`, `proActive`, `subscriptionTier` from `GET /entitlement`
- After checkout return (`?billing=success`), panel + research re-fetch entitlement and update UI
- Max checkout success re-renders spatial map when `maxActive` is true

### Checkout routing
- `startProCheckout()` → `{ tier: "pro" }`
- `startMaxCheckout()` → `{ tier: "max" }`
- Pending checkout stashes `tier` for post-return handling

### Map GIS QA (no Max subscription yet)
- Set **Advanced → Dev product header** to `map-max-qa`, **or** `chrome.storage.local.set({ hauskaMapMaxQa: true })`
- `map-data` requests use install id `extension-agent-map-max-qa` (allowlisted on cortex-api)
- When `maxActive` is true on entitlement, normal per-install id is used

## Tier UI states

| Entitlement | Panel / wallet label | Upgrade affordances |
|---|---|---|
| Free (briefs left) | `N free briefs remaining` | Pro + Max |
| Free (exhausted) | Paywall copy | Pro + Max (compact) |
| Pro | `Pro — unlimited briefs` | Max + Manage |
| Max | `Max — spatial map + unlimited briefs` | Manage only |

## Files touched
- `src/lib/entitlement-api.js` — tier fields, dual upgrade HTML helpers
- `src/lib/billing-api.js` — explicit `tier: "pro"` / `"max"`
- `src/lib/install-id.js` — `MAP_MAX_QA_INSTALL_ID`, `getMapDataInstallId()`
- `src/lib/map-data-api.js` — QA install override for map-data
- `src/content/intel-panel.js` — dual upgrades + Max checkout handler
- `src/research/research-app.js` — wallet, sidebar rail, map gate, post-checkout refresh
- `src/lib/site-map.js` — gate copy with $65
- `src/options/index.js`, `options/options.html`
- `src/content/inject.css`, `research/research.css`

## Operator QA
1. `npm run build` → reload extension
2. GIS smoke without Max: set dev product `map-max-qa` → open Deep Research → expand Map tab
3. Upgrade smoke: click **Upgrade to Max ($65)** → complete Stripe → return → wallet shows Max, map unlocks
4. Prod map-data script: `scripts/verify-prod-193-live.mjs` (uses `extension-agent-map-max-qa`)
