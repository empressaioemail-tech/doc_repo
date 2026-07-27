---
id: 2026-07-26_MIDSESSION_capture_depth_engine_vision_and_waves
title: MID-SESSION capture — depth-engine build, the connecting-tissue vision, the county-onboarding machine, and everything decided before the next wave
date: 2026-07-26
type: session_capture (mid-session, not a close — build in flight)
agent: claude_code (planner)
owner: nick
status: capture
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_depth_engine_roadmap_and_action_items, 2026-07-26_bastrop_depth_reconciliation_finding, 90_runbooks/fleet_memory_practice, 2026-07-23_ai_memory_substrate_thread_PLACEHOLDER]
---

# MID-SESSION capture

Not a close — the build is in flight (FIX 2.1 running; commits held until the in-flight agents verify). This preserves the full context of a long, high-decision session so nothing is lost before the next series of waves. A lot was decided both near-term and at the vision level. Read the linked docs for the authoritative versions; this is the index + the through-line + the decisions that would otherwise only live in chat.

## The arc of the session (how we got here)

Started from two threads — the AI-memory-substrate placeholder (2026-07-23) and the unresolved setback-geometry bug from the F1 close (714 Spring St jagged polygon). A read-only code diagnosis found the geometry bug was a POOR-MEMORY-ARCHITECTURE failure, not hard math: an agent re-derived geometry in a dead context window, knew enough to reject one naive path and not the second, left no durable memory. That single finding converged three things into one architecture and triggered the whole build:
- calibration (a mechanical gate for one answer type),
- agent memory (a mechanical gate for the fleet's build knowledge),
- the warm ledger (a mechanical gate for parcel knowledge),
- confidence calibration (the ledger gaining temporal depth).
One idea, four faces: separate cheap-can-be-wrong from promoted-provably-right by a mechanical, planner-gated promotion; strongest durable form is a TEST, not prose.

The operator escalated: roads have types, setbacks depend on road type, the road should be a first-class node (which also gives the aerial a skeleton to calibrate to and lays a digital-twin foundation). This morphed into the engine build. Then the strategic layer opened: the fidelity + marketplace tracks, the connecting-tissue vision, and the county-onboarding machine.

## COMMITTED this session (durable, on origin/main)

- `7000cda` — 27 MASTER WDLL + 27c depth engine + M0 fleet memory installed (runbook + .cursor rule + _scratch convention).
- `2db88dc` — session close 2026-07-25 (master/27c approved, R0 launched, parity-ledger line).
- `5980ef5` — the base-layer/connecting-tissue decision record + the roadmap/action-items doc.

## DRAFTED, HELD (uncommitted until in-flight agents verify — operator directive)

- `27d_county_onboarding_recipe_and_fleet_reliability.md` — the reliability machine (below).
- `27c` — status-line touch (front-labeling-gate active).
- `00_current_state.md` — foreign-entangled with the export-gate agent's uncommitted close; not the planner's to sweep. Prepend owed once that lands.

## THE VISION (authoritative in the connecting-tissue decision record; here for continuity)

We are building the next-generation public property-data layer: the canonical, provenance-carrying, machine-addressable base layer of physical-world property truth — the connecting tissue that permits, twins, title, minerals, RE tokenization, and on-chain records all reference and interoperate through. Every vertical is stranded on the same missing primitive: a canonical machine-addressable identity for the physical thing. The node id is the primary key the ecosystem is missing. We can be it because connecting tissue must be trustworthy-without-a-trusted-party (provenance/confidence/source/timestamp on every atom) — the substrate is already oracle-shaped, and CID content-addressing is the on-chain bridge. North star: government-backed as THE authoritative source. Discipline clause (load-bearing): you become the connecting tissue by being so obviously the canonical base that everyone references your node id — coverage + trustworthiness makes you canonical. The vision VALIDATES the near-term work, does not redirect it. Same work, bigger why.

## THE TWO STRATEGIC TRACKS (one flywheel)

FIDELITY / precision: per-domain engines behind breadth/depth, upgrading the same atom up the confidence ladder. Version ladders defined (road edges v1 OSM+assumed -> v2 true ROW -> v3 road topo; terrain v1 3DEP -> v2 LiDAR -> v3 survey; parcel v1 GIS -> v2 plat -> v3 survey). Sourcing: un-ingested public high-fidelity data -> ML-refined precision -> recorded-survey DOCUMENT parsing (the build-to goal: a better base than a surveyor starts from; sell to surveyors + to the public in the app form we ship) -> net-new capture ONLY via marketplace write-back, never our own drones.

MARKETPLACE: SDK/MCP/export (IFC-with-frontage-and-topo is the first piece, the seam between our base and a private twin). The WRITE-BACK CONTRACT is the net-new linchpin — the difference between a data vendor (one-way) and a compounding substrate (fidelity flows back, every twin makes the base better). Twins anchor to our node ids + CIDs, so higher-fidelity data arrives already keyed to our ledger; writes back as higher-confidence atoms on existing nodes under sovereignty controls; payment substrate (ADR-018) incentivizes it. The marketplace IS the sourcing strategy for fidelity — one flywheel.

SURVEYOR finding: no public base data they have that we are locked out of. They have (1) recorded-survey documents (public, a parsing problem, on-thesis) and (2) field measurement + adjudication (irreducible, the write-back). We do not compete on base data; we receive field truth via write-back and can sell surveyors a better starting base.

## THE COUNTY-ONBOARDING MACHINE (27d — the near-term "how we scale")

Operator: build engines the operator runs from CC that take a brand-new county fully online (verified, scrubbed, accurate, market-ready at v2 target), in waves like now but WITHOUT the decision-making. "Start county X" and the mechanics + agent rules + memory execute it reliably, multiple counties at once.

Core insight: the intelligence is in the ENGINES + agent-structure + memory, NOT a dashboard. "Start county X" is honest only when every per-county DECISION is a mechanical GATE that fails closed. Bastrop is where decisions get baked. The console stays THIN (launch + watch); the machine is DEEP (gated + memory-warm). UI thinness is a consequence of reliability, not a compromise — explicitly NOT a cockpit rabbit hole.

Sequencing ruling: the button is LAST. Bake Bastrop's decisions into gates -> harden M0-reach -> prove the recipe on counties #2-3 (golden-descriptor path) -> THEN the thin launch surface. A button over a machine that still needs per-county decisions is a lie.

The recipe: a fixed 8-gate dispatch (descriptor -> intake -> road/front-labeling -> rule -> reasoning -> warm/verify/promote -> tally/cost -> smoke). Agents start warm from M0 + the fixed recipe, never re-taught. The baked decisions are GATES the agent cannot violate, not notes it must remember — that is what makes "warm" safe.

Execution split (operator-decided): fleet executes in Cursor (or Claude subagents); the launch+watch dashboard lives in CC; reliability in the gates+memory not the UI; UI/QA effort to CUSTOMER-FACING (site plan, road render), not the operator console.

## ARCHITECTURE RULINGS (authoritative in the connecting-tissue record; indexed here)

- ONE OWNER PER SHARED SUBSTRATE. Parallelize executors (county axis) + independent streams (UI, CC); NOT multiple planning agents jiving on the same write-path (re-creates G4 one level up). Proven by the recon (one mind reconciled three conflicting depth numbers) and by the site-plan-vs-depth-warm bug (two code paths, same job, drifted).
- PLURAL STORES, SINGULAR TRUTH. No more coordinating databases. Scale the one substrate via partitioning + read-replicas + tiling. Specialized stores only by physical necessity (spatial, tiles, blobs). One ledger on top owns "what exists"; stores own bytes.
- IPFS IS THE CONTENT LAYER, NOT THE LEDGER. Content-addressed store under the atom CID (blobs/geometry/docs/exports) — dedup + tamper-evidence + the on-chain bridge. Does NOT replace the queryable ledger (IPFS cannot SELECT/aggregate). GCS->IPFS is an independent later migration.

## CURRENT BUILD STATE (as of this capture, before FIX 2.1 returns)

R0-R4.4 landed (geometry library, ~4894 road nodes, road-class setbacks, warm->verify->promote, place-type cohort). Bastrop honest depth: 2345 / 3657 place-type = 64.12%. Central-TX HELD.

The three recon fixes:
- FIX 1/1.1 (site-plan offset parity): site-plan inset now matches depth-warm on 34785 (~13641 sqft), engine #134 merged. HTTP site-plan needs an engine-api DEPLOY to pick it up (merged, not yet live).
- FIX 3 (CC live-auth): CC shows live depth columns (depth_warm_promoted, depth_ratio_place_type); the 9.27% was stale zoning-breadth artifact.
- FIX 2 -> 2.1 (residual promote): FIX 2 got 0 new promotes; root cause was front-labeling under a load-filtered road set (collector steals front; 34785 was passing correct-BY-ACCIDENT via footway shadowing). FIX 2.1 APPROVED with amendment: front labeling must be correct-BY-RULE (footway ineligible; local-street-preferred-over-collector; not accident-dependent), promoted to a FRONT-LABELING FIXTURE GATE (the class-guard — bitten 3x: R4.1 footway, R4.3 gravel, FIX2 collector). Running now.

## ADVERSARIAL-REVIEW + MEMORY findings this session (the planner's standing job)

- The recon self-corrected honestly (found its own "395 would-promote" was measured on a non-production road path). Good — the drift-catch working.
- The front-labeling class has bitten 3x and kept being patched as PROSE instead of promoted to a class-GUARD. Named as the M0 leak: capture worked, promotion-to-guard did not. FIX 2.1's fixture gate is the correction. This is the live test of whether M0 promotes to mechanical guards or stays prose.
- 1009 Chestnut (34785) "correct by accident" (footway shadows the collector) is the worst thing to scale — front-labeling is about to be multiplied across every county. The front-labeling gate is a FAN-OUT PRECONDITION, not just a Bastrop fix. Standing rule: no county warms until the front-labeling gate is green.

## ROADMAP FLAGS captured (not urgent, do not lose)

- Render road centerline + edges on the site plan/map — HIGH in the customer-UI stream, NOT polish (missing deliverable element + moat feature; the road exists in the ledger, the PDF currently draws an empty STREET box).
- Site-plan DESIGN pass (current PDF honest but crude).
- Aerial calibration — no rush (operator); gated on road-edge v2 precision; needs its own diagnostic-then-fix (the road build did NOT deliver it free).
- Datum/projection alignment — a separate smaller calibration lever.
- The AI-memory-substrate thread + digital-twin infra layer — after the property depth engine proves out.

## THE THREE FRESH-SESSION STREAMS (gated on the fixes clarifying the ceiling)

- STREAM A — CTX county fan-out (one owner, executors per county). Needs: fixes landed, ceiling understood, M0-reach hardened, front-labeling gate green. Then national = same fan-out, gated on the non-TX golden-descriptor test.
- STREAM B — customer-UI quality (independent, launchable now): road render, site-plan design, map/PDF vocabulary reconciliation.
- STREAM C — Command Center (THIN, and AFTER the recipe is proven on counties #2-3): the launch+watch surface + wire Engines stubs + fix DEGRADED panels + swap the map. NOT a rich cockpit.

## UPDATE — continuation after FIX 2.1 (this is where the thread now stands)

FIX 2.1 landed and verified: correct-by-RULE front labeling (local > collector; not footway-shadow) + a durable FRONT-LABELING FIXTURE GATE (the class-guard, bitten 3x, finally promoted to a test with a remove-footway invariance case). Depth climbed 64.12% -> 74.16% (2712/3657). M0 passed its test this wave — the lesson promoted to a GUARD, not prose.

THE 832 RESIDUAL VERDICT (2026-07-26): FIX-FIRST, do not greenlight Central-TX. 74.16% is NOT the honest ceiling. All 832 geometry-empty classified (not sampled): 371 honest-irregular (44.6%), 461 SHOULD-DRAW near-rects (55.4%). Specimen 48021:28286 (rect 0.999) proved the class. Est recovery ~461 -> ~86.8% place-type.

MEMORY finding: the R0 geometry gate PROMOTED the lesson but its FIXTURE SET had a hole — tested concave/corner/714-Spring, never near-rect-front-on-each-edge. A promoted guard is only as good as its fixture coverage. This is the M0-refinement lesson: promotion isn't binary test-vs-prose; there's a third failure — a test that doesn't cover the whole class.

THE OPERATOR REFRAME (the big one): the recurring geometry-bug class (714 Spring miter, 1009 Chestnut, 28286, FIX 2.1 wrong-front) is NOT a formula problem — it's a MISSING BOUNDARY PRIMITIVE. The code re-derives inside/inward + role per-edge from a road-proximity PROXY. The fix is the property line as a FIRST-CLASS NODE that knows what it IS, what it FACES (adjacency: ROW / neighbor-parcel / alley / unmapped), its rule, provenance, and effective period. Decision record: `_decisions/2026-07-26_temporal_boundary_primitive_and_living_layer.md`.

DECIDED (operator 2026-07-26): build the boundary primitive TEMPORAL-and-ADJACENCY-aware NOW (the atom contract already carries effectiveDate/retiredAt/supersedes/status — verified in code). Static-now = rebuild-later; temporal-now makes zoning-change/annexation/easement "author a sensing engine + supersede," not a rearchitecture. The living-layer event surface (v2): zoning change, annexation, easement, PLUS ownership change, permit history, lot-line move, subdivision (the hardest — changes node identity, so parcel + boundary node ids must be supersede-capable from day one). All fold into the FIDELITY TRACK (freshness axis; precision AND currency are the two axes of fidelity). The sensing engines are v2 design-now/build-later; the primitive's attach-points are built now.

GUARD-vs-INTERIOR DIAGNOSTIC (2026-07-26): 28286 is a GUARD BUG -> PATCH-THEN-BUILD. insetRingMeters produces the CORRECT ~7316 sqft interior on the bad edge; isInsetDegenerate rejects only on ringHasSelfTouch (a zero-width clip-artifact spike). Inward normals correct; not an interior/orientation bug. So the 461 are unblocked by a contained PATCH (clean the clip artifact), NOT by waiting on the primitive. Question B confirmed: the boundary primitive is BUILDABLE NOW from live data (parcel-parcel adjacency via jsonb+bbox, no PostGIS needed; parcel-road via road-nodes; unmapped honest; interior computable per ring, just not stored yet). Finding: `_inbox/2026-07-26_guard_vs_interior_and_boundary_primitive.md`.

PATCH-A dispatched (guard fix): CLEAN THE GEOMETRY (drop the zero-width spike before the guard), do NOT weaken ringHasSelfTouch (weakening a degeneracy guard = the original R0 honesty gap). Widen the geometry gate with POSITIVE-SPACE fixtures (assert good near-rects PASS on every edge, not just that bad shapes fail) + keep a genuine-self-touch negative fixture. Re-promote -> true ceiling. Running.

THE BASTROP-THROUGH-V2 DECISION (operator 2026-07-26): drive Bastrop all the way through v2 as the reference county / the mold for the country. Sequenced as a STACK (operator approved), not one push: PATCH-A (true depth ceiling) -> the BOUNDARY PRIMITIVE (the keystone; easements + adjacency-correct labeling + living-layer all consume it) -> a BASTROP MARKET-READY checkpoint (v1.5: correct envelopes, boundary-aware, road-rendered, honest gaps — the sellable/showable/recipe-provable state) -> the v2 FIDELITY/EASEMENT/LIVING-LAYER deepening. Road render runs in parallel (Track B). Discipline: a v2-SOURCING RECON before the fidelity build (recorded-doc/true-ROW/easement data — the least-proven part; ground it like we grounded depth). Do NOT let "through v2" mean "nothing ships until v2" — Bastrop reaches market-ready first, proves the recipe on counties #2-3 from that state, then v2 deepens Bastrop AND scales across counties as one fidelity program. Full program doc: `27f`.

## IMMEDIATE NEXT (when FIX 2.1 returns)

1. Planner adversarially reviews FIX 2.1 against live state (front-labeling gate green? correct-by-rule not accident? removing footway doesn't change 34785's front?).
2. Memory-mine: did the front-labeling lesson promote to a GUARD (the M0 verdict)?
3. Then reclassify the residual under one road path -> the TRUE Bastrop ceiling.
4. Deploy hauska-engine-api so site-plan HTTP picks up FIX 1.1.
5. Then: harden M0-reach + author counties #2-3 descriptors + prove the recipe (the real "start county X" test).
6. Commit the held docs (27d, 27c touch, this capture, the current_state prepend) once the in-flight agents verify.
