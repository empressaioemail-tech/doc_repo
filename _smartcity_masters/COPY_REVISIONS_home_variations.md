---
id: website_home_copy_revisions
title: Website homepage copy revisions — three variations
status: active
last_updated: 2026-08-02
applies_to: smartcity
owner: nick
related: [00_README, 31_smartcity_dashboards, 32_smartcity_asset_management, 33a_smartcity_plan_review, 34_smartcity_smart_files_and_foundation, 35_smartcity_positioning_framework]
purpose: Copy revisions for the three homepage variations in Home Options.dc.html and the built-out Home.dc.html. Hand this back to the design agent. Every line below is either drawn from an approved-claims register or is structural instruction. Layout, components, and visual design are not in scope and are not being critiqued.
---

# Website homepage copy revisions

Three variations exist: **1a Command Center**, **1b Editorial**, **2a Three Beats**. `Home.dc.html` is currently built out from 1a with a piece of 2a grafted onto it.

This document gives corrected copy for each. Read the section "Errors common to all three" first, because most of the problems repeat across variations and the fixes are the same each time.

---

## Errors common to all three

These are violations of the approved-claims registers in the category masters, not matters of taste. Each one needs fixing wherever it appears.

### 1. Fabricated metrics presented as product output

The dashboard mock carries `12 open incidents`, `$4.2M grant funds tracked`, `87 permits in review`, `99.8% systems uptime`. The stat band carries `6+ systems unified`, `24/7 operational view`, `0 rip-and-replace`.

`99.8% systems uptime` is an SLA claim we have not made and do not measure. `6+ systems unified` is a countable claim about a customer deployment. These read as our numbers, not as sample data.

**Fix.** The dashboard mock is illustrative and must be labeled as such, once, visibly: a small caption reading `Illustrative view. Sample city, sample data.` Drop `99.8% systems uptime` entirely and replace with a non-SLA tile. Drop the stat band from 1b entirely — there is no approved figure to put in it.

Replacement stat tiles, if tiles are wanted: `Open incidents`, `Permits in review`, `Grant funds tracked`, `Work orders open`. Values stay obviously sample-shaped.

### 2. A fabricated customer testimonial

> "We open one dashboard now instead of six logins before our first meeting." — City Manager, early access partner city

This is an invented quote attributed to an unnamed real-ish person. It appears in 1b and 2a. We have one live city, Bastrop, and it is identifiable by elimination.

**Fix.** Cut the quote card from both variations. If a quote slot is wanted in the layout, leave it out until a real, attributed, permissioned quote exists. Do not substitute an anonymized one.

### 3. Named third-party vendor logos in an integration wall

The integration list names Tyler Technologies, OpenGov, mygov.us, Esri ArcGIS, Power BI, CivicPlus, Granicus, CentralSquare, Accela, Municode.

Two problems. Approved claims permit describing connected operational systems generally, and explicitly bar naming a vendor feed as connected at a city that has not granted it. Several of these have never been connected anywhere. And a logo wall of named vendors reads as a partnership or endorsement claim we do not have.

**Fix.** Replace the named wall with categories, no vendor names:

> **Connects to what your city already runs**
> Permitting and land management · Finance and budgeting · GIS and mapping · Work orders and asset systems · Fleet and public safety · Records and agendas
>
> We sit over the systems you already have. Nothing gets ripped out.

### 4. "Every Module, Walked Through"

Wrong word and wrong altitude. "Module" is procurement-speak for a thing bolted onto a suite, and it directly contradicts the system-first discipline: Dashboards is a complete deployable system, not a module of something bigger. It also makes Asset Management sound like a switch to flip, when it is a build.

**Fix.** Heading becomes **What your city gets**. Subhead becomes `Three systems, each complete on its own.`

### 5. Property Insight Hub and Smart Site X-ray on the homepage

`Home.dc.html` has a panel headed `Property Insight Hub · Smart Site X-ray` and a section titled `The Smart Report — Inside Plan Review & Asset Management`.

Three separate problems in one panel. "Property Insight Hub" is retired vocabulary from the old four-product line. "Smart site" is the internal unit and is not a customer-facing word — a city manager should not have to learn a new noun before the value lands. And smart reports are a real thing but they are not a homepage story; two are live, and the library artifact that governs what may be enumerated does not exist yet.

