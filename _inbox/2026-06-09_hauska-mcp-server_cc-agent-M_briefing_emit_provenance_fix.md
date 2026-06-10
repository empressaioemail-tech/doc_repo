---
id: 2026-06-09_hauska-mcp-server_cc-agent-M_briefing_emit_provenance_fix
title: cortex_briefing_emit provenance mis-tag fix
date: 2026-06-09
agent: cc-agent-M
repo: hauska-mcp-server
kind: fix
status: complete — PR held for operator merge
related: [2026-06-09_cc-agent-M_gate_citation_lineage, 2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit]
---

# cortex_briefing_emit provenance mis-tag fix

## Verdict

**Complete.** `cortex_briefing_emit` now tags its provenance envelope as `brief-run`, not `finding-generation-run`. Independent of gate tenant-resolution and gate-citation-lineage work.

## Recon (verbatim)

### Starting git state (accepted)

```
On branch mcp/gate-probe-uptime-2026-06-07
Your branch is up to date with 'origin/mcp/gate-probe-uptime-2026-06-07'.
nothing to commit, working tree clean
5d9e10c Add /healthz, gate probe, and hauska-prod platform observability layer.
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
0842d07 feat(gtm): discoverability docs, place MCP tools, GTM observation (#24)
```

### Mis-tag location (before)

`src/tools.ts` ~1313 — `cortex_briefing_emit` handler:

```typescript
codexProvenance({
  atomKind: "finding-generation-run",  // WRONG for briefing generation
  rowId: response.generationId,
  ...
})
```

### Correct usage elsewhere (unchanged)

| Handler | File | atomKind | Status |
|---------|------|----------|--------|
| `codex_finding_generation` | `src/tools.ts` ~776 | `finding-generation-run` | Correct — not modified |
| `generate_property_brief` | `src/atom-shape.ts` ~434 | `brief-run` via `briefRunProvenanceEntry` | Uses `did:hauska:brief-run:` (Tier 1 path) |

### Provenance builder

`src/atom-shape.ts` → `codexProvenance()` maps `atomKind` → `entityType` and `did: legacy:{atomKind}:{rowId}`. The `CodexProvenanceParams.atomKind` union lacked `"brief-run"` before this fix.

## Changes

| File | Change |
|------|--------|
| `src/atom-shape.ts` | Added `"brief-run"` to `CodexProvenanceParams.atomKind` union |
| `src/tools.ts` | `cortex_briefing_emit` provenance: `"finding-generation-run"` → `"brief-run"` |
| `tests/cortex-briefing-emit-provenance.test.ts` | New — asserts envelope `entityType: "brief-run"`; guards `codex_finding_generation` unchanged |

### After fix (envelope shape)

```json
{
  "atoms": [{
    "did": "legacy:brief-run:{generationId}",
    "entityType": "brief-run",
    "entityId": "{generationId}",
    "source": { "url": "/api/engagements/{id}/briefing/generate" }
  }]
}
```

## Test output

```
npm test
ℹ tests 247
ℹ pass 247
ℹ fail 0
```

New tests:

- `cortex_briefing_emit envelope carries brief-run provenance class` — PASS
- `codex_finding_generation provenance remains finding-generation-run` — PASS

## Acceptance criteria

| Criterion | Result |
|-----------|--------|
| Provenance class correct (`brief-run`) | PASS |
| No other tool provenance changed | PASS — only `cortex_briefing_emit` handler touched |
| Tests green | PASS — 247/247 |
| PR held for operator merge | PASS |
| Branch + SHA reported | See below |

## Git artifacts (after commit)

```
On branch lineage/briefing-emit-provenance-fix
Your branch is up to date with 'origin/lineage/briefing-emit-provenance-fix'.
nothing to commit, working tree clean
62c2d65 fix(cortex): tag cortex_briefing_emit provenance as brief-run
5d9e10c Add /healthz, gate probe, and hauska-prod platform observability layer.
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
```

**SHA:** `62c2d65`  
**Branch:** `lineage/briefing-emit-provenance-fix`  
**PR:** https://github.com/empressaioemail-tech/hauska-mcp-server/pull/28

## Model

Grok Build 0.1 (HR-12 default). No escalation.
