CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
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
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# situsState bare null blocks every P-124 bake

## Mission - situsState is a bare null on 312,169 parcels and it blocks every P-124 bake

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. Everything you need is here. Do not go hunting through other threads.

### Your seat and worktree

You are the **property seat**. `legacy-design-tools` is yours (`P:/legacy-design-tools`,
worktree `P:/seat-worktrees/property/legacy-design-tools`).

Confirm you are in your own worktree on your own branch before any git write, and declare your
snapshot in your first output: repository, branch, commit. If `_catalog/seat_register.json`
needs a new entry, set **BOTH** `path` and `worktree`; an entry carrying only `worktree`
resolves to an empty repoPath and the seat gate refuses every git write with
`product_index_foreign`. `git pull` immediately before editing that file, add it by explicit
pathspec, never `git add -A`.

### The defect, in one paragraph

`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts` line 555 reads
`situsState: row?.situs_state ?? null`, where `row` is the TxGIO parcel join. Every other situs
field on that call comes from the CAD claim. `cad_property` has **no `situs_state` column at
all**, so there is no fallback and never was. When the join misses, or when the TxGIO row's own
`situs_state` is empty, the bake writes a bare null into a REQUIRED leaf. Null is not one of
value / absent-verified / not-applicable / refused, so `BP-CONTENT-01` fails the parcel, the
verify walk fails, and OPS-19 rule 6 refuses the production publish. Every county in P-124 is
stopped here.

Confirm all of that at source before changing anything. Do not take this document's word for
the line number or the column list.

### Scope, measured 2026-09-08 against f06-staging-neondb

    county        total      situsState null    of which a real street address exists
    Bastrop       77,799     31,866  (41.0%)    28,887
    Caldwell      48,649     23,891  (49.1%)     8,598
    Hays         173,050     44,803  (25.9%)    41,799
    McLennan     114,255      1,199  ( 1.0%)     1,199
    Travis       500,307    119,389  (23.9%)   117,854
    Williamson   602,050     91,021  (15.1%)    91,002
    TOTAL                   312,169             289,339

Two populations, separated by real overlap against `{envelope is null}`, which proved to be a
strict SUBSET (envelope-only is 0 in every county):

  (a) the join MISSED - no polygon and no situs_state. All of Travis and Williamson.
  (b) the join HIT and TxGIO's own situs_state is empty - an envelope exists, the state does
      not. Bastrop 16,324, Caldwell 231, zero in Travis and Williamson.

Bastrop is already live in production carrying 31,866 of these. It passed its 08-28 and 08-29
walks only because `BP-CONTENT-01` did not exist yet.

### What to do

**1. Recommended: derive `situsState` from `countyFips`.** The situs is the property's physical
location, which is inside the county by definition, and the FIPS prefix `48` IS the state. This
is not an inference from missing data - it is the same order of certainty as `countyName`, which
the bake already derives this way. It resolves both populations and also fixes the six parcels
currently served a non-`TX` state (Caldwell `ST` x3, `TE` x1, `TN` x1; McLennan `TN` x1 - six in
total across six counties, reported as six).

Mark the provenance **derived**, not sourced, so no later reader mistakes it for a CAD field.

**2. If you reject the derivation, the fallback is a declared absence PER CASE**, and the two
cases are not interchangeable: `absent-verified` for (b), because the TxGIO row was consulted and
carried nothing, and a named `refused` for (a), because nothing was consulted. Writing
`absent-verified` across both is the lie that passes every check - nothing looked in case (a).

You own this call. If you take route 2, say why in the PR; the integration seat's preference is
not binding on your repo.

**3. The 2026-09-05 join-miss ruling does NOT reach this case, and you will find it.**
`_decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md` is active and rules that a
genuine join-miss emits `absent-verified` rather than staying `unaccounted`. Read quickly it
looks like it settles case (a) for you. It does not.

That ruling is scoped to a `cad_property` join in hauska-engine's `ingest-existing.ts`, keyed
county+propId across every tax year. Its argument is that the query genuinely looked, so a miss
is a confirmed absence of the row - and CAD is the authority for the facts CAD carries.

`situsState` fails that on both halves. Different join (TxGIO, not `cad_property`, which has no
`situs_state` column at all), and TxGIO is not the authority for what state a Texas parcel sits
in. A TxGIO miss establishes "this system holds no TxGIO polygon record for this parcel" - a
fact about our store, not about the world. A Caldwell County property is in TX whether or not
TxGIO has a row.

`absent-verified` is a claim that the FACT does not exist. Asserting it here says a Lockhart
parcel has no situs state, which is false. Note that the 09-05 ruling's own reversal criterion
anticipates a neighbouring population and asks for a population-scoped guard rather than a
blanket reversal; its author declined to extend it uncritically.

This is also the real argument for route 1. The value is not unknown - it is resolvable exactly
from a field already on the record. `absent-verified` and `refused` both assert we cannot know
something we can, which makes them the LESS honest answers here, not the more cautious ones.

If you disagree, that is a legitimate disagreement between two seats. Report both readings to
the operator with the evidence for each. Do not settle it unilaterally and do not treat this
paragraph as a ruling; the integration seat does not adjudicate your repo.

### What you must NOT do

Do not remove `baseFacts.situsState` from `REQUIRED_TIER1_FACET_PATHS`.

Do not admit `null` as a fifth cell state anywhere.

Do not touch the anti-zombie envelope strip in `brokerageNodeFacets.ts`. `facets.envelope` is
permanently null on the serve BY DESIGN and the factory-side walk was corrected on 2026-09-08 to
expect exactly that. Making envelope non-null on the serve now FAILS the walk as a zombie.

Do not deploy cortex-api or any other production service. Build and merge only; the deploy is
the operator's.

Do not re-bake any county. That is the factory lane's, sequenced after your change lands.

### Verify by violating

Before reporting the fix as working, run the bake over a parcel in population (a) and one in
population (b) and confirm the leaf is no longer null in either. Then confirm the check can still
fail: feed a payload whose situsState is null and confirm `BP-CONTENT-01` still refuses it. A
check observed only passing has not been observed working.

Good probe parcels: `48055:19512` is population (b) with a full Lockhart address. Any Travis
parcel with a null envelope is population (a).

### Report

CP1 after you have read line 555 and confirmed the mechanism at source, stating which route you
are taking and why.

Close with: the diff, the two probe parcels before and after, the violation result, whether
Bastrop's live production rows need a re-bake in your judgement, and a `leave_behind` block.

If you cannot make the leaf non-null for BOTH populations, say so plainly and do not close
green. A partial fix that clears the sweep sample while leaving the population intact is worse
than no fix, because the next walk will pass and nobody will look again.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-08_ctx-situs_cp1.json
  CP2: _inbox/2026-09-08_ctx-situs_cp2.json
  CLOSE: _inbox/2026-09-08_ctx-situs_close.json
