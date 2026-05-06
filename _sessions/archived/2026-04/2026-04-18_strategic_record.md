---
id: 2026-04-18_strategic_record
title: Strategic Conversation Record (April 2026 archived snapshot)
status: archived
last_updated: 2026-05-05
applies_to: portfolio
archived_from: 04_strategic_conversation_record.md
---

# Strategic Conversation Record â archived snapshot (April 18, 2026)

> **Archived snapshot.** This document was the synthesis of the April
> 2026 strategic planning arc. It has been preserved here verbatim
> from below the line; live items extracted into focused docs in the
> active docs repo on 2026-05-05.
>
> **Live extractions:**
>
> | Source section | Extracted to | Status |
> |---|---|---|
> | Part 1 (Architecture, atom, four commitments) | [`80_adrs/adr_001_atom_architecture.md`](../../../80_adrs/adr_001_atom_architecture.md) + [`25_atom_architecture_reference.md`](../../../25_atom_architecture_reference.md) | Migrated 2026-05-05 |
> | Part 2 (Competitive positioning vs Foundry / municipal incumbents) | [`30_smartcity_os.md`](../../../30_smartcity_os.md) Strategic frames + Tyler positioning | Partially absorbed; live competitive content remains in this archive |
> | Part 3 (Commercial model â two entities, two revenue books) | OPEN â not yet migrated; live items tracked in [`11_roadmap.md`](../../../11_roadmap.md) open commercial questions |
> | Part 4 (Failure modes â 8 named + 2 surfaced April 18) | [`13_risk_register.md`](../../../13_risk_register.md) | Migrated 2026-05-05 |
> | Part 5 (Positioning claims) | Two-entity claim referenced in product home docs; full claim set remains in this archive | Partially absorbed |
> | Part 6 (Team / second customer / reference implementation) | Multi-agent section absorbed into [`21_ai_first_dev_flow.md`](../../../21_ai_first_dev_flow.md); second-customer + reference-implementation thinking remains in this archive | Partially absorbed |
> | Part 7 (Documentation set) | Outdated â superseded by docs repo structure | Retired |
> | Part 8 (Open questions) | Pending fold into [`11_roadmap.md`](../../../11_roadmap.md) P2/P3 entries | Pending migration |
> | Part 9 (Leading indicators watch list) | [`17_leading_indicators.md`](../../../17_leading_indicators.md) | Migrated 2026-05-05 |
> | Part 10.1 (Velocity baseline) | Partially absorbed into [`23_dev_setup_assessment.md`](../../../23_dev_setup_assessment.md) | Partially absorbed |
> | Part 10.2 (Pricing strategy framework) | [`15_pricing_framework.md`](../../../15_pricing_framework.md) | Migrated 2026-05-05 |
> | Part 10.3 (Pitch discipline) | Referenced from `15_pricing_framework.md`; full content remains in this archive | Pending decision |
> | Part 10.4 (Parcel Intelligence as prerequisite to AI Plan Review) | Settled ADR; referenced in [`30_smartcity_os.md`](../../../30_smartcity_os.md) and [`40_design_accelerator.md`](../../../40_design_accelerator.md) | Absorbed |
> | Part 10.5 (Property Intelligence as UX container) | OPEN â not yet migrated | Pending |
> | Part 10.6 (Customer engagement doc structure) | OPEN â not yet migrated | Pending |
> | Part 10.7 (Phase 0 engagement reconciliation) | Subsumed by general engagement-identity work (A04.7 fix); see [`40_design_accelerator.md`](../../../40_design_accelerator.md) and Sprint A04.7 history in repo | Subsumed |
>
> **Why archived rather than retired:** several Parts (3, 5 partial, 6
> partial, 10.3, 10.5, 10.6) contain live content that hasn't been
> migrated yet. Archiving rather than retiring preserves access until
> those migrations happen. When all live Parts are extracted, this
> file moves to fully retired status.
>
> **Path is `_sessions/archived/2026-04/`** â preserves the
> session-style audit trail per [`01_doc_conventions.md`](../../../01_doc_conventions.md).

---

# Strategic Conversation Record

**Date:** April 18, 2026
**Authorship:** Legacy Group ATX LLC. Integrates positions from Legacy's
Strategic Gap-Close Brief of April 18, 2026 plus corrections from the
corporate-structure and SDK-verification passes of the same date.
**Purpose:** A single document capturing the strategic thinking
developed across the April 2026 planning arc, integrated with the
gap-close positions and the April 18 audit/verification findings.
Reference artifact alongside the Four Commitments, Architecture
Reference, and State-of-Reality Brief.

Those three describe *what* Legacy's products are and *where* they
are. This document records *why the strategy looks the way it does*
and *what was considered and rejected* in arriving there.

---

## How to read this document

Structured so sections can be referenced independently.

- **Part 1** â architectural thinking: thesis, atom, distinctive bundle.
- **Part 2** â competitive positioning: Foundry and municipal
  incumbents.
- **Part 3** â commercial model per the gap-close brief, adjusted for
  the Hauska-Inc-separate-entity structure and COGS relationship.
- **Part 4** â named failure modes and leading indicators.
- **Part 5** â positioning claims being made, with the inter-entity
  reinforcement of Commitments 2 and 4 named explicitly.
- **Part 6** â secondary strategic angles: team scaling, second
  customer, reference-implementation relationship.
- **Part 7** â documentation set this conversation produced.
- **Part 8** â open questions carried forward.
- **Part 9** â leading-indicators watch list.

Open questions are marked **OPEN** and named explicitly. A strategy
document that marks its open questions is stronger than one that papers
over them.

---

# Part 1 â The Architecture

## The thesis

Every enterprise software platform eventually becomes the thing its
customers cannot leave, cannot audit, and cannot trust to stay out of
their way. The pattern is consistent because it is structural â
expansion revenue demands the platform absorb more of the data estate,
renewal math demands switching costs, quarterly growth demands feature
surface area which demands replacing adjacent systems of record. Every
regulated buyer in 2026 is shopping with scar tissue from it.

Legacy Group is building the inverse. A platform whose moat is that it
refuses to do the things that create those scars. AI-accessible by
default, verifiable by default, integrative by default, portable by
default. Hard to duplicate not because the technology is exotic but
because the commitments are commercially uncomfortable.

That is Legacy's product thesis. The atom is how. The four commitments
are why.

