You MUST NOT spawn sub-agents. Do not commit. Do not git add/commit/push.

Plan row R-02. Seat integration. Worktree P:/doc_repo.

## Mission

R-02b quarantine half, now that R-01 bounded the canon set. OPS-18a acceptance item 6.

## Do

1. Rewrite `_quarantine/README.md` opening. It currently says the mesh has 60 rows against an unbounded canon set. That is stale. Canon set is `_blueprint/canon_set_listing.json` (237 files + npm, total 238). Classification of the listing is `_blueprint/00_README.md`.

2. Remaining duplicate-id two_bodies from `_inbox/2026-08-21_r02-doc-census_close.json` that are safe to move: move, never delete, and name the rule or class. Do not move pointer_pair OPS stubs. Do not move `_scratch/` (gitignored). Do not move untracked Master Collateral copies (not in git). White-paper inbox copies vs masters: if byte-identical, leave and say so.

3. Held operator items: do NOT move `80_adrs/adr_028_contract_cross_vertical_adoption.md` (operator accepted-partial; planner amends it). Do NOT move `77_place_graph_strategy.md` or `80_adrs/adr_010_atom_graph_traversal.md` (accepted decisions; rewrite is operator/planner, not quarantine). Keep them in the Held table. Update the ADR-028 row to say accepted-partial is in flight, not "quarantine owed".

4. Do not re-walk 2,000 markdown files. Do not claim R-02 fully closed. Census half already landed. This is the quarantine remainder against the bounded set.

## Assigned files

- `_quarantine/` (moves + README)
- `_catalog/doc_census.md` only if a one-line status bump is needed

## Return

What moved (from, to, class). What was held and why. Confirm ADR-028 was not moved. Confirm README no longer says 60/unbounded.
