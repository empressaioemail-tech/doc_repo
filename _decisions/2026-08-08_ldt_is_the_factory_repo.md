---
id: 2026-08-08_ldt_is_the_factory_repo
title: legacy-design-tools is the FACTORY REPO — canon corrected to reality
date: 2026-08-08
status: active
owner: nick
related: [_catalog/repo_intents, _decisions/2026-07-04_ldt_decomposition_retirement_path, _inbox/2026-08-08_SURVEY_ldt_decomposition_state, 80_adrs/adr_008_engine_factor_out, _decisions/2026-08-08_layer_first_statewide_fabric_sequence]
---

# legacy-design-tools is the factory repo

Operator ruling 2026-08-08, on the survey at `_inbox/2026-08-08_SURVEY_ldt_decomposition_state.md`.

## What was believed

`_catalog/repo_intents.md` line 32 (last updated 2026-07-04) rules legacy-design-tools "THE biggest entanglement," retiring via decomposition on three clocks: (1) root SPA declared legacy NOW with zero new work, (2) Cortex console extracts to its own repo in Phase 3, (3) cortex-api plus lib packages run in place, shrink by absorption, retire only when empty.

The operator's working understanding was stronger than that: that ldt was out of the picture, broken down when the spine was built.

## What is true

The spine extraction was real and succeeded. `hauska-engine-api`, `hauska-mcp-server` and `hauska-retrieval-api` run in their own GCP project with their own repos, and the atom contract left cleanly (now `@empressaio/atom-contract@1.12.0`).

The second half never happened. ldt was supposed to SHRINK as the spine grew. It grew alongside.

| Measure | Value |
|---|---|
| Commits, last 60 days | 387 |
| File touches in `artifacts/api-server` | 902 |
| Route files | 94 |
| Load-bearing share | roughly 85 percent |
| Dead weight | roughly 10 percent |
| Frozen but still shipping | roughly 5 percent |
| Absorptions complete (adapters, tenancy, Radar BFF) | 0 of 3 |
| Death-list items resolved | 1 of 5 |

The decisive fact: **the county-manifest factory was built in ldt this week.** Migrations 0068 through 0072 added ten tables — `county_manifest`, `county_rail`, `tx_city_boundary`, `tx_county_boundary`, `rail_state_history`, `rail_verification`, `manifest_run`, `manifest_slot_reservation`, `manifest_slot_queue`, `manifest_jurisdiction_cost`. The spine got the contract; ldt got the factory.

## The ruling

**legacy-design-tools is the FACTORY REPO. It is not retiring.** The canon is corrected to reality rather than reality being bent to the canon. Moving the factory now would cost more than it is worth and would land mid-acquisition.

Clock 3 (cortex-api plus lib packages) is renamed and re-scoped: it is the factory and acquisition home, it receives new work by design, and "retire when empty" is withdrawn.

Clocks 1 and 2 stand as retirement paths and are now the ONLY retiring parts of this repo:

- **Clock 1, the root design-tools SPA.** Code is genuinely frozen (zero commits since 2026-07-04) but it is STILL SERVED IN PRODUCTION: the Dockerfile builds four SPAs into the image and the cortex-api root returns `<title>Cortex — Design Accelerator</title>` at HTTP 200 (verified 2026-08-08). Freezing the code did not remove the surface. Removing the served surface is now the actual task.
- **Clock 2, the Cortex console.** VIOLATED: 23 post-decision commits, nine of them feature work, latest 2026-07-18; `cortex-tiles` went 0.1.1 to 0.1.12. The `@hauska` to `@empressaio` rename landed INSIDE ldt rather than in an extracted repo, the opposite of what clock 2 specifies. Either extract it or withdraw the extraction ruling; a clock that is violated for a month is not a plan.

## Unclassified units the canon never anticipated

`cad-ingest` (a NEW acquisition package created in ldt during the retirement window), `plan-review`, `qa`, `mockup-sandbox`, and two Python sidecars. The image serves four SPAs; the canon assumed two. The three-clock model is not wrong, it is STALE, and it has not been updated since 2026-07-04.

## Why this ruling matters beyond ldt

For roughly a month the canon described a repo that no longer existed, and nobody noticed. The master planner dispatched ten tables into a declared-retiring repo on 2026-08-08 without checking the intent doc first. That is a governance failure, not an ldt failure: the canon is only load-bearing if something forces a read before dispatch and something detects divergence after.

Both mechanisms are now required work (see the build-rules lane). The lesson generalizes: **a canon nobody is forced to read, and whose violation nothing detects, decays into fiction at the speed of the work.**

## Consequences

1. `_catalog/repo_intents.md` line 32 is rewritten to this ruling. The `_decisions/2026-07-04_ldt_decomposition_retirement_path.md` record is amended, not deleted.
2. New factory and acquisition work lands in ldt by default. No further apology or exception is needed.
3. The retirement work that IS real gets scheduled: kill the served SPA surface, rule on clock 2, and clear the death list.
4. The six vendored `@hauska/atom-contract` packages migrate to `@empressaio/atom-contract@1.12.0`. The original reason for vendoring is now known and obsolete: commit `0ecb8abb` (2026-05-26) states it verbatim as "Ship hauska-atom-contract-1.2.0.tgz under vendor/ so pnpm frozen-lockfile install works without npm publish." The package is published; the expedient has no remaining justification. All six consumers are clock 3, so the migration serves code that is staying.

## Reversal criteria

Reverse if the factory is deliberately extracted to its own repo as a planned program with its own decision record. Do not reverse by drift.
