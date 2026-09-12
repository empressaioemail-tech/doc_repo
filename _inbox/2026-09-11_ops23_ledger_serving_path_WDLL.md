---
id: 2026-09-11_ops23_ledger_serving_path_WDLL
title: OPS-23 — The ledger as the serving path — WDLL (the durable card)
date: 2026-09-11
status: approved 2026-09-11 (every ruling below was taken by the operator in the session that produced this card; nothing here is proposed except where marked)
plan_rows: P-151, P-152, P-153, P-154, P-155, P-156, P-157, P-158, P-159, P-160, P-161, P-162, P-163, P-164, P-165, P-166, P-167, P-168 (OPS-16 A-128, A-129, A-130, A-131)
owner: integration seat (overseer), coordinating hauska-map, legacy-design-tools, hauska-engine, hauska-factory, the atom-contract package
snapshot: doc_repo main 627e5853. Findings trace to live probes of production on 2026-09-11 (smartsite.cloud, cortex-api through the PE proxy, hauska-engine-api-00198-cir logs, Bastrop County FeatureServer) and to origin/main reads of hauska-map fb41c05, legacy-design-tools 489f428c, hauska-engine 79fa573, hauska-factory 217b7dd. Re-run the instruments in section 8 before trusting any status column.
related:
  - 90_operations/OPS-23_surface_completion_program.md
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms.md
  - 19_the_instrument_contract.md
  - _decisions/2026-09-11_ledger_as_serving_path_seven_steps.md
  - _decisions/2026-09-11_setback_source_most_current_wins.md
  - _decisions/2026-09-11_ruling_b_reversed_polygon_only.md
  - _decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md
  - _sessions/2026-09-11_ops23_ledger_serving_path_and_probe_claude_code.md
  - _inbox/2026-09-11_p160-probe_close.json
  - _inbox/2026-09-11_p168-preamble-scope_close.json
---

# OPS-23 — The ledger as the serving path — WDLL

## Origin

The operator opened with the OPS-21 close, a screenshot of 1109 Pecan St with no setbacks
drawn on the map, and the feasibility PDF for the same parcel, and asked why. The answer was
never one defect. One parcel traced through every surface found six read paths, five
producers of setbacks disagreeing as `present`, a map refusing a polygon its own endpoint
returns, a PDF printing two buildable figures, a Travis panel rendering three of fourteen
facts, and a feasibility engine that finishes while its clients give up. The operator's read:
"we keep circling a larger issue, which is getting the ledger to be the serving path, the
single source of truth and normalizer for everything." This card is that program, written so
it cannot be lost between sessions: every item has a predicate, an instrument, an owner, and a
row.

## Done looks like

Reports, the Smart Site web app, the Smart Site MCP connector and the Hauska MCP catalog show
the same facts for the same parcel because they all read one reader, and that reader walks
gated ledger cells and dereferences atoms. Every fact, including every relationship, is an
atom hanging off a node, in Doc 19's sense: a node is identity, an atom is one claim from one
authority at one time, an edge is an atom whose value is a node. A ledger cell is accounting:
state, atom reference, provenance, and a cached rendering keyed to the atom version and the
vocabulary version. No cell holds a value as canon. One writer mints the atom, sets the
pointer and writes the rendering in one transaction. One vocabulary module, shipped in the
atom-contract package, produces the human face of every atom, so the panel row, the PDF sheet
and the connector's display text are the same information. Unslated rails refuse with their
cell state; nothing falls to a legacy path, and every legacy path is deleted in the same card
that replaces it. Absences name the city or source that is missing. The map draws the
modelled buildable envelope wherever a district and a setback table exist, and no surface
prints a buildable figure until an envelope atom backs it. The most recently dated source
supplies every dimensional value, everywhere. Every lane in the program closes on a live probe
of the customer surface it changed, for a fixed parcel set across six Central Texas counties,
and a hook refuses the close otherwise.

**Done is measured, not declared.** `scripts/surface-probe.mjs` reports PASS on every row
predicate for the section 7 parcel set, the disagreement count between panel and MCP is zero,
the count of gated cells holding a value with no atom behind them is zero, and the L4
divergence tripwire is retired as unnecessary on that report.

## The rulings this card rests on (operator, 2026-09-11)

