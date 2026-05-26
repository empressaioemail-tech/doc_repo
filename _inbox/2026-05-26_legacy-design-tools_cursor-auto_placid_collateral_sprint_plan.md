---
date: 2026-05-26
agent: cursor-auto
repo: legacy-design-tools
type: decision
topic: placid-collateral-export-sprint-plan
status: planned
related_courier: 2026-05-25_legacy-design-tools_cursor-auto_canva_connect.md
---

# Courier — Placid collateral export (legacy-design-tools)

**Date:** 2026-05-26  
**Repo:** `P:\legacy-design-tools` (empressaioemail-tech/legacy-design-tools)  
**Agent:** cursor-auto (Cursor)  
**Topic:** Replace Canva Enterprise autofill with Placid headless PDF/image export; usage-based pass-through billing  
**Sprint status:** **Planned** — not started; build in a short sprint later

---

## Executive summary

Design Accelerator’s **Deliver → Client materials** flow was built against **Canva Connect** (OAuth, asset upload, brand-template autofill). **Canva Enterprise is not viable**: ~$9k/org for the platform, and **each end customer** would need Enterprise membership for API autofill in production. Architects and their clients will not pay that.

**Decision:** Pivot the primary “generate client collateral” path to **Placid** ([REST API 2.0](https://placid.app/docs/2.0/rest)) — headless, template-based **PNG/PDF** generation billed per **credit** (1 image = 1 credit; 1 PDF page = 2 credits). Hauska holds one Placid API project; **usage is metered and marked up** to end users under the product’s **usage-based pricing** model. Customers never buy Placid seats.

**Keep (optional, later):** Canva **upload-only** (“push assets to my Canva”) for architects who already use Canva on their own plan — no Enterprise required for that narrower path.

**Do not invest in:** Canva brand-template autofill, Enterprise dev access as a production strategy, or embedded editor platforms (Polotno/IMG.LY) until per-export revenue justifies a fixed platform license.

---

## Why we are making this change (conversation summary)

### What we built (Canva slice)

A full vertical slice exists in the **working tree** (may be uncommitted — see [2026-05-25 Canva Connect courier](./2026-05-25_legacy-design-tools_cursor-auto_canva_connect.md)):

| Layer | Artifacts |
|-------|-----------|
| DB | `canva_connections`, `canva_oauth_states`, `canva_push_jobs`, `canva_design_pushes` — migration `0020_add_canva.sql` |
| api-server | `routes/canva.ts`, `lib/canva/*` (OAuth, assets, push worker, catalog) |
| OpenAPI | Patched via `scripts/patch-openapi-canva.mjs` + codegen |
| Frontend | `apiCanvaIntegrationService`, `ClientMaterialsTab`, connect/disconnect, job poll UI |
| Dev | `dev:local` / `dev-local-windows.ps1`, dev-connect stub when `CANVA_*` unset |

Local QA proved the **job + asset picker + poll** UX. **Generate in Canva** with dev-connect returns a **stub URL**; real autofill requires OAuth + **Canva Enterprise** for integration users.

### What blocked us

| Blocker | Impact |
|---------|--------|
| **Canva Enterprise ~$9k** | Not affordable for Hauska or pass-through to customers |
| **Per-customer Enterprise** | Autofill requires each connected user in an Enterprise org — worse than a single platform fee |
| **Wrong portal surface** | User explored Code upload / embedded app URLs; Connect OAuth belongs under Authentication, not Development URL |
| **Proxy dev mode** | `pnpm run dev` hits Cloud Run → 404 on `/api/canva/*`; local stack needs `dev:local` + `DATABASE_URL` |

### Options we evaluated

1. **BYOC Canva (upload-only)** — OAuth + push PNGs to user’s Free/Pro Canva; manual deck finish. Low platform cost; weak automation.
2. **Packages / HTML export (in-repo)** — Already exists; zero vendor fee; not a designed PDF/deck.
3. **Owned PDF pipeline (Puppeteer)** — Full control; build/maintain templates.
4. **Headless template APIs (Placid, APITemplate, Creatomate, Bannerbear)** — Per-export credits; white-label output; fits usage billing. **Selected for deep dive: Placid.**
5. **Embedded editors (Polotno, IMG.LY)** — True in-app white-label editor; **$250–900+/mo platform** before first export — poor fit for pure usage pass-through at v1.

### Why Placid (vs other headless APIs)

| Criterion | Placid |
|-----------|--------|
| Primary deliverable | **Multi-page PDF** via `pages[]` — matches client presentation + plan sheets |
| Economics | Predictable credits; test mode = free watermarked previews |
| Integration shape | Same async POST → poll as existing `canva_push_jobs` worker |
| White label | End user sees Hauska export only; no third-party editor account |
| Optional later | Editor SDK, video (10 credits / 10s) — not v1 |
| vs APITemplate | APITemplate cheaper per PDF at scale; Placid stronger on PNG + multi-template PDF + future SDK |
| vs Creatomate | Better if video montages are core; heavier credit math for video |

---

## Product direction after pivot

### Primary path (v1)

**Deliver → Client materials** (or merged with **Packages**):

1. Pick engagement assets (renders, sheets, site context) — reuse existing picker.
2. Edit headline / address / talking points — align with Packages `clientHeadline`, `clientTalkingPoints`.
3. Choose Hauska template pack (e.g. client presentation = cover + plan spread + closing).
4. **Generate PDF** → async job → download + history.
5. **Bill** one `collateral_export` (or N credits) on the tenant for usage-based pricing.

### Secondary paths (unchanged or deprioritized)

| Path | Priority |
|------|----------|
| **Packages** share link / HTML export | Keep as zero-cost option |
| **Canva upload-only** | Optional; hide autofill / template grid |
| **Canva autofill** | **Off** for GA |
| Placid PNG one-pager | v1.1 |
| Placid video | Backlog |

### Copy / positioning

- **Before:** “Auto-build branded Canva decks from your project.”
- **After:** “Generate client-ready PDF presentations from your renders and plan sheets; usage-based export credits.”

---

## Placid technical reference (for implementers)

### Authentication

- Header: `Authorization: Bearer {PLACID_API_TOKEN}`
- Token is **per Placid API project** ([docs](https://placid.app/docs/2.0/rest/authentication))

### Endpoints (v1)

| Action | Method | URI |
|--------|--------|-----|
| List templates | `GET` | `https://api.placid.app/api/rest/templates` |
| Get template | `GET` | `https://api.placid.app/api/rest/templates/{uuid}` |
| Generate image | `POST` | `https://api.placid.app/api/rest/images` |
| Generate PDF | `POST` | `https://api.placid.app/api/rest/pdfs` |
| Poll image | `GET` | `https://api.placid.app/api/rest/images/{id}` |
| Poll PDF | `GET` | `https://api.placid.app/api/rest/pdfs/{id}` |

### Request shape (PDF — primary)

```json
{
  "passthrough": "{\"jobId\":\"<uuid>\",\"engagementId\":\"<uuid>\"}",
  "pages": [
    {
      "template_uuid": "<COVER_UUID>",
      "layers": {
        "headline": { "text": "..." },
        "address": { "text": "..." },
        "hero_image": { "image": "https://..." }
      }
    },
    {
      "template_uuid": "<PLAN_SPREAD_UUID>",
      "layers": {
        "floor_plan": { "image": "https://..." },
        "sheet_label": { "text": "A1.01 — Floor plan" }
      }
    }
  ]
}
```

Layer names must match **Placid template editor** layer names exactly ([layers](https://placid.app/docs/2.0/rest/layers)).

### Async response

```json
{
  "id": 1,
  "status": "queued",
  "pdf_url": null,
  "polling_url": "..."
}
```

Poll until `status === "finished"` → use `pdf_url`. Handle `error` and 429 ([rate limit](https://placid.app/docs/2.0/rest/rate-limit): 60 req/min).

### Credits (production)

| Output | Credits |
|--------|---------|
| 1 image (≤4000px longest side) | 1 |
| 1 PDF page | 2 |
| 10s video | 10 |
| Test mode preview | 0 (watermarked) |

Large canvases multiply image credits (8×, 16×, … above 4000px) — keep templates ≤ 2400px long edge.

### Rate limits

- General: **60 requests/minute**
- `create_now: true`: max **10** simultaneous — prefer queued + poll (matches existing worker)

---

## Critical engineering constraint: public image URLs

Placid **fetches** `layers.*.image` URLs from their servers. Today `resolveRenderableAssetUrl()` builds **app URLs** like `/api/render-outputs/{id}/file` with **private** cache and session-scoped access — **not suitable** as-is.

**Required for sprint:**

| Option | Recommendation |
|--------|----------------|
| **A. Short-lived HMAC signed export URLs** | **v1 choice** — new unauthenticated GET route scoped to one job + asset id + expiry |
| B. Temp public GCS copy during job | Simpler for Placid; cleanup job needed |
| C. Placid `transfer` on output | Copies **result** PDF to your bucket only; does not fix inputs |

Implement **A** in api-server before any real Placid QA.

---

## Reuse from Canva slice (do not throw away)

| Reuse | Notes |
|-------|-------|
| `listEngagementCanvaAssets` / `resolveRenderableAssetUrl` | Rename to neutral `exportAssets` or share module |
| `canva_push_jobs` worker pattern | Clone to `collateral_export_jobs` + `placidPushWorker` |
| `ClientMaterialsTab` asset picker, text fields, job poll UI | Rewire service interface; remove OAuth banner as primary |
| `wireTypes` slot/template shapes | Map to Placid layer names; catalog from env or `GET /templates` |
| OpenAPI + codegen discipline | New paths via patch script; CRLF-safe |
| Packages form fields | Source of truth for PDF text layers |

| Pause / hide | Notes |
|--------------|-------|
| Canva OAuth, autofill, brand template grid | Feature-flag or UI gate |
| `canva_connections` | Keep schema; optional upload-only later |
| Enterprise messaging | Remove from primary CTA |

---

## Sprint plan (implementation phases)

### Phase 0 — Placid account & templates (human, ~0.5 day)

**Owner:** Orchestrator / design

- [ ] Create [Placid](https://placid.app) account + **API project** for Hauska/Design Accelerator
- [ ] Create templates (suggested v1 set):
  - `hauska-client-cover` — layers: `headline`, `address`, `project_name`, `hero_image`
  - `hauska-plan-spread` — layers: `floor_plan` and/or `sheet_1`, `sheet_2`, labels
  - `hauska-closing` — layers: `talking_points`, `logo` (static in template or tenant URL later)
- [ ] Tag templates `design-accelerator` / `client-presentation`
- [ ] Record UUIDs + API token in secrets manager (not committed)
- [ ] Run manual test in Placid UI + one REST call with public image URL

**Exit:** Three `template_uuid` values + token that generates a 1-page PDF in Placid dashboard.

---

### Phase 1 — Spike & signed URLs (eng, ~1–2 days)

- [ ] `scripts/spike-placid.mjs` — POST image/PDF with public test asset; poll; test mode on
- [ ] `lib/exportSignedUrl.ts` (or under `lib/collateral/`) — HMAC token, 15m TTL, job-scoped
- [ ] `GET /api/collateral/fetch/:token/:assetKey` — stream sheet/render bytes without session
- [ ] Unit tests: signature validation, expiry, wrong job rejected

**Exit:** Placid receives a real engagement render URL from signed route and returns `finished` PDF in spike script.

---

### Phase 2 — DB + api-server core (eng, ~2 days)

**Schema** (`lib/db/src/schema/collateral.ts`):

| Table | Purpose |
|-------|---------|
| `collateral_export_jobs` | `id`, `engagement_id`, `step`, `progress_label`, `request` jsonb, `download_url`, `thumbnail_url`, `error_*`, `credits_estimated`, `credits_actual`, `provider` |
| `collateral_exports` | History row per successful export (like `canva_design_pushes`) |

**Steps enum:** `preparing` | `resolving_assets` | `rendering` | `ready` | `failed`

**Migration:** `0021_add_collateral.sql` (number may shift if `0020` Canva merged first)

**api-server** (`artifacts/api-server/src/lib/collateral/`):

| Module | Responsibility |
|--------|----------------|
| `config.ts` | `PLACID_API_TOKEN`, template UUIDs, `PLACID_TEST_MODE` |
| `placidClient.ts` | POST pdf/image, GET poll, error mapping |
| `assets.ts` | Re-export or move from `canva/assets.ts` |
| `catalog.ts` | Static template metadata + slot definitions (mirror `FALLBACK_BRAND_TEMPLATES`) |
| `store.ts` | CRUD jobs/exports |
| `exportWorker.ts` | Async: build layers → signed URLs → POST → poll → persist URL |
| `wireTypes.ts` | API wire shapes |

**Routes** (`routes/collateral.ts`):

| Method | Path |
|--------|------|
| `GET` | `/api/collateral/templates` |
| `GET` | `/api/engagements/:engagementId/collateral/assets` |
| `POST` | `/api/engagements/:engagementId/collateral/export` → `202 { jobId }` |
| `GET` | `/api/collateral/export-jobs/:jobId` |
| `GET` | `/api/engagements/:engagementId/collateral/exports` |

**Env** (`artifacts/api-server/README-collateral.md`):

```env
PLACID_API_TOKEN=
PLACID_TEST_MODE=true
PLACID_TEMPLATE_COVER=
PLACID_TEMPLATE_PLAN=
PLACID_TEMPLATE_CLOSING=
COLLATERAL_SIGNING_SECRET=   # HMAC for asset fetch tokens
```

**Tests:** `collateral-route.test.ts` — mock Placid HTTP; DB truncate in setup.

**Exit:** `POST export` with test mode returns job → poll → `downloadUrl`; tests green with `DATABASE_URL`.

---

### Phase 3 — OpenAPI + codegen + portal service (eng, ~1 day)

- [ ] `scripts/patch-openapi-collateral.mjs` (CRLF-safe anchors)
- [ ] `pnpm --filter @workspace/api-spec codegen`
- [ ] `lib/portal-ui/src/collateral/apiCollateralService.ts` — implements same interface shape as Canva service where possible
- [ ] `pnpm run typecheck`

**Exit:** Generated client hooks; no hand-edits in `lib/api-client-react/src/generated/`.

---

### Phase 4 — Frontend UX (eng, ~1–2 days)

**`ClientMaterialsTab.tsx` (or rename Deliver tab):**

- [ ] Remove primary **Connect Canva** flow; optional link “Export to my Canva” → backlog
- [ ] Template grid from `/api/collateral/templates` (or static catalog)
- [ ] **Generate PDF** CTA with credit estimate (e.g. “~12 credits · 6 pages”)
- [ ] Reuse `CanvaPushProgress` pattern → `CollateralExportProgress`
- [ ] History list → download + open
- [ ] Error banners: missing token, 503, signed URL failure, Placid `error` status
- [ ] Integrate Packages fields: pre-fill `headline` / talking points from active package when present

**Env:** `VITE_COLLATERAL_API=1` (default on); mock service for Storybook when `0`

**Exit:** E2E on `dev:local` — pick assets → generate → download PDF (watermarked in test mode).

---

### Phase 5 — Metering & billing hook (eng, ~0.5 day)

- [ ] Persist `credits_actual` on job completion (from template page count + Placid response metadata if available; else compute from request)
- [ ] Emit event or row for billing system: `tenant_id`, `user_id`, `engagement_id`, `units`, `provider=placid`
- [ ] Document suggested retail mapping in product/billing docs (orchestrator-owned)

**Illustrative retail (orchestrator to confirm):**

| Product | Placid credits | Suggested user charge |
|---------|----------------|------------------------|
| One-pager PNG | 1 | $0.50–1.00 |
| 6-page PDF | 12 | $4–6 |

**Exit:** Every successful export leaves auditable metering row.

---

### Phase 6 — Hardening & docs (eng, ~0.5 day)

- [ ] Copy Placid `pdf_url` to GCS if URLs are short-lived (verify in spike)
- [ ] 429 backoff in worker
- [ ] Feature flag: hide Canva autofill (`VITE_CANVA_AUTOFILL=0`)
- [ ] Update `AGENTS.md` or README pointer — Placid env, no Enterprise
- [ ] Schema fixture refresh if CI drift test applies (`db:push:test` + `db:dump:test-fixture`)
- [ ] Courier close-out when merged

---

## Layer / template contract (v1)

Align Placid template layer names with existing Canva catalog keys where possible:

| Layer key | Type | Source |
|-----------|------|--------|
| `project_name` | text | `engagement.name` |
| `address` | text | `engagement.address` / site |
| `headline` | text | Package `clientHeadline` or engagement name |
| `talking_points` | text | Package `clientTalkingPoints` |
| `hero_image` | image | `slotMapping.hero` or first render |
| `floor_plan` | image | First `floorplan` / plan sheet asset |
| `sheet_1` … `sheet_N` | image | Selected sheet IDs in order |

**PDF page assembly (client-presentation):**

1. Cover — `PLACID_TEMPLATE_COVER`
2. For each selected plan sheet (max N): `PLACID_TEMPLATE_PLAN` or duplicate plan template with different layers
3. Closing — `PLACID_TEMPLATE_CLOSING`

Cap pages in v1 (e.g. max 12) to bound credits and job time.

---

## Acceptance criteria (sprint done)

- [ ] Signed asset URLs work; Placid can fetch render + sheet images
- [ ] `POST .../collateral/export` returns job; poll reaches `ready` with downloadable PDF
- [ ] Test mode works without consuming production credits
- [ ] `pnpm run typecheck` passes
- [ ] `collateral-route.test.ts` passes with test DB
- [ ] UI: Generate PDF from Deliver → Client materials without Canva OAuth
- [ ] Metering row written per successful export
- [ ] README-collateral.md documents env and local QA (`dev:local`, not proxy)
- [ ] Canva autofill not exposed as primary GA path

---

## Local QA runbook (post-sprint)

1. Apply migration `0021_add_collateral.sql` (after Canva `0020` if both land).
2. `.env.local`: `PLACID_*`, `COLLATERAL_SIGNING_SECRET`, `DATABASE_URL`
3. `pnpm run dev:local` or `scripts/dev-local-windows.ps1` — **not** `pnpm run dev` (proxy → 404).
4. Engagement → **Deliver → Client materials** → select assets → **Generate PDF**
5. Test mode: expect watermark; production token: full PDF, credits decrement in Placid dashboard

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Private asset URLs | Phase 1 signed URLs — blocker |
| Placid hosted URL expiry | Download to GCS in worker on `finished` |
| Credit underestimate | Show estimate from page count; reconcile `credits_actual` |
| Large sheet PNGs / credit multiplier | Template size cap; resize in signed route if needed |
| Canva + collateral schema both uncommitted | Merge order: Canva PR optional; collateral can be separate PR |
| DWG sheets not exportable | Same as today — UI `exportable: false` |
| CRLF openapi patch | Use existing patch-script pattern from Canva |

---

## Out of scope (this sprint)

- Placid Editor SDK (in-app template editing)
- Video export via Placid
- Tenant-specific custom templates (v2: template UUID per tenant in DB)
- Canva upload-only OAuth revival
- Puppeteer-owned PDF pipeline
- Billing system integration beyond metering row (orchestrator/product)
- Production Placid white-label Studio pages

---

## Key files (existing — grep anchors)

**Canva (reuse patterns):**

- `artifacts/api-server/src/routes/canva.ts`
- `artifacts/api-server/src/lib/canva/pushWorker.ts`
- `artifacts/api-server/src/lib/canva/assets.ts`
- `artifacts/design-tools/src/components/engagement-detail/ClientMaterialsTab.tsx`
- `lib/portal-ui/src/canva/apiCanvaIntegrationService.ts`
- `lib/db/src/schema/canva.ts`

**Packages (copy source):**

- `artifacts/design-tools/src/components/engagement-detail/packages/PackagesTab.tsx`
- `artifacts/design-tools/src/components/engagement-detail/packages/exportClientPresentation.ts`

**Planned new (sprint):**

- `artifacts/api-server/src/routes/collateral.ts`
- `artifacts/api-server/src/lib/collateral/*`
- `lib/db/src/schema/collateral.ts`
- `lib/db/drizzle/0021_add_collateral.sql`
- `scripts/patch-openapi-collateral.mjs`
- `scripts/spike-placid.mjs`
- `lib/portal-ui/src/collateral/apiCollateralService.ts`
- `artifacts/api-server/README-collateral.md`

---

## References

- [Placid REST API](https://placid.app/docs/2.0/rest)
- [Generate images](https://placid.app/docs/2.0/rest/images)
- [Generate PDFs](https://placid.app/docs/2.0/rest/pdfs)
- [Templates list](https://placid.app/docs/2.0/rest/templates)
- [Authentication](https://placid.app/docs/2.0/rest/authentication)
- [Rate limiting](https://placid.app/docs/2.0/rest/rate-limit)
- [Placid pricing / credits](https://placid.app/pricing)
- Prior courier: `2026-05-25_legacy-design-tools_cursor-auto_canva_connect.md`
- Prior courier: `2026-05-25_legacy-design-tools_cursor-auto_canva_oauth_devlocal.md`

---

## Orchestrator checklist before sprint

- [ ] Confirm retail credit pricing with product
- [ ] Create Placid project + templates; share UUIDs with sprint agent
- [ ] Decide PR strategy: collateral-only vs commit Canva slice first
- [ ] Assign worktree branch name (e.g. `sprint/placid-collateral`)
- [ ] File this courier from `_inbox/` → `_decisions/` or `_sessions/` after review
