## Mission: P-90 engine PDF honesty (X-ray and Flood & Drainage)

Repo: `hauska-engine` only, `packages/engine-core/src/site-plan/pdf/`. Isolated worktree from `origin/main`. Do not write `hauska-map` except a probe. Do not write `hauska-mcp-server`.

**Gate.** This dispatch may be compiled and prepared, but do not START code changes until `_inbox/2026-09-03_p89_gate_reverify_close.json` is superseded by a new close naming P-89 customer-done in full (P-115 closing). If you are reading this before that close exists, stop and report rather than proceeding — this is the same gate this thread has already caught a near-miss on twice.

### Done looks like

A generated Flood or X-ray PDF on the live engine is a verdict packet, not a hollow dump. Cover and footer title the address, not the parcel id. One site-plan sheet is appended. Black UNAVAILABLE chips are absent from aerials and bound sheets specifically. The forwarded `liveViewUrl` is printed on Flood and X-ray bytes. Direct engine GET `/dossier-export/download` of a stored hollow refuses the same way MCP does. X-ray refuses a live buildable-envelope percentage the same way `get_smart_site` does (`atom_path_pending` / `envelope.kind: "not-derived"`). Grade is live PDF bytes for at least two parcels including `48021:34161`. PE viewer is already pdf.js; do not rebuild it.

### Acceptance items

1. **P-89 gate.** Serving Hauska MCP already refuses hollow refresh and hollow download. Check: the P-89/P-115 close names serving revision, digest, request ids, and timestamp — already satisfied by the time you read this, per the gate note above.
2. **Verdict packet.** `emitPdfDossier` (and the assembler it calls) prints an X-ray verdict like the flood study: short headline metrics, dated briefing, own content as the bulk. Check: live PDF for `48021:34161`.
3. **One site-plan sheet.** Exactly one site-plan sheet is appended. Check: page count and sheet title on the same packet.
4. **No UNAVAILABLE chips.** Aerials and bound sheets do not print black UNAVAILABLE chips. Check: read the bytes.
5. **Live-view printed.** `liveViewUrl` is on the engine dossier refresh type (today the body strips that key) and is printed on Flood and X-ray PDF bytes from the forwarded URL. Check: refresh with a known `https://smartsite.cloud/share?g=` URL; the string appears on the PDF.
6. **Address title.** Cover and footer use the situs address, not `PARCEL … NO ADDRESS` and not the parcel id as the title. Check: `48021:34161` and one other parcel.
7. **Engine hollow download refuse.** Direct engine GET `/dossier-export/download` of a stored hollow (`verdictIncluded` false or `briefFactCount` 0) refuses and does not stream `%PDF`. Check: violate by requesting a planted hollow; read the table/store, not only the response.
8. **Envelope refuse.** X-ray does not print a live `deriveBuildableEnvelope` lot percentage. It refuses the same way `get_smart_site` does. Check: a parcel that would otherwise show a percent; the PDF does not invent a number.
9. **Violation suite.** Each refuse and each print claim is shown to fail on a known violation before it is reported working. Deploy engine after merge. Grade on live bytes, not a merged PR.

### Out of scope

Hauska MCP code (P-115 handles that separately, substrate seat). PE viewer rebuild. W8 Site Constraints. Stripe. Feasibility or Comparison generate. P-32 assembler. Valuation. Factory. P-114 (brand mark + formatting polish) — a separate card touching the same `render.ts` header block; coordinate rather than collide if both are in flight, planner sequences at dispatch time.

### Source

Full WDLL: `_inbox/2026-08-28_p90_engine_pdf_WDLL.md`. Operator approval and gate history: `_decisions/2026-09-03_p90_approved_gate_still_open.md`.
