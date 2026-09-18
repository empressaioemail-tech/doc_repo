## Mission - G-148: instrument the four designs that were ratified without an adversarial read

You launch no sub-agents (FAN-DEPTH 0). You work in `P:\doc_repo` only. No product repo is written.
`doc_repo` commits are planner-owned: leave your edits uncommitted and list the paths in your close.

### Why this row exists

The rule that no design is shown or ratified without an instrument was earned on 2026-09-15 and **was
never applied backwards**. That makes it the same shape as every other control in this repo that was
correct and enforced nothing. Four designs are past DRAFT today and carry no `check.mjs`, so they were
shown, and in three cases RATIFIED, without an adversarial read:

| Design | Status |
|---|---|
| `plan-review-departments` | RATIFIED |
| `smartcity-flood-study` | RATIFIED |
| `smartcity-map-dock` | APPROVED |
| `smartcity-overview-lens` | RATIFIED |

`smartcity-map-dock` and `smartcity-overview-lens` matter most: both were DISPATCHED to build (G-128
and G-120), so a build already ran against a design nobody checked against source. This is
instrumenting what exists, not drawing: read the row's own words, "Every one of the five is already
drawn."

`plan-review-reasoner` was the fifth name in this row and is DONE. G-150 delivered its `check.mjs` (72
self-tests) and `violate.mjs` (27 plants) on 2026-09-17, and it caught a Pass rendered where source
sets `adjudicated: null`. **Read those two files first.** They are the working model for what this lane
is producing four of, including the failure mode worth copying: `violate.mjs` plants violations rather
than asserting the check passes.

### The bar, and it is higher than "does it pass"

`_design/smart-files/check.mjs` is the precedent named in the acceptance, and the reason is a real
defect: a predicate there **self-tested perfectly and matched nothing on any board**. It proved
nothing while reporting success. So every instrument you write must:

1. Self-test in BOTH directions (a known-good input passes, a known-bad input fails).
2. ABORT rather than return a verdict it cannot support. A check that cannot read its board must exit
   non-zero with the reason, never exit 0 quietly.
3. Report a **NON-ZERO matched-input count**. Print how many artboards/regions/elements it actually
   matched. Zero matches is a failure of the instrument, not a pass of the design.
4. Be **verified by violation against a real artboard**: name the violation you planted and show the
   check exiting non-zero on it.

### Two overlaps you must NOT build twice

Two of your four instruments are also claimed by other plan rows, and both of those rows are blocked
while this one is not, so this lane writes both files and the other rows inherit them:

- **`smartcity-flood-study/check.mjs`** is also required by **G-149** ("The design's own `check.mjs`,
   which does not exist today and is an R3 finding on `design-completion-gate.mjs`"). G-149 is blocked
  on D-12; write it here and record the inheritance in your close.
- **`smartcity-overview-lens/check.mjs`** is also required by **G-157** ("its missing `check.mjs`
   delivered with it"). G-157 is blocked on an operator capture of the v1 combined board; write it
  here and record the inheritance in your close.

Say so explicitly in your close so the planner can amend those two rows. An instrument built twice is
two predicates that can disagree, which is worse than one.

### Acceptance, verbatim from the row

> `node scripts/govtech/design-completion-gate.mjs` reports zero R3 findings. Each new `check.mjs`
> self-tests in both directions, aborts rather than returning a worthless verdict, reports a NON-ZERO
> matched-input count, and is verified by violation against a real artboard - the Smart Files
> precedent

Today the gate reports, at 2026-09-18T15:46Z against `smartcity-dashboards` `origin/main` `96fdafbb`:

```
R3 - designs past DRAFT with NO adversarial read as a file (4)
    plan-review-departments        status RATIFIED with no check.mjs
    smartcity-flood-study          status RATIFIED with no check.mjs
    smartcity-map-dock             status APPROVED with no check.mjs
    smartcity-overview-lens        status RATIFIED with no check.mjs
```

Your close must show that list empty. If you cannot clear one, say which and why rather than softening
it: a named unmeasured design is an honest result, a gate quietly passed is not.

### Boundaries

- **Do NOT edit `_design/INDEX.md`.** It is under active edit by two sibling design lanes (G-142 and
  G-147), which are appending lines. For each design whose index line should now record its
  instrument, put the exact replacement line in your close and the planner will apply it.
- Write nothing in `smartcity-dashboards`, `plan-review`, `smart-files` or any other product repo.
- Do not redraw any of the four designs. If a check reveals a design defect, report it; do not fix it
  silently in the canvas.

### Evidence your close must carry

- For each of the four: the `check.mjs` path, its matched-input count, its two self-test directions,
  and the named planted violation you proved it on.
- `node scripts/govtech/design-completion-gate.mjs` re-run, showing R3 at zero, plus the design-folder
  instrument count (`18, with an instrument: 12` at the read above; it should read 16).
- The G-149 and G-157 inheritance statements, in a form the planner can paste into those rows.
- Any exact `_design/INDEX.md` replacement lines for the four designs.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the
  close, never written to memory directly.
