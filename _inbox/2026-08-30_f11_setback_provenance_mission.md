# F-11 — retire the setback values that no dimensional record supports

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Bounded SQL with a named `statement_timeout`,
builds, `vitest run`. A timed-out query is `unmeasured`, never 0.

**Read product code by ref.** `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, migration, or job start.

## Why this card exists, and what it unblocks

P4's setback / edge / envelope half is **held** on exactly one finding. Gate 8's
day-one assertions found `boundaryEdgeFact.setback.provenance:
"road-class-setback-table"` serving live on the Bastrop gold front edge. The mold
retired that path on 2026-07-29 — gate 3 is explicit that "roads identify WHICH
edge is front; they do not supply setback VALUES," and gate 4 requires setbacks
from "the jurisdiction's authoritative **per-parcel** dimensional record."

P4 lands setback tables and recomputes envelopes on top of setbacks. Minting on a
retired derivation propagates it. **This card is what releases that hold**; wells,
footprint and flood are already moving and are not affected.

## Two bad provenances, one shape

Both are a setback value whose source is not a dimensional record. Handle them
together — a card that fixes one leaves the other serving.

**1. `road-class-setback-table`** — a road class inflated into a setback value.
Retired by the mold 2026-07-29 and still on the wire.

**2. `storage-port-proof/phase-1a`** — the placeholder cohort. **188,103 of
346,676 `setback-rule` atoms**, and **Hays (34,454) and Williamson (124,499) are
100% placeholder.** Real sources are Bastrop 7,534 (2,315 layer-23 per-parcel),
Lockhart 337, Austin 150,702; McLennan has zero.

A related third, in scope because it is the same defect one derivation
downstream: **McLennan carries 65,814 envelopes derived from 0 setback rules.** An
envelope with no rule beneath it is a computed value with no input.

## Retirement order — consumers first, store second

ENFORCEMENT is explicit and the reverse order is what turns an invisible defect
into a visible regression:

1. **Enumerate the consumers.** Every read path that treats a `setback-rule` atom
   or `boundaryEdgeFact.setback` as authoritative. At minimum the bake's envelope
   compute, the draw's setback panel, and the depth-warm edge writer's gate. Name
   them all before changing any.
2. **Repoint or refuse each consumer.** A consumer that can no longer source a
   value refuses with the basis named — it does not fall back, and it does not
   substitute a road class.
3. **Then retire the derivation.** Not before.
4. **Prove retirement by decline.** ENFORCEMENT: "Retirement is proven by decline,
   never by documentation. A retired path returns a decline or 404 and **a CI check
   fails if it reappears.**" Add that check. A comment saying the path is retired
   is not a retirement.

## The existing atoms are the hard part — do not delete them

There are three populations and they get three different dispositions. Collapsing
them is the defect this whole program has been cleaning up.

| Population | Disposition | Why |
|---|---|---|
| Value from a real dimensional record (Bastrop layer 23, Lockhart, Austin) | **`value`**, keep | Sourced. Untouched by this card |
| Value from `road-class-setback-table` | **`refused`**, basis names the retired derivation | The payload positively contradicts it — a road class is not a setback |
| Value from `storage-port-proof/phase-1a` | **`unknown`**, basis names the placeholder | Nobody looked. `refused` would overclaim; `absent-verified` would be a lie |

**Do not delete a row to make a rail look clean.** Deleting converts a wrong value
into an absence, and absent / zero / unmeasured are three different states. Mark
them; let the serve path decide.

**Do not re-derive a setback from a road class to "fill" a refused row.** That is
the retired path wearing a new name.

## Measure before and after, per FIPS

Report `setback-rule` atom counts per county split by provenance, before and after.
The starting numbers above are from 2026-08-30 and are the reconcile target — a
material divergence means your predicate is wrong, not that the corpus changed.
Use an indexed `(entity_type, entity_id)` predicate; never an unanchored `LIKE`,
one already timed out at 90 s on this store.

## Acceptance — both directions

- A fixture edge whose only setback source is `road-class-setback-table` emits
  `refused`, and one backed by a real dimensional record still emits `value`. Both
  observed.
- A placeholder-provenance row emits `unknown`, not `absent-verified`.
- The CI check **fails** when `road-class-setback-table` is reintroduced, and
  passes on a clean tree. Run it against a deliberate reintroduction before
  reporting it working.
- The Bastrop gold front edge no longer serves the retired provenance, and gate 8's
  C7 assertion goes green **without C3 or C4 being touched** — if fixing this
  changes them, something else moved and you should say so.
- McLennan's 65,814 envelopes over zero rules are either refused or their rule
  source is named. Not silently recomputed.

## Do not

Delete atoms. Re-derive setbacks from road class or road adjacency. Invent PDD or
overlay scalars — the mold has PDD honestly declining and that is correct
behaviour, not a gap. Widen a check to admit a placeholder. Retire the store
before the consumers are repointed. Report retirement from a comment rather than a
decline. Start P4's setback half from this card — it releases the hold, it does
not run the mint.
