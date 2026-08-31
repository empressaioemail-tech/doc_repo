---
id: 2026-07-28_vertosoft_govcloud_competitive_scan
title: Vertosoft GovCloud storefront — competitive landscape scan
status: research
date: 2026-07-28
applies_to: hauska, empressa, bizops, marketplace listing prep
source: https://govcloud.storefront.vertosoft.com/
owner: nick
---

# Vertosoft GovCloud storefront — competitive landscape scan

Live scrape of Vertosoft's AWS Marketplace private storefront for public-sector procurement ([govcloud.storefront.vertosoft.com](https://govcloud.storefront.vertosoft.com/)), captured 2026-07-28. Treat as a competitive landscape snapshot for listing prep, not a Vertosoft partner brief.

## Bottom line

35 active listings across 24 ISVs in the filter rail. The catalog is dominated by cybersecurity, DevOps/platform tooling, horizontal data/AI platforms, and HR SaaS. There is no listing that looks like jurisdictional code intelligence, property reasoning, parcel/site planning, or AEC plan review.

Nearest adjacency:

- **GridMatrix** — only smart-city flavored listing (traffic / signal / emissions dashboard), not zoning, parcels, or plan review.
- **Seerist** — risk intelligence with AI plus human analysis; overlaps "reasoning about the physical world" only at a high level.
- **Collibra / Databricks / Qlik / Strategy (MicroStrategy)** — horizontal data intelligence. Useful comps for marketplace packaging language, not for product category.

MongoDB appears in the ISV filter with zero visible product cards today.

## Snapshot stats

| Metric | Count |
| --- | ---: |
| Active listings | 35 |
| ISVs in filter | 24 |
| Private offer only | 27 (~77%) |
| Open / non-private listings | 8 |

## Category mix

Grouped from listing titles and AWS category tags on the live cards.

| Category | Listings |
| --- | ---: |
| Security | 11 |
| DevOps / Infra | 11 |
| Data / Analytics | 6 |
| AI / ML | 4 |
| HR / Workforce | 4 |
| ProServ | 2 |
| Smart City | 1 |
| Risk / Intel | 1 |
| CMS | 1 |

## Procurement rails on the storefront

Contract filters available to buyers on this Vertosoft private marketplace. Texas DIR is the highest-leverage overlap for Empressa / Hauska TX GTM.

- Texas DIR
- GSA MAS IT-70
- Sourcewell Cooperative
- TIPS Cooperative
- NCPA - OMNIA Partners
- CMAS
- 2GIT BPA
- ITES-SW2

Also present: an ADVANA program filter alongside ISV and contract filters. AWS fulfillment-type filters include SaaS, Professional Services, AMI, Container Image, Helm Chart, SageMaker Model/Algorithm, Data Exchange, CloudFormation Template, and related packaging forms. Pricing models on the rail: Upfront Commitment, Usage Based, Free, Bring Your Own License, Recurring Fee.

## Listing craft patterns that dominate

1. About 77% of listings are tagged **[Private Offer Only]**. Buyers contact for custom pricing / EULA rather than self-serve cart checkout.
2. Naming convention is almost always "[Product] for Public Sector" or "… for Government".
3. Fulfillment is overwhelmingly SaaS. Vertosoft itself lists ProServ (AI Launchpad + Managed Services).
4. Several non-private cards use "Deployed on AWS" rather than a bare SaaS badge (Cornerstone, Helios Ed).

## All offerings by ISV

Summaries truncated from storefront short descriptions.

