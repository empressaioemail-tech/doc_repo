---
id: 2026-05-26_cc-agent-C_brokerage_brief_api
title: Dispatch — Brokerage Property Brief API + Grok research chat
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brokerage-brief-api
sprint: 75_hauska_brokerage_workflow_plan (Phase 0 + research chat)
---

# Brokerage Property Brief API — backend for Chrome extension

**Canonical plan:** [`75_hauska_brokerage_workflow_plan.md`](../75_hauska_brokerage_workflow_plan.md) Phase 0.

**Thin client (already built, do not redesign UI):** `P:\hauska-brief-extension` v0.4.x — panel + `research/research.html`. Extension expects these HTTP contracts.

**Operator context:** `BRIEFING_LLM_MODE=grok` + `XAI_API_KEY` already used for parcel briefings (`briefingLlmClient.ts`). Reuse that stack; do not add Anthropic paths for brokerage.

---

## Goal

Implement `/api/brokerage/v1/*` on `cortex-api` so the Hauska Property Brief extension can:

1. Run a full property brief (code + Grok reasoning) server-side.
2. Summarize atom hits with Grok (upgrade from rules-only).
3. Power deep-research chat turns with retrieval + Grok + atom citations.

**API keys stay server-side.** Extension sends `Authorization: Bearer <key>` or `X-Hauska-Key` (match existing extension `hauskaKey` field).

---

## Routes (implement all three)

### 1. `POST /api/brokerage/v1/brief`

**Request** (extension `brief-engine.js` `runBriefApi`):

```json
{
  "address": "251 Cool Water Dr, Bastrop, TX 78602",
  "mls_id": "optional",
  "source": "zillow",
  "page_url": "https://..."
}
```

**Response** (must satisfy extension + research page):

```json
{
  "runId": "uuid",
  "startedAt": "ISO",
  "finishedAt": "ISO",
  "property": { "address": "...", "source": "...", "url": "..." },
  "jurisdiction": "bastrop_tx",
  "corpusStatus": "in_corpus|partial|no_match|unknown",
  "geocode": { "lat": 0, "lon": 0 } ,
  "sections": [
    {
      "title": "ADU",
      "query": "accessory dwelling unit ADU requirements",
      "hits": [{ "atomDid": "did:...", "snippet": "...", "score": 0.82 }]
    }
  ],
  "citations": [{ "atomDid": "...", "query": "...", "snippet": "..." }],
  "reasoningSummary": {
    "headline": "...",
    "paragraphsHtml": "<p>...</p>",
    "citations": [{ "n": 1, "atomDid": "...", "label": "ADUs" }],
    "disclaimer": "...",
    "generatedAt": "ISO",
    "method": "grok"
  },
  "meta": {
    "disclaimer": "Not legal advice...",
    "tool": "brokerage-brief-v1"
  }
}
```

**Server logic:**

| Step | Implementation |
|------|----------------|
| Auth | Middleware: validate brokerage API key (v1: env `BROKERAGE_API_KEYS` comma list OR single `BROKERAGE_DEV_API_KEY`; structure for tenant slug later) |
| Geocode | Nominatim or existing geocode helper; map to `jurisdiction` via codes jurisdiction list |
| Code retrieval | Five fixed queries (match extension `CODE_QUERIES` in `hauska-brief-extension/src/lib/brief-engine.js`) via `@workspace/codes` `retrieveAtomsForQuestion` — **not** extension MCP |
| Reasoning | `@workspace/briefing-engine` + `getBriefingLlmClient()` when `BRIEFING_LLM_MODE=grok`; fallback rules summary if mock/no key |
| Persist | New table `brokerage_brief_runs` (migration): `id`, `tenant_slug`, `listing_key`, `address`, `payload_json`, `created_at` |
| listing_key | v1: hash of normalized address + mls_id |

### 2. `POST /api/brokerage/v1/brief/summarize`

**Request** (extension `fetchReasoningSummary`):

```json
{
  "address": "...",
  "jurisdiction": "bastrop_tx",
  "corpusStatus": "in_corpus",
  "atoms": [{ "atomDid": "...", "snippet": "..." }]
}
```

