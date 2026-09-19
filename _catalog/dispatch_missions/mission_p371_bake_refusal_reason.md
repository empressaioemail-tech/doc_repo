## Mission — P-371: a bake that refuses leaves its reason on the record

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open one PR from current
`origin/main` with the SHA declared (`e6ca09de` at compile). You do not merge, deploy, publish or
write any store.

### What is wrong (measured 2026-09-19)

Williamson's staging publish `factory-bastrop-publish-cswmw` (run `bd087474`) failed in the bake. Its
Cloud Logging output is 11 entries: a pg deprecation warning, the line `BAKE_FAILED`, and the
container exit. `run_events` holds `termination {"reason": "BAKE_FAILED"}`. The bake subprocess's own
output, which carries the refusal (P-351's guard prints its per-keyspace measurement to stdout and
throws a named error), is on no record.

At source (`src/jobs/bastrop-publish.mjs`): `runShell` catches the subprocess failure, joins
`err.stderr`, `err.stdout` and `err.message` (last 4,000 characters) into a new Error, and sets its
code to `BAKE_FAILED` when the child's code is not a string. The caller that reaches the job's
top level prints only the code. So the reason exists in memory and is dropped at the edge.
ENFORCEMENT: a refusal that leaves no name is how a state becomes unanswerable; the seat had to infer
the cause from a store read and could not close the second mechanism.

### What to build

1. **The reason reaches the durable record.** On a subprocess failure, a bounded tail of stderr and
   stdout is written to the run's record (a `run_events` row on the publish run, or the run row's
   refuse detail) BEFORE the job exits, and to the job log. Bound it and say how (bytes, lines).
2. **A named refusal keeps its name.** If the child exits with a named refusal (a code the bake
   raises, for example the account-keyed blast-radius refusal), the run's `refuse_code` carries that
   name rather than `BAKE_FAILED`. Say how the child reports it (exit payload, a last-line JSON, an
   exit code map) and keep `BAKE_FAILED` only for a failure with no name.
3. Check `dollar-fields-patch.mjs`, which has the same wrapper shape, and every other `runShell`
   caller. Enumerate them; fix or name each.

### Verify by violation

A fake bake that prints a known refusal line and exits non-zero: before the change the record holds
only `BAKE_FAILED`; after it the record holds the line and the named code. A bake that fails with no
name still records `BAKE_FAILED` plus its tail. The bound holds on a child that prints megabytes.

### The three-question gate

What writes the reason, what triggers it (any bake subprocess failure), what fails when the reason is
missing, and what bypasses it (a process kill that skips the handler; name how the record reads then).

### Constraints

No store writes, no deploys, no merges. `hauska-factory` only.

### Close

Declare: the start commit and PR, the record shape, the caller enumeration, the falsifiers with both
directions shown, the three-question gate answers, and `leave_behind`.
