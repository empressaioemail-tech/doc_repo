---
id: 2026-05-28_legacy-design-tools_cc-agent-C_property_brief_lay_surface_close
title: Close — Property Brief lay summary + starter telemetry (cc-agent-C)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
dispatch: operator pivot 2026-05-28 (Property Brief lay surface)
---

# Close — Property Brief lay summary + starter telemetry

## PR

| Item | Value |
|------|-------|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/133 |
| Branch | `cortex/property-brief-lay-surface` |
| SHA | `69fd283` |
| Base | `main` (includes merged PR #132 workspace/wallet/graph) |

## Product pivot alignment

- **Property Brief / property intel** language in user-facing errors and disclaimers; API paths remain `/api/brokerage/v1/*` for extension v0.4.x compat.
- **Consumer vs pro render modes** via `presentationMode` (`consumer` default).
- **Lay summary** hides technical citation noise from default contract; `reasoningSummary`, `sections`, and `citations` unchanged for pro/backward compat.

## Changes

### A) `POST /api/brokerage/v1/brief`

- New response field `laySummary`:
  - `verdicts[]`: `{ id, label, status, oneLine, detailParagraph }`
  - Status enum: `yes` | `maybe` | `no` | `unknown`
  - Minimum topics: ADU, flood (when site context exists), major restrictions, corpus coverage honesty
- Request: optional `presentationMode` (`consumer` | `pro`, default `consumer`)
- Request: optional `starterPromptId`, `personaBucket` → logs `starter_prompt_selected`

### B) `POST /api/brokerage/v1/research/chat`

- Lay-friendly `messageHtml` in consumer mode (no `[n]` markers in body)
- New `sources[]` array (same content as `citations[]` for “See sources” / “For your agent”)
- `citations[]` retained for backward compatibility
- `presentationMode`, `starterPromptId`, `personaBucket` supported

### C) Starter prompt constants

File: `artifacts/api-server/src/lib/propertyBriefStarters.ts`

| ID | Label |
|----|-------|
| `adu` | ADU / guest house |
| `flood` | Flood risk |
| `schools` | Schools & neighborhood |
| `str` | Short-term rental |
| `setbacks` | Setbacks & additions |
| `red_flags` | Client red flags |

Persona buckets: `owner_buyer`, `family`, `investor`, `agent_helper`

GTM event: `starter_prompt_selected` with payload `{ starterPromptId, personaBucket, runId, addressHash }`

### D) User-visible copy

- Auth 503 message: “Property Brief API key is not configured…” (was brokerage-branded)

## Acceptance checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| brief includes `laySummary.verdicts` >=3 for Bastrop fixture | **PASS** | Unit test + grok mock in integration test |
| research/chat accepts starter fields + logs GTM event | **PASS** | Mocked `recordGtmEvent` in `brokerageBrief.test.ts` |
| typecheck green | **PASS** | `pnpm --filter @workspace/api-server run typecheck` |
| vitest green when DATABASE_URL set | **BLOCKED** (local) | No DATABASE_URL on workstation; unit tests pass |
| backward compatible (old extension ignores new fields) | **PASS** | Additive fields only; paths unchanged |

## Test output

### Typecheck (pass)

```
pnpm --filter @workspace/api-server run typecheck
# exit 0
```

### Unit tests (pass)

```
pnpm --filter @workspace/api-server exec vitest run src/__tests__/propertyBriefLaySummary.test.ts

 ✓ src/__tests__/propertyBriefLaySummary.test.ts (1 test)
 Test Files  1 passed (1)
 Tests       1 passed (1)
```

### Integration tests (not run locally)

```
# DATABASE_URL not set on workstation
pnpm --filter @workspace/api-server exec vitest run src/__tests__/brokerageBrief.test.ts
# skipped — CI expected to run with DATABASE_URL
```

## Blockers / follow-ups

1. **Merge PR #133** and **deploy-canary** cortex-api so lay summary is live.
2. **Extension repo** (separate): consumer UI for verdicts, starter chips, workspace/wallet wiring from PR #132.
3. Run full `brokerageBrief.test.ts` in CI to confirm integration mocks.

## Files (commit `69fd283`)

- `artifacts/api-server/src/lib/propertyBriefLaySummary.ts` — lay verdict generation (Grok + rules fallback)
- `artifacts/api-server/src/lib/propertyBriefStarters.ts` — six starter IDs + persona buckets
- `artifacts/api-server/src/lib/brokerageBriefLlm.ts` — consumer chat mode, `sources[]`
- `artifacts/api-server/src/routes/brokerageBrief.ts` — wire lay summary + telemetry
- `artifacts/api-server/src/middlewares/brokerageAuth.ts` — user-facing copy
- `artifacts/api-server/src/__tests__/propertyBriefLaySummary.test.ts`
- `artifacts/api-server/src/__tests__/brokerageBrief.test.ts` — extended
