## Mission — P-299 (engine half) and P-282 (slate): the engine reads corpus 1.4.0 and LDT's current slate

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not
merge or deploy; the integration seat deploys hauska-retrieval-api and hauska-engine-api after merge.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p299-engine-corpus-and-slate`. Declare the start commit (engine main `7b3dda0b` at compile).
Register the clone under the property seat and remove the entry at close.

### Part 1: corpus 1.4.0 (P-299's engine half; A-202 left it open)

- `packages/adapters/package.json` pins `@empressaio/setback-corpus` `^1.2.0`, and the lockfile
  resolves `1.2.0`. The factory pins exact `1.4.0` (P-256b, factory `c5622d0b`) and LDT ships
  1.4.0's tables (P-299, LDT `710d5bb7`).
- `packages/adapters/src/local/setbacks/*.json` are 14 vendored tables, guarded by
  `__tests__/corpus-divergence.test.ts`. P-299 measured the engine's verdict against 1.4.0
  (`_inbox/2026-09-17_p299-height-flag-and-state_consumers-engine.txt`, UTF-16): 23 numeric
  mismatches, all `max_height_ft` (san-antonio-tx 17, bastrop-city-tx 6), and 98
  verification-state changes (`primary-source-verified` to `transcription-read`) that the test's
  rank map cannot see.
- **Build:** move the pin to exact `1.4.0` in `package.json` and the lockfile together; correct the
  vendored tables to 1.4.0; teach the divergence test's rank map the `transcription-read` state
  (P-299's fourth state, with its lower confidence cap) so a state change is visible, not silently
  passing; and make sure the engine never serves a flagged height as a number (the same rule LDT's
  `buildableEnvelope/derive.ts` and `/local-setbacks` now follow). Update
  `services/retrieval-api/src/__fixtures__/cell-serve-rule.json` where it cites `@1.3.0` sources, or
  say why it must not change.
- Pin, lockfile and vendored tables are one fact in several places (P-256b's lesson). Move them in
  one commit, and say which pair is guarded at runtime and which only by a test.

### Part 2: the reader slate (P-282 scope; A-204 finding)

- `services/retrieval-api/src/parcel-record-slate.json` is a vendored copy of LDT's
  `artifacts/api-server/src/lib/parcelRecordAllowlist.ts` `PARCEL_RECORD_SLATE`, vendored 2026-09-13
  (152 pairs). LDT has since lifted P-177's hold on six Hays record-overlay rails, and this copy
  lacks them. `parcel-record-slate.test.ts` is supposed to guard drift.
- **Build:** re-vendor the slate from LDT main (read it at a named commit, and record that commit as
  `sourceCommit`; LDT main is `8e7218f7` at compile) as data, never retyped. List every pair added
  or removed with the reason from LDT's own history, and confirm each added pair's
  `parcel_gate_verdict` reads `pass` today (read-only). Then show why the existing divergence test
  did not fail on the stale copy, and make it fail on a stale copy (for example, compare against
  LDT's file at the recorded commit in CI, or a checked-in digest that a resync must update in both
  repos). If a real cross-repo check is not buildable here, say so and name what is.

### Falsifiers — pre-register your predictions before building

1. With the pin at 1.4.0 and the tables uncorrected, the divergence test fails on the 23 heights;
   with them corrected, it passes; and a table left at a `primary-source-verified` state the corpus
   now calls `transcription-read` fails the test.
2. A flagged height never reaches an engine output as a number (test through the engine's own
   consumer).
3. The re-vendored slate equals LDT's at the recorded commit, and the drift test fails on the
   pre-resync copy.
4. A slated Hays record-overlay rail is served from its cell by the retrieval reader in a test.

### Do not

- Merge, deploy, or write any store.
- Edit LDT or the corpus repo; a corpus defect goes in the close.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the table and
height corrections by jurisdiction; the slate delta with reasons and live verdicts; the falsifiers
with evidence. `status`: `closed-partial` until the integration seat deploys retrieval-api and
engine-api and a Hays record-overlay rail and a Round Rock height are graded live. `probe`:
`{"notApplicable": "build lane; graded on the deployed reader and export"}`. `subAgents`.
`leave_behind`.
