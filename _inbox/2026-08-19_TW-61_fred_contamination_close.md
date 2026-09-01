---
title: TW-61 close — FRED contamination established, stored atoms corrected by supersession
status: active
last_updated: 2026-08-19
owner: planner
plan_row: TW-61
repo: empressa-trading
---

# TW-61 close — FRED back-stamp contamination

Row: TW-61 (Smart Markets, unregistered R&D, bounded PR, operator-ruled 2026-08-19).
Repo: `P:/Empressa Trading`, backend `apps/cockpit/backend`.
Worktree: `P:/empressa-trading-worktrees/tw61-quarantine`, created from `origin/main` @ `3aad1cbb`. No checkout was ever performed in `P:/Empressa Trading`.

Branch: `tw61/fred-quarantine`
Commits: `60e2cc16` (withdrawn in-place mark), `b7cbc934` (supersession remedy)
PR: **#345** https://github.com/empressaioemail-tech/empressa-trading/pull/345 MERGED by the operator 2026-08-19 13:45:01Z (merge commit `569adaca`). NOT DEPLOYED, NOT RUN. This seat did not merge; it left the PR open as instructed and the merge happened outside the session. Merged is not applied, and section 11 verifies that against production.

## 0. Verdict

**Phase one did not end the row. The contamination is real.**

One backfill run reached production on 2026-06-29 between 00:22 and 00:23 UTC and wrote 1,521 atoms across all five series. Every one is back-stamped. None carries the `revision` key that TW-59 now writes. They are the entire FRED population of the `atoms` table, so no field distinguishes them from honestly captured FRED atoms for the simple reason that no honestly captured FRED atoms exist.

Phase two was therefore executed. The remedy is a SUPERSESSION, landed in code as an operator-triggered job, not applied. An earlier version of this row proposed an in-place data migration; that was ruled out and the reasoning is recorded in section 8.

## 1. Production access posture

The operator authorised a read-only production query for this row and only this row. What ran was `SELECT` only, through a fresh engine with `NullPool`, never committing. No `INSERT`, `UPDATE`, `DELETE`, no DDL, no alembic invocation, no container restart. The live paper-trading soak and both A/B arms were untouched. The API container `empressa-cockpit-api` showed `Up 14 hours` before the probes and was not bounced.

Execution form, per the working pattern for this environment:

```
gcloud compute scp tw61_probe.py empressa-bot:/tmp/tw61_probe.py \
  --zone us-east4-a --project empressa-trading-prod --no-tunnel-through-iap

gcloud compute ssh empressa-bot --zone us-east4-a --project empressa-trading-prod \
  --no-tunnel-through-iap --command "docker cp /tmp/tw61_probe.py empressa-cockpit-api:/tmp/tw61_probe.py \
  && docker exec -e PYTHONPATH=/app empressa-cockpit-api python /tmp/tw61_probe.py \
  > /tmp/tw61_out.txt 2> /tmp/tw61_err.txt"
```

The gcloud calls were issued from PowerShell rather than the bash tool, because MSYS rewrites the `/tmp` paths inside `--command`. `MSYS_NO_PATHCONV` was never set for a gcloud call. stdout and stderr were captured to separate files and both were read whole. stderr was empty on all four probes.

Target database, redacted, as the app itself resolves it:

```
DATABASE (redacted): postgresql+psycopg://***@cloud-sql-proxy:5432/cockpit
```

## 2. Question one: do the atoms exist, and how many

```
==============================================================================
Q1. FRED capture atoms by series (claim_key LIKE 'capture:fred:%')
==============================================================================
claim_type | series | prov_source | prov_method | n
macro.vix | VIXCLS | fred | backfill | 494
macro.dxy | DTWEXBGS | fred | backfill | 479
macro.rate.10y | DGS10 | fred | backfill | 478
macro.cpi | CPIAUCSL | fred | backfill | 35
macro.unemployment | UNRATE | fred | backfill | 35

==============================================================================
Q1c. ALL atoms with provenance_source='fred'
==============================================================================
prov_source | claim_type | n
fred | macro.vix | 494
fred | macro.dxy | 479
fred | macro.rate.10y | 478
fred | macro.unemployment | 35
fred | macro.cpi | 35

==============================================================================
Q5. total atoms in table
==============================================================================
total
66492
```

