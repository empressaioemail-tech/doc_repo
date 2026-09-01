---
id: 2026-07-31_smart_site_TECHNICAL_white_paper
title: Technical White Paper — The Smart Site Architecture
date: 2026-07-31
status: technical white paper (draft v1 — engineering / integration-partner / technical-diligence audience)
owner: nick
related: [42_stub_thesis_national_twin_substrate, 30_block_cert_harness_spec, 40_hauska_map_3d_implementation_brief, 09_post_saas_substrate_thesis, 80_adrs/adr_018_atom_contract_substrate_layer]
purpose: The deep architecture of the Smart Site, for a technical reader — engineers, integration partners, technical diligence. How it actually works: the data contract, the assembly + reasoning engine, currency/provenance verification, the honesty mechanics, the dual interface, the trust/access model, the verification + settlement substrate. Substance, mechanisms named, tradeoffs stated.
---

# The Smart Site Architecture
## A Technical White Paper

### 0. Audience and scope

This paper is for a technical reader evaluating the system for integration, extension, or diligence. It describes the architecture of the Smart Site: the primitives, the assembly and reasoning pipeline, the guarantees the system makes and how they are enforced, the trust model, and the verification and settlement substrate. It states tradeoffs and known limits explicitly. It is not marketing; where a capability is partial, this paper says so.

A Smart Site is a single addressable place — a parcel, a right-of-way, a structure, a point — represented by the complete, reconciled, provenance-carrying set of records that govern it, computed into answers, and served identically to human applications and software agents.

---

### 1. Design invariants

The architecture is governed by a small set of invariants. Every component is built to satisfy them; violations are treated as defects, not degradations.

1. **Provenance is intrinsic, not attached.** Every fact carries its source, an access policy, a confidence signal, and a timestamp as part of its type. There is no code path that produces a fact without them.
2. **Correctness is verified, not asserted.** Computed outputs (buildable envelopes, flood depth, edge roles) pass mechanical verification gates before they are promoted to serving. A plausible answer that has not passed its gate is not served.
3. **The system fails honestly.** Where governing data is absent, conditional, or in conflict beyond a resolvable rule, the system declines with a stated reason rather than fabricating a scalar. Honest-decline is a first-class output, not an error.
4. **Currency is verified, not trusted.** A record's claim to be "current" is not accepted on its label. Edition, parcel, and layer currency are independently checked; a superseded edition or re-platted parcel is detected and surfaced, never silently served.
5. **One truth, two doors.** Human and agent consumers resolve identical facts through a shared reasoning layer. The interface differs; the truth does not.

These are not aspirations. Section 4 describes the gates and checks that enforce them.

---

### 2. The data contract: the atom

The foundational primitive is the atom: a typed unit of fact. An atom is not a row; it is a fact with an enforced shape. The contract defines:

- **A discriminated type** (a data atom, an execution/procedure atom, an actor atom, and additional families) with a validated schema per type. Widening or malforming a type is rejected at registration, enforced at the type layer.
- **Provenance fields** carried on every atom: `source` (a citation to the originating record or computation), `confidence`, `timestamp`/verification state, and an `accessPolicy`.
- **An accessPolicy** drawn from a fixed union — public-free, public-paid, platform-internal, tenant-private, tenant-shared — that governs who may resolve the atom. Access control is a property of the fact, not a wrapper around it.
- **Rendering modes** and a context interface, so the same atom can present inline, compact, expanded, or as a machine-context for an agent, from one definition.

Atoms compose into nodes and node-graphs: a parcel node, a road node, a boundary-edge with its role and inward normal, a setback-rule, a buildable-envelope. A Smart Site is a node-graph — a canonical place with its governing atoms attached, each addressable and each carrying its own provenance.

The contract is deliberately separated from monetization. The typed-data layer (what makes something an atom) and the verification/payment layer (what monetizes an atom once it exists) are peer substrates with no runtime dependency between them, so an agent surface can enumerate and render atoms without inheriting the commerce stack.

---

### 3. Assembly: joining incompatible records to one place

Assembly is the ingestion pipeline that turns fragmented external records into a Smart Site's node-graph. It is the hardest part of the system and the least glamorous.

**Adapters.** Each external source class has an adapter that normalizes its records into the atom contract: county/appraisal GIS parcels, city zoning layers, FEMA flood, terrain (statewide lidar DTM), building and development codes (from code libraries, direct PDFs, and licensed channels), utilities, and permit records. Adapters emit contract-conformant atoms with source citations intact. Adapters that cannot programmatically reach a source (bot-blocked platforms, credentialed APIs) are handled by dedicated retrieval paths (respectful crawlers, headers-first, robots-honoring) or flagged as manual/partnership dependencies — never silently dropped.

