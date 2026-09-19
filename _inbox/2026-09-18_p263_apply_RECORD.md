---
id: 2026-09-18_p263_apply_RECORD
title: P-263's envelope-outcome movement applied county by county under ruling 11
date: 2026-09-18
last_updated: 2026-09-19 (03:20Z, Williamson applied after P-365; all six counties done)
status: all six counties applied and verified from the store; Williamson applied 2026-09-19 on the P-365 image (the A-225 hold lifted by the fix merging).
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-263, P-342]
snapshot: hauska-engine c41a1482 (image atoms-writer@sha256:cb59130b3a7153171cafa0476c7e8b6c1be690cdec1cb09183af62b751916f54, Cloud Build 246c4ed3); atoms store ATOMS_DATABASE_URL version 1, database hauska_mcp, host ep-lucky-truth-apodo8hr; heavy-scan lease 749a7208 taken 20:28:34Z; doc_repo main d8c78117 plus uncommitted seat edits
related:
  - _inbox/2026-09-18_p342_migration_018_RECORD.md (the journal and the path this follows)
  - _inbox/2026-09-18_p342-p263-apply-writer_close.json (the lane's 13:12Z dry runs)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (ruling 11, ruling 12)
---

# P-263 apply

## 1. The job

**Image.** Built from a fresh clone of hauska-engine at `c41a1482` (clean tree) with a build config
that builds, pushes and prints the digest and does nothing else. The repo's
`cloudbuild.atoms-writer.yaml` was not reused as-is: its third step redeploys the `factory-atoms-cad`
job onto the new image, which is outside P-263. Digest
`us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/atoms-writer@sha256:cb59130b…916f54`
(tag `p263-apply-c41a1482…`). The build log shows `pnpm install --frozen-lockfile` adding 215
packages.

**Job `hauska-engine-p263-apply`** (us-east4), read back by field after creation: the image by
digest; command `pnpm --filter @hauska-engine/engine-core exec tsx
scripts/p263-envelope-outcome-apply.mts`; no template args; ONE secret,
`SUBSTRATE_DATABASE_URL` from `ATOMS_DATABASE_URL` version `1` (the apply reads
`resolveSubstrateDatabaseUrl()`, which is `SUBSTRATE_DATABASE_URL ?? DATABASE_URL`; the fallback is
not mounted); env `ENGINE_SHA`, `IMAGE_DIGEST`, `CLOUD_RUN_REGION`, `NODE_OPTIONS=--max-old-space-size=14336`;
16Gi, 4 CPU, task timeout 7200 s, max retries 0, one task, the compute service account the other
engine jobs use.

**Verified by violation.** An execution with no args (`m9788`) exited 1 in 16 s with
`COUNTY_REQUIRED`. The script checks the database URL before the county, so reaching
`COUNTY_REQUIRED` also proves the secret mounted.

**The cap, checked against the real guard before use.** `evaluateBlastRadius` passes on
`share <= maxShare` with `share = moves / envelopeAtomsInScope`. The handoff's four-decimal shares
would REFUSE every county (52,704 / 62,260 is 0.846514…, above 0.8465). A self-test against
`writer-blast-radius-guard.mjs` at `c41a1482`, 19 of 19 as expected: the exact share (the double's
own round-trip string) passes; the four-decimal share refuses; one extra atom refuses; McLennan's
1.0 refuses without its token, passes with its exact token, and refuses a token whose counts or
county differ. Each apply therefore passes its county's exact share, and the override token only
where the share is 1.0.

## 2. Fresh dry runs, inside heavy-scan lease 749a7208

The store host was held continuously by lanes from 18:54Z (P-352, then local setback-cell sessions,
then P-333, then P-352 again, then a local session). The lease service has no queue; a take loop
polling every 20 s won the window at 20:28:34Z.

Dry run is the default. Cap `0.99` passed as a dry-run input only (the lane used 0.9). Every run's
args were read back from the execution by field, and every completed run proved it wrote nothing
(two identical population fingerprints).

| County | Execution | In scope | Population | To not-applicable | To pending | of which Tier-1 status | Withheld (ruling 12) | Promoted | Moves | Exact share | Census digest | Lane 13:12Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Travis 48453 | `lqjjr` | 172,713 | 15,554 | 0 | 15,554 | 15,554 | 0 | 0 | 15,554 | 0.09005691522931106 | `a7b9d41a…8898` | identical |
| Caldwell 48055 | `7ztvf` | 24,006 | 21,385 | 170 | 18,329 | 0 | 2,886 | 0 | 18,499 | 0.7705990169124386 | `96a2f8b7…f77d` | identical |
| Bastrop 48021 | `tcnx9` | 62,260 | 56,540 | 47,377 | 5,327 | 0 | 3,836 | 0 | 52,704 | 0.8465146161259235 | `f8993751…9e2c` | identical |
| Hays 48209 | `6d6vg` | 102,143 | 91,401 | 1,645 | 66,044 | 0 | 23,712 | 0 | 67,689 | 0.6626885836523305 | `655ea46b…a2a7` | identical |
| McLennan 48309 | `jqgpw` | 65,814 | 65,814 | 1,739 | 64,075 | 0 | 0 | (not reported when blocked) | 65,814 | 1 | `2efb6770…40ad3` | identical buckets (the lane recorded no digest for the blocked run) |
| Williamson 48491 | `dvt87` | 282,436 | 239,491 | 157,937 | 81,554 | 81,554 | 0 | 0 | 239,491 | 0.8479478536730445 | `e53c197f…67f` | identical |

McLennan's dry run refused at the dry-run cap with `BLAST_RADIUS_EXCEEDED`, as designed, and printed
`BLAST_RADIUS_OVERRIDE=p263-envelope-outcome-apply:48309:65814/65814`. Totals: 490,185 population,
459,751 to move, 30,434 withheld, 0 promoted, 0 with a computed zero, exactly the lane's census.

## 3. Applies, one county at a time

Each apply passes `--apply`, `--run-id=p263-apply-<fips>-20260918`, `--expect-digest=<that county's
fresh digest>` and `--blast-radius-max-share=<that county's exact share>`. Each is then read back
from the STORE, a derivation independent of the job's own report (`atoms_sql.sh`, a session forced
read-only, itself checked by violation: an `UPDATE ... WHERE false` was refused): journal rows by
bucket for the run, every journalled atom's stored `content_hash` against the journal's
`after_content_hash`, and the write-lease history for `buildable-envelope:<fips>`. The first real
journal id is 3, as predicted (1 and 2 were the rolled-back migration probes).

