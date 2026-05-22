---
id: 45_codex_qa_scenarios
title: Codex 1b QA scenarios
status: active
last_updated: 2026-05-22
applies_to: codex
related: [48_codex_program_plan, 47_codex_plan_review, 43_cortex_qa_backlog, 40a_customer_zero_observations_arena_roja_2026_05_06, 27_engine_evolution_plan, 25_atom_architecture_reference]
---

# Codex 1b QA scenarios

## Purpose

This is the durable QA scenario set for Codex 1b, stream CDX-QA-1 of [`48_codex_program_plan.md`](48_codex_program_plan.md) Phase 2. It turns the 8-point QA-readiness definition in `48` into concrete, repeatable scenarios: which project, which jurisdiction, what to do at each step, what the expected output is, and what "wrong" looks like at each step.

It has two audiences. First, Nick, running a structured QA pass on Codex 1b rather than an ad hoc poke. Second, future regression tests, which encode these scenarios so a later change that breaks one is caught.

The QA method is atom-based, per point 8 of the definition: every finding, adjudication, and comment-letter section is a classified atom. A defect is logged against the specific atom ("finding atom X is wrong because Y"), not as free-form prose. This doc is also the living ground-truth record. The first full pass establishes the baseline expected outputs per project, recorded inline where marked; subsequent passes regress against that baseline.

## The surface under test

Codex 1b's reviewer-side QA surface is the `codex-reviewer-qa` artifact in `legacy-design-tools`, served at `/codex-reviewer-qa`. It was built across CDX-3 (one-click review pass, PR #69), CDX-4 (per-finding accept/edit/reject, PR #70), CDX-5 (jurisdiction switcher, PR #71), and CDX-9 (comment-letter auto-draft, PR #72). It consumes cortex-api's in-process L-surface. These scenarios assume cortex-api is deployed with the codex-reviewer-qa artifact live; the deploy is operator-supervised per [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md).

## QA-readiness definition

Restated for working reference from the QA-readiness milestone section of `48`; `48` governs if the two ever diverge. At Codex 1b QA-readiness Nick can:

1. Load a real submittal (a Moab project: Musgrave, Seguin, Arena Roja R1).
2. Run the engine in full-pass reviewer mode (30 to 120s) and see findings.
3. See findings in the reviewer-side QA surface with code citations, severity, and plan location.
4. Adjudicate findings (accept / edit / reject) with adjudication state persisting as atoms.
5. Verify each finding cites a real code section in the Grand County IRC or Bastrop UDC corpus, and that the citation is accurate.
6. Switch jurisdictions and see findings change accordingly.
7. Generate a comment letter as a DOCX/PDF deliverable with findings and adjudications structured.
8. Find bugs structurally: every finding is an atom, and Nick can point at a specific atom and say "this is wrong because X."

## Test projects and jurisdictions

The Codex test projects are the Moab projects also used as DA test projects, per the Empressa-doing-self-review pattern (DA outputs become Codex inputs on the same projects):

- **Musgrave** — Grand County, UT. The primary end-to-end scenario project.
- **Seguin** — Grand County, UT. The second-project confirmation.
- **Arena Roja R1** — Grand County, UT. Customer-zero observations recorded in [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md).

Jurisdiction corpora: the Grand County IRC for the Moab projects; the Bastrop UDC for the jurisdiction-switch scenario against Bastrop test data. Both are in the substrate.

Per the CDX-5 planner ruling (2026-05-21), jurisdiction is resolved from the engagement, not a per-run override. "Switch jurisdictions" in scenario S3 means selecting an engagement filed under Bastrop, not re-running a Moab submittal against the Bastrop UDC.

## Scenario S1 — Primary end-to-end reviewer pass (Musgrave, Grand County)

The canonical QA pass. Walks all eight points in order. Each step names the implementing CDX surface, the expected output, and the failure signatures.

**Setup.** A Musgrave engagement exists in cortex-api with at least one submission. cortex-api is deployed and `/codex-reviewer-qa` is reachable.

