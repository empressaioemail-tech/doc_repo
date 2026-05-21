---
id: 00_current_state
title: Current state snapshot — 2026-05-21
status: active
last_updated: 2026-05-21
applies_to: portfolio
related: [11_roadmap, 16_commercialization_roadmap, 43_cortex_qa_backlog, 30a_smartcity_stabilization_sprint]
---

# Current state snapshot

> **Read me first.** Per [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md). Regenerated at session close. Pointer doc — follow links into canonical docs for full context.

## 1. Active fires

- **Fire 2** — plaintext secrets. WS-2 internals redacted and rebound to Cloud Run. Remaining: Track B external rotations (Verkada, ESRI/ArcGIS, VFD codes), WS-3 internal items, and the portfolio-level git-history scrub. Owner: Nick + agent.
- Fires 1, 3, 4 closed. (Fire 3 closed 2026-05-19, the `post-merge.sh` Neon guard.) Fire 5 closes at M-Stabilize Phase 2C.

## 2. In-flight tracks

**Roadmap catch-up**, dispatched 2026-05-21. Three tracks plus the QA-17 retrofit:

- **Cortex QA close-out** — cc-agent-C, legacy-design-tools. QA-16/23/19/18 shipped as PRs #59-62 (2026-05-21, none deployed). Toward M-CortexQA exit. QA-16 PR #59 does not close QA-04 — see watch list.
- **M-Stabilize restart** — cc-agent-M, smartcity-os (reassigned from the completed Lane M). WS-1 migration spine first, then WS-3/WS-4. Re-orient against the actual repo first; parked 10+ days.
- **Lane E continuation** — cc-agent-E, hauska-engine. Sync 5 Tier 1: Round Rock + Taylor shipped (merged, not yet in the deployed corpus). Bare-numbered-section fix → Leander next.
- **QA-17 Cortex substrate integration** (framework-proving) — cc-agent-AC, fresh legacy-design-tools clone. Prove cortex-api ↔ Hauska substrate wiring; scoped to Code Library reading the live catalog.

**Commercialization Wave 1** — winding down. MCP server deployed in hauska-prod, retrieval API live. Residuals: `mcp.hauska.dev` domain mapping (operator), GTM. Wave 2 (paid Layer 2) parked on operator decisions.

## 3. Open ADRs

ADR-005 multitenancy (queued, 30a WS-4); ADR-006 anchoring substrate; ADR-007 cross-stakeholder atom access; ADR-008 engine factor-out (gated on M-Stabilize Phase 2C); ADR-009 firm tenancy (deferred); ADR-018 atom contract substrate layer (accepted); ADR-019 layered code substrate (accepted; Layer 1 ingest gated on ICC API access). ADR-013/015/017 are accepted.

## 4. Agent fleet

- **planner** (doc_repo Claude Code) — portfolio planning, reconciliation, session-close.
- **cc-agent-C** → legacy-design-tools — Cortex QA close-out (PRs #59-62 open).
- **cc-agent-M** → smartcity-os — M-Stabilize restart (reassigned from Lane M).
- **cc-agent-E** → hauska-engine — Lane E continuation (Taylor shipped).
- **cc-agent-AC** → legacy-design-tools fresh clone — QA-17 retrofit (reassigned from atom-contract steady-state).
- **Nick** — merge, deploy, decisions.

## 5. Recent sessions

- 2026-05-21 planner — cross-repo reconciliation, `_inbox/` + HR-11, Circle decision, factual corrections, roadmap scrub, BD feed, roadmap-catch-up plan + 5 dispatches, QA-17/21/22 scoping. Five commits.
- 2026-05-21 cc-agent-C — Cortex QA close-out, PRs #59-62.
- 2026-05-21 cc-agent-E — Taylor LDC shipped (Path PDF, reclassified from Path C); `chapter-decimal` parsing convention added.

## 6. Cross-cutting watch list

- **`_inbox/` + HR-11 live** (2026-05-21). cc-agents drop session summaries into the doc repo's `_inbox/`; the planner sweeps and files. cc-agent-C should be told the `_inbox/` write is the one permitted cross-repo write (a prior "no cross-repo writes" instruction made it draft locally instead).
- **Circle is the v1 fiat rail** per `_decisions/2026-05-21_fiat_rail_circle.md` (supersedes the Stripe Connect placeholder). The fiat rail is a near-greenfield Circle build, not a single TODO.
- **Revenue-routing gap** — substrate-enforced revenue share has no code in the SDK. Designed, not built. Needs a Wave 2 build line.
- **QA-16 / QA-04** — PR #59 isolates the IFC parse but does NOT close QA-04. The canary deploy + traffic shift are operator-supervised.
- **ICC API access** — Nick is pursuing it. It unblocks Lane E Phase E1 (the Layer 1 model-code base).
- Round Rock + Taylor merged but not in the deployed corpus; a `build-corpus-snapshot` refresh + retrieval-api redeploy is owed.
- **`11_roadmap.md` refresh owed** — Fire 3 closed, IP-memo ingestion gate removed, ADR statuses, ADR-018/019 added, milestone statuses, a Hauska-commercialization milestone added to the end-state model.
