---
id: rd_dt_09_twin_read_contract
title: The twin read contract v0.1 — TW-2, and the WDLL for the instrument twin
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [rd_dt_08_build_scope, _decisions/2026-08-16_instrument_scope_identifier, _decisions/2026-08-15_smart_files_module_identity, 90_runbooks/wdll_practice]
purpose: Row TW-2 of the instrument-twin build scope. Declares what a twin returns across all three disclosure shapes, the absence semantics, the shape-to-layer applicability matrix, and the version scope. Written against verified upstream reachability rather than assumed capability. Approved 2026-08-16 on the operator's delegation of the four open calls, which are recorded with their reasoning at the foot.
---

# The twin read contract, v0.1

## What this is

Row TW-2, and by the trading repository's own `docs/process/WDLL_PRACTICE.md`, the What Done Looks Like document that carries operator approval before implementation starts. Approved 2026-08-16, with the four open calls delegated and resolved at the foot of this document.

It exists because governing rule 3 says the contract is declared before it is served, and because after the standalone ruling the union layer became the spine of the plan. Both doors are thin clients over this shape, so everything downstream inherits whatever is wrong with it.

It is written against the reachability map run on 2026-08-16 against `empressa-trading` `origin/main` `44664f6c`, not against what the cockpit appears to contain. That distinction is the reason this document is worth anything.

## The governing principle of this version

**The contract declares only what it serves.** A layer that is not built is not in the schema at this version, and `contractVersion` tells the consumer exactly what to expect.

This replaces an earlier draft in which unbuilt layers were to return `lookup-failed` until they were wired. That was wrong. `lookup-failed` means we could not look, which reads as transient, and a consumer cannot distinguish an upstream outage from a capability we never built. Shipping it would mean every twin permanently broadcasting a false signal on a headline layer, using the exact machinery this product sells as its differentiator. Absence is reserved for facts about the world, never for facts about our backlog.

## Version scope

| Layer | v0.1 | v0.2 | Why |
|---|---|---|---|
| room | yes | | Smart Files is service-callable today |
| roster, company shape | yes | | DEF 14A and Form 4 are public and bounded |
| roster, fund shape | | yes | trustees, officers, and the adviser are different semantics, not the company shape reused |
| drivers | yes | | econ catalog pattern plus new sources |
| market.quotes | yes | | price, history, chain, depth, tape, volume profile are anonymous-reachable today |
| market.computed | | yes | regime, crossover, heatmap are user or operator scoped; blocked on TW-24 |
| synthesis | yes | | composes over whatever the version serves |

## Upstream reachability as of 2026-08-16

| Source | Status today | Consequence |
|---|---|---|
| Cockpit price, history, chain, depth, tape, volume profile | anonymous-reachable | `market.quotes` ships in v0.1 |
| Cockpit computed signal: regime, crossover, heatmap | user or operator scoped | `market.computed` deferred to v0.2, gated on TW-24 |
| Cockpit zone atoms | operator-authored, keyed on `AtomRow.user_id` | excluded from public twins at every version, per TW-26 |
| Cockpit fundamentals, econ, intelligence | user-scoped | drivers gated on TW-24 |
| Cockpit security-master resolver | operator-only, labelled ops and debug | resolution gated on TW-25 |
| Cockpit spine atom serve | two user-scoped, two operator, one open | filing and provenance reads gated on TW-24 |
| Smart Files | service-callable via Bearer service token | room ships in v0.1 |
| EDGAR provider | filing index atomized; document bodies not fetched | room holds filing metadata now, bodies after TW-5 |

One missing auth leg, TW-24, gates four of these. That is why it is the first build row.

## The shape

