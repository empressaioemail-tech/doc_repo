---
id: 2026-07-02_deepreview_twin_DR3
title: "DR-3 deep review — digital twin / property node / twin-creator customer model (Phase 3 shape)"
status: inbox
date: 2026-07-02
applies_to: portfolio
author: DR-3 (read-only deep-review analyst)
related: [80_adrs/adr_022_deal_twin_and_cross_application_capture, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_013_procedure_execution_atoms, 77_place_graph_strategy, 25_atom_architecture_reference, 08_tiered_access_model, 14_pricing_framework, 09_post_saas_substrate_thesis]
---

# DR-3 — the digital twin, the property node, and the twin-creator customer

Read-only shaping pass for Phase 3. This is analysis and a proposed shape, not a decision and not a build. Nothing here is committed; it is inbox material for operator review. Where a claim rests on an existing doc it is cited by slot; where it is my inference it is labeled as such. The unstructured-data-to-atom ingestion mechanism is DR-1's domain and is referenced here, not designed here.

## Prior art this sits on (so we do not reinvent)

Three things already exist and the twin model is a composition of them, not a new primitive.

The place node already exists as strategy. `77_place_graph_strategy.md` defines the place as a resolvable node (address maps to parcel identity maps to legal description plus jurisdiction context) carrying six horizontal planes (public law, private surface law, parcel economics, physical/environmental, operational precedent, market) as typed, provenanced edges. Agent queries are metered reasoning walks on that graph. This is the base twin already, minus the private operational overlay and minus the per-investor multiplicity.

The deal twin already exists as an accepted ADR. `adr_022` promotes the radar workspace into a persistent tenant-private deal object with a lifecycle (sourcing, analyzing, offer, under contract, due diligence, closing, owned/operating), where every captured event is a procedure-execution atom (ADR-013) carrying `tenant-private` accessPolicy. ADR-022 is the transaction-scale instance of the same inverted-digital-twin pattern being sold to Mox at portfolio scale (its own words). The operator's "real twin needs private operational data" refinement is the natural next layer on ADR-022's deal object once the deal reaches the owned/operating lifecycle state.

