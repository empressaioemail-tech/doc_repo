---
id: 2026-07-15_post_swap_data_completeness_and_console_hardening_claude_code
title: Session — post-Cotality-swap wave: command-center hardening, data-completeness lanes, report-engine fixes
date: 2026-07-15
kind: session-summary
agent: claude_code_planner
related: [_decisions/2026-07-13_cotality_swap_public_record_migration, 55_spine_data_intelligence_stack, 2026-07-15_ossf_septic_records_access_survey]
---

# Session: post-swap wave — console lit up, data completeness, engine hardening

Follows the 2026-07-13/14 Cotality swap (public-record migration executed to prod). This session took the command center from "data plane live but console shows fixtures" to a live, honest, composable operator surface, then ran a data-completeness + engine-hardening wave, then the prod data jobs that light it all up.

## Command center (hauska-map, Vercel cmdcenter)
Sequential PRs, each gated on `pnpm --filter ./apps/command-center build` (two prod-only build gaps surfaced and fixed at root: gitignored `@hauska/map-renderer` dist entry, undeclared root `@types/node`, header `string[]` normalization in the proxy):
- #20 remote-spine proxy (MCP/retrieval server-held keys) + env (MCP_ADMIN_KEY, RETRIEVAL_API_KEY on Vercel).
- #21 proxy allowlist for the map-data POST paths (map tile was 403ing live GIS).
- #22/#23 **live map tile**: viewport parcel/FEMA fetch, click→info card (situs/apn/owner/land-use), Run-brief + Site-analysis deep-links; fixtures default-off, watermarked when on.
- #24 panel fixes: atoms entity-type enum + jurisdiction normalization, parcel-trace resolve rewired to geocode+place-atoms.
- #25 **edit-layout**: per-tile expand/minimize/remove/resize/drag, add-tile picker, named layouts persisted + URL-deep-linked.
- #26 report overlays render on the live map (apply-drop + key-collision fix).
- #27 **component library picker**: 47 report-registry capabilities + 20 published tile components, parameterized tiles persisted.

## Site-analysis report engines (cortex #248/#249 + engine #94)
Root-caused and fixed: report-run "silent drop" (discarded typed failures answering 202) → honest 4xx/5xx + recorded failures; drainage envelope-unwrap gap; **pysheds baked into the engine image** (numba JIT cache warmed at build → 45s+ → 2.6s/worker, real flow lines); SSURGO three stacked bugs (SDA column names, header-row parse, allSettled host decoupling) → real soil data live; #249 durable watchdog (stale-expiry works under CPU throttle). #258 hardened malformed-engagement-id 500→404 + killed an orphan running-row (the "500" alarm was a truncated test id of mine; prod was already correct).

## Data-completeness + engine wave (9 PRs)
- Engine SSURGO port #95 (mirror the cortex fix into the engine fork) — deployed, verified (Heiden clay at San Marcos).
- Land-use chain #251 (CAD join) + #255 (Orion record-3 land-file → property_use_code) + #256 (PTAD code→description; **codes alone never color** — the extension buckets on description keywords). Verified live post-ingest: 161/200 Hays parcels colored.
- Setback acceptance-gate #252 (the ratifiable artifact) + San Marcos served honest-empty; **corpus-first reframe**: San Marcos has zero code atoms, so setback fan-out is blocked on code onboarding, not extraction.
- Durable run-state store #253 (report_run table, cross-instance correct).
- Permits #254 (address-match model — SA has no parcel column, Austin's id ≠ GIS id, so parcel-join was refused; matched on normalized street with disclosed caveat). A parallel store-only PR #257 was closed in its favor.
- Warming run-state API #259 (Runs panel now shows real report_run history + honestly labels the warming harness `not-scheduled` — no harness runs on a schedule).
- Septic/OSSF survey filed (Comal Tier-1 PoC; georef is the load-bearing risk).

## Prod data jobs (planner-run)
- Hays re-ingest with the record-3 land file: 131,246 rows, `property_use_code` backfilled → **map colors verified live**.
- Permits ingest into prod Neon: SA current 118,948, SA 2020-24 + Austin 2.36M (see permit_record). CLI gotcha: `pnpm --filter ... permits-ingest -- --flag` injects an extra `--` that this CLI rejects as positional; use `pnpm exec tsx src/permits/cli.ts --flag` from the package dir.

## Process notes (honest)
Two dispatch double-spawns (land-use, permits) from an early truncated-prompt seeding shadow agents — real token waste, but the review gate converted both into correctness upgrades (codes-never-color, parcel-join-false). One "prod bug" was my own truncated test id. Adversarial review (planner-side, never delegated) caught all of it including my errors. Recon/survey agents moved to cheaper models mid-wave per operator cost guidance.

## Deploy handles
cortex-api `00329-xun` @100% (rollback 00327→00325); hauska-engine-api `00024-rd6` @100% (rollback 00023-2qp); cmdcenter latest Vercel prod. Migrations on main through 0055_permit_record.

## Open (handed off)
Engine auth-gate enforce: **NO-GO as a naive flip** — survey found cortex + MCP both 401 unless pre-positioned with the token (secret HAUSKA_ENGINE_API_KEY, callers read ENGINE_API_GATE_TOKEN). Sequenced procedure in the handoff. Plus: San Marcos code onboarding (setback blocker), Bexar CAD PIR, WCAD tax-year, Comal septic PoC, MLS/RentCast phase, Cotality MCP federation (UAT creds live but 0 SKUs provisioned — vendor owes).
