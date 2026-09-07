---
date: 2026-09-07
topic: Boundary-envelope/setback atom program advanced substantially (Travis join-key phase 1 shipped, setback-corpus package built/published/repointed through two real bugs); two real production incidents found and fixed (retrieval-api stale-deploy crash-loop, which also closed a 3-day-old unattributed countAtoms mystery); a portfolio-wide measurement-integrity pattern surfaced (three independent, all-upward-biased coverage/confidence bugs); a multi-thread doc_repo coordinator (doc-repo-6f) stood up mid-session to align three concurrent programs; a SERVING-vs-merged enumeration exercise (still in progress) found hauska-map has not deployed to production since 2026-09-05 12:52 CDT despite five real merges landing since
agent: claude_code (integration seat, doc-repo-2c)
plan_row: OPS-16 P-121 (boundary-envelope/setback atom program, filed this session), P-123 items driven on cente-b9 (email/renewal-date wire, affiliate-visibility gating — reports/UI backlog owned by doc-repo-6f, not this seat's plan-row)
memory_graded: none
related:
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope.md
  - _decisions/2026-09-07_affiliate_chargeback_cancellation_handling.md
  - _inbox/2026-09-07_engine_rail-served-absence-atoms-inflate-coverage_finding.md
  - _inbox/2026-09-07_integration_setback-verification-tier-never-reaches-atom_flag.md
  - _inbox/2026-09-07_integration_bastrop-geometry-parity-decline_flag.md
  - _inbox/2026-09-06_integration_countatoms-recurrence_hardening_greenlit.md
  - _inbox/2026-09-07_integration_smart-site-ui-review-triage.md
  - 90_operations/OPS-20_thread_coordination_index.md
---

# Session: boundary-envelope program progress, two real incidents, a fleet-wide measurement-integrity pattern, and a merged-vs-served correction

## Summary

This session ran as the integration seat coordinating the `hauska-engine` (cente-67),
`legacy-design-tools` (cente-c1), and `hauska-map` (cente-b9) lanes against the
boundary-envelope/setback atom program (`_decisions/2026-09-06_boundary_envelope_atom_program_scope.md`),
while two sibling programs ran concurrently under their own doc_repo-rooted
coordinating sessions: `doc-repo-3b` (Reports + Courthouse, OPS-16 P-120) and
`doc-repo-f9` (a general UI-QA lane on hauska-map). Partway through, Nick stood up a
fourth session, `doc-repo-6f`, explicitly as a cross-thread coordinator to align all
three once the threads began converging on shared repos and shared questions — a
new operating pattern this session, not previously in use.

**Program progress.** Item 5 (Travis join-key) phase 1 shipped for real: a contract
PR extending `ParcelKeyKind` plus a per-parcel prop_id/geo_id cascade, applied
against production (804,457 atoms written/verified, 0 errors, 40 orphans retired),
independently verified against the live database via a hash-sample count and an
exact count on the actual target metric (40 geo_id_crosswalk-resolved atoms vs. a
predicted ~39). Item 6 (nine-city setback onboarding) closed with a new canonical
package, `@empressaio/setback-corpus`, built and published — through two real bugs
caught before or shortly after shipping rather than after: a missing `elgin-tx`
alias (would have silently null-resolved for any consumer using the key Tier-1's
facet-bake actually stamps) and a missing `NPM_TOKEN` secret on the brand-new repo
(diagnosed precisely by Engine, but compressed by this seat into an inaccurate
"blocked on a token only Nick can provision" summary that cost real time — logged
as a standing lesson on relay precision). hauska-engine's own vendored setback
copy was successfully repointed onto the published package (PR #399, all 15
jurisdictions passing a real district-by-district divergence test with zero value
disagreement), though a matcher bug in that same divergence test was caught and
fixed before the result was trusted. Items 2, 3, 4, and 8 remain recorded as done
in the canonical scope doc, but see the merged-vs-served correction below — that
status needs re-reading.

**Two real production incidents found and fixed.** First: `hauska-retrieval-api`
was crash-looping in production (every 15-90 seconds) on a stale deployed image
that predated three already-merged fixes for an unsafe boot-time `countAtoms()`
call; redeployed from current main with full canary-then-shift verification
(digest match, boot logs, a failing health check re-run twice to confirm the fix,
not just the deploy command's own success). Second, found as a byproduct of
verifying the first: 8 old, stale-tagged Cloud Run revisions on the same service
were still crash-looping independent of the serving revision's traffic split (a
resource type — tagged revisions with their own `minScale` — nobody had checked
before), and their timing and mechanism are a very strong match for a mystery
`countAtoms()`-hammering caller from a 2026-09-06 incident that was exhaustively
investigated and never attributed at the time. Removing the 8 tags measurably
stopped the pattern; the database-level `statement_timeout` containment from that
earlier incident was left in place untouched.

**A portfolio-wide measurement-integrity pattern.** Two real, separately-found
defects converged into one durable, higher-level finding. First: setback-rule
atoms have a real per-field provenance channel (`fieldProvenance`) that IS
populated, but the function mapping ordinance verification tier onto the atom's
confidence field collapses `primary-source-verified` (the highest tier) into the
same bucket as transcribed-only data — an active mislabel, not an absent field,
found only after two rounds of self-correction by Engine and one correction by
the cross-thread coordinator reading the published contract source directly
rather than accepting a trace at face value. Second: the statewide coverage
sweep (`three-layer-sweep.mjs` → `dedupeParcelAtoms()`) never checks whether an
atom is absence-shaped before counting its entity type as coverage, inflating
on-wire statistics across 9 of 14 tracked rails. doc-repo-6f connected both to a
third, pre-existing finding from this portfolio's own history (situs's sentinel
values inflating a 99.3% figure that was really 89.90%) and named the pattern:
three independent mechanisms, found separately, all biasing the same direction.
That directional consistency — not any single instance — is the durable finding:
this operation's coverage/confidence numbers should be treated as an upper bound
until re-measured, not a point estimate. Both underlying defects are documented
and flagged but explicitly not fixed tonight, per the operator's own standing
note that verification-heavy work degrades late in a long session.

