---
id: 2026-08-02_foundation_e2e_and_memory_review_dispatch
title: DISPATCH — deep E2E foundation review + memory-system (factory capture-and-freeze organ) verification (read-only, adversarial)
date: 2026-08-02
status: dispatch (read-only, adversarially gated; grounds the Foundation Brief before ops docs)
owner: nick
related: [2026-08-02_DAY_ONE_foundation_brief, 2026-08-02_bastrop_recipe_ACCEPTED, 90_runbooks/fleet_memory_practice.md, _catalog/tx_jurisdiction_source_registry.json]
purpose: Before writing the Texas ops-doc set, GROUND the settled Foundation Brief frame (R-FND-1..7, the factory-operator model) in VERIFIED REALITY. Deeper than the Bastrop recipe extraction. Answers: is the mechanical/agent boundary actually clean in live code? is the ledger reproducible? does the memory system (the factory's capture-and-freeze organ) actually function — including the known cc-agent-reach weakness? does Command Center reflect truth? Read-only, adversarial. Output gates the ops docs.
---

# Foundation E2E + memory review

## WHY (the stakes)
This is the foundation the rest of the business sits on. The operator settled the frame (Foundation Brief R-FND-1..7: factory-operator model, engines mechanical, agents operate, adapters frozen after review, memory system IS the capture-and-freeze organ, CC is the factory floor, ledger is a performance public data layer). Before the ops docs ENCODE that frame, verify the frame against LIVE REALITY — because the Bastrop recipe already caught that documented state != live state (cert script not on main; R7 half-implemented). Deeper than Bastrop: this reviews the WHOLE foundation, not one parcel path.

## HARD CONSTRAINTS
READ-ONLY. No code, deploys, warms, writes. Live code reads + live substrate SELECTs + live endpoint probes only. Verify against LIVE, not docs (docs lag — proven repeatedly). Adversarial gate on every finding (a refuter tries to kill it with live evidence; CONFIRMED vs PLAUSIBLE; default refuted when uncertain). Paste RAW evidence (file:line, raw output). One coordinator owns the fan + runs the adversarial gate itself.

## THE FRAME BEING VERIFIED (from the Foundation Brief — the review CHECKS these hold in reality)
- R-FND-3: engines are deterministic machinery; agents operate, never IN the warm/cert/serve path; adapters frozen after review.
- R-FND-7: the memory system (M0 scratch→promoted, planner-gated, mechanical-guard-preferred) IS the factory's capture-and-freeze loop; live reasoning is WIP until frozen; rewarm replays frozen artifacts only.
- R-FND-2/6: the sourcing registry is (to become) a baked-in engine input; the county/city ledger is a performance data layer.
- R-FND-4: Command Center is the factory floor and must surface per-county engine + memory/freeze state (today: STUB).

## LANE 1 — MECHANICAL/AGENT BOUNDARY (is it actually clean in code?)
The core R-FND-3 claim: no agent call inside a warm/cert/serve run. VERIFY:
- Trace the live warm path (depth-warm-bastrop-batch.mjs + engine-core warm/inset/currency/owner-match) and the cert path (block13 harness / area-sweep) and the serve path (atom-chain-to-facets, retrieval). Is there ANY LLM/agent/network-to-an-agent call inside them? (grep for anthropic/openai/llm/agent/generate inside the engine + warm + cert + serve code paths). A single agent call in the correctness path REFUTES the "mechanical machinery" claim.
- Are the engines DETERMINISTIC (same inputs → same outputs)? Any nondeterminism (Date.now/random/wall-time-dependent/network-race) inside the warm/inset/cert that would make a rewarm produce different atoms? (The recipe's persisted==recompute R10 depends on this.)
- Where is the agent-seam TODAY? (adapter authoring, source discovery, conflict adjudication — is it prep-time-frozen or live?) Map every place a human/agent judgment enters the data path and whether it's captured as a frozen artifact or a live decision.
Deliver: the mechanical/agent boundary AS-IS (a map: machinery vs operator-seam), every agent/nondeterminism finding in the correctness path (CONFIRMED with file:line), and the gap vs R-FND-3.

## LANE 2 — THE MEMORY SYSTEM = THE FACTORY'S CAPTURE-AND-FREEZE ORGAN (does it function?)
R-FND-7 makes M0 foundation-critical. VERIFY the system documented in 90_runbooks/fleet_memory_practice.md actually works:
- SCRATCH tier: does _scratch/ exist + carry real entries (LESSON/DEAD-END/GROUND-TRUTH/OPEN)? Are GROUND-TRUTHs timestamped (the doc says an untimestamped one is invalid)? Is it actually used, or aspirational?
- PROMOTION gate: is the planner-gated scratch→promoted loop real? Is the strongest form (a MECHANICAL GUARD — test/fail-closed gate, not prose) actually how lessons land? Sample the recipe's rulings — did they promote to tests/gates (R28 winding invariant, R29 conditional convexity, R32 measurer) or stay as prose? A ruling that stayed prose when it could be a test is a memory-freeze weakness.
- THE KNOWN WEAKNESS (cc-agent-reach): the roadmap flagged "M0 cc-agent-reach hardening — the biggest known M0 weakness; do before fan-out." VERIFY it: does memory actually REACH executors/operator-agents, or die at dispatch? (The standing memory: "memory reaches the PLANNER seat only; fresh executor/QA agents DRIFT unless standing decisions are PASTED into the dispatch.") Is that still true? This is the load-bearing check — if memory doesn't reach the factory operators, the capture-and-freeze loop is broken and rewarm-determinism cannot hold.
- CAPTURE-AND-FREEZE as R-FND-7 needs it: can a live operator decision (scratch) become a frozen artifact (promoted, mechanical-guard) that the mechanism replays? Is there a path from "agent reasoned through a sticky part" → "frozen data/config the engine reads"? Or is that path aspirational?
Deliver: the memory system AS-IS (works / partial / aspirational per tier), the cc-agent-reach weakness verified current-or-fixed, and whether the capture-and-freeze loop R-FND-7 requires actually exists.

## LANE 3 — LEDGER REPRODUCIBILITY + THE PERFORMANCE DATA LAYER (R-FND-6)
- Is the served ledger (promoted atoms + county_facet_coverage) REPRODUCIBLE from frozen inputs? Given the same sources + recipe version, would a rewarm produce the same atoms? (persisted==recompute R10 — sample live: does a fresh recompute match the promoted atom for warm Bastrop parcels?)
- Does any promoted atom carry a RECIPE-VERSION field today (R-FND-5), or is that OWED? (The rewarm trigger — without it, "what needs rewarming" is uncomputable.)
- The performance-ledger fields R-FND-6 needs (done/not-done, rewarmed, coverage %, recipe-version, cert-state, cost, staleness, the rewarm-unsafe/unfrozen-decision flag) — which EXIST in county_facet_coverage today, which are OWED?
Deliver: ledger reproducibility verdict + the recipe-version + performance-field gap.

## LANE 4 — COMMAND CENTER = THE FACTORY FLOOR (R-FND-4; today STUB)
- The engine panels (Resolver, Autonomous Engines) are documented STUB. VERIFY current state: what does CC actually show about engine/warm/cert state today? What's live vs stub?
- For the factory-floor requirement: can the operator SEE per-county engine state, coverage, recipe-version, memory/freeze state? What's the gap from STUB to "operator watches the factory run + Bastrop is the first subject" (R-FND-4)?
Deliver: CC engine-surface AS-IS + the gap to the factory-floor requirement.

## LANE 5 — THE SOURCING REGISTRY AS A BAKED-IN ENGINE INPUT (R-FND-2)
- The registry (tx_jurisdiction_source_registry.json, CAPCOG-only 55/~10-counties) is DOCS today. R-FND-2 says it must be a baked-in ENGINE INPUT the mechanism reads. VERIFY: does the engine read any per-county source config today, or are sources hardcoded per-adapter (e.g. Bastrop layer-23 hardcoded in bastrop-per-parcel-record.ts)? What's the gap from "per-county hardcoded adapters" to "engine reads a frozen registry of source adapters"?
- The recent-repeal onboarding-risk register in the registry — is it wired to the currency gate (R13/R16), or is it a doc the engine ignores?
Deliver: registry-as-engine-input gap + the currency-register wiring state.

## OUTPUT — THE FOUNDATION GROUND-TRUTH REPORT
One report: for each R-FND ruling, does live reality MATCH, PARTIAL, or GAP (with raw evidence). A ranked list of foundation gaps (most-load-bearing first) with fix-class. Explicit answers: (1) is the machinery mechanical + agent-free in the correctness path? (2) does the memory capture-and-freeze organ work + does memory reach operators? (3) is the ledger reproducible + does it carry recipe-version? (4) how far is CC from the factory floor? (5) how far is the registry from a baked-in engine input? This report GROUNDS the ops docs — the ops docs get written to close these gaps, so they must be REAL gaps, adversarially confirmed.

## COORDINATION / DISCIPLINE
ONE coordinator owns the fan (fans the 5 lanes, BLOCKS until they return — no fan-and-return), runs the adversarial gate itself (never delegates the verdict to the finder), synthesizes the report. Read-only throughout (enforce on every sub-agent). Verify live not docs. Cloud Run traffic-trap (serving != latestReady) + :latest-image-race + describe-cache-lag (use base-URL behavior) all in play. Paste raw evidence. Do NOT touch Bastrop Block-13 (quarantined) or any in-flight work. No timeframe estimates.
