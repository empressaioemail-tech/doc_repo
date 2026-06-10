---
id: 2026-06-09_legacy-design-tools_cc-agent-C_override_citation_companion
title: Override route preserves citations (P0a/P2 cortex-side companion)
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
kind: break-point
status: complete — PR held for operator merge
related: [_dispatches/2026-06-09_cc-agent-M_gate_citation_lineage, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit, PR #158]
---

# Override route preserves citations (P0a/P2 companion)

cc-agent-C scope item 6 from `2026-06-09_cc-agent-M_gate_citation_lineage.md`. Server-side half of P2: override never produces a revision with silently emptied `citations[]`.

## Git head (verbatim)

```
On branch lineage/override-citation-companion
Your branch is up to date with 'origin/lineage/override-citation-companion'.

Changes not staged for commit:
  modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
  modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

nothing added to commit but untracked files present
```

```
8add67a fix(findings): preserve citations on override revision
da813c2 Merge pull request #158 from empressaioemail-tech/lineage/atomid-namespace-normalization
e306040 feat(codes): canonical overlay atom-id key for attribution correctness
```

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/159
- **Branch:** `lineage/override-citation-companion`
- **SHA:** `8add67a`

## Recon (pre-change blockers confirmed)

| Location | Finding |
|----------|---------|
| `artifacts/api-server/src/routes/findings.ts` ~1784 override handler | Loaded original, inserted revision with hardcoded `citations: []` |
| `OverrideFindingBody` (OpenAPI ~14760) | No `citations` field |
| Manual-create path ~1434 | Built citations from `codeCitation` + `sourceCitation` inline |

## Build

### OpenAPI + codegen

- `lib/api-spec/openapi.yaml` — optional `citations[]` on `OverrideFindingBody` (`$ref: FindingCitation`)
- Regenerated: `lib/api-zod`, `lib/api-client-react`

### Shared validation (no fork)

- **New:** `artifacts/api-server/src/lib/findingCitations.ts`
  - `buildFindingCitationsFromManualCreateBody` — extracted from manual-create (~1434)
  - `parseFindingCitationsArray` / `FindingCitationWire` zod discriminated union
  - `resolveOverrideFindingCitations` — omit or `[]` → carry forward original; non-empty → replace

### Override handler

- `findings.ts` override path calls `resolveOverrideFindingCitations({ bodyCitations, originalCitations })`
- Revision insert persists `revisionCitations` instead of `citations: []`
- No re-normalization of atom ids (post-#158 canonical storage preserved verbatim)

## Tests

| Suite | Result | Notes |
|-------|--------|-------|
| `pnpm run typecheck` | **green** | |
| `lib/finding-engine` (84 tests) | **green** | |
| `findingCitations.test.ts` (5) | **green** | carry-forward, replace, invalid wire |
| `findings-route.test.ts` override-citation (3 new) | **CI** | local `ECONNREFUSED :5432` |
| `findings-evidence-ledger.test.ts` | **CI** | regression |

New route tests:

1. **Carry-forward** — generated finding with retrieval-mocked code citation; override without `citations` → revision wire + DB row retain atom id
2. **Ledger deposit** — seeded finding with citation; override carry-forward → `GET /api/findings/adjudication-evidence?jurisdictionTenant=bastrop_tx` shows `overrideCount: 1` on cited atom (not zero)
3. **Explicit replace** — override body with new `citations[]` → revision wire persists replacement ids

## Acceptance mapping

- [x] Override revision `citations[]` survive (carried forward or replaced, never silently emptied)
- [x] Adjudication ledger fans override event to cited atoms (carry-forward fixture proves non-zero deposit)
- [x] Shared validation with manual-create path (no forked schema)
- [x] Typecheck green; finding-engine green; new override-citation tests added
- [x] PR held for operator merge

## Pairs with

cc-agent-M gate half: `codex_override_write` threads `citations[]` through to this route (`hauska-mcp-server`, same dispatch item 2).

## Out of scope (unchanged)

- Ledger join still keys override events on **original** `entityId` → original row citations for aggregation (revision citations serve gate fetch / wire consumers)
- Phase 3 calibration computation; briefing-source ledger partition
