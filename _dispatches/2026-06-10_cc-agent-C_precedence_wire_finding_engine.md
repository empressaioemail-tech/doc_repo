---
id: 2026-06-10_cc-agent-C_precedence_wire_finding_engine
title: Dispatch — wire precedence reconciliation into the production finding path (S1)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — pre-launch soft-gate; folds into the C1 Cortex cut (sprint 58)
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 03a_positioning_framework, 80_adrs/adr_021_constraint_resolution_and_precedence, _decisions/2026-06-10_precedence_hero_path_s1_prelaunch, _inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon, 20_agent_operating_rules]
---

# Wire precedence reconciliation into the production finding path (S1)

> The precedence recon ([`_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md)) found that `reconcileStandardPrecedence` exists as a library primitive but is **never called in production** — `engine.ts` does not invoke it, so live multi-standard findings are LLM-improvised. The operator decided (2026-06-10) the reconciliation line is a HERO GTM path for the Texas launch, so wiring it into the production finding path is promoted from fast-follow to a **pre-launch soft-gate** ([`_decisions/2026-06-10_precedence_hero_path_s1_prelaunch.md`](../_decisions/2026-06-10_precedence_hero_path_s1_prelaunch.md)). This is recon slice **S1** (small). The gate-tool exposure (S2) is a SEPARATE fast-follow dispatch after the A2 engine-core lift. This S1 folds into the C1 Cortex cut so it lands on the cut finding path, not a soon-to-move surface.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone. Model: **Grok Build 0.1** (multi-file/agentic); escalate to Claude only on failure after retry, log it. Branch prefix `cortex/`.

## Read first

1. [`_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md) — the recon; §3 case table + §5 slice S1 are the spec source
2. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the launch gate; C1 is where this folds
3. [`03a_positioning_framework.md`](../03a_positioning_framework.md) — the positioning line this makes true
4. The primitive: `lib/finding-engine/src/precedence/` (`reconcile.ts` → `reconcileStandardPrecedence` / `reconcileRequirementsByTopic`; `standardRegistry.ts` → `codeSectionToRequirementShell` / `detectStandardDescriptor`; `formatPrecedenceFindingText`)
5. The production path: `lib/finding-engine/src/engine.ts` → `finalizeDrafts` (where reconcile is absent today)
6. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

Clone `P:\legacy-design-tools` (main). Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`.

## Scope (S1 — small, tight)

1. **Recon (read-only, report first).** Confirm against live source: the multi-section retrieval point in the finding/plan-set orchestration where two or more federal/model code sections match the same topic+dimension; the shape `reconcileRequirementsByTopic` expects; the citation/atomId fields available at that point. Report before wiring.
2. **Wire reconcile into the production path.** When the finding path has multiple applicable code sections on the same topic+dimension (start with the **accessibility domain** — the ADA/FHA/A117.1 hero case), build `ApplicableRequirement[]` via `codeSectionToRequirementShell`, call `reconcileRequirementsByTopic`, and emit the governing finding via `formatPrecedenceFindingText`. The reconciliation chain (rule applied + which standard governs + every compared standard) becomes the finding's reasoning text.
3. **Preserve lineage (HARD).** The emitted finding carries structured `citations[].atomId` for **every compared standard** (governing + non-governing), so the arrow-two deposit lands on the cited atoms. A reconciliation that drops the non-governing citations is a lineage regression. Carry confidence (min of compared, per the primitive) and the uniform-envelope fields (reasoning chain, timestamp/edition). Keep the calibration GRADE out of buyer-facing output (rail-quiet, I7).
4. **Scope to what is wired (honesty).** Do NOT claim cross-layer zoning or CC&R reconciliation (unhandled per the recon — that is S4/S5). The wired claim is federal accessibility + adopted model code + local amendments on the same dimension. The user-facing copy must not overclaim beyond that.
5. **Do NOT introduce the residual taxonomy gap.** The recon flagged a `general`-domain label stickiness (`local-amendment-overlays-model-code` when the pool still has 2+ post-overlay). S1 targets the accessibility domain where this is already correct; do not extend into `general` without the S4 label fix. If the wiring would exercise `general`, flag it and stop short rather than ship the sticky label.

Out of scope: the `resolve_precedence` gate tool (S2, separate fast-follow after A2); jurisdiction auto-expansion (S3); state-amendment-tier / zoning / CC&R matrix hardening (S4/S5); any engine move (the lift is cc-agent-E).

## Acceptance criteria

- Recon report: the multi-section production point identified with file+symbol; the wiring plan stated before building.
- `engine.ts` (production finding path) calls reconcile when multiple same-topic+dimension standards apply; an integration test proves a multi-standard input (ADA+FHA, or ADA+FHA+A117.1) produces a single governing finding with the correct rule and the reconciliation chain as reasoning — NOT an LLM-improvised finding.
- **Every compared standard's `citations[].atomId` is preserved on the emitted finding (HARD — arrow-two lineage).**
- User-facing claim scoped to the wired capability (no zoning/CC&R overclaim); `general`-domain sticky-label not introduced.
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_precedence_wire_finding_engine.md`: recon (the production wire point), the integration-test output verbatim (multi-standard → governing finding + preserved citations), PR URL + SHA, and blockers verbatim.
