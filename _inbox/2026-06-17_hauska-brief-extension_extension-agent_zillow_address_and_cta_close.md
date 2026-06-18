---
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.14
dispatch: 2026-06-17_extension-agent_zillow_address_and_free_briefs_cta
status: verified on prod (cortex-api-00194-diw) — committed + pushed
---

# Close — Zillow URL-slug address + free-brief entitlement CTA (v0.6.14)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.14** |
| **Prod API** | `https://cortex-api-tds7av26va-uc.a.run.app` (revision **cortex-api-00194-diw**) |
| **Branch** | `extension/unified-signin-v067` |

## Bug 1 — Zillow wrong address (fixed)

### Root cause

`extractFromZillow()` used `document.querySelector("h1")`, which on current Zillow DOM resolves to a sidebar card (**103 Kamaiki Dr / 419 sqft**), not the listing.

### Fix

- **Primary:** parse `/homedetails/<slug>/<zpid>_zpid/` with `parseZillowHomedetailsSlug()` → e.g. `205-Javelina-Trl-Bastrop-TX-78602` → **205 Javelina Trl, Bastrop, TX 78602** with `streetAddress`, `city`, `state`, `zip`.
- **Fallback:** targeted DOM selectors + title (never bare first `h1`).
- **Sqft / status:** from listing fact container for `#hauska-intel-addr-sub`.

### Three copies resolved

| Location | Status |
|----------|--------|
| `src/adapters/zillow.js` | Canonical implementation |
| `src/content/intel-panel.js` | Duplicate removed — imports `extractFromZillow` from adapter |
| `src/content/content-bundle.js` | Rebuilt via `node scripts/build.mjs` (esbuild IIFE) |

### Unit test

```text
node scripts/test-zillow-slug.mjs
→ OK zillow slug parse
  address=205 Javelina Trl, Bastrop, TX 78602
```

## Bug 2 — wallet-zero CTA blocks first brief (fixed)

### Fix — cc-agent-C contract (`src/lib/entitlement-api.js`)

- `GET /api/brokerage/v1/entitlement` (primary), fallback `GET /wallet`
- Fields: `freeBriefsRemaining`, `freeBriefsCap`, `proActive`
- `canRunBrief()`: enabled while `freeBriefsRemaining > 0 || proActive`
- Paywall: `upgrade_required` / `upgradeCta: pro_subscription` — **no $5 top-up CTA**
- Panel updates from brief response via `entitlementFromBrief()` after each run

### UI wiring

| Surface | Change |
|---------|--------|
| **Intel panel** | `#hauska-entitlement-strip` — “N free briefs remaining”; Run disabled only on consent or exhausted free tier |
| **Deep research** | Topbar entitlement label (not wallet balance / top-up) |
| **Background** | `formatBriefGateError()` maps legacy wallet copy → Pro upgrade |

## Live entitlement verification (cortex-api-00194-diw, 2026-06-17)

`node scripts/verify-entitlement-live.mjs` — **all PASS** on fresh install:

| Step | Result |
|------|--------|
| `GET /entitlement` | **200** — `freeBriefsRemaining=3`, `freeBriefsCap=3`, `proActive=false`, `balanceCents=0` (live snapshot, not default fallback) |
| `POST /brief` #1 | **200** — `entitlement.freeBriefsRemaining=2` |
| `POST /brief` #2 | **200** — `entitlement.freeBriefsRemaining=1` |
| `POST /brief` #3 | **200** — `entitlement.freeBriefsRemaining=0` |
| Panel at 0 | Upgrade CTA HTML — “Upgrade to Pro for unlimited briefs” (no `$5` / wallet copy) |
| `POST /brief` #4 | **402** — `error=upgrade_required`, `upgradeCta=pro_subscription`; message: *Free briefs used for this install. Upgrade to Hauska Pro…* |

Extension code path: `fetchEntitlement()` hits `/entitlement` on **200** → `normalizeEntitlement(body)`; panel `renderSummary()` → `entitlementFromBrief(brief)` → `syncEntitlementAffordance()`.

## Prod verification re-run

`node scripts/verify-prod-live.mjs` — **all PASS** on v0.6.14.

## Operator screen capture (still owed)

Reload unpacked **v0.6.14** →  
`https://www.zillow.com/homedetails/205-Javelina-Trl-Bastrop-TX-78602/90242388_zpid/`

Attach **chrome-extension://** PNG showing:

- Panel address **205 Javelina Trl, Bastrop, TX 78602** (not 103 Kamaiki Dr)
- **“3 free briefs remaining”** with **Run full brief** enabled at `balanceCents=0`

## Files

- `src/adapters/zillow.js`, `src/adapters/index.js`
- `src/content/intel-panel.js`, `src/content/inject.css`, `src/content/content-bundle.js`
- `src/lib/entitlement-api.js`
- `src/research/research-app.js`, `research/research.html`, `research/research-bundle.js`
- `src/background/index.js`
- `manifest.json` (0.6.14)
- `scripts/test-zillow-slug.mjs`, `scripts/verify-entitlement-live.mjs`, `scripts/verify-prod-live.mjs`

## Acceptance

- [x] Zillow homedetails address from URL slug
- [x] Live `GET /entitlement` 200 with real `freeBriefsRemaining=3`
- [x] Brief `entitlement` decrement 3 → 2 → 1 → 0 drives panel
- [x] At 0: Pro upgrade CTA off `upgrade_required` (402), not wallet top-up
- [x] v0.6.14 keyed build + prod-verify PASS + committed/pushed
- [ ] Operator PNG on 205 Javelina Zillow page
