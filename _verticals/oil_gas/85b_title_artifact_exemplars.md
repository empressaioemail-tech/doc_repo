---
id: 85b_title_artifact_exemplars
title: Title artifact exemplars from Herbert - DOTO, working interest report, county index runsheet
status: reference
last_updated: 2026-07-07
applies_to: [hauska, empressa]
owner: nick
related: [85_landman_data_model_review, 85a_herbert_review_answers, _decisions/2026-07-06_og_activation_adr025_promotion, 80_adrs/adr_025_revenue_allocation_unit, _inbox/2026-07-06_three_lane_program_STATUS]
---

# Title artifact exemplars (Herbert, received 2026-07-07)

Herbert provided three professional title artifacts. They are the ground-truth *formats* the title-slice work (C7) must be graded against: what a landman or title attorney actually produces, at what grain, with what interest math. PDFs live in [`assets/title_exemplars/`](assets/title_exemplars/). None of these cover Reeves County — see "C7 implications" below before treating them as the graded-truth dataset.

## 1. Division Order Title Opinion (Holliday Energy Law Group, 2026-05-29)

`assets/title_exemplars/2026-05-29_doto_lea_county_nm_eog_w2_sec16.pdf` — 48 pages. Prepared for EOG Resources; W/2 Section 16, T22S R33E, Lea County, New Mexico; 320 acres, two 160-acre opinion tracts; DOTO file 196.110.

What it teaches the ontology:

- **The unit is the accounting object, the tract is the title object.** The opinion tabulates ownership three ways: W/2 unitized (all depths), and two Speedy 16 State Com units (E/2 W/2 and W/2 W/2), each *limited to the Bone Spring formation*. Same acreage, different unit definitions by depth/formation — this is ADR-025's revenue-allocation-unit ruling in a real instrument.
- **Tract Participation Factor (TPF)** = tract acreage / unit acreage; every unit-level interest is the tract interest × TPF. Unit MI, Unit PRI (participating royalty = MI × lease royalty less burdens), NMA, Unit WI, Unit NRI, Unit ORRI are separate columns with explicit formulas printed per row (e.g. NRI = {(1 − 3/16) × 1.0 − 0.0125} × 0.5). The interest-math chain is fully auditable — exactly the reasoning-chain property our atoms must reproduce.
- **Every interest row cites its instrument basis** (lease L1 = 1948 E-1932 Erle Payne lease at 1/8 royalty; L2 = 2011 VB-2098 Yates lease at 3/16) and its Comments & Requirements items. Interests without C&R references are unburdened state minerals.
- **Comments & Requirements are obligation atoms**: drilling requirements (confirm leases held past primary term), advisory items (JOA of record, communitization agreements with recording cites), curative items (produce the 1955 BLM patent). Each has a requirement/none-advisory disposition.
- **Exhibit E (unrecorded documents affecting chain of title)** is first-class: 18 unrecorded agreements known only by memoranda of record, with the *Camino Real v. Ortega* constructive-notice rule stated. A title slice that only reads recorded instruments is structurally incomplete; the opinion says so in its own limitations section.
- **Tabulation invariant**: PRI + NPRI + NRI + ORRI + unleased MI totals 1.00000000 per unit. A cheap conformance check for any assembled slice.

## 2. Working Interest Ownership Report (Trace Wilkins, landman, 2015-10-24)

`assets/title_exemplars/2015-10-24_working_interest_report_winkler_s2sw4_sec25_blkB5.pdf` — S/2 SW/4 Section 25, Block B-5, PSL Survey, Winkler County, TX (80 acres).

What it teaches:

- **Depth severance is the working-interest grain**: three separate ownership tables for surface–3,120 ft (Chaparral Oil 1.00 WI), 3,120–5,000 ft (55 Services / Herman L. Loeb at 0.50 each), and 5,000 ft+ (four owners at 0.25). Any WI atom without a depth interval is underspecified.
- **The certification carries an explicit reliability disclaimer** (online county index, indexing errors possible, sovereignty-to-date coverage claim). This is the professional version of our asserted-confidence-with-provenance posture — even paid ground truth arrives caveated.
- Comments carry unreleased deeds of trust with recording cites — encumbrance atoms (ADR-020/021 family) inline with ownership.

## 3. County index runsheet / edit list (Winkler County clerk index, 2015-12-14)

`assets/title_exemplars/2015-12-14_county_index_runsheet_winkler_sec25_blkB5.pdf` — 322 pages, every indexed instrument touching Section 25, Block B-5, PSL, 1909–2015: instrument type, grantor/grantee, book/page, instrument and filed dates, legal, related references.

What it teaches:

- This is the **raw feed the title slice assembles from**: a century of mineral deeds, royalty deeds, assignments, DOTs, releases, probates, tax suits, unit designations, pooling agreements. The chain-of-title graph our K2-style assembly must reconstruct is exactly the grantor→grantee edge list here.
- Instrument-date vs filed-date is a two-date system (some instruments file decades late — a 1929 deed filed 1944). Hazard-window and lineage logic must key on both.
- Volume calibration: one section-block over ~106 years ≈ several thousand instruments. Sizes county ingestion cost estimates (commitment #3) realistically.

## C7 implications (operator decision, not made here)

C7's graded-truth leg currently waits on a **Reeves County** runsheet Nick self-sources (2026-07-07 ruling, $0 external spend). These exemplars are Winkler TX and Lea NM, so they do not directly satisfy that leg for the seeded Reeves atoms. But the Winkler pair (WI report + full county index runsheet for the *same* Sec 25 Blk B-5) is a self-contained graded-truth package: assemble a title slice from the runsheet instruments, grade against the landman's certified WI report, with Herbert available to grade method. Option for the operator: either (a) hold C7 on the Reeves runsheet as ruled, or (b) run the graded-truth leg on Winkler Sec 25 with this package and keep Reeves as the live-vertical county. (b) requires no purchase and no new relationship data — the runsheet was provided as reference material and the underlying instruments are public record — but it does add Winkler ingestion scope. Not decided; flagged for the queue.

## Provenance note

Received from Herbert 2026-07-07 alongside the commercial-data calls (see `_decisions/2026-07-07_cre_data_no_moodys_observation_stack.md`). The DOTO is a third-party attorney work product prepared for EOG and expressly limited to EOG's benefit — it is a *format and math exemplar* for internal grading only, never a data source to redistribute or an authority to cite in product output.
