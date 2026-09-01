# p4-quarantine scratch (Tier 2)

Lane: P4-QUARANTINE. Plan rows F-11, F-06. Worktree `P:/tmp/hauska-engine-p4-quarantine` `feat/p4-quarantine` HEAD `76b13d1`.

## OPEN

- F1/F2/F4 store scans HELD until planner authorizes. Do not connect to hauska_mcp for those.
- McLennan quarantine not sound until F4.
- MCP ICC meter requested, not edited. Substrate seat.
- hauska-map PE + vendor drift: not this seat. PR #322 still OPEN (1bba1e3).
- Factory hold arm for setback/envelope: Factory seat. planWork iterates cad/geometry/flood only (hauska-factory-p4-rails src/control/plan.mjs:57).
- descriptor-fixture follow-up. Out of this disposition.
- write-setback-city.mjs CLI tests dropped in this clone: vitest SyntaxError on import (adapters exports map). SETBACK_APPLY_HELD unchanged in the script.

## GROUND-TRUTH

- 2026-08-31T19:12Z worktree `P:/tmp/hauska-engine-p4-quarantine` branch `feat/p4-quarantine` HEAD `76b13d161d2946ffc3b19b9d91b5c8eaeb6ab5d3`.
- 2026-08-31T19:28Z Factory `planWork` rails `["cad","geometry","flood"]` in hauska-factory-p4-rails `src/control/plan.mjs:57`.
- 2026-08-31T19:25Z hauska-map origin/main `7d43146` atom-chain-to-facets.ts 1549 lines, zero F-11 tokens. PR #322 OPEN `1bba1e3` 1628 lines, zero F-11 tokens. Engine vendor copy 847 lines with classifySetbackRuleAtom import. Pin `d3510a6`.
- 2026-08-31T19:20Z detector CLI clean; measure `--self-test` pass. Store: unmeasured.
- 2026-08-31T19:28Z unit tests: 17 engine-core + 1 retrieval passed.
- resolveAccessPolicyOrRefuse refuses only null/empty. No enum.
- atoms has no status/quarantine column.
- write-storage-port-proof writes a code-section, not a setback-rule; DEPLOY.md step 2 / Gate A.

## LESSON

- The Bastrop bake and the placeholder quarantine share `atom_did` PK. A city-plan throw on the first placeholder is a bake blocker, not a quarantine. Incoming named source supersedes; record the collision; continue.
- Instrument under-count (front-only) and McLennan range predicate are the same defect class: a query that answers a narrower question than its claim.
- A source-text detector must not fire on the Gate A code-section const. Scope is citing setback-rule writes. The runbook remint gap is declared, not closed by weakening Gate A.
- Windows `[IO.File]::WriteAllText` writes UTF-16. Do not use it to normalize LF.

## DEAD-END

- Do not propose access_policy=quarantined (mechanism B): writer accepts invented values; read filter then hides the atom.
- Do not propose body.status=retired for the placeholder cohort (mechanism C): retired means superseded / not served.
- Do not edit serving-sweep/vendor to "fix" PE serve. Report drift.
- Do not import write-setback-city.mjs from vitest in this clone; it throws SyntaxError. The 13 plan tests and 3 placeholder tests load via index.js and pass.

PLANNER REVIEW 2026-08-31T19:33Z — Accept partial. Re-read measure-setback-provenance.mjs (front/side/rear + atom_did prefix; F4 held). Re-read refuseSetbackQuarantines: PLACEHOLDER_COLLISION no longer throws; McLennan envelope still throws. classifySetbackRuleAtom already reads all three axes. Re-ran detector CLI clean, measure --self-test pass, 17 engine-core + 1 retrieval. Detector is quoted-literal only: property-atom-proof.ts cites STORAGE_PORT_PROOF_ATOM_DID on a setback-rule via identifier and does not fire. Declared as a starve, not a close of the remint gap. Dropped SETBACK_APPLY_HELD CLI tests stay leave_behind; writer-lease a199155 covers the refuse via spawn on a different tree. F1/F2/F4 still unrun. Do not authorize those scans from this review.

GROUND-TRUTH 2026-08-31T19:46Z — F1 on hauska_mcp 15s. Bastrop non-placeholder 7534 MATCH. Travis and Williamson unmeasured (statement_timeout). Published 188103/158573 UNMEASURED. Do not invent zeros. F2 Bastrop placeholder 1969 = 9503-7534. F4 McLennan 65814 envelopes, 0 cited setback DIDs, 0 PK resolve, verdict no-resolve.

GROUND-TRUTH 2026-08-31T19:58Z — engine #369 squash-merged 0e96e6a. CLI tests restored as spawn write-setback-city-cli.test.mjs. Detector starve, descriptor-fixture, vendor drift recorded in PR body. No atom mutation. No --apply setback.

GROUND-TRUTH 2026-08-31T22:02:15Z — A3 chunked F1 on hauska_mcp scored the two premises. placeholder 188103 stayed. nonPlaceholder 158573 stayed. Travis 22011/150702. Williamson 124499/0. Zero UNMEASURED ranges. Timeout 15s. Close `_inbox/2026-08-31_a3-f1-chunked_close.json`. F4 still held. SETBACK_APPLY_HELD unlifted.
