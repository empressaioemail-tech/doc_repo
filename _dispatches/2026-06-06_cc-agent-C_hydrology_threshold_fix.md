---
id: 2026-06-06_cc-agent-C_hydrology_threshold_fix
title: Dispatch — fix PR #142 site-drainage ingest threshold (grid-relative accumulation)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 40d_cortex_site_context_sprint]
---

# Fix PR #142 site-drainage ingest threshold (grid-relative accumulation)

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

> **Trail note.** This record captures a dispatch already sent to cc-agent-C by the operator on 2026-06-06 (paste-through, not filed-then-sent). Recorded here for the dispatch trail. PR #142 is the hydrology engine (40d 2D.2 + 2D.3); this is the single remaining CI failure on it.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation.

## Atoms to resolve

- `current-state:portfolio` — fleet status, blockers
- `site-drainage:<engagementId>` — the tenant-private atom under test; composes `site-topography` + `engagement`
- `site-context:cortex` — drainage/topography ingest surface

Cortex MCP was erroring at the last dispatch start; if atom resolve fails again, fall back to repo recon and note it verbatim.

## Failing test

`artifacts/api-server/src/__tests__/site-drainage-ingest.test.ts:181` — `site-drainage ingest worker > happy path — topo then drainage at 4 inches`, `AssertionError: expected 0 to be greater than 0` on `drainage.flowLineCount`. Everything else on #142 is green (typecheck, eval, all design-tools suites, 1259/1261 of the Test job).

## Root cause (verified)

The drainage ingest runs hydrology with a fixed accumulation threshold. Ingest default `DEFAULT_ACCUMULATION_THRESHOLD` is used at `siteDrainageIngest.ts:184`; engine default is 50 (`lib/site-context/src/server/hydrologyNative.ts:316`). The test's mocked DEM (`site-drainage-ingest.test.ts:21-27`) is a 10x10 planar ramp depending only on column, so under D8 every cell drains due-west and max achievable flow accumulation is 10. 10 < 50, so `flowLineCount` is structurally always 0. The passing unit test only works because it overrides `accumulationThreshold: 2` (`hydrologyNative.test.ts:27`). Never caught because the DB-backed ingest test needs `DATABASE_URL`, unset on the build workstation.

## Scope

**In scope:** make the accumulation threshold **grid-relative to the catchment DEM size** instead of a fixed constant, at the single locus where `accThreshold` is derived in `siteDrainageIngest.ts` (~line 184), so it flows to both the native engine and the Python worker (`run.py:113` reads the same `accumulationThreshold` field — verify parity). Suggested shape: derive from cell count (small fraction of `width*height`) with a sane floor and an upper bound that preserves today's behavior on large real DEMs. You own the catchment-sizing intent; pick the formula you can defend for tight urban parcels. If the synthetic test DEM is too small to ever form a channel even at a sensible grid-relative threshold, you may also adjust the fixture to a convergent DEM, but the engine threshold change is the primary fix.

**Out of scope:** weakening the `flowLineCount > 0` assertion; globally dropping the engine's 50 default to a tiny number (adds noise on real high-res DEMs); any non-hydrology change.

## Acceptance criteria

- `site-drainage-ingest.test.ts` happy path passes with the threshold fix; assertion unchanged.
- `lib/site-context` `hydrologyNative.test.ts` still green; large-DEM behavior effectively unchanged.
- Native-TS and Python-sidecar paths in parity on the threshold.
- Verify by running the api-server DB suite with `DATABASE_URL` set (so the test actually executes); `pnpm run typecheck` clean.
- Commit + push to `cortex/hydrology-engine` to update PR #142. PR held for operator merge.
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_hydrology_threshold_fix.md`: atom refs touched, model used if not default, PR/branch SHA, blockers verbatim, and the DB-suite run output for the formerly-failing test.
