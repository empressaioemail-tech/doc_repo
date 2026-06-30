---
id: 2026-06-17_legacy-design-tools_cc-agent-C_deepdive_attachment_map_backend_close
title: cc-agent-C — deep-dive / attachment / map backend close
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-17_cc-agent-C_deepdive_attachment_map_backend
pairs: 2026-06-17_extension-agent_panel_ux_deepdive_attachment_map
---

# Close — research-chat contract + encumbrance complete-upload + map-data (Max hero)

## PR / deploy status

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/193 |
| Branch | `fix/deepdive-research-chat-encumbrance-map` |
| Commits | `349195db`, `f2ad772e` |
| CI | **pass** (Typecheck + Test, run `27732649528`) |
| Deploy | **pending merge to `main`** → `build-and-push` on main → `deploy-canary` (`image_tag=latest`) → smoke → `shift-traffic` |

No schema migration in this PR.

**Rollback handle (pre-deploy prod):** `cortex-api-00194-diw` (from free-brief gate close).

---

## 1. Research-chat body contract (`POST /api/brokerage/v1/research/chat`)

### Root cause

Extension posted `{ message, address }`. Schema required **`runId` (uuid)** + **`message`**, so Zod rejected with **400** `invalid_request` / `"Invalid research chat body"`.

### Fix (PR #193)

Body is a **union** — provide **`message`** (required) plus **one** run selector:

| Selector | When to use |
|---|---|
| `runId` | Preferred after `POST /brief` (inline panel with stored run) |
| `address` | Free-text follow-up / deep-dive composer (resolves latest brief run for install + listing key) |
| `workspaceDid` | Same as address when you already have `did:hauska:property-workspace:<listingKey>` |

**Headers (extension_public):** `Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>` + `X-Hauska-Install-Id`.

**Optional:** `history[]`, `presentationMode` (`consumer` \| `pro`), `starterPromptId`, `personaBucket`, `mls_id`.

**`starterPromptId` enum:** `adu` \| `flood` \| `schools` \| `str` \| `setbacks` \| `red_flags`.

**Not accepted:** bare `workspaceId` (UUID) — use `workspaceDid` or `address`.

### Verbatim accepted examples (extension-agent)

**Inline panel / follow-up (address only — after brief on same install):**

```http
POST /api/brokerage/v1/research/chat
Authorization: Bearer <extension_public_key>
X-Hauska-Install-Id: <install-uuid>
Content-Type: application/json

{
  "address": "251 Cool Water Dr, Bastrop, TX 78602",
  "message": "Can the buyer add an ADU?",
  "history": []
}
```

**Deep-dive with explicit run (from brief response):**

```json
{
  "runId": "8f3c2b1a-4e5d-4c6b-9a0f-1e2d3c4b5a6f",
  "message": "What are the setback rules?",
  "history": [],
  "starterPromptId": "setbacks",
  "personaBucket": "agent_helper"
}
```

**Workspace-scoped:**

```json
{
  "workspaceDid": "did:hauska:property-workspace:<listingKey>",
  "message": "Any red flags on this lot?",
  "history": []
}
```

### Error shapes

| HTTP | When |
|---|---|
| 400 | Missing/invalid body; extension_public without `X-Hauska-Install-Id` |
| 404 | Unknown `runId`, or no brief run for address/workspace on this install → `"No brief run for this property — POST /api/brokerage/v1/brief first"` |
| 429 | extension_public research-chat rate limit |

### 200 shape (unchanged)

`{ message, method, sources[], presentationMode, ... }` — citations in `sources`.

---

## 2. Encumbrance complete-upload (`POST /api/brokerage/v1/workspaces/encumbrances/complete-upload`)

### Fix

Bad/corrupt/minimal PDFs that fail `pdf-parse` (or lack `%PDF-` magic) now return **422** `pdf_unparseable` with a clear `message` — **never 500**.

```json
{
  "error": "pdf_unparseable",
  "message": "Could not extract text from this PDF. Upload a valid CC&R or restriction document (not a blank or corrupted file)."
}
```

### Presign flow (extension_public)

1. `POST .../encumbrances/request-upload-url` — body: `{ workspaceDid, name, size, contentType: "application/pdf" }`
2. `PUT` bytes to `uploadURL`
3. `POST .../complete-upload` — body: `{ workspaceDid, objectPath, name, size, contentType: "application/pdf" }`

`workspaceDid` comes from brief `meta.encumbranceUploadCta.workspaceDid`.

### Known-good test PDF

Repo fixture (untracked locally, not in git): `scripts/_404-remodel-b.pdf` — real CC&R-style doc for end-to-end presign → complete-upload.

