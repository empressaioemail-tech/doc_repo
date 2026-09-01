---
id: 2026-08-29_p91_connect_loop_qa
title: Connect loop QA after E+D serving
date: 2026-08-29
status: accepted-with-listing-unscored
plan_row: P-91
serving:
  mcp: smartsite-mcp-00029-fom
  cortex: cortex-api-00656-vek
---

# Connect loop QA

Operator grade on serving `00029-fom` / `00656-vek`.

1. Address paste: PASS, n=1. Pine resolved. zzzz stayed unresolved. A5 forty not run.

2. Listing history: not scored. No transcript turn. Board unchanged (same row ids, `updatedAt` = `createdAt` = 03:25:04.518Z). Nothing written. That is I5 for the write path. It is not `host_drop`.

3. Save: PASS. Board unchanged after the save.

## Why host_drop is not earned

An empty transcript is the same observation under three mechanisms:

1. Handler never bound. Widget script runs after streaming. A throw or a listener that never attached leaves a dead button.
2. Handler bound and fired. Host dropped `ui/message`.
3. Handler bound, fired, and handed a payload the host discarded.

The 2026-08-29 Wave D rubric treated (2) as the only reading. That was one step ahead of the evidence.

## Instrument (next click)

Local ack before `postMessage`. Label becomes `Requesting listing history`. Button disables. Char count of the outbound text is stored on the button. That needs no host.

- Label does not change: handler unbound. Fix is in the widget.
- Label changes, no turn: `host_drop` is earned.
- Same click can show the payload that was handed over (case 3).

## Design leftover

Section 3.8 still needs a rendered failure state. A dead button and a working button that finds nothing look identical. Wave H stays held. The ack label is an instrument, not that design state.
