---
id: 2026-08-29_p91_build_close
title: P-91 build close. p555 and p542
date: 2026-08-29
status: closed 2026-08-30 (operator Connect grade owed; item 16 held)
plan_row: P-91 (items 5, 10, 12, 13, 16, 18, 29, new 31-35), P-92 (rails at first paint pulled forward)
lane_planner: integration seat, P:/doc_repo main
build_plan: _inbox/2026-08-29_p91_build_plan_p555_p542.md
cp1: _inbox/2026-08-29_p91_build_plan_p555_p542.md section 6
cp2: _inbox/2026-08-29_p91_build_cp2.md
decision: _decisions/2026-08-29_p91_open_stays_a_turn.md
---

# missionPremise

Every opened parcel must land in Claude's context (operator ruling 2026-08-29). Claude mounts one app instance per tool call and acknowledges `ui/message` without content (spec `McpUiMessageResult`; Anthropic instance-supersession doc; two independent harnesses). So Open stays a turn, the panel under the tool row is the honest surface for parcel, miss, and refuse, the board acknowledges the click instead of claiming silence, and the board carries rail states from first paint so it is a screen rather than forty gold dots. Source: `_inbox/2026-08-29_p91_mcp_app_deep_dive.md` sections 2 and 3.2; `_decisions/2026-08-29_p91_open_stays_a_turn.md`.

# completionPredicate

Build plan section 2, verbatim: p555 and p542 serving digest-pinned at 100%, traffic read by field name; a Connect miss Open paints the county-correct or unbaked sentence under the tool row with the board reading "Sent to chat"; gold paints as on p554; a fresh screen paints rail glyphs; `ask_the_map` returns `not_ready`; the served iframe script is exercised by the suite; a cortex lookup throw refuses and writes nothing. Items 1 and 2 are the operator's Connect walk (`_inbox/2026-08-29_p91_p556_connect_grade_prompt.md`); the rest are graded here with pasted output.

# scopeBasis

Build plan section 3. Out, by name: Free-tier gate change (pricing law, deep dive decision 2 open), `GET /saved-properties` limit (P-92), `ask_the_map` wiring (own item after this cut), `reason` column and expression index (migrations), share tool, flood-study intake.

# Repos, branches, PRs

| Repo | Branch | Clone (registered 2026-08-29, property seat) | PR | Commits |
| --- | --- | --- | --- | --- |
| legacy-design-tools | `feat/p91-wave-h-stone` | `P:/tmp/legacy-design-tools-p91-stone` | #551 | `ef4be437` p554 record; `67c80b92` merge main; `370359a5` server cut (S2); `2cd7e108` iframe cut (S1); `3f360e5b` shared resolve-core test |
| legacy-design-tools | `feat/p91-cortex-leftovers` | `P:/tmp/legacy-design-tools-p91-cortex-leftover` | #550 | `fca62463` p541 record + fail-closed cut (S3); `6351abaa` merge main; `7ab60a1c` shared resolve-core test; `1413936c` rails at first paint (S4); `a8cf3ef2` brief-miss probe through the `cortexNodeLookup` seam (CI fix) |

Merge order: #550 first (the shared test asserts its resolve core), then merge main into `feat/p91-wave-h-stone`, then #551. CI conclusion strings recorded at merge time, never inferred from exit codes.

#550: head `a8cf3ef2`, `Test: SUCCESS`, `Typecheck: SUCCESS`, all L5/SS/L17 greps `pass`, mergeStateStatus `CLEAN`; squash-merged 2026-08-30T04:34:07Z as `42d56c32`. One CI-only failure on the way (`1413936c`): two records-request route suites failed to collect because the direct `txgioAddressResolve` import reached a module-load read of `txgioParcel` behind a hand-listed `@workspace/db` mock; fixed at the seam in `a8cf3ef2` (route behaviour identical; serving image `1413936c` not rebuilt).

# Sub-agents (one level; none ran git; every deliverable read and rerun by the planner)

| Agent | Return | Planner rerun | Verified by violation |
| --- | --- | --- | --- |
| S2 server | 9 files, 126 tests | 123/126 (3 cross-package, documented) | reason-stripped fixture throws; strict schema does not echo keys; health degraded when issuer unset; smoke step exit codes on five bodies |
| S3 cortex fail-closed | 13 files + 4 new tests | 99/99 | lookup throw refused (was written unresolved); route mutated to null lookup fails 2; leading-zero probe null before, hit after |
| S1 iframe | 3 files, 144 tests | 141/144; 12/12 instrument against TS source and against a Dockerfile-flag esbuild bundle | five source mutations fail exactly their fixtures |
| S4 rails | 4 files | 100/100 | unread-for-miss fails 3; budget disabled fails the started-count assertion |
| S1b batch flat rails (p556) | 3 files | live batch JSON through the exported parser yields the six real states; iframe suites 37/37; package 146/146 after main merged | stub-only revert fails exactly the two live-JSON fixtures |

# Instruments (tracked)

`_inbox/2026-08-29_p91_iframe_instrument.mjs` and `_inbox/2026-08-29_p91_iframe_harness.mts` (p554 record; they deliver events without `source` and refuse under p555 by design). `_inbox/2026-08-29_p91_iframe_instrument_p555.mjs` (the 4.1 contract; takes a module path; 12/12 against the source and against the esbuild bundle). In-tree: `artifacts/smartsite-mcp/tests/mcp-app-served.test.ts` (15 fixtures over the served script), `src/lib/__tests__/txgioLookupParcelNodeForScreen.test.ts` (fake db interprets the rendered SQL).

