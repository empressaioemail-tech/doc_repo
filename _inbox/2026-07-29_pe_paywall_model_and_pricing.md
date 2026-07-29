---
id: 2026-07-29_pe_paywall_model_and_pricing
title: PE paywall model + pricing — the free/paid line, purchase units, entitlement gating (governs every bubble)
date: 2026-07-29
status: decision + spec (governs the PE Workbench build; the commercial constraint every bubble inherits)
owner: nick
related: [2026-07-29_pe_workbench_concept_spec, 2026-07-29_pe_ai_chat_atom_citations_spec, 2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec, 08_tiered_access_model, 14_pricing_framework]
---

# PE paywall model + pricing

The commercial model for the Property Explorer consumer app, decided 2026-07-29. This governs EVERY bubble's free/paid gating so the line is consistent across the app. Pricing is a CONFIG value (not code); the gate architecture below is what gets built.

## ICP — who pays (broader than realtors)
Any professional who analyzes parcel details: real estate agents/brokers, ARCHITECTS, real estate INVESTORS, developers, land planners, civil/consultants. The wedge is "look like the most informed person in the room / hand a client a cited professional analysis." A deal-winning / submittal-supporting pro tool, not a consumer toy. Launch focus: PROS (see funnel).

## The free/paid LINE
FREE (the hook — no login needed):
- Everything in the UPPER-LEFT INSPECT CARD (zoning, setbacks, buildable, flood, land-use, acreage — whatever is in that card is free; operator may adjust the card contents, but the RULE is fixed: in the left card = free).
- Map browse + toggle layers (contours, FEMA, Hydrography, parcel, zoning).
- 3 FREE AI CHAT MESSAGES PER PROPERTY (SIGNED-IN-FREE, ruled 2026-07-29) — the free INSPECT CARD + map browse stay fully ANONYMOUS (no-login-to-browse holds), but the 3 free chat messages sit behind a FREE ACCOUNT, server-counted per free-account per property. Sign-up is the funnel step. NOT anonymous chat metering (that's the auth-orphan trap). Then the wall.

PAID (the value — the right-bubble-stack):
- Property BRIEF (full), AI CHAT (unlimited on the property), FLOOD & DRAINAGE report, SITE-PLAN export, TERRAIN export, SHARE-with-drawings.

## The two purchase units
1. PER-PROPERTY — $15, PERSISTS FOREVER. Unlocks ALL REPORTS on that property (brief, flood & drainage, site-plan) + UNLIMITED AI CHAT on that property. Does NOT include the TERRAIN file (pros who need terrain go Pro). The low-commitment on-ramp for pros not ready to subscribe — a trial that pays.
2. PRO SUBSCRIPTION — advertised $149/mo, LAUNCH SALE "$99/mo limited time" (anchor high, convert at the deal). Annual ~2 months free (target ~$990-$1,490/yr depending on the live monthly; a modest prepay reward, NOT the old 39%-off). Unlimited reports + unlimited terrain + unlimited AI, across ALL properties.

Target: $100K MRR. At $99 ≈ ~1,010 pros; at $149 ≈ ~671 pros. Central Texas alone (realtors + architects + investors + developers) supports 1,000 pros; national scale is far larger. Pro conversion is the business; per-property is the on-ramp.

## The conversion trigger (one clean moment, not a wall per button)
Reaching for ANY paid bubble (or the 4th AI message on a property) surfaces ONE unified unlock flow:
- "Unlock this property — $15 (all reports + AI, forever)"
- "Go Pro — $99/mo (unlimited everything, all properties)" [advertised $149, sale price shown]
One flow, two choices. With an obvious "one pro conversion = the value of many property buys" nudge toward Pro. Never a different wall per bubble.

## THE GATE ARCHITECTURE (what gets BUILT this session — the scope boundary)
BUILD: the gate + entitlement-check + unlock UX + the free/paid enforcement on every bubble.
- Every paid bubble checks entitlement before running: "is this property unlocked (per-property buy) OR is this user Pro?" → if yes, run; if no, surface the unlock flow.
- AI chat: allow 3 messages per property, then check entitlement.
- Terrain: PRO-ONLY (not in the per-property unlock) — enforce that specifically.
- The entitlement check is built against an INTERFACE that returns unlocked/pro status. It is NOT wired to live payments this session.

OUT OF SCOPE THIS SESSION (sequenced separately — do NOT bundle, per the auth-deploy-orphans-anonymous-data lesson): wiring LIVE PAYMENTS. For context only: human payments will use STRIPE; AI/programmatic calls will meter via the SDK through the MCP gate. This session builds the gate + entitlement interface + unlock UX; the entitlement check can be stubbed/config-driven or read an existing flag. Turning on real charging (Stripe + SDK/MCP metering) is a clean follow-on that plugs into the interface — it must not entangle with or block the UX build.

## HONESTY / EDGE RULES
- The free inspect card must ALWAYS work (anonymous, no login) — the paywall never breaks the free browse.
- Persisted per-property unlocks survive across sessions (the purchase persists forever).
- A locked bubble shows the value + the unlock flow, never a broken/empty state.
- Free-message count is per-property (resets per property, so each parcel gets its taste).

## EXECUTION
Governs the coordinated PE Workbench session (workbench + citations + hydrography/report). Pricing is config; the gate architecture is the build. Planner-manages-background-agents; verify live; deploys planner-owned; standing decisions in every sub-dispatch. CTX HELD.
