---
id: 2026-08-21_r07_store_grade
title: R-07 grade of 2026-08-20 store audit against blueprint mesh
status: active
date: 2026-08-21
plan_row: R-07
applies_to: portfolio
related:
  - _inbox/2026-08-20_store_audit_atom_graph.md
  - _blueprint/40_rule_register.md
  - 90_operations/OPS-18a_path_to_smartsite_market.md
---

# R-07 store grade

Seat: integration. Worktree: `P:/doc_repo`. Branch: `main`. Commit at grade: `e022436908248c9d378fd9358f062a0b39cf5bee`.

**Source log (read, not paraphrased):** `_inbox/2026-08-20_store_audit_atom_graph.md`. Audit UTC 2026-08-20T23:03:41Z through 2026-08-20T23:28:00Z. Neon project `fancy-fire-06136146`. Repo read cited in the log: `492a452c58b3b1e70f9ff95bc38c4872ce921fcd`.

**This lane did not query the live store. No COUNT(*) on atoms. No new SQL.** Every figure below is quoted from that log. If the log has no figure, the cell is UNMEASURED.

Status values follow the dispatch vocab, aligned to `_blueprint/40_rule_register.md`: STARVED, UNENFORCED, DORMANT, wrong-value.

Launch-critical = blocks measured-everywhere once R-09 is live. Scoped to defect classes OPS-18a already named from this audit. Classes named in OPS-18a that are not Qs here (situsAddress, flood-consumer repoint, ledger unmeasured cells) stay out of this table. They are not estimated.

Yes rows are listed first, ordered identity/keys, then edges, then serve-path, then ledger.

## Launch-critical rows (ordered)

| Order | Q id | Bucket | What was measured (quoted) | BP-* | Status | Why yes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Q4a | identity/keys | Primary sample first 200 rows per type, snapshot inside audit window. Dual parcel grammars: StratMap `{fips}:{prop_id}.00000000` vs integer `{fips}:{prop_id}`. cad-parcel-roll 116/200 `99999:99999:9999` and 84/200 `99999:999999:9999`. zoning-fact 194/200 `99999:99999`, 5/200 `99999:999999`, 1/200 `99999:9`. | BP-PARCEL-KEY-01 | UNENFORCED | Dual grammars make bind and join fail unless strings match exactly. |
| 2 | Q4b | identity/keys | OFFSET 50000 LIMIT 200. parcel-node 170/200 `99999:999999` and 30/200 `99999:99999`. flood-hazard-fact same split 170/200 and 30/200. Timestamp: same audit window. | BP-PARCEL-KEY-01 | UNENFORCED | Both shapes coexist in one store. Second mechanism (single writer, dual keys on purpose) rejected in the log. |
| 3 | Q4c | identity/keys | building-footprint primary sample 182/200 shape `{parcelKey}:footprint:primary` (`99999:99999.99999999:aaaaaaaaa:aaaaaaa`). Decoded family table: sentinel `primary` inside entity_id. | BP-KEY-SENTINEL-01 | UNENFORCED | Sentinel in the primary key. |
| 4 | Q5b | identity/keys | `externalKeys` in body: **0 / 1,025** TABLESAMPLE SYSTEM (0.001), extrapolated ~0. Snapshot inside audit window. Scale note in log: factor ≈ 97,683:1 against reltuples 100,025,152. | BP-KEY-01 | STARVED | Canonical keys borrowed; source keys not carried as aliases. |
| 5 | Q8a | identity/keys | flood-hazard-fact → parcel-node, 100 md5-ordered samples. **resolved 84, unresolved 9, key_shape_mismatch 7.** Exact string equality on `{fips}:{prop}` or `{fips}:{prop}.00000000`. | BP-PARCEL-KEY-01 | UNENFORCED | Unresolvable bindings counted, not estimated. 16 of 100 do not bind. |
| 6 | Q8b | identity/keys | special-district-fact → parcel-node, 100 md5-ordered samples. **resolved 80, unresolved 14, key_shape_mismatch 6.** Binding strips `:sd:{districtId}`. | BP-PARCEL-KEY-01, BP-WRITE-01 | UNENFORCED / DORMANT | 20 of 100 do not bind. Write-time reject of non-canonical binding is DORMANT (no triggers on atoms). |
| 7 | Q8c | identity/keys | Discriminator 500-row sample: `sd` / `outside` **289 / 500**; `sd` / `8130000` **211 / 500**. | BP-KEY-SENTINEL-01 | UNENFORCED | `outside` is a sentinel inside entity_id. |
| 8 | Q2b | edges | `hauska_mcp.atom_links` exact GROUP BY, 33,066 est rows. link_type: contains 28,623; cites 4,526; subject-to 2,069; see-also 228; as-defined-in 65; amends 27; supersedes 7. **applies-to is not in the inventory.** | BP-EDGE-01 | STARVED | Edge table exists. Property applies-to is unfed. All seven types are code-corpus. |
| 9 | Q5e | serve-path | `verifiedAbsence` in body: **0 / 1,025**. `evaluated` **0 / 1,025**. `provenanceScope` **0 / 1,025**. Same TABLESAMPLE. | BP-ABSENCE-01 | STARVED | Verified-absence pair shipped and unfed. Typed `absence` (Q5d) is the bypass. |

