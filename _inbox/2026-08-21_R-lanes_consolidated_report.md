---
id: 2026-08-21_R-lanes_consolidated_report
title: R-lanes consolidated report (R-05)
status: active
date: 2026-08-21
last_updated: 2026-08-21
owner: integration
plan_row: R-05
related: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _blueprint/00_WDLL]
snapshot: P:/doc_repo main d254467788c795c6f8fa5a9256ad6a074859b615 then this pass
---

# What is now true

Five lanes ran in parallel on 2026-08-20/21. Four returned with real work. R-09 is still live on a property-owned PR and was left alone. This pass preserved the throwaway-worktree artifacts into `P:/doc_repo`, graded the blueprint against its own WDLL, reconciled the three number fights, triaged the parts inventory, mapped every blueprint rule onto the control register, graduated one control, and moved three duplicate-id bodies into `_quarantine/`. Nothing from the four returns was rejected. Three of their findings had already corrected the planner before this dispatch started. Two more corrections landed here.

The estate now has a blueprint (`_blueprint/`), a doc census (`_catalog/doc_census.*`), a parts inventory (`_catalog/parts_inventory.*`), and a tooling register (`_catalog/tooling_register.*`). Those are catalogs. They are not yet a binding system. The blueprint fails two of its own done criteria. Twenty-four blueprint rules map onto zero armed register controls. R-09's claimed firings are a local Cloud Run probe script, not a live GET.

## The three disagreements

Duplicate ids. The true count depends on the walk. On this dirty integration tree, a YAML-fence parse of every `*.md` skipping only `.git` and `node_modules` finds **18** distinct ids claimed by two or more files. Classification, re-read, not trusted from the close: four pointer pairs (benign OPS stubs), six identical copies, eight diverged two-body ids. The eight are the 51-incident class. Tracked-only on a clean worktree is **7**, which is what R-02's detached close measured. R-04's **8** is a `^id:` grep that also hit a pasted line in a session report. The R-02 integration close's **16** dropped two CRLF files whose fences the LF-only parser could not see. The planner's **20** is not in git at the commit that was cited for it. This pass moved three of the eight diverged bodies into `_quarantine/` (the adr_025 inbox draft, the WAVE3 a2 report, the M2 historical replay). The remaining diverged set is the live ADR versus its inbox draft (moved), the WAVE3 pair (a2 moved), `canon_divergence` versus the replay (replay moved), and the `_smartcity_masters` versus `_scratch/removed_*` shadows (scratch is gitignored; not moved). White-paper inbox copies versus untracked Master Collateral copies are byte-identical and were left.

Consumer NONE. **Not the same question.** 702 of 1,998 is "no named loader" on a clean detached worktree at `4b174d1`, which is the question the R-02 dispatch asked. 2 of 2,406 is "outside the doc-staleness walk" after a later instrument stamped CI onto every path that walker would open. The two skill files under `.claude/` are the only files that walker never opens. The dispatch said NONE is expected for most of the estate. 702 is that answer. 2 is a different instrument answering a different question under the same label. The census that landed in `_catalog/doc_census.json` is the second instrument. Use the named-loader distribution when asking who reads a document.

hasFrontmatter. **319 and 321 are both honest** on the clean `4b174d1` tree: BOM-tolerant first-line trim (doc-staleness) versus BOM-intolerant `startsWith('---\n')` (census). Three BOM files explain the gap. The planner's **365** is not reproducible at the cited commit. The close's **880** is the LF-only parser counting CRLF opens as missing fences. Live on this snapshot, if the question is the staleness walk: 389 of 2,367. If the question is the census walk with a CRLF-tolerant but BOM-intolerant fence: 438 of 2,424. Those remain different questions. Mixing them is how four numbers were treated as one.

R-04's tracked diffs on `_catalog/canon_divergence.md` and `_catalog/repo_intents_checks.json` are a side effect of running `scripts/canon-divergence.mjs`, not scope creep. `renderReport` interpolates the checks path as an absolute filesystem path, so the generated markdown leaked `P:/tmp/r04-controls/`. They were not landed.

# The R-01 grade

Graded against `_blueprint/00_WDLL.md`. R-01's own CP2 and close marked D1–D7 MET. That is unearned.

D1 FAIL. The mesh lists `@empressaio/atom-contract@1.22.0` as AUTHORITATIVE and writes a contract-versus-ADR precedence rule. That half holds. The rest does not. The WDLL requires every document in the canon set classified, with a count reconcilable against a file listing. It never bounds "canon set." The README's 60 is a curated compile set. Five of six SUPERSEDED rows are not files. Fifteen ADRs are unclassified, including accepted ADR-029 and ADR-025. CP2-A already admitted the REFERENCE bucket was representative and accepted the miss. Accepting the miss is how D1 was marked MET.

