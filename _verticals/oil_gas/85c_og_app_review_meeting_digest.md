---
id: verticals_oil_gas_85c_og_app_review_meeting_digest
title: OG app review meeting digest — Herbert, Chris, Val (title opinions, wedge targeting, data sources)
status: exploration
last_updated: 2026-07-08
applies_to: empressa
owner: nick
related: [85_landman_data_model_review, 85a_herbert_review_answers, 85b_title_artifact_exemplars, 80_adrs/adr_025_og_atom_ontology, _decisions/2026-07-05_og_vertical_activation, _decisions/2026-07-07_c7_winkler_baseline_reeves_target, 40_chris_app_overlay, 50_complete_product_plan]
---

# OG app review meeting digest (2026-07-08)

Participants: Nick, Herbert Melton, Chris Lindenmayer, Valerie Thompson. Full transcript: [`assets/transcripts/2026-07-08_og_app_review_herbert_chris_val_otter.txt`](assets/transcripts/2026-07-08_og_app_review_herbert_chris_val_otter.txt). Status: exploration record, not decisions. Nothing here is ratified; the wedge-targeting question in particular is explicitly open.

## Incoming confidential artifacts (handling rule binding)

Herbert has a Texas DOTO (division order title opinion), a drilling title opinion, and more run sheets incoming. He stated on the call that sharing these carries risk to him and that the New Mexico DOTO cost the company roughly a quarter million dollars. Handling is the same as the EOG DOTO rule in 85b: internal grading exemplars only, never redistributed, never cited in product output, PDFs stay in this repo's assets and are never copied into product repos.

## Title-opinion taxonomy (new domain knowledge, feeds ADR-025)

Drilling title opinion (roughly $100k to $150k, pre-drill): attorney's opinion that title is clear to drill, with curative requirements listed. DOTO (roughly $200k to $250k, post-production): sets up the pay decks (who gets paid what decimal on production) and shifts deck-error liability to the law firm's errors-and-omissions coverage. "Division order" always means land administration, how revenue is dispersed. Implication: the DOTO is the professional ground-truth artifact for the revenue-allocation-unit and pay-deck model, playing the same grading role at the revenue layer that the Winkler WI report plays for C7's chain method at the title layer. Only large firms buy these; small operators cannot, which is part of the wedge logic.

## The public-record ceiling (defines the honest base product)

