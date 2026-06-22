---
id: 25_atom_architecture_reference
title: "@hauska/atom-contract â Architecture reference"
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [adr_001_atom_architecture, adr_018_atom_contract_substrate_layer, 26_atom_upgrade_guide, 30_smartcity_os, 40_design_accelerator, 41_revit_connector]
---

# `@hauska/atom-contract` â Architecture reference

> **Atom-contract update (2026-06-21).** Published at 1.5.0 with `/conformance` (validateAtomConformance, target 1.5.0) and `/export` (the DownloadableAtom shape), on top of the `/read-contract` three-axis confidence. The conformance target and the downloadable-atom export are the current shape every consumer co-bumps to; "Cortex" is reframed to the reporting function package per the ADR-008 amendment. See [`_architecture_homes/02_atoms_lifecycle_ownership.md`](_architecture_homes/02_atoms_lifecycle_ownership.md).
>
> **Architecture spec.** This is the full reference for the atom
> contract, its rendering model, its composition rules, and its
> AI-facing interface. The decision *to* adopt this architecture (and
> the alternatives considered) is captured separately in
> [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md).
> Companion adoption guide:
> [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md).

**Version:** 2026.04 v1 (migrated to docs repo 2026-05-05; package rename 2026-05-18 per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md))
**Owner:** Hauska Inc. (commercial substrate, peer to the Hauska SDK; brand placement per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md)).
**Package:** `@hauska/atom-contract` â M2-C extraction target per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md). Currently staged as workspace-private `@workspace/empressa-atom` in the legacy-design-tools repo at `lib/empressa-atom/`. Renamed from `@empressaio/atom` on 2026-05-18 per ADR-018; atom contract is Hauska commercial substrate, peer to the Hauska SDK, not Empressa product.
**Consumers:** SmartCity OS (from M3), Empressa Land (from M5),
Empressa Company Intelligence (from M5), Hauska MCP Server (consumes
contract directly for tool generation and schema validation; SDK
consumed only for paid-tier surfaces requiring VDA wrapping or
revenue routing per ADR-018).

**Sources consolidated** (all retired on publication of original v1, 2026-04):
- `hauska-atom-master-architecture.md`
- `hauska-atom-executive-summary.md`
- `hauska-atom-addendum-a-living-lineage.md`
- `smartcity-atom-upgrade-guide.md` (merged into the companion
  [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md))
- `intelligence-interface-vision-v4.md` (multi-agent routing section
  merged into `44_smartcity_compass_v4_spec.md` â pre-docs-repo,
  pending migration; atom-facing content merged here)
- `intelligence-interface-cinematography-v4_1.md` (rendering-cinematography
  content merged here)
- `the-living-lineage-v2__3_.docx` (intro prose absorbed into Section 1)

Historical note. The v1 consolidation (2026-04) and the v1.3
structural correction (2026-04-18) renamed every use of "Hauska Atom"
or "`@hauska-sdk/atom`" in prior materials to "Empressa Atom" /
"`@empressaio/atom`" and asserted that the atom belonged to Empressa,
not Hauska. **Superseded 2026-05-18 by [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md).**
The atom contract is now Hauska commercial substrate, peer to the
Hauska SDK and to Hauska Engine, distinct from any Hauska-namespaced
SDK sub-package. Current canonical package name is
`@hauska/atom-contract`. The 2026-04-18 v1.3 ownership-correction note
in [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md)
is reconciled to match.

---

## How to read this document

Eleven sections:

1. **The living lineage principle** â why the atom exists
2. **The atom, defined** â the four-layer contract
3. **Data-level vs app-level atoms** â two categories, one shape
4. **The context interface** â Commitment 1 delivery
5. **The rendering model** â five modes, one entity
6. **Composition** â how atoms contain other atoms
7. **The history layer** â semantic memory + cryptographic chain
8. **The registration contract** â the compile-time enforcement
9. **The AI as gateway** â how users never address atoms directly
10. **Anti-patterns** â ways the architecture is violated
11. **Glossary and package surface**

Read sequentially on first pass. Reference Section 4 (context interface)
and Section 8 (registration contract) most often during development.

---

## Section 1 â The living lineage principle

The atom architecture originates in a single observation:

**A real-world entity has a history that predates any software system
and should outlast every software system that touches it.**

The chain of ownership of a parcel. The decisions made about a permit.
The inspections that happened on an asset. The conversations a person
had with the city. Those histories are the entity. The database record
is a snapshot. The application that hosts the record is a temporary
custodian.

