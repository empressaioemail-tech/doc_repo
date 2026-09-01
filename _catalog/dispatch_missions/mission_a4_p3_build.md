# Mission — build P3 absence. Build only. Do not apply.

## Why this is a build and why it does not wait

P3 has no writer, no store and no serve path yet. Building needs the schema, not the
measurement, so it runs during the measurement window instead of behind it. That
compression is what takes a full phase off the serial line: the critical path goes from
`TOTALS -> P3 -> P4 -> P5 -> P6` to `TOTALS -> P4 -> P5-final -> P6`.

The same compression already worked for the P5 families and the F-11 setback writer.

## What P3 is

Setbacks, edges and envelope inherit their scope from zoning, and counties do not zone
unincorporated land. **Zoning already emits `not-applicable` there; the other three do
not.** So:

- Add the `unincorporated -> not-applicable` row for **setbacks, edges and envelope**.
- Add the **four county-level easement absences** the T3 recon already established.

## The number in the roadmap is now second-derivable, and you must check it

The roadmap carries this population table:

| population | parcels | state |
|---|---|---|
| in-city ceiling | 624,141 | — |
| unincorporated | **357,269** | `not-applicable` (structural) |
| in-city, no table yet | 465,568 | `unmeasured` -> `absent-verified` on probe |
| in-city, warmed | 3,732 | `value` |

**That 357,269 predates 2026-09-01.** Containment now covers all six counties and produces
an independently derived unincorporated count per county — Williamson 107,743 and Travis
103,914 alone are 211,657. TOTALS collects the other four.

So there are now two derivations where there was one, and they must be reconciled before
any apply. **Do not reconcile them by picking the prettier number.** If they disagree, the
disagreement is the finding and it is more valuable than the build.

You do not need that reconciliation to build. You need it before anything is stamped.

## The constraint that governs the whole card

**Do not stamp `not-applicable` on the 826,569 remainder.** Only the unincorporated
population qualifies, because a county genuinely does not zone that land. The rest are
in-city parcels where a setback can exist and has not been sourced.

Calling that structural is an **unearned absence** — the exact defect class of asserting a
state the system did not establish. `not-applicable` and `absent-verified` and `unmeasured`
are three different states and collapsing them is the failure this phase exists to prevent.

Build the type so the distinction cannot be lost. Where a type can carry the constraint,
prefer the type over a check: a discriminated union the compiler enforces at every consumer
has no trigger to be missing and no call site to be absent.

## Absence must be SERVED, not just stored

The exit gate is a live brief on a Caldwell rural parcel naming **county-absence** rather
than showing an empty rail. That was the ADR-029 gap: absence written into a store that no
surface reads is indistinguishable from absence nobody recorded.

**You are not closing that gate on this card** — it needs the apply and a deployed surface.
But build the serve path, and say what remains between what you built and that live brief.
A merged PR is not customer-done and this repo has proved it more than once.

## Do not

- Do not apply. Do not stamp. Do not write absence rows to any store.
- Do not stamp `not-applicable` anywhere outside the unincorporated population, ever.
- Do not take 357,269 as true; it has a second derivation now.
- Do not touch the store. This card needs no store token and must not take one.
- Do not close the ADR-029 serve gap on a build.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report the type or schema that makes `not-applicable`,
`absent-verified` and `unmeasured` non-collapsible, what remains between the build and the
live Caldwell brief, and the reconciliation you would run on 357,269 without running it.
Name what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.
