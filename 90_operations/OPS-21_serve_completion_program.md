---
id: OPS-21_serve_completion_program
title: OPS-21 — Serve completion program (setbacks first, then everything we already hold)
date: 2026-09-10
last_updated: 2026-09-10
status: active — plan of record for the serve-completion arc
owner: nick
applies_to: portfolio
related:
  - 90_operations/OPS-22_spine_architecture_map
  - 90_operations/OPS-16_texas_market_plan_of_record
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _catalog/county_contract_v0.json
  - _decisions/2026-09-02_step7_consumer_c_then_b
snapshot: >
  Authored 2026-09-10 against origin/main of hauska-factory 63a606b,
  legacy-design-tools c43e2436, hauska-engine 15021ef, hauska-map fb41c05.
---

# OPS-21 — Serve completion program

## The operator's goal, stated once

> "I need all the information we have, including setback and envelope rails, in
> production. That has been my goal for weeks and it keeps simply coming up short."

Not "acquire everything." **Every one of the 65 rails reaches a real state with an
instrument behind it, in production, for the six Central Texas counties.** Values where we
have data, honest dispositions where we do not.

## Why it kept coming up short — the root cause, verified at source

Setbacks and buildable envelope have had **no write path to a value since the anti-zombie
change.** It is a closed loop formed by two decisions that are each correct alone:

```
setbackFrontFt cell = unaccounted
      ^  serve cutover: "setbacks' legacy value is whatever computeTier1Envelope
      |   already wrote at bake time"
computeTier1Envelope  (LDT nodeFacetBakeTier1.ts:92)
      |  TWO branches, BOTH status:"declined". No branch returns a value, ever.
      |  Its own disclosure: "read buildable-envelope from the property atom chain"
      v
property atom chain  needs buildable-envelope / setback atoms
      ^
write-setback-city.mjs:95  throws SETBACK_APPLY_HELD on --apply
      "F-11 apply is held; dry-run / plan / refuse only"  (commit c344345, 2026-08-31)
      Card-scope boundary, NOT a safety hold. No later card lifted it.
      Second blocker in the same function: PARCEL_SOURCE_REQUIRED — "live parcel load
      not invoked on this card". That writer has no live parcel loader at all.
```

Every attempt for weeks landed on one of two correct refusals. Both refusals were right.
The gap between them was never anyone's row.

**What does work.** `brokeragePlaceBuildableEnvelope.ts` (LDT) computes the envelope at
request time from the ruled setback-table registry, live, correctly, today, for roughly
twenty jurisdictions. Ten Texas tables exist: `austin-tx`, `bastrop-tx`,
`bastrop-city-tx`, `bastrop-development-code`, `elgin-development-code`, `kyle-tx`,
`pflugerville-tx`, `round-rock-tx`, `san-antonio-tx`, `waco-tx`. Nothing writes that
computation's output into a cell.

## Scope note that shrinks Phase 1 considerably

`UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable` on all setback
rails at row-creation time for unincorporated parcels. **Only in-city parcels need a
fill**, and only in cities carrying a ruled table. Inside the six counties that is Austin,
Bastrop, Bastrop City, Elgin, Kyle, Pflugerville and Round Rock.

---

# Phase 1 — setbacks and envelope to production

| Lane | Repo | Scope | Depends on |
|---|---|---|---|
| **S1 setback-cell-writer** | hauska-factory | New rail job. Per county per city: district → `getSetbackTableForZoning` (same adapter the live route uses) → write 4 setback cells + `setbackRules` companion. In-city with no table = `absent-verified` after probe, NEVER `not-applicable` | — |
| **S2 envelope-cell-writer** | hauska-factory | `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`, `envelopeDisclosure`, `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`. Ring from `txgio_parcel`, insets from S1's cells | S1 |
| **S3 non-vacuity guard** | hauska-engine + hauska-factory | A test per write path asserting it returns a value for at least one real input. First target `computeTier1Envelope`, which today cannot. **The mechanism that stops recurrence** | — |
| **S4 gate + slate** | hauska-factory + LDT | Add the 19 zoning-envelope rails to `DEFAULT_SCHED_RAIL_KEYS`, then slate per county as verdicts pass | S1, S2 |

**Path chosen: cells direct from the ruled-table computation.** Not the held atom writer.
This is the same expedient ADR-031 already blessed for the CAD rails in these six counties
— cells carry complete provenance citing the ruled table, atoms are minted underneath
later and citations repoint without changing a value. The boundary/envelope atom program
(open since 2026-09-06) remains the destination.

---

# Phase 2 — everything we already hold, serving and in sync with the ledger

