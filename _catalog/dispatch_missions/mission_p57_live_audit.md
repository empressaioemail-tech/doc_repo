You MAY spawn sub-agents for parallel county probes only. Sub-agents MUST NOT commit, merge, or deploy. You MUST NOT git add / commit / push unless writing doc_repo audit artifacts via planner handoff (prefer leaving JSON for planner commit). You MUST NOT deploy. You MUST NOT atoms --apply. You MUST NOT POST ledger recompute. You MUST NOT invent CC coverage rows. You MUST NOT start P-52. You MUST NOT resume COVER roads. You MUST NOT occupy product worktrees for edits (read-only code peek OK).

Plan row P-57. Occupancy: doc_repo `_inbox/` JSON plus `scripts/atom-full-surface-audit.mjs` if needed. Live GET only.

WDLL: `_inbox/2026-08-22_atom_full_surface_WDLL.md` items 1, 2, 4.

## Mission

Build or extend a file-based audit instrument and run live probes.

### Parcels (fixed set — do not use random clicks)

| Label | parcelNodeId | Why |
| --- | --- | --- |
| gold | `48021:34137` | 908 PINE regression anchor |
| gold-near-pipeline | `48021:10048` | pipeline near hit |
| gold-mud | `48021:102817` | special-district present |
| travis | `48453:281076` | Travis sample (pick from manifest if 404; document substitute) |
| harris | `48201:412831` | Harris sample |
| williamson | `48491:182405` | Williamson sample |
| rural | one FIPS from ledger with geometry satisfied-present and low atom density — name FIPS in close |

### Per parcel probe

1. `GET https://smartsite.cloud/api/spine/property-atoms/{id}/facets` — quote `readPath` and every `*Fact` root field: `state`, `code`, `source`.
2. `GET https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/{id}/facets` — same fields (anonymous; owner should be identified-session-required).
3. Note HTTP status, situs address if present, bake hole (`not_baked`) if 404.

### Instrument

`scripts/atom-full-surface-audit.mjs` must:

- `--self-test` with fixtures: fake "all green CC without scorer" FAILS; honest roads 254 not-yet PASSES (reuse p47 patterns).
- `--live` runs probes above and writes `_inbox/2026-08-22_p47_manifest_grade.json` shape extended or new grade file.
- Read JSON fields by name. Never positional CLI formatters.

### CC baseline

Run `node scripts/p47-manifest-instrument.mjs --live` and cite `computedAt`, roads 254/254 not-yet, six unspecified rails zero satisfied-present.

## Return

CP1: instrument design + falsifiers. CP2: live matrix. CLOSE: `_inbox/2026-08-22_p57_live_audit_close.json` with per-parcel table and per-family summary counts (present / refused / null / missing). leave_behind: gap hints for P-58. Do not implement map layers or scorers.
