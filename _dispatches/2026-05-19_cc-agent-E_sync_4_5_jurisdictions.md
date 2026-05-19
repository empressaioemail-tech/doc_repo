---
id: 2026-05-19_cc-agent-E_sync_4_5_jurisdictions
title: Dispatch — cc-agent-E hauska-engine (Sync 4.5; Bastrop UDC + Bastrop County + Smithville + Elgin)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 51_substrate_v1_sprint, 49_code_ingestion_pipeline, 27_engine_evolution_plan, _sessions/2026-05-19_grand_county_landuse_cc-agent-E, _sessions/2026-05-19_substrate_v1_wind_down_claude_code, CLAUDE.md]
---

# Lane A.1 — cc-agent-E dispatch (Sync 4.5 Bastrop-network corpus)

You are cc-agent-E owning the `hauska-engine` repo. This dispatch covers Sync 4.5: closing substrate v1 at four jurisdictions instead of twenty. Sync 5 (the remaining 16+ TX cities) is deferred to public-launch demand per the sprint decision record.

Sync 4.5 scope: build the B3 publisher adapter against bastrop.gov; ingest Bastrop UDC (public-tier); re-ingest Bastrop County via existing Municode Path A (internal-tier pending Sylvia partnership); ingest Smithville and Elgin via Municode Path A (internal-tier pending Sylvia partnership). Quality bar ≥ 0.9 / 1.0 / 1.0 per Grand County precedent.

## Why this exists

The operator's test projects are in Grand County (already complete: 290 atoms) and Bastrop. The 20-jurisdiction Sync 5 target was the public-launch unblocker — not the internal-QA unblocker. With Cortex/Codex L1-L6 + MCP retrofit + Replit decouple running in parallel, holding substrate-side throughput at the operator's actual test surface is the right move.

The Bastrop-network framing (Bastrop UDC + Bastrop County + Smithville + Elgin) is a connected partnership story within one county. Bastrop UDC is partnership-confirmed (template). Smithville, Elgin, and Bastrop County are partnership-pending; ingest tags them `internal` so the public catalog does not surface them until Sylvia closes outreach.

This sprint also clears the cost-per-jurisdiction hard-kill checkpoint: Grand County (done) + 4 more = 5 onboarding events, well past the 3-jurisdiction threshold. The `51` doc has been updated from "three counties" to "three jurisdictions" to align semantics with operational reality.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points (updated this sprint) plus §Stream 1A and 1D scope.
4. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.4 quality bar.
5. Your prior session [`_sessions/2026-05-19_grand_county_landuse_cc-agent-E.md`](../_sessions/2026-05-19_grand_county_landuse_cc-agent-E.md) — full Grand County coverage; explicitly names the Bastrop UDC B3 publisher adapter as next-up scope.
6. Your prior session [`_sessions/2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md`](../_sessions/2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E.md) — Path C live walk against Municode that surfaced the Bastrop B3 finding.
7. The 2026-05-19 wind-down [`_sessions/2026-05-19_substrate_v1_wind_down_claude_code.md`](../_sessions/2026-05-19_substrate_v1_wind_down_claude_code.md) — full sprint hand-off including Bastrop UDC B3 framing.
8. cc-agent-AC's v1.1.0 publish session (date TBD; will land before you start) — for the visibility-field shape choice. Honor the choice cc-agent-AC made; do not relitigate.

## Scope

### Phase A — B3 publisher adapter against bastrop.gov

**Source structure:** Bastrop's UDC lives at bastrop.gov, not Municode. The local name is "BASTROP BUILDING BLOCK" or "B3 CODE" — same content. Municode Chapter 14 has three adoption-pointer sections only; the actual UDC is on the city's own site.

**Adapter shape:** the B3 publisher adapter mirrors the existing `MunicodeHtmlAdapter` and `MunicodeJsonClient` patterns at `packages/corpus/src/adapters/`. Sketch:

- Subclass or sibling of `BaseHtmlAdapter` (whichever fits the existing adapter taxonomy).
- Adapter ID: `b3-publisher` or `bastrop-gov` (pick what reads cleanly).
- Crawl entry point: bastrop.gov UDC root URL — you find it during recon.
- Section discovery: TOC walk plus per-section content extraction.
- Conform to the existing adapter contract per `packages/corpus/src/adapters/types.ts` (Sync 2 stable contract).

**Re-use opportunities:** the `path-c-ingest` orchestrator with its five CLI subcommands; the curated query scaffold pattern from your earlier Bastrop UDC recon session.

### Phase B — Bastrop UDC ingest (public-tier)