| Lane | Repo | Scope |
|---|---|---|
| **D5 gate widening** | hauska-factory | `DEFAULT_SCHED_RAIL_KEYS` 17 → 65. Grading, not serving; the code-owned slate still decides what serves. Makes the whole backlog visible and hourly. **Run this first** |
| **D1 derivations** | hauska-factory | 5 rails from data on hand: `situsState`, `acreageSqft`, `landUseVintage`, `exemptionCodes`, `citationUrl`. **`landUseDescription` removed 2026-09-10** — the lane verified live that no such `cad_property` column and no code-to-description lookup exist; it is not derivable, moves to 3P-13 |
| **D2 permits cell-fill** | hauska-factory + LDT | `permit_record` → `permits` companion. Austin/Travis only; the other five stay honestly unaccounted. v1 on `address_normalized`; the TCAD id-join is a follow-on |
| **D3 writer-runner unblock** | hauska-engine + hauska-factory | Add `road-node`, `rail-corridor-fact`, `rrc-pipeline-fact`, `parcel-node` to the atoms-writer allowlist, template the jobs, then cell-fill |
| **D4 terrain grain** | hauska-factory | Terrain tiles are baked; decide what the cell carries and write it |
| **D6 on-demand disposition** | doc_repo then LDT | `hoaDeedRestrictions`, `ossf`, `publicRecordRefs`. **Blocked on an operator ruling** — see below |

## The D6 ruling that is owed

HOA deed restrictions and OSSF come from courthouse records, on demand, user-initiated,
through the Smart Site records tool (P-85). That is per-request by design;
`purchaseApproved` queues a human and nothing about it is bulk.

The five states cannot express "acquirable on request, not yet requested."
`absent-verified` is false — nothing looked. `not-applicable` is false — it may well
apply. `refused` is close but means the source cannot say which. So these rails sit
`unaccounted` forever, dragging the count, until somebody relabels them to clear a gate —
the exact failure the relabelling tripwire exists to catch.

**RULED 2026-09-10: a sixth cell state, `available-on-request`.**
`_decisions/2026-09-10_available_on_request_sixth_cell_state.md`.

It means the rail is not acquired in bulk; it is fetched per parcel on demand through a named,
REACHABLE request path, and nobody has asked for this one. It is **not** an absence claim. It
requires a `requestPath` and refuses without one — a promise with no path is cover, not a
state. The publish gate treats it as satisfied; `unaccounted` stays fatal.

Rejected: removing the three rails from the grid (loses the product signal that the facts are
obtainable), and overloading `not-applicable` with a ruling pointer (a state needing a
footnote to be read correctly will eventually be read incorrectly).

Consequence, taken deliberately: a six-value union across a 981,405 x 65 grid and every
consumer that switches on cell state. `parcelRecordAllowlist.ts`, the gate CLI, the
serve-layer rail adapters and the MCP tool schemas each need the new member, and each is a
place a missing case must fail closed rather than fall through to a default.

---

# Phase 2S — the ledger AS the serve path

**This is the piece that keeps getting lost, and the reason is structural: it is the
declared destination in ADR-031 and in the c-then-b decision, and it has never had a plan
row anywhere.** A destination with no rows is a sentence, and sentences do not get worked.

ADR-031 Decision 1 already rules it: *"Atoms answer what we know. The record answers what
we have accounted for. Only the second is gateable, and serving reads only gated cells."*
The c-then-b decision names the destination: *"Option A (full repoint) remains the
destination after slates prove out."*

## Where it actually stands, measured 2026-09-10

**18 rails, 97 of 390 possible (county, rail) pairs, roughly 24 percent of the grid.**

```
6 counties: cityLimits, flood, schoolDistrict, utilityService, overlayDistricts,
            valueHistory, zoningDistrict, marketValue, assessedValue, landValue,
            improvementValue, livingAreaSqft, yearBuilt
5 counties: wells, specialDistricts        
2 counties: agValuation                    1 county:  maxImperviousCoverPct
```

Everything else falls to `legacy` by the allowlist's own fail-closed default. Four read
paths remain live simultaneously: the atom chain, the baked node-facets snapshot, the
cortex fallback route, and the engine-api feasibility route.

## The debt nobody has audited

The c-then-b decision requires that **each cutover carries its old-path retirement in the
same card**, which is the ENFORCEMENT retirement rule applied as designed. Ninety-four
cutovers have shipped. **Nobody has verified that a single legacy path has actually been
retired.** If none has, then every rail is being served by a record reader with a live
legacy path still standing behind it, and ENFORCEMENT's own rule is being violated
ninety-four times: *"Repoint consumers first, then retire the store. Reverse order turns
an invisible defect into a visible regression."*

