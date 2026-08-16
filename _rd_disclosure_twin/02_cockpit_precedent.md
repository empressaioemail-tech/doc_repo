---
id: rd_dt_02_cockpit_precedent
title: The birth of the idea — what empressa-trading already runs
status: active
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [rd_dt_01_service_concept]
purpose: Nick's observation 2026-08-15 - the trading app already does a shape of the Disclosure Twin. This doc records what the cockpit runs today (from the 2026-08-13 deep source sweep), why it is the precedent, and how it expands. Different shape, same organism.
---

# The cockpit precedent

Nick's read is correct: empressa-trading already runs a Disclosure Twin - of a brokerage portfolio, at single-operator scale. The mechanism map (verified against source in the 2026-08-13 deep sweep):

| Disclosure Twin element | Already running in the cockpit |
|---|---|
| The referent registry (what is this thing) | The security-master graph: nodes, edges, identifier index, merge links - identity resolution for financial instruments |
| Attestation of state, never value | `conformance/reconcile`: re-fetches positions, holdings, balances, and orders from the broker (SnapTrade), diffs against the platform's own account of them, and writes **every drift as an observation atom**. Detect-only; never auto-corrects. This is literally continuous claim-vs-verified-state attestation for financial assets |
| Honest absence | `conformance/capabilities`: unknown broker capability returned as "unknown," never assumed - gates the order surface on it |
| Provenance on every claim | The spine: append-only atoms with source, method, scope; bitemporal (valid-time and knowledge-time); verified-absence requires stated scope, store-enforced |
| Tamper-evident feed | Merkle anchoring over the atom log: seal, canonical bytes, proof verification - the cryptographic attestation trail institutional consumers of a disclosure feed would demand |
| Rights-clean redistribution | The licensing gate: vendor-license intersection, most-restrictive-wins, `derived_ok` enforced transitively through lineage - the compliance layer any disclosure service redistributing data must have |
| Earned credibility | The calibration ledger: claims graded against outcomes, Beta-Binomial track record - confidence earned, never asserted |
| Metered consumption | Vendor-usage metering; per-claim serving gates |
| Honest-basis disclosure of a composite | The TX100 index lab: declared `data_basis`, reliability tiers, survivorship gaps stated |

## Why this is the precedent and not just a resemblance

The cockpit answers the Disclosure Twin's hardest engineering questions with running code: how to continuously reconcile a claimed state against an authoritative source without becoming the source's editor (drift as filed observations); how to make an attestation log tamper-evident; how to serve verified claims under third-party data rights; how to say "unknown" as a first-class value on a money-adjacent surface. The shape difference is only the direction of the pointer: the cockpit twins **a portfolio against broker truth** (the operator's own assets, inward); the service twins **an issued asset against real-world truth** (a token's underlying, outward, for paying subscribers). Same organism, aimed out the window.

## The expansion path

1. Generalize `reconcile` from broker-vs-platform to **token-claims-vs-twin**: the linkage definition (what the token asserts) becomes the expected state; the twin becomes the observed state; drift becomes the attestation feed's alert class.
2. The Merkle-sealed log becomes the subscriber-facing proof surface (attestations verifiable without trusting us - the DownloadableAtom posture applied to feeds).
3. The licensing gate becomes the redistribution-compliance layer for underlying data with vendor rights attached.
4. The security-master pattern becomes the asset-identity registry across classes (the platform-global node ruling, applied to instruments).

Strategic note: this makes the Disclosure Twin the fourth independent expression of the architecture (property spine, cockpit spine, franchise platform, and now the outward-facing attestation service) - and the cockpit's conformance layer, built for one operator's own safety, turns out to be the prototype of the most institutionally sellable product in the portfolio.
