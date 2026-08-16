---
id: 2026-08-16_blueprint_icc_compliance
title: Blueprint — ICC compliance container (stamp, actor, rate, activity portal)
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 75n_icc_code_connect_catalog, 2026-07-29_icc_verification_state, _decisions/2026-07-04_icc_poc_play, _decisions/2026-08-15_icc_first_sdk_customer]
---

# Blueprint: ICC compliance container

Pickup-executable. This is the license-core. Complete plan review and finished MCP are liars if this container is skipped. ICC's own surface is the activity portal those two feed.

Program WDLL items 18-21. Sources: `75n_icc_code_connect_catalog.md`; `_inbox/2026-07-29_icc_verification_state.md` (re-count live before quoting section counts).

## Locked license facts (75n)

- PoC books only: IBC2018P6 (2018 International Building Code), IPMC2018P2 (2018 International Property Maintenance Code).
- Credentials through Dec 30, 2026. Names `ICC_CODE_CONNECT_CLIENT_ID` / `ICC_CODE_CONNECT_CLIENT_SECRET` in `hauska-prod-497015`. Do not copy values into docs.
- Citation format: full canonical title + "Section" + number. Example: `2018 International Building Code Section 802.3`. "IBC" alone is a fail.
- Display: identifier + heading + our analysis + optional subsection. Do not reproduce full section body.
- Caching allowed; wind-down must destroy stored copies including embeddings. Selectors must exist.
- No customer-facing use until SaaS. This demo is the PoC demo that unlocks SaaS. accessPolicy stays `platform-internal`. No public-paid flip (G-50 signed half stays OPEN).
- Inbound meter fires on **free tier too**. A meter that only fires on paid sale is a license gap.
- Outbound Circle / RevenueRouter share is **not** this card.
- Actor fixture already in `@empressaio/atom-contract`: `ICC_ACTOR_RECORD_FIXTURE` = `did:hauska:actor:org:icc`, licensed-source, platform-internal, meterFreeTier, purgeOnWindDown, derivedOk:false.

## IBC live / IPMC residual (G-41)

2026-07-29 verify: IBC 4,825 code-sections + 3,904 cross-refs; IPMC 0 sections, empty body upstream. July 2026-07-05 ingest produced 4,966 sections in an earlier e2e; **re-count live** and quote the live number with its query. Do not mix the two figures.

This card grades **IBC-only**. IPMC `--apply` waits on L26 quiet and is a named residual, not a silent skip.

ICC-facing footer (verbatim, do not paraphrase into "two PoC books live"):

> PoC entitles IBC 2018 and IPMC 2018. This demo cites IBC 2018 from the live corpus. IPMC 2018 is not ingested (upstream empty body; G-41). Not customer-facing.

## Atoms slot (non-negotiable)

L26 holds the hauska_mcp bulk-writer slot. Rules:

- No second `--apply`.
- IPMC ingest is `--apply` = forbidden on this card.
- Engine **code** fix for G-30 (stop hardcoding public-free) is slot-free. Merge and deploy engine when CI success.
- Bounded UPDATE of existing ICC rows is allowed only if: (a) it is not a drain, (b) it is announced with row-count expected, (c) it is not concurrent with a live L26 `--apply` on the same DB. If the lease forbids even this, wait, file the wait in the close, do not force.
- Single adjudication insert from plan-review: announce; not a drain.

Engine defect location (OPS-17 G-30 LIVE 2026-08-14): `tools/migrate-legacy-codes/src/icc-model-code-ingest.ts` lines 110 and 127 hardcode `accessPolicy: "public-free"` on ICC jurisdiction-corpus and status atoms. 2026-07-29 also recorded line 128; treat as the same site; grep before patching.

## C1 — G-30 stamp

1. Change ingest so ICC jurisdiction / status / code-section atoms are `platform-internal` at source. Never `public-free` for ICC.
2. If the code-section schema still has no `accessPolicy` field (2026-07-29: it did not), that is a contract bump owned by this container. Do not leave ICC bodies on a `?? "public-free"` consumer default.
3. Bounded UPDATE: existing ICC atoms with public-free or null policy become platform-internal. Count before/after. Zero remaining public-free ICC atoms.
4. Anonymous `list_jurisdictions` omits `icc-model-code` (name+count leak was live 2026-07-29 because status was public).
5. Anonymous `get_atom` on a cited IBC DID is held / not body.