D2 MET. `10_model.md` rules on all four framings in the required vocabulary: 77 adopted in part (storage claim superseded), ADR-001+010 adopted in part (`target_cid` and IPFS-as-sole-body superseded), ADR-020 adopted in part for private encumbrances only, 51 adopted.

D3 PARTIAL. Columns exist. Unenforced is labelled. The one ENFORCED row names `three-layer-audit.mjs`, which is not in the tooling register and has no ingest/merge/CI trigger, so it is DORMANT when mapped. The file's status summary (26) does not reconcile to its tables (24 `BP-*` rows). `BP-PROMOTE-01` is a named gate in prose and in the mermaid and has no register row. `BP-FACTORY-01` uses status `MISSING → R-04`, which is not in D3's enum.

D4 MET. This is the criterion that decides north star versus artifact. The register maps V1–V15 to a rule id, a section, and a sentence. The eleven unfed/unread/cannot-fail cases are not collapsed into bad-data rules. V10 is filed as a MISSING RULE, which is what the WDLL expected.

| V | named as failing? | rule id | section | failing sentence or MISSING RULE |
| --- | --- | --- | --- | --- |
| V1 | yes | BP-KEY-01 | `10_model` Identity | Canonical parcel key is minted at resolution; source keys live in externalKeys. STARVED. |
| V2 | yes | BP-FLOOD-01 | `40_rule_register` | Assign flood zones using parcel geometry intersection, not tile centroid alone. Wrong value. |
| V3 | yes | BP-ACCESS-01 | `40_rule_register` | Do not default accessPolicy to public-free when payload omits it. UNENFORCED. |
| V4 | yes | BP-LANDUSE-01 | `40_rule_register` | Never overlay land-use-fact and landuse rail counts as one measurement. Wrong value. |
| V5 | yes | BP-LEDGER-01 | `40_rule_register` | hasWriter and atomFamilyState must vary across manifest cells they grade. STARVED. |
| V6 | yes | BP-ADDRESS-01 | `40_rule_register` | Reject situsAddress that is punctuation-only or empty tokens. Wrong value. |
| V7 | yes | BP-RECON-01 | `40_rule_register` | Emit conflict when two authoritative stores disagree on same parcel fact. STARVED/unfed. |
| V8 | yes | BP-ABSENCE-01 | `10_model` Absence | Absence claims that must read as checked and none require the verified pair. STARVED. |
| V9 | yes | BP-SERVE-01 | `30_lifecycle` Retirement | Repoint all L4 consumers when a fact store retires. UNENFORCED. |
| V10 | yes | BP-FACTORY-01 | MISSING RULE | MISSING RULE. Filed R-04 in the same pass. |
| V11 | yes | BP-EDGE-01 | `10_model` Edges | Volatile relation half should live on edges (applies-to). STARVED. |
| V12 | partial | BP-PARCEL-KEY-01 | `10_model` Nodes | Normalized form: integer prop_id, no decimal padding. Quote lives in the unified-model paragraph. |
| V13 | yes | BP-KEY-SENTINEL-01 | `10_model` Edges | Production encodes volatile half in entity_id suffix. Wrong value in the key. |
| V14 | yes | BP-DID-01 | `10_model` Atoms | body.atomDid must equal column atom_did namespace. UNENFORCED. |
| V15 | yes | BP-BITEMP-01 | `10_model` Time | Do not cite knowledge_atoms as production bitemporal proof until populated. UNENFORCED. |

D5 FAIL. Independent confirm: `diagrams/03_lifecycle.mmd` sends Candidate to Provisional. The ASCII machine in `30_lifecycle.md` places Provisional under Resolved and names Adjudicated, which is not a mermaid state. `BP-PROMOTE-01` labels a mermaid edge and has no register row. Other diagram/prose mismatches (contains self-loop, omitted Stage D, undefined `sourceAdapter`) are in the W1 grade.

D6 MET. `50_grading.md` is a hand-runnable procedure that emits rule ids, not a percentage.

D7 PARTIAL. `compiled_at_commit` is declared (`4b174d1`). The load-bearing special-district figure 20,844,039 is cited to store audit Q3, which prints 21,586,428. That is the "read the log you cite" miss. V6 (`", ,"`) has neither timestamp nor endpoint.

