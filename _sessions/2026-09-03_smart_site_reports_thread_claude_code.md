---
date: 2026-09-03
topic: Smart Site reports thread — surface inventory, display-vocabulary drift, feasibility plan located and its freeze explained, P-90 surfaced as the unblocked prerequisite
agent: claude_code (planner)
plan_row: P-90 (WDLL draft, unopened), P-32 (SCOPED, do not start), P-91 (context only)
memory_graded: none
related:
  - _inbox/2026-09-03_report_vocabulary_and_surface_findings
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT
  - _inbox/2026-08-28_p90_engine_pdf_WDLL
  - _inbox/2026-08-12_RPT1_existing_report_surface_inventory
  - _decisions/2026-08-27_report_sku_feasibility_comparison_brief
---

# Session: the reports thread, and the card that was already waiting

## Summary

A discussion thread, not a build. The operator opened it to talk about Smart Site reports
themselves, explicitly scoping MCP delivery out because another agent holds that, and
asked for the more comprehensive feasibility study plan set up a few days earlier.

Three things came out of it. The feasibility plan was located and its current state
established, which is that it is approved and deliberately frozen. A code read of the two
product repos found that the report display vocabulary is declared in three places rather
than the one the courier card assumed, with two shipped defects in the very facet the
unifying module was built to protect. And P-90, the engine PDF honesty card, surfaced as
the thing that should move first, having sat in draft since 2026-08-28 without being
picked up.

The findings are filed as their own doc at
`_inbox/2026-09-03_report_vocabulary_and_surface_findings.md` so they are citable
independently of this summary.

## Snapshot discipline

The thread opened against doc_repo `24a6c37`. By the time it closed, 310 commits had
landed from other seats and the date had moved from 2026-08-30 to 2026-09-03. Every
load-bearing claim was re-verified against current state before it was written down rather
than carried forward from the earlier reads. Two of them changed, and one of those changes
would have produced a wrong report.

## What was established

**The feasibility study plan exists and is more than a sketch.**
`_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`, operator-approved WDLL with amendments
A1 to A5, rulings at
`_decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md`. It
reverse-engineers Val's 57-sheet Whitetail Ridge package from 2026-08-17 into sixteen
specced sections carrying status, tier and assembly method, plus twelve acceptance items
with named dependencies. Assembly is all reuse plus one leg: clone `dossier.ts` as a
sibling assembler under the same sheet standard, read engine-side via
`listPropertyAtomsByParcelNodeId()` rather than the MCP atom chain, fold the PE surface
into `pe-site-plan-export.ts` as a third query-param leg under the Vercel function cap.
Tiers ruled: composed package is Studio, the fifteen-dollar unlock gets the package minus
owner data and CAD-tier content, share carries what the sharer stored.

The two structurally interesting sections are the ones Val wrote by hand. Section 13
arbitrates superseded runs so a failed X-ray is marked superseded rather than appended as
a second independent no-data finding. Section 14 generates the open-items table from the
typed absences of every other section. The assembler does structurally what she did in
prose.

**It is frozen, and the freeze is right.** OPS-16 A-044 and the SKU decision of 2026-08-27
lock the report menu at X-ray, Flood, Feasibility, Comparison, and hold P-32 at SCOPED, do
not start, with Feasibility and Comparison named as not-live generate paths that must not
be pitched as live. Re-verified today: P-32 still reads SCOPED, do not start.

**The display vocabulary is declared three times, not once.** The courier card's central
claim, that the vocabulary lives only in the app so prose composed elsewhere drifts by
construction, is wrong in a way that changes the build. PE has
`buildable-display-vocab.ts`; the engine carries a deliberate dual copy under a sha256
parity lock with a parity test; and the engine's `pdf/format.ts` holds eleven fixed reason
sentences behind `isCleanReasonSentence`, a gate that already refuses `atom_path_pending`
and `declined-in-bake` and was tightened after a live sheet leaked a machine string on
2026-07-28. The failure the unscripted session found in model prose was already solved
once, on the PDF, as a gate rather than a convention. The card's V1 as written would
author a fourth copy.

