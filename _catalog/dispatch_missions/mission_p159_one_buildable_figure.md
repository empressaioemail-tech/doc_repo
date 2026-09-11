## Mission — P-159 PDF: one buildable figure per document or none, and a narrative that cannot contradict the report

You are the deepest worker in OPS-23 wave 1. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

One repo, property seat, registered in `_catalog/seat_register.json`:
`empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p159-pdf`,
branch `feat/p159-one-buildable-figure`, from `origin/main`. Declare the start commit before
you write anything. `P:/hauska-engine` is someone else's checkout; never build there. P-155
FEASIBILITY and P-167 VOCABULARY also change hauska-engine in this wave, and P-155 deploys the
same service (`hauska-engine-api`); you deploy from `origin/main` after your PR merges, never
from your branch, and the planner sequences engine-api deploys.

### The rulings you are implementing

R-2 (`_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`): the buildable envelope
POLYGON may be drawn wherever a district and a setback table exist; the buildable area FIGURE
and PERCENT stay refused on every surface until a buildable-envelope atom backs them. The
feasibility PDF is a surface. OPS-16 P-159: one buildable figure per document or none; the
percent computed from the figure printed; the narrative's footprint sentence generated from
the footprint fact state and never contradicting the data-quality note.

### The findings you are fixing (OPS-23 §2 F4 and F10)

FS-48021-34049 printed two buildable figures (19,052 and 20,349 sq ft) on sheets 1, 4, 5 and
8 for a parcel whose envelope is not atom-backed, and its sheet 2 narrative described an empty
lot on a parcel improved in 1906. The verification
(`_inbox/2026-09-11_ops23_wave1_verify_p159.md`) found the mechanism: two numeric sources,
four rendering surfaces, and no check between them.

### What is true today, verified 2026-09-11 at hauska-engine `79fa573`

Re-verify each line at your start commit; anything that has moved goes in `contradicted`.

- `packages/engine-core/src/site-plan/site-model.ts` carries two figures: LOCAL
  `buildableAreaSqFt` (547-550, the offset-ring area) and WARM `warmAreaSqFt` (564-567, from
  `inputs.envelopeOutcome.areaSqFt` when `warmKind === "buildable"`). `buildablePdfLabel`
  (588-597) prefers WARM over LOCAL on both branches; the non-provisional branch goes through
  `buildable-display-vocab.ts resolveBuildableAreaSqFt` (85-93), which also prefers warm.
- The percent is computed twice, always from LOCAL: `pdf/render.ts:1371-1374` (sheet-2
  summary row) and `pdf/feasibility.ts:699` (cover qualifier). Four surfaces on one document:
  cover headline (`feasibility.ts:706`, warm preferred), cover qualifier percent (699, local),
  the copied site-plan header stat (`render.ts:558-563`, local), the copied sheet-2 row
  (`render.ts:1375-1386`, local plus local percent). When warm and local differ, the cover
  headline and its own qualifier disagree two lines apart.
- The narrative is LLM output, on by default since 2026-09-09: `feasibility-author.ts:169-173
  generateFeasibilityNarrative` (`narrative-generator.ts`, in-process, model named at line
  124); `feasibility.ts:1248` prints `narrativeOverride?.text ?? model.package.narrativeSkeleton`.
  The prompt's rule 4 (`narrative-generator.ts:140`, "Never infer a vacant site from a missing
  footprint") is the only guard; the prompt's claim that an unmarked sentence "will be
  discarded" (137) is not implemented; the only refusal is zero citations (286-292). The
  payload (`narrative-section-client.ts:165-236`) sends BOTH `geometry.buildableAreaSqFt`
  (local, 186) and the verdict (230) whose text opens with `buildablePdfLabel`
  (`report-model.ts:263`): the model sees two numbers for one parcel.
