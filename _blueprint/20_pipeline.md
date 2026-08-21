---
id: blueprint_20_pipeline
title: Master blueprint — pipeline
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
related: [51_ingestion_pipeline_reference, _blueprint/10_model]
---

# Master blueprint — pipeline

Compiled from `51_ingestion_pipeline_reference.md` (reconciled 2026-08-20). This is the operational wiring diagram for how bytes become served atoms.

## Four-layer spine

| Layer | Job | Writes | Reads |
| --- | --- | --- | --- |
| **L1 Acquisition** | Fetch raw bytes + checksum + manifest ref | Landing only | Manifest registry |
| **L2 Landing** | Immutable raw store per retention class | Append-only landing tables / object store | L3 replay |
| **L3 Canonicalisation** | Adapters → candidates → resolution → reconciliation → atoms + edges | `atoms`, `atom_links`, resolution atoms | L2 |
| **L4 Serving** | Read-only views, MCP, product APIs | None (materialized snapshots except) | Customers, agents |

**Cross-layer rules (51 §1):**

1. Provenance travels with every record at every layer.
2. Provenance is a reference, never a copy of mutable state.
3. Each layer knows only the contract below it.

## L1 — Acquisition

**Manifest entry** declares: source identity, refresh cadence, authority, license terms, **retention class**.

Retention class is binding: no universal permanent landing. Sources without redistribution rights declare non-replayable canonicalisation.

**Consumers today:** Factory runners (`legacy-design-tools`, `hauska-engine` intake scripts), county acquisition lanes — **no single registry executor in CI** (BP-MANIFEST-01 UNENFORCED).

## L2 — Landing

Examples in property estate:

| Landing store | Database | Role |
| --- | --- | --- |
| `txgio_parcel`, staging tables | `neondb` | Parcel geometry source |
| `tx_fema_nfhl_flood_zone`, `tx_special_district`, etc. | `neondb` | Overlay staging |
| Raw acquisition blobs | GCS / local work roots | Factory 1.5 sweep |

Nothing except acquisition writes landing. **Tier2 flood tile-centroid path** — retired; wrote wrong assignment (V2).

## L3 — Canonicalisation (ordered stages)

### Stage A — Adapter (candidate emission)

Adapter declares: source id, producible node types, native identifiers, default confidence basis.

**Output:** candidate atoms in six-field shape (claim, provenance, confidence, citation, time, access/license). **No canonical node binding.**

**Defect class:** Adapters that write directly to `atoms` with borrowed keys skip resolution (V1, V12).

### Stage B — Resolution (identity judgement)

Three tiers (51 §3):

| Tier | Method | Outcome |
| --- | --- | --- |
| T1 | Exact authoritative alias match | Bind to canonical node |
| T2 | Probabilistic attribute match | Score → resolve or new node |
| T3 | Middle band | Provisional node + adjudication queue |

**Minting:** Canonical `{fips}:{propId}` must be minted; aliases in `externalKeys` (starved — V1).

**Parcel lineage:** SPLIT_FROM / MERGED_INTO for merge/split — required, not fully wired.

**Node type:** Explicit assignment from adapter-declared set; silent default prohibited.

### Stage C — Reconciliation

Candidate meets existing atoms on node: supersede, conflict emit, or refuse.

**Rule BP-RECON-01:** Two stores disagreeing (e.g. ring vs tile flood, 37,331 / 533,867 parcels — `_inbox/2026-08-20_db_probe_five_answers.md` Q5) must **emit conflict**, not silent pick.

### Stage D — Promotion

Provisional → confirmed via adjudication gate with throughput measurement (51 §4). Starvation of promotion queue = failing gate.

### Stage E — Graph write

Write fact atom row **and** `atom_links`:

| link_type | From | To | Status |
| --- | --- | --- | --- |
| `applies-to` | fact atom | parcel-node | **STARVED** (0 property rows) |
| `contains` | corpus / section | child | Fed (code corpus) |
| `subject-to` | parcel / instrument | encumbrance | Encumbrance path only |

Production binds via **`body.parcelNodeId`** without edge rows (V11).

## L4 — Serving

Read paths:

| Consumer | Source | Must not |
| --- | --- | --- |
| SmartSite / PE | cortex-api retrieval over `atoms` | Read landing |
| Hauska MCP | Engine storage port + Postgres index | Default `accessPolicy` |
| County Manifest | `county_ledger_snapshot` | Trust constant indicators (V5) |

**Tier2 flood retirement:** Atoms may exist; served payload omits flood if consumer not repointed (V9).

**Situs address facet:** Served `", ,"` passes non-null checks (V6). `_inbox/2026-08-20_audit_programme_handover_planner_variant.md` (2026-08-20) records situs 99.3% populated vs 89.90% real street coverage of 13,071,975, with 1,248,412 parcels counting as populated on `", ,"` and `", TX 78660"`. `_inbox/2026-08-20_c12_retrieval_candidate_rows.md` S-166: `baked-facets.ts:285` `typeof bf.situsAddress === "string" && bf.situsAddress.trim()` treats `", ,"` as present.

## Adapter contract (summary)

Adapters **do not:** write graph, resolve entities, dedupe, infer edges, decide precedence.

Write boundary **must reject** bare source keys in node binding fields (51 §2). **Status:** partial — orphans and grammar mismatch prove bypass paths exist (V12).

## Diagnostic battery (reference)

`51_ingestion_pipeline_reference.md` scorecard sections remain the SUBORDINATE operational checklist. Blueprint grading (`50_grading.md`) supersedes for rule-id output.

## Known wiring gaps (filed R-04)

| Gap | Violation |
| --- | --- |
| No factory termination | V10 |
| No property `atom_links` writer | V11 |
| No `externalKeys` / mint pipeline | V1 |
| No verified-absence writer | V8 |
| No post-retirement flood consumer | V9 |
| No parcel key normalisation at resolution | V12 |
