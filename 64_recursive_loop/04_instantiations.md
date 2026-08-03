---
id: 04_instantiations
title: Loop instantiations — property spine, trading, agent fleet, smartcity
status: active
last_updated: 2026-08-02
applies_to: portfolio
owner: nick
related: [64_recursive_loop/01_loop_template, 64_recursive_loop/02_selection_pressure, 64_recursive_loop/03_world_models, 27c_road_node_engine_and_warm_digital_twin_spec, 61_property_intelligence_master_plan, 90_runbooks/fleet_memory_practice, 90_runbooks/wdll_practice, _catalog/thesis_parity_ledger]
---

# Loop instantiations

The [`01_loop_template.md`](01_loop_template.md) worksheet applied to the four current targets. Each section ends with its first missing rung; those lines together are the program backlog. This doc is meant to be re-graded as rungs land: update the section, bump `last_updated`, and move the first-missing-rung line to the next gap.

Status vocabulary: **active** (loop running with real selection), **partial** (some rungs live, selection incomplete), **dormant** (documented, not running), **arm's length** (documented here, built elsewhere).

---

## Loop instantiation: Property intelligence spine

Date: 2026-08-02  Status: partial

**Substrate.** Atoms in the engine corpus (retrieval-api), parcel and CAD stores (`cad_property`, `txgio_parcel`, permits), zoning stamps, node facets in `place_layer_snapshots`, coverage ledgers (`county_facet_coverage`).

**World model.** The warm digital twin per [`27c`](../27c_road_node_engine_and_warm_digital_twin_spec.md): road nodes, lot-line geometry, road-type-aware setbacks, buildable envelopes. The envelope is the gradeable prediction; brief claims with confidence are gradeable assertions.

**Compression ladder.** Raw event: ingest runs, incident reports, scrub findings. Recorded lesson: `_scratch/` files, dispatch closes, `_inbox/` audits. Durable rule: onboarding recipes (27d), zoning-stamp roll mechanics, deploy runbooks. Mechanical guard: owner-match join gate, coverage ledger, functional health probes, R0 geometry tests. All four rungs exist; the ladder is the portfolio's most complete.

**Coherence carrier.** Onboarding recipe docs plus the unified jurisdiction onboarding config (the config is the structural carrier; the recipe doc is the hand carrier). Cross-vertical concepts travel via [`_catalog/thesis_parity_ledger.md`](../_catalog/thesis_parity_ledger.md).

**Selection pressure.** Signal: owner-match agreement (tier 3), area sweeps against county record (tier 2+3), adjudications and permit outcomes (tier 1, sparse today). Gate: coverage numbers recorded only post-gate; certification only by sweep. Cadence: per-ingest gates continuous; sweeps per certification event; tier 1 as outcomes arrive.

**Graduation pipeline.** Planner-gated per M0; strongest form already practiced (fabrication incident became a permanent join gate).

**Retirement rule.** Missing. Zoning stamps and setback tables have no staleness selection: nothing detects that a city amended its code and our stamp is now wrong. Retirement today is manual discovery.

**Metrics.** Coverage ledger per county; eval suite per jurisdiction (currently vacuous, ruled unpublishable until per-jurisdiction curated queries exist); calibration error once deposit-to-atom lineage attribution lands (named next build in the M1 program).

**First missing rung.** Staleness selection on stamped truth: a re-verification cadence (or trigger on code-edition change) that demotes zoning stamps and setback tables to "unverified as of `date`" instead of letting them silently rot. This is the retirement rule and it does not exist.

---

## Loop instantiation: Trading (empressa-trading)

Date: 2026-08-02  Status: arm's length (separate venture; sanctioned shared artifacts are the atom spec and the parity ledger; this worksheet documents from this side, it does not add to that ruling)

**Substrate.** Its own Python atom and calibration stores, own infra, own GCP project, per [`_catalog/repo_intents.md`](../_catalog/repo_intents.md). Out of scope for the convergence program; nothing here plans builds in that repo.

**World model.** Market state and risk dynamics; positions as predictions, P&L as the grader. See [`03_world_models.md`](03_world_models.md).

**Compression ladder.** Raw event: fills, marks, daily P&L. Recorded lesson: the venture's own process docs (WDLL originated there as `docs/process/WDLL_PRACTICE.md`). Durable rule and mechanical guard rungs: held by the venture; this side of the portfolio does not assert their state without reading that repo live.

**Coherence carrier.** The atom spec is the only shared substrate by ruling. The parity ledger is the documented channel for spine-model concepts crossing between the verticals, and it has already carried traffic both directions (WDLL came from trading; atom/calibration concepts went to it).

**Selection pressure.** The strongest in the portfolio: realized P&L (tier 1, daily), forecast calibration on probabilistic calls, slippage versus modeled execution, risk-limit breaches as hard gates. Design caution from [`02_selection_pressure.md`](02_selection_pressure.md): single-trade outcomes are noise; select on distributions, and grade process compliance (tier 3/4) separately from model quality (tier 1 aggregates).

**Graduation pipeline / retirement / metrics.** Owned by the venture. The template's ask, when the operator next works that side: fill these three fields from the repo's actual state, because a trading system that promotes strategy rules without a demotion rule is a blowup pattern, not a learning loop.

**First missing rung.** A completed worksheet from live repo state. The brand/focus decision owed on the venture (per repo intents) can ride along with that pass.

---

## Loop instantiation: Agent fleet

Date: 2026-08-02  Status: partial (strongest L1, real L2, no L3)

**Substrate.** doc_repo itself: canonical docs, `00_current_state.md`, `_sessions/`, `_decisions/`, `_dispatches/`, `_scratch/`, planner MEMORY.md, `.cursor/rules/`.

