---
id: 2026-05-25_legacy-design-tools_cc-agent-C_qa59_jurisdiction_v1_close
title: Close — QA-59 jurisdiction surfacing v1 (UI)
date: 2026-05-25
agent: cc-agent-C
repo: legacy-design-tools
branch: fix/qa-59-jurisdiction-surfacing-v1
status: ready-for-review
closes: [QA-59]
---

# QA-59 — Jurisdiction surfacing v1 (UI) — close courier

## Summary

Client-side Code Library information architecture: **Active on this project**, **Your firm**, and **Explore catalog** (collapsed by default). Substrate panel adds a filtered-vs-nationwide summary line. No API/DB changes.

## Branch

`fix/qa-59-jurisdiction-surfacing-v1` (from `main`, up to date at start)

**PR:** not pushed — operator creates via `git push -u origin fix/qa-59-jurisdiction-surfacing-v1` when ready.

## Files changed

| File | Change |
|------|--------|
| `artifacts/design-tools/src/lib/jurisdictionSurfacing.ts` | State normalization, firm state collection, key/displayName matching heuristic |
| `artifacts/design-tools/src/lib/__tests__/jurisdictionSurfacing.test.ts` | Unit tests for heuristic |
| `artifacts/design-tools/src/pages/CodeLibrary.tsx` | Three sections, explore search, engagement context, empty-firm CTA |
| `artifacts/design-tools/src/components/SubstrateCatalogPanel.tsx` | `firmStateCodes` summary line |
| `artifacts/design-tools/src/components/__tests__/CodeLibrary.test.tsx` | QA-59 section tests + scoped queries |

## Matching heuristic (documented for review)

Jurisdiction cards match a 2-letter state when:

- `key` ends with `_<st>`, `-<st>`, or `<st>` (e.g. `grand_county_ut`, `bastrop-tx`), or
- `displayName` contains the state token (word boundary or `, UT` style).

Firm states come from `engagement.site.geocode.jurisdictionState` and fallback parse of `engagement.jurisdiction` (`City, ST`).

## Acceptance checklist

- [x] 0 engagements: empty-firm copy + Explore collapsed (no card wall)
- [x] UT+TX engagements: Your firm shows matching cortex cards first
- [x] `engagementId` prop / `?engagementId=` → Active on this project section (deduped from Your firm)
- [x] Substrate `live`/`fixture` badge unchanged
- [x] Warmup, book pills, atom browse, embedded dashboard mode preserved
- [x] `pnpm run typecheck` green
- [x] Targeted vitest green (see below)

## Test commands

```powershell
cd P:\legacy-design-tools
pnpm run typecheck
cd artifacts\design-tools
pnpm exec vitest run src/components/__tests__/CodeLibrary.test.tsx src/lib/__tests__/jurisdictionSurfacing.test.ts src/components/__tests__/SubstrateCatalogPanel.test.tsx
```

## Local verify

1. `pnpm --filter @workspace/design-tools dev` (operator restarting Vite for Canva — unrelated)
2. Dashboard embedded Code Library: with no projects, see CTA; expand **Explore catalog** for full grid
3. With Musgrave (UT) + Bastrop (TX) projects: **Your firm** shows UT+TX cards; **Explore** has full list + search
4. `/code-library?engagementId=<ut-project-id>` → **Active on this project** section

## Out of scope (unchanged)

- `practiceStates[]` persistence (v1.5)
- `substrateJurisdictionKey` / `coverageStatus` (v2)
- Server `?states=` filter (v3)
- Request coverage CTA / deploy

## Operator

Merge when CI green. No deploy required for this slice.
