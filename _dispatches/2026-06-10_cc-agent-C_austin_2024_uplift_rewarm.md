---
id: 2026-06-10_cc-agent-C_austin_2024_uplift_rewarm
title: Dispatch — Austin 2024 adopted-package manifests + verified re-warm (launch hero library)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED — fire after the driver section-extraction fix lands; produces the launch-hero verified Austin library
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, _decisions/2026-06-10_austin_2024_launch_metro, _catalog/codes, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis, 80_adrs/adr_019_layered_code_substrate, 20_agent_operating_rules]
---

# Austin 2024 adopted-package manifests + verified re-warm

> The operator chose Austin @ 2024 as the launch hero ([`_decisions/2026-06-10_austin_2024_launch_metro.md`](../_decisions/2026-06-10_austin_2024_launch_metro.md)). B1 warmed the wrong edition (2021) against `austin_tx`; Austin's in-force package is **2024** (effective July 10, 2025) and it is NOT a clean I-Code set — per B2, Austin adopts **UMC/UPC 2024** (Uniform Mechanical/Plumbing) instead of IMC/IPC, plus IRC/IBC/IECC/IFC 2024, NEC 2023, A117.1, and the statewide **TAS 2012**. This dispatch authors the Austin-2024 manifests and re-warms with the fixed section-extraction driver to produce a genuinely verified-grounded launch library. Fire AFTER the driver fix lands (otherwise the re-warm persists unverified again).

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `codewarm/`.

## Read first

1. [`_decisions/2026-06-10_austin_2024_launch_metro.md`](../_decisions/2026-06-10_austin_2024_launch_metro.md) — the launch-metro decision
2. [`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md) — the Austin adopted-package row + sources; the edition-drift + UMC/UPC + TAS findings
3. The driver section-extraction fix (must be merged first) + the config-driven `driverProfiles.ts` slug table
4. The six 2021 manifests in [`_catalog/codes/`](../_catalog/codes/) — the shape to clone at 2024
5. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — Layer 1 base / Layer 2 amendment
6. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope (sequence)

1. **Author the Austin-2024 adopted-package manifests** in `_catalog/codes/` (doc_repo), cloning the 2021 manifest shape at the correct editions and codes per the B2 Austin row, sourced to Austin's adopted technical codes: **IRC 2024, IBC 2024, IECC 2024 (muni), IFC 2024, UMC 2024, UPC 2024** (NOT IMC/IPC — Austin uses the Uniform codes), plus **A117.1** at Austin's adopted edition and **NEC 2023** (deeplink-only, license-gated). Carry `verify: true` on any section whose 2024 number you are not certain of — section numbering changed between 2021 and 2024 and between I-codes and Uniform codes. Add the Austin UpCodes 2024 slugs to `driverProfiles.ts` (`austin/{book}-2024`).
2. **Author a TAS 2012 manifest** — the Texas Accessibility Standard (TDLR), statewide, absent from the original six. High-traffic accessibility sections; web-groundable from TDLR; this is distinct from federal ADA/FHA and from A117.1.
3. **Verification gate FIRST (recon, report before mass warm).** With the fixed section-extraction driver, verify every `verify: true` section and a ≥20% sample of the rest against the Austin 2024 source; report which resolve `verified`, which fail, and any 2024-non-existent/renumbered section. Correct or drop before warming. This gate is the whole point now that the driver can verify.
4. **Re-warm `austin_tx` at 2024.** Run the harness over the Austin-2024 manifests + TAS with the fixed driver; honor corpus-aware precedence (overlay where the Layer-3 corpus genuinely covers — but note B2's caution that 2021 "corpus-overlay verified" matches were fuzzy against local ordinance text, so do NOT trust a corpus-overlay match unless it is a real I-Code section, not a section-number collision in local UDC text). Record per-family cost + verified-rate.
5. **Eval + boundaries.** Per-family eval (edition-correct = 2024, verified where the driver confirmed, snippet capped, no verbatim, no finding); wrong-edition spot-check (force 2021-vs-2024 mismatch, assert refusal); no-verbatim boundary green.

Out of scope: the other launch metros (Houston/Dallas/SA — separate metro-expansion dispatches, follow Austin); ICC licensed tier (creds-gated); the driver fix itself (prerequisite dispatch).

## Acceptance criteria

- Austin-2024 manifests authored at the correct adopted package (IRC/IBC/IECC/IFC 2024 + **UMC/UPC 2024** + A117.1 + NEC-2023-deeplink), plus a TAS 2012 manifest; Austin 2024 slugs in `driverProfiles.ts`.
- Verification gate report filed before mass warm: 2024 section resolutions / failures / renumbered, corrections applied.
- `austin_tx` re-warmed at 2024 with a real **verified rate** reported per family (the launch metric — what fraction is genuinely grounded, not just persisted); corpus-overlay matches validated as real I-Code coverage, not local-text collisions.
- Eval passes (edition = 2024); wrong-edition refuses; no-verbatim boundary green; cost inside cap.
- Manifest authoring committed to doc_repo `_catalog/codes/` (hold for operator merge if it is a doc_repo PR; the warm run itself is data-only on the reasoning layer, no schema/corpus change).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_austin_2024_uplift_rewarm.md`: the manifests authored, the verification-gate report, the per-family **verified rate** (before/after vs the 2021 unverified baseline), the cost, the eval + boundary output, and blockers verbatim.