**A durable correction to how "done" is recorded.** Compiling a real
SERVING-vs-merged enumeration at the operator's request (still in progress at
session end) surfaced that this program's own canonical doc had recorded items 2
and 3 as "DONE... verified live via `gh pr view`" — which verifies a PR's merge
state, not that the code serves production traffic. Cross-referencing merge
timestamps against actual Cloud Run/Vercel serving-revision creation times (an
instrument credited to doc-repo-6f, now recommended across all three threads)
showed both `cortex-api` and `smartsite-mcp`'s currently-serving revisions
predate the relevant merges — those items are merged and correct, not serving.
Separately, and more consequentially: `hauska-map` has not been deployed to
production since 2026-09-05 12:52 CDT, confirmed three independent ways
(deployment list, live alias, and the `Last-Modified` header on the live HTML).
Five real merges have landed since (#362 PE atom-chain reconciliation, #363
attribution-bug fix, #365 billing defense-in-depth, #370 flood-report sharing,
#372 P-123 email wiring) and none of them are live for a single user. The
canonical scope doc now carries a standing correction: `DONE` records git/code
state only and is never sufficient alone to claim production serving. A
production-deploy decision for `hauska-map` was raised with the operator and was
still open at session end. **Update, later same session:** `cente-c1` deployed
`cortex-api` for real (operator approval independently confirmed through its own
channel, not taken on relay) — revision `cortex-api-00739-xoy`, digest-pinned to
the merge commit, traffic and DB binding confirmed by field name pre- and
post-shift. Items 2, 3, and the #632 parity fix are now genuinely serving, not
merely merged. A real Killeen re-test in the same pass found the two originally
tested parcels were invalid test cases (one in Belton, one out-of-scope
commercial) rather than evidence the fix was wrong, found a valid parcel instead,
and confirmed it clean; it also surfaced a fresh, unrelated geometry-validation
bug on the Belton parcel, not yet filed. A further honest finding on D5/D6: both
are deployed and correct, but the gate-evaluation pipeline that would make either
one observable to a real request has never actually run for these rails on any
county — the fix's live effect on any user is currently zero, a real gap in the
evaluation pipeline, not a defect in D5/D6 itself. `hauska-map` remains
undeployed; this update applies to `cortex-api` only.

**Two ownership/attribution corrections, both mine to own.** This seat told
`doc-repo-6f` it had "accepted and assigned" the absence-vs-presence atom-family
audit to `cente-67` — that assignment was never actually sent; `cente-67` caught
it by checking the source doc's own status line rather than accepting the
framing. Separately, this seat's affiliate-chargeback decision record named
`cente-b9` (hauska-map) as the downstream builder for Stripe/affiliate
revenue-split logic; `cente-b9` investigated before building and found
hauska-map has none of the required infrastructure (no webhook handling, no
subscription storage, no affiliate-attribution mechanism) — the real owner is
`cente-c1` (legacy-design-tools), same as an already-routed billing-plan bug.
Both corrected at the source (the decision record edited, the real assignment
sent) rather than left to propagate.

## What was learned (changes to ground truth)

- Item 5 (Travis join-key) phase 1: closed for real, 804,457 atoms live, no
  deploy dependency (pure data write via direct script run).
- Item 6 (setback onboarding): `@empressaio/setback-corpus@1.0.1` published and
  live on npm; hauska-engine's own repoint merged (`5cefe10`) but **not yet
  deployed** to either service that depends on it (`engine-api`, `retrieval-api`
  both serving revisions older than the merge); legacy-design-tools' side not
  started. Round Rock carries a real, still-open reconciliation gap between
  hauska-engine's and legacy-design-tools' independently-authored tables
  (different on `side_corner_ft` methodology, `max_height_ft` sentinel, and an
  SF-3 sub-variant reading) — hauska-engine's version is the interim default.
- Items 2 and 3 (shared reader, third-defect audit): merged and correct,
  **not currently serving** — see the merged-vs-served correction above. This
  is now recorded as a standing correction in the canonical scope doc, not just
  a one-time fix to two rows.
- Items 8 and 9 are under an explicit operator hold pending his own review;
  item 1 is unstarted and the operator does not care about it unless it already
  happened (it has not).
- `pcs.ts`, a loose 347-line TypeScript file this seat flagged as product code
  stranded in doc_repo, was resolved by doc-repo-6f: a stray duplicate, not
  orphaned work — the real module is safely landed in hauska-engine. Removal is
  doc-repo-6f's to do.
- Constraint Search (P-106)'s builder job was traced definitively:
  designed-but-never-written, not deployed-and-removed. The original close doc's
  own scope-out language was accurate the whole time; nobody picked the write
  half back up since 2026-09-02.
- The affiliate program: chargeback nets against an affiliate's next
  distribution, cancellation stops future royalty only (no retroactive
  clawback) — operator-ruled and recorded. Affiliate-link visibility gating
  remains genuinely unbuildable — no affiliate-identity mechanism exists in
  either hauska-map or legacy-design-tools today; routed to the operator as a
  data-model question, not an engineering one.
- Scope correction from the operator, received late in the session: only
  Central Texas matters for the current push, not statewide work. This demotes
  the rail-served coverage-inflation finding from a 13-million-parcel statewide
  framing to a smaller, still-real "is the CTX number wrong, and by how much"
  question.

## What's still open

- The SERVING-vs-merged enumeration itself, requested by the operator, was not
  finished at session end — still waiting on `cente-c1` to confirm which exact
  surface hosts items 2/3's code (for the deploy plan, not the finding, which
  is already settled) and on the operator's decision on whether to trigger a
  hauska-map production deploy.
