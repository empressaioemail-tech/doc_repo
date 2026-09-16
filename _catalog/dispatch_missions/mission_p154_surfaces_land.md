## Mission — P-154 surfaces: commit, PR and land the panel and MCP conflict row

You are the deepest worker on the P-154 surface follow-on. You do not spawn sub-agents. The dispatch
planner supervises you and has already registered your worktrees.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that could
hang in `timeout`; never leave a watch, a tail or a dev server running.

### Why this lane exists

The p154-conflict lane closed `closed-partial` and its close reports the panel and the `get_smart_site`
surfaces as NOT PRODUCED. That is only true of the instance that wrote the close. The planner then
found both surfaces BUILT and UNCOMMITTED in their worktrees, left by the lane's other instance, with
no close and no owner:

- `P:/seat-worktrees/property/hauska-map-p154-conflict` (branch `feat/p154-conflict-row-panel`) —
  9 files / 297 insertions: `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`,
  `src/browse/InspectCard.tsx` + test, `src/lib/baked-facets.ts` + test,
  `src/lib/sheet-to-card-model.ts`, `package.json`, lockfile. Pins `@empressaio/atom-contract` at
  `^1.36.0` and reads `setbackConflictNote` from `@empressaio/atom-contract/display`.
- `P:/seat-worktrees/property/legacy-design-tools-p154-conflict` (branch
  `feat/p154-conflict-row-mcp`) — 2 files / 92 insertions: `artifacts/api-server/src/lib/r1BriefCompose.ts`
  + test, exporting `withSetbackConflictNote`. Its test asserts the A-148 sentence verbatim.

The planner captured both bodies out-of-tree before anyone touched them, in the planner worktree:
`_inbox/2026-09-14_p154-surface_unaccounted.panel.diff` (sha256 `1AF5A713…DF0F52`) and
`_inbox/2026-09-14_p154-surface_unaccounted.mcp.diff` (sha256 `19C15459…F4D4C67`), each with a
`.status.txt`. Read them first: they are your starting point and your check on what you are handed.
**Recover, never reconstruct** — if the worktree no longer matches its capture, say so and stop.

### The blocker is CLEARED, and you must verify it rather than take it

`@empressaio/atom-contract@1.36.0` is now PUBLISHED. The planner verified it at the published artifact,
not at the repo: `npm pack @empressaio/atom-contract@1.36.0` and the A-148 sentence is present in
`package/dist/display/wire.js`, while the retired sentence (`repealed 2026-04-14`) is absent from the
dist. Do that check yourself before you commit anything that depends on it, and record the evidence.

### Work

1. **Panel.** In `hauska-map-p154-conflict`, read the uncommitted diff against its capture, confirm the
   card composes ONE conflict sentence from the shared vocabulary (not a literal retyped at the call
   site — R-6), then commit, push and open the PR. Tell the truth about what the panel does when the
   rail carries no `conflict`: it must be unchanged, and you must show that rather than assert it.
2. **MCP.** Same for `legacy-design-tools-p154-conflict` and `withSetbackConflictNote`. Its stated
   design is additive and dormant — `no conflict` returns the envelope unchanged. Prove that leg.
3. **Scratch hygiene.** Both worktrees carry an untracked `.vocab-tmp/` (an unpacked contract tarball,
   and note its version is `1.18.0`, not 1.36.0). It is scratch and must NOT be committed. Say what it
   was for and remove it, or leave it and say why.
4. **PR #442 un-draft.** `hauska-engine` PR #442 (branch `feat/p154-conflict-row`, sha
   `4aafe3b62a54322888f57e9e55d5011cfc79a8c7`) was held DRAFT for exactly one stated reason: it must
   not merge before the contract publishes. That precondition is now satisfied. Verify the PR's stated
   blocker is the only one, confirm CI is green, then un-draft it. Do NOT merge it: merging and
   deploying is a lease-gated operator step. If you find a second blocker, leave it draft and name it.
5. **The PDF leg, honestly.** The close says the PDF (`export_instrument`) leg is wired to the same
   seam but unbuilt. Now that 1.36.0 exists, find where that seam actually is and say what it would
   take. Build it only if it is genuinely small and self-contained; otherwise report it as a named,
   measured gap with the file and function that would change. Do NOT touch `hauska-engine`'s working
   tree for this — if the PDF leg needs engine changes, that is a new row, not a sneaked edit.

### Falsifiers

- If any surface prints a conflict note where the two sources AGREE, the detector is wrong.
- If the panel or MCP changes its output for a payload with no `conflict` on the rail, the work is not
  additive and the claim is false.
- If the A-148 sentence appears anywhere as a literal in your diffs rather than being read from
  `@empressaio/atom-contract/display`, the shape is wrong and R-6 is violated.
- If `npm pack @empressaio/atom-contract@1.36.0` does not carry the sentence, stop: the premise is
  false and every pin you would commit is broken.

### Out of scope

The engine and contract worktrees (`hauska-engine-p154-conflict` is clean at `4aafe3b`;
`hauska-atom-contract-p154-conflict` is at `1668d6f` with only a line-ending artifact — the planner
diffed it and it is content-identical, so do not "fix" it). The p154-conflict lane's close is written
and is not yours to rewrite; if your work contradicts it, report that in your own close and leave the
other artifact alone. No deploys, no production writes, no service traffic shifts.

### Close

`_inbox/<date>_p154-surfaces_close.json`, `planRows` `["P-154"]`, with the commit SHAs and PR numbers
per repo, the published-artifact verification command and its output, the falsifiers run with their
results, the `.vocab-tmp` disposition, PR #442's before/after draft state, the PDF leg's measured
state, and an explicit statement of what is now live versus what still waits on a deploy lease.
`leave_behind` is required. Ask by name in `_inbox/` for any lease you need rather than guessing.
