---
decision_id: 2026-06-06_engine_extraction_unfrozen
date: 2026-06-06
owner: Nick
status: active
related_canonical: [04_roadmap_alignment_audit, 00d_portfolio_roadmap_reference, 27_engine_evolution_plan, 00c_portfolio_master_map]
related_adr: [80_adrs/adr_008_engine_factor_out]
---

## Decision

Engine extraction (ADR-008, factoring the property/parcel and plan-review engines out of cortex-api workspace packages into the `hauska-engine` repo) is no longer frozen. This reverses item 6 of the roadmap alignment audit (`04`), which had frozen extraction until one outside party pays through the gate. Extraction is to be dealt with so the substrate is built clean, sequenced behind M-Stabilize Phase 2C and behind the wedge ship so it does not pull build attention off shipping.

## Context

The 2026-06-02 roadmap audit (item 6) froze engine extraction as attention protection, alongside firewalling the trading, issuance, PE-curriculum, and IBKR adjacencies. On review (2026-06-06) the operator separated the two: the adjacency firewall stays, but engine extraction is spine work, not an adjacency. Deferring it behind a first paid call leaves the reasoning factored as workspace packages inside cortex-api (per `00c_portfolio_master_map.md` §3 and §10) rather than in the canonical `hauska-engine` repo per ADR-008, which keeps the substrate boundary muddy while the apps are being built on top of it.

## Structural commitment check

Pre-mortem run 2026-06-06. Green on all four structural commitments and the quality gate. It positively serves the Hauska spine rule (commitment-adjacent rule 5): moving reasoning into hauska-engine expresses the substrate boundary cleanly. The one operational flag is the focus / build-versus-ship test: the audit froze extraction precisely to protect build attention. That concern is managed by sequencing, extraction stays gated behind M-Stabilize Phase 2C and is not pulled forward ahead of the wedge ship, so it does not compete with shipping Cortex and the extension. Operational yellow, acknowledged and mitigated by sequence; no load-bearing concern.

## Reasoning

Building the apps clean on a clean substrate boundary is worth more than the attention saved by deferral, given the boundary is load-bearing for every surface (Cortex, Codex, Brief extension, future SmartCity Parcel Intel) that consumes the engines. The freeze was the wrong tool for spine hygiene; the right control is sequencing, not a hard stop. The adjacency firewall (trading, issuance, PE curriculum, IBKR) is unaffected and remains in force for the 90 days.

## Reversal criteria

Re-freeze if extraction work starts pulling cc-agent or operator attention off the wedge ship before Cortex and the extension are in iterated beta, or if M-Stabilize Phase 2C slips far enough that opening extraction would fragment focus. The decision is about removing the hard freeze, not about pulling extraction forward ahead of its M-Stabilize gate.

## Dependencies

Amends `04_roadmap_alignment_audit.md` item 6 and `00d_portfolio_roadmap_reference.md` §5 (engine extraction moves off the frozen list). Gated on M-Stabilize Phase 2C closure per `27_engine_evolution_plan.md` and the 11_roadmap milestone ladder. Does not change the adjacency firewall.

## Counterparties

Internal. Affects the hauska-engine factor-out sprint sequencing and cc-agent-E scope when M-Stabilize clears.
