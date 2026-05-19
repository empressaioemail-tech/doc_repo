---
id: agent_workspace_hygiene
title: Agent workspace hygiene — one clone per agent, never two agents against one working tree
status: active
last_updated: 2026-05-19
applies_to: portfolio
related: [CLAUDE.md, 00_current_state.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _decisions/2026-05-19_sync_4_5_and_cortex_sprint]
---

# Agent workspace hygiene

> **The rule.** One git clone per cc-agent. Never two agents against the same working tree. Cross-repo work goes through worktrees or separate clones, never via the working directory another agent owns.

This runbook codifies a hygiene rule that has been flagged by multiple cc-agents across multiple sessions (cc-agent-M plus cc-agent-E in the 2026-05-19 Lane B / Lane A.2 race; same shape surfaced in the 2026-05-19 wind-down). The pattern is recurring; the cost of a bad de-tangle is real (`git reset --hard` can destroy uncommitted working-tree changes that another agent is mid-edit on). Writing the rule down stops it from re-surfacing.

## The rule

1. **One clone per cc-agent.** When the operator dispatches cc-agent-X against repo `foo`, that agent owns `clones/foo-cc-agent-X/` (or equivalent path). No other agent touches that directory.
2. **Cross-repo work uses worktrees or separate clones.** If cc-agent-M needs to make a change in hauska-engine while cc-agent-E is also actively working there, cc-agent-M creates a git worktree from a separate clone: `git worktree add ../hauska-engine-cc-agent-M-stream-2 origin/main`. Worktrees share git history with the parent clone but have independent working trees and HEAD states.
3. **No exceptions for "small" cross-repo edits.** A one-line fix in another agent's repo is still a working-tree change. Even a "quick rebase" by Agent A on Agent B's clone violates the rule. Open a PR from your own clone or worktree instead.
4. **Recon-time refusal.** When an agent enters a working directory and sees evidence of another agent (branch they don't recognize at HEAD, uncommitted changes from a different session, .git/index modifications they didn't make), the agent refuses to proceed and surfaces to the operator / planner instead of attempting a `git status`-driven recovery.

## Why this matters

Shared working-tree incidents to date (chronological):

1. **2026-05-11 — A.6 / A.8 parallel-attempt collision.** Two cc-agents working SmartCity OS dispatches simultaneously from one clone; HEAD state collided mid-edit. Both recovered cleanly but the operator had to mediate.
2. **2026-05-19 — Substrate v1 wind-down.** cc-agent-M's hauska-engine fix `d55d51d` pushed alongside cc-agent-E's then-unpushed `4256bf2` from a shared working tree. cc-agent-E's session A acknowledgement names the pattern as needing a flag-through-repo-owner rule.
3. **2026-05-19 — Lane B / Lane A.2 race.** cc-agent-M and cc-agent-E ran against the same hauska-engine clone simultaneously. Shared git HEAD switched under cc-agent-M three times. cc-agent-M's commit briefly misplaced onto main (caught and moved). `git reset --hard origin/main` (cc-agent-M's recovery) could have destroyed cc-agent-E's uncommitted working-tree changes if any had existed at that instant. Both agents flagged independently.

The pattern is structural, not incidental. The fix is procedural: separate working trees.

## The mechanics

### Pattern A — One clone per agent (default)

For agents dispatched against a single repo for the duration of a sprint:

```
clones/
├── hauska-atom-contract/                 # cc-agent-AC's clone
├── hauska-engine-cc-agent-E/             # cc-agent-E's clone
├── hauska-mcp-server-cc-agent-M/         # cc-agent-M's clone
└── legacy-design-tools-cc-agent-C/       # cc-agent-C's clone
```

Each cc-agent's Cursor terminal pins to its own clone. No two terminals share a path.

### Pattern B — Worktrees for cross-repo work

When agent X needs to touch repo Y where another agent already lives:

```bash
# From cc-agent-M's clone of hauska-mcp-server, when cc-agent-M
# needs to make a fix to hauska-engine while cc-agent-E is actively
# working there:
cd clones/hauska-engine-cc-agent-E
git fetch origin
git worktree add ../hauska-engine-cc-agent-M-feat-accesspolicy origin/main
cd ../hauska-engine-cc-agent-M-feat-accesspolicy
# now cc-agent-M operates here; cc-agent-E continues in
# clones/hauska-engine-cc-agent-E unaffected
```

After the cross-repo PR merges:

```bash
git worktree remove clones/hauska-engine-cc-agent-M-feat-accesspolicy
```

Worktrees share the underlying `.git/objects/` (cheap on disk, fast to create) but have fully independent working trees, HEAD pointers, and indexes. Two agents in two worktrees of the same clone do not collide.

### Pattern C — Fully separate clones (heavy cross-repo work)

If an agent will live in a cross-repo for more than a one-shot fix, give it its own clone:

```bash
git clone https://github.com/empressaioemail-tech/hauska-engine.git \
  clones/hauska-engine-cc-agent-M-extended
```

Same shape as Pattern A; the cost is a duplicate `.git/` directory.

## Dispatch boilerplate

Add this clause to every cc-agent dispatch under §Read first or §Scope:

> **Workspace ownership.** cc-agent-{X} owns the `{repo}` working tree at `clones/{repo}-cc-agent-{X}/` for the duration of this dispatch. Cross-repo work touching other repos uses `git worktree add` from a separate clone, not the working directory of another agent. If you enter a working directory and see evidence of another agent (unrecognized HEAD, uncommitted changes you didn't make), refuse to proceed and surface to the planner.

## Recovery if the rule was violated

If two agents have been operating against the same working tree and surfaced a collision:

1. **Stop.** Don't run `git reset --hard` or `git checkout` without coordination — those operations destroy uncommitted work.
2. **Surface both agents' state to the planner / operator.** `git status` from the shared working tree, plus each agent's mental model of what they intended.
3. **Identify whose commits are intended on which branch.** Agent A's commits on Agent B's branch need to move to Agent A's branch via `git cherry-pick` from a separate clone, or via a hand-rolled rebase.
4. **De-tangle from separate working trees going forward.** Even mid-incident, switch to Pattern B (worktrees) so the cleanup itself doesn't compound the problem.
5. **Capture the incident in a session summary.** Pattern recurrence comes from absent documentation; each incident should produce an explicit "what went wrong + what we did to recover + what the rule says going forward" note.

## When this rule does not apply

- **Read-only inspection.** Two agents reading the same repo (no `git add`, no `git checkout`, no working-tree changes) does not violate the rule. The rule is about write operations against a shared working tree.
- **Single-agent sequential work.** One agent in one terminal sequencing dispatches against one clone is the normal pattern; the rule only applies to *parallel* agents.
- **Operator manual recovery.** If the operator personally needs to fix something in an agent's working tree (e.g., the agent is stuck and the operator needs to surgical-edit), that is a coordinated handoff, not a parallel-agent collision.

## Cross-references

- [`CLAUDE.md`](../CLAUDE.md) — operator instructions; the workspace hygiene rule is operational not strategic, lives in this runbook rather than CLAUDE.md proper.
- [`00_current_state.md`](../00_current_state.md) §6 watch list — agent workspace hygiene investigation status.
- [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md) — per-repo single-agent ownership ratified at the substrate v1 dispatch level; this runbook generalizes the same shape to all cross-repo work.
- [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) §Sprint amendments — the worktree rule entered the dispatch boilerplate for the combined Cortex/Codex sprint.

## Revision history

- **2026-05-19 (origin):** rule codified after three flagged incidents (2026-05-11, 2026-05-19 wind-down, 2026-05-19 Lane B / Lane A.2 race). Operator confirmed codification path per AskUserQuestion 2026-05-19.
