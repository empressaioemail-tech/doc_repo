---
decision_id: 2026-08-31_smartsite_ladder_recut_studio_works_a_list
date: 2026-08-31
owner: operator
status: active
amends: 2026-08-10_smartsite_pricing_and_gtm_LOCKED
related_canonical:
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED
  - _smartsite_gtm/03_ladder_recut_proposal
  - _decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - 14_pricing_framework
---

# Decision

RULED 2026-08-31. Solo answers one parcel. Studio works a list of them.

The LOCKED 2026-08-10 ladder is AMENDED, not replaced. Every price is untouched: Free, the $15 thirty-day unlock, Solo $49, Studio $129, Team $299 for three seats then $25, and annual as the default presentation all stand exactly as locked. What changes is which capability sits on which rung, and how the comparison surface groups them.

**One capability moves.** Screens and boards, `create_screen`, `add_to_screen`, `list_screens`, move from ungated to Studio and Team.

**One capability becomes visible without moving.** The records package is already Studio, bundled inside the export kind `dossier`. It gets its own named row on the comparison surface.

**The comparison surface regroups** from Answer / Hand off / Firm to: Answer this parcel, for the Solo rows; Work a list of them, for screens, owner data, and records; Hand it off, for site plan CAD and terrain; Work as a firm, for seats. Studio's badge stops being "The packet."

**Studio moves to two seats**, from one.

**Prospect is redefined** from "the set-level answer" to monitoring: alerts and saved searches. Still post-launch, still marked coming soon.

## Context

A read of the live entitlement gates on 2026-08-31 established what the tiers actually enforce, as against what the pricing popup claims. Studio's entire differentiation is four items, three of which are professional deliverables only an architect, designer, or builder wants. Owner data is the only one the investor, flipper, and agent segment wants, and the locked audience ruling makes that segment the largest. The comparison surface then files owner data under "Hand it to someone else" beneath a tier badged "The packet", which tells that segment the tier is not for them while it holds the one thing they would pay for.

Separately, screens and boards carry no entitlement gate in either surface, giving away the set-level job the locked ladder reserves for Prospect, before Prospect has launched.

Evidence and method are in `_smartsite_gtm/03_ladder_recut_proposal.md`, read from `origin/main` at legacy-design-tools `394424f2` and hauska-map `fbda04aa`. Those four entitlement files were re-checked against `26068a1e` after LDT #573 and are unchanged, so the map holds as of this ruling.

## Structural commitment check

- Sell reasoning, not data: unchanged. No rung sells a data dump.
- Confidence earned: unchanged. No rung changes what a confidence signal means.
- Cost per jurisdiction: not in scope.
- Dual interface: preserved deliberately. The gate is applied at the TIER and both the workbench and the connector inherit it. The connector is not given a gate of its own, per `_decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md`.

## Reasoning

The locked principle is that tiers split on what the output IS, not on volume of the same thing, so that an upgrade reads as graduating rather than as a tax for using the product more. This amendment is the first cut that actually satisfies that principle at the Solo-to-Studio boundary. Answering one parcel and working a pipeline of parcels are different jobs. Before this, Solo and Studio were the same job with deliverables bolted on, which is why the largest audience had no reason to move.

The frame covers both audiences without a second story: the investor's list is deals, the architect's list is projects.

The commercial case, on the locked doc's own method: $100K MRR is 2,041 seats at Solo alone and 776 at Studio. A Studio-weighted mix cuts the seats an affiliate program must recruit by roughly sixty percent, which is the difference between recruiting a small city and recruiting a neighborhood.

Cost is one gate in two surfaces, plus copy and `pricing.ts`, which is config by design. Gating screens takes a capability from free users who hold it today; pre-market that population is approximately zero, making this the last cheap moment to do it.

Redefining Prospect is required rather than optional, because giving Studio the screening board eats Prospect's stated job. Monitoring is not a consolation: the locked doc already names alerts and saved searches as "likely the strongest retention mechanism in the product and the natural Prospect hook." Studio works a list today; Prospect watches it for you.

## Rejected alternatives

Reframe only, changing grouping and the badge without moving any capability. Insufficient alone, because Solo genuinely delivers the complete single-parcel answer and an honest buyer still has no reason to move. The reframe is included, but it does not carry the change by itself.

Moving the connector's `run_report` to Studio. Rejected and ruled out separately; it contradicts the "two doors, one truth" claim in the positioning master.

Metering Solo on report count. Rejected; it breaks the locked principle that tiers split on output rather than volume, which is the principle this amendment exists to satisfy.

## Reversal criteria

Reverse the screens move if a measured free-tier cohort shows screens are a primary activation event, because gating an activation event to reach a revenue goal costs more than it earns. That measurement is P-100's activation instrumentation, so this reversal criterion has a named instrument rather than being a sentiment.

