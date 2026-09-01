# Mission — the gap ledger: count every cell, audit every absence

## Why

All six counties are filled (the six fill cards this depends on). The record is now the
gap analysis by construction: an unaccounted cell is countable. This card produces the
ledger that decides the reconciliation program — which gaps are data we already hold
that is unreachable/unstamped/unserved, and which are genuinely missing. READ-ONLY on
every store; the deliverable is a report.

## Deliverables

1. **The census.** county x rail x state counts over `parcel_record_cell`, verbatim SQL
   output with snapshot (store, database, timestamp). Totals must reconcile: records =
   containment counts per county (981,405 across six), cells = 52 x records exactly.
   Any parcel with != 52 cells is a defect — count them, expect zero.
2. **The not-applicable audit.** Run the module's `auditNotApplicableCells` logic (or its
   SQL equivalent) live: which rails, which population, what reason strings. The prior
   deterministic proof left an anomaly: Bastrop NA / unincorporated = 21.24, not an
   integer. Resolve it or name it a defect. Do NOT widen definitions to make the audit
   close — a bug is a better outcome than a clean number. NA outside the
   containment-unincorporated population must be ZERO; every violation listed.
3. **Measured beside derived.** Bastrop's derived claim was 864,681 cells moved on CAD
   ingest alone. Report the measured figure beside it and the delta.
4. **Publish-gate verdict per county.** Expect REFUSE everywhere — that is the honest
   baseline, not a failure. Paste the verdict and the top refusing rails.
5. **The reconciliation input.** Rank (rail x county) by unaccounted count and classify
   each material gap:
   - HOLD-ELSEWHERE (exists, unreachable/unstamped/unserved): zoning (23 cities have a
     real staged layer; 8 need stamping only; the county ledger CANNOT tell you where
     zoning is missing — it measures whether a scorer ran, and Travis serves zoning live
     while it scores 0.00%), wells (`tx_rrc_well` staged, 1.4M over 254 counties),
     special districts incl. MUD/PUD (`tx_special_district`, 1,888 MUD polygons — MUD is
     NOT a separate rail), flood (tier2 608,414 determinations dropped by
     `mergeBakedBaseFacts`; the two flood stores disagree AO vs AE — reconciliation
     BEFORE ingest), dollar fields (plumbing, not acquisition), geometry/terrain/roads
     (factory landing), permits.
   - GENUINELY-MISSING (absent at source): Travis livingArea (0 of 500,307), McLennan
     assessed + livingArea (0 at source), setbacks where only placeholders exist
     (188,103 placeholder rules; Hays and Williamson 100% placeholder — a
     placeholder-derived setback is NOT a value).
   Classification requires a catalog/source check per claim, not the ledger's word.

## Landmines

- Every count carries its denominator. Absent, zero, and unmeasured are three states.
- Do not trust the county ledger for whether zoning exists.
- Placeholder setbacks are not values. Do not source Bastrop permits from SmartCity.
- Store reads under writer load time out — run after fills close, chunk scans.
- State your snapshot in the report header.

## Close

Report at `_inbox/2026-09-01_parcel_gap_ledger.md` (markdown, prose-first, tables for the
census) plus `_inbox/2026-09-01_parcel-gap-ledger_close.json` with
`whatContradictedTheCard`, `leave_behind`, scratch block. This close is the input to the
reconciliation/acquisition carding — write it for a planner who will card directly off it.
