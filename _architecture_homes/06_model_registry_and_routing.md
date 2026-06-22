---
id: architecture_homes_model_registry
title: Model registry and routing (the basket)
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, architecture_homes_atoms, calibration_architecture_addendum, calibrated_spine_task_roadmap]
---

# Model registry and routing

## Why

We want the best-performing and most cost-effective model per task without locking into old models. That is the same problem as the moat, pointed at models: "which model is best for this task" is earned, not asserted, exactly like "how confident is this finding." So the mechanism is the calibration architecture applied to model selection, plus a registry that keeps the choice in one high-level place instead of hardcoded model ids scattered through code.

## The registry (the basket)

A single config lists every available model with its attributes. Nothing hardcodes a model id; code asks the registry for "the model for this task at this consequence stratum."

| Field | Purpose |
|---|---|
| id, provider | the model |
| capabilityTier | asserted capability class at onboarding (from eval) |
| costPerToken | cost dimension; feeds COGS and the cost-vs-capability route |
| latencyClass | for latency-sensitive paths |
| taskFitTags | which tasks this model is eligible for |
| status | active / in-eval / deprecated |
| earnedWeight | per-task reliability, earned (S3); absent until earned |

Change the basket in one place and both the product runtime and the fleet policy follow. This is the anti-lock-in control.

## Routing policy (task plus cost)

Given a task and the registry, pick the model. The cost lever is the consequence stratum: cheap model on routine questions, stronger model and optional ensemble on the high-consequence tail. This is the S5 consequence-gated routing already built in the calibrated-spine Wave 2 (currently labeled asserted). The policy is pluggable so it changes without code changes.

## Best-per-task is earned (S3)

A model is a grader of the world; its reliability per task is earned against outcomes through arrow two, derived at read from the model-attribution stamp joined to outcomes. So the registry's earnedWeight tightens with use and the routing improves beyond a static benchmark. This is S3 earned model weighting in the calibrated-spine roadmap, deferred until after the M1 measurement (it needs outcome fuel).

## New-model watch and onboarding (catch, do not auto-apply)

The net-new piece. A model-watch notices a release, an eval harness benchmarks it, and it enters the registry at an asserted capability and cost tier. The discipline: a new model routes conservatively (low-consequence first) and earns its way to the high-consequence tail via outcomes. Auto-routing the newest model to the high-consequence tail is the asserted-not-earned trap in model clothing. So the loop is catch, eval in at an asserted prior, route conservatively, then earn, not catch and blindly apply. Deprecation is the reverse: a model whose earned weight is dominated on cost or capability is demoted, then retired from the basket.

## Two layers

Product runtime. The registry lives in the substrate (spine), read by the reasoning tier's routing and by S5. This governs which model the brief, findings, and other reasoning functions call.

Agent fleet. The cc-agent fleet model is the HR-12 policy (today Grok-first, Claude on escalation). HR-12 becomes a living policy reviewed on a cadence as models ship, not a frozen default, and it reads the same registry attributes for consistency.

## Placement, rail-quiet, and cost

The registry is substrate config in the spine, with HR-12 as the parallel fleet-side companion. It stays rail-quiet: the buyer hears "the best answer," never which model produced it. The cost dimension feeds the third structural commitment, model cost is a COGS line, so the routing optimizes cost-versus-capability, not capability alone.

## Phase and dependencies

This is a phase-3 workstream (post audit and doc scrub); it does not break the audit freeze. S5 (the routing lever) is built; S3 (earned weighting) is designed in the calibrated-spine roadmap and gated on M1. Net-new and owed: the unified registry as the single basket, and the model-watch plus eval-onboarding loop. Sequence: registry config first (consolidate the scattered env-var model settings), then the watch/eval onboarding, then S3 wiring so per-task weights become earned.
