# Alias seed instruments (rescued from an ephemeral scratchpad)

These five files generated `_catalog/2026-08-30_breadth_place_alias_seed.json`, which
is tracked canon. **They were never committed.** The commit that landed the seed
shipped four doc files and none of the instruments, and until 2026-08-31 the only
copy of `build_alias.py` lived in one session's temporary scratchpad under
`AppData/Local/Temp`. A search across every seat worktree and `scripts/`, run
unfiltered by `.gitignore`, returned zero other copies.

They are preserved here verbatim so a temp cleanup cannot make tracked canon
unregenerable. This is a rescue, not a refactor.

| file | role |
|---|---|
| `build_alias.py` | the generator; county-scoped component index on hyphenated roster names |
| `gen_md.py` | renders `_inbox/2026-08-30_alias_seed_findings.md` |
| `build_sheet.py` | renders `_inbox/2026-08-31_alias_confirm_sheet.md` |
| `check_component_index.py` | file-based leak + four-row-delta check, self-tested both ways |
| `master_raw.tsv` | store enumeration input |
| `adjacency.txt` | PostGIS county adjacency input |

## Home (ALIAS-REGEN 2026-08-31)

Runnable home stays here, `scripts/alias-seed/` in doc_repo. Rejected alternative:
`sql/p2-juris/` in hauska-factory. The producer writes tracked canon in this repo
from inputs that live beside it; the factory file `_generate_values.mjs` is a
JSON-to-SQL composer, not the seed producer.

`SCR` is gone. Paths are relative to this file. `build_alias.py` writes
`_catalog/2026-08-30_breadth_place_alias_seed.json`. `gen_md.py` writes
`_inbox/2026-08-30_alias_seed_findings.md`. `build_sheet.py` writes
`_inbox/2026-08-31_alias_confirm_sheet.md`.

Reproduction against unmodified inputs on 2026-08-31, before the component-index
change, emitted sha256
`7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394`.

File-based check: `check_component_index.py`.

The half-name miss (CAD situs carrying one component of a hyphenated roster name)
is fixed in the generator by that county-scoped, miss-only, single-hit component
index. Kind is `roster-component`, never `certain`, never `roster-exact`. See
`_decisions/2026-08-31_alias_seed_four_rulings.md`. **Do not hand-patch the seed
JSON**; fix the generator and regenerate.

Regeneration invalidates the sha256 pinned in
`_inbox/2026-08-31_alias_confirm_sheet.md`, so that sheet and
`_inbox/2026-08-30_alias_seed_findings.md` regenerate with it.

No credentials are present. `gen_md.py` mentions `NEON_API_KEY` only inside a
provenance sentence it writes into its own report; no secret value is stored here.
