---
id: 2026-08-17_g18_lane_b_planner_pickup
title: Planner pickup — Lane B G-18 SmartCity inventory (read-only)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related: [90_operations/OPS-17_govtech_stack_plan_of_record, _smartcity_masters/31_smartcity_dashboards, _smartcity_masters/32_smartcity_asset_management, _smartcity_masters/33a_smartcity_plan_review, _smartcity_masters/34_smartcity_smart_files_and_foundation, 30_smartcity_os, _decisions/2026-08-15_capability_mount_composition, 2026-08-16_ops17_four_lane_alignment, 2026-08-16_icc_demo_planner_pickup]
---

# Planner pickup: Lane B starts at G-18, read-only

Paste the prompt at the bottom into a fresh planning agent. This file is the durable copy. Do not re-derive the done line from G-60 or from doc 30's product table.

## Gate

You are the Lane B planning agent. Plan row **G-18**. Next card after a graded inventory is **G-21** (same probes, honesty including UI-only). You are not starting a rebuild. You are not touching live Bastrop production. You write a WDLL, get operator approval, then produce a keep / mount / kill inventory graded by live probe.

L26 holds the atoms bulk-writer slot. No second `--apply`. No ICC store UPDATE. No G-58b DROP.

G-60 is **CLOSED_ON_DEMO_PATH STOP**. Do not resume ICC-demo, plan-review elevate, or MCP catalog work unless the operator names a residual and L26 is quiet.

## Hard no-touch

- `P:\smartcity-os` is **absolute no-touch on live Bastrop**. Read-only inventory means: inspect source, probe the **deployed** city URL, query public health/sync if it exists. No commits, no deploys, no schema, no seed, no tenant_id=2 writes, no "small fix while you are in there."
- Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening`: never clean/stash.
- Dirty `P:\hauska-map` linked to Vercel **property-explorer**: never deploy CC or plan-review from it.
- Doc_repo commits are planner-owned and a **named list**, never the whole dirty tree.
- One Hauska MCP server. Do not stand up a second. Do not delete reporting `cortex_*` tools.
- Do not start **G-52** (MyGov permit to engagement).
- Do not fake **G-11** (auth/tenancy). QA personas are not G-11.
- Do not duplicate Lane A (Smart Files) or Lane C (plan-review). Those modules exist. City mounts them.
- Do not ingest city-owned assets (G-24). Confirm still zero; do not fill the zero.
- Do not visually redesign the live city. Do not SCADA. Do not private infra. Do not payments. Do not sell CitizenConnect as a product.

## Standing decisions

- Cotality EXTINGUISHED. Re-route, never rotate.
- Deploys planner-owned. This wave should have **zero deploys**.
- No privileged data. Uniform public-record only.
- CTX / national HELD.
- Code-done != customer-done. A grade is a live probe, never a merged PR or a comment in doc 30.

## Product shape that is now correct (do not unlearn)

- **Plan review cites.** Host: `https://plan-review-app-ten.vercel.app`. Files UI + applicant token room live here. Map is live SmartSite (`smartsite.cloud/?parcelNodeId=`).
- **Smart Files stores files.** Backend: `https://smart-files-padrd77ava-ue.a.run.app`. QA UI: `https://smart-files-app.vercel.app`. Not the review room, not ICC-demo.
- **ICC-demo is the licensed-IP access door.** `https://icc-demo.vercel.app`. Plan review is not that door. Command Center is not that door. SmartCity is not that door.
- Equation: complete plan review + finished MCP = ICC offer. Citing surfaces generate activity. ICC-demo watches it.
- Capabilities **mount**. They do not merge into one database (`_decisions/2026-08-15_capability_mount_composition.md`).
- `_inbox/2026-08-16_ops17_four_lane_alignment.md` line that puts ICC activity on plan-review `/icc/activity` is **stale**. A-032 reversed. Trust `_decisions/2026-08-16_icc_demo_is_separate_portal.md`.

## Why this card exists

