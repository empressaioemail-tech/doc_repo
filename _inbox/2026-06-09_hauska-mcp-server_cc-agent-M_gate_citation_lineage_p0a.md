---
id: 2026-06-09_hauska-mcp-server_cc-agent-M_gate_citation_lineage_p0a
title: Gate citation lineage P0a (gate half)
date: 2026-06-09
agent: cc-agent-M
repo: hauska-mcp-server
kind: implementation
status: complete — PR held for operator merge
related: [2026-06-09_cc-agent-M_gate_citation_lineage, 2026-06-07_hauska-mcp-server_cc-agent-M_gate_tenant_resolution]
---

# Gate citation lineage P0a (gate half)

## Verdict

**Complete (cc-agent-M scope).** Arrow-two deposit loop gate half closes: agents can fetch persisted finding citations and pass override citations through the MCP gate. PR held for operator merge.

## Recon (starting git state — verbatim)

```
On branch tenant/gate-tenant-resolution
Your branch is up to date with 'origin/tenant/gate-tenant-resolution'.
nothing to commit, working tree clean
c6dc088 feat(tenant): ADR-005 Layer A gate tenant resolution + accessPolicy enforcement
44ccd45 fix(cortex): cortex_briefing_emit provenance class is brief-run (#28)
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
```

Built from `origin/main` @ `4fb0097` (includes #29 tenant resolution + #28 briefing provenance).

### Pre-change gaps (confirmed)

| Item | Before |
|------|--------|
| `codex_findings_fetch` | Missing |
| `fetchSubmissionFindings` / `getFindingGenerationStatus` | Missing in `legacy-client.ts` |
| `codex_override_write` citations | Not in tool schema or POST body |
| `cortex_briefing_emit` provenance | **Done** (#28) — skipped |

## Implementation

### New tool: `codex_findings_fetch`

- **Params:** `submission_id` (UUID), `include_status` (default `true`)
- **Client:** `legacyClient.fetchSubmissionFindings`, `legacyClient.getFindingGenerationStatus`
- **Data:** `findings[]` with `citations[].atomId` **verbatim** (no re-normalize post-#158)
- **Envelope:** `provenanceEntriesFromFindings()` → per-cited code-section DID in `atoms[]`; `reasoning:` / `websearch:` pass through
- **Status (rail-quiet):** exposes `generationId`, `state`, `startedAt`, `completedAt`, `error` only — strips `invalidCitationCount`, `invalidCitations`, `discardedFindingCount`
- **Tenant:** `assertSubmissionPartitionReadable()` using `canReadAccessTarget` from #29; reads optional `jurisdictionTenant` from status/findings wire

### `codex_override_write` P2 (gate half)

- Added optional `citations[]` zod schema (`code-section` | `briefing-source`)
- `legacyClient.overrideFinding` forwards `citations` in POST body
- Override response envelope prefers citation-derived `atoms[]` when returned finding carries citations

### New modules

| File | Role |
|------|------|
| `src/codex-citation-lineage.ts` | Citation wire types, DID mapping (verbatim), envelope provenance |
| `src/codex-submission-tenant.ts` | Submission partition gate (reuses `access-policy.ts`) |

### `legacy-client.ts` additions

```typescript
fetchSubmissionFindings({ submissionId })
getFindingGenerationStatus({ submissionId })
overrideFinding({ ..., citations? })
```

## Closure test outputs

### (1) Generation-persists-citations — PASS

```
fetchSubmissionFindings returns findings[0].citations[0].atomId === CORPUS_UUID (verbatim)
fetchSubmissionFindings returns findings[0].citations[1].atomId === reasoning:fbc-2023:fbc-m601-6
```

### (2) Override-via-gate preserves cited atoms (gate passthrough) — PASS

```
overrideFinding POST body includes citations: [{ kind: "code-section", atomId: CORPUS_UUID }]
```

**Note:** cortex-api override route still inserts `citations: []` until cc-agent-C P2 server half lands. Gate body is ready.

### (3) Key-space consistency — PASS

```
data citation atomId: 550E8400-E29B-41D4-A716-446655440000 (verbatim)
envelope entityId:    550E8400-E29B-41D4-A716-446655440000 (same)
envelope did:         did:hauska:code-section:550E8400-E29B-41D4-A716-446655440000
reasoning id did:     reasoning:fbc-2023:fbc-m601-6 (pass-through)
```

### (4) Tenant scoping — PASS

```
tenant-A (mox-living) + submission mox-living → allowed
tenant-B (bastrop-tx) + submission mox-living → denied
Hauska platform_internal + submission mox-living → allowed
```

### (5) Rail-quiet — PASS

```
data.status keys: generationId, state, startedAt, completedAt, error
absent: invalidCitationCount, invalidCitations, discardedFindingCount, calibrationGrade
```

### Suite

```
npm run lint → exit 0
npm test     → 270 pass, 0 fail
```

## Git artifacts (after commit)

```
On branch lineage/gate-citation-lineage-p0a
4f78454 feat(codex): gate citation lineage — findings fetch + override citations (P0a)
4fb0097 feat(tenant): ADR-005 Layer A gate tenant resolution + accessPolicy enforcement (#29)
44ccd45 fix(cortex): cortex_briefing_emit provenance class is brief-run (#28)
```

**SHA:** `4f78454`  
**Branch:** `lineage/gate-citation-lineage-p0a`  
**PR:** https://github.com/empressaioemail-tech/hauska-mcp-server/pull/30

## cc-agent-C companion (not in this PR)

1. **P2 server half:** `findings.ts` override path must persist `citations[]` from request body (currently hardcodes `citations: []`).
2. **Production tenant gate:** optional `jurisdictionTenant` on `GET .../findings/status` and `GET .../findings` wire envelopes (gate already reads when present; tests mock it).

## Model

Grok Build 0.1 (HR-12 default). No escalation.

## Blockers

None for gate P0a. Full P2 end-to-end override lineage blocked on cc-agent-C override route until companion lands.
