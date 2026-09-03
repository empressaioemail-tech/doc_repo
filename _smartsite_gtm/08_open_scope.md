---
id: 08_open_scope
title: Open scope — everything left, sized and sequenced
status: active
last_updated: 2026-09-02
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/06_consolidated_roadmap
  - _smartsite_gtm/07_rails_by_persona_pricing_input
  - _inbox/2026-09-02_gtm_pickup_card
  - 90_operations/OPS-16_texas_market_plan_of_record
purpose: One scope for the work that remains, ordered by what blocks what and separated by who can move it. Written at the 2026-09-02 session close, when nine PRs were open and eleven plan rows had been added in two days. The roadmap in 06 is the wave plan; this is the ledger of what is actually left.
---

# Open scope, 2026-09-02

Eleven plan rows were added across 2026-09-01 and 09-02. Nine pull requests are open. This document is what remains, why, and in what order.

## 1. The merge chain, and why the order is forced

Nine PRs are open and they cannot merge in an arbitrary order.

| Row | PRs | Depends on |
|---|---|---|
| P-109 export catalog honesty | LDT #588 | merged 2026-09-02 |
| P-108 public pages | hauska-map #339 | merged 2026-09-02 |
| A-062 billing portal | LDT #583, hauska-map #334 | client needs the server route deployed first |
| P-100 instrumentation | LDT #584, hauska-map #335 | client needs the server plus migration `0093` applied |
| P-101 ladder re-cut | LDT #586, hauska-map #337 | client needs the server gate live |
| P-106 constraint search | LDT #580 | independent; fails safe on its unbuilt projection |

Every LDT merge puts the remaining LDT branches behind, so each needs a branch update and a fresh CI run. That is the cost of a queue this deep and it is unavoidable now; the lesson for next time is that four lanes against two repos produces a serialisation tax that four sequential lanes would not have.

Two migrations are written and unapplied: `0093` for P-100 and `0094` for P-106. Neither runs on merge. Both need a deliberate dispatch, and P-106 additionally needs its projection populated before `find_parcels` returns anything but a declared refusal.

## 2. Rows carded and not started

**P-102 Studio two seats.** Four coordinated server changes behind a 409, plus an unresolved Stripe product question. Deliberately split out of P-101 so the fast half could ship.

**P-107 out-of-coverage miss class.** Ruled by the operator 2026-09-02. Held only because it edits `find_parcel` in `tools.ts`, which open PRs hold. Goes as soon as the queue clears.

**P-110 the export rewire.** Blocked on a commercial ruling, not engineering. See section 4.

**P-111 the account-deletion orphan.** Simplified by the operator ruling that beta data may be wiped, so this is a foreign key and a wipe rather than a careful migration.

**P-112 more ways in.** Apple, Microsoft and email. See section 3, because the three legs are not the same size and one decision governs all of them.

**P-88 the directory listing.** Copy prepared and verified, deliberately not filed. Revisit when coverage broadens or when the share loop plateaus, whichever comes first, and let P-100's numbers decide rather than judgment.

## 3. P-112, and the one decision that sizes it

Measured 2026-09-02 rather than assumed:

**Microsoft is built and unconfigured.** `api/auth.ts` already implements `/api/auth/microsoft/start` and `/callback` with PKCE beside Google, and carries a `notConfigured` path. Vercel production holds the Google client pair and `OIDC_STATE_SECRET` and no Microsoft pair. So Microsoft is an Azure app registration and two environment variables. Not a build.

That is the third instance in one session of the same shape: the code exists, the gating precondition was never supplied, and the capability reports as missing. `export_instrument` and the `min-instances` cold start were the other two.

**Apple is a real build.** Its client secret is a signed JWT that expires at six months, so it needs generation and rotation rather than a static secret. An Apple Developer account, a Services ID and a private key are prerequisites.

**Email is a real build.** It needs a sender, and `RESEND_API_KEY` already exists in Secret Manager. Magic link versus one-time code is a product call with different security shapes.

