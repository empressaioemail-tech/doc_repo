CANON-PREAMBLE v6c68a963

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

---

# Seat: property

# Property seat state

Preserved from _STATE.md at the 2026-08-20 topology split. Write this file, not the generated combined view. Duplicate branch-protection paragraphs from the concurrent double write were removed; the surviving record is `_state/systems/STATE.md`. The Smart Markets block moved to `_state/markets/STATE.md`.

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-20. Property namespace. Restructured from _STATE.md; branch protection lives in _state/systems/STATE.md.**

**LANE B 2026-08-19 (waves 1 and 2 SHIPPED): TEMPLATE CITY BUILD IS RUNNING.** Read `_inbox/2026-08-19_template_city_lens_build_sheet.md` and OPS-17 rows **A-073 to A-079**. **THE CORRECTION THAT OPENED THIS: the G-18 register's `Not built` meant THIS SURFACE DOES NOT EXIST YET, and three agent handoffs hardened it into THIS SURFACE IS MEANT TO BE EMPTY.** Rulings: honest absence is now about SOURCES per region, not screens; the department roster matches live and GROWS; demo data on every lens with one `Demo` chip. Dashboards main **`1b271c8c3dc7bf361c09f00a095cc8e9022a6946`**, serving **`smartcity-dashboards-00025-mam` @100%**, suite **320/320**. Kit main **`17eccfade057c0f8a835b8731be834cd4b828166`**, vocabulary **143**, components **86**, Design project **482** files. **Registry: 11 domains, 10 carrying on `template-city`, 0 of 11 on `empty-city`; `patrol-vehicles` stays the single `ungranted` region on purpose** — granting everything deletes the state that proves ruling 1. Footer now carries two claims: `0 of 10 sources granted` beside `6 of 10 demonstrated with fixture records`. Connections register split to **70 rows / 5 addenda**. **WAVE 3 SHIPPED 2026-08-20** under OPS-17 rows **A-080 to A-084**. Every department lens now renders its domain. Conformance instrument is live and is the reason wave 3 grew: 92 scans over 23 surfaces DERIVED from route definitions (the hand-built list of 16 was 30% short), 0 unwaived nodes, 132 adjudicated, bound stated as JUDGED not CONTAINED. Vertosoft handoff bundle assembled at `P:/tmp/VPAT/vertosoft_handoff_2026-08-20/` (tagged PDFs + CSV, verified against an untagged control). Heads and serving revisions are in the L1/L2 closes, not restated here. **OPEN and dispatchable: G-103 shared tagged-PDF render service, G-104 SmartSite title + glyph fix.** Both compile through `scripts/dispatch.mjs`; a fabricated row refuses. The eleven domains reach no pixel; all fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`, so lens rendering merges one at a time. **Open, operator-owed:** Parks and Court are NOT expressible on the seam (four gate points, pinned to go red if a vendorless path appears) and four build-sheet lenses have no vendor — W2DEPT-F2; the register's disposition column is still hand-declared and can drift; the Design picker walk is STILL unrun. Closes `_inbox/2026-08-19_w2ds_close.json`, `_w2dept_close.json`, `_w2fix_close.json`.

