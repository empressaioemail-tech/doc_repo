## Mission — P-369: the P-331 drift check's owed rows, landed as one follow-up pair

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
each from current `origin/main` with the SHA declared. You do not merge.

**Precondition, checked first, in one command per repo.** Every row below reads the SIBLING'S MAIN,
so a row whose declaration is not yet on both mains refuses (exit 2) on every PR. The seat merges
P-270's pair (map #426, LDT #727) and P-340's pair (map #427, LDT #729) before this fires. Confirm
each declaration is on both mains before adding its row; a row whose precondition fails is left out
and named, never forced.

### The rows (three sources, all already proven by the lanes that owe them)

1. **The two copies of the check compared with each other** (P-331's close,
   `_inbox/2026-09-18_p331-cross-repo-literal-drift_close.json`, leave_behind 1). Both repos carry
   `scripts/check-cross-repo-literal-drift.mjs`, byte-identical at merge. The row, in hauska-map's copy:

       { id: "check-script-copies", kind: "file", map: { file: "scripts/check-cross-repo-literal-drift.mjs" }, ldt: { file: "scripts/check-cross-repo-literal-drift.mjs" } }

   plus `scripts/check-cross-repo-literal-drift.mjs` added to the sibling sparse-checkout list in BOTH
   `.github/workflows/cross-repo-literal-drift.yml`.
2. **P-270's three situs rows** (`_inbox/2026-09-19_p270-city-half_close.json`, leave_behind "THE PIN'S
   FOLLOW-UP COMMIT"): paste the rows in `_inbox/2026-09-19_p270-city-half_pin-rows.mjs` (ids
   `situs-city-basis-vocabulary`, `declared-absence-verdict`, `city-limits-incorporated-status`;
   file-table entries `MAP_FILES.situsAddress`, `LDT_FILES.situsCompose`). Precondition:
   `export type SitusCityBasis` on both mains. The lane proved them on a trial copy
   (`_inbox/2026-09-19_p270-city-half_pin-trial-check.mjs`): 23 of 23 both directions, four falsifiers.
3. **P-340's setback-source-conflict literal** (`_inbox/2026-09-19_p340-card-route-table_close.json`,
   leave_behind 2, the exact row in its CP2): `MAP_FILES.setbackSourceConflict`
   (`apps/property-explorer/api/_lib/setback-source-conflict.ts`), `LDT_FILES.setbackSourceConflict`
   (`artifacts/api-server/src/lib/buildableEnvelope/setbackSourceConflict.ts`) and the two `const` rows
   (`SETBACK_SOURCE_CONFLICT_TOKEN`, `SETBACK_SOURCE_CONFLICT_NOTE`); the value's sha256 is
   `1ef599c6702e5d59c921f7512eca8d555e5096783a453f8ff7a9f8f940f8c051`.

Keep the two copies of the check byte-identical after all edits (the row from item 1 then enforces
that for good).

### Verify by violation

For each row: a one-sided edit fails naming that row; the same edit on both sides passes; a renamed
declaration refuses (exit 2), never skips. `--selftest` still runs first and is seen failing on a
corrupted fixture. Watch the first scheduled run after both PRs merge (07:17Z / 07:23Z) and record
that it ran.

### Close

Declare: the start commits and PRs, which rows landed and which were left out on a failed
precondition, the merge order, the falsifiers with both directions shown, the first scheduled run
observed, and `leave_behind`.
