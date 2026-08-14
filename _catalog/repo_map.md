---
id: repo_map
title: doc_repo cartography — what every directory is and what it is for
status: active
last_updated: 2026-08-14
applies_to: docs
owner: nick
related: [repo_intents, plan_registry, 01_doc_conventions, 00b_doc_repo_guide, repo_cleanup_backlog, 90_operations/OPS-17_govtech_stack_plan_of_record]
purpose: The orientation map for this repository. One row per top-level directory: what it is, why it exists, who owns it, whether it is live, and whether it is in scope for the current program. Read this before planning work that touches an unfamiliar folder. Produced by PLAN-ROW G-07 (cartography) on 2026-08-14 because no artifact anywhere said what this repo contained.
---

# doc_repo cartography

## Why this document exists

Four build lanes were about to be dispatched into a repository of 41 top-level directories and roughly 5,000 files with no artifact describing what any of it was. Four agents would each have encountered `_inbox/` (2,626 files, no index) and built four different mental models of it. This map is the fixed point they orient against instead.

It is a MAP, not a cleanup. Nothing was mutated, retired, moved, or deleted to produce it. What needs attention is queued separately in [repo_cleanup_backlog.md](repo_cleanup_backlog.md).

## How to read the counts

Every directory row carries four MEASURED values, never three plus a subtraction:

- **fs** — every file at any depth, all extensions: `find <dir> -type f | wc -l`
- **tracked** — `git ls-files <dir> | wc -l`
- **untracked** — `git ls-files --others --exclude-standard <dir> | wc -l` (untracked AND not ignored)
- **ignored** — `git ls-files --others --ignored --exclude-standard <dir> | wc -l`

The identity `fs = tracked + untracked + ignored` holds for every directory except the two nested foreign git clones, where it cannot: files inside a nested repository are invisible to the parent git entirely, being neither tracked, untracked, nor ignored. That exception is the single largest counting trap in this repo and is called out per row.

Measuring untracked as a subtraction rather than a measurement is how a deliberate, correct exclusion gets mistaken for an omission. It happened twice while this map was being built, both times against gitignored confidential PDFs, and both times a sub-agent caught the planner.

**All counts are a snapshot of 2026-08-14.** `_inbox/` is written to continuously by running lanes; it was measured at 2,620, 2,621, 2,623, and 2,626 within a few hours of the same session. Those are four correct measurements of a moving population, not a discrepancy. Treat every `_inbox` figure as timestamped.

## Scope legend

**State** — `active` (in use now) | `archive` (finished, kept as record) | `dead` (superseded or abandoned) | `unknown` (honestly undetermined; an unknown is a work item, a wrong guess is a landmine).

**Program scope** — `in-scope-OPS-17` (the govtech stack program) | `other-program` (belongs to OPS-16 or another workstream) | `out-of-scope` (needs no attention from the current program) | `needs-ruling` (the operator must decide).

## The map

