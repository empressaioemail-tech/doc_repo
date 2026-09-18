## Mission — G-155: build the Smart Files design, in its own repo and in parallel

You launch no sub-agents (FAN-DEPTH 0). You own `smart-files` for this row. You do not touch
`smartcity-dashboards`, which is running a serial queue of its own. You fix your own failed deploys
rather than escalating them.

Read the G-155 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md`, then
`_design/smart-files/README.md` in full.

### Why you run in parallel

`smart-files` is a separate repo with its own GCP project, `smart-files-505619`, and it is not among
OPS-25's six migration services. You are not gated on the DigitalOcean cutover and you do not collide
with the dashboards queue. The dashboards nav item called Files is a MOUNT POINT and says so on the
design; you build the product it mounts, not the mount.

### What this is

`_design/smart-files/`, RATIFIED 2026-09-17, carrying a `check.mjs`. Drawn against `smart-files`
`origin/main` `61c84f61`, **which is still `main` as of 2026-09-18T00:50Z**, so the design and the
code agree on a ref. Re-read it before you branch; if `main` has moved, say what moved.

**Not a file browser, and the design refuses that vocabulary.** Searchability with three named
reasons; revision, not sibling; five-key provenance that REFUSES the write when a key is missing; and
placement. The governing stance is COVERAGE BEFORE RESULTS: the surface says what it has searched
before it says what it found.

### Acceptance items, each verified by violating it

**Five-key provenance refuses an incomplete write.** It does not default a missing key. Remove each
key in turn and confirm the write is refused, not accepted with a placeholder. A defaulted key is the
fail-closed violation this design exists to prevent.

**Revision, not sibling.** A new version of a file is a revision of the same thing, not a second file
beside it. Prove both paths.

**No file-browser vocabulary where the design forbids it.** Checked as a file, not by eye.

**`node _design/smart-files/check.mjs` passes with a NON-ZERO matched-input count.** This one is
mandatory specifically here, because **this folder is the precedent**: a predicate in it once
self-tested perfectly and matched nothing on any board. A check that matches nothing reports success
and proves nothing. Report the count, and verify the check fails against a planted violation in both
directions.

### Explicitly NOT this row

**G-141, the link ingest.** "Drop any link, Google Drive or OneDrive, into one database" was described
to the customer on the Jaime call as a capability, and it has NO server path: zero hits for
`googleapis`, `oauth`, `drive`, `onedrive` or `sharepoint` across `src/` and `package.json`, and the
only ingest requires `bytesBase64`. That is an absent path, not a partial one, and it stays G-141's.
**Do not let this build quietly imply it exists**, for instance with an import affordance that has
nothing behind it.

Also out: anything in `smartcity-dashboards`, RBAC, and any DigitalOcean work.

### Where it goes

You may ship this one, by the canary path, because it is not in the RBAC question and not gated on
the migration.

**`smart-files` traffic is PINNED BY REVISION NAME.** Read 2026-09-18T00:50Z: `smart-files-00013-ruq`
at 100%, `latestRevision=false`, tag `search-wave`, zero Cloud Build triggers. A plain
`gcloud run deploy` will come up `Ready=True`/`Active=False` while `gcloud` reports the OLD revision
as serving 100 percent and calls it a success. Its message is true of the old revision and conceals
the no-op. Use `--no-traffic --tag`, verify on the tag URL, then `update-traffic`.

**Read the traffic spec by JSON field name**, never through a positional
`--format="value(a,b,c)"` formatter, which aligns by semicolons and shifts every column after a blank
field. That exact misread reported the wrong serving revision to the operator twice.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.
**File CP1, CP2 and the close**; a lane this week shipped good work and filed none, and its gates now
have no record.

Your close records: the merge commit; each acceptance item's violation in both directions; the
`check.mjs` matched-input count; the tag-URL verification; and the serving revision after the shift,
read by JSON field name, verbatim.

State your snapshot in your first output: repository, branch, commit.
