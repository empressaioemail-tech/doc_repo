---
id: 2026-08-27_f15_contract_types_WDLL
title: WDLL — F-15 contract types: the eight Track 2 types the Factory stages need, published from @empressaio/atom-contract as additive minor releases in stage order, each with a fixture and a test that fails on the violation it forbids
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: hauska-atom-contract (publishes @empressaio/atom-contract); consumers hauska-factory (shims retired per release), hauska-engine, legacy-design-tools, hauska-mcp-server (pins ^1.x, must not break)
plan_row: F-15
depends_on: none; the request at _inbox/2026-08-27_f15_contract_types_request.md is this card's origin
operator_go: 2026-08-27 ("can we send this one to a fresh agent?")
law: 19_the_instrument_contract.md; _blueprint/10_model.md; 24_instrument_conformance_program.md Track 2; 80_adrs/adr_018_atom_contract_substrate_layer.md (the contract is Hauska substrate, peer to the SDK); 80_adrs/adr_028_contract_cross_vertical_adoption.md; 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md
snapshot: hauska-atom-contract main a3984e1 · npm @empressaio/atom-contract 1.22.0 published 2026-08-12, tags v1.19.0 to v1.22.0 · CI ci.yml, publish publish.yml (npm publish is autonomous) · src carries conformance/, testing/, property/, access-policy.types.test.ts, registry.ts · open PR #22 on seat/substrate "feat(identity): Lane G NodeId + accessPolicy emitter (1.21.0)", 1 ahead 3 behind main, that worktree 5 files dirty · the Factory's conformant writer runs on local shims under src/contract-shim/ with a CI check that fails the day the contract exports each type
owner: SUBSTRATE seat, a fresh lane. Worktree registered ahead of creation: P:/seat-worktrees/substrate/hauska-atom-contract-f15 on seat/substrate-f15 from origin/main. Never P:/seat-worktrees/substrate/hauska-atom-contract (seat/substrate, another lane's dirty work and PR #22). The property F-10 lane consumes each release by deleting a shim; the planner grades each release by reading npm and the fixture.
---

# WDLL: F-15 contract types

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

The conformant writer and every Factory stage after it are built against eight types the contract does not yet export. They run today on shims under `src/contract-shim/` in the Factory repository, each guarded by a CI check that fails the day the contract carries the type, so every release you publish retires a shim. The order below is the order the stages need them. A release is a published npm version with a fixture and a behavioural test; a merged PR is not a release.

## What exists (read, do not rebuild)

`src/` on main already carries `conformance/`, `testing/`, `property/`, a registry, and an `accessPolicy` type with its own test. PR #22 on `seat/substrate` carries a branded `NodeId` and an `accessPolicy` emitter from Lane G that were written for 1.21.0 and may or may not have shipped in it; read the PR and the published 1.22.0 tarball before writing 2.1, salvage what is there, and say in CP1 what shipped and what did not. The Factory's shim for each type is in `hauska-factory/src/contract-shim/`; match its shape where the shim is right and say where it is wrong, because the Factory lane will delete the shim the day you publish.

## Done looks like

Eight additive minor releases of `@empressaio/atom-contract`, in order, each exporting one type family, each with a conformance fixture under `src/conformance/` and a behavioural test that fails on the violation the type forbids, each recorded in `CHANGELOG.md` and by an amendment to ADR-028, none breaking a `^1.x` consumer (engine, LDT, MCP server compile and test green against the new version), and after each release the Factory lane's shim check goes red until it deletes that shim.

## Acceptance items

1. **Worktree, salvage, CP1.** Create `hauska-atom-contract-f15` from `origin/main`. Read PR #22 and the 1.22.0 tarball; list in CP1 which of the eight types already exist in any form, what shape the Factory's shims expect for each, and the release plan (version numbers in order). | check: CP1 with the per-type table | grade: [ ]

2. **2.1 branded `NodeId`** constructible only by `mint()` or a validating `parse()`; a raw string does not type-check as a node id; `parse` refuses the old `{fips}:{propId}` grammar as a node id and accepts it only as an alias key. Fixture plus a test that a string literal fails to compile (a type-level test) and that `parse("48021:34137")` refuses as a node id. | check: release published; fixture; failing-violation test | grade: [ ]

3. **2.10 alias as an atom** (`identity.alias` with a validity era, `validFrom`, `validTo` nullable) and lineage as edges (`mergedInto`, `dividedInto`, `unmerged`) with no lineage column on the node. Test: an alias without an era refuses; a node type with a `mergedInto` field does not compile. | check: release; fixture; tests | grade: [ ]

4. **2.2 provenance class** as a discriminated union with per-class required fields (the classes `19` names: Record, Derivation, Assertion, Absence, and any the model adds), so a class missing a required field does not compile and a runtime `parse` refuses it. | check: release; fixture per class; refusal test per missing field | grade: [ ]

5. **2.3 `derivesFrom` required on Derivation, absent on Record**, enforced by the type and by `parse`. Test: a Derivation without `derivesFrom` refuses; a Record with one refuses. | check: release; two refusal tests | grade: [ ]

6. **2.4 absence verdicts**: `absent-verified` requires a source that responded (source id plus response reference), `lookup-failed` requires the failure reference, `not-applicable` requires the rule that excludes; a bare verdict string does not compile. | check: release; three refusal tests | grade: [ ]

7. **2.8 supersession as an edge**; no `supersededBy` column exists to write; `SUPERSEDED_BY` is an edge type with `closedAt` on the prior window. Test: an atom type with a `supersededBy` field does not compile; a supersession without `closedAt` refuses. | check: release; tests | grade: [ ]

8. **2.11 selector predicate** as a closed discriminated union (spatial containment, set membership, equality, range, composition) with an exhaustive `match`; an unknown kind does not compile. Test: exhaustiveness (adding a kind without a handler fails the build); the Factory's four flood selectors (A, AE, AO, X) type-check against it. | check: release; tests; the flood fixture from `_inbox/2026-08-27_f16-f18-conformant_close.json` item 8 passes | grade: [ ]

9. **2.12 access as two fields**, `discoverability` and `entitlement`, alongside the existing `accessPolicy` string, which stays exported and mapped until F-10 migrates the column; neither field defaulted; `parse` refuses an atom carrying one without the other. The existing `access-policy.types.test.ts` stays green. | check: release; refusal test; existing test green | grade: [ ]

10. **Consumers do not break.** After each release, `hauska-engine`, `legacy-design-tools`, and `hauska-mcp-server` compile and test green against it on a branch that bumps the pin; report each result. A release that breaks a `^1.x` consumer is unpublished by a patch that restores compatibility, never by deleting the version. | check: three consumer CI runs per release cited by run id | grade: [ ]

11. **Records and handback.** Per release: version, tarball digest, fixture path, the test that fails on the violation, the CHANGELOG line, the ADR-028 amendment, and a note to the property F-10 lane naming the shim to delete. CP1 after item 1, CP2 after item 5, close at `_inbox/2026-08-27_f15-contract-types_close.json` with `leave_behind`. | check: artifacts; npm view per version | grade: [ ]

12. **Out of this card.** Any change to the Factory, engine, LDT, or MCP server code beyond the pin bump on a test branch; the `accessPolicy` column migration (F-10); the language-neutral spec (Phase 1 of the repo intent); anything that weakens a check to admit a value. | check: pathspec | grade: [ ]

## Do not

- Weaken a check to admit a value. Where a type can express the constraint, prefer the type over a runtime check.
- Publish a breaking change under a minor version, or delete a published version.
- Write into `P:/seat-worktrees/substrate/hauska-atom-contract` or onto `seat/substrate`; PR #22 is read, not continued.
- Ship a type the Factory shim contradicts without saying which is right and why.
- Report a release from a merged PR; `npm view` is the record.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)
