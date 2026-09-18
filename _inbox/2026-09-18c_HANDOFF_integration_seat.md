---
id: 2026-09-18c_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-18 evening
date: 2026-09-18
last_updated: 2026-09-18 (18:40Z)
status: active handoff
kind: handoff
owner: nick
from: integration seat, 2026-09-18 18:40Z (the session that compiled the rest of Wave 2, ran the seat's first Wave 2 items, and applied migration 018)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (THE durable list; read it second)
  - _inbox/2026-09-18_p342_migration_018_RECORD.md (section 3 is your first job)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (now with A-222 P-324 scope and A-224 ruling 5 amended)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live queue)
  - _sessions/2026-09-18b_wave2_compile_and_seat_wave2_claude_code.md
  - _inbox/2026-09-18b_HANDOFF_integration_seat.md (CONSUMED by this session; its traps still apply)
snapshot: doc_repo main 9baa82f5 plus this close (the SmartCity planner committed 7c721502 and 9baa82f5 during this session); hauska-factory 0f4558a4, hauska-engine c41a1482, legacy-design-tools 25d1782f, hauska-map 163fde32 (all mains unchanged since the last close; lane PRs open below); atoms store migration 018 applied 18:12:08Z; setback writer job generation 8 (208fb315); read 2026-09-18 18:37Z
---

# Handoff: the integration seat, 2026-09-18 evening

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. Commit only after showing the operator the
batch. Push before a dispatch is handed out. Add, commit and push as separate calls, by explicit
pathspec. Another writer (the SmartCity planner) commits in this clone and edits
`00_current_state.md`, so stage only immediately before committing, check `git status` on any shared
file first, and never commit a file carrying their uncommitted edit.

**The operator's standing instruction:** everything on the Phase 0 list gets done, properly, in waves.

**Text between tool calls may not reach the operator.** Twice this session an answer given mid-turn
was not seen. Anything the operator must act on (a command to run, a question) goes in the final
message of a turn or in an AskUserQuestion.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md`, your memory index.
2. `_inbox/2026-09-18_phase0_closeout_REGISTER.md`.
3. `_inbox/2026-09-18_p342_migration_018_RECORD.md`, all of it.
4. OPS-16 A-222 to A-224 and rows P-363, P-364.

## 1. Your first job: P-263's apply, the largest production write of Wave 2

**Ruling 11** authorises P-263 county by county, each capped at its measured share. Migration 018 (the
journal and the reversal path) is live on `hauska_mcp` and was verified by violation. What remains is
in the record's section 3. In short:

1. **Build and create the job.** No job can run the apply today. The script refuses to write outside
   a Cloud Run Job holding an `atoms_writer_lease_v2` WRITE scope, and the existing engine jobs
   (`hauska-engine-atoms-writer`, `-depth-warm-remint`, `-footprint-retag`) run other scripts from
   older images. Build an engine image at `c41a1482`. `cloudbuild.atoms-writer.yaml` builds an image
   carrying `engine-core/scripts`; read it before reusing it. Then create `hauska-engine-p263-apply`
   with the apply script as its command. Mount only the secret the script reads: read
   `packages/engine-core/scripts/atoms-store-client.mjs` and the apply script at source to find its
   variable, and mount nothing else. Read the job back by field (JSON).
2. **Fresh dry runs.** One per county, dry run being the default, inside one heavy-scan lease on the
   atoms store host (`scripts/heavy-scan-lease.mjs`). Record `censusDigest`, `measuredShare` and the
   buckets beside the lane's 13:12Z dry runs (Bastrop 0.8465, Caldwell 0.7706, Hays 0.6627, McLennan
   1.0, Travis 15,554 of 172,713, Williamson in the lane's close).
3. **Apply one county at a time.** Pass `--apply --expect-digest=<fresh> --run-id=<id>` and
   `--blast-radius-max-share=<that county's fresh measured share>`, plus the authorisation token the
   dry run prints. **McLennan's share is 1.0**, which the flag's range (0 < share < 1) cannot express,
   so it needs the printed `BLAST_RADIUS_OVERRIDE` token. That is still within ruling 11 because the
   token binds the measured pair; say so in its record. After each county, run `--guard` and check
   that the journal row count equals the dry run's movement, and name the reversal command
   (`--reverse --journal-run-id=<run>`) before the next county. The first real journal id will be 3
   or higher: 1 and 2 went to the rolled-back violation probes.
4. **Watch the customer side.** P-342's lane measured that `alreadyComputedZero = 0` and
   `cannotClassifyPromoted = 0`, so today the surfaces withhold the 30,434 unclassifiable atoms (ruling
   12, P-343 in Phase 1). Grade on the surface afterwards; the probe carries no P-342 row yet (P-197
   predicate debt), so say what you grade with.

Pass the invocation through Bash, not PowerShell. PowerShell's comma operator joined a comma-list
`--args` into one argument this session, and the container refused with usage (execution `n67lb`,
harmless, excluded from failure counts).

## 2. Lanes in flight, and the PRs waiting for you

**Fired by the operator and still in flight:** P-333, P-334/P-329/P-330, P-352, P-361, P-351, P-358,
P-359, P-362, P-363. Several already have PRs (below). **Not yet fired:**

- P-324: recompiled under A-222; all three Property Explorer variables are now set.
- The P-300/P-338 writer half and P-338's surface half.
- P-331: hold until the map lanes merge.
- P-286/P-317: optional; it merges last.

**Open lane PRs at this close, none merged:**

