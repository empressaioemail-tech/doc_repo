---
id: sales_pack_readme
title: Sales knowledge pack — README and chatbot setup (Cammie)
status: active
last_updated: 2026-07-29
applies_to: portfolio (sales-facing)
related: [07_product_line_summary, 76h_property_explorer_gtm, 07a_smartcity_product_positioning, 08_tiered_access_model]
owner: nick
---

# Sales knowledge pack

This folder is the approved external-facing corpus for sales. It exists so a salesperson (first user: Cammie) can learn the products, answer prospect questions accurately, and never accidentally repeat internal-only information. It is also the knowledge base for the sales Q&A chatbot.

## What Cammie sells

Three offerings, in her own small / medium / large framing:

| Size | Offering | Buyer | Sales cycle |
|---|---|---|---|
| Small | Property Explorer (the real estate app) | Realtors, investors, builders, architects, homeowners | Days. Share a link, they sign up. |
| Medium | Custom builds / property operations platform (Mox-style) | Property managers, apartment owners, portfolio operators, any business with property | Weeks to months. Relationship sale, discovery first. |
| Large | SmartCity OS | Small-to-medium municipalities | Months. Gov procurement, often grant-funded. |

All three are the same technology told to different buyers: one base layer of property intelligence (the digital twin), with whatever systems that buyer cares about wired on top.

## Files in this pack

1. `01_portfolio_story.md` — the one story that connects everything (the layer cake). Learn this first.
2. `02_property_explorer.md` — the real estate app. Features, personas, talk tracks, demo flow.
3. `03_smartcity_os.md` — the municipal product. Use-case-first positioning, the Bastrop proof.
4. `04_property_operations_custom_builds.md` — the Mox-style engagement and how to pitch it to any property operator.
5. `05_faq_and_approved_claims.md` — approved numbers and claims, things to never say, objection handling, discovery questions.

## Setting up the chatbot (Nick does this once)

Create a claude.ai Project named "Empressa Sales Q&A", upload these six files as project knowledge, and paste this as the Project's custom instructions:

> You are the product and technology Q&A assistant for the Empressa product line. Your user is a salesperson learning the products and preparing for prospect conversations. Answer only from the uploaded documents. When asked about pricing, timelines, or coverage in a specific place, give the documented answer and add "confirm current status with Nick before quoting this to a prospect." If the documents do not cover a question, say so plainly and suggest asking Nick or Valerie on Slack rather than guessing. Never invent statistics, coverage claims, customer names, or feature promises. Keep answers practical and sales-oriented: what it does for the buyer, how to say it, what to demo.

Then share the Project with Cammie's account in the Team workspace.

## Standing rules baked into this pack

These come from company policy and appear throughout the pack. The short version:

- Every claim a prospect hears must be true today or clearly labeled as coming soon. The product itself is built on "honest absence" (it says "not verified here" rather than making data up). Sales talk follows the same rule.
- No hard numbers (parcel counts, coverage percentages, savings figures) beyond what is listed in `05_faq_and_approved_claims.md`.
- Bastrop is our pioneering first city and design partner. Never describe a city as a data source.
- All data comes from uniform public records (appraisal districts, county courthouses, FEMA, state GIS). No special access, no scraped private data. That is a selling point, say it proudly.
- Use-case-first with every buyer. Lead with the problem solved, not the technology. The digital twin story is for people who ask "how does it work," not the opening pitch.
