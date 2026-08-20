---
id: wdll_practice
title: WDLL practice — What Done Looks Like + end-state report card
status: active
last_updated: 2026-07-20
applies_to: portfolio
related: [01_doc_conventions, 90_runbooks/session_close_template, _decisions/2026-07-20_cross_vertical_parity_program, _catalog/thesis_parity_ledger]
---

# WDLL practice

Adopted 2026-07-20 from the Empressa Cockpit process (`docs/process/WDLL_PRACTICE.md` in empressa-trading), modified for this side of the portfolio. The operator's stated purpose: capture an end-state report card when work starts and when it finishes, so the vision does not drift through the grind of the build.

## When it triggers

Sprint-scale or program-scale work: any multi-repo build wave, any workstream that will span multiple dispatches or agent sessions, any build whose "done" could be argued about afterward. It does not trigger for single-file fixes, doc edits, or tactical patches; those run on the existing dispatch and review discipline.

## The practice

1. **Write the WDLL before implementation.** A short doc stating what done looks like: the observable end state, not the task list. It carries a numbered list of acceptance items, each one checkable by a specific observation (a live probe, a test, a rendered surface, a merged PR with named behavior). No timeframe estimates; items stack in execution order with dependencies named.
2. **Operator approves the WDLL before build starts.** The approved WDLL is the Start card. It is frozen at approval; scope changes during the build are recorded as amendments with a one-line reason, never silently absorbed.
3. **Every dispatch and PR cites its acceptance items.** An executor is handed the item numbers it is responsible for. Adversarial review verifies the deliverable against the cited WDLL items instead of re-deriving intent.
4. **At close, re-grade the same card.** The Finish card is the Start card re-graded item by item: met, partial, or dropped, each with one line of evidence (met items point at the probe or PR; partial and dropped items say why). The diff between Start and Finish cards IS the drift, made visible.
5. **File both cards.** The WDLL lives with the program it governs (`_inbox/` tracker or program directory). The Finish card grading goes into the session close summary. If the work touched a spine-model concept, one entry also lands in `_catalog/thesis_parity_ledger.md`.

## Template

```markdown
# WDLL: <workstream name>
Date: <date>  Status: draft | approved | amended | graded
Operator approval: <date or pending>

## Done looks like
<3 to 6 sentences of observable end state.>

## Acceptance items
1. <observable item> | check: <how it is verified> | grade: [ ]
2. ...

## Amendments
- <date>: <item changed> because <one line>.

## Finish card (graded at close)
1. met | partial | dropped: <one line of evidence or reason>
```

## Relationship to existing process

The WDLL does not replace anything. Dispatches still follow the dispatch conventions; adversarial review remains the QA gate on every deliverable and now verifies against WDLL items; decision records still capture rulings; session close still regenerates the snapshot. The WDLL adds exactly two artifacts: the approved Start card before build, the graded Finish card at close.
