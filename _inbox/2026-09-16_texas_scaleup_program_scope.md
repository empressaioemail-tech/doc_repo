---
id: 2026-09-16_texas_scaleup_program_scope
title: Texas scale-up — six counties complete, Burnet builds the farm, Bell and Milam prove it in parallel
date: 2026-09-16
status: DRAFT rev 2 (2026-09-16, envelope diagnosis corrected after the operator's challenge). Research lanes L-A to L-E run before this is revised again, then a final teardown. Nothing is carded.
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
related:
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
            |  exit: scripts/six-county-completeness.mjs reads COMPLETE,
            |        and the per-city surface probe passes
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
```

**The point of Phases 1 and 2 is the system, not the three counties.** The six counties took a
long time and taught a lot. The next three exist to turn that into a defined, repeatable process
that gets faster each time.

Four more rulings from the same conversation apply throughout:

- **Covered** means what actually serves the customer (P-210 settled).
- **`agValuation` is Texas-wide.**
- **Cotality is part of the farm setup.**
- **The Hays symptom is a road-node and data-coverage problem, not a map problem.**

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

**Each of the 54 is one of three things, and S3 must say which:**

1. Zoned, with a staged layer: acquire the table.
2. Zoned, without a layer: acquire the layer and the table.
3. Genuinely unzoned: declare it through the per-city declaration (S7), so its cells become an
   earned `not-applicable`.

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
dependencies. Existing rows are named; new rows are allocated after approval.

### 4.1 Setback table reconciliation (class A and B)

| ID | Work | Done when | Instrument | Repo | Depends |
|---|---|---|---|---|---|
| S0 | **Parcel-grain census**, checked in as an instrument. Per city, per district: parcels, value, false absence, refused. Replaces P-225's feature counts for sizing. | The instrument runs for all six counties and self-tests (a city with no table must show a non-zero false absence). | new `scripts/setback-parcel-census.mjs` (from this session's query) | doc_repo | none |
| S1 | **Stop writing false absences.** No table becomes `unaccounted` with an acquisition need named. A router miss becomes `unaccounted` naming the district. Zoning refused propagates `refused`. PUD-class districts become `refused` with the PUD reason (S2). | Proven by violation on staging: a Woodcreek parcel reads `unaccounted`, a Kyle PC parcel reads the PUD refusal, a zoning-refused parcel reads `refused`. The gate then REFUSES setbacks with a count, in every county. That is the honest state. | factory tests plus a staging read; `six-county-completeness` false-earned count | hauska-factory | P-201 (so the new refusals are distinguishable) |
| S2 | **The PUD message** (ruled A-164) on the map, the MCP and the PDF. | A PUD, PC or PDD parcel reads "setbacks for this parcel are set by its planned-development ordinance, not a district schedule", on all three surfaces. | surface probe with PUD fixtures in Kyle, Bastrop and Williamson | LDT and hauska-map | S1 |
| S3 | **Acquire every acquirable district table**, largest parcel count first, by per-city ordinance research. Codes that fit an existing row get a routing entry. Codes that are genuinely new get a row, with the verbatim ordinance and effective date. | S0 shows false absence zero, and every remaining `unaccounted` district carries either an open acquisition task or a signed declared-unacquirable decision. | S0; the corpus's own row-verification step (Z4 in the Factory 2 runbook) | LDT `lib/adapters/src/local/setbacks/` and `@empressaio/setback-corpus` | S0 |
| S4 | **Austin's zoning source**, re-acquired from the public `PLANNINGCADASTRE` layer. `ZONING_ZTYPE` needs a base-code parser that never yields `CS` for `CS-1`. Add Austin SF-6. | Austin's census line is measured, and the parser's fixtures include the compound codes A-164 listed. | S0 plus parser tests | LDT | none |
| S5 | **Lockhart zoning source**: find a public replacement or record a declared-unacquirable decision. | Either the layer is live or the decision record exists. | decision record or S0 | doc_repo then LDT | none |
| S6 | **One setback registry.** The engine's jurisdiction descriptors read the same corpus the factory writes from, and a divergence test fails when they disagree. | On the Hays test parcel, per-edge setbacks match the record. The divergence test goes red when one side is edited. | divergence test | hauska-engine, corpus package | S3 in part |
| S7 | **Per-city zoning declarations** (P-156) for every wired city, not only Bastrop, so the gate's not-applicable accounting rests on data. | Every wired city in the six has a versioned declaration. | the declaration loader's divergence control, with more than one city | hauska-factory | none |
| S8 | **Stale docs that mislead setback lanes:** LDT `AGENTS.md` STOP; the coverage doc on Bastrop routing; `zoning-layers.ts:22` Georgetown `RL`. | Corrected, with the Georgetown claim re-verified or removed. | read | LDT | none |

**S3's worklist has two halves:**

- **The 54 no-table cities** in section 2b, 94,260 parcels. Each is classified first as zoned
  with a layer, zoned without one, or unzoned.
- **The district misses** in the wired cities, 125,212 parcels, led by Austin (Travis and
  Williamson parts together, about 60,000), Round Rock, Leander, Kyle, Waco, Cedar Park, San
  Marcos, Pflugerville, Hutto and Bastrop.

Smithville falls under the eCode360 scrape ruling.

### 4.2 Road nodes and the envelope family (classes B, C and E)

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
| R3 | **One edge labeller** (logical-edge grouping, curved frontage, situs-named front first), or a shared primitive with a divergence test. Plus a **ring scrub** for GIS artifact vertices. | Fixture `48209:97658` gets one front and a non-zero envelope that passes P1 to P3. The divergence test goes red when one path changes. | engine and LDT tests | hauska-engine, LDT | R1 |
| R4 | **Retire the mislabelled breadth-bake outcomes.** Unzoned becomes `not-applicable`; not-onboarded becomes whatever the current ledger supports. Writers can no longer emit `no-buildable-area` without a computed, verified zero. | Zero atoms carry `no-buildable-area` with a "no district" or "unzoned" reason. The false-zero guard in the completeness instrument goes red if one is written. | atoms store count; guard | hauska-engine | P-213 (blast radius), C1 |
| R5 | **Re-derive every envelope** whose ledger now holds setbacks, through the fixed labeller, with ground truth (P1 to P3). This includes the 123,706 unexplained zeros. Serialised as a heavy write, dry run first, apply on the operator's go. | Every in-city zoned parcel either draws a verified envelope or carries a specific, named failure; the per-city residual is counted. | R0 re-run | hauska-engine jobs | R1 to R4, S6 |
| R6 | **Fix the re-mint no-op (P-208)** and **enforce the warm preflight gate in every runner.** | A declined re-mint exits non-zero; a runner that skips the gate refuses to start. | violation tests | hauska-engine | none |
| R7 | **Registry rows** for every wired city in the six, so verified promotion is possible everywhere, not only in Bastrop, Elgin and Lockhart. **One setback registry (S6).** | Each row loads and its cohort count matches the ledger. | registry tests | hauska-engine | S6 |
| R8 | **Cut `roads`, `parcelGeometry` and `edgeSignal` into the ledger** (P-204), with each cell pointing at its atom. | All three pass in all six counties. | six-county-completeness | hauska-factory | R3 |
| R9 | **The surfaces draw what R5 produced** and keep an honest, specific decline elsewhere, in words that name the actual reason. No Bastrop "layer-23" wording outside Bastrop. | The per-city probe draws on a verified parcel and declines correctly on a failed one. | surface probe | hauska-map, LDT | R5, D1 |

### 4.3 Hays close-out (from P-200 and P-211)

| ID | Work | Done when | Repo |
|---|---|---|---|
| H1 | Reader-slate resync for Hays: `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `setbackRules`, then the envelope four once H2 lands. The slate, `sourceCommit`, `vendoredAt` and the hash move in one commit. Never re-add LDT #671's six. | All eight serve from the record on the Hays test parcel. | hauska-engine and LDT |
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
| L4 | **`agValuation` Texas-wide**: acquire ag valuation for Bastrop, Caldwell, Hays and McLennan from each CAD (318,000 cells unaccounted today). Delete the never-run not-applicable sweep so it cannot write the false state. Confirm Travis's join key (the writer's own open item; 373,406 values suggest it holds). | Pass in all six. The instrument's `ag-valuation-no-source` guard stays at zero. | hauska-factory |
| L5 | `exemptionCodes` (Williamson 187,186; Caldwell 8,958), `landUseSource` (five counties) and `acreageMethod` (Caldwell, Hays) refusals: diagnose each. Fix it, or rule it an earned refusal with a count. | Each has a verdict. | hauska-factory |
| L6 | **P-201**: `excluded` split into ruled, mid-cutover and no-source. | The gate reports the three distinctly, proven by violation. | hauska-factory |
| L7 | **P-192**: the six lease-less writers take a lease; the false `lease_released: true` is removed. | Owner, land use and flood re-run without throwing, under a lease with run records. | hauska-engine, factory |

