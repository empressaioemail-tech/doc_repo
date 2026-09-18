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

PLAN-ROW: G-160 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: plan-review, smart-files
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g160-served-commit-parity --seat <your-seat-id> --plan-row G-160 --dispatch _dispatches/2026-09-18_g160-served-commit-parity_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g160-served-commit-parity --seat <your-seat-id>

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


## Mission - G-160: a deploy is not done until the console and the API serve the same commit

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `plan-review` and `smart-files`. You read
`smartcity-dashboards` at a named ref and never write in it: a sibling lane (D-13/D-14) owns files in
that repo while you run. `doc_repo` is planner-owned: hand your doc edits back as a diff, uncommitted.

### The defect this row exists for, and the falsifier you must reproduce

On 2026-09-17 `plan-review` was served by two independent deploy paths with nothing comparing them:
the API by Cloud Run, the console by Vercel. The API advanced to the reasoner while the console sat
**fifteen days behind**, so a shipped feature was invisible to every user for **2h27m**, and every API
probe said the deploy was fine. The planner's own verification of G-150 checked only the Cloud Run
side and missed it. That is the recorded violation state, and it is your falsifier: **your check must
FAIL against it.** A check observed only passing has not been observed working.

The same split is likely in `smart-files`, which the dashboards embed through a Vercel origin, and
G-155 deployed Smart Files by Cloud Run canary without its close saying the console moved.

### What is true at source, read 2026-09-18

