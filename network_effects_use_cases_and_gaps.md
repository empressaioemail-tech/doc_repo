---
id: network_effects_use_cases_and_gaps
title: Network effects, adjacent use cases, and system gaps
status: draft
last_updated: 2026-06-29
applies_to: portfolio
owner: nick
related: [temporal_context_engine_spec, 09_post_saas_substrate_thesis, 59_spine_moat_and_high_value_features, 77_place_graph_strategy]
---

# Network effects, adjacent use cases, and system gaps

Captured from the 2026-06-29 exploration so it does not evaporate. The system in question: verifiable, calibrated, forward-looking facts about entities, with payable sources, expressed as atoms on a node and edge graph. Three sections (network effects, adjacent use cases, gaps), then a disposition section recording the operator triage.

## 1. Network-effect vectors

The deck currently shows one (the graph effect). There are at least seven distinct vectors.

**The graph effect (in the deck today).** Shared hubs (one code or issuer enriches everything pointing to it), cross-cutting events (one change fans out to many nodes across domains), and shared calibration (an outcome anywhere sharpens that claim type everywhere).

**Cross-domain method transfer (strongest, underused).** The data effect compounds within a domain, but the engines themselves (calibration math, materiality and event-impact model, the resolver) improve across every domain at once. The event-impact model hardened on markets makes the legislative-impact model in real estate better. More domains make the shared machinery sharper, which lifts all domains. Most data companies cannot get this because their data and methods are domain-locked. This is what justifies being multi-domain at all.

**Two-sided marketplace flywheel.** More consumers (agents, users) generate more usage and revenue, which attracts more data providers because they get paid, which enriches the catalog, which attracts more consumers. Each asset market (well interests, data assets, signals) also has a liquidity effect: more buyers and sellers produce better price discovery and attract more participants.

**Contribution flywheel (the Waze pattern, strong).** Every user who acts on an answer and produces an outcome improves calibration for everyone. Usage is contribution. More users to more outcomes to better earned confidence to more attractive to users. Driven by use, not by adding nodes, so it is distinct from the graph effect, and it is the engine of the calibration commitment.

**Ecosystem and platform effect (the MCP angle).** More agents and apps built on the substrate to more reasons to build adapters and tools to richer surface to more developers. The atom contract as "the shape every layer speaks" is a bid for a protocol or standard network effect: if others adopt the contract, interoperability compounds and the substrate becomes the default.

**Reputation and switching-cost lock-in.** A user or firm that builds a verifiable track record on the platform cannot recreate it elsewhere; the anchored history is the asset and it lives here. Reputation network effect plus a real switching cost. Sources also earn calibrated reliability over time, which makes them more valuable and stickier.

**Trust-as-enabler (counterintuitive).** Tenant isolation looks like a constraint on the data effect (private data cannot pool). But the isolation guarantee is what lets enterprises participate at all, and participation feeds the public and shared signal. The safety property is an on-ramp to the network, not just a limit on it.

**Workflow and collaboration effect (per node, multi-actor).** A node gets more valuable as more of its lifecycle actors work it. The real-estate flow shows it (investor, architect, city on one parcel); the oil-and-gas deal chain is the same. Each new actor inherits prior deposits and adds their own. The node compounds per stakeholder, not just per fact.

Assessment: the deck shows the weakest-to-explain vector (the graph) and omits the two strongest (cross-domain method transfer and the contribution flywheel).

## 2. Adjacent use cases

The system generalizes to "verifiable, calibrated, forward-looking facts about entities with payable sources." Adjacencies, roughly by fit:

- Insurance and underwriting. Underwriting is calibrated risk with provenance; forward-looking (climate, regulation) is native. Likely the largest adjacent market and closest to RE data in hand.
- Credit, KYB, and lending. The credit-bureau analogy made real: entity nodes, provenance, forward-looking filings, calibrated risk.
- Carbon credits and ESG verification. The core problem is trust (greenwashing, double-counting); verifiable provenance plus an anchored track record is a direct hit. The unusual features (anchoring, lineage) are the whole product here.
- Real-world asset tokenization. Node-as-asset plus verifiable provenance plus marketplace plus settlement is RWA infrastructure. The oil-and-gas interest flow is already a tokenized-asset story.
- Legal, IP, litigation. Citation and precedent are native; dockets are forward-looking events.
- Threat intelligence and cyber. The intelligence-analysis framing literally: indicators with source reliability and calibrated confidence, emerging-threat forward-looking.
- Clinical and scientific evidence. A claim with provenance, confidence, and reproducibility; living evidence synthesis.
- Supply chain and procurement risk. Supplier nodes, compliance and financial-health facts, forward-looking sanctions and tariffs.

Caveat: this is aperture, not a to-do list. The focus-queue discipline says do not open any of these until the wedge ships and hits its gates; if one is ever picked up it has to displace something. The list confirms the substrate is general (good for the moat and the cross-domain reduction-to-practice), it is not a signal to chase. The three where the unique features (calibration, anchoring, lineage) are the deciding advantage rather than nice-to-haves: insurance, carbon/ESG verification, and RWA.

## 3. System gaps and blind spots

1. Absence vs unknown. "We checked and there is no lien" (verified absence) is a different, valuable fact from "we never looked" (unknown). The atom model should represent verified-absence explicitly. It is exactly what diligence buyers pay for.
2. Conflict, not just correction. Supersession handles "the old value was wrong." It does not handle two concurrent authoritative sources that disagree. Genuine contradiction needs a representation (confidence-weighted, both retained, reconciled), not a winner overwriting a loser. The precedence work on the RE side touches this; the general model should name it.
3. Adversarial gaming and selective disclosure. Once calibration and reputation have value, people game them. Anchoring stops backdating, but not selective disclosure (only anchoring winners) or survivorship bias. The verifiable-track-record claim is weaker than it sounds unless completeness is also proven (every prediction anchored, not just the good ones).
4. Immutability vs the right to be forgotten. Append-only and anchoring collide with GDPR/CCPA erasure rights for anything touching personal data. A real legal tension, unaddressed; it bounds which atoms can be anchored.
5. Cold-start honesty. Compounding is not instant. Every new claim type and domain starts asserted, and the network effect is weak until outcomes accumulate; same chicken-and-egg on the two-sided markets.
6. Source-registry governance. The curated registry is a single point of editorial trust. "Authoritative" is a judgment that can be biased or captured. Governance is unspecified and load-bearing.
7. Cost side of the loop. Calibration, capture, and anchoring cost compute per node. The deck shows only value-compounding; at scale the question is whether marginal value beats marginal cost. The cost-per-jurisdiction discipline is the RE answer; the general system needs the equivalent.
8. Liability when a calibrated read is wrong. A cited, calibrated, hedged answer that informs a real decision and is wrong. The advice gate handles trading; the general posture (especially material RE claims) is unframed.

The two that are correctness issues rather than manageable or disclosable: selective-disclosure completeness in the verifiable track record (it undercuts the headline claim), and conflict representation (real authoritative sources disagree constantly, and most-recent-wins will quietly produce wrong answers).

## 4. Disposition (operator triage, 2026-06-29)

**Surface in the overview deck (system-framework language, not IP-geared):**
- Cross-domain method transfer.
- Contribution flywheel.

**Mention as other uses for the tech (deck):**
- Insurance and underwriting.
- Real-world asset tokenization.
- Carbon credits and ESG verification.
- Supply chain and procurement risk.

**Build into the trading app soon, queue for the RE apps:**
- Absence vs unknown (verified-absence as a first-class atom).
- Conflict, not just correction (concurrent-disagreement representation).
- Adversarial gaming and selective disclosure (completeness proof on the track record).
- Immutability vs the right to be forgotten (erasure-rights handling vs append-only and anchoring).

**Parked / not yet dispositioned:** the remaining network-effect vectors (two-sided marketplace, ecosystem/platform, reputation lock-in, trust-as-enabler, workflow), the remaining use cases (credit/KYB, legal/IP, threat intel, clinical/scientific evidence), and the remaining gaps (cold-start honesty, registry governance, cost side, liability).
