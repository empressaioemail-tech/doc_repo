---
id: 2026-08-16_c_wdll_lane_c_plan_review
title: WDLL — Lane C plan review (SUPERSEDED)
status: superseded
last_updated: 2026-08-16
superseded_by: 2026-08-16_icc_demo_program_WDLL
applies_to: portfolio
owner: nick
related: [90_operations/OPS-17_govtech_stack_plan_of_record, 48_cortex_reporting_plan_review_spec, 80_adrs/adr_023_cortex_reporting_repo_designation, 47_codex_plan_review, 28_mcp_first_product_design, _inbox/2026-08-16_mcp_honest_current_state]
---

# WDLL: Lane C plan review

**SUPERSEDED 2026-08-16.** Do not execute. Operator fused MCP + plan review + ICC. Successor: `_inbox/2026-08-16_icc_demo_program_WDLL.md` plus the three container blueprints. This draft hosted the UI in LDT and scoped full spec 48; both were wrong for the demo.

Date: 2026-08-16  Status: superseded
Operator approval: none (never approved)
Plan rows this card would own if approved: G-15, G-16, G-22, G-31, G-32, G-40, G-51. Does not own G-52 (Lane B consumer pass). Does not own G-50 / G-17 / G-30 (Lane D / ICC). Does not remount Smart Files on Cortex. Does not take the L26 atoms slot.

## Done looks like

A reviewer can run one live application from intake to decision letter on the white-label surface in `legacy-design-tools/artifacts/plan-review` with zero SmartCity OS session and zero mock data. Parcel resolve uses public-record, never Cotality. Every system determination cites an atom ID and a confidence object, never a bare scalar. Reviewer overrides persist as adjudication atoms and come back through MCP atom fetch. IBC/IPMC display as citations without verbatim ICC body. Bastrop UDC is navigable at section grain. Absence is typed. Code editions are declared. The seven functions in spec 48 each have a live probe. SmartCity OS is still not allowed to duplicate this logic.

This is Codex plan review as a function package (ADR-023). It is not the Hauska MCP monetization program. MCP is how an agent calls the same functions after they are true.

## Sequencing vs MCP

Lane C does not wait on Smart Files write tools. Lane C does not wait on Circle, self-serve keys, or directory listings.

Lane C does wait on a small MCP substrate check before any new plan-review tool is trusted: anonymous initialize works (already true 2026-08-16); `search_atoms` / `get_atom` / atom-chain actually reach retrieval on the serving revision (health currently reports retrieval HTTP 404 as ok); Cotality-named tools fail closed.

Do not wrap F2 in MCP while F2 still names Cotality. That would advertise a dead dependency as a product.

After G-51 (standalone gate) the existing Codex gate tools get a live re-grade and any missing F1-F7 agent calls are added on the same Hauska MCP server. That work is cited on the MCP WDLL, not invented as a second server.

## Acceptance items

1. **This card is approved and the Lane C rows it owns are named.**
   | check: this file `status: approved`. OPS-17 amendment cites this WDLL and the G-xx list above.
   | grade: [ ] | depends on: nothing

2. **G-15 live verify.** F1 through F7 probed against serving cortex-api and the white-label surface. Spec 48 is 2026-07-01; code may have drifted. Report what is live, what is UI-only, what is mock.
   | check: per-function probe artifact with URL, HTTP, and a one-line verdict. No function marked live from the spec text.
   | grade: [ ] | depends on: 1

3. **G-16 Cotality is gone from F2.** Parcel maps to a jurisdiction with zero Cotality calls. Public-record / county-gis / existing parcel-node path only.
   | check: live intake of a known Bastrop APN or parcel-node. Trace has no Cotality host. Standing decision honored.
   | grade: [ ] | depends on: 2

4. **G-22 determinations cite atoms.** At least one code section carries a system determination from atom-chain reasoning. Confidence is `{n, width, provenance}` or the current contract object, never a bare number.
   | check: F3 live. F7 "Show reasoning" renders only graph-returned steps.
   | grade: [ ] | depends on: 2, 3

5. **G-31 typed absence on code-section miss.** Never-looked, source-down, paywalled, and genuinely-absent cannot render as the same empty.
   | check: a forced miss of each class produces a distinct basis. Empty result re-enters a queue; it does not write absence.
   | grade: [ ] | depends on: 2

6. **G-32 edition identity.** Bastrop BDC (not repealed B3) is the declared edition. ICC books carry edition on the citation. Fallbacks are named, counted, and marked.
   | check: a B3-shaped read is unreachable or marked superseded. ICC citation shows year plus book plus section, no verbatim body.
   | grade: [ ] | depends on: 2

7. **G-40 Bastrop UDC depth.** F6 navigates Bastrop own code at section grain inside the review flow.
   | check: live F6 walk on a Bastrop UDC section. IBC 2018 and IPMC 2018 navigable by chapter/section or a written out-of-scope ruling for IPMC zero-sections (G-41 is Lane D).
   | grade: [ ] | depends on: 4, 6

8. **F4 write-back.** Reviewer override persists as an adjudication atom on hauska-engine via the ingest API (spec 48: not via MCP write). accessPolicy inherits from the code section atom. Retrievable via MCP `get_atom` after write.
   | check: write then MCP read of the same atom DID. ICC-derived sections stay platform-internal until G-30/G-50.
   | grade: [ ] | depends on: 4

9. **F1 / F5 queue and findings library.** Queue buckets by stage with correct counts. A finding saved in engagement 1 is retrievable by code section in engagement 2. Canned findings populate the text field.
   | check: two-engagement live walk, no mock.
   | grade: [ ] | depends on: 4, 8

10. **E6 map compose.** F2 centers the shared hauska-map floating map on the parcel. F3 updates overlays in place. The renderer is not rebuilt.
    | check: live screenshot-grade or bundle proof that the map package is composed, not forked.
    | grade: [ ] | depends on: 3

11. **G-51 standalone gate.** Spec 48 overall criteria 1 through 7 pass with zero SmartCity OS session. End-to-end one application, live spine, no mock.
    | check: `_inbox/2026-08-16_c_lane_c_standalone_gate.json` (or the dated close this card names). Dirty `P:\legacy-design-tools` is not the vehicle. `P:\smartcity-os` is not touched.
    | grade: [ ] | depends on: 3, 4, 5, 6, 7, 8, 9, 10

12. **Honest close.** Names what G-52 still is (Lane B). Names that MCP monetization is a different card. Does not claim G-53. Does not claim ICC SaaS. Does not claim PE or Smart Files is plan review.
    | check: close JSON filed. Thesis ledger entry if adjudication write-back landed.
    | grade: [ ] | depends on: 11

## Out of scope

SmartCity MyGov consumer pass (G-52). Applicant portal. Bluebeam host mode. Visual design. G-11 city-staff login product (reviewer identity stays a cortex-reporting session per spec 48). Smart Files rooms. L26 / atoms `--apply`. Second MCP server. Circle / VDA. Directory listings. Remounting Command Center Smart Files.

## Amendments

None. Draft.

## Finish card (graded at close)

Empty until close.
