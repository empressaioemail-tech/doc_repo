---
id: 2026-07-29_MIDSESSION_pe_workbench_mcp_icc_positioning
title: MID-SESSION capture — PE Workbench + paywall, MCP+ICC audits, positioning, and the fan-out engine entry point
date: 2026-07-29
type: session_capture (mid-session; PE build in flight; fan-out discussion beginning)
agent: claude_code (planner)
owner: nick
status: capture
related: [_STATE.md, 28_THE_BASTROP_MOLD_engine_build_spec, 2026-07-29_pe_workbench_coordinated_session_handoff, 2026-07-29_pe_paywall_model_and_pricing, 2026-07-29_pe_ai_chat_atom_citations_spec, 2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec, 2026-07-29_mcp_audit_pe_stack_gap, 2026-07-29_icc_verification_state, 2026-07-29_next_gen_property_layer_positioning_summary]
---

# MID-SESSION capture — 2026-07-29

Long, high-decision session. Preserves the full context before we go deep on the fan-out engine. Authoritative detail is in the linked docs; this is the index + through-line + the open threads.

## WHAT HAPPENED

### 1. PE WORKBENCH — specced, code-verified, locked, executing
Recaptured the brief-extension essence (verdict-first, conversational, accumulating, shareable) on PE's clean map-first UX. Design law: ONE shared dock (the brief's space), one tool open at a time, bubbles are the switcher, persistent per-property, map stays the star — NOT the old split-screen. Committed specs: workbench concept, paywall/pricing, AI-chat citation layer, hydrography+flood-drainage report.
- PAYWALL (ruled + LIVE): free = inspect card + map + 3 AI msgs/property (SIGNED-IN-FREE, server-counted); paid = right bubble stack; two units — per-property $15 (persists, all reports + AI on that property, NOT terrain) / Pro advertised $149 sale $99 (unlimited). ICP = any parcel-analyzing pro (realtors/architects/investors). Target $100K MRR (~670-1010 pros). Build the gate/interface, live-payments a separate wave (Stripe humans / SDK-MCP agents).
- CITATION LAYER: the load-bearing rule = the backend constrains the model to cite ONLY real atoms on the property (anti-fabrication). Code-corrected: PE retired {{atom}} markup, uses numbered [n]->citations[]; the constraint already substantially exists (out-of-range dropped); new work = fetch-on-tap accordion + client-composed lineage (envelope<-setback<-zoning<-code) + switch presentationMode consumer->professional (consumer STRIPS citations — bad for our pro ICP).
- HYDROGRAPHY (LIVE) + FLOOD & DRAINAGE report (queued): map layer = real county streams (retired the derived D8 squiggle); report = the FIRST paid report bubble (catchment + drainage zones + rainfall ponding + flow exits, real hydrologyNative output) -> sheet-standard PDF. RULE: every report inherits the site-plan Sheet Standard (one visual system).
- THE REVIEW-BEFORE-LOCK LOOP proved its worth: 3 passes (specs -> outside adversarial code review -> implementer review) caught 9 real spec-vs-code errors before dispatch. KEEP THIS DISCIPLINE.
- STATUS at capture: paywall LIVE; workbench + map UX + hydrography + site-plan-one-truth shipped; 5 tracks in flight (R2 citations at CI, WB7a/b at CI, R3 queued behind WB7b, data tail re-bake). Parked operator calls: Vercel Pro (11/12 fn cap), engine min-instances=1, live-payments-wave timing.