OPS-17 Lane B is last. It consumes A (Smart Files), C (plan review), SmartSite. Primary repo `smartcity-os` stays no-touch on live Bastrop.

G-18 instrument: *Written inventory of the live codebase against the four category masters.*

G-21 instrument: *Per-module live probe; honest inventory including UI-only surfaces.* Catalog currently oversells (payments, citizen portal UI-only).

Doc 30 is the **suspect list**, not the answer. It still sells five products and a vendor table. Masters that win: `_smartcity_masters/` 31 Dashboards, 32 Asset Management, 33a Plan Review, 34 Smart Files/foundation, 35 positioning. Smart site is the unit. Never say twin/atom/substrate to a city. No cycle-time/savings figures. Plan review sells money and capacity.

G-13 consumer contract OPEN. G-11 auth/tenancy is the shared longest pole. G-51 (plan review with zero SmartCity session) is now true enough that B is unblocked on C, still blocked on honesty + auth. Housing later: a **new composition surface** (plan-review pattern), not a rewrite of live Bastrop. Keep the Leaflet island running until a named G-45 cutover.

## What the inventory is looking for

Not a feature tour. A keep / mount / kill map of live Bastrop, graded against the four masters, with a live probe on every named thing.

For every named screen or feed, four questions:

1. Which master is this? Dashboards lens, Asset Management record, Plan Review function, Smart Files room, or none (Compass, payments, 3D, CRM).
2. What does a request actually hit? Spine atoms, a vendor API/scrape, a mock, or HTML with no backend.
3. Does it become a city record? Source + timestamp + accessPolicy on a node, or a live feed that vanishes when the vendor is down.
4. Can it come off the monolith? Own host we can mount, or welded into `smartcity-os` so cutting it breaks Bastrop.

If (2) is not a live probe, the row is not graded.

### Surfaces doc 30 still names as products

| Named as | Check |
|---|---|
| Operations Dashboard | Real lens on one record, or wallpaper of vendor widgets? |
| Parcel Intelligence | SmartSite/spine, or a second parcel stack inside SmartCity? |
| AI Plan Review / Codex 1b | Dead stub, or a duplicate of plan-review-app? G-51 says review must run with zero SmartCity session. |
| CitizenConnect | Citizen lens, or a separate product? Payments already known UI-only. |
| Digital Twinning / 3D | Early theater vs Asset Management view-tier (deliberately last). |
| Compass | Sidebar over readable records, or a chatbot on silos? |

### Vendor feeds doc 31 says already flow at Bastrop

MyGov (permits/work orders), Samsara, Spireon, Verkada, FirstDue, OpenGov, ArcGIS, Power BI, GoTo Connect (already marked degraded), Google calendar, Anthropic.

For each: last successful sync, `sync_health` or not, scrape vs API, and whether a row lands as a city asset/permit **record** or only paints the dashboard. Aggregation-only is refused as an offer.

### The three modules Bastrop must not reimplement

| Module | Looking for |
|---|---|
| Plan review | Any in-app review UI, Cotality, or cortex BFF still in the city bundle |
| Smart Files | Any local upload/blob table. City rooms must be a mount, not a second store |
| Map | Leaflet island vs `smartsite.cloud`. G-45 is adoption, not a second map |

### Honest zeros (confirm, do not fill)

City-owned assets in the graph: **zero** (G-24, live 2026-08-10 per doc 32). Bastrop's 74,729 parcels / 17,552 road nodes / 26,454 boundary edges are the **public-record base**, never assets under management.

## Finished inventory row shape

One line per surface/feed:

`name | master | live path (URL + probe) | spine / vendor / mock / UI-only | writes a record? | keep / mount / kill | notes`

Plus a short **do not touch** list: anything `tenant_id = 2` that is actually serving Bastrop staff today.

## Lessons that transfer from G-60 / A / C