| Directory | What it is | Purpose | Owner | State | Scope | fs | tracked | untracked | ignored | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| *(root loose)* | 159 canonical `.md` docs plus 5 non-doc files | The numbered-band canon. The primary doc surface. | nick | active | in-scope-OPS-17 | 164 | 160 | 3 | 1 | Only one untracked root doc (`42a_verified_franchise_economy_thesis.md`). `Raul_Blue.txt` (58KB personal notes) and `baseline.json` (1.25MB regenerable ledger snapshot) do not belong at root. |
| `_inbox/` | The courier channel: lane close artifacts, checkpoints, WDLL notes, probe output, run logs | Fleet-WRITE, planner-READ. Evidence flows in; the planner acts on it. | fleet | active | in-scope-OPS-17 | 2626 | 1286 | 1324 | 16 | Over half the repo. 2,276 files loose at top level. Its own README documents a sweep that has never run. See the retention rule below. |
| `_scratch/` | Disposable working files: probe scripts, run logs, one-off queries | Fleet-WRITE, fleet-READ. Explicitly non-durable. | fleet | active | in-scope-OPS-17 | 500 | 14 | 475 | 11 | 140 MB and **not gitignored** despite being declared disposable. One `git add -A` from permanent history. |
| `_dispatches/` | Compiled lane dispatches emitted by `scripts/dispatch.mjs` | Planner-WRITE, fleet-READ. Work orders out. | planner | active | in-scope-OPS-17 | 327 | 269 | 58 | 0 | Keep-forever; needs no retention rule. |
| `_sessions/` | Session summaries per `01_doc_conventions.md` | Planner-WRITE. The durable narrative record. | planner | active | in-scope-OPS-17 | 227 | 223 | 4 | 0 | Keep-forever. 4 summaries uncommitted, two weeks old. |
| `_decisions/` | Decision records per the `decision-log` format | The durable ruling set; reversal criteria live here. | nick | active | in-scope-OPS-17 | 103 | 99 | 4 | 0 | **102 decision records**; the 103rd file is `.gitkeep`. Quote 102. |
| `_catalog/` | The control plane: `repo_intents.md`, `plan_registry.json`, atom index, registries, this map | What the machine reads about itself. | planner | active | in-scope-OPS-17 | 44 | 40 | 4 | 0 | Holds the shared plan registry both the compiler and the canon gate read. |
| `_smartcity_masters/` | The **ratified reference set** for the SmartCity product line | Authority: where these and any other doc disagree, these win. | nick | active | in-scope-OPS-17 | 44 | 39 | 0 | 5 | The 5-file gap is confidential PDFs, correctly ignored. An untracked stale duplicate of this set exists under `Master Collateral Folder/`. |
| `_smartsite_masters/` | The peer reference set for the customer-facing Smart Site line | Approved-claims registers and the binding never-say list for professional audiences. | nick | active | in-scope-OPS-17 | 13 | **0** | 11 | 2 | **Nine finished `status: active` masters, zero tracked.** Its README names `_smartcity_masters/` its companion set reciprocally. Does not survive a clone. |
| `90_operations/` | The OPS pack: both plans of record (OPS-16, OPS-17) and the operator manual | Operational state and the plan baselines. | planner | active | in-scope-OPS-17 | 47 | 45 | 2 | 0 | Has no sanction in the band register, which predates it. |
| `90_runbooks/` | Executable procedure: `AGENT_CONTRACT.md`, factory runbooks, templates | The operative law and the how-to. | planner | active | in-scope-OPS-17 | 60 | 54 | 6 | 0 | All three factory runbooks uncommitted; OPS-17 constraint 8 depends on Factory 1.5 by name. |
| `80_adrs/` | Architecture decision records | Durable architectural rulings. | nick | active | in-scope-OPS-17 | 26 | 25 | 1 | 0 | Uses the ADR lifecycle (`accepted`/`proposed`), which `01_doc_conventions.md` does not sanction. ADR-028 uncommitted. |
| `65_sensors/` | The sensor program band | Cold/warm/live twin ladder; Asset Management Tier 2. | nick | active | in-scope-OPS-17 | 8 | 8 | 0 | 0 | Named in the OPS-17 shared-legs table (S-2 telemetry plane). |
| `_research/` | Research notes and cross-repo reconnaissance | Point-in-time investigation records. | planner | active | in-scope-OPS-17 | 28 | 28 | 0 | 0 | Fully tracked. Excluded from the staleness gate's denominator. |
| `_architecture_homes/` | Function-package and surface placement standard | Where each capability lives; the ADR-008 companion. | nick | active | in-scope-OPS-17 | 8 | 8 | 0 | 0 | Named in CLAUDE.md read-order. |
| `scripts/` | Instruments: dispatch compiler, staleness gate, divergence test | Gates are scripts; instruments are build items. | planner | active | in-scope-OPS-17 | 10 | 5 | 5 | 0 | **Half the instrument layer is uncommitted**, including `doc-staleness.mjs`, the named G-02 instrument. |
| `.claude/` | Five live PreToolUse hooks, skills, settings | The enforcement layer. Hook-shaped controls run 1-for-1 here. | planner | active | in-scope-OPS-17 | 15 | 14 | 0 | 1 | `premortem-check` skill still installed though memory records it retired 2026-07-13. |
| `.cursor/` | Cursor rules and settings for the fleet seats | Dev standards for Cursor-run agents. | planner | active | needs-ruling | 4 | 2 | 2 | 0 | Two rules tracked, two not; the untracking is accidental, not policy. |
| `64_recursive_loop/` | The compression-ladder theory band | The theory this program is the practice of. | nick | active | in-scope-OPS-17 | 6 | 6 | 0 | 0 | The "prose 0-for-3, structure 1-for-1" base rate originates here. |
| `_calibrated_spine_roadmap/` | A spine roadmap program | Build sequencing for the calibrated spine. | planner | archive | needs-ruling | 13 | 13 | 0 | 0 | **Frozen by its own declaration** ("build is frozen pending the audit") while all 13 files still read `status: active`. The freeze exists in prose only. |
| `_prospects/` | Per-counterparty dossiers | Bizops pipeline workups. | nick | active | other-program | 208 | 11 | 197 | 0 | All 197 untracked files are `atx_bulls/`; the other four prospects are fully tracked. |
| `_verticals/` | O&G and CRE vertical exploration | Explicitly "exploration, not canon — do not cite as portfolio truth". | nick | active | other-program | 23 | 20 | 0 | 3 | The 3-file gap is confidential title-exemplar PDFs, **correctly ignored**. Not an omission. |
| `_land_records/` | Land-records program | Blocked on counsel verifying TX LGC 118.011(e). | nick | active | other-program | 8 | 8 | 0 | 0 | Honestly `draft`. Its README documents escaping to an underscore folder after root band collisions. |
| `_rd_digital_economies/` | R&D ladder, opened 2026-08-13 | The paired research half of the digital-economies thread. | nick | active | other-program | 10 | **0** | 10 | 0 | Entirely untracked; edited today. |
| `_thought_leadership/` | Live ideation thread | Holds the ratified 2026-08-14 four-line positioning canon. | nick | active | other-program | 3 | **0** | 3 | 0 | Entirely untracked. `00_current_state.md` points into it. |
| `19_hardware_sovereignty/` | Hardware-sovereignty band | Two-speed: a live guide plus longer-horizon material. | nick | active | out-of-scope | 4 | 3 | 1 | 0 | |
| `system-overview-site/` | A deployed Vercel static site (`empressa-overview`) | Public-facing system overview. | planner | active | out-of-scope | 5 | 3 | 0 | 2 | Dormant, not dead. Guarded by the static-SVG memory: re-export overwrites the fix. |
| `_investor/` | Two 2026-08-12 investor letters | IR drafts for operator review. | nick | active | out-of-scope | 2 | 2 | 0 | 0 | Both still marked draft. |
| `portfolio_thesis/` | Portfolio thesis material | Strategic framing. | nick | active | out-of-scope | 3 | 3 | 0 | 0 | |
| `91_postmortems/` | Postmortems | Incident record. | planner | archive | out-of-scope | 6 | 6 | 0 | 0 | |
| `80_meetings/` | Meeting transcripts | Raw record. | nick | archive | out-of-scope | 4 | 4 | 0 | 0 | Band collision: transcripts in a band reserved for ADRs. |
| `_thoughtbank/` | Frozen June insurance/P&C exploration | Superseded ideation. | nick | archive | out-of-scope | 3 | 3 | 0 | 0 | Still lists Cotality in `related`; Cotality is extinguished. |
| `_decks/` | HTML decks and diagrams | Presentation artifacts. | nick | archive | out-of-scope | 8 | 8 | 0 | 0 | Untouched since the 2026-06-30 move commit. |
| `_sales/` | Approved external sales corpus plus a sales chatbot | Collateral for the sales seat. | nick | archive | needs-ruling | 6 | **0** | 6 | 0 | Entirely untracked, yet **cited by five tracked docs** including the ratified masters README. Its `03_smartcity_os.md` is declared superseded by the masters. |
| `_projects/` | One project: `cortex_workspace_qa` | Time-boxed QA sprint. | planner | unknown | needs-ruling | 5 | 5 | 0 | 0 | Frontmatter says active; last activity 2026-07-01; no disposition recorded. |
| `24_adaptive_ui/` | Adaptive-UI workstream | Declares an active planner pull-back loop from `mox_demo/`. | nick | unknown | needs-ruling | 3 | 3 | 0 | 0 | If the loop had fired since 2026-06-13, `design_system.md` would have moved. One question resolves it: is Chris still designing? |
| `_hauska_brief_extension/` | Single brief-extension doc | Product-adjacent note. | nick | active | other-program | 1 | 1 | 0 | 0 | |
| `_temp/` | Local run scratch | Regenerable; gitignored by design. | fleet | active | out-of-scope | 13 | 0 | 0 | 13 | Correctly ignored. |
| `.vercel/` | **Vercel link for doc_repo ITSELF** | Links this repo to a Vercel project named `doc_repo`. | — | dead | **needs-ruling** | 2 | 0 | 0 | 2 | **A `vercel deploy` from root would publish the internal strategy repo.** Ignored so harmless in-repo, but the local link is live. Distinct from the legitimate `empressa-overview` link inside `system-overview-site/`. |
| `Master Collateral Folder/` | Collateral copies plus a **stale duplicate of the ratified masters** | No README, no index, no canonical doc designates it a home. | — | dead | out-of-scope | 11 | **0** | 11 | 0 | Its `_smartcity_masters/` copy differs from root in 5 of 6 files; root is newer on all five. See the pricing contradiction below. |
| `hauska-mcp-server/` | **A full nested clone of the product repo** | Product code, not strategy. | — | dead | out-of-scope | 186 | 0 | 0 | 1 | 185 files invisible to the parent git. HEAD `080eb01` (2026-07-02). **The ruling already exists**: `.gitignore:12-13` says "delete the clone". Never executed. |
| `tmpbrief-l3-spine-consume/` | **A second nested clone**, of `hauska-brief-extension` | A temp working clone from an L3 task, never removed. | — | dead | out-of-scope | 189 | 0 | 1 | 0 | 188 files invisible. HEAD `fc46920` (2026-07-16). **No record anywhere** — not ignored, not tracked, undocumented. Worse than the first for that reason. |

