---
id: 2026-06-15_cortex_chat_deliverable_polish_queue
title: Queue — Cortex chat / deliverable surface polish (folds into the chat-grounding work post-#180)
date: 2026-06-15
agent: cc-agent-C
repo: legacy-design-tools
kind: queue
status: HELD (do not fire) — sequences AFTER PR #180 (anonymous-owner isolation) is green + merged; same chat/deliverable surface + single-owner serial clone. Running queue; fold into the chat-grounding dispatch scope (or a deliverable dispatch) when the Cortex track unfreezes.
related: [_dispatches/2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding, _dispatches/2026-06-14_cc-agent-C_cortex_anonymous_owner_isolation_fix, 61_property_intelligence_master_plan]
---

# Cortex chat / deliverable polish queue

> Running list of side-chat + deliverable-letter improvements surfaced from real client use (the 146 S. Fredericksburg duplex feasibility study). All HELD behind PR #180 (the live data leak fix) and serialized on the single-owner legacy-design-tools clone. Fold into the chat-grounding dispatch scope (or a dedicated deliverable dispatch) when the Cortex track unfreezes. Nothing here fires standalone.

## Items

### 1. Deliverable agent does not read the engagement's structured client/contact fields
**Symptom (verified, 146 S. Fredericksburg letter, exported 2026-06-15):** the feasibility letter left `[Client Name]`, `[Firm Name]`, `[Date]`, `[Project Number]` as literal placeholders, even though the engagement's project-details carry **Applicant Firm = "Hector Martinez"** and **Client Email = "barmar_inc@yahoo.com"** (plus the address + engagement id). The side-chat / deliverable-generation context reads uploaded documents + site context but not the structured engagement fields.

**Ask:** pass the engagement's structured project-detail fields into the deliverable/chat generation context so the letter populates them instead of placeholders:
- `Prepared for` (client) <- applicant firm / client name + client email/contact.
- `Prepared by` (firm) <- the operator firm profile (settings), if present; otherwise leave an explicit placeholder, do not invent.
- `Date` <- generation date. `Project No.` <- engagement id or a project-number field if one exists.
- Address / legal description <- already read from the survey; reconcile with the engagement address field.

**Honesty guardrail:** populate only from real engagement/firm data. If a field is genuinely absent (e.g. no firm profile set), keep an explicit placeholder — never fabricate a client/firm/license name. License number especially must never be invented.

### 2. Zoning is entirely `[unverified]` in the deliverable
**Symptom (146 S. Fredericksburg letter):** Section 5 item 1 + the red verdict — duplex-as-of-right, setbacks, FAR, height, lot coverage, parking all unconfirmed; the letter can only say "confirm with the City of San Marcos Planning Department." This is the direct symptom the **chat web-first zoning grounding** dispatch addresses ([`_dispatches/2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding.md`](2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding.md), Part B). Not a separate build — this queue entry just links the deliverable symptom to that dispatch so the letter's zoning section moves from "unverified model knowledge" to grounded + deeplinked (still honesty-gated `unverified-web-source`). Texas duplex-by-right statute applicability (the letter flags it) should be part of the zoning grounding scope.

### 3. Seismic Site Class is hardcoded "D assumed" for every parcel
**Symptom (146 S. Fredericksburg letter, Section 1 + 4):** "Site Class D assumed pending geotechnical investigation" drives the whole SDC-D cost-premium narrative. Per the robustness audit, the seismic adapter hardcodes Site Class D + Risk Category II for all parcels (a real value where Class E gives ~1.5-3x spectral acceleration). The letter inherited the assumption and presented it as a design driver. **Ask:** replace the hardcoded Site Class with a Vs30-derived lookup (or carry it explicitly as "assumed, confirm by geotech" with the honesty state). Routes to 61 Wave 2/3 subsurface (the seismic adapter fix), not the chat surface — cross-listed here because it surfaced in the deliverable.

### 4. No firm-profile source for "Prepared by"
**Symptom:** "Prepared by: [Firm Name]" + the [Architect Name]/[License No.] signature block stayed placeholders — implies there is no firm-profile/settings record the deliverable can pull the operator's firm name, architect name, license number, and contact from. **Ask:** add a firm-profile settings record (firm name, architect name + license no., address, phone, email) and wire it into the deliverable "Prepared by" + signature block. Honesty: license number is operator-entered settings data only, never inferred.

*(more items as queued)*
