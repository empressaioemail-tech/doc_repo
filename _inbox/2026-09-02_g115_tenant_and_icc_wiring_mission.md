---
id: 2026-09-02_g115_tenant_and_icc_wiring_mission
title: Mission — G-115 items 1 and 4 (Bastrop tenant, ICC wiring fix)
status: active
last_updated: 2026-09-02
applies_to: plan-review
owner: nick
related:
  - _inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL
  - 90_operations/OPS-17_govtech_stack_plan_of_record
---

# Mission: G-115 items 1 and 4 — Bastrop tenant, ICC wiring fix

Start card: `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md` (approved 2026-09-02). This mission covers acceptance items 1 and 4 only — the two items with no dependency on each other or on anything else in the card, so they can land together in one lane.

## Standing constraints (binding, from operator approval — do not violate)

1. **Live Bastrop (`smartcity-os`, `smartcityos.io`, PermitFlow) stays 100% live and untouched.** Nothing in this mission touches that repo or that running service. If anything you build seems to require touching it, stop and report rather than proceeding.
2. **Additive only. Reuse existing data and component mapping — do not rebuild or restructure what already works.** `CODE_BOOKS`, `AVAILABLE_EDITIONS`, the actors/persona list, the citation-building path (`buildCitation()`), the absence taxonomy — all stay as-is in shape. You are adding a persona and adding a query path, not redesigning either mechanism.

## Item 1 — real Bastrop tenant/persona

`src/actors.mjs` currently hardcodes exactly two personas, both demo/QA (`template-city`/staff, and an icc-demo persona). Add one real Bastrop persona — working orgId `bastrop_tx` unless you find a reason the repo already uses a different convention (check `CODE_BOOKS["BASTROP-UDC"]`'s existing `bookId`/`editionId` naming, e.g. `bastrop_tx-bdc-2026-adopted`, for precedent before inventing a new one).

**Check (from the WDLL, verify by violation, not assumption):**
- A live upload/engagement created under the new Bastrop persona produces `entity_id`/`orgId` carrying the Bastrop identifier, not `template-city`.
- A cross-tenant read attempt — Bastrop persona reading a `template-city` engagement, or the reverse — is refused. Prove this by actually attempting it and confirming the refusal, the same way G-106's read-path scope work did earlier this week (403/refuse pattern, live-verified pre- and post-change).

**Access model, already decided — do not re-litigate:** operator accepted the current persona-list access model for this pilot (a small, named set of invited Bastrop staff), explicitly NOT gated on building real per-tenant auth first. Do not add an auth system. Do add the cross-tenant read refusal above — that is authorization-by-identity-check, not a new auth system, and it is required regardless.

## Item 4 — ICC (IBC/IPMC) wiring fix

`src/code-lookup.mjs`'s `CODE_BOOKS.IBC2018P6.sections` (and `IPMC2018P2.sections`) are `Object.freeze({})` — hardcoded empty. Real, licensed IBC 2018 content already exists in the substrate: 4,825 code-section atoms at `did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/<section>`, live-retrievable via `hauska-mcp-server`'s `get_atom` MCP tool with a codex-tier key (confirmed live 2026-09-02; the `plan-review-platform-key` secret already provisioned for this service from G-112 should already have the right tier — verify, don't assume). IPMC2018P2 may or may not have equivalent real content ingested; check before assuming it does or doesn't.

Build a live query path: when a section is requested against `IBC2018P6` (or `IPMC2018P2`, if real content exists for it), instead of only checking the static `sections: {}` map, call the substrate via `get_atom` (or the appropriate list/query tool — check what's actually available) using the real DID scheme (`did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/<section-number-with-dashes-for-dots>` — note `1001.1` in the substrate is stored as atom_did suffix `1001-1`; confirm the exact section-number-to-DID-suffix mapping live before hardcoding an assumption). Return a real citation (`editionId`/`bookId`/`sectionNumber`, sourced from the atom, not fabricated) when the atom exists; correctly fall through to existing typed-absence behavior when it doesn't.

**Check (from the WDLL, verify by violation):**
- A live matrix run citing a real IBC section (e.g. `1001.1`, confirmed real and live-retrievable as of this mission's filing) returns a genuine Pass/Fail with a citation sourced from the substrate atom — not typed absence for a section that actually exists.
- A genuinely non-existent or non-entitled section (e.g. a real-looking but wrong section number, or a book/edition outside the PoC entitlement) still correctly returns typed absence. Test this explicitly — do not assume the negative case still works after adding the positive path.
- Respect the PoC license constraints already documented in `75n_icc_code_connect_catalog.md`: never surface verbatim ICC body text to an end user, only our own analysis plus the section identifier/heading and a deep link. The existing atoms already comply (their `bodyText` is our own text, not verbatim) — do not change that shape when consuming them.

## Scope boundary

Do not attempt items 2, 3, 5, or 6 from the WDLL — those depend on this mission landing first, or are the operator's own action, not build work. Do not touch `smartcity-os`. Do not start on G-52 (a different, still-blocked row — no live feed exists). Do not modify the absence taxonomy's spelling or shape (G-113 already closed that).

## Close

Report back per the standing dispatch/close-artifact convention (`_inbox/<date>_<lane>_close.json` naming). Cite this mission and the WDLL's items 1 and 4 explicitly in the close.
