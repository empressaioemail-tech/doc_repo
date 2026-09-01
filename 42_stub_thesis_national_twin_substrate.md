---
id: 42_stub_thesis_national_twin_substrate
title: The stub thesis — the national twinned-place substrate (working name "stub" — TBD)
last_updated: 2026-08-10
status: canonical thesis (ratified in discussion 2026-07-31; seeds the cross-repo doc reconciliation + archive program)
owner: nick
related: [41_three_wedge_spine_strategy, 09_post_saas_substrate_thesis, 40_hauska_map_3d_implementation_brief, 30_block_cert_harness_spec, _prospects/mox]
purpose: The unifying thesis. The company builds ONE thing — the national inventory of fully-twinned places — and everything else (wedges, apps, doors, RWA connectivity) is a mode of producing or accessing it. Supersedes/unifies the three-wedge frame (doc 41) by naming the UNIT and the DESTINATION. NAME "stub" IS PROVISIONAL — to be finalized before the doc reconciliation.
---

# The stub thesis

> **THE UNIT IS NAMED, AND THIS DOC IS SUPERSEDED IN PART 2026-08-10 by [`portfolio_thesis/01_the_layer_and_the_three_doors.md`](portfolio_thesis/01_the_layer_and_the_three_doors.md).** The portfolio thesis folder is the reference set; where it and this doc disagree, **it wins**. **"Stub" is resolved: the unit is a smart site.** Read "stub" as "smart site" throughout — the placeholder-name question below is closed. The three temporal modes still hold, with one correction: **deepen now has a self-serve path (Property Watch) that did not exist when this doc was written**, where deepening meant only heavy engagements. Also carried forward and still binding: the two-altitude rule — "digital twin" is internal language and stays internal.

Ratified in strategy discussion 2026-07-31. NOTE: "stub" is a WORKING NAME for the unit — a single-word name is TBD and will be set before the cross-repo doc reconciliation. Everywhere "stub" appears, read "the unit" until named. **(Closed 2026-08-10: the name is smart site — see the banner above.)**

## THE UNIT — a stub
A stub is a FULLY-TWINNED PLACE: every layer that governs it — lots, roads, topo, land-use code, building codes, utilities, setbacks — where "twinned" means two specific, already-solvable things are DONE for that place:
1. THE DATA STRUCTURE exists (atomized, provenance-carrying, queryable — the atom/node layer).
2. THE MAP-LEVEL VIZ is figured out (you can SEE it — the map / eventual 3D surface).
And both are reachable through TWO DOORS: MCP (agent-callable) and PE (human app). The stub is complete regardless of which door asks — an RWA tokenizer's agent hitting MCP gets the same fully-twinned place a realtor sees in PE.

A "stub ready for RWA" is NOT a special tokenization feature. It IS the completed twin. When the RWA world shows up to represent a real asset, the hardest part — establishing verified, multi-layered, CURRENT truth about a physical place — is already done. They plug their instrument into a place we've already made real. We build no token layer; we build stubs.

