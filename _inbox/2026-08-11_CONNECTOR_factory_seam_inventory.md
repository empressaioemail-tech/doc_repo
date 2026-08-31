---
id: 2026-08-11_CONNECTOR_factory_seam_inventory
title: The factory-to-factory connector, found and assessed, plus the runbook inventory for onboarding a new state
date: 2026-08-11
status: read-only investigation close (no factory run executed, no code changed)
owner: planner
related:
  [
    90_runbooks/factory_onboarding_runbook,
    90_operations/OPS-WDLL_the_factory,
    90_operations/OPS-1_texas_source_registry,
    90_operations/OPS-2_county_onboarding_runbook,
    90_operations/OPS-13_store_topology,
    90_operations/OPS-14_texas_flush_game_plan,
    _inbox/2026-08-11_FACTORY_operating_procedure_of_record,
    _inbox/2026-08-09_W5_depth_factory_program_WDLL,
    _inbox/2026-08-09_E3_elgin_builder_close_post_anchors.json,
    _inbox/2026-08-11_CONNECTOR_factory_seam_inventory.json,
  ]
---

# The connector, found and assessed

Machine-checkable companion: `_inbox/2026-08-11_CONNECTOR_factory_seam_inventory.json`.

## The headline, before anything else

The connector exists. It is not prose in a decision doc and it is not a manual planner step. It is two committed code artifacts in `hauska-engine` driven by a third artifact that lives outside any repository. The operator's belief that a connector was built is correct on the substance.

Three corrections to the mental model follow, and they matter more than the confirmation.

The first is that only half of it is proven. The producing half ran 132 counties across 46 hours in production and independent store truth confirms the fabric is fully drained. The consuming half — the gate that makes the seam mean anything — has run exactly once against real anchors, in dry mode, on 500 parcels of one city, and was never applied.

The second is that the proven half's driver is not in a repository. It sits at `P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs` on one machine, in a directory that repo memory separately flags as recycle-prone. The single most-cited ruling in this program says to operate that frozen artifact rather than rebuild it, and the artifact is one directory cleanup away from being unavailable.

The third is that the gate is bypassable by following the promoted runbook. That is the most actionable finding in this document and it gets its own section below.

## What the connector is

**Producer.** `P:/hauska-engine/packages/engine-core/scripts/write-parcel-node-county.mjs`, 560 lines, with its logic in `packages/engine-core/src/parcel-node/` across `plan-county-parcel-nodes.ts`, `reconcile-county-parcel-nodes.ts`, and `parcel-node-atoms.ts`. Its own header states the purpose without ambiguity: it walks a loaded county's `txgio_parcel` rows and emits `parcel-node` atoms, "closing the seam between the STATEWIDE factory (which loads parcel geometry) and the atom layer the County Manifest counts. Before this CLI, every wave county could land its geometry and Rail 1 would still read empty."

It reads geometry from `TXGIO_DATABASE_URL` and never writes it. It writes atoms to `DATABASE_URL` (database `hauska_mcp`) and only under `--apply`. It reads its county roster from store truth at execution time with a deliberate absence of any hardcoded allowlist. It de-duplicates on `feature_index` rather than geometry, keeping account identity separate from geometry identity so that 133 Tarrant leasehold accounts sharing one polygon are not silently collapsed. It retires orphans on re-acquisition and fails closed if any active orphan survives the pass. It verifies stored bytes by primary key after every applied batch.

**Consumer.** `P:/hauska-engine/packages/engine-core/src/parcel-node/warm-preflight-gate.ts`, headed "C1/C5 WARM PREFLIGHT GATE — the seam check between the two factories." It encodes invariant S3: no parcel is warmed without a live, resolved, account-keyed parcel-node anchor. The warm set is the intersection of recipe eligibility and anchor eligibility, never recipe eligibility alone. Six named decline codes cover every non-eligible state, the eligibility function is total over its input domain with no default-eligible fallthrough, and `assertWarmGateApplied` reconciles cohort size against passed-plus-declined so that a parcel reaching compute without a verdict fails the run rather than passing quietly.

**Driver.** `P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs`, 413 lines, carrying the halt tripwires, the idempotent ECONNRESET retry, the dedup guard, the manifest checkpointing, and the resume skip-set that 132 counties of production paid for.

The two halves are good engineering. The gate in particular is the shape the program says it wants everywhere — a self-enforcing mechanism that fails closed, rather than prose an agent must interpret.

## How well it is proven

