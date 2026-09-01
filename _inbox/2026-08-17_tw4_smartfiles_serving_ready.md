---
id: 2026-08-17_tw4_smartfiles_serving_ready
title: TW-4 serving ready — instrument write path live on smart-files
status: active
last_updated: 2026-08-17
applies_to: portfolio
owner: nick
related:
  [
    _inbox/2026-08-17_a029_tw4_ordering_reply,
    _inbox/2026-08-17_tw4_smartfiles_instrument_scope_close,
    _rd_disclosure_twin/08_build_scope,
    _decisions/2026-08-16_instrument_scope_identifier,
  ]
---

# TW-4 serving ready

From: OPS-17 files / Plan Review seat (doc_repo planner)
To: Smart Markets (TW-4 / TW-6)
Date: 2026-08-17 (probes 2026-08-18T02:16Z)

Merge, apply 004, deploy are done, in that order. The instrument write path is on the serving revision. Cortex-prod 0078-0081 was not touched. `P:\smart-files` was not used (still `9159e3c` with the same three dirty files).

## Pins

PR: https://github.com/empressaioemail-tech/smart-files/pull/5 MERGED 2026-08-18T02:14:16Z squash `cdf141cfb944e62720aa155dd836496f4f9d122a` (head was `2e6a38a`). CI run 32090472710 conclusion success.

Neon apply: files project `snowy-bread-83475727` / `neondb` only. CHECKs now include `instrument` on `smart_file_documents.scope_type`, `smart_file_folders.scope_type`, and `smart_file_placements.target_type`. Absence verdict CHECK still `absent-verified | lookup-failed` only. Live documents remain `tenant` 13 / `site` 1 / zero instrument rows (this seat did not write one).

Cloud Run: `smart-files-00006-xwp` @100% in `smart-files-505619` us-east1. Canonical URL `https://smart-files-padrd77ava-ue.a.run.app`. Also answers `https://smart-files-529170139834.us-east1.run.app`. Secrets still both: `DATABASE_URL` and `SMART_FILES_SERVICE_TOKEN`. SA still default compute. maxScale 2. Prior `00005-fdr`.

Worktree used: `P:\smart-files-worktrees\tw4-instrument` detached at `cdf141c`. Dirty checkout `P:\smart-files` untouched.

## Planner probes (list/read only; no instrument write)

GET `/` 200 `{ok:true,service:smart-files}` on both URLs. Anon folders 401.

| query | status | note |
| --- | --- | --- |
| tenant/icc-demo | 200 | 3 folders (g60-mcp-write-probe, plan-review-48021-27303, plan-review-48021-28286) |
| tenant/acme | 200 | 4 folders (g72-probe, g68-probe-181647, jane-qa-room, closing-room) |
| tenant/empressa | 200 | 0 folders |
| tenant/template-city | 200 | 1 folder `folder:tenant:template-city:public-meetings` (unread, not deleted) |
| tenant/g58-probe | 200 | 1 folder `folder:tenant:g58-probe:room` |
| tenant/Mixed_Case | 200 | empty |
| site/parcel:48021:R12345 | 200 | empty |
| jurisdiction/bastrop | 200 | `{folders:[]}` (not 400) |
| instrument/acme | 400 | `invalid_scope_id` |
| instrument/sec_01JCZK8QW9V4T6XH2NBGRPY5MD | 200 | `{folders:[]}` (valid id, nothing written yet) |

## Yours to verify

Create, upload, read back, list on a real `sec_`/`iss_` node against this revision. Confirm the five live tenant slugs still list as above. Provenance stays `instrument-write`. Instrument docs still default tenant-private. TW-6 widens both once with public-free and as-of scoping.

Do not deploy this service. Do not apply anything to cortex-prod.
