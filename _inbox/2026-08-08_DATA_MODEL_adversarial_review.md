---
id: 2026-08-08_DATA_MODEL_adversarial_review
title: Adversarial review — nodes/atoms/edges data model proposal
date: 2026-08-08
status: review finding (read-only; no code, config, or DB changed)
owner: nick
reviews: _inbox/2026-08-08_DATA_MODEL_proposal_nodes_atoms_edges
method: live source read of P:\hauska-atom-contract, P:\hauska-engine, P:\legacy-design-tools, P:\hauska-map, P:\hauska-mcp-server, _catalog/texas_roster_v1.json, and the ADR set
related: [_inbox/2026-08-08_CONTRACT_coherence_audit, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_029_building_footprint_and_utility_easement_rails]
---

# Adversarial review — nodes, atoms, edges

Verdict up front: **the proposal is substantially wrong, and it is wrong in a specific and diagnosable way.** It was written from the contract coherence audit, and the audit read `hauska-atom-contract/src/property/*` and `hauska-engine/packages/atoms/`. It did not read `hauska-atom-contract/src/temporal/`, it did not read `hauska-engine/packages/storage/src/schema.ts`, it did not read `hauska-engine/packages/atoms/src/atom-link.ts`, it did not read ADR-010 or ADR-011, and it did not read `hauska-mcp-server`. Every one of those five sources contains a built, shipped mechanism that one of the six proposals asks to invent.

The proposal's central rhetorical move is "the model has node types and no explicit relationship layer" (`:59`). That sentence is false. There is a `LinkType` union with fifteen members, an `atom_links` Postgres table with three indexes, bidirectional traversal implemented in `pg-storage.ts`, and a live production `SELECT` counting rows in it. The relationship layer was designed in ADR-010 on 2026-05-12, built, and is running.

Two of six proposals are REJECT. Two are ADOPT-WITH-CHANGES and one of those needs to be substantially rewritten as "enforce and register what exists" rather than "introduce." One is ADOPT, and it is the smallest and least interesting of the six.

The finding that actually matters is not on the proposal's list: **the audit and the proposal both mistake "not registered on the property side" for "does not exist."** That is a repeatable error class in this program and it produces expensive re-invention proposals. See F1 and F2.

---

## S1 — CONFIRMED — Proposal 4 asks to build a relationship layer that already exists, is shipped, and is running in production

**CLAIM under attack.** Proposal `:56-67`: "The missing concept: edges … The model has node types and no explicit relationship layer … **Proposal 4: relationships are first-class provenanced edges.**"

**EVIDENCE.**

`P:\hauska-engine\packages\atoms\src\atom-link.ts`, the entire file:

```typescript
/**
 * Atom-link edge taxonomy per ADR-010 §Initial-link-taxonomy.
 *
 * Storage stores these in the `atom_links` table (`from_cid`, `to_cid`,
 * `link_type`). Retrieval traverses them under ADR-007 scope.
 */

export type LinkType =
  | "cites"
  | "adjudicates"
  | "applies-to"
  | "derives-from"
  | "precedent-of"
  | "interprets"
  | "contains"
  | "instance-of"
  | "amends"
  | "supersedes"
  | "defines"
  | "uses-term"
  | "see-also"
  | "subject-to"
  | "as-defined-in";

export interface AtomLink {
  fromEntityType: string;
  fromEntityId: string;
  toEntityType: string;
  toEntityId: string;
  linkType: LinkType;
  /** Free-form context for retrieval signal (e.g. the surrounding sentence). */
  context?: string;
}
```

`P:\hauska-engine\packages\storage\src\schema.ts:3` header comment names the table's purpose verbatim: `*   - atom_links       — cross-reference + composition graph`. The table, `schema.ts:76-94`:

```typescript
export const atomLinks = pgTable(
  "atom_links",
  {
    fromAtomDid: text("from_atom_did").notNull(),
    toAtomDid: text("to_atom_did").notNull(),
    linkType: text("link_type").notNull(),
    context: text("context"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.fromAtomDid, t.toAtomDid, t.linkType],
    }),
    fromIdx: index("atom_links_from_idx").on(t.fromAtomDid),
    toIdx: index("atom_links_to_idx").on(t.toAtomDid),
    linkTypeIdx: index("atom_links_type_idx").on(t.linkType),
  }),
);
```

Write path, `pg-storage.ts:648-663`, `writeAtomLinks`, with `ON CONFLICT ... DO NOTHING`. Read paths, `pg-storage.ts:793-860`, `traverse(fromAtomDid, linkType?)` and `traverseInbound(toAtomDid, linkType?)`, both optionally filtered by link type, both hydrating the far-side atom body.

It is not dormant. `services/retrieval-api/src/central-tx-tally.ts:148` runs `SELECT count(*)::int AS references_total FROM atom_links`, and `:377` labels its own output `"live SELECT against substrate Neon atoms/atom_links (serving DB)"`. Production reads this table.

And the taxonomy is not a stub, it is the ADR-010 design seed, implemented. `80_adrs/adr_010_atom_graph_traversal.md:124-136` is a table titled "Link taxonomy (initial)" listing `cites`, `adjudicates`, `applies-to`, `derives-from`, `precedent-of`, `interprets`, `contains`, `instance-of`. All eight are in the shipped union, plus seven more added since.

ADR-029, which the proposal cites in its own frontmatter, uses this vocabulary in prose at `:94` (`parcel-record ← improvement-on — building-footprint`), `:128` (`Place node ← subject-to — utility-easement`), and `:129` (`utility-easement — references → recorded-instrument`). `subject-to` is already a `LinkType` member.

**VERDICT.** Proposal 4 as written is REJECT. The premise is false. There is a first-class relationship layer with a typed taxonomy, an indexed table, bidirectional traversal, and live production reads.

The real, defensible finding buried under the false premise is narrow and worth keeping: **no property-family or O&G-family code writes to `atom_links`.** Every one of the eighteen `atomLinks` references outside `schema.ts` traces to the code-corpus atomization path (`packages/corpus/src/atomization/index.ts:17`, "edges that storage indexes into the atom_links table") or to storage/tally plumbing. The parcel-to-well edge the audit correctly identified as missing (audit S9) is missing because nobody has *written the rows*, not because the edge layer is absent. That is a one-adapter problem, not a data-model problem.

**RECOMMENDED CHANGE.** Delete Proposal 4. Replace with: "Add `parcel-to-well`, `parcel-to-district`, and `parcel-successor` as `LinkType` members and write the rows from the existing adapters. `subject-to` already covers easements." Estimated scope: one union extension in `atom-link.ts`, one migration-free write call per adapter. This is a fraction of a percent of what Proposal 4 as written implies.

---

## S1 — CONFIRMED — Proposal 2 re-invents a stable-identity mechanism the contract already ships, and the migration it implies is a breaking public API change across 2,269 call sites

**CLAIM under attack.** Proposal `:37-41`: "**Proposal 2: a parcel node carries a STABLE INTERNAL IDENTITY; external keys become provenanced attributes.** … Cost, stated honestly: this is a migration touching every keyed store and every join."

