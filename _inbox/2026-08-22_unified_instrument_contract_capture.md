---
id: 2026-08-22_unified_instrument_contract_capture
title: The unified instrument contract — design capture, benchmark, and thesis validation
status: capture
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
related:
  - _rd_disclosure_twin/09_twin_read_contract
  - _rd_disclosure_twin/14_instrument_data_map
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance
  - _decisions/2026-08-22_atom_layering_target_state
  - 80_adrs/adr_017_atom_access_control
  - 80_adrs/adr_011_atom_identity_across_versions
  - 77_place_graph_strategy
  - 09_post_saas_substrate_thesis
purpose: Source material for a governing document that supersedes neither the atom contract nor the twin read contract but sits above both. Written 2026-08-22 from two verification sweeps, a markets seat audit, and a read of smart-markets. Not itself governing. The governing document gets a root numeric slot when written.
---

# The unified instrument contract

## Why this exists

Two tracks built the same idea in parallel and each built the half its environment forced it to build. Markets gets outcomes whether it asks or not and a disclosure that lies is a legal problem, so markets built evidence and interface. Property has counterparties and a gate, so property built economics. Neither environment forced identity, so neither built it, and identity is the defect both tracks share.

Scored by the markets seat on 2026-08-22, the markets atom is identity 3.5, evidence 3.5, interface 3.0, economics 1.0. The property side has not been scored on the same scale by a seat and should be, but the two verification sweeps place it as the inverse: economics strongest, evidence weakest.

There are not two systems. There is one system with two instantiations.

## The benchmark

A record is an instrument when a stranger and a machine can act on it without asking anyone's permission or writing an integration. Four properties, each with a failure test, because a standard that cannot be failed is not a standard.

**Identity. You can point at it.** One identifier resolves to one thing, for anyone, forever, stable across every correction, restatement and enrichment of what it names. It fails if the identifier changes when the record is corrected, if two systems name the same thing differently and a human reconciles them, or if resolving requires knowing the source.

**Evidence. You can check it.** The chain from claim to source document travels with the record and can be walked without the issuer's cooperation. Confidence is stated with its basis and is scoreable against outcome. Absent, zero and unmeasured are three distinguishable states. The issuer is named, answerable, and carries terms. A third party who was not present can verify later what was said, from what, at what confidence, and that nothing has changed since. It fails if checking requires calling someone, if a missing value and a measured zero look the same, or if the confidence cannot be scored against what happened.

**Interface. A machine can use it without an integration.** The record describes itself at the depth the consumer needs, and differently to an agent than to a person, from one definition rather than two implementations. It declares what it composes and what it attaches to, so traversal replaces querying. It declares in advance the events that can happen to it. It fails if consuming it requires someone to write a mapping, if the shape varies by source, or if a lifecycle event exists that consumers were never told could occur.

**Economics. Using it is a transaction.** The record has an owner and terms, and the ask has a price, and both live in the contract rather than in an out-of-band negotiation. Every use is counted, attributed, and settled to the owner. It fails if reading it is free to the reader and worthless to the owner, if payment requires a bilateral deal per consumer, or if the meter counts while the rate is null.

### The acid test

Could an agent that has never heard of us, acting for a party that has never heard of the issuer, rely on this record in a transaction with real consequence, and could the issuer get paid for that, with no human in either loop?

If yes, it is an instrument. If any step needs a person, a negotiation, or an integration, it is a document with good metadata.

### What the benchmark does not require

It does not require the record to be correct. Instruments are wrong sometimes, and that is what an answerable issuer and a walkable evidence chain are for. A standard demanding correctness would be unachievable and would turn every error into a scandal instead of a correction.

It does not require a blockchain. Settlement may use one; the record does not need one, and provenance is better off not on it.

It does not require us to hold the bytes. A federated record at the owner's own address satisfies all four properties, and holding it satisfies none of them by itself.

It does not require the record to be public. A tenant-private record is a complete instrument for the parties entitled to it. Access policy is orthogonal to instrument-hood, and getting that wrong is what would break the private axis of the product.

## The words

Both codebases use these terms differently, and that difference produced a modelling error in this document's first draft. Fixed here.

**Node.** A thing that exists and can be pointed at: a minted opaque id, a shape, and aliases. It carries no facts. Parcel, issuer, security, jurisdiction, actor, structure, document. Identity and nothing else. Nobody disputes whether a node exists as a handle; they dispute what is true of it.

**Atom.** One claim, from one authority, at one time, about a subject expression. It carries the subject, the claim type, the value, the provenance class with that class's required fields, confidence with its basis, valid time and knowledge time, and access policy. Immutable: superseded, never updated.

