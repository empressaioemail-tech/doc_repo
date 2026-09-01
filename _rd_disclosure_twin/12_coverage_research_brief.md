---
id: rd_dt_12_coverage_research_brief
title: Research brief — what the intelligence stack does not yet see
status: active
last_updated: 2026-08-18
applies_to: portfolio
owner: nick
related: [rd_dt_01_service_concept, rd_dt_02_cockpit_precedent, rd_dt_05_securities_pivot, rd_dt_06_the_move, rd_dt_08_build_scope, rd_dt_09_twin_read_contract]
purpose: Briefing for an external research agent. States the goal, the two applications and their relationship, what is actually built, and the coverage questions we want probed. Asks for vision-level gaps, not roadmap items.
canonical_sources: [empressa-trading/docs/THE_MOST_INTELLIGENT_INSTRUMENT.md, empressa-trading/docs/THE_INTELLIGENCE_STACK.md]
---

# Research brief — what the intelligence stack does not yet see

## What we want back

Think, probe, and come back with ideas. Specifically: **what is missing from our picture of the financial universe that we have not thought to want.**

This is not a request for a roadmap. We know our roadmap has holes and we are filling them. This is a request for the thing above the roadmap: the classes of data, market structures, geographies, instrument types and economic layers a serious financial intelligence system would cover, and that we have not named at all.

A worked example of the kind of gap we mean. An operator watched a video about **M2 money supply** and realised we hold nothing on it. We also hold nothing on the **Japanese yen**, or on any non-US monetary system. Those are not roadmap misses. They are whole territories we never drew on the map. Find more of those.

## The goal

The operator directive that governs everything below:

> *"there is no rush to get this application to market. there are a ton of companies shipping one-off indicators and all kinds of a-la-carte ai stuff. i want this platform to be the most intelligent trading instrument on the market."*

**"Most intelligent" is a falsifiable engineering standard here, not a marketing adjective.** It decomposes into four capabilities:

1. **It knows what it claims.** Every assertion — a zone, a forecast, a signal, a bot entry — is a *registered claim* with a pre-registered hypothesis, a version identity, and a gate it must clear.
2. **It knows whether it was right.** Every claim is graded against what the market actually did, automatically and on a schedule, with nobody deciding after the fact what counted.
3. **It knows what it does not know.** When it cannot compute an honest answer it says so, with the reason, and refuses to surface a claim whose record has not earned it.
4. **It improves itself against that record.** The measurement loop closes and the platform tunes its own controls within bounds, against evidence it generated.

**A platform with (1)–(3) is honest. A platform with all four is intelligent.** Today (1)–(3) work and (4) is specified and deliberately unbuilt.

**Why this is defensible when features are not.** Anyone can ship a head-and-shoulders detector; several companies have. The detector is not the asset. **The asset is the loop that can prove which detectors work** — expensive to build, boring to maintain, and impossible to retrofit, because it requires that every claim was recorded *before* its outcome was known. That is a property of history, not of code. A competitor who starts grading tomorrow starts at zero.

There is a sharper reason too: it requires being willing to publish losses. Our anticipation gate refused 20 of 21 buckets. Our propagation family voided its own flagship pair as a measurement artifact. Our intervention grader measured our own safety feature as harmful. **A competitor can copy the feature; they cannot copy the willingness, because the willingness is what their marketing exists to avoid.**

## The destination: a proprietary model, and the three layers

The long goal is **a legitimately trained, application-specific model** — not a wrapper around a vendor model, not asserted "AI signals," but a model whose training data the platform generated, graded, and can prove. The governing consensus is *"build the capture and grading loop first, let data flow, train later,"* with data gates rather than calendar gates.

| Layer | What it is | State |
|---|---|---|
| **L1 — Understanding** | The vocabulary that generates claims: pattern doctrine, an indicator codex, and an evidence discipline tagging every claim PROVEN / PLAUSIBLE / FOLKLORE / CONTRADICTED | Built for **zones only**. The indicator codex does not exist |
| **L2 — The record** | The factory that earns the training data: registered claims, automatic graders, the experiment registry | Being industrialised; first data gates approach |
| **L3 — The model** | Trained on L2's graded record. Enters as a worker under dark accrual, same graders, promoted only by beating the hand-crafted incumbent's forward record | Not started, by design |

**The sharpest line in that doctrine: *the dataset is the moat; the model is a consumer of the moat.***

**Why this matters for your research.** A coverage gap is not merely "data we do not serve." **L1 is the vocabulary that generates claims; L2 grades them; L3 learns from the graded record.** So a territory we never name is a territory about which the platform can never make a claim, never grade one, and therefore never learn anything. Missing M2 is not a missing chart — it is a permanent hole in what the eventual model can reason about. **Judge our gaps by that standard, not by whether a chart is missing.**

## The two applications, and how they relate

**The cockpit** (`empressa-trading`) is the operating trading platform and the home of the intelligence loop above. It runs a live paper-trading soak with A/B experiments, bots, an order and position model, market-data ingest, an options and futures surface, an economic-indicator board, the claim substrate and graders, and a **security master**: a bitemporal graph of instrument identity where a node is the stable join key and symbols are aliases with validity eras.