The blueprint is a north star on D4 and an artifact on D1 and D5. R-01 stays OPEN.

# What was fixed

Cited-untracked matcher. A prose mention of `.git/` is no longer a citation. Exact `.git` or `.git/...` is skipped. `.github/` is not. Proven on a clean worktree `P:/tmp/r05-cu-proof` at `d254467`, not on this dirty integration tree.

Unpatched: exit 2, four hits, all target `.git/` (`90_runbooks/agent_workspace_hygiene.md`, `_catalog/repo_map.md`, `_catalog/dispatch_missions/mission_R05_master.md`, `_dispatches/2026-08-21_r05-master_dispatch.md`). The baseline's "2 hits" was already stale at this commit because the R-05 dispatch and mission also backtick `.git/`.

Patched: exit 0, hits [].

Violation: tracked `_inbox/_r05_cu_citer.md` citing untracked `_inbox/_r05_cu_target.txt` produced exit 2 with that pair.

Restore (reset + rm): exit 0, hits []. `--self-test` ok.

Then, and only then, `cited-untracked` in `.github/enforcement-baseline.json` moved from REPORTING / `baselineExit` 2 to BLOCKING / `baselineExit` 0. No other pin was raised. A dirty integration run will still exit 2 because tracked canon cites real untracked `_inbox` paths. That is the real defect class. CI clones are the measurement that licenses BLOCKING.

Three duplicate-id bodies moved to `_quarantine/`, never deleted: the adr_025 inbox draft, the WAVE3 a2 report, the M2 historical replay. Each names the class in `_quarantine/README.md`. Accepted ADRs that contradict the blueprint were not moved; reversing a decision is operator-owned.

Lane artifacts from `P:/tmp/r03-parts` and `P:/tmp/r04-controls` were copied into the estate by explicit pathspec before analysis. R-02 was already in the tree.

# What is filed and not fixed

| Item | Owner | Plan row |
| --- | --- | --- |
| R-01 D1: bound the canon set and classify against a file listing; stop padding SUPERSEDED with non-files | planner / R-01 remainder | R-01 |
| R-01 D5: make mermaid agree with `30_lifecycle.md` ASCII; add `BP-PROMOTE-01` to the register or remove it from the diagram | planner / R-01 remainder | R-01 |
| R-01 D3/D7 nits: reconcile the 24/26 count; cite Q3's 21,586,428 or cite the db-probe | planner / R-01 remainder | R-01 |
| Finish R-02 classification; remaining diverged shadows and white-paper copy ids | planner | R-02 |
| Quarantine or rewrite ADR-028 §3, 77's storage sentence, ADR-010 present-tense store claims | operator | R-02 |
| Write executable termination strings for kept NONE stores; detector for `/superseded/i` without an executor | property + systems | R-03 remainder + R-06 |
| Assign hauska-mcp-server, plan-review, icc-portal, smartcity-os to property in `seat_register.json`; `noTouch` on smartcity-os so the owner cannot write the island | operator (systems writes the register after the ruling) | operator |
| DNS `mcp.hauska.dev` stays operator; not a git repo | operator | operator |
| Every blueprint rule: consumer that exists and is armed, or stay UNENFORCED with the R-06 item already in the W4 table | systems + property per rule | R-06 |
| canon-divergence `--check-only` (stop mutating tracked files; stop leaking worktree paths) | systems | R-06 |
| seat-register FALSE-GREEN (library, no `main()`, vacuous exit 0) | systems | R-06 |
| Canon gate Agent-tool only; M4 hashes AGENT_CONTRACT.md and reads the same file back; dirty-tree close gate blocked a push that was committing the file it named | systems | R-06 |
| `dispatch-template-gate.ps1` refused a MISSION INPUT (no marker by definition) and is Write-tool only so `cp` bypasses it | systems | R-06 |
| doc_repo main has no required status checks | operator + systems | R-06 Stage 2 |
| Graduate doc-staleness (not cheap: 1223 vocab FAIL on this snapshot) | docs + systems | R-06 |
| BP-LEDGER-01 variance on a deployed GET | property | R-09 |
| PR 447 merge, canary `--no-traffic`, live GET firing, POST recompute | planner after property occupancy confirmed idle | R-09 |
| R-03 ZOMBIE split (keep starved successors and missing CLIs; quarantine uncommitted scorers and tmp runners) | property | OPS-16 / OPS-17 as named in the W3 table |

# What this pass could not have found

