---
id: 2026-06-06_icc_code_connect_api_findings
title: ICC Code Connect API (ICC Content API v1.0.1) — integration findings
date: 2026-06-06
kind: research
source: ICC developer docs / api.iccsafe.org (retrieved via Comet 2026-06-06)
related: [49_code_ingestion_pipeline, 49a_layered_code_substrate, 73_partnerships, 77_place_graph_strategy, 80_adrs/adr_019_layered_code_substrate]
owner: nick
---

> **Where this fits.** ICC Code Connect is the technical surface of the ICC partnership (contract moving forward). It is the **plane A — public law / model codes** feed for the place graph (77) and the corpus source for **Codex** (building-code lookup + plan-review), distinct from Cotality (planes C/D/F — parcel/hazard/market). This is the authoritative capture of the API; pilot-stage, partner-gated, OAuth bearer. Pull the linked OpenAPI JSON + Postman collection (`api.iccsafe.org/docs/open.json`, `/postman_collection.json`) into `legacy-design-tools` vendor dir before building an ingest adapter.

---

# ICC Code Connect API integration findings

## Overview
The ICC Code Connect API is documented as **ICC Content API** version **1.0.1** and returns code book content in JSON, ranging from individual sections to entire chapters in one request. The API is currently in a pilot with select partners, requires registration plus a valid key for the interactive console, and is offered under a proprietary license.

## Commercial and access notes
- Product / program: **ICC Code Connect API**. Support: `api-support@iccsafe.org`. License: proprietary.
- Pilot with select partners — production availability, access terms, and endpoint stability subject to change.
- Interactive console: `https://api.iccsafe.org/docs/console.html` (registration + valid key required).
- Product page: `https://solutions.iccsafe.org/codeconnect`.

## Authentication
Every documented endpoint requires authorization; the auth section is described as **Client ID and Secret** plus **Email and Password**. Example requests use `Authorization: Bearer {OAuth Token}`, implying an OAuth-style token acquisition flow even though the token issuance endpoint is not exposed in the public docs. Integration must assume a prior token-exchange step outside the captured endpoint list; ICC-issued credentials + partner onboarding likely required before a live integration. The surface shown is content retrieval/search, not account provisioning.

## High-level capabilities
- **Titles** — lists assigned books/titles; navigates chapters/sections/subsections by qualified XML IDs.
- **Content** — retrieves specific objects: sections, tables, figures, equations, definitions, terms, promulgators, reference standards, whole chapters.
- **Images** — some images inline as base64 data URIs in content responses.
- **Search** — within one or multiple titles; v1 and v2 endpoints.
- **Notifications** — pushes title-mapping notifications to a client `POST` endpoint.

## Core endpoints
1. **GET `/v1/books`** — assigned titles. Param `with_count` (0/1). Response: top-level `collections[]`.
2. **GET `/v1/book/{bookId}/chapters`** — chapter listing (e.g. `bookId=IBC2018`). `with_count` adds section counts. Fields: bookId, chapters, backmatter, frontmatter, appendices, title, printing, responseId.
3. **GET `/v1/book/{bookId}/chapter/{chapterId}/sections`** — top-level sections (e.g. `chapterId=IBC2018_Ch05`). Fields: sectionId, bookId, chapterId, sections, responseId.
4. **GET `/v1/book/{bookId}/chapter/{chapterId}/list/{sectionId}`** — subsections (e.g. `sectionId=IBC2018_Ch05_Sec501`).
5. **GET `/v1/content/{contentId}`** — the key integration endpoint: resolves a fully-qualified XML ID, returns many object types (tables, sections, definitions, terms, promulgators, figures, reference standards, chapters, equations). Example IDs: `IBC2018_Ch01_SubCh01_Sec101.4`, `IBC2018_Ch35_PromAA_RefStdADM1_2015`, `IBC2018_Ch02_Sec202_DefACCESSIBLE`, `OHRC2019P2_Pt03_Ch08_Sec804.2.3_Tbl804.2.3`, `IPSDC2021P1_AppxA_SecA101.1_FigA101.1_1`, `IBC2018_Ch01`. Param `raw` (0/1). 200 success / 404 malformed-or-missing. Response schema is a **discriminated union** by content type (table-response, section-response, definition-response, subchapter-response, reference-standard-response, figure-response, promulgator-response, chapter-response).
6. **GET `/v1/search` and `/v2/search`** — JSON search; require `bookId` + `search`. v2 adds highlighted fragments. Params: bookId (single or bracketed multi, e.g. `[IBC2018P2,IBC2021P1]`), chapterOrdinal, contentType (codeSection/table/figure/appendix/chapter/definitions/subdefinition/promulgator/referenceStandard), contentOrdinal, contentId, search (quoted exact or unquoted), page (1), limit (10). 200 / 204 (no index) / 503 (query build error).

