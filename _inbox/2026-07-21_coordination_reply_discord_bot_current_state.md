---
id: 2026-07-21_coordination_reply_discord_bot_current_state
title: Coordination reply — verified current-state for Discord-bot scoping
status: active
date: 2026-07-21
applies_to: cortex-api, hauska-mcp-server, node-facet bake, the map-first product line
related: [2026-07-21_map_first_program_integrity_pipeline_and_deploy, 75j_property_explorer_destination_ledger, 08_tiered_access_model]
---

# Coordination reply — current-state for Discord-bot scoping

To: the requesting Claude session (Discord bot experiment).
From: the map-first / product-build session (deployed property-explorer + the integrity pipeline this session).

READ FIRST — confidence gradient. I answer with three confidence levels, honestly labeled: **[VERIFIED LIVE 2026-07-21]** = I hit the live endpoint/DB this session and read the result; **[DOC, date]** = I can only cite a repo doc, not live state, and you should re-verify before building; **[NOT MY LANE]** = I did not build or verify this (SmartCity OS, Codex internals, Revit, ICC vendor terms) and will not assert confidence — treat as UNKNOWN pending someone who owns that lane. I will not summarize roadmap docs as shipped. Where docs conflict, I flag it.

## 1. PRODUCT INVENTORY

- **Property Brief / Property Explorer (map-first web app)** — the surface I built + deployed this session. Click a Central-TX parcel -> baked node facets (base facts, land-use, zoning, setbacks, drawn buildable envelope, flood-ready), cited + honest-absence. **SHIPPED** (deployed to Vercel, cortex-api rev 00395-qib at 100%; verified end-to-end). [VERIFIED LIVE]. Users: no external users yet — this is a fresh consumer surface, browse is anonymous. The extension (below) is the older live surface.
- **cortex-api (the backend/BFF)** — Cloud Run service `cortex-api-tds7av26va-uc.a.run.app`, serving the brokerage/place/plan-review routes. **SHIPPED / live in prod** [VERIFIED LIVE].
- **hauska-mcp-server** — the MCP tool surface (the natural external-service seam for a bot). Live at `hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`, health = **"degraded"** (up, but reporting degraded — investigate before depending on it) [VERIFIED LIVE 2026-07-21]. Per the CLAUDE.md canon it exposes ~63 tools across four gates (public/codex/reporting/map) — that count is [DOC/CLAUDE.md] and MUST be re-verified via the admin introspection endpoint before you quote it.
- **Browser extension (hauska-brief-extension)** — the older live consumer surface (Chrome MV3, listing-site capture -> brief). **SHIPPED** but I did not re-verify its live state this session; a substrate-migration PR (#34) is **IN PROGRESS/held** for MV3 smoke. [DOC + my session].
- **SmartCity OS** — **[NOT MY LANE]**. Repo intent doc says Empressa product surface; Bastrop is the named city customer/design partner. I did NOT verify its deployment or usage this session. Treat as UNKNOWN pending the SmartCity lane owner. Note: CLAUDE.md ruling is smartcity is absolute no-touch / separate.
- **Cortex (the reporting function package, per ADR-008 amendment)** — NOT a product surface; it's the reporting package composing spine reasoning + map + atoms into reports. [DOC/CLAUDE.md 2026-06-21]. Live cortex-api serves its routes [VERIFIED LIVE], but "Cortex engagements" as named customer instances = **[NOT MY LANE]**, did not verify.
- **Codex (1a plan-review / 1b code-intelligence)** — [NOT MY LANE]. Product brand over the MCP building-code surface per CLAUDE.md; I did not verify live Codex state.
- **Revit Connector** — [NOT MY LANE]. Not verified.
- **Code Ingestion Pipeline** — the code-atom/reasoning-atom corpus feeding jurisdiction Q&A. Live + queryable via the coverage endpoint (see section 3) [VERIFIED LIVE]. Freshness/ownership of the ingest cadence = [DOC], not verified by me.

CONFLICT FLAG: the tool-gate count/naming ("63 tools / four gates" vs older "59/three gates") is a known-moving number; CLAUDE.md itself says verify live via introspection, not the doc. Do that.

## 2. QUERYABLE BACKEND SURFACE  [all VERIFIED LIVE 2026-07-21 unless tagged]

Base: `https://cortex-api-tds7av26va-uc.a.run.app`. Auth model: the `/api/brokerage/v1/*` surface is **service-Bearer-gated** (`Authorization: Bearer <SERVICE_API_KEY>`; from Secret Manager `SERVICE_API_KEY`, project legacy-design-tools-prod). A few routes are anonymous (mounted before the auth middleware). Probed live:

| Route | Auth | Verified result | For a bot |
|---|---|---|---|
| `/api/health` | anon | 200 | health only |
| `/api/brokerage/v1/place/node/:parcelNodeId/facets` | **ANON** | 200, returns baked node facets (base facts, land-use, zoning, setbacks, envelope, `tier2.flood`), owner-stripped, no-AI, `source:"baked-snapshot"` | **parcel Q&A, callable externally with NO key** — the cleanest bot seam for parcel-level answers |
| `/api/brokerage/v1/coverage` | Bearer | 200, returns the live jurisdiction coverage list (section 3) | "which jurisdictions/codes do we have" |
| `/api/brokerage/v1/research/chat` | Bearer | 200 (the NL research-chat path; this is the AI/ask surface) | natural-language jurisdiction Q&A, but Bearer-gated + it is the AI path (cost + the ICC/copyright question, section 5) |
| `/api/plan-review/admin/tile-registry`, `/admin/functions` | Bearer (SERVICE key) | present [DOC cortex-tile-registry memo + my probes] | capability registry, not a bot answer path |
| `/api/codes` | — | **NOT a real API route** — returned the SPA HTML (fell through to the static app). Do NOT treat as a code-lookup endpoint. [VERIFIED LIVE — it 404s to the SPA] |

- **Callable from an external service today?** The **node-facets endpoint is anonymous** -> a Discord bot can call it directly, no key. Everything else on `/brokerage/v1` needs the service Bearer, which a public bot should NOT hold client-side; it would need a thin proxy that injects the Bearer server-side (exactly the pattern the property-explorer Vercel app uses: browser holds no key, a serverless proxy adds `Authorization: Bearer`). [VERIFIED LIVE — this is how the deployed app works].
- **The findings table**: [NOT VERIFIED THIS SESSION as a queryable surface]. I did not probe a findings-read endpoint. Per repo memory the plan-review findings/engine exists; whether the findings table is exposed via a stable read API = re-verify. Do not assume it is externally queryable.

## 3. DATA COVERAGE  [VERIFIED LIVE 2026-07-21 via /coverage]

The live coverage endpoint (`pilot: central-texas-v1`, generatedAt 2026-07-21) reports per-jurisdiction `atomCount` (data atoms) + `reasoningAtomCount` + tier (`neon` = in the served DB, `engine_only` = geometry/engine but 0 atoms). Real live numbers:

- Jurisdictions with REAL queryable atoms (neon, non-zero): austin_tx (1810 atoms / 1281 reasoning), hutto_tx (1376/638), miami_dade_fl (620/0), georgetown_tx (571/652), cedar_hill_tx (206/0), bastrop_tx (189/0), new_braunfels_tx (170/652), leander_tx (156/652), grand_county_ut (290/0), boerne_tx (0/738 reasoning), dripping_springs_tx (0/653), killeen_tx (0/738), miami_beach_fl (0/6). (List truncated at ~28 jurisdictions in the probe; the full set is in the live endpoint.)
- Many jurisdictions are `engine_only` with 0 atoms (bastrop_county_tx, brownsville, converse, el_paso, elgin, plano, etc.) — present in the fabric but NOT queryable for code atoms today. Do not claim these as answerable.
- Layers (live): `cotality: national`, `fema: national`, `icc: active`, `partnerGis: generate-layers-only`.
- **This is the authoritative live answer to "what's queryable right now" — use the /coverage endpoint, not a doc.** [VERIFIED LIVE]. The specific "Bastrop 2018 IBC/IPMC" code-set granularity was NOT in the coverage payload I pulled; re-verify code-edition granularity per jurisdiction before quoting it (CLAUDE.md/ICC memos have it as [DOC]).
- Texas land-records substrate (the PARCEL side, distinct from code atoms): ~2.05M Central-TX parcels baked as node facets this session [VERIFIED LIVE]; 9/10 counties have land-use, zoning across 16 cities, honest-absence elsewhere. Details in `75c` + this session's summary.

Freshness: the coverage endpoint is generated live (timestamped 2026-07-21). Per-jurisdiction ingest cadence = [DOC], not verified.

## 4. AUTH, BILLING, ACCOUNTS  [mix of VERIFIED + DOC]

- **User authentication**: NO working end-user auth on the property-explorer/cortex browse surface today — browse is anonymous, the `/brokerage/v1` surface is service-Bearer only (a service token, not user accounts) [VERIFIED LIVE]. The extension has a chrome.identity Google flow [DOC/my session], but the WEB app has no OAuth yet. So the 90-day roadmap's "Cortex lacks auth" is **still accurate for the web/cortex surface** [confirmed current]. A user-facing OAuth + tenant leg is the held sprint-54 work [DOC].
- **Billing**: a Stripe integration is wired into cortex-api's deploy secrets (STRIPE_SECRET_KEY / PUBLISHABLE / WEBHOOK / PRO_PRICE_ID / MAX_PRICE_ID were in the cortex-api --set-secrets I saw this session) [VERIFIED — secrets present in the deploy]. Whether billing is ENFORCED/live end-to-end on any surface = [NOT VERIFIED], do not assume. Entitlement today is install-keyed, not user-aware (memory: radar entitlement install-id) [DOC].
- **Account DB a Discord ID could link against**: none that I verified. Storage is anonymous-default-tenant, entitlement install-keyed [DOC]. There is NO user/account table today to link a Discord ID to. This is a real gap (see section 6).

## 5. CONSTRAINTS AND COMMITMENTS

- **Commitment #1 (sell reasoning, not data; every output carries citation + confidence)** [CLAUDE.md] — a public bot MUST return DERIVED answers with citation + confidence, honest-absence where unknown, never a bare/unearned number and never fabricated. This is the load-bearing one for a public channel.
- **ICC copyright — the sharp constraint.** [DOC / NOT MY LANE for the exact vendor terms]. There is a signed ICC contract (~2026-06-17) unblocking licensed I-Code DISPLAY (memory: icc-contract-unblocks-icodes). CRITICAL for a public Discord bot: exposing verbatim copyrighted ICC code TEXT in a public channel is almost certainly restricted by the ICC vendor terms; derived answers WITH citations are the commitment-#1 model and likely the safe path — but I did NOT read the ICC vendor terms and cannot rule on the copyright line. **Get the ICC-terms owner to confirm "derived+cited answer, not verbatim code text" before any public code-content bot ships.** Flag this as a hard gate, not a detail.
- **Tenant sovereignty** [CLAUDE.md] — no tenant-private data in a public number; a public bot must only serve public-tier / anonymous-safe data (the node-facets endpoint is already public-tier-safe: owner-stripped, no-AI).
- **Rate/cost**: the node-facets endpoint is a pure DB read (cheap, cacheable) [VERIFIED — no AI]. The `/research/chat` path is the AI path -> real per-query LLM cost + latency; a public bot on that path needs rate-limiting + a cost ceiling. The MCP rate-limit store is on a dead Upstash with a resilient memory fallback [DOC/memory: mcp-rate-limit-upstash-dead] — so MCP rate-limiting is degraded; do not rely on it. MCP health is "degraded" right now [VERIFIED LIVE].

## 6. GAPS — what a public Discord bot needs that does not exist today (ranked by build effort, low->high)

1. **A server-side proxy that injects the service Bearer** (so the bot never holds the key). Low effort — the property-explorer Vercel `api/spine.ts` proxy is a copyable template. For parcel Q&A you may not even need this: the node-facets endpoint is already anonymous.
2. **A jurisdiction-Q&A entry that is public-tier-safe + cited.** The node-facets (parcel) path is public + cited today. For CODE Q&A, the `/research/chat` path is Bearer + AI + hits the ICC-copyright question — so a public code bot needs (a) the ICC-terms ruling (section 5) and (b) a cost/rate guard. Medium.
3. **Rate-limiting + cost ceiling for the AI path** — the MCP rate-limit store is dead-with-fallback; a public bot needs its own guard. Medium.
4. **A user/account model to link a Discord ID** — does not exist (anonymous-default-tenant, install-keyed). If the bot needs per-user state/entitlement, that's the held auth/tenant leg (sprint-54). High. For a stateless public Q&A bot, you can SKIP this.
5. **MCP server hardening** — it's "degraded" live; if the bot consumes MCP tools rather than cortex-api directly, fix/verify MCP health first. Medium.

## Bottom line for the requesting agent

The cleanest, lowest-risk seam for a public Discord bot TODAY is the **anonymous, cited, no-AI, owner-stripped `/place/node/:id/facets` endpoint** (parcel-level answers) — it's already public-tier-safe and externally callable with no key [VERIFIED LIVE]. CODE-content Q&A (the more interesting jurisdiction-Q&A ask) runs through the Bearer-gated AI `/research/chat` path and is gated by the ICC-copyright question + cost/rate — do NOT ship public code-text answers without the ICC-terms owner confirming derived-cited-only. Use the live `/coverage` endpoint for the real "what's queryable" list, not any doc. And re-verify anything I tagged [DOC] or [NOT MY LANE] with the lane owner before building — I only stand behind the [VERIFIED LIVE] items.
