---
date: 2026-09-07
topic: Reports + Courthouse Program scoped, WDLL filed and amended live, OPS-16 P-120 opened, real fabrication bug found and fixed, multi-thread coordination with doc-repo-6f/cente-67/cente-c1/cente-65 established
agent: claude_code (planner, doc_repo integration seat)
plan_row: P-120 OPENED (OPS-16 AMENDMENTS table); item 17 split into 17a/17b-gate/17b/17c same day per doc-repo-6f's finding; item 27 dependency corrected same day
memory_graded: feedback_active_program_management_mode (new memory written this session)
related:
  - _inbox/2026-09-07_reports_courthouse_program_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_operations/OPS-20_thread_coordination_index.md
  - _inbox/2026-09-07_engine_absence-vs-presence-atom-filtering_finding.md
  - _decisions/2026-09-04_p32_wave1_customer_done.md
  - _decisions/2026-09-04_p32_wave2_customer_done.md
  - _catalog/seat_register.json
---

## What was done

Started as a QA review of three downloaded Smart Site reports (Feasibility Study, X-Ray, Flood & Drainage for parcel 48021:47595) and grew into a full program. Read the live report/chat architecture across `hauska-engine`, `hauska-map`/property-explorer, and `legacy-design-tools`/api-server rather than assume from docs: found the report/PDF pipeline has zero LLM narrative path while `@workspace/briefing-engine` (dual Grok/Claude-Sonnet-4.5, with a working citation validator) already serves Smart Site's live "Research this" chat via `brokerageBrief.ts`/`brokerageBriefLlm.ts`. Corrected two of my own early misreads mid-session on operator pushback: conflated Property Brief with SmartSite (Property Brief/the chrome extension are legacy, superseded, being retired — not the same system); initially misjudged the "context-aware LLM serving the UI" as separate plumbing when it's the same `briefing-engine` package reached through a richer context-building route.

