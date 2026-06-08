---
id: adr_005_multitenancy
title: "ADR-005 - Multitenancy (gate tenant resolution + storage invariants)"
status: proposed
last_updated: 2026-06-08
applies_to: portfolio
related: [adr_007_cross_stakeholder_atom_access, adr_015_actor_atoms, adr_017_atom_access_control, adr_008_engine_factor_out, 54_tenant_leg_sprint, 30a_smartcity_stabilization_sprint, _prospects/mox/2026-06-07_mox_engagement_plan, 04a_arrow_two_calibration_capture]
owner: nick
---

# ADR-005 - Multitenancy

## Status

**Proposed (scaffold), 2026-06-07.** Authored as the load-bearing input to the tenant leg ([`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md)). This slot was referenced two ways before this scaffold: 30a planned a SmartCity-only `adr_005_smartcity_multitenancy.md` migrated from the pre-docs-repo `45_smartcity_multitenancy_spec.md`, while `00c`, the Mox engagement plan, and CLAUDE.md cite "ADR-005 multitenancy" as the substrate gate tenant model. This ADR unifies both as one concept enforced at two layers, resolving the slot collision. Ratify on operator review.

## Context

Two scoped tenants force the same critical path: Mox (enterprise-customer) and SmartCity/Bastrop (city). Both, plus the brokerage extension, are instances of one shape, a scoped tenant with custom surfaces on the shared gated spine (the scoped-tenant pattern in [`00c_portfolio_master_map.md`](../00c_portfolio_master_map.md) and the Mox substrate-readiness section). The architecture the Mox plan describes is already the substrate architecture; the missing piece is enforcement, not design.

The gap, verified against live source 2026-06-07:

1. **The gate gates by product, not tenant.** `hauska-mcp-server/src/auth.ts` resolves `X-Hauska-Key` to a `product` in `{public, codex, cortex}`. The `AuthContext` carries `tier`, `product`, and rate-limit fields, and no tenant field. A missing key resolves to anonymous public; a malformed or unknown key returns 401. There is no way today for the gate to know which tenant is asking, so there is no way to scope a read to a tenant.

2. **`accessPolicy` is declared but not enforced.** ADR-017 added the layered `accessPolicy` field to the atom contract. It ships as a five-value union (`public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared`) in `@hauska/atom-contract` (published through 1.3.0; `tenant-shared` added in 1.2.0). But no layer filters by it: `hauska-mcp-server/src/tools.ts` treats `accessPolicy` as public-free engine-side, and the visibility tests confirm the field passes through unchanged. ADR-017 named MCP-tools-layer enforcement as an operational commitment; that commitment is unbuilt.

3. **SmartCity carries its own table-level tenancy, disconnected from the substrate.** `empressaio_tech_smartcity_os` has zero `@hauska/*` dependencies and its own `tenant_id` on every table (default 1, Bastrop = 2). It is an island. Bringing it onto the spine is the same work as onboarding Mox.

ADR-017 modeled the access policy and the actor-record tenancy (ADR-015). ADR-007 refined cross-stakeholder construction-lifecycle scoping. Neither one is the runtime tenant resolution and enforcement that turns the declared policy into an enforced partition. That is this ADR.

## Decision

Multitenancy is one concept enforced at two layers. The tenant is the unit of sovereignty; the partition is the guardrail that keeps a tenant's private intelligence private (Mox's operating data, Bastrop's adjudications) while letting the shared ground-truth layer compound across the network.

### Layer A - substrate / gate (the load-bearing layer)

Enforce the partition at the MCP gate so a tenant consumes the shared spine through the gate and can read only what its `accessPolicy` allows.

- **Tenant binding on the key.** The api-keys record gains a tenant binding. Resolving `X-Hauska-Key` yields the tenant alongside the product. `AuthContext` carries the resolved tenant.
- **Tenant modeled as an actor-record atom** per ADR-015 with `tenantKind` (`city | firm | enterprise-customer | internal | public`) per ADR-017. Mox is `enterprise-customer`; SmartCity/Bastrop is `city`.
- **`accessPolicy` enforcement in the MCP tool handlers.** `search_atoms` and `get_atom` and every reasoning tool filter results by the requester's tenant against the atom's `accessPolicy`:
  - `public-free` readable by anyone; `public-paid` by paid tier per `08_tiered_access_model.md`.
  - `tenant-private` readable only by the owning tenant and Hauska.
  - `tenant-shared` readable by the tenants on the atom's shared-with list (cross-tenant benchmarking opt-in).
  - `platform-internal` readable only by Empressa actors.
- **Default policy for newly created atoms** is `tenant-private` scoped to the creating actor's tenant (the conservative default; resolves the ADR-017 open decision).
- **Denied reads return empty or 403 per tool**, with audit logging on denial. The performance budget for enforcement at the tools layer is measured; the ADR-017 reversal path (cached sidecar) stands if query overhead is unacceptable.

### Layer B - storage (the SmartCity instance)

The storage-layer invariants are the same partition expressed in the product database. They migrate from the pre-docs-repo `45_smartcity_multitenancy_spec.md` content and are verified inside the M-Stabilize sprint, not duplicated here.

- Every tenant-scoped table carries `tenant_id NOT NULL`, a foreign key to the tenants table, and an index leading with `tenant_id`.
- No query returns rows from more than one tenant without explicit join logic.
- A two-tenant load smoke test demonstrates zero cross-tenant leakage on production-shape queries.

Layer B is owned by [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md) WS-4 (done criterion 5). This ADR is the canonical home that WS-4 verifies against; the SmartCity `tenant_id` schema is the storage instance of the portfolio partition, not a separate ADR.

### Layer B verification prep (verified against live Empressa Neon, 2026-06-08)

The WS-1 Phase 2A schema sync (2026-06-07) confirmed 91 tenant_id columns (source and target exact match) and surfaced "10" public tables with NO tenant_id. **Re-verified against the live migrated Empressa Neon 2026-06-08 (`information_schema`): the no-tenant_id set is actually 15, not 10** - the 2A review captured only the isolation-review subset. tenant_id parity holds (91 tables with tenant_id). The five not in the original list are all non-isolation-critical: `tenants`, `products`, `platform_admins`, `admin_password_reset_tokens` (global platform tables), and `ticket_messages` (OK-by-FK to `support_tickets`, which carries tenant_id - confirmed). The CANDIDATE set is therefore unchanged at five. For the post-2C invariant verification (30a WS-4), each is classified here so verification is a checklist. Categories: OK-global (tenancy not applicable), OK-by-FK (tenant reachable through a foreign key), or CANDIDATE (may need tenant_id for isolation).

| Table | Live rows (2026-06-08) | Classification | Rationale |
|---|---|---|---|
| `users` | 6 | OK-global (confirm) | Global auth identities; tenant access via membership/role, not a column. |
| `sessions` | 38 | OK-global | Auth session store keyed by user/session id. |
| `page_views` | 1662 | OK-global | Web analytics; not isolation-critical. |
| `visitor_sessions` | 398 | OK-global | Web analytics; not isolation-critical. |
| `tenants` | 2 | OK-global | The tenant registry itself; definitionally global. |
| `products` | 4 | OK-global | Platform product catalog (slug/price/tier); cross-tenant offering list. |
| `platform_admins` | 1 | OK-global | Platform admins with `assigned_states` (cross-tenant by design). |
| `admin_password_reset_tokens` | 0 | OK-global (OK-by-FK) | Auth artifact, FK `admin_id` -> `platform_admins` (global). |
| `work_order_managers` | 42888 | OK-by-FK | FK to `mygov_work_orders(id)` which carries tenant_id; tenant inherited via the join. Denormalized tenant_id would speed isolation but is not required. |
| `ticket_messages` | 0 | OK-by-FK | FK `ticket_id` -> `support_tickets` which carries tenant_id (confirmed live). Empty, so trivial to denormalize if isolation queries want it. |
| `activity_logs` | 3 | CANDIDATE (decide now - empty) | Audit/activity should likely be tenant-scoped. Only 3 rows; adding `tenant_id NOT NULL` + index now is near-zero cost. |
| `chat_messages` | 0 | CANDIDATE (decide now - empty) | Citizen/Compass chat content is per-tenant. Empty table; cheapest possible moment to scope. |
| `live_chats` | 0 | CANDIDATE (decide now - empty) | Same as chat_messages. Empty. |
| `mygov_raw_records` | 8089 / 23 MB | CANDIDATE (tenancy + retention) | Raw scraper ingest (tenant assigned at normalization to `mygov_work_orders`). Actively repopulating post-migration (4059 -> 8089 in ~1h on 2026-06-08). Tenant-tag at ingest; tie to the retention decision below (these are the tables that wedged the old Replit Neon at ~20 GB). |
| `mygov_raw_sync_pages` | 18 / 14 MB | CANDIDATE (tenancy + retention) | Raw HTML page captures (large per-row blobs). Same tenancy + retention treatment as mygov_raw_records. |

WS-4 action: confirm the OK-global rows with the schema owner; scope the three empty CANDIDATEs (`activity_logs`, `chat_messages`, `live_chats`) with `tenant_id NOT NULL` + tenant-leading index; tenant-tag the two raw tables at ingest; then run the two-tenant load smoke test for zero cross-tenant leakage. **Dispatched 2026-06-08** (operator-greenlit): [`_dispatches/2026-06-08_cc-agent-M_ws4_tenant_scope_and_raw_retention.md`](../_dispatches/2026-06-08_cc-agent-M_ws4_tenant_scope_and_raw_retention.md), which folds in the raw retention per [`_decisions/2026-06-08_mygov_raw_retention.md`](../_decisions/2026-06-08_mygov_raw_retention.md) (90d/14d archive-then-drop, gated). Live introspection: [`_research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention.md`](../_research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention.md).

### Relationship to the other tenant-leg ADRs

- **ADR-008 gate-front seam** (per [`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](../_decisions/2026-06-07_adr008_gate_front_seam_scoping.md)) routes engine consumption through the gate, which is where Layer A enforcement runs. Tenant resolution and engine gate-fronting are companion moves.
- **Arrow two** ([`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md)) deposits adjudications into a tenant-partitioned evidence ledger. The Phase 1 ledger already partitions on `jurisdictionTenant`. That partition and this one are the same sovereignty boundary; the tenant-private accessPolicy is the contract-level statement of what the ledger enforces operationally.

## Alternatives considered

**Keep ADR-005 as SmartCity-only and open a new ADR for substrate tenancy.** Rejected on operator review 2026-06-07. Two ADRs for one partition risk the gate story and the storage story drifting apart, and `00c`/Mox/CLAUDE.md already cite "ADR-005 multitenancy" as the substrate model. One ADR, two enforcement layers, keeps the concept coherent.

**Enforce tenancy only at the storage layer (per-product database row filters).** Rejected. The gate is the shared front door for agent consumption; without gate-level enforcement an external agent with a tenant key could read another tenant's atoms directly through the MCP tools. The partition has to hold at the gate, which is the layer the sovereignty claim is sold on.

**Sidecar access-metadata tables outside the atom contract.** Rejected for v1 per ADR-017 (weakens the contract as source of truth, adds a migration tax). Held as the reversal path if tools-layer query overhead proves unacceptable.

## Consequences

Positive:

- The sovereignty claim becomes enforced rather than rhetorical. Mox's private operating flywheel and Bastrop's adjudications are partitioned at the gate, which is the guardrail the partnership-first commitment and the Mox engagement both rest on.
- One coherent partition across the gate, the atom contract, the arrow-two ledger, and the SmartCity schema.
- SmartCity and Mox onboard through the same mechanism; the second tenant is incremental once the first rides it.
- ADR-017's declared `accessPolicy` finally does work.

Negative:

- The MCP tools layer takes on enforcement and an audit-logging surface; query overhead needs measurement against a latency budget.
- The api-keys record and `AuthContext` change, coordinated across the gate and its consumers.
- Cross-tenant `tenant-shared` lists need a management surface (deferred; not v1 load-bearing).

Neutral:

- The partition is reversible at the contract level but becomes a one-way door once external tenants have stabilized against gate-enforced reads. Treat as a one-way door for planning.

## Open decisions

- Performance budget for enforcement at the MCP tools layer; specced at sprint scoping (carries forward the ADR-017 open item).
- Whether the tenant binding lives on the api-keys row directly or in a join to the actor-record atom. Implementation-level; decided in the cc-agent-M dispatch.
- Migration of existing atoms to populate `accessPolicy` correctly (inferred from current ADR-007 scoping or batch-assigned with operator review). The public-free corpus and the platform-internal jurisdictions are the first sort.

## Reversal criteria

Revisit if gate-layer `accessPolicy` enforcement creates unmanageable query overhead, in which case fall back to the cached sidecar per ADR-017. Revisit the one-ADR framing only if a tenant kind emerges whose enforcement model genuinely diverges from the gate-plus-storage pattern.

## References

- [`adr_017_atom_access_control.md`](adr_017_atom_access_control.md) - the `accessPolicy` field this ADR enforces
- [`adr_015_actor_atoms.md`](adr_015_actor_atoms.md) - tenants are actor-record atoms
- [`adr_007_cross_stakeholder_atom_access.md`](adr_007_cross_stakeholder_atom_access.md) - construction-lifecycle refinement of the partition
- [`adr_008_engine_factor_out.md`](adr_008_engine_factor_out.md) + [`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](../_decisions/2026-06-07_adr008_gate_front_seam_scoping.md) - the gate-front seam that Layer A enforcement runs behind
- [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - the sprint that builds this
- [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md) WS-4 - Layer B storage verification
- [`_prospects/mox/2026-06-07_mox_engagement_plan.md`](../_prospects/mox/2026-06-07_mox_engagement_plan.md) - the enterprise tenant that forces this
- `08_tiered_access_model.md` - the Layer 1 / Layer 2 split the public scopes implement

## Revision history

- **2026-06-08 (Layer B re-verified live):** Re-ran the no-tenant_id introspection against the live migrated Empressa Neon. The set is 15, not the 10 from the 2A review; the 5 extras (`tenants`, `products`, `platform_admins`, `admin_password_reset_tokens`, `ticket_messages`) are all non-isolation-critical (4 global + 1 OK-by-FK to `support_tickets`), so the CANDIDATE set holds at 5. Added live row counts; flagged that the three empty CANDIDATEs (`activity_logs`, `chat_messages`, `live_chats`) should be scoped now while trivial. Raw tables actively repopulating (mygov_raw_records 4059 -> 8089 in ~1h); retention teed up in `_research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention.md`.
- **2026-06-07 (Layer B verification prep):** Added the Layer B verification-prep table classifying the 10 no-tenant_id tables surfaced by the WS-1 Phase 2A schema sync (OK-global / OK-by-FK / CANDIDATE), so the post-2C WS-4 invariant verification is a checklist. tenant_id parity confirmed 91=91 source/target.
- **2026-06-07 (origin):** Scaffolded as the portfolio multitenancy ADR. Unifies the substrate gate tenant model (Layer A) and the SmartCity storage invariants (Layer B) as one partition at two enforcement layers; resolves the slot collision between the planned SmartCity-only ADR-005 and the substrate "ADR-005 multitenancy" references. Status proposed pending operator ratification.
