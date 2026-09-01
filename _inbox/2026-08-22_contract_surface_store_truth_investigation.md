---
id: 2026-08-22_contract_surface_store_truth_investigation
title: Contract surface + store truth — verification and fix backlog
status: closed
date: 2026-08-22
operator_approval: 2026-08-22 verbal. Document and investigate before any positioning or product claims ship.
verification_closed: 2026-08-22 — threads A/B/C/D graded; fix backlog remains open.
related:
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md
  - _decisions/2026-08-22_atom_layering_target_state.md
  - _sessions/2026-08-22_records_as_instruments_positioning_claude_code.md
  - 80_adrs/adr_029_building_footprint_and_utility_easement_rails.md
  - 80_adrs/adr_017_atom_access_control.md
---

# Investigation: contract surface claims vs store truth

Date: 2026-08-22  Status: **closed** (verification complete 2026-08-22; fix backlog open)
Operator: Nick 2026-08-22 — document, spin agents, discuss fixes before ship.

## Why this exists

A substrate verification pass nearly shipped wrong claims. ADR-030 captures the ruling; this card tracks **independent re-verification** and the **fix backlog** for discussion. Nothing here is fixed by narration. Each thread needs a file-based instrument or a store query with timestamp.

## Thread A — Temporal / would-affect-edge (dormant, misnamed)

**Claim under test:** `would-affect-edge` is **not** a multi-target "which parcels would a zoning amendment affect" relation. It is a **1:1 immutable edge** (`would_affect` literal) from one `evt_` node to one subject node. No producer, no store rows, no query API. `./temporal` module types are **dormant** (shipped at gate-resolved 1.9.0 and npm 1.22.0; nothing imports in serving repos). **Obligation** atom type (`entity_type: obligation`) is **dormant** with **zero rows** — exported from contract **root barrel only** (no `./obligation` subpath). Forward consequence is **not** a present-tense differentiator.

**Why it matters:** Positioning and ADR drafts were about to lead with forward consequence. That claim is roadmap until producers + rows + query exist.

**Verify:** Read `@empressaio/atom-contract` `./temporal` and edge types; grep hauska-engine, hauska-mcp-server, legacy-design-tools for producers and SELECTs; count store rows by `entity_type` for obligation, would-affect, anticipatory types; check `atom_links` for `would_affect` link types.

**Fix options (discussion only until graded):** Rename or split type; mark unimplemented in contract; ADR amendment; kill slide copy; or fund producer + store path.

| grade | check |
| --- | --- |
| [x] met | Close `_inbox/2026-08-22_thread_a_temporal_edge_close.json`: 1:1 `would_affect` edge cited; **0** obligation / would-affect / anticipatory `atoms` rows (Neon 2026-08-22T20:45Z); **0** temporal imports in engine/mcp/LDT. Thread D reconciled: `./temporal` ships in gate 1.9.0 tarball; classification **dormant** unchanged. |

## Thread B — Access policy dial (two stores, tenant half empty)

**Claim under test:** `hauska_mcp.atoms` holds **~104.1M rows**, **21 entity types** (not 17 / ~100M canon). Access policy split approximately: **99.9M public-free**, **4.25M public-paid**, **~4k platform-internal**, **zero tenant-private**, **zero tenant-shared**. The tenant half of ADR-017's dial has **no rows** in the atoms store. File / publish / collect is a **design** (Smart Files, separate schema/DB), **not present-tense state** on the MCP gate.

**Why it matters:** Tenant-sovereignty and federated custody copy must not read as live on the public atom store. Private-first wedge lives elsewhere until gate path exists (ADR-030 item 5 reversal criterion).

**Verify:** SQL `GROUP BY access_policy` and `entity_type` on `hauska_mcp.atoms` with query timestamp; locate Smart Files / tenant-private storage authority; confirm MCP gate has no `SMART_FILES_*` path.

| grade | check |
| --- | --- |
| [x] met | Close `_inbox/2026-08-22_thread_b_access_policy_close.json`: **104,132,919** rows; **21** entity types; access_policy exact counts (99.9M public-free / 4.25M public-paid / 3,994 platform-internal / **0** tenant); Smart Files authority **snowy-bread-83475727** (16 tenant-private docs); MCP gate **0** Smart Files import matches. File/publish/collect = **design** on gate; armed on Smart Files HTTP only. |

## Thread C — utility-easement (declared type, zero rows, counterparty gap)

**Claim under test:** `utility-easement` ships under **ADR-029** with **zero rows** in store. First American rep (2026-08-19 call, unprompted) said they are still trying to figure out how to extract easement data from images. Our empty type + their unextracted archive = same hole from both ends.

**Why it matters:** Specific counterparty wedge for First American; also explains CC footprint/easement rails staying `not-yet` without inventing coverage.

**Verify:** `SELECT count(*) FROM atoms WHERE entity_type = 'utility-easement'`; read ADR-029 + writer path; find First American quote in `_sessions` or Otter transcript path cited in session close.

| grade | check |
| --- | --- |
| [x] partial | Close `_inbox/2026-08-22_thread_c_utility_easement_close.json`: **0 rows** live Neon 2026-08-22T20:48Z; writer **dormant** (merged, never `--apply`); CC easement **254/254 not-yet**. First American easement quote **SOURCE NOT FOUND** in tracked canon — paraphrase only until Otter filed (C-1). |

## Thread D — atom-contract version gate (reasoning unsound until reconciled)

