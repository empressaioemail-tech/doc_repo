---
id: 2026-07-23_GATE_C_anti_zombie_close
title: Phase-1 finish — three-orchestrator anti-zombie close (Master WDLL 3.7 / I-A)
status: active
date: 2026-07-23
applies_to: hauska-engine, legacy-design-tools (cortex-api), hauska-map (property-explorer)
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_GATE_C_cutover_close]
owner: nick
---

# Phase-1 finish — THREE-ORCHESTRATOR ANTI-ZOMBIE CLOSE

## Can cut go clean?

**YES** — with named gold-set coverage + honest-decline dialect (not full-county atom bake). PE does not strand Central-TX users with empty cards: landUse/flood can still come from cortex base; envelope is atom-chain or `atom_path_pending` (never invent / never multiply).

## PR URLs + SHAs

| Repo | PR | Merge SHA |
|---|---|---|
| hauska-engine | https://github.com/empressaioemail-tech/hauska-engine/pull/103 | `4f98c9a` (squash) |
| hauska-map | https://github.com/empressaioemail-tech/hauska-map/pull/49 | `3d02cea` (squash); PE prod `dpl_EeCsTju3zBa7MN5oQ76gzVKyomWs` |
| legacy-design-tools | https://github.com/empressaioemail-tech/legacy-design-tools/pull/351 | `75a7b6b` (squash); cortex `cortex-api-00430-hiz` @ 100% |

## Grep evidence (multiply gone)

Live path under `artifacts/api-server/src` (excluding the CI gate test file):

```
MULTIPLY_GONE_LIVE_PATH
```

CI gate: `artifacts/api-server/src/lib/buildableEnvelope/antiZombieConfidence.test.ts` fails if `labeling.confidence\s*\*\s*district.confidence` reappears.

`Tier1FacetPayload` type remains as the bake snapshot shape, but is **not** live envelope product truth: Tier-1/Tier-2 write `atom_path_pending` / `no-zoning-stamp`; `brokerageNodeFacets` strips envelope on the wire (`facets.envelope = null`).

## Coverage (3.12 named gold set)

Ledger: `hauska-engine/packages/engine-core/src/property-reasoning/fixtures/central-tx-gold-coverage-ledger.json`

| Metric | Value |
|---|---|
| Parcels | 8 |
| Atoms written | 16 |
| Zoning / setback / envelope | 8 / 4 / 4 |
| Honest absence | 2 |
| Compute | 21 units, ~3.8s wall; under $1 Neon (I-H) |
| Full-county | deferred (~984k tier1 envelopes in cortex) |

Counties touched: Hays, Bexar, Caldwell, Bastrop, Travis, Williamson.

## Live PE proofs (post Vercel redeploy `dpl_EeCsTju3zBa7MN5oQ76gzVKyomWs`)

| Parcel | X-PE-Read-Path | Result |
|---|---|---|
| `48209:156346` Hays | `atom-chain` | zoning RS, envelope ok |
| `48029:410119` Bexar | `atom-chain` | declined no-zoning-stamp |
| `48453:907247` Travis (was cortex-only) | `atom-chain` | zoning SF-R, envelope ok |
| `48021:33512` Bastrop | `atom-chain` | P-5, no-buildable-area |
| `48055:99991` (no atoms) | `atom-pending` | envelope declined atom_path_pending — **no cortex-fallback** |

## Dual-serve cortex fallback removed?

**YES for envelope product path.** Under `PROPERTY_ATOM_PATH=1`:
- Atom-chain usable → `X-PE-Read-Path: atom-chain`
- Else → cortex baseFacts/landUse/flood may merge, but envelope forced to `atom_path_pending`; header `atom-pending` (not `cortex-fallback`)
- Emergency: `ATOM_PATH_CORTEX_ENVELOPE_ROLLBACK=1` restores raw cortex envelope only when atom path flag is off

Facets route can remain for landUse temporarily; envelope path retired.

## PARTIAL

- Full-county atom bake not done (named gold set + honest-decline by design; ~984k tier1 envelopes remain in cortex Neon as non-product inputs)
- Phase 2 not opened
- Cortex facets landUse path retained temporarily (envelope product path retired)
