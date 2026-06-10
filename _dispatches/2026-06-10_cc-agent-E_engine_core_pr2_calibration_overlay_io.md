---
id: 2026-06-10_cc-agent-E_engine_core_pr2_calibration_overlay_io
title: Dispatch — engine-core PR2, calibration overlay I/O + site-topo derivation (recon-first on the data layer)
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: FIRE-READY — cc-agent-E free after A2/PR #70; runs in parallel with cc-agent-C's B1/B2/auth; lands before C1's cortex-api removal step
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 04a_arrow_two_calibration_capture, 57_national_code_warming_sprint, 80_adrs/adr_005_multitenancy, _inbox/2026-06-07_hauska-engine_cc-agent-E_engine_lift_engine_core, 20_agent_operating_rules]
---

# Engine-core PR2 — calibration overlay I/O + site-topography derivation

> A2 (PR #70) was PR1 of a multi-PR lift: it landed the reasoning engines + pure calibration math, but **deferred the calibration overlay I/O** (`overlay.ts` / `signals.ts` / `attribution.ts`) because it needs `@workspace/db` + `@workspace/codes` repository ports, and the site-topography derivation orchestration. This PR2 finishes the engine-core cargo so C1 (the cortex-api cut) can remove cortex-api's engine code without stranding the arrow-two deposit/read path. **There is a real architecture question here — which store the spine overlay I/O targets — so this dispatch is recon-first: report before building.**

You are **cc-agent-E**, single owner of `P:\hauska-engine`. Model: **Grok Build 0.1** (`https://api.x.ai/v1`); escalate to Claude only on failure after retry, log it. Branch prefix `engine/`. (The primary clone is dirty on the orphaned `chore/retrieval-api-healthz` — use a worktree; that branch's PR #68 is already merged, so the dirt is safe to discard or ignore.)

## Read first

1. [`_inbox/2026-06-07_hauska-engine_cc-agent-E_engine_lift_engine_core.md`](../_inbox/2026-06-07_hauska-engine_cc-agent-E_engine_lift_engine_core.md) — A2/PR1; the "Deferred to follow-on PR" section is the cargo list
2. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) — the overlay keyed `(atomId, jurisdictionTenant)`, tenant-sovereignty partitions, asserted/calibrated split, cold-start fallback
3. [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) — the field contract; source-set-drift invalidation; rail-quiet
4. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — the what-moves table; the "corpus may split toward the retrieval layer" note that this recon resolves
5. The PR1 landing: `packages/engine-core/src/calibration/` (pure math) + the cortex-api originals (`lib/engine-core/` overlay/signals/attribution) being lifted
6. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Recon FIRST (read-only, report before building)

The load-bearing question: **which database does the spine engine-core overlay I/O read and write?** Migration `0037` (`atom_calibration_overlay`, keyed `(atomId, jurisdictionTenant)`) was applied to the cortex/legacy-design-tools DEPLOYMENT Neon, not a spine store. Engine-core is now on the spine. Report, with evidence:
- Where the `atom_calibration_overlay` table physically lives today (the cortex deployment Neon) and what reads/writes it (the cortex-api adjudication ledger + Phase-3 compute).
- What DB access the spine has (retrieval-api's substrate Neon from #68; any engine-api DB binding).
- The two candidate topologies and a recommendation: (A) the spine engine-core reads/writes the cortex deployment Neon via a repository port (overlay stays one table, one store; the spine reaches across); or (B) the overlay moves toward the spine/retrieval store and cortex-api reaches it through the gate. Recommend one with reasoning, honoring: the corpus stays rebuilt-immutable; calibration is spine substrate served through the gate; tenant sovereignty partitions are enforced wherever the table lives; and arrow-two's deposit loop (gate-independent server-side ledger join) is not broken by the move.

**STOP after recon and report if the topology choice is non-obvious or would change the C1 cut.** Do not silently pick a cross-DB design that the planner/operator has not seen.

## Scope (after recon clears)

1. **Lift the overlay I/O** (`overlay.ts`, `signals.ts`, `attribution.ts`) into `packages/engine-core` with the repository ports the recon settled, preserving: the `(atomId, jurisdictionTenant)` key; the asserted/calibrated split (asserted owned by cold-warm, calibrated by Phase 3); cold-start fallback to asserted (never zero); source-set-drift invalidation (all three stamp fields); the tenant-sovereignty partitions (public `__public__` / tenant-private / tenant-shared, no-pool); within-partition adaptive grain; attribution coverage. Behavior-parity tests against the cortex-api originals (the Phase-3 `a431e8e` no-pool fixtures must still pass).
2. **Rail-quiet (HARD):** the calibration grade stays out of any engine-api response that feeds a buyer-facing surface; expose calibration to internal/cortex routes only, per the existing boundary.
3. **Site-topography derivation module** — lift the derivation logic the PR1 report deferred; the contour ingest orchestration (DB/GCS/atom events) stays in the cortex BFF, only the derivation/3DEP-consuming compute moves.
4. Do NOT modify cortex-api (that is the paired cc-agent-C C1 cut); do NOT deploy.

## Acceptance criteria

- Recon report filed: the overlay-store topology question answered with evidence + a recommendation; built only after the topology is settled (or stopped-and-reported if non-obvious).
- Overlay I/O in `packages/engine-core` with the key, the asserted/calibrated split, cold-start fallback, source-set-drift invalidation, and the tenant-sovereignty no-pool partitions all preserved; the Phase-3 no-pool fixtures pass.
- Rail-quiet: calibration grade absent from buyer-facing engine-api responses.
- Site-topo derivation lifted; contour ingest orchestration left in the BFF.
- Behavior-parity green; CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_hauska-engine_cc-agent-E_engine_core_pr2_calibration_overlay_io.md`: the recon (the store-topology answer + recommendation), the parity-test output (no-pool fixtures verbatim), the rail-quiet confirmation, PR URL + SHA, and blockers verbatim.
