---
id: 2026-06-09_hauska-mcp-server_cc-agent-M_gate_citation_lineage
title: Gate citation lineage — HOLD report (P0b + tenant leg gates not cleared)
date: 2026-06-09
agent: cc-agent-M
repo: hauska-mcp-server
kind: recon
status: HELD — not fired
related: [2026-06-09_cc-agent-M_gate_citation_lineage, 2026-06-09_cc-agent-C_atomid_namespace_normalization, 2026-06-07_cc-agent-M_gate_tenant_resolution, 2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit]
---

# Gate citation lineage — HOLD report

**Verdict: HELD. Do not fire.** Both upstream gates from the dispatch remain uncleared as of 2026-06-09 recon against live source.

## Gate status

| Gate | Required by dispatch | Live source status |
|------|---------------------|-------------------|
| **P0b canonical key** | `codex_findings_fetch` normalizes `citations[].atomId` via exported `canonicalOverlayAtomKey` | **NOT landed.** `P:\legacy-design-tools\lib\codes\src\overlayAtomKey.ts` exists as an **untracked** file on branch `lineage/atomid-namespace-normalization` (HEAD = `origin/main` @ `7cc7022`). Not exported from `lib/codes/src/index.ts`. Not consumable by hauska-mcp-server (no `@hauska/codes` package dep). |
| **ADR-005 tenant partition** | `codex_findings_fetch` enforces caller-tenant isolation | **NOT landed.** `src/auth.ts` `AuthContext` has `product` + `tier` only — no `tenant` field. Gate tenant resolution dispatch (`2026-06-07_cc-agent-M_gate_tenant_resolution`) status = **QUEUED**. |
| **56 step 5 sequencing** | Must precede cut consumers to gate | N/A for this recon; dispatch correctly sequenced after P0b. |

## cc-agent-M recon (hauska-mcp-server @ `5d9e10c`, branch `mcp/gate-probe-uptime-2026-06-07`)

### Current Codex finding path — arrow-one-only (confirmed)

| Surface | File | Gap |
|---------|------|-----|
| `codex_finding_generation` | `src/tools.ts` ~743 | Returns `{ generationId, state, alreadyInFlight? }` only. Provenance: synthetic `legacy:finding-generation-run:{uuid}`. No citations. |
| `codex_override_write` | `src/tools.ts` ~801 | Body: `text, severity, category, reviewerComment?` — **no `citations[]`**. `legacy-client.ts` → `overrideFinding` POST body omits citations. |
| `codex_briefing_fetch` | `src/tools.ts` ~887 | Engagement-scoped provenance; no structured per-citation atom array. |
| `cortex_briefing_emit` | `src/tools.ts` ~1309 | **Mis-tag confirmed:** `atomKind: "finding-generation-run"` — should be `"brief-run"` per dispatch item 3. |

### Missing implementations (dispatch scope items 1–5)

1. **`codex_findings_fetch` (P0a)** — not present. No tool registration. `legacy-client.ts` lacks `fetchSubmissionFindings` / `getFindingGenerationStatus`.
2. **Override citation threading (P2, gate half)** — not present. Tool schema and client body have no `citations[]`.
3. **`cortex_briefing_emit` provenance fix** — not applied. `"brief-run"` not in `CodexProvenanceParams.atomKind` union (`src/atom-shape.ts` ~252).
4. **Tenant scoping** — no codex tenant partition infrastructure.
5. **Rail-quiet** — N/A until new tool exists; status endpoint wire includes `invalidCitationCount` / `invalidCitations` which must be **stripped** from gate output per I7.

### Legacy HTTP endpoints (verified in `legacy-design-tools`)

| Endpoint | Route | Wire shape |
|----------|-------|------------|
| `GET /api/submissions/:id/findings` | `findings.ts` ~1292 | `{ findings: FindingWire[] }` with `citations: FindingCitation[]` |
| `GET /api/submissions/:id/findings/status` | `findings.ts` ~1233 | `{ generationId, state, startedAt, completedAt, error, invalidCitationCount, invalidCitations, discardedFindingCount }` |
| `POST /api/findings/:id/override` | `findings.ts` ~1790 | Revision row inserted with **`citations: []`** (line ~1871). `OverrideFindingBody` has no `citations` field (`lib/api-zod/.../overrideFindingBody.ts`). |

Manual-create path (~1434) **does** carry citations via `codeCitation` / `sourceCitation` body fields — the override path does not mirror this.

## cc-agent-C companion status (legacy-design-tools, not fired from this run)