## THE ACTIVITY — stub production + stub deepening (three temporal modes)
Every wedge/motion is the SAME act: make more of the country into stubs, and make each stub deeper (more layers). Three modes by WHEN we get the data:
- RECONSTRUCT existing public reality (PE: roads, properties, codes, setbacks, topo) — catching up to reality that already exists messily.
- DEEPEN existing assets (Bastrop UTILITIES; Mox's connected systems) — filling in layers on assets that exist.
- ORIGINATE new assets as stubs (SUBDIVISIONS: developers twin their subdivision AS they build it) — the cleanest mode: stubs born clean at creation, no drift, no reconstruction. Highest-value RWA inventory (new, financeable, motivated-to-tokenize owners). Live willing Bastrop test subjects lined up.

## THE DESTINATION
The whole country twinned in 3D — topo, lots, roads, utilities — every place a stub, each with the RWA-ready stubs (verified truth + both doors) waiting to receive the RWA revolution (~$3T-in-5-years market). We are not in the RWA business; we are the substrate the RWA wave plugs into, and it exists as the byproduct of the twin. "The $3T market plugs into what we're already building."

## THE TWO-ALTITUDE POSITIONING RULE (load-bearing — do not violate)
INTERNAL thesis language and EXTERNAL market message are at OPPOSITE altitudes and must stay separate:
- INTERNAL: stub / twin / atom-node / RWA-substrate / national-twin. This is how WE reason and build.
- EXTERNAL (mass market): NEVER say "digital twin," "RWA," "atom/node substrate." Operator has asked 100+ people; unless web3-native, NOBODY knows what a digital twin is. What they DO feel: point solutions suck, disparate apps suck, switching between systems is misery. The market message is "stop switching between fifteen apps — one connected system, your data actually talks to itself." We sell the pain-killer (unified systems / no app-switching); we build the moat (atomized national stub structure); the customer never needs to understand "twin" or "RWA" to get value.
- TWO AUDIENCES, ONE BUILD: mass market (cities/developers/operators) hears "unify your systems, stop app-switching." The RWA market (tokenizers, the $3T wave, web3-native — they DO know what a twin is) finds us as "the national physical-asset layer with verified truth + stubs ready to attach." Same build; the pitch differs by who's listening. This resolves why "twin" and "connect-systems" are ONE move internally but stay distinct externally: internally one primitive (atomize+connect → stub); externally we never name the twin — we name the relief from disparate systems.

## HOW THE THREE WEDGES (doc 41) UNIFY UNDER THIS
The three wedges are three modes of stub production, all feeding the national-stubs destination:
- RE-PRO wedge (PE + MCP) = reconstruct-mode stub production, monetized via pros. Revenue + proof. The first slices of the national twin (roads + properties, live).
- MUNICIPAL wedge (SmartCity + Vertosoft + plan-review) = deepen-mode (city infra/utilities) + the plan-review off-island calibration loop. SmartCity's existing "unify your vendor systems" pitch IS the external-altitude message; the spine underneath makes it real/durable/stub-producing.
- CUSTOM-BUILD wedge (Mox-class) = deepen-mode for private commercial assets on top of the public layer. Connect their systems = you're most of the way to a building twin; sensors + 3D model are tablestakes on top. The DATA STRUCTURE is the moat; the model is decoration.
- SUBDIVISIONS = originate-mode, the sharpest on-ramp (born-clean stubs, RWA-ready, live test subjects). NEW motion added this session.
Plan-review remains the keystone (serves RE-pro next-surface + municipal off-island + Vertosoft payload + ICC use case).

## WHAT'S ALREADY BUILT (grounding — corrected 2026-07-31)
- The atom/node structure + the map viz (roads, properties, topo/contours, setbacks) — LIVE. First stubs exist.
- The SDK is built around a VDA (Verifiable Digital Asset) primitive + event-anchoring hash chain + payment substrate (x402, USDC Base/ETH/Polygon, Circle) + IPFS/blockchain adapters (ADR-018). Attestation + anchoring are BUILT capabilities, not decisions to make.
- The INBOUND per-reference meter is LIVE (source-obligation-meter.ts, append-only ledger, migration 009), accruing against a real source-actor identity (did:hauska:actor:org:icc). The metered-source PIPE is built and live — WAITING ON FIRST CUSTOMER (ICC) to implement (set per-reference rate, wire hard content->actor reference, stamp accessPolicy, flip on/off, light CC usage screen). "Built, waiting to be implemented by our first customer."
- STILL NEEDS WORK (payments, part of the ICC track): outbound revenue-share on paid ICC-cited reports (RevenueRouter/SourceActorReference placeholder), per-reference RATE unset, content->actor hard reference (heuristic today).

## MARKET POSTURE — OWN public, CONNECT to private RWA
- OWN (the market we lead, possibly the only viable solution): PUBLIC INFRA TWIN + DURABLE PUBLIC RECORDS. "Own" is operational, not positional: we already twin roads + properties; extend the same method to city INFRASTRUCTURE (Bastrop utilities), GIS-first as the base layer NOW; live-sensor/SCADA/IoT is a SEPARATE gated conversation (needs the city; may hit safety/feasibility walls) offered as a product via Vertosoft where feasible. "Own public records" = our atom/node structure is a BETTER value prop than the current "on-chain" go-to for durable public records, sold standalone or bundled via Vertosoft. The twin claim: we can twin city infra like no one else — the hard part is the DATA STRUCTURE (our core solve), not the 3D model or sensors (tablestakes). Bastrop is the proof-in-progress (pioneer framing, now pointed at infra).
- CONNECT (the connectivity we offer, not a market we own): private RWA folks / commercial tokenizers — we're the verified-truth + attestation FEED they build on, not the issuer. Mox fits here (customer-owned VDA-wrapped twin; we're truth-underneath if they tokenize).

## SEQUENCING NOTES
- DURABLE SEQUENCE (doc 41): PE-to-market = revenue engine (finish: paywall unlock + Stripe/CRM + all-TX). Municipal = long money, prepped-not-sprinted (Vertosoft ~1mo is channel-ready, NOT fast-track pressure). Custom-build (Mox) = parallel commercial proof. Not fast-tracking anything; building for durable results.
- STATEWIDE LIDAR / TERRAIN — pull SOONER (operator instinct, endorsed): TxGIO has already flown LiDAR statewide, free on the DataHub (doc 40 Phase 2 already plans this). Frame is NOT "commission a flyover" — it's "ingest the existing statewide TxGIO DTM as ONE coherent terrain source" (terrain is the one CONTINUOUS layer across jurisdictions — topo doesn't stop at a county line; managing it as one statewide artifact beats per-county stitching). Doing it early = accelerates the stub's VIZ half (half the stub definition) + de-risks Phase 1 (surfaces the MapLibre extrusion-base-on-terrain open question). SAFETY: ADDITIVE terrain layer ONLY — power the 3D viz + NEW terrain features off it; do NOT silently repoint live reports (flood/drainage use Bastrop contours; the vertical-datum trap NGVD29-vs-NAVD88 ~0.5-1ft would shift flood depths). Additive-then-migrate-per-report, never swap-underneath. GATE: find the tile pipeline (doc 40 Phase 0B T-003) first — terrain adds a second tile artifact to a pipeline we haven't located.

## THIS SEEDS THE CROSS-REPO DOC RECONCILIATION + ARCHIVE
This thesis reframes the portfolio: rewrite 09 (thesis) around the national-stub/RWA destination; establish the two-altitude positioning rule as canon (no doc/dispatch leads market-facing with "digital twin"); add subdivisions as a motion; archive stale docs written under old assumptions (two-wedge / cortex / partnership-first / pre-SDK-grounding). DO THIS AFTER the unit is NAMED (name TBD — operator finalizing). This doc is the anchor the reconciliation hangs off.