## The Empressa Command Center — where it actually lives

The Command Center is the **internal operator console for the spine**: the surface where an operator sees the state of the whole machine rather than one property. Deployed as Vercel project `cmdcenter` (alias `cmdcenter-blush.vercel.app`), source at `hauska-map/apps/command-center`. Four documented jobs: the factory floor (County Ledger over 254 Texas counties, plus the Cert View where the required operator visual-QA gate physically happens); the node-and-graph ledger bound to the map on one canonical node id; the engine and governance cockpit (LIVE/STUB badges, MCP introspection, atom inspector, revenue meter); and the tile-and-workspace composition sandbox.

Against the customer surface the ruling is hard and repeatedly restated: **Command Center is INTERNAL and shows the whole machine; Property Explorer / Smart Site is the CUSTOMER app.** They share the spine substrate, the node model, one read path, and the map-renderer library, and they live in the same repo as `hauska-map/apps/*` — but they are two products with two audiences and must never be collapsed into one another.

**It has no home and no authoritative document.** 231 files mention it (`grep -l` on `command[ _-]?center|cmdcenter`, over the repo excluding `.git/`, `node_modules/`, and the two foreign clones); 116 of those, just over half, are in `_inbox/`. Authority is split across eight documents with nothing composing them:

| Question | Governed by |
|---|---|
| Console unification | `_decisions/2026-07-04_master_map_and_console_unification.md` |
| Repo placement and survival | `_catalog/repo_intents.md` |
| Factory-floor requirements | `90_operations/OPS-6_command_center_engine_console.md` |
| Ledger blind spots | `90_operations/OPS-12` |
| Why CC is a required gate | `90_operations/OPS-5` |
| Open work | `QUEUE_parked_work_index.md` |
| The program that built it | `27b_f1_command_center_completion_program.md` (whose contract `27a` is superseded) |
| Customer-language description | the 2026-07-16 bizdev matrix (self-declared aspirational) |

