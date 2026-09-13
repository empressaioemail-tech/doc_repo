## Mission — P-154 (wave 4): the most-current resolver is shared through the corpus, and every producer uses it

You are the deepest worker in OPS-23 wave 4. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first consumer at CP2, and runs the
surface probe itself after your deploys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute

`_decisions/2026-09-13_share_the_most_current_setback_resolver.md`: the resolver becomes
`@empressaio/setback-corpus` subpath `./resolve` (1.2.0); hauska-engine, hauska-factory and
legacy-design-tools consume it; the engine's copy is retired by decline.

### Where you work (register names; create each from `origin/main`, declare the start commit)

- `hauska-setback-corpus-p154-share` at `P:/seat-worktrees/property/hauska-setback-corpus-p154-share`,
  branch `feat/p154-resolve-subpath`. There is no `P:/` checkout of this repo; clone
  `https://github.com/empressaioemail-tech/hauska-setback-corpus.git` into that path. Package
  `@empressaio/setback-corpus` 1.1.0, exports `.`, `./setbacks`, `./gate`; workflows `ci.yml`
  and `publish.yml` (read `publish.yml` before you assume what publishes).
- `hauska-engine-p154-share`, branch `feat/p154-consume-corpus-resolve`.
- `hauska-factory-p154-share`, branch `feat/p154-consume-corpus-resolve`.
- `legacy-design-tools-p154-share`, branch `feat/p154-date-first-through-corpus`.

### What is true today (P-154 close, `_inbox/2026-09-12_p154-most-current_close.json`; re-verify at your start commits)

- Resolver: hauska-engine `packages/adapters/src/local/setbacks/most-current-setback-resolver.ts`
  (exports `resolveMostCurrentSetback`, `SetbackCandidate`, `ResolvedSetback`,
  `ConflictSetback`, `parseStrictIsoDate`, `dateFromAtomSourceVintage`,
  `dateFromTableEffectiveDate`, `parseYearSequenceOrdinanceCitation`), test
  `__tests__/most-current-setback-resolver.test.ts`; imported by `index.ts`,
  `bastrop-per-parcel-record.ts`, `table-types.ts`. Merged in #424 `2221b6a6`.
- hauska-factory #141 `ba15fee5`: `src/lib/setback-writer/setback-table-router.mjs` carries the
  rule locally because it could not import the engine's module.
- legacy-design-tools `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`
  is UNCHANGED: vendors its own table JSON, ranks tier-first, date only as tiebreak. LDT does not
  depend on the corpus package today.
- Ground truth for `48021:34049` (Bastrop): layer 23 row 25/5/25/15 citing Ordinance 2019-51
  (`dataLastEditDate` 2026-08-24); layer 83 row 30/10/30/20 (`lastEditDate` 2026-07-23, no
  citation field); Ordinance 2026-06 effective 2026-04-14 (30/10/30/20). Live 2026-09-13: panel
  30/5/25/15 (front record-served, side/rear/corner legacy-transitional), endpoint and MCP
  30/10/30/20 with source date 2026-04-14. `48021:33223`: panel 20/5/20, endpoint 25/7/15/7,
  MCP absent (district GC has no ruled table).
- A sixth live producer, hauska-engine `packages/engine-core/src/property-reasoning/bastrop-per-parcel-setback.ts:75`
  (`buildBastropPerParcelSetbackDescriptor`), has no test locking its numeric output.
- The engine's `getSetbackTableForZoning` returns `SetbackTable | null` with no conflict variant;
  a conflict is disclosed through `display_meta.second_source`, not refused. Not this row's to
  change; do not widen it.

### What you build, in order

1. **Corpus.** Move the module and its test into the corpus as `src/resolve/` and export
   `./resolve` beside `./setbacks` and `./gate`; keep the public names; bump to 1.2.0; the
   package's own tests include the pre-registered falsifier and non-vacuity cases the P-154 lane
   wrote. Merge on the conclusion string `success`; publish through `publish.yml` (npm publish
   is autonomous in this portfolio); confirm `npm view @empressaio/setback-corpus version`
   reads 1.2.0 and `dist-tags.latest` too. Paste both.
2. **Engine.** Import from `@empressaio/setback-corpus/resolve`; delete the local module; a
   retirement test asserts the old relative path does not resolve (`import()` rejects). Bump the
   pin to `^1.2.0`. Add the missing test for the sixth producer (its numeric output for
   `48021:34049` equals the resolver's answer). Deploy `hauska-engine-api` from `origin/main`
   after merge under the planner's lease (P-170; one shift per service; delete the lease file on
   release).
3. **Factory.** `setback-table-router.mjs` and the S1 writer call the package; the local rule is
   deleted with a retirement test. Then re-run the Bastrop setback cells: staging first, then the
   identical job on production, verified from execution status, never a laptop `--apply`. Paste
   the cell diff counts (how many Bastrop parcels changed, from what to what) that the P-154
   close left unmeasured.
4. **LDT.** Add the dependency (`^1.2.0`; the esbuild conditions stay `["workspace"]`, see the
   fleet memory: broadening them boot-crashes pg ESM). `authoritativeSetbackSource.ts` builds
   `SetbackCandidate`s from its sources with their dates read at source and calls
   `resolveMostCurrentSetback`; the tier-first ranking is deleted; a test fails on the old
   ranking. A divergence test compares LDT's answer with the engine's for `48021:34049` and
   `48021:33223` and fails on disagreement. Deploy `cortex-api` and `smartsite-mcp` the way their
   workflows deploy, one lease each.
5. **Read.** After all four are serving, read `get_smart_site` for `48021:34049` and
   `48021:33223` and paste setbacks and `setbackSourceDate`; ask the operator once for the
   feasibility PDF of `48021:34049` after the engine deploy.

### Falsifiers, pre-registered

- If after step 4 the panel for `48021:34049` still prints 30/5/25/15 while the endpoint prints
  30/10/30/20, a consumer still ranks tier-first or reads a stale cell; name which.
- If LDT's and the engine's answers differ for either parcel, the divergence test must fail; if
  it passes while they differ, the test is vacuous.
- If the old engine path still resolves after step 2, the retirement is not proven.
- If the corpus publish leaves `dist-tags.latest` at 1.1.0, nothing downstream changed.
- If a source's date is unreadable and a value is still picked, the rule is wrong (conflict row).

### Out of scope

The conflict-shaped return type for `getSetbackTableForZoning` (a future row). New setback
tables for unstaged cities (P-156). Slating the remaining setback rails (P-152 lane 4, which
waits for your Bastrop re-run).

### Close

`_inbox/<date>_p154-share_close.json`, `planRows` `["P-154"]`, with the four PRs and merge SHAs
with conclusion strings, the npm version read, the serving revisions read by field, the cell
diff counts, the two `get_smart_site` reads, and the probe artifact the planner ran.
`leave_behind` is required.
