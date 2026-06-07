# Hauska — Commercialization Vision

*Executive summary. Version 1, May 2026.*

---

## The opportunity

AI agents are beginning to do real physical-world work: designing buildings, pulling permits, evaluating property, running city services. To do that work correctly, an agent has to know the rules that govern a place: its building code, its zoning, its local development ordinances.

Those rules are different in every jurisdiction, they change constantly, and today they live in scanned PDFs and clunky municipal websites that were never built for a machine to read. There is no reliable way for an agent to ask "what does the code require here" and trust the answer it gets back.

Hauska builds exactly that: the trustworthy data-and-payment layer for AI agents doing physical-world work.

## What Hauska is

Hauska is the canonical catalog of physical-world jurisdictional rules, made queryable by any AI agent, and the payment layer that lets agents pay for it and routes that revenue back to the cities and publishers who are the source.

One principle runs through everything: **sell reasoning, not data.** Every answer Hauska returns carries its reasoning chain, its source citation, a confidence score, and a timestamp. A buyer is not getting a scraped fact of unknown origin. They are getting a trustworthy, attributed, current answer they can act on and defend.

A second principle makes the model durable: **the sources are partners, not targets.** Cities, counties, and code publishers are licensors with a revenue share, not websites to be scraped. When an agent pays to use a jurisdiction's rules, money flows back to that jurisdiction. That turns every data source into a stakeholder.

## The commercialization layer — what it includes

The commercialization layer is the set of surfaces and rails that turn the catalog into a business. It has four parts.

**The catalog.** The product itself: physical-world jurisdiction rules broken into small, individually addressable, individually cited units of reasoning. It is structured in three layers. A shared base of model codes that nearly every jurisdiction adopts. Each city's local amendments to that base. And each city's own zoning and development code. This structure is what lets Hauska add a new city cheaply: the expensive shared base is built once, and each new city is a small, inexpensive overlay on top of it.

**The storefront.** The Hauska MCP Server, a single endpoint that any AI agent can connect to. MCP (the Model Context Protocol) is the emerging standard for how AI agents call external tools, so building the storefront as an MCP server means any MCP-capable agent (in Claude, in Cursor, or in a custom application) can reach Hauska with no custom integration.

**The access model.** Free and paid tiers. The free tier lets any agent query the catalog, with source attribution required. The paid tier opens deeper access and is metered per call. Both tiers carry the full reasoning, citation, confidence, and timestamp. Free is the hook; paid is the depth.

**The rails.** The Hauska SDK: the machinery that handles money, delivery, and proof. It processes payments (crypto rails today, traditional card rails next), securely delivers verified documents when a paid result is a document rather than a snippet, keeps a tamper-evident audit trail of every transaction, and gives each user a wallet-based identity. The rails are also what route revenue back to the source partners.

## How it works

```
   THE BUILDER  --builds & runs-->  AN AI AGENT
                                    (in Claude, Cursor, or a custom app)
                                          |
                          "what does the code require for this site?"
                                          |
                                          v
   +------------------------------------------------------------+
   |  HAUSKA STOREFRONT                                         |
   |  one MCP server, callable by any AI agent                  |
   |                                                            |
   |    FREE TIER   open queries, source attribution required   |
   |    PAID TIER   deeper access, metered per call             |
   |                                                            |
   |    every answer carries:  reasoning . citation .           |
   |                           confidence . timestamp           |
   +----------------------------+-------------------------------+
                                | looks up
                                v
   +------------------------------------------------------------+
   |  THE CATALOG                                               |
   |  physical-world jurisdiction rules, made machine-queryable |
   |                                                            |
   |    . shared model codes     the base every city adopts     |
   |    . local amendments       how each city modifies it      |
   |    . local zoning & code    each city's own rules          |
   +----------------------------^-------------------------------+
                                | built & kept current by
                                | the Hauska ingestion engine
   +----------------------------+-------------------------------+
   |  SOURCE: municipal codes, zoning ordinances, model codes   |
   |  Cities, counties & publishers are paid partners, not      |
   |  scraped sources. Usage revenue routes back to them.       |
   +------------------------------------------------------------+

   Running alongside, the RAILS (the Hauska SDK):
   payment processing . secure delivery of verified documents .
   tamper-evident provenance trail . wallet-based identity
```