The mechanical cause: `00c_portfolio_master_map.md`, whose job is to enumerate surfaces, **does not list the Command Center as a surface** — it mentions only "a scaffolded command-center app" consuming the SDK. Only one file carries `command_center` in its name at a canonical band position (OPS-6).

**Documented build state, which does not fully agree with itself.** The F1 completion program graded its items MET across four gates on 2026-07-25; County Ledger v2 shipped 2026-08-04; the rail-derivation fix landed 2026-08-12 (PR 158). Against that, OPS-6 (2026-08-02) still records Resolver and Autonomous Engines as explicit stubs, and a 2026-08-14 code audit found `apps/command-center/src` contains only `admin/`, `main.tsx`, `test/`, and `vite-env.d.ts`. The ledger and manifest legs are documented live; the engine-state, freeze/memory, rewarm-control and cert-view legs are documented as not wired. The residual risk worth naming: **Cert View, where a required certification gate happens, may be unwired.**

A proposed home is queued in the cleanup backlog. Note that the slot originally proposed (`44`) is occupied by `44_mcp_cortex_architecture_map.md`; the whole 40-band integer range is taken, so a suffixed slot is the convention-correct choice.

## The `_inbox/` retention question

`_inbox/` is the courier channel and nothing prunes it. Its own `README.md:56-63` documents a sweep — the planner "deletes the inbox file once filed" and "commits the whole sweep as one batch" — that has demonstrably never run: 2,276 files loose at top level spanning twelve weeks. This is the repo's own measured pattern again, a prose-shaped control at 0-for-3.

