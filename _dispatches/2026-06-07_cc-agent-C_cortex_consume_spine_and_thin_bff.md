---
id: 2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff
title: Dispatch - engine lift steps 5-6, cortex-api consumes the spine + thins to BFF
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED - FIRE AFTER engine-core lift (A2/step 4) parity is green. Prereqs MET: gate-front seam (#160), gate citation lineage (#30/#159). App-by-app QA + provenance envelope per sprint 58 (C1-C3).
related: [00_current_state, 20_agent_operating_rules, 56_engine_extraction_sprint, 54_tenant_leg_sprint, _decisions/2026-06-07_adr008_gate_front_seam_scoping]
---

# Engine lift steps 5-6 - cortex-api consumes the spine + thins to BFF

> **QUEUED.** Fire after the engine-core lift (A2 / 56 step 4) reaches behavior parity in the spine. The two prerequisites are MET: the tenant-leg gate-front seam (54 step 2, #160) and the gate citation lineage (P0a/P2, #30/#159). This cuts cortex-api over to consume the spine through the gate and removes the migrated engine code, leaving cortex-api a thin product BFF with no ungated path to an engine. Verify identifiers against live source before firing.
>
> **APP-BY-APP as the QA vehicle (sprint 58, C1-C3).** This is the de-risked, non-big-bang cut: do **Cortex first** (C1), QA it in its final topology, then the **browser extension** (C2), then thin to BFF (C3). SmartCity/Bastrop is the third app on the same mechanism but a SEPARATE later dispatch (54 Task 2), off the launch critical path — do NOT pull it into this run. Per-engine feature flags make each cut reversible; QA each app before moving to the next.
>
> **Provenance envelope folds into the cut (sprint 58 moat #3).** As each architect-facing surface is cut to the gate, bring its tool outputs onto the uniform provenance envelope (lineage = cited atom-id[s]; sources = authoritative deeplink[s] per atom with edition + retrieved-at + verification state; reasoning chain = rule + precedence/reconciliation + project facts; confidence + Layer-2 calibration grade; timestamp + edition). The arrow-two-critical lineage is already closed (#30/#159/#158); this is the trust-facing envelope SHAPE standardization on the surfaces architects see (Cortex findings, extension brief, code lookups). Full-fleet standardization across all gate tools is fast-follow, not this run. **Rail-quiet (I7): the calibration GRADE stays out of buyer-facing output schemas.**

You are **cc-agent-C**, the single owner of the `P:\legacy-design-tools` main clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only if Grok fails after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:56` - engine extraction (steps 5-6, consumer cutover + BFF thin)
- `decision:2026-06-07_adr008_gate_front_seam_scoping` - no ungated path

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) - target architecture + sequence
2. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - the gate seam this consumes
3. [`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](../_decisions/2026-06-07_adr008_gate_front_seam_scoping.md)
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (main clone)
- Branch prefix: `cortex/`
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (sequence; multiple PRs expected):**

- Recon: confirm engine-core + engine-api in the spine reach parity for each engine; report.
- Cut cortex-api's engine call sites over to the spine `engine-api` via the gate-front seam, one engine at a time (brief, findings, hydrology, topography, decomposition, precedence), with a feature flag per engine so cutover is reversible.
- Remove the migrated engine code (`lib/adapters`, `lib/briefing-engine`, `lib/finding-engine`, hydrology/topography) from cortex-api once each engine is served from the spine and verified.
- Lock cortex-api's direct engine routes so nothing reaches an engine except through the gate.
- Leave cortex-api as a thin product BFF: UI serving, session/auth, the snapshot/sheet/IFC ingest intake (Revit + extension ingress), product glue.
- Preserve the brief extension + Revit ingress behavior; preserve citation/confidence/atomId lineage end to end.

**Out of scope:**

- The spine-side engine code (cc-agent-E owns engine-core/engine-api).
- The tenant gate resolution itself (tenant-leg cc-agent-M).

## Acceptance criteria

- Each engine served from the spine through the gate; per-engine feature flags allow reversible cutover.
- Migrated engine code removed from cortex-api; direct engine routes locked; no ungated path remains (verify).
- cortex-api is a BFF: ingest + UI + auth only. Extension + Revit ingress unaffected.
- **Citation/confidence/atomId lineage intact end to end (HARD — arrow-two deposit depends on it; a cut that drops lineage is a regression, not done).**
- Architect-facing surfaces (Cortex findings, extension brief, code lookups) emit the uniform provenance envelope (lineage + sources + reasoning chain + confidence + timestamp/edition); calibration grade absent from buyer-facing schemas (rail-quiet).
- CI green. PRs held for operator merge.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_cortex_consume_spine_and_thin_bff.md`. Atom refs, model, PR URLs + SHAs, blockers verbatim.