A request flows top to bottom. A builder runs an agent. The agent needs a jurisdictional fact, so it calls a Hauska tool on the storefront. The storefront checks the caller's tier, looks the answer up in the catalog, and returns it with full reasoning and citation. If the call is a paid one, the rails meter it and route the revenue share to the jurisdiction that is the source. The catalog itself is kept accurate by the ingestion engine, which turns raw municipal codes into the structured, queryable form.

## Where we are today

```
   LIVE TODAY              BUILDING NOW            DESIGNED & AHEAD
   ----------              ------------            ----------------
   The catalog of          More jurisdictions,     The shared model-code
   quality-checked         onboarded one at a      base (gated on a data
   jurisdiction rules      time onto the           agreement with the
                           catalog                 code publishers)
   The storefront,
   deployed and serving                            Paid tier and
   live, every tool                                self-serve signup
   verified
                                                   Verified-document
   The crypto payment                              sale and delivery
   rail, built and
   tested                                          Public launch and
                                                   go-to-market
   The layered catalog
   architecture
```

**Live today.** The storefront is deployed and serving live, with every tool verified end to end. The catalog behind it holds over 21,000 quality-checked rule-units across thirty-four jurisdictions, all passing the fidelity gate, including a full county code and several Texas city codes. Two of those jurisdictions are public and free to read; the rest are platform-internal inventory. The crypto payment rail is built and tested. And the layered catalog architecture, the structure that lets each new jurisdiction be added cheaply, is built.

**Building now.** The active work is corpus depth: onboarding more jurisdictions onto the catalog, one at a time. Each jurisdiction's own zoning and development code is independent work that compounds the catalog steadily.

**Designed and ahead.** The shared model-code base is the highest-value layer of the catalog, and the one piece that depends on an outside agreement. The model codes are published by standards bodies (the ICC and the NFPA); ingesting them is gated on a data agreement with those publishers, a partnership conversation now in progress. That is consistent with how Hauska treats every source: as a partner. Also ahead: the paid tier and self-serve signup, the traditional-card payment rail, the verified-document sale and delivery capability, the public go-to-market launch, and the first paying customers.

## The shape of the business

**The buyer** is the agent builder: a developer or a small team building construction-technology, permitting, real-estate, or civic-software agents that need trustworthy jurisdictional answers. They reach Hauska through the developer ecosystems they already work in.

**The pricing model** is usage-based, not seat-based. Free for Layer 1 access; paid and metered per call for Layer 2. Hauska takes a low single-digit percentage of paid transactions (well below the roughly three percent of card processors, and far below app-store economics). The point is to be the substrate everyone runs on, not to maximize rent per call.

**The economics work** because of the catalog's layered structure. Onboarding a new jurisdiction costs a small amount of compute and about an hour of human review, because the expensive shared base is built once and amortized across every city. That keeps the cost of growth low and predictable.

**The relationships compound.** Because revenue routes back to source jurisdictions and publishers, every city Hauska onboards becomes a partner with a reason to keep its data current and to refer the next city. Growth is a network, not a grind.

## What is next

The immediate path is the public launch of the free storefront and a visibly deepening catalog, which together generate the usage signal and inbound interest that the paid tier and the go-to-market motion are built on. Free access launches first and earns the audience; the paid tier follows; the first paying customers and the broader verified-document business follow that.

The longer arc is the one the name points at: Hauska as the canonical data-and-payment substrate that AI agents run on whenever their work touches the physical world and the rules that govern it.
