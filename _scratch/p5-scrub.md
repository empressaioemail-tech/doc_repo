# P5-SCRUB scratch (Wave 2)

OPEN 2026-08-31T14:35Z — Wave 2 P5-SCRUB (F-08). Fourteen S-families as walk grade extensions. Write and test only. No production scrub.

GROUND-TRUTH 2026-08-31T14:33Z — worktree `P:/seat-worktrees/property/hauska-factory-p5-scrub` branch `seat/property-ctx-p5-scrub` HEAD `3a0dc9a` (Factory #43). From origin/main.

GROUND-TRUTH 2026-08-31T14:20Z — `gradeRule` in `src/stages/grade/v-rules.mjs` PASSes when `evidence.pass === true && (meaningShaped || MEANING.has(ruleId))`. `meaningShaped` is a caller argument. Write-path read of `src/jobs/conformant.mjs` (~1072) passes `meaningShaped: true` as a literal. That is caller-declared internal consistency. Confirm by enumerating every call site before writing S-families. If confirmed, fixing the derivation is the first family.

LESSON — a standalone scrub script would be a fifth dormant mechanism. Families extend `RULE_IDS` / `verify-walk.mjs`.

OPEN — poison fixtures must stay; P4's exit gate needs them.

GROUND-TRUTH 2026-08-31T14:54Z — supervisor re-ran `node --test test/p5-scrub.test.mjs` → 50 pass 0 fail; publish/p1/reconcile → 96 pass 0 fail. HEAD `3a0dc9a` plus dirty tree. Family zero UNMEASURED on the literal. Walk sentinel situs fails S1.

LESSON — default-on walk seconds today are S1 (landing), S9 (unit-range table), S13 (provenance allowlist). The other eleven are invoked and UNMEASURED. That is starved input, not a skip.

OPEN — planner commit after operator go. Live S6/S7 readers and S4 geometry table wait on the next verify card.

GROUND-TRUTH 2026-08-31T14:49Z — family zero confirmed caller-declared. Call sites: conformant.mjs (literal true), reconcile-promote-write.test.mjs (literal true), f10-cad-loop.mjs (empty gradeCounty), v-rules gradeCounty forwarder. MEANING.has is not a second derivation. Fix: gradeRule PASSes only when two named observations from different sources agree. Literal `{evidence:{pass:true}, meaningShaped:true}` returns UNMEASURED (ran; saw UNMEASURED).

GROUND-TRUTH 2026-08-31T14:49Z — `node --test test/p5-scrub.test.mjs` cwd hauska-factory-p5-scrub: 50 pass 0 fail. Combined with publish + p1-controls + reconcile-promote-write: 146 pass 0 fail. HEAD still `3a0dc9a`. Poison fixtures `48021:__broken__` kept.

LESSON — PASS cannot be a caller flag. Two named sources, compared inside gradeRule. A static MEANING set is the same vacuity.

LESSON — S2b comparable projection is `{ distinct }`. gradeRule PASSes on equality; equal asOf and bakedAt is the defect.

DEAD-END — S1 as real-vs-absent (not only sentinel-vs-non-null-coverage) failed the Travis walk on `48453:610002` because the earlier tax-year row was `", ,"`. S1 applies only when coverage claims real. Two-tax-year landing map prefers the parseable situs (same rule as selectSweepParcels).

OPEN — live S6/S7 extra-reader fetchers and live S4 geometry table are not on this card (no production probe). Walk invokes the families; missing seconds are UNMEASURED. P4 keeps the poison fixtures.

GROUND-TRUTH 2026-08-31T15:44Z — S3 landUse (A1, null) is `KNOWN_OPEN` citing Gate 8 C3 (`_inbox/2026-08-31_gate8_live_1437_48021.json`, SHA `3a0dc9a`, 14:37Z) and Wave R / P7 as the clearing point. (A1, PDD) stays FAIL. Vocabulary was PASS/FAIL/UNMEASURED; it could not express this. `node --test test/p5-scrub.test.mjs` 55/0.

LESSON — C3's reason string is "internal consistency". Two fields from one facets payload. Same vacuity as family zero, one layer out. Do not split that payload into two S3 sources.

DEAD-END — Do not exempt landUse, compare only populated pairs, or downgrade S3 to a warning. Those convert C3 into a specification.

OPEN 2026-08-31T15:45Z — Wave R bake is the C3 clearing point (P7). C4 poison exists; fix is F-06. Do not merge #44 until operator says so. No production scrub.

GROUND-TRUTH 2026-08-31T16:55Z — C3 falsifier CONFIRMED. Payload both leaves `ZZ-NOT-A-CAD-CODE` → C3 PASS. A1 vs PDD both present also PASS. C3 does not consult anything outside the facets payload. Card was right.

LESSON — a green C3 after Wave R is "the payload is self-consistent," never "landUse is correct." Label shipped on `seat/property-ctx-c3-presence`. Second derivation is its own card. Do not start P-85 until this reports (this is the report).
