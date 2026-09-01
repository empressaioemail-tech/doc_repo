---
date: 2026-08-28
topic: PE chrome — W9 kit write-path gate (P-93), Settings console with the Team tab, and a long run of operator-driven dock fixes
agent: claude_code (planner, PE chrome lane; P-93 run as an isolated lane)
plan_row: P-85, P-93
---

# Session: PE chrome — arming the kit gate, building Settings, and a long tail of dock fixes

## Summary

A very long single stretch on Property Explorer chrome. Fifteen PRs merged and deployed to smartsite.cloud by this seat (hauska-map #281, #282, #284, #286 to #290, #292, #293, #295 to #299), plus #291 which is this session's P-93 work merged by the parent, one compiled dispatch handed to a lane, one lane executed end to end in an isolated tree, and one handoff file produced for an external design agent. Every change was verified against the live bundle after deploy, not against the merge.

Three things dominated. **P-93 (W9)** froze the kit and armed the hex and raw-button gate. **Settings** went from nothing to a four-tab console with a Team tab built over a read that does not exist yet. And a long tail of **operator-reported defects** in the docks, most of which turned out to be a different bug than the symptom suggested.

## P-93 W9 — the kit write-path gate

Executed as a lane in an isolated fresh clone at `P:/tmp/hauska-map-p93-w9` (a clone rather than a linked worktree, because linking writes metadata into a prohibited tree's `.git` and every candidate source was on the no-write list). All five acceptance items met. Artifacts at `_inbox/2026-08-28_p93-w9_{cp1,cp2,close}.json`. The lane did not commit, per a mission that says twice that commit is not the lane's, and handed back an explicit ten-path pathspec; the parent took it and merged it as hauska-map #291 later the same evening, with the follow-on conversion landing as #294.

Falsifier 3 was **refuted at inventory**: the gate was never dormant. It is chained through `package.json`'s `test` script and armed in job `test` of `property-explorer-ci.yml` line 33. The first instrument — grepping the workflows for the script name — returned nothing and would have produced a confident false "dormant" finding, because no workflow ever names it.

Falsifiers 1 and 2 were true, and the cause was worse than missing rules: the gate scanned a **hand-maintained file list**, so a new chrome file passed by never being opened. Fixed with a tree walk, two new rules, and a **baseline ratchet** recording 87 raw hexes and 60 native buttons across 37 files as declared debt. New code cannot add either; existing debt stays visible and countable. A blanket ban would have failed on commit one and been switched off.

The most instructive defect was mine. The first cut of `rawHexes` contained a literal `0x08` backspace where `\b` was intended, introduced by my own shell-to-python escaping. It matched nothing, returned empty for every input, and would have armed a gate that could never fire while reporting PASS. `grep` and `sed` render that byte invisibly, so **reading the file showed correct code**; only probing the helper with a known-positive input caught it, confirmed with `od -c`. Twelve self-tests now guard it, including one named NOT VACUOUS.

A second defect surfaced only on re-running: `rawButtons` missed the self-closing `<button/>`, because the original probe used `<button onClick=` which has a space and passed for the wrong reason.

And a third, about method: one plant reported "PLANTED" and changed nothing (zero occurrences), and its exit 0 would have read as "the guard does not work". Asserting the replacement count before running is now the habit.

## Settings console and the Team tab

Built from the v2 design drop, translated rather than copied: the comp links the SmartCity kit and loads Oxygen, and neither may ship. Every colour is a PE token and every control is the kit Button, tabs included.

The design's own provenance table did the important work by marking the roster, seats and viewer-role reads as TO BUILD. Confirmed by grep: there is no members table, no invitations table, and no endpoint. So the Team tab is **real UI over a read that does not exist**. `fetchTeamRoster` calls the endpoint the server will expose and reports what it got; today that is a 404 to `not-built`, which renders the drop's own "Not read" state. No fixture rows ship, and a test fails if the comp's specimen addresses appear.

Seat arithmetic is pure and pinned because it gates paid capacity: **an invitation holds a seat from the moment it is sent**. Counting only accepted members is how an account over-allocates; planting that bug fails two tests. Inviting refuses at capacity and when the seat count is unknown, because absence is not permission. The last joined owner cannot be removed or demoted.

Four fields the comp rendered as real data have no source and say so: the email (the session read returns `{ authenticated, hasSession }` and the BFF holds an opaque token), the tier name, the billing interval, and the renewal date. The comp's earlier revision also claimed sign-in was a magic link, which is false — it is Google or Microsoft OAuth. That line was deleted.

The server half was scoped and handed to the property seat as a contract the client already parses.

## Operator-reported defects, and what each actually was

- **Reports 429 on every surface.** Not a records limiter. A per-user daily API cap (`CORTEX_USER_DAILY_API_LIMIT`) applied globally via `app.use`. The cause was the rail's unread poller: `setInterval` on an empty dep array, no guard, running whether signed in or out and whether the tab was visible or buried. In a 3,000-row sample of that day's cortex-api traffic, `records-request/inbox` was 1,371 rows — about 46% of all requests, more than every human-clicked endpoint combined. Fixed to poll only while visible and wired.
- **A generated report did not appear in My reports.** Nothing was lost. `ReportsLibrary` read the list once on mount and never again. The signal already existed, already fired on every write, and `InspectCard` and `SavedPropertyPins` were already subscribers; this library simply was not one.
- **The amber indicator was stuck.** Its rule answered "has a run finished", which is true forever once true, and the product has no read state at all. It now counts unseen runs, seeded on first run so an existing backlog does not all light up.
- **Records rendered as a grid dump.** Traced to the write path: `parties` was a leftover bucket, the row shape was never resolved from a header, and the classifier defaulted an unresolved type to `deed`. Dispatched as P-85; the lane implemented the three-state design (5 mapped, 17 unclassified, 0 refused, `null` still refuses, verified by my own probe against the merged classifier).
- **The Claude connector deep link went nowhere.** Two slugs had been inferred and both were wrong; the operator read the real one off the address bar (`#settings/customize-connectors`). The worse bug was that the dialog **displayed** the bare host while the copy button wrote the full `/mcp` URL — click Copy and it worked, type what you saw and it did not.
- **The expanded column covered the find bar.** Two attempts. Moving the bar was pulled the same day ("I don't like it moving around"), so the column yields instead. The first version of that shipped `max(380px, min(860px, calc(...)))`, which **did not parse**, leaving the column at `width:auto` and shrink-to-fit at ~855px — near-identical to the old 860, so a broken value read as a failed deploy through two reloads. Now `clamp()`.

## The recurring error, named

Four times this session a check I wrote was **broader or looser than its claim**: a deep-link test that banned a string appearing in prose, a Settings test that banned `onToggleShareReport` when the detail view legitimately keeps it, a gate rule that matched an import instead of a call site, and a source ban that matched my own explanatory comments. Separately, two fixes shipped with tests that passed when the fix was reverted. The habit that catches these is planting the violation and confirming it landed — not re-reading the assertion.

## Deliverable for the design agent

`P:/tmp/smart-site-design-system.html` — a single self-contained file carrying all 63 `--ss-*` tokens in one editable `:root` block, driving real Smart Site surfaces (buttons, dock, rows, rail, chips, fields, notes, type ramp, radii). Token names are the real ones, so an edited block maps straight into `pe-tokens.css`. It states the three CI-enforced rules: gold is the brand mark and unread dot only, no solid blue fills on buttons including money surfaces, and the type ramp and radii are fixed sets. Produced because the operator wants to try palettes away from the app.

## leave_behind

- P-93 W9 code LANDED as hauska-map #291 (merged 22:01Z) while this session was still running — all ten pathspec files, including the ratchet, the baseline and the extracted `Dock` primitive. The close artifact records it as uncommitted, which was true when written and is not now. The lane tree at `P:/tmp/hauska-map-p93-w9` is spent and can be removed.
- 87 raw hexes and 60 native buttons remain baselined as declared debt (whole-app conversion is W8 territory). A follow-on lane merged part of this as hauska-map #294 during the session.
- The find-bar overlap is only avoided by narrowing the column; below ~1400px the expanded column is now narrower than it was. Accepted trade, operator to judge.
- Team server half not built; contract handed to the property seat.
- Read state for both unread markers is per-browser and does not sync across devices.
- `seat-gate`'s `isGitWrite()` is a text match and fired on prose containing "git worktree add", blocking a plain file write. Control broader than its claim; reported, not adjudicated.
