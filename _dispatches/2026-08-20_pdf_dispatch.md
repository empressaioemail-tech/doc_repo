CANON-PREAMBLE v664d6256

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
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

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: G-103, G-104 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: hauska-engine

# Tagged PDF render service (504.2.2)

## The defect you are fixing, as measured

Generated PDFs across the SmartCity OS product line fail Revised Section 508 criterion 504.2.2. This is measured, not suspected. It is the single "Does Not Support" row in a completed Accessibility Conformance Report going to a government distributor (Vertosoft), which makes it the highest-value defect in the product line right now.

Two paths fail, for two different reasons.

**Path 1 — the site-plan export.** Repository `empressaioemail-tech/hauska-engine`, at `packages/engine-core/src/site-plan/pdf/render.ts`. Server-side `pdf-lib`. It produces a PDF with no structure tree, no document title and no declared language. Its MORE SERIOUS defect is that text is drawn glyph by glyph: `render.ts` around line 373 says so in its own source comment, words to the effect of "tracked runs are drawn glyph-by-glyph with an em-based advance". The content stream therefore has no word units. Extracting text yields 413 lines of which 268 are a single character, 64.9 percent. A version of that file with tags bolted on would pass an automated checker and still be read one letter at a time by a screen reader. Tagging alone does not fix this path; the text-run construction has to change with it.

There is already a `SHEET_STANDARD_v1.html` in that same `pdf/` directory. Read it before designing anything. A semantic-markup path may already partly exist, and reusing it beats inventing a second one.

**Path 2 — the legacy SmartCity export.** Repository `empressaioemail-tech/smartcity-os`, client-side, `jspdf@^4.2.1` with `jspdf-autotable`. Entry points: `client/src/lib/pdf-utils.ts`, `client/src/lib/reportPdf.ts`, `client/src/components/ai/ai-report-pdf.ts`, `client/src/components/smartcity/department-pdf.ts`. This path draws real vector text, NOT rasterised images. Do not repeat the earlier claim that it rasterises, which was retracted after measurement. Its problem is that jsPDF has no tagged-PDF capability at any setting. That cannot be configured away, which is why the decision is to replace the generator rather than tune it.

## What to build

The decided remediation is one shared render service producing tagged PDFs from semantic markup, replacing both paths, plus an immediate metadata fix on the site-plan path landing ahead of it.

A reference implementation exists and is proven. The planner generated six tagged PDFs this session via Markdown or HTML into Chromium through Playwright, using `page.pdf({ tagged: true, ... })`. Measured on those six: structure trees of 156 to 1,098 elements, `/MarkInfo /Marked true`, `/Lang en`, title set, and 0.0 to 1.1 percent single-character extracted lines. Chromium's `Page.printToPDF` with `generateTaggedPDF` does the work; Playwright's `page.pdf({tagged: true})` exposes it. Take this approach unless you find a concrete reason it cannot work server-side here, and if you do, report the reason rather than silently substituting something else.

Work in this order and stop when you run out of road, reporting where you stopped:

1. Immediate metadata fix on the site-plan path: title, language, structure tree on the existing `pdf-lib` output. Cheapest real improvement; lands independently.
2. The shared tagged render service from semantic markup, with the site-plan path wired to it.
3. The legacy SmartCity export repointed at the same service.

Item 1 alone is worth landing. Do not hold it hostage to items 2 and 3.

## Acceptance tests, measured and not asserted

A generated PDF passes when ALL of these hold, each demonstrated with real command output:

- `/StructTreeRoot` present in the catalog
- `/MarkInfo` with `/Marked true`
- `/Lang` set
- document title set
- single-character extracted line share under 2 percent, counted as pypdf `extract_text()` split on newline, lines whose stripped length equals 1, over total lines. The failing case measures 64.9 percent by this exact rule, so you have a known-bad reference to compare against.
- the structure tree walked in `/K` order matches visual order on at least one sampled page. A tree in the wrong order passes every mechanical check and still fails a real reader.

Verify every check by violating it. Before reporting any check as working, run it against a deliberately broken input and confirm it fails. A check observed only passing has not been observed working. The planner caught two invalid instruments this session exactly this way; one metric ranked the known-defective file as BETTER than a good one. If a result looks convenient, distrust the instrument before believing the result.

## Hard constraints

Branch protection is live. Direct `git push` to `main` on `hauska-engine` is refused with GH006. Branch and open a PR with `gh pr create`. This is not a misconfiguration and must not be routed around. No `--no-verify`, no hook bypass.

Green CI is a courtesy, not a gate. No check is configured as required on these repositories, so green proves little and red must not be waved through. Read the actual failure. Cite CI by its conclusion string, never by a `gh` exit code.

Re-green against the current base. A moved base can make two independently green PRs merge red. `git rebase` is blocked here; use `gh api` update-branch.

Touch only `hauska-engine` and `smartcity-os`. Do NOT modify `smartcity-dashboards`, `smartcity-kit`, `smart-files` or `plan-review`. The planner is editing two of those right now and you will collide.

## Close artifact, required and machine-checked

Write your close record to exactly this path:

    P:/doc_repo/_inbox/2026-08-20_g103_g104_pdf_render_close.json

Valid JSON with at minimum: `row` (["G-103","G-104"]), `repos_touched`, `prs` (array of {repo, number, url, ci_conclusion}), `acceptance` (before and after single-character-line percentages plus the four structural properties), `detector_proof` (output showing your checks fail on a broken input), `not_done` (array of what you did not complete and why), and `leave_behind` (either "none" or an array of {item, owner, plan_row}). A close with no file at that path does not count as a close.

## What to report back

A plain factual record, not a narrative:

1. What you changed per repository, with file paths.
2. PR numbers, URLs, and CI conclusion strings.
3. Acceptance numbers as raw output, especially single-character-line share before and after.
4. Proof your checks can fail: output from running them against a broken input.
5. What you could not do and precisely why. An honest "item 3 not attempted because X" is worth more than a claim that does not hold.
6. Anything contradicting this brief. It is the planner's best current understanding and has already been wrong once this session. If the code disagrees, the code wins, and you should say so.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-20_pdf_cp1.json
  CP2: _inbox/2026-08-20_pdf_cp2.json
  CLOSE: _inbox/2026-08-20_pdf_close.json
