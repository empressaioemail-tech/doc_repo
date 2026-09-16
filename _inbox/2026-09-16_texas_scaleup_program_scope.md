---
id: 2026-09-16_texas_scaleup_program_scope
title: Texas scale-up — six counties complete, Burnet builds the farm, Bell and Milam prove it in parallel
date: 2026-09-16
status: rev 4 (2026-09-16), the plan of record for the scale-up. Revised from the final teardown (A-183), whose load-bearing findings the integration seat re-checked at source. Every Phase 0 item now has a row (P-252 to P-291, plus existing rows); build dispatches follow the order in section 12.
kind: program-scope
owner: nick
audience: the operator first; then the integration seat and the lane planners who will execute it
decision: _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md
supersedes_in_part: OPS-24 rev 2 section 3 (order); _inbox/2026-09-16_pickup_list_planned_not_done.md (absorbed here)
snapshot: |
  doc_repo main 8be28232. hauska-engine origin/main 2d85fee. hauska-factory origin/main bfb7303.
  legacy-design-tools origin/main ba39b4f5. hauska-map origin/main f7fbcbf.
  Factory store read read-only 2026-09-16 (FACTORY_DATABASE_URL_RO): parcel_gate_verdict latest per
  (county, rail); parcel_record_cell per city for zoningJurisdictionKey, zoningDistrict and
  setbackFrontFt. Live surface reads 2026-09-16 on the operator's paid-Solo account.
  Catalog reads: _catalog/tx_source_truth.json, _catalog/texas_roster_v1.json.
  Rev 4 re-checks (2026-09-16): hauska-factory 9171279, hauska-map 88ac6c5, legacy-design-tools
  0bf2377f, hauska-engine 422c7d3a; the zero-earned probe executed against an extracted factory
  tree at 9171279.
related:
  - _inbox/2026-09-16_scaleup_final_teardown_review.md
  - _inbox/2026-09-16_engine_api_tag_url_gate_bypass_finding.md
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-14_county_to_serving_WDLL.md
  - _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md
  - _inbox/2026-09-14_ops24_teardown_review.md
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
  - _inbox/2026-09-15_p225_census.json
  - _research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md
  - 80_adrs/adr_032_third_party_source_rights_envelope.md
  - scripts/six-county-completeness.mjs
  - _inbox/2026-09-16_farm_architecture_draft.md
  - _inbox/2026-09-10_ctx_third_party_review.md
  - _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md
---

# Texas scale-up — the work scope

## Rev 4: what the final teardown changed

The teardown (`_inbox/2026-09-16_scaleup_final_teardown_review.md`, landed `f9ed016c`) scored six
of ten theses as not surviving and four as holding with conditions. The integration seat
re-checked the load-bearing findings at source before accepting them (A-183). What changed:

1. **P-201 landed and the gate hole is still open.** An instantiated county with every rail
   `unaccounted` gets `excluded-not-applicable` on all 65 rails, and the real publish refusal
   (`requirePreBakeReadiness`) clears it, because its rail check tests only `verdict ===
   "refuse"`. The function this scope and OPS-24 law 2 named (`evaluatePublishGate`) has no
   production caller. **P-252** closes the hole (section 4.4).
2. **The Phase 0 exit measured the store, not the customer.** Section 5 is now the only exit
   definition, with a customer leg (**P-254**), a repaired ledger leg (**P-253**), the coverage leg,
   the road residual, and the operator's walk. Section 16's "exits when this command exits 0" is
   withdrawn.
3. **P-249 is corrected in four places** (section 4.2): the wire field is `depthWarmPromotion`,
   a string marker; 131,357 is an upper bound on a different population; the map change depends on
   a binding that must be read first; and its proof must observe the served surface, not the stores.
   The PDF figure gate moves to **P-261**.
4. **The P-216 risk line was wrong.** The 2026-09-15 blank map was a stale tab after a rollback
   (A-157). The staging proof is rebuilt around build identity and fresh browser contexts.
5. **R5 no longer waits on the deferred road-name work.** It runs in Phase 0 as **P-264**, and its
   per-city residual is the measurement A-177's escape clause needs. R8 splits: `parcelGeometry`
   stays in P-204; `roads` and `edgeSignal` stay deferred.
6. **S1 carries a rail allowlist.** LDT's dollar rails keep the legacy value when the ledger says
   `unaccounted` (**P-269**), so only the five setback rails flip (**P-256**).
7. **The setback campaign is the critical path to Burnet.** Its work unit is (city, district), the
   classification has a fourth category (a zoning map published only as a PDF), and a public-source
   sample of seven no-table cities found six zoned. **P-258**.
8. **Every item has a row.** Nine customer defects and seven X-items had a repo and no number.
   L-E's list is renamed XD-1 to XD-16 so it no longer collides with section 4.5's D1 to D4. The
   mapping is section 4.0.
9. **Missing machinery is carded:** stage and cost telemetry (**P-284**), a runner (**P-285**),
   job and heavy-scan leases (**P-281**), a divergence harness (**P-282**), the register as a
   closed checklist (**P-286**), Burnet's unreconciled facts (**P-287**), the target pair
   (**P-288**), branch lifecycle (**P-289**), and a two-county concurrency test (**P-290**).
10. **Found beyond the teardown.**
    - The doc_repo commit gates never fire in a seat worktree or on a merge (**P-280**).
    - 37 engine tag URLs skipped the gate token. The reports lane removed them and began rotating
      the engine key under its P-251; **P-279** adds the check that stops a recurrence.
    - Nineteen counties already serve from the July bake, Bell among them with 165,574 rows, so
      Bell enters Phase 2 as a migration county (**P-291**).
11. **One teardown point was rejected:** `publicRecordRefs` accepted as "P-242 coming soon" is
    consistent with P-242, which took records off the purchase surface on purpose.

## Rev 3: what changed and why

**The research wave** (`_inbox/2026-09-16_scaleup_research_wave_report.md`, landed `f1dd3e06`,
read at source in A-179) and **the operator's decisions** (A-180) changed the plan in these
places:

1. **The gate hole is zero-earned, not zero-row.** P-195's zero-row refusal is on main. A county
   whose cells exist but are all `unaccounted` still passes `evaluatePublishGate`, and that is
   exactly what a freshly instantiated Burnet looks like. **P-201 is the first gate row and must
   land before any new county's verdict is trusted.**
2. **P-249 is sized and sharpened.**
   - It unlocks **131,357** parcels.
   - It wires the structural `depthWarmPromoted` signal into LDT's reconciliation rather than
     leaning on reason-text heuristics.
   - Its negative control (a verified zero) exists nowhere in production, so it is minted on
     staging.
   - Waco and Austin have no envelope atoms at all, so P-249 does not reach them; they need a
     re-derive (R5).
3. **The area figure needs verification** (operator: "we need to verify"). A buildable-area
   figure appears only when a VERIFIED envelope atom backs it. An unverified July breadth-bake
   atom does not count. That is folded into P-249. Verified buildable atoms exist today only in
   Bastrop (3,935) and Caldwell (337), so the figure stays withheld almost everywhere until the
   verification pass (R5) runs.
4. **Farm storage is decided** (operator: "go with your rec").
   - Burnet runs on the shared stores with full stage telemetry.
   - Bell and Milam's storage is decided from Burnet's measured stage records.
   - The three preconditions for isolated stores are built alongside: generalise the frozen
     `PUBLISH_TARGETS`/`WRITER_TARGETS` pair, branch lifecycle and cleanup, and row and cost
     telemetry on the envelope and setback writers.
5. **Five orphaned cortex-prod staging branches are quarantined**, not deleted: renamed,
   suspended and disabled, reversible (`_inbox/2026-09-16_neon_branch_quarantine_record.json`).
   Four were always-on computes. **One more is still bound:** LDT's `STAGING_ATOMS_DATABASE_URL`
   points at the 2026-08-28 planner branch, so LDT staging reads a stale atoms copy.
6. **New customer-experience defects** from the card audit, listed in 4.5b.
7. **The blocker history is a register, not a memory.** 361 instances in 18 classes. It becomes
   the pre-bake audit's checklist, and a follow-up lane reads the 61 session files (2026-08-21
   to 2026-09-13) the wave left unread.

## 0. How to read this

This is the whole arc from where the six counties stand today to the rest of Texas. It is
written to be challenged before anything is built.

- **Measured** means read at source on 2026-09-16, with the instrument named.
- **Proposed** means a design choice the operator has not ruled on.
- **Owed** means a question this document cannot answer.

Section 13 lists where this plan is most likely wrong.

## 1. The goal and the sequence (ruled 2026-09-16)

```
PHASE 0   THE SIX COUNTIES COMPLETE
          Hays catch-up, the setback table reconciliation, and road nodes,
          plus every other gap, done and VERIFIED on the customer surface.
            |
            |  exit: section 5, every leg at once (ledger, customer surface,
            |        coverage, road residual, operator walk)
            v
PHASE 1   BURNET, WITH ITS CITIES, THROUGH THE FARM
          The farm is built and refined while Burnet runs.
          Burnet's run record is the speed baseline.
            |
            v
PHASE 2   BELL AND MILAM, IN PARALLEL, THROUGH THE SAME FARM
          Both merge into the ledger through the merge gate.
          Both must beat Burnet's baseline.
            |
            v
PHASE 3   THE REST OF TEXAS
          Gated on Phase 2's measured improvement and on merge capacity.

LATER     THE ROAD-NODE PASS (operator 2026-09-16, A-177)
          TIGER cross-check, a street-name dictionary, classification rules,
          and the roads and edgeSignal ledger rails. After Phase 2, unless a road
          issue blocks envelope or footprint rendering, in which case that part
          moves into Phase 0.
```

**The point of Phases 1 and 2 is the system, not the three counties.** The six counties took a
long time and taught a lot. The next three exist to turn that into a defined, repeatable process
that gets faster each time.

Four more rulings from the same conversation apply throughout:

- **Covered** means what actually serves the customer (P-210 settled). P-210's lane measured
  that 19 counties serve today from the July bake, 13 of them outside the six (P-291).
- **`agValuation` is Texas-wide.**
- **Cotality is part of the farm setup.**
- **The Hays symptom is a data problem in specific areas, not a map problem.**
- **Road nodes wait (A-177).** Customers do not care about them yet. The full pass comes after
  Phase 2, except where a road issue blocks envelope or footprint rendering.
- **The shortest path to an "ok" envelope comes first (P-249).**
- **Footprints must render on the site plan and every study (P-248).**

## 2. Where the six counties actually stand (measured 2026-09-16)

### 2a. Rails, per county, out of 65

