---
id: T3_rails_track
title: T3 — New rails track: building footprints + public-utility easements (catch-up program)
status: active
owner: nick
related: [CATCHUP_program_2026-08-05, OPS-1_texas_source_registry, 90_runbooks/factory_onboarding_runbook, 27a_jurisdiction_factory_engine_spec]
---

# T3 — Building footprints + public-utility easements rails

Mission (operator re-prioritization 2026-08-05): onboard these two rails NOW, while the jurisdiction set is small, and fold them into the standard county recipe so no re-comb of Texas is ever needed. Site-plan coherence is the driver: a coherent site plan needs the building footprint and the recorded easements, not just lot lines and setbacks.

## Workstreams

1. FOOTPRINTS SOURCE RECON (read-only): BCAD publishes clean building footprints (operator observation on the appraisal-district site — locate the actual service/download). Then survey the pattern across our onboarded counties: CAD ArcGIS layers, county GIS, and the fallback nationally-available sets (Microsoft/Bing ML footprints, USA Structures) with an honest quality tier per source (CAD-authoritative vs ML-derived). Four-point live probe per source per the runbook rule.
2. EASEMENTS SOURCE RECON (read-only): public-utility easements are typically plat-recorded; sources = county plat/GIS layers where published, utility district GIS, and recorded-plat extraction where only documents exist. Expect partial coverage; design for honest absence per parcel ("no recorded easement layer published for this county" is a valid, named state). NO city/utility relationship asks — public record only.
3. CONTRACT SHAPE: propose the atom shape(s) for both rails against @empressaio/atom-contract (building-footprint likely a geometry-bearing data atom keyed to parcelNodeId with source tier + vintage; easement similar with type/holder fields where the record carries them). Check substrate placement against the decoupling (ADR-008/056 topology) before authoring. If a contract extension is needed, spec the ADR; do NOT publish contract changes without master-planner sign-off.
4. INGEST SPEC + RECIPE LINE: how each rail joins the standard county onboarding recipe (registry row fields, preflight probe, warm step, cert check, Warden check, serve surface). The deliverable is the SPEC + the Bastrop pilot, not a Texas-wide run.
5. BASTROP PILOT: ingest footprints (and easements if a source exists) for the Bastrop city cohort, serve on the map/site-plan surfaces behind the standard provenance chips, cert on the Jones/Higgins block (pairs with T1's re-warmed envelopes: footprint + envelope on one sheet is the coherence win). DATA-RUN COORDINATION: reserve the heavy-scan slot through the master planner before any bulk ingest.

6. PHASE 2 — FULL CATCH-UP ROLLOUT (the parity path): after the Bastrop pilot passes acceptance, backfill BOTH rails across every already-onboarded jurisdiction (Bastrop County, Elgin, Guadalupe, Caldwell, McLennan, Comal + the cascaded counties as they certify, and the DFW nine when their Phase 3 resumes), each county through the same recipe line with per-county source probes, honest absence where no source exists, and heavy-scan-slot reservations for bulk ingests. New counties onboard with the rails included by default from the recipe. This phase is what makes the operator's "never re-comb Texas" goal real — the rails reach parity with the rest of the corpus instead of remaining a Bastrop feature.

## Acceptance (master planner verifies live)

Phase 2 rollout complete across all onboarded jurisdictions (or per-county honest-absence recorded); source registry entries with live-probe evidence per county for both rails; tiered-quality doctrine written; contract/ADR spec ready for ruling; recipe-line spec merged into the runbook; Bastrop pilot serving footprints on the live map + site plan with citations; per-parcel honest absence where sources do not cover; queue rows flipped.
