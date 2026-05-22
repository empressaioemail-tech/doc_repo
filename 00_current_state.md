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
- Fires 1, 3, 4 closed. Fire 5 closes at M-Stabilize Phase 2C — deferred while M-Stabilize is on operator hold (see watch list).

## 2. In-flight tracks

**Roadmap catch-up**, dispatched 2026-05-21. Four cc-agent tracks plus the planner refresh:

- **Cortex QA close-out + QA-22** — cc-agent-C, legacy-design-tools. Close-out complete (QA-16/23/19/18 = PRs #59-62), **QA-22 Part 1 merged** (PR #63 — site-context adapter-timeout reliability), and **codex-reviewer-qa scaffold delivered** (PR #66, open — see M-CodexQA below). cc-agent-C's teed-up queue is now empty. Toward M-CortexQA exit via the 43 backlog burndown. QA-16 does not close QA-04 — see watch list.
- **M-Stabilize restart** — cc-agent-M, smartcity-os. **On operator hold (2026-05-21):** the operator is handling the smartcity-os production database directly; cc-agent-M is curbed so agent migration work (WS-1 touches that database) does not collide with hands-on prod-DB work. Resumes on the operator's word.
- **Lane E continuation** — cc-agent-E, hauska-engine. Sync 5 Tier 1: Round Rock + Taylor shipped (merged, not yet in the deployed corpus). Bare-numbered-section fix → Leander next.
- **QA-17 Cortex substrate integration** — cc-agent-AC. **PR #64 merged 2026-05-21:** the Code Library now reads the Hauska substrate via the MCP server (`mock` mode default). Full closure pends operator mcp-mode config (Cortex product key + env + deploy — see watch list). The api-server import migration that followed (cc-agent-AC, own clone `P:\ldt-ac-qa17`) merged 2026-05-21 (PR #65). cc-agent-AC is now dispatched on the `@workspace/empressa-atom` retirement — migrate the final two consumers and remove the staging package.

**M-CodexQA** — CDX-Phase1-1 resolved 2026-05-21: the Codex 1b reviewer-side QA surface lives as a new `codex-reviewer-qa` artifact per [`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`](_decisions/2026-05-21_codex_reviewer_qa_surface_location.md). The scaffold was delivered by cc-agent-C as PR #66 (open, CI green): a sixth `artifacts/codex-reviewer-qa/` Vite/React SPA shell, built into the Dockerfile and served at `/codex-reviewer-qa`. Phase 2 reviewer surfaces (CDX-3/4/5/9 per `48`) build on it.

**Commercialization Wave 1** — winding down. MCP server deployed in hauska-prod, retrieval API live. Residuals: `mcp.hauska.dev` domain mapping (operator), GTM. Wave 2 (paid Layer 2) parked on operator decisions B (tier numbers) and C (GTM channel plan). This is M-HauskaCommercial, now a fourth milestone in the `11_roadmap.md` end-state model.

## 3. Open ADRs

ADR-005 multitenancy (queued, 30a WS-4); ADR-006 anchoring substrate; ADR-007 cross-stakeholder atom access; ADR-008 engine factor-out (gated on M-Stabilize Phase 2C); ADR-009 firm tenancy (deferred); ADR-014 skill/behavior atoms (deferred, Q3 v2); ADR-016 intent atoms (deferred, v2). Accepted: ADR-013/015/017 (2026-05-16), ADR-018 (2026-05-18), ADR-019 (2026-05-21; Layer 1 model-code ingest gated on ICC API access).

## 4. Agent fleet

- **planner** (doc_repo Claude Code) — portfolio planning, reconciliation, session-close.
- **cc-agent-C** → legacy-design-tools — Cortex QA close-out + QA-22 Part 1 merged (PRs #59-63); codex-reviewer-qa scaffold delivered (PR #66, open). Teed-up queue now empty.
- **cc-agent-M** → smartcity-os — M-Stabilize restart. **Held 2026-05-21** at the operator's call (operator handling the production DB directly); dispatch ready to re-fire on release.
- **cc-agent-E** → hauska-engine — Lane E continuation (Taylor shipped). Deep multi-phase dispatch; QA-20 folds into Phase E1.
- **cc-agent-AC** → legacy-design-tools (own clone `P:\ldt-ac-qa17`) — QA-17 (#64) and api-server import migration (#65) merged. Dispatched on the `@workspace/empressa-atom` retirement: migrate the final two consumers (`lib/submission-classifier`, `scripts`), then remove the `lib/empressa-atom/` staging package.
- **Nick** — merge, deploy, decisions.

## 5. Recent sessions

- 2026-05-21 cc-agent-C — codex-reviewer-qa scaffold (PR #66, open): a sixth `legacy-design-tools` artifact, Vite/React SPA shell; resolves the build half of CDX-Phase1-1.
- 2026-05-21 cc-agent-AC — api-server import migration `@workspace/empressa-atom` → `@hauska/atom-contract` merged (PR #65); drift check clean, 49 files, api-server only.
- 2026-05-21 cc-agent-AC — QA-17 merged (PR #64): Code Library wired to the Hauska substrate via the MCP server; chose MCP over the retrieval API for the ADR-017 accessPolicy gate.
- 2026-05-21 cc-agent-C — QA-22 Part 1 merged (PR #63): per-adapter timeout floors for slow site-context upstreams; the runner already isolated per-adapter.
- 2026-05-21 planner — roadmap catch-up refresh + dispatch-queue teeing; QA-18 PR-number correction; M-Stabilize hold; QA-17 no-clone blocker resolved.
- 2026-05-21 cc-agent-C — Cortex QA close-out QA-16/19/23/18 merged as #59-62.

## 6. Cross-cutting watch list

- **QA-16 / QA-04** — PR #59 isolates the IFC parse but does NOT close QA-04. The canary deploy (the revision carrying #57+#58+#59) and the traffic shift are operator-supervised: confirm a real Revit IFC returns 201 against the canary before shifting.
- **`_inbox/` + HR-11 live** (2026-05-21). cc-agents drop session summaries into the doc repo's `_inbox/`; the planner sweeps and files. The `_inbox/` write is the one permitted cross-repo write; cc-agent-C had drafted into `legacy-design-tools/_research/` instead, and the new codex-reviewer-qa scaffold dispatch reinforces `_inbox/`.
- **QA-17 full closure — operator mcp-mode config** (2026-05-21). QA-17's code is merged (PR #64) with `mock` mode as the default. To meet the success criterion (five jurisdictions with real atom counts, including the three `platform-internal` ones): mint a Cortex product key via the hauska-mcp-server admin key-issuance endpoint, set `HAUSKA_SUBSTRATE_MODE=mcp` + `HAUSKA_MCP_URL` + `HAUSKA_MCP_KEY` on cortex-api, and operator-supervised-deploy. Nick action.
- **smartcity-os production database — operator hands-on (2026-05-21).** The operator is dealing with the smartcity-os production database directly and wants full attention on it. cc-agent-M / M-Stabilize is held for the duration — WS-1's migration spine touches that database and would collide. The M-Stabilize dispatch re-fires when the operator releases it.
- **Teed-up cc-agent dispatch queue** (2026-05-21). cc-agent-C: close-out + QA-22 + codex-reviewer-qa scaffold all done (PRs #59-63, #66) — **dispatch queue now empty**, awaiting the next dispatch (Phase 2 reviewer surfaces, or a 43-backlog item). cc-agent-AC: QA-17 (#64) and api-server import migration (#65) both merged; now dispatched on the `@workspace/empressa-atom` retirement ([`_dispatches/2026-05-21_cc-agent-AC_empressa_atom_retirement.md`](_dispatches/2026-05-21_cc-agent-AC_empressa_atom_retirement.md)) — migrate `lib/submission-classifier` and `scripts`, then remove `lib/empressa-atom/`. Atomic, one PR. QUEUED, not yet fireable: ECI atomization P1 ([`_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md`](_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md)) — gated on Nick creating the `empressa-atom-internal` repo and a cc-agent seat freeing. QA-20 routed into cc-agent-E Lane E Phase E1.
- **Circle is the v1 fiat rail** per `_decisions/2026-05-21_fiat_rail_circle.md`. The fiat rail is a near-greenfield Circle build, not a single TODO.
- **Revenue-routing gap** — substrate-enforced revenue share has no code in the SDK. Designed, not built. Needs a Wave 2 build line.
- **ICC API access** — Nick is pursuing it. It unblocks Lane E Phase E1 (the Layer 1 model-code base, ADR-019).
- Round Rock + Taylor merged but not in the deployed corpus; a `build-corpus-snapshot` refresh + retrieval-api redeploy is owed.
- **Flaky `lib/codes` CI timeouts** (surfaced 2026-05-21, cc-agent-C PR #66). The `lib/codes` `queue`/`orchestrator`/`bootstrap` test files run ~15-23s against a 10s per-test `testTimeout`, so they tip over under CI-runner load and intermittently fail unrelated PRs (PR #66's first run failed 3, the re-run was clean). Not a blocker. Planner ticket: raise those tests' `testTimeout` or speed them up, a small legacy-design-tools dispatch when a cc-agent seat frees.
- **IP-memo ingestion gate fully retired** — the Texas IP attorney memo is parallel bizops tracked in `72`, not a gate on substrate ingestion. The stale gate language in 11/73/18/13 was corrected 2026-05-21; `51` was already corrected 2026-05-19.