Ledger bucket from this audit: **none.** BP-LEDGER-01 (hasWriter / atomFamilyState must vary) is not a Q in the 2026-08-20 atom-graph log. Do not estimate it here. It is R-09 plus DC-14.

Launch-critical count: **9**.

## Full Q map

| Q id | What was measured (quote the figure and timestamp from the audit) | BP-* | Status | Launch-critical |
| --- | --- | --- | --- | --- |
| Q1a | `\d+ atoms` at UTC **2026-08-20T23:04:00Z**, database `hauska_mcp`. Heap `reltuples` ≈ **100,025,152**; heap **131 GB**; total relation **156 GB**. PK `atom_did`. UNIQUE index `atoms_entity_composite_unique` on `(entity_type, entity_id)`. **Triggers: none.** Column `access_policy` default `'public-free'::text`. | BP-ACCESS-01 (default); heap magnitude is inventory not a rule fail | UNENFORCED | no |
| Q1b | `\d+ document_ingest_atoms`, same snapshot. `SELECT COUNT(*) FROM document_ingest_atoms` → **1**. PK only. Triggers none. | BP-LAND-01 | UNENFORCED | no |
| Q2a | Full `information_schema.tables` enumeration. `hauska_mcp` **14** non-system tables. `neondb` **138** non-system tables. Audit window 2026-08-20T23:03:41Z through 2026-08-20T23:28:00Z. Negative: no `neondb` table with both `link_type` and `target_cid`. | BP-EDGE-01 (edges live on `hauska_mcp` only) | STARVED (property applies-to); table presence itself is not the fail | no |
| Q2b | `atom_links` 33,066 est rows. Seven `link_type` values listed in the launch-critical table. `applies-to` absent. ADR-010 `target_cid` column **not** present; edges bind `from_atom_did` / `to_atom_did`. | BP-EDGE-01 | STARVED | **yes** |
| Q3 | `pg_stats.most_common_vals` × `reltuples` at UTC **2026-08-20T23:05:00Z**. `reltuples` = **100,025,152**. **17** distinct `entity_type` (`n_distinct = 17`). Top: special-district-fact 21,586,428; parcel-node 14,182,900; rail-corridor-fact 13,592,085; flood-hazard-fact 13,554,408; rrc-pipeline-fact 7,800,628; cad-parcel-roll 5,091,280; zoning-fact 4,844,552; well-fact 4,472,458; land-use-fact 4,422,446; owner-fact 4,369,766; building-footprint 3,646,917; buildable-envelope 1,544,722; setback-rule 821,873; code-section 31,008; property-boundary-edge 30,674; road-node 27,340; code-cross-reference 5,668. Log: treat as **estimate**, not audit-grade exact. | BP-RESOLVE-01 | UNENFORCED as a write rule; stored rows SATISFY non-null entity_type (column NOT NULL) | no |
| Q4a | First 200 rows per type, digit/letter mask. Dual grammars and per-type shape counts as in the launch-critical table. Timestamp: audit window. | BP-PARCEL-KEY-01 | UNENFORCED | **yes** |
| Q4b | OFFSET 50000 LIMIT 200 on parcel-node and flood-hazard-fact. 170/200 vs 30/200 split. | BP-PARCEL-KEY-01 | UNENFORCED | **yes** |
| Q4c | building-footprint 182/200 footprint:primary shape; well-fact discriminator `{parcelKey}:{api14}`; special-district `{parcelKey}:sd:{districtId}`. | BP-KEY-SENTINEL-01 | UNENFORCED | **yes** |
| Q5a | `keyKind` in body: **203 / 1,025**. Partial. Log: populated on parcel-node only (1000/1000 bounded sample). | BP-KEY-01 | STARVED (partial feed) | no |
| Q5b | `externalKeys`: **0 / 1,025**. | BP-KEY-01 | STARVED | **yes** |
| Q5c | `geometryStoreRef`: **148 / 1,025**. Partial. parcel-node writer only. | BP-SERVE-02 (geometry via store ref, not landing transform in product) | STARVED (partial) | no |
| Q5d | `absence`: **108 / 1,025**. Partial. zoning-fact `no-zoning-stamp`; building-footprint `no-footprint-feature`. | BP-ABSENCE-01 | STARVED (typed absence is the bypass of the verified pair) | no |
| Q5e | `verifiedAbsence`: **0 / 1,025**. | BP-ABSENCE-01 | STARVED | **yes** |
| Q5f | `divergenceObservationCount`: **0 / 1,025**. | BP-RECON-01 | STARVED | no |
| Q5g | `evaluated` (body.verifiedAbsence): **0 / 1,025**. Distinct from `evaluatedAt`, which the log says is written. | BP-ABSENCE-01 | STARVED | no (pair counted on Q5e) |
| Q5h | `provenanceScope` (body.verifiedAbsence): **0 / 1,025**. | BP-ABSENCE-01 | STARVED | no (pair counted on Q5e) |
| Q5i | `body.atomDid`: **1,025 / 1,025** present, short hash form (`fhfact_…`, `ownfact_…`), not `did:hauska:…`. Example in Q7 flood: column `did:hauska:flood-hazard-fact:48431:2225` vs body `"atomDid": "fhfact_d136cb340f358e32"`. | BP-DID-01 | wrong-value | no (column identity holds on Q6; ledger does not key off the body field) |
| Q5j | Column `atom_did`: PK NOT NULL, ~100M. Canonical `did:hauska:{type}:{id}`. | BP-DID-01 | SATISFIES the column half | no |
| Q5k | `inputAtoms`: **0 / 1,025**. | BP-EDGE-01 (instance lineage, not property applies-to) | STARVED | no |
| Q5l | `validTo`: **0 / 1,025**. | BP-BITEMP-01 | STARVED | no |
| Q5m | `knowledgeTime`: **0 / 1,025**. | BP-BITEMP-01 | STARVED | no |
| Q5n | `containsPii`: **0 / 1,025**. | no dedicated BP-* in the register; owner-fact sample is `public-paid` with PII in body | UNMEASURED as a rule (gap) | no |
| Q5o | `license`: **0 / 1,025**. Log: `accessPolicy` / column `access_policy` used instead. | BP-LICENSE-01 | STARVED | no |
| Q6 | 200-row TABLESAMPLE SYSTEM (0.001) LIMIT 200. Column non-null **200**. Matches `did:hauska:` \|\| entity_type \|\| ':' \|\| entity_id **200**. Mismatches **0**. Nulls **0**. No triggers. | BP-DID-01 | SATISFIES column formula; body namespace fail is Q5i | no |
| Q7 | One sample row per requested type (parcel-node, flood-hazard-fact, special-district-fact, land-use-fact, owner-fact, zoning-fact, road-node, setback-rule; code-section and building-footprint noted as captured). No aggregate count. parcel-node `48489:54251` integer grammar with keyKind prop_id. flood body.atomDid short hash. zoning typed absence. road-node `{fips}:road:{osm_id}`. | BP-PARCEL-KEY-01, BP-DID-01, BP-ABSENCE-01 | evidence for those rules; not a separate count | no |
| Q8a | flood → parcel-node 100 samples: 84 / 9 / 7. Anderson batch first-100: **100/100** resolved when both sides use `48001:10001.00000000`. | BP-PARCEL-KEY-01 | UNENFORCED | **yes** |
| Q8b | special-district → parcel-node 100 samples: 80 / 14 / 6. | BP-PARCEL-KEY-01, BP-WRITE-01 | UNENFORCED / DORMANT | **yes** |
| Q8c | 500-row discriminator: outside 289, 8130000 211. | BP-KEY-SENTINEL-01 | UNENFORCED | **yes** |
| Q9 | WouldAffectEdge. `atoms` body TABLESAMPLE SYSTEM(0.001) ILIKE `%would_affect%`: **0 / 920**. `atom_links.link_type` exact / ILIKE: **0**. `neondb.knowledge_atoms` payload: **0 / 0 rows**. `neondb.code_atoms` TABLESAMPLE(0.01): **0 / 0 rows in sample**. Exhaustive link_type GROUP BY has seven values, none would-affect-shaped. | BP-EDGE-01 (nearest; register names applies-to, not WouldAffect) | STARVED | no |
| Q10a | `hauska_mcp.atoms` interval fields. valid_from / validFrom: column No, body **0**. valid_to / validTo: column No, body **0**. knowledge_at / knowledgeTime: column No, body **0**. Sample 1,025. Point timestamps used instead (`fetched_at`, `created_at`, `updated_at`, body `evaluatedAt` / `extractedAt` / `fetchedAt`). | BP-BITEMP-01 | STARVED | no |
| Q10b | `neondb.knowledge_atoms` exists. DDL has `valid_from` NOT NULL, `valid_to` NULL, `knowledge_at` NOT NULL. `SELECT COUNT(*) FROM knowledge_atoms` → **0**. | BP-BITEMP-01 | UNENFORCED (governance: do not cite as production proof) | no |

