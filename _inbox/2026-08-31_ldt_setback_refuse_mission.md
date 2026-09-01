# LDT — honour the setback disposition the engine writes

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Builds, typecheck, `vitest run`. Never a watch or
a serve.

**Work an ISOLATED tree cut fresh from `origin/main` (`13ec82d4`).** Do **not**
work `seat/property-ctx-p1-ldt`, and do **not** work
`P:/seat-worktrees/property/legacy-design-tools-p1-edges` — both carry dirty
DrawEdge leftovers that are a separate card. Two writers in one checkout is how a
commit ends up describing one change and carrying another.

**Read by ref.** `git -C /p/legacy-design-tools show origin/main:<path>`.

**Hand back, do not land.** No commit, push, or deploy.

## Why this card exists

F-11 (engine PR #366, `293633a`) retires the `road-class-setback-table`
derivation and marks the placeholder cohort. It is correct and it is **not
sufficient**, because LDT is an unrepointed consumer:

```
artifacts/api-server/src/lib/boundaryEdgeFactRead.ts:379
    setback: lead.setback,
```

`lead.setback` is copied onto `boundaryEdgeFact` with **no provenance inspection
anywhere on the serve path** — `git grep road-class-setback-table origin/main --
'artifacts/api-server/src/**'` returns **zero hits**. So the engine can mark an
atom `refused` and this read serves the value regardless.

ENFORCEMENT: "Repoint consumers first, then retire the store. Reverse order turns
an invisible defect into a visible regression." The engine went first because the
derivation is there; this card is the repoint that makes the retirement real.

**Gate 8's C7 goes green when this lands, not before.** That is the acceptance,
and it is what releases P4's setback / edge / envelope hold.

## What to build

The read must carry the engine's disposition through instead of flattening it to a
value. Three populations, three outcomes, and they must not collapse:

| Atom provenance | Serve as | Why |
|---|---|---|
| A real per-parcel dimensional record (Bastrop layer 23, Lockhart, Austin) | **`value`** | Sourced. Unchanged |
| `road-class-setback-table` | **`refused`**, basis naming the retired derivation | The payload positively contradicts it — a road class is not a setback |
| `storage-port-proof/phase-1a` | **`unknown`**, basis naming the placeholder | Nobody looked. `refused` overclaims, `absent-verified` lies |

**Do not fall back.** A refused setback does not become the previous value, a road
class, a district default, or zero. It refuses and says why.

**Prefer the type over a check** where the shape allows it, as P2b did with
`DrawEdge.state`. A discriminated union the compiler enforces has no trigger to be
missing and no call site to be absent. If `tsc` fails until every consumer handles
the new states, that failure is the evidence it works.

## Watch for the second copy

`boundaryEdgeFactRead.ts:379` is the one confirmed at source. **It is unlikely to
be the only one.** Before you finish, enumerate every path that reads a setback
off an edge or a lead edge and reaches a served body — the envelope compute and
the draw's setback panel are the obvious candidates. A repoint that misses one
consumer leaves the retirement provably incomplete, and C7 will stay red for a
reason nobody expects. Name every consumer you found and every one you changed.

## Acceptance — both directions, and on the wire

- A fixture edge whose setback provenance is `road-class-setback-table` serves
  `refused` with the basis named. A fixture backed by a dimensional record still
  serves `value`. Both observed, not one.
- A `storage-port-proof/phase-1a` fixture serves `unknown`, never
  `absent-verified`.
- **Gate 8 C7 goes green against the Bastrop gold `48021:34137`, with C3 and C4
  unchanged.** If fixing this moves C3 or C4, something else moved — say so rather
  than accepting the greener board.
- Typecheck and the touched suites pass. Report the counts.

## Do not

Deploy. Delete or rewrite atoms — this is a read-path card. Re-derive a setback
from road class, road adjacency, or a district default. Substitute a prior value
for a refused one. Invent PDD or overlay scalars; PDD honestly declining is
correct behaviour, not a gap. Work the dirty `p1-ldt` or `p1-edges` checkouts.
Touch the DrawEdge leftovers — separate card. Report the retirement complete
because one consumer was repointed; enumerate them.
