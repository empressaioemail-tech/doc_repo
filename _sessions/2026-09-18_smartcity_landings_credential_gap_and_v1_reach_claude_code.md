---
id: 2026-09-18_smartcity_landings_credential_gap_and_v1_reach_claude_code
title: "Session: Bastrop made the proving pack, G-159 and G-154 landed, and one missing credential found behind every Bastrop proof"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: planning
status: closed
agent: claude_code
repo: doc_repo
owner: nick
seat: integration (SmartCity planning agent, design build and DigitalOcean migration)
programs: [OPS-17, OPS-25]
memory_graded: [shell-strings-strip-regex-backslashes:HELPED, digitalocean-deploy-runs-stale-commit:HELPED, doc-repo-concurrent-commit-hazard:HELPED, dirty-tree-close-gate-inspects-command-string:HELPED, dispatches-are-compiled-not-authored:HELPED, integration-seat-owns-no-product-repo:HELPED]
rolled_up: false
related:
  - _sessions/2026-09-18_smartcity_design_build_and_do_cutover_claude_code.md (the first half of this session)
  - _inbox/2026-09-18_HANDOFF_smartcity_planner.md (start here next time)
  - _inbox/2026-09-15_roadmap_reconciliation.md (the living roadmap)
  - _design/SMARTCITY_TRACKER.md (generated)
  - _decisions/2026-09-18_bastrop_is_the_proving_pack.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md (A-146 to A-148; G-159, G-161, G-162)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md (D-13, D-14)
snapshot: doc_repo main f7870420 before this close's commit; smartcity-dashboards main 7267c3f; smartcity-os main a400f7be; dolphin-app serving 3d3ec62 (D-12 read-back, confirmed from outside 2026-09-18); read around 15:30Z
---

# Session: Bastrop made the proving pack, G-159 and G-154 landed, and one missing credential found behind every Bastrop proof

This is the second half of the 2026-09-18 SmartCity planning session. The first half, through commit
`9e63f94c`, is in `_sessions/2026-09-18_smartcity_design_build_and_do_cutover_claude_code.md`.

## What the operator ruled

The first builds of the approved designs landed on `template-city`, the demo pack, instead of on
Bastrop. The operator said the designs were meant to be implemented against Bastrop's live data, much of
which is already wired. The operator approved the plan that followed in full. **Bastrop is the proving
pack.** The v1 finance data is bridged to v2, and the template-city default is fixed. G-156's "honest
full shape" stands until the bridge lands. The planner recorded it as
`_decisions/2026-09-18_bastrop_is_the_proving_pack.md` and OPS-17 A-146.

The ruling now leads the program preamble compiled into every OPS-17 dispatch. The root cause was the
preamble itself: three August directives told lanes to build on `template-city`, and the preamble states
that it wins on scope.

## What moved

A-146 and A-147 carded the finance bridge (G-159) and the live Development services correction (G-154),
and found two OPS-25 rows on the way. D-13: the dashboards read every Bastrop feed from the GCP copy of
v1. D-14: `walrus-app` builds from a side branch. A-147 corrected the planner's own claim that G-154
needed four grants, since MyGov is granted at the kind level.

The roadmap was rewritten as a living document. `scripts/govtech/smartcity-tracker.mjs` now generates
`_design/SMARTCITY_TRACKER.md` from the plan of record and every lane close, and refuses when a row
disagrees with its close. On its first run it found G-134 still reading OPEN against its own close.

Then both lanes landed. **G-159 is CLOSED-PARTIAL.** Its pre-registered falsifier fired and changed what
shipped. The BNP leg answers with Bastrop's 12 budgets, and the operator's capture reproduces to the
digit. The v1 REST leg answers with 32 entities, none of them Bastrop's, so no route was built on it.
Four v1 routes are on `smartcity-os` `main` (`a400f7be`). The dashboards finance route refuses a missing
city (`53ade8a`), proven on `d12-main-uat` against the pre-fix deployment. **G-154 is merged** (`7dda6db`,
`7267c3f`). Its live `bastrop_tx` proof was not obtained.

A-148 records the reading. It also carries three dispatches (`g135-mint`, `d14-d13-v1-reach`,
`g161-never-default-a-city`) and two new rows: G-161, never default a city everywhere, and G-162, v1
finance honesty, carded behind D-14. A new preamble rule says a Bastrop proof uses only the G-135
verification key, and that a missing key makes the leg UNMEASURED rather than substituted.

