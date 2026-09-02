## Mission: seam vocabulary conformance (WDLL item 13)

Plan row G-113 (OPS-17, added 2026-09-02 A-099). Rescoped from the WDLL's
literal text — read it below before assuming the original scope is still
right.

### Context verified 2026-09-02, trust this over the WDLL's own item 13 text

- The WDLL's item 13 check asks for a citation validator "vendored ... in
  plan-review, smart-files, and smartcity-dashboards." Checked at source:
  `smart-files` and `smartcity-dashboards` were grepped for citation-shaped
  construction (`editionId`, `sectionNumber`, `bookId` paired with a
  citation concept) — **zero hits in either repo.** Neither product
  constructs a citation-shaped object today. Vendoring a validator into a
  repo with nothing to validate is not this row's job — verify this is
  still true before starting (grep fresh, don't trust this note if time has
  passed), and if it's no longer true, that's new information to report,
  not silently work around.
- `plan-review/src/citation.mjs`'s `buildCitation()` (built as part of
  G-108) **already does most of what item 13 asks for, inside plan-review**:
  it's documented as the sole citation-minting path in the service, and it
  throws without `editionId`, `bookId`, or `sectionNumber`. Read its own
  docstring before assuming more work is needed here than there is.
- The real, verified gap: `plan-review/src/code-lookup.mjs` (and its test
  file) use the spelling `verified-absent` for `ABSENCE_KINDS.VERIFIED_ABSENT`.
  The WDLL and the transaction contract both specify `absent-verified` as
  correct. This was deliberately left unfixed during G-108 (canvas item L3)
  specifically pending this row. Grepped `smart-files` and
  `smartcity-dashboards` for both spellings — zero hits in either, so this
  is a single-repo fix, not a cross-repo sync.
- There is no durable check today proving `buildCitation()` stays the sole
  minting path — nothing stops a future change from hand-authoring a
  citation string again the way six call sites did before G-108.

### Scope

1. Rename `verified-absent` to `absent-verified` throughout `plan-review`
   (the `ABSENCE_KINDS` constant, every reference, every test assertion).
   Verify zero occurrences of the old spelling remain, live and in code.
2. Add a durable CI check (a grep gate, or a test with an intentional
   violation fixture) that fails if a hand-authored citation-shaped string
   (matching something like the pattern six old call sites used,
   `/Section \d/` outside `citation.mjs`, or similar — your call on the
   exact pattern, state your reasoning) is introduced anywhere in
   `plan-review`. Prove it by violating it first: plant the pattern, confirm
   the check catches it, then remove the plant.
3. Confirm (don't just assume from this mission) that `smart-files` and
   `smartcity-dashboards` still have no citation-construction code before
   closing this row as single-repo scope. If either has grown one since
   2026-09-02, that changes this row's scope — report it, don't quietly
   expand scope to cover it without saying so.

### Acceptance

- Zero occurrences of `verified-absent` in `plan-review`, confirmed by grep
  against the deployed/merged source, not just the local diff.
- The new CI gate demonstrably fails on a planted violation and passes once
  it's removed — shown, not asserted.
- Written confirmation (grep evidence) that `smart-files` and
  `smartcity-dashboards` have no citation-construction code, closing the
  "is this really single-repo" question rather than leaving it assumed.

### Out of scope

Do not build a citation validator module for `smart-files` or
`smartcity-dashboards` unless step 3 above finds they now need one. Do not
touch the ICC ledger work (G-109/G-111/G-112, already closed). Do not
attempt G-114 (presentation convergence) — separate dispatch. Live Bastrop
is absolute no-touch.
