You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud scheduler create / update / run. Do not POST recompute. Do not atoms --apply.

Plan row P-14. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md items 1 and 2.

## Mission

1. Probe Command Center County Manifest vs live GET. URLs: `https://cmdcenter-blush.vercel.app` (panel county-manifest) and `https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger` with SERVICE_API_KEY from secret `SERVICE_API_KEY` project `legacy-design-tools-prod`. Do not print the key. Parse JSON by field name. Quote GET `summary.computedAt`, `servedAt`, `materializationAgeMs`. Quote what the CC page actually shows (computedAt in HTML/JS, or STALE, or missing). TLS: node --use-system-ca. Read gcloud as JSON by field name.

2. Inventory heartbeat executors. Planner already listed Cloud Scheduler `us-central1` on `legacy-design-tools-prod` and got `[]`. Re-check that location plus any other listed locations. Search the LDT repo for cron / Cloud Scheduler / materialize on a timer. Name the bypass: manual POST `/api/county-ledger/recompute?probe=skip`.

3. File a job spec JSON at `_inbox/2026-08-21_s3-heartbeat_job_spec.json`: schedule, URI, method, auth shape (OIDC vs API key), SLA vs the 15-minute STALE threshold, what fails when it misses, what bypasses it. Do not create the job.

## Return

CLOSE with CC-vs-GET stamps, scheduler inventory, path of the spec. leave_behind: planner creates the job.
