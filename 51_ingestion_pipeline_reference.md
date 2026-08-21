---
id: 51_ingestion_pipeline_reference
title: Ingestion Pipeline Reference Architecture, Diagnostic Battery, and Scorecard
status: draft
last_updated: 2026-08-19
applies_to: portfolio
related: [50_atom_architecture_reference]
owner: Nick
---

> **Reconciled 2026-08-20.** Two diverged copies of this document existed with the same `id`
> and the same frontmatter: one at repo root, one under `OPS/`. Root was committed at `492a452`
> as though it were the only one. Neither was a superset. This file is the union: the `OPS/`
> body as the base, since it carried five sections and substantially richer treatment of the
> derivation states, the harness self-validation failure, and starvation granularity, plus the
> three passages that existed only at root (the `OMISSION` column, the 2026-08-19 pull-forward
> row, and the specific naming of the stale-tree incident). `OPS/51_ingestion_pipeline_reference.md`
> is now a pointer. Do not maintain a second body.

# Ingestion Pipeline Reference Architecture

## Purpose

This document defines the target state for how raw source data becomes served atoms, and provides a read only diagnostic battery plus a scorecard so an agent with repo and data access can grade the current implementation against that target without changing anything.

It exists because the atom contract is fully specified in 50_atom_architecture_reference and the surface products work, but the machinery between acquisition and the served graph has been rebuilt per source rather than implemented once. The observable symptom is atoms that exist in storage but do not surface at the node a user queries.

Revision 2 incorporates findings from the markets substrate agent, which ran most of this battery against the trading substrate before this document existed. That independent run confirmed the same defect class in a different domain and is treated here as a second data point rather than as a separate architecture.

## Scope

In scope: source acquisition, raw landing, canonicalisation into atoms, entity resolution, reconciliation, promotion, and the read path contract.

Deliberately out of scope: the atom field contract itself, edge type taxonomy, the adaptive UI rendering layer, calibration loop mechanics beyond the resolution feedback path, and per source licensing terms as commercial instruments.

One licensing constraint is in scope because it binds the architecture. Landing retention is per source, not universal. Permanent retention of raw payloads is a licensing posture as well as a storage decision, and some sources will carry no redistribution right or an explicit prohibition on retention. Each manifest entry therefore declares a retention class, and landing enforces it. Where a source cannot be retained, the manifest declares that replay for that source is unavailable and canonicalisation for it is not replayable by design. This is a known and accepted asymmetry, not a gap.

This reference is domain neutral by design. It is written to hold for both the property substrate and the markets substrate, because both run the same node, edge, and atom structure over different node types. The markets run confirmed the neutrality claim: the same root cause produced orphaned atoms in both domains through entirely different code.

## The governing principle

Every defect found across both substrates to date is the same defect. A validity check exists, and it can be satisfied by something that means nothing or means the wrong thing.

A concatenated empty address is not null, and passed a non null check 1,248,412 times. A tile centroid is a valid coordinate at a median 227 metres from the parcel it answers for. A bare ticker is a string in a string column named node_id. An empty identifier list is a populated field. A defaulted asset class is a real value. A copied envelope row is a number. Every one of these passes every check applied to it, and every one is semantically empty or wrong.

The rule this document enforces throughout: **presence is not validity, and a check whose predicate is shaped like presence cannot measure a property that is shaped like meaning.**

This has one immediate methodological consequence that governs the diagnostic battery below. Measuring the data cannot find these defects, because the measurement applies the same presence shaped predicates that admitted them. Both substrates surrendered every real finding to write path reading and none to data measurement. Where a code reading test and a data measuring test disagree, the code reading test is correct. Where the data looks clean and the write path has no meaning shaped check, the data is not clean, it is unmeasured.

The corollary for construction: every check must fail closed. An unresolvable identity routes to adjudication rather than defaulting. An unassignable node type refuses rather than defaulting. An unread denominator refuses to emit a score rather than emitting one. A check that can be satisfied by its own absence is not a check.

### How to build a meaning shaped check

The principle above states what a defective check looks like. This states how to construct a sound one.

**A presence shaped check has one input. A meaning shaped check has two or more independently derived inputs and asks whether they agree.** No single sentinel can satisfy a consistency requirement across two values that were derived separately, because the sentinel would have to be correct in both derivations at once.

**Independently derived means from different sources, not different fields.** This qualification is load bearing and the rule was wrong without it. Two fields arriving in the same payload from the same upstream are one derivation wearing two hats. A check comparing a declared status against content in that same payload is internal consistency, which reads like a meaning shaped check and is not one: a single upstream that fabricates both halves consistently passes it, and a source that is systematically wrong is systematically wrong in both fields.

The test to apply per check: could one upstream, acting alone, produce values that satisfy both sides? If yes, it is internal consistency. If satisfying the check requires two parties who do not coordinate, it is meaning shaped.

Internal consistency is not worthless. It catches transcription errors, partial writes, and schema drift within a payload. It does not catch a wrong source, which is the failure class this document exists to address, so it is recorded as its own category rather than counted toward meaning shaped coverage.

**Where a type can express the constraint, prefer the type over any check.** The markets substrate replaced a widened enum with a discriminated union, and the compiler then refused to build until the consumer narrowed on the discriminant. That is enforcement no one can forget to call, applied at every consumer at once, and it did the work a purpose built detector had never done because nothing invoked it. A type constraint has no trigger to be missing and no call site to be absent, which removes it from the dormant and starved categories entirely.

**But an annotation is not a validated construction, and the difference decides whether the type helps.** A field declared as a number accepts any number, including one we fabricated. The same substrate serves price bars through a schema declaring an observation as a date and a number, and a zero substituted for a missing close passes it, because a zero is a number. The type is doing exactly what it says and what it says is insufficient.

Constraints that hold between fields, or that depend on a domain rather than a shape, are not expressible by annotation. They are expressible by construction: a branded type reachable only through a factory that validates, so an instance that violates the constraint cannot exist. A bar type whose constructor enforces that the low does not exceed the open or close is a type carrying the constraint. A record of four numbers is not.

The test: can an invalid instance of this type be constructed? If yes, the type documents the shape and enforces nothing about the meaning.

**A generic substrate cannot validate domain semantics, and that is correct rather than a defect.** An atom carrying its claim as an untyped map can hold a parcel fact, a well production figure, or a price. That genericity is what lets one engine serve every domain. It also means the atom layer has no construction path that could refuse a bar with a zero close, because the atom does not know what a bar is.

So the layering is fixed by the architecture. The substrate validates the envelope: provenance completeness, temporal validity, binding resolution, access. Domain constraints must be enforced in the typed value before it becomes an atom, and there is no second chance afterwards.

Two consequences follow, and the second is a hypothesis worth testing rather than a conclusion.

Where the typed layer above the substrate is thin, meaning annotations rather than validated constructions, nothing validates domain values anywhere in the system. Not because a check was forgotten, but because the only layer that could hold it was never built. A substrate audit will report health throughout, correctly, since the envelope is sound.

And the absence of a natural home for domain logic may explain the estate's dominant habit rather than culture explaining it. A generic substrate invites every writer to carry its own domain handling, because there is no shared place the architecture points to. Six sibling writers each holding a divergent copy of the same geometry helper is what that looks like from below. If this is right, the remedy is a per domain typed layer that writers are required to construct through, not exhortation about duplication.