### 4.5 Serving truth (class D)

| ID | Work | Done when | Repo |
|---|---|---|---|
| D1 | **P-230**: the surface serves the ledger's current cells, not a bake that predates them. Includes F25 (the `bakedAt` label). | A cell written on staging appears on the staging surface without a manual bake, with the cell's own vintage printed. | hauska-engine |
| D2 | **P-217**: a payload whose parts contradict refuses rather than printing both halves (Hays brief 25/5/20/15 against a draw saying "unruled"). | Proven on the Hays test parcel before and after. | LDT |
| D3 | Remove Bastrop-specific decline wording ("layer-23") from non-Bastrop parcels. | The Kyle fixture reads a correct reason. | hauska-map |
| D4 | **P-246** (queued): no dollar value reaches an ungranted caller. | Solo read of both test parcels shows refusals. | LDT |

### 4.6 Controls the six need before they can be a control group

| ID | Work | Repo |
|---|---|---|
| C1 | **P-213** blast-radius refusal in factory and engine writers. Phase 0 includes the largest writes this program has run. | factory, engine |
| C2 | Dead controls 4, 6, 7 and 8 (edge starvation self-compare; lookup key as proof; a registry validated then ignored; a tautological CI step). | engine, LDT, factory |
| C3 | P-195 leave-behinds: F26 (a never-acquired county grades 1 of 65 rails), F28 (160 of 391 cells excluded, unaudited, which P-201 and this instrument address), F29 (walk image older than gate image). | factory |
| C4 | P-212 follow-on: live-currency checks for the other five counties, and P-206 (serve honours retirement) re-evaluated. | engine |

