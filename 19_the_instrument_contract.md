---
id: 19_the_instrument_contract
title: The instrument contract — what a record must satisfy to be an instrument, and how one is minted, held, resolved, and paid for
status: active
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
supersedes:
  - 77_place_graph_strategy (as north star; its GTM content survives as a lane)
  - 05_living_lineage_thesis
governs:
  - _rd_disclosure_twin/09_twin_read_contract (the markets specialisation)
  - "@empressaio/atom-contract (the property-side implementation)"
related:
  - _inbox/2026-08-22_unified_instrument_contract_capture
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance
  - _decisions/2026-08-22_atom_layering_target_state
  - _rd_disclosure_twin/14_instrument_data_map
  - 80_adrs/adr_017_atom_access_control
  - 80_adrs/adr_011_atom_identity_across_versions
  - 80_adrs/adr_012_atom_export_format
  - 25b_monetization_provenance_storage_stack
  - 03a_positioning_framework
  - 09_post_saas_substrate_thesis
---

# The instrument contract

## Status

Ratified as the model by the operator on 2026-08-22. What is ratified is the definition, the vocabulary, and the rules below. Almost none of it is built. Under ADR-030 rule 2, nothing in this document may be stated in the present tense externally until it is armed, and the armed-state section near the end is the current honest inventory.

Where this document and any package disagree, **this document wins and the package is wrong**. That rule is carried verbatim from the twin read contract, which is the only document in this portfolio that has ever bound its implementation, and it is the reason that one did not drift.

### What it supersedes

`77_place_graph_strategy` as north star. The place graph is one shape family under this contract rather than the top of the model. `05_living_lineage_thesis` is subsumed, and its backfill-versus-contemporaneous distinction is restored below as `chainAnchoring`.

**Leave behind, declared per the lane-close rule rather than waved at.**

    item: 77's six-plane model (public law through market) and the
          segment-to-landing-pad table
      owner: UNASSIGNED          plan_row: UNASSIGNED
    item: 77's mineral-index triage output rule (nothing indexed 1980-today
          versus hits found, review required), a typed-absence discipline
          that predates this vocabulary
      owner: UNASSIGNED          plan_row: UNASSIGNED
    item: open decisions PG-1 through PG-4, unanswered and now living in a
          document marked superseded
      owner: UNASSIGNED          plan_row: UNASSIGNED
    item: the Texas ingest lane and GTM content
      owner: UNASSIGNED          plan_row: UNASSIGNED

Unassigned is not an acceptable resting state; it is a declaration that these are stranded and need an owner and a destination. Note also that `77` still names Regrid as a join key and Regrid is purged, so anyone sent to the superseded document to recover content will read a dead source as canon.

### What sits under it

`_rd_disclosure_twin/09_twin_read_contract` becomes the markets specialisation of this contract. `@empressaio/atom-contract` becomes the property-side implementation. Both remain governing within their domain and neither may contradict this document.

### What is amended rather than retired

`25b_monetization_provenance_storage_stack` remains the authoritative money and storage picture and needs one correction: metering is now armed. `01a_atom_conventions` and `_architecture_homes/02_atoms_lifecycle_ownership` are amended to this vocabulary.

Two ADRs are contradicted by this document and both still stand as canon, which means a fresh agent reading either gets the superseded model. **`adr_017_atom_access_control`** is accepted and enumerates the five access values as required scope types; this document replaces that single enum with two orthogonal fields, discoverability and entitlement, because the five-value union cannot express unlisted-and-purchasable. **`adr_011_atom_identity_across_versions`** is active and settles identity as a DID with a per-version content-derived `cid`; this document's identity is minted, opaque and immutable, with content addressing used for hashes rather than for identity, and atoms that supersede rather than version. Both need a superseding note written into the ADR itself, not only listed here.

### What is untouched

`03a_positioning_framework`, because identity and the two roots are a different altitude, and `09_post_saas_substrate_thesis`, because the commercial thesis is unchanged by any of this.

## Why this document exists

Two tracks built the same idea in parallel and each built the half its environment forced it to build. Markets receives outcomes whether it asks for them or not, and a disclosure that lies is a legal problem, so markets built evidence and interface. Property has counterparties and a gate, so property built economics. Neither environment forced identity, so neither built it, which is why identity is the defect both tracks share and arrived at independently.

Both sides are now scored by their own seat against the failure tests below.

| | identity | evidence | interface | economics | mean |
|---|---|---|---|---|---|
| markets, scored 2026-08-22 | 3.5 | 3.5 | 3.0 | 1.0 | 2.75 |
| property, scored 2026-08-23 | 3.0 | 2.0 | 2.5 | 2.5 | 2.50 |

**The mirror was too neat and the measurement says so.** Markets leads on three axes of four. Property leads on exactly one, economics, and by a wide margin. So the honest reading is not that each track built the opposite half; it is that markets is ahead nearly everywhere, and **economics is the single axis where property's environment forced something markets' did not**. Evidence remains the sharpest gap in both directions, at 2.0 against 3.5, and it is the property the whole thesis rests on.

Both seats answered the acid test the same way. No. Property named four blocking steps: identity reconciliation off the gold parcel, an evidence chain not walkable at store scale, dual-serve integration with empty chains outside gold, and a meter armed while the rate and settlement are not closed.

There are not two systems. There is one system with two instantiations, and this is its definition.

## The benchmark

A record is an instrument when a stranger and a machine can act on it without asking anyone's permission or writing an integration.