The cost is not stated honestly. It is stated vaguely, and the mechanism is presented as novel when it is not.

### The mechanism already exists

`P:\hauska-atom-contract\src\temporal\common.ts:74-98`:

```typescript
/**
 * Registered node-type ID prefixes. Every stable graph node ID begins with
 * one of these prefixes. 1.7.0 extension: O&G prefixes per ADR-025.
 */
export type NodeTypePrefix =
  | "parcel_"
  | "road_"
  | "jurisdiction_"
  | "code-section_"
  | "security_"
  | "evt_"
  | "well_"
  ...
```

`parcel_`, `road_`, and `jurisdiction_` are registered stable node-type prefixes in the shipped contract. They predate the O&G extension, the comment marks the O&G prefixes as the 1.7.0 *addition*, meaning `parcel_` was there before.

`P:\hauska-atom-contract\src\temporal\node-id.ts:1-13` is the derivation discipline Proposal 2 describes, already written:

```
/**
 * Stable node ID derivation and anchor validation (ADR-011 discipline).
 *
 * Resolver contract: DID derivation follows two patterns per ADR-025:
 * 1. Public identifier embedding: well_<api14>, rrclease_<district>-<leaseNo>,
 *    tract_<county>-<abstract> where the public identifier IS the stable key.
 * 2. Hashed derivation: evt_, intr_, oblg_, prodts_, unit_, equip_ use
 *    SHA-256(source\0externalId) for entities without global public keys.
 *
 * A manually constructed ID that is not anchored to its real derivation
 * inputs is rejected by the corresponding validation function.
 */
```

Pattern 2 is precisely Proposal 2's ask: a stable internal identity for entities lacking a reliable global public key, with the external key demoted to a derivation input. `deriveEvtNodeId` and `validateEvtNodeAnchor` (`node-id.ts:26-49`) implement it including the anti-fabrication check. Extending this to `parcel_` is a *use* of shipped machinery, not a migration.

ADR-011 (`80_adrs/adr_011_atom_identity_across_versions.md:28-31`) settled the architecture on 2026-05-12: `entityId` is identity-across-time, `cid` is per-version, and identity resolves through a DID. The proposal does not cite ADR-011 and does not mention DIDs, despite the engine already emitting `did:hauska:{entityType}:{localId}` on every atom (`packages/atoms/src/did.ts:21-35`).

### The cost, counted

The proposal declines to give a number. Here is one, from `grep -c` against live working trees:

| Repo | `parcelNodeId` occurrences | Files |
|---|---|---|
| `P:\hauska-engine` (packages + services) | **886** | 129 |
| `P:\legacy-design-tools` (lib + artifacts) | **401** |, |
| `P:\hauska-map` | **982** |, |
| **Total** | **2,269** |, |

That excludes `parcel_node_id` in SQL, the `txgio_parcel` table's own key columns, and `hauska-mcp-server` (65 more).

### The migration is a breaking public API change, which the proposal never says

`P:\hauska-mcp-server\src\tools.ts:552-554`, the parcel key is a *validated parameter of a published MCP tool*:

```typescript
      parcel_node_id: z
        ...
        .regex(PARCEL_NODE_ID_REGEX, "parcel_node_id must be county_fips:prop_id (e.g. 48209:156346)")
```

`src/tool-copy.ts:47`: `"Input parcel_node_id (county_fips:prop_id, e.g. 48209:156346) OR any chain atom_did, returns the same three slots."` This string is the agent-facing tool description. Under the MCP-first product design rule (structural commitment 4), the tool schema *is* the product surface. Changing the parcel key breaks every external agent consumer, and the proposal does not mention MCP once.

### The atom DID embeds the key it wants to replace

`P:\hauska-mcp-server\src\property-atom-chain.ts:89-95`:

```typescript
/** Canonical DID for a parcel-node anchor and each chain slot. */
export function propertyChainAtomDid(
  parcelNodeId: string,
  entityType: PropertyChainEntityType,
): string {
  return `did:hauska:${entityType}:${parcelNodeId}`;
}
```

Every property atom's DID *is* `did:hauska:<type>:<fips>:<prop_id>`. Changing the identity key therefore changes every atom DID, which per ADR-011 is the identity-across-time. Re-keying identity-across-time is not a join migration; it is a re-issuance of every atom in the property corpus. The proposal's phrase "touching every keyed store and every join" understates this by a category.

**VERDICT.** REJECT Proposal 2 as scoped. The stated problems are real; the proposed solution is a re-invention priced at 2,269 call sites plus a breaking MCP contract change plus corpus-wide DID re-issuance, and a shipped mechanism (`node-id.ts` pattern 2, `parcel_` prefix, ADR-011 DID) already covers the hard part.

**RECOMMENDED CHANGE.** Take the cheap fix, which the proposal itself names at `:41` and then does not argue against. Specifically:

1. Import and enforce `PARCEL_NODE_ID_PATTERN` at the engine write boundary (audit S3; this is the actual root cause of `48021:0` and it is a one-import fix, the O&G lane already does it at `packages/og-sources/src/adapters/rrc-w1/normalize.ts:10`).
2. Add a `keyKind: "prop_id" | "geo_id_crosswalk"` field to the property atoms. Eight counties, 907,770 parcels, see F5 for the count.
3. Use the existing `supersedes` `LinkType` (already a union member) for splits/merges, writing rows into `atom_links`. This is the "recorded relationship between an old node and its successor nodes" the proposal asks for at `:39`, available today with zero new machinery.

That closes every problem Proposal 2 names, at roughly three orders of magnitude less cost.

---

## S1 — CONFIRMED — Proposal 1 creates the two-sources-of-geometry-truth defect it claims to prevent, and violates Geometry Law rule 1 rather than expressing it

**CLAIM under attack.** Proposal `:24-26`: "**Proposal 1: the parcel ring is an ATOM.** … This also makes the Geometry Law representable. Rule 1 says one ring per parcel … That is exactly two atoms about one node."

Read that again. The proposal's argument for Proposal 1 is that it lets the system hold **two atoms about one ring**, and it presents this as satisfying a law whose first clause is **ONE RING PER PARCEL**. The proposal is arguing that the way to honor a one-ring rule is to add a second representation. That is the inversion at the heart of it.

**EVIDENCE, the serving path reads the table, not the atom store.**

`P:\hauska-engine\packages\engine-core\src\parcel-terrain\parcel-geometry-resolver.ts:89-96` (verbatim doc comment):

```
/**
 * Transitional resolver for TxGIO-backed counties. It queries the same
 * `txgio_parcel` geometry store used by cortex-api by its canonical
 * `{county_fips}:{normalized_prop_id}` identity. This intentionally avoids an
 * invented cortex HTTP route: the existing buildable-envelope route is keyed
 * by place, not parcel node id.
 */
```

`resolve()` at `:108-112` parses the parcelNodeId, queries `txgio_parcel`, and returns the exterior ring. Ten engine files read `txgio_parcel`, including `boundary-primitive/load-parcel-index.ts` (four separate `FROM txgio_parcel` queries), `registry/cert-grade-core.ts`, `warden/envelope-sanity.ts`, and `services/retrieval-api/src/spine-health/probes.ts`. On the product side, `P:\legacy-design-tools\artifacts\api-server\src\lib\txgioParcelStore.ts` is the serving reader for the map layer, and its own header comment at `:24-26` states the design rule directly:

```
 * No tile cache on this path — the local table IS the store; a cache
 * row would just duplicate it.
```

That is the same argument against Proposal 1, already written down by whoever built the store.

**EVIDENCE, the warm path pins the ring to the table, by ruling.**

`packages/engine-core/scripts/depth-warm-bastrop-batch.mjs:612-625`:

```
  const geom = await geomResolver.resolve(parcelNodeId);
  // SERVE-CONSISTENCY PRINCIPLE (2026-08-07, master planner ruling — amends
  // the Ground-Truth Frame Law): one ring per parcel governs everything the
  // user sees. The PRODUCT displays txgio_parcel geometry as the lot line
  // (the same geometry geomResolver.resolve loads here) — that is the truth
  // frame, not BCAD's live CAD ring. ...
  // rawParcelRing is pinned to geom.ring (txgio) ONCE here and MUST NOT be
  // reassigned by any later BCAD re-fetch
```

The Geometry Law's serve-consistency clause is implemented as *pin the ring to the table read, once, and forbid reassignment*. Introducing a ring atom inserts a second artifact between `txgio_parcel` and the pin. Geometry Law rule 3 (`_decisions/2026-08-07_...:23`) names the resulting defect class:

> WRITE-THEN-VERIFY: every persist is read back and the predicate runs on the exact stored bytes that will serve. **Gate-one-representation-serve-another is the master defect class (five instances this saga: cert-vs-serve, stale generations, scrubbed-ring frame, BCAD-vs-txgio, dump frames) and is now structurally unrepresentable.**

A ring atom is a sixth instance of exactly that class, and it makes the class *representable again*. If the serving path keeps reading `txgio_parcel` (it does, in ten engine files plus the ldt map reader), and a ring atom exists alongside, then any consumer reading the atom is gated on one representation while the product serves another. The saga cost five defect instances and nine merged PRs to close. Proposal 1 re-opens the door.

**EVIDENCE, storage cost.**

Computed from `_catalog/texas_roster_v1.json` (254 county rows, live read this session):

```
sum identity.parcel_count_est   = 13,360,496 over 253 counties
sum geometry.feature_count      = 13,360,496 over 253 counties
```

13.36M ring atoms at statewide completion, one per parcel, before the "BCAD ring observation" second atom the proposal explicitly wants (`:26`), which would take it to ~26.7M on any county with CAD divergence reporting.

Each would be a row in `atoms` (`schema.ts:36-74`) carrying the ring as `body jsonb`, plus `cid`, `contentHash`, `entityType`, `entityId`, `jurisdictionTenant`, `sourceAdapter`, `sourceUrl`, `fetchedAt`, `accessPolicy`, two timestamps, and participation in four indexes including a unique composite. That is the full atom overhead applied to a payload that is already stored, indexed, and served from a purpose-built spatial table with grid-cell bucketing (`txgioParcelStore.ts:15-22`).

ADR-029 already flagged this exact risk in its reversal criteria, `:190(c)`:

> (c) **atom volume from per-structure footprints blocks index at county scale**, in which case tighten to one primary footprint per parcel with accessory footprints as embedded array

If per-*structure* footprint volume was judged a live index-blocking risk at county scale, per-*parcel* rings at 13.36M statewide is the same risk an order of magnitude up, and the proposal does not mention volume at all.

**EVIDENCE, a ring is not shaped like an atom.**

Every property atom carries the quality-gate triple. `P:\hauska-atom-contract\src\property\common.ts:43-48`:

```typescript
/** Quality gate fields required on every property reasoning atom. */
export const PROPERTY_QUALITY_GATE_FIELDS = {
  sourceCitation: z.string().min(1),
  extractedAt: z.string().min(1),
  asOf: z.string().min(1).optional(),
} as const;
```

The comment says "reasoning atom." Structural commitment 1 is *sell reasoning, not data*. A TxGIO ring is raw vendor data with no reasoning chain, it is the input the reasoning is performed *on*. The proposal's own justification at `:20` lists what the geometry needs: source, vintage, divergence flag, confidence. Every one of those is **provenance about a table row**, and `txgio_parcel` already carries `sourceVintage` (`parcel-geometry-resolver.ts:13`), the roster already carries `vintage_yyyymm` / `vintage_date` / `flags: ["STALE"]` / `verification` / `evidence` per county, and divergence already has a home as the `PARCEL-RING-SOURCE-DIVERGENCE` observation class shipped in engine #273.

**VERDICT.** REJECT Proposal 1. It duplicates a purpose-built store, adds ~13.36M rows (~26.7M with the divergence twin it explicitly wants), re-opens the master defect class the Geometry Law made structurally unrepresentable, and its stated benefits are all satisfiable by provenance-on-the-existing-store.

**RECOMMENDED CHANGE.** Keep `txgio_parcel` as the single geometry store and the single serving read, that is Geometry Law rule 1 already implemented. Close audit S2 (Rail 1 has no atom) *not* by atomizing the ring, but by registering a **`parcel-node` anchor atom that carries geometry provenance by reference, never the ring bytes**: `parcelNodeId`, `geometrySourceTier` (`txgio-stratmap` | `county-arcgis-override`), `sourceVintage`, `divergenceObservationCount`, `keyKind`, `sourceCitation`, `accessPolicy`. Small, bounded, one row per parcel, no second copy of geometry, and it gives Rail 1 the atom family it lacks.

Note the entity type is not even new: `parcel-node` is **already a live MCP property-chain slot**. `P:\hauska-mcp-server\src\property-atom-chain.ts:24` lists `"parcel-node"` in the chain entity types; `:100` matches it in the DID regex; `src/hauska-client.ts:52` types it; `src/tool-copy.ts:40` advertises it to agents as a retrievable type. It has zero engine references (`grep '"parcel-node"' P:\hauska-engine` → no output), so MCP advertises a type the engine never writes. That is the real Rail 1 gap and it is much narrower than the proposal frames it.

---

## S2 — CONFIRMED — Proposal 3's premise is factually wrong: `property-boundary-edge` already IS a first-class provenanced frontage edge, and the R30 gating claim is wrong in both directions

**CLAIM under attack.** Proposal `:51-53`: "**Proposal 3: parcel-to-road frontage is a first-class provenanced EDGE, not a recomputed side effect.** … Today it is recomputed inside the warm loop … and its result is **stored only implicitly as edge roles on the boundary primitive**."

**EVIDENCE, the edge is explicit, typed, and provenanced.**

`P:\hauska-engine\packages\atoms\src\boundary-instances.ts:78-107`, the `ContractBoundaryEdgeAtomInstance` interface, carries all of:

```typescript
  parcelNodeId: string;
  edgeIndex: number;
  role: "front" | "side" | "rear" | "side_corner";
  /** Present on the front edge only: which rule assigned the front role. */
  frontBasis?: BoundaryFrontBasis;
  adjacencyKind: BoundaryAdjacencyKind;
  parcelNeighborPropId: string | null;
  facingRoad: BoundaryFacingRoad | null;
  setback: BoundaryResolvedSetback | BoundarySetbackAbsence;
  ...
  reasoningChain: { reasoningKind: "observed" };
  accessPolicy: AccessPolicy;
  sourceCitation: string;
  extractedAt: string;
```

`facingRoad` (`:33-40`) is a typed struct: `{ roadNodeId, classification, provenance, osmHighwayTag?, isPedestrianWay? }`. That is a provenanced parcel-to-road edge, keyed on both node id systems, with the source named in a `provenance` string (populated as `"osm-overpass-v1"` at `relabel-from-roads.ts:41`).

`parcelNeighborPropId` is a parcel-to-parcel adjacency edge. `adjacencyKind` (`:19-23`) is `"ROW" | "alley" | "neighbor-parcel" | "unmapped"`, a typed relationship discriminant including honest absence. `frontBasis` (`:25-31`) records *how the front was chosen*, `"situs-street-match"` vs `"adjacency-heuristic"`, with the doc comment stating "honesty requirement, surfaces cite it."

The proposal says frontage is "stored only implicitly as edge roles." It is stored explicitly, with the road's node id, its classification, its OSM tag, the provenance string, and the basis on which the front role was assigned. The proposal is describing a system that was built and then not read.

**EVIDENCE, the `--force-repromote` gating claim is wrong.**

The review prompt asked whether "the real bug is just that R30 relabel is gated behind `--force-repromote`." Verified: **it is not.**

```
$ grep -rn "force-repromote\|forceRepromote\|force_repromote" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

Zero hits in TypeScript. The flag exists only in the two batch runner scripts (`packages/engine-core/scripts/depth-warm-bastrop-batch.mjs:229`, `depth-warm-elgin-batch.mjs:143`).

R30 relabel is **ungated on both read paths**:

`packages/engine-core/src/site-plan/prepare-boundary-edges-for-export.ts:231-247`, unconditional, gated only on whether labeling succeeds:

```typescript
  // R30 — re-derive role/facingRoad from FRESH road labeling; never reuse a
  // stale stored role. Decline (no roads / no adjacency / unresolved front)
  // leaves the roles as-is (best-available, unchanged).
  let relabeledFromRoads = false;
  const labelResult = labelEdgesFromRoads({ ... });
  if (labelResult.ok) {
    edges = relabelBoundaryEdgesFromRoadLabels({ ... });
    relabeledFromRoads = true;
  }
```

`packages/engine-core/src/registry/cert-grade-core.ts:686-693`, same, unconditional on `labelResult.ok`.

What `--force-repromote` actually gates is something else entirely, `depth-warm-bastrop-batch.mjs:598-611`:

```javascript
  if (!args.forceRepromote && !args.forceOverwrite) {
    const [existing] = await sql`
      SELECT 1 FROM atoms
      WHERE entity_type = 'buildable-envelope'
        AND body->>'parcelNodeId' = ${parcelNodeId}
        ...`;
    if (existing) {
      stats.declines["already-promoted"]++;
      ...
      continue;
    }
  }
```

It skips already-promoted parcels in the **batch warm loop**. It does not gate relabeling.

**This inverts Proposal 3's argument.** The system's current design is: *store the edge, and re-derive its road-dependent fields from fresh input at every read.* `relabel-from-roads.ts:1-8` states the rationale as law:

```
/**
 * R30 — re-derive boundary-edge ROLES from fresh road labeling on re-warm.
 *
 * The stored primitive carries correct inward normals but stale role/facingRoad
 * when ring vertex count or winding changed since the primitive was baked.
 * Re-warm must apply fresh labelEdgesFromRoads output to the stored atoms —
 * never reuse stale roles (same class as R28 winding fix for normals).
 */
```

"Never reuse stale roles" is the shipped rule. Proposal 3 asks to make the persisted role more authoritative, which is the opposite direction, and which, because stored roles *do* still sit in the atom store between re-promotions, would make staleness worse by giving the stale copy standing. Today the stale copy exists but loses to the fresh recompute at every read. That is the correct arrangement and it was arrived at by fixing exactly the defects the proposal cites.

**The proposal's own cited defects support the current design, not its change.** `prepare-boundary-edges-for-export.ts:1-11` records that the 2026-08-05 edge-role defect was caused by the export path **loading stored edges and mapping them by `edgeIndex` WITHOUT the freshness gates**. The defect was *trusting the stored edge*. The fix was *recomputing over it*. Proposal 3 proposes trusting the stored edge harder.

**VERDICT.** REJECT the framing; ADOPT-WITH-CHANGES a narrow residue. The edge type exists and is provenanced. The recompute-at-read design is correct and was arrived at by fixing the very defects cited. The `--force-repromote` premise is false.

**RECOMMENDED CHANGE.** State the actual open item, which is real but small: the **stored** `role`/`facingRoad` in the atom store go stale between re-promotions and there is no marker telling a consumer that the stored value is subordinate to a recompute. Fix by adding a `rolesDerivedAt` timestamp plus a `rolesAuthority: "recompute-at-read"` discriminant to the edge atom, so any consumer reading the store directly (MCP serve, `.atompack` export) knows the stored role is a cache and not the answer. That closes the two-truths gap without inverting the design.

---

## S2 — CONFIRMED — Proposal 5's manifest/atom-store split is a genuine two-sources-of-truth risk that the proposal names and then waves through, and the manifest does not exist

**CLAIM under attack.** Proposal `:76-78`: "`not-yet` has no atom representation at all … That is acceptable if the manifest is authoritative for acquisition state and the atom store is authoritative for claims, but it must be stated, not assumed. **Proposal 5: … the manifest is declared authoritative for `not-yet`.**"

**EVIDENCE, the manifest does not exist.** The coherence audit says so in its own WHAT-I-COULD-NOT-DETERMINE (`:369`): "**The manifest schema.** The decision names a manifest carrying three states (`:38-42`); no manifest file was located in this audit." Independently confirmed this session:

```
$ grep -rn "not-yet\|notYet\|not_yet" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(two hits, both in vendored .ignored/@hauska/atom-contract dist comments, unrelated)

$ grep -rn "satisfied-absent\|satisfiedAbsent" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

Neither three-state literal appears anywhere in the engine. `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:38-42` rules the three states; nothing implements them. Proposal 5 declares an artifact authoritative that has no schema, no file, and no code.

**EVIDENCE, the drift mechanism is concrete, not hypothetical.** The split as proposed is: manifest authoritative for acquisition state (satisfied-present / satisfied-absent / not-yet), atom store authoritative for claims. But `satisfied-absent` is **already** an atom-store fact and is already implemented there. `P:\hauska-atom-contract\src\property\common.ts:152-168` defines `SITE_LAYER_VERIFIED_ABSENCE_SCHEMA` with `{ evaluated: true, provenanceScope: string[] }` and `.min(1)` on the scope, anchored on `countyCoverageParcelNodeId(fips)` → `{fips}:_county_coverage`. `building-footprint.ts:110-117` makes `verifiedAbsence` mandatory when `sourceTier === "absent"`.

