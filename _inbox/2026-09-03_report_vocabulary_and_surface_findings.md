---
id: 2026-09-03_report_vocabulary_and_surface_findings
title: Smart Site report surfaces — display-vocabulary drift, two shipped defects, and the P-90-before-P-32 ordering
date: 2026-09-03
status: finding
owner: planner
plan_row: P-90 (WDLL draft, unopened), P-32 (SCOPED, do not start)
related:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _inbox/2026-08-28_p90_engine_pdf_WDLL.md
  - _inbox/2026-08-12_RPT1_existing_report_surface_inventory.md
  - _inbox/2026-08-30_smartsite_report_styling_vocabulary_courier.md
  - _inbox/2026-09-03_pe_refusal_contract_split.md
  - _decisions/2026-08-27_report_sku_feasibility_comparison_brief.md
---

# Report surfaces: where the display vocabulary actually lives

## Snapshot

Every claim below was re-verified 2026-09-03, after 310 commits landed on doc_repo
between the opening of this thread and its close. doc_repo `cb22b43`. hauska-map
`origin/main` `51b859c`. hauska-engine `origin/main` `80fb906`. Live PE bundle
`https://smartsite.cloud/assets/index-DR2e91vk.js`, 1,988,160 bytes. Cloud Run read as
JSON by field name, never through a positional formatter. Product-repo conclusions are
code reads against `origin/main`, never a local checkout.

## 1. Six renderers, three vocabularies, one gap

"Smart Site report" names six things that render the same facts.

| Surface | Artifact | Style authority | Vocabulary source |
|---|---|---|---|
| Site plan | PDF, 3+ sheets | SHEET_STANDARD_v1 and `template-tokens.ts` | engine `pdf/format.ts` |
| Flood and drainage | PDF, 2 sheets | same | same |
| X-ray | PDF, variable | same, via `dossier.ts` | same |
| PE Reports dock | on screen | PE kit, Option D picker | `buildable-display-vocab.ts`, `StatusChip`, `layer-absence` |
| MCP app panel | connector widget | its own | its own |
| Model prose brief | composed by the model from tool JSON | none | none |

The last row is the courier card's finding and it is correct. The rest of its framing is
not, and the difference changes what gets built.

## 2. The vocabulary does not live only in the panel

The courier card at `_inbox/2026-08-30_smartsite_report_styling_vocabulary_courier.md`
asserts that display vocabulary lives only in the app, so prose composed anywhere else
drifts by construction. There are in fact three declarations of it, and one pair is
already guarded by a real cross-repo control.

First, `hauska-map/apps/property-explorer/src/lib/buildable-display-vocab.ts`. Its header
states the same thesis the card rediscovered: map card, inspect and site-plan PDF must
speak one truth, and surfaces MUST call `mapBuildableDisplay` rather than re-derive. It
carries an `agreementToken` intended as the cross-surface probe.

Second, `hauska-engine/packages/engine-core/src/site-plan/buildable-display-vocab.ts`, a
deliberate dual copy under `__fixtures__/buildable-display-vocab.parity.lock.json` with a
sha256 handshake and a parity test. This is the portfolio's existing answer to exactly the
drift class the card describes.

Third, `hauska-engine/packages/engine-core/src/site-plan/pdf/format.ts`. Eleven fixed
reason sentences in `REASON`, plus `isCleanReasonSentence`: must end in a period, twelve
words or fewer, no colon anywhere, no machine-code pattern, no nested parentheses. Its own
comment records that the colon rule was added after a live sheet leaked a machine string
on 2026-07-28.

That third mechanism already refuses `atom_path_pending` and `declined-in-bake`. The
failure the unscripted session found in model prose is one this operation already solved
once, on the PDF, with a gate that fails closed rather than a convention that asks nicely.

The consequence for the card's V1 item: as written it authors a fourth independent
declaration inside MCP normalization, in a repo that has twice been burned by
hand-maintained parallel declarations, namely RPT1's MCP three atom-chain slots against
the engine's sixteen entity types, and the `has_writer` hand-declaration finding. The
cheaper and stronger move is to extend the existing parity-lock handshake to a third copy
and to port `isCleanReasonSentence` as the MCP-side refusal, which converts V1 and V3 from
a convention into a gate. That is what the card's own closing constraint argues for when
it says anything that must be true rather than likely belongs in the payload or in
server-side rendering.

## 3. Two shipped defects in the facet the module exists to unify

Both verified on `origin/main` `51b859c`, both still present.

**3a. A surface re-derives what the module forbids re-deriving.**
`apps/property-explorer/src/lib/sheet-to-card-model.ts:557-564` computes
`buildableDisplayKind` with its own inline conditional rather than calling
`mapBuildableDisplay`. The two disagree on a live input: for a declined envelope carrying
`atom_path_pending`, the module returns kind `loading` and paints "Loading buildable
area", while the sheet path returns `pending`. The string `Loading buildable area` is
present in the served bundle, so the module's branch is live and the disagreement is not
theoretical.

