---
id: 2026-08-08_CONTRACT_coherence_audit
title: Contract coherence audit — 13 rails vs atom contract vs node model vs declared sources
date: 2026-08-08
status: audit finding (read-only; no code or config changed)
owner: nick
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, 80_adrs/adr_017_atom_access_control, 90_operations/OPS-1_texas_source_registry, _catalog/texas_roster_v1.json, _inbox/2026-08-08_lightbox_gap_closure_spec, 90_operations/QUEUE_parked_work_index]
method: live source read of P:\hauska-atom-contract (v1.12.0 working tree), P:\hauska-engine, P:\legacy-design-tools, npm registry, and the doc set
---

# Contract coherence audit

Question asked: do the atom contract, the node/entity model, the thirteen declared county rails, and the declared data sources agree with each other. Answer: **no — they diverge in nine places, two of them structural.**

The single largest finding is that the thirteen-rail shape ruled 2026-08-08 is a DOC-LAYER construct with no counterpart anywhere in the contract, the engine registry, or the roster schema. Five of thirteen rails have no atom family at all, four more have a contract shape that the engine has never registered, and the roster tracks only six of the thirteen. The rail list and the atom layer were authored independently and have never been reconciled.

Everything below is traced to a file and line read in this session. Where a mapping does not exist it is marked MISSING and no substitute is invented.

## 1. Rail-to-atom mapping

Contract entity types were enumerated by reading every `entityType: "..."` interface declaration under `P:\hauska-atom-contract\src` (30 types). Engine-registered types were enumerated from `P:\hauska-engine\packages\atoms\src\registry.ts` (17 registrations) plus the instance unions in `property-instances.ts`, `road-instances.ts`, `boundary-instances.ts`, `document-instances.ts`, `workspace-instances.ts`.

| # | Rail | Atom entity_type(s) | Defined where | Verdict |
|---|---|---|---|---|
| 1 | Parcel geometry (Rail C) | **MISSING** — no parcel/geometry atom. `property-boundary-edge` carries lot-line topology only | `P:\hauska-engine\packages\atoms\src\boundary-instances.ts:79` (engine-only; NOT in contract) | **MISSING** — the spine rail has no contract atom |
| 2 | CAD attributes (Rail B) | **MISSING** — no CAD-attribute atom family | nowhere | **MISSING** |
| 3 | Join quality / owner match | **MISSING** — no atom; lives as roster metadata `join_quality.*` | `_catalog/texas_roster_v1.json` per-county `join_quality` block | **MISSING** (not atomized) |
| 4 | Zoning + setback (Rail A) | `zoning-fact`, `setback-rule` | `P:\hauska-atom-contract\src\property\zoning-fact.ts:27`, `src\property\setback-rule.ts` | **EXISTS** (contract + engine instance union) |
| 5 | Roads / frontage | `road-node` | `P:\hauska-atom-contract\src\property\road-node.ts`; engine `packages\atoms\src\road-instances.ts:106` | **EXISTS** |
| 6 | Flood / terrain (Rail D) | `parcel-terrain-model` covers terrain export ONLY. **No flood atom** — FEMA NFHL, SSURGO, 3DEP are adapters producing no atom | `src\property\parcel-terrain-model.ts:198`; adapters at `P:\hauska-engine\packages\adapters\src\federal\fema-nfhl.ts`, `usda-ssurgo.ts`, `usgs-ned.ts` | **PARTIAL** — terrain yes, flood MISSING |
| 7 | Buildable envelope | `buildable-envelope` | `src\property\buildable-envelope.ts:30` | **EXISTS** |
| 8 | Land use | **MISSING** — no land-use atom. Only live reference is `land_use_code` inside the EXTINGUISHED Cotality adapter | `P:\hauska-engine\packages\adapters\src\national\cotality.ts:143` | **MISSING** (and the only carrier is a decommissioned source) |
| 9 | Building footprints | `building-footprint` | `src\property\building-footprint.ts:35` (contract v1.12.0) | **CONTRACT-ONLY** — zero engine references |
| 10 | Utility easements | `utility-easement` | `src\property\utility-easement.ts:38` (contract v1.12.0) | **CONTRACT-ONLY** — zero engine references |
| 11 | Owner facet | **MISSING** — no owner atom. `actor-record` is a licensing/actor type, not a parcel owner facet | `src\actor-record.ts:64` (wrong semantics) | **MISSING** |
| 12 | RRC wells / pipelines | `well`, `wellbore`, `completion`, `zone`, `pad`, `rrc-lease`, `production-timeseries`, `tract`, `mineral-lease`, `ownership-interest`, `revenue-allocation-unit`, `equipment-state` | `src\og\*.ts` (12 types, ADR-025) | **EXISTS** — but keyed on API-14, not parcel; **pipelines MISSING** |
| 13 | MUD / special districts | **MISSING** — no atom family | nowhere | **MISSING** |