Four properties. Each carries a failure test, because a standard that cannot be failed is not a standard.

**Identity. You can point at it.** One identifier resolves to one thing, for anyone, indefinitely, stable across every correction, restatement and enrichment of the thing it names. It fails if the identifier changes when the record is corrected, if two systems name the same thing differently and a human reconciles them, or if resolving requires knowing which system it came from.

**Evidence. You can check it.** The chain from claim to source travels with the record and can be walked without the issuer's cooperation. Confidence is stated with its basis and is scoreable against outcome. Absent, zero and unmeasured are three distinguishable states and the record says which. The issuer is named, answerable, and carries terms. A third party who was not present can verify later what was said, from what, at what confidence, and that nothing has changed since. It fails if checking requires calling someone, if a missing value and a measured zero are indistinguishable, or if the confidence cannot be scored against what happened.

**Interface. A machine can use it without an integration.** The record describes itself at the depth the consumer needs, and differently to an agent than to a person, from one definition rather than two implementations. It declares what it composes and what it attaches to, so traversal replaces querying. It declares in advance the events that can happen to it. It fails if consuming it requires someone to write a mapping, if the shape varies by source, or if a lifecycle event exists that consumers were never told could occur.

**Economics. Using it is a transaction.** The record has an owner and terms, the ask has a price, and both live in the contract rather than in an out-of-band negotiation. Every use is counted, attributed and settled to the owner. It fails if reading it is free to the reader and worthless to the owner, if payment requires a bilateral deal per consumer, or if the meter counts while the rate is null.

### The acid test

Could an agent that has never heard of us, acting for a party that has never heard of the issuer, rely on this record in a transaction with real consequence, and could the issuer get paid for that, with no human in either loop?

If yes it is an instrument. If any step needs a person, a negotiation or an integration, it is a document with good metadata.

### What the benchmark deliberately does not require

It does not require the record to be correct. Instruments are wrong sometimes, which is what an answerable issuer and a walkable evidence chain are for. A standard demanding correctness would be unachievable and would turn every error into a scandal rather than a correction.

It does not require a blockchain. Settlement may use one. The record does not, and provenance is better off not on it.

It does not require us to hold the bytes, but federation costs half of one property and the document should say which half. **Evidence has two operations and they are not the same.** *Verify* is hash comparison: it works federated, always, offline, and stays free. *Walk* is retrieval of the source: it requires the holder to still be reachable and willing, so a federated chain terminates at a hash proving only that something with that digest once existed. That is tamper-evidence, and this document's own failure test says checking must not require calling someone. A federated record therefore satisfies Identity, Interface, verify-Evidence and Economics, and satisfies walk-Evidence only where the holder carries an availability term. Conformance levels bind to which of the two a record supports.

It does not require the record to be public. A tenant-private record is a complete instrument for the parties entitled to it. Access policy is orthogonal to instrument-hood.

## The words

**Node.** A thing that exists and can be pointed at: a minted opaque id, a shape, and aliases. It carries no facts. Identity and nothing else. Nobody disputes whether a node exists as a handle; they dispute what is true of it. A parcel is a node. A jurisdiction is a node. A security, an issuer, a person, a building, a document, a musical work, a recording: all nodes. Anything that can be pointed at and owned is a node, and the recurring beginner error in every domain is to model such a thing as a fact about something else.

**Atom.** One claim, from one authority, at one time, about a subject expression. It carries the subject, the claim type, the value, the provenance class and that class's required fields, confidence with its basis, valid time and knowledge time, and access. Immutable: superseded, never updated. **Supersession is an edge**, `supersededBy`, and therefore an atom with its own authority and clock, so that who superseded a claim and when it became known are answerable. It is not a column.

**Edge.** A typed relation between nodes carrying its own provenance. An edge is an atom whose value is a node rather than a scalar, which is what gives edges provenance, confidence and bitemporality without a second mechanism.

**Layer.** A named bundle of atoms about one node, reported with a single status and one absence verdict when not populated. A read concept, not a storage concept.

**Instrument, or twin.** The composed view of a node: identity, shape and layers, as of a moment, under a lens. Assembled per request, not stored. This is what a holder receives and what a counterparty verifies.

**Lens.** The declared composition: which layers, required or optional, for which job. The unit of ask, meter and price.

### The test

**An atom is anything that could change or be disputed. A node is what stays the same when it does.**

A song's ownership splits change, its alternate titles accumulate, its territorial licences turn over. None of that makes it a different song, so the song is a node and each of those is an atom. Were the song an atom, every ownership change would version the whole thing and every citation to it would need re-pointing.

More precisely: something is a node when it needs to be **cited, owned, amended, or related to independently**. Something is an atom when it is a **statement about** one of those.

**Granularity is set by the finest thing that gets cited, amended, or licensed.** For building codes that is the section, occasionally a subsection, never the book and never the sentence. A code edition is a node and so is each section within it, because cross references are section to section and an edge connects nodes, because amendments amend sections, and because an applicability rule belongs to a section rather than to a volume. Going finer than the citable unit is a cost with no buyer: a node exists because something needs to point at it, never because the source document had a heading there.

### Documents play two roles

A document is a node, because it exists, has an owner, and can be pointed at. It is also evidence, because atoms cite it. These are two roles of one thing, and collapsing them is the recurring modelling error in every domain.

Giving a document its own node is what lets four different atoms cite the same page, lets the artifact be owned and access-controlled independently of the claims drawn from it, and lets a holder say what they have before anyone has decided what it asserts. That last property is the level-one gesture: a folder of documents becomes nodes with identity, hashes and ownership before a single claim has been extracted.

