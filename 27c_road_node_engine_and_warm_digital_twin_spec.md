---
id: 27c_road_node_engine_and_warm_digital_twin_spec
title: The road-node engine, road-type-aware setbacks, and the warm digital-twin layer — WDLL
status: spec (APPROVED 2026-07-25 operator; active build — FIX 2.1 front-labeling gate)
last_updated: 2026-07-26
applies_to: hauska-engine (supply engines, descriptor, property-reasoning), legacy-design-tools (buildableEnvelope derive), hauska-map/apps/command-center (the ledger), hauska-map/apps/property-explorer (the customer surface), hauska-atom-contract (road node kind)
owner: nick
extends: 27a_jurisdiction_factory_engine_spec (the ratified supply-engine program — this deepens engines INTAKE + RULE and adds the road node)
sub_wdll_of: 27_MASTER_WDLL_spine_completion_and_depth_engine (this is the active build sub-WDLL; the master governs sequence + the nested done-line + M0 as sprint zero)
related: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program, 2026-07-25_setback_geometry_and_calibration_handoff, 2026-07-23_ai_memory_substrate_thread_PLACEHOLDER, 09_post_saas_substrate_thesis, 61a_central_tx_coverage_program, 04a_arrow_two_calibration_capture]
pilot: bastrop_city_and_county
---

# The road-node engine, road-type-aware setbacks, and the warm digital-twin layer

> **Precedence note 2026-08-09.** On pipeline and doctrine this doc is subordinate to `90_runbooks/factory_onboarding_runbook.md` and the `90_operations/OPS-*` band per `_decisions/2026-08-09_factory_spec_precedence_ruling.md`. It is retained ACTIVE because it is the only statement of the road-node design contract (first-class node identity, centerline, edges, ROW, classification, provenance, digital-twin attach points, the v1 assumed-ROW posture), which is ruled FOLD-THEN-RETIRE: fold that contract into `28_THE_BASTROP_MOLD_engine_build_spec.md` or an OPS row before retiring this doc. The road-class-to-setback-VALUE indexing below is already RETIRED by `_decisions/2026-07-29_setback_authoritative_source_and_road_decouple.md` and must not be folded forward.

WDLL (What Done Looks Like) for the next build arc. This is not a greenfield program. It is a grounded deepening of the ratified supply engines in 27a, forced by a specific, live, customer-facing failure (a jagged buildable-envelope polygon on 714 Spring St) that a code-level diagnosis traced to a poor-memory-architecture root, not a hard-math root. The diagnosis, the road-type correctness gap, the warm-up policy, and the digital-twin foundation that falls out of it are all captured below so the eventual multi-sprint build traces to a contract, not a chat.

Approval gate: NO build until this WDLL is approved. On approval it becomes a multi-sprint program, executed under the same discipline as 27a/27b (fewer agents, tighter contracts, harder gates, verification never delegated, graded against LIVE state with evidence pasted).

## Origin of this thread (why we are here)

