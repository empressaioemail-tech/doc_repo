---
id: 2026-06-06_cc-agent-S_hauska_sdk_completion
title: Dispatch — Hauska SDK completion (Circle rail, revenue routing, MCP metering, tests, polish)
date: 2026-06-06
agent: cc-agent-S (PROPOSED — operator-assigned; hauska-sdk has no standing fleet owner)
repo: hauska-sdk
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 53_hauska_sdk_completion_sprint, 52_mcp_offer_and_buildout, 14_pricing_framework, 29_mcp_surface_tier_model, _decisions/2026-05-21_fiat_rail_circle, _decisions/2026-06-06_v1_tier_pricing_decision_b]
---

# Hauska SDK completion — SDK owner

> **Seat note for the operator.** `hauska-sdk` is not owned by any current fleet seat (the standing seats are C, C2, E, R, M, AC, none of which owns this repo). `cc-agent-S` is a proposed slug for a dedicated single-owner seat on `P:\Hauska SDK`; confirm or reassign before dispatching. Do not let an unassigned seat default silently into another agent's clone.

You are the single owner of `hauska-sdk` for this run. This dispatch finishes the SDK so a Layer 2 paid MCP call actually transacts. It is the commerce backbone; the full plan with rationale and the first-paid-revenue dependency chain is [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md). This dispatch is the execution order for that sprint's five items.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary. This dispatch touches payment and signing code; escalation is appropriate where money-path correctness is at stake.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers, the build-out lane
- `sdk-sprint:53` → [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md) — your sprint plan and acceptance criteria
- `decision:2026-06-06_v1_tier_pricing_decision_b` — the tier and quota numbers metering enforces
- `decision:2026-05-21_fiat_rail_circle` — Circle is the fiat rail; settled, do not relitigate

## Read first (after atoms)

1. [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md) — the five-item punch list, acceptance criteria, dependencies; this is your contract
2. [`14_pricing_framework.md`](../14_pricing_framework.md) — substrate-state section (what exists in the SDK today), take-rate philosophy
3. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — how the MCP gate consumes the SDK at the tool-call layer
4. [`_research/2026-06-06_cross_repo_recon.md`](../_research/2026-06-06_cross_repo_recon.md) § hauska-sdk — verified code state
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\Hauska SDK`
- Branch prefix: `sdk/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Context (verified 2026-06-06)

12 packages at v0.1.0, dormant since 2026-04-05. The crypto rail is real: `packages/payment` does on-chain USDC verification via ethers across Base, Ethereum, and Polygon (x402 pull model). The fiat rail is a stub: `generateFiatCheckoutUrl()` at `packages/payment/src/payment-request.ts:253` returns a hardcoded `checkout.circle.com` URL with a TODO; config allows only `provider: "circle"`; there is zero Stripe code. No revenue, payout, or split code exists in any `@hauska-sdk/*` package; collection is a single facilitator wallet. The repo is internally branded "CNS Protocol SDK". `publish.yml` exists but publish state is unverified.

## Scope

Execute the five items from [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md) in dependency order. Items 1 and 2 are parallel-safe; item 3 hard-depends on item 1; item 4 covers items 1 through 3; item 5 is independent.

**Item 1 — Circle fiat rail.** Replace the stub with real checkout-session creation, webhook handling with signature verification, and server-side payment verification by Circle payment id. Build and test against Circle sandbox; production cutover gates on the Hauska Inc. Circle account ([`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md)). Fail closed when credentials are absent; no code path returns a fake URL.

**Item 2 — Revenue routing and source-actor split.** Build the layer that splits a settled micropayment into the facilitator cut (take rate injected as a parameter within the 1.5 to 2.5 percent band, never hardcoded) and the source-actor share, writing a routing ledger row per split. Idempotent on payment id. Where the source-actor reference is missing, hold in a pending-routing state rather than collecting silently. Build against a provisional source-actor reference shape; the atom-contract source-actor and licensing-metadata fields are unbuilt, flag that seam in your report.

**Item 3 — Wire the SDK into the MCP gate.** Provide the consuming-side contract so `hauska-mcp-server` can decrement a key's monthly Layer 2 bundle, hard-cap Free at 100 calls/mo, and bill Builder/Pro overage through item 1 at the Decision B rates. Layer 1 and anonymous calls are never metered. Fail-safe: a metering error neither grants free Layer 2 nor hard-fails a Layer 1 call. Coordinate the contract with cc-agent-M (who owns the gate side in `hauska-mcp-server`).

**Item 4 — Test pass over the money paths.** Re-green the April crypto suite on current deps. Add coverage for Circle checkout, webhook verification, payment verification, the revenue split (idempotency and missing-source-actor cases), and the metering decrement and overage (Free hard cap, fail-safe). One sandbox end-to-end from a simulated Layer 2 call through metering, overage, sandbox checkout, webhook, and split to a ledger row.

**Item 5 — Branding and publish polish.** Remove user-facing "CNS Protocol" strings (READMEs, package metadata, EIP-712 domain). Treat the EIP-712 domain change as a signing-surface change: verify against the on-chain verification path before shipping, since altering the domain changes signature validity. Confirm npm publish state for the 12 packages and exercise `publish.yml` once. Reconcile VDA to "Verified Digital Asset" (the code meaning) in the docs.

### Out of scope

- Marketplace dynamics, agent-to-agent transactions, dynamic pricing (future per `14_pricing_framework.md`).
- Hauska Inc. regulatory posture (money-transmitter registration, KYC/AML) — routes to Nick per `72_hauska_inc_operations.md`, not SDK code.
- The atom-contract source-actor and licensing-metadata fields — owned by the atom-contract repo; named as item 2's dependency, not worked here.
- Adversarial-agent mitigations (signed builds plus attestation) — gated to first paid revenue.

## Acceptance criteria

- Per the item-by-item acceptance criteria in [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md); each item's criteria must be met and shown.
- Items 1, 2, 3 code-complete; item 4 green (paste the suite output verbatim, HR-8); item 5 reconciled.
- The take rate is an injected parameter end to end (settable at first paid call without a code change), not a constant.
- The metering contract is documented and shared with cc-agent-M.
- Production cutover items (Circle production account) are listed as operator dependencies, not blockers on the sandbox-tested build.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-06_hauska-sdk_<your-agent-id>_hauska_sdk_completion.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1) and any escalations on money-path code
- PR URL + branch SHA
- The MCP metering contract for cc-agent-M
- The atom-contract source-actor field seam (what shape you assumed)
- Circle production-account dependency status
- Blockers verbatim
