---
id: 2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment
title: WDLL amendment — PE uniform county coverage + R1 spine + gold list
status: approved
date: 2026-07-22
applies_to: legacy-design-tools, hauska-map (property-explorer), doc_repo
related: [2026-07-21_property_explorer_v1_sprint_WDLL, 2026-07-21_property_explorer_v1_sprint_STATUS]
owner: nick
---

# WDLL amendment — uniform coverage + R1 spine

Date: 2026-07-22  
Status: approved (operator: push map as far as possible before gold QA; include spine wire; atoms later; hold Pipedrive/Stripe)  
Amends: `_inbox/2026-07-21_property_explorer_v1_sprint_WDLL.md`

## Reason

Operator wants maximum Central-TX map completeness with the same treatment across counties before gold-parcel QA, plus R1 Property Brief spine wiring so Research this is testable without Stripe (dev paid entitlement bypass). Atoms/MCP remain deferred. ICC remains optional hold.

## Done looks like (added)

Every Central-TX county already in the PE parcel corpus receives the same bake pipeline: tier1 envelopes where jurisdiction+setbacks resolve, honest decline codes elsewhere, tier2 roads where Overpass private mirror answers, FEMA where already verified. Bastrop form-based P-codes no longer mis-map to Public/Institutional. An entitled (dev-paid) signed-in user can run R1 and get a cited brief + layer-manifest layers from spine (or honest degrade with real spine error, never empty scaffold forever). A gold parcel list exists for operator QA after this push.

## Acceptance items (additive; cite these on PRs)

42. Dev paid entitlement bypass for operator Google identity (or `PE_DEV_PAID_SUBJECTS` allowlist) — no Stripe required for Research this | check: signed-in deep brief route returns non-402 for allowlisted user | grade: [ ]
43. Bastrop (and any sibling form-based P-1..P-5) district mapping fixed — no prefix collapse to Public/Institutional | check: live `48021:33512` (or successor) envelope district matches Bastrop place-type table; buildable % not forced-zero by wrong district | grade: [ ]
44. Setback tables: every city with live zoning on Central-TX PE either has populated gated table OR cited honest-empty — same standard all counties | check: inventory file + sample live probe per city key | grade: [ ]
45. Uniform tier1 rebake across all Central-TX county FIPS already in corpus (Comal remains honest gap item 11) | check: bake logs exit 0 per county; aggregate envelope status table filed | grade: [ ]
46. Uniform tier2 `--enable-roads` rebake across those same counties against private Overpass | check: each county has ≥1 live node with `roadSignalUsed:true` OR documented Overpass miss with county FIPS | grade: [ ]
47. Zoning GIS paint inputs equalized where county GIS serves codes — document counties that remain flat-orange because source lacks zoning attrs (not a paint bug) | check: short ledger of county → zoning-attr present/absent | grade: [ ]
48. R1 Property brief spine wire: paid deep POST returns cited brief (or spine-honest error), not permanent `report_not_ready` scaffold | check: live entitled probe on known parcel; citations present | grade: [ ]
49. R1/R2 layer-manifest populated from report result (envelope + flood when present) | check: manifest layers non-empty on successful R1/R2 run | grade: [ ]
50. Gold parcel QA list filed (≥15 parcels across ≥5 counties) — operator QA after bake push | check: `_inbox/2026-07-22_pe_gold_parcel_qa_list.md` exists | grade: [ ]

## Explicit holds

- Pipedrive / Stripe live checkout — operator hold
- Microsoft OIDC — optional later
- ICC credentials — optional WDLL 31
- Wave 6 atoms/MCP — deferred
- Comal fabricated coverage — still forbidden (item 11)

## Amendments log

- 2026-07-22: items 42–50 added because operator ordered max coverage equalization + spine wire before gold QA; Stripe/Pipedrive held.
