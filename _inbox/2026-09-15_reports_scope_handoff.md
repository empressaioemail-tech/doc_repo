---
title: Reports scope handoff — operator QA capture 2026-09-15
date: 2026-09-15
status: open
type: handoff
owner: master planner
source: _inbox/2026-09-15_qa_capture_log.md
---

# Reports scope handoff

Scope input for the master planner. This is not a dispatch. Lane dispatches compile with
`node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row <row>`; nothing here is
pre-authorised to execute.

Boundary: reports only. Design work is arriving separately from the operator and is out of this
scope.

Snapshot: doc_repo, branch main, commit 5bc169ad. Captures taken on production smartsite.cloud
by the operator on 2026-09-15. Raw log: `_inbox/2026-09-15_qa_capture_log.md`.

## The three captures

**QA-01. The standalone Flood and Drainage study times out.** Parcel 2407 PRINCETON DR, Travis
County, node 48453:289990, badged verified 15 September 2026. The generate button returns:

> Drainage study timed out — the model run (DEM fetch + hydrology) can take up to a minute on a
> cold start. Try again in a moment.

Operator: "the flood and drainage study keeps timing out."

**QA-02. The X-ray report is behind and should be derived from the feasibility study.** Operator,
verbatim:

> the xray report needs to be caught up I had stopped working on it because I wanted to get the
> feasibility study to where it needs to be. And now the feasibility study is pretty good. And so
> the x-ray is, is just a simplified feasibility study with less sheets. Maybe like three or four
> sheets. And just more of a snapshot. Feasibility study is a deep dive. So x-ray should be
> derived from feasibility study.

Target shape as stated: three or four sheets, snapshot rather than deep dive, derived FROM the
feasibility model rather than assembled in parallel.

**QA-03. Flood and drainage runs inside feasibility and not standalone.** Same parcel, same
session. The Feasibility Study card reports "PDF ready (13 pages)", generated 2026-09-15, and
page 1 of the rendered PDF is the flood figure: aerial site plan, property line, water gradient
modeled flow and ponding at a 9.5 inch storm, traced flow line, flow exit, stamped
`FD-48453-289990 | generated 2026-09-15 16:11Z`. Operator:

> flood and drainage study are also a part of the feasibility study. And flood and drainage will
> run with feasibility but will not run as a standalone flood study.

So the same computation succeeds when the feasibility composer invokes it and fails when the
standalone report path invokes it, on the same parcel, minutes apart.

## What this already maps to in the plan of record

Established by reading OPS-16 and OPS-23 at commit 5bc169ad. Each row is quoted from the plan,
not summarised from memory.

**P-119 (2026-09-05) sets the commercial stakes.** The Solo tier is "Property X-ray and Flood &
Drainage, unlimited chat and unlimited properties, Claude extension." Solo has exactly two report
deliverables. QA-01 and QA-02 are both of them. The entry-level SKU currently ships neither,
which is the framing to carry rather than treating these as two loose defects.

**P-120 (2026-09-07) already rules QA-02.** The Reports + Courthouse Program row says to
"redefine X-Ray as a subset view of the Feasibility model rather than a separately-derived
assembler, for tighter cross-document" consistency. QA-02 is the operator restating that ruling
and adding the sheet target, three or four, and the snapshot framing. This is not a new decision.
It is a row carried since 2026-09-07 that has not landed. The same row also lists "an X-Ray
verdict contradicting its own appended sheet" and "a drainage-study integration gap" among five
live-verified defects.

**P-221 (2026-09-15) is the blocker under QA-02.** `export_instrument kind=dossier` returns
`{"error":"pipeline_output_absent","missing":["verdict","brief_facts"],"upstreamBodyStatus":422}`.
The X-ray cannot be generated at all. The row is explicit that the refusal is correct in form and
must not be weakened; the defect is that it has to refuse. QA-02's derivation work sits on top of
P-221, because deriving from feasibility is pointless while the route cannot produce output.

