---
id: insurance_pc_wedge_scaffold
title: Insurance P&C underwriting wedge — concept scaffold
status: thoughtbank-active
last_updated: 2026-06-30
applies_to: portfolio
owner: nick
related: [insurance_underwriting_market_approach, network_effects_use_cases_and_gaps, 75l_cotality_data_stack_catalog, 73_partnerships, 18_stakeholder_graph]
---

# Insurance P&C underwriting wedge — concept scaffold

Working scaffold for scrutiny and discussion. Each section has a status marker: SETTLED (enough to build on), NEEDS DISCUSSION, or OPEN QUESTION (answer unknown). Nothing here is a dispatch or a build decision. This document exists to flush the assumptions before any of those happen.

---

## 1. The thesis

**The bet:** AI-agent underwriting workflows are being rebuilt right now inside progressive MGAs and insurtechs. The first property-risk data source with an MCP-native, tool-callable, sourced-and-calibrated interface gets the agent integration before the incumbents retrofit their APIs. The calibration commitment gives us a moat that a score number does not.

**What has to be true for it to pay:**
- MGAs are actually adopting AI-agent workflows at meaningful speed, not just talking about it.
- Our data package -- hazard risk + property attributes + permit history + jurisdiction code posture -- is sufficient for the underwriting step where AI-augmentation is happening first.
- "Sourced and calibrated" is a real differentiator in an audit or regulatory context, not just a talking point.
- The Texas property insurance market disruption (carriers exiting, new MGA entrants) is creating demand for better risk data with a lower barrier to entry than a Verisk contract.

**Status: NEEDS DISCUSSION** -- the AI-agent adoption speed is an empirical claim. Need to validate before designing the product around it.

---

## 2. The buyer

**Primary target: TX-based MGAs underwriting residential property in the Central TX hail belt.**

MGAs write the risk on behalf of capacity providers (carriers, reinsurers). They need risk data fast and they need it API-accessible because they are lighter-weight operations than carriers. The AI-augmented MGA is the early adopter.

**Current MGA workflow (standard, non-AI-augmented):**
1. Application received (address, coverage requested, occupancy type)
2. CLUE report ordered -- LexisNexis, claims history, ~$2-5 per pull
3. Property condition report ordered -- Verisk ISO or CoreLogic, ~$10-25 per report
4. Flood zone check -- FEMA FIRM via MapMyProperty or similar, ~$1-5
5. Roof condition report -- EagleView aerial imagery, ordered when needed, ~$15-30
6. Human underwriter reviews all of the above, binds or declines
7. Total data cost per application: roughly $30-65, plus 30-60 minutes of human time

**AI-augmented version (happening now in progressive MGAs):**
Agent receives application, calls data APIs, assembles risk profile, produces underwriting recommendation with confidence and reasoning chain, routes to human for final approval. The agent needs a single tool call that returns a structured, sourced risk profile. Nobody offers that today.

**Secondary targets:**
- Reinsurers and cat modelers doing portfolio-level exposure analysis across TX books (higher ACV, fewer buyers)
- Insurtechs building parametric products needing calibrated forward-looking triggers (e.g., drought-index triggers, flood-threshold triggers)

**Not right now:**
- Major carriers (procurement is 12-18 months, certification requirements are heavy)
- Personal lines aggregators (price comparison, not risk intelligence)

**Status: NEEDS DISCUSSION** -- primary target is an assumption. No MGA relationship exists yet to validate the AI-augmentation claim or the workflow entry point.

---

## 3. Product definition

### What the tool returns

Tool: `get_parcel_risk_profile(address)` or `get_parcel_risk_profile(clip)`

| Output field | Source | Status |
|---|---|---|
| Flood risk (FEMA zone + depth model) | Cotality RiskMeter | Wired, subscription not matched |
| Wildfire risk score | Cotality RiskMeter | Same |
| Wind/hail risk score | Cotality RiskMeter | Same |
| Property year built | Cotality Property API | Partially wired |
| Construction type (frame/masonry/etc.) | Cotality Property API | Unknown -- need to confirm it's in the feed |
| Square footage, stories | Cotality Property API | Partially wired |
| Permit history by category | Cotality Property API | Available, not yet wired |
| Lien and encumbrance status | ADR-020/021 atoms | Live |
| Jurisdiction code edition adopted | Central TX atom corpus | Live (Central TX only) |
| Open code violations | Code compliance atoms | Live where available |
| Climate trajectory (10/30yr) | Cotality climate projections | In stack conceptually; wiring TBD |

Every field carries source, confidence, timestamp. Commitment #1 is non-negotiable here.

### What is explicitly not in scope

