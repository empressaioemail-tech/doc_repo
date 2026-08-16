---
id: 2026-08-16_mcp_wdll_monetizable_tested_discoverable
title: WDLL — Hauska MCP functional, tested, monetizable, discoverable (SUPERSEDED)
status: superseded
last_updated: 2026-08-16
superseded_by: 2026-08-16_icc_demo_program_WDLL
applies_to: portfolio
owner: nick
related: [2026-08-16_mcp_honest_current_state, 2026-08-16_c_wdll_lane_c_plan_review, _architecture_homes/03_mcp_gate_and_agent_surface, 29_mcp_surface_tier_model, 14_pricing_framework, 28_mcp_first_product_design, 90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-08-15_icc_first_sdk_customer]
---

# WDLL: Hauska MCP Server as a buyable gate

**SUPERSEDED 2026-08-16.** Do not execute. Wrong altitude for this program (Circle, self-serve, DNS, directory). Successor: `_inbox/2026-08-16_icc_demo_program_WDLL.md` container B `_inbox/2026-08-16_blueprint_mcp_icc.md`. Keep `_inbox/2026-08-16_mcp_honest_current_state.md` as recon input.

Date: 2026-08-16  Status: superseded
Operator approval: none (never approved)
This is a program card, not one dispatch. Items stack. A later OPS-17 amendment should split them into G-rows (suggested IDs below are proposals, not baseline edits).

Does not take the L26 atoms slot. Does not create a second MCP server. Does not put a checkout on Command Center. Does not charge for Layer 1. Does not charge for a record that cannot open with evidence. ICC is the first SDK customer. Smart Files write tools are a named optional early item, not the definition of monetizable.

## Done looks like

An unknown agent operator can find the server at a public hostname that is the MCP, not the SmartSite lander. They can call Layer 1 catalog tools without a key and get cited atoms. They can sign up, receive an `X-Hauska-Key`, and land on the Decision B ladder (Free / Builder $49 / Pro $199). A Layer 2 call above the free cap is refused or charged through the SDK on the Circle rail. The meter record names the atoms consumed. ICC-derived atoms are platform-internal until the agreement flips them to public-paid, and the meter attributes them by hard actor reference, not regex. Paid-tier limits are proven able to fire. Directory listing happens only after the catalog path and the paid path have both been live-probed.

Smart Files create/upload/share may exist as tools on this same server. Plan review tools exist only after Lane C G-51. Neither of those is sufficient to call the server monetizable.

## Thesis check (this card)

- Brand: Hauska is the gate. Codex is the plan-review and code-intelligence hat on the same server. Aligned.
- One MCP server: aligned. A second server is a fail.
- MCP-first: aligned if product functions land as tools after they are true, not as wrappers of dead paths.
- Layer 1 free / Layer 2 paid: aligned. Inverting that is a fail.
- SDK is settlement, MCP is meter: aligned. Circle is the fiat rail. Fake checkout URL is not settlement.
- Command Center non-commercial: aligned. No CC checkout.
- Tenant sovereignty: tenant-private never pools. Files tools stay tenant-private by default.

## Acceptance items

### A. Functional substrate (do this before advertising anything)

1. **Honest current state is the Start card companion.**
   | check: `_inbox/2026-08-16_mcp_honest_current_state.md` exists. Tool count re-probed on the serving revision.
   | grade: [ ] | depends on: nothing

2. **Catalog path works on the serving revision.** `search_atoms`, `get_atom`, `list_jurisdictions`, `get_property_atom_chain` return store truth for a known Bastrop parcel and a known public-free code atom. Retrieval 401 and retrieval-health-404-as-ok are both gone.
   | check: live tools/call with no key (Layer 1) and with a reporting+platform_internal key (tenant-private / owner-fact withheld vs held as designed).
   | grade: [ ] | depends on: 1

3. **Health does not lie.** `/health` retrieval dependency is non-200 when search/get cannot run. Rate-limit store still postgres-primary.
   | check: live `/health` JSON. A forced retrieval miss flips the dependency out of `ok`.
   | grade: [ ] | depends on: 2

4. **Cotality paths fail closed.** Any tool whose copy or adapter still names Cotality either is removed or returns a typed extinguished error with zero credential use.
   | check: grep of serving image or repo at the serving SHA plus one live call that cannot 502/OAuth.
   | grade: [ ] | depends on: 1

5. **Contract pin is current.** MCP depends on the published `@empressaio/atom-contract` range the program actually ships. Duplicate `@hauska/atom-contract` is gone or explained.
   | check: `package.json` on the serving SHA vs `npm view @empressaio/atom-contract version`.
   | grade: [ ] | depends on: 1

6. **Optional: Smart Files write tools on this server.** `create_smart_file_folder`, `upload_smart_file`, `share_smart_file_folder` call the files Cloud Run, refuse `cortex-api`, default `tenant-private`. List/read already retargeted (G-58).
   | check: live tools/call as a product-keyed caller creates a folder that the QA UI also lists. Anon is refused.
   | grade: [ ] | depends on: 2
   | note: this is catch-up for Lane A. It does not unblock Lane C. It does not make the server monetizable.

### B. Tested (prove the gate before selling it)

7. **Negative auth matrix.** No header = public only. Bad key = 401. Product-gated tool without that product = gated error, not empty success. Bearer header is not a silent public confuse.
   | check: four live calls recorded. Empty-success is a fail.
   | grade: [ ] | depends on: 2

