---
id: OPS-14_texas_flush_game_plan
title: OPS-14 — The Texas flush game plan (launch gate, workstreams, factories, dispatch model)
date: 2026-08-09
last_updated: 2026-08-09
status: active
owner: nick
adversarial_review: passed-with-fixes 2026-08-09 (v1 REFUTED as NOT-READY; this v2 incorporates all BLOCKER and MAJOR fixes)
related: [_decisions/2026-08-09_texas_flush_launch_gate, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, 90_operations/OPS-11_invariant_register, 90_operations/OPS-12_instrument_inventory, 90_operations/OPS-13_store_topology, 76j_smartsite_launch_readiness_program, 90_runbooks/factory_onboarding_runbook, _inbox/2026-08-09_48h_audit_and_cleanup_verification]
---

# OPS-14 — The Texas flush game plan

Source of truth for the program between the 2026-08-09 launch-gate ruling and Texas launch. It states the gate, the workstreams, the factory structure, the parallelism rules, and the dispatch model. Counts and PR states in this doc are advisory snapshots: re-verify against `gh`, SQL, and live endpoints at dispatch time, every time. Where this doc and a live store disagree, the store wins.

## THE GATE (settled, do not relitigate here)

Per `_decisions/2026-08-09_texas_flush_launch_gate.md`: launch gates on MEASURED-EVERYWHERE with the per-rail split. Statewide-uniform rails reach satisfied everywhere (data or honest absence, no `not-yet` left). Jurisdiction-depth rails gate on writer-live plus honestly displayed `not-yet`, with satisfied required in the launch-footprint counties. FILLED-EVERYWHERE is program completion and runs as the permanent post-launch engine. The gate is read from two instruments, never asserted: the county ledger endpoint and the OPS-11 invariant register.

## RAIL CLASSIFICATION

Rail names follow the authoritative `county_rail` dimension (OPS-13). The decision record explicitly classified six uniform and four depth rails; the owner and easement assignments below are this doc's proposed extension, flagged for operator ratification (open decision 4).

| Rail (county_rail name) | Class | Gate reading |
|---|---|---|
| C Parcel geometry | statewide-uniform | satisfied everywhere |
| Roads / frontage | statewide-uniform | satisfied everywhere |
| D Flood / terrain (carries NFHL, topo, and terrain work; SSURGO joins here or gets its own row by ruling) | statewide-uniform | satisfied everywhere |
| Building footprints | statewide-uniform (ML-derived default per ADR-029) | satisfied everywhere |
| RRC wells / pipelines | statewide-uniform | satisfied everywhere |
| MUD / special districts | statewide-uniform | satisfied everywhere |
| B CAD attributes | jurisdiction-depth | writer-live; satisfied in launch footprint |
| Owner facet | jurisdiction-depth PROPOSED (derives from CAD) | writer-live; satisfied in launch footprint |
| A Zoning + setback | jurisdiction-depth | writer-live; satisfied in launch footprint |
| Buildable envelope | jurisdiction-depth (derives from zoning) | writer-live; satisfied in launch footprint |
| Land use | jurisdiction-depth (derives from CAD join) | writer-live; satisfied in launch footprint |
| Utility easements | jurisdiction-depth PROPOSED, honest-absence-heavy | writer-live; satisfied in launch footprint, where satisfied is mostly provenanced absence |

## THE WORKSTREAMS