### Rails with NO atom family defined anywhere

**Rail 1 parcel geometry, Rail 2 CAD attributes, Rail 3 join quality, Rail 8 land use, Rail 11 owner facet, Rail 13 MUD/special districts.** Six of thirteen. Rail 6 is half-missing (flood). Rail 12's pipeline half is missing.

Rail 1 is the most consequential. `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:58` makes parcel geometry the rail that everything else joins to and the one to finish first statewide — and it has no atom. Verbatim evidence that `parcel-record` does not exist:

```
$ grep -rn "parcel-record" P:\hauska-engine --include=*.ts
packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts:567:    jurisdictionKey: "bastrop-per-parcel-record",
packages/adapters/src/local/setbacks/bastrop-setback-currency.ts:9: "bastrop-per-parcel-record-layer-23";
[... 8 more, ALL adapter filename/jurisdictionKey strings, zero entityType]
```

`ADR-029:31` and `:94` both name `parcel-record` as an existing type with `geometry` = lot polygon, and build the footprint graph edge (`parcel-record ← improvement-on — building-footprint`) on it. **That type does not exist.** ADR-029's coverage-gap table (`:29-37`) asserts a type inventory that the contract does not contain.

### Rails 9 and 10: shipped in contract, absent from engine

The contract defines both at v1.12.0 (`CHANGELOG.md:5-24`). The engine has zero references:

```
$ grep -rl "building-footprint" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
$ grep -rl "utility-easement" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

`ADR-029:50` requires registration in `hauska-engine/packages/atoms/`. Not done. Compounding: **v1.12.0 is not published** (see section 7), so the engine could not consume these shapes today even if registration were written.

## 2. Orphan atoms — contract families mapping to no rail

Contract types with no rail in the thirteen:

| Atom family | Types | Rail? | Assessment |
|---|---|---|---|
| Encumbrances (ADR-020/021) | `recorded-instrument`, `restriction-clause`, `restriction-corpus`, `administrative-rule`, `constraint-resolution` | none | **Rail list incomplete.** Title-track encumbrances are a real property-intelligence layer, deliberately built (ADR-020/021 accepted), engine-registered. Rail 10 covers only the public GIS easement half; ADR-029:147 explicitly says ADR-020 remains authoritative for the private title track — which the thirteen-rail shape does not name. |
| Workspace | `property-workspace`, `brief-run`, `workspace-attachment`, `workspace-share-edge` | none | **Correctly orphan.** Tenant workspace substrate, not county data. Should never be a county rail. |
| Code corpus (engine) | `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus` | partially Rail 4 | **Rail 4 under-specified.** Rail 4 is stated as "zoning + setback rule"; the six code-corpus types are what make Rail A real (`OPS-1:22`), and the roster tracks `code_text` as its own per-county block separate from `zoning_regime`. Rail 4 conflates two roster blocks. |
| Cortex L-surface (engine) | `response-task`, `sheet-content-extraction`, `attached-document`, `deliverable-letter`, `deliverable-letter-render`, `detail-callout-spec`, `product-spec-reference` | none | **Correctly orphan.** Product-surface atoms. |
| Core / cross-cutting | `actor-record`, `obligation` | none | **Correctly orphan** (substrate primitives). |
| O&G beyond wells | `mineral-lease`, `ownership-interest`, `revenue-allocation-unit`, `equipment-state`, `tract`, `rrc-lease` | Rail 12 names only "wells / pipelines" | **Rail 12 under-specified.** Twelve O&G types exist; the rail names two things, one of which (pipelines) has no atom. |

Nothing in the contract is dead. Two families (encumbrances, code corpus) argue the **rail list is incomplete**, not that the atoms are surplus.

## 3. Source coherence

### Declared-source table per rail

| Rail | Declared source | Where declared | Atom shape? | Verdict |
|---|---|---|---|---|
| 1 Geometry | TxGIO StratMap bulk zip per FIPS; county ArcGIS override | `OPS-1:27-34`; roster `geometry` block, 254/254 `rail: "C"` | no | **Source without atom** |
| 2 CAD | County CAD (BIS/PACS/Orion/HCAD) | `OPS-1:23`, `:67-90` service table; roster `cadastral` block | no | **Source without atom** |
| 3 Join quality | derived; `owner_match_gate_required` ALWAYS | `OPS-1:45`; roster `join_quality`, 254/254 `true` | no | **Source without atom** |
| 4 Zoning + setback | municipal code per city; unincorporated unzoned | `OPS-1:22`; roster `zoning_regime` + `code_text` | yes | coherent |
| 5 Roads | OSM Overpass + county roadway layers | decision `:22`; `_inbox/2026-07-21_overpass_road_data_spec.md` | yes | **Atom without a registry source row** — roads are not a roster block or an OPS-1 rail |
| 6 Flood/terrain | FEMA NFHL, USGS 3DEP, USDA SSURGO | `OPS-1:25` (Rail D) | terrain only | **Source without atom for the flood half** |
| 7 Envelope | derived from 1+4+5 | decision `:24` | yes | coherent (but depends on rail 1, which has no atom) |
| 8 Land use | CAD roll code | decision `:26` | no | **Source without atom.** Not a roster block. Only live carrier is Cotality. |
| 9 Footprints | ML-derived default statewide | `OPS-1:97`; roster `rails.footprint_tier` 254/254 `ml-derived` | contract only | vocabulary matches (see below) |
| 10 Easements | county honest-absence; CAD exception | `OPS-1:97`; roster `rails.easement_tier` | contract only | **vocabulary MISMATCH** (see below) |
| 11 Owner facet | CAD `owner_name` + mailing, authenticated BFF | `_inbox/2026-08-08_lightbox_gap_closure_spec.md:51` | no | **Source without atom** |
| 12 RRC | RRC public GIS | decision `:29`; engine adapters `rrc-w1`, `rrc-h10`, `rrc-pdq` | yes (wells) | coherent for wells; **pipelines have neither** |
| 13 MUD | TX Comptroller special-district registry | decision `:30` | no | **Source without atom** |

Seven rails have a declared source and no atom shape. One rail (5, roads) has an atom shape and no registry source row.

### ADR-029 vocabulary vs roster vocabulary — MISMATCH on easements

`rails.footprint_tier` — **MATCHES.** Roster carries `ml-derived` on all 254 counties. Contract `BUILDING_FOOTPRINT_SOURCE_TIER_SCHEMA` (`src\property\common.ts:194-201`) is `["cad-authoritative", "ml-derived", "absent"]`. `ml-derived` is a member.

`rails.easement_tier` — **DOES NOT MATCH.** Roster tally across 254 counties:

```
absent               253
cad-easement-rest      1   (48309 McLennan)
```

Contract `UTILITY_EASEMENT_SOURCE_TIER_SCHEMA` (`src\property\common.ts:214-225`):

```
["plat-gis-authoritative", "county-gis", "record-extracted", "absent"]
```

`cad-easement-rest` **is not a member of the enum**. The one county in Texas with a non-absent easement source carries a tier string the contract will reject at validation. `UTILITY_EASEMENT_SCHEMA` uses `z.enum`, so this is a hard parse failure, not a warning. The McLennan row (`_catalog/texas_roster_v1.json`, FIPS 48309) also carries an `easement_url` key that no other row has and that the contract has no field for.

Roster easement note says "McLennan exception at 48309" but OPS-1:97 says the exception is "McLennan CAD layers 9-10 **and City of Bastrop municipal easements**." The roster's 1,223 city rows all carry `rails.easement_tier: "absent"` with `verification: "unverified"` — the Bastrop city easement exception OPS-1 declares is not represented in the roster.

## 4. AccessPolicy coherence

### Live enum, verbatim

`P:\hauska-atom-contract\src\registration.ts:56-61`:

```typescript
export type AccessPolicy =
  | "public-free"
  | "public-paid"
  | "platform-internal"
  | "tenant-private"
  | "tenant-shared";
