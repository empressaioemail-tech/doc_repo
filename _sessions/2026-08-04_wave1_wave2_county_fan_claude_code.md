---
id: 2026-08-04_wave1_wave2_county_fan_claude_code
title: Wave 1 close (Guadalupe + Caldwell certified) + Wave 2 open + Warden first real catch
date: 2026-08-04
type: session_summary
participants: [nick, claude_code_planner]
related: [90_runbooks/factory_onboarding_runbook, 90_operations/onboarding_defect_class_backlog, 90_operations/OPS-9_scale_ops_specs_pack]
---

# Session: Wave-1 county certs closed, Wave 2 opened, Warden's first real defect cohort

Continuation of the 2026-08-04 OPS-9 wave session (post-compaction). Planner-executed with Sonnet executor subagents for read-only recon/triage; all merges gated on the CI conclusion string.

## Wave 1 — both counties CERTIFIED

Guadalupe County (unincorporated), 48187: cascade apply scanned 93,728 / cascaded 63,115 / 0 errors (dry-run predicted exactly; 30,613 delta = Seguin/Cibolo-districted parcels correctly skipped by the city-aware cascade). Cert 20/20, blockPass true, POSTed to the onboarding ledger.

Caldwell County (unincorporated), 48055: certified 20/20 after root-causing two stacked defects, both now structural fixes on engine main:

1. Engine #245: the authored registry row pointed at FeatureServer/0, which on Caldwell's service is the "Municipal Utility Districts" layer; Parcels is layer 1 (live-probed, comment carries evidence).
2. Engine #246: `fetchBcadParcelRings` read `properties.prop_id` but ArcGIS echoes the layer's real field casing (`Prop_ID` on Caldwell) — every ring dropped. Property key now matched case-insensitively; both casings unit-tested; BCAD/Guadalupe byte-identical.

Third finding: 3 of 20 roster parcels (48055:36263/131166/77228) exist in the StratMap-sourced cohort but return zero features from the live CAD layer — filed as CAD-COHORT-VINTAGE-DRIFT, replaced deterministically (next-in-cohort-order, CAD-probe-gated), never silently swapped. Cert artifact: `P:/tmp/cert5-48055-artifact.json`, roster3.

## Warden results and triage

