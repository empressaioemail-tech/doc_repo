---
id: 2026-08-19_lane_b_g89_g88_design
title: Session — Lane B, the flash dies and three instruments get caught not looking
status: active
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-19_lane_b_close,
    _inbox/2026-08-18_g88_design_into_apps_WDLL,
    _inbox/2026-08-19_g88_item10_walk_is_vacuous,
    _inbox/2026-08-19_finding_green_ci_plus_clean_is_not_a_merge_gate,
  ]
---

# Session 2026-08-19: Lane B, three cards

Operator dispatched three cards in one session, any order, with the operator QA-checking at the end rather than between them. Three executors were fanned concurrently, each in its own fresh clone. Three PRs merged, one deploy verified live, one design-system bundle re-synced, three plan rows added. Two of the eleven WDLL items are held rather than done, and that is stated here because scaling a card down is not a call to make quietly.

## What shipped

**G-89, the lens flash, is dead and deployed.** Dashboards PR #23 merged squash `ecfae70`, deployed as a no-traffic canary, smoked, then shifted to `smartcity-dashboards-00021-yap` at 100 percent. An inline classless script in the head resolves the query string before the parser reaches the body and stamps three attributes on the root; the stylesheet keys visibility off those. The flash is structurally impossible now rather than merely faster.

The acceptance is a thirty-target browser walk with the request for `app.js` aborted at the route level, which reproduces the pre-paint state with no timing race. On the old revision the correct lens painted on two of thirty targets, and the distinct visible set across all twenty-eight failures was exactly `lens-city-manager`. On the new one it is thirty of thirty. The settled render is unchanged: diffing the unblocked walk target by target shows zero of thirty surfaces differing in visible lens, basis count, state count, DOM id count or pill text, which is what a first-paint fix ought to look like. Nine of nine edge cases hold on the deployed surface, including an unknown lens falling back to Overview rather than painting nothing, and scripting disabled reaching exactly one of fifteen sections, identical before and after, because the hide rules gate on the attribute's presence rather than its value.

**G-88 item 4, the recount, is 139**, and it reconciles the three estimates that failed. The scoping investigations predicted 117, 128 and 138 by three different methods and all three were wrong. The measured number is 109 plus 19 for the three named families plus 11 for the finding family, where the eleventh token is the meter fill `f` — which the CSS-families investigation flagged in a parenthesis and then dropped from its own headline. The whole discrepancy lived between a parenthesis and a sum. Both sides were measured rather than one derived by subtraction.

**G-88 item 5 is complete in both halves.** Nine components wrap all thirty new classes, taking the kit from 73 to 82 components and 73 to 82 previews with coverage restated as 139 of 139. Kit PR #7 merged squash `d6bd9a1`. The bundle was rebuilt, validated at 82 of 82 previews rendering cleanly, and the delta re-synced to the Design project: 45 files added, 5 changed, none removed, 226 kilobytes, sentinel first and alone, three chunks sized by bytes, the remote listed and reconciled before the anchor was armed, and `_ds_sync.json` written last in its own call. Zero write failures, zero retries. The project went from 417 files to 462 planner-managed plus two the app generates.

**G-88 item 7, the item with no instrument behind it, is merged** as Dashboards PR #24 at `e111552`, 219 tests green. Its number is the justification for the card existing: thirty-two of the seventy addressed ids can be deleted from `index.html` with the entire pre-existing 199-test suite still passing. That was measured by seventy delete-run-restore iterations with the file hash verified, not inferred; a literal grep said thirty-six and was wrong in both directions. All six Development-services tab ids and the entire stage-escape control were uncovered.

## What was held

Items 6, 9 and 10, the design pass, are not started. The mission is drafted and compiles. Item 6 depends on item 5, which only completed at the end of the session, and dispatching a long serial design pass that could not then be supervised to completion is the nested-fan orphan trap this program already has a memory about. The card is not descoped; it is queued with its brief written.

## The thing worth carrying forward

Every executor corrected a planner figure, which is what the briefs asked for. Two of them pushed back on a planner instruction and were right. But the two defects that mattered most this session were found by planner verification after CI was already green, and both were in an instrument rather than in a product.

