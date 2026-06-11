---
id: 2026-06-11_engine_robustness_audit
title: Property-intelligence engine robustness audit — 10-engine adversarial pass + synthesis
date: 2026-06-11
kind: research
applies_to: hauska
owner: nick
related: [55_spine_data_intelligence_stack, 61_property_intelligence_master_plan, 04a_arrow_two_calibration_capture, 58_gtm_readiness_sprint, 80_adrs/adr_008_engine_factor_out]
---

# Property-intelligence engine robustness audit

> Adversarial robustness audit of every engine in the property-intelligence spine, run 2026-06-11 as a 10-auditor parallel workflow against live code (`legacy-design-tools/lib` + `artifacts/api-server`, the lifted behavior-parity source) plus a synthesis pass. 11 agents, ~1.1M tokens, 438 tool calls. Each finding is code-cited. This is the evidence base for the execution plan in [`61_property_intelligence_master_plan.md`](61_property_intelligence_master_plan.md); the wave sequence and the uniform-contract spec there derive from this audit.

## Verdict

**Not optimal, but one integration pass from good — not a rewrite.** The spine is well-built per-engine and badly integrated at the seam. Three structural reasons:

1. **Asserted confidence presented as earned, everywhere on the read path.** The calibration engine computes `effectiveConfidence` (calibrated/asserted/stale, tenant-partitioned, drift-aware), but the wire never consults it: `provenanceEnvelope.ts:224` always emits the raw LLM float; briefing and code-atom surfaces hardcode `confidence = 1.0`. The moat machinery was built and then routed around. Direct violation of structural commitment #2. Worse, the calibration loop does not close in prod: `recomputeCalibrationOverlay` is manual-POST only (no cron, no event hook), so even if the wire consumed it the number would age indefinitely.

2. **Silent degradation with `status:'ok'` is the dominant failure idiom.** A consumer cannot distinguish degraded output from clean output anywhere. Worst instance: hydrology always falls back to native D8 (pysheds is never installed in the BFF image) and the native fill/flow/ponding math is broken on flat Texas terrain, with a physically inverted ponding model. No-jurisdiction findings runs complete "ok" with empty code context; precedence emits zero drafts silently.

3. **Output contract is non-uniform.** Only 3 of 9 surfaces emit the canonical `ProvenanceEnvelope`. Brokerage emits an incompatible fork (`BriefProvenanceEnvelope`). Chat (the primary architect surface), site-topography, and site-drainage emit no envelope at all. Freshness, where present, is `snapshotDate = nowIso()` across ~8 adapters, so every staleness badge is structurally unfireable.

What is good: per-adapter failure isolation (timeout fan-out, graceful upstream-error mapping), citation stripping/validation, coverage-honesty on chat and brokerage, and the calibration architecture itself.

## Systemic risks (ranked)

| # | Risk | Severity | Engines |
|---|---|---|---|
| 1 | Asserted confidence presented as earned on the read path | HIGH | finding, precedence, briefing, corpus, calibration, subsurface, hydrology, cross-cutting |
| 2 | Silent degradation with `status:'ok'` as the default failure mode | HIGH | hydrology, finding, precedence, corpus, topography, briefing |
| 3 | Freshness is fetch-time wall-clock, not data vintage | HIGH | site-context, subsurface, topography, hydrology |
| 4 | Output-contract non-uniformity (1 canonical + 1 fork + 3 contractless) | HIGH | cross-cutting, briefing, chat, topography, hydrology |
| 5 | Calibration loop architecturally complete but never closes in prod (manual recompute only) | HIGH | calibration, finding |
| 6 | Tenant-pooling leak: platform-internal pools into public calibration (`partition.ts:39`) | HIGH | calibration |
| 7 | Deterministic precedence is a production no-op and absent from the spine | HIGH | precedence, finding |
| 8 | Provider/error observability lossy (Grok errors coded `anthropic_call_failed`; parse-fallbacks masquerade as clean) | MEDIUM | finding, briefing, site-context |

## Per-engine scorecards (contract compliance + top findings)

Contract legend: prov(enance) / cite / conf(idence) / fresh(ness) / coverage-honesty.

**finding / plan-review** — prov=partial cite=yes conf=asserted fresh=partial coverage=partial.
- HIGH: confidence is raw LLM number, clamped + passed through; `lowConfidence` is self-reported with no cross-check (`anthropicGenerator.ts:176-178`).
- HIGH: silent-degrade when no jurisdiction key — runs "ok" with `codeSections:[]`, code-cited findings discarded, no wire signal (`findings.ts:591-675`).
- corpus atoms feed engine without `webProvenance` → envelope sources `[]`, confidence `0` (`findings.ts:439-449`).
- orchestrated discipline fallback runs the FULL code list (defeats decomposition) (`disciplineScope.ts:72-76`).

