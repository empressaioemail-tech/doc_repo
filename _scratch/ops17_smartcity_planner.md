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

## 2026-09-18 17:29Z-18:35Z — the D-13 ship performed and accepted

- **GROUND-TRUTH [2026-09-18T17:31Z] `dolphin-app` serves the dashboards.** Deployment
  `e98f127c-aa0b-4550-9908-1044c616641d`, ACTIVE, `cause: "app spec updated"`,
  `services[0].source_commit_hash = 7487d7c0a55deeefc286c4a1047545757b802c5b` = `smartcity-dashboards`
  `origin/main`, and `SMARTCITY_V1_PLATFORM_BASE = https://walrus-app-kzog6.ondigitalocean.app`.
  `app.smartcityos.io` is still the PRIMARY domain. The previous deployment `ded9afcb` served `3d3ec62`.
- **GROUND-TRUTH [2026-09-18T17:29Z] the write is one env entry and nothing else.** Gated by an enumerated
  walk of both spec trees; ten `EV[1:...]` secrets echoed back as returned. Instruments:
  `scripts/govtech/dolphin-ship.mjs` (`--apply`) and `scripts/govtech/dolphin-ship-acceptance.mjs`.
- **GROUND-TRUTH [2026-09-18T18:11Z] the acceptance passes every clause.** 8/11 domains on `bastrop_tx`
  carry records; finance route no longer `unknown lens`; 8 platform routes byte-identical to the GCP host
  production read before the ship; the served `(recordId, subject)` multiset is IDENTICAL to the vendor's
  `(workOrderNumber, type)`.
- **GROUND-TRUTH [2026-09-18T18:22Z] the design gate now reads R4 = 0.** `design-completion-gate.mjs`
  exits 1 on four R3 findings only: `plan-review-departments`, `smartcity-flood-study`,
  `smartcity-map-dock`, `smartcity-overview-lens`. `uncovered: 0`.
- **GROUND-TRUTH [2026-09-18] M5 moved 0/5 to 2/5.** G-142 CLOSED, G-147 CLOSED-PARTIAL, both verified by
  re-running their instruments (G-142 `check.mjs` exit 0 / `violate.mjs` 16 of 16; G-147 `check.mjs` exit 0
  with 18 non-zero predicates / `violate.mjs` 24 of 24). Both released their claims.
- **LESSON `PUT /v2/apps/{id}` names the PREVIOUS deployment, not the new one.** The response's
  `app.active_deployment` is the deployment that is still active; the new one appears only in
  `GET /v2/apps/{id}/deployments`. Reading the running commit from the PUT response polled the superseded
  deployment, saw its old commit, and reported a FALSE failed ship while the real one was building. Find
  the new deployment by SET DIFFERENCE against the pre-write list. Applies to every DigitalOcean app
  script in this fleet, not only this one.
- **LESSON a per-row join on a key whose uniqueness was never measured is not a check.** `recordId` looks
  like a primary key and is not: 181 work-order rows over 52 distinct `workOrderNumber`s, because one work
  order carries several line items. A `Map` keyed on it collapses duplicates and compares each row against
  whichever it kept, which produced 88 phantom "unexplained subject" mismatches that read as a PII defect.
  Measure key cardinality BEFORE joining, or compare MULTISETS.
- **LESSON the loose form of a check nearly got reported.** The first version asked whether each served
  subject appeared anywhere in the vendor's global type SET, and scored 181 of 181. Set membership is
  weaker than multiset agreement and would have passed a column shuffled between rows. Two derivations is
  the requirement; two derivations that AGREE is the check.
- **LESSON `release` takes `--seat`.** Releasing another seat's stale claim from this seat would record a
  release by a seat that did not make it, which is the unattributed mutation the doctrine names. Leave it
  and report it. `d12-dashboards-do-cutover` is stale at 19.6h against a closed-partial row.
