---
id: 2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api
title: Close — Brokerage Property Brief API (cc-agent-C)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brokerage-brief-api
dispatch: _dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md
---

# Brokerage Property Brief API — delivery

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/128

## What shipped

| Route | Purpose |
|-------|---------|
| `POST /api/brokerage/v1/brief` | Full brief: geocode → jurisdiction → 5 code queries → Grok reasoning → persist `brokerage_brief_runs` |
| `POST /api/brokerage/v1/brief/summarize` | Grok summary from client-provided atoms (`[n]` citations) |
| `POST /api/brokerage/v1/research/chat` | Deep-research chat: load run, retrieve atoms for message, Grok answer |

**Auth:** `Authorization: Bearer <key>` or `X-Hauska-Key` (comma-separated keys via `BROKERAGE_DEV_API_KEY` / `BROKERAGE_API_KEYS`).

**CORS:** `chrome-extension://*` allowed on brokerage routes only.

**LLM:** Reuses `briefingLlmClient.ts` + `@workspace/briefing-engine` Grok path. No Anthropic on brokerage routes. Rules fallback when `BRIEFING_LLM_MODE=mock`.

## Deploy notes

1. Apply migration: `lib/db/drizzle/0026_brokerage_brief_runs.sql`
2. Set on cortex-api (Cloud Run / local):

| Variable | Value |
|----------|--------|
| `BROKERAGE_DEV_API_KEY` | Pilot key(s), comma-separated OK |
| `BRIEFING_LLM_MODE` | `grok` |
| `XAI_API_KEY` | xAI key (required for grok) |
| `XAI_BRIEFING_MODEL` | Optional; default `grok-3-mini` |

3. Extension options (no UI change): `briefApiUrl` = cortex host (no path); `summarizeApiUrl` = `…/api/brokerage/v1/brief/summarize`; future `researchApiUrl` = `…/api/brokerage/v1/research/chat`.

4. Corpus: pilot metros `bastrop_tx`, `cedar_hill_tx` must be warmed (cc-agent-E / operator).

## Verification

- Workspace `pnpm run typecheck` — **green** locally.
- `artifacts/api-server` vitest `brokerageBrief.test.ts` — requires `DATABASE_URL` (CI / local Postgres). Mocks Grok + retrieval.
- Manual pilot after deploy with Bastrop address below.

## Sample curl

Replace `HOST` and `KEY`.

### 1. Full brief

```bash
curl -sS -X POST "https://HOST/api/brokerage/v1/brief" \
  -H "Authorization: Bearer KEY" \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"251 Cool Water Dr, Bastrop, TX 78602\",\"source\":\"zillow\",\"page_url\":\"https://www.zillow.com/homedetails/example\"}"
```

Expect: `runId`, `jurisdiction: "bastrop_tx"`, `sections` (5), `reasoningSummary.method: "grok"` when Grok configured.

### 2. Summarize

```bash
curl -sS -X POST "https://HOST/api/brokerage/v1/brief/summarize" \
  -H "Authorization: Bearer KEY" \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"251 Cool Water Dr, Bastrop, TX 78602\",\"jurisdiction\":\"bastrop_tx\",\"corpusStatus\":\"in_corpus\",\"atoms\":[{\"atomDid\":\"did:example:1\",\"snippet\":\"ADUs shall comply with setback requirements.\"}]}"
```

Expect: `headline`, `html`, `citations[]`, `method: "grok"`.

### 3. Research chat

Run brief first; copy `runId` from response.

```bash
curl -sS -X POST "https://HOST/api/brokerage/v1/research/chat" \
  -H "Authorization: Bearer KEY" \
  -H "Content-Type: application/json" \
  -d "{\"runId\":\"RUN_UUID_FROM_BRIEF\",\"message\":\"Can the buyer add an ADU?\",\"history\":[]}"
```

Expect: `message`, `messageHtml`, `citations`, `method: "grok"`. Bad `runId` → 404.

### 401 check

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST "https://HOST/api/brokerage/v1/brief" \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"251 Cool Water Dr, Bastrop, TX 78602\"}"
```

Expect: `401`.

## Files (main)

- `artifacts/api-server/src/routes/brokerageBrief.ts`
- `artifacts/api-server/src/middlewares/brokerageAuth.ts`
- `artifacts/api-server/src/middlewares/brokerageCors.ts`
- `artifacts/api-server/src/lib/brokerageBriefLlm.ts`
- `lib/db/drizzle/0026_brokerage_brief_runs.sql`
- `artifacts/api-server/src/__tests__/brokerageBrief.test.ts`
- `docs/deploy.md` (env table)

## Out of scope (unchanged)

SkySlope, PDF export, MCP server, engagement `/api/chat`, extension UI.
