---
date: 2026-05-18
agent: claude-code
repo: docs
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state, 11_roadmap, 14_pricing_framework, 70_bizops_overview, 71_pipeline, 72_hauska_inc_operations, 73_partnerships, 74_commercial_agreements, CLAUDE.md]
---

## What was done

Two tracks executed in one session, plus an archival move.

**Track 1 â Pricing close-the-loop.** Four prior Open-question items in [`14_pricing_framework.md`](../14_pricing_framework.md) settled with binary calls from Nick. Take-rate range pinned at 1.5 to 2.5 percent for v1; exact number sets at first paid Layer 2 call. Pricing-model composition promoted from "most likely outcome" to v1 canon (Layer 1 free; Layer 2 per-call default with optional stream subscription when call volume justifies; composition royalty deferred to derivative products that do not yet exist; reasoning-call as unifying frame; marketplace dynamics genuinely future 18 to 36 months). Stripe Connect pinned as v1 fiat-rail candidate (revisit trigger: first paid Layer 2 call from a fiat-preferring counterparty pulling implementation off the queue); v1 crypto rail (USDC on Base / Ethereum / Polygon) already built in `@hauska-sdk/payment` v0.1.0 per the substrate-state subsection. [`11_roadmap.md`](../11_roadmap.md) line 275 `@hauska/atom-contract` commercial-posture revisit trigger inlined as third-party-consumption OR first-paid-Layer-2-revenue, whichever-first. Open-questions section in 14 narrowed from five abstract items to two gated items (regulatory posture; cross-surface pricing) plus one architecturally-settled-implementation-gated item (adversarial agent mitigations); Defaults-table "Revisit when market signal" rows rewritten with matching gating shape; Cross-surface pricing section header retitled from "pending" to "gated on Codex 1a + 1b pilot conversion." Revision-history entry added at 14.