**A default copied into its callers survives its own removal.** Where a check or a default is defended in depth, meaning the signature carries a default and every caller independently supplies the same value, removing the signature default reads as a fix and changes nothing. Enumerate call sites before scoring any default as remediable.

The template instance is from the property substrate, at three-layer-audit.mjs:168, which compares a county code carried in an atom body against the county code parsed out of that atom's entity binding and fails on disagreement. It ran against 13,717,341 atoms, found zero disagreements, and was made to throw rather than report. It is the only check found in either substrate that cannot be satisfied by a value carrying no meaning, and it is the shape every other check should be converted toward.

Where a second independent derivation does not exist, one must usually be constructed rather than the check weakened. A resolved node binding checked against the source record's own jurisdiction field, a computed area checked against a stated area, a scored denominator checked against the population it claims to measure. The cost of a meaning shaped check is that it requires a second source of truth. That cost is the reason presence shaped checks proliferate, and paying it is the fix.

### Absent, zero, and unmeasured are three states

Any instrument that cannot distinguish these three is defective, and the defect is not cosmetic.

A fabricated zero is worse than an absence, because a zero is arithmetically usable. An absence propagates as an absence and forces a decision downstream. A zero enters an average, a coverage percentage, a ratio, and a customer facing number without ever announcing that it was invented. The property substrate carries this at six rails across all 254 counties, where a scored zero is indistinguishable from never measured, and carried it as an area share asserting that none of a parcel lies in a zone the same record lists.

The rule: an unrepresentable state is made representable, never encoded in a sentinel. Not zero, not an empty string, not a not a number value, not a boolean default. If the type cannot express the state, the type is wrong.

### A type that never requires an atom to carry its own claim

**Status: tested and narrowed. The broader hypothesis it replaces was falsified.**

Across five sibling schemas in one contract, every claim bearing field is optional. Only identifiers and a single buffer parameter escape. So an atom of any of these types parses cleanly while carrying no claim at all: a hazard atom with no hazard finding, a district atom with no district name, identifier or type.

The type constrains the claim's domain once a claim is carried, and never requires one to be carried. That is the hole, and it is narrower and more actionable than what was written here before. The remedy is a discriminated union whose determined arm requires the finding fields, which is a type change rather than a check. In the flood case the refinement machinery already enforces exactly that shape in the absence direction and was never written in the other.

**What was falsified, recorded because the falsification is the more useful result.** An earlier version of this section proposed that constraint effort concentrates where it is cheap and thins out where the meaning lives, on the theory that nobody can express is a plausible price as a type annotation while everybody can express matches this pattern. Two instances supported it and a four schema test did not.

Those four authors did write domain constraints on semantic fields: minimum lengths on names and identifiers, positivity on radii and widths, non negativity on distances. One decision parameter is both required and positive. The mechanism predicts the opposite of what they did.

So the flood schema is an outlier within its own contract rather than an exemplar of a tendency, which makes its unconstrained zone string a smaller and sharper finding with a cheaper fix, since four siblings already demonstrate the shape. And the ten unbounded numbers in the other substrate stand as a finding about that contract rather than as evidence of anything general.

The general lesson is about the claim rather than the schemas. Two instances plus a mechanism that explains them is a hypothesis, and a mechanism good enough to feel explanatory is precisely when the sample size stops being checked.

### An instrument can be reliable in one direction only

The test above was run with a filtered search over primitive type declarations rather than a full read of each schema body, so fields typed through imported schemas and any refinements were invisible to it.

That asymmetry matters and it does not invalidate the result. The constraints it found are real, so the falsification is sound: a claim that these fields are unconstrained is disproved by finding constraints on them. But the same instrument cannot establish absence, because it could not see everything that might constrain a field.

A clean falsification and an unreliable confirmation, from one pass. Where an instrument is asymmetric, say which direction it supports and do not carry its confirmations at the same weight as its refutations.

**Collapses compose, and the composite is invisible to each layer's author.** Where one substitution feeds another, the states lost multiply rather than add, and every layer looks locally defensible.

The instance: a scoring function returns zero when its risk denominator is missing, non positive, or the quantity is zero. That zero flows into a deposit path which derives a verdict from the sign of the score, and a zero derives to the scratch label. So a grader that declined, a grader that judged flat, and a trade whose risk was never established all arrive as the same row with the same label. Three states, one record, nothing distinguishing them.

Neither author could see it. The first wrote a function returning zero for an unmeasurable input, which is a defect but a local one. The second wrote a derivation from a score, which is sound if the score means what it says. The collapse lives in the composition and is visible only to a reader holding both.

The diagnostic: for any substitution, trace what consumes its output and ask what that consumer does with the substituted value specifically. A fail open feeding a derivation is the shape to look for.

**A guard can be disarmed by a substitution in its caller.** This is the inverse of every failure state catalogued so far. The guard exists, is correct, is armed, is deployed, and its verdict is consumed. It is unreachable, because a caller normalises the input past the condition the guard tests.

The instance: a scoring function refuses and returns zero when a quantity is not positive. One caller coerces a missing or zero quantity to one before calling it, so the refusal branch can never fire from that path. The guard's honest refusal is unreachable, and what arrives instead is a value computed over a fabricated quantity.

The diagnostic is cheap and nobody runs it: for every guard, ask whether its trigger condition can actually be produced by its callers. A refusal on a condition that no caller can present is dead code wearing a guard's name, and it will pass any audit that asks whether the guard exists.

**Symmetric corruption preserves the sign and destroys the magnitude.** Where a fabricated value feeds both sides of a difference, the difference keeps its direction and loses its size.

That splits the exposure by consumer rather than reducing it. A consumer reading the sign sees a verdict that looks correct. A consumer reading the magnitude is reading fiction. In the observed case the stored label is a sign test and survives, while the stored score does not, so a ledger's verdict population is clean and its magnitude population is corrupt in the same rows.

This is the least visible failure mode in this document. Every other one produces something that looks wrong to somebody. This one produces a correct looking answer next to a fabricated number, and only a consumer of the second is harmed.

**Immunity upstream does not prevent contamination downstream.** Where several producers converge on one deposit path, the collapse happens at the deposit, so a producer that cannot fabricate still contributes to the ambiguous population if its honest output is indistinguishable from a fabricated one.

The instance: of six graders feeding one ledger, three form their score from a boolean and are structurally incapable of carrying a fabricated magnitude. One of those three nonetheless emits zero for a legitimately neutral outcome, and zero derives to the same label a fabricated zero derives to. So the stored population carries at least four distinct origins under one label: a grader that declined, a grader that judged genuinely flat, a computation whose denominator was missing, and a categorical outcome that was honestly neither.

Count the origins converging on a value, not the producers capable of fabricating it. The second number is smaller and it is not the one that determines how much the stored population means.

**Narrow domains resist fabrication; continuous ones do not.** A score that can only be plus one or minus one has no magnitude to invent, which is why those three graders are immune. That is a type property rather than a check, and it suggests a remediation available nowhere else: where a value's meaningful range is small and discrete, making the type reflect that removes the fabrication class entirely rather than detecting it.

