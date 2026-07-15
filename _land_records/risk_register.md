---
id: land_records_risk_register
title: Land Records Acquisition Risk Register
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/strategy, _land_records/source_rail_registry, _land_records/ingest_architecture, 80_adrs/adr_027_first_party_land_records_acquisition, 90_runbooks/pia_bulk_request_runbook]
owner: planner
---

# Land Records Acquisition Risk Register

Premortem. It is 2027 and the Texas land records substrate failed. Here is why, ranked by probability times damage.

## R1. The vendor-holds-the-data wall

**Severity: fatal to Rail A. Probability: moderate to high. Status: unverified.**

Clerks run Tyler iDoc Market, Kofile Vanguard, GovOS, and self-hosted systems. See `source_rail_registry` section 3.3. If a clerk can say "our vendor holds the records, we have no bulk export capability, and Tyler will sell you access commercially," then LGC 118.011(e) is a paper victory. The PIA cost rules bind the clerk; they do not obviously bind the clerk's vendor's pricing to a third party.

This is the single most likely place the entire strategy breaks, and it is unverified.

**Mitigation.** Counsel opinion before Phase 2, not after. Specifically: whether records held by a contractor for a governmental body remain subject to PIA production at PIA cost, and whether a clerk's contractual arrangement with an RMS vendor can lawfully defeat a 118.011(e) request. Structure the Phase 2 county selection to test one Tyler shop and one Kofile shop deliberately, so the answer arrives empirically at the same time counsel produces it theoretically.

**Reversal trigger.** If this wall holds across a majority of target counties by transaction volume, reopen `adr_027`.

## R2. 118.011(e) does not mean what we read it to mean

**Severity: fatal to the cost model. Probability: low. Status: unverified.**

The whole economic argument rests on one subsection and its 2025 amendment. Note that statutes.capitol.texas.gov was still serving pre-amendment text with a publication-pending notice as of this research, while FindLaw's text current as of 2026-01-01 carries the "including real property records" language. Sources: https://statutes.capitol.texas.gov/DocViewer.aspx?DocKey=LG/LG.118, https://codes.findlaw.com/tx/local-government-code/loc-gov-t-sect-118-011/

The two sources disagree. One of them is stale. We believe FindLaw is current and the legislative history supports it. We have not confirmed it against the enrolled bill text.

**Mitigation.** Counsel confirms against enrolled SB 1547 text and the codified statute before any capital commitment. This is cheap to resolve and it gates everything. Do it first.

## R3. Clerk quotes come in absurd and survive challenge

**Severity: high. Probability: moderate.**

A clerk quotes $180,000 for programming on the theory that their RMS has no export function and a new program must be written. 1 TAC 70.3(c) explicitly contemplates charging for a programmer to create a new program so that requested information may be accessed and copied. Source: https://regulations.justia.com/states/texas/title-1/part-3/chapter-70/section-70-3/ That is a lawful line item. There is no ceiling on hours other than reasonableness.

Combined with 552.231's infeasibility escape hatch, a motivated clerk has a legitimate path to pricing us out without ever refusing.

**Mitigation.** Scoping discipline in `pia_bulk_request_runbook` section 3, especially asking only for the native export the system already produces. Index-first. Escalation ladder in `pia_bulk_request_runbook` section 8. Accept that some counties will be expensive and prioritize by transaction volume rather than trying to win every county.

**Watch metric.** `quote_variance_from_model` in the registry. A pattern above 10x across three or more counties surviving AG complaint is an `adr_027` reversal trigger.

## R4. We win the fee fight and lose the municipal relationship

**Severity: high and asymmetric. Probability: moderate.**

County clerks talk to each other. They talk to city managers. Sylvia Carrillo's network is a municipal network. SmartCity OS sells to exactly these people. Filing an OAG overcharge complaint against a Bastrop-adjacent clerk to save $4,000 while Codex and SmartCity OS are trying to sell into that same network is a catastrophic trade.

The 4x bad-faith penalty under LGC 118.801 is real leverage. Leverage used is leverage spent.

