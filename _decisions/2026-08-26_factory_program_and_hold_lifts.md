---
decision_id: 2026-08-26_factory_program_and_hold_lifts
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - _decisions/2026-08-26_ingest_freeze_and_cloud_loader.md
  - _inbox/2026-08-26_factory_program_design.md
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-26_p81-review_close.json
  - _inbox/2026-08-25_factory_operating_instructions.md
  - 27a_jurisdiction_factory_engine_spec.md
  - _catalog/repo_intents.md
---

# Decision

The three factories (1.5 acquisition, 1 statewide fabric, 2 jurisdiction depth) plus serve propagation are rebuilt as **one machine, the Factory**, hosted on Cloud Run in `us-east4`, with its own store, its own repository, its own plan of record, and its own operator console, **Smart Site Factory**. The machine must be able to finish Texas to three finish lines, then take a state at a time (Utah, Colorado, New Mexico, California), with agents proposing each state's sources and adapter for operator approval, and maintain what it has built (drift detection, re-runs, defects to lanes with evidence).

Rulings that this decision records, each from the operator on 2026-08-26:

1. **Holds lifted.** CTX / national is no longer HELD; this program plans and executes multi-state work. The Bastrop QA condition does not gate the data path (it is cosmetic). The standing decision line "CTX / national HELD until Bastrop QA-done + operator go" is retired by this record. NO PRIVILEGED DATA and the Hauska spine rule stand.
2. **Own store.** A new Neon project for the Factory (staged sources per state with vintage, run ledger, leases, holds, defects, drift events, recipes, county and city manifests, score requests, adapter specs). Serving stores (`hauska_mcp` atoms, `neondb` serving tables, tile bucket) are published targets; serving never reads the Factory store. Nothing already completed regresses: existing atoms, coverage rows, snapshots, stamps, setback tables, and registry rows are adopted by import.
3. **Own repository.** `empressaioemail-tech/hauska-factory` holds the control plane and stations. Adapters stay in `legacy-design-tools` `lib/cad-ingest` re-tiered as Factory jobs; the twelve county writers and depth runners stay in `hauska-engine` and are invoked as jobs. Owning seat: property, registered in `_catalog/seat_register.json` with the worktree added when the repo exists. Repo creation is an operator or planner action on explicit go.
4. **Own plan of record.** `90_operations/OPS-19_factory_plan_of_record.md`, row prefix `F-`, registered in `_catalog/plan_registry.json`. Texas cleanup rows remain `P-` in OPS-16 and are referenced from F-rows; no row lives in two plans.
5. **Console placement.** Smart Site Factory is the Factory's operator console, a fresh app `apps/factory` in `hauska-map` on its own Vercel project and base URL. Command Center remains the spine console; PE remains the customer app. Three surfaces, never collapsed. The console is a thin reader and controller over machine-owned tables; it holds no state of its own.
6. **Staging before production.** A staging Smart Site that mirrors production (staging PE deployment, staging cortex-api revision, staging copies of the serving stores) lives under the Factory's base URL, and every publish lands on staging, passes the verify walk there, and only then runs against production with the identical job. Production is never the first place new data is seen.
7. **Tiles are fabric, not detail.** The statewide parcel PMTiles bake is the join proof (tile `parcel_node_id` equals the parcel-node atom id equals the CAD key) and belongs to the fabric station immediately after geometry is staged, before facts and depth. Facet bakes (tier 1, tier 2) are publish-time. The operator's original model (statewide tiles first, then attributes, then details) is the machine's order.
8. **Three finish lines for Texas complete.** County manifest (254 x rails) satisfied or honest-absent; city manifest (1,223 x rails, new) satisfied or honest-absent; a QA walk of known parcels on production Smart Site passes. Graded separately, never merged into one number.
9. **Proof counties.** Bexar 48029 cad remainder (43,257 atoms on the old shape) is the resume proof. Harris 48201 and Dallas 48113 are the scale proof, chosen because that is where the early efforts went off the rails. County order is otherwise not a ruling; the machine derives it.
10. **Sequencing inside the drain.** Batched links on the existing writer first, measured on the real table from `us-east4`; stage-and-merge only if that measurement says the merge phase is the bound (adversarial review 2026-08-26, accepted).

## Context

Two objectives with equal weight: finish Texas, and own the machine that finishes any state. The 2026-08-26 measurement showed the laptop drain at 21 atoms/s on a round-trip loop; the adversarial review of the first re-engineering program found six fatal design defects, all accepted. The operator then ruled for a clean slate: the previous attempts to manage the factory from Command Center failed, the store topology is a known hazard (two databases under four names, pooler writes, heavy scans against serving), and every prior speed-up added concurrency before understanding the path. The operator's expectation is stated plainly: build the Factory right, then the whole state runs through it on its own, and production never breaks because staging sees everything first.

## Structural commitment check

- Sell reasoning, not data: every published atom keeps provenance, hash, and edges; the run ledger adds who, when, from which source vintage.
- Confidence is earned: honest absence is a first-class cell state on both manifests; the verify walk is a live probe, never a build summary.
- Cost per jurisdiction: recorded per run; the operator removed the budget ceiling for the build but the number is still measured and reported.
- Dual interface: the console is internal; the customer surface is unchanged except by published data.
- Tenant sovereignty and no privileged data: unchanged; every adapter is public-record and must work for a state with no relationship.

## Reasoning

One machine instead of three hand-run lanes because the seams are where the defects lived: nobody owned publish, the Manifest could not see a starved edge, holds lived in a file anyone could skip, and evidence lived in `P:/tmp`. A fourth repository because the control plane is neither engine code nor product code and a clean history is cheaper than untangling one. A new store because the factory's heavy work must not contend with serving and because the current topology's hazards are documented and unresolved. Staging before production because the operator's stated fear is a production break, and the identical-job-two-targets shape makes "dry run predicts apply" true at the environment level. Agents propose per state because the Utah probe showed the nuance is in discovery (extent traps, non-uniform products), and one state at a time is how the recipe improves.

## Reversal criteria

- The Phase B drain measurement shows the serving database, not the path, is the bound at a rate that cannot finish Texas in the operator's horizon. Then `atoms` partitioning or a serving-store migration is opened as its own ADR before Phase D.
- The staging mirror cannot be made faithful (a class of defect that only appears on production). Then staging is narrowed to what it can prove and the gap is named as a defect class on the manifest, not hidden.
- Discovery agents on Utah fail to produce an adapter spec that an engineer can build without re-probing. Then discovery reverts to engineer-led with the agent output as a brief.
- The operator names a return to laptop runs. That is a recorded break-glass run, not a reversal.

## Dependencies

Depends on: this decision; the adversarial review dispositions in `_inbox/2026-08-26_p81-review_close.json`; the existing writers, scorers, parsers, and runners as the operated artifacts; GCP project `hauska-prod-497015`; a new Neon project; Vercel for the console and staging PE.

Unblocks: OPS-19 rows F-01 onward; the revised drain (P-81 through P-84 as the Texas drain rows referenced by the fabric station); Texas cleanup on the new machine; Utah discovery.

Does not unblock: any write to `smartcity-os` (still no-touch); Factory 2 zoning work outside the recipes it already has; a customer-facing rebrand of anything.