Instrument: `parcel_gate_verdict`, latest verdict per (county, rail). This is the same read
`scripts/six-county-completeness.mjs` performs.

| County | Pass | Excluded | Refuse |
|---|---|---|---|
| Travis 48453 | 41 | 24 | 0 |
| Bastrop 48021 | 38 | 26 | 1 |
| McLennan 48309 | 37 | 27 | 1 |
| Williamson 48491 | 37 | 25 | 3 |
| Caldwell 48055 | 36 | 26 | 3 |
| Hays 48209 | 36 | 23 | 6 |

Hays rose from 31 to 36 when P-200 applied the setback group.

**Excluded in all six counties (21 rails):**

- **Withheld by ruling R-2:** `buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`,
  `envelopeDisclosure`.
- **No source anywhere (P-203):** `easements`, `hoaDeedRestrictions`, `mineralRights`, `ossf`,
  `permits`, `terrain`, `treeProtection`.
- **Ruled unavailable (P-209):** `salesHistory`.
- **Data held, but the ledger rail is empty (P-204):** `parcelGeometry`, `roads`, `pipelines`,
  `railCorridor`, `etjStatus`, `landUseDescription`.
- **Manufactured by us, not in the ledger:** `citationUrl`, `edgeSignal`.
- **Paused by ruling (P-242):** `publicRecordRefs`.

**Passing in some counties only:**

- `acreageSqft`, `landUseVintage` and `situsState` pass in Hays only. All three are trivial
  derivations, written for Hays in the P-178 and P-180 work and nowhere else.
- `maxImperviousCoverPct` passes in Travis only. That is correct by ratified design.
- `agValuation` passes in Travis and Williamson only. That is a defect under today's ruling.

**Real refusals, with counts:**

| Rail | County | Refusing parcels |
|---|---|---|
| `exemptionCodes` | Williamson | 187,186 |
| `exemptionCodes` | Caldwell | 8,958 |
| `landUseSource` | Williamson | 25,775 |
| `landUseSource` | McLennan | 23,182 |
| `landUseSource` | Bastrop | 21,398 |
| `landUseSource` | Hays | 636 |
| `landUseSource` | Caldwell | 196 |
| `acreageMethod` | Caldwell | 2,274 |
| `acreageMethod` | Hays | 433 |
| Hays envelope group (4 rails) | Hays | 27,949 each |
| `buildingFootprint` | Williamson | 1 |

### 2b. Setbacks at parcel grain

**The gate says setbacks pass in all six counties. At parcel grain they do not.** Instrument:
`parcel_record_cell`, one county at a time, primary-key range scan. It joins
`zoningJurisdictionKey`, `zoningDistrict` and `setbackFrontFt`. The column headed "No setback
row" counts setback cells written `absent-verified`, meaning "checked, none required", where the
city or the district simply has no row in our table.

| County | City | Parcels | Setback value | No setback row |
|---|---|---|---|---|
| Hays | Kyle | 19,855 | 14,583 | 5,272 |
| Hays | San Marcos | 18,601 | 14,540 | 4,061 |
| Hays | Buda | 5,876 | 4,231 | 1,645 |
| Hays | Dripping Springs | 3,886 | 1,923 | 1,963 |
| Hays | Woodcreek | 1,026 | 0 | 1,026 |
| Hays | Austin (Hays part) | 411 | 88 | 323 |
| Hays | no-table cities (zoning refused) | 4,610 | 0 | 4,610 |
| McLennan | Waco | 47,679 | 37,513 | 10,166 |
| McLennan | Robinson | 5,686 | 0 | 5,686 |
| McLennan | no-table cities (zoning refused) | 27,411 | 0 | 27,411 |
| Williamson | Round Rock | 38,677 | 27,198 | 11,479 |
| Williamson | Leander | 26,482 | 17,443 | 9,039 |
| Williamson | Austin (Williamson part) | 13,924 | 6,688 | 7,236 |
| Williamson | Cedar Park | 22,284 | 17,658 | 4,626 |
| Williamson | Hutto | 15,805 | 12,183 | 3,622 |
| Williamson | Georgetown | 38,898 | 37,836 | 1,062 |
| Williamson | Taylor | 8,504 | 8,109 | 395 |
| Williamson | Liberty Hill | 3,061 | 3,028 | 33 |
| Williamson | Pflugerville (Williamson part) | 97 | 67 | 30 |
| Williamson | no-table cities (zoning refused) | 5,824 | 0 | 5,824 |
| Bastrop | Bastrop | 5,775 | 2,731 | 3,044 |
| Bastrop | Smithville | 2,295 | 0 | 2,295 |
| Bastrop | Elgin | 3,740 | 3,690 | 50 |
| Caldwell | Luling | 2,887 | 0 | 2,887 |
| Caldwell | Lockhart | 6,466 | 5,426 | 1,040 |
| Caldwell | Martindale | 615 | 0 | 615 |
| Caldwell | no-table cities (zoning refused) | 549 | 0 | 549 |
| Travis | Austin | 203,218 | 150,102 | 53,116 |
| Travis | Lakeway | 8,202 | 0 | 8,202 |
| Travis | Pflugerville | 20,020 | 16,005 | 4,015 |
| Travis | Leander (Travis part) | 5,165 | 2,385 | 2,780 |
| Travis | Round Rock (Travis part) | 321 | 132 | 189 |
| Travis | Cedar Park, Elgin, Buda (Travis parts) | 3,634 | 3,619 | 15 |
| Travis | cities with no zoning layer | 35,365 | 0 | 34,909 (456 correctly refused) |

