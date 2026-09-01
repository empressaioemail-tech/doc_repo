---
id: repo_cleanup_backlog
title: doc_repo cleanup backlog — what needs attention, queued not planned
status: active
last_updated: 2026-08-14
applies_to: docs
owner: nick
related: [repo_map, repo_intents, 01_doc_conventions, 90_operations/OPS-17_govtech_stack_plan_of_record]
purpose: The queue of everything found during the 2026-08-14 cartography pass that needs attention but was not in scope to fix. One row per item with a proposed disposition and a rough size. This is a queue, not a plan; nothing here has been executed and nothing here is scheduled.
---

# doc_repo cleanup backlog

Produced by PLAN-ROW G-07 alongside [repo_map.md](repo_map.md). Every item was found by measurement, not inspection-by-vibe, and each carries the evidence that established it.

**Nothing in this file has been executed.** The cartography pass was catalog-only by dispatch. Items are ordered by severity, and severity here means "cost if it goes unaddressed", not effort.

Size key: **S** = minutes, **M** = under an hour, **L** = a session, **XL** = its own program.

## P0 — data-loss and disclosure exposure

| # | Item | Evidence | Proposed disposition | Size |
|---|---|---|---|---|
| 1 | **`.vercel/` at repo root links doc_repo itself to a Vercel project named `doc_repo`.** A `vercel deploy` from root would publish the entire internal strategy repo: prospect dossiers, pricing, investor letters, decision records. | `.vercel/project.json` → `"projectName":"doc_repo"`. Distinct from the legitimate `empressa-overview` link inside `system-overview-site/`. Gitignored (`.gitignore:29`) so harmless in-repo, but the local link is live. | Delete the root `.vercel/` directory. Deploys of the overview site should run from `system-overview-site/`, which carries its own correct link. | S |
| 2 | **`_smartsite_masters/` is entirely untracked** — nine finished `status: active` masters governing the customer-facing product line, holding the binding never-say list and the approved-claims registers. | `fs=13 tracked=0 untracked=11 ignored=2`. `git check-ignore -v` attributes only the 2 PDFs; the `.md` files match no ignore rule. Its own README names `_smartcity_masters/` its companion set reciprocally. `06_gtm` edited 2026-08-10, still uncommitted. | `git add` the nine masters. This binds OPS-17 directly: the program requires every claim to come from a master's approved-claims register, and that register does not survive a clone. | S |
| 3 | **216 files exist on this machine only** — untracked and unignored. Never-committed material cannot be recovered by any git operation, which compounds the standing stale-clone rewind hazard. | atx_bulls 197, `_rd_digital_economies` 10, `_sales` 6, `_thought_leadership` 3. Three edited 2026-08-13 or 08-14. | Track `_sales`, `_thought_leadership`, `_rd_digital_economies`, and atx_bulls' ~61 strategy docs. See item 12 for the atx_bulls design-system payload, which is a separate ruling. | M |
| 4 | **`_scratch/` is not gitignored** despite being declared disposable, and holds 140 MB. | `git check-ignore -v _scratch/` returns no match. `fs=500 tracked=14 untracked=475`. | Add `_scratch/` to `.gitignore`, after confirming the 14 tracked files there are genuinely disposable. One `git add -A` currently writes 140 MB into permanent history. | S |
| 5 | **Half the instrument layer is uncommitted**, including `doc-staleness.mjs` — the named G-02 instrument for the OPS-17 program — plus all three factory runbooks that OPS-17 constraint 8 depends on by name, four ratified decision records, and ADR-028. | `scripts/` `fs=10 tracked=5 untracked=5`; `90_runbooks/` 6 untracked; `_decisions/` 4 untracked; `80_adrs/` 1 untracked. | Commit. Instruments and ratified rulings that exist on one machine are not controls. | S |

## P1 — active misinformation

