## Mission — P-235: fix the envelope front line on curved frontages, at the write path

### What P-226 already established, so you do not re-derive it

P-226 ran as a read-only diagnostic and answered the ownership question. **Do not re-open it.**

- The defect is **write-time**, not draw-time.
- It lives in **legacy-design-tools**, `artifacts/api-server/src/lib/buildableEnvelope/
  {derive,geometry,edgeLabeling}.ts` — **not** hauska-engine. P-226 traced the live call
  (`fetchBuildableEnvelope` → `POST {cortex}/brokerage/v1/place/buildable-envelope`) and found
  the implementation entirely in this repo, a different function from hauska-engine's
  similarly-named `labelEdgesFromRoads`. That correction is the second time in two days a
  dispatch's stated repo was wrong, and both were caught by tracing the call.
- `insetParcelBySetbacks` in hauska-map is **confirmed dead code** and was deliberately left
  untouched. It computes a UNIFORM inset (front, side, rear averaged), so it cannot produce a
  correct front setback by construction. **Do not wire it up.**

### The candidate cause — named by P-226, explicitly UNVERIFIED

`geometry.ts`'s per-edge rectangle-strip union (`buildForbiddenStrips`) has **no mitred or
rounded join at ring vertices**, so it can UNDER-COVER the forbidden area at each convex joint
of a multi-chord curved frontage. That is a plausible mechanism for a front line that hugs the
street across a whole curve, and it is distinct from the already-fixed single-spike case that
produced `stripRingSpikes`.

**Confirm or refute this by reading the union construction BEFORE you edit anything.** P-226
did not verify it and said so. If it is wrong, say so and name what is actually happening — a
fix built on an unverified mechanism is a guess that passes its own test.

### The symptom, and the parcel

Operator-reported on a radius-street parcel: the front line of the drawn envelope lands on or
inside the street frontage rather than offset from the true front property line, so the
envelope reads as extending into the right of way. Work from `48453:289990`
(2407 PRINCETON DR, Travis), where Princeton Drive curves.

A documented prior of the same geometry class, same county: 2026-08-24,
17005 Simsbrook / `48453:280239` — a curved frontage digitized as near-collinear chords made
the derive emit zero-width out-and-back excursions. That produced `stripRingSpikes`, a
DRAW-TIME compensation whose own comment states the verbatim server geometry still flows to
the export paths untouched. **You are fixing the source that compensation was hiding.**

### Done looks like

On the named radius-street parcel the drawn front edge is offset from the frontage by the
district's front setback and never crosses it. A straight-frontage parcel is unchanged. A
second, independently chosen curved-frontage parcel is also correct.

### Falsifiers, pre-register your answers before you run anything

1. **A fixture built from the named parcel's REAL ring that FAILS before your change and
   PASSES after.** Not a synthetic ring shaped to your hypothesis — the real one.
2. **A straight-frontage parcel must be unchanged.** If straight lots move, you altered the
   general inset rather than the joint behaviour.
3. **A second curved-frontage parcel must also be correct.** If only the named one works, you
   fitted to one ring.
4. **If the drawn envelope's AREA changes as a side effect, check it against what the facets
   route serves for the same parcel.** A geometry fix that silently moves a published figure
   creates a new served-answer-contradicts-itself instance, which is the class P-232 just
   closed. Disclose or reconcile; do not let the two drift.
5. If you conclude the `buildForbiddenStrips` mechanism was wrong, the row still closes — with
   the real mechanism named. An honest refutation is a result.

### Known traps

- **Verify on the MAP, not the API.** The API read healthy for the entire 2026-09-15 outage
  while the map was blank. The PDF export path also consumes the verbatim server geometry with
  no spike stripping, so it is a second useful witness.
- **This repo does NOT auto-deploy.** A merge builds an image only; the deploy is a deliberate
  `workflow_dispatch` canary with the FULL 40-char sha then `shift-traffic`, owned by the
  integration seat.
- `stripRingSpikes` exists at draw time and only DELETES zero-width reversal spikes — it never
  moves or adds a vertex. Do not assume it is masking your fix; do not change it.
- One pre-existing, unrelated gap found by P-232 and NOT fixed: `derive.ts` does not read
  `max_lot_coverage_pct`'s own `not_specified` provenance, affecting real codified Bastrop rows
  today. If you are in `derive.ts` anyway, note it; do not silently fold it in.

### Do not

- Do not change any setback VALUE, table row, or jurisdiction routing.
- Do not wire up `insetParcelBySetbacks`.
- Do not edit hauska-engine or hauska-map.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State whether `buildForbiddenStrips` was the mechanism, with the read that establishes it.
Name the parcels you verified and what they drew. Close to `_inbox/` on doc_repo main and PUSH
it. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
