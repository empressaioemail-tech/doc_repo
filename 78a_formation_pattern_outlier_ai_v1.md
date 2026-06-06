---
id: 78a_formation_pattern_outlier_ai_v1
title: Formation pattern — outlier AI researcher (v1)
status: active
last_updated: 2026-05-27
applies_to: portfolio
related: [78_talent_education_graph, 78b_formation_graph_atomization_plan]
owner: planner
---

# Formation pattern — outlier AI researcher (v1)

> **Atom:** `formation-pattern:outlier-ai-v1` | **Graph:** [`_catalog/education/outlier_ai_formation_v1.yaml`](_catalog/education/outlier_ai_formation_v1.yaml)

## Pattern summary

Hire signal is **evidence chain**, not terminal degree. Typical graph: incomplete or bypassed Ph.D., strong B.S., **full-time research lab overlapping degree**, **graduate-level courses in year one**, **self-authored lecture digests**, **flagship publication or platform before exit**.

## Credential posture

| Element | Typical status |
|---------|----------------|
| HS concurrent college | Often completed (STEM) |
| B.S. CS or equivalent | Completed |
| Ph.D. | Started and dropped, or offers only |
| Top-program Ph.D. offers | Common signal; not required enrollment |

## Course stack (archetype)

Grad-first mix in vision, robotics, AI, NLP ethics, entrepreneurship seminar. Example course codes from ingested case (UW Allen School): CSE 576, 571, 512, 573, 590R, 599* — use as **template IDs**, not a mandatory list.

## Self-curriculum (replication seeds)

Three digests (~400 pp total archetype) mirroring public university lectures:

| Digest topic | Mirrors (public syllabus) |
|--------------|---------------------------|
| Classical → deep CV | Undergrad/grad vision sequence |
| Deep learning foundations | Graduate DL survey (e.g. CS230-class) |
| CNNs for recognition | Vision recognition course (e.g. CS231n-class) |

Store as **chapter graph + reading list** for agent curriculum; ingest only from licensed or public materials.

## Lab embedding

| Mode | Overlap |
|------|---------|
| Research intern | Undergrad years 1–2 |
| Full-time lab researcher | Undergrad years 2–4 and/or Ph.D. attempt |

**Key edge:** `employment concurrent_with credential`. Formation happens in lab throughput, not summers only.

## Evidence clusters (hire-weighted)

| Cluster | Example artifact types |
|---------|------------------------|
| `embodied_ai` | Procedural sim platform; NeurIPS-tier outstanding paper |
| `multimodal_vlm` | Open VLM + caption/pointing datasets |
| `sim2real` | Scan-to-sim pipeline; robustness benchmarks |
| `research_engineering` | Widely adopted OSS sim (100k+ installs class) |

## Six pillars → instance mapping

| Pillar | Archetype instance |
|--------|-------------------|
| Build early | Paid graphics/visualization before university |
| Compress courses | Grad vision + robotics freshman year |
| Store lectures | Three self-published digests, pre-degree |
| Lab during degree | National lab FT by sophomore year |
| Ship before exit | Outstanding-paper-tier + platform OSS |
| Optionality | Multiple Ph.D. offers; industry path chosen |

**Dependencies (org, not individual):** co-located university + lab, named advisor network, lab engineering/compute, outlier throughput.

## Additive use (agents)

When `formation-pattern:outlier-ai-v1` is attached, agents should:

- Weight **artifact graph** over credential labels in technical judgments  
- Prefer **concurrent_with** explanations (why lab years matter)  
- Not infer compensation, employer, or identity from this pattern  

## Provenance

Ingested 2026-05-27 from public materials (university news, public CV pattern). Personal identifiers and compensation stripped from canonical store. Raw provenance file optional under `_catalog/education/_provenance/` (operator-only); not required for atom resolution.