**DRAIN STATUS 2026-08-17: L26 IDLE, QA/LAUNCH ON CURRENT MAP.** Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md` first. Decision `_decisions/2026-08-17_qa_launch_current_map.md`. GTM `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. 15-min scoreboard loop PID 85672 **dead**. Lease **L26** heartbeat PID **22096** still live (expires ~21:53

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: R-01, R-02, R-04, R-05 (90_operations/OPS-18_canon_reconciliation_plan_of_record.md)

# Consolidate, resolve, adversarially review the R-lane returns; one report

## Mission — master planner: consolidate the R-lane returns, resolve them, adversarially review, file ONE report

You are the MASTER PLANNER for this pass. You fan your own agents, you troubleshoot, you
adversarially review everything including your own conclusions, and you produce a single
consolidated report. You commit to doc_repo yourself under the discipline in the last section.

Five lanes ran in parallel on 2026-08-20/21. Four returned. Their work is real and mostly
good, and three of their findings corrected the planner. **Nothing is being rejected.** Your
job is to land it, reconcile what disagrees, finish the halves that were deliberately
deferred, and say in one document what is actually true.

---

## WHERE EVERYTHING PHYSICALLY IS. None of it is committed.

    R-01 blueprint   WROTE DIRECTLY INTO P:/doc_repo
                     _blueprint/{00_README,10_model,20_pipeline,30_lifecycle,
                                 40_rule_register,50_grading}.md, diagrams/
                     _scratch/r01_blueprint.md
                     (00_WDLL.md is COMMITTED at c6399e8 and is the grading standard)

    R-02 census      P:/tmp/r02-census @ 4b174d1 (also copied into P:/doc_repo)
                     _catalog/doc_census.{json,md}, scripts/doc-census.mjs,
                     _scratch/r02_census.md, _inbox/2026-08-21_r02-doc-census_{cp1,cp2,close}.json

    R-03 parts       P:/tmp/r03-parts @ 4b174d1
                     _catalog/parts_inventory.{json,md}, scripts/build-parts-inventory.mjs,
                     _scratch/r03_parts.md, _inbox/2026-08-21_r03-parts_{cp1,cp2,close}.json

    R-04 controls    P:/tmp/r04-controls @ 4b174d1
                     _catalog/tooling_register.{json,md}, _scratch/r04_controls.md,
                     _inbox/2026-08-21_r04-controls_{cp1,cp2,close}.json
                     ALSO modified tracked files _catalog/canon_divergence.md and
                     _catalog/repo_intents_checks.json. Establish whether those are side
                     effects of RUNNING a control (canon-divergence writes a file) or scope
                     creep, and say which.

    R-09 gate repair P:/seat-worktrees/property/legacy-design-tools on seat/property.
                     STILL RUNNING as of 2026-08-21T01:15Z. Commits 3f05a72d and merge
                     6fea02c5. Mid-flight scratch at _scratch/r09_gate_repair.md.

**Losing a throwaway worktree loses uncommitted work. Preserve first, analyse second.** That
ordering is not optional; it has cost this operation four filed incidents.

---

## ALREADY VERIFIED BY THE PLANNER — do not re-derive

Three lane claims contradicted the planner. All three held. Two were the planner's error.

1. **SEAT-01 had never fired.** `.cursor/hooks/seat-gate.mjs` imported `../scripts/...`, which
   from `.cursor/hooks/` resolves to `.cursor/scripts/...`. Registered on shell and write, it
   threw ERR_MODULE_NOT_FOUND every invocation and exited 0. Fixed at `8c386a9`, then narrowed
   at `5e9385a` because the armed version was over-scoped and refused writes to non-repo
   scratch. **Consequence for you: worktree discipline is now genuinely enforced.** Register a
   worktree in `_catalog/seat_register.json` BEFORE writing from it. Registering afterwards
   does not cure a write already made.

2. **`cited-untracked` was misread by the planner.** The baseline said 1,108 hits of real debt.
   In a CLEAN checkout it is **2, both the literal string `.git/` matched out of prose**. Real
   canon defect: zero. The integration-tree figure measures the planner's own untracked files.

3. **The memory promotion gate fired**, backlog 64 to 67. Three lesson files triaged into
   `_catalog/memory_promotion_log.jsonl`; M-003 is in `MEMORY.md`.

**A warning about verification, from three of the planner's own failures today.** A regex built
by shell string concatenation compiled to an alternation with an empty branch and matched every
input. A hash comparison ran against a path that did not exist and reported MISSING for every
marker. A seat-gate violation test used an MSYS path Windows node cannot resolve, so git
failed, a fallback produced the expected deny, and the bug was recorded as proof the fix
worked. All three shared one shape: **the check returned the answer that was wanted, so it was
not interrogated.** Assume your instruments carry one like it and go looking.

**Two more findings from the last hour, both live, both yours to resolve.**
`.claude/hooks/dispatch-template-gate.ps1` globs `_dispatches/` and requires a canon marker on
anything written there, so it refused a MISSION INPUT, which has no marker by definition
because the compiler adds it. And it is registered on the Write tool only: five mission files
reached `_dispatches/` via `cp` in Bash and were never inspected. Same shape as the canon gate
firing only on the Agent tool. A control scoped to one tool is bypassed by every other tool
that reaches the same state.

---

## THE WORK. Roughly this order; you own the sequencing.

### 1. Preserve, then land

Get every lane artifact into the estate. **Explicit pathspecs.** On 2026-08-20 a
`git add _scratch/` staged 528 files and 208,108 lines of scraped HTML, and a
`git add _dispatches/` swept 25 unrelated lane files. Both were caught only by reading
`git diff --cached --stat` before committing. Do that, every time.

`_scratch/` is gitignored except top-level `.md`. Respect it; do not commit probe dumps.

### 2. Resolve three disagreements. At most one number in each is right.

**Duplicate ids: planner 20, R-02 says 7, R-04 says 8.** Establish the true count and, more
usefully, the true CLASSIFICATION. A pointer pair is benign; two live diverged bodies is the
defect that produced the `51_ingestion_pipeline_reference` incident, where the same `id` and
frontmatter sat on two different bodies and the planner committed one calling it "the spec."

**R-02 contradicts itself.** Its close says 1,998 files with 702 at consumer NONE. Its scratch
says "two `.claude/skills/*.md` are the only true consumer NONE in a 2,406-file estate."
Different denominators, irreconcilable conclusions. One is a different question answered under
the same label. Find which, and state what the census actually measured.

**`hasFrontmatter`: planner 365, doc-staleness 319, census 321.** Three instruments, one
question, three answers.

### 3. Grade R-01 against its own standard. Nobody has.

`_blueprint/00_WDLL.md` defines D1-D7 and violations V1-V15. Grade criterion by criterion and
**be willing to fail it.**

**D4 decides whether the blueprint is a north star or an artifact.** For each of V1-V15: does
the blueprint identify it as failing, naming the rule id, the section carrying it, and the
sentence that fails it? Where it cannot, that is a MISSING RULE to file, not a defect to hide.
V10 (a factory can be started, none can be ended) is expected to land there.

Note the shape first: only V2, V4, V6 and V13 are wrong VALUES. The other eleven are correct
artifacts that nothing feeds, nothing reads, or nothing can fail against. A blueprint tuned to
catch bad data passes four and misses eleven.

**D1 specifically:** does the mesh classify the published `@empressaio/atom-contract` type
surface at 1.22.0? It is not a document and it is the only artifact here that refuses to
compile, which makes it the most authoritative thing in the estate.

**D2 specifically:** does `10_model.md` rule on EACH of the four framings (77, ADR-001+010,
ADR-020, 51) as adopted / adopted in part / superseded? Silence on any is a fail.

### 4. Finish the two deferred halves. Both were blocked on the blueprint, which now exists.

**R-02 second half, quarantine.** Documents contradicting the blueprint move to `_quarantine/`
naming the rule contradicted. **Move, never delete.**

**R-04 second half.** Map blueprint rules onto the control register: every rule names a
consumer, or is listed UNENFORCED with a build item against it.

### 5. Work the R-04 build items

Confirmed live: the canon gate fires on the Agent tool, so a hand-carried prompt never touches
it; the M4 check has the compiler write a hash marker into `AGENT_CONTRACT.md` and the gate
read that same marker back out of the same file, so one party satisfies both sides; the
dirty-tree close gate blocked a push whose own command was committing the file it complained
about; `seat-register` is FALSE-GREEN in the baseline; doc_repo main has no required status
checks; plus the two dispatch-template-gate findings above.

Fix what is cheap and safe, file what is not. **Every control you touch or add is proven by
violating it**, and the violation goes in the report. Never RAISE a `baselineExit` to turn a
red build green.

Cheapest win available: fix the `cited-untracked` matcher so a prose mention of `.git/` is not
a citation, drop its baseline to 0, move it to BLOCKING.

### 6. R-03's actual output

Ten parts have `terminationCondition: NONE`, fourteen are ZOMBIE, five repos are UNASSIGNED in
`seat_register.json`. Triage each. "When superseded" has no executor and is NONE with extra
words. **The UNASSIGNED repos are the urgent half:** an unowned repo is a write collision
waiting to happen now that SEAT-01 actually fires.

### 7. R-09

**Check whether it has closed before touching anything in `legacy-design-tools`.** If it is
still live, leave it alone and say so: a second agent in that worktree is a collision the gate
will NOT catch, because it checks worktree and branch and does not prevent two occupants.

If closed: review against its mission. Its done condition is a FIRING with a live payload and a
cell id, not a reading of the write path. Its scratch carries an OPEN: a deploy plus POST
recompute is needed before a live GET reflects the repair, and the default GET still serves a
2026-08-14 snapshot. **Deploys are planner-owned and yours, never escalated to the operator.**
Production traffic shifts are not: canary with `--no-traffic`, smoke, report.

### 8. The adversarial pass. This is R-05 and it is the point.

Everything above, including your own conclusions, gets refuted rather than confirmed.

For every finding: state the mechanism you believe explains it, then a second mechanism that
would produce the same observation and why you rejected it. Stopping at the first plausible
explanation is the documented recurring error here.

Where a lane reports something verified, ask what it violated to establish that. Where it
reports an absence, ask which catalog it enumerated rather than grepped. **Absence and
starvation look identical from outside and have opposite fixes; in this estate, empty is the
more likely answer.**

---

## THE CONSOLIDATED REPORT. One document. This is the deliverable.

`_inbox/2026-08-21_R-lanes_consolidated_report.md`, written for an operator who has read no
lane return. Prose over bullets. It carries:

**What is now true** as one reconciled picture, not five lane summaries. Where lanes disagreed,
the resolved number and how you resolved it.

**The R-01 grade**, D1-D7, with the D4 table across all fifteen violations and the missing
rules that fell out.

**What was fixed**, each with its violation proof.

**What is filed and not fixed**, each with an owner and a plan row.

**What this pass could NOT have found.** An unread path is work remaining; an unobservable
population is a permanent limit. Conflating them makes a report read as nearly complete when
part of it is unmeasurable by construction. State the second list explicitly.

**Where you think the planner or a lane is still wrong**, including on things already
corrected. Reporting that a planner figure is wrong is a successful outcome here.

**Your answer on OPS-18's reversal criterion.** The plan says retire at R-08 or fold remaining
rows into OPS-16 or OPS-17, and warns that a governance plan outliving its own repair becomes
the artifact class it was built to remove. R-04 is the natural point to ask whether the
remaining rows still earn their place. Answer it.

Update `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` row statuses, and file
decision records for anything ruled.

---

## Discipline

**Fan freely, but you own the fan.** A coordinator that spawns workers and returns abandons
them. Workers do not spawn workers. Workers do not commit.

**You commit to doc_repo**, only under this discipline: `git log -1` and `git fetch` before
staging, because this tree moved four times in one hour on 2026-08-20 and repeatedly since;
explicit pathspecs only; read `git diff --cached --stat` before every commit; one commit per
coherent unit, with a message saying what was verified and how.

**Read-only in any product repository whose seat you do not hold.** `P:/legacy-design-tools` is
dirty on `feat/s1-instrument-hardening` with 63 files: never clean, stash, or commit from it.

**No store writes. No migrations. No `--apply`. No traffic shifts. Nothing is deleted;
quarantine moves.**

If CI goes red, that is the system working. Fix the cause. Do not raise a pin, do not add
`continue-on-error`, and do not use `CLOSE_OVERRIDE` without recording why in the report.

Close with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-21_r05-master_cp1.json
  CP2: _inbox/2026-08-21_r05-master_cp2.json
  CLOSE: _inbox/2026-08-21_r05-master_close.json
