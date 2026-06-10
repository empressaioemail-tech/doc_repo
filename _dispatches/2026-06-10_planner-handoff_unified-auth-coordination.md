---
id: 2026-06-10_planner-handoff_unified-auth-coordination
title: Handoff — unified Hauska identity across Cortex web + browser extension
date: 2026-06-10
kind: planner-handoff
status: open — routed to the coordinating planning agent
related: [58_gtm_readiness_sprint, 75a_hauska_brief_extension, _dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth, _decisions/2026-06-08_cortex_7k_launch_phased_demo_first, 80_adrs/adr_005_multitenancy, 80_adrs/adr_008_engine_factor_out]
---

Filed: 2026-06-10
From: Claude Code (P:\doc_repo strategic session)
To: Coordinating planning agent (unified-auth sequencing)
Re: One Hauska identity across the Cortex web app and the browser extension

## 1. Conversation summary

The operator asked how one user can authenticate once and use both the browser extension (the Hauska Property Brief listing-page panel) and Cortex (the architect plan-review product). The dig surfaced that this is not an integration project. Both surfaces already hit the same backend, cortex-api: the extension calls `/api/brokerage/v1/*` and the Cortex web app calls `/engagements`, `/findings`, and siblings on the same service (verified in 75a_hauska_brief_extension.md architecture block). They are two product surfaces on one api-server, so unifying identity is a decision to give both surfaces the same user record, not a system to build.

Two facts make acting now cheap and waiting expensive. First, the extension's own V1 requirements already assume per-user accounts it does not have: workspace history, workspace sharing, and the paywall-wallet "owner retains read access" rule (75a V1 product requirements) are all impossible under the extension's current auth model, which is a shared public key (`BROKERAGE_EXTENSION_PUBLIC_KEY`) plus an anonymous `X-Hauska-Install-Id`. Second, task #29 (Cortex per-user auth, FIRE-READY dispatch dated 2026-06-10) is building exactly that identity layer into cortex-api right now, scoped Cortex-web-only, with no mention of the extension. If task #29 ships Cortex-only, the sprint-58 C2 step (cut the extension to the gate) discovers the contradiction and retrofits auth into a shipped extension — the worse path.

