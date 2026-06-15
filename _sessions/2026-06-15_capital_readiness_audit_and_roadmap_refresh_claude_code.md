---
id: 2026-06-15_capital_readiness_audit_and_roadmap_refresh
title: Session — capital-readiness audit filed, roadmap reconciled, auth leak + Cotality + deploy residues surfaced
date: 2026-06-15
type: session
status: complete
related: [72b_capital_readiness_audit, 72a_capital_raise_positioning, 61_property_intelligence_master_plan, 00d_portfolio_roadmap_reference, 20_agent_operating_rules, 90_runbooks/cc_agent_local_test_db, 53a_noncustodial_settlement_rail, 00_current_state]
---

# Session: capital-readiness audit + roadmap refresh (2026-06-15)

## What happened

A capital-readiness pass that started from a portfolio audit, ran through a live security finding, and ended with a tracked pre-diligence checklist, a reconciled cross-cutting roadmap, and a refresh of stale merge and deploy statuses against live infrastructure. The through-line of the session was that the doc set repeatedly claimed work was done while the wire disagreed, and the fix was to verify against gh, gcloud, and live endpoints every time.

### The auth data-leak (the load-bearing finding)

A live acceptance test found that unauthenticated `GET /api/engagements` on prod returns 58 real engagements (San Marcos, Miami Beach, Moab, client Revit paths). The doc set had recorded per-user auth (task #29) as BUILT and the isolation gap as closed. Both were false against the wire. Root cause: PR #167 backfilled all engagements to one `migration-owner`, and the lockout fix PR #168 mapped the anonymous session to that same owner, so any anonymous caller owns everything; the snapshot, sheet, and submission child routes never received ownership predicates. PR #180 closed it (anonymous resolves to a per-session ephemeral owner, migration 0039 reassigns the backfill, child-route predicates added). It first came back CI-red labeled "expected green" (a bug in its own demo test plus about 30 broken route tests plus an anonymous-passes-auth-gate regression); a fixup round took it to green, and it merged 2026-06-15. It is NOT yet deployed; prod is still `cortex-api-00169-jep` and the exposure is live. The data is the company's own dogfood, so the posture is deploy on the next cycle, but it is a hard precondition for any external demo.

### Process guard against CI-blind reporting

The reporting pattern that hid the leak (an agent with no local `DATABASE_URL` reporting "expected green in CI") was closed at the source. HR-13 was added to [`20_agent_operating_rules.md`](../20_agent_operating_rules.md): integration-tested code requires a pasted local run, and "expected green in CI" is not a verification artifact. The companion runbook [`90_runbooks/cc_agent_local_test_db.md`](../90_runbooks/cc_agent_local_test_db.md) gives cc-agents a disposable local pgvector test database at the CI-identical URL, with the hard guardrail that it must never be a Neon or deployment host.

### Cotality solved end to end

The InvalidClientIdentifier mystery resolved to three compounding problems: per-product token host (Property at api1, RiskMeter and SpatialTile at api), HTTP Basic auth with grant_type in the query and an empty body, and two mistyped secrets. PR #181 (api1 host) merged; PR #182 (full Basic-auth shape plus the six secrets wired into the deploy workflow) is open and green; all three products verified minting HTTP 200 live. Remaining is merge #182 then deploy.

### The convergent deploy

The next cortex-api deploy now ships #178 (flag bake), #179 (C3 thin BFF, the one-way door), #180 (auth), and #181 plus #182 (Cotality) together, because they all sit on main. The agreed path is Option A: deploy main to a 0 percent canary, verify on the canary URL (unauth denies, four engines work through the thinned BFF, anonymous demo reads only its own engagement, Cotality Property token plus parcel call flips cotality:property to ok), then shift. This closes the leak, activates C3, and lights up Cotality in one verified shot.

### Live-status reconciliation (stale residues found)

Against live gh and gcloud: hauska-engine #68 merged 2026-06-10 but undeployed (retrieval `/healthz/` still `db:not_configured`); mcp #26 and #27 merged 2026-06-10 (not open PRs); the drift alert policy `8570526367601301438` is still enabled (it was to be retired); the #26 GTM collateral shipped a stale "46-tool surface" line (live gate registers 57); `mcp.hauska.dev` mapping and gate migration 004 still pending.

### Capital-readiness audit filed

[`72b_capital_readiness_audit.md`](../72b_capital_readiness_audit.md) promotes the 72a gaps section into a ten-row owner-tagged checklist. Five capital items that were owed but untracked are now rows: investor-collateral resync, measured cost-per-jurisdiction across more than one city, the public-vs-internal corpus split as an external-framing gate, regulatory posture (data-room line only, never a critical-path gate), and the first paid metered call as the agentic-infrastructure traction proof. Premortem cleared green; claims traced to live checks and the recons.

## The reconciled roadmap

Engine work lives in [`61`](../61_property_intelligence_master_plan.md) (seam-first Waves 0 to 4), product surfaces in [`00d`](../00d_portfolio_roadmap_reference.md), and the capital axis in [`72b`](../72b_capital_readiness_audit.md). This is the cross-cutting view, reconciled so nothing contradicts.

| Stage | Item | Owner | Gate / depends on | Status |
|---|---|---|---|---|
| Deploy | Convergent cortex-api deploy (canary, Option A): #178 bake + #179 C3 + #180 auth + #181/#182 Cotality | Nick + cc-agent | CI green (done); optional #182 merge to bundle | Merged, DEPLOY PENDING; prod 00169-jep, leak live (58 unauth, verified) |
| Deploy | Post-deploy verification (unauth denies, 4 engines, anon reads own, cotality:property ok) | planner | traffic shift | Queued |
| Deploy | Branch prune to one source of truth | Nick | post-deploy | Queued |
| Parallel | Narrative consolidation (lock 4 commitments + tier model, retire variants, fold 53a) | planner | tier-model call | Ready (72b row 9) |
| Parallel | Repo cleanup (archive hauska-platform, move empressa-trading out of org) | Nick | — | Ready |
| Parallel | Observability DB deploy: hauska-engine #68 (merged 06-10) | E + Nick | deploy | Undeployed; /healthz/ still not_configured |
| Parallel | cc-agent local test DB (HR-13) | Nick | Docker | In progress |
| Parallel | Retire drift alert policy 8570526367601301438 | M + Nick | gcloud delete | Still enabled (verified) |
| Parallel | Correct #26 GTM collateral 46 to 57 | M | — | Open |
| Parallel | Gate residue: mcp.hauska.dev mapping + migration 004 | M + Nick | next gate deploy | Pending |
| cc-agent-C queue | Chat web-first code + zoning grounding (demand-pull, Wave-3 surface, honesty-gated) | C | #180 deployed | HELD |
| Engine W1 | Seal the seam: sealed EngineEnvelope, effectiveConfidence + confidence-kind, calibration recompute, tenant-pool fix | C + E | post-deploy | Queued (gating) |
| Engine W2 | Fix: drainage latency (~100s), native-D8 math, precedence prod-wire, data vintage, coverage signals | E + C | Wave 1 contract | Queued |
| Engine W3 | Pour data: Cotality C-1..C-5 (auth now unblocked by #181/#182), USGS subsurface, missing geotech engines | C + E | Wave 1 | Cotality auth done; data-wiring queued |
| Engine W4 | Tier + commercialize: data-packages to L1/L2 at the gate, insurability (C-6), Hauska to Cotality MCP federation (C-7) | M + C | Waves 1-3 | Queued |
| Paid signal | Mox: convert live demo to signed nominal design-partner fee | Nick | demo live (done) | Active |
| Paid signal | 7k architect scoped cohort (20-50, payment/waitlist signal) | Nick + C | chat-grounding live | Queued |
| Paid signal | First paid metered call / one external MCP caller (capital traction proof) | M + Nick | gate key | Not started (72b row 6) |
| Paid signal | SLB: track whether slb_prototype converts to a funded engagement | Nick | — | Running |
| Capital | File 72b capital-readiness audit | planner | — | DONE (this session) |
| Capital | Investor-collateral resync (72a + HAUSKA_INVESTOR_BRIEF to current) | planner | — | Open (72b row 1) |
| Capital | Sourcing posture of the 32 platform-internal jurisdictions | Nick + planner | — | Not started (72b row 4) |
| Capital | Measured cost-per-jurisdiction across more than one city | Nick + E | — | Not started (72b row 5) |
| Capital | Public-vs-internal corpus split as an external-framing gate | planner | — | Open (72b row 3) |
| Capital | 53a non-custodial rail (verify-only re-architecture) | SDK/E + counsel | counsel pass | Spec'd (72b row 7) |
| Capital | Regulatory posture (IP memo + Tech E&O) | Nick | — | Parallel bizops, data-room line only (72b row 8) |
| Capital | Cross-domain 4-layer thesis to portfolio doc (peer to 09) | planner | — | Queued |
| Capital | CEV outreach | Nick | Mox signed | Gated |

Scoping note: other product surfaces (SmartCity OS and Bastrop at grade YELLOW, Codex 1b at Bastrop, the Property Brief extension and its Chrome Web Store listing, the Revit Connector) are tracked in [`00d`](../00d_portfolio_roadmap_reference.md); their absence from this engine-plus-capital view is intentional. 00d's surface statuses themselves lag (still "46 tools" and "M-Stabilize on hold") and owe a refresh.

## Decisions and open items

- Deploy via Option A (convergent canary), confirmed earlier in the session. Open operator choice: merge #182 first to bundle Cotality into the one deploy, or deploy now to close the leak and bring Cotality in a second deploy.
- Tier-model call still owed (two atom-access layers plus products, recommended), which unblocks the narrative consolidation (72b row 9).
- 00d surface-status refresh owed.
- The cross-domain four-layer thesis should graduate to a portfolio canonical doc peer to 09.

## Doc changes

- New: [`72b_capital_readiness_audit.md`](../72b_capital_readiness_audit.md); [`90_runbooks/cc_agent_local_test_db.md`](../90_runbooks/cc_agent_local_test_db.md); [`_dispatches/2026-06-14_cc-agent-C_cortex_anonymous_owner_isolation_fix.md`](../_dispatches/2026-06-14_cc-agent-C_cortex_anonymous_owner_isolation_fix.md); this session record.
- Updated: [`00_current_state.md`](../00_current_state.md) (new 2026-06-15 top section, last_updated bumped); [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) (HR-13 + v2.3); [`_dispatches/_template.md`](../_dispatches/_template.md) (HR-13 acceptance criterion); the two 2026-06-11 cc-agent-C dispatches (chat-grounding HELD behind #180; Cotality superseded by #181/#182).
