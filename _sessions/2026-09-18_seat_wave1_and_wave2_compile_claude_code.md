---
id: 2026-09-18_seat_wave1_and_wave2_compile_claude_code
title: "Session: the seat's Wave 1 done, the six Wave 1 lanes integrated, three production changes shipped and graded, and Wave 2 begun"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: integration
status: closed (operator-called session close; handoff at _inbox/2026-09-18b_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-18b_HANDOFF_integration_seat.md (written)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (updated throughout)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-218, A-220 added)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-217 to A-221; P-352 to P-362)
snapshot: doc_repo main e887a8fb at open, 0e80b351 before this close; read 2026-09-18 16:16Z
---

# Session: the seat's Wave 1, the six lanes integrated, and Wave 2 begun

## What the session did

It opened on the handoff's order: P-348, P-337 and P-347, then three production writes one at a time.
All of it is done except one clause of P-347, and the operator's six Wave 1 lanes landed mid-session
and were integrated.

**P-348.** Both one-parcel cells were named and read. McLennan `48309:417476` carries a Tennessee state
code in its own roll's situs, and the P-266 ladder refuses to write TX over it by design. Williamson
`48491:PRIVATE ROAD` is a record built from road polygons, the only non-conforming key among 981,405.
The read found a third cell the ledger scored as passing: Hays `48209:88885` still holds the retired D1
constant. The fix is P-352.

**P-337.** `landUseDescription` and `railCorridor` became ruled exclusions coupled to their Phase 1
rows through the capability roadmap, the tracked closes and the exact verdict string. The acceptance
tests were seen failing before the register entries existed. The live run matched its pre-registered
prediction exactly: 67 open to 55, and the new retired-constant predicate reads Hays false-earned 1.

**P-347.** XD-1 now reads a figure's backing from the draw route. A TLS preflight refuses by name. The
PDF leg carries the engine key, and 50 PDFs were built under a durable record (52 of 52 served). A
sign-in helper was built and, once the operator registered a public OAuth client (A-218), the MCP was
measured on 52 of 52. Coverage is graded: P-210 passes, P-205's MCP half passes, and its map half fails
(P-353). P-270's zoning half is confirmed and its address half reopened. The customer leg moved from
0 PASS to 23 PASS of 45. One clause remains: the tier graded at was not recorded on either signed-in
run.

**Production.** dblink dropped. #175 deployed under the gate-scheduler procedure: its first cycle
reproduced all 390 verdicts and the trigger was resumed. P-332 deployed and graded in both directions.
The LDT halves deployed to cortex-api `00841-jeh` after a canary compare, 90 of 90 against production.

**Wave 1 integration.** Five PRs merged, each re-greened against its base: map #420 and #419, engine
#475, factory #177 and #178. #474 is held for the threshold, which the operator then set to 0.05 (A-220).
Carded from the closes: P-358 to P-361. **Wave 2:** P-354, P-339/340/341, P-353, P-270's address half
and P-336 compiled and pushed.

## Findings that changed the plan

- **Georgetown** served the adopted-but-not-yet-effective rewrite on 35,038 parcels, against ruling 19's
  premise. The operator ruled to keep serving it and to say so on the surface (A-218, P-354).
- **P-264 had closed partial** 16 hours before the handoff said it was running. The operator ruled roads
  accepted for Phase 0 on the measured share (A-218), with measurement carried to Phase 1.
- **P-258's re-run is entangled with ruling 19:** the live writer already carries corpus 1.4.0, so a
  Hays run is San Marcos's switch.
- **Lane closes stranded on branches** (five lanes), a **probe-close gate that had drifted from the
  registry** (Wave 1 was ungated), and a **deploy workflow whose post-shift credential check can never
  run** (P-362). Each was found at source.
- **Hays** was measured not to be an incident. 1,385 retired served keys go to P-351.

## Errors of my own, and what caught them

- The first XD-1 grade read a 504 from the draw route as "unbacked". Caught by the run itself; fixed.
- The canary grader first missed P-270's new `citationEffectiveDate` field. Caught by the grader
  failing; confirmed against the commit's own test, then named rather than widened.
- The probe scanned the MCP's reason-code glossary as a claim, producing six false Williamson FAILs.
  Caught by reading the matched text before accepting the count.
- A P-348 figure was mis-summed (289,710 for 280,710). Caught by reconciling against the county total.
- A Python edit read a file with universal newlines. Checked; the file was LF already.

Each was caught by an instrument or a two-sided check, not by re-reading a conclusion.

## Rulings taken

A-218 (roads accepted; Georgetown served from its adopted rewrite; P-354 compiled now; the probe's OAuth
client registered). A-220 (threshold 0.05 program-wide; P-335's pair authoritative; P-323's tag deletion
stands). Commit go on four batches.

## Commits

`2513f564` (A-217, A-218), `1fb31831` (A-219, A-220), `fee78ed4` (A-221), `0e80b351` (Wave 2
dispatches), and this close.

## Refinement notes

The `source-required` discipline held: every number above traces to an artifact in `_inbox`. A
session this long raised the error rate as ENFORCEMENT predicts; the operator called the close at the
right point, before the remaining production writes (P-258's re-run, P-342's apply).