- **FINDING `firstdue/apparatus` and `goto/call-summary` 504 on `walrus-app`** where GCP answered a
  structured `503` naming the vendor permission (`contact dashboards@firstarriving.com to request
  apparatus/assets API scope`; `goto_not_authorized, needsAuth: true`). Carded as **G-163**. Placed inside
  the handler by violation: a mutated bearer still returns `401 platform_internal_required` while the
  canonical one returns `504`. Both feeds were already `unavailable`, so nothing broke; the REASON degraded.
- **OPEN the `d14-d13-v1-reach` lane filed no close, CP1 or CP2.** The ship and its acceptance are planner
  acts. That lane's narrow-probe legs and its leave-behind are owed, and a close for it would be graded
  against A-149's items rather than invented.
- **OPEN D-13 scope 5 is ungraded:** a bake window in which a lens is actually opened and GCP
  `smartcity-api` logs zero platform requests. Nothing was decommissioned.
- **OPEN `g160-served-commit-parity` and `g148-design-instruments` are compiled and NOT hand-carried.**
  G-148 is now the only lane between the design gate and exit 0.
- **OPEN `P:\tmp` holds throwaway probe scripts** (`dash` clone, several `.mjs` probes). Not repo
  artifacts, not tracked, and none of them carries a credential value.

- **DEAD-END the surface probe's one FAIL is already an open row; do not card it.** `_inbox/2026-09-18_171246_surface_probe.json`
  (39 leg results, tally 6 PASS / 1 FAIL / 32 UNMEASURED, ran at `d6ab5e46`) fails on **P-154** only:
  `panel 20/5/20/-; endpoint 25/7/15/7; MCP none; PDF none; panel and endpoint DISAGREE`. P-154's own predicate
  is "four surfaces print identical setbacks and date for `48021:34049`, or all four show the conflict row", and
  the row is still `ADDED`. The FAIL is that unlanded row reporting truthfully, not a new defect; the same
  disease was carded as P-152 in A-137. No new row.
- **DEAD-END do not commit the `*_surface_probe.log.txt`.** It is not written by any repo script:
  `scripts/surface-probe.mjs:3034` writes the JSON with default UTF-8, and the `.log.txt` is a PowerShell
  redirect, which is UTF-16LE (`FF FE` BOM), so git stores it as a BINARY blob no `rg` can read. 121
  `*surface_probe.json` are tracked and ZERO `*.log.txt` ever was: the JSON is the artifact of record and the
  log is shell scratch. Unstaged and deleted rather than introducing the repo's first binary log.

- **LESSON two runs of ONE instrument are ONE derivation, however much time passes between them.** The
  acceptance read the per-feed domain counts twice, ending 17:47:43Z and 17:56:43Z, and the two bodies are
  BYTE-IDENTICAL except `elapsed_ms` and `ended_at`, over 120 body lines. That is a stability observation
  about a nine-minute window and NOT corroboration of the number: one party running one predicate twice
  cannot disagree with itself, so agreement carries no information about whether the source is right.
  Independence is a property of the SOURCE, not of the run count. No committed claim rested on it as two
  sources, so nothing had to be corrected, but it is the shape that manufactures a false second derivation
  for free.

## 2026-09-18 20:00Z-20:45Z - the next wave compiled, the gate caught mid-flight

### GROUND-TRUTH (read at source this session, with timestamps)

- **`design-completion-gate.mjs` re-run at 2026-09-18T20:19:39.877Z:** 20 design folders, **17 carrying an
  instrument**, nav `smartcity-dashboards` origin/main `7487d7c0` read at `src/staff-review.mjs`; 15 nav
  surfaces, 13 designed, 2 excluded by ruling, **0 uncovered**; **ONE R3 line** (`smartcity-overview-lens`);
  `exit 1`. At session start it read **14 instrumented and FOUR R3 lines**. The change happened during the
  session because `g148` is delivering mid-flight.
- **`_design/smartcity-flood-study/check.mjs` EXITS 1 on the shipped boards, with one finding.**
  `violate.mjs` exits 0 catching **30 of 30** planted violations, so the instrument works both directions.
  The finding: the design says naming a depth by return period needs "a local rainfall atlas nobody has
  cited yet", while the engine carries `rainfallSource: noaa-atlas14 / parameter / default`, cites NOAA
  Atlas 14 seven times, and `returnPeriodYearsForDepthInches` renders `100-yr (NOAA Atlas 14)`.
