## Mission — P-377: the setback writer reopens its own refusals and checked absences when their basis moves

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open one PR from current
`origin/main` with the SHA declared (`be295755` at compile). You do not merge, deploy, apply or write
any store.

### What is wrong (seat review of #192, 2026-09-19)

`src/jobs/parcel-setback-cells.mjs` `setbackCellMayBeMoved` releases only `unaccounted`, the job's own
false absences, and (P-363) its own VALUE cells written under an older corpus. Since P-300/P-338 (#192)
the job also writes:

- ruling-6 district-miss refusals (a district is on file; the city's table has no row for it),
- class (a) "zoning not acquired" refusals (the city zones; its layer was never acquired: P-364),
- class (c) checked absences (an unzoned city with no city-wide line, read at source).

All three are permanent: the gate never releases them. So when a corpus pin move adds a missing
district's row, when P-364 acquires a city's zoning layer, or when the classification table changes a
city's class, those parcels stay refused or absent. The lane named this ("every class but `unaccounted`
is STICKY") and left it.

**The gate this row is on:** no corpus pin move after 1.5.0 (P-354's rows, now 1.6.0) before this
ships.

### What to build

1. **Release by basis, not by kind.** A refusal or checked absence THIS job wrote is released when the
   basis it names has moved: its `corpusVersion` is older than the pin (the P-363 comparison, reused);
   its classification entry no longer says the class it was written under; or the zoning cell it read
   (district present or absent) no longer says what it said. Name each trigger and read it from the
   cell's own basis fields (#192 writes `corpusVersion`, `class`, `method`, `districtCode`).
2. **Nothing it did not write.** A refusal or absence another producer wrote is never released here.
3. **The pure predicate and the SQL gate stay pinned to each other in both directions**, as P-256 and
   P-363 do.
4. **Record before write.** Every reopened cell is named in the run's durable record before the write
   commits (P-367's chunked `run_events` shape), or the write does not run.

### Verify by violation

Pre-register: a ruling-6 refusal written under 1.5.0 reopens under a 1.6.0 pin that adds the row, and
resolves to the value; the same refusal under an unchanged pin stays; a class (a) refusal reopens when
the zoning cell gains a district; a class (c) absence reopens when its classification entry changes; a
refusal another producer wrote never reopens; the record names every reopened cell (a forced record
failure writes nothing). Then a read-only per-county dry run under the heavy-scan lease, with the
reopen counts beside your prediction (with no basis moved, the prediction is zero).

### The three-question gate

What executes the release, what triggers it, what fails when a refusal survives its basis moving, and
what bypasses it.

### Close

Declare: the start commit and PR, the triggers and the fields each reads, the falsifiers with both
directions shown, the dry-run counts, the three-question gate answers, and `leave_behind`.
