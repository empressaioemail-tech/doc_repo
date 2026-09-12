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

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-157 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

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


## Mission — P-157 STRUCTURAL: TCAD improvement detail for Travis, and an absence that was never looked for

You are the deepest worker in OPS-23 wave 1. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running. Factory
store reads time out under writer load: verify a job from its execution status, never by
polling the store while it writes.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`. Create each
from `origin/main` and declare its start commit before you write anything:

- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p157-cad-ingest`, branch `feat/p157-tcad-improvement-detail`. The CAD loader lives here (`lib/cad-ingest`); LDT is the factory and acquisition repo by ruling.
- `empressaioemail-tech/hauska-factory`, worktree `P:/seat-worktrees/property/hauska-factory-p157-structural`, branch `feat/p157-tcad-improvement-detail`. The fill job and the coverage instrument live here.

`P:/legacy-design-tools` and `P:/hauska-factory` are other people's checkouts. Never build
there. P-158 FOOTPRINT also runs factory jobs in this wave; the planner serialises factory
data runs across the two lanes, and you run none until it says go.

### The finding you are fixing (OPS-23 §2, the Travis panel gaps)

The Travis panel shows no living area and no year built. The plan row says the roll export
omits them and a second file carries them. That is confirmed, and there is a worse half: the
factory and cortex both label the field `absent-verified` for Travis, which claims that
something looked. Nothing looked. ENFORCEMENT.md: never convert unaccounted to
absent-verified; an absence that was never looked for is a lie that passes every check.

### What is true today, verified 2026-09-11 at hauska-factory `217b7dd`, LDT `3950ce9b`, hauska-engine `79fa573`

Record: `_inbox/2026-09-11_ops23_wave1_verify_p157.md`. Re-verify each line at your start
commit; anything that has moved goes in `contradicted`.

- Rails (`hauska-factory/src/lib/parcel-record-engine/rail-keys.js`): `yearBuilt` (25),
  `improvementValue` (29), `livingAreaSqft` (30), all `group: "cad"`. No rail for stories or
  building class; do not add one.
- The factory does not ingest TCAD. `src/jobs/parcel-record-fill.mjs:85` reads
  `cad_property` on the cortex Neon store (`CAD_ROWS_SQL` 277-285 selects `year_built,
  living_area_sqft, improvement_value`). `src/config/cad-declared-vintages.mjs:34` declares
  `"48453": { taxYear: 2026, tier: "cad-export" }`.
- The loader is LDT `lib/cad-ingest`. `counties.ts:32-38` maps 48453 to `format: "pacs"`,
  bulk page `https://traviscad.org/publicinformation/`; `sources.ts:120` has no 48453 bulk
  source (`sources.test.ts:55` asserts undefined), so Travis is a manual `--file` load
  (`cli.ts:13-15`). `pacs/parser.ts:5-7`: input is `*_APPRAISAL_INFO.TXT`, "optionally
  enriched from `*_APPRAISAL_IMPROVEMENT_DETAIL.TXT` (year built + living area of MAIN AREA
  segments)"; 223-225 read the rollups only when `opts.improvementDetailFile` is set; 191-192
  write `yearBuilt: rollup?.yearBuilt ?? null, livingAreaSqft: rollup?.livingAreaSqft ?? null`.
  `cli.ts:123-135 discoverFiles`: `APPRAISAL_INFO.TXT` required, `APPRAISAL_IMPROVEMENT_DETAIL.TXT`
  optional and silent when missing; `--improvement-file` override at 21 and 346-350. Column
  spans in `pacs/layout.ts:107-117`.
- Whether the Travis load ever carried the detail file is recorded nowhere in either repo.
  The only figure is `_inbox/2026-09-02_parcel-scout-ossf_close.json:37`: living area
  `0 of 500,307 at TCAD source`, mechanism "the ingest pulled the certified export only",
  marked asserted, not proven.
- The fill writer (`src/lib/parcel-record-engine/ingest-existing.js`, a pinned compile of
  hauska-engine `packages/engine-core/src/parcel-record/ingest-existing.ts`) `applyCadScalar`
  91-162: `stampNumber("yearBuilt", cad.year_built)` (141); living area present-positive is
  stamped, zero stays `unaccounted`, and a CAD null is stamped `absent-verified` with basis
  `{ source: "cad_property", countyFips, propId, taxYear, vintage }` (148-149, 77-90).
  `isTargetedShape` (268) targets Travis null living area for sampling. The writer cannot tell
  "looked and found none" from "never loaded the file".
- Cortex `structuralFactResolve.ts:152-171` does the same: both fields null and county not in
  `BULK_PRIMARY_COUNTY_FIPS` ({48113, 48439}) returns `absent-verified` with the text "CAD row
  present but structural fields (living_area_sqft, year_built) are null". Source is
  `cad_property` (`structuralFactRead.ts:68-69`), with a parcel_record overlay for
  `livingAreaSqft` in `routes/propertyExplorer.ts:298-301`. Present shape is `state: "present"`
  with `livingAreaSqft`, `yearBuilt`, `taxYear`, `sourceVintage`; absent shape is `status:
  "absent"` plus `verdict`. The Property Explorer facets for `48453:113408` and `48453:474034`
  carry exactly that absent shape (probe fixtures, 2026-09-11).
- The per-rail state-count instrument exists and is dormant: `src/jobs/county-rail-coverage-report.mjs`
  (`--county=<fips>` repeatable, `--rail`), denominator `count(DISTINCT prop_id) FROM
  cad_property`, summarised by `src/lib/county-rail-coverage.mjs`; its only caller is its test.