### 4.7 Cotality in Phase 0: measure, do not serve

| ID | Work | Done when |
|---|---|---|
| V1 | **P-176 bake-off** on the 60-parcel set: agree, disagree, absent or not-attempted per rail, against our cells. | Close artifact per the row's predicate, with the three falsifiers scored. |
| V2 | **Read the commercial agreement**: retention, reproduction, redisplay, and the billing unit. | The four ADR-032 fields carry values. ADR-032 is accepted or revised. |
| V3 | **Correct the canon** (`_STATE.md`, then the regenerated `DISPATCH_PREAMBLE.md`, and `00_current_state.md`) from "extinguished" to "REST dead, re-engaged for the farm". | The next compiled dispatch carries the corrected line. |
| V4 | **A vendor-versus-CAD disagreement ruling**, on the pattern of `_decisions/2026-09-11_setback_source_most_current_wins.md`. | Decision record exists. |

## 5. Phase 0 exit: the definition of done

**Phase 0 is done when all four hold at once:**

1. **`scripts/six-county-completeness.mjs` exits 0 (COMPLETE).** Every rail in every county is
   either `pass` or excluded under a named ruling, and zero cells carry a false earned state.
   - Built and self-tested this session: 10 of 10 checks.
   - Its 65 declared rails match the live verdict table exactly.
   - It reports UNMEASURED, never COMPLETE, on an empty county.
2. **The per-city surface probe passes.** At least four fixtures per wired city (a codified
   district, a formerly uncodified district, a PUD, and a parcel where an envelope is promoted),
   plus one unincorporated parcel per county, on the map, the MCP and the PDF.
   `scripts/surface-probe.mjs` needs these legs (P-197).
3. **Coverage per the serving path** (ruling 2): every parcel in the six answers on the customer
   surface, and an address outside them says "not covered" rather than `no-hit`.
4. **The operator walks it** and signs off.

**What "complete" deliberately does not require.** It does not require values for rails with no
source anywhere (the P-203 eight, carried on the capability roadmap), for R-2 rails, or for
`salesHistory`. Those are declared, counted and visible. If the operator wants Cotality to fill
any of them in the six, the instrument's policy changes by ruling, not by edit.

## 6. The farm — what it is

**A farm is one county, with its cities, run through the one pipeline under a pinned manifest.
Every stage leaves a record. The county merges into the ledger through a gate that refuses a
mismatched manifest.** A defect found in a farm is fixed upstream, and every farm re-runs on the
new pin. **Zero county-local patches.**

**The architecture is drafted separately and is NOT decided:**
`_inbox/2026-09-16_farm_architecture_draft.md`.

