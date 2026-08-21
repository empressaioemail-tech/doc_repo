## Mission — R-09: make the launch-gate indicators capable of returning a red

You are a PLANNER. You fan workers, you adversarially review what they hand back, and you
assemble the result yourself. You do not commit.

### The defect, measured

Live `GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger` on 2026-08-20,
2,121,656 bytes, 254 counties x 14 rails = 3,556 cells:

    hasWriter        {"true": 3556}
    atomFamilyState  {"present": 3556}
    isPartial        {"false": 3556}
    displayState     {"not-yet": 2940, "satisfied-present": 540, "satisfied-absent": 76}

Three indicators are constant. Two of the five Texas-flush launch criteria are graded by two
of them: `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md` resolves `no-writer` by
`hasWriter: true` and `no-atom` by `atomFamilyState` reaching present. **Those two criteria
cannot fail.** A criterion that cannot fail is not a criterion.

`displayState` is the only one carrying signal and it is doing all the work.

Prior evidence you must confirm or refute rather than inherit: `hasWriter` and
`atomFamilyState` were reported hand-declared rather than derived; `isPartial` was reported
as NOT dead but ERASED at read time, with the store holding 18 partial cells (all zoning)
while the served payload shows 0. A read-time depth gate clearing the field would be a
different defect from a constant field, with a different fix. Establish which it is.

### THE SCOPE FENCE. Read it twice.

**You repair an instrument. You do not close a cell and you do not change what the gate
requires.**

Do not mint absence atoms. Do not run a scorer to move a number. Do not touch the launch
criteria. Minting provenanced absence to close cells was explicitly REJECTED by operator
ruling as gaming the gate.

If you conclude a criterion is WRONG rather than merely ungradeable, you file that for the
operator and stop. Changing launch criteria is an OPS-16 amendment and is operator-ruled.

### Seat and repository

The manifest and its scorers live in `legacy-design-tools`, which the **property seat** owns
per `_catalog/seat_register.json`. The serving path is `cortex-api`.

You may read anything. Before you write a line of product code, confirm with the operator
that you hold the property seat for this row, or hand your prescribed change to the seat that
does. Do not write into a repository you do not own. `P:/legacy-design-tools` is dirty on
`feat/s1-instrument-hardening`: never clean or stash it. Work in your own worktree.

### What done looks like

Each of `hasWriter`, `atomFamilyState` and `isPartial` **demonstrably takes more than one
value**, proven by producing a cell that reads negative. Not by reading the code and
concluding it could. By making one fire.

The proof is the deliverable. For each indicator: what you injected, which cell went
negative, the live payload showing it, and the restore.

Where an indicator cannot be made to fire because its input genuinely does not exist yet,
that is a finding and you state it as one: the indicator is STARVED, name the input, name who
would supply it, and file it. Do not fabricate an input to make a green look earned.

### The three mechanisms to distinguish, because the fix differs

**Constant by hand-declaration.** The field is set by a declaration file that says true
everywhere. Fix: derive it, or delete the field, because a constant field is worse than an
absent one.

**Erased in transit.** The store holds variation and the read path flattens it. Fix: stop
flattening, and add a divergence test between store and served payload.

**Starved.** The field is derived correctly and its input is never populated. Fix: populate
the input, or declare the indicator unavailable rather than serving a default.

Do not report one when you have evidence of another. Establishing which requires reading the
WRITE path, not measuring the output. Every real defect in this operation to date was found by
reading a write path; none were found by measuring output, because measuring output applies
the same predicates that admitted the defect.

### Adjacent facts that will confuse you if you do not hold them

`railCapabilities` carries a per-rail ceiling the grid ignores, scoring every rail against
254. `rrc-wells` has ceiling 1, `owner` 15, `mud` 186, `rail-corridor` 253. `rrc-wells` at
0/254 manufactures a 253-county hole that does not exist.

Bastrop `48021:zoning` was reported carrying the ENVELOPE rail's measurement verbatim; real
zoning there measures about 15.22%, not 99.77%.

There is no recompute route. `/api/county-ledger/recompute` and `/refresh` return the SPA
HTML fallthrough. What moves the manifest is a scorer run in hauska-engine. A console re-read
that does not move `computedAt` is evidence of staleness, never of a successful refresh.
Every figure from this endpoint is a claim about its `computedAt`, never about now.

Those are context. **None of them are your row.** Record any you confirm; fix none of them.

### Fan discipline

Split by indicator, one worker each, so no two workers touch the same write path.

Adversarially review every return. When a worker says an indicator now varies, ask for the
live payload and the cell id. When a worker says it cannot vary, ask which write path they
read and which line sets the value. A clean output is a reason to distrust the instrument,
not a result.

Workers do not spawn workers. Workers do not commit. You do not commit.

### Hard stops

No `--apply`. No store writes. No migrations. No deploys to production traffic. No absence
minting. No scorer runs that move a published number. If your change needs a deploy to
demonstrate, use a canary with `--no-traffic`, smoke it, and report; do not shift traffic.

### Return

A close naming: repo and commit for everything you read and everything you changed; for each
of the three indicators, the mechanism you established (hand-declared, erased, or starved)
with the write path and line that proves it; the proof-by-firing for each you could make fire;
and the filed finding for each you could not, naming the missing input and its owner.

State plainly whether the two launch criteria are now capable of failing. If the answer is
partly, say which part.

Tier 2 scratch to `_scratch/r09_gate_repair.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
