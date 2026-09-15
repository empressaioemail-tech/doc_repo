---
title: QA reconciliation — items since the reports scope handoff
date: 2026-09-15
status: dispositioned 2026-09-15 — see the block below
type: reconciliation
source: _inbox/2026-09-15_qa_capture_log.md
covers: QA-04, QA-05, QA-06, QA-07
---

# QA reconciliation, items since the reports scope

## DISPOSITION, integration seat, 2026-09-15 evening

Carded. No separate lane for the incidentals.

| Item | Disposition |
|---|---|
| QA-04 ETJ | **P-241.** Acquisition row, toggle already built |
| QA-05 records | **P-242.** Operator ruling still owed on scope |
| QA-06 container geometry | Design scope, carrying G-128's reflow-not-restyle predicate |
| QA-07 settings position | Design scope, with the grouping question unresolved |
| QA-06 incidental: 7 vs 13 pages | **Folded into P-222**, not a new row |
| QA-06 incidental: 09-08 X-ray artifacts | **Folded into P-237**, not a new row |

**The check this reconciliation recorded as never run has now been run, and it changes QA-04.**
Austin publishes its ETJ as real geometry, anonymously, with no token: org `0L95CJ0VTaxqcmED`,
`BOUNDARIES_jurisdictions/FeatureServer/0`, wkid 2277, 388 polygons — 270 `AUSTIN 2 MILE ETJ`,
24 `AUSTIN 5 MILE ETJ`, 4 `AUSTIN ETJ AG DEVELOPMENT AGREEMENT`, plus 26 FULL-purpose and 64
LIMITED-purpose jurisdiction polygons. Same org that already serves Austin zoning.

Consequences. The per-city GIS path is live for the largest city in the footprint, so **the
§42.021 ruling is recommended DEFERRED rather than taken** and converts into an enumeration of
which footprint cities publish a layer. The same layer carries FULL and LIMITED purpose
boundaries, which is city limits, so **one acquisition closes two of the rails F19 records as
hardcoded `unresolved`**. And the four AG-development-agreement polygons show Austin's real ETJ
is carved by agreement rather than by the population formula, which is evidence against the
derivation and for the published layer.

**One claim in this document is now stale and the card says so.** This doc reads P-221 as
recording that X-ray "cannot be generated at all". That was true on the morning of 2026-09-15
and is not true now: the integration seat generated a dossier for `48021:34137` through the live
MCP path at approximately 21:45 that evening, after P-221 and P-234 deployed. That makes the
2026-09-08 artifacts **more** useful, not less, because the outage is now bounded at both ends.

**Still owed from the operator:** QA-05's scope (web only, connector, or both; disabled,
labelled, or both). Recommendation recorded in P-242, not assumed.


Covers the four captures logged after the reports scope went out. Excludes the terms and
conditions compilation, which was a separate request and is not QA.

Snapshot: doc_repo main `5bc169ad`. hauska-map read at `origin/main` `b360138`. Every claim below
came from reading the artifact that decides it, not from output.

Bottom line first: **two of these four are not what they look like.** QA-04 reads as a UI toggle
and is an acquisition problem with the toggle already built. QA-05 reads as a label change and
sits on top of a measured, still-open defect on the same surface. QA-06 and QA-07 are genuine
design items and belong in the design scope arriving separately, with one caveat on QA-06.

---

## QA-04. ETJ map layer

**Ask.** An ETJ toggle in the LAYERS panel that renders all ETJs in the area.

**The toggle already exists.** `hauska-map`, `packages/map-renderer/src/layer-registry.js`:

    {
      key: "etj",
      label: "Extraterritorial jurisdiction",
      group: "regulatory",
      fixture: false,
      live: false,
      fuelGated: true,
      pending: true,
      emptyBasis: "Declared pending and fuel-gated — no source wired in map-renderer.
                   Turning this on draws nothing anywhere.",
    }

