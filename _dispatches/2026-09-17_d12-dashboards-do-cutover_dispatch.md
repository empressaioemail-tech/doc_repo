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

PLAN-ROW: D-12 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: smartcity-dashboards
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane d12-dashboards-do-cutover --seat <your-seat-id> --plan-row D-12 --dispatch _dispatches/2026-09-17_d12-dashboards-do-cutover_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane d12-dashboards-do-cutover --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — D-12: put customer traffic on the dashboards DigitalOcean app, and make `main` the thing it builds

You launch no sub-agents (FAN-DEPTH 0). You do not touch DNS. You do not decommission anything. You
fix your own failed deploys rather than escalating them.

This row is the CRITICAL PATH for the entire SmartCity design build program. The operator ruled
2026-09-17 that all SmartCity surfaces move to DigitalOcean before any design build work begins, so
OPS-17 G-149 and every design build row behind it waits on you.

Read `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md` in full before anything else,
including all twelve governing rules. Rules 3, 7, 9, 10, 11 and 12 all bind this row directly.

### The state, measured at the planner seat 2026-09-17T21:2xZ, not remembered

Every line below was read from a live instrument. Re-read anything you intend to rely on; these are
readings with a timestamp, not current state.

| Thing | Reading | How it was read |
|---|---|---|
| `smartcityos.io`, `www` | `Server: cloudflare` + `CF-RAY` | `curl -D -`, edge header per rule 10 |
| dashboards public URL | `server: Google Frontend`, still GCP | same |
| GCP dashboards service | project **`smartcity-dashboards`**, us-east1 | `gcloud run services list` |
| GCP serving revision | `smartcity-dashboards-00074-sil` @ 100%, `latestRevision=false`, tag `g129-flood` | traffic spec read BY FIELD NAME |
| GCP deployer | `empressaioemail@gmail.com`, client `gcloud` | service annotations |
| `smartcity-dashboards` main | `f776b4bf` (G-134 WorkOS) | `gh api` |
| DO app build source | branch `d9-pin-96efa35` at `178e968b` | D-9 close + `gh api branches` |
| pin vs main | **diverged: ahead 1, behind 1** | `gh api compare` |
| Cloud Build triggers | **zero** in `smartcity-os-prod`, `hauska-prod-497015`, `legacy-design-tools-prod` | `gcloud builds triggers list` |
| GitHub workflows | one, `ci.yml`, jobs `test` and `a11y`, **zero deploy references** | full file grep |

**The GCP original is NOT in `smartcity-os-prod`.** It is in its own project, `smartcity-dashboards`.
Two of the three 2026-09-17 handoff documents get this wrong by omission. Every `gcloud` call you
make against it needs `--project=smartcity-dashboards --region=us-east1`.

**The backend consumer already cut over and the human path did not.** D-11 flipped
`hauska-mcp-server`'s `DASHBOARDS_BACKEND_URL` to the DigitalOcean address, so `dolphin-app` already
serves MCP tool traffic today. You are moving the browser traffic, not the first traffic.

### The thing that will bite you, and it is not the cutover

`dolphin-app` builds from `d9-pin-96efa35`, which is `96efa35` (main's parent) plus `178e968b` (a
`.gitattributes` fix preserving CRLF web assets). Main is `f776b4bf`, which is `96efa35` plus the
G-134 WorkOS commit. **Neither branch contains the other's commit.**

So a cutover alone produces this: a design build row merges to `main`, CI goes green, the app is
live, and the change is absent. A merged PR, a green suite and a running app all agreeing, with the
work missing. That failure has no symptom and nothing downstream would catch it.

**Reconciling the divergence is inside this row and is not optional.** Do it before the cutover, not
after.

### The work, in order

**1. Land the CRLF fix on `main`.** `178e968b`'s `.gitattributes` change exists only on the pin
branch. Get it onto `main` by whatever path is cleanest (cherry-pick and PR, or a fresh equivalent
commit), and confirm the built static assets are byte-identical to what D-9 validated. D-9 found
17 of 17 paths byte-identical to GCP; that property must survive.

**2. Prove `main` builds clean on DigitalOcean.** `main` carries the G-134 WorkOS commit, which
`dolphin-app` has never built. Build it on a non-production target first. If it fails, that is the
finding and you report it rather than reverting to the pin and calling the row done.

**3. Repoint `dolphin-app` at `main`.** After this the app tracks `main`, not a frozen side branch.

**4. Ruling on deploy-on-push: keep it DISABLED unless you find a reason to change it, and state
your decision either way.** Shipping stays a deliberate act. If you enable it, every future merge
becomes a production deploy and that is a much larger change than it looks.

