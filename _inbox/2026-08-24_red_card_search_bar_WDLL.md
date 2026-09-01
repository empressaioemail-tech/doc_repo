---
id: 2026-08-24_red_card_search_bar_WDLL
title: Red-card / search-bar / subject-store identity
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (go on red card with sub agents)
operator_visual: approved 2026-08-24 (red card approved; copy revision later if warranted)
live: hauska-map #217 squash ec36da5; bundle on smartsite.cloud after alias
diagnosis: _inbox/2026-08-24_stacked_paint_diagnosis.md section 6
leave_behind_from: _inbox/2026-08-24_hover-fs_close.json
---

# WDLL: Red-card search bar and subject store

Operator go 2026-08-24. Isolated hauska-map tree only. Do not write `P:/seat-worktrees/property/hauska-map`.

The live lie: Find `17005 SIMSBROOK DR`, then click a neighbor. The inspect card shows `48453:280238` (or another lot). The search bar still says 17005. That is not a CAD miss and not Travis join. 280238 having no `cad_property` row is Lane 3 (`_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md`).

Mechanisms already named in the diagnosis: SearchBar holds local `value` with no writer on map click. `setSubjectByParcelNodeId` is last-resolve-wins. A late Find still calls `inspectInPlace` and flies the camera.

## Done looks like

After a map click, the Find bar, the inspect card, and `subjectStore.currentParcelNodeId()` name the same parcel. A slower earlier resolve cannot overwrite a later click. A Find that is still in flight when the user clicks another lot does not snap the card or camera back. Find of 17005 SIMSBROOK DR still docks `48453:280239`.

## Acceptance items

1. **Search bar follows the subject.** A map click that adopts a parcel rewrites the Find input to that parcel's present situs, or to the parcel node id if situs is not present. It never keeps the previous Find string. Typing in a focused input is not yanked. | check: SearchBar / ExplorerMap test; violate "click neighbor, bar still 17005" | grade: [met] tests; live bundle carries subjectDisplay

2. **Subject store is generation-guarded.** Two in-flight `setSubjectByParcelNodeId` calls: the later call wins even if the earlier resolve finishes last. The stale call does not `set()`. Failed and unplaceable resolves still leave the standing subject. | check: subject-store.test both directions, including an explicit not-vacuous late-first-finishes case | grade: [met] race test + violation on last-write-wins

3. **Late Find cannot snap back.** If a map click (or a newer Find) commits after `runParcelLookup` started, that lookup does not `inspectInPlace`, does not `rebindProperty`, and does not `resolveSubjectAndFit`. | check: ExplorerMap / lookup test that delayed Find loses to a click | grade: [met] lookup-intent + gated inspectInPlace

4. **Find identity stays green.** Pick / raw Find of `17005 SIMSBROOK DR` still docks `48453:280239` with rooftop. Photon remains camera-only. | check: existing rooftop-pick / Find suites | grade: [met] parcel-lookup / search-landing / situs-pin still pass

5. **Card and store agree after click.** After adoptSubject for parcel B, `inspectedRef`, the rendered card, and `subjectStore` are B. Parcel A's slower sheet cannot paint A's card or A's subject. | check: adoptSubject race test or store+card fixture | grade: [met] store race + adoptSubject kind !== subject; operator walk owed

## Do not

- Treat 280238 thin CAD as this card. That is Travis join.
- Copy the Find string onto CAD situs (M07).
- Replay countyRing, chase near-bbox 504s, persist layer toggles, or strip `, TX` in the card title.
- Touch Photon / trustedRooftop / tile bake / hover feature-state.
- Start 3b checkout or write cortex.
- Write the property hauska-map checkout.

## leave_behind

- item: facets red-on-single-transient (one 404/5xx paints red)
  owner: later PE card
  plan_row: P-60
- item: seal-lifecycle countyRing replay / swallowed feature-state clear
  owner: later PE card
  plan_row: P-60
- item: retrieval near-bbox 504s
  owner: later service card
  plan_row: P-60
- item: Travis identity-join 280238
  owner: `_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md`
  plan_row: P-60
