---
id: 2026-06-17_legacy-design-tools_cc-agent-C_deepdive_map_deploy_close
title: cc-agent-C — #193 deep-dive map deploy close
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
merge: 5db07372
pr: 193
---

# Close — #193 cortex-api deploy (research-chat + encumbrance + map-data)

## Deploy sequence

| Step | Run | Result |
|---|---|---|
| build-and-push (main merge) | `27732912658` | success (`5db07372`) |
| deploy-canary (`image_tag=latest`) | `27733042485` | success → `cortex-api-00196-xov` |
| Max allowlist env (gcloud) | local | `--update-env-vars=BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=extension-agent-map-max-qa` → **`cortex-api-00197-hex`** (canary tag, 0% until shift) |
| run-migrations | — | **skipped** (no migration in #193) |
| canary smoke | `scripts/_deepdive-map-deploy-smoke.mjs` | **all pass** (log: `scripts/_deepdive-map-deploy-smoke-output.txt`) |
| shift-traffic | `27733145890` | success |

## Serving revision + rollback

| | Revision |
|---|---|
| **Now serving (100%)** | **`cortex-api-00197-hex`** |
| **Rollback handle** | **`cortex-api-00194-diw`** |

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" -f action=rollback -f rollback_revision=cortex-api-00194-diw
```

Prod URL: `https://cortex-api-tds7av26va-uc.a.run.app`  
Canary tag URL (same revision while at 100%): `https://canary---cortex-api-tds7av26va-uc.a.run.app`

`ENGINE_API_URL` unchanged: `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`

---

## Max map QA install (extension-agent)

**Use this install id for map hero QA with extension_public key:**

```
extension-agent-map-max-qa
```

Set on Cloud Run as:

```
BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=extension-agent-map-max-qa
```

Headers for map-data 200:

```http
POST /api/brokerage/v1/map-data
X-Hauska-Key: <BROKERAGE_EXTENSION_PUBLIC_KEY>
X-Hauska-Install-Id: extension-agent-map-max-qa
Content-Type: application/json

{
  "latitude": 30.1109,
  "longitude": -97.3153,
  "address": "251 Cool Water Dr, Bastrop, TX 78602",
  "jurisdictionCity": "Bastrop",
  "jurisdictionState": "TX"
}
```

Any other fresh `X-Hauska-Install-Id` with extension_public key → **403** `tier_required` (verified).

---

## Canary smoke results (pre-shift)

| # | Check | Result |
|---|---|---|
| 1 | `POST /research/chat` `{address, message, history:[]}` + `X-Hauska-Key` + install | **200** |
| 2a | `complete-upload` minimal/bad PDF | **422** `pdf_unparseable` |
| 2b | `complete-upload` real CC&R (`scripts/_404-remodel-b.pdf`) | **201**, `tenant-private` |
| 3a | `POST /map-data` allowlisted install | **200**, `layers[]` + `reasoningOverlays[]`, `packageTier: max` |
| 3b | `POST /map-data` fresh install (not on allowlist) | **403** `tier_required` |
| 4 | Fresh brief regression | **200** + `entitlement: { freeBriefsRemaining: 2, freeBriefsCap: 3, proActive: false }` |

### Map-data layer snapshot (Bastrop, allowlisted install)

- **layers:** `parcel-polygon:pending`, `flood-zone:ok`, `floodway:ok`, `dem:ok`, `topography:ok`, `opportunity-zone-tract:ok`, `zoning:pending`
- **reasoningOverlays:** floodway, flood-zone, opportunity-zone (with `citationAdapter` + `honesty`)

---

## Handoff extension-agent

1. Research chat: `message` + `address` (or `runId`) — `X-Hauska-Key` or Bearer both work.
2. Attachments: surface **422** `pdf_unparseable.message` inline; real PDF test file `scripts/_404-remodel-b.pdf`.
3. Map hero QA: **`X-Hauska-Install-Id: extension-agent-map-max-qa`** + extension_public key → render `reasoningOverlays[]`.
