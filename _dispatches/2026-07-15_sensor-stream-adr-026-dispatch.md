---
id: dispatches/2026-07-15_sensor-stream-adr-026-dispatch
title: Dispatch — author ADR-026, sensor and telemetry stream atoms
status: ready-to-dispatch
date: 2026-07-15
applies_to: doc_repo planning agent (ADR authoring; no product code)
related: [80_adrs/adr_022_deal_twin_and_cross_application_capture, 80_adrs/adr_013_procedure_execution_atoms, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_017_atom_access_control, 25_atom_architecture_reference, _research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT]
owner: nick
---

# Dispatch: author ADR-026 — sensor and telemetry stream atoms

## What this is

A work order to draft the sensor/telemetry stream contract ADR. The 2026-07-02 deep review (`_research/2026-07-02_ai_native_and_twin_review.md`, section 4) named live sensor streams "the one genuinely new contract affordance" in the twin architecture and said they "warrant their own small ADR when built." Two independent demands have now landed on the same missing shape, which is what promotes it from parked to worth authoring:

1. **The place spine's operational twin.** ADR-022's deal object extended past closing into owned-and-operating (the Mox pattern: HVAC faults, utility telemetry, vehicle telemetry as tenant-private overlay atoms on a shared property node). The Mox custom build already surfaces live unit-level events; none of that capture has an atom-contract-native shape.
2. **The human twin spine exploration** (`_inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT.md`, parked). Its capture layer (laser timing gates, wearables, video-derived measurements) is the identical three-tier shape plus a verification-tier vocabulary. The ADR should make the shape general enough that the human spine could adopt it later without contract rework, while activating nothing.

There is also a third, already-live validation case: the engine consumes public government sensor networks today (USGS NWIS gauges, and the SGMC/Edwards feeds repaired in the 2026-07-13 wave). Those are public sensor streams being flattened into ad-hoc reads with no first-class stream contract. ADR-026 should cover them as the `public-free` end of the same model.

**Deliverable: one ADR, filed as proposed. No product code, no migrations, no new workstream activation.**

## The starting shape (from DR-3; the ADR refines or overturns with reasoning)

Three tiers, honoring the point-to / embed-with rule (the raw stream is a source-of-truth document analog, never embedded):

1. **Sensor-identity atom.** The device or feed as a first-class provenanced entity: type, what it is attached to (parcel, unit, vehicle, person, or an external network like a USGS gauge), ownership, calibration/certification state, accessPolicy. Likely an actor-atom (ADR-015) extension or sibling.
2. **Referenced external time-series.** Raw readings live outside the atom graph in a time-series store, referenced by pointer with content-addressed windows or checkpoints for verifiability. Never one atom per reading; ADR-011's rejection of per-edit on-chain writes is the direct precedent for why per-reading minting is rejected on cost and identity-churn grounds.
3. **Derived-event atoms.** Minted claims extracted from the stream (threshold crossing, HVAC fault, a timing-gate split, a gauge flood-stage exceedance), carrying provenance that points at the sensor-identity atom, the stream window, and the extraction method, stamped with confidence and attestation metadata.

## Decisions the ADR must take

1. **Atom family shape.** New `sensor-*` family vs extensions of actor + procedure-execution atoms. Name the schema additions and the conformance impact on the published contract (verify the live version on npm before writing version claims; do not trust doc headlines).
2. **Stream reference contract.** What the pointer contains (store URI, window addressing, checkpoint hashing), and what the contract guarantees vs what the store implementation owns. The ADR decides the contract shape, not the store product; it may list candidate stores but must keep the contract store-agnostic.
3. **Storage placement principle.** Where a time-series store lives is decided against the spine-vs-BFF target topology (ADR-008/56 decoupling), not against where capture happens today. State the placement rule; do not pin a service.
4. **accessPolicy per tier.** Sensor-identity, raw stream, and derived events can carry different policies (example: tenant-private stream, tenant-shared derived events; public-free for the USGS case). Show the matrix across the three validation cases.
5. **Bitemporal mapping.** `observedAt` = reading/window time, `atomizedAt` = mint time; state how windows version.
6. **Attestation and verification metadata.** A general attestation slot (who or what vouches: device identity + calibration state, human operator, model inference) sufficient for the human spine's T0–T3 verification tiers to layer on later as a domain vocabulary, without contract change. Do not import the human-spine tiers themselves into the core contract.
7. **Derivation provenance.** How a derived-event atom cites its extraction (method, model/version if inferred, window hash) so commitment #1 (reasoning chain, source, confidence, timestamp) holds for machine-derived claims.
8. **Cost discipline.** Windowing/batching rules that keep minting bounded; name the cost-per-stream-onboarded discipline analogous to the jurisdiction cost rule.

## Validation cases (the ADR passes only if all three fit on paper)

| Case | Source | accessPolicy posture | Derived-event example |
|---|---|---|---|
| Mox operational overlay | Unit HVAC/utility/vehicle telemetry | tenant-private stream; tenant-private or tenant-shared events | "Unit 4B HVAC fault, 2026-07-10, device-attested" |
| Public sensor networks (live today) | USGS NWIS gauge, Edwards/SGMC | public-free end to end | "Gauge X crossed flood stage at T" |
| Human twin capture (parked) | Laser timing gate at a certified combine | subject-private stream; consent-gated events | "Athlete ran 1.78s 10-yard split, T2 device-attested" |

## Constraints and non-goals

- ADR only. No engine code, no migrations, no MCP tools, no store provisioning.
- Does not activate the human twin spine; that doc stays parked with its own entry criteria. The human case is a paper validation target, nothing more.
- No streaming-infrastructure design (brokers, protocols, ingestion pipelines) beyond what the contract shape requires.
- Follow `01_doc_conventions.md` and the decision-log ADR format: context, decision, alternatives considered with rejection reasoning, consequences, reversal criteria. Frontmatter per conventions. Status `proposed`; Nick accepts.
- No em dashes in doc body prose. No duration estimates.
- Source-required discipline: every claim about current engine/contract state traces to a file read or live `gh`/`npm` output this session, not to CLAUDE.md headlines.

## Read-first list for the authoring agent

1. `_research/2026-07-02_ai_native_and_twin_review.md` (sections 2 and 4: point-to/embed-with rule, three-tier sketch)
2. `80_adrs/adr_022_deal_twin_and_cross_application_capture.md` (the lifecycle this extends)
3. `80_adrs/adr_013_procedure_execution_atoms.md` and `80_adrs/adr_015_actor_atoms.md` (candidate base types)
4. `80_adrs/adr_011_atom_identity_across_versions.md` (per-edit rejection precedent) and `80_adrs/adr_017_atom_access_control.md` (five-value accessPolicy)
5. `25_atom_architecture_reference.md` section 6 (reference-not-containment)
6. Engine repo: the NWIS/SGMC/Edwards adapter paths (how public gauge feeds are consumed today), plus the contract package for current schema and version
7. `_inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT.md` section 3 (the human-capture demand, for the validation table only)

## Acceptance criteria

1. `80_adrs/adr_026_sensor_stream_atoms.md` filed, status proposed, all eight decisions above taken with reasoning and alternatives.
2. The three validation cases each walked end to end (capture, reference, derive, gate) in the ADR's consequences section.
3. Conformance impact on the published contract stated against the live npm version, with the change classed (minor vs major).
4. Reversal criteria named.
5. A one-paragraph follow-on-build list (what would be built first if accepted: likely the Mox overlay leg), explicitly marked not-dispatched.
