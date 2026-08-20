---
id: 2026-08-20_vpat_scope_map
title: VPAT scope map — SKU to surface, bound against the Vertosoft price list
status: active
last_updated: 2026-08-20
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-19_wave3_surfaces_and_vpat_WDLL,
    _inbox/2026-08-19_g96_document_generation_investigation,
  ]
---

# VPAT scope map

Binds **SKU → product surface → route → conformance surface**. Source for the SKU column is
`SmartCityOS_PriceList_Vertosoft_2026-08-10`, sixteen line items, effective 2026-08-10, marked Section
889 compliant with UNSPSC codes assigned. Every other column is derived from measured state.

## Asset Management is a per-city custom build, and that is the answer

**Operator ruling 2026-08-20.** An earlier draft of this map treated the absence of an Asset Management
repository as an exposure. That framing was wrong and is retracted. AM is delivered as a **custom build
per engagement** — it cannot be built without the city’s own asset data — and the line item says so:
"Minimum viable deployment; scope set per engagement", "built around the city’s existing asset data".
No repository is the expected state, not a gap.

**What still needs one sentence in the ACR, because a procurement reviewer will ask.** For custom or
configured ICT there is no artifact to test at the moment of sale, so an ACR cannot report measured
conformance for the delivered build. The standard and defensible position is two-part, and it is already
true here:

- **The platform surface IS shipped and IS covered.** The Assets lens ships in Dashboards as three tabs
  (surfaces 18–20 below), it is in the 23-surface scan, and it is measured clean. That is real ICT and
  it is reported.
- **The per-city build is a delivery obligation, not a product claim.** The ACR says conformance of the
  configured deployment is validated at delivery, and the contract carries the accessibility clause.

That is the same shape as the service SKUs below, and it is a normal answer. The only wrong answer is
silence, because silence reads as a conformance claim for something nobody tested.

## The base Dashboards SKU maps exactly onto the product's own structure

`SCOS-DASH-DEP` promises "a role-based lens per department (city manager, development services, finance,
citizen)". `src/lenses.mjs` exports `LEAD_LENSES` as exactly `city-manager`, `development-services`,
`finance`, `citizen`. The product already encodes the price list, which is the strongest possible evidence
the scope map is bound correctly rather than assembled to fit.

The department lenses shipped this session — Public works, Parks, Police, Fire and EMS, Fleet, Records
search, People and access — are therefore **`SCOS-DASH-ADD` territory at $12,000 each**, not base scope.
They are still in ACR scope because they ship in the product, but they bill separately.

## SKU to conformance surface

| SKU | $ | Conformance surfaces | Repo |
|---|---|---|---|
| `SCOS-DASH-DEP` | 65,000 | Shell + Overview, Development services (6 tabs), Finance, Citizen, Connections, empty-city control | `smartcity-dashboards` |
| `SCOS-DASH-ADD` | 12,000 ea | Public works, Parks, Police, Fire and EMS, Fleet, Records search, People and access | `smartcity-dashboards` |
| `SCOS-PLAN-DEP` | 42,000 | Plan review — **iframe mount**, product surface is `plan-review` | `plan-review` |
| `SCOS-FILE-DEP` | 25,000 | Files — **iframe mount**, product surface is `smart-files` | `smart-files` |
| `SCOS-ASST-DEP` | 52,000 | Assets lens, 3 tabs, shipped and scanned. Per-city build validated at delivery | per-engagement |
| `SCOS-PROG-DEP` | 150,000 | All four on one shared record; AM leg is per-engagement | 3 repos + build |
| `SCOS-*-ANN` | 6,250–37,500 | Same surfaces, no new ICT | as above |
| `SCOS-INTG-ADD` | 8,500 ea | No new surface. Adapter grant; catalog is 10 kinds | `smartcity-dashboards` |
| `SCOS-SVC-ONB` | 15,000 | Human services — see obligations note | — |
| `SCOS-SVC-PRO` | 250/hr | Human services | — |
| `SCOS-SVC-TRN` | 2,500 ea | Human services **plus training materials** | — |
| `SCOS-SUP-PRE` | 9,500 | Human services **plus support documentation** | — |

## The service SKUs are not automatically out of scope

Section 508 covers **support documentation and services** (Revised 508 Chapter 6, 602). So `SCOS-SVC-TRN`
training materials and `SCOS-SUP-PRE` support documentation carry obligations even though no software
ships with them: documentation must be available in an accessible format, and support must accommodate
communication needs. Flagged rather than ruled — it is a question for whoever signs the ACR, and it is the
kind of thing a procurement reviewer checks.

## Dashboards conformance surfaces, measured

