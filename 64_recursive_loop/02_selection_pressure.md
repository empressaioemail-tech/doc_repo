---
id: 02_selection_pressure
title: Selection pressure — ground-truth taxonomy, design rules, exemplars
status: active
last_updated: 2026-08-02
applies_to: portfolio
owner: nick
related: [64_recursive_loop/00_recursive_loop_overview, 64_recursive_loop/01_loop_template, 64_recursive_loop/04_instantiations, 04a_arrow_two_calibration_capture, 90_runbooks/fleet_memory_practice]
---

# Selection pressure

Selection is the mechanism that separates a learning loop from an accumulation loop. Capture and compression without selection produces confident drift: the system gets more rules, more memory, more "coverage," and none of it is guaranteed to be true. This portfolio has paid for that lesson at least four times (the scan-fix pipeline post-mortem, the fabricated Williamson land-use, the vacuous eval scores, the sample-certified broken Bastrop). This doc is the standing guidance on choosing and wiring selection pressure so a fifth payment is not required.

The core principle: **selection pressure is a signal the system cannot generate itself, consumed by a gate the system cannot talk its way past.**

## Taxonomy of ground truth

Graded strongest to weakest. Every loop instantiation names its signal's tier; prefer the strongest tier the artifact can reach, and compose tiers rather than relying on one.

| Tier | Class | What it is | Properties | Portfolio examples |
|---|---|---|---|---|
| 1 | Settlement | The world settles the question with money or matter | External, unfakeable, often slow | Realized P&L on a position; a permit approved or denied against our predicted envelope; a survey against our geometry |
| 2 | Institutional record | An authoritative external record | External, verifiable, lagged, occasionally wrong | County clerk record, adopted code edition, CAD roll, RRC filings; the C7 Winkler title baseline |
| 3 | Mechanical cross-check | Two independent internal paths must agree, fail-closed | Internal but structural; catches fabrication and joins gone wrong | Owner-match join gate; dual-source consistency on title; CI on a promoted test; functional health probes |
| 4 | Adversarial review | An independent context tries to refute the claim | Cheap, fast, catches plausible-but-wrong; only as good as the reviewer's independence | Planner adversarial review of build reports; the spine-audit gate that refuted 3 of the planner's own recon claims |
| 5 | Self-report | The generator grades itself | NOT selection pressure. Listed only to ban it | An agent's "done" without a live probe; eval suites that pass with zero queries |

Tier 5 is not a weak tier; it is a category error. The 2026-07 post-mortem finding was exactly this: coverage failures were drift between agent report and reality because the pipeline had no ground truth in it.

## Design rules

**External to the generator.** Whatever produced the output must not be the thing that grades it. This holds at every scale: an agent does not verify its own build (verification is never delegated to executors), a model does not grade its own eval, a data pipeline does not certify its own coverage. Independence is the property being purchased; do not economize on it.

**Fail closed.** A gate that degrades to "pass" when its input is missing selects for nothing. The fail-open caller substrate masking bad grounding was flagged as a confirmed hole in the 2026-08-01 spine audit for exactly this reason. If the signal is unavailable, the gate's output is "unknown, blocked," never "fine."

**Grade the functional path, not liveness.** The retrieval /search outage ran four days because the health check proved the process was alive, not that it could do its job. A selection signal must exercise the real work: a real query, a real join, a real render. Liveness is tier 5 wearing a tier 3 costume.

**Sweep, not sample, for certification.** Sampling certified a broken Bastrop while 819 parcels sat on a repealed zoning code next to the sampled ones. Spot checks are fine for smoke; certification claims require exhaustive checks over a bounded area, with neighbors inspected. Bound the area to afford the sweep rather than sampling a larger area.

**Two-tier cost structure.** Cheap frequent gates plus expensive rare audits. The gate runs on every event (every ingest, every PR, every promotion); the audit runs on a cadence and hunts for what the gates structurally cannot see, including holes in the gates themselves. The 2026-08-01 spine-health audit is the audit tier operating correctly: it found the gate that was missing.

**Numbers are gate-stamped or they do not exist.** A coverage, quality, or calibration figure is recorded only after its gate passes, following the county coverage ledger pattern (a number lands in `county_facet_coverage` only after the owner-match gate proves the join). A number recorded before its gate is a fabrication vector, even when nobody intends fraud.

**Positive-space fixtures, not just negative-space.** A promoted guard is only as good as its fixture coverage. The R0 geometry gate tested that bad shapes fail but not that good near-rectangles pass, and a defect slipped through the untested half. When compiling a lesson into a test, cover both directions.