- `plan-review` `origin/main` `99c156b` and `smart-files` `origin/main` `6d71bf3`. Both carry
  `web/vercel.json`, which is the console side. Both have a Cloud Run service in `us-east1` as the API
  side (`plan-review`, `smart-files`; per each repo's README).
- **Neither product reports the commit it serves.** Both expose only `GET /` (and `/healthz`):
  `plan-review` `src/server.mjs:262`, `smart-files` `src/server.mjs:78`. Both READMEs record that GFE
  intercepts the exact path `/healthz` on `*.run.app`, so **a probe must use `GET /` or a path that is
  not exactly `/healthz`.** Do not build the check on a path the edge eats.
- The dashboards constant the row calls `DEFAULT_SMART_FILES_ORIGIN` is actually
  `DEFAULT_SMART_FILES_EMBED_ORIGIN` (`smartcity-dashboards` `src/mounts.mjs:8`, value
  `https://smart-files-app.vercel.app`). Small, but the row's name will not resolve if you grep for it.
- `smart-files` README names the console as `https://smart-files-app.vercel.app`, Vercel project
  `smart-files-app`, and explicitly not `property-explorer` and not `cmdcenter`. Embedding is
  `?embed=1&cityKey=...` (`src/mounts.test.mjs`).

### What to build

One check, one script, that for each product reads the commit each side ACTUALLY SERVES and FAILS when
they disagree. Three rules decide whether it is real:

1. **Read the authoritative record per side, never a proxy.** On Cloud Run the revision's image
   DIGEST, not the tag that was requested. On Vercel the deployment's git commit SHA, not the deploy
   message and not the domain. Where you must add a served-commit surface to a product so the check
   can read it, that surface is part of the deliverable and must report a value it actually resolved,
   never a defaulted or empty string.
2. **Fail closed.** An unreadable side, a timeout, or a missing field is a FAILURE, not a pass. A check
   that cannot run and silently passes is exactly the defect class this row was carded from.
3. **Answer the three-question gate the row states**, in writing, in your close: what executes it (a
   script run at the end of every deploy of either side); what triggers it (any Cloud Run or Vercel
   deploy of `plan-review` or `smart-files`, AND a schedule, because a deploy made without running it
   is its bypass); and what fails (a non-zero exit that blocks calling the deploy done). If any answer
   is "a human remembers", say so rather than shipping it.

### Acceptance, verbatim from the row

> The check FAILS when the console serves an older commit than the API, proven by violation against the
> recorded 2026-09-17 state, and passes when they agree; it runs for both `plan-review` and
> `smart-files`; its first scheduled run records whether Smart Files is split today

The last clause is a real measurement, not a formality. **Record whether Smart Files is split today**,
as an observable fact with a timestamp. If it is split, that is a finding about the product now
serving a customer, not a footnote.

### Boundaries

- Write only in `plan-review` and `smart-files`. Read `smartcity-dashboards` at `96fdafbb`; write
  nothing there. One PR per repo, branched from that repo's current `origin/main` with the SHA
  declared.
- You do not deploy, merge, or publish. The integration seat does that. Your check is proven by
  violation in a harness, and its first real run is recorded, not claimed.
- Declare your snapshot in the check's own output: repository, ref, and the moment it was read. An
  audit run against a stale tree returns confident wrong answers.

### Evidence your close must carry

- The check's path in each repo, and its output for a passing case and a failing case.
- The **planted violation** you used to prove it can fail, named, plus the recorded 2026-09-17 shape if
  you can reconstruct it.
- The three-question answers, and where the scheduled run lives (or a statement that it does not yet,
  which makes it dormant and must be said out loud).
- The Smart Files split measurement, with a timestamp.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.

---

## PARCEL 2 — ARM IT. Parcel 1 built the check and stopped; the planner verified it, and it is not done.

**Read this before touching either branch. Do not restart Parcel 1.**

Parcel 1 was performed, and its session stopped on the verdict that the work was already done. That
verdict is wrong, and the planner re-read both branches at source on 2026-09-18T19:35Z to establish
why. Everything below is measured, not reported.

### What Parcel 1 already built, verified by the planner. Do NOT redo any of it.

- `plan-review` branch `g160-served-commit-parity` @ `b4b44b9`, based on `origin/main` `99c156b`.
  7 files, 959 insertions. `node web/api/served-commit-parity.test.mjs` gives **31/31 pass**.
- `smart-files` branch `g160-served-commit-parity` @ `a238072`, based on `origin/main` `6d71bf3`.
  8 files, 1156 insertions. `node src/served-commit-parity.test.mjs` gives **36/36 pass**.
- Both suites carry the falsifier and it fires in both directions: *"the check FAILS against the
  recorded 2026-09-17 state"* and *"...and PASSES once the console catches up: the same check, both
  directions"*.
- `src/served-commit.mjs` refuses rather than substituting a stand-in, and its comment states why.
  That property is correct and is what makes this parcel possible. Keep it.
- The Smart Files split measurement exists as `scripts/fixtures/g160-measured-2026-09-18.json` and
  answers honestly: NOT split, and UNMEASURED by record.

**CONTINUE these branches.** Do not re-derive the check, do not re-cut the fixtures, do not restart
from `origin/main`.

### Why it is not done: three gaps, each measured

1. **Nothing triggers it.** No workflow in either repo references the parity check; it is a manual
   `npm run parity`. The row's own three-question gate required a trigger on every deploy of either
   side AND a schedule. Today the bypass the row itself names, "a deploy made without running it", is
   the only path that exists.
2. **No product records the commit it serves.** `SERVED_COMMIT` is read and never set by any deploy
   path. The planner ran the check live and it REFUSED (exit 2): *"revision plan-review-00029-gom
   records no commit"*. So the control is not merely untriggered, it is starved: correct logic, input
   never supplied.
3. **Not merged.** Neither commit is on `origin/main`. `smart-files` has no `.github/workflows` at
   all, so its parity test runs in no workflow; `plan-review`'s CI does collect the test, but its own
   workflow comment records that branch protection is absent, so a red result blocks nothing.

### What to build, in this order, because the order is the point

**Step 1. Make the deploy record its commit (`SERVED_COMMIT`).** Both products, both sides. The value
must be the commit the build actually came from, resolved at build time against the built tree, never
a tag, never a branch name, never a default, never an empty string. When it is absent the surface
keeps answering 503, which is correct behaviour and must stay.

**Step 2. Wire the trigger.** Both products. Name what executes it, what triggers it and what fails.
A schedule is required rather than optional, because a deploy that skips the check is the bypass this
row names.

**Step 3. Prove BOTH directions after the change.** With `SERVED_COMMIT` set and the two sides
agreeing, the check must PASS. Against the recorded 2026-09-17 state it must still FAIL. With
`SERVED_COMMIT` absent it must still REFUSE.

**The ordering constraint, and it is the one thing that can go wrong in this parcel: Steps 1 and 2
land in ONE change.** Arming a check that must refuse, before the deploy records a commit, fails every
deploy of both products. A control that blocks all deploys is not a stricter control. It is a control
that teaches the fleet to reach for the bypass flag, and ENFORCEMENT.md names an over-broad control as
a worse defect than a narrow one.

### What you cannot do, and must say rather than imply

You do not deploy, merge or publish; the integration seat does. So the first real green run cannot
happen inside your lane. Prove everything provable in a harness, name precisely which clause still
needs a deploy, and record the live refusal you observe rather than a claim that it would pass.

### Acceptance for Parcel 2

- Both branches carry a deploy path that sets `SERVED_COMMIT` from the real built commit, and the
  close says where a deploy gets that value.
- Both products have a trigger: named, with what executes it, what triggers it and what fails, and
  the schedule's home given as a path or a job name rather than described.
- One harness run per product showing all three outcomes observed and pasted: PASS with agreement,
  FAIL on the recorded state, REFUSE with `SERVED_COMMIT` absent.
- A live run recorded with its timestamp, refusal included, so the deployed state is a fact and not
  an assumption.
- The three-question gate answered in writing, with any "a human remembers" answer said out loud.

### Boundaries, unchanged from Parcel 1

Write only in `plan-review` and `smart-files`; read `smartcity-dashboards` at a named ref and write
nothing there. One PR per repo, branched from that repo's current `origin/main` with the SHA
declared. `doc_repo` is planner-owned: hand doc edits back uncommitted, and the planner commits them.
You launch no sub-agents (FAN-DEPTH 0).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_g160-served-commit-parity_cp1.json
  CP2: _inbox/2026-09-18_g160-served-commit-parity_cp2.json
  CLOSE: _inbox/2026-09-18_g160-served-commit-parity_close.json
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
    "lane": "g160-served-commit-parity",
    "planRows": ["G-160"],
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
