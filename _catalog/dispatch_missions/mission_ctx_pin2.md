# CTX-PIN2 — the same seam, the second time today, plus the mechanism that would have caught it

Repo: `hauska-factory`. Two items. The pin bump is one line; the check is the point.

## Item 1 — the pin

`cloudbuild.publish.yaml` pins `_LDT_SHA: 7a739849`. LDT main is `9873ff11`, which is
CTX-LEAVES2 (PR #649) and carries three fixes the bake needs:

- `baseFacts.acreage` earned absence, closing a bare null on **291,231 of 1,516,110**
  baked cells across the six counties;
- `unmeasured` to `refused` at `verdictLayerServe.ts`, implementing
  `_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` at a call site where it
  had never been implemented;
- a `prop_id` shape guard against the `PRIVATE ROAD` class.

Four counties are held behind this: Bastrop and Travis fail their walks on the acreage
class, Williamson fails on both acreage and `unmeasured`, and McLennan is passing but
should be re-verified on the same image before production.

Bump it to `9873ff11`. Before you do:

1. Confirm LDT main is still exactly `9873ff11`, before pinning and again at close. If it
   has moved, STOP and report rather than pinning to a SHA nobody named. Never pin to
   `main`.
2. Write a pin comment in the file's established style saying what is being picked up and
   why. There are three such comments already; match them.
3. **Prove the change reaches the bake, do not assume it.** `Dockerfile.publish` copies
   only `/ldt/node_modules` and `/app/bakes`, and `/app/bakes` is an esbuild bundle over a
   26-module graph. CTX-PIN built and validated a tracer for exactly this and found that an
   earlier commit the integration seat claimed was urgent did **not** reach the bake at
   all. Re-run that tracer. Note CTX-PIN also found the entrypoint count is five, not the
   four an older comment claims.

## Item 2 — the check, and why the obvious version is worse than nothing

This is the second time today this seam has held up the same counties. The first time,
CTX-SITUS-SKIP merged, the pin stayed put, and Caldwell and McLennan both failed on a fix
that was merged and unreachable. The only mechanism holding it is a person noticing.

**Do not write a check that fails whenever the pin differs from LDT main.** The pin is
supposed to lag sometimes — you pin deliberately, and most LDT commits never touch the
bake. A check like that fires constantly, and a control that blocks work it was never meant
to reach teaches the fleet to use the bypass flag. That is the over-broad-control failure
`ENFORCEMENT.md` names specifically, and it is worse than the gap it closes.

**Write the meaning-shaped version instead**, using the tracer that already exists:

> If any commit between the pinned `_LDT_SHA` and LDT main touches a file **inside the
> bake's module graph**, fail. Otherwise pass.

Two independently derived inputs — the pin, and the graph — asked whether they agree. It
fires only when the divergence actually matters to the bake.

Decide deliberately whether it runs in CI or as a script, and say why in your close. A CI
job needs network access to reach LDT, which may or may not be available in that context;
if it is not, a script that a person or a job runs is honest and a CI check that silently
cannot reach the network is the dormant-mechanism failure. **Establish which, rather than
assuming CI works.**

Also add the shape guard CTX-PIN reported as absent: nothing validates `_LDT_SHA` is even a
real 40-character hex SHA. The deploy digest has a regex guard; the pin does not. A
malformed pin sails through.

## Verify by violating

The staleness check must be shown failing before it passes. Point it at a pin you know is
behind on a bake-graph file — `7a739849` against `9873ff11` is exactly that pair, since
CTX-LEAVES2 touches `nodeFacetBakeTier1Conformant.ts` — and show it fail. Then show it pass
at the new pin. Both outputs pasted literally, exit codes read from the process, not a
pipe.

Then show it **passing** on a divergence that does not touch the bake graph, so it is not
simply "pin differs from main" wearing a better name. If you cannot construct that case
from real history, say so and explain what you did instead.

The shape guard must reject a malformed value and admit a real SHA.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds from your merged main and runs the counties.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Do not touch any ceiling, `assertResidueWithinDeclaration`, the rail gate, or
`BP-CONTENT-01`.

Do not bump `cloudbuild.parcel-r5-zoning.yaml`'s `_LDT_SHA`. It is three commits stale and
that is a **false provenance label rather than a stale dependency** — the plain
`Dockerfile` never fetches LDT, so `LDT_SHA` there is `ARG` to `ENV` and nothing more.
Worth recording in your close as a follow-on; not worth changing in a lane that gates four
counties.

## Close contract

Standard lane close JSON, plus:

- The literal `gh api` output confirming LDT main at pin time and at close.
- The module-graph trace result for `9873ff11`, with the method stated.
- Where the staleness check runs, and the evidence that it can actually reach LDT there.
- All violation runs: check failing, check passing, check passing on a non-bake-graph
  divergence, guard rejecting and admitting.
- `leave_behind`.

Report the merge commit. Four counties are waiting on it.