**Steps for extension-agent:**

1. Run brief on a listing → copy `meta.encumbranceUploadCta.workspaceDid`
2. Presign → PUT `scripts/_404-remodel-b.pdf` → complete-upload
3. Expect **201** with `instruments[]` + `clauses[]`; each instrument has `accessPolicy: "tenant-private"`, scoped by `installId` + `listingKey`

### Bad PDF test

Minimal bytes (expect **422** after deploy):

```
%PDF-1.4
1 0 obj<<>>endobj
trailer<<>>
%%EOF
```

Smoke script: `scripts/_deepdive-attachment-map-smoke.mjs` (needs `BROKERAGE_EXTENSION_PUBLIC_KEY`).

---

## 3. Map-data Max hero (`POST /api/brokerage/v1/map-data`)

### Gate

**403** `tier_required` when `packageTier !== "max"`. `extension_public` alone is **free** → blocked.

### Max test-entitlement paths (extension-agent → 200)

| Path | How |
|---|---|
| **Operator API key** | `Authorization: Bearer <BROKERAGE_API_KEYS>` (non–extension-public key) → `brokerageAuthTier=operator` → **max** |
| **Install allowlist (new)** | Set Cloud Run env `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=<install-id>[,...]` — grants **max** for those installs even with extension_public key |
| **Authenticated user** | Session JWT + `brokerage_user_profiles.package_tier = 'max'` |

### Request body (Bastrop parcel example)

```json
{
  "latitude": 30.1109,
  "longitude": -97.3153,
  "address": "251 Cool Water Dr, Bastrop, TX 78602",
  "jurisdictionCity": "Bastrop",
  "jurisdictionState": "TX"
}
```

Optional: `layers[]`, `parcelKey`, `forceRefresh`, `contextLayers[]` (brief layers → verdict overlays).

### 200 response shape (reasoning-first, not raw geometry hero)

```json
{
  "mapData": {
    "parcelKey": "...",
    "place": { "latitude", "longitude", "formattedAddress" },
    "tenantScope": "...",
    "layers": [
      {
        "layerKey": "flood-zone",
        "status": "ok",
        "adapterKey": "fema:nfhl-flood-zone",
        "envelope": {
          "payload": { "attributes": { "floodZone": "..." } },
          "confidence": { "value", "kind" },
          "dataVintage": "...",
          "coverage": { "degraded", "reason" },
          "source": { "adapter", "citationIds": [] }
        }
      }
    ],
    "assembledAt": "..."
  },
  "reasoningOverlays": [
    {
      "id": "layer-flood-zone",
      "kind": "flood-zone",
      "label": "FEMA flood zone X",
      "detail": null,
      "citationAdapter": "fema:nfhl-flood-zone",
      "anchor": { "latitude", "longitude" },
      "honesty": { "confidence", "dataVintage", "coverage", "source" }
    }
  ],
  "honesty": { },
  "packageTier": "max"
}
```

**Hero should render `reasoningOverlays`** (cited labels + `honesty` provenance per overlay). `mapData.layers` carries adapter envelopes for assembly/debug; polygon geometry is not the primary hero contract.

### Overlay kinds emitted (`buildMapReasoningOverlays`)

`verdict`, `opportunity-zone`, `floodway`, `flood-zone`, `mud-pid`, `layer-note` — only when the corresponding assemble slot is `ok` or verdict/context supplies text.

### Layers often stubbed / no overlay

These assemble keys may return `pending`, `no-coverage`, or `failed` without a reasoning overlay (engine/spine dependent):

- `dem`, `topography` — elevation mesh; hero uses reasoning pins, not DEM tiles
- `zoning` — may be `ok` in envelope but **no dedicated reasoning overlay** today (only flood/OZ/verdict paths)
- `parcel-polygon` — geometry slot; not surfaced as a reasoning overlay

Pass `contextLayers` from the brief payload to populate `verdict` / `mud-pid` overlays when available.

### Live smoke

After deploy: `BROKERAGE_EXTENSION_PUBLIC_KEY=... BROKERAGE_OPERATOR_KEY=... node scripts/_deepdive-attachment-map-smoke.mjs https://canary---cortex-api-tds7av26va-uc.a.run.app`

---

## Handoff checklist for extension-agent

- [ ] Research chat: send `message` + `address` (or `runId` from brief)
- [ ] Attachments: presign → PUT → complete-upload; surface **422** `pdf_unparseable.message` inline
- [ ] Real CC&R test: `scripts/_404-remodel-b.pdf` + workspaceDid from brief meta
- [ ] Map hero: Max gate — use operator key in dev **or** request install id on `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS`; render `reasoningOverlays` not raw layer geometry