**Fix.** Cut this panel from the homepage. If a fourth panel is needed for visual rhythm, use Smart Files, which is named, customer-facing, and the most immediately legible thing in the line:

> **Smart Files**
> Everything your city holds, in one place you can actually search. A document lives once and shows up everywhere it belongs, so when someone revises it, it is current everywhere at once — and the previous version is still there when you need it.

### 6. The AI assistant is oversold

> "Ask a plain question about your city's data and get an answer sourced from it, cited and current — in seconds, not a report cycle."

"In seconds, not a report cycle" is a time claim. The reworked assistant is also not shipped, and collateral must not present it as though it is.

**Fix.**

> **An assistant that can actually answer**
> Ask a plain question about your city and get an answer drawn from your own records, with the source attached. Every city has been pitched an AI assistant. The ones that disappoint fail because the systems underneath were never made readable. Ours works because everything underneath it was built to be read.

Keep the sample exchange in the mock, drop the timing claim.

### 7. Pricing and deployment timing claims

> "Most cities are live with their first dashboards in weeks, not years."
> "Standard plans start at an annual subscription plus a one-time deployment fee."

Government pricing tiers are an open operator decision that gates every pricing-bearing artifact. "Weeks, not years" is a delivery-time claim with nothing behind it.

**Fix.** Cut the timing sentence. Pricing block becomes:

> **Pricing**
> Pricing is set per city, based on which systems you deploy and what connecting your existing systems takes. Tell us what you run today and we will scope it.
>
> [Talk to us about pricing →]

### 8. "No sales call required" appears three times

It is the loudest repeated message on the page, and it is a self-serve SaaS trope aimed at a buyer who is not self-serve. A city manager evaluating an operating system for their city is not avoiding a conversation; they are trying to figure out whether this is real. Worse, the three-step flow it introduces promises a branded demo environment with sample data, which is a product commitment.

**Fix.** Use it once at most, and reframe the whole block around what a city actually wants first, which is to see it working somewhere real.

> **See it running**
> The fastest way to understand this is to see a city manager's actual view. We will walk you through a live deployment, then through what yours would look like with your departments and your data.
>
> [Request a walkthrough]

If the self-serve demo is genuinely built and shippable, it can stay as a secondary path — but confirm it exists before the copy promises it.

### 9. "Always current" / "all current" / "reconciled and current"

"Current" as an unqualified absolute contradicts the honest-decline discipline. The system verifies currency and declines when a source is stale; it does not promise everything is always current.

**Fix.** Say what is true and is stronger anyway: `checked against the source, with the date it came from attached`. Or drop the adjective.

### 10. The city manager view is described as a feature

2a gets this closest but still undersells it. The city manager lens is the *proof* the one-system claim is true, not the executive-summary feature. That distinction is the whole argument.

**Fix.** Wherever the city manager view appears, the sentence to use is:

> It is the only view that cannot exist unless everything underneath is genuinely connected. That is why it is the one to ask to see.

---

## Variation 1a — Command Center

**Direction verdict.** This is the weakest of the three as positioning, and it is the one currently built out. It opens on a product screen, which puts beat two first and skips beat one entirely. A city manager does not wake up wanting a dashboard; they wake up wanting to know why the permit backlog is six weeks. Opening on the artifact rather than the pain also puts us straight into feature comparison with every other vendor showing role-based views — the exact fight we do not want.

It is salvageable if the hero is reframed to lead with the pain and let the screen be proof rather than promise. Copy below does that.

### Hero

Current:

> **Live Right Now** / This is what your city looks like at 8:03am. / No mockup, no slideshow — an actual operational view. Incidents, budgets, permits, and projects, all current, all in one screen.

Problems: "Live Right Now" plus "no mockup" asserts the screen beside it is real production data, and it is not — it is a mock with invented figures. That is the one claim on this page a buyer could catch us on immediately, and the peer network is the distribution channel.

Revised:

> **Eyebrow:** One platform, not one more tool.
>
> **H1:** Your whole city, before your first meeting.
>
> **Sub:** Fifteen systems that don't talk. The same question answered four different ways. Money going to outside firms for work your team could do. This is what it looks like when that stops.
>
> **Buttons:** See a walkthrough · What you get
>
> **Screen caption (small, under the mock):** Illustrative city manager view. Sample data.

### Section 2 — the three systems