| Repo | PR | Row | Note |
|---|---|---|---|
| hauska-map | #421 | P-354 | |
| hauska-map | #422 | P-339/P-341 | |
| hauska-map | #423 | P-353 | |
| hauska-map | #424 | P-270 address half | shares `atom-chain-to-facets.ts`, `pe-record-to-facets.ts`, `pe-property-atoms.ts`, `baked-facets.ts` with #421 to #423 (the P-270 close's CP1 `crossLaneFileSharing`) |
| legacy-design-tools | #720 | P-354 | |
| legacy-design-tools | #721 | P-270 address half | |
| legacy-design-tools | #722 | P-362 | land before P-324's cortex shift, so that shift is its live proof |
| hauska-factory | #179 | P-354 | |
| hauska-factory | #180 | P-336 | |
| hauska-factory | #181 | P-352 | |
| hauska-factory | #182 | P-361 | with hauska-engine #474 updated in place (head `411094bf` at 18:40Z, was `6b4c3557`) |
| hauska-setback-corpus | #11 | P-354 | |

Sweep every lane's seat worktree for closes before citing one. P-270's close was only in
`P:/seat-worktrees/p270-address-half/doc_repo/_inbox/`; this session brought it and its artifacts to
`_inbox` byte for byte. Its probe patch, `_inbox/2026-09-18_p270-address-half_probe.diff` (sha256
`dda93446`), is for you to review and apply to `scripts/surface-probe.mjs`.

**Merge orders** (each merge re-greened against the base it merges into):

- **hauska-map:** one PR at a time.
- **hauska-factory:** P-333, then P-334/P-329/P-330, then P-352 and P-361, then P-363, then the
  P-300/P-338 writer half, then P-336's writer half. P-354's #179 is not in that sequence; read it
  against P-363 and the P-300 writer before merging, because all three touch the setback writer.
- **Every deploy is the seat's.** The record-fill image rebuild (P-333, P-335, P-352) goes through
  the gate-scheduler procedure. The publish image carries the stale bake pin until P-351 moves it.

## 3. What this session found that changes the plan

- **P-258's re-run was a no-op, and it cannot switch San Marcos.** The setback writer never reopens
  an earned value, and P-256 already applied the 1.4.0 image. The dry runs proposed exactly the
  stored counts in all six counties. 387,237 setback value cells still cite corpus 1.1.0. The numbers
  are right except 6 San Marcos N-CM parcels frozen on legacy NC's row. P-363 fixes the writer, and
  P-349's Hays bake (after P-351) is what customers see. Record `_inbox/2026-09-18_p258_rerun_check_RECORD.md`.
- **Ruling 5 was amended (A-224).** P-326's "servable" 48,829 parcels are 40 cities whose zoning
  layer was never acquired, and some are zoned (Manor and Lago Vista, 20,826 parcels). A default line
  now applies only where the city's ordinance sets one. Zoned cities get a declared refusal naming the
  city, with acquisition in Phase 1 (P-364).
- **The San Marcos coverage re-check HOLDS** (88.38 percent of zoned area under 1.4.0, against 50.47
  percent for the table served today). **The P-255 census re-grade held every prediction**: false
  absences went from 219,472 to 0, and 58,339 parcels remain unaccounted.
- **Hays' bare-id overlap with the roll (172,377 of 173,050) is a collision count**, because the map
  and the roll use two different numbering systems. P-333 therefore restores absences only in
  counties that join on the bare id, and P-351 must check whether the bake's dollar facts use the same
  bare lookup.

## 4. The seat's remaining Wave 2 work, after P-263

P-363's apply after it merges (dry run first; prediction: 387,231 re-stamps and 6 value changes).
P-321's hourly watch once P-334 lands. P-294's dry cycle. The Austin stamp. The Hays join-miss delta
read. The record-fill rebuild under the gate-scheduler procedure. P-349's Hays bake after P-351.
P-350's Williamson publish on the operator's go. Then the exit re-run and the walk.

## 5. Traps found this session

- `probe-close-gate.mjs --selftest` (misspelt) exits 0 silently. The flag is `--self-test`.
- A dry run's `candidateCells` counts proposals, not movement. Movement comes from comparing against
  the stored state.
- gcloud prints an `InsecureRequestWarning` on this host. SSL verification is disabled somewhere in
  the gcloud config. It's not investigated here; note it and do not rely on it.
- `P:/tmp/pe-vercel-env/` holds only `.vercel/project.json` (the Property Explorer ids). It exists
  so the Vercel CLI can reach the project; it is not a clone and must never be deployed from.
- `00_current_state.md` is shared with the SmartCity planner. They committed their snapshot edit
  (`7c721502`) during this close, and this close then added its own pointer paragraph and prepended its
  `last_updated`. Check `git status` on that file before touching it; never commit it while it carries
  their uncommitted edit.

## 6. Owed by the operator

P-350's production publish go (after P-327, P-333 and P-351). The walk (ruling 18). Off the exit path:
P-294's first automated run, Burnet address points, P-278 rotation, the P-243/P-244a account check,
`_STATE.md`'s stale lines.

## Starter prompt

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-18c_HANDOFF_integration_seat.md,
then _inbox/2026-09-18_phase0_closeout_REGISTER.md and _inbox/2026-09-18_p342_migration_018_RECORD.md.
Your first job is P-263's apply: build the engine apply job, take fresh dry runs, then apply one county
at a time, each capped at its measured share, each recorded, the reversal named before the next
county. Then review and merge the open lane PRs in the written order, and deploy. Do it properly, not
fast."
