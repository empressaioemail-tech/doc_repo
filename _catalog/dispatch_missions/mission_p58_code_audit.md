You MAY spawn one sub-agent for hauska-map vs LDT split read. Sub-agents MUST NOT commit. You MUST NOT edit product code. You MUST NOT deploy. You MUST NOT atoms --apply. Read-only code in property worktrees or main clones.

Plan row P-58. Occupancy: doc_repo `_inbox/` JSON only.

WDLL: `_inbox/2026-08-22_atom_full_surface_WDLL.md` items 3, 5.

## Mission

Produce the post-SERVE code-truth matrix for all fifteen property-spine families.

### Per family row

```json
{
  "family": "rrc-pipeline-fact",
  "engineWriter": "path + railEngineBinding line",
  "cortexRead": "file:line or NONE",
  "peInspect": "file:line or NONE",
  "peMapLayer": { "registryKey": "texas-rrc", "live": false, "file": "layer-registry.js:line" },
  "ccRailKey": "rrc-pipelines",
  "scorerPath": "file or NONE (A-020 unspecified)",
  "gapClass": "scorer-missing | map-dormant | inspect-wired | bake-not-atom | codex-hold | done",
  "serveWave": "P-49 | pre-SERVE | HOLD"
}
```

### Required reads

- `packages/map-renderer/src/layer-registry.js` (or current path in hauska-map main)
- `apps/property-explorer/src/browse/InspectCard.tsx` ROW_SPECS
- `artifacts/api-server/src/routes/brokerageNodeFacets.ts` and `*FactRead.ts` files on LDT main
- `artifacts/api-server/src/countyRailScoreCli.ts` + `RAIL_SCORING_DECLARATION` / `RAIL_ENGINE_BINDINGS`
- `apps/command-center/.../countyManifestTypes.ts` — confirm CC derives rails from GET only

### Gap backlog

Write `_inbox/2026-08-22_atom_full_surface_gap_backlog.json`:

- Ranked list with `blockedBy`, `planRowProposal` (P-59 scorer, P-60 map, P-61 land-use, P-62 CC parity)
- Explicit: CC columns that cannot move until P-59
- Explicit: map layers that are inspect-only today after P-48..P-54

Compare against `_inbox/2026-08-21_s2-family-scout_close.json` and note every row that changed after SERVE.

## Return

CP1: scope + family list. CP2: adversarial review (did we miss a consumer?). CLOSE: `_inbox/2026-08-22_p58_code_audit_close.json` + gap backlog. No live GET required (P-57 owns live). Do not start implementation.
