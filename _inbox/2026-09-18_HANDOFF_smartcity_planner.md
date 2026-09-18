---
id: 2026-09-18_HANDOFF_smartcity_planner
title: "Handoff: SmartCity planner, after G-159 and G-154 landed"
date: 2026-09-18
last_updated: 2026-09-18
kind: handoff
status: active (supersedes _inbox/2026-09-17_HANDOFF_smartcity_combined.md as the starting page)
owner: nick
programs: [OPS-17, OPS-25]
related:
  - _inbox/2026-09-15_roadmap_reconciliation.md (the SmartCity roadmap; read second)
  - _design/SMARTCITY_TRACKER.md (generated live status)
  - _decisions/2026-09-18_bastrop_is_the_proving_pack.md
  - _sessions/2026-09-18_smartcity_landings_credential_gap_and_v1_reach_claude_code.md
snapshot: doc_repo main at the commit that carries this file; smartcity-dashboards main 7267c3f; smartcity-os main a400f7be; read 2026-09-18 around 15:30Z
---

# Handoff: SmartCity planner

You are the planning agent for SmartCity: the design build in `smartcity-dashboards` and the SmartCity
rows of the DigitalOcean migration (OPS-25 D-12 to D-14, then D-20). You work in `P:\doc_repo` on `main`.
You own no product repo. Your deliverables are compiled dispatches, verification at source, and the plan
of record kept true. Dispatches are compiled with `node scripts/dispatch.mjs --plan <OPS-17 or OPS-25>
--lane <id> --plan-row <row> --mission-file <path> --repo <repo>`, never written by hand.

## Read, in order

1. This page.
2. `_inbox/2026-09-15_roadmap_reconciliation.md`, the roadmap: milestones, order, blockers, what is owed.
3. Run `node scripts/govtech/smartcity-tracker.mjs` fresh. It regenerates `_design/SMARTCITY_TRACKER.md`
   and exits 1 when a row disagrees with its own close. Run it after every landing.
4. `90_operations/OPS-17_govtech_stack_plan_of_record.md`: amendments A-146, A-147 and A-148, then rows
   G-135, G-154, G-156, G-159, G-161 and G-162.
5. `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md`: rows D-12, D-13 and D-14, and rules 3
   and 9 to 14.
6. `_decisions/2026-09-18_bastrop_is_the_proving_pack.md`, and the program preamble
   `_catalog/program_preambles/OPS-17.md`, which is compiled into every OPS-17 dispatch and leads with that
   ruling.

Before any work, declare your snapshot and run `node scripts/lane-claim.mjs status`.

## Where things stand

**Nothing merged on 2026-09-18 is live for customers.** `dolphin-app` serves `app.smartcityos.io` from
`3d3ec62`. Read from outside, its finance lens answers "unknown lens", so it predates G-156. `main` is at
`7267c3f`. These DigitalOcean apps have deploy-on-push disabled, so a merge ships nothing.

**Production is worse than `main`.** At `3d3ec62` the work-order Subject cell renders the vendor's
free-text title, where residents write names and phone numbers. `main` does not (G-154). That was
checked against both controls: `fd8562c` has it and `7dda6db` does not. The planner recommended shipping
`main` to production before staff are told to use it. **That call is the operator's and is not yet
made.**

**G-159 (finance bridge) is CLOSED-PARTIAL.** The BNP key proof passed: 12 Bastrop budgets, and the
operator capture reproduced to the digit. Four v1 routes are on `smartcity-os` `main` (`a400f7be`), not
deployed. The dashboards finance route refuses a missing city (`53ade8a`). Its leave-behind is the
`bastrop_tx` finance grant, after D-14 and D-13. Its findings are carded as G-161 and G-162.

**G-154 (Development services) is merged and still open.** PR #68 and follow-up #71 are on `main`, on no
production app. The live `bastrop_tx` proof is not obtained, because anonymous `bastrop_tx` reads are 401
and no lane credential exists. Its seat worktree
`P:\seat-worktrees\g154-dev-services-live\doc_repo` holds uncommitted CP1, CP2 and a `check.mjs` change.
The lane commits them at its close; merge its branch then.

**The credential gap is the program's main blocker.** G-135 asked the substrate seat to mint a
verification-scoped `bastrop_tx` key on 2026-09-15. It was never minted, and G-135's own artifacts sat
untracked in this clone for three days. They were committed at this close. The only active `bastrop_tx`
key is the operator's pilot key, which must not be handed to lanes. The G-154 lane asked the operator to
paste a key into `P:\tmp\g154-hauska-key.txt`. When read, the file did not exist. If it ever does,
it gets deleted after use and is never committed.

