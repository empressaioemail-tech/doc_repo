---
id: 2026-08-26_factory_program_design
title: The Factory — end-to-end design under the instrument contract (four layers, five stages, staging, console, states)
date: 2026-08-26
last_updated: 2026-08-26
status: draft
applies_to: hauska-factory, hauska-engine, legacy-design-tools, hauska-map, hauska-atom-contract
plan_row: F-00 through F-19 (OPS-19)
owner: property seat (stations, console); substrate seat (contract types); planner grades; operator rules
snapshot: P:/doc_repo main 9753b83 (dirty) · engine cfa18bc · LDT origin/main 46e1a5a1 · @empressaio/atom-contract 1.22.0 read from the tarball · integration seat
model_law:
  - 19_the_instrument_contract.md (what a record must satisfy)
  - _blueprint/10_model.md (where nodes, atoms, edges, identity, lineage, time, absence, precedence, access live; V1 to V15)
  - _blueprint/20_pipeline.md and 51_ingestion_pipeline_reference.md (four layers, five stages, lifecycle, remediation order)
  - _blueprint/40_rule_register.md (BP rules with executor, trigger, failure, bypass)
  - _blueprint/50_grading.md (grade by rule id, never by percentage)
  - 24_instrument_conformance_program.md (Tracks 1 to 5)
  - _decisions/2026-08-22_atom_layering_target_state.md and 80_adrs/adr_030 (adopted target state)
  - _inbox/2026-08-23_p66_entity_classification_plan.json (provenance class and subject kind per entity type)
  - the published package dist/*.d.ts is the tiebreaker where documents disagree
related:
  - _decisions/2026-08-26_factory_program_and_hold_lifts.md
  - _decisions/2026-08-26_factory_model_law_and_option_a.md
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-26_cloud_loader_design.md
  - _inbox/2026-08-26_p81-review_close.json
  - portfolio_thesis/01_the_layer_and_the_three_doors.md
---

# The Factory

One machine that takes a state from "which state next?" to smart sites visible on production Smart Site, built as the executor column of the rule register: every `BP-` rule that today reads UNENFORCED, STARVED or DORMANT gets a stage that runs it, a trigger, a failure, and a named bypass. It absorbs the three factories as sources and recipes flowing through one write path, adds the stations nobody owned (publish, verify), and adds discovery for new states.

The operator rulings that fix the frame are `_decisions/2026-08-26_factory_program_and_hold_lifts.md` and `_decisions/2026-08-26_factory_model_law_and_option_a.md`. The model the Factory produces is not this document's to define; it is the model law listed in the frontmatter, and where this document and that law disagree, the law wins and this document is the defect.

## 1. What the Factory produces

A **smart site** (`portfolio_thesis/01`): a node with a minted opaque id, alias atoms for every natural key, fact atoms with class-required provenance and a confidence basis, edges carrying their own provenance, and layers that read `populated`, `contested`, or `absent` with a typed verdict. Assembled per request under a lens. Never a row with a borrowed key and a bare value.

What that means per family, from the P-66 rulings: parcel-node, cad-parcel-roll, land-use-fact, owner-fact, well-fact, zoning-fact, and the code corpus types are `Record`, extensional. flood-hazard-fact, special-district-fact, rail-corridor-fact, rrc-pipeline-fact and buildable-envelope are `Derivation`; the first four are **intensional**: one selector atom per zone, district or corridor, materialised per node as Derivation rows carrying `derivesFrom`, never one Record per parcel. The six types the plan JSON still lists as open were ruled by the operator on 2026-08-23 (`_decisions/2026-08-23_p66_entity_type_operator_rulings.md`; registry `_catalog/instrument_entity_type_classifications.json` is `active`, 21 of 21): `property-boundary-edge` Derivation with `chainAnchoring: backfill` (a same-day revert from contemporaneous), `setback-rule` **Record**, `parcel-terrain-model` Observation, `building-footprint` Record, `road-node` split by adapter (county-authoritative Record, OSM-assumed Derivation), `code-amendment` backfill. The writers do not yet match two of them: `emit-buildable-envelope.ts` stamps setback-rule `reasoningKind: "derived"` and `boundary-primitive/compute.ts` stamps boundary-edge `reasoningKind: "observed"`; reconciling writer output to the registry is P-67 work on the Factory's stage A and E.

## 2. The shape

```
 SMART SITE FACTORY  (hauska-map apps/factory, one Vercel project, one base URL)
   /            console: states, county manifest, city manifest, runs, queues, defects, holds, drift, gates, lanes, cost, walk
   /site        staging Smart Site (staging PE build, canary cortex revision, staging tiles)
                       │ reads and writes machine-owned tables only, through the control API
                       ▼
 FACTORY CONTROL PLANE  (hauska-factory, Cloud Run service + Cloud Run Jobs + Cloud Scheduler, us-east4)
   source manifests · work list (derived) · scoped leases · run ledger with termination records · holds · defects
   drift · adjudication queue · recipes · lane requests · approvals
       │
 L1 ACQUIRE     manifest per source; fetch bytes + checksum + fetch time; vintage watchers            BP-LAND-01, BP-MANIFEST-01
 L2 LAND        immutable, append-only, per retention class; the replay substrate; only L1 writes it
 L3 CANONICALISE (five ordered stages; each a job with a run record and a termination record)         BP-FACTORY-01
    A adapter      landed bytes -> six-field candidates (claim, provenance, confidence, citation,
                   time, access); no canonical binding                                              BP-ADAPT-01
    B resolution   mint node or bind alias: T1 exact alias, T2 scored, T3 provisional + queue;
                   explicit node type; one resolution atom per decision; SPLIT_FROM / MERGED_INTO   BP-KEY-01, BP-PARCEL-KEY-01,
                                                                                                    BP-RESOLVE-01, BP-DID-01
    C reconcile    keep both, CONFLICT edge, or SUPERSEDED_BY; never overwrite                       BP-RECON-01
    D promote      provisional -> resolved through adjudication; queue depth measured               BP-PROMOTE-01
    E graph write  atom row + applies-to / subject-to / derivesFrom edges; intensional families as
                   selector atom + materialised Derivation rows; verified-absence pair;
                   write boundary refuses bare keys and sentinels                                   BP-WRITE-01, BP-EDGE-01,
                                                                                                    BP-KEY-SENTINEL-01, BP-ABSENCE-01
 L4 SERVE       views only; facet bakes, tiles manifest, cortex canary, PE; target staging then
                production; repoint on retirement; never default access                            BP-SERVE-01, BP-SERVE-02,
                                                                                                    BP-ACCESS-01, BP-ADDRESS-01
 VERIFY         walk on the target; ledger indicators derived and varying; grade by rule id         BP-LEDGER-01, BP-MEANING-01,
                                                                                                    BP-VERIFY-01, 50_grading
       │
 FACTORY STORE (new Neon project)                 SERVING STORES (published targets; never read the Factory store)
   L2 landing per state + retention class            hauska_mcp: atoms, atom_links           (Hauska substrate)
   candidates, resolution atoms, adjudication queue  neondb: serving tables, place_layer_snapshots, manifests (published copy)
   run ledger, leases, holds, defects, drift         GCS: parcels PMTiles per environment; cortex-api; smartsite.cloud
   county manifest, city manifest (authoritative)    staging branches of the two Neon databases + canary cortex + staging tiles
   source manifests, recipes, findings, approvals
```

Three rules make it one machine:

1. **Nothing reaches a serving store except through L4 publish**, and only reconciled atoms enter the served graph, only through views (51 §5). Serving never reads landing and never transforms.
2. **Every stage is a run.** A run has an id, a scope, an image digest, a source vintage, a target, counts in and out, a verify result, cost, a phase, and a termination record (max duration, success exit, failure exit, lease release). Refusals are runs. If the record cannot be written, the step does not start.
3. **Staging first, identical job second.** A production publish with no passed staging sibling refuses.

Three rules cross all four layers (51 §1): provenance travels with every record at every layer; provenance is a reference, never a copy of mutable state; each layer knows only the contract of the layer below it.

## 3. The layers and stages

### L1 Acquire

Every source is registered by a **manifest entry** (origin, refresh cadence, authority level, license terms, retention class) before it is fetched; a fetch with no manifest refuses. Acquisition fetches bytes and emits bytes plus source id, fetch time and checksum. No parsing, no filtering, no normalisation. Vintage watchers fingerprint publishers on a schedule and raise drift events. Factory 1.5's fetchers become L1 jobs; their parsers move to stage A.

### L2 Land

Immutable raw store per retention class. Nothing mutates a landed record. Landing is the replay substrate: when stage logic is wrong it is fixed and replayed from landing, never repaired downstream. Sources whose license prohibits landing declare non-replayable canonicalisation in their manifest and carry the fallback mechanism there. Today's `txgio_parcel`, `cad_property`, NFHL, district, RRC, footprint and boundary tables are adopted into L2 by import with their vintage, source id and adapter version; where those are unknown the row says unknown, never a default.

### L3 Canonicalise

**Stage A, adapter.** Registered with source identity, producible node types, native identifiers and which are authoritative, default confidence with its basis. Reads landed bytes, emits candidates in the six-field shape. Does not write the graph, resolve, dedupe, infer edges or decide precedence. Today's county writers are split: the plan half becomes an adapter; the write half is stage E. Factory 2's zoning stamp, setback tables and envelope derivations are adapters with a human gate at stage D. State nuance lives here and only here; everything after stage A is shared machinery.

**Stage B, resolution.** The canonical key is minted, never borrowed. Tier 1 exact match on an authoritative alias; tier 2 scored comparison over normalised attributes (address plus centroid containment); tier 3 provisional node plus adjudication queue. Node type assigned explicitly from the adapter's declared set. Every decision stored as a resolution atom (candidate, node, method, score, logic version, date). Splits and merges recorded as `SPLIT_FROM` and `MERGED_INTO` edges; a node is never destructively rewritten. Source keys become alias atoms with validity eras (`identity.alias`, doc 19). This is the one shared resolution stage that 51 §remediation step 5 asks to be extracted from the three factories.

**Stage C, reconciliation.** A resolved candidate meets the atoms on its node: same claim from higher authority keeps both with confidence updated; contradiction emits a CONFLICT edge, never overwrites; newer version emits SUPERSEDED_BY and closes the prior window. Two authoritative stores disagreeing on one parcel fact emit conflict (V7), never a silent pick.

**Stage D, promotion.** Provisional nodes hold atoms and serve normally with the flag inherited; nothing merges into a confirmed node automatically. The gate has an owner, a queue depth, and a throughput expectation on the console; a provisional population that only grows is a failing gate. Factory 2's human gates (registry freeze, setback ratification, cert grade) are stage D approvals with the evidence package attached.

**Stage E, graph write.** Writes the atom row and its edges in one transaction: `applies-to` to the parcel node, `subject-to` for encumbrances, `derivesFrom` for Derivation rows. Intensional families write one selector atom per region and materialised Derivation rows whose ids are a pure function of (selector atom id, store-state version, method). Verified absence writes the `evaluated` plus `provenanceScope` pair, never a typed absence object alone. The write boundary refuses a node binding that is not a canonical id, a sentinel inside a key, and a `body.atomDid` in a different namespace from the column. Scoped lease v2 and the run ledger from the drain card apply here.

### L4 Serve

Read-only views over the reconciled graph. Facet bakes tier 1 and 2 into `place_layer_snapshots`, the statewide PMTiles bake as the fabric join proof (tile feature id equals parcel-node id equals CAD alias, and a tile with an id no node carries fails the bake), a `tiles.json` pointer per environment so tiles are not a code deploy, the cortex-api canary discipline, PE per target, freshness stamp per county per target. Retiring a fact store repoints every consumer first (V9). Access is never defaulted (V3). Situs strings that are punctuation only are refused at serve (V6).

Staging is faithful by construction: Neon branches of `neondb` and `hauska_mcp` reset from production before each staging publish; a canary-tagged cortex-api revision on staging secrets; a staging PE Vercel project at `/site`; staging tile path. The falsifier is the walk: a parcel that passes staging and fails production is a named defect class on the manifest.

### Verify and maintain

After every publish, walk N known parcels per county through the target site's real endpoints and assert their layers render with their verdicts; fail loud and block promotion. Grade every artifact by rule id per `50_grading.md`, never by percentage; if only presence checks pass the verdict is UNMEASURED. The county and city manifests read layer verdicts per node: a cell is satisfied when every node in scope has a `populated` or `not-applicable` layer, honest absence is `absent-verified` with its scope, `lookup-failed` and `quarantined` stay visible as their own states, and `hasWriter` and `atomFamilyState` are derived from the store and vary across cells or the ledger reports itself dead (V5). The defect register is the one list; V1 through V15 are its first defect classes for Texas.

## 4. The Factory store

New Neon project, same region as `hauska_mcp`. Direct host only; the pooler is refused. Heavy PostGIS plan phases run here, never on serving.

| Group | Tables | Note |
|---|---|---|
| L1 / L2 | `source_manifests`, landing tables per source per state with `vintage`, `source_id`, `checksum`, `fetched_at`, `retention_class`, `adapter_version` | Texas rows adopted by import; unknown provenance recorded as unknown |
| L3 | `candidates`, `resolution_atoms`, `adjudication_queue`, `conflicts` | Resolution decisions are atoms and are replayable |
| Control | `runs`, `run_events`, `termination_records`, `leases`, `holds`, `work_list_snapshots` | Routing pin imported once as `holds` rows, then retired by refuse |
| Ledgers | `county_manifest`, `county_rail`, `county_facet_coverage`, `city_manifest`, `city_rail`, `city_facet_coverage`, `freshness` | Authoritative here; one-way published copy to `neondb` for Command Center |
| Quality | `defects`, `defect_events`, `drift_events`, `verify_walks`, `walk_results`, `rule_grades` | Seeded from V1 to V15, the gap matrix M-rows, and the known defect list |
| States | `states`, `state_recipes`, `findings`, `adapter_specs`, `approvals`, `lane_requests` | Discovery and stage D gates |

Atoms in the Factory store and in the published store are immutable; re-acquire is supersession with an edge, never an update in place.

## 5. The console

`hauska-map/apps/factory`, its own Vercel project and base URL, `/site` rewriting to the staging PE deployment. Thin: every screen reads a control-plane endpoint; every action creates a run, an approval, a hold, or a lane request. It holds no state.

Screens: States; County manifest and City manifest (cells, click to the nodes behind a cell on the map, click a node to its layers and verdicts, `declaredLevel` and `verifiedLevel` per layer); Runs; Queues (provisional depth, adjudication throughput, pending scores, drift); Defects; Holds; Gates; Lanes; Walk; Cost.

Placement ruling: Smart Site Factory is the Factory's operator console; Command Center stays the spine console; PE stays the customer app.

## 6. Discovery for a new state

Input: a state name. Output: a findings record, a state recipe, and adapter specs awaiting approval. The probe set is fixed: federal layers declared reused after a reachability check; state-published parcels and boundaries probed by attribute `groupBy` on the county field and four-corner land-box queries, never by advertised extent; county-only fallthrough enumerated; every layer classified `federal`, `state-published`, or `absent-at-state-level` with the evidence quoted; `uniformProduct` measured. In v1 the console emits a compiled discovery dispatch with a findings schema, the lane returns `findings.json`, the console imports it. Automating the lane as a job comes after one state has gone through by hand.

## 7. Repositories and seats

| Repo | Holds | Seat |
|---|---|---|
| `hauska-factory` (new) | control plane, job harness, L1 manifests and fetchers, stage B resolution, stage C and D, stage E write boundary and graph writer, verify walker, tiles manifest, discovery probe set, Factory store schema | property |
| `hauska-atom-contract` | Track 2 types the stages need: branded `NodeId`, provenance-class union, `derivesFrom`, absence verdicts, supersession as edge, alias and lineage, selector algebra, two-field access; conformance fixtures and behavioural suite | substrate |
| `hauska-engine` | existing writers refactored into adapters (plan half) and stage E callers (write half); lease v2; depth runners as adapters | property |
| `legacy-design-tools` | cad-ingest parsers as adapters; scorers; facet bakes; PMTiles bake; cortex-api canary workflow | property |
| `hauska-map` | `apps/factory` console; PE tiles manifest; staging PE project | property |

## 8. Order of work, from 51 §remediation

1. Write-time binding validation on the existing path, with the link-batching fix (P-82-lite). Stops the orphan population growing while everything else is built. Option A: Bexar resumes on this path; no new county fills on the old shape after it.
2. Replay from landing, and idempotency proven before any backfill.
3. Track 2 types in the contract, sequenced so each lands before the stage that needs it.
4. Minted ids with aliases and lineage edges; the shared resolution stage.
5. Backfill from landing, statewide, one source at a time; intensional families demoted to selector atoms plus Derivation rows (T1.4); verdicts before data (T1.5); the unrecoverable declared (T1.7).
6. Conflict representation.
7. Serving contract enforcement: publish, staging, verify, and the manifests reading verdicts.

Texas cleanup runs inside step 5 on the new path. Discovery and Utah run after step 7 has proven one Texas source end to end.

## 9. Unknowns with their falsifiers

| Unknown | Falsifier |
|---|---|
| Round trip from `us-east4` to Neon `us-east-1` | First job execution records `rtt_ms`; prediction under 5 ms |
| Real-table write rate on the existing path after link batching | Drain card item 6; below 150 atoms/s opens stage-and-merge |
| Tier 2 resolution precision on Texas addresses and centroids | Adjudication sample graded by hand against known parcels; a queue that only grows fails |
| Selector materialisation cost at 13M parcels | First statewide flood demotion records wall time and row count against the 21.5M enumerated rows it replaces |
| Neon branch faithfulness for staging | Same county to both targets, identical walk results |
| Statewide PMTiles bake time | First Texas bake records wall time |
| Discovery findings sufficient to build an adapter | Utah: adapter built from `findings.json` without a second probe pass |

## 10. What is kept, adopted, retired

Kept and adopted by import as level-one instruments (identity and owner), upgraded only where the Factory writes the missing provenance and verdicts: every atom, edge, coverage row, snapshot, stamp, setback table and registry row that is correct today. P-69 declares what cannot be upgraded.

Kept as code: the atom contract and P-55 grammar as the alias grammar, the scorer registry and its rules, the writers' plan halves as adapters, the depth runners, the parsers, the PMTiles bake, the canary workflow.

Retired by refuse or by decline: laptop runners, `P:/tmp` evidence, detached heartbeats, the v1 lease, the routing pin file, queue JSONs, canvases as operating boards, Command Center's factory panels as the place the factory is managed, `neondb` as the factory's workbench, the compiled tile hash in PE, per-parcel enumeration of intensional families, in-place updates of claims.

## 11. Three-question gate for the machine as a control

1. What executes: the Cloud Run Jobs per stage, the write boundary in the graph writer, the DB scope check, the walk job, the scheduler. 2. What triggers: every stage (record and lease), every candidate (resolution), every resolved candidate (reconcile), every verified run (score), every publish (walk), the schedule (drift). 3. What fails: refusals with named codes and non-zero exits; a bare key at the write boundary; a production publish without a passed staging sibling; a quarantined cell reading satisfied; a factory run without a termination record. 4. What bypasses: raw SQL to a serving store (detected by `updated_at` outside any run window and reported as unrecorded); a lane that deploys outside publish (detected by revision not in the ledger).

leave_behind: none; design only.
