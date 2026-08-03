---
id: FINDING_2026-08-03_factory_product_setback_disconnect
title: FINDING — the certified factory output does NOT reach the customer app; PE serves a stale, mis-keyed, hand-curated setback table instead of the recipe atoms
date: 2026-08-03
status: FINDING (top factory priority; surfaced by operator live-QA of the Smart Site prod deploy; blocks the meaning of "Bastrop city ready for R6")
owner: nick
related: [OPS-WDLL_the_factory, OPS-2_county_onboarding_runbook, OPS-5_cert_standard, 2026-08-02_bastrop_recipe_ACCEPTED, PHASE_C_RESUME_full_sweep_then_blocks, post-mortem-scan-fix-loop-drift]
purpose: Record, with live evidence, that the Phase C certified recipe atoms (SF-1 1919/1919 blockPass) are NOT what the customer PE app serves. The app serves setbacks+envelope from a stale, mis-keyed, hand-curated JSON table in a different repo. This is the single most important factory finding of the session: four green gates (warm, cert, ledger, deploy) did NOT mean the certified data is live in the app — exactly the drift the WDLL "grade the live app" test exists to catch.
---

# FINDING — factory output does not reach the customer app (setbacks + envelope)

## HOW IT SURFACED
Operator QA'd the Smart Site rebrand on live PE prod (property-explorer-xi.vercel.app) and noticed every parcel shows "Setbacks: not verified here / Buildable: not verified here" — including on SF-1, the block that just passed cert 1919/1919. Branding was clean; the DATA was the finding. This is the WDLL good-vs-bad-run test working: grade the live app, not the agent report.

## THE THREE LAYERED PROBLEMS (all live-verified)
1. STALE SERVING SNAPSHOT. The PE app reads node-facets `baked-snapshot` with `snapshotAt/bakedAt: 2026-07-30T03:24` — three days BEFORE the SF-1 warm (2026-08-03 03:19). The warm never re-baked the serving snapshot.
2. THE SERVE PATH READS A HAND-CURATED TABLE, NOT THE RECIPE ATOMS. The node-facet bake (`legacy-design-tools/artifacts/api-server/src/nodeFacetBakeTier1Cli.ts`) derives setbacks+envelope from `getSetbackTable` -> `mapDistrict` (a hand-curated per-jurisdiction JSON, `lib/adapters/src/local/setbacks/bastrop-tx.json`, "locked decision DA-PI-3", read at server boot) inset by `deriveBuildableEnvelope` with skipRoad=true. It does NOT read the hauska-engine Phase C recipe setback/envelope atoms. The recipe (R1: setbacks from the authoritative per-parcel layer-23 record, NOT a table) and the serve path are UNBRIDGED for setbacks+envelope. The entire certified factory output is invisible to the customer.
3. EVEN THE TABLE IS MIS-KEYED. `bastrop-tx.json` is keyed on Municode ordinance names (`R-MD Residential Medium Density`, `R-LD`, `R-HD` ...) while the served zoning codes are the layer-23/83 codes (`SF-1`, `GC`, `MU`). `mapDistrict` cannot match "GC" against an "R-HD"-keyed table, so it falls through to `envelope: null`, no setbacks facet. Live proof: 48021:33904 (GC) serves `envelope: null`, `facetCoverage.envelope: false`, no `setbacks` key. So a blind re-bake would STILL show "not verified" — the table path is independently broken.

## WHAT IS ACTUALLY WORKING (do not over-scope the fix)
- ZONING: served correctly — the bake reads the `zoning_district` stored column verbatim (33904 serves "GC" with layer-83 provenance). Works.
- LAND-USE: served correctly — CAD-roll join ("A1 Single-family residential", cad-roll 01.14.2026). Works.
- BASE FACTS + ACREAGE: served correctly.
- So the disconnect is SPECIFICALLY setbacks + buildable-envelope. Not zoning, not land-use.

## WHAT THIS MEANS FOR "BASTROP CITY READY FOR R6"
The Phase C cert (1919/1919 SF-1 blockPass) is TRUE — but it graded the WARM STORE (hauska-engine atoms), NOT the served snapshot the customer reads. "Bastrop city ready for R6" is therefore NOT true at the customer surface: the certified setbacks/envelope do not reach the app. R6 (operator visual QA in CC) would have caught this too — this is what R6 is for — but it surfaced earlier via the PE prod deploy. The cert gate as written has a hole: it does not grade what the customer sees.

## THE ROOT GAP (OPS-2 STAGE 5 + OPS-5 CERT)
- OPS-2 STAGE 5 (PROMOTE) says "promote to the served ledger; customer reads the promoted ledger." But there are TWO served surfaces: the `county_facet_coverage` LEDGER (CC reads — updated by the warm) and the node-facets `place_layer_snapshots` SNAPSHOT (the PE customer reads — baked from a SEPARATE table, not updated). STAGE 5 updates the ledger but not the customer-serving snapshot, and the snapshot's setback source is not the recipe atoms at all.
- OPS-5 CERT grades the warm store, not the served snapshot. A jurisdiction can pass cert while the app serves stale/wrong/absent setbacks.

## THE FIX (scope — to be spec'd next, per operator "investigate first" then spec)
1. WIRE STAGE 5: the recipe setback + buildable-envelope atoms (hauska-engine, per-parcel, layer-23-sourced) must become the source the node-facet bake serves — either the bake reads the recipe atoms directly, or the warm promotes per-parcel setback/envelope atoms into the store `nodeFacetBakeTier1Cli` reads (the recipe is PER-PARCEL; the table is per-district — the serving shape must carry per-parcel values, not a district lookup). Preserve the monotonic `shouldPromote` guard and honest-absence.
2. CERT GRADES THE SERVED SNAPSHOT (OPS-5 / WDLL): the area-sweep must grade the customer-served node-facets, not only the warm store. "Green cert + app shows old/absent setbacks" becomes a NAMED BROKEN state in OPS-WDLL.
3. RETIRE `bastrop-tx.json` (and the per-district table path) for any jurisdiction the recipe has warmed — it is the pre-recipe, mis-keyed derivation. Add to the ZOMBIE_CODE ledger once the wire lands. (Keep the table only as the honest fallback for jurisdictions NOT yet warmed by the recipe, if that path is still wanted.)
4. RE-BAKE SF-1 to prod once wired, and verify a KNOWN SF-1 parcel serves the certified per-parcel setbacks + a drawn envelope live (not "not verified").

## DISCIPLINE NOTE (why this is the valuable finding)
Four green gates — warm OK, cert 1919/1919, ledger 74.22%, deploy READY — and the customer app showed stale/absent data. The benchmark is "is the data TRUE + AVAILABLE in the app" (post-mortem-scan-fix-loop-drift). This finding is the proof that the factory's cert must terminate at the SERVED surface, or the fan will replicate a factory whose certified output never reaches customers. This must be fixed BEFORE the GC/MU/RR/PI/IND blocks are treated as "served," and before the county+cities fan.