The 2026-07-25 F1 session closed the Command Center (27b) and, in closing, surfaced a setback saga with three distinct bugs. Two are resolved: the not_specified display bug (PE #67 / engine #120 / LDT #355) and the export-gate false-refusal (engine #121 + #122, serving hauska-engine-api-00086-hoz at 100%, verified live on 48021:47595 returning real PDF/DXF/IFC with honest F 15' + S/R not-specified disclosure; true-missing still honestly 422s). The third bug is NOT resolved and is the origin of this WDLL: the buildable-envelope GEOMETRY is wrong. On 714 Spring St (48021:33512, Front 15') the drawn inset polygon is a mangled, jagged, non-parallel shape that does not follow the boundary at a consistent offset. Even where the setback VALUE is correct, the code that computes the inset produces garbage.

A read-only code diagnosis (2026-07-25) established the mechanical root cause and, in doing so, confirmed a thesis that had been developing in parallel (the AI-memory-substrate thread, placeholder 2026-07-23): this is a poor-memory-architecture failure. The geometry is a solved problem; the fleet had no durable memory of the lesson, so the code re-derived a wrong-enough answer and no gate caught it. That connection — that calibration, agent memory, and the warm ledger are the same architecture at different altitudes — is what turns a one-parcel fix into an engine build. The operator's framing, verbatim in intent: "this is a process that needs to happen before we go to market, any market... maybe we are morphing into the engine build. I always thought we would bleed into it and this seems to be that time."

## What the code diagnosis found (the mechanical ground truth)

The buildable-envelope derive lives in legacy-design-tools at artifacts/api-server/src/lib/buildableEnvelope/ (derive.ts orchestrates, edgeLabeling.ts labels front/side/rear, geometry.ts does the offset math), with a route wrapper at routes/brokeragePlaceBuildableEnvelope.ts. The findings, each cited to file:line in the diagnosis record:

The offset is a hand-rolled naive per-edge mitered parallel offset (geometry.ts insetProjected, ~197-236): each edge is moved inward by its own distance along the inward normal, then adjacent offset lines are re-intersected. This is correct only for convex/rectangular rings. On a concave or irregular ring (a real parcel with survey vertices) the miter produces spikes and self-crossings at reflex vertices. That is the jagged polygon.

The degeneracy guards (insetIsDegenerate, ~244-279) detect bad output but only to REJECT it to an empty envelope; none repairs. And the self-intersection check (ringSelfIntersects) requires a strict proper crossing, so partial tangles and near-collinear slivers slip past and get drawn verbatim. The honesty gate exists but its predicate is too weak — a wrong answer renders as if right. This is the F1c honesty gap in miniature.

There is zero test coverage for the failure class. Every test in the module uses axis-aligned rectangles and asserts scalar area or the empty flag. Not one concave, L-shaped, or corner fixture; not one assertion that the output ring is contained, non-self-intersecting, or offset by the correct distance. The bug was untestable, which is why it shipped.

Unit/projection is NOT the cause (feet are converted to metres and offset in a local equirectangular metric frame) and not_specified never reaches the geometry (it is handled in the provenance/gate layer upstream). Those are ruled out.

The memory tombstones are explicit. The module header states no geometry library is available so the math is hand-rolled, and separately reasons correctly that a whole-polygon buffer is wrong for setbacks — then implements the OTHER naive option (per-edge miter) without the reflex-corner handling a real polygon-offset gives. An agent, in a now-dead context window, knew enough to reject one naive path and not enough to reject the second, and left no durable memory of the missing lesson. package.json carries no turf/jsts/martinez/polygon-clipping; the geometry is entirely reinvented.

Root-cause ranking: (1) naive per-edge miter on non-rectangular rings, most likely; (2) self-intersection guard too weak to catch partial tangles, so garbage escapes to the wire; (3) edge mislabeling on irregular rings (frontFromShape picks the globally shortest edge as "front," which on a jagged boundary can be a survey artifact edge) feeding wrong per-edge distances — a contributor, and the reason a clean polygon can still be drawn on the WRONG edge.

## The correctness gap the diagnosis did not reach: roads have types, and setbacks depend on the type

The geometry fix alone is necessary but not sufficient. Setbacks are road-type-dependent by rule. A front on a highway, a front on a minor collector, and a frontage on a gravel alley are three different setback numbers; an alley frontage is often not a "front" at all but a reduced-setback or rear edge with its own prescription. The current pipeline knows only "there is a road near this edge" (edgeLabeling.ts picks the front by proximity to an OSM centerline via roads.ts, and throws the road's TYPE tag away). So even after the offset math is correct, the engine applies the right geometry to the wrong distance, measured possibly from the wrong edge. Geometry-correct and answer-correct are two different bars, and today the pipeline can pass neither.

The setback table in the descriptor confirms the gap structurally: descriptors today carry a flat setbackTable (verified in the bexar_tx_fixture descriptor at packages/engine-core/src/property-reasoning/fixtures/descriptors — key "setbackTable": { "rows": [] }). A flat table has no axis for road class. The fix is to index the setback rule by (road-class, edge-role) in the descriptor, keeping the RULE engine jurisdiction-agnostic (it looks up the rule; the jurisdiction knowledge lives in the descriptor, honoring 27a's anti-zombie line). Road-type-aware setbacks do not violate 27a's architecture; they complete it.

## Alignment with the breadth program: this is the DEPTH engine (it consumes 61a's footprint, it does not re-bake it)

Live ground truth from the 2026-07-24 Central-TX coverage milestone (live-Neon audited): 10 Central-TX counties carry a full Tier-1 zoning-fact chain — ~2.15M parcels, no over-claim, ~$5.12 total metro compute, every county under commitment #3. Breadth (footprint / more parcels) is essentially DONE and was cheap. Bastrop alone: 62,257 parcels with a zoning-fact.

But depth is a rounding error. Same audit: Bexar has 703,258 zoning-facts and only 814 setbacks and 814 envelopes. The buildable ANSWER exists on ~0.1% of parcels, and the few that exist are the ones drawing jagged polygons. So 27c is NOT a second parcel pipeline and NOT a cold warm-up. It is the DEPTH engine for the breadth footprint that already exists: it consumes the populated ledger (61a) and fills it deep (road nodes + road-type setbacks + valid envelopes + warm verification), and it never re-bakes the zoning-fact layer.

Three consequences for this spec:
- The warm-up is depth-over-existing-breadth, not cold warming. The Bastrop warm-up deepens the 62,257 parcels that already have zoning-facts; it does not discover parcels.
- The ledger metric is the DEPTH RATIO — verified-envelope / zoning-fact — currently ~0.1% everywhere, driven toward full in Bastrop first, live-tallied in Command Center (G1 discipline). This is the honest measure of the engine's real output; breadth looked green while depth sat near zero.
- The geometry bug is the depth BLOCKER, not a display nuisance. Depth is ~0.1% partly because the derive produces garbage, so there was never any point running it at scale. You cannot warm-verify two million envelopes through a gate when the derive self-intersects. R0 (geometry truth) is the UNLOCK for depth at scale. The cost gate (WDLL 7) measures DEPTH cost per parcel specifically — breadth cost is already known-cheap.

## The keystone decision: the road becomes a first-class node, not negative space

Today the road is the gap between parcels — inferred, fetched per request in roads.ts, geometry-only, type-discarded. The keystone move (operator-decided 2026-07-25): promote the road to a first-class NODE in the spine ledger, with the same node/atom/reference discipline as a parcel. A road node carries a stable identity, a centerline, edges, a right-of-way, a classification (highway / major collector / minor collector / residential / alley / gravel / etc.), provenance on every field, and — critically — reference/attach points for atoms it does not yet have.

Three things fall out of the road being a drawn object rather than negative space:

Setbacks become drawable correctly. The buildable inset measures from the real, classified road edge (right-of-way line) with the correct road-type-indexed distance, not from a fuzzy parcel boundary by an untyped default.

The parcels get a hard geometric reference to snap against, and the aerial image can finally be calibrated to that skeleton. The reason the aerial/CAD/parcel layers never align is that there is no authoritative geometric frame for them to align TO. The road network, drawn accurately as ledger nodes, is that frame. Aerial calibration becomes a consequence of the road-object build, not a separate feature. (This is adjacent to 27a's G3 map-correctness guardrail: no layer silently reads a different field than it claims to show.)

The digital-twin foundation is laid (see below). This is the design constraint the vision earns now.

### v1 road-edge accuracy: centerline + assumed per-class ROW width (operator-decided)

v1 draws the road from the OSM centerline plus a road-class → assumed-ROW-width table in the descriptor (e.g. collector 60', local 50', alley 20'), and setbacks measure from that assumed edge. Honestly approximate where CAD/survey ROW is absent, buildable now, mostly right. The ROW-width table is itself a warm descriptor artifact; a later precision pass replaces assumed widths with true CAD/survey ROW per road WITHOUT changing the architecture, because whether an edge came from an assumption or a survey is a PROVENANCE field on the road node, not a different pipeline. Road-edge accuracy is a precision axis on one node type, not a fork.

An open honest seam recorded, not resolved: true ROW / road-width data is uneven across Central TX. OSM sometimes carries width tags; CAD carries it where ingested; TxDOT / county ROW layers exist unevenly. The assumed-ROW v1 is precisely the honest-approximate posture that lets the warm-up proceed without gating on data we do not uniformly have, while carrying provenance that says so.

## The warm-up policy: eager, all of Central TX, pre-market (Bastrop first)

Operator-decided 2026-07-25: eager warm-up, not lazy-per-parcel. Before any go-to-market, in any market, the supply engines run the descriptor across every parcel in the target region so the ledger opens FULL — the customer's execution agent READS a warm, verified answer, never triggers a cold re-derive. This is 27a's supply-engine program run to completion as policy ("County #500 is a descriptor a background agent runs"), with the warm/verify/promote loop made explicit:

The warm (write) path: a background agent goes to a parcel ahead of demand, draws its roads, classifies them, resolves road-type-aware setbacks from the descriptor, computes the buildable envelope, generates the site plan, and documents its reasoning. A SECOND agent verifies it MECHANICALLY (is the envelope a valid inset — contained, non-self-intersecting, correct offset; does the road classification match the source tag AND the jurisdiction road-hierarchy map; does the setback measure from the right edge with the right distance). Only on passing the mechanical gate does the result PROMOTE to durable ground truth on the node. This is 27a's per-engine GATE discipline run as a two-agent warm-then-verify loop, and it is exactly the promotion boundary from the AI-memory thread: cheap/lossy working memory (Tier 2) is separated from durable/provable memory (Tier 1) by a MECHANICAL gate, never a second agent re-asserting agreement (the scan-fix drift lesson).

The execution (read) path: the customer clicks a parcel; the execution agent pulls forward the warm agent's already-verified work — setbacks drawn, roads classified, site plan present — instantly and correctly. AI kicks in only for the INCREMENTAL ask (reporting, further design), not the base answer. This removes execution-time derivation for the base answer entirely, which is the mechanism that kills the jagged-polygon-every-time pathology at the root.

### Pilot and cost gate: Bastrop city + county, real cost measured before eager-everything

Bastrop city and county is the pilot (operator-decided 2026-07-25). Build the warm loop, run it on Bastrop end to end, MEASURE real compute + verify cost per parcel, and check it against structural commitment #3 ($200 compute + 1 hour human review per jurisdiction; hard-kill at three counties if not achievable). A real number beats an estimate: Bastrop either clears the bar and eager-everything for Central TX is greenlit, or it does not and the eager policy is re-scoped before spending on all of Central TX. Bastrop is also the correct pilot on-narrative — it is the design-partner (pioneer) relationship, so a public layer landing in Bastrop first is on-story, not a detour.

## The digital-twin foundation that falls out (the big vision — future, but earns one constraint now)

The moment a road is a node with a centerline, edges, a right-of-way, and a classification, this stops being a property tool and becomes the public geometric layer of a municipal digital twin. In the physical world the road IS the organizing spine: water mains run under roads, streetlights line them, traffic sensors sit on them, utilities/signage/transit/curb assets/storm drains are all geometrically indexed to the road network. The road node is the coordinate system a jurisdiction's entire physical-asset graph attaches to.

It is the same node/atom/reference substrate the spine already is: a streetlight is a node with atoms (wattage, install date, owner) referencing a road node; a water main references road nodes; a traffic count is an atom on a road node with temporal depth (the "what did we know in March vs now" query the memory thread named). A jurisdiction does not need a new platform to put its infrastructure on this — it needs a node kind and an accessPolicy. This is the 09 substrate thesis and the AI-memory-substrate thread generalized to a CITY, with a real first customer (Bastrop) who has a real reason to want it.

Sourcing guardrail (load-bearing, do not violate): Bastrop gets NO special data access and NO relationship-privileged path. The public digital-twin layer is built on the uniform public-record process — road network from public OSM / TxDOT / county data; infrastructure atoms are what a jurisdiction CHOOSES to publish onto the layer (them building on a public substrate), or tenant-isolated where private. "Jurisdictions put their infra on a public layer" is publishing onto a substrate, not us scraping a relationship. Kept clean, the digital-twin vision strengthens the pioneer narrative rather than compromising the sourcing posture.

What the vision earns NOW (the one design constraint, no added v1 scope): draw the road node so it CAN be a digital-twin foundation — a real spine node with stable identity, centerline, edges, classification, ROW, provenance, and reference/attach points for atoms it does not yet have (streetlight, water main, sensor — absent today, attachable tomorrow). If we build the road as a first-class node with reference-graph attach points, the digital-twin layer is "author new atom kinds later"; if we build it as a private helper for the setback math, we build it twice. Everything beyond the road node itself (streetlights, water, traffic) stays OUT of the Bastrop pilot.

## How this maps onto 27a (this deepens the ratified spec, it does not replace it)

INTAKE engine (27a #1): grows to ingest roads as first-class nodes with classification + ROW, not just "geometry, land-use, zoning layers." The road becomes a node kind alongside the parcel.

RULE engine (27a #2): setback rule becomes indexed by (road-class, edge-role), looked up from the descriptor's road-class setback table. Still jurisdiction-agnostic; the road-class → setback and road-class → assumed-ROW tables are descriptor (jurisdiction) knowledge.

REASONING engine (27a #3): the envelope derive is replaced/repaired to use a real polygon-offset (contained, non-self-intersecting, correct per-edge distance from the classified road edge), and declines honestly (approximate/pending) rather than drawing a confident wrong shape — anti-fabrication held.

TALLY + MONITOR (27a #5): the eager warm-up is a background agent reading the tally to know which parcels are not yet warm, running the warm-then-verify loop until the Bastrop (then Central-TX) ledger is full.

Guardrails: the geometry-correctness gate is a new mechanical check in the G1-G8 family (envelope is a provably valid inset or it is not drawn); it plugs into the F1c honest-badge / smoke-test machinery so envelope geometry cannot silently rot. The warm-verify gate is the promotion boundary, mechanical, verification never delegated.

## The three altitudes are one architecture (why this is coherent, not three programs)

Geometry calibration (handoff sense A) is a mechanical promotion gate for ONE answer type (the envelope): a computed answer is not "correct" until it clears a mechanical bar. Agent/fleet memory is that same gate for the fleet's WORKING knowledge: a lesson (per-edge miter self-intersects on concave rings — use a real offset) is not durable until it is promoted, and the geometry-correctness test suite IS that promoted memory in a form that cannot be silently violated. Confidence calibration (handoff sense B, the permit-outcome earning loop, 04a) is the ledger gaining temporal depth over time — the substrate doing the one thing it was built for. One idea, three faces: a mechanical gate separating cheap-and-can-be-wrong from promoted-and-provably-right, plus a durable store where verified lessons and predicted-vs-actual outcomes accumulate instead of dying at context roll. The warm ledger IS the memory; the descriptor tables ARE promoted durable facts; the verify agent IS the promotion gate.

## WDLL — WHAT DONE LOOKS LIKE

Frozen at operator approval. Every item graded PASS / PARTIAL(criteria) / FAIL against LIVE state, evidence pasted verbatim (never a report). Sprints are named but NOT time-estimated (tasks stack in dependency order).

The one done-line: an operator (in Command Center) and a customer (in property-explorer) open a Bastrop parcel and see a buildable envelope that is a provably-correct inset drawn from a classified, first-class road node using a road-type-aware setback resolved from the descriptor — with every road and every envelope warm-computed ahead of demand, mechanically verified before promotion, honest where data is approximate or absent, and the whole Bastrop ledger tallyable as full; and the road nodes are built as digital-twin-ready spine nodes (reference/attach points present) without any non-road infrastructure in scope.

Acceptance items (candidate — to be frozen on approval):

1. GEOMETRY CORRECTNESS. The envelope derive computes a valid inset (contained in the parcel ring, non-self-intersecting, correct per-edge offset distance) on rectangular, corner, and irregular/concave lots. Verified LIVE on 714 Spring St (48021:33512) plus a rectangular, a corner, and an irregular Bastrop lot. A real polygon-offset replaces the naive per-edge miter; the honesty guard declines (approximate/pending) rather than drawing a confident wrong shape. | grade: [ ]

2. GEOMETRY-CORRECTNESS GATE (calibration sense A). A mechanical test asserts the output ring is contained, non-self-intersecting, and offset by the correct distance, on concave/L-shape/corner/714-Spring fixtures that DO NOT exist today. It FAILS LOUDLY on bad geometry and is wired into the F1c smoke-test / honest-badge family so envelope geometry cannot silently regress. Demonstrate it going red on a known-bad ring. | grade: [ ]

3. ROAD AS FIRST-CLASS NODE. Roads are ingested as spine nodes with stable identity, centerline, edges, ROW, classification, and provenance, on the ONE spine substrate the ledger/map/PE read (no fork). A named Bastrop road node tallies in the Command Center ledger and inspects its atoms; the node carries reference/attach points for future infrastructure atoms (digital-twin-ready) with none in scope. | grade: [ ]

4. ROAD-TYPE-AWARE SETBACKS. The descriptor's setback table is indexed by (road-class, edge-role); the RULE engine resolves the setback from road class + edge role, jurisdiction-agnostic. Verified on Bastrop parcels where a street-frontage and an alley/rear produce DIFFERENT, correctly-cited setbacks. The v1 assumed-ROW-width table drives the edge origin, with provenance marking it approximate. | grade: [ ]

5. EDGE-LABELING ROBUSTNESS. On irregular rings the front edge is chosen correctly (not the globally-shortest survey-artifact edge); a clean polygon on the WRONG edge is caught. Verified on a corner and an irregular Bastrop lot. | grade: [ ]

6. THE WARM-THEN-VERIFY LOOP. A background agent warm-computes roads + road-type setbacks + envelope + site plan for Bastrop parcels ahead of demand; a SECOND agent verifies MECHANICALLY (geometry gate + classification-vs-source-and-hierarchy + right-edge/right-distance) and only passing results PROMOTE to the durable ledger. Verification is never a second agent re-asserting agreement. Demonstrate the gate rejecting a bad warm result. | grade: [ ]

7. BASTROP WARM + COST GATE. Bastrop city + county is warmed end to end; the ledger tallies FULL (roads + parcels + envelopes, honest gaps included) via a live SELECT. Real compute + verify cost per parcel is MEASURED and checked against commitment #3 ($200 + 1hr/jurisdiction); the number decides whether eager-Central-TX is greenlit or re-scoped. Cost pasted, not estimated. | grade: [ ]

8. READ-PATH IS WARM (no cold re-derive). A customer opening a warmed Bastrop parcel in property-explorer gets the envelope + roads + setbacks from the promoted ledger, NOT a live re-computation; the execution path reads durable memory. Prove no cold derive fires on a warm parcel. | grade: [ ]

9. AERIAL CALIBRATION (consequence check). The aerial/parcel/road layers align to the drawn road+parcel skeleton on a named Bastrop parcel (the misalignment that motivated the road-object build is measurably reduced). May be PARTIAL for v1 if gated on ROW precision; record honestly. | grade: [ ]

Negative done-line (NOT done if ANY is true):
- the envelope draws a confident wrong shape (jagged, self-intersecting, or on the wrong edge) presented as certain;
- the geometry-correctness gate is absent or does not fail loudly on a known-bad ring;
- the road is a private geometry helper for the setback math rather than a first-class spine node (built to be rebuilt);
- setbacks are applied without road-type awareness (a flat table, an untyped default);
- the warm-verify gate is a second agent re-asserting agreement rather than a mechanical check;
- a warm parcel triggers a cold re-derive on customer read;
- the Bastrop cost number is estimated rather than measured, or the hard-kill bar is crossed unrecorded;
- Bastrop is granted any special/relationship-privileged data path (sourcing posture violated);
- a second map / ledger / node-model / read-path is forked for roads.

## Sprint shape (candidate — to be sequenced into the multi-sprint program on approval)

Named, dependency-ordered, not time-estimated. Fewer agents, tighter contracts, harder gates; verification never delegated; every dispatch cites the WDLL item or the guardrail it satisfies.

Sprint R0 — geometry truth. Add a real polygon-offset (library selection: jsts bufferOp / martinez / polygon-clipping — decided at build start against the LDT dependency tree and the esbuild-conditions constraint), replace the naive miter, build the geometry-correctness gate + concave/corner/714-Spring fixtures, verify live on the four lot shapes. Satisfies WDLL 1, 2, 5. This is the smallest self-contained correctness win and it un-jags 714 Spring.

Sprint R1 — the road node. Promote roads to first-class spine nodes (identity, centerline, edges, ROW, classification, provenance, attach points), ingested by the INTAKE engine onto the one substrate, tallying in the CC ledger. Digital-twin-ready, no non-road infra. Satisfies WDLL 3.

Sprint R2 — road-type-aware setbacks. Descriptor setback table indexed by (road-class, edge-role) + assumed-ROW-width table; RULE engine resolves from road class; verify street-vs-alley divergence on Bastrop. Depends on R1. Satisfies WDLL 4.

Sprint R3 — the warm-then-verify loop. Background warm agent + mechanical verify agent + promotion gate over the R0-R2 pipeline. Depends on R0-R2. Satisfies WDLL 6, 8.

Sprint R4 — Bastrop warm + cost gate. Run the loop across Bastrop city + county end to end; measure real per-parcel cost; tally the full ledger; decide eager-Central-TX. Depends on R3. Satisfies WDLL 7, and 9 as a consequence check.

## Build discipline (inherited from 27a, do not rebuild the drift one level up)

Verify against LIVE state, never a report — every grade is a live query or live probe, pasted. Watch the Cloud Run traffic-trap on any cortex/engine redeploy (check the serving revision; the export-gate agent hit the source-deploy-onto-wrong-service trap this same day and cleared it — rebuild via the service's own cloudbuild yaml, canary, shift). Do not re-transcribe setback VALUES (human-verified, correct). Do not re-open F1 (done, 27b). Anti-fabrication holds: an envelope or a road we cannot compute/classify correctly declines honestly, never draws a confident wrong shape. Fewer agents, tighter contracts, harder gates.

## Amendments

- 2026-07-26 FIX 2.1 (operator-approved): WDLL 5 edge-labeling deepened — front labeling must be correct-by-rule (local street over collector among eligible roads; must not depend on footway shadowing `bestByEdge`). M0 durable promotion: FRONT-LABELING FIXTURE GATE (vitest), peer to R0 geometry gate, covering 48021:34785 collector-vs-local, R4.1 footway, R4.3 gravel, and remove-footway invariance. Load-time `isFrontEligibleRoad` batch filter removal is subordinate and ships only with that rule. Place-type residual re-promote + one-path ceiling reclassify; engine-api deploy for FIX 1.1 site-plan HTTP. Central-TX held until gate green + ceiling known. Card: `_inbox/2026-07-26_FIX2_1_front_labeling_WDLL.md`. Dispatch: `_dispatches/2026-07-26_FIX2_1_front_label_road_load.md`.

## Next step

R0–R4.4 have run; depth at place-type 2345/3657 (64.12%). Execute FIX 2.1 against the approved sub-WDLL above before any Central-TX fan-out.
