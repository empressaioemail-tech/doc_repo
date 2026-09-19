---
id: 2026-09-19_record_fill_and_publish_deploys_RECORD
title: Record-fill image (P-333, P-335, P-352) deployed under the gate-scheduler procedure; publish, retire-phantom and P-263 apply images rebuilt, record
date: 2026-09-19
last_updated: 2026-09-19
status: record-fill DONE 02:14:25Z (graded PASS, trigger resumed). Publish image rebuilt (P-327, P-334, P-351, P-361 factory half). P-263 apply image rebuilt (P-365). retire-phantom-record build submitted.
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-333, P-335, P-352, P-327, P-334, P-351, P-361, P-365, P-350]
snapshot: hauska-factory 415d3212 (record-fill and retire-phantom builds) and f5f758d6 (publish build); hauska-engine 21375ef9 (P-263 apply image); legacy-design-tools 03bb424a (the publish lane's bake pin); doc_repo 31f74990 plus uncommitted seat edits
authority: register section 3b (the record-fill image under the gate-scheduler procedure; the publish rebuild after P-351); the operator's go of 2026-09-19 ("go on your list and also go on the williamson publish if its ready")
---

# Tonight's deploys, 2026-09-19

## 1. Record-fill image under the gate-scheduler procedure

**What ships.** `cloudbuild.parcel-record-fill.yaml` builds one image and redeploys four job
definitions: `factory-parcel-record-fill`, `factory-flood-ingest`, `factory-parcel-r4-companions`
and `factory-publish-gate-sched`. Source: a fresh clone of hauska-factory at `415d3212` (clean tree,
equal to origin/main at build time). The live image was `7152d3b0` from `85d63e8d` (#175).

Commits between the two: P-327 (#177), P-335 (#178), P-334 (#183), P-329 (#184), P-330 (#185),
P-333 (#186), P-352 (#181), P-361 (#182), P-363 (#187).

**What reaches the gate scheduler, measured rather than assumed.** A file instrument
(`import_graph.mjs`, static and dynamic relative imports; refuses when the walk finds only its
entry) resolved `src/jobs/publish-gate-sched.mjs` to 21 files. Intersected with
`git diff --name-only 85d63e8d..415d3212` (61 files), exactly one is on the gate's path:
`src/control/writer-allowlist.mjs`, where P-352 adds the `retire-phantom-record` entry. That changes
no verdict. Positive control: the same instrument on `parcel-record-fill.mjs` finds the four files
P-333, P-335 and P-352 changed. The build file's own `_ENGINE_SHA` (`a38cbb22`) and `_LDT_SHA`
(`46e1a5a1`) are unchanged in the range.

**Pre-registered grade**, the same as #175's: (a) the hand cycle completes; (b) its heavy-scan lease
is on the canonical host key `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`; (c) every
(county, rail) verdict and unaccounted count equals the baseline, because no cell is written between
the two runs. **Falsifier:** any differing verdict or count, a lease under a non-host key, or a failed
execution. Any of those stops with the trigger paused.

**Log.**

- 01:02:16Z `factory-publish-gate-sched-hourly` PAUSED (read back `state PAUSED`). The 01:00Z run
  `7szh8` had already started on the old image, so it was left to finish, as in #175.
- 01:08:05Z build `3b478847-33d9-4ef1-a356-9161d23d1fca` from the fresh clone; SUCCESS 01:10:59Z.
  Read back by field (`job_readback.mjs`, checked by violation: the same files against the old
  digest exit 1): all four jobs on
  `sha256:4138ecfd5404d7345dc8b37ce7d9231a92a1803fde73db941b81cf9169ecf423`, each job's
  `IMAGE_DIGEST` equal to its image; `ENGINE_SHA a38cbb22` on the fill and the gate. Generations:
  fill 34, flood 30, r4 26, gate 17.
- 01:30:08Z `7szh8` completed, `succeededCount 1`.
- 01:35:42Z BASELINE `_inbox/2026-09-19_record_fill_deploy_verdicts_before.csv`: 390 pairs, every row
  from `7szh8`'s run `2f9ec81e-cdb0-44f1-8105-a55978273146`, sha256 `fbce5acbb488de01...`.
- 01:39:26Z execution `factory-publish-gate-sched-qcm5b` on the new image, with the scheduler's own
  arguments (read back: `publish-gate-sched --county=48021 --county=48055 --county=48209
  --county=48309 --county=48453 --county=48491 --apply`).
- 01:45:33Z grade (b) PASS: lease `b6eb16e4` on `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`,
  holder `factory-publish-gate-sched-qcm5b`, run `007022c5-e9cd-4060-aa6e-a372c428a301`.
- 02:09:42Z `qcm5b` completed, `succeededCount 1`: grade (a) PASS.
- 02:13:17Z `scripts/gate-cycle-compare.mjs` (self-test 10 of 10 first):
  `GATE CYCLE PASS pairs 390 identical 390 failures 0 unwritten 0` against baseline sha256
  `fbce5acbb488`, since 01:39:26Z. JSON `_inbox/2026-09-19_record_fill_deploy_gate_cycle_compare.json`.
  Grade (c) PASS. The falsifier did not fire.
- 02:14:25Z trigger RESUMED (read back `state ENABLED`, next run 03:00:00Z). Skipped by this
  procedure: the 02:00Z hourly run.

**Result.** P-333, P-335 and P-352 are deployed. No fill has run on the new image yet; the next
section covers the fills.

## 2. Publish image (P-327, P-334, P-351, P-361 factory half)

Source: a fresh clone of hauska-factory at `f5f758d6` (P-351's factory half, #188), clean. Before
the build, the seat re-pointed #188's `_LDT_SHA` from the LDT PR head `5c93997f` to LDT #723's merge
commit `03bb424a` (factory commit `e8d88c91`, pushed to the PR branch). The only difference between
the two LDT commits is the three main commits the pin's comment already named (P-354, P-270 address
half, P-362): 14 files, none of them P-351's (`git diff --name-only 5c93997f 03bb424a`, each file
changed by `25d1782f..2e7ca7c4`). `check-ldt-sha-comment-presence.mjs`: PASS.
`check-ldt-pin-staleness.mjs --ldt-root <LDT main 03bb424a>`: PASS ("pin already equals target").
The same check from factory main at the old pin `bae48d40`: FAIL (87 commits in range), so the
check can fail.

No Cloud Scheduler trigger targets a publish job (the only triggers are the gate, and
`factory-conformant-reap`), and the build deploys job definitions only.

- 02:09:29Z build `fef0fb9f-3727-42c5-bdb4-63e3a7dcb94f`; SUCCESS 02:18:45Z. The build log shows
  `HEAD is now at 03bb424 P-351: ...`, so the bake inside the image is LDT `03bb424a`.
- Read back by field: `factory-publish-migrate` (54), `factory-staging-reset` (54),
  `factory-bastrop-publish` (54), `factory-republish-on-change` (4), `factory-verify-walk` (52),
  `factory-dollar-fields-patch` (32) and `factory-retired-share-watch` (2) all on
  `sha256:502e973476fde70a044256fe29dc78eaf46ea0f4633f8537c075848936ad78bb`, `IMAGE_DIGEST` equal.
  Previous: `afbd0bbc`.

## 3. P-263 apply image (P-365)

Source: a fresh clone of hauska-engine at `21375ef9` (P-365, #477), clean. Build config: the
build-and-push-only config of 2026-09-18 with the tag moved to `p263-apply-21375ef9...`.

- Build `b7aebfa2-60ed-4b07-a2d8-5a7c4385b49c` SUCCESS 02:00:39Z, digest
  `sha256:f5d0691e4ca1f403b21c415e6ef892f9fff202a3b4ad2bfec8ac9a763eca46a7`.
- `hauska-engine-p263-apply` updated (generation 2) and read back by field: image by that digest,
  `IMAGE_DIGEST` equal, `ENGINE_SHA 21375ef9`, one secret `SUBSTRATE_DATABASE_URL <- ATOMS_DATABASE_URL:1`,
  command unchanged, timeout 7200 s, retries 0.
- The cap is unchanged by P-361: `--blast-radius-max-share` is still a caller-declared exact share,
  and the token is needed only above it.

Williamson's apply is recorded in `_inbox/2026-09-18_p263_apply_RECORD.md` section 5.

## 4. retire-phantom-record job (P-352 item 3)

- 02:54:43Z build `198acb41-2a44-4499-a0ad-a2acfe9f0953` from the `415d3212` clone. That clone
  differs from factory main (`f5f758d6`) only in `cloudbuild.publish.yaml`, which this job does not
  use. The template args carry no `--apply`.
