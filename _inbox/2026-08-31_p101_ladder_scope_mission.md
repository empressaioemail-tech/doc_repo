---
id: 2026-08-31_p101_ladder_scope_mission
title: MISSION — P-101 ladder re-cut: read-only change inventory
date: 2026-08-31
status: open
applies_to: legacy-design-tools, hauska-map
plan_row: P-101
mode: READ-ONLY scoping. No code, no commits, no PRs, no deploys, no working-tree writes.
owner: scoping subagent hands back to the doc_repo planner; planner writes the build card
---

# P-101 ladder re-cut — read-only change inventory

YOU DO NOT SPAWN SUB-AGENTS. You do this work yourself and hand the artifacts back to the doc_repo planner, who commits. You do not commit, push, merge, open PRs, or deploy. You are a sub-agent under AGENT_CONTRACT section 1 and nesting below you is forbidden.

VERIFICATION IN THIS LANE IS EXIT-BOUNDED. Every command must exit; each one terminates on its own. This lane's verification is entirely `git show origin/main:<path>`, `git grep <pattern> origin/main`, `git rev-parse`, and `git log`, all of which exit. Do not run a watch, tail, or server, and never a non-exiting command of any kind: no `tail -f`, no `--follow`, no `--watch`, no dev server, nothing that waits for input or runs until killed. If you need to bound output, pipe to `head`. A non-terminating command in this lane is a defect, not an inconvenience.

You produce an inventory. You write no code, make no commits, open no PRs, and touch no working tree.

## Hard constraints

Read ONLY via `git show origin/main:<path>` and `git grep <pattern> origin/main` in `P:\legacy-design-tools` and `P:\hauska-map`. Both repos have dirty local checkouts on unrelated branches. Never check out, stash, clean, or modify anything. Never read the working tree; it is not the source of truth and reading it is a documented failure in this operation.

Every claim carries `file:line` on a named commit. What you cannot establish from code goes under Unestablished rather than being guessed.

A negative claim, such as "nothing calls X", must be verified repo-wide, not with a scoped grep, and you state the exact command that produced the negative. Scoped negatives are a known recurring failure here and a negative without its command is not accepted.

## The ruling you are scoping

Read `_decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md` and `_smartsite_gtm/03_ladder_recut_proposal.md` in `P:\doc_repo` first. What must become true:

1. Screens and boards move from ungated to studio-or-team. The three tools are `create_screen`, `add_to_screen`, `list_screens`, currently gated only by "signed in". They must be gated the way owner data and the Studio export kinds already are.
2. The gate goes at the TIER and both surfaces inherit it. The Smart Site MCP must NOT get its own parallel gate. A helper `subscriptionTierGrantsStudio` exists in both `artifacts/api-server/src/lib/peEntitlement.ts` and `artifacts/smartsite-mcp/src/entitlement.ts`.
3. The records package becomes a visible pricing row. It is already Studio, hidden inside export kind `dossier` in `STUDIO_EXPORT_KINDS`.
4. The comparison table regroups to: Answer this parcel, Work a list of them (screens, owner data, records), Hand it off (site plan CAD, terrain), Work as a firm (seats). Studio's badge stops being "The packet".
5. Studio goes from one seat to two.
6. Prospect is redefined from "the set-level answer" to monitoring (alerts, saved searches), still post-launch and marked coming soon.

Prices do not change. Free, the $15 thirty-day unlock, Solo $49, Studio $129, Team $299 for three seats then $25, annual default.

## Deliverable

One markdown report handed back as your final answer. No files written anywhere.

**A. Snapshot.** Exact commit SHA and date of `origin/main` in each repo when you read it.

**B. Screens gating inventory.** Every place that must change, with `file:line`. Every MCP tool handler for the three screen tools and where a gate call goes relative to the existing `canRunStudioReport` / `refuseStudioReport` pattern near `artifacts/smartsite-mcp/src/tools.ts:815-855`. Every api-server route serving screens; tests named `propertyExplorerScreens*` exist, so find the routes they cover. Any hauska-map client code that renders or calls screens and would need an upgrade-prompt path rather than a broken call. Critically: is there any OTHER entry point to screen creation that is not one of the above, and name how you searched for it.

**C. The shared-versus-duplicated gate question.** Are the two `subscriptionTierGrantsStudio` definitions one shared piece of code or two copies? If two copies, what stops them drifting? This determines whether "gate at the tier, both surfaces inherit" is structurally true today or is a claim the code does not currently support. Treat this as a finding in its own right.

**D. `pricing.ts` change inventory.** `hauska-map apps/property-explorer/src/lib/pricing.ts` is declared config-not-code. List every key that changes for items 3 through 6. Name which tests in `pricing.test.ts` and `pricing-modal.test.tsx` break, by test name.

**E. Studio seats one to two.** What actually reads a per-tier seat count? `PE_TEAM_INCLUDED_SEATS` is 3 for Team at `artifacts/api-server/src/lib/peTeamSeatsFromStripe.ts:10`. Is there an equivalent for Studio, or is Studio's "1" purely a display string with no server concept? This decides whether item 5 is a copy change or a real entitlement change. Highest-uncertainty item; be explicit about what you could not establish.

**F. Prospect copy.** Where do "Prospect" and "coming soon" appear in shipped surfaces? If nowhere, say so; that is a valid and useful finding.

**G. Free-user impact.** Anything that would break, 500, or render a dead control for an existing free user the moment screens are gated. Specifically, does any client path assume screens are always available?

**H. Test surface.** Which existing tests assert the CURRENT ungated screen behaviour and would need inverting? Name them. A test asserting screens are free is the pins-a-defect class: it must be rewritten to fail in both directions, never deleted.

**I. Unestablished.** Everything you could not determine from code, stated plainly.

**J. Risks.** Anything that makes this bigger than it looks.

Be skeptical of your own negatives. If a search returns nothing, say which command produced the nothing.