The immunity is narrow and should not be overstated. A categorical score cannot be fabricated. It can still be wrong, since a grader can decide held when it broke, and nothing in this section touches that.

**A sentinel in a key does not produce one bad record, it merges an unknown number of good ones.** Where an empty string or a default participates in a deduplication or primary key, every record carrying the sentinel collides into a single row. The corruption is compressed rather than repeated, so it presents as one benign looking record, and the count of what was merged into it is unrecoverable. Check every key component for a sentinel before checking anything else, because this class destroys the evidence of its own size.

### Store the value, never its rendering

A claim substrate holds claims. A formatted display string is a rendering of a claim, and storing one in place of the claim destroys the claim permanently.

The instance: a captured macro atom stores a price as a currency formatted string, a change as a percentage formatted string, and a classification computed from that change. The underlying number, the revision it was taken at, and the source series vintage are not stored. Nothing can be recomputed from it, so no later correction job can repair it the way a supersession pass repaired an earlier population of observations. The defect is not merely present, it is unfixable in every row already written.

Two consequences follow, both sharper than the general rule.

**The accrual rate matters more than the population size.** Where each new row is permanently unrepairable, the cost is a flow rather than a stock. Stopping the write is separable from fixing the shape and far cheaper, so stop first, fix second, resume third.

**Formatting also collapses states.** The same instance returns an identical em dash cell for a fetch that failed and a series that genuinely holds nothing, so two states the substrate exists to distinguish become byte identical once stored, and the em dash passes every non null check applied to it. Rendering is lossy by design, which is correct at the display layer and fatal at the claim layer.

The check to apply: could this stored value be recomputed, compared, or corrected without re-fetching the source? If not, a rendering has been stored where a value belonged.

### A measurement whose method is unrecoverable is not a measurement

Distinct from storing a rendering, and in one way worse. There, the value was destroyed and the loss is visible once you look at the row. Here the values are intact, plausible, and served, and what is missing is the definition of what they count.

The instance: 253 live geometry coverage rows produced by a scorer that exists in no repository in the estate. What survives is a verify script that matches the producer's output by pattern, and a rule declaring the denominator reconstructible from checked in source, which it is not. The counting rule exists only inside a string emitted by code nobody holds. Every geometry coverage figure in the ledger rests on it.

Such a number cannot be reproduced, audited, corrected, or compared against a re-run. It has the form of evidence without the substance, and nothing about it looks wrong.

The test: could this number be reproduced from what we hold today? If not, it is an assertion rather than a measurement, however it was originally produced.

Two consequences. Provenance that points at a producer which no longer exists is a broken chain at the method rather than at the value, and a provenance field can be fully populated while the chain is severed. And a verifier built against a producer's output format rather than against its method passes for as long as the format holds, entirely independent of whether the counting is right.

Disposition is recover, re-derive, or retire. Reconciling new numbers against old ones is not available, because there is nothing to reconcile against.

### Present tense atoms accumulate into an apparent history

An atom whose knowledge time is now, asserting what is currently believed, is honest row by row. A sequence of such atoms is not a history, and will be read as one.

Each row says as of now. The collection looks like a time series. A reader asking what the regime looked like in June, answered from a June row, receives values that were current in June only in the sense that they were the then current revisions, and the row carries no statement of that. Any judgment computed inside the row inherits the same property.

This is not a defect in any row. It is a property of the collection that no row declares, and it is the mechanism by which a substrate of honest present tense claims becomes a hindsight contaminated record without anyone writing a false one.

Two requirements. Every present tense atom states its revision policy explicitly, so a later reader can tell which question it answers. And any consumer treating a sequence of them as a time series is a separate claim requiring its own adjudication, not a free read over existing rows.

### Instruments state their snapshot

Any diagnostic, audit, or measurement declares the commit, branch, or data snapshot it ran against, in its output.

This is not bookkeeping. The markets agent ran the inert mechanism audit against a working tree forty commits behind origin, and six of sixteen test files were invisible, producing a wrong answer twice. The check "does this test file exist" passed on a stale tree. That is the governing defect appearing inside the instrument rather than inside the data, which is the most consequential place for it to appear and the least likely place to be looked for.

## Content

### 1. The four layer spine

Every source moves through four layers. Each layer has exactly one job and one contract with the layer above it. No layer reaches past its neighbour.

**Layer 1, acquisition.** Fetches. That is all. Emits raw bytes plus a source identifier, a fetch timestamp, and a checksum. It performs no parsing, no filtering, no normalisation, and no schema inference. Every source is registered by a manifest declaring its origin, its refresh cadence, its authority level, its license terms, and its retention class.

**Layer 2, landing.** Stores the raw payload immutably, exactly as received, for the duration its retention class permits. Nothing writes to landing except acquisition. Nothing mutates a landed record, ever. Landing is the replay substrate: if canonicalisation logic is wrong, it is fixed and rerun from landing rather than repaired in place downstream.

**Layer 3, canonicalisation.** The only place transformation happens. Raw becomes typed atoms attached to resolved nodes with typed edges. This layer decomposes into four ordered stages covered in sections 2 through 5 below. It must be deterministic and replayable: the same landed bytes plus the same logic version produce the same atoms.

**Layer 4, serving.** Read only views built over the canonical graph. Applications, agents, and the MCP surface read here and only here. No surface product ever reads landing, and no surface product ever runs transformation logic of its own.

Three rules hold across all four layers.

Provenance travels with every record at every layer, so any value on any screen traces back to the bytes it came from.

Provenance is a reference, never a copy of mutable state. A provenance receipt that snapshots a value it points at will serve a stale number through the field a reader trusts most. This failure is worse than a missing receipt, because it fails silently in the one place designed to be authoritative.

Each layer knows only the contract of the layer below it. A change to a source must never require a change in serving.

### 2. The source adapter contract

The central structural fix. No source ever talks to the atom directly. Every source implements one adapter interface, without exception, and adapters are the only components permitted to interpret source specific structure.

An adapter declares four things at registration:

1. Source identity, which resolves to a manifest entry and carries authority level, license terms, and retention class
2. Node types it is capable of producing
3. Native identifiers it carries, and which of them are authoritative keys
4. Default confidence, with the basis for that default

An adapter does exactly one thing: read landed bytes, emit candidate atoms in the six field shape of claim, provenance, confidence, citation, time, and access or license.

An adapter explicitly does not write to the graph, does not resolve entities to canonical nodes, does not deduplicate, does not infer edges, and does not decide precedence against existing data. A candidate atom carries only the source's native identifier and has no canonical node binding yet.

The write path enforces this structurally. The atom append interface rejects any atom whose node binding is not a canonical node identifier. A bare source key in a node binding field is not a data quality problem to be measured later; it is a write that must fail at the boundary. Absent this check, orphan counts grow silently and every downstream measurement is a lagging indicator of a defect that was expressible at write time.

The payoff is that everything after the adapter is shared machinery that behaves identically whether the bytes came from a county appraisal district, a state shapefile release, a code body, or a markets feed. Adding a source becomes writing one adapter, not negotiating a new path to the graph.

### 3. Resolution

The hardest stage, because it is the only one that makes an irreversible judgement about identity. A wrong resolution poisons every atom, edge, and derived read hanging off that node. Everything else in the pipeline is recoverable by replay. This is not.

