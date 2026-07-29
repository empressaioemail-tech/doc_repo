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

## CRITICAL SEQUENCING (read first)
The Flood & Drainage report (H3/H4, already on your board) is a PAID report — it MUST be gated behind the reconciled paywall. But the paywall today is PRO-ONLY (no per-property $15, no 3-free-messages). So: RECONCILE THE PAYWALL (#1 below) BEFORE shipping the report, or the first paid report ships un-gated or wrongly Pro-only-gated (wrong purchase unit). Order: paywall reconcile → then the report inherits correct gating. The citation layer (#2) can run in parallel.

## THE TWO THINGS YOUR BOARD IS MISSING (add these)

1. THE PAYWALL — this is NOT a simple "reconcile the seam" (adversarial review corrected this — the framing was wrong). What EXISTS (code-verified): `browse/PaywallGate.tsx` + `lib/billingClient.ts`, wired in `ExplorerMap.tsx`; gates are BACKEND-402-driven (bubbles run optimistically and catch a 402 → open paywall); entitlement is BINARY USER-LEVEL `tier: "free" | "paid"` (`peEntitlement.ts`); the only checkout is a STRIPE SUBSCRIPTION (`createSubscriptionCheckoutSession`, `tier:"pro"`); browse stays free. What the decided model needs, HONESTLY SCOPED:
   a. PER-PROPERTY $15 is a NEW BUILD, not a reconcile — it needs (i) a ONE-TIME payment mode (the seam is subscription-only), (ii) a PROPERTY-SCOPED entitlement RECORD (schema change to the entitlements table — today entitlement is user-level binary, cannot express "this property unlocked"), (iii) a property-scoped gate ("is THIS property unlocked" not "is user paid"). Design the property-scoped entitlement CHECK (stubbable against the interface); the schema + gate change is unavoidable — scope it, do not pretend it's a UX-only reconcile.
   b. CLIENT-SIDE ENTITLEMENT READ is missing — bubbles today gate reactively on a 402, never a pre-emptive check. The spec's "every paid bubble checks entitlement before running / unified unlock flow" needs the `/entitlement` route (exists, unconsumed) wired into a shared hook so bubbles show locked state proactively. Build this.
   c. 3-FREE-AI-MESSAGES-PER-PROPERTY (ANONYMOUS) IS ARCHITECTURALLY BLOCKED TODAY — the chat deep route returns 401 for anonymous BEFORE any tier/count check (`peEntitlement.ts:73-76`); there is no per-message counter, no per-property state. This is a REAL BACKEND BUILD with an auth-model implication (the exact auth-orphan trap): it needs either an anonymous-tolerant chat path with server-side (or install-id-keyed) per-property message counting, OR an explicit operator decision to make the 3 free messages client-side-only (trivially bypassed). FLAG THIS TO THE OPERATOR — it's a real decision, not a small add.
   d. TERRAIN-PRO-ONLY: today terrain + site-plan hit the SAME binary paid gate with the same "upgrade to Pro" message — there is no mechanism to gate two paid things at different tiers. Once per-property exists, terrain must be EXCLUDED from the $15 unlock; that exclusion is part of the (a) gate rework, not free.
   e. PRICING (config, not code): Pro advertised $149 / sale $99; per-property $15.
   PAYMENT SCOPE: wiring FULL live end-to-end payments (the one-time charge, webhooks) stays out of a UX session — but the DATA MODEL + gate + entitlement interface (per-property record, property-scoped check, message counting) is unavoidable and IS the work. The "don't wire live payments" boundary is coherent ONLY for the interface/UX; the schema/gate/counter build must happen. Keep the live-charge wiring isolated per the auth-orphan lesson.
   - Free/paid LINE (code-confirmed it HOLDS): FREE = the INSPECT CARD (`InspectCard.tsx`, unauthenticated, a different component from the brief bubble) + map/layers. PAID = the right bubble stack INCLUDING the full brief (the brief bubble is correctly gated paid; do NOT accidentally free it). + 3 AI msgs/property (per c above). Terrain Pro-only.

2. THE CITATION LAYER on the AI chat — CORRECTED by adversarial review (the spec's wire format is WRONG for this codebase; read this before the spec):
   - CRITICAL: the spec `2026-07-29_pe_ai_chat_atom_citations_spec.md` mandates `{{atom:TYPE:ID:LABEL}}` markup — but the PE code EXPLICITLY RETIRED that. `browse/chat-citations.ts` states verbatim: the `{{atom:...}}` shape is "DEPRECATED corpus-wide — this port does NOT parse or resurrect it." The LIVE system is BACKEND NUMBERED `[n]` CITATIONS (`brokerageBriefLlm.ts parseInlineCitations`) → a `citations[]`/`sources[]` array → chips. DO NOT build a `{{atom}}` parser. Build on the `[n]`→citations[] architecture. (Where the operator wants to change this later, that's a deliberate decision — for v1, use what exists.)
   - THE LOAD-BEARING ANTI-FABRICATION RULE IS IN A DIFFERENT REPO and ALREADY SUBSTANTIALLY EXISTS: it lives in `legacy-design-tools/artifacts/api-server/src` (`brokerageBriefLlm.ts generateResearchChat`), NOT the PE app. The model is already instructed "Use ONLY the numbered code atom sources, do not invent code," can only emit `[n]` for n≤sources.length, and `parseInlineCitations` DROPS any out-of-range `[n]`. So fabrication is already structurally bounded. R2's job is VERIFY + HARDEN that existing constraint (in the right repo), NOT build it from nothing. Test it: force the model and confirm no out-of-range/invented citation survives.
   - WHAT'S GENUINELY MISSING (a real new build, NOT polish): the chip expand today is LOCAL-only ("NO network fetch on chip tap"). The spec's BRIEF/FULL accordion + fetch-atom-by-id + gated-404-degrades-to-text + the clickable lineage walk (COMPUTED-FROM / WOULD-AFFECT: envelope←setback←code) DO NOT EXIST — no atom-by-id endpoint, no accordion, no lineage. This needs an atom-fetch endpoint + the accordion + lineage UI. Scope it as new.
   - The honesty rules (never-bare confidence, earned-vs-asserted downgrade since PE calibration isn't live, gated-404, honest-empty, read-time freshness) still apply — adapted to the `[n]`/citations[] system, not `{{atom}}`.
   - THE ONE TEST (unchanged): every citation the AI emits resolves to a REAL source/atom for that property; an invented/out-of-range one is dropped, never rendered.

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
The PE Workbench build has already moved fast. As of 2026-07-29 these landed + deployed + live-checked (verified in code; use PR numbers — the doc-repo commit hashes are NOT PE-repo hashes):
- WORKBENCH CHASSIS (shared-persistent-dock + bubble cluster, 6 live tools in `workbench/registry.tsx`), verdict line, reports-into-bubbles, chat PORT (with `[n]` citation chips + freshness + local expand), my-properties + share, dossier/compare/pins (PE PRs #100-#107).
- HYDROGRAPHY LAYER swap — real county streams live, derived D8 retired as a customer layer (`consumer-layers.ts`; PE #108). DONE.
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