**A structural corollary.** Two of the four commitments (verifiable
and portable) are delivered by infrastructure owned by Hauska Inc., a
separate C-corp from Legacy Group. Legacy consumes Hauska SDK as COGS.
This is not an internal transfer â it is a real vendor relationship
between two companies Nick owns. The separation is load-bearing for
the commitments themselves: customers can verify Commitment 2 and
exercise Commitment 4 without Legacy's cooperation, because the
substrate belongs to a different company. No single-entity platform
can offer this.

## The atom

An atom is a registered entity that carries, by virtue of being
registered, four things bundled into a single registration contract:

1. **Context interface** â a callable method that returns a structured
   self-description for AI consumption.
2. **Visual interface** â rendering across a five-mode spectrum (inline,
   compact, card, expanded, focus) chosen by the AI based on context.
3. **Composition** â declared child atom types the entity contains.
4. **History** â a semantic layer (entity memory: what's been decided,
   observed, learned) combined with a cryptographic layer (VDA proof
   chain), written through `@hauska-sdk/core.EventAnchoringService`.

Two categories exist: **data-level atoms** (real-world entities â permits,
vehicles, sensor readings, work orders) and **app-level atoms**
(workflow containers â sprint boards, briefings, deadline rails).

Documents and data are represented as the same kind of atom. A plan
submittal is an atom. A code section is an atom. A finding is an atom.
They go through the same registration contract and expose the same four
layers as permit atoms or vehicle atoms.

**Atom ownership.** The atom concept, registration contract, and
interface pattern live in `@empressaio/atom` â Empressa's product,
Legacy-owned. Hauska SDK does not know about atoms. The dependency
arrow points Empressa â Hauska, never reverse. This is a deliberate
corporate-architecture split: Hauska's moat is infrastructure,
Legacy's moat is intelligence layered on that infrastructure.

## What makes the atom architecturally distinctive

The atom is not a novel invention. The concept space â addressable
typed entity with composition and history â is well populated across
twenty years of enterprise software. What is specific is the bundling,
reinforced by the corporate structure that makes the commitments
credible.

### Against Foundry objects

A Foundry object has typed properties, declared link types, primary
key, AI access configured through AIP. Rendering is external (Workshop
consumes objects). History is via global pipeline lineage, not carried
on the object.

Practical difference: if you strip a Foundry object out of Foundry,
you have a typed record. If you strip an atom out of Legacy's products,
you still have an entity that knows how to describe itself to an AI,
knows how it wants to be rendered, knows what it contains, and carries
its own history. The atom is self-contained in a way a Foundry object
isn't.

That is the specific axis of difference. Not "has AI access" versus
"doesn't" â "AI access is a property of the object" versus "AI access
is a property of the platform wrapping the object."

### Against other comparables

- **Salesforce records** carry page layouts (some rendering) and have
  Einstein integration (external AI layer).
- **ServiceNow CIs** treat change history as first-class â closest
  comparable on the history axis. No rendering contract, no AI
  self-description method, no cryptographic provenance.
- **Bentley iTwin elements** have strong cryptographic properties via
  iModels changesets. Closest on the provenance axis. No AI contract,
  no multi-mode rendering, infrastructure-specific.
- **Knowledge graph nodes** (Neo4j, Stardog, TigerGraph) have typed
  properties and relationships. Everything else is external.
- **Notion/Coda blocks** unify documents and structured content under
  one type system. No AI contract, no cryptographic provenance, no
  composition with non-document entities.

### The distinctive bundle

> An atom bundles four properties â a context interface for AI, a
> five-mode rendering spectrum, a declared composition, and a history
> layer combining semantic entity memory with cryptographic VDA chain â
> as a single registration contract. Documents and data are the same
> kind of atom, registered through the same contract, exposing the
> same four layers. Foundry objects, Salesforce records, ServiceNow
> CIs, iTwin elements, and knowledge graph nodes each overlap with
> one or two of these properties, but none bundle all four as a
> registered contract on the entity itself. The difference is not that
> the individual properties are exotic â most exist somewhere â it is
> that the bundle is treated as intrinsic to being an atom, rather
> than layered on afterward.

A defensible architectural claim. It acknowledges what is precedented
and names what is specific.

**Important caveat.** This claim is true today of Empressa Demo, where
the registration contract is enforced and the four layers run with
`ATOM_CONTEXT_V2=true` confirmed in production shared env. It is not
yet true of SmartCity OS, which is mid-migration onto this architecture
(atom catalog not yet specified, backfill not yet begun). External use
of this claim requires stating the demonstration venue honestly.

## The four commitments

The atom is the mechanism. The four commitments are the reason the
mechanism exists, and the reason the combination of mechanism and
commitments is hard for a competitor to duplicate.

**1. AI-accessible by default.** Every entity in the graph exposes a
context interface the moment it exists. No per-object configuration,
no authoring step. Delivered by `@empressaio/atom`. Enforced at the
type level â registrations failing the contract fail compilation.

**2. Verifiable by default.** Every event that changes state is
recorded in an append-only, hash-chained log. The log is the source
of truth. Materialized views are caches on top. Delivered by
`@hauska-sdk/core.EventAnchoringService`.

*Architectural correction (v1.3 of ground-truth, April 18):* prior
docs attributed this primitive to `@hauska-sdk/vda`. Code reality
puts it in `@hauska-sdk/core`. VDA handles minting + access passes +
ownership; core handles hash-chain primitives. Corrected throughout
the doc set.

**3. Integrative by default.** The platform is an observation and
intelligence layer. Systems of record stay authoritative. No
write-back to control systems, no displacing the permitting database,
no becoming the source of truth for anything that already has one.

**4. Portable by default.** Customers can export the full state of
their tenant, including the anchored event log, in a format a
successor operator could use to continue the ledger. Schemas are
open. Content is content-addressed. Pinning is available on
customer-controlled nodes. Verification of the chain does not require
Legacy's or Hauska's API. Delivered by `@hauska-sdk/adapters-ipfs-cluster`
+ `@hauska-sdk/vda` + export primitives.

The moat is not any one of these commitments. It is the combination,
held consistently across every product decision, applied to a vertical
where no incumbent offers any of them â and **reinforced by the
corporate split** that makes Commitments 2 and 4 enforceable against
Legacy itself because the infrastructure primitives are delivered by
a separate company.

---

# Part 2 â Competitive Positioning

## Against Palantir Foundry

Foundry is the closest architectural comparable and the most common
reference point in strategic conversations. It is also not a direct
competitor in Legacy's market.

### Feature-level comparison

