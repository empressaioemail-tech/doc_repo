---
id: temporal_context_engine_spec
title: Temporal-Context Engine (industry-agnostic substrate spec)
status: draft
last_updated: 2026-06-28
applies_to: portfolio
owner: nick
related: [09_post_saas_substrate_thesis, 77_place_graph_strategy, 04a_arrow_two_calibration_capture, 01a_atom_conventions]
---

# Temporal-Context Engine

The forward-and-backward intelligence layer over the atom substrate. It is industry-agnostic: it applies to physical-world jurisdictional intelligence (the real estate and SmartCity surfaces) and to financial intelligence (the trading surface) without change, because it is built on the same atom, place-graph, calibration, and settlement primitives. This spec is the converged design from the 2026-06-28 atom-side / builder-side design conversation. Domain examples are marked inline.

## Summary

Atoms compound history well: what is or was true, cited and calibrated. But every product surface also needs two things atoms alone do not give: an explanation of why something happened in the past, and a grounded anticipation of what is pending that could change the future. Today the only mechanism for the forward need is open-world model search, which is ungrounded, uncitable, uncalibratable, and surfaces rumor as signal. The Temporal-Context Engine replaces that with one system that handles both tenses on the same substrate.

The single most important realization: explaining the past and anticipating the future are one system in opposite tenses. They share three spines. They both depend on a capture mechanism that does not exist today, because events are currently live-fetched for display and never persisted. Capture is therefore the lead, because uncaptured days are permanently unexplainable.

## 1. The problem: three temporal classes of knowledge

