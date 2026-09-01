---
id: 03_ladder_recut_proposal
title: Ladder re-cut — Solo answers one parcel, Studio works a list (RULED)
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/00_README
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED
  - _decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier
  - 14_pricing_framework
purpose: The amendment to the LOCKED 2026-08-10 ladder, RULED 2026-08-31, and the verified capability map that is its evidence. Filename and id keep their slot so existing references resolve.
---

# Ladder re-cut

RULED 2026-08-31 by the operator. Decision record: `_decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md`. Implementation is OPS-16 P-101.

This document keeps its `proposal` filename and id so existing references resolve; read it as the ruled amendment. Prices are untouched. Only which capability sits on which rung changed, and one capability actually moves.

## The verified capability map

Read 2026-08-31 from `origin/main` in both repos, read-only, no working tree consulted. legacy-design-tools `394424f2`, hauska-map `fbda04aa`. This is what the gates enforce, not what the pricing popup claims.

| Capability | Actual gate | Enforced at |
|---|---|---|
| Map, layers, inspect card | none, anonymous | not gated |
| Save properties, screens and boards | signed in, any tier including free | `requirePeAuthenticated` only |
| Share, full fidelity | free, locked exception | share path |
| AI chat | 3 per property free, then paid | `PE_FREE_CHAT_MESSAGE_LIMIT` |
| Reports, X-ray and Flood and Drainage | paid, or a $15 unlock on that parcel | `requirePePaidOrPropertyUnlocked`, 4 route mounts |
| Owner data | studio or team | `callerGrantsOwnerFact`, `brokerageNodeFacets.ts` |
| Site plan CAD, terrain, records package | studio or team | `STUDIO_EXPORT_KINDS = ["siteplan","terrain","dossier"]` |
| Smart Site MCP, 11 of 13 tools | signed in, any tier including free | no gate in `tools.ts` |
| Smart Site MCP, `run_report` | paid, any rung | `tools.ts:817` |
| Smart Site MCP, Studio export kinds | studio or team | `tools.ts:851` |

Two gate points exist in the entire MCP surface. That is the whole tier system.

Method note. Each negative above was verified repo-wide rather than by a scoped grep, because a scoped negative is the failure mode this planner has recorded against itself. `requirePePaidDeep` returned zero non-definition non-test references repo-wide and is dead code superseded by `requirePePaidOrPropertyUnlocked`, which carries four live mounts. It is not a starved control and reporting it as one would have been a false alarm; it is worth deleting so a later reader does not mistake it for a live gate.

## The finding

Studio's entire differentiation is four items. Site plan CAD, terrain export, and the records package are professional deliverables that only an architect, designer, or builder wants. Owner data is the single item the investor, flipper, and agent segment wants, and that segment is the largest by the locked audience ruling. So for the largest audience, Studio is owner data for an additional eighty dollars a month.

The pricing table then argues against itself. Owner data is the third row inside a group titled "Hand it to someone else," under a tier badged "The packet." An investor reading that concludes Studio is the architect tier, while it holds the one thing they would pay for.

Two capabilities are being given away. The multi-parcel screening board, `create_screen`, `add_to_screen`, and `list_screens`, carries no entitlement gate anywhere in either surface. That is the set-level job the locked ladder reserves for Prospect, shipping free today, before Prospect has launched. And the connector is effectively a free-account capability, though that one is correct and deliberate per the connector ruling.

## What was ruled

Solo answers one parcel. Studio works a list of them.

This honors the locked principle that tiers split on what the output IS rather than on volume of the same thing. Answering one parcel and working a pipeline of parcels are different jobs, so the upgrade reads as graduating rather than as being taxed for using the product more. It also covers both audiences under one frame: the investor's list is deals, the architect's list is projects.

| Rung | Job | Capability |
|---|---|---|
| Free | See the place | Map, layers, inspect card, save, share, 3 AI messages per property |
| $15 unlock, 30 days | Answer this one parcel, once | Every report on that parcel, unlimited AI on it |
| Solo | Answer one parcel at a time | X-ray, Flood and Drainage, unlimited AI, unlimited properties |
| Studio | Work a list of them | Solo, plus screens and boards, owner data, records package, site plan CAD, terrain export |
| Team | Work a list as a firm | Studio, plus seats and shared properties |

The comparison table regroups to match the jobs: *Answer this parcel* for the Solo rows, *Work a list of them* for screens, owner data, and records, *Hand it off* for CAD and terrain, and *Work as a firm* for seats. Studio's badge stops being "The packet," because that phrase tells the largest audience the tier is not for them.

RULED: Studio moves from one seat to two, making it the "me and my partner" tier. The P-94 Team roster server half is already built, so the seat machinery exists.

## What this costs to build

Gating screens at the tier level, in both surfaces. The connector inherits the gate automatically because it mirrors the app rather than carrying its own gates, so this is one gate rather than two. Everything else in the proposal is copy and `pricing.ts`, which is config by design.

Gating screens is a takeaway from free users who hold the capability today. Pre-market that population is approximately zero, which makes this the last cheap moment to do it.

## The consequence ruled with it

Giving Studio the screening board eats Prospect's stated job, which the locked doc defines as "the set-level answer."

RULED: Prospect becomes the monitoring tier. Alerts and saved searches, tell me when something changes. The same locked doc already names that as "likely the strongest retention mechanism in the product and the natural Prospect hook." Studio works a list today; Prospect watches it for you. No collision, and Prospect keeps a genuinely different job rather than becoming a volume tier.

## Options considered and rejected

Reframe only, changing the table's grouping and Studio's badge without moving any capability. Rejected as insufficient on its own: Solo genuinely delivers the complete single-parcel answer, so an honest buyer still has no reason to move. The reframe is necessary and is included above, but it does not carry the change by itself.

Moving the connector's `run_report` to Studio, making Studio the agent tier. Rejected and ruled out separately: it contradicts the "two doors, one truth" claim in the positioning master, it takes back a shipped Solo capability, and it complicates the connector story exactly when P-88's directory listing wants a simple one. See `_decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md`.

Metering Solo on report count so Studio can be unlimited. Rejected: it breaks the locked principle that tiers split on what the output is rather than on volume, and that principle is the reason an upgrade reads as graduating instead of as a tax.

## Reversal criteria

Reverse the screens move if a measured free-tier cohort shows screens are a primary activation event, because gating an activation event to reach a revenue goal costs more than it earns. Reverse the two-seat Studio if seat management cannot close self-serve, since the humanless ruling forbids a tier that requires a conversation. Reverse the Prospect redefinition if a named buyer asks for set-level answers before alerts exist, in which case Prospect keeps its original job and Studio's screens are capped instead.

## Not in scope

Prices. The $49, $129, $299, and $15 amounts and the annual presentation are locked and untouched. Anything about the Hauska agent-operator catalog, which is a different buyer and a different pricing model.
