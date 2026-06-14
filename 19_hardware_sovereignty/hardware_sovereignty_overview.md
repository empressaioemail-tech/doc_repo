---
id: hardware_sovereignty_overview
title: Hardware and sovereignty — folder overview
status: active
last_updated: 2026-06-14
applies_to: portfolio
owner: planner
related: [09_post_saas_substrate_thesis, 08_tiered_access_model, mox_executive_summary_v2]
---

# Hardware and sovereignty

This folder holds the hardware story: where on-prem and edge AI hardware is going, what we can credibly put behind a sovereignty pitch, and the client-facing talk tracks for cloud-versus-local and for cost in a world where every token gets more expensive. It exists because the question keeps coming up in pitches (it surfaced live in the Mox meeting) and the answers should compound in one place instead of being re-derived each time.

## Why this matters to the spine

Local hardware is the physical expression of the commitment we already make in framing: you own your spine forever, and a tenant's private data and adjudications stay isolated to that tenant. "You own everything" lands harder when there is a box in the customer's building they can point at. Tenant data sovereignty is a customer-trust requirement, not a sourcing ethic (see CLAUDE.md and `09_post_saas_substrate_thesis.md`), and on-prem hardware is the most concrete way to honor it. The market tailwind is real and not hype: sovereign and on-prem AI is now a board-level priority for enterprises, and on-prem is projected to take a meaningful slice of regulated US enterprise LLM workloads by 2027.

## The guardrail (read before pitching this)

We are not a hardware vendor and the Hauska spine rule says hardware only earns cycles as the sovereignty-story carrier, never as a product line. Three offer shapes exist, lightest to heaviest:

1. Reference architecture only. We publish a tiered spec sheet and the customer buys the hardware themselves. This is the default and the spine-rule-safe option.
2. Sovereignty-tier services attach. We spec, configure, and ship a box per tenant that runs the local execution model and holds the spine, with frontier reasoning bursting to cloud. This is margin-bearing integration revenue, scoped as attach, never allowed to pull engineering off the spine.
3. Full on-prem deployment. Rack-tier, only for a tenant large enough to justify it.

Lead with option 1 in any deck. Quote option 2 only when an IT lead pushes on "where does the data live." Do not let this become a hardware business.

## What's in here

- `hardware_reference_architecture.md` — internal one-pager. The tiered hardware menu, the sourced competitive table, the AMD "agent computer" anchor, and the corrections to the claims made loosely in the Mox room. This is the cheat sheet you read before a hardware conversation.
- `client_brief_local_and_cloud.md` — client-facing. What the hardware does and why, cloud-by-default with a clean local option, and the cost argument for a rising-token-cost world. Written to drop into a pitch.

## Sourcing note

Hardware specs and especially prices move fast (NVIDIA workstation GPU pricing roughly doubled inside a year). Every figure in the reference architecture carries a source and an as-of date. Treat dollar amounts as snapshots, not quotes, and re-verify before putting a number in front of a customer. The full source list lives at the bottom of `hardware_reference_architecture.md`.
