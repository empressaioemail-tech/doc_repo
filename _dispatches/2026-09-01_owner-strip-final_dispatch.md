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

PLAN-ROW: F-01 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-engine

# OWNER-STRIP-FINAL dispatch

# Mission — strip the owner fields. The scope question is answered; use the entity_id range.

## Nothing ever changed. The question changed.

Five mechanisms were proposed for an apparent erosion and all five were wrong, including
four of the planner's. `OWNER-ROWCOUNT` closed it by recovering the original instrument:

- **`n_roll` is unchanged** in every county. Bastrop 77,078, Caldwell 48,384, McLennan
  114,280 — identical to 2026-08-31. Deletion is dead by the count, not by the planner's
  invalid one-sided-delta argument.
- **The keys are unchanged**, including Hays 29, Travis 3, Williamson 7. There was no
  silent write path.
- The 2026-08-31 measurement scoped by **half-open `entity_id` FIPS ranges**. The 2026-09-01
  cards scoped by **`jurisdiction_tenant = tx_{fips}`**. Those are different questions and
  the second one misses atoms.

**72 atoms** (5 / 2 / 29 / 26 / 3 / 7 across Bastrop, Caldwell, Hays, McLennan, Travis,
Williamson) carry `ownerName` and have a `jurisdiction_tenant` that is a bare FIPS or
**another county entirely**. A real Hays row: `entity_id 48209c5dc9…` — FIPS-plus-hash, not
`48209:propId` — with tenant `48453`, owner present, no mailing key.

## Therefore: scope by `entity_id`, never by tenant

```sql
entity_id >= '48021:' AND entity_id < '48022:'   -- and the same for each of the six
```

The range is on the **FIPS prefix**, so it captures every key form under that county —
`48209:propId` and `48209c5dc9…` alike — regardless of what tenant the atom carries. That
is precisely why it finds the 72 that tenant-scoping loses.

**A tenant-scoped strip would leave 72 atoms serving owner names on `public-free` and
would report success.** That is the failure this card exists to avoid. The full recovered
SQL is in `_inbox/2026-09-01_owner-rowcount_table.json`.

## What to strip

`ownerName` **and** `ownerMailingAddress` out of `cad-parcel-roll` bodies in `hauska_mcp`.
Predicate for selection, per the prior seat:

```
body ? 'ownerName' OR body ? 'ownerMailingAddress'
```

Nothing else on the atom, ever.

**No data is lost.** `cad_property` stays the source of record and is untouched;
`owner-fact` stays the paid home and is untouched. This removes a duplicate from an atom
whose `public-free` policy was never right for it.

## Method

**Measure at apply time under the `entity_id` predicate**, per county, and report it. The
counts in this card are context. Roughly 238,887 `ownerName` and roughly 239,472
`ownerMailingAddress` is the shape to expect, but the measurement governs.

**Dry run first**, and compare its counts to your own apply-time measurement rather than to
this card.

**Run row first.** No mutation without one. Chunk it and resume from the ledger; a
quarter-million bodies is not one statement.

**A count is not a record.** Every chunk emits a durable record naming the predicate, the
range acted on, the row count and the timestamp, so the set is re-derivable.

## Falsifiers

**After: zero under all three forms, on all six counties, scoped by `entity_id`.**

```
body ? 'ownerName'
body->>'ownerName' IS NOT NULL
nullif(btrim(body->>'ownerName'), '') IS NOT NULL
```

and the same three for `ownerMailingAddress`. A before-count and an after-check that use
different predicates prove nothing.

**Explicitly re-check the 72.** After the run, query the atoms whose tenant is a bare FIPS
or a foreign county and confirm they are zero too. They are the ones a tenant-scoped strip
would have missed, so they are the ones that prove this one did not.

**Untouched, all three:** `owner-fact` count and bodies unchanged; `cad_property.owner_name`
unchanged; every other field on the roll atom unchanged.

**The one that matters most:** a body that carried no owner field before must be
**byte-identical** after. A strip that rewrites untouched rows is a different operation from
the one authorised.

## Then close the exposure

The forward fix `hauska-engine #371` (`e3e1485ee39535d1819d438221063dd6eb9b955e`) stops new
writes; this card removes the existing pool. **Neither alone closes it**, so name both.

Add the regression test specified twice and never yet built: an anonymous `get_atom` on a
`cad-parcel-roll` DID returns a body with **no owner keys**. Without it, the next writer
that adds an owner field to a `public-free` atom reproduces this silently.

## Do not

- Do not scope by `jurisdiction_tenant`. That is the defect this card is built around.
- Do not skip a county because its count is small. Hays 29, Travis 3 and Williamson 7 are
  real exposure and are in scope.
- Do not apply without a clean dry run.
- Do not touch `owner-fact`, `cad_property`, or any other field on the roll atom.
- Do not add an MCP field stripper; the ruling rejected it and the policy is the protection.
- Do not run into a Tuesday 05:00-06:00 UTC Neon maintenance window.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report apply-time counts per county, the set
actually stripped, all three after-forms per county, the explicit re-check of the 72
foreign-tenant atoms, this run id and `#371`'s merge SHA. Name what contradicted this card,
or say plainly that nothing did. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_owner-strip-final_cp1.json
  CP2: _inbox/2026-09-01_owner-strip-final_cp2.json
  CLOSE: _inbox/2026-09-01_owner-strip-final_close.json