```jsonc
{
  "contractVersion": "0.1.0",
  "node": {
    "id": "node:instr:...",
    "kind": "instrument",
    "displayName": "Apple Inc.",
    "assetClass": "equities",
    "shape": "operating-company",        // operating-company | fund | contract
    "identifiers": [
      { "scheme": "ticker", "value": "AAPL",       "source": "security-master", "asOf": "..." },
      { "scheme": "cik",    "value": "0000320193", "source": "sec-ticker-map",  "asOf": "..." }
    ]
  },
  "authorities": [
    { "authority": "SEC", "role": "issuer-disclosure",
      "coverage": "submissions index, all forms, 2024-01-01..2026-08-16",
      "lastObserved": "2026-08-15T06:15:00Z" }
  ],
  "layers": {
    "room":      { "status": "populated", "documents": [ /* ... */ ] },
    "roster":    { "status": "absent",    "absence": { /* ... */ } },
    "drivers":   { "status": "populated", "series": [], "proxies": [] },
    "market":    { "status": "populated", "quotes": { /* ... */ } },
    "synthesis": { "status": "populated", "text": "...", "citations": ["atom:..."] }
  },
  "provenance": {
    "generatedAt": "2026-08-16T14:02:11Z",
    "contractVersion": "0.1.0",
    "upstreams": [
      { "name": "cockpit",     "status": "ok" },
      { "name": "smart-files", "status": "ok" }
    ]
  }
}
```

Every layer carries a `status` of `populated`, `partial`, `absent`, or `not-applicable`. Anything other than `populated` carries an `absence` object explaining why. No layer is ever an empty array with no explanation.

## Absence semantics

```jsonc
{
  "verdict": "absent-verified" | "lookup-failed" | "not-applicable",
  "authority": "SEC",
  "scopeSearched": "EDGAR submissions for CIK 0000320193, form DEF 14A, 2024-01-01..2026-08-16",
  "determinedAt": "2026-08-16T14:02:09Z",
  "basis": "no matching filing in the submissions index"
}
```

`absent-verified` means we looked, in a stated scope, and it is genuinely not there. `lookup-failed` means we could not look, and must never be reported as the former. Both come from the Smart Files store, which already enforces the distinction.

`not-applicable` means the category does not exist for this node's shape. It is the difference between "gold has no proxy statement on file" and "issuer disclosure is not a thing a futures contract has." Reporting the second as `absent-verified` implies a search that might one day succeed.

There is deliberately **no verdict meaning "not built yet."** That case is handled by `contractVersion` and the version scope table, per the governing principle above.

## Applicability by shape

The room is keyed to the authority rather than the asset class, so it applies to all three shapes and holds different documents from different bodies. Only the roster is structurally inapplicable.

| Layer | operating-company | fund | contract |
|---|---|---|---|
| room | SEC filings, issuer-contributed material | N-CSR, N-PORT, prospectus, SAI, sponsor holdings | CME contract specification, rulebook chapter, delivery and warehouse notices |
| roster | officers and directors from DEF 14A, insiders from Form 4 | trustees, officers, adviser (v0.2) | `not-applicable` |
| drivers | company and macro series | fund and macro series | CFTC positioning, EIA or Treasury or USDA series, macro |
| market | applies | applies | applies |
| synthesis | applies | applies | applies |

A consumer reads `node.shape` to know what to expect and the per-layer verdict to know why any particular layer is not populated. Those are two different questions and both need answers.

## Layer specifications

**Room.** Documents come from Smart Files at `smartfile:instrument:<node_id>:<doc_slug>`. Each entry carries the entity identifier, title, content type, byte size, content identifier, version, access policy, and the version's provenance.

The body returns the addressable identifier, never inline bytes. The union layer additionally exposes a fetch endpoint that streams from the files service without persisting anything, so a caller gets one door and one credential rather than a document identifier it cannot resolve.

**The constraint that makes this safe: the union forwards the caller's entitlement and never substitutes its own service credential.** If it fetches as itself, it becomes a confused deputy and an anonymous caller receives tenant-private bytes. Enforcement stays at the files service; the union forwards identity and holds nothing.

**Roster.** People are platform-global nodes carrying `trust_level`. Edges carry role, `started_at`, and `ended_at`, so a board seat is temporal rather than a current-state flag. Form 4 transactions are atoms with filing accession and date in provenance. A person appearing at more than one issuer is one node, which makes the cross-issuer query an edge traversal rather than a feature.

The fund shape does not borrow this. A fund's people are trustees, officers of the trust, and the investment adviser, and rendering those as directors would be a silent substitution. It is deferred to v0.2 rather than approximated.