1,521 rows out of 66,492. The query was deliberately widened twice, once to every `macro.%` claim type regardless of how it was written and once to every atom with `provenance_source='fred'`, so the count is not an artifact of matching on the dedup key. Both widenings return the same 1,521. There is no second FRED write path.

The daily series stop at 2025-05-29 rather than at the run date because the job passes a 500 row limit to `fred.observations`; the monthly series carry 35 rows each, which is the full window. This matters only in that the exposure is bounded and known.

## 3. Question two: knowledge_time, and the back-stamp signature

```
==============================================================================
Q2. knowledge_time vs captured_at (back-stamp signature)
==============================================================================
series | n | kt_min | kt_max | cap_min | cap_max | kt<cap-2d
CPIAUCSL | 35 | 2023-06-01 00:00:00+00:00 | 2026-05-01 00:00:00+00:00 | 2026-06-29 00:22:52.380421+00:00 | 2026-06-29 00:22:53.088053+00:00 | 35
DGS10 | 478 | 2023-06-30 00:00:00+00:00 | 2025-05-29 00:00:00+00:00 | 2026-06-29 00:22:41.260264+00:00 | 2026-06-29 00:22:52.071553+00:00 | 478
DTWEXBGS | 479 | 2023-06-30 00:00:00+00:00 | 2025-05-29 00:00:00+00:00 | 2026-06-29 00:23:05.407888+00:00 | 2026-06-29 00:23:15.790439+00:00 | 479
UNRATE | 35 | 2023-06-01 00:00:00+00:00 | 2026-05-01 00:00:00+00:00 | 2026-06-29 00:22:53.356884+00:00 | 2026-06-29 00:22:54.122095+00:00 | 35
VIXCLS | 494 | 2023-06-30 00:00:00+00:00 | 2025-05-29 00:00:00+00:00 | 2026-06-29 00:22:54.424357+00:00 | 2026-06-29 00:23:05.168296+00:00 | 494
```

`knowledge_time` precedes `captured_at` on 1,521 of 1,521 rows, by margins running from thirteen months to three years. The entire population was written inside a 34 second window on a single day. This is the back-stamp signature and it is unambiguous.

Ten raw rows were pulled unfiltered; the first three, showing the shape:

```
==============================================================================
Q3b. 10 earliest FRED capture rows, raw
==============================================================================
id | claim_key | claim_type | worker | prov_method | knowledge_time | captured_at | valid_from | claim_value_json
705ca3a70f964074bb083d1053317054 | capture:fred:DGS10:2023-06-30 | macro.rate.10y | temporal_capture | backfill | 2023-06-30 00:00:00+00:00 | 2026-06-29 00:22:41.260264+00:00 | 2023-06-30 00:00:00+00:00 | {"series_id": "DGS10", "date": "2023-06-30", "value": 3.81}
4c79be123b09454ea3544a007b053a67 | capture:fred:DGS10:2023-07-03 | macro.rate.10y | temporal_capture | backfill | 2023-07-03 00:00:00+00:00 | 2026-06-29 00:22:41.282639+00:00 | 2023-07-03 00:00:00+00:00 | {"series_id": "DGS10", "date": "2023-07-03", "value": 3.86}
e6463811acc34c8aab5a851813bed153 | capture:fred:DGS10:2023-07-05 | macro.rate.10y | temporal_capture | backfill | 2023-07-05 00:00:00+00:00 | 2026-06-29 00:22:41.303837+00:00 | 2023-07-05 00:00:00+00:00 | {"series_id": "DGS10", "date": "2023-07-05", "value": 3.95}
```

`CPIAUCSL` and `UNRATE` are the material exposure, as TW-59 anticipated. Both are revised hard and repeatedly, so their stored values are the ones least likely to match what was actually knowable on the stamped date. The other three are daily market series with far lighter revision behaviour, but they are contaminated by the same mechanism and are corrected alongside.