| County | Execution | Moved = journal rows | Buckets in the journal | Stored hash = after-hash | Write lease | Withheld after (unchanged) | Post-apply guard | Reversal |
|---|---|---|---|---|---|---|---|---|
| Travis 48453 | `zwkqq` | 15,554 | 15,554 Tier-1 status to pending | 15,554 of 15,554 | one holder, 131.3 s, normal | 0 | ok | `--reverse --journal-run-id=p263-apply-48453-20260918 --county=48453` |
| Caldwell 48055 | `4p2cc` | 18,499 | 170 unzoned, 18,329 no-district | 18,499 of 18,499 | one holder, 121.1 s, normal | 2,886 | ok | `--reverse --journal-run-id=p263-apply-48055-20260918 --county=48055` |
| Bastrop 48021 | `2pw76` | 52,704 | 47,377 unzoned, 5,327 no-district | 52,704 of 52,704 | one holder, 410.9 s, normal | 3,836 | ok | `--reverse --journal-run-id=p263-apply-48021-20260918 --county=48021` |
| Hays 48209 | `p9tl8` | 67,689 | 1,645 unzoned, 66,044 no-district | 67,689 of 67,689 | one holder, 458.0 s, normal | 23,712 | ok | `--reverse --journal-run-id=p263-apply-48209-20260918 --county=48209` |
| McLennan 48309 | `pzklp` | 65,814 | 1,739 unzoned, 64,075 no-district | 65,814 of 65,814 | one holder, 396.4 s, normal | 0 | ok | `--reverse --journal-run-id=p263-apply-48309-20260918 --county=48309` |