```

Runtime schema, `src\conformance\common.ts:52-58`:

```typescript
export const ACCESS_POLICY_SCHEMA = z.enum([
  "public-free",
  "public-paid",
  "platform-internal",
  "tenant-private",
  "tenant-shared",
]);
```

**Five values, type and runtime agreeing.**

### The "four-value union" claim is wrong about ADR-017, not about the contract

The audit brief and `CLAUDE.md` both state ADR-017 documents a four-value union. **It does not.** `80_adrs\adr_017_atom_access_control.md:36-40` lists all five:

```
36:- `public-free` — Layer 1 public atoms readable by anyone
37:- `public-paid` — Layer 2 atoms gated by paid tier
38:- `tenant-private` — atoms scoped to a single tenant
39:- `tenant-shared` — atoms shared between explicit tenants with a shared-with list
40:- `platform-internal` — atoms readable only by Empressa actors
```

The four-value framing traces to the Sync A record in `CLAUDE.md` ("ADR-017 accessPolicy four-value union reused (Path R)"), which is a stale point-in-time note about the 1.1.0 bump. `CLAUDE.md` itself corrects this later in the 2026-06-06 recon paragraph ("a five-value union … the fifth added in 1.2.0"). The ADR was never four-value. **Contract, ADR-017, and `01a_atom_conventions.md:15` ("the five-value accessPolicy") all agree at five.** The only divergent text is the Sync A line in `CLAUDE.md`.

### Per-rail accessPolicy assignment

| Rail | accessPolicy assigned? | Where |
|---|---|---|
| 1 Geometry | **no atom, no policy** | — |
| 2 CAD | **no atom, no policy** | — |
| 3 Join quality | **no atom, no policy** | — |
| 4 Zoning + setback | yes, field required; module default `public-free` | `src\property\common.ts:39` `PROPERTY_DEFAULT_ACCESS_POLICY` |
| 5 Roads | yes, field required; same property default | `src\property\road-node.ts` |
| 6 Terrain | yes — explicit `public-paid` | `src\property\parcel-terrain-model.ts:34` `TERRAIN_DEFAULT_ACCESS_POLICY` |
| 6 Flood | **no atom, no policy** | — |
| 7 Envelope | yes, field required | `src\property\buildable-envelope.ts:37` |
| 8 Land use | **no atom, no policy** | — |
| 9 Footprints | yes, field required; ml-derived ruled `public-free` | `CHANGELOG.md:13-15` |
| 10 Easements | yes, field required; uniform `public-free` | `ADR-029:115`; `CHANGELOG.md:21-24` |
| 11 Owner facet | **no atom — policy ruled but NOT expressible today** | `_inbox\2026-08-08_lightbox_gap_closure_spec.md:57` |
| 12 RRC | yes — per-type map | `src\og\common.ts:304-318` `OG_DEFAULT_ACCESS_POLICY` |
| 13 MUD | **no atom, no policy** | — |

Six of thirteen rails have no accessPolicy because they have no atom.

### Owner facet: expressible in principle, not expressed in fact

`_inbox\2026-08-08_lightbox_gap_closure_spec.md:57` rules: *"Owner is an atom-level accessPolicy decision, not a UI conditional. Per ADR-017 the five-value union is the paywall mechanism… Owner facet gets `accessPolicy: public-paid`."*

`public-paid` is a valid enum member, so the value is expressible. But **there is no owner atom to carry it.** The spec itself concedes the dependency at `:59`: *"it means the owner facet is correctly gated the moment the facets are atomized onto the contract (ledger row 10, currently 20 percent)."* Row 10 of `75j_property_explorer_destination_ledger.md` reads: *"Facets atom-SHAPED but not on the atom contract (arch gap 1); not served via MCP"* at 20 percent. Row 13 (auth/paywall) is also 20 percent, row 16 (architecture reconciled) 35 percent.

So the ruling is coherent with the contract's capabilities and incoherent with its current contents. Today owner gating would have to be a UI/BFF conditional — precisely what the ruling forbids.

### ADR-029 vs the 2026-08-05 ruling: contradiction, resolved but not corrected in the ADR

`ADR-029:73` states footprint `accessPolicy` is *"`public-paid` for national ML fallback (Microsoft/Overture/USA Structures) per tier model."* `_decisions\2026-08-05_adr029_rails_rulings.md:17` overrules: *"ML FALLBACK accessPolicy — PUBLIC-FREE… Charging for open data as public-paid would corrupt the tier doctrine."* The contract implemented the decision (`CHANGELOG.md:13-15`). **ADR-029 line 73 still carries the superseded value** and its status header (`:15`) says the rulings were applied. The ADR body was not updated.

## 5. Three-state expressibility (satisfied-present / satisfied-absent / not-yet)

**Absence is first-class in the contract for the property family. `satisfied-absent` is representable. `not-yet` is not — there is no atom-layer state for unacquired.**

### Absence is a real contract variant, not a workaround

Every property rail atom carries a typed absence discriminant with mutual-exclusion enforcement in `superRefine`:

| Atom | Absence field | Kind literal | Enforcement |
|---|---|---|---|
| `zoning-fact` | `absence?: ZoningAbsence` | `"no-zoning-stamp"` | `src\property\zoning-fact.ts:70-83` — district XOR absence, one required |
| `setback-rule` | `absence?: SetbackAbsence` | `"setback-fallback"` | `src\property\setback-rule.ts:92-96` — `matchBasis: "fallback"` REQUIRES absence |
| `building-footprint` | `absence?` + `verifiedAbsence?` | `"no-footprint-feature"` | `src\property\building-footprint.ts:91-125` |
| `utility-easement` | `absence?` + `verifiedAbsence?` | `"no-easement-feature"` | `src\property\utility-easement.ts` |

The hybrid ruled at `_decisions\2026-08-05_adr029_rails_rulings.md:15` is implemented as two distinct mechanisms, which is exactly the distinction the operator's three-state ruling needs:

- **County-level established absence** — `SITE_LAYER_VERIFIED_ABSENCE_SCHEMA` (`src\property\common.ts:152-157`), `{ evaluated: true, provenanceScope: string[] }` with `.min(1)` on the scope array, anchored on `countyCoverageParcelNodeId(fips)` → `{fips}:_county_coverage` (`:164-168`). This is `satisfied-absent` with evidence of what was checked.
- **Per-parcel no-feature** — `absence: { kind, reason }` when a source exists but yields nothing for that parcel.

`sourceTier: "absent"` is a first-class enum member on both site-layer atoms, and `building-footprint.ts:110-117` makes `verifiedAbsence` MANDATORY when `sourceTier === "absent"`. That is a fail-closed absence gate, not a convention.

### R27 is a separate, weaker mechanism — and it IS a workaround

The queue row is accurate. `90_operations\QUEUE_parked_work_index.md:129`:

```
| Atom-contract first-class absence variants ADR (setback-rule/buildable-envelope absence; R27 precedent used instead) | 2026-08-03 county-onboarding notes | ADR slot |
```

`buildable-envelope` has **no** `absence` field in the contract. Envelope absence is carried by engine-extension fields bolted onto the instance at `P:\hauska-engine\packages\engine-core\src\depth-warm\honest-decline-promote.ts:30-35`:

```typescript
export type HonestVerifyDeclineAtom = BuildableEnvelopeAtomInstance & {
  recipeVersion?: string;
  warmVerifyDecline?: string;
  warmVerifyDeclineCode?: string;
};
```

These three fields exist only in the engine. The contract schema does not know them; they will not survive `.atompack` export, MCP serve, or any consumer validating against `BUILDABLE_ENVELOPE_SCHEMA`. The comment at `:39-45` confirms the intent is shape-uniformity across producers, which is good engineering **inside the engine** and is exactly the parallel-implementation pattern ledger row 16 exists to prevent. `packages\engine-core\src\property-reasoning\cascade-unzoned-envelope-decline.ts:20-25` reuses the same off-contract shape for the unzoned-county cascade.

So: **absence is a real contract variant for zoning-fact, setback-rule, building-footprint, utility-easement; and a workaround for buildable-envelope.** Since `buildable-envelope` is rail 7 and is the product's headline output, the workaround sits on the most visible rail.

### `not-yet` has no atom representation at all

Nothing in the contract distinguishes "we have not acquired this" from "no atom exists yet." The absence of an atom is the only signal, and it is indistinguishable from an ingest that has not run, a failed write, or a rail with no atom family. The manifest layer will have to carry `not-yet` itself; the atom layer cannot supply it. That is defensible design (an atom asserting its own non-existence is odd), but it means the three-state ruling **cannot be verified from the atom store** — Command Center must trust a separate manifest, and nothing reconciles the two.

## 6. Node / entity key coherence

**There is no single canonical parcel identity key. Four key systems coexist, and the contract's validator is not enforced at the engine boundary.**

### The four keys

| Key | Form | Defined | Used by |
|---|---|---|---|
| `parcelNodeId` | `{county_fips}:{prop_id}` | `src\property\common.ts:31` `PARCEL_NODE_ID_PATTERN = /^\d{5}:[A-Za-z0-9._-]+$/` | every property atom; `property-boundary-edge` |
| `roadNodeId` | `{county_fips}:road:{osm_way_id}` | `src\property\common.ts:34` `ROAD_NODE_ID_PATTERN = /^\d{5}:road:\d+$/` | `road-node` |
| API-14 | 14-digit API number | `src\temporal\node-id.ts` `API_14_PATTERN` | every O&G atom (`well.wellDid = well_<api14>`) |
| roster `join_key` | `prop_id` (246 counties) \| `geo_id_or_address_crosswalk` (8 counties) | `_catalog/texas_roster_v1.json` `join_quality.join_key`; `OPS-1:31,45` | ingest/join layer, not atoms |

Rails do key differently. Rails 4/6/7/9/10 key on `parcelNodeId`. Rail 5 keys on `roadNodeId`. Rail 12 keys on API-14. There is **no edge type in the contract linking a well to a parcel** — the O&G family and the property family are two disconnected graphs sharing only a county FIPS prefix. Rail 12 being in the county shape therefore has no join path to the other twelve.

### The crosswalk counties are a live key contradiction

`parcelNodeId` is defined as `{county_fips}:{prop_id}`. Eight counties are declared unable to join on `prop_id`:

```
join_quality.join_key tally (254 rows):
  prop_id                       246
  geo_id_or_address_crosswalk     8
