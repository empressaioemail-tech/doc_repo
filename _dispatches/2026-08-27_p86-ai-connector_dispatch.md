CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-86, P-87 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Smart Site agent distribution: P-86 resolvable share links (grant-id URL, HMAC on the hash form only) and the P-87 UI half (Use in your AI); the LDT MCP server is a later dispatch

---
id: 2026-08-26_smartsite_ai_connector_WDLL
title: WDLL — Smart Site agent distribution (resolvable shares, product MCP, directory listings)
date: 2026-08-26
last_updated: 2026-08-27
status: approved
applies_to: hauska-map, legacy-design-tools
plan_row: P-86, P-87, P-88
operator_go: 2026-08-26 (planner reply: approved to start P-86 item 1 after amendments a–c; OPS-16 A-035). AS named 2026-08-27 (A-037): WorkOS AuthKit.
decision: _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
model_law: 19_the_instrument_contract.md
pricing_law: _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md; _smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md
mcp_law: 28_mcp_first_product_design.md; 29_mcp_surface_tier_model.md; 51_substrate_v1_sprint.md (product-server exception named in the decision)
honest_state: _inbox/2026-08-16_mcp_honest_current_state.md
snapshot: P:/doc_repo main 9656287 · hauska-map share plane read 2026-08-26 (pe-share-view.ts JSON; /share#token SPA; token HMAC 30-day, no revoke row; brief is anonymous facets; mint handler still export-entitlement gated)
owner: property seat (all product code and the Smart Site MCP). Substrate seat does not own OAuth and does not absorb these rows onto hauska-mcp-server. Deploys planner-owned.
---

# WDLL: Smart Site agent distribution

Date: 2026-08-26  Status: approved  Operator approval: 2026-08-26 (planner reply; start P-86 item 1 after amendments a–c)

This card is the Start card for P-86, P-87, and P-88. Amendments a–c below bind. The planner's readings of the share plane and of vendor connector UX are the planner's; reporting one wrong is a successful outcome.

## Done looks like

A Studio user shares a parcel and pastes a server-visible Smart Site URL into Claude, ChatGPT, or any model that fetches links. The model reads the same analysis the human share shows: citations, verdicts, stored reports and artifacts, at the locked full-fidelity rule (what the sharer stored; the recipient's tier gates what they can produce, not what they can see). The same user clicks **Use in your AI** in Smart Site, picks Claude, completes OAuth as themselves, and from that console can find a parcel, open its smart site, list their properties, run a report, request records, check a request, export an instrument, and ask the map, all at their Stripe tier. Unresolvable credentials are 401, never a silent public catalog. The Hauska MCP server is unchanged as the catalog. Directory listings exist only after that probe has passed. Per-call price is not live; access is the tier.

## Housing and identity (binding)

Amendment (b) supersedes the first bullet: MCP server is `legacy-design-tools/artifacts/smartsite-mcp`.

- New service, property-owned. Default housing: `hauska-map/apps/smartsite-mcp` on Cloud Run. A dedicated repo is an amendment, not a silent move.
- Public hostname `mcp.smartsite.cloud` serving Streamable HTTP `POST /mcp`. The Cloud Run URL is not the customer URL.
- Identity is the Smart Site user (`pe_session` / the same account Stripe bills). Entitlement is Free | Solo | Studio | Team from the Stripe price id. The gate is a ceiling. Withheld is not absence.
- The eight tools are the connector catalog. Additional tools require a WDLL amendment naming each one. They are not added because they already exist on Hauska.
- Shared backends only. Facets, reports, Records Request, and exports are the workbench paths (or a shared library both the workbench and this server import). A second writer is a defect.
- Hauska MCP stays. P-31 is not this card. Service-key calls from this server into Hauska for an already-shipped download tool are allowed and must be recorded as such on close.

## Acceptance items

Order: P-86, then P-87, then P-88. P-87 must not start its public hostname or OAuth work until P-86 item 1 has a resolvable URL on a staging or production host. Directory work (P-88) must not file until item 20 has passed.

### P-86 Resolvable share links (property, hauska-map)

1. **The minted share URL is server-visible.** `POST /api/pe-share` returns a URL whose token is in the path or query, not only in the hash. Existing `/share#<token>` links keep working for humans. A `GET` of the new URL without a browser receives the token on the server. | check: mint response URL has no `#`; `curl -sI` of that URL is not a tokenless SPA; old hash URL still opens the funnel | grade: [ ]

2. **Same URL, audience selects rendering.** `GET` of the resolvable share URL returns HTML for a browser, markdown when `Accept` includes `text/markdown` or `?format=agent`, and JSON when `Accept` includes `application/json` or `?format=json`. Content is the same instrument. | check: three Accept/format probes on one token; bodies agree on parcel id, verdicts, and citations | grade: [ ]

3. **`llms.txt` names the resolvable form.** `https://smartsite.cloud/llms.txt` returns 200 text that states the share URL shape, the Accept/format contract, and that `/share#token` is human-only. It is not a robots allow/disallow file and not the Hauska catalog. | check: live GET 200; hash form is described as non-fetchable | grade: [ ]

4. **Share mint matches the locked rule: share is free.** Mint requires sign-in only. The export-entitlement gate on `pe-share.ts` and the 402 path in `ShareTool.tsx` are gone or proven already gone. P-60 close and the tree are reconciled by code reading, not by the close. | check: signed-in Free user mints 200; anonymous mint 401; paid-tier not required | grade: [ ]

5. **Locked fidelity, or the page says it is not the share.** The resolvable body includes everything the sharer has stored that the locked rule names (X-ray, site plan and terrain when exported, owner data when the sharer is Studio). If a field is withheld, the body labels the withholding and does not present the anonymous bake as the share. Owner data never appears on a v1 token that has no owner scope. | check: Studio-stored gold share vs Free-stored share, two callers; anonymous-bake-only body fails the "this is the share" copy check | grade: [ ]

6. **A share is a grant row.** Mint writes who granted, over which parcel, from when, until when, and whether revoked. View resolves that row. Revoke of one token does not rotate `PE_SHARE_SECRET`. Expired and revoked are 403 with distinct errors. The HMAC may remain the bearer; the row is the registry. | check: revoke one token, sibling token still 200; expired and revoked fixtures; no-row mint refuses | grade: [ ]

7. **Token leak is acknowledged, not preventable.** The share view and the agent projection carry the 30-day bound as a freshness line. Chat-log leakage is named in `llms.txt` as a property of pasting. No claim that a pasted link cannot be forwarded. | check: copy and `llms.txt` both state the bound; no "private to this chat" claim | grade: [ ]

8. **Records Request rides the same link.** When P-85 has completed a run on the parcel, the resolvable share includes those records (or a labelled "researching / complete / failed" state). This item is blocked on P-85 item 12 and is not a reason to start P-85 inside this card. | check: completed-run fixture appears on the share; in-flight run is labelled; if P-85 is not live, item is not-started and named on close | grade: [ ]

### P-87 Smart Site MCP, OAuth, curated tools, Use in your AI (property)

9. **Server exists on the product hostname.** `POST https://mcp.smartsite.cloud/mcp` initialize 200, protocol current, `serverInfo.name` is Smart Site, not Hauska. `GET https://mcp.smartsite.cloud/llms.txt` lists the eight tools. Health does not call 404 ok. | check: live initialize + llms.txt; name string; health | grade: [ ]

10. **OAuth 2.1 + PKCE against the Smart Site account.** Claude (or a local OAuth client) completes authorization; the resulting session is that Smart Site user. Dynamic client registration or CIMD as the vendor requires. Refresh tokens issued (`offline_access` advertised) so ChatGPT does not hide tools. | check: one completed Claude custom-connector Connect; token maps to the signed-in user id | grade: [ ]

11. **Entitlement is the Stripe tier.** Free, Solo, Studio, Team ceilings match the workbench. A Free session cannot run a Studio report. A Studio session can. Unresolvable, expired, and revoked credentials are 401 with no public-catalog body. Bearer-without-OAuth is 401, never silent public. | check: four-tier matrix plus 401 fixtures; a Bearer-only initialize is 401 | grade: [ ]

12. **Exactly eight tools, PE-proven names.** The list is: find a parcel, get its smart site, list my properties, run a report, request records, check a request, export an instrument, ask the map. `tools/list` returns those eight and only those eight. Copy is property-written so a model can pick. | check: tools/list length 8; a ninth tool fails the card; name/description review against a fixture prompt set | grade: [ ]

13. **Same content as the workbench for the same caller.** `get_smart_site` on gold `48021:34137` for a Studio session agrees with signed-in inspect on the parcel id, verdicts, and citations. Audience is agent (markdown or structured tool result), never a thinner catalog. | check: paired Studio inspect vs tool result; Free vs Studio withheld fields | grade: [ ]

14. **Async reports are a protocol, not a spinner.** `run_report` and `request_records` return started + job id when the work is not immediate. `check_request` returns queued | running | complete | failed | needs-human. Completion delivers the result on the next check (or an MCP progress/notification if the transport supports it). A tool that blocks the chat until a clerk run finishes fails this item. | check: fixture long job; immediate poll; no multi-minute tool hang | grade: [ ]

15. **Use in your AI is in the signed-in chrome.** One control opens a sheet: Claude, ChatGPT, Cursor, Copilot. Claude is Connect when item 10 is live (opens their add-connector flow with our URL). ChatGPT is Connect only if that account class can complete per-user MCP; otherwise the row says unavailable and why. Cursor gets the remote URL and OAuth, not a key. No row pastes `X-Hauska-Key`. | check: signed-in sheet; signed-out is sign-in first; zero product-key strings in the sheet | grade: [ ]

16. **No key-shaped fallback ships.** If OAuth is not live, the button is absent or a coming-soon chip. A shipped Connect that shows a key or a Cloud Run URL as the customer path fails this item. | check: production HTML/JS has no MCP_PRODUCT_KEY or X-Hauska-Key instructions | grade: [ ]

17. **Failure domains stay split.** A Smart Site MCP outage does not change Hauska MCP health. A Hauska outage may degrade export-if-proxied and must be labelled on that tool, not presented as a Smart Site-wide down. | check: two health endpoints; export-degraded fixture | grade: [ ]

18. **Out of this card (P-87).** Per-call pricing, Circle, Hauska directory listing, GPT-store SKU, Zapier, public per-parcel SEO pages, interactive map inside the chat, adding tools beyond the eight, writing atoms, any work in `hauska-mcp-server` except an optional recorded service-key download proxy. | check: pathspec and notStarted list on close | grade: [ ]

### P-88 Directory listings (property, after P-87)

19. **Packets exist, not filed.** Claude and ChatGPT (or the then-current vendor forms) directory packets live in the Smart Site MCP tree and name `mcp.smartsite.cloud`, the eight tools, and OAuth. They are not the 2026-05 Hauska drafts retitled. | check: files present; hostname and tool count match live | grade: [ ]

20. **Live probe before any filing.** A stranger account: Use in your AI → Claude Connect → OAuth → ask for gold `48021:34137` → receive the smart site at that account's tier. A second probe: unresolvable/revoked session is 401. Both recorded with timestamp and serving revision. | check: probe artifact; 401 probe; serving digest named | grade: [ ]

21. **One listing filed only after item 20.** First filing is Claude's connector directory (or the vendor that item 20 used). ChatGPT listing is a second filing, same gate. A listing that points at the Cloud Run URL or at Hauska fails. | check: public directory URL resolves to `mcp.smartsite.cloud`; live initialize from that listing | grade: [ ]

## Amendments

- 2026-08-26 (a): Items 1 and 6. The resolvable URL carries the grant row id, never the HMAC. Tokens in paths land in Vercel and Cloud Run request logs and referrers. Grant rows are a prerequisite of item 1, not a later phase. The HMAC remains the bearer for `/share#token` only.
- 2026-08-26 (b): Housing. The MCP server lives in `legacy-design-tools` at `artifacts/smartsite-mcp`, deployed through the existing `cloud-run-deploy.yml`. hauska-map has no Cloud Run path; LDT holds users, `peUserIdentities`, `peUserEntitlements`, `pePaywallStripe`, and the job runners. Share links, `llms.txt`, and Use in your AI stay in hauska-map.
- 2026-08-26 (c): Item 10. Name the authorization server before P-87 starts. Smart Site sign-in is an OIDC BFF (Google, Microsoft PKCE) minting `pe_session`; no AS exists in either repo. Options: minimal in-house AS in LDT bound to `pe_session`, or a hosted AS with DCR and PKCE federated to the same sign-in. Planner recommends hosted. P-86 does not wait on this.

- 2026-08-27 (planner reply 00:15Z, OPS-16 A-037). Restates (a)–(c) before the first product commit. (a) Unchanged: grant row first (item 6), then a resolvable URL carrying the grant id; HMAC stays on `/share#token` only. (b) Unchanged: MCP server is `legacy-design-tools/artifacts/smartsite-mcp` via `cloud-run-deploy.yml`; share links, `llms.txt`, and Use in your AI stay in hauska-map. (c) Named: hosted WorkOS AuthKit. OAuth 2.1 + PKCE, dynamic client registration, refresh tokens, Google and Microsoft sign-in matching the existing OIDC BFF, documented MCP authorization-server role. Fallback if a live Claude custom-connector Connect cannot complete against it twice: Stytch Connected Apps, by amendment of A-037, not re-litigation. Identity join rule, binding: an AuthKit subject maps to a Smart Site user only through `peUserIdentities` by `(provider, subject)`, or by verified email on the same provider; the MCP server never creates a second account and never grants a tier that the user's `peUserEntitlements` row does not carry. Vendor capability claims are verified at build time; item 10 is the falsifier. P-86 does not wait on the AS.

P-85 coupling (planner reply, same night): `request_records`, `check_request`, and item 8 consume the P-85 job API and start after P-85 item 4 merges. Shared backends only; this card does not build a second records path.

Worktrees (planner reply): hauska-map work in `P:/seat-worktrees/property/hauska-map-smartsite-ai` on `seat/property-ai`, created from `origin/main`. Never `fix/pe-pricing-a2` and never the records worktree. LDT MCP worktree is `P:/seat-worktrees/property/legacy-design-tools-mcp` on `seat/property-mcp`, created from `origin/main`. Never the primary LDT worktree (P-85 on `feat/p85-records-request`). The LDT server gets its own dispatch when P-87 starts. This hauska-map dispatch covers P-86 and the UI half of P-87.

- 2026-08-27 (item 6 applied, live read). Lane SELECT on production `_schema_migrations`, not the workflow log. Snapshot: Neon project `fancy-fire-06136146` (`cortex-prod`) default branch, database `neondb`, read 2026-08-27T01:24Z via Neon MCP `run_sql` from doc_repo `main` `d9a88d2`. Rows:

  | name | applied_at |
  |---|---|
  | `0084_p85_records_request.sql` | `2026-08-27T00:46:05.396Z` |
  | `0085_pe_share_grants.sql` | `2026-08-27T01:07:49.908Z` |

  Second derivation: `information_schema.tables` lists `pe_share_grants`. Columns on that table: `id` text NOT NULL, `grantor_user_id` text NOT NULL, `grantor_tenant_id` text NOT NULL, `parcel_node_id` text NOT NULL, `created_at` timestamptz NOT NULL, `expires_at` timestamptz NOT NULL, `revoked_at` timestamptz NULL. No HMAC column. Planner dispatch run `33029068772` (`workflow_dispatch` `run-migrations`, completed/success, created 2026-08-27T01:07:09Z) is corroboration, not the record. Item 6 is applied.

- 2026-08-27 (item 15 chrome + item 16, live). Use in your AI is a live rail bubble (`use-in-ai`, after Share) on smartsite.cloud. hauska-map `80585e8` `feat(p87): add Use in your AI rail bubble`, PR #229. PE prod `dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX` (later than the item 1 deploy). Sheet copy matches the design handoff: lede, Claude/Cursor/Copilot Coming soon, ChatGPT Unavailable plus the Business/Enterprise line, zero product-key strings. Working hook on the sheet is the Share mint (`/s/{grantId}`). Item 15 is partial: Connect is not live. Item 16 is met. Do not rewrite item 15 to done until item 10 completes one Claude Connect.

- 2026-08-27 (item 1 customer-done, live probe). hauska-map #227 merged `f968d6fe` 2026-08-27T02:11:13Z on CI Test/Typecheck/encoding conclusion SUCCESS. PE Vercel prod `dpl_DLL3qfcjsXsor4zEmHUtehT1QPLe` aliased `https://smartsite.cloud`. Cortex canary `cortex-api-00589-jen` image tag `0dd3e159abcff8968c02c226881d42b4136627ee` (LDT #481) shifted to 100% (runs 33032649389 canary, 33032789033 shift). Probe grant `c86a0001-0086-4086-a001-000000000001` parcel `48021:34137` inserted 2026-08-27T02:11:07.662Z. Live at 2026-08-27T02:17Z:

  Pre-deploy baseline: `GET /llms.txt` and `GET /s/{id}` were SPA `index.html`.
  After deploy: `GET https://smartsite.cloud/llms.txt` 200 `text/plain` (resolvable shape, Accept contract, hash non-fetchable, 30 days).
  `GET https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001` 200 HTML instrument, header `X-Share-Freshness-Days: 30`, title 908 PINE, parcel 48021:34137, bake labelled not the share.
  `Accept: text/markdown` 200 `text/markdown`. `Accept: application/json` 200 `grant-scoped-share-instrument`.
  HMAC in path 403 `share_grant_invalid`. `/share` still SPA `index.html`.
  First PE 403 was cortex still serving #480 (`00586-dip`); rejected "grant id invalid" as the mechanism once the row was in Neon.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_p86-ai-connector_cp1.json
  CP2: _inbox/2026-08-27_p86-ai-connector_cp2.json
  CLOSE: _inbox/2026-08-27_p86-ai-connector_close.json
