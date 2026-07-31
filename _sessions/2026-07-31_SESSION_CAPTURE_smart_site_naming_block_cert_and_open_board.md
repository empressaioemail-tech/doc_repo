---
id: 2026-07-31_SESSION_CAPTURE_smart_site_naming_block_cert_open_board
title: Session capture — "smart site" naming ratified, Block-13 cert restored, three-wedge/stub thesis, full open board
date: 2026-07-31
type: session_capture (comprehensive; continuation of the long setback/strategy arc)
agent: claude_code (planner)
owner: nick
status: capture (NOT session close — work continues)
related: [42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, 2026-07-31_tier3_municipal_wedge_thesis_frame, 2026-07-29_setback_authoritative_source_and_road_decouple, 40_hauska_map_3d_implementation_brief, 30_block_cert_harness_spec]
---

# Session capture — smart site + block cert + open board

Not a close; work continues. Captured now due to context burn. Covers: THE NAME, what shipped, the thesis, and the full open board.

## >>> THE NAME: "SMART SITE" (ratified 2026-07-31) <<<
The unit formerly called "stub" (doc 42) IS a SMART SITE. Operator-ratified. This name propagates through the entire doc reconciliation.
- A SMART SITE = any measure of property / any addressable place — a parcel, a spot in the middle of a road, the park you're standing in. Not just a lot; ANY place, fully twinned (lots/roads/topo/codes/setbacks/utilities; data-structure + map viz; MCP + PE doors).
- A SMART CITY = a bunch of smart sites. Composes upward — reinforces SmartCity OS (product name ↔ unit name align).
- CONSUMER-LEGIBLE: "I'm a realtor — I'll share your smart site with you." Passes the two-altitude test (internal-precise AND external-natural; a realtor says it without explaining "digital twin").
- THE REPORT IS A "SMART SITE X-RAY" — NOT a property dossier. X-ray = see through the visible lot to all the layers beneath (code/setback/flood/utility/etc.). Rename the dossier/brief product accordingly.
- THESIS SHARPENED: the destination is "the country as SMART SITES"; the X-ray is how you read one. Everywhere doc 42 says "stub," read "smart site." Everywhere the product says "dossier/property brief," consider "smart site X-ray."

