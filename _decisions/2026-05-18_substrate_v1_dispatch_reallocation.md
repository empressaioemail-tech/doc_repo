---
decision_id: 2026-05-18_substrate_v1_dispatch_reallocation
date: 2026-05-18
owner: nick
status: active
related_canonical: [51_substrate_v1_sprint, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close, _decisions/2026-05-18_hauska_mcp_server_dedicated_repo, _decisions/2026-05-18_eci_registry_naming, 80_adrs/adr_018_atom_contract_substrate_layer]
---

## Decision

Two paired decisions reshape the substrate v1 sprint dispatch.

First, reallocate stream-level dispatch from the prior cross-repo doubling at [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](2026-05-18_substrate_v1_dispatch_allocation.md) to per-repo single-agent ownership. Each Cursor terminal holds one repo; one cc-agent owns the streams within that repo. New allocation: planner (this Claude Code session) in `doc_repo` owns Bump 1 cross-repo PR rollout plus sync points 4 and 5 launch gates; cc-agent-AC in new `empressaioemail-tech/hauska-atom-contract` owns M2-C extraction and `@hauska/atom-contract@1.0.0` publication; cc-agent-E in `empressaioemail-tech/hauska-engine` owns Streams 1A through 1D per within-track sync points; cc-agent-M in `empressaioemail-tech/hauska-mcp-server` owns Streams 2A through 2D against mocks until Sync 3 then real wiring.

Second, ratify `@hauska/atom-contract` source-repo placement as a dedicated repo at `empressaioemail-tech/hauska-atom-contract`. ADR-018 named the package as M2-C extraction target and framed it as peer Hauska substrate alongside `hauska-engine` and `hauska-mcp-server` but did not explicitly settle source-repo placement post-extraction. Dedicated-repo placement chosen.

## Context