**W1 writers program.** The launch-critical engineering. Two halves: RUN the three existing writers statewide (cad-parcel-roll, land-use-fact, flood-hazard-fact; engine #291 merged; in-session code review 2026-08-09 confirmed real pipelines with write-then-verify on stored bytes, per `_inbox/2026-08-09_48h_audit_and_cleanup_verification.md`; statewide execution remains unexercised, so this is code-done, not customer-done), and BUILD the missing writers (roads/frontage, footprints, easements, owner, RRC, MUD). Build order follows data availability and product value and lives in the writers WDLL. Acceptance for every writer: a full write, read, serve probe across the factory joint on real counties, the honest-absence path exercised, and closure evidence from an instrument independent of the writer's own lane (INV-5), never just green CI. **Access policy at mint (INV-20 / ADR-017):** every new family names its accessPolicy in the writers WDLL before the first statewide write; owner-facet data especially must carry an explicit policy ruling, since it puts owner names behind product surfaces at scale.

**W2 fabric completion.** L2's remaining counties (pending the coastal-extent report and Donley decision from cleanup lane C). Roads statewide: SIX unblockers before any statewide run: the five from `_inbox/2026-08-09_STATEWIDE_ROADS_adversarial_review.md` (two-county TIGER boundary proof with pre-registered both-sides assertion; collinear epsilon scaled to coordinate magnitude; working RSS measurement; one honest apply against a throwaway county; retire-or-supersede contract protecting live Bastrop road rows) plus the synthetic-id collision resolution the same review left open (roughly 1.5M real OSM ids statewide sit inside the reserved synthetic bands; the id scheme must partition before any statewide apply). RRC and MUD statewide acquisitions, each starting from a verified source-registry row (do not assert endpoints from memory). Topo statewide decision (the existing pipeline is AOI-scoped and would silently produce a Central Texas mosaic). SSURGO source hunt.

**W3 integrity and cert re-earn.** Cert-frame reconciliation (cleanup lane B2), then re-earning certs in the true frame. Wire the county-extent instrument (cleanup C2 is the prototype) as a per-vintage gate; it is OPS-12's highest-priority missing instrument, and in this plan it is a DEPENDENCY of the L2 finish waves and of every statewide-uniform re-ingest, not a parallel nicety. Work the OPS-11 enforcement table (the full PARTIAL and UNENFORCED set, roughly fifteen entries, not the nine the closing paragraph undercounts), hook-shaped enforcement preferred on the measured 1-for-1 vs 0-for-3 base rate.

**W4 launch readiness.** Tracked in `76j_smartsite_launch_readiness_program.md`; not duplicated here. Domain attach, billing-surface audit (Hauska Pro branding defect), promo E2E, anonymous-claim flow, load test, MCP revival recon, affiliate program.

**W5 depth factories.** A standing multi-factory program, divided and conquered, designed to run without operator attention and to outlive Texas. Detail below.

## THE FACTORY STRUCTURE

Two factory classes, one program shape. The shape is the wave machinery from the L2 waves: membership manifest, fail-closed gates, dry/apply parity, decline-with-identity, idempotency proof, adversarial review, ledger row. Honesty note the plan stands on: that machinery acquired 177 counties in two days, AND its count-based gates could not see the Harris truncation class (one county reloaded; eight coastal holds open; seven counties had idempotency passes consumed by the deadlock resume). The shape is proven for throughput, not for completeness; completeness comes from the different-frame instruments W3 wires in. Per INV-22 the shape runs frozen; a parallel build of any part is a deviation requiring operator approval.

**Wave failure contract (added after the Wave 3 lessons, applies to every factory):** run logs are append-only and a resume never overwrites the original apply artifacts; status files are validated for integrity (a truncated status reading OK over an orphaned failure is itself a defect); any resumed wave owes a fresh idempotency apply2, because a resume consumes the original one.

**Vintage and supersede contract (generalizing the roads lesson):** no re-ingest of any layer without a versioned retire-or-supersede path for the rows it replaces. The archive-manifest check (multi-file detection) and the county-extent check run per vintage, wired, not as one-shot audit artifacts.

**Cost (structural commitment 3, currently UNENFORCED per OPS-11):** every factory wave carries a cost checkpoint in its brief, metered per jurisdiction; ldt #393's observability and cost-metering tables are the mechanism and their landing is a named dependency of standing-factory operation. The commitment's measurement re-bases onto depth work per the launch-gate decision.

**Statewide-uniform factory.** One acquisition per layer per vintage: parcels, roads, footprints, topo, SSURGO, RRC, MUD (NFHL loaded 2026-08-09). Re-runs on new vintages under the supersede contract. Owner: fabric planner seat.

**Depth factories.**

| Factory | Writes to (database) | Feeds rails | Engine | Readiness |
|---|---|---|---|---|
| F1 CAD rolls | `cad_property` (neondb) | CAD attributes, owner, land use | ldt CAD ingest lane | Needs statewide CAD source-registry rows beyond the CAPCOG seed set |
| F2 code/zoning corpus | corpus store + zoning stamps (stamps land in neondb) | zoning, envelope downstream | eCode360 scraper (proven on Smithville), muni-site-scraper, citizen-portal path per the 2026-08-04 scrape ruling | Scraper branch `feat/ecode360-scraper-header-first` is an uncommitted local branch; commit and push it before calling this restartable |
| F3 depth warm | `atoms` (hauska_mcp) | envelope | unified city-batch runner (engine #287, MERGED 2026-08-09T18:09Z) + registry `warmRunner` | Unblocked; Elgin is the first proof city and still owes parcel-node anchors plus a unified dry-run before apply |

F1 and F2 are acquisition and run in parallel; F3 consumes both.

**The joint.** Data moves between factories only through contract-shaped atoms (`@empressaio/atom-contract`, 1.15.0 at writing) and the OPS-13 propagation legs. No factory reads another factory's internal tables except through a registered writer or scorer. Joint status: contract published, engine registration merged (#286), writers merged (#291), parcel-node atoms flowing in production (run the OPS-13 query for the count; do not quote one). Open consumption gaps: manifest refresh wiring (cleanup A4/A5) and MCP slots (76j Workstream F).

## CONCURRENCY DOCTRINE (corrected after adversarial review)

Contention is keyed by DATABASE and ENDPOINT, not by table. All factory stores share one Neon endpoint (OPS-13); table-disjointness is not IO-disjointness, and the 40P01 incident proved key-disjointness is not index-disjointness either.

1. **One bulk-writer at a time per database.** The atoms store (`hauska_mcp`) currently has three candidate bulk lanes: the parcel-node sweep (running), W1 writers RUN, and F3 warm applies. They serialize explicitly; the active lane is named in `_STATE.md` and the next lane starts only after the prior lane's close artifact exists. The neondb bulk lanes (L2 waves, F1 CAD ingest, NFHL-class loads, zoning stamp rolls, scorer applies) likewise serialize per the slot rule below.
2. **The heavy-scan slot contradiction is real and needs the operator ruling the layer-first decision demanded.** Recorded there as unresolved; this plan proposes the ruling as open decision 5 (one write slot per database, reads unrestricted, slot handoff via `_STATE.md`) and runs conservatively (serialized bulk writes per database) until ruled.
3. Within any single table, concurrency 1 to 2, measured on `txgio_parcel` and adopted conservatively store-wide.
4. Bulk writes use the direct host, never `-pooler`; every write lane fingerprints its host before writing.

## THE STATE TEMPLATE (Texas is one of fifty)

The transferable asset is the layer taxonomy and the program shape, never the adapters. Standing up state two must cost exactly: a state source registry (which agency serves parcels, roads, flood, CAD equivalents, code hosting patterns) plus per-state adapters conforming to existing adapter contracts. Everything else ships unchanged. Design rule with teeth: no state constant may live in factory machinery; state specifics live in registry rows and adapter modules only. Any PR hardcoding a Texas fact into shared machinery is a template violation, flagged in review. The W5 WDLL carries the template worksheet.

## ATTENTION-FREE OPERATION (honest status and the mechanics)

Honest status: half built. Hook-shaped controls measure 1-for-1 (canon gate); protocol-shaped measure 0-for-3, and the silent-return pattern plus the planner-becomes-reporting-layer failure are both protocol-shaped problems that duties alone will not fix.

Mechanics, with the hooks as PRECONDITIONS rather than candidates:

1. **Precondition hooks, built before the first W1/W5 brief is cut:** (a) a doc_repo dirty-tree gate blocking session-close pushes that strand `_STATE.md` edits; (b) a dispatch-template check rejecting briefs missing the preamble, the no-nesting first line, exit-bounded verification, or the close-artifact clause.
2. Every lane produces a MACHINE-CHECKABLE close artifact (a ledger row or a file at a declared path) that a hook can grep; narration is not closure.
3. **Lane cap:** the doc_repo planner verifies at most as many concurrent lanes as it can check at source on a stated cadence; the working cap is five, revisited on evidence. Verification cadence is written into each brief.
4. Cursor planner seats that fan subs HOLD until every sub closes; a coordinator that fans and returns is the recorded orphan trap, one level deeper.
5. Progress is read from the ledger and stores, not narration. If the Command Center per-rail view cannot show it, the work is not visible, and that is a defect in the work.
6. Counts live behind runnable queries, never in prose.

## PARALLELISM MAP (advisory; re-verify PR states and store activity at dispatch time)

| Lane | Depends on | Serializes with (database) |
|---|---|---|
| Writers RUN (3 existing, statewide) | cleanup A4/A5; parcel-node sweep CLOSED with artifact | atoms bulk slot (hauska_mcp) |
| Writers BUILD: footprints, easements, owner, RRC, MUD | nothing (build stage) | none until run stage |
| Roads writer BUILD | roads statewide ingest landed (W2) | none until run stage |
| Roads unblock (6 items) | nothing | engine seats with cert-frame lane |
| Cert-frame re-earn | cleanup B2 | engine seats |
| F2 corpus restart (Smithville first) | scraper branch committed and pushed | zoning stamp applies join the neondb slot |
| F1 CAD registry sweep, then ingest waves | registry rows | neondb bulk slot |
| L2 finish waves | C2 coastal report; C4 Donley decision; county-extent check wired (W3) | neondb bulk slot; serialize with Bosque re-run |
| RRC + MUD acquisition | verified source-registry rows | own tables, neondb bulk slot at apply |
| W4 lanes (domain, billing audit, MCP recon, load test) | operator items in hand | product repos, no store contention |
| Doc cleanup lane | nothing | doc_repo only, planner-owned |

## DOC CLEANUP LANE (the meantime work)

1. Ratify `_STATE.md` as the successor snapshot and amend CLAUDE.md's session protocol accordingly, or regenerate `00_current_state.md` (stale since 2026-08-04). Recommendation: ratify `_STATE.md`.
2. Move CLAUDE.md's dated point-in-time status paragraphs to a historical record; CLAUDE.md keeps rules and pointers only.
3. Add the missing correction block to `90_operations/PHASE_C_HANDOFF_bastrop_warm.md:35` (last uncorrected BCAD frame instance, per OPS-12).
4. Retire OPS-3 leak-1 (content-hash timestamps; fixed in source per OPS-11 conflict one) at next OPS-3 edit.
5. Put the memory store (90 files, unversioned) under git.
6. Narrow the Smart Site white paper section 4 forward reference (OPS-11 conflict three) before any diligence use.

## DISPATCH MODEL

Same manner as the cleanup batch: copy-paste planner briefs, hand-carried by the operator to Cursor-native planner agents, one brief per lane family, subs one level down with the no-nesting clause and the hold-until-subs-close rule, close artifacts at declared paths, and the doc_repo planner verifying at source before anything is marked done. The doc_repo planner plans, reviews, verifies, and merges; it does not execute product-repo changes itself.

**Adversarial review is baked into the process, not appended at close (operator directive 2026-08-09).** Every brief defines checkpoints where an INDEPENDENT adversarial sub (never the builder) attacks the work before the lane proceeds: post-build before any apply, and post-apply before the lane closes. Reviews carry pre-registered expectations (what the reviewer will check, written before the work runs) and attack from a different frame than the builder's own tests, per the OPS-12 standing rule that four readings of one input are one reading. A lane without its reviewer artifacts is not closed. The model is the cert-frame lane B2, whose in-process honesty rule (report 6/7, do not tune to 7/7) is the required posture.

## OPERATOR DECISIONS (all five RESOLVED 2026-08-09 evening)

1. **Launch footprint: all of Central Texas plus the Dallas metro.** The concrete county enumeration is produced by the planner against COG membership (CAPCOG, AACOG adjacency, and the DFW metro counties) and signed off inside the writers WDLL before depth waves aim at it.
2. **Pricing: settled prior; the ladder of record is `76_empressa_wedge_90d_operating_plan.md` (Free with 5 briefs/mo, Home $20/mo, Pro $40/mo, Team $75/seat/mo).** The Stripe sandbox's $29 "Hauska Pro" matches nothing on record (wrong brand and wrong price); the billing-surface audit aligns Stripe to the settled ladder under Smart Site branding.
3. **Second-state candidate set: Utah, New Mexico, Colorado, Arizona.** The state template flushes Texas assumptions against this Mountain West set (four different state GIS postures, one region).
4. **Owner and easement rail classifications: RATIFIED as proposed.**
5. **Heavy-scan slot: RULED. One write slot per database, reads unrestricted, slot handoff recorded in `_STATE.md`.** This closes the open contradiction named by the layer-first decision.

## WHAT THIS PLAN QUEUES (focus-queue rule)

Sensor program, hardware-sovereignty band, weight-level recursion (L5, gated), CTX and national (held until Bastrop QA-done plus operator go), RE-apps chip-UX catch-up. Elgin re-enters via F3 once its parcel-node anchors and unified dry-run land.
