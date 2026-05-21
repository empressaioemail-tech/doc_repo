# Hauska + ICC — Partnership Brief

*Making the I-Codes available to AI agents, with ICC in control and paid. Version 1, May 2026.*

Hauska builds the data and payment layer for AI agents that do physical-world work. Our catalog turns the rules that govern a place, its building codes and zoning and permitting requirements, into something an AI agent can query and trust. This brief is for the International Code Council.

---

## The short version

AI agents are starting to do real building work, and to do it they need the building codes. A new market for code data is forming, and today it has no authorized channel. Hauska is building that channel. This brief proposes a partnership in which ICC keeps full control of its code text, earns a new usage-based revenue stream from every agent query, and becomes the source of record for the I-Codes as AI enters the building industry.

## What is changing

Software that uses AI is moving from demonstrations into real use across the building industry. Tools now exist, and more arrive every month, that help design buildings, prepare permit applications, review plans, and answer code questions. Every one of those tasks depends on the building code that applies in a specific place. The software has to consult the IRC, the IBC, the IECC, and the rest, the same way a plan reviewer or an architect does.

That demand is new, it is growing quickly, and it is a market that did not exist a few years ago. The people building these tools need authoritative code data, and they need it in a form software can read.

## Why this matters to ICC

**A new revenue stream.** ICC monetizes the I-Codes today mainly through publications and the Digital Codes subscription, products built for people to read. AI agents are a different kind of customer with a different pattern: many small, fast, machine-speed lookups. A usage-based channel captures revenue from that pattern that book sales and seat subscriptions are not shaped to reach. Every time an agent consults an I-Code through Hauska, ICC earns.

**Authorized, not pirated.** Agents will consume code data one way or another. The real question is whether they consume it through a channel ICC authorizes and is paid by, or through unofficial copies of uncertain accuracy and provenance. An authorized channel is the difference between a revenue stream and a leak.

**The safety mission.** ICC exists so that buildings are safe. As AI agents help design and permit buildings, the codes those agents rely on must be accurate, current, and authoritative. An agent working from a stale or unofficial copy is a safety risk. Hauska delivers the I-Codes with the edition pinned, the citation attached, and a link back to ICC's official text, so the agent, and the professional behind it, is working from the real thing.

**Attribution on every answer.** Hauska's core principle is that every answer it returns carries its source, a confidence indicator, and a timestamp. For the I-Codes, that means ICC is named and linked on every single code query an agent makes. ICC stays visible and stays the authority.

## The problem today

There is no clean, authorized way for an AI agent to use the I-Codes.

The Digital Codes viewer is built for a person reading in a browser; an AI agent cannot consume it. The structured feed that exists, the Code Connect API, was not built with an agent-catalog partner in mind. So the people building code-aware AI tools face a poor set of choices: assemble what they can from unofficial sources, or build without authoritative code data at all.

Neither choice serves ICC, and neither serves building safety. The demand is real and it is being met badly. That is the gap this partnership closes.

## How Hauska fixes it

Hauska makes the I-Codes queryable by any AI agent, through one channel, in a way that keeps ICC in control. Three things define how it works.

**Hauska hosts the structure, not the text.** Hauska maps how each code is organized: its chapters, its sections, its numbering, and how sections cross-reference each other. On top of that map Hauska adds a reasoning layer that helps an agent apply a section correctly. Hauska does not copy, host, or resell the verbatim normative code text. When an agent or the professional behind it needs the exact code language, the answer links back to ICC's official viewer. The text never leaves ICC.

```
              An AI agent needs a building-code answer
            (designing, permitting, plan review, research)
                              |
                              |  "what does the IRC require here?"
                              v
   +==========================================================+
   |  HAUSKA  —  the channel that makes the I-Codes            |
   |             usable by AI agents                          |
   |                                                          |
   |  WHAT HAUSKA HOSTS           WHAT HAUSKA DOES NOT HOST    |
   |  . the structure: how a      . the verbatim code text.   |
   |    code is organized,          That stays with ICC.      |
   |    section numbers, how                                  |
   |    sections connect          Every answer links back to  |
   |  . a reasoning layer that    ICC's official viewer for   |
   |    helps apply a section     the exact code language,    |
   |  . the citation to ICC       and names ICC as the source.|
   +=============+===============================+============+
                 |                               |
   the agent or  |  verbatim text:               |  a share of every
   professional  |  always ICC,                  |  paid query that
   links through |  always link-through          |  uses an I-Code
   to ICC's text v                               v  flows to ICC
      +--------------------------+   +---------------------------+
      |  ICC keeps full control  |   |  ICC earns a new,         |
      |  of its copyrighted      |   |  usage-based revenue      |
      |  code text               |   |  stream                  |
      +--------------------------+   +---------------------------+

   ICC stays the source of record. The text never leaves ICC.
   Hauska makes the I-Codes agent-ready, and pays ICC for it.
```

**Every answer cites ICC.** Because every Hauska answer carries its source, ICC's authorship is surfaced on every query that touches an I-Code, with a link back to the official text.

**Revenue flows back to ICC.** Hauska charges the operators of AI agents for catalog access. A share of every paid query that uses an I-Code flows back to ICC as the source. The model is simple and usage-based; the exact terms are for ICC and Hauska to work out together.

## What a partnership looks like

ICC already has the building block: the Code Connect API. A partnership would start there, with Hauska licensing structured access to the I-Code data, and grow into a usage-based revenue-share relationship as agent query volume builds.

The division of work is clean. ICC provides the authorized structured data and remains the publisher and the authority. Hauska does the work of making that data agent-ready, building the reasoning layer, and operating the channel that delivers it to AI agents. ICC keeps the text, the copyright, and the control. ICC gains the revenue and the attribution.

Hauska is asking to be a channel for ICC, not a competitor to it. We are the opposite of a code-scraping service: we want ICC authorized, paid, in control, and visible on every answer.

## What we are asking

A conversation.

Hauska's catalog and agent-facing storefront are built and running today, covering local building and zoning codes across a growing set of jurisdictions. The I-Codes are the foundation the whole catalog rests on, and they are the one piece we cannot complete without ICC. We would like ICC to be the foundational publisher partner, in from the start, helping shape how the I-Codes reach the agent economy.

The first step is a short discussion of structured access to the I-Code data, beginning with the Code Connect API. We would welcome an introduction to the right person at ICC to start that conversation.
