---
decision_id: 2026-09-12_loaders_get_cloud_jobs_no_break_glass
date: 2026-09-12
owner: Nick (operator); recorded by the integration seat
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-132, P-169, P-157)
  - 90_operations/OPS-23_surface_completion_program
  - _decisions/2026-08-26_ingest_freeze_and_cloud_loader
  - _inbox/2026-09-11_p157-structural_cp1.json
  - _inbox/2026-09-11_p158-footprint_close.json
---

## Decision

No break-glass laptop run for the CAD loader or the footprint writer. Both get a Cloud Run job
under one infra row (P-169), mirroring the factory job pattern, each leaving a run record that
names its input files with their hashes and each carrying a code-level laptop refusal. The TCAD
export's file names (`PROP.TXT`, `IMP_DET.TXT`) are a per-county source declaration in the
loader's own registry, owned by the P-157 lane once the job exists; never a rename and never a
regex widening. P-157 loads the certified 07182026 export for both the base roll and the
improvement file, so the two pair.

## Context

P-157 stopped at CP1 with two live findings: legacy-design-tools `lib/cad-ingest` has no Cloud
Run job, Dockerfile or CI deploy step anywhere (36 jobs in the project, all factory), and the
live Travis export names its files differently from the loader's discovery pattern. P-158 found
the same absence for hauska-engine `write-building-footprint-county.mjs`. The 2026-08-26 freeze
assumed cloud loaders existed and needed parity; two of them do not exist.

## Reasoning

A break-glass run would make the freeze a suggestion on the day two loaders turned out to
have no other path, which is exactly the day it has to hold. The second mechanism considered,
running the loads from a laptop once with a recorded break-glass row, was rejected because the
same gap will recur for every PACS county and every footprint reload; the cost of one job
definition is paid once. The file-name difference is a source shape the loader should declare
per county, which is what its registry is for.

## Reversal criteria

Reverse the no-break-glass ruling only if P-169 has failed its own dry run twice on staging
and a customer-facing row (P-157's structural facts) is blocked on it; then a single recorded
break-glass row per the freeze decision's own reversal text, never a standing exception.
