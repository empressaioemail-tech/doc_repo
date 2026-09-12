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

PLAN-ROW: P-158 (90_operations/OPS-16_texas_market_plan_of_record.md)
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


## Mission — P-158 FOOTPRINT: read the join, split the label, run the writer where it never ran

You are the deepest worker in OPS-23 wave 1. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running. Factory
store reads time out under writer load: verify a job from its execution status, never by
polling the store while it writes.

### Where you work

Property seat, registered in `_catalog/seat_register.json`. Create each from `origin/main`
and declare its start commit before you write anything:

- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p158-footprint`, branch `feat/p158-footprint-absence-split`. The join, its label, and the county writer live here.
- `empressaioemail-tech/hauska-factory`, worktree `P:/seat-worktrees/property/hauska-factory-p158-footprint`, branch `feat/p158-footprint-join`. The reconcile job that copies atoms into cells lives here.
- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p158-footprint-layer`, branch `feat/p158-footprint-layer`. Only the viewport county gate, if step 5 needs it.
- `legacy-design-tools-p158-footprint` is registered and you will probably not need it; cortex already reads the statewide atoms table. If you open it, say why in the close.

Other people's checkouts (`P:/hauska-engine`, `P:/hauska-factory`, `P:/hauska-map`) are never
built in. P-157 STRUCTURAL also runs factory jobs in this wave; the planner serialises factory
data runs across the two lanes.

### Three things the plan row got wrong, so you do not inherit them

OPS-16 P-158 was written from one read. The verification (`_inbox/2026-09-11_ops23_wave1_verify_p158.md`)
found:

- The decline string `staged-geometry-true-join-below-10pct-overlap-threshold` is emitted by
  hauska-engine, not the factory: `packages/engine-core/src/building-footprint/staged-footprint-join.ts:569-576`
  in `planCountyFromStagedGeometryTrueJoin`. The factory only vendors the label through the
  atom body (`src/jobs/parcel-building-footprint-reconcile.mjs:119-142` copies `absence.reason`
  verbatim into `basis.reason`).
- The denominator is the FOOTPRINT area, not the parcel area (`spatial-join.ts:85-99
  footprintParcelOverlapRatio`: intersection over `fpArea`; thresholds `constants.ts:21-22`
  `PRIMARY_OVERLAP_MIN = 0.5`, `STRADDLE_OVERLAP_MIN = 0.1`). A large parcel never dilutes the
  ratio. The predicate is not wrong for the reason the row supposed.
- Cortex does not read a Bastrop-only atom table. `buildingFootprintFactRead.ts:154-162`
  reads `atoms WHERE entity_type = 'building-footprint'` with an id-range join and no county
  filter. And the map already reads the one reader path: `ExplorerMap.tsx:259-277` fetches
  `/api/spine/retrieval/building-footprints/near-bbox` (proxied to the retrieval service,
  `server.ts:477`, present atoms only, `pg-storage.ts:552-597`). Under R-6 that is correct and
  stays; nothing moves the map off atoms.

What is actually wrong is two things. First, one label covers three join outcomes: no
candidate in the envelope prefilter (`stagedEnvelopeCandidatesSql` 231-248), a candidate below
10 percent, and a candidate that attached to a neighbouring parcel because
`joinStagedCandidatePairs` (367-400) gives each footprint to exactly one parcel, the best ratio;
a parcel that lost that contest at 0.49 is labelled "below-10pct". Second, the county writer
never ran for the counties that matter: the dated reading in
`packages/retrieval/src/rail-scoring-spec/specs.ts:246-281` (VERIFIED 2026-08-19) has
`tx_building_footprint` at 254 counties and 10,674,975 rows on the cortex store, atoms written
in 174 of 254 counties, and "Bastrop, Travis, Harris, Dallas, Williamson and Bexar all hold
zero". Every one of those numbers is a claim about its date; you re-measure before you act.

### What else is true today, verified 2026-09-11 at hauska-engine `79fa573`, hauska-factory `217b7dd`, hauska-map `6ab6914`, LDT `3950ce9b`

- Staged table `tx_building_footprint` (`staged-footprint-join.ts:37`) on the CORTEX store
  (`write-building-footprint-county.mjs:127-132` resolves `CORTEX_DATABASE_URL ||
  TXGIO_DATABASE_URL || DATABASE_URL`); atoms go to `DATABASE_URL / SUBSTRATE_DATABASE_URL`
  (219). Source: Microsoft Global ML Building Footprints (`constants.ts:1-16`). DDL
  `packages/engine-core/scripts/migrations/0075_tx_building_footprint.sql`. The loader named
  in that migration's header is absent from `origin/main` in both engine and LDT; it lives on
  the unmerged engine branch `feat/p2-4-tx-building-footprint-staging` (`e7145a3`). You do
  not need the loader if the table is populated; you do not merge that branch in this lane.
- Factory rail `buildingFootprint` (`rail-keys.js:64`, grain `companion`); writer
  `parcel-building-footprint-reconcile.mjs` (allowlisted `writer-allowlist.mjs:182-187`, kind
  `atom-reconcile`) reads `hauska_mcp.atoms` through `ATOMS_DATABASE_URL`, upserts
  `parcel_record_cell`, never writes a still-unaccounted cell (194). Its refusal codes include
  `WRITER_NOT_ALLOWLISTED`, `LAPTOP_WRITE_FROZEN`, `IDEMPOTENCY_DRIFT`.
