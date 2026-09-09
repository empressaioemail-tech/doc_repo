# CTX-ORPHANS — three live jobs nothing can rebuild, and six writers with nowhere to run

Repo: `hauska-factory`. This is not on the launch path. It is the debt CTX-BUILD
surfaced while doing something else, and it only gets more expensive.

## What CTX-BUILD established, and it is the whole premise

CTX-BUILD merged as `0c4c1ea6` (PR #118). Read
`_inbox/2026-09-09_ctx-build_close.json` first.

While adding an instrument that requires every allowlisted writer to have a deployable
target, it found two populations. Neither is a hypothetical.

**Three live Cloud Run jobs that no config anywhere can rebuild.**

    factory-bake-migrate
    factory-console-audit
    factory-landing-import

These are the same class as `cloudbuild.parcel-r5-zoning.yaml`, which CTX-BUILD rescued
in the same PR, except that one had a rescuable file sitting untracked in a worktree.
These have nothing. If any of them needs a change, or an image rebuild for a base-image
CVE, or simply falls over, there is no record of how it was deployed. The flags,
secrets, timeouts and args exist only in the live job spec.

Note the negative control CTX-BUILD already ran: `factory-atoms-cad` initially read the
same way and is NOT an orphan, because hauska-engine's tracked config deploys it. Do not
assume a job is orphaned because this repo lacks its config. Check the other repos first.

**Six allowlisted writers with no deployable target.** Twenty identifiable allowlisted
writers, minus three already quarantined, leaves twenty; six of those have no Cloud Run
job and no build config. CTX-BUILD declared zero exemptions for them, deliberately,
because every one refuses `--apply` unless `FACTORY_CLOUD=1` and no job exists for any of
them. So each is dispatchable and undeployable at the same time, which is exactly the
`parcel-r5-zoning` shape. They are pinned as quarantined open defects, not dispensations.
The allowlist was not widened and must not be.

## The work

1. For each of the three orphan jobs, reconstruct a build config from the live job spec
   read by field, not from memory and not from a similar job's config. Capture image,
   command, args, task timeout, max retries, memory, cpu, every secret binding and every
   plain env var. `gcloud run jobs describe --format=json` parsed by field name. Never a
   positional `--format=value(a,b,c)`, which shifts every column after a blank field and
   has produced two wrong reports to the operator in this program.

2. **Reconstruction risk is the reason this is a lane and not a chore.** A config that
   drops one flag looks correct and deploys a subtly different job. So for each one,
   state explicitly what you could NOT recover from the live spec, if anything, and
   whether the reconstructed config would produce an identical job. If you cannot
   establish identity, say so and leave the config marked as unverified rather than
   presenting it as a rebuild path.

3. Do NOT deploy any reconstructed config. Committing it is the deliverable. The
   integration seat decides whether and when to prove it by running.

4. For the six undeployable writers: give each one a disposition. Either it needs a
   deployable target built, or it should be retired, or it is genuinely quarantined
   pending something nameable. A writer that is dispatchable and undeployable forever is
   not a state; it is a defect with no owner. Name the owner and the plan row for each.

5. Confirm the instrument CTX-BUILD added actually covers the orphan-job class, or does
   not. Its check is that an allowlisted writer has a deployable target. The three orphan
   jobs are the inverse case: a deployed job with no config. State plainly whether
   anything would catch a new instance of that inverse, and if nothing would, that is a
   finding and probably a second instrument.

## Verify by violating

Whatever you add, show it failing before you show it passing, with both outputs pasted
literally and exit codes read from the process rather than from a pipe. A check observed
only passing has not been observed working. CTX-BUILD did this correctly by removing
`cloudbuild.building-footprint-reconcile.yaml` from its working tree only; follow that
pattern and restore with a hash check.

## What you must NOT do

Do not deploy anything. Do not run any Cloud Run job. Do not submit any Cloud Build. Do
not run a bake, publish or walk.

Do not widen the writer allowlist to make anything pass.

Do not delete or retire a live job. If your conclusion is that one should be retired,
that is a recommendation handed back, and retirement is proven by decline with a CI check
that fails if the path reappears, never by deletion first.

Do not write to hauska-engine, legacy-design-tools or hauska-map.

## Close contract

Standard lane close JSON, plus:

- One reconstructed config per orphan job, committed, each carrying an explicit statement
  of what could not be recovered and whether identity is established.
- The six writers with a disposition, owner and plan row each.
- Whether anything catches the deployed-job-with-no-config inverse, and if not, what
  would.
- Both runs of any check you add.
- `leave_behind`.
