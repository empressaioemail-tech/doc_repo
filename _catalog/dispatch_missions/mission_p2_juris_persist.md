# Mission — containment as a chunked job, because the ceiling was the instrument

## Why this card exists

Six heavy scans ran on P2-JURIS. Bastrop and Caldwell emitted. Every Hays attempt
cancelled at every scope tried: full 01 (217s), a 30k slice (218s, confounded by a
plan flip), and the bbox-only 06 (180s ceiling). Four cost mechanisms were proposed
and all four lost. The scout then completed in **2,147 ms** and proved that
enumerating 116,420 Hays keys is cheap, which rules out prop_id scanning without
naming what is expensive.

The lane stopped correctly rather than taking a seventh scan. **The 180s ceiling is
a property of an interactive psql session, not of the work.** Williamson is 2.4x
Hays and Travis 3.3x, so the interactive path could never have reached six counties
even with a perfect Hays run.

This card moves containment onto the P2 job template. That is not raising the
timeout, which stays forbidden. It is the conformant design every other Factory
writer already uses: chunk, ledger, resume, one run row per chunk.

**The cost driver stays un-named, and that is now acceptable** rather than
blocking, because a job does not need to finish inside a statement timeout.

## What already exists — build into it, do not rebuild

Factory #40 `dfe1e247` shipped the scaffold and it is a **refusing stub**:

- `src/jobs/p2-juris.mjs` (127 lines). Guards already built and tested:
  `COUNTY_REQUIRED` / `COUNTY_UNKNOWN`, `RUN_ROW_REQUIRED`, `LAPTOP_WRITE_FROZEN`,
  `WRITER_NOT_ALLOWLISTED`, `WRITER_ALLOWLIST_CAD_ONLY`, `PERSIST_SPEC_SHAPE`,
  `PERSIST_NOT_THIS_CARD`. Its own header states it "does not execute the persist."
- `src/jobs/p2-juris-persist-spec.mjs` (98 lines). `executeContainmentPersist` is
  the seam this card fills. `planCountyPersist` and `PERSIST_SPEC_FIXTURE` exist.
- `src/control/writer-allowlist.mjs`, `src/control/runs.mjs` (`startRun`),
  `src/control/leases.mjs`.
- `src/lib/publish-bake-chunks.mjs` — chunking already exists. **Reuse it.** Do not
  write a second chunker.
- `test/p2-job.test.mjs` (278 lines).

Retire `PERSIST_NOT_THIS_CARD` as part of this card. It is now this card, and a
refuse code that no longer describes reality is a lie the next agent will trust.

## The method is declared and closed

Join-rewrite 01: county equality, `1e-8` floor, jsonb rings. Do not re-derive it,
do not re-open it, and do not reconcile to **357,269** — the 2026-08-30 baseline was
discarded as unrecoverable and that is settled.

Chunk by `prop_id >= X AND prop_id < Y`. A range is estimable where
`IN (SELECT ... LIMIT)` was not; the LIMIT subquery estimated 1,841 against an
actual 30,000 and flipped the planner to Nested Loop. **Never cut a chunk with a
LIMIT subquery.**

Derive bounds per county with the scout, which is proven cheap. For Hays it
returned `lo=100002 hi=159378 county_distinct=116420 chunk_verified=40000` in 2.1s.

## The falsifier, and it is built in

Bastrop and Caldwell were measured interactively under this exact method:

| county | unincorporated | in_city | total |
|---|---|---|---|
| 48021 Bastrop | 50,265 | 11,992 | 62,257 |
| 48055 Caldwell | 14,361 | 10,628 | 24,989 |

**Run those two counties through the job first and require an exact match.** That
is a meaning-shaped check: two independently derived computations, an interactive
query and a chunked job, of the same quantity. If they disagree, the job is wrong
and the disagreement is the finding. Do not tune the job until it matches; diagnose
why it differs.

State this falsifier before running it. A job that produces new numbers for these
two counties has failed, however plausible the numbers look.

## Sentinel prop_id `0`

Scout returned `county_distinct` 116,420 against a Hays parcel count of 116,421.
The difference is the sentinel `prop_id` `'0'` live in `txgio_parcel`. **Handle it
explicitly**: exclude it with a named, recorded reason, or refuse on it. Do not let
it be silently absent from a denominator. A row that disappears between two counts
without being named is how a fabricated total starts.

## What to build

1. Fill `executeContainmentPersist`. Per county: derive bounds, chunk by prop_id
   range, run containment per chunk, write per-parcel disposition.
2. **One `run_event` per chunk**, per the F-20 stage-and-merge design. A count is
   not a record: name the range, the row count, and the wall time.
3. **Resume from the ledger.** A failed chunk resumes; it does not restart the
   county. This is the property the interactive path could never have.
4. Record per-chunk wall time. Over six counties that yields the cost-vs-size data
   six interactive scans failed to produce. **It is data, not a law.** Do not fit a
   curve to it, do not derive a width rule, and do not let a completed chunk license
   a chunk size.
5. TOTALS falls out as a sum over chunks. It becomes measured when all six counties
   complete, and not before.

The output P3 needs is the **per-parcel disposition**, not the aggregate. The
aggregate was only ever a scoping figure.

## Do not

- Do not raise `statement_timeout`. The fix is chunking, not patience.
- Do not persist from a laptop. `LAPTOP_WRITE_FROZEN` exists; keep it armed.
- Do not start without a run row.
- Do not give a CDP a `place_fips`.
- Do not treat `breadth_*` as a jurisdiction source.
- Do not adopt 357,269 or any figure not produced by this job.
- Do not run two writers on the same `(store, entity_type, county_fips)`.
- Do not run Travis or Williamson until Bastrop and Caldwell match exactly and Hays
  completes.
- Do not touch any repository other than the registered Factory worktree you open.

## One check, report the answer

`src/control/writer-allowlist.mjs` (Factory, #40) and
`packages/engine-core/scripts/atoms-writer-allowlist.mjs` (engine, PR #367) are two
allowlists in two repos. They may be correctly separate layers, a job-level gate and
a spawn-level gate, or they may be one rule implemented twice, which is the CTRL-1
shape that already bit this operation once when the compiler and the gate drifted.
Read both and say which. Do not merge or refactor them on this card.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it. `leave_behind` named, `none` is valid. Subagents do not
commit. Verification does not delegate below the lane planner.
