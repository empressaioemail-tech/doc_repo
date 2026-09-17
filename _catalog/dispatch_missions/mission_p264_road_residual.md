## Mission — P-264: the envelope re-derive, and the road residual that decides Phase 0's scope

You launch no sub-agents (FAN-DEPTH 0). You run the re-derive as a **DRY RUN** and return counts.
The apply needs the operator's explicit go and is not yours to take. You open one PR in
`hauska-engine` for whatever the instrument needs.

### Why this is available now, and why it is urgent

P-264 depends on P-260, P-262, P-263 and P-281. **All four are now in:** P-260 and P-263 merged in
hauska-engine #471 on 2026-09-17 (one setback registry the corpus owns, and envelope outcomes that
require a computed zero proof), P-262 merged earlier, P-281's leases are live. The row has been
blocked since 2026-09-16 and became available a few hours ago.

Its urgency is not the envelopes. It is that **the road residual is a scope decision for the whole
program, and it is currently unmeasured.**

`roads` and `edgeSignal` read `unmeasured` in all six counties with the reason "no P-264 road
residual artifact yet". Under A-177 the road-node pass comes after Phase 2 — but `RAIL_POLICY` in
`scripts/six-county-completeness.mjs` accepts that deferral **only while P-264's residual shows no
unruled road-blocked render** (`coupling: "road-residual"`). So the artifact either confirms the
deferral and takes 12 cells off the Phase 0 board, or it shows a city whose residual is dominated by
road-name and road-class failures, which by A-177's own clause pulls that slice of road work INTO
Phase 0 on the operator's ruling.

Nobody knows which. Finding out late is the expensive version of finding out.

### What to do

1. **Re-derive every envelope whose ledger now holds setbacks**, including the **123,706 reason-less
   zeros**, against ground truth P1 to P3. It runs through the labeller P-262 produces and
   **without** waiting for the deferred road-name dictionary — that is deliberate and it removes the
   scope contradiction where R5 depended on R1, which A-177 defers.
2. **The per-city residual IS the measurement.** Every parcel either draws a verified envelope or
   carries a **named** failure. There is no third outcome: a parcel that neither draws nor carries a
   named reason is an unmeasured parcel and must be reported as such, never folded into a failure
   class it was not shown to belong to.
3. **The residual artifact counts road-name and road-class failures per city**, separately from
   every other failure kind, because that is the split A-177's escape clause turns on. A city whose
   residual is dominated by them is the finding; name it with its numbers rather than reporting an
   aggregate that hides it.
4. **Dry run first, and the apply is the operator's.** This is a serialised heavy write when it
   runs. Under dry run it writes nothing, and you prove that rather than assert it — digest the
   population before and after and show the store unchanged, the way P-263's census did.

### Note what changed under you

P-260 replaced the engine's hand-kept 15-key jurisdiction table with the corpus's 43 keys, and
`no-buildable-area` now REQUIRES a `BuildableEnvelopeZeroProof` at the type level. So an envelope
outcome that previously asserted a zero with only a reason string can no longer be constructed. If
your re-derive produces outcomes that will not type-check, that is P-263's guard doing its job and
those cases are findings, not obstacles to route around. **Do not add a fallback so the derive stops
raising.** The raise is the correct behaviour.

Separately: 490,185 atoms already in the store assert a zero with no proof behind them. P-263's
census counted them and their correction is a separate operator-authorised apply. Your re-derive
must not silently fix or re-mint them; if your run touches that population, say so explicitly with
counts.

### Constraints

- No apply, no deploy, no merge. Dry run only.
- Heavy-scan lease keyed on the store host, released in a `finally`.
- Do not touch county 48491 in any store (restored from a point-in-time branch 2026-09-17).
- `hauska-engine` main has moved: it now carries #470, #471 and #472. Branch from current
  `origin/main` and declare the SHA. The working clone at `P:/hauska-engine` was 228 commits behind
  on 2026-09-17 — clone fresh into a NEW `P:/tmp/` directory.

### Verify by violation

Pre-register, before running: what result would prove your residual wrong? The failure mode here is
a failure class that absorbs everything, producing a clean-looking residual that means nothing. Show
that a parcel with an unrecognised failure lands in an explicit unclassified bucket rather than in
the nearest named class, and show the agreeing case — a parcel that genuinely draws is not counted
as a failure.

A residual that is conveniently small is a reason to distrust the instrument.

### Close

Declare: the start commit, the per-city residual with road-name and road-class counted separately,
the unclassified bucket, the 123,706 reason-less zeros' outcomes, the write-proof digests, whether
any city's residual is road-dominated (which is the operator's ruling trigger), and `leave_behind`.