**By recorded reason, all six counties** (a second read, grouped on the cell's own `basis`):

| County | District has no row (`SETBACK_ROUTER_NOT_A_DISTRICT`) | City has no table | No-table cities |
|---|---|---|---|
| Travis | 60,115 | 43,168 | 17 |
| Williamson | 37,522 | 5,824 | 8 |
| Hays | 13,264 | 5,640 | 8 |
| McLennan | 10,166 | 33,139 | 19 |
| Bastrop | 3,094 | 2,424 | 3 |
| Caldwell | 1,051 | 4,065 | 6 |
| **Total** | **125,212** | **94,260** | **54 distinct** |

**219,472 parcels in the six counties carry a false "checked, none required" setback.**

- **District misses.** Every one carries the same reason (`SETBACK_ROUTER_NOT_A_DISTRICT`), so no
  "genuinely no setback" population hides among them. Some raw codes may still be non-districts
  (right-of-way, water); S0 breaks them down by raw code.
- **The "zoning refused" groups** in the per-city table are the no-table cities. These are places
  with neither a staged zoning layer nor a table. The writer keyed on the city, not on the refused
  zoning cell, so it wrote an absence instead of propagating the refusal.

**The 54 no-table cities, by county:**

- **Travis:** Lago Vista 12,745; Lakeway 8,259; Manor 8,081; Jonestown 2,769; Bee Cave 2,261;
  Mustang Ridge 1,826; West Lake Hills 1,543; Briarcliff 1,329; Point Venture 1,086; The Hills
  985; Rollingwood 603; Volente 497; Sunset Valley 332; Creedmoor 331; San Leanna 288; Webberville
  228; Coupland 5.
- **McLennan:** Hewitt 5,868; Robinson 5,728; Woodway 4,523; Bellmead 4,352; Lacy-Lakeview 2,628;
  West 1,589; Mart 1,495; Bruceville-Eddy 1,034; Lorena 1,012; Moody 1,000; Gholson 840; Beverly
  Hills 838; Riesel 740; Crawford 459; Hallsburg 335; Leroy 320; Ross 242; Golinda 95; Valley
  Mills 41.
- **Williamson:** Jarrell 2,817; Granger 784; Bartlett 672; Florence 549; Thrall 487; Coupland
  297; Weir 214; Thorndale 4.
- **Hays:** Wimberley 2,273; Uhland 1,045; Woodcreek 1,030; Niederwald 727; Mountain City 249;
  Bear Creek 195; Hays 117; Creedmoor 4.
- **Caldwell:** Luling 2,898; Martindale 618; Uhland 221; Niederwald 170; Mustang Ridge 157;
  Staples 1.
- **Bastrop:** Smithville 2,406; Webberville 17; Mustang Ridge 1.

**Each of the 54 is one of four things, and S3 must say which** (rev 4 adds 2b):

1. Zoned, with a staged layer: acquire the table.
2. Zoned, without a staged layer:
   - **2a.** A queryable endpoint exists but is undocumented: find it, then acquire the table.
   - **2b.** The official map is published only as a PDF (Woodway, per the teardown's search):
     locate an endpoint nobody documents, or digitise the map. That is a different kind of work
     with a different error profile, and it is recorded as such.
3. Genuinely unzoned: declare it through the per-city declaration (S7), so its cells become an
   earned `not-applicable`.

**A public-source sample of seven (teardown T4) found six zoned:** Lago Vista (the ordinance
says the official map is kept in the city GIS), Hewitt, Bellmead and Jarrell with layers,
Wimberley with a table in its ordinance, Woodway with a PDF map, and Hallsburg probably unzoned
(low confidence). The expensive category dominates. **The work unit is (city, district), not the
city:** every district needs its dimensional table extracted verbatim with an effective date, so
54 cities and 125,212 parcels are both lower bounds on the work.

**Cross-checks, two derivations agreeing:**

- The per-city read and the per-reason read give the same county totals. Bastrop, for example,
  is 5,518 both ways.
- Hays's 35,365 values and 18,904 false absences match the P-200 close's apply counts exactly.
- The completeness instrument's live run (section 16) reproduces the per-reason totals exactly.

**The P-225 census does not size this.** It counted zoning-layer FEATURES grouped by district,
not parcels. Its Williamson "10,206 uncodified parcels" is 37,522 at parcel grain. Size
acquisition from the ledger, never from the census.

**What the customer sees, measured on `48209:100698` (5292 Hartson, Kyle, district PC R2):**

- **MCP** returns `envelope: "absent-verified"`, which tells an agent it is confirmed there is no
  envelope.
- **The map** declines with "Setbacks pending re-warm from city per-parcel record ... pre-layer-23
  sources". That wording was written for Bastrop's layer 23 and is now showing on a Kyle lot.

This parcel is a planned community and falls under the PUD ruling (A-164).

**Where the false state is written** (hauska-factory `src/jobs/parcel-setback-cells.mjs`):

- `buildNoRuledTableCells` writes `absent-verified` on every setback rail when the city has no
  table.
- `buildResolvedCells` writes `absent-verified` when the district has no row in the city's table.

Both findings describe our corpus, not the lot. ENFORCEMENT names this exactly: "never convert
unaccounted to absent-verified to clear a gate."

### 2c. The envelope: why it draws in Pflugerville and not in San Marcos (CORRECTED)

**The first version of this section was wrong, and the operator caught it.** It said a polygon
draws only where depth-warm verified the envelope, which the engine's registry allows for three
cities. The operator's live example disproved it: 203 E Oxford Dr, Travis County (Pflugerville,
SF-S), draws an envelope. Re-measured the same hour:

| | Pflugerville `48453:427599` | San Marcos `48209:97658` |
|---|---|---|
| Map facets | `status: ok`, record path | `status: declined`, `envelope-unverified` |
| Live `POST place/buildable-envelope` | `ok`, a Polygon, "Buildable area from the property atom chain (engine source of truth): 5027 sq ft" | `no-buildable-area`, no geometry, "Setbacks consume the lot" |
| Front edge | "inferred from the **situs-named** street centerline" | "inferred from the **nearest** street centerline" |
| Setbacks | 25 / 7.5 / 20 / 15 from the record | 25 / 5 / 20 / 15 from the record |

**The mechanism, read in code and confirmed in the atoms store.**

- The live derive is `labelEdges+derive+atom-reconciled`. **When an envelope atom exists, its
  outcome wins.**
- The map draws the wedge only when that call returns `ok` with geometry, for an entitled viewer
  (`ExplorerMap.tsx` `handleEnvelope`).
- The San Marcos lot's atom: `source_adapter = cortex-tier1-snapshot-breadth-bake`, minted
  2026-07-24 and never updated. It reads `outcome: {kind: "no-buildable-area", areaSqFt: 0}` at
  an asserted 0.9 confidence.
- It was minted from a nine-edge county ring, with the front taken from the nearest street,
  because the lot's situs then carried no house number (P-175).
- The ground-truth registry (Bastrop, Elgin, Lockhart) limits **verified promotion**, not
  drawing.

**The population, read-only from the atoms store** (index-bounded, per county):

| County | "No buildable area" atoms | "Buildable" atoms | Other outcomes |
|---|---|---|---|
| Williamson | 239,491 | 42,945 | none |
| Hays | 91,401 | 10,742 | none |
| McLennan | 65,814 | **0** | none |
| Bastrop | 56,540 | 3,935 (depth-warm verified) | 1,785 provisional |
| Caldwell | 21,385 | 2,621 | none |
| Travis | 15,554 | 6,457 | 150,702 `provisional-front-edge` |

**What the 490,185 "no buildable area" atoms really are,** grouped on each atom's own `reason`:

| Class | Atoms | What it actually means | Right state |
|---|---|---|---|
| Unzoned: no district basis | 208,868 | nothing to compute | `not-applicable` with its reason |
| Not onboarded: no district on record | 153,775 | the city was not wired in July; many are now (Waco, Kyle, San Marcos) | re-derive from the current ledger |
| Zero with no reason, or copied from the tier-1 snapshot | 123,706 | shape-only computation, never verified | re-derive with correct labelling and ground truth |
| No per-parcel layer-23 row | 1,948 | Bastrop-specific | re-derive |
| **Road-node and edge-label failures** | **1,119** | Bastrop only, because only Bastrop ran verification | fix the road data, then re-derive |
| Inset and geometry check failures | 685 | ground truth caught a wrong inset | re-derive |
| Parcel id superseded | 84 | identity | retire correctly |

**This is the road-node problem the operator named, and it is larger than 1,119.** The Bastrop
reasons show what verification finds wherever it runs:

- **Street names that do not normalise:** "SH 95" against "State Highway 95", "W SH 71" against
  "State Highway 71 West", "SCHAEFER BLVD" against "Schafer Boulevard".
- **Road-class conflicts:** "classification residential != OSM tag county-roadway".
- **Unlabelled fronts:** "no-road-adjacency", "fresh labeling produced no front edge",
  "front-orientation-unresolved".

The 123,706 unexplained zeros were never put through that check. When they are, the same
failures will appear at scale. Road-node quality is therefore the gate on drawing envelopes
across the six.

**The customer consequence.**

- Wherever the ledger now holds setbacks and the atom still says zero, the envelope is declined.
  The panel says "not verified" and draws nothing.
- Waco carries 37,513 parcels with setback values and not one "buildable" atom.
- The exact per-city count of "setbacks on record, no envelope drawn" needs a join across the
  factory store and the atoms store. It is owed to the envelope and road-node lane (L-B).
  Subtracting one county total from another is not that measurement.

**Measured by the research wave (L-B, A-179):**

- **131,357 parcels** in the six have setbacks on record and no drawn envelope. The largest
  groups: Georgetown 23,484, Round Rock 17,761, Leander 17,045, Kyle 9,847, San Marcos 9,335.
  **Rev 4: this is an upper bound on what P-249 unlocks.** The instrument counts parcels with a
  `setbackFrontFt` value; P-249's predicate needs a district and a table. The five named cities
  hold 77,472 (59 percent) and all have layers and tables; the remaining 53,885 are where the
  predicate is least likely to hold. P-255 measures the predicate population. **Denominators
  differ:** the 490,185, 208,868, 153,775 and 123,706 figures above are atom counts; 131,357 is a
  parcel count. How many parcels are blocked by a reason-less zero is measured nowhere yet (P-255).
- **Waco and Austin have large setback populations but small gaps in that bucket, because no
  envelope atom exists for most of their parcels.** P-249 does not reach them; a re-derive (R5)
  does.
- **No verified-promoted `no-buildable-area` atom exists anywhere in production.** The
  verified-zero exemption has never been exercised on real data.
- **All 509,928 Hays boundary-edge atoms** carry "No setback table configured for jurisdiction
  descriptor".
- **Missing atom families:** `setback-rule` atoms in McLennan; `property-boundary-edge` atoms in
  McLennan, Travis and Williamson.
- The distinct-reason count across the six is **785**, not 654.
- Store-wide there are 848,381 `no-buildable-area` atoms and 559,084 `provisional-front-edge`
  atoms. The 490,185 figure above is correctly scoped to the six.

**Twin registries and twin labellers still stand, but they are secondary.**

- The engine's per-edge setbacks read its own jurisdiction descriptors ("No setback table
  configured for jurisdiction descriptor" on every San Marcos edge).
- The engine's depth-warm labeller does not group ring chords; LDT's does.
- Because the live derive defers to the atom, **fixing a labeller does not change what serves
  until the atom is re-derived.** That is pattern 1 of the reports card: a producer fix does not
  fix a product whose consumer defers first.

### 2d. Serving staleness

- **MCP** still serves the 2026-09-14 bake for the Hays test parcel, which predates P-200's
  setback apply. Its brief prints 25/5/20/15 while its draw says "setbacks unruled". That is
  P-230, and the same response contradicts itself.
- **The map's** snapshot for `48209:100698` dates from 2026-07-23.

A fix that lands in the ledger is not visible until serving catches up.

### 2e. Other defects measured in the same pass

- **`agValuation`:** the factory has real sources only for Williamson (WCAD) and Travis (TCAD).
  - Bastrop, Caldwell, Hays and McLennan hold **318,000 cells honestly `unaccounted`**. The
    writer's not-applicable sweep exists on main but has never run on them.
  - **The gate reports the rail `excluded` with an unaccounted count of 0 in those four
    counties.** That is the A-153 mechanism reporting a whole rail's gap as nothing, and it is why
    P-201 comes first.
  - Under today's ruling the sweep code must also be removed, so it can never write the false
    state.
- **`valueHistoryFact`** leaks Studio-gated dollars to Solo callers in Hays as in Bastrop (P-246).
- **The canon preamble compiled into every dispatch still says "COTALITY IS EXTINGUISHED".** Corrected
  at source on 2026-09-16.
- **The card does not name the city.** The operator's Pflugerville parcel read "Travis County",
  "203 E OXFORD DR" and "SF-S", so nothing told the customer which city's code governs.
  - The ledger holds `situsCity` PFLUGERVILLE, `situsZip` 78660, `cityLimits` Pflugerville and
    `zoningJurisdictionKey` pflugerville-tx.
  - The map adapter still takes the situs family from the cortex path (P-151, P-172), and the
    zoning row shows the district without its jurisdiction.
  - Customer-experience defect: the address line and the zoning and setback rows must name the
    governing city, from the ledger.

## 3. The five defect classes Phase 0 closes

| Class | What it is | Where it lives | Why it blocks scaling |
|---|---|---|---|
| **A. False earned states, and a gate that hides gaps** | `absent-verified` written where nothing established it (219,472 setback cells); an `excluded` verdict that reports 0 unaccounted over 318,000 unaccounted ag cells | factory setback writer (2 paths); the publish gate's excluded accounting; the unrun ag sweep | The gate counts them as done, so a county "passes" with its largest gaps hidden. Every farm run would inherit it. |
| **B. Twin registries and twin implementations** | Two setback-table registries; two edge labellers | engine jurisdiction registry vs setback corpus; engine vs LDT labelling | A fix in one leaves the other wrong, which is the exact fork the farm model exists to prevent. |
| **C. Road nodes and edge roles** | Wrong edge roles from ring artifacts; road and edge rails not in the ledger; depth-warm limited to three cities | engine depth-warm, boundary primitive, factory rails | No verified envelope outside three cities, so the map cannot draw what the record holds. |
| **E. Stale atoms overriding the ledger** | July breadth-bake envelope atoms (490,185 "no buildable area", mostly mislabelled) that the live derive defers to | atoms store; `place/buildable-envelope` atom reconciliation | A county's current setbacks never draw. Every farm would mint the same way unless the writer is fixed. |
| **D. Serving lag** | The surface serves a bake older than the ledger | engine bake (P-230), map snapshot | A correct write is invisible, so no close can be graded on the customer surface. |

## 4. Phase 0 — the six counties complete

Each item carries a done condition that can fail, its instrument, its repo and its
dependencies. **Rev 4: every item now has a row** (A-183). The row text in OPS-16 is the
authority where it and a table below differ.

### 4.0 Item to row

| Item | Row | Item | Row | Item | Row |
|---|---|---|---|---|---|
| S0, R0 | P-255 | R4 | P-263 | L6 | P-201 (landed), P-252 |
| S1 | P-256 | R5, R9 | P-264 | L7 | P-192 |
| S2, X4, X8, X10, D3 | P-257 | R6 | P-208 | D1 | P-230 |
| S3, S5, S8 | P-258 | R8 | P-204 (`parcelGeometry`); `roads` and `edgeSignal` deferred | D2 | P-217 |
| S4 | P-259 | H1 | P-265 | D4 | P-246 (done) |
| S6, R7 | P-260 | H2, H3 | P-211 | X1 | P-248, then P-261 |
| S7 | P-156, every wired city | H4 | P-175 | X2, X11 | P-270 |
| R1, R2 | deferred (A-177) | H5 | P-183 | X3 | P-250 |
| R3 | P-262 | H6 | integration seat | X5 | P-249 |
| C1 | P-213 (merged) | H7 | P-184 | X6 | P-271 |
| C2 | P-273 | L1 | P-204 | X7 | P-209 |
| C3 | P-274 | L2, L3 | P-266 | X9 | P-272 |
| C4 | P-275 | L4 | P-267 | V1 | P-176 |
| C5 | P-276 | L5 | P-268 | V2, V4 | P-283 |
| C7 | P-277 | new: dollar rails | P-269 | V3 | done |
| C8 | P-278 | new: C9, C10, C11 | P-279, P-280, P-281 | new: section 4.8 | P-253, P-254, P-282, P-284 to P-291 |

**L-E's defect list, renamed XD-1 to XD-16** (rev 3 cited it as D1 to D16, which collided with
section 4.5):

