---
id: 2026-09-16_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-16 evening
date: 2026-09-16
last_updated: 2026-09-16
status: active handoff
kind: handoff
owner: nick
from: integration seat, session c4c0203f (closed at context limit)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
  - _inbox/2026-09-16_texas_scaleup_program_scope.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _catalog/program_preambles/OPS-24.md
  - _sessions/2026-09-16g_texas_scaleup_rev4_and_phase0_wave_claude_code.md
snapshot: doc_repo main at the session-close commit (see the session summary); hauska-engine d88cf65 serving (engine-api 00247-san, retrieval-api 00092-lag); hauska-factory 9171279 on main with PRs 157, 158, 159 open
---

# Handoff: the integration seat, Texas scale-up

You are the integration seat in `P:/doc_repo` on `main`: you plan, verify, merge and deploy; lanes
build; the operator (Nick) hand-carries the dispatches you compile. **You are the only planning
session now.** The reports session was retired on 2026-09-16 and its open work is in this roadmap
(A-190). Work in active program management mode: drive, decide, report.

## Read first, in this order

1. `CLAUDE.md`, `ENFORCEMENT.md` (auto-loaded) and your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md`: the living roadmap. **Update it every time a row
   changes state, with a change-log line** (operator request).
3. `_inbox/2026-09-16_texas_scaleup_program_scope.md` rev 4: the plan. Section 4.0 maps each item
   to its row; section 5 is the Phase 0 exit; section 12 is the build order.
4. OPS-16 amendments **A-183 to A-190** (the teardown, the answers, the census, P-253, the deploy,
   P-230's finding, the rulings) and rows **P-252 to P-296**.
5. `_catalog/program_preambles/OPS-24.md`: program law, including the trap list.

## Working rules this session learned the hard way

- **Commits.** Explicit pathspecs; `git add`, `git commit` and `git push` in separate calls.
  `git log -1` before staging.
- **Shared OPS-16.** If another writer leaves uncommitted edits in OPS-16, do not `git add` the
  file. Build your edit on `git show HEAD:<file>` and stage it with
  `git hash-object -w` + `git update-index --cacheinfo`. This session did it eight times; the
  node snippets are in its transcript.
- **Commit gates now run inside git** (P-280): `core.hooksPath = P:/doc_repo/.githooks`, in every
  worktree and on merges. Check with `node scripts/enforcement/git-commit-gates.mjs --check`. A
  refusal is the gate working. Fix the close; never `--no-verify`.
- **Where lane closes land.** Lanes write closes into whatever doc_repo checkout they are rooted
  in: a seat worktree under `P:/seat-worktrees/*/doc_repo`, `P:/doc_repo` itself, or **the second
  clone at `C:/Users/cente/doc_repo`** (P-248/P-261 did). Search all three, copy into
  `P:/doc_repo/_inbox`, and bring any probe artifact a close cites (the gate refuses otherwise).
- **Deploys** are yours.
  - Build from a fresh clone at a pinned SHA and deploy by digest with `--no-traffic --tag`.
  - Probe the tag URL, take a traffic lease in `_catalog/leases/<service>.json`, shift, read the
    traffic JSON by field, then delete the lease.
  - Engine images: `cloudbuild.engine-api.yaml` with `_IMAGE=...hauska-engine-api:<sha>`.
  - Retrieval images: `gcloud builds submit --tag ...hauska-retrieval-api:<sha>` (root
    Dockerfile).
- **Engine calls for verification** need `Authorization: Bearer` with the `HAUSKA_ENGINE_API_KEY`
  secret (read in-process, never printed). They also need these gate-front headers:
  `x-hauska-product: cortex`, `x-hauska-tenant-id`, `x-hauska-package-id`,
  `x-hauska-access-tier: platform-internal`, `x-hauska-gate-credential-id`, `x-hauska-request-id`.
  Site-plan exports:
  - `POST /v1/property-nodes/<id>/site-plan-export/refresh` with `{}`;
  - poll `GET .../site-plan-export`;
  - `GET .../download?format=pdf-site-plan` (bytes live in instance memory);
  - decode with `P:/tmp/hauska-engine-p248-p261/node_modules/.bin/tsx
    P:/tmp/p248-live/decode-live.ts <pdf>`.
- **Stores are read-only for you.** `PGOPTIONS='-c default_transaction_read_only=on -c
  statement_timeout=...'`, index-bounded predicates, secrets from Secret Manager into a shell
  variable, lengths only. `rm -rf` is blocked; use new directory names.
- **Operator preferences.** Dispatches are compiled with `scripts/dispatch.mjs` (waves with
  `--fan-depth 1`); give the operator **file paths**, not pasted blocks. No timeframes. No em or
  en dashes in doc body prose.

## In flight (fired by the operator at handoff)

| Lane | Dispatch | Notes |
|---|---|---|
| P-258 setback campaign (wave, FAN-DEPTH 1) | `_dispatches/2026-09-16_p258-setback-campaign_dispatch.md` | 209 (city, code) units and 54 no-table cities from the census; LDT corpus PRs; grade = census re-run after the writer run |
| P-256 stop false setback absences | `_dispatches/2026-09-16_p256-setback-honest-states_dispatch.md` | Merge only after P-252 is live; then staging apply; every county's setback verdict turns red by design |
| P-262 one edge labeller | `_dispatches/2026-09-16_p262-edge-labeller_dispatch.md` | Fixture `48209:97658`; feeds P-264 |
| P-281 job and heavy-scan leases | `_dispatches/2026-09-16_p281-heavy-leases_dispatch.md` | Unblocks P-263, P-264, P-294 |

## Your queue, in order

1. **The gate rollout (P-292, P-293, P-252, with P-201 riding along).**
   1. Review and merge factory **#159** (P-292) and LDT **#702** (P-293).
   2. **Compile a small lane for hauska-engine** `services/retrieval-api/src/parcel-record-db.ts:160`,
      which narrows verdicts to `pass|refuse|excluded`: it must accept every `excluded-*` string,
      or LDT still sees nothing (P-293's close). Merge and deploy it with LDT before step 5.
   3. Merge factory **#157** (P-252).
   4. Deploy the factory job images that run `publish-gate-sched` and the publish job (read
      `cloudbuild.publish.yaml` and the job list first).
   5. Run the gate scheduler: dry run, then apply, on staging.
   6. Re-run `scripts/p252-rollout-dry-run.mjs` and `scripts/six-county-completeness.mjs`.
      Expect 25 verdicts to flip and no publish-floor refusal.
   7. Production after that.
2. **P-249, the envelope unlock (131,357 parcels).**
   1. Review LDT **#701** and hauska-map **#409**. Read the close's CP1 answer on where the
      polygon comes from for a baked parcel.
   2. Run the staging proof exactly as the mission specifies: build identity by asset
      existence, fresh browser contexts, three branches with four fields each, a rollback
      rehearsal.
   3. Deploy LDT (cortex-api and smartsite-mcp) and hauska-map (Vercel CLI per app).
3. **Republish the six counties** (operator go, A-190), after step 1.
   - One county at a time: `gcloud run jobs execute factory-bastrop-publish
     --project=hauska-prod-497015 --region=us-east4 --wait
     --args=bastrop-publish,--target=production,--county=<fips>` (staging first if the job
     supports it).
   - Each run rewrites the whole county, so check served `bakedAt` moves on a probe parcel.
   - Last publishes: Hays 2026-09-14, the other five 2026-09-10.
4. **P-284** (factory **#158**): review, apply the migration on staging, confirm a real run
   writes a stage record. It is a Burnet precondition.
5. **P-205.**
   1. Marble Falls 78654 reads `indeterminate` on the live coverage check, because the ZIP splits
      between Burnet and Travis.
   2. Decide the fix (P-210's dominance rule), then deploy LDT's already-merged P-205 (PR #690).
6. **Build your own rows:**
   - **P-254:** `surface-probe.mjs` legs over the 39-bucket fixture list, with a `bakedAt` versus
     cell-write leg from P-230;
   - **P-277:** id gate for A-, F- and R- ids;
   - **P-286:** the register as a closed checklist.
7. **Dispatch as lanes free** (keep about six running):
   - P-294 (after P-252 and P-281);
   - P-295 (the atoms measurement first, then design);
   - P-296 (ETJ rollout);
   - P-269, P-270, P-271, P-272 (customer fixes);
   - P-259 (Austin source);
   - P-260 (one registry);
   - P-263 and P-264 (after P-281 and P-262);
   - P-266, P-268;
   - P-273, P-274, P-275, P-276, P-279, P-282;
   - P-285, P-287;
   - the P-291 "not yet verified" note.

## Owed by the operator

- **P-278:** a go for the production database credential rotation (plan at
  `_inbox/2026-09-16_add084_production_credential_rotation_plan.md`); must finish before Burnet's
  first production publish.
- **Cotality:** the contract and credentials, which unblock P-267 and P-283. The exit accepts
  `agValuation` in four counties as `vendor-pending` until then (A-184).
- **An account check for P-243** (the MCP app panel renders in a real Claude client) **and
  P-244a** (`48021:34049` reached `ready` on engine `00247-san` at 19:06:37Z in this seat's run;
  confirm on the product path).

## Known traps, measured today

- The bake that customers read has no trigger (P-230). Until P-294 lands, every ledger fix is
  invisible until someone republishes by hand.
- Site-plan compose fails with a database statement timeout for some Travis and Williamson
  parcels (on old and new code); the USGS 3DEP elevation service returned 502 and 504 today.
  Don't mistake either for a regression.
- The `envelope-canary` tag on hauska-engine-api follows the latest revision.
- `excluded-*` verdict strings are not live yet (the scheduler still runs pre-P-201 code). Both
  readers (retrieval-api and LDT) must deploy their vocabulary fixes before the scheduler does.

## Starter prompt for the fresh session

"You are the integration seat in P:/doc_repo. Read
_inbox/2026-09-16_HANDOFF_integration_seat.md and do what it says, starting with queue item 1."
