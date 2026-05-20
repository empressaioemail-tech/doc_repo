---
id: 2026-05-20_lane_c_4_close_amendment_8_group_4_prep_claude_code
title: Session — Lane C.4 close + Sprint Amendment 8 (contract extensions ratified) + Group 4 prep absorbed + cc-agent-M follow-on prompt
date: 2026-05-20
agent: planner
repo: docs
session_type: execute
rolled_up: false
rolled_up_into: []
related:
  - _decisions/2026-05-19_sync_4_5_and_cortex_sprint
  - _research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M
  - _sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M
  - _dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces
  - 27_engine_evolution_plan
  - 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover
---

## TL;DR

Lane C.4 closed 2026-05-20 via PR #46 (L1) + PR #51 (consolidated L2-L6) on `legacy-design-tools` main; C.3 + C.2 operator-pending PRs also cleared this morning. cc-agent-C's PR #51 body surfaced seven items split into three buckets: three contract extensions ratified as in-scope via Sprint Amendment 8 (L3/L6 read + download endpoints, BaseAtomInstance field convention, event-casing-to-dots + L1 transitions + L4 events); four acknowledged non-blocking v1 limitations (task #29 dual-auth fail-closed, L2a/L2b producer stubs, L5 ICC-ES best-effort, L6 DOCX minimal); two operational env-var requirements added to the cutover runbook (`SERVICE_API_KEY`, `ICC_ES_REPORT_URL_TEMPLATE`). Group 4 prep absorbed — cc-agent-M's session file landed in doc_repo (PR #12 on hauska-mcp-server ships legacy-schemas.ts + contract-conformance test + cross-mirror leg 1 clean). cc-agent-M follow-on prompt handed to operator for the three new MCP tools that match the C.4 contract extensions; Group 4 e2e gates on that landing + cutover.

## What was done

### Verified sprint state via gh

PRs all merged this morning:
- legacy-design-tools #42 (reclassify UI) merged 01:03Z
- legacy-design-tools #43 (EngagementDetail split) merged 01:04Z
- legacy-design-tools #39 + #40 (C.2 cutover prep) merged 01:03Z
- legacy-design-tools #46 (L1 endpoints + UI) merged 02:53Z
- legacy-design-tools #51 (consolidated L2-L6 endpoints + UI) merged 10:25Z

