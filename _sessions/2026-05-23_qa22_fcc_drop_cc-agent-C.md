---
title: QA-22 SCOPE B closeout — drop FCC adapter (cc-agent-C)
date: 2026-05-23
agent: cc-agent-C
repo: legacy-design-tools
kind: session-summary
status: HR-11 inbox drop. Durable copy in legacy-design-tools/_research/.
dispatch: 2026-05-23_cc-agent-C_qa22_fcc_drop
related: [43_cortex_qa_backlog, 2026-05-23_qa22_fcc_recon_cc-agent-C, 2026-05-23_cortex_regrid_evaluation]
---

# QA-22 SCOPE B closeout — drop FCC adapter

PR #96's structured-logging recon proved the FCC BDC v2 endpoint is
Akamai-WAF-gated (server RSTs at ~19s or holds 60s with zero bytes
for any client UA, from both Cloud Run egress AND a workstation
curl). PR #94's 90s timeout + 15-min cache can't help because no
successful response ever arrives. Operator decision 2026-05-23:
drop the FCC adapter.

| Item | PR | Branch |
|---|---|---|
| FCC adapter gated off by default | [#102](https://github.com/empressaioemail-tech/legacy-design-tools/pull/102) | `cortex/qa22-fcc-drop` |

## What landed

**Tiny, surgical** (~180 lines across 6 files, ~half of which are
test-assertion updates):

1. `lib/adapters/src/registry.ts`:
   - New exported `isFccEnabled(env = process.env): boolean`.
     Strict gate — only the literal string `"true"` enables.
     Accidental truthy strings (`"1"`, `"yes"`, `"on"`, `"TRUE"`,
     `"True"`) all stay off so a config typo can't quietly bring
     the WAF-gated adapter back.
   - `FEDERAL_ADAPTERS` spreads in `fccBroadbandAdapter` only when
     `isFccEnabled()` is true at module-init.
2. `lib/adapters/src/federal/fcc-broadband.ts`: top-of-file
   docstring documenting the gate, Akamai WAF root cause,
   `FCC_ENABLED` env flag, link to the prior session summary.
3. `artifacts/design-tools/src/components/engagement-detail/SiteContextTab.tsx`:
   two hardcoded copy strings updated to name the three federal
   layers that actually fire (FEMA flood / USGS topo / EPA
   EJScreen). Comment notes flipping the gate back later requires
   re-adding the FCC clause.
4. `lib/adapters/src/__tests__/registry.test.ts` (NEW): 7 cases
   pinning gate semantics + default-off invariant + no-regression
   guards.
5. `lib/adapters/src/__tests__/eligibility.test.ts`: 4 cases
   updated (the lists that hardcoded `"fcc:broadband"` in
   expected applicable-adapter sets).
6. `lib/adapters/src/__tests__/pilotJurisdictions.test.ts`:
   `FEDERAL_PILOT_LAYER_KINDS` test renamed from "four DA-PI-2
   federal adapters" to "federal trio shipping in the default
   config" — asserts FEMA + USGS + EPA present AND
   `fcc-broadband-availability` NOT present.

## What did NOT change

- **E2E specs** (`federal-layers-render.spec.ts`,
  `federal-summary-chips.spec.ts`) — they seed `briefing_sources`
  rows directly to test the RENDER path, not the runner. FCC
  fixtures still render correctly if a real briefing_sources
  row ever lands with `layerKind: "fcc-broadband-availability"`.
- **API-server generate-layers integration test** — uses fake
  adapters (including a fake `fcc:broadband`) to exercise the
  per-adapter failure-isolation contract. Fakes are independent
  of the real registry binding.
- **FCC-specific unit tests in `federalAdapters.test.ts`** —
  import `fccBroadbandAdapter` directly and run it through
  `runAdapters`. Still pass since the binding is still exported.
- **`runner.ts`** — no changes needed. The runner reads whatever
  adapter list it's handed; gating happens upstream in
  `FEDERAL_ADAPTERS`.

## How the pill goes silent

Step 2 of the dispatch ("don't show it at all (not even as
`no-coverage`)") is satisfied **without any pill-rendering code
changes**:

- The runner produces one outcome per adapter in the passed list.
- The pill renderer iterates outcomes — no outcome means no pill.
- Gate FCC out of `FEDERAL_ADAPTERS` → runner sees no FCC adapter
  → runner produces no FCC outcome → renderer renders no FCC pill.

This is also why the `no-coverage` failure mode doesn't trigger —
`no-coverage` is emitted by the runner when `appliesTo` returns
false for an adapter THAT IS IN THE LIST. With FCC not in the
list, the runner never asks `appliesTo` and never emits a
`no-coverage` outcome either.

## Re-enabling FCC

If a future use case re-emerges (e.g. FCC ships a non-WAF-fronted
programmatic endpoint, or we move to the BDC bulk-download CSV
path), the operator can re-register the adapter by setting
`FCC_ENABLED=true` on the Cloud Run service environment. No code
redeploy required — just a service-config push.

If re-enabled, the operator should also re-add the FCC clause to
the two SiteContextTab copy strings (commented in-line at the
edit sites).

## Verification

- `pnpm --filter @workspace/adapters test` → 234/234 passing
  (227 pre-existing - 4 updated assertions - 1 renamed assertion +
  7 new in `registry.test.ts` + 1 added in
  `pilotJurisdictions.test.ts`).
- `pnpm run typecheck` workspace-wide → all 7 artifacts +
  scripts green.
- Branch off `origin/main` HEAD `4aa3d2a` in isolated worktree
  (`p:/tmp/qa22-fcc-drop`) per workspace-hygiene memory.
- Win32 native-deps workaround applied for install + verify,
  then YAML + lockfile reverted so the committed config stays
  Linux-x64-only.

## Deploy + verification

Operator merge + redeploy required before next Redd retry. Then:

- Force-refresh Generate Layers → expect 4 of 5 layers ok
  (FEMA + USGS + EPA succeed; Grand County parcels/zoning still
  fail per QA-22 SCOPE C until Regrid SCOPE B lands).
- Failed-layer pill list contains zero FCC entries (no pill, not
  even `no-coverage`).
- Cloud Run logs: no `fcc:broadband request start` / `request
  failed` events fire (PR #96's structured logging from the FCC
  adapter only emits when the adapter actually runs).

## Out of scope (held, separate dispatches)

- **Regrid SCOPE B** (cc-agent-C2 territory) — national parcel +
  zoning baseline adapter. Once it lands, Grand County GIS
  per-county adapter becomes opportunistic-only.
- **2D-site-context** (cc-agent-C2 territory) — parallel
  workstream, consumes whatever parcel-geometry contract is in
  place.
- **EPA EJScreen successor** — still operator decision (per
  Cortex prop-intel evaluation PR #100 inbox). EPA Path 1a
  targeted dig on geopub.epa.gov + gispub.epa.gov is teed for a
  future dispatch.
- **Grand County GIS** — operator infra (VPC + Cloud NAT +
  whitelist) deferred; deprecating-as-baseline via Regrid.
- **Phase 3 features** (still deferred behind 2D-site-context).