| Axis | Foundry | Legacy Group products (SmartCity OS, Empressa) |
|---|---|---|
| Core abstraction | Ontology (objects, links, actions) | Atoms (data-level, app-level) with four-layer contract |
| AI access | AIP configured per object type | Context interface intrinsic to every atom |
| Provenance | Rich lineage, auditable, not cryptographic | Hash-chained anchoring primitive exists in `@hauska-sdk/core`; integration into vertical apps pending M6 |
| Writeback posture | Actions write back to source systems | One-way from control systems; never SoR for existing SoR |
| Ingestion | Pipeline Builder, heavy transformation, full normalization | Six named patterns, normalized envelope, source-fidelity payload |
| Application layer | Workshop, Slate, Quiver â rich authoring | Windows with five render modes; no customer-facing authoring |
| Governance | Markings, Projects, purpose-based access â mature | Tenant scoping, scope-aware context interface, correction-as-event |
| Deployment economics | Quarters to years, seven-figure pricing | Weeks, per-city pricing fit to small-city budgets |
| Target market | Defense, intelligence, Fortune 500 | Small and mid-size municipalities |
| Maturity | Battle-tested at scale | Early; one production deployment |
| Corporate structure | Single entity (Palantir) | Two entities (Hauska Inc. + Legacy Group) with infrastructure commitments enforceable across the split |

### Strategic read

Foundry wins on maturity, authoring surface, AI platform depth,
governance, and scale proof points. A Foundry pilot ships working AI
agents over a unified ontology today. Legacy will not match that
product surface in this planning horizon.

Legacy's products differentiate on integration-as-architectural-commitment,
per-event anchoring as first-class property (with substrate
separation across two legal entities), vertical-tuned regulatory
posture for municipal operations, and a price point reaching cities
Palantir will never call on.

The honest positioning: **Legacy is not a Foundry competitor. Foundry
does not sell to Bastrop.** SmartCity OS is what a Foundry-shaped
platform looks like when the buyer is a city of 15,000, the regulatory
perimeter is wastewater, and the thesis is that the permitting system
doesn't get replaced.

### Where to exceed vs. match vs. skip

**Exceed (asymmetric advantages):**
- Verifiable provenance as a product (once M6 ships)
- AI-native by default (context interface as primitive, active today
  in Empressa Demo)
- Portability, with inter-entity reinforcement
- Deployment economics (weeks not quarters)

**Match as table stakes:**
- Geospatial depth
- Document extraction
- Governance (tenancy, audit, retention, redaction)
- Time-series for telemetry
- SDK ergonomics and agent eval

**Skip:**
- Customer-facing pipeline builders, dashboards, and app authoring
- General connector marketplace
- ML platform features
- Geospatial analysis UI beyond what PostGIS + existing map surface gives
- Time-series analytics from scratch

Aim, condensed: *be the platform where every entity is AI-accessible
by default, every event is cryptographically verifiable, every
customer can leave, and every deployment is measured in weeks.*
Foundry can match maybe two of those four without rearchitecting.
Neither Foundry nor any incumbent can match the inter-entity
structural reinforcement, because they are single entities. That is
the lead.

## Against municipal incumbents

The realistic comparables are Tyler Technologies, Accela, CentralSquare,
and OpenGov. These are suite-replacement vendors selling workflow
products with conventional databases underneath.

None offer unified entity graphs, AI-accessible semantics, or
cryptographic provenance. The gap is large enough that the four
commitments each read as differentiators without requiring feature
parity debates.

The commercial tension against incumbents is not technical capability;
it is familiarity, reference base, and procurement inertia. They win
deals because the buyer's peer city already uses them. Legacy wins
deals where the buyer is actively trying to escape incumbent lock-in,
or where a champion like Sylvia Carrillo will personally vouch for a
different approach.

---

# Part 3 â Commercial Model

Positions in this section integrate Legacy Group's Strategic
Gap-Close Brief of April 18, 2026 and the corporate-structure
correction that followed.

## The thesis of the revenue model

The four commitments rule out specific enterprise tactics: expansion
revenue through data-estate absorption, switching-cost moat as primary
strategy, rip-and-replace upsell. They do not rule out recurring
subscription revenue, usage-based infrastructure revenue, or services
revenue.

The commercial model is built on those three across two entities with
different revenue profiles.

## Two entities, two revenue books

### Hauska Inc. (Hauska SDK â B2D)

- **Product.** `@hauska-sdk/*` npm packages. Developer-market target.
- **Revenue.** Pre-revenue. Pricing model open (free-tier metric,
  paid-tier metric, license model, npm registry choice, whether
  managed IPFS cluster is a separate SKU â all undecided).
- **Customer.** Zero paying developer customers. Internal-facing
  consumption by Legacy's products today.
- **Relationship to Legacy.** Service provider. Hauska invoices
  Legacy (or takes internal transfer pricing) for SDK consumption.
  Legacy reports Hauska SDK as COGS.

### Legacy Group ATX LLC (two product brands â B2B SaaS + B2B SaaS)

This is today's actual revenue.

- **SmartCity OS** â per-city subscription. One live paying customer:
  City of Bastrop, TX. PSA signed March 2026. Contract covers
  Operations Dashboard today; CitizenConnect, AI Plan Review, and
  Digital Twinning are in scope for Phase 2.
- **Empressa Land** â $500/month flat, unlimited users, up to 500
  agreements. No customers yet. Target ARR at 100 customers is $600K.
  Direct sales, not channel.
- **Empressa Company Intelligence** â internal Legacy Group workspace.
  Not a product. No revenue.

**Atom as COGS.** `@empressaio/atom` is an Empressa product inside
Legacy. SmartCity OS and Empressa Land both consume it. The internal
transfer pricing from Empressa â SmartCity / Empressa Land is COGS
on those P&Ls. This is internal to Legacy Group; externally it just
reads as Empressa being a shared product line.

### Within-account expansion â the four-level twin ladder

This is the structural realization of the inverted pyramid. Customers
grow into higher layers as they see value. Not mandatory. Not bundled.

| Twin level | Revenue layer | What the customer pays for |
|---|---|---|
| L0 / L1 | Platform subscription | Base SmartCity OS, asset registration, document layer, Compass, provenance chain |
| L2 | IoT services | Sensor hardware + data management + anomaly/ML |
| L3 | Premium twinning | Magma license or custom Revit modeling for specific buildings |
| Cross-layer | Plan review | Standalone module or included â not decided |
| Cross-layer | Developer SDK | Hauska Inc. revenue, usage-based, if/when productized |

## How the revenue model answers the load-bearing question

*"How does this make money without the standard enterprise moats?"*