```

Per `OPS-1:31` those eight are Travis (bad rate 0.51), Robertson (1.00), Oldham (0.9995), Roberts (0.9992), Motley (0.53), Floyd (0.46), Dimmit (0.39), Lipscomb (0.38). Robertson County's `prop_id` is bad **100 percent of the time**. Yet the contract's only parcel key is `{fips}:{prop_id}`, and the pattern accepts any `[A-Za-z0-9._-]+` in the second position — so a crosswalked `geo_id` will pass the regex silently while meaning something structurally different from every other county's key. Nothing in the atom records WHICH key kind the second token is. Travis is the third-largest county in the roster and is in this bucket.

### Validation gap — `48021:0`

`90_operations\QUEUE_parked_work_index.md:111`:

```
| `48021:0` appears as a roster key in the `superseded-prop-id` decline bucket — malformed parcel node id | 770 probe | roster hygiene |
```

`48021:0` **passes** `PARCEL_NODE_ID_PATTERN` — `0` is a legal `[A-Za-z0-9._-]+` token. The pattern cannot catch it. Worse, the pattern is never run:

```
$ grep -rn "PARCEL_NODE_ID_PATTERN" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

The engine imports **types only** from `@empressaio/atom-contract/property` (`packages\atoms\src\property-instances.ts:19,35,51` — all `import type`), never the Zod schemas. Same for `ROAD_NODE_ID_PATTERN`, which the engine **re-declares locally** at `packages\atoms\src\road-instances.ts:135` rather than importing:

```typescript
export const ROAD_NODE_ID_PATTERN = /^\d{5}:road:\d+$/;
```

That is a duplicated constant that can drift from the contract silently. No contract Zod schema (`ZONING_FACT_SCHEMA`, `SETBACK_RULE_SCHEMA`, `BUILDABLE_ENVELOPE_SCHEMA`, `BUILDING_FOOTPRINT_SCHEMA`, `UTILITY_EASEMENT_SCHEMA`) is referenced anywhere in the engine. **The contract is a type-checking artifact at build time and enforces nothing at runtime on the write path.** `48021:0` reached production because nothing validated it, and a stricter pattern alone would not have caught it either.

Sole exception found: `packages\og-sources\src\adapters\rrc-w1\normalize.ts:10` imports `WELL_SCHEMA` as a value. The O&G lane validates; the property lane does not.

## 7. Versioning

| Location | Package name | Version | Evidence |
|---|---|---|---|
| npm `latest` | `@empressaio/atom-contract` | **1.11.0** (published 2026-07-25) | `npm view` below |
| Source working tree | `@empressaio/atom-contract` | **1.12.0** | `P:\hauska-atom-contract\package.json:3` |
| hauska-engine (8 packages + 1 service) | `@empressaio/atom-contract` | `^1.11.0` | `packages/{atoms,engine-core,og-sources,og-title,retrieval,storage,workspace}/package.json`, `services/retrieval-api/package.json` |
| hauska-engine pin shim | `@empressaio/atom-contract` | `^1.11.0` | `packages/atom-contract-pin/package.json:22` |
| legacy-design-tools (4 packages) | **`@hauska/atom-contract`** | **`file:../../vendor/hauska-atom-contract-1.6.0.tgz`** | `artifacts/api-server/package.json:19`; `lib/{engine-core,knowledge-atoms,portal-ui}/package.json:15,15,19` |
| legacy-design-tools (2 packages) | **`@hauska/atom-contract`** | **`^1.1.0`** | `lib/submission-classifier/package.json:15`; `scripts/package.json:32` |