## 4. Question three: is there already a distinguishing field

```
==============================================================================
Q3. presence of claim_value.revision (TW-59 self-describing marker)
==============================================================================
marker | n
NO revision key | 1521
```

No. Zero rows carry a `revision` key. TW-59 added that field to `capture_fred_observation` so a reader could tell a first-release row from a vintage row without re-deriving it from the job that wrote it, but no honest row has been written since, so the field is absent from the whole population. Nothing else separates them either: they are uniform in `worker`, `provenance_source`, `provenance_method`, `access_policy` and `family`.

```
==============================================================================
S1. immutable flag on the contaminated rows
==============================================================================
immutable | family | access_policy | n
True | event | public | 1521
```

## 5. Question four: remediation blast radius

```
==============================================================================
Q4b. contaminated cohort by series
==============================================================================
series | n
CPIAUCSL | 35
DGS10 | 478
DTWEXBGS | 479
UNRATE | 35
VIXCLS | 494

==============================================================================
P5. EXACT job predicate (4-bounded, idempotent form)
==============================================================================
rows_job_will_supersede
1521
```

`P5` is the job's own selection predicate run verbatim as a `SELECT`, rather than a reconstruction of it. **1,521 is the number the operator should see on the first run.**

The current-atoms projection is worth stating separately, because it decides what is actually served:

```
==============================================================================
P1. current_atoms rows for the contaminated keys, by scope
==============================================================================
scope | n
global | 1521

==============================================================================
P3. projection rows pointing AT a contaminated atom
==============================================================================
n
1521
```

Every one of the 1,521 keys has a projection row, in the `global` scope, and every one of those points at the contaminated atom. So the contaminated value is the current single-valued read for its key today.

## 6. The remedy: supersession, not mutation

`apps/cockpit/backend/app/jobs/tw61_fred_supersede.py`, registered as job kind `fred_vintage_supersede` in `app/jobs/handlers.py`.

The job appends one correcting atom per contaminated atom, on the same `(node_id, claim_key, scope)`. Nothing existing is edited.

Same `claim_key`, which is what makes it a supersession rather than an unrelated new fact. Same `provenance_source` of `fred`, which is load-bearing rather than incidental: `detect_conflict` treats a differing source as a cross-source disagreement, so changing it would launder a self-correction into a conflict set. Same `valid_from`, because the observation date is true-in-world and does not move. `knowledge_time` left unset so the store stamps now, which is the honest answer to when we recorded it and is the entire correction. The `claim_value` carries the same number, since we do hold it, plus `revision` set to the un-established-vintage sentinel and a `supersedes` pointer naming the atom it replaces.

The original atom stays exactly as written, still saying the dishonest thing. The record then shows both what we claimed and when we corrected it, which is what bitemporality is for.

### Why a job rather than a migration

The remedy is an append, and `store.append_atom` is the one legitimate atom write path. It validates consent, rejects declared PII, gates backtest basis, runs cross-source conflict detection, advances the current-atoms projection, and records population membership. An alembic migration cannot call it: it is async, it wants an `AsyncSession`, and it commits per atom. A migration could therefore only hand-roll raw INSERTs and hand-replicate the projection advance.

No migration in this repo has ever written an atom. The nine that mention the `atoms` table are all DDL:

```
$ grep -ln "atoms" migrations/versions/*.py
0021_spine_atoms.py  0022_billing_schema.py  0023_spine_nodes.py
0036_verified_absence.py  0037_population_manifests.py  0038_pii_crypto_shred.py
0039_conflict_reconciliation.py  0040_research_sessions.py
0055_regime_forecast_unique_index.py

$ grep -n "INSERT INTO atoms" migrations/versions/*.py
(no matches)
```

Starting here would re-create, in a new form, the same class of error this row is correcting. The job is the vehicle instead. Alembic head returns to `0058_identifier_index_cik`, matching production, and **there is no schema change at all**.

### Idempotency

The predicate is four-bounded: the `capture:fred:` claim-key prefix, `worker = 'temporal_capture'`, absence of a `revision` key, and absence of an existing supersession atom on the same `claim_key`. The fourth bound is what makes a second run a no-op. The first three would match the originals forever, precisely because the originals are never edited, so idempotency has to come from the presence of the correction rather than from any change to the thing corrected.

