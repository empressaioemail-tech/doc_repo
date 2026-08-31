---
id: 2026-07-20_cross_vertical_parity_program
title: Cross-vertical parity program — trading concept adoption, one-gate ruling, WDLL process
status: active
date: 2026-07-20
owner: nick
related: [_catalog/thesis_parity_ledger, 80_adrs/adr_028_contract_cross_vertical_adoption, 90_runbooks/wdll_practice, _dispatches/2026-07-20_trading_cockpit_parity_adoption, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_005_multitenancy]
---

# Decision: cross-vertical parity program

Ruled by Nick 2026-07-20 in the deep-research session that cross-audited the trading vertical (empressa-trading, Empressa Cockpit) against the real estate spine at source level. Scope note per operator: this program is software development only; business operations threads stay out of it.

## Decisions

**1. The trading vertical is the second reference implementation of the thesis, and the two implementations adopt each other's strengths.** The Cockpit independently rebuilt the atom/calibration model in Python (operator: it was deliberately used to front-run the atom/node concept). Each side adopts the other's verified-stronger parts so the two representations reach their optimal structure. Real estate adoptions enter through ADR-028 (contract, additive) plus a named infrastructure backlog; trading adoptions were dispatched 2026-07-20 (8 items, record filed). Neither side imports the other's vocabulary wholesale; concepts are adopted, mapped, and conformance-tested.

**2. Contract-first catchup, additive only.** The real estate adoptions that belong in the contract land as one additive minor version (1.8.0-class) per ADR-028: license block, verified absence, valid_to plus knowledge time, typed outcome family with negative kinds, instance-level input lineage, PII flags. Existing corpus stays conformant; no breaking change.

**3. One auth gate, ruled by the operator.** The spine has exactly one data-authorization gate and stays that way. Anything else needed lives at the app level. Refinement accepted with the ruling: apps own user identity and role UX; when an app calls the spine it mints the gate's existing claim vocabulary (signed gate context: tenant, product, tier); the gate remains the only decider of what data comes back; no app filters atoms by its own rules. One gate-integrity fix falls out of the audit and belongs to the gate itself, not a second auth layer: the gate currently falls back silently to unsigned tenant headers when the signing key is unset, and this must fail closed when a signing key is expected.

**4. One sync document.** `_catalog/thesis_parity_ledger.md` is the single document keeping the two systems' details in sync: shared theology, per-concept parity table, append-only findings log. Any finding, breakthrough, or improvement in either vertical files one entry; the other vertical's next planning session reviews unadopted entries. Trading-side feed is `docs/PARITY_NOTES.md` in empressa-trading.

**5. WDLL practice adopted portfolio-wide (modified from the Cockpit).** Sprint-scale work requires an operator-approved What Done Looks Like card before implementation and a graded Finish card at close; the Start-vs-Finish diff is the anti-drift record the operator asked for. Runbook: `90_runbooks/wdll_practice.md`; mirrored into `.cursor/rules/wdll-practice.mdc` so Cursor-driven agents follow the same practice.

## Context (what the audit established)

Four source-level audit reports (2026-07-20): the Cockpit full read; atom-contract at 25215fd; hauska-engine content-identical to origin/main; legacy-design-tools at 7e6152b2; hauska-mcp-server gate code. Real estate verified stronger on: contract artifact + conformance validation, confidence type vocabulary (asserted|backtest|seed|live plus three-axis), adaptive-grain calibration with amendment-hazard decay, capability registry with drift-lock, MCP dual interface. Trading verified stronger on: outcome vocabulary with negative kinds and realized scores, per-feed license enforcement, verified absence, bitemporality, consent, PII split store with crypto-shred, Merkle/OTS anchoring, durable DB-backed job queue with worker and heartbeats. Full table in the parity ledger.

## Reversal criteria

If maintaining the parity ledger proves to be ceremony that neither vertical reads (two consecutive planning sessions find stale unreconciled entries with no adoption motion), collapse it to a section inside `09_post_saas_substrate_thesis.md` and drop the trading-side feed. If ADR-028 fields prove wrong in shape during implementation, amend the ADR before publish; nothing ships on npm until the ADR is accepted. If WDLL practice adds friction without catching drift on two consecutive sprint-scale closes (Finish cards grade all-met trivially), narrow its trigger to program-scale work only. The one-gate ruling reverses only by explicit operator decision; any proposal to add a second data-authorization surface must cite this record.