## What source said that the documents did not

**One missing credential blocks every Bastrop proof on a deployed app.** A tenant-private pack answers 401
to an anonymous read. G-135 asked the substrate seat to mint a verification-scoped `bastrop_tx` key on
2026-09-15, and it was never minted. G-135's close, its checkpoints, its mint request and the credential
index had sat untracked in this clone for three days. OPS-17 still said OPEN, and G-135 was not in the
tracker's milestone map, so nothing surfaced it. The same session found six more orphaned govtech
artifacts cited by tracked canon (G-123's closes, G-128's checkpoints). All were committed at this close.

**Production is worse than `main`.** `app.smartcityos.io` runs `3d3ec62`. At that commit, the work-order
Subject cell renders the vendor's free-text title, where residents write names and phone numbers. That
was measured with a file-based instrument, with controls on both sides: `fd8562c` has the defect and
`7dda6db` does not. The pending operator call was framed as "whether real records reach every
department before department access exists". That framing was wrong. Five lenses in production already
read real records, so holding `main` back only keeps the worse surface live.

**G-159 found three things the dispatch did not anticipate.** The key named for BNP returns zero
budgets; production works only because `getBnpApiKey()` reads the other key first. Permit revenue shows
a 150 percent collection rate, because a fee is counted once per report window. On `d12-main-uat` a merge
deploys nothing, so reading the hash back right after the merge would have read the previous commit.

**DigitalOcean state could not be read from this seat.** `doctl` has no token here. Production was read
from outside instead, using G-159's recorded tell: keyless finance 400 after its fix, 200 before, and
"unknown lens" before G-156. `d12-main-uat` served as the control, and answered as recorded.

## What went wrong in the doing, and was caught

- A `sed` edit stripped the backslash from `\uFEFF` and produced `/^FEFF/`. That is the memory's trap
  again, in `sed` this time rather than `node -e`. The script was rewritten as a file.
- A quoted heredoc failed on the OPS-17 text blocks. The content was written with the Write tool instead.
- The secret scan flagged two 64-hex strings in G-123's closes. They were read masked and turned out to
  be container image digests. The scanner's controls were planted before it was trusted.
- One control in the names instrument, the officer-filter probe, did not discriminate: its result was the
  same on both control commits. It was dropped from the claim, not reported.

## Owed by the operator

Ship `main` to `dolphin-app` (recommended). Hand-carry the three dispatches. For G-154, wait for the
verification key rather than placing the pilot key in a file. Ask Bastrop's finance owner which MyGov
fee report window is authoritative. The earlier items stand, and the roadmap carries the full list.

## In flight

Three dispatches are compiled and not sent: `g135-mint` (substrate seat), `d14-d13-v1-reach` and
`g161-never-default-a-city` (govtech seat). G-154's lane is waiting on the key. All four are laid out in
`_inbox/2026-09-18_HANDOFF_smartcity_planner.md`.

## Leave-behind

    leave_behind:
      - item: G-154 seat worktree P:\seat-worktrees\g154-dev-services-live, uncommitted CP1, CP2 and check.mjs
        owner: the G-154 lane, at its close
        plan_row: G-154
      - item: the stale D-12 lane claim d12-dashboards-do-cutover in _catalog/lane_claims.json
        owner: the SmartCity planner
        plan_row: D-12
      - item: the bastrop_tx finance grant (G-159's leave-behind), to compile after d14-d13-v1-reach closes
        owner: the SmartCity planner
        plan_row: G-159
      - item: G-149 re-scope for DigitalOcean before dispatch
        owner: the SmartCity planner
        plan_row: G-149

## Commits

| Commit | What |
|---|---|
| `96aa316b` | A-146: Bastrop is the proving pack; the preamble fixed |
| `bdfb0b69` | G-159 and G-154 compiled; D-13 and D-14 carded |
| `e9a9064a` | the living roadmap and the generated tracker |
| `f7870420` | G-159's lane artifacts merged from its seat branch |
| this close | A-148, G-161, G-162, the preamble credential rule, three dispatches, the roadmap, the tracker, the orphaned G-123, G-128 and G-135 artifacts, the snapshot's SmartCity lines, the handoff |