**Why it is not in the panel you were looking at.** `apps/property-explorer/src/browse/consumer-layers.ts`,
`consumerKnownLayers()` admits a registry row only when `entry.live` is true, or when the key is
one of thirteen named exceptions. `etj` is `live: false` and is not among the thirteen. It is not
in `CONSUMER_EXCLUDED_LAYERS` either, so nothing is deliberately hiding it; it simply never
qualifies. Flipping `live` to true is a one-word change and it is the WRONG change, because the
`emptyBasis` string above says what would then happen: the checkbox draws nothing.

**There is already an honesty control waiting for exactly this.**
`packages/map-renderer/src/chrome/LayersControl.tsx` renders `layers-empty-tag-<key>` and a basis
line for source-less rows, and its comment states the rule: "a toggle that turns on nothing should
say so", with the checkbox deliberately left operable because "the point is disclosure, not
concealment." So if ETJ is promoted before a source lands, it will correctly render as an empty
layer with its reason, not as a broken one. That is a safe intermediate state if you want the row
visible now.

**The actual blocker is that ETJ geometry does not exist to draw.**

`90_operations/OPS-1_texas_source_registry.md` line 54, verbatim:

> ETJ — NO statewide layer; derive from city-limits + Local Gov Code §42.021, or per-city GIS.

`90_operations/OPS-23_surface_completion_program.md`: "It does not fix ETJ. Both Travis parcels
carry `etjStatus: unresolved`." The ETJ rail's stated trigger is "P-156 reaches a city with an ETJ
layer."

`90_operations/OPS-22_spine_architecture_map.md`: "ETJ is not a disposition. The enum is three
values and ETJ is not one. `etjStatus` is a separate rail. A parcel in an ETJ binds as
`unincorporated` while carrying ETJ on a rail."

And OPS-23 F19 records that on the report path city limits and ETJ are hardcoded: `report-model.ts`
lines 791 to 796 set both to `unresolved` for every parcel, and `pdf/feasibility.ts` lines 194 to
197 print the literal sentence "no city-limits or ETJ boundary source is wired for this county yet,
so annexation status is unverified" on every PDF in every county.

**The ruling this needs from you, and it is not obvious.** A-027 dated 2026-08-24 records P-76 as
"the ETJ adapter card honestly scoped: city-limits PIP, ETJ unresolved, **no fabricated buffer**."
The §42.021 derivation named in OPS-1 produces an ETJ boundary by extending city limits a statutory
distance keyed to population. Whether that derivation is a legitimate derived boundary or the
fabricated buffer P-76 refused is a judgement call that has not been made, and it decides whether
ETJ is cheap or expensive. Per-city GIS is the unambiguous path and it is per-city, so it scales
the way city limits scaled, not the way a statewide layer would.

**Not established.** Whether any Texas city in the current footprint publishes an ETJ layer today.
Nobody has checked; the ETJ rail trigger is written as a future event.

---

## QA-05. Mark record request as coming soon

**Ask.** Label record request "coming soon" rather than presenting it as live.

**The mechanism already exists and has a rule attached.** In `hauska-map` PE:

    src/lib/pricing.ts:173         comingSoon: "Coming soon"
    src/workbench/Workbench.tsx:402   `${tool.label} · coming soon`
    src/workbench/tools/ReportsTool.tsx:1086   "Coming soon"
    src/workbench/tools/reports-catalog.ts:376  { text: "Coming soon", color: MUTED }

`ReportsTool.tsx` line 1 carries the standing rule verbatim: **"Coming soon is not on the purchase
surface."** So whatever gets marked coming-soon must also come off the purchase path, not merely
gain a label. That is the part of this ask that is not cosmetic.

**What sits underneath it, measured today.** P-223 was opened 2026-09-15 as SEV-1 against the
purchased-records tools and then measured by the integration seat the same day. The measurement
refuted most of it and the severity dropped. What survives, quoted from the row:

> a bad `artifactId` produces a RAW UNHANDLED POSTGRES ERROR instead of the documented
> `refused`/`artifact_not_found` envelope, disclosing `records_request_artifacts` table and column
> names.

Exposure is bounded: `POST https://mcp.smartsite.cloud/mcp` without credentials returns 401, so
this is an authenticated-caller disclosure rather than a public one. The row also records that
**the tier gate remains UNTESTED in the failing direction**, because testing it needs a genuinely
sub-Studio account and the measurement could not supply one.

