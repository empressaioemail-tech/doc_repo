---
id: 78_talent_education_graph
title: Formation graph — additive agent intelligence (not substrate)
status: active
last_updated: 2026-05-27
applies_to: portfolio
related: [01a_atom_conventions, 25_atom_architecture_reference, 60_eci_atomization, 77_place_graph_strategy, 78a_formation_pattern_outlier_ai_v1, 78b_formation_graph_atomization_plan]
owner: planner
---

# Formation graph — additive layer

> **Purpose.** Store **replicable researcher formation patterns** (courses, lab overlap, self-curriculum, evidence artifacts) as portfolio intelligence. Agents retrieve this **additively** when the task benefits from formation priors (hiring bar, curriculum design, research planning). It is **not** the Hauska substrate ([`77`](77_place_graph_strategy.md), `@hauska/atom-contract`, jurisdiction/catalog atoms).
>
> **First pattern:** [`78a`](78a_formation_pattern_outlier_ai_v1.md) + [`_catalog/education/outlier_ai_formation_v1.yaml`](_catalog/education/outlier_ai_formation_v1.yaml). **Atomization plan:** [`78b`](78b_formation_graph_atomization_plan.md).

## Layer placement

| Layer | What it is | This module |
|-------|------------|-------------|
| **Substrate** | Jurisdictional + catalog atoms; MCP `resolve_place`, code corpus, paid Layer 2 | Out of scope |
| **Portfolio atoms** | doc_repo `ContextSummary` refs; manual Phase 1 | **Here (now)** |
| **ECI internal** | `@empressaio/atom-internal` company-state types | **Target registry (Phase 2)** |
| **Additive measure** | Optional formation/evidence score merged into agent context | **Phase 3** |

**Rule:** Formation graph **never substitutes** substrate retrieval. Dispatch order: required substrate/portfolio atoms first; formation atoms only when `applies_formation: true` or task class matches (see [`78b`](78b_formation_graph_atomization_plan.md)).

## Schema (v1)

| Nodes | Edges |
|-------|-------|
| `institution`, `credential`, `course`, `mentor_role`, `artifact`, `employment`, `skill_cluster` | `completed` / `dropped` / `offers_only`, `employed_at`, `concurrent_with`, `authored`, `replicates_curriculum`, `evidences` |

Use **role labels** (e.g. `vision_lab_director`) not person names in canonical artifacts.

## Atoms (portfolio Phase 1)

| Ref | Source |
|-----|--------|
| `strategy-module:formation-graph` | This doc |
| `formation-pattern:outlier-ai-v1` | [`78a`](78a_formation_pattern_outlier_ai_v1.md) + YAML |

## Six pillars (abstract)

1. Build before credential  
2. Grad-course compression in early undergrad  
3. Lecture digests as stored curriculum  
4. Full-time lab `concurrent_with` degree  
5. Public artifacts before terminal degree  
6. Terminal-degree optionality; industry exit valid  

## Revision history

- **2026-05-27:** Depersonalized; repositioned as additive layer; atomization plan in 78b.