## Identity

    id          minted, type-prefixed, opaque, immutable

An alias is **an atom**, not a field. Claim type `identity.alias`, subject the node, value the natural key, with the authority that asserted it, a provenance class, confidence, valid time and knowledge time, and access, exactly like every other claim. Lineage is **an edge**, and edges are atoms whose value is a node.

This is a correction. An earlier draft carried `aliases[]` and `lineage[]` as arrays on the node, which made identity the one class of claim in the model exempt from the evidence discipline, in a document written because identity is the defect both tracks share. Nobody was named as having asserted that a given string names this node. It also forced nodes to mutate, since closing an alias era means writing `validTo`, while atoms are immutable. Markets already models an alias era as an atom collapsed at read; the array form was a regression from the reference implementation.

Lineage vocabulary is three words, not one, because the events differ:

    mergedInto    two nodes were one thing all along
    dividedInto   one thing became several that never existed before
    unmerged      a merge was wrong and is reversed, restoring a node that
                  already carries citations and already resolved elsewhere

**Resolution takes a clock.** `canonical(id, knowledgeAt)` and never `canonical(id)`. A counterparty who took delivery on day eight, against a merge later reversed on day forty, must be able to ask what that id resolved to on day eight and get the answer that was true then.

A natural key is never identity. A ticker, a CUSIP, an APN, a `county:parcel` string, an ISRC, an address: all aliases. They change, they get reused, they are ambiguous under prefix matching, and they encode somebody else's filing convention into a primary key.

Identity is bitemporal on the alias rather than on the node, so the system can answer both what an identifier meant and when we learned it.

**The id shape is enforced at write** by a type the compiler carries and a store boundary that refuses. Both tracks currently declare this rule in a docstring and enforce it nowhere, which is how one of them writes bare symbols into a node-keyed column and the other made a coverage measurement out of a prefix match. A docstring is not a control.

## Shape

Shape declares what kind of thing a node is, and therefore which layers are even applicable. A futures contract has no issuer. Unincorporated land has no zoning authority. Shape plus the `not-applicable` verdict is what lets a system distinguish a gap from a category that does not exist, at the type level rather than in a scorer.

**A shape declares three things beyond its name.** Which layers apply. Its granularity ruling, meaning the citable unit for this shape, versioned, so moving it is a contract change rather than an ingest-time judgment by whoever wrote the loader. And its `eventTypes`, the node-level vocabulary of what can happen to a thing of this kind, which must include merge, division, alias change and owner change in every shape, because a consumer holding an id has to be told in advance that the id can move. Layer-level `eventTypes` covers what happens to a layer; it cannot cover what happens to the node.

**Co-location is an edge, never identity.** A severed mineral estate is cited, owned, amended and conveyed independently of the surface, so by the test it is a node, and `estate` is a shape. It shares geometry with a parcel and is not the parcel. The superseded place-graph strategy answered this the other way, treating vertical estates as constraints on the place node; that answer is reversed here. The granularity rule does not reach this case, because it governs decomposition of one thing while this is several owned things at one location.

## Subject

    subject   extensional   one named node
              intensional   the set selected by a predicate:
                            shape, predicates, jurisdictional bound, time bound

An atom's subject is not necessarily one node. One code section applies to a region. One covenant binds a subdivision. One flood panel covers a geography. These are single claims about sets, and modelling them as claims about individual nodes produces enumeration at write time, which is the defect visible in the property store today, where region-scale facts sit at ninety to one hundred and fifty percent of the parcel count because each was copied onto every parcel it touches.

Four things follow.

Write amplification disappears; a map revision supersedes one atom rather than rewriting millions of rows.

Forward consequence becomes cheap and correct, because what a change affects is the evaluation of a selector returning a set, one to many by construction.

Coverage stops lying, because coverage is a selector evaluated against the node population rather than a row count.

And composition happens at read, which is the branch markets took and property did not.

**A selector must be deterministic and re-evaluable.** Same selector, same store state, same set. That is the evidence property applied to a set instead of a value, and it is what lets a stranger re-run the predicate and get the same answer. A selector depending on evaluation order or on a mutable side table nobody versions is not an instrument.

**A selector must also be indexable, and this constraint decides implementability.** Selectors are drawn from a declared predicate algebra: spatial containment, set membership, attribute equality, attribute range, and composition of those. A predicate outside the algebra cannot be indexed, and the inverse question a lens actually asks, which intensional atoms admit this node, then degrades to a scan over every selector in the system.

The numbers are not hypothetical and come from this codebase. The August flood work measured point-major evaluation, which is read-time per-node selector evaluation, at 218 to 362 times slower than zone-major, which is materialisation. One county's plan phase went from 1,818,708 milliseconds to 5,025.

**Materialisation is therefore required, not tolerated, wherever the algebra does not reach**, and it remains a Derivation carrying `derivesFrom` to the selector atom and its method, and must never be presented to a consumer as a measurement about their own node. An earlier draft called it a cache that may be discarded and rebuilt without loss. That is true of information and false of availability: a national rebuild is days, not minutes.

**And a materialised row's id is a pure function of `(selector atom id, store-state version, method)`**, so a rebuild reproduces the same id. Otherwise a delivered instrument citing a derivation dangles at a link that never resolves again after the next rebuild, and the evidence chain the delivery product sells is broken by our own maintenance.