# Deploys

p555: `_inbox/2026-08-29_p91_p555_canary_deploy.md`. Revision `smartsite-mcp-00059-jab`, digest `sha256:82c243026177ed48e126f67b7402b9572c3cc926887e82498bf20bf18ae6e697`, Cloud Build `111baa4b-13bd-4767-9e4f-3b4addb324f8` SUCCESS; canaried at 0%, tag `/health` ok; shifted to 100% after p542; superseded by p556 minutes later.

p542: `_inbox/2026-08-29_p91_p542_deploy.md`. Revision `cortex-api-00666-cuf`, digest `sha256:da92e63a23054c68cf0e7ab22e627c41db810f31040c71536edbee8ff34904a8`, Cloud Build `25645912-3d25-4015-b1f3-52280b57d9a1` SUCCESS, built from `1413936c`; canaried at 0%, tag `/api/healthz` ok; `--to-tags=p542=100`; traffic by field name `revisionName=cortex-api-00666-cuf percent=100 tag=p542`; revision digest equals the AR digest.

p556: `_inbox/2026-08-29_p91_p556_deploy.md`. Revision `smartsite-mcp-00061-zik`, digest `sha256:3de92afc156dba76182f36c2bf49c4d261921d54e9f5bfa603c0eff70fc4f559`, Cloud Build `54e5a6b4-9ea1-4971-a5d8-f7a266963c59` SUCCESS, built from `66b543bb`; canaried, tag `/health` ok, `--to-tags=p556=100`; traffic by field name `revisionName=smartsite-mcp-00061-zik percent=100 tag=p556`; prod `/health` names that revision; revision digest equals the AR digest. Serving pair at close: p556 / p542.

Live wire on the serving pair, through the planner's own connector: `get_smart_site 48021:900099` returns `{"parcels":[],"notFound":["48021:900099"],"reason":"parcel_not_found","parcelExists":false}`; `ask_the_map` returns `not_ready` with the item-34 reason; `create_screen` on the three walk lines returns resolved rows carrying `stub` and `stubRead: ok` with the unresolved row bare, and `list_screens(screenId)` returns the same on read (screen `55b7067e-beb5-475c-888c-bc4741d19a9b`, planner account); the batch stub returns two parcels with flat rails plus `notFound`.

# Counts and their counting rules

Tests are vitest pass counts in the named package on the named clone, run by the planner after the sub-agent returned; a "cross-package" failure is `artifacts/smartsite-mcp/tests/pe-screen-query-resolve.test.ts`, which imports the api-server resolve core and is red on whichever branch lacks the matching core. Instrument counts are checks passed over checks defined in the named file.

# Constraints honored

Catalog 13 (blocked tools stay listed). No map, listing feed, or web content in the panel. No Cotality. No `--set-env-vars`. Digest-pinned deploys with existing service config carried. No migration. Sub-agents did not commit. Commits by explicit pathspec. Both clones registered before the first write; the gate was proven to refuse a wrong branch. Item 13 unchanged. Free-tier gate unchanged.

# What remains open

Operator Connect grade on p556/p542 (`_inbox/2026-08-29_p91_p556_connect_grade_prompt.md`): O1 boot strip `caps=`, O2 gold Open (board line before and after Send; new panel), O3 miss Open (sentence under the tool row), rails on the board, batch board. Item 16 stays held gold n=1 until that walk; completion-predicate items 1 and 2 are the operator's. Free tier on MCP (deep dive decision 2) unchanged. `ask_the_map` wiring (subject from the bake, `.strict()`, PE meter on the service path) is its own item. `status: degraded | refused` bodies still paint the empty copy (no wire field). A `SERVE_REFUSED` snapshot read on a screen row lands as `error`/`unread`, not `refused`. Total create budget not bounded to the 25 s contract; 8 s timer still counts pool-queue wait; started stub reads have no per-row cap past the 6 s budget. #551: head `150e5933` (main merged in after #550 landed; package 146/146 locally), `Test: SUCCESS`, `Typecheck: SUCCESS`, all greps `SUCCESS`, mergeStateStatus `CLEAN`; squash-merged 2026-08-30T04:46:10Z as `cfea2b6d`. Main tip at close: `cfea2b6d`. Serving pair p556 / p542 was built from branch commits `66b543bb` and `1413936c`, both ancestors of the squashed content; no rebuild from main was made.

leave_behind:
  - item: expression index on (county_fips, ltrim(prop_id,'0')) and a reason column on pe_screen_rows (migrations after 0088)
    owner: property seat
    plan_row: P-91 items 16, 18 (backlog)
  - item: _state/property/STATE.md carries no P-91 serving line (p556 / p542); this checkout cannot write a seat namespace
    owner: property seat
    plan_row: P-91
  - item: stone clone stash "p91-stone: stale api-server dup of leftover hunks" (never commit; drop when the clone is retired); untracked cloudbuild.p547..p554 yamls in stone and p540/p541 in leftover
    owner: integration
    plan_row: P-91
  - item: A13 board 4316b571 still holds 48021:900099 written resolved from before the check
    owner: property seat
    plan_row: P-91 item 16
  - item: askTheMapArgsLeakInternalFields / sanitizeAskTheMapErrorBody exported and tested with no src caller until the wiring item
    owner: property seat
    plan_row: P-91 item 34
  - item: the two p554-recorded instruments deliver events without source and refuse under p555+ by design
    owner: integration
    plan_row: P-91 item 16
