## Mission — P-205 follow-on: an ambiguous ZIP resolves with its city, and a unanimous answer is given

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not
deploy; the integration seat deploys retrieval-api.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p205b-coverage-ambiguous-locality`. Declare the start commit (engine main was `d88cf65` at
compile). Register it under the property seat and remove the entry at close. You touch
`services/retrieval-api/src/coverage-check.ts` and its tests only. Two other lanes may be open in
`services/retrieval-api/` (the P-293 remainder in `parcel-record-db.ts`, and P-295's measurement
instrument); stay out of their files.

### The finding (A-188, measured live 2026-09-16 on `hauska-retrieval-api-00092-lag`)

The P-210 coverage check resolves a locality to one county with `chooseDominantCounty`
(`coverage-check.ts:95`, `DOMINANCE_SHARE = 0.9`). When a ZIP is given, `resolveLocality`
(around line 206) groups `txgio_parcel` by ZIP ONLY and ignores the city. Marble Falls 78654
(Burnet) splits 48053 (11,391 rows, 86 percent) and 48453 (1,850 rows, 14 percent), so the
answer is `indeterminate` and LDT's `find_parcel` (P-205, LDT PR #690, live on `cortex-api`)
returns `coverage_check_unavailable` rather than naming Burnet. Burnet is the Phase 1 county, so
every Burnet address in a split ZIP hits this.

### The ruling you build (integration seat, 2026-09-16, within the handoff's delegation)

1. **Narrow before giving up.** When the ZIP alone is ambiguous and a city is given, resolve on
   ZIP AND city together (both predicates in one query) and apply the same 90 percent rule. When
   only one of the two is given, behaviour is unchanged.
2. **A unanimous answer needs no winner.** When the locality is still ambiguous, look up the
   coverage status of every candidate county. If all are covered, answer `covered`. If none are,
   answer `not-covered` naming the plurality county, and carry the full candidate list with
   counts on the body. If they disagree, answer `indeterminate`, and carry the candidate list
   with each county's coverage status on the body.
3. **The 90 percent rule itself does not change.** Widening it is a ruling.

The rule for a covered county is the one P-210 already uses (the serving path, a Tier-1 bake row
under `TIER1_ADAPTER_KEY`); do not change it.

### Cost you must respect

`txgio_parcel` has no index on `situs_zip` or `situs_city` (module header; a cold GROUP BY takes
2 to 3 minutes). The ZIP-and-city query is at most as expensive as the ZIP-only one, since both
filters apply in one scan. Do not add a second full scan per request. Keep the existing locality
cache and give the combined key its own cache entry. If you measure live, take the heavy-scan
lease if P-281 has landed, run read-only with `statement_timeout`, and measure 78654 with and
without `MARBLE FALLS`; report both splits.

### Falsifiers, pre-register your answers first

1. 78654 plus city `Marble Falls` resolves to 48053 when the combined split clears 90 percent (a
   fixture with the measured counts, and the live split if you measured it).
2. A split ZIP whose candidate counties are all covered answers `covered`; all uncovered answers
   `not-covered` with the candidate list; mixed answers `indeterminate` with the list.
3. Bell 76541 (6,897 in 48027 against 3 in 48319) still resolves to 48027 with no city given.
4. An out-of-state locality still answers without a database call.

### Do not

- Change `DOMINANCE_SHARE`, the covered definition, or the LDT side.
- Add an index (that is LDT's drizzle schema, out of scope; report it as a follow-on).
- Deploy, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the four
falsifiers with evidence; the live splits if measured, with SQL and snapshot time. `status`:
`closed-partial` until deployed and a Marble Falls address reads a named county on the live
`find_parcel`. `probe`: `{"notApplicable": "build lane, PR not deployed; graded on the live
coverage endpoint and find_parcel after deploy"}`. `subAgents`. `leave_behind`.
