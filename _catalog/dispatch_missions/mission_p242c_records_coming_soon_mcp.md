## Mission — P-242c: record request goes coming-soon on the MCP surface, plus the wrong export copy

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. The
web half (P-242b, hauska-map PR #406) already merged 2026-09-16 — do not touch `hauska-map`.

### The ruling you are implementing

Operator ruling 2026-09-15, `_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`:

1. **All surfaces**, web and MCP connector both.
2. **Disabled AND labelled**, not labelled alone.
3. **The MCP tools stay listed and return a declared coming-soon refusal.** Not removed from
   the catalog — an agent told coming-soon has a fact; an agent that finds the tool absent
   guesses.

### What is already built, verified against `origin/main` this session — read before you touch anything

`artifacts/smartsite-mcp/src/tools.ts:796-824` (`registerTools`) already has the exact
mechanism the ruling asks for, proven live today for two other tools: every registered tool
carries a `readiness` field in `artifacts/smartsite-mcp/src/constants.ts`, and
`registerTools`'s handler wrapper checks `tool.readiness === "blocked"` **before** dispatching
to any case handler, short-circuiting to:

```json
{"status":"not_ready","tool":"<name>","reason":"<blockedReason>","message":"<name> is not available on Smart Site MCP yet."}
```

(`notReadyMessage()`, `tools.ts:241-248`, returned with `isError: true`.) `request_records`
and `check_request` (`constants.ts:38-53`) are **already** `readiness: "blocked"` with
`blockedReason: "P-85 item 4"` and a description that already reads "Not available until
Records Request is live on production." Those two tools already satisfy this ruling. Verify
this stays true (it may have drifted since this read) and do not re-touch them unless you find
otherwise.

**What is NOT yet coming-soon:** `list_purchased_records` and `read_purchased_record`
(`constants.ts:54-67`) are `readiness: "live"`. They gate only on entitlement
(`canRunStudioReport`, checked inside `listPurchasedRecords`/`readPurchasedRecord` in
`artifacts/smartsite-mcp/src/recordsExtraction.ts:359-428`), which means a Studio+ caller
today reaches the real handler and gets real (near-always-empty, per P-223's 42-row/zero-
artifact measurement) query results — not a coming-soon refusal. This is the actual gap this
row closes.

### The refusal-copy defect, also named in this row (A-171 residue)

When an ungranted caller hits `list_purchased_records`/`read_purchased_record` today, the
entitlement gate returns `upgradeRequiredResult(entitlement)`, which resolves to
`refuseStudioReport()`'s message in `artifacts/smartsite-mcp/src/entitlement.ts:139-149`:
**"Studio or Team subscription, or a 30-day property unlock on this parcel, is required for
this export."** These two tools do not export anything — they read previously-purchased,
already-extracted text. The word "export" is wrong on this path; it was copied from the
site-plan/terrain export gate this string was written for. Write a distinct, accurate
message for this gate (do not just delete the word "export" — say what the tool actually is:
reading a purchased record). **This copy fix stands on its own regardless of the blocked-flip
below**, because once you flip readiness to "blocked" the entitlement gate becomes unreachable
dead code for these two tools — fix the copy anyway, so it is correct on the day this row
reverses and the entitlement check runs again.

### Predicate

1. `list_purchased_records` and `read_purchased_record` flip to `readiness: "blocked"` in
   `constants.ts`, each with a `description` stating unavailability (mirror
   `request_records`'s wording) and a `blockedReason`. Use `"P-242"` (this ruling's row), not
   `request_records`'s `"P-85 item 4"` — a different, more recent governing decision, and a
   future reader should trace to the right one.
2. Every call to either tool, at any entitlement tier, returns the declared `not_ready`
   envelope — proven by a test that calls each with a Studio-tier fixture (today's one
   passing case) and confirms it now declines instead of running the query.
3. Both tools remain in `SMARTSITE_MCP_TOOLS` / the served tool catalog — list the catalog
   (or the equivalent test) and show both names present.
4. `refuseStudioReport()`'s "required for this export" message is no longer reachable from
   `listPurchasedRecords`/`readPurchasedRecord`'s own gate path, and the gate's own
   (now-dead-while-blocked) copy is corrected to not claim "export."

### Falsifiers, pre-register your answers before you run anything

1. **Call `list_purchased_records` and `read_purchased_record` as a Studio-tier caller** (the
   one path that reaches the real handler today) and confirm both now decline with the
   declared envelope instead of running the DB query. This is the actual behavior change; a
   Studio caller not exercised is not proof.
2. **Confirm neither tool disappeared from the tool list.** List `SMARTSITE_MCP_TOOLS` (or
   whatever the server actually advertises) before and after; both names must still appear.
3. **Confirm `request_records`/`check_request` are unaffected** — you are not touching their
   `blockedReason`, and their existing behavior is not this row's to change.
4. **Try to find a second entry point** into a purchased-record read that bypasses the tool
   dispatcher's `readiness` check (a direct function call from another tool's handler, a REST
   route in this same service, anything reachable that calls `listPurchasedRecords`/
   `readPurchasedRecord` without going through `registerTools`'s gate). Name what you find.

### Known traps

- `readiness === "blocked"` is checked once, generically, for every tool — do not build a
  second, parallel coming-soon mechanism specific to these two tools. Reuse what
  `request_records` already proves works.
- `isError: true` on the not_ready envelope may read as an error rather than a declared
  refusal, in tension with this codebase's own stated philosophy elsewhere ("a refusal is a
  declared answer, not an error" — `find_parcel`'s own description in `constants.ts`). This is
  pre-existing behavior on `request_records`/`check_request`, not something this row asks you
  to fix. Note it in your close if you think it is a real defect; do not silently change it for
  all four tools without flagging that you widened scope.
- Do not touch `hauska-map` / `apps/property-explorer`. P-242b already shipped that half.
- Do not set or imply a return date for records request. None was decided.
- Do not change tier boundaries or entitlement policy elsewhere in this file. Coming-soon is
  not an upgrade gate.

### Do not

- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact diff to `constants.ts` and the new/
corrected message text. Paste the test output proving a Studio-tier call to each tool now
declines. Confirm the tool catalog still lists both names. Declare `leave_behind` explicitly —
`none` is a valid answer.