**Edge.** A typed relation between nodes, carrying its own provenance. An edge is an atom whose value is a node rather than a scalar, which is what gives edges provenance, confidence and bitemporality without inventing a second mechanism.

**Layer.** A named bundle of atoms about one node, reported with a single status and one absence verdict when it is not populated. A read concept, not a storage concept.

**Instrument, or twin.** The composed view of a node: identity, shape and layers, as of a moment, under a lens. Assembled per request, not stored. This is what a customer receives and what a counterparty verifies.

**Lens.** The declared composition: which layers, required or optional, for which job. The unit of ask, meter and price.

## The contract

### Identity, and this is the whole fix

    id          minted, type-prefixed, opaque, immutable
                sec_ iss_ opt_ | parcel_ juris_ actor_ struct_ doc_
                never a natural key, never derived from content
    aliases[]   natural keys: symbol, CUSIP, APN, county:parcel, address
                each carrying validFrom / validTo AND knowledgeTime
                an alias resolves to an id; an id is never an alias
    lineage[]   merge and split links; canonical() resolves transitively

A natural key is never identity. `48021:34137` and `GOOGL` are both aliases. They change, they get reused, they are ambiguous under prefix matching, and they encode a filing convention into a primary key.

Identity is bitemporal on the alias rather than on the node. Markets already does this with alias-era atoms carrying valid time and knowledge time, collapsed at read. Property needs it more, because parcels split and combine far more often than tickers change.

The id shape is enforced at write by a type the compiler carries and a store boundary that refuses. Markets writes `entity_id` verbatim with no shape validation while its own spec says never a symbol. Property placements take a bare text target with no foreign key. Same defect, both tracks, independently arrived at. A docstring is not a control.

### Shape, which decides what is applicable

    shape   operating-company | fund | contract
            parcel | jurisdiction | structure | corridor | actor | document

Shape is what lets a layer be legitimately `not-applicable` rather than missing. A futures contract has no issuer. Unincorporated land has no zoning authority. Today the property ledger scores such land at zero percent covered, reporting a gap where the correct answer is that the category does not exist for this shape. Shape plus `not-applicable` fixes that at the type level rather than in a scorer.

### Subject, and this is where the store went wrong

    governedBy   the node whose authority makes this claim true

    subject      extensional   one named node
                 intensional   the set selected by a predicate:
                               shape, predicates, jurisdictional bound, time bound

An atom's subject is not necessarily one node. One building code section applies to a region. One covenant binds a subdivision. One flood panel covers a geography. Those are single claims about sets, and modelling them as claims about individual nodes is the defect that produced the store as it currently stands.

The evidence was in the enumeration all along and was misread once as scale:

    parcel-node            13,793,200
    flood-hazard-fact      13,197,039     95.7% of parcels
    rail-corridor-fact     13,059,613     94.7% of parcels
    rrc-pipeline-fact      12,519,688     90.8% of parcels
    special-district-fact  20,844,039    151.1% of parcels

There are not thirteen million distinct flood facts in Texas. There are a few thousand panels, one rail network, one pipeline network. Those tables hold a small set of region-scale claims copied once onto every parcel they touch. The headline row count is write amplification, not coverage.

Four things follow from moving the subject into the atom.

Write amplification disappears. A flood map revision supersedes one atom rather than rewriting thirteen million rows. This is why updates are expensive today.

Forward consequence becomes cheap and correct. What a code change affects is the evaluation of a selector, returning a set, one to many by construction. The property side cannot answer that question today not because edges are missing but because nobody modelled the set, so there is nothing to evaluate. This supersedes the claim in this document's first draft that fan-out follows from governance keying alone; governance says who makes the claim true, the subject expression says who it reaches, and only the second one answers the question.

Coverage stops lying. Coverage is the evaluation of a selector against the node population, derived rather than counted, which removes the row-count and prefix-match measurement failures at the root.

And it names the architectural fork the two tracks took without either being aware of it. Markets composes per request and persists nothing. Property materialises at write. Markets took the correct branch.

**A selector must be deterministic and re-evaluable.** Same selector, same store state, same set, every time. That is what makes an intensional atom verifiable by a stranger, who can re-run the predicate and get the same answer. It is the evidence property applied to a set rather than to a value. A selector that depends on evaluation order or on a mutable side table nobody versions is not an instrument.

**Materialisation is a declared cache and never a Record.** There are good performance reasons to precompute which parcels a flood panel touches. Such a row is a Derivation carrying `derivesFrom` to the selector atom and naming its derivation method, it may be discarded and rebuilt without loss, and it must never be presented to a consumer as a measurement about their parcel.