**World model.** Thin and mostly implicit (see [`03_world_models.md`](03_world_models.md)). Explicit predictions exist where the fleet is strongest: WDLL Start cards, dispatch acceptance items.

**Compression ladder.** Raw event: session transcripts, build reports, incidents. Recorded lesson: scratch entries (M0 Tier 2), dispatch closes. Durable rule: planner-gated MEMORY.md entries, promoted M0 standing scope rules, CLAUDE.md canon, decision records. Mechanical guard: promoted tests in product repos, CI checks, dispatch rule blocks. All rungs exist; density at the top rung is low (most lessons stop at prose).

**Coherence carrier.** Hand-carried today: standing decisions pasted into dispatches (the recorded memory says exactly this), the M0 rule block pasted verbatim into every sprint dispatch. Structural plan: a standing-decisions manifest that dispatch templates pull automatically, so a fresh executor cannot be dispatched without the current rule set.

**Selection pressure.** Signal: trap recurrence (tier 1 equivalent), adversarial-review refutation rate (tier 4), revert/rollback rate and guard firings in CI (tier 3). Gate: adversarial review on every deliverable; verification never delegated to executors. Cadence: per-deliverable review continuous; recurrence checking currently ad hoc (nothing systematically asks "did a recorded trap class recur" at session close).

**Graduation pipeline.** M0's, planner-gated, mechanical-guard-preferred. Working.

**Retirement rule.** Manual only: memories retired when the operator reverses a decision. Nothing detects an inert memory (never fires) or a harmful one (fires and misleads; live example: the planner memory index carried a three-gate MCP enum line for roughly four weeks after the four-gate rework deployed, caught and fixed only because this doc was being written, 2026-08-02).

**Metrics.** Missing entirely. This is the fired / helped / harmed ledger: a one-line stamp at session close per memory or rule that influenced the session. Cheap to run, and it is the prerequisite for every L3 behavior.

**First missing rung.** The fired / helped / harmed stamp at session close, plus a recurrence question in the session-close protocol ("did any recorded trap class recur this session; which memory should have prevented it"). Both are protocol edits, not builds. [PARTIAL 2026-08-02: the fired/helped/harmed + recurrence rung was ADDED to the session-close protocol. The bigger missing rung, surfaced by the incident below, is the DIVERGENCE GATE.]

**CONCRETE INCIDENT PROVING THE L3 GAP (2026-08-02) — the divergence that had no gate.** The fleet was told to OPERATE the existing proven factory (Block-13 engines: warm/inset/cert, frozen 7/7) over the Bastrop city input — "start the factory and test it." Instead it RE-BUILT the feeding + inspection WRAPPERS (a new cohort/roster selector + a new cert harness bastrop-district-cert-grade.mjs instead of the proven block13-cert-grade.mjs), and debugged its own new machinery through three STOP cycles. Memory, explicit instructions, AND a frozen template were ALL present and it STILL diverged — because none was a MECHANISM that fails closed on "you built new when a frozen one existed." This is EXACTLY the "coherence carrier is hand-carried, not structural" + "no selection pressure on divergence" gap this section already documented. Correction: `_decisions/2026-08-02_operate_the_factory_never_rebuild_it.md` (operate-don't-rebuild ruling + the divergence gate). Memory: `FLEET-L3-GAP-template-replication-not-enforced`. Lesson: we shipped recursive-loop L3 for the PRODUCT (PE onboarding) and NOT for the fleet — the operator caught it; this is the fleet's L3 being forced by the incident it predicted.

**Revised first missing rung.** The DIVERGENCE GATE (structural coherence carrier + operate-don't-rebuild enforcement): a dispatch names the frozen artifacts to RUN by path; building a new artifact requires a flagged operator-approved DEVIATION block; the planner rejects an unapproved parallel build at verify. This is the rung whose absence caused the 2026-08-02 incident. It plus the fired/helped/harmed stamp move the fleet toward real L3 (selection pressure on its own work, not just the product's).

---

## Loop instantiation: SmartCity / plan review

Date: 2026-08-02  Status: dormant (smartcity-os is absolute no-touch for code; doc-level only)

**Substrate.** The `_smartcity_masters/` reference set; the live Bastrop deployment (untouched); plan-review runs in cortex-api.

**World model.** Plan review's findings are predictions of what the city's reviewer will require against the adopted code. That is a genuinely gradeable prediction with a named grader.

**Compression ladder / coherence.** Doc-level only until the rebuild window opens; the masters set is the compression of the product line itself, deliberately isolated as the reconciliation reference.

**Selection pressure.** Signal: the city's actual decision versus our pre-review findings (tier 1); reviewer adjudications captured by the internal learning loop, which stays internal and unsold per the masters rulings; the adopted code edition as tier 2 check. Gate and cadence: to be designed inside the rebuild, not bolted onto the live system.

**Graduation / retirement / metrics.** Deferred to the rebuild window.

**First missing rung.** None actionable now by ruling. The worksheet exists so the rebuild inherits the loop by design; revisit when the no-touch lifts.

---

## Backlog rollup (the first-missing-rung lines)

| Artifact | First missing rung | Shape |
|---|---|---|
| Property spine | Staleness selection on stamped truth (retirement rule for zoning/setback stamps) | Build (small): re-verify trigger + honest demotion state |
| Trading | Worksheet completed from live repo state | Reading pass, next trading session |
| Agent fleet | Fired / helped / harmed stamp + trap-recurrence question at session close | Protocol edit to session close, then observe |
| SmartCity | None by ruling | Dormant until rebuild window |