**Claim under test:** Serving gate resolves **`@empressaio/atom-contract@1.9.0`** while **1.22.0** is published on npm and source `package.json` may read **1.20.0**. Reasoning about gate capabilities from published 1.22 types is **unsound** until lockfile / install / deploy digest reconciled.

**Why it matters:** Every contract-surface audit (including would-affect-edge classification) must run against **what the gate actually imports**, not latest npm.

**Verify:** `npm ls @empressaio/atom-contract` in hauska-mcp-server, hauska-engine, legacy-design-tools deploy trees; image digest → package version; file-based test that fails on drift.

| grade | check |
| --- | --- |
| [x] met | Close `_inbox/2026-08-22_thread_d_contract_version_close.json`: npm **1.22.0** published; gate `hauska-mcp-server-00082-mat` resolves **@empressaio 1.9.0** + **@hauska 1.6.1** (13 minors stale); engine **1.20.0**; cortex-api vendor **@hauska 1.6.0**. Thirteen property types after 1.9.0 invisible to gate runtime. Fix owner: **substrate seat**. |

## Agent dispatches (2026-08-22)

| Lane | Row | Deliverable |
| --- | --- | --- |
| temporal-edge-obligation verify | investig. A | `_inbox/2026-08-22_thread_a_temporal_edge_close.json` |
| access-policy store verify | investig. B | `_inbox/2026-08-22_thread_b_access_policy_close.json` |
| utility-easement verify | investig. C | `_inbox/2026-08-22_thread_c_utility_easement_close.json` |
| contract-version reconcile | investig. D | `_inbox/2026-08-22_thread_d_contract_version_close.json` |

## Standing rules (from ADR-030)

1. Classify every claimed surface: **absent | dormant | starved | armed**.
2. Present tense externally **only** for **armed**.
3. No new atom type without named producer, or mark **unimplemented** in contract.
4. Do not describe file/publish/collect as live until gate serves Smart Files rows.

## Fix backlog (from thread closes)

| id | item | owner | status |
| --- | --- | --- | --- |
| C-1 | File 2026-08-19 First American Otter transcript; extract verbatim easement line | operator | **OPEN** — blocks wedge copy |
| C-2 | Pilot `write-utility-easement-county.mjs` honest-absence `--apply` one county | property | OPEN |
| C-3 | A-020 easement scorer CLI (folds into P-59) | property | OPEN |
| C-4 | Reconcile easement rail triple-declaration (SS-W14 F6) | property | OPEN |
| C-5 | `utility-easement` row-count probe in contract-surface audit instrument | substrate | OPEN |

| D-1 | Collapse hauska-mcp-server to single `@empressaio/atom-contract`; remove `@hauska` dual pin | substrate | **OPEN** |
| D-2 | Bump gate lockfile to ^1.22.0, redeploy `hauska-mcp-server` | substrate | **OPEN** |
| D-3 | hauska-atom-contract source CHANGELOG backfill 1.16–1.22 (or version bump) | substrate | **OPEN** |
| D-4 | Follow-on ADR for contract 1.9.0–1.22.0 (`./property`, `./reasoning`, `./testing`) | substrate / planner | **OPEN** |
| D-5 | `scripts/contract-version-drift.mjs` drift detector (sketched in Thread D close) | substrate | **OPEN** |
| D-6 | legacy-design-tools vendor `@hauska` 1.6.0 → `@empressaio` migration | property | **OPEN** (cortex scope, separate from gate) |

| A-1 | Kill present-tense forward-consequence slide / positioning copy | operator / planner | **OPEN** |
| A-2 | Mark `./temporal` + obligation atom types **unimplemented** in contract (ADR-030 item 3) | substrate | **OPEN** |
| A-3 | Rename or split `would_affect` to kill 1:N misread | substrate | **OPEN** (discussion) |
| A-4 | ADR amendment aligning canon with ADR-030 classification | planner | **OPEN** |
| A-5 | Fund producer + store + query path (only path to armed) | engine / substrate | **OPEN** (roadmap) |

| B-1 | Retire stale canon: 17 entity types / ~100M rows on `hauska_mcp.atoms` | planner | **OPEN** |
| B-2 | File-based heap GROUP BY instrument for `access_policy` + `entity_type` (complete `substrate-verify-query.mjs` or successor) | substrate | **OPEN** |
| B-3 | MCP gate path to Smart Files rows (ADR-030 item 5 reversal criterion) | substrate | **OPEN** (roadmap) |
| B-4 | External copy: tenant custody = two-store explicit; no unified file/publish/collect dial on gate | planner | **OPEN** |

All four verification threads closed. Fix backlog above remains open.

## Finish card

| Thread | grade | evidence |
| --- | --- | --- |
| A temporal / would-affect-edge | **met** | 1:1 `would_affect`; 0 store rows; 0 serving imports; forward consequence roadmap. `_inbox/2026-08-22_thread_a_temporal_edge_close.json` |
| B access policy / tenant | **met** | 104.1M rows, 21 types, 0 tenant on atoms; Smart Files second store; gate no Smart Files path. `_inbox/2026-08-22_thread_b_access_policy_close.json` |
| C utility-easement | **partial** | 0 rows; dormant writer; CC not-yet honest. FA quote not in canon. `_inbox/2026-08-22_thread_c_utility_easement_close.json` |
| D contract version | **met** | Gate 1.9.0+1.6.1 vs npm 1.22.0; 13 property types post-1.9.0 invisible at gate. `_inbox/2026-08-22_thread_d_contract_version_close.json` |
