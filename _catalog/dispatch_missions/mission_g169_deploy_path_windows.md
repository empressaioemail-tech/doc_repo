## Mission - G-169: `scripts/deploy.mjs` cannot spawn its own tools on Windows, so the deploy path is un-exercisable by its own file

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `plan-review` and `smart-files`. You write nothing
in `doc_repo` (hand any doc edit back as a diff, uncommitted) and nothing in any other repo.

**One PR per repo, branched from that repo's current `origin/main`.** The file is the same file in both
repos; if you find it has drifted, say so in your close rather than silently picking one.

### The state you are inheriting

On 2026-09-19 the planner executed G-160's owed deploy. It could not be run through this script. The
deploy path has, as far as any record shows, **never once executed on the fleet's own machine** - which
is why the row sat owed for a day while its self-tests and its CI were green.

`scripts/deploy.mjs` was written for this box and its header is careful about almost everything: it
refuses a dirty tree, resolves the commit from `git rev-parse HEAD` and never from a tag or a branch,
uses `--update-env-vars` rather than the replace form, passes the console `SERVED_COMMIT` at runtime,
and has deliberately no `--skip-gate` and no `--force`. It builds its argv arrays explicitly and says
why:

> No shell string is ever built, so a commit or a project name can never be re-split into another flag.

**That property is the reason for the defect.** The argv arrays are correct and the spawn is not.

### The mechanism, measured on this host

`issue()` is the only place the script runs a real tool:

    function issue(argv, label) {
      console.log(`  $ ${argv.join(" ")}`);
      try {
        execFileSync(argv[0], argv.slice(1), { cwd: REPO, stdio: "inherit" });
      } catch (err) {
        console.error(`\n${label} FAILED (exit ${err.status ?? "?"}). The deploy is NOT done: the gate never ran.`);
        process.exit(EXIT.GATE_FAILED);
      }
    }

`argv[0]` is `"gcloud"` or `"vercel"`. On Windows both names resolve to a `.cmd`/`.ps1` shim, and Node
cannot spawn either without a shell. Measured directly at 2026-09-19T12:24Z on this machine:

    execFileSync("gcloud",  ["--version"])                   ->  FAIL code=ENOENT
    execFileSync("gcloud.cmd", ["--version"])                ->  FAIL code=EINVAL
    execFileSync("gcloud",  ["--version"], {shell:true})     ->  OK   Google Cloud SDK 567.0.0
    execFileSync("vercel",  ["--version"], {shell:true})     ->  OK   54.20.1

`gcloud.cmd` failing with **EINVAL** rather than ENOENT is Node's `.cmd`/`.bat` spawn block, not a
missing file; there is no variant of the bare-name call that works.

**The failure concealed its own cause, and that is the second half of the defect.** `err.status` is
`null` on a spawn error rather than a process exit, so the message rendered as

    api      plan-review <- 4d3da57999c2208a48f32c22fa82a2c55cd7df4e
      $ gcloud run deploy plan-review --project plan-review-505715 ...
    the API deploy FAILED (exit ?). The deploy is NOT done: the gate never ran.

A reader cannot tell a missing executable from a crash, a permission failure or a non-zero exit. Name
the failure kind in the message: a spawn error and a process exit are different events and must not
render identically.

**`served-commit-parity.mjs` is not affected and must not be touched.** It invokes through a bounded
shell string, which is exactly why the gate can pass its self-tests and its CI while the other half of
the same deliverable had never run. If you "fix" the gate you have moved the defect, not removed it.

### What the repair must achieve, and the trap

**The end state: on a Windows host, the same spawn path `issue()` uses actually runs a real tool, and
the argv-array property survives.** The trap is that the obvious one-word fix - adding `{shell: true}`
- silently discards the property the header exists to protect. With a shell, `argv` is concatenated
rather than passed, so a commit, a project name or a service name containing a space, a quote or a
semicolon can be re-split into additional flags. Node even warns about it (`DEP0190`).

Choose one of these and say which you chose and why:

- **Resolve the executable explicitly** rather than relying on a PATH shim, so the array stays an
  array. `gcloud.cmd` cannot be spawned directly, but the `.cmd` can be run through `cmd.exe` with the
  arguments still passed as an array, or the underlying executable can be located and called directly.
  This keeps the property at full strength.
- **Keep a shell, and earn it.** Assert every value against the pattern it must match before it reaches
  the shell: the commit against `^[0-9a-f]{7,40}$`, the service and project and Vercel project against
  their allowed character set. Refuse on a mismatch. This is weaker than the array, and it is only
  acceptable because the values are already constrained - so the assertion must be a real refusal, not
  a comment claiming the values are safe.

**Do not** weaken the clean-tree refusal, the commit resolution, the `--update-env-vars` merge, the
gate, or the absence of a bypass flag. **Do not** add a `--force`, a `--skip-gate`, or a `--no-verify`.

### How the fix is proven, and what does not count

**A `--dry-run` passing is not evidence and must not be offered as any.** The dry-run resolves the
commit and prints the plan; it never reaches `issue()` at all, which is precisely how this defect
survived. A green dry-run on a broken spawn is the same shape as a green check about the wrong surface.

Two things must be shown, and the first is the one that matters:

1. **The spawn path works against the real CLIs, end to end, on this host.** Call the same mechanism
   `issue()` uses - factor it out if you must, so the proof exercises the shipped code and not a
   paraphrase - and run a real, read-only command through it: `gcloud run services describe` against a
   real service, and a read-only `vercel` command. Show the exit code and the actual output. **This
   proves the mechanism without deploying anything.** A read-only command through the real spawn path
   is the whole falsifier; you do not need to shift traffic to prove the spawn works.
2. **The instrument can fail.** A self-test wired into the product's own test command, in the style
   this repo already uses for `served-commit-parity.mjs --self-test`, which spawns a tool that exists
   (must succeed with real output) and a tool that does not (must fail with a NAMED reason, not a
   silent pass and not a bare `exit ?`). Verify it by violation: revert the spawn to the bare-name
   call, confirm the self-test FAILS, restore, confirm it passes. Report both runs.

**Do not deploy production to prove this.** The next real deploy is the true end-to-end proof and it is
not yours to take; your proof is that the spawn path is exercised and named. Shifting traffic without a
P-170 lease is a contract violation and this row is not an exception to it.

### Scope, traps, and what is already known

- **Both repos carry the file.** Fix both, one PR each, from each repo's `origin/main`.
- **The deploy will still be run by hand until this lands.** Do not imply in your close that the fleet
  is now deploying through the script; it is not, until a real deploy uses it.
- **Do not widen this into a deploy-path rewrite.** The gate, the parity check, the lease law and the
  sequencing are out of scope. This row is one spawn mechanism and one error message.
- **The error message is part of the deliverable.** `FAILED (exit ?)` must become a message that says
  whether the tool could not be spawned, what was being run, and what to check. A spawn failure and a
  non-zero exit must be distinguishable in the output.
- `_catalog/leases/` holds only its README; there is no lease in flight and none is needed for this row.
- **Do not edit `_catalog/lane_claims.json`, the plan of record, or any `_inbox` close.** Those are
  planner-owned here.

### Evidence to hand back

- Both PRs, each on its repo's `origin/main`, with the spawn-path proof and the self-test proof.
- The verbatim `--self-test` output in BOTH directions: passing on the fix, and failing when the spawn
  is reverted to the bare-name call.
- The verbatim output of the read-only real-CLI commands run through the shipped spawn mechanism.
- `leave_behind` per the contract: anything you touch that outlives your session, with an owner and a
  plan row, or `none`. **Two detached deploy worktrees are already sitting on disk from the planner's
  run - `P:/plan-review-worktrees/planner-g160-deploy` and `P:/smart-files-worktrees/planner-g160-deploy`
  - and they are G-160's, not yours. Do not reuse, delete or write in them.**