npm verbatim:

```json
{
  "version": "1.11.0",
  "dist-tags": { "latest": "1.11.0" },
  "time": {
    "1.7.0":  "2026-07-07T13:03:15.994Z",
    "1.8.0":  "2026-07-23T20:00:09.016Z",
    "1.9.0":  "2026-07-23T20:41:45.477Z",
    "1.10.0": "2026-07-24T01:36:46.660Z",
    "1.11.0": "2026-07-25T22:02:40.655Z"
  }
}
```

```
$ npm view @hauska/atom-contract version
1.6.1
```

Three version divergences:

1. **v1.12.0 is unpublished.** The ADR-029 rails (`building-footprint`, `utility-easement`) exist only in the local working tree. Nothing can consume them. This fully explains why the engine has zero references to those types — it is a sequencing gap, not neglect. Note `CLAUDE.md` states "published through v1.7.0"; npm says 1.11.0. Both the CLAUDE.md figure and the audit brief's "~v1.7.0+" are stale.
2. **legacy-design-tools is six minors behind on the retired package name.** Four packages vendor a `hauska-atom-contract-1.6.0.tgz` tarball; two more request `@hauska/atom-contract@^1.1.0` from npm. `1.6.0` predates the entire property family — 1.8.0 introduced the property primitives, 1.9.0 ADR-028, 1.10.0 terrain, 1.11.0 road-node. **ldt cannot see zoning-fact, setback-rule, buildable-envelope, road-node, parcel-terrain-model, building-footprint, or utility-easement.** It is also on the branding-retired `@hauska/*` name, contradicting `packages\atom-contract-pin\package.json:6` ("Do not depend on legacy `@hauska/atom-contract`"). Whether `1.1.0` and `1.6.0` carry the five-value accessPolicy: 1.2.0 added `tenant-shared`, so the two packages pinned at `^1.1.0` would resolve to `1.6.1` under caret and get five values — but the four vendored tarball packages are frozen at exactly `1.6.0`, which does carry five values (post-1.2.0). No accessPolicy gap; the gap is the entire property family.
3. Everything in hauska-engine is consistent at `^1.11.0`, matching npm latest.

## DIVERGENCES FOUND — ranked by severity

**S1. The thirteen-rail shape has no counterpart in the atom layer.** Six rails (geometry, CAD attributes, join quality, land use, owner facet, MUD) have no atom family; flood and pipelines are missing halves of two more. The rail list was authored in `_inbox\2026-08-08_COUNTY_SHAPE_decision_sheet.md` against the roster and OPS-1, neither of which references the contract. Nothing reconciles the two. A completeness percentage computed against thirteen rails cannot be computed from the atom store.

**S2. Rail 1, parcel geometry — the spine — has no atom.** `_decisions\2026-08-08_...:58` makes it the first rail to finish statewide and the rail every other joins to. There is no `parcel-record`, no geometry atom, and `property-boundary-edge` (engine-only, not in the contract) carries lot-line edges, not the parcel. Every property atom keys on `parcelNodeId`, a string pointing at a node with no atom behind it. ADR-029 builds its graph on `parcel-record` (`:31`, `:94`) — a type that does not exist.

**S3. The contract enforces nothing at runtime on the property write path.** No property Zod schema and no `PARCEL_NODE_ID_PATTERN` reference exists anywhere in hauska-engine; only `import type`. `ROAD_NODE_ID_PATTERN` is re-declared locally rather than imported. This is the root cause behind `48021:0` and it means every contract invariant on the property family (absence mutual-exclusion, `sourceTier: absent` requiring `verifiedAbsence`, `matchBasis: fallback` requiring absence) is unenforced in production. The O&G lane does validate (`WELL_SCHEMA` imported as a value), proving the pattern is available and simply not applied.

