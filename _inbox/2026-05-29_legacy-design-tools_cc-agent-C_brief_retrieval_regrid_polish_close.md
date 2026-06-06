---
id: 2026-05-29_legacy-design-tools_cc-agent-C_brief_retrieval_regrid_polish_close
title: Close — cc-agent-C brief retrieval + Regrid polish (PB-005, PB-006, ADU)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brief-retrieval-regrid-polish
base: main @ 2de10040 (PR #134)
kind: close
related: [2026-05-29_cc-agent-C_brief_retrieval_regrid_polish, 75c_property_brief_data_backlog]
---

# Close — Property Brief retrieval + Regrid polish

## Branch

`cortex/brief-retrieval-regrid-polish` from `main` @ `2de10040`.

**Not merged.** PR held for operator merge per dispatch.

## PB-006 — Richer Regrid in LLM site context ✅

| Item | Status |
|------|--------|
| Full Premium Regrid payload in `place_layer_snapshots` | Unchanged — `writePlaceLayerSnapshot` already stores `result.payload` on ok |
| `formatSiteContextForLlm` field detail | ✅ APN, `ll_uuid`, acres, land use, owner, zoning code/desc/subtype |
| Regrid field keys | ✅ `parcelnumb`, `zoning`, `zoning_description`, etc. alongside pilot GIS keys |
| Parcel `inlineRefs` when Regrid ok | ✅ Label `Parcel APN {apn}` when `ll_uuid` present |

**LLM block example (ok regrid-parcel):**

```
Site context layers:
- regrid-parcel (Regrid):
  · APN: R12345
  · Regrid ll_uuid: parcel-uuid-99
  · Area: 0.42 acres
  · Land use: Single Family
  · Owner: Example Owner
```

## PB-005 — `BRIEF_CODE_RETRIEVAL=mcp` ✅

| File | Change |
|------|--------|
| `lib/codes/src/briefRetrievalSubstrate.ts` | HTTP client → retrieval-api `GET /search` (same contract as MCP `search_atoms`) |
| `lib/codes/src/retrieval.ts` | When `BRIEF_CODE_RETRIEVAL=mcp`, call substrate; warn + fall back to neon on missing URL, error, or empty hits |

**Env (any one URL + optional key):**

| Variable | Role |
|----------|------|
| `BRIEF_RETRIEVAL_API_URL` | Preferred retrieval-api base |
| `HAUSKA_BACKEND_URL` | Fallback (mcp-server default) |
| `BRIEF_RETRIEVAL_API_KEY` / `RETRIEVAL_API_KEY` / `HAUSKA_ENGINE_API_KEY` | Bearer for `/search` |

**Jurisdiction:** underscore slug (`bastrop_tx`) passed as `jurisdiction` query param.

**Tests:** `lib/codes/src/retrieval.test.ts` — mocked `BriefSubstrateSearchClient`; substrate success + neon fallback on throw.

**Handoff doc:** Referenced path `hauska-engine/services/retrieval-api/docs/brief-code-retrieval-mcp.md` was not present on disk at `P:\hauska-engine`; contract implemented from `services/retrieval-api/src/server.ts` + hauska-mcp-server `hauska-client.ts`.

## Bastrop ADU depth ✅

| Fix | Rationale |
|-----|-----------|
| `applyMinScore: false` on brief + research retrieval | Operator saw `in_corpus` but weak vector scores dropped ADU hits below 0.35 |
| `BROKERAGE_ADU_RESEARCH_QUERIES` on ADU starter / ADU message / ADU citation queries | Extra substrate/neon passes for research chat |
| Research chat merges longer snippets from brief `sections` + retrieval | Grok gets section text, not only atom DIDs |
| First code query remains `"accessory dwelling unit ADU requirements"` | Already in `BROKERAGE_CODE_QUERIES` |

**Tests:** `brokerageBrief.test.ts` — citations include ADU/accessory; research chat issues ADU-oriented retrieval calls (mocked).

## Corpus gap note (Bastrop live)

If production still returns generic “no ADU rules” with `in_corpus`:

1. Confirm `bastrop_tx` atoms in Neon contain ADU/accessory language (operator warmup PB-001).
2. Smoke with `BRIEF_CODE_RETRIEVAL=neon` vs `mcp` against a deployment with `HAUSKA_BACKEND_URL` pointed at current retrieval-api.
3. Vector scores on ADU query — brief path now bypasses min-score floor; if citations are still empty, corpus may lack ADU-titled sections (document gap, not retrieval wiring).

## Tests run (local)

| Suite | Result |
|-------|--------|
| `lib/codes` `retrieval.test.ts` | 15 passed |
| `artifacts/api-server` `brokerageSiteContext.test.ts` | 6 passed |
| `artifacts/api-server` `brokerageBriefAtoms.test.ts` | 1 passed |
| `brokerageBrief.test.ts` | Requires `DATABASE_URL` / test schema (not run locally) |

## Out of scope (confirmed)

- Neon load (cc-agent-E)
- Federal layers (separate branch `cortex/brief-federal-site-context`)
- Encumbrance upload (PB-301)
- Paywall

## Acceptance mapping

| Criterion | Status |
|-----------|--------|
| Regrid ok → LLM site context includes zoning + APN | ✅ |
| `BRIEF_CODE_RETRIEVAL=mcp` mock tested; neon default unchanged | ✅ |
| Bastrop `/brief` citations ADU-aware in unit test | ✅ (mock) |
| PR for operator merge | ✅ branch ready, not pushed |

## Files touched

- `lib/codes/src/briefRetrievalSubstrate.ts` (new)
- `lib/codes/src/retrieval.ts`
- `lib/codes/src/retrieval.test.ts`
- `artifacts/api-server/src/lib/brokerageSiteContext.ts`
- `artifacts/api-server/src/lib/brokerageBriefAtoms.ts`
- `artifacts/api-server/src/routes/brokerageBrief.ts`
- `artifacts/api-server/src/__tests__/brokerageSiteContext.test.ts`
- `artifacts/api-server/src/__tests__/brokerageBriefAtoms.test.ts`
- `artifacts/api-server/src/__tests__/brokerageBrief.test.ts`