**The producer: proven at scale, verified independently.** `progress.json` records `startedAt` 2026-08-09T15:24:17Z, `completedAt` 2026-08-11T13:27:52Z, 132 counties landed, `halted` null, 11,060,796 atoms written against 11,619,062 features, with verified equal to written in every landed row.

I checked the resume hole directly rather than trusting the summary. Unique counties in `attempted[]` is 132, `landed[]` is 132, and the set difference is empty. There is no hole. Three counties do appear in `failed[]` — 48277 failed an apply on a stale `@empressaio/atom-contract` export, 48265 and 48113 hit ECONNRESET at the fourth attempt — and all three subsequently landed with nonzero atom counts. That array is a retry log, not a gap.

I then queried both stores live rather than quoting the artifact. The atoms store holds 11,603,489 `parcel-node` atoms across 196 distinct counties. `txgio_parcel` holds 196 distinct counties. The producer has drained the fabric completely: 196 of 196.

**The consumer: dry-run only, never applied.** The single post-anchor artifact is `_inbox/2026-08-09_E3_elgin_builder_close_post_anchors.json`. Its verdict field reads `DRY_RUN_PASS_APPLY_HOLD` and `apply_executed` is false. The preflight found 499 anchors and passed 499 of 500 parcels, which proves the gate resolves real anchors correctly. But the run produced 75 `verifyPass` against 98 `verifyFail`, graded its own legacy parity `partial` rather than the zero-mismatch standard the lane had set for itself, and left `adversarial_checkpoint` at `pending`.

No promoting run has ever passed through this gate. Writing 11.6 million anchors that nothing has yet consumed under apply is a producer achievement, not a proven seam.

## The finding that needs acting on first

`gateWarmCohort` is called in exactly one of four warm runners.