| XD | Defect | Row |
|---|---|---|
| XD-1 | buildable-area figure in payloads and disclosure strings | P-249 (map and MCP), P-261 (PDF) |
| XD-2 | Waco's panel declines what its own endpoint draws | P-249 (named fixture) |
| XD-3 | site plan asserts a miss that did not happen | P-222 |
| XD-4 | Bastrop "layer-23" wording on other parcels | P-257 |
| XD-5 | no-table cities decline while the payload holds the district | P-257 |
| XD-6, XD-7 | Williamson: no MCP snapshot, no composed address | P-271 |
| XD-8 | card does not name the governing city | P-270 |
| XD-9 | malformed situs breaks envelope drawing | P-272 |
| XD-10 | land-use contradiction within one payload | P-217 |
| XD-11 | setback citation without an effective date | P-270 |
| XD-12 | `salesHistory` absent from the MCP schema | P-209 |
| XD-13 | dollar value reaches an ungranted caller | P-246 (done) |
| XD-14 | "PUD"-coded districts resolve Euclidean setbacks | P-257, after the operator's ruling |
| XD-15, XD-16 | a positive control and a leave-behind | none needed |

### 4.1 Setback table reconciliation (class A and B)

| ID | Work | Done when | Instrument | Repo | Depends |
|---|---|---|---|---|---|
| S0 | **Parcel-grain census**, checked in as an instrument. Per city, per district: parcels, value, false absence, refused. Replaces P-225's feature counts for sizing. | The instrument runs for all six counties and self-tests (a city with no table must show a non-zero false absence). | new `scripts/setback-parcel-census.mjs` (from this session's query) | doc_repo | none |
| S1 | **Stop writing false absences.** No table becomes `unaccounted` with an acquisition need named. A router miss becomes `unaccounted` naming the district. Zoning refused propagates `refused`. PUD-class districts become `refused` with the PUD reason (S2). | Proven by violation on staging: a Woodcreek parcel reads `unaccounted`, a Kyle PC parcel reads the PUD refusal, a zoning-refused parcel reads `refused`. The gate then REFUSES setbacks with a count, in every county. That is the honest state. **Rev 4: the five setback rails only.** A rail whose serve path keeps a legacy value on `unaccounted` (the dollar rails, P-269) is out of scope. **This makes the Phase 0 exit unreachable until S3 finishes, by design.** | factory tests plus a staging read; `six-county-completeness` false-earned count | hauska-factory | P-252, S0 |
| S2 | **The PUD message** (ruled A-164) on the map, the MCP and the PDF. | A PUD, PC or PDD parcel reads "setbacks for this parcel are set by its planned-development ordinance, not a district schedule", on all three surfaces. | surface probe with PUD fixtures in Kyle, Bastrop and Williamson | LDT and hauska-map | S1 |
| S3 | **Acquire every acquirable district table**, largest parcel count first, by per-city ordinance research. Codes that fit an existing row get a routing entry. Codes that are genuinely new get a row, with the verbatim ordinance and effective date. | S0 shows false absence zero, and every remaining `unaccounted` district carries either an open acquisition task or a signed declared-unacquirable decision. | S0; the corpus's own row-verification step (Z4 in the Factory 2 runbook) | LDT `lib/adapters/src/local/setbacks/` and `@empressaio/setback-corpus` | S0 |
| S4 | **Austin's zoning source**, re-acquired from the public `PLANNINGCADASTRE` layer. `ZONING_ZTYPE` needs a base-code parser that never yields `CS` for `CS-1`. Add Austin SF-6. | Austin's census line is measured, and the parser's fixtures include the compound codes A-164 listed. | S0 plus parser tests | LDT | none |
| S5 | **Lockhart zoning source**: find a public replacement or record a declared-unacquirable decision. | Either the layer is live or the decision record exists. | decision record or S0 | doc_repo then LDT | none |
| S6 | **One setback registry.** The engine's jurisdiction descriptors read the same corpus the factory writes from, and a divergence test fails when they disagree. | On the Hays test parcel, per-edge setbacks match the record. The divergence test goes red when one side is edited. | divergence test | hauska-engine, corpus package | S3 in part |
| S7 | **Per-city zoning declarations** (P-156) for every wired city, not only Bastrop, so the gate's not-applicable accounting rests on data. **Rev 4: P-252's declared not-applicable basis reads these declarations**, so S7 and P-252 must agree on the shape. | Every wired city in the six has a versioned declaration. | the declaration loader's divergence control, with more than one city | hauska-factory | none |
| S8 | **Stale docs that mislead setback lanes:** LDT `AGENTS.md` STOP; the coverage doc on Bastrop routing; `zoning-layers.ts:22` Georgetown `RL`. | Corrected, with the Georgetown claim re-verified or removed. | read | LDT | none |

**S3's worklist has two halves, and they run in parallel** (rev 4):

- **The 54 no-table cities** in section 2b, 94,260 parcels, McLennan heavy (33,139). Each is
  classified first into one of the four categories in section 2b.
- **The district misses** in the wired cities, 125,212 parcels, Travis heavy (60,115), led by
  Austin (Travis and Williamson parts together, about 60,000), Round Rock, Leander, Kyle, Waco,
  Cedar Park, San Marcos, Pflugerville, Hutto and Bastrop. P-233's census counted 172 uncodified
  district codes.

The halves are not comparable workstreams. Travis's work is almost all district tables in cities
whose layer we hold; McLennan's is almost all no-table cities, the expensive half. "Largest
first" within one queue would leave McLennan to last, behind the exit Burnet waits on.

**Per (city, district) unit, four steps:** locate the governing instrument and its effective date
at source; determine what the official map is (a layer, a PDF, or a GIS-kept map published as a
PDF); find or fail the endpoint, recording a negative with its basis; extract the dimensional
table verbatim with citation and date, routing PUD, PC and PDD districts to the PUD refusal.

Smithville falls under the eCode360 scrape ruling.

### 4.2 The envelope family (classes B, C and E), with P-249 first

**Order, per the operator (A-177, A-180):**

