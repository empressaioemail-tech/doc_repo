---
decision_id: 2026-09-06_boundary_envelope_atom_program_scope
date: 2026-09-06
owner: operator
status: active
related_canonical:
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _inbox/2026-09-06_ctx-wrapup-engine_boundary-envelope-pilot_close
  - _inbox/2026-09-05_smart-site-architecture-diagram_gaps
---

## Decision

The `property-boundary-edge` / `buildable-envelope` atom program is scoped as its
own, self-contained effort — separate from atomizing the rest of the parcel_record
ledger's 65 rails, which is deliberately deferred as its own future card (see
"Full ledger atomization" below). This record captures the scope as understood
immediately after the 2026-09-05/06 pilot, before the conversation's context is
lost.

## Program components

| # | Component | What it requires | Why it's needed | Status |
|---|---|---|---|---|
| 1 | Parcel succession/refresh mechanism | New engineering — detect when a parcel is re-platted/renumbered (a "succession matcher"), cascade staleness to downstream atoms | Without it, every backfill decays silently. Confirmed: 92.7% of Bastrop's existing `buildable-envelope` atoms are already stale this exact way, and the store doesn't know it | Not started. Confirmed no path exists today, not even manual, by design (`reconcile-county-parcel-nodes.ts`'s own header) |
| 2 | Shared reader — retire the second, independent implementation | Rewire `legacy-design-tools`'s `buildableEnvelope/derive.ts` to read the atom chain instead of independently re-deriving from raw geometry + its own setback-table logic | Confirmed: MCP-facing `cortex-api` does not consume the engine's atom at all today. A full atom backfill would not by itself fix MCP parity, and two independent implementations is exactly the drift risk the atom-first architecture exists to prevent | Not started. Confirmed via direct read of `derive.ts` and its real production caller |
| 3 | Third-defect audit | Check whether `derive.ts`'s default `roadClassSetbackTableForJurisdiction` call can still produce a road-class-derived setback value — the exact defect class already retired on the engine side (commit `293633a`) | Flagged, not confirmed either way — a real open question for whoever picks up item 2 | Flagged only |
| 4 | Lockhart spatial join | Build a real parcel-to-zoning-district join; today's registry row points at a 244-feature polygon layer with no `prop_id` and no fallback join anywhere in `zoning-staging/registry.ts` | Not stale — structurally unimplemented. Confirmed the ledger's own `zoningDistrict` data for Lockhart is fine (6,456 real values); this is strictly an atom-pipeline gap | Scoping only |
| 5 | Travis join-key implementation | Build the `geo_id_or_address_crosswalk` `JoinKey` strategy — a type declaration exists and names Travis by comment, zero code implements it anywhere in engine-core | Travis's real `prop_id` bad-rate (51%) makes the default join unsafe. Confirmed the ledger's own CAD data for Travis is fine (0 unaccounted); strictly an atom-pipeline gap | Scoping only. TCAD live count (386,682) re-verified current; StratMap-side count (~834,936 last known) not re-checked, divergence likely still open |
| 6 | Hays / McLennan / Williamson in-city onboarding | From-scratch GIS source recon + ordinance transcription, same scale as the original Bastrop/Elgin/Lockhart build | Confirmed: these three have real, substantial `zoningDistrict` ledger data already (49,655 / 53,365 / 167,732 real values respectively) — the gap is specifically setback-*value* resolution (needs a live per-parcel record or codified table), which the ledger's zoning classification alone doesn't provide | Scoping only |
| 7 | Preflight re-validation | Re-run and fix the existing 8-check `onboard-preflight` gate against current reality | Confirmed stale — last touched 2026-08-05/08, a full month before ADR-031 was ratified (2026-09-03) | Not started |
| 8 | Rebake/publish trigger verification | Confirm whether `legacy-design-tools`'s facet-bake process (`nodeFacetBakeTier1`/`Tier2`) needs to explicitly re-run to pick up freshly-minted atoms, or reads them live | Found real precedent for the concern: Tier-1's own code comment describes an earlier "anti-zombie cut" retiring its own independent envelope computation in favor of deferring to the atom chain — implying baking is a separate step from emission, the same "correct in the store, not yet served" pattern found elsewhere in this sprint | Not started — flagged, not verified |
| 9 | Per-county atom backfill | The actual production run, once 1–8 are done or explicitly accepted as risk | The "final mile" — looked simple at pilot start, turned out to depend on everything above | Not started |

## End result

Durable, atom-backed buildable envelopes rendering correctly in both Property
Explorer and the MCP app, across all 6 CTX counties, through one shared reader
rather than two independently-drifting implementations, with a real mechanism
keeping coverage current as parcels change — not a one-time fill that quietly
rots the way Bastrop's already has.

## Full ledger atomization — explicitly out of scope here

ADR-031 already anticipated a "CTX atom-backfill card" as an open decision, not
yet opened at the time it was ratified. This program (items 1–9 above) opens
that card, scoped narrowly to the `property-boundary-edge`/`buildable-envelope`
rail-family. The remaining ~63 rails' relationship to the atom estate is
deliberately NOT addressed here. Rationale, per the operator's own instinct
mid-scoping: doing one rail-family well first — including building the shared
reader and the succession mechanism, both reusable infrastructure — makes every
subsequent rail-family's atomization cheaper and safer than attempting a single
undifferentiated sweep. ADR-031 itself is designed for exactly this: rails
migrate to atom-served individually, coexisting for as long as the slates take.

A separate card should be opened when this program is far enough along to
inform it, naming: which rails atomize next, whether the succession/refresh
mechanism built for boundary/envelope generalizes to other rail-families
unchanged, and whether the shared-reader principle (item 2) should become a
standing architectural rule enforced across all rails, not a one-off fix.

## Reasoning

Every item above is backed by a direct verification during the 2026-09-05/06
pilot, not an assumption — see the pilot close doc
(`_inbox/2026-09-06_ctx-wrapup-engine_boundary-envelope-pilot_close.json`) for
the full evidence trail. The scope grew substantially from the operator's
original framing (a handful of stale registry rows to refresh) as each layer
was independently checked against live sources rather than trusted from
config or memory — exactly the discipline this whole sprint has depended on.

## Reversal criteria

If profiling (see the parallel compute-bottleneck investigation) finds the
shared Neon compute cannot sustain a real backfill's throughput regardless of
concurrency fixes, this program's sequencing may need to invert — fixing
throughput before item 9 becomes viable at all, not after.

## Dependencies

Cross-repo: hauska-engine (items 1, 7, 9 and the underlying computation),
legacy-design-tools (items 2, 3, 8), hauska-factory (item 6's McLennan
zoningDistrict sub-finding shares a mechanism with this program but is
ledger-side, not atom-side — tracked separately in OPS-19b's successor
thread). Depends on the compute-bottleneck investigation (dispatched
2026-09-06) for a realistic throughput estimate on item 9.

## Counterparties

Internal: Engine lane (`cente-67`), Factory lane (`cente-b5`), LDT ownership
(not yet dispatched — items 2/3/8 need an LDT-side lane), operator (ruling,
scope confirmation).

## Execution log (2026-09-06, operator go-ahead on full sequencing)

Operator reviewed the full program plus a parallel factory-health thread
(zombie/orphan process audit, compute-bottleneck investigation) that
surfaced from the same scoping conversation, and ruled on sequencing and
staffing for both together. Recorded here so the plan survives context loss.

**Ruling: Program 2 (factory health) is a partial, not full, prerequisite
for Program 1.** The compute-bottleneck/throughput thread gates Program 1's
real backfill execution (item 9) directly — running a volume backfill
against a compute known to be degraded just reproduces the same pain at
scale. The zombie/orphan-process cleanup does not block Program 1's design
work (items 1-3, 7-8) but should substantially complete before Program 1
ships for real, per the operator's own standing concern about residual
processes from prior factory rebuild attempts causing confusion.

**Staffing, as of this entry:**
- Engine (`cente-67`): expanded zombie audit covering `hauska-engine`'s own
  `packages/engine-core/scripts/` (real evidence per script, not guessing
  from names); real per-county sample-atom batches (see below); scoping
  Lockhart's spatial join and Travis's join-key implementation as bounded
  engineering tasks.
- Factory (`cente-b5`): decommissioning the 8 confirmed-zombie Cloud Run
  jobs with a real close-doc audit trail; the two deferred bottleneck test
  items (falsify the one-heavy-op-at-a-time rule; re-measure atoms/s
  throughput) bundled with Engine's sample-batch work since both need real
  compute time against the same live stores — coordinated to avoid
  confounding either measurement.
- LDT (new lane, operator opening a session): item 2 (the shared-reader
  fix — rewire `buildableEnvelope/derive.ts` to actually consume the atom
  chain instead of independently re-deriving) is the priority item, not
  deferred further. Item 3 (the possible road-class-defect echo) and the
  LDT-side portion of the zombie audit (Tier-1/Tier-2 bake chain,
  `cortex-api`) are the same lane's other work.

**Real per-county sample-batch sequencing — corrects an earlier gap.** Only
Bastrop ran in the original pilot; the operator asked for a batch per
county and did not get one. Real, currently-runnable sequencing:
Bastrop/Elgin already piloted; Caldwell/Hays/McLennan/Williamson each have
a real, working unincorporated/rural registry row and can run a real
dry-run sample batch immediately, exercising the legitimate not-applicable
coverage path and producing real per-county timing data; Lockhart and
Travis are blocked on real, not-yet-built code (a spatial join and a
join-key implementation respectively) and cannot run a sample until that
lands.

**Operator instruction applied throughout**: lane planners may use their
own sub-agents to cover ground in parallel where independent (e.g., one
sub-agent per ready-now county's dry-run batch) — the lane planner reviews
and commits, sub-agents do not. Every write-shaped action (zombie
decommission, sample-batch apply, any code merge) keeps the same
dry-run-first, canary-then-shift, independently-verified discipline used
for every real change tonight. No production regression tolerated as a
tradeoff for speed.
