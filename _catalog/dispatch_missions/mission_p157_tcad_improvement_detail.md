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
