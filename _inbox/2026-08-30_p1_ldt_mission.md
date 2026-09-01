# P1 controls — legacy-design-tools (edge honesty on the wire)

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**
If a step looks like it needs a second agent, it needs a smaller step instead.

**You are authorized.** This card is compiled from the plan of record and carries
the operator's go for the work described. Do not stall waiting for permission you
already have. If you believe a step is wrong or unsafe, say so in the handback and
do the rest — do not silently narrow the scope, and do not refuse the whole card
over one item.

**Verification must terminate.** Every command you run exits on its own: builds,
typechecks, `vitest run`, or background-start plus `curl` plus kill. Never `watch`,
`serve`, `tail -f`, or anything that waits for a signal.

**Read product code by ref, not from the working tree.** Local checkouts here sit
on feature branches hundreds of commits behind and may not contain the files named
below. Use `git -C <repo> show origin/main:<path>` and
`git -C <repo> grep -n <pattern> origin/main -- <pathspec>`.

**Hand back, do not land.** No commit, no push, no deploy, no migration applied to
any store, no job started. Produce the diff and write the close artifact named at
the end of this dispatch. The planner commits and runs.


Two changes. One makes a dead field able to express refusal; the other stops
serving retired geometry. Both are serve-path, neither mints an atom.

Repo: `legacy-design-tools`. Read by ref (`git -C /p/legacy-design-tools show
origin/main:<path>`) — the local clone sits on a feature branch ~200 commits
behind and does not contain these files. No deploy. Produce a diff and a handback;
the planner commits and deploys.

## Why now

Measured on the live wire and in `hauska_mcp` on 2026-08-30: of **9,877** neighbour
ids Bastrop ships, **741 are sound — 7.5%**. Of 7,838 edges asserting a shared
boundary, 7,097 fail reciprocity (90.55%), and the failures are not near-misses:
median length disagreement 31.2 ft, median bearing error 85.4°. Every one of those
edges serializes with `state: "present"`.

## 1. `DrawEdge.state` must be able to say something other than present

`artifacts/api-server/src/lib/parcelDrawStub.ts` types `state: "present"` — a
literal with **one inhabitant** — and the push site hardcodes it. All 17 edges
across three live parcels read `"present"`, including two neighbours that are
demonstrably ray-casts across a street.

This is worse than a missing field. The key is `state`, **the same key overlays
use**, where it is a real union (`present` / `unknown` / `refused`, with `reason`,
`provenance`, `vintage`). Anyone grepping for a disposition on edges finds one and
answers yes; a model that learned from the overlays that `state` is earned reads a
refuted neighbour's `present` as earned.

Widen it to the real union. **Do this as a type, not a check** — ENFORCEMENT
prefers a discriminated union the compiler enforces over any check, because it has
no trigger to be missing and no call site to be absent. Every consumer should fail
to compile until it handles the other states, and the writer should be forced to
choose.

Two states, not one, and do not collapse them:
- A neighbour that is merely **unverified** (nobody cross-checked it) is `unknown`.
- A neighbour that is **refuted** — the payload contains a positive contradiction —
  is `refused` with `agentGuidance`. `unknown` there would be a lie in the other
  direction, because `unknown` means we did not look.

Also stop encoding absence by omission: `...(neighbor ? { neighbor } : {})` gives
three states ("none found", "found by probe", "found and contradicted") two
encodings between them.

## 2. Stop serving retired edges

**723 retired fixture edges ship live** — verified through `get_smart_site` on
`103387`, `104119`, `104121`. The serve path does not filter `status`. They
duplicate ring segments, corrupt the drawn ring, and on the **426** parcels
carrying edges from both adapters they supply the **only** neighbour id.

Filter `status` on the serve path. This is the one item that must land before P4
mints, and it is independent of the neighbour join.

## 3. Restore `sourceAdapter` to the projection

`sourceAdapter` is on `BoundaryEdgeFactPresent` and appears nowhere in
`parcelDrawStub.ts` or `parcelDrawFromReads.ts` — zero grep hits, absent from the
live wire. **19,159 of Bastrop's 26,846 edges are `descriptor-fixture`** against
~7,687 from the production writer. Neither the customer nor the model can currently
tell fixture geometry from production geometry. Carry it through.

## Not in scope, deliberately

- **Do not repair neighbour labels.** 74.5% of misses have no geometric counterpart
  at all, so there is nothing to overwrite from; and overwriting from a reciprocal
  is the same 3 m probe pointed the other way — one derivation laundered as two.
- **Do not add the `adjacencyKind ∈ {ROW, alley} ⇒ neighbour NULL` invariant.** It
  was measured and **refused**: 99.56% of those 2,039 pairs are touching at exactly
  0.0 ft, and it would null ~300 geometrically true ids. Alleys are *more* valid
  than ROW (35.92% vs 12.07%), so splitting by kind does not rescue it.
- **Do not touch the writers.** Depth-warm hardcodes `parcelNeighborPropId: null`
  (`emit-boundary-edges-from-warm.ts:120`); the fixture corpus came from
  `boundary-primitive/compute.ts:226`. Neither is this card.

## Acceptance — both directions

A fixture whose neighbour is refuted cannot emit `present`, and a gold shared
boundary that passes reciprocity may stay `present`. A retired edge is absent from
the served body and an active one is present. `sourceAdapter` appears on the wire.
`tsc` fails before the change is complete — that failure is the evidence the type
is doing the work.

## Do not

Deploy. Mint or repair atoms. Copy GIS or the bake ring onto `property-boundary-edge`
(P-53 is read-time and still binds). Widen `present` to admit a bad neighbour —
split the type instead. Report a check working because it passed once.
