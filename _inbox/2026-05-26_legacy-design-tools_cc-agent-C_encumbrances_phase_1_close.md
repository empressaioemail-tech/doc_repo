---
id: 2026-05-26_legacy-design-tools_cc-agent-C_encumbrances_phase_1_close
title: Close — Cortex encumbrances Phase 1 (upload + UI + briefing)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: feat/encumbrances-phase-1-upload
related: [_dispatches/2026-05-26_cc-agent-C_encumbrances_phase_1_upload, 80_adrs/adr_020_recorded_instruments_and_restriction_clauses]
---

# Close — Cortex encumbrances Phase 1

## Status

Implementation complete on `feat/encumbrances-phase-1-upload`. PR held for operator merge.

## Delivered

### api-server

- `POST /api/engagements/:id/encumbrances/upload` — multipart PDF → GCS + `recorded_instruments` / `restriction_clauses` rows
- `GET /api/engagements/:id/encumbrances` — instruments + clauses (ADR-020 wire, validated via `@hauska/atom-contract/encumbrances`)
- `PATCH /api/engagements/:id/encumbrances/clauses/:clauseId/verify` — human verify timestamp
- `GET /api/engagements/:id/briefing` — adds `privateRestrictions` summary when clauses exist (not municipal code)
- Extract pipeline: `encumbrance-extract-v1` + `pdf-text` helper (`@workspace/codes-sources/pdf-text`)

### design-tools

- `EncumbrancesPanel` on Site tab (parcel inspector) and Property Intel briefing column
- Upload CTA, instrument list, clause list, PDF link (`/api/storage/objects/...`), verify control

### db

- Migration `lib/db/drizzle/0026_encumbrances.sql`
- Drizzle schema `lib/db/src/schema/encumbrances.ts`

### contract

- `@hauska/atom-contract` pinned via `file:../../../hauska-atom-contract` at **1.2.0** (local until npm publish)

## Verification (HR-8)

```powershell
cd P:\legacy-design-tools
git checkout feat/encumbrances-phase-1-upload
pnpm install --ignore-scripts
cd lib\api-spec
pnpm run codegen
cd P:\legacy-design-tools
pnpm run typecheck
cd artifacts\design-tools
pnpm test -- src/components/engagement-detail/__tests__/EncumbrancesPanel.test.tsx
# Route tests (requires DATABASE_URL / TEST_DATABASE_URL):
cd artifacts\api-server
pnpm test -- src/__tests__/encumbrances.test.ts
```

**Typecheck:** `pnpm run typecheck` green at close.

**Route tests:** require `DATABASE_URL` (same as other api-server route suites).

## Env / deps

- No new runtime env vars beyond existing `PRIVATE_OBJECT_DIR` for GCS uploads
- Apply migration `0026_encumbrances.sql` on deploy targets

## Acceptance mapping

| Criterion | Status |
|---|---|
| Upload PDF on Cedar Hill engagement → instruments + clauses | Ready (manual QA with DB + migration) |
| Human verify updates clause | Implemented + route test |
| Briefing shows private restrictions with provenance | Implemented on briefing GET |
| `pnpm run typecheck` green | Yes |
| PR for operator | Branch ready |