The job defaults to `dry_run: true`, so an operator who triggers it with no parameters gets the count and writes nothing. It returns and logs `matched`, `written`, `skipped` and `by_series`.

### Why not the alternatives

A corrected re-run remains a silent no-op, verified at source and unchanged from phase one: `capture._dedup_key("fred", series, day)` yields the literal `capture:fred:{series}:{date}` seen in the raw rows, and `persist_capture_atom` returns `None` via `_already_captured` before reaching `append_atom`. Every key exists and every key is unique.

A delete was never attempted. The substrate is append-only and that property is what makes the record evidence.

An in-place mark was implemented first and then withdrawn. Section 8 records why.

## 7. The reader change, now included

A mark no reader honours is not a remedy, so `app/spine/atom_context.py` changes in two places.

`_chip_worthy_row` now refuses any atom that declares its vintage was never established. We may still hold the number; citing it inline asserts it as evidence of what was knowable at its observation date, which is the one claim its own provenance says we cannot make. The refusal lives in the shared predicate rather than at the call sites so every surface inherits it.

The macro query now excludes rows that a later atom supersedes, expressed as a correlated `NOT EXISTS` on `(entity_id, claim_key, knowledge_time)`. That is the store's own definition of current, and it rides the existing `ix_atoms_node_claim_ktime` index. It is scoped to the macro leg deliberately; the symbol leg has its own ordering semantics and was not in this row's scope.

The two compose. The stale original is filtered by supersession, its correction by its own mark, so neither can become a cited chip. That is the honest outcome: we hold the numbers and do not present them as evidence.

The blast radius of the supersession filter is small and correct:

```
==============================================================================
P6. macro atoms ALREADY superseded today (reader-filter blast radius)
==============================================================================
n
10
```

Ten macro atoms in production are already superseded by a later atom on the same key. Those are stale by the store's own definition and should not have been serving.

The phase-one mitigation was NOT leaned on. Zero of the 1,521 sit inside the reader's newest-50 window today, but only because that window is saturated by calendar and regime atoms captured through 2026-08-19. That is a healthy-feed coincidence, not a guard, and a quiet week changes it.

## 8. The in-place mark was ruled out, and why

The first implementation of this row was an alembic data migration issuing `UPDATE atoms SET claim_value_json = :cv WHERE id = :id`. It was flagged in that PR as worth an explicit call before the deploy window. The ruling is that it was wrong, and the codebase had in fact already decided.

`app/spine/store.py` defines `AtomMutationError` with the docstring "Raised on any attempt to mutate an existing atom. Atoms are append-only: a correction is a NEW atom, never an in-place edit", and raises it with "atoms are append-only, cannot mutate atom {id}; append a new atom instead". `app/spine/immutability.py` enforces it with a `before_update` mapper-event listener. Mapper events do not fire on Core DML, which is exactly what a raw `UPDATE` in a migration is, so the migration would have succeeded by slipping past a guard whose spec definition of done is that such an attempt fails.

Three further reasons make the ruling legible rather than arbitrary. The defect being fixed is a record that asserted something untrue about what was knowable, and repairing it by editing the record is the same move in a nicer coat. Supersession is what bitemporality is for, and the store already had it. And this is the first correction anyone has needed here, so whatever is done becomes the pattern; an in-place UPDATE would demote append-only from a structural property to a procedural one, which is the class of guarantee that cannot be retrofitted, and which the store separately leans on for its claim that PII in an atom can never be erased.

The migration and its tests were removed rather than left dormant.

One design point survives from the withdrawn version. The sentinel `unknown_pre_tw59` now lives in `app/providers/point_in_time.py` beside the `Revision` enum and is deliberately not a member of it, because it names the absence of an established vintage rather than a vintage. `coerce_revision` therefore raises on it. That is the correct failure mode, loud rather than silently treating an un-vintaged number as a first release, and it is asserted by test.

## 9. Verification