Dispatch item 6 (override route preserves citations) is **not implemented** on `main`:

```typescript
// findings.ts ~1867-1871 (override revision insert)
citations: [] as unknown as Record<string, unknown>[],
```

cc-agent-C must land P2 server-side **in coordination** with gate-side `codex_override_write` citation passthrough. One agent per clone.

## P0b function preview (untracked, not importable)

`overlayAtomKey.ts` on the lineage branch defines:

- `canonicalOverlayAtomKey(rawAtomId)` — UUID ↔ `did:hauska:code-section:{uuid}` collapse; reasoning/websearch pass-through
- `toHauskaCodeSectionDid(atomId)` — DID builder for envelope provenance
- `overlayAtomLookupKey({ jurisdictionTenant, atomId })` — Phase 3 lookup helper

**Blocker:** untracked + unexported + not published. Dispatch P0b says "do not fork" — hauska-mcp-server must **import** this function once P0b PR merges and export path is settled.

## Closure tests — not run (dispatch blocked)

| Test | Status |
|------|--------|
| Generation-persists-citations | **BLOCKED** — no `codex_findings_fetch` |
| Override-via-gate preserves lineage | **BLOCKED** — gate + server override both drop citations |
| Key-space consistency | **BLOCKED** — P0b not landed |
| Tenant scoping (two-tenant fixture) | **BLOCKED** — ADR-005 Layer A QUEUED |
| Rail-quiet | **BLOCKED** — no new tool output schema |

## Planned implementation (fire-ready spec, pending gates)

When P0b merges and tenant resolution lands:

### `legacy-client.ts` additions

```typescript
fetchSubmissionFindings({ submissionId }) → GET /api/submissions/:id/findings
getFindingGenerationStatus({ submissionId }) → GET /api/submissions/:id/findings/status
// overrideFinding: add citations[] to jsonBody
```

### `codex_findings_fetch` tool

- Params: `submission_id` (UUID), optional `include_status` (bool)
- Returns: `data.findings[]` with normalized `citations[].atomId` (P0b), plus `envelope.atoms[]` per cited code-section via `toHauskaCodeSectionDid` (real DIDs, not `legacy:{kind}:{rowId}`)
- Status poll: strip `invalidCitationCount`, `invalidCitations`, `discardedFindingCount` from gate output (rail-quiet)
- Tenant: resolve caller tenant from `AuthContext`; deny cross-tenant submission access

### `codex_override_write` P2

- Add `citations` zod array: `{ kind: "code-section", atomId: string } | { kind: "briefing-source", id, label }`
- Passthrough to legacy POST body (after cc-agent-C extends `OverrideFindingBody`)

### `cortex_briefing_emit` fix

- Change provenance to `brief-run` (extend `CodexProvenanceParams` union or use `briefRunProvenanceEntry` pattern from `atom-shape.ts` ~434)

### Tests (new files)

- `tests/codex-findings-fetch.test.ts` — client wire + envelope normalization fixture
- `tests/codex-override-citations.test.ts` — citations passthrough
- `tests/codex-lineage-closure.test.ts` — key-space consistency + tenant isolation fixtures

## Blockers verbatim

1. **P0b not merged:** `overlayAtomKey.ts` is untracked on `lineage/atomid-namespace-normalization`; not exported; hauska-mcp-server cannot import without forking (dispatch forbids fork).
2. **Tenant leg step 1 QUEUED:** `AuthContext` has no tenant field; two-tenant isolation acceptance test cannot pass.
3. **cc-agent-C P2 server half not started:** override route hardcodes `citations: []`; `OverrideFindingBody` schema lacks `citations[]`.
4. **Branch hygiene:** hauska-mcp-server HEAD is `mcp/gate-probe-uptime-2026-06-07` (clean). Implementation branch should be `lineage/gate-citation-lineage` per dispatch coordination with P0b.

## PR / SHA

**None.** Dispatch not fired. No branch created in hauska-mcp-server.

## Model

Grok Build 0.1 (default per HR-12). No escalation.

## Next action (operator)

1. Merge cc-agent-C P0b (`atomid_namespace_normalization`) — commit + export `canonicalOverlayAtomKey`.
2. Decide export path for gate consumption (npm package vs copied spec with contract test).
3. Clear or sequence tenant resolution (step 1 of sprint 54) before `codex_findings_fetch` tenant acceptance gate.
4. Re-fire this dispatch; cc-agent-M + cc-agent-C coordinate P2 in parallel across clones.
