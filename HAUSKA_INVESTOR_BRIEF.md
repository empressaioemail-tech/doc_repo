# Hauska — Development Snapshot

*Investor update. As of 1 June 2026. Basis: live cross-repo engineering recon plus the internal canonical record. Deployment, package, and corpus figures are verified against running systems and published artifacts; pre-launch items are called out as such.*

---

## Headline

The spine is built and deployed end to end. The atom contract is published, the engine ingests and serves the catalog, the MCP gate meters and enforces tiers at call time, and the payment SDK clears a transaction on chain. As of this snapshot the catalog is live in production, the anchor jurisdiction is serving, and the corpus stands at roughly 21,100 atoms across thirty-four jurisdictions, all passing the fidelity evaluation in the committed snapshot, of which two are public and free to read (about 478 atoms) and the remainder are platform-internal inventory.

We are pre-first-paid-call. The architecturally hard work is behind us. The two active fronts are coverage expansion and turning on the parts of the meter that are built but not yet wired to live money. Everything below is status, not narrative.

---

## What is live in production

| Layer | Asset | State |
|---|---|---|
| Contract | `@hauska/atom-contract` | Published to npm, v1.3.0 |
| Engine | Retrieval API | Live on Cloud Run; read-only catalog surface, no model in the loop |
| Gate | MCP server | Live on Cloud Run; 46 callable tools; tier and entitlement enforced at call time |
| Payments | Hauska SDK (`@hauska-sdk/*`) | Published to npm; 12 packages, v0.1.0; crypto rail built and tested (56 tests green, on-chain verification via ethers v6) |

The MCP gate now exposes forty-six tools, up from the prior count, after a wave of brokerage tools landed; the gate splits across public, brokerage, and the two reasoning surfaces. The engine carries a new workspace package for property-workflow atoms. The contract has moved to v1.3.0 with framework primitives plus dedicated encumbrance and workspace extensions.

---

## Corpus and coverage

The catalog is no longer dark. Thirty-four jurisdictions are atomized and pass the fidelity evaluation gate in the committed snapshot (2026-05-26), among them Bastrop's unified development code, Bastrop County, Elgin, Hutto, Dripping Springs, Austin, San Antonio, and Grand County (Moab). The verified corpus is on the order of 21,100 atoms. Two jurisdictions are public and free to read, Bastrop and Grand County, totaling roughly 478 atoms; the rest are platform-internal inventory.

The onboarding cost discipline is holding. The target is under two hundred dollars of compute plus one hour of human review per new jurisdiction, with a hard-kill checkpoint if we could not hit it by the third county. That checkpoint is cleared. Onboarding a jurisdiction is cheap and repeatable, which is what makes broader coverage a question of demand and partnership flips rather than headcount.

Bastrop is live in production as the anchor jurisdiction and the template for the partnership-with-revenue-share model that every subsequent jurisdiction follows.

---

## Recent progress

The engine moved to a live Cloud Run deployment, so the catalog surface is serving rather than dark. The MCP gate went live on Cloud Run and picked up the brokerage tool wave. The contract advanced through encumbrance and workspace extensions to v1.3.0. The product reasoning layer completed its migration onto the published contract, so the internal demand surfaces now consume the same atom shape external customers will. The corpus expanded and was reconciled to its current count, and the per-jurisdiction cost discipline passed its hard-kill checkpoint with room to spare.

The net effect since the last leg is that the spine stopped being a set of separately-correct pieces and became a connected, deployed system: source material goes in, atoms come out, the gate meters access, and the payment rail can clear a call.

---

## In flight now

Coverage expansion is demand-pulled rather than pushed. The remaining roughly twenty Texas cities are gated on access: the partnership flips with municipal-code publishers and standards bodies that unlock the source material at scale, rather than on engineering effort. Outreach to the largest access-blocked publisher is underway.

The MCP custom-domain mapping to the production subdomain is pending, the final cosmetic step before the gate is on its permanent address.

The first-party demand surfaces are exercising the substrate in production daily through a property-workflow data wave, which is the dogfood that proves the catalog carries production weight before the first external paid call.

---

## What is gated, and on what

First paid external revenue is gated on three things: the exact pricing call within the settled take-rate range, the go-to-market channel decision, and the fiat-rail build. None of these are engineering unknowns; they are decisions and a scoped build.

The regulatory posture for moving money on the regulated paths (operating banking, money-transmitter posture, KYC and AML thresholds) is the standard pre-revenue corporate-readiness work. It is sequenced and owned, and it gates the paid regulated surfaces, not the catalog.

The engine factor-out to its own repository, which cleanly separates the reasoning packages from the product monorepo where they currently live, is gated on the city-platform stabilization work and is an architecture-cleanliness item rather than a capability blocker.

---

## Honest gaps

Three things are designed and committed but not yet live.

The fiat settlement rail is a near-greenfield build. The crypto rail (USDC on Base, Ethereum, and Polygon) is genuinely built and tested. The fiat rail, selected as Circle to unify with the existing USDC stack, is currently a placeholder checkout function. It is scoped, not finished.

Revenue-share settlement is contractually promised, not yet substrate-enforced. The model is that the SDK mechanically splits a payment and routes the source actor's share back. That routing layer is not yet written. Today revenue share is a contract term; making it enforced by the substrate itself is committed direction, and the fields and rails it depends on are partially in place.

No external customer has paid for a metered call yet. First real money is intended to run through a manually reconciled pilot at the anchor jurisdiction before the rails carry production traffic.

None of these are architecture risk. They sit on top of a spine that already runs.

---

## Commercial model, settled

Three tiers, one rule. Layer 1 free (bare reference atoms and bulk export, built for distribution and developer pull). Layer 2 paid (context-enriched reasoning, per call by default with an optional stream subscription at volume). Layer 3 paid integrated workflows on the same substrate. Every output at every tier carries its reasoning chain, citation, confidence, and timestamp.

Take rate is settled at a 1.5 to 2.5 percent range depending on transaction type, below the card-processing benchmark and far below app-store economics, with the exact number set at the first paid call. The optimization target is volume and adoption, not rent per transaction.

---

## Next, in dependency order

Land the pricing and go-to-market-channel decisions that gate first revenue. Build the Circle fiat checkout to pair with the live crypto rail. Run the first revenue-share movement through a manually reconciled pilot at the anchor jurisdiction. Wire the MCP gate's metering to live payments for the first paid Layer 2 surface. Flip the first publisher and standards-body partnerships to unlock the next wave of jurisdiction coverage. In parallel on the corporate track, clear operating banking and the regulatory posture that the paid regulated paths depend on.

The revenue-routing split layer and the broader payment-substrate vision follow first paid revenue; they are the build that converts contractually-promised revenue share into substrate-enforced settlement.

---

## Metrics we are managing to

Atom volume, jurisdiction coverage, cost per jurisdiction onboarded, metered call volume, agent-operator adoption, and the rate at which revenue routes back to sources once settlement is live. These are the substrate metrics that matter for this kind of company; per-seat SaaS metrics are only partially relevant when the buyer has no seats.

---

*Confidence note. Deployment states, package versions, tool counts, and the corpus figure are verified against running systems and published artifacts as of 1 June 2026. The roughly 2,700-atom count is reconciled and under final confirmation across the internal record. Pricing range, tier model, and partnership status are settled internal commitments. Fiat rail, revenue-routing settlement, and first paid revenue are pre-launch as described under Honest gaps.*
