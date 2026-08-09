---
id: 05_weight_level_recursion
title: Weight-level recursion — the open-weight path as L5, and its preconditions
status: active
last_updated: 2026-08-02
applies_to: portfolio
owner: nick
related: [64_recursive_loop/00_recursive_loop_overview, 64_recursive_loop/02_selection_pressure, 19_hardware_sovereignty/open_weight_cloud_inference_guide, 19_hardware_sovereignty/hardware_sovereignty_overview, 25a_atom_principle_llm_economics, 21_ai_first_dev_flow, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control]
---

# Weight-level recursion

Everything in docs 00 through 04 is artifact-level recursion: the improving things are rulebooks, gates, ledgers, and calibration records, while the models reading them stay fixed (frontier APIs today). This doc names the one rung above that, weight-level recursion, where selected lessons are pushed into model weights we control, and wires it to the research already filed at [`19_hardware_sovereignty/open_weight_cloud_inference_guide.md`](../19_hardware_sovereignty/open_weight_cloud_inference_guide.md).

The position, stated up front so the doc cannot be misread as a commitment: **L5 is an option kept deliberately open, not a build.** Artifact-level recursion is where the compounding is today, it works with any model behind it, and nothing below L3 maturity earns a training run.

## What weight-level recursion would mean here

The open-weight guide establishes the mechanics: Hub-published weights (Qwen, gpt-oss, DeepSeek and peers), rented GPU inference, LoRA or full fine-tune artifacts we own, and a pin-stage-eval-promote upgrade workflow. In this folder's vocabulary, that last item is the load-bearing one: **the upgrade workflow is a selection loop on models themselves.** A new checkpoint (from the originator or from our own fine-tune) is a candidate rule; the eval suite is the gate; promotion to production is graduation; keeping the prior revision warm for rollback is the retirement rule. The guide already prescribes the right shape; this doc just names it as the same architecture.

The distinctive move L5 would add is closing the loop with our own data: fine-tuning on adjudicated, gate-stamped examples the artifact loops produce (adjudication records, refuted-versus-confirmed findings, graded envelope predictions). The artifact loops manufacture exactly the training signal a domain model would need, which is why L5 sits above them on the ladder rather than beside them: it consumes their output.

## Preconditions (the honest gate)

All four must hold before any weight-level work is more than research. Today none fully hold.

**1. An eval suite that is real selection pressure.** Per [`02_selection_pressure.md`](02_selection_pressure.md), an eval that passes vacuously bans itself; the current jurisdiction eval suite was ruled unpublishable for exactly that. Until a curated, query-bearing eval exists for the target workload, staging a new checkpoint has no gate to pass, and an ungated model swap is tier 5 self-report at the weight level.

**2. Enough adjudicated examples.** Fine-tuning on dozens of examples buys style, not judgment. The deposit-to-atom lineage build and the adjudication ledger are the factories for this corpus; the corpus size worth acting on is a question to answer at the time, from the ledger, not asserted here.

**3. The tenant-sovereignty filter, structurally enforced.** Only public-tier and anonymous signal may train anything shared (ADR-005, ADR-017, and the tenant data sovereignty principle). A training-set assembly step is a pooling operation, exactly the operation the sovereignty rule constrains, so the filter must be a fail-closed accessPolicy gate on the training pipeline, not a promise. Rented-GPU inference also sends prompts to the host; the hardware sovereignty overview's guardrails cover when dedicated tenancy or on-prem is required instead.

**4. A workload where a controlled model wins.** The candidate profile per the guide and [`21_ai_first_dev_flow.md`](../21_ai_first_dev_flow.md): high-volume, narrow, well-evaled tasks (extraction, classification, atom minting QA) where a small controlled model beats a frontier API on cost, latency, or sovereignty, with the frontier planner seat unchanged. Atom-structured context already compresses tokens regardless of host (per [`25a`](../25a_atom_principle_llm_economics.md)); L5 is justified by control and unit economics, not by capability chasing.

## What flows from the guide's open items

The guide leaves model family and hosting tier as operator choices pending workload profile. This doc adds the sequencing answer: those choices are not blocked on taste, they are blocked on precondition 1. The first concrete L5-adjacent artifact worth building, whenever the operator wants motion here, is the eval suite for one narrow workload, because it pays off immediately at L2/L3 (it grades today's frontier-model outputs too) and is the prerequisite for everything above it. That is the general pattern with this ladder: every investment toward L5 must also pay rent at the level the portfolio actually occupies.

## Relationship to the rest of the folder

The ladder in [`00_recursive_loop_overview.md`](00_recursive_loop_overview.md) ends L0 through L4 with L5 marked "explicitly not now." This doc is the expansion of that marker: what L5 is, what it costs to earn, and where its mechanics already live (the hardware sovereignty folder). If the preconditions clear and the operator rules go, the decision gets its own record in `_decisions/` with reversal criteria; this doc then flips from option to program and gains a WDLL.