**The governing decision is WorkOS.** Today it does exactly one thing: the connector's OAuth completion. It is not the web sign-in, despite two published pages having said so until P-108 corrected them. If WorkOS becomes the front door for every provider, Apple and email become configuration inside one integration, one vendor and one bill, and Apple's JWT rotation stops being ours. If it stays connector-only, both are direct builds and the rotation is ours to run.

That single choice decides whether P-112 is an afternoon or a week. Settle it before dispatching.

## 4. What only the operator can move

**Rulings that block named lanes.**

P-106's unmeasured threshold. The lane proposes fifty percent on a bimodal distribution: every live rail sits between zero and fifty-seven percent unmeasured, every dead one is exactly one hundred, and nothing exists between fifty-eight and ninety-nine. At fifty it refuses eight of thirty-six rail-county pairs and every county keeps at least three usable rails. It ships no default, so unset means no gate.

P-106's zoning divergence. The projection derives absent-verified from two independent inputs where the serve path derives it from one and says unknown. They disagree on 346,165 parcels and the projection is right. The question is whether to teach the serve path the better rule, which turns those parcels from "we do not know" into a real answer.

P-110's metering. The Hauska export tools are SDK-metered per call while these callers already paid Stripe for Studio. Hauska Inc and Legacy Group ATX are separate entities, so this is intercompany billing rather than accounting. Nobody can wire the export path until it is answered, because the answer decides whether exports are profitable at one hundred and twenty-nine dollars.

P-112's WorkOS posture, per section 3.

**Decisions with no lane waiting.** The GoHighLevel sub-account posture, cheapest to change now while no contact exists. The four affiliate segment lines. Whether valuation output may surface. The "brief" glossary conflict. Whether the extension still sells Pro and Max. Whether `dossier` means the same thing on both surfaces. Whether the share plane requires a `graph_opt_in`.

**Clocks running outside our control.** A2P 10DLC registration and the DNS records for `email.smartsite.cloud`. Both are the operator's and both have external lead times.

**The switch.** Stripe live activation, which clears thirty-eight stale test-mode customer ids as part of it and unblocks PromoteKit and the affiliate launch behind it.

**Cotality.** The held credentials still fail token mint with `oauth.v2.InvalidClientIdentifier` and were last written in June. Whatever came online has not reached us. New client credentials plus the MCP tool list and schemas are the ask, and the reply is drafted.

## 5. Logged, retest rather than card

**The map does not draw.** Every draw overlay ships `geom: "none"` while the bake demonstrably held the polygon, since it computed area by shoelace and built a full coordinate frame from the same ring. The operator's read is that the fills will fix it. The falsifier is pre-registered: a freshly filled parcel still serving `geom: "none"` means the defect is in the draw-block assembly and needs its own lane.

**Flood citations are degraded** on the rail the Central Texas wedge is built on. The scout found panel effective dates in NFHL layer 3 and base flood elevations in layer 16, neither of which our adapter has ever queried. That is a re-ingest rather than an acquisition, and it deepens the wedge for nothing.

**The situs sentinel.** 16,113 Bastrop parcels carry `", ,"` as an address, so a naive non-null metric reports 96.2 percent coverage against 74.7 percent real. Bastrop-specific; Travis and Williamson are clean.

**The unincorporated setback state.** 346,165 parcels are told `atom_path_pending`, meaning not baked yet, where the ruling says unincorporated reads not-applicable. Same finding as P-106's zoning divergence, reached from the other direction.

## 6. The one open product question

Constraint search is Studio's headline capability and it is reachable only through the connector; it touched zero web UI files. That is on-pattern for the MCP-first rule, but it means "Studio works a list" is currently true only for connector users, and a Studio subscriber in the web workbench has no way to build one.

Decide whether the web half is a follow-on row or whether this stays a deliberate connector differentiator.

## 7. What is not in scope

The MLS and sale-price route is closed by ruling and does not reopen on a partner holding an agent licence. The directory listing is prepared and deliberately unfiled. P-102 waits for the queue. Nothing here proposes new acquisition, a second store for a subject that already has one, or a capability the masters do not support.
