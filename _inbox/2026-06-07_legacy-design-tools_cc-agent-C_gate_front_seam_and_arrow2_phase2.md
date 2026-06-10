---
id: 2026-06-07_legacy-design-tools_cc-agent-C_gate_front_seam_and_arrow2_phase2
title: Gate-front seam + arrow-two Phase 2 outcome capture (54 step 2+3)
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
kind: break-point
status: complete — PR held for operator merge
related: [_dispatches/2026-06-07_cc-agent-C_gate_front_seam_and_arrow2_phase2, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, _inbox/2026-06-07_hauska-mcp-server_cc-agent-M_gate_tenant_resolution]
---

# Gate-front seam + arrow-two Phase 2 outcome capture

cc-agent-C dispatch `2026-06-07_cc-agent-C_gate_front_seam_and_arrow2_phase2.md`. Model: Grok Build 0.1 (HR-12). **SR-1:** Part A + Part B bundled in one PR (shared `jurisdictionTenant` contract).

## Git head (verbatim)

```
On branch tenant/gate-front-seam-arrow2-phase2
Your branch is up to date with 'origin/tenant/gate-front-seam-arrow2-phase2'.

Changes not staged for commit:
  modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
  modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

nothing added to commit but untracked files present
```

```
a9f965d feat(tenant): gate-front seam + arrow-two Phase 2 outcomes
d618db5 Merge pull request #159 from empressaioemail-tech/lineage/override-citation-companion
8add67a fix(findings): preserve citations on override revision
```

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/160
- **Branch:** `tenant/gate-front-seam-arrow2-phase2`
- **SHA:** `a9f965d`

---

## Part A — Recon (verbatim seam shape before)

`brokerageServiceAuth.ts` (`requireBrokerageAuthOrServiceToken`):

```typescript
if (timingSafeStringEqual(provided, getServiceApiKey())) {
  req.serviceAuth = { tenantId: DEFAULT_TENANT_ID };
  req.brokerageServiceCaller = true;
  next();
  return;
}
```

No `jurisdictionTenant` on service auth; engine routes (site-drainage, site-topography, encumbrances, findings/generate) had **no** service-auth middleware.

## Part A — Build

### Shared seam (`gateFrontSeam.ts`)

| Symbol | Role |
|--------|------|
| `GATE_JURISDICTION_TENANT_HEADER` | `x-hauska-jurisdiction-tenant` |
| `GATE_PLATFORM_INTERNAL_HEADER` | `x-hauska-platform-internal` |
| `buildGateServiceAuth(req)` | `{ tenantId, jurisdictionTenant, platformInternal }` on `req.serviceAuth` |
| `assertServiceTenantScope` | Cross-tenant deny for service callers |

### Middleware

- `gateEngineServiceAuth.ts` — dual-path bearer OR browser session (same posture as L-surface)
- `serviceAuth.ts` + `brokerageServiceAuth.ts` — now call `buildGateServiceAuth` (tenant header forwarded)
- `requireBrokerageExtensionAuthUnlessService` — workspace encumbrances no longer 401 after parent service auth

### Engine entry points covered

| Surface | Auth | Tenant carry |
|---------|------|--------------|
| `POST/GET /api/brokerage/v1/brief*` | existing `requireBrokerageAuthOrServiceToken` | header → `serviceAuth` |
| Place hydrology `/api/brokerage/v1/place/*` | parent brokerage auth | `ensureMcpPlaceEngagement({ jurisdictionTenant })` → `cortexJurisdictionKey` |
| Workspace encumbrances | service bypass for install-id + dev-client gates | service path list/upload |
| `/api/engagements/:id/site-drainage*` | `requireGateEngineServiceAuth` | `assertEngagementServiceTenantScope` |
| `/api/engagements/:id/site-topography*` | same | same |
| `/api/engagements/:id/encumbrances*` | same | same |
| `/api/submissions/:id/findings/generate` | findings router `requireGateEngineServiceAuth` | `assertSubmissionServiceTenantScope` |

Extension install-id + brokerage dev key paths **unchanged**.

Contract doc: `artifacts/api-server/README-brokerage-mcp-service.md` (tenant headers added).

---

## Part B — Recon (Phase 1 ledger)

`atomAdjudicationEvidenceLedger.ts` — joins `atom_events` finding mutations to `findings.citations[].atomId`, partitioned by `jurisdictionTenant` from `engagements.cortexJurisdictionKey` / `keyFromEngagement`.

## Part B — Build

- Event type: `finding.outcome.recorded` (`FINDING_EVENT_TYPES[5]`)
- Outcome kinds: `permit-approved`, `variance-granted`, `comment-resolved`
- `POST /api/findings/:findingId/outcome` — internal audience OR service bearer; append-only via `EventAnchoringService`
- `GET /api/findings/outcome-observations?jurisdictionTenant=&findingAtomId=` — internal + service read
- Payload carries `jurisdictionTenant` for Phase 3 partition; no corpus / immutable atom mutation

---

## Tests (verbatim)

| Suite | Result |
|-------|--------|
| `pnpm run typecheck` | **green** |
| `gateFrontSeam.test.ts` (4) | **green** |
| `gateEngineServiceAuth.test.ts` (3) | **green** |
| `brokerageServiceAuth.test.ts` + `serviceAuth.test.ts` (10) | **green** |
| `lib/finding-engine` (84) | **green** |
| `finding-outcome.test.ts` (3) | **CI** (local `ECONNREFUSED :5432`) |

---

## Acceptance mapping

- [x] Seam reaches named engine entry points carrying tenant
- [x] Brief + extension install-id paths unchanged
- [x] Outcome attaches to finding, tenant-partitioned, append-only, no corpus change
- [x] Tests added + typecheck green
- [x] PR held for operator merge

## Follow-up (cc-agent-M, out of scope here)

Gate `#29` resolves `jurisdiction_tenant` on `AuthContext`; legacy-client should send `X-Hauska-Jurisdiction-Tenant` on every `legacyFetch` / `brokerageFetch` call so cross-tenant scope enforcement is live end-to-end.

## Blockers

None.
