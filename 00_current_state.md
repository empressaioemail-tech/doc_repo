---
id: 00_current_state
title: Current state snapshot — 2026-05-21
status: active
last_updated: 2026-05-21
applies_to: portfolio
related: [11_roadmap, 16_commercialization_roadmap, 43_cortex_qa_backlog, 30a_smartcity_stabilization_sprint, 48_codex_program_plan]
---

# Current state snapshot

> **Read me first.** Per [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md). Regenerated at session close. Pointer doc — follow links into canonical docs for full context.

## 1. Active fires

- **Fire 2** — plaintext secrets. WS-2 internals redacted and rebound to Cloud Run. Remaining: Track B external rotations (Verkada, ESRI/ArcGIS, VFD codes), WS-3 internal items, and the portfolio-level git-history scrub. Owner: Nick + agent.
- Fires 1, 3, 4 closed. Fire 5 closes at M-Stabilize Phase 2C.

## 2. In-flight tracks

**Roadmap catch-up**, dispatched 2026-05-21. Four cc-agent tracks plus the planner refresh:

- **Cortex QA close-out** — cc-agent-C, legacy-design-tools. QA-16 (#59), QA-23 (#60), QA-19 (#61) merged 2026-05-21. QA-18 (PR #62) is OPEN with merge conflicts + 3 CI failures; conflict-resolution dispatched to cc-agent-C, front of queue. Toward M-CortexQA exit. QA-16 does not close QA-04 — see watch list.
- **M-Stabilize restart** — cc-agent-M, smartcity-os (reassigned from the completed Lane M). WS-1 migration spine first, then WS-3/WS-4. Re-orient against the actual repo first; parked 10+ days.
- **Lane E continuation** — cc-agent-E, hauska-engine. Sync 5 Tier 1: Round Rock + Taylor shipped (merged, not yet in the deployed corpus). Bare-numbered-section fix → Leander next.
- **QA-17 Cortex substrate integration** (framework-proving) — cc-agent-AC, fresh legacy-design-tools clone. Prove cortex-api ↔ Hauska substrate wiring; scoped to Code Library reading the live catalog.

**M-CodexQA** — CDX-Phase1-1 resolved 2026-05-21: the Codex 1b reviewer-side QA surface lives as a new `codex-reviewer-qa` artifact per [`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`](_decisions/2026-05-21_codex_reviewer_qa_surface_location.md). The scaffold dispatch to cc-agent-C is filed and activation-gated behind the Cortex QA close-out merge.

**Commercialization Wave 1** — winding down. MCP server deployed in hauska-prod, retrieval API live. Residuals: `mcp.hauska.dev` domain mapping (operator), GTM. Wave 2 (paid Layer 2) parked on operator decisions B (tier numbers) and C (GTM channel plan). This is M-HauskaCommercial, now a fourth milestone in the `11_roadmap.md` end-state model.

## 3. Open ADRs

ADR-005 multitenancy (queued, 30a WS-4); ADR-006 anchoring substrate; ADR-007 cross-stakeholder atom access; ADR-008 engine factor-out (gated on M-Stabilize Phase 2C); ADR-009 firm tenancy (deferred); ADR-014 skill/behavior atoms (deferred, Q3 v2); ADR-016 intent atoms (deferred, v2). Accepted: ADR-013/015/017 (2026-05-16), ADR-018 (2026-05-18), ADR-019 (2026-05-21; Layer 1 model-code ingest gated on ICC API access).

## 4. Agent fleet

- **planner** (doc_repo Claude Code) — portfolio planning, reconciliation, session-close.
- **cc-agent-C** → legacy-design-tools — Cortex QA close-out: QA-16/19/23 merged (#59/#60/#61); QA-18 PR #62 conflict-resolution at the front of queue, then QA-22 Part 1 site-context, then the codex-reviewer-qa scaffold.
- **cc-agent-M** → smartcity-os — M-Stabilize restart (reassigned from Lane M). Deep multi-phase dispatch.
- **cc-agent-E** → hauska-engine — Lane E continuation (Taylor shipped). Deep multi-phase dispatch; QA-20 folds into Phase E1.
- **cc-agent-AC** → legacy-design-tools fresh clone — QA-17 retrofit. Queued behind QA-17: the api-server import migration to `@hauska/atom-contract` (dispatched 2026-05-21).
- **Nick** — merge, deploy, decisions.

## 5. Recent sessions

- 2026-05-21 planner — roadmap catch-up refresh: `11_roadmap` end-state model gains M-HauskaCommercial; Fire 3 closed; IP-memo ingestion gate retired across 11/73/18/13; ADR-013/015/017/018/019 statuses corrected; M-CodexQA CDX-Phase1-1 resolved; QA-21 BD asset logged.
- 2026-05-21 planner — cross-repo reconciliation, `_inbox/` + HR-11, Circle decision, factual corrections, roadmap-catch-up plan + 5 dispatches, QA-17/21/22 scoping. Five commits.
- 2026-05-21 cc-agent-C — Cortex QA close-out (QA-16/19/23 merged as #59/#60/#61; QA-18 PR #62 conflict-resolution pending).
- 2026-05-21 cc-agent-C — QA-04 IFC-upload four-layer diagnosis; three layers fixed (PRs #57/#58 + cortex-prod schema migration); QA-16 filed for the fourth.
- 2026-05-21 cc-agent-E — Taylor LDC shipped (Path PDF, reclassified from Path C); `chapter-decimal` parsing convention added.

## 6. Cross-cutting watch list

- **QA-16 / QA-04** — PR #59 isolates the IFC parse but does NOT close QA-04. The canary deploy (the revision carrying #57+#58+#59) and the traffic shift are operator-supervised: confirm a real Revit IFC returns 201 against the canary before shifting.
- **`_inbox/` + HR-11 live** (2026-05-21). cc-agents drop session summaries into the doc repo's `_inbox/`; the planner sweeps and files. The `_inbox/` write is the one permitted cross-repo write; cc-agent-C had drafted into `legacy-design-tools/_research/` instead, and the new codex-reviewer-qa scaffold dispatch reinforces `_inbox/`.
- **Teed-up cc-agent dispatch queue** (2026-05-21). cc-agent-C: QA-18 PR #62 conflict-resolution (front of queue, no gate — operator to dispatch), then QA-22 Part 1 site-context, then the codex-reviewer-qa scaffold. cc-agent-AC: api-server import migration to `@hauska/atom-contract` (behind QA-17). QUEUED, not yet fireable: ECI atomization P1 ([`_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md`](_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md)) — gated on Nick creating the `empressa-atom-internal` repo and a cc-agent seat freeing, queued behind the commercialization spine. QA-20 routed into cc-agent-E Lane E Phase E1.
- **Circle is the v1 fiat rail** per `_decisions/2026-05-21_fiat_rail_circle.md`. The fiat rail is a near-greenfield Circle build, not a single TODO.
- **Revenue-routing gap** — substrate-enforced revenue share has no code in the SDK. Designed, not built. Needs a Wave 2 build line.
- **ICC API access** — Nick is pursuing it. It unblocks Lane E Phase E1 (the Layer 1 model-code base, ADR-019).
- Round Rock + Taylor merged but not in the deployed corpus; a `build-corpus-snapshot` refresh + retrieval-api redeploy is owed.
- **IP-memo ingestion gate fully retired** — the Texas IP attorney memo is parallel bizops tracked in `72`, not a gate on substrate ingestion. The stale gate language in 11/73/18/13 was corrected 2026-05-21; `51` was already corrected 2026-05-19.