**The canonical key is minted, not borrowed.** The canonical node identifier is a system minted stable identifier. Source identifiers, including the county assigned parcel identifier, are aliases carried on the node with their own validity eras. This is settled by the markets precedent: symbols are reassigned, so keying on the symbol makes "what did this identifier refer to in 2023" unanswerable. Counties renumber parcels for the same practical reasons exchanges reassign tickers.

The property domain requires one extension markets does not need. Parcels split and merge, so node identity is not only reassigned but bifurcated and consolidated. Alias eras are sufficient for reassignment but not for lineage. Parcel nodes therefore also carry SPLIT_FROM and MERGED_INTO edges, and a resolution against a superseded parcel identifier must resolve to the lineage rather than to a single successor.

Resolution maps a candidate's native identifier onto a canonical node. It runs in three tiers, tried in order.

**Tier 1, deterministic.** An exact match on an authoritative alias. On a match, resolution is complete at high confidence with no further inference. This tier should carry the overwhelming majority of volume, and if it does not, the alias layer itself is the defect.

**Tier 2, probabilistic.** Where no authoritative alias matches, structured comparison over normalised attributes: normalised address plus geometry centroid containment in the property domain, issuer name plus exchange plus security type in markets. This tier produces a score, not an answer. High band scores resolve. Low band scores create a new node.

**Tier 3, provisional.** Middle band scores do not guess. The candidate mints a provisional node and enters an adjudication queue.

Node type assignment is part of resolution, not a downstream attribute. A defaulted node type produces a node that resolves cleanly and means the wrong thing, which no identity test will catch. Adapters declare producible node types at registration, and resolution must assign a type from that declared set explicitly. A silent default is prohibited; an unassignable type routes to adjudication like an unresolvable identity.

Three properties are mandatory across all three tiers.

Every resolution decision is itself stored as an atom recording the candidate, the node chosen, the method, the score, the logic version, and the date. Resolution is therefore auditable and replayable like everything else.

Merges are recorded as edges. A node is never destructively rewritten into another node, because that discards the evidence needed to reverse a bad merge.

Adjudication outcomes feed the calibration loop, so the matcher improves measurably over time rather than remaining a static heuristic.

### 4. Provisional nodes and the promotion gate

A provisional node is a real node carrying a flag that identity is unconfirmed. It holds atoms and serves reads normally, but everything derived from it inherits that uncertainty, and it can never merge into a confirmed node automatically.

Representation alone is not sufficient. A substrate in which provisional nodes exist but nothing is ever promoted is not a working ambiguity mechanism; it is silent accumulation wearing the appearance of one. The promotion gate is a separate obligation with its own owner, its own queue depth measurement, and its own throughput expectation. A provisional population that only grows is a failing gate regardless of how well the concept is modelled.

This is the mechanism that lets ingestion proceed at volume without silently corrupting the graph. The alternative failure modes are both worse: guessing produces confident wrong answers with no marker, and blocking produces coverage gaps that look like missing data.

### 5. Reconciliation and promotion

Once resolved, a candidate atom meets the atoms already present on that node.

Same claim from a higher authority source: confidence updates, both atoms retained, provenance preserved for each.

Contradictory claim: emit a CONFLICT edge. Never overwrite. A conflict is information, and suppressing it produces a graph that looks clean and reads wrong.

Newer version of the same rule or fact: emit SUPERSEDED_BY and close the effective_to window on the prior atom rather than deleting it.

Promotion is the gate. Only reconciled atoms enter the served graph, and they enter only through views. An atom that has not passed resolution and reconciliation is not readable by any surface product.

### 6. The atom lifecycle states

Written, resolved, scored, served. Four states, in order, each gating the next.

The resolved state is load bearing and is the one most commonly omitted. An atom can be written, scored, and served while bound to the wrong node, and every instrument in that pipeline will report health. Scoring an unresolved binding produces a rigorous measurement of the wrong entity, which is the shape of both the 1,521 atom correction in markets and the flagship zoning number in property. A scorer must therefore refuse to score an atom whose binding has not passed resolution, rather than scoring it and reporting confidence.

## The read only diagnostic battery

Every test below is non mutating. The agent reads code, configuration, schema, and data, and writes only its findings. No test modifies storage, reruns a factory, or triggers a backfill.

Report format per test: test id, pass or fail or partial, the evidence found, and the file paths or queries used.

### Layer 1 and 2, acquisition and landing

**T-01 Source manifest completeness.** Does a registry of sources exist that declares origin, cadence, authority, license, and retention class for each? Count sources present in code or config against sources present in the manifest. Pass: every ingesting source has a manifest entry. Failure means source authority is implicit, and precedence in reconciliation cannot be principled.

**T-02 Landing existence and immutability.** For each source, is the raw payload retained unmodified with fetch timestamp and checksum, for the period its retention class permits? Look for in place updates, overwrites, or transformation applied before storage. Pass: raw is write once and never mutated. Failure means the pipeline is not replayable and every downstream defect requires re-fetching from the origin.

**T-03 Replay capability.** Can canonicalisation be rerun from landing for a single source without re-fetching? Trace whether the code path exists. Pass: a documented and reachable replay path for every source whose retention class permits landing. Failure is the single largest constraint on remediation, because it means every fix is a re-ingest.

**T-22 Idempotency masking check.** If a replay path exists, determine whether the write path carries a deduplication or idempotency key that would cause a replay to skip rows that already exist. Trace the key definition, typically a tuple of source, entity, and date. Pass: replay overwrites or supersedes prior canonicalisation output rather than skipping it. This test is a hard gate on the backfill step. A replay that skips existing rows will report success, change nothing, and consume the remediation window.

Read the write path, not the DDL. The markets instance is application level: a select against a dedup key followed by an early return, with no unique constraint anywhere on the atom table. A schema audit of that substrate returns clean and finds nothing. Grep for early returns guarded by an existence check in the persistence layer, not for constraints.

### Layer 3, adapters

**T-04 Adapter boundary audit.** For each ingest path, determine whether it writes to the graph directly. Look specifically for factory code that performs fetch, transform, resolve, and write in one pass. Pass: no ingest path writes to the graph outside the shared resolution and reconciliation machinery. This test is expected to fail against the current three factory setup, and the value is in the specific enumeration of which paths bypass which stage. In markets the equivalent finding was that the correct call pattern appeared at one call site against eighteen taking a permissive default.

**T-20 Write time binding validation.** Does the atom append interface reject an atom whose node binding is not a canonical node identifier? Read the append path itself rather than counting atoms. Pass: a bare source key or unresolved identifier in a node binding field raises at write time. This test measures the cause of which T-07 and T-08 measure the effects, and its absence is the reason orphan populations grow without detection. In markets this check is absent, and a bare ticker string is written into a column named node_id.

**T-05 Adapter declaration coverage.** For each adapter or factory, are the four declarations present: source identity, producible node types, native identifiers with authority marking, default confidence with basis? Report which of the four are missing per source.

**T-06 Six field completeness.** Sample atoms per source and report the percentage populating each of claim, provenance, confidence, citation, time, and access or license. Report by source, not in aggregate, because the aggregate will hide the sources that are worst.

### Layer 3, resolution. This is the priority block.

**T-07 Join key coverage.** What percentage of atoms are bound to a canonical node by an authoritative alias, versus bound by a raw source native key, versus unbound? Report by source and by county. This is the headline number for the whole diagnostic.