So under Proposal 5, the answer to "is Rail 10 satisfied-absent for county X" is computable from **two** places: the manifest row, and a `sourceTier: "absent"` + `verifiedAbsence` atom on the county-coverage node. Those are two independently-written stores answering the same question with no reconciliation named. When the easement adapter writes a verified-absence atom and the manifest row still says `not-yet`, or the reverse, Command Center shows one number and the parcel card shows another.

That is precisely the failure the county-shape ruling exists to prevent. `_decisions/2026-08-08_...:50`: "PARTIAL must be visible in Command Center and never rounded up." Two unreconciled completeness stores is how a number gets quietly rounded up.

Ruling 3 makes it worse: SATISFIED vs PARTIAL is threshold-dependent, thresholds are deliberately unset (`:54`), and per the audit (`:368`) "nothing in the contract or roster carries a coverage threshold field, so SATISFIED vs PARTIAL has no data home today." A manifest declared authoritative for a state it cannot compute is not authoritative.

**VERDICT.** ADOPT-WITH-CHANGES, and the change is load-bearing. The split is defensible *only* with a stated reconciliation rule, which the proposal does not supply.

**RECOMMENDED CHANGE.** Make the split one-directional and derivable rather than parallel-authoritative:

- The atom store is authoritative for **satisfied-present** and **satisfied-absent**. Both are claims with provenance and both already have contract shapes.
- The manifest is authoritative for **not-yet only**, and `not-yet` is *defined as* the complement: a rail is `not-yet` when the atom store contains neither a present claim nor a verified-absence claim above threshold. Not an independently written state.
- The manifest becomes a **materialized view over the atom store plus the declared rail list**, with a recompute job and a drift alarm, not a hand-maintained parallel ledger.

Then there is one source of truth and the manifest is a projection. Without this, Proposal 5 institutionalizes the drift it was written to fix.

The second half of Proposal 5, absence on `buildable-envelope`, is correct, well-evidenced (audit S4; `honest-decline-promote.ts:30-35` off-contract fields), already queued (`QUEUE:129`), and should ship. It needs no argument.

---

## S3 — CONFIRMED — Proposal 6 is sound but the audit it rests on already did the work; it adds a decision requirement, not a model

**CLAIM.** Proposal `:86`: "**Proposal 6: every rail in the county shape has a declared atom family, or is explicitly declared manifest-only.**"

**EVIDENCE.** This is the audit's S1 finding restated as a policy. The audit's rail-to-atom table (`:23-37`) already enumerates all thirteen with verdicts. Nothing in Proposal 6 is contested by any source I read.

One correction to the enumeration, and it favors the proposal: the audit lists Rail 1 as having no atom anywhere. `parcel-node` exists as a live MCP entity type (`hauska-mcp-server/src/property-atom-chain.ts:24`, `hauska-client.ts:52`, `tool-copy.ts:40`) with zero engine references. So the honest statement is not "Rail 1 has no atom" but "**Rail 1 has an atom type advertised on the public MCP surface that nothing writes.**" That is a worse finding than the audit's, and Proposal 6 should carry it.

**VERDICT.** ADOPT. It is the only proposal that survives intact, and it is a governance rule rather than a data model.

**RECOMMENDED CHANGE.** Add the `parcel-node` correction. Add the constraint that "declared atom family" must mean *registered in `hauska-engine/packages/atoms/src/registry.ts` and written by a named adapter*, not merely present in the contract, otherwise `building-footprint` and `utility-easement` (contract-only, zero engine references per audit `:33-34`, `:56-63`) would count as satisfying the rule while producing no atoms.

---

## S3 — CONFIRMED — factual errors in the proposal's own citations

Small individually; together they indicate the proposal was written from the audit's summary rather than from sources.

**Divergence count.** Proposal `:20` says "201 PARCEL-RING-SOURCE-DIVERGENCE observations on Bastrop alone." Source, `_inbox/2026-08-07_T1_cohort_repersist_PLANNER_STATUS.md:49`: "PARCEL-RING-SOURCE-DIVERGENCE: **200** observations filed." Off by one, and 200 is the number in the only artifact that reports it.

**Road record count and threshold.** Proposal `:49` says `labelEdgesFromRoads` runs "against 13,987 road records with a 25 m threshold." The threshold is confirmed, `packages/engine-core/src/depth-warm/edgeLabeling.ts:21`, `export const DEFAULT_ROAD_PROXIMITY_THRESHOLD_M = 25;`. The 13,987 figure appears **nowhere** in `hauska-engine` (`grep "13987\|13,987"` → no output). It is presented as a code-derived fact and is unsourced. PLAUSIBLE that it came from a cohort run log; not verifiable from the repo.

**`ROAD_NODE_ID_PATTERN` re-declaration.** Proposal `:47` says it is "re-declared locally in the engine rather than imported from the contract." CONFIRMED, contract at `src/property/common.ts:34`, engine at `packages/atoms/src/road-instances.ts:135`, identical regex, no import. The audit had this right and the proposal reports it correctly.

**`parcel-record` does not exist.** Proposal `:84` CONFIRMED against ADR-029:31 and :94. This one is accurate and it is the proposal's strongest independent hit.

---

## WHAT THE PROPOSAL MISSED

Ranked by how much damage each causes if the model is adopted without addressing it.

### M1, Multi-geometry parcels are silently truncated to the first ring, today, in the serving resolver

`packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts:66-88`:

```typescript
/**
 * Exterior ring only (first ring of the first polygon) for Polygon /
 * MultiPolygon GeoJSON. Returns null rather than guessing for other geometry
 * types (e.g. Point) — a site-plan PROPERTY_LINE layer must not draw a
 * fabricated ring.
 */
function exteriorRingFromGeoJson(geometry: unknown): Array<[number, number]> | null {
  ...
  if (geom.type === "MultiPolygon") {
    const polygons = geom.coordinates as unknown;
    const firstPolygon = Array.isArray(polygons) ? polygons[0] : null;
    const exterior = Array.isArray(firstPolygon) ? firstPolygon[0] : null;
```

A parcel whose legal extent is two disjoint polygons (split by a road, a creek, a railroad ROW, common in rural TX) has its second polygon **discarded without a flag**. The function is careful to refuse to fabricate a ring for a Point, but silently drops real geometry for a MultiPolygon. Setbacks, buildable envelope, and area are then computed on a fraction of the parcel and served as the whole parcel.

This is a live correctness defect on the headline rail and it is invisible to every gate in the Geometry Law, because the law measures the served envelope against "the raw ring" and the raw ring is *already* the truncated one. All twelve saga parcels pass; a MultiPolygon parcel would pass too, and be wrong.

**It also breaks Proposal 1 arithmetically.** "One ring atom per parcel" is not well-defined for a MultiPolygon parcel. The proposal's cardinality assumption is unstated and wrong.

**Recommendation.** Independent of any data-model decision, this needs a defect ticket: emit an honest decline or a named observation when `coordinates.length > 1`, never a silent truncation. Under the honesty doctrine this is a fabrication-adjacent defect.

