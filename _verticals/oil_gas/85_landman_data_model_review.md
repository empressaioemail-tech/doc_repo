---
id: 85_landman_data_model_review
title: Oil and gas data twin - landman review packet
status: exploration
last_updated: 2026-07-04
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 50_complete_product_plan, 60_data_package_and_providers, 70_market_thesis, 20_tech_to_og_map]
---

# Oil and gas data twin, landman review packet

> **What this is for.** A plain-language description of a product we are about to build, plus the exact list of data we plan to pull and how we plan to connect it, written so an experienced landman can check our work before we start. Your job on this is narrow and specific: tell us whether we have the right actors, the right data fields for each one, and the right relationships between them, and tell us what we got wrong or left out. We would rather fix the model on paper with you than after we have built it.

## What it is, in one paragraph

We are building a complete, always-current model of the public oil and gas record for the Permian, starting in Reeves County and expanding across the Texas Railroad Commission districts and southeast New Mexico. Every operator, lease, well, field, pipeline, and disposal facility in the public record, connected together and shown on a layered map you can turn on and off: leases, wells, laterals, production over time, who has operated what and when. On top of that public base, a company can privately load their own book (leases, interests, obligations, economics, even seismic) so they see their assets in the context of the whole field. It stays private to them. The first job it does is keep a landman or small operator from ever losing a lease to a missed obligation. Over time it becomes the place a book is managed, valued, and eventually sold.

## What it does

It pulls the public records, organizes them into one connected model rather than a pile of separate files, and keeps it current. From that model it can answer questions that today take hours of courthouse and RRC digging: who operates this acreage, which wells sit on this lease, what has this lease produced, who used to operate it, what is about to expire, where is disposal capacity tight. It shows all of it as a map with layers you toggle, including a time slider that lets you watch operators consolidate and production decline across years. Every fact carries where it came from, so nothing is asserted without a source.

## Who it serves

First, landmen, wildcatters, and small operators, the people running a book on spreadsheets today. The model is built so a large operator can also load a book of tens of thousands of leases later, but the small operator is who we build for first. Downstream, once books are on the platform, it serves buyers and sellers in the A and D market and the capital behind them.

## What we need you to check

Four things, and only these:

1. The actors. Are these the entities that matter in a real land and title workflow, and who is missing.
2. The data fields. For each entity, are we capturing the fields a landman actually needs, and which ones are wrong, misnamed, or absent.
3. The relationships. Do the connections between entities match how the business actually works, especially the oil lease versus gas well distinction and how units and pooling behave.
4. The gaps and the lies. What public data do you rely on that we have not listed, and where does the public record lag or mislead so we handle it honestly.

## The entities and the fields we plan to capture

Draft field lists. Please correct them. Source noted so you can tell us if we are pulling from the right place. "Public" means free public record we ingest; "private overlay" means a company's own data they load on top.

| Entity | Fields we plan to capture (draft) | Source |
|---|---|---|
| Operator | RRC P-5 (or NM OGRID) number, name, address, officers, status, financial assurance / bond, well and lease count | Public (RRC P-5, NM OCD) |
| Purchaser / transporter | P-4 purchaser, transporter, connection to lease and operator | Public (RRC P-4) |
| Lease (oil) / gas well ID | RRC lease number, lease name, operator, field, district, well count, status, acreage, legal description | Public (RRC) |
| Pooled unit | Unit name, tract makeup, participating leases, unit operator | Public (RRC / permits) |
| Tract / parcel | Legal description, PLSS survey and abstract, acreage, the unit ownership attaches to | Public (county / GLO) |
| Recorded instrument | Deed, mineral reservation, assignment, release, probate; grantor, grantee, date recorded, volume and page or instrument number, type, tract affected | Public (county clerk, GLO; aggregator where image-only) |
| Ownership interest (division of interest) | Owner, interest type (mineral / royalty / surface / working), fraction, tract | Public record chain plus private overlay |
| Field | Field name and number, reservoir, district | Public (RRC) |
| Well | API number, well name and number, well type (oil / gas / injection / dry / plugged), spud date, completion date, status, total depth, surface location, bottomhole location | Public (RRC, NM OCD) |
| Wellbore | Wellbore including sidetracks, directional survey, the horizontal lateral path | Public (RRC directional, W-2) |
| Completion | Perforated intervals, completed zones, completion date | Public (W-2 / G-1) |
| Pad | Grouping of wells at a surface site (we derive this) | Derived |
| Pipeline / gathering line | Segment, operator, permit, connection points | Public (RRC T-4), commercial where thin |
| Facility | Saltwater disposal / injection well, processing, tank battery, compressor; permit and volumes | Public (RRC H-10 / W-14) |
| Formation / zone | Formation tops, horizons (skeleton from public; detailed geology is private overlay) | Public (state geological survey) |
| Production | Monthly production, reported at the lease level for oil and at the well level for gas | Public (RRC PDQ) |
| Injection / disposal | Monthly injection volumes and pressures | Public (RRC H-10) |
| Operator transfer | Change of operator over time, with effective date | Public (RRC P-4) |
| Regulatory events | Permit (W-1), plugging (W-3), violations, severance, hearings | Public (RRC) |
| Private book | A company's mineral leases, working and royalty interests, obligations, division orders, AFEs, economics, seismic | Private overlay (company loads it) |