**T-08 Orphan atom census, stratified by atom class.** Count atoms whose node binding does not correspond to any node reachable by the application read path. Report totals and the top twenty jurisdictions by orphan count. This is the direct measure of the Floresville class defect.

Report orphans separately for fact atoms and for judgment atoms, meaning any atom carrying a graded, adjudicated, or calibrated claim. Orphan severity is not uniform. An orphaned fact is recoverable by replay and costs coverage. An orphaned judgment atom is filed under a binding that is not a node, which means the calibration loop is accumulating graded outcomes against an entity that does not exist. That corrupts the signal the substrate is being built to own, and replay does not recover it because the grading was performed against the wrong referent. A single orphaned judgment atom is a more serious finding than a large population of orphaned facts. The markets substrate found this class at zone_atoms.py:318, where a resolver exception falls back to the raw symbol as the node binding and the write returns success.

**T-09 Node duplication census.** For a sample of jurisdictions, count distinct nodes that resolve to the same real world entity by authoritative alias, normalised address, or geometry containment. Report a duplication rate per county. The markets analogue found two live nodes for a single issuer following a rename.

**T-21 Node type assignment audit.** For each node type in use, determine whether the type was assigned explicitly from the adapter's declared set or received a default. Report the count and proportion of defaulted type assignments per source. Pass: no node carries a defaulted type. A defaulted type produces a node that passes every identity check and still means the wrong thing. In markets this surfaced as an index fund carrying the node type of an operating company.

**T-10 The single parcel trace.** Select one Floresville parcel with a known surfacing gap. Count atoms on the node the application queries. Separately count atoms whose source native key should map to that parcel. Report both numbers, the node identifiers involved, and the resolution path each atom took. If the second number exceeds the first, the defect is resolution rather than coverage, and this test produces the concrete instance that proves it.

**T-11 Resolution decision auditability.** For a sample of resolved atoms, can the agent recover which method resolved them, at what score, under what logic version, and on what date? Pass: resolution decisions are stored as first class records. Failure means resolution cannot be graded, replayed, or improved.

**T-12 Provisional representation.** Do provisional or unconfirmed nodes exist as a concept in the schema? If not, determine what the pipeline currently does with ambiguous matches: silently guess, silently drop, or fail the row. Report which.

**T-23 Promotion gate throughput.** Where provisional nodes exist, measure the provisional population over time, the adjudication queue depth, and the count of nodes ever promoted to confirmed. Pass: a non zero promotion rate and a queue that does not grow monotonically. A population of provisional nodes with zero promotions is a failing gate, and it scores separately from representation for exactly that reason.

### Cross cutting

**T-25 Sentinel and default admissibility audit.** For every validity check in the write, resolution, and scoring paths, identify the cheapest value that satisfies it, then determine whether that value is semantically valid. Report per check: the predicate, the minimum satisfying value, whether that value can occur in production, and **when the field is optional, whether omission is the cheapest satisfier** (report `OMISSION` as its own column value rather than folding it into the cheapest satisfier).

Pass: no check can be satisfied by a value that carries no meaning. Failure instances observed across both substrates include a concatenated separator string passing a non null address check, a default node type substituting for an unassigned one, a raw source key passing a node binding check, an empty identifier collection passing a populated field check, a road reference stored in a city column passing non null, non blank, and alphanumeric checks, and an identifier pattern check validating the form of a binding without asking whether it resolves. This test is the direct instrument for the governing principle and should be run before any data measuring test, because its failures explain why the data measuring tests return clean.

**Adjudication on knowingly admitted values.** Where a check is deliberately widened to admit a value that does not satisfy its own meaning, this is a permitted state only under one condition, and naming the defect is not that condition. Prose does not enforce, and a named defect is prose with a function attached.

The permitted state is **admitted with an enforced boundary**, not admitted with a named defect. A detector for the admitted value must exist, and something must fail when the admitted value reaches a consumer that treats it as valid. A detector that is exported but never called in a gating position is a starved mechanism under T-24, and the widened check scores as an undetected failure regardless of how carefully it was documented at the time.

Report per instance: the widened check, the admitted value, the detector, the gating call site, and what fails there. A missing gating call site is the finding.

Preferred remedy where the admitted value is a different kind of thing rather than an edge case of the same kind: split the type rather than widen the check. A record kind admitted into a transform enum is the sentinel pattern relocated to the type layer, where it is harder to see and equally satisfiable. Two branches cost more to write and cannot be satisfied by the wrong thing.

**Pull-forward row (2026-08-19):** where a field carries a declared formula and its declared inputs are both available, recompute the formula from the inputs and treat disagreement as a finding. No new source and no dependency. Cheapest actionable meaning shaped check either substrate has produced. Run before the remaining enumeration rows where this applies (provenance and authority fields completed first; formula-plus-inputs rows next).

**A row cannot be graded without reading what constrains the check's input.** The cheapest satisfier of a check is determined by the type of the value reaching it, not by the check's own predicate, so a row graded from the predicate alone may be wrong in either direction.

The instance: a check refusing an atom that claims presence while carrying no geometry. Read alone, its cheapest satisfier looks like any truthy value, which would make the check presence shaped and not worth listing. Read together with the schema governing that field, which types it as a union of two geometry shapes, an empty object fails validation before the check is reached and the cheapest satisfier is a real polygon. The check holds. Had the schema been a permissive passthrough, it would not.

So the schema and the check are one unit. Grading either alone produces a confident wrong answer, and the error runs both ways: a sound check can be dismissed as presence shaped, and a weak check can be credited with protection its input type actually provides.

**The unit holds only where the schema runs first.** Where a default fires before validation, the schema sits downstream of the defect and cannot change the cheapest satisfier of the default itself, so that row's grade stands without reading it.

That gives three states rather than two when auditing an existing enumeration. Rows whose input type was read and confirmed. Rows where the ordering makes the input type irrelevant, which stand as filed. And rows that turn on a schema nobody opened, which are provisional in both directions. Marking the middle set provisional would be false modesty that costs the next reader a re-read for nothing.

**And note where each constraint can live.** A schema knows shape and cannot know intent. In the same instance, the schema's own refinement constrained only the absent case, because the expectation that this atom should carry geometry exists at the call site rather than in the type. Some constraints are structurally unavailable to a schema, and a check that closes a hole a schema cannot see is complementary rather than redundant.

**A known blind spot, and it is structural rather than a matter of thoroughness.** This test enumerates checks and asks what each admits. A check that does not exist has no row, so the method finds weak checks by construction and finds missing checks only when a reader happens to notice an absence.

Several of the most consequential findings in both substrates were absences: no validation at an atom append boundary, no database constraint on a binding, no country filter on a geocode query. Every one surfaced because someone remarked on it, not because the enumeration reached it.

The inversion that closes the gap is field driven rather than check driven: for each field carrying a claim, ask what validates it, and record nothing as a row rather than skipping the field. That is a larger pass than this one and should be scoped separately.

Until it is run, a completed T-25 states coverage honestly as the weak checks that exist, not as every place the substrate can accept garbage.

**Track unobservable populations separately from unread paths.** A path not yet read is work remaining. A population the diagnostic structurally cannot see is a permanent limit, and conflating them lets a report read as nearly complete when part of it is unmeasurable.

