## Mission — P-167 (wave 4): the PDF leg, the last pin, and an observation file the instrument can read

You are the deepest worker in OPS-23 wave 4. You do not spawn sub-agents. The dispatch
planner supervises you and runs the surface probe itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`legacy-design-tools-p167-pdf` (branch `chore/p167-pin-and-strings`) and
`hauska-engine-p167-pdf` (branch `chore/p167-pdf-strings`), both from `origin/main`, start
commits declared.

### What is true today (P-167 close and the overseer's reads, 2026-09-13)

- `@empressaio/atom-contract` 1.33.1 is `dist-tags.latest`; the display vocabulary is its
  `./display` subpath (P-153's token `modelled-figure-withheld` folded in 1.33.0).
- hauska-map declares `^1.33.1` (PR #392, deployed); hauska-engine declares `^1.33.1` (PRs
  #429, #430); legacy-design-tools merged #667 for `^1.33.1` in api-server and smartsite-mcp,
  but on `origin/main` at least one LDT `package.json` that imports the package still declares
  `^1.30.0` (overseer read: `git grep '"@empressaio/atom-contract"' origin/main -- '*/package.json'`).
  Whether the lockfile resolves 1.33.1 for those packages is unread.
- No parity-lock file named for the vocabulary survives in any of the three repos.
- The feasibility PDF surface was unverified because `hauska-engine-api` had not redeployed with
  #429 at close time. It has since redeployed: `hauska-engine-api-00211-vam` is at 100 percent
  (2026-09-13). Whether that revision contains #429 is read from the image digest and the
  build, not assumed.
- The instrument's P-167 predicate reads, per parcel, `displayStringsIdentical` and, globally,
  `_vocab.displayStringsIdentical`, `_vocab.parityLockDeleted`, `_vocab.packageVersion` and
  `_vocab.importers` (`scripts/surface-probe.mjs`, `ROWS["P-167"]`). No observation file in
  that shape exists, so the row reads UNMEASURED.

### What you build

1. **LDT pin.** Every LDT `package.json` that imports the package declares `^1.33.1`; the
   lockfile resolves 1.33.1; `pnpm ls @empressaio/atom-contract` pasted. PR, merge on the
   conclusion string, deploy api-server and smartsite-mcp through their workflows, one lease each.
2. **PDF leg.** Confirm `hauska-engine-api`'s serving revision contains #429 (build metadata or
   a string the revision could only carry after #429). Generate the feasibility PDF for
   `48021:34049`, `48021:33223`, `48453:113408`, `48453:474034` and `48453:367134` through the
   real export path (`export_instrument` kind `feasibility`, or the BFF route the operator's
   click uses) and read every display string the vocabulary defines off the PDF text.
3. **Side-by-side table.** For each of the five parcels, the same strings from the panel
   (facets payload), the MCP (`get_smart_site`) and the PDF, in one table; `displayStringsIdentical`
   true only where all three agree byte for byte.
4. **Observation file.** `_inbox/<date>_p167_observations.json` in the probe's shape: one entry
   per parcel with `displayStringsIdentical`, `observedBy`, `observedAt`, and a `_vocab` block
   with `displayStringsIdentical`, `parityLockDeleted`, `packageVersion`, `importers`
   (`["hauska-map","hauska-engine","legacy-design-tools"]` only if each is verified at its pin).
   The planner runs `node scripts/surface-probe.mjs --rows P-167 --observations <file>`.

### Falsifiers

- If any string differs on any surface, the row is not done; name the surface and the string.
- If the PDF is generated from a revision that does not contain #429, the leg is unmeasured,
  not failed; say so.
- If a consumer's lockfile resolves anything other than 1.33.1, that consumer is not cut over.

### Out of scope

New vocabulary tokens. Engine deploy tooling (use what exists; if none exists for engine-api,
say so and stop at the pin).

### Close

`_inbox/<date>_p167-pdf_close.json`, `planRows` `["P-167"]`, with the PR, the pin reads, the
revision evidence, the table, the observation file path and the planner's probe artifact.
`leave_behind` is required.
