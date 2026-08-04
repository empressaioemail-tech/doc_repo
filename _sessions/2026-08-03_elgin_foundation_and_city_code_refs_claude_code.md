---
id: 2026-08-03_elgin_foundation_and_city_code_refs
title: Session — Elgin foundation landed + stamped; Bastrop city code-refs backfilled, cert holds 7/7
date: 2026-08-03
status: closed
owner: nick
agent: claude_code (planner + 3 sonnet executors)
related: [90_operations/onboarding_defect_class_backlog, _sessions/2026-08-03_county_onboarded_claude_code, _research/2026-08-03_atoms_citations_authoritative_sources_deep_dive]
---

# Elgin foundation + the city's code-ref chain

Continuation of the onboarding night, same recon-then-review discipline. Two arcs, both landed.

## Arc 1 — Bastrop city code-refs (the SF-1 chip chain), COMPLETE

Recon killed the naive plan before it burned a run: re-running the breadth bake would have silently minted zero refs (descriptorForCounty hardcodes key "breadth_48021"; the district map is seeded under "bastrop_tx" — a key mismatch with no error path; latent bug now FIXED in #223 for future bakes). Executed instead as the repo's own backfill idiom: engine #223 (script with --dry-run/--apply/--revert, drift-pin test tying the script's table to the TS map) merged green; planner ran dry-run (predicted exactly 5,744 patch / 28 honest-miss on legacy P-codes), applied (landed exactly that, 0 errors), live-verified the atom-chain serving sourceCodeAtomRef → 14-02-003 + both codeSectionRefs on a gold parcel, and re-ran block-13 cert: 7/7 CERT-RESTORE ELIGIBLE. The zoning→code-text chain is live end to end. Watch item: 6 parcels still on repealed P-5 among the 28 honest-misses.

## Arc 2 — Elgin foundation, landed to the stamp checkpoint

Recon (read-only, both repos + live AGOL probes) reshaped everything: Bastrop's AGOL layer 23 carries ZERO Elgin parcels; the real source is the Elgin_Zoning FeatureServer (BasCoGIS org) — Bastrop-side layer 0 (3,220 polygons) + a Travis-side layer 1 (500 parcels) that is structurally incompatible with the 48021 row. Planner scope rulings: Bastrop-side-only pass 1 (Travis sliver a named follow-on), canonical R-4 naming with domain map A→R-4, PDD/Downtown Overlay excluded as non-scalar, setback table merge-gated on planner row verification.

Landed: engine #224 (registry rail on the real layer, elgin_tx descriptor, per-district code-section map — a deliberate structural difference from Bastrop's shared permitted-use table — and the DRAFT setback table: 8 districts, every scalar carrying per-field provenance with atom DID + verbatim quote, every conditional cell not_specified:true with the rule text, registration COMMENTED OUT behind TODO(elgin-review) so the draft cannot serve unratified). Planner row verification passed: scalars cross-checked against the recon's independent extraction plus live corpus atom pulls (R-1 front 25, R-2 side 5 verified verbatim); all 24 cited DIDs mechanically verified in the corpus snapshot (including an executor-caught separator error: Elgin's entityIds use slash, not Bastrop-BDC's dash). ldt #379 (ZONING_LAYERS elgin-tx entry) hit a REAL regression its second CI run exposed (the first run's portal-ui flake masked it): zoningProvenance's sole-wired-layer fallback legitimately dies when 48021 gains a second layer. Executor investigation proved branch (a): the function's own contract says multi-city-null is intended, the only prod consumer degrades honestly; fixed with honest-ambiguity tests (plus a second masked instance found one layer up), baseline-compared, merged green on an SHA-matched conclusion.

Stamp executed (planner): dry-run 3,798 parcels matched across all 8 codes (domain map firing — R-4 present); real run verified in the DB: 4,047 rows = 3,798 parcels (multi-geometry rows, same ~7% ratio as Bastrop city's 6,218/5,772 — checked, benign). Elgin zoning is stamped in txgio_parcel alongside Bastrop's, untouched.

## The Elgin pipeline from here (next session)

1. OPERATOR RATIFICATION of the setback table (the un-commenting of SETBACK_TABLES is the ratification act — evidence package: the table's per-field provenance + this session's verification record).
2. Tier-1 facet re-bake for Elgin parcels (ldt nodeFacetBakeTier1Cli — needs its own scoping recon; blast radius unmeasured).
3. Engine zoning-fact bake for Elgin (post-refresh; note: Elgin's minted facts will initially lack code refs — COUNTY_FIPS_TO_DISTRICT_MAP_KEY maps 48021→bastrop_tx, so Elgin districts honest-miss; the elgin_tx map entry exists, needs per-jurisdiction key resolution or the same backfill idiom after mint — named refinement).
4. Re-gate (expect Elgin's three declines to flip) → depth warm (needs elgin warm script + city bbox, per recon Q4) → cert.
5. REASON-OVERSTATES re-word pass (Elgin's slice supersedes naturally at bake; Smithville remainder needs the neutral re-word).

## Process notes

Two flake-vs-real calls made correctly by the discipline: #379's first red was masked flake (portal-ui sockets), its second red was the REAL regression — pulled logs both times instead of pattern-matching. The #221 PDF flake did not recur. All merges tonight were gated on explicit conclusion strings.
