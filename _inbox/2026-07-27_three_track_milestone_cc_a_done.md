---
id: 2026-07-27_three_track_milestone_cc_a_done
title: Three-track milestone — CC-A DONE (verified live); Track B half-verified; recipe-proof running
date: 2026-07-27
status: active
owner: nick
related: [2026-07-27_CC_A_post_deploy_planner_live_verify, 2026-07-27_TRACK_B_live_after_grades, 27f_bastrop_through_v2_program, 27e_multitrack_program_structure_and_wave_plan, 90_runbooks/fleet_memory_practice]
note: 00_current_state.md prepend still owed — that file carries the export-gate agent's uncommitted edits (2 days), not the planner's to sweep; this doc is the interim durable milestone record.
---

# Three-track milestone (2026-07-27)

First time this program ran THREE genuinely parallel tracks (CC-A / Track B / recipe-proof), one reconciler (doc_repo planner), no shared-write-path collision. State:

## CC-A — DONE (verified live, closed)

The Command Center legible node/atom flow (Control-Tower parity). Verified live on cmdcenter-blush (bundle `index-BTKuoNXu.js`, confirmed not stale), all WDLL items MET, no PARTIAL:
- The LOAD-BEARING win: boundary edges were BUILT-BUT-STRANDED (persisted in StoragePort, no HTTP, no UI). CC-A un-stranded them. Retrieval `00033-wom` serves `/nodes/:id`, `/boundary-edges`, `/property-nodes/:id/boundary-edges`, `/atoms/:did`. The parcel->boundary-edge->road->neighbor graph is now SERVED and WALKABLE in the console.
- Verified on ALL THREE gold parcels with DIFFERENT real data (anti-fixture proof): 28286 boundary:2 -> road ...789 + nbr 35671; 33512 boundary:4 -> same road + nbr 33617; 34785 boundary:3 -> road 15106232 + nbr 34777.
- Structured node card (not JSON blob), atoms-by-family, property-rich inspector (confidence object N/WIDTH/BASIS never bare — boundary edge shows seed basis honestly), back-nav `return=`, node-to-node traversal, PE layered map swapped in (satellite/FEMA/contours/zoning, fork eliminated), Parcel Trace LIVE, Revenue Meter honest-DEGRADED (403 named, F1c holds).
- M0: Control-Tower port confirmed (not re-derived); smoke test promoted to mechanical guard + thesis-ledger entry.
- Why up-front was right: CC-A didn't just add a UI, it made the net-new data (boundary primitive, road nodes) REACHABLE at all. Every subsequent data wave now lands inspectable.

## Track B — HALF verified, half blocked on PE deploy

Customer-UI quality. Engine deployed (`00090-juq`, `00035-git`); map merged (`#76`); PE Vercel stale (deploy CLI-auth failed).
- B1 site-plan PDF: MET live — 34785/33512 draw the STREET (not an empty box) with approximate-assumed-per-class ROW. The long-standing empty-STREET-box bug is fixed and verified.
- B2 PDF design: MET live on 34785 (real P-5 / 13,641 sqft + GIS property-line-tags with honesty label; fixture sample correctly NOT used to grade).
- B3 M0: MET — dual-repo vocab-mapper drift risk promoted to a mechanical sha256 identical-copy parity guard (can't drift).
- BLOCKED (PARTIAL): B1 map overlay + B3 surface agreement — PE card still "buildable % pending" because PE hasn't redeployed. Blockers are PLANNER-OWNED: (1) PE deploy CLI-auth failure (fix deploy hygiene, `vercel link --project`); (2) `attaching-roads` proxy 403 (app-level auth/key/env — would block the overlay even post-deploy; diagnose root). Neither escalates to the operator — deploys are planner-owned (new standing rule).

## Recipe-proof (Caldwell #2, Hays #3) — running

The CTX gate. Measures how much of the Bastrop mold generalizes vs re-opens figuring-out (a measurement, not pass/fail). Not yet reported.

## Standing rule promoted this milestone (M0)

DEPLOYS ARE PLANNER-OWNED, NEVER ESCALATED TO THE OPERATOR. The operator does not deploy (not in scope; agents deploy routinely). A check-in must never say "operator action: redeploy"; a failed deploy = "failed on X, fixing X." Added to `90_runbooks/fleet_memory_practice.md` standing scope rules + auto-memory. (Prompted by CC-A "stuck auto-deploy" + Track B "CLI auth failed" both being mis-routed to the operator; the CC-A planner correctly owned and fixed its own deploy — the model.)

## Where next

- Track B closes when PE redeploys (planner-owned) + the road-proxy 403 is fixed, then live PE re-probe (card real %, road overlay draws).
- Recipe-proof closes with the Caldwell generalization number.
- CTX HELD until Bastrop market-ready + recipe proves on #2-3.
- Owed: 00_current_state prepend once the export-gate agent's stale edits clear.