Recurring base subscription is the floor. ARPU grows through the
four-level twin progression inside each account â sensors, ML, premium
modeling, plan review â not through absorbing adjacent systems. The
acquisition motion is peer-network referral (TCMA, ICMA, Women City
Managers, Sylvia directly), not outbound enterprise sales.

The bet: a high-quality, integration-friendly platform with a per-city
starting price that fits a small-city budget, and an ARPU expansion
path that doesn't require re-selling, can get to meaningful ARR faster
than an incumbent-style moat strategy because sales cycles collapse
when the platform doesn't force migration.

This is a credible bet. It is not yet a proven bet.

## OPEN â Commercial model decisions carried forward

1. **Per-city price envelope for deal #2.** Bastrop's PSA number is
   not stated and it is unclear whether current pricing is the model
   or founder-customer concession. *Owner: Valerie.*
2. **Services vs. platform revenue on Bastrop.** Whether Legacy Group
   is taking services revenue on Bastrop in addition to or instead of
   platform license is the single most important commercial question
   for the next six months and is not answered in writing.
   *Owner: Valerie + Nick.*
3. **Hauska SDK pricing model.** Free tier metric (VDAs minted? CIDs
   sealed? API calls?), paid tier metric, license model (MIT / Apache /
   BSL / commercial), npm registry choice, whether managed IPFS cluster
   is a separate SKU. All open. *Owner: Nick.*
4. **`@empressaio/atom` commercial posture.** Current decision:
   proprietary, internal to Legacy's products only, licensing deferred.
   Revisit when/if a third-party vertical app builder wants to consume
   it. *Owner: Nick.*
5. **Plan review â module or bundle?** Unresolved. *Owner: Nick +
   Valerie.*
6. **Tenth-deal economics.** Not modeled. *Owner: Valerie.*
7. **Hauska â Legacy formal service agreement.** Today the relationship
   is implied (Nick owns both). Externally the claim "Hauska SDK is
   delivered by a separate entity" is stronger if there is a written
   services agreement or license agreement. Low urgency; real before
   any external investor conversation. *Owner: Nick + Valerie.*
8. **Hauska Inc. GitHub org migration.** Today `hauska-sdk` sits in
   `empressaioemail-tech` GitHub org. Should move to a Hauska-owned
   org to make the corporate boundary legible to external developers
   and to future investors. *Owner: Nick, operational.*

---

# Part 4 â Failure Modes and Leading Indicators

A thesis that cannot name its own failure modes is not a strategy.

## The eight named failure modes

**1. AI-native access becomes a commodity.** If Claude/GPT/Gemini get
good enough at structured retrieval over raw databases and document
stores that an external agent can reason about a city without
platform-level atom scaffolding, the AI-accessibility advantage
evaporates.

*Leading indicator:* a general-purpose agent framework shipping an
auto-discovering municipal integration that hits MyGov, Samsara, GoTo,
and ArcGIS with no custom wiring.

**2. Cryptographic provenance turns out not to be a purchase
criterion.** Municipal buyers may care about it in principle and be
unwilling to pay for it in practice. If the VVater DPR compliance
narrative is the only place the provenance story produces dollars,
and subsequent cities evaluate Legacy on the criteria they use for
Tyler/Accela, then hash-chain anchoring becomes a cost center being
maintained rather than a differentiator closing deals.

*Leading indicator:* Bastrop's peers cite features and references but
don't weight the provenance chain in their selection scoring.

**3. "Good enough integration" beats "integration-first."** Tyler,
Accela, and CentralSquare retrofit integration-over-replacement as a
posture rather than a discipline; customers pick familiar + acceptable
over differentiated + unfamiliar.

*Leading indicator:* an incumbent announces a "platform mode" that
promises to leave existing systems in place and adds a command surface
on top.

**4. Portability is theoretically valuable but never exercised.** No
customer ever exports their atom graph to another system. The
living-lineage argument is doing architectural work being paid for
without buyers noticing.

*Leading indicator:* customer interviews reveal portability is "nice
to know" and never the decisive factor.

**5. Single-customer risk.** Bastrop is everything. If Sylvia leaves,
the council changes posture, or the relationship sours on operational
trust, Legacy loses its anchor reference.

*Leading indicator:* churn signals from Sylvia (pre-budget season
pushback, staff cycling out, loss of executive sponsor).

**6. The architectural discipline becomes a velocity tax.** Refusing
standard enterprise moats, refusing rip-and-replace, refusing to absorb
data estates â each refusal costs velocity relative to competitors
who do those things. A lightly-funded competitor ships "less correct
but good enough" faster and hits distribution before Legacy hits its
second customer.

*Leading indicator:* a pre-revenue competitor reaches five municipal
customers before Legacy reaches two.

**7. Regulatory posture doesn't compound.** Being first-in-Texas at
VVater DPR scale could produce a moat (helping write the rules,
becoming the reference implementation, compliance becomes the
differentiator) or produce zero durable advantage (TCEQ settles on a
standard Legacy doesn't influence, subsequent vendors meet that
standard without engaging).

*Leading indicator:* TCEQ issues DPR guidance without citing
Legacy-style tamper-evident approaches, or adopts a mandate requiring
a certification Legacy hasn't pursued.

**8. Multi-agent development scales the architect, not the team.**
One human architect plus three agents is highly productive for a
portfolio of this size. The open question is whether this model
survives engineer two through engineer five, or whether the four
commitments erode when humans without the architect's context
contribute.

*Leading indicator:* a second engineer's early PRs introduce the
exact patterns the architecture was designed to rule out.

## Two new failure modes surfaced April 18, 2026

**9. Inter-entity roadmap conflict.** Hauska Inc.'s own roadmap
prioritizes developer-market features that don't serve Legacy's
immediate needs; Legacy's product timeline stalls waiting on Hauska
primitives. Or vice versa â Legacy's priorities monopolize Hauska's
bandwidth and Hauska never develops an independent developer market.

*Leading indicator:* An entire quarter passes without either a shipped
`[legacy-dependency]` feature or a shipped `[hauska-developer-market]`
feature in `33_hauska_sdk_roadmap.md`. Roadmap entries accumulate but
nothing closes.

**10. Verification-prompt discipline fails.** Two failures in a 24-hour
span in April 2026 â V4 missed a second service; SDK audit ran against
a stale local clone â demonstrate that agents can produce confident
findings against incomplete views. Without systematic preflight
discipline, verification becomes unreliable precisely when it's most
needed (scaling the team beyond one architect).

