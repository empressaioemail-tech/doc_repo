---
id: 2026-06-06_cc-agent-C_hydrology_ingest_flowlines_fix
title: Dispatch (re-dispatch) — fix PR #142 site-drainage ingest flowLineCount=0 (run the DB test)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 40d_cortex_site_context_sprint, _dispatches/2026-06-06_cc-agent-C_hydrology_threshold_fix]
---

# Re-dispatch — fix PR #142 site-drainage ingest flowLineCount=0

You are **cc-agent-C**, single owner of `legacy-design-tools` for this run. Second pass on the same #142 failure; the first threshold fix ([`2026-06-06_cc-agent-C_hydrology_threshold_fix`](2026-06-06_cc-agent-C_hydrology_threshold_fix.md), commit `948649d`) was correct but insufficient.

> **Trail note.** Captures a re-dispatch sent by the operator on 2026-06-06 (paste-through). **OUTCOME: RESOLVED** — see Resolution below.

## Why the first fix didn't work

`948649d` made the river-network threshold grid-relative (`sqrt(cells)*0.5, floor 3, cap 50`) and was verified with a NEW non-DB unit test (`siteDrainageThreshold.test.ts`). But that test never exercised the failing path: the actual failing test `artifacts/api-server/src/__tests__/site-drainage-ingest.test.ts:181` (`happy path — topo then drainage at 4 inches`, `expected 0 to be greater than 0` on `flowLineCount`) is DB-backed (`createTestSchema` needs `DATABASE_URL`) and was never executed on the build workstation. So the engine was fixed in isolation while the integration test stayed red.

## Hard requirement this round

Run `site-drainage-ingest.test.ts` against a real `DATABASE_URL` (local Postgres via docker, or the CI test DB). A passing unit test is NOT acceptance; the only acceptance is the integration test green, with verbatim run output in the report.

## Resolution (commit `96b81bf`)

**Root cause:** the ingest derived the threshold from the wrong grid dimensions. `siteDrainageIngest` called `resolveAccumulationThreshold(topoPayload.dem.widthPx, topoPayload.dem.heightPx)` — the USGS *request* sizes (~112x109 for Round Rock + 500 m buffer @ 10 m → threshold 50). The mocked GeoTIFF in the test is actually 10x10 (max D8 accumulation ~9). Threshold 50 on a grid whose max accumulation is ~9 → zero flow lines. The parity unit test passed only because it called `resolveAccumulationThreshold(10, 10)` directly and never hit the ingest wiring.

**Fix:** in `siteDrainageIngest.ts`, download + `parseDemBytes` first, derive the threshold from `parsed.width`/`parsed.height`, then run the signature/idempotency check and hydrology. Added regression test "uses parsed grid size not USGS request size for threshold."

**Verification (DB-backed):** `site-drainage-ingest.test.ts` 3/3 passing; `siteDrainageThreshold.test.ts`, `hydrologyNative.test.ts`, and `pnpm run typecheck` green. Full CI on #142 green (Test 5m28s, Typecheck, Rubric). PR #142 merged by operator 2026-06-06.

## Reporting

Report filed: [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_hydrology_ingest_flowlines_fix.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_hydrology_ingest_flowlines_fix.md).
