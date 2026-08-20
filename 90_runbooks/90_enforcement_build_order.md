---
id: 90_enforcement_build_order
title: Enforcement Build Order, Controls for the Systems Agent
status: draft
last_updated: 2026-08-20
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

### C-00 Vehicle file sync (internal consistency)

Compares the body of `.cursor/rules/enforcement.mdc` (below frontmatter) against `ENFORCEMENT.md`.

- Executor: CI script (`scripts/enforcement/c-00-vehicle-sync.mjs`)
- Trigger: every push
- Fails: non zero exit on any byte difference after normalisation
- Bypasses: harnesses that load neither file
- **Derivation class: internal consistency only.** One agent or one CI job typically edits both files in one change. Two copies, one party. This catches drift, transcription errors, and partial writes between the Cursor copy and the canonical file. It is not meaning shaped coverage of doctrine reach.

Build anyway. The vehicles doc predated the independently-derived rule; building C-00 as internal consistency is honest scoping, not a downgrade.

### C-00b Runtime doctrine-reach probe (meaning shaped)

The only instrument that measures doctrine reach empirically rather than inferring it from configuration files.

- Executor: probe script run at session start or on demand; records what an agent actually received
- Trigger: lane start, plus scheduled fleet sample
- Fails: non zero exit when expected doctrine text is absent from the agent's loaded instruction set; report lists missing hashes/sections
- Bypasses: ad hoc chats with no probe hook; harnesses not in the probe registry
- **Derivation class: meaning shaped.** Party one: repo files on disk at HEAD. Party two: instruction payload the running agent received. Agreement passes. Disagreement is a finding. Neither available refuses.

Design handoff: `_inbox/2026-08-19_systems_c00b_runtime_probe_design.md`. Systems seat owns fleet coverage; property seat owns substrate controls.

### C-01 Deployment gate script

Compares the deployed service tree against HEAD for each registered control anchor. For each control: does the anchor exist in the deployed tree, and does its content match the version at the deployed commit's HEAD-equivalent?

- Executor: script, portable across repos
- Trigger: on deploy, plus a daily schedule
- Fails: non zero exit and a report listing any control whose anchor is missing from production or whose content disagrees
- Bypasses: controls not in the registry. The registry is the weak point and must be append only on merge
- **Two-party attestation per doc 61 fourth state.** Record coordination points where both derivations share a deploy stamping point.

Build first because it makes an entire invisible failure class visible in both substrates at once. A control merged, correct, reviewed and not deployed leaves the thing it guards unguarded. The markets instance that motivated this control is in the 2026-08-19 markets enforcement arc session record.

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

Script IDs in `scripts/hygiene/` use **HY-01..HY-03** to avoid colliding with this programme row (C-04). HY-01 branch prune, HY-02 nested clone, HY-03 backlog expiry dry-run.

- Executor: repo settings, a hygiene script, a scheduled job
- Trigger: merge, weekly, daily
- Fails: non zero exit on the hygiene script, an automatic status change on the backlog
- Bypasses: none material

All three replace prose controls with measured zero execution rates. The backlog expiry is specifically the reshaped form of a policy that would otherwise require someone to remember.

### C-04b Branch protection (settings, not a build)

Classic GitHub branch protection on `main`. Highest leverage item in the programme because it converts existing rules from advisory to binding without a code change. Stage 1 is structural (force-push, deletion, and on code repos the pull-request route). Stage 2 is required checks and is gated on a reliability report.

- Executor: GitHub branch-protection API. Runbook `90_runbooks/91_branch_protection_runbook.md`
- Trigger: every push to `main` (GitHub receive)
- Fails: `GH006` / protected branch hook declined. Stage 1 proof: force-push refused on `doc_repo`; direct push refused on the five code repos, including as admin
- Bypasses: Stage 1 does not require CI, so a green or skipped check still binds nothing. `doc_repo` with `enforce_admins` false still allows planner direct push by design. Repos not in the runbook list are unmeasured. Job rename is a silent bypass of Stage 2 only, once Stage 2 exists
- **Derivation class: meaning shaped when verified by violation.** Party one: GET `/branches/main/protection`. Party two: a forbidden `git push` that must refuse. Settings-API success alone is presence shaped.

Landed Stage 1 on 2026-08-20. Close `_inbox/2026-08-20_branch_protection_close.json`.

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

**Path claim (2026-08-19 ruling):** all three node-creating code paths in the markets substrate supply a defaulted asset class at write time. Row count for how many nodes carry that default sits in the held data block and has not been taken. Do not unblock the data block to produce the count; the path claim is sufficient for remediation.

Property carries hand declared booleans across 3,556 cells.

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

Template instance: a county code carried in an atom body compared against the county code parsed from that atom's binding, failing on disagreement. Thirteen point seven million atoms, zero disagreements, made to throw.

This is not one control. It is a per check conversion programme, and its input is the T-25 enumeration, with a column naming the second derivation available to each failing check. Checks with no available second derivation require a new source rather than new code, and that is a budget decision rather than an engineering one.

### C-11 Absent, zero, and unmeasured as distinct states

Audit every instrument for collapsed states and make unrepresentable states representable. Not zero, not empty string, not a not a number value, not a boolean default. If the type cannot express the state, change the type.

A fabricated zero is worse than an absence because it is arithmetically usable. An absence propagates and forces a decision. A zero enters an average, a ratio, and a customer facing percentage without announcing that it was invented.

---

## Standing rules for the systems agent itself

Verify every control by feeding it a known violation before reporting it as working. A control observed only passing has not been observed working. An output that looks convenient is a reason to distrust the instrument.

**Removal as proof (T-24 standard method).** A starved mechanism is a thing whose removal breaks nothing. Delete, rebuild, run the suite. Clean build is the proof. A break is the disproof and names the gating call site. Enumerating call sites is a proxy for removal; removal is the direct test. This unifies with verify-by-violating: both exercise the negative case.

**Language regime.** In statically typed code the build catches every reference; removal plus rebuild is sufficient. In dynamically dispatched code removal can build clean and fail at runtime; pair removal with the full suite and runtime exercise of paths that would use the mechanism. State the regime when reporting a result.

State the second mechanism that would produce the same observation and why it was rejected, for any finding entering durable memory. This applies to instruments as well as findings.

Where a finding is claimed as corroborated across sources, state whether those sources were in contact and through whom. Relay is contamination, it is often correct to do anyway, and it must be declared rather than counted.

## Revision history

2026-08-20, C-04b branch protection Stage 1 landed and verified by violation. Stage 2 not applied.

2026-08-19, amendment following operator ruling. C-00 scoped as internal consistency; C-00b runtime probe added; C-01 sharpened to two-party deployed-tree attestation; C-06 node-type claim restated as path claim; removal-as-proof added to standing rules.

2026-08-19, drafted as the implementation layer for 61_enforcement_doctrine, ordered by leverage against cost across three tiers.