- `cente-c1`'s answer on item 8 (facet-bake live-vs-rerun) — asked twice,
  confirmed queued but not yet answered; gates item 9, both under the
  operator's hold regardless.
- Two real defects documented but not fixed or carded: the setback verification
  tier mislabel (`_inbox/2026-09-07_integration_setback-verification-tier-never-reaches-atom_flag.md`)
  and the rail-served absence-atom coverage inflation
  (`_inbox/2026-09-07_engine_rail-served-absence-atoms-inflate-coverage_finding.md`).
- The Bastrop `geometryParitySample` GEOMETRY-DIVERGE finding remains flagged
  and unowned (`_inbox/2026-09-07_integration_bastrop-geometry-parity-decline_flag.md`).
- A-062's live Stripe-portal verification remains genuinely unverified — no
  paying test account exists in any lane; the operator was asked directly for
  one rather than the item being silently closed.
- Three worktree/repo-ownership questions from tonight's seat-register cleanup
  (`ctx-wrapup-contract`/`ctx-wrapup-mcp` needing the substrate seat's array,
  `ctx-wrapup-ldt-gate`'s possible duplicate attribution, and six unclaimed
  `deep-probe-*` clones from a scripted sweep nobody currently active
  remembers) are routed to `doc-repo-6f` for arbitration, unresolved.
- `_state/property/STATE.md` is 952 lines against a stated 150-line target —
  overdue for extraction into named docs, not touched further this session
  beyond a short pointer entry (see below).

## Suggested canonical doc updates

Already applied this session, not merely suggested: `_decisions/2026-09-06_boundary_envelope_atom_program_scope.md`
gained the merged-vs-served standing correction and P-121's filing note;
`90_operations/OPS-16_texas_market_plan_of_record.md` gained P-121; two new
`_inbox/` findings were filed and one (`countAtoms` recurrence) was updated with
a same-day resolution; `_decisions/2026-09-07_affiliate_chargeback_cancellation_handling.md`
was corrected on builder attribution.

Still needed, not done this session: a real card (plan-row) for the setback
verification-tier mislabel and for the rail-served coverage-inflation bug, once
the operator or doc-repo-6f rules on priority; an extraction pass on
`_state/property/STATE.md` into named docs per its own length target.
