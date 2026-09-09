# CTX-BUILD — the bake is behind the serve, and a live job's only build config is untracked

Three items in `hauska-factory`. They are one lane because they all gate the same
thing: a publish image that can be trusted to bake what the serve projects.

## Context you need and must not take on my word

The outgoing CTX planner was retired 2026-09-09. Its close is
`_inbox/2026-09-09_ctx_planner_retirement_close.json` and its section 8 lists eleven
claims it believed but did not measure. Read that section before you start. The
integration seat has since resolved three of them by direct measurement; the rest
stand as unverified.

Do not treat any number in this mission as established. Re-measure each one and
report agreement or disagreement. Disagreement is a finding, not a failure.

## Item 1 — rescue the orphaned build config

`cloudbuild.parcel-r5-zoning.yaml` is an untracked file in the worktree
`P:/tmp/ctx-w2-gate` (branch `work/bake`, which belongs to another registration and
which you must NOT check out or modify). It is the only copy of the Cloud Build config
that created and deploys the Cloud Run job `factory-parcel-r5-zoning`.

Verified by the integration seat 2026-09-09: that job is live in
`hauska-prod-497015` / `us-east4` at generation 1, image digest
`sha256:795e0e78bc078c2b`, from Cloud Build `64450772` at `2026-09-09T05:22:01Z`.
Nothing in any repo can currently rebuild or audit it.

Copy that file into your own worktree and commit it. Read it first; do not transcribe
it from anything but the file itself. It is 85 lines and its header explains why it
exists.

Verify by violating: before you commit, confirm the file is absent from `origin/main`
(`git cat-file -e origin/main:cloudbuild.parcel-r5-zoning.yaml` must fail). After the
merge, confirm it is present. If it turns out to already be tracked, stop and report
that, because it would mean the retirement close was wrong about the most important
item in it.

## Item 2 — the publish pin is three commits behind, and the bake is behind the serve

`cloudbuild.publish.yaml` pins `_LDT_SHA: 301bb75ac3f287a424d859dfa86e6d4e89b75529`.

Measured by the integration seat 2026-09-09 against the GitHub API, not from a doc:
legacy-design-tools `main` is `3885efadb789942a479b475d34d1518807756e0a` with nothing
ahead of it, and `301bb75a...3885efad` is `ahead_by=3`:

    3c3c243d  2026-09-09T01:18:59Z  fix(deploy): Smart Site MCP export env vars survive redeploy (#645)
    69de8fe6  2026-09-09T04:38:37Z  fix(zoning): project the rail's own refused state, not the generic fallback (#646)
    3885efad  2026-09-09T13:13:58Z  fix(P-124/CTX-retire): declared record retirement for an account absent from the current CAD roll (#647)

Two of those matter and the second one is the reason this is urgent rather than tidy.

`69de8fe6` is CTX-MIRROR. Production `cortex-api-00754-feg` is ALREADY built from it.
So the serve projects the rail's own refused state while the bake, pinned to
`301bb75a`, does not write it. **The bake is behind the serve on the exact field the
zoning walk grades.** Any BP-CONTENT-01 result taken on the current pin is measured
with a bake and a serve that disagree.

`3885efad` is CTX-RETIRE, which adds `recordRetirement` to
`nodeFacetBakeTier1Conformant.ts`. The integration seat confirmed `recordRetirement`
appears zero times in hauska-factory `main` at `004236d2`, which is expected because
it lives in LDT and reaches the image only through this pin.

Bump the pin to `3885efad`. Before you do:

1. Confirm LDT `main` is still exactly `3885efad`. If it has moved, STOP and report
   rather than pinning to a SHA nobody named. Do not pin to `main`.
2. Read what each of the three commits changes. Pin comments in this file are
   substantial by convention; write one that says what is being picked up and why,
   in the style of the two comments already there.
3. State explicitly in your CP2 whether `3c3c243d` (the smartsite-mcp env fix) has any
   effect on the bake. The integration seat believes it does not and that belief is
   UNVERIFIED.

## Item 3 — the reachability instrument, named by the repo's own file

The header of `cloudbuild.parcel-r5-zoning.yaml` names this and it is the third
distinct layer of the same class this program keeps hitting:

> `test/writer-cli-reachability.test.mjs` asserts every allowlisted writer has a
> `cmd === "<id>"` branch in `cli.mjs`, which this job HAS. Having a CLI command and
> having somewhere to execute it are different questions, and only the first is
> checked.

Add the second check. A writer that is allowlisted and CLI-dispatchable must also have
a deployable target: a `cloudbuild.*.yaml` that deploys a Cloud Run job for it, or an
explicit declared exemption with a reason.

This must FAIL before it passes. Demonstrate it by removing (in your working tree only,
not committed) the config for a writer that has one, showing the test go red, and
restoring it. Paste both outputs. A test observed only passing has not been observed
working.

Do not make it pass by widening the allowlist. If a writer genuinely has no deployable
target and should not have one, that is a declared exemption with a written reason, and
the count of exemptions goes in your close.

## What you must NOT do

Do not run any Cloud Run job. Do not submit any Cloud Build. Do not deploy anything.
Do not run a bake, a walk, or a publish. The integration seat owns every execution and
deploy on this program and will rebuild the image from your merged main.

Do not touch `P:/tmp/ctx-w2-gate`. Read the file out of it if you must, but never check
out a branch there, never commit there, and never delete its untracked files. Three of
them are debris (`_cty.mjs`, `_shapes.mjs`, `_sz.mjs`) and are not yours to clean.

Do not write to legacy-design-tools, hauska-engine, or hauska-map.

## Close contract

Standard lane close JSON at the auto-named path. In addition to the usual sections:

- The before/after `git cat-file` proof for item 1.
- The literal `gh api` output you used to confirm LDT main for item 2, not a summary.
- Both the failing and passing runs of the new instrument for item 3.
- Any disagreement with a number in this mission, stated plainly.
- `leave_behind`, including the count of declared exemptions from item 3.

Report the merge commit. The integration seat rebuilds and runs the counties from it.
