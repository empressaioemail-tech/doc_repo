---
decision_id: 2026-08-21_r04_divergence_report_do_not_land
date: 2026-08-21
owner: integration
status: active
related_canonical: [_catalog/canon_divergence.md, _catalog/repo_intents_checks.json, scripts/canon-divergence.mjs, _scratch/r05_preserve/r04_tracked_side_effects.diff]
---

## Decision

Do not land the R-04 copies of `_catalog/canon_divergence.md` and `_catalog/repo_intents_checks.json`. They are a side effect of running `scripts/canon-divergence.mjs` from `P:/tmp/r04-controls`, not scope creep, and the generated markdown leaks that worktree path into tracked frontmatter.

## Context

The R-05 dispatch asked whether those two tracked diffs were a control side effect or scope creep. The write path confirms side effect: `renderReport` interpolates `args.checks` as an absolute path; `stampLastVerified` rewrites the JSON when `args.stamp` is true (the default).

## Structural commitment check

Cited and untracked is the worst state; cited and pointing at a throwaway worktree is the same shape. A control that mutates the files it grades cannot block cleanly (already in the canon-divergence baseline graduation item).

## Reasoning

Landing the file would make canon claim `P:/tmp/r04-controls/_catalog/repo_intents_checks.json`. A stranger clone does not contain that path. Re-run later from `P:/doc_repo` with `--out` under `_inbox/` and `--no-stamp`, or wait for R-06 check-only mode.

## Reversal criteria

Reverse if a fresh run from `P:/doc_repo` produces a report whose `checks:` path is repo-relative and whose JSON stamps are wanted, and that run is committed as its own unit.

## Dependencies

R-06 canon-divergence `--check-only`.

## Counterparties

Internal.
