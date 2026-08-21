# TW-4 instrument scope (files store)

GROUND-TRUTH 2026-08-18T02:16:40Z — serving `smart-files-00006-xwp` @100% `https://smart-files-padrd77ava-ue.a.run.app`. Origin main squash `cdf141c` (PR #5). Neon `snowy-bread-83475727` CHECKs include instrument. Absence enum still two-value. GET `/` 200. tenant five slugs 200. jurisdiction/bastrop 200 empty. instrument/acme 400 invalid_scope_id. valid instrument node list 200 empty.

LESSON — `--set-secrets` on PowerShell must be quoted; an unquoted comma splits the spec. `--set-secrets` replaces the secret map; keep both DATABASE_URL and SMART_FILES_SERVICE_TOKEN.

DEAD-END — do not deploy from dirty `P:\smart-files` (9159e3c, three uncommitted files, behind origin). Worktree off origin/main after merge.

OPEN — Smart Markets E2E instrument create/upload/read/list against `00006-xwp`. TW-6 still waits on as-of + public-free. G-58b cortex-prod 0078-0081 still OPEN, do not DROP.
