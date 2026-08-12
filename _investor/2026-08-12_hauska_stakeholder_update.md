---
id: 2026-08-12_hauska_stakeholder_update
title: Hauska stakeholder update — August 2026
date: 2026-08-12
status: draft for operator review
owner: nick
supersedes_style: Hauska_Platform_Overview_April_2026
related: [_investor/2026-08-12_hauska_investor_update, _STATE.md, portfolio_thesis/01_the_layer_and_the_three_doors]
purpose: Investor-facing letter, written as a continuation of the April 2026 stakeholder update. Same voice and structure; reports what changed between April and August. Reports wins only per operator direction; the full picture including open work lives in the companion fact sheet at 2026-08-12_hauska_investor_update.md.
---

# Company Overview

### Infrastructure for Digital Asset Ownership, Municipal Intelligence, and AI-Native Application Development

**August 2026 · Stakeholder Update**

---

## Since April

In April we told you the durable value was not in the surface layer but in the infrastructure underneath, and that we were leaning further into that layer while continuing to build interfaces that drive usage, revenue, and distribution.

Four months later that is no longer a position we are arguing. It is the work we spent the summer doing.

The thesis has not changed. What has changed is that the layer got built, at scale, in the hardest domain we could have picked, and we now have the numbers to show it rather than the conviction to assert it.

Three things happened between April and now.

**We built the physical-world layer.** Not a demonstration and not one county. Eighteen and a half million records covering essentially every property in Texas, assembled from county appraisal rolls, city ordinances, federal flood maps, and state terrain, reconciled against each other, each one carrying its source and its date.

**We made it fast enough to matter.** A rebuild of the write path took throughput from roughly twenty records per second to more than eleven hundred. Measured, in production, on the largest counties in the state.

**We turned the interfaces into businesses.** Municipal pricing is set and submitted to a public-sector distribution channel. The professional product has a locked pricing ladder and a launch path that requires no sales organization. A third line found its first customer without us looking for one.

---

## What we actually built

In April the SDK was the story: ownership, access, payment, and document storage unified into one system, with revenue accruing to the platform on the contract layer as assets move through it. That remains the foundation, it remains the revenue engine, and it is unchanged.

What we added is the layer the SDK was always going to need underneath it: **verified truth about physical places.**

This is the part that is genuinely hard, and it is the reason we spent the summer on it rather than on more applications. Ownership infrastructure is only as good as the record of the thing being owned. You can build flawless machinery for controlling access to a document about a property, and it is worth very little if nobody can establish what the property is, what may be built on it, what the water does to it, or whether the ordinance governing it was repealed last year.

Those facts are public. They are also unusable, scattered across a thousand county systems, PDF ordinances, and appraisal rolls that were never designed to be joined and do not agree with each other. Nobody had assembled them because the work is unglamorous, slow, and easy to do badly.

We assembled them. Every fact in the layer carries its source, its date, its confidence, and its access rules as part of what it is. There is no path in the system that produces a fact without them. Where the record does not exist, the system says so with a stated reason rather than producing a plausible number.

That last property matters more than it sounds. A system that mechanically cannot fabricate is worth more, in a domain where answers inform permits and purchases and loans, than one that is usually right. It is also the thing that makes the layer safe to build on: everything above it inherits the guarantee.

And it is what turns the layer into volume. Every application built on it moves assets, documents, and transactions through the contract layer, which is where the platform earns. The layer does not replace the revenue engine. It feeds it.

---

## The numbers

For the first time, this update can report the platform in measurements rather than descriptions. All figures are from live systems in the last several days.

**18.5 million records** in the store. **11.6 million of them are individual properties**, across **252 Texas counties**.

**253 of 254 Texas counties** carry parcel geometry. The single exception is a county whose state source returns an error at origin. We know exactly which one and exactly why, which is the distinction the entire system exists to preserve.

**2.4 million flood-hazard records across 177 counties**, written with zero verification failures.

**1.39 million oil and gas wells**, joined to their counties at 99.88 percent across all 254, alongside 491,178 pipeline records at complete coverage. That work was done for the energy vertical we described to you in April.

**Seventy-one tools** on the agent interface, metered, live, all dependencies healthy as of this writing.

### The throughput result

The number worth understanding is the one about speed.