1. **Load the submittal** (CDX-3, `ReviewPage`). Select the Musgrave engagement and submission. Expected: both appear in the selectors; the engagement option is labelled with its jurisdiction. Failure: the engagement is absent, or the submission is not selectable.
2. **Run full-pass review** (CDX-3, `POST /submissions/{id}/findings/generate`). Click "Run review". Expected: the run leaves `pending` within 30 to 120s and returns a finding set; the run-status banner reports invalid citations stripped, findings discarded, and errors. Failure: the run errors, hangs past 120s, wedges the instance, or returns zero findings on a submittal known to have issues. _Ground truth: record Musgrave's expected finding count on the first pass._
3. **Read findings in the surface** (CDX-3, `FindingCard`). Expected: each finding renders the full finding text, every code citation, the confidence score, the generation timestamp, severity, and plan location. Failure: a finding shows a bare pass/fail verdict with the reasoning text collapsed or absent (a structural commitment 1 violation), or is missing a citation, severity, or plan location.
4. **Adjudicate** (CDX-4). Accept one finding, edit one (override with a reason), reject one. Reload the page. Expected: each adjudication persists across the reload; the finding atom carries `status`, `reviewerStatusBy`, `reviewerStatusChangedAt`; the edited finding has a revision atom carrying the reviewer text. Failure: state lost on reload, or an adjudication with no reviewer attribution or timestamp.
5. **Verify citations** (CDX-3 render). For each finding, confirm the cited section exists in the Grand County IRC corpus and the quoted text matches the actual code. Failure: a finding cites a section not in the corpus (fabrication, the QA-23 failure mode), or cites a real section but misquotes it.
6. **Confirm jurisdiction** (CDX-5, `JurisdictionBar`). Expected: the bar shows Grand County as the engagement's jurisdiction and the matched indexed corpus; a stale-jurisdiction submission raises the snapshot-divergence warning. Failure: wrong jurisdiction, no corpus match shown when one exists, or no divergence warning on a stale submission.
7. **Generate the comment letter** (CDX-9, `CommentLetterPage`). Draft the letter, render DOCX and PDF, download. Expected: the letter has cover / intro / per-comment-response / signature sections; each section names the exact finding atom(s) it was generated from; rejected and un-adjudicated findings are excluded; both formats download. Failure: a section with no provenance, a rejected finding included, or a render failure.
8. **Log defects structurally.** Expected: every finding, adjudication, and letter section is an addressable atom; a defect is recorded as an atom id plus the reason. Failure: an output that is not an addressable atom, or a defect that can only be described in prose.

## Scenario S2 — Second-project confirmation (Seguin)

Run S1 steps 1, 2, 3, and 7 on the Seguin engagement. Confirms the pass is not Musgrave-specific. Expected: findings generate and render with the same structural completeness; the comment letter drafts and renders. Optionally repeat on Arena Roja R1, cross-referencing the customer-zero observations in `40a`.

## Scenario S3 — Jurisdiction switch (Bastrop UDC)

Select an engagement filed under Bastrop (Bastrop test data), run a review, and confirm the findings cite Bastrop UDC sections and the `JurisdictionBar` shows the Bastrop UDC corpus. This exercises point 6 against the CDX-5 engagement-switcher scope. Failure: findings still cite Grand County, or the jurisdiction bar does not reflect the Bastrop engagement.

## Scenario S4 — Failure-mode catalog (what "wrong" looks like)

The deliberate negative set. A QA pass should confirm each of these does NOT occur, and a regression suite should assert against them:

- **Ungrounded citation.** A finding cites a jurisdiction or section with no atoms in the corpus. Codex must flag jurisdiction coverage and confidence rather than fabricate a citation. This is the QA-23 failure mode and is load-bearing on the quality-gate rule.
- **Collapsed reasoning.** A finding rendered as a bare verdict without its reasoning text, citation, and confidence visible. Violates structural commitment 1 (sell reasoning, not data).
- **Lost adjudication.** An accept / edit / reject that does not survive a page reload, or carries no reviewer attribution.
- **Provenance gap.** A comment-letter section that does not name the finding atom(s) it was generated from.
- **Silent stale jurisdiction.** A submission filed under a since-changed engagement jurisdiction with no snapshot-divergence warning.
- **Engine wedge.** A malformed submittal that hangs or crashes the cortex-api instance. QA-16 isolated the IFC parse in a worker; a wedge here would be a regression of that fix.

## Recording a QA pass

Per point 8, defects are logged against atom ids. A pass produces: the scenarios run, per-scenario pass or fail, and for each failure the atom id plus the defect statement. Record it as a session note; material defects route to a Codex QA backlog (the Codex analog of [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md), to be opened when the first pass produces items).

## Regression

Each scenario's Expected is written to be encodable as an automated test once the first manual pass establishes the project ground truth (finding counts, the citation set per project). Graduating CDX-QA-1 from a manual checklist to a regression suite is a later step, tracked against `48` Phase 2.
