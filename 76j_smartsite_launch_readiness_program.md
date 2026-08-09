---
id: 76j_smartsite_launch_readiness_program
title: Smart Site launch readiness program (paywall, distribution, capacity, branding)
status: active
last_updated: 2026-08-09
applies_to: [property-explorer, cortex-api, retrieval-api, legacy-design-tools]
related: [76h_property_explorer_gtm, 76i_smartsite_contribution_economy_roadmap, 90_operations/OPS-10_parcel_flag_spec, 90_operations/REBRAND_UI_citations_and_pdf, 14_pricing_framework, 90_operations/QUEUE_parked_work_index]
owner: nick
---

# Smart Site launch readiness program

Planned 2026-08-05 from operator direction. The trigger incident: the dev-mode paywall bypass is keyed to Nick's login, so external testers hit the unfinished paywall and can only experience free mode. The broader arc: get Smart Site from a dev deployment to a launch-ready product with a national affiliate distribution engine, gated on Texas factory data being flush before any out-of-state launch.

## Workstream A. Entitlement, paywall, and tester access

**Status: SHIPPED 2026-08-05** — merged LDT [#387](https://github.com/empressaioemail-tech/legacy-design-tools/pull/387) + hauska-map [#152](https://github.com/empressaioemail-tech/hauska-map/pull/152); cortex `00472-web` @100%; PE `property-explorer-xi.vercel.app` bundle `index-DnMQ6bEw.js` (`dpl_8iaoNSPk8C7ifrFZaVUF71PB9HY6`). WDLL: `_inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL.md`. **Residual:** operator live promo-code E2E (Stripe test/live mode) + dev_role grant smoke on a designated tester account.

The paywall is ready to be finished (operator statement). The plan:

1. Finish the paywall features (the existing paid-tier feature set behind Stripe checkout).
2. Replace the login-keyed dev bypass with a server-side entitlement role. The bypass must be a property of the USER RECORD (a `dev` role or entitlement flag resolvable for any account the operator designates), not a hardcoded login check. This is the same lesson as the Radar entitlement ruling (user-aware, never install-keyed or identity-hardcoded). Dev mode stays, but as a grantable role.
3. External testers get Stripe promo codes (100 percent off) through the REAL paywall flow. This is deliberately better than extending the bypass: testers exercise the production checkout, entitlement resolution, and paid-tier serving paths, which is exactly what needs testing before launch. Promo codes are already issuable through Stripe (operator confirmed).
4. Entitlement states after this work: `free`, `paid` (Stripe subscription), `promo` (Stripe 100-percent-off code, behaves as paid), `dev` (server-side role, internal only).

Acceptance: an invited outside tester with a promo code experiences the full paid product with zero code changes per tester; the operator can grant/revoke dev role without deploys.

## Workstream B. Domain, branding, deployment surface

1. **DONE 2026-08-09: operator purchased `smartsite.cloud` on GoDaddy.** Next: attach as Vercel custom domain to the `property-explorer` project and set the GoDaddy DNS records Vercel specifies at attach time (planner produces the exact records when this runs). Workstream unblocked.
2. Favicon to the Smart Site crosshairs logo. This joins the already-deferred rebrand set (title, favicon, landing, copy) recorded at the 2026-08-03 rebrand deploy.
3. Smart Site branding on the PDF generation template. The rebrand band already has the citations-and-PDF surface mapped (`90_operations/REBRAND_UI_citations_and_pdf.md`); this adds the Smart Site mark to the export/brief PDF templates in legacy-design-tools.
4. Vercel itself is NOT the launch risk and does not need replacing for launch: static frontend plus serverless functions scale with traffic. The custom domain rides on it fine. Revisit hosting only if function limits or costs bite post-launch.

## Workstream C. Capacity and production-readiness audit (the honest answer to "how many users")

The stack was not deliberately built "lite," but it has never been audited or load-tested for public scale. What it actually is: Vercel frontend (scales), Cloud Run backends (cortex-api, retrieval-api, engine-api; autoscaling but unaudited concurrency/min-instance settings), Neon Postgres (autoscaling tiers, but connection-limit and pooling behavior under concurrent serverless load is the classic failure point). Known weak points on record TODAY, all pre-launch fixes:

1. **CLOSED 2026-08-09 (this item was stale as written).** The rate-limit store moved OFF Upstash entirely: Postgres `ResilientRateLimitStore` shipped in hauska-mcp-server PR #58 (`b5f26de`), migration `010_rate_limit_counters` applied, serving revision tagged `postgres-limiter` with `/health` showing `rate_limit_store.state=ok, detail=postgres`. Per OPS-9: "Upstash is not the launch destination." No operator provisioning owed. Residual watch: alert if `rate_limit_store.state != ok` or latency over 500ms sustained.
2. Connection pooling: serverless functions plus Cloud Run against Neon need the pooled connection string everywhere (or a pooler) or launch traffic will exhaust connections. **Status 2026-08-05 DONE** — all 6 serving DSNs now use `-pooler` host; evidence `_inbox/2026-08-05_neon_pooling_audit.md`.
3. The anonymous-tenant data model: auth flips orphan anonymous data (recorded trap). The paywall work in Workstream A must include the anonymous-to-account claim flow, and it must NOT be bundled with unrelated fixes.
4. No load test has ever been run. Deliverable: define a launch SLO (proposal: 1,000 concurrent free sessions, 100 concurrent paid sessions, p95 under 2s on parcel loads), run a load test against a staging deploy, fix what breaks, record measured ceilings.

Deliverable: a capacity audit doc with measured numbers, not assumptions. Until it exists, the honest answer to "how many users can we handle" is "unknown; probably hundreds of concurrent sessions, with the rate-limiter and connection pooling as the first things to fall over."

## Workstream D. Affiliate distribution program

Model: affiliate links distributed to owners of large social media groups, national reach, paid as revenue share through Stripe.

Recommendation (v1): use an off-the-shelf Stripe-native affiliate platform (Rewardful, PromoteKit, or FirstPromoter class) rather than building affiliate infrastructure. What that buys immediately: per-affiliate links with attribution windows, automatic conversion tracking against Stripe subscriptions, an affiliate portal where each partner logs in, sees clicks/conversions/earnings, and claims payouts (standard payout rails: PayPal/Wise, monthly, with a minimum threshold), plus pairing with per-affiliate promo codes. This answers the "affiliate login" requirement without building one. Build custom only later if platform fees (~$50-200/mo class) become material against volume.

Financial model (deliverable, 70-band bizops doc): inputs are subscription price, affiliate rev-share (industry standard 20 to 30 percent recurring, often capped at 12 months), platform fee, Stripe fees, infra cost per active user (from Workstream C measurements), and funnel assumptions per affiliate audience size. Outputs: effective CAC via rev-share, LTV to CAC, contribution margin per subscriber after affiliate cut, payout cash-flow timing, and the affiliate-count-to-revenue curve. Ties to `14_pricing_framework.md`; the model gates how aggressive the rev-share offer to group owners can be.

Launch gating rule (operator-set): Texas first. No launch outside Texas until the factory has the target states flush with data; state expansion follows factory onboarding, not marketing reach.

## Workstream A residual — Stripe E2E and billing-surface audit (operator progress 2026-08-09)

Operator reached the live Stripe sandbox checkout (Link identity step) on 2026-08-09. The unpacking of the remaining checkout work rides inside this workstream rather than as its own thread. Items observed from the session, to be worked as one billing-surface audit lane:

1. **BRANDING DEFECT (canon violation):** the Stripe product reads "Hauska Pro — Unlimited Property Briefs and full underwriting depth." Hauska is substrate-only per the branding canon (repo-intent rulings 2026-07-04); the customer product is Smart Site. Rename the Stripe product/price to Smart Site branding and align the descriptor copy before any external tester sees checkout. Entity display (Legacy Group ATX LLC) is the operating company and is correct unless the operator rules otherwise.
2. Complete the promo-code E2E through entitlement resolution (checkout → webhook → paid serving path), then the dev-role grant smoke.
3. Sweep the price/copy/product-name set in Stripe against the Smart Site rebrand set (title, favicon, landing, PDF) so billing does not lag the rebrand.

## Workstream F. MCP server revival and currency audit (added 2026-08-09, operator-flagged)

Operator observation: the MCP server is "way behind, out of date, and reading wrong information." Known state from record: 63 tools across four gates (public/codex/reporting/map) as of 2026-07-15; Postgres rate limiter live 2026-08-05. Unknown: whether the tools read the statewide fabric (196-county parcel store, NFHL table) or pre-fabric stores; the three new atom families (flood-hazard-fact, cad-parcel-roll, land-use-fact, contract 1.15.0) have NO MCP slots per the 2026-08-08 atom-families report. This matters beyond hygiene: MCP-first is structural commitment 4 and the GTM pivot names owning the MCP market as a priority; a stale MCP server is the substrate contradicting its own thesis.

First step is a recon lane, not a fix lane: live introspection of the deployed tool list, per-tool store/endpoint trace (which database, which table, which contract version), a wrong-information reproduction set from the operator's session, and a gap list against the current rail set. Then scope the revival from evidence.

## Workstream E. User data flagging (OPS-10)

The spec exists and is v1-ready: `90_operations/OPS-10_parcel_flag_spec.md` (flag-a-parcel rail, feeds the dual defect ledger as `user-flag` sourceKind, seeded by the 605/607 Mesquite St flag-lot examples). It was awaiting a build slot; with Warden v1.1 shipped, OPS-10 is the natural next product-side build. It also feeds the contribution economy arc (`76i`), where flags are the first "get paid to contribute" surface.

## Sequencing

| Order | Item | Blocks | Unblocked by |
|---|---|---|---|
| 1 | Paywall finish + promo codes + dev role (A) | external testing TODAY | nothing, ready now |
| 2 | Rate-limit store replacement + pooling pass (C1, C2) | any real traffic | nothing, ready now |
| 3 | Domain + favicon + PDF branding (B) | launch polish | domain purchase (operator) |
| 4 | Anonymous-claim flow (C3) | paywall correctness | rides with A |
| 5 | Load test + capacity doc (C4) | launch go/no-go | 1 and 2 landed |
| 6 | Affiliate platform selection + setup (D) | distribution | A live (needs real checkout) |
| 7 | Financial model (D) | rev-share offers | parallel anytime, bizops |
| 8 | OPS-10 v1 build (E) | contribution arc | build slot |
| 9 | Launch checklist assembly | launch | 1 through 6 |

Items 1, 2, 7 can start immediately and in parallel. The launch decision reads the capacity doc, not vibes.