*Leading indicator:* an agent-produced audit is later contradicted
by a fact the audit could have enumerated but didn't. If it happens
once in a release cycle, it's noise; if it happens twice, the
preflight rules in `13_agent_operating_rules.md` aren't being followed.

## Which failure modes are existential vs. monitorable

Failure modes 1â4 weaken the moat story without killing the company.
Legacy's products can still be good B2B SaaS businesses even if the
most distinctive architectural commitments don't themselves close
deals.

Failure modes 5 (single-customer) and 6 (velocity tax) are existential.

Failure modes 9 and 10 are preventable â they have defined disciplines
(`33_hauska_sdk_roadmap.md` tagging + Nick's priority arbitration;
verification preflight rules in `13_agent_operating_rules.md`).

The thesis is most durable if 5 and 6 are actively managed against,
1â4 are monitored rather than solved, and 9â10 are prevented through
process.

## OPEN â Watch-list operationalization

There should be an explicit leading-indicators dashboard with owners
and cadence. Today these signals are distributed across docs and
nobody's job. *Owner: TBD â likely Nick to set, Valerie to operate.*

---

# Part 5 â Positioning Claims to Make

## Claim: regulatory compliance as a compounding moat

The architecture already supports this; underclaimed in current
materials.

`@hauska-sdk/core.EventAnchoringService` produces tamper-evident
compliance records once plumbed into SmartCity OS's write path
(M6 work). VVater-powered DPR is among the first DPR facilities at
this scale in Texas. The grant narrative positions SmartCity OS as
the compliance reporting layer. TCEQ requirements for facilities at
Bastrop's DPR scale may be written in real time.

**The thesis worth claiming:** regulatory compliance can be a
compounding moat for a small company with strong architectural
commitments, precisely because incumbents' compliance stories are
retrofitted. A hash-chain provenance story passes an AG subpoena or
an EPA audit on day one. Retrofitted audit logs in legacy municipal
software do not. Every regulatory event Legacy survives cleanly adds
a data point to the procurement conversation.

**Honest scope today:** the primitive exists in `@hauska-sdk/core`;
SmartCity OS does not yet use it. The claim becomes fully honest once
M6 plumbs anchoring into the event envelope write path and the
anchoring substrate decision lands. Until then, externally claim "the
architecture supports tamper-evident compliance records" not "our
platform produces tamper-evident compliance records."

**OPEN â Active vs. passive posture toward TCEQ standard-setting.**
Whether to actively pursue influencing TCEQ DPR guidance (via Sylvia +
VVater) rather than passively meeting it. Strategic decision, not
technical. *Owner: Nick + Sylvia conversation.*

## Claim: Legacy's products are infrastructure for AI-native government operations

Every atom being AI-accessible by default â Compass V3 today with
`ATOM_CONTEXT_V2=true` active in Empressa Demo production; Compass V4
(atom-powered) in SmartCity OS after M3 â is not an accidental
architectural choice. The `@empressaio/atom` registration contract is
specifically designed to make any agent able to reason about any
entity in the graph.

**The defensible framing:** Legacy's products are infrastructure for
AI-native government operations, not an AI-enhanced municipal platform.
The distinction matters because one is a feature and the other is a
category.

Declining to claim this framing leaves the positioning to a future
competitor who will claim it without having built the architecture to
support it.

**OPEN â Bring-your-own-agent public API.** Whether to expose
contextSummary endpoints as an authenticated public API for third-party
agents. Today they are internal. If the AI-agent-ecosystem framing is
the bet, exposing them is the step that makes the bet real.
*Owner: Nick, product decision.*

## Claim: Two-entity corporate structure as commitment reinforcement

Legacy's Commitments 2 and 4 are strengthened by the fact that the
infrastructure primitives are owned by a separate legal entity
(Hauska Inc.) from the one operating customer deployments (Legacy).

Customers verify Commitment 2 by querying the event anchoring
primitive directly â a Hauska SDK capability, commercially available,
not gated on Legacy cooperation. Customers exercise Commitment 4 by
pinning content on nodes they operate using a Hauska SDK primitive
they can acquire without Legacy involvement. No single-entity vendor
can offer this because no single-entity vendor has this structure.

This claim is currently understated in commercial materials. The
positioning line worth testing: *"Legacy Group cannot hold your data
hostage. The infrastructure primitives that deliver portability and
verification belong to a separate company you can transact with
directly."*

## Claim: Historical data atomization with honest provenance tiering

This is new in v2026.04.

Bastrop has years of pre-existing historical data (permits, work
orders, inspections, assets, documents) that will be atomized during
M3.5 into the same atom graph as live data. The context interface of
each atom explicitly signals its **provenance tier** â native (events
recorded as they happened) or backfill (events reconstructed from
source systems at atomization).

**Claim:** the architecture is honest about what can and cannot be
cryptographically proven about historical records. Backfilled atoms
carry real hash-chain entries dating from atomization forward, not
from the real event date.

**Honest scope limit:** the chain starts at atomization. A permit
issued in 2019 and atomized in 2026 cannot be cryptographically proven
to have been issued in 2019 â the event timestamps are copied from
the source system, but the chain entry is dated from atomization.
External claim language must reflect this.

The claim is stronger than "verifiable provenance on all records" â
it's *accurate* rather than aspirational, and positions Legacy as the
vendor that names its honest limits where competitors obfuscate.

## Empressa and Hauska â the distinction

Three distinct things exist:

- **Hauska Inc.** â separate C-corp, Nick-owned, ships Hauska SDK
  (`@hauska-sdk/*` npm packages) for the external developer market.
  *An infrastructure company.*
- **Empressa** â Legacy Group product brand. Ships `@empressaio/atom`
  (internal to Legacy), Empressa Land (O&G land admin, pre-revenue),
  Empressa Company Intelligence (internal Legacy workspace).
  *A product brand, not a separate entity.*
- **Empressa Demo** â Replit reference implementation of the atom
  architecture. Internal users only. The demonstration venue where the
  atom system runs against real company data with `ATOM_CONTEXT_V2=true`.
  *A proving ground, not a product.*

**Rule of thumb.** In external materials, refer to Empressa Land as
the product and Hauska SDK as Hauska Inc.'s product; do not mention
Empressa Demo (internal) or `@empressaio/atom` (internal-to-Legacy
product) unless the audience needs the technical detail. Internally,
keep all three distinct so investments in one don't get charged to
the wrong budget.

