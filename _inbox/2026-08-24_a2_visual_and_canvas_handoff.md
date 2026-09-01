---
id: 2026-08-24_a2_visual_and_canvas_handoff
title: Fire-ready pickup — A2 visual, then leftovers; canvases are the board
status: active
date: 2026-08-24
from: planner (integration, P:\doc_repo)
to: other planner / fresh agent
---

# Fire this agent

Paste the block below into a new chat in `P:\doc_repo`.

````markdown
You are the planner in P:\doc_repo.

## Seat and snapshot (declare these in your first output)

- Seat: integration. Worktree: P:/doc_repo. Branch: main. Run `git rev-parse --short HEAD`.
- Read `_STATE.md`, `MEMORY.md`, `_scratch/setback-serve-wave.md`, this file.
- Then open and keep open both canvases. They are the working board, not decoration:
  - [recalibration board](C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx)
  - [parcel public-facts deficit](C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx)
- When you finish a cut, update BOTH canvases in the same close: snapshot line, pickup callout, the row you touched, leave_behind. A status that lives only in chat is a miss.

## What the other planner just did (do not redo)

Find, peel, and hover are closed on live PE.

| Cut | Where | State |
| --- | --- | --- |
| Find situs rooftop | hauska-map #208 `db479df` | Live. Pick 17005 SIMSBROOK DR docks `48453:280239`. Photon is camera-only. |
| Stacked lot rings | #209 `80c9ad4` | Merged. |
| Hover tile fragment | #210 `57ca035` | Live on smartsite.cloud. Decision `_decisions/2026-08-24_hover_never_draws_tile_fragment.md`. Operator walk closed. Do not reopen lot line, sidewalks, mesh, or bake. |
| A2 pricing table | #211 `b6c3b61` on `fix/pe-pricing-a2-rebased` | Isolated tree `P:/tmp/hauska-map-pricing-a2` from `origin/main` `57ca035`. Seven pricing files. CI typecheck/test/encoding PASS. **Not merged. Not aliased.** Annual CTA sends `interval: year`. |
| Travis join | `_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md` | **Draft only.** Needs operator go before ingest. |

The stale property checkout `P:/seat-worktrees/property/hauska-map` `fix/pe-pricing-a2` is still dirty on #203. Do not write it. #211 is the writer.

## Your job (in this order)

1. **A2 visual.** Operator opens View pricing on the #211 Vercel preview. Comparison table, annual first, Free caption, Unlock footer, blue CTAs, numbers from `PE_PRICING`. If that pass: merge #211 and alias smartsite.cloud (planner-owned deploy). If it fails: fix on the isolated tree, do not start a second pricing branch.
2. **Red-card / search-bar** on a new isolated tree after alias. Bar said 17005, card showed 280238. Do not treat that as a CAD miss.
3. **Near-bbox 504s** after that.
4. **Travis work goes on the public-facts canvas**, not a fourth unnamed pile. Three holes already mapped:
   - Join miss 280238 → rows M02 + T48453. Draft WDLL. This is the lot-to-lot defect.
   - Travis 0% sqft / absent-verified → M13 + C01. After the join. Do not invent sqft.
   - `, TX` title vs Find street → M07 + S06. Do not copy the search bar onto the county record.
   Envelope dashed box is setbacks, not footprint (M33).
5. Reports Option D waits on the A2 visual. New isolated tree. Do not revive `feat/pe-workbench-verdict-reports`.

## Integrate Travis into the existing flows

The 2026-08-22 deficit register is the parent. The 2026-08-24 Simsbrook walk is a live instance of rows that already existed (Travis metro 0% sqft, prop_id / geo_id join, situs). Do not create a parallel "Simsbrook completeness" program. Amend T48453 / M02 / M07 / M13 when you measure. Recalibration Lane 3 pickup already points at those rows.

## Do not

- Alias #211 before the operator says the table is right
- Reopen Photon, trustedRooftop, tile-fragment hover, or rebake
- Write `P:/seat-worktrees/property/hauska-map`
- Start Travis CAMA or situs bind in the same card as the join
- Hide atom-miss
- Skip the canvas update at close

## Close

Grade the card you ran. leave_behind required. Update both canvases. Update `_scratch/setback-serve-wave.md` with a timestamped GROUND-TRUTH. Subagents do not commit. Cite P-60.
````