1. Historical and current facts (what is or was true). Atoms handle this: provenance, calibration, compounding history.
2. Anticipatory items (what is proposed, pending, or scheduled, and might become true). This is the gap.
3. Derived predictions (the system's own forecast). The `derived` atom family plus calibration covers this.

The failure mode is that, lacking class 2, the system reaches for the open web to satisfy the forward need. The fix is not better searching. It is to build class 2 as a first-class, bounded, grounded layer, and to recognize that classes 1 and 2 are the same captured events viewed in different tenses.

## 2. Architecture: one engine, two tenses, three shared spines

One temporal-context engine. Two tenses: explain the past, anticipate the future. Three shared spines that both tenses run on:

1. Capture. Persist authoritative events as atoms from a curated source registry. The prerequisite for both tenses.
2. Event-impact / materiality. Compute whether an event actually moved the subject. Used to rank a past explanation and to score a future effect.
3. Calibration. Turn outcomes into earned confidence. Backward produces training pairs (event to realized move); forward produces the prediction (pending event to expected move); the loop is shared.

A pending item the watcher mints today (future valid time) becomes the historical context the backward layer recalls once it resolves. The watcher is not only forward signal; it is how the system persists context at all.

## 3. Spine 1: Capture

### 3.1 Capture-first, irreversible-if-missed
Every day events are not persisted is permanently unexplainable history, except where a dated source allows backfill. Capture ships before the reasoning machinery. The watcher starts as a thin ingest-and-persist worker whose only job is to write event atoms (knowledge_time = poll time, valid_from = event time). Reasoning is layered on later; missed capture cannot be recovered.

Immediate action independent of the engine: any feed currently live-fetched for display only (news, calendars, regime, agendas) flips to also persist as atoms now. Low effort (the fetchers exist), high value, and it starts the irreversible clock. Honesty property: a now-persisted past item gets knowledge_time = now, valid_from = its real occurrence, so it appears in "what was happening" but correctly not in "what we knew then" for old windows, because we were not capturing then.

### 3.2 The curated source registry, not open-world search
Per domain, define the authoritative forward-and-event sources and monitor them. This changes the model's job from "predict the future" to "read these specific authoritative sources and extract what is pending or what occurred," which is grounded, citable, and calibratable. Open web stays a disclosed, low-confidence fallback, never the primary path.

The registry is a governed artifact: versioned, each source carrying its own reliability and its own `license` plus `derived_ok` (see the rights rule in section 9). It bounds the model's input.

### 3.3 Bounded scope and extraction order
- Bounded to a tracked universe first (the subjects the user holds or watches, plus a tracked set), expanding later. The registry discipline applied to breadth, not just to the source list. Keeps volume and cost sane.
- Structured-before-freetext within a source. The clean, high-confidence structured parts (event type, dated fields, the filer-to-subject identifier mapping) ship first and carry high confidence. The hard free-text part (which subjects does this affect, what does it mean) ships second with its own, lower confidence. This mirrors the fact-versus-forecast separation in section 7.

Domain example (trading): the registry is SEC EDGAR filings (8-K, S-1, S-4, 13D), the Fed/FOMC calendar, FDA approval calendars, token unlock and vesting schedules, on-chain governance proposals, and sector bill trackers. EDGAR is first: free, public-domain (so `derived_ok=true`, no ToS gate), clean APIs, dated history for backfill, and it matches the current asset class.

Domain example (real estate): the registry is state and local legislature dockets, planning-commission and zoning-board agendas, federal rulemaking, and housing-authority notices. Example anticipatory item: a bill pending in a state legislature that would retroactively rezone certain multifamily as assisted housing, which an investor needs before it is priced in.

## 4. Spine 2: Event-impact / materiality

The shared, statistically hard core. "Did this event move the subject" is not "the price or value moved after the event." Build it once, used by both tenses.

- Marginal, not raw. The honest quantity is the event's marginal effect: realized move versus expected/baseline move, not the raw move. Reuse existing baseline infrastructure where it exists.
  - Domain example (trading): expected move from options-implied volatility and a beta/factor expectation; marginal effect = realized minus expected.
- Point-in-time measurement. Measure the move on the corrected, corporate-action-aware series, using the cross-ex-date guard so no revised or split-adjusted values leak in.
- Confounding is surfaced, never manufactured. When multiple events overlap a window, the honest output is "co-occurring events, attribution uncertain," and the materiality atom carries its own attribution-confidence. Never fabricate a clean marginal where the data cannot support one.

The materiality result is a derived atom (calibration-eligible) carrying its attribution-confidence.

## 5. Spine 3: Calibration, two loops not one

Two distinct ground truths that fail differently, so they calibrate independently. Both ride the outcome-as-atom mechanism (an outcome is a new event atom linked back, never a mutation), and both surface in the operator command center's calibration view.

1. Resolution loop. Did the event happen as predicted (the bill passed, the unlock occurred on schedule, the filing landed). Ground truth is the event's own resolution. Keyed as one claim_type.
2. Effect-linkage loop. Given it happened, did the subject move as the relationship predicted. Ground truth is the materiality computation in spine 2. Keyed as a different claim_type.

Separation matters: a wrong effect-linkage (the event was mapped to the wrong subjects) shows up as a predicted move that never materializes across instances, which is a different error than mis-estimating the resolution probability. Keeping two claim_types prevents a linkage-extraction error from hiding inside a resolution number.

Self-bootstrapping: every pending item eventually resolves, generating its own calibration data over time, and the backward training pairs cross-train the forward predictor.

## 6. Data model (reuses the locked primitives, adds nothing structural)

- Event as a node. A pending item or event is its own node, keyed on its stable external id via the resolver and identifier index (the same identity discipline as securities: never key on a mutable title). It has `would_affect` edges to the subjects it touches, many-to-many: one event affects many subjects, one subject has many events.
- Anticipatory atom. Event family, `claim_type = anticipatory.<kind>`, `valid_from` in the future (it becomes true on the effective date). No new atom family (event is already calibration-eligible on the outcome side, which is exactly resolution semantics; a new family would ripple through every eligibility gate).
- Status via bitemporal supersession, not a mutable field. Each status transition writes a new atom; the current-atoms projection gives the latest; the statement-level immutability guard enforces no in-place update.
- Two probabilities in two places. Resolution probability lives on the anticipatory atom's confidence object (basis asserted, earning to live as items resolve). Effect-linkage confidence lives on the relationship, not the atom.
- `would_affect` edge is structural and immutable: it carries existence and the effective date only. The churning effect-probability is a derived atom re-estimated over time (consistent with the rule that structural edges live in the store and changing coefficients are derived atoms). A subject query walks the structural `would_affect` edges and reads the latest effect-probability atom.
- The candle (or any interval view) is a query anchor, not a node. "Explain this window" resolves to (subject, time-window), which is an existing interval atom's subject and valid interval; the answer is event-context atoms whose valid time overlaps the window with `would_affect` edges to that subject, ranked by materiality. No new object, no bloat.

## 7. The two tenses and tense-forked gating

Same machinery, different output gate by tense. The seam is fact versus forecast.

- Backward explanation ("here is what was happening when this moved") is largely factual and historical, low advice-risk, light touch. Over-gating it makes the explainer useless.
- Forward anticipation ("this pending event will likely move the subject") is advice-adjacent: probability-mandatory, cited to the registry source, hedged, and routed through the governance gate as advice with the propose-never-auto hard-cap.
- The fact half ("this filing was made," near-certain from the source) stays high-confidence in both tenses. Only the forecast half carries the hedge. Never blur the two.

Implement by keying the gate on tense (valid_from past versus future) plus the fact-versus-forecast claim_type.

### Bitemporal does double duty backward
Two backward modes. The user-facing explainer filters by valid time ("what was happening"). The explainer's own calibration and backtest filter by knowledge_time ("what we knew then") and may only attribute a move to an event whose knowledge_time preceded the move window. An explainer that trains on hindsight is the silent killer, so it is gated by the point-in-time rule like everything else. This is where the bitemporal and anchoring investment pays off again.

## 8. The source registry as a governed artifact

Versioned. Each source carries reliability, `license`, and `derived_ok`. The registry is what bounds the engine; the moment the model free-roams the open web as the primary path, grounding is lost. Open web is a disclosed fallback only, low confidence, with the web-scraped/unverified disclosure.

## 9. Honesty, advice, and legal discipline

- Probability starts asserted, earns over time. Until a source or claim_type has resolved enough items to pass an n threshold, the probability is labeled asserted, never dressed as earned.
- Cited and bounded. Every forward claim is cited to a registry source and hedged with its probability and basis. Never a bare forward claim.
- Rights propagate through derivation. Registry sources get `license` and `derived_ok`; calibration computed on them follows the lineage-aware `derived_ok` rule (a derivative is serveable only if the most-restrictive `derived_ok` across its entire input lineage permits it). Prefer to compute the moat on rights-clean inputs.
- Advice sensitivity. Forward statements are advice-adjacent; in a financial context they route through the advice hard-cap. In a jurisdictional context they are material claims that influence investment, so the same cited-and-hedged discipline applies.

## 10. Build sequencing

1. Capture first. Flip existing live-fetched feeds to also persist as atoms now, independent of the engine. Stand up the first registry watcher as a thin ingest-and-persist worker.
2. Materiality model. The shared event-impact computation with confounding handling and point-in-time measurement.
3. Event-as-node plus `would_affect` edges and the effect-probability derived atom.
4. The two calibration loops via outcome-as-atom.
5. The two tenses on top: backward explainer (light gate) and forward anticipation (advice gate).
6. Expand sources and broaden the tracked universe.

The capture watcher serves both tenses on the same source, so the first source is built once and pays for both. Start narrow (one high-value source, the tracked universe), expand later.

Domain example (trading): the order binds to the crypto sequence already agreed (calibration foundation, anchoring, crypto unified-book, crypto signal calibration). The temporal-context layer slots right after the calibration foundation, can run parallel to anchoring (different surface), and its crypto sources align with the crypto leg. EDGAR-first watcher is also the first backward-capture source.

## 11. Cross-domain instantiation

The engine is identical; only the registry and the subjects change.

| Element | Trading instantiation | Real estate instantiation |
|---|---|---|
| Subjects (nodes) | securities, issuers, options | parcels, jurisdictions |
| Event nodes | filings, Fed/FDA calendar items, unlocks, governance proposals | bills, agenda items, rulemakings, notices |
| First source | SEC EDGAR (free, dated history, public-domain) | a target legislature or planning-commission docket |
| Forward claim example | this 8-K will likely move the name | this pending bill would retroactively rezone this property class |
| Advice gate | financial advice hard-cap | material-claim cited-and-hedged discipline |

That the same engine serves both is itself a strength, the same way the atom method is cross-domain, and it reduces a single mechanism to practice in two domains.

## 12. Shared dependency: generalize the node-type and resolver system

Event nodes need a new node-type prefix (`evt_`) and a resolver extension. This is the same "extend node types beyond the base set" work that the crypto wallet and token nodes need. Build the node-type and resolver generalization once as a shared foundation task; it serves events and crypto. Budget it once, not twice.

## 13. Definition of done

- Capture: the first registry watcher persists event atoms (knowledge_time = poll, valid_from = event time); existing display-only feeds also persist; dedup is idempotent on the stable external id and status changes write supersession atoms, never updates.
- Materiality: marginal effect computed against a baseline on the point-in-time series; overlapping events return attribution-uncertain with an attribution-confidence rather than a fabricated clean number.
- Data model: event nodes with many-to-many `would_affect` edges; anticipatory atoms as event family with future valid_from and bitemporal status; resolution probability on the atom, effect-probability as a derived atom on the relationship.
- Calibration: two independent loops (resolution, effect-linkage) via outcome-as-atom, both visible in the command center.
- Tenses: backward explainer filters by valid time for display and by knowledge_time for its own calibration (no lookahead); forward anticipation is probability-mandatory, cited, hedged, advice-gated.
- Registry: governed, versioned, per-source reliability and derived_ok; open web only as a disclosed fallback.

## Open items

- The exact n threshold at which a source or claim_type flips from asserted to earned.
- Per-domain registry curation ownership and the cost budget for it.
- The effect-linkage extraction method (the harder NLP half) and how its confidence is estimated.
- Trustless verification bar for any forward claim marketed as "provable" (ties to the anchoring spec).

## Provenance

Converged in the 2026-06-28 atom-side / builder-side design conversation, building on the locked spine-foundation contract (bitemporal append-only atoms, the resolver, calibration keyed on claim_type and worker, the two invariants), the track-record anchoring addendum, the wallet-node model, and the data-rights architecture (lineage-aware derived_ok). Industry-agnostic by construction so it serves the trading surface and the jurisdictional surfaces from one engine.
