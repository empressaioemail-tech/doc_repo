---
id: 75a_hauska_brief_extension
title: Hauska Property Brief — Chrome extension and API contracts
status: active
last_updated: 2026-07-05
applies_to: portfolio
related: [75_hauska_brokerage_workflow_plan, 50_hauska_mcp_server, 08_tiered_access_model, 28_mcp_first_product_design, _dispatches/2026-05-26_cc-agent-C_brokerage_brief_api]
owner: nick
---

# Hauska Property Brief — Chrome extension and API contracts

> **Code home:** `P:\hauska-brief-extension` (not in `doc_repo`). Pointer: [`_hauska_brief_extension/README.md`](_hauska_brief_extension/README.md).
>
> **Backend dispatch (active):** [`_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md`](_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md) on `legacy-design-tools` / `cortex-api`.

## Product surface

| Surface | Status | Notes |
|---------|--------|-------|
| Chrome MV3 extension | **Pilot v0.4.3** | Zillow, Redfin, Matrix listing detection; GTM consent + events |
| Floating panel (Shadow DOM) | Shipped | Tab under toolbar area → morphs to panel |
| Deep research page | Shipped UI | `research/research.html` — chat + atom sources panel |
| MCP direct (dev) | Shipped | Extension orchestrates MCP when `briefApiUrl` unset |
| Brokerage API (prod) | **Merged PR #128** | Deploy + extension options pending |

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Chrome extension (thin client)                              │
│  P:\hauska-brief-extension                                   │
│  • content script: extract address, panel UI                 │
│  • background SW: MCP brief OR API brief                     │
│  • research page: chat UI (local keyword v1; API v2)         │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
   ┌─────────────────┐            ┌─────────────────────────┐
   │ hauska-mcp-server│            │ cortex-api               │
   │ (dev / catalog)  │            │ /api/brokerage/v1/*      │
   │ search_atoms     │            │ @workspace/codes         │
   └─────────────────┘            │ @workspace/briefing-engine│
                                  │ BRIEFING_LLM_MODE=grok   │
                                  └─────────────────────────┘
```

**Rule:** No `XAI_API_KEY` in the extension. LLM runs on `cortex-api` only.

## Extension options (operator)

| Setting | Purpose |
|---------|---------|
| `mcpUrl` | Dev: `http://127.0.0.1:3000/mcp` |
| `hauskaKey` | `X-Hauska-Key` or Bearer for API/MCP |
| `defaultJurisdiction` | Dev/MCP fallback only — e.g. `bastrop_tx`, `cedar_hill_tx` (see note below) |
| `briefApiUrl` | Cortex host (no path) — enables `POST …/brief` |
| `summarizeApiUrl` | Optional — `POST …/brief/summarize` |
| `researchApiUrl` | Optional — defaults to `{briefApiUrl}/api/brokerage/v1/research/chat` (v0.4.2 live Grok chat) |

### `defaultJurisdiction` vs server geocode (2026-05-28)

When `briefApiUrl` is set (production API mode), `cortex-api` geocodes the listing address and resolves `jurisdiction_key` from the Central TX pilot registry (`legacy-design-tools/lib/codes/src/centralTexasPilot.ts`). The extension option **`defaultJurisdiction` is ignored** for corpus retrieval in API mode.

Use `defaultJurisdiction` only when `briefApiUrl` is unset and the extension calls MCP directly. Pilot honesty for code coverage: [`75b_brief_coverage_v0.md`](75b_brief_coverage_v0.md) and `GET /api/brokerage/v1/coverage`.

## API contracts (extension expects)

### `POST /api/brokerage/v1/brief`

**Request:**

```json
{
  "address": "251 Cool Water Dr, Bastrop, TX 78602",
  "mls_id": "optional",
  "source": "zillow",
  "page_url": "https://..."
}
```

**Response (minimum):** `runId`, `startedAt`, `finishedAt`, `property`, `jurisdiction`, `corpusStatus`, `sections[]`, `citations[]`, `reasoningSummary` (`headline`, `paragraphsHtml`, `citations[]`, `disclaimer`, `method`).

**Response (step 4 parcel):** `siteContext.layers[]` (`layerKind`, `status`, `summary`, `provider?`); `laySummary.verdicts[]` (consumer traffic-light cards; flood verdict uses FEMA layer when present).

**Response (place graph wave, pending Dispatch A deploy):** `atoms` object — `workspaceDid`, `briefRunDid`, `placeLayers[]`, `inlineRefs[]` (extension Dispatch B consumes `inlineRefs` for chat-native atom chips). `property.llUuid` when the parcel adapter returns a parcel (Cotality, sole spine since Regrid was purged 2026-06-17).

**Server:** Geocode → jurisdiction; five code queries via `@workspace/codes` `retrieveAtomsForQuestion`; Grok summary via `getBriefingLlmClient()`; persist `brokerage_brief_runs`.

### `POST /api/brokerage/v1/brief/summarize`

**Request:** `{ address, jurisdiction, corpusStatus, atoms: [{ atomDid, snippet }] }`

**Response:** `{ headline, html, citations[], disclaimer, method: "grok" }`

Extension: `hauska-brief-extension/src/lib/reasoning-summary.js` `fetchReasoningSummary`.

### `POST /api/brokerage/v1/research/chat`

**Request:**

```json
{
  "runId": "uuid",
  "message": "Can the buyer add an ADU?",
  "history": [{ "role": "user|assistant", "content": "..." }]
}
```

**Response:** `{ message, messageHtml, citations[], disclaimer, confidence, generatedAt, method }`

**Server:** Load run; `retrieveAtomsForQuestion` (pattern: `routes/chat.ts`); Grok with atom-only citations.

### `POST /api/brokerage/v1/gtm/consent`

**Request:** `{ installId, consentVersion, graphOptIn, termsAcceptedAt? }`

**Response:** `{ ok, installId, consentVersion, graphOptIn, termsAcceptedAt }`

Extension: options page on first install; local + server when `briefApiUrl` and key set.

### `POST /api/brokerage/v1/gtm/events`

**Request:** `{ installId, eventType, sourceSurface?, runId?, listingKey?, payload? }`

Requires prior consent. Share/graph events require `graphOptIn: true`.

**Headers:** `Authorization` or `X-Hauska-Key`; `X-Hauska-Install-Id` on `/brief` for server-side events.

### `GET /api/brokerage/v1/gtm/digest`

Steward digest (7-day event counts). Operator auth only.

## Extension version history (pilot)

| Version | Change |
|---------|--------|
| 0.3.x | Shadow DOM panel, tab morph, toolbar glow icons |
| 0.4.0 | Deep research page + **Deep research** button |
| 0.4.1 | Fix `OPEN_DEEP_RESEARCH` via background (`tabs.create` from content script blocked in MV3) |

## Pilot test flow

1. `node scripts/generate-icons.mjs` in extension repo (icons required).
2. Load unpacked; pin extension; set `defaultJurisdiction` for pilot city.
3. Zillow homedetails → **property intel** tab → **Run brief**.
4. **Deep research** → chat page with atoms (API chat when backend lands).

## Gates

| Gate | Owner |
|------|-------|
| Brokerage API merged | **Done** PR #128 `73b86bf` |
| Workspace/wallet/graph API | **Done** PR #132; migration `0029` |
| Lay summary API | **Done** PR #133 |
| cortex-api deployed + migrations 0026/28/29 | **Done** 2026-05-28 — see [`90_runbooks/property_brief_cortex_deploy.md`](90_runbooks/property_brief_cortex_deploy.md) |
| Extension `briefApiUrl` + `hauskaKey` at prod | Nick — `https://cortex-api-tds7av26va-uc.a.run.app` |
| Extension v0.5.0 Carfax UI | In progress (`P:\hauska-brief-extension`) |
| CORS `chrome-extension://*` on brokerage routes | Shipped in #128 |
| Corpus for pilot metros | cc-agent-E + operator merge |

## Operator capture addendum (2026-05-28)

Operator scope update: `3b/3c/3d/3e` are now part of **V1**.

### V1 launch gate (current sprint)

1. Deploy `cortex-api` brokerage routes + migration 0026 + Grok env vars.
2. Point extension options to prod API endpoints.
3. Smoke on real Bastrop / Cedar Hill addresses.
4. Ship with retrieval + research chat working and source citations visible.
   - **4a Code + citations** — `sections[]`, `citations[]`, deep research chat (done when prod brief smoke passes).
   - **4b Parcel layers on brief (API)** — `siteContext.layers` (FEMA + Cotality parcel) on `POST /brief`; prod parcel/zoning now resolves through the Cotality adapter (Regrid purged 2026-06-17, so the `REGRID_API_KEY` requirement is retired; the live gate is prod Cotality credentials). Dispatch: [`_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md`](_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md). Merged backend: PR #131.
   - **4c Parcel layers on brief (extension UI)** — panel renders `siteContext` + flood verdict from API `laySummary`. Dispatch: [`_dispatches/2026-05-28_extension_property_brief_parcel_layers_panel.md`](_dispatches/2026-05-28_extension_property_brief_parcel_layers_panel.md).
   - **4d Atom UX (wave 7)** — no listing morph; property list nav; inline atom chips from `atoms.inlineRefs`. Scope: [`_dispatches/2026-05-28_central-tx-property-brief-scope.md`](_dispatches/2026-05-28_central-tx-property-brief-scope.md). Dispatch B: [`_dispatches/2026-05-28_dispatch-B_extension_brief-atom-ux.md`](_dispatches/2026-05-28_dispatch-B_extension_brief-atom-ux.md).
5. Include V1 workspace collaboration, atomization start, paywall-wallet behavior, and admin graph telemetry baseline.

### V1 product requirements (expanded)

1. **Property workspace history:** User can see recent properties researched, reopen a property, rehydrate prior research, and jump back to source listing URL.
2. **Property attachments and notes:** User can add links, images, PDFs, and notes to each property workspace.
3. **Property sharing:** User can share a property workspace (research, citations, links, attachments, notes) with another user.
4. **Atomization start:** Property workspace persists as an atomized package (property dossier atom bundle with source and evidence refs).
5. **Paywall behavior:** Do not lock users out of existing projects. When quota is exhausted, block new research generation only.
6. **Metering UX:** Wallet-style microfunding with auto top-up (`$5` increments) when balance reaches zero.
7. **Admin graph view:** Internal admin page shows session geography as blue dots and share relationships as connecting blue lines.

### Suggested package shape (v1)

- `property-workspace` (root): property identity, listing URL(s), owner, collaborators, status.
- `brief-run` (child): run metadata, reasoning summary, citations, confidence, timestamp.
- `workspace-attachment` (child): url/image/pdf/note with uploader + timestamps.
- `workspace-share-edge` (child): who shared to whom and when.

### Access policy intent

- Owner retains project read access regardless of billing state.
- Collaborators keep read access to shared workspace unless explicitly revoked.
- New compute actions (`/brief`, `/research/chat`) require positive balance or active paid tier.

### V1 acceptance checks (high level)

1. User can reopen any recent property workspace and recover prior brief + research context.
2. User can add and retrieve links, images, PDFs, and notes on a property workspace.
3. User can share a workspace and collaborator can open the same evidence package.
4. Workspace package emits atomized records for run, attachment, and share edges.
5. Zero-balance state preserves project read access but blocks net-new compute actions.
6. Wallet top-up supports `$5` increments with auto-refill behavior.
7. Admin view shows usage dots and share-link edges with consent-aware graph visibility.

## Out of scope (extension repo)

- SkySlope upload, PDF branding, Unlock MLS partner listing
- In-extension LLM keys
- Chrome Web Store publish (pilot is unpacked only)