| # | Ruling | Record | Done looks like |
|---|---|---|---|
| R-1 | Most-current source wins for setbacks and every dimensional rule, everywhere. Tier breaks ties only on equal or unreadable dates. Dates are read at source. Unreadable dates show a conflict row, never a silent pick. | `_decisions/2026-09-11_setback_source_most_current_wins.md` | One resolver implements it (P-154); all four surfaces print the same setbacks and date for `48021:34049`; the Bastrop layer 23, layer 83 and Ordinance 2026-06 dates are recorded as the evidence. |
| R-2 | Ruling B reversed for the polygon only. Map and MCP draw block draw the modelled envelope from the same call with its disclosure; the figure stays refused until an envelope atom backs it. | `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md` | P-153 predicate PASS; the entitlement gate untouched and the tier that sees the drawing named in the close. |
| R-3 | The city is the unit of zoning and setback work. | OPS-23 §3 | P-156's queue exists, ranked by parcel count, and every absence string names the city until that city closes. |
| R-4 | The customer surface is the completion predicate. | OPS-23 §3; gate `probe-close-gate` | Every OPS-23 close cites a probe artifact (PASS for a close that says closed; any verdict for one that says partial or blocked). VERIFIED THROUGH THE HARNESS 2026-09-12 02:55Z: a throwaway close claiming closed on an UNMEASURED artifact was refused at `git commit` by the PreToolUse hook. The first attempt, staging and committing in one command, went through as `213f5369` (reverted): the gate reads the index when the call starts, so add-and-commit in one string is now refused outright. |
| R-5 | Overseer / dispatch planner / lane. The plan is the only state; the dispatch planner is stateless and swapped at a written checkpoint. | `_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md` (ACTIVE 2026-09-11, operator go with wave 1) | A dispatch-planner seat is registered; the first checkpoint file exists after three closes; a successor resumes from plan plus instruments plus checkpoint without the predecessor's conversation. |
| R-6 | The ledger is the serving path and atoms are canonical. Cells are accounting with a cached rendering. One reader in `hauska-engine/services/retrieval-api`. One writer. One vocabulary. | `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`; ADR-031 amendment 2026-09-11 | The seven steps below closed; the "done is measured" line above reads true. |
| R-7 | Cached rendering: yes, beside the cell, written by the writer, keyed to atom version and vocabulary version. | same decision, reasoning section | A rendering is never observed served with a matching key and a different atom. |
| R-8 | Reader location: the Hauska retrieval service, below cortex and the MCP server, with a read-only factory role; never cortex. | same decision | P-152's first act is that role; cortex holds no factory credential. |
| R-9 | Cells-as-canonical with projected atoms: REJECTED (inverts the thesis). The projection survives only as P-164's backfill mechanism. | ADR-031 amendment, "reconsidered and rejected again" | Nobody proposes it again; the memory file says so. |

## The rows, and what done looks like for each

Order is the operator's. Status is as of the snapshot; the instruments in section 8 are the
truth after that.