## WHAT SHIPPED / LANDED THIS SESSION (live/merged)
- BLOCK-13 CERT RESTORED (the session's dominant thread, now CLOSED): mechanical 7/7 (R32 engine-frame measurement + road-node front-orientation) + operator R6 live block-QA — BOTH gates passed. Audit: _inbox/2026-07-31_BASTROP_BLOCK13_CERT_RESTORED.md. 17 amendments of hardened rulings in the decision record. Engine fixes merged: R30/R31 (48fdf06), R32 (61895f0). Durable cert-grade script pushed on chore/block13-cert-grade-script (4f3891e) — PR owed.
- C6 Phase 0A visual hierarchy — SHIPPED + operator-accepted (#122-124 taxonomy/cold-open/presets; FEMA NFHL severity; roads band+hairline; footpath isPedestrianWay #197 + overlay #128/#129).
- C7 — merged + backend DEPLOYED: C7a chip UX (extension 0.6.33, brief-ext #35), C7b user-aware entitlement (ldt #366). cortex-api canary→shift LIVE (00448-ley @100%, /health 200, brokerage 200). TAIL: extension 0.6.33 publish + live-verify.
- Terrain (statewide TxGIO LiDAR, additive): T-008/T-009 baked LOCAL on feat/terrain-dem-acquire (1,877 PNGs z0-16, NAVD88/ftUS datum preserved). T-010 (setTerrain wire + the Phase-1-blocking "does MapLibre anchor extrusion-base to terrain" question) DISPATCHED, running. Terrain + Sidewalks/footpaths + Flood/Entitlement/Terrain presets visible in PE layer panel.

## THE THESIS (doc 42 + doc 41, now under "smart site")
- UNIT: a smart site (fully-twinned place). ACTIVITY: smart-site production + deepening (reconstruct existing / deepen assets / ORIGINATE new — subdivisions born-clean, live Bastrop dev test subjects). DESTINATION: the whole country as RWA-ready smart sites (~$3T-in-5-yrs RWA market plugs into what we build).
- THREE WEDGES, ONE SPINE, one theology (all data → atoms+nodes): RE-PRO (revenue-in-door, PE+MCP), MUNICIPAL (long money, SmartCity+Vertosoft, plan-review off-island), CUSTOM-BUILD (Mox-class commercial). Plan-review = keystone serving all three.
- TWO-ALTITUDE POSITIONING (canon): INTERNAL = smart site / twin / atoms. EXTERNAL mass-market = "stop switching between disparate apps / one connected system" (100+ people don't know "digital twin"; they DO feel app-switching pain). RWA/web3 audience finds us as the verified-truth substrate with smart sites ready to attach. Same build, pitch differs by listener.
- MARKET POSTURE: OWN public (infra twin + durable public records — our atom/node structure beats "on-chain"; Vertosoft channel); CONNECT to private RWA (we're their truth+attestation FEED, not the issuer). SDK already provides attestation (VDA + event-anchor hash chain) + anchoring (IPFS/chain adapters) + payment substrate; inbound per-reference meter LIVE (waiting on ICC first-customer to set rate/wire). Outbound revenue-routing + per-ref rate = the ICC-track payment build still owed.
- GROUNDING: SmartCity OS live at Bastrop (Sylvia+Jaime), strong AGGREGATOR, honest-thin (citizen payments UI-only, GovTitle/twin/IoT advertised-not-built — the spine makes GovTitle REAL). Vertosoft distribution live ~1 month. Mox bought the SUBSTRATE not a feature.

## OPEN DECISIONS OWED (operator)
1. doc_repo push — local 12 ahead of origin (mixed w/ other seats' work); session-close call whether/how (explicit-path selective).
2. MCP self-metering pricing (C1); ICC accessPolicy fix (C2, do-regardless); ICC-track payment build (revenue-routing + per-ref rate).
3. Run the positioning agent (C3) — now with "smart site" + X-ray as the vocabulary.
4. Custom-build (Mox) as a repeatable offering — own framing pass owed.
5. Token/record role — substrate provides B+C already; posture = own-public / connect-private-RWA (settled direction; bridge-depth on record types TBD).

## OPEN EXECUTION (running / tail / queued)
- Terrain T-010 running (extrusion-base-on-terrain answer gates Phase 1).
- C7 extension 0.6.33 publish + live-verify (tail).
- Engine cert-script PR (chore/block13-cert-grade-script) — open+merge on green.
- PE #118 — hydro seat owns (rebase-take-main-flood, or close).
- Basemap Carto dashes (GROUND mute) — Phase-0A follow-up.
- Envelope-vs-setback-zone VISUAL distinction (R6 finding) — Phase-0A follow-up: make the buildable envelope the dominant SUBJECT, setback strip recede/hatch. Real product improvement.
- Phase-1 envelope EXTRUSION — now UNBLOCKED (Block-13 cert-clean); gated only on terrain T-010's extrusion-base answer.

## THE OPERATOR'S RATIFIED SEQUENCE (durable, not fast-tracked)
PE-to-market = revenue engine (finish: paywall unlock + Stripe/CRM + all-TX-in-map) → MCP-v1 alongside → municipal (SmartCity/Vertosoft, prepped-not-sprinted) + custom-build (Mox) parallel. Plan-review keystone. Fan-out (national smart-site production) = the scale-warm program, AFTER block cert (now done) + gates mechanical. Then the doc reconciliation (gated on the name — NOW HAVE IT: smart site).

## NEXT (this session, not closing)
- Dispatch-plan for the DOC-REPO AUDIT + SCRUB (reconcile all repos to the smart-site thesis; archive stale docs) — WRITTEN + HELD (see companion). Do not run yet.
- High-level overview of where things stand (verbal, next).
