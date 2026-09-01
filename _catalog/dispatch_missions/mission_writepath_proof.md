# Mission — one named execution to convert `executionCount: 8` into evidence

## Why this card exists

The writer allowlist is merged at both layers. Engine PR #367 (`76b13d16`) puts
`--args=--writer=cad-parcel-roll` on the `factory-atoms-cad` template and removes
the unconditional `CAD_PARCEL_ROLL_PATH`. Factory PR #45 (`d93c7b06`) stamps the
writer flag into the execute override, because `containerOverrides.args` REPLACE
template args rather than appending. The job read-back at generation 3 confirms
`args: ["--writer=cad-parcel-roll"]`.

**And `executionCount` is still 8. Nothing has run through the new path.**

A path proven in tests and never executed in production is not proven. The write
path is the historical bottleneck on this board, and the right time to find a
problem in it is on one named county, not partway through six counties of rails.

**This card is a P4 rail apply. It is not the P4 wave, and it does not release
one.** Be honest about that in the close rather than calling it something else.

## The candidate, and why this one

**`well-fact` on Bastrop 48021.** Chosen on entanglement first, size second.

Wells are owed on five counties (Caldwell already holds 53,841). Bastrop at 62,257
parcels is the smallest owed county. Every FIPS has wells, so the fact path is
exercised and not only the absence path.

The two things blocking the P4 wave do not touch this rail:

- The **quarantines** are 188,103 placeholder `setback-rule` atoms and McLennan's
  65,814 envelopes derived from zero rules. Different entity types. Wells land
  nowhere near them.
- **P3 absence** concerns the city-scoped rails (setbacks, edges, envelope) whose
  scope comes from zoning. Wells are county-scoped. A parcel with no well is an
  absence within this rail itself, per A-028.

So wells is the rail least entangled with what is actually blocking P4, which is
exactly what a proving run should be.

`utility-easement` was considered and rejected: Bastrop is tiny there (~155
features) but the easement writer still live-fetches ArcGIS, a known unfixed
defect. Proving the write path on a writer with a known defect proves nothing.

## What to do

1. **Serialize.** P2-JURIS-PERSIST may be running containment on Caldwell or Hays.
   Confirm no other heavy operation is live before starting. Different logical
   stores (`hauska_mcp` for atoms, the Factory/landing side for containment) but
   confirm rather than assume they are not contending.
2. **Run row first.** No write without one. If the run record cannot be written,
   the run does not start.
3. Execute `factory-atoms-cad` with `--writer=well-fact --county=48021`. Note the
   template carries `--writer=cad-parcel-roll`; the execute override REPLACES
   template args, so the override must carry BOTH flags or the writer selection is
   wrong. That interaction is the single most likely failure and is the thing this
   run exists to expose.
4. One `run_event` per chunk, naming range, row count and wall time. A count is not
   a record.
5. Record wall time per chunk. It is **data, not a law**. Do not fit a curve, do not
   derive a rate, do not let it license a chunk size or a wave estimate.

## The falsifier, stated before the run

**`executionCount` must move from 8 to 9.** If it does not, the execution never
reached the job and everything downstream is a story about a run that did not
happen.

Then, and this is the part that matters: **verify from the STORE, not from the
job's own report.** A job reporting success is a claim. Read back:

- atoms written for 48021 `well-fact`, counted in `hauska_mcp` (NOT `neondb` — the
  wrong database returns a false absence)
- the termination record exists and says what the job says
- spot-check that a written atom's `county_fips` matches the county parsed from its
  binding, which is two independently derived inputs rather than one field

**Pre-registered failure outcomes, all of which are findings and none of which are
to be worked around:**

- The job runs the **CAD writer** instead of well-fact. That means the override did
  not carry the writer flag and the allowlist selected the template default.
- The job **refuses** `WRITER_REQUIRED` or `WRITER_NOT_ALLOWLISTED`. The guard bites
  in production, which is good, and the caller is wrong.
- The job succeeds and the store holds **nothing**. Silent success is the worst
  outcome on this board and must be reported loudly.
- Wall time is far outside the 67 to 149 atoms/s the write path measured
  previously. Report the number; do not explain it with a mechanism you have not
  measured.

## What this run does NOT do

It does not release the wells wave. Hays, McLennan, Travis and Williamson stay held
until this reads back clean from the store.

It does not release P4. The quarantines are still owed and P3 still has zero files.

It does not license a rate, a chunk size, or a duration estimate for any other
county.

## Do not

- Do not run a second heavy operation concurrently.
- Do not start without a run row.
- Do not re-run a completed rail to feel safe. Caldwell wells are done; leave them.
- Do not apply any other rail, county, or writer on this card.
- Do not touch the setback placeholders or the McLennan envelopes.
- Do not read `neondb` for atom counts.
- Do not treat the job's own success report as the verification.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier before
running the execute. Report `executionCount` before and after. `leave_behind`
named. Subagents do not commit. Verification does not delegate below the lane
planner.
