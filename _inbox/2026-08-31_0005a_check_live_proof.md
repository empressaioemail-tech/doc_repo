---
id: 2026-08-31_0005a_check_live_proof
title: Live 0005a CHECK proof
date: 2026-08-31
last_updated: 2026-08-31
status: active
snapshot: factory-conformant-migrate-q7rd2 on sha256:4bd728c5; template restored to args=migrate
---

# Live 0005a CHECK

Observed on execution `factory-conformant-migrate-q7rd2` (2026-08-31T01:27:04Z to 01:27:26Z), image `sha256:4bd728c5`, Factory store via the job secret. Not a laptop.

`BEGIN`; `INSERT INTO landing_setback_registry` `kind='absence'` `probed_at NULL`; `ROLLBACK`.

Stdout:

```
{"code":"23514","constraint":"landing_setback_registry_absence_probed","msg":"new row for relation \"landing_setback_registry\" violates check constraint \"landing_setback_registry_absence_probed\"","ok":true,"refused":true,"rolled_back":true,"survived":0}
```

The row did not survive (`survived: 0`). Template restored: command `node src/cli.mjs`, args `migrate`, same digest.

0005b remains a separate act on bake neondb.
