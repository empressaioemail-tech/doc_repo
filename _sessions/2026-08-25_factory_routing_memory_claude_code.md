---
id: 2026-08-25_factory_routing_memory_claude_code
title: Session close — factory routing, memory travel, atom/node/edge pointer
date: 2026-08-25
agent: planner
repo: docs
session_type: planning
memory_graded: [M-001:HELPED, standing-decisions-travel:HELPED, dispatches-are-compiled-not-authored:HELPED]
rolled_up: false
rolled_up_into:
snapshot: doc_repo integration main; commit of this close
plan_row: P-73
---

## What was done

Checked how fleet memory actually runs. Tier 2 capture is live (97 LESSON files). Promotion ran once on 2026-08-21 (12 log lines) and stopped. MEMORY.md still has six deploy/CI rows and zero factory lessons. The promotion gate is armed and red: 85 untriaged > pin 64. Did not raise the pin.

The live break on travel: `scripts/dispatch.mjs` injected CANON-PREAMBLE + AGENT-CONTRACT + DEV-PROCESS and not the verbatim FLEET MEMORY (M0) block. Product-repo agents have no `.cursor/rules`, so that was the empty install. Compiler now pastes the block. Canon-gate M6 refuses a stripped block. Self-test 14/14.

Filed factory routing readiness WDLL, pin (16 rows), and `scripts/factory-routing-readiness.mjs`. `ready:true` is already-serving only (geometry, flood, envelope gold setbacks). P-25 / P-09 / roads stay `ready:false`. P-75 / P-76 leftovers updated to serving on `403d8010` / `00579-teh`.

Filed `_inbox/2026-08-25_factory_operating_instructions.md` and put it in the canvas family Read-with on factory health, write-path, Manifest, deficit, and recalibration. The program now points at the revised atom/node/edge work (P-55 engine PR #356 `29ab77c`, integer grammar, `externalKeys`, `applies-to`, `atom_did IN`). The 2026-08-08 DATA_MODEL proposal is named as not executable.

Next planner handoff: `_inbox/2026-08-25_factory_memory_wave_handoff.md`. One bounded wave: confirm P-55 on engine main, triage eight factory scratch files and lower the pin, compile P-78 only.

No product PRs. No `--apply`. No CAMA zip. Integration checkout; property `_state` not written.

## What was learned (changes to ground truth)

Memory capture without promotion is a permanently red BLOCKING CI step. The fix is triage plus a lower pin, not a pin raise. Dispatch travel was the missing half; a rule file in doc_repo does not reach cc-agents.

`ready:true` on the routing pin is easy to misread as write-allowed. Envelope Manifest cells are still 254 not-yet. Gold setbacks on PE #220 are a serving hop, not Factory 2 go.

Factory 1 apply against padded `entity_id` or jsonb verify is the old graph. P-55 is the write target. Phase 2 "196 parcel-node atoms" is a stale geometry snapshot; Manifest dump is 253 present.

## What's still open

P-78 product rewrite. Memory backlog 85 > 64 until the next planner triages. PE chip leftover for who-serves / city-limits. Bake still `tax_year DESC`. Footprint bbox on engine main. P-25 / P-09 / COVER held.

## Suggested canonical doc updates

Factory runbooks stay operate-do-not-rebuild. Factory 2 runbook still wrongly says Factory 1 produces `txgio_parcel`. Leave that for a later runbook pass. This session's law lives in the operating instructions file.
