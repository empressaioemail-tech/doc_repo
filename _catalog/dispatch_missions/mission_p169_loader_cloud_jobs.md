## Mission — P-169 INFRA: the two loaders that had no cloud execution path get one

You are the deepest worker in OPS-23 wave 2. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself; your own runs are evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running. A Cloud Run
job execution is verified from its execution status (`gcloud run jobs executions describe`,
read by field), never by polling a store while it writes.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`. Create each
from `origin/main` and declare its start commit before you write anything:

- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p169-cad-ingest-job`, branch `feat/p169-cad-ingest-cloud-job`. The CAD loader (`lib/cad-ingest`).
- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p169-footprint-job`, branch `feat/p169-footprint-writer-cloud-job`. The footprint writer (`packages/engine-core/scripts/write-building-footprint-county.mjs` or wherever `write-building-footprint-county.mjs` lives; confirm the path at your start commit).

`P:/legacy-design-tools` and `P:/hauska-engine` are other people's checkouts. Never build there.
You read `hauska-factory` only to copy its job pattern; you do not write there.

### The ruling you are implementing

`_decisions/2026-09-12_loaders_get_cloud_jobs_no_break_glass.md`: no break-glass laptop run;
both loaders get a Cloud Run job mirroring the factory job pattern; each job leaves a run
record naming every input file with its hash; each carries a code-level laptop refusal; the
TCAD file-name shape is a per-county source declaration in the loader's own registry. OPS-16
P-169 (A-132).

### What is true today, verified 2026-09-11 by the P-157 and P-158 lanes (their artifacts are the record)

- `gcloud run jobs list --project hauska-prod-497015 --region us-east4`: 36 jobs, every one
  `factory-<jobname>` wrapping a hauska-factory `src/jobs/*.mjs` script; `us-central1` has no
  jobs (only services). No job wraps `lib/cad-ingest` and none wraps the footprint writer
  (`_inbox/2026-09-11_p157-structural_cp1.json` F-CP1-1; `_inbox/2026-09-11_p158-footprint_close.json`
  leave_behind PRIMARY BLOCKER).
- legacy-design-tools has no Dockerfile, `cloudbuild*.yaml` or CI deploy step under
  `lib/cad-ingest/`; its `package.json:17` defines only `"cad-ingest": "tsx src/cli.ts"`,
  invoked per its own usage header as `pnpm --filter @workspace/cad-ingest cad-ingest --
  --county=... --file=...`, reading a plain `DATABASE_URL` (`cli.ts:254-256`) with no
  staging-versus-production selector. `sources.ts` documents Hays (48209) as a manual download
  plus a local CLI run: the tool's designed mode is a laptop.
- The PACS loader (`lib/cad-ingest/src/pacs/parser.ts`) reads `*_APPRAISAL_INFO.TXT` and
  optionally `*_APPRAISAL_IMPROVEMENT_DETAIL.TXT`; `cli.ts:123-135 discoverFiles` finds them by
  name. The live Travis certified export (`2026 Certified Appraisal Export Supp 0_07182026.zip`,
  557,228,168 bytes, declared tax year 2026) names its entries `PROP.TXT` (4,895,747,376
  bytes), `IMP_DET.TXT` (2,065,539,840), `IMP_INFO.TXT`, `LAND_DET.TXT`, `IMP_ATR.TXT`; byte
  layout confirmed correct against `pacs/layout.ts` (propValYr 2026 read from a live `IMP_DET.TXT`
  record). The names do not match the discovery pattern. Program law: never fix a naming
  mismatch by renaming; this is a source shape and belongs in the registry.
- The footprint writer has no code-level `LAPTOP_WRITE_FROZEN` gate of its own (the factory
  reconcile job has one); the 2026-08-26 freeze names footprint (P-09) in its does-not-unblock
  list. A laptop `--apply` today would run.
- The factory's job pattern to mirror: `Dockerfile.atoms-writer` in hauska-factory, the
  `factory-<job>` naming, the staging-then-production target selector
  (`src/lib/publish-target-env.mjs` or the module the factory uses; read it at origin/main),
  and the run record every factory job writes to its `runs` table.

### The change

1. **A per-county source declaration for PACS exports (LDT).** `lib/cad-ingest/src/sources.ts`
   gains, per county, the export's entry names for the base roll and the improvement detail
   (TCAD 48453: `PROP.TXT`, `IMP_DET.TXT`), and `discoverFiles` reads the declaration before
   any pattern. A county with no declaration keeps today's pattern. A declared name that is
   absent from the archive is a refusal naming the entry, never a silent fallback. Test: TCAD's
   entry list resolves; a made-up county with no declaration behaves as before; a declared but
   missing entry refuses.
2. **A Cloud Run job for the CAD loader (LDT).** A Dockerfile for `lib/cad-ingest`, a
   staging-then-production target selector matching the factory's, and a job
   `factory-cad-ingest` (or the name the factory naming rule yields; say which) in
   `hauska-prod-497015` `us-east4` beside the others. Inputs arrive from a GCS object the job
   downloads (the operator or the lane uploads the public export there; no laptop path into
   the database). The job writes a run record: county, files consumed with sha256 and byte
   size, tax year read from the file, row counts, target (staging or production), started and
   finished. `cli.ts` gains a `LAPTOP_WRITE_FROZEN` refusal on any `--apply` that is not
   running inside the job (detect by the job's own environment marker, never by a flag the
   caller passes).
3. **A Cloud Run job for the footprint writer (engine).** Same pattern for
   `write-building-footprint-county.mjs`: job, target selector, run record naming the staged
   source and the counties written, and the code-level laptop refusal on `--apply`. It takes the
   atoms write-slot lease per AGENT_CONTRACT section 3 like every other atoms writer.
4. **Prove each job can run and can refuse.** On staging: one dry run of each job from Cloud
   Run that leaves its record (pasted by field); one laptop `--apply` attempt for each that is
   refused by code (paste the refusal). Do not load Travis or write footprints in this row;
   P-157 and P-158 run the real loads through the jobs you built.
5. **Secrets.** If either job needs a credential that does not already exist in the project,
   STOP and report the secret name and the exact mount command; the operator approves in-thread.

### Verification, and the falsifier you pre-register

Write down at CP1: *if `gcloud run jobs list` in `hauska-prod-497015` does not show both jobs
after the deploy, or a staging dry run of either leaves no run record, or a laptop `--apply`
of either is not refused by code, the row is not done.* Deploy per the standing decision;
read every job and execution by field name from the JSON, never positionally.

The planner runs `node scripts/surface-probe.mjs --rows P-169 --observations <file>`. The P-169
predicate is observed, not machine: `jobsListed` (both job names as `gcloud run jobs list`
printed them), `stagingDryRunRecords` (the two run record ids), `laptopApplyRefused` (true only
if both attempts pasted a code-level refusal), each with `observedBy` and `observedAt`.

### Close

`_inbox/<date>_p169-infra_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry the two job names, their images by digest, the target selector's
env contract, and the GCS bucket path the loader reads from, so P-157 and P-158 can be
compiled against them.
