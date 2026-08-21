# SWEEP silent-fallback — planner scratch

## CP1 PRE-REGISTER (before workers returned)

- **runAt planned:** 2026-08-12
- **expectedFindings:** 15–25 across A–H (excluding known open symnum #4 as fix target)
- **highestDensityExpect:** legacy-design-tools (instrument/scorer/refresh/ledger layer) — NOT engine writers
- **why not obvious suspect:** last three pre-registered suspects were refuted; writers recently got Group A/B verify fixes; instrument layer is where confidence is manufactured from probes
- **secondExpect:** hauska-engine (classifiers + residual silent defaults in writers)
- **thirdExpect:** hauska-mcp-server (hardcoded DID lists — specimen #8 class)
- **methodCannotSee (planner a priori):** ternaries, early returns, default params, Zod `.catch()`/`.default()`, vacuous verify (in-memory object), tests that lock the same constant, semantic “deny as miss”

## WORKERS

- Engine: f571d7c4-77cf-407e-846b-9681c1078a3b (running)
- LDT: 7c64bf6c-6126-44b0-a9ec-66effd5bba7a (running)
- MCP: ab19d631-3742-4b9c-9e0b-fa7b8069bc30 (DONE)

## ADVERSARIAL NOTES (planner-owned — do not trust workers)

### MCP worker — first pass
- Confirmed SHA b5f26de matches planner's earlier rev-parse.
- Specimen #8 shape claimed — verifying independently via git show.
- Suspected overcount: map localKey 3-enum may be intentional product scope not silent-fallback; grade carefully.
- Dual-contract finding is real architecture debt but may be C-shape sibling not the exact "lookup miss → confident answer" — keep if it freezes family lists.
- access-deny as "No atom found" is EXACT mission shape — high priority if verified.
- Invented confidence 0.75/0.95 — exact mission shape if verified.
- Method blind spot admitted: unread catch handlers, docs/examples — good. "Full coverage" not claimed — good.

### CLOSED
- Engine worker DONE (f571d7c4) — 22 findings + REF-4; 12 writers all PK-verify
- LDT worker DONE (7c64bf6c) — instrument cluster; E1 residual confirmed; gateWarmCohort N/A
- MCP worker DONE (ab19d631) — specimen #8 + deny-as-miss + invented confidence
- Planner adversarial: SF-6 corrected; SHA drift re-verified; no fixes applied
- Close: `_inbox/2026-08-12_SWEEP_silent_fallback_audit.json` + `.md`

## LESSON
CP1 "obvious density = LDT instruments" was wrong for wouldShipWrongClaim; engine classifiers densest. Writer verify health ≠ classifier honesty. Grep that cannot see ternaries/Zod.default/vacuous-verify has the shape it hunts — state the blind spot in every sweep close.

## GROUND-TRUTH
- 2026-08-12: engine origin/main `44a1072`; LDT `48c4eb89`; MCP `b5f26de`
- All 12 write-*-county.mjs use `atom_did IN`; zero `body->>'atomDid' IN` on verify SQL
- symnum.ts still bare `return "producing"` / `return "oil"` on tip
