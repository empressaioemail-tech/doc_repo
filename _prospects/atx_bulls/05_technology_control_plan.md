---
id: atx_bulls_05_technology_control_plan
title: Technology control plan — lead capture to tokenization, end to end
status: draft
last_updated: 2026-08-13
applies_to: portfolio
owner: nick
related: [atx_bulls_00_program_overview, 34_smartcity_smart_files_and_foundation (generalization thread), 80_adrs/adr_018_atom_contract_substrate_layer]
purpose: Maps every stage of the ATX Bulls pipeline to what runs on our stack versus what we integrate. This is the operator-control document - Nick stated 2026-08-13 that we control the technology end to end.
---

# Technology control plan

Nick's statement of scope (2026-08-13): control of the technology all the way from lead capture of people signing up to try out, through twinning, through fan monetization, through real estate tokenization.

## The pipeline, stage by stage

| Stage | What runs | Ours vs integrated |
|---|---|---|
| Lead capture (fans, tryouts, VIP) | One signup surface replacing scattered social and bare email list; every contact becomes a record with consent and source provenance | Ours (built on the existing capture patterns; fan graph as tenant-scoped records) |
| Fan graph and CRM | The registered audience as the persistent asset; segments (fan, founding member, tryout applicant, investor-interest) | Ours; light CRM sync out if Cody's staff want a familiar surface |
| Payments (rung 2 and 3 products) | Standard card checkout for deposits, memberships, merch links | Integrated (Stripe-class checkout; our Circle-backed rails available where they earn their place) |
| Founding Member pass | Numbered, revocable, perk-carrying digital membership in the fan's account | Ours (the access-pass pattern; chainless in v1 by design) |
| Athlete twins | A1 protocol capture, evidence-attached measurements, consent per data class, athlete-shared records | Ours (the substrate; this is the first production human-twin run) |
| Fan content from twins | Verified stat cards, testing-day media to members | Ours (twin data rendered as fan product) |
| Stadium twin | Siting intelligence, entitlement state, feasibility record, construction capture, operations twin | Ours (originate-mode twin; Central TX data is live product) |
| Investor data room | The verifiable disclosure surface for team and stadium raises; documents plus living twin state; access-passed, watermarked, audit-trailed | Ours (the generalized Smart Files room; this engagement is a strong candidate for its first external deployment) |
| Securities issuance, cap table, KYC/AML, token rails | Funding portal or tokenization platform, transfer agent, KYC provider | Integrated, never ours. We feed the disclosure layer into whichever regulated platform counsel selects |
| Secondary trading (if ever) | ATS venue | Integrated, never ours |

## The boundary in one sentence

Everything that captures, records, verifies, twins, discloses, or grants access runs on our stack; everything that issues, custodies, or trades securities is a regulated integration on the other side of a clean API line, receiving our disclosure layer and nothing else.

## Sequencing note

The stages are ordered so that each is independently valuable: capture pays for itself in rung 2 revenue, the pass funds the program, the athlete twins produce content and prove the pipeline, the stadium twin sells feasibility work before any raise exists, and the data room generalizes Smart Files with a real external customer. No stage depends on tokenization happening for the prior stages to have been worth building.

## Open items

1. Entity and commercial terms between us and Cody for this scope (Nick).
2. Signup surface scope and cutover from the current VIP email list (needs Cody's current list exported into the fan graph as founding records).
3. Checkout provider selection for rung 2 (fastest path wins; migration later is cheap).
4. Data room first deployment decision, coordinated with the Smart Files generalization thread from the 2026-08-13 ideation session.
