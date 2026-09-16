---
id: OPS-24_county_to_serving_program
title: OPS-24 — County to serving: one pipeline, thirteen stages, one county before any farm
date: 2026-09-14
last_updated: 2026-09-16 (rev 4: the final teardown applied; P-252 to P-291 carded; A-183)
status: active, rev 4. The operative work plan is `_inbox/2026-09-16_texas_scaleup_program_scope.md` (rev 4, the plan of record for the scale-up); this document holds the stage rows and the order
owner: integration seat (overseer); lanes on the property, substrate and dispatch-planner seats
plan_rows: P-186 through P-198 (OPS-16 A-149), P-200 through P-250, P-252 through P-291 (A-183); absorbs P-124, P-156, P-181, P-182, P-184 and OPS-21's writer leftovers
snapshot: doc_repo main 82e6b503. Stage statuses trace to _inbox/2026-09-14_county_to_serving_program_map.md rev 2 (measured 2026-09-13/14) and to OPS-23's card. Re-run the instruments named per row before trusting a status.
related:
  - _inbox/2026-09-14_county_to_serving_program_map.md
  - _inbox/2026-09-13_HANDOFF_national_program_package.md
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
  - _catalog/program_preambles/OPS-24.md
  - 90_operations/OPS-23_surface_completion_program.md
  - 90_operations/OPS-21_serve_completion_program.md
  - 19_the_instrument_contract.md
---

# OPS-24 — County to serving

> **Rev 4, 2026-09-16 (A-183).** The final teardown landed and its load-bearing findings were
> re-checked at source. P-201 landed and the zero-earned hole is still open (P-252). The exit is
> now one definition with a customer leg (scope section 5). Every Phase 0 item has a row
> (P-252 to P-291). The critical path to Burnet is the setback acquisition campaign (P-258).
> Bell is a migration county: it already serves from the July bake (P-291).

> **Rev 3, 2026-09-16.** The operator ruled the sequence
> (`_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`):
>
> 1. **Phase 0.** The six counties complete and verified, including the setback table
>    reconciliation, the envelope unlock (P-249) and footprints on the sheets (P-248).
> 2. **Phase 1.** Burnet with its cities as the first county through the farm, with the farm
>    built during that run.
> 3. **Phase 2.** Bell and Milam in parallel.
> 4. **Then** the rest of Texas.
>
> **Deferred:** the road-node pass waits until after Phase 2 (A-177).
>
> **The research wave's findings are in A-179:** the frozen target pair, the zero-earned gate
> hole, and 131,357 parcels waiting on P-249.
>
> **Where the scope governs:** section 3's order below is superseded by it. The stage table in
> section 2 stands.

## 0. Why a program and not a card

The operator's scale question ("I am one operator, I need the whole country, I cannot repeat
Central Texas") produced a thirteen-stage map of how a county becomes usable
(`_inbox/2026-09-14_county_to_serving_program_map.md`). The map is accurate and it is a map:
it has no predicates, no instruments, no owners and no order. Left as a map it becomes the
next thing tacked on beside OPS-21, OPS-23 and P-124, each of which already owns a stage. This
document turns the map into rows that can fail, names what each row absorbs, fixes the order
(the gate first, one county before a farm), and sends the whole thing through an adversarial
teardown before a line is built.

## 1. Done looks like

Burnet County (48053), chosen because it borders Travis and Williamson (two of the six, not all six: the teardown corrected the geography), sits in the CAPCOG data region, and already carries 59,785 TxGIO parcels and a 2025 roll of 49,243 accounts on production with no address points (production read 2026-09-14), runs stages 3
through 12 through the pipeline as it exists, with every stage's record naming its SHA, its
cost and its operator minutes. At the end, `node scripts/surface-probe.mjs` with a real Burnet
address reads PASS on every row the probe carries for that county, the card, the MCP and the
PDF agree, and the per-place declaration names every place in Burnet with a state. Then, and
only then, the farm rows (1 and 13) are designed from the seams that run exposed.