| Warm runner | Calls the C1/C5 gate |
|---|---|
| `depth-warm-city-batch.mjs` (unified, engine #287) | yes, 2 call sites |
| `depth-warm-bastrop-batch.mjs` | no |
| `depth-warm-elgin-batch.mjs` | no |
| `depth-warm-caldwell-batch.mjs` | no |

All three ungated scripts remain on disk and remain runnable. More importantly, `90_runbooks/factory_onboarding_runbook.md` — status "active, planner-reviewed and promoted" — gives one of them as the verbatim command at Step Z10:

```
tsx scripts/depth-warm-elgin-batch.mjs --city-cohort --force-overwrite --promote --limit=10000
```

An operator following the promoted runbook literally will warm and promote parcels without the anchor check. A parcel with no anchor, a retired anchor pointing at deleted geometry, or a synthetic non-account key can be promoted as if its geometry were established. The fail-closed reconciliation cannot catch this, because on those paths it is never called.

The same runbook contains no parcel-node step anywhere. It never tells an operator to check for anchors or to mint them. The Elgin lane discovered this the expensive way, at 500 declines out of 500, and the procedure was never updated to reflect it. The runbook also still states, at open item 8 and again at Step Z10, that the registry-driven single warm runner is not shipped; it merged as engine #287 on 2026-08-09.

Fixing this is small: wire the gate into the three legacy scripts or delete them and finish the OPS-9 S4 consolidation, then correct Step Z10 and add the anchor prerequisite.

## What the retier to three factories changes

Less than it appears, because Factory 1.5 already exists as code. The acquisition tier the operator has just named is `lib/cad-ingest` in `legacy-design-tools` — `txgio/`, `address/`, `boundary/`, `nfhl/`, `orion/`, `pacs/`, `permits/` — which already finds, fetches, parses, projection-guards, and persists payloads with vintage provenance into `txgio_parcel`, `txgio_address`, and `cad_property`.

What does not exist is Factory 1.5 as a named tier with a queue, a slot posture of its own, and a close-artifact contract. Today acquisition is narrated as "L2 waves" and as a two-sentence "Stage 1 ACQUIRE" inside a county runbook. That framing is why its blockers surfaced one at a time — Harris multi-shp truncation, eight coastal holds, the 202505 vintage shipping EPSG:3857 while every other vintage ships degrees, Donley 404, the 4.46x rural seam factor — instead of as a backlog an operator could drain.

The honest finding here is the inverse of the usual one. The operator believes a tier is new when the code is already written but undocumented and unqueued.

The connector itself needs no rewrite. Because `write-parcel-node-county.mjs` reads its roster from store truth with no allowlist, the moment Factory 1.5 persists a new county's geometry the connector can drain it unchanged. The revision worth making is to convert the producer from "sweep a fixed queue file" to "drain the set of counties present in `txgio_parcel` but absent from `parcel-node` atoms" — a two-query diff the writer can compute itself, which as a side effect makes the resume hole structurally impossible.

What stays identical: the writer's dedup and identity semantics, the gate and invariant S3, the atom contract as the only inter-factory interface, the one-bulk-writer-per-database slot rule for atoms, dry-run-must-predict-apply, identical-engine-SHA pairing, write-then-verify on stored bytes, and the whole of Factory 2's county and city lanes.

One reclassification matters: acquisition is network-bound and infinitely parallel, so Factory 1.5 must not inherit the one-bulk-writer-per-database rule that correctly governs the connector's atom writes.

## Could a new state be onboarded today from documentation alone

No.

The good news first, because it is real and it should aim the remediation. Factory 2's engine core is clean. A grep for hardcoded `48`, `TX`, or `texas` across `packages/engine-core/src` returns zero hits outside explanatory comments, and the parcel-node module's only Texas mentions name Hays and Bastrop as examples in prose. Texas constants live in per-source adapter scripts under `engine-core/scripts`, which is exactly where OPS-14's design rule says they belong. The connector and the depth factory are portable.

The blockers are concentrated in the acquisition tier, and they are severe there.

**Source discovery has no procedure.** Texas is unusually easy: one agency publishes one statewide-normalized parcel schema at one URL template that resolves for 253 of 254 counties. OPS-1 records that finding thoroughly. Nothing anywhere describes the step that produces such a finding for a state without a TxGIO. Utah routes through UGRC, New Mexico through RGIS, Arizona through AZGeo, and Colorado plausibly has no statewide parcel authority at all — which would break the premise that defines Factory 1, that one source blankets a state. None of the four has been probed.

**A Texas coordinate assertion sits in the acquisition hot path and fails closed.** `assertTexasWgs84Bbox` at `lib/cad-ingest/src/txgio/parse.ts:185` throws on any bbox outside the Texas WGS84 envelope. It is called per feature at `parse.ts:584` and reused by the NFHL parser at `nfhl/parse.ts:145`. A Utah parcel is refused ingest by design. This is correct and valuable Texas behavior, and it is an absolute blocker for state two until the envelope comes from a registry row.

**Texas coupling is pervasive in that tier.** Twenty-six of forty-seven non-test TypeScript files under `lib/cad-ingest/src`, fifty-five percent, reference Texas, FIPS 48, or a texas.gov host. Hard instances include `boundary/service.ts` hardcoding `WHERE STATE='48'` against `feature.geographic.texas.gov`, `address/service.ts` pinning `stratmap_address_points_48_most_recent`, `boundary/parse.ts` defaulting `stateFips` to `"48"`, and `txgio/counties.ts` carrying a 254-entry statewide roster behind `isTexasCountyFips`. OPS-14's rule that no state constant may live in factory machinery is violated throughout the tier a new state must run first.

**There is no county-roster procedure.** The seam is anticipated in code — `stateFromFips` already maps 48 to TX, 49 to UT, 16 to ID — but nothing populates a roster for 49.

**The state template worksheet does not exist.** OPS-14 line 86 states that the W5 WDLL carries it. The W5 WDLL carries acceptance item 9, requiring a worksheet plus four UT/NM/CO/AZ recon notes, with an empty grade box. No worksheet and no recon note exists in the repository. Meanwhile `_inbox/2026-08-09_W5_program_close.json` declares the W5 program closed while every one of its twelve acceptance items remains ungraded and the finish card reads "(pending)". This is the one place in the set where a document asserts a deliverable that is not there, and it is precisely the "a status is a claim" failure the factory procedure warns about.

**There is no per-state cost model.** Commitment 3 gates per jurisdiction at under $200 compute plus an hour of review. Factory 1 and 1.5 costs are per state and roughly constant, which that gate cannot express. A second-state go/no-go cannot be priced from the documentation.

**There is no Factory 1.5 runbook at all.** Even with sources fully discovered, the acquisition procedure would have to be reverse-engineered from source comments and L2 wave reports.

## Runbook inventory

| Document | Covers | Last updated | Gradable | New-state ready |
|---|---|---|---|---|
| `90_runbooks/factory_onboarding_runbook.md` | Factory 2 | 2026-08-09 | yes | no |
| `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md` | connector (producer only) | 2026-08-11 | yes | no |
| `90_operations/OPS-2_county_onboarding_runbook.md` | Factory 2 | 2026-08-08 | no | no |
| `90_operations/OPS-1_texas_source_registry.md` | Factory 1.5 source inventory | 2026-08-08 | no | no |
| `90_operations/OPS-WDLL_the_factory.md` | done/broken/kill definition | 2026-08-03 | yes | no |
| `90_operations/OPS-14_texas_flush_game_plan.md` | program plan, names the joint | 2026-08-09 | yes | no |
| `_inbox/2026-08-09_W5_depth_factory_program_WDLL.md` | owns the state template | 2026-08-09 | yes (all boxes empty) | no |
| `90_operations/OPS-13_store_topology.md` | store truth | 2026-08-09 | no | no |
| `90_runbooks/product_surface_smoke_suite.md` | serve regression | 2026-08-05 | yes | no |
| `90_operations/OPS-INDEX_operator_manual.md` | front door | 2026-08-03 | no | no |

The most complete operational document is `factory_onboarding_runbook.md`: it carries verbatim commands, abort and fallback conditions, and explicit pass criteria, which makes it genuinely gradable. Its defects are the ungated warm command at Step Z10, the missing parcel-node prerequisite, and the stale claim that the unified warm runner has not shipped. Its correction blocks are also layered in a way that hurts a linear read — the 2026-08-04 planner correction to item 6 is itself corrected by a 2026-08-09 block that keeps the false original text directly above the correction, "for provenance."

`_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md` is the most accurate artifact in the set and should be promoted out of `_inbox`. Its gap is that it documents the producer exhaustively and never mentions the consumer gate, invariant S3, or the decline codes at all.

`OPS-INDEX`, declared the single entry point, indexes OPS-0 through OPS-7 and therefore now omits more than half the operations set, including the runbook that carries every verbatim command.

## Divergences between documented process and code

Named plainly, per the brief.

The runbook instructs an ungated warm command; the gate exists and is not on that path.

The runbook says the registry-driven single warm runner is not shipped; `depth-warm-city-batch.mjs` is on main and is the only gated runner.

OPS-14 says the W5 WDLL carries the state template worksheet; it carries an unchecked box pointing at a document that does not exist.

OPS-1 says the store holds 19 of 254 counties; live query returns 196.

OPS-1 says the engine reads none of the registry and uses hardcoded per-county adapters; `jurisdiction-registry.ts` now carries 16 frozen rows the engine does read, though the statewide Rail C matrix remains a `_scratch` JSON nothing loads.

OPS-2 Stage 4 retains "BCAD rings trusted, no scrub" inline above the correction establishing txgio as the truth frame.

`_STATE.md` and the factory procedure doc report the same verify fix as 56x and 575x respectively.

`_STATE.md` puts "132/132 counties" and "11,603,489 atoms across 195 counties" in one sentence; the runner wrote 11,060,796 across 132, and the store figure is 196 counties, not 195.

## Recommended order

Wire the C1/C5 gate into the three legacy warm scripts, or delete them, and correct Step Z10 plus add the anchor prerequisite. This closes a live correctness bypass on the documented path.

Commit `run_sweep.mjs` into `hauska-engine`, ideally generalized to take `--cli` and `--queue`. Five minutes of work protecting the program's most-cited ruling.

Check out `main` in `P:/hauska-engine` and record the SHA. It is on `sweep/fast-write`, behind 4, and this exact trap already cost a run.

Apply one gated Elgin cohort under the atoms slot with the adversarial review the E3 close still owes, so the consumer half stops being dry-run-only.

Write the Factory 1.5 runbook and give the tier a queue and a close-artifact contract.

Write the state template worksheet with four read-only GIS-posture recon notes for Utah, New Mexico, Colorado, and Arizona, and grade the W5 card honestly against what actually landed. Colorado is the one to probe first, because if it has no statewide parcel authority it refutes the Factory 1 premise and that is worth knowing before any of the rest is scoped.

Fix `write-special-district-fact-county.mjs` to verify stored bytes before its first apply. It is the only writer of nine that cannot fail its own verification.

## A naming note

Nothing in either repository or the doc set calls this a connector. In `doc_repo`, "connector" means the Revit, ArchiCAD, SketchUp, and SoftPlan host-connector program in the 41-band. This seam is called, across five different documents, the joint, the seam, parcel-node, Rail 1, and the C1/C5 warm preflight gate. Picking one name would have saved this investigation most of its search time and will save the next one the same.