8. **Limiter fires on free and on paid.** Anonymous rpm still 429 with `band` and `tier` in the body. A paid key above its Decision B cap 429s or charges; a paid key under cap does not 429 at the free cap.
   | check: L19-style harness plus a paid-key run (L19 paid-tier was NOT TESTED). Window type (calendar minute vs sliding) named in the 429 body.
   | grade: [ ] | depends on: 2

9. **Mechanical probe suite in CI.** A workflow hits initialize + one public tool + one gated refusal against a stub or a named live smoke. A serving deploy that breaks initialize cannot go to 100% without a canary.
   | check: CI conclusion string success on the MCP repo. Canary-then-shift on Cloud Run.
   | grade: [ ] | depends on: 2, 7

### C. Plan review tools (after Lane C, not instead of it)

10. **Codex gate re-grade after G-51.** Existing `codex_*` tools call the proven functions. F2 has no Cotality. Adjudication write remains engine ingest; MCP fetch reads it back.
    | check: Lane C close exists. Live tools/call for finding generate, override write, briefing fetch on a real engagement.
    | grade: [ ] | depends on: Lane C item 11, this card item 2

11. **No second server.** Plan review, files, catalog, map, reporting stay one process, four gates.
    | check: `gh` repo count for MCP servers remains one commercial server. ECI internal endpoint if it exists is named and non-commercial.
    | grade: [ ] | depends on: 10

### D. Monetizable (Lane D + SDK; this is the money)

12. **Self-serve key issuance.** An unknown operator can obtain an `X-Hauska-Key` and a Decision B tier without a human mint for the common case. Rotate and revoke exist.
    | check: live signup path. A newly issued key initializes and calls one allowed tool. Revoke then 401.
    | grade: [ ] | depends on: 7, 8
    | suggested row: new G-6x (not in baseline)

13. **Meter record is a reasoning-call.** Every paid call writes which atoms were consumed and their accessPolicy. Layer 1 calls do not create a charge. Typed absence does not create a paid hit that pretends content exists.
    | check: SQL or ledger row for one Layer 2 call. A Layer 1 `get_atom` on public-free produces no charge row.
    | grade: [ ] | depends on: 12

14. **G-30 + G-17.** ICC atoms are not public-free by ingest hardcode. Meter attributes by `sourceActorDid` plus book_id plus section_id, not allowlist/regex.
    | check: store query zero ICC public-free. One live citation resolves the actor from the field. Anonymous `list_jurisdictions` omits icc-model-code until G-50.
    | grade: [ ] | depends on: 13
    | existing rows: G-30, G-17

15. **Circle rail is real.** A Builder-tier overage or a first paid Layer 2 call creates a Circle payment (or USDC settlement) that is verified by webhook, not a fake checkout URL. Take rate number inside 1.5 to 2.5 percent is written at that first call.
    | check: one sandbox or live payment object. `generateFiatCheckoutUrl` no longer returns a silent fake. Hauska Inc. regulatory posture still routes to Nick; this item does not pretend KYC is done.
    | grade: [ ] | depends on: 13, 14
    | existing rows: G-23, G-50 (agreement + public-paid flip)

16. **G-50 first SDK customer.** ICC SaaS agreement executed. Atoms that the agreement covers flip platform-internal to public-paid. Command Center, Vertosoft $25k, and ATX Bulls are not this customer.
    | check: signed artifact named. Store accessPolicy migration verified. Decision 2026-08-15 honored.
    | grade: [ ] | depends on: 14, 15

### E. Widely discoverable (last, because a listing of a broken catalog is a lie)

17. **Public hostname is the MCP.** `mcp.hauska.dev` (or a named substitute) resolves to the Streamable HTTP transport. `hauska.dev/mcp` is MCP docs, not the SmartSite lander. `llms.txt` and `.well-known/agents.txt` are the agent catalog, not robots/lander HTML.
    | check: live GET/POST 2026-08-16 failures are inverted: DNS exists; `/mcp` is not 114-byte lander; `llms.txt` lists tools.
    | grade: [ ] | depends on: 2, 3, 9

18. **One directory listing filed after the catalog is true.** Anthropic MCP directory or the then-current equivalent. awesome-mcp-servers only if the README claim matches live tools. Tagline stays "cited municipal answers," not a tool-count brag.
    | check: public listing URL. Mystery shop: a stranger follows the listing and completes item 2 without a human.
    | grade: [ ] | depends on: 17, 7, 8

19. **Honest close.** Names what is still not a marketplace. Names that Pro-tier jurisdiction stream (Decision B) has no delivery mechanism until a later card. Does not claim 1,000 concurrent anonymous sessions. Does not claim G-53.
    | check: close JSON. Current-state doc updated. Tool count travels with the serving revision and the date.
    | grade: [ ] | depends on: 16, 18

## Out of scope

Second MCP server. Per-atom MCP split. Command Center checkout. Stripe. Remounting Smart Files on cortex-api. L26 `--apply`. G-58b DROP. Applicant-facing plan review. Bluebeam. Visual design. Money-transmitter registration (Nick / Hauska Inc.). Inventing an MCP web catalog UI (v2, settled deferred).

## Suggested split into plan rows (for an OPS-17 amendment, not done here)

- G-6x MCP substrate repair (items 2-5, 7-9)
- G-59b Smart Files write tools (item 6) or fold into a Lane A follow-on
- Lane C card already owns G-15..G-51; this card item 10 is the MCP re-grade after that
- Existing G-17, G-23, G-30, G-50 own items 14-16
- G-6y MCP commercial front door (items 12-13, 15 hostname-independent)
- G-6z MCP discoverability (items 17-18)

## Amendments

None. Draft.

## Finish card (graded at close)

Empty until close.