**Match latency to the loop.** Tier 1 signals are strong but slow (a permit outcome takes months). Do not starve the loop waiting for the strongest signal: run fast tier 3/4 gates continuously and reconcile against tier 1/2 when it arrives. The reconciliation delta is itself a lesson.

## Exemplar table (copy these shapes)

| Existing mechanism | What it selects against | Tier | The shape to copy |
|---|---|---|---|
| Owner-match join gate + coverage ledger | Fabricated joins; unfounded coverage claims | 3 | Independent-field agreement required before any number is recorded |
| Area-sweep certification (Bastrop downtown drill) | Sample-blind data corruption | 2+3 | Exhaustive bounded sweep with neighbor inspection |
| Adversarially gated audits (spine-health ledger) | The planner's own stale or wrong recon | 4 | Claims must survive a refutation pass before filing |
| Arrow-two adjudication capture (PARTIAL: hazard rates live at case grain; deposit-to-atom lineage is the named next build) | Miscalibrated confidence on atoms | 1+2 | Outcomes flow back to the exact atoms that made the claim; copy this shape once the lineage leg lands |
| M0 promotion gate | Prose rot and wrong lessons becoming durable | 4 | Human-gated promotion; mechanical form preferred |
| Functional uptime check on /health/search | Silent functional death behind green liveness | 3 | The probe performs the service's real work |
| WDLL Start/Finish card diff | Silent scope drift during a build | 4 | Same card graded twice; the diff is the drift |
| Merge-only-on-green-CI + live probe after deploy | "Works on my machine" and stale-bundle illusions | 3 | Two independent checks, environment-honest |

## Anti-pattern table (each one already cost us)

| Anti-pattern | What happened | The recorded lesson |
|---|---|---|
| Scan-fix loop with no ground truth | Agent-reported coverage drifted from reality across a whole program | Post-mortem: benchmark is "is the data true and available in the app"; fail-closed gates; fewer agents, tighter contracts |
| Vacuous evals | 32 of 34 jurisdictions "passed top-3" with zero queries evaluated | An eval with no inputs is a rubber stamp; artifact ruled unpublishable |
| Sampling as certification | Bastrop certified clean while neighbors sat on a repealed code | Area-sweep, not parcel-sample |
| Fixture masquerade | Identical results across specimens read as verification | Verify across gold specimens with different data |
| Liveness as health | /search dead 4 days behind a 200 /health | Functional probes on the real work path |
| Self-graded "done" | Merged CI-green PR presented as shipped | Code-done is not customer-done; a grade is a live probe on the deployed surface |

## Per-artifact ground-truth menu

Starting menu for the instantiations in [`04_instantiations.md`](04_instantiations.md). Compose several per artifact; never run on one tier alone.

**Property intelligence spine.** Tier 1: permit and plan-review outcomes against predicted envelopes and setbacks; a surveyed plat against our geometry. Tier 2: county records, adopted code editions, CAD rolls (the substrate's own sources, used as checks on derived claims). Tier 3: owner-match and dual-source join gates; coverage ledgers; area sweeps. Tier 4: adversarial review of onboarding runs. Native metric: calibration error between asserted confidence and adjudicated outcomes, per arrow two.

**Trading (empressa-trading).** The purest pressure in the portfolio: tier 1 arrives daily and in dollars. Realized P&L against the thesis that opened the position; forecast calibration (Brier score or equivalent) on probabilistic calls; slippage and fill quality against modeled execution; risk-limit breaches as hard gate events. The trading loop's danger is not weak signal but noisy signal: single-trade outcomes are mostly luck, so selection must run on distributions over many trades, not on the last trade. Grade the process (was the entry per the rules, was the size per the model) with tier 3/4 gates, and grade the model with tier 1 aggregates.

**SmartCity / plan review.** Tier 1: the city's actual decision versus our pre-review findings (did the reviewer accept, amend, or reject what we flagged). Tier 2: the adopted code edition and the city's own records. Tier 4: reviewer adjudication captured per the internal learning loop (which stays internal, not sold, per the masters set). Constraint: smartcity-os is no-touch for code; this menu informs docs and future builds only.

**Agent fleet.** Tier 1 equivalent: incident recurrence (did a recorded trap class happen again). Tier 3: promoted mechanical guards firing in CI; revert and rollback rate on merged work. Tier 4: adversarial review refutation rate (what fraction of executor "done" claims fail review; a falling rate means the fleet is learning, a zero rate means the reviewer has gone soft). Native metric for memories: fired / helped / harmed counts stamped at session close, the L3 rung the fleet currently lacks.