- **`smartcity-public-works-lens` and `smartcity-fire-ems-lens` carry `check.mjs` and NO `violate.mjs`.**
  Their two-direction proof is EMBEDDED as self-tests inside `check.mjs`, which prints
  `self-tests: N/N passed, both directions` before reading a board. A-139's separate-`violate.mjs` is the
  newer convention, not the only valid one. Both `check.mjs` exit 0 with non-zero matched-input counts.
- **The `g148` instruments are UNCOMMITTED** (`??` in `git status`) and carry debris:
  `.dbg.mjs`, `.check.log`, `.violate.log` in `smartcity-flood-study` must not reach the commit.
- **Claims now:** `g153-fleet-police-lens` live (seat `cente-vsc-g153`), `g148-design-instruments` live
  (seat `cente-vsc-g148`), `g162-v1-finance-honesty` RUNNING UNCLAIMED, `g160` stopped without one.
  9 open claims, 7 stale. `g153`'s artifacts are current: fleet and police check and violate runs, a live
  record refusal, and the full-shell probe that is G-135's parcel 2.
- **`smartcity-os`'s local checkout is on `d9-api-8bea7fa` at `e783f351`, a SIDE BRANCH, not `main`.**
  Read `origin/main` from it, never the working tree, before concluding anything about that repo.

### LESSON

- **LESSON a markdown table row has TWO index bases and I used the wrong one.** `line.split(/(?<!\\)\|/)`
  keeps the empty leading element, so the STATUS cell is `parts[7]`; `parts.slice(1,-1)` drops it, so the
  same cell is `c[6]`. I wrote with `parts[6]` believing it was the status and **OVERWROTE the BLOCKED cell
  on G-152 and G-163**. The tracker did not catch it, because it reads the status cell, which I had not
  touched. It was caught by re-reading the rows. **Rule: assert the CURRENT value of the cell you are about
  to write, and the row's cell count before and after.** Both are now in the repair script.
- **LESSON the tracker REFUSES a status whose LEADING word is not in its vocabulary.** `CLASSES` is at
  `smartcity-tracker.mjs:40`; `classify()` returns `unknown` and the run exits 2 naming the row. `DISPATCHED`
  is a routing fact, not a completion class, so it must FOLLOW the class word:
  `OPEN, DISPATCHED 2026-09-18 (A-154), ...`. Do NOT widen the vocabulary to admit a routing word; the
  refusal is the control.
- **LESSON R3 tests `hasCheck`, never the exit code** (`design-completion-gate.mjs:157-163`). The gate can
  therefore exit 0 with an instrument on disk that reports a live FAIL. Enumerate what a control's answer
  MEANS before treating its exit code as a verdict. Recommended fix, NOT done because it is G-146's gate and
  the operator's call: either run the instruments and report exit codes, or state that existence is all it
  checked.
- **LESSON G-149 and G-152 were not interchangeable, and row order would have picked the wrong one.** G-149
  INHERITS `_design/smartcity-flood-study/check.mjs`, which `g148` is still delivering and still owns, so
  G-149 waits on `g148` AND `g153`. G-152's two designs are touched by no running lane. Choosing by
  dependency beat choosing by position in the recommended order.
- **LESSON a same-repo collision is worth MEASURING, not asserting.** G-162 (`finance.ts`, `opengov-bnp.ts`,
  `services/opengov-bnp.ts`) and G-163 (`firstdue.ts`, `goto.ts`) do not overlap on their primary files;
  `ai-assistant.ts` matches both greps. So the `smartcity-os` serialization is discipline, not a hard merge
  necessity, and both the mission and A-154 say so rather than overstating it.

### OPEN

- **Hand-carry owed:** `g160` parcel 2 now; `g152` and `g163` WHEN their lanes close. Both are compiled and
  deliberately held, because sending them early is the collision the serialization exists to prevent.
