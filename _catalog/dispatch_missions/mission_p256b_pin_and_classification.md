## Mission — P-256 integration: PR #160 on current main, the corpus pin at 1.4.0, and a classification table that matches it

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` on PR #160's own branch and
update that PR. You do not run any writer with `--apply`, deploy, or write any store; the
integration seat dry-runs each county and applies within the operator's ceilings after merge.

### Where you work

`hauska-factory`, fresh clone under `P:/tmp/` into a NEW directory, PR #160's branch (head
`1ca92ac3`, base `afdda428` at compile, so it is many commits behind). Factory main was `b65f61b`
at compile. First merge `origin/main` into the branch and resolve conflicts: P-281, P-284 and
P-298 all touched files near `src/jobs/parcel-setback-cells.mjs`. Register the clone under the
property seat and remove the entry at close. Other lanes open in this repo: P-266/P-268 (rail
writers other than setback and envelope), P-276 (`secret-rotation.mjs`, `staging-reset.mjs`).
Stay out of their files.

### Why this lane exists (operator ruling A-204, 2026-09-17)

- A-199 authorised P-256's apply on conditions: P-297 live (true since 2026-09-17 12:33Z); **the
  corpus pin moves first, so new district rows write values instead of refusals**; a dry run per
  county; per-county parcel ceilings. A-199 named 1.3.0. **A-204 moves the pin to 1.4.0**,
  published after A-199. It carries P-258's rows and P-299's rule that a flag has one meaning.
- The factory pins `@empressaio/setback-corpus` `^1.1.0` in `package.json` (lockfile resolves
  1.1.0), and `src/lib/setback-writer/setback-table-router.mjs` hardcodes
  `CORPUS_VERSION = "1.1.0"`.
- `src/lib/envelope-writer/envelope-corpus-lookup.mjs` throws `CLASSIFICATION_TABLE_STALE` **at
  module load** when `src/lib/envelope-writer/not-specified-classification-table.json` (P-146,
  `corpusVersion` 1.1.0, 329 rows) differs from `CORPUS_VERSION`. It also throws on a flagged
  `max_height_ft` slot with no table entry. `scripts/verify-not-specified-classification.mjs`
  is the table's checker. `src/jobs/parcel-envelope-cells.mjs` imports shared code from
  `parcel-setback-cells.mjs`, so PR #160's change also reaches the envelope writer.
- P-299's consumer report (`_inbox/2026-09-17_p299-height-flag-and-state_consumers.md`,
  "hauska-factory") measured three things against the 1.4.0 corpus:
  - the 40 flag removals were all classified `REAL_VALUE_FLAGGED`, so the served number does not
    change;
  - the 76 normalised sentinels are served absent before and after;
  - **25 flagged height slots have no classification entry** (round-rock 11, austin 4, waco 4,
    martindale 2, kyle 1, lakeway 1, luling 1, san-marcos 1), all rows P-258 added.
- Under 1.4.0 a `not_specified` flag means only "the code states no value" (OT-1), and G8 blocks
  an unflagged 999, so a flagged slot is an absence by rule.

### What to build

1. **#160 on current main**, with its own tests passing and the whole suite green in CI.
2. **The pin at 1.4.0**: `package.json`, the lockfile and `CORPUS_VERSION`, in one commit with
   step 3.
3. **The classification table regenerated for 1.4.0**, by a script (checked in, or the existing
   generator extended), never by hand. Every flagged slot in 1.4.0 has an entry. Say how the
   `REAL_VALUE_FLAGGED` and `SENTINEL_SUSPECT_IN_MIXED_GROUP` classes are handled now that OT-1
   has removed the first class from the data. If a class is empty under 1.4.0, say so and keep
   the code path only if a test still exercises it. `verify-not-specified-classification.mjs`
   passes against 1.4.0 and fails against a table with one row removed.
4. **What changes in the cells**, measured read-only (heavy-scan lease on the factory store) or
   computed from the corpora: per county, how many parcels' setback and envelope cells would
   change from `unaccounted` or a refusal to a value because of the pin, and how many would change
   the other way. The integration seat checks each county's dry run against this and against the
   A-199 ceilings (Bastrop 5,518; Caldwell 5,116; Hays 18,904; McLennan 43,305; Travis 103,283;
   Williamson 43,346 parcels). Say whether your figure and the ceiling measure the same thing.
5. **The exact dry-run and apply commands** per county for the integration seat, with the image
   they need.

### Falsifiers, pre-register your answers first

1. The envelope writer module loads at 1.4.0 (test), and a table left at 1.1.0 fails to load.
2. Every one of the 25 slots P-299 named resolves without throwing, as an absence (test).
3. A parcel in a district that has a row only in 1.4.0 gets a value cell in the setback writer's
   dry run, not a refusal (test with a fixture, or a dry run against staging).

### Do not

- Apply any writer, write any store, deploy, or merge.
- Edit the corpus package (it is published; a table fix goes to the corpus repo as a report).
- Touch the other lanes' files, or launch sub-agents.

### Close

Snapshot; files touched; PR #160's new head with every CI check's literal conclusion string; the
table regeneration method and its row counts by class; the per-county change table; the
commands; the falsifiers with evidence. `status`: `closed-partial` until the integration seat's
applies are graded. `probe`: `{"notApplicable": "build lane; graded by the dry runs, the
ceilings and the gate's verdicts after apply"}`. `subAgents`. `leave_behind`.
