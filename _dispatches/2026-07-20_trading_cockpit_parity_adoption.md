---
id: 2026-07-20_trading_cockpit_parity_adoption
title: Dispatch record — Cockpit parity adoption (8 items), hand-carried to the trading agent
status: sent
date: 2026-07-20
owner: nick
related: [_catalog/thesis_parity_ledger, _decisions/2026-07-20_cross_vertical_parity_program, 80_adrs/adr_028_contract_cross_vertical_adoption]
---

# Dispatch record: trading cockpit parity adoption

Hand-carried by the operator to the Empressa Cockpit agent (repo empressa-trading) on 2026-07-20, after the cross-vertical source audit. This file is the doc_repo record of what was sent; the Cockpit side works it under its own WDLL practice. Return feed: the Cockpit records landings and its own findings in `docs/PARITY_NOTES.md` (empressa-trading), which the planner reconciles into `_catalog/thesis_parity_ledger.md`.

Sequencing given in the dispatch: items 1, 2, 3 in order, then 4 through 8 as capacity allows. Strengths named as keep-and-protect (do not regress): negative outcome labels, license enforcement, verified absence, bitemporality, consent, PII split store, anchoring.

## Dispatch text (verbatim)

```
Cross-vertical audit result — the real-estate spine (Hauska/Empressa atom stack) was audited
against this repo's spine, and this repo was audited back. The Cockpit's atom/calibration model
is strong: negative outcome labels, per-feed license enforcement, verified-absence semantics,
bitemporality, consent-as-first-class, PII crypto-shred, and Merkle/OTS anchoring are all AHEAD
of the real-estate implementation and are being adopted there. Do not regress any of those.

The following are the Cockpit's weak parts relative to the real-estate spine. Adopt them.
Work WDLL-first per docs/process/WDLL_PRACTICE.md: write the WDLL, get operator approval,
then implement. Do not start all of these at once; sequence 1 -> 2 -> 3, then 4-8 as capacity allows.

1. NO SHARED CONTRACT ARTIFACT. The atom model lives implicitly in Pydantic
   (app/spine/types.py) with no published spec and no conformance validator. The real-estate
   side has a versioned contract package with a conformance validator that REQUIRES and
   verifies invariants (e.g. signed history for data-tier atoms). Build a conformance module +
   test suite that validates atoms against the shared Empressa Atom Specification vocabulary.
   Keep internal field names, but add an explicit mapping table and a conformance test that
   fails CI on drift. While there: access_policy is a 4-value enum (public|paid|internal|private);
   the shared spec is 5-value — add the tenant-shared equivalent.

2. CONFIDENCE REFINEMENTS. Current basis enum is asserted|backtest|live (app/spine/types.py,
   Confidence{n,width,basis}). Adopt from the spine: (a) a distinct "seed" basis so cold-start
   priors are distinguishable from human/heuristic assertions; (b) replace the coarse
   vintage: fresh|stale|decayed enum with hazard-derived validity decay — estimate a change
   hazard rate (lambda) per claim_type from observed change events and decay validity as
   exp(-lambda * age). The spine's amendment-hazard model is the reference: cold-start prior,
   lambda updated from the ledger, decay applied at read time.

3. CALIBRATION GRAIN. get_calibrated_confidence (app/spine/calibration.py) is flat per
   (claim_type, worker). Adopt the spine's adaptive-grain shrinkage: score at the finest grain
   when n is sufficient, fall back to the class grain when sparse, blend by a prior-weight
   pseudo-count instead of a hard MIN_N cliff. Keep the honest 0.5/asserted floor.

4. TILE REGISTRY AS DATA, NOT CODE. TILE_DEFS (frontend/src/focus/FocusShell.tsx) is a
   code-internal array. Adopt the spine's capability-registry pattern: a serializable,
   React-free registry entry per tile carrying {id, label, category, status, requires,
   produces, modes}, served from a backend endpoint, with a CI drift-lock test asserting the
   UI map and the served registry never diverge. This makes AI-composed workspaces
   contract-driven and lets other surfaces (mobile shell, future consumers) discover tiles.

5. DUAL INTERFACE. The co-pilot tool loop (app/ai/tool_loop.py, copilot_tools.py,
   ai/spine_reads.py) already defines clean read-tool shapes, but they are only reachable
   in-process. Expose the read-only research/spine-read tools as an MCP server behind the
   existing Clerk auth, so agent clients can consume the same functions the co-pilot does.
   Read-only tools only; execution/approval paths stay out of MCP.

6. LINEAGE COVERAGE. atom_input_lineage is mandatory only for calibration atoms. Extend
   fail-closed lineage to ALL derived-family atoms: any atom whose family is "derived" must
   carry input lineage or be rejected at append_atom, same as the calibration rule.

7. ANCHORING IS BUILT BUT DORMANT. anchor_seal / anchor_upgrade / anchor_population_seal
   exist in app/jobs/handlers.py but are deliberately unscheduled. Two asks: (a) keep
   app/spine/anchoring/ cleanly module-bounded with no trading-specific imports — the
   real-estate side intends to harvest it as the shared audit-integrity layer; (b) prepare a
   one-page WDLL for enabling scheduled sealing so the operator can decide with costs in front
   of them. Do not enable it without operator approval.

8. DOC HYGIENE. Root HANDOFF.md is stale (2026-05-21, legacy Electron era) while docs/INDEX.md
   is the live map. Retire HANDOFF.md to a one-line redirect to docs/INDEX.md.

Also: a cross-vertical parity ledger is being established in the strategy repo. When you land
any of the above, or make any spine-model finding/breakthrough of your own, record it as one
entry (what changed, why, what the other vertical should evaluate) so the real-estate side can
adopt it. Location of the ledger and the entry format will be added to docs/INDEX.md when it
is created — for now, keep a running docs/PARITY_NOTES.md with dated entries.
```
