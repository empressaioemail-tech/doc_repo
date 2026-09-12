CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-159 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p159-pdf_cp1.json
  CP2: _inbox/2026-09-11_p159-pdf_cp2.json
  CLOSE: _inbox/2026-09-11_p159-pdf_close.json