**A selector result carries the same absence block a layer does**: `scopeSearched` naming the node population actually enumerated, `asOf`, and `basis`. A set-valued claim needs to say where it looked more than a scalar one does, and under federation the store is a union over reachable holders, so "same store state" is not a quantity any single party holds. Without `scopeSearched` on the result, two evaluations with different reachability return different sets and neither says so.

`governedBy` names the node whose authority makes a claim true, and is a different question from subject. Governance says who makes it true. Subject says who it reaches.

## Layer

    status            populated | contested | absent
    provenanceClass   Record | Observation | Derivation | Synthesis
                      (Attention and Judgment reserved, carrying no layer)
    chainAnchoring    contemporaneous | backfill
    eventTypes[]      the vocabulary of what can happen to this layer
    access            see below
    when populated    payload plus the fields this class requires
    when contested    at least two atoms, plus precedenceBasis, which is either
                      a cited precedence rule (itself an atom with its own
                      governedBy) or the literal value unresolved
    when absent       verdict    absent-verified | lookup-failed | not-applicable
                      authority  who we asked
                      scopeSearched  where we looked, including the entitlement bound
                      asOf
                      basis

Record cites the authority and the fetch. Observation states the measurement. Derivation states the formula and its inputs. Synthesis cites every number. **The class determines which provenance fields the schema requires**, which is the mechanism that makes evidence non-optional rather than encouraged. The class rides on all four status branches, so an absence still tells a consumer what kind of thing is missing, and **a layer may not be re-classed in transit onto a weaker obligation**.

The three absence verdicts read differently on purpose. `absent-verified` means we looked, in a stated scope, and it is genuinely not there. `lookup-failed` means we could not look, and must never be reported as the former. `not-applicable` means the category does not exist for this shape.

**`contested` exists because two authorities can both have standing.** A parcel in an extraterritorial jurisdiction where the city's development code sets a setback at twenty-five feet and the county's order sets it at fifty is not a data error and not an absence. Both atoms are `Record` class from named authorities, neither supersedes the other, and no court has ruled. Without a contested status the layer must report `populated` and serve one number, which is a determination nobody made, and `Judgment`, the class that would carry a determination, is reserved and carries no layer. A lens may not collapse a contested layer into a single value. The precedence machinery for resolving these where a rule exists is ADR-021 on the property side.

**`chainAnchoring` distinguishes what a signed chain actually proves.** A permit issued in 2019 and atomised in 2026 and a permit captured contemporaneously in 2026 are both `Record`, both carry valid time and knowledge time, and their chains mean different things: the backfilled one cannot claim proof of anything before the moment it was atomised. Knowledge time records when we learned it and does not record that the chain is unanchored before that point. This matters most in the delivery product, whose entire pitch is offline verification of a chain, because a buyer verifying an envelope of backfilled atoms otherwise gets a green result that attests to nothing about the period the atoms describe. Restored from `05_living_lineage_thesis`, which was superseded before this distinction was carried forward.

## Lens

    lens   name        the job being done
           shapes[]    which node shapes it applies to
           layers[]    which layers it composes, each required or optional
           onAbsent    answers-degraded | refuses
           audience    agent | human, selecting rendering only, never content
           meter       the unit counted and priced

A caller asks for a lens, not for layers. This lets one instrument serve many purposes without many records; makes degradation declared rather than accidental, since a lens that requires a layer and receives `lookup-failed` either refuses or answers labelled degraded and which one is in the contract; makes the human and agent surfaces structurally identical in content because audience selects rendering only; and gives the meter its unit.

**Terms attach to the record. Price attaches to the lens.** One record is worth different amounts depending on the job it serves.

## Access

Access is two orthogonal fields, not one enum. The five-value union in ADR-017 is five points in this grid and cannot express the most natural consumer gesture there is, which is sending one thing to one person and having them pay for it without listing it to the world.

    discoverability   catalog-listed | unlisted | hidden
    entitlement       anyone-free | anyone-paid | named-parties | owner-only | platform-only

Access is resolved at read, against the record's own fields and the caller's resolved entitlement, and never against a route. A credential that cannot be resolved is a 401 and never a silent downgrade to the public path, because a revoked key answered with public content reads to its holder as a working key over a thin catalog.

**The gate is a ceiling and never a floor.** It only removes records. No branch adds one, and an upstream verdict is never upgraded in transit.

**Withholding is not absence.** A record the caller may not see is not `absent-verified`, which would lie about the world, not `lookup-failed`, since the lookup succeeded, and not `not-applicable`, since the category applies. Withholding is a fact about the caller, so it rides in `scopeSearched` as the entitlement bound with a count in `basis`, and never names whose policy withheld it, because "there is more here" must not become "a named party holds private material on this subject."

### Grants

The gate never adds a record. **The owner grants.** These are not in tension: a grant is an owner-issued entitlement recorded as an atom naming who granted, to whom, over what, from when, until when, and whether it is revocable. The gate still only removes; it computes its ceiling against an entitlement set that now includes owner grants as well as key entitlements.

This is what makes a shared room, a sold room, and a delivered instrument possible without any branch of the gate ever adding something the caller was not entitled to.

A grant carries provenance like any other atom, which is what lets a seller answer who was granted what, and when, and whether it was revoked.

**Two clocks, and they are never the same clock.** Entitlement resolves at wall-clock now and at no other time. `asOf` selects content and never entitlement. **A revoked grant is revoked for every `asOf`.**

