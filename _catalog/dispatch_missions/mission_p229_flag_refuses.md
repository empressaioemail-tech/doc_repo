## Mission — P-229: a write-scoping flag that is accepted and silently discarded

### The finding you are acting on

On 2026-09-15 the operator authorised a production write "county-scoped to 48209 only" and
the P-211 lane ran `parcel-envelope-cells --apply --county=48209`. It wrote 107,544 cells and
the write was correct.

**The deployed job image does not contain the `--county` flag at all.** Digest
`ec2cd3bff4f3838768db5a896bd8cee0cf9d70a48f4db0e4b9bd1ec798e1643a`, generation 4. The flag
was accepted on the command line and silently discarded. Hays-only scoping was achieved
entirely by the pre-existing unaccounted-only write gate — the same mechanism P-200 relied on
— **not** by the control the operator believed was bounding the write.

The P-211 lane found this and reported it against its own interest. Read its close
(`_inbox/2026-09-15_p211-six-county-circle-back_close.json`, member 1
`caveat_undeployedFix`) before you start.

**Why this is a row and not a footnote.** The write landed correctly, so nothing complained.
A control that is accepted, does nothing, and produces no symptom is the exact defect class
ENFORCEMENT.md exists to catch: it passes review and answers "do we have county scoping"
affirmatively. And it is a live footgun — the next seat who runs this job with `--county` on
a county whose cells are NOT already unaccounted will believe the write is bounded, and it
will not be. The only thing that saved this run was an unrelated gate.

### What the fix is NOT

**Merging PR #153 is not the fix.** That PR adds a working `--county` flag to both writer
jobs (55/55 tests green) and it is real work. But a flag that works is not a flag that
refuses when it is not understood. If the image ever drifts behind the caller again — which
is exactly what happened here — a merged-and-working flag returns to being silently
discarded. **Do not close this row by merging #153.**

### Done looks like

An unknown, misspelled, or unconsumed flag on `parcel-envelope-cells` and
`parcel-setback-cells` causes the job to **exit non-zero and write nothing**, rather than run
with the flag ignored. Both jobs. Argument parsing that accepts anything it does not
understand is the defect; strict parsing is the fix.

`--county` itself must also validate: a county FIPS the job has no business writing, or a
malformed one, refuses before any write.

### Falsifiers, pre-register your answers before you run anything

1. Pass `--county=99999` (a FIPS that does not exist). If the job runs and writes anything,
   you have not fixed it.
2. Pass a bogus flag name, e.g. `--countyy=48209` or `--not-a-flag`. If the job runs at all,
   you have not fixed it — this is the exact shape of the original defect, since `--county`
   on the deployed image WAS a bogus flag name from the parser's point of view.
3. Pass a valid `--county` and confirm the job still does the correct, bounded thing. A
   refusal that refuses everything is not a fix either.
4. **Run 1 and 2 against the CURRENT deployed image first and record that they pass silently.**
   That is your before-state and it is the proof the defect is real, not inferred.

### Known traps

- **The deployed digest is the authority, not the branch.** The image a job runs is its
  digest, never the tag that was requested and never what `main` contains. Read the job's
  deployed digest and say what it is.
- **Do not weaken the unaccounted-only write gate** while you are in here. It is the thing
  that actually saved the P-211 apply, and it is load-bearing until this row ships.
- A control verified by violation generates events that look like the ones being counted.
  Note and exclude your own test invocations explicitly.

### Do not

- **Do not merge PR #153, and do not merge your own branch.** Merging to `main` in this repo
  AUTO-REDEPLOYS both Cloud Run job images, which is a production deploy. Open the PR, get it
  green, and hand it back. The integration seat owns the merge and the deploy.
- Do not deploy anything.
- Do not run any `--apply` against a production store.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name the deployed digest you measured the before-state against, and the digest that will
carry the fix once it ships (or state that it is not built yet). Close to `_inbox/` on
doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if it is `none`. State
your snapshot (repo, branch, commit).