- It maps today's stores and flows.
- It names six bottlenecks with evidence (small factory compute; a per-atom write floor of 67
  to 149 atoms/s; serialised heavy scans; serial publish; people; unindexed atom families).
- It compares four options.
- **It leans toward a Neon branch pair per farm, each with its own compute, loaded in bulk and
  merged by a set-based publish through staging.**

That reverses this document's first recommendation of plain shared stores, which the operator
challenged. The reversal has a reason: the 2026-09-14 teardown examined the atoms lease (which
is per county) and never examined compute contention or write throughput.

**The farm includes**, per the operator:

- **the bake audit** (the pre-bake audit, stage 2, GREEN, AMBER or RED against the county's own
  sources);
- the completeness check;
- the stage meter;
- the manifest and merge gate;
- a **depth stage** covering the whole envelope family and road nodes;
- a **vendor stage** for Cotality once the contract lands.

The stage-by-stage map is in the architecture draft, section 5.

## 7. Phase 1 — Burnet through the farm

**Measured today:**

- CAD rest-reachable.
- Geometry ingest passed, but read 50,138 features against 59,785 parcels on production. The
  completeness check exists for exactly this.
- A 2025 roll of 49,243 accounts.
- Address points: 0.
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
| 3 Acquire | Parcels, roll with declared vintage, address points (StratMap statewide set), Marble Falls zoning, road nodes (checked against TIGER), ag valuation from the Burnet CAD. Vendor stage only if V2 allows. | address-point loader for a new county; vendor stage gate |
| 4 Identity | Measure the CAD-to-GIS join. | the generalised H1 instrument |
| 5 Instantiate | 65-rail full shape. | none |
| 6 Rail fill | Every writer under lease with run records. | none (L7 lands first) |
| 6b Depth | Registry row for Marble Falls, setback table for Marble Falls (MAKE), depth-warm. | depth stage |
| 7 Atoms | County atoms with identity reconciled. | P-193 |
| 8 Completeness | Two counts agree. | P-194 |
| 9 Gate | With the P-201 split. | none |
| 10 Publish | Staging, then production; retract-by-run-id proven once on staging. | retract verb (P-196) |
| 11 Probe and meter | A Marble Falls address draws a cited district, setbacks and an envelope. A Bertram address says no zoning layer is on file. Six-county-completeness generalised to take Burnet. | probe legs; instrument county list |
| 12 Merge | Through the merge gate. | merge gate, row versions |

**Burnet is done when** it reads COMPLETE on the generalised instrument, both addresses pass on
all three surfaces, the run record exists with every stage's numbers, and the defect-class list
names each class found with its fixture and its upstream fix. That record is the baseline.

## 8. Phase 2 — Bell and Milam, in parallel

**Bell 48027.**

