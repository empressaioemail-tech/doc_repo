---
id: 2026-08-08_ATOM_families_adversarial_review
title: Adversarial review — Atom Families Program (1.14.0 BUILD wave)
date: 2026-08-09
status: review finding (read-only; live DB probed; no product code written)
owner: nick
method: live read of npm @empressaio/atom-contract@1.14.0 tag, P:\hauska-atom-contract working tree, GitHub main vs PR #13/#286, CORTEX_DATABASE_URL SELECT, _inbox specify-only + DATA_MODEL reject list
reviews: Atom Families Program claim (contract publish + engine register + BUILD sources live)
related:
  [
    _inbox/2026-08-08_ATOM_families_specify_only_shapes,
    _inbox/2026-08-08_DATA_MODEL_adversarial_review,
    _inbox/2026-08-08_ATOM_families_ten_rail_spec,
    _scratch/atom_families.md,
  ]
---

# Adversarial review — Atom Families Program (1.14.0 BUILD wave)

**VERDICT: PARTIAL HOLD WITH FATAL GAPS**

The contract **shapes** for three BUILD families exist on npm tag `v1.14.0` and the Zod layer implements real typed absence. That is not the same as "built and published" in the sense this program uses elsewhere: **main is not merged**, **engine registration is not on main or deployed**, **zero persistence writers exist**, **the manifest dimension was not refreshed**, **MCP does not serve the new types**, and **the NFHL bulk store the statewide fabric assumes is not applied**. npm publish without engine register repeats the exact UNPUB defect footprint/easement had before #282 — except now it is worse because the tag bypasses an open PR.

---

## Explicit verdicts (required)

