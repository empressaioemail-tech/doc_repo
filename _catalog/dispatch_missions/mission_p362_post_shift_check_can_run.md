## Mission — P-362: the post-shift credential check runs, and a check that did not run never reads as a violation

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` only and open one PR,
branched from current `origin/main` with the SHA declared (`25d1782f` at compile). You do not merge,
deploy, or dispatch the production workflow; the integration seat does. Any doc_repo change is handed
back as a diff in your close.

### What happened (2026-09-18 15:49Z, run 35364723464, `_inbox/2026-09-18_ldt_cortex_api_deploy_RECORD.md`)

After the cortex-api shift to `00841-jeh`, the `shift-traffic` job's P-279 step failed with
`Cannot find module scripts/check-tagged-revision-env.mjs`. Node exited 1, and the step's wrapper
mapped exit 1 to `RESULT=violation - a tag points at a revision missing a credential...`. The service
was clean: every tagged revision carried the serving revision's 67 env names, checked by hand, by
field. The same check inside `deploy-canary` runs, because that job checks out the repo.

### What is wrong, read at `25d1782f`

1. `.github/workflows/cloud-run-deploy.yml` job `shift-traffic` (~line 408) has no
   `actions/checkout` step, so the script it calls at ~line 484 does not exist on the runner.
2. The wrappers (~lines 305 to 319 in `deploy-canary`, ~484 to 498 in `shift-traffic`) map the
   script's exit codes by number, and the script's `EXIT` table (`scripts/check-tagged-revision-env.mjs`
   line 69) is `PASS 0, FAIL 1, REFUSE 2, USAGE 3`. Node's own crash exit is also 1. So a missing
   module, a syntax error or an uncaught exception reads as a credential violation: a check that
   could not run is reported as the most alarming thing it can find. That is worse than silence, and
   it teaches the operator to ignore the step, which is how the next real violation gets through.
3. On a Windows host the script refuses `SERVICE_DESCRIBE_FAILED` (seen by the seat 2026-09-18). It
   already builds a quoted command string with `shell: true` (`gcloudJson`, ~line 218). Reproduce it,
   capture the actual stderr, and fix the cause; do not guess at it.

### What to build

1. `shift-traffic` checks out the repo at the deployed commit (say which ref and why; the job runs on
   `workflow_dispatch`, so name the commit it is guaranteed to be).
2. The script's verdict cannot be confused with a crash: a violation exits with a code node never
   uses on its own (move FAIL off 1), or the wrapper requires a positive marker the script prints only
   when it evaluated the service (both is better). Any exit the script did not deliberately produce
   reads `RESULT=did-not-run` and fails the step with that text. One exit-code table, read by both
   wrappers; do not keep two copies of the case statement that can drift.
3. The script resolves `gcloud` on Windows (and on Linux still), with the fix stated.
4. Enumerate every other workflow step in LDT that calls a repo script from a job without a checkout,
   or maps a script's exit codes by number. Fix the ones in this workflow; list any others.

### Verify by violation

Pre-register your falsifiers. Each shown: a job run with the script deliberately absent reads
`did-not-run`, never `violation`; a fixture with a real violation (`--from-fixture`) reads `violation`;
a clean fixture reads `clean`; a script that throws reads `did-not-run`; the Windows read against the
live service returns a verdict instead of `SERVICE_DESCRIBE_FAILED`. The live-workflow proof is the
seat's: name the exact dispatch the seat runs on the next cortex-api shift and the result it should
print. The check you ran on a fixture has not been observed working on the service until then.

### The three-question gate

Answer in your close: what executes the check after a shift, what triggers it, what fails when a tag
points at a revision missing a credential, whether that failure is distinguishable from the check not
running, and what bypasses it (a manual `gcloud run deploy --tag`, a shift done outside the workflow).

### Constraints

- No deploys, no workflow dispatches against production, no merges.
- P-324 (the pixel deploy) is the next cortex-api shift the seat expects; your change should land
  before it so that shift is the live proof.

### Close

Declare: the start commit and PR, the new exit-code table and marker, the Windows cause and fix, the
other steps found, the falsifiers with both directions shown, the dispatch the seat runs for the live
proof, the three-question gate answers, and `leave_behind`.
