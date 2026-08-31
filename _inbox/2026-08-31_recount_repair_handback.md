# Handback: post-H residue recount instrument repair

Worker: integration-seat subagent, in-session repair under CANON_OVERRIDE / DISPATCH_OVERRIDE.
Snapshot: repo `P:/doc_repo`, branch `main`, commit `e4b312ea351dcd3638da82c13316166125069e91`.
No commit, no push, no deploy, no `--live`, no store read. Planner commits.

## Hazard containment (done first, verified last)

| step | value |
|---|---|
| report sha256 before | `b3353b9677d4efbc1372d20ee2084766185bbaf5771f469a238fab38ad8c2c5f` |
| backup | `scratchpad/recount_report.BACKUP.json`, same sha256 |
| report sha256 after all work | `b3353b9677d4efbc1372d20ee2084766185bbaf5771f469a238fab38ad8c2c5f` |
| `cmp` original vs backup | exit 0, byte-identical |
| size / mtime | 5,124 bytes, `2026-08-30 09:17:58` — unchanged |

The report is in fact **tracked and clean at HEAD** (`git ls-files --error-unmatch` succeeds,
`git check-ignore` exits 1). The card's "untracked, no git recovery" premise is wrong; there
*is* a git recovery path. Treated it as irreplaceable anyway.

Proof of repair 1 by execution, not by reading: importing the module in a fresh process
produced no output and left the sha256 unchanged.

## Diff by file

One file changed. Nothing else in doc_repo touched.

`scripts/ctx/post-h-residue-recount.mjs` — 397 lines to 1,187 lines
(`git diff --stat`: 1052 insertions, 262 deletions). Line endings stay LF;
`.gitattributes` pins `eol=lf` for this path, so no CRLF churn in the diff.

## The six repairs

**1. Write guard — LANDED.**
`main()` now runs only under `if (IS_MAIN)`, where `IS_MAIN` is `import.meta.main`
(Node 24 has it) with an `argv[1]` realpath fallback. Nothing executes on import.
The write path is a single `writeFileSync` at line 397 inside `writeReport`, gated by a
pure `writeGuardVerdict({isMain, liveFlag, payload})` with four gates: entrypoint,
`--live`, matching control, and **`live.liveStatus === "measured"`**. That fourth gate is
the second half of the repair: a failed `--live` now exits 2, prints `wroteReport: false`
plus `reportPreserved: <path>`, and never calls `writeReport`.

**2. Run-time commit — LANDED.**
`gitSnapshot()` shells `git -C ROOT rev-parse HEAD` at run time and also records branch,
`treeDirty`, and `dirtyPathCount`. Git failure records `commit: "unmeasured"` with the
redacted reason, never a literal. Live proof from the self-test run: the snapshot now reads
`e4b312ea351d…` / `main` / dirty 2304. The hardcoded `"59ffa02"` was **false** — HEAD has
moved five commits past it.

**3. DB host — LANDED.**
New `META_SQL` runs `current_database()`, `inet_server_addr()`, `current_setting('server_version')`,
`now()`. `hostIdentity()` parses the URL for `hostname` / `hostLabel` / `port` / `urlDatabase`
only — it never touches `.username`, `.password`, `.search`, or `.href` (grepped: zero hits).
`live.snapshot` gains `database`, `host`, `hostLabel`, `urlDatabase`, `serverAddr`,
`serverVersion`, `serverTime`, and `credentialsRecorded: false`. A meta-query failure records
`"unmeasured"` per field, not a guess. `redact()` was widened to also strip `//user:pass@`
and is now self-tested against a realistic Neon connection string.

**4. publishRunId assertion — LANDED.**
`auditPublishRuns(counties, expected)` is pure and asserts per county that
`publish_run_min === publish_run_max === CARD_H_RUNS[fips]`, plus `publish_runs === 1` and
county presence. On any finding, `runLive` returns `liveStatus: "unmeasured"` with the audit
attached — a number is never returned. The audit result is also carried into
`reading.measured.publishRunAudit`.

