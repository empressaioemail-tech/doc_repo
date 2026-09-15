---
id: OPS-18_canon_reconciliation_plan_of_record
title: OPS-18 — Canon reconciliation and governance plan of record
status: active
last_updated: 2026-09-15
applies_to: portfolio
owner: nick
related: [_blueprint/00_WDLL, 61_enforcement_doctrine, ENFORCEMENT, 51_ingestion_pipeline_reference, 90_runbooks/fleet_memory_practice, _catalog/plan_registry, 90_operations/OPS-18a_path_to_smartsite_market, 90_operations/OPS-18b_data_remediation_plan, 90_operations/OPS-18c_parallel_execution]
---

# OPS-18 — Canon reconciliation and governance plan of record

`90_operations/OPS-18a_path_to_smartsite_market.md` is the standing sequence to Smart Site
market (structural then data). Remaining execution is
`90_operations/OPS-18c_parallel_execution.md`. Refer there, not to chat. Operator approved that path and
the three rulings (traffic then recompute; unmeasured stays distinct; ADR-028
accepted-partial) on 2026-08-21, sellable that afternoon, and the remaining board
(four teams, Wave A apply in, Harris PBF out) that evening.


## Why this is a plan of record and not a workstream

CLAUDE.md and AGENTS.md both say work that cannot name a plan row is not scoped. Until this
document existed, the programme designed to make rules bind could not name a row, so by the
operation's own standard it was unscoped. Worse, its dispatches would have had to travel by
hand-carry, which bypasses the canon gate entirely, because that gate fires on the Agent
tool and a prompt pasted into another agent never touches it.

Running the governance-repair programme through the governance bypass would have been the
defect it exists to fix. So it gets a plan, rows, and compiled dispatches like everything
else.

## The governing problem, in one line

The artifact exists and nothing feeds it or reads it.

Measured instances on 2026-08-20, all evidenced: the ingestion reference untracked and
diverged into two live bodies; ADR-028 partly shipped while marked proposed; fourteen atom
contract versions with no ADR; `atom_links` built, indexed and holding zero property edges;
ten shipped contract fields at zero in production; three ledger indicators constant across
all 3,556 cells; two launch criteria graded by those constants; tier2 flood retired with no
consumer repointed; the fleet memory promotion step never once executed; seven enforcement
scripts with no CI to run them; and a memory system audit that correctly diagnosed most of
this twelve days earlier and changed nothing.

## Baseline rows

