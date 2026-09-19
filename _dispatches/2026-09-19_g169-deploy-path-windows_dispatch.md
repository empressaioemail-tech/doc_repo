Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

CANON-PREAMBLE v49001500
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS CONFIGURED FLEET-WIDE, BUT DOCTL AUTH IS PER-SESSION (operator 2026-09-17, corrected 2026-09-17 per OPS-25 D-11's close) — the `do-apps`/`do-droplets` MCP servers are configured in the global Cursor config on the fleet machine with an agent token scoped to Droplets and Apps only (no account, database, or networking access), and that MCP config travels with any lane using this machine's Cursor. `doctl`'s own CLI auth does NOT reliably carry over to every lane's session (found unauthenticated in D-11's environment) — a lane needing `doctl` specifically, not just the MCP tools, should confirm with `doctl account get` and run `doctl auth init` itself if needed, rather than assume it is live. Do not ask the operator to reconfigure the MCP servers or token; do check `doctl` auth per-session.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v378cd643 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: G-169 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: plan-review, smart-files
FAN-DEPTH: 0
This lane launches no sub-agents (stated at the top; the commit gate refuses a close that declares any fan, A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g169-deploy-path-windows --seat <your-seat-id> --plan-row G-169 --dispatch _dispatches/2026-09-19_g169-deploy-path-windows_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g169-deploy-path-windows --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-17 govtech stack (Dashboards, Smart Files, Plan Review, ICC demo)

You are working a lane of OPS-17. The rulings below were standing decisions in the shared
preamble until 2026-09-11; they are program law and moved here so lanes in other programs stop
carrying them. Each still binds every OPS-17 lane. If this section conflicts with the general
canon preamble, this section is narrower and wins on scope; if it conflicts with the AGENT
CONTRACT or ENFORCEMENT, those win.

- BASTROP IS THE PROVING PACK (operator 2026-09-18, `_decisions/2026-09-18_bastrop_is_the_proving_pack.md`, OPS-17 A-146). SmartCity designs are implemented and PROVEN on `bastrop_tx`, against the live data Bastrop already has wired. `template-city` is a demo and fixture pack, and a pass on it is not a pass on a Bastrop design. `bastrop_tx` grants seven live feeds today (municode calendar; MyGov, one kind-level grant covering permits, work orders, inspections, code violations and business licenses; Samsara, Spireon, FirstDue, Power BI CIP, GoTo), so Development services, Fleet, Police, Public works and Fire and EMS can read live Bastrop data now. Four rules. (1) Verify every dashboards design build on `bastrop_tx` and its granted feeds. (2) Bastrop data that is wired in v1 but not reachable from v2 (OpenGov, OpenGov budgeting and planning, v1 permit revenue, the v1 executive overview) is a BRIDGE to card, never a fixture to fall back on: a v1 platform route, a v2 adapter declaration, and a `bastrop_tx` grant. Until the bridge lands, the surface says so as a declared absence. (3) Never default a city: a route that takes `cityKey` REFUSES when it is missing, because a `template-city` default silently serves demo data. (4) v1 (`smartcity-os`, behind `smartcityos.io`) is still production. Adding a platform route to it is a bridge and is allowed; every v1 deploy goes by canary with `services[0].source_commit_hash` read back (OPS-25 rule 13), and the v1 surface Bastrop uses today is never broken. This SUPERSEDES the August template-city-first, "live Bastrop is an island", "live Bastrop no-touch" and "live Bastrop stays `smartcity-os`" rulings below, which were right when no Bastrop pack existed and were never retired after G-116 created one.
- A `bastrop_tx` PROOF NEEDS A CREDENTIAL, AND ONLY ONE KIND IS YOURS TO USE (OPS-17 A-148, G-135). A tenant-private pack answers 401 to an anonymous read on any deployed app. The key a lane may use is the verification-scoped `bastrop_tx` key minted under G-135; `_catalog/credential_access_index.json` (entry `hauska-tenant-key-bastrop_tx-lane-verification`) says whether it exists yet and where it lives. Read it into your process environment from inside a script file, and never print, commit or paste it. Never use the operator's own pilot key ("Nick, bastrop_tx staff pilot"), and never ask the operator to paste a key into a file. If the verification key does not exist yet, the `bastrop_tx` leg is UNMEASURED, and you say so; it is never replaced by a `template-city` pass. The refusal directions need no key, so prove them anyway: keyless is refused, `bastrop_tx` named anonymously is 401, and an unknown pack is 404.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — **SUPERSEDED IN PART 2026-09-18 (A-146):** the "template Dashboards UI first, then one feed onto `template-city`" sequencing and "live Bastrop is an island, not the next card" are retired by BASTROP IS THE PROVING PACK above. Still in force: three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. (The "live Bastrop no-touch" clause is SUPERSEDED 2026-09-18, A-146; see BASTROP IS THE PROVING PACK. v1 is still never broken, per its rule 4.)
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. **SUPERSEDED IN PART 2026-09-18 (A-146):** v2 on `bastrop_tx` is now the named replacement. v1 `smartcity-os` stays production and is changed only as a bridge, by canary. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.


## Mission - G-169: `scripts/deploy.mjs` cannot spawn its own tools on Windows, so the deploy path is un-exercisable by its own file

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `plan-review` and `smart-files`. You write nothing
in `doc_repo` (hand any doc edit back as a diff, uncommitted) and nothing in any other repo.

**One PR per repo, branched from that repo's current `origin/main`.** The file is the same file in both
repos; if you find it has drifted, say so in your close rather than silently picking one.

### The state you are inheriting

On 2026-09-19 the planner executed G-160's owed deploy. It could not be run through this script. The
deploy path has, as far as any record shows, **never once executed on the fleet's own machine** - which
is why the row sat owed for a day while its self-tests and its CI were green.

`scripts/deploy.mjs` was written for this box and its header is careful about almost everything: it
refuses a dirty tree, resolves the commit from `git rev-parse HEAD` and never from a tag or a branch,
uses `--update-env-vars` rather than the replace form, passes the console `SERVED_COMMIT` at runtime,
and has deliberately no `--skip-gate` and no `--force`. It builds its argv arrays explicitly and says
why:

> No shell string is ever built, so a commit or a project name can never be re-split into another flag.

**That property is the reason for the defect.** The argv arrays are correct and the spawn is not.

### The mechanism, measured on this host

`issue()` is the only place the script runs a real tool:

    function issue(argv, label) {
      console.log(`  $ ${argv.join(" ")}`);
      try {
        execFileSync(argv[0], argv.slice(1), { cwd: REPO, stdio: "inherit" });
      } catch (err) {
        console.error(`\n${label} FAILED (exit ${err.status ?? "?"}). The deploy is NOT done: the gate never ran.`);
        process.exit(EXIT.GATE_FAILED);
      }
    }

`argv[0]` is `"gcloud"` or `"vercel"`. On Windows both names resolve to a `.cmd`/`.ps1` shim, and Node
cannot spawn either without a shell. Measured directly at 2026-09-19T12:24Z on this machine:

    execFileSync("gcloud",  ["--version"])                   ->  FAIL code=ENOENT
    execFileSync("gcloud.cmd", ["--version"])                ->  FAIL code=EINVAL
    execFileSync("gcloud",  ["--version"], {shell:true})     ->  OK   Google Cloud SDK 567.0.0
    execFileSync("vercel",  ["--version"], {shell:true})     ->  OK   54.20.1

`gcloud.cmd` failing with **EINVAL** rather than ENOENT is Node's `.cmd`/`.bat` spawn block, not a
missing file; there is no variant of the bare-name call that works.

**The failure concealed its own cause, and that is the second half of the defect.** `err.status` is
`null` on a spawn error rather than a process exit, so the message rendered as

    api      plan-review <- 4d3da57999c2208a48f32c22fa82a2c55cd7df4e
      $ gcloud run deploy plan-review --project plan-review-505715 ...
    the API deploy FAILED (exit ?). The deploy is NOT done: the gate never ran.

A reader cannot tell a missing executable from a crash, a permission failure or a non-zero exit. Name
the failure kind in the message: a spawn error and a process exit are different events and must not
render identically.

**`served-commit-parity.mjs` is not affected and must not be touched.** It invokes through a bounded
shell string, which is exactly why the gate can pass its self-tests and its CI while the other half of
the same deliverable had never run. If you "fix" the gate you have moved the defect, not removed it.

### What the repair must achieve, and the trap

**The end state: on a Windows host, the same spawn path `issue()` uses actually runs a real tool, and
the argv-array property survives.** The trap is that the obvious one-word fix - adding `{shell: true}`
- silently discards the property the header exists to protect. With a shell, `argv` is concatenated
rather than passed, so a commit, a project name or a service name containing a space, a quote or a
semicolon can be re-split into additional flags. Node even warns about it (`DEP0190`).

Choose one of these and say which you chose and why:

- **Resolve the executable explicitly** rather than relying on a PATH shim, so the array stays an
  array. `gcloud.cmd` cannot be spawned directly, but the `.cmd` can be run through `cmd.exe` with the
  arguments still passed as an array, or the underlying executable can be located and called directly.
  This keeps the property at full strength.
- **Keep a shell, and earn it.** Assert every value against the pattern it must match before it reaches
  the shell: the commit against `^[0-9a-f]{7,40}$`, the service and project and Vercel project against
  their allowed character set. Refuse on a mismatch. This is weaker than the array, and it is only
  acceptable because the values are already constrained - so the assertion must be a real refusal, not
  a comment claiming the values are safe.

**Do not** weaken the clean-tree refusal, the commit resolution, the `--update-env-vars` merge, the
gate, or the absence of a bypass flag. **Do not** add a `--force`, a `--skip-gate`, or a `--no-verify`.

### How the fix is proven, and what does not count

**A `--dry-run` passing is not evidence and must not be offered as any.** The dry-run resolves the
commit and prints the plan; it never reaches `issue()` at all, which is precisely how this defect
survived. A green dry-run on a broken spawn is the same shape as a green check about the wrong surface.

Two things must be shown, and the first is the one that matters:

1. **The spawn path works against the real CLIs, end to end, on this host.** Call the same mechanism
   `issue()` uses - factor it out if you must, so the proof exercises the shipped code and not a
   paraphrase - and run a real, read-only command through it: `gcloud run services describe` against a
   real service, and a read-only `vercel` command. Show the exit code and the actual output. **This
   proves the mechanism without deploying anything.** A read-only command through the real spawn path
   is the whole falsifier; you do not need to shift traffic to prove the spawn works.
2. **The instrument can fail.** A self-test wired into the product's own test command, in the style
   this repo already uses for `served-commit-parity.mjs --self-test`, which spawns a tool that exists
   (must succeed with real output) and a tool that does not (must fail with a NAMED reason, not a
   silent pass and not a bare `exit ?`). Verify it by violation: revert the spawn to the bare-name
   call, confirm the self-test FAILS, restore, confirm it passes. Report both runs.

**Do not deploy production to prove this.** The next real deploy is the true end-to-end proof and it is
not yours to take; your proof is that the spawn path is exercised and named. Shifting traffic without a
P-170 lease is a contract violation and this row is not an exception to it.

### Scope, traps, and what is already known

- **Both repos carry the file.** Fix both, one PR each, from each repo's `origin/main`.
- **The deploy will still be run by hand until this lands.** Do not imply in your close that the fleet
  is now deploying through the script; it is not, until a real deploy uses it.
- **Do not widen this into a deploy-path rewrite.** The gate, the parity check, the lease law and the
  sequencing are out of scope. This row is one spawn mechanism and one error message.
- **The error message is part of the deliverable.** `FAILED (exit ?)` must become a message that says
  whether the tool could not be spawned, what was being run, and what to check. A spawn failure and a
  non-zero exit must be distinguishable in the output.
- `_catalog/leases/` holds only its README; there is no lease in flight and none is needed for this row.
- **Do not edit `_catalog/lane_claims.json`, the plan of record, or any `_inbox` close.** Those are
  planner-owned here.

### Evidence to hand back

- Both PRs, each on its repo's `origin/main`, with the spawn-path proof and the self-test proof.
- The verbatim `--self-test` output in BOTH directions: passing on the fix, and failing when the spawn
  is reverted to the bare-name call.
- The verbatim output of the read-only real-CLI commands run through the shipped spawn mechanism.
- `leave_behind` per the contract: anything you touch that outlives your session, with an owner and a
  plan row, or `none`. **Two detached deploy worktrees are already sitting on disk from the planner's
  run - `P:/plan-review-worktrees/planner-g160-deploy` and `P:/smart-files-worktrees/planner-g160-deploy`
  - and they are G-160's, not yours. Do not reuse, delete or write in them.**

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-19_g169-deploy-path-windows_cp1.json
  CP2: _inbox/2026-09-19_g169-deploy-path-windows_cp2.json
  CLOSE: _inbox/2026-09-19_g169-deploy-path-windows_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "g169-deploy-path-windows",
    "planRows": ["G-169"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