That audit is cheap and it has to happen before the slate widens further, or the debt
compounds at the rate the slate grows.

| Lane | Repo | Scope | Depends on |
|---|---|---|---|
| **L1 retirement audit** | LDT | For each of the 97 slated pairs, does its old path still exist and is it reachable? Produces a retirement backlog, one row per unretired path. **Read-only. Retires nothing** | — |
| **L2 slate expansion** | LDT + factory | Widen `PARCEL_RECORD_SLATE` rail by rail as gate verdicts pass, each cutover carrying its retirement item in the same card. Phase 1's setback/envelope rails enter here | S4, D5, L1 |
| **L3 legacy retirement** | LDT | Retire the paths L1 found, in the order L1 ranks them. A retired path returns a decline or 404 and a CI check fails if it reappears | L1 |

**L1 runs immediately and in parallel with Phase 1.** It needs nothing from any other lane
and it is the only thing standing between you and finding out that 24 percent of your serve
path has two live implementations.

---

# Phase 2H — Hays, which is a different problem

Hays is not one-sixth of the same job. It is the identity-damaged county:

- 30.5 percent of parcel ids gone and 19.5 percent drifted across the 2026-09-03 reload,
  worst of the six by a wide margin
- The StratMap graft: 116,421 geometry rows padded into `cad_property` with `source_file`
  overwritten in place, 2026-08-25
- The cadRoll gate is not vintage-scoped, so 37,813 rows can only clear by claiming they
  left a roll they were never on
- Dollars joined on a `prop_id` whose own payload says it does not join the CAD account
- One San Marcos parcel serving a Buda parcel's label and acreage
- 5 of 11 cities carry a zoning endpoint

**Lane H1 — Hays identity reconciliation** must land before Hays receives any Phase 1 or
Phase 2 fill. Filling cells on a broken key writes wrong values faster. This is the one
place the program deliberately serialises rather than parallelises.

---

# Phase 3 — acquisition, through the refined process

Phases 1 and 2 serve what we hold. Phase 3 acquires what we do not, and it runs **through**
the machine rather than around it: new acquisition cuts its channel through the county
contract's declare → scout → preflight front of the line
(`_catalog/county_contract_v0.json`, and the fix stack in
`_sessions/2026-09-10_county_contract_and_scaling_diagnosis_claude_code.md`).

Nothing in Phase 3 starts until Phase 1 is in production and Phase 2's D5 has been running
long enough to produce a real backlog.

---

# Phase 3P — the deferred register, a parallel track to acquisition

Phase 3 acquires what we do not hold. **Phase 3P drains what we deliberately put down.**
It runs alongside, not after, because none of it blocks acquisition and all of it rots.

**Every item declares its TRIGGER — the event that brings it back.** An item with no
trigger is a wish, not a deferral, and this operation has a long record of wishes. The
trigger is what makes this a register rather than a list.