- Claims history (CLUE, LexisNexis) -- not acquirable without a separate data partnership, expensive to validate, leave to the buyer
- Roof age/condition (aerial imagery) -- the largest gap; permit history is a proxy only (see section 4)
- Replacement cost estimate -- needs a cost model not yet built
- Occupancy verification (primary/secondary/rental) -- not in the Cotality feed at this level

### Status: NEEDS DISCUSSION

The "not in scope" list may be fatal for some buyer segments. Specifically: if MGAs will not write without a roof condition assessment and the permit proxy is not sufficient, the product is not underwriting-grade. This is the single most important assumption to test.

---

## 4. Data layer

### What's live now

- Central TX jurisdiction code posture (atom corpus -- 34 jurisdictions, code edition, violation data where available)
- Encumbrance/lien atoms (ADR-020/021, live in the engine)

### What's gated (production keys required)

Cotality is the sole spine (Regrid purged 2026-06-17). All of the following are available in the Cotality feed but gated on production keys + proper subscriptions:

- Property attributes (year built, construction type, sqft, stories) -- Property API, entitlement gap on demo
- Permit history by category -- Property API, not yet wired
- AVM/value estimate -- Property API, partially wired
- Liens/mortgage data -- Property API, partially wired
- **RiskMeter (flood depth, wildfire, wind)** -- separately subscribed product, currently 401 "no apiproduct match found"

The RiskMeter subscription is a single line item in the production-keys conversation with Cotality Data Implementation Services. That conversation is already queued for the Max map launch. Adding RiskMeter to that ask is the minimum unlock for wedge 1.

### What's missing and requires a partner decision

**Roof age/condition (the gap that may be fatal):**

The biggest underwriting variable in Texas right now is roof condition. Carriers are non-renewing properties with roofs older than 15 years. We do not have roof age or condition data. Two paths:

- Path A (permit proxy): Cotality building permit history tells us when the last roofing permit was pulled. This infers roof age within a year or two if the permit was pulled. Does not catch unpermitted re-roofs (common in Texas post-hail). Coverage and accuracy is imperfect.
- Path B (aerial imagery partner): EagleView and Cape Analytics both sell roof-condition assessments by address -- age, material, condition score, damage indicators. EagleView is the standard; carriers use it. Pricing is roughly $15-30 per report on demand, or cheaper at volume. This closes the gap completely but requires a data partnership decision.

Path A is available now. Path B requires a partner conversation and a cost model.

**Claims history:**
CLUE (Comprehensive Loss Underwriting Exchange) is owned by LexisNexis. Access requires a credentialing process as a licensed insurance entity or a bureau member. We are neither. Leave out of scope unless and until there is a specific reason to go after it.

### Status: OPEN QUESTION

Does construction type actually appear in the Cotality property attributes feed? This needs a test call against a known address once production keys are live. Frame vs masonry is load-bearing for fire underwriting.

---

## 5. Competitive position

### The incumbent stack

Verisk (ISO, AIR Worldwide, PCS): deep historical cat data, ISO rating bureaus, the standard risk-file format carriers expect. Deeply embedded in the industry. Carrier compliance, regulatory acceptance. Their products: the 360Value replacement cost model, the CrimeStat, the A-PLUS claims index. They are not going away.

CoreLogic: property data, location risk, the PropertyChek report. Strong on property characteristics and transaction history.

Neither has MCP-native tooling. Neither gives you a sourced provenance chain on the risk score. Neither has jurisdiction-level code compliance posture.

### Our actual differentiators

1. **MCP-native, agent-callable interface.** The AI-augmented underwriting workflow needs a tool, not a PDF report or a batch API. We are the only property risk data source building in this shape.

2. **Sourced and calibrated output.** Verisk gives you a number. We give you a fact with sources, confidence, and timestamp. In a Texas DoI audit or a carrier compliance review, the underwriter who can show the exact data, source, and confidence that drove the decision is in a better position than the one holding a proprietary score they cannot explain.

3. **Forward-looking climate trajectory.** Verisk's AIR Worldwide has cat models but they are historical-distribution based. Our Cotality climate layer adds 10 and 30-year forward risk trajectory to the parcel profile. Reinsurers are actively looking for this.

4. **Jurisdiction code intelligence (unique).** No incumbent data provider tells you whether the parcel sits in a jurisdiction that has adopted the current fire code or is running two editions behind. We have this for Central TX. It is genuinely novel and directly relevant to replacement-cost and rebuild-risk assessment.

### What we cannot compete on

