---
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-05-29_cc-agent-C_brief_encumbrance_upload_path
branch: cortex/encumbrance-r4
base: origin/main @ 2de1004
status: ready_for_operator_merge
---

# Close — PB-301 encumbrance upload path (R4)

## Branch

- **Branch:** `cortex/encumbrance-r4` (fresh from `origin/main` @ `2de1004`)
- **Merge:** held for operator

## Delivered

### Brokerage Property Brief (extension path)

- `POST /api/brokerage/v1/workspaces/encumbrances/upload` — multipart PDF + `workspaceDid` (from `atoms.workspaceDid` on `/brief`)
- `GET /api/brokerage/v1/workspaces/encumbrances?workspaceDid=...`
- Rows keyed by `install_id` + `listing_key` on `recorded_instruments`
- `POST /brief` returns `privateRestrictions`, `meta.encumbranceUploadCta` (`label: "Upload CC&Rs"`), restriction `inlineRefs` on `atoms`
- `POST /research/chat` loads workspace encumbrances and injects `formatPrivateRestrictionsForLlm` into Grok context

### Architect engagement path (unchanged surface)

- `POST/GET /api/engagements/:id/encumbrances*` refactored through `encumbranceService` (same behavior)

### Schema

- `lib/db/drizzle/0031_encumbrances_brokerage_scope.sql` — nullable `engagement_id`, `listing_key`, `install_id`, scope check
- `lib/db/src/schema/encumbrances.ts`

### Docs

- `docs/property-brief-extension-encumbrances.md` — extension-agent CTA + upload contract

## Verification (HR-8)

### `pnpm exec tsc -p tsconfig.json --noEmit` (api-server)

Green after `pnpm exec tsc --build lib/db`.

### `pnpm exec vitest run src/__tests__/encumbranceExtract.test.ts`

```
✓ 2 passed — Article VII fixture text + LLM block formatter
```

### Route tests (DATABASE_URL required)

```
artifacts/api-server/src/__tests__/encumbrances.test.ts
artifacts/api-server/src/__tests__/brokerageEncumbrances.test.ts
```

Not run on cente (`DATABASE_URL` unset).

## Operator deploy

1. Apply migration **`0031_encumbrances_brokerage_scope.sql`** on cortex-api Postgres (staging + prod).
2. Regenerate **`schema.sql.template`** via `pnpm --filter @workspace/db run test:fixture:schema` when `DATABASE_URL` is available (CI drift expected until then).
3. Redeploy cortex-api; extension can wire `meta.encumbranceUploadCta` per docs.

## Acceptance mapping

| Criterion | Status |
|-----------|--------|
| Upload PDF → recorded-instrument / restriction-clause on workspace | Implemented (brokerage route + service) |
| Second `/brief` or research chat cites uploaded restriction | LLM block + `privateRestrictions` on brief payload |
| Extension CTA field documented | `docs/property-brief-extension-encumbrances.md` |
| Fixture PDF test (no clerk scrape) | `encumbranceExtract.test.ts` |
| PR held for operator | Yes |

## Out of scope (confirmed)

R1 county clerk, HOA APIs, full ADR-021 resolver in brief.
