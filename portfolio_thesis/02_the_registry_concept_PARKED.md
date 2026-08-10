---
id: portfolio_thesis_registry_concept
title: The claim registry — concept capture (PARKED)
status: parked concept (not ratified; no build, no commitment)
last_updated: 2026-08-10
applies_to: portfolio
owner: nick
related: [01_the_layer_and_the_three_doors, 09_post_saas_substrate_thesis, empressa-trading/64_recursive_loop/02_selection_pressure, empressa-trading/64_recursive_loop/00_recursive_loop_overview, empressa-trading/_decisions/2026-07-19_positioning_v3_find_your_edge, 62_proof_of_record_spec, 63_empressa_certification_program]
purpose: Capture the claim-registry concept explored 2026-08-10 so it survives the session. An independent, external registry where claims are registered before outcomes and graded against ground truth the claimant does not control. PARKED — captured, not decided. Nothing here is committed to build.
---

# The claim registry — concept capture

Explored 2026-08-10 in a strategy discussion off the Harari "trust is migrating from institutions to algorithms" frame. **Parked, not ratified.** No build, no entity, no commitment. This document exists so the thinking survives.

## The observation that started it

The public failure mode of AI is confident assertion with no accountability: an authority makes a claim, you either trust it or you do not, and nothing ever settles whether it was right. Trust does not evaporate — it migrates to whatever asserts most fluently. There is no widely available mechanism for distinguishing a trustworthy system from a merely confident one.

**We have independently built an answer twice, in two domains, without either being about trust as a topic.**

In the property spine: every fact carries source, timestamp, confidence and access policy as part of its type; computed outputs pass mechanical gates before serving; the system declines with a stated reason rather than fabricating.

In empressa-trading: *"Everything on the record before the outcome, graded after. Losses included."* And the edge doctrine — *"Nobody can sell you an edge. Empressa is the machine that finds out whether you have one."*

Same architecture, two domains. The trading version is sharper because trading has what property does not: Tier 1 ground truth arriving daily, in dollars.

## The mechanism already named

`empressa-trading/64_recursive_loop/02_selection_pressure.md` states the principle:

> Selection pressure is a signal the system cannot generate itself, consumed by a gate the system cannot talk its way past.

And grades ground truth in five tiers: settlement (money or matter decides), institutional record, mechanical cross-check, adversarial review, and self-report — with **Tier 5 listed only to ban it**, called a category error rather than a weak tier.

That taxonomy is the concept's foundation. It is a working distinction between a trustworthy claim and a confident one, operationalized as a grading scheme with named gates, running in production in two verticals. It was built as engineering discipline to avoid shipping wrong answers. It reads as QA. It is closer to an epistemics.

## The concept

**An independent registry where claims are registered before their outcomes are known, and graded against ground truth the claimant does not control.**

The primitive is a **registered claim**: who is claiming, what is asserted, what would falsify it, when it resolves, and which ground-truth tier will resolve it. Declared up front and locked. Later the outcome arrives and the claim is graded, appended, permanent.

**Why it cannot be self-hosted.** The value of a graded record is exactly proportional to the claimant's inability to edit it. A verification substrate a claimant runs themselves is a log file with good intentions. The customer is buying the fact that they do not control it — the same reason auditors are external and a referee does not play.

**What is licensable is not the idea.** The atom contract, the tier taxonomy, the honest-decline pattern are ideas, and ideas have no billing surface. What is licensable is *third-party custody of claims and their outcomes*.

## What separation demands (operator ruling 2026-08-10: it must be separate)

Neutrality is the entire value proposition, so it has to be structural rather than promised.

**Separate entity, and Empressa is a customer of it.** A registry owned by a company that makes claims in property and markets is a referee who plays. The strongest available launch asset is the inverse: the founder's other companies graded in public by the registry, on the same terms as anyone else, with their losses visible.

**The registry never decides outcomes.** If it both holds claims and determines truth, it is a new authority asking to be trusted — the original problem one layer up. Its job is custody and grading *mechanics*: hold the claim, enforce immutability, apply the rule the claimant declared, label the tier. The signal comes from outside — a market price, an institutional record, a published result, an independent reviewer.

**The tier label is the product.** Not the verdict — the grade of the evidence. A hundred settlement-resolved claims is a real reputation; ten thousand self-resolved ones are worth nothing, and the registry says so consistently and in public. We do not sell truth. We sell a legible, comparable measure of how much a track record is worth.

## Tooling, high level

