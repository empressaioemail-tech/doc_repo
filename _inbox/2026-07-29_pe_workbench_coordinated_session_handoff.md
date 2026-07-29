---
id: 2026-07-29_pe_workbench_coordinated_session_handoff
title: PE Workbench — coordinated session handoff (workbench + citations + hydrography/report + paywall)
date: 2026-07-29
status: handoff (for the PE planner to run as one coordinated planner-manages-background-agents session)
owner: nick
governs: [2026-07-29_pe_workbench_concept_spec, 2026-07-29_pe_ai_chat_atom_citations_spec, 2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec, 2026-07-29_pe_paywall_model_and_pricing]
---

# PE Workbench — coordinated session handoff

SITUATION (2026-07-29): the PE Workbench build is ALREADY IN FLIGHT and moving fast. The chassis, verdict, reports-into-bubbles, chat port, my-properties/share, dossier/compare/pins, and the HYDROGRAPHY LAYER are DONE + live. WB7a (cortex share route) + WB7b (engine dossier PDF) are in CI; the FLOOD & DRAINAGE report (H3/H4) is ALREADY QUEUED to build on WB7b's document pattern. So this handoff is NOT a restart — it is TWO THINGS THE LIVE BOARD IS MISSING, plus the confirmed model for the report already queued.

You are the PLANNER; continue your live board and ADD the two missing pieces below. Plan, fan background agents, verify LIVE (never sub-agent self-grade), own deploys, keep _STATE.md true. Standing-decisions block into every sub-dispatch.

## THE TWO THINGS YOUR BOARD IS MISSING (add these)

1. THE PAYWALL — RECONCILE the existing gate to the decided model (do NOT build from scratch — a partial paywall ALREADY EXISTS in code; verify before touching). VERIFIED IN CODE 2026-07-29:
   - `browse/PaywallGate.tsx` + `lib/billingClient.ts` + wired in `ExplorerMap.tsx` EXIST. Today it is PRO-ONLY: `startPeCheckout` hardcodes `tier: "pro"`; the gate message says "Deep research and cited property reports (R1-R10) require sign-in and Pro entitlement"; a Stripe checkout seam is ALREADY partially wired (`billing/checkout`, `stripeConfigured`, test/live mode). "Browse stays free" is already true.
   - GAPS vs the decided model (`2026-07-29_pe_paywall_model_and_pricing.md`) — these are the work:
     a. NO PER-PROPERTY $15 unit — checkout is Pro-only. ADD the per-property purchase ($15, persists forever, unlocks all reports + unlimited AI on THAT property, NOT terrain).
     b. NO 3-FREE-AI-MESSAGES-PER-PROPERTY allowance — chat gating appears all-or-nothing Pro. ADD the 3-free-messages-per-property-then-wall.
     c. TERRAIN-PRO-ONLY not separately enforced — once per-property exists, terrain must be excluded from the $15 unlock (Pro-only).
     d. PRICING: advertised $149 / sale $99 for Pro (config, not code); per-property $15.
     e. Conversion = ONE unified unlock flow (property $15 / Pro), reached from any paid bubble or the 4th AI message — not a wall per button.
   - PAYMENT SCOPE: a Stripe seam already exists (more than expected). Wiring FULL live payments end-to-end is still out of scope for a UX session — but since the seam is there, the task is: make the ENTITLEMENT MODEL (per-property vs Pro, 3-free-messages, terrain-Pro-only) correct against the interface; do NOT expand the live-payment integration beyond reconciling the existing seam. Keep the money-wiring isolated from the UX per the auth-orphan lesson.
   - Free/paid LINE (confirm it holds): FREE = upper-left inspect card + map/layers + 3 AI msgs/property. PAID = the right bubble stack. Terrain Pro-only.