- **Operator rulings owed:** whether the design gate RUNS the instruments it counts; AND **an owner for the 11
  design findings G-148 disclosed**, which no row owns (recommended: one row for all 11, since the repair and the
  instrument proving it are one unit of work); and the flood-study rainfall claim (design copy vs the engine's
  broken-parser citation).
- **`g148`'s debug debris** (`.dbg.mjs`, `.check.log`, `.violate.log`) must not be committed.
- **G-163 is not in any milestone's tracked row list**, so it will never appear in the tracker's counts.
  Deliberate or not, nothing grades it.
- **`--violate` on `design-instrument-exits.mjs` is BLOCKED until `_design` is clean.** It now refuses a dirty
  tree by design, and `_design` holds `g148`'s 25 paths until the planner commits them. Run plain mode any time;
  run `--violate` only on a clean tree, and `git status -- _design` after.

### GROUND-TRUTH (2026-09-18, this pass)

- **`G-148` CLOSED at 20:43:47Z**, claim released, row regraded, tracker passes (`PASS every tracked row agrees
  with its own close`). Close `_inbox/2026-09-18_g148-design-instruments_close.json`.
- **The 11 findings were recounted at source, not read from the close:** each `check.mjs` prints its own total as
  `N violation(s).` (records-search uses `failure(s)`), and the four read 4 + 1 + 4 + 2 = 11. The close's prose
  says 11 as well. Two independent derivations, agreement, so the number is safe to quote.
- **G-148's own numbers, verified:** gate zero R3 findings and `exit 0`; self-tests 48/48, 45/45, 47/47, 57/57;
  violate proofs 17/17, 30/30, 21/21, 41/41; 109 plants, 109 caught.
- **`_design/smartcity-records-search/Main.dc.html` is CLEAN at HEAD** and `check.mjs` exits 0 on it. Confirmed
  after the damage below was restored, and 3 of 3 repeat `violate.mjs` runs from the clean tree are clean.
- **The lane left `_inbox/2026-09-18_g148_surface_probe.log.txt` in UTF-16** (first bytes `FF FE`), the
  PowerShell redirect artifact again. Excluded from the commit; the `.json` beside it is the artifact.

### LESSON (this pass)

- **A batch sweep of mutate-capable instruments IS a writer over canon, and nothing was verifying restoration.**
  Running 18 `violate.mjs` in a loop left `_design/smartcity-records-search/Main.dc.html` (tracked, RATIFIED,
  G-147 CLOSED) with its `data-coverage-rule` element stripped. `git status` found it; the sweep reported it
  only as one line inside that folder's captured stdout. The fix is mechanical, not a resolution to be careful:
  refuse a dirty tree, verify restoration per folder, name every file restored, exit 2.
- **A whole-output `.trim()` on git porcelain deletes the leading status column.** ` M path` becomes `M path`,
  every path shifts by one character (`_design/x` printed as `design/x`), and a one-character status becomes
  unparseable. Strip trailing newlines only.
- **An absolute Windows path is not a valid git pathspec.** git reads backslashes as escapes, matches nothing,
  and returns an empty list, which is a "clean" answer for a dirty tree. Pass repo-relative pathspecs.
- **The correcting edit is as unverified as the original.** While fixing one memory-sourced claim in
  `00_current_state.md` I silently renamed `parsePfdsDepthTable` to `parsePfdsTable`, from memory, in the same
  paragraph. Caught by grepping both spellings and reading `noaaAtlas14.ts:29`. Re-grep after a correction.
- **A lane's close can be more honest than the planner expected, so read it before theorising.** `g148`'s close
  records `contradicted` (it expected four RATIFIED designs to be clean; they are not) and names the 11 findings
  as `leave_behind`. The correct planner act was to VERIFY the count and regrade, not to treat the close as a
  lane hiding failures.
- **The tracker caught a close within minutes of it landing** (`DISAGREE G-148 row=open close=closed`) and refused
  a verdict. That refusal is the control working, and regrading the row is what makes it pass. Do not widen its
  vocabulary to make it pass.