| # | Item | Why deferred | TRIGGER that wakes it | Owner |
|---|---|---|---|---|
| 3P-1 | **cadRoll overlay ruling.** Operator ruled 2026-09-10: the overlay is TRANSITIONAL, not permanent. Retirement is scheduled by measured divergence, not by calendar | Cannot be decided safely until we know whether the two values disagree | **L4 divergence measurement reports a number.** Until then L3 is held for these 36 pairs | operator |
| 3P-2 | **`yearBuilt` has two legacy sources** depending on call site — baked in the snapshot on `brokerageNodeFacets`, live via `structuralFactRead` on `propertyExplorer`. A parcel can serve a different year by route | Found inside L1's audit; independent of any retirement | Same L4 pass; measure it in the same query | property |
| 3P-3 | **Shared preamble prune.** 5,605 of 8,293 bytes of `_state/shared/STANDING_DECISIONS.md` is SmartCity G-row state shipped into every factory lane; 547 bytes are genuinely fleet-wide | Touches a file with concurrent writers; moving 15 bullets into OPS-17 is a deliberate card | **Any lane reports the preamble as noise, or a second program gets a preamble** | integration |
| 3P-4 | **Dispatch preflight rule** (existence + blast radius). Logged in `_sessions/2026-09-10_ops21_program_open_and_dispatch_claude_code.md` | Prose today, which is the condition it exists to fix | **The next dispatch compiled for any program** — it should not ship without this | integration |
| 3P-5 | **Three identity rulings**: does `place_key` normalize to match `parcelNodeId`; which CAD tax year is authoritative (latest vs per-county declared); does the `place_key` to `entity_id` crosswalk become a contract type | All three block a second state and none blocks Texas | **Utah, or any second state, reaching the roster** (OPS-19 F-13/F-14) | operator |
| 3P-6 | **claims/leases split.** `claims` is wired into `parcel-record-fill.mjs` only; `conformant.mjs`, `f10-cad-loop.mjs`, `p2-juris.mjs`, `restamp-access.mjs` still use the random-token lease | ADR-031 says close it with the atom-backfill card, not standalone | **The CTX atom-backfill card opening beyond boundary/envelope** | property |
| 3P-7 | **Which of four bakes is authoritative per rail.** Tier1, Tier1Conformant, Tier2, Tier2Conformant all run | No defect traced to it yet | **Any rail whose value differs by bake**, or L4 finding a divergence it explains | property |
| 3P-8 | **Permits TCAD id-join.** `permit_record.tcad_id` is stored for a verified id-join and unused; the county GIS point query returns TCAD `PROP_ID` and the export carries a geo-format TCAD ID, correspondence unverified | v1 ships on `address_normalized` | **D2 measuring the address-match miss rate.** If it is small the join stays deferred; if large it becomes urgent | property |
| 3P-9 | **`og-title` productionisation for `mineralRights`.** Real title-chain subsystem, method v0, proven on one Winkler tract, WI computation is a stub, graded UNGRADEABLE-YET because the answer key's OCR is unreadable | Not a CTX rail today and not on the serve path | **A readable answer key** for the Winkler exhibit, or a customer asking for mineral rights | operator |
| 3P-10 | **Three atom-contract types the trading spine already has**: `ConfidenceBasis`, `OutcomeLabel`, `OutcomeDeclineBasis`. See `_sessions/2026-09-10_county_contract_and_scaling_diagnosis_claude_code.md` | Cheap while someone is in that repo; pointless as its own trip | **The next substantive session in Empressa Trading** | operator |
| 3P-11 | **Jurisdiction model questions**: is an ETJ parcel `in-city` or `unincorporated` for the 18 collapsing rails; do the four `intersection-v1` counties get re-run to `covers-v1` | Product questions, not engineering; the six counties work today | **A customer question that turns on ETJ**, or the first report that spans all six as one number | operator |
| 3P-14 | **buildable-area pair + envelopeStatus/envelopeDisclosure unwritten.** S2 designed a shape-only approximation and overruled itself; the only tested computation needs road-frontage edge labeling nobody has acquired. 611,116 six-county in-city cells each | No honest write path; a labeled approximation is fabrication with a sticker | **The road-frontage acquisition landing. RULED 2026-09-11: NOT a new 'computed by approximation' state** | property |
| 3P-15 | **The corpus stores sentinels.** `999` for height, `100` for coverage, `0` for elgin coverage, as placeholders under a `not_specified` flag. ENFORCEMENT prohibits satisfying a check with a sentinel outright. P-146's factory-side classification table is a WORKAROUND for this | The corpus is a separate repo with its own owner; the workaround unblocks cells now | **A corpus release that stops storing sentinels and stops flagging transcribed values.** P-146's table retires in the same card | operator |
| 3P-16 | **Road-frontage / OSM edge-labeling acquisition.** Now has a NAMED CUSTOMER: buildable area, the headline question of the product. Strongest Phase 3 acquisition candidate rather than a vague nice-to-have | Phase 3 work; Phases 1-2 serve what we hold | **Phase 2 reaching production**, or an operator decision to pull it forward | operator |
| 3P-13 | **`landUseDescription` has no source.** `cad_property` carries no such column and no code-to-description lookup table exists anywhere. We DO hold `landUseCode`, so the value exists and only the Texas state property-use code lookup is missing. It must NOT be written `absent-verified` — that would claim the parcel has no land use description when we simply lack the lookup | Acquiring a code table is Phase 3 work; D1 forbids new acquisition | **The Texas property-use code table being acquired**, or a customer asking for the description text rather than the code | property |
| 3P-12 | **`boundary.digitisation_tolerance`** as a 69th county-contract column, and the three inferred columns' fate | Operator review owed on the contract's inferred set | **County seven entering the roster** | operator |
| 3P-14 | **The buildable-envelope rails have no road-frontage input.** `buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus` and `envelopeDisclosure` all depend on knowing which parcel edge fronts the street, because setbacks are directional. That the four separate `setbackFrontFt`/`setbackSideFt`/`setbackRearFt`/`setbackCornerFt` rails exist at all is the proof the values differ by edge, so misidentifying the front edge changes the envelope. The only tested inset engine (envelope-saga, 2026-08-07) derives that from OSM road data, and OPS-21-S2 had no acquisition for it. S2 proposed writing the engine's lowest-confidence shape-only tier as a disclosed `value`; it was overruled 2026-09-11 on 3P-13's own rule, which governs this case exactly: the value exists and only our input is missing, so no disposition may be written. Note `envelopeStatus` and `envelopeDisclosure` are themselves counted rails, so a disclosure written beside the value is not a safeguard, it is two more filled rails. These four stay `unaccounted`. Evidence: `_inbox/2026-09-11_ops21-s2_cp1.json` | Writing a guess would drop the unaccounted count with no acquisition landing, which ENFORCEMENT names as relabelling that looks like progress. What S2 actually needs is a state that does not exist, "computed by approximation, required input absent", and an unrepresentable state gets made representable rather than sentinel-encoded, which is a type change and the operator's call | **OSM road-frontage data being acquired**, or the operator ruling either way on whether an approximation state should exist | property |