**precedence / reconciliation** — prov=yes cite=yes conf=asserted fresh=no coverage=no.
- HIGH: fires only for 3 hardcoded demo atom-IDs; real UUID atoms never match → S1 never runs in prod (`productionWire.ts:25-70`).
- HIGH: `productionWire.ts` does not exist in the hauska-engine spine package at all; spine `generateFindings` never calls precedence.
- reconciliation confidence is hardcoded constants (0.94/0.91/0.75).

**hydrology** — prov=partial cite=partial conf=none fresh=partial coverage=no.
- HIGH: pysheds NEVER installed in the BFF image (Dockerfile installs `python3` but never `pip install -r requirements.txt`) → native D8 is the universal default, not the exception.
- HIGH: silent pysheds→native fallback, `library='native-d8'` + `status='ok'`, no explicit fallback flag.
- HIGH: `fillDepressions` is single-pass (not iterative) → misses multi-cell depressions on flat TX terrain; filled plateau cells get `fdir=0` and are excluded from accumulation.
- HIGH: native ponding model inverted (`slopeProxy=1/acc` marks hilltops as ponded); pysheds ponding mask `inflated>dem+rainfall*0.25` is algebraically always-true.
- HIGH: zero confidence anywhere in the pipeline.

**topography / DEM** — prov=yes cite=yes conf=asserted fresh=partial coverage=partial.
- HIGH: DEM resolution not coverage-aware (silently interpolates 10m where no lidar).
- HIGH: `nodataCount` computed but not projected to the read model.
- HIGH: nodata cells replaced with `minElevation` before Marching Squares → spurious contours at data/nodata boundary.

**site-context adapters** — prov=partial cite=yes conf=n/a fresh=partial coverage=yes.
- HIGH: `snapshotDate = nowIso()` for USGS NED, FEMA NFHL, EPA EJScreen (frozen 2024-01-29, badged 0h old), FCC, most state/local — not upstream vintage.
- silent-degrade: Cotality zoning empty-geometry emits empty coords not no-coverage; hazards swallow per-peril failures; FederalLayerKind omits Regrid/Cotality so staleness badge never fires.
- FCC `isResidential` mis-mapped from `low_latency`.

**subsurface** — prov=partial cite=partial conf=none fresh=partial coverage=partial.
- HIGH: `snapshotDate=nowIso()` not vintage (SSURGO continuous, SGMC 2017, seismic ASCE 7-22 2022).
- HIGH: no confidence on any subsurface adapter output.
- HIGH: seismic hardcodes Site Class D + Risk Category II for ALL parcels (Class E gives 1.5-3x spectral acceleration).
- centroid-point query not parcel polygon; missing hydric/liquefaction cointerp.

**corpus / retrieval + grounding** — prov=partial cite=partial conf=asserted fresh=partial coverage=yes.
- HIGH: substrate-gate atoms strip edition + sourceUrl (`codeBook=edition=sourceUrl=''`) → LLM "cites" hallucinated editions.
- HIGH: `assertedConfidence` surfaced as the confidence; `calibratedConfidence` never consulted.
- silent-degrade: all vector hits below MIN_VECTOR_SCORE; wrong-edition page passing allowlist; `storedStatus='ready'` but zero atoms returned.

**briefing** — prov=partial cite=partial conf=n/a fresh=partial coverage=partial.
- HIGH: source `payload` excluded from LLM grounding context (`parcelBriefings.ts:1344-1353`) → model infers flood/zoning/code claims from layer-name alone.
- HIGH: Cortex briefing provenance confidence hardcoded `1.0`; brokerage `0.85/0.6/null` keyed only on `corpusStatus`; research-chat `0.75/0.5/0.4/0.1` heuristic.
- invalid citations stripped with no gap note injected; claim stays in text.

**calibration / arrow-two** — prov=partial cite=yes conf=asserted fresh=partial coverage=partial.
- HIGH: `calibratedConfidence` never surfaced externally (`provenanceEnvelope.ts:209`).
- HIGH: no automated recompute trigger (manual POST only).
- HIGH: `isPublicPoolEligible` returns true for platform-internal (`partition.ts:39`) → 32 platform-internal jurisdictions pool into public calibration.

**cross-cutting contract** — prov=partial cite=partial conf=asserted fresh=partial coverage=partial.
- HIGH: two incompatible envelope schemas coexist (canonical vs `BriefProvenanceEnvelope` fork).
- HIGH: chat / site-topography / site-drainage emit no envelope, no confidence, no freshness.
- HIGH: multiple surfaces hardcode confidence `1.0` / `0.85` keyed on nothing outcome-linked.

## Ranked execution backlog (13)

