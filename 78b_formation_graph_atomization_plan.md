---
id: 78b_formation_graph_atomization_plan
title: Formation graph atomization plan — additive measure
status: active
last_updated: 2026-05-27
applies_to: portfolio
related: [78_talent_education_graph, 78a_formation_pattern_outlier_ai_v1, 01a_atom_conventions, 60_eci_atomization, 60a_eci_atomization_sprint, 25_atom_architecture_reference]
owner: planner
---

# Formation graph atomization plan

> **Goal.** Register formation patterns as **portfolio/ECI atoms** and an **optional additive score** in agent context. **Never** register in `@hauska/atom-contract` or the place-graph substrate.

## Non-goals

- Jurisdiction, parcel, code-section, or MCP catalog atoms  
- Person-specific profiles, compensation, or press narratives in canonical store  
- Replacing substrate or portfolio `current-state` retrieval  

## Type registry (proposed)

| Atom ref | `entity_type` | Role |
|----------|---------------|------|
| `formation-pattern:outlier-ai-v1` | `formation-pattern` | Bundled pattern + pillars |
| `formation-pillar:build-before-credential` | `formation-pillar` | Single pillar definition |
| `formation-pillar:grad-course-compression` | `formation-pillar` | … |
| `formation-pillar:lecture-digests` | `formation-pillar` | … |
| `formation-pillar:lab-concurrent-degree` | `formation-pillar` | … |
| `formation-pillar:artifacts-before-exit` | `formation-pillar` | … |
| `formation-pillar:degree-optionality` | `formation-pillar` | … |
| `skill-cluster:embodied-ai` | `skill-cluster` | Evidence taxonomy |
| `skill-cluster:multimodal-vlm` | `skill-cluster` | … |

Edges (internal, Phase 2): `pattern_includes_pillar`, `pillar_evidenced_by_cluster`, `course_replicates_syllabus`.

## Phases

### Phase 0 — Done (2026-05-27)

- Depersonalized YAML + prose ([`78a`](78a_formation_pattern_outlier_ai_v1.md))  
- Schema + layer rules ([`78`](78_talent_education_graph.md))  
- Portfolio atom refs in [`01a_atom_conventions.md`](01a_atom_conventions.md)  

### Phase 1 — Portfolio `ContextSummary` (next, no code)

**Owner:** planner | **Effort:** ~1 session

1. Add `_catalog/formation/` with one YAML per atom ref, shape:

```yaml
entity_type: formation-pattern
entity_id: outlier-ai-v1
prose: "Six-pillar researcher formation; evidence over terminal degree."
typed:
  pillars: [build-before-credential, grad-course-compression, ...]
  skill_clusters: [embodied_ai, multimodal_vlm, sim2real, research_engineering]
key_metrics:
  pillar_count: 6
  pattern_version: v1
related_refs:
  - formation-pillar:lab-concurrent-degree
  - strategy-module:formation-graph
as_of: 2026-05-27T00:00:00Z
```

2. Mirror pillar rows (six files or one `pillars_index.yaml`).  
3. Update [`_catalog/atoms_index.md`](_catalog/atoms_index.md).  
4. Add dispatch rule to [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md): optional `Read first (formation)` block **after** substrate/portfolio atoms.

**Acceptance:** Any dispatch can list `formation-pattern:outlier-ai-v1` and resolve prose + typed fields without reading `78a` full doc.

### Phase 2 — ECI `@empressaio/atom-internal` (post–substrate v1)

**Owner:** cc-agent + planner | **Gate:** [`60a_eci_atomization_sprint.md`](60a_eci_atomization_sprint.md) P1 scaffold

1. Register `formation-pattern`, `formation-pillar`, `skill-cluster` in **internal** registry only ([`60_eci_atomization.md`](60_eci_atomization.md) routing: separate from substrate).  
2. `accessPolicy: platform-internal` (ADR-017).  
3. Backfill v1 pattern from `_catalog/formation/` into registry JSON.  
4. Hauska MCP: **no new public tools**; optional `eci_get_formation_context` internal tool or planner-only read path.

**Acceptance:** Same atom refs resolve from code registry and doc_repo catalog interchangeably.

### Phase 3 — Additive measure (scoring hook)

**Owner:** planner + product | **Not blocking** Phase 1–2

Define **formation_fit** as an optional float 0–1 merged into agent context, not substrate:

| Input signal | Weight (v1 draft) |
|--------------|-------------------|
| `evidences` edges present (papers, OSS) | 0.4 |
| `concurrent_with` lab + degree | 0.25 |
| Self-curriculum / course compression | 0.2 |
| Credential-only (no artifacts) | cap at 0.3 |

**Merge rule:** `agent_context = substrate_atoms + portfolio_atoms + (formation_fit * formation_pattern_atom)` when task flag set. If formation not requested, score omitted entirely.

**Acceptance:** Cortex/Hauska product paths unchanged; formation score appears only in dispatches with `applies_formation: true` (hiring, curriculum, research hiring bar).

### Phase 4 — Curriculum ingest (optional)

- Map public syllabi (UW CSE 576, Stanford CS230/231n) to `course-template:*` atoms.  
- Link digest chapter graphs when licensing allows.  
- Still additive; not jurisdiction catalog.

## Dispatch template snippet

```markdown
## Read first (atoms)
- current-state:portfolio
- sprint:<id>   # if applicable

## Additive (formation) — optional
- formation-pattern:outlier-ai-v1
applies_formation: true
```

## Success criteria

1. Zero person names or comp figures in `_catalog/formation/` and public canonical docs.  
2. Formation atoms never listed in substrate sprint ([`51`](51_substrate_v1_sprint.md)) or place graph ([`77`](77_place_graph_strategy.md)).  
3. Agents gain **structured priors** (pillars, clusters, concurrent_with) without extra tokens from biography.  
4. ECI P2 registry owns types; doc_repo catalog remains human-editable source until backfill.

## Revision history

- **2026-05-27:** Plan filed; depersonalization complete; additive layer explicit.
