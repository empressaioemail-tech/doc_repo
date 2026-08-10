---
id: OPS-15_owner_and_rrc_rail_gap_analysis
title: OPS-15 — OWN and RRC rail gap analysis and scope
date: 2026-08-09
status: scoped and PARKED — OWN first, RRC as a focused path after county backfill (operator 2026-08-09)
owner: planner
memory_graded: pending
related:
  [
    90_operations/OPS-14_texas_flush_game_plan,
    80_adrs/adr_025_og_atom_ontology,
    _decisions/2026-08-01_scale_before_new_layers_sequencing,
    _decisions/2026-08-09_texas_flush_launch_gate,
    _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first,
  ]
---

# OPS-15 — OWN and RRC rail gap analysis

## OPERATOR SEQUENCING RULING (2026-08-09)

Both rails scoped here and **PARKED**. Execution order ruled:

1. **OWN goes first** — Wave 1 below executes as its own lane.
2. **RRC becomes a focused path AFTER a number of counties are backfilled** — it does not compete with the parcel-node sweep or the county backfill for slots or attention. "Focused path" = its own dispatch program when it fires, not a bolt-on to the backfill.

Rulings R1-R4 in section 7 remain owed and are NOT resolved by this sequencing. R1 (the 12-to-14 rail split) and R3 (whether OWN is launch-gate scope) still gate any manifest denominator change. OWN Wave 1 items O1-O3 do not depend on R1 and can proceed; O4 (rail declaration update) does.

Operator observation 2026-08-09: the County Manifest shows OWN as `NO ATOM` and RRC as `HALF` + `NO WRITER`; RRC "is way more than one atom, it's almost like its own category"; owners exist but "we just don't display them by default"; and railroad tracks plus their geometry are owed. This document tests each claim at source, then scopes.

Every number below is a live query or a published-package read taken 2026-08-09, not doc prose.

## 1. Findings at source

### 1.1 OWN — the data is already ours; the atom was never built

`cad_property` on the deployment Neon (`TXGIO_DATABASE_URL`), live count:

```
rows        4,599,477
with_owner  4,525,073   (98.4%)
counties           15
```

Columns present: `owner_name`, `owner_mailing_address`, `situs_address`, `situs_city`, `situs_zip`, `legal_description`, `exemption_codes[]`, `land_value`, `improvement_value`, `market_value`, `assessed_value`, `year_built`, `living_area_sqft`, `land_acres`, `property_use_code`, plus `source_file` / `source_vintage` / `ingested_at` provenance.

The rail declaration (`legacy-design-tools/lib/db/src/schema/countyRailDimension.ts`, ordinal 10) reads:

```
railKey: "owner", atomFamilyState: "missing", atomFamilyRef: null,
hasWriter: false, writerRef: null,
declaredSource: "CAD owner_name + mailing, authenticated paid facet",
notes: "Ruled public-paid at the atom level; no owner atom exists to carry the policy."
```

**The gap is inverted from every other rail.** Elsewhere an atom family exists and coverage is the argument. Here the ACCESS POLICY was ruled (`public-paid`) and the carrier was never built. The operator's framing — "we have owners, we just don't display them by default" — is half true and the half that is false matters: we have owner DATA in a relational table, and no owner ATOM. Nothing can be withheld-by-default because nothing is served at all. There is no display decision to make yet.

`land-use-fact` (50 atoms) proves the CAD-roll-to-atom path already works end to end; `owner-fact` is the same path over adjacent columns on the same table.

**Acquisition work required: zero.** This is the cheapest unbuilt rail on the board and, per the RE wedge, among the most commercially loaded (owner + mailing is the skip-trace / direct-mail primitive).

### 1.2 RRC — the declaration is stale-optimistic; the property spine has nothing

Rail declaration (ordinal 11):

```
railKey: "rrc", displayName: "RRC wells / pipelines",
atomFamilyState: "partial",
atomFamilyRef: "12 O&G types (wells only; no parcelNodeId edge; pipelines missing)",
hasWriter: false, notes: "W3 HELD per 2026-08-01 scale ruling."
```

Live `atoms` table (`hauska_mcp`), every entity type present:

```
zoning-fact 4,606,757 | parcel-node 1,896,858 | buildable-envelope 1,478,708
setback-rule 778,676  | code-section 28,567   | property-boundary-edge 26,846
road-node 25,078      | code-cross-reference 8,105 | parcel-terrain-model 60
code-edition 58       | cad-parcel-roll 50    | land-use-fact 50
flood-hazard-fact 49  | jurisdiction-corpus 43 | code-amendment 10
```

**Zero O&G entity types.** No `well`, `wellbore`, `completion`, `production-timeseries`, `mineral-lease`, `rrc-lease` — none of the ADR-025 ontology. The deployment DB likewise has no wells or pipelines tables (only `county_rail`, `rail_state_history`, `rail_verification`, which are manifest infrastructure).

The `./og` subpath IS published — `@empressaio/atom-contract@1.15.0` exports `./og` alongside `./property`, `./encumbrances`, `./workspace`, `./read-contract`, `./conformance`, `./export`, `./reasoning`, `./temporal`, `./testing`. So ADR-025's ontology exists as SHAPES on npm. It is registered and written nowhere in the property spine; the build repo `og-twin` was last pushed 2026-07-08.

**Ruling implication:** `atomFamilyState: "partial"` is WRONG when read against this store. The types exist in the contract; the county manifest scores the PROPERTY spine, where the state is `missing` with a published-contract caveat. This is the stale-optimistic drift class the rail-dimension file was written to prevent (the same defect it fixed for geometry/footprint/easement on 2026-08-08), recurring on a rail nobody has touched since.

### 1.3 "RRC is almost its own category" — correct, and the manifest cannot express it

ADR-025 defines twelve-plus types across three lenses (operations / land / capital): `well`, `wellbore`, `completion`, `zone`, `pad`, `production-timeseries`, `equipment-state`, `mineral-lease`, `rrc-lease`, `ownership-interest`, `obligation` (core, domain-neutral), `revenue-allocation-unit`. Node prefixes are registered (`well_`, `wbore_`, `cmpl_`, `zone_`, `pad_`, `mlease_`, `rrclease_`, `tract_`, `intr_`, `oblg_`, `prodts_`, `equip_`, `unit_`).

Scoring that as ONE county cell at a 90% threshold is a category error: it flattens a multi-type domain into a binary, which is precisely why it can only ever render `HALF`. The cell has no vocabulary for WHICH part exists.

### 1.4 Railroad tracks are NOT the Railroad Commission

Flagged because the collision is live in the current naming. "RRC" in the rail declaration means the **Texas Railroad Commission** — the oil and gas regulator (W-1 drilling permits, H-10, PDQ production). The operator's "rr pats and the geometry" names **railroad track infrastructure** — rights-of-way, crossings, active vs abandoned corridors. Different domain, different source, different buyer question.

Rail infrastructure is a genuine parcel-adjacency concern (proximity, crossing exposure, ROW encumbrance, quiet-zone and horn-noise disclosure) and is NOT covered by any current rail or by ADR-025. It is a NEW rail, not a subcategory of RRC. Naming them both "RRC" guarantees a future agent conflates them.

## 2. The structural read

OWN and RRC-wells are the same class as the two-factory joint the parcel-node sweep is closing right now: **the data (or the contract shape) exists, and the EDGE to the property spine does not.** Neither is an acquisition problem.

- OWN: relational rows in `cad_property`, no atom family, no edge.
- RRC: atom shapes on npm, no rows anywhere, no `parcelNodeId` edge.
- Rail tracks: no source wired, no shape, no edge.

## 3. Classification against the 2026-08-01 scale ruling

That decision splits new layers into statewide-UNIFORM (cheap, ride alongside the scale) versus per-jurisdiction-ASSEMBLY (carry zoning/setback cert cost, deferred until the mold proves wide). Applying it honestly:

| Candidate | Source shape | Class | Verdict |
|---|---|---|---|
| OWN owner-fact | `cad_property`, already loaded, one writer | Neither — it is a rail over data we HOLD, no new source, no assembly | **Proceed now.** Cheaper than a uniform layer; no cert project. |
| RRC wells | One statewide source (RRC public GIS), uniform schema, no per-city assembly | **Statewide-uniform** — the OZ pattern | Eligible for the parallel cheap track. |
| RRC pipelines | One statewide source (RRC/PHMSA), uniform | **Statewide-uniform** | Eligible, but see R2 on scope. |
| Rail tracks | One statewide/national source (TxDOT / FRA / NTAD), uniform | **Statewide-uniform** | Eligible; genuinely new rail. |
| O&G land lens (leases, interests, DOI, obligations) | County deed records + operator data | **Per-jurisdiction-assembly**, tenant-private | **HOLD** per the ruling. Not launch scope. |

That last row is the important boundary. ADR-025's land and capital lenses are a VERTICAL PRODUCT (og-twin, Reeves/Permian, landman workflow). The county manifest only needs the OPERATIONS-lens public-record surface — what is physically on or near this parcel. Pulling the full ontology into the Texas-flush launch gate would import a tenant-private, deed-derived, per-jurisdiction-assembly program into a public-record statewide fabric. Those are different products and must not be merged by a rail name.

## 4. Proposed rail restructure

The operator's ruling: wells/pipelines as top-level buckets is fine "as long as we can subcategorize under that." Two mechanisms exist and they are not the same:

- **Split the rail** — more cells in the manifest, each independently scored, changes the denominator.
- **Subcategorize within a rail** — one cell, with a sub-facet breakdown behind it.

Recommendation: **split at the SOURCE-and-GEOMETRY boundary, subcategorize within it.** Two things that come from different endpoints with different geometry types cannot share one honest coverage number; things from ONE endpoint that differ only by attribute should subcategorize.

| Proposed rail | Geometry | Source | Subcategories (within the cell) |
|---|---|---|---|
| `rrc-wells` | point (surface hole) | RRC public GIS W-1 / wellbore | status: producing / permitted / dry / **plugged-abandoned**; type: oil / gas / injection / **disposal**; orphaned-well flag |
| `rrc-pipelines` | line | RRC T-4 / PHMSA NPMS | carrier: gas / hazardous-liquid / gathering; status: active / abandoned; diameter class |
| `rail-corridor` | line + ROW polygon | TxDOT / FRA / NTAD | status: active / abandoned / rail-trail; class: mainline / spur / yard; at-grade crossing points |

Subcategories are BODY FIELDS on the atom, not new rails — they are what makes "3 wells" answerable as "1 producing, 2 plugged," which is the difference between a datapoint and an answer. Disposal and plugged-abandoned wells are called out because they are the highest-salience buyer facts (injection-well proximity, orphaned-well liability).

This takes the rail count from 12 to 14 (`owner` stays one; `rrc` becomes two; `rail-corridor` is new). **That changes the manifest denominator** — 254x14 = 3,556 cells — and therefore every completeness percentage we have quoted. It cannot be done quietly. See R1.

## 5. Scope

Sequenced so nothing contends with the two lanes in flight (parcel-node sweep on the atoms DB; K3 PMTiles bake reading the deployment DB).

### Wave 1 — OWN (no new source; highest value per unit work)

| Item | Work | Notes |
|---|---|---|
| O1 | `owner-fact` atom family in the contract (additive minor) | Fields: `ownerName`, `ownerMailingAddress`, exemption codes, value stack, `taxYear`, `sourceVintage`. `accessPolicy: public-paid` per the standing ruling. |
| O2 | Engine registration in `PROPERTY_ENTITY_TYPES` | Same pattern as #291's three families. |
| O3 | County writer `write-owner-fact-county.mjs` | Clone of the `cad-parcel-roll` writer; joins `cad_property` to `parcel-node` on `(county_fips, prop_id)` — the join already proven by the land-use scorer. |
| O4 | Rail declaration update + `countyRailRefreshCli` run | `atomFamilyState` missing to present, `hasWriter` true. |
| O5 | Gate + display | Served `public-paid`, default-hidden in PE. This is where "we just don't display them by default" becomes true. |

Dependency: none. Runs as soon as the atoms slot frees (after the sweep) — O1/O2 are code and can start immediately.

**Owner-privacy note, flagged not decided:** owner name plus mailing address on 4.5M Texas properties is public record and lawful to serve, but it is the most privacy-sensitive facet in the catalog and the one most likely to draw complaint or a takedown request. `public-paid` plus default-hidden is a defensible posture. Worth an explicit position before it ships, not after. Homestead/exemption codes can imply occupancy; suggest exemption codes ship as flags rather than raw codes on the public tier.

