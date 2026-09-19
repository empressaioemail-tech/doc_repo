# OPS-21 D6 (P-141) — legacy-design-tools cell-state consumer inventory

Produced by a read-only Explore agent against `origin/main` of `legacy-design-tools`, 2026-09-10.
Zero writes made to this repo. Full methodology, every row read and classified by hand (not from
grep snippets alone) before being recorded here.

## Search method (reproducible)

Each of the following run as `git grep -l` against `origin/main`, unioned and de-duplicated:
`absent-verified` | `not-applicable` | `unaccounted` | `"refused"` | `cell_state` | `CellState` |
`cellKind` | `EARNED_CELL_KINDS` | `isEarnedCell` | `isPublishable` | `isUnaccounted` |
`available-on-request`. The last six terms returned 0 files today — none of hauska-engine's/
hauska-factory's own symbol names or the new state's literal string appear anywhere in LDT yet.

## TOTAL FILES MATCHING THE SEARCH: 149

Of these, roughly 55 are real production consumers (a mix of positive-enumeration and
negative-check code), ~14 are schema/type declarations, and the remainder are tests, fixtures, or
confirmed false-positive vocabulary collisions (other closed-enum state machines in the same
codebase that happen to reuse strings like "refused" or "absent-verified" for an unrelated
concept — Smart Files purchased-document absence, P-85 clerk-portal document classification,
txgio radius/street search refusal envelopes, boundary-edge provenance, buildable-envelope bake
refusal codes, and a county-GIS-layer coverage-scoring vocabulary).

## Full per-file table