- **A separate instrument from the gate was required, and the gate's wording was already honest.** The gate prints
  "carries an instrument"; the defect is a reader taking `exit 0` from `design-completion-gate` as "clean". Fix
  the reading, not the gate's sentence.

---

## 2026-09-18 20:56Z — integration-seat pickup (OPS-17 design gate and queue)

### GROUND-TRUTH (read at source this session)

- **Snapshot:** doc_repo `P:/doc_repo` `main` `a86f2f39`, **integration seat**. `_state/govtech/STATE.md` is
  OWED to the govtech seat (`P:/seat-worktrees/govtech/doc_repo`, `seat/govtech`): the seat gate refuses any
  `_state/<ns>/` write from integration, enforced (`namespace_from_integration`), and this seat did not route
  around it. `_STATE.md` at the root remains regenerable from here.
- **`smartcity-tracker.mjs` PASS, exit 0**, 26/26 self-tests both directions. M1 2/6, M2 3/6, M3 4/9, M4 4/6, M5 3/5.
- **`design-completion-gate.mjs` exit 0, `verdict: FINISHED`**, read 20:56:15.915Z: 20 folders, 18 carrying an
  instrument, 15 nav surfaces, 13 designed, 2 excluded, **0 uncovered**.
- **`design-instrument-exits.mjs` (plain), 20:56:16.938Z: 18 run, 4 FAILING** — `plan-review-departments`,
  `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`, exactly the four `g148` delivered.
  The gate's `exit 0` and the four failures are true at the same instant.
- **Lane claims: NO live claim for `g153`, `g162` or `g160`.** `lane-claim.mjs status` lists 7 claims, every one
  STALE, none of them a SmartCity lane. `g148` released on its close. **`g153`'s claim is ABSENT and it filed
  NO close** (no `*g153*close*.json` exists under `_inbox`), while its artifacts (`_inbox/2026-09-18_g153_*`) and
  its uncommitted `check.mjs` edits both sit in this tree. **G-152's precondition (a filed g153 close) is NOT met**
  as read at 20:56Z. **CORRECTED at 16:06 local: the close DOES exist and was copied into this tree mid-session
  (`closedAt 20:38:32Z`); G-152's precondition is MET. See the 21:45Z section.**

### LESSON

- **`design-instrument-exits.mjs` writes tracked canon in PLAIN mode too, not only under `--violate`.** Each
  `_design/*/check.mjs` rewrites its own `instrument-report.json` with a fresh `generatedAt`; one plain run swept
  5 tracked files (`plan-review-reasoner/identifier-extraction.json`, `plan-review-departments`,
  `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`). The handoff named only `--violate`
  as the writer. Restored here with `git restore` after confirming the diffs were `generatedAt`-only. **Run
  `git status -- _design` after ANY instrument run, plain included, and revert timestamp-only churn.**
- **A lane can work directly in the integration tree with no claim and no close.** `g153` edited
  `_design/smartcity-fleet-lens/check.mjs` (+85 lines, the `\bOPR-` extractor fix) and
  `_design/smartcity-police-lens/check.mjs` (+44) in `P:/doc_repo`, holds neither a registry claim nor a close,
  and there is no dedicated `g153` worktree in `git worktree list`. A second session reading the registry would
  conclude the lane is not running.

### OPEN

- **11 findings, no owner** (`A-158`) — **RESOLVED this session**: carded as **G-164** (one row, operator-ruled
  2026-09-18), the flood-study half blocked on G-125 and the other ten unblocked. See A-159.
- **Gate-vs-exits meaning** (`A-155`, `A-156`) — **RESOLVED this session**: R3 now RUNS each instrument and
  requires exit 0; the gate exits 1 with the four named. See A-159.
- **`g153` liveness** — read as unresolved at 20:56Z (claim gone, no close, artifacts plus uncommitted
  `check.mjs` present). **CORRECTED at 16:06 local: the close exists; see the 21:45Z section.**
- **`--violate` stays blocked** while `_design` holds `g153`'s two `check.mjs` edits; they are not this seat's to
  commit or revert (`A-154`: stop and report an uncommitted tree that is not yours).
