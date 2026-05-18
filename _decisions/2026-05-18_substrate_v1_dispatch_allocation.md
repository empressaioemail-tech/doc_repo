---
decision_id: 2026-05-18_substrate_v1_dispatch_allocation
date: 2026-05-18
owner: nick
status: superseded
superseded_by: _decisions/2026-05-18_substrate_v1_dispatch_reallocation
related_canonical: [51_substrate_v1_sprint, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_phase_0_close, _decisions/2026-05-18_substrate_v1_dispatch_reallocation]
---

> **Superseded 2026-05-18** by [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](2026-05-18_substrate_v1_dispatch_reallocation.md). Operator-side review surfaced that the cross-repo doubling axis below is incompatible with Cursor's one-terminal-per-repo execution model. Reallocated to per-repo single-agent ownership: cc-agent-AC (hauska-atom-contract), cc-agent-E (hauska-engine; all of Track 1), cc-agent-M (hauska-mcp-server; all of Track 2). Reasoning preserved here as rejected-alternative record.

## Decision

Allocate the substrate v1 sprint's eight parallel streams across four cc-agents by doubling. Each cc-agent owns one Track 1 stream and the matching Track 2 stream. Pair structure: cc-agent-1 (1A + 2A: input boundaries and tool wiring); cc-agent-2 (1B + 2B: schema and access control); cc-agent-3 (1C + 2C: data layer and telemetry); cc-agent-4 (1D + 2D: quality and production posture). Planner (this Claude Code session) retains Bump 1 atom contract coordination and sync points 4 and 5 (launch gates).

## Context

[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) designs the sprint around eight parallel streams (four per repo) with eight cc-agents implied. The current agent fleet at [`00_current_state.md`](../00_current_state.md) §4 lists cc-agent-1 through cc-agent-4 (Cursor Claude Code). Three bridging options were considered. Sequential waves of four streams at a time would serialize work and undercut the parallel-from-start design. Expanding to eight cc-agents would add fleet overhead (per-agent context budgets, dispatch coordination cost, deduplication) against the lean-shop posture. Doubling fits naturally because [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points across tracks explicitly notes Tracks 2A through 2D proceed against mocked or staged backends before sync point 3 (retrieval API contract from Stream 1C) lands, so all eight streams can start concurrently.

## Structural commitment check

Premortem clear. The most load-bearing commitment for this allocation is #3 (cost per jurisdiction onboarded; hard kill at three counties). Doubling does not affect cost-per-jurisdiction math directly; the relevant cost ceiling lives in Stream 1D's per-jurisdiction tracking which cc-agent-4 owns. Focus queue rule clear: this allocation operates within the active substrate v1 sprint, not outside it. Quality gate rule clear: all stream outputs carry the ADR-001 four-layer contract (identity, context interface, composition, history) which is intrinsic to the substrate.

## Reasoning

Three substantive points. First, parallel feasibility. Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points the Track 2 streams (2A through 2D) all proceed against mocked or staged backends before sync point 3. Real wiring follows the moment Stream 1C (cc-agent-3) publishes the retrieval API contract. Doubling does not delay Track 2 work; it concentrates ownership.

Second, coherence per slice. Stream pairings reflect natural domain coupling. Stream 1A (adapter framework plus pipeline runner) and Stream 2A (MCP backend coupling plus tool surface) both define input boundaries: 1A is jurisdiction-source-to-pipeline, 2A is MCP-tool-to-engine. Stream 1B (structural extraction plus atomization) and Stream 2B (auth plus rate limit plus Stripe scaffold) both deal with schema and access control: 1B owns the atom schema, 2B owns the API access schema. Stream 1C (storage plus index plus identity plus retrieval API) and Stream 2C (logging plus observability plus dashboards) both work the data layer: 1C is the substrate write and read path, 2C is the substrate observation path. Stream 1D (eval plus curated queries plus batch ingest) and Stream 2D (deploy plus docs plus cross-client plus launch) both own quality and production posture: 1D gates ingest by quality, 2D gates public surface by quality.

Third, planner role. Bump 1 atom contract coordination per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 explicitly names a planner coordinator role across all five consumer repos. Sync points 4 (first jurisdiction passes eval) and 5 (20-jurisdiction corpus quality-gated) are cross-track launch gates that bridge cc-agent-4's Track 1 work to its Track 2 work plus the public-launch announcement, which planner runs. Naming planner as coordinator for these sync points avoids ambiguity at the critical-path moments.

## Reversal criteria

Revisit if (a) any cc-agent's combined Track 1 plus Track 2 context budget proves insufficient for parallel ownership, in which case expand the fleet to allocate that pair across two agents; (b) cross-track coordination overhead within a single agent's slice creates dispatching friction, in which case re-split per-stream; (c) one agent's pair turns out structurally less parallel than designed, for example 1D batch ingest and 2D launch coordination prove to require sequential rather than parallel ownership; or (d) Nick's lean-shop posture relaxes and fleet expansion to eight is preferred for other reasons.

## Dependencies

Depends on [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](2026-05-18_substrate_v1_phase_0_close.md) which closed Phase 0 and unblocked stream-level dispatch. Unblocks the four per-agent dispatch prompts at `_dispatches/2026-05-18_cc-agent-*.md` filed in this session. Coordinates with the Texas IP attorney memo external dependency (sync point 6) which Nick owns and which gates cc-agent-4's Tier 1 plus 2 plus 3 batch ingest beyond Bastrop and Grand County.

## Counterparties

Internal: Nick (operator; pastes the four dispatch prompts into cc-agent Cursor sessions). cc-agent-1 through cc-agent-4 (consumers of the per-agent prompts). Planner / this Claude Code session (Bump 1 coordinator; sync 4 and 5 owner).

External: Texas IP attorney for memo delivery (sync point 6 input); no other external counterparties affected by this allocation decision.
