---
decision_id: 2026-09-11_overseer_dispatch_planner_lane_topology
date: 2026-09-11
owner: Nick (operator); recorded by the integration seat
status: active (go 2026-09-11 evening, with the first dispatch-planner dispatch)
related_canonical:
  - 90_operations/OPS-23_surface_completion_program
  - 90_runbooks/AGENT_CONTRACT
  - 62_seat_topology
  - _decisions/2026-09-01_seat_queue_protocol
  - ENFORCEMENT
---

## Decision

Three roles for the surface-completion program and, if it holds, for every program after it.
An **overseer** (the integration seat) that owns the plan, the rulings, the probe instrument and
every doc_repo commit, and that reads only close artifacts, probe output and checkpoints. A
**dispatch planner** that compiles and hand-carries dispatches, runs the adversarial checkpoints
on lane output, and is replaced at a written checkpoint rather than extended. **Lanes** that do
the work one row at a time and never touch doc_repo. The plan document is the only state; a
dispatch planner that knows something the plan and the missions do not is the defect.

Operator's framing: "You are the overseer keeping things on track, we have another planner that
is running the dispatches, and the dispatch agents are doing the heavy lifting as one-off agents.
Keep your context window as fresh as possible."

**Activated 2026-09-11.** The operator's go arrived as the instruction to dispatch OPS-23 wave 1
(P-155, P-157, P-158, P-159, P-167, the rows with no dependency) as one dispatch to a sub-planning
agent that spawns sub-agents, manages the wave, and reports back to the overseer's thread. The
dispatch-planner seat is registered in `_catalog/seat_register.json` as `dispatch-planner` the same
day, with its own doc_repo worktree and namespace; it compiles and writes there and never commits.
The first checkpoint is due after three closes per OPS-23 section 6.

## Context

The lanes have been the healthy part of the machine and the planner the degrading part. OPS-21
counted eleven planner errors, all caught by lanes or peers and none by the planner re-reading
its own work; ENFORCEMENT.md records the error rate rising in the last third of long sessions.
The 2026-09-11 session found the same shape again at the program level: OPS-21's completion was
measured at cortex and stated for the product.

## Structural commitment check

This is an operating decision, not a product one. It touches commitment 2 indirectly: a claim's
instrument is part of the claim, and a fresh planner that runs the instrument is a better
instrument than a deep-context planner that remembers the answer.

## Reasoning

The recommendation is yes, with three conditions that make the middle layer worth its joint.
First, the dispatch planner is stateless between turns by construction: it reads the plan, the
missions, and the last checkpoint, and it writes closes and checkpoints; it may not carry a
ruling that is not in a decision record. Second, verification is never delegated below the
overseer's instrument: the dispatch planner runs `surface-probe` and pastes its output; it does
not vouch. Third, the swap is on a trigger, not on exhaustion: every three closes, or the moment
the dispatch planner catches itself asserting the state of a repo it has not opened this
session. A second mechanism that would produce the same benefit is simply shorter overseer
sessions with the existing two-layer model; it was rejected because the overseer's context is
spent mostly on reading product repos to verify lanes, and the probe instrument is what removes
that cost, so the instrument is the load-bearing piece under either topology.

## Reversal criteria

Reverse if two consecutive checkpoints show the dispatch planner's error log empty while the
overseer's is not, which would mean the joint moved rather than shrank. Reverse also if a
successor dispatch planner cannot resume from a checkpoint without the predecessor's conversation
in fewer than three commands; then the checkpoint format, not the topology, is rebuilt first,
and the topology is reversed only if that fails twice.

## Dependencies

P-160 (the probe) and the checkpoint template in OPS-23 section 6. The dispatch planner seat must
be registered in `_catalog/seat_register.json` before its first dispatch.

## Counterparties

Internal. The operator hand-carries dispatches between the dispatch planner and lanes until a
seat can do so.
