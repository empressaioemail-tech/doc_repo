---
id: 2026-06-09_cc-agent-C_codewarm_runs
title: Dispatch — cold-warm runs over the national manifests + domain-assumption verification
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY (2026-06-10 — harness #157/migration 0036 merged; Front B step B1 of sprint 58; TEXAS-FIRST read order)
related: [57_national_code_warming_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _dispatches/2026-06-09_cc-agent-C_codewarm_harness, _catalog/codes, 20_agent_operating_rules]
---

# Cold-warm runs over the national manifests

> **FIRE-READY (2026-06-10).** The cold-warm harness (#157 / migration 0036) is merged, so this is unblocked. Runs the harness across the six reference manifests with a mandatory domain-assumption verification gate so the manifest section numbers are checked before grounding, not after. Phase 2 of [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md); Front B step B1 of the GTM-readiness sprint ([`58`](../58_gtm_readiness_sprint.md)).
>
> **TEXAS-FIRST read order (2026-06-10 operator scoping).** Texas is the launch geography, the test-run, and the template the post-ICC geography expansion reuses. Warm the Texas-adopted editions and the sections Texas amendments touch FIRST within each manifest; the rest of the national first pass follows but is not launch-gating. The corpus is already ~34 mostly-Texas jurisdictions, so much of Texas is overlay-not-reground — honor the corpus-aware precedence (warm gaps, overlay where corpus covers) and report the Texas have-vs-warmed split so step B2 (the Texas gap analysis) starts from real counts. Do not chase non-Texas geographies on this run beyond completing the manifest base.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## Model (HR-12)

Grok Build 0.1 default; escalate to Claude only on failure after retry, log it.

## Inputs

The six manifests in [`_catalog/codes/`](../_catalog/codes/): `manifest_irc_2021.yaml`, `manifest_ibc_iebc_2021.yaml`, `manifest_iecc_2021.yaml`, `manifest_imc_ipc_ifgc_2021.yaml`, `manifest_ifc_ipmc_2021.yaml`, `manifest_accessibility_nfpa_2021.yaml`. About 640 references, 2021 base. They were authored from model knowledge (no live fetches); section number plus title are the load-bearing fields and MUST be verified.

## Scope

1. **Domain-assumption verification (recon gate, do this first, report before mass warming).** Using the harness dry-run mode, for every reference flagged `verify: true` and a sampled fraction (at least 20 percent) of the rest per manifest, confirm the section number and title resolve against the authoritative source for the stated 2021 edition. Report: which `verify: true` items resolved, which failed, and any section that does not exist in the 2021 edition (wrong number, renumbered, or hallucinated). Correct or drop failed references before warming them. The harness edition/section check is the backstop, not a substitute for this report.

2. **Honor grounding flags.** `verify-existing-corpus` (federal accessibility): diff against the existing corpus first; warm only what is absent, overlay the rest. `NFPA-license-required` (NEC, NFPA 101): persist as deeplink-only reference atoms to nfpa.org, never grounded text. `web-groundable` and unflagged: warm normally.

3. **Warm per manifest.** Run the harness per family. Respect the corpus-aware precedence (warm gaps, overlay-not-reground where corpus covers). Record cost per family via the harness cost-record and stay inside the budget cap; flag yellow to the operator if a family exceeds it.

4. **Eval per family.** Sample warmed atoms per family and assert: edition correct, at least one source deeplink present, snippet capped, verification state set, no verbatim body, no finding. Include a wrong-edition refusal spot-check (force a 2021-vs-2018 mismatch on a sample, assert `unverified-web-source`).

Out of scope: building the harness (separate dispatch, must merge first); arrow-two Phase 3 calibration (separate dispatch); any corpus or public-catalog change.

## Acceptance criteria

- Verification report filed before mass warming: `verify: true` resolutions, failures, and any non-existent 2021 sections, with corrections or drops applied.
- Grounding flags honored (federal accessibility diffed, NFPA deeplink-only).
- All six manifests warmed; corpus-covered references overlaid not re-grounded; per-family cost recorded and inside budget (or flagged yellow).
- Per-family eval passes; wrong-edition spot-check refuses.
- No verbatim text persisted (boundary test from the harness still green).
- Run is data-only on the reasoning layer; no schema change, no corpus change. No PR unless a manifest correction needs committing, in which case hold for operator merge.

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md`: the verification report (resolutions / failures / non-existent sections), per-family warm counts and corpus-covered-vs-warmed split, per-family cost, eval results, the wrong-edition spot-check output, and blockers verbatim.
