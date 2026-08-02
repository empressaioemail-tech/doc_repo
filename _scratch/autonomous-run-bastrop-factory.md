# Autonomous run — Bastrop factory (planner scratchpad)

Plan: OPS-0 MASTER game plan. Run Phases A+B+C autonomously, STOP at operator R6 (Phase D). Notify at phase gates.

## GROUND-TRUTH (live state, timestamped)
- GROUND-TRUTH (2026-08-02): A1 DONE — fleet-memory.mdc merged into all 5 product repos (hauska-engine #202, hauska-map #143, ldt #373, hauska-mcp #56, smartcity-os #33). Verified each PR contained the file + CI green before merge. cc-agent-reach gap #1 CLOSED.
- GROUND-TRUTH (2026-08-02): Phase A engine lane (A2-A6) DISPATCHED to background agent a47386e55953aca88 (Sonnet). One PR expected: feat(engine): Phase A foundation. Covers cert-to-main, recipe-version, registry loader, R7-at-bake, determinism-hash.
- GROUND-TRUTH (2026-08-02): Phase A7 ledger lane DISPATCHED to background agent a89cbbe3bd5aae8e8 (Sonnet). One PR expected in ldt: performance fields on county_facet_coverage.

## OPEN
- OPEN: await engine-lane + ledger-lane PRs → verify each against live (not on agent word) → merge on green → GATE A.
- OPEN: A2 must be verified as the FULL 4-gate cert (not the partial r31-regrade) before it counts as "cert reproducible."
- OPEN: A6 — confirm timestamps actually excluded from content-hash (agent may find they already are).

## DEAD-END / TRAPS to watch (from memory)
- DEAD-END: merging on local-test-green ≠ CI green (ldt A7 has the hardcoded-list schema trap — CI authoritative).
- TRAP: :latest image-race on deploys (Phase B/C) — SHA-pin. Cloud Run traffic-trap — verify serving revision. describe-cache-lag — trust base-URL behavior.
- TRAP: shared-clone concurrent-commit — stage explicit paths; other agents commit in the shared clone.

## GUARDRAILS (planner enforces)
Merge only on green CI + head-SHA verify. Deploy SHA-pinned + serving-verified. Every warm block area-swept before next. Anti-fabrication + honest-absence. Failing gate STOPS the lane → fix root cause, never force. Block-13 QUARANTINED. Stop at R6.

## DEAD-END (2026-08-02): background general-purpose agents defer instead of executing heavy builds
Dispatched A3-A6 (engine) + A7 (ledger) to background Sonnet general-purpose agents. ALL returned "running in the background, I'll report back" with ZERO work done — no branches pushed, no PRs. 3/3 orphaned. This is the nested-agent-fan orphan trap: a coordinator-shaped agent that fans/defers and returns.
LESSON: for heavy multi-step BUILD work (schema+code+tests), background general-purpose dispatch is UNRELIABLE — the agent treats it as "set up a job" not "do it." Do heavy builds DIRECTLY (planner executes) or with a stricter "deliverable = pushed branch+PR, do it NOW, do not defer" contract. Mechanical single-step work (install a file, merge a verified branch) dispatches fine.
APPLIED: A1 (dispatch, worked — single-step file install) + A2 (direct, worked). A3-A6+A7 → build DIRECTLY.

## PHASE A CHECKPOINT (2026-08-02) — 6/7 lanes DONE + merged, A6 deferred
- GROUND-TRUTH (2026-08-02): A1 MERGED (fleet-memory ×5 repos). A2 MERGED (#203 cert script on main). A3 MERGED (#204 recipe_version, CI caught a type bug → fixed at root). A4 MERGED (#205 registry loader + Bastrop frozen row + TxGIO matrix in _land_records). A5 MERGED (#206 R7 at primitive bake, updated existing unmapped-adjacency test to R7 invariant). A7 MERGED (#374 ldt performance ledger fields, migration 0064; agent hand-back had a fixture-drift paren mismatch → I fixed + re-verified green).
- LESSON: verify-against-live-CI caught 2 real defects the local/agent checks missed: A3 envAtom intersection-type (needed recipeVersion? in the cast); A7 CHECK-constraint canonical-paren fixture drift (Postgres emits triple-paren). Both fixed at root, never forced.
- A6 DEFERRED (determinism content-hash): the 3 emitters hash sha256(JSON.stringify(instance)) INCLUDING extractedAt timestamps woven through readContract/consequence → two rewarms of same content hash differently. Real but LATENT (only bites at rewarm-compare, Phase C+). Delicate (touches atom identity/dedup semantics across 3 emitters + shared helper). Scoped as a CAREFUL follow-up, not rushed into a 7-lane session (operator: slow down / be a stickler). Design: a provenance-excluding canonical hash (strip extractedAt/warmAt/assembledAt/assertedAt/promotedAt), preserve different-content→different-hash. NEXT session or dedicated.
- GATE A: 6/7 foundation gaps closed. A6 is the one remaining determinism invariant (OPS-3 I2). Phase B (CC factory floor) + Phase C (Bastrop warm) still ahead. Checkpoint handed to operator.