- **`g160` parcel 2 and `g163` compiled and un-handed**; `g163` queues behind `g162`, running unclaimed
  (worktree `P:/seat-worktrees/g162-v1-finance-honesty/doc_repo` at `3243a171`).

---

## 2026-09-18 21:45Z — integration seat, both operator rulings applied (OPS-17 A-159)

### GROUND-TRUTH (read at source this session)

- **A-159 is written; the plan of record carries both rulings.** `G-164` carded at OPS-17 line 245 (band 5,
  accept `B`, blockedBy G-125 for the flood-study finding only); `A-159` at line 477, contiguous with A-158.
  Both checked by cell count rather than by eye: G-164 = 7 cells, A-159 = 5 cells, each matching its table.
- **Ruling 2 implemented and PROVEN BY VIOLATION.** `scripts/govtech/design-completion-gate.mjs` now runs each
  folder's `check.mjs` and fails R3 on a non-zero exit, on exit 2 (the instrument's own refusal to reach a
  verdict), and on a null exit (unrunnable). It exits **1** with exactly four R3 findings naming
  `plan-review-departments`, `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`.
  Self-tests 23 -> **27/27**, with fixtures for each new failure mode and a non-vacuous `passingInstrument`.
- **The enabling change**: five `check.mjs` write their report only when the measured body changed
  (`smartcity-overview-lens`, `smartcity-flood-study`, `smartcity-map-dock`, `plan-review-departments`,
  `plan-review-reasoner`). A full gate run now leaves **no** `instrument-report.json` churn (verified:
  `git status -- _design/*/instrument-report.json` empty).
- **`smartcity-tracker.mjs` PASS, exit 0, 26/26 self-tests**, 118 OPS-17 rows read, tracking 32 rows.
- **`_design/INDEX.md`** carries the four replacement lines the `g148` close supplied. `G-149` and `G-157`
  each carry their instrument-inheritance clause in their status cell.

### LESSON

- **An approved enabler can be wrong on contact; record the deviation rather than smoothing it.** "Make
  `check.mjs` read-only by default" breaks every `violate.mjs`, each of which refuses when
  `instrument-report.json` is absent. Write-only-on-change meets the approved intent (a plain measurement must
  not churn canon) without breaking the proof. Re-check a ruling's premise against the dependency it did not name.
- **A blank line inserted between table rows silently breaks the markup table.** A-159 first landed with one
  above it because the insertion anchor was the `## Assumptions` header. After adding any table row, assert its
  neighbours with a script, not by eye.

### OPEN

- **`g153` liveness RESOLVED**, and the earlier reading was of a tree that did not yet hold its close. The close
  **does** exist: `_inbox/2026-09-18_g153-fleet-police-lens_close.json`, `closedAt 2026-09-18T20:38:32Z`, seat
  `cente-vsc-g153`, `planRows [G-153]`, `status closed`, 5 `leave_behind` items. **G-152's precondition (a filed
  g153 close) is MET.** The two uncommitted `check.mjs` edits (`fleet-lens`, `police-lens`) are named in that
  close's own `leave_behind` as uncommitted here, so committing them is the planner's act, and it is what unblocks
  `design-instrument-exits.mjs --violate`.
- **THE TRACKER WENT RED AND THEN GREEN AGAIN, AND THE REGRADE WAS NOT THIS SEAT'S — A CONCURRENT WRITER
  REGRADED THE ROWS WHILE THIS SESSION WAS READ. Timeline, measured:** three closes were copied into this tree
  mid-session (`CreationTime` 16:06-16:08 local, `LastWriteTime` preserving 15:16-15:49): `g153` (close `closed`,
  row `G-153`), `g162` (close `closed-partial`, row `G-162`), `g160` parcel 2 (close `closed-partial`, row
  `G-160`). The tracker then REFUSED, exit 1, `DISAGREE row=open close=closed` on all three. **At 16:12 this seat
  read those three rows as `OPEN` and drafted their regrade; at 16:13:35 the OPS-17 file was rewritten by another
  writer to `CLOSED-PARTIAL` for all three with planner-at-source verification text, and the tracker PASSED.**
  That writer also added its own `A-160`, which is about `smartcity-os`'s repo-intent posture and NOT about the
  regrade. **This seat's `StrReplace` anchors then failed to match, which is the only reason the concurrent write
  was caught.** `git log` shows HEAD is still this session's commit `54e46861`, so the other writer's OPS-17 edit
  and all three closes are UNCOMMITTED and untracked.