**Why that matters for this ask.** Marking record request coming-soon reduces who reaches the
surface but does not fix the error envelope and does not test the gate. If coming-soon means
disabled on the web app only while the MCP tools `request_records`, `list_purchased_records` and
`read_purchased_record` stay reachable, the disclosure path stays open. Decide the scope
deliberately rather than by default.

**One data point that bears on the framing.** P-223's measurement found `records_request_jobs`
holds 42 rows, of which your account owns 2, both `status=needs-human`, completed, with zero
artifacts each. The row logs an open product question: should a `needs-human` job with zero
artifacts be visible to the user who requested it rather than rendering as an empty list. If the
answer is that the whole flow is not ready for customers, coming-soon is the right call and that
question goes away for now.

**Owed from you.** Which surfaces (web, MCP connector, both), and whether coming-soon means
disabled, labelled, or both.

---

## QA-06. Tool containers expand wider and shorter, seated under the search bar

**This is design, and it belongs in the design scope arriving separately.** One thing to carry into
it rather than rediscover.

**The pattern already exists elsewhere in the portfolio.** G-128 closed 2026-09-14 in
`smartcity-dashboards` and shipped a real three-state map dock, Dock / Expand / Full, against an
operator-approved design at `_design/smartcity-map-dock/`. Its completion predicate required the
states to actually reflow rather than merely restyle, and its close artifact
(`_inbox/2026-09-14_g128-map-dock_close.json`) records a live-measured sliver defect: the
standalone path measured a real 40px map at 380px width. It also shipped a layers rule tied to dock
state, the categorized panel only at Full, a button and count at Dock and Expand.

That is a different product, so nothing transfers automatically. But the ask in QA-06 is a dock
state question, one surface in this portfolio has already designed and measured one, and the
reflow-not-restyle predicate is the right bar for this one too.

**Two incidental observations from the QA-06 screenshot, recorded because they are not design.**

First, the feasibility PDF for 1306 FAYETTE ST, Bastrop, is **7 pages**, where the 2407 PRINCETON
DR feasibility in QA-03 was **13 pages**. Whether that is legitimate variation by available data or
a Bastrop-versus-Travis composition gap is not established here.

Second, the recent artifact list shows X-ray artifacts for 1505 WATER ST and 1101 CHESTNUT ST dated
2026-09-08, and a Flood and drainage artifact for 1101 CHESTNUT ST dated 2026-09-08. P-221, opened
today, records that `export_instrument kind=dossier` currently returns `pipeline_output_absent` and
that X-ray "cannot be generated at all". Both can be true if X-ray broke between 09-08 and 09-15,
and that would date the regression. Worth one check, because a regression with a date is far easier
to find than one without.

---

## QA-07. Move the settings button to the bottom of the toolbar

Pure UI ordering on the left map rail, no data dependency, no reconciliation needed. Goes into the
design scope with QA-06.

The one thing to specify when it is picked up: whether "bottom of the toolbar" means below the
layers icon inside the same pill, or a visually separated group at the foot of the rail. The
annotation shows the destination but not the grouping.

---

## Summary table

| Item | Looks like | Actually is | Blocked on |
|---|---|---|---|
| QA-04 ETJ layer | A missing toggle | An unwired source; toggle exists, `live: false` | A ruling on §42.021 derivation vs per-city GIS |
| QA-05 records coming-soon | A label | A label plus removal from the purchase surface, over an open disclosure defect | Your scope call: web only or connector too |
| QA-06 container geometry | Design | Design, with a solved precedent at G-128 | The design scope |
| QA-07 settings position | Design | Design | The design scope, one grouping question |

## What this reconciliation did not establish

Whether any city in the current footprint publishes an ETJ layer. Whether the 7-page versus
13-page feasibility difference is legitimate. Whether the 2026-09-08 X-ray artifacts were generated
then or are stale rows. Whether `etj` appearing on the Entitlement preset tab rather than Flood
would have changed what you saw, since it never enters the known set at all. No lane dispatched.
