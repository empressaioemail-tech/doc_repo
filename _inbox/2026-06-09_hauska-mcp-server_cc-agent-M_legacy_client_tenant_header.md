---
id: 2026-06-09_hauska-mcp-server_cc-agent-M_legacy_client_tenant_header
title: Legacy-client gate-front tenant headers (54 step 2 follow-up)
date: 2026-06-09
agent: cc-agent-M
repo: hauska-mcp-server
kind: break-point
status: complete — PR held for operator merge
related: [_inbox/2026-06-07_legacy-design-tools_cc-agent-C_gate_front_seam_and_arrow2_phase2, _dispatches/2026-06-07_cc-agent-M_gate_tenant_resolution, 54_tenant_leg_sprint]
---

# Legacy-client gate-front tenant headers

cc-agent-M follow-up to legacy-design-tools PR #160 (gate-front seam). Model: Grok Build 0.1 (HR-12). Closes the gate→engine cross-tenant enforcement gap: `#29` resolves `jurisdiction_tenant` on `AuthContext`; `#160` reads `X-Hauska-Jurisdiction-Tenant` on cortex-api engine entry points; this change makes `legacy-client` send those headers.

## Git head (verbatim)

```
On branch tenant/legacy-client-gate-front-headers
Your branch is up to date with 'origin/tenant/legacy-client-gate-front-headers'.

nothing to commit, working tree clean
```

```
eb33c16 feat(tenant): forward gate-front jurisdiction headers on legacy-client engine calls
4f78454 feat(codex): gate citation lineage — findings fetch + override citations (P0a)
4fb0097 feat(tenant): ADR-005 Layer A gate tenant resolution + accessPolicy enforcement (#29)
```

## PR

- **URL:** https://github.com/empressaioemail-tech/hauska-mcp-server/pull/31
- **Branch:** `tenant/legacy-client-gate-front-headers`
- **SHA:** `eb33c16`

---

## Build

### `src/legacy-client.ts`

| Symbol | Role |
|--------|------|
| `gateFrontScopeHeaders()` | Reads `getCurrentAuthContext()`; emits `X-Hauska-Jurisdiction-Tenant` when `auth.jurisdiction_tenant` present, `X-Hauska-Platform-Internal: true` when `auth.platform_internal` |
| `isGateFrontEnginePath(path)` | Path guard for PR #160 engine entry points |
| `legacyFetch` | Merges scope headers when path matches; `brokerageFetch` inherits via `legacyFetch` |

**Gate-front path coverage (matches #160 seam):**

- `/api/brokerage/v1/brief*`
- `/api/brokerage/v1/place/*`
- `/api/brokerage/v1/workspaces/encumbrances`
- `/api/engagements/:id/site-drainage*`
- `/api/engagements/:id/site-topography*`
- `/api/engagements/:id/encumbrances*`
- `/api/submissions/:id/findings*` (generate, status, fetch)
- `/api/findings/:id/override`

Non-gate-front routes (e.g. `/api/engagements/:id/briefing`, workspace list) **unchanged** — no tenant headers sent.

Anonymous / no-tenant callers: no headers emitted (no `AuthContext` or empty tenant + not platform_internal).

---

## Tests (verbatim)

| Suite | Result |
|-------|--------|
| `npm run lint` | **green** |
| `npm test` | **275/275 green** |
| `tests/legacy-client-gate-front-tenant.test.ts` (5) | **green** |

### Acceptance mapping

- [x] Tenant-scoped `fetchSubmissionFindings` forwards `X-Hauska-Jurisdiction-Tenant: bastrop-tx`
- [x] `platform_internal` forwards `X-Hauska-Platform-Internal: true` on `generateFindings`
- [x] Tenant + internal sends both headers on `generateBrief` (brokerageFetch)
- [x] Anonymous path (no AuthContext): no tenant headers
- [x] Non-gate-front `fetchBriefing`: no tenant headers despite bound tenant context
- [x] Existing suite green — no regressions

---

## Blockers

None.
