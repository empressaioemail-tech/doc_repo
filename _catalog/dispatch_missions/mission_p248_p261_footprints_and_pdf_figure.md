## Mission — P-248 then P-261: footprints drawn on every sheet, and the PDF prints only a verified figure

You launch no sub-agents (FAN-DEPTH 0). One lane in `hauska-engine`, two rows in order, one PR
per row. You do not deploy; the integration seat deploys and decodes the PDFs.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` (the tip was `e989af5`, P-210's
merge, when this was compiled). Branches `feat/p248-footprints-on-sheets`, then
`fix/p261-pdf-figure-verified` cut from main after the first merges. Declare each start commit.
Other rows may touch this repo (P-230 on the serving path, P-260 on the registry, P-262 to P-264
on envelopes); you stay inside `packages/engine-core/src/site-plan/` and the report pipeline
files named below.

### Row 1, P-248: the footprint is never drawn

The operator asked twice (QA-08 on 2026-09-15, again on 2026-09-16): "building footprint does not
show up on the pdfs and it should." Footprints reach the feasibility study only as text
("Existing structures", `site-plan/pdf/feasibility.ts`) and the X-ray dossier only as a count
("Mapped footprints", `dossier-author.ts`); `site-plan/site-model.ts` and the sheet drawings
carry no footprint geometry. The geometry exists at
`buildingFootprintFact.footprints[].footprintGeometry` (ML-derived, `verificationStatus:
unsurveyed`).

**Done:** every sheet that draws the parcel (site plan, feasibility, X-ray) draws each footprint
polygon, labelled with its source tier and unsurveyed status, with a legend entry; a parcel with
no footprint draws none and says so in the legend; a footprint that contradicts the appraisal
record carries the existing P-159 contradiction treatment.

**Instrument:** decode a regenerated PDF for 908 Pine (`48021:34137`, one ML footprint) and for a
vacant lot, the way P-219 and P-239 were verified; paste the decoded evidence.

### Row 2, P-261: the PDF prints a figure from any atom

The operator ruled on 2026-09-16 (A-180) that a buildable-area figure appears only when a
VERIFIED envelope atom backs it. `site-model.ts` (around line 781) sets `printedBuildable` to
`{kind: "atom"}` whenever an atom reference exists, the outcome is `buildable` with an area, and
nothing supersedes it. Nothing checks verification. The verification marker on the atom is
`depthWarmPromotion === "depth-warm-promoted-v1"` (with the `sourceCitation` fallback hauska-map
uses in `isDepthWarmPromoted`); there is no `depthWarmPromoted` field on the atom.

**Done:** `EnvelopeOutcomeInput` carries the promotion marker from wherever the site plan reads
the atom; `printedBuildable` is `atom` only when the atom is promoted, and otherwise `refused`
with a reason that prints no number; every renderer that prints a figure already reads
`printedBuildable` (P-159), so confirm that stays true (`feasibility.ts`, `layout.ts`,
`render.ts`, the narrative client). A fixture atom with `kind: "buildable"`, an area and no
marker prints no figure on any sheet; a promoted atom prints one. Decode both PDFs.

The same predicate is being added in legacy-design-tools under P-249; use the same fixture
answers so the divergence test there and yours agree, and name your predicate's file and line in
the close.

### Falsifiers, pre-register your answers first

1. 908 Pine's regenerated site plan shows the footprint polygon with its label and legend entry.
2. The vacant lot shows no footprint and a legend line saying none is mapped.
3. The unpromoted buildable fixture prints no figure anywhere, including the narrative.
4. The promoted fixture prints its figure on every sheet that printed one before.

### Do not

- Deploy.
- Change envelope geometry, the reconcile logic (P-249) or any atom.
- Launch sub-agents.

### Close

One close for the lane, both rows: snapshot per branch; files touched; both PRs with every CI
check's literal conclusion; the four falsifiers with decoded PDF evidence. `status`:
`closed-partial` until the integration seat deploys and decodes production PDFs. `probe`:
`{"notApplicable": "build lane, PRs not deployed; graded by decoding regenerated PDFs"}`.
`subAgents`. `leave_behind`.
