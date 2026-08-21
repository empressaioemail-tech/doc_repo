---
id: blueprint_40_rule_register
title: Master blueprint — rule register
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
related: [_blueprint/10_model, _blueprint/20_pipeline, ENFORCEMENT, 51_ingestion_pipeline_reference]
---

# Master blueprint — rule register

Every governing rule with executor, trigger, failure mode, bypass, and status. Status values: **ENFORCED | UNENFORCED | DORMANT | STARVED | OVER-SCOPED**.

## Identity and keys

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-KEY-01 | Mint canonical parcel keys at resolution; carry source keys as aliases in externalKeys. | 51 §3 | NONE | resolution write | — | Direct entity_id from source in ingest | **STARVED** |
| BP-PARCEL-KEY-01 | Normalize parcel keys to one grammar ({fips}:{integer}) before bind or join. | 51 §3; store audit Q4 | NONE | resolution / join | — | Parallel ingest waves (StratMap decimal vs integer) | **UNENFORCED** |
| BP-KEY-SENTINEL-01 | Never place sentinels (outside, primary) inside primary identity keys. | 51 sentinel §; store audit Q8 | NONE | canonicalisation | — | `:sd:outside`, `:footprint:primary` in entity_id | **UNENFORCED** |
| BP-DID-01 | body.atomDid must equal column atom_did namespace. | ADR-011; store audit Q6 | NONE | atom write | — | Short hash body.atomDid | **UNENFORCED** |

## Pipeline and adapters

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-ADAPT-01 | Adapters emit candidates only; never write canonical graph directly. | 51 §2 | per-writer scripts (partial) | ingest job | throw | Bulk writers skipping adapter boundary | **UNENFORCED** |
| BP-RESOLVE-01 | Assign node type explicitly; refuse silent default. | 51 §3 | NONE | resolution | — | Default entity_type in writer | **UNENFORCED** |
| BP-PROMOTE-01 | Record adjudication outcome and measure queue depth before promoting Provisional to Resolved. Monotonic growth of the Provisional population is a gate fail. | 51 §4 / 30_lifecycle | NONE | operator or auto-adjudication | monotonic Provisional growth | Promote without recorded outcome or queue measurement | **UNENFORCED** |
| BP-LAND-01 | Honor manifest retention class on landing. | 51 §1 | acquisition scripts | fetch complete | refuse write | Ad-hoc landings | **UNENFORCED** |
| BP-FACTORY-01 | Every factory run must have a defined termination condition and off-ramp. | OPS-18 V10 | NONE | factory start | — | Operator kill only | **UNENFORCED** |

## Graph and edges

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-EDGE-01 | Write property fact atoms with applies-to link to parcel-node in atom_links. | ADR-010; 51 §3 | NONE | canonicalisation | — | body.parcelNodeId only | **STARVED** |
| BP-WRITE-01 | Reject atom append when node binding is not canonical. | 51 §2 | storage port (intended) | bulk apply | refuse | Orphan entity_ids in store | **DORMANT** |

## Meaning and quality

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-FLOOD-01 | Assign flood zones using parcel geometry intersection, not tile centroid alone. | 51 meaning §; `_inbox/2026-08-20_c10_flood_store_adjudication.md` | NONE (tier2 retired) | flood ingest | — | Retired path (historical V2) | **UNENFORCED** |
| BP-LANDUSE-01 | Never overlay land-use-fact and landuse rail counts as one measurement. | `_inbox/2026-08-20_a4_landuse_orphaning.md` | NONE | scoring / manifest | — | Manual prose distinction | **UNENFORCED** |
| BP-ADDRESS-01 | Reject situsAddress that is punctuation-only or empty tokens. | 51 meaning § | NONE | serve / index | — | Non-null string check | **UNENFORCED** |
| BP-RECON-01 | Emit conflict when two authoritative stores disagree on same parcel fact. | 51 §5 | NONE | reconciliation | — | Probe-only discovery | **STARVED** |
| BP-ABSENCE-01 | Assert verified absence only with evaluated true and non-empty provenanceScope. | ADR-028; contract verifiedAbsence | NONE | absence write | — | Typed absence object without pair | **STARVED** |
| BP-MEANING-01 | Prefer meaning-shaped checks (two independent derivations) over presence checks. | 51 § governing | `three-layer-audit.mjs` (no register row) | none | — | Presence-only CI | **DORMANT** |

