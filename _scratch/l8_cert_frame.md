# L8 cert frame (P-18 / DC-10) — Tier 2 scratch

## GROUND-TRUTH
- 2026-08-12T22:50:01Z live `block13-cert-grade.mjs` score pass=7 total=7 blockPass=true CERT-RESTORE ELIGIBLE (raw txgio frame; SM DATABASE_URL=hauska_mcp + CORTEX=neondb on ep-lucky-truth pooler). Artifact: `_inbox/2026-08-12_L8_block13_live_grade.json`.
- 2026-08-12 eng #327 @ `b2a8706`; `gh run list --workflow block13-cert-grade --limit 1 --json conclusion` → `[{"conclusion":"success"}]` run 31649369819.

## LESSON
- Local mcp-server `.env` CORTEX/TXGIO pointed at stale `ep-little-base` (no `txgio_parcel`). Production SM `CORTEX_DATABASE_URL` on `ep-lucky-truth`/neondb is the live store. Host-check before trusting a local .env alias.
- PowerShell `Tee-Object` writes UTF-16 LE; JSON.parse fails until re-encoded. Prefer native redirection or UTF8Encoding(false).
- Piping cert JSON through `Select-Object -Last N` buffers until process exit; open DB handles can leave the process hung after JSON is already on disk — read the out file, don't wait on the pipeline.

## OPEN
- G2b 188 stale-role cohort still queued (outside DC-10).
- OPS-5 R6 operator visual half for city-scale area-sweep beyond block13.
