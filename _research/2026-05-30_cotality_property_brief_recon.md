---
date: 2026-05-30
author: cursor-auto (doc_repo planner)
type: recon
applies_to: portfolio
related: [76c_operator_master_next_steps, 75c_property_brief_data_backlog, 77_place_graph_strategy, _decisions/2026-05-23_partnership_first_scoping, _sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C2, _inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff]
test_address: "1904 Heathwood Cir, Round Rock, TX 78664"
sources:
  - https://www.cotality.com/our-data
  - https://www.cotality.com/platforms/mcp-server
  - https://www.cotality.com/data-library
  - https://www.cotality.com/products/property-characteristics
  - https://www.cotality.com/products/parcel-data
  - https://trestle-documentation.corelogic.com/
  - https://trestle-documentation.corelogic.com/webapi-reference.html
  - https://api.cotality.com/trestle/Documentation/MetaData/Resource/Property
  - https://docs.trestleiq.com/api-reference/reverse-address-api
  - https://dlthub.com/context/source/trestle-api
  - https://www.esri.com/partners/cotality-a2T70000000TNNrEAO/spatial-record-natio-a2d39000001QqTIAA0
status: recommendation-pending-operator
---

# Cotality recon — Property Brief / place graph (2026-05-30)

> **TL;DR:** Cotality is **not one API** — it is a portfolio. **What Property Brief needs** (parcel polygon + zoning at an arbitrary address) lives in **Property Characteristics / Parcel / SpatialRecord / MCP**, which is **sales-gated** (no public OpenAPI, no self-serve pricing). **What is publicly documented** is mostly **Trestle MLS OData** (listings, not national parcel fabric) and **Trestle IQ** (identity/people at an address, not zoning). Cotality can be **deeper** than Regrid on ownership, tax, valuation, climate, and MLS — but it is **not automatically better** for the extension brief path until you have credentials for the assessor-grade SKU and a license that allows consumer display. Finish Regrid debug first; ask sales specifically for **Property Characteristics API or MCP**, not generic "Trestle."

---

## 1. Why we looked

Property Brief prod smokes show `regrid:parcels` / `regrid:zoning` = `no-coverage` on Round Rock (`1904 Heathwood Cir`). Handoff flagged Cotality (formerly CoreLogic property data umbrella) as alternate national parcel/MLS/hazard source with **MCP Server** aligned to Hauska substrate story.

**Question:** Should Hauska integrate Cotality alongside or instead of Regrid for Plane C (parcel economics) on the place graph?

---

## 2. Cotality product map (relevant SKUs)

| Product | What it covers | Property Brief plane | Delivery |
|---------|----------------|----------------------|----------|
| **Property Characteristics** | 154M+ properties: parcel, owner, structure, tax, geospatial, recent sale | **C** (+ partial **F**) | API, MCP, Snowflake, GCP, Databricks, Araya |
| **Parcel Data** | 250+ attributes: boundaries, ownership, zoning, tax, environmental/financial | **C**, **B** hints (liens) | API, bulk, marketplaces |
| **SpatialRecord** | ~150M parcel polygons + ~150 elements (ownership, land use/zoning, legal desc, building) | **C** | Esri Enterprise / partner feeds |
| **PxPoint™** | Parcel + structure-level analytics | **C** | Data library |
| **Zoning Data** | Parcel-level zoning (explicit SKU in data library) | **C** | API / MCP (bundle unclear) |
| **CLIP®** | ML property ID across datasets | **Join key** (like Regrid `ll_uuid`) | MCP asset #1 |
| **Climate Risk Analytics** (acute + chronic) | Hazard scores vs FEMA NFHL | **D** (overlap) | MCP asset (marketing says 3–4 MCP assets) |
| **HPI™ / THVˣ / ListingTrends** | Valuation, MLS-adjacent market | **F** (deferred in backlog) | MCP Market Analytics |
| **Trestle™** | MLS / listing WebAPI (`api.cotality.com` migration) | **F** | Separate MLS licensing |
| **Address Connect** | US address intelligence | Geocode quality | API |
| **Owner Transfer / Voluntary Lien** | Sales, lien presence | **B** / minerals adjacency | Bulk/API |

