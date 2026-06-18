---
id: 2026-06-18_legacy-design-tools_cc-agent-C_buy_box_teacher_close
agent: cc-agent-C
repo: legacy-design-tools
date: 2026-06-18
status: deployed-canary — extension-agent contract below
---

# Buy-box teacher backend close

## Endpoints (extension contract)

Base: `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1` (canary: `https://canary---cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1`)

Auth: `Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>` **or** signed-in session JWT.  
Required header for anonymous installs: `X-Hauska-Install-Id: <installId>`.

### `GET /profile`

Returns the install/user-private buy box + keep/pass stats.

```json
{
  "ownerUserId": "install:<installId>",
  "tenantSlug": "default",
  "buyBox": {
    "capRateFloor": 0.08,
    "rehabPerSf": 35,
    "rentSpreadTolerance": 0.05
  },
  "investorProfile": {
    "stats": { "kept": 0, "passed": 0 },
    "dealHistory": []
  },
  "kept": 0,
  "passed": 0,
  "updatedAt": "2026-06-18T12:56:21.988Z"
}
```

Signed-in users resolve to `ownerUserId` = their user id (after install claim). Anonymous extension installs use `install:<installId>` until claimed.

### `PATCH /profile`

Update underwriting posture (buy-box params).

```json
{ "buyBox": { "capRateFloor": 0.1, "rehabPerSf": 40 } }
```

Returns same shape as `GET /profile`.

### `POST /profile/verdict-action`

Matches extension `profile-api.js` contract.

Request:

```json
{
  "action": "keep",
  "parcel_id": "clip-…",
  "workspace_id": "optional",
  "address": "optional"
}
```

Response:

```json
{ "ok": true, "kept": 1, "passed": 0 }
```

Side effects (tenant-private only):
- Appends to `brokerage_user_profiles.investor_profile_json.dealHistory`
- Increments stats
- Fires GTM `deal_kept` / `deal_passed` when install id present

**Sovereignty:** never pooled; never synced to Pipedrive/operator CRM.

## Commits

- `376725f1` — routes + teacher lib + tests
- `9fe187ea` — fix install-id precedence over ephemeral `anon_*` session ids

## Deploy

| Field | Value |
|---|---|
| Canary revision | `cortex-api-00204-kew` (image `9fe187ea`) |
| Canary URL | `https://canary---cortex-api-tds7av26va-uc.a.run.app` |

## Live canary smoke (verified)

```
GET 200 owner install:smoke-profile-fixed-… kept 0
POST keep 200 { ok: true, kept: 1, passed: 0 }
GET after 200 owner install:smoke-profile-fixed-… kept 1 match true
```

Install-scoped owner persists across requests; keep/pass stats durable.

## extension-agent handoff

Wire `src/lib/profile-api.js` (already points at `/profile/verdict-action`). Add `GET /profile` for research rail "who you are" when ready. Send `X-Hauska-Install-Id` on every profile call.