- Citing product is not the access door.
- Extract then remount. Do not glue a new product onto an existing host.
- Own housing when leaving a silo (plan-review, smart-files, icc-portal). SmartCity composition later follows that pattern; live Bastrop is not that housing.
- Map is live SmartSite.
- Command Center is the operator console, not the city product.
- QA personas are not G-11.
- Code-done != customer-done.
- Do not seed stores.
- WDLL before build.
- Taking a persona off a dropdown hid live rooms. Restore personas; never silent-DELETE store objects.
- `npx vercel --prod` from a repo root can create a rogue Vercel project. This wave should not vercel anything.

## Execution order this session

1. Read `_STATE.md`, this pickup, `90_runbooks/AGENT_CONTRACT.md`, `90_runbooks/DEV_PROCESS.md`, `90_runbooks/wdll_practice.md`, OPS-17 rows G-18 / G-21 / G-11 / G-13 / G-24 / G-45 / G-51 / G-52, the four masters + 35, `30_smartcity_os.md` integrations table, `_decisions/2026-08-15_capability_mount_composition.md`.
2. Write `_inbox/2026-08-17_g18_smartcity_inventory_WDLL.md`. Draft. Operator must approve before any inventory work that opens `P:\smartcity-os` even read-only at scale. Acceptance items are probes, not tasks. No time estimates.
3. On operator go: read-only inventory. Scratch `_scratch/lane_b_g18.md` as you go (LESSON / DEAD-END / GROUND-TRUTH with timestamp / OPEN). Do not self-promote to MEMORY.md.
4. File the inventory at `_inbox/2026-08-17_g18_smartcity_inventory.md`. Every row a live probe or explicitly UNGRADED.
5. Stop. Present keep / mount / kill. Do not start mounts. First mounts after this card (later, named WDLL): SmartSite map, Smart Files city tenant rooms, plan review as a **function**. Not this session unless the operator expands scope after the inventory.

Compiled dispatch if handed off: `node scripts/dispatch.mjs --plan OPS-17 --lane B --plan-row G-18`

## Answers so you do not ask

- Lane B is last. You are not behind. A and C ran so you have modules to mount.
- You do not need L26 to finish. Stay off the writer.
- G-52 is not this card.
- G-11 is not this card. Inventory may *observe* session/tenant middleware. It may not "fix" it.
- Housing of a future SmartCity composition surface is not decided this card. Pattern is plan-review: own repo, own Neon, own Cloud Run, own Vercel. Live Bastrop stays up until a named cutover.
- Never say twin, atom, or substrate to a city. Internal inventory may use those words. Customer-facing copy may not.

---

# PASTE THIS INTO A FRESH PLANNING AGENT

You are the Lane B planning agent in P:\doc_repo. Plan row G-18. Read `_inbox/2026-08-17_g18_lane_b_planner_pickup.md` first, then `_STATE.md`, then the files that pickup names. Do not re-derive intent from G-60 or from `30_smartcity_os.md`.

Mission: freeze a WDLL, get my approval, then produce a read-only keep / mount / kill inventory of live Bastrop / smartcity-os against the four category masters (`_smartcity_masters/` 31, 32, 33a, 34). G-21 is the honesty pass on the same rows (spine vs vendor vs mock vs UI-only). Stop after the inventory. Do not rebuild. Do not mount. Do not deploy.

Hard law: P:\smartcity-os is absolute no-touch on live Bastrop (no commits, deploys, schema, seed, or tenant_id=2 writes). L26 holds the atoms writer; no second --apply. G-60 is STOP. Do not start G-52. Do not fake G-11. Do not duplicate Smart Files or plan-review. Do not fill G-24's zero city assets. Doc_repo commits are a named list.

Inventory questions per named screen/feed: (1) which master, (2) what a live request hits, (3) does it write a city record, (4) keep / mount / kill. Ungraded if no live probe. Doc 30 is the suspect list. Confirm city-owned assets still zero. Confirm Leaflet vs smartsite.cloud. Hunt duplicate plan-review and local file stores.

First move this session: write `_inbox/2026-08-17_g18_smartcity_inventory_WDLL.md` and show it to me for approval. Do not open a SmartCity rebuild until I approve the card.
