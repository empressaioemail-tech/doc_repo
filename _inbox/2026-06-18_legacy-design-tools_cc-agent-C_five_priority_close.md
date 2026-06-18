# cc-agent-C close — Stripe/Pipedrive, chat, Max tier, GIS proxy

**Date:** 2026-06-18  
**Repo:** `legacy-design-tools` @ `860c9f9a`  
**Prod:** `https://cortex-api-tds7av26va-uc.a.run.app`  
**Serving revision:** `cortex-api-00223-juq` (100% traffic, image `860c9f9a`)  
**Rollback handle:** `cortex-api-00204-kew` (prior stable; also `cortex-api-00213-qug` Stripe/Pipedrive hotfix)

---

## 1. Stripe/Pipedrive hotfix — DONE

| Item | Status |
|------|--------|
| Commit `f9d8984e` on `main` | Pushed |
| `cloud-run-deploy.yml` six `--set-secrets` | In workflow |
| Pipedrive error isolation + invalid field removal | Deployed |
| Checkout no longer crashes on bad `stage_id` | Verified on prior `00213` |

**Operator action required:** `STRIPE_SECRET_KEY` in Secret Manager is effectively empty (length 2). Live checkout falls back to **simulated** mode until the operator repastes the TEST secret. `STRIPE_MAX_PRICE_ID` is set to `price_1TjidZFjAepSMTX7yQ8FoIQq`.

---

## 2. Pipedrive person sync — LIVE

**Root cause (prior):** Invalid custom-field hash + string `stage_id` crashed checkout; person create never ran for upgrade path.

**Live verification (`00223-juq`):**

| Field | Value |
|-------|-------|
| Signup | `POST /api/auth/signup` → 201 |
| Install | `pd-final-3fa44e95345d41db` |
| Email | `pd-final-1781800111560@example.com` |
| **Pipedrive person id** | **715** |
| Cloud Run log | `pipedrive: person synced` |

Person create now also attaches a pinned note with full install id + email (code in `95151caa`).

---

## 3. Research chat reliability — FIXED (live)

**Root causes:**

1. **"No brief run"** — `listingKeyFromAddress` normalization mismatch between brief POST and chat lookup; fixed with `normalizeListingAddress`, `listingKeyCandidates`, and install-scoped + fallback run resolution in `resolveResearchChatRun`.
2. **"Live AI chat temporarily unavailable" / rules-v1** — `generateResearchChat` called `completeGrok()` only; prod runs `BRIEFING_LLM_MODE=anthropic`. Replaced with `completeBriefingLlm()` (Grok + Anthropic via `getBriefingLlmClient()`).

**Live verification (`00223-juq`):**

```
POST /api/brokerage/v1/brief        → 200
POST /api/brokerage/v1/research/chat (runId) → 200, method: "anthropic"
```

Free-tier GIS gate also confirms new code path: `POST /map-data/gis-layer` → 403 `tier_required` (not SPA HTML).

---

## 4. Max tier backend — IMPLEMENTED

### Checkout contract

```http
POST /api/brokerage/v1/billing/checkout
X-Hauska-Key: <extension public key>
X-Hauska-Install-Id: <install uuid>

{
  "tier": "pro" | "max",          // optional, default "pro"
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Response (live, when Stripe secrets populated):**

```json
{
  "mode": "live",
  "sessionId": "cs_test_...",
  "checkoutUrl": "https://checkout.stripe.com/...",
  "publishableKey": "pk_test_...",
  "tier": "max"
}
```

### Stripe webhook → entitlement

- `checkout.session.completed` / `customer.subscription.updated` detect tier from `metadata.subscription_tier` or price id vs `STRIPE_MAX_PRICE_ID`.
- Wallet row: `subscriptionTier` = `"pro"` | `"max"`; API exposes `proActive`, `maxActive`, `subscriptionTier`, `paidActive`.

### Secret wiring

| Secret | Current value (TEST) |
|--------|----------------------|
| `STRIPE_MAX_PRICE_ID` | `price_1TjidZFjAepSMTX7yQ8FoIQq` |
| `STRIPE_PRO_PRICE_ID` | (existing in SM) |
| `STRIPE_SECRET_KEY` | **EMPTY — operator must repaste** |

### `/map-data` gate

Gated on `entitlementPackageTier(install) === "max"` (wallet subscription), with `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS` retained as QA override only.

---

## 5. GIS proxy (MapLibre) — IMPLEMENTED

### Endpoints (extension-agent)

| Method | Path | Tier |
|--------|------|------|
| `GET` | `/api/brokerage/v1/map-data/gis-layers` | max |
| `POST` | `/api/brokerage/v1/map-data/gis-layer` | max |

### `POST /map-data/gis-layer` body

```json
{
  "layer": "fema" | "zoning" | "parcels" | "floodplain" | "etj",
  "latitude": 30.1109,
  "longitude": -97.3152
}
```

### Response shape

```json
{
  "layer": "parcels",
  "provider": "Bastrop County, TX GIS",
  "adapterKey": "bastrop-tx:parcels",
  "serviceUrl": "https://gis.bastropcountytx.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0",
  "featureCount": 1,
  "geojson": { "type": "FeatureCollection", "features": [ ... ] },
  "packageTier": "max"
}
```

### Layer catalog (lifted SmartCity / Bastrop)

| `layer` | ArcGIS service |
|---------|----------------|
| `fema` | `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28` |
| `floodplain` | `https://gis.bastropcountytx.gov/arcgis/rest/services/Hazards/Floodplain/MapServer/0` |
| `zoning` | `https://gis.bastropcountytx.gov/arcgis/rest/services/LandUse/Zoning/MapServer/0` |
| `parcels` | `https://gis.bastropcountytx.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0` |
| `etj` | **env** `BROKERAGE_GIS_ETJ_SERVICE_URL` (not set in prod — returns 404 `no-coverage` until operator wires city ETJ layer) |

**Live gate verified:** free install → 403 `tier_required`. Max-subscription GIS parcel fetch blocked on prod until `STRIPE_SECRET_KEY` restored and Max checkout completes (or operator sets wallet tier via webhook).

---

## Commits

| SHA | Message |
|-----|---------|
| `f9d8984e` | Stripe/Pipedrive hotfix (deploy secrets + CRM isolation) |
| `95151caa` | Research chat LLM, Max tier, GIS proxy, Pipedrive notes |
| `860c9f9a` | ArcGIS GeoJSON type fix for adapters typecheck |

---

## Follow-ups for operator

1. **Repaste `STRIPE_SECRET_KEY`** (and confirm publishable + webhook secrets) — checkout is simulated until then.
2. **Set `BROKERAGE_GIS_ETJ_SERVICE_URL`** when city ETJ FeatureServer URL is chosen.
3. **Pipedrive UI:** search persons by note content `Hauska install:` or name prefix `pd-final-` — test `@example.com` emails may be filtered in default views.
