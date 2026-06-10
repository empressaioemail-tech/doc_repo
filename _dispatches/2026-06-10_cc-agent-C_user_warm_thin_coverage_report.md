---
id: 2026-06-10_cc-agent-C_user_warm_thin_coverage_report
title: Dispatch — user-warm thin (coverage report + honest pill + manual escalation)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED — folds into the app-by-app cut passes (C1/C2); fire when the cut surface is live
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 55_spine_data_intelligence_stack, 80_adrs/adr_005_multitenancy, 20_agent_operating_rules]
---

# User-warm thin — coverage report + honest pill + manual escalation

> The launch-scoped slice of the user-warm quality-gated coverage-escalation loop ([`59`](../59_spine_moat_and_high_value_features.md) item 1). The FULL loop (automated coverage-assessment service + automated gap-escalation + team curation workflow that gates corpus admission) is the fast-follow. This thin version ships the honest user-facing half plus a manual internal escalation, with the load-bearing security guardrail intact. Folds into the app-by-app cut (sprint 58, step 9) so it lands on the cut surfaces, not as a separate front.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on failure after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Read first

1. [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 1 — the five-rung ladder; this builds rungs 1-3 + a manual rung 4
2. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) §7 — the coverage-honesty pill pattern
3. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the launch gate
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## The load-bearing guardrail (HARD — non-negotiable acceptance criterion)

**Never write user-supplied content into the shared, reusable corpus.** Warming is web-first from verified authoritative sources only (Municode / eCode360 / American Legal / ICC / UpCodes). A user can trigger a warm of their jurisdiction; a user can NEVER inject text, a document, or an edit that becomes part of any other user's answer. One bad upload poisons the jurisdiction for everyone, and the entire pitch is trustworthy answers. The escalation path (below) routes gaps to a HUMAN, who curates from authoritative sources — user content never enters the corpus, not even via the escalation. A test must assert that no user-supplied payload reaches a corpus/reasoning-atom write.

## Scope (thin — sequence)

1. **Warm-what-we-can-verify (rung 1).** On address/jurisdiction resolution, auto-discover and warm what is web-verifiable from the authoritative sources (model base + local amendments + zoning where available), reusing the existing web-first cold-warm path. Honor the corpus-aware precedence (warm gaps, overlay where corpus covers).
2. **Coverage assessment (rung 2, thin).** Produce a per-jurisdiction coverage state for the user's resolved jurisdiction: what we have, with confidence + verification per layer/section. This can be a read-time computation over the stores, not a new standing service (the standing coverage-assessment service is the fast-follow).
3. **Honest user notification (rung 3).** Surface the coverage state in the UI as the 55 §7 honesty pill: plainly what we DO have and what is pending. Never present `unverified-web-source` as authoritative. This is the launch-critical honesty surface.
4. **Manual internal escalation (rung 4, thin).** When coverage is incomplete or flagged, emit an internal signal (a structured log / inbox row / lightweight internal record) capturing the jurisdiction, the gap, and the suggested authoritative source — routed to Nick/the team for manual curation. NOT the automated gap-escalation + curation-workflow build (fast-follow); a manual hand-off is enough for launch. Rung 5 (team reaches back out) is a human action, not built here.

Out of scope (fast-follow): the standing coverage-assessment service, the automated gap-escalation/alerting mechanism, the team curation workflow that gates corpus admission, the participation-flywheel architecture.

## Acceptance criteria

- **No user-supplied content reaches the shared corpus or reasoning-atom store — proven by test (HARD).**
- Warm-what-we-can runs web-first from authoritative sources only; corpus-covered overlaid not re-grounded.
- Per-jurisdiction coverage state computed and surfaced as the honesty pill; `unverified-web-source` never rendered as authoritative.
- Manual internal escalation emits jurisdiction + gap + suggested source for human curation.
- Quality gate: every served atom carries confidence + provenance + verification.
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_user_warm_thin.md`: the no-ingest test output verbatim, the coverage-state shape, the pill behavior, the escalation record shape, PR URL + SHA, and blockers verbatim.