| Question | Answer |
|---|---|
| **Typed absence genuine for the three BUILD families?** | **Yes, in contract Zod only.** `flood-hazard-fact`, `cad-parcel-roll`, and `land-use-fact` mirror `building-footprint` / `utility-easement`: `sourceTier: "absent"` requires `verifiedAbsence` with nonempty `provenanceScope`; per-parcel `absence.kind` is mutually exclusive with claim fields. Negative tests exist (`property.test.ts`). **Program-wide typed absence is not genuine:** `buildable-envelope` still carries honest decline only as engine-only `warmVerifyDecline*` (`honest-decline-promote.ts:33-106`), off-contract and export/MCP-fragile per prior audit. |
| **`cad-parcel-roll` / `land-use-fact` BUILD source live?** | **Bulk store LIVE.** `SELECT count(*), count(DISTINCT county_fips) FROM cad_property` on CORTEX_DATABASE_URL (hauska-prod-497015, 2026-08-09): **4,599,477 rows / 15 counties**. Operator brief "~1.07M" and ten-rail spec "15 rows" are stale (July-era 5-county snapshot). **No atom writer reads it yet** — only `countyCoverageScoreCli.ts` scores a ledger facet. |
| **`flood-hazard-fact` BUILD source live?** | **Split — on-demand LIVE, bulk NOT LIVE.** `femaNfhlAdapter` hits FEMA ArcGIS MapServer/28 per point (`packages/adapters/src/federal/fema-nfhl.ts`). **`to_regclass('public.tx_fema_nfhl_flood_zone')` = NULL** on the same DB (ldt #398 migration not applied). Statewide fabric "data is landing" claim for bulk STORE is **false today**. |
| **Land-use writer vs Cotality?** | **Cotality not wired to the live scorer.** `countyCoverageScoreCli.ts` joins `cad_property.property_use_code` to `txgio_parcel` (lines 342-393, 557-611). Zero Cotality imports in that file. Cotality `land_use_code` remains in dead adapter code (`national/cotality.ts:143`) but is not the manifest writer path. |

---

## Attack findings

### 1 — CLAIM: Contract 1.14.0 is merged and published as a completed BUILD wave

**CLAIM.** Program asserts `@empressaio/atom-contract@1.14.0` ships `flood-hazard-fact`, `cad-parcel-roll`, `land-use-fact`.

**EVIDENCE.** npm `version` => `1.14.0` (published 2026-08-09T02:11:04Z). Tag `v1.14.0` commit `13a7bfb` contains all three schema files. **GitHub `main` is still `d0c2641` (1.13.0 merge #12).** PR #13 state: **OPEN**, `mergedAt: null`. `flood-hazard-fact.ts` on `main`: **404**.

**BREAK-OR-HOLD.** **BREAK.** Publish-from-tag without main merge is tag-only delivery: consumers on git main cannot reproduce the npm artifact; CI on main does not contain the shapes; the open PR body still lists `npm publish` as unchecked. "Published" is true for npm installs; "landed" is false for the repo of record.

**RECOMMENDED CHANGE.** Merge PR #13 to `main`, then republish or verify tag ancestry matches main HEAD. Do not cite 1.14.0 as closed until main = tag.

---

### 2 — CLAIM: Engine registration landed (PR #286 closes UNPUB for cad / flood / landuse)

**CLAIM.** `PROPERTY_ENTITY_TYPES` includes all three BUILD families; registration closes the footprint/easement UNPUB pattern.

**EVIDENCE.** Local working tree / PR branch: length **10**, includes all three (`property-instances.ts:123-134`). **GitHub `main` `PROPERTY_ENTITY_TYPES`:** seven entries only — ends at `utility-easement`; **no** `flood-hazard-fact`, `cad-parcel-roll`, `land-use-fact`. PR #286: **OPEN**, `mergedAt: null`. Deployed engine-api revision in `_STATE.md` predates this branch.

**BREAK-OR-HOLD.** **BREAK.** Contract publish without engine register is the **UNPUB defect by definition** (DATA_MODEL review Proposal 6: "registered in registry.ts **and** written by a named adapter"). npm 1.14.0 makes manifest rails **callable in theory** while engine **rejects or ignores** them in practice. Partial failure — name it.

**RECOMMENDED CHANGE.** Merge #286 before any dispatch claims BUILD families are "registered." Pin deployed engine-api only after merge + deploy probe.

---

### 3 — CLAIM: BUILD sources exist LIVE for bulk mint paths

**CLAIM.** Data is present to populate atoms at county scale.

**EVIDENCE.**

| Family | Store / path | Live probe (2026-08-09) |
|---|---|---|
| `cad-parcel-roll` | `cad_property` | **4,599,477 rows, 15 counties**; 4,525,073 rows with non-null `owner_name` |
| `land-use-fact` | `cad_property.property_use_code` | Same table; scorer confirms join path. Comal (48091) reported **0** rows with `property_use_code` in scratch — present-tier atoms impossible there until ingest fixes code column |
| `flood-hazard-fact` (bulk) | `tx_fema_nfhl_flood_zone` | **`to_regclass` => NULL** — table absent |
| `flood-hazard-fact` (on-demand) | FEMA NFHL ArcGIS adapter | Adapter registered; point query only |

**BREAK-OR-HOLD.** **BREAK for flood bulk; HOLD for CAD with writer gap.** Program briefs that equated CAD to "~1.07M" or "15 rows" are wrong — the store is **4.6× larger** than the July brief and **not** "15 rows" (that meant 15 **counties**). Flood "landing" for L4 statewide fabric is **not live** on the substrate DB this review probed.

**RECOMMENDED CHANGE.** Do not mint county-batch `flood-hazard-fact` from bulk until ldt #398 migration applied and row count verified. For land-use, gate county verified-absence on `property_use_code` column presence, not merely `cad_property` row count.

---

### 4 — CLAIM: Typed absence is first-class across the program (not bolted like buildable-envelope)

**CLAIM.** 1.14.0 BUILD families fix the absence dialect called out in adversarial reviews.

**EVIDENCE.** New schemas use shared `SITE_LAYER_VERIFIED_ABSENCE_SCHEMA`, `superRefine` fail-closed on `sourceTier === "absent"` without `verifiedAbsence` — same structure as `building-footprint.ts:110-117`. `cad-parcel-roll` adds owner gate in **contract** (`joinPassedOwnerMatchGate` blocks owner fields). **`buildable-envelope.ts` has no `absence` field.** Engine still writes `warmVerifyDecline` / `warmVerifyDeclineCode` off-contract (`honest-decline-promote.ts:42-106`). `countyRailDimension.ts` envelope rail note still says absence rides off-contract fields.

**BREAK-OR-HOLD.** **HOLD for the three new families (genuine in Zod). BREAK for program claim of "typed absence everywhere."** The headline derived rail (envelope) remains the bolted pattern the DATA_MODEL review queued to fix. Shipping three correct families while leaving envelope on engine extensions is **selective honesty**, not closure.

**RECOMMENDED CHANGE.** Either add `buildable-envelope.absence` in the same release wave or stop implying the absence program is closed. Do not cite 1.14.0 as resolving Proposal 5's envelope half.

---

### 5 — CLAIM: Rejected DATA_MODEL proposals were not re-introduced

**CLAIM.** No ring atom, no new relationship layer, no parcelNodeId re-key, no `parcel-record`.

**EVIDENCE.** Grep on `P:\hauska-atom-contract\src\property`: no `parcel-record`, no ring geometry body on any property atom. `parcel-node.ts:42-47` explicitly forbids ring bytes; uses `geometryStoreRef` pointer only. CHANGELOG 1.14.0: "Parcel ring atoms … Geometry Law unchanged"; "New relationship layer — `atom_links` already ships." `cad-parcel-roll` adds `keyKind` on the atom (**cheap fix from Proposal 2 reject list**) without changing `parcelNodeId` format or MCP regex. Specify-only doc proposes **extending** `LinkType` / writing `atom_links` rows for RRC — uses existing ADR-010 layer, not a new table.

**BREAK-OR-HOLD.** **HOLD (cannot break).** Rejects were respected in 1.14.0 BUILD scope. **Residual risk:** specify-only shapes file still names `pipeline-segment` and `special-district-membership` for a future pass — correctly excluded from npm tag file list.

**RECOMMENDED CHANGE.** Retire `parcel-record` references in ADR-029 footnotes when touching docs; no code change required for this wave.

---

### 6 — CLAIM: Specify-only families correctly NOT merged into 1.14.0

**CLAIM.** `parcel-owner-facet`, `special-district-membership`, `pipeline-segment`, `soil-survey-fact` stay out of published contract.

**EVIDENCE.** npm tag `v1.14.0` property directory listing: 12 `.ts` modules — includes three BUILD families; **excludes** owner/mud/pipeline/soil. Grep `P:\hauska-atom-contract\src`: zero hits for those entity type strings. CHANGELOG "Explicitly NOT in 1.14.0" lists them.

**BREAK-OR-HOLD.** **HOLD.** Specify-only discipline held for this publish.

**RECOMMENDED CHANGE.** Keep specify-only doc in `_inbox` only; do not import shapes into `src/property/index.ts` until a live store exists.

---

### 7 — CLAIM: Manifest denominator still 12 rails (join is not a rail)

**CLAIM.** No drift back to 13.

**EVIDENCE.** `COUNTY_RAIL_DECLARATION.length` = **12** (`countyRailDimension.ts:104-279`); `join` rail absent; `COUNTY_RAIL_COUNT` derived from array length. `countyLedger.test.ts` expects `totalRails: 12`, `254 * 12` manifest cells. Live cortex-api `_STATE.md`: `summary.totalRails=12`. **Stale drift:** `countyRail.ts:16-17` header comment still says "The 13 rails ruled required" — comment-only, not runtime.

**BREAK-OR-HOLD.** **HOLD on runtime denominator; HOLD-with-warning on docs.** Tests and live API use 12. Mockup HTML in `_scratch/command_center_manifest_mockup.html` still encodes pre-1.14.0 `atom:false` for geometry/cad — presentation drift, not denominator math.

**RECOMMENDED CHANGE.** Fix `countyRail.ts` comment to "twelve rails (join quality removed)." Refresh `countyRailDimension.ts` atomFamilyState for cad/flood/landuse when registration merges — see finding 8.

---

### 8 — CLAIM: Manifest will flip from `no-atom` to `present` for cad / flood / landuse after 1.14.0

**CLAIM.** Publishing contract families updates County Manifest cells.

**EVIDENCE.** `countyRailDimension.ts` **not updated for 1.14.0** — verified-against stamp still cites **1.13.0** and seven engine types. Rails still declare: `cad` → `atomFamilyState: "missing"`, `landuse` → `"missing"`, `flood` → `"partial"` with `atomFamilyRef: "parcel-terrain-model (terrain only; no flood atom)"`. No `flood-hazard-fact` / `cad-parcel-roll` / `land-use-fact` strings in `legacy-design-tools` repo grep.

**BREAK-OR-HOLD.** **BREAK.** Contract-only publish without `countyRailRefreshCli` run leaves Command Center showing **no-atom** for rails whose npm shapes exist — the same stale-optimistic defect class this file was written to prevent (header lines 7-16). Manifest completeness number **cannot move** from 1.14.0 contract work alone.

**RECOMMENDED CHANGE.** Edit `countyRailDimension.ts`: set `atomFamilyState: "present"` and `atomFamilyRef` for cad, landuse, flood (split terrain vs flood if flood stays partial until bulk lands). Run refresh CLI. Until then, do not claim manifest cell relief.

---

### 9 — CLAIM: MCP / serve surface includes BUILD families

**CLAIM.** Agents can consume new atoms per MCP-first rule.

**EVIDENCE.** `hauska-mcp-server/src/property-atom-chain.ts:24-30` — chain slots: `parcel-node`, `zoning-fact`, `setback-rule`, `buildable-envelope` only. **No** `flood-hazard-fact`, `cad-parcel-roll`, `land-use-fact`, `building-footprint`, or `utility-easement`. DID regex `:100` matches the same four types.

**BREAK-OR-HOLD.** **BREAK for agent serve.** Contract families invisible to the public MCP property chain — same defect class as pre-1.13.0 `parcel-node` ("advertised type nothing writes" inverted: **written type nothing advertises**).

**RECOMMENDED CHANGE.** Extend `PROPERTY_CHAIN_ENTITY_TYPES` + tool copy + DID regex when engine writers ship; until then BUILD families are storage-contract-only.

---

### 10 — CLAIM: Zero atoms in production is acceptable because "following lane" writes them

**CLAIM.** Registration PR is sufficient progress for this wave.

**EVIDENCE.** Grep `P:\hauska-engine` for `entity_type.*flood-hazard|cad-parcel|land-use` in writers: **no persistence paths**. PR #286 body: "No persistence writers in this PR (following lane)." No `createCadParcelRoll` / `createLandUseFact` / `createFloodHazardFact` call sites outside `property-instances.ts` re-exports.

**BREAK-OR-HOLD.** **BREAK.** "Built" means Zod + fixtures, not atoms. **Code-done != customer-done** standing decision applies: manifest satisfied-present requires stored atoms above threshold, not registry entries.

**RECOMMENDED CHANGE.** See following-lane table below. Do not grade BUILD wave ADOPT until at least one county has probe-verified atoms for each family.

---

## What a following lane MUST build

| Family | Required work |
|---|---|
| **`cad-parcel-roll`** | Engine persistence writer: read `cad_property` row by `{county_fips, prop_id}`; emit present atom with `sourceFile`, `keyKind`, `joinPassedOwnerMatchGate`; emit county `{fips}:_county_coverage` verified absence when roll absent; respect owner gate on owner fields. Merge #286; deploy engine-api. |
| **`land-use-fact`** | Writer from same join as `countyCoverageScoreCli` (prop_id or owner-gated address path); map `property_use_code` → `landUseCode`; emit `join-hold` absence when gate blocks; **do not** read Cotality. Optionally replace ledger facet with atom-backed manifest query over time. |
| **`flood-hazard-fact`** | **Path A (bulk):** Apply ldt #398 migration; load NFHL zip to `tx_fema_nfhl_flood_zone`; parcel polygon intersect writer batch. **Path B (interim):** Adapter-bridge writer from `femaNfhlAdapter` point query at warm/mint time — document as on-demand tier, not statewide fabric. County verified absence when NFHL not probed. |
| **Cross-cutting** | Merge contract #13 + engine #286; deploy both; refresh `countyRailDimension.ts` + run `countyRailRefreshCli`; extend MCP property chain; add `buildable-envelope.absence` (envelope rail still off-contract). |
| **Specify-only (not 1.14.0)** | Owner: join-hold + paywall before `parcel-owner-facet`. MUD/RRC/pipeline/soil: acquisition lanes W3/W4/SSURGO before contract merge. |

---

## Live probe transcript (verbatim)

```
-- CORTEX_DATABASE_URL (hauska-prod-497015), 2026-08-09
SELECT count(*) AS cad_rows, count(DISTINCT county_fips) AS cad_counties FROM cad_property;
 cad_rows | cad_counties
----------+--------------
  4599477 |           15

SELECT to_regclass('public.tx_fema_nfhl_flood_zone') AS nfhl_table;
 nfhl_table
------------

```

---

## Summary line for planner

**Shapes on npm; nothing serves them.** 1.14.0 is a contract-only tag publish with open PR, open engine registration, no writers, no NFHL bulk table, no manifest refresh, no MCP slots — the UNPUB pattern repeated under a new version number.