Guadalupe sweep (15 findings): CONFIRMED not data defects by direct DB query — the flagged parcels are in-city (Seguin/Marion tenant segments) and carry exactly the right atoms: zoning-fact absence (`no-zoning-stamp`) plus a buildable-envelope with the city-aware `no-district-on-record` decline (#240 cascade behaved correctly). The Warden v1 comparator is wrong twice: crossStore expects the unzoned cascade code on every sampled parcel, and dbTruth is blind to absence-fact semantics the serve path correctly reports. Warden v1.1 work item filed with the confirmed mechanism.

Bastrop sweep (50 MIXED-VINTAGE-NEIGHBOR findings): TRIAGED by executor via spatial containment against the county city-limits layer (attribute fields are NULL on BCAD — spatial is the method). **48 of 50 are REAL: inside Bastrop city limits with no district stamp** — the Warden's first real data-defect cohort. 1 unincorporated edge false positive; 1 prop_id absent from live BCAD (vintage-drift member). District recon (second executor): **41 of 48 are a stamp re-roll fix** — the live per-parcel layer carries populated ZoneTypeClass for them (SF-1 ×17, GC ×10, RR ×8, MU ×3, IND/PI/PDD ×1); **7 are genuine zoning-coverage gaps** (null record AND no covering Place-Types polygon; two geographic clusters, possible annexation/ETJ pockets). Fix: stamp re-roll dry-run for the 41 with block13 7/7 regression gate; the 7 route to a city follow-up. Artifacts: `P:/tmp/bastrop50-triage.json`, `P:/tmp/bastrop48-district-recon.json`.

## Wave 2 — McLennan CERTIFIED same session

McLennan 48309, full arc end to end: gate 8/8 → cascade dry-run 114,255 scanned / 65,814 predicted → apply **65,814 exact, 0 errors** (48,441 delta = Waco-area districted/stamped skip set) → CAD-probe-gated roster (layer live-probed: `Parcels`, lowercase prop_id) → **cert 20/20, blockPass true, POSTed** → Warden sweep: 21 findings, all the known WARDEN-MIXED-CITY-BLIND-SPOT signature (`cascade-missing` + `zoningFactPresent` on city-stamped parcels) — comparator noise, not data defects; members appended to the class. Third county certified today.

## Wave 2 opened

Preflights run by fips (the wrapper is fips-keyed): McLennan 48309 **8/8 PASS** — cascade dry-run launched same session. Comal 48091 and Bell 48027 declined on "geometry parity" — root-caused as sample pollution, NOT engine geometry: Comal's lexicographic-first sample lands on degenerate prop_ids (48091:0/:1 — the propIdBadRate class, ambiguous CAD join); Bell's sample parcels carry C-2/R-1 city stamps and correctly fail the unzoned grade (`expected-unzoned-but-district-present`). Engine #247 (gating at write time): deterministic sample now filters non-positive prop segments always and, on unzoned rows, excludes city-districted parcels (mirrors the cascade's city-aware skip). Regression re-runs of 48021 + wave-1 preflights owed post-merge.

## Smithville — LIVE ON PROD /search

Eval fix #244 merged (buildCodeTree title fallback; adapter emits full label). Full snapshot rebuild: 47 units / 23,257 sections, **Smithville 836 sections eval 1.00/1.00/1.00 PASS** (first-ever; was 0.87 top-3). Not-ok units unchanged and named: Bastrop UDC (Municode drift-skip; B3 PDF carries Bastrop), Grand County (legacy env absent in build environment), ICC (live drift, standing). Build-path gotcha caught before load: the tool writes its default out-path relative to its own directory — the first pg-load dry-run parsed the STALE July-30 snapshot; caught by the `generatedAt` check, re-pointed to tonight's 69MB artifact. Loaded to prod pg (dry-run gated, pure upsert: 27,019 atoms, 41 jurisdictions upserted, 43 tenants now — Grand County/ICC untouched) and **live-verified on `/search`** (`q=accessory building setback&jurisdiction=smithville_tx` → sections 2.2/4.3/3.2, correct tenant; note the params are `q` + `jurisdiction`, auth `Authorization: Bearer`). Snapshot committed via gated PR #249. Corpus total across the portfolio build: 33 distinct jurisdiction units spanning Bastrop core, Austin metro, San Antonio area, DFW, and border/west (El Paso Titles 18/19/20, Brownsville, Mission).

## Reword backfill — APPLY HELD (dry-run catch)

48021 `--reword-city-parcels` dry-run completed (2h13m): scanned 52,726 / would-reword **38,026** / no-city-signal 14,700 / 0 errors. HELD: the blast radius is far beyond the Smithville intent and the samples are McDade — an unincorporated CDP. The mode's city signal is the situs-city tenant segment, not city-limits membership; applying would misword unincorporated-community parcels ("jurisdiction not yet onboarded" where the county IS the onboarded jurisdiction and unzoned is their truth). The dry-run-first discipline prevented a 38k mis-wording. Engine work item filed: scope the mode to an incorporated-city allowlist or a city-limits check before any apply.

## Doc updates this session

Runbook Wave-1 addendum (authoritative): `--preflight-row-id` drives cadastral URL threading (`--row-id` is attribution only); roster rules (unzoned-code-only + live-CAD-resolvable, deterministic replacement policy); never freeze a cadastral URL without a live probe; concrete ledger/env value sources; Warden `--cert-artifact` requirement; Warden mixed-city caveat; preflight wrapper is fips-keyed. Defect backlog: 5 new classes filed (CAD-LAYER-INDEX-UNVERIFIED cleared, CAD-PROPID-FIELD-CASING cleared, CAD-COHORT-VINTAGE-DRIFT open, WARDEN-MIXED-CITY-BLIND-SPOT open, MIXED-VINTAGE-NEIGHBOR triaged with 48-parcel stamp fix open).

## Open at session-record time

McLennan cascade dry-run → review → apply → cert → warden. Comal/Bell preflight re-runs post-#247. Bastrop 48-parcel stamp fix (recon in flight; stamp dry-run + block13 regression gate before any apply). Smithville pg load + live verify + snapshot PR. Reword apply. Guadalupe one-parcel district-store confirm. Wave 2 remainder: Williamson, Bexar; Hays cert-blocked (no cadastral URL, hayscad.com follow-up); Travis HELD (crosswalk). Warden v1.1. OPS-10 v1 awaiting go.
