# W-30 RETURN: accessPolicy no default on property/road chains

SNAPSHOT
- repo: hauska-engine
- commit: d3f37949003fae5a99a82b62956352b7dcaa1022
- worktree: P:/tmp/mp-a1-accesspolicy
- branch: fix/w30-accesspolicy-no-default
- HEAD verified equal to the required commit before edits and again after (`git rev-parse HEAD`).

No git add, commit, or push.

## Pre-registered failure modes

1. Call-site survival. Removing `?? "public-free"` from the two mappers still leaves atoms emerging as public-free if a caller of `getPropertyAtomChain` / `getRoadAtomChain` (or a consumer of `atoms[].accessPolicy`) copies the same default. Did not fire inside this repo. READ: `services/retrieval-api/src/server.ts` returns `c.json(chain)` with no rewrite on both `/property-nodes/:parcelNodeId/atom-chain` and `/road-nodes/:roadNodeId/atom-chain`. READ: `spine-health/probes.ts` only uses presence of `zoningFact` / `setbackRule` / `buildableEnvelope`. READ: `serving-sweep/chain-assembly.ts` builds `atoms[]` as `{ did, type, kind, payload }` and does not set `accessPolicy` at all. Unproven outside this repo: hauska-mcp-server / PE clients that HTTP-consume the chain and might do `atom.accessPolicy ?? "public-free"`.

2. Scope miss: a third serving-path site of the same default on property/road chains, or an accidental `listJurisdictions` change. Did not fire. READ the `listJurisdictions` docblock in full (snapshots whose `accessPolicy` is absent are treated as `"public-free"`). That function is still `return this.storage.listJurisdictionStatus(filter)` with the same comment. No third property/road chain mapper with `?? "public-free"` was found. Write-path defaults exist elsewhere (named under leave_behind) and are not chain serving.

## Schema grade (with input type)

The default fired on the mapper output, before any consumer schema. Exception applies: removing it is the fix even if a later schema would reject.

READ `@empressaio/atom-contract` (installed 1.x):

- `AccessPolicy` is the five-value ADR-017 union (`registration.d.ts`).
- `ZoningFactAtomInstance.accessPolicy` is required `AccessPolicy`. `ZONING_FACT_SCHEMA.accessPolicy` is a required `ZodEnum` of those five values. Same shape on contract `road-node`.
- `PROPERTY_ACCESS_POLICY_SCHEMA` is that required five-value enum. `PROPERTY_DEFAULT_ACCESS_POLICY` is a factory default at construction, not a list/serve default.
- Cheapest satisfier of a required `AccessPolicy` enum is `public-free` (first member). That is exactly what the mapper was synthesizing.

READ engine types:

- `StoredAtomInstance` is a union. `CodeAtomInstance.accessPolicy` is optional. `RoadNodeAtomInstance.accessPolicy` is required. Property instances inherit the contract required field.
- `isPropertyAtomInstance` / `isRoadNodeAtomInstance` / `parseStoredAtom` do not check `accessPolicy`. The list path never runs `ZONING_FACT_SCHEMA`. A stored JSON body without the field is listable. VERIFIED by the new tests writing such bodies through `InMemoryStorage`.

Old wire type was `accessPolicy: string` (required). Cheapest satisfier of that field is any string, including `public-free`. New wire type is `accessPolicy?: AccessPolicy`. Cheapest satisfier is absent. Missing is now representable instead of being filled.

`registration.d.ts` still says an omitted field is treated as `"public-free"` by surfaces that gate on visibility, and that the contract itself performs no enforcement. That comment describes `list_*` / catalog gating (the `listJurisdictions` exception), not a license for the chain mapper.

## Call sites of the emitting functions (READ)

`getPropertyAtomChain` / `getRoadAtomChain` live on `HybridRetrieval` in `packages/retrieval/src/index.ts`. In-repo imports of `@hauska-engine/retrieval` that call them:

- `services/retrieval-api/src/server.ts` (HTTP passthrough of the whole chain)
- `services/retrieval-api/src/spine-health/probes.ts` (slot presence only)
- retrieval and retrieval-api tests
- `packages/retrieval/src/serving-sweep/__tests__/assembly-divergence.test.ts` (compares slot identity, not `accessPolicy`)

Consumers of returned `atoms[].accessPolicy` in this repo: the two mappers were the only writers of that field. HTTP serializes the object as-is. The PE vendor adapter (`atom-chain-to-facets.ts`) reads top-level zoning / setback / envelope slots, not `atoms[].accessPolicy`. Bulk `assembleChain` does not emit the field.

This is not a proof that no other callers exist in other repos.

## Files changed

- `packages/retrieval/src/index.ts` (modified): omit missing/null/undefined `accessPolicy` on chain wire; wire type is now optional `AccessPolicy`. Shared helper used by both chain methods. `listJurisdictions` untouched.
- `packages/retrieval/src/__tests__/accesspolicy-no-default.test.ts` (new): absent, undefined, and null must not emerge as `public-free`; explicit `public-paid` / `public-free` still copy through.

No third serving-path site of the same default was included because none was found on property/road chains.

## What was violated, and what the violation did

Fix in place: 7/7 pass. VERIFIED.

Temporary reintroduce of `value ?? "public-free"` inside `servedAccessPolicy`: 5 failed, 2 passed. VERIFIED. Failures were `expected 'public-free' not to be 'public-free'` on:

- property chain, field absent
- property chain, field explicitly undefined
- property chain, field explicitly null
- road chain, field absent
- road chain, field explicitly null

The two copy-through cases (explicit `public-paid` on owner-fact, explicit `public-free` on road-node) still passed, which is the discriminator: the test fails the synthesized default, not a present value.

Fix restored: 7/7 pass again. Related chain tests also pass (`atom-chain-wire-dids`, `mcp1-property-chain-widen`, `road-atom-chain-no-calibration`, `assembly-divergence`).

Two violation shapes were used (absent vs explicit null/undefined), on both chain methods.

## Second mechanisms

Observation: a stored atom with no `accessPolicy` was served as `public-free` on `atoms[]`.

Accepted mechanism: the mapper `payload.accessPolicy ?? "public-free"`. Discriminator is the violation above: putting that expression back makes the test red; omitting the field makes it green.

Rejected: `InMemoryStorage.writePropertyAtom` injects `public-free` on write. READ: it stores the instance as-is. The test also asserts `entry.payload.accessPolicy` stays undefined on the absent-field case.

Rejected: JSON / HTTP serialization invents `public-free` for missing keys. `JSON.stringify` omits `undefined`; it does not invent this string. The HTTP layer is a passthrough of the mapper output.

Rejected (for the passing tests): empty `atoms[]` so the assertion never hits the field. Discriminator: `chain.atoms.find` / `toHaveLength(1)` plus `'accessPolicy' in entry === false`.

## leave_behind

- `packages/storage/src/pg-storage.ts` `resolveAccessPolicy` and `packages/storage/src/property-atom-batch-write.ts` still default the `access_policy` COLUMN to `public-free` on write. Serving reads the JSON body, not that column, so this is a parallel write-path default, not the W-30 mapper. Owner: storage seat. Plan row: not this card.
- Contract comment on omit-equals-public-free for gating surfaces remains. That is the declared `listJurisdictions` exception, still live in storage `listJurisdictionStatus`.
- Downstream MCP / PE clients that default a missing wire field were not in this worktree.

leave_behind: those three items above. No new branch, store, or parallel project.

## Not proved

- No live Postgres body was sampled. Proof is InMemoryStorage plus the mapper, which is the layer that had the default.
- No HTTP round-trip was run. READ of `c.json(chain)` is the wiring; not executed as an HTTP probe.
- No proof that every out-of-repo consumer of `atoms[].accessPolicy` omits the old default.
- Empty-string `accessPolicy` is still copied (same as `??`, which does not treat `""` as missing). Not claimed as a third violation path.
- `listJurisdictions` still treats absent snapshot policy as public-free by design. Not changed. Not re-tested beyond reading the source.
