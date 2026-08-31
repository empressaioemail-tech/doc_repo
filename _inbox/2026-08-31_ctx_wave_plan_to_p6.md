---
id: 2026-08-31_ctx_wave_plan_to_p6
title: Wave plan to P6 — organize around store-time, not around phase numbers
date: 2026-08-31
status: active
plan_row: F-01, F-02, F-05, F-06, F-08, F-11
depends_on: _inbox/2026-08-31_ctx_verdict.md
snapshot: doc_repo main 784fa5a
---

# The organizing fact

**Store-time is the only genuinely serial resource on this board.** Everything else
parallelizes. Organizing by phase number serializes work that has no dependency on
each other and hides the contention that actually matters. Six interactive scans
failed on that mistake and one chunked job succeeded.

So waves are cut by store contention, and everything that does not touch a store runs
beside them.

# Three compressions this plan takes

**P5 does not need P4.** The roadmap orders P5 after P4 because you scrub what you
publish. But the six counties already serve on card H, and most families operate on
data that exists today: S1 sentinels, S4 point-in-ring, S6 serve-path divergence, S7
ledger versus served, S8 provenance, S10 identifier hygiene, S12 adapter conflict.
Running them now proves the families fire against real data rather than fixtures, and
returns today's defect list. The P4-dependent run becomes a second pass over more
rows, not first contact. **Fourteen families that have never run is the largest
untested block on the board and it should not reach P6 untested.**

**P3 is a build, and builds do not wait for measurements.** It has no writer, no
store and no serve path. Building needs the schema, not TOTALS. Same compression that
already worked for P5 and the F-11 setback writer. Waiting for TOTALS to start P3
wastes the entire measurement window.

**F1 timed out for the same reason containment did, and the same fix applies.** It is
a 15s single-shot scan and it returned UNMEASURED on Travis and Williamson.
Containment proved chunk plus ledger plus resume works on this store at this scale.
Re-cut F1 as a chunked job and 188,103 / 158,573 get scored. This is the actual gate
on P4's setback half and it is on nobody's list.

# Wave A — measurement and build, concurrent where the store allows

| ID | Work | Store | Unblocks |
|---|---|---|---|
| A1 | Containment sweep: McLennan properly, Caldwell resolved, Travis, Williamson. Sentinel measured per county, restated triple stated before each execute. | `neondb`, serial | **TOTALS** |
| A2 | Diagnose the 2,087 well-fact gap (69,000 planned, 66,913 written). | none | wells on 5 counties |
| A3 | Re-cut F1 as a chunked job; score 188,103 / 158,573. | `hauska_mcp` | setback quarantine |
| A4 | Build P3: rail-absence rows, writer, serve path. | none | P3 |
| A5 | P5 first pass: run the P4-independent families against the live six. | read-only | proves P5 fires |

**Serialization.** A1 and A3 both touch a store. Run one at a time, and **confirm
whether `neondb` and `hauska_mcp` share compute before assuming they do not contend**;
that assumption has not been measured. A5 is read-only but still counts as store load
under writer pressure. A2 and A4 are free and run throughout.

**Sentinel discipline carries into A1.** Bastrop's sentinel resolved unincorporated
and Caldwell's resolved in-city at Mustang Ridge 50200, which is why Caldwell's
restated triple moved `in_city` rather than `unincorporated`. Assuming a shape
produces a refuse for the wrong reason. Measure per county, state the triple, then
execute.

# Wave B — P4 applies, serialized by rail

Wells and footprint on the five owed counties, after A2 explains the gap. Setbacks on
Bastrop after A3 clears the quarantine and the alias lands. Edges and envelope follow
setbacks. Easements after the live-fetch fix. Flood is a shape conversion only.

**Confirm the P6 determinism gate here, not at P6.** Tax-year selection had no
`ORDER BY`, so two bakes of identical input produced different bodies. Until that diff
is empty, no divergence test in P5 or P6 means anything. Discovering it at P6 costs a
phase.

# Wave C — P5 full pass

All fourteen families, 100% for anything expressible in SQL, area sweep never random
for the HTTP families, hard classes forced in. Each family runs against a poisoned row
and fails, and a known-good row and passes. Both directions, every family.

# Wave D — P6

Pin `_LDT_SHA`, determinism gate empty, six staging bakes concurrent, staging walk
with the new grades. Exit is six `walkVerdict pass` on the rows those runs wrote plus
refusal fixtures green. P7 and P8 follow unchanged.

# What this buys

The critical path today is `TOTALS -> P3 -> P4 -> P5 -> P6`. Under this plan it is
`TOTALS -> P4 -> P5-final -> P6`, because P3 and P5's first pass move into the
measurement window. **One full phase leaves the serial line.**

# What will bite if left implicit

Every Wave A item is a measurement, and three measurements have already returned
non-results this week: F1's timeout, McLennan's bare count, the 2,087 gap. **Budget
for measurements that fail to measure.** That is the norm here, not the exception, and
a wave plan that assumes each measurement returns a number will slip on the first one
that does not.

A non-result is a finding and gets recorded as UNMEASURED. It is never a zero.