| Order | Row | Lane | Done looks like | Instrument | Status 2026-09-11 |
|---|---|---|---|---|---|
| 1 | P-151 | SEAM | `48453:113408` seals with its fourteen facts and header `414 SPILLER LN`; placement seeds from the record point and the click, never a geocoder; `48453:474034` says unincorporated Travis; the cortex point route answers or refuses inside 10 s. | `surface-probe --rows P-151` plus the operator's screenshot in the close | MERGED AND SERVING 2026-09-11 19:45Z (hauska-map #383 `6ab69147`, LDT #657 `3950ce9b`; PE bundle `index-D1MJSpcc.js` carries the new strings; cortex-api `00770-puy` at 100 percent); PROBE PASS on both parcels 21:45Z (`_inbox/2026-09-11_214505_surface_probe.json`, operator screenshots folded in via `_inbox/2026-09-11_p151_observations.json`; account tier Studio or Team, inferred from the owner row rendering); CLOSED 2026-09-11 (lane close `_inbox/2026-09-11_p151-seam_close.json`, hauska-map #383 `6ab69147`, LDT #657 `3950ce9b`, both SUCCESS by conclusion; overseer annotation cites the PASS artifact); F16 (Find box does not resolve the address) is post-close and rowed separately; leave-behind: other split-situs counties unchecked, the LDT 8 s bound is a client-side race |
| 2 | P-160 | PROBE | The instrument, the lane board and the close gate exist, self-test both directions, and the gate is observed refusing through the harness. | `surface-probe --self-test`, `probe-close-gate --self-test`, the next session's first close | closed partial: built and self-tested; gate live verification OWED |
| 3 | P-153 | DRAW | Amber inset visible on the map for `48021:34049` for an entitled viewer; MCP draw block carries the same polygon with the same vertex count; no surface prints a figure; `48453:474034` still refuses. | `surface-probe --rows P-153` with observations | IN FLIGHT at 2026-09-12 02:40Z: hauska-map #384 `1aef5dd5` merged 22:02Z but inert on the surface (the lane's own live probe found it), #386 `8b44f68d` merged 22:33Z wires the augmentation; LDT half three commits ahead, unmerged; CP1 and CP2 filed (`_inbox/2026-09-11_p153-draw_cp{1,2}.json`); no close yet; P-167's consumer halves wait on this merge |
| 4 | P-152 | READER (step 5) | retrieval-api holds a read-only factory role, walks gated cells, dereferences atoms, serves the cached rendering on key match, refuses unslated rails; cortex, the panel, smartsite-mcp and the engine reports consume it; the 70 legacy paths from L1's audit answer 404 or a declared decline; panel `bakedAt` is the reader's snapshot. | `surface-probe --rows P-152` (panel versus MCP disagreement count zero); retired routes probed for 404 | lane 1 of 2 (P152-READER) dispatched 2026-09-11; per its CP2 (21:05Z): engine half merged (hauska-engine #417 `6f1b7ffe`, #418 `419ae8c8`, #419), RO secret mounted on operator approval, canary `hauska-retrieval-api-00086-nur` at 0 percent answers `/record` 200 for all five probe parcels (34049: 65 rails, 21 `record`, 44 `legacy-transitional`, cityLimits byte-identical to a direct read); a third direct factory connection found and repointed (`parcelRecordFactRead.ts`, flood into the brief); LDT #658 `55c4ad44` merged 21:42Z; by field read 2026-09-12 02:40Z `hauska-retrieval-api-00086-nur` and `cortex-api-00776-wov` serve 100 percent; five-parcel facets diff byte-identical on every slated rail; lane 1 CLOSED (`_inbox/2026-09-11_p152-reader_close.json`, partial at row level: the row predicate is UNMEASURED until P152-PANEL; surgical swap kept the 18 rail-pair files as thin wrappers on operator approval; `FACTORY_DATABASE_URL_RO` out of the cortex deploy); lane 2 (P152-PANEL) is the next dispatch |
| 5 | P-154 | MOST-CURRENT (first family through step 3) | One resolver, date-first; engine adapter and factory writer use it; Bastrop ledger setback cells re-run; the three Bastrop dates recorded. | four surfaces identical for `48021:34049` or all four show the conflict row | not dispatched |
| 6 | P-155 | FEASIBILITY | Refresh returns 202 with a job reference; clients poll download; the cold-start string is gone; Travis versus Bastrop latency profiled and recorded, not gated on. | `export_instrument feasibility 48453:474034` returns a PDF; the app produces it without a retry | CLOSED-PARTIAL 2026-09-11 (engine #420 `81ec7b09`, hauska-map #385 `91990741`, LDT poll fix; `hauska-engine-api-00205-san` at 100 percent carries it with P-159): refresh 202 and MCP PDF OBSERVED on both parcels; the one open leg is a signed-in browser click in Reports (`feasibilityAppPdfWithoutRetry`), operator-owed; leave-behind: no traffic-shift lease (P-155 and P-159 collided live), `ENGINE_API_GATE_TOKEN` unset in production, 10 min stall ceiling near the slowest observed job (630 s), CPU throttled between requests |
| 7 | P-156 | CITIES | Seventeen unstaged Travis cities ranked by parcel count, West Lake Hills and Bee Cave first; per city: discovery run, layer staged or none recorded, completeness declared or held with numbers, setback table or per-parcel record or none recorded; the roster's `zoning_layer` corrected from the factory declaration or retired. | per city: `get_smart_site` and the panel show zoning present and setbacks present or absent-verified naming the city | not dispatched |
| 8 | P-157 | STRUCTURAL | TCAD improvement detail ingested; living area and year built present for both Travis probe parcels; county null rate on improved parcels reported before and after. | `structuralFact` on the probe set | BLOCKED at CP1 2026-09-11 (`_inbox/2026-09-11_p157-structural_cp1.json`): no cloud execution path exists for LDT `lib/cad-ingest` (36 Cloud Run jobs, all factory); the TCAD certified export names its files `PROP.TXT` and `IMP_DET.TXT`, not the loader's `*_APPRAISAL_INFO.TXT` pattern; three operator questions: break-glass or infra card, who owns the PACS file-name registry, which roll vintage (preliminary 07072026 or certified 07182026). RULED 2026-09-12: no break-glass; resumes after P-169; certified 07182026 for both files; the file-name shape is a source declaration in the loader registry |
| 9 | P-158 | FOOTPRINT | The 10 percent join's denominator stated; the predicate fixed if it is parcel area; the map layer reads staged footprints, not the Bastrop-only atom table. | `buildingFootprintFact` present for `48021:34049` and `48453:113408`; near-bbox returns at least one footprint around each | CLOSED-PARTIAL 2026-09-11: F8 was stale when written (atoms for 48021 and 48453 were minted 2026-09-07: 24,861 present / 46,640 absent and 72,919 / 323,543); engine PR #421 (label split into three evidenced causes, CI SUCCESS) OPEN for the overseer; the anchor parcel's nearest staged footprint is 1,615 m away, which the lane calls a source coverage gap and the overseer reads as a staged-layer load gap until a direct count of `tx_building_footprint` inside Bastrop city limits says otherwise; no sanctioned execution path for the footprint writer; unexplained 2026-09-07 production write with no execution log (rowed as P-171). RULED 2026-09-12: the dispatch planner merges #421; before any second source, one direct count of `tx_building_footprint` inside Bastrop city limits decides load gap versus source gap |
| 10 | P-159 | PDF | One buildable figure per document or none; the percent computed from the figure printed; the narrative footprint sentence generated from the footprint fact state. | FS-48021-34049 prints one figure on every sheet that prints one; sheet 2 does not claim an empty lot | CLOSED 2026-09-11 PASS (engine #422 `ce6a75af`; seven print surfaces fixed, not four; `printedBuildable` keyed on a real `atomDid`; narrative refusal proven non-vacuous; `_inbox/2026-09-11_231106_surface_probe.json`, reproduced by the overseer 2026-09-12 02:43Z) |
| step 1 | P-161 | NODES | The three OPS-22 §1 identity rulings taken; `placeKeyToEntityId` published in the atom-contract package with self-tests; the `27303` versus `027303` collision population measured; one key per city, district and road. | the function is imported by factory and engine; the collision count is in a file | not dispatched |
| step 2 | P-162 | RAIL-TO-ATOM MAP | A file naming the atom family for each of the 65 rails, or NONE, with counts and the contract PRs a NONE requires. | the file, with a self-test | not dispatched (integration seat) |
| step 3 | P-163 | ONE WRITER | The conformant writer mints the atom, sets `parcel_record_cell.atomDid`, writes the rendering, in one transaction; the runner reaches all twelve writers; every factory cell job routes through it. | a probe-set parcel's setback cells carry an `atomDid` whose atom exists with the same value | not dispatched; depends on P-161, P-167 |
| step 4 | P-164 | BACKFILL | Every gated cell holding a value has an atom minted from its own provenance and is repointed, value unchanged; L4 retired on that report. | count of gated cells with value and no atom reaches zero for six counties; before/after value diff zero | not dispatched; depends on P-161, P-163 |
| step 6 | P-165 | EDGES | Parcel-in-city, parcel-in-district, edge-fronts-road, parcel-adjoins-parcel, supersededBy exist as atoms whose value is a node; `hop1` and `subgraph` implemented. | `get_smart_site` depth `hop1` for `48021:34049` returns its edges with provenance | not dispatched; depends on P-161 |
| step 7 | P-166 | SUCCESSION | A node's replat, renumber or reload marks its atoms and cells stale together, visibly to the gate. | a simulated reload in staging flips the affected cells to a stale state the gate refuses, and nothing else moves | not dispatched; depends on P-163 |
| vocab | P-167 | VOCABULARY | One display module as a subpath of the atom-contract package, imported by writer, reader, PE and engine; the parity lock deleted. | both repos import the package; display strings identical across surfaces for the probe set | CLOSED-PARTIAL 2026-09-11: step 1 done, `@empressaio/atom-contract@1.32.0` live with `./display` (PR #28 `995df513`, three CI legs SUCCESS); steps 2 to 5 (fold P-153's token as 1.33.0, consumer imports, copy retirement, the surface probe) wait on P-153 merging in both repos |
| done | P-168 | PREAMBLE SCOPE | Shared preamble fleet-wide only; program law attached by row membership; generator refuses program law in the shared file. | `standing-decisions-scope --self-test`; a G-row in any dispatch preamble is a stale compile | closed 2026-09-11 |
| wave 2 | P-169 | INFRA | Cloud Run jobs for LDT `lib/cad-ingest` and engine `write-building-footprint-county.mjs`, factory job pattern, load manifest, code-level laptop refusal; TCAD file names as a source declaration. | `gcloud run jobs list` shows both; a staging dry run leaves its record; a laptop `--apply` is refused by code | ADDED 2026-09-12 (ruling 1 to 3); unblocks P-157 and P-158 |
| wave 2 | P-170 | TRAFFIC LEASE | One traffic shift at a time per service: contract clause, `_catalog/leases/`, hook `traffic-lease-gate`. | the hook observed refusing a shift without a lease, through the harness | BUILT 2026-09-12 03:10Z (`scripts/enforcement/traffic-lease-gate.mjs`, hook wrapper, registered on Bash, `_catalog/leases/` ignored by git): self-test 17 checks both directions; direct invocation refuses without a lease and allows with one; harness firing owed the next session |
| wave 2 | P-171 | PROVENANCE | The 2026-09-07 footprint atoms write named: writer, run record or break-glass row after the fact, lease rows for the scope. | the close carries the record or the named writer | ADDED 2026-09-12 (ruling 6) |
| wave 2 | P-172 | FIND BOX | Address form resolves from the situs index; parcel id resolves directly; geocoder only as a labelled fallback. | Find box resolves `414 SPILLER LN` to `48453:113408` (observed); the search route returns the id (machine) | ADDED 2026-09-12 (ruling 7, F16) |

Dependencies, so the order is not re-derived: P-153 after P-151 (shared file); P-152 after P-151,
P-161, P-167; P-154 after P-152; P-156 after P-152; P-163 after P-161, P-167; P-164 after P-161,
P-163; P-165 after P-161; P-166 after P-163. P-155, P-157, P-158, P-159, P-162 depend on nothing
and run beside the steps.

## Findings that must not be lost, and the row that closes each

| Finding (OPS-23 §2) | Closes under |
|---|---|
| F1 map refuses the polygon its endpoint returns (Ruling B) | P-153 |
| F2 drawing gated on entitlement | operator ruling owed (section 5) |
| F3 five setback producers disagree on one parcel | P-154 (value), P-152 (one reader) |
| F4 four buildable figures; PDF prints two; headline arithmetic false | P-159, P-153 |
| F5 Travis panel unplaceable; geocoder dependence | P-151 |
| F6 panel reads its own adapter, five weeks stale; ADR-031 5(b) fork | P-152 |
| F7 feasibility completes in 85 to 154 s; clients abort at 55 s | P-155 |
| F8 footprints: atom layer Bastrop-only; ML join declines visible houses | P-158 |
| F9 roster stale versus factory completeness declaration; 17 Travis cities unstaged | P-156 |
| F10 "Withheld, setbacks unruled" beside present setbacks; PDF narrative claims an empty lot | P-153 (MCP text), P-159 |
| F11 cortex Travis lookups hang intermittently (facets 60 s, point 504, situs 502) | P-151 LDT half; class deferred with trigger |
| F12 geocoding demoted by I5 and P-27 and still reached | P-151 |
| F13 address-form envelope answered for a Williamson parcel when asked about a Bastrop one | P-152 (reader resolves by node id only) |
| F14 point-route hang is a rate, not a state | measured by every probe run |
| F15 cortex's cached Bastrop county-gis layer has holes at both Bastrop probe parcels; the county's own service has them | P-152 (rings from the ledger's `parcelGeometry`, never a cached fetch) |
| F16 the Find box on smartsite.cloud does not resolve `414 SPILLER LN` (operator, 2026-09-11 21:05Z, after the P-151 deploy); address search is a geocoder path separate from the sheet resolver P-151 changed, and P-27 ruled the situs index over any geocoder | P-151 close must say whether the lane touched it; if not, a new row (Find box reads the situs index) is proposed at the next amendment |

## Owed by the operator, each named so it does not silently expire

| Item | Why it blocks | Suggested default if unruled |
|---|---|---|
| Which account tier the screenshots were taken under | P-153's predicate is "visible for an entitled viewer"; without the tier the screenshot is not evidence | none; ask |
| Whether free viewers should see the drawing (F2) | product ruling; P-153 leaves the gate as is | keep the gate; drawing is paid |
| Go on the topology decision (R-5): GIVEN 2026-09-11 with the wave 1 dispatch; seat `dispatch-planner` registered | closed | closed |
| Registering the dispatch-planner seat: DONE 2026-09-11 (`dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`) | closed | closed |
| Bastrop setback authority if the three dates tie | P-154's conflict row is honest but not an answer; the source authority is City of Bastrop Development Services, through Sylvia | conflict row stands |
| Minting verified-absence atoms under absent-verified cells (ADR-031 open decision) | P-164 must not touch absence cells until ruled | leave absence ledger-only in the first pass |
| Read-only factory role for the retrieval service (R-8) | P-152's first act; a credential decision the substrate seat executes and the operator approves | none; ask |
| Four other-county probe parcels (48055, 48209, 48309, 48491) | P-160's set is five parcels until a factory read chooses them | P-152's lane chooses them with its role |

## Owed by seats

| Item | Owner | Trigger |
|---|---|---|
| Live verification of the close gate: first OPS-23 close commit of the next session, probe field removed then restored | integration | next session |
| OPS-17 and OPS-19 lanes confirm they still receive their moved program law on next compile | govtech seat, property seat | next compile |
| ENFORCEMENT.md clause: a hook is verified through the process that calls it; a mid-session registration is not that process | integration, with its own review | next canon pass |
| OPS-22 §5 gains the cached county-gis parcel layer as a seventh read path with F15 | integration | P-152 mission |
| ETJ rail (both Travis probe parcels `unresolved`) | P-156 | a city with an ETJ layer |
| Situs per-county JOIN | P-151 close | a second split-situs county |

## Instruments and cadence

```
node scripts/surface-probe.mjs                     the predicate; artifact to _inbox/<stamp>_surface_probe.json
node scripts/surface-probe.mjs --rows P-151 --observations obs.json
node scripts/surface-probe.mjs --self-test         18 checks, both directions
node scripts/ops23-lane-status.mjs                 the board, registry-driven
node scripts/enforcement/probe-close-gate.mjs --self-test
node scripts/enforcement/standing-decisions-scope.mjs --self-test
node scripts/dispatch.mjs --lane <ID> --plan-row <P-15x|P-16x> --mission-file <f>     program preamble attaches by row
```

Cadence: the overseer runs the probe and the board at the start of every session and after
every close. The dispatch planner writes `_inbox/<date>_ops23_checkpoint_<n>.md` every three
closes or on the first claim about a repo it has not opened; the format is OPS-23 §6. A
successor's first three commands are: read OPS-23, run both instruments, read the latest
checkpoint.

## How this card stays in sight

- OPS-23 "Read this first" names this card as the durable statement of done; the plan's row
  table and this card's row table are the same eighteen rows, and a row added to one is added
  to the other in the same commit.
- `00_current_state.md` carries a pointer to this card in its OPS-23 paragraph.
- Every OPS-23 close cites a probe artifact, and the probe's row predicates are this card's
  "done looks like" column made executable. When the two drift, the instrument is corrected
  first and this card second, and the correction is logged in OPS-23 §10.
- Nothing in this card is closed by a merge, a cortex read, a ledger count, or an MCP read.
  The surface is the predicate.

## Not in scope, said so it is not assumed

Acquisition beyond the six counties; the market layer; the Dashboards product line; the
atom-contract's calibration types from the trading spine (a separate thread); any change to
the entitlement or pricing surface; the ENFORCEMENT.md rewrite beyond the one clause above.
