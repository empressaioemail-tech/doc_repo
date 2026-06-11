---
id: 2026-06-11_cc-agent-C_spine_date_rehydrate_briefing_hydro_topo
title: Dispatch — extend spine date-rehydration to briefing (flip-blocker) + proactively hydrology/topography
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — briefing flip blocked on this; findings-on-spine is live and unaffected
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _dispatches/2026-06-11_cc-agent-C_C1_findings_persist_and_jurisdiction_keysynth, _inbox/2026-06-11_legacy-design-tools_cc-agent-C_C1_findings_persist_jurisdiction_fix]
---

# Extend spine date-rehydration to briefing (+ hydrology/topography)

> Findings-on-spine is live in prod (`cortex-api-00157-but` @ 100%, durable). Staging the briefing flip on the canary surfaced the same date-serialization bug `#171` fixed for findings, on the briefing path: the spine returns the briefing with ISO-string timestamps, cortex persists via drizzle which expects `Date`, and the run fails. `#171`'s `rehydrateSpineFindingsResult` was applied only to the findings routes, not `routeGenerateBriefing`. This is systemic to the spine seam: every spine engine response persisted through a drizzle timestamp column has it. Fix briefing now (unblocks the flip) and cover hydrology/topography proactively so the next flips do not each re-hit it.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main` (carries `#171`/`#172`/`#173`/`#174`). Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 verbatim artifacts.

## Verbatim error (live canary `cortex-api-00159-tuq`, briefing flip)

```
14:28:08  POST /v1/briefing/generate  200        (engine-api — spine briefing succeeded)
14:28:08  briefing generation: engine call starting
14:28:43  briefing generation: failed
  ERR: value.toISOString is not a function
  at PgTimestamp.mapToDriverValue (drizzle-orm/.../pg-core/columns/timestamp.ts:68:16)
  at _SQL.buildQueryFromSourceParams (.../sql/sql.ts:163)
```

## Root cause

Same class as `#171`. `routeGenerateBriefing` (`artifacts/api-server/src/lib/engineSpineRouting.ts`) returns the engine-api JSON briefing response without rehydrating its `Date` fields, so the persist in `routes/parcelBriefings.ts` hands a string to a drizzle `timestamp` column whose `mapToDriverValue` calls `.toISOString()`. `#171` added `rehydrateSpineFindingsResult` in `engineSpineDeserialize.ts` and wired it into the findings routes only.

## Fix

1. **Briefing (the flip-blocker).** Add a `rehydrateSpineBriefingResult` (mirror `rehydrateSpineFindingsResult` in `engineSpineDeserialize.ts`) that coerces every `Date`-typed field on the spine briefing response (sweep the briefing result + nested `sources[]` for any timestamp: `generatedAt`/`createdAt`/`evaluatedAt`/`retrievedAt`/etc.) from ISO string to `Date`, and wire it into `routeGenerateBriefing` before the result reaches the briefing persist. Reuse the existing `toDate()` helper.
2. **Hydrology + topography (proactive, same seam).** `routeRunHydrologyWorker`, `routeResolveRainfallForcing`, and `routeFetchUsgs3depDem` (the hydrology/topography spine routes) return engine-api JSON that will persist through drizzle timestamp columns on their flips. Audit each spine-route response shape and apply the same date coercion so `ENGINE_SPINE_HYDROLOGY`/`ENGINE_SPINE_TOPOGRAPHY` do not re-hit this on flip. If a route's response has no Date-typed persisted field, note that explicitly (no-op is fine, but verify).
3. Consider a single boundary helper (`rehydrateSpineDates`) the routing layer applies to every `/v1/*` response generically, so future spine engines inherit it. Optional but preferred (matches the audit's "end-to-end spine-response validation" gap).

## Acceptance

- Re-run a briefing on the canary (engagement with a real address, e.g. `613 Sturgeon_A` `6d9cd127-...`): briefing **persists** (no `briefing generation: failed`, no `toISOString`), `POST /v1/briefing/generate 200`, lineage/citations intact. Paste verbatim log.
- Hydrology + topography spine routes audited; date-typed persisted fields coerced (or verified absent). State which fields each route carries.
- Unit test for the briefing rehydration (string→Date, Date pass-through), mirroring `#171`'s `engineSpineDeserialize.test.ts`.
- Typecheck + tests green; PR held for operator merge; HR-8 artifacts.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_spine_date_rehydrate_briefing_fix.md`: fix locations (file:line), the per-route hydro/topo audit result, unit-test output, the post-deploy canary briefing 200 verbatim, PR URL + SHA, blockers.

## Post-merge (planner/operator)

Merge → the workflow build runs → `deploy-canary` (now carries findings flags baked; briefing flag still staged manually on the canary for verify) → re-run the briefing verify → shift → append `ENGINE_SPINE_BRIEFING` to `cloud-run-deploy.yml` (the convention `#174` left a comment for). Then hydrology (verify engine-api runs pysheds, not its native fallback), then topography, then C3.