### Layer, the unit of composition

    status            populated | absent
    provenanceClass   Record | Observation | Derivation | Synthesis
                      (Attention and Judgment reserved, carrying no layer)
    accessPolicy      public-free | public-paid | platform-internal
                      | tenant-private | tenant-shared
    eventTypes[]      the vocabulary of what can happen to this layer
    when populated    payload plus the fields this class requires
    when absent       verdict    absent-verified | lookup-failed | not-applicable
                      authority  who we asked
                      scopeSearched  where we looked, including the entitlement bound
                      asOf
                      basis

Adopted from the twin read contract unchanged, with `eventTypes` carried across from the atom registration. Record cites the authority and the fetch. Observation states the measurement. Derivation states the formula and its inputs. Synthesis cites every number. The class rides on all four status branches, so an absence still tells a consumer what kind of thing is missing, and a layer cannot be re-classed in transit onto a weaker obligation.

### Lens, the unit of ask, meter, and price

    lens   name        siting | title | underwriting | operations | capital | disclosure
           shapes[]    which node shapes it applies to
           layers[]    which layers it composes, each required or optional
           onAbsent    answers-degraded | refuses
           audience    agent | human, selecting rendering only, never content
           meter       the unit that is counted and priced

A caller does not ask for layers. A caller asks for a lens, and the lens declares its own composition. This is the piece neither track has as a first-class object and it does four jobs at once.

It lets one instrument serve different purposes without different records.

It makes degradation declared rather than accidental. A lens requiring flood that receives `lookup-failed` either refuses or answers labelled degraded, and which one it does is in the contract rather than in a merge function's oversight.

It makes the human and agent surfaces structurally identical in content, because audience selects rendering only.

And it is the billing unit. Terms attach to the record; price attaches to the lens. The lens is the job.

### Economics

Licensing terms on the source actor. Rate on the record. Attribution per call. Entitlement resolved at read against the record's own access policy and never against a route. A credential that cannot be resolved is a 401 and never a silent downgrade to the public path, because a revoked key answered with public content reads to its holder as a working key over a thin catalog.

### What the contract must refuse to contain

No verdict meaning "not built yet." A layer absent at a version is absent from the schema at that version, and a payload carrying it fails validation.

No withholding verdict. Withholding is a fact about the caller rather than about the world, so it rides in `scopeSearched` as the entitlement bound with a count in `basis`, and never names whose policy withheld it, because "there is more here" must not become "a tenant holds private material on this subject."

No branch that adds a record. The gate is a ceiling and never a floor, and an upstream verdict is never upgraded in transit.

## Thesis validation

The line is that we turn records into instruments, and under this contract the output satisfies the four-property definition by construction. The markets repo already calls its output an instrument twin. The claim is the schema's name for what it emits, not language wrapped around a database.

Every number shows its work upgrades from a promise to a schema requirement: a number that cannot show its work fails validation.

When we do not know, we say so and say where we looked is typed absence rendered as English. That sentence was written in the positioning narrative in August and the schema carrying it was approved on the sixteenth.

File, publish and collect are contract operations rather than machinery. File is a document-shaped node at `tenant-private`. Publish is a change to the record's own access policy, immediately effective because entitlement resolves at read against the record. Collect is the lens meter attributing to the owner through licensing terms. There is no marketplace to build, and because the gate is a ceiling, publishing can only widen reach and never break an existing entitlement.

Smart Files works without a special case. A Smart File is a `document`-shaped node whose authority is the tenant that authored it, provenance class `Record` citing that authority and that upload, access policy on the record, reaching parcels and instruments through `appliesTo`, with `smartfile:` becoming an alias that resolves to a minted id rather than being the identity. The integration pattern is proven: markets consumes Smart Files end to end through a union that returns identifiers rather than bytes and forwards the caller's own credential rather than substituting its own.

Ask what happens next returns as a claim only after the re-keying lands. It is the one claim in the set whose truth depends on work rather than on the contract.

## Amendments this capture makes to earlier positions

Price is not a property of the record. Terms attach to the record and price attaches to the lens, because one record is worth different amounts depending on the job it serves.

Authority does not get its own type. The authority is required to be named, and external versus tenant is a value rather than a fork, which generalises to authorities not yet met.

The declared event vocabulary was dropped from the first sketch and is restored above.

## The scope question closes

`77_place_graph_strategy` says resolve a location; the positioning narrative says people, places, things and records. Under this contract shape spans parcel, jurisdiction, actor, structure, document, security, issuer and contract. The place graph is one shape family. There is no divergence to resolve; there is a contract broader than the strategy doc, and the strategy doc gets amended to the thing that was built.

## What this buys in the market

The positioning narrative offers "built three times, independently, in two languages, across three industries" as evidence that the parts agree because they were forced to. That is an anecdote about convergent evolution. If this contract lands it becomes a shipped fact: one contract, many shapes, three verticals, one identity spine, one absence vocabulary, one provenance class system, one lens mechanism, one meter. That is the claim that makes this infrastructure rather than a strong vertical product, and it is the only version of "we build digital economies" that is descriptive rather than aspirational, because an economy needs one instrument definition that many markets can trade on.

