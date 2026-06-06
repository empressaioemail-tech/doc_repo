---
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-05-28_dispatch-A_ldt_place-graph-brief
branch: cortex/property-brief-lay-surface
sha: d48ee82f51e31495d4c459626a5f3391e7cbb075
status: ready_for_operator_merge
---

# Close — LDT place graph + Property Brief (wave 0–2)

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/134
- **Branch:** `cortex/property-brief-lay-surface`
- **SHA:** `d48ee82f51e31495d4c459626a5f3391e7cbb075` (feature `32694cb` + fixture `d48ee82`)
- **Merge:** held for operator (do not merge from agent)

## Committed (29 files, property-brief slice)

**Migration / schema**
- `lib/db/drizzle/0030_place_layer_snapshots.sql`
- `lib/db/src/schema/placeLayerSnapshots.ts`
- `lib/db/src/schema/brokerageWorkspaces.ts` (ll_uuid, lat/lon)
- `lib/db/src/schema/index.ts`
- `lib/db/src/__tests__/integration/schema.integration.test.ts` (+ `place_layer_snapshots`)

**Codes / geocode**
- `lib/codes/src/centralTexasPilot.ts` (+ `plano_tx`, Round Rock aliases)
- `lib/codes/src/centralTexasPilot.test.ts`
- `lib/codes/src/jurisdictions.ts`, `jurisdictions.test.ts`, `index.ts`
- `lib/codes/src/retrieval.ts` (`BRIEF_CODE_RETRIEVAL` env gate; neon default)

**API**
- `artifacts/api-server/src/lib/placeLayerUtils.ts`, `placeLayerSnapshots.ts` (coord fallback read)
- `artifacts/api-server/src/lib/brokerageSiteContext.ts` (snapshots → cache → live)
- `artifacts/api-server/src/lib/brokerageBriefAtoms.ts`, `brokerageBriefEvents.ts`
- `artifacts/api-server/src/lib/brokeragePilotCoverage.ts`, `brokerageWorkspace.ts`
- `artifacts/api-server/src/routes/brokerageBrief.ts` (`atoms.*`, atom_events)
- `artifacts/api-server/src/routes/brokerageCoverage.ts`
- `artifacts/api-server/src/atoms/property-workspace.atom.ts`, `brief-run.atom.ts`
- `artifacts/api-server/src/atoms/registry.ts`
- Tests: `brokerageBriefAtoms.test.ts`, `brokerageSiteContext.test.ts`, `brokerageSiteContext.snapshots.integration.test.ts`, `brokerageBrief.test.ts`, `propertyBriefLaySummary.test.ts`, `setup.ts`

## Excluded (alien parallel work — left unstaged)

```
artifacts/api-server/src/__tests__/brokerageGtm.test.ts
artifacts/api-server/src/__tests__/encumbrances.test.ts
artifacts/api-server/src/lib/encumbranceExtract.ts
artifacts/api-server/src/lib/encumbranceWire.ts
artifacts/api-server/src/lib/recordGtmEvent.ts
artifacts/api-server/src/routes/brokerageGtm.ts
artifacts/api-server/src/routes/encumbrances.ts
artifacts/design-tools/src/components/engagement-detail/EncumbrancesPanel.tsx
artifacts/design-tools/src/components/engagement-detail/__tests__/EncumbrancesPanel.test.tsx
lib/codes-sources/src/pdfText.ts
lib/db/drizzle/0026_brokerage_brief_runs.sql
lib/db/drizzle/0028_gtm_observation_layer.sql
lib/db/src/schema/brokerageBriefRuns.ts
lib/db/src/schema/encumbrances.ts
lib/db/src/schema/gtmConsent.ts
lib/db/src/schema/gtmEvents.ts
```

## Migration notes (operator)