Reverse the two-seat Studio if seat management cannot close self-serve, since the humanless ruling forbids a tier requiring a conversation.

Reverse the Prospect redefinition if a named buyer asks for set-level answers before alerts exist, in which case Prospect keeps its original job and Studio's screens are capped instead.

Do not reverse any part of this to make a rung more attractive without a measurement; that is the failure mode the ladder already had.

## Dependencies

Depends on nothing to rule. Implementation is OPS-16 P-101 and needs the tier gate in both surfaces plus the `pricing.ts` regroup. The two-seat Studio depends on P-94's Team roster server half, which is built.

Unblocks the affiliate segment lines, which could not be written while the target rung was unknown. Those lines remain an open operator ruling and are not settled by this record.

Does not touch prices, the share fidelity rule, or the connector.

## Counterparties

Internal. Property seat owns the gate and the pricing surface. Operator owns the segment lines and the Prospect launch timing.

## Amended 2026-08-31 by the P-101 scoping lane

The ruling stands. Two of its own statements were wrong and are corrected here rather than edited above. Evidence: `_inbox/2026-09-01_p101-scope_close.json`, read against legacy-design-tools `26068a1e` and hauska-map `8740558d`; the three load-bearing claims were re-verified independently by the planner before this amendment was written.

**Correction 1. "The two-seat Studio depends on P-94's Team roster server half, which is built."** Half wrong. The roster server half is built TEAM-ONLY, and what it exposes to a Studio subscriber is a 409. `resolveTeamSeatsPurchased` returns null for any tier that is not team (`peTeamSeatsFromStripe.ts:88`), `seatsPurchasedForWire` returns undefined the same way (`peTeamRoster.ts:108-115`), and `inviteTeamMember` throws `SEATS_PURCHASED_UNKNOWN` 409 on that undefined before it ever reaches the capacity check (`peTeamRoster.ts:304-311`). A unit test at `peTeamRoster.unit.test.ts:58` explicitly pins the no-Studio-seats behaviour and must be inverted rather than deleted. Studio two seats is therefore four coordinated server changes plus an unresolved Stripe question, not a copy edit. It is the item most likely to be scoped as copy and discovered to be a build.

**Correction 2. "Everything else in the proposal is copy and `pricing.ts`, which is config by design."** Wrong for the regroup. `PricingModal.tsx:61-65` hand-writes the three groups as a literal array with hardcoded testids, and nothing anywhere iterates `PE_PRICING.groups`. A lane that edits only `pricing.ts` ships a fourth group that renders nowhere, and the existing pricing-modal test still passes. Item 4 is a code change.

**A structural finding that outlives this row.** There are THREE copies of `subscriptionTierGrantsStudio`, not two: `peEntitlement.ts:52`, `smartsite-mcp/src/entitlement.ts:27`, and `hauska-map apps/property-explorer/src/lib/entitlementClient.ts:90`. Nothing prevents drift. The test named `"subscriptionTierGrantsStudio matches api-server predicate"` (`smartsite-mcp/tests/entitlement.test.ts:101`) asserts four hardcoded booleans against its own local copy and never opens the api-server file; the only occurrence of "api-server" in it is its own title. That is internal consistency wearing a divergence test's name, and one party editing one package satisfies both sides of it.

Consequence for this ruling, and it sharpens the ruling rather than weakening it: "the gate is applied at the TIER and both surfaces inherit it" is structurally true ONLY if the gate lives on the api-server route. It is false for any predicate-level gate, because a predicate would be a fourth copy. The route form genuinely works: the MCP's trusted-service path carries `SERVICE_API_KEY` plus `X-PE-User-Id` (`peServiceUserId.ts:28-39`) and `resolvePeEntitlement` reads the real tier from `pe_user_entitlements`, never from a header. The shipped precedent to copy is `get_smart_site`, which carries no local MCP gate and is enforced upstream at `research/brief`.

**Scope note.** Screens have no PE web client at all today; they are a connector-only capability, confirmed two independent ways (no route reference in hauska-map, and no screens path on the deep-proxy allowlist). So no web upgrade-prompt path is owed. The consequence that IS owed is on the connector: `create_screen` and `list_screens` are two of the three `APP_HOST_TOOLS` that mount the Smart Site panel, and the third is already paid-gated, so gating screens means a free connector user never sees the panel at all. That is a larger consequence than the phrase "screens move to Studio" conveys and it is an operator call, not an implementation detail.

**Routed out, not folded in.** Site plan CAD is sold Studio-only in `pricing.ts:167-171` and enforced in the MCP, but carries no `studioGated` flag in the PE workbench catalog (`reports-catalog.ts`), unlike terrain and records. That sold-versus-enforced divergence predates this ruling and gets its own item rather than riding P-101.
