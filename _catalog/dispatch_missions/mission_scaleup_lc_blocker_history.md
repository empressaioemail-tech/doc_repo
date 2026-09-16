## Mission — L-C BLOCKER HISTORY: every problem we hit bringing six counties online, so Burnet, Bell and Milam hit none of them twice

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store.

### Why this exists

The operator, 2026-09-16: *"for the farm, I want a deep reconciliation of all the problems we've
had building all this machinery up to this point, and a very clean understanding of what those
blockers were. I think there were seven main categories. I don't want to beat my head against the
wall to get Burnet or any other county on."*

**The seven**, as the record has them:

- **The six CTX defect classes**, from `_sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md`:
  1. punctuation-only input skipped before any write;
  2. a ceiling measured by one instrument and enforced by another;
  3. parcels that could reach no state at all;
  4. a missed sibling;
  5. a ruling filed and never implemented, down to a type that could not express it;
  6. a sub-metre digitisation mismatch between independent sources.
- **The seventh**, from `_inbox/2026-09-10_ctx_third_party_review.md` section 4: a value served
  with a label asserted by a constant and consumed by a check that cannot fail on it.

**Start from those seven and do not stop at them.** Classes named elsewhere in the record since
then are candidates, and a candidate joins the register only with instances. Examples:

- false earned states;
- stale copies overriding current data;
- identity collisions across two namespaces;
- controls that cannot fail;
- merged-but-not-deployed;
- serial discovery;
- deploy and traffic traps;
- stranded artifacts;
- duplicate row ids.

### Sources, all of them

- Every `_sessions/` file from 2026-07-20 onward.
- Every `_inbox/` close, checkpoint, WDLL, review, retro and post-mortem in the same period.
- OPS-16 amendments from A-080 onward, and the finding tables (F-rows) in OPS-19, OPS-21, OPS-23
  and OPS-24.
- `_inbox/2026-09-13_dead_controls_ranked_fixes.md`.
- The three assumption registers from 2026-09-13.
- `ENFORCEMENT.md` instances.
- The planner's memory index, `C:/Users/cente/.claude/projects/p--doc-repo/memory/MEMORY.md`,
  and the files it links. It is read-only to you, and each entry's date matters.
- **The 24 unlanded wave 6 commits** on `seat/dispatch-planner` (landed on main before this
  wave).

**Where a record says something was fixed, confirm the fix at source:** the PR, the commit, and
whether it deployed.

### Deliverables

**1. The blocker register.** `_inbox/<date>_scaleup-lc_blocker_register.json` and a readable
`.md`. One entry per **instance**, carrying:

- date;
- county and city;
- the pipeline stage (map it onto the thirteen OPS-24 stages plus depth and vendor);
- symptom;
- root cause, with file and SHA;
- class;
- how it was found (reading code, a probe, the operator, a customer);
- fix status with evidence (unfixed, fixed and undeployed, deployed, verified on the customer
  surface);
- **the recurrence control**: a hook, type, test, job or gate, or none;
- the cost, where the record states one (hours lost, a re-bake, an outage).

**Count instances. A class with one instance is still listed.**

**2. The class table.** Per class:

- instance count;
- the counties hit;
- how many instances are still unfixed;
- how many have a recurrence control that can fail;
- the stage where it was found, against the stage where it could have been caught.

**3. The smooth path.** For each farm stage, the checks the history says it must run so each
class is caught at the earliest stage, **before it costs anything**. Each check names:

- what executes it;
- what triggers it;
- what fails;
- what bypasses it.

These are ENFORCEMENT's gate questions. This becomes the pre-bake audit's register and the
farm runbook's checklist.

**4. The unfixed list.** Every unfixed instance that would hit Burnet, Bell or Milam, with the
county-specific reason. For Burnet, cover at least:

- 59,785 parcels on production against 50,138 ingest features;
- 0 address points;
- Marble Falls with no setback table;
- the roster's `NOT-FOUND-UNKNOWN-WHY` status.

For Bell, cover at least: Temple is zoned with no layer found, and the boundary divergence.

For Milam, cover at least: the CAD endpoint is unproven.

### Falsifiers

Pre-register your answers before you run anything.

1. The six CTX classes and the seventh must each carry at least the instances their source
   documents name. Fewer means your read missed them.
2. At least one class the record treats as "fixed" must turn out, at source, to be undeployed,
   unverified or uncontrolled. **If none does, say how you checked** and why that is plausible.
3. **Not vacuous:** the smooth-path check for class 5 (a ruling filed and never implemented) must
   be one a machine executes, not "the planner remembers".

### Close

**Report.** `_inbox/<date>_scaleup-lc_blocker_history_report.md`, holding the four deliverables.

**Close JSON.** `_inbox/<date>_scaleup-lc-blocker-history_close.json`, carrying:

- `planRows` `["P-188"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.
