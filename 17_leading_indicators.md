---
id: 17_leading_indicators
title: Leading indicators watchlist
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [13_risk_register, 11_roadmap]
---

# Leading indicators watchlist

> **Flat-table watchlist.** Companion to
> [`13_risk_register.md`](13_risk_register.md). Designed for fast
> monthly scan: read the table top to bottom, flag any signal that's
> firing, log in revision history, escalate to the risk register if a
> signal advances. Edit in place when adding/retiring indicators.
>
> **Origin:** extracted 2026-05-05 from Part 9 of
> `04_strategic_conversation_record.md`. Original archived at
> [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md).

## How to use this

1. Once a month (target â not yet operational; see Owner below),
   read the table.
2. For each row, ask: has this signal fired since the last review?
3. If a signal has fired, log it in revision history with date and
   detail. Escalate to the named risk in
   [`13_risk_register.md`](13_risk_register.md) â flip its status
   from "monitor" to "active mitigation."
4. If a signal hasn't fired but the underlying condition has
   shifted (the moat got stronger, the competitor got further away),
   note that too. Negative findings are findings.
5. Quarterly: full register read in
   [`13_risk_register.md`](13_risk_register.md), with
   categorization audit. Annual: existential vs. monitor split.

The watchlist is the fast-pass; the register is the deep-pass.

## The watchlist

| # | Failure mode | Leading indicator | Signal as of 2026-05-05 |
|---|---|---|---|
| 1 | AI-access commoditization | General-purpose agent framework auto-discovers municipal integration (MyGov / Samsara / GoTo / ArcGIS with no custom wiring) | Not firing |
| 2 | Provenance not a purchase criterion | Peer cities don't weight the provenance chain in their selection scoring | Insufficient data â second-customer conversations haven't been comprehensive enough to test |
| 3 | "Good enough integration" beats integration-first | Incumbent (Tyler / Accela / CentralSquare) announces a "platform mode" that promises to leave existing systems in place | Not firing as of last check; Tyler has integration features but no announced platform mode |
| 4 | Portability never exercised | Customer interviews reveal portability is "nice to know" and never the decisive factor | Insufficient data â no customer has been asked to articulate buying criteria post-portability-claim |
| 5 | Single-customer risk | Churn signals from Sylvia â pre-budget pushback, staff cycling, sponsor loss | **Active** â 2026-05-05 $1M proposal pushback. Investigating trajectory. Pricing framework path discussed in [`15_pricing_framework.md`](15_pricing_framework.md). |
| 6 | Velocity tax | A pre-revenue competitor reaches five municipal customers before Legacy reaches two | Not firing â no competitor visible at this scale |
| 7 | Regulatory non-compounding | TCEQ issues DPR guidance without citing Legacy-style tamper-evident approaches, OR adopts a mandate requiring a certification Legacy hasn't pursued | Not firing â no TCEQ DPR guidance issued in the watch period |
| 8 | Multi-agent team dilution | A second engineer's early PRs introduce ruled-out patterns | Not applicable yet â no engineer #2 onboarded; Risk fires when this changes |
| 9 | Inter-entity roadmap conflict | A quarter passes with no closed `[legacy-dependency]` or `[hauska-developer-market]` features | Not firing â Hauska SDK v0.1.0 published, A04.7 dependency shipped; quarter-watch ongoing |
| 10 | Verification-prompt discipline failure | An agent-produced audit is later contradicted by a fact the audit could have enumerated but didn't | **Mitigated** â agent operating rules v2 ([`20_agent_operating_rules.md`](20_agent_operating_rules.md)) HR-1 / HR-8 / HR-9 codify the discipline; 2026-05-05 multi-repo recon followed the new pattern (verbatim verification artifacts) |

## Owner / cadence

**Owner:** Currently none formally assigned. Suggested in original
strategic record: Nick to set, Valerie to operate. **Open question
in [`11_roadmap.md`](11_roadmap.md).**

**Cadence:**

- **Monthly review** â flat table read, signal status update. ~20
  minutes when there's nothing new; longer if something fires.
- **Quarterly** â paired with risk register quarterly review.
  Categorization audit.
- **Annual** â existential vs. monitor classification check.

Until ownership is named, the cadence is aspirational. The first
review that happens at all establishes the baseline; consistency
matters more than the chosen frequency.

## What changes a signal status

The "Signal as of <date>" column in the table is updated:

- When a signal fires (move "Not firing" â "**Active**" or
  "**Watching**" with explanation)
- When new data lets us upgrade insufficient-data rows to a
  confident state
- When a signal stops firing (move active back to "Not firing â
  retired <date>, see history")

Every status change goes in the revision history of this doc with
date + detail. The register-side reflection happens via flipping
the corresponding risk's status in
[`13_risk_register.md`](13_risk_register.md).

## Adding a new indicator

When a new failure mode is identified:

1. Add to the register first
   ([`13_risk_register.md`](13_risk_register.md)) with full context
   and category
2. Add corresponding row to this watchlist with concise indicator
   wording
3. Bump `last_updated` on both docs

When retiring an indicator (the risk no longer applies):

- Don't delete. Mark as "Retired <date>" in the watchlist; the
  register entry retires with explanation in revision history.
- Retired risks are kept for audit â the historical record of what
  was thought to be a risk and how it resolved is itself useful.

## Cross-references

- [`13_risk_register.md`](13_risk_register.md) â full register with
  context, mitigations, categorization
- [`11_roadmap.md`](11_roadmap.md) â open question on watchlist
  ownership
- [`20_agent_operating_rules.md`](20_agent_operating_rules.md) â
  rules that mitigate Risks 9 and 10
- [`15_pricing_framework.md`](15_pricing_framework.md) â Sylvia
  $1M proposal context relevant to Risk 5 active signal
- [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md)
  â original strategic record (Part 9 source)

## Revision history

- **2026-05-05 (origin):** Extracted from Part 9 of
  `04_strategic_conversation_record.md`. 10 indicators preserved
  verbatim from source. Signal statuses populated from current
  knowledge (2026-05-05). Risk 5 (single-customer) flagged active
  pending Sylvia conversation outcome. Risk 10 (verification
  discipline) flagged mitigated via agent operating rules v2.