**Drivers.** Series follow the econ catalog pattern with source, series identifier, transform, units, and release match. Proxies are a separate array, never mixed into `series`, and every proxy entry carries `proxyFor`, an explicit marker, and its own provenance. This is where the current `FUTURES_FUNDAMENTALS_PROXY` behaviour becomes honest rather than removed.

**Market.** v0.1 serves `quotes`: price, history, chain, depth, tape, volume profile, all anonymous-reachable today. `computed` arrives at v0.2 with TW-24. Operator-authored zone atoms appear in neither, at any version.

**Synthesis.** The model narrates and never generates numbers. Every number in `text` traces to an identifier in `citations`. This is the adaptive-panel discipline the cockpit already enforces, lifted into the contract so the agent door inherits it.

## Worked examples at v0.1

**AAPL, operating-company.** Room populated with SEC filings. Roster populated from DEF 14A and Form 4. Drivers populated with company and macro series and an empty proxies array. Market populated with quotes. Synthesis populated with citations. No layer reports an absence caused by us.

**SPY, fund.** Room populated with N-CSR, N-PORT, prospectus, and the sponsor holdings snapshot with its as-of date. Roster absent at v0.1 by version scope, not by verdict. Drivers, market, and synthesis as above.

**/GC, contract.** Room populated with the CME contract specification and rulebook material, and carrying an explicit `not-applicable` for the issuer-disclosure authority so a consumer can tell a gap from a category error. Roster `not-applicable`. Drivers populated with CFTC positioning and macro series, plus a proxies array containing GLD marked as a proxy with its own provenance rather than presented as gold's fundamentals. Market populated. Synthesis grounded only in what exists.

The `/GC` response is the one that proves or breaks the design. A naive implementation returns something that looks broken; a correct one returns something that reads as deliberate.

## Access policy at read

An anonymous caller sees `public-free` content only. A keyed caller sees what the key entitles. `tenant-private` content requires that tenant's credential and is never reachable by the anonymous path. Access policy is resolved at read time per ADR-017 and is a property of the record rather than of the route.

## Versioning

Semantic, on `contractVersion`, present in the envelope and in the provenance block. Additive fields are a minor bump. Removing a field, changing a field's meaning, or adding a value to an enum is a major bump. The standalone surface pins a major version, which is what makes the human-door-renders-only-agent-door-output rule enforceable rather than aspirational.

## What this contract deliberately does not do

It carries no valuation, no rating, no target, no recommendation, and no ordering. It states what is, with provenance, and where it does not know, it says so with the scope it searched. That is the attest-state-not-value line drawn at the field level rather than asserted in prose.

## The four calls, resolved 2026-08-16

**`not-applicable` stays a twin-layer concept and does not enter the Smart Files store yet.** The store's `smart_file_absence_determinations` table is keyed on `entity_id`, so its verdicts are statements about a lookup of one specific document. `not-applicable` is a statement about whether a category exists for a node's shape. Landing it in that table would mean minting an entity identifier for a document that will never exist, in order to record that it will never exist, which later reads as data. Logged as the first TW-23 divergence finding. Revisit trigger: if Plan Review independently needs the same distinction, it is general and belongs in the store.

**TW-24 is the first build row, and `market.computed` waits for v0.2.** This was framed as pulling TW-24 forward, but amendment A-2 had already placed it at L1 because it blocks TW-25, which blocks resolution, which the ratified scope identifier depends on. One auth leg unblocks drivers, fundamentals, econ, spine reads, and identity. It is a credential check in a dependency, not a build.

**The fund roster is deferred to v0.2 and explicitly not borrowed from the company shape.** Two of eighteen symbols, and the roster layer already proves it generalizes by returning `not-applicable` for contracts, so a third roster semantic adds depth rather than R&D signal. Worth noting for v0.2: the adviser relationship is an entity-to-entity edge rather than a person edge, so building it will exercise the edge model in a way nothing else in the cohort does.

**The room returns an identifier plus a non-persisting pass-through fetch on the union layer.** Identifier-only was half right: an MCP tool returning a document identifier the caller cannot resolve is a bad tool, and a browser client would otherwise need files-service credentials. The pass-through keeps enforcement at the files service while giving the caller one door. The confused-deputy constraint above is the part that must be tested, not just written.
