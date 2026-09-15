## Mission — P-236: a county column refuses to promote when its coverage collapses

### What you are building, and why it is a refusal

**The failure this prevents is concrete and arithmetic.** A Travis bake with only Pflugerville
and Lakeway stamped would overwrite roughly **233k zoned nodes with roughly 35k** — and **the
existing row-level monotonic guard would not catch it**, because every individual row it wrote
would be valid. The defect is only visible at the population level.

That is the same blind spot as the Bastrop instance in `ENFORCEMENT.md`: a parcel-node reconcile
marked **57,704 of 62,394 parcel-nodes retired, 92.5 percent of the county**, where nineteen of
twenty sampled retirements were live at the county's own cadastral service and nothing refused
the write. Its lesson, verbatim: *a job that retires 92.5 percent of a county should not need
to know what went wrong in order to stop; the share alone is disqualifying.*

**This is a REFUSAL, not a detector.** This operation has a long record of building detectors
later found dormant, starved or vacuous. A refusal that fires beats a report nobody reads, and
when only one is affordable, build the refusal.

### Origin

Recommended in the 2026-09-07 Austin token thread and never built. It is being carded now
because Austin's zoning layer became unqueryable (`499 Token Required`) and Lockhart's service
is gone from its org entirely, so the exact scenario above is live rather than hypothetical.

### Done looks like

A county column **REFUSES to promote** — writes nothing, and says what it would have done —
when its zoned-node count falls below a **declared fraction** of the prior bake. Recommended
threshold: **95 percent**.

Per `ENFORCEMENT.md`: the threshold is **a declared number, not a judgement call**, and
crossing it requires **explicit authorisation** rather than a warning nobody reads. The refusal
must leave a durable record naming the county, the prior count, the new count, the computed
share and the invocation.

### Falsifiers, pre-register your answers before you run anything

1. **Run it against a deliberately undersized bake and confirm it REFUSES and writes nothing.**
   A control observed only passing has not been observed working. This is the whole point of
   the row — if you only ever see it allow a good bake, you have shipped an unverified guard.
2. **Run it against a legitimate full bake and confirm it PROMOTES.** A floor that refuses
   everything is not a control either, and it will be disabled by the first person it blocks.
3. **A legitimate first-ever bake for a new county has no prior to compare against.** State
   what happens — it must not refuse a county's first load, and it must not silently treat
   "no prior" as "zero prior" and pass everything forever after.
4. State the authorisation path for crossing the threshold deliberately, and confirm it is not
   simply a flag anyone passes by habit. If the override is as easy as the action, you built a
   speed bump.

### The three-question gate — answer these in your close

1. **What executes this?** A script, hook, CI job or blocking field. Not a role, not "the
   operator reviews."
2. **What triggers it?** Name the point in the promote path.
3. **What fails when it is violated, and is that thing running in production today?** A control
   that is merged, correct and undeployed enforces nothing.
4. **What bypasses it?** Name the paths that reach the same state without passing through it.
   The answer is rarely none. A gate in one writer is bypassed by a second writer; an
   application-level check is bypassed by a direct SQL path.

### Known traps

- **Do not count with an instrument that can silently truncate.** Never pipe an enumeration
  through `tail` — it drops rows and a zero reads as "nothing is wrong." That exact mistake
  produced a false "zero retired everywhere" reading on 2026-09-15.
- **The atoms store is on Neon database `hauska_mcp`.** A query against the wrong database
  returns a FALSE ABSENCE indistinguishable from a real one.
- **Factory store reads time out under writer load.** Verify a run from its execution status,
  not by querying the store while it writes.
- Related and deliberately separate: **P-213** is the blast-radius refusal for the write side.
  Build these two consistently or state in your close why they differ.

### Do not

- Do not weaken or replace the existing row-level monotonic guard. This is additive; that guard
  catches a different class.
- Do not run an `--apply` against a production store.
- Do not deploy or merge. Merging this repo deploys nothing (verified 2026-09-15: only `ci.yml`
  and `ldt-pin-staleness.yml`, and `gcloud builds triggers list` is EMPTY), but the writer jobs
  ship from manual `cloudbuild.parcel-*-cells.yaml` and that is the integration seat's call.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Answer the three-question gate explicitly, including what bypasses the control. Paste the
verbatim output of the undersized-bake refusal. Close to `_inbox/` on doc_repo main and PUSH
it. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