**MCP Server (launched ~March 2026 per press):** Universal connector; marketed assets include **CLIP**, **Property Details** (Characteristics), **Market Analytics**; some pages also list **Climate Risk Analytics** as fourth MCP asset. Requires **Request demo / Login** — no public endpoint URL or tool schema in marketing pages.

**AI-ready packaging:** Property 360 datasets ship with **OSI semantic companion YAML** so agents interpret fields without custom mapping. Hauska atom contract could consume similar semantics if licensed.

---

## 2b. API surface map — what is gated vs explorable without sales

Cotality is often described as "gated." That is only half true. There are **four distinct API lanes** under the Cotality umbrella:

| Lane | Base URL / docs | What it actually returns | Public docs? | Credentials | Fit for Property Brief? |
|------|-----------------|--------------------------|--------------|-------------|-------------------------|
| **A — Assessor / parcel fabric** (Property Characteristics, Parcel Data, SpatialRecord, **MCP Server**) | Marketing → "Developer Portal" / demo | National parcel boundaries, CLIP, assessor ownership, tax, structure, **parcel-level zoning SKU** | Product pages only; **no OpenAPI in public web** | **Sales / enterprise contract** | **Yes — this is the Regrid competitor** |
| **B — Trestle MLS OData** | `https://api.cotality.com/trestle/odata` · [WebAPI reference](https://trestle-documentation.corelogic.com/webapi-reference.html) · [Property field dictionary](https://api.cotality.com/trestle/Documentation/MetaData/Resource/Property) (browse without auth) | **RESO listing records** (`Property` entity, ~500+ fields). Primary key = `ListingKey`. Includes lat/long, `ParcelNumber`, `Zoning`, `ZoningDescription`, `CLIP`, tax fields, `OwnerName`, `TaxLegalDescription`, lot size, etc. — but **only when an MLS listing exists** for that property | **Yes — full OData schema published** | OAuth2 client_credentials → `POST .../trestle/oidc/connect/token` (need Trestle MLS subscription) | **Partial** — great for on-market listings; weak for arbitrary Zillow address with no MLS row |
| **C — Trestle public records** (Trestle 5.0+) | Same WebAPI host; resources named in release notes | `PropertySearch`, `LastMarketSale`, `Owner`, `Buildings`, `Site`, `Location`, `TaxAssessment`, etc.; `$expand=PublicRecordPropertySearches` from `Property` | Mentioned in [Trestle 5.0 release notes PDF](https://trestle-documentation.corelogic.com/release_notes/Trestle%205.0%20Release%20Notes.pdf); **resource metadata not all browsable** (e.g. PropertySearch 404 on doc site) | Same Trestle credentials + product entitlements | **Strong** for ownership/tax/legal desc if entitled — still not GeoJSON parcel polygon by default |
| **D — Trestle IQ** (identity) | `https://api.trestleiq.com` · [Reverse Address 3.1](https://docs.trestleiq.com/api-reference/reverse-address-api) | Address validation, lat/long (accuracy enum), **current residents / demographics** — not parcel polygon or zoning | **Yes — full REST docs + self-serve wallet language** | `x-api-key` (trial tier exists per docs) | **No** — wrong product (people intelligence, not site context) |

**Live call test:** `GET https://api.cotality.com/trestle/odata/$metadata` returns **401** without token — schema is public via HTML metadata browser, not anonymous OData.

### What Trestle `Property` actually exposes (documented, MLS-shaped)

From the public [Property resource metadata](https://api.cotality.com/trestle/Documentation/MetaData/Resource/Property) (783 lines, RESO DD). Fields relevant to Brief — **if a listing matches your address**:

| Field | Type | Brief use |
|-------|------|-----------|
| `CLIP` | Int64 | Stable property ID (10-digit, lifecycle-persistent per Cotality) |
| `Latitude` / `Longitude` | Decimal | Geocode (listing point, not full parcel polygon) |
| `ParcelNumber` | String | APN / county parcel id |
| `UniversalParcelId` | String | Cross-system parcel id |
| `Zoning` / `ZoningDescription` | String | Short code + text (MLS-entered; not same as Regrid standardized `zoning_type`) |
| `LotSizeAcres` / `LotSizeSquareFeet` | Decimal | Lot size |
| `OwnerName` / `Ownership` | String | Owner (listing-side; may differ from assessor) |
| `TaxLegalDescription` / `TaxLot` / `TaxBlock` | String | Legal description (up to 6000 chars on `TaxLegalDescription`) |
| `TaxAssessedValue` / `TaxAnnualAmount` | Int/Decimal | Tax layer |
| `TaxYear` | Int32 | Assessment vintage |

**Not found on Trestle Property metadata:** GeoJSON parcel polygon, standardized nationwide `zoning_type` taxonomy, or guaranteed coverage for off-market addresses.

Example OData patterns (from public reference):

```http
GET /trestle/odata/Property?$filter=PostalCode eq '78664' and contains(StreetName,'Heathwood')&$top=10
Authorization: Bearer <trestle_token>
```

```http
GET /trestle/odata/Property?$filter=CLIP eq 1234567890
```

Replication for bulk MLS sync: `.../Property?replication=true` (pages past 1M records).

### What the MCP Server likely wraps

Marketing says MCP tools surface **CLIP**, **Property Details**, **Market Analytics**, and sometimes **Climate Risk**. That aligns with **Lane A** products, not raw MLS OData. **Tool names, request schemas, and rate limits are not published** without demo access — this part **is** a gated exercise.

### Clarifying "better than Regrid"

| Dimension | Regrid | Cotality (realistic) |
|-----------|--------|----------------------|
| **Point-in-parcel geometry** | Core product — GeoJSON polygon API | **Lane A** (SpatialRecord / Parcel Data) — needs enterprise contract; Trestle does not expose polygon in public Property schema |
| **Zoning at arbitrary address** | `zoning_type` / `zoning_subtype` (Premium) | **Zoning Data SKU** (Lane A) or MLS `Zoning` fields (Lane B, listing-dependent) |
| **Off-market / extension scrape** | Designed for lat/lng lookup | Trestle requires **matching listing**; assessor SKU may work off APN/address — **must ask sales** |
| **Ownership + tax + legal desc** | Thin on parcel record | **Strong** on Property Characteristics + Trestle public records expand |
| **Valuation / HPI** | No | THVˣ, HPI (Lane A / MCP) |
| **MLS photos / status / price** | No | Trestle Property + Media |
| **Self-serve dev access** | Yes | **Lane A/MCP: no** · **Lane B: MLS fee** · **Lane D (IQ): yes but wrong data** |
| **Docs depth without credentials** | OpenAPI + schema site | **Split** — MLS fully documented; assessor/MCP not |

**Conclusion:** Cotality is "better" only for the **datasets you have contracted**. For the current Brief architecture (POST address → site context layers), **Regrid is the correct v1 adapter shape** unless Cotality sells you **address-keyed Property Characteristics or MCP** with polygon + zoning entitlements.

---

## 3. Integration paths (ranked)

| Rank | Path | Pros | Cons | Effort |
|------|------|------|------|--------|
| **1** | **Hauska MCP Server → Cotality MCP** (federated) | Matches MCP-first thesis; no duplicate parcel REST in api-server; governed enterprise contract | Two MCP hops; Cotality tool schema unknown; metering/rev-share with Cotality TBD | Medium (M cc-agent-M) after sales POC |
| **2** | **Direct REST adapter** `cotality:parcels` + `cotality:zoning` in `legacy-design-tools` | Same pattern as Regrid (`lib/adapters/src/national/`); brief `siteContext.layers[]` unchanged | Custom integration; loses Cotality MCP governance story | ~1–2 weeks cc-agent-C after OpenAPI |
| **3** | **Bulk / Snowflake / GCP** warm path | Good for Neon-style corpus cache | Wrong for real-time extension brief; ops heavy | High |
| **4** | **Trestle MLS only** | Listing enrichment | Not parcel polygon; MLS license separate from Property Characteristics | Medium |

**Not recommended now:** Replace Regrid in production before (a) Regrid paid-tier verification and (b) Cotality pilot contract clarifying **browser extension redistribution**.

---

## 4. Field mapping — Cotality vs Property Brief needs

Test address for pilot parity: **1904 Heathwood Cir, Round Rock, TX 78664** (`round_rock_tx`).

| Brief need | Regrid today (`regrid:parcels`, `regrid:zoning`) | Cotality (expected) | Notes |
|------------|-----------------------------------------------|---------------------|-------|
| Parcel polygon GeoJSON | `payload.parcel.geometry` | SpatialRecord / Parcel Data boundaries | Cotality Esri copy cites 150M+ polygons |
| Stable parcel ID | `ll_uuid` | **CLIP** | Graph join primitive per [`77_place_graph_strategy.md`](../77_place_graph_strategy.md) |
| Zoning code / type | `zoning`, `zoning_type`, `zoning_subtype` | **Zoning Data** + land use layers | Regrid Premium standardized fields; Cotality has dedicated zoning SKU |
| Acres / lot size | `gisacre` etc. | Property Characteristics | |
| Owner name (display) | Limited on Regrid parcel | Property Characteristics ownership | Broker-visible; cite source |
| Assessed value / tax | Limited | Property Characteristics tax | Plane C |
| Last sale | Limited | Transaction history | Plane F (backlog deferred) |
| Flood | **FEMA** adapter (working) | Climate Risk Analytics | **Overlap** — do not double-bill; pick one primary flood narrative |
| EPA EJScreen | CalEPA mirror (working) | N/A | |
| Building code | Neon local corpus | N/A | ICC track separate |
| HOA / CC&R | Encumbrance upload (dev) | Voluntary Lien / restrictions index weak | Cotality not a substitute for county clerk MOU |

**Consumer extension contract** (from Regrid eval): `overlays.ts` is the structured consumer; needs GeoJSON Polygon on `payload.parcel.geometry` / `payload.zoning.geometry`. Any Cotality adapter must emit the **same shape** or extend `overlays.ts` once.

---

## 5. Cotality vs Regrid (decision matrix)

| Criterion | Regrid | Cotality |
|-----------|--------|----------|
| **Self-serve API** | Yes — trial + ~$500–2k/mo plans ([eval](../_sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C2.md)) | **No** — contact sales, demo-gated |
| **Already integrated** | **Yes** — PR #104, prod secret mounted | No |
| **Zoning for brief** | Standardized `zoning_type` (Premium) | Zoning Data SKU (details behind sales) |
| **Coverage claim** | 159M parcels, 99% US pop | 5.5B property records / 154M+ characteristics |
| **MCP native** | No (REST only) | **Yes** — marketed March 2026 |
| **MLS / listing** | No | Trestle (`api.cotality.com`) — separate product |
| **Valuation / HPI** | No | Yes (THVˣ, HPI) |
| **Climate / hazard** | No | Yes — may overlap FEMA |
| **Partnership-first fit** | National aggregator — in scope per ADR scoping | Enterprise licensor — **needs rev-share / agent-use clause** like ICC |
| **Time to first smoke** | Hours (fix API key tier) | Weeks (sales cycle) |

**Verdict:** Regrid remains **v1 national baseline** for Plane C. Cotality is **upsell / enterprise lane** when Regrid coverage or attribution is insufficient, or when broker wedge needs ownership + valuation + climate in one vendor.

---

## 6. Licensing and GTM risks (must ask sales)

Parallel to ICC call concerns:

1. **Consumer browser extension** — May agents display Cotality-derived fields to end users (brokers) without per-seat Digital Codes-style licenses?
2. **Agent retrieval metering** — Can Hauska meter queries and pay Cotality on usage (Hauska SDK story)?
3. **Attribution** — Required footer / provider string on every brief field?
4. **Caching** — 24h `adapter_response_cache` pattern allowed?
5. **Sub-licensing** — Can Hauska expose via MCP to third-party agent builders?
6. **Geographic pilot** — Texas-only pricing vs national (ICC used regional scope model).

**Do not scrape or use Snowflake marketplace data without contract** — partnership-first applies to operational city data; national commercial feeds still need explicit license.

---

## 7. Sample parcel test plan (operator / sales)

No API credentials in repo — **cannot run live compare in this recon.**

When Cotality grants pilot access:

| Step | Regrid | Cotality |
|------|--------|----------|
| 1 | `GET` parcel+v2 point query @ lat/lng for test address | MCP tool or API lookup by address → CLIP |
| 2 | Record polygon WKT/GeoJSON, zoning fields, `ll_last_refresh` | Record boundary, zoning class, vintage, CLIP |
| 3 | POST prod `/api/brokerage/v1/brief` — note `regrid:*` layer status | N/A until adapter |
| 4 | Score: broker-visible lift (zoning text, acres, owner) | |
| 5 | Cost: $/1k queries estimate from sales | |

**Success bar for pilot:** Cotality returns **ok** parcel polygon + zoning where Regrid returns `no-coverage`, with refresh date ≤ 12 months, and license allows extension display.

---

## 8. Recommendation

| Horizon | Action |
|---------|--------|
| **This week** | Debug Regrid `no-coverage` (token tier, live API vs archive) — see [`76c_operator_master_next_steps.md`](../76c_operator_master_next_steps.md) §2A |
| **Next 2 weeks** | Operator calls Cotality sales **(866) 774-3282** with this recon; request: MCP sandbox, Property Characteristics + Zoning Data, Texas pilot pricing, extension + agent-use terms |
| **If pilot approved** | cc-agent-M: MCP tool inventory + probe script; cc-agent-C: spike `cotality:parcels` adapter OR federate via hauska-mcp-server |
| **Defer** | Trestle MLS, bulk Snowflake, climate layer until FEMA narrative product decision |

**Do not block** Chrome Web Store or ICC POC on Cotality.

---

## 9. Suggested sales call script (60 sec)

"We run a cited property intelligence brief for Texas brokers — parcel, zoning, flood, local code. We already use Regrid for parcel geometry but hit coverage gaps. We're evaluating Cotality for CLIP-stable joins, zoning, and ownership on the same MCP-first stack we use for jurisdictional code. We need a Texas-scoped pilot: MCP or API access, usage-based pricing compatible with agent retrieval, and clear terms for displaying fields in a consumer browser extension. Can you scope Property Characteristics + Zoning with MCP access and a 90-day eval?"

---

## 10. Dispatch stub (when pilot creds exist)

```yaml
# Future: _dispatches/2026-05-XX_cc-agent-C_cotality_brief_adapter_spike.md
Goal: One address smoke — Cotality → siteContext layer shape matching regrid layers
Gate: Signed pilot + API or MCP credentials in Secret Manager
Allowlist: lib/adapters/src/national/cotality.ts, overlays.ts, brokerageSiteContext.ts
```

---

## 11. What you can do without a Cotality sales call

| Action | Gate |
|--------|------|
| Read full Trestle `Property` field list | **Open** — https://api.cotality.com/trestle/Documentation/MetaData/Resource/Property |
| Read OData query patterns (`$filter`, `$expand`, replication) | **Open** — https://trestle-documentation.corelogic.com/webapi-reference.html |
| Probe Trestle IQ Reverse Address API shape | **Open docs** — need API key to execute (self-serve portal per docs) |
| Call assessor-grade Property Characteristics by address | **Gated** |
| Inspect MCP tool schemas | **Gated** (demo) |
| Compare Round Rock parcel polygon to Regrid | **Gated** for Cotality; Regrid needs your existing key |

## 12. Questions to ask sales (precise)

1. For **1904 Heathwood Cir, Round Rock TX 78664**, which product returns parcel **polygon** + **zoning** without an active MLS listing?
2. Is that **Property Characteristics REST**, **PxPoint**, **SpatialRecord API**, or **MCP** — and is there an OpenAPI spec?
3. Does a **Trestle MLS** subscription alone include assessor parcel fabric, or only listing fields?
4. Are **public records** resources (`PropertySearch`, `TaxAssessment`, etc.) included in a Texas pilot, and can we query by address/APN?
5. Extension redistribution: may a **consumer Chrome extension** display fields to brokers under agent/usage pricing?
6. Can Hauska meter queries and pass through revenue share (ICC-style)?

## 13. Revision

- **2026-05-30:** Initial recon from public Cotality/CoreLogic marketing, data library, MCP launch materials, Regrid eval session, Property Brief handoff. No live API call.
- **2026-05-30:** Deep dive — four API lanes (assessor/MCP vs Trestle MLS vs public records vs Trestle IQ); public Property metadata scraped; clarified "better than Regrid" is product-specific not universal.
