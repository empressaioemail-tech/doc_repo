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

PLAN-ROW: D-14, D-13 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: smartcity-os
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane d14-d13-v1-reach --seat <your-seat-id> --plan-row D-14 --dispatch _dispatches/2026-09-18_d14-d13-v1-reach_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane d14-d13-v1-reach --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission: D-14 then D-13. Put v1 `main` on `walrus-app`, then point the dashboards at it

You launch no sub-agents (FAN-DEPTH 0). You work in two repos, in this order: `smartcity-os` (v1, for
D-14), then `smartcity-dashboards` (v2, for D-13). You deploy and fix your own failed deploys; you do not
escalate a deploy. You fix your own failed builds.

Read, in order: rows D-13 and D-14 in `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md`,
and its governing rules 3, 9, 10, 11 and 13; OPS-17 amendments A-146 and A-148; the G-159 close
`_inbox/2026-09-18_g159-finance-bridge_close.json`, especially `fleetMemory`. OPS-25 in this clone
carries a large uncommitted amendment from another seat (A-8: the full GCP exit, rules 15 to 20, rows
D-15 to D-32). Read it, because D-20 and D-21 are what follow you. It is not yours to edit, and it is not
your scope.

### Why these two, and why together

Bastrop's budget is live in v1 and readable (G-159 proved it: 12 budgets, the operator's capture
reproduced to the digit). v1 now has platform routes for it on `main` (`a400f7be`). Two things stand
between that and a Bastrop staff member seeing it. D-14: `walrus-app`, which serves `smartcityos.io`,
builds from side branch `d9-api-8bea7fa`, so nothing merged to v1 `main` reaches production. D-13: the
dashboards read every Bastrop feed from the GCP copy of v1, through a host hardcoded in five files. They
are one path, and the proof that matters runs across both, so one lane holds both.

### D-14, in `smartcity-os`

Follow the row's five steps.

1. Land the healthcheck fix on `main`. It is on the pin branch and not on `main`. Merge only on CI
   conclusion strings read per job, against the current base.
2. Before touching production, prove `main` builds, starts and serves on a NON-production DigitalOcean
   app. Payloads must be identical to `walrus-app` for the same requests, compared as payload, not
   framing (rule 11). Anything you create carries its own removal, or is declared in `leave_behind`.
3. Repoint `walrus-app` at `main`. Read `services[0].source_commit_hash` back from the deployment object
   and compare it to the `main` tip byte for byte (rule 13). A deploy once reported SUCCESS while running
   a commit from before the change, and on these apps a merge does not deploy anything at all.
4. From outside this fleet host (rule 10), `smartcityos.io` and `www` serve the same payloads as before
   the repoint.
5. Keep deploy-on-push disabled, and leave the GCP `smartcity-api` untouched (rule 3).

Before step 3, state the rollback: repoint to `d9-api-8bea7fa` and read the hash back.

Once `walrus-app` runs `main`, confirm G-159's routes are present from outside without a key. G-159's
recorded tell: a route that exists answers 401 JSON, and an unknown `/api/platform/*` path answers the
SPA shell with 200.

**Do not "tidy" `getBnpApiKey()`.** It reads `OPENGOV_API_KEY` first, and that is the only reason BNP
answers for Bastrop. The key named for BNP returns zero budgets. **Do not touch `server/routes/finance.ts`**
either: its clamp and its tenant default are G-162, which waits for you so that your repoint changes no
behaviour.

### D-13, in `smartcity-dashboards`

1. Replace the hardcoded GCP host in all five files named in the row (`src/vendor-live.mjs`,
   `src/mygov-live.mjs`, `src/mygov-permits.mjs`, `src/property-map.mjs`, `src/adapters.mjs`) with ONE
   configured base for the v1 platform routes, read from the environment. **No default.** An unset base
   makes each feed refuse, with its basis stated on the region. It never falls back to a host. The
   `sourceUrl` shown to users is provenance, so it must name the host actually read. `code-refs.mjs`
   reads zero for the GCP host.
2. Set the base on `d12-main-uat` to `walrus-app`. Confirm `walrus-app` accepts the
   `PLATFORM_INTERNAL_API_KEY` the dashboards send.
3. **Instrument, per the row:** every feed returns the same records through `walrus-app` as through GCP,
   compared as payload. Read them against the v1 platform routes directly with the platform-internal key,
   which needs no tenant key. Then the end-to-end leg: the dashboards read `bastrop_tx` through
   `d12-main-uat`. That needs the G-135 verification key. Check `_catalog/credential_access_index.json`.
   If it is not minted yet, that leg is UNMEASURED and you say so; nothing substitutes for it.
4. **Files you do not touch:** G-161 is running in this repo at the same time and owns `src/server.mjs`,
   `src/compose.mjs`, `src/staff-map.mjs`, the municode calendar files, `web/app.js` and
   `web/index.html`. You own the five files above. If you need a change in theirs, stop and say so in
   CP2. `d12-main-uat` is shared with G-161: read `source_commit_hash` immediately before each probe, and
   redeploy if it moved.

### The production step, and the hold on it

`dolphin-app` serves `app.smartcityos.io` and runs `3d3ec62`. That commit still renders the vendor's
free-text work-order title, where residents write names and phone numbers, which `main` no longer does
(A-148). Shipping `main` there is the operator's call.

- **If OPS-17 carries an amendment dated 2026-09-18 or later recording the operator's ruling that `main`
  ships to `dolphin-app`**, do it as ONE deploy. Add the configured base to `dolphin-app`'s spec, deploy
  `main` in the same act, read `source_commit_hash` back, and repeat the D-12 checks: the `web/` blobs,
  and the host discrimination from outside.
- **If there is no such amendment, stop at `d12-main-uat`.** Write the exact spec change for `dolphin-app`
  into your close, with secrets redacted. Say plainly that, once your D-13 change is on `main`, any
  `dolphin-app` deploy without the base fails closed on every feed.

Read the amendment at source. Do not take this mission's word, or a chat message, for it.

### Not yours

The `bastrop_tx` finance grant (G-159's leave-behind, dispatched after you land). GCP decommissioning (D-20).
Config and secrets as code (D-21), except that your close records the spec you applied, secrets
redacted, so D-21 starts from it. G-162.

### Close

CP1: the D-14 drift between `main` and the pin, measured before any change. CP2: D-14 done, with its hash
read back. Then the close, covering both rows.

The close records, for each feed, the payload comparison with its record counts. It records every
`source_commit_hash` read back verbatim, and the end-to-end leg with its verdict (MEASURED, or UNMEASURED
and why). It says which production branch ran.

Declare your `leave_behind`. "None" is valid and cheap; the declaration is required regardless.

State your snapshot in your first output: repository, branch, commit, for both repos.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_d14-d13-v1-reach_cp1.json
  CP2: _inbox/2026-09-18_d14-d13-v1-reach_cp2.json
  CLOSE: _inbox/2026-09-18_d14-d13-v1-reach_close.json
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
    "lane": "d14-d13-v1-reach",
    "planRows": ["D-14", "D-13"],
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