- Laptop ingest is FROZEN and every publish lands on staging before the identical job runs on
  production (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`; the standing
  decisions). Read that decision before you plan the load.

### The change

1. **Acquire the public file.** From `https://traviscad.org/publicinformation/`, the current
   appraisal export that contains `*_APPRAISAL_IMPROVEMENT_DETAIL.TXT`. Public record, no
   credential, no relationship. Record the URL, the archive name, the file name, byte size and
   sha256, and the tax year the file declares (`propValYr`, span 13-16). If that year is not
   the declared vintage 2026, STOP and report; a mismatched vintage is not loaded.
2. **Load it through the cloud loader, not a laptop.** Per the ingest-freeze decision, the
   load runs where that decision says loads run, with `lib/cad-ingest` given both files
   (`--file` and `--improvement-file`), on staging first and then the identical job on
   production. The load leaves a record naming both files consumed (a manifest beside the run,
   or the run's log line with both paths and hashes); a load that cannot say which files it
   read is not a load. If the cloud loader cannot take the second file, STOP at CP1 and report
   the gap; do not run from a laptop and do not widen the freeze.
3. **Fill.** Run `factory-parcel-record-fill` for 48453 (staging, then production) so
   `yearBuilt`, `livingAreaSqft` and `improvementValue` cells move from `absent-verified` and
   `unaccounted` to `present` where the roll now carries a value. Do not touch the writer's
   rules; the file is what makes its `absent-verified` honest for the rows that stay null.
4. **Measure, before and after, with the denominator.** Run
   `county-rail-coverage-report --county=48453 --rail=livingAreaSqft` and `--rail=yearBuilt`
   before step 2 and after step 3, and paste both outputs. Give the instrument a trigger: a
   `src/cli.mjs` entry so it is invocable by name, with a self-test that fails on an empty
   county. Report the improved-parcel null rate as `null / improved` where `improved` is the
   count of `cad_property` rows with `improvement_value > 0`; state the counting rule.
5. **Serve.** Confirm the Property Explorer facets and `get_smart_site` show
   `structuralFact.state: "present"` with `livingAreaSqft` and `yearBuilt` for `48453:113408`
   and `48453:474034`. The facets carry `bakedAt 2026-07-24`; if the served path is baked,
   re-bake those parcels through the existing bake path in LDT and name it; if the served
   path reads live, say so. Never hand-edit a served value.
6. **Do not relabel.** No cell moves from `absent-verified` to `present` except by the fill
   reading a value. No cell moves from `unaccounted` to `absent-verified` by anything you do.
   If the detail file carries no MAIN AREA row for a probe parcel, paste that parcel's rows
   from the file and stop; the overseer decides.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after the fill `structuralFact` is not `present` with
a living area and a year built for BOTH `48453:113408` and `48453:474034` on the Property
Explorer facets, the row is not done; and if the county-wide null count on improved parcels
does not fall between the before and after readings, nothing was loaded, whatever the job
said.* State the second mechanism that would leave the panel unchanged after a successful
load (a baked facet, a cache, the overlay reading a different rail) and how you rule it out.

The planner runs `node scripts/surface-probe.mjs --rows P-157`. Its P-157 predicate is a
machine leg: the facets for both Travis parcels must carry `structuralFact` in the present
shape with non-null `livingAreaSqft` and `yearBuilt`. No observation file is needed.

### Close

`_inbox/<date>_p157-structural_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry: the load manifest (both files, hashes, run id, staging and
production); the before and after coverage outputs; and the class finding for the overseer
to row: the writer and cortex both emit `absent-verified` for structural fields without
knowing whether the detail file was in the load, in every PACS county loaded without it. Name
the fix location (hauska-engine `ingest-existing.ts` first, then the factory pin) and do not
fix it in this lane.

---

## Resumption (wave 2, ruled 2026-09-12) — after P-169's job exists

Read your own CP1 first (`_inbox/2026-09-11_p157-structural_cp1.json`) and the ruling
(`_decisions/2026-09-12_loaders_get_cloud_jobs_no_break_glass.md`). The three questions you
stopped on are answered: (a) no break-glass; the CAD loader runs as the Cloud Run job P-169
builds; (b) the TCAD file-name shape (`PROP.TXT`, `IMP_DET.TXT`) is a per-county source
declaration in `lib/cad-ingest/src/sources.ts`, which P-169 lands, never a rename or a regex
widening; (c) the certified export `2026 Certified Appraisal Export Supp 0_07182026.zip`
(557,228,168 bytes, declared tax year 2026) supplies BOTH the base roll and the improvement
detail, so the two pair; the preliminary 07072026 roll is not reloaded.

You do not start until P-169's close names the job and the GCS bucket path it reads from.
Then: upload the certified export to that path (public record, no credential), run the job on
staging with both entries declared, read the run record by field (files consumed with their
hashes, tax year read from the file, row counts), run the identical job on production, then
steps 3 to 6 of the mission above unchanged (fill for 48453, the coverage report before and
after with its denominator, the served surface, no relabelling). The falsifier and the probe
row are unchanged: `structuralFact` present with living area and year built for both Travis
probe parcels on the facets, or the row is not done.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p157-structural_cp1.json
  CP2: _inbox/2026-09-12_p157-structural_cp2.json
  CLOSE: _inbox/2026-09-12_p157-structural_close.json

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p157-structural",
    "planRows": ["P-157"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