**Smart Markets** is the instrument twin: one research funnel per instrument, **one contract, two doors** — an MCP door for agents and a web door for humans, served from the identical payload. It holds no data. It is a **union layer** composing upstreams into one typed contract, and it refuses to say anything the upstreams did not say.

**They are the same doctrine at two altitudes.** The cockpit's loop is the *predictive* expression: register a claim, grade it, refuse what has not earned its place. Smart Markets is the *disclosure* expression: state what is known, name the authority, and render every gap as a finding rather than an empty field. Both are "know what you claim, know if you were right, know what you do not know."

**The dependency is one-directional and deliberate.** The cockpit is an *upstream*, not a sibling. Smart Markets reads from it, never writes to it, never mints an instrument node, and never calls a third party directly — enforced by a CI gate, because a union layer that reaches around its own upstreams drifts from them silently. A second upstream, Smart Files, holds documents and is mounted rather than merged.

## What is actually built, as of 2026-08-18

**The twin contract.** Three shapes: `operating-company`, `fund`, `contract` (futures). Five layers: **room** (documents and filings), **roster** (officers, directors, insiders), **drivers** (economic and positioning series that move the instrument), **market** (quotes as data), **synthesis** (narration, lowest authority on the page).

**Layer statuses:** `populated`, `partial`, `absent`, `not-applicable`. `partial` is populated content plus a stated absence covering exactly the missing slice.

**Three absence verdicts, and the distinction is the product.** `absent-verified` (we looked; within the stated scope there is genuinely nothing), `lookup-failed` (we could not look; this is not a finding of absence), `not-applicable` (a category error for this shape — a futures contract has no officers and never will). A fourth state, `omitted`, is a client-side inference from the contract version carrying no authority row, because nobody was asked.

**Six provenance classes**, descending in authority: Record, Observation, Derivation, Attention, Judgment, Synthesis. Every value declares which it is. A derivation states its formula and every input; an observation states its measurement.

**Live today.** The market layer serves 250 daily OHLCV bars for a US equity. The security master resolves symbols to nodes across roughly 9,984 instruments, and the served resolution path now works end to end. The room is entitlement-bounded to the caller. Roster, drivers and synthesis are stated absences naming exactly what is missing and who would close it.

**Coverage today, honestly.** US equities and ETFs via the security master. Eleven US futures roots with a curated driver catalog of 33 series from FRED, EIA, CFTC and the US Treasury. SEC filings via EDGAR. Options exist upstream behind a user-session gate and carry no contract identifier. On the L1 side: pattern doctrine exists for **zones only**, and there is no indicator codex at all.

## Where we already know we are thin

Stated so you spend effort on what we have *not* seen.

Non-US anything — listings, regulators, disclosure regimes. Monetary aggregates and central-bank data of any kind, including M2. FX beyond a few micro futures. Sovereign debt outside US Treasuries. Credit, securitised products, municipals. Private markets. Crypto beyond a thin quote path. Physical commodities as distinct from futures. Fund holdings and index constituents. Corporate actions, earnings transcripts, ownership and 13F-style positioning, short interest, insider intent, ratings, covenants. On the vocabulary side: every pattern family except zones, and every indicator we use but have never documented.

## What we want you to probe

1. **Map the financial universe as a serious system would cover it, then mark where we are absent.** Instrument classes, geographies, market-structure layers, the macro and monetary layer, the regulatory and disclosure layer, the ownership and flows layer.

2. **Name the authority, not the vendor.** For each territory, who *publishes the record*, as distinct from who resells it. Our architecture is built on naming authorities, so a gap is only actionable if we can learn who to name.

3. **Find the load-bearing gaps, not the long tail.** Which absences would most change what an analyst or an agent can conclude? M2 interests us because monetary conditions move everything.

4. **Which gaps are L1 vocabulary gaps rather than data gaps?** What could the platform never form a claim about, no matter how much data arrived, because it has no doctrine for the phenomenon? This is the question most likely to change the product rather than widen it.

5. **What can our contract structurally not represent?** Five layers, six provenance classes. Where do sentiment, flows, positioning, supply-chain and network relationships, scenario and forecast data, or private and unstructured information fit — and where would we need a new layer or a new provenance class rather than a new source?

6. **Where does honest absence matter most?** Which parts of finance are worst served by systems that quietly return nothing, and would therefore most reward a system that states what it does not know?

7. **Argue the case against us.** What does a competitor with this architecture and broader coverage do to us? Where is the four-capability standard weakest?

## What a useful report looks like

Territories, authorities, and reasoning. For each gap: what it is, who publishes it, why it matters, what it would let a reader conclude that they cannot conclude today, whether it is a data gap or a vocabulary gap, and what it would cost us structurally to represent.

## What would be useless

A vendor list. A ranked feature backlog. A restatement of what we already said here. Anything assuming we want more data for its own sake rather than more *answerable questions*.

## Ground rules

Cite your sources and distinguish what you verified from what you inferred. Where you cannot establish something, say so plainly. **A stated absence is worth more to us than a confident guess** — which is the entire thesis of the product you are being asked to research.

The two canonical sources for the goal are `docs/THE_MOST_INTELLIGENT_INSTRUMENT.md` (the quality standard the platform must meet) and `docs/THE_INTELLIGENCE_STACK.md` (the destination and the path) in the `empressa-trading` repository. Both are dated 2026-08-12 and predate the served-identity work described above.