| Row | Phase | Deliverable | Exit criterion | Status |
| --- | --- | --- | --- | --- |
| R-00 | Blueprint WDLL | `_blueprint/00_WDLL.md` | operator accepts the definition of done and the fifteen-item violation set | CLOSED `c6399e8` |
| R-01 | Canon reconciliation | `_blueprint/` and the mesh README | the blueprint correctly FAILS all fifteen violations, naming the rule each breaks; where it cannot fail one, that names a missing rule and is filed as an R-04 item | CLOSED 2026-08-21 remainder. Re-grade: D1 MET (inclusion rule + listing 238 = mesh 238, instrument `_inbox/2026-08-21_r01_d1_reconcile.mjs` failed on npm-path decoration then passed), D2 MET, D3 MET (25 BP-* = 25 status sum; BP-MEANING-01 DORMANT; BP-FACTORY-01 UNENFORCED), D4 MET, D5 MET (ASCII agrees with mermaid/T3), D6 MET, D7 MET (Q3 reltuples + V6 handover/S-166). Close `_inbox/2026-08-21_r01-close_close.json`. |
| R-02 | Doc catalog and quarantine | every doc classified; contradictions moved to `_quarantine/` | zero unclassified docs; every quarantined doc names the blueprint rule it contradicts; nothing deleted | OPEN. Census half landed. R-02b remainder against bounded set: README cites listing 238; zero new moves; ADR-028 not quarantined (accepted-partial). Full-estate classification still open. Close `_inbox/2026-08-21_r02b_close.json`. |
| R-03 | Parts inventory | every part documented; dead and zombie parts quarantined | every running part has an owner, a purpose and a TERMINATION CONDITION; parts without one are quarantined | OPEN. Inventory landed (`_catalog/parts_inventory.*`). R-05 triage split the ten NONE parts (do not quarantine `hauska_mcp.atoms`). UNASSIGNED repos were operator-stamped 2026-08-21 (property + substrate seat). Seat assignment landed. |
| R-04 | Governance gap analysis | the tooling register | every blueprint rule names a consumer, or is listed UNENFORCED with a build item against it | OPEN. Both halves landed. Register half + mapping half (R-05 W4: 24 rules then; BP-PROMOTE-01 added on R-01 remainder, unique BP-* now 25; zero armed register consumers). Do not land the r04-controls copies of `canon_divergence.md` / `repo_intents_checks.json` (worktree path leak). Decision `_decisions/2026-08-21_r04_divergence_report_do_not_land.md`. |
| R-05 | Adversarial review | refutation pass over R-01 to R-04 | every finding states a second mechanism and why it was rejected; the factory off-ramp gap resolved or filed | CLOSED 2026-08-21. Report `_inbox/2026-08-21_R-lanes_consolidated_report.md`. Factory off-ramp is BP-FACTORY-01 UNENFORCED, consumer owed R-06. OPS-18 not retired; decision `_decisions/2026-08-21_ops18_keep_through_r08.md`. |
| R-06 | Build the governance tooling | hooks, CI jobs, types | each new control proven by violating it, never by watching it pass | OPEN. Thin slice landed 2026-08-21: `--check-only` canon-divergence, tooling-register schema, factory-termination. Each self-test ok. No baselineExit raised. Remaining blueprint rules still UNENFORCED. Close `_inbox/2026-08-21_r06-slice_close.json`. |
| R-07 | Data audit | nodes, edges and atoms graded against the mesh | every atom family scored; unresolvable bindings COUNTED, never estimated | CLOSED 2026-08-21 as grade of the existing 2026-08-20 audit. `_inbox/2026-08-21_r07_store_grade.md`: 31 Qs, 9 launch-critical. No new COUNT(*). |
| R-08 | Data remediation plan | the fix plan | every defect class has an owner, a rule, and a control that would prevent recurrence | CLOSED 2026-08-21. Plan `90_operations/OPS-18b_data_remediation_plan.md`. Ordered by live GET DCs on `00527-yic` at `2026-08-21T15:53:02.907Z`: DC-4/5/14 pass; DC-2/3/6 fail. Wave A uniform not-yet, Wave B footprint depth, Wave C store identity. |
| R-09 | Launch gate instrument repair | the County Manifest indicators can return a red | `hasWriter`, `atomFamilyState` and `isPartial` each demonstrably take more than one value, proven by producing a cell that reads negative; the two launch criteria graded by them become capable of failing | CLOSED 2026-08-21 live wire. PR 448 MERGED `f67c11f9`. Serving `cortex-api-00527-yic` @100% digest `sha256:83fd0dc6`. Live GET `computedAt` 2026-08-21T15:53:02.907Z: `derivation-indeterminate` 0, DC-4=0, DC-5=0, DC-14 unmeasured 0. `hasWriter` is capability true on 3556/3556. Close `_inbox/2026-08-21_r09-wire_live_close.json`. |
| R-10 | Canon reconciliation: the G-116/G-117 governance gap. Fourteen PRs (#39 to #52) on `smartcity-os` and ten deployed revisions on `smartcity-dashboards` were built, merged and deployed with NO governing plan row, and the code cites THREE decision records that do not exist in either doc_repo clone (`_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`, `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md`, and a 2026-09-04 Leaflet-island override cited by `property-map.mjs`). The work itself was real, careful and correct on substance; the bookkeeping was never done. Consequence, already observed twice this session: an agent reading canon concludes no permit feed exists, an agent reading code concludes three authorizations exist, and both are wrong. | Retroactive rows exist for every shipped surface; the three cited records exist as RECONSTRUCTED records explicitly marked as awaiting operator ratification, never as invented decisions; G-52's blocker text no longer claims "no live permit feed exists" | none | OPEN 2026-09-14. Reconstruction only — an agent may record what was built and why from source, and may NOT assert what was decided. Ratification is the operator's. |
| R-11 | The SEAT-01 worktree gate has THREE verified holes, and the two silent ones are worse than the one that complains. Found 2026-09-15: the P-236 lane was refused while correctly registered, reported it against its own convenience, and the integration seat verified all three by direct probe of a control it owns. **(a) OVER-BROAD, and it is the only one anybody notices.** `ownerOfRepoPath` in `scripts/enforcement/seat-register.mjs` uses `rows.find(...)`, returning the FIRST seat-product entry for a repoPath. `P:/hauska-factory` carries several registered lane worktrees, so a correctly registered lane is denied with a DIFFERENT worktree named as owner (`product_index_foreign`; owner reported as `hauska-factory-f10`). Per ENFORCEMENT this is the defect that teaches the fleet to reach for the bypass flag. **(b) SILENT: the gate is blind to `git -C`.** Its own header states the scope predicate is "the worktree the command mutates (git -C / file path toplevel), not the hook process cwd". The code never parses `-C` out of the gated command; its only `-C` is its own internal `rev-parse`. Proven by probe: `{command: "git -C P:/hauska-engine commit", cwd: "P:/doc_repo"}` returns `{"permission":"allow","agent_message":"SEAT-01 ok seat=integration"}`, evaluating doc_repo for a mutation of hauska-engine, while the same `git commit` with cwd `P:/hauska-engine` returns `deny`. Same mutation, opposite verdicts, decided by where the caller stands rather than by what is touched. NOT vacuous: the deny case fires. **(c) SILENT: shell mode gates only git writes, not file writes.** `--mode shell` allows anything failing `isGitWriteCommand`, so a heredoc, `sed` or `python` write into another seat's checkout never meets the path check; only the Write tool does. The P-235 lane authored through Bash and met the gate solely at commit time. NOTE AGAINST INTEREST: the integration seat runs every doc_repo write through Bash per its own harness instruction, so it has been inside hole (c) all session. | (a) a repo with several registered worktrees resolves ownership to the worktree being written, not the first one listed, proven by a fixture with two lane worktrees on one repoPath where the second is allowed; (b) the gated command's `git -C` target is the scope predicate, proven by the probe above inverting from allow to deny with cwd unchanged; (c) a file mutation through Bash into an unregistered or foreign worktree is refused, proven by violation with a heredoc. Each half proven BY VIOLATION, and the header's claim and the code made to agree, or the header corrected to describe what the gate actually does | none | OPEN 2026-09-15. Carded by the integration seat. All three verified, none fixed. Scope defects (a) and the silent halves (b)/(c) are one row because they are one predicate: what does this gate think it is protecting. Do not fix (a) alone; a narrower allow-list with (b) and (c) still open would read as a fix and change nothing about what actually reaches a foreign repo. |

## Standing constraints on every row

No product code, no migrations, no store writes, and no new ADRs without an operator
ruling. Quarantine moves, it never deletes. No decision is reversed by an agent; where two
accepted decisions genuinely conflict, the conflict is filed for the operator.

Dispatches compile: `node scripts/dispatch.mjs --plan OPS-18 --lane <ID> --plan-row R-xx`.
Hand-assembled dispatches are blocked by design and the block is the system working.

Subagents do not commit. The planner commits, which forces reading the artifact.

## Work already landed under this plan before it existed

Recorded so the row history is honest rather than backdated. All 2026-08-20:

`492a452` filed the estate including the ingestion reference. `d6f87af` filed the production
store audit. `c6399e8` closed R-00. `ee4ea4a` built the missing Tier 1 memory store, wired
doc_repo's first CI, and retired the OPS residue. `2b3dc71` replaced a false-green workflow
with a ratchet after watching it run. `7f9f7e7` reconciled the two diverged copies of the
ingestion reference. `f3f3c3f` gave the memory promotion gate a trigger.

Those belong to R-00 and to preparatory work for R-01. They are not a claim that R-01 is
underway.

## Reversal criteria

Retire this plan when R-08 closes, or when an operator ruling folds the remaining rows into
`OPS-16` or `OPS-17`. Do not let it become a permanent third program. A governance plan that
outlives its own repair is the artifact class it was built to remove.

R-05 answered this on 2026-08-21 (`_decisions/2026-08-21_ops18_keep_through_r08.md`): do not
retire at R-05; do not fold R-06 into OPS-16 or OPS-17. R-07 and R-08 may fold after R-06 has
landed. R-09 stays until a live GET fires.

## R-09 scope fence, because this row touches the launch gate

R-09 repairs an INSTRUMENT. It does not change what the gate requires and it does not close
a single cell. Two of the five Texas-flush launch criteria are graded by `hasWriter` and
`atomFamilyState`, both constant across all 3,556 manifest cells on live read 2026-08-20, so
those criteria cannot fail. A criterion that cannot fail is not a criterion.

Making them capable of failing is the opposite of a shortcut to launch. Minting absence atoms
to close cells would be the shortcut and was rejected by operator ruling.

Changing the launch criteria themselves is an OPS-16 amendment and is operator-ruled. R-09 may
not do it. If R-09 finds that a criterion is wrong rather than merely ungradeable, it files
that for the operator and stops.