Without this rule the ceiling holds and the system leaks anyway. Grants are atoms, atoms are bitemporal, so a caller whose grant was revoked on day ten can read on day twenty with `asOf` day five, the entitlement set evaluates the grant as live, and the record is served. No branch of the gate added anything; the addition happened one layer up. Worse, the bitemporal membership rule that lets a room reconstruct what a counterparty saw during diligence is the same mechanism, so an implementer building that reconstruction correctly builds the revocation bypass in the same commit unless this rule is stated.

**The entitlement graph is resolved by the registry under a declared system entitlement and is not itself gated by the entitlement graph.** A grant naming caller C has C as its subject rather than its owner, so resolving what C may reach requires reading records C may not read. That recursion has no base case unless one is written, and every implementer who hits it invents a different privileged path, none of them auditable. This is the single exception to resolving access against the record, it is declared here, and it is the only one.

## Collections and rooms

A **derived room is a layer**. All documents pertaining to node X. Nobody assembles it; it exists because documents point at X, and it is keyed off the governing node.

A **curated room is a node**. Someone assembled it, for a purpose, with a boundary and a grant, and it may hold documents pertaining to several different subjects at once, which a derived room structurally cannot. A deal room carrying a parcel's title work, an entity's formation documents and an operator's financials is three subjects in one collection.

**Membership is an edge, never containment.** A document belongs to many rooms, exists independently of all of them, and removing it from one must not delete it.

    edge   doc_… memberOf room_…   placedBy actor_…, placedAt T

**And membership is bitemporal, which is the requirement most collection products fail.** What was in the room when the counterparty performed diligence is a question that ends up in front of a lawyer, and only valid time plus knowledge time on the membership edge can answer it. A room whose membership is a current-state join can never reconstruct what was shown, to whom, on which day.

Buying or being granted a room does not convey everything in it. Members resolve against their own access plus the grant, and an owner can only grant what the owner was entitled to grant. Where members are withheld the room reports what the caller reaches, states the entitlement bound in `scopeSearched`, and puts the withheld count in `basis`.

## Economics

Licensing terms on the source actor. Rate on the record. Price on the lens. Attribution per call. Settlement to the owner.

**Owners lapse, and the contract must say what happens.** An entity that filed four hundred documents dissolves. Its grants are revocable by nobody, settlement accrues to no account, its terms are amendable by nobody, and the record is answerable by nobody, while the Evidence property requires a named and answerable issuer and Economics requires settlement to an owner. Ownership is an edge with valid time, so succession is representable as data; what is undefined is who may write that edge once the writing party is gone.

So **`custodyOnLapse` is a required term at mint**, one of `named-successor`, `escheat-to-registry`, or `freeze`. Declining to choose is not a permitted default, because the fail-closed reading is to refuse settlement, which silently converts a paying record into a free one, and silent degradation is prohibited.

Purchase is per resource. The payment protocol is x402: a 402 carrying the resource id, the amount, the payee and an expiry, with no requirement that the payer hold an account. **What a purchase mints is an entitlement that survives the transaction**, so a buyer can return tomorrow without buying again, and can transfer what they bought. Without that mint, a payment buys a single response and the product is a vending machine.

### Two economic objects

**Pay per answer.** A lens call. One determination, one price, no persistence required. The authorise-count-attribute path is armed: the call is authorised before it is served, counted, and attributed to the owner of the source. **The per-call rate is not, and the lens object is not**, so pay-per-answer is a designed object rather than a live one. An earlier draft said this works today, which failed this document's own test that a meter counting while the rate is null is a failure. Verified at source: the attribution ledger writes `graceTerms: "pending-rate"` when the amount is null, and the money-path usage table carries `key_id`, `period`, `layer2_count` and `updated_at`, with no rate, amount or currency column at all.

**Buy a grant.** An entitlement over a node or a room that persists, so the holder returns and resolves again. This is what a room sale is, and it is the case the missing entitlement mint blocks entirely. Its absence is not a degradation of the room-sale product, it is the difference between having one and not.

### Grant or delivery, and the seller must declare which

A **grant** is revocable, time-bounded, resolved from the registry on every read, and auditable, so the seller retains visibility into who looked at what and when.

A **delivery** is the export envelope. The buyer holds it offline indefinitely, verifies it without us, and the seller loses visibility.

**A delivery satisfies Identity, Evidence and Interface, and satisfies Economics at the point of sale only.** This is a carve-out and it is forced. An envelope that carries content and verifies offline for free is a complete unmetered read path: one buyer forwards it to five hundred counterparties, each verifies free and forever, and nobody is attributed or settled, which is this document's Economics failure test recited word for word. The only rebuttal is a redistribution term, and enforcing a term requires a lawyer, which the acid test forbids.

So redistribution is **detectable and attributable rather than preventable**. The countersignature covers the grantee identity, so a leaked envelope names its origin. And delivery is priced as a perpetual multiple rather than as a variant of a lens call, because that is what it is.

Sellers usually want the first and buyers usually want the second. They are different products at different prices, and an offer that does not say which one it is will sell a lease to someone who believed they bought a copy.

### The offer carries a manifest

Because a collection can be emptier than it looks, an offer states before payment how many members the buyer will reach and how many are withheld. Priced against what will actually be received.

**The category vocabulary is bounded to facts about the buyer's entitlement**, never about the withheld material's subject or holder. Permitted: requires a broker licence, requires the seller's counterparty consent. Forbidden: operator financials, a named party's private material. In a curated room holding three subjects at once, a category naming the subject plus the room's context resolves to identity in one step, disclosed to a caller who has not yet paid, which is the exact inference the read-time rule exists to block. The count is safe because the read path already permits a count in `basis`. The category is where it breaks.