Mapped Q count: **31** rows (Q1a, Q1b, Q2a, Q2b, Q3, Q4a, Q4b, Q4c, Q5a-Q5o, Q6, Q7, Q8a, Q8b, Q8c, Q9, Q10a, Q10b).

Q5n (`containsPii`) has no BP-* in `_blueprint/40_rule_register.md`. Named as a register gap, not invented.

## Family score annex (Q3 inventory; bindings only where Q8 counted)

Every family from Q3 `n_distinct = 17`. est_rows are stats estimates at 2026-08-20T23:05:00Z. Binding counts are Q8 samples only. Families Q8 did not test: binding UNMEASURED. Do not estimate.

| entity_type | est_rows (Q3) | Binding to parcel-node | Score |
| --- | ---: | --- | --- |
| special-district-fact | 21,586,428 | Q8b: 80 resolved / 14 unresolved / 6 key_shape_mismatch per 100; Q8c sentinel `outside` 289/500 | FAIL BP-PARCEL-KEY-01 and BP-KEY-SENTINEL-01 on counted samples |
| parcel-node | 14,182,900 | identity node; Q4a integer and decimal families; Q4b 170/200 vs 30/200 at offset 50000 | FAIL BP-PARCEL-KEY-01 (two grammars) |
| rail-corridor-fact | 13,592,085 | UNMEASURED | family present as estimate only |
| flood-hazard-fact | 13,554,408 | Q8a: 84 / 9 / 7 per 100; Anderson control 100/100 when grammar matches | FAIL BP-PARCEL-KEY-01 on counted samples |
| rrc-pipeline-fact | 7,800,628 | UNMEASURED | family present as estimate only |
| cad-parcel-roll | 5,091,280 | UNMEASURED | two key shapes in Q4a (116 vs 84 of 200) |
| zoning-fact | 4,844,552 | UNMEASURED | Q4a three shapes; Q5d typed absence present |
| well-fact | 4,472,458 | UNMEASURED | Q4a discriminator suffix |
| land-use-fact | 4,422,446 | UNMEASURED | Q4a two CAD-year shapes |
| owner-fact | 4,369,766 | UNMEASURED | Q4a two CAD-year shapes; sample access_policy public-paid |
| building-footprint | 3,646,917 | UNMEASURED | Q4c sentinel `primary` 182/200; Q5d typed absence |
| buildable-envelope | 1,544,722 | UNMEASURED | Q4a three shapes matching zoning-fact |
| setback-rule | 821,873 | UNMEASURED | Q4a three shapes |
| code-section | 31,008 | N/A (code grammar, not parcel key) | Q2b edges are this corpus |
| property-boundary-edge | 30,674 | UNMEASURED | Q4a four edge-kind shapes |
| road-node | 27,340 | N/A (`{fips}:road:{osm_id}`) | Q7 sample present |
| code-cross-reference | 5,668 | N/A (code corpus) | family present as estimate only |

Unresolvable bindings COUNTED (Q8a, Q8b), never estimated for the other fact families.

## What R-08 should pick up first

Same order as the yes table: normalize parcel keys (Q4/Q8), stop embedding sentinels in entity_id (Q4c/Q8c), mint canonical keys and feed `externalKeys` (Q5b), write applies-to on property facts (Q2b), feed the verified-absence pair (Q5e). Ledger unmeasured cells are not in this log; they are DC-14 plus the R-09 overlay.

## Confirmations

- Store query this lane: **none**.
- COUNT(*) on atoms this lane: **none**.
- Figures not in the log: **UNMEASURED**, not estimated.
- Input to R-08: this file.

leave_behind: none
