---
id: 2026-09-16_pickup_list_planned_not_done
title: Pickup list — work planned 2026-09-13 to 2026-09-16 that the QA arc displaced
date: 2026-09-16
status: working card, for the operator to route; nothing here is dispatched
kind: reconciliation
owner: nick
audience: the planner who picks this up after the current integration handoff (P-243, P-244a, P-244b, P-246)
snapshot: |
  doc_repo main f07f3dea. seat/dispatch-planner branch d8b61021 (24 commits not on main).
  Live reads 2026-09-16 on the operator's paid-Solo account: get_smart_site 48209:97658 depth node
  (smartsite-mcp-00124-bub) and smartsite.cloud/api/spine/property-atoms/48209%3A97658/facets.
  Catalog read: _catalog/tx_source_truth.json. Every other status traces to a close, card or
  amendment named in its row.
related:
  - _inbox/2026-09-15_reports_and_envelope_WDLL.md
  - _inbox/2026-09-14_county_to_serving_WDLL.md
  - _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-15_p225_census.json
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
  - _inbox/2026-09-13_national_program_framework_WDLL.md
---

# Pickup list — planned, not done

## Why this exists

The 2026-09-15 QA reconciliation filled the queue with surface defects, and four threads that were
already planned dropped out of view: the Hays catch-up, the setback table reconciliation, the Burnet
and Bell onboarding, and the rest of the county pipeline (OPS-24). This card lists what each thread
still owes, with the evidence for its state. It does not replace the reports and envelope card; items
already queued there are cross-referenced, not repeated.

**Out of scope here:** the design and govtech thread (OPS-17, the Bastrop cutover card, the G-rows)
belongs to the other doc_repo session. The courthouse half of reports is paused by the P-242 ruling
and has its own card (`_inbox/2026-09-16_courthouse_program_WDLL.md`).

## Repo availability right now

| Repo | Occupied by | Free for pickup |
|---|---|---|
| legacy-design-tools | P-243, then P-246 | after P-246 |
| hauska-engine | P-244a | after P-244a |
| hauska-mcp-server | P-244b | after P-244b |
| hauska-factory | nothing | **now** |
| hauska-map | nothing | **now** |
| doc_repo (read-only instruments) | nothing | **now** |

---

## Thread 1 — Hays catch-up (P-200, P-211)

**What the operator sees, explained.** Hays setbacks are NOT missing because the tables are
uncodified. The San Marcos SF-6 table exists and the values are in the record. Read live 2026-09-16
on the gold parcel `48209:97658` (629 Sturgeon Dr, San Marcos, SF-6):

- **Map payload** (`readPath: record`, `bakedAt 2026-09-15T00:54`): setbacks 25/5/20 on record, but the
  envelope is `declined` with `envelope-unverified` ("no confirmed road-frontage edge labeling") and
  carries **no polygon**. So nothing draws.
- Only `setbackFrontFt` serves from the record. `setbackSideFt`, `setbackRearFt` and
  `setbackCornerFt` read `legacy-transitional`.
