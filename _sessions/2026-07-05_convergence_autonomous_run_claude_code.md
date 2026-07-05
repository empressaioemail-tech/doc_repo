---
id: sessions/2026-07-05_convergence_autonomous_run
title: Convergence program autonomous run — deploy chain, ICC live, T1 staged, Phase 3/4 landed
status: active
date: 2026-07-05
related: [_inbox/2026-07-04_convergence-program_STATUS.md, _sessions/2026-07-05_convergence_execution_claude_code.md, _decisions/2026-07-04_convergence_program_execution_model.md]
---

# Convergence autonomous run (second 2026-07-05 session)

Fresh planning agent picked up the prior session's handoff and ran the convergence queue hands-off. Execution model held as specified: cursor-agent wrote every code change (seven dispatches); the planner did migrations, deploys, secret operations, live verification, adversarial review, and merges. Verification was never delegated. The operator intervened zero times after the kickoff message.

## Deployed to production (each canaried, probed, verified live, rollback handle named)

MCP four-gate rework: migrations 004 and 005 applied to prod Neon after a read-only request_log audit confirmed zero map-tool callers in 30 days; the single cortex key remapped to reporting; gate matrix probed live (anon resolves public, malformed key 401, reporting key denied map tools at call time, map key reaches all six, catalog 63 tools); serving 100% on hauska-mcp-server-00010-zuq (rollback 00008-mcr). The canary probes surfaced a latent prod outage: the Upstash rate-limit Redis no longer exists (DNS NXDOMAIN), so every keyed request 503ed. Fix built by Cursor (ResilientRateLimitStore circuit breaker, PR #36), planner-verified 326/326, merged, deployed. Upstash replacement routed to pickup.

cortex-api redeployed via the canonical canary workflow to main 9e69d6e (#225 fail-loud), serving cortex-api-00288-lab (rollback 00286-xic). engine-api redeployed at main 301f145 with the atom-contract 1.6.1 bump (PR #82; hold conditions cleared by an independent typecheck plus an adversarial wire-compat check that proved BriefRunAtomInstance never crosses a production wire), serving hauska-engine-api-00031-rap with envelope-canary, docingest, and persist tags repointed (rollback 00029-buy); ICC secrets v2 picked up by the new revision. retrieval-api redeployed with the #80 fail-closed accessPolicy fix, serving hauska-retrieval-api-00008-ber (corpus 21,126 atoms, search smoked; rollback 00007-fsk).

## ICC backend cleared end to end

Web research located the real Code Connect OAuth endpoint in ICC's own OpenAPI spec: POST https://api.iccsafe.org/auth/token, client credentials in the form body, scope content-read (the adapter's assumed /oauth2/token never existed). Token and entitlements verified live with the stored demo creds: IBC2018P6 and IPMC2018P2 through 2026-12-31. Cursor reworked the adapter to the real contract against captured live samples; the planner's live end-to-end run on the full 20.6 MB IBC book caught crash bugs the fixtures could not (live nodes omit content, children, title, ordinal), a second Cursor pass hardened the extractor with a regression test, and the final live run produced 4,966 code-section atoms with ICC deep links and reasoning-layer bodyText, derivative boundary held. Merged as hauska-engine PR #83 (ccf3d6a). Remaining: the corpus ingest and snapshot re-mint (deliberate data deploy, next cycle), then the extension PR #5 merge.

## Phase 3 landed

Command center wired and rebranded: cmdcenter-blush.vercel.app titles Empressa Command Center; a Vercel serverless same-origin proxy (api/spine.ts) holds all service keys server-side (browser never sees them), with a GET-only allowlist, POST only to the MCP JSON-RPC path, and /admin/* blocked outright; verified live through the proxy (cortex healthz, tile-registry, MCP tools/list 63 tools). Three planner fixes were needed on top of the Cursor build (Vercel catch-all functions only matched one path segment on the alias, so routing became query-based via rewrite; SPA rewrite excludes /api; env values trimmed because stdin-piped vercel env add appends a newline). A dedicated reporting-product platform-internal MCP key was minted for the proxy (key c1fcfe13); all probe keys minted during verification were revoked. hauska-map PRs #5 and #6 merged.

Console unification executed per the ratified 2026-07-04 decision: the root vanilla-JS spine console retired; its capabilities ported into command-center as five new React panels (McpInspector, ParcelTrace, AgentView, LayerRegistryView, Settings) with honest degraded states where the proxy blocks admin paths. Net minus 2,186 lines. Redeployed to Vercel from main and smoked.

## Phase 2 tenancy T1: built and staged (no prod flip, per the operator ruling)

Producer side staged as hauska-mcp-server PR #37 (HELD for the coordinated landing): src/gate-context.ts signs a tenant context (HMAC-SHA256 over a base64url payload, 300s expiry, constant-time verification) stamped on every legacy-client and engine-api-client call alongside the existing plain headers; unset signing key means one startup warning and today's behavior. 349/349 tests planner-verified. GATE_CONTEXT_SIGNING_KEY v1 staged in Secret Manager (hauska-prod-497015), not yet mounted anywhere. Consumer-side verification builds (engine-api and cortex-api, log-only default) dispatched to Cursor; status at close recorded in the tracker.

## Phase 4 landed

Stripe test-mode pricing created per ratified Decision B: Hauska Layer 2 Builder ($49/mo) and Pro Stream ($199/mo) products, a layer2_call billing meter, and metered overage prices ($0.04 and $0.02 per call), all in test mode under the existing sk_test key. Idempotent creation script kept in the session scratchpad.

Three Phase 4 documents drafted by agents, planner-reviewed, and filed to _inbox for operator framing review (the program named these artifacts without defining them, and each draft says so explicitly): 2026-07-05_draft_proof_of_record_spec.md (recommended slot 62), 2026-07-05_draft_certification_scaffold.md (recommended slot 63; incorporates the eval-scores vacuous-pass incident as grounds for a non-vacuousness floor), 2026-07-05_draft_siting_spike_memo.md (scope self-proposed from the 77 place-graph data-center signal; flagged for correction if siting meant something else).

## Honesty items

The prior session's in-flight eval-scores artifact was reviewed and is NOT publishable: 32 of 34 jurisdictions pass top-3 vacuously (queriesEvaluated 0 presented as a perfect score). Branch preserved (eval/per-jurisdiction-scores); needs per-jurisdiction curated queries before any external use.

## Operator-owed (unchanged plus new)

Extension key rotation; Cotality production keys (2026-07-06); Upstash replacement decision (env still points at the dead instance; the resilient fallback makes this non-urgent); NPM_TOKEN secrets for SDK and atom-contract CI publishing; atom-spec PR #4 framing review; component-library rename #226 coordinated landing; Phase 4 draft reviews; tenancy T1 coordinated flip approval (enforce mode plus plain-header removal) when the consumer legs verify.
