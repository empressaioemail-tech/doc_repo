---
id: factory_cloud_job_execute
title: Factory Cloud Run job execute (PowerShell --args)
date: 2026-08-27
last_updated: 2026-08-27
status: active
owner: property seat
plan_row: F-20
related: [_inbox/2026-08-27_f16_f18_conformant_writer_WDLL.md, _inbox/2026-08-26_f-phase-a_close.json]
---

# Factory Cloud Run job execute

From PowerShell, `gcloud run jobs execute --args` is the single quoted comma form only.

```
gcloud run jobs execute factory-conformant --region=us-east4 --project=hauska-prod-497015 --args='conformant,--apply,--replay'
```

Unquoted `--args=conformant,--apply,--replay` joins to one argv token and the job exits 2 usage. Bracket form `--args=[conformant,--apply]` is a PowerShell wildcard. Same class: `factory-conformant-q67j4`, `factory-conformant-mnjld`, Phase A `factory-landing-import-knl7d`.
