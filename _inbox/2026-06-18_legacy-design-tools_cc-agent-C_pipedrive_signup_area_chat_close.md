# cc-agent-C close — Pipedrive extension signup + research chat area context

**Date:** 2026-06-18  
**Repo:** `legacy-design-tools` @ `0312f44e`  
**Prod:** `https://cortex-api-tds7av26va-uc.a.run.app`  
**Serving revision:** `cortex-api-00225-jag` (100%)

---

## 1. Pipedrive real-signup gap — FIXED

### Root cause

`POST /api/auth/signup` only called `syncPipedrivePerson()` when `X-Hauska-Install-Id` was present on the request. The extension web-auth page (`/api/auth/extension-login`) reads `install_id` from the query string — if the extension omits it or the header is lost, signup succeeded but **no CRM sync ran**.

### Fix (`0312f44e`)

| Change | Detail |
|--------|--------|
| `signupInstallIdFromRequest()` | Resolves install id from header → JSON body (`installId` / `install_id`) → query |
| `pipedriveInstallIdForSignup()` | Always produces an install correlation id; falls back to `hauska-user-{userId}` |
| **Always** sync on signup | No longer gated on header presence |
| `extensionLoginPage.ts` | Signup POST now includes `installId` in JSON body (mirrors header) |
| Acquisition source | `hauska_extension_signup` when install id resolved; else `hauska_web_signup` |

### Live verification — extension-style flow

Simulated exact extension path: `GET /api/auth/extension-login?intent=signup&install_id=…` then `POST /api/auth/signup` with header + body.

| Field | Value |
|-------|-------|
| Flow | extension-login → signup |
| Install | `ext-style-bcd3e7381d1045008a7c` |
| Email | `ext-style-1781802980901@hauska-qa.test` |
| Signup | 201 |
| **Pipedrive person id** | **717** |
| Log | `pipedrive: person synced` on `00225-jag` |

---

## 2. Research chat area / map context — IMPLEMENTED

### Endpoint

`POST /api/brokerage/v1/research/chat`

### Request shape (extension-agent)

**Property chat (unchanged):** provide one of `runId`, `address`, or `workspaceDid`.

**Area / portfolio chat (new):** provide `areaContext` without requiring a brief run.

```json
{
  "message": "Where is rent strongest in what I'm looking at?",
  "history": [],
  "presentationMode": "consumer",
  "areaContext": {
    "scope": "area",
    "jurisdictionKey": "bastrop_tx",
    "jurisdictionCity": "Bastrop",
    "jurisdictionState": "TX",
    "mapBounds": {
      "north": 30.12,
      "south": 30.10,
      "east": -97.30,
      "west": -97.33
    },
    "activeFilters": {
      "minRent": 1800,
      "zoning": ["SF-3", "MF-2"]
    },
    "visibleParcels": [
      {
        "parcelId": "R12345",
        "address": "100 Oak St, Bastrop, TX",
        "latitude": 30.1109,
        "longitude": -97.3152,
        "zoning": "SF-3",
        "rentZestimate": 2200,
        "price": 385000,
        "verdict": "keep",
        "attrs": { "daysOnMarket": 12 }
      }
    ]
  }
}
```

### Eligibility rules

Chat proceeds **without** a brief run when:

- `areaContext.scope === "area"`, **or**
- `areaContext.visibleParcels.length > 0`

Otherwise existing run resolution applies (`runId` / `address` / `workspaceDid`).

### Response additions

```json
{
  "message": "...",
  "method": "anthropic",
  "areaContextApplied": true,
  "confidence": 0.5,
  ...
}
```

### Live verification (`00225-jag`)

```
POST /research/chat
  message: "Which of these parcels are most likely to sell soon?"
  areaContext: { scope: "area", visibleParcels: [Oak St keep, Pine St pass] }

→ 200, method: "anthropic", areaContextApplied: true
→ Answer references 100 Oak St vs 200 Pine St from visible parcel rows
```

---

## Commits

| SHA | Message |
|-----|---------|
| `0312f44e` | Always sync Pipedrive on extension signup + research chat area context |

---

## Extension-agent wiring notes

1. **Signup:** Ensure `install_id` is on the `extension-login` URL (already documented in C2). Backend now also accepts `installId` in signup JSON body.
2. **Area chat:** Pass `areaContext.visibleParcels` from MapLibre selection/filter state; set `scope: "area"` for map-wide questions.
3. **Hybrid:** You may send both `runId` (focused listing) and `areaContext` (map state) — backend merges jurisdiction + atoms from brief with parcel rows for portfolio questions.