| # | Item | Evidence | Proposed disposition | Size |
|---|---|---|---|---|
| 6 | **An untracked stale duplicate of the ratified reference set** lives at `Master Collateral Folder/_smartcity_masters/`. Five of six files differ from root; root is newer on all five (2026-08-10 vs 2026-08-01). | Verified file-by-file with `diff -q`. The duplicate `00_README.md:61` lists government pricing under "## Owed" as "an operator decision"; the tracked root says "## Pricing — SET 2026-08-10" with prices already submitted to Vertosoft as MSRP. | **Disposal, not merge** — root is uniformly newer. Delete the duplicate masters copy. A reader of the wrong copy reports a settled, channel-submitted decision as still open. | S |
| 7 | **`hauska-mcp-server/` — a full nested clone of the product repo inside doc_repo.** 185 of its 186 files are invisible to the parent git entirely. | `remote origin .../hauska-mcp-server.git`, HEAD `080eb01` (2026-07-02, six weeks stale). **The ruling already exists and was never executed**: `.gitignore:12-13` reads "Stray full clone of the product repo left inside doc_repo; product code, not strategy. Do not commit; delete the clone." | Execute the ruling already written: delete the clone. Any agent reading it as source reads six-week-stale product code. | S |
| 8 | **`tmpbrief-l3-spine-consume/` — a second nested clone**, of a *different* repo (`hauska-brief-extension`), 188 files invisible. **No record anywhere**: not ignored, not tracked, undocumented. | `remote origin .../hauska-brief-extension.git`, HEAD `fc46920` (2026-07-16). | Delete. Worse than item 7 precisely because nothing documents it — item 7 at least contradicts a written rule. | S |
| 9 | **The `_inbox/` courier sweep has never run.** Its README documents a sweep that would have kept the folder small; 2,276 files sit loose at top level spanning twelve weeks. | `_inbox/README.md:56` "At session start and session close the planner sweeps this folder"; `:62` "Deletes the inbox file once filed." Regrowth measured at roughly 1,494 files per half-month. | See the retention rule below. **The rule treats the symptom; without restoring the sweep as a hook-shaped control, `_inbox` regrows.** This repo's measured base rate is prose controls 0-for-3, hooks 1-for-1. | M |
| 10 | **`_calibrated_spine_roadmap/` is frozen by its own declaration while all 13 files read `status: active`.** | The folder declares "build is frozen pending the audit and the doc scrub"; every file's frontmatter still says active. | Status-flip the 13 files, or lift the freeze. The freeze currently exists in prose only — the exact failure mode OPS-17 was stood up to end. | S |
| 11 | **Broken evidence chain in the L16 lane**: four leg-closes cite `_inbox/2026-08-13_l16_close.json`, a roll-up that was never written. | `test -f` fails; cited by `l16_leg0_sd_residue_close`, `l16_leg1_rail_corridor_close`, `l16_leg2_harris_parcel_node_close`, `l16_mud_scorer_close`. Only broken citation among 114 checked. | **Belongs to the L16 / OPS-16 program.** Named here and left alone per the out-of-scope rule. Route to whoever owns L16. | S |

## P2 — needs an operator ruling