1. **P-249: the unlock.** L-B confirmed the mechanism in `reconcileAtomEnvelope.ts`, and the
   teardown could not break it: the shape-only-zero versus verified-zero distinction is already an
   explicit predicate there. **The build, corrected in rev 4:**
   - **Read the atom's `depthWarmPromotion` field** and treat `"depth-warm-promoted-v1"` as
     verified, with the `sourceCitation` fallback hauska-map uses and its precedence stated. There
     is no `depthWarmPromoted` field on the atom: hauska-map reads `depthWarmPromotion`
     (`atom-chain-to-facets.ts:190`) and writes a `depthWarmPromoted` flag only into its own facet
     output. LDT reads neither today. **Four predicates read this fact in three repos**
     (hauska-map, LDT's `isMachineVerifyDiagnostic`, and the doc_repo instrument's string and
     boolean forms); the row carries a divergence test across them, on P-282's harness.
   - A `no-buildable-area` atom that is not verified-promoted stops emptying a live envelope that
     has a district and a table.
   - **The area figure appears only when a verified atom backs it** (operator: "we need to
     verify"), **on the MCP payload too.** Today `reconcileAtomEnvelope` keeps an unverified live
     geometry and the Pflugerville response quotes "Buildable area from the property atom chain
     ... 5027 sq ft". The PDF leg is P-261.
   - **Read first: what `envelope` is bound to** in hauska-map's `envelope-unverified` branch
     (`atom-chain-to-facets.ts`, around line 2080). If it is the live geometry, the LDT change
     alone draws and the map clause shrinks; if it is the atom's, the map clause is the real fix
     and must add geometry. Waco's panel declining what its own endpoint draws (XD-2) is a named
     fixture either way.
   - `validation-failed` must reach a named decline, never a silent empty.
   - **Proof, rebuilt in rev 4 around the served surface** (the stores were green through the
     whole 2026-09-15 incident):
     - the serving build recorded before and after by asset existence, never by `Age:`;
     - every measurement taken from a fresh browser context;
     - three branches per city, each asserting `status`, `declineReason`, `envelopeCovered`,
       whether geometry is present, and whether a figure is present: (a) an unverified zero on a
       parcel with a district and a table, such as `48209:97658`, draws with no figure; (b) a
       verified zero minted on staging (none exists in production) stays empty with a named
       reason; (c) a `validation-failed` ring declines with that reason and draws nothing;
     - a rollback rehearsal on staging, with the build identity shown to move both ways;
     - the unlock count reported against P-255's predicate population, with 131,357 kept only as
       the upper bound.
   - **What it does not unlock:** the 123,706 reason-less zeros become named declines, not
     draws, where the live derive fails its own geometry gates. Waco and Austin need P-264.
2. **P-248: footprints drawn on every sheet**, then **P-261** in the same hauska-engine lane: the
   PDF prints a figure only from a verified atom.
3. **P-262, one edge labeller and a ring scrub.** It is the rendering blocker on `48209:97658`, so
   it stays in Phase 0 under A-177's escape clause, without the road-name dictionary.
4. **P-263, the atom clean-up (R4)**, under P-281's lease.
5. **P-264, the verification re-derive (R5)**, which unlocks the area figure where verification
   passes and reaches Waco and Austin, where no atom exists. **Rev 4: it no longer depends on R1.**
   Its per-city residual counts road-name and road-class failures, and that count is the
   measurement A-177's escape clause needs.
6. **R1 and R2 are DEFERRED** to the road-node pass after Phase 2, unless P-264's residual shows
   a city where road failures block rendering; that city comes back for a ruling. **R8 splits:**
   `parcelGeometry` stays in P-204 (Phase 0); `roads` and `edgeSignal` stay deferred, accepted by
   the exit only while P-264's residual supports it (P-253).

**The P-216 risk, corrected (A-157).** Rev 3 said "P-216 took the map down with a one-branch
change here." The same corpus refutes that: the map-wide blank was a stale browser tab after a
rollback, and the unaliased P-216 build moved only four San Marcos parcels to `declined`. The
real risks here are deploy mechanics (a merge is not a deploy, a rollback is not a reload) and
proofs that read stores instead of the surface. The proof above is built against those.

The envelope family is every rail and atom that decides what may be built:

- **Rails:** `setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`,
  `setbackRules`, `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
  `maxImperviousCoverPct`, `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`,
  `envelopeStatus`, `envelopeDisclosure`, `edgeSignal`, `citationUrl`, `buildingFootprint`,
  `parcelGeometry`, `roads`.
- **Atom families:** `zoning-fact`, `setback-rule`, `buildable-envelope`,
  `property-boundary-edge`, `road-node`, `building-footprint`, `parcel-node`.

| ID | Work | Done when | Instrument | Repo | Depends |
|---|---|---|---|---|---|
| R0 | **Measure the draw gap per city**: parcels with setbacks in the ledger joined to their envelope atom's outcome and class. Also measure road-node coverage and quality per county against Census TIGER and county roadway data, as a second derivation. | A per-city table exists, from a checked-in instrument that reads both stores with index-bounded queries. | L-B instrument | doc_repo | none |
| R1 | **Road-name normalisation** used by front labelling handles state highways, farm-to-market roads, directionals, suffixes and misspellings, from a tested dictionary rather than one-off fixes. | Every Bastrop `facesAnswer` mismatch in the atoms store resolves; the fixtures include the ones quoted in 2c. | engine tests | hauska-engine | none |
| R2 | **Road classification conflicts** (OSM tag against county roadway class) resolve by a declared rule, not a decline. | The 1,119 Bastrop failures re-run and each resolves or carries a named residual. | engine tests plus a re-run | hauska-engine | R1 |
| R3 | **One edge labeller** (logical-edge grouping, curved frontage, situs-named front first), or a shared primitive with a divergence test. Plus a **ring scrub** for GIS artifact vertices. | Fixture `48209:97658` gets one front and a non-zero envelope that passes P1 to P3. The divergence test goes red when one path changes. | engine and LDT tests | hauska-engine, LDT | none (rev 4: R1 deferred; situs-named fronts only where names already match) |
| R4 | **Retire the mislabelled breadth-bake outcomes.** Unzoned becomes `not-applicable`; not-onboarded becomes whatever the current ledger supports. Writers can no longer emit `no-buildable-area` without a computed, verified zero. | Zero atoms carry `no-buildable-area` with a "no district" or "unzoned" reason. The false-zero guard in the completeness instrument goes red if one is written. | atoms store count; guard | hauska-engine | P-213 (merged), P-281 |
| R5 | **Re-derive every envelope** whose ledger now holds setbacks, through the fixed labeller, with ground truth (P1 to P3). This includes the 123,706 unexplained zeros. Serialised as a heavy write, dry run first, apply on the operator's go. | Every in-city zoned parcel either draws a verified envelope or carries a specific, named failure; the per-city residual is counted. | R0 re-run; its residual artifact feeds P-253 | hauska-engine jobs | R3, R4, S6, P-281 (rev 4: not R1) |
| R6 | **Fix the re-mint no-op (P-208)** and **enforce the warm preflight gate in every runner.** | A declined re-mint exits non-zero; a runner that skips the gate refuses to start. | violation tests | hauska-engine | none |
| R7 | **Registry rows** for every wired city in the six, so verified promotion is possible everywhere, not only in Bastrop, Elgin and Lockhart. **One setback registry (S6).** | Each row loads and its cohort count matches the ledger. | registry tests | hauska-engine | S6 |
| R8 | **Cut `roads`, `parcelGeometry` and `edgeSignal` into the ledger** (P-204), with each cell pointing at its atom. | **Rev 4: split.** `parcelGeometry` passes in all six (P-204, Phase 0). `roads` and `edgeSignal` are deferred with the road-node pass and accepted by the exit only while P-264's residual supports it. | six-county-completeness | hauska-factory | P-204 |
| R9 | **The surfaces draw what R5 produced** and keep an honest, specific decline elsewhere, in words that name the actual reason. (Rev 4: the wording clause moved to P-257, the single owner of the decline-wording surface.) | The per-city probe draws on a verified parcel and declines correctly on a failed one. | surface probe | hauska-map, LDT | R5, D1 |

### 4.3 Hays close-out (from P-200 and P-211)

| ID | Work | Done when | Repo |
|---|---|---|---|
| H1 | **Reader-slate resync for Hays, now two gaps (A-179).** (a) The engine's vendored slate lacks six Hays rails that LDT restored in P-180 (the four dollar rails, `livingAreaSqft`, `yearBuilt`): LDT holds 19 entries, the engine 13, unresynced since 2026-09-13. (b) Neither slate holds `setbackSideFt`, `setbackRearFt`, `setbackCornerFt` or `setbackRules` for Hays, nor the envelope four once H2 lands. The slate, `sourceCommit`, `vendoredAt` and the hash move in one commit, and a divergence test between the two copies is added so this cannot recur silently. | The engine and LDT slates are identical for 48209, and the setback rails serve from the record on the Hays test parcel. | hauska-engine and LDT |
| H2 | Envelope group apply for the seven Hays-only cities (27,949 parcels), then the six shared-name cities scoped `--county=48209` (county-bounded since PR #154). | The four envelope rails pass in Hays. | hauska-factory job (operator go) |
| H3 | 35,365 Hays cells with `dateBasis: "unreadable"` become the R-1 conflict shape. | No `unreadable` basis remains, with the conflict row visible. | hauska-factory |
| H4 | P-175 label leg: four Sturgeon addresses print empty labels. | All five print their address. | hauska-map |
| H5 | P-183 staging bake re-run and read-back. | Read-back artifact on file. | hauska-factory |
| H6 | P-178 and wave 6 paperwork: the seven reads, and the 24 commits and about 93 artifacts on `seat/dispatch-planner` reviewed and landed on main. | On main, reviewed. | doc_repo |
| H7 | P-184 Williamson two-namespace reconciliation (282,569 phantom nodes). | Measured and reconciled. | hauska-factory and LDT |

### 4.4 Ledger cut-overs and writer gaps

| ID | Work | Done when | Repo |
|---|---|---|---|
| L1 | P-204's other rails into the ledger: `pipelines`, `railCorridor`, `etjStatus` (built from the P-241 enumeration), `landUseDescription`. | Pass in all six. | hauska-factory, LDT |
| L2 | Trivial derivations for five counties: `acreageSqft`, `landUseVintage`, `situsState`. | Pass in all six. | hauska-factory |
| L3 | `citationUrl`: a writer exists in `parcel-r5-zoning.mjs`, yet the rail is excluded in all six. Diagnose, then fix. | Pass in all six; the "citation degraded" flag clears where a citation exists. | hauska-factory |
| L4 | **`agValuation` Texas-wide**: ag valuation for Bastrop, Caldwell, Hays and McLennan **comes from Cotality once its credentials and contract arrive** (operator, A-184; 318,000 cells unaccounted today). Delete the never-run not-applicable sweep so it cannot write the false state. Confirm Travis's join key (the writer's own open item; 373,406 values suggest it holds). | Pass in all six once the Cotality data lands; until then accepted only as `vendor-pending` (P-253). The instrument's `ag-valuation-no-source` guard stays at zero. | hauska-factory |
| L5 | `exemptionCodes` (Williamson 187,186; Caldwell 8,958), `landUseSource` (five counties) and `acreageMethod` (Caldwell, Hays) refusals: diagnose each. Fix it, or rule it an earned refusal with a count. | Each has a verdict. | hauska-factory |
| L6 | **P-201** (landed 2026-09-16, factory `9171279`): `excluded` split into not-applicable, mid-cutover and no-acquisition-path. **It does not close the zero-earned hole** (rev 4 item 1). **P-252** does: a rail live elsewhere with nothing earned here refuses unless a declared basis says it does not apply; the pre-bake rail check becomes an allowlist; the uncalled `evaluatePublishGate` is wired or retired; a checked-in all-`unaccounted` county must refuse. Dry run and staging first, because the honest state turns verdicts red. | P-252's fixture refuses; `maxImperviousCoverPct` outside Travis stays not-applicable. | hauska-factory |
| L7 | **P-192**: the six lease-less writers take a lease; the false `lease_released: true` is removed. | Owner, land use and flood re-run without throwing, under a lease with run records. | hauska-engine, factory |

### 4.5 Serving truth (class D)

| ID | Work | Done when | Repo |
|---|---|---|---|
| D1 | **P-230**: the surface serves the ledger's current cells, not a bake that predates them. Includes F25 (the `bakedAt` label). | A cell written on staging appears on the staging surface without a manual bake, with the cell's own vintage printed. | hauska-engine |
| D2 | **P-217**: a payload whose parts contradict refuses rather than printing both halves (Hays brief 25/5/20/15 against a draw saying "unruled"). | Proven on the Hays test parcel before and after. | LDT |
| D3 | Closed into **P-257** (rev 4), the single owner of the decline-wording surface. | The Kyle fixture reads a correct reason. | hauska-map |
| D4 | **P-246** (queued): no dollar value reaches an ungranted caller. | Solo read of both test parcels shows refusals. | LDT |

### 4.5b Customer experience items the research already found

| ID | Work | Repo |
|---|---|---|
| X1 | **P-248**: footprint polygons on the site plan, the feasibility study and the X-ray, labelled as ML-derived and unsurveyed | hauska-engine (after P-238) |
| X2 | **The card names the governing city.** The address line takes city and ZIP from the ledger (`situsCity`, `situsZip`), and the zoning and setback rows name the jurisdiction. The Pflugerville card read only "Travis County". | hauska-map, LDT |
| X3 | **P-250**: an address-keyed envelope call can return another county's parcel with no mismatch signal; a mismatch must refuse | LDT |
| X4 | Parcel-specific decline wording everywhere (no Bastrop "layer-23" text on a Kyle lot); PUD parcels read the PUD message (S2) | hauska-map, LDT |
| X5 | **Waco's panel declines an envelope its own live endpoint can draw** (XD-2, the 2026-08-28 Ruling B defect recurring on a 47,679-parcel city) | hauska-map |
| X6 | **Williamson: no MCP baked snapshot and no composed map address on any tested parcel** (XD-6, XD-7, 5 of 5 and 3 of 3). Root cause unread; possibly P-184. | engine bake, hauska-map; code read first |
| X7 | **`salesHistory` absent from the MCP schema** rather than declared Unavailable (XD-12, against P-209) | LDT smartsite-mcp |
| X8 | **No-table cities decline with "no zoning district observed"** while the same payload holds the district (XD-5) | hauska-map |
| X9 | **A malformed situs (", ,") breaks envelope drawing** for a parcel whose zoning and setbacks resolve (XD-9) | hauska-map, LDT |
| X10 | **"PUD"-coded districts** (XD-14). Settled without a ruling (A-184): they have no table row and the ledger marks them "none required", so they get the PUD message; P-257 traces the unsupported numbers L-E saw on them. | LDT, hauska-map |
| X11 | **Setback citation without an effective date** on Pflugerville (XD-11) | LDT |

The card spec (`_inbox/2026-09-16_scaleup-le_card_spec.md`) and the 39-bucket fixture list
(`_inbox/2026-09-16_scaleup-le_fixture_list.json`) are the acceptance standard for these items
and the per-city probe. Fifteen buckets and the PDF leg remain ungraded. **Rev 4: grading them is
a leg of the Phase 0 exit (section 5), through P-254.** The row for each item is in section 4.0.

### 4.6 Controls the six need before they can be a control group

| ID | Work | Repo |
|---|---|---|
| C1 | **P-213** blast-radius refusal in factory and engine writers. Phase 0 includes the largest writes this program has run. | factory, engine |
| C2 | Dead controls 4, 6, 7 and 8 (edge starvation self-compare; lookup key as proof; a registry validated then ignored; a tautological CI step). | engine, LDT, factory |
| C3 | P-195 leave-behinds: F26 (a never-acquired county grades 1 of 65 rails), F28 (160 of 391 cells excluded, unaudited, which P-201 and this instrument address), F29 (walk image older than gate image). | factory |
| C4 | P-212 follow-on: live-currency checks for the other five counties (P-275). Rev 4 correction: P-206 is "a provenanced retirement is served as `parcel_not_found`"; its open PR (LDT #699) relabels declines that already happen and refuses nothing new. | engine |
| C5 | **LDT `STAGING_ATOMS_DATABASE_URL`: REPOINTED 2026-09-16 (A-181)** to the live staging branch; the stale planner branch is quarantined. **Still owed (P-276), and "add a key" would silently do nothing:** `ROTATION_TARGETS` is a frozen two-key object whose loop also reads `branchRecords[key]` (from `staging-reset`) and `projectIds[key]` and writes to one GCP project. The fix is a third target, its branch record, its project id and its own project, with a test that fails when a consumed staging secret is missing. | hauska-factory |
| C6 | **Sub-agent depth: BUILT 2026-09-16 (A-181).** `FAN-DEPTH` is compiled into every dispatch and enforced at commit and at launch. Proven by violation. Armed in the next session. **Rev 4: the commit layer does not fire in a seat worktree or on a merge** (C10). | doc_repo (done, with C10 owed) |
| C8 | **ADD-084: `PRODUCTION_NEONDB_URL` exposed in a lane's output 2026-09-04, still unrotated** (version 1, 2026-08-28). Nine secrets across two projects share the production role, so rotation is a coordinated change: new password, all nine secrets, and every consumer redeployed. **Rev 4 (P-278): it blocks Burnet's first production publish** (teardown T9), which is operator stop point 2. **Planned for later** (operator, A-184): `_inbox/2026-09-16_add084_production_credential_rotation_plan.md`. The engine key exposed 2026-09-15 is rotating separately under the reports lane's P-251. | GCP, Neon, every consumer |
| C7 | **Main already carries six duplicate amendment ids** (A-016, A-060, A-061, A-136, A-145, A-146). Extend the allocation gate to A-, F- and R- prefixes, and reconcile the register's C15 count of three (P-277). | doc_repo |
| C9 | **Tag URLs that skip a security setting** (P-279). The 37 engine tags are gone (reports lane, P-251); a post-deploy check stops the next set. | engine deploy, every Cloud Run service |
| C10 | **The commit gates fire where lanes commit** (P-280): tracked `pre-commit` and `pre-merge-commit` hooks on the shared git directory run both gates against the worktree being committed. | doc_repo |
| C11 | **Leases for job executions and heavy-scan windows** (P-281), before P-263, P-264 and Burnet's first heavy stage. The register's C17 has 11 instances. | doc_repo tooling, factory and engine runners |

### 4.7 Cotality in Phase 0: measure, do not serve

| ID | Work | Done when |
|---|---|---|
| V1 | **P-176 bake-off** on the 60-parcel set: agree, disagree, absent or not-attempted per rail, against our cells. | Close artifact per the row's predicate, with the three falsifiers scored. |
| V2 | **Read the commercial agreement**: retention, reproduction, redisplay, and the billing unit. | The four ADR-032 fields carry values. ADR-032 is accepted or revised. |
| V3 | **Correct the canon** (`_STATE.md`, then the regenerated `DISPATCH_PREAMBLE.md`, and `00_current_state.md`) from "extinguished" to "REST dead, re-engaged for the farm". | The next compiled dispatch carries the corrected line. |
| V4 | **A vendor-versus-CAD disagreement ruling**, on the pattern of `_decisions/2026-09-11_setback_source_most_current_wins.md`. | Decision record exists. |

### 4.8 Instruments and machinery the plan depended on and nobody owned (rev 4)

| Row | What | Why it is needed | Repo | When |
|---|---|---|---|---|
| P-253 | The exit instrument repaired: a false-earned predicate per setback rail, the `no-source` rows tied to the roadmap by a check, the `deferred` rows tied to P-264's residual, any county, the rail list read from the factory | The ledger leg of section 5; the only check that can be pointed at Burnet | doc_repo | now |
| P-254 | `surface-probe.mjs` OPS-24 legs over the 39-bucket fixture list, with build identity and fresh contexts | The customer leg of section 5 | doc_repo | now |
| P-255 | The census instrument (S0) plus P-249's predicate population | Makes 219,472 re-runnable and gives P-249 a count it can be measured against | doc_repo | now |
| P-282 | A divergence harness for paired implementations | C2, 19 instances; P-249, P-260, P-262 and P-265 each land a pair on it | engine, LDT, factory | now |
| P-284 | Stage and cost telemetry, as a migration | OPS-24 law 5 and commitment 3; "Bell and Milam beat Burnet" as a query | hauska-factory | before Burnet |
| P-285 | The farm runner | Nothing runs a county end to end with per-stage records | hauska-factory | skeleton before Burnet's stage 3 |
| P-286 | The blocker register as a closed checklist | 18 of 19 classes have no executable check; C7 and C14 have none named | doc_repo | before Burnet's stage 2 |
| P-287 | Burnet's unreconciled facts: 59,785 parcels against 50,138 features; address points re-counted | No Find-box lookup can pass in Burnet without address points | hauska-factory | before Burnet |
| P-288 | The generalised target pair | A second farm cannot run under its own name | factory, engine | before Phase 2, if isolation is chosen |
| P-289 | Branch lifecycle | The six quarantined branches had no owner or expiry | factory, operations | before Phase 2, if isolation is chosen |
| P-290 | Two counties publishing in one hour, tested | The shared-store tolerance is a schema fact, not a tested one | hauska-factory | before Phase 2 |
| P-291 | The July bake and the farm: 19 baked counties, Bell a migration county | Customers in 13 counties outside the six are answered from an ungraded bake; ruled 2026-09-16 to keep serving with a visible "not yet verified" statement | engine, LDT | the statement and census now; Bell in Phase 2 |

## 5. Phase 0 exit: the definition of done

**Rev 4: this section is the only definition.** Rev 3's section 16 also said "Phase 0 exits when
this command exits 0"; that sentence is withdrawn, because the command reads the factory store
and the failures that matter to a customer are on the served surface.

**Phase 0 is done when all five hold at once:**

1. **The ledger leg: `scripts/six-county-completeness.mjs` exits 0 (COMPLETE)** after P-253.
   Every rail in every county is either `pass` or excluded under a named ruling whose coupling is
   checked, and no setback rail carries a false earned state.
   - Today: 11 of 11 self-tests; 65 declared rails match the live verdict table; UNMEASURED,
     never COMPLETE, on an empty county.
   - **Reachability, stated:** exit 0 is not reachable until P-256 has flipped the false absences
     and P-258 has cleared them, and until P-266 closes the three derived rails and `citationUrl`.
2. **The customer leg: `scripts/surface-probe.mjs` passes** after P-254. Every one of the 39
   fixture buckets is graded on the map, the MCP and the PDF, including the 15 ungraded today, and
   the open count of customer-visible defects (the XD and X lists) is zero or each is ruled.
   At least four fixtures per wired city (a codified district, a formerly uncodified district, a
   PUD, a promoted envelope) plus one unincorporated parcel per county. Every envelope fixture
   asserts `status`, `declineReason`, `envelopeCovered`, geometry presence and figure presence.
3. **The coverage leg** (ruling 2): every parcel in the six answers on the customer surface, and
   an address outside them says "not covered" rather than `no-hit` (P-205, P-210).
4. **The road residual:** P-264's per-city residual is on file, and every city where road
   failures block rendering is either fixed or ruled (A-177's escape clause, measured).
5. **The operator walks it** and signs off.

**A close graded only on a store instrument does not count toward this exit.** Every Phase 0
row that Burnet depends on is re-graded on the customer leg before Burnet starts (A-153: the gate
and the customer surface are not the same mechanism).

**What "complete" deliberately does not require.** It does not require values for rails with no
source anywhere (the P-203 eight, carried on the capability roadmap), for R-2 rails, or for
`salesHistory`. Those are declared, counted and visible. If the operator wants Cotality to fill
any of them in the six, the instrument's policy changes by ruling, not by edit.

## 6. The farm — what it is

**A farm is one county, with its cities, run through the one pipeline under a pinned manifest.
Every stage leaves a record. The county merges into the ledger through a gate that refuses a
mismatched manifest.** A defect found in a farm is fixed upstream, and every farm re-runs on the
new pin. **Zero county-local patches.**

**Storage, decided 2026-09-16 (A-180): Burnet runs on the shared stores.** L-D showed the shared
stores already tolerate two counties publishing in the same hour: `publish_runs` and `leases`
partition by county. The factory store's read-write endpoint scales to 8 CU and a separate
read-only endpoint (2 to 8 CU) now carries planner reads. **Bell and Milam's storage is decided
from Burnet's measured stage records.**

**Rev 4, two conditions on "safe" and one correction to "measurable":**

- **One heavy scan per shared database** (AGENT_CONTRACT section 4) has no registry and no check,
  and Burnet's stages 3 to 8 include full-county PostGIS phases. P-281 (leases for job executions
  and heavy-scan windows) lands before Burnet's first heavy stage. The register's C17 already holds
  a scheduled job writing the verdict table a walk was grading.
- **The shared-store tolerance is untested under concurrency.** P-290 tests it before Phase 2.
- **"Measurable" was false.** No cost column, table or writer exists (factory `9171279`). The
  isolation decision cannot be made from records that do not exist, so P-284 is a Burnet
  precondition, not a refinement.

**Three preconditions for isolated stores, built alongside so the choice is open when Burnet
reports:**

1. **Generalise the frozen target pair.** `PUBLISH_TARGETS` (factory `publish-target-env.mjs`)
   and `WRITER_TARGETS` (engine `writer-target-env.mjs`) each accept only staging and production,
   so a second farm cannot exist under its own name. New per-farm secrets are an operator stop
   point.
2. **Branch lifecycle and cleanup.** The factory store has never been branched. cortex-prod had
   five orphaned branches from the per-run staging era, now quarantined, and one stale branch
   still bound by a secret.
3. **Stage telemetry on the depth writers.** `parcel-envelope-cells` and `parcel-setback-cells`
   write no row or cost counts on any of 14 sampled runs. Rev 4: this is part of P-284, which
   covers all thirteen stages and is a Burnet precondition.

Rev 4 rows: P-288 (target pair), P-289 (branch lifecycle).

**The farm also includes, per the operator:**

- the bake audit (the pre-bake audit, stage 2), with the blocker register as its checklist once
  P-286 closes the class set and gives every class a check or an explicit audit-only line;
- the completeness check;
- the stage meter;
- the manifest and merge gate;
- the depth stage for the whole envelope family;
- the vendor stage for Cotality once the contract lands.

The corrected architecture map is L-D's
(`_inbox/2026-09-16_scaleup-ld_farm_architecture_report.md`), which supersedes the draft's
diagram where they differ.

## 7. Phase 1 — Burnet through the farm

**Measured today:**

- CAD rest-reachable.
- Geometry ingest passed, but read 50,138 features against 59,785 parcels on production. Nobody
  has reconciled it (P-287).
- A 2025 roll of 49,243 accounts.
- Address points: 0 when last counted (2026-08-08). Re-counted immediately before the run (P-287).
- `parcel_record`: 0 rows.
- Seven places:
  - **Marble Falls** has a verified-live zoning layer (261 features). It has no setback table
    yet, which is a MAKE item.
  - **Bertram, Burnet, Cottonwood Shores, Granite Shoals, Highland Haven and Meadowlakes** are
    `searched-and-absent`. The roster says every one is `NOT-FOUND-UNKNOWN-WHY`, which is stale.

| Stage | Burnet work | Built or refined during the run |
|---|---|---|
| 0 Recon and places | Declare all seven places. Fix the roster status. | per-place declaration feeding the gate |
| 1 Manifest | Pin the four lines. | manifest file and the check that stages carry it |
| 2 Pre-bake | Run the normalised register against Burnet's sources. | the runner |
| 3 Acquire | Parcels, roll with declared vintage, address points (StratMap statewide set), Marble Falls zoning, road nodes (checked against TIGER), ag valuation (from Cotality unless the Burnet CAD publishes it, A-184). Vendor stage only if V2 allows. | address-point loader for a new county; vendor stage gate |
| 4 Identity | Measure the CAD-to-GIS join. | the generalised H1 instrument |
| 5 Instantiate | 65-rail full shape. **P-252 must already be live**: with P-201 alone, the instantiated county reads `excluded-not-applicable` on every rail and clears the pre-bake rail check (A-183). | none |
| 6 Rail fill | Every writer under lease with run records. | none (L7 lands first) |
| 6b Depth | Registry row for Marble Falls, setback table for Marble Falls (MAKE), depth-warm. | depth stage |
| 7 Atoms | County atoms with identity reconciled. | P-193 |
| 8 Completeness | Two counts agree. | P-194 |
| 9 Gate | With the P-201 split. | none |
| 10 Publish | Staging, then production; retract-by-run-id proven once on staging. | retract verb (P-196) |
| 11 Probe and meter | A Marble Falls address draws a cited district, setbacks and an envelope. A Bertram address says no zoning layer is on file. Six-county-completeness generalised to take Burnet. | probe legs; instrument county list |
| 12 Merge | Through the merge gate. | merge gate, row versions |

**Burnet does not start until** the Phase 0 exit holds, and P-252, P-253, P-278 (the production
credential), P-281, P-284, P-286 and P-287 have landed, with P-285's runner skeleton in place.

**Burnet is done when** it reads COMPLETE on the generalised instrument, both addresses pass on
all three surfaces, the run record exists with every stage's numbers, and the defect-class list
names each class found with its fixture and its upstream fix. That record is the baseline.

## 8. Phase 2 — Bell and Milam, in parallel

**Bell 48027.**

- CAD rest-reachable. Geometry ingest not run. Not in the registry.
- **Rev 4: Bell already serves customers from the July bake** (165,574 Tier-1 rows; a real
  parcel, `48027:520164`, returns earned facts on `get_smart_site`), measured by P-210's lane.
  Bell is a MIGRATION county: the farm must take it onto the ledger, serve it from there, and
  retire the bake rows after, with a divergence test during the overlap (P-291). Milam and Burnet
  have no bake rows, so Phase 2 compares a migration with a new county. That is useful, because 13
  more baked counties will need the same path.
- In August it ran the older atom pipeline as an unzoned county: a 20-parcel certification and
  13,987 road nodes. It has a known boundary divergence (694 parcels north of the Census line,
  ruled "serve as-is"). It has no ledger rows.
- **Killeen** (euclidean, municode, verified layer, 5,480 features) and **Belton** (verified
  layer, 1,228) are wired candidates.
- **Temple is zoned and published on municode, but no layer was found.** It is the largest
  acquisition question in Phase 2.
- Nine smaller places were searched and found absent.

**Milam 48331.**

- CAD rest-unproven, so the pre-bake will likely read RED on it first.
- Geometry ingest passed (20,992). Not in the registry.
- Five towns, none probed.

**Prerequisites from Phase 1:** the merge gate, row versions, the farm runbook, and a parallel
safety test (P-290: two county runs cannot touch each other's cells, with a divergence test).
If Burnet's records call for isolated stores, P-288 and P-289 as well.

**Done when** both read COMPLETE, both merged through the gate without a conflict, and both beat
Burnet's baseline on the section 10 measures.

## 9. Phase 3 — the rest of Texas

Not scoped here. It is gated on Phase 2's measured improvement and on the merge capacity it
reveals. The national data layer (federal terrain, flood, roads, boundaries, footprints: the "L3
fabric" from the 2026-09-13 card) can be carded any time. It has no dependency, and it is what a
county with no appraisal district gets.

## 10. Speed: how "improved" is measured

**No baseline exists for the six counties.** Their onboarding was never metered. **Some of the
telemetry is not captured today either** (L-D): wall-clock is recoverable from `runs` joined to
`termination_records`, but the envelope and setback writers record no rows and no cost. That
telemetry is a Phase 1 precondition. Burnet's run
record is the first baseline. **No estimate appears here; only measures.**

| Measure | Per | Why |
|---|---|---|
| Operator minutes | stage and county | the scarce resource; the target is monotonic decline |
| Wall-clock | stage | where the pipeline actually waits |
| Upstream fixes required | county | falls as the pipeline matures; the farm model's health signal |
| Defect classes found | county | new classes should trend to zero; repeats mean a fix did not generalise |
| Re-runs per stage | county | instability indicator |
| Dollars (compute plus vendor) | county | commitment 3: under $200 plus one hour of human review per jurisdiction |
| Fix absorption | integration seat | fixes merged and verified per unit of time; this bounds parallel farms |

**Phase 2 passes the speed test** when Bell and Milam each come in under Burnet on operator
minutes per 10,000 parcels and on upstream fixes required, with fix absorption keeping pace with
two farms.

## 11. Cotality in the farm

- **Where it sits:** a vendor stage between acquire and rail fill. It fills only BUY rails the
  county's own CAD and public sources leave empty. CAD first, vendor second, with disagreements
  resolved by the V4 ruling.
- **How it is metered:** it accrues on acquisition, so the meter sits on the fetch path (ADR-032
  `accrualTrigger`). A cached serve costs nothing, and that is the compounding case.
- **The hard guard:** the factory never bulk-calls the vendor. A refusal gate caps calls per run
  and refuses beyond it. Every factory verb (backfill, re-bake, sweep) would otherwise become a
  purchase, and the failure would stay silent until the invoice.
- **What must be true before any vendor value reaches a customer:**
  - V2 is done (retention and redisplay permit it).
  - G-17 (hard-reference obligation detection) is load-bearing for two sources and is built.
  - `accessPolicy` is set per atom, because the MCP returns atom bodies whole.
- **Its first real job:** V1, the bake-off on the six, before Burnet. That makes Burnet's vendor
  stage a measured choice rather than a catalog claim.

## 12. Sequencing (rev 4)

**Done:**

- the five-lane research wave, landed `f1dd3e06` and read in A-179;
- the session-gap sweep, landed `b100c36c`, which takes the register to 486 instances (A-182);
- the final teardown, landed `f9ed016c` and re-checked at source (A-183);
- P-201, merged at factory `9171279`; the hole it was meant to close is still open (P-252);
- the 37 engine tag URLs removed and the engine key rotation begun, by the reports lane under its
  P-251 (operator-ruled).

**The critical path to Burnet is the Phase 0 exit, and its longest pole is P-258**, the setback
acquisition campaign: every (city, district) unit across the 54 no-table cities and the district
misses in the wired cities. It is not P-201, P-252 or P-249. Every other Phase 0 row is shorter,
and the farm machinery builds alongside the campaign. If the operator wants Burnet sooner, the
lever is a ruling on how much of P-258's tail must finish first; nothing else moves the date.

**Build order, by dependency** (no dates; parallel wherever the edges allow):

```
START NOW, in parallel
  P-252  zero-earned refusal ........... hauska-factory, gate files
  P-284  stage and cost telemetry ...... hauska-factory, a migration (different files)
  P-249  envelope unlock ............... legacy-design-tools + hauska-map
  P-248 -> P-261  footprints, PDF figure hauska-engine, one lane
  P-258  acquisition campaign .......... legacy-design-tools corpus, two worklists in parallel
  P-259  Austin zoning source .......... legacy-design-tools zoning adapter
  P-253, P-254, P-255, P-277, P-280, P-286   doc_repo, integration seat
  P-281  leases ........................ doc_repo tooling, then the runners
  P-276  staging rotation targets ...... hauska-factory, secret-rotation files
  P-278  production credential ......... operator go

THEN, as each dependency lands
  P-256  false absences stop ........... after P-252, P-255
  P-257  decline wording ............... after P-249 (map branch changes once), P-256, the PUD ruling
  P-266, P-267, P-274 .................. after P-252
  P-262  labeller, and P-263 clean-up (after P-281); then P-264 re-derive (after both, P-260, P-281)
  P-260  one registry .................. after P-258 in part
  P-265  Hays slates ................... after P-211's envelope apply
  P-285  runner ........................ after P-284, P-281
  P-290  concurrency test .............. after P-281, P-285

PHASE 0 EXIT (section 5) <- everything above, plus P-230, P-217, P-209, P-204, P-211, P-156,
                            P-269, P-270, P-271, P-272, P-273, P-275, P-282
  -> BURNET, with P-278, P-286 and P-287 landed
```

**Where repos will be contended:**

- **hauska-factory:** P-252 and P-284 touch different files and run together. P-256, P-266,
  P-267 and P-274 follow P-252. P-276 is independent.
- **legacy-design-tools:** P-249 (`buildableEnvelope/`), P-258 (the corpus package), P-259 (the
  zoning adapter), P-269 (`cadRollFactFromParcelRecord.ts`), P-270 and P-272 (serve and card),
  plus the reports lane's open P-206 and P-241. Different files; one lane at a time on
  `buildableEnvelope/`.
- **hauska-map:** P-249's map clause first; P-257, P-270, P-271 and P-272 after it, so the
  envelope decline branch changes once.
- **hauska-engine:** P-248 then P-261 in one lane; P-230; P-260; P-262 to P-264; P-271. P-230 and
  P-271 both touch the bake, so P-271 reads first and coordinates.
- **doc_repo:** two integration sessions write to the same checkout and the same row numbers.
  P-251 was taken between two reads on 2026-09-16. Row allocation should go through the id gate
  (P-277).

## 13. Teardown: where this plan is most likely wrong

00. **The research wave was wrong once too.** Its headline that the empty-county gate is still
    unfixed did not survive a code read: the zero-row case is fixed. The zero-earned case is the
    real hole. Four lanes repeated one stale source, the 2026-09-13 dead-controls card. **A
    finding repeated by several lanes is not independent if they read the same document.**
0. **Already wrong once, caught by the operator.** The first version blamed the three-city
   verification registry for undrawn envelopes. Pflugerville disproved it within the hour. The
   real mechanism is stale, mislabelled breadth-bake atoms that the live derive defers to. The
   same draft also recommended plain shared stores without measuring compute contention. Both
   are corrected above. **Treat every other claim here with the same suspicion until a lane has
   re-derived it.**

1. **S1 will turn green gates red in every county, on purpose.** That is the honest state. It will
   read as a regression unless it is announced first. It goes to staging first. **Rev 4:** the
   surface check has been run (teardown T4): the map, agValuation and cityLimits refuse; flood
   falls through to its atom; the dollar rails keep the legacy value and `valueBasis` defaults a
   label (P-269), so S1 carries a setback-only allowlist. The rev 3 claim that "the P-216 outage
   was a one-branch change with map-wide effect" was refuted by A-157 (a stale tab after a
   rollback) and is withdrawn.
2. **"Router miss" may include legitimate cases.** Partly answered this session. All 125,212
   carry one reason, `SETBACK_ROUTER_NOT_A_DISTRICT`, and no not-specified population exists
   among them. Some raw codes may still be non-districts (right-of-way, water, sentinels), so S0
   breaks them down by raw code before S1 flips them. A non-district code becomes `not-applicable`
   with its reason, not `unaccounted`.
3. **Depth-warm has never run beyond three cities.** Heavy atoms writes against a store of about
   192 GB have taken down lanes before. R5 needs heavy-scan serialisation and the blast-radius
   refusal (C1) first.
4. **The census-unit error could repeat.** Any sizing figure must say whether it counts parcels,
   features or accounts. S0 exists to make that impossible to confuse.
5. **The policy table in the instrument is hand-declared.** It is correct today (65 of 65 against
   live) but the memory on hand-declared `has_writer` is the warning. A policy change is a
   ruling, reviewed, never a quiet edit.
6. **"Completely done before Burnet" can stall the farm.** Mitigated by section 12: farm machinery
   builds in parallel, and only the Burnet run waits. **Rev 4: the wait is long.** The exit is
   gated on the whole acquisition campaign (P-258), by design of S1 and of the operator's ruling.
7. **Two labellers may not be reconcilable by import alone.** The engine path works on scrubbed
   rings and the LDT path on raw rings with grouping. R1 may need a shared primitive plus a
   divergence test rather than one file.
8. **Vendor values and first-party values will disagree.** Without V4 the first disagreement
   becomes a silent pick, which R-1 prohibits.
9. **The P-183, P-178 and wave 6 record never reached main.** Some state in this document may be
   older than what that branch holds. H6 comes early for that reason. (Rev 4: wave 6 landed under
   A-176; the two held closes are still off main.)
10. **The teardown lane had no store access.** Its figures are cited, not re-derived. The next
    review dispatch mounts the read-only DSNs or states that the query clause is unavailable.
11. **P-252 will turn verdicts red in the six, like S1.** If a publish-floor rail flips to refuse,
    that county's next publish refuses. The dry run lists those rails before anything deploys.
12. **P-210's coverage answer is a county-level presence check on bake rows** (open as engine
    PR #458). One stale row makes a county "covered", and when P-230 moves the serving path to the
    ledger the coverage check must move with it. A divergence test between the coverage answer
    and the serve path belongs on that PR or on P-230.
13. **P-264 without the road-name dictionary is a planner call** inside A-177. If its residual is
    dominated by name failures in the largest cities, the deferral is the wrong call, and the
    operator decides.

## 14. Decisions

**Answered 2026-09-16:**

1. **Farm storage:** shared stores for Burnet, with isolation decided from Burnet's records
   (A-180).
2. **Cities with no published ordinance:** a per-city decision is acceptable, but most must be
   published one way or another. Every "not found" logs every source tried.
3. **Cotality:** nothing served until the promised contract arrives.
4. **Smithville:** included, through the engine's eCode360 adapter.
5. **Orphaned branches:** quarantined, not deleted (A-180).
6. **The area figure:** "we need to verify". A figure appears only when a verified atom backs it.
7. **The session-gap follow-up:** yes.
8. **Sub-agent depth:** "I go with your rec on both"; built (A-181).
9. **LDT's staging atoms secret:** "go on secret"; repointed (A-181).
10. **The 37 engine tags and the engine key:** removed and rotating, by the reports lane under its
    P-251, operator-ruled (verification of the rotation owed once it completes).

11. **Ag valuation** for Bastrop, Caldwell, Hays and McLennan: "this will come from Cotality
    when we get their credentials and contract" (A-184, P-267). The exit accepts the rail there only
    as `vendor-pending` until the contract is in hand. Burnet's is assumed to come from Cotality
    too, unless the Burnet CAD publishes it.
12. **The production database credential** (P-278, ADD-084): "plan it for later". Planned at
    `_inbox/2026-09-16_add084_production_credential_rotation_plan.md`; it still completes before
    Burnet's first production publish.
13. **The "PUD" code question** (P-257, XD-14): withdrawn. The districts tested have no table row
    and the ledger marks them "none required", so they are planned developments under A-164.
14. **Answers from the July bake in 13 counties outside the six** (P-291): "okay". They keep
    serving, each with a visible "not yet verified" statement.

**Still owed:**

15. **P-264 without the road-name dictionary** (a planner call inside A-177): stands unless the
    operator overrules it.
16. **The `vendor-pending` acceptance for `agValuation`** (an integration seat call, A-184):
    stands unless the operator wants Burnet to wait for the Cotality data.

## 15. Instruments in this package

| Instrument | State |
|---|---|
| `scripts/six-county-completeness.mjs` | Built. Self-test 11 of 11: not-vacuous, empty-county, undeclared-rail and negative-control cases. Rail names 65 of 65 against live. Live run in section 16. |
| Parcel-grain setback queries | Ran read-only for all six counties this session. Queries at `_inbox/2026-09-16_setback_parcel_grain_queries.sql`, output at `_inbox/2026-09-16_setback_parcel_grain_results.txt`. To be promoted to a self-testing instrument as P-255. |
| Baseline run | `_inbox/2026-09-16_six_county_completeness_baseline.json` (the section 16 run, full detail). |
| Rail-verdict query | Inside the completeness instrument. |
| Surface probe per city | Owed: P-254 (the Phase 0 fixture legs); P-197 keeps the per-stage county legs. |
| Verified-envelope coverage (R0) | `scripts/envelope-draw-gap.mjs` (L-B) measures the upper bound; P-255 adds the predicate population. |
| Zero-earned gate probe | Run 2026-09-16 against an extracted factory tree at `9171279`; to be checked in as P-252's fixture test in hauska-factory. |

## 16. Live run of the Phase 0 instrument

`node scripts/six-county-completeness.mjs`, 2026-09-16T12:00:50Z, read-only, 16.7 seconds.
**Result: VERDICT INCOMPLETE, exit 1.**

| County | Pass | Ruled | Open rails | False setback absences (no table / district miss) |
|---|---|---|---|---|
| Bastrop | 38 | 14 | 13 | 2,424 / 3,094 |
| Caldwell | 36 | 14 | 15 | 4,065 / 1,051 |
| Hays | 36 | 14 | 15 | 5,640 / 13,264 |
| McLennan | 37 | 14 | 14 | 33,139 / 10,166 |
| Travis | 41 | 13 | 11 | 43,168 / 60,115 |
| Williamson | 37 | 14 | 14 | 5,824 / 37,522 |

**Open rails common to all six counties:**

- `citationUrl`, `edgeSignal` (make-unbuilt).
- `etjStatus`, `landUseDescription`, `parcelGeometry`, `pipelines`, `railCorridor`, `roads`
  (mid-cutover).

**Open in five counties:**

- `acreageSqft`, `landUseVintage`, `situsState` (derived-trivial; open everywhere except Hays).
- `agValuation` (open in four counties).

**County-specific refusals:** as in section 2a.

The ag-valuation guard read 0, and that is correct. Those cells are `unaccounted`, not falsely
`not-applicable`.

**This run is the baseline for the ledger leg of the Phase 0 exit.** Rev 4 withdraws rev 3's
sentence "Phase 0 exits when this command exits 0": the exit is section 5, all five legs.