- **STOP AND REPORT; do not commit another writer's tree.** A-154 governs: an uncommitted tree that is not yours
  is not yours to clean, stash or commit. This seat therefore committed ONLY its own scratch file and did NOT
  touch OPS-17, the three closes, or the other writer's amendment. **A second writer in the integration tree is
  the one-bulk-writer-slot law being violated by construction, and it is the second instance of the `g153`
  lesson above: two agents can be mid-edit in one worktree and neither sees the other until an anchor misses.**
- **`g162`'s close is malformed** and the concurrent writer's regrade does not fix it: `closedAt` and `seat` are
  both `undefined` while the sibling closes carry both, so it cannot be sequenced against a sibling.
- **`_state/govtech/STATE.md` is OWED to the govtech seat** (`P:/seat-worktrees/govtech/doc_repo`); the content
  is in this session's report and must be written from that seat, never from integration.
- **Committed by this seat: `54e46861`** (14 files: the A-159 batch, the gate R3 change, the five-write-enabler
  change, the INDEX lines, this scratch, `_STATE.md`). **Uncommitted and NOT this seat's: OPS-17's three regrades,
  the other writer's `A-160`, and the three closes.** doc_repo commits by explicit pathspec, never `add -A`.

## 2026-09-18 late session (this seat): G-163 closed on production, plus four instrument lessons

- **GROUND-TRUTH 2026-09-18T22:49Z: G-163 IS CLOSED AND ITS LAST CLAUSE IS MET ON PRODUCTION.** `smartcity-os`
  PR #61 merged to `main` at merge commit `03cebec5d1eb31ba61185ac1aa365ea52074b586` (base `85a332e`, no drift).
  Shipped to `walrus-app` (`2a2a3a1a-b441-4296-8628-a82b20ded1b2`, serving `smartcityos.io`) as deployment
  `2657e628-22fd-4bdf-85ae-9c2daf2f6375`, forced with `force_build: true`. Pre-ship `source_commit_hash`
  `1f0262f15f8d1898a6c32826ec2e45407518e29e`; post-ship read back `03cebec5...` byte for byte. Three planner
  legs against `https://smartcityos.io` with the canonical `PLATFORM_INTERNAL_API_KEY` from Secret Manager:
  pre-ship `--expect pre-fix` **7/7 PASS exit 0**, post-ship `--expect post-fix` **7/7 PASS exit 0**, post-ship
  `--expect pre-fix` **5 PASS / 2 FAIL exit 1** (the instrument fires in both directions). Logged as OPS-17
  `A-169` (assignment) and `A-170` (the close and the mechanism correction).
- **GROUND-TRUTH: the row's own diagnosis was WRONG and it was corrected in place.** The row said "a Cloudflare
  `504` HTML page" and asserted the defect was "INSIDE the handler and not at the auth path". The lane disproved
  both. The handler answered a complete structured `503` in 2 to 3ms on the request's own log line, and
  `x-do-orig-status: 503` proves the edge received it. **The cause is DigitalOcean App Platform's edge, which
  DISCARDS an application-generated 502, 503 or 504 and substitutes its own 1263-byte HTML gateway page.**
  Measured against a throwaway `go-httpbin` container with no handler, no vendor and no credential: 200 400 401
  403 409 424 429 500 501 507 arrive verbatim; 502 503 504 do not. **The fix is a boundary rule, not a route
  edit:** `server/edge-status.ts`, installed once in `server/app.ts`, re-issues those three codes as `424` with
  `x-orig-status` preserving the handler's code and the body untouched.