## The relationships we plan to model

In plain terms, and the ones we most want you to confirm:

An operator operates a lease or a well, and this changes over time. When a lease is transferred, the operator connection carries a start and end date so the model always knows who operated a given asset in any given year, not just today. That history is one of the most valuable things we can build, and we want to be sure we are sourcing the operator changes correctly.

A well is assigned to a lease for oil, and oil production is reported at the lease level. Gas wells report production on their own. We have modeled that split deliberately because we understand it is a common place people get the numbers wrong. Please confirm we have it right and tell us the edge cases (commingled leases, allocation wells, off-lease production) we should expect.

A wellbore is part of a well, and a completion is part of a wellbore, so a single well can carry sidetracks and recompletions without losing its history. A completion produces from a formation, which is what ties production to geology.

A lease sits in a field and a district. A pooled unit is made of tracts and participating leases. Production and injection are measured at the lease or the well. A permit authorizes a well. A pipeline connects facilities and leases.

Two things we know we need your read on. First, the word "lease" means two different things: the RRC lease is a production and regulatory unit, while the mineral lease a landman actually manages is a title instrument recorded at the county (or the state, through the General Land Office, for state acreage). We plan to model both and connect them. Tell us if we have the terminology and the connection right, and which "lease" your day to day actually revolves around. Second, obligations. We plan to track delay rentals, shut-in royalty, minimum royalty, and lease expirations at minimum. Tell us the full set that a real book has to never miss, including things like Pugh clauses, continuous development, and held-by-production status.

## Title and ownership (added after Herbert's first read)

Herbert flagged that the first draft said little about title, and he is right. Title is the center of the landman's work and it belongs here as a first-class part of the same app, not a separate thing. Here is how we see it fitting; correct it the way you would correct anything else.

What is public and what stays private. The recorded instruments themselves (patents, deeds, mineral reservations, assignments, releases, probates, affidavits) are public record at the county clerk, and at the General Land Office for state acreage. We ingest those into the same model, and it is the same county-records capability we are already building on the property side, so surface title and mineral title run on one system. The finished work product, a run sheet, ownership determination, division of interest, and curative, is private to the company that produced it and loads as their own overlay.

What we build. Assemble the chain: pull the recorded instruments for a tract into a chronological run sheet with each instrument's source image linked. Reason over it honestly: derive the ownership picture and flag the gaps and defects explicitly rather than assert a clean answer where the record is broken. We are not issuing a legal title opinion, that stays with counsel; we assemble the record and show the chain, the interests, and the holes, with a source on every link. And track it over time the same way we track operator history.

Title questions for you:

- What a usable run sheet and division of interest actually contain, and where the public records stop and your own work begins.
- How far back a chain needs to go to be reliable (sovereignty, or a marketable-title cutoff), and the defects you spend the most time curing.
- For Reeves specifically, whether the county deed records are reachable (through TexasFile or the county) in a form worth building on, or whether it is image-only and manual.
- Where title work most needs speed: the initial run, keeping the division of interest current, or curative.

## The map, and what it shows

The same records, shown as layers you toggle over the geography. Leases lead because they are the layer a landman lives in.

| Layer group | Layers |
|---|---|
| Surface (map view) | Lease boundaries and units, parcels and tracts, well locations by type, pads, pipelines and gathering lines, disposal and processing facilities, field outlines, district boundaries, terrain and flood |
| Subsurface (3D) | Wellbore paths including horizontal laterals, perforated intervals at depth, formation tops, injection zones |
| Time (slider) | Production over time, operator changes and consolidation over time, drilling activity over time, injection volumes and area earthquakes over time |
| Intelligence (computed) | Decline curves and estimated recovery, disposal pressure and seismic risk, operator portfolios and acquisition candidates, lease expiration and obligation risk |
| Private overlay | A company's own leases, interests, obligations, economics, and seismic, drawn over the public base and visible only to them |

## The specific questions for you

- Actors: who is missing. Mineral and royalty owners, the General Land Office for state leases, gatherers and midstream, service companies, working interest partners. Which of these do we need in the model and which are noise.
- Lease fields: what does a landman need on a lease record that we do not have, and what is the real obligation set to track.
- The oil lease versus gas well split, units, pooling, and allocation wells: did we get the production relationships right.
- Title and ownership: how much of the chain of title lives in public county records versus what a company would load privately, in your experience.
- What you rely on today: which public sources or reports do you actually use, and which are trustworthy versus which lag or mislead.

## What this is not asking you to judge

Pricing, branding, the business model, or the technology. Just the data and the relationships. If the model of the actual oil and gas record is right, everything else is our problem to solve.
