---
date: 2026-09-11
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
snapshot: >
  doc_repo main 278cb9b4. Serving revision cortex-api-00768-cus at percent=100, verified by
  the integration seat reading the traffic split by field name rather than positionally.
  hauska-factory main green with _LDT_SHA at cebd041d. Fourteen OPS-21 lanes closed.
---

# OPS-21: the goal is met for five counties, and what it actually cost

Final session record for this arc. Predecessors:
`2026-09-10_county_contract_and_scaling_diagnosis_claude_code.md` (diagnosis, county
contract), `2026-09-10_ops21_program_open_and_dispatch_claude_code.md` (program opened),
`2026-09-11_ops21_execution_and_the_atom_gap_claude_code.md` (mid-arc, and the atom question),
`2026-09-11_MIDSESSION_ops21_capture.md` (cold-start read).

## The goal, and it is met

Operator, at the open: *"I need all the information we have, including setback and envelope
rails, in production. That has been my goal for weeks and it keeps simply coming up short."*

**Live in production now, five counties (48021, 48055, 48309, 48453, 48491), served from the
ledger:**

```
setbackFrontFt  setbackSideFt  setbackRearFt  setbackCornerFt  setbackRules
parcelAreaSqFt  maxHeightFt    maxLotCoveragePct              maxFootprintSqFt
```

Refusing correctly by operator ruling: `buildableAreaSqFt`, `buildableAreaPct`,
`envelopeStatus`, `envelopeDisclosure` — confirmed on three independent lines of evidence that
they refuse rather than leak across the slate boundary.

Declining entirely: Hays 48209, held on P-145.

## What was actually wrong, and none of it was data

Three defects, all of them code, none of them acquisition:

1. **`computeTier1Envelope` has two return branches and both are `status:"declined"`.** It
   runs, passes every test, and cannot return a value on any branch for any parcel. Paired with
   `write-setback-city.mjs:95` refusing `--apply` on a card-scope boundary no later card lifted,
   the rail had no path to a value at all. **The vacuous class** — distinct from dormant (no
   trigger) and starved (input never supplied).
2. **Both cell writers advanced only on `value`/`refused`** and had no branch for a legitimate
   `not-applicable`, permanently stranding 3,376 parcels x 8 rails.
3. **The publish gate graded 17 of 65 rails**, so 48 rails were structurally incapable of
   reporting a problem and an agent could honestly pass a question nobody asked.

## The finding that closed it, and it is instructive

S6 found the planner's "40 pairs" wrong. The gate evaluates **per rail**; the slate addresses
**per group** where a group check exists. `setbackSideFt`, `setbackRearFt` and
`setbackCornerFt` have no `resolveAllowlist` call site at all — they ride `setbackFrontFt`'s
single check by PARCEL-B-SLATE3's original design.

`setbackFrontFt` had been slated since **2026-09-04**. So the moment Z2 supplied the missing
branch, **the whole four-key setback group began serving automatically**, confirmed by probe
before S6 wrote a line. The thing chased for six weeks went live with nobody slating it.

That is a different error class from the rest of this session's: not a wrong fact but a wrong
MODEL of how two controls address rails, undocumented anywhere, found by grepping for call
sites rather than trusting a count.

## Verification, because claims are not results

**Four independent derivations of one population.** The 3,376: S1 from the write side, S4 from
the verdict side (44/26/1,014/1,021/1,271), Z1 from the store side (all legitimately
`not-applicable`), Z2 moved it.

**The program instrument corroborated, twice, and caught one thing.** Two runs of
`scripts/plan-progress.mjs` against production either side of Z2's apply:

```
S1   291,055 -> 274,175   delta 16,880 = 3,376 x 5    EXACT
S2 2,673,932 -> 2,663,804 delta 10,128 = 3,376 x 3    EXACT
S1 remaining 274,175   = Hays 54,835 x 5                             EXACT
S2 remaining 2,663,804 = 3P-14's four x 611,116 + Hays x 4           EXACT
```

Nothing unexplained. Every remaining unaccounted cell is Hays or a ruled-unwritten rail. **The
predicates not reaching zero is now the correct answer, not a gap.**

And on its first production run it caught **D1/P-137 closing with a claim of zero against a
measured 4,032,691**, naming that exact command as its own stranger-check. Routed, unadjudicated,
blocks nothing.

**The instrument's real value was the DELTA**, which no lane can produce because no lane spans
two apply events. That is what a program-level instrument does that a lane-level one cannot.

## What it cost, honestly

**Eleven planner errors, every one caught by a lane or a peer, none by the planner re-reading
its own work.** Ten share one shape — a claim verified on one side of a seam and stated
generally. The eleventh is the group-addressing model above. One was a case where the
planner's own CORRECTION was the error and the lane was right to ignore it.

**The lanes are the healthy part of this machine and the joint is where the errors are.** S2
designed a buildable-area approximation and overruled itself before writing geometry code. S3
fanned four sub-agents and re-executed every claim itself. S4 closed with zero slated rather
than ship an inert cutover. S5 queried live data and found `setbackRules` is not a scalar,
which fixture-based unit tests would never have caught. Z1 wrote no code because there was
nothing to write. Z2 had its design adversarially reviewed before implementation.

## The half of ADR-031 that did not move

**None of the new cells are atom-backed.** ADR-031 requires `source -> conformant atom -> cell
citing the atom`; S1, S2 and R1 did `source -> cell`. That is the CTX seam Decision 4 blessed as
bounded debt, **extended to more rails**.

ADR-031 rejected record-first because *"the catalog and the product would permanently diverge,
and the Hauska thesis requires that the catalog is the product."* Its own reversal criterion is
the tripwire: if record reads diverge from the atom catalog for a fact both carry, the backfill
stops being deferrable. **Nothing measures that divergence. L4 is still not compiled**, and the
repair is scoped at one rail-family of sixty-five.

This is the single most important open item in the program and it is invisible by construction.

## What's open

- **L4** — not compiled. The atom-divergence tripwire and the sizing instrument for L3.
- **H1 / P-145** — Hays, held on the CTX-HAYS backfill settling.
- **L3 / P-144** — 97 cutovers shipped, 70 legacy paths still reachable, none verified retired.
  S6 added 20 more entries; the debt grew.
- **D1's predicate discrepancy** — routed.
- **17 items in the Phase 3P deferred register**, each with a trigger. An item with no trigger
  is refused.
- **3P-4, the dispatch-preflight rule** — still prose, which is the condition it exists to fix.
  Three of this session's errors would have been caught at compile.

## Suggested canonical doc updates

1. **Compile L4.** Named first in the previous close too; still the highest-value open item.
2. **ADR-031 should record that the CTX seam was EXTENDED** to setbacks and envelope, with the
   count, so the exemption's real size is visible rather than inferred from lane closes.
3. **Document the gate-versus-slate addressing model** somewhere canonical. It cost a dispatch
   error and it is written down nowhere.
4. **3P-4 needs a plan row.**
