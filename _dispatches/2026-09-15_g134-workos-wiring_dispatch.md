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

PLAN-ROW: G-134 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g134-workos-wiring --seat <your-seat-id> --plan-row G-134 --dispatch _dispatches/2026-09-15_g134-workos-wiring_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g134-workos-wiring --seat <your-seat-id>

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


# MISSION — G-134: wire WorkOS and put real Bastrop staff on v2

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## This is the critical path for the soft launch

`_inbox/2026-09-15_bastrop_cutover_WDLL.md` names exactly one hard blocker on getting Bastrop
staff onto v2: **real per-person identity.** This row is it. Everything else on the phase-1 path is
small or already shipped.

Today **every department signs in as one shared persona** labelled "Development services staff."
That is not a login, it is a shared account: no audit trail, no offboarding, and no way to answer
*"who looked at that citizen's record."* For a government customer's system carrying citizen
names, phone numbers and complaint addresses, that is the thing that cannot ship soft.

## What already exists — do not rebuild it

G-132 CLOSED-PARTIAL 2026-09-14, deliberately stopping where an operator ruling was needed.
**Read `P:/seat-worktrees/govtech/doc_repo/_inbox/2026-09-14_g132-staff-auth_close.json` first.**
Its work is uncommitted in that seat's worktree — **land it rather than redoing it.**

- The verifier is built, tested and **provider-agnostic by construction** — standard OIDC
  discovery plus JWKS, so a compliant provider works with **zero code change**, configuration only.
- `src/staff-directory.mjs` carries `upsertStaffAccount` / `disableStaffAccount`.
- `GET /api/people-and-access` is built and tested.
- **812/812 tests passing** across the repos it touched.

## The ruling you are implementing

`_decisions/2026-09-14_staff_identity_and_department_rbac.md`, ruling 1, **amended twice on the
day it was made** — read the record, both reversals matter.

> **SmartCity admin provisions every account and issues the credentials.** No city IT, no
> city-manager invites, no self-registration. A managed provider holds the credentials so we never
> store password hashes for a government customer; every user is created and every role assigned
> by us through its admin API.

**Provider: WorkOS.** Operator ruling 2026-09-14.

**The city does nothing.** That is the test. If any part of your work requires an action by anyone
at Bastrop — IT, the city manager, or a staff member beyond signing in with credentials we handed
them — it fails the ruling. SSO was the first ruling and was reversed on *"we should not be asking
cities to configure anything."*

## Scope — the four gaps that block a soft launch

G-132 named five build gaps. **Four are yours. One is not.**

**GAP 1 — the provisioning client.** A `staff-admin-client.mjs` that actually calls WorkOS to
create users, assign MFA and issue credentials, feeding the existing
`upsertStaffAccount`/`disableStaffAccount`. Self-registration **off**. MFA **on**.

**GAP 4 — `smart-files` carries the verifier and no route consumes it.** The pattern to mirror is
already written: `plan-review`'s `src/actors.mjs` `staffEngagementRefusal` plus `src/server.mjs`
`resolveStaffCaller`. Mirror it; do not invent a second shape.

**GAP 5 — no sign-in UI, and no People and access lens.** Staff cannot sign in without the first.
The second is Sylvia's access-review surface — **read-only for the city manager, administered by
us** — and its read API already exists. Build sign-in first; the lens may follow in the same row.

**GAP 3 — offboarding is TTL-bounded, not instant**, in `plan-review` and `smart-files`, because
they share no revocation store with `smartcity-dashboards`.

**Gap 3 needs a judgement, so make it explicitly and state it.** Offboarding was the deciding
argument for this whole ruling, so "TTL-bounded" is not automatically acceptable. **Report the
actual TTL.** If it is minutes, say so and argue it is adequate for a soft launch with a small
named cohort. If it is hours, say that plainly — a disabled staff member holding a working session
for hours is not what the operator was promised. Either way the close states the number and the
verdict, and does not round it off.

**NOT YOURS — GAP 2.** `hauska-mcp-server` does not accept the staff bearer. That repo is
OPS-19/OPS-23 territory. Report it; do not touch it.

## THE SEQUENCING THAT PROTECTS LIVE STAFF

G-132 deliberately did **not** cut the `QA_PERSONAS` / `x-persona` mechanism, and its reasoning is
correct: cutting it before a real provider account exists **would take live Bastrop staff access
to zero with no replacement credential in hand.**

So the order is not negotiable:

1. WorkOS wired and provisioning working.
2. **Real accounts provisioned and verified signing in** — at least one real Bastrop staff member.
3. **Only then** retire the shared persona.

If you reach step 3 and step 2 has not been confirmed by a real person, **stop.** Leaving the
persona in place for another day is free; removing it early is an outage for a customer.

## Requirements

**One identity, three products.** A staff member signs in once and is the same person in
`smartcity-dashboards`, `plan-review` and `smart-files`. Three integrations is the failure this
row exists to avoid.

**Carry the `role` claim.** G-127 reads it. The vocabulary is the nine lenses; **you are not
building enforcement** — make the claim exist and be readable.

**A provisioned staff member with no lens role sees the Overview shell only**, with a typed
refusal naming the missing role. Operator ruling 2026-09-14. Fails closed, and stays visible so a
half-provisioned account is noticed.

**Fail closed.** No identity, unknown issuer, expired or malformed token: refuse. **Never fall
back to the shared persona** and never fall back to tenant-only resolution.

**Typed refusals.** A refused request says it was refused and why. A silent empty response is
indistinguishable from "no records."

## The anonymous path is load-bearing — verify both directions

`template-city` is public-free and must keep serving anonymously. An anonymous caller gets
fixtures on `template-city` and 401 on every `bastrop_tx` route. **Both halves must still be true
afterwards**, and you verify both — not only that signed-in users get in.

## A known verification wall

Three lanes have failed to verify authenticated `bastrop_tx` behaviour for want of a product key.
**G-133 is a live recon into why.** If you hit the same 401, cite G-133 and verify what you can
rather than burning the row chasing a credential — but note that **this row is the one that most
needs real authenticated verification**, so if G-133 has closed, read it first.

## Method

**Verify by violation, both directions.** Disable an account at WorkOS, confirm access ends in all
three products, confirm a live account still works. A control observed only permitting has not
been observed working.

Pre-register the falsifier before each check.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

**Never print secret VALUES.** Env var names only. This row handles credentials and that rule is
not decorative here.

Every verification command exit-bounded (`timeout 120 ...`).

## If something is not covered by the ruling, stop and say so

The mechanism and the provider are ruled. Pricing tier, where identities are stored, and what a
staff member without a lens role may reach are not all settled. **Name it and stop** rather than
choosing. An identity model chosen by an agent and discovered later is worse than a day of delay.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the offboarding violation test in both directions across all three products; **the actual
token TTL as a number and your verdict on whether it is adequate**; whether a real Bastrop staff
member signed in and was confirmed by a person; whether the shared persona was retired and if not
why not; the anonymous `template-city` path verified both directions; and confirmation that
nothing in your work requires an action by anyone at Bastrop.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_g134-workos-wiring_cp1.json
  CP2: _inbox/2026-09-15_g134-workos-wiring_cp2.json
  CLOSE: _inbox/2026-09-15_g134-workos-wiring_close.json
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
    "lane": "g134-workos-wiring",
    "planRows": ["G-134"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
