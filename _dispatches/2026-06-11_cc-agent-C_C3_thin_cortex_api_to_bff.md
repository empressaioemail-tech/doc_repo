---
id: 2026-06-11_cc-agent-C_C3_thin_cortex_api_to_bff
title: Dispatch — C3, thin cortex-api to a product BFF (the one-way door; flip complete + prod-verified)
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY after the topography flag bake merges — the flip is complete and prod-soak-verified; this is the irreversible step, recon-first
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 61_property_intelligence_master_plan, 80_adrs/adr_008_engine_factor_out, _dispatches/2026-06-10_cc-agent-C_C3_thin_cortex_api_to_bff, 20_agent_operating_rules]
---

# C3 — thin cortex-api to a product BFF

> The final step of the lift (sprint 58 C3 / 56 step 6 / ADR-008). Supersedes the 2026-06-10 C3 dispatch (which predated the verified flip and contained a now-wrong "delete lib/adapters" instruction — see the adapter caveat below). All four reasoning engines (findings, briefing, hydrology drainage/rainfall, topography DEM) are flipped to the spine and **verified in production under real traffic** (`cortex-api-00169-jep` @ 100%; soak 2026-06-11: every `/v1/*` call 200, zero ERROR logs, five canary-caught bugs holding). The migrated engine code in cortex-api is now dead weight behind the `ENGINE_SPINE_*` flags. This cut removes it and leaves cortex-api a thin product BFF.
>
> **This is the one-way door.** Removing the local engine code means the `ENGINE_SPINE_*` flags can no longer be flipped back to a local fallback — `engine-api` becomes the only reasoning path. That is acceptable now because: the flip is prod-verified, engine-api is warm (`min-instances=1`, no cold-start gap), and the flags are durably baked into the deploy workflow. The corresponding obligation (scope item 5) is an honest engine-unreachable error, since there is no longer a silent local fallback.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` (worktree on a `cortex/` branch). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `cortex/`. Refuse alien HEAD; report verbatim `git status` + `git log -3`. HR-1/2/3/8/11.

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — the target BFF state + what stays in cortex-api
2. [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md) — the no-ungated-path principle
3. [`_research/2026-06-11_engine_robustness_audit.md`](../_research/2026-06-11_engine_robustness_audit.md) — what each engine does (so you remove the right code) + the silent-degradation theme (relevant to scope item 5)
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md)

## Scope (recon-first; this is irreversible)

1. **Recon (read-only, report BEFORE any deletion).** Confirm every reasoning consumer is spine-served and identify EXACTLY which local code is dead (reached only via the now-permanent flag-on path, i.e. the `ENGINE_SPINE_*`-off branch) versus still-live. Produce a kill-list and a keep-list with file paths. Do not delete anything until the recon is filed and the lists are explicit.

2. **Remove ONLY the dead reasoning-engine code.** The engines that lifted and are now dark behind flags: the finding engine (`lib/finding-engine` incl. orchestration + precedence), the briefing engine, and the hydrology/topography **compute** that moved to engine-api (the D8/pysheds worker invocation, the DEM-parse/contour compute — whatever the spine now performs). Remove the now-dead per-engine flag-off branches (`useSpineFindings()`/`useSpineBriefing()`/etc. false-paths) so the spine path is unconditional.

3. **ADAPTER CAVEAT (do not repeat the 2026-06-10 error).** `lib/adapters` is **still live cortex-side**: the `generate-layers` route runs the site-context adapter pack (FEMA, EPA, SSURGO, USGS, Cotality, UGRC) in cortex-api — verified in the 2026-06-11 prod layer dump. There is no spine flag for the adapter pack. **Do NOT delete `lib/adapters` or the generate-layers adapter path.** In recon, state explicitly whether the adapter pack stays cortex-side as BFF data-fetching (the current reality) or is a future separate lift (out of scope for C3). Same caution for `lib/site-context` parts that feed generate-layers / briefing-source assembly versus the hydrology/topography compute that lifted — keep the former, remove only the latter. When in doubt, keep it and flag it; a wrong deletion here is a prod outage on an irreversible cut.

4. **Lock the direct engine routes.** Remove or hard-disable any cortex-api route that could reach a reasoning engine except through the gate-front seam. Verify no ungated path remains (an explicit route audit + a test).

5. **Honest engine-unreachable error (the removed-fallback obligation).** With the local fallback gone, if a `/v1/*` call to engine-api fails or times out, cortex-api must surface a clear error to the consumer (and a clean failed-run state), never a silent empty result. This is the audit's silent-degradation guard applied to the now-single path. Add/verify it for findings, briefing, hydrology, topography.

6. **Keep cortex-api a thin BFF:** UI serving; session/auth (the task #29 per-user identity, shared with the extension); the snapshot/sheet/IFC ingest intake (Revit + extension ingress); the generate-layers adapter pack (per item 3); product glue. Preserve the wedge intake (pre-Revit chat + image vision, #165), the deliverable-letter flow, and the artifact-UX (#166).

7. **Regression-verify the whole product in BFF topology:** plan review (generate + read), brief, chat/wedge, letters, Site layers + drainage + topography, the extension, Revit ingress — all work; lineage + provenance intact; calibration deposit/read intact.

## Acceptance criteria

- Recon filed with explicit kill-list + keep-list BEFORE any deletion; every reasoning consumer confirmed spine-served.
- Only the dead reasoning-engine code removed; `lib/adapters` + the generate-layers path preserved; dead flag-off branches removed; cortex-api builds + runs as a BFF.
- No ungated path to a reasoning engine remains (verified by audit + test).
- Engine-unreachable surfaces an honest error / failed-run state on all four engine paths (no silent empty result).
- Full-product regression green in BFF topology (plan review, brief, wedge, letters, Site/drainage/topo, extension, Revit); lineage/provenance/calibration intact end to end.
- CI green. PRs held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_C3_thin_cortex_api_to_bff.md`: the recon (kill-list + keep-list + all-consumers-spine-served), what code was removed, the no-ungated-path audit, the engine-unreachable error behavior, the full-product BFF regression, PR URLs + SHAs, and blockers verbatim.
