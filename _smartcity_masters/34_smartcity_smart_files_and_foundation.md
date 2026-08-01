---
id: 34_smartcity_smart_files_and_foundation
title: SmartCity Smart Files and the data foundation — master
status: active
last_updated: 2026-08-01
applies_to: smartcity
owner: nick
related: [30_smartcity_os, 31_smartcity_dashboards, 32_smartcity_asset_management, 33a_smartcity_plan_review, 42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, 25b_monetization_provenance_storage_stack, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer]
purpose: The master for the data foundation underneath all three SmartCity categories, and for Smart Files — the customer-facing face of it that replaces a city's file system. Source of truth for what the foundation is, what it guarantees, what a city sees, and what may be said externally. Written to be consumed by a design agent producing collateral; the external-language and approved-claims sections are the only parts that may be printed market-facing.
---

# Smart Files and the data foundation

Not a fourth category. This is the foundation the three categories — Dashboards, Asset Management, Plan Review — are built on, plus the one part of it a city sees and uses directly.

## How to use this document

This is a source-of-truth master, not collateral. A design agent draws from [External language](#external-language-what-may-be-said) and [Approved claims](#approved-claims-register), and from nothing else. Sections marked INTERNAL ONLY must never appear in a market-facing artifact.

The naming discipline for this document is strict and asymmetric. **Smart Files is a name a city sees.** The foundation underneath it is **never named** in customer material — it is described in one sentence and nothing more. Do not invent a product name for the foundation. Do not say storage layer, substrate, atom, node, graph, or IPFS to a customer, ever.

## The structure

Three things, and the distinction matters for how each is written about.

**The foundation.** The way data is captured and processed so that everything else can be built on it. Described to a customer in one sentence, never named, never diagrammed, never sold as a line item.

**Smart Files.** The part a city touches: where their documents and records live, searchable in one place, where a revision lands everywhere at once. This has a name because people use it.

**The intelligence layer.** Compass, reworked — an intelligent sidebar that follows the user and reads across the foundation. Covered here because it depends entirely on the foundation; it is not a category.

INTERNAL ONLY: the foundation is the node-and-graph substrate, built and running in the command center. The external work is rendering and marketing it in a city's own language, not building it. Atoms and nodes carry CID identifiers already.

## The foundation

**One sentence, and this is the whole customer-facing story:** the way we capture and process data is the foundation for everything else to get built.

That is the depth a city needs. Nine out of ten people do not care how the pieces interrelate; they care that it works. The tenth asks, and gets the sentence above, and that is enough.

INTERNAL ONLY — what the foundation actually provides, and why every claim in the other three masters rests on it.

Every fact carries its source, its timestamp, a confidence signal, and an access policy as part of what it is, rather than as metadata attached later. There is no path that produces a fact without them. That is why Dashboards can promise that the numbers agree, why Asset Management can promise a record that holds up years later, and why Plan Review can promise that the reasoning behind a decision is still openable.

Access is a property of the record, resolved at read time (ADR-017). That is why the lens model is cheap to extend and why a citizen-facing view and a police-facing view can sit on the same records without two separate systems.

Nothing is silently overwritten. History is kept by default, so the current state and what preceded it are both retrievable.

Everything is addressable and connected: a document, a place, an asset, and a decision are all things that can be pointed at and related to one another. This is the property that makes a change propagate and a query cross domains.

## Smart Files

**What a city gets.** One place to search everything they hold. A document lives once and appears everywhere it belongs. Revise it once and it is current everywhere — and what it was before is still there.

This is the replacement for a city's file system, and it is the most immediately legible thing in the SmartCity offering. Every person in a city hall has lost a document, found four versions of it, or updated one copy of five. Smart Files is that problem, gone.

**Why the "still there" half matters.** "Revise once, updated everywhere" is unambiguous for a document. But the same structure holds a city's records, and a city does not want history silently rewritten — a superseded ordinance, a prior condition assessment, and last year's decision all need to remain retrievable. So the promise is the current version everywhere plus the previous one still there. That is both what the foundation does and a better promise than plain propagation.

INTERNAL ONLY: this is also what protects the Asset Management durable-record claim and the Plan Review reasoning-still-openable claim. All three rest on history being kept, not on propagation alone.

INTERNAL ONLY — mechanics. Files are atoms with attachments; folders are nodes; a document referenced in many places is one record with many relationships rather than many copies. This is the workspace family in the atom contract. Never explain it this way externally — a city hears "where your files live and search actually works."

## Ownership and portability

**A city owns its data.** Said plainly, without mechanism.

INTERNAL ONLY — what makes this true and where the line is. The target is content-addressed distributed storage (IPFS); prototypes have been run, the mechanics are figured out, and atoms and nodes are already programmed with CID identifiers. Initial deployment is on Google Cloud. Because of how the records are identified and structured, a city can host them elsewhere — ownership is structural rather than contractual.

The honest boundary: it is built so a city can take it, and it is not distributed today. Say that the city owns its data and is not locked to us or to any single host. Do not say a city's records are on a distributed network today, because they are not. Do not say IPFS, content-addressed, or distributed storage in any customer-facing material — ever, per operator ruling 2026-08-01. All of this is custom work, so ownership needs no mechanism attached to be credible.

## The intelligence layer

Compass, reworked: an intelligent sidebar that follows the user through the system, reading across everything the city holds.

**Why it works when other city AI assistants do not.** Until the data is machine-readable, a chatbot on top of it is useless. Every city has been pitched an AI assistant; the ones that disappoint fail because the systems underneath were never made readable. The foundation is what makes an assistant able to actually answer.

INTERNAL ONLY: current Compass is an Anthropic-driven assistant surface embedded across the suite (`30_smartcity_os.md`), and it is being reworked to the sidebar shape modeled in the Mox demo. The dependency direction is the load-bearing point and it is genuinely differentiating: this is not a chatbot with data access, it is an intelligence layer over a substrate built to be read. State the capability; do not claim the reworked sidebar is shipped until it is.

## The learning loop

INTERNAL ONLY — do not sell this.

Ambient capture, the plan-review adjudication write-back, and "it learns your city" are the same loop appearing in different places: what a city's staff decide and do becomes part of the record and improves what the system can answer. It is our thesis and the earning half of the confidence commitment.

It is not a customer-facing value proposition. A city buys money, capacity, and things working — not a system that learns from them, which invites the wrong questions. The narrow honest customer-facing expression is consistency that does not depend on who is at the desk, and knowledge that does not leave when staff do.

Consequence for reconciliation: `07a_smartcity_product_positioning.md` sells ambient capture as a fourth surface ("it learns your city"). Under this model it is a property of the foundation, not a surface. Demote it in the reconciliation pass.

## What this means for the three categories

Every category claim traces here. Dashboards agree because there is one record. Asset Management is durable because history is kept and access is carried on the record. Plan Review can show its reasoning because provenance is intrinsic. Smart Files is the foundation with a face on it.

A city does not need to understand the relationship. They need each category to work and the answer to "why does yours actually work" to be one sentence.

## Constraint set for the peer-recommendation sentence

INTERNAL ONLY. Full constraints in `31_smartcity_dashboards.md`. The foundation-specific note: this is the least likely category to be named in a hallway recommendation and the most likely to be *felt* in one. A city manager will not say "their data foundation is good." They will say something like "I can actually find things now" or "we changed it once and it was right everywhere." Smart Files is the phrasing that survives; the foundation is not.

## External language: what may be said

This section and the next are the only parts of this document that may be used in collateral.

**The foundation sentence.** The way we capture and process data is the foundation for everything else to get built.

**Smart Files one-liner.** Search all your smart files from one easy-to-use interface.

**The promise.** Revise once and it is updated everywhere — and what it was before is still there.

**The short description.** Everything your city holds, in one place you can actually search. A document lives once and shows up everywhere it belongs, so when someone revises it, it is current everywhere at once — and the previous version is still there when you need it. Your data is yours.

**The three things to lead with.**

1. *Find anything, from one place.* One search across everything your city holds, instead of four systems and a shared drive.
2. *Revise once, current everywhere.* A change lands everywhere that document appears. Nothing is silently lost — what it was before is still there.
3. *It is yours.* Your data belongs to you, and you are not locked to us or to any single host.

**On the intelligence layer.** An assistant that follows you through the system and can actually answer, because everything underneath it was built to be read.

**Language to avoid.** Never say storage layer, substrate, atom, node, graph, IPFS, content-addressed, distributed storage, digital twin, RWA, tokenization, on-chain, or blockchain. Never name the foundation as a product. Never claim records are distributed today. Never sell the learning loop.

## Approved claims register

| Claim | May be stated as | Source |
|---|---|---|
| One search across everything the city holds | "search all your smart files from one easy-to-use interface" | Operator copy 2026-08-01; substrate built (command center) |
| Revise once, current everywhere | "revise once and it's updated everywhere" | Operator copy 2026-08-01 |
| Prior versions remain retrievable | "what it was before is still there" | Foundation; history kept by default |
| A document lives once, appears everywhere it belongs | Stated plainly | Workspace family; substrate built |
| The city owns its data | "your data is yours" — plainly, without mechanism | Operator ruling 2026-08-01; tenant sovereignty |
| Not locked to us or a single host | "you're not locked to us or to any one host" | CID identifiers programmed; portability structural |
| The foundation makes everything else work | The one foundation sentence, verbatim | Operator copy 2026-08-01 |
| An assistant that can actually answer | "because everything underneath it was built to be read" | Foundation; Compass rework |
| Who sees what is controlled | Stated plainly | ADR-017 |

**Claims explicitly NOT approved.** Any statement that records are on IPFS, distributed, or content-addressed storage today. Any use of the words in the avoid list. Any claim that the reworked Compass sidebar is shipped before it is. Any framing of the learning loop as a customer benefit. Any name for the foundation.

## Open items

1. **Smart Files rendering.** The substrate is built; the city-facing Smart Files surface is a rendering and marketing pass, not a build. Scope it in the rebuild.
2. **IPFS migration.** Target for the rebuild; prototypes run, mechanics figured, CIDs already carried. Until migrated, portability is structural rather than operational — collateral must hold that line.
3. **Compass rework.** Sidebar shape per the Mox demo. Not shipped; do not claim it as shipped.
4. **07a reconciliation.** Ambient capture demotes from fourth surface to a property of the foundation, and is not sold.
5. **Name durability.** "Smart Files" fits the smart site / smart report family and is adopted as of 2026-08-01. Revisit only if it collides in practice.

## Revision history

- 2026-08-01, origin. Defined in strategy session: the foundation is not a category but what the three categories are built on, described externally in exactly one sentence and never named; Smart Files named as the customer-facing face replacing a city's file system; ownership stated plainly with IPFS barred from all customer material; Compass positioned as the intelligence layer whose value depends on the foundation being machine-readable; ambient capture and the plan-review write-back identified as one internal learning loop that is not sold.
