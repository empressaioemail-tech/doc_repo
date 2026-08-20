---
id: 90_enforcement_build_order
title: Enforcement Build Order, Controls for the Systems Agent
status: draft
last_updated: 2026-08-19
applies_to: portfolio
related: [61_enforcement_doctrine, 51_ingestion_pipeline_reference]
owner: systems agent
---

# Enforcement Build Order

## Purpose

Doc 61 states the doctrine. enforcement.mdc states the rules agents must follow. Neither enforces anything. This document is the build order for the controls that make them bite, ordered by leverage against cost.

Nothing in 61 or the rules file is live until the controls below exist. By the operating law in 61, a doctrine that requires reading is a wish, and the measured base rate for this operation is that hook shaped controls run and protocol steps do not.

## The four questions every control below answers

Each control specifies its executor, its trigger, what fails when violated, and what bypasses it. A control that cannot answer all four is not shipped.

The fourth question matters most and is the newest. Every control has a scope narrower than its name. State the real scope rather than claiming coverage.

---

## Tier 1, build first. Cheap, high leverage, no dependencies.

### C-01 Deployment gate script

Reports, per registered control, whether that control is running in production. Asks whether the control's anchor exists in the deployed tree and whether its content matches HEAD, rather than resolving the commit that introduced it, because introduction commit archaeology breaks under rebase and squash.

- Executor: script, portable across repos
- Trigger: scheduled. Not on deploy alone, because the condition being detected is nobody deploying and a gate firing on deploy cannot fire during the window it exists to catch
- Fails: non zero exit and a per control report
- Bypasses: controls not in the registry. The registry is the weak point and must be append only on merge

The deployed commit must be attested from two independent parties, since a single source is presence shaped and satisfiable by the cheapest wrong value. The running process reporting its own version, and the image or revision label answering independently of anything the process says. Agreement passes, disagreement is a finding, neither available refuses, and a lone derivation resolves while being labelled presence shaped rather than counted as corroboration. Two derivations stamped from one build argument degrade to internal consistency silently, so record the coordination point and re-verify when the deploy path changes.

Build first because it is the smallest script here and it makes an entire invisible failure class visible across every substrate at once. The class: a control merged, correct, reviewed and not deployed, so the thing it guards is unguarded by a guard that demonstrably exists.

### C-02 Snapshot declaration

Every audit, diagnostic, sweep, or measurement emits the commit, branch, or data snapshot it ran against, in its output.

- Executor: a shared helper in each repo's audit harness, plus a CI check that audit scripts call it
- Trigger: every audit run
- Fails: the audit refuses to emit a report without it
- Bypasses: ad hoc queries run outside the harness. Accept this, and require the harness for anything entering durable memory

Trivial to build. An audit was already run against a tree forty commits stale and returned a confident wrong answer twice.

### C-03 Retired path decline and reappearance grep

A retired path returns a decline or 404, never a body. A CI grep fails if the path reappears anywhere.

- Executor: application route handler for the decline, CI grep for the reappearance
- Trigger: every request, every push
- Fails: 404 or explicit decline at runtime, non zero exit in CI
- Bypasses: a new path with a different name serving the same store. Mitigated only by the divergence test in C-07

Required before the tier2 retirement can be accepted. Generalises to every future retirement.

### C-04 Housekeeping three

Delete branch on merge plus a weekly prune reporting merged locals. A nested clone detector failing if an unexpected git directory or remote appears under doc_repo. A scheduled job flipping any P0 or P1 backlog item older than fourteen days with no plan row to expired, and posting the list.

- Executor: repo settings, a hygiene script, a scheduled job
- Trigger: merge, weekly, daily
- Fails: non zero exit on the hygiene script, an automatic status change on the backlog
- Bypasses: none material

All three replace prose controls with measured zero execution rates. The backlog expiry is specifically the reshaped form of a policy that would otherwise require someone to remember.

---

## Tier 2, build second. Requires design decisions but no new sources.

### C-05 Write time binding validation

The atom append interface raises when a node binding is not a canonical node identifier. A raw source key, a fallback string, or a value produced inside an exception handler is not a binding.

- Executor: the append path itself
- Trigger: every atom write
- Fails: raises, transaction aborts
- Bypasses: raw database connections. This is the known instance where an ORM bound guard was bypassed and a live row rewritten. Either extend to a database constraint or state the scope honestly

