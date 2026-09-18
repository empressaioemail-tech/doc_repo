# Scratch — OPS-17 SmartCity planner (design build + OPS-25 D-12..D-14, D-20)

Read this before re-deriving anything. Entries are Tier 2 (cheap, can be wrong); the planner gates promotion.

## GROUND-TRUTH (live-verified, with timestamp)

- 2026-09-18 ~14:40Z, doc_repo `P:\doc_repo` on `main` @ `247b0455`, read from outside this host (node `--use-system-ca`; plain node and `curl.exe` both die on the TLS-inspecting network with `fetch failed` / exit 35):
  - `smartcity-dashboards` `origin/main` = `7267c3f3e718cc751eef0ab5b2b0ccb0cb6a8a56`. Unchanged from the handoff snapshot. No `d13`/`d14`/`g161` branch exists on origin. Only lane branches present: `d12-crlf-on-main`, `g159-finance-bridge`, `g88-item3-class-gate`.
  - `smartcity-os` `origin/main` = `a400f7beb9b1e875584af9e1d99d1a373840d938`. Unchanged. `d9-api-8bea7fa` (the branch `walrus-app` builds from) still exists; no D-14 healthcheck fix on main.
  - `d14-d13-v1-reach` NOT LANDED. On `smartcityos.io` (served by walrus-app): G-159's four new routes (`/api/platform/opengov/budgets`, `/api/platform/opengov/chart-of-accounts`, `/api/platform/finance/permit-revenue/summary`) all return `200 text/html` (the SPA shell), identical to the fake-path control `/api/platform/xyz-nonexistent-control`; the existing-route control `/api/platform/mygov/permits` returns `401 JSON platform_internal_required`. Route absence is readable from outside with no key, using content-type as the discriminator.
  - `g161-never-default-a-city` NOT LANDED. At `smartcity-dashboards` `origin/main`, `src/server.mjs` still has six `|| "template-city"` fallbacks (lines 248, 394, 442, 499, 552, 580); `src/compose.mjs:7`, `src/staff-map.mjs:2`, `src/municode-calendar.mjs:282`, `src/run-municode-calendar.mjs:7` still carry the default.
  - `d13` NOT LANDED. The hardcoded GCP host `smartcity-api-7dyaiy7wha-uc.a.run.app` still appears at `origin/main` in `src/adapters.mjs` (6), `src/vendor-live.mjs` (5), `src/property-map.mjs` (2), `src/mygov-live.mjs` (1 + `DEFAULT_PLATFORM_BASE`), `src/mygov-permits.mjs` (1). Zero occurrences of `walrus-app` in `src/`.
  - `g135-mint` NOT LANDED, verified at the authoritative store: `gcloud secrets describe hauska-tenant-key-bastrop-tx-lane-verification --project=hauska-prod-497015` -> `NOT_FOUND`, authenticated as `empressaioemail@gmail.com`. `_catalog/credential_access_index.json` entry still reads `REQUESTED, NOT YET MINTED`. No `g135`/`mint` branch on `hauska-mcp-server`.
  - `app.smartcityos.io` (dolphin-app, DO) answers `/auth/sign-in` `500 signin_not_configured` (the DO marker) and `/api/lenses/finance/sources` keyless `404 unknown lens`. The GCP dashboards control answers `/auth/sign-in` `404 not found` and the same `404 unknown lens`. Both predate G-156, so production is still at `3d3ec62`.
  - `d12-main-uat` (deployed `53ade8a9`, G-159 STEP 2) still serves the demo default on the G-161 target routes: `/api/city-domains`, `/api/city-identity`, `/api/shell` all answer keyless `200 JSON`; only the finance route refuses keyless (`400 city_key_required`, G-159's fix). `?cityKey=bastrop_tx` 401, `?cityKey=no-such-city` 404, `?cityKey=template-city` 200, `?cityKey=%20%20` 404.
  - Probe instrument + artifact: `_inbox/2026-09-18_planner_verify_three_lanes.mjs` -> `_inbox/2026-09-18_planner_three_lane_verify.json`.
  - `node scripts/govtech/smartcity-tracker.mjs` exits 0: 18/18 self-tests, every tracked row agrees with its own close, 5 milestones M1 2/6, M2 3/6, M3 3/9, M4 4/6, M5 0/5.
  - `node scripts/lane-claim.mjs status` shows 7 STALE claims, none for the three in-flight lanes; the stale `d12-dashboards-do-cutover` (seat cente-vsc-d12, 15.8h) is still open.

- 2026-09-18 ~15:09Z, doc_repo `main` @ `81c208b3` (moved several times by other seats during this session: `a1749368` -> `1fb31831` seat A-219/A-220 -> `7de5dadc` my G-154 merge -> `81c208b3` my mint collection):
  - **`g135-mint` LANDED at 14:44Z** — four minutes after the 14:40Z read that found it absent. `gcloud secrets describe hauska-tenant-key-bastrop-tx-lane-verification --project=hauska-prod-497015` -> created `2026-09-18T14:44:27Z`, version 1 ENABLED. Key `96e40316`, tenant `bastrop_tx`. The lane's close is `closed-partial` and self-honest: parcel 1 PASS, parcel 2 (full-shell probe mounting the map iframe) UNMEASURED. **Do not grade G-135 CLOSED** — its own completion predicate has two clauses and only one is measured, even though the handoff says "re-grade to CLOSED". The row wins.
  - The mint's artifacts were sitting UNCOMMITTED in `P:\seat-worktrees\substrate\doc_repo` (8 entries incl. `_catalog/credential_access_index.json`). Collected to `main` at `81c208b3` after a secret-pattern scan of all 7 artifacts + 3 scripts (clean: the only long strings are secret NAMES and commit hashes; all key material is read from Secret Manager at runtime).
  - Planner's own credential probe `_inbox/2026-09-18_planner_g135_credential_probe.mjs` -> 8/8 declared cells PASS on `d12-main-uat` @ `53ade8a9`: 200 bastrop_tx with key, 401 keyless, 401 garbage, **403 fixture-city (this is the cell that proves tenant-scoping rather than a master key)**, 200 template-city keyless, 404 unknown city. Key is 51 bytes; never printed.
  - **`g154-dev-services-live` LANDED.** Two commits on `seat/g154-dev-services-live` were NOT on main (`6dc58b05`, `d43eabaf`) and the handoff says to merge the branch. Merged clean (`7de5dadc`, parents `1fb31831` + `d43eabaf`); `_catalog/lane_claims.json` had zero net change so another seat's dirty claim rows were untouched. Close: 3 of 4 acceptance items PASS, item 2 (names on workload rankings) UNMEASURED because the live surface draws no ranking at all. Live proof artifact `P:\tmp\g154-bastrop-live4\dev-services-export.json`: 250 rows / 5 tabs on `d12-main-uat` @ `53ade8a9`, `manifest.auth` records a key was used and never its value.
  - **The credential the G-154 lane used is its OWN**: `key_id 2510a3ff`, created `2026-09-18T14:36:21Z` — the exact mtime of `P:\tmp\g154-hauska-key.txt` (51 bytes). The operator's pilot key was never read. The roadmap's "do not paste your pilot key" warning is moot; the file that exists holds the LANE's key and should still be deleted.
  - **Census correction:** THREE active `bastrop_tx` keys existed, not one (pilot `2a26c318`, dormant G-134 `acf2cf9f`, G-154 `2510a3ff`). The dispatch's premise was false and the lane said so.
  - `d14-d13-v1-reach` and `g161-never-default-a-city` still NOT LANDED, re-verified 15:09Z and byte-identical to the 14:42Z read on every deployed surface. Both have live worktrees (`P:\seat-worktrees\<lane>\doc_repo`) with uncommitted artifacts and NO close; nothing pushed to origin. G-161's CP1 is filed in its worktree.
  - Trackers: `node scripts/govtech/smartcity-tracker.mjs` exits 0, M3 moved 3/9 -> 4/9 (G-154 now closed-partial). **`scripts/enforcement/probe-close-gate.mjs --self-test` now PASSES all checks** — another seat's `1fb31831` fixed `OPS24_RANGES` to cover `[327,356]` and `[358,361]`, resolving the mint close's leave-behind item 5. Do not re-raise it.
  - `app.smartcityos.io` STILL predates G-159's dashboards change: finance route answers `404 unknown lens` there where `d12-main-uat` answers `400 city_key_required`. The ship has not happened.
  - Direct `*.ondigitalocean.app` hostnames for `walrus-app` and `dolphin-app` reset the connection from this network (ECONNRESET, 3/3 retries at BOTH reads) while `app.smartcityos.io` and `d12-main-uat` answer fine. Not a new outage and not TLS interception (that was a different error, fixed by `--use-system-ca`); cause unidentified from this seat. Read D-14 through the apex, not the raw hostname.

## LESSON

- **"Sent" is not "landed", and a lane's work can be finished without being visible.** The mint landed four minutes AFTER a read that found it absent, and its artifacts sat uncommitted in another worktree where no `git status` in this clone would ever show them. Check the lane WORKTREES (`git worktree list`), not only origin refs and this clone's working tree.
- **A lane close can be committed on a lane branch and never merged.** `git log main..seat/<lane>` is the check; `_inbox` alone will not show it.
- **Read the row's own completion predicate before accepting a grade instruction.** The handoff said regrade G-135 to CLOSED; the row has two clauses and the close measured one. The row and the close beat the handoff's shorthand.
- **Verify a credential by pointing it at a SECOND tenant, not by seeing it work.** 403 on `fixture-city` is what turned "the key works" into "the key is tenant-scoped". Without that cell, a master key would pass every other cell.

- This seat cannot read `source_commit_hash` (no `doctl` token, no DO MCP), so D-14's verdict here is inferred from route absence plus the last committed read (`walrus-app` built from `d9-api-8bea7fa` @ `e783f351`). The lane that runs D-14 must read the hash back itself; an inference is not the authoritative record.
- `node -e` and `curl.exe` both fail on the TLS-inspecting network. Write the instrument as a file and run it with `node --use-system-ca`. Piping node output through `Select-Object -First N` kills the process before it writes its artifact.

## OPEN

- ~~The three compiled dispatches are compiled and NOT sent~~ **RESOLVED 2026-09-18: all four are hand-carried and two have landed (see above).**
- ~~The `dolphin-app` ship ruling (OPS-17 A-148) is not made~~ **RESOLVED: A-149 records the operator's ruling; the `d14-d13-v1-reach` lane ships `main` as its last step with the configured platform base in the same deploy. Read at source 15:09Z: the ship has NOT happened yet.**
- **`d14-d13-v1-reach` (D-14, D-13) is still in flight and holds the ship.** Nothing pushed as of 15:09Z. It owns the five data-source files in the dashboards.
- **`g161-never-default-a-city` is still in flight.** `src/server.mjs` still has six keyless `template-city` fallbacks; three routes answer 200 keyless on `d12-main-uat`.
- **Two non-pilot `bastrop_tx` keys need a disposition (planner + operator):** `acf2cf9f` (dormant G-134 lane key) and `2510a3ff` (G-154 lane key, still in use by nothing now that G-154 is filed). Neither has a recorded Secret Manager location.
- **`P:\tmp\g154-hauska-key.txt` exists (51 bytes) holding the G-154 lane key in plaintext.** Delete it; never commit it.
- **G-135 parcel 2 is unmeasured:** a full-shell authenticated probe on `bastrop_tx` that mounts the map iframe. Now UNBLOCKED and unowned; assign it to a lens lane rather than to a credential lane.
- **Two `*_MCP_URL` secrets in `hauska-prod-497015` hold Postgres DSNs with passwords** and a lane printed them to a terminal while looking for an HTTP URL. Rotation is the operator's call; no lane should rotate a production store credential on its own.
- **`HAUSKA_ADMIN_BOOTSTRAP_KEY` drift:** `hauska-mcp-server/.env`'s value is NOT the deployed one (P-305 class). Reported by the G-154 lane, not fixed.
- The stale `d12-dashboards-do-cutover` lane claim (seat `cente-vsc-d12`) is still open with no close; D-12 is closed-partial and the bake has not started.

---

## 2026-09-18 (later) - operator items closed at source, three new lanes compiled

### GROUND-TRUTH (read at source, this session)

- **`P:\tmp\g154-hauska-key.txt` is ABSENT** and no other `g154` key material remains in `P:\tmp`.
  Operator: *"the key 154 hauska key is deleted"*. Verified, not taken on report.
- **`bastrop_tx` credential census, read at source via `GET /admin/keys`:** four rows exist and the
  status field is what counts, because that endpoint returns revoked rows too.
  `96e40316` **active** (the minted verification key, last used 15:16Z by the planner's own probe);
  `2a26c318` **active** (operator's pilot, never to be handed out);
  `2510a3ff` **revoked** (G-154 lane key, and it was ALREADY revoked before this seat read it);
  `acf2cf9f` **revoked** (G-134 dormant lane key, revoked by this seat at the operator's instruction).
  So the census is now one documented lane key plus the pilot, which is the shape G-135 asked for.
- **`acf2cf9f` was genuinely dormant**: created 2026-09-15T00:49:35Z, last used
  2026-09-15T00:49:49Z (14 seconds later, then nothing for three days). Revoking it breaks nothing:
  the G-135 verification key supersedes it for any future G-134 work.
  Evidence: `_inbox/2026-09-18_planner_revoke_dormant_g134_key.mjs` and its `.json` artifact.
- **Design completion gate, run 2026-09-18T15:46Z** against dashboards `96fdafbb`: exits 1, six
  findings. R3 has four designs past DRAFT with no `check.mjs` (`plan-review-departments`,
  `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`); R4 has two uncovered nav
  surfaces (`lens:citizen` = G-142, `work:records` = G-147). Design is NOT done.
- **Three dispatches compiled 2026-09-18T10:59Z** and NOT yet hand-carried:
  `_dispatches/2026-09-18_g142-citizen-lens_dispatch.md`,
  `_dispatches/2026-09-18_g147-record-search_dispatch.md`,
  `_dispatches/2026-09-18_g160-served-commit-parity_dispatch.md`, with missions in
  `_catalog/dispatch_missions/`.
- **No lane claim exists for either lane the operator believes is running.** `lane-claim.mjs status`
  reports seven open claims and neither `d14-d13-v1-reach` nor `g161-never-default-a-city` is one of
  them. The claim is what makes a second session stand down on exit 3. This is a control that did not
  fire, and it is exactly the 2026-09-14 duplicate-dispatch shape.

### LESSON

- **A presence-shaped verdict over a status-bearing list is the wrong predicate.** `GET /admin/keys`
  returns REVOKED rows as well as active ones, so the first run of the revoke instrument reported
  "NOT REVOKED" while the very same payload's status field already read `revoked`. The fix was to
  read `status` from the row after the call. Presence is one input; a state field is the truth. This
  is the same family as reading `latestReadyRevisionName` instead of the revision on the log line.
- **`design-completion-gate.mjs` is the cheapest true read of what design work remains.** It names
  the exact two uncovered surfaces and the exact four missing instruments. Run it before planning
  design lanes; do not re-derive the inventory by reading folders.
- **Two design lanes share `_design/INDEX.md`** (`design(G-143)` `c3af32d4` and `design(G-138)`
  `fb31a343` both edited it). Design lanes therefore serialize on that one file the same way lens
  BUILD lanes serialize on `web/app.js` and `web/index.html`. The G-147 dispatch is written to append
  one line and touch nothing else, because G-142 is compiled alongside it.
- **The plan-of-record row has SEVEN columns**, not six: `| id | band | scope | accept | done-when |
  blockedBy | status |`. Scanning the wrong index silently matches nothing, which reads as "no open
  rows" rather than as a bug in the scan.

### OPEN

- **Both in-flight lanes still hold no claim and nothing has been pushed.** `d14-d13-v1-reach` owns
  the ship (`dolphin-app`) and D-13's dashboards repoint; `g161-never-default-a-city` owns six keyless
  `template-city` fallbacks in `src/server.mjs`. The stale `d12-dashboards-do-cutover` claim on D-12
  (seat `cente-vsc-d12`, 17h old) is also still open.
- **G-135 parcel 2 is unmeasured and now unowned:** a full-shell authenticated probe on `bastrop_tx`
  that mounts the map iframe. Fold it into the next lens lane rather than a credential lane.
- **G-148 is HELD** (`_decisions/2026-09-17_design_ratification_all_approved.md`: "G-148 stays HELD
  for the designs with no build row"). The gate's four R3 findings are `plan-review-departments`,
  `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`, and all four now HAVE
  build rows (G-144, G-149, G-128, G-120). Whether the hold's stated exemption now releases them is
  the operator's call, not this seat's. Ask before dispatching it.
- **Secrets are NOT rotated, by operator ruling 2026-09-18.** The naming trap stays: `*_MCP_URL`
  secrets in `hauska-prod-497015` hold Postgres DSNs, and a lane printed one while looking for an
  HTTP URL. Rename-or-split is the open half.
- **M2 is HELD by the operator** until Khalid replies. Nothing was dispatched against G-137, G-157 or
  G-162.
- **`HAUSKA_ADMIN_BOOTSTRAP_KEY` drift** (`hauska-mcp-server/.env` value != deployed) is still open.
  Note for the next reader: the SECRET MANAGER value is the one that works, which is what this seat's
  revoke instrument read.

### GROUND-TRUTH (2026-09-18, planner reads and one instrument fix)

- **`scripts/govtech/smartcity-tracker.mjs` refused a verdict twice today, for two separate defects,
  both now fixed and both proven able to fire by violating them.** (1) It split table rows on EVERY
  pipe, so the G-161 row, whose status cell carries an escaped `\|`, parsed to nine cells and VANISHED
  from the run; a row that cannot be parsed is now recorded in a non-enumerable `rows.dropped` and the
  run refuses (proven by adding a stray cell to D-5: refused, then reverted). (2) Its status vocabulary
  had no `LANDED`, so a landed row read UNREADABLE and a tracked row with an unreadable status word
  still exited 0; `LANDED` is now its own class, deliberately NOT in `DONE` (landed = the change is
  present at its target, not that the row's instrument is graded), and an unreadable tracked row now
  refuses (proven by writing `ZZZ-VIOLATION-PROBE` over D-5's status: refused, then reverted).
- **`DONE` in the tracker means CLOSED and CLOSED-PARTIAL only.** A row graded `landed` is displayed as
  `landed, not graded` and is NOT counted done. If a lane close says `closed` while the row says
  `landed`, the tracker now DISAGREES on purpose: the planner must either grade the row closed against
  its instrument or fix the close.
- **D-13 and D-14 read `ADDED` in OPS-25 while the roadmap called both landed.** That is the drift the
  tracker exists to catch, and it was invisible because nothing filed a close. Re-graded 2026-09-18
  (OPS-25 A-9): **D-14 LANDED** (repoint read back, `source_commit_hash` = `smartcity-os` main HEAD;
  its payload-parity and health-probe clauses ungraded), **D-13 OPEN** (the code is on main and proven
  on `d12-main-uat`; `dolphin-app` carries neither the code nor `SMARTCITY_V1_PLATFORM_BASE`, so
  production dashboards still read the GCP copy of v1 for every feed). A-150's "D-13 LANDED" was
  scoped to the code and read as the row; code-done is not customer-done.
- **Counts after the re-grade, stable and matching the last generated tracker:** M1 2/6, M2 3/6,
  M3 4/9, M4 4/6, M5 0/5.
- **A-150 lives in OPS-17's amendment table and describes two OPS-25 rows without moving them.** When
  an OPS-17 amendment moves an OPS-25 row, the OPS-25 row and an OPS-25 amendment must land in the same
  pass, or the plan of record disagrees with itself and nothing notices.