**5. Supply the DNS records for `app.smartcityos.io` to the operator. Do not execute them.** The
hostname is ruled (operator, 2026-09-17). `smartcityos.io` and `www` stay on `walrus-app`. Governing
rule 12: DNS and domain management are outside this program's DigitalOcean token by design, confirmed
twice. Do not request a token widening. Hand the operator exact record values and wait.

**6. Cut over, and keep the GCP original running unmodified.** Rule 3. The GCP service is the
rollback path through the bake. Do not delete it, do not modify it, do not scale it to zero.

### Gates

**GATE A — verify from a vantage point that cannot lie.** Rule 10, earned on D-9. This fleet host
runs TLS-interception middleware that re-signs every certificate, so a local handshake check CANNOT
distinguish DigitalOcean's certificate from Google's and will return a confident wrong answer. Direct
checks against `*.ondigitalocean.app` from this host have also failed with connection resets that do
not occur elsewhere. Distinguish origins by an unfakeable edge header (`Server: cloudflare` + `CF-RAY`
versus `server: Google Frontend`), from outside this network. D-9 used Cloud Build.

**GATE B — prove a `main` commit actually reaches the running app.** This is the whole point of step
3 and it needs a meaning-shaped check, not a presence-shaped one. Find a byte-level marker present in
`f776b4bf` and absent in `96efa35` (the WorkOS commit changes the sign-in path), then confirm that
marker is served by the running DO app. Two independently derived inputs: what the commit contains,
and what the live app serves. **A successful deploy message is not evidence.** If you cannot
construct such a marker, say so rather than substituting a weaker check.

**GATE C — classify payload and framing separately.** Rule 11, earned on D-9. Cloud Run sets
`Content-Length`; DigitalOcean App Platform streams chunked. The same bytes over different transport
framing will read as a divergence to a naive comparison, and a clean migration will look failed.

**GATE D — check egress before trusting outbound calls.** Rule 7, earned on D-5. `smartcity-dashboards`
calls `hauska-retrieval-api` and `hauska-mcp-server` (`HAUSKA_RETRIEVAL_URL`, `HAUSKA_MCP_URL`),
which stay on their current GCP addresses for this row. A third-party WAF blocked some DigitalOcean
IPs and not others, per-IP rather than per-provider. If any outbound call fails, test from a second
host in the same account and region as a control before concluding anything about the provider.

### Traps that have already caught someone on this program

**The GCP original's traffic is pinned by revision name.** If you roll back, a plain `gcloud run
deploy` comes up `Ready=True`/`Active=False` while `gcloud` reports the OLD revision as serving 100
percent. Its own success message is true of the old revision and conceals the no-op. Use the canary
path (`--no-traffic --tag`, verify on the tag URL, then `update-traffic`) and read the traffic spec
by field name. Rule 9, earned on D-11. `plan-review` carries the identical pin; do not touch it.

**Do not trust DigitalOcean's certificate API field.** On D-9 it reported the apex certificate's
issuance as permanently failed (`certificate_expires_at = 1970-01-01`) while a valid chain-verified
certificate was being served through a different path and its ACME agent was retrying every 5 to 11
minutes. A status field that has stopped changing is not evidence a process stopped. Count events in
a log before declaring anything dead.

**Never read multi-field `gcloud` output through a positional formatter.** `--format="value(a,b,c)"`
aligns by semicolons and a blank field shifts every column after it. This exact misread reported the
wrong serving revision to the operator twice. Use `--format=json` and read fields by name.

### Out of scope, explicitly

Decommissioning anything. The scraper concurrency lock and its missing TLS (OPS-25 open items 2 and
3). The apex certificate renewal path (item 4). `smartcity-os` main drift (item 5). `P-154` (item 6).
`plan-review`, which the operator ruled stays on GCP for now. Any design build work, which is G-149
and G-150 and belongs to other rows.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.

Your close records: the verbatim edge headers proving the origin, from outside this host; the
byte-level marker used for GATE B and where it was observed; the exact DNS record values handed to
the operator and the time they were handed over; the deploy-on-push decision and its reason; and the
bake window observed with the GCP original's request count through it. A count is not a record.

State your snapshot in your first output: repository, branch, commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_d12-dashboards-do-cutover_cp1.json
  CP2: _inbox/2026-09-17_d12-dashboards-do-cutover_cp2.json
  CLOSE: _inbox/2026-09-17_d12-dashboards-do-cutover_close.json
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
    "lane": "d12-dashboards-do-cutover",
    "planRows": ["D-12"],
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