- CAD rest-reachable. Geometry ingest not run. Not in the registry.
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
safety test (two county runs cannot touch each other's cells, with a divergence test).

**Done when** both read COMPLETE, both merged through the gate without a conflict, and both beat
Burnet's baseline on the section 10 measures.

## 9. Phase 3 — the rest of Texas

Not scoped here. It is gated on Phase 2's measured improvement and on the merge capacity it
reveals. The national data layer (federal terrain, flood, roads, boundaries, footprints: the "L3
fabric" from the 2026-09-13 card) can be carded any time. It has no dependency, and it is what a
county with no appraisal district gets.

## 10. Speed: how "improved" is measured

**No baseline exists for the six counties.** Their onboarding was never metered. Burnet's run
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

## 12. Sequencing: research first, then build

**Not yet.** The operator asked for more digging, more planning and deeper review before this is
a plan. Five read-only research lanes run first, in parallel. Each answers something this
document could not. Then this scope and the architecture draft are revised. Then one final
adversarial teardown attacks the revised versions.

| Lane | Answers | Rows |
|---|---|---|
| **L-A ledger truth** | For every parcel and every one of the 65 rails in the six counties: cell state, serve path, atom presence, and cell-atom agreement. Built as a checked-in instrument. Includes what the ledger must carry to be the single source of truth. | P-201, P-204 |
| **L-B envelope and road nodes** | The per-city draw gap; the whole envelope family; road-node coverage and quality against TIGER and county roadway data; what a re-derive at scale needs; customer rendering per failure class. | P-233, P-235, P-208 |
| **L-C blocker history** | Every blocker since the six counties began, filed under the seven classes (six CTX classes plus the served-value class). Root cause, fix status, whether a control now prevents recurrence, and which farm stage must catch it. | P-188 |
| **L-D farm architecture** | Neon limits, compute and branch behaviour; bulk write rate; merge mechanics; which serving copies a farm must write; hidden county literals. Tests the architecture draft. | P-187, P-198 |
| **L-E customer experience** | Per city: address with city and ZIP, zoning with its governing jurisdiction, setbacks with a citation, envelope drawn or declined with a specific reason, on the map, the MCP and the PDF. This becomes the per-city probe fixture set. | P-197, P-210 |

**Every lane carries the same instruction: exhaust the question.** A lane that finds one blocker
records it and keeps going. The operator has seen agents stop at the first blocker many times,
and a close that names one blocker and stops is returned.

**What can still start now, because it does not depend on the research:** P-201 (the `excluded`
split, hauska-factory), landing the wave 6 record (H6), the canon corrections, and the farm
machinery that is architecture-neutral (the manifest format, the normalised assumption register,
the stage-record format).

## 13. Teardown: where this plan is most likely wrong

0. **Already wrong once, caught by the operator.** The first version blamed the three-city
   verification registry for undrawn envelopes. Pflugerville disproved it within the hour. The
   real mechanism is stale, mislabelled breadth-bake atoms that the live derive defers to. The
   same draft also recommended plain shared stores without measuring compute contention. Both
   are corrected above. **Treat every other claim here with the same suspicion until a lane has
   re-derived it.**

1. **S1 will turn green gates red in every county, on purpose.** That is the honest state. It will
   read as a regression unless it is announced first. Surfaces must also be checked for how they
   render `unaccounted` before the flip, and it goes to staging first. The P-216 outage was a
   one-branch change with map-wide effect.
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
   builds in parallel, and only the Burnet run waits.
7. **Two labellers may not be reconcilable by import alone.** The engine path works on scrubbed
   rings and the LDT path on raw rings with grouping. R1 may need a shared primitive plus a
   divergence test rather than one file.
8. **Vendor values and first-party values will disagree.** Without V4 the first disagreement
   becomes a silent pick, which R-1 prohibits.
9. **The P-183, P-178 and wave 6 record never reached main.** Some state in this document may be
   older than what that branch holds. H6 comes early for that reason.

## 14. Decisions (answered 2026-09-16, and still owed)

**Answered by the operator:**

1. **Farm storage:** not decided until the architecture is mapped. The operator's concern is a
   bottleneck on the existing stores, and the draft now agrees that it is a real risk.
2. **Cities with no published ordinance:** a per-city decision is acceptable, **but most should
   be publishable one way or another.** Before any city is declared unacquirable, the lane must
   log every source it tried: city GIS, municode, eCode360 (the engine's corpus adapter
   exists), American Legal, city PDF zoning maps, planning pages, and county appraisal zoning
   fields.
3. **Cotality:** the contract is promised. Nothing Cotality-sourced is served until it arrives,
   and that is the correct state today.
4. **Smithville:** included. The eCode360 scraper exists in hauska-engine
   (`packages/corpus/src/adapters/ecode360/`, with a Cloudflare challenge fixture).

**Still owed:**

5. **The ag-valuation source for Bastrop, Caldwell, Hays and McLennan:** which CAD product per
   county.
6. **Whether P-201 and the canon corrections proceed now** while the research lanes run.
   Recommended yes; neither depends on the research.

## 15. Instruments in this package

| Instrument | State |
|---|---|
| `scripts/six-county-completeness.mjs` | Built. Self-test 10 of 10: not-vacuous, empty-county, undeclared-rail and negative-control cases. Rail names 65 of 65 against live. Live run in section 16. |
| Parcel-grain setback queries | Ran read-only for all six counties this session. Queries at `_inbox/2026-09-16_setback_parcel_grain_queries.sql`, output at `_inbox/2026-09-16_setback_parcel_grain_results.txt`. To be promoted to a self-testing instrument as S0. |
| Baseline run | `_inbox/2026-09-16_six_county_completeness_baseline.json` (the section 16 run, full detail). |
| Rail-verdict query | Inside the completeness instrument. |
| Surface probe per city | Owed (P-197). Fixture parcels named in section 2. |
| Verified-envelope coverage (R0) | Owed. The atoms store needs a planned query. |

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

**This run is the Phase 0 baseline. Phase 0 exits when this command exits 0.**
