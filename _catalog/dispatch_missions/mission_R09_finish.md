## Mission — property seat: finish R-09, prove the indicators can return a red

You own `legacy-design-tools`. You built both halves of this. The planner took it as far as it
could and stopped at a production-affecting step that is yours to judge, not its.

Work in `P:/seat-worktrees/property/legacy-design-tools` on `seat/property`. SEAT-01 is armed
now and refuses writes from any other worktree, including the shared checkout at
`P:/legacy-design-tools`, which is dirty on `feat/s1-instrument-hardening` with 63 files and
must never be cleaned or stashed.

---

## STATE, verified, do not re-derive

**Merged.** PR 447 merged as `4a52dee1`. Merged on the PR HEAD `164378da`, not on the SHA the
R-09 close named; the branch had moved four commits past it.

**Deployed as a CANARY AT ZERO PERCENT.** This is the deploy workflow behaving as designed.

    100%  cortex-api-00522-row               <- SERVING. Pre-R-09 code.
      0%  cortex-api-00524-pit  tag=canary   <- R-09's code
    canary URL: https://canary---cortex-api-tds7av26va-uc.a.run.app

**The recompute works.** `POST /api/county-ledger/recompute` with
`Authorization: Bearer $SERVICE_API_KEY` (secret `SERVICE_API_KEY`, project
`legacy-design-tools-prod`) completes and COMMITS. Cloud Run cuts the CLIENT at 300s with a
504 while the transaction lands. Two ran today; `summary.computedAt` moved 2026-08-14 ->
`2026-08-21T12:39:05.869Z` -> `2026-08-21T12:48:59.242Z`. Both ran on the SERVING revision,
so both wrote a snapshot computed by PRE-R-09 code.

**The advisory lock clears.** It is held for the run and released when the pooled connection
is reaped. It is not permanently orphaned; a filed note saying otherwise is corrected in
`_inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md`.

**The indicators have not moved on any read.** 3,556 cells, `hasWriter` true on all,
`atomFamilyState` present on all, `isPartial` false on all. Canary and production return
BYTE-IDENTICAL payloads (2,121,675) on the same stored snapshot, so R-09's read-path overlay
makes no difference to a snapshot the old compute wrote.

---

## THE ONE THING THAT IS ACTUALLY UNPROVEN

Whether R-09's COMPUTE produces indicators that take more than one value.

Nothing established today touches that. Every recompute so far ran old compute. Every read,
canary or production, read a snapshot old compute wrote.

---

## THE CLEAN PATH, and it is why this is small

`dryRun` is a **QUERY PARAMETER**, read by `firstQueryValue(req, "dryRun")`. It is NOT a body
field. The planner sent it in the body, it was silently ignored, and a full real recompute
started by accident. Do not repeat that.

    POST https://canary---cortex-api-tds7av26va-uc.a.run.app/api/county-ledger/recompute?dryRun=1

That runs **R-09's compute on the canary**, diffs against the stored snapshot, reports what
WOULD change, and **writes nothing**. It proves or disproves the row without touching what
production serves.

Run it in the background or with a client timeout above 300s. It will 504 at the edge; that
does not mean it failed. Read the diff from the response if you get one, and from the request
log if you do not.

---

## What done looks like

**A firing, with a cell id.** Name a specific county and rail whose `hasWriter`,
`atomFamilyState` or `isPartial` returns a negative value under R-09's compute, and show the
payload it came from and which revision produced it. `latestReadyRevisionName` is NOT the
serving revision; the authoritative answer is `resource.labels.revision_name` on the request
log line for your own request.

**Or a disproof, which is equally valuable.** If R-09's compute still produces constants, say
so and name the mechanism: hand-declared, erased in transit, or starved. The three have
different fixes and the evidence for each lives in a different place. Do not report one when
you have evidence of another.

---

## Fences

**No traffic shift.** Promoting the canary to serving traffic is an operator decision and is
outside this row, exactly as R-09's original dispatch stated.

**No non-dry recompute against the shared snapshot from canary code** without saying so first.
Both revisions read one database. A snapshot written by canary compute is immediately served by
the production read path, which is not the code that wrote it.

**No absence minting. No `--apply`. No store writes. No migrations.** You repair an instrument;
you do not close a cell and you do not change what the gate requires. If a launch criterion is
WRONG rather than merely ungradeable, file it for the operator and stop — criteria are an
OPS-16 amendment.

---

## Three planner errors from today. Carry them; do not repeat them.

**Twice** the planner reported the serving revision as `00524-pit` at 100 percent, claiming to
have checked the traffic split. It had misread semicolon-aligned `gcloud --format="value(...)"`
output where the percent column shifts. Use `--format=json` and read `status.traffic[]`, or
read the revision off the request log line.

It reported the advisory lock permanently orphaned, from two 409s taken minutes apart.

It reported the route incapable of completing, when the route completes and commits and only
the client is cut.

All three were confident verification claims on facts never established, and all three shared
one shape: **the check returned the expected answer, so it was not interrogated.** A convenient
result is a reason to distrust the instrument.

---

## The residual defect, filed, not yours to fix in this row

`SET LOCAL statement_timeout = 240_000` bounds ONE STATEMENT.
`computeCountyLedgerPayload` runs a capability probe per rail, each in its own SAVEPOINT, plus
the snapshot read and write. N statements each under 240s run unbounded past Cloud Run's 300s
ceiling, so the 504 is structural. Raising or lowering the statement timeout changes nothing.
It needs a transaction-level or request-level deadline, or the scan off the request path.
Filed at `_inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md`.

---

## Return

Close naming: repo and commit for everything read and changed; which revision served each
request you made, taken from the log line; the dry-run diff; and either the firing with its
cell id or the disproof with its mechanism. State plainly whether the two launch criteria
graded by `hasWriter` and `atomFamilyState` are now capable of failing, and if only partly,
which part.

Tier 2 scratch to `_scratch/r09_finish.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, and OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
