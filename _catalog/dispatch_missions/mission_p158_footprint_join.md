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

---

## Phase 2 (wave 2, ruled 2026-09-12) — merge the split, count before anyone buys a source

Read the wave-1 close first (`_inbox/2026-09-11_p158-footprint_close.json`) and the ruling
(`_decisions/2026-09-12_footprint_merge_421_count_before_acquiring.md`). What phase 1 found:
finding F8 was stale on the day it was written (atoms for 48021 and 48453 were minted
2026-09-07: 24,861 present / 46,640 absence and 72,919 / 323,543); the nearest staged
footprint to `48021:34049`, a downtown Bastrop house built in 1906, is 1,615 m away; 85.7
percent of a 3,000-parcel Bastrop sample has no candidate in its envelope; PR #421 (the label
split, CI SUCCESS) was left open for scope; the footprint writer has no sanctioned execution
path (now P-169). Phase 1's reading, a source coverage gap, and the overseer's reading, a
partial load of the staged layer, are the two mechanisms; the count decides.

1. **Merge PR #421** after rebasing on `origin/main` and re-greening on the current base
   (conclusion string `success`, not the `pass` text). The split labels are correct on either
   answer.
2. **Count, on the cortex store, by field.** (a) `tx_building_footprint` rows whose geometry
   intersects the Bastrop city limits polygon (`tx_city_boundary` or the layer the factory's
   `landing_parcel_jurisdiction` derives from; name it) and the same count for a comparison
   town the layer is known to cover; (b) rows within 200 m of the `48021:34049` record point;
   (c) rows per county for 48021 and 48453 against the 2026-08-19 reading (10,674,975
   statewide). Paste every query with its result. Then, separately, the Microsoft dataset's own
   count for a bounding box around Bastrop if it is reachable without a credential (the
   release is public); if it is not reachable, say so.
3. **Decide and say which.** If the layer is sparse inside Bastrop city limits while the
   source is dense there, it is a LOAD gap: the row's next step is a reload through P-169's job
   from the same dataset, and no second source is bought. If the layer is dense inside the
   limits and still empty within 200 m of the anchor, it is a SOURCE gap: report it with the
   counts and stop; a second-source acquisition is the operator's decision, not this lane's.
   Either way the anchor parcels stay FAIL on the probe until a writer run lands; say so in the
   close as closed-partial with the count as the deliverable.
4. **Do not run the writer.** The writer run is phase 3, after P-169's job exists; a laptop
   `--apply` is the thing P-169 exists to make impossible.

Pre-registered falsifier for phase 2: *if the count inside Bastrop city limits is within an
order of magnitude of the town's building count and the anchor still has no polygon within
200 m, the load-gap reading is wrong and the source-gap reading stands.*

The planner runs `node scripts/surface-probe.mjs --rows P-158 --observations <file>` with the
observation keys `footprintStagedCountInCityLimits`, `footprintStagedCountNear34049`,
`footprintGapReading` (`load` or `source`), each with `observedBy` and `observedAt`; the row's
machine legs stay FAIL until phase 3, and the close says closed-partial.

---

## Phase 3 (wave 3) — retag by containment, then write, then reconcile

Read `_inbox/2026-09-12_p158-footprint_close.json` first. Phase 2 merged #421 (`fcd77075`)
and the count decided the question with a mechanism neither reading named:
`tx_building_footprint.county_fips` is MISTAGGED near county lines. Inside Bastrop city limits
3,987 footprints exist and 1,182 (29.6 percent) carry 48021; the rest are tagged Lee 48287 or
Caldwell 48055. West Lake Hills' footprints inside Travis are tagged Hays 48209, all of them.
Eighty footprints lie within 200 m of `48021:34049`, the nearest at 1.63 m, none under the
writer's own county filter. Neither a source gap nor a sparse load; no second source. The
county tag was assigned by a coarse method (likely a bounding box) in the loader on the
unmerged engine branch `feat/p2-4-tx-building-footprint-staging`.

1. **Retag by true containment.** A one-shot, idempotent job on the cortex store that sets
   `county_fips` for every `tx_building_footprint` row by point-in-polygon (the footprint's
   centroid, or the polygon's largest-overlap county when it straddles) against
   `tx_county_boundary`, the same class of method `landing_parcel_jurisdiction` already applies
   on the parcel side. It runs through a Cloud Run job (P-169's pattern; never a laptop
   `--apply`), staging first, then the identical job on production, and leaves a run record:
   rows examined, rows retagged, per-county before and after counts. Fix the loader on the
   unmerged branch the same way, or record why that branch stays unmerged, so the next reload
   does not reproduce the bug.
2. **Prove the retag on the anchors** before any writer runs: the count inside Bastrop city
   limits carrying 48021 must rise to within an order of magnitude of the 3,987 geometric
   total; the 80 footprints near `48021:34049` must carry 48021; West Lake Hills' must carry
   48453. Paste the queries and the counts.
3. **Write, then reconcile.** The staged-geometry county writer for 48021 and 48453 through
   `hauska-engine-atoms-writer` under the write-slot lease (staging, then production), then
   `factory-parcel-building-footprint-reconcile` for both counties. The absence atoms the
   2026-09-07 run minted for parcels that now have candidates are superseded, not left beside
   the new present atoms; say how (supersededBy or delete-and-mint) and why.
4. **The predicate** is the original one: `buildingFootprintFact` present for `48021:34049`
   and `48453:113408` on the facets, and near-bbox returning at least one footprint around
   each. Pre-registered falsifier: *if after the retag and the writer run the anchor parcels
   still read absent, the join is wrong (the ratio and the branch the split label carries say
   how), and the row stops there.*
