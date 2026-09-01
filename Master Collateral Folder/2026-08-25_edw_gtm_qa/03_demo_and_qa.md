---
id: 2026-08-25_edw_gtm_qa_demo
title: Smart Site demo and QA script
date: 2026-08-25
status: active
live_surface: https://smartsite.cloud
---

# Demo and QA

Work on the live map: https://smartsite.cloud

The map is the product. Tools open over it and close back to it. There is no site to click through.

## What a visitor should see

The map loads full-bleed. A visitor can dismiss any offer card and browse with no account.

Search an address or a parcel. Click a lot. The inspect card is free. It should show the facts this place actually has: land use, zoning, setbacks, buildable envelope, flood, acreage, and any city or utility chips that are live. Envelopes stay labeled approximate, not survey grade.

Where a fact is missing, the card names the miss. It does not invent a number.

Share is free. A share link flies the recipient to that lot with the analysis docked.

## Internal test parcels

These IDs are for QA and rehearsal. Do not put them on a marketing page as "our coverage."

| Parcel | What it proves |
| --- | --- |
| `48021:34137` (908 Pine, Bastrop) | Gold path. Title still 908 PINE. City limits incorporated Bastrop. Land use A1. Year built may show on the inspect wire as 1910. |
| `48453:280238` (Travis) | Honest miss. Structural / living-area path says lookup-failed at the declared CAD vintage. HTTP 200 is not a successful bind. |
| `48055:1` (Caldwell rural) | Unincorporated control. ETJ stays unresolved. Do not invent a city. |

**Gold living area.** Do not expect 2,800 sqft on 908 Pine. As of 2026-08-25 that live field is null. If a script still asserts 2800, the script is wrong, not the product.

## QA checklist (customer-visible)

1. Hard refresh smartsite.cloud. Map paints. No login required to click a parcel.
2. Gold 908 Pine docks. Title is 908 PINE, not a comma-TX stub and not "Property Explorer."
3. Inspect shows honest chips. Missing facts are named, not blank and not guessed.
4. Travis 280238 does not look like a successful living-area bind.
5. Pricing / Start Solo opens a popup. The map stays up. No full-page `/checkout` that replaces the map.
6. Share from a saved property lands a recipient on the map, not a dead page.
7. No 3D control. No valuation number. No "approved" or "permitted" language on the card.

## What you are not grading

County leftover counts. Factory SHA pins. Atom writers. Stripe live-mode. Command Center. SmartCity Dashboards. Those are other rooms.

## Deep features

Live reports today are the X-ray and the Flood and Drainage study. Feasibility and Comparison are locked as reports but are not live generate paths. Comparison as a side-by-side tool is live. Brief and Records are tools. Site plan and terrain are exports. Confirm each on the live surface before a customer-facing demo that depends on it. If it is not on the card today, do not pitch it as live.

AI chat is property-anchored. It may only cite records that exist for that lot. A wander off the parcel is a defect.

## Trust beat (use this when someone asks "how do I know")

Open a citation. Then show a named miss. The product admitting what it does not know is the proof for what it does.