1. (HIGH/med) Wire `effectiveConfidence` + a `confidenceKind` (asserted/calibrated/deterministic) marker into the envelope; replace hardcoded `1.0` and raw passthrough. Single highest-leverage fix; dedupes five per-engine findings.
2. (HIGH/med) Uniform degradation signal (`degraded`, `degradationReasons`, engine/library used) stamped wherever a fallback fires.
3. (HIGH/med) Install pysheds in the BFF Dockerfile; fix native-D8 math (iterative Priority-Flood fill, allow zero-drop flow on flats, depression-based ponding); fix the always-true pysheds ponding mask.
4. (HIGH/med) `snapshotDate` from upstream vintage not `nowIso()` across adapter + DEM tier; register Regrid/Cotality layerKinds in the freshness map; surface `freshnessVerdict` on JSON.
5. (HIGH/med) Unify the two envelope schemas; add emission to chat (SSE close), site-topography, site-drainage.
6. (HIGH/small) Fix the calibration partitioner: remove platform-internal from public-pool eligibility; add `public-paid` partition.
7. (HIGH/med) Automated calibration recompute (periodic sweep + event hooks on finding.accepted/rejected/outcome.recorded); batch the per-bucket SELECTs in a transaction.
8. (HIGH/med) Make precedence fire in prod (match by label-keyword + authority, not demo-ID regex) and port `productionWire.ts` into the spine engine-core.
9. (HIGH/med) Close grounding holes: pass adapter payload into the Cortex briefing context; populate webProvenance/edition/sourceUrl on corpus + substrate-gate atoms.
10. (MED/small) Surface computed-but-dropped coverage signals (nodataCount/fraction, partial-peril failures, no-jurisdiction `code_context_present=false`).
11. (MED/small) Observability paper cuts: distinct Grok error code, parse-fallback method tag, lowConfidence cross-check, narrow Regrid 401-vs-no-coverage.
12. (MED/med) Fix wrong field mappings: FCC isResidential, seismic Site Class (Vs30 lookup), QFaults distanceKm, SSURGO point-vs-polygon + hydric/liquefaction.
13. (LOW/small) Audit trails for silently-dropped findings (dedup reasons, insert-failure count, below-MIN_VECTOR_SCORE signal).

## Uniform contract proposal (the EngineEnvelope)

One `EngineEnvelope` shape every one of the 9 surfaces emits, sealed at the gate-front seam:

```
{
  engine: string; emittedAt: ISO;
  lineage: { atomIds: string[] };
  sources: Array<{ atomId; deeplink; retrievedAt; snapshotDate; dataVintage: ISO|null;
                   verificationState: 'verified'|'unverified-web-source'|'corpus';
                   freshness: 'fresh'|'aging'|'stale'|'unknown' }>;
  confidence: { value: number|null; kind: 'calibrated'|'asserted'|'deterministic'|'none';
                grade: 'calibrated'|'asserted'|'stale'|null; basis: string };
  coverage: { status: 'covered'|'partial'|'absent'|'unknown'; degraded: boolean; degradationReasons: string[] };
  reasoning?: string | ReasoningChain;
}
```

Three rules the shape enforces: (1) `confidence.value` MUST come from `resolveOverlayCalibration`'s effective value; `kind/grade` record earned-vs-asserted so a static 0.85 cannot masquerade as calibrated. (2) `sources[].dataVintage` is upstream acquisition date (null only when genuinely unknown); freshness is computed from it, never fetch-time. (3) `coverage.degraded` MUST be true whenever any fallback fired, with reasons enumerated.

Enforcement: one `sealEnvelope(partial): EngineEnvelope` in `provenanceEnvelope.ts` that every route calls before `res.json()`/SSE-close, wired as Express middleware on the engine route group, running a Zod validation (confidence in [0,1] or null; `kind==='calibrated'` requires a real calibration row; unresolved lineage atomIds emit a sentinel source rather than being dropped; dataVintage present or freshness explicitly `unknown`). Collapse `BriefProvenanceEnvelope` into a thin mapper and delete the fork. Add a CI contract test hitting all 9 surfaces.

## What is missing (best-in-class gaps)

1. A live calibration feedback loop actually consumed on the read path.
2. True data-vintage provenance (only FEMA NFHL stamps real vintage today).
3. Geometry-aware grounding (SSURGO/seismic/several adapters query a single parcel centroid, not the polygon).
4. Missing geotech engines: karst/sinkhole susceptibility, bearing capacity, hydric soil, liquefaction, Vs30-derived site class (currently hardcoded D).
5. A spine-wide degradation/health protocol (uniform "I am guessing here" signal + all-engines health rollup).
6. Provider-level observability (Grok vs Anthropic conflated; parse-fallbacks masked).
7. End-to-end spine-response validation (briefing spine path persists malformed results without the shape-check the findings path has).
8. Real-fixture test discipline for upstream schemas (NWIS parsed only against a hand-crafted fixture → silent wellCount:0).
9. Confidence extended to the adapter/DEM tier, which has no confidence concept at all.

## Provenance

Full per-engine scorecards (raw) in the workflow task buffer. Method: 10 parallel Sonnet auditors (one per engine + the cross-cutting contract) reading live code, each returning a schema-validated scorecard; one synthesis pass. Distilled here without loss of the high-severity findings.
