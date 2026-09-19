## Mission - G-166: `smartcity-dashboards` `main` is red, and the cause is a test fixture anchored to the calendar

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (hand any doc edit back as a diff, uncommitted) and nothing in `smartcity-os`.

### The state you are inheriting

`main`'s CI has failed on three consecutive runs: `03e11b0b`, `ee9c5d5`, `cbdfaeb6`. The last green was
`ea27024` at 2026-09-18T21:58:44Z. **No code change caused it. The calendar did.** This is a time bomb,
not a flake: it will never heal and it fails every day from here.

### The mechanism, read at source

`src/dev-services-naming.test.mjs` (G-154 correction 3's instrument):

    const TODAY = new Date("2026-09-18T06:00:00Z");          // line 190
    const day = (offset) => {                                  // line 191
      const t = new Date(Date.UTC(2026, 8, 18) + offset * 86400000);
      return t.toISOString().slice(0, 10);
    };

`day()` builds fixture dates from a **FIXED anchor** (2026-09-18 UTC). The production path does not:
`src/mygov-live.mjs:386` calls `expiryOffsetFrom(row.expirationDate)` with **no clock argument**, so it
defaults to the live clock. The failing case then asserts against those live-computed offsets:

    assert.deepEqual(offsets, [-40, 12, 200]);                 // line 213

True on exactly one calendar day. From the 2026-09-19 UTC roll it reads `[-41, 11, 199]`. The
`AssertionError` is at line 213 inside the subtest at line 202.

**Note the shape, because it constrains the fix.** `expiryOffsetFrom` ALREADY accepts a clock: lines
228-232 call it as `expiryOffsetFrom("2026-09-18", TODAY)`. Only the compose path omits it. So there are
two clocks in play in this one file, and the fixture reads the frozen one while the code under test reads
the live one.

### What the repair must achieve, and the trap

**One clock, explicitly.** The end state is a test whose result does NOT depend on the wall-clock day it
runs. Either derive the fixture from the same reference the production path uses, or thread an injectable
clock through the compose path so the fixture and the code under test share one pinned `now`. Both are
acceptable; pick one and say which.

**Do NOT simply move the anchor to today.** That re-arms the identical bomb one day later and leaves the
assertion true for exactly one run. A reviewer must be able to see, from the test alone, why it cannot
expire.

**Do NOT weaken the assertion to make it pass.** `[-40, 12, 200]` is the correct expectation and it must
stay exact. Deleting the offsets assertion, widening it to a tolerance, or asserting only
`offsets.length === 3` is the defect class this program exists to catch, not a repair. The second test in
the same block ("is not vacuous: the arrival order this compose was handed FAILS that order") is the arm
that proves the fixture is genuinely shuffled; it must still pass, or the ordering claim proves nothing.

### Acceptance - run these yourself and paste raw output

1. `node --test src/dev-services-naming.test.mjs` exits **0**, and the subtest at line 202 passes.
2. **Prove it cannot expire.** Show the offsets assertion holding at a wall-clock date well away from the
   fixture's anchor, or show the fixture and the code under test reading one injected clock. A repair that
   passes only today does not satisfy this item, and a screenshot of a green run today does NOT satisfy it.
3. The pre-fix failure, pasted from the CI log or reproduced locally, so the repair has a recorded
   before-state. The failing run is `cbdfaeb6`.
4. `gh run list --repo empressaioemail-tech/smartcity-dashboards --branch main --limit 3` shows `main`
   green AFTER your merge. **A green PR check is not this item**; the bomb fired on `main`, so `main` is
   what must be observed green. If your merge is the tip, the run on the merge commit is the evidence.

### What you must not do

- **Do not touch any other test file or any source file that is not required.** `domains-dev-services.test.mjs`
  reads the same function (lines 491-498) and is currently green; do not move it.
- **Do not delete the test.** A red test is the thing that found a real property of this code; removing it
  is not a fix.
- **Do not change production behaviour to make the fixture true.** If you thread a clock, the default must
  remain the live clock, so production is unchanged. Report if threading proves impossible.

### Evidence your close must carry

- The pre-fix failure (pasted), the post-fix pass, and the item-2 date-independence proof.
- The exact diff, with a one-line reason for each hunk.
- Your snapshot (repo, ref, moment read) per `ENFORCEMENT.md`, and your scratch block
  (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN) returned in the close.
- The counter-consideration: `smartcity-tracker.mjs` cannot see a row graded more strictly than its close,
  so if you believe this row should be graded differently from what you deliver, SAY SO in the close rather
  than grading yourself generously.
