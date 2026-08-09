---
id: T2_polish_product_track
title: T2 — Polish + product track (catch-up program)
status: amended-reopen-2026-08-06
owner: nick
related: [CATCHUP_program_2026-08-05, HEALTH_CHECK_2026-08-05_verdict, REBRAND_UI_citations_and_pdf, 76j_smartsite_launch_readiness_program]
---

# T2 — Polish + product surfaces

Mission: every visual/product polish item done in parallel with the data work. No heavy DB use; no atoms data-runs.

## Workstreams

1. CAD/DXF EXPORT TEXT REGRESSION (operator report: jumbled text on 109 Higgins DXF where a prior test was clean). Triage FIRST and cheaply: diff what deployed to the export path between the two tests (engine-api revisions and any font/encoding change in the DXF writer); name the regressing change, then fix. Regression test: golden-file or text-extraction check on the DXF output so this cannot silently recur. Note engine-api serves revision 00163-mew (the #255 deploy) — establish whether the regression predates it.
2. PEDESTRIAN-PATH MAP STYLE: too faint; change to a shade of blue, brighter, DOTS not dashes (hauska-map style layer). Operator screenshot reference in queue row.
3. REBRAND SET: favicon to Smart Site crosshairs, title, landing, copy (deferred set from the 2026-08-03 rebrand deploy).
4. PDF SMART SITE BRANDING: Smart Site mark on the site-plan/brief PDF templates per REBRAND_UI_citations_and_pdf.md surface map.
5. PAYWALL E2E SUPPORT: when the operator runs the four E2E actions (unlock price secret, dev-role grant, promo E2E, claim smoke), fix anything that fails same-pass; re-grade the paywall WDLL items 1-3, 8.
6. PRODUCT-SURFACE SMOKE SUITE (recalibration item 4, pulled in): a small, runnable check-set over the live product — card vs sheet setback consistency on N random certified parcels, envelope-render sanity, export text integrity (rides workstream 1's regression test), chat citation-chip relevance spot checks, /search probes. The goal: operator screenshots stop being the first detector. Wire it as a repeatable script + runbook entry, not a one-time pass.
7. DOMAIN ATTACH: when the operator purchases the Smart Site domain, attach as Vercel custom domain + verify; until then this item stays parked.

## Discipline

hauska-map deploys are CLI (link --project first; judge by live alias + bundle marker, never CLI exit codes). engine-api deploys: SHA-pinned image, no-traffic tag, smoke, shift, verify the SERVING revision. ldt traps: esbuild conditions stay ["workspace"]; CI authoritative over local tests.

## Acceptance (master planner verifies live)

DXF export clean on 109 Higgins with the regressing change named; path style visibly per spec on prod; favicon/title/landing/copy live; PDF carries the Smart Site mark on a real export; regression tests added where a class could recur; queue rows flipped.