## Images / notifications / rate limiting
- **Images:** no separate binary endpoint; base64 data URIs (`data:image/jpeg;base64,...`) inside content; figure payloads carry filename, ordinal, xmlId, title, content, type.
- **Notifications:** ICC pushes to a client `POST` endpoint on title-mapping changes; payload `{client_id, mapped_titles:[{book_id, printing, title, access_start_date, access_end_date}]}`.
- **Rate limiting (only documented for `/v1/content/{contentId}`):** quota starts at **400 requests**, replenishes **200 every 2 min**, no accumulation above limit. `429` when exhausted; headers `X-RateLimit-Remaining`, `X-RateLimit-Retry-After`, `X-RateLimit-Limit`. Wrap content calls with backoff respecting `Retry-After`; prefer breadth-first traversal + caching for bulk ingest; throttle other endpoints conservatively (limits not stated for them).

## Schema observations & cautions
- Responses include `responseId` (useful for support tracing). Content payloads vary by type — model `/v1/content` as a discriminated union keyed on `type` + object-specific fields, not a rigid schema.
- Common metadata: xmlId, ordinal, ordinalClean, label, title, content, type, footnote. Figure: figure, filename. Hierarchy: sections / chapters / frontmatter / backmatter / appendices.
- Section/SubSection/Content responses may be **empty-but-successful** — treat as valid, not a parse failure.
- Books vary in hierarchy depth (chapters, appendices, back/frontmatter as separate collections); content may be tables/figures/base64, not plain text; treat IDs as opaque even though parseable.

## Linked assets
CSS `https://api.iccsafe.org/docs/stylesheet.css`; OpenAPI `https://api.iccsafe.org/docs/open.json`; Postman `https://api.iccsafe.org/docs/postman_collection.json`; Swagger Codegen reference.

## Suggested integration architecture
1. Acquire OAuth bearer via ICC-provided creds (flow not on the public docs). 2. `/v1/books` → assigned titles. 3. `/v1/book/{bookId}/chapters` → `/chapter/{chapterId}/sections` to build the tree. 4. `/list/{sectionId}` for subsection expansion. 5. `/v1/content/{contentId}` for the normalized node payload. 6. `/v2/search` for user-facing search (highlights). 7. Optionally register a notification `POST` endpoint for title-mapping changes.

## Normalized internal model (for the ingest adapter)
Book (bookId, title, printing, access dates, counts, raw); Chapter (chapterId, bookId, ordinal/title, counts, raw); Section node (sectionId/xmlId, bookId, chapterId, ordinal, title, type, child counts, raw); Content object (xmlId, type, ordinal, ordinalClean, label, title, content, footnote, media, raw); Search result (bookId, contentId/xmlId, type, ordinal, title/snippet, v2 highlights, raw).

## Gaps requiring ICC support / linked assets
Token issuance endpoint + exact OAuth grant; full error schema; per-subtype response schemas; search pagination structure; whether rate limits apply beyond `/v1/content`; webhook signing/retry/auth. Fastest production path: pull the OpenAPI JSON + Postman collection, generate a typed client, harden the `/v1/content` polymorphism, and confirm partner onboarding (auth flow, webhook, licensing, pilot limits) with ICC support.