| # | Item | Evidence | Proposed disposition | Size |
|---|---|---|---|---|
| 12 | **atx_bulls' 136-file vendored design system.** Single-copy and expensive to reproduce, but it is product code, which CLAUDE.md scopes out of this repo. | `_prospects/atx_bulls/` is 61 `.md` + 136 non-`.md`, all 197 untracked. `18_build_prd.md` specifies the platform in a separate `franchise-platform` repo. | **Genuinely ambiguous — do not guess.** Likely answer: it travels with the `franchise-platform` repo the PRD already names. That is a placement decision, not a cartographer's call. | M |
| 13 | **Status vocabulary is a schema gap, not an authoring failure.** 367 violations repo-wide, but 16 are ADRs correctly using `accepted`/`proposed`, and 32 are `90_operations` files where the operator wrote real state into the field. | Example: `status: "resume dispatch (SF-1 24 stale cleared; 5 promoted-but-cert-fail remain)"`. Flattening those to `active` would destroy state to satisfy a gate. | **Fix the schema before the data.** Extend the legal vocabulary for `80_adrs/` to the ADR lifecycle; decide whether operational state belongs in `status` or a sibling field. | M |
| 14 | **The staleness gate's denominator excludes the control plane.** `scripts/doc-staleness.mjs` `SKIP_DIRS` omits `_decisions`, `_catalog`, and `_research`. | Verified at `scripts/doc-staleness.mjs:51-54`. | Decide whether the decision set and control plane should be watched. They are currently unwatched by the instrument built to watch the repo. | S |
| 15 | **`_sales/` is untracked yet cited by five tracked docs**, including the ratified masters README and `Pricing/00_pricing_basis.md` — and its `03_smartcity_os.md` is declared superseded by those same masters. | `fs=6 tracked=0`. Citers verified by `grep -rl`. | Track it, then apply the supersession the masters already ruled. Shipping from it today is a claims error. | M |
| 16 | **`_projects/cortex_workspace_qa` and `24_adaptive_ui/`** both read `status: active` with no activity since 2026-07-01 and 2026-06-13 respectively. | `24_adaptive_ui` declares a planner pull-back loop from `mox_demo/` that has evidently never fired. | Honest `unknown`, deliberately. `24_adaptive_ui` needs one fact from outside doc_repo: is Chris still designing? | S |
| 17 | **`premortem-check` skill is still installed and still instructed by CLAUDE.md** while memory records it retired 2026-07-13. | `.claude/skills/premortem-check/` present; CLAUDE.md says "Use the premortem-check skill before any commitment". | Honor the retirement (remove skill + both CLAUDE.md lines) or un-retire it. Carried over from the G0 close, still open. | S |
| 18 | **`.cursor/` untracking is accidental, not policy.** Two rules tracked, two not; no `.gitignore` rule matches any `.cursor` path. The WDLL rule and the runbook it points at are both untracked while the practice is demonstrably live. | `git check-ignore` exits 1 for `.cursor` paths. Carried over from the G0 close. | Track `.cursor/rules/wdll-practice.mdc` and `90_runbooks/wdll_practice.md`; rule explicitly on `.cursor/settings.json`. | S |

## P3 — housekeeping

| # | Item | Evidence | Proposed disposition | Size |
|---|---|---|---|---|
| 19 | **Two dead `.gitignore` rules.** Lines 26-27 name `_inbox/acquisition_staging/` and `_inbox/screenshots/`; neither directory exists. QA screenshots now land in dated subdirectories the rules do not match, so those binaries are currently committable. | Both paths fail `test -d`. | Repoint the rules at the dated-subdirectory pattern actually in use, or drop them. | S |
| 20 | **Root-level files that do not belong at root.** `Raul_Blue.txt` (58KB of personal notes with video links, untracked, unrelated to the portfolio) and `baseline.json` (1.25MB regenerable county-ledger snapshot, untracked). | `find . -maxdepth 1 -type f ! -name '*.md'`. | Move or delete. Neither is doc material. | S |
| 21 | **`Master Collateral Folder/`** — no README, no index, no canonical doc designates it a home; three of its five root-level files are already tracked in `_inbox`. | `fs=11 tracked=0`. | Delete after item 6 removes the duplicate masters, or give it a stated purpose. | S |
| 22 | **Band register is stale.** `01_doc_conventions.md` band table (`last_updated: 2026-05-27`) predates `90_operations/`, which holds both plans of record and has no sanction anywhere. `80_meetings/` holds transcripts in the ADR band. | Four of nine numbered directories sit in bands whose subject they do not match. | Amend the register; grant `90_operations/` a slot. Renumbering buys nothing. | M |
| 23 | **`_thoughtbank/` still lists Cotality in its `related` frontmatter.** Cotality is extinguished per standing decision. | Frontmatter read. | Update `related` or status-flip the folder to archive. | S |
| 24 | **Four session summaries uncommitted**, two weeks old. | `_sessions/` `untracked=4`. | Commit. Covered by item 5's batch. | S |

## The `_inbox/` retention rule — proposed, not adopted

The full population analysis lives in `_inbox/2026-08-14_g0b_sa1_courier_dirs.json`. Summary of the proposal:

**R1 (the sweep).** MOVE — never delete — untracked raw writer-run logs into `_inbox/<lane>_<wave>_archive/` when the lane has a close artifact present and the file is not cited by any close. Generalizes the precedent the operator already set by hand at `_inbox/wave3_attempt1_archive/` (241 files, all logs, none tracked). Estimated effect: top-level `_inbox` drops from 2,276 to roughly 1,650.