**McLennan under ruling 11.** Its measured share is 1.0 (every one of its 65,814 envelope atoms is in
the movable population), which `--blast-radius-max-share` cannot express (0 < share < 1). It ran
with the token its own fresh dry run printed, passed as an execution-only env override
(`BLAST_RADIUS_OVERRIDE=p263-envelope-outcome-apply:48309:65814/65814`, read back on the
execution), `--expect-digest` pinned to the fresh digest, and a declared `--blast-radius-max-share`
of `0.999999` that the override path does not use. The artifact reads `basis:
override-authorised` with the authorised pair 65,814 / 65,814. That is inside ruling 11: the token
binds the writer, the county and both measured counts, so the cap is exactly the measured share and
any other count or county refuses (shown in the self-test). The run's own artifact records both the
declared number and the token.

After five counties the journal holds 220,260 rows, ids 3 to 220,262: every id is accounted for.

Travis was also graded with a standalone `--guard` (`f498n`): population 0, the guard does not fire.
The apply's own post-apply guard runs the same census logic on a fresh read, so from Caldwell on the
standalone `--guard` runs once per county after the last apply rather than between counties; the
store read above is the second derivation between counties.

Write rate, measured from the journal's first and last `applied_at`: 7.8 to 8.4 ms per atom.

Standalone `--guard`, after the fifth apply (21:25Z to 21:33Z): Caldwell (`klwkg`) 2,886, Bastrop
(`q6h92`) 3,836 and Hays (`lbbxz`) 23,712 fire on `unclassifiedByReason` only, which is each county's
withheld cohort exactly, with every movable bucket 0; McLennan (`24c2k`) and Travis (`f498n`) read 0
and do not fire. Firing on the withheld cohort is the designed state until P-343 (the apply's
`censusGuardWouldFire` names it).

## 4. Williamson: held for P-365 (operator, A-225)

Williamson's 239,491 moves at the measured rate are about 32 minutes of writes. `applyCountyMovement`
takes its `(write, buildable-envelope, 48491)` lease once with the 15-minute default TTL and never
renews or re-checks it, so the second half of the county would write after the lease expired, and
the file's "a write without a held lease fails closed" would hold only for the first batch.
`reverseMovementRun` takes no lease at all. What was checked before asking: no scheduled job can take
that scope (`factory-conformant` takes only `cad-parcel-roll:*` and `flood-hazard-fact:*`; the
`reap` override works on the factory store's `runs` and `leases`; the hourly gate mounts no atoms
credential), and no `buildable-envelope` write scope had ever been taken before these applies (lease
history read 19:58Z, 0 rows). Running anyway would have rested on a detector (the lease history read
afterwards), not the refusal ruling 11 relied on.

**The operator held Williamson for the fix.** P-365 is carded and compiled
(`_dispatches/2026-09-18_p365-apply-lease-heartbeat_dispatch.md`): every batch asserts and extends the
lease through storage's existing `lockAndHeartbeatLease` and refuses when it is no longer held; the
reversal takes and heartbeats the same scope. Williamson's fresh dry run (`dvt87`, digest
`e53c197f…67f`) is the expectation the rebuilt image must reproduce before its apply. Nothing
customer-visible waits on it: Williamson's publish is P-350 (Wave 3), and its false claim is not
served today (0 promoted atoms).

The heavy-scan window was released by capability token at 21:35:13Z and read back as `released`.

## 5. State after this record

