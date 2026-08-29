---
id: 2026-08-28_p90_engine_pdf_WDLL
title: WDLL — P-90 engine PDF honesty
status: draft
last_updated: 2026-08-28
operator_approval: pending
plan_row: P-90
---

# WDLL: P-90 engine PDF honesty

Date: 2026-08-28  Status: draft
Operator approval: pending (do not implement until Nick greets this card)
Plan row: P-90
Repo: `hauska-engine` only. Isolated worktree from `origin/main`. Do not write `hauska-map` except a probe. Do not write `hauska-mcp-server`.

Cites OPS-16 A-044. QA WDLL `_inbox/2026-08-27_smartsite_qa_program_WDLL.md` items 19, 29, 30, 31, 32, 33. Starts only after P-89 customer-done: a live refuse on the serving Hauska MCP revision. Envelope ruling B: `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`.

Dispatch after approval: `node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row P-90`. Do not hand-assemble.

## Done looks like

A generated Flood or X-ray PDF on the live engine is a verdict packet, not a hollow dump. Cover and footer title the address, not the parcel id. One site-plan sheet is appended. UNAVAILABLE chips are absent. The forwarded `liveViewUrl` is printed on Flood and X-ray bytes. Direct engine GET `/dossier-export/download` of a stored hollow refuses the same way MCP does. X-ray refuses a live buildable-envelope percentage the same way `get_smart_site` does (`atom_path_pending` / `envelope.kind: "not-derived"`). Grade is live PDF bytes for at least two parcels including `48021:34161`. PE viewer is already pdf.js; do not rebuild it.

## Acceptance items

1. **P-89 gate.** Serving Hauska MCP already refuses hollow refresh and hollow download. Check: the P-89 close names serving revision, digest, request ids, and timestamp. Grade: [ ]

2. **Verdict packet.** `emitPdfDossier` (and the assembler it calls) prints an X-ray verdict like the flood study: short headline metrics, dated briefing, own content as the bulk. Check: live PDF for `48021:34161`. Grade: [ ]

3. **One site-plan sheet.** Exactly one site-plan sheet is appended. Check: page count and sheet title on the same packet. Grade: [ ]

4. **No UNAVAILABLE chips.** Aerials and bound sheets do not print black UNAVAILABLE chips. Check: read the bytes. Grade: [ ]

5. **Live-view printed.** `liveViewUrl` is on the engine dossier refresh type (today the body strips that key) and is printed on Flood and X-ray PDF bytes from the forwarded URL. Check: refresh with a known `https://smartsite.cloud/share?g=` URL; the string appears on the PDF. Grade: [ ]

6. **Address title.** Cover and footer use the situs address, not `PARCEL … NO ADDRESS` and not the parcel id as the title. Check: `48021:34161` and one other parcel. Grade: [ ]

7. **Engine hollow download refuse.** Direct engine GET `/dossier-export/download` of a stored hollow (`verdictIncluded` false or `briefFactCount` 0) refuses and does not stream `%PDF`. Check: violate by requesting a planted hollow; read the table / store, not only the response. Grade: [ ]

8. **Envelope refuse.** X-ray does not print a live `deriveBuildableEnvelope` lot percentage. It refuses the same way `get_smart_site` does: `atom_path_pending` / `envelope.kind: "not-derived"`. Check: a parcel that would otherwise show a percent; the PDF does not invent 42% or any other live derive. Grade: [ ]

9. **Violation suite.** Each refuse and each print claim is shown to fail on a known violation before it is reported working. Deploy engine after merge. Grade on live bytes, not a merged PR. Grade: [ ]

## Out of scope

Hauska MCP code. PE viewer rebuild. W8 Site Constraints. Stripe. Feasibility or Comparison generate. P-32 assembler. Valuation. Factory.

## Amendments

None yet.
