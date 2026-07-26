---
id: 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks
title: Decision — the base-layer / connecting-tissue thesis, the fidelity + marketplace tracks, and the architecture rulings under them
date: 2026-07-26
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [09_post_saas_substrate_thesis, 27_MASTER_WDLL_spine_completion_and_depth_engine, 27c_road_node_engine_and_warm_digital_twin_spec, 2026-07-23_ai_memory_substrate_thread_PLACEHOLDER, 25b_monetization_provenance_storage_stack, 80_adrs/adr_018_atom_contract_substrate_layer]
reversal_criteria: reverse or amend if the wedge (buildable answer) fails to prove out cheap-and-honest at county-fan-out scale, or if the write-back loop cannot be made to work under tenant sovereignty without becoming a data grab. The thesis is a destination that the depth engine earns the right to; it does not change near-term work, so it is falsifiable by the near-term work failing, not by argument.
---

# The base-layer / connecting-tissue thesis and the tracks under it

Captured 2026-07-26 during the depth-engine build (while the three Bastrop fixes ran). This is the strategic frame that emerged from drilling into the fidelity and marketplace tracks. It is 09-level (peer to the substrate thesis), and its discipline clause matters as much as its ambition: it reframes everything and changes nothing about the near-term work.

## The bigger vision (the connecting tissue)

What we are building is the next-generation public property-data layer: the canonical, provenance-carrying, machine-addressable base layer of physical-world property truth — the identity-and-ground-truth substrate that permits, twins, title, minerals, RE tokenization, and on-chain county/title records all reference and interoperate through. Not a competitor to any of those verticals. The layer they are all missing.

Why it is the missing link (the argument, not the hope): every one of those verticals is stranded on the same missing primitive — a canonical, authoritative, machine-addressable identity for the physical thing. Title-on-chain needs to know which parcel, as a stable id not a text address. Tokenization needs the token to wrap a real verifiable property node. Permits attach to a parcel and reference its zoning/setbacks. Minerals tie subsurface rights to the same surface parcel. Twins anchor to the parcel and the road. They all need the same trustworthy identity + base geometry, and today it does not exist — each vendor re-derives its own janky version (text address, APN string, lat-lng) and none interoperate because none is canonical and none carries provenance you can trust. The node id is the primary key the whole ecosystem is missing.

Why we specifically can be it: connecting tissue must be trustworthy without a trusted party — every fact carrying provenance, confidence, source, timestamp, unable to silently lie. That is the entire substrate thesis (sell reasoning not data; confidence is earned; provenance on every atom). On-chain systems need exactly this because on-chain is trustless by design; the atom is basically an oracle-ready fact, and CID content-addressing is already the on-chain-compatible integrity primitive. Our substrate is already shaped like the thing on-chain property systems need to reference off-chain. (This is why the IPFS thread is not a side quest — content-addressing is the bridge between our base layer and any on-chain system referencing it.)

Perfect-world end state (operator): government-backed as THE authoritative source for this layer. Named as the north star, not a near-term dependency.

## The discipline clause (load-bearing — this is why the vision is safe to hold)

You do not become the connecting tissue by declaring it. You become it by being the layer so obviously the canonical base that the title company, the permit system, the twin builder each independently decide to reference our node id because it is easier and more trustworthy than rolling their own. Coverage + trustworthiness is what makes us canonical. The vision is the destination; the depth engine is the road. The near-term work (county fan-out, fidelity track, write-back contract, CID/content-addressing) does not change — it is validated, not redirected. Same work, bigger why. If the vision ever starts pulling work toward itself ahead of the wedge, that is the drift to catch.

## The two tracks (both collapse into one flywheel)

### Fidelity / precision track (the survey-grade axis, orthogonal to breadth/depth)

The roadmap to date is the breadth/depth/national track of the v1-precision base layer. Fidelity is a SEPARATE axis: making a given parcel's answer survey-grade rather than honest-approximate. It runs as per-domain fidelity engines BEHIND the breadth/depth engines, upgrading the same atom on the same node (retire-not-overwrite, temporal depth preserved: "what did we know at approximate-tier vs survey-tier"). The confidence tier on the atom IS the fidelity level — the fidelity track is the mechanism by which "confidence is earned" (commitment #2) becomes literally true for geometry, not just reasoning.

Version ladders (previously undefined — "v1" was shorthand for "honest-approximate, precision deferred"; now named):
- Road edges: v1 OSM centerline + assumed-per-class ROW (now) -> v2 true ROW from CAD/county survey -> v3 road surface topo (crown, grade, curb; feeds hydrology + twinning).
- Terrain: v1 USGS 3DEP ~10m DEM (now, "confidence 0.60 asserted") -> v2 LiDAR/higher-res -> v3 drone photogrammetry / survey-grade.
- Parcel boundary: v1 county GIS polygon ("not a survey") -> v2 recorded plat -> v3 boundary survey.

