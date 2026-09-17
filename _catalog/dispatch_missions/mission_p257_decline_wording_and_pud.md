## Mission — P-257: a decline says what is true of THIS parcel, and a PUD is not a Euclidean district

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and `hauska-map` and open
one PR per repo you change. You do not merge or deploy; the integration seat does both. Any doc_repo
change is handed back as a diff in your close.

### Two measured customer defects, one row

P-254 measured these live on 2026-09-17. Both are OPEN, each is reported under two ids, and each
pair is one defect:

**A. A Bastrop-specific decline string is served on other counties' parcels** (XD-4, and X4 under
its second id). **6 of 52 subject parcels.** The first instance is `48209:49000` — a HAYS parcel —
carrying the wording:

> "Setbacks pending re-warm from city per-parcel record - verify with city. Repealed or pre-layer-23
> sources are not served"

"Layer 23" is a Bastrop city GIS layer. On a Hays parcel that sentence is not degraded, it is false:
it tells the reader we are waiting on a re-warm from a source that has nothing to do with their
parcel. A decline must say what is true of the parcel it is declining.

**B. A `PUD`-coded district resolves Euclidean setbacks** (XD-14, and X10 under its second id).
**1 of 4 PUD-coded subjects.** `48021:70907`, district `PD`, resolved setbacks 20/100/100/100. A
planned-unit development's dimensional standards live in its own ordinance and site plan; they are
not the base district's numbers. Emitting a Euclidean table for a PUD is emitting a value computed
without its required input, which is the thing that must refuse. X10's half is that the surface
should give the PUD message instead.

### What to build

1. **The decline string is composed from the parcel's own jurisdiction**, never from a template that
   names one city. Find the one place each repo composes it. If the same wording is assembled in
   more than one file, consolidate — the card-truth lane found a four-copy rule with one drifted
   copy in hauska-map, so assume nothing about there being a single site until you have looked.
2. **A PUD-coded district refuses a Euclidean setback table** and says why: the standards are in the
   PUD's own instrument and are not on record here. It does not fall back to the base district and
   it does not invent a table. Decide, and state at CP1, how a PUD is IDENTIFIED — the measured
   instance has code `PD`, and a code list that one county spells differently is a defect waiting to
   happen, so say how you handle an unrecognised code (the honest answer is almost certainly
   "unmeasured", not "treat as Euclidean").
3. **Both surfaces agree.** The MCP/panel payload and the LDT-side composition must not disagree
   about what a parcel's decline says. Paired controls need a divergence test.

### Verify by violation

Pre-register your falsifiers and say what result would prove each wrong.

- The Hays parcel `48209:49000` must stop carrying Bastrop wording, and a genuine Bastrop parcel
  awaiting a layer-23 re-warm must still say so. Show both.
- `48021:70907` must stop resolving 20/100/100/100 and must carry the PUD message. A genuine
  Euclidean district must still resolve its table unchanged — show that too, because a fix that
  makes everything refuse is not a fix.
- Re-measure both populations (6 of 52, 1 of 4) after the change and report the new numbers.

### The three-question gate

In your close: what executes each control, what triggers it, what fails when violated, what bypasses
it. A second composition path that formats a decline without your helper is a bypass; name it if it
exists.

### Constraints

- No store writes, no deploys, no merges.
- Do not touch county 48491 in any store (restored from a point-in-time branch on 2026-09-17).
- Branch from current `origin/main` in each repo and declare the SHA. `legacy-design-tools` main now
  carries #715 (P-279) and `hauska-map` main carries #416 (P-272, P-291).
- The setback SOURCE ranking is settled and not yours to revisit: most-current-source-wins,
  `_decisions/2026-09-11_setback_source_most_current_wins.md`. You are fixing what a decline SAYS and
  when a table must not be emitted at all, not which source wins.

### Close

Declare: start commits, PR numbers, where each string and each district decision lived, the
falsifiers with both directions, the re-measured populations, the three-question gate answers, and
`leave_behind`.
