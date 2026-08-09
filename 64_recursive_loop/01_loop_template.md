---
id: 01_loop_template
title: Loop instantiation template — the repeatable worksheet
status: active
last_updated: 2026-08-02
applies_to: portfolio
owner: nick
related: [64_recursive_loop/00_recursive_loop_overview, 64_recursive_loop/02_selection_pressure, 64_recursive_loop/03_world_models, 64_recursive_loop/04_instantiations, 90_runbooks/fleet_memory_practice, 90_runbooks/wdll_practice]
---

# Loop instantiation template

This is the repeatable model. To put the recursive improvement loop on an artifact (an existing spine, a new app, a venture, the fleet itself), fill this worksheet completely and file the result as a section in [`04_instantiations.md`](04_instantiations.md). The worksheet is deliberately strict: an instantiation that cannot fill every field is not ready to claim the loop, and the empty field is the first work item.

## The worksheet

```markdown
## Loop instantiation: <artifact name>
Date: <date>  Status: draft | active | partial | dormant | arm's length

### Substrate
What durable state the artifact holds and where it lives.
(atoms, positions, parcels, dispatches, ledgers; name the actual stores)

### World model
What the artifact PREDICTS, not just what it records. See 03_world_models.md.
A fact store can be audited; only predictions can be calibrated.

### Compression ladder
The named rungs from raw event to mechanical guard, with the artifact's
actual mechanism at each rung. Mark rungs that do not exist yet.
  raw event        -> <mechanism>
  recorded lesson  -> <mechanism>
  durable rule     -> <mechanism>
  mechanical guard -> <mechanism>

### Coherence carrier
How a promoted lesson reaches every seat, agent, or service that could
repeat the mistake. Hand-carried is a valid answer only with a named plan
to make it structural.

### Selection pressure  (REQUIRED; no exceptions)
The ground-truth signal, its grade on the 02_selection_pressure taxonomy,
and the GATE that consumes it. An instantiation with no external ground
truth is rejected as a scan-fix loop, per the recorded post-mortem.
  signal:  <what settles the question>
  grade:   <taxonomy tier 1..4>
  gate:    <the mechanical thing that fails closed on it>
  cadence: <when it runs>

### Graduation pipeline
Who gates promotion, and what the promoted form is. Inherits the M0 rules:
strongest promotion is a mechanical guard; promotion is planner-gated;
nothing writes durable memory autonomously.

### Retirement rule
How a promoted rule is demoted or deleted when refuted, superseded, or
inert. Name who can retire, on what evidence, and where the retirement is
recorded. (This is the L3 rung; most instantiations will be filling it
for the first time.)

### Metrics
The fired / helped / harmed record for this artifact's rules, or the
artifact's native equivalent (calibration error, recurrence rate, P&L
attribution). Plus the review cadence at which dead rules are culled.

### First missing rung
The single next build item this worksheet exposed. One line.
```

## Instantiation rules

**Build on what exists.** Before filling the worksheet, read the artifact's existing practices and name them in the relevant fields. The fleet already has M0 and WDLL; the property spine already has the integrity gate and coverage ledger patterns; trading already has a native calibration model. An instantiation that proposes new machinery where proven machinery exists is wrong by default.

**WDLL before any loop build.** If filling the worksheet exposes missing rungs that become a build (they will), that build gets a WDLL Start card per [`90_runbooks/wdll_practice.md`](../90_runbooks/wdll_practice.md) before implementation. The loop program does not get to skip the loop program's own discipline.

**No autonomous memory writers.** The promotion gate is a human or planner review, always. An agent that promotes its own lessons to durable memory is the exact drift shape M0 exists to prevent. Capture is autonomous and aggressive; promotion is gated; retirement is gated.

**Selection pressure is external to the generator.** The thing that produced an output never grades that output. See the design rules in [`02_selection_pressure.md`](02_selection_pressure.md).

**Sweep, not sample, when certifying.** Certification claims (coverage numbers, quality numbers, "the loop works here") come from exhaustive checks over a bounded area, never from spot samples. Promoted from the Bastrop area-sweep lesson.

**Every number is gate-stamped.** A coverage or quality figure enters a ledger only after its gate passes, following the county coverage ledger pattern. Numbers recorded before their gate are fabrication risk.

## What a completed instantiation buys

A filled worksheet makes three things true. The artifact's improvement stops depending on any one person's memory, because the ladder and carrier are named. The artifact's claims become auditable, because every quality number traces to a gate. And the artifact's backlog becomes honest, because the first missing rung is written down instead of implied. The worksheet is cheap; the honesty is the point.