### Wave 2 — RRC wells (statewide-uniform, OZ pattern)

| Item | Work |
|---|---|
| W1 | Source probe: RRC public GIS endpoint, schema, licence, pagination limits, statewide feature count. Exit-bounded, read-only. |
| W2 | Decide storage: bulk table (`tx_rrc_well`) mirroring the NFHL pattern, then atoms — NOT per-parcel on-demand |
| W3 | `well-fact` property-spine atom (operations lens ONLY; NOT the ADR-025 land/capital types) carrying `parcelNodeId` — the missing edge |
| W4 | Point-in-polygon writer joining wells to parcels; plus a proximity band (a well 50 ft off the line matters) |
| W5 | Rail declaration + manifest split per R1 |

**Design note:** the parcel edge must carry both ON-parcel and NEAR-parcel semantics. A strict point-in-polygon join answers the wrong question for a buyer — adjacency is the real concern. Recommend `on-parcel` plus a named proximity radius, with the radius in the atom body so the claim is legible.

### Wave 3 — RRC pipelines, then rail corridors

Same shape as Wave 2 with line geometry (buffer-intersect rather than point-in-polygon). Rail corridors are independent of both and can run in parallel; NTAD/FRA is a clean single national source.

### Explicitly OUT of scope

ADR-025's land and capital lenses — mineral leases, ownership interests, DOI, obligations, revenue-allocation units, production timeseries. Those are the og-twin vertical product, per-jurisdiction-assembly and tenant-private, HELD per the 2026-08-01 ruling. This document does not touch them.

## 6. Effect on the launch gate

The Texas-flush launch gate is "all 12 rails with writers." Two consequences:

1. OWN currently has NO atom family. As written, the gate cannot close without building it — Wave 1 is therefore launch-gate work, not post-launch. This appears to be unintentional; see R3.
2. If the rail count goes 12 to 14, the gate's own denominator moves. Adding rails immediately before a launch gate defined as "all rails with writers" makes the gate harder by definition. Splitting RRC and adding rail-corridor may be correct for honesty and wrong for launch sequencing.

Cleanest resolution, recommended: make the SPLIT now (it is a declaration edit and costs nothing), and let the new cells sit honestly at `not-yet` / `no-writer`. The manifest's whole purpose is to show what is missing. A launch gate that closes because we never named the gap is the "certified a broken Bastrop" failure at program scale.

## 7. Operator rulings owed

**R1 — Rail restructure.** Split `rrc` into `rrc-wells` + `rrc-pipelines` and add `rail-corridor`, taking 12 rails to 14 and the denominator to 3,556 cells? (Recommend YES, and re-baseline the completeness number in the same change so the drop is explained rather than discovered.)

**R2 — Pipeline scope.** RRC T-4 intrastate only, or PHMSA NPMS as well? NPMS has public-access restrictions on precise alignment for security reasons; worth knowing before the source probe.

**R3 — Is OWN launch-gate scope?** As written the gate requires it. Confirm intended, or amend the gate.

**R4 — Owner privacy posture.** Ratify `public-paid` + default-hidden + exemption-codes-as-flags, or take a different position.

## 8. Corrections this analysis makes to existing records

- Rail declaration `rrc.atomFamilyState` is `partial`; against the property spine it is `missing`. Correct at the next `countyRailRefreshCli` run, with the "published in contract, absent from spine" distinction written into `notes`.
- The Command Center County Manifest header reads "254 counties x 13 rails" and "GRID 254x13" while the API returns `totalRails: 12` and 3,048 cells (254x12). The label is stale from the pre-`join`-removal era. Cosmetic, but it is on the operator-facing console.
- `satisfiedCells` (89) vs `satisfiedPresentCells` (107) is NOT an inconsistency — 89 is the rollup-eligible set (non-partial, non-doctrine), 107 is raw satisfied-present, and the 18-cell delta is exactly `satisfiedPresentPartialCells`. 0.897% is correct as quoted. Flagged only because the adjacent field names invite misreading a 20%-higher number as completeness.