**S4. `buildable-envelope` absence is off-contract engine extension fields.** `warmVerifyDecline` / `warmVerifyDeclineCode` / `recipeVersion` exist only in hauska-engine and will not survive export, MCP serve, or contract validation. This is rail 7, the headline product output, and the operator's `satisfied-absent` state on that rail is carried by a workaround. Already queued (`QUEUE:129`) and correctly characterized there.

**S5. Roster `easement_tier: "cad-easement-rest"` is not in the contract enum.** One county (48309 McLennan), one value, but it is the only non-`absent` easement row in Texas and it will fail `UTILITY_EASEMENT_SCHEMA` parse. Roster also carries `easement_url`, a key with no contract field. Fix is one word in either the roster or the enum; decide which is canonical.

**S6. v1.12.0 unpublished blocks rails 9 and 10 entirely.** `building-footprint` and `utility-easement` are complete in source with fixtures and tests, absent from npm, and therefore absent from the engine. Two of thirteen rails are one publish away from existing.

**S7. legacy-design-tools is six minors behind on the retired package name.** Four packages vendor `@hauska/atom-contract@1.6.0` as a tarball, two request `^1.1.0`. No property atom of any kind is visible to ldt. Also violates the engine's own stated branding rule.

**S8. Crosswalk counties break the `parcelNodeId` definition.** Eight counties (incl. Travis, and Robertson at a 1.00 prop_id bad rate) join on `geo_id_or_address_crosswalk`, but `parcelNodeId` is defined as `{fips}:{prop_id}` and the regex accepts the substitution silently. No field records which key kind the second token is.

**S9. Rail 12 (RRC) has no join to the property graph.** O&G atoms key on API-14; property atoms key on `parcelNodeId`; no contract edge connects them. A rail inside the county shape that cannot be joined to the parcel it is supposed to describe.

Two lower-severity documentation divergences, recorded but not ranked: `ADR-029:73` still states ML footprints are `public-paid` after the 2026-08-05 ruling set them `public-free` (contract implemented the ruling; the ADR body was not updated); and `_land_records\source_rail_registry.md:26-32` defines Rails A/B/C/D differently from `OPS-1:22-25` (there, Rail A is clerk OPR and Rail D is adjacent-state RRC/SOS/Comptroller; in OPS-1, Rail A is code/zoning and Rail D is flood/terrain). The thirteen-rail decision uses the OPS-1 sense. Two docs, same letters, different meanings.

Also noted, outside the audit scope but flagged per standing decision: `land_use_code` in the engine appears only inside `packages\adapters\src\national\cotality.ts` and the adapter is still referenced from `packages\adapters\src\registry.ts`. Cotality is EXTINGUISHED. Rail 8's only live carrier is a decommissioned source.

## WHAT I COULD NOT DETERMINE

- **Live deployed state.** All engine findings are from the `P:\hauska-engine` working clone, not from deployed Cloud Run revisions or the live Neon atom store. Whether the deployed engine differs from this clone was not checked.
- **Whether any atoms of the property rails actually exist in the production store**, and at what counts per county. Contract-and-registry presence is not corpus presence. No DB was read (read-only constraint).
- **The MCP gate's exposure of these rails.** `hauska-mcp-server` was not in scope and was not read; whether the 63 tools expose footprint/easement/owner is unverified.
- **Threshold values for ruling 3.** The decision explicitly leaves them unset (`:54`); nothing in the contract or roster carries a coverage threshold field, so `SATISFIED` vs `PARTIAL` has no data home today. Whether one is planned was not established.
- **The manifest schema.** The decision names a manifest carrying three states (`:38-42`); no manifest file was located in this audit. If it exists it may already reconcile some of S1 — I could not confirm either way.
- **Whether the 8 crosswalk counties have any atoms written**, and if so what their `parcelNodeId` second token actually contains.
- **Pipeline data.** Rail 12 names "wells and pipelines"; RRC pipeline GIS was not investigated as a source and no pipeline atom exists. Whether pipelines were intended as a separate acquisition was not established.
- **Whether `48021:0` originates from ingest, from the decline path, or from roster construction.** Only that it exists as a decline-bucket key and that no validator would have caught it.