We rebuilt the write path this month. The bottleneck turned out not to be the writing at all — it was a verification step performing a full scan across ten million records on every batch, a cost that had been attributed to the wrong phase for months. Once found and corrected, sustained throughput went from roughly twenty records per second to **1,114**, a fifty-six-fold improvement, measured across 2.9 million records on the four largest metropolitan counties in Texas.

Concretely: Dallas, Bexar, Tarrant, and Travis took forty-three minutes. On the previous path they would have taken approximately forty hours.

That is the difference between a state being a project and a state being a weekend, and it is the single most important fact about whether this scales beyond Texas. It was earned by finding a misattributed cost, not by buying more compute.

---

## Bastrop, and what changed there

Bastrop remains live, remains our flagship, and remains the reference implementation in a real municipal environment.

What changed is that we now know precisely what it is worth and what it should have cost. The original contract was signed at thirty-three thousand dollars for implementation and the first year, with twelve thousand annually thereafter. We underbid it substantially. That is a useful thing to have learned on a first customer rather than a fiftieth.

The municipal price list built from that lesson, and from comparable market evidence, sets the entry deployment at sixty-five thousand with a sixteen-thousand annual, and a full four-category program at a hundred and fifty thousand. Those prices went to our public-sector distribution channel on the tenth of August. That channel carries the contract vehicles municipalities buy through, which means we reach city buyers without building a government sales organization.

Bastrop still sits where we said it did: at the center of a technology corridor where SpaceX, X, xAI, and The Boring Company all interact with city systems daily.

One note on sequencing, because it explains where the summer went. SmartCity OS was built before the physical-world layer existed. Moving it onto that layer is deliberate future work, scheduled after the foundation is hardened rather than during. We were not willing to rebuild the floor underneath a live customer running a city. Build it properly, prove it elsewhere, then move the flagship onto it. That is the slower path and it is the right one.

---

## The interfaces became businesses

In April we said we would keep building products to drive usage, revenue, and distribution. Here is where that stands.

**Smart Site** is the professional interface to the layer — real estate investors, agents, and architects asking what can be built on a property and what the risk is. The pricing ladder was locked on the tenth of August: free to browse, forty-nine dollars for the full answer, a hundred and twenty-nine for the professional deliverables, and a team tier for firms. It goes to market through affiliate distribution and the product's own sharing behavior, with no sales team by deliberate design. The economics work at that price because the layer underneath is already built and paid for.

**The agent channel** is live. Seventy-one tools behind four permission gates, metered at the call. This is the authorized route by which an AI agent consumes verified physical-world truth, and that route does not otherwise exist. As agents move from novelty to infrastructure, they need exactly what we spent the summer building, and there is no incumbent supplying it.

**Property Watch** arrived without us looking for it. Within five days this month, two customers independently asked for the same thing: continuous watching of a physical asset. One was a city asking about infrastructure monitoring. The other was a multifamily operator who saw the platform, ignored most of it, and said pipe-freeze early warning alone would be worth buying. We built the program around that.

**The energy vertical** we described in April now has its data foundation. The well and pipeline records are joined and in the store. The ownership problem in that sector is exactly as acute as we said, and we are now able to speak to it with the underlying records in hand rather than as a plan.

---

## Where we are

In April we said the question was no longer whether the system works but whether we could scale it.

We can, and now we have measured it. That is what the throughput number means, and it is why we spent the summer underneath the product rather than on more surfaces that would have looked better sooner.

What we have now is a layer that took real work to build, is very difficult to replicate, and gets more valuable with every application that runs on it and every customer who uses one. A county assembled for a real estate professional is the same county a city runs on, the same county an agent queries, and the same county a building owner attaches sensors to. The cost of the second customer in a jurisdiction is close to nothing.

The layer also deepens as a byproduct of being used. A city recording its decisions, an operator connecting a building, a professional correcting a record — each one adds to the same structure. Nobody buys depth. They buy the answer they came for, and depth accumulates underneath them.

That is the compounding we described in April, now with the mechanism built and the numbers to show it.

The market has spent this year proving the first half of our thesis for us: applications are getting cheaper to produce by the month, and the value is draining out of the surface layer toward whatever the surfaces stand on. We positioned for that before it was obvious. What we own now is a layer that took real work to build, is very hard to replicate, and gets more valuable every time anything runs on it.

We are not building toward a future state. We are operating inside it, and this summer we made it fast enough to take everywhere.

Thank you for backing this early.

— Nick
