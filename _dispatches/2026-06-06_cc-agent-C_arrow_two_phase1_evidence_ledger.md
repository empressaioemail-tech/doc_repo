---
id: 2026-06-06_cc-agent-C_arrow_two_phase1_evidence_ledger
title: Dispatch — Arrow two Phase 1 (adjudication-to-atom evidence ledger, tier 1a projection)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [04a_arrow_two_calibration_capture, _inbox/2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, 01a_atom_conventions, 20_agent_operating_rules]
---

# Arrow two Phase 1: adjudication-to-atom evidence ledger (tier 1a)

You are **cc-agent-C**, single owner of `legacy-design-tools` (cortex-api) for this run. This is the build that follows your own Phase 0 recon ([`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon.md)). Spec anchor: [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md).

Phase 0 settled the shape: do NOT write confidence back onto code-section atoms (no field, no setter, no recompute, corpus rebuilt-immutable). Phase 1 ships the **tier 1a derived projection only** — route the already-captured adjudication signal to the atoms it concerns, closing gap #1 (stranded signal) with zero schema change. Tier 1b (durable write), Phase 2 (outcome capture), and Phase 3 (calibration computation) are explicitly out of scope.

## Model (HR-12)

Default Grok Build 0.1; grok-code-fast-1 for narrow tasks; escalate to Claude only on failure after retry, log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

(catalog [`01a_atom_conventions.md`](../01a_atom_conventions.md)): `current-state:portfolio`. The substrate atoms (finding, decision-event, code-section) are cortex-api substrate, not doc_repo catalog atoms; resolve by repo recon as in Phase 0 if Cortex MCP is unmounted.

## Read first

1. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) — the spec and the Phase 0 findings section.
2. Your Phase 0 report (linked above) — Items 1, 3, 5, 6 are the build contract; reuse the exact file/symbol citations you already made.
3. [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md) I3/I5/I7/I8 and [`03a_positioning_framework.md`](../03a_positioning_framework.md) (calibration).
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-1, HR-2, HR-8.

## Workspace ownership

- Clone `P:\legacy-design-tools`; branch prefix `cortex/`; one agent per clone; refuse alien HEAD/uncommitted, report verbatim `git status` + `git log -3`.

## Scope

**In scope — tier 1a only.** A derived read-model/projection that joins the already-emitted `atom_events` finding-mutation events (`finding.accepted` / `finding.rejected` / `finding.overridden` from `emitFindingMutationEvent` at `findings.ts:673`) to `findings.citations[].atomId`, producing per-atom adjudication tallies (accepts, rejects, overrides) alongside the stated `confidence` those findings carried. Partition every row by `jurisdictionTenant` (present on the finding/submission and `BaseAtomInstance`). Expose it as an internal read-model/query, not a public surface. Closes gap #1: the adjudication signal is attributed to each cited atom instead of stranded.

**Dependencies to verify first (from Phase 0):** confirm `invalidCitationCount` is low across recent runs (the `[[CODE:<atomId>]]` token-stripping at generation can silently drop a citation; a high invalid rate would starve the ledger). Report the rate.

**Out of scope:** tier 1b durable evidence write (only if 1a proves too costly, and as a follow-up); any confidence field on code atoms; any engine recompute or corpus mutation; outcome capture (Phase 2); calibration computation / grade (Phase 3); any change to the atom contract or the engine.

## Guardrails (hard)

- **Tenant partition (I5/I8).** Keep `jurisdictionTenant` on every ledger row; a city's adjudications sharpen that city's own atoms. Do NOT compute a single global per-atom number across tenants, and do NOT write anything back onto a shared public-catalog atom. Cross-tenant promotion is a future explicit `accessPolicy` decision, never a pipeline default.
- **Keep the rail quiet (I7).** No surface that tells a reviewer "your adjudication moved atom X" or "you earned credits." Confidence stays absent from every output schema. This is backend attribution only.

## Acceptance criteria

- Tier 1a projection live: given the existing `atom_events` + `findings.citations`, it returns per-atom adjudication tallies (accept/reject/override counts + stated-confidence list) partitioned by `jurisdictionTenant`.
- `invalidCitationCount` health reported (the lineage-trust dependency).
- Zero schema change, zero new write path, zero engine/contract/corpus change (1a is read-model only).
- Guardrails verified: tenant partition present; no global write-back; no rail-surfacing UI; confidence absent from outputs.
- Tests green for the projection (paste verbatim, HR-8).
- PR held for operator merge.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase1_evidence_ledger.md`: atoms touched; model if not default; PR URL + branch SHA; the `invalidCitationCount` health number; whether 1b is warranted (was 1a too costly); blockers verbatim.
