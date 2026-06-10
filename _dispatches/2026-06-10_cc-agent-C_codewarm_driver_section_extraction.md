---
id: 2026-06-10_cc-agent-C_codewarm_driver_section_extraction
title: Dispatch — driver section-level HTML extraction (flip unverified-web-source -> verified)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — launch-gating (the grounding mechanism); metro/edition-agnostic
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs, 20_agent_operating_rules]
---

# Driver section-level HTML extraction — make the warmed atoms actually verify

> B2 ([`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md)) confirmed the launch-gating P0: of 725 warmed atoms, **0 are verified-from-web** — all 552 web-warmed atoms are `unverified-web-source` because the driver fetches book/chapter **landing HTML**, not the **section body**, so the harness can't confirm the section number/title against the authoritative text. This dispatch fixes the driver to extract section-level content so verification passes. Metro/edition-agnostic; it's the grounding mechanism the whole "grounded" launch claim rests on. Fire now.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `codewarm/` off the updated main.

## Read first

1. [`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md) — the P0 verification-quality finding; the 552 unverified atoms
2. [`_inbox/2026-06-09_..._codewarm_runs.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md) — B1 run; how `resolved` vs `verified` diverged (landing HTML >120 chars but section body not confirmed)
3. The driver: `lib/codes/src/webCodeFetch/` (`drivers.ts` / `driverProfiles.ts` — the config-driven slug table from the harness-fix); the fetch + the verification step that sets `verification_state`
4. [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) — the no-verbatim boundary the fix must NOT violate
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## The fix (sequence)

1. **Fetch the section, not the chapter.** Change the driver from chapter/landing URLs to **section-level** fetches against UpCodes (e.g. the section anchor/route that returns the specific section's heading + body for `up.codes/viewer/{jurisdiction}/{book}-{year}/chapter/{n}` → the section node), so the response contains the actual section number + title + body. Handle UpCodes' section DOM/anchor structure; fall back to the ICC `…P1/chapter-{n}` section node where UpCodes lacks a section path.
2. **Verify against the section body.** Confirm the manifest section number AND title against the fetched section heading; on match set `verification_state = verified`; on mismatch/renumber/absent keep `unverified-web-source` (and report it — that is a manifest-or-edition signal, not a silent pass). Edition must match (the wrong-edition refusal stays green).
3. **Respect the no-verbatim boundary (HARD).** Extracting the section body to VERIFY does not mean STORING it. The atom still stores reasoning + citation + capped snippet + deeplink + verification state — never the full verbatim section. The boundary test must stay green: verification reads the body in-memory to confirm number/title, then discards it; only the capped, non-verbatim atom persists.
4. **Prove the flip.** Re-warm a representative sample of `austin_tx` refs (the existing 2021 data is fine for the proof — this is the mechanism test, not the launch re-warm) and show `unverified-web-source → verified` on the sample, per family, with the no-verbatim boundary still green and the wrong-edition refusal still firing. Report the before/after verified-rate.

Out of scope: the Austin 2024 edition uplift + full launch re-warm (separate QUEUED dispatch); ICC licensed text (creds-gated); any corpus/schema change beyond the driver + verification logic.

## Acceptance criteria

- The driver fetches section-level content; verification confirms number + title against the section body; matched refs flip to `verified`, mismatches stay `unverified-web-source` and are reported.
- **No-verbatim boundary green (HARD):** the full section body is never persisted; only the capped non-verbatim atom + deeplink + verification state.
- Wrong-edition refusal still passes.
- Proof: a sampled `austin_tx` re-warm shows a real `unverified → verified` flip rate per family (report the numbers).
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_codewarm_driver_section_extraction.md`: the driver change, the before/after verified-rate per family, the no-verbatim boundary output verbatim, any sections that stayed unverified (with the reason), PR URL + SHA, and blockers verbatim.