## Delivery, and what points back

The shape is a certificate authority plus a registrar, not a data vendor. A certificate authority signs a certificate without ever seeing the private key. We sign what we never see.

The customer runs our code locally, in a command line tool, a desktop agent, or their own agent invoking it as a tool, and points it at a folder or a linked drive. What goes up the wire is the proposed shape per document, content hashes and never content, the declared authority, the provenance class, the proposed access policy, and the alias set. What comes back is minted ids, a countersignature over the hashes, the contract version, and a conformance result naming which fixture failed when one does. Bytes never move. The folder stays where it was and the customer walks away with instruments that verify anywhere, indefinitely, without us being reachable.

We attest form, identity, and who asserted it. We do not attest that the content is true and have never claimed to, which is why signing what we never read is the design working rather than a compromise.

Ten documents in does not mean ten atoms out. It means document-shaped nodes with identity, hashes, ownership and time, which is free of judgment; plus atoms extracted from their contents; plus edges binding them to nodes that may already exist in the namespace, which is how a stranger's document attaches to the public record with no integration. Where the documents concern one subject, what the customer walks away with is one instrument whose room is ten times richer. The product is documents becoming evidence attached to the thing they are about.

Four things point back, strongest first. **Resolution**: we mint the identifier, so any counterparty handed one must resolve it here, which is the position CUSIP holds while owning no securities. **The join**: an instrument alone is a document with an id, and a lens composing it with zoning, code, flood, encumbrance and market context is ours, which is where the meter sits. **Score and time**: a publisher's track record is computed across many publishers against outcomes and cannot be self-issued. **Publication**: optional, and upside rather than toll.

The line is therefore give away the mint, charge for the join. Minting, holding, and private use are free or near free. Composition with the world is the transaction.

Two constraints govern this and both come from existing canon. Verification stays free and unauthenticated, because an attestation you must pay to check is not an attestation; verifying an instrument you were handed is free, resolving what it currently points at is metered, and those are different questions. And the holder can leave: on exit they keep the instruments, the ids, the signatures, and the ability to verify indefinitely, forfeiting only the join and the score. That is a dependency on a service rather than a hostage, and it is what the sovereignty root in `03a_positioning_framework` requires.

## Conformance, or this document becomes the defect it describes

This contract is a large object, and the defect class catalogued on 2026-08-22 is precisely the large correct object that nothing implements. The governing document therefore ships with golden fixtures, one per shape and one per absence verdict, and a rule carried verbatim from the twin read contract: where the document and a package disagree, the document wins and the package is wrong.

A surface may claim conformance only by passing the fixtures. A claim of conformance without a passing run is the defect this contract exists to end.

## The open question, named but unanswered

Instrument creation is currently artisanal. The operator and an assistant make atoms by hand. Smart Files is intended to be the answer and is not yet.

The question the governing document must not foreclose: **what is the self-serve path from a stranger's pile of documents and data to conforming instruments, with nobody from this company in the loop?**

That is the difference between a data vendor, which makes the data, and a platform, which makes other people's data conform. Stripe did not process payments on your behalf; it gave you a small integration and took basis points. The equivalent here is the minting path: what does a customer do, in how few steps, to turn what they own into instruments that satisfy all four properties and can then be filed, published, and collected on.

Nothing in the contract above should assume that path runs through us. The delivery section answers most of it. What it does not answer is the binding step.

Level one is mechanical and guaranteed: nodes, hashes, ownership, time. Level two asks two questions that require judgment, what this document is about and who stands behind what it says, and the same PDF may be a recorded instrument whose authority is a county, a draft whose authority is the customer, or a vendor report whose authority is a third party. How much of that an automatic pass can determine reliably, and what it does when it cannot, is the first real product decision underneath all of this. The contract's answer to the second half is already fixed and is the same rule as everywhere else: when the extractor cannot determine authority or subject it does not guess, it emits the document node at level one with the binding absent and typed, and an unbound document is a visible fixable gap while a confidently wrong binding is the defect this system exists to refuse.

## Open hypothesis, to be checked and not assumed

If the region-scale rows enumerated above currently carry their own provenance as though each were an independently sourced measurement about that parcel, rather than a Derivation from one regional claim, then the provenance class is wrong across a very large fraction of the store, every one of those rows reads to a consumer as a measurement about their property when it is a copy of a regional statement, and no check that counts rows can see it. That would be the largest single evidence defect in the portfolio. A seat should sample the body of one such table and report what the provenance actually says before anyone repeats this either way.