| | |
|---|---|
| Applied | 5 counties, 220,260 atoms, journal ids 3 to 220,262 (every id accounted for) |
| Withheld, untouched (ruling 12) | 30,434 (Caldwell 2,886, Bastrop 3,836, Hays 23,712) |
| Held | Williamson 48491, 239,491 atoms, for P-365 |
| Job | `hauska-engine-p263-apply` stays, pinned to `c41a1482`'s digest; P-365's rebuild replaces the image |
| Customer grade | the probe carries no P-342/P-263 row yet (P-197 predicate debt); the store reads above are the grade of record for the movement, and the surfaces withhold the moved states' predecessors already |

## 6. Williamson 48491, applied 2026-09-19 after P-365

**The hold lifted by its fix, not by a waiver.** P-365 merged as hauska-engine `21375ef9` (#477,
green against current main `650540ca`), and the apply image was rebuilt from a fresh clone at that
commit: `atoms-writer@sha256:f5d0691e4ca1f403b21c415e6ef892f9fff202a3b4ad2bfec8ac9a763eca46a7`
(Cloud Build `b7aebfa2`). The job `hauska-engine-p263-apply` was updated to it (generation 2) and
read back by field. The cap is unchanged by P-361: a caller-declared exact share, with the token
needed only above it.

**Inside heavy-scan lease `7eab8f39`** on the atoms store host (taken 02:25:58Z, renewed to
04:09:35Z, released 03:18:54Z).

**Fresh dry run** `r577x` (02:27:14Z to 02:31:28Z, args `--county=48491 --blast-radius-max-share=0.99`
read back): census digest `e53c197fd82d61dbfa3b58990b542bec326e6b1bf93b85d301eab147aa8cf67f`, the
same as `dvt87`'s. Population 239,491 (157,937 to not-applicable, 81,554 to pending, all Tier-1
status), 0 promoted, 0 computed zero, share 0.8479478536730445. Two identical population
fingerprints, so it wrote nothing.

**Apply** `4hr57` (02:34:04Z to 03:16:48Z), args read back: `--county=48491 --apply
--run-id=p263-apply-48491-20260919 --expect-digest=e53c197f...cf67f
--blast-radius-max-share=0.8479478536730445`. The artifact: moved 239,491, journal rows 239,491,
2,395 batches, `blastRadius.basis within-threshold`; post-apply guard population 0, `ok`. **The
lease report P-365 added:** `heartbeats 2395` (equal to the batches, as P-365's close predicted),
`lastExpires 03:30:13Z` (after the last write), released `normal`, no refusal.

**Read back from the store**, independently of the job's report:

| Check | Result |
|---|---|
| Journal rows for the run | 239,491, distinct atoms 239,491, ids 220,263 to 459,753 |
| Buckets | unzoned to not-applicable 157,937; Tier-1 status to pending 81,554 (the dry run's) |
| Stored `content_hash` equals `after_content_hash` | 239,491 of 239,491, 0 mismatched, 0 missing |
| Write lease `buildable-envelope:48491` | one holder (`4hr57`), taken 02:34:49Z, released 03:15:14Z, **2,424.5 s**, reason `normal` |
| Whole journal | 459,751 rows, ids 3 to 459,753, 0 reversed: every id accounted for |

The write lease was held for 40 minutes against a 15-minute TTL. Before P-365 this run would have
written its last 25 minutes unleased. After it, the lease was re-asserted in each of 2,395 batch
transactions.

**Reversal:** `tsx scripts/p263-envelope-outcome-apply.mts --reverse
--journal-run-id=p263-apply-48491-20260919 --county=48491` (P-365: the reversal also takes and
heartbeats the county's scope).

## 7. State after section 6

| | |
|---|---|
| Applied | all 6 counties, 459,751 atoms, equal to the lane's census; journal ids 3 to 459,753 |
| Withheld, untouched (ruling 12) | 30,434 (Caldwell 2,886, Bastrop 3,836, Hays 23,712) |
| Job | `hauska-engine-p263-apply` on the P-365 image `f5d0691e` |
| Customer grade | unchanged: the probe carries no P-342/P-263 row (P-197 predicate debt); the store reads are the grade of record |