- The footprint fact reaches the narrative as a STATE (`narrative-section-client.ts:146`
  sends `model.facts.footprint` whole; states populated at `report-model.ts:469-488`:
  `failed-this-run`; `clear` with consequence "The site reads as unimproved, so
  redevelopment is unlikely to require demolition." (478); `blocked-at-source` with "Existing
  structures are unknown, not absent." (483)). The facts page has a second-derivation guard,
  `footprintContradictsAppraisal` (`feasibility.ts:927-929`, applied 565-576) that replaces
  "unimproved" with "Sources disagree ... Do not treat this parcel as vacant" when the
  appraisal roll carries year built or living area. That guard does NOT reach the narrative
  payload; the "unimproved" consequence goes to the model verbatim.
- The only data-quality note is the flood one (`report-model.ts:329-336`).
- No test asserts that `buildablePdfLabel`, the sheet-2 row and the cover qualifier share a
  figure; no test asserts narrative text against a report figure or the vacancy rule
  (`__tests__/site-model.test.ts`, `pdf/__tests__/render.test.ts:188-194`,
  `__tests__/manifest-is-load-bearing.test.ts:322-338`, `__tests__/narrative-generator.test.ts`).
- The PDF is served by `services/engine-api` (`routes/parcel-terrain.ts` 601/704/710 under
  `/v1/property-nodes`), built by `cloudbuild.engine-api.yaml` into
  `us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api`.
  There is no DEPLOY.md for it; the Cloud Run deploy step is not in the build file.

### The change

1. **One source, decided by type.** The site model exposes ONE printable buildable figure,
   `printedBuildable`, as a discriminated union: `{ kind: "atom", areaSqFt, atomRef }` when a
   buildable-envelope ATOM backs the envelope, or `{ kind: "refused", reason }` otherwise. The
   LOCAL offset-ring figure never prints anywhere; it may still drive the drawn inset polygon
   (R-2 allows the polygon). At CP1 you establish, by reading the type at `site-model.ts:108-112`
   and its producers, whether `inputs.envelopeOutcome` can carry a live-derived envelope that
   is not an atom; if it can, `warmKind === "buildable"` is not proof of an atom and your
   union must key on the atom reference, not on `warmKind`. Say which in CP1.
2. **Every surface reads that one value.** Cover headline, cover qualifier, site-plan header
   stat, sheet-2 row: each prints `printedBuildable.areaSqFt` and a percent computed from it
   and the lot area, or prints the refused wording from the display vocabulary (`pdfLabel` of
   the `pending` kind, "pending — setbacks on file; buildable area not yet derived", or the
   kind that fits the reason) with NO percent. Delete both percent computations from local.
   Do not introduce a third copy of any display string; P-167 is moving the vocabulary into
   the atom-contract package in this wave and your change must land before or rebase after,
   never alongside a hand-edited copy.
3. **The narrative sees one number or none.** The payload carries `printedBuildable` and
   nothing else numeric about buildable area; `geometry.buildableAreaSqFt` leaves the payload.
   The footprint consequence sent to the model passes through the same
   `footprintContradictsAppraisal` guard the facts page uses, so "reads as unimproved" is
   never sent when the roll carries improvements. After generation, a deterministic check
   scans the narrative for square-foot figures and percentages: any figure that is not the
   printed one, or any figure when the document prints none, refuses the generated narrative
   and falls back to the skeleton with a declared note on sheet 2 saying the narrative was
   withheld and why. Silent acceptance is the defect; declared fallback is honest. The
   prompt's unenforced "will be discarded" sentence is either implemented or deleted.
4. **Tests that can fail.** (a) A fixture with warm and local figures that differ renders
   one figure on all four surfaces and one percent. (b) A fixture with no atom renders no
   figure and no percent anywhere, and the refused wording appears on each surface that
   used to print one. (c) A narrative containing a second figure is refused and the sheet-2
   note appears. (d) A fixture whose roll carries year built and whose footprint is `clear`
   sends the contradiction wording to the model, not "unimproved". (e) Non-vacuity: at least
   one real fixture parcel produces the `atom` kind and prints a figure.
5. **Sheet 2 and the lot's structures.** When the footprint fact is `blocked-at-source`
   or the guard fires, the narrative must say the structures are unknown or disputed, never
   absent; assert that on the deterministic skeleton as well as the generated path.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if the feasibility PDF for `48021:34049` after the
deploy prints two different buildable figures, or prints any figure or percent while that
parcel's envelope is not atom-backed, or its sheet 2 describes an empty or unimproved lot,
the row is not done.* And: *if the narrative check never fires on a fixture with a planted
wrong figure, the check is vacuous and the change is wrong.*

Deploy engine-api from `origin/main` after merge through its Cloud Build path (project
`hauska-prod-497015`, region `us-central1`), in the order the planner sets against P-155, and
read the serving revision by field name. Then produce FS-48021-34049 through the app (the
Bastrop refresh completes inside the current clients' budget; the Travis proof waits on
P-155) and extract its text (`pdftotext` or equivalent, exit-bounded): paste every square-foot
figure and percent found, by sheet, and the sheet-2 paragraph about structures, into the close.

The planner runs `node scripts/surface-probe.mjs --rows P-159 --observations <file>`. The
P-159 predicate reads, for `48021:34049`: `pdfBuildableFigures` (the distinct buildable
square-foot figures printed, as an array; empty when none), `pdfPercentWithoutAtom` (true if
any percent printed while the envelope is not atom-backed), `pdfSheet2ClaimsEmptyLot` (true if
sheet 2 says or implies the lot is empty or unimproved), each with `observedBy` and
`observedAt`. Your extracted text is the evidence behind each value.

### Close

`_inbox/<date>_p159-pdf_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must name the CP1 answer on whether `envelopeOutcome` can be non-atom, any
surface outside the feasibility PDF that still prints a local figure (the X-ray brief print
path in hauska-map is P-153's; name it if you find it printing), and the narrative refusal
count observed on the probe set.
