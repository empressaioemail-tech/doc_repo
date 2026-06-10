---
id: 2026-06-10_cc-agent-C_austin_verified_rate_deepeners
title: Dispatch — Austin verified-rate deepeners (UMC/UPC section extraction + TAS handling)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED — deepener, NOT launch-blocking (the honest ~35% baseline launches); raises the Austin verified rate; web-first (no ICC creds)
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_austin_2024_uplift_rewarm, 20_agent_operating_rules]
---

# Austin verified-rate deepeners — UMC/UPC + TAS

> The Austin 2024 re-warm ([`_inbox/2026-06-10_..._austin_2024_uplift_rewarm.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_austin_2024_uplift_rewarm.md)) flipped the web-warmed verified rate 0% → ~35%, launchable on the honest-verification baseline. This dispatch raises it on the two web-first families still low: UMC/UPC (~20%, Uniform-code section isolation fails) and TAS 2012 (deeplink-only). It is a DEEPENER, not a launch gate — the honest ~35% library launches as-is. The IFC/ICC-only remainder is NOT in scope here; that is the ICC Code Connect (licensed-tier) lever, gated on creds.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone (separate worktree if the main clone is busy). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `codewarm/`.

## Read first

1. [`_inbox/2026-06-10_..._austin_2024_uplift_rewarm.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_austin_2024_uplift_rewarm.md) — the re-warm; the UMC/UPC + TAS follow-up notes are the spec
2. The driver: `lib/codes/src/webCodeFetch/` (`drivers.ts`, `extract.ts`, `driverProfiles.ts`) — the section-extraction work from PR #163/#164
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope

1. **UMC/UPC section extraction.** UpCodes returns chapter slugs (`chapter/4/ventilation-air`) for the Uniform Mechanical/Plumbing codes but `extractSectionBlock` often fails to isolate the section body, so ~80% stay unverified. Tune the driver for the Uniform-code section DOM/URL pattern (the section anchor structure differs from the I-codes). Goal: raise UMC + UPC verified rate materially (target parity with the I-code families, ~30%+). Re-warm UMC/UPC against `austin_tx` and report the before/after.
2. **TAS 2012 handling.** TAS is deeplink-only today (TDLR). Investigate whether TDLR exposes section-level HTML at a stable URL (allowlist it for section extraction) or whether TAS needs a different path (PDF section ingest). If neither is clean web-first, keep TAS deeplink-only and report why — do not force it. TAS is the state accessibility standard, so even deeplink-with-correct-citation is useful; verified is better.
3. **Preserve the boundaries.** No-verbatim boundary stays green (section body read for verification, discarded, capped snippet only); wrong-edition refusal stays green; quality gate (source + verification state on every atom).

Out of scope: IFC/IPMC ICC-only refs (ICC Code Connect / creds-gated, separate); any non-Austin jurisdiction; the corpus-overlay spot-check (separate validation task).

## Acceptance criteria

- UMC + UPC verified rate materially raised (report before/after per family); the Uniform-code section-extraction path works in the stock driver.
- TAS either section-verifiable (TDLR allowlist) or documented deeplink-only with the reason.
- No-verbatim + wrong-edition boundaries green; quality gate held.
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_austin_verified_rate_deepeners.md`: the driver change, the before/after verified rate for UMC/UPC + TAS, the no-verbatim output, PR URL + SHA, and blockers verbatim.
