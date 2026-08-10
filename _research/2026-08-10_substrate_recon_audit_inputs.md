---
id: research_2026_08_10_substrate_recon_audit_inputs
title: Substrate recon (SDK + spine) — findings and inputs for the pre-build audit
status: active
last_updated: 2026-08-10
applies_to: [hauska, empressa]
owner: nick
related: [80_adrs/adr_018_atom_contract_substrate_layer, 25_atom_architecture_reference, 53_hauska_sdk_completion_sprint, _verticals/oil_gas/87_og_lifecycle_framework]
---

# Substrate recon — audit inputs

**Operator ruling (2026-08-10 ideation close): an audit runs before any further substrate building.** This doc is the recon that triggered it and the finding list the audit starts from.

**Method and staleness caveat.** Four parallel read-only recon agents over local clones (Hauska SDK at `P:\Hauska SDK`, hauska-engine, hauska-mcp-server + hauska-atom-contract, legacy-design-tools) plus live npm checks, executed during the ideation session. Clone HEADs ranged from 2026-06-07 (SDK) to 2026-07-04 (engine; its og packages were then confirmed on origin/main at `8909a24`). The repos have moved since; **every finding below must be re-verified against live state (gh/npm/gcloud) at audit time.** npm facts were live-checked at recon time.

## Settled architecture, restated (do not relitigate at audit)

Two layerings, both canon, not in conflict: (1) the value stack: data-level atoms are VDA-backed with cryptographically anchored history (25_atom_architecture_reference glossary; conformance requires signed event chains on data-tier atoms); (2) the package graph: the contract npm package has zero runtime dependency on `@hauska-sdk/*` (ADR-018; "the SDK can wrap contract-conformant atoms in VDAs... without forcing the contract to know about VDAs"). The atom builds on top of the SDK at runtime for data-tier/paid surfaces; the packages stay peers.

## Findings

**F1 — The VDA wiring gap (the headline).** The canon says data-level atoms are VDA-backed; at recon time zero spine atoms were. The corpus (34+ jurisdictions), the O&G atoms, and the adjudication events are not VDA-wrapped; anchoring in prod uses the contract's own chain service (atom_events), not the SDK. Architecture settled long ago; execution never happened on the spine side.

**F2 — Contract scope fork with untracked source.** `@empressaio/atom-contract@1.7.0` (carrying the O&G ontology, incl. WELL_SCHEMA) published 2026-07-07 from the hauska-atom-contract repo, but (a) under the `@empressaio` scope while branding canon says the contract keeps `@hauska`, and (b) from source not on that repo's main at recon time (no og module, no 1.7.0 tag there). Same untracked-source class as the 1.5.0 rescue. Two divergent published lines existed at recon: `@hauska/atom-contract@1.6.1` and `@empressaio/atom-contract@1.7.0`; engine og-sources builds against the fork. **Audit: reconcile scope, confirm source is committed, converge the lines.** (Note: later portfolio records show `@empressaio/atom-contract` at 1.7.0 ratified as the going name in the 2026-07-06 branding decision; the audit should confirm which scope ruling is current canon and retire the loser explicitly.)

**F3 — What the SDK actually is (published on npm, 13 packages at 0.1.x).** CNSSDK orchestrator (wallet + payment + VDA + IPFS retrieval + EventAnchoringService) with flows `purchaseAndMintVDA` and `createDataRoom` (mint ownership record + pin encrypted doc + timed access pass + per-viewer PDF watermark). Payment: x402/HTTP-402 USDC rail (EIP-712 challenge, on-chain Transfer verification, Base/ETH/Polygon), Circle fiat rail (payment intents + webhooks), RevenueRouter (injected 150-250bps take, TWO-WAY split only, ledger entry not disbursement). VDA spokes already include oil-gas; asset types include deed/permit/well-log/invoice/access-pass; api14 is a first-class search key. The marketplace origin is confirmed in the type system; what is missing is the market (no listing/offer/order/escrow objects anywhere).

**F4 — SDK gaps against the lifecycle vision.** No escrow/conditional release; no N-way splits; no Circle payouts (inbound only); wallet custody is in-memory only (restart loses keys; generateSeedPhrase throws); `adapters-blockchain-ethers` (the on-chain anchor with a CNS Registry ABI: mintVDA/createAccessPass/recordPayment) is orphaned and its contract undeployed; `adapters-ipfs-pinata` is an empty published stub; `node-manager` is a published scaffold that throws. CNS-era branding pervades (README "CNS Protocol SDK") with no actual identity system under it.

**F5 — Anchoring rung 1 is live; rung 2 is a declared seam.** cortex `atom_events` (prev_hash/chain_hash, advisory-locked append via the contract's PostgresEventAnchoringService) anchors finding adjudications in prod; schema docstring: "Cryptographic anchoring (Merkle root, external ledger anchor) replaces the chain hash at M2-C without any schema change." Engine-side corpus atoms carry sha256 content hashes only (no chains); the evidence ledger is a derived read-model over atom_events joined to finding citations by atomId string (no FK, no hash binding of lineage edges); KeyCustody signing is an unimplemented stub.

**F6 — Contract types the lifecycle products need that did not exist at recon:** actor atoms (ADR-015 accepted 2026-05-16; only opaque actor_id strings + EventActor stamps in the published `@hauska` line; possibly in the 1.7.0 fork, unverified), procedure-execution atoms (only a `procedureExecutionCid` reference field), revenue-allocation-unit (ADR-025; zero references), listing/offer/order types. Audit: establish which of these landed since.

**F7 — Three billing systems, none unified.** Live Stripe cents-wallet in ldt brokerage (subscriptions, top-ups, compute-debit ledger); built-but-unconsumed SDK metering (tier bundles + Circle overage checkout + revenue split; its intended consumer is the MCP gate, which does not import it); demo-only ICC pay-per-query in the MCP server (SQL views, every row NOT-CHARGED, no Stripe/Circle/USDC anywhere in the gate). Duplicated primitives across stacks: two event-anchoring services (SDK EventAnchoringService vs contract history.ts), two dataroom concepts (SDK VDA+IPFS rooms vs cortex attached_documents on object storage), multiple content-hash implementations.

**F8 — Engine misc.** pipeline-runner and packages/workspace confirmed zero-caller (deferred, consistent with repo_intents); retrieval hydrates from a committed snapshot; IPFS/IPNS ports are stubs. (Engine og-sources/og-title were on origin/main at recon.)

## Audit charter (proposed scope)

1. Re-verify F1-F8 against live main + npm + deployed services; retire anything already fixed by the August waves.
2. Rule the contract scope/fork (F2) and converge published lines.
3. Decide the VDA wiring path (F1): which atom families get VDA backing first and where anchoring consolidates (SDK service vs contract service; one, not two).
4. Unify the metering/billing story (F7) before any new monetized surface.
5. npm hygiene: unpublish/deprecate the orphan stubs (F4); de-CNS the SDK branding.
6. Custody decision (F4): wallet persistence + KeyCustody before any settlement feature.

The lifecycle vision consuming these findings: [`_verticals/oil_gas/87_og_lifecycle_framework.md`](../_verticals/oil_gas/87_og_lifecycle_framework.md).
