---
id: adr_026_sensor_stream_atoms
title: ADR-026 — Sensor and telemetry stream atoms
status: proposed
last_updated: 2026-07-15
applies_to: portfolio
related: [adr_022_deal_twin_and_cross_application_capture, adr_013_procedure_execution_atoms, adr_015_actor_atoms, adr_011_atom_identity_across_versions, adr_017_atom_access_control, 25_atom_architecture_reference, _research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT]
owner: nick
---

# ADR-026 — Sensor and telemetry stream atoms

## Status

Proposed 2026-07-15. Originated from the 2026-07-15 dispatch (`_dispatches/2026-07-15_sensor-stream-adr-026-dispatch.md`), which promotes the sensor-stream contract from parked to worth authoring because two independent demands landed on the same missing shape. This ADR settles the contract shape only. No engine code, no migrations, no MCP tools, no store provisioning, no workstream activation. The human twin spine stays parked as a paper validation case; nothing here starts it. Nick accepts.

## Context

The 2026-07-02 deep review (`_research/2026-07-02_ai_native_and_twin_review.md`, section 4) named live sensor streams the one genuinely new contract affordance in the twin architecture and said they warrant their own small ADR when built. Three demands have now converged on the same missing shape, which is what promotes it.

The first is the place spine's operational twin. ADR-022 extended the deal object past closing into owned-and-operating, the Mox pattern, where HVAC faults, utility telemetry, and vehicle telemetry are tenant-private overlay atoms on a shared property node. The Mox custom build already surfaces live unit-level events, and none of that capture has an atom-contract-native shape. The document-ingest pipeline covers utility bills and BIM as typed atoms, but a live event stream is not a document.

The second is the human twin spine exploration (`_inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT.md`, parked). Its capture layer of laser timing gates, wearables, and video-derived measurements is the identical three-tier shape plus a verification-tier vocabulary (its T0 through T3 tiers). That doc's own section 7 names the sensor-stream ADR as the one piece of the human-spine exercise with direct value to the existing portfolio even if the rest stays parked, because the place spine's operational twin consumes the same shape. This ADR must make the shape general enough that the human spine could adopt it later without contract rework, while activating nothing.

The third demand is already live in the engine today. Verified this session against the engine repo, the NWIS groundwater adapter (`packages/adapters/src/federal/usgs-groundwater.ts`) reads the NWIS instantaneous-values service, parses the upstream `timeSeries` envelope, takes the single latest depth-to-water value with its `dateTime`, and flattens it into a one-shot `AdapterResult` payload keyed to a parcel read. The TCEQ Edwards Aquifer adapter (`packages/adapters/src/state/texas.ts`) reads recharge and contributing zone polygons the same one-shot way. A grep across `packages/` found no time-series, sensor-identity, or telemetry atom type anywhere in the engine. These are public government sensor networks being consumed as ad-hoc reads with no first-class stream contract. ADR-026 should cover them as the `public-free` end of the same model.

What the atom contract does not capture as first-class today is a persistent sensor as an entity, a raw reading history that is verifiable without minting an atom per reading, and a derived claim that cites the sensor plus the window plus the extraction method. Provenance today is per-atom (sourceAdapter, contentHash, fetchedAt per ADR-001), identity is a DID resolving to a per-version CID (ADR-011), and accessPolicy is a five-value gate (ADR-017). None of those primitives has a stream-shaped consumer.

## Decision

Introduce a three-tier sensor-stream contract that honors the point-to versus embed-with rule from the 2026-07-02 review section 2: the raw stream is a source-of-truth document analog and is never embedded in an atom, only pointed at. The three tiers are a sensor-identity atom, a referenced external time-series, and derived-event atoms. Eight decisions follow.

### Decision 1 — Atom family shape

Add a new `sensor-*` family with two new atom types plus reuse of one existing type, rather than overloading actor and procedure-execution atoms alone.

