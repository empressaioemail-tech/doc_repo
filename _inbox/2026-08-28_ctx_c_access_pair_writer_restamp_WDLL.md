---
id: 2026-08-28_ctx_c_access_pair_writer_restamp_WDLL
title: WDLL — CTX card C: the conformant writer stamps the contract's access pair, and a Factory job re-stamps every legacy-pair atom in place with a count read back
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (jobs/conformant, stages/write, lib/six-field, a new jobs/restamp-access, cloudbuild.conformant.yaml)
plan_row: F-15, F-16, F-10
depends_on: OPS-19 A-023 (canonical access pair at every hop), A-020 (Central Texas first), A-019 (job templates from the build config)
operator_go: 2026-08-28 (standing: "they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: 19_the_instrument_contract.md lines 253 and 254 (discoverability `catalog-listed | unlisted | hidden`; entitlement `anyone-free | anyone-paid | named-parties | owner-only | platform-only`), _blueprint/10_model.md V3 (access never defaulted), _blueprint/40_rule_register.md BP-ACCESS-01, contract 1.30.0 `dist/access/access-pair.js` (tiebreaker)
snapshot: hauska-factory origin/main 26e0c04 · `src/jobs/conformant.mjs` lines 153, 173 and 509 stamp `{discoverability: "public", entitlement: "anonymous"}` on every cad-parcel-roll, identity.alias and flood atom · `src/lib/six-field.mjs` maps the legacy pairs · `src/stages/write/index.mjs` line 90 already recognises `catalog-listed / anyone-free` · atoms already written with the legacy pair in hauska_mcp (`body->>'shape' = 'conformant-v1'`): 48021, 48055, 48209, 48029, 48085, and the running loop's 48309, 48453, 48491 · production Bastrop facets refused 422 on the legacy pair 2026-08-28 08:40Z; LDT PR #519 translates and declares it at serve and at bake as the interim
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-replay on seat/property-ctx-access (from origin/main). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, builds after the running loop finishes, and executes the re-stamp per county.
---

# CTX card C: the contract's access pair at the source, and a re-stamp

Date: 2026-08-28  Status: approved

The first production publish refused every Bastrop facet because the conformant writer stamps a pre-contract access pair and everything downstream copied it. LDT now translates the declared legacy pair at serve and at bake so the six can serve; this card fixes the source and corrects the store, after which the translation is retired.

## Acceptance items

1. **The writer stamps the canonical pair.** Every atom the conformant path emits (cad-parcel-roll and identity.alias in `pipelineFromRows`, the flood atoms in `applyFloodLive`, and any other site `grep -rn discoverability src` finds outside tests) carries `{ discoverability: "catalog-listed", entitlement: "anyone-free" }` for a public record; the pair is validated at the write boundary against the contract's parser (`@empressaio/atom-contract/access` `parseAccessPair`, or the shim's equivalent if the package export is unavailable in this repo, stated which) and a legacy or unknown pair refuses `ACCESS_NOT_CANONICAL` before staging. `six-field.mjs` keeps reading the legacy pairs only where it classifies stored rows; it never produces one. Tests: the staged atoms of a chunk all carry the canonical pair; a candidate carrying the legacy pair refuses at the boundary; the replay fixtures still pass. | check: tests; `grep -rn '"public"' src` shows no producer | grade: [ ]

2. **A re-stamp job, cloud only, per county, counted from the store.** New `jobs/restamp-access.mjs` (`restamp-access --county=<fips> --apply`, laptop refused like every writer): for the county's conformant-v1 atoms in the atoms store whose `body.access` equals a pair in the declared legacy table, it rewrites `body.access` to the canonical pair and records `body.accessRestampedFrom` and the run id, in batches under the county lease v2, with a run row first, a `run_event` per batch (rows matched, rows written), and a termination; it refuses when the read-back count of legacy-pair rows after the run is not zero, and it never touches an atom whose pair is already canonical or is outside the table. Dry run reports counts and writes nothing (and cannot succeed, per the 831fec74 rule). `cloudbuild.conformant.yaml` deploys `factory-restamp-access` from the build config (A-019). Tests with the fake factory: matched and written counts, the read-back refusal, an out-of-table pair left alone, the dry-run refusal. | check: tests; the build file names the job | grade: [ ]

3. **Retirement is a test, not a note.** Add to this repo a test that fails if any producer stamps a legacy pair, and hand back the exact LDT test the planner adds when the re-stamp closes (a legacy pair reaching `refusePayloadAtServe` must refuse again, and the `LEGACY_ACCESS_PAIRS` table empties). | check: the test exists and fails when a producer is reverted | grade: [ ]

4. **Handback.** Diff summary by file, full `node --test` output, the exact execute commands for the re-stamp of one county (dry run, then apply) and how the planner reads the counts back, and `leave_behind`. No commit, push, deploy, or execution; no store write; no secret printed; doc_repo writes limited to the three checkpoint files. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job; the planner does those, and the conformant image is not rebuilt until the running loop (McLennan, Travis, Williamson) has finished.
- Write to any store, staging included; tests use the fake factory.
- Print any DATABASE_URL, secret, or token.
- Change job templates by hand; `cloudbuild.conformant.yaml` is the only place a job's command, args, or resources live.
- Map any pair other than the declared legacy table; an unknown pair refuses.
