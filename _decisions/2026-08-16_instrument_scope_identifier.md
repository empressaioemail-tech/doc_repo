---
id: 2026-08-16_instrument_scope_identifier
title: Smart Files instrument scope — node-keyed, and named instrument rather than security
date: 2026-08-16
status: active
applies_to: portfolio
owner: nick
decider: nick
related: [_decisions/2026-08-15_smart_files_module_identity, _rd_disclosure_twin/08_build_scope, _decisions/2026-08-15_digital_economies_session_rulings, 80_adrs/adr_017_atom_access_control]
---

# Instrument scope identifier

## Decision

Financial instrument documents key into Smart Files as:

```
smartfile:instrument:<node_id>:<doc_slug>
```

`instrument` is added to `scope_type` and to the placement `target_type`. The scope identifier is the cockpit security-master node identifier. This closes row TW-1 of the instrument-twin build scope.

## Context

The R&D cohort is the cockpit trade grid, eighteen symbols across three disclosure shapes: four operating companies, two funds, and twelve futures contracts. Only six of the eighteen have a CIK. Any key drawn from the issuer world addresses a third of the cohort and silently fails on the rest, which is the exact failure mode inherited spine constraint 6 warns about, where a wrong reconstruction matches zero rows and reads as an honest absence.

Keying to the node identifier covers all eighteen. It also mirrors the pattern the Bulls implementation already proved, where the node identifier carries identity and email is merely the identity key for one node kind. Under this decision, CIK, ticker, CUSIP, ISIN, and CME root all become identifiers hanging off the node rather than candidates for the key, and they resolve through the identifier index the security-master graph already maintains.

Every external key was rejected for a concrete reason. Tickers are reused and reassigned. CIKs survive corporate reorganizations badly and do not exist for contracts at all. CUSIP and ISIN are licensed, so keying on them would place a vendor license inside a primary key. A node identifier is ours, stable, free of licensing, and cannot be reconstructed from parts, which forces resolution through the security-master where merge links already handle the case of two nodes turning out to be one instrument.

## Why the scope is named instrument and not security

A futures contract is not a security. It is a commodity derivative under CFTC jurisdiction rather than SEC jurisdiction. Naming the scope `security` would encode a legal category error into a CHECK constraint, on a product whose entire claim is provenance discipline. `instrument` is neutral across all three disclosure shapes in the cohort and across the wider financial universe the cohort is meant to test.

## Consequences

Resolution becomes a required hop. An agent asking for a twin by ticker resolves ticker to node first, which the MCP surface already planned as a search or resolve tool. This is the better shape regardless, because it makes ambiguity explicit rather than guessed.

The security-master resolver is currently registered operator-only and described in code as ops and debug. It has to become a served capability before this identifier is reachable by anything other than an operator. That work is row TW-25.

`instrument` becomes the third scope type in production use after `jurisdiction` and `tenant`, and the first whose identifier is neither a numeric FIPS code nor a tenant slug. It therefore needs its own validator in `src/identity.mjs`, and it is the sharpest available test of whether the scope-and-validator design generalizes beyond its first consumer.

Plan Review is the first Smart Files consumer and is live on the `tenant` scope. No migration adding this scope may land without that lane seeing it.

## Reversal criteria

Reverse if the security-master node identifier proves unstable across merges in a way that breaks document identity. The mitigation short of reversal is that merge links resolve a retired node to the surviving one and documents follow the survivor; only a failure of that mechanism is a reversal trigger.

Reverse if a material class of instrument documents proves to be genuinely sub-instrument in identity rather than merely associated to something narrower, and the slug cannot carry the distinction. Per-contract-month documents are the anticipated case worth watching. Association to a contract month, a filing, or an authority is expected and is modeled as a relationship, not as identity, and is not a reversal trigger.