**A green check-run plus a clean merge state is not a merge gate.** This was demonstrated twice inside one hour, once within a repo and once across two. Merging G-89 broke PR #24 — 218 tests, 215 passing, three failing, from two pull requests that share no source file — and simultaneously invalidated kit PR #7, whose CI checks the product out at `ref: main` so its green was a fact about a world that no longer existed. Both would have shipped red on their own greens. The standing rule to merge only on the conclusion string is necessary and is not sufficient. The addition is to re-green against the current base, and for a cross-repo consumer the base that matters is every repo its CI reads.

**The addressability gate had two holes and both were found by mutating the merged tree rather than by reading it.** Its created-by-script derivation recognised `dataset` assignment but not `setAttribute`, so a runtime-stamped attribute read as missing while two others escaped only because they already exist in static markup, which is passing by luck rather than by rule. And it unioned the served documents with the bake source, so detaching an attribute from the served `index.html` alone left it green at ten passing and zero failing while the 446-element connections register lost its entire severity colouring. Both were closed by widening a derivation rather than adding an exclusion, with a pinned excused set so the derivation cannot self-heal into silence. The second fix also made `index.html` an asserted fixed point of the bake, which closes a hole the translation-boundary investigation named and nothing covered: the bake output was never byte-asserted, so a stale bake shipped and passed every test in the repo, in either direction.

Two more of the same family surfaced. The kit's injection harness carried a case labelled "vendor parity arm B" that actually exercised arm A, and arm B — the only guardrail that can see the product move, and the one that went red for real this session — had no injection at all. And `conventions.md`, which ships verbatim inside the README uploaded to the Design project, was still telling the design agent that the four families had no CSS and to draw Plan Review without them, a claim that went false the moment item 2 merged.

## What my own work got wrong

Recorded because the pattern matters more than the instances, and because three of these were mine.

WDLL item 10's acceptance walk cannot see what it is written to check. The served document is byte-identical across every lens and every pack, six URL forms returning one sha256, so "GET each surface on template-city and again on empty-city" is thirteen identical requests followed by thirteen more, and would return the same result on a redesigned build and an untouched one. I wrote that item. It is replaced with three legs, only one of which — a real browser walk — can grade a design pass.

My edge probe reported all fifteen sections visible with scripting disabled, which is indistinguishable from a catastrophic stylesheet regression. The product was never wrong. I was reading the DOM at `domcontentloaded` with JavaScript off, before the render-blocking stylesheet applied; `document.styleSheets.length` was one instead of three. Waiting for `load` fixed it and the case passes.

Three of my mutations silently failed to apply — one hit a CSS comment rather than the rule, one hit a generator rather than the served document, one used a line-feed regex against a CRLF checkout — and each produced a green result that reads exactly like a working system. A mutation that does not apply is indistinguishable from an instrument that does not fire. The habit that caught all three was echoing the byte or occurrence count the mutation claimed to change.

My behaviour-hook list in the item 7 brief was eight names and was wrong in both directions: one of the eight is read by the stylesheet rather than by any script, and three real hooks were missing. The brief told the executor to derive the list from code rather than take mine, which is the only reason it did not propagate.

## Rulings taken

The root attribute ships as `data-surface` rather than the `data-lens` the scoping row named, because `data-lens` already exists in that document on the nav anchors carrying a different value vocabulary, and two vocabularies under one attribute name is the naming trap. The G-89 fix extends to the six Development-services tabs and the three Assets tabs, because they carry the same static class and fixing only the lens axis would have left the card's own acceptance input swapping a populated table out after paint. And `rail` keeps its three meanings unrenamed, because renaming a shipped class is a product-line change across three byte-locked repos rather than a kit pull request.

## Open

The design pass, items 6, 9 and 10, with its mission drafted. The Design picker walk, still owed by the operator and still recorded as unrun, now against a 464-file bundle with the sentinel armed. `.prov.stale`, absent from every stylesheet and every component in both repos so that a stale source renders identical to a current one, rowed separately rather than folded because shipping it is a three-step cross-repo chain. The kit's counting rule and the product's counting rule, still two implementations of one rule with no divergence test. `roster-lens`, and the reader-less `data-home-table` and `data-source` hooks, folded into the design pass. And two Cloud Run generations consumed without producing revisions, observed and unexplained.
