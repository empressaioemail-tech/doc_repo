---
decision_id: 2026-08-22_serve_ident_then_background_cover
date: 2026-08-22
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-18c_parallel_execution.md
  - 90_operations/OPS-18a_path_to_smartsite_market.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
  - _inbox/2026-08-22_p17_roads_park_pickup.md
  - _decisions/2026-08-21_all_board_parallel_execution.md
  - _decisions/2026-08-17_qa_launch_current_map.md
  - _decisions/2026-08-17_roads_exclude_harris_statewide_pbf.md
---

# Decision

Foreground is SERVE (P-49 through P-54), IDENT (P-55 / engine 356), and the DC-3 instrument (P-47 plus a live honest County Manifest), then planner-owned deploy so the operator can visually QA the map and run GTM. COVER `--apply`, including the P-17 roads remainder, parks as a background resume. Do not treat roads 254/254 as a gate for QA or GTM.

## Context

P-17 remaining-roads apply was in flight (152-county PBF drain, lease P17). Operator 2026-08-22 morning: roads is the least valuable human surface; SERVE wiring, identity, and an accurate Manifest are what unlock visual QA and GTM. A-017 already parked Harris statewide-PBF and said roads 254/254 is not a launch blocker. The 2026-08-21 all-board decision had put Wave A `--apply` in first; this decision changes that order, not the four-team split and not the one-slot law.

## Structural commitment check

Sell reasoning, not data: aligned. SERVE shows stored atoms on the parcel with provenance. A Manifest cell that cannot be scored stays `not-yet`. Do not invent a roads coverage number.

Confidence earned, not asserted: aligned. P-47 is the instrument gap. Scoring unspecified rails to go green is unearned.

Cost per jurisdiction: aligned. Stopping a nested-loop PBF drain mid-roster avoids another Harris-class week. Resume from the pickup, not from a restart of landed counties.

Dual interface: unchanged. SmartSite QA is UI-first this wave.

## Reasoning

DC-3 is the County Manifest scoreboard for statewide-uniform rails, not a roads project. Roads is one column. COVER listed P-17 first after geometry `48135` because that was queue order, not human value. OPS-16 already ranks P-17 as priority 3. `countyRailScoreCli --rail=roads` already refused `no_measurement_spec` (SS-W14), so more road atoms cannot move DC-3 until P-47 exists. Humans QA inspect and the map. Those light when SERVE copies existing families and IDENT keeps new writes bindable. COVER fill is what you run after the live surface is honest.

## Reversal criteria

Resume COVER `--apply` (roads remainder first or a named SERVE-blocked family) when the operator finishes visual QA on the deployed map and says the Manifest is accurate enough to background-fill. Reverse the park if a named QA session finds a missing layer that makes inspect un-demoable and that layer has no atoms in the gold county. Do not reverse A-017 (Harris statewide-PBF). Do not reverse one-slot `--apply`. Do not reverse S7 identified-only. Do not mint absence to close DC-3.

## Dependencies

Depends on: P-17 halt after 48371; pickup `_inbox/2026-08-22_p17_roads_park_pickup.md`. Blocks: starting 48373 or any other P-17 county until resume. Does not block: SERVE PRs, IDENT typecheck on engine 356, P-47 spec work, cortex/PE deploys.

## Counterparties

Internal. Operator owns the ruling. Integration halts the runner and deploys. Property owns SERVE. Engine owns IDENT. COVER resume is planner-compiled from the pickup.
