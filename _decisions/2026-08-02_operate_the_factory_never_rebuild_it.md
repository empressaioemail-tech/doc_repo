---
id: 2026-08-02_operate_the_factory_never_rebuild_it
title: DECISION — operate the existing factory, never rebuild it; new machinery is a flagged deviation, not a default
date: 2026-08-02
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [OPS-3_engine_contract_determinism_register, 2026-08-02_bastrop_recipe_ACCEPTED, 64_recursive_loop/04_instantiations, 90_runbooks/fleet_memory_practice, PHASE_C_HANDOFF_bastrop_warm]
reversal_criteria: reverse only if a frozen artifact is proven WRONG (not merely inconvenient) — then it is corrected in place + re-frozen, still not silently replaced by a parallel build.
---

# Operate the factory, never rebuild it

## THE FAILURE THIS CORRECTS (2026-08-02)
Phase C's task was to START THE EXISTING FACTORY and TEST IT with Bastrop — the engines (warm/inset/cert) were already PROVEN on Block-13 (7/7, frozen, quarantined). Bastrop city was supposed to be the FIRST RUN of that proven machine over more parcels. Instead the fleet RE-BUILT machinery: a new cohort/roster selection and a NEW cert harness (bastrop-district-cert-grade.mjs) instead of the proven block13-cert-grade.mjs, then debugged its OWN new machinery through three STOP cycles. Operator: "we were supposed to be getting the factory started and tested with bastrop not building a new factory." The engines were NOT rebuilt (same adapter/rings/roads/warm path) — but the FEEDING + INSPECTION WRAPPERS were, and they diverged from the proven ones. Every "finding" was a wrapper-vs-proven divergence, not a data discovery.

## THE ROOT CAUSE (systemic, not "agent went off-track")
Per 64_recursive_loop/04_instantiations, the DEV FLEET loop is L1/L2 with NO L3: no selection pressure on divergence, a HAND-CARRIED (prose) coherence carrier, no gate on "you built new when a frozen one existed." We built the recursive-loop L3 discipline for the PRODUCT (PE county onboarding) and applied NONE of it to our own fleet. So "replicate the template / operate the machine" was PROSE, and prose gets interpreted-away under progress-pressure. Memory + instructions + a frozen template were all present and it STILL happened — because none was a MECHANISM that fails closed on divergence.

## THE RULING
1. OPERATE, DON'T REBUILD. When a task is "run / test / scale an existing proven mechanism," the default is to RUN THE FROZEN ARTIFACT over the wider input — NOT to write new machinery. Agents are OPERATORS of the mechanism (R-FND-3 factory-operator model), not machinists. This applies to the whole path: the warm script, the cert harness, the cohort/roster definition, the answer-key derivation — if a proven version exists, RUN IT (extend its INPUT, not its CODE).
2. NEW MACHINERY IS A FLAGGED DEVIATION. Building a new artifact when a frozen equivalent exists is NOT a default move. It requires: (a) naming the frozen artifact being bypassed, (b) a one-line reason it genuinely cannot be extended, (c) OPERATOR APPROVAL before building. An unapproved parallel build is the failure this decision names.
3. EXTEND, DON'T FORK. If the proven artifact needs to handle more cases (e.g. block13-cert-grade grading 7 parcels → grading a city), the correct move is to GENERALIZE THE PROVEN ARTIFACT (roster as a parameter), not to write a new one beside it. One artifact, widened — never two that must agree.
4. FROZEN ARTIFACTS ARE THE COHERENCE CARRIER. The dispatch names the exact frozen artifacts to RUN (by path), so the executor operates them rather than reimplementing. "Replicate the template" is not prose in a paragraph — it is a NAMED FILE the dispatch says to run.

## THE MECHANISM (so this can't recur — the fleet's missing L3 rung)
- COHERENCE CARRIER (structural, not hand-carried): the dispatch template MUST name (by path) the frozen artifacts the task operates + the standing decisions. Building a NEW artifact requires an explicit "DEVIATION: bypassing <frozen artifact> because <reason>, operator-approved" block — absent that block, the executor operates the named artifact.
- DIVERGENCE CHECK (selection pressure): the planner, verifying a hand-back, asks "did the executor EXTEND the proven artifact or write a NEW one? if new, was it a flagged approved deviation?" A new artifact without approval = a REJECT + re-do against the frozen one. This is the L3 gate the recursive-loop doc flagged as missing.
- SESSION-CLOSE RECURRENCE (the fired/helped/harmed rung, already added to the session-close protocol): "did we re-solve something already solved / re-build something already frozen this session?" This failure is the canonical instance.

## WHAT THIS DOES NOT SAY
It does not forbid building NEW factories for genuinely new capabilities (that IS building). It forbids REBUILDING an EXISTING proven mechanism when the task is to OPERATE it. The distinction: is there a frozen, proven artifact that does this? If yes → operate/extend it. If no → build (that's real work). The failure is building when a frozen one existed.
