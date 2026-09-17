## Mission — G-150: build the ratified reasoner path, the plan review design a city is shown

You launch no sub-agents (FAN-DEPTH 0). You own `plan-review`. You do not touch
`smartcity-dashboards`, which belongs to D-12 and G-149. You fix your own failed deploys rather than
escalating them.

Read `_design/plan-review-reasoner/README.md` in full before anything else, including its
corrections section. Then read `_decisions/2026-09-15_plan_review_reasoner_is_the_shown_design.md`.

### What this is, and the framing that governs every decision

Plan review is a **companion product, not a plan review system** (operator ruling 2026-09-15). No
markup, no batch stamping, no measurement tools, no document workflow. The category leaders
(Avolve/ProjectDox, DigEplan, GeoCivix, Bluebeam, and CodeComply.Ai inside CivicPlus) are document
workflow products where the reviewer brings the code knowledge. We are not early to AI plan review
and cannot out-distribute that channel. What their published material does not carry is any accuracy
figure, confidence metric or liability posture. **That flank is what this design is built on**, so
anything that dilutes provenance, confidence or honest absence is dropping the only advantage.

RATIFIED 2026-09-15, and ruled the same day to be the plan review design a city is shown. Five
artboards: the console, one finding's derivation, coverage, the correction notice, cycle 2.

### This row is NOT gated on the DigitalOcean migration

Operator confirmed 2026-09-17: `plan-review` stays on GCP for now. It is not among OPS-25's six
services, it is outside the DigitalOcean-to-GitHub connection scope, and it runs in its own GCP
project `plan-review-505715`. It migrates later under its own D-row. You run in parallel with D-12.

### The design's own corrections are ACCEPTANCE ITEMS, not notes

Each one below is a defect that shipped once already, in the draft. The first draft's central thesis
was false and was asserted as fact while quoting the code that contradicted it in the same comment
block. The planner's note on that is worth carrying: *the result was a satisfying insight, so it was
not interrogated.* Build each of these as a requirement and verify each as a check.

**One adjudicator exists.** `adjudication.mjs`, `adjudicateMinimumSetback`, for the front setback.
Every other rule renders badged `NO ADJUDICATOR`. Showing five adjudications that have no code path
is the defect that was caught; do not reintroduce it.

**`adjudicated: null` renders `Unchecked`, never `Pass`.** Permitted use was drawn as Pass where
source sets null. Absent and passing are different states.

**`Uncertain` is not machine-derived.** No code path emits it. It requires a named reviewer override
with a written reason. Do not let any inference path produce it.

**No invented section identifiers.** Section `14-02-005` does not exist and was cited six times in
the draft, once inside an issued letter. Section numbers use dashes where source uses dashes, not
dots. The book is **"City of Bastrop Building Block B3"**, not "Bastrop Development Code".

**No paraphrasing a code where `quotable === false`.** The draft paraphrased IBC on the same canvas
as a panel promising it would never paraphrase a code the product is not licensed to quote
(`IBC2018P6.quotable === false`). That contradiction must not survive.

**The provenance ladder is the product.** The one proposed dimension that exists in the service is a
number a human typed on a form (`web/app.js:462`, "Proposed front setback (ft), if known", posted as
`proposedSetbackFrontFt`, persisted as `proposed_setback_front_ft`, fed to the adjudicator at
`mcp.mjs:308`). It has no source, no sheet, no location. The viewer does not unlock the
determination; it upgrades the input from an assertion to a reading. Build that distinction
visibly.

### Deliver the design's instrument, which does not exist today

`_design/plan-review-reasoner/check.mjs` is an R3 finding on `scripts/govtech/design-completion-gate.mjs`
right now: RATIFIED with no adversarial read as a file. The operator ruled 2026-09-17 that each build
row delivers its own design's instrument rather than waiting on G-148, so that no build runs against
a design nobody checked against source.

It must: self-test in both directions; abort rather than returning a verdict it cannot support;
report a **non-zero matched-input count**; and be verified by violating it against a real artboard.
The precedent that makes the matched-input count mandatory is Smart Files, where a predicate
self-tested perfectly and matched nothing on any board. A check observed only passing has not been
observed working.

Follow the pattern in `_design/smartcity-police-lens/` (`check.mjs` plus `violate.mjs`), which is the
strongest example in the folder.

### Gates

**GATE 1 — verify each acceptance item by violating it.** For every rule in the list above, plant the
violation on a real artboard and confirm the check fails, then remove it and confirm the check
passes. Report both directions. A check that has only been seen passing is not evidence.

**GATE 2 — prove the `NO ADJUDICATOR` badge the wrong way.** The badge is a claim about source, so it
becomes a false negative the moment a second adjudicator ships. Add a second adjudicator fixture,
confirm the badge correctly disappears for that rule, then remove it. This is the one acceptance item
whose failure mode is silent.

**GATE 3 — no identifier on any surface that is absent from source.** Check this as a file, not by
eye. Extract every section identifier and code title rendered anywhere in the built surface and
confirm each exists in source. This is the check that would have caught `14-02-005` six times.

**GATE 4 — verify the deployed surface by JSON field name.** `plan-review`'s Cloud Run traffic is
**pinned by revision name** to `plan-review-00025-ley` with `latestRevision=false` (read
2026-09-17T21:4xZ, project `plan-review-505715`, us-east1). A plain `gcloud run deploy` will come up
`Ready=True`/`Active=False` while `gcloud` reports the OLD revision as serving 100 percent of traffic
and calls it a success. Its message is true of the old revision and conceals the no-op. Use the
canary path: `--no-traffic --tag`, verify on the tag URL, then `update-traffic`. Read the traffic
spec by field name, never through a positional `--format="value(...)"` formatter, which aligns by
semicolons and shifts every column after a blank field.

### Out of scope, explicitly

The plan-review console design (`_design/plan-review/`) and the departments design
(`_design/plan-review-departments/`) are both superseded or blocked and are not this row.
Departmental parallel review is G-144 and its role-gate amendment is DEFERRED, so do not build any
path that lets a department other than Development services reach the surface. The
`smartcity-dashboards` repo, which is D-12 and G-149. Any DigitalOcean work.

The Bastrop row being labelled SF-1 for every parcel is a real defect in `plan-review`'s deterministic
checklist. It is NOT in this row's scope. If you confirm it, record it in your close as a leave-behind
with a named owner rather than fixing it here.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.

Your close records: both directions of every GATE 1 violation, named per acceptance item; the GATE 2
second-adjudicator result; the GATE 3 identifier extraction with its matched-input count; the
`check.mjs` matched-input count on the real boards; and the serving revision read by JSON field name
after the traffic shift, with the tag URL verification that preceded it.

State your snapshot in your first output: repository, branch, commit.