| file path | line(s) | classification | evidence |
|---|---|---|---|
| artifacts/api-server/src/lib/parcelRecordAllowlist.ts | 55-56, 168-171 | prose-only | comment recites the five states describing an OPS-16 zoning fix; actual code logic is an unrelated 3-value `record\|legacy\|refused` allowlist state |
| artifacts/api-server/src/lib/parcelRecordCellRead.ts | 220-352, 68-107 | positive-enumeration-fails-closed / type-definition | `switch(kind){case "value":...case "unaccounted":...default: return {state:"refused",code:"malformed-cell",...}}` — the chokepoint reader; already refuses an unrecognized kind |
| artifacts/api-server/src/lib/parcelRecordFactRead.ts | 60-105, 190-271 | positive-enumeration-fails-closed / type-definition | if-chain checks each of 5 kinds, final `return {state:"refused",code:"malformed-cell",reason:"...unrecognized kind..."}` |
| artifacts/api-server/src/lib/wellFactFromParcelRecord.ts | 126-134, 168 | **positive-enumeration-fails-open** | `if (cell.state === "refused"){…} if (cell.state === "absent"){…} // cell.state === "present"` — implicit present default |
| artifacts/api-server/src/lib/agValuationFactFromParcelRecord.ts | 102, 119, 132 | **positive-enumeration-fails-open** | same 2-check-then-implicit-present shape |
| artifacts/api-server/src/lib/cityLimitsFactFromParcelRecord.ts | 84, 91, 105 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/overlayDistrictsFactFromParcelRecord.ts | 89, 106, 120 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/schoolDistrictFactFromParcelRecord.ts | 71, 88, 104 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/specialDistrictFactFromParcelRecord.ts | 107, 124, 139 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/utilityServiceFactFromParcelRecord.ts | 90, 107, 120 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/valueHistoryFactFromParcelRecord.ts | 109, 126, 139 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/zoningFactFromParcelRecord.ts | 156, 166, 179 | **positive-enumeration-fails-open** | same shape (`REFUSAL_CODE_MAP` at 119 is TS-exhaustive/safe) |
| artifacts/api-server/src/lib/setbacksFactFromParcelRecord.ts | 143, 153, 166 | **positive-enumeration-fails-open** | same shape |
| artifacts/api-server/src/lib/maxImperviousCoverPctFactFromParcelRecord.ts | 74, 91, 107 | **positive-enumeration-fails-open** | same shape; also reads `cell.raw.*` only reachable via the "present" branch |
| artifacts/api-server/src/lib/cadRollFactFromParcelRecord.ts | 75-99, 138-145, 149-155, 168-177 | mixed: fails-open (75-99,138-145) / fails-closed (149-155,168-177) | `if (cell.state === "refused") return null; if (cell.state==="absent"){…}` then unconditional `cell.value` use, vs `if (cell.state !== "present") return null;` |
| artifacts/api-server/src/lib/floodHazardFactFromParcelRecord.ts | 60-124 | **positive-enumeration-fails-closed (gold standard)** | `default: { const _exhaustive: never = cell; throw new Error(...); }` — true TypeScript exhaustiveness/assertNever, the pattern every other adapter in this list should be brought up to |
| artifacts/api-server/src/lib/cadRollServeCutover.ts | whole file | not a direct consumer | pure orchestration, delegates to cadRollFactFromParcelRecord.ts |
| artifacts/api-server/src/lib/parcelGateVerdictRead.ts | 13, 68-69 | different-but-related vocabulary | `verdict IN ('pass','refuse','excluded')` — an aggregate gate signal over cell counts, not a per-cell kind switch |
| artifacts/api-server/src/lib/{well,floodHazard,agValuation,buildingFootprint,landUse,maxImperviousCoverPct,overlayDistricts,owner,pipeline,schoolDistrict,specialDistrict,utilityService,valueHistory}FactRead.ts | various | type-definition (safe) | all use an open `absence: {kind: string; reason: string}` shape, not a closed union — impose no risk on their own |
| artifacts/api-server/src/lib/boundaryEdgeFactRead.ts | 119 | false positive (different domain) | `provenance: {kind: string \| null}` — boundary-edge provenance, unrelated |
| artifacts/api-server/src/lib/smartSiteStub.ts | 26-32, 145-152, 154-161, 96-104 | fails-open (26-161) / fails-closed (96-104) | `SMART_SITE_RAIL_STATES=["present","absent-verified","unknown","refused","unread"]`; `railStateFromZoningFact`/`railStateFromSetbacksFact`: silently fall back to the **stale legacy bake-derived value**, discarding a genuine parcel_record determination |
| **artifacts/api-server/src/lib/parcelConstraintProjection.ts** | 421-428 | **positive-enumeration-fails-open — HIGH RISK** | `return cell.state === "present" \|\| cell.state === "absent-verified";` — any other state (incl. the 6th) silently excluded from "evaluable", dropped from search-count eligibility |
| **artifacts/api-server/src/lib/parcelConstraintSearch.ts** | 306-314, 372 | **positive-enumeration-fails-open — HIGH RISK, hot path** | `` `${stateColumn} in ('present','absent-verified')` `` literal SQL IN-list; own doc comment: *"if it ever admits a fourth state, the not-evaluated set silently drains into the other two"* — constraint-search hot path |
| artifacts/api-server/src/lib/verdictLayerServe.ts | 18-46, 398-406 | type-def/positive-enum (18-46) / negative-check-fails-closed (398-406) | 6-value `LAYER_ABSENCE_VERDICTS` array; own doc states the serve boundary's "four-state contract... does not permit a fifth state" — a related-but-separate absence vocabulary that would also need extending |
| artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts | 489-491, 512-533 | type-def / **positive-enumeration-fails-closed** | `LEAF_ABSENCE_VERDICTS = new Set([...])`; `isEarnedLeafAbsence` returns `false` for any unrecognized verdict — correctly rejects |
| artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts | 801, 815-819 | prose / fails-open (low severity) | CLI diagnostic stats counter only, undercounts silently, no behavior change |
| **artifacts/api-server/src/ctxB6VerifySitusAddressCli.ts** | 73-74, 85-123 | **positive-enumeration-fails-closed** | verbatim reproduction of hauska-factory's own `classifyRequiredLeaf` — explicitly returns `{state:"unrecognised-declared-state", ok:false}` for an unrecognized token; caveat: only fires when the leaf uses the `verdict`/`state` key |
| artifacts/api-server/src/lib/structuralFactResolve.ts | 18-31 | type-definition | `StructuralFactPresent \| StructuralFactAbsent` — closed 2-value union, needs a 3rd member |
| **artifacts/api-server/src/lib/structuralFactToFacetsWire.ts** | 18, 229-243, 100-179 | **positive-enumeration-fails-open — SINGLE HIGHEST-RISK LINE FOUND** | line 229: `if (parcelRecordZoningFact && parcelRecordZoningFact.state !== "refused") { if (...==="present"){…} else {/* treated as absent-verified/not-applicable */} }` — any state that is neither "present" nor "refused" (incl. a future `available-on-request`) is silently collapsed into the absence-serving branch, on the parcel facets/inspect wire, every request |
| **artifacts/api-server/src/lib/r1BriefCompose.ts** | 199-234 | **positive-enumeration-fails-open — MOST DANGEROUS DIRECTION FOUND** | `drainageDisposition`: `if (state==="refused")… if (state==="absent")… return Object.keys(record).length>0 ? "present":"unread";` — an unrecognized-but-populated state (exactly what an `available-on-request` payload looks like) is reported as **"present"**, i.e. fabricates data-presence, on every R1 brief compose |
| artifacts/api-server/src/lib/landUseFactVerdict.ts, recordRetirement.ts | 46/65, 14/47 | negative-check-fails-closed | single-literal guards, safe |
| artifacts/api-server/src/lib/parcelDrawFromReads.ts | 105-164 | fails-open (low severity, safe direction) | `if (present){…} if (absent){…} return {state:"refused"};` — implicit-refused default; safe direction but still drops real content of an unrecognized state |
| artifacts/api-server/src/lib/parcelDrawStub.ts | 10-15, 195-212 | type-definition | 4-value `DrawOverlayState` sibling vocabulary for map-drawn overlays; needs a product decision on whether the 6th state is representable as a drawn overlay at all |
| lib/db/src/schema/peParcelConstraintIndex.ts | 25-30 | schema-enum | Postgres CHECK on `pe_parcel_constraint_index`'s rail-state columns: `IN ('present','absent-verified','unknown','refused','unread')` — hard DB rejection, correct today, blocks legitimate writes once the state is real |
| lib/db/drizzle/0094_p106_parcel_constraint_index.sql | 121 | schema-enum | the materialized migration matching the schema above |
| **artifacts/smartsite-mcp/src/mcp-app.ts** | 44-49, 293-299, 575-580, 1855-1866 | type-def (44-49) / **fails-open (293-299, 1855-1866) — HIGHEST REACH OF ANY FINDING** / fails-closed (575-580) | `CellState = "present"\|"absent-verified"\|"unknown"\|"refused"\|"unread"`; `railState()` and `sectionPaint()` both fall through 5-6 literal ifs to `"unread"` — silently narrates genuinely-available data as "not read, nothing was checked" **to the calling AI agent**, on every `get_smart_site` MCP call |
| **artifacts/smartsite-mcp/src/tool-honesty.ts** | 237-271, 333-341 | fails-open (237-271) / fails-closed (333-341) | module's own doc: "a claimed state this union could not name was discarded and re-derived... the defect this item closes" (P-91 v3 item 1) — the exact defect class, just not re-extended for the newest state; falls through to `"present"` if data is set, else `"absent"` |
| artifacts/smartsite-mcp/src/vocabulary.ts | 60-70, 112-296 | fails-open (soft — documentation gap) | 19-entry hand-maintained token-to-displayText table; a served 6th token reaches the model undocumented, not rejected |
| artifacts/smartsite-mcp/src/constants.ts | 21 | prose-only | tool-description string enumerates the 5 known words for the model's own understanding |
| artifacts/smartsite-mcp/src/tools.ts, recordsExtraction.ts | various | false positive (different vocabulary) | MCP tool-name routing / P-85 document-classification state, unrelated |
| artifacts/api-server/src/routes/{brokerageNodeFacets,brokeragePlaceConstraintSearch,brokeragePlaceRadiusSearch,brokeragePlaceStreetSearch,propertyExplorer}.ts | various | prose-only / pass-through / false positive | aggregators over already-classified adapters, or unrelated txgio search refusal envelopes |
| artifacts/api-server/src/lib/railScoring/engine.ts | 65, 103, 256 | false positive (different vocabulary) | county-GIS-layer coverage-scoring vocabulary (`satisfied-present\|satisfied-absent\|not-yet`) |
| artifacts/api-server/src/lib/setbackProvenanceDisposition.ts | 6, 55-127 | false positive (different domain) | boundary-edge (P2b DrawEdge) setback-atom disposition, a different data source than parcel_record_cell |
| artifacts/api-server/src/lib/envelopeBriefRefusal.ts | 6-14, 93 | false positive (different domain) | buildable-envelope bake-status refusal codes |
| artifacts/api-server/src/lib/{recordsRequestClassifyWrite,recordsRequestDocumentServe,cadRollValue}.ts, artifacts/records-request-worker/src/{run,worker}.ts | various | false positive (different domain) | P-85 clerk-portal document classification / studio-tier gating refusal |
| lib/adapters/src/federal/census-acs-rent.ts, lib/cad-ingest/src/txgio/zoning-layers.ts | 84-86, 401 | prose-only | Census ACS numeric-suppression sentinel prose / a live-verification dispatch-note comment |
| lib/db/src/schema/smartFiles.ts, lib/db/drizzle/0079_smart_file_absence_determinations.sql, lib/db/src/__tests__/__fixtures__/schema.sql.template, lib/db/src/__tests__/integration/smartFileAbsence.integration.test.ts | various | false positive (genuine string collision) | `SMART_FILE_ABSENCE_VERDICTS = ["absent-verified","lookup-failed"]` — the Smart Files purchased-document feature, unrelated to parcel_record despite reusing "absent-verified" |
| ~60 `*.test.ts` files across artifacts/api-server and artifacts/smartsite-mcp | — | test-or-fixture | exercise the adapters/readers above as fixtures; notably `structuralFactToFacetsWire.test.ts` (418-431, 521-569) and `nodeFacetBakeTier1Conformant.test.ts` (539-551, 1406-1622) each contain their own verbatim reproduction of `classifyRequiredLeaf`/`classifyRequiredLeafVerbatim`, pinning expected behavior at the exact risky line ranges above |