The prior dispatch allocation at [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](2026-05-18_substrate_v1_dispatch_allocation.md) doubled the eight parallel streams of [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) across four cc-agents by stream-pair, with each cc-agent owning one Track 1 stream and the matching Track 2 stream across both repos. The four pasteable kickoff prompts at [`_dispatches/`](../_dispatches/) followed that allocation, assigning each cc-agent across both `hauska-engine` and `hauska-mcp-server` repos (every prompt's frontmatter reads `repo: hauska-engine + hauska-mcp-server`).

Operator-side review surfaced the structural mismatch. Cursor terminals are one-per-repo; each terminal can run multiple Claude Code agents, but a single Claude Code agent cannot work across multiple repos in parallel. The cross-repo doubling axis was incompatible with the execution environment. Three additional considerations weighed for the corrected per-repo allocation. First, single linear branch history per repo eliminates within-repo coordination cost between parallel agents touching adjacent files. Second, the workspace hygiene risk class documented at [`00_current_state.md`](../00_current_state.md) §6 (four wrong-branch / detached-HEAD / shared-working-tree incidents across cc-agent-1/2/3 in the smartcity sprint; runbook `90_runbooks/agent_workspace_hygiene.md` queued) disappears when one agent owns one repo. Third, the Claude-Code-in-repo strategic-agent pattern adopted 2026-05-16 (per [`00_current_state.md`](../00_current_state.md) §6, proven across five sessions) is the natural shape for sprint-scoped per-repo ownership.

`@hauska/atom-contract` source-repo placement was the second open question this session. ADR-018 names it as M2-C extraction target and frames it as peer Hauska substrate alongside `hauska-engine` and `hauska-mcp-server`, but did not explicitly settle source-repo placement post-extraction; current location is workspace-private inside `legacy-design-tools/lib/empressa-atom/` (per [`adr_018:21`](../80_adrs/adr_018_atom_contract_substrate_layer.md#L21)). Dedicated-repo placement chosen following two same-day precedents: the 2026-05-18 hauska-mcp-server dedicated-repo decision (per [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](2026-05-18_hauska_mcp_server_dedicated_repo.md)) and the 2026-05-18 ECI atomization sprint kickoff `@empressaio/atom-internal` dedicated-repo decision (per [`_decisions/2026-05-18_eci_registry_naming.md`](2026-05-18_eci_registry_naming.md)). Substrate-shape does not fit naturally inside any product repo; the published-consumer story is cleaner from day one.

## Structural commitment check

Premortem clear across all four structural commitments. The reallocation does not change underlying scope; only execution allocation. Cost-per-jurisdiction (#3) tracking still lives in cc-agent-E's Stream 1D ownership including the 3-county hard-kill checkpoint. Quality gate (#1) sources, citations, confidence scores remain intrinsic to the substrate per ADR-001. Partnership-first sourcing (#2) and MCP-first dual interface (#4) unchanged.

Catalog-thesis check aligned. `@hauska/atom-contract` dedicated repo carries Hauska commercial-substrate brand placement (peer to `hauska-engine`, `hauska-mcp-server`, `hauska-sdk`). Per-repo allocation matches the in-repo strategic-agent pattern adopted 2026-05-16. No new tier-model or pricing implications.

## Reasoning

Three substantive points.

First, parallelism trade. The prior allocation assumed eight-way parallelism across the eight 51-designed streams. Per-repo allocation reduces this to four-way parallelism (one agent per repo: planner, cc-agent-AC, cc-agent-E, cc-agent-M). Within-track sync points in Track 1 (1A → 1B → 1C → 1D via sync points 2 and 3 plus storage-from-atoms dependency) already serialize much within-track work; cc-agent-E running streams in sequence loses less parallelism than the 51-design implied. Track 2 streams (2A through 2D) all proceed against mocks until Sync 3 per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points, so cc-agent-M's sequential ownership within hauska-mcp-server is a clean fit. Within-repo doubling (two agents per repo, paired across adjacent streams) was considered as a middle ground; rejected on the workspace-hygiene merge-cost argument plus the lean-shop posture.

Second, M2-C extraction as cc-agent-AC's first session. The hauska-atom-contract repo bootstrap plus port of the workspace-private contract source from `legacy-design-tools/lib/empressa-atom/` plus rename to `@hauska/atom-contract` plus publication of v1.0.0 to npm is one concentrated piece of work that drives Sync 1 (atom contract published). Planner-owned Bump 1 cross-repo PR rollout follows publication: planner opens pin-update PRs in legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server (single PR per repo, atomically merged per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1).

Third, dispatch-prompt re-shape. The four existing prompts at [`_dispatches/`](../_dispatches/) status-flip to superseded with one-line top callout pointing at the replacement prompts; per CLAUDE.md retire-by-status-flip rule. Three new prompts replace them: `cc-agent-AC_hauska_atom_contract.md`, `cc-agent-E_hauska_engine.md`, `cc-agent-M_hauska_mcp_server.md`. No new prompt needed for planner (this agent).

## Reversal criteria

Per-decision reversal triggers.

For the per-repo allocation. (a) Revisit if cc-agent-E's serial ownership of four streams within hauska-engine proves slower than tolerable for the sprint window and explicit within-repo parallelism becomes worth the merge cost. (b) Revisit if any cc-agent's context budget proves insufficient for the full repo's stream set, in which case split that repo into two cc-agents along the natural within-track seam (e.g. 1A+1B and 1C+1D for hauska-engine). (c) Revisit if Cursor's per-terminal-per-repo constraint relaxes such that one agent could span repos cleanly.

For the dedicated-repo placement. (a) Revisit if M2-C extraction reveals tighter coupling to legacy-design-tools than the recon evidence suggested and co-location proves cheaper than dedicated-repo cost. (b) Revisit if a future substrate-monorepo decision unifies `@hauska/atom-contract` with `@hauska-sdk/*` and `hauska-engine`. (c) Revisit if the Hauska Inc. GitHub-org strategy at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Entity status section requires relocating substrate-shaped repos.

For planner-owned Bump 1 coordination. Shift to cc-agent-AC if planner-side bandwidth becomes the bottleneck on cross-repo PR rollout.

## Dependencies

Depends on [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](2026-05-18_substrate_v1_phase_0_close.md) which unblocked stream-level dispatch. Supersedes [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](2026-05-18_substrate_v1_dispatch_allocation.md) (status-flipped to superseded in same commit; the prior decision's reasoning is preserved as the rejected-alternative record). Builds on [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](2026-05-18_hauska_mcp_server_dedicated_repo.md) and [`_decisions/2026-05-18_eci_registry_naming.md`](2026-05-18_eci_registry_naming.md) as same-day dedicated-repo precedents. Unblocks new dispatch prompts at [`_dispatches/2026-05-18_cc-agent-AC_hauska_atom_contract.md`](../_dispatches/2026-05-18_cc-agent-AC_hauska_atom_contract.md), `cc-agent-E_hauska_engine.md`, `cc-agent-M_hauska_mcp_server.md`. Gates cc-agent-AC dispatch on Nick creating the `empressaioemail-tech/hauska-atom-contract` GitHub repo.

## Counterparties

Internal: Nick (operator; creates the new `empressaioemail-tech/hauska-atom-contract` GitHub repo, then pastes the three kickoff prompts into respective Cursor sessions). cc-agent-AC, cc-agent-E, cc-agent-M (consumers of the new per-agent prompts). Planner / this Claude Code session (Bump 1 cross-repo PR coordinator across legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server; sync 4 and 5 launch-gate co-owner).

External: Texas IP attorney for memo delivery (Sync 6 input; unchanged from prior allocation); no other external counterparties affected by this reallocation.
