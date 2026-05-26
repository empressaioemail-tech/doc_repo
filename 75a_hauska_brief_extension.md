---
id: 75a_hauska_brief_extension
title: Hauska Property Brief — Chrome extension and API contracts
status: active
last_updated: 2026-05-26
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
| Chrome MV3 extension | **Pilot v0.4.1** | Zillow, Redfin, Matrix listing detection |
| Floating panel (Shadow DOM) | Shipped | Tab under toolbar area → morphs to panel |
| Deep research page | Shipped UI | `research/research.html` — chat + atom sources panel |
| MCP direct (dev) | Shipped | Extension orchestrates MCP when `briefApiUrl` unset |
| Brokerage API (prod) | **Dispatched** | cc-agent-C — Grok on server |

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
| `defaultJurisdiction` | e.g. `bastrop_tx`, `cedar_hill_tx` |
| `briefApiUrl` | Cortex host (no path) — enables `POST …/brief` |
| `summarizeApiUrl` | Optional — `POST …/brief/summarize` |
| `researchApiUrl` | **Planned** — `POST …/research/chat` (extension field TBD) |

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
| Brokerage API merged + deployed | cc-agent-C |
| Extension `briefApiUrl` pointed at prod cortex-api | Nick |
| CORS `chrome-extension://*` on brokerage routes | cc-agent-C |
| Corpus for pilot metros | cc-agent-E + operator merge |

## Out of scope (extension repo)

- SkySlope upload, PDF branding, Unlock MLS partner listing
- In-extension LLM keys
- Chrome Web Store publish (pilot is unpacked only)