**OPEN â Empressa Company Intelligence trajectory.** Whether Empressa
Company Intelligence eventually becomes a commercial product (team
workspace SaaS for small companies) or stays permanently internal.
Not decided. *Owner: Nick.*

## Hauska â Legacy â the corporate-structure claim

**Today's corporate reality.** Hauska Inc. is a separate C-corp owned
by Nick. Legacy Group ATX LLC is owned by Nick. Hauska is not inside
Legacy's umbrella. Hauska SDK is Legacy's vendor for infrastructure
primitives; Legacy reports Hauska SDK as COGS.

**The structural advantage.** Customers of Legacy's products interact
with a single operating company (Legacy). But the infrastructure
commitments (Commitments 2 and 4) are delivered by a different company
(Hauska Inc.) that customers can transact with independently if they
ever need to. This is materially stronger than a single-entity platform
claim.

**Three plausible forward paths for the relationship.**

1. **Never change.** Hauska stays a separate Nick-owned company; Legacy
   remains Hauska's primary customer; the two operate on a COGS
   relationship indefinitely.
2. **Hauska productizes beyond Legacy.** Hauska develops paying
   developer customers outside Legacy's ecosystem. The COGS relationship
   with Legacy persists but becomes one of many.
3. **License consolidation.** At some future point, Nick decides to
   unify the two entities for operational simplicity, accepting the
   loss of the inter-entity commitment reinforcement in exchange for
   reduced overhead.

Current direction: option 2. Hauska Inc. maintains its own roadmap and
state-of-reality docs (`30-33` in the doc set), its own GitHub org
(migration pending), its own commercial motion (pending â pricing
undecided).

**OPEN â Formal Hauska â Legacy services agreement.** Today the
relationship is implied through common ownership. Externally
defensible claims about the structural advantage are stronger if the
service relationship is written down (Hauska provides infrastructure
services to Legacy under specified terms). Low urgency; real before
any external investor conversation. *Owner: Nick + Valerie.*

**OPEN â Hauska Inc. GitHub org.** Operational to-do.
*Owner: Nick.*

---

# Part 6 â Team, Second Customer, Reference Implementation

## Team and multi-agent scaling

The AI-first development workflow is documented. Claude.ai for general
planning, Claude Code for SDK and GCP work, Cursor for frontend,
Replit Agent for Empressa and SmartCity frontend. The constitutional
documents (ADR registry, settled architecture rules, the four
commitments) are partially a defense against dilution as the team
grows.

A second human developer is scheduled to onboard at M3 (atom
migration, Operations Dashboard). Their focus is the multi-tenant
productization track (M8) while Nick stays out front inventing and
creating for Bastrop.

The failure mode (named in Part 4, #8) is that one-architect-plus-agents
scales the architect but not the team, and that architectural
commitments erode when the second human engineer joins without the
architect's full context.

**OPEN â Engineer-2 operational protocol.** The protocol for humans-
plus-agents on architectural decisions at engineer two and beyond is
not defined. Who has architectural review authority? How does it flow
when it's not just Nick reviewing every agent commit? What's the
escalation path when a second human engineer proposes a pattern that
conflicts with a commitment? *Owner: Nick.*

## The second customer problem

Already named and partially prepared. `45_smartcity_multitenancy_spec.md`
lists concrete prerequisites: de-Bastrop-locking the OpenGov BNP
endpoints, hardening tenant RLS, swapping console logging for Pino
structured logger to prevent PII leakage across tenants, building a
Compass persona calibration system (today hardcoded to Sylvia).

The real test at tenant two is not technical â it is discovering which
Bastrop-shaped decisions were actually Bastrop-specific. Budget time
for that discovery explicitly.

**What we expect to learn at tenant two.** Which "universal" event
taxonomies in the atom registry are actually municipal-universal versus
Sylvia-universal.

**OPEN â Which second customer.** Sylvia's referrals (TCMA / ICMA /
Women City Managers) haven't been sequenced into a funnel. Nothing in
the docs identifies a named second prospect. *Owner: Valerie + Sylvia
conversation.*

## Reference implementation â Empressa Demo as strategic asset

Empressa Demo runs as a separate application on Replit serving as the
reference implementation of the atom architecture. It runs the atom
registry, five rendering modes, context interface pattern, composition,
and entity-memory cron in a live environment with real internal users.

**As of April 18, 2026:** `ATOM_CONTEXT_V2=true` is confirmed in the
live Replit shared environment. The atom-v2 context path is the
production runtime for Compass. `buildCuratedContext()` is called for
every chat message.

Its strategic function is threefold:

1. **Engineering insurance.** The architecture works in practice, not
   just on paper. The pattern is proven in one venue before being
   migrated into another.
2. **Credibility artifact.** "Show me this running somewhere" has an
   answer before SmartCity OS finishes its migration.
3. **Pattern extraction vehicle.** The intelligence-interface pattern
   gets refined in Empressa Demo before being pulled into
   `@empressaio/atom` as a standalone package primitive during M2.

The relationship: prove the atom architecture in Empressa Demo â extract
`@empressaio/atom` â migrate SmartCity OS onto the atom architecture
(M2 â M3 â M3.5 â M4).

---

# Part 7 â Documentation Set

This arc produced the canonical doc set documented in `00_README.md`:

**Constitutional (Legacy):**
`01_four_commitments`, `02_architecture_reference`, `03_state_of_reality`,
`04_strategic_conversation_record` (this doc).

**Operational (Legacy):**
`10_current_state_ground_truth`, `11_roadmap`, `12_deployment_rules`,
`13_agent_operating_rules`.

**Empressa brand:**
`20_empressaio_atom_architecture`, `21_empressaio_atom_upgrade_guide`,
`22_empressa_land_build_spec` (with `22a_empressa_land_atom_catalog` at M5),
`23_empressa_company_intelligence_spec`.

**Hauska Inc. brand (parallel structure):**
`30_hauska_sdk_vision`, `31_hauska_sdk_architecture`,
`32_hauska_sdk_state_of_reality`, `33_hauska_sdk_roadmap`.

**SmartCity suite:**
`40_smartcity_os_suite_overview`, `41_smartcity_operations_dashboard`
(with `41a_smartcity_atom_catalog` at M3.5), `42_smartcity_citizenconnect`,
`43_smartcity_ai_plan_review`, `44_smartcity_digital_twinning`,
`45_smartcity_multitenancy_spec`.

**Reference/archive:**
`90_legacy_group_overview`, `91_legacy_knowledge_architecture`,
`99_session_archive/`.

Roughly 26 canonical docs post-reconciliation, replacing the prior 25
scattered docs plus the uploaded drafts.

