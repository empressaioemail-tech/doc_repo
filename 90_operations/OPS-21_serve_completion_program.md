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
| **D1 derivations** | hauska-factory | 6 rails from data on hand: `situsState`, `acreageSqft`, `landUseDescription`, `landUseVintage`, `exemptionCodes`, `citationUrl` |
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

**18 rails, 94 of 390 possible (county, rail) pairs, roughly 24 percent of the grid.**

```
6 counties: cityLimits, flood, schoolDistrict, utilityService, overlayDistricts,
            valueHistory, zoningDistrict, marketValue, assessedValue, landValue,
            improvementValue, livingAreaSqft, yearBuilt
5 counties: wells, specialDistricts        3 counties: setbackFrontFt
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
| **L1 retirement audit** | LDT | For each of the 94 slated pairs, does its old path still exist and is it reachable? Produces a retirement backlog, one row per unretired path. **Read-only. Retires nothing** | — |
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
D1    unaccounted count for the 6 derivable rails  ==  0
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
