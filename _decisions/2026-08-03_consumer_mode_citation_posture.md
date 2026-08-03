---
id: 2026-08-03_consumer_mode_citation_posture
title: Decision — Consumer mode keeps markerless prose but ALWAYS carries the structured sources array (grounding-derived)
date: 2026-08-03
status: active
owner: nick
related: [_research/2026-08-03_atoms_citations_authoritative_sources_deep_dive, 43_cortex_qa_backlog, 08_tiered_access_model]
---

# Consumer-mode citation posture

## Decision

Consumer presentation mode keeps its markerless prose (no inline [n] markers, no statute numbers in the answer text — the homebuyer-clean UX stands). But every response, consumer included, must carry the structured `sources` array derived from what retrieval ACTUALLY grounded the answer with — an atoms-used signal from the retrieval pipeline, not the current regex parse of markers that happens to zero out whenever markers are suppressed. Consumer surfaces may then render friendly source chips (plain-language labels, no statute clutter) from that array. Confidence derives from grounding (retrieval strength + atom confidence), not marker survival; the 0.75/0.5 marker-proxy is retired with this change.

Operator accepted the planner recommendation verbatim, 2026-08-03.

## Why

The deep dive showed the default mode shipped zero attribution by construction: citations are parsed from [n] markers, consumer mode forbids markers, so sources emptied and confidence pinned at 0.5 regardless of how well-grounded the answer was. That violates the quality-gate rule (every output carries source attribution + confidence) on the highest-volume presentation mode, and the confidence proxy violates commitment #2's spirit (asserted, not earned — and not even honestly asserted). Hiding citation CLUTTER is UX; discarding citation DATA is a substrate violation. This ruling separates the two.

## Implementation route

Folds into the queued fix-list item 6 (structured atoms-used signal in the ldt research/chat pipeline): the LLM path records which numbered atoms informed the answer independent of prose markers; `sources` populates from that record in every mode; confidence computes from grounding. PE (hardcoded pro) is unaffected. Dispatch alongside the next ldt wave.

## Reversal criteria

Reverse (to marker-parse-only) if the atoms-used signal proves unreliable in practice — i.e. it systematically claims grounding the answer text does not actually reflect, making the sources array a false attribution surface. In that case fall back to marker-parsing AND change consumer mode to keep markers server-side (strip at render), so attribution survives some other way; zero-attribution is not an acceptable end state.