Four surfaces, each deliberately minimal.

**Register** — a claim before its outcome exists. Claimant, assertion, falsification condition, resolution date, declared tier. Returns an ID and a permanent public URL.

**Resolve** — the outcome arrives, the declared rule is applied, the result is appended. A claim that resolves against the claimant is as permanent as one that resolves for them.

**Verify** — free, no key, no account. Anyone can pull any claim and see its full history. Not a feature: this is the distribution mechanism and the credibility proof at once.

**The record** — a claimant's aggregate, with losses in the same view as wins, and unresolved claims visible. The artifact people share, which is how the registry spreads without being sold.

Three rules that matter more than the endpoints:

- **Declared-then-locked.** Falsification condition and tier are set at registration. You cannot register at Tier 1 and quietly resolve at Tier 5.
- **Append-only, no exceptions.** Not "we keep an audit log of edits." No edits.
- **Unresolved is a visible state, not a gap.** A claimant with a hundred registrations and six resolutions has said something important; the record must not report six-for-six.

## Delivery shape

MCP was the operator's framing — a system enhancement bolted onto ChatGPT, Claude or Grok rather than a destination product. It fits: we already run an agent channel with metering and gating, verification-free-reads are cheap over MCP, and the pitch is additive rather than a replacement. A model cannot be its own Tier 1 signal, which is precisely why the server has to be external.

Licensing shape, if it were built: verification free and unlimited (it is the distribution); registration free to a low cap then metered; resolution metered and tier-priced (Tier 1 costs more than Tier 2); a subscription for the hosted public scorecard surface; an SDK for builders embedding the pattern. Open the spec, charge for the registry — the same move as the atom contract being open while the corpus is the business.

## Honest problems (not solved, recorded)

**Resolution is where it lives or dies.** Registration alone is a timestamped guess. Where we already hold ground truth (property facts, jurisdictional records, code editions) resolution is automatic and real. Where a public source settles it (markets, published records) it is an adapter build per source, and we have none. Where only the user knows, the user resolves — which the taxonomy grades near the banned tier. A credible v1 is narrow: auto-resolution where we own the signal, user-resolution elsewhere, clearly tier-labelled.

**No natural monopoly.** Anyone can run an append-only claim store. What makes one worth using is that others check it, and that network effect does not exist on day one. Seeding real volume matters more than features.

**Neutrality and revenue pull against each other.** The claimant pays and the claimant is graded — the auditor's structural problem, which auditors have repeatedly failed. Mitigations: the registry never decides outcomes, the record is public so a soft grade is visible, pricing is per claim rather than negotiated per client. Managed, not solved.

**Adoption requires wanting to be graded.** Most people do not. The ones who do are those whose credibility is contested and who benefit from proving it — a smaller, sharper market than "everyone with an AI assistant."

**The anchoring gate.** `empressa-trading` positioning v3 bans "sealed," "cryptographically verifiable" and "tamper-proof" until anchoring runs in production, and records zero anchored records today. The strongest form of the proof-of-record claim is not printable yet. Flipping anchoring is a config-and-ops task already in that repo's build list and is the single highest-leverage unlock for this concept.

**The record is thin.** Trading records are 1-6 weeks of operator paper usage; process claims only, no performance claims. n=49 on one operator's calls proves the mechanism works, not that it has been validated at scale.

## The open question that decides the shape

**What is the first domain, and who is the first claimant?** Three candidates, three different companies:

- **Agent builders** — real liability problem, a sales asset they cannot manufacture, composes with the channel we already run. Infrastructure sale, long cycle, no consumer visibility.
- **Contested forecasters** — analysts, commentators, anyone whose credibility is disputed. Highest visibility and closest to the public form of the problem. But resolution is hard outside markets, and the claimants with most to gain are the least honest.
- **AI assistants themselves** — biggest surface, most demo-able, but most claims resolve as user-reported, near the banned tier.

Working read at park time: **trading is the seed, agent builders are the business.** Trading because the market resolves daily, in dollars, at Tier 1, for free — that quality of selection pressure cannot be bought and is already running. Agent builders because that is who has budget and a reason.

## Status

**PARKED.** Captured 2026-08-10, not ratified. No build, no entity formation, no commitment. Revisit when there is reason to; nothing downstream depends on it.

Nearest existing work if this is picked up: `62_proof_of_record_spec.md`, `63_empressa_certification_program.md`, and the `64_recursive_loop/` folder in empressa-trading — all three are in the same band and all three are about earned truth.
