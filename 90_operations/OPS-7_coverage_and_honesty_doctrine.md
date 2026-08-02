---
id: OPS-7_coverage_and_honesty_doctrine
title: OPS-7 — Coverage + Honesty Doctrine (honest-absence at country scale; never present un-warmed as served)
date: 2026-08-02
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

## THE COVERAGE HONESTY AT THE HEADLINE (never a bare number)
- Every external-facing coverage/count number carries its scope + honesty split (per the CLAUDE.md ground-truth discipline): public-vs-internal, onboarded-vs-total, certified-vs-served. Never "Texas is on the spine" when it's "N of 254 counties onboarded, M certified."
- The county ledger (OPS-6) IS the honest coverage artifact — a performance public data layer showing exactly what's done, at what recipe-version, certified or not.

## WHAT "DONE" MEANS AT SCALE (the honest end-state)
Texas "on the spine" = every county onboarded (through the OPS-2 line) OR honestly marked coverage-in-progress; every served parcel correct + cited + current; every absence disclosed; the county ledger showing the true state. Not "254 counties of data" — "254 counties, each either served-correct-and-certified or honestly-in-progress, none fabricated." The honest partial is the product; the fabricated complete is the failure.

## THE FIRST-HIT RULE (customer never hits a lie)
A customer who browses to an un-onboarded county / un-warmed parcel / conditional district must hit HONEST-ABSENCE on the first hit — never a stale/blank/repealed/fabricated value. The R13 fail-closed gate + the currency gate + the honest-decline copy enforce this. PE renders the whole state's parcels (county cadastral); the ones not yet warmed serve "coverage in progress," not a wrong envelope.

## WHY THIS IS LOAD-BEARING
The moat is "cited, current, honest" — assembled truth a professional stakes a decision on. One fabricated or silently-stale value at scale poisons that trust across the whole layer (the "certified a broken Bastrop" lesson, one level up). Honest-absence is not a weakness to hide — it is the PROOF the layer is trustworthy: it tells you what it doesn't know. This doctrine is how the thesis survives contact with 254 counties.
