---
id: 2026-06-15_cotality_live_and_convergent_deploy
title: Session — Cotality solved and live + convergent cortex-api deploy shipped (leak closed, C3 live, Cotality activated)
date: 2026-06-15
kind: session
agent: claude_code
related: [00_current_state, 77b_cotality_integration_strategy, 61_property_intelligence_master_plan, _dispatches/2026-06-11_cc-agent-C_cotality_activation_api1_token_host_and_keys, _research/2026-06-06_cotality_api_surface_catalog]
---

# Session — Cotality live + convergent deploy shipped

Operational session in the `legacy-design-tools` product repo and its prod Cloud Run service, not doc strategy. Picked up from the prior 2026-06-15 sessions (capital-readiness audit + observability), which had left the convergent deploy PENDING and the live data leak OPEN. This session closed both, plus solved Cotality end to end and shipped it. Work verified against live gh, gcloud, the prod endpoints, and the prod Neon, not the doc set.

## Cotality solved end to end and shipped live

The `InvalidClientIdentifier` mystery resolved to three compounding problems, each confirmed against the live token endpoints (2026-06-15):

1. Per-product token host. Property mints at `api1.cotality.com`; RiskMeter and SpatialTile mint at `api.cotality.com`. Wrong host returns `InvalidClientIdentifier`. The 2026-06-06 catalog inference that `api1` is "just a Springdoc backend, not the gateway" was wrong for the Property token endpoint.
2. Auth shape, all three products. HTTP Basic auth header, `grant_type=client_credentials` in the query, empty body. `grant_type` in the body returns `invalid_request`; credentials in the body return `InvalidClientIdentifier`; an empty body with no Content-Length hits the Incapsula `411`. Node undici `fetch` sends `Content-Length: 0` for a body-less POST automatically. The original code used body-form creds, which is why it failed for every product at the gateway.
3. Two mistyped Secret Manager values. `COTALITY_PROPERTY_KEY` had an `i` where the real key has an `l` (`...TR2n4lDcSQ...`); `COTALITY_SPATIALTILE_SECRET` was wrong. Both corrected from the operator-provided portal text; all six `COTALITY_*` secrets in `legacy-design-tools-prod` now byte-match the portal. `expires_in` also arrives as a numeric string, so the cache TTL was coerced.

Code: PR #181 (per-product host) merged by the operator earlier in the day; PR #182 (full Basic-auth shape for all three, `expires_in` coercion, tests decode the Basic header, and the six secrets wired into `cloud-run-deploy.yml --set-secrets`) authored, typecheck plus 13 adapter tests green, merged this session. Both PRs were isolated onto a clean branch off `origin/main` without disturbing cc-agent-C's in-flight C3 working tree. Memory [[cotality-oauth-three-keys]] rewritten with the verified shape.

## The convergent cortex-api deploy shipped, canary-gated

Verified the live state first: prod was still on `cortex-api-00169-jep` (pre-#180) and unauthenticated `GET /api/engagements` returned 30 real engagement records (names, jurisdictions, addresses) to anyone. The build for the #182 merge (`b19ca089`) was already in Artifact Registry.

Ran the canonical canary sequence via the GitHub Actions deploy workflow:
- `deploy-canary` of `b19ca089` to a 0 percent canary (`cortex-api-00171-wek`, canary tag). Prod stayed on `00169`.
- Smoked the canary: unauth `GET /api/engagements` returned 0 records (isolation working) vs prod's 30; health and readiness all 200; all six Cotality secrets confirmed mounted on the revision; all five `ENGINE_SPINE_*` flags on; `hauska-engine-api /health` 200 (C3 dependency live). No `run-migrations` was needed; the fix is code-only and the canary ran clean against the existing schema (migration 0038 already applied 2026-06-10).
- `shift-traffic` to 100 percent on the canary tag. Post-shift verification on the prod default URL: unauth `GET /api/engagements` now 0 (was 30), health 200.

This one deploy shipped #178 (spine-flag bake), #179 (C3 thin BFF, the one-way door, operator-approved), #180 (auth and leak fix), and #181 plus #182 (Cotality), together. Rollback handle if needed: `gcloud run services update-traffic cortex-api --to-revisions cortex-api-00169-jep=100`.

Net: the Wave 0 security gate is closed in prod, C3 is live, and Cotality is activated, in one verified shot.

## Engagement ownership reassign (operator request)

After the deploy, the operator signed up (`empressaioemail@gmail.com`, user id `u_d96ffe5b81e6b487df53c32d`, display name Nick) and the dashboard showed 0 engagements, which is #180 working as designed: anonymous and new sessions are isolated from the `migration-owner` backfill owner. The 30 demo engagements were cleanly owned by `migration-owner` (migration 0038 had applied). On request, reassigned all 30 from `migration-owner` to the operator's user id via a transactional UPDATE against the prod Neon (would have rolled back if the count was not exactly 30; verified 30 after, `migration-owner` at 0). Reversible. Does not reopen the leak; anonymous isolation is owner-independent.

## Cotality vendor governance email (Gene Rinas)

Drafted the operator's reply to Cotality's "AI Architecture and Ecosystem Governance" questionnaire (section 3, vendor/data-leakage risk). Grounded in the live `cortex-api` config: Anthropic Claude API plus xAI Grok API, both vendor-hosted, no OpenAI/Google/in-house models. Verified the training/retention terms by web search: Anthropic commercial terms do not train on API content; xAI does not train on User Content under Enterprise terms (but consumer Grok does, and non-ZDR Enterprise may use de-identified data). Flagged the one open governance item to the operator: confirm the Grok/property-brief integration is on an xAI Enterprise account (ideally ZDR), since property and parcel data reaches Grok.

## Outstanding (carried forward)

- Cotality in-app end-to-end is NOT yet verified. The token mint, the six mounted secrets, and the Basic-auth code are all proven, but the in-app `generate-layers` flip of `cotality:property` from `no-coverage` to `ok` on a real parcel needs an authenticated session, which was not run this session. RiskMeter and SpatialTile are wired (secrets plus code) but likewise not in-app verified. First real-parcel run is the remaining proof.
- Cotality demo keys expire July 6. Operator stated a key rotation will follow development; the wiring reads `:latest` from Secret Manager, so a rotation is a secret-version add, no code change.
- xAI account tier confirmation for the Gene email (Enterprise plus ZDR vs consumer) before the operator sends it.
- The HELD dispatches behind #180 are now unblocked by the deploy: chat web-first code plus zoning grounding, the Cotality activation dispatch, and the deliverable-polish queue.
- Deploy residues remain (untouched this session): retrieval-api `db:not_configured` (hauska-engine #68), drift alert policy `8570526367601301438` to retire (mcp #27), #26 GTM collateral 46 to 57, `mcp.hauska.dev` mapping plus gate migration 004.
- Strategic items unchanged: the tier-model call (72b row 9) and the 72b long poles (sourcing posture of the 32 platform-internal jurisdictions, measured cost-per-jurisdiction, first paid metered call).
- Non-fatal `reviewer_requests` UPDATE drift on generate-layers, logged in the 2026-06-11 section, still open.