Deliberately an **assert, not a SQL filter**. Filtering on `publishRunId` would silently
drop a second run in the range and hand back a clean-looking number; asserting refuses.
This is stated in a code comment so the next reader does not "fix" it into a filter.

**5. Dead-code self-tests — LANDED, option (b) with a strengthening.**
Chose **delete `classifyBody`/`tally`**, not "drive the live path through `tally()`".
Reason: the live path aggregates ~1.5M rows in postgres. Routing that through JS would mean
streaming every payload to Node — a different, slower, more fragile instrument, and it would
not measure what production measures.

Straight option (b) has a hole though: without a database you cannot execute the SQL, so
fixtures "fed to the SQL classifier" cannot actually run. So the SQL is now **generated from
the same spec the fixtures exercise**. Each predicate in `P` carries both a `sql` string and
a `js` function; `COLUMN_SPEC` lists the counted columns; `buildLiveSql()` emits the query
from that list. A column cannot exist in one half and not the other, and `unstamped_sentinel`
is built with `and(P.conformant, not(P.stamped), P.point_sentinel)` so its clauses are the
shared predicates, not a retyped copy. Six structural self-tests assert the generated SQL
carries every spec column, every aggregate, every county range, all three
`unstamped_sentinel` clauses, no write verb, and a parser column set matching the spec.

Two real drifts were found and fixed while mirroring: the old `classifyBody` read
`lat`/`lng` out of the **payload**, but the SQL reads the **table columns** `lat_rounded` /
`lng_rounded`; and it read a `facets.zoning` fallback the SQL never had. Fixtures are now
row-shaped (`{place_key, lat_rounded, lng_rounded, payload_json}`) — what the SQL sees.

Six columns the old `tally` emitted and the SQL did not now exist in both:
`point_usable`, `join_unmeasured`, `join_other`, plus new `nonconformant` and `unstamped`.
`nonconformant` surfaces the 18,100 rows the review flagged as carried by no join state.

**Residual, stated plainly:** the `sql` half of each predicate is still unexecuted by the
self-test. Structure is verified; postgres semantics are not. Killing that needs a database.

**6. Non-vacuous tests — LANDED.**
`tests` comes from a real counter (`TEST_COUNT`) and the run also emits `testNames`.
Deleting an assertion now drops the count — demonstrated below, 35 to 34.
Added the two demanded fixtures and more: a **stamped sentinel** (0,0 + `district: SF-1`),
a **non-conformant** row, a conformant-unstamped-with-real-point row, a missing-schema row,
and an unrecognised join state. Four partition invariants assert the point, conformant,
stamped, and join buckets each cover the fixture set exactly once, and one assertion pins
all six join buckets non-empty so no clause is unexercised.

## Also requested

**`ownersAgree` for 48209 / 48491 — LANDED, with an honesty caveat that matters.**
Three new SQL columns: `owner_agree_recorded` (`provenance.landUseAddressRecovered = 'true'`),
`owner_agree_source` (`provenance.landUseSource = 'cad-roll-address-join'`), and
`owner_agree_conflict`, which fires when `parcelJoin.state = 'joined-situs'` and
`landUseAddressRecovered = true` disagree **in either direction**. A new `live.ownersAgree`
block reports per blocked FIPS, plus `nonBlockedOwnerAgreeRecorded` for the other four —
any non-zero there is a seed leak in the opposite direction.

The caveat is recorded in the output itself, not just here. Both fields are written by the
same bake into the same payload, so **one party acting alone satisfies both sides**. By
ENFORCEMENT's own test that is *internal consistency, not a second derivation*. The block
says so verbatim in a `derivation` field and points at
`scripts/ctx/w0b-owner-agree-sample.mjs` (CAD owner vs TxGIO owner) as the actual external
derivation and the decision's reversal criterion. It detects a bake that contradicts itself;
it cannot detect a bake that is uniformly wrong. Do not let this column be quoted as
satisfying the 2026-08-29 reversal criterion — that still needs the W0b sample, which is
currently **partial** (48453 timed out; 48021 and 48055 came back no-go at 0.69 / 0.72).

