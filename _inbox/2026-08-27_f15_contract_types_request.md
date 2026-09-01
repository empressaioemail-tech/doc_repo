---
id: 2026-08-27_f15_contract_types_request
title: Request to the substrate seat: F-15 contract types the Factory stages need, in the order the stages need them
date: 2026-08-27
last_updated: 2026-08-27
status: open
from: planner (integration)
to: substrate seat (hauska-atom-contract, publishes @empressaio/atom-contract)
plan_row: F-15 (90_operations/OPS-19_factory_plan_of_record.md)
consumer: _inbox/2026-08-27_f16_f18_conformant_writer_WDLL.md (property seat, F-16 to F-20)
law: 19_the_instrument_contract.md; _blueprint/10_model.md; 24_instrument_conformance_program.md Track 2
---

# F-15: contract types, by request

The conformant writer card (F-16, F-17, F-20, F-18) builds against published releases of `@empressaio/atom-contract`. Each type below lands as its own minor release with a conformance fixture and a behavioural test, in the order given, because each stage needs its type before it can be graded. The property lane may shim a type locally only with a check that fails the day the contract exports it, so every release you publish retires a shim.

Order and what each must satisfy (Track 2 numbering from `24_instrument_conformance_program.md`):

1. **2.1 branded `NodeId`**, constructible only by `mint()` or a validating `parse()`; a raw string does not type-check as a node id. Needed by F-16 first.
2. **2.10 alias as an atom** (`identity.alias` with validity era) and lineage as edges (`mergedInto`, `dividedInto`, `unmerged`). Needed by F-16.
3. **2.2 provenance class** as a discriminated union with per-class required fields (Record, Derivation, Assertion, Absence, or the set `19` names); a class with a missing required field does not compile. Needed by F-16 and F-17.
4. **2.3 `derivesFrom` required on Derivation, absent on Record**, enforced by the type. Needed by F-18 and F-20.
5. **2.4 absence verdicts**: `absent-verified` requires a source that responded; `lookup-failed` requires the failure reference; `not-applicable` requires the rule that excludes. Needed by F-17.
6. **2.8 supersession as an edge**; no `supersededBy` column exists to write. Needed by F-17.
7. **2.11 selector predicate** as a closed discriminated union (spatial containment, set membership, equality, range, composition). Needed by F-18.
8. **2.12 access as two fields**, discoverability and entitlement, replacing the single `accessPolicy` string at the type level while the store's column stays until F-10 migrates it. Needed by F-20.

For each release: the version number, the fixture path, and the behavioural test that fails on the violation the type forbids, reported to the planner and copied to the property lane. The published npm version is the record; a merged PR is not a release.

Standing constraints: the atom contract is Hauska commercial substrate (ADR-018), the only artifact in the estate that refuses to compile, and nothing in this request weakens a check to admit a value. Each release carries an ADR or an amendment to ADR-025/ADR-028; 1.9.0 through 1.22.0 shipped without one and this program does not add to that list.
