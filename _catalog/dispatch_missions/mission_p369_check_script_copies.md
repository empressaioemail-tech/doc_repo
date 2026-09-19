## Mission — P-369: the two copies of the cross-repo drift check are compared with each other

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
each from current `origin/main` with the SHA declared (map `252a40f5`, LDT `b5d8f355` at compile). You
do not merge.

### What is owed (P-331's own leave-behind, `_inbox/2026-09-18_p331-cross-repo-literal-drift_close.json`)

Both repos carry `scripts/check-cross-repo-literal-drift.mjs`, byte-identical at merge (git blob
`d366057e5eb0d6109bc0f83d91cc7bdf718b2bfc`). Nothing compares them. The row could not exist before both
mains carried the script (it would have refused, exit 2, on every PR in the review window). Both do
now: map #425 `252a40f5`, LDT #725 `b5d8f355`.

### What to build

Exactly the row P-331's close gives, in hauska-map's copy:

    { id: "check-script-copies", kind: "file", map: { file: "scripts/check-cross-repo-literal-drift.mjs" }, ldt: { file: "scripts/check-cross-repo-literal-drift.mjs" } }

then the file copied unchanged to legacy-design-tools, and `scripts/check-cross-repo-literal-drift.mjs`
added to the sibling sparse-checkout list in BOTH workflows
(`.github/workflows/cross-repo-literal-drift.yml`). The two PRs land as a pair: say the merge order
and what each PR's check reads while the other is open (a row that reads a file the sibling's main
lacks refuses, so decide whether the row compares against the sibling's main or its PR head, and
show the check is not red for the review window).

### Verify by violation

A one-sided edit to either copy fails the check; the same edit on both sides passes; `--selftest`
still runs first and is seen failing on a corrupted fixture. Watch the first scheduled run after both
merge (07:17Z / 07:23Z) and record that it ran.

### Close

Declare: the start commits and PRs, the merge order, the falsifiers with both directions shown, the
first scheduled run observed, and `leave_behind`.
