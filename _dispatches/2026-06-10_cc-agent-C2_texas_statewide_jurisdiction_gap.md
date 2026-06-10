---
id: 2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap
title: Dispatch — Texas statewide jurisdiction enumeration + coverage gap (the warm-up prioritizer)
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools (cross-repo read: hauska-engine corpus)
kind: dispatch
status: FIRE-READY as recon (read-only, parallel-safe on cc-agent-C2); feeds the post-launch jurisdiction warm-up program
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, 59_spine_moat_and_high_value_features, _decisions/2026-06-10_texas_coverage_demand_driven, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis, 80_adrs/adr_019_layered_code_substrate, 20_agent_operating_rules]
---

# Texas statewide jurisdiction enumeration + coverage gap

> The operator wants Texas "made whole" — but per the pre-mortem (2026-06-10) and the web-first thesis, that is the job of the demand-driven jurisdiction warm-up, NOT a flat batch ingest of ~1,500 jurisdictions (which would break commitment 3). This recon is the prioritizer: enumerate the Texas jurisdiction universe, cross-reference what is ingested/warmed, and produce a DEMAND-TIERED fill map so the pre-warm hits the high-demand tier and the long tail is left to on-demand warming. It extends the reusable matrix template from B2 ([`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md)) from a handful of metros to the full state, jurisdiction-level. Read-only; runs on cc-agent-C2 so it never touches the cc-agent-C bottleneck. Decision frame: [`_decisions/2026-06-10_texas_coverage_demand_driven.md`](../_decisions/2026-06-10_texas_coverage_demand_driven.md).

You are **cc-agent-C2**, recon owner. READ-ONLY — no branch, no PR, no schema, no warming. Separate worktree / clone; do not touch the cc-agent-C working tree. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`_decisions/2026-06-10_texas_coverage_demand_driven.md`](../_decisions/2026-06-10_texas_coverage_demand_driven.md) — the demand-driven framing (why not flat-batch)
2. [`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md) — B2; the reusable matrix template + the Layer-3-only / edition-drift findings to extend
3. [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 1 — the user-warm coverage-escalation (the demand-driven mechanism this feeds)
4. The ingested sets: `code_atoms` on the deployment Neon (8 TX jurisdictions per B2); `centralTexasPilot.ts` (34 `_tx` engine keys); `reasoning_atoms` (warmed `austin_tx`)
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## Scope (recon — enumerate, cross-reference, prioritize)

1. **Enumerate the Texas universe (sourced).** Build the jurisdiction list that matters for the designer audience: Texas incorporated cities (the material ones — by population/permit volume), plus the 254 counties for unincorporated-area code authority, plus the state floor (SECO energy, TDLR/TAS). Do not hand-type 1,200 cities; source the list (e.g. Texas Comptroller / Census incorporated-places, an ICC/UpCodes adoption map) and rank by population + permit-volume proxy. The output is a RANKED jurisdiction list, not a flat dump.
2. **Cross-reference what we have.** For each enumerated jurisdiction, mark coverage state against the live stores: corpus Layer-3 (the 8 on Neon), engine-only (the centralTexasPilot keys not on Neon), reasoning-warmed (austin_tx today), or MISSING. Carry the B2 five-way verified split where reasoning atoms exist. **Flag San Marcos explicitly** — it is a live-customer jurisdiction (146 S. Fredericksburg, a 3-story triplex bid) and Central Texas, and it is currently MISSING from all stores; confirm its adopted IBC/IRC edition + local amendments + the UpCodes/Municode slug so a warm is config-ready (this is the priority-1 fill).
3. **Demand-tier the fill map.** Group into tiers: **Tier 1 pre-warm** (the high-demand set — the 7 major metros + the Central Texas cluster incl. San Marcos, San Marcos #1); **Tier 2 pre-warm-if-cheap** (mid-size cities on web-groundable portals); **Tier 3 demand-driven only** (the long tail — warmed on first use via the user-warm path, never pre-warmed). The tiering IS the cost-commitment mechanism: Tier 1 is a bounded pre-warm; Tiers 2–3 amortize to demand.
4. **Size Tier 1 against the cost envelope.** Per-jurisdiction warm cost estimate (web-first compute ~$1–2 + the human-review hour for curation/admission), confirming Tier 1 stays within commitment 3, and naming which jurisdictions are UpCodes-section-verifiable now vs ICC-creds-gated (the IECC/IFC fault line from PR #163) vs municipality-scoped-slug.
5. **Connect to the warm-up mechanism.** State explicitly how the fill executes: Tier 1 via the existing cold-warm harness per jurisdiction (slug + adopted-edition manifest + run, the Austin-2024 pattern); Tiers 2–3 via the user-warm coverage-escalation ([`59`](../59_spine_moat_and_high_value_features.md) item 1) — warm-what-we-can on first use, honest coverage report, team curation gates admission. No flat batch; no user-supplied content into the shared corpus.

## Acceptance criteria

- A ranked Texas jurisdiction list, sourced (not hand-typed), with the ranking basis stated.
- Per-jurisdiction coverage cross-reference against the live stores (corpus / engine-only / warmed / missing), with the verified split where applicable.
- **San Marcos confirmed: adopted edition + local amendments + slug, flagged priority-1 fill, config-ready for a warm.**
- The three-tier demand map (pre-warm / pre-warm-if-cheap / demand-driven), with Tier 1 sized against commitment 3 and the verifiable-vs-gated split named.
- The execution path stated (cold-warm harness for Tier 1; user-warm for the tail); explicitly NOT a flat batch.
- Read-only: no code, schema, warming, or PR.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C2_texas_statewide_jurisdiction_gap.md`: the ranked list + sources, the coverage cross-reference, the San Marcos config-ready entry, the three-tier demand map sized against the envelope, and the execution path. Flag any adoption cell unverified.