Modern leases are mostly NOT recorded. Counties get a memorandum only: grantor/grantee, legal description, lease date. No Pugh clause, no depth severance, no obligations. Consequences the group converged on: the base product is verified public facts plus explicitly rendered gray areas, and the gray area IS the signal (a memorandum hands a landman the mineral-owner contact and the legal, which is the start of a lease conversation). Depth matters: Pugh clauses and depth severances mean lease geometry is three-dimensional (Chris's cut-the-earth cross-section visualization idea targets exactly this). Herbert's trust test: when our public-derived layer matches a company's own lease records, they know the information is correct.

## Product boundary corrected live

Nick entered thinking the lease layer was wedge/base. Herbert's split, accepted on the call: the courthouse-derived lease/memorandum layer is base product; the company's lease book with terms and obligations (their "land system" dump: lease analyst, title analyst, division order analyst workflows) is the private overlay package, tenant-private, never pooled. Demo pattern: dummy leases in the base, then "give me five of your sections and I'll show you what we can do before you subscribe." This matches the seeded-first plus overlay-badges architecture og-twin already ships.

## The cradle-to-grave arc (Herbert's full-stack frame)

Run sheet (title guy in the courthouse) → lease buyer negotiates and purchases leases → drilling (drilling title opinion) → production (DOTO, pay decks) → land administration (spreadsheet replacement; the Tom-Jones-dies-split-by-three maintenance problem) → smart-contract royalty payouts → marketplace transaction with a verifiable history. Notes: the smart-contract pay-deck idea lands on rails already built (`@hauska-sdk/payment`, USDC); deck-error liability structures are what our provenance/confidence envelope was built to serve; "once we get them from the beginning we maintain them as long as they have production" is the retention thesis.

## Run-sheet economics (the quantified value prop)

Interests are run to the eighth decimal and must sum to one; unit participation proportionally reduces. An AMI that needs 30 field landmen needs 10 if the data already exists. Herbert's brokerage history (150 crews at peak, 74 laid off in three weeks at Covid; per-diem arbitrage of $250 to $400 per person per day by moving crews home) means he can price run-sheet work per section precisely. OPEN ASK to Herbert: current cost of a run sheet per section (crew day rates times duration) as the pricing anchor and as the cost checkpoint our automated chain must beat.

## Wedge targeting (OPEN, the Val question)

Val pressed twice: where is the actual money, who is the highest-paying consumer, and is a landman tool a buyer that funds this build. Candidate buyers surfaced: (1) the spreadsheet operator, a small producer running land admin on Excel (Nick explicit: the wedge is people running things off spreadsheets, not people who can afford Quorum/SAP-linked land systems); (2) the wildcatter, a geologist/engineer with seismic and an idea who wants to cut 75 to 80 percent of landman cost from a $10M budget and would "pay $1,000 to go see that"; (3) landmen/brokers themselves (ambivalent: the tool eliminates their crews). Nick's forcing move: one nexus, the mineral lease ("everything is driven from a lease"; headline candidate "mineral leasing made easy," though Herbert noted that framing targets landmen and geologists specifically). Unresolved sequencing: acquisition-side product (run sheet, lease targeting, gray-area maps) versus admin-side product (pay decks, off-spreadsheets land administration). They share the twin; the first buyer and first build differ.

## Data sources named

RRC (the twin base; permitted/plugged wells, pipelines, unit spacing, operator filter; already ours, C6 fetch proven). County clerks direct (some free, e.g. Montgomery County; the primary source, third parties are derivatives). TexasFile (Herbert's recommendation over Enverus for courthouse instruments; commercial license/API to evaluate; the activation decision's "TexasFile-class" aggregator confirmed by name). Enverus/DI (the incumbent and cautionary tale: EOG scanned nine courthouses patent-to-2006, handed them to DI for a courthouse platform, and DI now sells services off EOG's investment while EOG plays catch-up; that story is both the competitor definition and our tenant-sovereignty pitch). INT.com demo gallery (the viz bar SLB was shown; Chris believes we clear it and that incumbent visualization is beatable).

## Roles named (input to Chris's journey-map work)

Field landman (title side, courthouse to bit turning), in-house landman (bit turning to plugging), lease analyst, title analyst, division order analyst, lease buyer/purchaser, broker (Herbert's former role, staffing contact for companies), geologist/geophysicist, engineer, mineral owner, working-interest owner, royalty owner. Chris's method call: define roles, pick the primary persona, map the user journey start to finish with emotional beats, and build from that; he wants agendas and role definitions before the expert calls.

## Next meetings queued

The EOG land-administration manager (attorney, the DOTO source) is available around 3:30 pm most days; Herbert will also pull in Garrett and wants Trace (operations perspective) so the picture is not one person's view. Chris and Nick both conditioned these on having an agenda and desired outcomes first. Pre-work owed: the role/journey skeleton drafted from this transcript.

## Ties to current build state

C7's Winkler method is exactly the run-sheet muscle this meeting priced; the incoming drilling title opinion and Texas DOTO extend the grading exemplar set from title-chain to pay-deck. The memorandum-grain honesty posture is the same commitment-#1 and gaps-as-gaps rule already ratified. "Impressa land / Impressa oil and gas" was spoken as the brand on this surface; the O&G product surface still has no decided name (og-twin is a repo name). The Bastrop scraping cadence was cited as the courthouse-ingestion pattern. TexasFile commercial evaluation is a new bizops item (pricing, ToS, derived-atom redistribution rights), same shape as the ICC agreement.