Traditional software ignores this. A permit is rows in a permit-system
database. The application decides what the permit means, how to render
it, what actions are available on it. Strip the permit from the
application and you have inert data.

The atom model inverts this. **The entity carries its own intelligence.**
The application is a surface the entity passes through.

Three properties make a lineage living:

- **Carried by the entity.** The lineage travels with the asset. When
  data moves from one system to another, the complete decision chain
  moves with it.
- **Cryptographically verifiable.** Every entry in the lineage is
  signed at the moment of creation. The signature is checkable without
  trusting any hosting system.
- **Permanently append-only.** Nothing is deleted or overwritten. Every
  state change is a new entry. What happened, happened â and it is
  provable that it happened at that time, by that party, with that
  content.

The atom is the container for the living lineage. Every property of
an atom â its identity, its AI-facing description, its composition,
its signed history â serves the goal of making the entity's story
portable, verifiable, and perpetual.

This is the Empressa thesis. Every design decision in this document
traces back to it.

---

## Section 2 â The atom, defined

An atom is the smallest addressable entity the system knows about. It
carries four things bundled into a single registration contract:

**1. Identity.**
- `entityType` â the kind of thing (permit, vehicle, work-order,
  sprint-board, person, etc.)
- `entityId` â the stable ID that does not change across versions
- `cid` â content identifier addressing a specific version of the
  atom's content
- `vdaRef` (data-level atoms only) â reference to the VDA that
  roots the atom's ownership and signed history

**2. Context interface.**
A method the atom exposes that returns a structured self-description
when called. Typed where the data is stable, free-form where the data
needs prose. This is how the atom makes itself AI-accessible â
Commitment 1 delivery. Section 4 specifies the interface in detail.

**3. Composition.**
A declaration of which other atom types this atom contains or
references. A work-order composes a vehicle and an asset and an
assignee-person. A permit composes a parcel and findings and review
events. Section 6 specifies how composition is resolved.

**4. History.**
Two linked layers:
- **Semantic entity memory** â prose and structured facts about what
  has been decided, observed, learned regarding this atom over time.
  Human-readable. AI-consumable.
- **Cryptographic event chain** â the append-only, hash-chained log
  of events affecting the atom, signed and verifiable. This layer is
  written via `@hauska-sdk/core.EventAnchoringService`.

Section 7 specifies the interaction between the two.

These four items are not modules an atom optionally implements. They
are the contract. An `AtomRegistration` that fails to provide all four
fails compilation. Section 8 specifies the contract.

---

## Section 3 â Data-level vs app-level atoms

Both categories share the four-layer contract. They differ in what
operational guarantees the system applies to them.

| Property | Data-level atom | App-level atom |
|---|---|---|
| Real-world referent? | Yes â parcel, vehicle, permit, person | No â sprint board, briefing, workflow container |
| VDA (Verifiable Data Asset)? | Yes | No |
| Cryptographically anchored history? | Yes | No |
| Tenant-scoped? | Yes | Yes |
| AI-accessible via context interface? | Yes | Yes |
| Composable into other atoms? | Yes | Yes |

**Data-level atoms** are the entities that exist independent of any
application. If Legacy Group disappeared tomorrow, the parcel still
exists. The permit still exists. The vehicle still exists. These atoms
get the full provenance treatment â VDA backing, signed hash-chained
history, portability guarantees.

**App-level atoms** are workflow containers. A sprint board exists
because an application created it to organize work. A briefing exists
because a user asked the AI to prepare one. These atoms don't need
cryptographic provenance â there's no external world they need to
stay true to. But they still have identity, context interface,
composition. The AI can reason about them uniformly.

**Why both use the same shape.** The AI should be able to ask "what
atoms are relevant to this query?" and get a uniform answer. Whether
the atom is a permit (data-level) or a sprint board (app-level), the
context interface method is callable and returns comparable output.
The AI doesn't need to know which category an atom belongs to in
order to reason about it. The category matters to the write path
(anchoring, portability) but not to the read path (AI queries,
rendering).

**Examples in current products:**

In Empressa Demo (reference implementation), most atoms are app-level:
sprint-board, task, person (contact, not identity), deadline, draft,
blocker. Fleet-summary and vehicle are data-level (they refer to real
vehicles).

In SmartCity OS (post-M3), atoms are almost entirely data-level:
permit, work-order, vehicle, inspection, asset, parcel, sensor-reading,
citation, license, finding, code-section, outfall, lift-station,
person (citizen / inspector / applicant), document. Every one refers
to something real in Bastrop. The signed lineage discipline applies
to all.

