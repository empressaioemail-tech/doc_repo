---
decision_id: 2026-09-12_one_traffic_shift_at_a_time_per_service
date: 2026-09-12
owner: Nick (operator); recorded by the integration seat
status: active
related_canonical:
  - 90_runbooks/AGENT_CONTRACT (section 3, deploy-traffic lease)
  - 90_operations/OPS-16_texas_market_plan_of_record (A-132, P-170)
  - _inbox/2026-09-11_p155-feasibility_close.json
  - _inbox/2026-09-11_ops23-wave1_close.json
---

## Decision

One traffic shift at a time per Cloud Run service. The dispatch planner grants and records a
per-service lease before any shift and releases it only after the serving revision has been
read by field name and the lane's probe has run against it. A shift without a lease is rogue
and is reverted. The contract clause lands now; the doc_repo hook that refuses the command
without a lease is P-170, and until it lands the planner's sequencing is the only control.

## Context

On 2026-09-11 the P-155 and P-159 lanes both shifted `hauska-engine-api` within minutes of
each other and production served each other's revision for several minutes until the P-155
lane noticed and re-deployed a revision carrying both fixes. The wave mission had already told
the planner to sequence engine-api deploys; prose did not bind.

## Reasoning

The atoms store has a write-slot lease (section 3) precisely because two writers on one scope
corrupt silently; a Cloud Run service's traffic is the same shape. A second mechanism, telling
every lane to deploy only from origin/main after merge, was already in place and did not
prevent the collision, because two merged branches deployed in either order still race.

## Reversal criteria

Reverse if the lease produces two consecutive waves in which a lane waited more than one
wall-clock hour for a service it needed while no other lane was shifting it; then the lease
scope is narrowed to a revision tag rather than removed.