### 2. MCP + ICC AUDITS (code-verified, not agent-said-done)
The frame: PE made the property-intelligence stack HUMAN-consumable; MCP makes the SAME stack AGENT-consumable + discoverable + metered. ICC is the first licensed SOURCE and the demo account for the metering model. MCP + ICC share one root: the metered-citation pipe (inbound=owe ICC per reference; outbound=agents pay us per call).
- MCP AUDIT (`2026-07-29_mcp_audit_pe_stack_gap`): 69 tools / 4 gates, metering REAL (Stripe retired, SDK gate-then-serve; Circle money-rail NOT provisioned), ICC inbound meter LIVE. Gaps = the FRONT DOOR (no anonymous geocode, no consolidated facets, discovery-is-a-cliff) + the VISUAL (no server-side renderer exists — image answers are a real build). REFRAME (operator + confirmed by June's own offer doc): MCP v1 = the PE-PROVEN functions agent-callable, NOTHING ELSE — the ~50 cortex tools are inward-facing document-plumbing, unproven, wait for the plan-review app. A spine function is only real when a live app proved it.
- ICC VERIFICATION (`2026-07-29_icc_verification_state`): "agent said done" was HALF true. REAL IBC ingest (8,731 atoms), verbatim-compliant (0 leaks, deep-link only), wind-down traceable, inbound meter LIVE. WRONG (the ACTION FLAG): accessPolicy is a LATENT LICENSE EXPOSURE — ICC content carries no platform-internal stamp; the ingest tool hardcodes public-free on the ICC jurisdiction/status; not leaking today ONLY because of an incidental gate default. FIX regardless of sequence. Demo gaps: content->actor reference + per-reference rate + IPMC (2nd book = 0 sections). ICC on/off switch is HALF-BUILT (PE ICC citations flag-gated off — correct pre-SaaS).
- OPERATOR RULINGS: ICC = on/off switch (demo ON with CC usage screen; default OFF so PE launches). MCP visual = rendered-image-now (real build) / interactive-embedded-later (frontier).

### 3. POSITIONING (`2026-07-29_next_gen_property_layer_positioning_summary`)
Technical positioning summary written for a market-positioning agent: what we joined (CAD/GIS + public records + roads + codes + terrain into one graph) + what we amplified (buildable-answer reasoning, property-line-as-node, cited-provenance, report suite, mechanical honesty) + why it's a NEW CATEGORY (verifiable property-intelligence substrate, two doors: humans via PE + agents via MCP) + the Plaid+Stripe-for-property analog. A positioning-agent prompt was drafted (in chat) to turn it into a framework (category name, one-liners per ICP, honest differentiator, lead ICP, brand architecture Empressa=products/Hauska=substrate, narrative hooks).

## OPEN DECISIONS / OWED (captured so they don't drop)
- ICC ACCESSPOLICY FIX — the one RISK (vs opportunity); small contained compliance dispatch; do regardless of sequence.
- MCP SELF-METERING PRICING — how WE get paid for MCP calls (not just pay ICC); parallel to the PE pricing decision; must be coherent with PE ($/property vs $/call); + provision Circle. OWED, not-now.
- MCP DISCOVERABILITY — foundation BUILT-AND-SHELVED (llms.txt, .well-known/agents.txt, registry drafts on unmerged branch feat/gtm-engine-discoverability). Pair with MCP-v1 launch.
- Vercel Pro plan, engine min-instances=1, live-payments-wave timing (operator calls).

## THE OPERATOR'S SEQUENCE (ratified this session)
PE to market (human + MCP-v1=PE-proven-functions) -> ICC demo in PE -> ICC login/metering via PE -> build PLAN-REVIEW app -> wire plan-review for ICC (the BIG ICC use case: does-this-comply-with-code) -> full ICC commercial agreement -> ICC live in PE -> refine plan-review to market. Each app proves a spine slice; MCP exposes the proven slice; ICC rides both apps.

## >>> THE FAN-OUT ENGINE — the entry point for the NEXT discussion (biggest roadmap item)

The single largest program, HELD on "wait until Bastrop PE is complete" (gate about to clear). Gated-and-ready, not behind. Mold hardened (`28_THE_BASTROP_MOLD`), recipe generalizes (Caldwell 7/8). Prereqs: build phantom gates 7 (tally+cost) + 8 (smoke) as MECHANICAL (prose today); harden M0-reach.

TWO OPERATOR REQUIREMENTS raised 2026-07-29 to fold into the fan-out design:
1. RE-WARM AT SCALE, not one county at a time. Bastrop's re-warm (after the setback structural change) took forever; re-warming the rest of TX one-county-serially is unacceptable. The fan-out engine must support SCALE re-warming — including standing up TEMPORARY DATABASES or whatever parallelization the compute needs. Design for parallel/batch county processing, not serial.
2. A DEFINITIVE BASTROP "CLEAN + DONE" AUDIT. Before fanning, an audit that proves for ABSOLUTE CERTAINTY that Bastrop is complete, correct, and clean — everything covered, nothing half-baked, the reference county is truly the mold. (This is the composition-inventory + hardening-audit + QA, taken to a final "certified done" bar. It's the thing that makes fanning SAFE — you only stamp a mold you've certified.)

These two are the entry points to the fan-out discussion: (a) parallel/scale re-warm architecture, (b) certify Bastrop clean-and-done first. Discussion to follow this capture.