Two instances from one substrate. Fabrication at a one minute grain is invisible beyond forty eight hours, because a second vendor rewrites that whole window on a two day lookback, so a query can only ever see the last two days regardless of what occurred. And a fetch function that writes to no store leaves nothing to query at all, so its output is unobservable at every horizon.

Report the count of what was found, and beside it the named populations that could not have been found. The second list is what determines how much the first means.

**The derivation column, four states.** Every failing check carries one of the following, and the distinction between the last two was previously collapsed and is the most commonly mistaken.

1. **Available now.** A second independently derived value exists today and the check can be written this week. Subdivide this state by what the check can catch, because the two are not equivalent. **Two independent sources** catches an error in either source and is the only shape that evidences a source being right. **Source against our own derivation** catches our transformation error and never evidences the source being correct, since a wrong input passes cleanly. Both are worth building and only the first closes the source question.
2. **Available once a named dependency lands.** The second derivation is possible in principle but its input is not collected yet. Name the dependency and the file. This is the actionable sequencing queue and it disappears under a binary.
3. **Internal consistency only.** Two values are comparable but both originate from the same upstream. Record it as its own category. It catches transcription errors, partial writes, and schema drift, and it does not catch a wrong source. Do not count it toward meaning shaped coverage.

**One case where internal consistency is the right instrument rather than a weak one.** It cannot catch a wrong upstream, because a wrong upstream is wrong consistently. It does catch substitutions *we* perform, because a value we fabricate is not constrained by the relationships the real values satisfy.

Price bars are the worked example. Open, high, low and close stand in arithmetic relation: the low cannot exceed the open or close, the high cannot fall below them. A vendor returning bad prices returns internally consistent bad prices. A zero substituted for a missing close breaks the relation immediately and detectably. So for any field group carrying internal arithmetic or logical constraints, an internal consistency check is sufficient against our own fabrications and should be built before reaching for a second source.
4. **None exists.** No second derivation is obtainable from anything currently held. This subdivides into three kinds with entirely different remedies, and collapsing them produces a purchasing list containing things that cannot be purchased.

**Foreclosed.** A publisher exists and a control forbids reaching it. Not a data gap. The remedy is one of the three escapes below, and only the last is a control change.

**Absent.** No witness exists in the world at an obtainable price. This is the purchasing list.

**Self authored.** The claim is a statement about what we did rather than a relayed fact: what scope was searched, on what basis, at what time, what status was assigned. There is no external witness by construction and there should not be. These rows are permanently none exists, correctly so, and no purchase, escape or control change touches them. Report them separately or they will be costed as a data gap that can never close.

**Discarded at the moment of writing.** The distinguishing fact existed and was destroyed by the write itself, so no witness survives anywhere. The instance: a deposit path that derives a verdict when a grader supplies none, so a grader that declined and a grader that agreed produce identical rows. Neither a purchase nor a control change reaches it, because there is nothing to buy or unblock. Only a schema change going forward, and every row already written stays ambiguous permanently.

This is the unrepairable property appearing in a calibration ledger, and it has a diagnostic signature worth recognising: **the question about it cannot be answered by any query over the stored data.** Where a defect makes its own measurement impossible, that impossibility is a stronger statement of the defect than any number would have been. Record the unanswerable question rather than substituting an answerable proxy for it.

One asymmetry worth stating, because it is the cleanest statement of what an isolation control does. The same defect can be unverifiable in one repository and verifiable in another with identical data, where the only difference is which layer is permitted to make the call. That is a control determining verifiability, not the data.

Two things that look like second derivations and are not. A second implementation of the same computation over the same input is one derivation written twice; agreement proves the implementations match, not that the input is right. And a branch that falls back to a differently computed value inside the same function is one derivation wearing two hats, which is why a fallback is so often the thing a containment check refuses.

A third, and the most deceptive: **an identifier derived from a value cannot verify that value.** A decentralised identifier, a hash, a checksum or a signature computed over a binding inherits whatever the binding was. It is well formed for a fabricated key exactly as it is for a correct one, and any check comparing the derived identifier against its source is internal consistency that cannot fail.

This one deceives because the artifact carries the appearance of attestation. Cryptographic machinery attests to the integrity of transmission and storage, meaning that what was written is what is read. It says nothing about whether what was written was right. A substrate whose verifiability rests on derived identifiers has proven only that it has not corrupted its own mistakes.

**A validation harness must derive its own inputs.** Where any input flows from the artifact under test into the harness that tests it, that dimension is unvalidated and the harness will report clean regardless.

The worked instance is the most instructive failure this programme has produced. An adjudication harness compared a flood determination against the federal authority and reported 5,714 correct out of 5,714, which was read as the replacement instrument being sound. The harness queried the authority at the same coordinate the atom had used. It could therefore only ever confirm that the authority agreed with itself at a given point, and could never detect that the point was in the wrong parcel. When a containment check was built afterward, 229 of 5,750 parcels carried a query point outside their own boundary, median 15.3 metres out, with 40 flipping hazard class. Every one of those had passed the earlier adjudication.

The instrument and the disease shared a definition of valid, one level below where the same defect had already been found twice. Before trusting any harness, state which inputs it derives independently and which it accepts from the artifact, and treat the second list as the set of things the harness cannot see.

**T-26 Test as lock audit.** Does any test in the suite assert a value that the system produces but that no source authority recognises? Such a test converts a defect into a specification and prevents its correction by making the fix look like a regression. The property substrate carried an assertion against a FEMA zone code that does not exist. In markets the equivalent would be any test asserting that an index fund carries the node type of an operating company.

Report per instance: the assertion, the value asserted, and the authority that does not recognise it. Failure here is more serious than an absent test, because an absent test leaves the defect visible.

**On detection.** A static audit finds these poorly, and both substrates confirm it. The markets instances surfaced only when an executor changed behaviour and had to decide whether a failing assertion was right, and the property instance surfaced the same way. The assertion looks correct until the authority is known, which is exactly the information a static reader lacks.

The reliable detector is procedural: when a test fails during a correctness fix, the default assumption is that the test is wrong, not the fix. But a procedural rule is a protocol step and will run at the rate protocol steps run, which is zero. It must therefore be hook shaped to survive.

The enforceable form: any change that modifies a test assertion and production behaviour in the same commit carries a required field naming the authority that recognises the new expected value. Blocking, machine parseable, and cheap to satisfy when the answer is legitimate. Where the asserted value belongs to an enumerated external domain, meaning a hazard zone code, an asset class, a node type, or a jurisdiction identifier, the authority reference is required on the assertion itself and CI fails without it.

**T-27 Scorer contract audit.** For every measurement or completeness instrument, determine whether it can emit a value when a required input is missing. Pass: a missing required input causes refusal to emit, not emission of a value computed without it. A scorer with an unread required denominator that still returns a number has no contract, only an implementation.

This applies equally to any instrument reporting portfolio state, coverage, or completeness. A shared scorer implementation does not satisfy this test. The scored property is whether a wrong answer is expressible.

**T-24 Inert mechanism audit.** Applies to every correctness mechanism in the pipeline, at any layer: promotion, corporate action or parcel lineage handling, universe or roll synchronisation, conflict detection, supersession, and adjudication routing. For each, determine whether it actually runs and whether it can do anything when it runs. Two distinct failure modes, with different diagnostics.

