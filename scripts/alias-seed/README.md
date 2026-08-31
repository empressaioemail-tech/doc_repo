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
| `build_alias.py` | the generator; 343 lines, `difflib`-based |
| `gen_md.py` | renders the findings markdown |
| `build_sheet.py` | renders the confirm sheet |
| `master_raw.tsv` | store enumeration input |
| `adjacency.txt` | PostGIS county adjacency input |

## Known state, recorded rather than fixed

`build_alias.py` carries a hardcoded `SCR` constant pointing at the original
scratchpad path. It must be repointed to run. Repointed and re-run against these
inputs on 2026-08-31, it reproduced the tracked seed byte for byte, sha256
`7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394` on both sides,
225 rows graded 33 certain / 93 likely / 99 needs-human. So the artifact is
regenerable from files with no store connection.

The seed itself carries a known-bad grading that this generator produces: four
Bruceville-Eddy rows graded unincorporated when the place is incorporated at
`place_fips` 10828. The cause is a **half-name** miss, not hyphenation, and the fix
is a county-scoped, miss-only, single-hit component index. See
`_decisions/2026-08-31_alias_seed_four_rulings.md` and the P4/alias dispatch. **Do
not hand-patch the seed JSON**; fix the generator and regenerate.

Regeneration invalidates the sha256 pinned in
`_inbox/2026-08-31_alias_confirm_sheet.md`, so that sheet and
`_inbox/2026-08-30_alias_seed_findings.md` regenerate with it.

No credentials are present. `gen_md.py` mentions `NEON_API_KEY` only inside a
provenance sentence it writes into its own report; no secret value is stored here.