In Empressa Land (post-M5), atoms are mixed: agreement, obligation,
payment, tract, well-site, royalty-split, party, document are
data-level. Intake-flow, briefing, and workflow atoms are app-level.

---

## Section 4 â The context interface

This is the section developers reference most. Everything about
Commitment 1 ("AI-accessible by default") is delivered through the
context interface.

### What it returns

When the AI needs to reason about an atom, it calls
`atom.contextSummary(scope)`. The return shape:

```ts
{
  prose: string,              // 1-3 sentence natural-language summary
  typed: {
    entityType: string,
    entityId: string,
    subtype?: string,         // e.g. "building-permit" under "permit"
    tenantId: string,
    status?: string,
    phase?: string,
    lastTouchedAt?: timestamp,
  },
  keyMetrics: Record<string, unknown>,
                              // typed fields the AI is likely to need
                              // without asking. Permit: daysInReview,
                              // assignedInspector, parcelId.
                              // Vehicle: odometer, fuelLevel, driver.
  relatedAtoms: AtomRef[],    // other atoms this one connects to
  historyProvenance: "native" | "backfill",
                              // whether history was recorded natively
                              // or reconstructed from source systems
                              // at atomization (see Section 7 of this
                              // doc, "Provenance tiering honesty")
  scopeFiltered?: boolean,    // true if the summary is restricted
                              // because caller doesn't have full scope
                              // (e.g. PII redacted from a citizen view)
}
```

### The four layers of the interface

