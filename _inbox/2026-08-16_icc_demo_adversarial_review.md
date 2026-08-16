---
id: 2026-08-16_icc_demo_adversarial_review
title: Adversarial review — MCP + plan review = ICC demo (folded into the program WDLL)
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_c_wdll_lane_c_plan_review, 2026-08-16_mcp_wdll_monetizable_tested_discoverable, 75n_icc_code_connect_catalog, _decisions/2026-07-04_icc_poc_play]
---

# Adversarial review (folded)

This is the review of the 2026-08-16 morning drafts against the operator ruling "MCP + plan review = ICC". Findings that survive are written into `_inbox/2026-08-16_icc_demo_program_WDLL.md` and the three container blueprints. Do not execute the morning drafts.

## Operator correction (load-bearing)

Done is: **complete** plan review (spec 48 F1-F7 + map + letter + files) on a basic standalone Vercel UI (own Neon/GCP); **finished** MCP (dead ends gone, catalog true, Smart Files writes, Codex tools actually calling those functions); those two combined **are** ICC; ICC watches on an **activity portal**. "Basic" is visual/housing, not a function stub.

## Findings

**F1. G-50 is two claims glued together.** OPS-17 G-50 is "ICC demo run; SaaS agreement executed; atoms upgrade to public-paid." 75n says the PoC demo comes first; SaaS is what the demo unlocks; customer-facing display is forbidden until signed. The morning MCP WDLL treated signed SaaS as in-card. Kill. This program ends at a live PoC demo. accessPolicy stays `platform-internal`. PE ICC citations stay off. Vercel UI is gated, not a public I-Code site.

**F2. The morning Lane C WDLL hosted the UI in LDT `artifacts/plan-review`.** Operator asked for Vercel plus a Neon/GCP decision like Smart Files. Cortex-prod is the Texas shared store. L26 holds the atoms writer. Review state must not land on cortex-prod. ADR-023 still names LDT as the function home; isolation is housing (own repo/DB/service), not a product rename. Same shape as A-020. Do not subtree LDT.

**F3. The morning MCP WDLL was the commercial front door.** Circle, self-serve, DNS, directory remain later cards. This card still requires a **finished** MCP: catalog true, Cotality dead, Smart Files complete, Codex tools retargeted. A five-tool ICC allowlist stub is not finished.

**F4. Deleting 46 reporting tools would strand PE and CC.** "Dead ends removed" means: Cotality tools and copy fail-closed; ICC demo key cannot call them; health does not call retrieval 404 ok. It does not mean delete `generate_property_brief`. Containerize by product-key allowlist.

**F5. IPMC is zero sections (G-41 LIVE).** PoC entitles IBC2018P6 and IPMC2018P2. Demo that claims "the two PoC books" without IPMC is a lie. IBC ingest is real (July verify: 4,825 sections + 3,904 cross-refs; re-count live). IPMC ingest is an atoms `--apply` and is blocked while L26 holds the lease. Card must either wait for L26 quiet to ingest IPMC, or demo IBC-only with a written ICC-facing caveat. Recommendation: IBC-only live grade; IPMC is a named residual, not a silent skip.

**F6. ICC ingest is an atoms write.** Code-section atoms live on hauska_mcp. L26 holds the bulk-writer slot. G-30 stamp/backfill may be a column update; IPMC ingest is `--apply`. Do not start a second atoms writer. G-30 fix that is a code change plus a bounded UPDATE of ICC rows is allowed if it is not a bulk drain and is announced. IPMC `--apply` waits.

**F7. Inbound meter exists; dollars do not.** July verify: per-reference meter live, rate null, actor reference heuristic. Demo story 75n requires: hard `sourceActorDid` + book_id + section_id, platform-internal stamp, a named per-reference rate on the fixture, a visible accrual. Outbound Circle share is not this demo.

**F8. 2026-07-04 demo was two screens: brief extension + Command Center meter.** Operator wants complete plan-review Vercel + finished MCP + ICC activity portal. PE ICC citations stay off. CC is not the portal. `/icc/activity` on `plan-review-app` is. Amends the 2026-07-04 play on format only.

**F9. Public Vercel + ICC body = license violation.** UI must require a demo key. MCP anon must not receive ICC section bodies. Display is citation + heading + our analysis + optional subsection, never full verbatim body (already held in extractor; keep it).

**F10. REVERSED by operator 2026-08-16 (WDLL A-003).** First pass cut F5/F6/F7/E6/letter as "not the ICC story." Operator: plan review must look complete from a functionality standpoint. Two-engagement library, code library, briefing, map, and decision letter are in. IPMC remains typed absence, not a fake book. Applicant portal / Bluebeam / visual design stay out (already out in spec 48).

**F11. Fixture was unnamed.** A planner will pick a random APN and a mock corpus. Lock: parcel `48021:28286`, project type `new-single-family`, books IBC2018P6 (required) / IPMC2018P2 (residual), files room on Smart Files tenant `icc-demo`.

**F12. Morning drafts split Lane C from Lane D.** Operator fused them. One WDLL. Three containers (plan-review app, MCP gate, ICC compliance). Shared legs named. No private stubs.

**F13. Persona strings in the pending decision would fail Smart Files isolation.** `empressa/reviewer` plus `icc/observer` are two tenants. G-59: Nick/Empressa does not see Acme rooms. Lock both actors on tenant `icc-demo`. Share token is a backup read path, not the MCP observer list.

## What survives from the morning drafts

Cotality is extinguished in F2. Catalog path must work. One MCP server. Smart Files stays isolated (already live). No L26 steal. No second MCP. No CC checkout. No customer-facing ICC until SaaS. Typed absence. Edition identity (BDC, not repealed B3). Adjudication write is engine ingest; MCP reads it back.

## Verdict

Morning Lane C WDLL: **right functions, wrong housing.** Morning MCP WDLL: **wrong altitude (buyable gate).** First ICC-program pass: **wrong function cut (stubbed F1-F7) and wrong MCP altitude (allowlist toy).** Successor WDLL restores complete functions + finished MCP + activity portal. Housing stays Smart Files-shaped. Honest recon stays as input.

Containers filed: `_inbox/2026-08-16_blueprint_plan_review.md`, `_inbox/2026-08-16_blueprint_mcp_icc.md`, `_inbox/2026-08-16_blueprint_icc_compliance.md`. Pickup `_inbox/2026-08-16_icc_demo_planner_pickup.md`. Walk `_inbox/2026-08-16_icc_demo_walk.md`.
