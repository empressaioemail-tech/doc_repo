---
id: 2026-08-08_ATOM_families_program_report
title: Atom Families Program report — 1.14.0 BUILD wave (flood / CAD / land-use)
date: 2026-08-08
status: program report — shapes published; registration PR open; writers NOT built
owner: nick
memory_graded: pending
related:
  [
    _inbox/2026-08-08_ATOM_families_ten_rail_spec,
    _inbox/2026-08-08_ATOM_families_specify_only_shapes,
    _inbox/2026-08-08_ATOM_families_adversarial_review,
    _inbox/2026-08-08_CONSUMPTION_CONTRACT_report,
    _inbox/2026-08-08_DATA_MODEL_adversarial_review,
    _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first,
  ]
---

# Atom Families Program report

## Verdict

Three atom families where data exists today are on npm as `@empressaio/atom-contract@1.14.0`: `flood-hazard-fact`, `cad-parcel-roll`, `land-use-fact`. Typed absence is first-class on each shape (same dialect as `building-footprint` / `utility-easement`). Engine registration lands in open PR #286 (CI green; not merged — outside authorization). Specify-only shapes for owner / mud / rrc / soils are filed and **not** in the contract package.

Adversarial verdict: **PARTIAL HOLD WITH FATAL GAPS** (verbatim below). Treat this wave as shape + registration progress, not customer-done. Zero persistence writers; NFHL bulk table not applied; manifest dimension not refreshed; MCP property chain not extended.

## Live ledger (verified 2026-08-09)

`GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`

| Field | Value |
|---|---|
| totalRails | 12 |
| totalCells / manifestCells | 3048 |
| satisfiedCells | 1 |
| texasCompletenessPct | ~0.0395 |
| displayState no-atom | **1524** (cad, flood, landuse, mud, owner, rrc × 254) |
| displayState no-writer | **1016** (easement, footprint, geometry, roads × 254) |
| displayState not-yet | 489 |
| displayState satisfied-present | 19 |

Operator brief's 0.0365% / 1,524 no-atom / 1,016 no-writer matches this surface (completeness % drifted slightly with the live feed).

## Live data probes (this session)

### `cad_property` — LIVE

```
-- CORTEX_DATABASE_URL (hauska-prod-497015), single SELECT, no test suite
cad_property TOTAL {"n":"4599477","counties":15}
BY COUNTY (prop_use nonzero):
48029 703258 use=622764
48113 693556 use=643803
48439 689838 use=685165
48453 492848 use=453710
48085 387334 use=385439
48121 351798 use=305221
48491 319480 use=287671
48209 265852 use=239296
48027 165576 use=130131
48309 114255 use=91072
48091 103207 use=0          <-- Comal: rows exist, zero property_use_code
48187 93728 use=73617
48257 93292 use=70670
48021 77073 use=71954
48055 48382 use=31724
```

Operator "~1.07M" and ten-rail / OPS-1 "15 rows" are both stale. Store capacity analysis's ~4.6M aligns.

### FEMA NFHL bulk — CODE MERGED, TABLE ABSENT

ldt #398 MERGED (`de4fc8b`, 2026-08-09). PR body and live probe agree: migration **not applied**; no ingest against deployment Postgres. `to_regclass('public.tx_fema_nfhl_flood_zone')` => **NULL**. Source zip still real (PR probe: `S_FLD_HAZ_AR` 198,240 features, EPSG:4269). On-demand `fema:nfhl-flood-zone` adapter remains live. Operator ruled BUILD flood anyway on adapter + ready ingest path.

### Land-use writer — LIVE (facet), Cotality DEAD

`countyCoverageScoreCli.ts` scores from `cad_property.property_use_code` with owner-match gate. Cotality `land_use_code` is unused by that path.

## PRs

