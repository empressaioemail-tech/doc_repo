---
id: 76j_smartsite_launch_readiness_program
title: Smart Site launch readiness program (paywall, distribution, capacity, branding)
status: active
last_updated: 2026-08-05
applies_to: [property-explorer, cortex-api, retrieval-api, legacy-design-tools]
related: [76h_property_explorer_gtm, 76i_smartsite_contribution_economy_roadmap, 90_operations/OPS-10_parcel_flag_spec, 90_operations/REBRAND_UI_citations_and_pdf, 14_pricing_framework, 90_operations/QUEUE_parked_work_index]
owner: nick
---

# Smart Site launch readiness program

Planned 2026-08-05 from operator direction. The trigger incident: the dev-mode paywall bypass is keyed to Nick's login, so external testers hit the unfinished paywall and can only experience free mode. The broader arc: get Smart Site from a dev deployment to a launch-ready product with a national affiliate distribution engine, gated on Texas factory data being flush before any out-of-state launch.

## Workstream A. Entitlement, paywall, and tester access

The paywall is ready to be finished (operator statement). The plan:

1. Finish the paywall features (the existing paid-tier feature set behind Stripe checkout).
2. Replace the login-keyed dev bypass with a server-side entitlement role. The bypass must be a property of the USER RECORD (a `dev` role or entitlement flag resolvable for any account the operator designates), not a hardcoded login check. This is the same lesson as the Radar entitlement ruling (user-aware, never install-keyed or identity-hardcoded). Dev mode stays, but as a grantable role.
3. External testers get Stripe promo codes (100 percent off) through the REAL paywall flow. This is deliberately better than extending the bypass: testers exercise the production checkout, entitlement resolution, and paid-tier serving paths, which is exactly what needs testing before launch. Promo codes are already issuable through Stripe (operator confirmed).
4. Entitlement states after this work: `free`, `paid` (Stripe subscription), `promo` (Stripe 100-percent-off code, behaves as paid), `dev` (server-side role, internal only).

Acceptance: an invited outside tester with a promo code experiences the full paid product with zero code changes per tester; the operator can grant/revoke dev role without deploys.

## Workstream B. Domain, branding, deployment surface

1. Acquire the Smart Site domain (operator action: pick and register; then attach as Vercel custom domain to the property-explorer project). Until the domain exists this workstream is blocked at step 1.
2. Favicon to the Smart Site crosshairs logo. This joins the already-deferred rebrand set (title, favicon, landing, copy) recorded at the 2026-08-03 rebrand deploy.
3. Smart Site branding on the PDF generation template. The rebrand band already has the citations-and-PDF surface mapped (`90_operations/REBRAND_UI_citations_and_pdf.md`); this adds the Smart Site mark to the export/brief PDF templates in legacy-design-tools.
4. Vercel itself is NOT the launch risk and does not need replacing for launch: static frontend plus serverless functions scale with traffic. The custom domain rides on it fine. Revisit hosting only if function limits or costs bite post-launch.

## Workstream C. Capacity and production-readiness audit (the honest answer to "how many users")

The stack was not deliberately built "lite," but it has never been audited or load-tested for public scale. What it actually is: Vercel frontend (scales), Cloud Run backends (cortex-api, retrieval-api, engine-api; autoscaling but unaudited concurrency/min-instance settings), Neon Postgres (autoscaling tiers, but connection-limit and pooling behavior under concurrent serverless load is the classic failure point). Known weak points on record TODAY, all pre-launch fixes:

1. The MCP/API rate-limit store (Upstash) is DEAD with an in-memory fallback active. In-memory rate limiting across autoscaled instances is not rate limiting. Replacement is launch-blocking.
2. Connection pooling: serverless functions plus Cloud Run against Neon need the pooled connection string everywhere (or a pooler) or launch traffic will exhaust connections.
3. The anonymous-tenant data model: auth flips orphan anonymous data (recorded trap). The paywall work in Workstream A must include the anonymous-to-account claim flow, and it must NOT be bundled with unrelated fixes.
4. No load test has ever been run. Deliverable: define a launch SLO (proposal: 1,000 concurrent free sessions, 100 concurrent paid sessions, p95 under 2s on parcel loads), run a load test against a staging deploy, fix what breaks, record measured ceilings.

Deliverable: a capacity audit doc with measured numbers, not assumptions. Until it exists, the honest answer to "how many users can we handle" is "unknown; probably hundreds of concurrent sessions, with the rate-limiter and connection pooling as the first things to fall over."

## Workstream D. Affiliate distribution program

Model: affiliate links distributed to owners of large social media groups, national reach, paid as revenue share through Stripe.

Recommendation (v1): use an off-the-shelf Stripe-native affiliate platform (Rewardful, PromoteKit, or FirstPromoter class) rather than building affiliate infrastructure. What that buys immediately: per-affiliate links with attribution windows, automatic conversion tracking against Stripe subscriptions, an affiliate portal where each partner logs in, sees clicks/conversions/earnings, and claims payouts (standard payout rails: PayPal/Wise, monthly, with a minimum threshold), plus pairing with per-affiliate promo codes. This answers the "affiliate login" requirement without building one. Build custom only later if platform fees (~$50-200/mo class) become material against volume.

Financial model (deliverable, 70-band bizops doc): inputs are subscription price, affiliate rev-share (industry standard 20 to 30 percent recurring, often capped at 12 months), platform fee, Stripe fees, infra cost per active user (from Workstream C measurements), and funnel assumptions per affiliate audience size. Outputs: effective CAC via rev-share, LTV to CAC, contribution margin per subscriber after affiliate cut, payout cash-flow timing, and the affiliate-count-to-revenue curve. Ties to `14_pricing_framework.md`; the model gates how aggressive the rev-share offer to group owners can be.

Launch gating rule (operator-set): Texas first. No launch outside Texas until the factory has the target states flush with data; state expansion follows factory onboarding, not marketing reach.

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