- Historical claims data breadth (CLUE is LexisNexis's moat)
- Carrier-acceptance and regulatory filing history (Verisk has decades of this)
- Replacement cost modeling (360Value is the standard; building a competitor is a multi-year project)
- National coverage (we have deep Central TX coverage; national coverage is a later-phase build)

### Status: NEEDS DISCUSSION

The MCP-native angle is a strong story but it assumes the AI-agent underwriting workflow is actually being adopted. If MGAs are not yet running AI agents in their workflows, the interface differentiation doesn't matter yet. Validate the adoption claim before leaning on it as the primary wedge.

---

## 6. Activation sequence

Dependencies only, no time estimates.

1. RiskMeter subscription added to Cotality production-keys ask -- this is a conversation already queued; adding one line item.
2. Construction type field confirmed in Cotality Property feed -- one test API call once demo keys have entitlement (or production keys arrive).
3. Building permits adapter wired in legacy-design-tools -- this is already flagged as "not yet wired" in 75l; it is a cc-agent-C dispatch.
4. `get_parcel_risk_profile` function package built in cortex -- composes RiskMeter + property attrs + permits + code posture + lien status into one tool call.
5. Insurance product key added to the MCP server -- configuration, not architecture.
6. Pilot MGA identified through network -- see section 7 for relationship map.
7. Pilot run: feed pilot a batch of historical addresses with known loss outcomes; collect calibration signal.
8. Calibration loop live: policy outcomes feed back to update confidence on the risk atoms.

**Hard prerequisite:** the main wedge (RE products) ships and hits its gates. This activation sequence does not start until that gate clears.

**Roof condition path decision** (EagleView / Cape Analytics) can run in parallel with steps 1-5 and does not need to be resolved before the pilot, but must be resolved before any underwriting-grade commercial offer.

---

## 7. Network and relationships

**What we have:**
- Sylvia Carrillo: city relationships, SmartCity OS. Possible adjacent connection to TX municipal risk pools or city insurers (cities self-insure through pools like TMPA or TML). Not a direct MGA path but may surface contacts.
- Valerie Thompson (eXp Realty): touches buyers, lenders, and their required insurance. Not an underwriting contact but could name agents who complain about the market and point toward an MGA.
- Mox Living (Miguel Arce): 45 multifamily properties, 12k units. Has a commercial P&C insurer relationship for the portfolio. Not an MGA, but knows who writes their risk. Could be a door to the reinsurance buyer rather than the MGA buyer.

**What we need:**
A direct relationship with a TX-based MGA underwriting residential property in Central TX. This is the highest-priority relationship gap for this wedge. Nobody in the current stakeholder graph appears to be it.

**Status: OPEN QUESTION** -- Is there an MGA relationship anywhere in Nick's network that hasn't surfaced here? Who do we know who knows the TX MGA market?

---

## 7b. Wedge 3 -- AI-native claims handling

This is a distinct product surface from the underwriting data API, but it shares the same substrate and creates a compounding flywheel when combined with wedge 1.

**The core insight:** the IP counsel deck (Section 6.5 and Section 7) already describes the claims filing mechanism in IP terms. The blockchain-anchored verifiable record of the pre-loss state, sealed before any loss event, is the evidentiary foundation that insurance claims require and that neither party in a dispute can produce today. The mechanism exists; this is an application of it.

**Three phases of the claims workflow and how the system handles each:**

Pre-loss anchor. At policy inception, the underwriting atoms for the parcel are anchored -- flood exposure, hazard score, permit history, property condition. Tamper-evident, timestamped, immutable. Neither insured nor insurer can later dispute the property's state at binding. This is the thing that makes AI-native claims handling possible and that no incumbent can replicate without the atom substrate.

FNOL and intake. The policyholder files, or a parametric trigger fires automatically. The system retrieves the pre-loss atoms, the event atom from the Temporal Context Engine (sourced against NOAA/FEMA/authoritative feeds, with depth and extent), and the policy terms. The AI adjuster opens the file with full evidentiary context, no manual data gathering.

Adjudication. AI compares event facts to policy terms to pre-loss state. Produces a findings atom: coverage determination, loss calculation, confidence, reasoning chain, citations. Commitment #1 applies to the claims output the same way it applies to the underwriting output. Human adjuster reviews and approves rather than building from scratch. Fraud detection is structural: the pre-loss anchor means pre-existing damage cannot be claimed as new loss; the event atom is sourced from authoritative feeds so the triggering event cannot be fabricated.

Settlement. Parametric: Circle fires USDC automatically when the event atom clears the threshold. Traditional: AI recommendation plus human approval routes to Circle disbursement. Same rail.

**The end-to-end flywheel:**

Underwriting with Hauska anchors the pre-loss state, making claims handling natural. Claims handling anchors the settlement outcome, which is calibration signal on the risk atoms. Every settled claim sharpens the underwriting confidence for that claim type and parcel profile. CLUE access is not required because our own policyholders' outcomes feed the model directly. Underwriting brings the insurer in; claims handling locks them in; calibration compounds the moat.

**The fraud reduction angle:**

US insurance fraud costs carriers roughly $300 billion annually. The anchored pre-loss record addresses the most common forms structurally: pre-existing damage claimed as new loss (the anchor refutes it); inflated replacement cost (pre-loss property atom has the condition); duplicate claims across policies (the event atom is shared and unique, so the same event cannot support two unrelated claims). Fraud reduction is a computable ROI that an insurer can put a number on before piloting.

**The claims data room:**

Large commercial losses involve multiple parties: insured, primary carrier, reinsurer, adjusting firm. Today the evidentiary record is a chaos of PDFs and emails; dispute is the default. A Hauska claims data room is a permissioned atom space where each party sees what their access policy allows, the adjuster appends findings atoms as the claim progresses, and the reinsurer sees only the atoms for the ceded portion. The pre-loss anchor means nobody disputes the foundational facts. This is the data room concept applied to claims, not just underwriting due diligence.

**What is needed to build this surface:**

Everything from wedge 1 (RiskMeter subscription, property attributes, permit history, code posture) plus: event atom production from the Temporal Context Engine for weather perils (flood, fire, wind -- the same three RiskMeter covers); a claims-workflow atom family (FNOL, findings, determination, settlement); a permissioned data room access model on top of ADR-017 access control; and Circle disbursement wired to the claims determination. The data room access model is the largest new build; everything else composes from existing planned work.

**Kill conditions specific to this wedge:**

Regulatory: insurance claims handling in Texas may require an adjuster license or a third-party administrator (TPA) registration. If operating as a claims processor requires a license we do not have, the workflow product restructures as a "claims decision support tool" (the AI recommends; the licensed adjuster decides and files). This changes the product positioning but not the core value.

Data room: the permissioned multi-party atom space requires the tenant isolation and access control build (ADR-017 dependency, currently the ECI atomization prerequisite). If that build is delayed, the data room surface is delayed. The single-carrier claims workflow (no reinsurer) does not require multi-tenant data room and can proceed independently.

## 8. Kill conditions

Stop if any of these prove true during scrutiny or pilot:

1. **Roof condition is non-negotiable.** MGAs and carriers in TX will not bind without a roof condition assessment. The permit proxy is insufficient, and the EagleView partnership is too expensive or slow to close. The product cannot reach underwriting-grade without it.

2. **RiskMeter is not addable to the Cotality contract.** If RiskMeter requires a separate enterprise contract with a minimum commit that does not make sense at pilot scale, the hazard data layer falls back to free FEMA flood data only. That may be too thin.

3. **AI-agent adoption in MGA workflows is not actually happening.** If the target buyers are not running AI agents in their underwriting workflow and have no plan to, the MCP-native interface is ahead of the market and the buyer reverts to wanting a PDF report or a batch file -- both of which we cannot compete on.

4. **Verisk or CoreLogic ships MCP-native tooling.** If either incumbent ships tool-callable interfaces before we have a pilot relationship, the interface differentiation shrinks. Data moat and calibration remain but the urgency of first-mover advantage goes away.

5. **Texas DoI requires licensed-entity status to sell underwriting data to MGAs.** If there is a regulatory bar we have not identified that requires us to be credentialed as a data provider in the insurance vertical, the activation sequence gets much longer.

---

## 9. Open questions (priority order)

1. Is AI-agent underwriting actually being adopted by TX MGAs now, or is this 12-18 months out?
2. What does Cotality's RiskMeter subscription cost at pilot volumes? Is it addable to the production-keys ask?
3. Is construction type in the Cotality property attributes feed?
4. Is there an MGA relationship anywhere in the existing network?
5. What does TX DoI say about data providers selling to MGAs -- any credentialing requirement?
6. Is the EagleView/Cape Analytics data partnership financially viable at Central TX pilot volumes?
7. What is the right per-call price point for `get_parcel_risk_profile` vs Verisk's ISO report pricing ($10-25)?
8. Does Mox Living's insurer relationship open a reinsurance buyer door?

---

## 10. What this is not

Not a sprint. Not a dispatch. Not a commercial commitment. This scaffold exists to flush assumptions and identify which ones are fatal before any build decision is made. The product, buyer, data layer, and competitive position sections all have open questions that must close before this becomes an active workstream.

When it graduates from scrutiny, it moves to `_verticals/insurance/` and becomes a vertical with a proper sprint plan.
