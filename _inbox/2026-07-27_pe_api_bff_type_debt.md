---
id: 2026-07-27_pe_api_bff_type_debt
title: PE api/ BFF type debt — pre-existing latent bugs surfaced by adding an api tsconfig
date: 2026-07-27
status: filed (non-fatal; not QA scope; fix on a later hygiene pass)
owner: nick
planner: qa
repo: hauska-map
related: [2026-07-27_bastrop_qa_defect_register]
purpose: Record genuine pre-existing type defects in the property-explorer serverless BFF (api/) that were never type-checked before, so they are tracked rather than lost. They do NOT block deploys (Vercel prints them as non-fatal warnings; the build promotes to Ready regardless).
---

# PE api/ BFF type debt

## How this surfaced

During the QA deploy pass (2026-07-27), deploying property-explorer showed a cascade of TS errors in `apps/property-explorer/api/`. Root cause: the `api/` dir had NO tsconfig and no `@types/node`, so nothing type-checked those serverless functions — the app build's `tsc --noEmit` uses the root tsconfig whose `include` is `["src"]` only. Vercel's `@vercel/node` function compilation type-checks them and prints errors, but they are NON-FATAL: PE prod deployed Ready throughout (confirmed via `vercel inspect` — the prod alias resolves to a Ready revision).

## Fixed this pass (hygiene, PRs #82 + #84)

- Added `@types/node` devDep + `apps/property-explorer/api/tsconfig.json` (`types: [node]`, `lib: [ES2022, DOM]` for global fetch/Response). With that config, `tsc -p api/tsconfig.json` is clean across all 20 api files.
- This makes api types resolvable for local dev and is correct hygiene. It did NOT change the deploy outcome (deploy was never actually blocked — the earlier read of a "block" was a misread of non-fatal Vercel warnings).

## The remaining REAL bugs (not fixed — genuine latent defects, non-fatal)

These are discriminated-union misuse in the auth/billing/export BFF — accessing branch-specific properties on a union without narrowing. They compile-error under Vercel's stricter per-function check but do not fail the build. They are REAL (would throw or mis-handle at runtime on the error branch), pre-existing (from the OIDC BFF + export routes landing 2026-07-21, commit 63d6729 and the export sprint), and OUT OF QA SCOPE (auth/payment code, not rendering/quality):

- `api/pe-site-plan-export.ts` — `.status/.error/.message` accessed on `SitePlanExportAuthResult` where the `{ ok: true }` branch lacks them (lines ~52-54, ~153).
- `api/_lib/pe-site-plan-export-core.ts` — `.status/.message` on `{ ok: true; tier } | { ok: false; status; message? }` without narrowing (lines ~281-288).
- `api/pe-terrain-export.ts` — same `.status/.error/.message`-on-union pattern (lines ~47-49, ~132).
- `api/pe-billing.ts` — `.text/.headers` on a `Response`-ish union (lines ~65-66).
- `api/_lib/cortex-exchange.ts` — earlier `Response.ok/.text/.status/.json` (resolved by the DOM lib add in #84; listed for completeness).

## Why non-fatal but worth fixing

Each is a `{ ok: true } | { ok: false; ...detail }` result where the code reads `.status`/`.message`/`.error` without first checking `!result.ok`. TypeScript flags it; at runtime, on the error branch the field may be `undefined` and the honest-error response would carry `undefined` status/message instead of the real one — a correctness bug on the FAILURE path (which is exactly the path that matters for honest error surfacing). Low blast radius (only fires on auth/export failures), which is why it went unnoticed.

## Recommended fix (later, non-QA)

A small hygiene PR: narrow each union with an `if (!result.ok) { ... }` guard before reading error fields, so the failure path carries the real status/message. Add `api/tsconfig.json` to the PE CI typecheck job so these can't silently regress again. Not urgent; not a QA-track item; filed so it is not lost.