**Dormant.** The mechanism has no trigger. No scheduler entry, no route, no caller other than a test. Found by tracing callers and scheduler registration for each mechanism, not by reading the mechanism itself.

**Starved.** The mechanism has a trigger and is correct, but its input precondition is never populated, so it runs and does nothing. Found by evaluating the mechanism's gating predicate against actual data. This is the harder of the two and the easier to mistake for success, because the mechanism reports a clean run.

**Starvation has a granularity, and a coarse unit of analysis hides it.** A function that is called looks alive at the function level. An optional parameter that no caller ever supplies, guarding a branch inside that function, is invisible to any audit that stops at the call site.

**And starvation can come from the environment rather than from a caller.** A control whose precondition is never satisfied where it actually runs is starved even when every caller supplies its arguments correctly.

The instance: a staleness check requiring deep repository history, running almost entirely in continuous integration, where checkouts are shallow by default. It answers unverifiable on every control on every run. The answer is honest and the control does nothing, because the environment never provides what it needs. It can only fire locally or in a job configured for full history.

This is the harder variant to see, because the code is correct, the caller is correct, and the verdict is truthful. Ask not only whether the input is supplied but whether the runtime where the control executes can supply it.

The instance: a capture function accepts an optional list of input atom identifiers and, when supplied, records lineage from the derived atom to its inputs. The single caller passes none, so the lineage branch has never executed. The atom was designed to cite its inputs and has never cited one, while every audit at the function level reports the function as live.

Two consequences. Audit at the argument level, not only the call level, for any parameter that gates a branch. And note that a starved parameter means the code behind it is also unexercised, so supplying it for the first time is not enabling tested behaviour, it is running untested behaviour in production. Treat it as new code and verify accordingly.

Report per mechanism: exists, armed, and non vacuous. A mechanism must satisfy all three to count.

**Method: prove starvation by removal, not by search.** A starved mechanism is precisely a thing whose removal breaks nothing, so removal is the direct test and enumerating call sites is a proxy for it. Delete the mechanism, rebuild, and run the suite. A clean build is the proof; a break is the disproof and the reference it names is the gating call site the search was looking for.

This is verify by violating arriving from the other direction. Violating a check and removing a control are the same experiment run against the two different things a control can be, and the two rules collapse into one: exercise the negative case rather than observing the positive one.

One qualification by language. In a compiled or statically typed codebase the build catches every reference, so removal plus rebuild is sufficient. In dynamically dispatched code removal can build clean and fail at runtime, so removal must be paired with the full suite and a runtime exercise of the paths that would use it. State which regime applies when reporting the result.

Both failure modes are distinct from absent and score worse than absent in one specific way: you cannot prioritise fixing what you believe you already have. A dormant or starved mechanism passes code review, passes design review, and answers the question "do we handle this" affirmatively while handling nothing.

Test suites are mechanisms for this purpose. A package carrying ninety eight tests that run in no CI workflow is dormant, and it is a common instance because a suite that exists satisfies the question "is this tested" while enforcing nothing.

The markets substrate carries three dormant mechanisms and one starved one. Its promotion job is armed, has an operator route, and would still promote nothing, because it gates on external identifiers that no node carries. Both failure modes are the expected residue of building multiple ingest factories under time pressure, so the property substrate should be assumed to carry instances until this test says otherwise.

### Layer 3, reconciliation

**T-13 Destructive write check.** Does any path overwrite or delete an existing atom on receiving a new value for the same claim? Pass: no destructive writes. Failure means prior state is unrecoverable and conflicts are invisible.

**T-14 Conflict representation.** Do CONFLICT edges exist in the data? Count them. A count of zero across sixty million items is itself a finding, because it means contradictions are being resolved silently by write order rather than represented.

**T-15 Temporal validity coverage.** What percentage of atoms carry effective_from and effective_to, distinct from ingest timestamp? Report by source and by atom type. Regulatory and code atoms without validity windows are the highest risk subset.

**T-16 Supersession chain integrity.** Where SUPERSEDED_BY edges exist, do the corresponding prior atoms have closed validity windows? Report orphaned or dangling supersession chains.

### Layer 4, serving

**T-17 Read path source.** Does the application read from canonical views, from canonical tables directly, or from source or staging tables? Trace the actual query path for the parcel detail read. Failure here means the serving contract is not enforced and canonicalisation can be bypassed.

**T-18 Provenance survival and freshness.** For a sample of values rendered in the application, can each be traced back through the served view to a specific atom and from there to a specific landed payload? Separately, determine whether any provenance receipt stores a copy of a value rather than a reference to it, and whether any stored copy now disagrees with its referent. Report the percentage of surfaced values with a complete chain and the count of stale snapshotted receipts.

**T-19 Statewide coverage versus surfacing gap.** For every Texas county, report atoms held versus atoms surfaced through the application read path. Rank by absolute gap and by gap ratio. This produces the remediation sequencing map and is the primary input to the layer by layer plan.

## Scorecard

Thirteen dimensions, each scored 0 to 3. Maximum 39.

Scoring levels: **0 absent**, the property does not exist. **1 ad hoc**, exists in some paths, by convention rather than enforcement. **2 partial**, exists in most paths, inconsistently enforced, known exceptions. **3 contract enforced**, structurally guaranteed, violation is not expressible.

| # | Dimension | Tests | Score | Evidence |
|---|---|---|---|---|
| 1 | Source manifest, authority, and retention declaration | T-01, T-05 | | |
| 2 | Landing immutability | T-02 | | |
| 3 | Replay capability and replay effectiveness | T-03, T-22 | | |
| 4 | Adapter boundary separation | T-04 | | |
| 5 | Write time binding validation | T-20 | | |
| 6 | Atom field completeness | T-06 | | |
| 7 | Authoritative alias coverage | T-07 | | |
| 8 | Resolution correctness, orphan, duplication, and type assignment | T-08, T-09, T-10, T-21 | | |
| 9 | Resolution auditability | T-11 | | |
| 10 | Provisional representation | T-12 | | |
| 11 | Promotion gate throughput | T-23 | | |
| 12 | Non destructive reconciliation and conflict representation | T-13, T-14 | | |
| 13 | Temporal validity and supersession | T-15, T-16 | | |
| 14 | Serving contract and provenance integrity | T-17, T-18, T-19 | | |

Note: the table carries fourteen rows because dimension 5 was added and the former dimension 9 was split. Maximum is 42. Bands below are stated against 42.

Bands:

**36 to 42.** Contract enforced. Remediation is tuning.

**26 to 35.** Structurally sound with enforcement gaps. Remediation is closing specific paths.

**16 to 25.** Working but bespoke per source. Remediation requires the shared machinery to be built once and sources migrated onto it.

**Below 16.** The pipeline is a set of point solutions. Remediation is architectural and should be sequenced before further source onboarding.

### Scoring interaction rules

Dimensions 7 and 8 are weighted above the others for sequencing purposes. A low score there invalidates the reliability of everything downstream regardless of how the other dimensions score.

