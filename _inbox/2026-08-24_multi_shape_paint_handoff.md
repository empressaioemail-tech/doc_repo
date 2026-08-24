---
id: 2026-08-24_multi_shape_paint_handoff
title: Fire-ready pickup — peel stacked paint on Travis lots
status: active
date: 2026-08-24
from: planner (integration, P:\doc_repo)
to: fresh planner / lane agent
---

# Fire this agent

Paste the block below into a new chat in `P:\doc_repo`. Do not re-open Find.

````markdown
You are the planner in P:\doc_repo.

## Seat and snapshot (declare these in your first output)

- Seat: integration. Worktree: P:/doc_repo. Branch: main. Commit: run `git rev-parse --short HEAD` before you write.
- Read `_STATE.md`, `MEMORY.md`, `_scratch/setback-serve-wave.md`, this file, and `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md`.
- Product work is hauska-map only. Isolated tree. Do not write in `P:/seat-worktrees/property/hauska-map`. Do not open the A2 pricing branch.
- Subagents do not commit. You commit. Cite plan row P-60.

## The leftover (start here, nothing else)

Find is closed. hauska-map #208 squash `db479df`, Vercel `dpl_J2HQz9W86CezviRRYWJPZopwKUDk`, live on smartsite.cloud.

Operator 2026-08-24 ~13:48 local: picking `17005 SIMSBROOK DR` from the dropdown docks parcel `48453:280239`. Card is Travis, SF-S, F 25 / S 7.5 / R 20. Search bar holds that address. That is PASS.

The fail: multiple shapes on those lots. Yellow dashed rectangle over the house. Thin blue ring on the subject. Thin blue ring on the neighbor. This is not leftover Bastrop / Tahitian Village / Wainee paint. The leftover Bastrop card is gone. You are looking at Travis stacked composers after a correct inspect.

## What already shipped (do not relitigate)

| Cut | PR | What it closed |
| --- | --- | --- |
| Load / lots | #203 | 90s card + vanish-on-zoom. P-60e suppress is fail-open (`shouldSuppressTileParcelLines` always false). |
| Hover hit-test | #204 | Hover keys PMTiles promote id. Paint stack not retired. |
| Sheet seal | #206 | Unplaceable is honest absence. Find swaps leftover subject. |
| Photon compact | #207 | Did not fix operator dropdown. Keep as string hygiene only. |
| Situs rooftop | #208 | Address-point pick sends trustedRooftop. Photon is camera-only. Operator: "that worked finally." |

Cortex serving pin last written: `cortex-api-00571-fay` @100%. Re-read before quoting.

## Mechanism (code-read, not a vibe)

`apps/property-explorer/src/browse/ExplorerMap.tsx` `mapOverlays` stacks:

1. PMTiles parcel LINE (fail-open after #203)
2. Live GIS mesh via `toLiveOverlays` (`parcel-polygon` on by default)
3. `inspectRingOverlays` from sheet rings after seal (P-60d / #200)
4. `gatedEnvelopeOverlays` amber dashed inset or consumed dashed outline

Tile feature-state fill is supposed to demote after seal. Confirm by reading the write path. Do not add a fifth composer.

## Your job

1. Get a verbal go on `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md` (status is draft). Do not start a product branch before that go.
2. After go: isolated hauska-map tree. Inventory composers in a file (WDLL item 1).
3. Peel so one visible ring per lot, inspected lot = one ring + at most one envelope.
4. Prove the peel by violating it (item 6). A check observed only passing has not been observed working.
5. Tile-line suppress is allowed only with a paint-proof second derivation. Fetch-ok is not paint. Re-hiding lots on zoom-in is a fail.
6. Deploy is planner-owned. Operator visual on Simsbrook is the grade. Code-done is not customer-done.

## Do not

- Patch Photon labels, `compactEnvelopeAddressQuery`, or `trustedRooftop` unless this peel regresses identity
- Take situs or mesh `hits[0]`
- Work pricing / A2 / Stripe
- Tile rebake
- New map architecture
- Claim hover is still the leftover

## Files

- Scratch: `_scratch/setback-serve-wave.md` (read first)
- WDLL: `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md`
- Session: `_sessions/2026-08-24_situs_rooftop_and_multi_shape_handoff_planner.md`
- Canvas: recalibration board, pickup callout
- Prior WDLL: `_inbox/2026-08-24_lane1_situs_rooftop_pick_WDLL.md` (closed, met)

## Close schema

Grade the WDLL item by item. Leave-behind required. Update the scratch OPEN/GROUND-TRUTH with a timestamp. Do not promote memory yourself.
````

## 1. Conversation summary

This session closed the Find lynchpin. Dropdown Photon labels 422 the envelope. Pasted short address worked. #207 compacted strings and still failed the operator pick. #208 restored #191 for situs address-point rooftops only and left Photon as camera-only. Operator confirmed the pick. The next defect is stacked paint on the same Travis lots.

## 2. Decisions reached

1. Photon is not an identity writer. Owner: planner. Reverse only if a Photon row is the sole coverage and we invent a different identity path.
2. Situs address-point rooftop may ride on envelope. Generic viewport / Photon lat/lng may not. Owner: planner. Reverse if a situs point is shown to be the wrong lot.
3. Next cut is paint peel, not another lookup string. Owner: operator, verbal at session close.

## 3. Open questions

1. Which composer is the extra blue neighbor ring: PMTiles LINE, live mesh, or inspect ring leaking? Route: read `mapOverlays` and layer paint, then violate one composer at a time.
2. Is the yellow dashed box the envelope wedge (correct, keep one) or a second inspect fill (retire)? Route: compare `gatedEnvelopeOverlays` vs `inspectRingOverlays` on 280239.

## 4. Artifacts produced

- `_inbox/2026-08-24_lane1_situs_rooftop_pick_WDLL.md` — closed Find cut
- hauska-map #208 — live
- this handoff and the peel WDLL draft
- session summary
- recalibration canvas update

## 5. Stakeholder updates needed

None. Internal PE leftover.

## 6. Context for the next session

Start on stacked paint. Do not start on Find. Isolated tree. WDLL needs go. Operator screenshot is the Simsbrook block with three overlapping marks on 17005.
