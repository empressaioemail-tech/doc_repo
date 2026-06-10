---
id: 2026-06-10_cc-agent-C_texas_coverage_gap_analysis
title: Dispatch — Texas coverage gap analysis (have-vs-need recon)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY after B1 (cold-warm runs) lands — recon, read-only, no PR
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, _catalog/codes, 80_adrs/adr_019_layered_code_substrate, 20_agent_operating_rules]
---

# Texas coverage gap analysis (have-vs-need)

> Front B step B2 of the GTM-readiness sprint ([`58`](../58_gtm_readiness_sprint.md)). A read-only recon that maps what the library HAS against what a Texas architect launch NEEDS, scoped to Texas, and produces a prioritized fill-list. Texas is the test-run and the template the post-ICC geography expansion reuses, so the matrix shape matters as much as the Texas contents. Fire after the cold-warm runs (B1) land so the warmed counts are real.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on failure after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Read first

1. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the launch gate (Texas-first) this feeds
2. [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) — the two-stores + overlay; what cold-warm produced
3. The six manifests in [`_catalog/codes/`](../_catalog/codes/) and the B1 cold-warm runs report (`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md`) — the Texas have-vs-warmed split
4. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — Layer 1 base / Layer 2 amendment / Layer 3 local model
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## Scope (recon only — no schema, no corpus change, no warming)

1. **Enumerate HAVE.** From live source (the corpus retrieval layer + the `reasoning_atoms` warmed set), enumerate what exists for Texas: code family × edition × jurisdiction, with per-cell confidence/verification state. Use the actual stores, not the docs (the doc counts lag). Report the corpus-vs-reasoning split per cell.
2. **Define NEED (Texas).** For the Texas launch geography, the need is: the I-Code family at the editions Texas jurisdictions actually adopt (Texas is largely a 2015/2018/2021 I-Code state by jurisdiction — VERIFY per family against authoritative adoption sources; do not assume a single statewide edition), the major-metro local amendments (at minimum the high-population Texas jurisdictions — Houston, San Antonio, Dallas, Austin, Fort Worth, El Paso, Arlington, and the Bastrop network already in corpus), the energy code (Texas adopts IECC with state amendments via SECO — verify the in-force edition), and the accessibility track (TAS / Texas Accessibility Standards as the state ADA-equivalent, distinct from the federal ADA/FHA already in corpus). Flag NEC/NFPA as license-gated (deeplink-only until the NFPA track lands) and ICC licensed text as creds-gated.
3. **Build the matrix.** A have/warmed/missing matrix: rows = code family × edition, columns = Texas jurisdiction (+ a statewide/base column), cells = have-corpus / have-warmed / partial / missing, with confidence/verification. The matrix STRUCTURE is the reusable template — design it so swapping the jurisdiction column set retargets it to any future state.
4. **Prioritized fill-list.** Rank the missing/partial cells by expected Texas-launch demand (metro population × likelihood an architect there runs a review). Name, per top item: the family/edition/jurisdiction, the authoritative source to warm from (Municode / eCode360 / American Legal / UpCodes / ICC), the layer (base vs amendment vs local), and whether it is web-groundable now or license-gated.
5. **Adoption-fact verification.** Every edition-adoption claim (which Texas jurisdiction is on which I-Code edition) carries a source. Do not assert adoption from model knowledge; verify against the jurisdiction's adoption ordinance / Municode / the ICC adoption map and cite it. Flag any you could not verify.

## Acceptance criteria

- HAVE enumerated from live stores (corpus + reasoning), per-cell, with the corpus-vs-warmed split — not from the docs.
- NEED defined for Texas with every edition-adoption claim sourced (TAS, IECC/SECO edition, and the per-metro I-Code editions verified, not assumed).
- The have/warmed/missing matrix delivered, structured as a reusable template (jurisdiction columns swappable for geography expansion).
- Prioritized fill-list with source + layer + groundable-vs-gated per item, ranked by Texas-launch demand.
- Read-only: no schema, no corpus change, no warming run, no PR. Any warming is a follow-on (re-run B1 with the fill-list, or a scoped fill dispatch).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md`: the HAVE enumeration, the sourced NEED, the matrix, the prioritized fill-list, the adoption-fact sources, and any cell you could not verify, with blockers verbatim.
