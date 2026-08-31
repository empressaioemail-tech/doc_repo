---
title: P5-SCRUB Wave 2 handback
date: 2026-08-31
status: active
owner: property (implementer); integration supervising
plan_row: F-08
---

# P5-SCRUB handback (F-08)

Write and test only. No commit, no push, no PR, no deploy, no production scrub, no bake, no publish, no migration.

## Snapshot

- Seat: property worktree, supervised by integration on `P:/doc_repo`
- Repo: hauska-factory
- Worktree: `P:/seat-worktrees/property/hauska-factory-p5-scrub`
- Branch: `seat/property-ctx-p5-scrub`
- HEAD: `3a0dc9a351624bccee50f48ca24effa286116bb3` (origin/main; Factory #43). Unchanged; implementer did not commit.
- Dirty files:
  - `src/stages/grade/v-rules.mjs` (modified)
  - `src/stages/grade/s-rules.mjs` (new)
  - `src/jobs/verify-walk.mjs` (modified)
  - `src/jobs/conformant.mjs` (modified)
  - `test/p5-scrub.test.mjs` (new)
  - `test/reconcile-promote-write.test.mjs` (modified)

Forbidden trees were not opened.

## Family zero — meaningShaped is caller-declared

`gradeRule` took `meaningShaped` as a caller argument and PASSed when `evidence.pass === true && (meaningShaped || MEANING.has(ruleId))`.

Enumerated call sites (every one):

1. `src/jobs/conformant.mjs` — `gradeCounty({ V1, V3, V7, V11, V14 })` passed `meaningShaped: true` as a literal next to `evidence.pass: true`.
2. `test/reconcile-promote-write.test.mjs` — same literal on V7 (the test that asserted PASS).
3. `src/jobs/f10-cad-loop.mjs` — `gradeCounty({})` with empty evidence (UNMEASURED path; no literal).
4. `src/stages/grade/v-rules.mjs` `gradeCounty` — forwards `evidenceByRule[id]` into `gradeRule`.

No call site derived `meaningShaped` from a second independently sourced input. `MEANING.has(ruleId)` is a static set in the same module. It is not a second derivation. One party acting alone satisfied both sides. That is internal consistency wearing a meaning-shaped label.

Fix (first family, written before S1): `gradeRule` ignores `meaningShaped` and `MEANING` for PASS. PASS requires two named observations from different sources; this function compares their values. A caller literal `{ evidence: { pass: true }, meaningShaped: true }` is UNMEASURED. Confirmed by running that input and seeing UNMEASURED, not PASS.

`conformant.mjs` no longer passes the lying literal. Those V-grades are honestly UNMEASURED until each V-rule grows two named observations.

## Files changed (paths only)

- `src/stages/grade/v-rules.mjs`
- `src/stages/grade/s-rules.mjs`
- `src/jobs/verify-walk.mjs`
- `src/jobs/conformant.mjs`
- `test/p5-scrub.test.mjs`
- `test/reconcile-promote-write.test.mjs`

No standalone scrub script.

## Tests run

Counting rule: `node --test` counts each `test()` as one test. cwd `P:/seat-worktrees/property/hauska-factory-p5-scrub`.

| command | pass | fail |
|---|---|---|
| `node --test test/p5-scrub.test.mjs` | 50 | 0 |
| `node --test test/p5-scrub.test.mjs test/publish.test.mjs test/p1-controls.test.mjs test/reconcile-promote-write.test.mjs` | 146 | 0 |

Poison fixtures `BROKEN_PARCEL` / `__broken__` were not deleted or renamed. Existing walk tests still pass.

## Per-family both-direction evidence

Falsifier stated in the test name before the assertion. Every poison was run and FAILed. Every known-good was run and PASSed.

| Family | Poison FAIL | Known-good PASS |
|---|---|---|
| family zero | `family-zero FALSIFIER: {evidence:{pass:true}, meaningShaped:true} with no second source must not PASS` (UNMEASURED, not PASS); `family-zero FALSIFIER: MEANING.has(ruleId) is not a second derivation and must not PASS` | `family-zero: two named sources that agree PASS; same source is UNMEASURED; disagree FAIL` |
| S1 | `S1 FALSIFIER poison: non-null coverage with a sentinel situs FAILs`; also `S1 origin point 0,0 against a real point coverage FAILs`; walk `walk default-on: a sentinel situs against real landing coverage fails the walk grade` | `S1 known-good: real situs vs real landing coverage PASSes` |
| S2 | `S2 FALSIFIER poison: a null leaf with no full provenance record FAILs` | `S2 known-good: null leaf accounted by a full record from another source PASSes` |
| S2b | `S2b FALSIFIER poison: asOf copied from bakedAt FAILs` | `S2b known-good: evaluation-time asOf differs from bake clock PASSes` |
| S3 | `S3 FALSIFIER poison: three sources disagree on landUse (PDD vs A1) FAILs` | `S3 known-good: cad, atom, and served agree PASSes` |
| S4 | `S4 FALSIFIER poison: point outside its own ring FAILs`; also join-label mismatch | `S4 known-good: point inside its ring and join label names that ring PASSes` |
| S5 | `S5 FALSIFIER poison: roster GATE_BLOCKED but served body names a different refusal FAILs`; also no-row omit | `S5 known-good: roster and served body name the same refusal PASSes` |
| S6 | `S6 FALSIFIER poison: PE disagrees with facets FAILs (area-ordered readers, not a sample)` | `S6 known-good: four readers agree PASSes` |
| S7 | `S7 FALSIFIER poison: ledger cell disagrees with live probe FAILs` | `S7 known-good: ledger cell matches live probe PASSes` |
| S8 | `S8 FALSIFIER poison: value present, citation store empty FAILs` | `S8 known-good: value bound to a citation PASSes` |
| S9 | `S9 FALSIFIER poison: 500000 acres is outside the acres range FAILs`; also undeclared unit | `S9 known-good: 0.263 acres is inside the acres range PASSes` |
| S10 | `S10 FALSIFIER poison: five-digit fips:prop key absent from the registry FAILs` | `S10 known-good: seven-digit id present in the registry PASSes` |
| S11 | `S11 FALSIFIER poison: same schema version, different shape FAILs` | `S11 known-good: two counties share version and path set PASSes` |
| S12 | `S12 FALSIFIER poison: two adapter geometries for the same Bastrop parcel disagree FAILs` | `S12 known-good: two adapters emit the same geometry PASSes` |
| S13 | `S13 FALSIFIER poison: placeholder provenance FAILs`; `S13 FALSIFIER poison: derived envelope without an input rule FAILs` | `S13 known-good: allowlisted provenance PASSes`; `S13 known-good: derived envelope names the rule atom PASSes` |
| wiring | `wiring FALSIFIER: a walk grade object missing S1..S13 fails` | walk `sGrades` keys equal `S_RULE_IDS` |

Wiring: `verify-walk` imports `gradeAllSFamilies` and runs it on every parcel, default on, not flag-gated. A walk that already failed a BP-* grade keeps that grade and still attaches `sGrades`. An S-FAIL flips a passing parcel to `verdict: fail` with `grade: S1..S13`.

Default-on seconds the walk can reach today: landing situs for S1; unit-range registry for S9; provenance allowlist for S13. Families without a second source on that parcel return UNMEASURED. They are invoked. They are not skipped.

S2b is asOf vs bakedAt (evaluation time vs bake time), not a restatement of `classifyRequiredLeaf` (that checks asOf vs requestClock). Comparable projection is `{ distinct }` because `gradeRule` PASSes on value equality and identical clocks are the defect.

## What was violated on purpose

- Family-zero input `{ evidence: { pass: true }, meaningShaped: true }` (must not PASS).
- Every S-family poison fixture (must FAIL).
- Walk gold body with `", TX 78660"` against real landing coverage (must fail the walk on S1).
- Existing V7 PASS assertion was replaced: source authority is the dispatch (literal cannot PASS), not prior output.

## leave_behind

```
leave_behind:
  - item: live S6/S7 extra-reader fetchers (get_smart_site, PE, MCP) are not attached to the walk; attaching them is an HTTP area sweep, never a random sample. The grade functions are invoked; without extras they are UNMEASURED.
    owner: P4 / next verify card
    plan_row: F-08
  - item: live S4 ST_Contains needs a Factory geometry table. landing_txgio_parcel still has only its primary key (existing walk comment). SQL is exported as S4_ST_CONTAINS_SQL.
    owner: P4 / Factory geometry follow-up
    plan_row: F-08
  - item: conformant V1/V3/V7/V11/V14 grades are now honestly UNMEASURED until each supplies two named observations.
    owner: writer lane
    plan_row: F-08
```

## Fleet memory

LESSON — `meaningShaped: true` next to `evidence.pass: true` is one party acting alone. PASS has to compare two named observations from different sources. A static `MEANING` set is not a second derivation.

LESSON — S2b cannot feed raw clocks into `gradeRule`. That function PASSes on equality, and equal clocks are the S2b defect. The comparable projection is `{ distinct: true }` vs `{ distinct: asOf !== bakedAt }`.

DEAD-END — treating S1 as "served kind must equal coverage kind" including real-vs-absent failed the Travis walk on `48453:610002` (two-tax-year earlier row was `", ,"`). S1 applies only when coverage claims real/non-null. A two-tax-year map must prefer the parseable situs, same rule as `selectSweepParcels`.

GROUND-TRUTH 2026-08-31T14:49Z — `node --test test/p5-scrub.test.mjs` at HEAD `3a0dc9a` plus dirty tree: 50 pass, 0 fail. Walk poison fixtures `48021:__broken__` still present.

OPEN — live S6/S7 readers and live S4 geometry table are not on this card (no production probe). Poison fixtures stay for P4.

## Mission close fields

- missionPremise: P5 is the largest untouched CTX block and it is code. It can only RUN after P4 but can be WRITTEN now. A standalone scrub script would be a fifth dormant mechanism. Families extend `src/stages/grade/v-rules.mjs` and `src/jobs/verify-walk.mjs`. A-021 already gates production on a passed walk.
- completionPredicate: meaningShaped derivation answered from enumerated call sites. If caller-declared, that is family zero and is fixed so one party cannot satisfy both evidence.pass and meaningShaped. Fourteen S-families exist as extensions of the grade set / walk, each with a second independently derived input. Every family fails a poison fixture and passes a known-good fixture. Poison fixtures kept. No standalone scrub script. No production scrub, bake, or publish. Diff in the registered worktree. Planner commits.
- completionPredicateStatus: met
- scopeBasis: hauska-factory this worktree only. Write and test. Did not run a production scrub. Did not open another Factory tree. HTTP families area-sweep, never random.
