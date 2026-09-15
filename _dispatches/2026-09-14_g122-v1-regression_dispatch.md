CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: G-122 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-os

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g122-v1-regression --seat <your-seat-id> --plan-row G-122 --dispatch _dispatches/2026-09-14_g122-v1-regression_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g122-v1-regression --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-17 govtech stack (Dashboards, Smart Files, Plan Review, ICC demo)

You are working a lane of OPS-17. The rulings below were standing decisions in the shared
preamble until 2026-09-11; they are program law and moved here so lanes in other programs stop
carrying them. Each still binds every OPS-17 lane. If this section conflicts with the general
canon preamble, this section is narrower and wins on scope; if it conflicts with the AGENT
CONTRACT or ENFORCEMENT, those win.

- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.


# MISSION — G-122 INCIDENT: live Bastrop v1 regression

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## This is a live customer incident

The City of Bastrop reported a problem with their production dashboard on the morning of
2026-09-14. Staff work in this system daily. It is a real customer, not a demo.

**This dispatch was compiled that morning and never executed.** As of recompile: no commits on
`smartcity-os` since 2026-09-14, no close artifact anywhere on disk, and the service still serves
`smartcity-api-00138-law` tag `g117-full-layers-v2` — the same revision identified as the problem
shape. Nothing has been done. **The city has been waiting all day.** Treat this as the oldest
open item in the program, not a fresh one.

**Diagnose before you fix.** Do not push a change until you can state the symptom, reproduce it,
and name the mechanism. A confident wrong fix on a customer's live system is worse than an hour
of reading.

## Authorisation, stated explicitly

`smartcity-os` is under ABSOLUTE NO-TOUCH in `_catalog/repo_intents.md`. The operator authorised
engagement **for this incident specifically** on 2026-09-14. That authorisation covers
diagnosing and repairing this regression. It does NOT reopen the repo for feature work, and it
does not lift the no-touch. Anything you find that is not this incident gets reported, not fixed.

## Snapshot first

Repo: `/p/smartcity-os` (GitHub `empressaioemail-tech/smartcity-os`). Fetch and confirm you are
current before reading. As of 2026-09-14 local HEAD equalled `origin/main` at `332a16c`.
Declare repository, branch and commit SHA in your first output line. Work on your own branch in
your own worktree.

Live service, read 2026-09-14 from the traffic JSON **by field name**:

```
project    smartcity-os-prod
service    smartcity-api   (region us-central1)
url        https://smartcity-api-7dyaiy7wha-uc.a.run.app
serving    smartcity-api-00138-law @ 100%, tag g117-full-layers-v2
generation 139
```

## What changed, and why that matters