**P-222 (2026-09-15) carries the same structural shape as QA-03, for a different report.** D3:
"the standalone siteplan loses the parcel's identity and ASSERTS A MISS THAT DID NOT HAPPEN"
while "the SAME site plan drawn inside the feasibility study (sheet 4) prints both correctly."
D9: the brief says drainage is "unread", "drainage facet not produced for this parcel", while
sheets 6/7/9 carry a real parcel-scoped study. P-222's own cause line is "the report never asks
the facet."

**P-155 is why the QA-01 error string is suspect.** P-155 made the feasibility refresh
asynchronous and its predicate includes "the cold-start string is retired." It closed 2026-09-12,
reopened 2026-09-13 on F23, and was verified live again 2026-09-14 when the overseer's export
call returned `in_progress` with a job reference. F7, the finding behind P-155, reads "feasibility
completes in 85 to 154 s; clients abort at 55 s," and the record of that work states the app
string naming a cold start "names the wrong mechanism." QA-01's drainage string names a cold start
in the same way, on a path P-155 did not touch.

## The one thing that appears unrowed

Searching OPS-16 and OPS-23 for `drainage` returns A-045, A-051, A-060, A-092, A-103, P-119,
P-120, P-131 and P-222. None is a row for the standalone Flood and Drainage generate path failing
to produce a document. P-222 covers what a report SAYS once produced. P-221 covers the X-ray
route failing to produce. Nothing found covers the flood route failing to produce.

State this as a search result, not as a fact. The instrument was
`grep -rin "drainage" 90_operations/OPS-16_texas_market_plan_of_record.md 90_operations/OPS-23_surface_completion_program.md`
at commit 5bc169ad. It reads the plan of record only. A row living elsewhere, or one naming the
defect without the word drainage, would not appear. Confirm before adding a duplicate row.

## The pattern worth naming

Three of the four reports in the Smart Site line now show the same divergence: the artifact
produced by the standalone route is worse than, or absent where, the same artifact produced
inside the feasibility composer.

    site plan     composed: correct identity (P-222)    standalone: false record-miss (P-222 D3)
    flood         composed: renders, stamped (QA-03)    standalone: times out (QA-01)
    x-ray         composed: not applicable              standalone: pipeline_output_absent (P-221)
    feasibility   the composer itself, 13 pages ready

Whether this is one cause or three that happen to rhyme is the question, and it is the question to
answer BEFORE rowing three separate fixes. If the composer resolves inputs the standalone routes
do not, then P-221, P-222 D3 and QA-01 are one row and three symptoms. If they are independent,
three rows is correct. Do not assume either reading. The cheap discriminator is to read the
composer's input-resolution path against one standalone route's, in code, rather than to measure
more outputs. Code reading outranks output measuring here because every one of these defects
already passed whatever check the standalone route runs.

A second mechanism that would produce the same observations, and should be ruled out rather than
skipped: the standalone routes may be newer or older surfaces reading a different adapter, in
which case the divergence is a vintage problem rather than a resolution problem. The Property
Explorer panel has a documented instance of exactly that, reading hauska-map's own atom chain
rather than cortex. Rule it out by reading which resolver each route calls, not by comparing
output.

## What the master planner owes back

1. A ruling on whether the standalone-versus-composed divergence is one cause or several, with
   the code read that establishes it, not an output comparison.
2. Either a new plan row for the standalone flood generate failure, or the identifier of the
   existing row that already covers it.
3. A sequence for QA-02 that respects P-221. The X-ray derivation cannot be verified while the
   dossier route refuses.
4. Confirmation of the sheet target for X-ray against P-119's tier definition, since X-ray is a
   Solo deliverable and feasibility is Studio. A derived report must not leak Studio content into
   a Solo SKU. This is a real constraint on "simplified feasibility study" and the operator's
   three-to-four-sheet target needs checking against it.
5. For QA-01 specifically: read the engine's own request log for a drainage run before touching
   the engine. Nothing in this handoff is a diagnosis.

## Not established

The cause of the QA-01 timeout. Whether the drainage path is synchronous. Whether the drainage
generate route is the same engine route the feasibility composer calls. Whether the cold-start
string is accurate on this path or is the same wrong mechanism P-155 retired elsewhere. Whether
X-ray has ever rendered the three-to-four-sheet shape. No lane has been dispatched.