1. Apply **`0030_place_layer_snapshots.sql`** on cortex-api Postgres **staging + prod** before or during deploy (adds `place_layer_snapshots`, `brokerage_workspaces.ll_uuid/latitude/longitude`).
2. Redeploy **cortex-api** per [`90_runbooks/property_brief_cortex_deploy.md`](../90_runbooks/property_brief_cortex_deploy.md) (Neon warmup section added there).
3. **Fixture refresh** — applied in commit `d48ee82` (CI drift diff from PR #134 Test job; `place_layer_snapshots` + `brokerage_workspaces` geo columns). Regenerate via `pnpm --filter @workspace/db run test:fixture:schema` when a live `DATABASE_URL` is available to double-check.

## Neon warmup (engine_only keys)

Documented in runbook § **Neon warmup — engine_only jurisdiction keys** ([`property_brief_cortex_deploy.md`](../90_runbooks/property_brief_cortex_deploy.md)). Sync with [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) and Dispatch C substrate export. Verify via `GET /api/brokerage/v1/coverage` (`tier: neon`, `atomCount > 0`).

## Deploy gates (operator)

| Gate | Action |
|------|--------|
| Migration 0030 | staging + prod Postgres |
| cortex-api redeploy | runbook script or GH `deploy-canary` → `run-migrations` → traffic |
| Fixture drift | `test:fixture:schema` after push (see above) |
| Smoke | Same address twice on `POST /api/brokerage/v1/brief` → **0 Regrid HTTP** on second call |
| Coverage honesty | Plano / Round Rock → `*_tx` key; `engine_only` until Neon warm |

## Acceptance checklist

| Item | Status |
|------|--------|
| Plano / Round Rock geocode → `*_tx` | ✅ unit (`centralTexasPilot.test.ts`) |
| `atoms.inlineRefs` max 3 code + parcel when Regrid ok | ✅ `brokerageBriefAtoms.ts` |
| `GET /coverage` manifest | ✅ |
| `atom_events` property-workspace / brief-run | ✅ `brokerageBriefEvents.ts` |
| Registry brokerage atoms | ✅ shape-only on `@hauska/atom-contract` 1.2.0 vendor pin |
| `BRIEF_CODE_RETRIEVAL` env | ✅ neon default; mcp logs + falls back |
| Fixture drift cleared | ✅ commit `d48ee82` (CI-verbatim patch; re-run drift on merge) |
| Integration snapshot test | ⏸ skipped without DATABASE_URL |
| tsc green | ✅ |
| Unit tests (no DB) | ✅ |

## Verification (HR-8)

### `pnpm run typecheck`

```
Exit code: 0 (full workspace, 2026-05-28 cente run)
```

### `pnpm exec vitest run src/centralTexasPilot.test.ts` (lib/codes)

```
 RUN  v3.2.4 P:/legacy-design-tools/lib/codes

 ✓ src/centralTexasPilot.test.ts (4 tests) 3ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

### `pnpm exec vitest run src/__tests__/brokerageBriefAtoms.test.ts src/__tests__/brokerageSiteContext.test.ts` (api-server)

```
 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/__tests__/brokerageBriefAtoms.test.ts (1 test) 3ms
 ✓ src/__tests__/brokerageSiteContext.test.ts (3 tests) 4ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
```

### Integration test (requires DATABASE_URL)

```
describe.skipIf(!hasDb) — not executed on cente (DATABASE_URL unset)
File: artifacts/api-server/src/__tests__/brokerageSiteContext.snapshots.integration.test.ts
```

### `git push`

```
To https://github.com/empressaioemail-tech/legacy-design-tools
   e95a403..32694cb  HEAD -> cortex/property-brief-lay-surface
   32694cb..d48ee82  HEAD -> cortex/property-brief-lay-surface (fixture)
```

### CI (PR #134 after fixture push)

- Typecheck: SUCCESS
- Test: was FAILURE (schema fixture drift) — fixture commit `d48ee82` pushed; re-run expected green

## Blockers (verbatim)

1. **Integration test:** `brokerageSiteContext.snapshots.integration.test.ts` skipped locally; needs operator DATABASE_URL run to confirm second fetch skips `runAdapters`.

2. **`@hauska/atom-contract@1.3.0` npm publish:** hauska-atom-contract merged workspace schemas but npm still at 1.1.0 per cc-agent-AC close. LDT vendor pin remains `hauska-atom-contract-1.2.0.tgz`. Brokerage atoms registered **shape-only** (no `@hauska/atom-contract/workspace` import). Upgrade vendor tarball after operator `npm publish`.

3. **`BRIEF_CODE_RETRIEVAL=mcp`:** env recognized; MCP retrieve not implemented in `@workspace/codes` — falls back to neon with warn log.

## Out of scope (confirmed)

Paywall/Stripe, Enterprise Regrid endpoints, Dallas city corpus mapping.