| ISV | Offering | Lane | What it is | Offer |
| --- | --- | --- | --- | --- |
| AI Squared | Predictive and Generative AI Integration Platform for Public Sector | AI / ML | Accelerates AI adoption; integrates GenAI and predictive insights into front-end apps with business-user feedback loops. | Listed |
| Automation Anywhere | Automation Success Platform for Public Sector | AI / ML | RPA / automation platform. Transacts solely via private offer; custom pricing and EULA. | Private only |
| BeyondTrust | BeyondTrust for Public Sector | Security | Identity security: detects threats and protects identities, access, and endpoints. | Private only |
| Claroty | Claroty xDome for Public Sector | Security | Cyber-physical systems (CPS) security for manufacturing, healthcare, and critical infrastructure. | Private only |
| Collibra | Collibra Data Intelligence Platform-Public Sector | Data / Analytics | Data intelligence / governance / catalog so orgs can trust and use data across sources and users. | Private only |
| Cornerstone | Workforce AI - Intelligence+ (AMER) | HR / Workforce | Agentic workforce decisions from skills, roles, learning, and performance signals. | Listed |
| Cornerstone | Workforce AI - Learn+, Elevate+ (AMER) | HR / Workforce | AI talent suite unifying learning, performance, and compliance. | Listed |
| Databricks | Databricks Data Intelligence Platform for Public Sector | Data / Analytics | Lakehouse data + AI platform; lists a 14-day trial with usage credits. | Listed |
| DataRobot | DataRobot AI Cloud Platform for Public Sector | AI / ML | End-to-end AI/ML MLOps platform. | Private only |
| Docker | Docker Business for Public Sector | DevOps / Infra | Enterprise container app-dev platform with management and security controls. | Private only |
| Fleet DM | Fleet Premium for Public Sector | Security | Open-source device / endpoint platform for IT and security (API, GitOps, YAML). | Private only |
| Gigamon | GigaVUE Cloud Suite BYOL | Security | Network visibility / fabric manager (BYOL private offer). | Private only |
| GridMatrix | Insights Web Dashboard for Public Sector | Smart City | Traffic analytics: congestion, signal performance, emissions, road safety (vehicular + pedestrian). | Private only |
| Harness | Cloud Cost Management for Public Sector | DevOps / Infra | FinOps / CloudOps automation to control cloud spend. | Private only |
| Harness | Continuous Delivery & GitOps - Public Sector | DevOps / Infra | CD / GitOps pipelines; ArgoCD-as-a-Service positioning. | Private only |
| Harness | Continuous Integration for Public Sector | DevOps / Infra | CI for faster, more secure code delivery. | Private only |
| Harness | Feature Flags for Public Sector | DevOps / Infra | Feature-flag force multiplier for software delivery. | Private only |
| Harness | Security Testing Orchestration Public Sector | DevOps / Infra | Security testing orchestration to ship secure apps with less rework. | Private only |
| Harness | Service Reliability Management for Public Sector | DevOps / Infra | Reliability / SRE tooling to raise deployment velocity and customer experience. | Private only |
| Helios (Vertosoft listing) | Helios Ed | HR / Workforce | Paperless K-12 workforce / HR management for schools and districts. | Listed |
| IBM | IBM StreamSets for Public Sector | Data / Analytics | End-to-end data integration / smart pipelines for hybrid and multi-cloud. | Private only |
| IBM | IBM Turbonomic App Resource Mgt for Public Sector | DevOps / Infra | AI hybrid-cloud cost optimization and app resource management. | Private only |
| OPSWAT | MetaDefender Cloud Prevention API - Public Sector | Security | File-borne threat prevention via multi-scanning and content disarm/reconstruction. | Private only |
| OPSWAT | MetaDefender Endpoint for Public Sector | Security | Endpoint compliance and peripheral-media protection for secure network access. | Private only |
| OPSWAT | MetaDefender ICAP Cloud for Public Sector | Security | File-upload security against malware, zero-days, and data breaches. | Private only |
| OPSWAT | MetaDefender Storage Security Cloud Public Sector | Security | S3 inspection for malware, zero-days, and sensitive data (real-time / scheduled). | Private only |
| Qlik | Qlik Sense Enterprise - SaaS for Public Sector | Data / Analytics | Self-serve BI / interactive visualizations for org-wide insight discovery. | Private only |
| Seerist | Seerist Risk Intelligence Software | Risk / Intel | Threat and risk intelligence combining AI with human analysis from global sources. | Private only |
| SIMPPLR | Simpplr One employee experience platform | HR / Workforce | AI intranet: multi-channel comms, personalized content, unified search, embedded integrations. | Listed |
| Spectro Cloud | Spectro Cloud Kubernetes Management Public Sector | DevOps / Infra | Kubernetes management anywhere ("run Kubernetes your way"). | Private only |
| MicroStrategy (listed as Strategy) | Strategy Cloud for Government | Data / Analytics | Enterprise AI analytics with gov data governance/security; FedRAMP-framed listing. | Private only |
| Tricentis | Tricentis Continuous Testing Platform Public Sector | DevOps / Infra | Automated, codeless, AI-driven enterprise software testing platform. | Private only |
| Vertosoft | Vertosoft AI Launchpad | ProServ | Professional services to help agencies accelerate ML/AI adoption. | Listed |
| Vertosoft | Vertosoft Managed Services | ProServ | Managed services supporting supplier partners in the AWS ecosystem. | Listed |
| WordPress VIP | WordPress VIP Content Management for Government | CMS | FedRAMP Moderate managed WordPress for federal/state/local digital experiences. | Listed |

## ISV filter roster (24)

Exact names from the left-rail ISV filter:

AI Squared, Automation Anywhere, BeyondTrust, Claroty, Collibra, Cornerstone, Databricks, DataRobot, Docker, Fleet DM, Gigamon, GridMatrix, Harness, IBM, Microstrategy, MongoDB (no listing), OPSWAT, Qlik, Seerist, SIMPPLR, Spectro Cloud, Tricentis, Vertosoft, Wordpress VIP.

## Implications for Hauska / Empressa listing prep

1. **Category white space is real.** No peer on this storefront sells jurisdictional intelligence, property atoms, setbacks/site plans, or code-reasoning as a product. Positioning should not borrow security or generic "AI platform" language from the dominant cohort.
2. **Private-offer is the norm.** Expect Vertosoft / AWS private-offer mechanics rather than a fully public self-serve SKU at first listing.
3. **Name like the catalog.** Prefer a clear "… for Public Sector" / "… for Government" title pattern so buyers scanning the grid understand the buyer.
4. **Texas DIR is the contract story that matters most** among the rails exposed here for TX city / state GTM.
5. **Useful packaging comps, not product comps:** Collibra ("Data Intelligence Platform"), Databricks ("Data Intelligence Platform"), Strategy Cloud ("… for Government" + FedRAMP framing), WordPress VIP (FedRAMP Moderate called out in the short description).

## Method note

Captured from the live Vertosoft GovCloud storefront UI after expanding "Show more" (35 product cards). Seller, title, short description, categories, and badges pulled from the page's listing objects. Not verified against each vendor's own public product page beyond the storefront card text.
