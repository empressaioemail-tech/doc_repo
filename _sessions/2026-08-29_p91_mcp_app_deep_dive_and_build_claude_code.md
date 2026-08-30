---
id: 2026-08-29_p91_mcp_app_deep_dive_and_build_claude_code
title: Session 2026-08-29. P-91 deep dive, ruling, build to deploy (p555, p556, p542)
date: 2026-08-29
seat: integration, P:/doc_repo main (read against 2847a20; main moved to 59ffa02 under the session)
plan_row: P-91, P-92
status: closing
---

# What this session did

Started from the handoff `_inbox/2026-08-29_p91_mcp_app_deep_dive_handoff.md` with the question "why does a miss Open paint silence after the tool returned". Read the write path, built a file-based instrument that runs the served iframe script against recorded host messages, and fanned five read-only reviewers (spec, iframe, server, product, cortex leftover). The mechanism is neither of the handoff's two: Claude mounts one app instance per tool call and acknowledges `ui/message` with no content, so no later result ever reaches the board instance, and the miss sentence was gated on state only the clicking instance held. Four URI punches had changed what the miss looked like, never which instance it reached. Write-up: `_inbox/2026-08-29_p91_mcp_app_deep_dive.md`.

Operator ruling in conversation: every opened parcel must land in Claude's context. So Open stays a `ui/message` turn, the panel under the tool row is the honest surface, the board acknowledges the click, and the board carries rail states from first paint. Decision `_decisions/2026-08-29_p91_open_stays_a_turn.md`; the prior seat's provisional `_decisions/2026-08-29_p91_open_is_not_a_second_instance.md` marked superseded (its own reversal clause 2 is the ruled path).

Operator go: "You are now the builder... spawn sub agents... go all the way to deploy." Registered the two P-91 clones under the property seat (`_catalog/seat_register.json`; the gate refuses git writes from every second worktree of one repo path, so standalone clones with their own path are the honest description; proven to allow on the registered branch and refuse a wrong branch). Build plan and wire contract `_inbox/2026-08-29_p91_build_plan_p555_p542.md` (CP1 in section 6). Four sub-agents plus one follow-up, one level, none ran git; every deliverable read and rerun by this seat, CP2 in `_inbox/2026-08-29_p91_build_cp2.md`.

# What shipped

`smartsite-mcp` tag `p556` (`smartsite-mcp-00061-zik`, digest `3de92afc...`) after p555 (`00059-jab`) served briefly; `cortex-api` tag `p542` (`cortex-api-00666-cuf`, digest `da92e63a...`). Both digest-pinned, canaried at 0% on a tag, health-gated, shifted, traffic read by field name. Records: `_inbox/2026-08-29_p91_p555_canary_deploy.md`, `_inbox/2026-08-29_p91_p542_deploy.md`, `_inbox/2026-08-29_p91_p556_deploy.md`.

Server: `get_smart_site` non-OK mapped once (404 single-id to `{ parcels: [], notFound, reason, parcelExists }`, 402 to `{ refused }`, both declared, `isError: false`); `run_report` stamps only on OK; `ask_the_map` blocked (`not_ready`, strict two-field schema that does not echo unknown keys; its dead handler removed; the live 400 was confirmed and then confirmed gone); `/health` uses the `/mcp` gate predicate and the deploy smoke asserts `.status == ok`; enum `source`/`status`; batch cap published; descriptions rewritten. Iframe: stateless `miss` (county-correct), unbaked, `refused`, `unreadable`, batch board (flat rails, p556), rails at first paint; board acknowledges (`Sent to chat. Press Send to open.`), dead only on no reply or error reply; `ev.source` guard; attribute escaping; one parser embedded by source and parity-tested; a served-script suite. Cortex: a lookup throw refuses and writes nothing (was a durable false absence pinned by the idempotent path); `add_to_screen` unique-violation path; brief 404 splits `parcel_not_found` from `baked_snapshot_not_found` with 503 on probe failure; leading-zero probe; timeout declared on the response; JSON error boundary on `/api`; resolved screen rows carry `stub` and `stubRead`, `stubsDegraded` on the screen, bake miss is `unknown`.

Live wire on p556/p542 through this seat's own connector: `900099` -> `parcel_not_found, parcelExists false`; `ask_the_map` -> `not_ready`; fresh screen rows carry stubs on create and on read; batch returns two parcels with flat rails plus `notFound`.

# What was wrong along the way (kept, not hidden)

The build plan's 4.2 named a nested `stub` on batch parcels that the server never sends; S1 built to it; a live probe after the p555 shift caught it; p556 fixed it. Lesson: a wire contract written from the plan is a claim; the probe is the check.

The cross-package test `artifacts/smartsite-mcp/tests/pe-screen-query-resolve.test.ts` existed in two versions and was red on one branch either way; one version now lives on both branches.

S3's direct import of `txgioAddressResolve` into the route made two records-request suites fail to collect on CI (hand-listed `@workspace/db` mock lacking `txgioParcel`); the isolate could not collect those suites locally. Fixed by routing the probe through the `cortexNodeLookup()` seam (`a8cf3ef2`).

# PRs

#550 `feat/p91-cortex-leftovers` (cortex): Test SUCCESS, Typecheck SUCCESS, squash-merged `42d56c32`. #551 `feat/p91-wave-h-stone` (server + iframe): Test SUCCESS, Typecheck SUCCESS, squash-merged `cfea2b6d` after main was merged in. Main tip at close `cfea2b6d`. Details in `_inbox/2026-08-29_p91_build_close.md`.

# Open

Operator Connect grade on p556/p542: `_inbox/2026-08-29_p91_p556_connect_grade_prompt.md` (O1 boot strip `caps=`, O2 gold Open, O3 miss Open, rails on the board, batch board). Item 16 stays held until that walk. Free tier on MCP (deep dive decision 2). `ask_the_map` wiring item. Migrations named as leave_behind (expression index on `ltrim(prop_id,'0')`, `reason` column). `status: degraded | refused` bodies still paint the empty copy. The A13 board's historical `900099` resolved row.

# Memory candidates (flagged, not self-promoted)

One app instance per tool call; `ui/message` is a composer draft plus an ack. Grade both panels. A wire contract is a claim until a live call confirms the shape. The seat gate refuses git writes from any second worktree of one repo path; register standalone clones with their own path.