**Track 2 â Bizops 70-band design.** Band designed and seeded. Five canonical docs created: [`70_bizops_overview.md`](../70_bizops_overview.md) (pointer doc; band map; Hauska-spine rule applied; cross-band relationships), [`71_pipeline.md`](../71_pipeline.md) (funnel-state framework; Bastrop customer; Mox prospect with link to `_prospects/mox/`; EdgeConneX lead deferred; killed/dormant section), [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) (entity status; banking gating pricing question #5; IP attorney memo gating 51 sync point #6; Tech E&O routing; regulatory posture gated on memo+banking; settlement rails state), [`73_partnerships.md`](../73_partnerships.md) (partnership-first sourcing commitment; Bastrop pioneering-city instance; partnership template; pipeline of future Texas-first 25-city + Grand County), [`74_commercial_agreements.md`](../74_commercial_agreements.md) (Sylvia $1M proposal Path A applied; templates section with triggers to author; pricing-application reference inlined from 14). `_prospects/mox/` subdirectory created; three Mox artifacts (mox_executive_summary_v2.md, mox_prospect_briefing.md, mox_prospect_project_instructions.md) moved from root to `_prospects/mox/`. Root is clean of bizops-related stragglers.

**Track 0 â Archive.** YC summer 2026 application handoff moved from `yc_summer_2026_application_handoff.md` at root to `_sessions/archived/2026-05/yc_summer_2026_application_handoff.md` per Nick's "archive the YC thing" direction (informational, sent to claude chat, no further work expected).

**Bookkeeping.** [`CLAUDE.md`](../CLAUDE.md) "What is open" bizops bullet and Mox-at-root bullet retired; "What is settled" gained the pricing close-the-loop summary plus the bizops 70-band entry. [`00_current_state.md`](../00_current_state.md) Recent-session-summaries gained today's session at the top with the 2026-05-15 LKG calendar entry rotating off the bottom; Cross-cutting watch list updated to mark bizops 70-band designed (was "dedicated session scheduled"); per-product MCP-tier-model line updated to note take rate settled at the range level.

## What was learned (changes to ground truth)

The pricing-framework Open-questions section had grown to read as undefined work rather than as decisions with gating. Most of the items were resolvable today; the doc was tracking them as open because no one had walked through them deliberately. Walking through the five items in one pass with a clean binary-call-or-explicit-gating framework collapsed the section from five-abstract-items to two-gated-plus-one-architecturally-settled. The lesson: open-questions sections should be audited periodically against current state, because what reads as "open" sometimes turns out to be "decidable today if we sit down with it." The 14 close-the-loop pattern is reusable for any canonical doc with a long-running Open-questions section.

The bizops 70-band absorbed several stragglers cleanly into one coherent structure. The three Mox artifacts at root were the most visible forcing function, but they were not the only one: regulatory-posture gating from 14 had no concrete tracking home; the Bastrop partnership template was implicit in 11_roadmap and CLAUDE.md but not formalized; the Sylvia $1M proposal was tracked at the application level in 14 but the contract instance had no slot. Designing the band as five flat canonical docs plus a `_prospects/` subdirectory addresses all of these at once. The design held to the doc-set conventions (numeric prefixes; subdirectory only for series content) without inventing new shapes.

The relationship between [`18_stakeholder_graph.md`](../18_stakeholder_graph.md) and [`73_partnerships.md`](../73_partnerships.md) wants explicit articulation. 18 is the relationship graph â who is connected to whom, what each relationship is. 73 is the operational partnership state â which counterparties are formal partners under the partnership-first sourcing commitment, what the partnership terms look like, what the template should generalize to. They are complementary, not duplicative; the 73 doc explicitly references 18 as the source of contact assignments and frames itself as the operational counterpart.

`@hauska-sdk/payment` re-verification (today, same session as the doc-set sweep) held the recon: 56 tests still passing; Circle checkout URL still the sole production code TODO. Pricing close-the-loop proceeded on the same code-reality evidence. No code drift since 2026-04-05.

## What's still open

Pricing Open-questions narrowed to three items, each with explicit gating named:

- **Regulatory posture** (money-transmitter requirements per state; KYC/AML thresholds) â resolves when Texas IP attorney memo delivered AND Hauska Inc. operating banking established. Both items tracked in [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md). Watch state.
- **Cross-surface pricing** (synergy/discount logic; bundle vs Ã -la-carte; contractor-firm-to-city pricing relationship) â resolves when both Codex 1a (firms) and Codex 1b (cities) pilot conversion datasets land. Same gating shape applied to Defaults-table "Revisit when market signal" rows.
- **Adversarial agent mitigations** â architecturally settled (signed SDK builds, attestation, accessPolicy enforcement); implementation gated to first paid Layer 2 revenue.

Bizops items still open (now tracked in 70-band rather than at root):

- Mox CEO meeting timing (tracked in 71). Reframes Mox pilot urgency once it lands.
- IP attorney memo routing date (tracked in 72). Gates 14 pricing item, 51 sync point #6, and the broader Texas-first partnership pipeline at 73.
- Tech E&O insurance routing date (tracked in 72). Pre-revenue compliance prerequisite.
- Operating banking establishment (tracked in 72). Co-gates the regulatory posture item.
- Per-product MCP tier-model specific numeric values (tier prices, bundled call quotas) â take rate now settled at the range level; tier prices and call quotas remain deferred per [`08_tiered_access_model.md`](../08_tiered_access_model.md).
- Revenue-share template (74 templates section) â gated on Bastrop revenue-share contract operational pilot per 14 substrate-state subsection.

Items the handoff named as explicitly out of scope this session, still open:

- ECI atomization sprint kickoff (ECI internal registry naming `@empressaio/atom-internal` deferred per ADR-018; sprint kickoff is its own session).
- Sheet / decision-event / submission / submission-classification focus-rendering-mode contract gap (engineering action in legacy-design-tools).

## Suggested canonical doc updates

None. The session was the doc update across pricing-framework + the new 70-band. Future sessions inherit cleaner state.

The 18_stakeholder_graph.md â 73_partnerships.md relationship articulation noted in "What was learned" is worth tightening if 18 gets touched in a future session; 18 could gain a one-line forward-pointer to 73 ("Operational partnership state lives in [`73_partnerships.md`](73_partnerships.md)"). Not load-bearing today; queue for next time someone is in 18.

## References

- [`14_pricing_framework.md`](../14_pricing_framework.md) â pricing close-the-loop landing site.
- [`70_bizops_overview.md`](../70_bizops_overview.md) â new 70-band pointer doc.
- [`71_pipeline.md`](../71_pipeline.md), [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md), [`73_partnerships.md`](../73_partnerships.md), [`74_commercial_agreements.md`](../74_commercial_agreements.md) â new 70-band canonical docs.
- [`_prospects/mox/`](../_prospects/mox/) â Mox engagement working files relocated from root.
- [`_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md`](2026-05-18_doc_set_sweep_adr018_claude_code.md) â earlier session this day (ADR-018 doc-set sweep including the original SDK re-verification).
- [`_sessions/archived/2026-05/yc_summer_2026_application_handoff.md`](archived/2026-05/yc_summer_2026_application_handoff.md) â YC handoff archived this session.
