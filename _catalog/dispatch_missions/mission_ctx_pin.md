# CTX-PIN — the fix for 18,037 rows is merged and reaches no image

Repo: `hauska-factory`. One line of substance. The verification is the work.

## The gap

CTX-SITUS-SKIP merged to `legacy-design-tools` main as `7a739849` on eleven green
check-runs. `cloudbuild.publish.yaml` pins `_LDT_SHA: 3885efad`, which is exactly one
commit behind:

    3885efad ... main   ahead_by = 1
    7a739849   2026-09-09T18:36:49Z   fix(P-124/CTX-situs-skip): write an on-roll
                                      punctuation-only situs with an earned absence,
                                      never skip the row (#648)

That commit is the fix for 18,037 rows across three counties — Bastrop 16,104,
McLennan 1,165, Hays 768 — and it currently reaches no image. Caldwell's `48055:1`
(HTTP 422, `SITUS_PUNCTUATION_ONLY`) and McLennan's `48309:103671` are both blocked on
it.

## The work

Bump `_LDT_SHA` to LDT main.

1. **Confirm LDT main is still `7a739849` before pinning, and again at close.** If it has
   moved, STOP and report rather than pinning to a SHA nobody named. Never pin to `main`.

2. **Read what the commit changes.** Pin comments in this file are substantial by
   convention and there are two already; write one in the same style saying what is being
   picked up and why. The relevant change is in
   `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts`: an on-roll account whose
   CAD `situsAddress` is punctuation-only is now written with an earned absence on the
   situs leaf instead of being `continue`d past before any database write.

3. **Prove it reaches the bake. This is the actual mission and it is not ceremony.**

   The last pin bump carried a claim from the integration seat that `69de8fe6` was urgent
   because the bake was behind the serve. CTX-BUILD measured that and found it false:
   `Dockerfile.publish` copies only `/ldt/node_modules` and `/app/bakes`, and `/app/bakes`
   is an esbuild bundle of four entrypoints over a 26-module graph that contained neither
   file that commit touched. **The publish image's LDT content is not the LDT checkout.**

   `nodeFacetBakeTier1ConformantCli.ts` is a bake entrypoint, so this one very likely does
   reach it — but "very likely" is what was said last time. Establish it the same way
   CTX-BUILD did: trace the module graph, not the file list. State the method and the
   result.

   If it does NOT reach the bake, that is a much larger finding than a pin bump and it
   outranks everything else in this lane.

## Verify by violating

Confirm the pin you write is a real 40-character SHA and that a malformed value would be
caught. The publish config already refuses a deploy pin that is not digest-shaped; check
whether anything similarly guards `_LDT_SHA`, and if nothing does, say so rather than
adding a guard unasked.

## What you must NOT do

Do not touch any ceiling. CTX-CEILING is live in a separate worktree on
`fix/ctx-ceiling-bastrop-declaration` and owns `zoning-layer-completeness.mjs`. You are in
`cloudbuild.publish.yaml`. If your change appears to require touching theirs, STOP and
report the collision rather than resolving it.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the image from your merged main and runs the counties.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

## Close contract

Standard lane close JSON, plus:

- The literal `gh api` output confirming LDT main at pin time and at close, not a summary.
- What the commit changes, in your own words after reading it.
- **The module-graph trace showing whether the change reaches `/app/bakes`, with the
  method stated.** This is the deliverable.
- Whether anything guards `_LDT_SHA`'s shape.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds from it together with CTX-CEILING
and then runs all six counties on one image.
