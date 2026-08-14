---
id: 2026-08-05_T3_unblock_build_status
title: T3 unblock build status — slot-independent work complete
date: 2026-08-05
status: active
owner: nick
related: [2026-08-05_adr029_rails_rulings, 2026-08-05_T3_slot_independent_build]
---

# T3 unblock build status (planner-verified 2026-08-05)

ADR-029 rulings landed; slot-independent build executed. **Apply still blocked** until master planner releases Slot 1/48021 to T3 after T1 workstream-1.

## Branches

| Repo | Branch | Commit | Merge status | Tests |
|---|---|---|---|---|
| hauska-atom-contract | `feat/adr-029-site-layer-atoms` | `335a462` (main) | **MERGED** PR #11 | **216/216** |
| hauska-engine | `feat/t3-footprint-easement-overlays` | `93e837a` | open — PR pending | apply-guard 3/3; draft-to-instance 5/5 |
| hauska-map | `feat/t3-footprint-easement-overlays` | `a95128b` | open — PR pending | **13/13** overlay; 20/20 atom-chain facets |
| legacy-design-tools | `feat/t3-bff-site-layer-facets` | `033694ff` | open — PR pending | +7 site-layer mapping tests |

## Delivered (slot-independent)

1. **Contract @1.12.0** — merged main; **npm publish HELD** (ADR-028 not in published lineage — see `_inbox/2026-08-05_T3_adr028_publish_gate_verdict.md`)
2. **Ingest CLI** — dry-run + `--apply` mint body (`siteLayerDraftsToInstances` → `writePropertyAtomsBatch`); fail-closed on `T3_SLOT_RELEASED=1` unchanged
3. **Retrieval chain** — `buildingFootprints` / `utilityEasements` slots on atom-chain wire
4. **PE overlays** — gray footprint + violet easement hatch; distinct from SUBJECT amber envelope
5. **Site-plan export** — DXF `BUILDING_FOOTPRINT` + `UTILITY_EASEMENT`; PDF provenance rows
6. **BFF facets (ldt)** — `siteLayerAtomChain.ts` + `brokerageNodeFacets.ts` enrichment from retrieval atom-chain

## Remaining before one-command pilot apply

| Item | Owner | Blocker |
|---|---|---|
| npm publish `@empressaio/atom-contract@1.12.0` | planner | **ADR-028 gate** — or fresh master ruling |
| Merge engine / hauska-map / ldt PRs | planner | PRs not yet opened |
| Full-county dry-run with live BCAD + ML bbox (not fixture fallback) | cc-agent-E | network + optional ML zip cache |
| Deploy engine + PE + ldt after merge | planner | merges |
| Slot release → `--apply` 48021 | master planner | T1 WS1 + explicit release |

## Slot release gate

When T1 workstream-1 completes, master planner sets slot release → T3 runs:

```bash
# After T3_SLOT_RELEASED=1 (master planner slot release only):
pnpm --filter @hauska-engine/engine-core run ingest-site-layers -- \
  --county=48021 --rails=footprint,easement --dry-run --bbox=-97.328,30.1055,-97.325,30.108

# dry-run must match apply exactly, then:
T3_SLOT_RELEASED=1 pnpm ... --apply
```

Then Jones/Higgins area-sweep cert (J1–J12) paired with T1 re-warmed envelopes.
