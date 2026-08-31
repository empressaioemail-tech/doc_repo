---
id: 2026-08-24_phase_close_live_qa_WDLL
title: Recalibration phase close — live QA cuts (owner gate, checkout popup, chat websearch)
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (land these cuts; canvas is the durable history)
amends: _inbox/2026-08-24_rebrand6_checkout_3b_WDLL.md
---

# WDLL: Recalibration phase close (live QA)

Operator walk 2026-08-24 on smartsite.cloud after the 3b elements hotfix. Three defects plus one Find toast. Isolated LDT tree for cortex items. Isolated hauska-map tree for PE items. Do not write `P:/seat-worktrees/property/legacy-design-tools` or `P:/seat-worktrees/property/hauska-map`.

3b money path stays: same sessions, same prices, same webhook, `uiMode: elements`, no invented card fields. This card changes chrome and gates, not the catalog.

## Done looks like

A signed-in free or Solo customer on 906 Chestnut (48021:34097) never sees GEAUXNU HOLDINGS LLC. Owner is a Studio and Team deliverable. Start Studio keeps the map and opens a payment popup in the same family as the pricing popup. Chat that cannot answer from the corpus (schools, ADU or subdivision text) runs a labeled web-search of trusted civic sources and cites that backup as web-search, not as a Hauska atom. Find no longer toasts a naked 404 when the parcel is already on the map.

## Acceptance items

1. **Owner serve is Studio or Team.** Cortex `ownerFact` (and any cadOwner / GIS owner sibling that can paint a name) omits `ownerName` and mailing unless the PE entitlement is `studio` or `team`. Anonymous, free, Solo, and the $15 unlock all receive a typed refusal (`studio-gated` or equivalent). Identified session is not enough. Share-loop full-fidelity stays the locked exception and is not reopened here. | check: ownerFactRead / facets tests; violate signed-in Solo fixture still carrying a name | depends: none | grade: [met] isolated tree; Solo / identified-only / unlock fixtures refuse; Studio may serve name. Live leftover. Dev-role still reads as Team.

2. **Owner paint matches the serve.** Inspect Owner row on live 48021:34097 hides the CAD name for signed-out and signed-in-free. The row is honest absence or an upgrade cue, never a leaked name. Chat and any other PE surface follow the same body. | check: InspectCard tests + live probe | depends: 1 | grade: [met] isolated tree; Solo + leaky name is upgrade cue. Live leftover.

3. **Subscription checkout is a popup.** Start Solo / Studio / Team from the pricing modal keeps the map mounted. Payment chrome is a modal sibling of PricingModal (left column Smart Site, right Stripe Payment Element). A full-page `/checkout` that unmounts the map is retired. Unlock stays a modal. `uiMode` stays `elements`. No invented card, email, or ZIP fields. | check: checkout action test + live hard-refresh | depends: none (3b serving) | grade: [met] isolated tree; clientSecret is modal. Hosted assign leftover. Live leftover.

4. **Chat web-search backup is labeled.** When PE chat cannot answer from corpus atoms (live instances: school assignment; GC ADU / additional unit / subdivision text), cortex runs the existing labeled web-search path against a trusted civic allowlist (official ISD, TEA, city, county). The answer cites `websearch:` (or equivalent) with a disclosure that this is a web-search backup, not a catalog atom. Corpus wins still cite atoms. Never fabricate ICC or code body. Never present web-search as verified corpus. Asserted confidence, provenance, timestamp. | check: chat test that a known corpus-miss fires websearch and a corpus-hit does not; violate unlabeled web text | depends: none | grade: [met] isolated tree; school-miss cites websearch:; ADU hit does not. Live leftover. Civic table is Bastrop / Georgetown / TEA.

5. **Find does not 404-toast a mapped parcel.** Typing or resolving 906 CHESTNUT ST, BASTROP, TX 78602 while `parcelNodeId=48021:34097` is already subject must not be the only outcome `Error fetch property search results: 404`. Either resolve or an honest miss with basis. | check: search client test + live Find | depends: none | grade: [met] isolated tree; subject match or honest miss. Live leftover.

## Do not

- Invent card, email, or ZIP fields.
- Rebuild checkout on PaymentIntents or a second webhook.
- Flip live-mode Stripe keys.
- Treat identified session as Studio.
- Start Travis identity-join, CAMA, or footprint in this card.
- Write property seat checkouts.
- Scrape or fabricate ICC section body.

## Amendments

2026-08-24: 3b item 4 full-page `/checkout` is retired in favor of a pricing-family popup because the operator rejected leaving the map after Start Studio landed.

## Sequencing

Item 1 then 2 on owner. Item 3 on the isolated PE tree from current serving main. Item 4 on isolated LDT (chat path) plus PE citation chrome if the chip is missing. Item 5 on the same PE tree as item 3. Hosted-kill stays last, after 4242 on the popup.

## leave_behind

- item: hosted checkout kill
  owner: property / LDT
  plan_row: P-60
- item: live-mode key + price ID swap
  owner: operator
  plan_row: P-60
- item: wallets / promo live proof
  owner: property
  plan_row: P-60
- item: Travis identity-join
  owner: later card
  plan_row: public-facts
