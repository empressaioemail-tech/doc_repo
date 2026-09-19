## Mission - G-164 (remaining clause): the flood-study basis line asserts an absence the engine no longer has

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `P:/doc_repo`, and only under
`_design/smartcity-flood-study/`. You write nothing in `hauska-map`, `hauska-engine`,
`smartcity-dashboards`, or `smartcity-os`.

### Why this lane exists now and could not exist before

`_design/smartcity-flood-study/` is the last R3 finding between the design gate and exit 0, and G-164's
close left it open **on purpose**. Its basis line says:

> A depth is a depth: the model takes no storm duration, and naming these by return period would need a
> local rainfall atlas nobody has cited yet.

When that sentence was written it was true. It stopped being true when G-165 landed: the NOAA Atlas 14
parser had never matched the live HDSC payload, so every county was served Bastrop's 9.5in regional
default **under a `noaa-atlas14` citation**, and correcting the design's prose then would have made the
page agree with an invented number. **That is settled.** G-165 is closed. Correcting the sentence is now
the honest act rather than the dishonest one.

**But you must establish that for yourself before you edit, and the lane fails if you do not.** Do not
trust this paragraph: it is a claim about a merged change. Read `P:/hauska-map` origin/main, find the
parser, and show that a parse now happens and the depth **varies with location**. If it does not vary,
stop and report that rather than repairing the prose, because a design corrected to match a still-default
number is the defect G-164 refused to commit.

### What is actually wrong, in four places, and one of them regenerates the others

    _design/smartcity-flood-study/Main.dc.html:116   the rendered basis line
    _design/smartcity-flood-study/gen.mjs:280        the generator that emits that line
    _design/smartcity-flood-study/README.md:59-63    "no depth-to-return-period table anywhere in the source"
                                                     and "needs a local rainfall atlas nobody has cited"
    _design/smartcity-flood-study/canvas.json        "no depth-to-return-period table anywhere in"

`Main.dc.html` is GENERATED. Repair `gen.mjs` and regenerate; a hand edit to the board is reverted by the
next run and is a repair that does not hold. Verify by regenerating and confirming the board is
unchanged from the edited one.

### What the corrected position must say, and the trap in getting it wrong

The instrument requires the design to **state a position**; a design that states neither position is
refused (self-test: "claim: REFUSES a design that states neither position"). **So deleting the sentence
is not a repair and will not pass.** Neither is softening it into "naming by return period is
approximate" without naming what backs the number.

The engine carries `rainfallSource` (`noaa-atlas14/parameter/default`), cites NOAA Atlas 14 seven times
across the four scanned files, pairs return period to depth in `rainfallCurve`, and renders the default
as `100-yr (NOAA Atlas 14)` and a passed depth as `≈N-yr equivalent (interpolated)`. The corrected basis
line states that the engine **does** name a return period, and names which of those two things it is
doing, so a reader can tell a site-derived label from an interpolated one. Get the exact strings by
reading the source, not from this dispatch.

**The no-duration half of the sentence is still true** and the instrument still accepts it (the
`NO_DURATION_RE` claim holds at zero matches). Keep it.

### Acceptance - run these yourself and paste raw output

1. `node _design/smartcity-flood-study/check.mjs` exits **0**, with the matched-input counters non-zero.
2. `node _design/smartcity-flood-study/violate.mjs` catches **every** planted violation after your
   repair, and no longer needs a scratch repair to manufacture a clean baseline: once the shipped boards
   pass, the `repair()` step whose anchors existed only to patch a defective board is dead and must be
   handled, not left patching a board that is already correct. G-164's close did exactly this for the
   four other designs; read what it did before repeating it.
3. `node scripts/govtech/design-completion-gate.mjs` exits **0** with **zero** R3 findings, read against
   a stated `_design` snapshot and a stated `smartcity-dashboards` nav ref.
4. Both directions on the claim rule, shown: put the stale sentence back on the board and confirm the
   instrument REFUSES it; and confirm a design stating neither position is still refused.

### What you must not do

- **Do not move the guard.** Editing `check.mjs`'s predicates, its regexes, or its self-tests to reach
  exit 0 is the defect class this program exists to catch. The instrument is inherited from G-148 and
  G-149 and its predicates are not yours to widen. If the instrument is wrong, say so in the close with
  the evidence and leave it failing.
- **Do not touch a product repo.** The boards are `doc_repo`. `_design/` is doc repo. Nothing here needs
  a product branch, and this lane holds no dashboards slot.
- **Do not repair anything else in `_design/`.** The other 19 folders pass; a sweeping edit re-opens
  settled findings.
- **Doc_repo commits are planner-owned.** Hand your work back uncommitted by explicit path list.

### Evidence your close must carry

- The source reading that proves the parser now varies with location, with the commit you read it at and
  the moment you read it.
- Raw output of all four acceptance commands, pre-fix and post-fix, including the pre-fix failure.
- The regenerated-board check (edited board byte-identical after a `gen.mjs` run).
- `instrument-report.json` as the instrument leaves it, and the exact diff of `violate.mjs` with the
  reason for each line.
- Your snapshot (repo, ref, moment read) per `ENFORCEMENT.md`, and your scratch block
  (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN) returned in the close.
