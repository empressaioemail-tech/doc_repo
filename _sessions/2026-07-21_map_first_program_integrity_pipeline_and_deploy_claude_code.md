---
id: 2026-07-21_map_first_program_integrity_pipeline_and_deploy
title: Map-first program — build, integrity pipeline, recovery, and deploy to a live URL
date: 2026-07-21
type: session
agent: claude_code
applies_to: hauska-map (property-explorer + map-renderer), legacy-design-tools (node-facet bake, integrity gate, zoning, FEMA, cortex-api), hauska-brief-extension
related: [2026-07-20_map_first_program_launch, 2026-07-20_provable_county_data_pipeline_design, 2026-07-20_what_separates_us_service_elevation, 2026-07-20_verified_coverage_baseline_centx, 2026-07-21_deploy_runbook_cortex_and_vercel, 2026-07-21_overpass_road_data_spec, 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions, 2026-07-20_landuse_join_integrity_and_data_acquisition_backlog]
---

# Map-first program — build, integrity, recovery, deploy

A long multi-wave session that took the Property Brief map from "wrong parcel / disconnected" to a deployed, map-first, honest, cited web app at a live Vercel URL. Planner orchestrated fan-outs, adversarially reviewed every deliverable, verified against live state at every layer, and never delegated verification. The through-line: nothing is trusted at the surface (a green workflow, a bake summary, an agent report, a "deploy succeeded") — only the actual live endpoint/URL with the actual data.

## What shipped (merged + deployed + verified)

Map-first substrate + front door. @hauska/map-renderer 0.1.5 published with a persistent-map API (rebindProperty, resolveSubjectAndFit, getVisibleLayers) — the never-unmount contract pushed into the substrate (Shape-1 unify), reused by both property-explorer and command-center. New consumer web app apps/property-explorer (hauska-map): cold-open sign-up over a live dimmed map, anonymous browse, click->inspect-in-place, no-AI on browse. Deployed to Vercel (its own project). This session's later wave added: satellite base (Esri), measure/draw/GPS tools (ported from the extension), and the drawn buildable envelope (the wedge visual — the baked geometry was previously computed then discarded; now it draws, with honest "no buildable area after setbacks" where setbacks consume the lot).

Node-facet bake + read. Every Central-TX parcel baked as a node with facets (base facts, land-use, zoning, setbacks, buildable envelope) into place_layer_snapshots (~2.05M nodes), owner-excluded, monotonic high-water-mark guard, batched I/O (~630 nodes/sec after a perf fix). An anonymous no-AI read endpoint serves the facets to the inspect card; honest-absence renders as a designed "not verified here" state, never a blank or a fake.

The integrity system (the load-bearing outcome). An owner-match join-integrity GATE + a per-county coverage LEDGER (county_facet_coverage) make fabrication structurally impossible: a coverage number is only recorded after the gate proves the join is the same property (owner agreement), and the block set is ledger-DRIVEN (a new county's fabricating join is caught by computation, not a hand-edited list). This came out of a real self-inflicted failure: an earlier "Williamson R-prefix fix" this planner shipped was FABRICATING land-use (~167k parcels stamped with the wrong property's code via numeric collision; owner-match ~0%). It was caught by the owner-match cross-check, the fabricated snapshots were physically stripped (verified R062578 A1->null; count 81682+69959->0; real counties untouched), and the gate now prevents recurrence. Verified coverage baseline committed as the customer-facing "what we've verified" artifact.

Land-use recovery (from data we already had). Williamson + Hays land-use had been fabricated-and-blocked (0%). Discovered the situs-ADDRESS join recovers them with owner-verified matches: re-baked to Williamson 89.1% / Hays 81.3% honest land-use, owner-agreement confirmed (recovered codes now match the RIGHT owner — HAMMONS=HAMMONS, vs the old PURVIS!=BREM collision). A code fix, not new data.

