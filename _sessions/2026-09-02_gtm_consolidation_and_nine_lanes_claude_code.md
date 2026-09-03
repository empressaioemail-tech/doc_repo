---
id: 2026-09-02_gtm_consolidation_and_nine_lanes_claude_code
title: Session — two GTM threads merged, nine lanes run, and five capabilities found starved
date: 2026-09-02
last_updated: 2026-09-02
status: complete
applies_to: smart_site
owner: doc_repo planner
related:
  - _smartsite_gtm/06_consolidated_roadmap
  - _smartsite_gtm/07_rails_by_persona_pricing_input
  - _smartsite_gtm/08_open_scope
  - _inbox/2026-09-02_gtm_pickup_card
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# Session, 2026-09-01 to 09-02

Opened by merging two parallel Smart Site go-to-market threads that were being retired. Closed with nine lanes run, eleven plan rows added, and six things shipped to production.

## What the merge found, and why it mattered

Each retired thread was stale where the other was current, and both were stale against the repo. Three reconciliations changed the plan rather than updating it.

**Nobody was activating Stripe.** One thread believed it was in flight with another agent group. The P-97 close is a read-only analysis lane whose scope basis excludes performing the switch as operator-owned. The entire affiliate program was queued behind a step with no one executing it.

**One of the two named pre-live code fixes had already shipped**, as hauska-map #325. Only the `pe-billing.ts` exposure remained, and it was the more serious of the two.

**A scoping lane corrected two claims in the ruling it was scoping**, and those corrections moved work between waves.

## Shipped to production

| Row | What landed |
|---|---|
| P-98b | Billing interval persisted and entitlement readable without a parcel. Migration `0092` applied. The `annual_upgrade` rung stopped being starved |
| P-103 | The legacy checkout seam retired, **proven by decline on the live host**, with a CI guard that catches a re-added parent prefix a grep would miss |
| P-104 | Studio enforced server-side across the whole web surface |
| P-105 | The share became a doorway: a Sync handoff for people, a connector offer for models, absolute URLs, five absence states |
| P-109 | `export_instrument` stopped being advertised as available |
| P-99 wave 0.4 | GoHighLevel pipeline and ten tags, built by API and verified by readback |
| Cold start | `min-instances=1` on both services, verified on the serving revision |

## Five capabilities were built, correct, and starved

The same shape appeared five times, and it is the defect class this operation is named against: the code exists, it has a trigger, and its gating precondition is never supplied, so it reports as success.

**`export_instrument`** refused in production because `HAUSKA_MCP_BASE_URL` and `HAUSKA_MCP_SERVICE_KEY` were unset. Every Studio deliverable was unreachable through the connector, which meant P-104 had spent a lane enforcing Studio gating on exports that could not be exported at all.

**Both services scaled to zero.** Eight cold starts in one day, request latencies of 81, 65, 58 and 47 seconds against a warm path under 4.3, which is what rendered Claude's own "Unable to reach Smart Site" card as a customer's first impression.

**Microsoft sign-in** is implemented with PKCE and has no client credentials in production.

**`export_instrument` again, one layer deeper.** The contract it calls has never existed in any server. `POST /tools/export_instrument` returns 404, and a test mocking the caller was the only thing making the contract look real.

**Nothing kept the tool catalog and the runtime agreeing.** Proven rather than asserted: with the pre-fix state restored, the compiler and the whole suite pass.

## Three findings where the data was right and the state was wrong

**The map does not draw.** Every overlay ships `geom: "none"` while the bake demonstrably held the polygon, because it computed area by shoelace and built a coordinate frame from the same ring. Logged for retest after the fills, with the falsifier pre-registered.

**346,165 parcels are told "not baked yet"** where the ruling says unincorporated reads not-applicable. The product says wait about something structurally impossible when the true answer is complete and better.

**16,113 Bastrop parcels carry `", ,"` as a situs**, so a naive non-null metric reports 96.2 percent coverage against 74.7 percent real.

## The governance finding

Three masters were carrying instructions retired weeks earlier. Masters 07 and 08 both still said a buyer's jurisdiction could be confirmed on request, which master 06 retired by name and date on 2026-08-10. Master 05 still called the agent door not commercially live, which P-87 superseded when the connector shipped.

An agent obeying "the masters win any conflict" without checking dates would have written all three wrong. **A master's `last_updated` is part of its authority**, and that belongs in any brief that cites the authority rule.

## Lanes that beat their own cards

**P-106** measured before projecting and contradicted the card on four rails: value and year-built are at zero in the bake in all six counties, ETJ has no source at all, land use is zero in three counties, and zoning's honest coverage is roughly double its present count because absent-verified is a real answer.

**P-101** was told to add a fourth pricing group. It found the group array was hand-written while nothing iterated the config, so it derived the array instead. The defect class is gone rather than the instance.

**P-109** was given a two-way fork and found a third state neither covered. It then declined the branch that would have pointed the export proxy at a Postgres DSN and put a live password in a workflow diff.

**P-108** was told to describe retention as built. It found that nothing deletes user data on a schedule, that account deletion orphans saved properties because two tables carry no foreign key, and that two already-published claims about sign-in were false.

## Planner errors, all caught, all the same shape

I produced values instead of reading them, repeatedly.

I fabricated a full commit SHA by padding a short one. I called a successful deploy failed by grepping its output for "error" without checking the ready state. I measured a typecheck twice with the wrong instrument before reading the authoritative build log. I recorded P-100 as committed when its code sat uncommitted in two worktrees, which surfaced only when a PR refused to open. I gave three lanes stale contention lists. I told a lane to write "six counties, never nationwide" in direct contradiction of a master I had not read. And I reached for a marketing page to answer a question our own credentials could have answered.

Every one was caught by measurement, a hook, or a lane. None by re-reading my own conclusion.

## Rows added

P-100 through P-112, plus A-062 carded and shipped. Eleven rows in two days.

## Left open

Nine pull requests, two unapplied migrations, four operator rulings that block named lanes, and the scope at `_smartsite_gtm/08_open_scope.md`.
