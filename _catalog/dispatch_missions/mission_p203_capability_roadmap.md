## Mission — P-203: the eight rails no county has, and whether a source exists at all

You are a lane of OPS-24. READ-ONLY. You build nothing, you write no code, you touch no store.
You do not spawn sub-agents. The integration seat supervises you and runs the verification.
Your deliverable is one artifact.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding you are acting on, measured 2026-09-14

Across the six counties in the serving ledger, twenty-one rails pass in ZERO counties. Four of
those are refused by ruling and about nine are mid-cutover. **Eight have no acquisition path
anywhere, and those eight are yours:**

```
easements   hoaDeedRestrictions   mineralRights   ossf
permits     salesHistory          terrain         treeProtection
```

### Why this is a different program from OPS-24, and why that matters to your scope

OPS-24 is per county: it takes a county from not-in-the-product to serving using writers that
already exist. Not one of its thirteen stages creates a rail. So it moves a county to the
ceiling and never past it, and onboarding a seventh county at today's ceiling buys eight more
empty rails rather than fewer.

Capability work is per RAIL. A rail built once applies to all 254 counties. That inverts the
economics, and it is why the single most valuable thing in your artifact is the per-rail answer
to **statewide or per-county**. A statewide source is one build covering Texas. A per-county
source is 254 negotiations and is a fundamentally different proposition. Say which, for each,
with evidence.

### What to produce, per rail

Whether a source exists in Texas at all. Its access mechanism, named concretely: a state
agency portal, a county clerk's records, a GIS service, a bulk file, a commercial licensor, or
nothing known. Whether it is STATEWIDE or PER-COUNTY. Whether it is public record or licensed.

Where no source is known, say `no-source-known` and say what you searched to earn that. An
evidenced absence is a perfectly good answer and is the honest one for at least some of these
eight. An unevidenced absence is not.

### Hard constraints on what you must NOT put in this artifact

- **NO COST ESTIMATES and NO TIMEFRAMES.** Operator ruling 2026-09-13. This mission's own row
  originally asked for cost and was corrected before dispatch. Order and dependencies, never
  dollars, never days. If you find yourself wanting to express difficulty, express it as
  statewide-versus-per-county and public-versus-licensed, which are facts.
- **Do not propose a build.** This is a roadmap, not a design. Naming what exists is the job.
- **Do not acquire anything, register for anything, or create an account anywhere.**

### Known context you must not re-derive

- The envelope family (`buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`,
  `envelopeDisclosure`) reads zero BY RULING R-2. It is NOT a capability gap, it is not one of
  your eight, and it must not appear in your roadmap as a gap.
- Cotality is EXTINGUISHED and Regrid is dead. Do not propose either, and do not propose
  re-credentialing them. Acquisition posture is uniform public record.
- Moody's CRE was declined 2026-07-07. Do not reopen it.
- `ossf` is on-site sewage facility permitting, which in Texas sits with counties and with
  authorized agents under TCEQ. `permits` and `ossf` may share a source; if so, say so, because
  two rails from one build changes the ordering.

### Falsifiers, pre-register your answers before you research

- If you conclude a source is statewide, name the single artifact or endpoint that covers all
  254 counties. If you cannot name one, it is per-county and you were pattern-matching on the
  agency being a state agency.
- If you conclude a rail is `no-source-known`, state what a positive result would have looked
  like. If nothing would have changed your answer, you did not search.
- If two rails resolve to the same source, that is a finding that changes the ordering and it
  must be called out rather than buried in two rows.

### Done looks like

One artifact in which each of the eight rails carries a source or an evidenced
`no-source-known`, a statewide-or-per-county determination, and a public-or-licensed
determination; plus an ordered roadmap whose ordering is justified by those facts and by
nothing else.

### Close

`_inbox/<date>_p203-capability-roadmap_close.json`, `planRows` `["P-203"]`, pointing at the
artifact, with `probe.notApplicable` naming this as a read-only scoping lane with no surface
predicate. `leave_behind` is required, and `none` is a valid and cheap answer.