Twenty-one tests at `apps/cockpit/backend/tests/test_tw61_fred_supersede.py`: the sentinel is not a coercible revision; the original atom is byte-identical after the run; the projection repoints from the original to the correction; `knowledge_time` becomes honest while `valid_from` does not move; the correction is classified as a supersession and not a conflict; a second run is a no-op; dry-run is the default and writes nothing; the predicate does not reach post-TW-59 or foreign-worker rows; and both reader legs, individually and composed.

```
$ python -m pytest tests/test_tw61_fred_supersede.py -q -p no:randomly
21 passed, 8 warnings in 3.40s

$ python -m pytest tests/test_spine_atom_serve.py tests/test_point_in_time.py \
      tests/test_phase2_backfill.py tests/test_atom_immutability.py -q -p no:randomly
55 passed, 8 warnings in 9.04s

$ python -m pytest tests/test_position_review_chips.py tests/test_spine_reads.py \
      tests/test_tool_loop.py -q -p no:randomly
81 passed, 8 warnings in 4.22s

$ python -m pytest -q -p no:randomly
4800 passed, 2 skipped, 21 deselected, 38943 warnings in 690.42s (0:11:30)
[exited with code 0]
```

The full-suite count reconciles exactly against the withdrawn approach: 4,789 before, minus the 10 tests deleted with the migration, plus the 21 written for the supersession, is 4,800.

CI on PR #345 is the authoritative gate and the merge standard is zero failures. It is met on the supersession commit `b7cbc934`:

```
$ gh pr view 345 --json statusCheckRollup
Python tests (cockpit backend)      COMPLETED   SUCCESS
Frontend build (cockpit web)        COMPLETED   SUCCESS
Frontend tests (cockpit vitest)     COMPLETED   SUCCESS
Gitleaks security scan              COMPLETED   SUCCESS
Windows .exe (release tags only)    COMPLETED   SKIPPED
```

## 10. What was not done

No deploy, no restart, no `docker compose`, nothing that bounced a container. The live paper-trading soak and both A/B arms ran untouched throughout; production access was read-only in every probe.

The job was NOT run against production. It lands in code as a registered kind and is triggered by the operator in a window, defaulting to a dry run.

This seat did not merge and did not push to main. PR #345 was updated in place rather than superseded by a second PR, and was left open; the operator merged it at 13:45:01Z.

No schema change was needed, so the stop-and-report condition did not fire. The supersession pattern already existed, so nothing substrate-level was invented.

The symbol leg of `atom_context` was left alone. Only the macro leg carries the supersession filter, which is the scope of this row; whether the symbol leg should inherit it is a separate question and is not answered here.

## 11. Post-merge check: merged is not applied

PR #345 was merged by the operator after this seat had finished and left it open. Because a merge can be
mistaken for a remediation, the applied state was re-checked against production, read-only:

```
==============================================================================
A. supersession atoms in production (job has NOT run if 0)
==============================================================================
n
0

==============================================================================
B. contaminated atoms still unmarked (expect 1521, unchanged)
==============================================================================
n
1521

==============================================================================
C. projection still points at contaminated atoms (expect 1521)
==============================================================================
n
1521

==============================================================================
D. alembic_version (expect 0058 - no schema change shipped)
==============================================================================
version_num
0058_identifier_index_cik
```

Nothing has been remediated. The job is registered in code but has never run, all 1,521 atoms are still
back-stamped and unmarked, the current-atoms projection still serves them, and the alembic version is
unchanged because the row ships no schema change.

**The remediation is still outstanding and is a deliberate operator action.** Trigger job kind
`fred_vintage_supersede`. It defaults to `dry_run: true`, which reports `matched` without writing; expect
`matched=1521`. Re-run with `dry_run: false` to write, and expect `matched=1521, written=1521, skipped=0`.
A second run after that must report `matched=0`.

The reader change, by contrast, IS live-on-deploy rather than operator-triggered: once this merge reaches
production, `atom_context` stops citing un-vintaged and superseded atoms whether or not the job has run.
That ordering is safe and is the right way round -- the reader stops presenting the bad rows as evidence
before the correcting atoms exist, rather than after.
