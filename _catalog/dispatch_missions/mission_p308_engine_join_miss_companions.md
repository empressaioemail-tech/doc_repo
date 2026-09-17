## Mission — P-308: the engine's join-miss path stamps its two companion rails

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not merge,
deploy, re-vendor the factory, or write any store.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p308-join-miss-companions`. Declare the start commit (engine main `7b3dda0b` at compile).
Register the clone under the property seat and remove the entry at close. The P-299/P-282 lane is
open in this repo (`packages/adapters/src/local/setbacks/`, `services/retrieval-api/`); stay out of
those paths.

### The finding (P-266/P-268 close, `_inbox/2026-09-17_p266-p268-factory-open-rails_close.json`)

- `packages/engine-core/src/parcel-record/ingest-existing.ts` has two write paths. For a matched CAD
  row with a null or blank scalar, the matched branch stamps the scalar's companion absent-verified
  beside it (`acreageMethod` beside `acreageAcres`, `landUseSource` beside `landUseCode`; since the
  `dfdf6fd` change). For a node with no CAD row at all, `applyCadJoinMiss` stamps the 13 CAD scalars
  and touches neither companion, so both stay `unaccounted` forever.
- hauska-factory vendors this engine (`src/lib/parcel-record-engine`, `ENGINE_PIN.json`, no hand
  edits) and closed the six counties job-side with `completeJoinMissCompanionsOntoRecords`
  (factory `1fa850e7`). Its predicate is the engine's own signal: a primary absent-verified whose
  basis has `source: "cad_property"`, a `propId`, a `vintage` and NO `taxYear`.
- Measured cohort: Hays, `acreageMethod` 433 and `landUseSource` 636.

### What to build

1. In `applyCadJoinMiss`, stamp `acreageMethod` and `landUseSource` absent-verified with the
   join-miss basis, beside the primaries it already stamps, with the same reasoning the matched
   branch states ("a verified-absent source field has a verified-absent provenance too"). Never a
   value, never a refusal, and never touch a companion that is already earned.
2. A test that fails on the old shape (a join-miss record leaves either companion `unaccounted`).
3. A parity test: one fixture set run through the engine's join-miss path and through the factory's
   job-level step (copy the factory function's logic into the test as a fixture of expected output,
   with the factory commit named) must agree cell for cell. If P-282's shared harness exists on
   main when you start, use it.
4. In the close, write the follow-on for the integration seat: re-vendor the factory at the new
   engine commit, then retire `completeJoinMissCompanionsOntoRecords` in the same change, since a
   copied default outlives its own removal (ENFORCEMENT: enumerate call sites).

### Falsifiers — pre-register your predictions before building

1. A join-miss fixture yields both companions absent-verified with a basis that has no `taxYear`.
2. A matched-row fixture is unchanged (its companions keep the matched basis, with `taxYear`).
3. A companion already `value` or `absent-verified` is never rewritten.
4. Reverting the fix fails test 2 of "What to build".

### Do not

- Merge, deploy, write any store, or edit hauska-factory.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the falsifiers
with evidence; the factory follow-on written as commands. `status`: `closed-partial` until the
factory re-vendors and its job-level step is retired. `probe`: `{"notApplicable": "engine build
lane; graded by the factory re-vendor's dry run"}`. `subAgents`. `leave_behind`.
