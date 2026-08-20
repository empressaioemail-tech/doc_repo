---
id: 51_ingestion_pipeline_reference
title: Ingestion Pipeline Reference Architecture, Diagnostic Battery, and Scorecard
status: draft
last_updated: 2026-08-19
applies_to: portfolio
related: [50_atom_architecture_reference]
owner: Nick
---

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

**A default copied into its callers survives its own removal.** Where a check or a default is defended in depth, meaning the signature carries a default and every caller independently supplies the same value, removing the signature default reads as a fix and changes nothing. Enumerate call sites before scoring any default as remediable.

The template instance is from the property substrate, at three-layer-audit.mjs:168, which compares a county code carried in an atom body against the county code parsed out of that atom's entity binding and fails on disagreement. It ran against 13,717,341 atoms, found zero disagreements, and was made to throw rather than report. It is the only check found in either substrate that cannot be satisfied by a value carrying no meaning, and it is the shape every other check should be converted toward.

Where a second independent derivation does not exist, one must usually be constructed rather than the check weakened. A resolved node binding checked against the source record's own jurisdiction field, a computed area checked against a stated area, a scored denominator checked against the population it claims to measure. The cost of a meaning shaped check is that it requires a second source of truth. That cost is the reason presence shaped checks proliferate, and paying it is the fix.

### Absent, zero, and unmeasured are three states

Any instrument that cannot distinguish these three is defective, and the defect is not cosmetic.

A fabricated zero is worse than an absence, because a zero is arithmetically usable. An absence propagates as an absence and forces a decision downstream. A zero enters an average, a coverage percentage, a ratio, and a customer facing number without ever announcing that it was invented. The property substrate carries this at six rails across all 254 counties, where a scored zero is indistinguishable from never measured, and carried it as an area share asserting that none of a parcel lies in a zone the same record lists.

The rule: an unrepresentable state is made representable, never encoded in a sentinel. Not zero, not an empty string, not a not a number value, not a boolean default. If the type cannot express the state, the type is wrong.

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

**Pull-forward row (2026-08-19):** where a field carries a declared formula and its declared inputs are both available, recompute the formula from the inputs and treat disagreement as a finding. No new source and no dependency. Cheapest actionable meaning shaped check either substrate has produced. Run before the remaining enumeration rows where this applies (provenance and authority fields completed first; formula-plus-inputs rows next).

**Adjudication on knowingly admitted values.** Where a check is deliberately widened to admit a value that does not satisfy its own meaning, this is a permitted state only under one condition, and naming the defect is not that condition. Prose does not enforce, and a named defect is prose with a function attached.

The permitted state is **admitted with an enforced boundary**, not admitted with a named defect. A detector for the admitted value must exist, and something must fail when the admitted value reaches a consumer that treats it as valid. A detector that is exported but never called in a gating position is a starved mechanism under T-24, and the widened check scores as an undetected failure regardless of how carefully it was documented at the time.

Report per instance: the widened check, the admitted value, the detector, the gating call site, and what fails there. A missing gating call site is the finding.

Preferred remedy where the admitted value is a different kind of thing rather than an edge case of the same kind: split the type rather than widen the check. A record kind admitted into a transform enum is the sentinel pattern relocated to the type layer, where it is harder to see and equally satisfiable. Two branches cost more to write and cannot be satisfied by the wrong thing.

**The derivation column, four states.** Every failing check carries one of the following, and the distinction between the last two was previously collapsed and is the most commonly mistaken.

1. **Available now.** A second independently derived value exists today and the check can be written this week.
2. **Available once a named dependency lands.** The second derivation is possible in principle but its input is not collected yet. Name the dependency and the file. This is the actionable sequencing queue and it disappears under a binary.
3. **Internal consistency only.** Two values are comparable but both originate from the same upstream. Record it as its own category. It catches transcription errors, partial writes, and schema drift, and it does not catch a wrong source. Do not count it toward meaning shaped coverage.
4. **None exists.** No second derivation is obtainable from anything currently held. This is the purchasing list, not the backlog.

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

Report per mechanism: exists, armed, and non vacuous. A mechanism must satisfy all three to count. Both failure modes are distinct from absent and score worse than absent in one specific way: you cannot prioritise fixing what you believe you already have. A dormant or starved mechanism passes code review, passes design review, and answers the question "do we handle this" affirmatively while handling nothing.

Test suites are mechanisms for this purpose. A package carrying ninety eight tests that run in no CI workflow is dormant, and it is a common instance because a suite that exists satisfies the question "is this tested" while enforcing nothing.

The markets substrate carries three dormant mechanisms and one starved one. Its promotion job is armed, has an operator route, and would still promote nothing, because it gates on external identifiers that no node carries. Both failure modes are the expected residue of building multiple ingest factories under time pressure, so the property substrate should be assumed to carry instances until this test says otherwise.

**Removal as proof (standard method, ruled 2026-08-19).** A starved mechanism is precisely a thing whose removal breaks nothing. Delete the mechanism, rebuild, run the suite. Clean build is the proof. A break is the disproof and names the gating call site the caller search was looking for. Enumerating call sites is a proxy; removal is the direct test.

This unifies with verify-by-violating (doc 61): violating a check and removing a control are the same experiment against the two things a control can be, and both collapse into exercising the negative case.

**Language regime.** In statically typed code the build catches every reference; removal plus rebuild is sufficient. In dynamically dispatched code removal can build clean and fail at runtime; pair removal with the full suite and a runtime exercise of paths that would use the mechanism. State the regime when reporting a T-24 result.

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
