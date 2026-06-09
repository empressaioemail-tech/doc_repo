---
id: 2026-06-07_cc-agent-C_arrow2_phase3_calibration
title: Dispatch - arrow-two Phase 3 calibration computation
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED (do not fire - depends on arrow-two Phase 2 AND the cold-warm harness landing first)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 54_tenant_leg_sprint, 57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, _decisions/2026-06-09_codewarm_arrow_two_combined, _dispatches/2026-06-09_cc-agent-C_codewarm_harness]
---

# Arrow-two Phase 3 calibration computation

> **HOLD - QUEUED. Retargeted 2026-06-09** onto the unified calibration overlay per [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](../_decisions/2026-06-09_codewarm_arrow_two_combined.md). Do not fire until BOTH arrow-two Phase 2 (outcome capture) AND the cold-warm harness (migration 0036, the asserted/calibrated field split) have landed; Phase 3 needs captured outcomes to compute against and the field split as the write target. Migration 0037. Fire-ready; sequencing is the gate. Verify identifiers against live source before firing.

> **Design change from the original (2026-06-09):** the Phase-0 conclusion was "no write target, calibration lives on a finding/ledger projection only." The v2 `reasoning_atoms` table (migration 0035) supersedes that for the reasoning layer, and a `(atomId, jurisdictionTenant)` calibration overlay supersedes it for the existing immutable corpus. Calibration is written to ONE overlay covering BOTH stores via the `findings.citations[].atomId` lineage; the engine code-section corpus is still never mutated. See the retargeted scope below.

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:54` - tenant-leg sequence; this is step 4 (final)
- `product:cortex` - calibration runs over cortex-api findings + the evidence ledger

## Read first (after atoms)

1. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) - Phase 3 spec; calibration defined
2. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - Sequence step 4; guardrails
3. [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md) - invariant I3 (confidence earned, not asserted), the invariant this satisfies
4. [`03a_positioning_framework.md`](../03a_positioning_framework.md) - calibration grade feeds the pricing tiers
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `tenant/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Confirm the Phase 1 ledger and Phase 2 outcome capture are both present and tenant-partitioned on `jurisdictionTenant`, and confirm the cold-warm field split (migration 0036, `assertedConfidence` vs nullable `calibratedConfidence`) has landed. Report verbatim.
- Migration 0037: the public calibration columns and the `(atomId, jurisdictionTenant)` calibration overlay table. The overlay carries calibration for BOTH the new reasoning atoms and the existing immutable corpus atoms, keyed by atom id, attributed via `findings.citations[].atomId` lineage. The corpus is never mutated.
- Build calibration computation: compare stated confidence to observed frequency (from captured outcomes and adjudications), per tenant, and tighten with use. Write `calibratedConfidence` to the overlay; at read time it falls back to `assertedConfidence` until signal accrues (cold-start prior), never rendering uncalibrated as zero.
- **Sovereignty split (load-bearing).** A shared model-code atom's public `calibratedConfidence` is computed ONLY from non-tenant-private signal. Tenant-private adjudications stay in a per-tenant overlay row (`tenant-private` accessPolicy) that never pools into the shared number or any other tenant. Demonstrate on a seeded two-tenant fixture: a shared atom shows a public grade and a Bastrop-only overlay with no leakage between them.
- **Adaptive grain.** Compute per-atom where adjudication signal is dense; fall back to per-class-within-jurisdiction (e.g. egress sections in a jurisdiction) where sparse, so a grade is never computed off two events. Record the grain used.
- **Edition-scoped.** Stamp calibration with the (reference, edition, source-set) it was earned against; an edition change invalidates or carries forward deliberately, not silently.
- **Asserted baseline for the corpus (committed 2026-06-09).** Seed an asserted baseline on the corpus-atom overlay rows from source quality (born-digital PDF, Municode, web) so every served atom carries confidence plus provenance plus verification, both stores.
- **Spine-migration seam (build discipline).** The overlay and calibration computation are engine-core cargo, not BFF code. Build behind a clean package boundary so they lift to `hauska-engine/packages/engine-core` with the finding engine as part of the engine extraction (`56_engine_extraction_sprint.md` step 4). Do not weave into product glue that stays in the thinned BFF.
- Surface the grade so it can feed the calibration-grade pricing tiers (positioning framework) without exposing the rail to the buyer (I7).

**Out of scope:**

- Mutating the engine code-section corpus (calibration lives on the overlay; the corpus is rebuilt, never mutated in place).
- Pricing-tier wiring itself (positioning / SDK territory).
- Any cross-tenant benchmarking surface, and any pooling of tenant-private adjudications into a shared number.
- The lineage-completeness audit across non-Cortex emission surfaces (Codex, MCP, Brief) - tracked as a sprint launch-readiness gate, not built here.

## Acceptance criteria

- Migration 0037 adds the public calibration columns and the `(atomId, jurisdictionTenant)` overlay; the overlay resolves calibration for both a reasoning atom and an existing corpus atom in the fixture, via lineage, with no corpus mutation.
- Calibration computed per tenant; demonstrated on a seeded two-tenant fixture where a shared atom shows a public grade (non-tenant-private signal only) and a per-tenant overlay with no leakage between them.
- Cold-start fallback verified: an atom with no calibration signal reads back `assertedConfidence`, not zero.
- Adaptive grain recorded; edition-scoped stamp present; an edition change does not silently carry stale calibration.
- Calibration absent from MCP tool output schemas; present on the Cortex surface (rail-quiet I7).
- Satisfies I3: stated confidence now has a path to being checked against observed frequency, for both stores.
- Tests: existing suite green plus calibration computation, overlay-covers-both, sovereignty-no-pool, and cold-start-fallback tests.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_arrow2_phase3_calibration.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
