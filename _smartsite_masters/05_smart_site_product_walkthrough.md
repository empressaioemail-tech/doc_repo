---
id: smartsite_masters_05_product_walkthrough
title: Smart Site product walkthrough — what a user sees and does
status: active
last_updated: 2026-08-27
applies_to: smart_site
owner: nick
purpose: A user-level walkthrough of the Smart Site application for biz ops and biz dev. What each surface does, in the order a user meets it. Grounded in the live application, not the roadmap; where a capability is staged rather than live, this doc says so.
---

# Smart Site product walkthrough

Smart Site is a map-first web application. There are no pages to navigate; the map is the product, and every tool opens over it and closes back to it. It installs to a phone as an app, so the answer is in hand standing on the site.

## First open

The live map loads first, full-bleed, with a sign-up card floating over it. The card makes the offer plain: tap a parcel for zoning, setbacks, and buildable envelope where verified; real records, cited and dated, with gaps shown as "not verified," never fabricated; free to browse, with deep research and reports behind an account. A visitor can dismiss the card and just browse, no account required.

Shared links skip all of this: a link to a specific smart site opens the map already flown to that property.

## The map

The base map is a dark, editorial style with a satellite/aerial view. The layers a user can toggle:

- Parcel boundaries
- Zoning and land use
- FEMA flood zone and regulatory floodway
- Contours (1-foot elevation)
- Hydrography (streams and water features)
- Sidewalks and footpaths
- Opportunity Zone tracts

One-tap presets bundle these for common reads: Default, Flood (parcels + FEMA + hydrography), Entitlement (parcels + zoning), Terrain (parcels + contours). Map tools include measure (distance and area), draw and annotate, drop a marker, and jump to my location.

Search understands parcels, addresses, streets, and places, with type-ahead and recents.

## Tap a parcel: the inspect card

Clicking any parcel opens an instant card with the core read: land use, zoning district, setbacks, the buildable envelope, flood status, acreage. This card is free, by rule: whatever is in it costs nothing and needs no login. It is the hook and the demo.

Two behaviors distinguish it from every competitor's popup:

- The numbers are served from verified, precomputed records, not fetched-and-hoped. Envelopes carry "approximate, not survey grade" honestly.
- Where a fact is not verified for that place, the card says exactly that, in plain words, naming what is missing. It never shows a guess.

## The workbench

Everything deeper lives in a small cluster of tools that open one at a time into a single dock beside the map. The design law: the map and the property stay the star; there is never a split screen, never a second permanent panel. Each tool remembers its state per property.

**Property brief.** The X-ray view of the active smart site. It leads with a verdict line, a plain-English glance ("buildable, low flood risk, standard residential lot, no red flags") composed from the verified facts, with red flags like floodway placement leading when present. Below the verdict: the cited detail. Exports as the Smart Site X-ray PDF, with verdict, cited facts, the user's notes and research summary, and the site plan sheets appended.

**AI chat.** Property-anchored research chat. Every thread is tied to a smart site; there is no free-floating chatbot. Answers cite the property's actual records with numbered, tappable citations; tapping one opens the evidence, claim, source, confidence, date, and lets the user walk the reasoning chain in place (the envelope traces to the setback rule, the setback rule to the code section). The assistant can only cite records that exist; where the record is absent it says so. Users can run multiple threads per property, attach documents as context, and pick up any thread later. Starter prompts meet investors where they are: "Can I add a unit or subdivide?", "Does it pencil?", "What kills this deal?"

**Reports and exports.** Three deliverables:

1. *Site plan export.* Layered CAD (DXF and IFC) plus a PDF sheet: property lines, dimensions, setbacks drawn, contours, elevation labels, named streets, north arrow and scale, with a summary block and a provenance panel citing where every line came from. This collapses the one-to-three days an architect spends assembling a site base into one download. Every sheet carries the honest line: derived from public records, not a boundary survey, not for legal record.
2. *Flood and drainage study.* A real computation, not a lookup: the upstream catchment, drainage zones where water concentrates, modeled ponding at design rainfall, and traced flow lines, rendered directly on the map over the property, with a plain-language briefing and a formatted PDF. This answers "what does the water do to it" the way the inspect card answers "what can I build."
3. *Terrain export.* The site's terrain as a solid model (GLB, IFC, DXF) ready to drop into design tools. A Pro feature.

**My properties.** Saved smart sites, each holding its brief, drawings, notes, and research. Saving is the accumulation loop: the product becomes the user's working set of places.

**Compare.** Two saved properties side by side.

**Share.** The viral loop. A share link carries the user's analysis, the brief, the drawings, the site plan, not just a pin. The recipient lands on the live map, flown to the property, with the analysis docked, and a sign-up prompt. "I'll share your smart site with you" is this button.

## The trust surface (what to demo when trust is questioned)

- Every substantive answer carries citations that open. A citation is a promise you can verify, not decoration; the system is built so the AI cannot invent one.
- Confidence is always labeled with its basis and never dressed up. Freshness is computed and shown; missing vintage means no badge, never a fake "current."
- Honest absence is styled distinctly and named specifically. The system telling you what it does not know is the proof you can trust what it does.
- Sources found by web search (when used as supplementary context) are visually distinct and labeled unverified; they can never borrow the authority of a verified record.

## Accounts and gating

Browsing is anonymous. An account (Google or Microsoft sign-in) adds saved properties and 3 free AI messages per property. The paid tiers ($15 per-property unlock; Pro subscription) are described in the GTM master. The gate has one rule the demo should show: reaching for any deep feature surfaces one unified unlock moment with two choices, never a different paywall per button.

## Capability notes (internal, keep collateral honest)

- **Reports:** live generate today is the X-ray and the Flood and Drainage study. The locked menu also names Feasibility and Comparison as reports; those generate paths are not live. Comparison as a side-by-side tool is live. Brief is the inspect dock. Records is a request tool. Site plan and terrain are exports. Do not pitch a report that is not on the live card.
- **3D:** there is no 3D or tilted view in the current product. The groundwork exists and the push is deliberately paused; do not show or promise 3D.
- **Valuation:** deliberately out of scope. The starter chip "Does it pencil?" drives constraint-and-cost reasoning on cited facts, not an opinion of value.
- **Agent door:** the programmatic agent interface is architecture-true (same records, same citations) but not commercially live; speak of it at architecture altitude, not as a shipping feature.