2. THE CITATION LAYER on the AI chat — the chat is ported + context-wired, but not citation-disciplined. Per `2026-07-29_pe_ai_chat_atom_citations_spec.md`:
   - PART 2 BACKEND [ATOM CONTEXT] CONSTRAINT FIRST — the AI can ONLY cite real atoms on the active property (copy TYPE:ID verbatim, never invent, cap N, no context → no markup). A fabricated citation weaponizes the trust the chip earns. This is the load-bearing rule; build + test it first.
   - Then: reserved-color chips + streaming-hold + in-bubble BRIEF/FULL accordion (walk the property reasoning chain: envelope←setback←code) + the honesty rules (never-bare confidence, earned-vs-asserted downgrade since PE calibration isn't live, gated-404-degrades-to-text, honest-empty, read-time freshness).
   - THE ONE TEST: every chip the AI emits points at a REAL atom on that property.

## THE REPORT YOU ALREADY QUEUED (H3/H4) — the confirmed model
Flood & Drainage is correctly queued on WB7b's document pattern. Confirmed shape (`2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec.md`): PAID report bubble, run-in-dock → sharp viz (catchment + drainage zones + rainfall ponding + flow exits, all real hydrologyNative.ts output) → SHEET-STANDARD PDF (reuse the site-plan Sheet Standard v1.0; one visual system). It is the FIRST paid report bubble — it sets the pattern for every future report, AND it must be gated PAID (needs the paywall from #1). Build it well.

## THE THREE GOVERNING CONSTRAINTS (judge every unit against these)
- DESIGN LAW: the clean map stays the star; one shared dock, one tool open, persistent per-property; no permanent panel, no split screen.
- PAYWALL LINE: left inspect card = free; right bubble stack = paid; terrain Pro-only; 3 free AI msgs/property; build the gate not live payments.
- SHEET STANDARD: every report PDF inherits the site-plan Sheet Standard v1.0 — one premium product line.

## READ THESE FOUR SPECS (in order)
1. `2026-07-29_pe_workbench_concept_spec.md` — the chassis: bubble cluster + ONE shared dock (the brief's space) + one-tool-open + persistent-per-property + the DESIGN LAW (map stays the clean star; no permanent second surface; NOT the old split-screen).
2. `2026-07-29_pe_paywall_model_and_pricing.md` — the COMMERCIAL CONSTRAINT every bubble inherits: free = the upper-left inspect card + map + 3 AI messages/property; paid = the right-bubble-stack; two units ($15/property-persists, $99-sale/$149 Pro); build the GATE + entitlement-interface, do NOT wire live payments.
3. `2026-07-29_pe_ai_chat_atom_citations_spec.md` — the chat's citation layer: the LOAD-BEARING rule is the backend [ATOM CONTEXT] constraint (the AI can only cite REAL atoms on this property — a fabricated citation weaponizes trust); + reserved-color chips + in-bubble BRIEF/FULL accordion + the honesty rules.
4. `2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec.md` — Hydrography map layer (real county streams, toggle, replaces the derived squiggle) + FLOOD & DRAINAGE report (the FIRST paid report bubble — run-in-dock → sharp viz → sheet-standard PDF; sets the pattern for all future reports).

## THE THREE GOVERNING CONSTRAINTS (judge every unit against these)
- DESIGN LAW: the clean map-first PE stays the star; every capability opens into the ONE shared dock, one at a time, persistent per-property; no permanent panel, no split screen.
- PAYWALL LINE: left inspect card = free; right bubble stack = paid; enforce consistently; terrain is Pro-only; 3 free AI messages/property; build the gate not the live payment.
- SHEET STANDARD: every report PDF inherits the site-plan Sheet Standard v1.0 — one visual system, one premium product line. Never a second visual system.

## ALREADY DONE (do NOT rebuild — verify live, don't redo)
The PE Workbench build has already moved fast. As of 2026-07-29 these landed + deployed + live-checked:
- WORKBENCH CHASSIS (shared-persistent-dock + bubble cluster), verdict line, reports-into-bubbles, chat PORT (basic), my-properties + share, dossier/compare/pins (`df6c239`, `eb95635`).
- HYDROGRAPHY LAYER swap — real county Creeks_Streams live, derived D8 squiggle retired (`f039c02` engine #175 + PE #108). DONE.
So the coordinated session's REMAINING work is the three below. Confirm the above are live-healthy first (and that the backend re-warm landed), then build:

## REMAINING WORK (this session)
- R1 PAYWALL GATE (nothing gates anything yet — build this): the entitlement-check + unlock UX + free/paid enforcement on EVERY paid bubble (against the interface; NOT live payments). Terrain Pro-only. 3-free-AI-messages/property. Free = left inspect card + map + 3 msgs; paid = the right bubble stack. Build it as reusable as the dock — it's the commercial chassis every bubble inherits. Per `2026-07-29_pe_paywall_model_and_pricing.md`.
- R2 CITATION LAYER on the chat (the chat is PORTED but not citation-disciplined): the atom-citation spec — PART 2 backend [ATOM CONTEXT] constraint FIRST (the AI can ONLY cite real atoms on this property; a fabricated citation weaponizes trust), + reserved-color chips + in-bubble BRIEF/FULL accordion + the honesty rules. Test: every emitted chip points at a real atom on that property. Per `2026-07-29_pe_ai_chat_atom_citations_spec.md`.
- R3 FLOOD & DRAINAGE REPORT (only the LAYER landed — the paid REPORT is undone): the FIRST paid report bubble — run-in-dock → sharp viz (catchment + drainage zones + rainfall ponding + flow exits, all real engine output from hydrologyNative.ts) → sheet-standard PDF export. This sets the paid-report PATTERN for every future report; build it well. Per `2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec.md` PART 2.

Sequence note: R1 (gate) should land early since R3 (the paid report) needs the gate to enforce "paid." R2 can run in parallel.

## VERIFY / DISCIPLINE
Verify on the LIVE PE surface across MULTIPLE different-data properties (code-done != customer-done). The two tests that matter most: (a) the free/paid line is consistent — a locked bubble surfaces the unlock flow, the free card always works anonymously; (b) every AI chat citation points at a REAL atom on that property (the anti-fabrication guarantee). Deploys planner-owned. Update _STATE.md as you go. This is PE product work; CTX HELD.

## NOTE — the backend re-warm that just landed
The current agent was finishing a backend re-warm. Confirm that landed + verify the live surface is healthy before starting this session (don't build on a mid-warm state).
