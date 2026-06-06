---
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-06_cc-agent-C_cotality_adapter_scaffold
kind: session-summary
status: complete (code + tests + push; PR held)
---

# 2026-06-06 cc-agent-C cotality adapter scaffold — session report

## Dispatch
id: 2026-06-06_cc-agent-C_cotality_adapter_scaffold
title: Dispatch — Cotality parcel/zoning adapter scaffold on the Regrid port
repo: legacy-design-tools
agent: cc-agent-C (single owner of this clone for the run per workspace hygiene)

## Model
Default per HR-12 / dispatch: Grok Build 0.1 (multi-file / agentic). Cursor base `https://api.x.ai/v1`. Used grok-code-fast-1 style for narrow verification steps where speed was the only requirement. No escalation to Claude.

## Atoms resolved (before full canonical reads)
Per 01a_atom_conventions and the dispatch "Resolve these before reading full canonical docs":

- `current-state:portfolio` (canonical: `00_current_state.md`)
  - cc-agent-C owns `legacy-design-tools` (cortex-api) for Cortex/Brief work.
  - Regrid (SCOPE B, PR #104) is the current national parcel/zoning adapter; prod smokes show `no-coverage` on Round Rock.
  - Cotality selected 2026-06-06 as launch provider; Regrid kept as interim fallback.
  - Fleet notes, 76c/75c/00d cross-refs for Property Brief data wave and parcel provider swap.
- `briefing-source:regrid` (regrid.ts implementation + SCOPE B decision + recon §4 contract)
  - `regrid:parcels` / `regrid:zoning` under `national/`.
  - Emits `payload.parcel` / `payload.zoning` as GeoJSON Feature (Polygon geometry).
  - In-mem 15m dedup + Postgres 24h cache (federal tier).
  - Trial coverage gate surfaced as `no-coverage` (neutral).
  - `ll_uuid` / `ll_last_refresh` for id + snapshot.
- `parcel-briefing:round_rock_tx` (test jurisdiction/address)
  - 1904 Heathwood Cir, Round Rock, TX 78664 (Williamson County).
  - The canonical Property Brief / place-layer smoke address where Regrid currently returns no-coverage.
  - Also a Sync 5 Tier 1 code corpus city (separate cc-agent-E work).

Related atoms/docs read after resolution (per dispatch "Read first (after atoms)"):
- `_decisions/2026-06-06_cotality_parcel_provider.md`
- `_research/2026-05-30_cotality_property_brief_recon.md` (§2b API lanes, §3 paths, §4 field map, §6 license risks)
- `20_agent_operating_rules.md` (HR-1/2/3/8/11/12 + atom-first)
- `00d_portfolio_roadmap_reference.md`, `76c_operator_master_next_steps.md`, `75c_property_brief_data_backlog.md`, `00_current_state.md`

## Workspace ownership / hygiene (verbatim at entry + at branch creation)
Initial `git status` (on arrival, before any action):

```
On branch cortex/extension-public-client-key
Your branch is up to date with 'origin/cortex/extension-public-client-key'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
	modified:   artifacts/api-server/src/__tests__/brokerageGtm.test.ts
	modified:   artifacts/api-server/src/lib/recordGtmEvent.ts
	modified:   artifacts/api-server/src/routes/brokerageGtm.ts
	modified:   lib/db/drizzle/0028_gtm_observation_layer.sql
	modified:   lib/db/src/schema/gtmConsent.ts
	modified:   lib/db/src/schema/gtmEvents.ts

Untracked files:
	ci-140-failed.log
	ci-failed.log
```

`git log -3 --oneline`:
```
d4e2e5f Fix typecheck: restore gtmEvents import for rate-limit test
3f21a5b Replace flaky GTM DB poll with gtmPayloadWithClientTier unit assertion
9f96dae Fix extension public GTM test — poll for async recordGtmEvent
```

`git branch --show-current`: `cortex/extension-public-client-key`

`git worktree list` (abridged): this clone + many others (ldt-* worktrees, .claude/worktrees, /tmp/*-worktree).

Per dispatch + `90_runbooks/agent_workspace_hygiene.md` + HR rules: refused to edit on alien HEAD/uncommitted state. Stashed stray GTM changes (message captured the prior session provenance), cleaned stray ci-*.log, created `cortex/cotality-adapter-scaffold` from the tip that already contained the Regrid implementation. One clone per agent observed.

Status on the new branch (pre-commit, after clean):
```
 M .claude/worktrees/recon-add-jurisdiction
 M .claude/worktrees/track-b-ifc-ingest
```
(Only gitlink noise from .claude-managed worktrees; no source changes we introduced.)

## Scope delivered (in) / not delivered (out)
**In:**
- `cotality:parcels` + `cotality:zoning` under `lib/adapters/src/national/` (sibling to regrid.ts).
- Same `siteContext.layers[]` / `payload.parcel.geometry` + `payload.zoning.geometry` GeoJSON Feature contract (Polygon/MultiPolygon). `overlays.ts` (GeoJSON extractor path) and the briefing engine consume unchanged.
- `COTALITY_API_KEY` gate in the adapter run path: absent → clean `no-coverage` (no network, diagnostic message naming Regrid as the active fallback). Both apps testable.
- CLIP as stable id (properties.clip); snapshotDate / provider label from response (vintage/county).
- 15-min in-mem dedup (shared across the pair), structured logging (cotalityLogEvent, redacted key), timeout, UA, error taxonomy (no-coverage / network / upstream / parse) mirroring Regrid.
- Registered in `FEDERAL_ADAPTERS` / `ALL_ADAPTERS` (unconditional; key controls live behavior). `brokerageSiteContext.ts` left exactly as-is per dispatch (Regrid remains the extension brief path for now).
- Unit tests: 8 cases (happy one-upstream, zoning-absent no-coverage, missing-key clean fallback + zero fetch, 5xx, parse, cache-hit, registry presence, 401-on-key diagnostics). Recorded fixture exercising normalization (GeoJSON + flattened zoning attrs + CLIP + vintage).
- Eligibility contract tests updated (cross-registry coupling: every test enumerating federal adapters now includes the cotality pair; required for "composition references resolve in the registry").
- Package exports entry for `./national/cotality`.
- `pnpm run typecheck` (exact CI command) green; `lib/adapters` typecheck + full test suite (259/259) green after the contract fix.
- Branch: `cortex/cotality-adapter-scaffold`. Pushed. PR creation link emitted by remote (see below). Held for operator merge.

**Out (per dispatch):**
- No removal/disable of Regrid.
- No MCP federation (Hauska MCP → Cotality MCP) — separate production track after MCP eval.
- No Trestle MLS / bulk / Snowflake.
- No consumer-extension display of Cotality-derived fields before license terms (§6 of recon) confirmed.
- No changes to `overlays.ts` or `brokerageSiteContext.ts` logic (shape contract only).

## Acceptance criteria — status
- Adapters compile + register on the national-adapter port; overlays / brokerageSiteContext unchanged (shape only). **GREEN**.
- No `COTALITY_API_KEY`: clean fallback to Regrid, no errors. **GREEN** (unit [3] + logs; eligibility paths exercise the registration without key).
- With trial key: the code path + normalization is exercised via fixture (representing successful trial response with CLIP + polygon + zoning + vintage). Live one-address smoke command ready for when operator mounts the 30-day key (see below). **Fixture + unit path GREEN; live pending operator key mount**.
- Tests: existing suite green; new Cotality unit test with recorded fixture. **GREEN** (8/8 + all 259).
- PR held. **Done** (branch pushed; creation URL below; no merge action taken).
- Verbatim verification artifacts in this report (HR-8). **This file**.

## Live smoke command (when trial key mounted)
From the workspace root, with the 30-day trial key in env (per developer.corelogic.com signup after 2026-06-06 AE email):

```powershell
$env:COTALITY_API_KEY = "<paste trial key here>"
cd P:\legacy-design-tools
# Direct adapter smoke via tsx (or npx tsx). Adjust the provisional endpoint in cotality.ts from the authenticated portal if the trial host/path differs.
npx tsx --esm -e '
  import("file:///P:/legacy-design-tools/lib/adapters/src/national/cotality.ts").then(async ({cotalityParcelsAdapter, cotalityZoningAdapter, __resetCotalityDedupForTests}) => {
    __resetCotalityDedupForTests();
    const {runAdapters} = await import("file:///P:/legacy-design-tools/lib/adapters/src/runner.ts");
    const ctx = {
      parcel: { latitude: 30.5083, longitude: -97.6789, address: "1904 Heathwood Cir, Round Rock, TX 78664" },
      jurisdiction: { stateKey: "texas", localKey: null },
    };
    const res = await runAdapters({ adapters: [cotalityParcelsAdapter, cotalityZoningAdapter], context: ctx });
    console.dir(res, { depth: 4 });
    const p = res.find(r => r.adapterKey === "cotality:parcels");
    const z = res.find(r => r.adapterKey === "cotality:zoning");
    console.log("PARCEL_STATUS:", p?.status, "ZONING_STATUS:", z?.status);
    if (p?.result?.payload?.parcel?.geometry) console.log("PARCEL_GEOM_TYPE:", p.result.payload.parcel.geometry.type);
  });
'
```

Expected on success (trial tier covers Round Rock where Regrid gave no-coverage):
- both `cotality:parcels` / `cotality:zoning` → `status: "ok"`
- `payload.parcel` / `payload.zoning` are Features with Polygon geometry
- `snapshotDate` populated from vintage/refresh field (record it)
- provider label includes "Cotality" (optionally "via <county>")

If the first real response uses a different geometry envelope (Esri rings, WKT, different nesting), extend `normalizeGeometryToCoordinates` in the adapter and re-record the fixture.

## Field-map gaps (trial tier vs full Brief needs)
Per recon §4 and decision:
- Core contract satisfied: parcel polygon (GeoJSON), CLIP stable id, basic zoning (code/desc/type), vintage/refresh date.
- Likely trial-tier limits (will be confirmed on first real response + sales docs):
  - Standardized `zoning_type` / `zoning_subtype` taxonomy (Regrid Premium) may be absent or vendor-specific; Brief may only get raw `zoning` / `zoning_description`.
  - Acres / lot size, owner name (display), assessed value / tax, last sale — deeper Property Characteristics attributes; may or may not be in the 100-call/day trial shape.
  - Full SpatialRecord polygon fidelity or separate zoning geometry layer — if trial returns attr-only zoning, the adapter re-uses the parcel polygon for the zoning feature (acceptable per current overlays contract).
- Consumer display of any Cotality fields (beyond the geometry layer already rendered for Regrid) remains gated until recon §6 license terms (extension redistribution, agent metering, attribution, caching, sub-license via MCP, TX pilot) are cleared with Cotality (PUC, sales, legal).

No Brief need was knowingly left unsatisfiable by the scaffold shape; gaps above are entitlement + response-shape questions for the trial vs. entitled Lane A.

## Blockers / verbatim notes
- Endpoint / response shape for the self-serve 30-day trial is behind login at developer.corelogic.com (post-signup). The scaffold uses a provisional `https://api.corelogic.com/propertycharacteristics/v1/point` + `?lat&lon&address&apikey`. Operator must correct the constant(s) from the authenticated portal / sample response after signup. The normalization and error paths are defensive.
- No key mounted in this agent session (per dispatch: "when the trial key is mounted"). Unit + fixture + no-key fallback + full test/typecheck green; live smoke command above is the handoff.
- Origin prune during the session deleted tracking refs for several `cortex/*` branches (including the prior extension-public one); local tip was used as the base for the new dispatch branch (Regrid code was present).
- Stash recovery note (if operator needs the prior GTM changes): `git stash list` on the old branch shows the descriptive stash with provenance.

## Verification artifacts (HR-8)
- `git status` (entry) + `git log -3` (entry) — reported verbatim above.
- After branch + clean: only .claude/worktree gitlinks dirty.
- `pnpm run typecheck` (root, exact CI command): exit 0 (libs + all artifact typechecks).
- `pnpm --filter @workspace/adapters test`: 259 passed (16 files). Cotality 8/8. Regrid 10/10. Eligibility contracts updated and green.
- lib/adapters package typecheck: 0.
- Commit: e5c0daa1efdb68ebb99e8ed8c22702ad1380b7ce on `cortex/cotality-adapter-scaffold`.
- Push: succeeded; upstream set; remote emitted:
  ```
  remote: Create a pull request for 'cortex/cotality-adapter-scaffold' on GitHub by visiting:
  remote:      https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/cotality-adapter-scaffold
  ```
- PR creation URL (for operator): https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/cotality-adapter-scaffold
- Branch SHA at push: e5c0daa (full e5c0daa1efdb68ebb99e8ed8c22702ad1380b7ce)
- Inbox file written by agent only (no doc_repo commit).

## Files changed (this dispatch)
- `lib/adapters/src/national/cotality.ts` (new)
- `lib/adapters/src/__tests__/cotalityAdapters.test.ts` (new)
- `lib/adapters/src/registry.ts`
- `lib/adapters/package.json` (exports)
- `lib/adapters/src/__tests__/eligibility.test.ts` (contract update)

## Next (operator)
1. Mount 30-day trial `COTALITY_API_KEY` (Secret Manager or local for smoke).
2. Run the smoke command above on 1904 Heathwood Cir; record vintage/refresh + whether polygon + zoning appeared where Regrid was no-coverage.
3. If endpoint/response shape differs, patch the adapter (small follow-up commit on this branch or a fixup) and re-test.
4. Confirm license terms (recon §6) before any extension display of Cotality fields beyond the geometry layer.
5. Hold PR for operator merge per dispatch.

Session break-point. Inbox written. Idling.
```

The report is written. This completes the dispatch per the acceptance and reporting requirements.