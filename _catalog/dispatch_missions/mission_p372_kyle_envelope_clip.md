## Mission — P-372: the envelope's parcel-minus-strips clip throws where the district resolved

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open one PR from current
`origin/main` with the SHA declared. **Start only once LDT main contains P-366's PR #726** (the seat
merges it): run `git log origin/main --oneline | grep -c "P-366"` and stop if it prints 0. You do not
merge, deploy or write any store.

### What is wrong (P-366's close, `_inbox/2026-09-19_p366-codified-draw-declines_close.json`)

Kyle `48209:145880` (district R-1-A) declines `geometry-validation-failed`. It is not a stamp gap: the
district resolved and a full 25/10/15/10 setback table was emitted, and then the boolean difference
that cuts the setback strips out of the parcel threw. The route declines with a reason that names the
wrong stage ("validation") for a clip failure.

### What to build

1. **Name the failing operation at source.** Which library call, on what inputs (the parcel ring as
   served, each strip), and what it threw. Is the parcel ring valid (self-intersection, duplicate
   vertices, orientation, a sliver), or is a strip degenerate (zero-width edge, collinear vertices)?
   Measure, do not assume.
2. **The class, not the one parcel.** Read-only, under a heavy-scan lease: how many parcels in the six
   counties decline `geometry-validation-failed` today, and how many of them reach a resolved table
   first (the same shape as Kyle). A table by county.
3. **Fix it at the right layer.** A ring that is genuinely invalid at source is a finding and keeps a
   true, named decline (and the reason names the source defect, not "validation"). A clip that
   refuses a valid ring is a bug: make the operation robust (a repaired or snapped input with the
   repair recorded, or a more robust operation), never a silent fallback that draws a different
   shape. Any repair that moves the area past a declared tolerance declines instead.
4. **The reason names the stage.** A clip failure and a validation failure are different reasons.

### Verify by violation

Pre-register: Kyle `48209:145880` draws (or declines with its true, named source defect); a
deliberately invalid ring still declines; a repair beyond the tolerance declines; the class count
before and after, per county, beside your prediction. Grade after deploy:
`node --use-system-ca scripts/surface-probe.mjs --rows P-254` (doc_repo) must not fail Kyle on the draw.

### The three-question gate

What executes the clip, what triggers it, what fails when it throws, and what bypasses it.

### Close

Declare: the start commit and PR, the failing operation, the class table, the fix, the falsifiers with
both directions shown, the three-question gate answers, and `leave_behind`.