23 surfaces, derived from the id sets `src/staff-review.mjs` exports rather than hand-enumerated — the
planner's original hand-built list of 16 omitted the Development-services and Assets tab panels and was
30% short. Scanned at two viewports x two themes = 92 scans.

| # | Surface | Route | SKU |
|---|---|---|---|
| 1 | Overview | `/?lens=city-manager` | DASH-DEP |
| 2–7 | Development services, six tabs | `/?lens=development-services&tab=…` | DASH-DEP |
| 8 | Finance | `/?lens=finance` | DASH-DEP |
| 9 | Citizen | `/?lens=citizen` | DASH-DEP |
| 10 | Public works | `/?lens=public-works` | DASH-ADD |
| 11 | Parks | `/?lens=parks` | DASH-ADD |
| 12 | Police | `/?lens=police` | DASH-ADD |
| 13 | Fire and EMS | `/?lens=fire-ems` | DASH-ADD |
| 14 | Fleet | `/?lens=fleet` | DASH-ADD |
| 15 | Plan review | `/?work=review` | PLAN-DEP (mount) |
| 16 | Files | `/?work=files` | FILE-DEP (mount) |
| 17 | Records search | `/?work=records` | DASH-ADD |
| 18–20 | Assets, three tabs | `/?work=assets&atab=…` | ASST-DEP platform surface |
| 21 | Connections | `/?work=connections` | DASH-DEP |
| 22 | People and access | `/?work=people` | DASH-ADD |
| 23 | Empty-city control | `/?cityKey=empty-city` | DASH-DEP |

## Mount surfaces reach other products

Surfaces 15 and 16 are iframe mounts. **A Dashboards user reaches Plan Review and Smart Files without
leaving the product**, and reaches SmartSite's untagged `pdf-lib` PDF the same way. The ACR scope cannot
stop at "Dashboards emits no documents".

## Generated documents

| Path | Surface | Generator | 504.2.2 today | Row |
|---|---|---|---|---|
| Site plan PDF | SmartSite (engine-api) | server-side `pdf-lib` | fails; **64.4% of extracted lines are one character** | G-104 |
| SmartCity exports | legacy `smartcity-os` | client jsPDF, **vector text not raster** | fails; jsPDF 4.2.1 cannot tag at any setting | G-103 |
| CSV / txt | several | n/a | no obligation | — |
| Dashboards, Smart Files, Plan Review | — | **emit none** | n/a | — |

## Conformance target and current evidence

**Both** WCAG 2.0 AA (Revised 508, federal) and WCAG 2.1 AA (ADA Title II, state and local). Each
worksheet row states which standard it answers.

Evidence as of 2026-08-20, Dashboards only, from `P:/tmp/vpat_evidence_run.json`:

```
0 unwaived conformance nodes, 0 waived, 132 unresolved and adjudicated
92/92 scans = 23 surfaces x 2 themes x 2 viewports
0 title findings, 0 focus findings over 1070 keyboard stops
BOUND: reference axe JUDGED 68.9% of rendered text; full-extent 96.1%
```

Adjudicated is not measured-clean, and JUDGED is not CONTAINED. The smaller number is the conformance
bound and the instrument prints both.

**The gate does NOT block a merge, and the ACR must not imply it does.** Branch protection Stage 1 landed 2026-08-20: protection is PRESENT on all four product repositories, and **zero checks are required** on any of them. Verified by reading `branches/main/protection` on each — a configuration read, not a violation attempt, and the distinction is stated because the fleet standard for claiming a control works is to attempt the violation and record the refusal. So `a11y` and `test` run, report accurately, and block nothing; every green cited in this session is a courtesy rather than a gate. What the evidence above supports is that the product MEASURED clean on the date and tree stated, not that a red result would have stopped a release. Stage 2 makes checks required and has not been applied.

**`plan-review` has no CI at all** — zero check runs on its default branch — so it cannot participate in Stage 2 until it has a check to require, and it is a repository whose SKU sells at $42,000.

**Not yet run, and neither standard is covered by axe alone:** reflow (1.4.10), orientation (1.3.4), text
spacing (1.4.12), content on hover or focus (1.4.13), status messages (4.1.3), keyboard-only completion,
and a screen-reader pass. Smart Files and Plan Review have not been scanned at all.

## What remains before an ACR can be filled

Rebuild the 42-row per-criterion worksheet against these 23 surfaces. Scan Smart Files and Plan Review.
Run the manual protocol. Land G-103 and G-104 so 504.2.2 can be answered rather than deferred. And take
the Asset Management decision above, which is the only item on this page that cannot be closed by work.
