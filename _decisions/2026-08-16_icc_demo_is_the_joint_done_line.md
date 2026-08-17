---
decision_id: 2026-08-16_icc_demo_is_the_joint_done_line
date: 2026-08-16
owner: nick
status: active
related_canonical: [75n_icc_code_connect_catalog, 48_cortex_reporting_plan_review_spec, 80_adrs/adr_023_cortex_reporting_repo_designation, _decisions/2026-07-04_icc_poc_play, _decisions/2026-08-15_icc_first_sdk_customer, _decisions/2026-08-15_smart_files_is_a_product, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

MCP + complete plan review **are** the ICC offer. The people paying to access licensed IP watch that offer on ICC-demo, a separate portal. The done line is a live PoC: functionally complete gated plan-review, finished Hauska MCP, ICC-demo at https://icc-demo.vercel.app accruing to `did:hauska:actor:org:icc`. It is not a tab on plan-review-app, not a SmartCity consumer pass, not a one-engagement stub, and not a buyable catalog (Circle/directory). Apex DNS is held.

## Context

Operator 2026-08-16: "mcp + plan review = ICC", then correction: plan review must be complete from a functionality standpoint; MCP must be finished; those two combined equal ICC, with a portal where ICC sees their activity. First-pass WDLL stubbed F5/F6/F7/map/letter and treated MCP as an allowlist toy. A-003 reverses that. Housing still follows Smart Files. G-50 still glues demo + signed SaaS; this decision is the demo half only.

## Structural commitment check

- Sell reasoning, not data: citation + analysis, no verbatim ICC body (75n).
- Confidence earned, not asserted: determination carries atom ID + confidence object; override is an adjudication atom.
- Cost per jurisdiction: unchanged. ICC is a licensed source, not a county onboard.
- Dual interface: Vercel UI and MCP tools on one server. No second MCP.

## Recommendations to lock (planner executes these unless you change a name)

1. **Plan review housing.** Own public repo `empressaioemail-tech/plan-review` (https://github.com/empressaioemail-tech/plan-review). Own Neon DSN at `%USERPROFILE%\.empressa\plan-review.database_url` (never git). Own GCP project `plan-review-505715` (not hauska-prod, not legacy-design-tools-prod, not smart-files-505619, not smartcity-os-prod). Cloud Run service `plan-review` in us-east1. Vercel project `plan-review-app`. Planner does not subtree LDT.

2. **What lives where.** Engagements, findings, reviewer session, demo keys: plan-review Neon. File bytes: smart-files Neon (already live). Code-section / ICC atoms: hauska_mcp via MCP (already the catalog). Cortex-prod gets no new plan-review writes.

3. **Demo format.** Amends `_decisions/2026-07-04_icc_poc_play.md` format only. Screens: (a) complete gated plan-review, (b) finished MCP Codex+files+catalog, (c) ICC-demo on its own host https://icc-demo.vercel.app. Not a path on plan-review-app. Not PE ICC citations on. Not Command Center as the portal. Amended 2026-08-16 by `_decisions/2026-08-16_icc_demo_is_separate_portal.md`.

4. **Fixture.** Engagement A `48021:28286`. Engagement B `48021:27303` (required for F5). Project type `new-single-family`. IBC2018P6 required. IPMC2018P2 typed absence until L26 quiet. Tenant `icc-demo`. Personas `icc-demo/reviewer` on plan-review and `icc-demo/accessor` on ICC Demo. Rate `0.01` USD fixture.

5. **SaaS is not this card.** accessPolicy stays platform-internal. No public-paid flip. G-50 signed half stays OPEN.

6. **Atoms slot.** No second `--apply`. IPMC ingest waits. G-30 is a bounded ICC-row UPDATE plus ingest-code fix.

7. **MCP finished.** Fail-close Cotality for every key. Retarget `codex_*` at plan-review Cloud Run. Smart Files writes on this server. Add `icc_activity_list`. Do not delete 46 reporting tools. Do not ship Circle/DNS/directory on this card.

## Reversal criteria

Reverse housing if you want plan-review state on cortex-prod (rejected because L26). Reverse the second parcel only with a live-probed substitute that has a parcel-node. Reverse IBC-only if you want the demo blocked on IPMC ingest. Reverse `/icc/activity` on plan-review-app only if you create a separate ICC portal host before execute. Reverse the rate number by editing this file before execute.

## Dependencies

Depends on: G-58/G-59 Smart Files live, 75n PoC books, ICC actor fixture in the contract, inbound meter code (rate still null).
Blocks: remaining G-60 execution (API, Vercel, MCP finish, stamp). Scaffold unblocked 2026-08-16.
Does not block: L26 Texas ingest, G-58b DROP, G-52, G-53, Circle, `mcp.hauska.dev`.

## Counterparties

ICC (PoC demo audience; Ed Cilurso technical contact per 2026-07-04 play). Internal: Nick. Not: Bastrop as customer-facing, Vertosoft, ATX Bulls.

## Status

Active 2026-08-16. Operator approved the WDLL, confirmed still-out list, created the GitHub repo and GCP `plan-review-505715`, and has the Neon URL to write on disk. WDLL `_inbox/2026-08-16_icc_demo_program_WDLL.md` status approved.