**Mitigation.** The escalation ceiling in `pia_bulk_request_runbook` section 8: do not climb past step 2 in Bastrop, past step 3 in Phase 1 and 2. Lead with the phone call. Frame as "building for cities," which is true. If a county resists, walk and come back later from a position of demonstrated value rather than escalating.

**This risk is under-weighted by default because the legal analysis is more legible than the relationship analysis. Weight it up deliberately.**

## R5. The recurring request treadmill eats the company

**Severity: chronic, compounding. Probability: high if unmanaged.**

There is no standing PIA subscription. See `strategy` section 2.6. At 254 counties on monthly cadence that is 3,048 request cycles a year, each with a letter, an itemized statement, a 10 business day response clock, a payment, and a receipt.

This is not a build cost. It is permanent operating cost, and it scales linearly with coverage forever. It is also the least glamorous thing in the plan and therefore the most likely to be under-resourced.

**Mitigation.** Cadence as a function of county transaction volume, not a global constant. See `ingest_architecture` section 3. Aggressive automation of letter generation and state tracking. Honest headcount modeling before Phase 3. And a hard-nosed answer to: is a county with 400 recordings a year worth a monthly cycle? Probably annually.

**Second-order risk.** The auto-withdrawal trap. Missing a 10 business day response window silently resets a county to zero and nobody notices until someone asks why that county's data is 8 months stale. Needs alerting with escalation, not a dashboard.

## R6. The abstract plant question gets answered wrong, late

**Severity: moderate to high. Probability: low. Status: unverified inference.**

`strategy` section 2.7 infers that TDI's P-12 plant definition regulates who may be licensed as a title insurance agent, not who may assemble land records data, and that Hauska can build a plant-shaped dataset without being a plant so long as it does not solicit title insurance, collect premiums, or issue or countersign policies.

That inference is unverified. `ingest_architecture` section 4 then recommends using the P-12 content list as a completeness rubric, which is defensible but increases the optics risk if the inference is wrong.

If TDI or TLTA takes a different view once Hauska is visible, the exposure is regulatory and it arrives after the data is already assembled.

**Mitigation.** Counsel before any title-adjacent positioning or marketing. Not urgent for Phase 0 through 2, because ingesting free parcel geometry does not look like a plant. It becomes urgent the moment full county instrument coverage plus indexing exists, which is roughly Phase 3. Resolve before Phase 3, not at it.

**Note.** TLTA is an organized, well-resourced trade association that actively works the Legislature every session. Source: https://www.tlta.com/common/uploaded%20files/documents/texas_89th_LegislatureReport.pdf They are not an adversary today. They could become one. Worth knowing they exist before they know we do.

## R7. Sales price data is confidential and the comp surface never ships

**Severity: moderate, bounded. Probability: high. Status: unverified inference.**

Texas is a non-disclosure state. `source_rail_registry` section 4.3 flags that sales price data reported to CADs and submitted via EPTS is very likely confidential and not obtainable via PIA. Unverified.

**Mitigation.** Verify with counsel before scoping any valuation or comp product. If confirmed confidential, this is a permanent structural gap that constrains TexasFile and every other Texas land data product equally. It is a shared industry constraint, not a competitive disadvantage. The correct response is to stop planning around it, not to look for a workaround.

**Do not let this one drift.** It is cheap to answer and it silently shapes roadmap assumptions if left open.

## R8. Publication gating gets built wrong

**Severity: moderate. Probability: low to moderate. Status: unverified inference.**

`ingest_architecture` section 7 infers that Tax Code 25.027 and HB 4350 are display-layer rules rather than ingest filters, and that Hauska may possess data it may not publish. If that inference is wrong and possession itself is restricted, the ingest pipeline needs filtering at landing, which is architecturally different and much harder to retrofit.

**Mitigation.** Counsel on the possession versus publication distinction before the publish stage is built. Cheap now, expensive later.

## R9. Coverage gaps get averaged away and the product lies

**Severity: existential to credibility, not to the build. Probability: moderate.**

