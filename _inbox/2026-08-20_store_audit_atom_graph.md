# STORE AUDIT — Actual Atom Graph (READ ONLY)

**Audit UTC:** 2026-08-20T23:03:41Z through 2026-08-20T23:28:00Z  
**Neon project:** `fancy-fire-06136146` (cortex-prod)  
**Host:** `ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech`  
**Role:** `neondb_owner`  
**Branch:** `br-crimson-feather-aphfmy91` (default compute)  
**Repo read (code context only):** `P:/doc_repo` @ `492a452c58b3b1e70f9ff95bc38c4872ce921fcd`  
**Contract version cited by operator:** `@empressaio/atom-contract@1.22.0` (not re-fetched from npm this session)

**Databases queried:**
| Database | Purpose |
|---|---|
| `hauska_mcp` | `atoms`, `document_ingest_atoms`, `atom_links`, … |
| `neondb` | `txgio_parcel`, `place_layer_snapshots`, `knowledge_atoms`, … |

**NOT re-checked this session:** product-repo write paths (hauska-engine, legacy-design-tools); IPFS atom bodies; npm tarball bytes; all 138 `neondb` table *contents* (catalog enumerated for Q2 only); exact `COUNT(*)` per `entity_type` on full `atoms` heap (100M+ reltuples — estimates used instead).

---

## Pre-registered failure modes and checks

### Failure mode 1 — Wrong database reports stronger absence than truth
**Mechanism:** Querying `atoms` on `neondb` raises `relation "atoms" does not exist`; a naive reader treats that as zero rows.  
**Second mechanism that would produce the same observation:** Empty `atoms` table on the correct database. Rejected because `hauska_mcp` returns rows and `pg_class.reltuples` ≈ 100M for `atoms`.  
**Check run:**
- `neondb`: `SELECT COUNT(*) FROM atoms WHERE entity_id='__nonexistent_audit_key__'` → **ERROR** `relation "atoms" does not exist`
- `hauska_mcp`: `SELECT COUNT(*) FROM atoms WHERE entity_type='__nonexistent_type__' AND entity_id='__nonexistent_audit_key__'` → **0 rows** (index-backed; completed in <1s)

**Verify by violating:** Nonexistent key on correct DB returns 0; same predicate shape on wrong DB errors. Observed both.