Heading: **What your city gets**
Subhead: `Three systems, each complete on its own. Start with one.`

**Panel one — Dashboards**

> **See it — Dashboards**
> **One picture of your city, and the right view for everyone who runs a piece of it**
> The city manager sees across everything. Development services sees the pipeline. Finance sees the money. Residents see what's theirs. Every view is drawn from the same record, so the numbers agree and the map is the same map. You decide who sees what.

**Panel two — Plan Review**

> **Decide on it — Plan Review**
> **Send less of your review out the door**
> Submittals arrive pre-reviewed against your own adopted code, cited section by section, with what passes, what fails, and what needs a human eye already sorted. Your reviewer accepts, edits, or overrides anything, and their decision is recorded with their reasoning.

**Panel three — Asset Management**

> **Own it — Asset Management**
> **Every physical thing your city is responsible for, in one place**
> Water mains, sidewalks, lift stations, streetlights, signals, parks, facilities, and vehicles become a permanent, connected record — where each one is, what condition it's in, what's been done to it, and who changed it and when. Built with you, around what you already have.

**Panel four — Smart Files** (replaces the Property Insight Hub panel)

Copy as given in common error 5 above.

### The differentiator section — currently missing, and it is the most important block on the page

1a has no section making the argument for why this is different. Without it the page is a feature tour. Add this after the three systems, before any CTA:

> ## What makes this different
>
> Every vendor in this market will show you role-based views over integrated systems. Four things here are not the same, and they are worth checking us on.
>
> **One record underneath, not four systems stitched together.** The reason the numbers agree across your departments isn't that we reconcile them nightly. There's one underlying record and each view is a window onto it. That's the difference between watching your city and knowing it.
>
> **Cited to your own code.** Findings point at the actual section your city adopted, not a generic rule, with the reasoning openable and your reviewer's judgment governing. We don't approve, permit, or certify anything. That stays your city's act.
>
> **It's yours, and it stays.** Your city owns its data. You're not locked to us or to any one host. Nothing is silently overwritten — the current version is everywhere it belongs and what it was before is still there.
>
> **We won't sell you the shallow version.** We don't sell a screen that shows your existing systems in a nicer layout. If that's what you want, you already have it. When a system connects to us, what it measures becomes a permanent part of your city's record. There's no cheaper tier that skips that, because that's the part that's worth anything in five years.

The fourth one is a refusal, and refusals are credible in a market full of claims. Do not soften it.

### Built for City Leadership

The three role cards are thin and one is wrong. "IT Director — one integration layer around your existing infrastructure, with security built in" sells to IT, who is not the buyer.

Revised, using the actual lead lenses:

> **City manager** — Across every department, in one view. The one screen that can only exist if everything underneath is genuinely connected.
> **Development services** — The permitting and development pipeline: what's in flight, what's stuck, where the backlog is, what's coming.
> **Finance** — Budget against actuals, revenue, spend, and the money view of everything the other departments are doing.
> **Residents** — Service requests, status, and what's happening around them.

Four, not three. If the grid needs three, drop Residents.

Do **not** claim citizen payment processing anywhere. It is UI-only with no backend.

### Foundation sentence

1a is missing it. Add it once, low on the page, understated, before the final CTA:

> If you're wondering how it actually works underneath: the way we capture and process data is the foundation for everything else to get built.

That is the whole external story of the foundation. One sentence. It is never named, never diagrammed, never a section heading.

### Closing CTA

> **See a city manager's actual view**
> The fastest way to understand this is to see it running. We'll walk you through a live deployment, then through what yours would look like.
>
> [Request a walkthrough]

---

## Variation 1b — Editorial

**Direction verdict.** The tone is right and the format is wrong for this buyer. A manifesto homepage asks a city manager to buy a worldview before they have been shown a working thing, and municipal procurement does not run on worldviews. The bigger problem is that the copy is generic — nothing in it is a claim only we can make, which is the one job positioning has.

Recommend this direction be dropped or merged into 2a rather than developed. If it is kept, the revisions below make it defensible.

### Hero

Current: `Governing is different now.` / `One platform, not one more tool.`

"Governing is different now" is a claim about the world that flatters us and says nothing. It could front any govtech company.

Revised:

> **Eyebrow:** One platform, not one more tool.
>
> **H1:** Nobody can see the whole city at once.
>
> **Sub:** Not the manager, not the department heads, not the council. Fifteen systems, fifteen logins, and no two of them agree when a question crosses a department line.