Compared against a real professional-engineer feasibility report (Cude Engineers/Brinkmeyer, extracted via `pdftotext` after the API's PDF reader failed) to ground the comprehensiveness ambition in something concrete rather than abstract. Ruled out multi-parcel/tract-assemblage support permanently — operator's own framing: the MCP companion app is the multi-parcel/portfolio-research layer, not the report engine. That in turn surfaced a real gap: Feasibility and Flood & Drainage have zero MCP tool exposure (Site Plan and X-Ray/dossier already do), which became item 27.

Filed `_inbox/2026-09-07_reports_courthouse_program_WDLL.md` as an approved WDLL (26 items at filing, later 30 after amendments), opened OPS-16 **P-120** the same session. Dispatched by direct cross-session messaging (not `dispatch.mjs` hand-carry) to three live lane sessions: `cente-67` (hauska-engine, most of the build), `cente-c1` (legacy-design-tools), `cente-65` (new session, hauska-mcp-server, item 27). A fourth peer, `doc-repo-6f`, stood up mid-session as a cross-roadmap coordinator across three concurrent doc_repo threads (reports, data pipeline, UI QA) — verified as operator-authorized directly with Nick before treating its coordination requests as binding, per standing peer-verification discipline.

Real work landed same session, independently verified rather than trusted on report: item 1 (existing-structures data source) confirmed correct via a real live PDF generated against the actual production serving revision. Item 14 (9-defect QA batch) merged (`hauska-engine#398`) after all nine were reconfirmed live against production *before* fixing; surfaced a real fabrication bug in the process — `composeFeasibilityModel` was filtering atoms by `entityType` alone, ignoring the `absence` discriminant, so an honest "checked, found nothing" well-fact/special-district-fact/rrc-pipeline-fact/building-footprint atom rendered as a present fact. Filed as its own finding doc since it's a correctness-class bug, not a one-off; cente-67's bounded hauska-engine grep found no other repeat of it, with one edge (`rail-served.ts`'s actual executable logic) explicitly left unchecked for whoever owns that surface. Item 19 (named discharge point) went from "not scoped" to merged (`hauska-engine#400`) same session, Bastrop-scoped honestly, tested against real live ArcGIS hydrography data.

doc-repo-6f found and corrected two real gaps in the WDLL I'd written underspecified: item 27's dependency on item 6 was my own soft sequencing preference never marked as such (cente-65 building ahead of it wasn't a violation); item 14's grade was sitting blank despite being merged-not-deployed. Also found the 21 held courthouse jobs were being treated as one population when they span four counties with materially different risk (McLennan's four will honestly refuse; Hays is unverified for a defect class that already burned McLennan once) — item 17 split into 17a/17b-gate/17b/17c, item 15 recorded as a hard predecessor it was missing, and the acceptance check rewritten to require the operator's own execution rather than accept a decision record as sufficient (the record already existed and was independently re-verified accurate, but doesn't discharge the item).

Ran a full, rigorous 30-item status enumeration on operator demand (SERVING/MERGED_NOT_DEPLOYED/IN_FLIGHT/NOT_STARTED/BLOCKED/UNKNOWN, no guessing) after multiple prior updates had been too soft. Found and reported real gaps while compiling it: item 24 (broaden exhibit set) was never assigned to any lane; `cente-c1` had not responded across three direct requests. Traced `cente-c1`'s actual seat via `_catalog/seat_register.json` (`legacy-design-tools-shared-reader`, standalone clone at `P:/tmp/legacy-design-tools-shared-reader`) for the operator to open a fresh window against, rather than guess from conversational fragments. Before that window was needed, `cente-c1` replied: the "silence" was a real dispatch-delivery gap (my messages hadn't arrived until just then) plus a legitimate higher-priority operator-approved production deploy in progress with `doc-repo-2c`.

## What was learned (changes to ground truth)

**The report and chat pipelines are not architecturally separate systems** — `@workspace/briefing-engine` already serves both, reached through different context-building routes (`brokerageBrief.ts` for chat, nothing yet for reports). Building item 6 is wiring an existing engine to a new caller, not building new LLM infrastructure.

**Nothing merged tonight across the whole program is actually live.** `hauska-engine-api` serves a Sep-4 revision, `hauska-mcp-server` Sep-3 — every PR landed this session (items 14, 19, 27) is real, tested, and MERGED_NOT_DEPLOYED, not SERVING. This is the dominant state across the board and should not be read as less-than; it's the honest state of a fast-moving night, not a stall.

**Absence-vs-presence atom filtering is a real, if apparently contained, failure class.** One genuine instance fixed (4 atom families in `hauska-engine`); the same mistake was NOT found repeated elsewhere in that repo on a bounded check, but `hauska-mcp-server`, `legacy-design-tools`, and `rail-served.ts`'s actual executable logic (as opposed to its correctly-documented spec) were explicitly not checked and remain open.

**`cente-c1`'s seat is `legacy-design-tools-shared-reader`** per `_catalog/seat_register.json`, a standalone clone at `P:/tmp/legacy-design-tools-shared-reader`, not something inferable from session names alone.

**The full `cente-c1` story, confirmed via `doc-repo-6f` after the fresh-window prompt was drafted but before it was needed:** not a stuck session and not negligence. Two real causes stacked: a genuine cross-session message-delivery gap (this program's dispatch arrived in its queue only hours after being sent, confirmed on both ends), and, separately, `cente-c1` had correctly frozen for 4+ hours on an `AskUserQuestion` dialog rather than execute a production deploy on a relayed claim of operator approval — it waited for the operator to answer directly rather than trust a secondhand account. Worth carrying forward as a clean, real example of the permission-laundering refusal this operation's standing doctrine calls for, not a failure mode. Separately, my own board-resend to `doc-repo-6f` failed to arrive once (a second, unrelated instance of the same delivery-gap class tonight) and had to be resent with `P-120` item-number prefixes after `cente-c1`'s queue received an ambiguous bare "item 1" from two different senders/programs one minute apart.

## What's still open

Item 6's endpoint-contract question (does `isBrokerageServiceCaller`/`requireBrokerageAuthOrServiceToken` in `brokerageBrief.ts`'s `/research/chat` already fit hauska-engine's needs) — `cente-c1` will check once past their current production deploy. This blocks the entire narrative spine (items 5-13).

`cente-c1`'s full item queue (2, 3, 4, 15, 16, 21, 23) is confirmed NOT_STARTED, correctly deprioritized behind a time-critical production deploy, not neglected.

Courthouse: item 17a (Bastrop re-run) waits on item 15's deploy; the operator has confirmed personal execution once ready. Item 17b-gate (Hays verification) is unassigned. Items 18/20/21 stay held pending the spine landing, per operator ruling; item 21 additionally needs the HIFLD-staging-location question resolved with `cente-c1`. Item 24 needs a lane assigned — genuine gap, not yet fixed. The jurisdiction-slug leak (X-Ray's raw `bastrop_city_tx`) stays deliberately unfixed pending item 7, since it may resolve for free once X-Ray stops using its current caller-supplied-brief input path.

`_STATE.md`/`00_current_state.md` regeneration is deliberately deferred this close: no `_state/<seat>/STATE.md` namespace exists for this coordinating role in the current seat schema (govtech/markets/property/shared/substrate/systems/trading), and multiple sessions are actively committing to this same shared checkout tonight — hand-editing a many-writer snapshot file under that condition is exactly the collision risk the 2026-08-20 protocol revision exists to prevent. `doc-repo-6f`'s OPS-20 index is serving that cross-thread orientation role tonight instead.

## Suggested canonical doc updates

None beyond what's already been made live this session (`_inbox/2026-09-07_reports_courthouse_program_WDLL.md`, OPS-16 P-120, the absence-filtering finding doc). The WDLL itself is the durable tracker for this program going forward — future sessions should read it directly rather than reconstruct scope from session summaries.