The sensor or feed itself is a new `sensor-record` atom type modeled as an extension of the actor-record atom (ADR-015) rather than a sibling family. A sensor is an actor in the audit sense: it is a non-human entity that produces claims, it has an identity, a trust level, and a producing surface, and derived-event provenance needs to terminate at it exactly as procedure-execution provenance terminates at an actor. The `sensor-record` reuses actor-record's `actorId`, `trustLevel`, and the agent-shaped conditional fields, and adds a sensor discriminator plus sensor-specific fields: `sensorType` (the device or feed class), `attachedTo` (a typed link to the node it observes, whether parcel, unit, vehicle, person, or an external network like a USGS gauge), `ownership`, `calibrationState`, and `certificationState`. Modeling the sensor as an actor-record extension means the existing access-control and identity machinery apply without a new registry primitive, and the audit graph stays uniform.

The derived claim is a new `derived-event` atom type. It is genuinely new because it is neither an actor nor a procedure execution: it is a data claim extracted from a stream window, carrying its own confidence and attestation. It does reuse the procedure-execution pattern (ADR-013) for its extraction provenance (decision 7), but a derived event is a first-class data atom in its own right, queryable as a claim, not as an execution record.

The referenced external time-series is not an atom at all. It is a pointer held on the atoms of the other two tiers (decision 2). This is the load-bearing choice: the raw reading history lives outside the atom graph.

Conformance impact and change class are stated in decision 1's companion section below and in the dedicated conformance section. In short: two new optional atom types plus an extension of an existing one, all additive, classed minor against the live contract.

Alternatives considered are recorded in the Alternatives section. The rejected option here is extending actor plus procedure-execution atoms only, with derived claims carried as procedure-execution outputs. Rejected because a threshold crossing or a flood-stage exceedance is a claim about the world, not a record of a run, and forcing it into procedure-execution would make every downstream consumer of derived events walk execution records to reconstruct claims, the same scan-and-aggregate anti-pattern ADR-015 rejected for actors. Reversal criterion: if `derived-event` proves to duplicate procedure-execution semantics in practice with no distinct query surface, collapse it into a procedure-execution subtype at the next major bump.

### Decision 2 — Stream reference contract