Lane state: A done; B Groups 1+2+3+5 done, Group 4 prep done (PR #12 hauska-mcp-server, awaiting operator review/merge); C done. Cutover + Group 4 e2e are what's left.

### Ratified Sprint Amendment 8

Three contract extensions cc-agent-C surfaced in PR #51 body, all ratified as in-scope:

1. **L3/L6 read + download endpoints** beyond the original contract — `GET /api/engagements/:engagementId/deliverable-letters` (list), `GET /api/deliverable-letters/:letterId` (fetch), `GET /api/deliverable-letter-renders/:renderId/file` (byte-serve download). UIs needed them; the original contract was write-path-only. Ratification reason: symmetric capability IS dual-interface coherence per the sprint thesis. cc-agent-M follow-on dispatch (prompt handed to operator below) grows `legacy-client.ts` + adds three matching MCP tools before Group 4 e2e fires.
2. **BaseAtomInstance field convention codified** — every L-atom instance carries `sourceAdapter` / `sourceUrl` / `contentHash` / `fetchedAt` provenance fields, centralized in `legacy-design-tools/lib/lSurfaceAtom.ts`. L5 `sourceUrl` carries the ICC-ES report URL.
3. **Event-casing dot form + L1 transitions + L4 events filled** — events use `<atom-type>.<verb>` (e.g., `response-task.opened`); L1 transition table documented (open → in-progress → done | cancelled; transitions back from done/cancelled forbidden, 409 `response_task_transition_forbidden`); L4 gains `detail-callout-spec.revised` + `detail-callout-spec.aps-ref-attached` events.

Four other PR #51 items acknowledged as v1 limitations, NOT contract drift: task #29 dual-auth fail-closed in prod (SPA session path); L2a structured-annotation extractor stub + L2b attached-document no producer (engine-side post-sprint follow-on); L5 ICC-ES best-effort with `ICC_ES_REPORT_URL_TEMPLATE` env var; L6 DOCX minimal OOXML (QA-cycle polish).

### Doc updates

- `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md` — frontmatter status flipped to "GROUP 3 + LANE C.4 COMPLETE"; new amendment callout near top listing the 3 extensions + their rationale; 3 new endpoint sections (L3 list + fetch; L6 download); bottom Status section rewritten with per-surface live state + non-blocking follow-on pointers.
- `_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md` — Sprint Amendment 8 appended after Amendment 7 (which I had to reorder mid-session — wrote Amendment 8 in the wrong spot at first; chronological order now correct).
- `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` — Stage 0 gains two new env-var checklist items (`SERVICE_API_KEY` parity with MCP server `LEGACY_BACKEND_API_KEY`; `ICC_ES_REPORT_URL_TEMPLATE` operator-tunable per PR #51 note 5).
- `27_engine_evolution_plan.md` — `sheet-content-extraction` atom entry gains a "Status note (2026-05-20, post-Lane-C.4)" capturing the L2a/L2b producer stub status + engine-side follow-on framing.
- `00_current_state.md` — `last_updated` line extended additively (parallel planner thread had already extended it with commercialization-roadmap context this morning; I preserved that and added today's Lane C.4 close + Amendment 8 + Group 4 prep capture).
- `_sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M.md` — landed (cc-agent-M wrote the file but did not commit it per workspace-hygiene rule; planner commits in this batch).

### cc-agent-M follow-on prompt handed off

The follow-on extends `legacy-client.ts` with the 3 new endpoint methods (deliverable-letters list, fetch, render-download byte-serve) and adds 3 new MCP tools (`cortex_deliverable_letter_list`, `cortex_deliverable_letter_fetch`, `cortex_deliverable_letter_render_download`). Small bounded extension; the contract is final post-Amendment-8; cross-mirror conformance test pattern (Path A from Amendment 7) extends to cover the new shapes. Pre-Group-4 work.

## What was learned (changes to ground truth)

**Contract drift surfacing pattern proved out twice now.** cc-agent-C's PR #51 body is exemplary planner-discipline behavior — surface the structural items (read endpoints needed, field convention extended, event taxonomy filled) explicitly rather than absorbing silently. Combined with the Amendment 6 + 7 lessons captured this sprint, the pattern is durable: when an implementing agent's reality diverges from the contract, route to the planner with the divergence framed cleanly. The contract owns the canonical seam; the planner ratifies extensions; the consumer agents catch up. cc-agent-M's `legacy-client.ts` will extend per the planner's ratified contract, not per a side-channel between agents. This keeps the three-mirror reality bounded.

**Auth-axis vs tier-axis is orthogonal in v1.** cc-agent-M's session summary surfaced (carrying from Group 5) that "Layer 2 paid" enforcement runs through the product binding on the API key, not a runtime tier check. A key minted as `product=codex` reaches Codex tools regardless of tier band; tier governs rate-limit bands only. This is correct for v1 (a Codex/Cortex key is a paid-product key by how it's minted), but worth flagging at billing-design time: if billing ever needs paid-vs-free enforcement INSIDE a product axis (e.g., free Cortex tier vs paid Cortex tier), that's a new runtime check, not an extension of the current product gate. Same shape of concern as the Group 5 free-tier-sees-platform-internal flag — both belong in the same "tier-model refinement before public signups go live" thread.

## What's still open

- **cc-agent-M contract-extension follow-on** (prompt handed to operator). Gates Group 4 e2e in v1 scope (symmetric capability path); does NOT gate cutover.
- **Stage 0 cutover carry-forwards** — all four still open per operator confirmation: object-storage bucket strategy (reuse existing GCS vs new bucket); `SNAPSHOT_SECRET` rotate-or-remove resolution; `psql` / `pg_dump` client install on the operator workstation; smartcity-os admin gcloud account active. Plus the two new Amendment 8 env-var requirements (`SERVICE_API_KEY` + `ICC_ES_REPORT_URL_TEMPLATE`).
- **Cutover (Stage 9)** — operator-led; gates on Stage 0 cleared + Lane A + B + C closed (closed except cc-agent-M follow-on for Group 4 e2e symmetry).
- **Group 4 e2e** — fires per the 9-item runbook in `_sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M.md` after cc-agent-M follow-on lands + cutover executes.
- **Sprint close session summary** — when Stage 9 cutover lands.
- **Acknowledged v1 limitations** (PR #51 items 2/4/5/6) — not sprint blockers; route as post-sprint engine work (L2a/L2b in 27 Stream B) + legacy-design-tools task #29 (dual-auth) + QA-cycle work (L6 DOCX polish; L5 ICC-ES tightening when partnership lands).
- **Auth-tier flag** for planner refinement: tier-axis enforcement inside the product axis (per cc-agent-M's Group 5 + Group 4 prep notes). Not urgent; touch at billing-design time.

## Suggested canonical doc updates

None this session beyond what's already in scope. The commercialization roadmap (`16_commercialization_roadmap.md`) landed in a parallel planner thread this morning (commit `cff6779`) and references cc-agent-M Streams 2C+2D launch prep — that's a parallel thread and not affected by this session's Lane C.4 close.

## Commit batch

One commit covering:

- `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md` (status flip + Amendment 8 callout + 3 new endpoints + Status section rewrite)
- `_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md` (Sprint Amendment 8 appended chronologically after Amendment 7)
- `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` (Stage 0 gains 2 env-var checklist items)
- `27_engine_evolution_plan.md` (L2 atom status note for post-Lane-C.4 producer stub framing)
- `00_current_state.md` (`last_updated` additive extension preserving parallel-thread context)
- `_sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M.md` (cc-agent-M's Group 4 prep summary + 9-item e2e runbook — landed per the workspace-hygiene-rule planner-commits convention)
- `_sessions/2026-05-20_lane_c_4_close_amendment_8_group_4_prep_claude_code.md` (this session summary)