Check: store query + anon MCP. PE `VITE_ICC_CITATIONS_ENABLED` stays off.

## C2 — G-17 hard actor reference

Every ICC code-section atom served in the demo carries:

- `sourceActorDid=did:hauska:actor:org:icc`
- `book_id=IBC2018P6` (or the live field name; persist the invariant, not a reconstructed key)
- `section_id=<section number>`

Meter must attribute from those fields, not allowlist/regex. If the live meter is still heuristic, change the read path for rows that have the hard fields; do not delete the heuristic for non-ICC content on this card unless it would mis-attribute the fixture.

Purge selectors (already claimed 2026-07-29; re-verify): `sourceAdapter=icc-code-connect` AND `jurisdictionTenant=icc-model-code`. Keep both.

## C3 — Live IBC determinations in the matrix

Do not hardcode an atom DID in this file. After C1/C2:

1. Query store for IBC2018P6 sections that exist.
2. Pin at least one DID + section number into `_inbox/2026-08-16_icc_demo_walk.md`.
3. F3 matrix on engagement A (`48021:28286`) cites that section in canonical form, with atom ID, confidence object, analysis, deep-link, `bodyVerbatim:false`.
4. Prefer sections the extractor already holds. Do not fetch verbatim from Code Connect into the UI to "look more complete."

## C4 — G-23 named rate

Fixture rate is a number, not null, not `pending-rate`.

Lock unless the operator changes it in the decision file before execute:

- `DEMO_FIXTURE_RATE_USD = 0.01`
- Label on the ICC activity portal: "PoC fixture rate, not a quoted SaaS price."

After the walk (plan-review UI matrix view **and** one MCP catalog/Codex call that references IBC), ledger has new rows from **both** sources:

- `owedToActorDid` / `source_actor_did` = `did:hauska:actor:org:icc`
- book + section match a pinned citation
- amount = 0.01 (or the locked number)
- `source` distinguishes `plan-review-ui` vs `mcp:<tool>`
- tier may be free / demo-key; **must still accrue**

Source of truth: existing inbound ledger (`source-obligation-meter.ts`, migration 009 per 2026-07-29). `/icc/activity` and `icc_activity_list` read that ledger. Do not create a second ledger that can diverge.

## C5 — Purge selectors visible

SQL count of ICC-tagged atoms for IBC2018P6 > 0. Portal footer names the two selectors. No purge UI. No actual purge on this card.

## Demo format (amends 2026-07-04 play, format only)

Was: brief extension + Command Center meter.

Is:

1. Complete gated plan-review on Vercel (F1-F7 + map + letter + files)
2. Finished MCP (Codex tools + Smart Files + catalog)
3. ICC activity portal at `/icc/activity` on the same host, plus MCP `icc_activity_list`

Is not: PE ICC citations on. Is not CC as the portal. Decision `_decisions/2026-07-04_icc_poc_play.md` remains active for citation + no-republish + visible metering; the screens change.

## Walk

Executor runs `_inbox/2026-08-16_icc_demo_walk.md` after URLs are filled. A planner who was not in this chat must not need to ask which parcel or which book.

## Out

G-50 SaaS signature. public-paid migration. Circle outbound. Self-serve keys. DNS. Directory. G-52 MyGov. G-53. IPMC `--apply`. Dropping Smart Files tables. Training LLMs on ICC verbatim.

## Close

`_inbox/2026-08-16_icc_compliance_container_close.json` plus program `_inbox/2026-08-16_icc_demo_close.json`. Cite WDLL 18-21. Record: live IBC section count with query, IPMC count (expect 0), ingest SHA, UPDATE row counts, anon list_jurisdictions (no icc-model-code), portal JSON with at least one UI source row and one MCP source row (redact secrets), walk dry-run, residuals named.