**Response:**

```json
{
  "headline": "...",
  "html": "<p>...</p>",
  "summary": "plain fallback",
  "citations": [{ "n": 1, "atomDid": "...", "label": "..." }],
  "disclaimer": "...",
  "method": "grok"
}
```

Grok prompt: agent diligence tone; require inline `[n]` mapping to provided atoms; no compliance guarantees.

### 3. `POST /api/brokerage/v1/research/chat`

**Request** (extension will add `researchApiUrl` later):

```json
{
  "runId": "uuid-from-brief",
  "message": "Can the buyer add an ADU?",
  "history": [{ "role": "user"|"assistant", "content": "..." }]
}
```

**Response:**

```json
{
  "message": "plain text",
  "messageHtml": "<p>...</p>",
  "citations": [{ "n": 1, "atomDid": "...", "label": "...", "snippet": "..." }],
  "disclaimer": "...",
  "confidence": 0.0,
  "generatedAt": "ISO",
  "method": "grok"
}
```

**Server logic:**

1. Load `brokerage_brief_runs` by `runId` (404 if missing).
2. `retrieveAtomsForQuestion` for `message` + jurisdiction from run (pattern: `routes/chat.ts`).
3. Merge with atoms already in run payload (dedupe by `atomDid`).
4. Grok via `getBriefingLlmClient()`; system prompt = Texas agent research assistant; cite only provided atoms.
5. Parse citations from model output OR assign `[n]` server-side from retrieval set (prefer deterministic server-side numbering like extension `buildReasoningSummary`).

---

## Code placement

| Piece | Path |
|-------|------|
| Router | `artifacts/api-server/src/routes/brokerageBrief.ts` (or `brokerage/`) |
| Register | `artifacts/api-server/src/routes/index.ts` — mount at `/brokerage/v1` or full paths in router |
| Auth middleware | `artifacts/api-server/src/middlewares/brokerageAuth.ts` |
| LLM | Reuse `artifacts/api-server/src/lib/briefingLlmClient.ts` |
| Retrieval | `@workspace/codes` — same as `routes/chat.ts` |
| Migration | `packages/db` — `brokerage_brief_runs` |
| OpenAPI/zod | Add zod schemas; optional OpenAPI stub |
| Tests | `artifacts/api-server/src/__tests__/brokerageBrief.test.ts` — mock Grok + mock retrieval |

**CORS:** Allow `chrome-extension://*` for brokerage routes only (or reflect extension id from env).

---

## Extension contract verification

After implementation, manual test against:

- `briefApiUrl` = `https://<cortex-api-host>` (no trailing path)
- `summarizeApiUrl` = `https://<cortex-api-host>/api/brokerage/v1/brief/summarize`
- Future: `researchApiUrl` = `.../api/brokerage/v1/research/chat`

Extension repo: `P:\hauska-brief-extension` — do not change UI in this dispatch unless needed for CORS header name alignment.

---

## Out of scope

- SkySlope connector, Matrix partner API, PDF export (Phase 2+)
- Hauska MCP server changes
- Regrid/FEMA adapter orchestration in v1 (optional stretch: call one adapter if trivial reuse exists)
- Engagement-scoped `/api/chat` changes
- Anthropic briefing path for brokerage

---

## Acceptance

- [ ] `POST /api/brokerage/v1/brief` with pilot address (Bastrop or Cedar Hill) returns `sections` + `reasoningSummary.method === "grok"` when `BRIEFING_LLM_MODE=grok`
- [ ] `POST /api/brokerage/v1/brief/summarize` returns HTML + citations from provided atoms
- [ ] `POST /api/brokerage/v1/research/chat` with valid `runId` returns cited answer; 404 on bad runId
- [ ] Unauthorized without API key → 401
- [ ] Vitest green; workspace typecheck clean
- [ ] `docs/deploy.md` env table: `BROKERAGE_DEV_API_KEY`, existing `BRIEFING_LLM_MODE`, `XAI_API_KEY`

---

## Close

File inbox: `P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api.md`