## 2. The thirteen stages as rows

| # | Row | Stage | Exists today | Absorbs | Predicate (can fail) | Instrument |
|---|---|---|---|---|---|---|
| 0 | P-186 | Source recon and the per-place coverage gate | recon exists; no gate reads per-place coverage | P-156, P-182 | every roster place in the county carries `DECLARED_COMPLETE` or `EXPLICITLY_HELD` with counts, and the publish gate refuses a county whose places carry neither | `tx-source-truth.mjs`; the P-156 declaration; the gate read |
| 1 | P-187 | Farm provision and the four-line manifest | not built | | a farm's manifest names LDT, engine, factory and the two package versions, and no stage runs without it | the manifest file, checked by the merge gate (P-198) |
| 2 | P-188 | Pre-bake audit | not built | P-181 | the assumption rows (about 87 by two recounts; "94" was a sum of three lanes' self-reports, never a count, A-150) are first normalised into ONE register format, then probed against the county's source before any write; verdict GREEN, AMBER or RED with the failing row named | one normalised register; the runner, proven by violation |
| 3 | P-189 | Acquire | exists; address points loaded for 6 of 254 | P-178's vintage rule; the address-point precondition | parcels, roll, zoning and address points land with a declared vintage each; a roll re-load marks accounts that fell off; the county's address points are loaded from the statewide StratMap set (`stratmap_address_points_48_most_recent`, the source the six already use) BEFORE stage 12, or the Find box gap is declared | the loaders' run records; `txgio_address` count for the county (Burnet: 0 today) |
| 4 | P-190 | Identity and binding | exists, fragile | P-184, P-161 | raw-vs-normalized collapse measured for the county (H1's instrument) and every two-namespace county binds through the crosswalk | `hays-identity-reconciliation.mjs` generalised; the crosswalk type |
| 5 | P-191 | Record instantiation | exists | | every parcel in the county exists full-shaped from the first write; unaccounted count equals rows times rails minus filled | `parcel_record` census |
| 6 | P-192 | Rail fill | partly broken | OPS-21 D-rows | every writer runs under a lease and leaves a run record it can prove: `parcel-owner.mjs` and `flood-ingest.mjs` today write `lease_released: true` without ever taking a lease (teardown finding 5); owner, land use and flood re-run without throwing; envelope stays refused by ruling R-2 | the writers' run records read against the lease history |
| 7 | P-193 | Atoms | exists; the lease is ALREADY county-scoped (`atoms_writer_lease_v2` keyed by scope type and scope id; the map's "one global resource" did not survive) | | a county's atoms merge by identity (`atom_did` is not county-prefixed: the real hole, one layer below the lease) with a run id, and read back by county | the identity reconciliation on merge-back; the read-back count |
| 8 | P-194 | Completeness check | not built | | two independently derived counts of the county's parcels agree, and disagreement refuses | the check, proven by violation |
| 9 | P-195 | The gate refuses total absence | broken | P-181 entry 1 | an empty county cannot earn a pass; partial and total absence refuse alike; proven by violation on a county with zero earned cells | `publish-gate` with the empty-county test **built first** |
| 10 | P-196 | Publish and serve | exists; one label lie; no retract | OPS-23 F25 | staging then the identical job on production under a lease; record-path payloads carry the cells' own vintage, not the old snapshot's; retract-by-run-id exists (today: no code anywhere, teardown finding 4) and is proven by retracting one run on staging | publish run records; the probe's bakedAt read; the retract verb |
| 11 | P-197 | The customer predicate and the meter; LAW 1 ARMED | probe exists with ZERO OPS-24 predicates (teardown finding 2); the close gate is widened to the OPS-24 range 2026-09-14 and prints the predicate debt on every OPS-24 close until this row lands | | every OPS-24 stage row has a `ROWS` entry in `surface-probe.mjs` that fails on its known-bad fixture before that stage's build row may close as `closed`; the probe with a real address passes; dollars and operator minutes per stage are on the county's record | `surface-probe.mjs`; `probe-close-gate.mjs` (widened, self-tested); the cost meter |
| 12 | P-198 | Merge-back gate and the Burnet run | not built | | the merge refuses unless the farm manifest equals upstream; Burnet has run stages 3 to 11 through the existing pipeline first with every stage's record | the merge gate; Burnet's records |

Stage 13 of the map (merge back) is P-198 with the Burnet run, since the run decides the
farm's shape. Access policy per county and the calibration hook per cell are named as owed
design items in section 5, not rows, until the teardown says where they belong.

## 3. Order (rev 4, 2026-09-16)

1. Adversarial teardown of rev 2: DONE 2026-09-14 (`_inbox/2026-09-14_ops24_teardown_review.md`).
2. P-195, the gate: DONE for the zero-row case (2026-09-14). P-201 landed 2026-09-16 and did not
   close the zero-earned case. **P-252 closes it and is the first gate row now.**
3. **Phase 0, the six counties complete.** The work is in scope section 4, the build order in
   scope section 12, and the exit in scope section 5: the ledger leg (P-253), the customer leg
   (P-254), coverage, the road residual (P-264) and the operator's walk.
4. **Farm machinery, built alongside Phase 0 and refined during Burnet:**
   - P-187, the manifest;
   - P-188, the pre-bake audit, with the blocker register as its checklist;
   - P-194, the completeness check;
   - P-197, the per-stage probe legs;
   - P-284, stage and cost telemetry (a migration; a Burnet precondition);
   - P-285, the runner; P-281, leases for job executions and heavy scans;
   - P-286, the blocker register as a closed checklist;
   - P-196, retract-by-run-id;
   - P-198, the merge gate.
5. **Phase 1, Burnet** through stages 0 to 12 on the shared stores, with every stage recorded.
   Burnet's run record is the speed baseline.
6. **Phase 2, Bell and Milam in parallel.** The storage for Phase 2 is decided from Burnet's
   stage records. If isolated stores are needed, three preconditions come first:
   - the frozen target pair is generalised (P-288);
   - branch lifecycle and cleanup exist (P-289);
   - telemetry covers the depth stages (P-284).
   Either way, P-290 tests two counties publishing together first, and Bell's migration off the
   July bake follows P-291.
7. The final adversarial teardown of the rev 3 scope: DONE, landed `f9ed016c` (A-183).

## 3a. The farm rationale, restated on two legs

The scoping agent's three reasons for farms were blast radius, the code boundary, and lease contention. The teardown removed the third: the atoms lease is already scoped per county. Blast radius (a bad county cannot overwrite the master) and the code boundary (four teams solving four counties produce four pipelines) survive, and the second is the whole game, which is what the manifest (P-187) and the merge gate (P-198) exist for. Without contention the order "one county through the existing pipeline first" is stronger, not weaker.

## 4. Findings that shaped this

F25 (record-path payloads carry the old snapshot's bakedAt), the P-181 dead-controls ranking
(seven entries after the envelope withdrawal; the "94 assumption rows" was three self-reports summed, about 87 on recount, recorded as a method error not an arithmetic one), the Hays identity chain (P-145, P-175, P-177,
P-180, P-183), the P-178 vintage rule, and the map's four open holes: atoms not
county-partitioned (a lease-scope question, not a store rewrite), address points for counties
outside CAPCOG, no retract-by-run-id, no per-place gate.

## 5. Owed design items, not yet rows

Access policy per county (which counties serve free, which paid, decided at acquire and
carried to publish). The calibration hook (where a customer correction lands on a cell,
commitment 2). Atom identity reconciliation on merge-back (the lease question is answered by code: per county).

## 6. Relationship to the other programs

OPS-23 owns serving and identity and stays authoritative where the two touch. OPS-21 owns the
writers it built; OPS-24 absorbs their leftovers as stage 6. P-124's bake is stage 9 and 10 on
the six counties; OPS-24 runs the same stages on a seventh county and treats the six as the
control.
