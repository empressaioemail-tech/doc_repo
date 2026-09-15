---
title: R-10 proposed OPS-17 rows — retroactive G-116 / G-117 registration and the G-52 correction
date: 2026-09-14
plan_row: R-10
plan: OPS-18
lane: r10-bookkeeping
status: proposed, NOT applied — planner pastes
kind: proposed-rows
repo: doc_repo
owner: nick
---

# Proposed OPS-17 rows

Ready to paste. Nothing in `90_operations/OPS-17_govtech_stack_plan_of_record.md` was edited by this
lane, per the dispatch.

## ID range: I did not take new IDs. I am filling an existing hole.

Re-checked at **2026-09-14 13:25:27 CDT**, against `main` at `94c5ad5f` (2026-09-14 13:04:36 -0500),
which is the same tip the dispatch was compiled against plus today's QA-session commit.

The G-row inventory on `main` reads: `... 113 114 115 120 121 122 123 124 125`. The maximum is
**G-125**, matching the dispatch's 12:55 reading. But the number that matters is not the maximum. The
sequence has a **four-ID hole at G-116, G-117, G-118, G-119**, verified by explicit per-ID row count
(`G-116: 0`, `G-117: 0`, `G-118: 0`, `G-119: 0`, `G-120: 1` ... `G-125: 1`, `G-126: 0`).

So I propose **G-116 and G-117**, not G-126 and G-127. Reasons, in order of weight:

1. Every artefact already cites those exact numbers. Fourteen `smartcity-os` PR bodies say "OPS-17
   G-116". Ten deployed Cloud Run revisions carry tags beginning `g116-` and `g117-`. Six source
   files in `smartcity-dashboards` carry `G-116`/`G-117` comments. Twenty-six OPS-17 amendments on
   the `seat/govtech` branch narrate G-116 and G-117 by those numbers. Assigning the work a new ID
   would leave every one of those citations pointing at an empty slot forever.
2. `main`'s own rows already cite them as if they exist. **G-124** reads "The read path already
   exists (G-117 `composePropertyIntelSummary`...)". **G-122** describes the fourteen-PR seam. Today's
   session started at G-120 rather than G-116 — whether it deliberately reserved the hole or simply
   knew those numbers were spoken for is not recoverable from the file, but either way the hole is
   already being treated as occupied.
3. Amendment **A-111** (on `seat/govtech`) literally reads "**G-116 ADDED (approved)**". The row was
   approved and then never typed into the table. Filling the slot completes an action that was
   started, rather than inventing a new one.

**G-118 and G-119 remain unallocated.** I found no artefact anywhere citing either. Whether they were
skipped deliberately or by drift is not recoverable from source. Leave them free or reuse them; this
lane makes no claim on them.

## Status wording

Both rows carry `SHIPPED, RECORDED RETROACTIVELY 2026-09-14`, never `CLOSED`, per the dispatch: a row
written after the fact was never graded by an instrument. The instrument column therefore states what
*would* grade the row, and the status states plainly that it never ran as a gate. Where a live check
*was* in fact performed (the ten deployments were each live-verified at the time, per the stranded
amendments, and I re-read the serving revision myself today), I say so and cite it, without upgrading
the verdict.

## The two rows

Paste after the `G-115` row, so the table reads in ID order.

```
| G-116 | 5 | Lane B: real `bastrop_tx` city pack on `smartcity-dashboards`, plus ten real vendor/MyGov domain feeds and real Hauska tenant auth, read live server-to-server through a narrow platform-internal seam added to `smartcity-os` under explicit operator authorization | B | Live on the traffic-serving revision, read by field from the traffic JSON: an authenticated `bastrop_tx` caller receives real records on each granted domain with `origin: "feed"`, and an anonymous caller receives 401 on every `bastrop_tx` route while `template-city` still returns fixtures. Never graded as a gate — this row is written after the work shipped | none (shipped) | SHIPPED, RECORDED RETROACTIVELY 2026-09-14. Built 2026-09-03 to 2026-09-04 across `smartcity-os` PRs #39-#48 and `smartcity-dashboards` PRs #41-#52, deployed through seven tagged revisions `g116-mygov-live` ... `g116-cip-enrich`. Authorized by `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md` and `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md` — both operator-owned, both written 2026-09-03, both STRANDED on the unmerged local branch `seat/govtech` until recovered 2026-09-14 by R-10. Narrated in detail by amendments A-111 through A-124, also stranded on that branch. The `smartcity-os` ABSOLUTE NO-TOUCH line in `_catalog/repo_intents.md` was crossed here, narrowly and deliberately; that file still does not record the exception. Eight of ten domains returned live data at close; fire-apparatus (FirstDue API scope not granted) and call-analytics (GoTo OAuth consent never completed) are honestly unavailable, not broken. Verkada has no credential anywhere |
| G-117 | 5 | Lane B: native Leaflet property map for the real `bastrop_tx` pack, replacing the SmartSite embed on that pack's map stage only, reading parcel/zoning/flood/permit data plus a 52-layer GIS overlay catalog through two further platform-internal routes on `smartcity-os` | B | Live on the traffic-serving revision: an authenticated `bastrop_tx` caller composing the city-manager lens receives `/property-map.html?cityKey=bastrop_tx` rather than a `smartsite.cloud` URL, `template-city` still receives the exact SmartSite embed, and `/api/property-map/summary` refuses every non-`bastrop_tx` key with a stated basis. Never graded as a gate — this row is written after the work shipped | none (shipped) | SHIPPED, RECORDED RETROACTIVELY 2026-09-14. Built 2026-09-04 across `smartcity-os` PRs #49-#52 and `smartcity-dashboards` PRs #53-#56, deployed through three tagged revisions `g117-property-map`, `g117-overlay-layers`, `g117-full-catalog`; `smartcity-dashboards-00062-ful` serves 100 percent as of 2026-09-14, read by field from the traffic JSON. This row overrides the founding "No Leaflet island" rule (G-61) for exactly one page, under `_decisions/2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md` — operator-owned, carrying the operator's own verbatim reasoning, STRANDED on `seat/govtech` until recovered 2026-09-14 by R-10. The override is explicitly temporary; its reversal trigger is SmartSite reaching a better launch position, not a date. `smartcity-os` PR #49 correctly HALTED the dashboards-side build on discovering the conflict rather than forcing through it, and the decision was taken before work resumed. Narrated by amendments A-125 and A-128 through A-134, also stranded |
```