- Run the B3 adapter against bastrop.gov.
- Atomize via existing Stream 1B pipeline.
- Quality bar: top3 ≥ 0.9 / sectionNum = 1.0 / crossRef ≥ 0.95 per `49` §B.4 (same bar Grand County hit).
- Bastrop UDC is partnership-confirmed (Sylvia is the canonical partnership; Bastrop is the pioneering city per the operator's standing narrative). Tag `jurisdiction-corpus.visibility = 'public'` (or `accessPolicy: 'public-free'` per cc-agent-AC's v1.1.0 shape choice — honor it).
- Curated query set: gold-standard, ~20 queries spanning UDC scope (zoning, lot dimensions, setbacks, use districts, parking, signs, subdivision). Operator (Nick) or planner reviews the curated set; you ship a draft and request review.
- Eval pass; if quality bar fails, iterate adapter/extraction per the established Grand County pattern (in-corpus xref clean ADR-010 reading; exact-string section-number lookup; section-number anchor boost).

### Phase C — Bastrop County re-ingest (internal-tier, Municode Path A)

Bastrop County code lives on Municode (Path A; existing adapter). Re-ingest from scratch to ensure tightness against the substrate v1 pipeline (the operator's framing: "it was already ingested in the Replit version, let's redo it to make sure it's tight").

- Run Municode Path A adapter against Bastrop County.
- Tag `jurisdiction-corpus.visibility = 'internal'` (or `accessPolicy: 'platform-internal'` per cc-agent-AC v1.1.0). Note clearly in the ingested record that the tag is "partnership-pending Sylvia outreach" — this is metadata for partnership coordination, not a permanent classification.
- Atomize. Eval against the same quality bar.
- Curated query set: LLM-generated draft; light human review (planner or you).

### Phase D — Smithville ingest (internal-tier, Municode Path A)

Same shape as Bastrop County. Municode Path A; internal tag; quality bar. Smithville is in Bastrop County's network per the operator's framing.

### Phase E — Elgin ingest (internal-tier, Municode Path A)

Same shape. Internal tag; quality bar. Elgin is in Bastrop County's network per the operator's framing.

### Phase F — Sync 4.5 fire signal

Once all four jurisdictions pass the quality bar:

- Verify cost-per-jurisdiction tracking: each ingest emits compute cost (LLM tokens, OCR, embedding) and human-review-hour data. Tally vs $200 + 1hr target per jurisdiction.
- Hard-kill cost checkpoint clears at five total onboarding events (Grand County + 4 here). If any jurisdiction exceeds the target, flag for engineering review per `51` Stream 1D — do not silently absorb.
- Session summary at `_sessions/<close-date>_sync_4_5_close_cc-agent-E.md` summarizing all four ingests, eval results, cost data, any pipeline improvements landed mid-stream, and the Sync 4.5 fire signal to the planner.

Planner consumes Sync 4.5 signal and updates `51_substrate_v1_sprint.md` §Sync points + `00_current_state.md`.

## Test plan

Per-jurisdiction:

1. Adapter conformance: input URL → ordered list of section records matching the adapter contract type.
2. Atomization: section records → atoms with full Zod schema validation; round-trip through `register()` to `contextSummary()`.
3. Eval pass: 20+ curated queries pass at quality bar (top3 ≥ 0.9 / sectionNum = 1.0 / crossRef ≥ 0.95 unless adapter-specific tuning lowers crossRef floor justifiably).
4. Cost tracking: per-jurisdiction LLM tokens, OCR spend, embedding compute, human-review hours all captured.
5. Visibility tag verification: `list_jurisdictions` against in-memory storage returns Bastrop UDC for unauthenticated callers; returns all four for platform-internal callers. Use the cc-agent-AC v1.1.0 shape for the test predicate.

Cross-jurisdiction (Sync 4.5 fire):

6. All four jurisdictions appear in the corpus.
7. Cross-references between jurisdictions (if any natural ones surface) work per ADR-010 in-corpus reading.
8. Total ingest cost across 4 jurisdictions stays within budget envelope.

## Dependencies

- **Gates this dispatch:** Sync A fires (cc-agent-AC v1.1.0 publish). You can start adapter scoping and Bastrop UDC ingest before Sync A — the public-tier default behavior is unchanged. Tagging Bastrop County / Smithville / Elgin as internal-tier requires the v1.1.0 shape to be available, so do those three after Sync A.
- **Parallel-safe with:** all of Lane B (cc-agent-M), all of Lane C (cc-agent-C). No conflicts; different repos.

## Hand-off

Once Sync 4.5 fires, Lane A.2 (L-surface atom shapes per [`2026-05-19_cc-agent-E_l_surface_atom_shapes.md`](2026-05-19_cc-agent-E_l_surface_atom_shapes.md)) is the next dispatch for you. Planner notifies and you re-enter on that scope.

Hard-kill cost checkpoint either clears cleanly (proof of cost model) or surfaces an exceed-target flag (engineering review per `51` Stream 1D). Either way, surface explicitly in your session summary — do not let it slide.