A high score on dimensions 12 and 13 combined with a low score on 7 and 8 is a specific and dangerous profile, not a partial success. It means write side discipline was built before identity discipline, so the substrate faithfully preserves, versions, and audits bindings that are wrong. The result audits clean and reads wrong, which is harder to detect than a substrate that is uniformly weak. The markets substrate scores exactly this profile and it is the reason its defects survived until read at the append path rather than at the data.

A high score on dimension 10 with a zero on dimension 11 is the same class of illusion at smaller scale, which is why they are scored separately.

**The dormancy cap.** T-24 does not score as its own dimension, because inertness is not a property of one layer. It is a cap applied to whichever dimension the affected mechanism belongs to. Where a mechanism exists but is dormant or starved, that dimension cannot score above 1, regardless of the quality of the code. The scored property is enforcement, and an unarmed mechanism enforces nothing. Scoring it as its own dimension would let a substrate carrying three inert mechanisms lose three points once and keep full marks on the dimensions those mechanisms were supposed to guarantee, which inverts the finding.

Any dimension capped by dormancy must name the mechanism and the missing trigger or unpopulated precondition in its evidence cell.

## Remediation sequencing

Remediation proceeds by layer across the whole state, not jurisdiction by jurisdiction. Fixing Floresville alone produces one correct county and leaves the defect class intact everywhere else.

Dependency order for the fix, once the scorecard is returned:

1. Write time binding validation, because it is a boundary check that stops the orphan population growing while everything else is being fixed, and it is the cheapest item on this list
2. Replay capability, because without it every subsequent fix costs a re-ingest
3. Idempotency verification, as a gate on step 5. Confirm that a replay overwrites rather than skips before committing a sixty million item backfill behind it
4. Minted canonical identifiers with source identifiers demoted to aliases, plus parcel lineage edges, because resolution quality is capped by the key model
5. Shared resolution stage, extracted out of the three factories into one path, including explicit node type assignment
6. Backfill resolution across all sources from landing, statewide, one source at a time
7. Reconciliation and conflict representation
8. Serving contract enforcement and provenance chain closure

Steps 1 through 5 are prerequisites. Step 6 is where the sixty million items get corrected and where the Floresville class defect closes everywhere at once.

One warning on step 6 acceptance. A backfill that reports matched and written counts in agreement is evidence that the mechanism ran correctly. It is not evidence that the bindings it wrote to are correct. The markets substrate executed a flawless supersession over 1,521 atoms, with reconciliation proving out exactly, onto nodes whose identity had never been validated. Step 6 acceptance criteria must therefore include a post backfill rerun of T-07, T-08, and T-21 against the affected sources, not the job's own success report. A rigorous remediation onto unvalidated bindings produces a rigorous record of the wrong thing.

## Open questions

1. **Resolved.** The canonical join key is a system minted stable identifier. County assigned parcel identifiers are aliases with validity eras, not keys. Parcel lineage requires SPLIT_FROM and MERGED_INTO edges beyond the markets alias model. Confirm the identifier scheme itself with Nick.
2. What is the authority ordering across sources when two disagree, and is it a fixed ranking or a per claim type ranking? Route to Nick.
3. **Resolved.** The markets and property substrates share the contract, not the implementation. Shared: the stage sequence, resolution decisions stored as atoms, merges as edges, write time binding validation, and explicit type assignment. Not shared: the tier 2 matcher, which is domain specific in both. Coupling a live trading system's release cycle to a sixty million item property backfill carries operational risk with no compensating benefit.
4. Do resolution adjudications pool into public tier signal, or do they stay tenant private under the sovereignty rule? Route to catalog agent for consistency with the tenancy model.
5. Which sources carry retention classes that prohibit landing, and what is the fallback correctness mechanism for those sources given that replay is unavailable to them? Route to Valerie for the license position and Nick for the mechanism.
6. Slot number 51 in the 50 band is assumed available. Confirm against the current doc set before filing. Route to doc_repo agent.

## Dependencies

Depends on 50_atom_architecture_reference for the six field atom contract, edge type taxonomy, temporal validity semantics, and applicability predicates. This document does not restate or modify those definitions.

## Cross references

- 50_atom_architecture_reference, for the atom and edge contract this pipeline produces
- Open ADR on actor atoms, relevant to who adjudicates a provisional node and under what authority
- Markets substrate diagnostic run, TW-61, TW-64, TW-67, as the independent second data point for this battery

## Revision history

2026-08-19, drafted from strategic session on ingestion pipeline friction. Establishes four layer spine, adapter contract, three tier resolution, provisional node handling, and the read only diagnostic battery with scorecard.

2026-08-19, revision 6 following the markets item 1 and item 2 returns. Corrected the constructive rule: independently derived means from different sources, not different fields, since two fields from one payload are one derivation and a single upstream fabricating both halves passes the check. Added internal consistency as a distinct fourth state in the derivation column, not counted toward meaning shaped coverage. Added the preference for type constraints over checks, following a discriminated union split where the compiler enforced at every consumer what an uncalled detector never had. Added that a default copied into its callers survives its own removal, following a withdrawn call site count where all three callers independently supplied the same defaulted value.

2026-08-19, revision 5 following T-25 through T-27 returns from both substrates. Added the constructive rule that a meaning shaped check requires agreement between two independently derived inputs, with the property substrate's cross field county consistency check named as the template. Added the absent, zero, and unmeasured three state rule, establishing that a fabricated zero is worse than an absence because it is arithmetically usable. Added the requirement that instruments state the snapshot they ran against, following an audit returning a wrong answer twice from a stale working tree. Adjudicated knowingly admitted values: the permitted state is admitted with an enforced boundary, not admitted with a named defect, with type splitting preferred over check widening. Sharpened T-26 with the procedural detector in hook shaped form.

2026-08-19, revision 4 following the property substrate scan return and cross reading against the markets diagnostic. Added the governing principle section establishing that presence is not validity and that meaning shaped properties cannot be measured by presence shaped predicates, with the methodological consequence that code reading tests outrank data measuring tests where they disagree. Added T-25 sentinel and default admissibility audit, T-26 test as lock audit, and T-27 scorer contract audit. Extended T-24 to cover test suites as dormant mechanisms. Established that the written, scored, served lifecycle requires resolved as a gating state between written and scored, since an atom can be written, scored, and served while bound to the wrong node.

2026-08-19, revision 3 following markets substrate diagnostic return. Added T-24 inert mechanism audit covering dormant and starved mechanisms as distinct failure modes with distinct diagnostics. Established the dormancy cap as a cross cutting scoring rule rather than a dimension. Stratified T-08 by atom class, separating orphaned facts from orphaned judgment atoms on calibration loop severity grounds. Sharpened T-22 to direct the audit at the write path rather than the schema, following confirmation that the markets instance carries no unique constraint and returns clean under a DDL audit. Added post backfill verification to step 6 acceptance criteria.

2026-08-19, revision 2 following markets substrate agent review. Added T-20 write time binding validation, T-21 node type assignment audit, T-22 idempotency masking check, and T-23 promotion gate throughput. Split provisional handling into representation and promotion gate. Added write time binding validation as a scored dimension. Resolved open questions 1 and 3. Added retention class to the manifest and scope. Added the provenance as reference rule. Added scoring interaction rules covering the audits clean and reads wrong profile. Resequenced remediation to place binding validation first and idempotency verification as a gate before backfill.