Sourcing strategy (operator-decided 2026-07-26): the affordable, on-thesis path is
1. Un-ingested public high-fidelity data (county ROW, TxDOT, USGS LiDAR, plats) — v2 for many parcels with no new capture; same "the tag was in OSM and we threw it away" pattern.
2. ML-refined precision (photogrammetry from aerials, ML boundary refinement, DEM super-resolution) — compute higher fidelity from data we have. Operator likes this tier.
3. Document parsing of the recorded-survey / public-record corpus — atomize prior recorded surveys (they exist as documents, not data) into queryable fidelity atoms. This is on-thesis (atomize docs into facts) and it is THE build-to goal: it makes our base a BETTER STARTING POINT than what a surveyor starts from today. We sell that to surveyors (a better base to survey from) AND to the public in the app form we already ship.
4. Net-new survey capture: we do NOT fly the drones. Capture is capital/ops-heavy, geographically fragmented — the opposite of a substrate. The disruptive move is to be the layer survey capture flows INTO, via the marketplace write-back (below), not to become a survey company.

### Marketplace track (the SDK/MCP/export surfaces + the write-back contract)

Consumption side (partly planned): SDK/MCP/export surfaces let owners, developers, and twinning companies build ON the base. The IFC-with-road-frontage-and-topo export is the first concrete piece — the seam between our public base and a private twin, and the surveyor-replacement value ("what I'd get from a surveyor") plus the platform hook (their private model sits on our public base, and so does everyone else's).

The write-back contract (the LINCHPIN — net-new design work): the difference between a data VENDOR (value flows one way out; commoditizable) and a compounding SUBSTRATE (higher-fidelity data flows BACK, upgrading the base; every twin built makes the base better; the moat is the enriched base nobody can replicate). We want the substrate. How the flow-back works, mapped to the substrate we already have:
- The base is content-addressed and node-identified — a twin built on us is ANCHORED to our node ids and CIDs (their building sits on parcel 48021:34785, fronts road 48021:road:..., on terrain atoms with known CIDs). The anchoring IS the write-back channel: their higher-fidelity data arrives already keyed to our nodes.
- Write-back = new atoms on existing nodes at higher confidence. A boundary survey done for a twin -> a v3 parcel-boundary atom on our parcel node (provenance = the survey). A drone flight -> v3 terrain atoms. They keep the BUILDING (private IP, tenant-private); the base-layer ground truth under it flows back.
- Sovereignty is the gate that makes it acceptable (not a data grab): per-atom accessPolicy lets the contributor control public vs tenant-private vs pooled. Enterprise twinning companies build on us rather than fear us because they control what flows back.
- The payment substrate (ADR-018, built) routes credit/revenue-share for contributed fidelity — contributing is incentivized, not extracted.

### The flywheel (why the two tracks are one loop)

The marketplace IS the sourcing strategy for the fidelity track. We do not capture survey-grade at scale; we make the base so useful that everyone building a twin CONTRIBUTES survey-grade back as a byproduct. Fidelity improves because the marketplace exists; the marketplace exists because the base is the coordinate system every twin must anchor to. Same flywheel shape as the confidence-calibration loop — which is evidence it is right (the thesis keeps producing the same shape).

## The surveyor-relationship finding (reshapes both tracks)

There is NO public base data surveyors have that we are locked out of — they start from the same public record we do (county GIS, plats, TxDOT ROW, USGS control, FEMA, aerials). The two things they have that we do not:
1. Recorded survey DOCUMENTS not digitized as data — public, a parsing problem not an access problem, on-thesis to ingest (fidelity sourcing #3 above).
2. Physical field measurement + professional boundary adjudication — net-new, irreducible, cannot be sourced by any data ingest ever. This is EXACTLY what the marketplace write-back exists to capture.
Conclusion: we do not compete with the surveyor on base data. We match their starting base from public record, exceed it by ingesting the recorded-survey corpus they read manually, and RECEIVE the one thing we cannot produce (field-measured ground truth) via write-back. The surveyor becomes the field-measurement node in a network whose base layer is ours. We can also SELL them a better starting base.

## Architecture rulings captured this session (they would die in chat otherwise)

- ONE OWNER PER SHARED SUBSTRATE. Parallelize executors (county axis) and genuinely-independent streams (UI, CC controls); do NOT stand up multiple planning agents that "jive" on the same program/write-path — that re-creates G4 (surfaces disagreeing on a committed count) one level up. The recon proved it: it took one coherent mind to reconcile three conflicting depth numbers into truth. The site-plan-vs-depth-warm bug is the same anti-pattern (two code paths, same job, drifted) one level down.
- PLURAL STORES, SINGULAR TRUTH. Do not stand up more coordinating databases — every added store is another place truth can disagree with itself (the 9.27%-vs-64% mess was a three-source reconciliation). Scale the ONE substrate via partitioning (by FIPS/region) + read-replicas (same truth copied, not a second truth) + tiling. Physically-distinct specialized stores only where a data type demands it (spatial/PostGIS, tiles/object-store, blobs). One ledger on top tallies across whatever stores exist; the ledger owns "what exists," the stores own bytes.
- IPFS IS THE CONTENT LAYER, NOT THE LEDGER. IPFS fits the vision as the content-addressed store under the atom's CID pointer (blobs, geometry, documents, exports) — dedup + tamper-evidence + distribution for free, and it is the on-chain bridge. It does NOT replace the queryable ledger (IPFS cannot SELECT/aggregate; G1 coverage is a live query). Keep one queryable ledger on top indexing the CIDs. Storage plural, truth singular. GCS->IPFS for the content layer is an independent later migration, not a today-decision.