**R2 (the protections).** Never touch `*_close.*`, `*_STATUS.md`, `README.md`, or anything cited by a close artifact.

**R3.** Leave all 905 `.json` files alone pending a separate ruling.

**R4.** Eleven named underscore-prefixed files need individual operator calls.

**Why keyed on class, not age:** 74.8% of date-prefixed top-level files are from 2026-08 alone, with the month half elapsed. An age rule would be inert.

**Two prerequisites are unmet**, and both sit outside the cartography mandate:

1. Audit `scripts/` for single-level `_inbox/*.log` globs that a move into subdirectories would silently break.
2. Widen the citation scan repo-wide — it currently covers `_inbox/` only, so a citation from a root doc or a runbook would not have been seen.

**Recommendation: adopt R2 and R3 now** — they are free, they cost nothing, and they prevent the dangerous mistake. **Hold R1** until the two prerequisites clear.

## Also owed: a home for the Command Center

The Command Center has no canonical doc and no home; 231 files mention it, 116 of them in `_inbox/`, and authority is split across eight documents with nothing composing them. The mechanical cause is that `00c_portfolio_master_map.md`, whose job is to enumerate surfaces, does not list it.

Proposed: a root canonical doc composing what it is, the internal-versus-customer ruling, the panel inventory, the authority map, and the deploy identity (`cmdcenter` / `cmdcenter-blush`, **not** `command-center/jade`) — then add it to `00b_doc_repo_guide.md`'s key-entry-points table and `00c`'s surface list, which is where the discoverability failure actually lives.

**Slot caveat:** the originally proposed `44` is occupied by `44_mcp_cortex_architecture_map.md`, and the entire 40-band integer range is taken. A suffixed slot is the convention-correct choice; verify against the band register before creating, and note item 22 — that register is itself stale.

Three Command Center orphans also need homes: the 120KB operator-reviewed County Manifest mockup parked in `_scratch/` (correctly labelled FAKE DATA, but no read-order reaches it); the operator HOLD on new CC complexity, which currently lives only in one `_inbox` file's frontmatter; and three known CC defects with no owning register.

## Item 25 — P1 — the `brokerage*` rename (operator-backlogged 2026-08-14)

**Size: LARGE. Focused task, its own lane, never ridden inside another lane's work.**

The operator ruled the brokerage CONCEPT irrelevant (an early framing that did not survive). The
NAME is dead; the CODE under it is the property reasoning substrate and is fully live.

Measured at source 2026-08-14 in `legacy-design-tools` (counting rule: `git ls-files | grep -i
brokerage`, tracked files only, `main` at time of count):

- **126 tracked files** carry the name; **72 are non-test source**, 54 are tests.
- **8 database tables**: `brokerage_workspaces`, `brokerage_workspace_attachments`,
  `brokerage_workspace_shares`, `brokerage_brief_runs`, `brokerage_install_claims`,
  `brokerage_user_profiles`, `brokerage_wallets`, `brokerage_wallet_ledger` (plus their indexes).
- **54 NON-brokerage files import brokerage modules**, including `app.ts`, `index.ts`, the atom
  registry, `spineZoningDistrict.ts`, `encumbranceService.ts`, and `cadPropertyLookup.ts`.

What the name actually covers, which is why this is not a cosmetic rename: federal and composite GIS
layer ingestion (`brokerageGisFederalLayers`, `brokerageGisCompositeLayers`), parcel keying
(`brokerageParcelKey`), brief generation and its atoms (`brokerageBriefAtoms`, `brokerageBriefLlm`),
**metering** (`brokerageMetering` — the ICC money path), entitlement (`brokerageEntitlement`), and
provenance (`brokerageProvenanceEnvelope`). None of that is about real-estate agents.

**Two known live items sit inside this surface and should be resolved WITH the rename, not before:**
the 0.74 motivated-seller fixture in `brokerageGisCompositeLayers.ts` (`_STATE.md` Q13 — the honesty
work written to retire it was never merged), and `brokerage_install_claims`, which the Radar
entitlement ruling says must become user-aware rather than install-keyed.