### The statement slabs

Current: `Six logins. Six passwords. Six places for something to be wrong before the morning meeting even starts.`

This one is good. Keep it nearly as-is, but "six" undersells a pain the masters state as fifteen. Align the number:

> Fifteen systems. Fifteen logins. Fifteen places for something to be wrong before the morning meeting starts.

Second slab, current: `SmartCity OS unifies every city department, sensor network, and data stream into a single operational picture — so your team spends less time context-switching and more time governing.`

This is the most generic sentence on the site. "Unifies data streams into a single operational picture" is what every competitor says. It also says nothing about the record being the city's, which is the part no competitor can say.

Revised:

> Three systems your city runs, on one foundation. Not fifteen tools stitched together into a nicer-looking layer — one record underneath, with each department seeing the part that's theirs.
>
> And the record stays yours. Your city owns its data, isn't locked to us or to any one host, and what something was before is still there when you need it. That's the part that matters in five years.

### Stat band

Cut it. `6+ systems unified` / `24/7 operational view` / `0 rip-and-replace` are all either countable claims we cannot support or filler. There is no approved figure to put here.

If the band is structurally needed, use the four differentiators as text, not numbers.

### Quote card

Cut, per common error 2.

### "What changes" checklist

Current items are weak and one is a repeat.

Revised:

> **What changes**
> One picture of the city, and the right view for each department
> Submittals arrive pre-reviewed against your own adopted code
> Every asset in one connected record, with its full history
> One search across everything your city holds
> Your data stays yours — and what it was before is still there

### Closing

Current: `Ready to see your city?` / `Enter your city name. No sales call required.`

Revised:

> **See it running in a real city**
> We'll walk you through a live deployment, then through what yours would look like with your departments and your data.
>
> [Request a walkthrough]

---

## Variation 2a — Three Beats

**Direction verdict.** This is the right one. It is the only variation that runs the pitch in the order the positioning framework specifies, and the only one that treats the city manager view as proof rather than as the hero. Build this one.

The copy is close. The problems are specific rather than structural.

### Hero — beat one

Current:

> Fifteen systems that don't talk. The same question, answered four different ways. / Money going to outside firms for work your team could do. Records that leave when the person who made them retires. That's the job today.

This is the strongest copy in the whole set. Two small fixes.

`That's the job today` is a slightly flat landing. And the headline is two fragments where one would hit harder.

Revised:

> **Eyebrow:** One platform, not one more tool.
>
> **H1:** Fifteen systems that don't talk to each other.
>
> **Sub:** The same question answered four different ways. Money going to outside firms for work your team could do. Records that walk out the door when the person who made them retires. That's the job today — and none of it is a tooling problem you fix by buying one more system.
>
> **Buttons:** See a walkthrough · What you get

### Beat two — the three systems

Heading `See it. Decide on it. Own it.` is correct and stays.

Subhead, current: `Three systems, deployed as one. Start with Dashboards; grow into Plan Review and Asset Management when your city is ready.`

"Deployed as one" contradicts "start with Dashboards" in the same sentence, and it also collapses the system-first discipline: each is complete on its own, and a city buys one.

Revised subhead:

> Three systems, each complete on its own. Most cities start with Dashboards and grow into the others when they're ready.

Card copy, current, has two problems worth fixing.

**Dashboards card.** Current: `Incidents, budgets, permits, and projects — reconciled from every system your city already runs.` This is a feature list. The card headline `One current picture, every department` also uses the absolute "current."

Revised:

> **See it — Dashboards**
> **One picture, and the right view for each department**
> The city manager sees across everything, development services sees the pipeline, finance sees the money, residents see what's theirs. Every view drawn from the same record, so the numbers agree and the map is the same map.

**Plan Review card.** Current copy is good. One addition — the buyer's actual reason is money and capacity, and the card leads with citation instead.

Revised:

> **Decide on it — Plan Review**
> **Send less of your review out the door**
> Submittals arrive pre-reviewed against the code your city actually adopted, cited section by section. Your reviewer accepts, edits, or overrides, and their judgment governs.

**Asset Management card.** Current: `Your city owns its data, isn't locked to us or any one host — current version everywhere, history kept.`