## The G-52 correction

`G-52` on `main` (line 229) currently states its blocker as "a live MyGov feed/adapter grant on
`template-city` (NOT YET BUILT — G-63 closed the adapter contract 2026-08-17 but `grantedAdapters` is
still `[]`)" and its status as `STILL BLOCKED`.

Two separate things in that row are now false, and one is still true. Keeping them fused is what
produced the contradiction this lane exists to fix.

**False:** that no live permit feed exists. It exists, it is deployed, and it serves — `smartcity-os`
`GET /api/platform/mygov/permits`, consumed by `smartcity-dashboards` `src/mygov-permits.mjs`, 312
real Bastrop permit records at the time of the stranded close.

**False as stated:** that `grantedAdapters` is `[]`. On `origin/main` the `BASTROP_TX` pack carries
seven grants (`src/city-pack.mjs` lines 127-134: municode calendar, MyGov permits, Samsara, Spireon,
FirstDue, Power BI, GoTo).

**Still true, and it is the real blocker:** nothing initiates a plan-review engagement from a permit
record. The prior recon grepped `engagement`, `planReview`, `submittal`, `intake` and `plan-review`
across all non-test source and web assets on `origin/main`; `engagement` has **zero hits** in
`smartcity-dashboards`. The served surface still renders "Reviews, Submittals against this parcel, Not
connected" (`web/index.html:484`). The blocker was always two conditions fused into one sentence; one
has been satisfied and the other has not moved.

Note also that the feed landed on `bastrop_tx`, not on `template-city` as the row's text anticipated —
the demo pack cannot hold a real feed, because `assertCityPackShape` refuses any pack that both
generates fixtures and grants an adapter. So the row's own precondition was written against a pack
that was structurally incapable of satisfying it. Whether that was noticed at the time is not
recoverable from source.

Proposed replacement for line 229:

```
| G-52 | 5 | Lane B: consumer pass — SmartCity initiates an engagement from a MyGov permit record | B | Live: engagement created from SmartCity, review runs in the standalone `plan-review` product, no duplicated logic | The engagement-from-permit bridge itself (NOT YET BUILT). `engagement` has zero hits in `smartcity-dashboards` on `origin/main` `86487fa` — grepped `engagement`, `planReview`, `submittal`, `intake`, `plan-review` across all non-test source and web assets; `planReview` resolves only to an iframe embed URL carrying a `cityKey` and nothing else, and the served surface still reads "Reviews, Submittals against this parcel, Not connected" (`web/index.html:484`) | STILL BLOCKED — but the stated blocker CHANGED 2026-09-14 (R-10), because the old one was satisfied and nobody updated the row. The feed dependency is GONE: a live MyGov permit feed exists, is deployed and serves (G-116; `smartcity-os` `/api/platform/mygov/permits`, 312 real Bastrop permits). It landed on `bastrop_tx`, not on `template-city` as this row originally anticipated — a demo pack structurally cannot hold a real feed, since `assertCityPackShape` refuses any pack that both generates fixtures and grants an adapter, so this row's original precondition was never satisfiable as written. `_inbox/2026-08-17_dashboards_missing_pieces.md`'s "Do not start G-52" no longer stands on its original reason (no feed); it stands only on the bridge being unbuilt. Do not read this correction as authorization to start — it re-states the blocker truthfully, it does not clear it |
```

## What this lane deliberately did not propose

**No row for the `smartcity-os` seam itself.** The fourteen PRs on that repo are the source half of
G-116/G-117 and are narrated inside both rows. A separate row would double-count one body of work, and
`main` already carries `G-122` as the live incident row against that same seam.

**No amendment number.** OPS-17 amendments on `main` stop at **A-108**; the `seat/govtech` branch
carries **A-109 through A-134**. Issuing an A-135 here would strand twenty-six amendments permanently
behind a higher number and guarantee a collision when the branch is recovered. The amendment sequence
must be reconciled as one act by the planner, not extended from the middle by this lane. This is
detailed in the close.

**No edit to `_catalog/repo_intents.md`.** Its `smartcity-os` row still reads ABSOLUTE NO-TOUCH with no
mention of the narrow authorized exception, which is now two-ways wrong: an agent reading it would
believe the fourteen shipped PRs were unauthorized, and would also not know the exception's precise
boundary. Proposed text is in the close; the file is canon and edits to it are the planner's.