**Rule for this register:** an item leaves only by being done or by an explicit ruling that
it is dead. An item whose trigger fires and is not picked up is reported by the next status
pass. Adding an item requires naming its trigger; a deferral with no trigger is refused.

---

# How this plan stays honest — the anti-drift mechanism

Every plan in this operation to date has strayed the same way: the plan is prose, the work
happens in lanes, the lanes close into `_inbox/`, and nothing reconciles the closes back
to the plan's own definition of done. OPS-16 has 120-plus amendment rows; it grows, it does
not converge.

**This is the first plan in this operation whose completion is machine-checkable**, and
that is only possible because the ledger already tracks exactly what the plan is about.

Every lane below carries a **completion predicate**: a query against `parcel_record` whose
answer is a number, not an opinion. `scripts/plan-progress.mjs` runs them all and prints
the plan's real percentage. A lane is done when its predicate says so and not when a close
file says so.

```
LANE  PREDICATE (all scoped to the six CTX counties)
S1    unaccounted count for setbackFrontFt/SideFt/RearFt/CornerFt + setbackRules
      on IN-CITY parcels in cities carrying a ruled table  ==  0
S2    unaccounted count for parcelAreaSqFt, buildableAreaSqFt, buildableAreaPct,
      envelopeStatus, envelopeDisclosure, maxHeightFt, maxLotCoveragePct,
      maxFootprintSqFt on the same population  ==  0
S3    every registered write path has a test asserting a non-declined result for
      at least one input; count of write paths without one  ==  0
S4    count of (county, rail) pairs in the 19 zoning-envelope rails with no
      gate verdict row  ==  0
D5    len(DEFAULT_SCHED_RAIL_KEYS)  ==  65
D1    unaccounted count for the 5 derivable rails  ==  0
D2    unaccounted count for `permits` on Austin-city parcels in Travis  ==  0
D3    unaccounted count for roads, railCorridor, pipelines, parcelGeometry  ==  0
D4    unaccounted count for terrain  ==  0
D6    count of hoaDeedRestrictions/ossf/publicRecordRefs cells NOT in state
      'available-on-request'  ==  0   (a relabel to anything else reopens the lane)
H1    Hays place_key set intersect cad_property account set, measured, with a
      declared disposition for every non-intersecting row  ==  complete
L1    count of slated (county, rail) pairs whose old serve path has not been
      audited for reachability  ==  0
L2    count of (county, rail) pairs record-served  ==  390 minus rails ruled
      out of the grid by D6 and Z8
L3    count of legacy paths L1 found reachable that are still reachable  ==  0
L4    count of (parcel, cadRoll rail) pairs where the baked snapshot value and the
      parcel_record cell value DISAGREE  ==  measured (a number, not a target)
3P    count of deferred-register items with no declared trigger  ==  0
```

**Program done** is one number: `unaccounted` across 65 rails × 6 counties, excluding
Z8-deferred rails and whatever D6's ruling removes, equals zero.

If that number is not falling week over week, the plan has strayed and the query says so
without anyone having to notice.

---

# Dispatch

Lanes compile through `scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row <row>`.
Plan rows open in OPS-16 as a single amendment.

**Immediately dispatchable, no dependencies: S1, S3, D5, D1, H1, L1.**
S2 and S4 compile when S1 closes. D2, D3, D4 compile as preconditions clear. L2 compiles
after S4, D5 and L1. L3 compiles after L1. D6 is RULED and dispatchable.

Verification never delegates below the lane planner. Subagents produce artifacts; the
planner commits.