- Absence kinds upstream, all `absenceKind: "no-footprint-feature"` (`types.ts:74`): the
  no-usable-ring case (541), the 10pct string (575), and the legacy ML path's
  `ml-spatial-join-below-50pct-overlap-threshold` (`plan-county-building-footprints.ts:148`).
  Halts that emit nothing: `STAGED_FOOTPRINT_COUNTY_EMPTY` (117), `STAGED_FOOTPRINT_GEOM_UNREADY`
  (124), `STAGED_FOOTPRINT_TABLE_MISSING`.
- hauska-map: overlay `building-footprint-overlay.ts:50-87`; fetch gated by zoom and by
  `countyFipsForViewportCenter` (`county-fips-viewport.ts:9-17`), a hardcoded list of four
  bounding boxes: 48021, 48453, 48209, 48491. Caldwell 48055 and 48309 are not in it, so the
  layer is empty there by construction. The toggle defaults off (`consumer-layers.ts:85`).
- Cortex `buildingFootprintFact` state field is `state`: `present` | `absent` | `refused`
  (codes `atom-miss`, `bind-conflict`, `atoms-store-not-configured`, `malformed-atom`). The
  probe fixtures show `absent` for every probe parcel on 2026-09-11.

### The change

1. **Measure first, by field, and paste it.** On the cortex store: `SELECT county_fips,
   count(*) FROM tx_building_footprint WHERE county_fips IN ('48021','48453') GROUP BY 1`, and
   the count of rows intersecting a 120 m envelope around each probe parcel's record point.
   On the atoms store: `building-footprint` atoms for the same two counties split by
   `body ? 'absence'`, using the id-range join, never `LIKE`. State the snapshot. If the staged
   rows exist around the probe parcels and atoms are zero, the writer never ran: that is the
   diagnosis and the rest follows. If staged rows are absent for a county, that is acquisition,
   and you say so and stop that county at CP2 rather than loading anything.
2. **Split the label into representable states (engine).** In `staged-footprint-join.ts` the
   absence branch emits one of three, each carrying its evidence: `no-candidate-in-envelope`;
   `overlap-below-threshold` with the best ratio measured; `attached-to-neighbour` with the
   neighbour's parcel key and both ratios. Never one string for three causes. Tests for each
   branch, and a not-vacuous test proving the third branch is reached on a fixture where a
   footprint straddles two parcels. The factory reconcile copies `absence.reason` verbatim, so
   the cells inherit the split with no factory change; read the reconcile job and confirm it
   does not filter on the old string (if it does, that is a contradiction and you fix the
   filter in the factory branch).
3. **Run the writer where it never ran.** The staged-geometry county writer for 48021 and
   48453: staging first, then the identical job on production, per the standing decision, with
   the counts it emits (present atoms, absence atoms by kind) pasted with their denominator
   (parcels planned). Then the factory reconcile for both counties, the same way. A halt
   (`STAGED_FOOTPRINT_*`) is a finding, not a failure to route around.
4. **Do not retune the threshold.** `STRADDLE_OVERLAP_MIN` and `PRIMARY_OVERLAP_MIN` stay.
   If step 1 shows the probe parcels' footprints losing the best-parcel contest, that is a
   labelling result the split now makes visible, and it goes in `leave_behind` with the ratios;
   the operator rules on attachment policy, not this lane.
5. **The map gate.** Only if the near-bbox call is empty for a probe parcel because of the
   viewport gate: derive the county for the fetch from the active record's `countyFips` when a
   parcel is selected, with the bounding-box list as the fallback; do not change the layer's
   default. If the gate is not the reason, leave hauska-map untouched and say so.
6. **Non-vacuity.** `buildingFootprintFact.state === "present"` for `48021:34049` (a house
   built 1906 stands on it) and `48453:113408` on the Property Explorer facets; the retrieval
   near-bbox around each record point returns at least one footprint.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after the writer and reconcile runs
`buildingFootprintFact` is still `absent` for `48021:34049`, the join is wrong, not the data;
stop and report the ratio and the branch the split label now carries for that parcel.* And:
*if near-bbox returns footprints around a parcel whose fact is `absent`, the atoms and the
join disagree and the facts endpoint is reading a different store or key than the writer
wrote; stop and report both keys.*

Deploy: the retrieval service is untouched unless step 5 changed nothing server-side (it
should not); engine changes ship through the county writer job's build, not a service deploy;
hauska-map, if changed, through the Vercel CLI with the live bundle confirmed. Read every
serving revision by field name.

The planner runs `node scripts/surface-probe.mjs --rows P-158`. Its P-158 predicate is two
machine legs: the facets' `buildingFootprintFact` state for `48021:34049` and `48453:113408`,
and `GET /api/spine/retrieval/building-footprints/near-bbox` around each record point through
smartsite.cloud, which must return at least one footprint. No observation file is needed.

### Close

`_inbox/<date>_p158-footprint_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry: the step 1 counts with their snapshot; the writer and reconcile
run ids for staging and production; per-kind absence counts after the split for both
counties; the attachment-policy question if any probe parcel lost a best-parcel contest; and
the unmerged loader branch, named, for the overseer to row or retire.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p158-footprint_cp1.json
  CP2: _inbox/2026-09-11_p158-footprint_cp2.json
  CLOSE: _inbox/2026-09-11_p158-footprint_close.json
