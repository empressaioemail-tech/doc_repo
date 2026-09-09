# CTX-PROV — one McLennan parcel fails on provenance and nobody has diagnosed it

Repo: `hauska-factory`. Scope is one parcel and one rule. It is small on purpose.

## The measurement

McLennan staging walk `4c3d0746`, 2026-09-09T16:39:51Z, on publish image
`sha256:ca82faf3` (jobs gen 32/33, LDT pin `3885efad`):

    pass = 181
    fail = 1     48309:103671   "facets lack conformant-v1 provenance per layer"

This is the only thing between McLennan and a clean staging walk. Every other failure
that county carried this morning cleared when the classifier fix reached the image; five
`zoning not-applicable missing basis` failures went away and this one did not.

It also survived the prior two runs unchanged: walks `9044f5cc` and `2019b91f` both graded
`pass=176 fail=6` with this same parcel and this same message among them. Three runs,
identical result, so it is not a transient and not a race.

## What has NOT been established, and the assumption you must not inherit

The retired planner recorded this in its own unverified-claims section:

> "McLennan's 48309:103671 BP-CONFORMANT-01 failure is the same class as Caldwell's
> 48055:1 (a roll-dropout on the old schema). Basis: PURE INFERENCE from the shared rule
> id. NEVER DIAGNOSED. McLennan has only ONE CAD vintage (2025), so it CANNOT have a
> roll-dropout population -- which means this inference is probably WRONG and this parcel
> needs its own diagnosis."

That self-correction is almost certainly right. McLennan holds a single vintage, so there
is no dropout population for this parcel to belong to. Start from nothing.

Note also that Caldwell's `48055:1` now presents as HTTP 422 while this one presents as a
provenance failure. Different symptoms. Do not assume one diagnosis covers both, and do
not coordinate with CTX-WALKRULE's conclusion; that lane owns the retirement grading and
this one owns this parcel.

## The work

1. Read the rule that emits "facets lack conformant-v1 provenance per layer". Write down
   exactly what it checks, per layer, and what shape satisfies it. That definition does
   not exist in writing anywhere and producing it is half the value of this lane.

2. Read what `48309:103671` actually serves. Fetch the served payload from the staging
   target the walk used (`https://smart-site-factory.vercel.app/site`) and read its
   provenance per layer against the rule from step 1. Name which layer or layers fail and
   what they carry instead.

3. Establish the mechanism. Candidates, none preferred:
   - the bake did not write provenance for this parcel on one or more layers
   - the bake wrote it and the serve strips or reshapes it, as happened with `envelope`
   - this parcel's row predates the conformant bake and was never re-baked
   - the parcel is degenerate in the underlying geometry, as `48055:1` turned out to be
   - the rule is wrong about what conformant provenance looks like

   State the one you chose and one you rejected, with evidence for both.

4. Establish the population. Is this one parcel, or is it the visible member of a class
   the cohort sampler happens to have drawn? Count how many McLennan rows fail the same
   provenance predicate. **This is the most important step.** One parcel is a curiosity;
   a class is a launch blocker, and the sampler biases toward low `prop_id` so a single
   surfaced failure is weak evidence of rarity.

   Run the same count for the other five counties (48021, 48055, 48209, 48453, 48491) so
   nobody has to ask later whether it is McLennan-specific.

5. If the fix is in this repo, make it, with the check observed failing before it passes.
   If the fix is in the bake, which lives in legacy-design-tools, or in the serve, do NOT
   write there. Report it with enough precision that a dispatch can be compiled from your
   close without a second diagnostic pass.

## Do not make it pass by exclusion

If your conclusion is that this parcel should not be graded, that is a named class with a
counting rule and an explicit justification, not a filter. The sampler bias toward low
`prop_id` was deliberately left in place by two prior lanes on the grounds that adjusting
a sampler to avoid a failure it correctly found is sampling around the problem. The same
logic applies to excluding a parcel from a grade.

Do not widen `BP-CONFORMANT-01`. If the rule is genuinely wrong about conformant
provenance, that is a finding with evidence, handed back, not a loosened predicate.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat owns every execution. Reading a served payload over HTTP is expected and is not an
execution.

Do not write to legacy-design-tools, hauska-engine or hauska-map.

Do not touch `cloudbuild.publish.yaml`'s `_LDT_SHA` pin.

Do not coordinate with or duplicate CTX-WALKRULE, which is live in a separate worktree on
`fix/ctx-walkrule-retired-grading` and owns retirement grading. If you find your fix
touches the same lines, stop and report the collision rather than resolving it yourself.

## Close contract

Standard lane close JSON, plus:

- The provenance rule written out: what it checks per layer, what satisfies it.
- What `48309:103671` actually serves, per layer, verbatim.
- The mechanism you chose, the one you rejected, and the evidence.
- The failing-population count for all six counties with its counting rule.
- If fixed here: both runs. If not: where the fix belongs, precisely enough to dispatch.
- `leave_behind`.