The pointer to the raw time-series is a `streamRef` structure carried on the `sensor-record` atom (identifying the feed) and cited by each `derived-event` atom (identifying the exact window the claim came from). The `streamRef` contains a store URI (an opaque, store-agnostic locator), a window addressing scheme (a start and end in the stream's own time domain plus a stream identifier, so a window is nameable without reading it), and a checkpoint hash (a content hash over the readings inside a window, computed at derivation time, so a derived event can be verified against the exact bytes it was derived from later).

The contract guarantees three things: that a `streamRef` names a window unambiguously, that the checkpoint hash lets any holder verify the window content has not changed since derivation, and that the sensor-record's identity chains the window to a provenanced feed. The contract does not guarantee retention, latency, replayability, or the physical layout of the store. Those belong to the store implementation. The contract is store-agnostic on purpose: candidate stores include a Postgres time-series extension, an object-store window-file layout, or a purpose-built time-series database, but the ADR pins none of them. The checkpoint-hash design is what makes verifiability a contract property rather than a store property, so the store can change without breaking the atoms that point at it.

Alternative rejected: embedding readings directly in the atom (embed-with). Rejected on the point-to versus embed-with rule. A raw reading history is not small born-digital text that is itself the unit of meaning; it is a source-of-truth series from which claims are extracted, which is exactly the point-to case. Embedding would also make the sensor-record atom churn on every reading, tripping the ADR-011 per-edit cost objection at reading frequency.

### Decision 3 — Storage placement principle

Where the time-series store physically lives is decided against the spine-versus-BFF target topology (the ADR-008 and doc-56 decoupling), not against where capture happens today. The rule: the time-series store is spine substrate when the stream feeds durable, provenanced, potentially shared reasoning (the derived events become atoms on the shared graph), and it is BFF-local only when the raw series is ephemeral capture that never produces a spine atom. The Mox custom build surfaces events today at the product surface, but the placement decision is where the durable store belongs in the target topology, which is spine-side behind the gate, because derived events are provenanced atoms that must be gated uniformly with the rest of the graph.

This ADR states the placement rule and does not pin a service. It is rail-quiet about output exposure (which surface shows a stream) while being explicit that durable storage is spine-side. The reasoning follows the recorded portfolio rule to decide substrate placement against the target topology, not against where capture lives now.

Reversal criterion: if a spine-side time-series store proves to be a cost or operational burden disproportionate to the derived-event value, a stream may be demoted to BFF-local capture with only its derived events promoted to the spine, provided the checkpoint-hash verifiability contract is preserved on those events.

### Decision 4 — accessPolicy per tier

Each of the three tiers carries its own accessPolicy (ADR-017, five-value union), and the three need not match. The sensor-identity atom, the raw stream reference, and the derived events are independently gated, which is what lets a private stream produce shared derived events or a public feed produce public events end to end. The matrix across the three validation cases:

| Case | sensor-record | raw stream (via streamRef) | derived-event |
|---|---|---|---|
| Mox operational overlay | tenant-private | tenant-private | tenant-private or tenant-shared |
| Public sensor networks (USGS NWIS, TCEQ Edwards) | public-free | public-free | public-free |
| Human twin capture (parked) | subject-private (tenant-private partition) | subject-private | consent-gated (tenant-shared with a consent-grant, or tenant-private) |

The default when a stream's accessPolicy is unspecified follows the ADR-017 open decision: tenant-private with the creating actor's tenant as scope, which is the safe default for any operational stream. The public feeds are the deliberate exception and must be stamped public-free explicitly.

### Decision 5 — Bitemporal mapping

The existing observedAt and atomizedAt model (ADR-001, section 7 of the atom architecture reference) maps cleanly. On a `derived-event` atom, `observedAt` is the reading or window time (the moment in the physical world the claim is about, taken from the stream's own time domain), and `atomizedAt` is the mint time (when the derived event entered the graph). On a `sensor-record` atom, `observedAt` is the sensor's installation or feed-registration time and `atomizedAt` is when the sensor was atomized.

Windows version by content, not by mutation. A window is identified by its addressing plus its checkpoint hash, so a corrected or extended window is a new window with a new hash and a new derived event that supersedes the prior one through the normal DID-to-CID versioning (ADR-011), never an in-place edit of a reading. This preserves the append-only discipline: what was derived from a window at a time stays derivable and verifiable even after the window is corrected upstream, because the old checkpoint hash still names the old bytes.

### Decision 6 — Attestation and verification metadata

Add a general `attestation` slot to the `derived-event` atom and to the `sensor-record` atom. The slot names who or what vouches for the claim or the sensor: it carries an attester identity (an actor-record link, which may be a device via its sensor-record, a human operator, or a model), what is being vouched for, the attester's state at attestation time (for a device, its calibration and certification state; for a model, its version), and an optional signature.

The slot is a general vocabulary, not the human spine's tiers. The human spine's T0 through T3 verification tiers (self-reported, operator hand-timed, certified-device timed, multi-sensor or video corroborated) are a domain vocabulary that layers on top of this slot later as an enum on the attestation, without any contract change. This ADR deliberately does not import T0 through T3 into the core contract. The core contract carries the general attestation shape; a domain (athletics, or later any other) supplies its own tier vocabulary as attestation metadata. That is what satisfies the dispatch requirement that the human spine adopt this later without contract rework while activating nothing now.

Reversal criterion: if the attestation slot proves too loose to enforce anything useful and every domain reinvents the same three or four tiers, promote a small shared tier enum into the core contract at the next minor bump.

### Decision 7 — Derivation provenance

A `derived-event` atom cites its extraction so commitment 1 (reasoning chain, source citation, confidence, timestamp) holds for machine-derived claims. The derived event carries a derivation block: the extraction method identifier, the model and version if the extraction was inferred rather than a deterministic threshold, the `streamRef` window (store URI, window addressing, checkpoint hash from decision 2) the claim was derived from, and a link to the `sensor-record` that produced the readings. This reuses the procedure-execution pattern (ADR-013): the extraction run is itself a procedure-execution atom when it materially mints derived events, with the derived events as its `outputAtomCids` and the stream window recorded in `runMetadata`. The derived event then chains back to that execution.

The result is that a derived event answers all four commitment-1 questions natively: reasoning chain (the derivation block plus the procedure-execution), source citation (the sensor-record plus the checkpoint-hashed window), confidence (the widthed confidence field, asserted-baseline at mint, earned over time by the existing calibration loop against outcomes), and timestamp (observedAt for the reading, atomizedAt for the mint). A deterministic threshold crossing carries a method identifier and no model; an inferred event (a video-derived split, an anomaly classifier) carries the model and version so the inference is never presented as a direct measurement. This is the same discipline as the confidence commitment: an inferred number is labeled as inferred.

### Decision 8 — Cost discipline

Minting is bounded by windowing and batching rules, and there is a cost-per-stream-onboarded discipline analogous to the cost-per-jurisdiction rule. Per-reading minting is rejected outright, the direct precedent being ADR-011's rejection of per-edit on-chain writes on cost and identity-churn grounds: a gauge reporting every fifteen minutes, or a wearable at sensor cadence, would churn the graph if each reading minted. Instead, only derived events mint atoms, and only when a claim crosses a materiality threshold (a fault, a stage exceedance, a split, a state change), which is the same discipline gate ADR-013 applies to procedure-execution atoms (ephemeral passes that materialize nothing do not qualify).

The windowing rule: raw readings accumulate in the time-series store and are addressed by window; a derived event is minted per material claim over a window, never per reading, and aggregations over a window (a daily summary) are single derived events, not one per constituent reading. The cost-per-stream-onboarded discipline mirrors the jurisdiction rule: a target compute-plus-review budget per new stream feed onboarded, with a checkpoint that flags any feed whose derived-event volume or extraction compute exceeds the target for engineering review before it scales. The exact number is set at first build against the Mox leg, not asserted here.

## Alternatives considered

New `sensor-*` family versus extensions of actor plus procedure-execution atoms only. The chosen path is a hybrid: sensor-record extends actor-record, the extraction run reuses procedure-execution, and only `derived-event` is a genuinely new type. Pure extension (no new type, derived claims carried as procedure-execution outputs) was rejected because a derived claim is a claim about the world, not a run record, and consumers querying claims should not have to walk execution records to find them. Pure new family (three brand-new sibling types with no reuse) was rejected because it duplicates actor identity and execution provenance the contract already models, inflating registry surface and breaking audit uniformity.

Embedding raw readings in the atom (embed-with) versus pointing at an external time-series (point-to). Rejected embed-with per the 2026-07-02 point-to rule and the ADR-011 per-edit cost objection: a reading history is a source-of-truth series, not a small born-digital text fragment, and embedding churns identity at reading frequency.

Per-reading atom minting versus windowed derived-event minting. Rejected per-reading minting on the ADR-011 per-edit precedent and the ADR-013 discipline gate. Only material derived claims mint.

Pinning a specific time-series store versus a store-agnostic reference contract. Rejected pinning a store because the placement rule (decision 3) turns on the spine-versus-BFF topology and the store may legitimately differ per stream; the checkpoint-hash design makes verifiability a contract property so the store can change without breaking atoms.

Importing the human spine's T0 through T3 tiers into the core contract versus a general attestation slot. Rejected importing the tiers because it would bind the core contract to one domain's vocabulary; the general slot lets the human spine (and any other domain) supply its tiers as metadata without contract change, which is the dispatch's explicit requirement.

## Consequences

The three validation cases each walk end to end (capture, reference, derive, gate).

Mox operational overlay. Capture: a unit HVAC controller feed is registered as a `sensor-record` with `sensorType` HVAC-controller, `attachedTo` the Mox unit node (which hangs off the shared property node per ADR-022), `ownership` Mox, and accessPolicy tenant-private. Reference: raw controller readings land in the spine-side time-series store (decision 3, spine substrate because they feed durable tenant intelligence); the sensor-record carries the `streamRef` to that feed. Derive: when a fault condition crosses threshold, an extraction run (procedure-execution) mints a `derived-event` "Unit 4B HVAC fault, 2026-07-10" with a derivation block citing the deterministic fault method, the checkpoint-hashed window, and the HVAC sensor-record, an `attestation` of device-attested with the controller's calibration state, observedAt the fault time, atomizedAt the mint time, widthed confidence at asserted baseline, accessPolicy tenant-private (or tenant-shared if Mox opts a benchmark cohort in). Gate: the derived event is filtered at the gate to Mox and Hauska only; only anonymized aggregate signal ever feeds public-code calibration, honoring the ADR-022 sovereignty gate and the tenant-sovereignty rule. Nothing pools.

Public sensor networks, live today. Capture: the USGS NWIS gauge (or the TCEQ Edwards feed) is registered as a `sensor-record` with `sensorType` usgs-nwis-gauge, `attachedTo` the external-network node, `ownership` USGS, accessPolicy public-free. This is the shape the engine's current one-shot `usgs-groundwater.ts` flatten does not have. Reference: the NWIS instantaneous-values series is the external time-series; the sensor-record's `streamRef` points at it with window addressing over the reading `dateTime` domain, and a checkpoint hash over each window read. Derive: when a window crosses flood stage, a deterministic extraction run mints a `derived-event` "Gauge X crossed flood stage at T" citing the method, the window hash, and the gauge sensor-record, observedAt the crossing time, accessPolicy public-free end to end. Gate: public-free resolves for the anonymous no-header path, so the event is readable by anyone, exactly the Layer 1 posture. This upgrades today's ad-hoc gauge read into a provenanced, verifiable, cited stream claim without changing the public-free tiering.

Human twin capture, parked (paper only). Capture: a Steel laser timing gate at a certified combine is registered as a `sensor-record` with `sensorType` laser-timing-gate, `attachedTo` the person node (or the capture-event), `certificationState` certified, accessPolicy subject-private (the tenant-private partition, the athlete via guardian being the tenant). Reference: the gate's raw timing series lands in the store; the sensor-record carries the `streamRef`. Derive: a split crossing mints a `derived-event` "Athlete ran 1.78s 10-yard split" with an `attestation` whose general slot carries the human spine's T2 device-attested tier as domain metadata (no core contract change), a derivation block citing the deterministic timing method, the window hash, and the gate sensor-record, observedAt the run time, accessPolicy consent-gated. Gate: a consent-grant filters the event to the audience the guardian permitted, at the gate, consent-aware. Every tier and every field resolves against the existing contract plus this ADR's additions; the human spine adopts the shape later by supplying its tier vocabulary as attestation metadata and its consent plane as accessPolicy grants, with zero contract rework. This validates the shape on paper and activates nothing.

Positive consequences beyond the three cases. The place spine's operational twin (ADR-022, past-closing owned-and-operating) gets its one missing capture affordance without a redesign, since utility and BIM already ride document-ingest and only live streams were unmodeled. Today's public gauge reads gain provenance and verifiability. The human spine's hardest-named unbuilt affordance is de-risked to a metadata-and-grants adoption rather than a contract fork. Commitment 1 holds for machine-derived claims through the derivation block. Commitment 2 holds because widthed confidence and the existing calibration loop apply to derived events unchanged.

Negative and risks. Derived-event volume needs the same index-pressure watch ADR-013 flagged for procedure-execution atoms; the windowing and materiality gate (decision 8) is the mitigation but needs measurement at first build. The time-series store is new operational surface (decision 3) even though the atom contract stays store-agnostic. Inferred derived events (models, not deterministic thresholds) are inherently lower-confidence and must be labeled as such through the derivation block, the same honesty discipline ADR-022 required for LLM event extraction. Checkpoint hashing adds a derivation-time compute cost per window, justified by verifiability.

## Conformance impact

Verified live this session: npm `@empressaio/atom-contract` latest is 1.7.0 (`npm view @empressaio/atom-contract version` returned 1.7.0; dist-tag latest 1.7.0). The conformance impact is written against 1.7.0.

The change is additive. It introduces two new atom types (`sensor-record` as an actor-record extension, and `derived-event`), a new optional `streamRef` structure on those two types, a new optional `attestation` slot, and a new optional derivation block on `derived-event`. It reuses the existing five-value accessPolicy union unchanged, the existing observedAt and atomizedAt bitemporal fields unchanged, the existing widthed confidence unchanged, the procedure-execution pattern (ADR-013) unchanged, and the actor-record base (ADR-015) unchanged. No existing atom type gains a required field. No consumer is forced to co-bump.

Class: minor. Per the version policy in `25_atom_architecture_reference.md` (new optional fields and new atom types are minor; required contract changes are major), this is a minor bump against 1.7.0, target 1.8.0 when built. Existing consumers pick it up automatically under a caret range and are unaffected until they choose to register or read the new types. This matches the precedent by which the encumbrance and workspace families were added as new namespaces on the same contract spec.

## Reversal criteria

Reverse or narrow if any of the following hold. If derived-event volume, index pressure, or extraction compute from streams blocks the substrate at scale despite the decision-8 windowing gate, tighten the materiality gate further or move raw windows to a cold tier with hot-tier derived-event pointers (the ADR-013 fallback pattern). If `derived-event` proves to duplicate procedure-execution semantics with no distinct claim-query surface in practice, collapse it into a procedure-execution subtype at the next major bump (decision 1 reversal). If a spine-side time-series store proves disproportionately costly for the derived-event value it produces, demote that stream to BFF-local capture and promote only its derived events, preserving the checkpoint-hash verifiability contract (decision 3 reversal). If every domain reinvents the same small set of verification tiers on top of the general attestation slot, promote a shared tier enum into the core contract (decision 6 reversal). The point-to discipline (raw stream never embedded) and the per-reading-minting rejection are not reversal levers; they are load-bearing and follow directly from ADR-011.

## Follow-on build list (NOT DISPATCHED)

If accepted, the first build would be the Mox operational-overlay leg, because it is the live enterprise-tenant demand with real unit-level events already surfacing and it exercises the tenant-private end of the matrix that the whole multi-investor twin depends on: scaffold the `sensor-record` and `derived-event` types in the contract as a minor bump to 1.8.0; stand up the spine-side time-series store behind the gate with the `streamRef` and checkpoint-hash contract; wire one deterministic extraction (HVAC fault) to mint derived events through a procedure-execution run; enforce the three-tier accessPolicy matrix at the gate; instrument the cost-per-stream meter from the first feed. The public-gauge leg (upgrading the existing NWIS and Edwards one-shot reads into provenanced public-free stream claims) would follow as the lowest-risk public-free validation. The human-spine leg stays parked with its own entry criteria and is not built here. None of this is dispatched; this ADR authorizes no code, no migration, no store provisioning, and no workstream activation. Nick sequences any build separately.

## References

- `_dispatches/2026-07-15_sensor-stream-adr-026-dispatch.md` — the work order this ADR fulfills
- `_research/2026-07-02_ai_native_and_twin_review.md` — sections 2 (point-to versus embed-with) and 4 (three-tier sketch, the named affordance)
- [`adr_022_deal_twin_and_cross_application_capture.md`](adr_022_deal_twin_and_cross_application_capture.md) — the operational-twin lifecycle this extends
- [`adr_013_procedure_execution_atoms.md`](adr_013_procedure_execution_atoms.md) — extraction-run and discipline-gate pattern reused here
- [`adr_015_actor_atoms.md`](adr_015_actor_atoms.md) — actor-record base for sensor-record
- [`adr_011_atom_identity_across_versions.md`](adr_011_atom_identity_across_versions.md) — per-edit rejection precedent for per-reading minting; DID-to-CID window versioning
- [`adr_017_atom_access_control.md`](adr_017_atom_access_control.md) — five-value accessPolicy applied per tier
- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — section 6 reference-not-containment; version policy for the minor classification
- `_inbox/2026-07-14_human_twin_spine_vision_and_build_spec_DRAFT.md` — section 3 validation table (human capture demand, paper target only)
- Engine state verified this session: `packages/adapters/src/federal/usgs-groundwater.ts` (NWIS one-shot flatten), `packages/adapters/src/state/texas.ts` (TCEQ Edwards one-shot), no stream/sensor atom type present in `packages/`

## Revision history

- **2026-07-15 (origin):** drafted as ADR-026 per the 2026-07-15 dispatch. Eight decisions taken, three validation cases walked end to end, conformance classed minor against live npm 1.7.0. Status proposed pending Nick's review and acceptance.