The recommended shape is not a design intent to argue for — it is an enforced property of the running system. The engine extraction is merged: adapters (hauska-engine PR #69), the reasoning engines plus engine-api endpoints `/v1/briefing|findings|hydrology|site-context` (PR #70), and the calibration overlay I/O on Topology A where the spine reaches the cortex Neon through an injected port (PR #71). Tenant isolation is enforced at the gate in live code (the isolation test passes). So the split — identity lives in cortex-api (the BFF), the gate stays tenant/jurisdiction-scoped and never sees a user — is already how the deployed system behaves, not a target topology. Lead the coordination with that; it makes the recommendation unarguable.

One naming hazard to fix before it confuses the coordination: there are two unrelated "#29"s. The merged PR #29 is gate tenant resolution (the tenant-leg, done). "Task #29" is the per-user Cortex auth roadmap item — the FIRE-READY but unbuilt dispatch this handoff is about. Do not let the coordinating planner assume auth is already merged because "#29 is done"; the auth leg is unbuilt.

The anonymous-to-authenticated ladder maps directly onto the already-decided phased 7k launch (Phase 1 anonymous demo, Phase 2 authenticated isolation): the extension's current public-key model IS a Phase-1 anonymous tier, task #29 IS the Phase-2 authenticated tier, so "sign in to save your workspace" in the extension should mint the same task #29 account as Cortex web. The extension half is a standard MV3 pattern: `chrome.identity.launchWebAuthFlow` against a cortex-api hosted login, store the returned token, send as Bearer, swap the embedded public key for authenticated calls.

## 2. Decisions reached

No decisions committed. The operator paused the auth-scope decision specifically to route it to this coordinating planner. The pre-mortem result below is provided as input, not as a commitment.

Pre-mortem (run 2026-06-10): GREEN. No load-bearing concern. The one acceptance criterion to write into whatever task #29 widening lands: when an anonymous extension user signs in, the prior anonymous install-id brief history attaches to that now-authenticated user only and never pools into a shared or public asset (tenant-sovereignty floor, ADR-005/017). Identity in the BFF, gate stays tenant-scoped, and the existing anonymous-default-tenant public-retrieval path is unchanged — those keep the sovereignty partition intact.

## 3. Open questions

1. How aggressively to widen task #29. Open because it is a scope call on a fire-ready, critical-path dispatch and the operator wants it coordinated, not unilaterally widened. Recommended routing: this planner, against the sprint-58 owner. Recommended next action: decide between (a) widen the dispatch now so its user/session model is explicitly the shared identity for both surfaces AND scope the extension `launchWebAuthFlow` sign-in as a tracked item executed in C2, versus (b) make the user model shared-capable now but leave the concrete extension flow as an unspecced C2 item. Recommendation from this session was (a) — closes the silent contradiction in the extension V1 spec before it ships, lowest cost while task #29 is still pre-build.

2. The concrete extension sign-in mechanism. Open because it is an implementation choice with UX consequences. Recommended routing: this planner to set direction, cc-agent-C to implement under task #29 / C2. Recommended next action: confirm `chrome.identity.launchWebAuthFlow` against a cortex-api hosted login (no new identity provider) as the mechanism; flag if the repo's existing auth pattern (task #29 recon will surface it) implies a different flow.

3. Sequencing the widening against the cc-agent-C serialization point. Open because cc-agent-C is sprint 58's one operational yellow (single clone, strict serial across B-driver, B-rewarm, task #29, C1-C3). The de-risker: the auth widening is cut-independent. Engine-lift is done, but the cortex-api-to-BFF cut (C1-C3) is a separate, not-yet-done thing — today the extension still calls cortex-api directly, and C2 is what repoints its reasoning calls to the gate. Identity does not move in that cut: it stays in cortex-api across C1-C3. So task #29 can proceed and land without waiting on, or being disturbed by, the consumer cutover. Recommended routing: this planner. Recommended next action: confirm the widening rides inside the existing task #29 dispatch (sequenced in the A2 wait) and the extension `launchWebAuthFlow` flow rides inside C2 — but treat the identity work as independent of the cut, not gated on it, so no false dependency is sequenced around and no second concurrent build front opens on the one clone. Post-cut the model is clean: both surfaces authenticate to cortex-api (one session credential), both consume reasoning through the gate (product key + tenant, never the user).

## 4. Artifacts produced

- This handoff: `_dispatches/2026-06-10_planner-handoff_unified-auth-coordination.md`. File where the coordinating planner will pick it up.
- Connector decision record (separate thread, same session): a provisional decision-log record for the permit-portal / AHJ-precedent connector pick. Not part of the auth handoff; noted so the recipient knows it exists and is independent.

## 5. Stakeholder updates needed

None external. This is an internal sequencing coordination between planning agents and the sprint-58 owner. No counterparty or stakeholder communication is gated on it.

## 6. Context for the next session or recipient

Bring these into the coordination:

- `_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md` — the task #29 dispatch to be widened. Its recon step (read-only, report first) is the natural place to surface the repo's existing auth pattern that the extension flow must match.
- `58_gtm_readiness_sprint.md` — the launch gate and the cc-agent-C serialization constraint; task #29 is the per-user-auth lane sequenced in the A2 wait, C2 is the extension cut.
- `75a_hauska_brief_extension.md` — the extension architecture, the current `X-Hauska-Key` + `X-Hauska-Install-Id` auth model, and the V1 requirements (history, sharing, wallet) that already assume per-user accounts.
- `_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md` — the Phase 1 anonymous / Phase 2 authenticated split the ladder maps onto.
- ADR-008 (engine factor-out / decoupling) and ADR-005 (multitenancy) — identity lives in the BFF, tenant resolution lives at the gate; the sovereignty floor for the anonymous-history acceptance criterion.

Time-sensitive only in ordering, not on a clock: act while task #29 is still pre-build. No FB-group clock per sprint 58.
