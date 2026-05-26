---
id: 2026-05-26_cc-agent-C_placid_collateral_export
title: Dispatch — Placid client collateral export (replace Canva autofill)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: sprint/placid-collateral
status: ready
source: _inbox/2026-05-26_legacy-design-tools_cursor-auto_placid_collateral_sprint_plan.md
---

# Placid collateral export — cc-agent-C

**Canonical plan:** [`_inbox/2026-05-26_legacy-design-tools_cursor-auto_placid_collateral_sprint_plan.md`](../_inbox/2026-05-26_legacy-design-tools_cursor-auto_placid_collateral_sprint_plan.md)

## Decision

Replace **Canva Enterprise autofill** as the primary Deliver → **Client materials** path with **Placid** headless PDF export. Keep Canva code behind feature flag; optional upload-only later.

## Branch

`sprint/placid-collateral` from `main`.

## Execute phases 0–6 from inbox plan

Follow the inbox doc phase-by-phase. Summary:

| Phase | Deliverable |
|-------|-------------|
| 0 | Block on operator: `PLACID_*` template UUIDs in env — use test mode + env placeholders until provided |
| 1 | `scripts/spike-placid.mjs` + HMAC signed asset URLs + `GET /api/collateral/fetch/:token/:assetKey` |
| 2 | `collateral_export_jobs`, `collateral_exports`, `routes/collateral.ts`, `lib/collateral/*`, migration (next free id after Canva/jurisdiction), tests |
| 3 | `patch-openapi-collateral.mjs` + codegen + `apiCollateralService.ts` |
| 4 | `ClientMaterialsTab` — Generate PDF primary; `VITE_CANVA_AUTOFILL=0`; hide Connect Canva as primary |
| 5 | `credits_actual` + metering row on job complete |
| 6 | GCS PDF persist if needed, 429 backoff, `README-collateral.md` |

## Critical constraint

Placid must fetch **public** image URLs. Implement signed export URLs **before** wiring Placid worker.

## Reuse (do not rewrite)

- `lib/canva/assets.ts` patterns → `lib/collateral/assets.ts`
- `canva/pushWorker.ts` → `collateral/exportWorker.ts`
- `ClientMaterialsTab` picker + poll UX
- `scripts/patch-openapi-canva.mjs` CRLF pattern for OpenAPI

## Out of scope

- Placid video, Editor SDK, tenant custom templates
- Canva upload-only OAuth revival
- Billing system integration beyond metering row
- Removing `canva_*` tables

## Local QA

`dev:local` + `DATABASE_URL` + migration push — **not** `pnpm run dev` proxy.

## Close

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md`
