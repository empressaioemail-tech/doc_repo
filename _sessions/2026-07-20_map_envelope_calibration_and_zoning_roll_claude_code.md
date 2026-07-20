---
id: 2026-07-20_map_envelope_calibration_and_zoning_roll
title: Map envelope calibration (F13) + zoning-stamp roll to 6 setback cities
date: 2026-07-20
type: session
agent: claude_code
applies_to: hauska-brief-extension, legacy-design-tools (cad-ingest zoning stamp, cortex-api envelope), @hauska/map-renderer
related: [2026-07-18_property_brief_gtm_critical_path, 2026-07-20_map_calibration_backlog_scope, 2026-07-20_map_first_shell_and_web_app_first_onboarding]
---

# Map envelope calibration + zoning-stamp roll

Autonomous multi-agent run (planner-orchestrated, adversarial review on every deliverable, verification never delegated) executing the operator's post-QA calibration batch before the next QA. Operator settled three decisions up front: optimize-then-batch the stamp, stamp only already-tabled cities, keep the map-first/PWA program fully deferred.

## What shipped (all merged, verification traced to live state)

F13 envelope calibration (hauska-brief-extension #33, merged bdd66170). Operator QA on the drawn buildable envelope asked to tone the fill opacity down further and bolden the lot lines, dimensions confirmed solid. Three surfaces changed: envelope fill-opacity 0.12 to 0.06 (barely-there tint so the property under the buildable area stays visible); the bbox parcel line 1.4 to 2.0; and the PMTiles browse-layer default lot-line 0.7 to 1.4 via @hauska/map-renderer 0.1.4 (hauska-map #31, merged ba225751, published to npm). Subject (3.2) and inspected (1.8) line widths were left unchanged so the highlight hierarchy holds; the envelope boundary line (3.5px burnt-amber dashed) stays the boldest as the setback edge. Client-side; the operator picks it up on an extension reload.

Zoning-stamp batch-write optimization (legacy-design-tools #308, merged 13ef9f86). The stamp's DB write was N sequential awaited per-parcel UPDATEs (~40 min per county at ~40k matches). Rewrote it to collect matched (feature_index, code) pairs in memory during the point-in-polygon loop and flush them in batches of 5000 as a single set-based VALUES-join UPDATE. The point-in-polygon match logic is byte-for-byte unchanged. Adversarially reviewed all six invariants against the actual code (rowsUpdated still sums per-cell duplicate rows, dryRun writes nothing, limit bounds reads, idempotent/additive with NULL staying NULL, batch size stays under pg's bound-param ceiling, db type widened to execute with the test fake updated) and confirmed the column types align (feature_index integer, county_fips text). Result in production: a full county stamp dropped from ~40 min to ~40 sec.

Five-city zoning registry + optional code extraction (legacy-design-tools #309, merged 773e9822). Added Round Rock, Leander, New Braunfels, Dripping Springs, and Hutto to ZONING_LAYERS with live-verified ArcGIS endpoints and district-code fields, plus a new optional codeExtractRegex config field. The registry's design contract stamps the raw code verbatim (the setback table's leading-token normalization does the alignment), but Hutto's public layer carries its code as a parenthesized token inside a longer string ("Single Family (SF-1)"), which would never match. codeExtractRegex (Hutto: `\(([^)]+)\)`) extracts capture group 1 before stamping, still raw, honest-NULL on no-match. Georgetown's path is unaffected (no regex). Verified the regex application in zoning-service.ts, the five entries against the verified endpoints/fields, and that unmatched codes degrade to the honest conservative fallback rather than a wrong-but-confident district.

## The roll (run by the planner, non-delegable verification)

Ran the stamp against production for all five cities after a --dry-run per city to verify fetch, field mapping, and match distribution before any write. Live results: Round Rock 40,776 rows / 38,933 parcels, Leander 2,236 / 2,113, Hutto 16,321 / 15,705, New Braunfels 28,305 / 26,734, Dripping Springs 4,546 / 4,244. Each dry-run histogram was checked against the city's setback table leading tokens: the codes that carry a setback row match by exact or prefix, and the ones that do not (PUD/PD/PDD planned-development, commercial where the table is residential-only, Old-Town overlays) fall to the conservative fallback, which is the honest and correct result. The Hutto regex was proven in production (SF-1 = 12,241 parcels stamped, extracted from "Single Family (SF-1)"). Dripping Springs shows a deliberately low match rate because it is heavily Planned-Development (PDD dominant, no simple setback).

Region-wide zoning coverage went from 41,405 rows (Georgetown only) to 133,577 rows / 127,122 distinct parcels across Georgetown plus six cities, 104 distinct district codes. Because the stamp writes to the same Neon the deployed cortex-api reads, the new districts are live immediately with no redeploy. Combined with the already-global edge-labeling fix, the buildable envelope now draws the correct district's setbacks with the correct front/side orientation across all seven jurisdictions, not just Georgetown.

## Deferred / scoped (doc-only this run)

Two scoping records filed (committed 72130dd): the calibration backlog (topo viewport coverage, whose real fix is a backend bbox param on site-context or a baked topo-tile export, since the client pan-follow is already correct; the lot-line/aerial alignment, to be diagnosed as fixable-datum-offset vs inherent-source-accuracy before any build; and a pointer to the existing OSSF septic survey), and the map-first shell + web-app-first onboarding inversion (operator directive to make the standalone web app the primary surface with the extension optional/second, kept fully deferred, leaning on the user-aware-identity and tenancy legs).

## Operator pickup list (only what needs the operator)

1. Reload the extension and QA a stamped-city property (e.g. a Round Rock SF-2 lot, or 206 Gann St / a Georgetown RS lot): confirm the lighter envelope fill, bolder lot lines, correct district and setbacks drawn.
2. Buda: DEFERRED, not stamped. Its live zoning GIS uses a form-based code (F4 "Form District 4", B1/B2/B3 business) that its hand-built setback table (ecode360 R-1..R-5, AG, B-1) does not cover; the table needs re-verification against Buda's current form-based ordinance before a stamp is meaningful. Residential R-* would partially match; the form districts would not.
3. Kyle: BLOCKED, not stamped. Its zoning FeatureServer is token-gated (HTTP 499 Token Required); only a non-queryable vector-tile render is public. Needs a city/operator touch to open a public view layer. No endpoint was fabricated.