Index and image coverage start dates vary by decades across counties. Taylor indexes property records to 1972 with older content back to 1878. Walker's OPR begins 1986 with image-only 1846 to 1960. Travis via iDoc Market starts 1982. Sources in `source_rail_registry` section 3.2.

The failure mode is not missing data. It is a UI that presents a partial chain of title as if it were complete, or a confident answer derived from a county whose last delta was 90 days ago.

A substrate whose entire thesis is verifiable, provenance-carrying, confidence-bearing atoms cannot ship a surface that hides coverage boundaries. If it does, the four commitments are marketing.

**Mitigation.** Coverage boundary as a first-class atom property, not a footnote. Every derived answer carries the temporal validity of its weakest input. `ingest_architecture` sections 2 and 3. This is the calibration overlay and coverage boundary markers from the existing self-observation work, made concrete. The land records domain is the forcing function that proves whether those markers are real or aspirational.

## R10. Storage and compute cost is discovered at Phase 3

**Severity: moderate. Probability: moderate.**

Taylor County alone is roughly 4 TB for 4 million images. Source: https://www.taylorcounty.texas.gov/281/Official-Public-Real-Property-Records Dallas records approximately 400,000 documents annually. Source: https://www.dallascounty.org/government/county-clerk/recording/ Statewide is a serious number that nobody has computed.

**Mitigation.** Storage cost model before Phase 3, flagged in `ingest_architecture` section 8 as open question 3. Index-first sequencing means the storage problem does not gate early value.

## R11. TexasFile is not actually the competitor

**Severity: strategic. Probability: unknown.**

This doc set assumes TexasFile is the thing to replace. TexasFile positions itself as a data provider since 2005 covering 252 of 254 counties, serving oil and gas, land and title research, legal, banking and mortgage, and surveyors. Source: https://www.linkedin.com/company/texasfile

But the prior competitive analysis identified MGO, Accela, and Tyler as the strategic set. Tyler in particular *is the RMS vendor inside the county clerk's office* for a meaningful share of counties. See `source_rail_registry` section 3.3.

That means Tyler sits on both sides: it is the incumbent Hauska is positioned to displace at the city level, and it is the gatekeeper on the data Hauska needs at the county level. That is not a coincidence and it is not modeled anywhere in this doc set.

**Mitigation.** Route to strategy, not to the planning agent. The question is whether Rail A acquisition creates a channel conflict with a party who has both motive and mechanism to make R1 worse. Worth thinking about before filing 254 requests announces the intent.

## Ranked summary

| ID | Risk | Severity | Prob | Gates |
|---|---|---|---|---|
| R1 | Vendor-holds-the-data wall | Fatal to Rail A | Mod-High | Phase 2 |
| R2 | 118.011(e) misread | Fatal to cost model | Low | All requests |
| R4 | Win fee fight, lose relationship | High, asymmetric | Moderate | Phase 1 |
| R5 | Recurring request treadmill | Chronic, compounding | High | Phase 3 |
| R3 | Absurd quotes survive challenge | High | Moderate | Phase 2 |
| R7 | Sales price confidential | Moderate, bounded | High | Comp surface |
| R9 | Coverage gaps averaged away | Credibility | Moderate | Publish |
| R11 | Tyler channel conflict | Strategic | Unknown | Strategy |
| R6 | Abstract plant answered wrong | Mod-High | Low | Phase 3 |
| R10 | Storage cost discovered late | Moderate | Moderate | Phase 3 |
| R8 | Publication gating built wrong | Moderate | Low-Mod | Publish |

## The three things to do this week

1. **Counsel scope covering R2 and R1.** R2 is cheap and gates everything. R1 is the one that can kill it. Nothing else matters until these two are answered.
2. **Email ptad.ears@cpa.texas.gov** asking whether EARS submissions are obtainable in bulk from the Comptroller. See `source_rail_registry` open question 5. If yes, 253 CAD relationships collapse into one. Highest leverage per unit effort in the entire plan.
3. **Start Phase 0.** StratMap parcels and address points are free and need no permission. There is no reason to wait on counsel to ingest them.

## Revision history

- 2026-07-15, research session, initial draft.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/; cross-references updated.
