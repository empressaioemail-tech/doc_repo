---
id: 2026-06-11_legacy-design-tools_cc-agent-C_C1_provenance_read_atomid_namespace_fix
title: C1 provenance read atom-id namespace fix — cc-agent-C report
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: report
status: PR-ready — post-deploy canary pending operator
related: [2026-06-11_cc-agent-C_C1_provenance_read_atomid_namespace]
---

# C1 provenance read 500 — atom-id namespace partition fix

## Root cause (confirmed)

`hydrateProvenanceSources(atomIds)` passed the **same unpartitioned** `atomIds` list to both:
- `code_atoms.id IN (...)` — UUID column
- `reasoning_atoms.id IN (...)` — namespaced string column (`reasoning:*`)

Live canary error (San Marcos #2600):

```
ERR: Failed query: select "code_atoms"."id", ...
  where "code_atoms"."id" in ($1)
params: reasoning:irc-2021:irc-r301-2-1
PG: invalid input syntax for type uuid: "reasoning:irc-2021:irc-r301-2-1"
  at hydrateProvenanceSources (artifacts/api-server/src/lib/provenanceEnvelope.ts:65)
GET /api/submissions/7b9c4dcf-4d90-4bf1-8459-4c899d472600/findings  500
```

## Fix location

| File | Lines | Change |
|---|---|---|
| `artifacts/api-server/src/lib/provenanceEnvelope.ts` | 64–78 | New `partitionProvenanceAtomIds()` |
| `artifacts/api-server/src/lib/provenanceEnvelope.ts` | 80–118 | `hydrateProvenanceSources` uses partitioned queries with empty-bucket guards |
| `artifacts/api-server/src/lib/__tests__/provenanceEnvelope.test.ts` | 60–95 | Unit tests for partition (mixed UUID + reasoning) |

## Partition logic

Reuses overlay namespace helpers from `@workspace/codes` (#158):

```typescript
export function partitionProvenanceAtomIds(atomIds: readonly string[]): {
  corpusAtomIds: string[];
  reasoningAtomIds: string[];
} {
  for (const raw of atomIds) {
    if (isReasoningOverlayAtomId(raw)) {
      reasoningAtomIds.push(raw);           // reasoning:*, websearch:*
    } else {
      corpusAtomIds.push(canonicalOverlayAtomKey(raw)); // UUID / did:hauska:code-section:{uuid}
    }
  }
}
```

`hydrateProvenanceSources`:
- Runs `code_atoms` query **only** when `corpusAtomIds.length > 0`
- Runs `reasoning_atoms` query **only** when `reasoningAtomIds.length > 0`
- Preserves original `atomIds` order in returned `sources` and in `buildProvenanceFromFindingRow` lineage (`lineage.atomIds` unchanged — HARD requirement met)

Covers all three architect-facing surfaces backed by this helper: findings list, briefing, code-atom reads.

## Unit test output (verbatim)

```
> vitest run "src/lib/__tests__/provenanceEnvelope.test.ts"

 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/lib/__tests__/provenanceEnvelope.test.ts (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
```

New cases:
- `partitionProvenanceAtomIds routes reasoning ids away from corpus UUID query` — mixed `[UUID, reasoning:irc-2021:irc-r301-2-1, websearch:…]`
- `partitionProvenanceAtomIds normalizes corpus DIDs to lowercase UUID keys`
- `partitionProvenanceAtomIds preserves mixed citation order in lineage buckets`

## CI / typecheck

```
pnpm run typecheck  →  green (workspace + all artifacts)
```

## PR

| Field | Value |
|---|---|
| Branch | `cortex/provenance-read-atomid-namespace` |
| SHA | `65939b5` |
| PR URL | https://github.com/empressaioemail-tech/legacy-design-tools/pull/173 |

## Post-deploy acceptance (pending operator)

After merge → canary redeploy (`ENGINE_SPINE_*` + gate-token secret) → re-run:

```
GET /api/submissions/7b9c4dcf-4d90-4bf1-8459-4c899d472600/findings
```

Expected: **200**, 2 findings, provenance envelope populated (reasoning citations → `unverified-web-source`; corpus → `verified`). No `list submission findings failed`.

Engagement: `6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2` (San Marcos 613 Sturgeon_A, submission #2600).

## Blockers

None in code path. Traffic shift blocked until:
1. This PR merges
2. Canary redeploy + live 200 read verified on #2600
3. `ENGINE_SPINE_*` baked into `cloud-run-deploy.yml`