---

# Part 8 â Open Questions Carried Forward

## Commercial (Legacy)

1. Per-city price envelope for deal #2 â *Valerie*
2. Services vs. platform revenue on Bastrop â *Valerie + Nick*
3. Plan review module-or-bundle â *Nick + Valerie*
4. Tenth-deal economics â *Valerie*
5. `@empressaio/atom` commercial posture revisit trigger â *Nick*

## Commercial (Hauska Inc.)

6. Hauska SDK pricing model â *Nick*
7. Hauska Inc. external developer motion (if / when to launch) â *Nick*

## Corporate and structural

8. Formal Hauska â Legacy services agreement written â *Nick + Valerie*
9. Hauska Inc. GitHub org migration â *Nick (operational)*
10. Engineer-2 operational protocol â *Nick*

## Regulatory and positioning

11. Active vs. passive posture toward TCEQ standard-setting â *Nick + Sylvia conversation*
12. Bring-your-own-agent public API â *Nick, product decision*
13. Empressa Company Intelligence trajectory (commercial or internal) â *Nick*

## Market and customer

14. Which second customer, and what the referral funnel looks like â *Valerie + Sylvia*
15. Leading-indicators watch-list ownership and cadence â *TBD, suggested Nick to set, Valerie to operate*

## Architectural

16. **Anchoring substrate decision** â Polygon CDK (ADR-007) vs. public TSA vs. customer-controlled. Precondition for M6. *Owner: Nick, with ADR documentation.*
17. **Nick Chesser subdivision real name** â low-stakes text-reply pending.

---

# Part 9 â Leading Indicators Watch List

Today distributed across docs; nobody watches systematically. Making
the watch list a named artifact with owner is an open question above.

| # | Failure mode | Leading indicator |
|---|---|---|
| 1 | AI-access commoditization | General-purpose agent framework auto-discovers municipal integration |
| 2 | Provenance not a purchase criterion | Peer cities don't weight provenance in scoring |
| 3 | "Good enough integration" beats integration-first | Incumbent announces "platform mode" |
| 4 | Portability never exercised | Customer interviews reveal portability is "nice to know" |
| 5 | Single-customer risk | Churn signals from Sylvia (pre-budget pushback, staff cycling, sponsor loss) |
| 6 | Velocity tax | A competitor reaches five municipal customers before Legacy reaches two |
| 7 | Regulatory non-compounding | TCEQ issues DPR guidance without citing Legacy-style tamper-evident approaches |
| 8 | Multi-agent team dilution | Engineer-2 PRs introduce ruled-out patterns |
| 9 | Inter-entity roadmap conflict | A quarter passes with no closed `[legacy-dependency]` or `[hauska-developer-market]` features |
| 10 | Verification-prompt discipline failure | An agent audit is contradicted by a fact it could have enumerated but didn't |

Suggested cadence: monthly review. Annual review of whether any
failure mode has advanced from "monitor" to "active mitigation."

---

# Part 10 â Operational Discipline and Lessons

Content in this part is append-only institutional knowledge.
Captured from the April 2026 Bastrop engagement work, including
the Phase 0 invoice reconciliation, the forward-program roadmap
construction, the Parcel Intelligence product introduction, and
the pricing calibration exercise against real measured velocity.
Items here are settled â do not re-litigate without evidence of
changed circumstances.

## Section 10.1 â Velocity baseline (AI-first single-dev)

**Calibration data point.** Nick Smith built the current Operations
Dashboard solo in approximately 70 days using an AI-first development
process. That built includes: multiple production integrations
(MyGov scraper pipeline, Samsara, Verkada, GoTo Connect, First Due,
NWS, OpenGov, ArcGIS, Spireon, Power BI, VFD), Compass V3 context
assembly against a 40,000-char prompt, the six-tab UI surface,
GCP Cloud Run deployment with scheduler, and iterative stabilization.

**Unit-level velocity derived from that data point:**

| Unit of work | Solo days (AI-first) |
|---|---|
| New integration (API or scraper, incl. envelope shape) | 1 day |
| New atom type (catalog entry + registration + context interface) | 2â3 days |
| New UI tab or major panel | 2â3 days |
| New LLM-powered workflow (prompt eng + structured output + end-to-end) | 5â7 days |
| New Cloud Run service (scaffold + deploy + basic observability) | 3â5 days |
| Meaningful test coverage for a service | 10â15 days |
| SCADA / regulatory-boundary integration | 15â20 days |
| ML anomaly detection baseline + calibration | 15â20 days |

**Two-dev scaling coefficient.** Adding a second developer produces
roughly 1.5Ã throughput after a 2-week ramp â not 2Ã. Coordination
cost, architectural decisions flowing through lead, review overhead,
and codebase familiarity all bring the effective multiplier below 2.
A strong second dev landed on a well-specified isolable parallel
track reaches 0.7Ã effective contribution; on ambiguous work the
number drops toward 0.3Ã.

**Implications for estimation.** When pricing new work, the velocity
baseline above is the starting point â not traditional agency math,
not industry benchmarks. The AI-first process materially changes per-
unit velocity but does not change the total shape of the work (the
number of integrations, atom types, workflows, services, and tests
needed). Estimation discipline: enumerate units, multiply by
per-unit velocity, add coordination overhead for multi-dev work,
then assess whether calendar is constrained by sequential gates
(which parallelism can't compress).

**Explicitly not captured here:** ramp time for a second dev, which
varies by codebase familiarity; peak sprint velocity, which is
unsustainable and not useful for quoted calendar; calendar buffer,
which is a project-management decision rather than a velocity fact.

See also: `13_agent_operating_rules.md` for the rule that
estimation prompts reference this baseline before proposing
calendar time.

## Section 10.2 â Pricing strategy framework (Path A vs Path B)

Settled framework for pricing proposals to Legacy customers,
derived from the April 2026 Bastrop roadmap pricing exercise.

**Path A â tighten scope, keep pricing familiar to the buyer.**
Price each phase against the buyer's emotional price anchor (what
they expect to pay for a piece of work). Explicitly name what's in
and out of each phase. Expansion happens through change orders with
their own scope and pricing. Appropriate when: the customer is a
price-sensitive smaller-budget account, the product is pre-scale,
trust and a first contract matter more than maximum contract value.

**Path B â price at honest scope-calibrated ranges.** Price each
phase at what the work actually costs given realistic scope. Total
may exceed buyer's initial emotional price anchor. Appropriate
when: the customer has budget, the work is complex enough that
scope tightening creates hidden risk, or when the proposal is
being used to establish a market price point for a new product.

