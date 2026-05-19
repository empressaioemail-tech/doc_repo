---
id: 26_atom_upgrade_guide
title: "@hauska/atom-contract â Upgrade & Consumption Guide"
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [adr_001_atom_architecture, adr_018_atom_contract_substrate_layer, 25_atom_architecture_reference, 30_smartcity_os, 40_design_accelerator]
---

# `@hauska/atom-contract` â Upgrade & Consumption Guide

> **Adoption guide.** Operational counterpart to the architecture
> spec. The contract is described in
> [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md);
> the architectural decision rationale lives in
> [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md);
> this guide is the *how-to* for adopting it.

**Version:** 2026.04 v1 (migrated to docs repo 2026-05-05; package rename 2026-05-18 per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md))
**Owner:** Hauska Inc. (commercial substrate, peer to the Hauska SDK; brand placement per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md)).
**Intended audience:** Engineers adopting `@hauska/atom-contract` for the
first time (new vertical product, or existing product migrating onto
it) and engineers consuming a new `@hauska/atom-contract` version in an
existing product. (Renamed from `@empressaio/atom` on 2026-05-18 per
ADR-018; currently staged as workspace-private `@workspace/empressa-atom`
in legacy-design-tools.)
**Consolidated from:** `smartcity-atom-upgrade-guide.md` (SmartCity-
specific migration steps preserved), plus new content for
onboarding from scratch.

**Prerequisite reading:**

- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) â atom contract, five render modes, context interface, living-lineage principle. This guide assumes familiarity with all of these.
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) â cross-stakeholder atom access model. Required reading before implementing `tenantScoped` or PII scope filters; ADR-007 is the canonical access model these filters operate against.

---

## How to read this document

Six sections:

1. **When to use this guide** â four scenarios
2. **First-time adoption** â new vertical app onboarding onto atoms
3. **SmartCity OS migration path** â specific to the M3 Compass V4 cutover
4. **Version upgrade protocol** â when consuming a new `@hauska/atom-contract` release
5. **Breaking-change migration patterns** â named patterns for common
   contract changes
6. **Validation checklist** â the before-ship confirmation every consumer runs

---

## Section 1 â When to use this guide

Four scenarios:

| Scenario | Section |
|---|---|
| New vertical product adopting atoms for the first time (e.g., a future Empressa O&G Ops product) | Â§2 |
| SmartCity OS migrating its Operations Dashboard from pre-atom Compass V3 to atom-backed Compass V4 (M3) | Â§3 |
| Empressa Land refactoring onto `@hauska/atom-contract` after M2-C extraction (M5) | Â§2 + Â§3 patterns apply |
| Existing consumer bumping to a new version of `@hauska/atom-contract` | Â§4 + Â§5 |

---

## Section 2 â First-time adoption

Path for a new product adopting atoms. Order matters â each step has
prerequisites in the prior step.

### 2.1 Set up the package

Install:
```bash
npm install @hauska/atom-contract
npm install @hauska-sdk/core @hauska-sdk/vda @hauska-sdk/wallet
```

The atom contract package is a peer Hauska substrate to the SDK packages,
not a sub-package of `@hauska-sdk/*` (per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md)).
Pin exact versions in package.json â no `^` or `~`. Upgrades are
deliberate.

Configure the atom registry at application boot:
```ts
import { AtomRegistry } from "@hauska/atom-contract";

const registry = new AtomRegistry({
  tenantId: currentTenant.id,
  eventAnchoring: coreAnchoringService,  // @hauska-sdk/core
  vdaService: vdaMintingService,         // @hauska-sdk/vda
  storage: clusterAdapter,               // @hauska-sdk/adapters-ipfs-cluster
});
```

The registry is a long-lived singleton. Create at boot, dispose at
shutdown. Do not create-per-request.

### 2.2 Write the atom catalog

Before writing any atom registration code, produce the atom catalog
for the product:

`<product>_atom_catalog.md` per doc-numbering convention. For each
data-level atom type:

- Fields (typed, documented)
- Composition (which atom types this contains or references, with
  arity)
- Context interface template (prose template + typed classification +
  key metrics + related atoms)
- Source-system map (if the atom type is being fed by integrations,
  which source contributes which events)
