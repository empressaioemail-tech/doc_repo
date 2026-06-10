---
id: 2026-06-10_cc-agent-C_codewarm_harness_fix
title: Dispatch — cold-warm harness fix (parser + national drivers + slugs) to unblock B1
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — blocks the B1 re-fire; pairs with operator applying migration 0036 to deployment Neon
related: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, _catalog/codes, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs, 20_agent_operating_rules]
---

# Cold-warm harness fix — unblock the Texas first pass (and make the harness the national template)

> The B1 run ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md)) completed the verification gate (121/155 sample resolved, 78%) but **persisted zero atoms** — blocked by a P0 schema drift (operator action, below) plus real harness gaps it had to work around with ephemeral, un-merged tooling. This dispatch lands those fixes in the harness so the re-fire is clean, reproducible, and mergeable — which is also exactly what makes the harness the reusable template for the post-ICC national expansion (the operator's Texas-as-template goal). Front B, blocks the B1 re-fire.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `codewarm/` (the B1 run noted the working branch was `tenant/...`; use a clean `codewarm/` branch off main).

## Operator action that pairs with this (P0 — not in this dispatch's scope, but gates the re-fire)

Apply migration **0036** (`lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql`) to the DEPLOYMENT Neon (`DEPLOYMENT_DATABASE_URL` / the Cloud Run reasoning-atoms instance). The live `reasoning_atoms` table is missing `asserted_confidence` / `source_set_version` / `calibration_stale` — 0036 is merged in-repo but unapplied to that Neon, so every warm UPSERT errored. Verify 0037 (the calibration overlay) is also applied while there. Without this, even a fixed harness persists nothing.

## Read first

1. [`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md) — the break-point report; the Blockers section is the spec source
2. The harness: `lib/codewarm/src/manifest.ts` (`parseCodewarmManifest`), `lib/codes/src/webCodeFetch/drivers.ts` (URL builders)
3. The six manifests in [`_catalog/codes/`](../_catalog/codes/) — note the `groups:` + quoted `section:` shapes
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope (harness fixes — sequence)

1. **Parser: quoted section keys.** `parseCodewarmManifest()` returns **0 entries** for manifests using quoted keys (`section: "302.1"`) and/or the `groups:` shape — that is **4 of 6 manifests** (IBC, IMC, IFC, accessibility) silently yielding nothing. Fix the inline-row parser to handle quoted section keys and the `groups:` structure (the accessibility manifest uses A117.1-2017 / ADA-2010 editions under `groups:`). Add a parser test per manifest shape asserting the entry count is non-zero and matches the manifest.
2. **Drivers: generalize beyond Florida.** `lib/codes/src/webCodeFetch/drivers.ts` hardcodes Miami/FBC-2023 URL builders (`FLBC2023P1` / Florida UpCodes) for all ICC refs. Add Texas-adopted + national 2021 builders (Texas UpCodes `texas/{code}-2021/...` + ICC Digital Codes 2021 fallback) so national/Texas 2021 manifests resolve through the STOCK harness, not an ephemeral overlay. Keep Florida intact. Structure the builder so adding a new state/edition is a config addition, not a code fork (this is the template generalization).
3. **Confirm the unresolved slugs.** Two slug gaps blocked families entirely in B1: IECC Texas (`texas/iecc-2021` did not resolve — likely needs the SECO/Texas energy-code mapping) and A117.1-2017 (`a117-1-2017` unverified live). Confirm the correct authoritative URL/slug for each against the live source; wire them into the driver. If a slug genuinely has no UpCodes/ICC path, mark that family `unverified-web-source` deeplink-only and report it (do not fabricate a URL).
4. **Apply the manifest correction.** IRC **R310.4** title → **"Area Wells"** (the 2021 IRC authoritative title; B1 verified the manifest text was wrong). Sweep the other title fuzzy-mismatches B1 flagged (74 in sample) — correct the clear ones, flag the ambiguous, do not mass-rewrite on low confidence.
5. **Document the TLS gotcha.** B1 needed `NODE_OPTIONS=--use-system-ca` on the Windows workstation (Node TLS leaf-verification failure against UpCodes without it — the planning host has a TLS-intercepting proxy). Add a one-line note to the harness README / the Windows runbook so the re-fire and future runs do not rediscover it.

Out of scope: the warm RUN itself (that is the B1 re-fire, a separate fire after 0036 + this lands); migration 0036 application (operator); any corpus or schema change; arrow-two calibration.

## Acceptance criteria

- Parser handles quoted section keys + `groups:`; a per-manifest test asserts all six manifests parse to non-zero entry counts matching the manifest (the 4/6-zero regression is closed).
- Drivers resolve Texas/national 2021 refs through the stock harness (no ephemeral overlay); Florida path intact; adding a state/edition is config, not a fork.
- IECC + A117.1 slugs confirmed and wired, or explicitly marked deeplink-only with the reason.
- R310.4 title corrected; clear title mismatches swept, ambiguous ones flagged.
- TLS gotcha documented.
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_codewarm_harness_fix.md`: the parser-test output (six non-zero counts), the driver coverage (which slugs resolved), the manifest corrections applied vs flagged, PR URL + SHA, and blockers verbatim. Note the B1 re-fire is the next step once this merges and 0036 is applied.
