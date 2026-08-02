---
id: 2026-08-02_bastrop_city_and_fan_MASTER_WDLL
title: MASTER WDLL — Bastrop city scale-up + the greater fan exercise (with the full session record it rests on)
date: 2026-08-02
status: master WDLL (the frame for the Bastrop-city → fan arc; captures the session that produced it)
owner: nick
related: [2026-08-02_bastrop_city_scale_plan, 2026-07-29_setback_authoritative_source_and_road_decouple, 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED, 2026-08-01_scale_before_new_layers_sequencing, 2026-08-01_fan_readiness_audit_VERDICT, 2026-08-01_spine_health_audit_ledger, 2026-08-01_public_data_layer_expansion_candidates, 28_THE_BASTROP_MOLD_engine_build_spec, 42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy]
purpose: One durable document that pulls together everything this arc covered — the certified block, the plan to scale it to the whole city, the greater fan exercise, the pre-fan gate, the spine incident/audit, the layer-sequencing decision, and the open QA. So none of the hard-won context lives only in a chat transcript.
---

# MASTER WDLL — Bastrop city + the greater fan

## WANT
Turn the ONE certified downtown Bastrop block (Block-13, 7 parcels) into the whole City of Bastrop, ACCURATELY — carrying forward every one of the ~32 rulings / 17 amendments it took to get one block right — and from a proven city, into the greater fan (Bastrop county → central-TX → the state → eventually the country as certified smart sites). Accurate is the requirement; no lost step.

## DONE-LINE (nested)
- OUTER (product): the certified mold, stamped WIDE — statewide parcel + zoning + buildable that is source-correct, fails honestly, and is proven on cold counties. "One place, all the layers, current, everywhere."
- INNER (integrity): a COMPLETE, code-verified recipe of what makes a parcel correct + a gate that proves it before every widening, so the fan amplifies a good mold, never a flaw. The fan is only as trustworthy as the recipe it stamps.

## LESSONS (the through-line of the whole session — why the plan is shaped as it is)