Fourteen PRs (#39 through #52) landed on this repo building a **platform-internal seam for
`smartcity-dashboards`** (the v2 product). v1 production is now serving a revision tagged for
v2's benefit. The operator's own words: the v2 import "broke the version one dashboard."

```
332a16c  Fix wastewater layer: accept polygon geometry, not just lines (#52)
c6cd8be  widen platform layers bridge to full 52-layer GIS parity (#51)
3022f72  platform-internal GIS overlay-layer route (#50)
2776b12  platform-internal address-to-parcel/zoning/flood/permits route (#49)
a00138b  NSpire maintenance records, 7-day alert log, patrol-vehicles route (#48)
d377fbd  platform-internal work-orders route returns clean columns (#47)
72021b7  DVIR, safety events, mileage/fuel flags on samsara route (#45)
29eada2  platform-internal reads for fleet, patrol, fire apparatus, CIP (#42)
1ff70d2  platform-internal reads for work-orders, inspections, licences (#41)
d2d3648  exempt /platform from the session-auth gate (#40)
68fe8cc  platform-internal read-only permits endpoint (G-116) (#39)
0e5c41e  manager-load uses work_order_managers roster, DEFAULT_TENANT_ID 1 to 2
```

## THE CONSTRAINT THAT DECIDES YOUR FIX

`smartcity-dashboards` (v2) reads **this service** server-to-server:

```
/api/platform/mygov/*                    -> v2's permit, work-order and licence data
/api/platform/property-intel/summary     -> v2's native property map, per-parcel
/api/platform/property-intel/layers      -> v2's 52 GIS overlay layers
```

**Reverting the seam repairs v1 by breaking v2.** That is not an acceptable fix. Whatever you
change must leave every one of those routes working, and you must prove it live after the fix,
not assume it.

## Hypotheses to TEST, ranked — not to assume

State which one you are testing, what result would falsify it, and then test it. The documented
recurring error in this operation is stopping at the first plausible explanation.

**1. `d2d3648` (#40) exempted `/platform` from the session-auth gate.** 2026-09-03, inside the
seam. A change to auth middleware in a live multi-tenant app is the single likeliest way to break
a whole dashboard. Read the actual middleware ordering and the exemption's match rule. Ask: can
the exemption match more than `/platform`? A prefix match, a missing anchor, or a reordered
`use()` would let unauthenticated requests through, or break session resolution for normal routes.

**2. `332a16c` (#52) wastewater layer geometry.** 2026-09-04, the most recent seam commit and the
narrowest. Accepting polygon geometry where only lines were accepted can break a renderer that
assumed lines.

**3. Anything else in #39–#52.** Twelve other commits landed in the seam. If neither of the above
explains the symptom, work the rest rather than forcing the evidence into these two.

**DEMOTED, and the planner got this wrong first time round.** `0e5c41e` (DEFAULT_TENANT_ID 1→2)
was originally ranked as a peer of the two above. It is dated **2026-04-05** — five months before
the seam and unrelated to it. It does not explain a regression the city noticed this week, and
treating it as a peer would waste your time. It is still worth knowing the value moved, because
G-131 records that `property-intel/summary` uses a bare numeric tenant literal that has already
been bumped once by an unrelated commit — but that is a structural finding for another row, not
this incident.

## What has been learned since this dispatch was written

G-126 closed today and read this repo's platform handlers read-only. Its findings are directly
relevant and you should not re-derive them:

**`PLATFORM_INTERNAL_API_KEY` binds to no tenant at all.** It is one shared bearer secret gating
all 12 platform routes uniformly.

**Tenant resolution splits three ways behind it.** Five routes do a robust name-based lookup;
`property-intel/summary` uses a bare numeric literal; five vendor routes have no tenant concept
whatsoever.

That is recorded as **G-131** and is NOT yours. Do not fix it here. But if your regression turns
out to live in that area, say so — the two rows would then be one.

## Method

**Get the symptom first.** Ask the operator what Bastrop actually reported if it is not already
in your dispatch: a blank page, a specific screen, missing data, a slow load, an error. A
diagnosis without a symptom is a guess. If you cannot get the symptom, say so and characterise
the system's health broadly instead of picking a hypothesis at random.

**Read the authoritative record, never a proxy.** The revision that served a request is on that
request's own log line, not in `latestReadyRevisionName`. The image a revision runs is its
digest, not the tag that was requested. Whether a table exists is in the catalog, not in the
shape of somebody else's query.

**Never read multi-field CLI output through a positional formatter.** `--format="value(a,b,c)"`
aligns by semicolons and a blank field shifts every column after it. Use JSON and read fields
by name.

**Check whether the symptom predates the deploy.** Compare the reported onset against when
`00138-law` began serving. A regression that predates the deploy has a different cause.

**Verify by violation.** Before reporting the fix as working, reproduce the symptom on the old
behaviour and confirm it does not reproduce on the new. A check observed only passing has not
been observed working.

**Every verification command must be exit-bounded** (`timeout 120 ...`). Never run a command
that waits for input or does not terminate.

## Deploy

Deploys are planner-owned here, which means YOU deploy and you fix your own failed deploys;
never escalate a deploy to the operator. Tag a canary, deploy with `--no-traffic`, smoke it,
then shift traffic, and verify the shift by reading the traffic JSON by field name.

Before shifting traffic, smoke ALL THREE v2-facing routes above plus the v1 symptom.

## Report, do not fix, anything that is not this incident

You will likely find more. The fourteen PRs cite three decision records that **do not exist** in
doc_repo (`2026-09-03_smartcity_os_platform_read_authorization.md`,
`2026-09-03_bastrop_tx_dashboards_pack_ratified.md`, and a 2026-09-04 Leaflet-island override),
and none of that work carries a plan row. That is a real governance gap and it is not yours to
close. Name what you find in your close.

## Close

Write your close to `_inbox/2026-09-14_g122_v1_regression_close.json`.

State: the symptom as reported, the mechanism you believe explains it, **a second mechanism that
would produce the same observation and why you rejected it**, what you changed, the deployed
revision and digest, the violation test in both directions, and live proof that all three
v2-facing platform routes still answer. If you could not determine the cause, say that plainly
rather than shipping a change that might be unrelated.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_g122-v1-regression_cp1.json
  CP2: _inbox/2026-09-14_g122-v1-regression_cp2.json
  CLOSE: _inbox/2026-09-14_g122-v1-regression_close.json
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
    "lane": "g122-v1-regression",
    "planRows": ["G-122"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
