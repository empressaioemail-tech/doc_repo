# P2b — the serve path says what the wire says

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Builds, typechecks, `vitest run`, or
background-start plus `curl` plus kill. Never a watch or a serve.

**Read product code by ref.** `hauska-map` and `legacy-design-tools` checkouts here
sit ~200-240 commits behind on feature branches and do not contain these files.
Use `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, or deploy.

## Why this supersedes the existing PE wiring card

Do not work from `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md`. It was written against
a recon that was measured wrong in three places:

- It says the grey box keys on **envelope nullity**. It does not. It keys on
  per-row `absent-uncovered` ∩ `inCoverageBlock` over `landUse` / `zoning` /
  `setbacks`, with `buildable` explicitly excluded. A lane following that card goes
  to the envelope code — the wrong file.
- It says PE "lies about a value it has". It does not. PE **refuses cortex zoning
  by design** (`atom-chain-to-facets.ts:1201`, anti-zombie), so copy alone will
  never surface PDD.
- It treats item 3's `partial` as a **deploy lag**. It is a missing change: #310 is
  merged but only widens a type union in `src/lib/layer-absence.ts`, and the BFF
  drops the token — `api/_lib/verdict-layer-merge.ts:5` keeps a private union
  (`absent-verified | lookup-failed | not-applicable`) that #310 never widened.
  Redeploying changes nothing.

## The through-line

Every item here is the same defect: **a disposition vocabulary that exists at the
section level and is unreachable at the leaf.** Five instances now. Fix them
together or the hole moves one field over.

## 1. Edge disposition (X2) — and item 4 lands WITH it, not after

`artifacts/api-server/src/lib/parcelDrawStub.ts` types `state: "present"` — a
literal with **one inhabitant**, hardcoded at the push site. All 17 edges across
three live parcels read `"present"`, including two demonstrable ray-casts. Of
9,877 neighbour ids Bastrop ships, **741 are sound (7.5%)**.

Widen to the real union **as a type, not a check** — ENFORCEMENT prefers a
discriminated union the compiler enforces, because it has no trigger to be missing
and no call site to be absent. `tsc` failing is the evidence it works.

Two states, do not collapse: a neighbour nobody cross-checked is `unknown`; a
neighbour the payload positively contradicts is `refused` with `agentGuidance`.

**Simultaneously**, `parcelDrawFromReads` maps every absent read as bare
`{state: "absent"}` and drops `sourceVintage`, so `verifiedAbsence` always returns
`unknown` / "provenance unknown; vintage unknown". **`absent-verified` is
unreachable** on flood, well and specialDistrict, and on pipeline plain-absent —
the only absent-verified the draw can emit today is pipeline present-outside.
Carry `sourceVintage` through. Shipping X2 while the overlays still cannot reach
`absent-verified` leaves the identical hole one field over.

Also stop encoding absence by omission: `...(neighbor ? { neighbor } : {})` gives
three states two encodings between them.

## 2. Four more one-liners, all located

From `_inbox/2026-08-30_p91_measurement5_field_inventory.md` items 3, 5, 6, 8:

| Defect | Fix |
|---|---|
| `attrs.landUse.desc` — reader keys `landUseDescription` / `desc`; bake writes `description` | align the key |
| `attrs.landUse.taxYear` — reader keys `taxYear`; bake writes `vintage` | align the key |
| `yearBuiltFromBake` reads `facets.yearBuilt` / `baseFacts.yearBuilt` — **keys no Tier-1 bake writes** | only the structural `cad_property` read can populate this; remove the dead fallback or point it at the real key |
| `manifestLayers` reads `facets.envelope.geojson` from a snapshot the loader already nulled | `layers` is always empty, `degraded` always true — **empty by construction**. Fix the read order or refuse honestly |

The manifest one is a dormant mechanism: a manifest that can never carry a layer
will never report one missing.

## 3. PE copy — scope, not wording

The grey box's **"setbacks" half is TRUE** (Rainmaker is in a 3,747-parcel
`no-setback-row` refused roster). Do not fix the string as a unit — replacing a
half-lie with a whole lie is worse. The defect is scope: a per-parcel row state
printed as "in this area".

Also: `inspectHighLevelLabel` returns the literal `"Zone"` for `landUse`; and
`"A1 — A1"` is minted inside PE by `description: landUseLabel ?? landUseCode` — a
defaulted field — then rendered again as a second datum at
`sheet-to-card-model.ts:526`. Three PE renderers of that one field disagree.

**Render `yearBuilt` with its source.** CAD says 2021 on Driftwood
`48021:8715051`; the listing says 2022. A bare number puts two contradicting
figures on one screen.

## 4. Restore `sourceAdapter`; add an absolute anchor

`sourceAdapter` is on `BoundaryEdgeFactPresent` and appears nowhere in
`parcelDrawStub.ts` or `parcelDrawFromReads.ts` — zero grep hits, absent from the
wire. **19,159 of Bastrop's 26,846 edges are `descriptor-fixture`.** Neither the
customer nor the model can tell fixture geometry from production. Carry it.

`parcelDrawStub` types `origin: "centroid"` with no absolute anchor, so every ring
ships in its own local frame. Add one. It is the same root cause behind the v3
multi-parcel view and behind X1 being unable to test endpoint coincidence.

## Acceptance — both directions, and on a live surface

A refuted neighbour cannot emit `present`; a gold that passes reciprocity may stay
`present`. A flood/well/specialDistrict absence with a known vintage emits
`absent-verified`; without one it emits `unknown`. `attrs.landUse.desc` and
`.taxYear` populate. `sourceAdapter` appears on the wire. `tsc` fails before the
change is complete.

**Customer-done is a live brief plus a deployed bundle marker, never a merged PR.**
#310 is the proof. Note the deployed PE bundle currently carries no marker and
nothing writes one — coordinate with the Gate 8 lane, which owns adding it.

## Do not

Deploy. Mint or repair atoms. Repair neighbour labels (74.5% of misses have no
counterpart to overwrite from). Add the `adjacencyKind ⇒ neighbour NULL`
invariant — measured and **refused**: 99.56% of those 2,039 pairs touch at 0.0 ft
and it would null ~300 true ids. Copy GIS or the bake ring onto
`property-boundary-edge`. Widen `present` to admit a bad value — split the type.
Work from the superseded PE wiring card.
