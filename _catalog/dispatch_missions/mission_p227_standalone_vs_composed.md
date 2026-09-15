## Mission — P-227: the composed report is right and the standalone route is wrong, on three reports at once

**THIS IS A DIAGNOSTIC LANE. Its deliverable is a RULING, not a fix.** Do not change
behaviour in this pass. If you find the fix while reading, name it and stop.

### The finding you are acting on

Measured on production 2026-09-15, operator QA capture
(`_inbox/2026-09-15_reports_scope_handoff.md`, raw log `_inbox/2026-09-15_qa_capture_log.md`):

```
                composed inside feasibility        standalone
site plan       correct identity                   asserts a record-miss that did not happen   (P-222 D3)
flood           renders, stamped FD-48453-289990   times out                                   (QA-01/QA-03)
x-ray           n/a                                pipeline_output_absent, 422                 (P-221)
feasibility     the composer itself, 13 pages ready
```

Flood's two halves are the same parcel (`48453:289990`, 2407 PRINCETON DR, Travis) in the
same session: the standalone route timed out while the composed flood figure rendered as
sheet 1 of a ready feasibility study. So the model runs.

**P-222 documented this shape for site plan and read it as that report's bug. Connecting
flood and x-ray to it is the reason this row exists.** Your job is to establish whether that
connection is real.

### The question, and it is a real question

**One cause, or three that rhyme?** Card the answer, do not assume it. There are two live
hypotheses and they predict different fixes.

**H1 — one cause: the composer resolves inputs the standalone routes do not.** If true,
P-221 and P-222 D3 become symptoms of this row rather than independent rows, and one fix
retires all three.

**H2 — three that rhyme, and flood is NOT the same mechanism.** There is a DOCUMENTED,
closely-matching prior you must test before accepting H1:

> `hauska-engine-api POST /v1/property-nodes/<id>/feasibility-export/refresh` returned 201
> after **85 to 154 s** for Travis parcels. PE's `FEASIBILITY_ENGINE_TIMEOUT_MS = 55_000`
> (`pe-feasibility-export-handler.ts:61`, Vercel maxDuration 60) and smartsite-mcp's
> `REFRESH_TIMEOUT_MS = 55_000` (`feasibility-export.ts:16`) **abort first**. The download
> endpoint then serves the finished PDF in 0.2 s. The app string "engine timed out, usually a
> cold start" **names the wrong mechanism**. The engine had run every time.

QA-01's string is *"Drainage study timed out — the model run (DEM fetch + hydrology) can take
up to a minute on a cold start."* That is the same wrong-mechanism shape, on a Travis parcel,
and QA-03 independently proves the model completes. **If flood is a synchronous route whose
engine outruns a client abort, it is a timeout defect, not an input-resolution defect, and
folding it into H1 would be wrong.** P-155 already fixed that class for feasibility with an
async refresh plus poll-download; if flood is the same class the fix is to port that pattern,
which is a different row from P-221 and P-222.

Do not resolve this by preferring the tidier story. Resolve it by reading.

### How to discriminate — read code, do not measure outputs

**Do NOT start by generating more reports.** Every one of these already passed whatever check
the standalone route runs, so measuring output applies the very predicate that admitted the
defect. Output measuring is how this operation certified broken things before.

1. **Read the engine's request log for a standalone drainage run BEFORE touching the engine.**
   If the engine returns 2xx after the client has gone, H2 is live for flood and you are
   done with that leg. Read the request's own log line, not `latestReadyRevisionName` and not
   a proxy for it.
2. **Read the composer's input-resolution path against one standalone route's, in the same
   sitting.** Name the file and function on each side. State which resolver, adapter and
   vintage each one calls. If they call the same resolver, H1's mechanism is not
   input-resolution and you must say so.
3. **Rule the second mechanism in or out EXPLICITLY, do not skip it.** The standalone routes
   may read a different adapter or vintage than the composer. There is a documented instance
   of exactly this class: the PE panel reads hauska-map's own atom chain rather than cortex,
   so a record-served cutover reaches MCP and never reaches the browser. Rule it out by
   reading which resolver each route calls, and say which.

### Constraints that bound any fix you propose

- **P-221's refusal is CORRECT in form and must not be weakened.** Declining to emit a hollow
  report is the behaviour we want. The bug is that it has to, not that it does.
- **P-119 is the framing.** Solo is exactly "Property X-ray and Flood & Drainage". QA-01 and
  QA-02 are BOTH of Solo's deliverables, so the entry SKU currently ships neither. This is
  one product failure, not two loose defects.
- **A derived X-ray must not leak Studio content into a Solo SKU.** X-ray is Solo, feasibility
  is Studio. That constrains any "simplified feasibility study" shape and the operator's 3-4
  sheet target.
- **QA-02 is NOT new work and is NOT yours to build.** P-120 rowed "redefine X-Ray as a subset
  view of the Feasibility model rather than a separately-derived assembler" on 2026-09-07 and
  it has sat. If your ruling bears on why it stalled, say so. Do not re-decide it.

### Known traps

- **Read the authoritative record, never a proxy.** The revision that served a request is on
  that request's log line. The image a revision runs is its digest, not the tag requested.
- **A 200 is not a success.** A parked domain returns 200; a Vercel SPA fallback returns the
  index page as `text/html` with 200 for a missing asset. Check served content, not status.
- **A cold start is a real thing and also a real alibi.** One probe returning a failure on a
  0-traffic revision proves nothing; retry before concluding.
- **Never pipe an enumeration through `tail`.** It truncates silently and a zero reads as
  "nothing is wrong".

### Done looks like

A written ruling that says ONE CAUSE or SEVERAL, with the file and function on each side that
establishes it — not an output diff. Plus: either the row id that covers the standalone flood
generate-failure, or a statement that this row absorbs it. Plus: the second mechanism
explicitly ruled in or out. Plus: a proposed sequence for QA-02 that respects P-221's blocker.

### Falsifiers, pre-register your answers before you run anything

1. If the engine log shows a standalone drainage run returning 2xx after the client aborted,
   H1 is WRONG for flood and you must say so even though H1 is the tidier story.
2. If the composer and the standalone route call the SAME resolver with the same vintage, then
   input resolution is not the cause and H1 needs a different mechanism or must be abandoned.
3. If you find yourself concluding "one cause" without a file and function for each of the
   three symptoms, you have pattern-matched rather than read.

### Do not

- Do not fix anything. This lane rules; a later lane builds.
- Do not weaken P-221's refusal.
- Do not deploy. hauska-engine has NO deploy workflow; a merge there ships nothing.
- Do not write to any production store.
- Do not re-decide P-120.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Close to `_inbox/` on doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if
the answer is `none`. State your snapshot (repo, branch, commit) in the close.
