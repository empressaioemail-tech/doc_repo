---
date: 2026-05-26
agent: cursor-auto (cc-agent-C dispatch)
repo: legacy-design-tools
branch: sprint/placid-collateral
status: ready-for-review
---

# Close-out — Placid client collateral export

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/124

Branch: `sprint/placid-collateral` → `main` (commit `ce051cf`)

## Migration

`lib/db/drizzle/0025_add_collateral.sql`

Tables: `collateral_export_jobs`, `collateral_exports`, `collateral_metering_events`

Test fixture append: `lib/db/src/__tests__/__fixtures__/schema.sql.template` (canva + collateral DDL for route tests)

## Operator env vars

```env
PLACID_API_TOKEN=
PLACID_TEST_MODE=true
PLACID_TEMPLATE_COVER=<uuid from Placid dashboard>
PLACID_TEMPLATE_PLAN=<uuid>
PLACID_TEMPLATE_CLOSING=<uuid>
COLLATERAL_SIGNING_SECRET=<random 32+ chars>

# Frontend (design-tools)
VITE_COLLATERAL_API=1
VITE_CANVA_AUTOFILL=0
```

Without `PLACID_API_TOKEN`, export jobs complete with **dev stub** `downloadUrl` (tests + local UI smoke).

Without `PLACID_TEMPLATE_*`, live Placid POST uses placeholder UUIDs — use `PLACID_TEST_MODE=true` until operator supplies real template UUIDs.

## Placid layer ↔ slot mapping (client-presentation)

| Placid layer | Type | API / source |
|--------------|------|----------------|
| `headline` | text | `textFields.headline` · Packages `clientHeadline` prefill |
| `address` | text | `textFields.address` |
| `project_name` | text | `textFields.project_name` |
| `hero_image` | image | `slotMapping.hero_image` or hero picker → signed `/api/collateral/fetch/...` |
| `floor_plan` | image | per plan page: sheet asset id → signed fetch |
| `sheet_label` | text | sheet asset id label |
| `talking_points` | text | `textFields.talking_points` · Packages `clientTalkingPoints` prefill |

**Page order:** `PLACID_TEMPLATE_COVER` → N × `PLACID_TEMPLATE_PLAN` (max 12 sheets) → `PLACID_TEMPLATE_CLOSING`

**Credits:** 2 per page; `credits_estimated` on job create; `credits_actual` + `collateral_metering_events` row on success.

## Verification run

```text
pnpm --filter @workspace/api-server run test -- src/__tests__/exportSignedUrl.test.ts src/__tests__/collateral-route.test.ts
# 8 passed (DATABASE_URL from .env.local)

node scripts/patch-openapi-collateral.mjs
pnpm --filter @workspace/api-spec codegen
# orval OK (typecheck:libs may fail on pre-existing ViewCubeWidget in portal-ui)
```

## Spike

`scripts/spike-placid.mjs` — POST PDF to Placid with `PLACID_TEST_MODE`; optional signed URL when api-server + job exist. Operator runs with real `PLACID_TEMPLATE_*` for production QA.

## UX

- **Deliver → Client materials:** primary **Generate PDF** (no Canva OAuth).
- Canva autofill hidden when `VITE_CANVA_AUTOFILL=0`; backlog link for upload-only.
- Local stack: `dev:local` per `artifacts/api-server/README-collateral.md` and `docs/local-dev-windows.md`.

## Key files

| Area | Path |
|------|------|
| Signed URLs | `artifacts/api-server/src/lib/collateral/exportSignedUrl.ts` |
| Routes | `artifacts/api-server/src/routes/collateral.ts` |
| Worker | `artifacts/api-server/src/lib/collateral/exportWorker.ts` |
| Schema | `lib/db/src/schema/collateral.ts` |
| OpenAPI patch | `scripts/patch-openapi-collateral.mjs` |
| Portal service | `lib/portal-ui/src/collateral/apiCollateralService.ts` |
| UI | `artifacts/design-tools/src/components/engagement-detail/ClientMaterialsTab.tsx` |

## Out of scope (unchanged)

Canva routes/schema retained; Placid video; tenant template DB; billing integration beyond metering stub.