- Reconciliation policy (when the same real-world entity appears from
  multiple sources, how identifiers resolve to one atom ID)
- Historical event reconstruction policy (if historical data exists,
  what's recoverable natively vs. what becomes a single "imported
  state" event with `provenanceTier: "backfill"`)
- PII fields that require scope filtering
- Retention policy

The catalog is the specification. Code implements the catalog; it
does not invent the catalog.

App-level atom types have a simpler spec â no source-system map, no
reconciliation policy, no provenance-tier consideration. But they
still get a catalog entry.

### 2.3 Register the atom types

For each catalog entry, write a `registerAtom<TType>()` call:

```ts
import { registerAtom } from "@hauska/atom-contract";

export const PermitAtom = registerAtom<"permit">({
  entityType: "permit",
  isDataLevel: true,
  tenantScoped: true,
  
  idResolver: (rawRecord) => `permit:${rawRecord.mygov_permit_id}`,
  cidBuilder: async (content) => computeCID(content),
  
  contextSummary: async (entityId, scope) => {
    const permit = await fetchPermit(entityId);
    return {
      prose: renderPermitProse(permit, scope),
      typed: {
        entityType: "permit",
        entityId,
        subtype: permit.permitType,
        tenantId: permit.tenantId,
        status: permit.status,
        phase: permit.phase,
        lastTouchedAt: permit.updatedAt,
      },
      keyMetrics: {
        daysInReview: daysSince(permit.submittedAt),
        parcelId: permit.parcelId,
        assignedInspector: permit.inspectorId,
        outstandingFindings: permit.findings.filter(f => !f.resolved).length,
      },
      relatedAtoms: [
        { entityType: "parcel", entityId: permit.parcelId },
        { entityType: "person", entityId: permit.applicantId },
        { entityType: "person", entityId: permit.inspectorId },
        ...permit.findingIds.map(id => ({ entityType: "finding", entityId: id })),
      ],
      historyProvenance: permit.atomizedNatively ? "native" : "backfill",
      scopeFiltered: scope.kind === "public" || scope.kind === "citizen-self",
    };
  },
  
  render: {
    inline: (entityId) => ({ glyph: "â¬¡", label: `Permit #${parsePermitNumber(entityId)}` }),
    compact: (entityId) => ({ /* ... */ }),
    card: (entityId) => ({ /* ... */ }),
    expanded: (entityId) => ({ /* ... */ }),
    focus: (entityId) => ({ /* ... */ }),
  },
  
  composition: {
    parcel: { arity: 1, required: true, atomType: "parcel" },
    applicant: { arity: 1, required: true, atomType: "person" },
    findings: { arity: "many", atomType: "finding" },
    reviews: { arity: "many", atomType: "review" },
    assignedInspector: { arity: "0..1", atomType: "person" },
  },
  
  eventTypes: [
    "permit.submitted",
    "permit.first_review_complete",
    "permit.finding_issued",
    "permit.finding_resolved",
    "permit.approved",
    "permit.denied",
    "permit.inspection_scheduled",
    "permit.inspection_complete",
    "permit.closed",
  ],
  
  piiFields: ["applicantName", "applicantPhone", "applicantEmail", "applicantAddress"],
  retentionPolicy: { keepForever: true, reason: "public record" },
});
```

Every field is mandatory. TypeScript will refuse to compile if any is
missing. That's the compile-time enforcement of Commitment 1.

### 2.4 Write the context summary implementations

The `contextSummary` function is the most important code a consumer
writes. It's what the AI reads. Get it right.

Principles:
- **Prose one to three sentences, no more.** Long summaries bury
  signal.
- **Scope-aware.** Return different prose for different authorization
  scopes. PII fields never reach a scope that shouldn't see them.
- **Key metrics are opinionated.** Include what a human responding to
  a question about this atom would include without being asked.
- **Related atoms are navigational.** The AI uses them to walk the
  graph. Include structural relationships (parcel â permit) and
  temporal ones (last inspector â current inspector).
- **Fast.** Sub-100ms synchronous response on the common path. Cache
  model-generated narrative summaries. Regenerate on new events.

Scope filters in this section operate against the access model defined in [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md). Property-as-tenant-of-record, stakeholder access scopes, and cross-tenant references are settled there. New atom registrations should review ADR-007 to confirm scope assumptions match the access model.

### 2.5 Write the render specs

Five render modes per atom. Each is a function returning a render
spec â a declarative description of what the window should draw.

The render specs are component-framework-agnostic. A React consumer,
a Vue consumer, a mobile consumer all receive the same spec and
render it with their framework's primitives. Do not couple render
specs to a specific UI library in the atom definition.

Consult `@hauska/atom-contract/docs/rendering/` for render spec schema
and cinematography conventions.

### 2.6 Wire the event emitter

Every state change on a data-level atom emits an event through the
event emitter, which writes to `@hauska-sdk/core.EventAnchoringService`.

```ts
await permit.emitEvent({
  eventType: "permit.finding_resolved",
  observedAt: now(),
  payload: { findingId, resolvedBy: inspector.id },
  actor: { kind: "user", id: inspector.id },
});
```

The emitter handles: constructing the event envelope, computing
hashes, appending to the chain, optionally anchoring to the external
substrate (M6+). Consumers never write events directly to the chain
â always through the emitter.

### 2.7 Register the atom catalog with the AI prompt layer

The AI needs to know which atom types exist and how to reference them.
Post-M3 in SmartCity OS, this is automatic â the registry exposes
the catalog to Compass V4's context curator. For custom AI
integrations, the consumer provides the registry to the AI layer
explicitly.

The AI prompt includes atom registrations so the model knows what
entities exist, how to reference them (`{{atom:type:id:label}}`), and
what their typical contexts look like.

### 2.8 Validate before ship

Run the pre-ship checklist in Â§6. Do not skip.

---

## Section 3 â SmartCity OS migration path (M3)

SmartCity OS Operations Dashboard today runs **Compass V3** with
prompt-assembly context curation from ~15 live data sections. Compass
V4 (atom-backed) is the target post-M3.

The migration is not a rewrite. The AI surface (chat + response
components) stays. What changes is the context-assembly path:

- **V3 path (current).** `buildLegacyContext()` reads ~15 data sources
  and assembles a prompt. All context is prompt-injected.
- **V4 path (target).** `buildCuratedContext()` queries the atom
  registry for atoms relevant to the user's intent. The atoms'
  `contextSummary()` calls return structured responses. The prompt
  includes atom-scoped context, not bulk-injected data.

Empressa Demo has already done this migration. `ATOM_CONTEXT_V2=true`
is confirmed in its Replit shared env; `buildCuratedContext()` is the
production runtime for every Compass message there. SmartCity M3 is
the same migration applied to a customer-facing surface.

### 3.1 Prerequisites (before M3 begins)

- [ ] M1 complete (test safety net â the migration is structural
      refactoring on live production; coverage is non-negotiable)
- [ ] M2-C complete (`@hauska/atom-contract` published at v1.0.0)
- [ ] SmartCity OS atom catalog drafted (minimal viable set â permit,
      work-order, vehicle, inspection, asset. Full catalog is M3.5.)
- [ ] Atom registry service wired into SmartCity OS application boot

### 3.2 Step-by-step

**Step 1. Register minimum viable atom types.**
Register the 5 minimum-viable atom types (permit, work-order, vehicle,
inspection, asset) against `@hauska/atom-contract` in SmartCity OS. Each
gets a full `registerAtom()` call per Â§2.3â2.5.

Context summary implementations pull from the existing SmartCity OS
DB (MyGov-synced tables, Samsara mirror, etc.). No new data source.

**Step 2. Wire the atom-v2 context path.**
In SmartCity OS's Compass equivalent of Empressa's
`empressa-chat.ts:598`, add the `buildCuratedContext()` path behind
a feature flag:

```ts
const useAtomContextV2 = process.env.SMARTCITY_ATOM_CONTEXT_V2 === "true";
const context = useAtomContextV2
  ? await buildCuratedContext(userQuery, registry, scope)
  : await buildLegacyContext(userQuery);
