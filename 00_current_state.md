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

- **Cortex QA close-out + QA-22** — cc-agent-C, legacy-design-tools. Close-out complete (QA-16/23/19/18 = PRs #59-62), **QA-22 Part 1 merged** (PR #63 — site-context adapter-timeout reliability), and **codex-reviewer-qa scaffold merged** (PR #66 — see M-CodexQA below). cc-agent-C's legacy-design-tools cleanup batch (QA-15, QA-26, flaky `lib/codes` CI) merged (PR #68); Codex Phase 2 reviewer surfaces CDX-3/4/5 all delivered (#69/#70 merged, #71 open — see M-CodexQA below). QA-16 does not close QA-04 — see watch list.
- **M-Stabilize restart** — cc-agent-M, smartcity-os. **On operator hold (2026-05-21):** the operator is handling the smartcity-os production database directly; cc-agent-M is curbed so agent migration work (WS-1 touches that database) does not collide with hands-on prod-DB work. Resumes on the operator's word.
- **Lane E continuation** — cc-agent-E, hauska-engine. Sync 5 Tier 1: Round Rock + Taylor + Leander shipped (merged #20/#21/#23, not yet in the deployed corpus); bare-numbered-section entityId disambiguation merged (#22). 3 of 6 Tier 1 cities done; Georgetown next, then Pflugerville / Cedar Park discovery.
- **QA-17 Cortex substrate integration** — cc-agent-AC. **PR #64 merged 2026-05-21:** the Code Library now reads the Hauska substrate via the MCP server (`mock` mode default). Full closure pends operator mcp-mode config (Cortex product key + env + deploy — see watch list). The api-server import migration that followed (cc-agent-AC, own clone `P:\ldt-ac-qa17`) merged 2026-05-21 (PR #65), and the `@workspace/empressa-atom` retirement that completed it merged 2026-05-21 (PR #67): it migrated the final two consumers and removed the staging package. The ADR-018 atom-contract transition for legacy-design-tools is complete across #64/#65/#67; cc-agent-AC's queue is empty.

**M-CodexQA** — CDX-Phase1-1 resolved 2026-05-21: the Codex 1b reviewer-side QA surface lives as a new `codex-reviewer-qa` artifact per [`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`](_decisions/2026-05-21_codex_reviewer_qa_surface_location.md). The scaffold merged 2026-05-21 (PR #66): a sixth `artifacts/codex-reviewer-qa/` Vite/React SPA shell, built into the Dockerfile and served at `/codex-reviewer-qa`. **Phase 2 reviewer surfaces — all three delivered.** Dispatched to cc-agent-C 2026-05-21 per [`_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md`](_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md), split into per-stream PRs. CDX-3 (one-click review pass, PR #69) and CDX-4 (per-finding accept/edit/reject loop, PR #70) merged; CDX-5 (jurisdiction switcher, built as an engagement/submission switcher per the 2026-05-21 planner ruling) open as PR #71 (CI green, awaiting merge). On #71's merge that dispatch is complete. Phase 2 still carries CDX-9 (gated on DA-5), CDX-EngineHook-prep (gated on 27-A), CDX-QA-1 (planner deliverable), and CDX-MCP (cc-agent-M, hauska-mcp-server) — none in this dispatch.

**Commercialization Wave 1** — winding down. MCP server deployed in hauska-prod, retrieval API live. Residuals: `mcp.hauska.dev` domain mapping (operator), GTM. Wave 2 (paid Layer 2) parked on operator decisions B (tier numbers) and C (GTM channel plan). This is M-HauskaCommercial, now a fourth milestone in the `11_roadmap.md` end-state model.

## 3. Open ADRs

ADR-005 multitenancy (queued, 30a WS-4); ADR-006 anchoring substrate; ADR-007 cross-stakeholder atom access; ADR-008 engine factor-out (gated on M-Stabilize Phase 2C); ADR-009 firm tenancy (deferred); ADR-014 skill/behavior atoms (deferred, Q3 v2); ADR-016 intent atoms (deferred, v2). Accepted: ADR-013/015/017 (2026-05-16), ADR-018 (2026-05-18), ADR-019 (2026-05-21; Layer 1 model-code ingest gated on ICC API access).

## 4. Agent fleet

- **planner** (doc_repo Claude Code) — portfolio planning, reconciliation, session-close.
- **cc-agent-C** → legacy-design-tools — Codex Phase 2 reviewer-surfaces dispatch delivered in full (CDX-3 #69, CDX-4 #70 merged; CDX-5 #71 open). **Idle, no current dispatch.** Lane C.4 was found already shipped (PRs #46/#51, merged 2026-05-20) when cc-agent-C verified against the live repo; the 2026-05-22 re-activation of that dispatch was a planner error off a stale `42`. cc-agent-C's next is a fresh planner call.
- **cc-agent-M** → smartcity-os — M-Stabilize restart. **Held 2026-05-21** at the operator's call (operator handling the production DB directly); dispatch ready to re-fire on release.
- **cc-agent-E** → hauska-engine — Lane E continuation (Taylor shipped). Deep multi-phase dispatch; QA-20 folds into Phase E1.
- **cc-agent-AC** → legacy-design-tools (own clone `P:\ldt-ac-qa17`) — QA-17 (#64), api-server import migration (#65), and `@workspace/empressa-atom` retirement (#67) all merged; the ADR-018 transition is complete. Dispatch queue empty — no current dispatch.
- **Nick** — merge, deploy, decisions.

## 5. Recent sessions

- 2026-05-22 cc-agent-C — Codex Phase 2 CDX-5 jurisdiction switcher (PR #71, open): engagement/submission switcher per the 2026-05-21 ruling, snapshot-divergence warning; completes the reviewer-surfaces dispatch (CDX-3/4/5). codex-reviewer-qa tests 54/54.
- 2026-05-22 cc-agent-C — Codex Phase 2 CDX-4 per-finding accept/edit/reject loop merged (PR #70): adjudication action row on every finding, server-stamped attribution; codex-reviewer-qa tests 29/29.
- 2026-05-21 cc-agent-C — Codex Phase 2 CDX-3 one-click AI review pass merged (PR #69): `codex-reviewer-qa` first data-bound page; two L-surface divergences ruled (reasoning chain = finding text; CDX-5 = engagement switcher).
- 2026-05-21 cc-agent-E — Sync 5 Tier 1 Leander ingest merged (PR #23, 185 atoms, eval 1.0/1.0/1.0) + bare-numbered-section entityId disambiguation (PR #22); two general Municode Path C reliability fixes folded in.
- 2026-05-21 cc-agent-C — legacy-design-tools cleanup batch merged (PR #68): QA-15 plan-review header bell (14 call sites), QA-26 root `.gitattributes`, flaky `lib/codes` CI fixed (30s testTimeout on 3 files).
- 2026-05-21 cc-agent-AC — `@workspace/empressa-atom` retirement merged (PR #67): migrated the final two consumers, removed the staging package (34 files, 3343 deletions); completes the ADR-018 transition for legacy-design-tools.
- 2026-05-21 cc-agent-C — codex-reviewer-qa scaffold merged (PR #66): a sixth `legacy-design-tools` artifact, Vite/React SPA shell; resolves the build half of CDX-Phase1-1.
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
- **Teed-up cc-agent dispatch queue** (2026-05-21, updated 2026-05-22). cc-agent-C: Codex Phase 2 reviewer surfaces delivered (CDX-3 #69, CDX-4 #70 merged, CDX-5 #71 open). **Lane C.4 was found already shipped** — PRs #46 (L1) and #51 (L2-L6 consolidated) merged 2026-05-20, predating the courier protocol so never couriered into the doc set; the 2026-05-22 re-activation of [`_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md`](_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md) was a planner error off a stale `42` and that dispatch is now marked COMPLETE. cc-agent-C idle; next dispatch is a fresh planner call. Lane C.4 being closed means the DA-MCP-Cortex Group 4 cross-client verification and Codex CDX-9 (DA-5 render pipeline, shipped in #51) are unblocked. cc-agent-AC: QA-17 (#64), api-server import migration (#65), and the `@workspace/empressa-atom` retirement (#67) all merged; dispatch queue empty, no current dispatch. QUEUED, not yet fireable: ECI atomization P1 ([`_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md`](_dispatches/2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED.md)) — gated on Nick creating the `empressa-atom-internal` repo and a cc-agent seat freeing. QA-20 routed into cc-agent-E Lane E Phase E1.
- **Circle is the v1 fiat rail** per `_decisions/2026-05-21_fiat_rail_circle.md`. The fiat rail is a near-greenfield Circle build, not a single TODO.
- **Revenue-routing gap** — substrate-enforced revenue share has no code in the SDK. Designed, not built. Needs a Wave 2 build line.
- **ICC API access** — Nick is pursuing it. It unblocks Lane E Phase E1 (the Layer 1 model-code base, ADR-019).
- **Corpus refresh owed and now due** — Round Rock + Taylor + Leander are merged but not in the deployed corpus (3 cities). A `build-corpus-snapshot` refresh + retrieval-api redeploy is the batched step; the live catalog still serves only the original 5 jurisdictions. Operator-supervised deploy.
- **Four stray uncommitted files in cc-agent-C's `legacy-design-tools` clone** (surfaced 2026-05-22, cc-agent-C PR #70, per the workspace-ownership clause). Pre-existing modified-uncommitted test files predating the multi-dispatch session, not any current agent's work: `BriefingDivergencesPanel.test.tsx`, `EngagementDetail.test.tsx`, `SiteContextTab.test.tsx` (all `artifacts/design-tools/src/pages/__tests__/`), and `lib/db/src/__tests__/integration/schema.integration.test.ts`. Kept out of every branch via explicit per-path `git add`. Inert, but should be reconciled or discarded — possibly the operator's own WIP.
- **Doc-set staleness gap, pre-courier-protocol work** (surfaced 2026-05-22). Lane C.4 shipped 2026-05-20 (legacy-design-tools PRs #46/#51) but `42_design_accelerator_program_plan.md` still called it "the remaining build" in its 2026-05-21 edit, and the planner re-dispatched already-done work off it. The `_inbox/` courier protocol began 2026-05-21; cc-agent work merged around 2026-05-19/20 did not all reach the doc set. **Reconciled 2026-05-22:** `42`'s Lane C status block and the DA-4/5/6 rows were corrected against the verified legacy-design-tools PR history (Lane C.2/C.3/C.4 all shipped 2026-05-19/20, PRs #35-#51); `11` checked clean; hauska-mcp-server (Lane B + Lane M, #1-22) and hauska-engine (Lane A.2 + Lane E, #1-23) PR histories cross-checked current. A full project-refresh of the remaining sprint docs (`48`, `51`) was not done and is the residual risk. Planner discipline: verify a stream's status against the live repo (`gh pr list`) before dispatching or re-activating, not the doc set alone.
- **plan-review has no app shell** (surfaced 2026-05-21, cc-agent-C PR #68). QA-15 needed the header-bell prop at 14 `DashboardLayout` call sites because plan-review, unlike design-tools, has no shell component. A `PlanReviewShell` wrapper is the right cleanup; logged as tech debt, low priority.
- **Residual `@workspace/empressa-atom` doc-comments** (surfaced 2026-05-21, cc-agent-AC PR #67). After the ADR-018 retirement, stale prose references to the removed package remain in `lib/codes`, `artifacts/design-tools`, `lib/comment-letter`, the generated `lib/api-zod` / `lib/api-client-react` files, `lib/api-spec/openapi.yaml`, and `docs/deploy.md`. Cosmetic only, not imports; the generated files should be fixed at the api-spec source, not hand-edited. Optional tiny follow-up, a candidate for cc-agent-AC's now-empty queue.
- **IP-memo ingestion gate fully retired** — the Texas IP attorney memo is parallel bizops tracked in `72`, not a gate on substrate ingestion. The stale gate language in 11/73/18/13 was corrected 2026-05-21; `51` was already corrected 2026-05-19.