### Failure mode 2 — Full-table scan on 100M-row `atoms` masquerades as measurement
**Mechanism:** Bare `COUNT(*)` or unindexed `WHERE entity_id=…` scans the 131 GB heap and may time out or contend with production lanes.  
**Second mechanism:** Result is correct but took 70s+ (our first nonexistent-key query without `entity_type` was still running at 70s and was cancelled).  
**Check run:** Used `pg_class.reltuples`, `pg_stats.most_common_vals` for Q3; `TABLESAMPLE SYSTEM (0.001)` and `LIMIT`/`entity_type` index paths elsewhere; checked `pg_stat_activity` before heavier queries (saw only this session's own in-flight queries).

**Verify by violating:** Attempted unindexed `COUNT(*) … WHERE entity_id='__nonexistent_audit_key__'` — did not return within 60s; cancelled and reported as non-returning.

---

## Q1. FULL DDL — `atoms` and `document_ingest_atoms`

**Snapshot:** project `fancy-fire-06136146`, database `hauska_mcp`, role `neondb_owner`, UTC 2026-08-20T23:04:00Z

### `\d+ atoms` (raw)

```
                                                               Table "public.atoms"
       Column        |           Type           | Collation | Nullable |       Default       | Storage  | Compression | Stats target | Description 
---------------------+--------------------------+-----------+----------+---------------------+----------+-------------+--------------+-------------
 atom_did            | text                     |           | not null |                     | extended |             |              | 
 cid                 | text                     |           | not null |                     | extended |             |              | 
 content_hash        | text                     |           | not null |                     | extended |             |              | 
 entity_type         | text                     |           | not null |                     | extended |             |              | 
 entity_id           | text                     |           | not null |                     | extended |             |              | 
 jurisdiction_tenant | text                     |           | not null |                     | extended |             |              | 
 section_number      | text                     |           |          |                     | extended |             |              | 
 subsection_path     | text                     |           |          |                     | extended |             |              | 
 source_adapter      | text                     |           | not null |                     | extended |             |              | 
 source_url          | text                     |           | not null |                     | extended |             |              | 
 fetched_at          | timestamp with time zone |           | not null |                     | plain    |             |              | 
 body                | jsonb                    |           | not null |                     | extended |             |              | 
 access_policy       | text                     |           | not null | 'public-free'::text | extended |             |              | 
 created_at          | timestamp with time zone |           | not null | now()               | plain    |             |              | 
 updated_at          | timestamp with time zone |           | not null | now()               | plain    |             |              | 
Indexes:
    "atoms_pkey" PRIMARY KEY, btree (atom_did)
    "atoms_boundary_parcel_node_idx" btree ((body ->> 'parcelNodeId'::text) text_pattern_ops) WHERE entity_type = 'property-boundary-edge'::text
    "atoms_entity_composite_unique" UNIQUE, btree (entity_type, entity_id)
    "atoms_entity_type_idx" btree (entity_type)
    "atoms_jurisdiction_idx" btree (jurisdiction_tenant)
    "atoms_parcel_node_county_idx" btree ((body ->> 'countyFips'::text)) WHERE entity_type = 'parcel-node'::text
    "atoms_parcel_node_lookup_idx" btree ((body ->> 'parcelNodeId'::text)) WHERE entity_type = 'parcel-node'::text
    "atoms_property_parcel_node_idx" btree ((body ->> 'parcelNodeId'::text) text_pattern_ops) WHERE entity_type = ANY (ARRAY['zoning-fact'::text, 'setback-rule'::text, 'buildable-envelope'::text, 'parcel-terrain-model'::text])
    "atoms_road_county_fips_idx" btree ((body ->> 'countyFips'::text)) WHERE entity_type = 'road-node'::text
    "atoms_road_node_id_idx" btree ((body ->> 'roadNodeId'::text) text_pattern_ops) WHERE entity_type = 'road-node'::text
    "atoms_section_number_partial_idx" btree (jurisdiction_tenant, section_number) WHERE section_number IS NOT NULL
Access method: heap
```

**Constraints (pg_constraint):**
```
  conname   |  pg_get_constraintdef  
------------+------------------------
 atoms_pkey | PRIMARY KEY (atom_did)
(1 row)
```
Note: `atoms_entity_composite_unique` appears as a UNIQUE index in `\d+` but not as a named `pg_constraint` row (PostgreSQL implements it as a unique index).

**Triggers:** none (`pg_trigger` returned 0 rows).

**Heap magnitude (pg_class, same snapshot):** `reltuples` ≈ **100,025,152**; heap **131 GB**; total relation **156 GB**.

### `\d+ document_ingest_atoms` (raw)

```
                                                 Table "public.document_ingest_atoms"
       Column        |           Type           | Collation | Nullable | Default | Storage  | Compression | Stats target | Description 
---------------------+--------------------------+-----------+----------+---------+----------+-------------+--------------+-------------
 atom_did            | text                     |           | not null |         | extended |             |              | 
 entity_type         | text                     |           | not null |         | extended |             |              | 
 entity_id           | text                     |           | not null |         | extended |             |              | 
 jurisdiction_tenant | text                     |           |          |         | extended |             |              | 
 source_document_cid | text                     |           | not null |         | extended |             |              | 
 access_policy       | text                     |           | not null |         | extended |             |              | 
 storage_relation    | text                     |           | not null |         | extended |             |              | 
 verification_status | text                     |           |          |         | extended |             |              | 
 confidence_value    | real                     |           |          |         | plain    |             |              | 
 atom_json           | jsonb                    |           | not null |         | extended |             |              | 
 created_at          | timestamp with time zone |           |          | now()   | plain    |             |              | 
Indexes:
    "document_ingest_atoms_pkey" PRIMARY KEY, btree (atom_did)
    "idx_document_ingest_atoms_source_document_cid" btree (source_document_cid)
Access method: heap
```

**Constraints:** `document_ingest_atoms_pkey PRIMARY KEY (atom_did)` only.  
**Triggers:** none.  
**Row count:** `SELECT COUNT(*) FROM document_ingest_atoms` → **1**.

---

## Q2. Link / edge tables

**Method:** Full `information_schema.tables` enumeration on both databases (not grep). Then column inspection for paired atom/node references + type.

### `hauska_mcp` — all non-system tables (14)

```
api_keys
atom_links
atoms
atoms_bulk_writer_lease
document_blobs
document_ingest_atoms
jurisdiction_status
metering_events
rate_limit_counters
request_log
schema_migrations
sdk_metering_usage
source_obligation_ledger
spine_health_probe
```

### `neondb` — all non-system tables (138)

```
_system.replit_database_migrations_v1
public._schema_migrations
public.adapter_response_cache
public.api_keys
public.architect_notification_reads
public.atom_calibration_overlay
public.atom_events
public.attached_documents
public.autopilot_findings
public.autopilot_fix_actions
public.autopilot_runs
public.bim_models
public.briefing_divergences
public.briefing_generation_jobs
public.briefing_sources
public.brokerage_brief_runs
public.brokerage_install_claims
public.brokerage_user_profiles
public.brokerage_wallet_ledger
public.brokerage_wallets
public.brokerage_workspace_attachments
public.brokerage_workspace_shares
public.brokerage_workspaces
public.cad_property
public.cad_property_vintage_crosswalk
public.cad_property_vintage_fallback
public.canned_findings
public.canva_connections
public.canva_design_pushes
public.canva_oauth_states
public.canva_push_jobs
public.code_atom_fetch_queue
public.code_atom_sources
public.code_atoms
public.collateral_export_jobs
public.collateral_exports
public.collateral_metering_events
public.cotality_geocode_cache
public.cotality_property_attr_cache
public.cotality_spatial_tile_cache
public.county_facet_coverage
public.county_gate_cert_state
public.county_ledger_snapshot
public.county_manifest
public.county_rail
public.coverage_requests
public.dataroom_document_atoms
public.decision_pdf_artifacts
public.deliverable_letter_renders
public.deliverable_letters
public.detail_callout_specs
public.engagement_annotations
public.engagement_packages
public.engagements
public.eval_baselines
public.eval_runs
public.eval_scores
public.finding_runs
public.findings
public.geography_columns
public.geometry_columns
public.gtm_consent
public.gtm_events
public.jurisdiction_registry_row_mirror
public.knowledge_atoms
public.manifest_jurisdiction_cost
public.manifest_run
public.manifest_slot_queue
public.manifest_slot_reservation
public.materializable_elements
public.onboarding_ledger_event
public.package_share_comments
public.package_shares
public.parcel_briefings
public.pe_chat_message_counts
public.pe_property_unlocks
public.pe_saved_properties
public.pe_user_entitlements
public.pe_user_identities
public.pe_workbench_state
public.permit_counters
public.permit_record
public.place_layer_snapshots
public.plan_set_piece_classifications
public.playing_with_neon
public.product_spec_references
public.qa_checklist_results
public.qa_runs
public.qa_settings
public.qa_triage_items
public.rail_state_history
public.rail_verification
public.reasoning_atoms
public.recorded_instruments
public.render_outputs
public.report_run
public.request_log
public.response_tasks
public.restriction_clauses
public.reviewer_annotations
public.reviewer_requests
public.saved_workspace_spaces
public.schema_migrations
public.sheet_content_extractions
public.sheets
public.smart_file_absence_determinations
public.smart_file_documents
public.smart_file_folder_records
public.smart_file_folders
public.smart_file_placements
public.smart_file_versions
public.snapshot_ifc_files
public.snapshots
public.spatial_ref_sys
public.submission_classifications
public.submission_comments
public.submission_communications
public.submissions
public.terrain_generation_jobs
public.tx_building_footprint
public.tx_city_boundary
public.tx_county_bbox
public.tx_county_boundary
public.tx_fema_nfhl_flood_zone
public.tx_parcel_tile_cache
public.tx_rrc_pipeline
public.tx_rrc_well
public.tx_special_district
public.tx_utility_territory_staging
public.tx_zoning_district_staging
public.txgio_address
public.txgio_parcel
public.txgio_parcel_staging
public.user_auth_credentials
public.user_usage_metering
public.users
public.viewpoint_renders
public.workspace_settings
```

### Tables carrying a pair of node/atom references plus a type

| Table | Database | Pair + type | Notes |
|---|---|---|---|
| **`atom_links`** | `hauska_mcp` | `from_atom_did`, `to_atom_did`, **`link_type`** | **YES** — ADR-010-shaped edge index layer (uses `atom_did`, not `target_cid`). ~33k rows. |
| `source_obligation_ledger` | `hauska_mcp` | `atom_did`, `source_actor_did` | Actor obligation, not graph edge taxonomy |
| `reviewer_annotations` | `neondb` | `target_entity_type`, `target_entity_id` | Review workflow, not atom graph |
| `reviewer_requests` | `neondb` | `target_entity_type`, `target_entity_id` | Same |
| `findings` | `neondb` | single `atom_id` | Not a pair |
| `dataroom_document_atoms` | `neondb` | `atom_did` only | Ingest pointer, no edge type |

**`\d+ atom_links` (raw):**
```
                                                    Table "public.atom_links"
    Column     |           Type           | Collation | Nullable | Default | Storage  | Compression | Stats target | Description 
---------------+--------------------------+-----------+----------+---------+----------+-------------+--------------+-------------
 from_atom_did | text                     |           | not null |         | extended |             |              | 
 to_atom_did   | text                     |           | not null |         | extended |             |              | 
 link_type     | text                     |           | not null |         | extended |             |              | 
 context       | text                     |           |          |         | extended |             |              | 
 created_at    | timestamp with time zone |           | not null | now()   | plain    |             |              | 
Indexes:
    "atom_links_pkey" PRIMARY KEY, btree (from_atom_did, to_atom_did, link_type)
    "atom_links_from_idx" btree (from_atom_did)
    "atom_links_to_idx" btree (to_atom_did)
    "atom_links_type_idx" btree (link_type)
```

**`link_type` inventory (exact GROUP BY, 33,066 est rows):**
| link_type | n |
|---|---:|
| contains | 28,623 |
| cites | 4,526 |
| subject-to | 2,069 |
| see-also | 228 |
| as-defined-in | 65 |
| amends | 27 |
| supersedes | 7 |

**Finding:** A real edge table exists on `hauska_mcp`. ADR-010's `target_cid` column name is **not** present in production; edges bind **`from_atom_did` / `to_atom_did`**.  
**Mechanism:** Engine storage port migrated to DID-native links.  
**Second mechanism:** Edges only in IPFS. Rejected: 33k live rows in `atom_links`.

**Negative on `neondb` for ADR-010 Postgres index layer:** No table with both `link_type` and `target_cid` (column search returned 0 rows). Graph edges for catalog atoms live on `hauska_mcp` only.

---

## Q3. `entity_type` inventory

**Method:** `pg_stats.most_common_vals` × `pg_class.reltuples` on `atoms` (index/analyze-backed estimate; **not** exact `COUNT(*)` per type).  
**Snapshot:** `hauska_mcp`, UTC 2026-08-20T23:05:00Z. **`reltuples` = 100,025,152.**

| entity_type | est_rows | freq |
|---|---:|---:|
| special-district-fact | 21,586,428 | 0.21581 |
| parcel-node | 14,182,900 | 0.14179334 |
| rail-corridor-fact | 13,592,085 | 0.13588667 |
| flood-hazard-fact | 13,554,408 | 0.13551 |
| rrc-pipeline-fact | 7,800,628 | 0.077986665 |
| cad-parcel-roll | 5,091,280 | 0.0509 |
| zoning-fact | 4,844,552 | 0.048433334 |
| well-fact | 4,472,458 | 0.044713333 |
| land-use-fact | 4,422,446 | 0.044213332 |
| owner-fact | 4,369,766 | 0.043686666 |
| building-footprint | 3,646,917 | 0.03646 |
| buildable-envelope | 1,544,722 | 0.015443333 |
| setback-rule | 821,873 | 0.008216667 |
| code-section | 31,008 | 0.00031 |
| property-boundary-edge | 30,674 | 0.00030666665 |
| road-node | 27,340 | 0.00027333334 |
| code-cross-reference | 5,668 | 0.000056666668 |

**17 distinct `entity_type` values** (complete per `pg_stats.n_distinct = 17`).

**Mechanism:** Stats estimate from ANALYZE sample.  
**Second mechanism:** True counts differ if recent bulk load outran ANALYZE. Rejected partially: heap grew to ~100M vs older 43.6M citations; treat as **estimate**, not audit-grade exact.

---

## Q4. Key grammar (empirical) — top 15 entity types

**Method:** For each type, `LIMIT 200` on `entity_type` index scan; mask digits→`9`, letters→`a`. Additional offset sample at row 50000 for `parcel-node` and `flood-hazard-fact` to catch second grammar family.

### Primary sample (first 200 rows per type)

| entity_type | shape | count / 200 |
|---|---|---:|
| special-district-fact | `99999:99999.99999999:aa:aaaaaaa` | 200 |
| parcel-node | `99999:99999.99999999` | 200 |
| rail-corridor-fact | `99999:99999.99999999` | 200 |
| flood-hazard-fact | `99999:99999.99999999` | 200 |
| rrc-pipeline-fact | `99999:99999.99999999` | 200 |
| cad-parcel-roll | `99999:99999:9999` | 116 |
| cad-parcel-roll | `99999:999999:9999` | 84 |
| zoning-fact | `99999:99999` | 194 |
| zoning-fact | `99999:999999` | 5 |
| zoning-fact | `99999:9` | 1 |
| well-fact | `99999:99999.99999999:aaaa` | 111 |
| well-fact | `99999:99999.99999999:99999999999999` | 89 |
| land-use-fact | `99999:99999:9999` | 193 |
| land-use-fact | `99999:999999:9999` | 7 |
| owner-fact | `99999:99999:9999` | 193 |
| owner-fact | `99999:999999:9999` | 7 |
| building-footprint | `99999:99999.99999999:aaaaaaaaa:aaaaaaa` | 182 |
| building-footprint | `99999:99999.99999999:aaaaaaaaa:aaaaaaaaa-9` | 18 |
| buildable-envelope | `99999:99999` | 194 |
| buildable-envelope | `99999:999999` | 5 |
| buildable-envelope | `99999:9` | 1 |
| setback-rule | `99999:999999` | 177 |
| setback-rule | `99999:99999` | 22 |
| setback-rule | `99999:9` | 1 |
| code-section | `aaaaaaa_aa/aaaaaaa-aaaaaaaaa-aaaa-aaaaaaa-aaaaaaaaaa/99-99-999` | 181 |
| code-section | `aaaaaaa_aa/aaaaaaa-aaaaaaaaa-aaaa-aaaaaaa-aaaaaaaaaa/99-99` | 19 |
| property-boundary-edge | `99999:999999:aaaaaaaa:9` | 118 |
| property-boundary-edge | `99999:9:aaaaaaaa:99` | 47 |
| property-boundary-edge | `99999:999999:aaaaaaaa:99` | 25 |
| property-boundary-edge | `99999:9:aaaaaaaa:9` | 10 |

### Secondary sample (OFFSET 50000, LIMIT 200) — coexisting grammar

| entity_type | shape | count / 200 |
|---|---|---:|
| parcel-node | `99999:999999` | 170 |
| parcel-node | `99999:99999` | 30 |
| flood-hazard-fact | `99999:999999` | 170 |
| flood-hazard-fact | `99999:99999` | 30 |

### Grammar summary (decoded)

| Family | Pattern | Used by |
|---|---|---|
| **StratMap decimal prop_id** | `{fips}:{prop_id}.00000000` | Many bulk-ingest counties: `parcel-node`, `flood-hazard-fact`, `rail-corridor-fact`, `rrc-pipeline-fact`, `special-district-fact` prefix, `building-footprint` |
| **Integer prop_id** | `{fips}:{prop_id}` | Other counties / breadth-bake paths (e.g. `48431:2225`, `48121:645`) |
| **CAD roll + tax year** | `{fips}:{prop_id}:{taxYear}` | `cad-parcel-roll`, `land-use-fact`, `owner-fact` |
| **Special district discriminator** | `{parcelKey}:sd:{districtId}` | `special-district-fact` — **`sd` is fixed kind token; `{districtId}` is `outside` or numeric (e.g. `5460000`, `8130000`)** |
| **Well API discriminator** | `{parcelKey}:{api14}` | `well-fact` |
| **Footprint slot** | `{parcelKey}:footprint:primary` | `building-footprint` |
| **Road node** | `{fips}:road:{osm_id}` | `road-node` (from Q7 sample) |
| **Code corpuscles** | `{jurisdiction_key}/{edition}/{section}` | `code-section` |
| **Boundary edge** | `{fips}:{prop_id}:{edgeKind}:{seq}` | `property-boundary-edge` |

**Mechanism:** Multiple writers use incompatible parcel key serializations (decimal-padded vs integer).  
**Second mechanism:** Single writer, intentional dual keys. Rejected: same county batches share one shape; offset sample shows **both** shapes present in store.

---

## Q5. Starvation check — contract fields

**Global sample method:** `TABLESAMPLE SYSTEM (0.001)` → **1,025 rows**; scale to `reltuples` ≈ 100,025,152 (extrapolation factor ≈ 97,683:1).

| Field | Location | Non-null / present in sample | Extrapolated est. | Starved? |
|---|---|---:|---:|:---:|
| **keyKind** | `body` JSON | 203 / 1,025 | ~19.8M | **Partial** — populated on `parcel-node` only (1000/1000 bounded sample) |
| **externalKeys** | `body` | 0 / 1,025 | ~0 | **YES** |
| **geometryStoreRef** | `body` | 148 / 1,025 | ~14.5M | **Partial** — `parcel-node` writer only |
| **absence** | `body` | 108 / 1,025 | ~10.5M | **Partial** — `zoning-fact`, `building-footprint` (see samples) |
| **verifiedAbsence** | `body` | 0 / 1,025 | ~0 | **YES** |
| **divergenceObservationCount** | `body` | 0 / 1,025 | ~0 | **YES** |
| **evaluated** | `body.verifiedAbsence` | 0 / 1,025 | ~0 | **YES** (distinct from `evaluatedAt` timestamp, which *is* written) |
| **provenanceScope** | `body.verifiedAbsence` | 0 / 1,025 | ~0 | **YES** |
| **atomDid** | **`body`** JSON | 1,025 / 1,025 | ~100M | **Populated** but uses **short hash form** (`fhfact_…`, `ownfact_…`), not `did:hauska:…` |
| **atom_did** | **column** | PK NOT NULL | ~100M | **Populated** — canonical `did:hauska:{type}:{id}` |
| **inputAtoms** | `body` | 0 / 1,025 | ~0 | **YES** |
| **validTo** | `body` | 0 / 1,025 | ~0 | **YES** |
| **knowledgeTime** | `body` | 0 / 1,025 | ~0 | **YES** |
| **containsPii** | `body` | 0 / 1,025 | ~0 | **YES** |
| **license** | `body` | 0 / 1,025 | ~0 | **YES** (`accessPolicy` / column `access_policy` used instead) |

### Sample values (real, where non-zero)

**keyKind + geometryStoreRef (`parcel-node`):**
```json
"keyKind": "prop_id",
"geometryStoreRef": {"store": "txgio_parcel", "propId": "54251", "countyFips": "48489"}
```

**absence (`zoning-fact`):**
```json
"absence": {"kind": "no-zoning-stamp", "reason": "No zoning district observed for parcel — honest absence, no fallback district invented."}
```

**absence (`building-footprint`):**
```json
"absence": {"kind": "no-footprint-feature", "reason": "staged-geometry-true-join-below-10pct-overlap-threshold — no qualifying staged footprint for parcel"}
```

**body.atomDid (note mismatch with column):**
- Column: `did:hauska:flood-hazard-fact:48431:2225`
- Body: `"atomDid": "fhfact_d136cb340f358e32"`

**Mechanism:** Writers ship v1.22.0 field names selectively; ADR-028 verified-absence pair never written.  
**Second mechanism:** Fields nested under different keys. Rejected: explicit `body ? 'verifiedAbsence'` and `body->'verifiedAbsence' ? 'evaluated'` both 0 in 1,025-row sample.

---

## Q6. `atom_did` column vs `did:hauska:{entity_type}:{entity_id}`

**Method:** 200-row sample from `TABLESAMPLE SYSTEM (0.001) LIMIT 200`.

| Metric | count |
|---|---:|
| Column non-null | 200 |
| Matches `did:hauska:` \|\| entity_type \|\| ':' \|\| entity_id | **200** |
| Mismatches | **0** |
| Nulls | **0** |

**Mechanism:** Writer sets column DID from typed key at ingest.  
**Second mechanism:** Trigger maintains DID. Rejected: no triggers on `atoms`.

**Verify by violating:** If formula were wrong, mismatches > 0; observed 0/200.

**Separate finding:** `body.atomDid` uses a **different namespace** (short prefixed hash). Column is authoritative for graph identity; body field is not redundant copy of column value.

---

## Q7. Full sample rows (one per requested type)

PII redaction applied to `owner-fact` name fields only.

### parcel-node

```
atom_did            | did:hauska:parcel-node:48489:54251
cid                 | bafy-fnv1a64:52202020219df647
content_hash        | fnv1a64:52202020219df647
entity_type         | parcel-node
entity_id           | 48489:54251
jurisdiction_tenant | tx_48489
section_number      | 
subsection_path     | 
source_adapter      | txgio-stratmap-bulk-v1
source_url          | https://data.geographic.texas.gov/
fetched_at          | 2026-08-09 12:50:07.708+00
access_policy       | public-free
created_at          | 2026-08-09 12:50:56.488298+00
updated_at          | 2026-08-09 12:50:56.488298+00
body                | {
  "status": "active",
  "atomDid": "did:hauska:parcel-node:48489:54251",
  "keyKind": "prop_id",
  "atomTier": "data",
  "entityId": "48489:54251",
  "fetchedAt": "2026-08-09T12:50:07.708Z",
  "sourceUrl": "https://data.geographic.texas.gov/",
  "countyFips": "48489",
  "entityType": "parcel-node",
  "contentHash": "fnv1a64:52202020219df647",
  "evaluatedAt": "2026-08-09T12:50:07.708Z",
  "extractedAt": "2026-08-09T12:50:07.708Z",
  "accessPolicy": "public-free",
  "parcelNodeId": "48489:54251",
  "sourceAdapter": "txgio-stratmap-bulk-v1",
  "sourceVintage": "stratmap25-landparcels_48489_willacy_202503",
  "geometryLoaded": true,
  "reasoningChain": {"reasoningKind": "observed"},
  "sourceCitation": "TxGIO StratMap Land Parcels, county 48489, vintage stratmap25-landparcels_48489_willacy_202503",
  "geometryStoreRef": {"store": "txgio_parcel", "propId": "54251", "countyFips": "48489"},
  "geometrySourceTier": "txgio-stratmap",
  "jurisdictionTenant": "tx_48489",
  "verificationStatus": "machine"
}
```

### flood-hazard-fact

```
atom_did            | did:hauska:flood-hazard-fact:48431:2225
entity_id           | 48431:2225
source_adapter      | fema-nfhl-bulk-v1
body (pretty)       | {
  "status": "active",
  "atomDid": "fhfact_d136cb340f358e32",
  "parcelNodeId": "48431:2225",
  "floodZone": null,
  "inSpecialFloodHazardArea": false,
  "sourceAdapter": "fema-nfhl-bulk-v1",
  "sourceVintage": "NFHL_48_20260101",
  "entityType": "flood-hazard-fact",
  "accessPolicy": "public-free",
  "verificationStatus": "machine"
  ... (full row captured 2026-08-20 audit)
}
```

### special-district-fact

```
atom_did            | did:hauska:special-district-fact:48453:587851:sd:5460000
entity_id           | 48453:587851:sd:5460000
source_adapter      | tceq-water-districts-v1
body (pretty)       | {
  "parcelNodeId": "48453:587851",
  "districtId": "5460000",
  "districtType": "RA",
  "districtName": "Lower Colorado River Authority",
  "membershipBasis": "point-in-polygon",
  "entityType": "special-district-fact"
  ...
}
```

### land-use-fact

```
atom_did            | did:hauska:land-use-fact:48021:127944:2025
entity_id           | 48021:127944:2025
source_adapter      | cad-property-land-use-v1
body (pretty)       | {
  "taxYear": 2025,
  "landUseCode": "A1",
  "parcelNodeId": "48021:127944",
  "entityType": "land-use-fact",
  "accessPolicy": "public-free"
  ...
}
```

### owner-fact (PII redacted)

```
atom_did            | did:hauska:owner-fact:48021:30985:2025
entity_id           | 48021:30985:2025
access_policy       | public-paid
source_adapter      | cad-property-owner-v1
body (pretty)       | {
  "taxYear": 2025,
  "ownerName": "<PII-REDACTED>",
  "ownerMailingAddress": "10750 SYMPHONY WAY, COLUMBIA, MD 21044",
  "parcelNodeId": "48021:30985",
  "accessPolicy": "public-paid",
  "entityType": "owner-fact"
  ...
}
```

### zoning-fact

```
atom_did            | did:hauska:zoning-fact:48121:645
entity_id           | 48121:645
source_adapter      | cortex-tier1-snapshot-breadth-bake
body (pretty)       | {
  "absence": {
    "kind": "no-zoning-stamp",
    "reason": "No zoning district observed for parcel — honest absence, no fallback district invented."
  },
  "parcelNodeId": "48121:645",
  "readContract": { "axes": { ... } },
  "entityType": "zoning-fact"
  ...
}
```

### road-node (complete row as JSON)

```json
{"atom_did":"did:hauska:road-node:48001:road:15238067","cid":"bafy-47a00d7419bb95709fd20bbcfaf95f996c082263601bf6b3ef09bb5c6785a660","content_hash":"47a00d7419bb95709fd20bbcfaf95f996c082263601bf6b3ef09bb5c6785a660","entity_type":"road-node","entity_id":"48001:road:15238067","jurisdiction_tenant":"breadth_48001_anderson","section_number":null,"subsection_path":null,"source_adapter":"road-intake-osm-geofabrik-pbf","source_url":"https://download.geofabrik.de/north-america/us/texas-latest.osm.pbf#md5=4dd27afd6bc1c654f9b9635b709cf424","fetched_at":"2026-08-16T21:30:58.667+00:00","body":{"row":{"leftEdge":{"type":"LineString","coordinates":[[-95.78894563909553,31.648750606097355],[-95.79447263954636,31.647956606065428]]},"rightEdge":{"type":"LineString","coordinates":[[-95.78899916090448,31.649020593902645],[-95.79452616045366,31.648226593934574]]},"provenance":{"kind":"approximate-assumed-per-class","note":"v1 assumed ROW — not survey/CAD","osmHighwayTag":"trunk","assumedWidthTableKey":"highway"},"assumedWidthFt":100},"status":"active","atomDid":"did:hauska:road-node:48001:road:15238067","atomTier":"data","entityId":"48001:road:15238067","osmWayId":15238067,"fetchedAt":"2026-08-16T21:30:58.667Z","sourceUrl":"https://download.geofabrik.de/north-america/us/texas-latest.osm.pbf#md5=4dd27afd6bc1c654f9b9635b709cf424","centerline":{"type":"LineString","coordinates":[[-95.7889724,31.6488856],[-95.7944994,31.6480916]]},"countyFips":"48001","entityType":"road-node","roadNodeId":"48001:road:15238067","contentHash":"47a00d7419bb95709fd20bbcfaf95f996c082263601bf6b3ef09bb5c6785a660","extractedAt":"2026-08-16T21:30:58.667Z","accessPolicy":"public-free","attachPoints":[{"kind":"infra-slot","note":"Digital-twin attach point — no infra atoms in R1 scope","refKey":"centerline-mid","position":[-95.7944994,31.6480916]}],"readContract":{"axes":{"consequence":{"kind":"not-applicable","reason":"road-node-v1-approximate-row-has-no-life-safety-stratum","assertedAt":"2026-08-16T21:30:58.667Z"},"assertedConfidence":{"n":0,"estimate":0.7,"provenance":"asserted","intervalWidth":0.22},"calibratedConfidence":{"n":0,"estimate":0.7,"provenance":"seed","intervalWidth":0.22}},"assembledAt":"2026-08-16T21:30:58.667Z"},"versionStamp":"48001:road:15238067:road-node:1:2026-08-16T21:30:58.667Z","sourceAdapter":"road-intake-osm-geofabrik-pbf","classification":"highway","reasoningChain":{"reasoningKind":"observed"},"sourceCitation":"OpenStreetMap way/15238067 highway=trunk","isPedestrianWay":false,"jurisdictionTenant":"breadth_48001_anderson"},"access_policy":"public-free","created_at":"2026-08-16T21:31:00.057546+00:00","updated_at":"2026-08-16T21:31:00.057546+00:00"}
```

### setback-rule (complete row as JSON)

```json
{"atom_did":"did:hauska:setback-rule:48055:18925","cid":"bafy-c874f2beea2a5ead905540a3b44341ae38a56c780a793e7193df693a1982e77d","content_hash":"c874f2beea2a5ead905540a3b44341ae38a56c780a793e7193df693a1982e77d","entity_type":"setback-rule","entity_id":"48055:18925","jurisdiction_tenant":"breadth_48055_lockhart","section_number":null,"subsection_path":null,"source_adapter":"cortex-tier1-snapshot-breadth-bake","source_url":"https://hauska.dev/internal/breadth-atom-bake/cortex-snapshot","fetched_at":"2026-07-24T01:02:23.609+00:00","body":{"rear":10,"side":7.5,"front":25,"status":"active","atomDid":"did:hauska:setback-rule:48055:18925","atomTier":"data","entityId":"48055:18925","fetchedAt":"2026-07-24T01:02:23.609Z","sourceUrl":"https://hauska.dev/internal/breadth-atom-bake/cortex-snapshot","entityType":"setback-rule","matchBasis":"exact","contentHash":"c874f2beea2a5ead905540a3b44341ae38a56c780a793e7193df693a1982e77d","extractedAt":"2026-07-24T01:02:23.609Z","accessPolicy":"public-free","districtCode":"RLD","parcelNodeId":"48055:18925","readContract":{"axes":{"consequence":{"kind":"not-applicable","reason":"setback-rule-citation-has-no-life-safety-stratum","assertedAt":"2026-07-24T01:02:23.609Z"},"assertedConfidence":{"n":0,"estimate":0.9,"provenance":"asserted","intervalWidth":0.12},"calibratedConfidence":{"n":0,"estimate":0.9,"provenance":"seed","intervalWidth":0.12}},"assembledAt":"2026-07-24T01:02:23.609Z"},"sideCornerFt":7.5,"versionStamp":"48055:18925:setback-rule:1:2026-07-24T01:02:23.609Z","sourceAdapter":"cortex-tier1-snapshot-breadth-bake","reasoningChain":{"reasoningKind":"observed"},"sourceCitation":"Setback rule for RLD cited to did:hauska:code-section:storage-port-proof/phase-1a","fieldProvenance":{"rear":{"atomDid":"did:hauska:code-section:storage-port-proof/phase-1a","confidence":{"n":1,"estimate":0.85,"provenance":"asserted","intervalWidth":0.12}},"side":{"atomDid":"did:hauska:code-section:storage-port-proof/phase-1a","confidence":{"n":1,"estimate":0.85,"provenance":"asserted","intervalWidth":0.12}},"front":{"atomDid":"did:hauska:code-section:storage-port-proof/phase-1a","confidence":{"n":1,"estimate":0.85,"provenance":"asserted","intervalWidth":0.12}}},"sourceCodeAtomRef":{"role":"rule","atomDid":"did:hauska:code-section:storage-port-proof/phase-1a","entityType":"code-section"},"jurisdictionTenant":"breadth_48055_lockhart"},"access_policy":"public-free","created_at":"2026-07-24T01:02:24.048517+00:00","updated_at":"2026-07-24T01:02:24.048517+00:00"}
```

### code-section and building-footprint

Full rows captured in audit session (see `\d+` session output). `code-section` sample is storage-port proof section; `building-footprint` sample includes typed `absence` for sub-threshold geometry join.

---

## Q8. Binding test — fact atoms → `parcel-node`

**Method:** 100 rows each, `ORDER BY md5(entity_id)` pseudo-random; resolve by `entity_id` equality or derived `parcel_key`.

### flood-hazard-fact → parcel-node (100 samples)

| Outcome | count |
|---|---:|
| **resolved** | 84 |
| **unresolved** | 9 |
| **key_shape_mismatch** | 7 |

**Resolution rule:** For shape `{fips}:{prop}` or `{fips}:{prop}.00000000`, require matching `parcel-node.entity_id` **exact string equality**.

**Mechanism for unresolved/mismatch:** Two coexisting parcel key grammars (integer vs decimal-padded). Flood atom `48431:2225` does not resolve if parcel-node stored as `48431:2225.00000000` (or vice versa).  
**Second mechanism:** Missing parcel ingest. Rejected for the 84 resolved cases; binding works when strings match exactly.

**First-100-rows deterministic test (Anderson county batch):** 100/100 resolved when both sides use `48001:10001.00000000` shape.

### special-district-fact → parcel-node (100 md5-ordered samples)

| Outcome | count |
|---|---:|
| **resolved** | 80 |
| **unresolved** | 14 |
| **key_shape_mismatch** | 6 |

**Discriminator (500-row sample):**

| district_kind | district_id | n / 500 |
|---|---|---:|
| sd | outside | 289 |
| sd | 8130000 | 211 |

**Key shape:** `{parcelNodeKey}:sd:{districtId}` where `parcelNodeKey` is `{fips}:{prop_id}` or `{fips}:{prop_id}.00000000`.

**Mechanism:** One parcel × many districts ⇒ entity_id carries `:sd:{districtId}` suffix; binding strips segments 1–2 to find parcel-node.  
**Second mechanism:** Orphan districts without parcels. Partially true for 14 unresolved (parcel key absent or grammar mismatch), not counted as shape mismatch.

---

## Q9. `would_affect` / WouldAffectEdge

| Location | Query | hits |
|---|---|---:|
| `hauska_mcp.atoms` body | `TABLESAMPLE SYSTEM(0.001)` + `ILIKE '%would_affect%'` | **0 / 920** |
| `hauska_mcp.atom_links.link_type` | exact / ILIKE | **0** |
| `neondb.knowledge_atoms` | payload search | **0 / 0 rows** |
| `neondb.code_atoms` | `TABLESAMPLE(0.01)` metadata/body | **0 / 0 rows in sample** |

**Finding:** **WouldAffectEdge is not present** in either database in this audit sample.  
**Mechanism:** Edge type shipped in contract only; no writer registered.  
**Second mechanism:** Stored under different string. Rejected for links: exhaustive `link_type` GROUP BY shows 7 values, none would-affect-shaped.

---

## Q10. Time — intervals vs single timestamps

### `hauska_mcp.atoms`

| Field | Column? | In body (sample 1,025)? |
|---|---|:---:|
| valid_from / validFrom | No | 0 |
| valid_to / validTo | No | 0 |
| knowledge_at / knowledgeTime | No | 0 |

Atoms use point timestamps: `fetched_at`, `created_at`, `updated_at`, and body `evaluatedAt` / `extractedAt` / `fetchedAt`. **No interval validity model on catalog atoms.**

### `neondb.knowledge_atoms`

**Table exists.** DDL includes `valid_from timestamptz NOT NULL`, `valid_to timestamptz NULL`, `knowledge_at timestamptz NOT NULL`.

**Row count:** `SELECT COUNT(*) FROM knowledge_atoms` → **0**.

**Mechanism:** LDT memory substrate table migrated but unpopulated in prod.  
**Second mechanism:** Wrong database. Rejected: confirmed `current_database() = neondb` and table visible in catalog.

---

## Cross-cutting findings

1. **Starved contract fields (v1.22.0):** `externalKeys`, `verifiedAbsence`, `evaluated`, `provenanceScope`, `divergenceObservationCount`, `inputAtoms`, `validTo`, `knowledgeTime`, `containsPii`, `license` — **zero observed** in production sample. Fields exist in type; writers do not populate them.

2. **Partially fed fields:** `keyKind`, `geometryStoreRef` (parcel-node path); `absence` (zoning/building-footprint path); typed `absence` without `verifiedAbsence` pair.

3. **Dual parcel key grammars** in the same store — binding and joins fail unless normalized.

4. **Graph edges live** in `atom_links` (code-section corpus links). **Not** WouldAffect. **Not** on `neondb`.

5. **Scale:** ~100M atoms (stats), up from earlier ~43.6M citations — store is growing.

---

leave_behind: none
