---
id: 77a_txcrg_crm_and_brokerage_ops
title: Texas Commercial Realty Group — CRM wedge and lead operations
status: draft
last_updated: 2026-05-27
applies_to: portfolio
related: [77_place_graph_strategy, 75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, 76_empressa_wedge_90d_operating_plan, 18_stakeholder_graph, 74_commercial_agreements]
owner: nick
---

# Texas Commercial Realty Group — CRM wedge and lead operations

> **Purpose.** Capture operator requirements for **Texas Commercial Realty Group (TX CRG)** as a distinct GTM and systems wedge from the eXp / Valerie / Matrix track in [`75_hauska_brokerage_workflow_plan.md`](75_hauska_brokerage_workflow_plan.md). Defines CRM needs, lead lifecycle, and integration with the place graph (address in Google → brief + CRM contact).
>
> **Entity note.** TX CRG is a Legacy Group ATX operating company concern. Hauska substrate serves cited intelligence; CRM may be Salesforce, a slim custom stack, or phased build—decision open.

## Problem (from operator conversation, 2026-05-27)

TX CRG spends on **Google Ads**; leads arrive at a shared inbox (`@txcrg`). There is no reliable system to:

- Capture inbound email as a **lead** automatically  
- Assign accountability (“Ron Brown / Herbert Melton—did you take this?”)  
- Progress **lead → prospect → client → under contract** with contract dates (option period, closing, indefeasibility, 30-day close, etc.)  
- Run light **nurture** (seasonal touch: thanks, holidays, Memorial Day) without manual one-off Outlook mail  

One partner experiments with **Salesforce** but cannot operationalize auto-contact creation from inbound mail. The principal operator maintains personal **Microsoft Access** contact DBs (real estate + oil & gas variants) synced to Outlook—works for one user, not for partners.

**Desired flow:** Research a property on **Google** (address) → one action pushes context into **CRM** as seller or buyer prospect → automated or templated outreach (“Thanks for contacting TX CRG…”) → track through contract milestones.

## Relationship to Hauska Property Brief / extension

| Capability | TX CRG need | Hauska surface |
|------------|-------------|----------------|
| Address research | Google → website, zoning curiosity | Browser extension / brief: cited layers + **mineral index flag** on legal description ([`77_place_graph_strategy.md`](77_place_graph_strategy.md)) |
| Contact capture | CRM record | **Push to CRM** (integration target—not yet built) |
| Nurture | Seasonal email | CRM or marketing automation (out of scope for substrate v1) |
| Contract tracking | Dates and stages | CRM native; substrate does not replace |

**Not in scope for v1 CRM:** Replacing Access for O&G division-order accounting, production tracking, or full land-admin title chains ([`77_place_graph_strategy.md`](77_place_graph_strategy.md) O&G landing pad).

## Lead lifecycle (proposed model)

| Stage | Definition | System signals |
|-------|------------|----------------|
| **Inbound** | Email/web form/call logged | Auto-create from `leads@txcrg` (or SF Email-to-Case) |
| **Lead** | Qualified interest; owner assigned | SLA: partner claims in 24h |
| **Prospect** | Active pursuit (seller/buyer/landlord typed) | Activity log + brief attached |
| **Client** | Engagement letter / representation | Link to deals |
| **Under contract** | Executed contract | Option/close dates, reminders |

**Roles mentioned:** Ron Brown, Herbert Melton (partners); principal operator (Access/Salesforce experimenter).

## Integration requirements (v1 wish list)

1. **Address → CRM:** From extension or web UI: create Contact + Opportunity stub + attach Property Brief run ID.  
2. **Seller vs buyer (and land/mineral interest type):** Typed prospect—not one-size “lead.”  
3. **Google Ads attribution:** UTM / source field on inbound lead.  
4. **Email ingest:** Salesforce (or equivalent) creates contact from `leads@txcrg` with dedupe.  
5. **Mineral flag on property:** When brief runs, store `mineral_index_status: hits | clear | unknown | county_not_online` on the property record.

## Build vs buy

| Option | Pros | Cons |
|--------|------|------|
| **Salesforce + integrator** | Mature automation, Email-to-Lead patterns | Cost, partner cannot admin today |
| **HubSpot / Pipedrive** | Faster for small team | Still integration work with Hauska |
| **Lightweight custom (Hauska-adjacent)** | Tight brief + graph integration | Not Hauska spine rule unless productized |
| **Access + Outlook (status quo)** | Works for one user | Does not scale to partners |

**Recommendation (planner, 2026-05-27):** **Salesforce-light configuration project** for TX CRG (operator hires fractional admin or Valerie-class ops help), with **Hauska extension providing address → brief + CRM deep link** as the intelligence layer—not building a full CRM inside hauska-engine in 90 days.

## Hauska spine check

| Rule | Result |
|------|--------|
| Feeds place graph | Yes—every brief run exercises substrate |
| Hauska Inc. commercial | Optional—TX CRG CRM is operator/Legacy Group unless productized |
| Focus queue | Does not displace ICC week, G3 dossier MCP, or Sync 5 ledger |

## Open decisions

| ID | Question | Owner |
|----|----------|-------|
| TX-1 | Salesforce vs alternative for TX CRG | Nick |
| TX-2 | Who administers CRM (partner vs contract vs Valerie network) | Nick |
| TX-3 | Is TX CRG a paid pilot for Property Brief + CRM glue | Nick |
| TX-4 | Mineral index on brief: TX CRG-only first vs catalog feature | Nick |

## Revision history

- **2026-05-27:** Filed from operator voice conversation (CRM, Google leads, Access DB, minerals on brief, data-center/mineral buyers, legal description).
