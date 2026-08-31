# Mission A4 — build P3 now; it is a build and builds do not wait for measurements

## Why this card exists

P3 is the phase with **no writer, no store and no serve path**. `rail_absence` and
`collect_close` are zero files. It has been described as blocked on containment
TOTALS, and that is only true of **running** it. Building it needs the schema, not the
number.

This is the same compression that already worked twice: the P5 scrub families and the
F-11 setback writer were both built before their inputs existed, and both were ready
when the gate lifted. Waiting for TOTALS to start P3 wastes the whole measurement
window and puts a full phase back on the serial line.

## What P3 owes

Absence that is **served**, not merely stored. That was the ADR-029 gap and it is the
point of the phase: a rail with no value must say so on the wire, with a basis, rather
than rendering empty.

Three states, and they are not interchangeable:

| State | Meaning | Population |
|---|---|---|
| `not-applicable` | cannot exist here, structural | **unincorporated parcels only** |
| `unmeasured` | could exist, not yet sourced | in-city with no landed table |
| `absent-verified` | looked, none found | after the city is probed |

**The operator ruling of 2026-08-31 governs this and is not reopenable here:** an
in-city parcel with no landed setback table serves `unmeasured`, **never**
`not-applicable`. A setback can exist there and calling it structural is an unearned
absence. That governs roughly 465,568 parcels and is the largest single fabrication
available on this board if taken the other way.

`not-applicable` is correct for unincorporated parcels only, because counties do not
zone unincorporated land. It applies to setbacks, edges and envelope, which inherit
their scope from zoning. Zoning already emits it there; those three do not.

Also owed: the four county-level easement absences the T3 recon established.

## Build, do not run

1. The `rail_absence` store and its writer.
2. The serve path that makes an absence **visible on the wire** with its basis.
3. Every absence carries: the scope searched, an `asOf` that is **evaluation time and
   not the request clock**, and a per-cell basis. **A basis identical across two
   parcels is a defect**, not a saving.
4. Fixtures for all three states, and for the boundary between them.

Wire it against the population shape, not against a specific number. TOTALS will
arrive from lane A1 and the numbers will move; the *classification* is what this card
fixes and it does not depend on the count.

## The falsifier, and it is the point of the phase

**A live brief on a Caldwell rural parcel names county-absence rather than showing an
empty rail.** Stored absence that never reaches a surface is the ADR-029 gap
reproduced, not closed.

Second arm, and this is the one that catches the dangerous failure: **feed the path an
in-city parcel with no landed table and require `unmeasured`.** If it emits
`not-applicable`, the build is wrong in exactly the direction the ruling forbids.

## Do not

- Do not stamp `not-applicable` on the 826,569 remainder. Only the unincorporated
  population qualifies; the rest are in-city parcels where a setback can exist.
- Do not write an absence without a probe. **An unprobed absence is a fabricated fact
  and is harder to detect than a fabricated value.**
- Do not use the request clock for `asOf`.
- Do not adopt 357,269 or any containment figure; A1 produces the number and this card
  does not need it.
- Do not run a production job or touch a store beyond fixtures.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State both falsifier arms before running them.
`leave_behind` named. Subagents do not commit.