Unread paths, which is remaining work: live PE/cortex/brief flood serve path after the 2026-08-19 retirement; POST recompute for county-ledger; whether the L26 lease is still held; whether any production reader hits `document_blobs` or `reasoning_atoms`; markets HTTP for cockpit and smart-markets; a live GET on a canary of PR 447; whether `three-layer-audit.mjs` still throws on a county disagreement today; a file listing of "the canon set" because the WDLL never defined that set.

Unobservable by construction, which is a permanent limit: DNS registrar state beyond NXDOMAIN; any writer on a machine other than the box R-03 `Get-Process`'d; consumers that exist only in deployed images absent from LDT HEAD; the population of documents a human would call canon that no glob of numeric-prefix files plus ADRs would catch; whether a second occupant is sitting in `P:/seat-worktrees/property/legacy-design-tools` (the seat-gate does not prevent two occupants of a registered tree). Occupancy of that worktree is UNCERTAIN. That is why R-09 was left alone.

# Where the planner or a lane is still wrong

The planner's duplicate-id 20 and hasFrontmatter 365 were already under suspicion. They are not in git at the commits cited for them. Reporting that is a successful outcome.

The planner's cited-untracked "2 hits in a clean checkout" was already stale at `d254467`: it is 4, because this dispatch and its mission also backtick `.git/`. The direction was right. The pin was a commit behind.

R-01's close claiming D1–D7 MET is wrong. D4 is the one criterion they demonstrated. CP2-A accepting a subset mesh is the opposite of violating D1.

R-02's integration close used the bulk-CI instrument and then described it as the census. The dispatch asked the named-loader question. Both numbers are internally consistent. The close's label is not.

R-03's close said the ten NONE parts were quarantined. Quarantine of `hauska_mcp.atoms` would be a category error. The ten are unlike things. The close named the gap and then applied one disposition.

R-04's STARVED count of 0 is a census of doc_repo controls, not of blueprint product rules. Importing it into the rule mapping would have hidden BP-EDGE-01. W4 did not.

R-04's duplicate-id 8 should not have overwritten its own worker-18, which matched the dirty YAML walk.

R-09's close presents cell ids and counts as proof. The instrument is `cloudRunManifestReadProbeOptions` against deployment Postgres, plus a local function comparison for `isPartial`. Live GET at 2026-08-21T01:12:50Z is still all 3,556 cells `hasWriter=true`, `atomFamilyState=present`, `isPartial=false`, `computedAt=2026-08-14T17:41:22.500Z`. Injected probe options can produce the negatives without the deployed read path having changed. That is not a live firing.

The WDLL itself may still be wrong on D1: an unbounded "canon set" makes D1 uncloseable, which is how R-01 was tempted to curate 60 and call it done. Bounding the set is an R-01 amendment, not an agent rewrite of the WDLL.

# OPS-18 reversal criterion

The plan says retire at R-08 or fold remaining rows into OPS-16 or OPS-17, and warns that a governance plan outliving its own repair becomes the artifact class it was built to remove. R-04 is the natural point to ask.

Do not retire at R-05. Do not fold R-06 into OPS-16 or OPS-17.

R-04's actual output is that twenty-four blueprint rules have zero armed register consumers. The catalogs exist. The wiring does not. Folding "build the governance tooling" into a Texas-market or govtech-stack row would bury it under product cards, which is how ENFORCEMENT.md already fails its own three-question gate (prose in an agent context, no executor). R-06 is the repair the plan was created to name.

R-07 (data audit) and R-08 (remediation plan) can be folded into OPS-16 after R-06 has at least one new control proven by violation per defect class they will grade, because those two rows are store work with a governance wrapper. R-09 stays until a live GET on a deployed revision returns a named cell that reads negative. That is an instrument repair on the launch gate, not a Texas-flush product card, and changing the criteria themselves remains an OPS-16 amendment.

Retire OPS-18 when R-08 closes, or when R-06 has landed and R-07/R-08 have been explicitly folded by an operator ruling. Not before. A plan that stops at catalogs is the artifact class.

# R-09

LEAVE ALONE. PR 447 is OPEN and MERGEABLE. CI per-check conclusions are `"SUCCESS"`. HEAD is `164378da`, two commits after the close-cited `6fea02c5`. Property worktree occupancy is UNCERTAIN. A second agent in that tree is a collision the seat-gate will not catch. After occupancy is confirmed idle: merge, canary `--no-traffic`, live GET with a cell id, then POST recompute (out of R-09 fence, planner-owned deploy, not a traffic shift). Until the live GET, the row is not done.