### L1 — You can only STAMP what is CERTIFIED; the blast radius of "wrong data" scales with the fan
The pre-fan "built right, right data" gate (operator instinct, ratified this session): the fan-out takes the certified mold and stamps it across ~254 TX counties. If the mold pulls a wrong/stale source, or degrades SILENTLY when a source is missing, you do not get one broken parcel — you get 254 counties of confidently-wrong data, and (per the spine outage below) you might not know for days. So the gate must clear BEFORE the fan, not after. "Is it looking at the right data" splits into three checks, each needing its own probe:
1. SOURCE CORRECTNESS — is each layer pulling the AUTHORITATIVE source? (parcels = TxGIO/county-CAD not a stale Cotality fallthrough; zoning = the city's adopted code; flood = current FEMA NFHL; terrain = 3DEP). An audit of the wiring against the ruling of what each source SHOULD be. One class of this bug is known — the Cotality-fallthrough hazard.
2. HONEST DEGRADATION — does it FAIL CLOSED when a source is missing? ("not verified here", never silent-fabricate/fallback). The "certified a broken Bastrop" incident WAS a silent-degradation failure. At scale most counties are missing most layers (unincorporated TX is legitimately unzoned) — honest-absence must hold or the whole cited/current/honest thesis breaks in the field.
3. GENERALIZATION — does the mold hold on a county that ISN'T Bastrop? A COLD county nobody tuned, run through the same mold. The single highest-signal check; the one sampling-Bastrop can never give (area-not-sample).

### L2 — AREA-SWEEP, never parcel-sample; and grade the DRAWN geometry, not the card text
Certification is sweeping EVERY parcel in the customer-browsable extent (R3/R11/R14/R17), not a curated list/bbox/manifest — those are seeds, never scope. And cert grades the DRAWN envelope polygon measured in FEET by the engine's own index-matched inward-normal frame (R19/R21/R32), plus per-edge ORIENTATION (front-setback on the actual street-frontage edge, R31) — not the card numbers. "The planner read the number and called it correct" is the same self-grading trap as trusting an agent report; the truth is the polygon.

### L3 — BOTH gates: mechanical sweep AND operator live-QA (R6)
The mechanical sweep can be under-strict and pass a shape it says it rejects; the operator's eye catches it, and that catch tightens the assertion. Cert is not claimed until both pass. Verification is never delegated. For load-bearing geometry disputes, TWO BLIND MEASURERS (A16/A17) — independent convergence = high confidence.

### L4 — Persisted != recompute is the recurring defect; edition/parcel currency can go stale under you
The through-line bug across the whole setback saga: a re-warm promotes correct VALUES but reuses STALE per-edge ROLES or a stale ENVELOPE or a differently-wound RING (R10/R28/R30). And the underlying record goes stale: Bastrop REPEALED the B3 code (the whole saga's root); prop_ids get re-platted (R9/R15). Currency is a first-class gate — edition-currency (R16, general gate OWED) + parcel-currency in the cadastral.

### L5 — Silent failure hides for days unless you exercise the REAL work (the spine outage)
retrieval-api /search was dead ~4 days serving zero results while /health stayed green — because /health only checked liveness, not that search actually worked. Root cause: an unbounded SELECT over 3.67M atoms → OOM. This is L1's honest-degradation lesson at the infra layer: a monitor that doesn't exercise the real critical path is theater. Fixed + a functional /health/search probe added; the whole spine-health audit came out of it.

## THE PLAN (three arcs, gated)

### ARC A — Bastrop CITY (recipe-first; see 2026-08-02_bastrop_city_scale_plan)
- PHASE 0 (running / to-dispatch): READ-ONLY forensic recipe extraction. Read all 81 Bastrop docs + the cert script + the live serving code; distill every step to its SETTLED state; verify each is LIVE-IN-CODE (not paper); build the REVERSAL LEDGER (R18 retracted, CORRECTION A reversed by R1, CORRECTION C superseded by R8/R22, geometry-scrub theory overturned by A5, etc.) so no dead rule re-enters; adversarial completeness review ("what step did we miss?"). Output = THE RECIPE. GATES all build. Already surfaced: the cert script is NOT at the path the ruling cites (404) — if it is not a durable committed standalone, "certified" is not reproducible (critical finding).
- PHASE 1 (after recipe): scope the city DELTA — ~10k+ 48021 parcels currently fail-closed to "not verified here" (honest, per R13, but not served-correct); R17 city-wide cert scope; whether the R16 general edition-currency gate is needed before the city (likely the Bastrop string-filter covers the whole city since it's all B3 — verify); throughput for thousands vs 7 hand-driven parcels.
- PHASE 2 (operator-approved): area-sweep-the-whole-city loop, every recipe step honored, cert = full-city scope + engine-frame geometry + three-way convergence + operator R6.

### ARC B — the GREATER FAN (gated on Bastrop city proving + the pre-fan gate)
The fan-readiness audit already ran (2026-08-01_fan_readiness_audit_VERDICT) and returned NO-GO — but for the RIGHT reason:
- The mold is SOURCE-CORRECT (every layer to the ruled authoritative source, live-verified) and the FABRICATION FIREWALL HOLDS on cold counties (Williamson R-prefix landUseGateBlocked:true live) — so no confidently-wrong-data risk.
- BUT it is not wired WIDE enough: the parcel-provider registry stops at ~10 Central-TX counties. Harris/Fayette/~244 others return honest-empty (no-coverage / atom_path_pending). Fanning today stamps "not verified here" statewide — honest, but NOT a product.
- WHAT BREAKS FIRST at scale: county parcel-provider registration (map pin → polygon) before atom breadth, CAD join, or zoning can mean anything. So the FAN'S FIRST STAGE = per-county provider registration, then breadth-bake + owner-match gate, then it produces real intelligence.
- KEY UNKNOWN: Harris uses HCAD (13-digit key, a DIFFERENT appraisal system than Central-TX PACS/Orion) — the HCAD join is untested and must be validated (owner-match sample n=200) before trusting metro land-use, or you fabricate at metro scale.
- STATEWIDE SOURCE FINDING (this session): TxGIO `2025_Land_Parcels` is a single statewide service covering all 254 counties — so the fan's parcel-provider step may collapse from "register 254 providers" to "register ONE TxGIO source + validate per-county CAD/zoning join." Confirm and use it.
- The proof-loop (when un-gated by Bastrop city): register TxGIO statewide → prove the full loop on Fayette (clean/rural) + Harris (metro/HCAD unknown) → re-run the readiness gate → GO/NO-GO → then batch. Do NOT fan wide off an unproven loop.

### ARC C — LAYER SEQUENCING (ratified this session — the frame for the fan; see 2026-08-01_scale_before_new_layers_sequencing)
Do NOT establish the other public layers before scaling — scale the CERTIFIED layers wide first (you can only stamp what's certified; adding uncertified assembly layers before scaling multiplies the cert burden at scale — the drift trap). "New public layers" is TWO kinds of work:
- STATEWIDE-UNIFORM layers (soils/SSURGO, wetlands/NWI, OZ, transmission, school districts) — single national/state source, NO per-city cert. The OZ layer fixed this session IS the template: wire one source, works everywhere. These ride as a CHEAP PARALLEL TRACK during the scale, land statewide instantly, do NOT gate the fan.
- ASSEMBLY-DERIVED layers (utility-availability from local records, easements, historic overlays) — same cert cost as zoning/setback. WAIT until after the scale proves the mold holds wide.
Ratified ordering: (1) land in-flight fleets + stabilize; (2) fan the scale-out on parcel+zoning+buildable statewide (the flagship); (3) parallel cheap track — soils/SSURGO first (Central-TX septic/expansive-clay value), then wetlands/transmission/etc.; (4) HOLD assembly-new-layers until scale proves out. Strategic clincher: coverage is the wedge (GTM pivot 2026-07-04), and uniform layers get BETTER the wider you are — "one place, all the layers, everywhere" beats "a seventh layer in one city."

## SESSION RECORD THIS RESTS ON (so the context is not only in the transcript)

### Spine incident + health audit (2026-08-01)
- retrieval-api /search silently dead ~4 days (unbounded SELECT over 3.67M atoms → OOM); invisible because /health only checked liveness. FIXED (hauska-engine #201: SQL pushdown, works at 1Gi) + functional /health/search probe added. cortex-api #370 routed chat retrieval to the healthy /search. CITATIONS then rendered live (operator-confirmed [n] chips).
- The catch that generalizes: a "successful" deploy shipped STALE code because it pulled the :latest image tag which RACED the push-build (cortex /api/health/ready fell through to the SPA). Fixed by SHA-pinning + curling the NEW endpoint. Memory saved.
- Spine-health audit (read-only, adversarially gated) → ledger. Adversarial gate REFUTED 3 planner-recon claims (engine/MCP "17/21 revs behind" — actually serving latest; contract-pin outage — additive hygiene; InMemory outage — DATABASE_URL set) and CONFIRMED the real holes. All resolved this session: functional /search alert; MCP health honesty (#54); the 4 remaining lanes (MCP readiness #55, cortex functional health #371, fail-closed substrate #372, SmartCity honesty #32) merged+deployed+verified; dark-project monitoring applied (smartcity-os-prod went from ZERO to functional uptime+alerts+channel). Full ledger: 2026-08-01_spine_health_audit_ledger.md.

### OZ statewide layer (2026-08-01/02)
- Operator QA: OZ pockets must be visible zoomed out (all-of-Texas), not zoom-gated to 11+. FIXED (#142): dropped the zoom<11→no-data gate; statewide LOD (TxGIO/CDFI STATE=48, ~628 TX tracts, simplified to ~0.6MB; unsimplified 19.5MB blows the serverless budget); full detail zoomed in; provenance at both LODs. Live-verified: 628 tracts return. This is the TEMPLATE for the uniform-layer parallel track (Arc C).
- OZ zones-vs-tracts clarification: for the federal §1400Z Opportunity Zone program, "zone" and "tract" are the SAME thing (one designated-QOZ polygon set; CDFI FeatureServer has exactly one layer — confirmed). Our layer is correct + complete for OZ. The "two different programs / two maps" the operator recalled = OZ vs OTHER place-based programs (New Markets Tax Credit, HUD Qualified Census Tracts/DDA, HUBZone) — separate programs, separate tracts, separate maps, not carried today; each a potential future uniform layer.

### Public data-layer expansion candidates (parked — 2026-08-01_public_data_layer_expansion_candidates)
Captured in full, parked (not dispatched):
- Power lines answer: transmission = public/clean (HIFLD); distribution routing = mostly NOT (CEII-restricted); service territories = public (PUCT). Flag: Oncor vs "Encore" — confirm which utility.
- Ranked "what's worth adding" map (Tier 1/2/3), filtered by "changes the ANSWER, not the picture."
- Recommendation: utility-availability-at-the-parcel + soils/SSURGO as the two highest-leverage first adds.
- Scoping-pass shape for when we return: pullability + atom shape + wedge + cost-per-jurisdiction.

## OPEN ITEMS (owed, tracked here so they are not lost)

### O1 — Upstash (from MCP readiness #55): the parked rate-limit DB
MCP /health/ready deliberately EXCLUDES upstash from critical-deps because the Upstash rate-limit DB (fluent-magpie-131764) was decommissioned 2026-07-05 and is INTENTIONALLY parked — rate-limiting runs on the ResilientRateLimitStore in-process memory fallback (PR #36). #54 made /health report it honestly as "skipped (parked)" instead of false "down". WHAT TO DO: this is fine as-is for now (memory fallback works; health is honest). The real fix is operator-owned and NON-URGENT — recreate an Upstash DB + update UPSTASH_REDIS_REST_URL/TOKEN + redeploy → distributed rate-limiting restores with NO code change. Consequence of leaving it: rate limits are PER-INSTANCE only (each Cloud Run instance has its own memory counter) — acceptable at current traffic, matters when MCP scales to real multi-instance load. TRACK as a pre-scale infra item, not a blocker.

### O2 — "Not wired wide enough" (the fan's core blocker, from the readiness verdict)
The parcel-provider registry stops at ~10 Central-TX counties; Harris/Fayette/~244 return honest-empty. This is THE fan blocker and it IS the fan's first build stage (Arc B): register the provider (likely one TxGIO statewide source) per county, then bake. Not a bug — the un-built wiring. Resolved by executing the fan's stage 1, gated on Bastrop-city proving the recipe first.

### O3 — CITATION CHIP QUALITY (operator QA 2026-08-02, live screenshot — 909 Chestnut)
Chips resolve to an atom but some are VAGUE and one had NO source link to open. Diagnosed (code-confirmed, read-only): NOT a render bug — an INGEST-QUALITY gap in the BDC corpus. (a) brokerageBrief.ts:492 attaches sourceUrl ONLY IF the atom carries one — the BDC atom for 14-02-008 has NO sourceUrl → chip cannot link out. (b) "Full record unavailable — showing the cited excerpt" means the atom carries a truncated snippet, not the full section body → vague chip. FIX CLASS: re-ingest / enrich the BDC atoms with (i) an ordinance deep-link sourceUrl and (ii) the full section body. This is a BASTROP DATA problem → it belongs IN THE BASTROP RECIPE (Phase 0 must add "BDC atoms carry sourceUrl + full body" as a settled-recipe requirement; the citation contract is "a promise you can open and verify" — a chip with no openable source violates it). Tracked as a recipe item, not a one-off patch.

## DISCIPLINE (carried across all arcs)
Read-only until an approved build phase. Adversarial review on every finding + every build report; verification never delegated; two-blind-measurer for load-bearing geometry. Area-sweep not parcel-sample. Grade drawn geometry not card text. Cert scope = customer-browsable extent. Both gates (mechanical + operator R6). No dead ruling re-enters (the reversal ledger). Currency gates (edition + parcel). Fail-closed on missing sources; a monitor must exercise the real work. Deploys planner-owned; Cloud Run traffic-trap + :latest-image-race + persisted!=recompute all in play. No-special-data-access (every source path works for a no-relationship jurisdiction). No timeframe estimates.

## THE BET
Finish+extend: the block proved the model holds (A14/A17 — narrow contained bugs, never a model wall). City = same recipe, more parcels/districts/geometry. Fan = same mold, more counties, provider-registration first. If the city or a cold county hits a wall the recipe can't clear, THAT is the rebuild trigger — with the tightest failing test case. But the recipe must be COMPLETE and code-verified first, or we scale a hole.
