---
id: 2026-09-02_gtm_pickup_card
title: Pickup card — Smart Site GTM and product, as the fills close in
date: 2026-09-02
last_updated: 2026-09-02
status: active
applies_to: smart_site
related:
  - _smartsite_gtm/06_consolidated_roadmap.md
  - _smartsite_gtm/07_rails_by_persona_pricing_input.md
owner: nick
purpose: One page a fresh context can pick up from. What shipped, what is built and waiting, what is blocked on the parcel fills, and what only the operator can move. The full wave plan stays in 06; this is the state on top of it.
---

# Pickup card, 2026-09-02

The parcel-record fills are closing in. Everything below is ordered by whether it waits on them.

## Shipped and live

| Row | State |
|---|---|
| P-98b | Billing interval persisted, entitlement readable without a parcel. Migration `0092` applied. The `annual_upgrade` rung is no longer starved |
| P-103 | Legacy checkout seam retired, proven by decline on the live host, with a CI guard that catches a re-added parent prefix a grep would miss |
| P-104 | Studio enforced server-side across the whole web surface. `cortex-api-00689-dal` emits `studioGranted` |
| P-99 wave 0.4 | GoHighLevel Affiliate Recruiting pipeline and ten tags, verified by readback |
| Cold start | `min-instances=1` on cortex-api and smartsite-mcp, verified on the serving revision. Eight cold starts a day were rendering the host's "Unable to reach Smart Site" card |
| Blast radius | 38 stale test-mode customer ids measured, 9 and 29 |

## Merged, awaiting a deploy

**P-105 share handoff** (`0aec477b`). The recipient of a share now gets a doorway rather than a dead end: the Sync handoff on the human view, a connector offer in availability voice on the agent formats, absolute URLs, and absence split into five states each carrying agent guidance. Needs a PE deploy.

## Built, not merged

**P-106 constraint search** (LDT #580). The capability that lets someone ask a question across parcels rather than look up one. **MCP-only: it touched zero web UI files.** Blocked on two rulings and an unapplied migration `0094`, so nothing runs live yet.

**A-062 billing portal.** LDT #583 and hauska-map #334. This is the item that gates the Stripe live switch, because `terms.html` promises an in-product cancellation path that does not exist.

**P-100 share and funnel instrumentation.** LDT #584 and hauska-map #335, migration `0093` unapplied. It found the Smart Site share plane emitted nothing at all, and that `pe_share_grants` already existed so only the join was missing.

**Correction to an earlier version of this card:** it recorded A-062 and P-100 as "committed on branches." A-062 was; **P-100 was not.** Its code sat uncommitted in two worktrees, 20 files and 7 files, and was only found when a PR refused to open with "no commits between main and the branch." Both are committed and pushed now. The lesson is that a lane close reporting a diff is not evidence the diff was committed, and the planner recorded a state it had not checked.

## Carded, not started

P-101 ladder re-cut, dispatch compiled and ready. P-102 Studio two seats. P-88 vendor directory listing, still the only unassigned row and the one that turns the connector from a reason to stay into a way to be found.

Two defects found this session and not yet carded:

**The unincorporated setback state.** 346,165 parcels across six counties are told `atom_path_pending`, meaning "not baked yet", where the 2026-08-31 ruling says unincorporated should read `not-applicable`. The product says "wait" about something structurally impossible, and the true answer is both complete and better. P-106's projection already earns the right answer from two independent inputs, so the fix is teaching the serve path the rule the projection already knows.

**The situs sentinel.** 16,113 Bastrop parcels carry `", ,"` as an address. A naive non-null metric reports 96.2 percent situs coverage against 74.7 percent real. Bastrop-specific; Travis and Williamson are 0.0. `find_parcel` already holds both the address point and the geometry, so it could bind them and declare the binding inferred.

## Logged, retest after the fills land

**The map does not draw.** Every draw overlay ships `geom: "none"` while the bake demonstrably held the polygon, since it computed the area by shoelace and built a full coordinate frame from the same ring. Operator read is that the fills will fix it. The falsifier is pre-registered: if a freshly filled parcel still serves `geom: "none"` on the serve path, it is the draw-block assembly and needs its own lane.

**Flood citations are degraded** on the rail the Central Texas wedge is built on. The scout close found panel effective dates and BFE sitting in NFHL layers 3 and 16, which our adapter never queried. That is a re-ingest rather than an acquisition.

## Only the operator can move these

**Clocks running outside our control.** A2P 10DLC registration. DNS records for `email.smartsite.cloud` once the Chrome runbook produces them.

**Decisions.** The GoHighLevel sub-account posture, cheapest to change now while no contact exists. The four affiliate segment lines. Whether valuation output may surface. The "brief" glossary conflict.

**Rulings owed to specific lanes.** P-106's unmeasured threshold, proposed at 50 percent on a bimodal distribution. The zoning divergence, where the projection is better informed than the serve path on 346,165 parcels. Whether the extension still sells Pro and Max. Site plan CAD scope. Whether `dossier` means the same on both surfaces. Whether the share plane requires a `graph_opt_in`. Whether `claude.ai/new?q=` prefill works, which two of our own records disagree on.

**The switch.** Stripe live activation, which clears 38 stale customer ids as part of it and unblocks PromoteKit and the affiliate launch behind it.

**Cotality.** Held credentials still fail token mint with `oauth.v2.InvalidClientIdentifier` and were last written 2026-06-06 and 06-15. Whatever came online has not reached us. New client credentials plus the MCP tool list and schemas are the ask.

## The one open product question

Constraint search is Studio's headline capability and it is reachable only through the connector. That is on-pattern for the MCP-first rule, but it means "Studio works a list" is currently true only for connector users. Decide whether the web half is a follow-on row or whether this stays a connector differentiator deliberately.