**Two defects are shipped in that same facet.** `sheet-to-card-model.ts:557-564`
re-derives `buildableDisplayKind` inline instead of calling `mapBuildableDisplay`, which
the module header explicitly forbids, and the two disagree on `atom_path_pending`. The
same block sets `buildableAgreementToken` to a fact-sheet id while the baked path sets it
to a derived display token, so the instrument meant to prove cross-surface agreement can
never match across the two serve paths and a mismatch there carries no information.

**P-90 is the prerequisite nobody picked up.** The feasibility package appends the
site-plan and flood sheet sets under one renumbering, so it inherits every honesty defect
of those sheets at fifty-seven pages instead of ten. P-90 fixes exactly those: address
titles rather than parcel ids, no UNAVAILABLE chips, one site-plan sheet, live-view URL
printed, hollow download refused, no live-derived envelope percentage. Its WDLL has been
draft with approval pending since 2026-08-28 and did not move in 310 commits.

## Two corrections made during the session

**Option D is live.** The 2026-08-24 reports-dock cards grade their items "met on tree;
live leftover." Verified against the served bundle: `reports-doc-picker`,
`reports-doc-card`, both coming-soon names and `Download PDF sheet` are all present. The
operator walk is still owed; the deploy question is closed.

**A near-miss on the P-90 gate, caught by a pre-registered falsifier.** An earlier read
this session found `hauska-mcp-server-00084-mof` tagged `p89-1ae9f28` serving at 100
percent, from which the natural conclusion was that P-89 was customer-done and P-90 was
unblocked. Re-read at close: traffic is 100 percent on `hauska-mcp-server-00055-8pz`,
tag `g111-fix`. The lower ordinal reads as a rollback. It is not one. Creation timestamps
prove `00055-8pz` is dated 2026-09-02 and `00084-mof` 2026-08-28, so the serving revision
is the newer deploy despite the smaller number. Cloud Run revision ordinals are not a
chronology for this service.

The honest position that survives: P-89's deploy state cannot be inferred from revision
lineage in either direction, because the `g111-fix` tag does not establish which ref was
built. The instrument that settles it is the one P-90 item 1 already names, a live refuse
probe by violation against the serving surface, and it is unrun.

That is the second time in this operation that a convenient revision read nearly became a
reported fact. The rule that saved it was stating the falsifier before running the check.

## What was NOT done, deliberately

No OPS-16 amendment row was written. The v3 WDLL notes the commit-freeze premise dissolved
on 2026-08-31, but opening a row is a decision and this session had no operator go for
one.

No dispatch was authored. P-90 dispatches compile through `scripts/dispatch.mjs` against a
named plan row; hand-assembly is blocked by the canon gate by design.

`00_current_state.md` was not touched. Another session holds it dirty in the working tree
and the concurrent-writer hazard says do not entangle. A pointer line for this thread is
owed and is declared in the findings doc's leave-behind.

The two PE defects were not fixed. They are property-seat code and this seat does not
write that repo.

## Open, routed to the operator

P-90 approval, now that the menu is locked and the sheets it fixes are the ones a
feasibility package would append.

Whether P-85 courthouse easements becomes the acquisition path for feasibility section 11,
recorded restrictions, which today ships as an honest not-searched shell with a Smart
Files mount slot. P-85 opened after that section was specced and nothing has reconciled
them.

Whether Val's Whitetail Ridge package is still the yardstick.

## Leave behind

    leave_behind:
      - item: P-89 live refuse probe against serving revision 00055-8pz
        owner: planner
        plan_row: P-90 item 1
      - item: defects 3a and 3b in hauska-map (re-derive, agreement-token type split)
        owner: property seat
        plan_row: backlog, unopened
      - item: 00_current_state pointer line for this thread
        owner: planner
        plan_row: n/a (deferred, file held dirty by another session)
