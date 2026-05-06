---
id: 13_risk_register
title: Risk register â named failure modes
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [10_ground_truth, 11_roadmap, 17_leading_indicators]
---

# Risk register â named failure modes

> **Living register.** Each risk has a named leading indicator that
> tells us when it's advancing from "monitor" to "active mitigation."
> Review monthly per the cadence at the end. Add new risks as they
> surface; never delete â close-out is a status flip, not a deletion.
> When a risk advances or retires, log the change in revision history.
>
> **Origin:** extracted 2026-05-05 from Part 4 of
> `04_strategic_conversation_record.md` (April 2026 strategic
> planning arc) during pre-docs-repo migration. Original archived at
> [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md).

## Why a risk register

A thesis that cannot name its own failure modes is not a strategy.
The architectural commitments (AI-accessible, verifiable, integrative,
portable) and the corporate-structure choices (Hauska as separate
C-corp) are commercially uncomfortable for a reason â they're meant
to produce a moat. A moat that can't be tested has no idea whether it
exists.

This register names the 10 ways the strategy could fail. Each entry
includes a leading indicator: an observable signal that tells us this
particular failure is advancing.

## Categorization

| Category | Risks | What they look like |
|---|---|---|
| **Moat-weakening (monitor)** | 1, 2, 3, 4 | Strategy works as a B2B SaaS business but the architectural commitments don't themselves close deals |
| **Existential** | 5, 6 | The company doesn't survive these without active management |
| **Preventable through process** | 9, 10 | Defined disciplines exist; this register helps enforce them |
| **Structural / regulatory** | 7, 8 | Outcomes shaped by external standard-setting and team-scaling that aren't fully controllable |

Active management means: 5 and 6 get explicit mitigation plans and
quarterly review. 1-4 get monitored. 9 and 10 are kept prevented by
the agent operating rules and the inter-entity roadmap discipline.
7 and 8 get watched and shape decisions when the trigger fires.

## The 10 named failure modes

### Risk 1 â AI-native access becomes a commodity

If frontier models get good enough at structured retrieval over raw
databases and document stores that an external agent can reason about
a city without platform-level atom scaffolding, the AI-accessibility
advantage evaporates.

**Leading indicator:** A general-purpose agent framework ships an
auto-discovering municipal integration that hits MyGov, Samsara, GoTo,
and ArcGIS with no custom wiring.

**Category:** moat-weakening (monitor).

### Risk 2 â Cryptographic provenance turns out not to be a purchase criterion

Municipal buyers may care about it in principle but not pay for it in
practice. If the VVater DPR compliance narrative is the only place
provenance produces dollars, hash-chain anchoring becomes a cost
center being maintained rather than a differentiator closing deals.

**Leading indicator:** Bastrop's peers cite features and references
but don't weight the provenance chain in their selection scoring.

**Category:** moat-weakening (monitor).

### Risk 3 â "Good enough integration" beats "integration-first"

Tyler, Accela, and CentralSquare retrofit integration-over-replacement
as a posture rather than a discipline; customers pick familiar +
acceptable over differentiated + unfamiliar.

**Leading indicator:** An incumbent announces a "platform mode" that
promises to leave existing systems in place and adds a command surface
on top.

**Category:** moat-weakening (monitor).

### Risk 4 â Portability is theoretically valuable but never exercised

No customer ever exports their atom graph to another system. The
living-lineage argument does architectural work being paid for without
buyers noticing.

**Leading indicator:** Customer interviews reveal portability is
"nice to know" and never the decisive factor.

**Category:** moat-weakening (monitor).

### Risk 5 â Single-customer risk (existential)

Bastrop is everything. If Sylvia leaves, the council changes posture,
or the relationship sours on operational trust, Legacy loses its
anchor reference.

**Leading indicator:** Churn signals from Sylvia â pre-budget season
pushback, staff cycling out, loss of executive sponsor. The 2026-05-05
$1M proposal pushback is data; investigate trajectory.

**Category:** existential. Mitigation: second customer (Jarrell
confirmed in pipeline; need to convert and stabilize).

### Risk 6 â The architectural discipline becomes a velocity tax (existential)

Refusing standard enterprise moats, refusing rip-and-replace,
refusing to absorb data estates â each refusal costs velocity
relative to competitors who do those things. A lightly-funded
competitor ships "less correct but good enough" faster and hits
distribution before Legacy hits its second customer.

**Leading indicator:** A pre-revenue competitor reaches five
municipal customers before Legacy reaches two.

