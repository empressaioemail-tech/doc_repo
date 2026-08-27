---
id: 2026-08-27_atomdid_consumer
title: body.atomDid consumer named before Bexar write
date: 2026-08-27
status: closed
plan_row: P-82
parent_plan_row: F-02
snapshot: doc_repo main 4f9d40b · hauska-engine origin/main 7012ac7 · drain seat/property-drain 7012ac7 plus uncommitted lease v2
---

# body.atomDid consumer

Planner question 2026-08-27 00:50Z: name the consumer that reads `body.atomDid`. If a serve path treats it as identity, a writer-local id is a fallback string and BP-WRITE-01 must refuse it. If nothing serves or joins on it and the column is identity, admission is fine.

## Answer

Admission of a writer-local non-DID `atomDid` (`fhfact_*`, `cadroll_*`, `railfact_*`) is **fine**. BP-WRITE-01 does not refuse those strings.

## Consumer

`AtomRetrievalService.withGuaranteedAtomDid` and the atoms-list `did` mapper in `packages/retrieval/src/index.ts`. Same rule in `assembleChain.didOf` (`packages/retrieval/src/serving-sweep/chain-assembly.ts`).

Storage `getAtomByDid`, `listPropertyAtomsByParcelNodeId`, and `search` all `SELECT body` and never overlay `atoms.atom_did` onto the payload. Search builds the DID from `entityType` + `entityId` and ignores `body.atomDid`.

They treat `body.atomDid` as served identity only when it `startsWith("did:")`. A writer-local id does not, so serve backfills `buildAtomDid(entityType, entityId)`, the same derivation the write path used for the column.

LDT PE reads `atomDid` off the already-wired chain (`zoningFact.atomDid`), not `body->>'atomDid'`. Writer verify scripts that mention the jsonb expression are the opposite control: cad-parcel-roll and road-node lookup must use the `atom_did` PK.

## Rejected second mechanism

"Serve reads `body.atomDid` as identity for every stored string." Rejected because both serve mappers require the `did:` prefix before preserving. The `fhfact_*` fixture would be overwritten, not served. `DID_NAMESPACE` already refuses a `did:` method that is not hauska, or a type mismatch.

## Bexar

Unblocked on this question. First write still waits for lease v2 on engine main, migration `011_atoms_writer_lease_v2.sql` applied on `hauska_mcp` as a Factory run, and a Factory `runs` row for the resume.