- **MCP** (`bakedAt 2026-09-14T17:49`, before P-200's apply): the brief prints 25/5/20/15 while the
  draw overlay says "Withheld, setbacks unruled", `setbackRulesFact` is `not-cut-over`, and all nine
  property lines say "No setback table configured for jurisdiction descriptor."

| # | Item | State and evidence | Next action | Repo |
|---|---|---|---|---|
| H1 | **Hays reader-slate resync.** Add `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `setbackRules` for 48209. | Ready since P-211 (already gate-pass). Nobody owns it. Live: three of the four still read `legacy-transitional`. | Compile a lane. The slate, `sourceCommit`, `vendoredAt` and `EXPECTED_SLATE_HASH` move in one commit (P-200 trap). Do not re-add the six rails LDT #671 removed. | hauska-engine + LDT `PARCEL_RECORD_SLATE` |
| H2 | **Hays envelope decline.** The map withholds the envelope polygon as `envelope-unverified`. | Seen on the gold parcel. **How many Hays parcels decline this way is unmeasured.** A Bastrop parcel read the same day (908 Pine) does draw its envelope; why Hays fails the same check is the open question. | Measure the decline share per Hays city, then card what "ground-truth verification of edge labeling" requires for Hays. **This is most likely what the operator is not seeing.** | LDT (buildable envelope) + hauska-map |
| H3 | **Per-edge setback descriptor has no San Marcos entry.** | All nine edges on the gold parcel: "No setback table configured for jurisdiction descriptor", although the district table exists. This is the one path where "not codified" is literally true. | Diagnose which descriptor table the edge resolver reads and why San Marcos is absent; count affected Hays cities. | LDT or engine (find it first) |
| H4 | **Stale MCP bake** (P-230). | The MCP still serves the pre-apply bake two days later. P-230 is already in the reports card's "needs scoping" list. | Scope P-230; it gates every Hays fix reaching the MCP. | hauska-engine |
| H5 | **Envelope group apply, seven Hays-only cities.** Bear Creek, Dripping Springs, Hays, Kyle, Mountain City, Wimberley, Woodcreek; 27,949 parcels. | Code deployed, never run with `--apply` (P-211 close). | Dry-run, then apply on the operator's go (production write). Then slate the four envelope rails (H1 pattern). | hauska-factory job |
| H6 | **Envelope group, the six shared-name cities.** Austin, San Marcos, Buda, Creedmoor, Niederwald, Uhland. | Blocked by the `--city` county-boundary defect. PR #154 (P-229) merged and now county-bounds `--city`. Never re-run. | Re-run scoped with `--county=48209` after H5 proves out. | hauska-factory job |
| H7 | **35,365 Hays cells carry `dateBasis: "unreadable"`**, where the most-current-wins ruling requires a conflict row. | Diagnosed in P-216, not fixed (2026-09-15 handoff). | Card it: a writer change to emit the R-1 conflict shape. | hauska-factory writer |
| H8 | **P-175 label leg.** Four of five Sturgeon addresses print an empty label. | P-183 close: the served `situsAddress` is null on the cortex situs path while the record cell is populated. | Situs-family reader change under a lease. | hauska-map `pe-record-to-facets.ts` |
| H9 | **P-183 staging bake re-run** never executed; production writer re-run gated. | P-183 close. The gold parcel's query point now reads correctly (-97.92589, 29.8719). | Re-run staging for 48209 plus control 48453 and read back the five nodes and ten neighbours. | hauska-factory |
| H10 | **P-178 Hays declared roll: production publish.** | Staging walk went green (P-180-joint). The planner branch records "the production restamp LANDED". The gold parcel now serves the 2026 roll and the 2026-08-26 certified land use. **The seven get_smart_site reads were never pasted and no close reached main.** | Paste the seven reads and write the close. | doc_repo |
| H11 | **P-184 Williamson two-namespace reconciliation**: 282,569 phantom nodes. | Carded 2026-09-14, never dispatched. | Compile. | hauska-factory + LDT |
| H12 | `agValuation` for Hays and the other three counties. | Passes only in Williamson and Travis. | **Operator scope call.** | none yet |

## Thread 2 — Setback table reconciliation (P-225, P-233)

The census ran (P-225, closed-partial): 313 district codes across 16 of 18 wired layers. 172 are
uncodified, covering **18,405 of 61,574 parcels**, and that is a floor because Austin and Lockhart
were unmeasured. P-232 shipped the cheapest slice (6 districts, 3,825 Bastrop parcels). The PUD
question was ruled (A-164). Everything else is open.

| # | Item | State and evidence | Next action | Repo |
|---|---|---|---|---|
| S1 | **The PUD message.** 35 districts, 9,485 parcels: "your setbacks come from your PUD ordinance." | Ruled 2026-09-15 (A-164). **Never carded as a build.** Per P-233 these parcels return the same silent `404 no-district` as an unacquired district; not re-measured since. | Card and dispatch. It must reach the panel, the MCP and the PDF. | LDT (after P-246) + hauska-map |
| S2 | **The 131 "acquire" districts are not a research list yet.** | P-225 close: 131 of the 172 dispositions came from a generic code-shape heuristic, not ordinance research (`lowConfidenceDisposition: true`). | Research each district per city (read-only), confirm the disposition, then sequence acquisition by parcel count. Uncodified parcels by county at census time: Williamson 10,206, Bastrop 3,825 (the P-232 slice, which now draws), McLennan 2,899, Hays 1,306, Travis 169. These counts span all three dispositions. | doc_repo read-only, then LDT `lib/adapters/src/local/setbacks/` |
| S3 | **Austin zoning re-acquisition.** | A-164: the public layer `PLANNINGCADASTRE_zoning_large_map_scale/FeatureServer/0` serves 22,504 polygons without a token. `ZONING_ZTYPE` needs a careful base-code parser: a naive split yields `CS` where the base is `CS-1`. SF-6 (153 polygons) is genuinely uncodified. | Scope the parser lane (already in the reports card as "the Austin parser"). | LDT |
| S4 | **Lockhart zoning.** | Service is gone from its org (P-225). No replacement has been searched for (A-164). | Search for a public replacement, or declare it unacquirable with a decision record. | doc_repo read-only |
| S5 | **A city with no setback table is written as "checked, nothing required."** | Dead-controls card, "three failure modes write an EARNED kind": when no corpus table exists for a city, when a district matcher misses, or when geometry is absent, the factory writes `absent-verified` and serves "no requirement". **Never carded.** It hides exactly the gap this thread is counting. | Card it. Each path writes `unaccounted` or `refused` with a named reason. Then re-run the census, because some "codified" rows may be this. | hauska-factory |
| S6 | **Per-city zoning declarations** (P-156). | Bastrop only: one city, `bastrop-tx.json`. Travis (2,758) and Williamson (1,271) have none. The declaration feeds the gate. | Recompile P-156 for Travis and Williamson (the P-156 close says so). | hauska-factory |
| S7 | **Stale docs that mislead setback lanes.** LDT `AGENTS.md` tells agents to STOP on Bastrop work; a coverage doc misdescribes Bastrop routing; `zoning-layers.ts:22` claims Georgetown `RL` is verified, and the table has no `RL` row. | P-225 close. The Georgetown item is on the reports card's owed list. | One small LDT doc lane. | LDT |
| S8 | **The census has no probe leg.** | P-225 close: a per-district table does not fit `surface-probe.mjs`'s per-parcel rows. | Decide the instrument: re-run `_inbox/2026-09-15_p225_census_instrument.mjs` as the check, or add a district-shaped probe. | doc_repo |

## Thread 3 — Burnet, Bell and the county pipeline (OPS-24)

**Where it stands.** The ruled order is gate first, then Burnet through the existing pipeline, then
the farm designed from what Burnet breaks. **Only step one happened.** P-195 (the gate refuses total
absence) closed 2026-09-14. No other OPS-24 build row was dispatched. P-186's id was also used for an
unrelated re-mint wrapper (F31).

**Which county.** On 2026-09-13 the operator named **Bell (48027) and Milam (48331)** as the first two
counties (A-146). The 2026-09-14 farm handoff chose **Burnet (48053)** as prototype one. The operator
now says Burnet and Bell. Source truth today:

| County | CAD | Geometry ingest | In registry | Notes |
|---|---|---|---|---|
| Burnet 48053 | rest-reachable | pass, 50,138 features read | yes | 59,785 parcels and a 2025 roll on production (A-150); **the two counts disagree and nobody reconciled them**; 0 address points; `parcel_record` 0 rows; Marble Falls zoning verified-live (261 features); six towns are honest absences |
| Bell 48027 | rest-reachable | **not run** | **no** | The 2026-09-13 national card says "165,574 parcels, certified 20/20 on 2026-08-05". **The two sources disagree; measure before planning.** |
| Milam 48331 | rest-unproven | pass, 20,992 | no | |

| # | Item | State and evidence | Next action | Repo |
|---|---|---|---|---|
| C1 | **P-201: split `excluded` into three states.** | Carded 2026-09-14; the 2026-09-15 handoff's "if you do one thing"; never fired. Without it, a rail with no writer drops out of the gate's denominator, so Burnet can pass while missing its largest gaps (A-153). | Dispatch now. hauska-factory is free. | hauska-factory |
| C2 | **P-192: six lease-less writers.** Owner, land use, flood hazard, rail corridor, RRC pipeline, special district. Also the false `lease_released: true` in `parcel-owner.mjs` and `flood-ingest.mjs`. | Never dispatched. A new county cannot fill those rails. | Dispatch after P-244a releases the engine. | hauska-engine |
| C3 | **P-188: pre-bake audit.** | Never dispatched. Step one is normalising three register files (about 87 rows, three formats) into one. Where the runner lives (factory or doc_repo) is open. | Do the normalisation now (doc_repo), then card the runner. | doc_repo, then factory |
| C4 | **P-189: acquire.** Burnet address points from `stratmap_address_points_48_most_recent`; roll vintage declared (P-178 rule). Bell geometry ingest. | Burnet has 0 address points. Bell's ingest has not run. | Burnet: one loader run. Bell: settle the two-source disagreement, then ingest. | LDT loaders |
| C5 | **P-190: identity.** Measure Burnet's (and Bell's) CAD-to-GIS join. | Unmeasured. Hays and Williamson showed why this matters. | Generalise `hays-identity-reconciliation.mjs` and run it. | hauska-factory or LDT |
| C6 | **P-191: instantiate 59,785 Burnet records**, full-shaped. | Not started. | After C4 and C5. | hauska-factory |
| C7 | **P-193: atom identity on merge-back.** `atom_did` is not county-prefixed. | Not started. | Card the design. | hauska-engine |
| C8 | **P-194: completeness check** (two independently derived counts). | Not built. Burnet's 50,138 vs 59,785 is its first real input. | Build it. | hauska-factory |
| C9 | **P-196: publish and serve.** Retract-by-run-id does not exist anywhere; F25 (record path prints the old snapshot's `bakedAt`). | Not started. | Card retract-by-run-id; F25 overlaps H4 and P-230. | hauska-factory + engine |
| C10 | **P-197: OPS-24 probe predicates.** Zero exist. | Already on the reports card's owed list. | Add them per stage as each stage lands. | doc_repo |
| C11 | **P-186 for Burnet's places.** Marble Falls wired, six honest absences. Every Burnet roster row reads `NOT-FOUND-UNKNOWN-WHY`, including Marble Falls, which is verified-live. | Not started. | Fix the roster status field, then declare the places. | doc_repo catalog + factory |
| C12 | **P-187 and P-198: farm manifest and merge gate.** | Deliberately after the Burnet run. | Hold. | none yet |
| C13 | **P-195's leave-behinds.** F26: a never-acquired county gets 1 of 65 rails graded. F28: 160 of 391 grid cells excluded, legitimacy unaudited. F29: the verify-walk image predates the gate image. "Bastrop unchanged" has no baseline. | "To be carded" since 2026-09-14. | Card F26 and F28 (they shape what "Burnet passed" means). Confirm F29 against the current walk image. | hauska-factory |
| C14 | **P-210: which "covered" set is canonical.** | **Operator ruling owed.** It blocks P-205's follow-on (the coverage endpoint), so an un-onboarded county still answers `no-hit`, which claims we looked. | Rule, then build the endpoint in retrieval-api. | hauska-engine |
| C15 | **The national data layer ("L3 fabric").** Federal terrain, flood, roads, boundaries, footprints, soils and pipelines, plus the Texas tile and geometry work treated as its first instance. | "Can start now, never carded" (2026-09-13 national card). | Card it as its own program row. | TBD |

## Thread 4 — Controls and cleanup the same days planned

| # | Item | State and evidence | Next action |
|---|---|---|---|
| X1 | **Dead controls 4, 6, 7 and 8** from the ranked card: `assertEdgesNotStarved` compares a computation with itself; `facetCoverage.baseFacts` treats the lookup key as proof; `resolveZoningJurisdiction` validates against a registry it then ignores; the factory CI step named for a pin check asserts a tautology. | Entries 1 and 2 are done (P-195), entry 3 is P-192, and entry 5 was withdrawn. **4, 6, 7 and 8 were never carded.** | Card them as one row; each is small. |
| X2 | **P-213: blast-radius refusal.** | Canon since 2026-09-15; the code is still unbuilt (P-236's lane). | Dispatch in the factory and the engine writers. |
| X3 | **P-212 leftovers.** Live-currency checks for Hays, Caldwell, McLennan, Williamson, Travis and Ector; 1,013 Bastrop nodes still retired; the undersized 2026-08-11 plan never traced. | P-212 close. | Card the five-county live-currency check. |
| X4 | **P-206: serve honours retirement.** | Unblocked once P-212 corrected the data. Never dispatched. | The owner re-evaluates, then dispatch. |
| X5 | **P-204 mid-cutover rails, P-209 `salesHistory` Unavailable (operator ruled), P-215 two nodes one lot.** | Carded, never dispatched. P-203 adds that `salesHistory` still needs its permanent-refusal ruling with the statutory citation. | Compile P-209 first; it is ruled. |
| X6 | **P-224 plural search** (compiled 2026-09-15, never fired). **P-217 payload coherence** (held behind P-216, which has since settled). | Both are in LDT. | Queue behind P-246. |
| X7 | **P-176 Cotality bake-off**, compiled 2026-09-12, never fired. | Standing memory records Cotality as extinguished. | **Confirm it is still wanted**, or retire the dispatch. |
| X8 | **P-161 to P-166**: OPS-23's node, edge, backfill and succession rows. | "Not yet dispatched" on the OPS-23 card. P-163 gates the Smart Site brief's access-policy check. | Re-read the OPS-23 card before sequencing. |
| X9 | **The wave 6 record never reached main.** `seat/dispatch-planner` holds 24 commits and about 93 artifacts, including the closes for P-178 publish, P-183, P-156, P-154, P-180-joint and the P-186 re-mint wrapper. **The integration seat never reviewed them.** | Measured 2026-09-16 by listing the worktree against main. | Review and land them on main with explicit pathspecs. Several rows above cite them. |
| X10 | **P-185 PromoteKit.** The planner branch records its deployments and a self-granted lease; only a cp2 exists and no close is on main. | Stranded. | Verify live, then write the close. |
| X11 | **P-208 leave-behinds**: the single-parcel re-mint arm should exit nonzero on any decline, and the runbook does not mention the per-parcel arm. | Partly overtaken by P-212. | Fold into X3's card. |

---

## Questions for the operator

1. **Burnet first, then Bell?** Burnet is staged (ingest passed, in the registry). Bell has not
   started, and two cards disagree about what exists for it. Recommended: Burnet as the prototype,
   Bell second once its state is measured. Milam was the other county named on 2026-09-13.
2. **P-210: which "covered" set is canonical?** The search index, the ledger, or the serving path.
   It blocks the coverage endpoint.
3. **`agValuation` beyond Williamson and Travis**, and whether **P-176** is still wanted.

## Suggested order, by repo availability

**Now (repos are free):** C1 (P-201), H5 then H6 (Hays envelope apply, operator go), X9 (land wave
6's record), and the read-only work: H2 and H3 measurement, S2 research, S4, C3 normalisation, and the
Bell measurement.

**After P-244a releases hauska-engine:** H1 (with its LDT half after P-246), C2 (writers), H4 (P-230).

**After P-246 releases legacy-design-tools:** S1 (PUD message), S3 (the Austin parser), S7, X6.

**Then Burnet:** C4 to C11 in stage order, with the probe run between stages.
