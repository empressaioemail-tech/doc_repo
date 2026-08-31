---
date: 2026-08-31
agent: planner
repo: docs
session_type: review
memory_graded: [postgis-zone-major-not-point-major:HELPED, merge-only-on-green-ci:HELPED, doc-repo-concurrent-commit-hazard:HELPED, city-roster-has-no-county-link:HARMED]
rolled_up: false
---

## What was done

Continued the CTX program from the 2026-08-30 checkpoint. Compiled two more
dispatches (F-11 engine, F-11 LDT, plus P4 rails and P2b earlier), armed the
authoritative-read hook, ran the four no-lane items through a planner-owned fan,
and ran the P2-JURIS cost investigation to a deliberate stop.

Ten timed database probes, all read-only on short-lived minted credentials with
read-only proven by violation (durable `CREATE TABLE` refused) every time, and the
credential cleared after each. No write URI was ever minted. Nothing was adopted.

Two product handbacks produced and reviewed at source but **not merged**: the
Gate 8 dayOne fix and the landUse bake projection.

## What was learned (changes to ground truth)

**P2-JURIS cost driver is UN-NAMED, and that is the finding.** Board:
`_inbox/2026-08-31_p2_juris_partition_record.md`. Per-county emits are Caldwell
(24,989 / 78s) and Bastrop (62,257 / 129s). Cancels at 180s: six-county, Hays
full, McLennan, Hays 30k slice, and the equality-dropped probe. **Four mechanisms
were proposed and all four lost**, each the same way — a curve fitted through two
or three points:

| Mechanism | Killed by |
|---|---|
| parcels-linear | predicted McLennan at 156s; it cancelled |
| city-count | Hays 13 cities vs McLennan 21; both cancelled |
| chunk-linear | **confounded, re-opened** — the slice broke the planner, not the data |
| Austin vertex budget | real straddle (134,229x the 1e-8 floor) but only **3.56%** of Hays parcels reach its bbox |

The right call was to **stop without a fifth story**. Per-city reach × vertices is
recorded as the measurement that would name the product; it is not licensed.

**Plans A/B/C settled two things.** A (Hays 30k) was a **Nested Loop** — a slice
artefact, because `IN (SELECT … LIMIT)` is opaque and estimated 1,841 against
30,000. B (Bastrop) and C (Hays full) are both **Hash Join**, so the Hays-full
cancel is runtime, not a plan flip. The cheaper-costed plan is the one that
cancelled: cost estimates here rest on a `rows=1` cardinality lie.

**A range-chunk stays live but weaker.** C shows Hash Join holds on a full county,
and a `prop_id >= X AND prop_id < Y` range is estimable where the `LIMIT`
subquery was not. But it carries **no mechanism-backed prediction** — running it
would be an empirical parcel-scaling test, not a confirmation.

**Instrument defects found in checks, not data.** `01:202` put a literal `1/0` in
a CASE inside an **aggregate target list**, which evaluates regardless of the
condition — the query could never run. Gate 8's `dayOne` graded an **empty body**
as C3/C4/C7 pass, in the instrument built because controls here pass vacuously. A
guard of mine grepped its own `\echo` label and reported "must be 0, got 1" while
measuring nothing.

## What's still open

**Two handbacks awaiting the seat's read, neither merged.**
- Gate 8 dayOne fix — `P:\tmp\gate8-dayone-w1`, 5 files, base `a7a8042`. Floor sits
  **in front of** dayOne (consults `fetchVerdict`), `retryOnce` now defaults false,
  empty arm returns `refused`, inhabited arm stays C3/C4/C7 fail. Verified by
  violation: mutated back reproduces `pass/pass/pass`.
- landUse bake projection — `P:/tmp/landuse_bake.diff`, 5 files + 286-line test.
  Wrote tests first, watched 17/17 fail, then pass; 150/150 across suites.
  **Moves no live row until the conformant publish bake re-runs per county** — so
  it rides Wave R.

**Two operator rulings made this session, both needing execution.**
- **Seed does not apply to a CAD→CAD join.** The landUse `prop_id` roll join is
  clear on 48209 and 48491. The seed's risk was cross-namespace TxGIO↔CAD; this
  is one namespace, both sides CAD.
- **McLennan easements: wipe the coverage claim, keep the provenance.** Replace the
  two `gis-layer` rows with `county-absence` carrying `probed_at` and a basis
  naming: source withdrawn, AGOL org live and publishing zero services, prior T3
  counts 44,197 / 16,578, county purged for reload, prior corpus unreliable.
  **Check consumers before the wipe** — `landing_easement_gis` was created today so
  consumers are almost certainly zero, but retirement order is consumers first.

**The 6 stay open.** Bastrop's +326 in-city shift is 320 slivers under 1e-8 plus
**6 unnamed**. The CP1 prediction — a ring leaving 48021 and hitting a city that
does not intersect the county polygon — is the leading mechanism and is unproven.
The probe that would test it is *cities in an adjacent county that do NOT
intersect 48021*, which is a declared different predicate, not a scoped rerun.

**Roadmap.** P0 done. P1: schema-version fidelity, vintage fix-or-delete open
(recount repair landed). P2: `landing-import` still not schedulable (no county
arg, no job yaml), F-11 setback writer does not exist, easement writer still
live-fetches ArcGIS, alias seed needs a 61-row confirm. **P3: nothing exists —
`rail_absence` and `collect_close` are 0 files.** P4: wells/footprint/flood ready,
held on the Gate 8 fix plus an inhabited re-read. **P5: not started.** P6/P7/P8
not started.

**One check worth running before P3 is scoped.** The 357,269 / 624,141 / 981,410
split **was measured successfully on 2026-08-30**. The `01` harness that keeps
cancelling is much heavier — full report, slivers, CDP assertions, denom checks.
If the containment answer is obtainable by the lighter query, **P3 is not blocked
by the P2-JURIS stop at all.** Verify before assuming it waits.

## Calibration note for the next planner

Four of my load-bearing claims were wrong across these two sessions, all the same
way — reading the convenient artifact instead of the authoritative one: "P4
multiplies the defect 41x" (wrong writer), "A12 is absorbed" (working tree, not
HEAD), "826,569 are unincorporated" (three populations conflated), "containment
re-derives in 1.3s" (wrong join). Add the four dead cost mechanisms above.

Three were caught by an agent or a measurement, not by me re-reading a
conclusion. `.claude/hooks/authoritative-read.mjs` is now armed and warns on those
patterns. **Distrust a fit through two points, including mine.**

## Suggested canonical doc updates

- `CLAUDE.md` store figure is stale: `hauska_mcp` measured **111,241,840 reltuples
  / 192 GB** this session against the 100,025,152 / 131 GB recorded. That paragraph
  warns it is "a landmine a fresh agent will quote," and it currently is one.
- `28_THE_BASTROP_MOLD_engine_build_spec.md` — gates 7 and 8 still recorded as not
  mechanical. Gate 8 now has a built spec that fails on production; gate 7's
  cheapest honest version is one column plus one check.
- `ENFORCEMENT.md` — the leaf-disposition defect (a vocabulary that exists at the
  section level and is unreachable at the leaf; five instances) deserves naming as
  its own class alongside dormant and starved.