**Canonical keying.** External records use incompatible identifiers. Assembly resolves them to one canonical place key (county FIPS + parcel identifier, and geometry for spatial resolution), so that a zoning layer, a flood panel, and a code section all attach to the same node. Where a parcel has been re-platted, the successor set is resolved and the retired identifier is marked superseded rather than left to resolve stale.

**Conflict reconciliation.** A jurisdiction frequently publishes conflicting versions of the same standard — for example, an operational per-parcel dimensional record and a superseded ordinance chart that disagree. The reconciliation rule is explicit and defensible: the record a reviewer actually applies governs the served value; the conflicting source is retained and cited as a disclosed second source. The system draws from one and discloses the other; it never silently picks and hides the conflict.

**Currency verification (the anti-staleness gate).** Assembly does not trust a source's "current" label. It cross-checks a code library's current-edition claim against the jurisdiction's own adoption/repeal record; it verifies that a served edition is not repealed; it confirms a parcel still exists in the current cadastral. A repealed code, a superseded edition, or a re-platted parcel is detected and the affected atoms are made unservable (honest-decline) rather than served as fact. This gate exists because the failure it prevents — serving repealed law as current — is silent, confident, and catastrophic at scale.

---

### 4. Reasoning: from atoms to verified answers

A record store returns atoms. A Smart Site returns computed, verified answers. The reasoning engine is where atoms become the buildable envelope, the flood depth, the compliance read.

**The buildable envelope, as a worked example.** Computing what can be built on a lot is not a lookup; it is a geometric computation that must be correct, including on irregular lots, and honest where inputs are absent. The pipeline:

1. **Boundary primitive.** The parcel ring is scrubbed (collinear/degenerate cleanup) and reduced to a boundary node-graph: per-edge geometry, an inward normal per edge, and an edge role. The primitive is computed once against a specific ring and is winding-order-dependent — a swapped ring must have its primitive recomputed, not reused, or the inset offsets against the wrong edges. (This is enforced by a winding/normal-agreement check; reusing a primitive built against a differently-wound ring is a defect.)
2. **Edge-role labeling.** Each edge is labeled (front, side, corner-side, rear, alley) from road association. The front edge is the parcel's actual street frontage — resolved by matching the parcel's situs street to an adjacent road (situs-street-match), falling back to a proximity heuristic only within a real distance threshold. A road thousands of feet away must not win front. Pedestrian ways (footpaths, cycleways) are ineligible for frontage by a shared denylist — the same denylist the render layer uses to style them distinctly — so the twin retains them without letting them corrupt the answer.
3. **Setback resolution.** Each edge receives the setback for its role from the authoritative per-parcel record. A known district and role always resolves to a value; where a jurisdiction defers an axis to building/fire code, the citable code minimum applies rather than a decline that would collapse the whole envelope. Genuinely conditional standards (attached-vs-detached, abutting-residential) that a per-axis scalar cannot hold decline honestly on that axis while the resolvable edges still draw.
4. **Inset.** The parcel ring is inset per edge along each edge's inward normal, in a metric frame, producing the buildable polygon.
5. **Verification gate.** Before promotion, the envelope passes mechanical gates: the inset ring is non-null, non-self-intersecting, contained in the lot, positive-area; the per-edge inset matches the resolved setback on the correct edge (measured index-matched to the edge's own inward normal, not perpendicular-to-nearest — the latter false-flags correct non-convex envelopes); and, on a near-rectangular lot, the inset is convex with a matching vertex topology (a notch on a rectangular lot signals corruption; a non-convex inset on a genuinely irregular lot is correct). Only an envelope that passes is promoted.

This pattern — compute, verify mechanically against ground truth, promote only on pass — generalizes across the reasoning outputs (flood depth against real terrain with explicit vertical-datum handling; compliance reads against cited code sections).

**Persisted state must equal recompute.** Promoted outputs are cached for serving. A re-warm that leaves stale persisted state disagreeing with a fresh recompute is a defect; certification asserts persisted == recompute.

---

### 5. The certification harness: grading the served product against ground truth

Correctness claims are not accepted on report. The certification harness grades the *served* product — what the deployed application actually renders — against authoritative ground truth, per place, per field.

For a defined area (a block, extensible to a jurisdiction), the harness sweeps every parcel that renders in the customer's view — not a curated list, the rendered set — and for each asserts: correct district, setbacks matching the authoritative record, the drawn envelope's per-edge inset matching the resolved setback on the correct edge (measured in the engine's own frame), currency (no repealed edition, no superseded parcel), and no silently-blank or declined-in-error output. A single failing parcel fails the area.

Two properties make the harness trustworthy: it grades what renders (so a parcel visible to a customer but absent from an internal list cannot hide), and it measures in the same frame the engine computes in (so it cannot false-flag a correct irregular envelope). A parallel human review remains a named step — the mechanical gate can be under-specified, and an operator's eye on the rendered map has repeatedly caught what the assertions did not anticipate; each such catch becomes a new assertion. This dual gate — mechanical sweep plus human review, each confirming the other — is the unit of trust that lets a place be certified before it is scaled.

---

### 6. The dual interface

The same reasoning layer is exposed through two interfaces:

- **A human application** presents the Smart Site as an interactive map and inspect surface, with the buildable answer, the layers, and the X-ray report, each citation resolvable on tap.
- **A programmatic agent interface** exposes the reasoning functions as agent-callable tools, gated and metered, returning the same atoms with the same provenance and confidence. The agent surface exposes only functions a live application has proven; an unproven internal function is not exposed as a callable tool.

Both consume the atom contract directly; the contract is the shared substrate. The agent interface is the authorized channel for software agents to consume verifiable physical-world truth — the channel that does not otherwise exist.

---

### 7. Trust and access: sovereignty as structure

Access control is enforced at the atom, via `accessPolicy`, not promised in a contract. Public-tier atoms pool freely into the shared layer and into public-code calibration. A tenant's private atoms — a city department's records, a company's internal data, a specific adjudication — are isolated to that tenant and the parties it authorizes, and never pool into a shared or public asset. The gate enforces this at resolution time.

This is what allows a participant to contribute to and benefit from the shared public layer without exposing what it keeps private, and it is a hard requirement for any enterprise or municipal participant. It also defines the calibration boundary: the reasoning layer improves from anonymous and public-tier signal; it does not learn from, or leak, tenant-private decisions.

---

### 8. The verification and settlement substrate

Beside the reasoning layer sits a verification and payment substrate that operates over atom-shaped assets:

- **Verifiable assets and attestation.** The substrate wraps atoms as verifiable digital assets with an event-anchoring hash chain — a signed, content-addressed proof of a fact's state at a point in time. This proof is durable and portable: verifiable without a chain, and anchorable to one (the substrate includes chain and content-addressed-storage adapters) where a downstream consumer requires it. This is the mechanism by which a record becomes durable and provable — the capability that programmable-ownership and durable-records efforts need underneath them, provided as a property of the substrate rather than a separate system.
- **Metering and settlement.** Consumption is metered at the gate. An inbound per-reference meter accrues obligations to licensed sources on an append-only ledger against a source-actor identity — the mechanism by which a source is paid mechanically per reference rather than by contractual promise. (State note: the metering pipe and inbound accrual are live; per-reference rate-setting and outbound revenue-routing are the remaining implementation, activated by the first licensed-source customer.) A crypto and fiat settlement rail (stablecoin on multiple chains, plus a fiat-native provider) underlies payment.

The substrate is a peer to the reasoning layer, not a dependency of it: an agent or product consumes the contract and reasoning directly, and consumes the settlement substrate only where verifiable monetization or attestation is required.

---

### 9. Scale: producing Smart Sites in parallel

A single jurisdiction is assembled by a warm pipeline (assemble → compute → verify → promote). National scale is an orchestration problem, not an algorithmic one, because places are embarrassingly parallel — one jurisdiction's assembly is independent of another's.

The scale architecture is isolated-regenerate-then-swap: each jurisdiction (giants sharded by offset windows) is assembled into an isolated store, verified by the certification gates, and only then atomically swapped into a partitioned serving store. This makes re-warming — regenerating everything after an engine improvement — a first-class, live-data-safe operation: a jurisdiction regenerates in isolation, is verified, and swaps in only if it passes; a bad regeneration never touches live data. The certification gates are the safety valve inside the swap; a jurisdiction that does not pass does not go live. Terrain is the exception that proves the rule — a single continuous statewide source rather than a per-jurisdiction grind — handled as one additive artifact.

---

### 10. Known limits and honest state

- Reasoning families beyond the current set (skill/behavior atoms, some intent atoms) are architected but staged.
- The settlement substrate's outbound revenue-routing and per-reference rate-setting are the remaining build on an otherwise-live metering pipe.
- Conditional/contextual standards that no per-axis scalar can hold are honest-declined by design, not modeled; extending the model to represent them is future work.
- Live-sensor/IoT layers on infrastructure twins are a gated, jurisdiction-dependent extension (safety and feasibility bounded), distinct from the static-record assembly that is the base layer.

The architecture's central discipline is that these limits are surfaced, not hidden: the system declines where it cannot answer, flags where a source conflicts, and refuses to serve what it cannot verify. That discipline — mechanical honesty — is what makes a verifiable data layer for the physical world trustworthy enough to build on.