## In flight: three dispatches compiled, not yet sent

| Lane | Rows | For | File |
|---|---|---|---|
| `g135-mint` | G-135 | substrate seat, `hauska-mcp-server` | `_dispatches/2026-09-18_g135-mint_dispatch.md` |
| `d14-d13-v1-reach` | D-14, D-13 | govtech seat, `smartcity-os` then `smartcity-dashboards` | `_dispatches/2026-09-18_d14-d13-v1-reach_dispatch.md` |
| `g161-never-default-a-city` | G-161 | govtech seat, `smartcity-dashboards` | `_dispatches/2026-09-18_g161-never-default-a-city_dispatch.md` |

D-13 and G-161 share the dashboards repo with disjoint files. D-13 owns `src/vendor-live.mjs`,
`src/mygov-live.mjs`, `src/mygov-permits.mjs`, `src/property-map.mjs` and `src/adapters.mjs`. G-161 owns
`src/server.mjs`, the module-level defaults, `web/app.js` and `web/index.html`. Both prove on
`d12-main-uat` and re-read its `source_commit_hash` before each probe.

## What to do as each lands

**`g135-mint` closes.** Verify it at source: the credential index entry reads `active` with a `key_id`, and
a probe script reading the key from Secret Manager gets 200 on `bastrop_tx` and 401 without the key.
Never print the value. Re-grade G-135 to CLOSED. Then G-154's lane runs the three commands its CP2
records, and G-154 closes.

**`d14-d13-v1-reach` closes.** D-14 is done when `walrus-app` serves `main`. From outside, G-159's routes
answer 401 JSON rather than the SPA shell. Then compile the G-159 grant lane (OPS-17 G-159): grant
`bastrop_tx` the finance source, and prove the budget MEASURED on `d12-main-uat` with the verification
key. Then G-162 (v1 finance honesty), which is carded and waits on D-14.

**`g161-never-default-a-city` closes.** Its four cells per route need no key, so verify them yourself from
outside: keyless 400, anonymous `bastrop_tx` 401, `no-such-city` 404, `template-city` 200. Then the
next lens: G-153 (Fleet and Police). It must wait for D-13's dashboards change too, because it changes
the vendor mappers D-13 repoints.

**The operator rules on shipping `main` to `dolphin-app`.** Record it as an OPS-17 amendment in the
operator's words. The D-13 lane's last step reads that amendment at source and runs only if it exists.
If the D-13 lane has already finished, the ship is a planner-owned deploy. It must add the configured
platform base to `dolphin-app`'s spec in the same deploy, because after D-13 merges, `main` fails closed
on every feed without it. Read `source_commit_hash` back (rule 13).

## Traps this seat walked into, or around

- `doctl` in this seat has no token. The lanes use a DigitalOcean MCP this seat does not have. Read DO
  state from outside with tells, or run `doctl auth init` with a token the operator gives you. Never ask
  the operator to reconfigure the MCP. Read DO output as JSON, fields by name.
- `OPS-25` in this clone carries another seat's large uncommitted amendment (A-8: the full GCP exit,
  rules 15 to 20, rows D-15 to D-32). Never sweep it into a commit. Commit by explicit pathspec, and
  check `git diff --cached --stat` before every commit.
- The close gate blocks `add` and `commit`, or `commit` and `push`, in one command string. Use separate
  calls. `CLOSE_OVERRIDE=1` only when the blocking file is another seat's; it is logged.
- Shell strings strip regex backslashes (`node -e` in bash). Write any instrument containing a regex as
  a file, and give every presence test a control.
- A new OPS-17 row is not tracked until it is added to `MILESTONES` in
  `scripts/govtech/smartcity-tracker.mjs`.
- The D-12 lane claim (`d12-dashboards-do-cutover`) is still open and stale.
- `00_current_state.md` belongs to the integration seat. Refresh only its SmartCity lines.
- Lane artifacts can land untracked in this clone and sit there. At session start, list untracked
  `_inbox/*` files for this program's lanes, read them, and commit what canon cites.

## Owed by the operator

The roadmap's "Owed by the operator" table is the full list. The top three: the ship decision; hand-carrying the three
dispatches; not pasting the pilot key into a file for G-154.
