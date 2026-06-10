---
id: 2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin
title: Dispatch — C2, cut the extension to the gate + execute the unified sign-in
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools + hauska-brief-extension
kind: dispatch
status: QUEUED — fire after C1 (Cortex cut) reaches parity; executes the unified sign-in task #29 specified
related: [58_gtm_readiness_sprint, 75a_hauska_brief_extension, _dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, 56_engine_extraction_sprint, 20_agent_operating_rules]
---

# C2 — cut the extension to the gate + unified sign-in

> The second app-by-app cut (sprint 58 C2). The brief browser extension is the third instance of the same shape: a product surface on cortex-api (the BFF). This cut brings the extension's reasoning path through the gate (via cortex-api, same as C1's findings cut) and **executes the unified sign-in that task #29 specified but did not build** — the `launchWebAuthFlow` flow that gives one Hauska identity across Cortex web and the extension. The anonymous wedge tier stays unchanged (zero-friction first value). Spans two repos: `legacy-design-tools` (the brokerage/brief path + the cortex-api `/api/auth/extension-login` endpoint, already built in task #29) and `hauska-brief-extension` (the extension client sign-in UI). Supersedes the C2 portion of the umbrella `cortex_consume` dispatch.

You are **cc-agent-C**. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Note: the extension lives in a SEPARATE repo (`hauska-brief-extension`); if your dispatch ownership is legacy-design-tools-only, do the cortex-api/brokerage half here and flag the extension-client half for the operator to assign (or take it if you own that clone). Refuse alien HEAD; report verbatim `git status` + `git log -3`.

## Read first

1. [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md) — the extension architecture, the current `X-Hauska-Install-Id` + public-key model, and the V1 requirements (history, sharing, wallet) that assume accounts
2. [`_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md`](2026-06-10_cc-agent-C_cortex_per_user_auth.md) — task #29; the extension sign-in flow it SPECIFIED (the `GET /api/auth/extension-login` endpoint + `claimInstallHistoryForUser`)
3. [`_dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md`](2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md) — the cut pattern + the gate seam this reuses
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope

1. **Cut the extension's reasoning path to the spine-through-gate.** The extension calls cortex-api `/api/brokerage/v1/*`; ensure that brokerage brief/code-retrieval path consumes the spine `engine-api` through the gate-front seam (the same cut as C1's brief engine — if C1 already cut the brief engine, confirm the brokerage path rides it; otherwise cut it here), behind a feature flag, lineage preserved.
2. **Execute the unified sign-in (the task #29 C2 item).** Build the extension client flow: `chrome.identity.launchWebAuthFlow` → `{cortex-api}/api/auth/extension-login?redirect_uri=...&install_id={X-Hauska-Install-Id}` → hosted login (same credentials as Cortex web) → redirect `#token=<signed-session>` → store token, send `Authorization: Bearer` on authenticated brokerage calls (replacing the embedded public key). The cortex-api side (`extension-login`, `brokerageAuth` accepting the session Bearer, `claimInstallHistoryForUser`) is already built in task #29 — wire the client to it and verify end-to-end.
3. **Anonymous tier unchanged.** Public-key + install-id "Run brief" instant path stays as the zero-friction wedge; "Sign in with Hauska" unlocks the V1 features (workspace history, sharing, wallet) that need the account.
4. **Sovereignty (HARD).** When an anonymous user signs in, their prior install-id brief history attaches to that user only (task #29's `claimInstallHistoryForUser`, PK on `install_id`) and never pools into a shared/public asset — verify the attach is per-user.
5. **Provenance envelope on the extension brief output;** rail-quiet grade. **QA the extension in final topology** (anonymous flow + authenticated flow, both consuming through the gate).

## Acceptance criteria

- The extension's reasoning path consumes the spine through the gate (flagged, lineage preserved).
- The unified sign-in works end-to-end: signing in on the extension mints the SAME account as Cortex web; authenticated calls use the session Bearer; the anonymous tier is unchanged.
- Anonymous-history-attaches-to-one-user verified (no pool).
- Extension brief output carries the provenance envelope; grade rail-quiet.
- Extension QA'd in final topology (both tiers). CI green. PRs held for operator merge. Verbatim artifacts (HR-8). Extension-client repo work flagged/assigned if outside this clone.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_..._cc-agent-C_C2_extension_cut_and_unified_signin.md`: the cut state, the sign-in end-to-end proof (one account both surfaces), the anonymous-history-no-pool verification, the provenance shape, the final-topology QA, PR URLs + SHAs, and the extension-client assignment note + blockers verbatim.