The tenancy partition already exists and is enforced. `adr_005` Layer A landed (hauska-mcp-server PR #29, migration 004): `AuthContext` carries `jurisdiction_tenant` plus `platform_internal`, and `access-policy.ts` enforces the five-value union post-fetch at ~11 ns per atom check with an `access_policy_denied` audit log and a passing cross-tenant isolation test. `accessPolicy` is a five-value union in `@hauska/atom-contract` (through 1.5.0 per the 25 reference header): `public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared`. This is exactly the machinery the multi-investor-on-one-node requirement needs, and it is already live.

So the Phase-3 twin is not a green-field concept. It is: the place node (77) + private operational overlay (new, this doc) + the deal/operating lifecycle (022) + the enforced tenant partition (005/017). The novel design work is the node-as-aggregator framing and the private-operational-data-as-atoms ingestion path.

## 1. The digital twin model and lifecycle

### The node as a first-class aggregator

The property node (parcel / APN, anchored per 77's priority order: address for UX entry, parcel identity as stable join key, legal description as the subsurface and recorded-instrument index, jurisdiction context for the code corpus) is the aggregation point. Everything else hangs off it as edges. This is consistent with the atom architecture in 25: an atom composes other atoms by reference, and a parcel-record atom "survives every permit that ever referenced it" (25 Section 6, reference-not-containment). The node is a data-level atom (real-world referent, VDA-backed, cryptographically anchored history per 25 Section 3). Overlays reference the node; they are not contained by it, so each overlay has its own lifecycle and its own accessPolicy.

The critical property is that the node is a single shared identity with layered visibility, not one object per viewer. There is one `parcel-record` atom for 123 Main St. The public base atoms on it are `public-free` or `public-paid`. Each investor's or operator's private overlay atoms are `tenant-private` scoped to that tenant. Two investors evaluating the same property both resolve the same node, both see the same public base, and neither can see the other's overlay because the gate filters by `accessPolicy` against the requester's resolved tenant (005 Layer A). This is the sovereignty guarantee expressed structurally: the shared ground-truth layer compounds across the network while each tenant's private intelligence stays partitioned (005 Decision, verbatim intent).

### The three strata on one node

Stratum 1, public base (shared, compounds). The 77 planes: hazard, setbacks, zoning, comps, effective code, physical/environmental overlays, recorded instruments. `public-free` for the Layer-1 federal/public-records baseline; `public-paid` for the Layer-2 calibrated reasoning over it (08 two-axis model). Sourced through the spine/Cotality, never re-scraped per node (022 explicitly drops re-scraping public records the backend already serves).

Stratum 2, engagement / review (tenant-private, per-tenant). Procedure-execution atoms (ADR-013) capturing what a given tenant did on this node: the brief run, the keep/pass, the adjudications, the deal-lifecycle events from 022, the plan-review findings. This is the layer that turns a static node into a living twin for that tenant. Already modeled by 022 for the deal case and by ADR-007/017 for the construction-lifecycle case.

Stratum 3, private operational overlay (tenant-private, per-tenant) — the operator's refinement. Utility bills, 3D/BIM models, IoT building-sensor data, lease/accounting data. This is what makes a twin a real operating twin rather than a pre-acquisition dossier. It is `tenant-private` by construction (the same floor 022 draws for deal data, which it calls "the most sensitive data in the portfolio"). Multiple operators on the same physical building (e.g., a property manager, an owner, a lender) each carry their own Stratum-3 overlay, never pooled — this is the ADR-005/017 partition applied to operational rather than transactional data. It is the same partition, a new data domain.

### The twin lifecycle

Resolve node. Address or parcel or legal description resolves to the `parcel-record` atom (77 G0; the place-identity milestone). If the node does not exist, it is created from CAD/Cotality on first engagement.

Assemble public base. The gate returns the `public-free` and (tier-permitting) `public-paid` planes as cited, provenanced reasoning — the place dossier (77 G3, `get_place_dossier`). Confidence, source, timestamp per commitment 1.

Open engagement / review. The tenant's first material action (brief run, keep, offer) opens the tenant-private engagement stratum. Each material action is a procedure-execution atom (ADR-013) with the deal/operating lifecycle state (022) as context. This is where the twin becomes tenant-specific.

Layer private operational data. As the tenant moves toward and into owned/operating (022's final lifecycle state), Stratum-3 overlays attach: utility bills, BIM, sensor feeds, accounting. Each enters as tenant-private atoms via the ingestion paths in section 2. This is the layer the operator is asking for and it is the natural extension of 022 past "closing" into "operating."

Version bitemporally. The atom history model already carries the two timestamps needed: `observedAt` (when the event really happened) and `atomizedAt` (when it entered the chain), with `provenanceTier` native-vs-backfill (25 Section 7). Bitemporal is not new work at the contract level; it is already the shape. Utility bills and sensor readings are the case that exercises it hardest (a bill observed for a March billing period but atomized in July; a sensor reading with an event time distinct from ingest time). The honest-claim discipline in 25 Section 7 (backfilled events are verified from `atomizedAt` forward, never fabricated event dates) governs the operational overlay exactly as it governs backfilled permits.

## 2. Private operational data as atoms

The general unstructured-source-to-atom mechanism is DR-1's design question. This section only specifies what shapes the operational-data domain needs and flags where it depends on DR-1, so the two reviews compose rather than collide.

### Utility bills (PDF / CSV)

Document-shaped, periodic, structured-enough. A bill is a data-level atom (real referent: an actual invoice for an actual meter/account on an actual building), `tenant-private`, with typed fields (period, usage, cost, meter/account id, provider) plus the source PDF/CSV as CID-addressable content (25 anti-pattern: content is CID-addressable, DB holds references). Ingestion is the DR-1 unstructured-to-atom path (PDF/CSV extraction to typed atom). The atom-type shape is close to an invoice/statement atom; it composes onto the node by parcel reference. No new atom primitive needed beyond a domain atom type; the ingestion is DR-1's pipeline. Confidence should be labeled per 022's discipline that LLM extraction from arbitrary documents is inherently lower-confidence and must be marked as such.

### 3D / BIM models (IFC / DWG)

Large binary artifacts, not naturally atom-granular. Recommendation: the model file is CID-addressable content attached to the node (a `building-model` data-level atom whose payload reference is the IFC/DWG in object storage, per 25's "store content in addressable storage, DB holds references"). Extracted semantic facts from the model (floor count, GFA, systems inventory, equipment list) become typed atoms composed onto the node — this is where the value is for reasoning, and it is again a DR-1 extraction question (IFC/DWG parse to typed facts). Do not attempt to atomize geometry at the mesh level; atomize the semantic layer and keep the geometry as an addressable blob. This mirrors the 25 rendering-vs-atom separation: the model is facts a window can render, not a thing the atom contract needs to understand natively.

### IoT sensor streams — the genuinely new shape

Snapshot vs stream vs time-series is a real design fork and the contract does not currently model a stream primitive. Recommendation, three tiers:

Do not atomize raw high-frequency readings one-atom-per-reading. ADR-013 already flags atom-volume/index-pressure as its top negative consequence for procedure-executions, and a per-reading sensor atom is orders of magnitude worse. This would blow the contract.

Model the sensor as a data-level `sensor` atom (it exists in the 25 SmartCity catalog already: "sensor-reading" is listed as a data-level atom type). The atom is the sensor/stream identity; the raw readings live in a time-series store (external, addressable) with the atom holding the reference plus current-state key metrics (25's key-metrics layer: last reading, status, thresholds — exactly the vehicle-atom odometer/fuel pattern in 25 Section 4). The context interface returns current state cheaply; the full series is a referenced time-series pull, not atom content.

Atomize derived events, not raw stream. When a stream crosses a threshold or a pattern is detected ("4 similar failures on Outfall O-12 in 18 months" is the exact example already in 25 Section 7), that derived event is a procedure-execution or observation atom on the node. This is the same discipline-gate logic ADR-013 uses: the aggregation is the atom, not the underlying reads. So: sensor identity is an atom, raw series is referenced external time-series, meaningful derived events are atoms. This is a clean extension of patterns already in the docs, not a contract rewrite — but it is the one place Phase 3 needs a small new contract affordance (a stream-reference field / time-series pointer on the sensor atom), which should be an explicit ADR when it is built.

Cross-reference to DR-1: utility-bill and BIM ingestion are instances of DR-1's unstructured-to-atom pipeline (document/model extraction to typed atoms). Sensor streams are NOT — they are a distinct time-series-plus-derived-event shape that DR-1's document pipeline does not cover. Flag this seam so the two designs do not assume each other's coverage.

## 3. The twin-creator customer persona

The persona: firms that build and operate building or campus digital twins (their operational twin already exists — BIM, BMS/IoT, space/energy management), where our layer adds jurisdictional + market + calibrated-reasoning intelligence on top of their operational twin.

### Does it fit the thesis?

Buyer type. The thesis buyer is the agent operator (CLAUDE.md core thesis; 09). The twin-creator is adjacent but not identical. Two honest sub-cases: (a) if the twin-creator consumes our jurisdictional/market intelligence via MCP into their own twin platform, they are a PropTech embedder / SDK partner — a persona 08 already names ("PropTech SDK partners... embed atom packs in their LLM features," and the PropTech embedders segment). That fits cleanly and is not new. (b) if we are asked to host or co-own their operational twin (their BIM, their sensors), that is a new buyer type and a heavier posture — closer to what Mox is (an enterprise tenant whose operating data lives partitioned on our spine). My read: the persona is mostly case (a) with a case (b) tail, and the interesting/risky part is the tail.

Tiered-model placement (08/14). Case (a) sits at Layer 2 paid (calibrated reasoning consumed per-call) plus potentially Layer 3 if they want workflow/state — priced through the composable data-package model (08 Data packages: they would compose Parcel + Code/plan-review + Hydrology + Environmental depending on the twin's purpose), with the 14 take-rate (1.5-2.5%) on any routed source-actor share and the Decision-B access tiers ($0/$49/$199, package-composed) for the builder ICP. This is a well-defined home. Case (b) is an enterprise-tenant deal (005 `enterprise-customer` tenantKind, like Mox), Path B pricing (14 Defaults: enterprise/well-funded), tenant-private operational overlay — the Stratum-3 model this doc defines is precisely what case (b) needs.

Spine rule (CLAUDE.md: does it feed or express Hauska?). Case (a) expresses Hauska strongly: every twin-creator query is a metered reasoning walk on the place graph (77's exact model), which is consumption revenue and calibration signal. It feeds the moat. Case (b) is more mixed: their operational data is tenant-private and by sovereignty rule (CLAUDE.md tenant-sovereignty; 005/017) never pools into the shared asset, so their raw operational data does NOT feed the public catalog. What feeds Hauska in case (b) is anonymized calibration signal only ("twins shaped like X had jurisdictional issue Y"), the same boundary 022 draws for deal data. So case (b) expresses Hauska (consumption, enterprise reference, Mox-pattern proof) but feeds it only through the anonymized calibration channel. Both obey the spine rule; case (a) feeds it harder.

### Recommendation: shape further (lean pursue on case (a), park case (b) behind Mox)

Not a clean "pursue" and not a "park." Split it.

Case (a), the twin-creator as MCP/data-package consumer of our jurisdictional + market intelligence, is already a named persona (PropTech embedder, 08) sitting in an already-priced home. It expresses the spine rule strongly and requires nothing new from us that the place-graph MCP (77 G3) and the tiered model (08) do not already provide. This is pursue-when-a-real-counterparty-appears, through the existing embedder motion — not a new workstream, so it does not trip the focus-queue rule.

Case (b), hosting/co-owning their operational twin, is the same shape as Mox (enterprise tenant, tenant-private operational overlay, Stratum-3). Recommendation: park it behind Mox and do not open it as a parallel workstream. Reason (the key reason): Mox is already the live proof-of-concept for the exact capability case (b) needs — a partitioned enterprise operating twin on the spine (022 says so explicitly: the deal twin is "the Mox proof-of-concept" and Mox "is the portfolio version"). Opening twin-creator case (b) before Mox lands would violate the focus-queue rule (new workstream without naming what gets killed) and would be building the same enterprise-operating-twin capability twice against an unproven pattern. Let Mox prove Stratum-3 (private operational overlay on a partitioned node), then twin-creator case (b) is a repeatable second instance of a proven motion, exactly as 005 frames the second tenant ("the second tenant is incremental once the first rides it").

Net verdict: shape further — pursue case (a) opportunistically through the existing embedder/data-package motion, park case (b) behind Mox. Do not open a standalone twin-creator workstream now.

## Proposed Phase-3 shape (concrete)

Node aggregator. One `parcel-record` (place) node per property, anchored per 77 (address / parcel id / legal description / jurisdiction), as the data-level aggregator atom. Public base planes attach as public-free/public-paid edges; everything private attaches as tenant-private edges referencing the node. Reference-not-containment (25 Section 6) so each overlay keeps its own lifecycle.

Tenancy. Reuse 005 Layer A as-is (it is live). No new partition machinery. Multiple investors/operators on one node = multiple tenant-private overlays on one shared node, filtered at the gate by resolved tenant against `accessPolicy`. Multi-operator on one building is the same partition as multi-investor on one parcel.

Private overlays. Extend the 022 deal object past "closing" into "owned/operating" and hang Stratum-3 (utility/BIM/sensor/accounting) tenant-private atoms off the node there. This is the operator's twin refinement, and it is an extension of an accepted ADR, not a new one — except the sensor time-series affordance, which warrants its own small ADR when built.

Operational-data ingestion. Utility bills and BIM route through DR-1's unstructured-to-atom pipeline as typed data-level atoms (bill = invoice-shaped atom; BIM = addressable blob + extracted semantic-fact atoms). Sensor streams take a distinct three-tier shape: sensor-identity atom + referenced external time-series + derived-event atoms, with a new stream-reference contract field flagged for an explicit ADR. Bitemporal versioning is already provided by the observedAt/atomizedAt/provenanceTier model (25 Section 7); no new work at the contract level.

Sovereignty guardrail (load-bearing, non-negotiable). Every Stratum-2 and Stratum-3 atom is tenant-private by default (005 default-policy for newly created atoms is already tenant-private). Raw operational data never pools; only anonymized calibration signal feeds public code, per 022's boundary and the CLAUDE.md tenant-sovereignty rule. This is the same hard gate 022 names and it is already enforced at ~11 ns/check.

## Flags for the operator

Small new contract affordance needed for sensor streams (a time-series reference field on the sensor atom). This is the one genuinely new contract surface; everything else composes existing machinery. Recommend an explicit ADR when Stratum-3 sensor ingestion is built, not before.

Seam between DR-1 and DR-3: DR-1's document-to-atom pipeline covers utility bills and BIM extraction; it does NOT cover IoT time-series. Make sure whichever review owns ingestion names the sensor stream as out-of-scope-for-the-document-pipeline so it does not fall through.

Twin-creator case (b) and Mox are the same capability. Do not build it twice. If a twin-creator counterparty appears before Mox lands, treat them as a second enterprise tenant on the Mox pattern, not a new product.