**Explicitly NOT part of lane A.** OPS-17 G-10 ruled Smart Files a NEW atom family (operator,
2026-08-14): the existing schema cannot carry the Smart Files promise regardless — single-parent FK,
no `updated_at`, no `version`, no `cid`, no `access_policy` — so extending it would mean rebuilding it
anyway, and an in-place rename across 54 dependents is a high-risk refactor that would compete with
lane A's real work. `brokerage_workspaces` also holds 142 live rows: dead concept, live data.

**Proposed disposition:** a dedicated rename lane, sequenced after lane A ships, with a name ruled by
the catalog-thesis check first (the surface is Smart Site's property substrate, so the name should come
from that vocabulary). Table renames need migrations plus a compatibility window; module renames are
mechanical but must land as one atomic change with the divergence-test discipline of DEV_PROCESS 2.4.

## Item 26 — P2 — merge-time CI cannot execute `.sql` migrations (CORRECTED 2026-08-15)

**This item was filed on a wrong premise. The corrected version is narrower and still real.**

**What the planner filed:** "CI never executes `.sql` migration files." That was concluded from a
negative grep for `drizzle-kit` and is FALSE — the conclusion did not follow from the evidence, and it
is the "an empty result is not an absence" error that DEV_PROCESS names. The lane A planner caught it.

**What is actually true**, verified at source in `.github/workflows/cloud-run-deploy.yml`:

- A migration runner EXISTS: the `Plan + apply pending migrations` step runs
  `pnpm --filter @workspace/db run migrate:prod`, applying pending `lib/db/drizzle/*.sql` against
  `_schema_migrations` tracking, echoing the pending list before and the applied state after. The repo
  deliberately avoids `drizzle-kit push` in favour of this hand-rolled runner, which is why the grep
  missed it.
- That job is `workflow_dispatch`-gated and **unreachable from a merge**, by explicit design. The
  workflow header carries it as a HARD CONSTRAINT: *"Traffic shifts and DB migrations are NEVER coupled
  to `push`."*

**The residual gap, which is the real item:** merge-time CI builds its test database from the drizzle
schema, so green CI proves the drizzle schema, the schema fixture and the pushed test database AGREE —
it still does NOT prove a given `.sql` file executes. A reviewer seeing a merged migration with a green
check can still read execution into agreement. That conflation is what to close.

**Two consequences of the correction:**

1. The gating decision is sound as it stands. Migrations are deliberately an operator action, not a
   merge side effect, and that is the safer posture — not a defect.
2. **The apply mechanism for the held `0078` already exists** as a one-input `workflow_dispatch` action.
   Applying it is a deliberate operator step, not a build.

**Proposed disposition:** a merge-time CI step that runs pending `.sql` migrations against a scratch
database and fails on error — proving executability without touching any deployment database. Cheap,
and it separates "the schema agrees" from "the migration runs" permanently.

## Item 27 — P2 — `legacy-design-tools` consumes a VENDORED atom-contract tarball, not the published package

`artifacts/api-server/package.json:19` reads `"@hauska/atom-contract":
"file:../../vendor/hauska-atom-contract-1.6.0.tgz"`. The tarball exists and 1.6.0 is what installs;
npm latest is `@empressaio/atom-contract@1.22.0` and the source repo is at 1.20.0.

**Nothing is broken** — this is drift, not breakage. The consequence is that a type added to the
published contract does not reach this repo without a dependency change, and the repo also still uses
the OLD package name.

Deliberately NOT fixed inside lane A (OPS-17 A-013): the cutover's blast radius is adjacent to the
backlogged `brokerage*` rename (item 25), and lane A authors its contract type locally with a named
promotion step instead. **Sequence this with or after item 25**; doing both at once is one migration
rather than two.

## Item 28 — P2 — `ACCESS_POLICY_SCHEMA` is re-literalled in three subtrees with no divergence test

Found by lane A during CP1. The same access-policy enum is written out independently in three places in
the atom-contract repo. Per DEV_PROCESS 2.4, one rule with multiple implementations needs a divergence
test or a single source — this has neither, and the five-value union is exactly the kind of constant
that gains a value (it went from four to five once already).

Lane A imports the shared enum rather than adding a fourth copy. **Proposed disposition:** collapse to
one definition and add the divergence test. Contract-repo change, out of any current lane.
