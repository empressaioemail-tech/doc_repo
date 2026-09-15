## Mission — P-226: the buildable envelope draws its front setback line into the street on curved frontages

### The finding you are acting on

Operator-reported from live `smartsite.cloud`, 2026-09-15, on a radius-street parcel: the
front line of the drawn buildable envelope lands ON or INSIDE the street frontage rather than
offset from the true front property line by the district's front setback. The rendered
envelope reads as extending into the right of way.

**Named parcel to work from: `48453:289990`, 2407 PRINCETON DR, Travis.** Princeton Drive
curves at that lot, and the envelope draws there today (the operator's screenshot shows the
amber inset and a front edge running along the frontage).

**A documented prior of the same geometry class, in the same county:** 2026-08-24,
17005 Simsbrook / `48453:280239`, where "a curved frontage digitized as several near-collinear
chords" made the server's derive emit an inset ring carrying zero-width out-and-back
excursions at each chord junction. That produced `stripRingSpikes` in
`apps/property-explorer/src/browse/envelope-overlay.ts`, which is a DRAW-TIME ONLY
compensation whose own comment is explicit: "The verbatim server geometry still flows to the
node store / export paths untouched."

So there is already one known case of curved frontage breaking this geometry, and the existing
remedy deliberately does not touch the source.

### FIRST TASK, and it decides who owns the fix: draw-time or write-time

**Do not start by editing the overlay.** Establish where the defect lives.

The inset polygon the map draws comes from the SERVER — the live derive
(`POST /brokerage/v1/place/buildable-envelope`, `labelEdges+derive`). `normalizeEnvelope`
reads the geometry the server produced; the client's only geometry work is `stripRingSpikes`
at draw time. So the bad front edge is plausibly computed server-side, in hauska-engine.

**There is a clean discriminator available and you should use it first.** The PDF export path
consumes the VERBATIM server geometry with no spike stripping, while the map applies
`stripRingSpikes`. Therefore:

- Generate a site plan for `48453:289990` and inspect its drawn front edge.
- **If the PDF shows the same front-line-into-the-street defect, the defect is WRITE-TIME**
  (server geometry), and it lives in hauska-engine's
  `packages/engine-core/src/geometry` / the edge-role labelling P-216's own leave_behind
  already named as an unreformed write-time defect.
- **If the PDF is correct and only the map is wrong, the defect is DRAW-TIME** and it is yours.

(The site plan for a straight-street parcel, `48021:34049`, renders a clean rectangular
envelope with correct offsets — decoded from the PDF 2026-09-15 — so you have a known-good
comparison of the same renderer on a non-curved frontage.)

**IF IT IS WRITE-TIME, STOP AND HAND BACK.** hauska-engine is claimed by another lane right
now (`p221-xray-feasibility-subset`). Do not write to it. Report the finding with the file and
function you believe owns it, and the integration seat will sequence it. A correct diagnosis
handed back is a complete result for this row.

### Done looks like

Either:

**(a) Draw-time, and fixed here.** On `48453:289990` the drawn front edge is offset from the
frontage by the district's front setback and never crosses it, proven by a fixture built from
that parcel's REAL ring that fails before the fix and passes after. Plus a second curved-
frontage parcel confirming it is not a one-parcel patch.

Or:

**(b) Write-time, and diagnosed here.** The file and function that computes the front-edge
inset is named, the reason the front edge lands on the frontage is stated, and the row hands
off to hauska-engine with the evidence. No hauska-map code is changed to hide a server defect.

**The row does NOT close by fixing the symptom at whichever layer is cheaper to touch.** Say
which layer owns it and act accordingly.

### A dormant mechanism you will find, and must not wire up by reflex

`insetParcelBySetbacks` in `envelope-overlay.ts` is exported, unit-tested, and **called from
nowhere in production** — its only references are its own test file. Its module comment
describes it as the fallback used "when the server gave setbacks + a real parcel ring but no
inset polygon." It is dead code.

It also computes a **uniform** inset — front, side and rear averaged into one distance. That
is explicitly an approximation for the visual. **Do not wire it up as the fix for this row.**
A uniform inset cannot produce a correct front setback by construction, so using it here would
replace a wrong line with a differently wrong line. If you conclude it should be deleted or
revived, say so as a finding; that is a separate decision.

### Falsifiers, pre-register your answers before you run anything

1. If the PDF for `48453:289990` shows the SAME defect as the map, the defect is not in the
   overlay and any fix you make in hauska-map is masking, not fixing. Say so.
2. If your fix makes the front edge correct on the named parcel but you cannot produce a
   second curved-frontage parcel where it is also correct, you have fitted to one ring.
3. If the drawn envelope's AREA changes as a side effect, check it against what the facets
   route serves for the same parcel. A geometry fix that silently moves a published figure is
   a new served-answer-contradicts-itself instance.
4. If the front edge becomes correct by moving the whole envelope inward uniformly, you have
   applied the uniform-inset approximation and not fixed the per-edge computation.

### Known traps

- **The envelope draw is entitlement-gated.** `handleEnvelope` computes
  `mayDraw = snap != null && isEntitled(snap)` and calls `setEnvelopeOverlays([])` when false.
  If nothing draws during your testing, confirm entitlement before concluding the geometry is
  broken.
- **hauska-map does NOT auto-deploy.** Vercel CLI from the REPO ROOT (the project's Root
  Directory is already `apps/property-explorer`, so deploying from inside it fails), from a
  clean clone at origin/main. The local `P:/hauska-map` checkout is hundreds of commits behind
  on a feature branch and must not be used.
- **Verify on the MAP, not the API.** The API read healthy for the entire duration of the
  2026-09-15 outage while the map was blank.

### Do not

- Do not write to hauska-engine. It is claimed.
- Do not wire up `insetParcelBySetbacks`.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State plainly whether the defect is draw-time or write-time and what established it. Name the
parcels you verified on the map. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).