**Category:** existential. Mitigation: deliberately sequence which
discipline-costs are paid in which sprint; Hauska SDK extraction
amortizes some of the velocity tax across both companies.

### Risk 7 â Regulatory posture doesn't compound

Being first-in-Texas at VVater DPR scale could produce a moat
(helping write the rules, becoming the reference implementation,
compliance becomes the differentiator) or produce zero durable
advantage (TCEQ settles on a standard Legacy doesn't influence;
subsequent vendors meet that standard without engaging).

**Leading indicator:** TCEQ issues DPR guidance without citing
Legacy-style tamper-evident approaches, OR adopts a mandate
requiring a certification Legacy hasn't pursued.

**Category:** structural / regulatory.

### Risk 8 â Multi-agent development scales the architect, not the team

One human architect plus three (now four) agents is highly
productive for a portfolio of this size. The open question is
whether this model survives engineer two through engineer five, or
whether the four commitments erode when humans without the
architect's context contribute.

**Leading indicator:** A second engineer's early PRs introduce the
exact patterns the architecture was designed to rule out.

**Category:** structural / team-scaling. Mitigation: agent operating
rules ([`20_agent_operating_rules.md`](20_agent_operating_rules.md))
encode the discipline so onboarding can reference rules rather than
relying on context transfer.

### Risk 9 â Inter-entity roadmap conflict (preventable)

Hauska Inc.'s own roadmap prioritizes developer-market features that
don't serve Legacy's immediate needs; Legacy's product timeline
stalls waiting on Hauska primitives. Or vice versa â Legacy's
priorities monopolize Hauska's bandwidth and Hauska never develops an
independent developer market.

**Leading indicator:** An entire quarter passes without either a
shipped `[legacy-dependency]` feature or a shipped
`[hauska-developer-market]` feature in the Hauska SDK roadmap. Roadmap
entries accumulate but nothing closes.

**Category:** preventable through process (roadmap tagging discipline
+ Nick's priority arbitration).

### Risk 10 â Verification-prompt discipline fails (preventable)

Two failures in a 24-hour span in April 2026 â V4 missed a second
service; SDK audit ran against a stale local clone â demonstrate that
agents can produce confident findings against incomplete views.
Without systematic preflight discipline, verification becomes
unreliable precisely when it's most needed (scaling the team beyond
one architect).

**Leading indicator:** An agent-produced audit is later contradicted
by a fact the audit could have enumerated but didn't. If it happens
once in a release cycle, it's noise; if it happens twice, the
preflight rules in [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
aren't being followed.

**Category:** preventable through process (HR-1, HR-8, HR-9 in
agent operating rules).

## Watchlist mechanics

Leading indicators are listed in
[`17_leading_indicators.md`](17_leading_indicators.md) as a flat
table for fast scanning during reviews. The detail above (categories,
mitigations, context) lives here.

## Owner and cadence

**Owner:** Currently none assigned. Suggested in original strategic
record: Nick to set, Valerie to operate. **This is itself an open
question** â see [`11_roadmap.md`](11_roadmap.md) P3 entries on open
strategic questions.

**Cadence (suggested, not yet operational):**

- **Monthly review** â flat-table watchlist scan, ~20 minutes.
- **Quarterly review** â full register read, classification updates,
  add/retire risks. Flagged in this doc's revision history.
- **Annual review** â categorization audit (existential vs.
  monitor): has any risk advanced or retired?

Until ownership is assigned, the cadence is aspirational. The
register is still useful as a forcing function for thinking about
risk; it just doesn't yet have a process making it an operational
artifact.

## Cross-references

- [`17_leading_indicators.md`](17_leading_indicators.md) â flat-table
  watchlist for fast scan
- [`11_roadmap.md`](11_roadmap.md) â open strategic questions
  including watchlist ownership
- [`20_agent_operating_rules.md`](20_agent_operating_rules.md) â
  rules that prevent Risks 9 and 10
- [`30_smartcity_os.md`](30_smartcity_os.md) â strategic frames
  underpinning Risks 1-4
- [`40_design_accelerator.md`](40_design_accelerator.md) â strategic
  frames underpinning Risks 1-4 on the architect side
- [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md)
  â original strategic record where these failure modes were named

## Revision history

- **2026-05-05 (origin):** Extracted from Part 4 of
  `04_strategic_conversation_record.md` during pre-docs-repo
  migration. 10 risks (8 named originally + 2 surfaced April 18,
  2026) carried forward unchanged. Categorization preserved.
  Mitigation notes added based on current state (Jarrell confirmed,
  agent rules v2 shipped, etc.).