This is the withholding-is-not-absence discipline applied one step earlier, at the offer rather than at the read. Selling a trimmed room as a full one is the silent substitution this contract exists to refuse, and the manifest is what makes an offer honest to a buyer who cannot inspect before paying.

### Discovery is not resolution

A listing is a pointer to a resolvable id and may live anywhere: our surface, a partner's, a post, an agent directory. Discoverability is a property of the record; resolution happens in one place. **Anyone can be the storefront. Nobody else can be the registry.**

## Minting and delivery

The shape is a certificate authority plus a registrar, not a data vendor. A certificate authority signs without ever seeing the private key. **We sign what we never see.**

The holder runs our code locally, as a command line tool, a desktop agent, or their own agent invoking it as a tool, and points it at a folder or a linked drive. Up the wire go the proposed shape per document, content hashes and never content, the declared authority, the provenance class, the proposed access, and the alias set. Back come minted ids, a countersignature over the hashes, the contract version, and a conformance result naming which fixture failed when one does. Bytes never move.

We attest form, identity, and who asserted it. We do not attest that content is true and have never claimed to, which is why signing what we never read is the design working rather than a compromise.

Ten documents in does not mean ten atoms out. It means ten document-shaped nodes with identity, hashes, ownership and time, which requires no judgment; plus atoms extracted from their contents; plus edges binding them to nodes that may already exist in the namespace, which is how a stranger's document attaches to the public record with no integration. Where those documents concern one subject, the holder walks away with one instrument whose room is ten times richer. The product is documents becoming evidence attached to the thing they are about.

### Conformance levels

The standard never lowers; the score says where a record sits. Identity and a named owner is level one. A named authority and a provenance class is level two. Typed absence with stated scope is level three. A live outcome loop is level four.

**Two scores, not one, because we never see the content.** `declaredLevel` is what the minter asserted. `verifiedLevel` requires a second independent derivation for anything above level one: a corroborating atom from a different authority, or an outcome. Levels two and three are self-asserted form checks and the document says so plainly, because a minter who labels every file `Record`, authority *Travis County*, scope *county records 1990 to 2026* reaches declared level three without a single verified fact, and a buying agent filtering on that is filtering on the seller's self-report. Level four is the only rung in the ladder that carries a second derivation, which is why it is the only one that means anything on its own.

A filter offered to a buying agent must state which score it filters on.

### The portable instrument

An instrument should be a file a holder can keep, open, and send: an envelope carrying id, hashes, layers as held, contract version and a countersignature, which opens in a viewer, verifies offline, and reaches the registry only for resolution, join, publication and toggles.

**The atom contract ships part of this and not the part the claim leans on.** `./export` under ADR-012 defines a `DownloadableAtom` with `exportVersion`, `identity`, `accessPolicy`, `contextSummary`, `readContract`, `compositionReferences`, `citations`, `signedEventChain`, `verifyChain` and `exportedAt`. There is **no signature, no countersignature and no key**, and `verifyEventChain` recomputes an unkeyed SHA-256 chain using a formula published inside the package, which is tamper-evident against corruption and forgeable by anyone who can run the same function. So "we sign what we never see" is today "we hash what we never see", and a field named `signedEventChain` carrying no signature is this document's own defect class inside the package it governs.

An `atom_export` MCP tool is wired and live on the reporting gate, requiring an identified caller and failing closed on a conformance check. So the export path is partly armed. The countersignature is absent and is listed as not armed below.

## What points back

**Resolution.** We mint the identifier, so a counterparty handed one must resolve it here. This is the position CUSIP holds while owning no securities.

**The join.** An instrument alone is a document with an id. A lens composing it with jurisdictional, regulatory, hazard, encumbrance or market context is ours, and that is where the meter sits. **Give away the mint, charge for the join.**

**Score and time.** A publisher's track record is computed across many publishers against outcomes and cannot be self-issued.

**Publication.** Optional, and upside rather than toll.

Two constraints govern all four. **Verification stays free and unauthenticated**, because an attestation you must pay to check is not an attestation; verifying an instrument you were handed is free, resolving what it currently points at is metered, and those are different questions. And **the holder can leave**, keeping the instruments, ids, signatures and the ability to verify indefinitely, forfeiting only the join and the score. That is a dependency on a service rather than a hostage, and the sovereignty root in `03a_positioning_framework` requires it.

## Conformance

Conformance has two halves, because fixtures alone certify the half already built and are blind to every rule this document adds.

**Fixtures** validate payload shape: one per shape, one per absence verdict, plus provenance-class field requirements, shape-to-layer applicability, the two access fields, the offer manifest, the grant atom, the contested block. All of these are testable against a document.

**A behavioural suite** validates the rules a payload cannot express, run by the package against its own store:

    write-refusal probe          a malformed id is refused at the store boundary
    selector re-evaluation probe two runs plus a mutation give the stated set
    ceiling property test        for all callers, result is a subset of the
                                 platform result
    bitemporal reconstruction    membership and grants answer an as-of question
                                 from history, not from current state
    unauthenticated verify probe verification answers without a credential

The headline rule of this document, that id shape is enforced at write, is precisely the least fixture-testable clause in it: a fixture validates a payload while the rule is about a write path, and both current tracks pass every payload check today while writing bare strings into node-keyed columns.