**3b. The agreement token is two different kinds of thing in one field.**
The baked path sets `buildableAgreementToken` from `mapBuildableDisplay`, so it reads
`buildable:47`, `declined-consume`, `loading`. The sheet path at
`sheet-to-card-model.ts:567` sets it to `sheet.factSheetId`. The inline comment defends
this as intentional, and on the sheet path alone it is coherent. Across the two paths it
is not: a token compared between a sheet-served surface and a baked-served surface can
never match, so a mismatch there carries no information. The instrument built to prove
cross-surface agreement is vacuous exactly at the seam where the two serve paths meet.
This is a presence-shaped check wearing a meaning-shaped name.

Neither is a fabrication defect. Both are legibility and instrument defects, the same
class as the split recorded the same day in
`_inbox/2026-09-03_pe_refusal_contract_split.md`, where seven fact families carry a
refusal type that structurally cannot hold the authority, scope, asOf and basis chips a
Doc-19 layer absence carries. Read the two findings together: the product has at least
three honest-absence shapes of unequal richness, and nothing reconciles them.

## 4. Ordering: P-90 before P-32

The feasibility study spec at `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md` is an
approved WDLL with sixteen specced sections and twelve acceptance items, rulings recorded
at `_decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md`. It is
frozen by OPS-16 A-044 and the SKU decision: P-32 stays SCOPED, do not start, and
Feasibility is not a live generate path and must not be pitched as one.

The freeze is correct and should hold, for a reason the cards do not yet state. The
feasibility package is defined as a composed document that appends the site-plan and flood
sheet sets under one renumbering. It therefore inherits every honesty defect of the sheets
it appends, at fifty-seven pages instead of ten. P-90 is the card that fixes those sheets:
address titles instead of parcel ids, no UNAVAILABLE chips, exactly one site-plan sheet,
the live-view URL printed on the bytes, a direct engine download of a stored hollow
refused, and no live-derived envelope percentage that the MCP surface already refuses.

The ordering argument is therefore: do not compose a bigger document out of sheets that
are not yet honest. P-90 is the prerequisite quality bar for P-32, not a parallel nicety.

`_inbox/2026-08-28_p90_engine_pdf_WDLL.md` has been draft with operator approval pending
since 2026-08-28 and did not move in the 310 commits since.

## 5. What is NOT established about the P-90 gate

P-90 item 1 requires P-89 customer-done, meaning a live refuse on the serving Hauska MCP
revision, not a merge.

Read 2026-09-03: `hauska-mcp-server` serves `hauska-mcp-server-00055-8pz` at 100 percent,
tag `g111-fix`, and that revision is also `latestReadyRevisionName`. It was created
2026-09-02T18:01:20Z. The revision carrying the P-89 merge, `00084-mof` tagged
`p89-1ae9f28`, was created 2026-08-28T01:16:35Z and no longer holds traffic.

A trap worth recording, because it nearly produced a wrong report in this session. The
serving revision carries a LOWER ordinal than the one it replaced, which reads as a
rollback and is not one: creation timestamps prove `00055-8pz` is the newer deploy. Cloud
Run revision ordinals are not a reliable chronology for this service. Read
`creationTimestamp`, never the name. The falsifier was pre-registered before the check ran
and it fired, which is the only reason the wrong reading did not ship.

What follows is that P-89's deploy state cannot be inferred from revision lineage in
either direction. PR #77 merged to main on 2026-08-28 and a 2026-09-02 deploy from main
would carry it, but the `g111-fix` tag does not establish which ref was built. The correct
instrument is the one P-90 item 1 already names: probe the serving surface for the refuse
directly, by violation. That probe is unrun and is the first thing P-90 needs.

## 6. Stale records this corrects

The 2026-08-24 reports-dock cards grade their acceptance items "met on tree; live
leftover." That is stale. Option D is live: `reports-doc-picker`, `reports-doc-card`, both
coming-soon names (Feasibility, Comparison report) and `Download PDF sheet` are all
present in the served bundle. The operator walk those cards owe is still owed, but the
deploy question they were holding open is closed.

## 7. Open, routed to the operator

Three questions were put in session and none answered. Whether P-90 is approved now that
the report menu is locked and the sheets it fixes are the ones feasibility would append.
Whether P-85 courthouse easements becomes the acquisition path that fills feasibility
section 11, recorded restrictions, which currently ships as an honest "not searched" shell
with a Smart Files mount slot, given P-85 opened after that section was specced. And
whether Val's 57-sheet Whitetail Ridge package is still the yardstick the spec is measured
against.

## Leave behind

    leave_behind:
      - item: P-89 live refuse probe against serving revision 00055-8pz
        owner: planner
        plan_row: P-90 item 1
      - item: defects 3a and 3b (sheet-to-card re-derive, agreement-token type split)
        owner: property seat
        plan_row: backlog, unopened
      - item: 00_current_state pointer line for this thread
        owner: planner
        plan_row: n/a (deferred, another session holds the file dirty)