## FAIL-OPEN RISKS, ranked by estimated production likelihood/blast radius

1. **`artifacts/smartsite-mcp/src/mcp-app.ts:293-299,1855-1866`** (`railState`/`sectionPaint`) — every `get_smart_site` MCP call; silently narrates the new state as `"unread"` to any calling AI agent. Highest reach, most misleading direction.
2. **`artifacts/api-server/src/lib/r1BriefCompose.ts:223-234`** (`drainageDisposition`) — every R1 brief compose; the only place in the whole survey that defaults an unrecognized-but-populated state to `"present"` — fabricates data-presence. Single most dangerous direction found.
3. **`artifacts/api-server/src/lib/structuralFactToFacetsWire.ts:229-243`** — parcel facets/inspect wire, every applicable request; collapses any non-present/non-refused state into the absence-serving branch.
4. **`artifacts/api-server/src/lib/parcelConstraintSearch.ts:306-314,372`** — constraint-search hot path; self-documented "silently drains into the other two" risk.
5. **`artifacts/api-server/src/lib/parcelConstraintProjection.ts:421-423`** — feeds the same constraint-search cache; drops the new state's cells from "evaluable" silently.
6. **The 13 `*FactFromParcelRecord.ts` adapters** — each runs on live per-parcel reads; currently masked only because the shared upstream reader never emits a 4th state yet. The moment `parcelRecordCellRead.ts`/`parcelRecordFactRead.ts` are extended, all 13 mis-serve the new state as `"present"` data. **Fix in the same lane as the reader, not left for later** — this is the largest blast-radius item once the upstream fix lands.
7. **`artifacts/smartsite-mcp/src/tool-honesty.ts:237-271`** — same MCP brief-section path as #1; the module's own doc describes fixing this exact defect class once before and just hasn't been re-extended.
8. **`artifacts/api-server/src/lib/smartSiteStub.ts:145-161`** — feeds the `get_smart_site` stub depth; silently falls back to a stale legacy bake value.
9. **`artifacts/smartsite-mcp/src/vocabulary.ts`, `constants.ts:21`** — soft documentation gaps (agent sees an undocumented token), lower severity.
10. **`parcelDrawFromReads.ts`, `r1BriefCompose.ts:211-218` (`factReadDisposition`)** — lower severity: both default to `"refused"` (the safe direction) but still drop real content.
11. **`nodeFacetBakeTier1ConformantCli.ts:815-819`** — lowest severity: CLI diagnostic undercounter only.

## ALREADY SAFE (no companion-lane fix needed on their own)

`parcelRecordCellRead.ts`, `parcelRecordFactRead.ts` (both chokepoint readers, explicit default
refusal), `floodHazardFactFromParcelRecord.ts` (true TS exhaustiveness/assertNever — the pattern
every other adapter should be brought up to), `nodeFacetBakeTier1Conformant.ts`
(`isEarnedLeafAbsence`), `ctxB6VerifySitusAddressCli.ts` (`classifyRequiredLeaf`, the program's own
namesake defect-class classifier), `landUseFactVerdict.ts`, `recordRetirement.ts`,
`verdictLayerServe.ts`'s upgrade-forbidden gate, `smartSiteStub.ts`'s `railStateFromSectionDisposition`,
`cadRollFactFromParcelRecord.ts`'s value-basis/year-built helpers, every TS-exhaustive
`Record<...>` lookup table (safe once the union type itself is widened), and the 14 legacy-atom
`*FactRead.ts` type files (open `{kind: string}` shape, not a closed union).
