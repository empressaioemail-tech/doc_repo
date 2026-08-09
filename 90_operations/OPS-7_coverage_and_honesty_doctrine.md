---
id: OPS-7_coverage_and_honesty_doctrine
title: OPS-7 — Coverage + Honesty Doctrine (honest-absence at country scale; never present un-warmed as served)
date: 2026-08-02
last_updated: 2026-08-09
status: operations doc (the doctrine that protects the cited/current/honest thesis at scale)
owner: nick
related: [OPS-5_cert_standard, OPS-1_texas_source_registry, 2026-08-01_fan_readiness_audit_VERDICT, 42_stub_thesis_national_twin_substrate]
layer: L-SURFACE
---

# OPS-7 — Coverage + Honesty Doctrine

## WHAT THIS IS
The doctrine that keeps the "cited, current, honest" thesis intact as we go from 1 block to 254 counties. At scale, MOST jurisdictions will be missing MOST layers at any given time (un-onboarded counties, unincorporated-unzoned land, conditional districts). If honest-absence fails, the whole thesis breaks in the field. This is the rule set for that.

## THE CORE RULE — FAIL CLOSED, NEVER FABRICATE, NEVER SILENT-DEGRADE
Every layer, every jurisdiction: when a source is missing/stale/repealed, HONEST-DECLINE ("not verified here" / "coverage in progress" / "conditional, verify with city") — NEVER a fabricated value, NEVER a silent-neutral that reads as "known," NEVER repealed code (R13). This is the spine-outage lesson (a monitor/serve path that returns empty-as-if-authoritative) applied to the data layer. The fan-readiness audit confirmed the mold does this today (Harris/Fayette return honest-empty); this doctrine keeps it true at scale.

## THE THREE KINDS OF ABSENCE (each disclosed differently)
1. NOT-ONBOARDED (a county not yet through the line) — the app marks it "coverage in progress" at the JURISDICTION level (a banner), never a silent per-parcel blank. The county ledger (OPS-6) shows done/not-done.
2. GENUINELY-ABSENT (unincorporated-unzoned land; a district with no scalar; PDD conditional) — honest-decline gracefully with the reason ("no zoning here" / "conditional per the code, verify with city"). This is a FEATURE (honest absence), not a gap. Unincorporated TX is LEGITIMATELY unzoned — 100% zoning coverage is NOT the target.
3. CONFLICTING (the jurisdiction publishes conflicting sources — R25) — draw one, cite the other, DISCLOSE the conflict plainly. The conflict becomes a disclosed feature of the output.

## THE THREE STATES OF COVERAGE (added 2026-08-09; every coverage claim must name which one it means)
CODE EXISTS, DATA LOADED, and SERVED TO PRODUCT are three different states, and a coverage claim that does not say which one it means is not an honest claim. A writer merged is not a row loaded, and a row loaded is not an answer a customer receives. This is the data-layer form of the standing code-done-is-not-customer-done rule: a grade is a live probe on a deployed surface, never a merged PR.

1. CODE EXISTS. An adapter, writer, or rail is built and merged. Claims nothing about any jurisdiction. The manifest tracks this per cell as whether a rail has a writer at all.
2. DATA LOADED. Rows are acquired and sitting in a store. Real work, still invisible to a customer. Loading geometry fills the parcel store; it does not by itself produce anything the product reads.
3. SERVED TO PRODUCT. Atoms exist, are scored into the manifest, and a live surface returns them for a real parcel. Only this state may be described as coverage without qualification.

The live gap between states 2 and 3 is the reason this section exists, and it is large. Verified 2026-08-09 against the deployed county ledger (`GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`, HTTP 200): the summary reads 254 total counties, 12 rails, 3,048 total cells, 38 satisfied cells, and `texasCompletenessPct` of 0.2133771830027867, with an onboarded count of 1. Against that, `_STATE.md` records 196 of 254 counties acquired with parcel geometry (14,442,123 rows, from a distinct-county count on `txgio_parcel`) but only 79 counties carrying `parcel-node` atoms (796,046 atoms). The ledger scores geometry for fewer still: only 49 of 254 counties carry a non-null geometry coverage percentage, and only 37 read `satisfied-present`. So the same program is simultaneously at 196 counties, 79 counties, and 0.2134 percent, and all three numbers are true of different states. Quoting any one of them bare is the failure this doctrine exists to prevent.

Practical rule: never write a coverage number without its state and its instrument. Say "196 counties acquired (data loaded, distinct-county count on `txgio_parcel`)" or "0.2134 percent Texas completeness (served, live county-ledger summary)," never "196 counties covered." Where the three kinds of absence above tell a customer why something is missing, the three states tell us and any external reader what a presence claim actually asserts. Both are required for the headline rule below to mean anything.

## THE COVERAGE HONESTY AT THE HEADLINE (never a bare number)
- Every external-facing coverage/count number carries its scope + honesty split (per the CLAUDE.md ground-truth discipline): public-vs-internal, onboarded-vs-total, certified-vs-served. Never "Texas is on the spine" when it's "N of 254 counties onboarded, M certified."
- The county ledger (OPS-6) IS the honest coverage artifact — a performance public data layer showing exactly what's done, at what recipe-version, certified or not.

## WHAT "DONE" MEANS AT SCALE (the honest end-state)
Texas "on the spine" = every county onboarded (through the OPS-2 line) OR honestly marked coverage-in-progress; every served parcel correct + cited + current; every absence disclosed; the county ledger showing the true state. Not "254 counties of data" — "254 counties, each either served-correct-and-certified or honestly-in-progress, none fabricated." The honest partial is the product; the fabricated complete is the failure.

## THE FIRST-HIT RULE (customer never hits a lie)
A customer who browses to an un-onboarded county / un-warmed parcel / conditional district must hit HONEST-ABSENCE on the first hit — never a stale/blank/repealed/fabricated value. The R13 fail-closed gate + the currency gate + the honest-decline copy enforce this. PE renders the whole state's parcels (county cadastral); the ones not yet warmed serve "coverage in progress," not a wrong envelope.

## WHY THIS IS LOAD-BEARING
The moat is "cited, current, honest" — assembled truth a professional stakes a decision on. One fabricated or silently-stale value at scale poisons that trust across the whole layer (the "certified a broken Bastrop" lesson, one level up). Honest-absence is not a weakness to hide — it is the PROOF the layer is trustworthy: it tells you what it doesn't know. This doctrine is how the thesis survives contact with 254 counties.