Stops the orphan population growing while everything else is fixed. Both substrates were found writing bare source keys into binding columns; that finding lives in the substrate returns that motivated this control, not as a present-tense inventory here.

### C-06 No silent defaults on identity or type

Node type, asset class, jurisdiction, and any enumerated identity field must be assigned explicitly from a declared set. An unassignable value routes to adjudication or raises. Defaults are removed, not widened.

- Executor: resolver, schema validation
- Trigger: every node create or update
- Fails: raises or routes to the adjudication queue
- Bypasses: call sites constructing nodes outside the resolver. Enumerate and close them

Expect defaults to be defended in depth: where a signature carries a default and every caller independently supplies the same value, removing the signature default reads as a fix and changes nothing. Enumerate call sites before scoring any default as remediable.

### C-07 Divergence test for parallel stores

Where an old and a new store both exist during a migration, a test compares them and fails on disagreement.

- Executor: CI test
- Trigger: every push while both stores exist
- Fails: non zero exit
- Bypasses: consumers reading the old store directly rather than through the compared path

This is what makes a staged retirement safe and it is what was missing on every parallel implementation to date.

### C-08 Test authority annotation

Any assertion of a value belonging to an enumerated external domain, meaning hazard codes, asset classes, node types, jurisdiction identifiers, carries a reference to the authority recognising it. Any commit modifying a test assertion and production behaviour together carries a required field naming that authority.

- Executor: CI lint over test files, plus a blocking commit or PR field
- Trigger: every push
- Fails: non zero exit, blocked merge
- Bypasses: assertions over values not in the enumerated domains. Accept, since the failure class is domain values

Three confirmed instances across both substrates of a test asserting a value no authority recognises, each converting a defect into a specification and making its correction read as a regression.

### C-09 Leave behind close field

Every lane finish card carries a machine parseable leave behind declaration. Blocking. "None" is valid and cheap.

- Executor: close template validation
- Trigger: lane close
- Fails: close is rejected
- Bypasses: work done outside a lane. Reduce by requiring a lane

---

## Tier 3, ongoing programme rather than a build.

### C-10 Cross field consistency checks

Convert presence shaped checks to meaning shaped ones. A presence shaped check has one input. A meaning shaped check has two or more independently derived inputs and asks whether they agree, and no sentinel can satisfy a consistency requirement across two derivations because it would have to be correct in both at once.

Template instance: a county code carried in an atom body compared against the county code parsed from that atom's binding, failing on disagreement. It ran across the full corpus, found no disagreements, and was made to throw rather than report.

This is not one control. It is a per check conversion programme, and its input is the T-25 enumeration, with a column naming the second derivation available to each failing check. Independently derived means from different sources, not different fields: two fields in one payload from one upstream is one derivation, and a check comparing them is internal consistency. Checks with no available second derivation split three ways: foreclosed by a control, genuinely absent and therefore a purchase, or self authored and permanently unobtainable by construction.

### C-11 Absent, zero, and unmeasured as distinct states

Audit every instrument for collapsed states and make unrepresentable states representable. Not zero, not empty string, not a not a number value, not a boolean default. If the type cannot express the state, change the type.

A fabricated zero is worse than an absence because it is arithmetically usable. An absence propagates and forces a decision. A zero enters an average, a ratio, and a customer facing percentage without announcing that it was invented.

---

## Standing rules for the systems agent itself

Verify every control by feeding it a known violation before reporting it as working. A control observed only passing has not been observed working. An output that looks convenient is a reason to distrust the instrument.

State the second mechanism that would produce the same observation and why it was rejected, for any finding entering durable memory. This applies to instruments as well as findings.

Where a finding is claimed as corroborated across sources, state whether those sources were in contact and through whom. Relay is contamination, it is often correct to do anyway, and it must be declared rather than counted.

## Revision history

2026-08-19, drafted as the implementation layer for 61_enforcement_doctrine, ordered by leverage against cost across three tiers.

2026-08-20, revision 2. Corrected C-01 to presence at revision with two party attestation and a scheduled rather than on deploy trigger. Stripped point in time state throughout: commit counts, call site counts and corpus figures are readings of a moment and belong in dated artifacts, not in a durable build order. A durable document states what a control does and why it matters; where a finding motivated a control, the finding is referenced rather than embedded.
