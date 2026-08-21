---
decision_id: 2026-08-21_adr028_accept_partial
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - 80_adrs/adr_028_contract_cross_vertical_adoption
  - _inbox/2026-08-20_store_audit_atom_graph.md
  - _blueprint/40_rule_register
---

## Decision

Accept ADR-028 for the verified-absence pair (group 2) as the one field group that shipped. Strike the claim that `knowledge_atoms` proves bitemporality in production: the table exists and holds zero rows (store audit Q10, 2026-08-20T23:03Z). Groups 1, 3, 4, 5, and 6 stay type-only until each has store evidence or an explicit unfed label. A follow-on ADR is owed for contract 1.9.0 through 1.22.0 (`./property`, `./reasoning`, `./testing`), which have no ADR at all. Status becomes accepted-partial, not proposed and not fully accepted.

## Context

ADR-028 is still marked proposed while npm is at 1.22.0. It shipped one of six groups. Section 3 argues from `knowledge_atoms` as production proof. That is V15. Leaving it proposed while fields are live is the same defect class as an artifact that exists and nothing binds.

## Structural commitment check

Confidence is earned: an ADR may not cite an empty table as production evidence. Sell reasoning, not data: verified absence is the contract half of honest-absence, which is the launch thesis.

## Reasoning

Proposed-plus-shipped is ungradable. Full acceptance would ratify a false bitemporality proof and five unfed groups. Partial acceptance names what is real (the pair), what is false (the empty-table argument), and what is still intent (the rest).

## Reversal criteria

Reverse to full acceptance only when each remaining group has either a populated store field or a written unfed label with a consumer. Reverse the strike of section 3 only if a live COUNT on knowledge_atoms is non-zero and the ADR cites that query with a timestamp.

## Dependencies

Depends on store audit Q10. Blocks treating ADR-028 as the canon for 1.9.0 through 1.22.0. Substrate seat owns the follow-on ADR write; operator accepts it.

## Counterparties

Internal. Operator. Substrate seat for the follow-on ADR.

## Operator approval

Operator approved 2026-08-21. Amend ADR-028 to accepted-partial this wave. Do not quarantine it.