## Access, license, serve

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-ACCESS-01 | Do not default accessPolicy to public-free when payload omits it. | ADR-017; 65_t25 W-30 | packages/retrieval index.ts | read/serve | should refuse | Default in index.ts ~402, ~484 | **UNENFORCED** |
| BP-LICENSE-01 | Effective read rights = intersection(accessPolicy, license). | ADR-028 | NONE | MCP gate | — | access_policy column only | **STARVED** |
| BP-SERVE-01 | Repoint all L4 consumers when a fact store retires. | 30_lifecycle retirement | NONE | deploy | — | tier2 flood retired, warm parcel empty | **UNENFORCED** |
| BP-SERVE-02 | Serve only Layer 4 views; never transform from landing in product. | 51 §1 | product repos (partial) | API request | — | Ad-hoc scripts | **UNENFORCED** |

## Launch and manifest instruments

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-LEDGER-01 | hasWriter and atomFamilyState must vary across manifest cells they grade. | OPS-18 R-09; live GET county-ledger 2026-08-20 | county_ledger_snapshot materialize | manifest read | criterion never red | Constants | **STARVED** |
| BP-BITEMP-01 | Do not cite knowledge_atoms as production bitemporal proof until populated. | ADR-028 §3; store audit Q10 | NONE | ADR acceptance | — | Proposed ADR language | **UNENFORCED** (governance) |

## Enforcement meta

| id | statement | source | consumer | trigger | failure | bypass | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BP-ENF-01 | Every control must answer executor, trigger, failure, bypass. | ENFORCEMENT § three-question gate | NONE | policy add | — | Prose in agent context | **UNENFORCED** |
| BP-VERIFY-01 | Verify checks by violating them before reporting success. | ENFORCEMENT | CI workflows (partial post-2026-08-20) | CI run | exit 1 | `--no-verify`, false-green regex | **DORMANT** → R-06 |

## D4 violation map (V1–V15)

| Violation | Rule id | Section | Failing sentence |
| --- | --- | --- | --- |
| V1 borrowed keys / empty externalKeys | BP-KEY-01 | `10_model` Identity | "Canonical parcel key is minted at resolution; source keys live in externalKeys." |
| V2 tier2 flood tile centroid | BP-FLOOD-01 | `40_rule_register` | "Assign flood zones using parcel geometry intersection, not tile centroid alone." |
| V3 accessPolicy default | BP-ACCESS-01 | `40_rule_register` | "Do not default accessPolicy to public-free when payload omits it." |
| V4 land-use vs landuse | BP-LANDUSE-01 | `40_rule_register` | "Never overlay land-use-fact and landuse rail counts as one measurement." |
| V5 constant ledger indicators | BP-LEDGER-01 | `40_rule_register` | "hasWriter and atomFamilyState must vary across manifest cells they grade." |
| V6 situsAddress ", ," | BP-ADDRESS-01 | `40_rule_register` | "Reject situsAddress that is punctuation-only or empty tokens." |
| V7 flood store disagreement silent | BP-RECON-01 | `40_rule_register` | "Emit conflict when two authoritative stores disagree on same parcel fact." |
| V8 verified-absence unfed | BP-ABSENCE-01 | `10_model` Absence | "Absence claims that must read as checked and none require the verified pair." |
| V9 tier2 retired no repoint | BP-SERVE-01 | `30_lifecycle` Retirement | "Repoint all L4 consumers when a fact store retires." |
| V10 factory no off-ramp | BP-FACTORY-01 | `40_rule_register` | "Every factory run must have a defined termination condition and off-ramp." UNENFORCED; R-06 builds the consumer. |
| V11 atom_links property starved | BP-EDGE-01 | `10_model` Edges | "Volatile relation half should live on edges (applies-to)." |
| V12 dual parcel grammars | BP-PARCEL-KEY-01 | `10_model` Nodes | "Normalized form: integer prop_id, no decimal padding." |
| V13 sentinels in keys | BP-KEY-SENTINEL-01 | `10_model` Edges | "Production encodes volatile half in entity_id suffix — violates BP-KEY-SENTINEL-01." |
| V14 dual atomDid namespaces | BP-DID-01 | `10_model` Atoms | "body.atomDid must equal column atom_did namespace." |
| V15 ADR-028 cites empty table | BP-BITEMP-01 | `10_model` Time | "Do not cite knowledge_atoms as production bitemporal proof until populated." |

### V10 — BP-FACTORY-01 UNENFORCED (R-06 build item)

| Field | Value |
| --- | --- |
| Proposed id | BP-FACTORY-01 |
| Statement | A factory acquisition run must declare max duration, success exit, failure exit, and lease release in manifest; runner must emit termination record. |
| Source | Operator observation relayed via WDLL V10 |
| Consumer | NONE (to be built R-06) |
| Filed | OPS-18 row R-04 governance gap analysis |

## Rule count summary

| Status | Count |
| --- | ---: |
| ENFORCED | 0 |
| UNENFORCED | 16 |
| DORMANT | 3 |
| STARVED | 6 |
| OVER-SCOPED | 0 |

Naming a rule UNENFORCED or STARVED is a pass per D3. Claiming enforcement without executor is a fail.