```

Both paths remain callable. Default is V3 (`false`).

**Step 3. Shadow run.**
Enable the V2 flag for internal users only (Legacy Group staff, not
Bastrop staff). Run both paths for every message. Log the V2 output
for internal review; don't actually serve it.

Compare V2 output to V3 output. Look for:
- Atoms that should be surfaced but aren't
- Atoms that are surfaced but shouldn't be
- Context summaries that are wrong, stale, or miss key metrics
- PII leaks (V2 returning fields V3 would have filtered)

Iterate until V2 matches or exceeds V3 quality on a representative
query corpus.

**Step 4. Progressive rollout.**
Enable V2 for Bastrop staff with specific sign-off (Sylvia). Shadow
for N days. Confirm no regression on live user interactions â
satisfaction, correctness, latency.

**Step 5. Flip the default.**
Set `SMARTCITY_ATOM_CONTEXT_V2=true` in the Cloud Run revision env.
V2 becomes default. V3 path stays callable via flag-off for
emergency rollback.

**Step 6. Retire V3 after stable period.**
After N days of clean V2 operation (recommended: 30+ days), remove the
V3 path from code. Ship a PR that deletes `buildLegacyContext()` and
its dependencies.

The migration is complete.

### 3.3 Known migration risks

**Risk: Context summary latency.** V3's prompt-assembly hits the DB
once per message. V2's `contextSummary()` calls hit the DB per atom,
per relevant atom. For a message touching 10 atoms, V2 could do 10x
the DB work. Mitigate with caching and batched queries.

**Risk: Atom resolution precision.** V3 injects all data and lets the
model find relevance. V2 resolves atoms pre-prompt; if atom resolution
is narrower than the model would have chosen, V2 misses.
Mitigate with a fallback: if V2 resolves <N atoms and the user query
is open-ended, broaden.

**Risk: PII scope mismatches.** V3 may have been leaking PII the team
didn't know about. V2's scope-filtered context summaries may surface
differences. Do not suppress â fix the underlying scope logic. Report
the differences to Sasha.

**Risk: Atom catalog gaps.** Queries about entities whose atom type
isn't registered yet produce empty V2 output. Keep V3 fallback enabled
for atom types not yet migrated. M3.5 expands the catalog; full
coverage is M3.5, not M3.

### 3.4 After M3

Historical data backfill is M3.5 work, not M3. After M3, SmartCity
OS has atom-backed context for the minimum-viable types but with
native-only history (no backfill of 2019-2025 permits yet).

Context summary honestly reports `historyProvenance: "native"` for
post-M3-cutover events, and â once M3.5 runs â `"backfill"` for
pre-cutover events. Bastrop-facing UI should render the distinction
visibly (a small "imported from MyGov" label on backfilled permits).

---

## Section 4 â Version upgrade protocol

> **Scope note (2026-05-19).** This section covers framework upgrades
> to the `@hauska/atom-contract` package itself (new render modes, new
> `ContextSummary` fields, breaking-change majors). It does NOT cover
> adding new atom *types* to the catalog: per option β
> ([`_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md`](_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md)),
> atom-type registrations live in consumer packages
> (`hauska-engine/packages/atoms/` for catalog atoms;
> `legacy-design-tools/artifacts/api-server/src/atoms/` for product
> atoms; `smartcity-os` Codex 1b for adjudication-context atoms).
> Adding new atom types bumps the engine atom-registry (or the
> respective consumer-package) version, not the contract package
> version. The contract package stays at 1.0.0 absent framework
> changes.

When a consumer bumps to a new version of `@hauska/atom-contract`, follow
this protocol.

### 4.1 Patch upgrade (x.y.Z)

```bash
npm install @hauska/atom-contract@<new-patch-version>
npm test
```

Expected impact: none. Patch releases fix bugs without changing the
API. Tests pass, ship.

If tests fail on a patch release, that's an SDK bug masked as a patch
â file back to Nick + the atom package author.

### 4.2 Minor upgrade (x.Y.0)

```bash
npm install @hauska/atom-contract@<new-minor-version>
npm test
```

Expected impact: new optional APIs become available. Existing code
continues working. Pre-existing atom registrations remain valid.

Review the release notes for new optional features that might be
useful. Adopt at consumer's pace; no forced migration.

### 4.3 Major upgrade (X.0.0)

Not a casual bump. Breaking changes require coordinated migration.

Steps:

1. **Read the upgrade guide for this specific major version.**
   Every major release ships with migration notes in the package
   (`@hauska/atom-contract/UPGRADE_v{X}.md`) and is summarized here in Â§5.

2. **Plan the migration.** Which atom registrations need changes?
   Which call sites need updating? Estimate PR size.

3. **Make the changes on a branch.** Don't bump on main until the
   branch is complete.

4. **Run the full test suite.** Every consumer product's test suite.
   Not just the one being upgraded â if multiple products share atom
   code, all are affected.

5. **Test in staging.** Run the migrated version in staging against
   a realistic data set. Confirm context summaries still look right,
   rendering still works, events still chain.

6. **Deploy coordinated.** Consumer products bump together. Don't
   leave one product on v1.x while another goes to v2.x â shared
   atom type definitions would mismatch.

7. **Retire migration flags.** After stable operation, clean up any
   feature flags that gated the upgrade.

---

## Section 5 â Breaking-change migration patterns

Common patterns for major version bumps. Updated as major versions
ship.

### Pattern A: A new required field on `AtomRegistration`

Example: adding `retentionPolicy` as required (hypothetical â it's
already required in v1). All atom registrations must add the field.

Migration:
- Write a codemod that walks existing `registerAtom()` calls and
  inserts the new field with a sensible default.
- Run the codemod on each consumer repo.
- Humans review the defaults per atom type; correct where the default
  is wrong.
- Ship.

### Pattern B: A signature change on `contextSummary`

Example: `scope` parameter gains a new required field.

Migration:
- Update every `contextSummary` implementation to receive and handle
  the new field.
- If the new field gates behavior, implement per-atom-type handling.
- Test scope filtering across the atom catalog.

### Pattern C: Render spec schema change

Example: adding a new required property to `CardRenderSpec`.

Migration:
- Every atom's `render.card(entityId)` implementation updates to
  return the new property.
- If the new property is content the atom doesn't naturally carry,
  decide: extend the atom's data model, or compute from existing
  fields, or mark unsupported (declare via an opt-out).

### Pattern D: Event envelope schema change

Example: adding a new required field to emitted events.

Migration:
- Update `atom.emitEvent()` callers to include the new field.
- Backfill existing events where possible (schema-migration-as-event
  pattern).
- Coordinate with `@hauska-sdk/core` â the anchoring service must
  also know about the new field.

### Pattern E: Package scope change

Example: splitting `@hauska/atom-contract` into
`@hauska/atom-contract-core` and `@hauska/atom-contract-rendering`.

Migration:
- Update imports across consumers.
- Bump pinned versions.
- Test.

This is a nuclear-option change. Prefer extending existing packages
over splitting them until clear evidence the split is necessary.

---

## Section 6 â Validation checklist (before ship)

Run this every time a consumer adopts or upgrades `@hauska/atom-contract`.

### Registration contract

- [ ] Every atom type registered has all 4 layers of the contract
      (identity, context interface, composition, history)
- [ ] Every atom type registered has all 5 render modes
- [ ] TypeScript compiles without error
- [ ] `registerAtom()` calls succeed at application boot (no
      registration-time validation failures)
- [ ] Every atom type is in the product's atom catalog document

### Context interface

- [ ] Every atom's `contextSummary()` returns sub-100ms on typical
      queries (or is cached with short TTL if model-generated)
- [ ] PII fields declared in `piiFields` are scope-filtered in
      `contextSummary()` â specifically, low-scope callers don't
      receive the PII fields
- [ ] `historyProvenance` returns correctly (`"native"` for post-
      cutover events, `"backfill"` for imported history)
- [ ] Related atoms referenced are themselves registered; no dangling
      references
- [ ] Prose summary renders correctly in inline-markup format via the
      AI's `{{atom:type:id:label}}` output

### Rendering

- [ ] Each render mode returns a valid render spec per
      `@hauska/atom-contract/docs/rendering/` schema
- [ ] All five modes tested against a sample atom of each registered
      type
- [ ] Cinematography / mode transitions work (inline â card â focus)
- [ ] Right-panel drill-in state machine behaves correctly (stack
      depth bounded at 3; new turns return panel to ambient)

### Composition

- [ ] Child atoms referenced in `composition` declarations are
      themselves registered
- [ ] Arity declarations match reality (an atom declared `arity: 1`
      never has more than one; an atom declared `required: true`
      always exists at atom creation time)
- [ ] Parent/child ownership vs. reference is correctly modeled (a
      permit's findings are owned â deleted with the permit; a
      permit's parcel is referenced â survives the permit)

### History

- [ ] Every data-level atom type emits events for every state change
      (no bypass of the event envelope)
- [ ] `@hauska-sdk/core.EventAnchoringService` integration works â
      events append to the chain, `verifyChain()` succeeds
- [ ] Chain continuity: no gaps in `prevHash` references
- [ ] App-level atoms correctly declared `isDataLevel: false` (no
      VDA, no chain, no anchoring overhead)

### Governance

- [ ] Tenant-scoping enforced â cross-tenant queries blocked at the
      registry level (or explicitly audited if allowed)
- [ ] Retention policy specified for every atom type
- [ ] PII fields correctly declared per type

### AI integration

- [ ] The AI layer has access to the atom catalog
- [ ] The AI emits `{{atom:type:id:label}}` markup for registered
      atoms, not raw data
- [ ] Markup validation runs before rendering AI output â invalid or
      unregistered markup is logged and stripped
- [ ] Context summary is called from the AI context curator on every
      relevant atom

### Performance

- [ ] Atom registry queries return within acceptable latency
- [ ] Context summary caching is configured
- [ ] Render specs are computed efficiently (no N+1 DB queries per
      render)

### Security

- [ ] Sasha review scheduled (quarterly or on-demand per Mâ Track 1)
- [ ] Webhook / external-POST handlers for atom-affecting events use
      reject-on-missing-secret pattern (per lesson from Verkada)
- [ ] Per-service secret binding confirmed (per lesson from MyGov
      two-service clarification)

### Documentation

- [ ] Atom catalog published for the product (planned future doc;
      e.g., `35_smartcity_atom_catalog.md` for SmartCity OS, or
      pre-docs-repo `41a_smartcity_atom_catalog.md` if reference exists)
- [ ] [`10_ground_truth.md`](10_ground_truth.md) updated to reflect
      which atom types are live and which are pending
- [ ] Roadmap milestone entry closed in
      [`11_roadmap.md`](11_roadmap.md) if this adoption is a milestone
      deliverable

---

## Version history

- **v1 (2026.04.18)** â Initial guide. Covers first-time adoption,
  SmartCity OS M3 migration path (absorbed from
  `smartcity-atom-upgrade-guide.md`), version upgrade protocol,
  common breaking-change migration patterns, validation checklist.
  Aligned with `20_empressaio_atom_architecture.md` v1 (now
  [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md))
  and the v1.3 structural correction on atom ownership / anchoring
  attribution.

- **2026-05-05 (docs-repo migration)** â Migrated to `doc_repo` as
  `26_atom_upgrade_guide.md`. Frontmatter added. Cross-references
  updated: prerequisite reading points at
  [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md);
  state-of-reality reference becomes
  [`10_ground_truth.md`](10_ground_truth.md); roadmap reference becomes
  [`11_roadmap.md`](11_roadmap.md); atom-catalog references annotated
  as planned future docs. Architecture decision rationale captured
  separately in
  [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md).
  Adoption-protocol content unchanged from v1 â first-time-adoption
  steps, SmartCity OS M3 migration path, version-upgrade protocol,
  breaking-change patterns, and pre-ship validation checklist are
  stable.

- **2026-05-18 (package rename per ADR-018)** â Package name changed
  from `@empressaio/atom` to `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md).
  Atom contract is Hauska commercial substrate, peer to the Hauska SDK,
  not Empressa product. Fifteen in-body references swept: title, H1,
  audience descriptions, scenario table (Â§1), install commands and
  import statements (Â§2.1, Â§2.3), prerequisites (Â§3.1), Step 1
  registration (Â§3.2), version-upgrade-protocol intro and commands
  (Â§4.1, Â§4.2, Â§4.3), Pattern E split example (Â§5), and validation
  checklist references (Â§6). Owner line restated as Hauska Inc.
  commercial substrate. Adoption-protocol content otherwise unchanged.
