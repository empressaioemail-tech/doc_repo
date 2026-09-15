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

PLAN-ROW: G-123 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

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


# MISSION — G-123 Development services lens: the four record tabs and the shared pattern

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Snapshot first

Repo: `smartcity-dashboards` (`empressaioemail-tech/smartcity-dashboards`). The local checkout at
`/p/smartcity-dashboards` was **43 commits behind origin/main** on 2026-09-14. Fetch and work
from current `origin/main`. Declare repository, branch and commit SHA in your first output line.
Work on your own branch in your own worktree.

Deployed today: `smartcity-dashboards-00062-ful` @100%, tag `g117-full-catalog`.

## What this row is

**This lens is the pattern.** Fourteen of fifteen v2 destinations inherit what you build here.
Getting Development services right is worth more than getting any single tab right, so where a
choice is between "correct for this tab" and "correct for every lens", take the second.

Approved design: `https://claude.ai/code/artifact/1ed0733e-e10c-4ec6-948e-66d2b24e562e`
Design source and reasoning: `_design/smartcity-dev-services/` (README first).
Read both before starting.

## SCOPE — five tabs, and two that are NOT yours

IN: **Pipeline, Inspections, Work orders, Code enforcement, Licences**, plus the shared lens
pattern below.

OUT, and do not start either:
- **Place** (G-124) is HELD by the operator, who is reworking the map approach.
- **Plan review** (separate scope, operator ruling 2026-09-14) — it appears in the tab strip as
  a named future tab and nothing more.
- **Flood study** (G-125) — same: named in the strip, not built.

A tab named in the strip but not built renders the honest not-built state with its basis. It
does not render a blank.

## The shared pattern — build this once, use it on every tab

**Three tiers, not two walls of numbers.** v1 stacks six lens tiles on top of five tab metrics,
so eleven numbers arrive before any content does.

1. **Attention row** — the six filtered entry points. Primary treatment. Each carries the lens
   and filter it opens and NAVIGATES there with that filter applied. **Acceptance is the click,
   not the number.** An unread source shows the existing "Not read" word value, never a zero.
2. **Tab strip** — each tab carries its own count inline. This is v1's own pattern at the pill
   level, promoted to the tab level, not an invention.
3. **Tab metric strip** — compact, secondary, no cards. Tab-specific figures live here.

**ONE table treatment for every operational list.** v1 uses a real table on Code enforcement and
stacked rich rows everywhere else. The table is the most scannable view in the whole v1 app and
the rich rows are walls of text. The table wins; every tab inherits it.

**ONE load component.** Inspector load, Manager load and Officer load are the same shape — work
distributed across people. Build one component and pass it a roster. Do not build three panels.

**View modes replace the stray button.** `List / Map / Performance` as a segmented control in
the panel header. v1's "Service Performance" becomes a view mode; it stops being a button that
exists on one tab for historical reasons.

**Pagination** at the foot of the table: previous, position, total.

## THE PII RULE — read this before you write a row renderer

v1's free-text description fields carry **citizen names and personal phone numbers**, verbatim
from the capture:

```
203 MOSSBERG LN - CONF. PAID, RECONNECT - DEBORAH MOORE, PH#737-762-6252
CONTACT LISA BOE - CONTACT#: 504-401-1765
LOW PRESSURE - CONTACT: REBECCA GARNER-LOZOYA - CONTACT#: 916-620-8091
```

Business licence applications carry citizen-authored free text including grievances and payment
histories. Code enforcement rows carry officer names and complaint addresses.

**The free-text description is not a list column on any tab.** Lists carry structured fields:
id, type, address, department or assignee, status, date. The description belongs on the record,
not in a scannable list.

Two things follow that you must not blur. This design decision reduces the exposure; **it is not
a control.** If you find a path that renders the description into a list, a search result, an
export, or any anonymous-reachable response, **report it — do not quietly fix it and move on.**
And none of this data may reach a public parcel rail or any unauthenticated surface, on any code
path, under any cityKey.

## Per-tab column specs, from the v1 capture

Statuses and type vocabularies are the vendor's own values. Do not remap them onto an invented
taxonomy — that is this product's standing stance and `property-map.mjs` states it explicitly.

**Pipeline** (v1 "All Projects", 12,683)
Columns: `Permit # · Type · Address · Applicant · Status · Submitted`
Filters: All / Active / Requested / Expired / Expiring / Pending docs / On hold
Metric strip: all, active, requested, expired, expiring, pending docs, on hold

**Inspections** (949)
Columns: `Inspection # · Type · Address · Inspector · Result · Scheduled`
Metric strip: due this week, overdue, completed this week, pass rate (30d), average days to
complete (30d)
Load: Inspector load. Filters: search, all types, sort.

**Work orders** (16,723)
Columns: `WO # · Type · Address · Department · Status · Opened`
Metric strip: active, requested, suspended, on hold, archived
Load: Manager load. View modes: List / Map / Performance. Pagination. Export.

**Code enforcement** (1,502)
Columns: `Case # · Type · Address · Status · Step · Officer · Reported`
Metric strip: total, active, scheduled, resolved, closed
Load: Officer load. Filters: all statuses, all types, all officers, reset.
Note `Step` is the workflow position and is load-bearing for staff — keep it.

**Licences** (72)
Columns: `Licence # · Subject · Type · Address · Issued · Expires · Status`
Metric strip: total licences, expiring soon, licence types
Types: General, Food service, Food vendor, Golf cart, Alcohol, Mobile home park, Recreational

## Constraints that are not negotiable

`shell.css` may declare no colour and no token. `web/sc-kit.css` is byte-identical across three
repos and must not be touched. The type ramp is pinned by selector with a 12px floor. No new CSS
class without a rule. If the design appears to need a colour that does not exist, STOP and report
— that is a product-line decision across three repos, not a Dashboards PR.

Every honest-empty state keeps its `.basis` line. Removing one to tidy a layout is a substantive
change, not a cosmetic one.

No invented freshness. Tests assert no "last sync", "last read" or "last updated" appears.

**Regression-check every tab against the EMPTY pack**, not only `bastrop_tx`. A design that only
looks right when populated is wrong for this product: every city after Bastrop starts empty.
Develop against `template-city`; do not develop against `fixture-city`.

Do not hardcode a city name into markup.

## A dependency you should know about

Every real record on this lens is a live read of `smartcity-api` (v1) through
`/api/platform/*`. The city reported a v1 regression on 2026-09-14, tracked as OPS-17 G-122 and
being worked separately. If your reads start failing, check G-122 before assuming you broke
something.

## Close

Open a PR, deploy a tagged canary with `--no-traffic`, smoke it, then shift traffic — verified by
reading the traffic JSON **by field name**, never a positional `value()` formatter.

Write your close to `_inbox/2026-09-14_g123_dev_services_close.json`. State the deployed revision
and digest, the four CSS gates' results, what you checked against the EMPTY pack specifically,
and — explicitly — every code path you found that could render a free-text description into a
list, a search result, an export or an anonymous response, whether or not you changed it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_g123-dev-services_cp1.json
  CP2: _inbox/2026-09-14_g123-dev-services_cp2.json
  CLOSE: _inbox/2026-09-14_g123-dev-services_close.json
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
    "lane": "g123-dev-services",
    "planRows": ["G-123"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