- **LESSON (platform fact worth a durable home): on DigitalOcean App Platform, 424 is a status the edge carries
  and 502/503/504 are not.** Any handler whose failure semantics need a 502/503/504 to reach a caller must
  re-issue it as 424 with the original code on a header. Anything relying on a literal 503 arriving is
  unachievable on this platform by any means.
- **LESSON (instrument): a post-write check must not report a pre-write state.** Two of this session's edit
  scripts ran `writeFileSync` and *then* their verification, and on a failed verification printed
  "REFUSED: ... Nothing written." while the file had in fact been rewritten. **The message was a false statement
  about durable state, produced by the very script meant to protect it.** Order matters: check the preconditions,
  write, re-read, and report the state you actually observed. Where a post-write check can fail, either restore
  the prior bytes or say plainly that the write happened and the check failed.
- **LESSON (guard predicates key to the shape, not the substring): `src.includes('A-170')` refused a legitimate
  append**, because the row written minutes earlier referenced `A-170` in its own text. Match the amendment row
  (`/^\| A-170 \|/m`), never the bare id. The same class as `ENFORCEMENT.md`'s "do not declare a defect class
  closed by grepping for a type when the property is semantic."
- **LESSON (counting): a markdown table row with N columns splits into N+2 parts**, because `split('|')` yields a
  leading and a trailing empty string. Asserting 5 parts for a 4-column row refused a correct edit twice. Count
  the columns, or assert on the leading and trailing empties explicitly.
- **DEAD-END: the lane's own proof surface cannot be re-run by a holder of the canonical secret.** `g163-v1-uat`
  (`1537c202-a444-4cf6-abcc-3178749198ae`) carries a **lane-generated** `PLATFORM_INTERNAL_API_KEY`, so the
  canonical key is correctly refused there with `401 platform_internal_required` and the lane's post-fix leg is
  NOT reproducible by the planner. Its close claims "a stranger ... can re-run it", which is overstated for that
  app. **The working path is to verify on production after the ship, where the canonical key IS accepted** (the
  third-route control proved it: same host, same key, `200` with 294 records). Next lane that stands up a UAT
  app: either source the platform key from the canonical secret, or state in the close that the proof is
  one-seat-only.
- **GROUND-TRUTH (confirms the roadmap's existing note, does not supersede it): the raw `*.ondigitalocean.app`
  hostnames reset from this box.** `https://walrus-app-kzog6.ondigitalocean.app` -> `read ECONNRESET`, 7/7 legs
  UNMEASURED, exit 2, while `https://smartcityos.io` served the same app normally in the same minute. The
  instrument reported UNMEASURED rather than passing, which is the correct fail-closed behaviour.
- **OPEN, PLANNER-OWNED: `g163-v1-uat` is still ACTIVE** on `fix/g163-opaque-platform-routes`, and it **shares
  production's Neon store** (G-162 measured that `smartcity-DATABASE_URL` and `smartcity-staging-DATABASE_URL`
  resolve to the same endpoint). It also carries the four boot-time credential keys EMPTY on purpose, because
  `server/app.ts` resets passwords and creates users at boot when they are truthy. **The lane declared it with
  the planner as owner and asked for it to be torn down or re-pointed once the ship landed; the ship has landed.**
  `g162-v1-uat` carries those four keys NON-EMPTY and is the sharper hazard of the two.
- **OPEN, OWED TO THE OPERATOR, NOT ACTED ON: a plaintext-credential sweep of `P:\tmp` found 19 files carrying a
  `postgresql://user:pass@host` URI**, including the three the `g163` close named (`g162-spec.json`,
  `g162-spec-prefix.json`, `g162-spec-postfix.json`) which carry the production Neon connection string. This seat
  did not delete another lane's material, following the posture that close modelled when it reported them rather
  than removing them. **Cross-seat scratch is not one seat's to shred; the sweep and its owner are a decision.**
- **PROCESS NOTE: this seat wrote A-168 with its substance in the Reason column and only a headline in Change.**
  It is structurally valid (7 parts) and is left unedited under the append-only rule; `A-169` records that its
  Reason should be read as its Change.