| Repo | PR | State | Notes |
|---|---|---|---|
| hauska-atom-contract | [#13](https://github.com/empressaioemail-tech/hauska-atom-contract/pull/13) | OPEN, CI green | shapes; tag `v1.14.0` published before merge (operator-authorized) |
| hauska-engine | [#286](https://github.com/empressaioemail-tech/hauska-engine/pull/286) | OPEN, CI green (`typecheck + test` pass) | registers three families; pin `^1.14.0`; **no writers** |

No merges (authorization). No deploys. No bulk production writes.

## Published contract version — verbatim `npm view`

```
$ npm view @empressaio/atom-contract version
1.14.0

$ npm view @empressaio/atom-contract@1.14.0 version
1.14.0

$ npm view @empressaio/atom-contract dist-tags --json
{
  "latest": "1.14.0"
}

$ npm view @empressaio/atom-contract time --json
{
  "created": "2026-07-07T13:03:15.682Z",
  "modified": "2026-08-09T02:11:04.188Z",
  "1.7.0": "2026-07-07T13:03:15.994Z",
  "1.8.0": "2026-07-23T20:00:09.016Z",
  "1.9.0": "2026-07-23T20:41:45.477Z",
  "1.10.0": "2026-07-24T01:36:46.660Z",
  "1.11.0": "2026-07-25T22:02:40.655Z",
  "1.12.0": "2026-08-08T19:26:43.743Z",
  "1.13.0": "2026-08-08T23:50:23.151Z",
  "1.14.0": "2026-08-09T02:11:04.024Z"
}
```

Publish mechanism: GitHub Actions `Publish to npm` on tag `v1.14.0` (run 31289787778 success). Tag points at PR tip `13a7bfb` (main still at 1.13.0 until #13 merges — adversarial finding 1).

## Built families — shape and typed absence

### `flood-hazard-fact` (public-free)

| Element | Design |
|---|---|
| Identity | `atomDid` `fhfact_<16-hex>`; `parcelNodeId` |
| Present finding | `sourceTier: "fema-nfhl"`; required `inSpecialFloodHazardArea`; optional `floodZone` / `zoneSubtype` / `baseFloodElevation` |
| Zone X / outside mapped | **Present** with `inSpecialFloodHazardArea: false` (not absence) |
| Per-parcel absence | `absence.kind: "no-flood-coverage"` |
| County / probe absence | `sourceTier: "absent"` **requires** `verifiedAbsence` + nonempty `provenanceScope` |
| Fail-closed | claim fields exclusive of absence; absent tier must not carry SFHA claims |

### `cad-parcel-roll` (public-free)

| Element | Design |
|---|---|
| Identity | `cadroll_<16-hex>`; `parcelNodeId` + `taxYear` + `countyFips` + `propId` + `keyKind` |
| Gate | `joinPassedOwnerMatchGate` required; **false ⇒ ownerName / ownerMailingAddress rejected by Zod** |
| Present | CAD roll fields + required `sourceFile` when not absent |
| Absence kinds | `no-cad-row`, `join-hold` |
| County absent | `sourceTier: "absent"` + `verifiedAbsence` |

### `land-use-fact` (public-free)

| Element | Design |
|---|---|
| Identity | `lufact_<16-hex>`; `parcelNodeId` + `taxYear` |
| Present | `sourceTier: "cad-authoritative"` requires `landUseCode` |
| Source rule | Cotality extinguished — no cotality tier; writers read `cad_property.property_use_code` only |
| Absence kinds | `no-land-use-code`, `no-cad-row`, `join-hold` |
| County absent | `sourceTier: "absent"` + `verifiedAbsence` |

## Engine registration — verbatim proof (PR #286 tip)

```typescript
export type PropertyEntityType =
  | "parcel-node"
  | "zoning-fact"
  | "setback-rule"
  | "buildable-envelope"
  | "parcel-terrain-model"
  | "building-footprint"
  | "utility-easement"
  | "flood-hazard-fact"
  | "cad-parcel-roll"
  | "land-use-fact";

export const PROPERTY_ENTITY_TYPES: ReadonlyArray<PropertyEntityType> = [
  "parcel-node",
  "zoning-fact",
  "setback-rule",
  "buildable-envelope",
  "parcel-terrain-model",
  "building-footprint",
  "utility-easement",
  "flood-hazard-fact",
  "cad-parcel-roll",
  "land-use-fact",
];
```

Test pin: `PROPERTY_ENTITY_TYPES.length).toBe(10)` and `toContain` for each new type (`parcel-node-registration.test.ts`). Package pin: `"@empressaio/atom-contract": "^1.14.0"`.

**Not on main / not deployed** — registration is PR-only until merge (adversarial finding 2).

## Specify-only (not merged) — shapes and why

Filed: `_inbox/2026-08-08_ATOM_families_specify_only_shapes.md`

| Family | accessPolicy | Why not merged |
|---|---|---|
| `parcel-owner-facet` | **public-paid** | Crosswalk-HOLD counties; wrong owner worse than missing; needs join-hold + paywall |
| `special-district-membership` | public-free | No store / adapter (W4 HELD) |
| RRC wells | existing O&G types + `atom_links` | No thirteenth well atom; writers must write edges |
| `pipeline-segment` | public-free | No adapter / table (W3 HELD) |
| `soil-survey-fact` | public-free | Adapter payload only; no bulk SSURGO; 3DEP stays terrain reference-field |

Rejected proposals not re-opened: ring atom, new relationship table, `parcelNodeId` re-key, phantom `parcel-record`.

## Reviewer verdict (verbatim)

From `_inbox/2026-08-08_ATOM_families_adversarial_review.md`:

> **VERDICT: PARTIAL HOLD WITH FATAL GAPS**
>
> The contract **shapes** for three BUILD families exist on npm tag `v1.14.0` and the Zod layer implements real typed absence. That is not the same as "built and published" in the sense this program uses elsewhere: **main is not merged**, **engine registration is not on main or deployed**, **zero persistence writers exist**, **the manifest dimension was not refreshed**, **MCP does not serve the new types**, and **the NFHL bulk store the statewide fabric assumes is not applied**. npm publish without engine register repeats the exact UNPUB defect footprint/easement had before #282 — except now it is worse because the tag bypasses an open PR.

Closing line:

> **Shapes on npm; nothing serves them.** 1.14.0 is a contract-only tag publish with open PR, open engine registration, no writers, no NFHL bulk table, no manifest refresh, no MCP slots — the UNPUB pattern repeated under a new version number.

## Following lane — what must populate each

| Family | Must build next |
|---|---|
| `cad-parcel-roll` | SELECT→atom writer from `cad_property`; enforce owner gate; county verified-absence for no-REST counties |
| `land-use-fact` | Writer from same join as `countyCoverageScoreCli` (not Cotality); Comal-style zero-code counties get typed absence, not empty present |
| `flood-hazard-fact` | Apply #398 migration + `nfhl-ingest` **or** interim adapter-bridge writer at warm time (document on-demand vs bulk) |
| Cross-cutting | Merge contract #13 + engine #286; deploy; refresh `countyRailDimension.ts` (cad/flood/landuse → present + atomFamilyRef) + `countyRailRefreshCli`; extend MCP `property-atom-chain`; optional `buildable-envelope.absence` |

## Artifacts

- `_inbox/2026-08-08_ATOM_families_program_report.md` (this file)
- `_inbox/2026-08-08_ATOM_families_specify_only_shapes.md`
- `_inbox/2026-08-08_ATOM_families_adversarial_review.md`
- `_scratch/atom_families.md`
