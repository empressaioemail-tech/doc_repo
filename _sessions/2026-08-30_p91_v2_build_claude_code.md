---
id: 2026-08-30_p91_v2_build_claude_code
title: Session 2026-08-30. P-91 Smart Site MCP App v2: card ratified, five lanes executed, p558 and p543 serving
date: 2026-08-30
status: closed
type: session
seat: integration planner, P:/doc_repo main
continues: _sessions/2026-08-29_p91_mcp_app_deep_dive_and_build_claude_code.md
---

# What happened

The operator asked for the most complete parcels to test the app against, all behaviours sorted and the UX finalized pending the data set, and a true WDLL for the app including hover-a-line dimensions, zoning on the drawing, and flood studies; then asked whether the 2026-08-28 v2 scope was included; then said commit, spawn sub agents, manage the build through deploy.

Fixture set written from measurement (`_inbox/2026-08-30_p91_fixture_set_bastrop.md`, 28 parcels scored by a file-based probe over two node batches). v2 card written and reconciled against the 2026-08-28 scope (`_inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md`, section 7). CP1 design attacks recorded, then five lanes dispatched with the compiled preamble `v6f9d139b` and exit-bounded verification: S10 MCP server, S9 cortex, S6 drawing, S7 facts and actions, S8 board. Each return was read as a diff, attacked, and its suite rerun by the planner (CP2 in `_inbox/2026-08-30_p91_v2_build_cp.md`).

Cortex: PR #553 merged `d8dfb319`; p543 canaried at 0% and held. Panel: S8 committed `8a34f2c6`, main merged `ff36c8f0` with zero conflicts, 226/226, PR #555 opened; p558 built `a9ba50e4`, canaried on `smartsite-mcp-00065-siv`, tag health gated on `authConfigured: true`, shifted to 100%; then p543 shifted to 100% on `cortex-api-00668-cos`. Both traffic tables read by field name; both revision digests equal their registry digests. Four live calls through the planner's connector matched the wire (records in `_inbox/2026-08-30_p91_p558_deploy.md` and the Shift section of `_inbox/2026-08-30_p91_p543_deploy.md`).

Regression found by S8's fixtures: since p555 an unresolved screen row bound to its own uuid and painted an Open button; fixed on p558. Named on the card, in the CP file and in the close.

Also this session: the Smart Site mark tile moved to ink (`#323234`) across Property Explorer and the MCP card (PR #315 merged `a275a459`, deployed), and the data-agent prompt on null typed-absence facets was handed over (`_inbox/2026-08-29_p91_p556_connect_grade_prompt.md` and the QA triage).

# Decisions and rulings taken in session

Operator: no Ask Claude button (Claude holds the context); the map stays out (data lane; everything re-warms); suppress-on-null must produce value or go; the favicon tile is ink across all sites. Planner forks on the card, reversible by amendment: narrow report view, hover, zoning on the drawing, flood-study forms defined and graded when the data lane lands; not taken: Free tier, exports, N1/F9/R3 (P-92), later intake.

# What is open

PR #555 squash-merged `24553cfc` on green CI (the serving image was built from its head commit). W1 walk (`_inbox/2026-08-30_p91_p558_connect_walk_prompt.md`) grades the card. Leave-behinds named in `_inbox/2026-08-30_p91_v2_build_close.md`.

# Lessons

A wire shape no live call has exercised is a claim; one live call per shape before the fan (already in `_scratch/p91-listing-bind.md`, confirmed again by the p555 uuid binding). A mutation that passes is not a check; add the boundary fixture (S8 B4). The paired-shift order is a correctness property when two services disagree on a field's meaning during the interval.
