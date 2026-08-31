---
id: 2026-07-18_property_brief_gtm_critical_path
title: Property Brief — critical path to Central-TX GTM readiness
status: active
date: 2026-07-18
applies_to: hauska-brief-extension, legacy-design-tools (cortex-api, cortex-tiles, engine corpus), hauska-mcp-server
related: [2026-07-16_brief_spine_consumer_direction, 2026-07-16_amazing_map_program_closeout, 61a_central_tx_coverage_program, 2026-07-17_digital_design_center_direction]
owner: nick
---

# Property Brief — critical path to Central-TX GTM

The gap list to get the Property Brief GTM-ready for Central Texas: every property profile complete, map firing on all levels, AI dialed, all functions polished. Grounded in live state verified 2026-07-18 (not the doc set's optimism). Anchored to the persona/offering thesis (`hauska-personas-offering`): the product is the buildable-envelope answer machine — "what can I build/change on this parcel, drawn on the map, cited, in the language of whoever's asking."

Valuation/HBU is deliberately OUT of scope (the honest weak spot; the wedge is constraints-and-buildability, not what-is-it-worth).

## The critical path spine (the blocking line)

The single dependency chain to a credible Central-TX demo:

**#4 corpus complete + stop the regression -> #3 ICC ingested -> #1 setback overlay + #2 ADU/addition envelope -> #7 AI registers (kill the hedge) -> GTM-ready.**

Everything else is parallel or lower-blocking. Verify #1 FIRST — it's the cheapest check with the biggest fork (wedge ready vs. next build).

## The full table

| # | Gap | Why it blocks GTM | Live state (2026-07-18) | The work | Depends on |
|---|---|---|---|---|---|
| 1 | Setback overlay DRAWN on the map | Story B is the wedge visual — "show me the setbacks / where the ADU fits." Everyone asks; no competitor does it | Setback DATA exists (LocalSetbacksTile); the DRAWN buildable-envelope overlay is UNCONFIRMED | Render front/side/rear setback lines + shaded buildable envelope as a map layer, wired to setback atoms | Map layer system (live) |
| 2 | ADU/addition envelope = derived answer | The flagship question, all 4 personas | Cites ADU code atoms but returns "needs city check"; no envelope computed | Compute buildable envelope (coverage + setbacks + zoning) -> "ADU fits here, up to X sqft", drawn | #1 + exact setbacks |
| 3 | ICC I-Codes ingested | "Codes for building here"; makes ADU/addition authoritative not "check with city" | Infra complete + citation leg works e2e; CREDENTIALS PENDING (ICC Code Connect adapter built, unfed) | Land ICC creds -> ingest IBC/IECC/A117.1/ADA -> flip answers from zoning-only to full-code-cited | ICC creds (operator-owned) |
| 4 | Central-TX corpus complete + NO regression | "Every property profile complete" — the core promise; a thin jurisdiction = broken demo | National baseline + websearch fallback live; Central-TX depth INCOMPLETE and REGRESSING (Austin 38.6->33.2% on a re-warm downgrade bug) | Fix the no-downgrade/high-water-mark deepen (dispatched per 61a); onboard Class B jurisdictions (Waco/Temple/San Marcos/Seguin/Cibolo/Belton); verify-before-promote per jurisdiction | The deepen-safety fix |
| 5 | Septic / OSSF layer | "Where's the septic field" — real rural-CenTX story, listed gap | Not in current-state; queued (records-access survey filed, Comal Tier-1 PoC path) | Pull OSSF records (7-county tiers) -> site-plan extraction -> map overlay -> SSURGO suitability compose | OSSF records access (georef load-bearing) |
| 6 | Flood overlay hardened | "What's in the flood plain" — a current WIN; must be demo-reliable | Live + drawn (FEMA NFHL); FEMA had an upstream outage this session | Confirm honest-degradation on FEMA outage; cache tiles so a demo doesn't hit a live 502 | FEMA layer (live) + cache |
| 7 | AI dialed — persona registers | "Three registers, one truth": homeowner verdict / investor envelope / architect citation off one engine | laySummary (consumer) exists; persona lenses exist in cmdcenter | Tune Brief answer to flex register per persona; confident where data supports, honest where not; kill the "needs city check" hedge once #3 lands | #3 (ICC) for confident code answers |
| 8 | Terrain / 3D / IFC e2e QA | "Sits on the real parcel" + deliverable; marquee capability just shipped | Mesh + IFC author, gated retrieval deployed, 3D viewer + download wired (PR #19, this session) | Operator QA on P:\tmp\brief-terrain-full-qa -> merge #19; confirm generate->view->download cold | Built; needs QA + merge |
| 9 | Tenancy / multi-user isolation | Sell to a 2nd user/agent/firm -> data must isolate; gates "save my properties" | Declared, UNENFORCED (anonymous default tenant); Radar entitlement install-keyed not user-aware | Enforce tenant isolation at the gate; make entitlement/history user-aware | Auth/tenant leg (sprint 54) |
| 10 | Map "firing on all levels" — layer polish | "The map is the answer"; all real layers toggle, LOD holds, no blank-on-zoom | Layers + LOD + toggles live (this session); federal real; composites left out (fixture) | Verify every real layer renders/toggles on a fresh cold load; confirm no fixture composites leak | Mostly live; needs sweep |
| 11 | Storage exposure fully closed | Trust/security posture for a public GTM product | Terrain retrieval gated (done); /storage/objects hardened not fully closed (avatars/PDFs) | Migrate avatars + encumbrance PDFs to signed URLs -> delete the open route | (operator urgency call) |
| 12 | #276 sourcing composites (OZ/buildable/constraint-density) | Upside signals feeding the investor read | RED (unmerged); currently fixture, ruled off-surface until real | Sourcing agent fix -> real derivations -> then surface | Sourcing agent |

## Sequencing buckets

- **Blocking spine (do in order):** 4 -> 3 -> (1, 2) -> 7.
- **Near-done, QA-and-merge (fast, parallel):** 8, 10.
- **Hardening (parallel):** 6, 11.
- **Additive stories (as corpus deepens, not first-demo blockers):** 5, 12.
- **Scale-past-demo gate (critical the moment >1 real user):** 9.

## Two honest reads (from the trenches)

1. "Every property profile complete" is the real long pole AND it's fighting REGRESSION, not just coverage. Austin dropped 38.6->33.2% because the re-warm upsert downgraded verified atoms on a failed re-fetch. The no-downgrade/high-water-mark fix (#4) is load-bearing before "complete" is honest. Least glamorous, most GTM-critical.

2. #1+#2 (the drawn setback/ADU envelope) is the ENTIRE wedge visual and it is UNCONFIRMED as live. If it renders -> demo tomorrow. If not -> it is the #1 build. Verify #1 first; it is the cheapest check with the biggest fork in the plan.

## First action

Verify #1 (setback overlay) against the live/deployed Brief before committing the sequence — it decides whether GTM is "polish and go" or "one real build away."