### M2, Condos and vertical subdivision have zero representation

```
$ grep -rni "condo\|vertical.subdiv" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

The model is `parcelNodeId` → one ring → one envelope. A condominium regime is N units sharing one footprint with distinct `prop_id`s in the CAD roll, each of which will resolve to the same or overlapping geometry. Under Proposal 1, that is N ring atoms with identical or near-identical bodies, and because `atoms` has `uniqueIndex("atoms_entity_composite_unique").on(entityType, entityId)` (`schema.ts:70-73`) and `entityId` would be the `parcelNodeId`, they would not collide, you would get N duplicate geometry rows. Under any model, the buildable-envelope answer for a condo unit is not "inset the parcel ring," and nothing names this.

Not a blocker for the current Central-TX cohort. A blocker for Travis/Harris, both of which are in the shape.

### M3, Parcels crossing county lines break the key by construction

`parcelNodeId` is `{county_fips}:{prop_id}` and `PARCEL_NODE_ID_PATTERN` hard-requires `^\d{5}:`. A parcel spanning a county line is two CAD records in two rolls with two `prop_id`s and two rings that abut. The model has no way to say they are one property. Proposal 2 would be the natural place to solve this and does not mention it; Proposal 4's edges would be the natural mechanism (`supersedes` is wrong, a `same-property-as` link would be needed) and it does not mention it either.

### M4, ETJ and annexation change jurisdiction over time; nothing models it

```
$ grep -rni "\betj\b|annex" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
packages/engine-core/src/road-intake/fetch-overpass-bbox.ts:31: /** Bastrop city limits + near-ETJ core — ... */
(one comment; no logic)
```

`jurisdictionTenant` is a flat string set at emit time (`emit-boundary-edges-from-warm.ts:138`). When Bastrop annexes, every affected parcel's governing zoning changes, every setback changes, and every stored `zoning-fact` / `setback-rule` / `buildable-envelope` becomes wrong, with no mechanism to detect it, because `jurisdictionTenant` carries no validity interval. This is the same defect class as stale edge roles, one level up, and it will hit the Bastrop cohort specifically since Bastrop is the design-partner city and is actively growing.

The contract has the machinery: `src/temporal/interval-query.ts` implements `isAtomVisibleAtAsOf` with `valid_from` and explicit anticipatory handling, and `src/temporal/would-affect-edge.ts` defines an immutable `would_affect` edge from an event node to a subject node with an `effectiveDate`, whose doc comment states `targetSubjectId` carries "a subject prefix (`parcel_`, `jurisdiction_`, etc.)". An annexation ordinance is exactly an `evt_` node with a `would_affect` edge to a set of `parcel_` nodes at an `effectiveDate`. It is built. Nothing on the property side uses it.

### M5, Temporal validity generally: property atoms have no validity interval

Related to M4 but broader. `PROPERTY_QUALITY_GATE_FIELDS` (`property/common.ts:43-48`) gives `sourceCitation`, `extractedAt`, optional `asOf`. There is no `valid_from` / `valid_to`. An atom true in 2024 and false in 2026 is representable only as "extracted in 2024," which is a statement about the *observation*, not the *claim*. The O&G/temporal family has `valid_from` and the whole `interval-query` apparatus; the property family does not.

This is the deepest real gap in the model and **none of the six proposals mention time at all.** Any data-model decision made now without deciding the temporal shape will be re-litigated. This is a better candidate for the "expensive foundational proposal" slot than Proposal 2 is.

### M6, Tenant-private atoms under ADR-017 interact with node identity, and the proposal is silent

The five-value `accessPolicy` union (`registration.ts:56-61`, confirmed) includes `tenant-private` and `tenant-shared`. `atoms.accessPolicy` is a column with `.default("public-free")` (`schema.ts:55`). But:

- `atom_links` (`schema.ts:76-94`) has **no `accessPolicy` column**. ADR-010:80 states "Both paths honor ADR-007 access scopes. The Postgres index is the access-control gate." The link rows are not gated. Under Proposal 4 as written, relationships as first-class provenanced edges, a `tenant-private` fact becomes inferable from an ungated edge's existence (a link from a public parcel node to a tenant-private adjudication reveals that the adjudication exists). That is a tenant-sovereignty leak in the exact mechanism the proposal wants to expand.
- Under Proposal 2, if internal identity is derived by SHA-256 over external keys (the `node-id.ts` pattern), the derivation is *deterministic and publicly reproducible*. Anyone who knows `{fips, prop_id}` can compute the internal id. That is fine for public parcels and wrong for anything tenant-scoped, and the proposal does not distinguish.

Neither is fatal; both need to be answered before either proposal is built.

### M7, MCP serve shapes constrain the model and are never mentioned

Covered in the Proposal 2 finding. Restating as a missed-item because it applies to all six: `hauska-mcp-server/src/tools.ts:554` validates `parcel_node_id` against `PARCEL_NODE_ID_REGEX` as a public tool parameter, and `tool-copy.ts:47` documents the `county_fips:prop_id` shape to agent consumers. Per structural commitment 4 (MCP-first), the tool schema is the product contract. Any change to parcel identity, and any new atom family expected to serve, is an MCP surface change. The proposal reasons entirely about storage and never about serve.

---

## MIGRATION REALITY, the answer to open question 5

**Adversarially: no, there is no flag-day-free order for Proposals 1 and 2 as written, and the proposal's phrasing of the question ("is there a migration order that does not require a flag day") presupposes the migration rather than justifying it.**

For **Proposal 2**, the mid-migration state is not servable in any clean way, for a structural reason: identity is embedded in the atom DID (`propertyChainAtomDid` → `did:hauska:{entityType}:{parcelNodeId}`), and the DID is the primary key of `atoms` (`atomDid: text("atom_did").notNull().primaryKey()`, `schema.ts:39`). Re-keying identity means every atom row gets a new primary key. During the transition you have one of:

- **Dual-write**, every atom exists under two DIDs. This duplicates the corpus, and `uniqueIndex("atoms_entity_composite_unique").on(entityType, entityId)` (`schema.ts:70-73`) will reject the second write unless `entityId` also changes, in which case the two rows are not recognizably the same atom. Reconciling them requires exactly the `supersedes` edge machinery that Proposal 4 (rejected as novel) is really about, so Proposal 2 depends on the mechanism Proposal 4 claims does not exist.
- **Resolver shim**, old key resolves to new. This is the cheap fix in disguise: if a shim can translate `{fips}:{prop_id}` to the internal id at every boundary, then the external key is still functionally the identity and you have paid migration cost for a rename.
- **Cutover**, a flag day, across three product repos and a public MCP surface, with 2,269 call sites.

The MCP surface makes it worse than a normal cutover, because external agent consumers cannot be migrated by us at all. Their calls either keep working (shim, therefore no real migration) or break (flag day, on a *public* API).

For **Proposal 1**, there is a technically flag-day-free order, write ring atoms alongside `txgio_parcel`, then switch readers, but the mid-migration state is the defect. During the window, ten engine files plus the ldt map reader serve from the table while the atom store holds a second copy. That window *is* gate-one-representation-serve-another, and it is exactly what Geometry Law rule 3 declares "structurally unrepresentable." A migration whose intermediate state is the master defect class is not a safe migration; it is a scheduled outage of the invariant.

For **Proposals 3, 5, 6** and for the *recommended-change* versions of 1, 2, and 4, there is no flag day and no migration:

- Adding `LinkType` members and writing rows into `atom_links`: additive, no schema change, existing indexes cover it.
- Adding `keyKind` to property atoms: additive optional field, contract minor bump, backfill lazily.
- Importing `PARCEL_NODE_ID_PATTERN` at the engine write boundary: one import, plus fixing whatever it rejects.
- Registering a `parcel-node` anchor atom carrying geometry provenance by reference: new entity type, additive, and the MCP surface already advertises the type.
- Adding `absence` to `buildable-envelope`: additive optional field; the engine already carries the data off-contract.
- Manifest as a materialized view: new artifact, no existing consumer to break.

**Recommended order, none of which requires a flag day:** (1) enforce the existing pattern at the write boundary; (2) publish contract v1.12.0 so rails 9/10 stop being blocked (audit S6, two rails are one `npm publish` away); (3) register `parcel-node` with geometry provenance-by-reference; (4) add `keyKind`; (5) add `buildable-envelope.absence`; (6) extend `LinkType` and write parcel-to-well / parcel-to-district / successor rows; (7) build the manifest as a view over the atom store. Then, and only then, re-open temporal validity (M5) as the next foundational question, which is the one that actually deserves an expensive proposal.

---

## VERDICTS ON THE SIX PROPOSALS

| # | Proposal | Verdict |
|---|---|---|
| 1 | The parcel ring is an ATOM | **REJECT**, duplicates a purpose-built store, ~13.36M rows (~26.7M with the divergence twin it explicitly wants), re-opens the master defect class, and its argument ("two atoms about one node") inverts Geometry Law rule 1. Replace with a `parcel-node` anchor atom carrying geometry provenance **by reference**, never ring bytes. |
| 2 | Stable internal identity | **REJECT as scoped**, re-invents `src/temporal/node-id.ts` pattern 2 and the registered `parcel_` prefix; costs 2,269 call sites, a breaking public MCP parameter change, and corpus-wide DID re-issuance. Take the cheap fix the proposal itself names and declines to defend: enforce the pattern, add `keyKind`, use the existing `supersedes` link for splits/merges. |
| 3 | Frontage as a first-class provenanced edge | **REJECT the framing, ADOPT-WITH-CHANGES the residue**, `property-boundary-edge` already carries `facingRoad{roadNodeId, classification, provenance, osmHighwayTag}`, `parcelNeighborPropId`, `adjacencyKind`, `frontBasis`, `reasoningChain`, `sourceCitation`, `accessPolicy`. The `--force-repromote` premise is false (zero TS hits; R30 is unconditional at cert-grade and export-prep). Keep recompute-at-read; add `rolesDerivedAt` + `rolesAuthority` so direct store readers know the stored role is a cache. |
| 4 | Relationships as first-class edges | **REJECT**, `LinkType` (15 members), `atom_links` (3 indexes), `traverse`/`traverseInbound`, and a live production `SELECT` all exist. ADR-010:124-136 designed this on 2026-05-12. Reduce to: add three `LinkType` members and write the rows. |
| 5 | Absence first-class everywhere; manifest authoritative for `not-yet` | **ADOPT-WITH-CHANGES**, the `buildable-envelope` absence half is correct and should ship (already queued). The manifest half creates two unreconciled completeness stores and declares an artifact authoritative that has no schema, no file, and no code. Make the manifest a materialized view over the atom store; define `not-yet` as the complement, not an independently written state. |
| 6 | Every rail has a declared atom family or is declared manifest-only | **ADOPT**, the only proposal that survives intact. Tighten "declared atom family" to mean registered in `packages/atoms/src/registry.ts` **and** written by a named adapter, so contract-only types (`building-footprint`, `utility-easement`) do not count as satisfying it. Add the `parcel-node` correction: Rail 1's problem is an MCP-advertised type nothing writes, which is worse than "no atom." |

---

## ANSWERS TO THE FIVE OPEN QUESTIONS

**1. Does the stable-internal-identity migration earn its cost against the cheaper fix?**

No. Not close. The cheap fix, enforce `PARCEL_NODE_ID_PATTERN` at the write boundary, add `keyKind`, use the existing `supersedes` link for splits and merges, closes every problem Proposal 2 names.

Take them one at a time. `48021:0` is not an identity-design failure; it is a validation failure, and the fix is one import. Verbatim, the gap:

```
$ grep -rn "PARCEL_NODE_ID_PATTERN" P:\hauska-engine/packages P:\hauska-engine/services --include=*.ts
(no output)
```

The O&G lane already does the right thing at `packages/og-sources/src/adapters/rrc-w1/normalize.ts:10` (`WELL_SCHEMA` imported as a value). Copy that. A stable internal identity would not have caught `48021:0` either, a malformed record produces a malformed derivation input and you get a stable id for a garbage parcel.

Crosswalk counties: 8 counties, 907,770 parcels, of which Travis is 834,936 (92%). A `keyKind` field records what the second token is. That is the entire stated defect ("no field recording which key kind is in use," `:34`).

Splits and merges: `supersedes` is already a `LinkType` member. Writing a successor edge is available today.

Against that, Proposal 2 costs 2,269 `parcelNodeId` call sites across three product repos, a breaking change to a documented public MCP tool parameter, and re-issuance of every property atom DID. The ratio is not arguable.

**2. Are edges-as-atoms genuinely better than computing relationships at warm time, or does it trade compute cost for staleness cost?**

It trades compute for staleness, and the system already made the opposite trade deliberately, after paying for the lesson.

The question also contains a false premise. Its parenthetical, "Note the current stored-edge-role staleness is already causing defects", is backwards. `prepare-boundary-edges-for-export.ts:1-11` records that the 2026-08-05 defect was caused by the export path **loading stored edges and mapping by `edgeIndex` without the freshness gates**. The defect was trusting the stored edge. The fix (R28 + R30) was recomputing over it. Persisting harder is the direction that caused the defect.

Distinguish two things the question conflates:

- **Structural edges** (parcel-to-well, parcel-to-district, parcel-successor, parcel-to-easement), these have no cheap recompute, are stable over time, and belong in `atom_links`. Write them. This is the salvageable part of Proposal 4.
- **Derived geometric relationships** (which edge is the front, which road it faces), these are a pure function of (ring, roads, situs) and are cheap. `DEFAULT_ROAD_PROXIMITY_THRESHOLD_M = 25` (`edgeLabeling.ts:21`) with a linear scan is not an expensive computation. Recompute them. Persisting them creates a second truth that goes stale exactly as `relabel-from-roads.ts:1-8` documents.

The current design already splits it this way. It is correct.

**3. Should join quality (Rail 3) be an atom at all, or a derived manifest metric?**

Derived manifest metric. Not an atom.

Join quality is a *measurement of our own pipeline*, not a claim about the world. The atom contract is for claims with provenance about physical-world jurisdictional facts (structural commitment 1). "Our prop_id match rate against this CAD roll is 0.51" is an internal quality metric whose provenance is our own run, not a public record.

The roster already holds it correctly: `join_quality: { prop_id_bad_rate, prop_id_bad_count, join_key, crosswalk_risk, owner_match_gate_required, verification, evidence }` per county, 254/254 rows, with `owner_match_gate_required: true` universally.

One qualification that changes nothing about the verdict: `keyKind` on the property atoms (per Q1) is *not* Rail 3 becoming an atom. `keyKind` is a fact about the atom's own key. The rate metric stays in the roster.

**4. Does making the ring an atom conflict with anything in the serving path?**

Yes, directly and severely. This is the strongest single refutation in this review.

Ten engine files read `txgio_parcel`, including `boundary-primitive/load-parcel-index.ts` (four queries), `registry/cert-grade-core.ts`, `warden/envelope-sanity.ts`, `site-plan/resolve-situs-for-export.ts`, and `services/retrieval-api/src/spine-health/probes.ts`. On the product side, `legacy-design-tools/artifacts/api-server/src/lib/txgioParcelStore.ts` is the map serving reader, and its own header states the anti-duplication rule: "the local table IS the store; a cache row would just duplicate it."

The warm path pins the ring to that table read by explicit ruling (`depth-warm-bastrop-batch.mjs:613-625`): "rawParcelRing is pinned to geom.ring (txgio) ONCE here and MUST NOT be reassigned."

Introducing a ring atom means a consumer can read geometry from the atom store while the product serves from the table. Geometry Law rule 3 names that as the master defect class with five instances in one saga, and declares it "now structurally unrepresentable." Proposal 1 makes it representable again, at 13.36M rows.

The proposal's own framing gives the game away: it argues the benefit is holding "two atoms about one node" (`:26`) as the way to honor a law whose rule 1 is ONE RING PER PARCEL. The disagreement between txgio and BCAD is already representable and already shipped, engine #273 demoted BCAD to divergence reporting and created the `PARCEL-RING-SOURCE-DIVERGENCE` observation class, with 200 observations filed on the Bastrop cohort. The problem the proposal says only a ring atom can solve was solved in the saga, in the direction opposite to the proposal.

**5. Is there a migration order that does not require a flag day?**

For Proposals 1 and 2 as written: no. Proposal 2 cannot avoid one because identity is the primary key of `atoms` and is embedded in every atom DID and in a public MCP parameter; the three escape routes are dual-write (needs the `supersedes` edge machinery Proposal 4 says does not exist, and collides with the composite unique index), resolver shim (which means the external key is still the identity, so the migration bought a rename), or cutover (flag day across three repos and a public API). Proposal 1's mid-migration state *is* the master defect class, so its "safe" order is a scheduled outage of the Geometry Law invariant.

For Proposals 3, 5, 6 and the recommended-change forms of 1, 2, and 4: yes, entirely additive, no flag day, order given in the Migration Reality section above.

---

## WHAT I TRIED TO BREAK AND COULD NOT

**Proposal 6.** I attacked it as vacuous ("declare a decision" is not a model) and as a restatement of audit S1. Both are true and neither is a defect. A governance rule that forces omissions to become decisions is exactly right for a program whose failure mode is documented as "the rail list and the atom layer were authored independently and have never been reconciled." I could not find a way it makes anything worse. ADOPT stands.

**The `buildable-envelope` absence half of Proposal 5.** I tried to argue the R27 engine-extension fields (`warmVerifyDecline`, `warmVerifyDeclineCode`, `recipeVersion` at `honest-decline-promote.ts:30-35`) are adequate in practice since the engine is the only writer. They are not: they will not survive `.atompack` export or MCP serve, and the audit is right that this sits on the headline rail. The queue row (`QUEUE:129`) already characterizes it correctly. No counter-argument survived.

**The proposal's core diagnosis that `parcelNodeId` is a bare key with no provenance behind it.** I tried to find a `parcel-record` or geometry-provenance atom in the engine to refute it. There is none, audit `:43-52` is correct, and `grep '"parcel-node"' P:\hauska-engine` returns nothing. The diagnosis is right. Only the prescription (make the ring an atom) is wrong. The `parcel-node` type existing on the MCP surface with no engine writer makes the diagnosis *worse* than the proposal states.

**`ROAD_NODE_ID_PATTERN` local re-declaration.** Confirmed exactly as claimed: contract `src/property/common.ts:34`, engine `packages/atoms/src/road-instances.ts:135`, identical regex, no import, free to drift. I could not soften this.

**Proposal 3's underlying observation that "this parcel fronts this street" is a claim that can be wrong and that the operator has personally overruled once.** True and well-sourced, `_decisions/2026-08-07_...:32` records the operator overruling an auditor on 48021:31317, and engine #275 merged the corner-frontage fix. The observation is correct. It just does not imply the fix Proposal 3 proposes; the existing atom already carries `frontBasis` precisely so a surface can cite *how* the front was chosen and a human can overrule it.

---

## WHAT I COULD NOT DETERMINE

- **Whether `atom_links` has any rows in production, and of which link types.** I read the write path, both traversal paths, and the live tally query that counts it, but no DB was read (read-only constraint). The property-family conclusion, that the edge layer exists but no property adapter writes to it, is inferred from source (all 18 non-schema references trace to corpus atomization or storage/tally plumbing), not from row counts. If property edges *are* being written by a path I did not find, the salvageable part of Proposal 4 shrinks further.
- **Whether the deployed engine matches `P:\hauska-engine` working tree.** Same limitation the coherence audit flagged at `:365`. All engine findings are from the local clone.
- **The 13,987 road-record figure** in proposal `:49`. Not present anywhere in `hauska-engine`. It may come from a cohort run log I did not locate. The 25 m threshold beside it is confirmed at `edgeLabeling.ts:21`.
- **Whether any TxGIO MultiPolygon parcels actually exist in the loaded corpus**, and at what rate. The truncation defect (M1) is confirmed in code; its live incidence is unmeasured and needs a `SELECT` against `txgio_parcel` on `jsonb_array_length` of the coordinates. I would rank measuring this above any of the six proposals.
- **Whether `hauska-map`'s 982 `parcelNodeId` occurrences are mostly test fixtures or mostly live call sites.** I counted occurrences, not weighted call sites. The migration-cost argument for Proposal 2 stands on the engine (886) and MCP (65) counts alone, so this does not change the verdict, but the total may overstate product-side coupling.
- **The manifest's intended schema.** Confirmed it does not exist in the engine (`not-yet`, `satisfied-absent` → zero TS hits) and the coherence audit could not locate a file either. Proposal 5's reconciliation problem is therefore assessed against a design that has not been written. If a manifest schema exists somewhere I did not search, the drift analysis should be re-run against it.
- **Whether condo/vertical-subdivision parcels appear in the current cohorts.** Zero code handling confirmed; live incidence unknown. Bastrop and Elgin are unlikely to surface it; Travis and Harris will.