**A surface may claim conformance only by publishing a passing run of both halves, stamped with the fixture-set hash and the commit it ran against**, and re-running on every contract bump. A claim of conformance without a published run is the defect this contract exists to end, and the largest risk to this document is that it becomes the beautiful correct object that nothing implements. There is no conformance registry today, which means the buying-agent filter described above has nothing to query.

## Armed state as of 2026-08-22

**Snapshot for this section.** `hauska-mcp-server` deployed main `b5f26de`; `hauska-atom-contract` main `292a22b` and published `@empressaio/atom-contract@1.22.0`; `smart-markets` and `smart-files` read at `origin/main`; store `hauska_mcp` queried 2026-08-22. Every row states its evidence, per ADR-030 rule 1, which an earlier draft of this section violated by listing fourteen bare noun phrases.

| Capability | State | Evidence |
|---|---|---|
| Metering gate authorises before serving | ARMED | `sdk-metering.ts` `gate.authorizeCall({keyId, tier, layer: 2})` into `McpMeteringGate`, writing `sdk_metering_usage`; `SDK_METERING=1` in `cloudbuild-mcp.yaml` |
| Inbound attribution to licensed sources | ARMED | `accrueSourceObligations` writes `source_obligation_ledger` on every tier including anonymous |
| Honest absence at a surface | ARMED | exact lookup on a real rural parcel returned zero rows and SmartSite declined with an empty atom chain rather than inventing a value |
| Typed absence, three verdicts, provenance classes | ARMED in markets | twin read contract v0.1 and `@smart-markets/contract` `absence` and `layer` modules |
| 1:N event-to-subject relation | ARMED in markets | 166 `evt_*` to `sec_*` edges with rows |
| Read-time access resolution, anonymous branch | ARMED in markets | anonymous reaches `public-free` and nothing else |
| Read-time access resolution, keyed branch | **STARVED** | `apps/api/src/access/entitlement.ts` `storeAttestedEntitlement` returns all five policies, and its own comment states the layer holds no authority to state a ceiling. A ceiling of everything is a ceiling satisfied by a sentinel |
| x402 payment protocol | **DORMANT** | zero hits for `x402` or a 402 emitter across every serving repo on `origin/main`; the implementation exists only in the SDK package. Nothing serves a 402 |
| Export path | PARTLY ARMED | `atom_export` is a live gated MCP tool requiring an identified caller and failing closed on conformance; the countersignature field does not exist in `DownloadableAtom` |
| Identity as specified here | NOT ARMED | both tracks write identifiers verbatim with no shape validation |
| Subject expressions | NOT ARMED | region-scale families are enumerated per node at 90 to 151 percent of the parcel count |
| Entitlement mint | NOT ARMED | no VDA package in the gate's dependency tree |
| Outbound payout | NOT ARMED | `RevenueRouter` has zero call sites, no webhook, and the only exported ledger is in memory |
| A rate on any licensed source | NOT ARMED | ICC actor fixture carries no `perReferenceRateMinor`; ledger rows land `amount_minor: null`, `graceTerms: "pending-rate"` |
| Confidence and provenance on the property store | NOT ARMED | 27,002-row sample of one family, 100 percent empty on confidence and read-contract paths |
| Decomposed access, lenses, contested status, `chainAnchoring`, `custodyOnLapse` | NOT ARMED | introduced by this document |
| Conformance fixtures and behavioural suite | NOT ARMED | neither exists |

## What this document does not yet enforce

An adversarial review on 2026-08-22 applied this portfolio's own four-question control gate to every "must", "never" and "may only" in this document. Nineteen such rules. **One answers all four questions**, and it is the one inherited from the twin read contract: provenance class determines required fields, executed by the schema, triggered at validation, failing with a validation error.

The other eighteen name no executor, no trigger, and nothing that fails. Among them, and worth naming rather than burying: id shape enforced at write, which both current tracks already bypass; selector determinism; materialisation never presented as a Record, which validates cleanly if emitted as one; `lookup-failed` never reported as `absent-verified`, which the twin contract itself records as a known unenforceable; a layer never re-classed weaker in transit; the gate as a ceiling; membership bitemporal, defeated by a current-state join; audience selecting rendering and never content; verification free and unauthenticated.

The review's sentence is the correct one and it stays in this document: it is right that a docstring is not a control, and it then writes eighteen docstrings. It diagnoses the disease and exhibits it in the same file.

This is not resolved by better prose. It is also not resolved by writing eighteen probes, because the doctrine already prefers a stronger instrument: where a type can express a constraint, prefer the type, since a discriminated union the compiler enforces at every consumer has no trigger to be missing and no call site to be absent.

So every rule in this document is triaged below into **type**, meaning made unrepresentable and therefore deleted from the ruleset rather than policed; **probe**, meaning a runtime test in the behavioural suite; or **convention**, meaning admitted as a norm and not claimed as a control. The `how` column is the work item.

