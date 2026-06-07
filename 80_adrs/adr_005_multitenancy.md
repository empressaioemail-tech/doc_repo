---
id: adr_005_multitenancy
title: "ADR-005 - Multitenancy (gate tenant resolution + storage invariants)"
status: proposed
last_updated: 2026-06-07
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

### Layer B verification prep (from the 2A schema sync, 2026-06-07)

The WS-1 Phase 2A schema sync confirmed 91 tenant_id columns (source and target exact match) and surfaced 10 public tables with NO tenant_id. They mirror identically on both sides (faithful sync, not drift). For the post-2C multi-tenancy invariant verification (30a WS-4), each is pre-classified here so verification is a checklist, not a fresh investigation. Categories: OK-global (tenancy not applicable), OK-by-FK (tenant reachable through a foreign key), or CANDIDATE (may need tenant_id for isolation; confirm with the schema owner).

| Table | Classification | Rationale |
|---|---|---|
| `users` | OK-global (confirm) | Global auth identities; tenant access via membership/role, not a column. Confirm SmartCity does not need per-tenant user partition. |
| `sessions` | OK-global | Auth session store keyed by user/session id. |
| `page_views` | OK-global | Web analytics; not isolation-critical. |
| `visitor_sessions` | OK-global | Web analytics; not isolation-critical. |
| `work_order_managers` | OK-by-FK | FK to `mygov_work_orders(id)` which carries tenant_id; tenant inherited via the join. A denormalized tenant_id would speed isolation queries but is not required. |
| `activity_logs` | CANDIDATE | Audit/activity should likely be tenant-scoped for per-tenant audit isolation. |
| `chat_messages` | CANDIDATE | If citizen/Compass chat content, this is per-tenant and should be tenant-scoped. |
| `live_chats` | CANDIDATE | Same as chat_messages. |
| `mygov_raw_records` | CANDIDATE | Raw scraper ingest (tenant assigned at normalization to `mygov_work_orders`). Tenant-tagging at ingest would tighten isolation and the retention story (these are the tables that wedged the old Replit Neon). |
| `mygov_raw_sync_pages` | CANDIDATE | Same as mygov_raw_records. |

WS-4 action: confirm the OK-global rows with the schema owner, decide the CANDIDATE rows (add tenant_id + backfill, or accept global with rationale), and run the load smoke test for zero cross-tenant leakage. The raw-table CANDIDATEs intersect the MyGov raw-records growth audit (30a WS-4), so treat tenancy + retention together.

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

- **2026-06-07 (Layer B verification prep):** Added the Layer B verification-prep table classifying the 10 no-tenant_id tables surfaced by the WS-1 Phase 2A schema sync (OK-global / OK-by-FK / CANDIDATE), so the post-2C WS-4 invariant verification is a checklist. tenant_id parity confirmed 91=91 source/target.
- **2026-06-07 (origin):** Scaffolded as the portfolio multitenancy ADR. Unifies the substrate gate tenant model (Layer A) and the SmartCity storage invariants (Layer B) as one partition at two enforcement layers; resolves the slot collision between the planned SmartCity-only ADR-005 and the substrate "ADR-005 multitenancy" references. Status proposed pending operator ratification.