**Layer 1 â Prose summary.**
One to three sentences in natural language. Generated from template
when the data is stable ("Permit #1234 is under review, 14 days since
submission, assigned to Inspector Morales."). May be model-generated
and cached for atoms with richer narrative history ("This work order
is a recurring pattern â 4 similar failures on Outfall O-12 in the
last 18 months.").

**Layer 2 â Typed classification.**
Shape stable across all atom types, content specific to the atom. The
AI can filter and route on typed fields without needing to parse
prose.

**Layer 3 â Key metrics.**
The fields the AI would otherwise ask about in a follow-up. A vehicle
atom pre-includes odometer, fuel level, driver. A permit atom
pre-includes parcel reference, inspector, days-in-review. Key metrics
are opinionated â they're what a human responding to a question about
this atom would include without being asked.

**Layer 4 â Related atoms.**
References to other atoms this one composes, references, or is
referenced by. The AI uses these to navigate the graph. A permit
links to its parcel, its findings, its review events, its applicant
person.

### Scope awareness

Every `contextSummary` call receives a `scope` parameter describing
the caller's authorization. The same atom may return different
summaries:

| Scope | Person atom prose might return |
|---|---|
| `inspector` | "Maria Morales, lead inspector for permit #1234, has 4 open assignments." |
| `clerk` | "Staff member, currently assigned to 4 work items." |
| `citizen-self` | "You have 3 open items with the city." |
| `public` | refuses or returns minimal "City staff" only |

The atom implements scope filtering internally. Consumers don't need
to think about it â they pass the scope, the atom decides what to
say.

### When context summary is cheap vs. expensive

Cheap: typed fields from the materialized view, prose from template.
Call synchronously on every AI query.

Expensive: model-generated narrative summary, especially for atoms
with large histories. Cache with short TTL; regenerate when the atom
receives a new event.

A rule of thumb: if the context summary takes longer than 100ms, it's
cached. The AI request path stays synchronous.

### Compile-time enforcement

`@hauska/atom-contract` defines `AtomRegistration<TType extends string>` as
a typed contract. An atom type that doesn't implement `contextSummary`
correctly doesn't compile. This is Commitment 1 enforced at the type
level, not by convention. Section 8 specifies the registration contract.

---

## Section 5 â The rendering model

Rendering is separate from the atom. An atom is a set of facts a
window can render in many forms. Five standard modes:

| Mode | Shape | When used |
|---|---|---|
| **inline** | Tappable reference in prose, glyph + label | AI mentions entity in a sentence |
| **compact** | One line â status + label + one key metric | Lists, side panels, composed children |
| **card** | Primary view, full key metrics, actions available | Main AI response surface |
| **expanded** | All fields, all related atoms accessible | "Tell me everything about this" |
| **focus** | Full canvas, thread embedded, entity is center of view | Deep work on one entity |

### The inline-reference format

The AI embeds references in prose using:

```
{{atom:entityType:entityId:display label}}
```

Example:
```
The {{atom:permit:1234:Permit #1234}} is assigned to
{{atom:person:maria-morales:Inspector Morales}}, who also owns the
open {{atom:work-order:WO-8871:stormwater work order}} at the same
parcel.
```

Rendering constraints enforced in the AI prompt:
- Max 3 inline atoms per response
- Only registered atom types with known IDs
- No invented IDs â the AI must have seen this atom in its context
- The sentence must read correctly if the markup is stripped

### The mode escalation ladder

User interaction drives mode transitions:

```
inline (tap) â card (expand) â focus (full canvas)
                              â expanded (all details)
```

And:

```
card (dismiss) â compact (child in a list)
               â inline (return to prose)
```

The AI chooses the initial mode based on query intent. A status
question ("Has permit 1234 been reviewed?") gets a card. A browse
question ("Show me all open permits") gets compact items in a list. A
deep-work request ("Work this permit with me") gets focus mode.

### The right-panel drill-in state machine

When an atom surfaces in chat and the user taps for detail:

1. **Ambient state.** Chat shows the card inline; right panel shows
   whatever was last there (conversational context).
2. **Focus-panel state.** Tapping the card opens the atom in the
   right panel in expanded mode. Chat thread continues visible.
3. **Atom-viewer state.** Tapping a related atom in the expanded
   view opens that child atom in a stacked right-panel layer. Parent
   stays visible in the panel above.
4. **Return.** A new conversational turn that isn't about this atom
   slides the right panel back to ambient.

Stack depth bounded at 3. Deeper than 3 atoms means the user has
navigated far enough that the thread should accept a new turn before
going further.

### Cinematography â transitions

Mode transitions are animated, not instant. The animations signal
relationship: an inline reference "grows" into a card as if the
reference expanded in place. A card "opens" into focus mode as if
the whole chat context zoomed into the atom.

Specific easing and duration specs live in the package docs
(`@hauska/atom-contract/docs/rendering/cinematography.md`) â preserved
from the `intelligence-interface-cinematography-v4_1.md` source.
Architectural point: transitions are a property of the rendering
model, not decoration. They're how the user keeps track of which
entity they're looking at as modes change.

### Windows compose atoms; atoms don't compose windows

A window is an application surface. Operations Dashboard is a window.
Citizen Portal is a window. Compass chat is a window. Each window
decides how it displays atoms on its surface â which modes are
available, what actions the window offers, how the window's navigation
treats the atom ladder.

An atom does not know which window it's rendered in. It provides its
five modes; the window picks the one that fits its surface. A map pin
window renders an atom compactly at pin scale, expanded on click. A
compliance report window renders atoms in cards or expanded mode
depending on the reader's depth of review.

The atom is reusable across windows. The window is not reusable â
each window is its own application surface with its own UX decisions.

---

## Section 6 â Composition

Atoms compose. A parent atom declares which atom types it contains or
references. When the parent renders, its children render inside it.

### The composition declaration

```ts
const PermitAtom: AtomRegistration<"permit"> = {
  entityType: "permit",
  composition: {
    parcel: { arity: 1, required: true },
    applicant: { arity: 1, required: true, atomType: "person" },
    findings: { arity: "many", atomType: "finding" },
    reviews: { arity: "many", atomType: "review" },
    assignedInspector: { arity: "0..1", atomType: "person" },
  },
  // ... other atom fields
};
```

Arity:
- `1` â exactly one
- `0..1` â zero or one
- `many` â zero or more

### Composition resolution

When an atom renders in card or expanded mode, the consuming window
can request that child atoms render inside it. The rendering pipeline:

1. Parent atom's card/expanded mode requests composition resolution.
2. Atom registry returns the child atom references (IDs, types).
3. Each child renders in compact mode inside the parent, unless the
   window requests a different mode (e.g. expanded wants child cards).

This is how a permit card shows a compact parcel reference, a compact
applicant reference, and a list of compact findings â all without the
permit atom knowing how parcel or finding atoms render.

### Shared atoms across windows

A single atom can be referenced from multiple windows. Permit #1234
is referenced from the Operations Dashboard, the CitizenConnect
applicant view, and the AI Plan Review inspector view. All three read
the same atom. All three write events that extend the same history.

This is the "one graph, many windows" property from the architecture
reference. Composition is the mechanism that makes it work â atoms
reference each other by ID; the registry resolves references
consistently across windows.

### Composition does not require containment

A permit references a parcel. A parcel is not contained in the permit
â it's referenced. The parcel exists independently with its own
lifecycle. The permit composition declaration is "this permit requires
one parcel to exist in the graph."

Ownership vs. reference:
- **Ownership** â parent atom creates the child when the parent is
  created (e.g. a permit's findings are owned by the permit).
- **Reference** â parent atom refers to a child that exists
  independently (e.g. a permit references a parcel that was registered
  by GIS long before any permit mentioned it).

The composition declaration distinguishes the two. Ownership implies
cascade-on-delete (when the permit is destroyed, its findings go with
it). Reference does not (the parcel survives every permit that ever
referenced it).

---

## Section 7 â The history layer

Two linked layers carry the atom's history.

### Semantic entity memory

Human-readable prose and structured facts about what has been
decided, observed, learned regarding this atom. Stored per-atom in
the `entity_memories` table (pending â the table does not yet exist
in Empressa Demo; Step 8A planned in old docs was never built).

Entity memory is curated, not raw. It's what a human colleague would
remember about the entity after working with it for a while â
patterns, context, things that don't fit in typed fields. The AI reads
entity memory to build prose summaries that go beyond template.

Examples:
- Permit atom memory: "Applicant responded quickly to first-round
  comments but went silent on the stormwater finding. Inspector
  Morales is awaiting a signed storm plan."
- Vehicle atom memory: "This truck had a transmission replacement in
  February; current odometer reading vs. service schedule suggests
  another service is due in 2 weeks."
- Person atom memory: "Maria is the lead inspector for commercial
  permits and the fallback for Jim when he's out. Prefers email over
  phone."

Memory is written by the AI after significant events, reviewed and
corrected by humans when wrong. It's the semantic layer â what the
system has learned about this atom.

### Cryptographic event chain

Append-only, hash-chained log of every event affecting the atom.
Written via `@hauska-sdk/core.EventAnchoringService`. Each event:

```ts
{
  eventId: uuid,
  atomId: "permit:1234",
  eventType: "state_change" | "observation" | "decision" | "comment" | ...,
  observedAt: timestamp,    // when the event really happened
  atomizedAt: timestamp,    // when the event entered the chain
  provenanceTier: "native" | "backfill",
  actor: { kind: "user" | "system" | "agent", id: string },
  payload: { ... },         // event-specific content
  prevHash: "sha256:..." | "GENESIS",
  hash: "sha256:...",       // of this event's content + prevHash
  signature: { ... },       // actor's signature
}
```

`verifyChain()` recomputes every hash in the chain for an atom and
detects any post-write tampering. First event uses `GENESIS` as
`prevHash`. Chain is per-atom (not global) â each permit has its own
chain, each vehicle has its own chain.

### The two layers working together

Semantic memory answers "what does the system know about this atom?"

Cryptographic chain answers "what provably happened to this atom, in
what order, by whom?"

The AI reads both when generating a context summary. The chain
provides the verified events; the memory provides the interpretive
layer on top.

If the memory is wrong (AI misunderstood a pattern, or a human marked
something as resolved that wasn't), correction is a new event in the
chain â a memory-correction event. The chain can't be rewritten, but
it can be extended with "the previous summary was wrong because X."

### Provenance tiering honesty

Events written natively (at the moment they happened) have
`provenanceTier: "native"`. Events reconstructed from source systems
at atomization have `provenanceTier: "backfill"`.

The context interface exposes `historyProvenance` so the AI (and
consumers) know which applies. External claim discipline: native
history is cryptographically verified from the event's real date;
backfill history is cryptographically verified from `atomizedAt`
forward.

A permit issued in 2019 and atomized in 2026 has a chain that starts
in 2026. The `observedAt` of its backfilled events is 2019 (copied
from MyGov), but no cryptographic proof exists that the events
happened in 2019 â only that they were atomized with those dates
in 2026.

This is a structural limit of hash chains. No engineering closes it.
The honest-claim discipline in [`10_ground_truth.md`](10_ground_truth.md)
handles the external messaging.

The strategic implications of this commitment â property as
first-class durable entity, the fabric framing, the long-term
moat structure â are detailed in
[`05_living_lineage_thesis.md`](05_living_lineage_thesis.md).
That doc is the strategic foundation; this section remains the
technical reference. Cross-stakeholder access mechanics that
make the lineage operational across surfaces are settled in
[`adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md).

---

## Section 8 â The registration contract

Every atom type registers against `@hauska/atom-contract` as an
`AtomRegistration`:

```ts
export interface AtomRegistration<TType extends string> {
  entityType: TType;
  
  // Identity
  idResolver: (rawRecord: unknown) => string;  // how to compute entityId
  cidBuilder: (content: unknown) => Promise<string>;
  
  // Context interface (Commitment 1)
  contextSummary: (
    entityId: string,
    scope: AuthorizationScope
  ) => Promise<ContextSummary>;
  
  // Rendering modes (5 required)
  render: {
    inline: (entityId: string) => InlineRenderSpec;
    compact: (entityId: string) => CompactRenderSpec;
    card: (entityId: string) => CardRenderSpec;
    expanded: (entityId: string) => ExpandedRenderSpec;
    focus: (entityId: string) => FocusRenderSpec;
  };
  
  // Composition
  composition: {
    [slot: string]: CompositionDeclaration;
  };
  
  // History (Commitment 2)
  isDataLevel: boolean;  // true = VDA-backed + anchored; false = app-level
  eventTypes: string[];  // event types this atom accepts
  
  // Governance
  tenantScoped: boolean;  // almost always true
  retentionPolicy: RetentionPolicy;
  piiFields: string[];    // fields that require scope filtering
}
```

### Compile-time enforcement

TypeScript's type system enforces the contract at build time:
- `contextSummary` missing â compile error
- `render.focus` missing â compile error
- Composition referencing an unregistered atom type â compile error
- `isDataLevel: true` without `cidBuilder` â compile error
- `piiFields` non-empty without corresponding scope handling â compile
  error

The package exports `registerAtom<TType>(registration)` which
validates the contract before returning. Registrations that fail
validation throw at startup, not in production.

### Registration is global, not per-window

An atom type registers once for the whole system. SmartCity OS
registers `permit`, `work-order`, etc. Empressa Land registers
`agreement`, `obligation`, etc. Each product owns its own atom type
namespace; cross-product atom-type collisions are not allowed.

### Atom catalog per product

The full list of registered atom types per product is the **atom
catalog**. SmartCity OS's catalog is authored at M3.5 (planned to land
as `35_smartcity_atom_catalog.md` in this docs repo when M3.5 ships;
pre-docs-repo material may exist as `41a_smartcity_atom_catalog.md`).
Empressa Land's at M5 (planned, no docs repo home yet â Empressa Land
is post-M5 and not currently in active development; pre-docs-repo
material may exist as `22a_empressa_land_atom_catalog.md`).

The catalog is versioned. v1 is what ships at cutover; v1.1, v1.2
evolve through explicit migration. Schema changes to an atom type
are modeled as events (migration-as-event pattern) so the chain of
changes is verifiable.

---

## Section 9 â The AI as gateway

**Users never address atoms directly.** They don't know entity IDs,
don't browse atom registries, don't think in terms of types. They
speak, and the AI resolves their intent to the right atom.

### The flow

```
User speaks â AI classifies intent â AI curates atom context â
  AI responds with atoms inline â User interacts with surfaced atoms
```

Steps:

1. **User speaks.** "What's happening with the Morales permit?"
2. **AI classifies intent.** INFORM (status query). Known entities
   named: "Morales" (ambiguous), "permit" (atom type). Implicit
   tenant: the current session's tenant.
3. **AI curates atom context.** Resolves "Morales" against the person
   atoms in the tenant's graph. Finds one match: Maria Morales,
   inspector. Queries for permit atoms associated with Maria Morales
   as applicant OR inspector. Returns matched permits' context
   summaries.
4. **AI responds.** Generates prose referencing the resolved atoms
   inline: "Maria is inspector on permit #1234 and applicant on
   permit #1540. Permit #1234 is under review; permit #1540 closed
   last week."
5. **User interacts.** Taps permit #1234 to drill into the card.

The atom registry is invisible infrastructure. The user's experience
is conversation.

### Multi-agent routing (Compass V4)

Empressa Demo today runs a single AI call per message. Compass V4
(SmartCity OS's version, post-M3) will route by intent:

- **INFORM** â single AI call; returns prose + atom references +
  events
- **GENERATE** â two calls; planner decides what to make, writer
  produces content without JSON cage
- **ACT** â tool-only; no prose; hits ConfirmationCard directly

Full multi-agent routing spec lives in `44_smartcity_compass_v4_spec.md`
(pre-docs-repo, pending migration; the `intelligence-interface-vision-v4.md`
content moved there since it's Compass-specific, not atom-specific).

Atom-facing points: the context interface is called in all three
paths. INFORM reads atoms. GENERATE writes content that may reference
atoms. ACT writes events to atoms' histories. The atom contract
doesn't care which path is calling it.

### What the AI never does

- Invent atom IDs
- Reference atoms the user hasn't been shown or couldn't plausibly
  know about
- Expose PII fields that the caller's scope doesn't permit
- Mirror an atom's data into a prompt-assembled summary when the
  atom's own `contextSummary` is the authoritative source
- Bypass the registration contract (render an unregistered type, or
  render it in a mode the type doesn't declare)

These are enforced by the prompt, by the atom contract, and by
runtime checks on AI-emitted content (the `{{atom:type:id:label}}`
markup is validated before rendering).

---

## Section 10 â Anti-patterns

| Anti-pattern | Why it violates the architecture |
|---|---|
| Publishing the atom contract as `@hauska-sdk/atom` (folded inside the SDK family) | The atom contract is a peer Hauska substrate, not a sub-package of the SDK. Folding it inside `@hauska-sdk/*` forces every MCP server and product to take a transitive dependency on the entire SDK commerce substrate (x402, USDC on three chains, ethers v6, Circle, BIP39 wallets) just to register an atom type. Per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md), contract package is `@hauska/atom-contract`, sibling to `@hauska-sdk/*`. |
| Registering an atom type without `contextSummary` | Commitment 1 enforcement is the whole point. |
| Registering an atom type without all 5 render modes | Rendering model requires the full spectrum so windows can pick. |
| Hardcoded context summaries (stub strings) | The vehicle atom in Empressa Demo is the current live example â scheduled for fix. |
| Writing an atom's state directly without emitting an event | Breaks the history chain. All state changes are events. |
| Storing atom content in the application DB instead of addressable storage | Breaks portability. Content is CID-addressable; DB holds references, not payload. |
| Application logic that reads atom internal fields instead of calling `contextSummary` | Breaks the AI-uniformity property. The context interface is the read API. |
| Cross-tenant atom references without explicit audit | Tenancy is enforced at the registry level. |
| Rendering an atom outside its declared render modes | Windows compose atoms; they don't invent rendering for atoms. |
| Having the AI render atom data without the `{{atom:type:id:label}}` markup | Breaks the user's drill-down path. |
| Fabricating history entries for backfilled atoms | Use `provenanceTier: "backfill"` and, when timestamps are unrecoverable, a single "imported state" event. Never invent event dates. |
| An atom type whose `piiFields` are declared but not scope-filtered in `contextSummary` | Commitment 1 + privacy violation. |
| Schema changes to an atom type that aren't modeled as events | Breaks chain integrity. Migration is an event. |
| Removing an atom from the graph by DB delete | Destruction is an event. The chain retains the destruction event. |

---

## Section 11 â Glossary and package surface

### Glossary

| Term | Definition |
|---|---|
| **Atom** | The smallest addressable entity. Carries identity, context interface, composition, and history. |
| **`@hauska/atom-contract`** | The npm package defining the atom contract and registration pattern. Hauska commercial substrate, peer to the Hauska SDK. Renamed from `@empressaio/atom` on 2026-05-18 per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md); current workspace-private staging is `@workspace/empressa-atom` in legacy-design-tools. |
| **Data-level atom** | Atom referring to a real-world entity. VDA-backed. Cryptographically anchored history. |
| **App-level atom** | Atom referring to a workflow container. No VDA. No anchored history. |
| **Context interface** | The atom's method that returns a structured self-description for AI consumption. |
| **Context summary** | The output of calling `contextSummary(scope)` on an atom. Prose + typed + key metrics + related atoms + provenance tier. |
| **Composition** | An atom's declaration of which other atom types it contains or references. |
| **Rendering mode** | One of inline / compact / card / expanded / focus. Every atom implements all five. |
| **Atom registration** | The typed contract an atom type fulfills to be part of the graph. Enforced at compile time. |
| **Atom catalog** | The full list of registered atom types for a product. Versioned. |
| **Atom registry** | The runtime service that holds atom registrations and resolves references. |
| **Entity memory** | Semantic layer of an atom's history â curated prose and structured facts the system has learned. |
| **Event chain** | Cryptographic layer of an atom's history â append-only, hash-chained, signed events. Written via `@hauska-sdk/core.EventAnchoringService`. |
| **Provenance tier** | `"native"` (event recorded as it happened) or `"backfill"` (reconstructed from source systems at atomization). |
| **Living lineage** | The accumulated, verifiable, portable history an atom carries. Founding principle of the architecture. |
| **Window** | An application surface. Renders atoms. Does not own atoms. |
| **VDA** | Verifiable Data Asset. Hauska SDK primitive (`@hauska-sdk/vda`) that wraps data-level atoms with ownership + access-pass semantics. Does not own the hash chain (that's `@hauska-sdk/core`). |

### Package surface (planned v1.0.0)

```
@hauska/atom-contract
âââ /core
â   âââ registerAtom<TType>(registration)
â   âââ AtomRegistry
â   âââ ContextSummary
â   âââ AuthorizationScope
â   âââ CompositionDeclaration
âââ /render
â   âââ InlineRenderSpec
â   âââ CompactRenderSpec
â   âââ CardRenderSpec
â   âââ ExpandedRenderSpec
â   âââ FocusRenderSpec
â   âââ renderAtom(atom, mode)
â   âââ parseInlineMarkup({{atom:type:id:label}})
âââ /history
â   âââ EventEmitter (writes events via @hauska-sdk/core)
â   âââ EntityMemory (semantic layer)
â   âââ HistoryProvenance type
âââ /testing
â   âââ MockAtomRegistry
â   âââ AtomRegistrationContractTests
â   âââ RenderingSnapshotTests
âââ package.json (pinned peer: @hauska-sdk/core, @hauska-sdk/vda)
```

### Version policy

- **Patch (x.y.Z)** â bug fixes, internal refactors, no API change
- **Minor (x.Y.0)** â new optional fields in registration, new helper
  functions, new render mode flags (but not new required modes)
- **Major (X.0.0)** â required contract changes. Every consuming
  product (SmartCity OS, Empressa Land, Empressa Company Intelligence)
  must co-bump.

Major version bumps are coordinated events. The upgrade guide
([`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md)) is versioned
alongside.

### Licensing and publication

Current decision (OPEN Q4 in `04_strategic_conversation_record.md` â
pre-docs-repo, pending migration): proprietary, internal to the
Hauska Inc. and Empressa product surfaces only. Published to npm under
the `@hauska/` scope (specifically `@hauska/atom-contract` per
[ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md)) but not
marketed externally. Licensing decision deferred.

If publication shifts (e.g., third-party vertical app builders want to
consume it), the license decision reopens. Until then,
`@hauska/atom-contract` is internal-to-portfolio infrastructure even
though it lives on npm. Brand-placement rationale: the atom contract
is Hauska commercial substrate, peer to the Hauska SDK; the
`@hauska/` namespace matches the substrate layer rather than the
product brand that consumes it.

---

## Version history

- **v1 (2026.04.18)** â Initial canonical version. Consolidates six
  prior source documents. Renames "Hauska Atom" â "Empressa Atom"
  throughout per the v1.3 structural correction. Anchoring attribution
  moves from `@hauska-sdk/vda` to `@hauska-sdk/core.EventAnchoringService`
  consistently. Five render modes, context interface with scope
  awareness, composition with arity declarations, and the two-layer
  history model (semantic + cryptographic) are the stable architecture.
  The multi-agent Compass routing content was moved to
  `44_smartcity_compass_v4_spec.md` since it's a SmartCity-specific
  window concern, not an atom concern.

- **2026-05-05 (docs-repo migration)** â Migrated to `doc_repo` as
  `25_atom_architecture_reference.md`. Frontmatter added. Cross-references
  updated: companion upgrade guide reference becomes
  [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md); state-of-reality
  reference becomes [`10_ground_truth.md`](10_ground_truth.md);
  atom-catalog references annotated as planned future docs;
  remaining pre-docs-repo references (`44_smartcity_compass_v4_spec.md`,
  `04_strategic_conversation_record.md`) flagged with status pending
  their own migrations. Architecture decision captured separately in
  [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md);
  this doc retains the full spec depth. Architecture content unchanged
  from v1 â the eleven sections, the registration contract, the
  composition mechanics, and the package surface are stable.

- **2026-05-18 (package rename per ADR-018)** â Package name changed
  from `@empressaio/atom` to `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md).
  Atom contract is Hauska commercial substrate, peer to the Hauska SDK,
  not Empressa product. Eleven in-body references swept. Title, H1,
  Section 8 opening, Section 4 enforcement reference, Section 5
  cinematography reference, Glossary row, Section 11 package surface
  tree, and Section 11 licensing paragraph all rewritten. Owner line
  restated as Hauska Inc. commercial substrate. Section 10 anti-pattern
  reframed (publishing the contract as `@hauska-sdk/atom` is the
  anti-pattern; the contract sits as a peer Hauska substrate). Historical
  v1.3 ownership-correction note (lines 40â46 in prior revision) preserved
  with an adjacent supersession callout pointing at ADR-018. Architecture
  content otherwise unchanged.