| Rule | Mechanism | How |
|---|---|---|
| Provenance class determines required fields | type | discriminated union per class; already enforced at validation, and the only rule that ever was |
| Id shape enforced at write | type | branded `NodeId` constructible only by `mint()` or a validating `parse()`; a bare string does not compile at any call site |
| Access resolved at read, never against a route | type | resolver signature takes only the record and the caller entitlement; the module cannot import the request |
| Unresolvable credential is 401, never a silent downgrade | type | discriminated `resolved \| unresolvable \| anonymous`, where only a missing header yields `anonymous` |
| Entitlement resolves at now; `asOf` never selects entitlement | type | the entitlement resolver has no `asOf` parameter |
| Membership is bitemporal | type | the read signature requires `knowledgeAt`; a current-state join cannot satisfy it |
| Membership is an edge; removal from one room never deletes | type | no cascade on the membership relation, asserted by a schema test |
| Audience selects rendering, never content | type | the content function has no audience parameter; rendering is a separate downstream function |
| Never names whose policy withheld it | type | `basis` bounded to a closed vocabulary; free text is the entire vulnerability |
| Manifest category concerns the buyer's entitlement only | type | the same closed vocabulary, offer side |
| Materialisation never presented as a Record | type | `derivesFrom` required on Derivation and absent on Record, so a Derivation has no Record shape to occupy |
| Selectors drawn from the indexable algebra | type | the predicate is a closed discriminated union; anything outside it does not construct |
| Resolution takes a clock | type | `canonical(id, knowledgeAt)`; the one-argument form does not exist |
| Supersession is an edge | type | no `supersededBy` column exists to write |
| A lens may not collapse a contested layer | type | the contested variant exposes no single-value accessor |
| Required-at-mint fields: `custodyOnLapse`, `chainAnchoring`, grant-or-delivery, offer manifest | type | required, no default; an offer or mint without them does not construct |
| `lookup-failed` never reported as `absent-verified` | type, partial | `absent-verified` requires a source that responded; `lookup-failed` requires the failure reference. A residue of producer honesty remains and is a convention |
| Selector deterministic and re-evaluable | probe | two runs plus a mutation against a versioned store state |
| Materialised row id is a pure function of its inputs | probe | rebuild and compare ids |
| The gate is a ceiling and never a floor | probe | property test: for every caller, the result is a subset of the platform result |
| A layer is never re-classed weaker in transit | probe | class signed at origin so a middle-hop change is detectable |
| Verification stays free and unauthenticated | probe | unauthenticated request against the deployed service |
| The holder can leave | probe | export round trip and offline verify |
| `verifiedLevel` requires a second independent derivation | probe | assert a corroborating atom or an outcome exists before the level is issued |
| Conformance only by a published passing run | mechanism | the conformance programme itself, fixtures plus behavioural suite |
| This document wins and the package is wrong | convention | a governance norm. No executor exists and none is proposed. Calling it a control would be the defect |
| The entitlement graph resolves under a declared system entitlement | convention | a stated exception, auditable by log rather than enforceable by type |

Twenty are type work, which removes them from the ruleset as they land, one at a time, inside whichever package touches them next and without a program. Six are probes, which is the whole behavioural suite rather than eighteen. Two are conventions and are labelled as such.

The number of unenforced rules is therefore a figure that moves rather than a paragraph of self-criticism, and this table is where it moves.

## Open questions

**The binding step.** Level one is mechanical. Level two asks what a document is about and who stands behind it, and the same file may be a recorded instrument, a draft, or a third party's report. How much an automatic pass can determine reliably is the first product decision underneath everything here. The contract's answer to the failure case is already fixed: when the extractor cannot determine authority or subject it does not guess, it emits level one with the binding absent and typed.

**Self-serve node minting across domains.** A holder making atoms about songs is really minting work and recording nodes and asserting rights edges to actor nodes. The model handles it; the product does not yet explain it, and "what node does this belong to" is the question a self-serve user will ask first. The answer is usually that the thing they are describing is itself a node.

**The rights-holder path.** ICC and counterparties shaped like it hold corpora that agents already consume without paying. The publisher model, the rate, and the onboarding gesture for such a holder are unresolved and are the nearest commercial move.

**Price discovery per lens.** Anchored to displaced human labour rather than to cost to serve, but no number has been defended internally yet.

**Minting monetization.** Doc 19 §Economics says give away the mint and charge for the join. Whether node minting is free, freemium, or metered per node is not settled. Logged open 2026-08-22; not solved in thesis planner session.

**The provenance class of materialised rows is no longer open. Measured 2026-08-23 and CONFIRMED, with one important nuance in our favour.** All 62,256 Bastrop flood atoms share a single county-level bulk provenance signature: one adapter, one source url, one vintage, one citation, and two timestamps that are write-batch boundaries rather than per-parcel fetches. The write path builds one provenance object per county run and stamps it onto every parcel.

The nuance: **the citation text is honest.** It names the bulk county load and the row counts it was filtered from. What is wrong is the classification. Every row carries `reasoningKind: observed` with per-parcel timestamps, no `inputAtoms`, and no `provenanceClass: Derivation`, so a point-in-polygon result against a regional polygon presents as a measurement of that parcel.

This makes T1.4 substantially smaller than feared. It is a reclassification with a link to the regional source, not a re-sourcing. Nothing has to be re-fetched and no citation has to be rewritten.

**Monetisation of minting.** The model says give away the mint and charge for the join, but whether minting is free, freemium, or metered per node is unsettled, and it interacts with how a stranger is expected to arrive.

**Delivery pricing.** Priced as a perpetual multiple is stated above as the shape; no multiple has been defended.

**Ratification of the identity change.** Aliases and lineage became atoms and edges in this revision rather than fields on a node, which is a model change and not an edit. It makes identity uniform with everything else and matches the markets implementation, and it needs an explicit operator yes.

**Owners for the stranded `77` content**, including PG-1 through PG-4, which are four unanswered decisions now living in a superseded document.

**The enforcement triage is a work list, not a decision.** Twenty type items and six probes are named above with their mechanism. None exist. The type items land inside packages as they are touched and need no program; the six probes are the behavioural suite and do need one. Until at least the probes exist, the conformance claim in this document is the defect it describes.
