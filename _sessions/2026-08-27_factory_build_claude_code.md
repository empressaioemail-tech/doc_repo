---
date: 2026-08-27
topic: The Factory build, from the write-path diagnosis to the conformant-writer handoff (Factory scope only)
agent: claude_code (planner, integration seat)
plan_row: OPS-19 F-00 to F-20; OPS-16 P-81 to P-84
span: 2026-08-26 to 2026-08-27
excludes: P-85 Records Request, P-86 to P-88 Smart Site MCP, the E-2 engine-api deploy and the gate-header finding (recorded in OPS-16 A-038 and A-039), which ran in the same session and have their own records
---

# Session: the Factory build

## Summary

The session opened on a review prompt about partitioning the atoms bulk-writer lease and ended with the Factory's first stage runner proven in the cloud, old-shape writes ended for good, and the conformant writer carded for a fresh lane. In between the operator stopped all laptop ingest, ruled that the whole process be re-engineered as a cloud machine with its own repository, store, console, and plan of record, ruled option A on the existing writer, and retired the drain lane and a stood-down writer lane after they collided in one worktree because the planner had instructed both. Every number below was read at source by the planner unless it says otherwise; the ones the planner could not read are named as the lane's.

## What was found first

The write path was not lease-bound, it was RTT-bound. `writePropertyAtomsBatch` was fast; `writeAtomLinks` (engine #356) issued one INSERT per applies-to link at 44 ms round trip from the laptop, so 5,000 links cost 220 s and the path ran at 21 atoms/s. Three independent derivations agreed. The lease partition the review proposed was never the lever; the operator killed the W5-A runner and let the writer finish (Bexar later read 703,257 = roll, which is why no resume ever ran).

The first Factory design used the store's current shape and the operator caught it ("what information are you using on what the shape should be?"). The design was rewritten to the model law (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `20_pipeline.md`, `40_rule_register.md`, `24`, `51`), which is now the first line of every Factory card.

## Decisions (records in `_decisions/`)

Ingest frozen and the loader moved to the cloud (`2026-08-26_ingest_freeze_and_cloud_loader`). The Factory program: own Neon project in the store's region, own repository `hauska-factory`, own plan of record OPS-19 with the `F-` prefix registered, the console as Smart Site Factory in `hauska-map/apps/factory` on its own Vercel project, staging first, tiles as fabric, three Texas finish lines, proof counties, CTX and national holds lifted (`2026-08-26_factory_program_and_hold_lifts`). The model law adopted as the shape and option A on the existing writer: fix the path, freeze new fills on it, finish only Bexar, no new county on the old shape (`2026-08-26_factory_model_law_and_option_a`). Later the same night, by amendment rather than decision: stage-and-merge added as F-20 after the write-rate readings; old-shape writes ended permanently (OPS-16 A-042); the conformant writer cut for a fresh lane with F-15 requested from the substrate seat (OPS-19 A-005).

## Shipped and verified

Phase A (F-00, F-01, F-03, F-04, F-05), closed as an honest partial 2026-08-26 and its leave-behinds closed 2026-08-27: the repository, the store `withered-surf-26870298` created in us-east-1 after the Neon MCP tool put the first one in us-west-2 (query round trip 5 ms, connect 773 ms; the under-5 prediction failed by definition and was accepted), the control plane with run ledger, leases, holds and termination records, nine Texas landing tables matched on two-count ledger rows (`txgio_parcel` 16,428,786 both sides), the console on `smart-site-factory.vercel.app`, the county ledger publish job. Item 20 stayed not-met: the publish job writes a table the served ledger does not read; an LDT route change under F-05.

The option A drain (P-81 to P-84, F-02): BP-WRITE-01 write boundary (refuses bare keys, sentinels, decimal-padded grammar, foreign DID namespaces, body versus column), batched `atom_links`, lease v2 `(scope_type, scope_id)` token-bound with the v1 take retired by refuse, `--run-id` required for any apply, every county but 48029 refused as `OLD_SHAPE_FILL_FROZEN`, `AGENT_CONTRACT.md` section 3 amended to OPS-19 rule 7 (marker v1890f0bb). Engine PRs #362 (7012ac7), #363 (b402c8b), #364 (2c90b99) merged on the `typecheck + test` conclusion string after one red typecheck the lane's local vitest had not run. Migrations 010 (access-policy defaults dropped, ICC backfill 8,731 rows to platform-internal) and 011 (`atoms_writer_lease_v2`) applied on `hauska_mcp` as recorded Factory runs and verified by direct catalog reads.

The F-02 stage runner `factory-atoms-cad`, generation 2, in us-east4 on digest `sha256:5a3bf94d…` from engine main 2c90b99: no `APPLY`, `COUNTY`, or `FACTORY_DATABASE_URL` in its environment, secrets on the direct host, run row written by the Factory before the writer starts, args per execution, counts read from the store. Five recorded executions with their args read by field: no-args refusal, `LEASE_REQUIRED`, `OLD_SHAPE_FILL_FROZEN` on 48021, a dry run, and one 999-row canary. The stood-down lane's parallel job `factory-atoms-writer` produced its own five executions and a canary before A-003; it was gone from us-east4 by 10:35Z (actor unrecorded) and its absence was proven by `NOT_FOUND` on describe and execute.

The console's control key was found compiled into the public bundle as a 32-character literal bound to the Bearer header at a URL answering 200 unauthenticated, with `POST` verbs live on it; rotated the same night, the new bundle carries no literal, every unauthenticated verb returns 401. The operator-login proxy is the first item of the next console card (F-04).

## Numbers, stated as what they are

Bexar 48029: 703,257 atoms against a 703,257-row CAD roll, read by the lane's `atoms_built` on the dry run and both canaries; the planner's own re-count by `entity_id` prefix was refused after four minutes on the 100M-row table and is not claimed. The canaries were rewrites of existing rows, not new rows.

Write rate through the fixed row-at-a-time path, in-region: 149.0 atoms/s (6,706 ms writer wall, stood-down job) and 67.4 atoms/s (14,821 ms, recorded job) on two 999-row chunks, against 21 atoms/s before the fix, a pre-registered prediction of 300, and a floor of 150. Both failed the prediction and the floor; both are cold chunk-scale readings and the 2x spread between them says the chunk was too small to grade. Per the card's own rule the answer is stage-and-merge, now F-20, pre-registered at 300 atoms/s sustained on 100,000 or more rows. Nothing on the old path was tuned.

## Mistakes, named

Two planner instructions sent ten minutes apart told the drain lane and a new agent to build the same runner in the same registered worktrees (OPS-19 A-003). Two jobs, two canaries on the same county, one staged deletion of the other's files. Ruled to one job; both lanes later retired by the operator; every lane now has its own worktree and the retired lanes' salvage is listed, not reused in place.

The planner wrote "F-18 stage-and-merge" in several records; F-18 is intensional demotion. Corrected by A-005 with F-20 added; the earlier rows stand as written because the tables are append-only.

The dispatch compiler's preamble extractor used `\Z`, which JavaScript reads as a literal Z, so it over-ran into a seat block on 08-24 and truncated to six lines on 08-26; three Factory-era dispatches were stamped against the truncated block. Fixed with a shared extractor and a self-test that proves the legacy pattern fails both ways; every dispatch since carries the full standing-decisions block.

A lane's local vitest 19/19 did not typecheck; CI did. CI is the grade, and the lane said so itself at the next handback.

## Open (next)

The conformant writer card `_inbox/2026-08-27_f16_f18_conformant_writer_WDLL.md` for a fresh property lane on `seat/property-conform` worktrees: F-16 resolution, F-17 reconcile and promote, F-20 stage-and-merge write, F-19 replay proven inside it, F-18 flood demotion first; one Texas source (Bastrop CAD roll) end to end on the new shape beside the old rows; no publish, no repoint. Dispatch `_dispatches/2026-08-27_f16-f18-conformant_dispatch.md` at preamble v6f9d139b. F-15 contract types requested from the substrate seat in stage order (`_inbox/2026-08-27_f15_contract_types_request.md`); shims allowed only with a self-defeating check. After that card: F-10 drains Texas through the writer, then F-06 publishes. Still open from Phase A: item 20 (F-05), the console proxy (F-04). Everything the store holds is still the old shape and still serves.

## Docs touched (Factory scope)

`90_operations/OPS-19_factory_plan_of_record.md` (baseline, A-000 to A-005, grade log through the F-02 close); `_inbox/2026-08-26_factory_program_design.md` (rewritten to the model law; section 12 status; unknown outcomes); `_inbox/2026-08-26_cloud_loader_design.md` and `_WDLL.md`; `_inbox/2026-08-26_factory_phase_a_WDLL.md` (finish card); `_inbox/2026-08-27_f02_writer_job_WDLL.md`; `_inbox/2026-08-27_f16_f18_conformant_writer_WDLL.md`; `_inbox/2026-08-27_f15_contract_types_request.md`; the three lane closes; `_catalog/plan_registry.json` (OPS-19); `_catalog/seat_register.json` (drain, writer, factory-console, conform worktrees); `_catalog/repo_intents.md` (`hauska-factory` row); `_state/shared/STANDING_DECISIONS.md` (Factory line); `00_current_state.md`; `25_atom_architecture_reference.md` (supersession note); `90_runbooks/AGENT_CONTRACT.md` (section 3, by the drain lane under item 14); `scripts/lib/standing-decisions.mjs` and its test. Commits `41fadaf` through `4a02358` on main.

## Model

Claude (Fable 5) as planner in the integration checkout; three Claude Code lanes on the property seat (Phase A, drain, writer job) hand-carried by the operator; verification never delegated below the planner.