**`reading` split — LANDED, as three buckets not two.**
`measured` holds the counts and the like-for-like subtraction, each pre-H figure now
carrying `_source: _inbox/2026-08-28_ctx-f_cp1.json`. The bare literals `534700` and
`119389` moved into an exported `PRE_H` constant with its citation; `119389` is genuinely
sourced (that file, line 48, `join_no_row` for 48453).
`inferred` holds two claims, each with `basis`, `alternativeRejected`, and
`establishedByThisInstrument` — notably `travis_situs_never_attempted: false`, because this
instrument observes an unchanged count and does **not** read the FIPS gate in card H.
`recommended` holds the W1/P-80 advice.

I used three keys where the card said two. A recommendation is neither a measurement nor an
inference, and folding it into `inferred` would have reproduced the category error the split
exists to fix. Flagging it as a deviation for the planner to accept or collapse.

## Acceptance, both directions, no pipeline

```
$ node scripts/ctx/post-h-residue-recount.mjs --self-test >/dev/null 2>&1; echo $?
0

$ node <scratchpad>/BROKEN_A_alias.mjs --self-test >/dev/null 2>&1; echo $?
1

$ node <scratchpad>/BROKEN_B_sqlclauses.mjs --self-test >/dev/null 2>&1; echo $?
1
```

Mutation results — both mutants the prior review reported as **surviving** are now killed:

| mutant | change | result |
|---|---|---|
| A | `P.unstamped_sentinel = P.point_sentinel` (pure alias) | **killed**, exit 1, fails on the stamped-sentinel fixture |
| B | `and()` emits only the last clause (SQL loses unstamped clauses, JS intact) | **killed**, exit 1, fails the generated-SQL structural test |
| C | delete one assertion | exit 0 but `tests` reports **34, not 35**, and the name disappears |

C is intended behaviour, not a miss: deleting an assertion is now *visible* in the artifact.
Previously it still reported `tests: 6`.

Broken copies live in the scratchpad only: `BROKEN_A_alias.mjs`, `BROKEN_B_sqlclauses.mjs`,
`BROKEN_C_deleted_assert.mjs`. Nothing outside `scripts/ctx/post-h-residue-recount.mjs`
was written in doc_repo.

## Not done, and why

- **`--live` not run.** Forbidden by the verification clause; no store URL in this session.
  The live path, the meta query, and the psql parsing are therefore **untested against a
  real database**. The planner should expect the first `--live` to be the real proof, and
  note it is now safe to attempt: a failure exits 2 and preserves the existing report.
- **SQL semantics unverified.** See repair 5 residual. Structure only.
- **`stamped` still does not `trim()`.** The live SQL never trimmed, so a whitespace-only
  `district` counts as stamped in production. I mirrored the SQL rather than silently
  redefining a measure mid-repair — changing it would move the published numbers. Recorded
  as a code comment and raised here as a separate finding, not fixed.
- **Existing numbers deliberately unchanged.** Every pre-existing column's SQL is
  semantically identical to the original (`NOT (a<>'' OR b<>'')` ≡ `a='' AND b=''` under
  `COALESCE`), so a re-run should reproduce the current per-county figures plus the new
  columns. Verify that on the first `--live` before trusting the new columns.
- **Report file untouched.** The existing measurement is stale against this instrument
  (it reports `tests: 6` and a false commit). It is item 10's job to re-run on the Wave R
  `publishRunId`s; regenerating it now would also fail the new publishRunId audit only if
  the runs moved, and I was scoped out of writing it either way.

## One thing the planner should know

The review's finding that the current artifact's JSON key order "cannot have been produced
by this source" still stands, and my repair does not resolve it. The file on disk was not
emitted by the code that claims to have emitted it. Whatever produced it, the numbers in it
are now **unreproducible by inspection** — only a fresh `--live` under the repaired
instrument can re-establish them.