This is the ownership claim, which is right, but it is the *foundation's* claim rather than the asset category's, so the card says nothing about assets. Ownership belongs in the differentiator block.

Revised:

> **Own it — Asset Management**
> **Every physical thing your city is responsible for**
> Water mains, sidewalks, lift stations, signals, parks, facilities, and vehicles — where each one is, what condition it's in, what's been done to it, and who changed it and when. Built with you, around what you already have.

### Beat three — the proof

Current: `The city manager view is the proof.` / `It's the one view that can't exist unless everything underneath is genuinely connected — not six tabs stitched together for a demo.`

This is very close to right. Drop the "six tabs stitched together for a demo" clause, which is a swipe at unnamed competitors that reads as defensive.

Revised:

> **Eyebrow:** Your city, concretely
>
> **H2:** The city manager's view is the proof
>
> **Body:** It's the only view that cannot exist unless everything underneath is genuinely connected. Every vendor can show you a department screen. This one is the demonstration that the rest of it is true — which is why it's the one to ask to see.

Checklist items, current: `Every department, one reconciled record` / `Your existing infrastructure, kept` / `No sales call required to start`.

The third does not belong in a proof block.

Revised:

> Every department, one underlying record
> Sits over the systems you already run — nothing gets ripped out
> Live with the City of Bastrop, Texas, where leadership runs the city on it day to day

That third line is an approved claim and it is the strongest thing on the page. Use it.

### Add the differentiator block

2a is missing the four uncontested claims. Add the block exactly as written in the 1a section above, after beat three. At least one of the four should appear in any substantial piece of collateral, and this is where the page earns its argument.

### Quote card

Cut, per common error 2.

### Integration band

Replace with the category version in common error 3.

### Foundation sentence

2a already has this in the right place — low on the page, understated, one sentence. Current wording: `The way we capture and process your city's data is the foundation everything above is built on.`

Minor fix: the canonical sentence is `the way we capture and process data is the foundation for everything else to get built.` Use it verbatim. Prefix it with `If you're wondering how it actually works underneath:` so it reads as an answer to the one reader in ten who asks, rather than as a claim.

### Closing CTA

Current: `Ready to see your city?` / `Enter your city name and explore the dashboard. No sales call required.`

Revised:

> **See a city manager's actual view**
> We'll walk you through a live deployment, then through what yours would look like with your departments and your data.
>
> [Request a walkthrough]

---

## The never-say list, for the design agent

Do not put any of these in customer-facing copy, in any variation, including in image captions, alt text, or component labels.

**Vocabulary.** Digital twin. RWA. Tokenization. On-chain. Blockchain. Atom. Node. Graph. Substrate. Storage layer. IPFS. Content-addressed. Distributed storage. Smart site. Smart city as a product. Property Insight Hub. Operations Dashboard. Community Access Portal. City Pulse. GovTitle. Codex. Bluebeam. CitizenConnect. Module. The data foundation is never named at all.

**Numbers.** No cycle-time, savings, or ROI figures. No percentages. No uptime or SLA figures. No "weeks, not years." No count of systems unified, departments live, or assets under management. No customer's spend, named or implied. No pricing until government tiers are set.

**Capability.** No claim that the system approves, permits, or certifies. No review without a reviewer. No 3D delivery date. No claim records are distributed today. No citizen payment processing. No named vendor claimed as a connected feed. No claim the AI assistant sidebar is shipped.

**Attribution.** No invented testimonials. No anonymized quotes standing in for real ones. No competitor named anywhere.

**Screens.** Any dashboard mock carries a visible `Illustrative. Sample data.` caption. No screenshot may show verbatim body text from a licensed building code.

## Where copy comes from

Every line in a market-facing artifact comes from the External language or Approved claims register sections of the five category masters in `smartcity-masters/`. Everything above those sections in each master is internal reasoning — useful for understanding why a claim is true, never to be quoted or paraphrased into customer copy. Anything marked INTERNAL ONLY is a hard line.

A claim not in a register is not approved. If a page needs a claim that is not there, ask rather than write it.

## Recommendation

Build 2a. Fold the corrected differentiator block and the corrected hero into it. Drop 1b. Keep 1a's dashboard mock as the proof image inside 2a's beat three, with the illustrative caption, and discard the rest of 1a's structure.

`Home.dc.html` as currently built is 1a and should be rebuilt from 2a rather than patched.
