---
id: 2026-06-29_trading_app_temporal_context_substrate
title: Session — Temporal-Context Engine spec, network effects, and RE atom gaps from the trading app thread
date: 2026-06-29
type: session
applies_to: portfolio
owner: nick
related: [temporal_context_engine_spec, network_effects_use_cases_and_gaps, 09_post_saas_substrate_thesis, 01a_atom_conventions, 04a_arrow_two_calibration_capture, 77_place_graph_strategy]
---

# Session summary — Temporal-Context Engine + network effects and atom gaps

Strategic session outside the Claude Code doc_repo harness (June 28-29). No product code touched. Two output documents written and saved to the working tree; this summary is the missing session record. The session ran in two phases: an atom-substrate design conversation (June 28) that converged the Temporal-Context Engine spec, followed by a network-effects and gaps analysis (June 29) that produced the disposition for the RE apps.

## What happened

**Phase 1 — Temporal-Context Engine (June 28).** The atom substrate handles what is or was true well (provenance, calibration, compounding history). The gap is class-2 knowledge: anticipatory items (what is proposed, pending, or scheduled that might become true). Without class 2, every product surface reaches for open-world search to satisfy the forward need. The fix is to build class 2 as a bounded, grounded layer and recognize that it is the same captured events viewed in opposite tenses.

The converged design: one Temporal-Context Engine, two tenses (explain the past, anticipate the future), three shared spines (capture, event-impact/materiality, calibration). The engine is industry-agnostic by construction — RE and trading run the same engine on different registries and different subject types. The data model reuses all locked primitives (bitemporal atoms, the resolver, calibration keyed on claim_type and worker) and adds only: an anticipatory atom (event family, future valid_from), an event node (evt_ prefix), many-to-many `would_affect` edges, and an effect-probability derived atom on the relationship. No new atom family.

The two calibration loops — resolution (did the event happen as predicted) and effect-linkage (given it happened, did the subject move as predicted) — calibrate independently with separate claim_types, preventing a linkage-extraction error from hiding inside a resolution number.

The node-type and resolver generalization (event nodes + crypto wallet/token nodes both need new prefixes) is one shared foundation task, not two.

Full spec: [`temporal_context_engine_spec.md`](../temporal_context_engine_spec.md).

**Phase 2 — Network effects and atom gaps (June 29).** Analyzed seven network-effect vectors against the current deck (which shows only the graph effect, the weakest to explain). The two strongest vectors missing from the deck: cross-domain method transfer (the engines improve across every domain at once, making each domain better; most data companies cannot do this because their methods are domain-locked) and the contribution flywheel (every user who acts on an answer and produces an outcome improves calibration for everyone — usage is contribution). These were approved for the deck.

Eight system gaps identified. Two are correctness issues rather than manageable disclosures: selective-disclosure completeness (people game a verifiable track record by anchoring only wins; completeness proof is needed) and conflict representation (two concurrent authoritative sources that genuinely disagree require a named representation, not a winner-overwrites-loser).

Full analysis: [`network_effects_use_cases_and_gaps.md`](../network_effects_use_cases_and_gaps.md).

## Decisions and dispositions

- Cross-domain method transfer and the contribution flywheel: surface in the overview deck (system-framework language, not IP-geared).
- Insurance/underwriting, RWA tokenization, carbon/ESG, supply chain: mention as other uses for the tech in the deck.
- Four gaps queued for the RE apps (build into the trading app soon, queue for RE): (1) verified-absence as a first-class atom, (2) conflict representation for concurrent authoritative disagreement, (3) completeness proof on the verifiable track record, (4) immutability vs right to be forgotten (GDPR/CCPA vs append-only anchoring).
- Remaining network-effect vectors and use cases: parked, not yet dispositioned.

## State at close

Two documents committed to the working tree; session record (this file) was missing and is now filed. No dispatches were produced; the four RE atom gaps are design intent only, not yet dispatched to cc-agent-C or cc-agent-E. The trading app build sequence (calibration foundation, anchoring, crypto unified-book, crypto signal calibration, then Temporal-Context Engine) was noted; the TCE slots after calibration foundation and can run parallel to anchoring.

## Open threads

- The four RE atom gaps need to be incorporated into the atom conventions and dispatched to cc-agent-C when the RE apps re-enter active sprint.
- The node-type and resolver generalization (evt_, wallet, token prefixes) is a shared foundation task; budget it once.
- The overview deck updates (cross-domain method transfer, contribution flywheel, adjacent use cases) are operator-owned; no dispatch.