Zoning coverage expansion. 10 more Central-TX cities registered + stamped (6->16): Cedar Park (fixes the operator's clicked "not verified" parcel), Pflugerville, Kyle, Buda, Lockhart, Bastrop-city, Liberty Hill, Taylor, San Antonio (partial). San Marcos returned 0 matches despite 18,359 polygons (likely CRS mismatch — honest gap, pickup). Williamson zoning 34->44%. Envelopes only where a setback table exists (Buda/Kyle + the original 6); the other new cities show the district but honest-null envelope until a setback table lands (8 tables owed).

Tier-2 FEMA flood. FEMA-flood facet shipped (roads gated on the Overpass infra); read-path additive (tier2.flood, null-safe). FEMA background fill running across all 10 counties (deploy-now-fill-async per operator ruling); the layer/card populate county-by-county.

Pipeline hardening. Unified jurisdiction onboarding config (composes the 5 scattered per-county registries into one descriptor, zero-behavior-change, reference-identity tested). Deploy runbook written (the four traps: push-only-builds, boot-crash-on-CLI-import, stale-clone-agent, wrong-image-tag/image-race — each caught by verifying the live endpoint).

## The deploy stretch (caught traps, prod never affected)

Four separate deploy traps, each caught by verifying live state rather than trusting a proxy signal, none reaching production (the --no-traffic canary held throughout): (1) push only builds the image, deploy is manual workflow_dispatch; (2) the server boot-crashed because a route imported a bake CLI whose main() runs on import in the prod bundle (fixed by extracting the constant to a no-main module); (3) a hotfix agent hit a STALE clone and wrongly said "files don't exist" (re-verified via gh api, re-dispatched with a fresh-tip guard); (4) the `latest` image tag raced to a partial commit — deployed the explicit main SHA instead. Full runbook filed.

## Architecture gaps recorded (operator raised at close)

1. The node facets are atom-SHAPED (provenance, confidence, honest-absence) but NOT atom-contract atoms — no accessPolicy, not served through the contract. Atomize them later so tiering is by the atom's accessPolicy, not an ad-hoc route check.
2. The paywall-gated functions consume nothing yet — they arrive with the auth/tenant pass (sprint-54 leg, held); the app is shaped for them (stubbed seams). Gaps 1+2 converge: accessPolicy on atomized facets is the clean paywall mechanism.
3. property-explorer's map IS the shared spine substrate command-center uses, but they are two distinct shells (consumer vs operator console), not one unified app.

Full detail: 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions.

## Live surface

property-explorer deployed to Vercel (own project, Root Directory apps/property-explorer, CORTEX_SERVICE_API_KEY env). cortex-api on Cloud Run revision cortex-api-00395-qib at 100% (facet-read endpoint + FEMA read-path). Verified end-to-end through the deployed web app proxy: zoning + recovered land-use + tier2-ready.

## Discipline note

The defining pattern of this session: verify against live state, never the surface signal. It caught the planner's own fabrication (the false 91.6%), the bake-summary-says-done-but-store-has-garbage trap, the stale-clone false-negative, and the four deploy traps. Every coverage number now earns its place by passing a gate; every deploy is confirmed by hitting the live endpoint with real data.

## Open / carried to next

FEMA fill completion (background, ~hours). San Marcos zoning CRS diagnosis. 8 setback tables owed (Cedar Park/Pflugerville/San-Antonio/etc — zoning shows, envelope null until tables land). Node-facet atomization (arch gap 1). Auth/tenant + paywall-gated functions (arch gap 2; sprint-54). Overpass road upgrade (Option A self-hosted, tagged soon-to-follow — enables the high-confidence road-based envelope front edge). Per-state source-provider abstraction (config now unified — unblocked). Extension migration #34 (held for live MV3 smoke). Comal land-use (paid acquisition, bizops) + Comal setbacks/zoning (operator's probing agent -> our setback JSON schema -> setback gate).
