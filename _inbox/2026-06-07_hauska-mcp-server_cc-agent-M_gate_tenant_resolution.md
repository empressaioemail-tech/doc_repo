---
id: 2026-06-07_hauska-mcp-server_cc-agent-M_gate_tenant_resolution
title: Gate tenant resolution + accessPolicy enforcement (ADR-005 Layer A)
date: 2026-06-09
agent: cc-agent-M
repo: hauska-mcp-server
kind: implementation
status: complete — PR held for operator merge
related: [2026-06-07_cc-agent-M_gate_tenant_resolution, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control]
---

# Gate tenant resolution + accessPolicy enforcement (ADR-005 Layer A)

## Verdict

**Complete.** Tenant-leg step 1 landed on branch `tenant/gate-tenant-resolution`. PR held for operator merge. Run migration `004` before deploy.

## Recon (before — verbatim)

### Starting git state (accepted)

```
On branch lineage/briefing-emit-provenance-fix
Your branch is up to date with 'origin/lineage/briefing-emit-provenance-fix'.
nothing to commit, working tree clean
62c2d65 fix(cortex): tag cortex_briefing_emit provenance as brief-run
5d9e10c Add /healthz, gate probe, and hauska-prod platform observability layer.
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
```

Implementation branched from `origin/main` @ `44ccd45`.

### `src/auth.ts` — no tenant on AuthContext (before)

Resolution path for `X-Hauska-Key`:

1. `parseKey(rawKey)` → hash
2. `findKeyByHash(hash)` → `ApiKeyRow`
3. Status / rate-limit checks
4. `req.hauska = { tier, product, key_id, key_hash, rate_limit_id, remaining_* }` — **no tenant field**

Anonymous path: `{ tier: "free_anonymous", product: "public", ... }`.

### `src/tools.ts` — accessPolicy public-free engine-side (before)

`accessPoliciesForTier()`:

- `free_anonymous` → `["public-free"]` forwarded to engine on `list_jurisdictions`
- authenticated tiers → `undefined` (no engine filter)

`search_atoms`, `get_atom`, `query_jurisdiction`, `search_permit_atoms` had **no** post-fetch accessPolicy enforcement.

### `api_keys` schema (before — migrations 001 + 002)

```sql
CREATE TABLE api_keys (
  key_id UUID PRIMARY KEY,
  key_hash TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('free','developer_pro','team','embedder')),
  owner_email TEXT NOT NULL,
  owner_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT
);
-- migration 002 adds:
-- product TEXT NOT NULL DEFAULT 'public' CHECK (product IN ('public','codex','cortex'))
```

## Implementation

### ADR-005 open decision: tenant binding shape

**Chosen:** direct `jurisdiction_tenant TEXT` column on `api_keys` plus `platform_internal BOOLEAN` for Hauska/Empressa operator bypass. Documented here per ADR-005; actor-record DID join deferred.

### Migration `004_api_keys_tenant.sql`

```sql
ALTER TABLE api_keys
  ADD COLUMN jurisdiction_tenant TEXT,
  ADD COLUMN platform_internal BOOLEAN NOT NULL DEFAULT FALSE;
```

### `AuthContext` (after)

```typescript
export interface AuthContext {
  tier: Tier | "free_anonymous";
  product: Product;
  jurisdiction_tenant?: string | null;   // NEW — from api_keys row
  platform_internal?: boolean;           // NEW — Hauska/internal bypass
  key_id?: string;
  key_hash?: string;
  rate_limit_id: string;
  remaining_rpm: number;
  remaining_daily: number;
  request_id?: string;
}
```

Auth middleware now sets `jurisdiction_tenant` and `platform_internal` from the DB row on key hit.

### `src/access-policy.ts` (new)

- `effectiveAccessPolicy()` — unset → `tenant-private` when `jurisdictionTenant` present, else `public-free`
- `canReadAccessTarget()` — five-value enforcement (`tenant-shared` widened locally; `@hauska/atom-contract@1.1.0` ships four values; runtime handles `tenant-shared` for forward compat)
- `filterByAccessPolicy()` — post-fetch filter + `access_policy_denied` audit log

### Tool handlers enforced

| Tool | Enforcement |
|------|-------------|
| `search_atoms` | Post-filter `results[]` |
| `get_atom` | Deny → empty envelope (not-found shape); composition children filtered |
| `query_jurisdiction` | Status gate + `permitAtoms[]` filter |
| `search_permit_atoms` | `permitAtoms[]` filter |
| `list_jurisdictions` | Post-filter `jurisdictions[]` (anonymous engine `public-free` param unchanged) |

### Admin API

`POST /admin/keys` and `PATCH /admin/keys/:id` accept `jurisdiction_tenant` and `platform_internal`.

### Dev mode headers (local testing)

- `X-Hauska-Dev-Tenant` → `jurisdiction_tenant`
- `X-Hauska-Dev-Platform-Internal: true` → `platform_internal`

## Resolution path (after — verbatim)

```
X-Hauska-Key present
  → parseKey → findKeyByHash
  → req.hauska = {
       tier: row.tier,
       product: row.product,
       jurisdiction_tenant: row.jurisdiction_tenant,
       platform_internal: row.platform_internal,
       key_id, key_hash, rate_limit_id, remaining_*
     }

No key
  → free_anonymous path (unchanged): product "public", no tenant
```

## Acceptance criteria

| Criterion | Result |
|-----------|--------|
| Tenant on AuthContext from key | PASS |
| tenant-A private atom NOT returned to tenant-B | PASS (`tests/tenant-isolation.test.ts`) |
| Visible to tenant-A and Hauska/internal | PASS |
| Anonymous + 401 behavior unchanged | PASS — `accessPoliciesForTier` regression; auth paths untouched |
| Latency measured | PASS — see below |
| Suite green + new tests | PASS — 262/262 |
| PR held | PASS |

## Test output

```
npm run lint  → exit 0
npm test      → 262 pass, 0 fail
```

New test files:

- `tests/access-policy.test.ts` — policy matrix + default policy
- `tests/access-policy-latency.test.ts` — overhead benchmark
- `tests/tenant-isolation.test.ts` — cross-tenant isolation + anonymous regression

## Latency measurement (verbatim)

```json
{
  "event": "access_policy_latency_baseline",
  "iterations": 50000,
  "warmup_ms": 0.115,
  "elapsed_ms": 0.558,
  "per_check_ns": 11.2,
  "per_check_us": 0.011
}
```

Post-fetch enforcement adds ~11 ns per atom check (in-process); negligible vs engine RTT.

## Git artifacts (after commit)

```
On branch tenant/gate-tenant-resolution
Your branch is up to date with 'origin/tenant/gate-tenant-resolution'.
nothing to commit, working tree clean
c6dc088 feat(tenant): ADR-005 Layer A gate tenant resolution + accessPolicy enforcement
44ccd45 fix(cortex): cortex_briefing_emit provenance class is brief-run (#28)
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
```

**SHA:** `c6dc088`  
**Branch:** `tenant/gate-tenant-resolution`  
**PR:** https://github.com/empressaioemail-tech/hauska-mcp-server/pull/29

## Deploy note

```bash
npm run migrate   # applies 004_api_keys_tenant.sql
```

Mint tenant keys via admin API with `jurisdiction_tenant` set; set `platform_internal: true` for Hauska operator keys.

## Model

Grok Build 0.1 (HR-12 default). No escalation.

## Blockers

None.

## Unblocks

- Gate-citation-lineage dispatch (P0a+P2) tenant scoping acceptance gate
- Gate-front seam (tenant leg step 2)
- Arrow-two Phase 2/3 tenant-partitioned deposits