**Default for municipal accounts:** Path A. Small-city budgets
have an emotional price anchor that matters. Change orders are a
normal part of municipal software engagements. Landing a first
contract creates the references needed to price subsequent
engagements higher.

**Default for Empressa Land and future B2B products:** revisit when
there's pricing signal from the market; Path A or Path B is not
yet settled there.

## Section 10.3 â Pitch discipline (what not to claim)

Settled discipline for customer-facing impact claims. Derived from
the Bastrop Impact Brief production, April 2026.

- **No specific dollar savings.** Not "saves $180K per year." The
  dollar value lands differently at every customer; calibrate from
  real observed use after the first phase ships, not from
  projection.
- **No specific hour savings.** Not "saves 40 staff hours per week."
  The nature of the work changes â less tab-switching, less
  cross-referencing, less manual assembly. Specific numbers depend
  on who's using the system and how.
- **No claim about regulatory outcomes.** The platform improves
  audit posture and records-response capability. It does not
  guarantee regulatory outcomes, which depend on the underlying
  operations.
- **No claim about incident reduction.** Live-infrastructure
  capability surfaces anomalies earlier. Whether that translates
  into fewer overflows, breakdowns, or compliance issues depends
  on how the customer acts on what they see.

**Why.** Every customer is different; promising specific numbers
creates mismatch risk. Better discipline: describe how the operating
picture changes, then calibrate measurable impact from real use.
Real numbers from real use â not projections â become the basis
of the ROI story for subsequent expansion.

## Section 10.4 â Parcel Intelligence as prerequisite to AI Plan Review (settled ADR)

**Status:** Settled. Do not re-litigate.

**Decision.** Parcel Intelligence ships before AI Plan Review.
Parcel Intelligence is promoted to its own M-level (M3.75) between
M3.5 and M4; M4 Track B (AI Plan Review) has a hard dependency on
M3.75 closing.

**Argument.** AI Plan Review's competitive differentiator is that
findings come with relevant city history and constraints attached.
For that to work, each parcel's record must contain that context
before the plan review runs. Parcel Intelligence is the product
that builds and maintains that context during pre-application â
which is exactly the moment when the insight is produced. Shipping
Plan Review first produces a thinner-than-it-should-be product
for months while the knowledge layer accumulates by accident.
Shipping Parcel Intelligence first populates the knowledge layer
deliberately, on every parcel the city touches, so Plan Review is
strong from day one.

**Implementation:** see `46_smartcity_parcel_intelligence.md` for
the spec and `11_roadmap.md` M3.75 for the milestone scope.

## Section 10.5 â Property Intelligence as a product area (UX container)

Parcel Intelligence is the first capability in a product area called
"property intelligence." It lives under the property-intelligence
subtab of the Operations Dashboard development tab, integrated with
the existing parcel map.

**Why call out the product area.** Future property-adjacent
capabilities â lot splits, comparable-sales analysis, assemblage
feasibility, whatever's next â belong here structurally. Property
intelligence is the container; Parcel Intelligence is today's
capability set. Future agents and product work should extend the
container, not create a new sibling.

**For new customers:** property intelligence is elective. A small
city that just wants Operations Dashboard + CitizenConnect doesn't
need it. Cities that want the Bastrop pitch in full â pre-
application briefings, graph-integrated plan review findings,
economic-development differentiator â elect property intelligence
and get the whole picture. Pricing reflects this (Parcel
Intelligence is a distinct phase in the Bastrop estimate rather
than bundled into foundation).

## Section 10.6 â Customer engagement doc structure

Settled convention for how customer-facing engagement docs are
organized. Derived from the Bastrop roadmap/estimate + impact brief
production.

**Two-doc pattern for customer engagements at proposal stage:**

1. **Roadmap & Estimate.** The commercial document. Names every
   phase with scope and price. Summary table with totals. Phase
   flow diagram showing dependencies and parallelization. Full
   billing-reference block (PO#, contract ref, EIN/UEI/CAGE,
   invoice#) so the doc reads as an official estimate tied to the
   engagement. Filed under the customer's records.
2. **Impact Brief.** The operational document. For each phase,
   a Before/After table of concrete situations and a one-line
   upshot. Rolled-up view at full program. Honest statement of
   what the proposal does not claim (dollar savings, hour
   savings, regulatory outcomes, incident reduction â see
   Section 10.3). Used in meetings to walk the customer through
   what changes in their day-to-day.

The two documents are produced together; they cross-reference each
other; they share brand treatment (logo, palette, typography,
footer format). Sending them together is the default.

**Structural separation of billed-vs-proposed work.** Work already
delivered and billable gets a Phase 0 entry with the invoice
reference. Forward work is proposed at fixed-fee-per-phase.
Engagement docs never conflate the two.

## Section 10.7 â Phase 0 engagement reconciliation discipline

Derived from the April 2026 Bastrop invoice LG-2026-0417 reconciliation.

**Rule.** When work has been delivered outside the scope of the
original PSA and needs invoicing, the invoice is structured to
separate:

1. Work already billed under the original PSA (for completeness,
   not for re-invoicing).
2. Work completed beyond original scope, with market rate shown
   for transparency and the actual partnership rate on the
   invoice line.

**Why market-rate transparency.** Small-city customers feel
respected when market rate is disclosed alongside partnership rate.
It signals the work has real value even if the customer isn't paying
full market for it. For Bastrop's Phase 0 invoice: $37,500 market
rate disclosed; $30,000 partnership rate invoiced.

**Cross-reference to the roadmap estimate.** The Phase 0 entry in
the forward-looking roadmap estimate pulls from the same invoice
line items, so the customer sees the same work described in both
documents with the same framing.

---

# The one-sentence summary

*Legacy Group builds the intelligence layer â atom contracts, vertical
products, customer-facing operations â on top of infrastructure
primitives delivered by Hauska Inc. The atom is the mechanism. The
four commitments are the reason the mechanism exists. The separation
across two entities is the reason Commitments 2 and 4 are enforceable
even against Legacy itself. The moat is not the technology; it is the
refusal to build the things that create scar tissue, reinforced by a
corporate structure that puts the infrastructure primitives in a
company customers can transact with directly.*

---

*End of strategic conversation record. Positions in Parts 3 and 4 are
authoritative per Legacy Group's Strategic Gap-Close Brief of April 18,
2026 and the April 18 entity-structure correction. Open questions
marked **OPEN** are carried forward as explicit decisions required.*
