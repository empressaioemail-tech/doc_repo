## Mission — P-273 and P-274: four controls that cannot fail, and P-195's three leftovers

You launch no sub-agents (FAN-DEPTH 0). You may open ONE PR per repo in `hauska-factory`,
`hauska-engine` and `legacy-design-tools`. You do not merge and you do not deploy. Every claim in
this lane is proven by violation: a control you report as working must be observed FAILING first.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` into NEW directories, branch
`fix/p273-p274-controls`: factory (main `d2e6cb03`), engine (main `3809275f`), LDT (main
`7219b707`) at compile. Register each under the property seat and remove the entries at close.

**Open lanes to stay clear of.** An engine lane (P-260/P-263) holds `packages/adapters/src/local/
setbacks/**` and the envelope writers. A card lane holds LDT `artifacts/api-server/src/lib/
buildableEnvelope/**` and the map card. P-318 holds map workflows. If a dead control lives in a file
another lane holds, say so in the close and leave it.

### Row P-273 — the four controls from the 2026-09-13 ranked card

Each is a control that reports success and enforces nothing:
1. an edge-starvation self-compare (a check that compares a value with itself);
2. a lookup key used as proof;
3. a registry that is validated and then ignored;
4. a CI step that is tautological.

**Done:** each one is either made able to fail, or retired with a written reason, and the proof is a
recorded violation: the control fires on a deliberately broken input, and the run that proves it is
quoted. A control you cannot reach from a test is dormant and must be named as such.

### Row P-274 — P-195's three leftovers, in hauska-factory

- **F26:** a never-acquired county grades 1 of 65 rails. Done: an unacquired county cannot report a
  passing rail; it reports UNMEASURED with its reason.
- **F28:** 160 of 391 excluded cells were never audited. Re-measure AFTER P-252 (live since
  2026-09-16) and classify every exclusion, or name the ones that have no ruling.
- **F29:** the walk image was older than the gate image. **Re-measure before you touch anything:**
  as of 2026-09-17 the publish and verify-walk jobs run `9760ff71` (factory `d2e6cb03`, built
  18:0xZ) while the gate scheduler runs `28066cef` (factory `1fa850e7`, built 17:4xZ), so the walk
  is currently NEWER. The row is about the CLASS, not that instance: what stops the pair drifting
  again, and what fails when it does.

### Falsifiers — pre-register your predictions before building

1. For each of the four controls: the control passes today on an input that should fail it (the
   defect, reproduced), and fails on that same input after the change.
2. F26: a fixture county with no acquisition grades zero passing rails and reports UNMEASURED.
3. F28: the audited count plus the unruled count equals 391, with no cell in two classes.
4. F29: a fixture with a gate image newer than the walk image fails the new check, and today's real
   pair passes it.

### Do not

- Merge, deploy, or write any store.
- Weaken a control to make it pass, or retire one without a written reason.
- Touch the files the open lanes hold (listed above).
- Launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; per
control: what it claimed, the input that should have failed it, the observed pre-change pass, and
the observed post-change failure; F26/F28/F29 each with its measurement; the falsifiers with
evidence. `status`: `closed-partial` until the integration seat merges and the checks run in CI.
`probe`: `{"notApplicable": "controls lane; graded by each control firing in its own venue"}`.
`subAgents`. `leave_behind`.