An evidence-dependency scan established the safe cut. Of 114 distinct artifacts cited by close files, **113 are `.json` summaries and exactly one is a writer-run `.log`** — while `.log` is simultaneously the largest class (929 files) and the least committed (872 untracked). The repo already voted with its index: logs were never committed, closes and summaries were.

The precedent is already set by hand: `_inbox/wave3_attempt1_archive/` holds exactly 241 files, all logs, none tracked, swept wholesale by the operator. A retention rule that generalizes an existing decision is far safer than one that invents a policy.

The proposal, its protections, and its two unmet prerequisites are queued in [repo_cleanup_backlog.md](repo_cleanup_backlog.md). **The operator rules; nothing has been swept.**

## Ownership model — the distinction the four lanes most need

| Directory | Writes | Reads | Durability |
|---|---|---|---|
| `_dispatches/` | planner | fleet | keep forever |
| `_inbox/` | fleet | planner | evidence; retention rule pending |
| `_sessions/` | planner | planner | keep forever |
| `_scratch/` | fleet | fleet | explicitly disposable |

The likeliest failure mode for an incoming lane is **confusing `_inbox/` with `_scratch/`**. Both receive agent-written mid-work files. `_inbox/` output is evidence the planner acts on; `_scratch/` output is disposable. A close artifact written to `_scratch/` is lost; a scratch log written to `_inbox/` is noise the planner must sweep.

## Band system

Mechanically clean: all nine numbered directories exclusively own their prefixes, with no root-file collisions at any directory prefix. Semantically drifted: the band register in `01_doc_conventions.md` (`last_updated: 2026-05-27`) predates `90_operations/`, which now holds **both plans of record** and has no sanction anywhere in the register. `80_meetings/` holds transcripts in a band reserved for ADRs. Four of nine numbered directories sit in bands whose subject they do not match.

`_land_records/README.md` documents the failure in its own words: drafted at root slots 10, 52, 53, 54 and 90, all collided, and it escaped into an underscore folder. Renumbering buys nothing; amending the register and granting `90_operations/` a slot is the cheap fix.

## What this map does not cover

Per-file classification inside any directory. File-level status vocabulary (see `scripts/doc-staleness.mjs`, whose denominator excludes `_decisions`, `_catalog`, `_research`, `_inbox`, `_sessions`, `_scratch` and `_prospects` — the control plane and decision set are unwatched by it). Content correctness of any document. The two nested clones' internals, which were inspected read-only for identity and never entered.
